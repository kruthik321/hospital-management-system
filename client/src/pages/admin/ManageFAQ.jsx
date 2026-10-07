import { useState, useEffect } from 'react';
import { faqAPI } from '../../services/api';
import { LoadingSpinner } from '../../components/common/Components';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageFAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ question: '', answer: '', category: 'GENERAL', keywords: '', sortOrder: 0 });

  useEffect(() => { load(); }, []);
  const load = async () => { setLoading(true); try { const r = await faqAPI.getAll(); setFaqs(r.data); } catch {} setLoading(false); };
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await faqAPI.update(editId, form); toast.success('Updated'); }
      else { await faqAPI.create(form); toast.success('Created'); }
      setShowModal(false); setEditId(null); load();
    } catch (err) { toast.error(err.response?.data?.error || 'Error'); }
  };
  const edit = (f) => { setForm({ question: f.question, answer: f.answer, category: f.category || 'GENERAL', keywords: f.keywords || '', sortOrder: f.sortOrder || 0 }); setEditId(f.id); setShowModal(true); };
  const del = async (id) => { if (!confirm('Delete?')) return; try { await faqAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Error'); } };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6"><div><h1 className="page-header">Manage FAQ</h1><p className="text-sm text-gray-500">{faqs.length} entries</p></div>
        <button onClick={() => { setEditId(null); setForm({ question: '', answer: '', category: 'GENERAL', keywords: '', sortOrder: 0 }); setShowModal(true); }} className="btn-primary"><Plus className="w-4 h-4" /> Add FAQ</button></div>

      <div className="space-y-3">
        {faqs.map(f => (
          <div key={f.id} className="card p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1"><span className="badge badge-info">{f.category}</span></div>
                <h3 className="font-medium text-gray-900">{f.question}</h3>
                <p className="text-sm text-gray-500 mt-1">{f.answer}</p>
                {f.keywords && <p className="text-xs text-gray-400 mt-2">Keywords: {f.keywords}</p>}
              </div>
              <div className="flex gap-1 ml-4">
                <button onClick={() => edit(f)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => del(f.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up">
            <div className="p-5 border-b flex justify-between"><h2 className="text-lg font-semibold">{editId ? 'Edit' : 'Add'} FAQ</h2><button onClick={() => setShowModal(false)} className="text-gray-400">✕</button></div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div><label className="label">Question *</label><input value={form.question} onChange={set('question')} className="input-field" required /></div>
              <div><label className="label">Answer *</label><textarea value={form.answer} onChange={set('answer')} className="input-field" rows="3" required /></div>
              <div className="grid grid-cols-2 gap-4"><div><label className="label">Category</label><select value={form.category} onChange={set('category')} className="input-field"><option>GENERAL</option><option>APPOINTMENT</option><option>BILLING</option><option>LAB</option><option>PHARMACY</option></select></div><div><label className="label">Keywords</label><input value={form.keywords} onChange={set('keywords')} className="input-field" placeholder="comma,separated" /></div></div>
              <div className="flex justify-end gap-3"><button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">{editId ? 'Update' : 'Create'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
