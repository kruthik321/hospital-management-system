import { useState, useEffect } from 'react';
import { appointmentAPI } from '../../services/api';
import { DataTable, Pagination, LoadingSpinner, StatusBadge, SectionHeader, StatsCard } from '../../components/common/Components';
import { Search, Filter, Calendar, Clock, CheckCircle2, AlertCircle, User, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => { load(); }, [page, status, date]);
  const load = async () => { setLoading(true); try { const r = await appointmentAPI.getAll({ page, limit: 10, status, date }); setAppointments(r.data.data); setTotal(r.data.total); setTotalPages(r.data.totalPages); } catch {} setLoading(false); };

  const updateStatus = async (id, newStatus) => { try { await appointmentAPI.update(id, { status: newStatus }); toast.success('Clinical status updated'); load(); } catch { toast.error('Status update failure'); } };

  const columns = [
    { header: 'Patient Identity', render: (r) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
           <User className="w-4 h-4" />
        </div>
        <p className="font-bold text-gray-900">{r.patient?.user?.firstName} {r.patient?.user?.lastName}</p>
      </div>
    )},
    { header: 'Clinical Faculty', render: (r) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-inner">
           <Stethoscope className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Dr. {r.doctor?.user?.firstName} {r.doctor?.user?.lastName}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{r.doctor?.department?.name}</p>
        </div>
      </div>
    )},
    { header: 'Schedule', render: (r) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
           <Calendar className="w-3.5 h-3.5 text-blue-400" />
           {new Date(r.appointmentDate).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">
           <Clock className="w-3 h-3" />
           {r.timeSlot}
        </div>
      </div>
    )},
    { header: 'Consultation Type', render: (r) => <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 px-3 py-1 rounded-lg">{r.type}</span> },
    { header: 'Registry Status', render: (r) => <StatusBadge status={r.status} /> },
    { header: 'Clinical Actions', render: (r) => r.status !== 'COMPLETED' && r.status !== 'CANCELLED' ? (
      <select 
        onChange={(e) => updateStatus(r.id, e.target.value)} 
        value={r.status} 
        className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-700 focus:ring-4 focus:ring-blue-50 outline-none transition-all cursor-pointer"
      >
        <option value="SCHEDULED">Scheduled</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
    ) : (
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 italic">Terminated</span>
    ) },
  ];

  return (
    <div className="animate-fade-in">
      <SectionHeader 
        title="Appointment HQ" 
        subtitle="Operational oversight of clinical consultations and schedule synchronization."
        icon={Calendar}
      >
        <div className="flex gap-4">
          <select 
            value={status} 
            onChange={e => { setStatus(e.target.value); setPage(1); }} 
            className="w-48 bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all"
          >
            <option value="">Filter by Status</option>
            <option>SCHEDULED</option>
            <option>CONFIRMED</option>
            <option>IN_PROGRESS</option>
            <option>COMPLETED</option>
            <option>CANCELLED</option>
          </select>
          <input 
            type="date" 
            value={date} 
            onChange={e => { setDate(e.target.value); setPage(1); }} 
            className="w-48 bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all" 
          />
          {(status || date) && (
            <button 
              onClick={() => { setStatus(''); setDate(''); }} 
              className="px-6 py-3 rounded-2xl bg-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-200 transition-all"
            >
              Reset
            </button>
          )}
        </div>
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatsCard icon={Calendar} label="Total Booked" value={total} color="primary" />
        <StatsCard icon={CheckCircle2} label="Completed" value={appointments.filter(a => a.status === 'COMPLETED').length} color="emerald" />
        <StatsCard icon={Clock} label="Pending" value={appointments.filter(a => a.status === 'SCHEDULED' || a.status === 'CONFIRMED').length} color="amber" />
        <StatsCard icon={AlertCircle} label="Cancellations" value={appointments.filter(a => a.status === 'CANCELLED').length} color="red" />
      </div>

      <div className="animate-slide-up">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-6">
            <DataTable columns={columns} data={appointments} emptyMessage="No appointments detected for the specified period." />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
