import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto animate-slide-up`}>
        <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b rounded-t-2xl">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function StatsCard({ icon: Icon, label, value, trend, trendUp, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary-100 text-primary-600',
    accent: 'bg-accent-100 text-accent-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    violet: 'bg-violet-100 text-violet-600',
  };
  return (
    <div className="stat-card">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <span className={`text-xs font-semibold ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function DataTable({ columns, data, onRowClick, emptyMessage = 'No clinical data found' }) {
  return (
    <div className="table-container animate-fade-in shadow-2xl">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? data.map((row, rowIdx) => (
              <tr key={rowIdx} onClick={() => onRowClick?.(row)} className={onRowClick ? 'cursor-pointer' : ''}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx}>{col.render ? col.render(row) : row[col.accessor]}</td>
                ))}
              </tr>
            )) : (
              <tr><td colSpan={columns.length} className="text-center py-24 text-gray-400 font-medium italic">{emptyMessage}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SectionHeader({ title, subtitle, icon: Icon, children }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
      <div className="flex items-center gap-5">
        {Icon && (
          <div className="w-16 h-16 rounded-[2rem] bg-blue-50 flex items-center justify-center text-blue-700 shadow-inner">
            <Icon className="w-8 h-8" />
          </div>
        )}
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">{title}</h2>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {children}
      </div>
    </div>
  );
}

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-8 px-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
      <p className="text-xs font-black uppercase tracking-widest text-gray-400">Page {page} of {totalPages}</p>
      <div className="flex gap-3">
        <button 
          onClick={() => onPageChange(page - 1)} 
          disabled={page <= 1} 
          className="bg-white text-gray-900 border border-gray-200 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all disabled:opacity-30 disabled:grayscale"
        >
          Previous
        </button>
        <button 
          onClick={() => onPageChange(page + 1)} 
          disabled={page >= totalPages} 
          className="bg-blue-800 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-900 transition-all disabled:opacity-30 shadow-lg shadow-blue-800/20"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    SCHEDULED: 'badge-info', CONFIRMED: 'badge-info', IN_PROGRESS: 'badge-warning',
    COMPLETED: 'badge-success', CANCELLED: 'badge-danger', ADMITTED: 'badge-warning',
    DISCHARGED: 'badge-success', PENDING: 'badge-warning', PAID: 'badge-success',
    PARTIAL: 'badge-warning', ACTIVE: 'badge-success', RESOLVED: 'badge-gray',
    DISPENSED: 'badge-success', WORKING: 'badge-success', MAINTENANCE: 'badge-warning',
    OUT_OF_ORDER: 'badge-danger', NORMAL: 'badge-info', URGENT: 'badge-warning',
    CRITICAL: 'badge-danger', HIGH: 'badge-danger', MEDIUM: 'badge-warning', LOW: 'badge-info',
  };
  return <span className={`badge ${styles[status] || 'badge-gray'}`}>{status}</span>;
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-primary-100"></div>
        <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-16">
      {Icon && <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />}
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 mb-4">{description}</p>
      {action}
    </div>
  );
}
