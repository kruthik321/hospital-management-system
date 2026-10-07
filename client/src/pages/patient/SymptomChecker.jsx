import { useState } from 'react';
import { aiAPI } from '../../services/api';
import { LoadingSpinner } from '../../components/common/Components';
import { Search, AlertTriangle, Stethoscope, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const commonSymptoms = [
  'headache', 'fever', 'cough', 'fatigue', 'nausea', 'chest pain',
  'shortness of breath', 'dizziness', 'body ache', 'sore throat',
  'runny nose', 'vomiting', 'diarrhea', 'back pain', 'joint pain',
  'insomnia', 'anxiety', 'weight loss', 'blurred vision', 'rash',
  'abdominal pain', 'weakness', 'numbness', 'swelling', 'palpitations',
];

export default function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSymptom = (s) => {
    if (selectedSymptoms.includes(s)) setSelectedSymptoms(selectedSymptoms.filter(x => x !== s));
    else setSelectedSymptoms([...selectedSymptoms, s]);
  };

  const addCustom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim().toLowerCase())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim().toLowerCase()]);
      setCustomSymptom('');
    }
  };

  const checkSymptoms = async () => {
    if (selectedSymptoms.length === 0) return toast.error('Please select at least one symptom');
    setLoading(true);
    try {
      const res = await aiAPI.symptomCheck(selectedSymptoms);
      setResults(res.data);
    } catch { toast.error('Error checking symptoms'); }
    setLoading(false);
  };

  const reset = () => { setSelectedSymptoms([]); setResults(null); };

  return (
    <div>
      <h1 className="page-header">AI Symptom Checker</h1>
      <p className="page-subtitle">Select your symptoms to get possible diagnoses and doctor recommendations</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div><p className="text-sm font-medium text-amber-800">For informational purposes only</p><p className="text-xs text-amber-600">This AI tool provides preliminary insights. Please consult a qualified physician for proper diagnosis and treatment.</p></div>
      </div>

      {!results ? (
        <div>
          {/* Selected Symptoms */}
          {selectedSymptoms.length > 0 && (
            <div className="mb-6">
              <label className="label">Selected Symptoms ({selectedSymptoms.length})</label>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map(s => (
                  <span key={s} className="inline-flex items-center gap-1.5 bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    {s} <button onClick={() => toggleSymptom(s)} className="hover:text-primary-900"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Custom symptom */}
          <div className="mb-6">
            <label className="label">Add Custom Symptom</label>
            <div className="flex gap-2 max-w-sm">
              <input value={customSymptom} onChange={e => setCustomSymptom(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCustom()} className="input-field" placeholder="Type a symptom..." />
              <button onClick={addCustom} className="btn-secondary"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Common Symptoms Grid */}
          <div className="mb-6">
            <label className="label">Common Symptoms</label>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map(s => (
                <button key={s} onClick={() => toggleSymptom(s)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    selectedSymptoms.includes(s)
                      ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button onClick={checkSymptoms} disabled={loading || selectedSymptoms.length === 0} className="btn-primary !px-8 !py-3">
            {loading ? 'Analyzing...' : <><Search className="w-4 h-4" /> Check Symptoms</>}
          </button>
        </div>
      ) : (
        <div className="animate-fade-in">
          {/* Results */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Analysis Results</h2>
            <button onClick={reset} className="btn-secondary text-sm">Check Again</button>
          </div>

          <div className="mb-4">
            <label className="label">Your Symptoms</label>
            <div className="flex flex-wrap gap-2">{selectedSymptoms.map(s => <span key={s} className="badge badge-info">{s}</span>)}</div>
          </div>

          {/* Possible Conditions */}
          {results.possibleConditions?.length > 0 ? (
            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-gray-900">Possible Conditions</h3>
              {results.possibleConditions.map((c, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-lg">{c.disease}</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-gradient-to-r from-primary-400 to-primary-600" style={{ width: `${(c.matchScore || c.probability || 50)}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-primary-600">{c.matchScore || c.probability || 50}%</span>
                    </div>
                  </div>
                  {c.specialization && (
                    <div className="flex items-center gap-2 mb-2">
                      <Stethoscope className="w-4 h-4 text-accent-600" />
                      <span className="text-sm text-gray-600">Recommended Specialist: <span className="font-semibold text-accent-700">{c.specialization}</span></span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-xs text-gray-500">Matching symptoms:</span>
                    {(c.matchingSymptoms || [c.symptom]).map((s, j) => <span key={j} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 mb-6">No specific conditions identified. Please consult a doctor.</p>}

          {/* Recommended Doctors */}
          {results.recommendedDoctors?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Recommended Doctors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.recommendedDoctors.map((doc, i) => (
                  <div key={i} className="card p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold">
                        {doc.user?.firstName?.[0]}{doc.user?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Dr. {doc.user?.firstName} {doc.user?.lastName}</p>
                        <p className="text-xs text-gray-500">{doc.specialization}</p>
                        {doc.consultationFee && <p className="text-xs text-primary-600 font-semibold">₹{doc.consultationFee}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
            <p className="font-medium mb-1">💡 Next Steps</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Book an appointment with a recommended specialist</li>
              <li>Share these results with your doctor during consultation</li>
              <li>Do not self-medicate — always follow your doctor's advice</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
