import { useState, useEffect } from 'react';
import { appointmentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import HeroHeader from '../../components/common/HeroHeader';
import { StatsCard, LoadingSpinner, StatusBadge } from '../../components/common/Components';
import { CalendarDays, Users, ClipboardList, Clock, Activity, Heart, Stethoscope, ArrowRight, Star } from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ today: 0, total: 0, completed: 0 });

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [allRes, todayRes] = await Promise.all([
        appointmentAPI.getAll({ limit: 50 }),
        appointmentAPI.getAll({ date: today, limit: 50 }),
      ]);
      setAppointments(todayRes.data.data);
      const all = allRes.data.data;
      setStats({
        today: todayRes.data.total,
        total: allRes.data.total,
        completed: all.filter(a => a.status === 'COMPLETED').length,
      });
    } catch {}
    setLoading(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      <HeroHeader 
        title={`Clinical Registry: Dr. ${user?.firstName}`}
        subtitle="Manage your diagnostic schedule, review patient telemetry, and coordinate department rounds."
        image="/assets/doctor-header.png"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard icon={CalendarDays} label="Daily Agenda" value={stats.today} color="primary" />
        <StatsCard icon={Clock} label="Waitlist Volume" value={stats.total} color="amber" />
        <StatsCard icon={Activity} label="Cases Resolved" value={stats.completed} color="emerald" />
        <StatsCard icon={Users} label="Success Metric" value="98%" color="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 dashboard-card overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
                  <Stethoscope className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Today's Clinical Rounds</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Scheduled Consultations</p>
               </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
               <div className="w-1.5 h-1.5 bg-blue-600 rounded-full pulse-medical"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">{stats.today} Rounds</span>
            </div>
          </div>

          <div className="space-y-3">
            {appointments.length > 0 ? appointments.map(apt => (
              <div key={apt.id} className="clinical-list-item group border border-transparent hover:border-blue-100/30">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-[1.2rem] bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center text-sm font-black shadow-lg transform transition-all group-hover:rotate-6">
                      {apt.patient?.user?.firstName?.[0]}{apt.patient?.user?.lastName?.[0]}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-gray-50 flex items-center justify-center shadow-md">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-md font-black text-gray-900 group-hover:text-blue-700 transition-colors uppercase tracking-tight">
                       {apt.patient?.user?.firstName} {apt.patient?.user?.lastName}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                         <Clock className="w-3.5 h-3.5" /> {apt.timeSlot}
                      </div>
                      <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{apt.type}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  {apt.reason && (
                    <div className="hidden xl:flex flex-col items-end opacity-60">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Clinic Reason</p>
                      <span className="text-[10px] text-gray-700 font-bold bg-gray-50 px-3 py-1 rounded-full border border-gray-100 italic">"{apt.reason}"</span>
                    </div>
                  )}
                  <StatusBadge status={apt.status} />
                  <button className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm group-hover:translate-x-1">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="p-24 text-center flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center border-4 border-white shadow-inner">
                   <CalendarDays className="w-10 h-10 text-blue-200" />
                </div>
                <div>
                  <p className="text-gray-400 font-black text-sm uppercase tracking-[0.2em]">Agenda Clear</p>
                  <p className="text-gray-300 font-bold text-xs mt-2 uppercase tracking-widest">No diagnostic rounds confirmed for the current cycle.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="dashboard-card bg-gradient-to-br from-blue-900 to-indigo-950 text-white border-none">
             <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md ">
                   <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                </div>
                <div>
                   <h3 className="text-lg font-black tracking-tight">Clinical Rating</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-blue-300/60">Peer & Patient Feedback</p>
                </div>
             </div>
             <div className="flex items-end gap-3 mb-4">
                <span className="text-5xl font-black">4.9</span>
                <span className="text-blue-300/60 font-black text-sm mb-1 uppercase tracking-widest">Global Index</span>
             </div>
             <p className="text-xs text-blue-100/50 leading-relaxed font-bold">
               Your diagnostic accuracy and patient satisfaction scores are currently in the top 2% of the medical department.
             </p>
          </div>

          <div className="dashboard-card">
             <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner">
                   <Activity className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-lg font-black text-gray-900 tracking-tight">System Status</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Medical Portal Telemetry</p>
                </div>
             </div>
             <div className="space-y-4">
                {[
                  { label: 'Cloud EMR Status', value: 'OPTIMAL', color: 'bg-emerald-500' },
                  { label: 'PACS Connectivity', value: 'SECURE', color: 'bg-emerald-500' },
                  { label: 'Pharmacy Sync', value: 'ACTIVE', color: 'bg-blue-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item.label}</span>
                     <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.color}`}></div>
                        <span className="text-[10px] font-black text-gray-900">{item.value}</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
