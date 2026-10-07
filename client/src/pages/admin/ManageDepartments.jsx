import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { DataTable, LoadingSpinner, SectionHeader, StatsCard } from '../../components/common/Components';
import { Plus, Trash2, Edit2, Building2, Users, Home, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageDepartments() {
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', headOfDept: '', phone: '', floor: '' });

  useEffect(() => { load(); }, []);
  const load = async () => { setLoading(true); try { const r = await adminAPI.getDepartments(); setDepts(r.data); } catch {} setLoading(false); };
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await adminAPI.updateDepartment(editId, form); toast.success('Registry updated'); }
      else { await adminAPI.createDepartment(form); toast.success('Department created'); }
      setShowModal(false); setEditId(null); setForm({ name: '', description: '', headOfDept: '', phone: '', floor: '' }); load();
    } catch (err) { toast.error(err.response?.data?.error || 'Registry error'); }
  };

  const edit = (d) => { setForm({ name: d.name, description: d.description || '', headOfDept: d.headOfDept || '', phone: d.phone || '', floor: d.floor || '' }); setEditId(d.id); setShowModal(true); };
  const del = async (id) => { if (!confirm('This will affect all linked medical personnel. Are you sure?')) return; try { await adminAPI.deleteDepartment(id); toast.success('Department purged'); load(); } catch { toast.error('Purge error'); } };

  const columns = [
    { header: 'Clinical Department', render: (r) => (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
           <Building2 className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-gray-900 leading-tight">{r.name}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">{r.floor || 'No Floor Assigned'}</p>
        </div>
      </div>
    )},
    { header: 'Medical Leadership', render: (r) => (
      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-700">{r.headOfDept || 'TBD'}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Head of Dept</span>
      </div>
    )},
    { header: 'Staff Capacity', render: (r) => (
      <div className="flex gap-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
           <Users className="w-3.5 h-3.5 text-blue-400" /> {r._count?.doctors || 0}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
           <Home className="w-3.5 h-3.5 text-emerald-400" /> {r._count?.rooms || 0}
        </div>
      </div>
    )},
    { header: 'Communication', render: (r) => (
      <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
         <Phone className="w-3.5 h-3.5 text-gray-300" />
         {r.phone || 'N/A'}
      </div>
    )},
    { header: 'Management', render: (r) => (
      <div className="flex gap-2">
        <button onClick={() => edit(r)} className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100/50">
           <Edit2 className="w-4 h-4" />
        </button>
        <button onClick={() => del(r.id)} className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100/50">
           <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ) },
  ];

  return (
    <div className="animate-fade-in shadow-sm">
      <SectionHeader 
        title="Department Control" 
        subtitle="Manage clinical divisions, medical leadership, and facility allocations."
        icon={Building2}
      >
        <button onClick={() => { setEditId(null); setForm({ name: '', description: '', headOfDept: '', phone: '', floor: '' }); setShowModal(true); }} className="btn-primary shadow-xl shadow-blue-800/20">
          <Plus className="w-4 h-4" /> Initialize Department
        </button>
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatsCard icon={Building2} label="Total Divisions" value={depts.length} color="primary" />
        <StatsCard icon={Users} label="Total Staffing" value={depts.reduce((s,d)=>s+(d._count?.doctors||0)+(d._count?.nurses||0),0)} color="emerald" />
        <StatsCard icon={Home} label="Room Capacity" value={depts.reduce((s,d)=>s+(d._count?.rooms||0),0)} color="amber" />
        <StatsCard icon={MapPin} label="Active Floors" value="04" color="violet" />
      </div>

      <div className="animate-slide-up">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <DataTable columns={columns} data={depts} emptyMessage="No medical departments detected in the registry." />
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-slide-up border border-blue-50">
            <div className="p-8 border-b bg-blue-50/30 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-900">{editId ? 'Modify Department' : 'New Clinical Division'}</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Medical Facility Information System</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div><label className="label">Official Department Name *</label><input value={form.name} onChange={set('name')} className="input-field" required /></div>
              <div><label className="label">Clinical Scope / Description</label><textarea value={form.description} onChange={set('description')} className="input-field" rows="3" placeholder="Define the clinical focus of this division..." /></div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className="label">Head of Department</label><input value={form.headOfDept} onChange={set('headOfDept')} className="input-field" placeholder="Dr. Name" /></div>
                <div><label className="label">Facility Floor</label><input value={form.floor} onChange={set('floor')} className="input-field" placeholder="e.g. 3rd Floor, Wing B" /></div>
              </div>
              <div><label className="label">Internal Contact Phone</label><input value={form.phone} onChange={set('phone')} className="input-field" placeholder="Ext: 404" /></div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Dismiss</button>
                <button type="submit" className="btn-primary px-10">{editId ? 'Commit Changes' : 'Initialize Division'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
