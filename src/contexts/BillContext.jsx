import React, { createContext, useContext, useState } from "react";

const BillContext = createContext(null);

export const BillProvider = ({ children }) => {
  const [billItems, setBillItems] = useState([]);

  const [guestDetails, setGuestDetails] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [discount, setDiscount] = useState({
    type: "amount",
    value: 0,
  });

  const [taxes, setTaxes] = useState({
    gst: 0,
    sgst: 0,
    cgst: 0
  });
  const [advancePaid, setAdvancePaid] = useState(0);

  // Add item to current bill
  const addItemToBill = (item, type) => {
    setBillItems((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.type === type
      );

      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.type === type
            ? {
                ...i,
                qty: i.qty + 1,
              }
            : i
        );
      }

      return [
        ...prev,
        {
          ...item,

          // Keep the REAL Supabase ID
          id: item.id,

          // Keep room UUID separately as well
          room_id:
            (type === "room" || type === "Room")
              ? item.roomId || item.room_id || item.id
              : item.roomId || item.room_id || null,

          type,
          qty: 1,
        },
      ];
    });
  };

  // Remove item
  const removeItem = (id, type) => {
    setBillItems((prev) =>
      prev.filter((item) => !(item.id === id && item.type === type))
    );
  };

  // Increase / decrease quantity
  const updateQuantity = (id, type, delta) => {
    setBillItems((prev) =>
      prev.map((item) => {
        if (item.id === id && item.type === type) {
          const newQty = Math.max(1, item.qty + delta);

          return {
            ...item,
            qty: newQty,
          };
        }

        return item;
      })
    );
  };

  // Clear complete bill
  const clearBill = () => {
    setBillItems([]);

    setGuestDetails({
      name: "",
      phone: "",
      email: "",
      address: "",
    });

    setDiscount({
      type: "amount",
      value: 0,
    });

    setTaxes({ gst: 0, sgst: 0, cgst: 0 });
    setAdvancePaid(0);
  };

  // -----------------------------
  // BILL CALCULATIONS
  // -----------------------------

  const subtotal = billItems.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 1;

    return total + price * qty;
  }, 0);

  const discountValue = Number(discount.value) || 0;

  let discountAmount = 0;

  if (discount.type === "amount") {
    discountAmount = Math.min(discountValue, subtotal);
  } else {
    discountAmount = Math.min(
      subtotal,
      (subtotal * discountValue) / 100
    );
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);

  const gstValue = Number(taxes.gst) || 0;
  const sgstValue = Number(taxes.sgst) || 0;
  const cgstValue = Number(taxes.cgst) || 0;

  const gstAmount = taxableAmount * (gstValue / 100);
  const sgstAmount = taxableAmount * (sgstValue / 100);
  const cgstAmount = taxableAmount * (cgstValue / 100);

  const totalTaxAmount = gstAmount + sgstAmount + cgstAmount;

  const totalAmount = taxableAmount + totalTaxAmount;

  const advance = Number(advancePaid) || 0;

  const balance = Math.max(0, totalAmount - advance);

  return (
    <BillContext.Provider
      value={{
        // Items
        billItems,
        addItemToBill,
        removeItem,
        updateQuantity,
        clearBill,

        // Guest
        guestDetails,
        setGuestDetails,

        // Discount
        discount,
        setDiscount,
        discountAmount,

        // Tax
        taxes,
        setTaxes,
        gstAmount,
        sgstAmount,
        cgstAmount,
        totalTaxAmount,

        // Payment
        advancePaid,
        setAdvancePaid,

        // Totals
        subtotal,
        totalAmount,
        balance,
      }}
    >
      {children}
    </BillContext.Provider>
  );
};

export const useBill = () => {
  const context = useContext(BillContext);

  if (!context) {
    throw new Error(
      "useBill must be used inside a BillProvider"
    );
  }

  return context;
};