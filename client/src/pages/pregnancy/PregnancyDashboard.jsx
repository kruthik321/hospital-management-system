import { useState, useEffect } from 'react';
import { 
  Heart, 
  Calendar, 
  Activity, 
  Baby, 
  Pill, 
  Search, 
  Plus, 
  ShieldCheck, 
  Info,
  ChevronRight,
  TrendingUp,
  MapPin,
  Utensils,
  User,
  Clock,
  ClipboardCheck,
  Stethoscope,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroHeader from '../../components/common/HeroHeader';
import { StatsCard, LoadingSpinner, StatusBadge } from '../../components/common/Components';

export default function PregnancyDashboard() {
  const [profile, setProfile] = useState({
    motherName: 'Elena Gilbert',
    expectedDeliveryDate: '2026-08-15',
    pregnancyWeek: 24,
    medicalHistory: 'None',
    doctorAssigned: 'Dr. Alaric Saltzman'
  });
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calculate days remaining
  const daysRemaining = Math.ceil((new Date(profile.expectedDeliveryDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="theme-pregnancy animate-fade-in space-y-10 pb-20">
      <HeroHeader 
        title="Pregnancy Care Portal"
        subtitle="Your personalized journey through motherhood. Track baby development, manage clinical appointments, and receive specialized wellness guidance."
        image="/assets/pregnancy-premium-hero.png"
      />

      {/* Mother's Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-rose-950">
        <div className="lg:col-span-8 pregnancy-card p-12 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 transition-transform duration-[2s] group-hover:scale-[1.75]">
              <Heart className="w-64 h-64 text-rose-300" />
           </div>
           
           <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="w-40 h-40 rounded-[3rem] bg-rose-100 flex items-center justify-center text-rose-400 shadow-inner p-10 flex-shrink-0">
                 <User className="w-full h-full" />
              </div>
              
              <div className="flex-1 space-y-6">
                 <div className="flex items-center justify-between">
                    <div>
                       <h2 className="text-4xl font-black tracking-tight leading-none">{profile.motherName}</h2>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-400 mt-3">Mother Health Registry</p>
                    </div>
                    <button 
                      onClick={() => setShowEditProfile(true)}
                      className="bg-white/50 backdrop-blur-md px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-rose-500 border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-900/5"
                    >
                      Update Profile
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 bg-white/40 rounded-[2rem] border border-white/50 shadow-inner">
                       <p className="text-[9px] font-black uppercase tracking-widest text-rose-400 mb-2">Pregnancy Stage</p>
                       <p className="text-2xl font-black text-rose-900 leading-none">Week {profile.pregnancyWeek}</p>
                    </div>
                    <div className="p-6 bg-white/40 rounded-[2rem] border border-white/50 shadow-inner text-right">
                       <p className="text-[9px] font-black uppercase tracking-widest text-rose-400 mb-2">Days to Delivery</p>
                       <p className="text-2xl font-black text-rose-900 leading-none">{daysRemaining} Days</p>
                    </div>
                 </div>

                 <div className="flex flex-wrap gap-4 pt-4">
                    <div className="px-5 py-2 bg-rose-50 text-rose-600 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                       <Stethoscope className="w-3 h-3" />
                       Assigned: {profile.doctorAssigned}
                    </div>
                    <div className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                       <ClipboardCheck className="w-3 h-3" />
                       EDD: {new Date(profile.expectedDeliveryDate).toLocaleDateString()}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 pregnancy-card p-10 bg-rose-500 text-white border-none shadow-2xl flex flex-col justify-center gap-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Plus className="w-32 h-32" />
           </div>
           <div className="space-y-4 relative z-10">
              <h3 className="text-2xl font-black tracking-tight leading-tight uppercase">Quick Action <br/> Consultations</h3>
              <p className="text-rose-100 font-bold text-sm leading-relaxed opacity-80">Book your prenatal checkups or gynecologist appointments instantly.</p>
           </div>
           <Link to="/pregnancy/consultations" className="relative z-10 w-full py-5 bg-white text-rose-600 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95">
              Secure Appointment
              <ChevronRight className="w-4 h-4" />
           </Link>
        </div>
      </div>

      {/* Wellness Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Week Tracker', icon: Baby, to: '/pregnancy/week-tracker', color: 'bg-rose-100 text-rose-600', hover: 'hover:bg-rose-500 hover:text-white', shadow: 'shadow-rose-900/5' },
          { label: 'Symptom Monitor', icon: Activity, to: '/pregnancy/symptoms', color: 'bg-teal-100 text-teal-600', hover: 'hover:bg-teal-500 hover:text-white', shadow: 'shadow-teal-900/5' },
          { label: 'Nutrition Guide', icon: Utensils, to: '/pregnancy/nutrition', color: 'bg-amber-100 text-amber-600', hover: 'hover:bg-amber-500 hover:text-white', shadow: 'shadow-amber-900/5' },
          { label: 'Safe Remedies', icon: Heart, to: '/pregnancy/remedies', color: 'bg-indigo-100 text-indigo-600', hover: 'hover:bg-indigo-500 hover:text-white', shadow: 'shadow-indigo-900/5' },
        ].map((item, i) => (
          <Link key={i} to={item.to} className={`pregnancy-card p-10 flex flex-col gap-10 group transition-all duration-500 ${item.hover}`}>
            <div className={`w-16 h-16 rounded-[2.5rem] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${item.color}`}>
               <item.icon className="w-8 h-8" />
            </div>
            <div>
               <h3 className="text-xl font-black tracking-tight leading-tight uppercase">{item.label}</h3>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 mt-2 transition-all">
                  <span>Initialize Dashboard</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Visual Progress Banner */}
      <div className="pregnancy-card pregnancy-gradient p-12 text-white h-full relative overflow-hidden group">
         <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-10 transition-opacity duration-1000"></div>
         <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center p-10 shadow-2xl relative">
               <Baby className="w-full h-full" />
               <div className="absolute inset-0 border-8 border-white/10 rounded-full animate-ping"></div>
            </div>
            <div className="flex-1 space-y-4">
               <h2 className="text-4xl font-black tracking-tight leading-[0.9] uppercase">Baby Development <br /> Phase Active</h2>
               <p className="text-white/80 font-bold max-w-2xl leading-relaxed text-lg italic">"Baby is the size of a Large Eggplant. Organs are maturing, and cycles of sleep and activity are more distinct."</p>
            </div>
            <Link to="/pregnancy/week-tracker" className="bg-white text-rose-600 px-10 py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-2xl flex items-center gap-3">
               Full Weekly Insight
               <ChevronRight className="w-4 h-4" />
            </Link>
         </div>
      </div>

      {/* Trimester Premium Guide */}
      <div className="pregnancy-card p-10 mt-12 bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-white shadow-xl relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 opacity-10">
          <Heart className="w-64 h-64 text-rose-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-rose-200 text-rose-700 rounded-2xl shadow-inner">
               <Calendar className="w-6 h-6" />
            </div>
            <div>
               <h2 className="text-3xl font-black text-rose-900 tracking-tight">Trimester Navigator</h2>
               <p className="text-xs font-bold uppercase tracking-widest text-rose-500 mt-1">Your detailed roadmap to delivery</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: 1, title: 'First Trimester', weeks: 'Weeks 1 - 12', desc: 'Focus on managing morning sickness, taking prenatal vitamins, and scheduling your first ultrasound.', bg: 'bg-white', border: 'border-rose-100', text: 'text-rose-900', active: false },
              { num: 2, title: 'Second Trimester', weeks: 'Weeks 13 - 26', desc: 'Your energy returns! Time for the anatomy scan and feeling those first exciting kicks.', bg: 'bg-rose-500', border: 'border-rose-600', text: 'text-white', active: true },
              { num: 3, title: 'Third Trimester', weeks: 'Weeks 27 - End', desc: 'Preparing for labor. Focus on birth plans, hospital bags, and counting kicks.', bg: 'bg-white', border: 'border-rose-100', text: 'text-rose-900', active: false }
            ].map((trim, idx) => (
              <div key={idx} className={`p-8 rounded-[2rem] border-2 shadow-lg transition-transform hover:-translate-y-2 ${trim.bg} ${trim.border} ${trim.text}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl mb-6 ${trim.active ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-500'}`}>
                  T{trim.num}
                </div>
                <h4 className="text-2xl font-black mb-1">{trim.title}</h4>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${trim.active ? 'text-rose-200' : 'text-rose-400'}`}>{trim.weeks}</p>
                <p className={`text-sm font-bold leading-relaxed ${trim.active ? 'text-rose-100' : 'text-rose-700/70'}`}>{trim.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Maternal FAQs Section */}
      <div className="mt-12 px-2">
        <h2 className="text-2xl font-black text-rose-900 tracking-tight flex items-center gap-3 mb-8">
          <Info className="w-6 h-6 text-rose-500" /> Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            { q: "Is it safe to exercise during pregnancy?", a: "Yes, moderate exercise is highly encouraged. Walking, swimming, and prenatal yoga are great options. Always consult your doctor before starting a new routine." },
            { q: "What foods should I avoid?", a: "Avoid raw fish, unpasteurized cheese, deli meats, and high-mercury fish. Ensure all meats are fully cooked." },
            { q: "When should I go to the hospital for labor?", a: "The general rule is 5-1-1: contractions are 5 minutes apart, lasting for 1 minute, for at least 1 hour. Call your provider if your water breaks." }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 hover:shadow-md transition-shadow cursor-pointer group">
              <h4 className="text-lg font-black text-rose-900 group-hover:text-rose-500 transition-colors">{faq.q}</h4>
              <p className="text-rose-700/70 mt-2 font-bold leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-900/20 backdrop-blur-sm">
          <div className="pregnancy-card w-full max-w-2xl p-12 animate-slide-up !bg-white">
            <div className="flex items-center justify-between mb-10">
               <h2 className="text-3xl font-black text-rose-900 tracking-tight uppercase">Update Mother Health Profile</h2>
               <button onClick={() => setShowEditProfile(false)} className="text-rose-200 hover:text-rose-500 transition-colors"><X className="w-8 h-8" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowEditProfile(false); }} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: 'Mother Full Name', key: 'motherName', type: 'text' },
                    { label: 'Expected Delivery Date', key: 'expectedDeliveryDate', type: 'date' },
                    { label: 'Current Pregnancy Week', key: 'pregnancyWeek', type: 'number' },
                    { label: 'Assigned Doctor', key: 'doctorAssigned', type: 'text' },
                  ].map(field => (
                    <div key={field.key}>
                       <label className="block text-[10px] font-black uppercase tracking-widest text-rose-400 mb-3">{field.label}</label>
                       <input 
                         type={field.type} 
                         required 
                         className="w-full px-8 py-5 bg-rose-50 rounded-[2rem] border border-transparent text-rose-950 font-bold focus:bg-white focus:border-rose-400 outline-none transition-all shadow-inner"
                         value={profile[field.key]}
                         onChange={e => setProfile({...profile, [field.key]: e.target.value})}
                       />
                    </div>
                  ))}
               </div>
               <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-rose-400">Medical Chronology / History</label>
                  <textarea 
                    className="w-full px-8 py-5 bg-rose-50 rounded-[2.5rem] border border-transparent text-rose-950 font-bold focus:bg-white focus:border-rose-400 outline-none transition-all h-32 resize-none shadow-inner"
                    value={profile.medicalHistory}
                    onChange={e => setProfile({...profile, medicalHistory: e.target.value})}
                  />
               </div>
               <button type="submit" className="w-full bg-rose-500 text-white py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-rose-600 shadow-2xl shadow-rose-500/20 active:scale-95 transition-all">
                  Synchronize Health Dossier
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
