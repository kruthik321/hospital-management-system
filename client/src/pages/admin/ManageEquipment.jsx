import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { DataTable, LoadingSpinner, StatusBadge, SectionHeader, StatsCard } from '../../components/common/Components';
import { Plus, Wrench, ShieldCheck, AlertCircle, Box, Zap, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageEquipment() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', model: '', serialNumber: '', status: 'WORKING', location: '', cost: '', purchaseDate: '', warrantyExpiry: '' });

  useEffect(() => { load(); }, []);
  const load = async () => { setLoading(true); try { const r = await adminAPI.getEquipment(); setEquipment(r.data); } catch {} setLoading(false); };
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });
  const handleSubmit = async (e) => { e.preventDefault(); try { await adminAPI.createEquipment(form); toast.success('Clinical asset registered'); setShowModal(false); load(); } catch (err) { toast.error(err.response?.data?.error || 'Registration error'); } };

  const columns = [
    { header: 'Medical Asset', render: (r) => (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
           <Zap className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-gray-900 leading-tight">{r.name}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">{r.model || r.category}</p>
        </div>
      </div>
    )},
    { header: 'Inventory ID', render: (r) => (
      <div className="flex flex-col">
        <span className="font-mono text-xs font-black text-gray-600 tracking-tighter uppercase">{r.serialNumber || 'SN-UNASSIGNED'}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Biological ID</span>
      </div>
    )},
    { header: 'Facility Location', render: (r) => (
      <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
         <MapPin className="w-3.5 h-3.5 text-blue-400" />
         {r.location || 'Storage'}
      </div>
    )},
    { header: 'Operational Status', render: (r) => <StatusBadge status={r.status} /> },
    { header: 'Asset Valuation', render: (r) => (
      <div className="text-sm font-black text-gray-900">
         {r.cost > 0 ? `₹${r.cost.toLocaleString()}` : '—'}
      </div>
    )},
  ];

  return (
    <div className="animate-fade-in shadow-sm">
      <SectionHeader 
        title="Asset Intelligence" 
        subtitle="Operational oversight of clinical machinery, biomedical equipment, and maintenance cycles."
        icon={Wrench}
      >
        <button onClick={() => setShowModal(true)} className="btn-primary shadow-xl shadow-amber-800/10">
          <Plus className="w-4 h-4" /> Register New Asset
        </button>
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatsCard icon={Box} label="Total Inventory" value={equipment.length} color="primary" />
        <StatsCard icon={ShieldCheck} label="Operational" value={equipment.filter(e=>e.status==='WORKING').length} color="emerald" />
        <StatsCard icon={AlertCircle} label="Maintenance" value={equipment.filter(e=>e.status==='REPAIR').length} color="red" />
        <StatsCard icon={Zap} label="CapEx Value" value={`₹${equipment.reduce((s,e)=>s+(e.cost||0),0).toLocaleString()}`} color="violet" />
      </div>

      <div className="animate-slide-up">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <DataTable columns={columns} data={equipment} emptyMessage="No biomedical assets detected in the facility ledger." />
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-amber-900/4 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-slide-up border border-amber-50">
            <div className="p-8 border-b bg-amber-50/30 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-amber-900">Asset Registration</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mt-1">Biomedical Inventory System</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div><label className="label">Equipment Name *</label><input value={form.name} onChange={set('name')} className="input-field shadow-inner" required /></div>
                <div><label className="label">Clinical Category</label><input value={form.category} onChange={set('category')} className="input-field" placeholder="e.g. Imaging, Life Support" /></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className="label">Manufacturer / Model</label><input value={form.model} onChange={set('model')} className="input-field" /></div>
                <div><label className="label">Biological Serial No.</label><input value={form.serialNumber} onChange={set('serialNumber')} className="input-field font-mono" /></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className="label">Installation Location</label><input value={form.location} onChange={set('location')} className="input-field" placeholder="e.g. ICU Wing A" /></div>
                <div><label className="label">Purchase Valuation (₹)</label><input type="number" value={form.cost} onChange={set('cost')} className="input-field" /></div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Abort</button>
                <button type="submit" className="btn-primary px-10 bg-amber-600 hover:bg-amber-700 border-amber-700">Register Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
