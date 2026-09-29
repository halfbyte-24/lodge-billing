import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import '../../styles/InvoicePrint.css';

const InvoicePreview = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [invoice, setInvoice] = useState(null);
  const [hotelSettings, setHotelSettings] = useState(null);
  const [groupedCharges, setGroupedCharges] = useState([]);
  const [stayData, setStayData] = useState(null);

  useEffect(() => {
    fetchInvoiceData();
  }, [id]);

  const fetchInvoiceData = async () => {
    try {
      setLoading(true);

      // Fetch Hotel Settings
      const { data: settings } = await supabase.from('hotel_settings').select('*').limit(1).single();
      setHotelSettings(settings);

      // Fetch Invoice with Stay and Guest
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select(`
          *,
          stays (
            *,
            guests (*),
            rooms (room_number)
          )
        `)
        .eq('id', id)
        .single();
      
      if (invoiceError) throw invoiceError;
      setInvoice(invoiceData);
      setStayData(invoiceData.stays);

      // Fetch Charges
      const { data: charges } = await supabase
        .from('charges')
        .select('*')
        .eq('stay_id', invoiceData.stay_id);
      
      // Group charges
      const groups = {
        'Lodging charges': 0,
        'Dining charges': 0,
        'Service charges': 0,
        'Other': 0
      };

      charges?.forEach(charge => {
        if (charge.charge_type === 'room') groups['Lodging charges'] += charge.total_amount;
        else if (charge.charge_type === 'restaurant') groups['Dining charges'] += charge.total_amount;
        else if (charge.charge_type === 'service') groups['Service charges'] += charge.total_amount;
        else groups['Other'] += charge.total_amount;
      });

      const formattedGroups = Object.entries(groups)
        .filter(([_, amount]) => amount > 0)
        .map(([name, amount]) => ({ name, amount }));

      setGroupedCharges(formattedGroups);

    } catch (error) {
      console.error("Error fetching invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Invoice...</div>;
  if (!invoice) return <div style={{ padding: '2rem', textAlign: 'center' }}>Invoice not found</div>;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN');
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate days
  const checkIn = new Date(stayData.check_in_date);
  const checkOut = stayData.actual_checkout_date ? new Date(stayData.actual_checkout_date) : new Date(stayData.expected_checkout_date);
  const diffTime = Math.abs(checkOut - checkIn);
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) diffDays = 1;

  return (
    <div className="invoice-wrapper">
      <div className="invoice-actions">
        <button className="btn btn-outline" onClick={() => navigate('/admin/billing')}>Back to Billing</button>
        <button className="btn btn-primary" onClick={handlePrint}>Print Invoice</button>
      </div>

      <div className="invoice-paper">
        <div className="invoice-top-bar">
          <div>Bill / Cash Memo</div>
          <div>No: {invoice.invoice_number}</div>
          <div>Date: {formatDate(invoice.finalized_at)}</div>
        </div>

        <div className="invoice-hotel-header">
          {hotelSettings?.logo_url ? (
            <img src={hotelSettings.logo_url} alt="Hotel Logo" style={{ maxHeight: '80px' }} />
          ) : (
            <h1 className="hotel-title">{hotelSettings?.hotel_name || 'HOTEL PARK'}</h1>
          )}
          <div className="hotel-subtitle">Since 1972</div>
          <div className="hotel-address">
            {hotelSettings?.address || 'City Center, Main Road'}<br/>
            Phone: {hotelSettings?.phone || '+91 0000000000'} | Email: {hotelSettings?.email || 'info@hotel.com'}
          </div>
        </div>

        <div className="guest-info-grid">
          <div className="info-row"><div className="info-label">Name:</div><div className="info-value">{stayData.guests?.full_name}</div></div>
          <div className="info-row"><div className="info-label">Room No:</div><div className="info-value">{stayData.rooms?.room_number || 'N/A'}</div></div>
          
          <div className="info-row"><div className="info-label">Date of Arrival:</div><div className="info-value">{formatDate(stayData.check_in_date)}</div></div>
          <div className="info-row"><div className="info-label">Rate Rs:</div><div className="info-value">{stayData.room_rate}</div></div>
          
          <div className="info-row"><div className="info-label">Time of Arrival:</div><div className="info-value">{formatTime(stayData.check_in_date)}</div></div>
          <div className="info-row"><div className="info-label">For:</div><div className="info-value">{diffDays} days</div></div>
          
          <div className="info-row"><div className="info-label">Date of Departure:</div><div className="info-value">{formatDate(stayData.actual_checkout_date || stayData.expected_checkout_date)}</div></div>
          <div className="info-row"><div className="info-label">Phone:</div><div className="info-value">{stayData.guests?.phone}</div></div>

          <div className="info-row"><div className="info-label">Time of Departure:</div><div className="info-value">{formatTime(stayData.actual_checkout_date || stayData.expected_checkout_date)}</div></div>
          <div className="info-row"><div className="info-label">No. of Persons:</div><div className="info-value">{stayData.number_of_guests}</div></div>
        </div>

        <table className="particulars-table">
          <thead>
            <tr>
              <th>PARTICULARS</th>
              <th className="amount-col">Amount (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            {groupedCharges.map((group, index) => (
              <tr key={index}>
                <td>{group.name}</td>
                <td className="amount-col">{group.amount.toFixed(2)}</td>
              </tr>
            ))}
            
            {/* Empty rows to make it look like a printed pad */}
            {[...Array(Math.max(0, 5 - groupedCharges.length))].map((_, i) => (
              <tr key={`empty-${i}`}>
                <td>&nbsp;</td>
                <td className="amount-col">&nbsp;</td>
              </tr>
            ))}

            <tr className="total-row">
              <td>Subtotal</td>
              <td className="amount-col">{invoice.subtotal.toFixed(2)}</td>
            </tr>
            {invoice.discount_total > 0 && (
              <tr>
                <td>Discount</td>
                <td className="amount-col">-{invoice.discount_total.toFixed(2)}</td>
              </tr>
            )}
            <tr className="total-row">
              <td>Net Total</td>
              <td className="amount-col">{invoice.net_total.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Paid Amount</td>
              <td className="amount-col">{invoice.paid_total.toFixed(2)}</td>
            </tr>
            <tr className="total-row">
              <td>Balance Due</td>
              <td className="amount-col">{invoice.balance_due.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div className="signatures-section">
          <div className="signature-box">
            <div className="signature-line"></div>
            <div>Guest's signature</div>
          </div>
          <div className="signature-box" style={{ textAlign: 'center' }}>
            <div>Received with Thanks</div>
            <div style={{ marginTop: '10px', fontStyle: 'italic' }}>Do Visit Again</div>
          </div>
          <div className="signature-box">
            <div className="signature-line"></div>
            <div>For {hotelSettings?.hotel_name || 'HOTEL PARK'}</div>
          </div>
        </div>

        <div className="footer-notes">
          Note:<br/>
          1. Check out timing: 12:00 PM.<br/>
          2. Please return the key for room service.
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
