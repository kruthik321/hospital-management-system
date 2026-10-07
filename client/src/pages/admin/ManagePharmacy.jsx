import { useState, useEffect } from 'react';
import { pharmacyAPI } from '../../services/api';
import { DataTable, Pagination, LoadingSpinner, SectionHeader, StatsCard } from '../../components/common/Components';
import { Plus, Search, Pill, Package, AlertCircle, CheckCircle2, TrendingUp, FlaskConical } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManagePharmacy() {
  const [tab, setTab] = useState('medications');
  const [medications, setMedications] = useState([]);
  const [inventory, setInventory] = useState({ data: [], total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('medication');
  const [medForm, setMedForm] = useState({ name: '', genericName: '', category: '', manufacturer: '', dosageForm: '', strength: '', price: '', description: '', sideEffects: '' });
  const [invForm, setInvForm] = useState({ itemName: '', category: 'MEDICINE', quantity: '', unit: '', reorderLevel: '10', supplier: '', batchNumber: '', expiryDate: '', costPerUnit: '' });

  useEffect(() => { loadMeds(); loadInv(); }, [page]);
  const loadMeds = async () => { try { const r = await pharmacyAPI.getMedications(); setMedications(r.data); } catch {} setLoading(false); };
  const loadInv = async () => { try { const r = await pharmacyAPI.getInventory({ page, limit: 20 }); setInventory(r.data); } catch {} };

  const setM = (f) => (e) => setMedForm({ ...medForm, [f]: e.target.value });
  const setI = (f) => (e) => setInvForm({ ...invForm, [f]: e.target.value });

  const addMed = async (e) => { e.preventDefault(); try { await pharmacyAPI.createMedication(medForm); toast.success('Medicine catalog updated'); setShowModal(false); loadMeds(); } catch (err) { toast.error(err.response?.data?.error || 'Registry error'); } };
  const addInv = async (e) => { e.preventDefault(); try { await pharmacyAPI.createInventory(invForm); toast.success('Stock levels updated'); setShowModal(false); loadInv(); } catch (err) { toast.error(err.response?.data?.error || 'Inventory error'); } };

  const medCols = [
    { header: 'Medicine / Formulary', render: (r) => (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
           <Pill className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-gray-900">{r.name}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{r.genericName}</p>
        </div>
      </div>
    ) },
    { header: 'Clinical Category', render: (r) => <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-bold">{r.category || 'General'}</span> }, 
    { header: 'Dosage Form', render: (r) => (
      <div className="flex items-center gap-2">
        <FlaskConical className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-gray-600 font-medium">{r.dosageForm || '—'}</span>
      </div>
    ) },
    { header: 'Unit Price', render: (r) => <span className="font-black text-gray-900 text-sm">₹{r.price}</span> },
  ];

  const invCols = [
    { header: 'Stock Item', render: (r) => (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
           <Package className="w-5 h-5" />
        </div>
        <p className="font-bold text-gray-900">{r.itemName}</p>
      </div>
    ) },
    { header: 'Classification', render: (r) => <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{r.category}</span> },
    { header: 'Availability', render: (r) => (
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[60px]">
           <div className={`h-full ${r.quantity <= r.reorderLevel ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min((r.quantity/50)*100, 100)}%` }}></div>
        </div>
        <span className={`font-black text-sm ${r.quantity <= r.reorderLevel ? 'text-red-600 animate-pulse' : 'text-gray-900'}`}>
          {r.quantity} <span className="text-[10px] opacity-40 uppercase">{r.unit || 'units'}</span>
        </span>
      </div>
    ) },
    { header: 'Supply Chain', render: (r) => <p className="text-xs font-bold text-gray-500">{r.supplier || 'In-House'}</p> }, 
    { header: 'Safety/Expiry', render: (r) => (
      <div className="flex items-center gap-2 text-xs font-bold">
        <div className={`w-2 h-2 rounded-full ${r.expiryDate && new Date(r.expiryDate) < new Date() ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
        {r.expiryDate ? new Date(r.expiryDate).toLocaleDateString() : '—'}
      </div>
    ) },
  ];

  return (
    <div className="animate-fade-in">
      <SectionHeader 
        title="Pharmacy Intelligence" 
        subtitle="Manage pharmaceutical catalog, inventory levels, and supply safety."
        icon={Pill}
      >
        <button onClick={() => { setModalType(tab === 'medications' ? 'medication' : 'inventory'); setShowModal(true); }} className="btn-primary shadow-xl shadow-blue-800/20">
          <Plus className="w-4 h-4" /> Register {tab === 'medications' ? 'Medicine' : 'Item'}
        </button>
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatsCard icon={Plus} label="Total Formulary" value={medications.length} color="primary" />
        <StatsCard icon={AlertCircle} label="Critical Stock" value={inventory.data.filter(i => i.quantity <= i.reorderLevel).length} color="red" />
        <StatsCard icon={TrendingUp} label="Daily Dispensed" value="248" color="emerald" />
        <StatsCard icon={CheckCircle2} label="Safety Verified" value="100%" color="accent" />
      </div>

      <div className="medical-tabs">
        <button onClick={() => setTab('medications')} className={`medical-tab-item ${tab === 'medications' ? 'medical-tab-active' : 'medical-tab-inactive'}`}>
          Formulary Catalog
        </button>
        <button onClick={() => setTab('inventory')} className={`medical-tab-item ${tab === 'inventory' ? 'medical-tab-active' : 'medical-tab-inactive'}`}>
          Current Inventory
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="animate-slide-up">
          {tab === 'medications' ? (
            <DataTable columns={medCols} data={medications} emptyMessage="Pharmacy catalog is empty." />
          ) : (
            <>
              <DataTable columns={invCols} data={inventory.data} emptyMessage="No inventory items detected." />
              <Pagination page={page} totalPages={inventory.totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up border border-blue-50">
            <div className="p-8 border-b bg-blue-50/30 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight">{modalType === 'medication' ? 'Clinical Entry: Medicine' : 'Logistics Entry: Inventory'}</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Pharmacy Information System</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">✕</button>
            </div>
            {modalType === 'medication' ? (
              <form onSubmit={addMed} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="label">Brand Name *</label><input value={medForm.name} onChange={setM('name')} className="input-field" required /></div>
                  <div><label className="label">Generic Component</label><input value={medForm.genericName} onChange={setM('genericName')} className="input-field" /></div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div><label className="label">Category</label><input value={medForm.category} onChange={setM('category')} className="input-field" placeholder="Antibiotic" /></div>
                  <div><label className="label">Dosage Form</label><select value={medForm.dosageForm} onChange={setM('dosageForm')} className="input-field"><option value="">Select Form</option><option>Tablet</option><option>Capsule</option><option>Syrup</option><option>Injection</option><option>Cream</option><option>Drops</option></select></div>
                  <div><label className="label">Price (₹) *</label><input type="number" value={medForm.price} onChange={setM('price')} className="input-field" required /></div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="label">Manufacturer</label><input value={medForm.manufacturer} onChange={setM('manufacturer')} className="input-field" /></div>
                  <div><label className="label">Strength</label><input value={medForm.strength} onChange={setM('strength')} className="input-field" placeholder="500mg" /></div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Dismiss</button>
                  <button type="submit" className="btn-primary px-10">Commit to Ledger</button>
                </div>
              </form>
            ) : (
              <form onSubmit={addInv} className="p-8 space-y-6">
                <div><label className="label">Biological/Chemical Item Name *</label><input value={invForm.itemName} onChange={setI('itemName')} className="input-field" required /></div>
                <div className="grid grid-cols-3 gap-6">
                  <div><label className="label">Classification</label><select value={invForm.category} onChange={setI('category')} className="input-field"><option>MEDICINE</option><option>CONSUMABLE</option><option>SURGICAL</option></select></div>
                  <div><label className="label">Quantity</label><input type="number" value={invForm.quantity} onChange={setI('quantity')} className="input-field" /></div>
                  <div><label className="label">Unit Measure</label><input value={invForm.unit} onChange={setI('unit')} className="input-field" placeholder="vials" /></div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div><label className="label">Supplier Agent</label><input value={invForm.supplier} onChange={setI('supplier')} className="input-field" /></div>
                  <div><label className="label">Batch Identification</label><input value={invForm.batchNumber} onChange={setI('batchNumber')} className="input-field" /></div>
                  <div><label className="label">Expiry Date</label><input type="date" value={invForm.expiryDate} onChange={setI('expiryDate')} className="input-field" /></div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="label">Acquisition Cost (₹)</label><input type="number" value={invForm.costPerUnit} onChange={setI('costPerUnit')} className="input-field" /></div>
                  <div><label className="label">Safety Reorder Level</label><input type="number" value={invForm.reorderLevel} onChange={setI('reorderLevel')} className="input-field" /></div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Dismiss</button>
                  <button type="submit" className="btn-primary px-10">Commit Stock</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
