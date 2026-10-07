import { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';
import { LoadingSpinner } from '../../components/common/Components';
import { Search, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function RecordVitals() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [form, setForm] = useState({ bloodPressure: '', heartRate: '', temperature: '', respiratoryRate: '', oxygenSaturation: '', weight: '', height: '', notes: '' });

  useEffect(() => { load(); }, [search]);
  const load = async () => { setLoading(true); try { const r = await patientAPI.getAll({ limit: 20, search }); setPatients(r.data.data); } catch {} setLoading(false); };
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/patients/${selectedPatient.id}/vitals`, form);
      toast.success('Vitals recorded');
      setSelectedPatient(null);
      setForm({ bloodPressure: '', heartRate: '', temperature: '', respiratoryRate: '', oxygenSaturation: '', weight: '', height: '', notes: '' });
    } catch { toast.error('Error recording vitals'); }
  };

  return (
    <div><h1 className="page-header">Record Vitals</h1><p className="page-subtitle">Select a patient to record vital signs</p>
      <div className="mb-4 max-w-sm relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} className="input-field !pl-10" placeholder="Search patients..." /></div>

      {loading ? <LoadingSpinner /> : !selectedPatient ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">{patients.map(p => (
          <button key={p.id} onClick={() => setSelectedPatient(p)} className="card p-4 text-left hover:-translate-y-1 transition-all">
            <p className="font-medium text-gray-900">{p.user?.firstName} {p.user?.lastName}</p>
            <p className="text-xs text-gray-500">{p.gender || ''} • {p.bloodGroup || ''}</p>
          </button>
        ))}</div>
      ) : (
        <div className="card p-6 max-w-2xl">
          <div className="flex items-center gap-3 mb-6"><Activity className="w-5 h-5 text-primary-600" /><h3 className="font-semibold text-gray-900">Recording vitals for {selectedPatient.user?.firstName} {selectedPatient.user?.lastName}</h3>
            <button onClick={() => setSelectedPatient(null)} className="ml-auto btn-secondary text-xs">Back</button></div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div><label className="label">Blood Pressure</label><input value={form.bloodPressure} onChange={set('bloodPressure')} className="input-field" placeholder="120/80" /></div>
              <div><label className="label">Heart Rate (bpm)</label><input type="number" value={form.heartRate} onChange={set('heartRate')} className="input-field" /></div>
              <div><label className="label">Temperature (°F)</label><input type="number" step="0.1" value={form.temperature} onChange={set('temperature')} className="input-field" /></div>
              <div><label className="label">Respiratory Rate</label><input type="number" value={form.respiratoryRate} onChange={set('respiratoryRate')} className="input-field" /></div>
              <div><label className="label">O₂ Saturation (%)</label><input type="number" step="0.1" value={form.oxygenSaturation} onChange={set('oxygenSaturation')} className="input-field" /></div>
              <div><label className="label">Weight (kg)</label><input type="number" step="0.1" value={form.weight} onChange={set('weight')} className="input-field" /></div>
            </div>
            <div><label className="label">Notes</label><textarea value={form.notes} onChange={set('notes')} className="input-field" rows="2" /></div>
            <button type="submit" className="btn-primary">Save Vitals</button>
          </form>
        </div>
      )}
    </div>
  );
}
