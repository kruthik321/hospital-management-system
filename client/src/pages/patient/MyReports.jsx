import { useState, useEffect } from 'react';
import { labAPI } from '../../services/api';
import { LoadingSpinner, StatusBadge } from '../../components/common/Components';
import { FileText } from 'lucide-react';

export default function MyReports() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  const load = async () => { try { const r = await labAPI.getOrders({ limit: 50 }); setOrders(r.data.data); } catch {} setLoading(false); };

  if (loading) return <LoadingSpinner />;

  return (
    <div><h1 className="page-header">My Reports</h1><p className="page-subtitle">Lab test results and medical reports</p>
      <div className="space-y-3">
        {orders.map(o => (
          <div key={o.id} className="card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-primary-600" /><div><p className="font-medium text-gray-900">{o.labTest?.name}</p><p className="text-xs text-gray-500">{o.labTest?.category} • Ordered: {new Date(o.createdAt).toLocaleDateString()}</p></div></div>
              <StatusBadge status={o.status} />
            </div>
            {o.labReport && (
              <div className="mt-3 bg-emerald-50 rounded-lg p-3 text-sm">
                <p className="font-medium text-emerald-700">Result: {o.labReport.resultValue || o.labReport.result}</p>
                {o.labReport.remarks && <p className="text-xs text-gray-600 mt-1">{o.labReport.remarks}</p>}
                {o.labTest?.normalRange && <p className="text-xs text-gray-500 mt-1">Normal Range: {o.labTest.normalRange} {o.labTest.unit || ''}</p>}
                <p className="text-xs text-gray-400 mt-1">Reported: {o.labReport.reportedAt ? new Date(o.labReport.reportedAt).toLocaleDateString() : '—'}</p>
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && <div className="card p-12 text-center text-gray-400"><FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>No lab reports yet</p></div>}
      </div>
    </div>
  );
}
