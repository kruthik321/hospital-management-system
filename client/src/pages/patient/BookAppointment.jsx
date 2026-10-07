import { useState, useEffect } from 'react';
import { doctorAPI, appointmentAPI, adminAPI } from '../../services/api';
import { LoadingSpinner } from '../../components/common/Components';
import { CalendarDays, Star, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookAppointment() {
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadDepts(); loadDoctors(); }, []);
  useEffect(() => { loadDoctors(); }, [selectedDept]);

  const loadDepts = async () => { try { const r = await adminAPI.getDepartments(); setDepartments(r.data); } catch {} };
  const loadDoctors = async () => { setLoading(true); try { const r = await doctorAPI.getAll({ department: selectedDept, limit: 50 }); setDoctors(r.data.data); } catch {} setLoading(false); };

  const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'];

  const handleBook = async () => {
    if (!selectedDoctor || !date || !timeSlot) return toast.error('Please complete all steps');
    setSubmitting(true);
    try {
      await appointmentAPI.create({ doctorId: selectedDoctor.id, appointmentDate: date, timeSlot, type: 'CONSULTATION', reason });
      toast.success('Appointment booked successfully! 🎉');
      setStep(4);
    } catch (err) { toast.error(err.response?.data?.error || 'Booking failed'); }
    setSubmitting(false);
  };

  return (
    <div>
      <h1 className="page-header">Book Appointment</h1>
      <p className="page-subtitle">Schedule a visit with our specialists</p>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8 max-w-xl">
        {['Select Doctor', 'Date & Time', 'Confirm'].map((label, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{step > i + 1 ? '✓' : i + 1}</div>
            <span className={`text-xs font-medium hidden sm:block ${step === i + 1 ? 'text-primary-600' : 'text-gray-400'}`}>{label}</span>
            {i < 2 && <div className={`flex-1 h-0.5 ${step > i + 1 ? 'bg-emerald-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Select Doctor */}
      {step === 1 && (
        <div>
          <div className="mb-4"><label className="label">Filter by Department</label>
            <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} className="input-field !w-64">
              <option value="">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          {loading ? <LoadingSpinner /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{doctors.map(doc => (
              <button key={doc.id} onClick={() => { setSelectedDoctor(doc); setStep(2); }}
                className={`card p-5 text-left hover:-translate-y-1 transition-all ${selectedDoctor?.id === doc.id ? 'ring-2 ring-primary-500' : ''}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold">
                    {doc.user?.firstName?.[0]}{doc.user?.lastName?.[0]}
                  </div>
                  <div><p className="font-semibold text-gray-900">Dr. {doc.user?.firstName} {doc.user?.lastName}</p><p className="text-xs text-gray-500">{doc.specialization || 'General'}</p></div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" />{doc.avgRating?.toFixed(1) || 'N/A'}</span>
                  {doc.experience && <span>{doc.experience} yrs exp</span>}
                  {doc.consultationFee && <span className="font-semibold text-gray-700">₹{doc.consultationFee}</span>}
                </div>
              </button>
            ))}{doctors.length === 0 && <p className="col-span-full text-center text-gray-400 py-8">No doctors found</p>}</div>
          )}
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && selectedDoctor && (
        <div className="max-w-xl">
          <div className="card p-5 mb-6"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">{selectedDoctor.user?.firstName?.[0]}{selectedDoctor.user?.lastName?.[0]}</div><div><p className="font-medium text-gray-900">Dr. {selectedDoctor.user?.firstName} {selectedDoctor.user?.lastName}</p><p className="text-xs text-gray-500">{selectedDoctor.specialization}</p></div></div></div>
          <div className="space-y-4">
            <div><label className="label">Select Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-field !w-48" /></div>
            {date && <div><label className="label">Select Time Slot</label><div className="grid grid-cols-3 sm:grid-cols-4 gap-2">{timeSlots.map(slot => (
              <button key={slot} onClick={() => setTimeSlot(slot)} className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${timeSlot === slot ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'}`}>
                <Clock className="w-3 h-3 inline mr-1" />{slot}
              </button>
            ))}</div></div>}
            <div><label className="label">Reason for Visit</label><textarea value={reason} onChange={e => setReason(e.target.value)} className="input-field" rows="2" placeholder="Describe your symptoms or reason..." /></div>
            <div className="flex gap-3"><button onClick={() => setStep(1)} className="btn-secondary">Back</button><button onClick={() => { if (date && timeSlot) setStep(3); else toast.error('Select date and time'); }} className="btn-primary">Continue</button></div>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="max-w-xl">
          <div className="card p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">Confirm Appointment</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <p><span className="text-gray-500">Doctor:</span> <span className="font-medium">Dr. {selectedDoctor?.user?.firstName} {selectedDoctor?.user?.lastName}</span></p>
              <p><span className="text-gray-500">Specialization:</span> {selectedDoctor?.specialization}</p>
              <p><span className="text-gray-500">Date:</span> <span className="font-medium">{new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
              <p><span className="text-gray-500">Time:</span> <span className="font-medium">{timeSlot}</span></p>
              {selectedDoctor?.consultationFee && <p><span className="text-gray-500">Fee:</span> <span className="font-semibold text-primary-600">₹{selectedDoctor.consultationFee}</span></p>}
              {reason && <p><span className="text-gray-500">Reason:</span> {reason}</p>}
            </div>
            <div className="flex gap-3"><button onClick={() => setStep(2)} className="btn-secondary">Back</button><button onClick={handleBook} disabled={submitting} className="btn-primary">{submitting ? 'Booking...' : '✓ Confirm Booking'}</button></div>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="max-w-md mx-auto text-center py-12">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"><CalendarDays className="w-10 h-10 text-emerald-600" /></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked! 🎉</h2>
          <p className="text-gray-500 mb-6">Your appointment has been scheduled. You will receive a notification when confirmed.</p>
          <button onClick={() => { setStep(1); setSelectedDoctor(null); setDate(''); setTimeSlot(''); setReason(''); }} className="btn-primary">Book Another</button>
        </div>
      )}
    </div>
  );
}
