import { useState, useEffect } from 'react';
import { nurseAPI, adminAPI } from '../../services/api';
import { DataTable, Pagination, LoadingSpinner, SectionHeader, StatsCard } from '../../components/common/Components';
import { Plus, Search, Trash2, Activity, Users, Clock, Home } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageNurses() {
  const [nurses, setNurses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '', departmentId: '', shiftType: '', qualification: '', wardAssignment: '' });

  useEffect(() => { load(); loadDepts(); }, [page, search]);
  const load = async () => { setLoading(true); try { const r = await nurseAPI.getAll({ page, limit: 10, search }); setNurses(r.data.data); setTotal(r.data.total); setTotalPages(r.data.totalPages); } catch {} setLoading(false); };
  const loadDepts = async () => { try { const r = await adminAPI.getDepartments(); setDepartments(r.data); } catch {} };
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });
  const handleSubmit = async (e) => { e.preventDefault(); try { await nurseAPI.create(form); toast.success('Nursing personnel registered'); setShowModal(false); load(); setForm({ email: '', password: '', firstName: '', lastName: '', phone: '', departmentId: '', shiftType: '', qualification: '', wardAssignment: '' }); } catch (err) { toast.error(err.response?.data?.error || 'Registration error'); } };
  const handleDelete = async (id) => { if (!confirm('Permanent removal of nursing records. Are you sure?')) return; try { await nurseAPI.delete(id); toast.success('Record purged'); load(); } catch { toast.error('Purge error'); } };

  const columns = [
    { header: 'Nursing Personnel', render: (r) => (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 shadow-inner font-black text-sm">
           {r.user?.firstName?.[0]}{r.user?.lastName?.[0]}
        </div>
        <div>
          <p className="font-bold text-gray-900 leading-tight">{r.user?.firstName} {r.user?.lastName}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">{r.user?.email}</p>
        </div>
      </div>
    )},
    { header: 'Clinical Unit', render: (r) => (
      <div className="flex flex-col">
        <span className="text-xs font-black text-blue-700 uppercase tracking-wide">{r.department?.name || 'Unassigned'}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase italic">Medical Div.</span>
      </div>
    ) },
    { header: 'Shift Protocol', render: (r) => r.shiftType ? (
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
         <Clock className="w-3.5 h-3.5 text-blue-400" />
         <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">{r.shiftType}</span>
      </div>
    ) : '—' },
    { header: 'Ward Assignment', render: (r) => (
      <div className="flex items-center gap-2">
        <Home className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-sm font-bold text-gray-700">{r.wardAssignment || 'Floating'}</span>
      </div>
    ) },
    { header: 'Management', render: (r) => (
      <button onClick={() => handleDelete(r.id)} className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-sm border border-red-100/50">
        <Trash2 className="w-4 h-4" />
      </button>
    ) },
  ];

  return (
    <div className="animate-fade-in">
      <SectionHeader 
        title="Nursing Registry" 
        subtitle="Manage nursing staff, shift rotations, and clinical station assignments."
        icon={Activity}
      >
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            value={search} 
            onChange={e => { setSearch(e.target.value); setPage(1); }} 
            className="w-64 bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-300 outline-none transition-all font-medium" 
            placeholder="Search nursing staff..." 
          />
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary shadow-xl shadow-blue-800/20">
          <Plus className="w-4 h-4" /> Recruit Personnel
        </button>
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatsCard icon={Users} label="Active Nurses" value={total} color="emerald" />
        <StatsCard icon={Clock} label="On Night Duty" value={nurses.filter(n => n.shiftType === 'NIGHT').length} color="violet" />
        <StatsCard icon={Home} label="Avg Ward Load" value="4.2" color="amber" />
        <StatsCard icon={Activity} label="Registry Status" value="Online" color="primary" />
      </div>

      <div className="animate-slide-up">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-6">
            <DataTable columns={columns} data={nurses} emptyMessage="No nursing personnel found in the clinical database." />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up border border-blue-50">
            <div className="sticky top-0 bg-blue-50/80 backdrop-blur-md flex items-center justify-between p-8 border-b z-10">
              <div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight">Personnel Recruitment</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Nursing Information System</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div><label className="label">First Name *</label><input value={form.firstName} onChange={set('firstName')} className="input-field" required /></div>
                <div><label className="label">Last Name *</label><input value={form.lastName} onChange={set('lastName')} className="input-field" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className="label">Work Email *</label><input type="email" value={form.email} onChange={set('email')} className="input-field" required /></div>
                <div><label className="label">Initial Password</label><input type="password" value={form.password} onChange={set('password')} className="input-field" placeholder="Nurse@123" /></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className="label">Mobile Number</label><input value={form.phone} onChange={set('phone')} className="input-field" /></div>
                <div><label className="label">Dept Assignment</label><select value={form.departmentId} onChange={set('departmentId')} className="input-field"><option value="">Select Department</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className="label">Shift Preference</label><select value={form.shiftType} onChange={set('shiftType')} className="input-field"><option value="">Select Shift</option><option>MORNING</option><option>AFTERNOON</option><option>NIGHT</option></select></div>
                <div><label className="label">Initial Ward Assignment</label><input value={form.wardAssignment} onChange={set('wardAssignment')} className="input-field" /></div>
              </div>
              <div><label className="label">Clinical Qualifications</label><input value={form.qualification} onChange={set('qualification')} className="input-field" placeholder="B.Sc Nursing, GNM..." /></div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Dismiss</button>
                <button type="submit" className="btn-primary px-10">Recruit Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
