import { useState } from 'react';
import { 
  Heart, 
  Search, 
  Filter, 
  ChevronRight, 
  Droplet, 
  Thermometer, 
  Zap, 
  Info,
  ArrowRight,
  ShieldCheck,
  Plus,
  AlertTriangle,
  Waves,
  Leaf,
  ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroHeader from '../../components/common/HeroHeader';

const remediesData = [
  { id: 1, title: 'Ginger & Lemon Infusion', description: 'Settles the stomach and reduces nausea from morning sickness.', category: 'Nausea', status: 'SAFE', duration: '5-10 Mins Prep', guidance: 'Sip slowly throughout the morning. Use fresh ginger for best results.' },
  { id: 2, title: 'Epsom Salt Foot Soak', description: 'Reduces swelling in ankles and relieves foot pain.', category: 'Swelling', status: 'SAFE', duration: '20 Mins Soak', guidance: 'Ensure water is lukewarm, not hot. Pat dry and moisturize after.' },
  { id: 3, title: 'Prenatal Pelvic Tilt', description: 'Gentle exercise to relieve lower back pressure and stiffness.', category: 'Back Pain', status: 'SAFE', duration: '10 Mins Activity', guidance: 'Perform on a soft mat. Stop if you feel any sharp pain.' },
  { id: 4, title: 'Peppermint Oil Aromatherapy', description: 'Aids in relieving tension headaches and mental fatigue.', category: 'Headaches', status: 'SAFE', duration: 'Continuous', guidance: 'Use a diffuser or apply diluted oil to temples. Consult doctor if headache persists.' },
  { id: 5, title: 'Chamomile Tea', description: 'Promotes relaxation and better sleep during late pregnancy.', category: 'Insomnia', status: 'SAFE', duration: '15 Mins Prep', guidance: 'Drink 30 minutes before bedtime. Restrict fluids 1 hour before sleep.' },
  { id: 6, title: 'Over-the-Counter Aspirin', description: 'Used for pain relief in general scenarios.', category: 'Pain', status: 'CAUTION', duration: 'Medical', guidance: 'NEVER take without explicit clinical authorization during pregnancy.' }
];

export default function SafeRemedies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Nausea', 'Swelling', 'Back Pain', 'Headaches', 'Insomnia', 'Pain'];

  const filteredRemedies = remediesData.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="theme-pregnancy animate-fade-in space-y-10 pb-20">
      <div className="flex items-center gap-4 mb-8">
         <Link to="/pregnancy/dashboard" className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-rose-400 border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-900/5 group text-sm font-black">
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
         </Link>
         <h1 className="text-3xl font-black text-rose-900 tracking-tight leading-none uppercase">Safe Wellness Library</h1>
      </div>

      <HeroHeader 
        title="Pregnancy-Safe Remedies"
        subtitle="A clinical registry of natural and traditional remedies vetted for safety during all stages of pregnancy. Follow our step-by-step guidance for safe relief."
        image="/assets/remedies-header.png"
      />

      <div className="flex flex-col md:flex-row items-center gap-6">
         <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-400 group-focus-within:text-rose-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search safe remedies for your discomforts..." 
              className="w-full pl-16 pr-8 py-5 bg-white border-2 border-rose-100 rounded-[2.5rem] text-rose-950 font-bold focus:border-rose-500 focus:shadow-xl focus:shadow-rose-900/5 outline-none transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-4 bg-white border-2 border-rose-100 p-2 rounded-full overflow-x-auto scrollbar-hide max-w-full shadow-inner">
            {categories.map(cat => (
               <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/20' 
                    : 'text-rose-400 hover:bg-rose-50 hover:text-rose-600'
                }`}
               >
                  {cat}
               </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRemedies.map(remedy => (
          <div key={remedy.id} className="pregnancy-card flex flex-col p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-700">
               <Heart className="w-40 h-40" />
            </div>
            
            <div className="relative z-10 flex flex-col h-full space-y-6">
               <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform ${
                    remedy.status === 'SAFE' ? 'bg-emerald-100 text-emerald-500' : 'bg-rose-100 text-rose-500'
                  }`}>
                     {remedy.category === 'Nausea' ? <Droplet className="w-6 h-6" /> : 
                      remedy.category === 'Swelling' ? <Waves className="w-6 h-6" /> :
                      remedy.category === 'Back Pain' ? <Zap className="w-6 h-6" /> :
                      <Leaf className="w-6 h-6" />}
                  </div>
                  <div className={`px-4 py-2 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-2 ${
                    remedy.status === 'SAFE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                  } border`}>
                    {remedy.status === 'SAFE' ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {remedy.status} Status
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-2xl font-black text-rose-950 tracking-tight leading-tight">{remedy.title}</h3>
                  <p className="text-sm font-bold text-rose-900/60 leading-relaxed bg-white/40 p-6 rounded-2xl border border-whiteShadow shadow-inner italic">"{remedy.description}"</p>
               </div>

               <div className="space-y-4 pt-6 border-t border-rose-100">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-rose-300">
                    <span>Clinical Progression</span>
                    <span className="flex items-center gap-2">
                       <Zap className="w-3 h-3" />
                       {remedy.duration}
                    </span>
                  </div>
                  <div className="p-6 bg-rose-50/50 rounded-2xl border border-rose-100/30 text-sm font-bold text-rose-900 leading-relaxed">
                    {remedy.guidance}
                  </div>
               </div>
               
               <button className="w-full mt-auto py-5 bg-white border border-rose-100 text-rose-500 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-900/5 flex items-center justify-center gap-3 active:scale-95">
                  View Detailed Prep Guide
                  <ChevronRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Specialist Support Panel */}
      <div className="pregnancy-card pregnancy-gradient p-12 text-white overflow-hidden relative group">
         <div className="absolute top-0 right-0 p-12 opacity-10 rotate-45 scale-150">
            <Heart className="w-96 h-96 text-white" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="w-40 h-40 rounded-[3rem] bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center p-10 flex-shrink-0 animate-pulse-slow">
               <ShieldCheck className="w-full h-full text-white" />
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left">
               <h2 className="text-4xl font-black tracking-tight leading-none uppercase">Herbal Security Advisory</h2>
               <p className="text-white/80 font-bold max-w-2xl leading-relaxed text-lg italic">"While these remedies are natural, individual body responses vary during pregnancy. Our on-call clinical team is available to verify any specific treatment for your case profile."</p>
            </div>
            <button className="bg-white text-rose-600 px-10 py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-2xl flex items-center gap-3">
               Consult Wellness Officer
               <ArrowRight className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  );
}
