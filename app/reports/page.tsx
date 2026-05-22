'use client';

import Topbar from '@/components/layout/Topbar';
import { Download, FileSpreadsheet, FileText, Printer, BarChart2, Users, FolderOpen, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const reportTypes = [
  {
    title: 'User Report',
    description: 'Complete list of all users with roles, status, and login history',
    icon: Users,
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.1)',
    border: 'rgba(99,102,241,0.2)',
  },
  {
    title: 'Document Report',
    description: 'All uploaded documents with approval status and metadata',
    icon: FolderOpen,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.2)',
  },
  {
    title: 'Activity Log Report',
    description: 'Full audit trail with timestamps, IPs, and action details',
    icon: Activity,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.2)',
  },
  {
    title: 'Summary Analytics',
    description: 'High-level KPI dashboard summary for executive review',
    icon: BarChart2,
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.1)',
    border: 'rgba(14,165,233,0.2)',
  },
];

const recentExports = [
  { name: 'User List May 2026', format: 'Excel', size: '45 KB', date: '22 May 2026', by: 'Ahmad Rizky' },
  { name: 'Activity Log Q2 2026', format: 'PDF', size: '1.2 MB', date: '20 May 2026', by: 'Siti Rahayu' },
  { name: 'Document Summary', format: 'Excel', size: '78 KB', date: '18 May 2026', by: 'Budi Santoso' },
];

export default function ReportsPage() {
  const handleExport = (format: string, title: string) => {
    toast.success(`Exporting "${title}" as ${format}... (Demo)`);
  };

  return (
    <div>
      <Topbar title="Reports" subtitle="Export and print comprehensive system reports" />

      <div className="p-6 space-y-6 fade-up">
        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.title} className="glass-card glass-card-hover p-6" style={{ border: `1px solid ${report.border}` }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: report.bg }}>
                    <Icon size={22} style={{ color: report.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{report.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{report.description}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => handleExport('Excel', report.title)}
                    className="btn-ghost flex-1 justify-center text-sm"
                  >
                    <FileSpreadsheet size={15} className="text-emerald-400" /> Excel
                  </button>
                  <button
                    onClick={() => handleExport('PDF', report.title)}
                    className="btn-ghost flex-1 justify-center text-sm"
                  >
                    <FileText size={15} className="text-rose-400" /> PDF
                  </button>
                  <button
                    onClick={() => handleExport('Print', report.title)}
                    className="btn-ghost flex-1 justify-center text-sm"
                  >
                    <Printer size={15} className="text-slate-400" /> Print
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Date Range Selector */}
        <div className="glass-card p-5">
          <h2 className="font-semibold text-white mb-4">Custom Date Range Export</h2>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Start Date</label>
              <input type="date" className="glass-input px-4 py-2.5 text-sm w-full" defaultValue="2026-05-01" />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="text-xs font-medium text-slate-400 block mb-1.5">End Date</label>
              <input type="date" className="glass-input px-4 py-2.5 text-sm w-full" defaultValue="2026-05-22" />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Report Type</label>
              <select className="glass-input px-4 py-2.5 text-sm w-full">
                <option>All Reports</option>
                <option>User Report</option>
                <option>Document Report</option>
                <option>Activity Logs</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Format</label>
              <select className="glass-input px-4 py-2.5 text-sm w-full">
                <option>Excel (.xlsx)</option>
                <option>PDF</option>
                <option>CSV</option>
              </select>
            </div>
            <button
              onClick={() => handleExport('Excel', 'Custom Report')}
              className="btn-primary shrink-0"
            >
              <Download size={15} /> Generate Report
            </button>
          </div>
        </div>

        {/* Recent Exports */}
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="font-semibold text-white">Recent Exports</h2>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Format</th>
                <th>Size</th>
                <th>Date</th>
                <th>Generated By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentExports.map((exp, i) => (
                <tr key={i}>
                  <td className="text-sm font-medium text-slate-200">{exp.name}</td>
                  <td>
                    <span className={`badge ${exp.format === 'Excel' ? 'badge-success' : 'badge-error'}`}>{exp.format}</span>
                  </td>
                  <td className="text-slate-500 text-sm">{exp.size}</td>
                  <td className="text-slate-500 text-sm">{exp.date}</td>
                  <td className="text-slate-400 text-sm">{exp.by}</td>
                  <td>
                    <button className="btn-ghost py-1.5 text-xs">
                      <Download size={13} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
