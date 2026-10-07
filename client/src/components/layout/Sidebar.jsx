import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, UserCog, Stethoscope, Building2, BedDouble,
  Pill, CalendarDays, Receipt, HelpCircle, Siren, Wrench, ClipboardList,
  Calendar, FlaskConical, Heart, Activity, ChevronLeft, ChevronRight, X,
  CreditCard, FileText, Search, Hospital, UserRoundCheck, ClipboardCheck, Baby
} from 'lucide-react';

const menuConfig = {
  ADMIN: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Doctors', icon: Stethoscope, path: '/admin/doctors' },
    { label: 'Nurses', icon: UserCog, path: '/admin/nurses' },
    { label: 'Patients', icon: UserRoundCheck, path: '/admin/patients' },
    { label: 'Appointments', icon: CalendarDays, path: '/admin/appointments' },
    { label: 'Departments', icon: Building2, path: '/admin/departments' },
    { label: 'Rooms & Beds', icon: BedDouble, path: '/admin/rooms' },
    { label: 'Pharmacy', icon: Pill, path: '/admin/pharmacy' },
    { label: 'Billing', icon: Receipt, path: '/admin/billing' },
    { label: 'Emergency', icon: Siren, path: '/admin/emergency' },
    { label: 'Equipment', icon: Wrench, path: '/admin/equipment' },
    { label: 'FAQ', icon: HelpCircle, path: '/admin/faq' },
  ],
  DOCTOR: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/doctor/dashboard' },
    { label: 'My Patients', icon: UserRoundCheck, path: '/doctor/patients' },
    { label: 'Prescriptions', icon: ClipboardList, path: '/doctor/prescriptions' },
    { label: 'My Schedule', icon: Calendar, path: '/doctor/schedule' },
    { label: 'Lab Results', icon: FlaskConical, path: '/doctor/lab-results' },
  ],
  NURSE: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/nurse/dashboard' },
    { label: 'Ward Patients', icon: UserRoundCheck, path: '/nurse/ward-patients' },
    { label: 'Record Vitals', icon: Activity, path: '/nurse/vitals' },
  ],
  PATIENT: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/patient/dashboard' },
    { label: 'Book Appointment', icon: CalendarDays, path: '/patient/book-appointment' },
    { label: 'My Prescriptions', icon: Pill, path: '/patient/prescriptions' },
    { label: 'Lab Reports', icon: ClipboardCheck, path: '/patient/reports' },
    { label: 'Billing & Payments', icon: CreditCard, path: '/patient/billing' },
    { label: 'Symptom AI', icon: Search, path: '/patient/symptom-checker' },
  ],
  PARENT: [
    { label: 'Kids Dashboard', icon: LayoutDashboard, path: '/kids/dashboard' },
    { label: 'Symptom Checker', icon: Activity, path: '/kids/symptom-checker' },
    { label: 'Home Remedies', icon: Heart, path: '/kids/remedies' },
    { label: 'Vaccinations', icon: ClipboardCheck, path: '/kids/vaccinations' },
    { label: 'Nutrition Guide', icon: Pill, path: '/kids/nutrition' },
    { label: 'Nearby Doctors', icon: Search, path: '/kids/nearby' },
    { label: 'Procedure SOPs', icon: ClipboardList, path: '/kids/sop-library' },
  ],
  PREGNANT_WOMAN: [
    { label: 'Care Dashboard', icon: LayoutDashboard, path: '/pregnancy/dashboard' },
    { label: 'Week Tracker', icon: Calendar, path: '/pregnancy/week-tracker' },
    { label: 'Symptom Monitor', icon: Activity, path: '/pregnancy/symptoms' },
    { label: 'Safe Remedies', icon: Heart, path: '/pregnancy/remedies' },
    { label: 'Nutrition Guide', icon: FileText, path: '/pregnancy/nutrition' },
    { label: 'Consultations', icon: CalendarDays, path: '/pregnancy/consultations' },
    { label: 'Procedure SOPs', icon: ClipboardList, path: '/pregnancy/sop-library' },
  ],
};

export default function Sidebar({ isOpen, onToggle }) {
  const { role, user, logout } = useAuth();
  const location = useLocation();
  const menu = menuConfig[role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={onToggle} />
      )}

      <aside className={`fixed top-0 left-0 h-full sidebar-gradient z-40 transition-all duration-300 flex flex-col shadow-2xl
        ${isOpen ? 'w-64' : 'w-20'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/5">
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0 border border-white/10 shadow-inner">
            <Hospital className="w-6 h-6 text-blue-300" />
          </div>
          {isOpen && (
            <div className="animate-fade-in pl-1">
              <h1 className="text-white font-black text-xl tracking-tight leading-none">MedCare<span className="text-blue-400">.</span></h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300/60">Health Systems</span>
            </div>
          )}
          <button onClick={onToggle} className="ml-auto text-gray-400 hover:text-white md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-hide">
          <ul className="space-y-1.5">
            {menu.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group
                    ${isActive 
                      ? 'bg-blue-600/20 text-blue-100 border border-blue-500/20 shadow-lg' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'}`
                  }
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 
                    ${location.pathname === item.path ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-300'}`} />
                  {isOpen && <span className="animate-fade-in">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Statistics / Collapse Area */}
        <div className="p-4 bg-black/20 mt-auto border-t border-white/5">
          {isOpen && (
            <div className="flex items-center gap-3 mb-4 animate-fade-in bg-white/5 p-3 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-100 font-bold truncate tracking-tight">{user?.firstName} {user?.lastName}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{role} ACTIVE</p>
                </div>
              </div>
            </div>
          )}
          <button onClick={onToggle} className="hidden md:flex w-full items-center justify-center gap-2 py-3 rounded-xl text-gray-500 hover:bg-white/5 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            {isOpen && <span>Hide Panel</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
