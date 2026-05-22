'use client';

import { useState } from 'react';
import Topbar from '@/components/layout/Topbar';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';

const mockLogs = [
  { id: '1', user: 'Ahmad Rizky', email: 'ahmad@example.com', action: 'LOGIN', resource: 'Authentication', details: 'Successful login via Google OAuth', status: 'success', ip: '192.168.1.1', time: '2026-05-22 10:01:05', avatar: 'A' },
  { id: '2', user: 'Siti Rahayu', email: 'siti@example.com', action: 'CREATE', resource: 'Document', details: 'Created Q4 Marketing Report.pdf', status: 'success', ip: '192.168.1.2', time: '2026-05-22 09:52:11', avatar: 'S' },
  { id: '3', user: 'Budi Santoso', email: 'budi@example.com', action: 'APPROVE', resource: 'Document', details: 'Approved Business Proposal v2', status: 'success', ip: '192.168.1.3', time: '2026-05-22 09:30:00', avatar: 'B' },
  { id: '4', user: 'Diana Putri', email: 'diana@example.com', action: 'LOGIN', resource: 'Authentication', details: 'Failed login — invalid credentials', status: 'failed', ip: '10.0.0.5', time: '2026-05-22 09:10:44', avatar: 'D' },
  { id: '5', user: 'Eko Prasetyo', email: 'eko@example.com', action: 'EXPORT', resource: 'Report', details: 'Exported user list to Excel', status: 'success', ip: '192.168.1.5', time: '2026-05-22 08:55:22', avatar: 'E' },
  { id: '6', user: 'Fitriani', email: 'fitri@example.com', action: 'DELETE', resource: 'Document', details: 'Deleted draft: Old Proposal', status: 'warning', ip: '192.168.1.6', time: '2026-05-22 08:20:00', avatar: 'F' },
  { id: '7', user: 'Guntur Wibowo', email: 'guntur@example.com', action: 'UPDATE', resource: 'User', details: 'Updated role from member to staff', status: 'success', ip: '192.168.1.7', time: '2026-05-21 17:10:05', avatar: 'G' },
  { id: '8', user: 'Hani Lestari', email: 'hani@example.com', action: 'UPLOAD', resource: 'File', details: 'Uploaded company-logo.png (2.3MB)', status: 'success', ip: '192.168.1.8', time: '2026-05-21 16:00:30', avatar: 'H' },
];

const actionColors: Record<string, string> = {
  LOGIN: 'badge-info',
  CREATE: 'badge-success',
  UPDATE: 'badge-warning',
  DELETE: 'badge-error',
  EXPORT: 'badge-neutral',
  UPLOAD: 'badge-success',
  APPROVE: 'badge-success',
};

export default function LogsPage() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = mockLogs.filter(l => {
    const matchSearch = l.user.toLowerCase().includes(search.toLowerCase()) || l.details.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === 'all' || l.action === actionFilter;
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchAction && matchStatus;
  });

  return (
    <div>
      <Topbar title="Activity Logs" subtitle="Full audit trail of all system events" />

      <div className="p-6 space-y-5 fade-up">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Events', value: '12,847', color: '#6366f1' },
            { label: 'Today', value: '384', color: '#10b981' },
            { label: 'Failed', value: '23', color: '#f43f5e' },
            { label: 'Warnings', value: '8', color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className="glass-card p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs..." className="glass-input pl-9 pr-4 py-2 text-sm w-56" />
            </div>
            <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="glass-input px-3 py-2 text-sm">
              <option value="all">All Actions</option>
              {['LOGIN','CREATE','UPDATE','DELETE','EXPORT','UPLOAD','APPROVE'].map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="glass-input px-3 py-2 text-sm">
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="warning">Warning</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="btn-ghost text-sm"><RefreshCw size={14} /> Refresh</button>
            <button className="btn-ghost text-sm"><Download size={14} /> Export</button>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm text-slate-400"><span className="text-white font-semibold">{filtered.length}</span> events found</p>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>IP Address</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(log => (
                  <tr key={log.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                          {log.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{log.user}</p>
                          <p className="text-xs text-slate-600">{log.email}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${actionColors[log.action] || 'badge-neutral'}`}>{log.action}</span></td>
                    <td className="text-slate-400 text-sm">{log.resource}</td>
                    <td className="text-slate-500 text-sm max-w-[220px] truncate">{log.details}</td>
                    <td>
                      <span className={`badge ${log.status === 'success' ? 'badge-success' : log.status === 'failed' ? 'badge-error' : 'badge-warning'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="text-slate-600 text-xs font-mono">{log.ip}</td>
                    <td className="text-slate-500 text-xs whitespace-nowrap">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
