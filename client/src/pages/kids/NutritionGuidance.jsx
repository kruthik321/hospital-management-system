import { useState } from 'react';
import { 
  Utensils, 
  Droplet, 
  Heart, 
  Zap, 
  ChevronRight, 
  Info,
  Calendar,
  Apple,
  Milk,
  Beef,
  Flame,
  Plus
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import HeroHeader from '../../components/common/HeroHeader';

const ageGroups = [
  { 
    id: '0-2', 
    label: '0-2 Years', 
    description: 'Critical growth phase focusing on breast milk, iron-rich purees, and transitioning to solids.',
    nutrients: [
      { name: 'Calcium', value: 500, unit: 'mg' },
      { name: 'Iron', value: 7, unit: 'mg' },
      { name: 'Vitamin D', value: 400, unit: 'IU' }
    ],
    foods: ['Breast Milk / Formula', 'Sweet Potato Puree', 'Avocado', 'Iron-fortified Cereal', 'Yogurt'],
    water: '0.8 - 1.2 Liters (including milk)',
    chart: [
      { name: 'Healthy Fats', value: 40 },
      { name: 'Proteins', value: 15 },
      { name: 'Carbs', value: 45 }
    ]
  },
  { 
    id: '2-5', 
    label: '2-5 Years', 
    description: 'The "Picky Eater" phase. Focus on variety, small portions, and establishing healthy habits.',
    nutrients: [
      { name: 'Calcium', value: 700, unit: 'mg' },
      { name: 'Iron', value: 7, unit: 'mg' },
      { name: 'Fiber', value: 19, unit: 'g' }
    ],
    foods: ['Whole Grains', 'Lean Poultry', 'Berries', 'Broccoli', 'Eggs'],
    water: '1.3 - 1.5 Liters',
    chart: [
      { name: 'Healthy Fats', value: 30 },
      { name: 'Proteins', value: 20 },
      { name: 'Carbs', value: 50 }
    ]
  },
  { 
    id: '5-10', 
    label: '5-10 Years', 
    description: 'High energy requirements for school and activities. Focus on complex carbs and bone health.',
    nutrients: [
      { name: 'Calcium', value: 1000, unit: 'mg' },
      { name: 'Iron', value: 10, unit: 'mg' },
      { name: 'Protein', value: 34, unit: 'g' }
    ],
    foods: ['Fish & Nuts', 'Leafy Greens', 'Cheese', 'Quinoa', 'Mixed Fruit'],
    water: '1.7 - 2.1 Liters',
    chart: [
      { name: 'Healthy Fats', value: 25 },
      { name: 'Proteins', value: 25 },
      { name: 'Carbs', value: 50 }
    ]
  },
  { 
    id: '10-15', 
    label: '10-15 Years', 
    description: 'Puberty and growth spurts. Significant increase in caloric and mineral (Iron/Calcium) needs.',
    nutrients: [
      { name: 'Calcium', value: 1300, unit: 'mg' },
      { name: 'Iron', value: 15, unit: 'mg' },
      { name: 'Protein', value: 52, unit: 'g' }
    ],
    foods: ['Red Meat / Legumes', 'Milk & Fortified Juice', 'Whole Wheat Pasta', 'Seeds', 'Seasonal Veggies'],
    water: '2.4 - 3.3 Liters',
    chart: [
      { name: 'Healthy Fats', value: 25 },
      { name: 'Proteins', value: 30 },
      { name: 'Carbs', value: 45 }
    ]
  }
];

const COLORS = ['#38bdf8', '#fb7185', '#fbbf24', '#818cf8'];

export default function NutritionGuidance() {
  const [selectedAge, setSelectedAge] = useState(ageGroups[0]);

  return (
    <div className="theme-kids animate-fade-in space-y-10 pb-20">
      <HeroHeader 
        title="Kids Nutrition Guide"
        subtitle="Scientific dietary planning and age-specific nutrition charts for optimal childhood development and growth."
        image="/assets/nutrition-header.png"
      />

      {/* Age Selection Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {ageGroups.map(age => (
            <button 
              key={age.id}
              onClick={() => setSelectedAge(age)}
              className={`kids-card p-8 flex flex-col items-center gap-4 border-4 transition-all duration-300 ${
                selectedAge.id === age.id 
                  ? 'border-sky-500 bg-sky-50 translate-y-[-10px] shadow-2xl shadow-sky-900/10' 
                  : 'border-sky-100 bg-white hover:border-sky-300'
              }`}
            >
               <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all ${
                 selectedAge.id === age.id ? 'bg-sky-500 text-white scale-110 shadow-lg shadow-sky-500/30' : 'bg-sky-50 text-sky-400'
               }`}>
                  <Calendar className="w-8 h-8" />
               </div>
               <span className="font-black text-[12px] uppercase tracking-[0.2em] text-sky-900">{age.label}</span>
            </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Detailed Insights */}
         <div className="lg:col-span-12 kids-card p-12 bg-sky-900/5 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-12">
               <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-600 rounded-full font-black text-[10px] uppercase tracking-widest">
                     <Info className="w-3 h-3" />
                     Clinical Overview
                  </div>
                  <h2 className="text-4xl font-black text-sky-950 tracking-tight leading-none uppercase">{selectedAge.label} Guidance</h2>
                  <p className="text-sky-700 font-bold leading-relaxed max-w-2xl text-lg">{selectedAge.description}</p>
               </div>
               <div className="w-full md:w-1/3 aspect-square max-w-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={selectedAge.chart}
                           cx="50%"
                           cy="50%"
                           innerRadius={60}
                           outerRadius={100}
                           paddingAngle={8}
                           dataKey="value"
                        >
                           {selectedAge.chart.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         {/* Nutrient & Food Columns */}
         <div className="lg:col-span-8 space-y-10">
            <div className="kids-card p-10 h-full">
               <h3 className="text-2xl font-black text-sky-950 tracking-tight mb-8 uppercase flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center">
                     <Apple className="w-6 h-6" />
                  </div>
                  Recommended Plate Components
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedAge.foods.map((food, i) => (
                     <div key={i} className="flex items-center gap-6 p-6 bg-sky-50 rounded-[2rem] border border-sky-100/50 group transition-all hover:bg-white hover:shadow-xl hover:shadow-sky-900/5">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-sky-500 font-black text-sm group-hover:bg-sky-500 group-hover:text-white transition-all">{i+1}</div>
                        <span className="text-sm font-black text-sky-900 tracking-tight">{food}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-10">
            <div className="kids-card p-10 bg-sky-900 text-white border-none shadow-2xl">
               <h3 className="text-xl font-black tracking-tight mb-8 flex items-center gap-4 uppercase">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center backdrop-blur-xl">
                     <Zap className="w-6 h-6" />
                  </div>
                  Essential Nutrients
               </h3>
               <div className="space-y-6">
                  {selectedAge.nutrients.map((n, i) => (
                     <div key={i} className="flex flex-col gap-2 p-6 bg-white/10 rounded-[2rem] border border-white/10 backdrop-blur-md">
                        <span className="text-[10px] font-black uppercase tracking-widest text-sky-300">{n.name}</span>
                        <div className="flex items-baseline gap-1">
                           <span className="text-3xl font-black">{n.value}</span>
                           <span className="text-sm font-bold opacity-60 uppercase">{n.unit}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="kids-card p-10 border-4 border-sky-100 shadow-sky-900/5">
               <h3 className="text-xl font-black text-sky-950 tracking-tight mb-6 uppercase flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-500 flex items-center justify-center">
                     <Droplet className="w-6 h-6" />
                  </div>
                  Hydration Goal
               </h3>
               <div className="p-8 bg-sky-50 rounded-[2.5rem] text-center border border-sky-100 shadow-inner">
                  <p className="text-4xl font-black text-sky-900 leading-tight mb-2 uppercase">{selectedAge.water}</p>
                  <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest leading-relaxed">Daily Fluid Intake Target</p>
               </div>
            </div>
         </div>
      </div>

      {/* Diet Chart Call-to-Action */}
      <div className="kids-card p-12 bg-sky-50 border-4 border-white shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-5">
            <Utensils className="w-64 h-64" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="w-32 h-32 rounded-[2.5rem] bg-sky-500 text-white flex items-center justify-center p-8 shadow-2xl shadow-sky-500/30">
               <Flame className="w-full h-full" />
            </div>
            <div className="flex-1 space-y-3">
               <h2 className="text-3xl font-black text-sky-950 leading-tight uppercase tracking-tight">Personalized Pediatric Diet Chart</h2>
               <p className="text-sky-700/60 font-bold max-w-2xl text-base leading-relaxed">Need a meal plan tailored specifically for your child's weight goals or medical conditions? Our dietitians can create a 7-day nutritional map for you.</p>
            </div>
            <button className="bg-sky-900 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl active:scale-95 flex items-center gap-3">
               Generate Custom Chart
               <ChevronRight className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  );
}
