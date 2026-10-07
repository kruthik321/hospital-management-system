import { useState, useEffect } from 'react';
import { 
  Baby, 
  Calendar, 
  Heart, 
  Activity, 
  Pill, 
  Search, 
  Plus, 
  ShieldCheck, 
  Info,
  ChevronRight,
  TrendingUp,
  MapPin,
  Utensils,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroHeader from '../../components/common/HeroHeader';
import { StatsCard, LoadingSpinner, StatusBadge } from '../../components/common/Components';

export default function KidsDashboard() {
  const [kids, setKids] = useState([
    { id: 1, name: 'Leo', age: 4, gender: 'Male', weight: 16, height: 102, bloodGroup: 'O+', allergies: 'Peanuts', conditions: 'None' }
  ]);
  const [showAddKid, setShowAddKid] = useState(false);
  const [newKid, setNewKid] = useState({ name: '', age: '', gender: '', weight: '', height: '', bloodGroup: '', allergies: '', conditions: '' });
  const [loading, setLoading] = useState(false);

  const handleAddKid = (e) => {
    e.preventDefault();
    setKids([...kids, { ...newKid, id: Date.now() }]);
    setShowAddKid(false);
    setNewKid({ name: '', age: '', gender: '', weight: '', height: '', bloodGroup: '', allergies: '', conditions: '' });
  };

  return (
    <div className="theme-kids animate-fade-in space-y-10 pb-20">
      <HeroHeader 
        title="Kids Health Portal"
        subtitle="Professional pediatric care and health monitoring for your little ones. Manage profiles, track vaccinations, and get nutrition guidance."
        image="/assets/kids-premium-hero.png"
      />

      {/* Child Profiles Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-sky-900 tracking-tight">Your Children</h2>
        <button 
          onClick={() => setShowAddKid(true)}
          className="flex items-center gap-2 bg-sky-500 text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Child Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-sky-950">
        {kids.map(kid => (
          <div key={kid.id} className="kids-card p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-150 transition-transform">
               <Baby className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex flex-col gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-sky-100 flex items-center justify-center text-sky-600 shadow-inner">
                    <Baby className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">{kid.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400">{kid.age} Years • {kid.gender}</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100/50">
                    <p className="text-[9px] font-black uppercase tracking-widest text-sky-400 mb-1">Weight</p>
                    <p className="text-lg font-black text-sky-900">{kid.weight} kg</p>
                  </div>
                  <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100/50">
                     <p className="text-[9px] font-black uppercase tracking-widest text-sky-400 mb-1">Height</p>
                     <p className="text-lg font-black text-sky-900">{kid.height} cm</p>
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-sky-800">
                    <span className="opacity-60">Blood Group:</span>
                    <span>{kid.bloodGroup}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-sky-800">
                    <span className="opacity-60">Allergies:</span>
                    <span className="text-rose-500">{kid.allergies || 'None'}</span>
                  </div>
               </div>

               <button className="w-full mt-4 py-4 bg-sky-50 text-sky-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-sky-100 transition-colors">
                  View Full Medical History
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tools Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Symptom Checker', icon: Activity, to: '/kids/symptom-checker', color: 'bg-rose-500', shadow: 'shadow-rose-500/20' },
          { label: 'Vaccination Tracker', icon: ShieldCheck, to: '/kids/vaccinations', color: 'bg-emerald-500', shadow: 'shadow-emerald-500/20' },
          { label: 'Nutrition Guide', icon: Utensils, to: '/kids/nutrition', color: 'bg-amber-500', shadow: 'shadow-amber-500/20' },
          { label: 'Home Remedies', icon: Heart, to: '/kids/remedies', color: 'bg-indigo-500', shadow: 'shadow-indigo-500/20' },
        ].map((tool, i) => (
          <Link key={i} to={tool.to} className={`kids-card !rounded-[2.5rem] p-8 text-white relative overflow-hidden group hover:-translate-y-2 transition-all duration-500`}>
            <div className={`absolute inset-0 ${tool.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-150 transition-transform">
               <tool.icon className="w-20 h-20" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-12">
               <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <tool.icon className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-xl font-black leading-tight tracking-tight mb-2">{tool.label}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-70 group-hover:opacity-100 transition-opacity">
                     <span>Initialize</span>
                     <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
               </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Nearby Doctors Preview */}
      <div className="kids-card p-10 overflow-hidden relative border-t-4 border-t-sky-400">
        <div className="flex flex-col md:flex-row items-center gap-12">
           <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100/80 backdrop-blur-md text-sky-700 rounded-full font-black text-[10px] uppercase tracking-widest shadow-sm">
                 <MapPin className="w-3 h-3" />
                 Location Services Active
              </div>
              <h2 className="text-4xl font-black text-sky-900 tracking-tight leading-none drop-shadow-sm">Find Specialized <br/> Pediatric Help Nearby</h2>
              <p className="text-sky-700/80 font-bold leading-relaxed max-w-md">Access our network of verified pediatricians and emergency clinics. Integrated with real-time mapping for instant navigation during emergencies.</p>
              <Link to="/kids/nearby" className="inline-flex items-center gap-3 bg-sky-600 text-white px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-sky-500 hover:shadow-sky-500/30 transition-all active:scale-95 shadow-xl">
                 Launch Provider Search
                 <ChevronRight className="w-4 h-4" />
              </Link>
           </div>
           <div className="w-full md:w-1/3 aspect-square bg-gradient-to-br from-sky-50 to-blue-50 rounded-[3rem] border-8 border-white shadow-2xl flex items-center justify-center p-12">
              <div className="text-center">
                 <div className="w-24 h-24 rounded-full bg-white mx-auto mb-6 flex items-center justify-center shadow-lg transform -translate-y-4">
                    <Search className="w-10 h-10 text-sky-500" />
                 </div>
                 <p className="text-xl font-black text-sky-900 leading-tight">5 Verified <br/> Specialists <br/> <span className="text-sky-500 text-sm">within 2km</span></p>
              </div>
           </div>
        </div>
      </div>

      {/* Developmental Milestones Tracker */}
      <div className="kids-card p-10 mt-12 bg-gradient-to-r from-sky-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <TrendingUp className="w-48 h-48" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Activity className="w-8 h-8 text-sky-400" /> Developmental Milestones
            </h2>
            <p className="text-sky-200 mt-2 font-bold max-w-2xl">Track your child's crucial growth metrics—from motor skills to speech development—ensuring they hit every important marker safely.</p>
          </div>
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all">
            View Full Growth Chart
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { metric: 'Motor Skills', status: 'On Track', desc: 'Can jump with both feet, walk up stairs.', color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
            { metric: 'Speech & Language', status: 'Advanced', desc: 'Speaks in 4-5 word sentences, asks "Why".', color: 'text-sky-400', bg: 'bg-sky-400/20' },
            { metric: 'Social/Emotional', status: 'Monitoring', desc: 'Starting to share, plays make-believe.', color: 'text-amber-400', bg: 'bg-amber-400/20' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
              <div className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 ${item.color} ${item.bg}`}>
                {item.status}
              </div>
              <h4 className="text-xl font-black mb-2">{item.metric}</h4>
              <p className="text-sky-200/80 text-sm font-bold">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pediatric FAQs Section */}
      <div className="mt-12 px-2">
        <h2 className="text-2xl font-black text-sky-900 tracking-tight flex items-center gap-3 mb-8">
          <Info className="w-6 h-6 text-sky-500" /> Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            { q: "When should my baby have their first dental visit?", a: "The AAPD recommends that a child go to the dentist by age 1 or within six months after the first tooth erupts." },
            { q: "What is a normal fever for a toddler?", a: "A fever is generally considered a temperature of 100.4°F (38°C) or higher. Always contact your pediatrician if a fever persists." },
            { q: "How much sleep does my 4-year-old need?", a: "Children aged 3-5 years typically need 10 to 13 hours of sleep per 24 hours, including naps." }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-sky-100 hover:shadow-md transition-shadow cursor-pointer group">
              <h4 className="text-lg font-black text-sky-900 group-hover:text-sky-600 transition-colors">{faq.q}</h4>
              <p className="text-sky-700/70 mt-2 font-bold leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Kid Modal */}
      {showAddKid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-900/40 backdrop-blur-sm">
          <div className="kids-card w-full max-w-2xl p-12 animate-slide-up">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-3xl font-black text-sky-900 tracking-tight">Create Child Profile</h2>
               <button onClick={() => setShowAddKid(false)} className="text-sky-300 hover:text-sky-600 transition-colors"><X className="w-8 h-8" /></button>
            </div>
            <form onSubmit={handleAddKid} className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[
                 { label: 'Child Name', key: 'name', type: 'text' },
                 { label: 'Age', key: 'age', type: 'number' },
                 { label: 'Gender', key: 'gender', type: 'text' },
                 { label: 'Weight (kg)', key: 'weight', type: 'number' },
                 { label: 'Height (cm)', key: 'height', type: 'number' },
                 { label: 'Blood Group', key: 'bloodGroup', type: 'text' },
                 { label: 'Allergies', key: 'allergies', type: 'text' },
                 { label: 'Medical Conditions', key: 'conditions', type: 'text' },
               ].map(field => (
                 <div key={field.key}>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-sky-400 mb-2">{field.label}</label>
                    <input 
                      type={field.type} 
                      required 
                      className="w-full px-6 py-4 bg-sky-50 border-2 border-sky-100 rounded-3xl text-sky-900 font-bold focus:border-sky-400 focus:bg-white outline-none transition-all"
                      value={newKid[field.key]}
                      onChange={e => setNewKid({...newKid, [field.key]: e.target.value})}
                    />
                 </div>
               ))}
               <div className="md:col-span-2 pt-6">
                 <button type="submit" className="w-full bg-sky-500 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-sky-600 shadow-2xl shadow-sky-500/20 active:scale-95 transition-all">
                    Finalize Registration
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
