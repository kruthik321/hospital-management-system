import { useState } from 'react';
import { 
  Utensils, 
  Droplet, 
  Heart, 
  Zap, 
  ChevronRight, 
  Info,
  Apple,
  Milk,
  Beef,
  Flame,
  Plus,
  ShieldCheck,
  AlertTriangle,
  ChevronLeft
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';
import HeroHeader from '../../components/common/HeroHeader';

const trimesterData = [
  { 
    trimester: 1, 
    label: 'First Trimester (0-13 Weeks)', 
    focus: 'Folic acid and organic development support.',
    nutrients: [
      { name: 'Folic Acid', value: 600, unit: 'mcg' },
      { name: 'Vitamin B12', value: 2.6, unit: 'mcg' },
      { name: 'Iron', value: 27, unit: 'mg' }
    ],
    eat: ['Spinach & Kale', 'Lentils', 'Citrus Fruits', 'Fortified Cereals', 'Ginger Tea'],
    avoid: ['Raw Seafood', 'Unpasteurized Milk', 'High-mercury Fish', 'Excessive Caffeine'],
    water: '2.0 - 2.5 Liters',
    chart: [
      { name: 'Carbs', value: 50 },
      { name: 'Proteins', value: 20 },
      { name: 'Fats', value: 30 }
    ]
  },
  { 
    trimester: 2, 
    label: 'Second Trimester (14-26 Weeks)', 
    focus: 'Calcium and bone development for mother and baby.',
    nutrients: [
      { name: 'Calcium', value: 1000, unit: 'mg' },
      { name: 'Vitamin D', value: 600, unit: 'IU' },
      { name: 'Magnesium', value: 350, unit: 'mg' }
    ],
    eat: ['Dairy Products', 'Almonds', 'Tofu', 'Salmon', 'Oatmeal'],
    avoid: ['Soft Cheeses', 'Processed Meat', 'Undercooked Eggs', 'Saccharin'],
    water: '2.5 - 3.0 Liters',
    chart: [
      { name: 'Carbs', value: 45 },
      { name: 'Proteins', value: 25 },
      { name: 'Fats', value: 30 }
    ]
  },
  { 
    trimester: 3, 
    label: 'Third Trimester (27-40 Weeks)', 
    focus: 'Caloric increase and brain development (DHA).',
    nutrients: [
      { name: 'DHA / Omega-3', value: 200, unit: 'mg' },
      { name: 'Iron', value: 30, unit: 'mg' },
      { name: 'Fiber', value: 30, unit: 'g' }
    ],
    eat: ['Walnuts', 'Chia Seeds', 'Lean Protein', 'Quinoa', 'Berries'],
    avoid: ['Unwashed Produce', 'Stored Salads', 'Raw Sprouts', 'Excess Salt'],
    water: '3.0 - 3.5 Liters',
    chart: [
      { name: 'Carbs', value: 45 },
      { name: 'Proteins', value: 30 },
      { name: 'Fats', value: 25 }
    ]
  }
];

const COLORS = ['#fda4af', '#99f6e4', '#c4b5fd'];

export default function DietPlanner() {
  const [selectedTrimester, setSelectedTrimester] = useState(trimesterData[1]); // Default to 2nd trimester

  return (
    <div className="theme-pregnancy animate-fade-in space-y-10 pb-20">
      <div className="flex items-center gap-4 mb-8">
         <Link to="/pregnancy/dashboard" className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-rose-400 border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-900/5 group text-sm font-black">
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
         </Link>
         <h1 className="text-3xl font-black text-rose-900 tracking-tight leading-none uppercase">Maternal Nutrition Guide</h1>
      </div>

      <HeroHeader 
        title="Pregnancy Diet Planner"
        subtitle="Scientific caloric mapping and trimester-specific nutrition charts designed for maternal health and optimal fetal development."
        image="/assets/nutrition-header.png"
      />

      {/* Trimester Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {trimesterData.map(tri => (
            <button 
              key={tri.trimester}
              onClick={() => setSelectedTrimester(tri)}
              className={`pregnancy-card p-10 flex flex-col items-center gap-6 border-4 transition-all duration-300 ${
                selectedTrimester.trimester === tri.trimester 
                  ? 'border-rose-400 bg-rose-50/50 translate-y-[-10px] shadow-2xl shadow-rose-900/10' 
                  : 'border-white bg-white/60 hover:bg-white'
              }`}
            >
               <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all ${
                 selectedTrimester.trimester === tri.trimester ? 'bg-rose-500 text-white scale-110 shadow-lg' : 'bg-rose-100 text-rose-400'
               }`}>
                  <Zap className="w-10 h-10" />
               </div>
               <span className="font-black text-xs uppercase tracking-[0.2em] text-rose-950">{tri.label}</span>
            </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Focus Overview */}
         <div className="lg:col-span-12 pregnancy-card p-12 bg-rose-900/5 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-16">
               <div className="flex-1 space-y-8">
                  <div className="inline-flex items-center gap-2 px-6 py-2 bg-white text-rose-600 rounded-full font-black text-[10px] uppercase tracking-widest border border-rose-100">
                     <ShieldCheck className="w-3 h-3" />
                     Clinical nutrition focus
                  </div>
                  <h2 className="text-4xl font-black text-rose-950 tracking-tight leading-none uppercase">Trimester {selectedTrimester.trimester} Mapping</h2>
                  <p className="text-rose-900/60 font-bold leading-relaxed max-w-2xl text-xl italic p-8 bg-white/40 rounded-[2.5rem] border border-whiteShadow shadow-inner">
                    "{selectedTrimester.focus}"
                  </p>
               </div>
               <div className="w-full md:w-1/3 aspect-square max-w-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={selectedTrimester.chart}
                           cx="50%"
                           cy="50%"
                           innerRadius={70}
                           outerRadius={110}
                           paddingAngle={10}
                           dataKey="value"
                        >
                           {selectedTrimester.chart.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         {/* Nutrient & Avoidance Section */}
         <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="pregnancy-card p-10 h-full border-4 border-emerald-50">
               <h3 className="text-2xl font-black text-rose-950 tracking-tight mb-10 uppercase flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:rotate-6 transition-transform">
                     <ShieldCheck className="w-6 h-6" />
                  </div>
                  Foods To Prioritize
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {selectedTrimester.eat.map((food, i) => (
                     <div key={i} className="flex items-center gap-6 p-6 bg-emerald-50/30 rounded-[2rem] border border-emerald-100 hover:bg-white transition-all shadow-inner group">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-emerald-500 font-black text-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">{i+1}</div>
                        <span className="text-sm font-black text-rose-950 tracking-tight">{food}</span>
                     </div>
                  ))}
               </div>
            </div>

            <div className="pregnancy-card p-10 h-full border-4 border-rose-100">
               <h3 className="text-2xl font-black text-rose-950 tracking-tight mb-10 uppercase flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center">
                     <AlertTriangle className="w-6 h-6" />
                  </div>
                  Restrictive Advisory
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {selectedTrimester.avoid.map((food, i) => (
                     <div key={i} className="flex items-center gap-6 p-6 bg-rose-50/30 rounded-[2rem] border border-rose-100 hover:bg-white transition-all shadow-inner group">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-rose-400 font-black text-sm group-hover:bg-rose-500 group-hover:text-white transition-all">{i+1}</div>
                        <span className="text-sm font-black text-rose-950 tracking-tight">{food}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Essential Nutrients & Hydration */}
         <div className="lg:col-span-8">
            <div className="pregnancy-card p-10 bg-rose-500 text-white border-none shadow-2xl h-full flex flex-col justify-between">
               <h3 className="text-2xl font-black tracking-tight mb-10 flex items-center gap-4 uppercase">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center backdrop-blur-xl">
                     <Zap className="w-8 h-8" />
                  </div>
                  Clinical Supplement Registry
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {selectedTrimester.nutrients.map((n, i) => (
                     <div key={i} className="flex flex-col gap-4 p-8 bg-white/10 rounded-[2.5rem] border border-white/10 backdrop-blur-md hover:bg-white/20 transition-all">
                        <span className="text-[10px] font-black uppercase tracking-widest text-rose-100">{n.name}</span>
                        <div className="flex items-baseline gap-2">
                           <span className="text-4xl font-black">{n.value}</span>
                           <span className="text-sm font-bold opacity-60 uppercase">{n.unit}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="lg:col-span-4">
            <div className="pregnancy-card p-10 border-4 border-rose-50 shadow-rose-900/5 h-full flex flex-col justify-center">
               <h3 className="text-xl font-black text-rose-950 tracking-tight mb-8 uppercase flex items-center gap-4 text-center justify-center">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center">
                     <Droplet className="w-6 h-6" />
                  </div>
                  Daily Hydration
               </h3>
               <div className="p-10 bg-rose-50 rounded-[3rem] text-center border-2 border-rose-100 shadow-inner">
                  <p className="text-4xl font-black text-rose-950 leading-tight mb-2 uppercase">{selectedTrimester.water}</p>
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-[0.4em] leading-relaxed">Systemic Fluid Target</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
