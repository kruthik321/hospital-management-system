import { useState, useEffect } from 'react';
import { prescriptionAPI, pharmacyAPI, appointmentAPI } from '../../services/api';
import { DataTable, Pagination, LoadingSpinner } from '../../components/common/Components';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WritePrescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [medications, setMedications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ patientId: '', appointmentId: '', diagnosisNotes: '', instructions: '', followUpDate: '', items: [{ medicationId: '', dosage: '', frequency: '', duration: '', instructions: '' }] });

  useEffect(() => { load(); loadMeds(); loadAppts(); }, [page]);
  const load = async () => { setLoading(true); try { const r = await prescriptionAPI.getAll({ page, limit: 10 }); setPrescriptions(r.data.data); setTotalPages(r.data.totalPages); } catch {} setLoading(false); };
  const loadMeds = async () => { try { const r = await pharmacyAPI.getMedications(); setMedications(r.data); } catch {} };
  const loadAppts = async () => { try { const r = await appointmentAPI.getAll({ status: 'IN_PROGRESS', limit: 50 }); setAppointments(r.data.data); } catch {} };

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });
  const setItem = (idx, f) => (e) => { const items = [...form.items]; items[idx][f] = e.target.value; setForm({ ...form, items }); };
  const addItem = () => setForm({ ...form, items: [...form.items, { medicationId: '', dosage: '', frequency: '', duration: '', instructions: '' }] });
  const removeItem = (idx) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });

  const selectAppt = (e) => {
    const appt = appointments.find(a => a.id === parseInt(e.target.value));
    setForm({ ...form, appointmentId: e.target.value, patientId: appt?.patient?.id?.toString() || '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId || form.items.length === 0) return toast.error('Select patient and add medicines');
    try { await prescriptionAPI.create(form); toast.success('Prescription created'); setShowModal(false); load(); }
    catch (err) { toast.error(err.response?.data?.error || 'Error'); }
  };

  const columns = [
    { header: 'Rx #', render: (r) => <span className="font-mono text-sm">#{r.id}</span> },
    { header: 'Patient', render: (r) => <p className="font-medium text-gray-900">{r.patient?.user?.firstName} {r.patient?.user?.lastName}</p> },
    { header: 'Medicines', render: (r) => <span className="text-sm">{r.items?.length || 0} items</span> },
    { header: 'Diagnosis', render: (r) => <p className="text-sm text-gray-600 truncate max-w-[200px]">{r.diagnosisNotes || '—'}</p> },
    { header: 'Date', render: (r) => new Date(r.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6"><div><h1 className="page-header">Prescriptions</h1></div>
        <button onClick={() => setShowModal(true)} className="btn-primary"><Plus className="w-4 h-4" /> Write Prescription</button></div>
      {loading ? <LoadingSpinner /> : <DataTable columns={columns} data={prescriptions} />}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-5 border-b flex justify-between"><h2 className="text-lg font-semibold">Write Prescription</h2><button onClick={() => setShowModal(false)} className="text-gray-400">✕</button></div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div><label className="label">Appointment (In Progress)</label>
                <select value={form.appointmentId} onChange={selectAppt} className="input-field">
                  <option value="">Select appointment</option>
                  {appointments.map(a => <option key={a.id} value={a.id}>{a.patient?.user?.firstName} {a.patient?.user?.lastName} — {new Date(a.appointmentDate).toLocaleDateString()} {a.timeSlot}</option>)}
                </select>
              </div>
              <div><label className="label">Diagnosis Notes</label><textarea value={form.diagnosisNotes} onChange={set('diagnosisNotes')} className="input-field" rows="2" /></div>
              <div><label className="label">Instructions</label><textarea value={form.instructions} onChange={set('instructions')} className="input-field" rows="2" /></div>
              <div><label className="label">Follow-up Date</label><input type="date" value={form.followUpDate} onChange={set('followUpDate')} className="input-field !w-48" /></div>

              <div className="border-t pt-4"><div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-gray-900">Medicines</h3><button type="button" onClick={addItem} className="btn-secondary text-xs !px-3 !py-1"><Plus className="w-3 h-3" /> Add</button></div>
                <div className="space-y-3">{form.items.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3 relative">
                    {form.items.length > 1 && <button type="button" onClick={() => removeItem(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>}
                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <select value={item.medicationId} onChange={setItem(idx, 'medicationId')} className="input-field text-sm"><option value="">Medicine</option>{medications.map(m => <option key={m.id} value={m.id}>{m.name} ({m.strength || m.dosageForm})</option>)}</select>
                      <input value={item.dosage} onChange={setItem(idx, 'dosage')} className="input-field text-sm" placeholder="Dosage: 500mg" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input value={item.frequency} onChange={setItem(idx, 'frequency')} className="input-field text-sm" placeholder="Frequency: 3 times/day" />
                      <input value={item.duration} onChange={setItem(idx, 'duration')} className="input-field text-sm" placeholder="Duration: 7 days" />
                    </div>
                  </div>
                ))}</div>
              </div>

              <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">Create Prescription</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
