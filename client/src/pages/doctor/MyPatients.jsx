import { useState, useEffect } from 'react';
import { appointmentAPI, patientAPI } from '../../services/api';
import { DataTable, Pagination, LoadingSpinner } from '../../components/common/Components';
import { Search, Eye } from 'lucide-react';

export default function MyPatients() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medHistory, setMedHistory] = useState(null);

  useEffect(() => { load(); }, [page]);
  const load = async () => { setLoading(true); try { const r = await appointmentAPI.getAll({ page, limit: 10 }); setAppointments(r.data.data); setTotalPages(r.data.totalPages); } catch {} setLoading(false); };

  const viewHistory = async (patientId) => {
    try {
      const [p, h] = await Promise.all([patientAPI.getById(patientId), patientAPI.getMedicalHistory(patientId)]);
      setSelectedPatient(p.data); setMedHistory(h.data);
    } catch {}
  };

  // Unique patients from appointments
  const patientMap = new Map();
  appointments.forEach(a => { if (a.patient && !patientMap.has(a.patient.id)) patientMap.set(a.patient.id, a.patient); });
  const patients = Array.from(patientMap.values());

  const columns = [
    { header: 'Patient', render: (r) => <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center text-sm font-semibold">{r.user?.firstName?.[0]}{r.user?.lastName?.[0]}</div><div><p className="font-medium text-gray-900">{r.user?.firstName} {r.user?.lastName}</p><p className="text-xs text-gray-500">{r.user?.email}</p></div></div> },
    { header: 'Phone', render: (r) => r.user?.phone || '—' },
    { header: 'Gender', render: (r) => r.gender || '—' },
    { header: 'Blood', render: (r) => r.bloodGroup ? <span className="badge badge-danger">{r.bloodGroup}</span> : '—' },
    { header: 'Actions', render: (r) => <button onClick={() => viewHistory(r.id)} className="btn-secondary text-xs !px-3 !py-1"><Eye className="w-3 h-3" /> History</button> },
  ];

  return (
    <div>
      <h1 className="page-header">My Patients</h1>
      <p className="page-subtitle">Patients from your appointments</p>
      {loading ? <LoadingSpinner /> : <DataTable columns={columns} data={patients} />}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/50" onClick={() => { setSelectedPatient(null); setMedHistory(null); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-5 border-b flex justify-between"><h2 className="text-lg font-semibold">{selectedPatient.user?.firstName} {selectedPatient.user?.lastName} — Medical History</h2><button onClick={() => { setSelectedPatient(null); setMedHistory(null); }} className="text-gray-400">✕</button></div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3 text-sm">
                <p><span className="font-medium text-gray-500">Gender:</span> {selectedPatient.gender || '—'}</p>
                <p><span className="font-medium text-gray-500">Blood:</span> {selectedPatient.bloodGroup || '—'}</p>
                <p><span className="font-medium text-gray-500">Allergies:</span> {selectedPatient.allergies || 'None'}</p>
              </div>

              {medHistory?.vitals?.length > 0 && <div><h3 className="font-semibold text-gray-900 mb-2">Recent Vitals</h3><div className="grid grid-cols-2 gap-2">{medHistory.vitals.slice(0, 4).map(v => (
                <div key={v.id} className="bg-gray-50 rounded-lg p-3 text-xs"><p>BP: {v.bloodPressure || '—'} | HR: {v.heartRate || '—'} | Temp: {v.temperature || '—'}°F</p><p className="text-gray-400 mt-1">{new Date(v.recordedAt).toLocaleDateString()}</p></div>
              ))}</div></div>}

              {medHistory?.diagnoses?.length > 0 && <div><h3 className="font-semibold text-gray-900 mb-2">Diagnoses</h3>{medHistory.diagnoses.map(d => (
                <div key={d.id} className="bg-gray-50 rounded-lg p-3 text-sm mb-2"><p className="font-medium">{d.condition} <span className="text-xs text-gray-500">({d.severity || 'N/A'})</span></p><p className="text-xs text-gray-500 mt-1">By Dr. {d.doctor?.user?.firstName} {d.doctor?.user?.lastName} on {new Date(d.diagnosedAt).toLocaleDateString()}</p></div>
              ))}</div>}

              {medHistory?.prescriptions?.length > 0 && <div><h3 className="font-semibold text-gray-900 mb-2">Prescriptions</h3>{medHistory.prescriptions.slice(0, 5).map(p => (
                <div key={p.id} className="bg-gray-50 rounded-lg p-3 text-sm mb-2"><p className="font-medium">Rx #{p.id} <span className="text-xs text-gray-500">({new Date(p.createdAt).toLocaleDateString()})</span></p><ul className="mt-1 space-y-0.5">{p.items?.map(i => <li key={i.id} className="text-xs text-gray-600">💊 {i.medication?.name} — {i.dosage}, {i.frequency}, {i.duration}</li>)}</ul></div>
              ))}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
