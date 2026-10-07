import { useState, useEffect } from 'react';
import { roomAPI } from '../../services/api';
import { DataTable, LoadingSpinner, StatusBadge, SectionHeader, StatsCard } from '../../components/common/Components';
import { Plus, BedDouble, Home, CheckCircle2, User, Activity, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ roomNumber: '', type: 'GENERAL', floor: '', charges: '', bedCount: '2', departmentId: '' });

  useEffect(() => { load(); }, []);
  const load = async () => { setLoading(true); try { const r = await roomAPI.getAll(); setRooms(r.data); } catch {} setLoading(false); };
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });
  const handleSubmit = async (e) => { e.preventDefault(); try { await roomAPI.create(form); toast.success('Clinical bay initialized'); setShowModal(false); load(); } catch (err) { toast.error(err.response?.data?.error || 'Initialization error'); } };

  const columns = [
    { header: 'Clinical Bay', render: (r) => (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
           <Home className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-gray-900 leading-tight">Room {r.roomNumber}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">{r.type} Unit</p>
        </div>
      </div>
    )},
    { header: 'Facility Location', render: (r) => (
      <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
         <MapPin className="w-3.5 h-3.5 text-blue-400" />
         {r.floor || 'Unassigned'}
      </div>
    )},
    { header: 'Bed Inventory', render: (r) => {
      const occupied = r.beds?.filter(b => b.isOccupied).length || 0;
      const total = r.beds?.length || 0;
      return (
        <div className="flex flex-col gap-1.5">
           <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-24">
                 <div className="h-full bg-blue-500 transition-all" style={{ width: `${(occupied/total)*100}%` }}></div>
              </div>
              <span className="text-[10px] font-black text-gray-500 tracking-widest">{occupied}/{total}</span>
           </div>
           <div className="flex gap-1">
              {r.beds?.map(b => (
                <div key={b.id} className={`w-2 h-2 rounded-full ${b.isOccupied ? 'bg-red-400' : 'bg-emerald-400 animate-pulse'}`} title={b.bedNumber}></div>
              ))}
           </div>
        </div>
      );
    }},
    { header: 'Daily Tariff', render: (r) => (
      <div className="text-sm font-black text-gray-900">
         ₹{r.charges?.toLocaleString()}<span className="text-[10px] text-gray-400 ml-1">/DAY</span>
      </div>
    )},
    { header: 'Clinical Status', render: (r) => {
      const allOccupied = r.beds?.every(b => b.isOccupied);
      return allOccupied ? (
        <div className="flex items-center gap-1.5 text-red-500 font-bold text-xs uppercase tracking-widest">
          <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div> Fully Occupied
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-widest">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Available
        </div>
      );
    }},
  ];

  return (
    <div className="animate-fade-in shadow-sm">
      <SectionHeader 
        title="Facility Operations" 
        subtitle="Manage hospital wards, clinical room allocations, and bed occupancy metrics."
        icon={BedDouble}
      >
        <button onClick={() => setShowModal(true)} className="btn-primary shadow-xl shadow-indigo-800/10">
          <Plus className="w-4 h-4" /> Initialize Room
        </button>
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatsCard icon={Home} label="Total Assets" value={rooms.length} color="primary" />
        <StatsCard icon={BedDouble} label="Bed Capacity" value={rooms.reduce((s,r)=>s+(r.beds?.length||0),0)} color="emerald" />
        <StatsCard icon={User} label="Current Census" value={rooms.reduce((s,r)=>s+(r.beds?.filter(b=>b.isOccupied).length||0),0)} color="amber" />
        <StatsCard icon={Activity} label="Occupancy Rate" value={`${Math.round((rooms.reduce((s,r)=>s+(r.beds?.filter(b=>b.isOccupied).length||0),0) / (rooms.reduce((s,r)=>s+(r.beds?.length||0),0) || 1)) * 100)}%`} color="violet" />
      </div>

      <div className="animate-slide-up">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <DataTable columns={columns} data={rooms} emptyMessage="No clinical bays detected in the facility registry." />
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-slide-up border border-indigo-50">
            <div className="p-8 border-b bg-indigo-50/30 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-indigo-900">Facility Initialization</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mt-1">Medical Room Information System</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div><label className="label">Room / Bay Identification *</label><input value={form.roomNumber} onChange={set('roomNumber')} className="input-field shadow-inner" required placeholder="e.g. 101-A" /></div>
                <div><label className="label">Clinical Unit Type</label><select value={form.type} onChange={set('type')} className="input-field text-xs font-black uppercase tracking-widest"><option>GENERAL</option><option>SEMI_PRIVATE</option><option>PRIVATE</option><option>ICU</option><option>OPERATION</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className="label">Facility Floor</label><input value={form.floor} onChange={set('floor')} className="input-field" placeholder="e.g. 3rd Floor" /></div>
                <div><label className="label">Daily Clinical Tariff (₹)</label><input type="number" value={form.charges} onChange={set('charges')} className="input-field" /></div>
              </div>
              <div><label className="label">Bay Bed Count</label><input type="number" value={form.bedCount} onChange={set('bedCount')} className="input-field" min="1" max="100" /></div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Abort</button>
                <button type="submit" className="btn-primary px-10 bg-indigo-600 hover:bg-indigo-700 border-indigo-700">Initialize Bay</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
