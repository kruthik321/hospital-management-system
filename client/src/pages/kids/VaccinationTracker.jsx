import { useState } from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  Bell, 
  ChevronRight, 
  Info,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';
import HeroHeader from '../../components/common/HeroHeader';

const initialVaccines = [
  { id: 1, name: 'BCG', age: 'At Birth', date: '2022-01-15', status: 'COMPLETED', description: 'Protects against Tuberculosis (TB).' },
  { id: 2, name: 'Hepatitis B (0)', age: 'At Birth', date: '2022-01-15', status: 'COMPLETED', description: 'Prevents Hepatitis B liver infection.' },
  { id: 3, name: 'OPV (0)', age: 'At Birth', date: '2022-01-15', status: 'COMPLETED', description: 'Oral Polio Vaccine for paralysis prevention.' },
  { id: 4, name: 'DPT (1)', age: '6 Weeks', date: '2022-03-01', status: 'COMPLETED', description: 'Diphtheria, Pertussis, and Tetanus combo.' },
  { id: 5, name: 'Rotavirus (1)', age: '6 Weeks', date: '2022-03-01', status: 'COMPLETED', description: 'Protects against severe diarrhea.' },
  { id: 6, name: 'MMR (1)', age: '9 Months', date: '2022-10-15', status: 'COMPLETED', description: 'Measles, Mumps, and Rubella protection.' },
  { id: 7, name: 'DPT Booster (1)', age: '2 Years', date: '2024-01-15', status: 'UPCOMING', description: 'Secondary booster for DPT protection.' },
  { id: 8, name: 'Polio Booster', age: '5 Years', date: '2027-01-15', status: 'UPCOMING', description: 'Final general polio booster dose.' },
];

export default function VaccinationTracker() {
  const [vaccines, setVaccines] = useState(initialVaccines);
  const [activeTab, setActiveTab] = useState('Timeline');

  const completed = vaccines.filter(v => v.status === 'COMPLETED');
  const upcoming = vaccines.filter(v => v.status === 'UPCOMING');

  return (
    <div className="theme-kids animate-fade-in space-y-10 pb-20">
      <HeroHeader 
        title="Vaccination Tracker"
        subtitle="Securely monitor your child's immunization progress. Stay informed about upcoming doses and historical clinical records."
        image="/assets/vaccine-header.png"
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="kids-card p-8 bg-emerald-50 border-4 border-emerald-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
               <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
               <p className="text-4xl font-black text-emerald-900 leading-tight">{completed.length}</p>
               <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Doses Completed</p>
            </div>
         </div>
         <div className="kids-card p-8 bg-sky-50 border-4 border-sky-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/20">
               <Clock className="w-8 h-8" />
            </div>
            <div>
               <p className="text-4xl font-black text-sky-900 leading-tight">{upcoming.length}</p>
               <p className="text-[10px] font-black uppercase tracking-widest text-sky-600">Upcoming Doses</p>
            </div>
         </div>
         <div className="kids-card p-8 bg-amber-50 border-4 border-amber-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
               <Bell className="w-8 h-8" />
            </div>
            <div>
               <p className="text-4xl font-black text-amber-900 leading-tight">Next Month</p>
               <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Notification Alert</p>
            </div>
         </div>
      </div>

      {/* Timeline Controls */}
      <div className="flex items-center justify-between mt-12 bg-white/50 p-2 rounded-full border-2 border-sky-50 w-fit mx-auto shadow-xl shadow-sky-900/5 backdrop-blur-md">
         {['Timeline', 'Calendar', 'History'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === tab 
                  ? 'bg-sky-900 text-white shadow-2xl scale-105' 
                  : 'text-sky-400 hover:text-sky-900'
              }`}
            >
               {tab}
            </button>
         ))}
      </div>

      {/* Interactive Timeline */}
      <div className="max-w-4xl mx-auto py-12 relative animate-fade-in">
         {/* Vertical center line */}
         <div className="absolute left-1/2 top-0 bottom-0 w-1.5 bg-sky-100 -translate-x-1/2 rounded-full hidden md:block"></div>

         <div className="space-y-12">
            {vaccines.map((v, i) => (
               <div key={v.id} className={`flex flex-col md:flex-row items-center gap-8 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} relative transition-all duration-700 group`}>
                  
                  {/* Left/Right Card */}
                  <div className={`w-full md:w-[45%] ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                     <div className={`kids-card p-8 relative overflow-hidden ${v.status === 'COMPLETED' ? 'border-emerald-100 bg-emerald-50/20' : 'border-sky-100 bg-white shadow-2xl shadow-sky-900/5'}`}>
                        <div className="flex items-start justify-between mb-6">
                           <div className={`px-4 py-2 rounded-full font-black text-[9px] uppercase tracking-widest ${v.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-sky-100 text-sky-600'}`}>
                              {v.age}
                           </div>
                           {v.status === 'COMPLETED' ? (
                              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                           ) : (
                              <div className="flex items-center gap-2 text-amber-500">
                                 <AlertCircle className="w-5 h-5 animate-pulse" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">Action Needed</span>
                              </div>
                           )}
                        </div>
                        <h3 className="text-2xl font-black text-sky-950 mb-2">{v.name}</h3>
                        <p className="text-sm font-bold text-sky-700/60 leading-relaxed mb-4">{v.description}</p>
                        <div className="flex items-center gap-2 text-xs font-black text-sky-400 uppercase tracking-widest">
                           <Calendar className="w-4 h-4" />
                           {new Date(v.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                     </div>
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-1/2 -translate-x-1/2 z-10 hidden md:block">
                     <div className={`w-12 h-12 rounded-[2rem] border-8 border-white shadow-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-125 ${
                        v.status === 'COMPLETED' ? 'bg-emerald-500 text-white' : 'bg-sky-100 text-sky-400'
                     }`}>
                        <ShieldCheck className="w-4 h-4" />
                     </div>
                  </div>

                  {/* Empty Spacer for desktop */}
                  <div className="hidden md:block w-full md:w-[45%]"></div>
               </div>
            ))}
         </div>
      </div>

      {/* Reminder Notification System */}
      <div className="kids-card p-10 bg-sky-900 overflow-hidden relative group">
         <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
            <Bell className="w-96 h-96 text-white" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 text-white">
            <div className="w-24 h-24 rounded-[2rem] bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center animate-bounce-slow">
               <Bell className="w-10 h-10" />
            </div>
            <div className="flex-1 space-y-3">
               <h3 className="text-3xl font-black tracking-tight leading-none uppercase">Reminder System Active</h3>
               <p className="text-sky-100 font-bold max-w-2xl text-sm leading-relaxed">Our clinical engine will send automated alerts via SMS and Email 7 days prior to every scheduled dose. Ensure your contact information is up to date.</p>
            </div>
            <div className="flex gap-4">
               <button className="bg-sky-500 text-white px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-sky-400 transition-all shadow-2xl">
                  Sync with Calendar
               </button>
               <button className="bg-white/10 text-white border border-white/20 px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all">
                  Edit Alerts
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
