import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import '../../styles/InvoicePrint.css';

const FullBillPreview = ({ 
  billItems, 
  guestDetails, 
  subtotal, 
  discountAmount, 
  taxes,
  netTotal, 
  advancePaid, 
  balance,
  onClose,
  onSave,
  onCheckout,
  loading,
  savedStayInfo
}) => {
  const [hotelSettings, setHotelSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: settings } = await supabase.from('hotel_settings').select('*').limit(1).single();
      setHotelSettings(settings);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Extract Room info if available
  const roomItems = billItems.filter(i => i.type === 'Room');
  const roomNo = roomItems.length > 0 ? roomItems[0].name.split('-')[0].trim().replace('Room ', '') : 'N/A';
  const roomRate = roomItems.length > 0 ? roomItems[0].price : 0;

  // Group items
  const groups = {
    'Lodging charges': [],
    'Dining charges': [],
    'Drinks': [],
    'Services': [],
    'Other': []
  };

  billItems.forEach(item => {
    if (item.type === 'Room') groups['Lodging charges'].push(item);
    else if (item.type === 'Food') groups['Dining charges'].push(item);
    else if (item.type === 'Drink') groups['Drinks'].push(item);
    else if (item.type === 'Service') groups['Services'].push(item);
    else groups['Other'].push(item);
  });

  const currentDate = new Date().toLocaleDateString('en-IN');
  const currentTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1050, overflowY: 'auto', padding: '2rem 1rem' }}>
      <div className="preview-modal-content" style={{ background: '#f1f5f9', width: '100%', maxWidth: '210mm', padding: '1rem', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
        
        {/* Preview Actions - Not printed */}
        <div className="invoice-actions" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={onClose}>Close / Edit Bill</button>
          <button className="btn btn-outline" onClick={handlePrint}>Print Bill</button>
          <button className="btn btn-primary" onClick={onSave} disabled={loading || savedStayInfo}>
            {loading ? 'Saving...' : savedStayInfo ? 'Saved' : 'Save Bill'}
          </button>
          <button className="btn btn-primary" style={{ background: '#10b981' }} onClick={onCheckout} disabled={loading || !savedStayInfo}>
            Checkout & Pay
          </button>
        </div>

        {/* The Paper Bill */}
        <div className="invoice-paper" style={{ margin: '0 auto', background: 'white' }}>
          <div className="invoice-top-bar">
            <div>BILL / CASH MEMO</div>
            <div>No: PREVIEW</div>
            <div>Date: {currentDate}</div>
          </div>

          <div className="invoice-hotel-header">
            {hotelSettings?.logo_url ? (
              <img src={hotelSettings.logo_url} alt="Hotel Logo" style={{ maxHeight: '80px' }} />
            ) : (
              <h1 className="hotel-title">{hotelSettings?.hotel_name || 'HOTEL PARK'}</h1>
            )}
            <div className="hotel-subtitle">Stay Comfortable • Dine Deliciously</div>
            <div className="hotel-address">
              {hotelSettings?.address || 'City Center, Main Road'}<br/>
              Phone: {hotelSettings?.phone || '+91 0000000000'} | Email: {hotelSettings?.email || 'info@hotel.com'}
            </div>
          </div>

          <div className="guest-info-grid">
            <div className="info-row"><div className="info-label">Name:</div><div className="info-value">{guestDetails.name || 'N/A'}</div></div>
            <div className="info-row"><div className="info-label">Room No:</div><div className="info-value">{roomNo}</div></div>
            
            <div className="info-row"><div className="info-label">Date of Arrival:</div><div className="info-value">{guestDetails.checkInDate || currentDate}</div></div>
            <div className="info-row"><div className="info-label">Rate Rs:</div><div className="info-value">{roomRate || 'N/A'}</div></div>
            
            <div className="info-row"><div className="info-label">Time of Arrival:</div><div className="info-value">{guestDetails.checkInTime || currentTime}</div></div>
            <div className="info-row"><div className="info-label">For:</div><div className="info-value">{guestDetails.days || 1} Days</div></div>
            
            <div className="info-row"><div className="info-label">Date of Departure:</div><div className="info-value">{guestDetails.checkOutDate || currentDate}</div></div>
            <div className="info-row"><div className="info-label">Phone:</div><div className="info-value">{guestDetails.phone || 'N/A'}</div></div>

            <div className="info-row"><div className="info-label">Time of Departure:</div><div className="info-value">{guestDetails.checkOutTime || currentTime}</div></div>
            <div className="info-row"><div className="info-label">No. of Persons:</div><div className="info-value">{guestDetails.guestsCount || 1}</div></div>
          </div>

          <table className="particulars-table">
            <thead>
              <tr>
                <th>PARTICULARS</th>
                <th className="amount-col">AMOUNT (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {/* Rooms */}
              {groups['Lodging charges'].length > 0 && (
                <>
                  <tr style={{ background: '#f8fafc' }}><td colSpan="2" style={{ fontWeight: 'bold' }}>Lodging charges</td></tr>
                  {groups['Lodging charges'].map(item => (
                    <tr key={item.id}>
                      <td style={{ paddingLeft: '20px' }}>{item.name} × {item.qty}</td>
                      <td className="amount-col">{(item.price * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </>
              )}

              {/* Food */}
              {groups['Dining charges'].length > 0 && (
                <>
                  <tr style={{ background: '#f8fafc' }}><td colSpan="2" style={{ fontWeight: 'bold' }}>Dining charges</td></tr>
                  {groups['Dining charges'].map(item => (
                    <tr key={item.id}>
                      <td style={{ paddingLeft: '20px' }}>{item.name} × {item.qty}</td>
                      <td className="amount-col">{(item.price * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </>
              )}

              {/* Drinks */}
              {groups['Drinks'].length > 0 && (
                <>
                  <tr style={{ background: '#f8fafc' }}><td colSpan="2" style={{ fontWeight: 'bold' }}>Drinks</td></tr>
                  {groups['Drinks'].map(item => (
                    <tr key={item.id}>
                      <td style={{ paddingLeft: '20px' }}>{item.name} × {item.qty}</td>
                      <td className="amount-col">{(item.price * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </>
              )}

              {/* Services */}
              {groups['Services'].length > 0 && (
                <>
                  <tr style={{ background: '#f8fafc' }}><td colSpan="2" style={{ fontWeight: 'bold' }}>Services</td></tr>
                  {groups['Services'].map(item => (
                    <tr key={item.id}>
                      <td style={{ paddingLeft: '20px' }}>{item.name} × {item.qty}</td>
                      <td className="amount-col">{(item.price * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </>
              )}

              {/* Empty rows to stretch */}
              {[...Array(Math.max(0, 3 - billItems.length))].map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td>&nbsp;</td>
                  <td className="amount-col">&nbsp;</td>
                </tr>
              ))}

              <tr className="total-row">
                <td>Subtotal</td>
                <td className="amount-col">{subtotal.toFixed(2)}</td>
              </tr>
              {discountAmount > 0 && (
                <tr>
                  <td>Discount</td>
                  <td className="amount-col">-{discountAmount.toFixed(2)}</td>
                </tr>
              )}
              {taxes?.gst > 0 && (
                <tr>
                  <td>GST</td>
                  <td className="amount-col">{taxes.gst.toFixed(2)}</td>
                </tr>
              )}
              {taxes?.sgst > 0 && (
                <tr>
                  <td>SGST</td>
                  <td className="amount-col">{taxes.sgst.toFixed(2)}</td>
                </tr>
              )}
              {taxes?.cgst > 0 && (
                <tr>
                  <td>CGST</td>
                  <td className="amount-col">{taxes.cgst.toFixed(2)}</td>
                </tr>
              )}
              <tr className="total-row">
                <td>Net Total</td>
                <td className="amount-col">{netTotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Paid Amount</td>
                <td className="amount-col">{advancePaid.toFixed(2)}</td>
              </tr>
              <tr className="total-row">
                <td>Balance Due</td>
                <td className="amount-col">{balance.toFixed(2)}</td>
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
    </div>
  );
};

export default FullBillPreview;
