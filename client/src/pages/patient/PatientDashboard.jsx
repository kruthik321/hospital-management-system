import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI, prescriptionAPI, billingAPI } from '../../services/api';
import HeroHeader from '../../components/common/HeroHeader';
import { StatsCard, LoadingSpinner, StatusBadge } from '../../components/common/Components';
import { CalendarDays, ClipboardList, CreditCard, FileText, ArrowRight, Activity, Heart, Search, Pill, ClipboardCheck, Zap, Baby } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  const load = async () => {
    try {
      const [a, p, b] = await Promise.all([
        appointmentAPI.getAll({ limit: 5 }),
        prescriptionAPI.getAll({ limit: 5 }),
        billingAPI.getAll({ limit: 5 }),
      ]);
      setAppointments(a.data.data); setPrescriptions(p.data.data); setBills(b.data.data);
    } catch {}
    setLoading(false);
  };

  if (loading) return <LoadingSpinner />;

  const upcoming = appointments.filter(a => a.status !== 'COMPLETED' && a.status !== 'CANCELLED');
  const pendingBills = bills.filter(b => b.status === 'PENDING' || b.status === 'PARTIAL');

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      <HeroHeader 
        title={`Welcome Back, ${user?.firstName}!`}
        subtitle="Your centralized clinical health portal. Monitor your recovery progress, manage medical appointments, and access secure records."
        image="/assets/patient-header.png"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard icon={CalendarDays} label="Active Bookings" value={upcoming.length} color="primary" />
        <StatsCard icon={Pill} label="Clinic Meds" value={prescriptions.length} color="emerald" />
        <StatsCard icon={ClipboardCheck} label="Health Records" value={appointments.length} color="violet" />
        <StatsCard icon={CreditCard} label="Financial Due" value={pendingBills.length} color="amber" />
      </div>

      {/* Premium Quick Actions Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Schedule Consultation', to: '/patient/book-appointment', icon: CalendarDays, color: 'from-blue-600 to-indigo-700', shadow: 'shadow-blue-900/20' },
          { label: 'Vital Analytics', to: '/patient/symptom-checker', icon: Activity, color: 'from-emerald-600 to-teal-700', shadow: 'shadow-emerald-900/20' },
          { label: 'Pharmacy Express', to: '/patient/prescriptions', icon: Pill, color: 'from-violet-600 to-purple-700', shadow: 'shadow-violet-900/20' },
          { label: 'Medical Dossier', to: '/patient/reports', icon: FileText, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-900/20' },
        ].map((item, i) => (
          <Link key={i} to={item.to} className={`group relative overflow-hidden bg-gradient-to-br ${item.color} rounded-[2rem] p-8 text-white shadow-2xl ${item.shadow} hover:-translate-y-2 transition-all duration-500`}>
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-all duration-700">
               <item.icon className="w-24 h-24" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-12">
               <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <item.icon className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-xl font-black leading-tight tracking-tight mb-2">{item.label}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-70 group-hover:opacity-100 transition-opacity">
                     <span>Initialize</span>
                     <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
               </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Specialized Care Portals Entry - Moved up for higher visibility */}
      <div className="bg-gradient-to-r from-orange-50 to-rose-50 rounded-[2.5rem] p-10 shadow-sm border border-orange-100/50">
        <div className="flex items-center gap-4 mb-10">
           <div className="p-4 rounded-3xl bg-white text-orange-600 shadow-xl shadow-orange-200/50">
              <Zap className="w-8 h-8" />
           </div>
           <div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">Specialized Care Centers</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mt-1">Explore our dedicated patient ecosystems</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="kids-card p-10 bg-white border-2 border-transparent hover:border-sky-200 shadow-xl hover:shadow-2xl relative overflow-hidden group transition-all duration-500 rounded-[2rem]">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform">
                 <Baby className="w-32 h-32 text-sky-500" />
              </div>
              <div className="relative z-10 flex flex-col gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 shadow-inner">
                       <Baby className="w-8 h-8" />
                    </div>
                    <h4 className="text-2xl font-black text-sky-900 tracking-tight uppercase">Kids Health Portal</h4>
                 </div>
                 <p className="text-base font-bold text-sky-700/70 leading-relaxed max-w-sm">Specialized pediatric care including vaccination trackers, child-safe AI symptom checkers, and developmental monitoring.</p>
                 <Link to="/kids/dashboard" className="inline-flex items-center justify-between bg-sky-50 text-sky-600 px-6 py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] group-hover:bg-sky-500 group-hover:text-white transition-all w-full mt-4">
                    Initialize Pediatric Portal <ArrowRight className="w-4 h-4" />
                 </Link>
              </div>
           </div>

           <div className="pregnancy-card p-10 bg-white border-2 border-transparent hover:border-rose-200 shadow-xl hover:shadow-2xl relative overflow-hidden group transition-all duration-500 rounded-[2rem]">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform">
                 <Heart className="w-32 h-32 text-rose-500" />
              </div>
              <div className="relative z-10 flex flex-col gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-500 shadow-inner">
                       <Heart className="w-8 h-8" />
                    </div>
                    <h4 className="text-2xl font-black text-rose-900 tracking-tight uppercase">Pregnancy Care Hub</h4>
                 </div>
                 <p className="text-base font-bold text-rose-700/70 leading-relaxed max-w-sm">Maternal wellness ecosystem with week-by-week pregnancy trackers, safe remedies library, and specialist prenatal consultations.</p>
                 <Link to="/pregnancy/dashboard" className="inline-flex items-center justify-between bg-rose-50 text-rose-500 px-6 py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] group-hover:bg-rose-500 group-hover:text-white transition-all w-full mt-4">
                    Initialize Wellness Hub <ArrowRight className="w-4 h-4" />
                 </Link>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="dashboard-card overflow-hidden">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
                   <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-gray-900 tracking-tight">Clinical Agenda</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Confirmed Consultations</p>
                </div>
             </div>
             <Link to="/patient/book-appointment" className="text-[10px] font-black uppercase tracking-widest text-blue-600 border-b-2 border-blue-600 pb-1">New Booking</Link>
          </div>
          <div className="space-y-3">
            {upcoming.length > 0 ? upcoming.slice(0, 3).map(apt => (
              <div key={apt.id} className="clinical-list-item group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700 shadow-sm group-hover:rotate-6 transition-transform">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">Dr. {apt.doctor?.user?.firstName} {apt.doctor?.user?.lastName}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">{new Date(apt.appointmentDate).toLocaleDateString()} — {apt.timeSlot}</p>
                  </div>
                </div>
                <StatusBadge status={apt.status} />
              </div>
            )) : (
               <div className="p-16 text-center text-gray-400 font-black text-[10px] uppercase tracking-widest">No upcoming clinical encounters</div>
            )}
          </div>
        </div>

        <div className="dashboard-card overflow-hidden">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner">
                   <Pill className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-gray-900 tracking-tight">Medication Ledger</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Pharmacy Release Orders</p>
                </div>
             </div>
             <Link to="/patient/prescriptions" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 border-b-2 border-emerald-600 pb-1">All Orders</Link>
          </div>
          <div className="space-y-3">
            {prescriptions.length > 0 ? prescriptions.slice(0, 3).map(rx => (
              <div key={rx.id} className="clinical-list-item group">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 shadow-sm group-hover:rotate-6 transition-transform">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Rx Sequence #{rx.id}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">PRESCRIBED BY DR. {rx.doctor?.user?.firstName.toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-gray-700 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">{new Date(rx.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            )) : (
               <div className="p-16 text-center text-gray-400 font-black text-[10px] uppercase tracking-widest">No medication records found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
