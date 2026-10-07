import { Link } from 'react-router-dom';
import { Hospital, CalendarDays, Shield, Bot, Users, Stethoscope, Heart, ArrowRight, Star, Clock, Phone, Baby, Zap } from 'lucide-react';

export default function Landing() {
  const features = [
    { icon: CalendarDays, title: 'Easy Appointment Booking', desc: 'Book appointments with top specialists in just a few clicks' },
    { icon: Shield, title: 'Secure Health Records', desc: 'Your medical data is encrypted and protected with enterprise security' },
    { icon: Bot, title: 'AI Health Assistant', desc: 'Get instant health insights with our AI-powered symptom checker' },
    { icon: Baby, title: 'Kids Health Portal', desc: 'Specialized pediatric tracking, vaccination timelines, and child-safe AI guidance' },
    { icon: Heart, title: 'Pregnancy Care', desc: 'Complete maternal wellness with week-by-week trackers and safe remedy libraries' },
    { icon: Users, title: 'Multi-Role Access', desc: 'Dedicated portals for doctors, nurses, patients, and administrators' },
    { icon: Stethoscope, title: 'Doctor Recommendations', desc: 'AI-powered doctor suggestions based on your symptoms and preferences' },
    { icon: Heart, title: 'Complete Care', desc: 'From diagnosis to pharmacy to billing — everything in one place' },
  ];

  const stats = [
    { value: '500+', label: 'Expert Doctors' },
    { value: '50K+', label: 'Happy Patients' },
    { value: '100+', label: 'Departments' },
    { value: '24/7', label: 'Emergency Care' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Hospital className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MedCare<span className="text-primary-600">HMS</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-primary-600 transition">Features</a>
            <a href="#stats" className="hover:text-primary-600 transition">About</a>
            <Link to="/faq" className="hover:text-primary-600 transition">FAQ</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary !text-sm">Login</Link>
            <Link to="/register" className="btn-primary !text-sm">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Star className="w-4 h-4" /> #1 Hospital Management System
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Healthcare Made <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">Smarter</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mb-8 leading-relaxed">
              Complete hospital management with AI-powered diagnostics, seamless appointment booking, 
              digital prescriptions, and real-time health monitoring — all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register" className="btn-primary !text-base !px-8 !py-3">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/login" className="btn-secondary !text-base !px-8 !py-3">
                <Users className="w-5 h-5" /> Staff Login
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-emerald-500" /> 24/7 Support</span>
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-primary-500" /> HIPAA Compliant</span>
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-amber-500" /> Emergency: 108</span>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="w-full aspect-square max-w-lg mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-full blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl p-8 border border-primary-100 shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: '🏥', label: 'Appointments', val: '2,847' },
                    { icon: '👨‍⚕️', label: 'Doctors', val: '524' },
                    { icon: '💊', label: 'Prescriptions', val: '12,456' },
                    { icon: '📊', label: 'Reports', val: '8,923' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 cursor-default">
                      <span className="text-3xl">{item.icon}</span>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{item.val}</p>
                      <p className="text-sm text-gray-500">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Portals Entry */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-black text-[10px] uppercase tracking-widest border border-orange-200 mb-4 animate-pulse">
              <Zap className="w-3 h-3" />
              New Specialized Portals
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4 uppercase">Specialized Care Centers</h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium">Explore our newly launched, theme-tailored healthcare experiences for children and expectant mothers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Kids Health Card */}
            <div className="group relative overflow-hidden bg-white rounded-[3rem] border border-sky-100 shadow-2xl shadow-sky-900/5 transition-all duration-500 hover:shadow-sky-900/10 hover:-translate-y-2 p-12">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-150 group-hover:opacity-10 transition-all duration-700">
                <Baby className="w-48 h-48 text-sky-600" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-sky-100 flex items-center justify-center text-sky-600 shadow-inner group-hover:scale-110 transition-transform">
                  <Baby className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-sky-900 tracking-tight uppercase mb-3">Kids Health Portal</h3>
                  <p className="text-sky-700/60 font-bold leading-relaxed max-w-sm">Specialized pediatric tracking, vaccination timelines, and child-safe AI guidance for every developmental stage.</p>
                </div>
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-4 px-8 py-4 bg-sky-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/20"
                >
                  Enter Pediatric Portal
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Pregnancy Care Card */}
            <div className="group relative overflow-hidden bg-white rounded-[3rem] border border-rose-100 shadow-2xl shadow-rose-900/5 transition-all duration-500 hover:shadow-rose-900/10 hover:-translate-y-2 p-12">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-150 group-hover:opacity-10 transition-all duration-700">
                <Heart className="w-48 h-48 text-rose-600" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-rose-100 flex items-center justify-center text-rose-600 shadow-inner group-hover:scale-110 transition-transform">
                  <Heart className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-rose-900 tracking-tight uppercase mb-3">Pregnancy Care</h3>
                  <p className="text-rose-700/60 font-bold leading-relaxed max-w-sm">Complete maternal wellness with week-by-week trackers, safe remedy libraries, and diet planning tools.</p>
                </div>
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-4 px-8 py-4 bg-rose-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20"
                >
                  Enter Maternal Portal
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 gradient-bg">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-extrabold text-white">{s.value}</p>
              <p className="text-blue-200 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything You Need</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">A comprehensive hospital management system designed for modern healthcare facilities</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card p-6 hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Healthcare Experience?</h2>
          <p className="text-gray-500 mb-8 max-w-2xl mx-auto">Join thousands of patients and healthcare professionals using MedCare HMS</p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="btn-primary !text-base !px-8 !py-3">Create Account <ArrowRight className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Hospital className="w-6 h-6 text-primary-400" />
            <span className="text-white font-bold">MedCare HMS</span>
          </div>
          <p className="text-sm">© 2026 MedCare Hospital Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
