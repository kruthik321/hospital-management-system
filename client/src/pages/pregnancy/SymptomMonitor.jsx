import { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Plus, 
  Calendar, 
  ChevronRight, 
  ShieldCheck, 
  Info,
  Zap,
  TrendingDown,
  ChevronLeft,
  Search,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroHeader from '../../components/common/HeroHeader';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const symptomHistory = [
  { date: '2026-03-20', fatigue: 5, pain: 2, mood: 7 },
  { date: '2026-03-25', fatigue: 4, pain: 3, mood: 6 },
  { date: '2026-03-30', fatigue: 6, pain: 4, mood: 8 },
  { date: '2026-04-05', fatigue: 3, pain: 2, mood: 9 },
];

const severityColors = {
  Low: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  Moderate: 'bg-amber-100 text-amber-600 border-amber-200',
  High: 'bg-rose-100 text-rose-600 border-rose-200 shadow-lg shadow-rose-900/10'
};

export default function SymptomMonitor() {
  const [logs, setLogs] = useState([
    { id: 1, type: 'Back Pain', severity: 'Moderate', date: '2026-04-05', notes: 'Lower back stiffness after light walking.' },
    { id: 2, type: 'Morning Sickness', severity: 'Low', date: '2026-04-04', notes: 'Slight nausea in the early morning.' },
    { id: 3, idType: 'Swelling', severity: 'High', date: '2026-04-03', notes: 'Severe ankle swelling after standing for 2 hours.' },
  ]);
  const [showAddLog, setShowAddLog] = useState(false);
  const [newLog, setNewLog] = useState({ type: 'Fatigue', severity: 'Low', notes: '' });

  const handleAddLog = (e) => {
    e.preventDefault();
    setLogs([{ ...newLog, id: Date.now(), date: new Date().toISOString().split('T')[0] }, ...logs]);
    setShowAddLog(false);
    setNewLog({ type: 'Fatigue', severity: 'Low', notes: '' });
  };

  return (
    <div className="theme-pregnancy animate-fade-in space-y-10 pb-20">
      <div className="flex items-center gap-4 mb-8">
         <Link to="/pregnancy/dashboard" className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-rose-400 border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-900/5 group text-sm font-black">
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
         </Link>
         <h1 className="text-3xl font-black text-rose-900 tracking-tight leading-none uppercase">Clinical Symptom Monitor</h1>
      </div>

      <HeroHeader 
        title="Wellness & Symptom Registry"
        subtitle="Track your physiological changes with precision. Our clinical monitoring engine provides real-time alerts for symptoms requiring medical consultation."
        image="/assets/symptom-header.png"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Trend Analysis Section */}
         <div className="lg:col-span-8 space-y-8">
            <div className="pregnancy-card p-10 bg-white shadow-2xl shadow-rose-900/5 min-h-[400px]">
               <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-black text-rose-950 tracking-tight uppercase flex items-center gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center">
                        <Activity className="w-6 h-6" />
                     </div>
                     Aura & Vitality Trends
                  </h2>
               </div>
               <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={symptomHistory}>
                        <defs>
                           <linearGradient id="colorFatigue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#fda4af" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#fda4af" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="fatigue" stroke="#fda4af" fillOpacity={1} fill="url(#colorFatigue)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-rose-950 tracking-tight uppercase">Historical Log</h2>
                  <button 
                    onClick={() => setShowAddLog(true)}
                    className="flex items-center gap-2 bg-rose-500 text-white px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-2xl active:scale-95"
                  >
                     <Plus className="w-4 h-4" />
                     Initialize Symptom Entry
                  </button>
               </div>
               
               <div className="space-y-6">
                  {logs.map(log => (
                     <div key={log.id} className="pregnancy-card p-8 group overflow-hidden border-2 border-transparent hover:border-rose-100 transition-all duration-500">
                        <div className="flex items-start justify-between">
                           <div className="flex items-center gap-6">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                                log.severity === 'High' ? 'bg-rose-100 text-rose-500' : 'bg-rose-50 text-rose-300'
                              }`}>
                                 <Zap className="w-6 h-6" />
                              </div>
                              <div>
                                 <h3 className="text-xl font-black text-rose-950 tracking-tight">{log.type}</h3>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-rose-300">{new Date(log.date).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <div className={`px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border ${severityColors[log.severity] || severityColors.Low}`}>
                              {log.severity} Intensity
                           </div>
                        </div>
                        <p className="mt-6 ml-20 text-rose-900/60 font-bold leading-relaxed italic">"{log.notes}"</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Alerts & Specialist Guidance */}
         <div className="lg:col-span-4 space-y-8">
            <div className="pregnancy-card p-10 bg-rose-900 text-white border-none shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <AlertTriangle className="w-32 h-32" />
               </div>
               <div className="relative z-10 space-y-6">
                  <h3 className="text-xl font-black tracking-tight uppercase flex items-center gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6" />
                     </div>
                     Clinical Watchlist
                  </h3>
                  <div className="space-y-4">
                     {[
                       'Sudden or severe swelling',
                       'Severe headache',
                       'Vision changes',
                       'Persistent abdominal pain',
                       'Decreased baby movement'
                     ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/10 transition-all hover:bg-white/20">
                           <div className="w-2 h-2 rounded-full bg-rose-300"></div>
                           <span className="text-[11px] font-black tracking-widest uppercase">{item}</span>
                        </div>
                     ))}
                  </div>
                  <button className="w-full mt-4 py-5 bg-white text-rose-600 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all shadow-2xl active:scale-95">
                     Connect to On-Call Nurse
                  </button>
               </div>
            </div>

            <div className="pregnancy-card p-8 border-4 border-rose-100 shadow-rose-900/5">
                <h3 className="text-xl font-black text-rose-950 tracking-tight mb-8 uppercase flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center">
                     <Info className="w-6 h-6" />
                  </div>
                  Recovery Insight
               </h3>
               <div className="p-8 bg-rose-50 rounded-[2.5rem] border-2 border-rose-100 shadow-inner">
                  <div className="flex items-center justify-center gap-3 mb-6">
                     <TrendingDown className="w-5 h-5 text-emerald-500" />
                     <p className="text-xs font-black text-rose-900 uppercase tracking-widest">Symptom Frequency</p>
                  </div>
                  <p className="text-3xl font-black text-rose-950 leading-tight text-center uppercase">-15% Decline</p>
                  <p className="text-[10px] font-bold text-rose-400 text-center uppercase tracking-widest leading-relaxed mt-2">Overall Wellness Increase</p>
               </div>
            </div>
         </div>
      </div>

      {/* Add Log Modal */}
      {showAddLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-900/20 backdrop-blur-sm">
          <div className="pregnancy-card w-full max-w-xl p-12 animate-slide-up !bg-white">
            <div className="flex items-center justify-between mb-10">
               <h2 className="text-3xl font-black text-rose-900 tracking-tight uppercase">Log Specialized Symptom</h2>
               <button onClick={() => setShowAddLog(false)} className="text-rose-200 hover:text-rose-500 transition-colors"><Plus className="w-8 h-8 rotate-45" /></button>
            </div>
            <form onSubmit={handleAddLog} className="space-y-8">
               <div className="grid grid-cols-1 gap-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-rose-400 mb-3">Symptom Category</label>
                    <select 
                      className="w-full px-8 py-5 bg-rose-50 rounded-[2rem] border border-transparent text-rose-950 font-bold focus:bg-white focus:border-rose-400 outline-none transition-all shadow-inner"
                      value={newLog.type}
                      onChange={e => setNewLog({...newLog, type: e.target.value})}
                    >
                      {['Fatigue', 'Morning Sickness', 'Back Pain', 'Swelling', 'Heartburn', 'Mood Changes'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-rose-400 mb-3">Symptom Intensity</label>
                    <select 
                      className="w-full px-8 py-5 bg-rose-50 rounded-[2rem] border border-transparent text-rose-950 font-bold focus:bg-white focus:border-rose-400 outline-none transition-all shadow-inner"
                      value={newLog.severity}
                      onChange={e => setNewLog({...newLog, severity: e.target.value})}
                    >
                      {['Low', 'Moderate', 'High'].map(s => <option key={s} value={s}>{s} Severity</option>)}
                    </select>
                  </div>
               </div>
               <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-rose-400">Clinical Observations / Notes</label>
                  <textarea 
                    className="w-full px-8 py-5 bg-rose-50 rounded-[2.5rem] border border-transparent text-rose-950 font-bold focus:bg-white focus:border-rose-400 outline-none transition-all h-32 resize-none shadow-inner"
                    value={newLog.notes}
                    onChange={e => setNewLog({...newLog, notes: e.target.value})}
                    placeholder="Describe symptoms, duration, and any triggers..."
                  />
               </div>
               <button type="submit" className="w-full bg-rose-500 text-white py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-rose-600 shadow-2xl shadow-rose-500/20 active:scale-95 transition-all">
                  Commit To Health Timeline
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
