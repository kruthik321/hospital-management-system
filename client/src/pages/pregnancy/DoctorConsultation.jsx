import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  User, 
  ChevronRight, 
  ShieldCheck, 
  Plus,
  ArrowRight,
  Info,
  CalendarDays,
  Activity,
  Heart,
  ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroHeader from '../../components/common/HeroHeader';

const gynaecologists = [
  { id: 1, name: 'Dr. Sarah Wilson', specialty: 'Obstetrician & Gynaecologist', availability: 'Mon - Fri', experience: '12 Years', rating: 4.9 },
  { id: 2, name: 'Dr. Michael Chen', specialty: 'Prenatal Specialist', availability: 'Tue - Sat', experience: '15 Years', rating: 5.0 },
  { id: 3, name: 'Dr. Emily Blunt', specialty: 'Maternal Fetal Medicine', availability: 'Mon - Thu', experience: '10 Years', rating: 4.8 },
];

export default function DoctorConsultation() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('Routine Prenatal Checkup');

  const handleBooking = (e) => {
    e.preventDefault();
    alert(`Appointment requested with ${selectedDoctor.name} for ${date} at ${time}. Initializing clinical confirmation...`);
    setSelectedDoctor(null);
  };

  return (
    <div className="theme-pregnancy animate-fade-in space-y-10 pb-20">
      <div className="flex items-center gap-4 mb-8">
         <Link to="/pregnancy/dashboard" className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-rose-400 border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-900/5 group text-sm font-black">
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
         </Link>
         <h1 className="text-3xl font-black text-rose-900 tracking-tight leading-none uppercase">Prenatal Consultations</h1>
      </div>

      <HeroHeader 
        title="Expert Prenatal Care"
        subtitle="Secure world-class clinical guidance from our board-certified obstetricians and fetal medicine specialists. Track your appointments with precision."
        image="/assets/consult-header.png"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Doctor Selection Matrix */}
         <div className="lg:col-span-12 space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black text-rose-950 tracking-tight uppercase flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center">
                     <Stethoscope className="w-6 h-6" />
                  </div>
                  Available Specialists
               </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {gynaecologists.map(doc => (
                  <div key={doc.id} className={`pregnancy-card p-10 flex flex-col gap-8 transition-all duration-500 relative overflow-hidden group ${
                    selectedDoctor?.id === doc.id ? 'border-4 border-rose-400 bg-rose-50/50 scale-[1.02] shadow-2xl' : 'border-white bg-white/60 hover:shadow-xl hover:-translate-y-2'
                  }`}>
                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-700">
                        <User className="w-40 h-40" />
                     </div>
                     <div className="flex items-start justify-between relative z-10">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-rose-100 flex items-center justify-center text-rose-500 shadow-inner group-hover:rotate-6 transition-transform">
                           <User className="w-10 h-10" />
                        </div>
                        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full border border-emerald-100 font-extrabold text-[10px] uppercase tracking-widest shadow-sm">
                           Rating {doc.rating}
                        </div>
                     </div>
                     <div className="relative z-10 space-y-2">
                        <h3 className="text-2xl font-black text-rose-950 tracking-tight leading-none">{doc.name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">{doc.specialty}</p>
                     </div>
                     <div className="space-y-4 pt-4 border-t border-rose-100/30 relative z-10">
                        <div className="flex items-center justify-between text-xs font-bold text-rose-900/60">
                           <span>Experience:</span>
                           <span className="text-rose-950 font-black">{doc.experience}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold text-rose-900/60">
                           <span>Days Active:</span>
                           <span className="text-rose-950 font-black">{doc.availability}</span>
                        </div>
                     </div>
                     <button 
                       onClick={() => setSelectedDoctor(doc)}
                       className={`w-full py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                         selectedDoctor?.id === doc.id ? 'bg-rose-500 text-white shadow-2xl' : 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white'
                       }`}
                     >
                        {selectedDoctor?.id === doc.id ? 'Specialist Selected' : 'Select Specialist'}
                     </button>
                  </div>
               ))}
            </div>
         </div>

         {/* Booking Panel */}
         {selectedDoctor && (
           <div className="lg:col-span-12 animate-slide-up">
              <div className="pregnancy-card p-12 bg-white shadow-2xl shadow-rose-900/10 border-4 border-rose-100">
                 <div className="flex flex-col md:flex-row gap-12">
                    <div className="w-full md:w-1/3 space-y-8 p-10 bg-rose-50 rounded-[3rem] border border-rose-100 shadow-inner">
                       <h3 className="text-2xl font-black text-rose-950 tracking-tight uppercase leading-none">Booking Session</h3>
                       <div className="space-y-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-rose-400"><User className="w-5 h-5"/></div>
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-rose-300">Doctor</p>
                                <p className="text-sm font-black text-rose-950">{selectedDoctor.name}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-rose-400"><Calendar className="w-5 h-5"/></div>
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-rose-300">Date</p>
                                <p className="text-sm font-black text-rose-950">{date || 'Select Below'}</p>
                             </div>
                          </div>
                       </div>
                       <div className="pt-6 border-t border-rose-100 text-[10px] font-bold text-rose-400 italic">
                          Specialized prenatal slots are prioritized.
                       </div>
                    </div>

                    <form onSubmit={handleBooking} className="flex-1 space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                             <label className="block text-[10px] font-black uppercase tracking-widest text-rose-400 mb-3">Preferred Date</label>
                             <div className="relative">
                                <CalendarDays className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300" />
                                <input 
                                  type="date" 
                                  required 
                                  className="w-full pl-16 pr-8 py-5 bg-rose-50 rounded-[2rem] border border-transparent text-rose-950 font-bold focus:bg-white focus:border-rose-400 outline-none transition-all"
                                  value={date}
                                  onChange={e => setDate(e.target.value)}
                                />
                             </div>
                          </div>
                          <div>
                             <label className="block text-[10px] font-black uppercase tracking-widest text-rose-400 mb-3">Available Time Slot</label>
                             <div className="relative">
                                <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300" />
                                <select 
                                  required 
                                  className="w-full pl-16 pr-8 py-5 bg-rose-50 rounded-[2rem] border border-transparent text-rose-950 font-bold focus:bg-white focus:border-rose-400 outline-none transition-all appearance-none"
                                  value={time}
                                  onChange={e => setTime(e.target.value)}
                                >
                                   <option value="">Select Time</option>
                                   {['09:00 AM', '10:30 AM', '01:00 PM', '03:30 PM', '05:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                             </div>
                          </div>
                       </div>
                       <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-rose-400 mb-3">Primary Consultation Objective</label>
                          <select 
                            className="w-full px-8 py-5 bg-rose-50 rounded-[2rem] border border-transparent text-rose-950 font-bold focus:bg-white focus:border-rose-400 outline-none transition-all"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                          >
                             <option>Routine Prenatal Checkup</option>
                             <option>High-Resolution Ultrasound</option>
                             <option>Nutritional Counseling</option>
                             <option>Genetic Screening Review</option>
                             <option>Postpartum Planning</option>
                          </select>
                       </div>
                       <button type="submit" className="w-full bg-rose-500 text-white py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-rose-600 shadow-2xl shadow-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                          Finalize Clinical Booking
                          <ChevronRight className="w-5 h-5" />
                       </button>
                    </form>
                 </div>
              </div>
           </div>
         )}
      </div>

      {/* Benefits Card */}
      <div className="pregnancy-card p-12 overflow-hidden relative group border-4 border-emerald-50">
         <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 scale-150">
            <ShieldCheck className="w-80 h-80 text-emerald-900" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-500 text-white flex items-center justify-center p-8 shadow-2xl shadow-emerald-500/30">
               <ShieldCheck className="w-full h-full" />
            </div>
            <div className="flex-1 space-y-4">
               <h2 className="text-3xl font-black text-rose-950 leading-tight uppercase tracking-tight">The MedCare Delivery Promise</h2>
               <p className="text-rose-900/40 font-bold max-w-2xl text-base leading-relaxed">Booking regular prenatal checkups reduces delivery risks by 40%. Our unified clinical system ensures your doctor has immediate access to your symptom logs and nutritional data.</p>
            </div>
            <div className="flex flex-col gap-4">
                <div className="px-6 py-3 bg-white border border-rose-100 rounded-full font-black text-[9px] uppercase tracking-widest text-rose-600 shadow-sm flex items-center gap-3">
                    <Activity className="w-4 h-4" />
                    Tele-Health Supported
                </div>
                <div className="px-6 py-3 bg-white border border-rose-100 rounded-full font-black text-[9px] uppercase tracking-widest text-rose-600 shadow-sm flex items-center gap-3">
                    <Heart className="w-4 h-4" />
                    24/7 Support Active
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
