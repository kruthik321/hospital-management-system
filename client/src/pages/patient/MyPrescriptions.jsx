import { useState, useEffect } from 'react';
import { prescriptionAPI } from '../../services/api';
import { LoadingSpinner } from '../../components/common/Components';
import { Pill } from 'lucide-react';

export default function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => { load(); }, [page]);
  const load = async () => { setLoading(true); try { const r = await prescriptionAPI.getAll({ page, limit: 10 }); setPrescriptions(r.data.data); setTotalPages(r.data.totalPages); } catch {} setLoading(false); };

  if (loading) return <LoadingSpinner />;

  return (
    <div><h1 className="page-header">My Prescriptions</h1><p className="page-subtitle">View your prescribed medications</p>
      <div className="space-y-4">
        {prescriptions.map(rx => (
          <div key={rx.id} className="card p-5 cursor-pointer hover:-translate-y-0.5 transition-all" onClick={() => setSelected(rx)}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3"><Pill className="w-5 h-5 text-primary-600" /><div><p className="font-semibold text-gray-900">Rx #{rx.id}</p><p className="text-xs text-gray-500">Dr. {rx.doctor?.user?.firstName} {rx.doctor?.user?.lastName} • {new Date(rx.createdAt).toLocaleDateString()}</p></div></div>
              <span className="badge badge-info">{rx.items?.length || 0} medicines</span>
            </div>
            {rx.diagnosisNotes && <p className="text-sm text-gray-600 mb-2">{rx.diagnosisNotes}</p>}
            <div className="flex flex-wrap gap-2">{rx.items?.map(i => <span key={i.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">💊 {i.medication?.name}</span>)}</div>
          </div>
        ))}
        {prescriptions.length === 0 && <div className="card p-12 text-center text-gray-400"><Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>No prescriptions yet</p></div>}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-5 border-b flex justify-between"><h2 className="text-lg font-semibold">Prescription #{selected.id}</h2><button onClick={() => setSelected(null)} className="text-gray-400">✕</button></div>
            <div className="p-5">
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm space-y-1">
                <p><span className="text-gray-500">Doctor:</span> Dr. {selected.doctor?.user?.firstName} {selected.doctor?.user?.lastName}</p>
                <p><span className="text-gray-500">Date:</span> {new Date(selected.createdAt).toLocaleDateString()}</p>
                {selected.diagnosisNotes && <p><span className="text-gray-500">Diagnosis:</span> {selected.diagnosisNotes}</p>}
                {selected.instructions && <p><span className="text-gray-500">Instructions:</span> {selected.instructions}</p>}
                {selected.followUpDate && <p><span className="text-gray-500">Follow-up:</span> {new Date(selected.followUpDate).toLocaleDateString()}</p>}
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Medicines</h3>
              <div className="space-y-3">{selected.items?.map(i => (
                <div key={i.id} className="bg-primary-50 rounded-lg p-3"><p className="font-medium text-gray-900">💊 {i.medication?.name} <span className="text-xs text-gray-500">({i.medication?.strength || i.medication?.dosageForm})</span></p>
                  <div className="text-xs text-gray-600 mt-1 space-y-0.5"><p>Dosage: {i.dosage}</p><p>Frequency: {i.frequency}</p><p>Duration: {i.duration}</p>{i.instructions && <p>Note: {i.instructions}</p>}</div></div>
              ))}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
