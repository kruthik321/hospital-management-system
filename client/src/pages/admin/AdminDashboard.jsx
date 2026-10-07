import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import HeroHeader from '../../components/common/HeroHeader';
import { StatsCard, LoadingSpinner, StatusBadge } from '../../components/common/Components';
import { Users, Stethoscope, CalendarDays, DollarSign, AlertTriangle, UserCog, TrendingUp, Activity, PackageCheck, ClipboardCheck, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';

const COLORS = ['#1e3a8a', '#0d9488', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      const res = await adminAPI.getDashboard();
      setData(res.data);
    } catch {}
    setLoading(false);
  };

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="p-20 text-center"><p className="text-gray-400 font-bold uppercase tracking-[0.2em]">Synchronization Failure</p></div>;

  const { stats, recentAppointments, lowStockItems, monthlyRevenue, appointmentStats } = data;

  const revenueData = Object.entries(monthlyRevenue || {}).map(([month, amount]) => ({ month, amount }));
  const apptPieData = (appointmentStats || []).map(s => ({ name: s.status, value: s._count.status }));

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      <HeroHeader 
        title="Command Operations" 
        subtitle="Global oversight of clinical infrastructure, medical personnel, and institutional performance." 
        image="/assets/admin-header.png"
      />

      {/* SVG Gradients for Recharts */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="navyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity={1}/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8}/>
          </linearGradient>
          <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d9488" stopOpacity={1}/>
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.8}/>
          </linearGradient>
        </defs>
      </svg>

      {/* Primary Analytics Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard icon={Users} label="Total Clinical Census" value={stats.totalPatients} color="primary" />
        <StatsCard icon={Stethoscope} label="Medical Officers" value={stats.totalDoctors} color="emerald" />
        <StatsCard icon={CalendarDays} label="Daily Intake" value={stats.todayAppointments} color="amber" />
        <StatsCard icon={DollarSign} label="Net Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString()}`} color="violet" />
      </div>

      {/* Secondary Performance Indices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard icon={UserCog} label="Nursing Force" value={stats.totalNurses} color="emerald" />
        <StatsCard icon={ClipboardCheck} label="Historical Cases" value={stats.totalAppointments} color="primary" />
        <StatsCard icon={AlertTriangle} label="Outstanding Billing" value={stats.pendingBills} color="red" />
        <StatsCard icon={TrendingUp} label="Specialty Divisions" value={data.departmentStats?.length || 0} color="amber" />
      </div>

      {/* Clinical Data Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[1.2rem] bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Revenue Dynamics</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Institutional Financial Health</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
               <ArrowUpRight className="w-4 h-4" />
               <span className="text-[11px] font-black tracking-widest">PERFORMANCE OPTIMAL</span>
            </div>
          </div>
          
          {revenueData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '16px' }}
                    labelStyle={{ fontWeight: 900, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px' }}
                    formatter={(v) => [`₹${v.toLocaleString()}`, 'NET REVENUE']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#1e3a8a" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="text-center py-20 text-gray-400 font-black text-xs uppercase tracking-widest">No spectral data detected</div>}
        </div>

        <div className="dashboard-card">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-[1.2rem] bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Case Distribution</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Appointment Status Analytics</p>
            </div>
          </div>
          
          {apptPieData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={apptPieData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={70}
                    outerRadius={100} 
                    paddingAngle={8}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {apptPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="text-center py-20 text-gray-400 font-black text-xs uppercase tracking-widest">Awaiting Clinical Data...</div>}
        </div>
      </div>

      {/* Operational Overviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="dashboard-card overflow-hidden">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
                   <CalendarDays className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Clinical Engagements</h3>
             </div>
             <StatusBadge status="ACTIVE" />
          </div>
          <div className="space-y-2">
            {(recentAppointments || []).map(apt => (
              <div key={apt.id} className="clinical-list-item group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700 font-black text-[10px] shadow-sm transform transition-transform group-hover:rotate-6">
                    {apt.patient?.user?.firstName?.[0]}{apt.patient?.user?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">{apt.patient?.user?.firstName} {apt.patient?.user?.lastName}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400 mt-0.5">ATTENDING: DR. {apt.doctor?.user?.firstName.toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={apt.status} />
                </div>
              </div>
            ))}
            {(!recentAppointments || recentAppointments.length === 0) && (
              <div className="p-12 text-center text-gray-400 font-black text-[10px] uppercase tracking-widest">No active clinical records</div>
            )}
          </div>
        </div>

        <div className="dashboard-card overflow-hidden">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 shadow-inner">
                   <PackageCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Stock Intelligence</h3>
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Inventory Alerts</span>
          </div>
          <div className="space-y-2">
            {(lowStockItems || []).map(item => (
              <div key={item.id} className="clinical-list-item group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm transform transition-transform group-hover:rotate-6 ${item.quantity <= 5 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                    {item.quantity}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">{item.itemName}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400 mt-0.5">{item.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-xl border ${item.quantity <= 5 ? 'bg-red-50 border-red-100 text-red-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                    {item.quantity <= 5 ? 'CRITICAL' : 'REORDER'}
                  </span>
                </div>
              </div>
            ))}
            {(!lowStockItems || lowStockItems.length === 0) && (
              <div className="p-12 text-center text-gray-400 font-black text-[10px] uppercase tracking-widest flex flex-col items-center gap-4">
                 <ShieldCheck className="w-10 h-10 text-emerald-100" />
                 SUPPLY CHAIN OPTIMAL
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
