'use client';

import { useState } from 'react';
import Topbar from '@/components/layout/Topbar';
import { Search, Download, RefreshCw } from 'lucide-react';
import type { ActivityLog } from '@/types';

const actionColors: Record<string, string> = {
  login: 'badge-info',
  created: 'badge-success',
  updated_status: 'badge-warning',
  deleted: 'badge-error',
  exported: 'badge-neutral',
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function LogsClient({ logs }: { logs: ActivityLog[] }) {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = logs.filter(l => {
    const query = search.toLowerCase();
    const matchSearch = l.userName.toLowerCase().includes(query) || (l.details || '').toLowerCase().includes(query);
    const matchAction = actionFilter === 'all' || l.action === actionFilter;
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchAction && matchStatus;
  });

  const today = logs.filter(log => new Date(log.createdAt).toDateString() === new Date().toDateString()).length;
  const failed = logs.filter(log => log.status === 'failed').length;
  const warnings = logs.filter(log => log.status === 'warning').length;
  const actions = Array.from(new Set(logs.map(log => log.action)));

  return (
    <div>
      <Topbar title="Activity Logs" subtitle="Full audit trail of your organization events" />

      <div className="p-6 space-y-5 fade-up">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Events', value: logs.length.toLocaleString(), color: '#6366f1' },
            { label: 'Today', value: today.toLocaleString(), color: '#10b981' },
            { label: 'Failed', value: failed.toLocaleString(), color: '#f43f5e' },
            { label: 'Warnings', value: warnings.toLocaleString(), color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className="glass-card p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs..." className="glass-input pl-9 pr-4 py-2 text-sm w-56" />
            </div>
            <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="glass-input px-3 py-2 text-sm">
              <option value="all">All Actions</option>
              {actions.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="glass-input px-3 py-2 text-sm">
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="warning">Warning</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => location.reload()} className="btn-ghost text-sm"><RefreshCw size={14} /> Refresh</button>
            <button className="btn-ghost text-sm"><Download size={14} /> Export</button>
          </div>
        </div>

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
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-slate-500">No logs found.</td>
                  </tr>
                ) : filtered.map(log => (
                  <tr key={log._id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                          {log.userName[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{log.userName}</p>
                          <p className="text-xs text-slate-600">{log.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${actionColors[log.action] || 'badge-neutral'}`}>{log.action}</span></td>
                    <td className="text-slate-400 text-sm">{log.resource}</td>
                    <td className="text-slate-500 text-sm max-w-[220px] truncate">{log.details || '-'}</td>
                    <td>
                      <span className={`badge ${log.status === 'success' ? 'badge-success' : log.status === 'failed' ? 'badge-error' : 'badge-warning'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="text-slate-600 text-xs font-mono">{log.ipAddress || '-'}</td>
                    <td className="text-slate-500 text-xs whitespace-nowrap">{formatDate(log.createdAt)}</td>
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
