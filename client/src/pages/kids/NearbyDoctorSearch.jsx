import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Phone, 
  Navigation, 
  Stethoscope, 
  Building2, 
  Activity, 
  ChevronRight, 
  ShieldCheck,
  Star,
  Clock
} from 'lucide-react';
import HeroHeader from '../../components/common/HeroHeader';

const mockProviders = [
  { id: 1, name: 'Dr. Sarah Wilson', hospital: 'City Pediatric Center', distance: '0.8 km', type: 'Pediatrician', rating: 4.9, phone: '+1 555-0123', address: '123 Medical Plaza, Downtown' },
  { id: 2, name: 'Emergency Care Unit', hospital: 'Metro General Hospital', distance: '1.2 km', type: 'Emergency Clinic', rating: 4.7, phone: '+1 555-9000', address: '456 Hospital Road, North Wing' },
  { id: 3, name: 'Dr. Michael Chen', hospital: 'Chen Kids Clinic', distance: '2.1 km', type: 'Pediatric Specialist', rating: 4.8, phone: '+1 555-0456', address: '789 Wellness St, Suite 200' },
  { id: 4, name: 'Little Hearts Hospital', hospital: 'Specialized Child Care', distance: '3.5 km', type: 'Children Hospital', rating: 5.0, phone: '+1 555-0789', address: '101 Pediatric Blvd' },
];

export default function NearbyDoctorSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate Google Maps API Loading
    setTimeout(() => setMapLoaded(true), 1500);
  }, []);

  const filteredProviders = mockProviders.filter(p => 
    (filter === 'All' || p.type.includes(filter)) &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.hospital.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="theme-kids animate-fade-in space-y-10 pb-20">
      <HeroHeader 
        title="Nearby Pediatric Support"
        subtitle="Locate verified pediatricians and emergency child care clinics in your immediate vicinity. Integrated with real-time navigation."
        image="/assets/maps-header.png"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Map Column */}
         <div className="lg:col-span-12 kids-card h-[500px] overflow-hidden relative border-4 border-white shadow-2xl">
            {mapLoaded ? (
               <div className="absolute inset-0 bg-sky-50 flex items-center justify-center">
                  {/* Mock Map Background */}
                  <div className="absolute inset-0 opacity-40 grayscale pointer-events-none" style={{ backgroundImage: 'url("https://www.mapwell.com/static/images/map-placeholder.png")', backgroundSize: 'cover' }}></div>
                  <div className="relative z-10 space-y-4 text-center">
                     <div className="w-20 h-20 rounded-full bg-sky-500 text-white flex items-center justify-center mx-auto shadow-2xl animate-bounce-slow">
                        <MapPin className="w-10 h-10" />
                     </div>
                     <div>
                        <p className="text-xl font-black text-sky-900 tracking-tight leading-none uppercase">Interactive Provider Map</p>
                        <p className="text-sky-400 font-bold text-xs uppercase tracking-widest mt-2 transition-opacity">Geo-location active • 4 Results Found</p>
                     </div>
                     
                     {/* Mock Pins */}
                     {mockProviders.map((p, i) => (
                        <div key={p.id} className="absolute transition-transform hover:scale-125 cursor-pointer" style={{ top: `${20 + (i*15)}%`, left: `${30 + (i*10)}%` }}>
                           <div className="bg-white px-4 py-2 rounded-full shadow-2xl border-2 border-sky-500 flex items-center gap-2 whitespace-nowrap">
                              <Stethoscope className="w-3 h-3 text-sky-500" />
                              <span className="text-[10px] font-black text-sky-900 uppercase tracking-tight">{p.name}</span>
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                           </div>
                        </div>
                     ))}
                  </div>
                  <div className="absolute bottom-8 right-8 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-2xl flex items-center gap-6">
                     <div className="flex -space-x-4">
                        {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-sky-100 flex items-center justify-center text-sky-500"><Stethoscope className="w-4 h-4"/></div>)}
                     </div>
                     <p className="text-xs font-black text-sky-950 uppercase tracking-widest leading-none">Nearby Providers <br/> Active In Your Sector</p>
                  </div>
               </div>
            ) : (
               <div className="absolute inset-0 bg-sky-50 flex items-center justify-center flex-col gap-6">
                  <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-black text-sky-400 uppercase tracking-[0.3em] text-xs">Initializing Google Places API...</p>
               </div>
            )}
         </div>

         {/* Search & Provider List Column */}
         <div className="lg:col-span-12 space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
               <div className="relative flex-1 group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400 group-focus-within:text-sky-600 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search by specialty, doctor name, or hospital..." 
                    className="w-full pl-16 pr-8 py-5 bg-white border-2 border-sky-100 rounded-[2.5rem] text-sky-950 font-bold focus:border-sky-500 focus:shadow-xl focus:shadow-sky-900/5 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <div className="flex items-center gap-3 bg-white p-2 border-2 border-sky-50 rounded-full">
                  {['All', 'Pediatrician', 'Emergency'].map(f => (
                     <button 
                       key={f}
                       onClick={() => setFilter(f)}
                       className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                         filter === f ? 'bg-sky-500 text-white shadow-xl shadow-sky-500/20' : 'text-sky-400 hover:text-sky-900'
                       }`}
                     >
                        {f}
                     </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {filteredProviders.map(p => (
                  <div key={p.id} className="kids-card p-10 group overflow-hidden relative">
                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform">
                        <Building2 className="w-32 h-32" />
                     </div>
                     <div className="relative z-10 space-y-6">
                        <div className="flex items-start justify-between">
                           <div className="flex items-center gap-5">
                              <div className="w-16 h-16 rounded-[2rem] bg-sky-100 flex items-center justify-center text-sky-600 shadow-inner group-hover:rotate-6 transition-transform">
                                 <Stethoscope className="w-8 h-8" />
                              </div>
                              <div>
                                 <h3 className="text-2xl font-black text-sky-950 tracking-tight">{p.name}</h3>
                                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400">{p.type}</p>
                              </div>
                           </div>
                           <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full flex items-center gap-2 font-black text-xs border border-emerald-100 shadow-sm">
                              <Star className="w-3 h-3 fill-emerald-500" />
                              {p.rating}
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div className="flex items-center justify-between p-4 bg-sky-50/50 rounded-2xl border border-sky-100/50">
                              <div className="flex items-center gap-3">
                                 <Building2 className="w-4 h-4 text-sky-400" />
                                 <span className="text-sm font-bold text-sky-900">{p.hospital}</span>
                              </div>
                              <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-full border border-sky-100 text-sky-700 font-extrabold text-[10px]">
                                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                 {p.distance}
                              </div>
                           </div>
                           <div className="flex items-center gap-3 px-4 text-sky-600/60 font-bold text-xs italic">
                              <MapPin className="w-3 h-3" />
                              {p.address}
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <a href={`tel:${p.phone}`} className="flex items-center justify-center gap-3 bg-sky-100 text-sky-700 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-sky-200 transition-all active:scale-95">
                              <Phone className="w-4 h-4" />
                              Contact Desk
                           </a>
                           <button className="flex items-center justify-center gap-3 bg-sky-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-sky-900/10">
                              <Navigation className="w-4 h-4" />
                              Get Route
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Emergency Quick Action */}
      <div className="kids-card p-10 bg-rose-50 border-4 border-rose-100 overflow-hidden relative group">
         <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 scale-150">
            <Activity className="w-80 h-80 text-rose-900" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="w-24 h-24 rounded-[2rem] bg-rose-500 text-white flex items-center justify-center p-8 shadow-2xl shadow-rose-500/30 animate-pulse">
               <ShieldCheck className="w-full h-full" />
            </div>
            <div className="flex-1 space-y-3">
               <h3 className="text-3xl font-black text-rose-950 leading-tight uppercase tracking-tight">Rapid Response Pediatric ER</h3>
               <p className="text-rose-700/60 font-bold max-w-2xl text-sm leading-relaxed">System-wide emergency pediatric care is available without prior appointment. Our centers are equipped with advanced life support and are prioritized on the map above with emerald markers.</p>
            </div>
            <button className="bg-rose-900 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl active:scale-95 flex items-center gap-3">
               Call Hotline
               <Phone className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  );
}
