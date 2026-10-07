import { useState, useEffect } from 'react';
import { labAPI } from '../../services/api';
import { DataTable, Pagination, LoadingSpinner, StatusBadge } from '../../components/common/Components';

export default function LabResults() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [page]);
  const load = async () => { setLoading(true); try { const r = await labAPI.getOrders({ page, limit: 10 }); setOrders(r.data.data); setTotalPages(r.data.totalPages); } catch {} setLoading(false); };

  const columns = [
    { header: 'Patient', render: (r) => <p className="font-medium text-gray-900">{r.patient?.user?.firstName} {r.patient?.user?.lastName}</p> },
    { header: 'Test', render: (r) => r.labTest?.name || '—' },
    { header: 'Category', render: (r) => r.labTest?.category || '—' },
    { header: 'Priority', render: (r) => <StatusBadge status={r.priority} /> },
    { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { header: 'Result', render: (r) => r.labReport ? <span className="text-sm text-emerald-600 font-medium">{r.labReport.resultValue || r.labReport.result || 'View'}</span> : <span className="text-gray-400 text-sm">Pending</span> },
    { header: 'Date', render: (r) => new Date(r.createdAt).toLocaleDateString() },
  ];

  return (
    <div><h1 className="page-header">Lab Results</h1><p className="page-subtitle">View lab test orders and results</p>
      {loading ? <LoadingSpinner /> : <DataTable columns={columns} data={orders} />}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></div>
  );
}
