import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { useAuth } from '../../contexts/AuthContext';
import { X } from 'lucide-react';

const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          id, invoice_number, net_total, paid_total, balance_due, finalized_at, stay_id,
          stays ( id, status, room_id, guests(full_name), rooms(room_number) )
        `)
        .order('finalized_at', { ascending: false });
      
      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN') + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const handleCheckoutClick = (inv) => {
    setSelectedInvoice(inv);
    setPaymentAmount(inv.balance_due);
    setShowPaymentModal(true);
  };

  const confirmPayment = async () => {
    try {
      setProcessingPayment(true);
      const stayId = selectedInvoice.stay_id;
      const roomId = selectedInvoice.stays?.room_id;
      const newPaidTotal = selectedInvoice.paid_total + Number(paymentAmount);
      const newBalance = Math.max(0, selectedInvoice.balance_due - Number(paymentAmount));

      // 1. Insert Payment
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([{
          stay_id: stayId,
          amount: Number(paymentAmount),
          payment_method: paymentMethod,
          note: 'Post-Invoice Checkout Payment',
          received_by: user?.id
        }]);
      if (paymentError) throw paymentError;

      // 2. Update Invoice
      const { error: invoiceError } = await supabase
        .from('invoices')
        .update({
          paid_total: newPaidTotal,
          balance_due: newBalance
        })
        .eq('id', selectedInvoice.id);
      if (invoiceError) throw invoiceError;

      // 3. Close Stay and Room if balance is 0
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

      setShowPaymentModal(false);
      fetchInvoices();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed: " + error.message);
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Billing History</h2>
          <p className="page-subtitle">View and print past invoices</p>
        </div>
      </div>

      <div className="item-card" style={{ padding: '1rem', overflowX: 'auto' }}>
        {loading ? (
          <div>Loading billing history...</div>
        ) : invoices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No invoices found.</div>
        ) : (
          <table className="bill-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Date</th>
                <th>Total (₹)</th>
                <th>Paid (₹)</th>
                <th>Balance (₹)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => {
                const guestName = inv.stays?.guests?.full_name || 'Walk-in';
                const roomNo = inv.stays?.rooms?.room_number || 'N/A';
                const status = inv.balance_due <= 0 ? 'Paid' : 'Pending';

                return (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 500 }}>{inv.invoice_number}</td>
                    <td>{guestName}</td>
                    <td>{roomNo}</td>
                    <td>{formatDate(inv.finalized_at)}</td>
                    <td>{inv.net_total.toFixed(2)}</td>
                    <td style={{ color: '#10b981' }}>{inv.paid_total.toFixed(2)}</td>
                    <td style={{ color: inv.balance_due > 0 ? '#ef4444' : 'inherit' }}>{inv.balance_due.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${status === 'Paid' ? 'available' : 'occupied'}`}>{status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                          onClick={() => navigate(`/admin/billing/invoice/${inv.id}`)}
                        >
                          View / Print
                        </button>
                        {inv.balance_due > 0 && (
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: '#10b981', borderColor: '#10b981' }}
                            onClick={() => handleCheckoutClick(inv)}
                          >
                            Checkout
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Payment - {selectedInvoice.invoice_number}</h3>
              <button onClick={() => setShowPaymentModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Total Amount:</span>
                <strong>₹{selectedInvoice.net_total.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Already Paid:</span>
                <strong>₹{selectedInvoice.paid_total.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', fontWeight: 'bold' }}>
                <span>Balance Due:</span>
                <span>₹{selectedInvoice.balance_due.toFixed(2)}</span>
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
              <button className="btn btn-primary generate-btn" style={{ flex: 1 }} onClick={confirmPayment} disabled={processingPayment}>
                {processingPayment ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
