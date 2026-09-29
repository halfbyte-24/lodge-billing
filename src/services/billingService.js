import { supabase } from '../supabase';

export const saveBillToSupabase = async (billData, userId) => {
  try {
    const { guestDetails, billItems, discount, advancePaid, subtotal, discountAmount, netTotal, balanceDue } = billData;

    if (!guestDetails.name) throw new Error("Guest name is required.");
    if (!guestDetails.phone) throw new Error("Guest phone is required.");
    if (billItems.length === 0) throw new Error("At least one item must exist in the bill.");

    // 1. Find or create Guest
    let guestId;
    const { data: existingGuest } = await supabase
      .from('guests')
      .select('id')
      .eq('phone', guestDetails.phone)
      .maybeSingle();

    if (existingGuest) {
      guestId = existingGuest.id;
    } else {
      const { data: newGuest, error: guestError } = await supabase
        .from('guests')
        .insert([{
          full_name: guestDetails.name,
          phone: guestDetails.phone,
          address: guestDetails.address
        }])
        .select('id')
        .single();
      
      if (guestError) throw new Error(`Unable to save guest: ${guestError.message}`);
      guestId = newGuest.id;
    }

    // 2. Find or create Stay
    const roomItems = billItems.filter(i => i.type === 'Room');
    let stayId;
    let roomId = null;
    let roomRate = 0;

    if (roomItems.length > 0) {
      const roomItem = roomItems[0];
      roomId = roomItem.room_id || roomItem.id;
      
      console.log("SELECTED ROOM:", roomItem);
      console.log("ROOM UUID:", roomId);
      
      if (!roomId || typeof roomId !== 'string' || roomId.length < 32) {
        throw new Error("Invalid room ID. Room must come from Supabase rooms table with a valid UUID.");
      }

      roomRate = roomItem.price;

      const { data: existingStay } = await supabase
        .from('stays')
        .select('id')
        .eq('guest_id', guestId)
        .eq('room_id', roomId)
        .eq('status', 'active')
        .maybeSingle();

      if (existingStay) {
        stayId = existingStay.id;
      } else {
        const { data: newStay, error: stayError } = await supabase
          .from('stays')
          .insert([{
            guest_id: guestId,
            room_id: roomId,
            check_in_date: new Date().toISOString(),
            expected_checkout_date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
            number_of_guests: 1,
            room_rate: roomRate,
            status: 'active',
            created_by: userId
          }])
          .select('id')
          .single();
        if (stayError) {
          console.error("Stay creation error:", stayError);
          throw new Error(`Unable to create stay: ${stayError.message}`);
        }
        stayId = newStay.id;

        await supabase.from('rooms').update({ status: 'Occupied' }).eq('id', roomId);
      }
    } else {
      throw new Error("Please select a room before saving the bill.");
    }

    // 3. Insert Charges
    for (const item of billItems) {
      let chargeType = 'custom';
      if (item.type === 'Room') chargeType = 'room';
      else if (item.type === 'Food' || item.type === 'Drink') chargeType = 'restaurant';
      else if (item.type === 'Service') chargeType = 'service';

      const { error: chargeError } = await supabase
        .from('charges')
        .insert([{
          stay_id: stayId,
          charge_type: chargeType,
          description: item.name,
          quantity: item.qty,
          unit_price: item.price,
          total_amount: item.price * item.qty,
          created_by: userId
        }]);
      
      if (chargeError) throw new Error(`Unable to save charges: ${chargeError.message}`);
    }

    // 4. Insert Discount
    if (discountAmount > 0) {
      const { error: discountError } = await supabase
        .from('discounts')
        .insert([{
          stay_id: stayId,
          amount: discountAmount,
          reason: 'Applied during POS billing',
          applied_by: userId
        }]);
      if (discountError) throw new Error(`Unable to save discount: ${discountError.message}`);
    }

    // 5. Insert Advance Payment if any
    if (advancePaid > 0) {
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([{
          stay_id: stayId,
          amount: advancePaid,
          payment_method: 'Cash',
          note: 'Advance Payment',
          received_by: userId
        }]);
      if (paymentError) throw new Error(`Unable to process payment: ${paymentError.message}`);
    }

    return { success: true, stayId, roomId };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
};

export const checkoutAndGenerateInvoice = async (stayId, roomId, paymentAmount, paymentMethod, billData, userId) => {
  try {
    const { subtotal, discountAmount, netTotal, balanceDue } = billData;

    // 1. Process Final Payment
    if (paymentAmount > 0) {
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([{
          stay_id: stayId,
          amount: paymentAmount,
          payment_method: paymentMethod,
          note: 'Final Checkout Payment',
          received_by: userId
        }]);
      if (paymentError) throw new Error(`Unable to process payment: ${paymentError.message}`);
    }

    // 2. Generate Invoice Number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const invoiceNumber = `INV-${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert([{
        invoice_number: invoiceNumber,
        stay_id: stayId,
        subtotal,
        discount_total: discountAmount,
        net_total: netTotal,
        paid_total: billData.advancePaid + paymentAmount,
        balance_due: Math.max(0, balanceDue - paymentAmount),
        generated_by: userId
      }])
      .select('id, invoice_number')
      .single();
    if (invoiceError) throw new Error(`Unable to generate invoice: ${invoiceError.message}`);

    // 3. Update Stay & Room
    const newBalance = Math.max(0, balanceDue - paymentAmount);
    if (newBalance === 0) {
      await supabase
        .from('stays')
        .update({ status: 'checked_out', actual_checkout_date: new Date().toISOString() })
        .eq('id', stayId);

      if (roomId) {
        await supabase
          .from('rooms')
          .update({ status: 'Cleaning' })
          .eq('id', roomId);
      }
    }

    return { success: true, invoiceId: invoiceData.id, invoiceNumber: invoiceData.invoice_number };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
};
