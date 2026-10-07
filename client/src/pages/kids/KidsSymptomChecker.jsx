import { useState } from 'react';
import { 
  Activity, 
  Info,
  AlertTriangle,
  Stethoscope,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Plus
} from 'lucide-react';
import HeroHeader from '../../components/common/HeroHeader';

const symptomDatabase = {
  'Fever': {
    illness: 'Flu or Common Infection',
    specialization: 'Pediatrician / General Practitioner',
    care: [
      'Ensure the child is well hydrated.',
      'Dress in lightweight clothing.',
      'Monitor temperature every 4 hours.',
      'Consult a doctor before giving any medication.'
    ],
    emergency: 'Temperature above 102°F (39°C) or persistent for more than 48 hours.'
  },
  'Cough': {
    illness: 'Common Cold or Bronchitis',
    specialization: 'Pediatrician / Pulmonologist',
    care: [
      'Use a humidifier in the child\'s room.',
      'Offer warm fluids if the child is over 1 year old.',
      'Keep the child in an upright position for easier breathing.',
      'Avoid irritants like smoke or strong perfumes.'
    ],
    emergency: 'Difficulty breathing, wheezing, or bluish skin color.'
  },
  'Vomiting': {
    illness: 'Gastroenteritis or Food Sensitivity',
    specialization: 'Pediatric Gastroenterologist',
    care: [
      'Stop solid foods for 6-8 hours.',
      'Offer small sips of oral rehydration solution (ORS).',
      'Restart light foods like bananas or rice slowly.',
      'Monitor for signs of dehydration.'
    ],
    emergency: 'Signs of dehydration: dry mouth, no tears when crying, or decreased urination.'
  },
  'Rashes': {
    illness: 'Allergic Reaction or Viral Rash',
    specialization: 'Pediatric Dermatologist',
    care: [
      'Avoid scratching the affected area.',
      'Use mild, fragrance-free soap for bathing.',
      'Apply cool compresses for itching relief.',
      'Identify and remove any potential allergens.'
    ],
    emergency: 'Rapidly spreading rash with fever or difficulty breathing.'
  },
  'Stomach pain': {
    illness: 'Indigestion or Appendicitis (if severe)',
    specialization: 'Pediatrician',
    care: [
      'Encourage resting in a comfortable position.',
      'Apply a warm compress on the abdomen.',
      'Avoid heavy or spicy foods.',
      'Check for associated symptoms like fever or vomiting.'
    ],
    emergency: 'Severe, localized pain in the lower right abdomen or refusal to walk.'
  }
};

export default function KidsSymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };

  const analyzeSymptoms = () => {
    if (selectedSymptoms.length === 0) return;
    // For simplicity, we'll return the most severe-sounding one or the first one selected
    setResult(symptomDatabase[selectedSymptoms[0]]);
  };

  const reset = () => {
    setSelectedSymptoms([]);
    setResult(null);
  };

  return (
    <div className="theme-kids animate-fade-in space-y-10 pb-20">
      <HeroHeader 
        title="Kids Symptom Checker"
        subtitle="A professional guidance tool for parents to understand childhood symptoms and find the right medical specialization."
        image="/assets/symptom-header.png"
      />

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Disclaimer */}
        <div className="bg-rose-50 border-2 border-rose-100 rounded-[2.5rem] p-8 flex items-start gap-6 text-rose-900 shadow-xl shadow-rose-900/5">
           <AlertTriangle className="w-12 h-12 flex-shrink-0 text-rose-500 animate-pulse" />
           <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-tight">Medical Disclaimer</h3>
              <p className="text-sm font-bold opacity-80 leading-relaxed">This tool is for guidance and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your pediatrician or other qualified health provider with any questions you may have regarding a medical condition. In case of emergency, contact your local emergency services (108/911) immediately.</p>
           </div>
        </div>

        {!result ? (
           <div className="kids-card p-12 space-y-10">
              <div className="space-y-4">
                 <h2 className="text-3xl font-black text-sky-900 tracking-tight">Identify Symptoms</h2>
                 <p className="text-sky-700/60 font-bold">Select one or more symptoms your child is currently experiencing to receive guidance.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                 {Object.keys(symptomDatabase).map(symptom => (
                    <button 
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`p-8 rounded-[2.5rem] border-4 transition-all duration-300 text-center flex flex-col items-center gap-4 ${
                        selectedSymptoms.includes(symptom)
                          ? 'border-sky-500 bg-sky-50 translate-y-[-5px] shadow-xl shadow-sky-900/10'
                          : 'border-sky-100 bg-white hover:border-sky-300 hover:bg-sky-50/30'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        selectedSymptoms.includes(symptom) ? 'bg-sky-500 text-white' : 'bg-sky-50 text-sky-400'
                      }`}>
                         <Plus className={`w-6 h-6 transition-transform ${selectedSymptoms.includes(symptom) ? 'rotate-45' : ''}`} />
                      </div>
                      <span className="font-black text-sky-900 uppercase tracking-widest text-[10px]">{symptom}</span>
                    </button>
                 ))}
              </div>

              <div className="pt-8">
                 <button 
                   onClick={analyzeSymptoms}
                   disabled={selectedSymptoms.length === 0}
                   className="w-full bg-sky-500 text-white py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-sky-600 shadow-2xl shadow-sky-500/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 flex items-center justify-center gap-3"
                 >
                    Initialize Diagnostic Engine
                    <ChevronRight className="w-5 h-5" />
                 </button>
              </div>
           </div>
        ) : (
           <div className="space-y-8 animate-slide-up">
              <div className="kids-card p-12 border-4 border-emerald-100 shadow-emerald-900/5">
                 <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-40 h-40 rounded-[3rem] bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner p-10">
                       <Stethoscope className="w-full h-full" />
                    </div>
                    <div className="flex-1 space-y-4 text-center md:text-left">
                       <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full font-black text-[10px] uppercase tracking-widest">
                          <ShieldCheck className="w-3 h-3" />
                          Guidance Result
                       </div>
                       <h2 className="text-4xl font-black text-sky-900 tracking-tight leading-none uppercase">Potential {result.illness}</h2>
                       <p className="text-sky-700/60 font-bold">Based on symptoms of: <span className="text-sky-500">{selectedSymptoms.join(', ')}</span></p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 pt-12 border-t-2 border-sky-50">
                    <div className="space-y-6">
                       <h3 className="text-xl font-black text-sky-900 tracking-tight uppercase flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                             <Info className="w-4 h-4" />
                          </div>
                          Care Suggestions
                       </h3>
                       <ul className="space-y-4">
                          {result.care.map((item, i) => (
                             <li key={i} className="flex gap-4 text-sky-700 font-bold leading-relaxed">
                                <div className="w-6 h-6 rounded-lg bg-sky-50 flex items-center justify-center text-sky-500 flex-shrink-0 text-[10px] font-black">{i+1}</div>
                                {item}
                             </li>
                          ))}
                       </ul>
                    </div>

                    <div className="space-y-6">
                       <h3 className="text-xl font-black text-sky-900 tracking-tight uppercase flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500">
                             <AlertTriangle className="w-4 h-4" />
                          </div>
                          Emergency Markers
                       </h3>
                       <div className="p-8 bg-rose-50 border-2 border-rose-100 rounded-[2rem] text-rose-900 font-bold leading-relaxed shadow-inner">
                          {result.emergency}
                       </div>
                       
                       <div className="pt-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-sky-400 mb-4">Recommended Support</p>
                          <div className="p-6 bg-white border-2 border-sky-100 rounded-[2rem] flex items-center justify-center gap-4 text-sky-900 font-black tracking-tight text-center">
                             <Stethoscope className="w-6 h-6 text-sky-500" />
                             {result.specialization}
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="mt-12 flex flex-col md:flex-row gap-6">
                    <button 
                      onClick={reset}
                      className="flex-1 bg-sky-100 text-sky-700 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-sky-200 transition-all flex items-center justify-center gap-3"
                    >
                       <RotateCcw className="w-5 h-5" />
                       Reset Analysis
                    </button>
                    <button className="flex-1 bg-sky-900 text-white py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-3">
                       Book Pediatric Visit
                       <ChevronRight className="w-5 h-5" />
                    </button>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
