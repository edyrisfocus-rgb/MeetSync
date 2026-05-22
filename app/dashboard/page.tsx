import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Topbar from '@/components/layout/Topbar';
import { Users, FileText, FolderOpen, Clock, TrendingUp, Activity, CheckCircle, AlertCircle } from 'lucide-react';

const mockStats = [
  { label: 'Total Users', value: '2,847', change: '+12%', icon: Users, variant: 'brand', trend: 'up' },
  { label: 'Active Documents', value: '1,293', change: '+8%', icon: FolderOpen, variant: 'emerald', trend: 'up' },
  { label: 'Pending Approvals', value: '47', change: '-3', icon: Clock, variant: 'amber', trend: 'down' },
  { label: 'Activity Today', value: '384', change: '+23%', icon: Activity, variant: 'sky', trend: 'up' },
];

const mockActivity = [
  { id: 1, user: 'Ahmad Rizky', action: 'uploaded', resource: 'Q4 Report.pdf', time: '2m ago', status: 'success', avatar: 'A' },
  { id: 2, user: 'Siti Rahayu', action: 'approved', resource: 'Marketing Proposal', time: '15m ago', status: 'success', avatar: 'S' },
  { id: 3, user: 'Budi Santoso', action: 'created', resource: 'New User Account', time: '1h ago', status: 'success', avatar: 'B' },
  { id: 4, user: 'Diana Putri', action: 'failed login', resource: 'Authentication', time: '2h ago', status: 'failed', avatar: 'D' },
  { id: 5, user: 'Eko Prasetyo', action: 'exported', resource: 'User Report Excel', time: '3h ago', status: 'success', avatar: 'E' },
  { id: 6, user: 'Fitriani', action: 'deleted', resource: 'Draft Document', time: '4h ago', status: 'warning', avatar: 'F' },
];

const approvalQueue = [
  { title: 'Business Proposal - PT Maju', requestor: 'Ahmad Rizky', date: '22 May 2026', status: 'review' },
  { title: 'Marketing Campaign Brief', requestor: 'Siti Rahayu', date: '21 May 2026', status: 'review' },
  { title: 'Annual Budget Report', requestor: 'Budi Santoso', date: '20 May 2026', status: 'review' },
];

const variantStyles: Record<string, { border: string; icon: string; glow: string }> = {
  brand: { border: 'rgba(99,102,241,0.3)', icon: 'linear-gradient(135deg,#6366f1,#8b5cf6)', glow: 'rgba(99,102,241,0.1)' },
  emerald: { border: 'rgba(16,185,129,0.3)', icon: 'linear-gradient(135deg,#10b981,#06d6a0)', glow: 'rgba(16,185,129,0.1)' },
  amber: { border: 'rgba(245,158,11,0.3)', icon: 'linear-gradient(135deg,#f59e0b,#fbbf24)', glow: 'rgba(245,158,11,0.1)' },
  sky: { border: 'rgba(14,165,233,0.3)', icon: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', glow: 'rgba(14,165,233,0.1)' },
  rose: { border: 'rgba(244,63,94,0.3)', icon: 'linear-gradient(135deg,#f43f5e,#fb7185)', glow: 'rgba(244,63,94,0.1)' },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const user = session.user as any;

  return (
    <div>
      <Topbar
        title="Dashboard"
        subtitle={`Welcome back, ${user.name?.split(' ')[0] || 'User'} 👋`}
        userName={user.name}
        orgName={user.organizationName || 'MeetSync'}
      />

      <div className="p-6 space-y-6 fade-up">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {mockStats.map((stat) => {
            const Icon = stat.icon;
            const vs = variantStyles[stat.variant];
            return (
              <div
                key={stat.label}
                className="stat-card glass-card-hover"
                style={{ border: `1px solid ${vs.border}`, boxShadow: `0 0 40px ${vs.glow}` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp size={12} className={stat.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'} style={{ transform: stat.trend === 'down' ? 'scaleY(-1)' : undefined }} />
                      <span className={`text-xs font-semibold ${stat.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>{stat.change}</span>
                      <span className="text-xs text-slate-600">vs last month</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: vs.icon }}>
                    <Icon size={20} color="white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="xl:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">Recent Activity</h2>
              <a href="/logs" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View all →</a>
            </div>
            <div className="space-y-3">
              {mockActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                    {item.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">
                      <span className="font-semibold text-white">{item.user}</span>
                      {' '}<span className="text-slate-500">{item.action}</span>{' '}
                      <span className="text-indigo-400">{item.resource}</span>
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">{item.time}</p>
                  </div>
                  <span className={`badge ${item.status === 'success' ? 'badge-success' : item.status === 'failed' ? 'badge-error' : 'badge-warning'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Approval Queue */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">Pending Approvals</h2>
              <span className="badge badge-warning">{approvalQueue.length}</span>
            </div>
            <div className="space-y-3">
              {approvalQueue.map((item, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-sm font-medium text-slate-200 leading-snug">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-1">by {item.requestor}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-slate-600">{item.date}</span>
                    <div className="flex gap-2">
                      <button className="p-1 rounded-md bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-all">
                        <CheckCircle size={14} />
                      </button>
                      <button className="p-1 rounded-md bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 transition-all">
                        <AlertCircle size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <a href="/documents" className="btn-ghost w-full justify-center mt-4 text-xs">
              View all documents
            </a>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <a href="/users" className="btn-ghost text-sm">+ Add User</a>
            <a href="/documents" className="btn-ghost text-sm">+ Upload Document</a>
            <a href="/ai" className="btn-primary text-sm">✦ Generate with AI</a>
            <a href="/reports" className="btn-ghost text-sm">↓ Export Report</a>
            <a href="/logs" className="btn-ghost text-sm">⌖ View Audit Logs</a>
          </div>
        </div>
      </div>
    </div>
  );
}
