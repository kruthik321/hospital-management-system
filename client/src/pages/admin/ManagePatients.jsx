import { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';
import { DataTable, Pagination, LoadingSpinner, SectionHeader, StatsCard } from '../../components/common/Components';
import { Search, Trash2, Eye, Users, Heart, UserPlus, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => { load(); }, [page, search]);
  const load = async () => { setLoading(true); try { const r = await patientAPI.getAll({ page, limit: 10, search }); setPatients(r.data.data); setTotal(r.data.total); setTotalPages(r.data.totalPages); } catch {} setLoading(false); };
  const handleDelete = async (id) => { if (!confirm('Permanent deletion of patient records. Are you sure?')) return; try { await patientAPI.delete(id); toast.success('Record purged'); load(); } catch { toast.error('Purge error'); } };
  const viewPatient = async (id) => { try { const r = await patientAPI.getById(id); setSelectedPatient(r.data); } catch {} };

  const columns = [
    { header: 'Patient Identity', render: (r) => (
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700 shadow-inner font-black text-sm">
           {r.user?.firstName?.[0]}{r.user?.lastName?.[0]}
        </div>
        <div>
          <p className="font-bold text-gray-900 leading-tight">{r.user?.firstName} {r.user?.lastName}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">{r.user?.email}</p>
        </div>
      </div>
    )},
    { header: 'Emergency Contact', render: (r) => (
      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-700">{r.user?.phone || '—'}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Primary Mobile</span>
      </div>
    )},
    { header: 'Gender / Age', render: (r) => <span className="text-xs font-black uppercase tracking-widest bg-gray-100 text-gray-600 px-3 py-1 rounded-lg">{r.gender || '—'}</span> },
    { header: 'Blood Profile', render: (r) => r.bloodGroup ? (
      <div className="flex items-center gap-2">
        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
        <span className="font-black text-red-600 text-sm">{r.bloodGroup}</span>
      </div>
    ) : '—' },
    { header: 'Registry Status', render: (r) => r.user?.isActive ? (
      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-widest">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Active
      </div>
    ) : (
      <div className="flex items-center gap-1.5 text-red-500 font-bold text-xs uppercase tracking-widest">
        <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div> Inactive
      </div>
    )},
    { header: 'Clinical Management', render: (r) => (
      <div className="flex gap-2">
        <button onClick={() => viewPatient(r.id)} className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100/50">
           <Eye className="w-4 h-4" />
        </button>
        <button onClick={() => handleDelete(r.id)} className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100/50">
           <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ) },
  ];

  return (
    <div className="animate-fade-in">
      <SectionHeader 
        title="Patient Directory" 
        subtitle="Manage patient registrations, medical histories, and clinical records."
        icon={Users}
      >
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            value={search} 
            onChange={e => { setSearch(e.target.value); setPage(1); }} 
            className="w-72 bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-300 outline-none transition-all font-medium" 
            placeholder="Search by name, ID or email..." 
          />
        </div>
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatsCard icon={Users} label="Total Records" value={total} color="primary" />
        <StatsCard icon={UserPlus} label="New Intake" value="12 Today" color="emerald" trend="15%" trendUp />
        <StatsCard icon={Heart} label="Clinical Emerg" value="02" color="red" />
        <StatsCard icon={Activity} label="Active Visits" value="45" color="accent" />
      </div>

      <div className="animate-slide-up">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-6">
            <DataTable columns={columns} data={patients} emptyMessage="No patient records detected in the clinical database." />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm" onClick={() => setSelectedPatient(null)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(30,58,138,0.3)] w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up border border-blue-50">
            <div className="sticky top-0 bg-blue-50/80 backdrop-blur-md flex items-center justify-between p-8 border-b z-10">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-2xl bg-blue-800 text-white flex items-center justify-center text-lg font-black">{selectedPatient.user?.firstName?.[0]}{selectedPatient.user?.lastName?.[0]}</div>
                 <div>
                    <h2 className="text-2xl font-black text-gray-900 leading-tight">{selectedPatient.user?.firstName} {selectedPatient.user?.lastName}</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Patient Profile: {selectedPatient.id}</p>
                 </div>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">✕</button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Electronic Mail</p><p className="text-sm font-bold text-gray-900 bg-gray-50 px-4 py-2 rounded-xl">{selectedPatient.user?.email}</p></div>
                <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Primary Contact</p><p className="text-sm font-bold text-gray-900 bg-gray-50 px-4 py-2 rounded-xl">{selectedPatient.user?.phone || '—'}</p></div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="medical-glass p-4 text-center"><p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Gender</p><p className="text-sm font-black text-blue-900">{selectedPatient.gender || '—'}</p></div>
                <div className="medical-glass p-4 text-center"><p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Blood Group</p><p className="text-sm font-black text-red-600">{selectedPatient.bloodGroup || '—'}</p></div>
                <div className="medical-glass p-4 text-center"><p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">D.O.B</p><p className="text-sm font-black text-gray-700">{selectedPatient.dateOfBirth ? new Date(selectedPatient.dateOfBirth).toLocaleDateString() : '—'}</p></div>
              </div>

              <div className="space-y-4">
                 <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Registered Address</p><div className="bg-gray-50 p-4 rounded-2xl text-sm font-medium text-gray-700">{selectedPatient.address || '—'}, {selectedPatient.city || ''}</div></div>
                 <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Emergency Contact Identification</p><div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-sm font-bold text-rose-900 flex justify-between items-center">{selectedPatient.emergencyContact || '—'} <span className="opacity-50">{selectedPatient.emergencyPhone || ''}</span></div></div>
                 <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Known Clinical Allergies</p><div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-sm font-bold text-amber-700 italic">"{selectedPatient.allergies || 'No known clinical allergies detected.'}"</div></div>
              </div>

              <div className="pt-4 flex justify-end"><button onClick={() => setSelectedPatient(null)} className="btn-primary px-10">Dismiss Record</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
