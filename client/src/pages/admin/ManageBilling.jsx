import { useState, useEffect } from 'react';
import { billingAPI, patientAPI } from '../../services/api';
import { DataTable, Pagination, LoadingSpinner, StatusBadge, SectionHeader, StatsCard } from '../../components/common/Components';
import { Plus, Trash2, CreditCard, Receipt, Wallet, TrendingUp, HandCoins } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageBilling() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patientId: '', discount: 0, tax: 0, items: [{ description: '', category: 'CONSULTATION', quantity: 1, unitPrice: 0 }] });

  useEffect(() => { load(); loadPatients(); }, [page, status]);
  const load = async () => { setLoading(true); try { const r = await billingAPI.getAll({ page, limit: 10, status }); setBills(r.data.data); setTotalPages(r.data.totalPages); } catch {} setLoading(false); };
  const loadPatients = async () => { try { const r = await patientAPI.getAll({ limit: 100 }); setPatients(r.data.data || []); } catch {} };

  const addItem = () => setForm({ ...form, items: [...form.items, { description: '', category: 'CONSULTATION', quantity: 1, unitPrice: 0 }] });
  const updateItem = (idx, field, val) => {
    const newItems = [...form.items];
    newItems[idx][field] = val;
    setForm({ ...form, items: newItems });
  };
  const removeItem = (idx) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.patientId) return toast.error('Required: Patient Identification');
    try {
      await billingAPI.create(form);
      toast.success('Electronic bill generated');
      setShowModal(false);
      load();
    } catch (err) {
      toast.error('Invoice generation failure');
    }
  };

  const columns = [
    { header: 'Invoice ID', render: (r) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 shadow-inner">
           <Receipt className="w-4 h-4" />
        </div>
        <span className="font-mono text-xs font-black text-gray-900 tracking-tighter">INV-{r.id}</span>
      </div>
    ) },
    { header: 'Patient / Debtor', render: (r) => (
      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-900">{r.patient?.user?.firstName} {r.patient?.user?.lastName}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">UID: {r.patientId}</span>
      </div>
    ) },
    { header: 'Net Liability', render: (r) => <span className="font-black text-gray-900 text-sm">₹{r.netAmount?.toLocaleString()}</span> },
    { header: 'Clearing Amount', render: (r) => { 
      const paid = r.payments?.reduce((s, p) => s + p.amount, 0) || 0; 
      return (
        <div className="flex items-center gap-2">
           <HandCoins className="w-3.5 h-3.5 text-emerald-500" />
           <span className="text-emerald-600 font-black text-sm">₹{paid.toLocaleString()}</span>
        </div>
      );
    } },
    { header: 'Financial Status', render: (r) => <StatusBadge status={r.status} /> },
    { header: 'Issuance Date', render: (r) => (
      <div className="text-xs font-bold text-gray-500">
         {new Date(r.createdAt).toLocaleDateString()}
      </div>
    ) },
  ];

  return (
    <div className="animate-fade-in shadow-sm">
      <SectionHeader 
        title="Revenue Operations" 
        subtitle="Manage clinical invoicing, partial payments, and financial ledgering."
        icon={Wallet}
      >
        <div className="flex gap-4">
          <select 
            value={status} 
            onChange={e => setStatus(e.target.value)} 
            className="w-48 bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all"
          >
            <option value="">Financial Filter</option>
            <option>PENDING</option>
            <option>PARTIAL</option>
            <option>PAID</option>
          </select>
          <button onClick={() => { setForm({ patientId: '', discount: 0, tax: 0, items: [{ description: '', category: 'CONSULTATION', quantity: 1, unitPrice: 0 }] }); setShowModal(true); }} className="btn-primary shadow-xl shadow-blue-800/20">
            <Plus className="w-4 h-4" /> Issue New Invoice
          </button>
        </div>
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatsCard icon={TrendingUp} label="Total Receivables" value={`₹${bills.reduce((s,b)=>s+b.netAmount,0).toLocaleString()}`} color="primary" />
        <StatsCard icon={Wallet} label="Pending Ledger" value={bills.filter(b=>b.status !== 'PAID').length} color="amber" />
        <StatsCard icon={HandCoins} label="Collected Today" value="₹42,500" color="emerald" trend="12%" trendUp />
        <StatsCard icon={Receipt} label="Active Invoices" value={bills.length} color="violet" />
      </div>

      <div className="animate-slide-up">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-6">
            <DataTable columns={columns} data={bills} emptyMessage="No financial records detected in the ledger." />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Add Bill Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-slide-up border border-blue-50">
            <div className="sticky top-0 bg-blue-50/80 backdrop-blur-md flex items-center justify-between p-8 border-b z-10">
              <div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight">Financial Issuance</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Medical Billing Intelligence</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">✕</button>
            </div>
            
            <form onSubmit={handleCreate} className="p-8 space-y-6">
              <div>
                <label className="label">Debtor Selection (Patient) *</label>
                <select value={form.patientId} onChange={e => setForm({...form, patientId: e.target.value})} className="input-field" required>
                  <option value="">-- Choose Account --</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.user?.firstName} {p.user?.lastName} (Record: {p.id})</option>)}
                </select>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                     <Receipt className="w-4 h-4 text-blue-600" /> Ledger Line Items
                  </h3>
                  <button type="button" onClick={addItem} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center gap-2 shadow-sm">
                     <Plus className="w-3.5 h-3.5" /> Append Item
                  </button>
                </div>
                
                <div className="space-y-4">
                  {form.items.map((item, idx) => (
                    <div key={idx} className="bg-gray-50/50 border border-gray-100 rounded-[1.5rem] p-6 relative flex gap-4 animate-slide-up transition-all hover:bg-white hover:shadow-lg">
                      <div className="flex-1 space-y-4">
                        <input placeholder="Clinical Description (e.g. ICU Room Charge, MRI Scan)" value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} className="input-field shadow-inner" required />
                        <div className="grid grid-cols-3 gap-4">
                          <select value={item.category} onChange={e => updateItem(idx, 'category', e.target.value)} className="input-field text-xs font-bold uppercase tracking-wide">
                            <option>CONSULTATION</option><option>LAB</option><option>PHARMACY</option><option>ROOM</option><option>PROCEDURE</option><option>OTHER</option>
                          </select>
                          <input type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} className="input-field" min="1" required />
                          <div className="relative">
                             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                             <input type="number" placeholder="Price" value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', e.target.value)} className="input-field pl-8" min="0" required />
                          </div>
                        </div>
                      </div>
                      {form.items.length > 1 && (
                        <button type="button" onClick={() => removeItem(idx)} className="self-start mt-2 w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                           <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-6">
                <div><label className="label">Applicable Tax (₹)</label><input type="number" value={form.tax} onChange={e => setForm({...form, tax: e.target.value})} className="input-field" min="0" /></div>
                <div><label className="label">Professional Discount (₹)</label><input type="number" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} className="input-field" min="0" /></div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Dismiss</button>
                <button type="submit" className="btn-primary px-10">Generate Electronic Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
