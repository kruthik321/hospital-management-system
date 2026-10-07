import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Hospital, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phone: '', dateOfBirth: '', gender: '', bloodGroup: '', address: '', city: '', state: '', zipCode: '' });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) return toast.error('Please fill required fields');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register({ ...form, role: 'PATIENT' });
      toast.success('Account created successfully!');
      navigate('/patient/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <Hospital className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">MedCare HMS</span>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Patient Account</h1>
          <p className="text-gray-500 mb-6">Register to book appointments, view reports, and more</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">First Name *</label>
                <input type="text" value={form.firstName} onChange={set('firstName')} className="input-field" placeholder="John" required id="reg-fname" />
              </div>
              <div>
                <label className="label">Last Name *</label>
                <input type="text" value={form.lastName} onChange={set('lastName')} className="input-field" placeholder="Doe" required id="reg-lname" />
              </div>
            </div>

            <div>
              <label className="label">Email Address *</label>
              <input type="email" value={form.email} onChange={set('email')} className="input-field" placeholder="you@example.com" required id="reg-email" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Password *</label>
                <input type="password" value={form.password} onChange={set('password')} className="input-field" placeholder="Min 6 characters" required id="reg-password" />
              </div>
              <div>
                <label className="label">Confirm Password *</label>
                <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} className="input-field" placeholder="Confirm password" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Phone</label>
                <input type="text" value={form.phone} onChange={set('phone')} className="input-field" placeholder="9876543210" />
              </div>
              <div>
                <label className="label">Date of Birth</label>
                <input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} className="input-field" />
              </div>
              <div>
                <label className="label">Gender</label>
                <select value={form.gender} onChange={set('gender')} className="input-field">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Blood Group</label>
                <select value={form.bloodGroup} onChange={set('bloodGroup')} className="input-field">
                  <option value="">Select</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div>
                <label className="label">City</label>
                <input type="text" value={form.city} onChange={set('city')} className="input-field" placeholder="Mumbai" />
              </div>
            </div>

            <div>
              <label className="label">Address</label>
              <input type="text" value={form.address} onChange={set('address')} className="input-field" placeholder="Street address" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3" id="reg-submit">
              {loading ? 'Creating Account...' : 'Create Account'} {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
