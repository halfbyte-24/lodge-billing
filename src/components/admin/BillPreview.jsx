import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBill } from '../../contexts/BillContext';
import { useAuth } from '../../contexts/AuthContext';
import { saveBillToSupabase, checkoutAndGenerateInvoice } from '../../services/billingService';
import { Trash2, Plus, Minus, X } from 'lucide-react';
import FullBillPreview from './FullBillPreview';

const BillPreview = () => {
  const { 
    billItems, guestDetails, setGuestDetails, discount, setDiscount, 
    taxes, setTaxes, advancePaid, setAdvancePaid,
    removeItem, updateQuantity, clearBill,
    subtotal, discountAmount, gstAmount, sgstAmount, cgstAmount, totalTaxAmount, totalAmount, balance 
  } = useBill();
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [savedStayInfo, setSavedStayInfo] = useState(null);

  // Modals State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  
  // Payment State
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentNote, setPaymentNote] = useState('');

  const hasRoom = billItems.some(i => i.type === 'Room');

  const handleSaveBill = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!hasRoom) {
      setError("Please select a room to save this bill.");
      setLoading(false);
      return;
    }

    const billData = {
      guestDetails,
      billItems,
      discount,
      advancePaid,
      subtotal,
      discountAmount,
      netTotal: totalAmount,
      balanceDue: balance
    };

    const result = await saveBillToSupabase(billData, user?.id);
    
    if (result.success) {
      setSuccess("Bill saved successfully.");
      setSavedStayInfo({ stayId: result.stayId, roomId: result.roomId });
    } else {
      setError(result.error || "Unable to save charges.");
    }
    
    setLoading(false);
  };

  const handleCheckout = () => {
    if (!savedStayInfo) {
      setError("Please save the bill first before checking out.");
      return;
    }
    setPaymentAmount(balance);
    setShowPaymentModal(true);
  };

  const confirmPayment = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    const billData = {
      subtotal,
      discountAmount,
      netTotal: totalAmount,
      balanceDue: balance,
      advancePaid
    };

    const result = await checkoutAndGenerateInvoice(
      savedStayInfo.stayId, 
      savedStayInfo.roomId, 
      Number(paymentAmount), 
      paymentMethod, 
      billData, 
      user?.id
    );

    if (result.success) {
      setSuccess("Checkout completed successfully.");
      setShowPaymentModal(false);
      
      // Navigate to printable invoice view
      navigate(`/admin/billing/invoice/${result.invoiceId}`, { state: { invoiceNumber: result.invoiceNumber }});
      clearBill();
      setSavedStayInfo(null);
    } else {
      setError(result.error || "Unable to process payment.");
    }
    
    setLoading(false);
  };

  return (
    <div className="bill-preview-panel" style={{ position: 'relative', overflowX: 'hidden' }}>
      <div className="bill-header">
        <h3>Current Bill</h3>
        <button className="clear-btn" onClick={() => { clearBill(); setSavedStayInfo(null); setSuccess(null); setError(null); }}>Clear All</button>
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>{error}</div>}
      {success && <div style={{ background: '#dcfce7', color: '#10b981', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>{success}</div>}

      <div className="guest-section">
        <input 
          type="text" 
          placeholder="Guest Name *" 
          value={guestDetails.name}
          onChange={(e) => setGuestDetails({...guestDetails, name: e.target.value})}
        />
        <input 
          type="text" 
          placeholder="Phone Number *" 
          value={guestDetails.phone}
          onChange={(e) => setGuestDetails({...guestDetails, phone: e.target.value})}
        />
      </div>

      <div className="bill-items" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: '150px', maxHeight: '420px', padding: '1rem' }}>
        {billItems.length === 0 ? (
          <div className="empty-bill">No items added to bill</div>
        ) : (
          <table className="bill-table" style={{ width: '100%', tableLayout: 'auto', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem', width: '35%' }}>Item</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Type</th>
                <th style={{ textAlign: 'center', padding: '0.5rem' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: '0.5rem' }}>Price</th>
                <th style={{ textAlign: 'right', padding: '0.5rem' }}>Total</th>
                <th style={{ textAlign: 'center', padding: '0.5rem' }}>X</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map(item => (
                <tr key={`${item.type}-${item.id}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.5rem', wordWrap: 'break-word', whiteSpace: 'normal', overflowWrap: 'anywhere' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1e293b' }}>{item.name || `Room ${item.number}`}</div>
                  </td>
                  <td style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                    {item.type}
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <div className="qty-controls" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                      <button style={{ width: '20px', height: '20px', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => updateQuantity(item.id, item.type, -1)}><Minus size={12}/></button>
                      <span style={{ fontSize: '0.85rem', minWidth: '15px', textAlign: 'center' }}>{item.qty}</span>
                      <button style={{ width: '20px', height: '20px', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => updateQuantity(item.id, item.type, 1)}><Plus size={12}/></button>
                    </div>
                  </td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', fontSize: '0.85rem' }}>
                    ₹{item.price}
                  </td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', fontSize: '0.85rem', fontWeight: 500 }}>
                    ₹{item.price * item.qty}
                  </td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                    <button className="delete-btn" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} onClick={() => removeItem(item.id, item.type)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bill-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        
        <div className="summary-row controls-row">
          <span>Discount (₹)</span>
          <input 
            type="number" 
            value={discount.value} 
            onChange={(e) => setDiscount({ type: 'amount', value: Number(e.target.value) || 0 })} 
          />
        </div>

        <div className="summary-row controls-row">
          <span>GST (%)</span>
          <input 
            type="number" 
            value={taxes.gst} 
            onChange={(e) => setTaxes({ ...taxes, gst: Number(e.target.value) || 0 })} 
          />
        </div>
        
        <div className="summary-row controls-row">
          <span>SGST (%)</span>
          <input 
            type="number" 
            value={taxes.sgst} 
            onChange={(e) => setTaxes({ ...taxes, sgst: Number(e.target.value) || 0 })} 
          />
        </div>
        
        <div className="summary-row controls-row">
          <span>CGST (%)</span>
          <input 
            type="number" 
            value={taxes.cgst} 
            onChange={(e) => setTaxes({ ...taxes, cgst: Number(e.target.value) || 0 })} 
          />
        </div>
        
        <div className="summary-row controls-row">
          <span>Advance Paid</span>
          <input 
            type="number" 
            value={advancePaid} 
            onChange={(e) => setAdvancePaid(Number(e.target.value) || 0)} 
          />
        </div>

        <div className="summary-row total-row">
          <span>Balance Due</span>
          <span>₹{balance.toFixed(2)}</span>
        </div>
      </div>

      <div className="bill-actions" style={{ flexDirection: 'column', padding: '1rem' }}>
        <button 
          className="btn btn-outline" 
          onClick={() => setShowFullPreview(true)} 
          style={{ width: '100%', marginBottom: '0.5rem', background: '#f8fafc' }}
        >
          Preview Bill
        </button>
        <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
          <button 
            className="btn btn-outline" 
            onClick={handleSaveBill} 
            disabled={loading || savedStayInfo}
            style={{ flex: 1, padding: '0.5rem' }}
          >
            {loading ? 'Saving...' : savedStayInfo ? 'Saved' : 'Save Bill'}
          </button>
          <button 
            className="btn btn-primary generate-btn" 
            onClick={handleCheckout}
            disabled={loading || !savedStayInfo}
            style={{ flex: 1, padding: '0.5rem' }}
          >
            Checkout
          </button>
        </div>
      </div>

      {/* Full Bill Preview Modal */}
      {showFullPreview && (
        <FullBillPreview 
          billItems={billItems}
          guestDetails={guestDetails}
          subtotal={subtotal}
          discountAmount={discountAmount}
          taxes={{ gst: gstAmount, sgst: sgstAmount, cgst: cgstAmount }}
          netTotal={totalAmount}
          advancePaid={advancePaid}
          balance={balance}
          onClose={() => setShowFullPreview(false)}
          onSave={() => { setShowFullPreview(false); handleSaveBill(); }}
          onCheckout={() => { setShowFullPreview(false); handleCheckout(); }}
          loading={loading}
          savedStayInfo={savedStayInfo}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Total Amount:</span>
                <strong>₹{totalAmount.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Already Paid:</span>
                <strong>₹{advancePaid.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', fontWeight: 'bold' }}>
                <span>Balance Due:</span>
                <span>₹{balance.toFixed(2)}</span>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
              <label>Payment Amount</label>
              <input 
                type="number" 
                value={paymentAmount} 
                onChange={(e) => setPaymentAmount(e.target.value)} 
                style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
              <label>Payment Method</label>
              <select 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowPaymentModal(false)}>Cancel</button>
              <button className="btn btn-primary generate-btn" style={{ flex: 1 }} onClick={confirmPayment} disabled={loading}>
                {loading ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillPreview;
