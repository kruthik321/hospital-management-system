import { useState, useEffect } from 'react';
import { emergencyAPI } from '../../services/api';
import { DataTable, LoadingSpinner, StatusBadge, SectionHeader, StatsCard } from '../../components/common/Components';
import { Plus, Siren, AlertTriangle, CheckCircle2, Clock, User, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageEmergency() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ description: '', severity: 'HIGH', assignedTo: '' });

  useEffect(() => { load(); }, []);
  const load = async () => { setLoading(true); try { const r = await emergencyAPI.getAll(); setCases(r.data); } catch {} setLoading(false); };
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });
  const handleSubmit = async (e) => { e.preventDefault(); try { await emergencyAPI.create(form); toast.success('Trauma alert initiated'); setShowModal(false); load(); } catch (err) { toast.error('Alert failure'); } };
  const resolve = async (id) => { try { await emergencyAPI.update(id, { status: 'RESOLVED' }); toast.success('Incident resolved'); load(); } catch {} };

  const activeCases = cases.filter(c => c.status === 'ACTIVE');
  const resolvedCases = cases.filter(c => c.status !== 'ACTIVE');

  const columns = [
    { header: 'Critical Incident', render: (r) => (
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${r.status === 'ACTIVE' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
           <Siren className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-gray-900 leading-tight">{r.description}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">Report ID: {r.id}</p>
        </div>
      </div>
    )},
    { header: 'Clinical Priority', render: (r) => <StatusBadge status={r.severity} /> },
    { header: 'Incident Timeline', render: (r) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
           <Clock className="w-3.5 h-3.5 text-blue-400" />
           {new Date(r.arrivedAt).toLocaleString()}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">Admissions Timestamp</span>
      </div>
    )},
    { header: 'Response Team', render: (r) => r.assignedTo ? (
      <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
         <User className="w-3.5 h-3.5 text-blue-500" />
         {r.assignedTo}
      </div>
    ) : (
       <span className="text-xs font-black text-amber-500 uppercase tracking-widest italic animate-pulse">Awaiting Assignment</span>
    )},
    { header: 'Status / Control', render: (r) => (
      <div className="flex items-center justify-between gap-4">
        <StatusBadge status={r.status} />
        {r.status === 'ACTIVE' && (
          <button onClick={() => resolve(r.id)} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100/50">
             Mark Resolved
          </button>
        )}
      </div>
    ) },
  ];

  return (
    <div className="animate-fade-in shadow-sm">
      <SectionHeader 
        title="Emergency Command" 
        subtitle="Real-time trauma monitoring, critical incident dispatch, and crisis resolution."
        icon={Activity}
      >
        <button onClick={() => setShowModal(true)} className="btn-primary shadow-xl shadow-red-800/20 bg-red-600 hover:bg-red-700 border-red-700">
          <Plus className="w-4 h-4" /> Initiate Trauma Alert
        </button>
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatsCard icon={Siren} label="Active Trauma" value={activeCases.length} color="red" />
        <StatsCard icon={AlertTriangle} label="High Severity" value={activeCases.filter(c=>c.severity==='HIGH'||c.severity==='CRITICAL').length} color="amber" />
        <StatsCard icon={CheckCircle2} label="Resolved Today" value={resolvedCases.filter(c=>new Date(c.resolvedAt).toDateString()===new Date().toDateString()).length} color="emerald" />
        <StatsCard icon={Activity} label="Response Time" value="4.2m" color="primary" />
      </div>

      <div className="space-y-12">
        <div className="animate-slide-up">
           <h2 className="text-xs font-black text-red-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1">
             <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div> Active Emergencies
           </h2>
           {loading ? (
             <LoadingSpinner />
           ) : (
             <DataTable columns={columns} data={activeCases} emptyMessage="No active trauma incidents detected in the medical sector." />
           )}
        </div>

        <div className="animate-slide-up opacity-80">
           <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1">
              Historical Ledger (Resolved)
           </h2>
           <DataTable columns={columns} data={resolvedCases} emptyMessage="No historical trauma records found." />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-red-950/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-slide-up border border-red-50">
            <div className="p-8 border-b bg-red-50/30 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-red-900">Initiate Crisis Alert</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mt-1">Hospital Emergency Dispatch System</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="label">Crisis Description *</label>
                <textarea 
                  value={form.description} 
                  onChange={set('description')} 
                  className="input-field border-red-100 focus:ring-red-50 focus:border-red-300" 
                  rows="3" 
                  placeholder="Summarize the medical emergency..." 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="label">Trauma Severity</label>
                  <select value={form.severity} onChange={set('severity')} className="input-field font-black text-[10px] uppercase tracking-widest">
                    <option>LOW</option>
                    <option>MEDIUM</option>
                    <option>HIGH</option>
                    <option>CRITICAL</option>
                  </select>
                </div>
                <div>
                  <label className="label">Primary Responder</label>
                  <input value={form.assignedTo} onChange={set('assignedTo')} className="input-field" placeholder="Dr. or Faculty Name" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Abort</button>
                <button type="submit" className="btn-primary px-10 bg-red-600 hover:bg-red-700 border-red-700 shadow-xl shadow-red-800/10">Broadcast Trauma Alert</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
