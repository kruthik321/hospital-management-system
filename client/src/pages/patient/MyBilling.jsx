import { useState, useEffect } from 'react';
import { billingAPI } from '../../services/api';
import { LoadingSpinner, StatusBadge } from '../../components/common/Components';
import { CreditCard, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyBilling() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [payForm, setPayForm] = useState({ amount: '', paymentMethod: 'CARD' });

  useEffect(() => { load(); }, []);
  const load = async () => { try { const r = await billingAPI.getAll({ limit: 50 }); setBills(r.data.data); } catch {} setLoading(false); };

  const handlePay = async () => {
    if (!payForm.amount) return toast.error('Enter amount');
    try {
      await billingAPI.pay(selected.id, { amount: payForm.amount, paymentMethod: payForm.paymentMethod, transactionId: `TXN${Date.now()}` });
      toast.success('Payment successful! ✓');
      setSelected(null);
      load();
    } catch { toast.error('Payment failed'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div><h1 className="page-header">My Billing</h1><p className="page-subtitle">View and pay your hospital bills</p>
      <div className="space-y-3">
        {bills.map(b => {
          const paid = b.payments?.reduce((s, p) => s + p.amount, 0) || 0;
          const due = b.netAmount - paid;
          return (
            <div key={b.id} className="card p-5 hover:-translate-y-0.5 transition-all cursor-pointer" onClick={() => setSelected(b)}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3"><Receipt className="w-5 h-5 text-primary-600" /><div><p className="font-semibold text-gray-900">Bill #{b.id}</p><p className="text-xs text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</p></div></div>
                <StatusBadge status={b.status} />
              </div>
              <div className="flex items-center gap-6 text-sm mt-2">
                <span><span className="text-gray-500">Total:</span> <span className="font-semibold">₹{b.netAmount?.toLocaleString()}</span></span>
                <span><span className="text-gray-500">Paid:</span> <span className="text-emerald-600 font-medium">₹{paid.toLocaleString()}</span></span>
                {due > 0 && <span><span className="text-gray-500">Due:</span> <span className="text-red-600 font-semibold">₹{due.toLocaleString()}</span></span>}
              </div>
            </div>
          );
        })}
        {bills.length === 0 && <div className="card p-12 text-center text-gray-400"><CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>No bills yet</p></div>}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-5 border-b flex justify-between"><h2 className="text-lg font-semibold">Bill #{selected.id}</h2><button onClick={() => setSelected(null)} className="text-gray-400">✕</button></div>
            <div className="p-5 space-y-4">
              <div className="space-y-2">{selected.items?.map(i => (
                <div key={i.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 text-sm"><span>{i.description} <span className="text-xs text-gray-500">x{i.quantity}</span></span><span className="font-medium">₹{i.totalPrice}</span></div>
              ))}</div>
              <div className="border-t pt-3 text-sm space-y-1"><div className="flex justify-between"><span>Subtotal</span><span>₹{selected.totalAmount}</span></div>{selected.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-₹{selected.discount}</span></div>}<div className="flex justify-between"><span>Tax</span><span>₹{selected.tax}</span></div><div className="flex justify-between font-bold text-base border-t pt-2"><span>Net Amount</span><span>₹{selected.netAmount}</span></div></div>

              {selected.status !== 'PAID' && (
                <div className="border-t pt-4"><h3 className="font-semibold text-gray-900 mb-3">Make Payment</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="label">Amount (₹)</label><input type="number" value={payForm.amount} onChange={e => setPayForm({...payForm, amount: e.target.value})} className="input-field" placeholder={`${selected.netAmount - (selected.payments?.reduce((s, p) => s + p.amount, 0) || 0)}`} /></div>
                    <div><label className="label">Method</label><select value={payForm.paymentMethod} onChange={e => setPayForm({...payForm, paymentMethod: e.target.value})} className="input-field"><option>CASH</option><option>CARD</option><option>UPI</option><option>INSURANCE</option></select></div>
                  </div>
                  <button onClick={handlePay} className="btn-primary w-full">Pay Now</button>
                </div>
              )}

              {selected.payments?.length > 0 && (
                <div className="border-t pt-3"><h4 className="text-sm font-semibold text-gray-700 mb-2">Payment History</h4>{selected.payments.map(p => (
                  <div key={p.id} className="flex justify-between text-xs text-gray-600 py-1"><span>₹{p.amount} via {p.paymentMethod}</span><span>{new Date(p.paidAt).toLocaleString()}</span></div>
                ))}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
