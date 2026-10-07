import { useState, useEffect } from 'react';
import { faqAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import { ChevronDown, Hospital, Search } from 'lucide-react';

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState('');
  const [openIdx, setOpenIdx] = useState(null);
  const [category, setCategory] = useState('');

  useEffect(() => { loadFAQs(); }, [search, category]);

  const loadFAQs = async () => {
    try {
      const res = await faqAPI.getAll({ search, category });
      setFaqs(res.data);
    } catch { setFaqs([]); }
  };

  const categories = ['', 'GENERAL', 'APPOINTMENT', 'BILLING', 'LAB', 'PHARMACY'];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Hospital className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900">MedCare HMS</span>
        </Link>
        <Link to="/login" className="btn-primary text-sm">Login</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-500 mb-8">Find answers to common questions about our services</p>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search FAQs..." className="input-field !pl-10" />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="input-field !w-40">
            <option value="">All Categories</option>
            {categories.filter(c => c).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={faq.id} className="card overflow-hidden">
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition">
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
              </button>
              {openIdx === i && (
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4 animate-fade-in">
                  {faq.answer}
                  {faq.category && <span className="badge badge-info mt-3 block w-fit">{faq.category}</span>}
                </div>
              )}
            </div>
          ))}
          {faqs.length === 0 && <p className="text-center text-gray-400 py-12">No FAQs found. Try a different search term.</p>}
        </div>
      </div>
    </div>
  );
}
