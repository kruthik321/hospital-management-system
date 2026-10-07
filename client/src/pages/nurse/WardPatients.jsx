import { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';
import { DataTable, Pagination, LoadingSpinner } from '../../components/common/Components';
import { Search } from 'lucide-react';

export default function WardPatients() {
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [page, search]);
  const load = async () => { setLoading(true); try { const r = await patientAPI.getAll({ page, limit: 10, search }); setPatients(r.data.data); setTotalPages(r.data.totalPages); } catch {} setLoading(false); };

  const columns = [
    { header: 'Patient', render: (r) => <p className="font-medium text-gray-900">{r.user?.firstName} {r.user?.lastName}</p> },
    { header: 'Phone', render: (r) => r.user?.phone || '—' },
    { header: 'Gender', render: (r) => r.gender || '—' },
    { header: 'Blood Group', render: (r) => r.bloodGroup ? <span className="badge badge-danger">{r.bloodGroup}</span> : '—' },
    { header: 'Allergies', render: (r) => <span className="text-sm text-red-600">{r.allergies || 'None'}</span> },
  ];

  return (
    <div><h1 className="page-header">Ward Patients</h1><p className="page-subtitle">Monitor patients in your ward</p>
      <div className="mb-4 max-w-sm relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="input-field !pl-10" placeholder="Search..." /></div>
      {loading ? <LoadingSpinner /> : <DataTable columns={columns} data={patients} />}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></div>
  );
}
