import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function DoctorSchedule() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const [form, setForm] = useState({ dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00', slotDuration: 30 });

  return (
    <div>
      <h1 className="page-header">My Schedule</h1>
      <p className="page-subtitle">Manage your weekly availability</p>
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Add Schedule Slot</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div><label className="label">Day</label><select value={form.dayOfWeek} onChange={e => setForm({...form, dayOfWeek: e.target.value})} className="input-field">{days.map(d => <option key={d}>{d}</option>)}</select></div>
          <div><label className="label">Start</label><input type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} className="input-field" /></div>
          <div><label className="label">End</label><input type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} className="input-field" /></div>
          <div><label className="label">Slot (min)</label><input type="number" value={form.slotDuration} onChange={e => setForm({...form, slotDuration: parseInt(e.target.value)})} className="input-field" /></div>
        </div>
        <button onClick={() => toast.success('Schedule saved')} className="btn-primary">Save Schedule</button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {days.map(day => (
          <div key={day} className="card p-4"><h4 className="font-semibold text-gray-900 text-sm mb-2">{day}</h4><p className="text-xs text-gray-500">9:00 AM — 5:00 PM</p><p className="text-xs text-gray-400 mt-1">30 min slots</p></div>
        ))}
      </div>
    </div>
  );
}
