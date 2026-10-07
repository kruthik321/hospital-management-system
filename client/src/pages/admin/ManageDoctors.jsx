import { useState, useEffect } from 'react';
import { doctorAPI, adminAPI } from '../../services/api';
import { DataTable, Pagination, StatusBadge, LoadingSpinner, SectionHeader, StatsCard } from '../../components/common/Components';
import { Plus, Search, Trash2, Edit2, Stethoscope, Users, Award, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '', departmentId: '', specialization: '', qualification: '', experience: '', consultationFee: '', licenseNumber: '', bio: '' });

  useEffect(() => { load(); loadDepts(); }, [page, search]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await doctorAPI.getAll({ page, limit: 10, search });
      setDoctors(res.data.data); setTotal(res.data.total); setTotalPages(res.data.totalPages);
    } catch {} setLoading(false);
  };

  const loadDepts = async () => {
    try { const res = await adminAPI.getDepartments(); setDepartments(res.data); } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await doctorAPI.create(form);
      toast.success('Doctor credentialed successfully');
      setShowModal(false);
      setForm({ email: '', password: '', firstName: '', lastName: '', phone: '', departmentId: '', specialization: '', qualification: '', experience: '', consultationFee: '', licenseNumber: '', bio: '' });
      load();
    } catch (err) { toast.error(err.response?.data?.error || 'Credentialing failure'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanent revocation of credentials. Are you sure?')) return;
    try { await doctorAPI.delete(id); toast.success('Doctor removed from registry'); load(); }
    catch { toast.error('Revocation failed'); }
  };

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const columns = [
    { header: 'Medical Practitioner', render: (r) => (
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center text-sm font-black shadow-lg">
            {r.user?.firstName?.[0]}{r.user?.lastName?.[0]}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
        </div>
        <div>
          <p className="font-bold text-gray-900 leading-tight">Dr. {r.user?.firstName} {r.user?.lastName}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">{r.user?.email}</p>
        </div>
      </div>
    )},
    { header: 'Clinical Specialty', render: (r) => (
      <div className="flex flex-col">
        <span className="text-xs font-black text-blue-700 uppercase tracking-wide">{r.specialization || 'General'}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase italic">{r.department?.name || 'Unassigned'}</span>
      </div>
    ) },
    { header: 'Experience', render: (r) => (
      <div className="flex items-center gap-2">
        <Award className="w-3.5 h-3.5 text-amber-500" />
        <span className="text-sm font-bold text-gray-700">{r.experience || 0} Years</span>
      </div>
    )},
    { header: 'Consultation Fee', render: (r) => <span className="font-black text-gray-900">₹{r.consultationFee || 0}</span> },
    { header: 'Satisfaction', render: (r) => (
      <div className="flex items-center gap-1.5">
        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        <span className="text-xs font-black text-gray-700">{r.avgRating ? r.avgRating.toFixed(1) : '5.0'}</span>
      </div>
    )},
    { header: 'Management', render: (r) => (
      <div className="flex items-center gap-2">
        <button onClick={() => handleDelete(r.id)} className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-sm border border-red-100/50">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )},
  ];

  return (
    <div className="animate-fade-in">
      <SectionHeader 
        title="Medical Registry" 
        subtitle="Manage and credential healthcare practitioners across all departments."
        icon={Stethoscope}
      >
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            value={search} 
            onChange={e => { setSearch(e.target.value); setPage(1); }} 
            className="w-64 bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-300 outline-none transition-all font-medium" 
            placeholder="Filter by name/specialty..." 
          />
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary shadow-xl shadow-blue-800/20" id="add-doctor-btn">
          <Plus className="w-4 h-4" /> Join New Practitioner
        </button>
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatsCard icon={Users} label="Active Doctors" value={total} color="primary" />
        <StatsCard icon={Award} label="Senior Staff" value={doctors.filter(d => d.experience > 10).length} color="amber" />
        <StatsCard icon={Star} label="Avg Rating" value="4.8" color="accent" />
        <StatsCard icon={Stethoscope} label="Departments" value={departments.length} color="emerald" />
      </div>

      <div className="animate-slide-up">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-6">
            <DataTable columns={columns} data={doctors} emptyMessage="No healthcare practitioners found in the registry." />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Add Doctor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-slide-up border border-blue-50">
            <div className="sticky top-0 bg-blue-50/80 backdrop-blur-md flex items-center justify-between p-8 border-b z-10">
              <div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight">Practitioner Credentialing</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Personnel Information System</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div><label className="label">Legal First Name *</label><input value={form.firstName} onChange={set('firstName')} className="input-field" required /></div>
                <div><label className="label">Legal Last Name *</label><input value={form.lastName} onChange={set('lastName')} className="input-field" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className="label">Professional Email *</label><input type="email" value={form.email} onChange={set('email')} className="input-field" required /></div>
                <div><label className="label">System Password</label><input type="password" value={form.password} onChange={set('password')} className="input-field" placeholder="Default: Doctor@123" /></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className="label">Contact Number</label><input value={form.phone} onChange={set('phone')} className="input-field" /></div>
                <div><label className="label">License / Medical ID No.</label><input value={form.licenseNumber} onChange={set('licenseNumber')} className="input-field" /></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className="label">Clinical Specialization</label><input value={form.specialization} onChange={set('specialization')} className="input-field" placeholder="e.g. Cardiology" /></div>
                <div><label className="label">Allocated Department</label>
                  <select value={form.departmentId} onChange={set('departmentId')} className="input-field">
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div><label className="label">Qualifications</label><input value={form.qualification} onChange={set('qualification')} className="input-field" placeholder="MBBS, MD" /></div>
                <div><label className="label">Experience (Years)</label><input type="number" value={form.experience} onChange={set('experience')} className="input-field" /></div>
                <div><label className="label">Consultation Fee (₹)</label><input type="number" value={form.consultationFee} onChange={set('consultationFee')} className="input-field" /></div>
              </div>
              <div><label className="label">Professional Bio / Summary</label><textarea value={form.bio} onChange={set('bio')} className="input-field" rows="3" placeholder="Brief clinical background..." /></div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Dismiss</button>
                <button type="submit" className="btn-primary px-10">Issue Credentials</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
