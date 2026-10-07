import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Landing from './pages/public/Landing';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManageNurses from './pages/admin/ManageNurses';
import ManagePatients from './pages/admin/ManagePatients';
import ManageDepartments from './pages/admin/ManageDepartments';
import ManageRooms from './pages/admin/ManageRooms';
import ManagePharmacy from './pages/admin/ManagePharmacy';
import ManageAppointments from './pages/admin/ManageAppointments';
import ManageFAQ from './pages/admin/ManageFAQ';
import ManageBilling from './pages/admin/ManageBilling';
import ManageEmergency from './pages/admin/ManageEmergency';
import ManageEquipment from './pages/admin/ManageEquipment';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import MyPatients from './pages/doctor/MyPatients';
import WritePrescription from './pages/doctor/WritePrescription';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import LabResults from './pages/doctor/LabResults';

// Nurse Pages
import NurseDashboard from './pages/nurse/NurseDashboard';
import WardPatients from './pages/nurse/WardPatients';
import RecordVitals from './pages/nurse/RecordVitals';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import MyPrescriptions from './pages/patient/MyPrescriptions';
import MyReports from './pages/patient/MyReports';
import MyBilling from './pages/patient/MyBilling';
import SymptomChecker from './pages/patient/SymptomChecker';
import FAQPage from './pages/public/FAQPage';

// Kids Portal Pages
import KidsDashboard from './pages/kids/KidsDashboard';
import KidsSymptomChecker from './pages/kids/KidsSymptomChecker';
import HomeRemedies from './pages/kids/HomeRemedies';
import VaccinationTracker from './pages/kids/VaccinationTracker';
import NutritionGuidance from './pages/kids/NutritionGuidance';
import NearbyDoctorSearch from './pages/kids/NearbyDoctorSearch';
import SOPLibrary from './pages/common/SOPLibrary';

// Pregnancy Portal Pages
import PregnancyDashboard from './pages/pregnancy/PregnancyDashboard';
import WeekTracker from './pages/pregnancy/WeekTracker';
import SymptomMonitor from './pages/pregnancy/SymptomMonitor';
import SafeRemedies from './pages/pregnancy/SafeRemedies';
import DietPlanner from './pages/pregnancy/DietPlanner';
import DoctorConsultation from './pages/pregnancy/DoctorConsultation';

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (roles && !roles.includes(role)) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  const { isAuthenticated, role } = useAuth();

  const getDashboardPath = () => {
    switch (role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'DOCTOR': return '/doctor/dashboard';
      case 'NURSE': return '/nurse/dashboard';
      case 'PATIENT': return '/patient/dashboard';
      case 'PARENT': return '/kids/dashboard';
      case 'PREGNANT_WOMAN': return '/pregnancy/dashboard';
      default: return '/login';
    }
  };

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={isAuthenticated ? <Navigate to={getDashboardPath()} /> : <Landing />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to={getDashboardPath()} /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to={getDashboardPath()} /> : <Register />} />
      <Route path="/kids-login" element={<Login portal="kids" />} />
      <Route path="/pregnancy-login" element={<Login portal="pregnancy" />} />
      <Route path="/faq" element={<FAQPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="doctors" element={<ManageDoctors />} />
        <Route path="nurses" element={<ManageNurses />} />
        <Route path="patients" element={<ManagePatients />} />
        <Route path="departments" element={<ManageDepartments />} />
        <Route path="rooms" element={<ManageRooms />} />
        <Route path="pharmacy" element={<ManagePharmacy />} />
        <Route path="appointments" element={<ManageAppointments />} />
        <Route path="billing" element={<ManageBilling />} />
        <Route path="faq" element={<ManageFAQ />} />
        <Route path="emergency" element={<ManageEmergency />} />
        <Route path="equipment" element={<ManageEquipment />} />
      </Route>

      {/* Doctor Routes */}
      <Route path="/doctor" element={<ProtectedRoute roles={['DOCTOR']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="patients" element={<MyPatients />} />
        <Route path="prescriptions" element={<WritePrescription />} />
        <Route path="schedule" element={<DoctorSchedule />} />
        <Route path="lab-results" element={<LabResults />} />
      </Route>

      {/* Nurse Routes */}
      <Route path="/nurse" element={<ProtectedRoute roles={['NURSE']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<NurseDashboard />} />
        <Route path="ward-patients" element={<WardPatients />} />
        <Route path="vitals" element={<RecordVitals />} />
      </Route>

      {/* Patient Routes */}
      <Route path="/patient" element={<ProtectedRoute roles={['PATIENT']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="book-appointment" element={<BookAppointment />} />
        <Route path="prescriptions" element={<MyPrescriptions />} />
        <Route path="reports" element={<MyReports />} />
        <Route path="billing" element={<MyBilling />} />
        <Route path="symptom-checker" element={<SymptomChecker />} />
      </Route>

      {/* Kids Portal Routes */}
      <Route path="/kids" element={<ProtectedRoute roles={['PARENT', 'PATIENT']}><DashboardLayout theme="kids" /></ProtectedRoute>}>
        <Route path="dashboard" element={<KidsDashboard />} />
        <Route path="symptom-checker" element={<KidsSymptomChecker />} />
        <Route path="remedies" element={<HomeRemedies />} />
        <Route path="vaccinations" element={<VaccinationTracker />} />
        <Route path="nutrition" element={<NutritionGuidance />} />
        <Route path="nearby" element={<NearbyDoctorSearch />} />
        <Route path="sop-library" element={<SOPLibrary />} />
      </Route>

      {/* Pregnancy Portal Routes */}
      <Route path="/pregnancy" element={<ProtectedRoute roles={['PREGNANT_WOMAN', 'PATIENT']}><DashboardLayout theme="pregnancy" /></ProtectedRoute>}>
        <Route path="dashboard" element={<PregnancyDashboard />} />
        <Route path="week-tracker" element={<WeekTracker />} />
        <Route path="symptoms" element={<SymptomMonitor />} />
        <Route path="remedies" element={<SafeRemedies />} />
        <Route path="nutrition" element={<DietPlanner />} />
        <Route path="consultations" element={<DoctorConsultation />} />
        <Route path="sop-library" element={<SOPLibrary />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
