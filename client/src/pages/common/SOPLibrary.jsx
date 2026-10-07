import { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  Info, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import HeroHeader from '../../components/common/HeroHeader';

const sopData = {
  kids: [
    { id: 1, title: 'Fever Monitoring SOP', objective: 'To standardized temperature tracking and fever management in children.', steps: ['Wash hands before treatment.', 'Use a digital thermometer (axillary or oral).', 'Record temperature every 4 hours.', 'Ensure hydration with small sips of water.', 'Contact nurse if temp > 102°F.'] },
    { id: 2, title: 'Vaccination Pre-Care', objective: 'To prepare children for immunization with minimum distress.', steps: ['Dress child in loose clothing.', 'Provide a light meal 1 hour before.', 'Prepare a favorite toy for distraction.', 'Stay calm and supportive durante the procedure.'] },
    { id: 3, title: 'Dehydration Recognition', objective: 'Early identification of fluid loss signs in infants and toddlers.', steps: ['Check for dry mouth and no tears.', 'Monitor number of wet diapers (normal: 5-8 per day).', 'Observe for sunken soft-spot (fontanel).', 'If signs present, initialize ORS immediately.'] }
  ],
  pregnancy: [
    { id: 4, title: 'Fetal Movement Counting', objective: 'Standardized procedure for daily kick counting (Kick Counts).', steps: ['Choose a time baby is active (usually after dinner).', 'Lie on your side and record time.', 'Wait for 10 distinct movements (kicks, rolls).', 'Record the stop time on your tracker.'] },
    { id: 5, title: 'Morning Sickness Management', objective: 'Protocol for managing nausea during the first trimester.', steps: ['Eat a dry cracker before getting out of bed.', 'Initialize ginger or peppermint aromatherapy.', 'Avoid heavy or spicy odors if possible.', 'Record any severe vomiting episodes.'] },
    { id: 6, title: 'Edema Monitoring SOP', objective: 'To differentiate normal pregnancy swelling from preeclampsia signs.', steps: ['Monitor ankles and hands for swelling.', 'Check if swelling is asymmetrical.', 'Assess for "pitting" (skin takes time to return after pressing).', 'Notify doctor if accompanied by a headache.'] }
  ]
};

export default function SOPLibrary() {
  const location = useLocation();
  const theme = location.pathname.includes('/kids') ? 'kids' : 'pregnancy';
  const data = sopData[theme] || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSOP, setSelectedSOP] = useState(data[0]);

  return (
    <div className={`theme-${theme} animate-fade-in space-y-10 pb-20`}>
      <HeroHeader 
        title="Standard Operating Procedures"
        subtitle={`Clinical SOPs and procedural guidelines for ${theme === 'kids' ? 'child healthcare management' : 'maternal wellness protocols'}. Managed by clinical staff.`}
        image={`/assets/${theme}-header.png`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Navigation Column */}
         <div className="lg:col-span-4 space-y-6">
            <div className={`${theme}-card p-8 space-y-6 bg-white/50 border-none shadow-2xl`}>
               <div className="relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search SOP Index..." 
                    className={`w-full pl-12 pr-6 py-4 rounded-2xl border-2 transition-all outline-none text-sm font-black ${
                      theme === 'kids' ? 'border-sky-50 focus:border-sky-500' : 'border-rose-50 focus:border-rose-500'
                    }`}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
               </div>
               
               <div className="space-y-3">
                  {data.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                     <button 
                       key={s.id}
                       onClick={() => setSelectedSOP(s)}
                       className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all group ${
                         selectedSOP?.id === s.id 
                           ? (theme === 'kids' ? 'bg-sky-500 text-white shadow-xl shadow-sky-900/10 scale-105' : 'bg-rose-500 text-white shadow-xl shadow-rose-900/10 scale-105') 
                           : 'bg-white hover:bg-white/40'
                       }`}
                     >
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                              selectedSOP?.id === s.id ? 'bg-white/20' : 'bg-gray-100 text-gray-400'
                           }`}>
                              <FileText className="w-5 h-5" />
                           </div>
                           <span className="text-[11px] font-black uppercase tracking-widest text-left">{s.title}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${selectedSOP?.id === s.id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                     </button>
                  ))}
               </div>
            </div>
         </div>

         {/* Detailed View Column */}
         <div className="lg:col-span-8">
            {selectedSOP ? (
               <div className={`${theme}-card p-12 bg-white shadow-2xl space-y-10 border-4 ${
                 theme === 'kids' ? 'border-sky-50' : 'border-rose-50'
               }`}>
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b-2 pb-10 border-gray-50">
                     <div className="space-y-4">
                        <div className={`px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border max-w-fit ${
                          theme === 'kids' ? 'bg-sky-50 text-sky-600 border-sky-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                           Protocol ID: HMS-{selectedSOP.id}
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none uppercase">{selectedSOP.title}</h2>
                     </div>
                     <div className="flex gap-4">
                        <div className="p-4 bg-gray-50 rounded-2xl text-center min-w-[100px]">
                           <Clock className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                           <p className="text-[10px] font-black text-gray-900 uppercase">Rev: 2.1</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl text-center min-w-[100px]">
                           <ShieldCheck className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                           <p className="text-[10px] font-black text-gray-900 uppercase">Verified</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <section className="space-y-4">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-4">
                           <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${
                             theme === 'kids' ? 'bg-sky-500' : 'bg-rose-500'
                           }`}>
                              <Info className="w-4 h-4" />
                           </div>
                           Clinical Objective
                        </h3>
                        <p className="text-lg font-bold text-gray-500 leading-relaxed ml-12 italic">"{selectedSOP.objective}"</p>
                     </section>

                     <section className="space-y-6">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-4">
                           <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${
                             theme === 'kids' ? 'bg-sky-500' : 'bg-rose-500'
                           }`}>
                              <ClipboardList className="w-4 h-4" />
                           </div>
                           Step-by-Step Procedure
                        </h3>
                        <div className="space-y-4 ml-12">
                           {selectedSOP.steps.map((step, i) => (
                              <div key={i} className={`flex items-center gap-6 p-6 rounded-[2rem] border-2 transition-all hover:bg-gray-50 ${
                                theme === 'kids' ? 'border-sky-50 hover:border-sky-200' : 'border-rose-50 hover:border-rose-200'
                              }`}>
                                 <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-sm shadow-inner ${
                                   theme === 'kids' ? 'text-sky-500' : 'text-rose-500'
                                 }`}>{i+1}</div>
                                 <span className="text-sm font-black text-gray-800 uppercase tracking-tight">{step}</span>
                              </div>
                           ))}
                        </div>
                     </section>
                  </div>

                  <div className={`mt-12 p-8 rounded-[2.5rem] flex items-center gap-8 ${
                    theme === 'kids' ? 'bg-sky-50 text-sky-900' : 'bg-rose-50 text-rose-900'
                  }`}>
                     <AlertTriangle className={`w-10 h-10 flex-shrink-0 ${theme === 'kids' ? 'text-sky-500' : 'text-rose-500'}`} />
                     <p className="text-xs font-bold leading-relaxed opacity-80">These SOPs reflect localized MedCare health policies and should be followed exactly for clinical consistency. In case of procedural uncertainty, please consult a shift supervisor immediately.</p>
                  </div>
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-full p-20 text-center opacity-20">
                  <ClipboardList className="w-32 h-32 mb-8" />
                  <p className="text-2xl font-black uppercase tracking-widest">Select a Protocol to View</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
