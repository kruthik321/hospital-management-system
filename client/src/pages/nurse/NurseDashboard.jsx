import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import HeroHeader from '../../components/common/HeroHeader';
import { StatsCard, LoadingSpinner, StatusBadge } from '../../components/common/Components';
import { Users, Activity, Pill, BedDouble, Heart, ClipboardCheck, Clock, AlertCircle, ChevronRight } from 'lucide-react';

export default function NurseDashboard() {
  const { user } = useAuth();

  const wardPatients = [
    { id: 1, name: 'John Doe', room: '101-A', condition: 'STABLE', lastVitals: '10 mins ago', bp: '120/80', hr: '72' },
    { id: 2, name: 'Sarah Smith', room: '102-B', condition: 'CRITICAL', lastVitals: '2 mins ago', bp: '90/60', hr: '110' },
    { id: 3, name: 'Mike Ross', room: '105-A', condition: 'RECOVERY', lastVitals: '1 hour ago', bp: '118/75', hr: '68' },
  ];

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      <HeroHeader 
        title={`Ward Monitor: ${user?.firstName}`}
        subtitle="Real-time coordination of patient care, vital sign telemetry, and medication protocols for assigned medical wings."
        image="/assets/nurse-header.png"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard icon={Users} label="Current Census" value="Zone A-4" color="primary" />
        <StatsCard icon={Heart} label="Vitals Queue" value="12" color="amber" />
        <StatsCard icon={Pill} label="Meds Pending" value="08" color="red" />
        <StatsCard icon={BedDouble} label="Zone Occupancy" value="92%" color="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 dashboard-card overflow-hidden">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
                   <Activity className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-gray-900 tracking-tight">Active Ward Census</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Real-time Patient Telemetry</p>
                </div>
             </div>
             <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 border-b-2 border-blue-600 pb-1 hover:text-blue-800 transition-all">View All Patients</button>
          </div>

          <div className="space-y-4">
            {wardPatients.map(p => (
              <div key={p.id} className="clinical-list-item border border-transparent hover:border-blue-100/30 group">
                <div className="flex items-center gap-5">
                   <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-[10px] shadow-sm transform transition-transform group-hover:rotate-6 ${p.condition === 'CRITICAL' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'}`}>
                      <span className="opacity-60">ROOM</span>
                      <span className="text-sm leading-none mt-0.5">{p.room}</span>
                   </div>
                   <div>
                      <p className="text-md font-black text-gray-900 uppercase tracking-tight">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                         <StatusBadge status={p.condition} />
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Check: {p.lastVitals}</span>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-10">
                   <div className="hidden xl:flex gap-6">
                      <div className="flex flex-col items-center">
                         <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">BP Index</span>
                         <span className="text-xs font-black text-gray-700">{p.bp}</span>
                      </div>
                      <div className="flex flex-col items-center">
                         <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Heart Rate</span>
                         <span className="text-xs font-black text-emerald-600">{p.hr} <span className="text-[8px] opacity-60">BPM</span></span>
                      </div>
                   </div>
                   <button className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card border-none bg-blue-50">
          <div className="flex items-center gap-4 mb-8">
             <div className="p-3 rounded-2xl bg-white text-blue-600 shadow-sm">
                <Clock className="w-5 h-5" />
             </div>
             <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Shift Protocol</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Care Management Station</p>
             </div>
          </div>
          
          <div className="space-y-6">
             <div className="p-6 bg-white rounded-[2rem] shadow-sm border border-blue-100/50">
                <div className="flex items-center gap-3 mb-4">
                   <AlertCircle className="w-4 h-4 text-amber-500" />
                   <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Immediate Task</h4>
                </div>
                <p className="text-sm font-bold text-gray-700 leading-relaxed mb-6">
                  Administer intravenous medication to Patient in Room 102-B. Ensure cardiac telemetry is synchronized.
                </p>
                <button className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-800/20 hover:bg-blue-700 transition-all">
                   Acknowledge Protocol
                </button>
             </div>

             <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Clinical Stations</span>
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-blue-50 bg-blue-200 flex items-center justify-center text-[10px] font-black text-blue-700">
                        P{i}
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
