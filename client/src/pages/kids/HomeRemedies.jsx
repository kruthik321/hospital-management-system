import { useState, useEffect } from 'react';
import { 
  Heart, 
  Search, 
  Filter, 
  ChevronRight, 
  Droplet, 
  Thermometer, 
  Wind, 
  Utensils, 
  Info,
  ArrowRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import HeroHeader from '../../components/common/HeroHeader';

const remediesData = [
  { id: 1, title: 'Ginger Honey Tea', description: 'A soothing warm tea for mild cough and throat irritation.', category: 'Cold & Cough', illnessType: 'COLD', steps: 'Grind ginger, boil in water, add honey when warm (not boiling).', guidance: 'Only for children over 1 year old due to honey content.' },
  { id: 2, title: 'Luke-warm Bath', description: 'Helps gently lower body temperature during a mild fever.', category: 'Fever Care', illnessType: 'FEVER', steps: 'Use water slightly cooler than normal, avoid ice-cold water as it can cause shivering.', guidance: 'Pat the child dry immediately after the bath.' },
  { id: 3, title: 'BRAT Diet', description: 'Standard diet for recovering from minor stomach upsets and diarrhea.', category: 'Stomach Problems', illnessType: 'STOMACH', steps: 'Bananas, Rice, Applesauce, and Toast. Offer in small portions.', guidance: 'Ensure high water intake alongside the diet.' },
  { id: 4, title: 'ORS (Oral Rehydration Solution)', description: 'Essential for maintaining hydration during fluid loss.', category: 'Dehydration', illnessType: 'DEHYDRATION', steps: 'Mix the solution according to package instructions. Offer small sips frequently.', guidance: 'Critical for fever and diarrhea management.' },
  { id: 5, title: 'Cold Compress', description: 'Reduces inflammation and itching for mild skin allergies.', category: 'Mild Allergies', illnessType: 'ALLERGIES', steps: 'Apply a clean cold cloth to the itchy area for 10-15 minutes.', guidance: 'Do not use ice directly on the skin.' }
];

export default function HomeRemedies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [remedies, setRemedies] = useState(remediesData);

  const categories = ['All', 'Cold & Cough', 'Fever Care', 'Stomach Problems', 'Dehydration', 'Mild Allergies'];

  const filteredRemedies = remedies.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="theme-kids animate-fade-in space-y-10 pb-20">
      <HeroHeader 
        title="Childhood Home Remedies"
        subtitle="A curated library of safe, natural remedies for common childhood illnesses. Managed by our professional pediatric nursing staff."
        image="/assets/remedies-header.png"
      />

      <div className="flex flex-col md:flex-row items-center gap-6">
         <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400 group-focus-within:text-sky-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search remedies for specific symptoms..." 
              className="w-full pl-16 pr-8 py-5 bg-white border-2 border-sky-100 rounded-[2.5rem] text-sky-950 font-bold focus:border-sky-500 focus:shadow-xl focus:shadow-sky-900/5 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-4 bg-white border-2 border-sky-100 p-2 rounded-full overflow-x-auto scrollbar-hide max-w-full">
            {categories.map(cat => (
               <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
                    : 'text-sky-400 hover:bg-sky-50 hover:text-sky-600'
                }`}
               >
                  {cat}
               </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRemedies.map(remedy => (
          <div key={remedy.id} className="kids-card flex flex-col p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-150 transition-transform">
               <Heart className="w-40 h-40" />
            </div>
            
            <div className="relative z-10 flex flex-col h-full space-y-6">
               <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform ${
                    remedy.illnessType === 'FEVER' ? 'bg-rose-100 text-rose-500' : 
                    remedy.illnessType === 'COLD' ? 'bg-sky-100 text-sky-500' :
                    remedy.illnessType === 'STOMACH' ? 'bg-amber-100 text-amber-500' :
                    'bg-indigo-100 text-indigo-500'
                  }`}>
                     {remedy.illnessType === 'FEVER' ? <Thermometer className="w-6 h-6" /> : 
                      remedy.illnessType === 'COLD' ? <Wind className="w-6 h-6" /> :
                      remedy.illnessType === 'STOMACH' ? <Utensils className="w-6 h-6" /> :
                      <Droplet className="w-6 h-6" />}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest px-4 py-2 bg-sky-50 text-sky-500 rounded-full border border-sky-100/50">
                    {remedy.category}
                  </span>
               </div>

               <div className="space-y-4">
                  <h3 className="text-2xl font-black text-sky-950 tracking-tight leading-tight">{remedy.title}</h3>
                  <p className="text-sm font-bold text-sky-700/60 leading-relaxed">{remedy.description}</p>
               </div>

               <div className="space-y-4 pt-6 border-t border-sky-50">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400">Step Progression</p>
                  <p className="text-sm font-bold text-sky-900 leading-relaxed bg-sky-50/50 p-6 rounded-2xl border border-sky-100/30">
                    {remedy.steps}
                  </p>
               </div>

               <div className="mt-auto pt-6 flex items-start gap-3 bg-amber-50/50 p-6 rounded-2xl border border-amber-100/30">
                  <Info className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <div className="space-y-1">
                     <p className="text-[9px] font-black uppercase tracking-widest text-amber-600">Guidance Marker</p>
                     <p className="text-[11px] font-bold text-amber-900 italic leading-snug">{remedy.guidance}</p>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nursing Support Banner */}
      <div className="kids-card kids-gradient p-12 text-white overflow-hidden relative group">
         <div className="absolute top-0 right-0 p-12 opacity-10 scale-150 group-hover:scale-[1.75] transition-transform duration-[2s]">
            <Plus className="w-96 h-96" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="w-40 h-40 rounded-[3rem] bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center p-10 flex-shrink-0">
               <ShieldCheck className="w-full h-full text-white" />
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left">
               <h2 className="text-4xl font-black tracking-tight leading-none">Need a Professional Opinion?</h2>
               <p className="text-white/80 font-bold max-w-2xl leading-relaxed">Our home remedies are for common symptoms. If your child's condition does not improve within 12-24 hours, or if you feel uneasy, connect with our pediatric nursing team available 24/7.</p>
            </div>
            <button className="bg-white text-sky-600 px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3">
               Start Nursing Chat
               <ArrowRight className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  );
}
