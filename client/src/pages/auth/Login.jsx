import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Hospital, Eye, EyeOff, ArrowRight, Stethoscope, Siren, Building2, Heart, ShieldCheck, Baby, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login({ portal }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.firstName}!`);
      
      const routes = { 
        ADMIN: '/admin/dashboard', 
        DOCTOR: '/doctor/dashboard', 
        NURSE: '/nurse/dashboard', 
        PATIENT: '/patient/dashboard',
        PARENT: '/kids/dashboard',
        PREGNANT_WOMAN: '/pregnancy/dashboard'
      };
      
      const targetRole = user.role?.name;
      
      // Portal check
      if (portal === 'kids' && targetRole !== 'PARENT') {
        toast.error('This portal is reserved for Kids Health accounts.');
        setLoading(false);
        return;
      }
      if (portal === 'pregnancy' && targetRole !== 'PREGNANT_WOMAN') {
        toast.error('This portal is reserved for Pregnancy Care accounts.');
        setLoading(false);
        return;
      }

      navigate(routes[targetRole] || '/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  const portalConfigs = {
    kids: {
        title: 'Kids Health Hub',
        subtitle: 'Secure Pediatric Management Portal',
        themeClass: 'theme-kids',
        bg: 'bg-sky-500',
        icon: Baby,
        quick: { label: 'Parent Login', email: 'parent.test@hospital.com', pass: 'Parent@123', color: 'bg-sky-100 text-sky-700' }
    },
    pregnancy: {
        title: 'Pregnancy Care Hub',
        subtitle: 'Maternal Wellness Monitoring System',
        themeClass: 'theme-pregnancy',
        bg: 'bg-rose-400',
        icon: Heart,
        quick: { label: 'Prenatal Login', email: 'mom.test@hospital.com', pass: 'Mom@123', color: 'bg-rose-100 text-rose-700' }
    },
    default: {
        title: 'MedCare Clinical Portal',
        subtitle: 'Secure Emergency & Health Dashboard',
        themeClass: '',
        bg: 'bg-blue-900',
        icon: Hospital,
        quick: [
            { label: 'Doctor', icon: Stethoscope, email: 'sarah.doc@hospital.com', pass: 'Doctor@123', color: 'bg-blue-100 text-blue-700' },
            { label: 'Nurse', icon: Siren, email: 'clara.nurse@hospital.com', pass: 'Nurse@123', color: 'bg-emerald-100 text-emerald-700' },
            { label: 'Patient', icon: Heart, email: 'john@example.com', pass: 'Patient@123', color: 'bg-rose-100 text-rose-700' },
            { label: 'Admin', icon: Building2, email: 'admin@hospital.com', pass: 'Admin@123', color: 'bg-violet-100 text-violet-700' },
        ]
    }
  };

  const config = portalConfigs[portal] || portalConfigs.default;
  const PortalIcon = config.icon;

  return (
    <div className={`min-h-screen flex font-sans ${config.themeClass}`}>
      {/* Left Panel - Visual Branding */}
      <div className={`hidden lg:flex flex-1 relative overflow-hidden ${config.bg}`}>
        <img 
          src={portal === 'kids' ? '/assets/kids-login.png' : portal === 'pregnancy' ? '/assets/pregnancy-login.png' : '/assets/login-bg.png'} 
          alt="Login Branding" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 w-full flex flex-col items-center justify-center p-12 text-center text-white">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/20 shadow-2xl animate-pulse">
            <PortalIcon className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-5xl font-black mb-4 tracking-tight uppercase leading-none">{config.title}</h2>
          <p className="text-white/80 text-xl font-bold mb-12 max-w-md italic">
            "{config.subtitle}"
          </p>
          
          <div className="mt-16 flex items-center gap-2 text-white text-sm font-black uppercase tracking-widest">
            <ShieldCheck className="w-6 h-6" />
            <span>Encrypted Health Record Access</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#fdfdfd]">
        <div className="w-full max-w-md">
          <div className="mb-12 text-center lg:text-left">
            <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tight">Identity Access</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Secure Clinical Authentication Engine</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Medical Identifier (Email)</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[2rem] text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all" 
                placeholder="identity@hospital.com" 
                id="login-email" 
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Access Key (Password)</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[2rem] text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all !pr-16" 
                  placeholder="••••••••" 
                  id="login-password" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 text-white ${
                portal === 'kids' ? 'bg-sky-500 shadow-sky-500/20 hover:bg-sky-600' : 
                portal === 'pregnancy' ? 'bg-rose-500 shadow-rose-500/20 hover:bg-rose-600' : 
                'bg-blue-900 shadow-blue-900/20 hover:bg-black'
              }`}
            >
              {loading ? 'Validating Credentials...' : 'Unlock Dashboard'} {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* Quick Login Section */}
          <div className="mt-12 pt-10 border-t-2 border-gray-50">
            <p className="text-[10px] font-black text-gray-300 text-center uppercase tracking-[0.3em] mb-6 italic">Secure Demo Access</p>
            <div className="grid grid-cols-2 gap-4">
              {Array.isArray(config.quick) ? config.quick.map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => { setEmail(q.email); setPassword(q.pass); }}
                  className={`flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest px-4 py-4 rounded-2xl ${q.color} border border-transparent hover:border-current transition-all active:scale-95`}
                >
                  <q.icon className="w-4 h-4" />
                  {q.label}
                </button>
              )) : (
                <button 
                  onClick={() => { setEmail(config.quick.email); setPassword(config.quick.pass); }}
                  className={`col-span-2 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest px-4 py-6 rounded-[2rem] ${config.quick.color} border-2 border-transparent hover:border-current transition-all active:scale-95`}
                >
                  <PortalIcon className="w-5 h-5" />
                  Initialize {config.quick.label} Session
                </button>
              )}
            </div>
          </div>

          <p className="text-center text-xs font-bold text-gray-400 mt-12 uppercase tracking-widest">
            Don't have clinical access? <Link to="/register" className="text-blue-600 font-black hover:underline ml-1">Request Registration</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
