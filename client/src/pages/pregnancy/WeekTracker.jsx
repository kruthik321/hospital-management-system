import { useState } from 'react';
import { 
  Baby, 
  Heart, 
  Info, 
  Calendar, 
  Activity, 
  Zap, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft,
  ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroHeader from '../../components/common/HeroHeader';

const pregnancyWeeks = [
  { 
    week: 10, 
    size: 'Strawberry', 
    development: 'Baby is officially a fetus! All vital organs are formed and starting to function. Muscles are starting to develop, allowing for tiny movements.',
    motherChanges: 'Your waistline may be thickening. Fatigue and morning sickness might still be present, but may start to ease.',
    advice: 'Focus on folic acid and hydration. It is time for your first prenatal screening. Avoid heavy caffeine intake.',
    tips: ['Eat small, frequent meals', 'Buy a comfortable bra', 'Schedule your first trimester screening']
  },
  { 
    week: 20, 
    size: 'Banana', 
    development: 'Halfway there! Baby is developing taste buds and can swallow. Hair is starting to grow (lanugo) to protect the skin.',
    motherChanges: 'You probably have a visible bump. You might start feeling the first movements (quickening). Heartburn and leg cramps may occur.',
    advice: 'High-point of the mid-pregnancy ultrasound. Monitor your iron levels. Start sleep training on your side.',
    tips: ['Moisturize your bump skin', 'Do gentle prenatal yoga', 'Book your anomaly scan']
  },
  { 
    week: 24, 
    size: 'Large Eggplant', 
    development: 'Lungs are producing surfactant for breathing. Eyes are fully formed and can open. Face is almost completely developed.',
    motherChanges: 'Growth of the uterus may cause backaches. You might experience mild swelling in ankles. Skin on the abdomen may feel itchy.',
    advice: 'Glucose screening test for gestational diabetes is usually scheduled soon. Keep up with your pelvic floor exercises.',
    tips: ['Watch for swelling', 'Update your birth plan', 'Continue Kegel exercises']
  },
  { 
    week: 32, 
    size: 'Squash', 
    development: 'Baby is practicing breathing and opening eyes. Fat layers are filling out. Most systems are mature except the lungs.',
    motherChanges: 'Space is getting tight! You might feel breathless as the uterus pushes on your diaphragm. Braxton Hicks contractions may increase.',
    advice: 'Start monitoring baby kicks regularly. Discuss labor signs with your doctor. Pack your hospital bag basics.',
    tips: ['Plan your nursery', 'Discuss breastfeeding with a consultant', 'Take plenty of naps']
  },
  { 
    week: 40, 
    size: 'Watermelon', 
    development: 'Full term! Baby is ready to meet the world. Reflexes are sharp, and fat levels are optimal for temperature regulation.',
    motherChanges: 'Significant pressure on the bladder. Cervix is softening and dilating. You might feel a burst of "nesting" energy.',
    advice: 'Stay in close touch with your clinic. Monitor for regular contractions or water breaking. Rest as much as possible.',
    tips: ['Trust your body', 'Have your emergency contacts ready', 'Listen to your doctor\'s final instructions']
  }
];

export default function WeekTracker() {
  const [selectedWeek, setSelectedWeek] = useState(pregnancyWeeks[2]); // Default to Week 24

  return (
    <div className="theme-pregnancy animate-fade-in space-y-10 pb-20">
      <div className="flex items-center gap-4 mb-8">
         <Link to="/pregnancy/dashboard" className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-rose-400 border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-900/5 group text-sm font-black">
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
         </Link>
         <h1 className="text-3xl font-black text-rose-900 tracking-tight leading-none uppercase">Week-by-Week Tracker</h1>
      </div>

      <HeroHeader 
        title={`Week ${selectedWeek.week}: Development Alpha`}
        subtitle={`Your baby is currently the size of a ${selectedWeek.size}. Explore physiological milestones and personalized wellness advice for this specific stage.`}
        image="/assets/week-header.png"
      />

      {/* Progress Timeline Slider */}
      <div className="pregnancy-card p-10 overflow-x-auto scrollbar-hide">
         <div className="flex items-center justify-between min-w-[800px] px-6 relative">
            <div className="absolute left-12 right-12 h-1.5 bg-rose-50 rounded-full top-1/2 -translate-y-1/2 z-0"></div>
            {pregnancyWeeks.map(w => (
               <button 
                 key={w.week}
                 onClick={() => setSelectedWeek(w)}
                 className="relative z-10 flex flex-col items-center gap-4 group"
               >
                  <div className={`w-16 h-16 rounded-[2rem] border-8 border-white shadow-2xl flex items-center justify-center transition-all duration-500 ${
                    selectedWeek.week === w.week 
                      ? 'bg-rose-500 text-white scale-110 rotate-6' 
                      : 'bg-rose-100 text-rose-400 group-hover:bg-rose-200'
                  }`}>
                     <span className="text-sm font-black">{w.week}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                    selectedWeek.week === w.week ? 'text-rose-600' : 'text-rose-300'
                  }`}>Stage Milestone</span>
               </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Baby Development Insights */}
         <div className="lg:col-span-12 pregnancy-card p-12 bg-rose-900/5 overflow-hidden transition-all duration-700">
            <div className="flex flex-col md:flex-row items-center gap-16">
               <div className="w-full md:w-1/3 aspect-square max-w-[350px] relative">
                  <div className="absolute inset-0 bg-rose-500/10 rounded-full animate-pulse-slow"></div>
                  <div className="absolute inset-0 flex items-center justify-center -rotate-12 translate-y-[-10px] group">
                     <Baby className="w-48 h-48 text-rose-300/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000" />
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-8 py-3 rounded-full border border-rose-100 shadow-2xl flex items-center gap-3">
                     <Info className="w-4 h-4 text-rose-500" />
                     <span className="text-xs font-black text-rose-900 uppercase tracking-tight">Size: {selectedWeek.size}</span>
                  </div>
               </div>
               
               <div className="flex-1 space-y-8">
                  <div className="inline-flex items-center gap-2 px-6 py-2 bg-white text-rose-600 rounded-full font-black text-[10px] uppercase tracking-widest border border-rose-100">
                     <ShieldCheck className="w-3 h-3" />
                     Milestone Registry
                  </div>
                  <div className="space-y-4">
                     <h2 className="text-4xl font-black text-rose-950 tracking-tight leading-none uppercase">Physiological Development</h2>
                     <p className="text-rose-900/70 font-bold leading-relaxed text-lg italic bg-white/40 p-8 rounded-[2.5rem] border border-whiteShadow shadow-inner">
                       {selectedWeek.development}
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Mother Changes & Clinical Advice */}
         <div className="lg:col-span-8 space-y-10">
            <div className="pregnancy-card p-12 h-screen max-h-[600px] overflow-y-auto scrollbar-hide">
               <div className="space-y-12">
                  <section className="space-y-6">
                     <h3 className="text-2xl font-black text-rose-950 tracking-tight uppercase flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center shadow-inner">
                           <Activity className="w-6 h-6" />
                        </div>
                        Body Metrics & Changes
                     </h3>
                     <p className="text-rose-900/60 font-bold text-lg leading-relaxed ml-16">{selectedWeek.motherChanges}</p>
                  </section>

                  <section className="space-y-6">
                     <h3 className="text-2xl font-black text-rose-950 tracking-tight uppercase flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
                           <Zap className="w-6 h-6" />
                        </div>
                        Clinical Wellness Advice
                     </h3>
                     <div className="p-10 bg-indigo-50 border-2 border-indigo-100 rounded-[2.5rem] flex items-start gap-6 ml-16 shadow-inner">
                        <Info className="w-8 h-8 text-indigo-400 flex-shrink-0" />
                        <p className="text-indigo-900 font-black leading-relaxed">{selectedWeek.advice}</p>
                     </div>
                  </section>
               </div>
            </div>
         </div>

         {/* Specialized Tips Column */}
         <div className="lg:col-span-4 space-y-10">
            <div className="pregnancy-card p-10 bg-rose-500 text-white border-none shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150">
                  <Heart className="w-64 h-64" />
               </div>
               <div className="relative z-10 space-y-8">
                  <h3 className="text-2xl font-black tracking-tight uppercase">Stage Checklist</h3>
                  <div className="space-y-4">
                     {selectedWeek.tips.map((tip, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20 transition-all hover:bg-white/30 group-hover:translate-x-2">
                           <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-rose-500 p-1">
                              <ShieldCheck className="w-full h-full" />
                           </div>
                           <span className="text-xs font-black tracking-tight uppercase">{tip}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="pregnancy-card p-10 border-4 border-rose-100 shadow-rose-900/5">
                <h3 className="text-xl font-black text-rose-950 tracking-tight mb-8 uppercase flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center">
                     <Calendar className="w-6 h-6" />
                  </div>
                  Next Appointment
               </h3>
               <div className="p-8 bg-rose-50 rounded-[2rem] text-center border-2 border-rose-100 shadow-inner">
                  <p className="text-xl font-black text-rose-950 mb-2 uppercase italic tracking-tight">Week 26 Screening</p>
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em]">Glucose Tolerance Diagnostic</p>
                  <button className="w-full mt-6 py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20 active:scale-95">
                     Book Now
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
