import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import DocumentModel from '@/models/document';
import LogModel from '@/models/log';
import UserModel from '@/models/user';
import { redirect } from 'next/navigation';
import Topbar from '@/components/layout/Topbar';
import { Users, FolderOpen, Clock, TrendingUp, Activity, CheckCircle, AlertCircle } from 'lucide-react';

const variantStyles: Record<string, { border: string; icon: string; glow: string }> = {
  brand: { border: 'rgba(99,102,241,0.3)', icon: 'linear-gradient(135deg,#6366f1,#8b5cf6)', glow: 'rgba(99,102,241,0.1)' },
  emerald: { border: 'rgba(16,185,129,0.3)', icon: 'linear-gradient(135deg,#10b981,#06d6a0)', glow: 'rgba(16,185,129,0.1)' },
  amber: { border: 'rgba(245,158,11,0.3)', icon: 'linear-gradient(135deg,#f59e0b,#fbbf24)', glow: 'rgba(245,158,11,0.1)' },
  sky: { border: 'rgba(14,165,233,0.3)', icon: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', glow: 'rgba(14,165,233,0.1)' },
};

function formatRelativeTime(date: Date) {
  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.tenantId) redirect('/login');
  const user = session.user;

  await connectDB();
  const tenantId = user.tenantId;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalUsers, totalDocuments, pendingApprovals, activityToday, recentLogs, reviewDocuments] = await Promise.all([
    UserModel.countDocuments({ tenantId }),
    DocumentModel.countDocuments({ tenantId }),
    DocumentModel.countDocuments({ tenantId, status: 'review' }),
    LogModel.countDocuments({ tenantId, createdAt: { $gte: startOfToday } }),
    LogModel.find({ tenantId }).sort({ createdAt: -1 }).limit(6).lean(),
    DocumentModel.find({ tenantId, status: 'review' }).sort({ updatedAt: -1 }).limit(3).lean(),
  ]);

  const stats = [
    { label: 'Total Users', value: totalUsers.toLocaleString(), icon: Users, variant: 'brand' },
    { label: 'Active Documents', value: totalDocuments.toLocaleString(), icon: FolderOpen, variant: 'emerald' },
    { label: 'Pending Approvals', value: pendingApprovals.toLocaleString(), icon: Clock, variant: 'amber' },
    { label: 'Activity Today', value: activityToday.toLocaleString(), icon: Activity, variant: 'sky' },
  ];

  return (
    <div>
      <Topbar
        title="Dashboard"
        subtitle={`Welcome back, ${user.name?.split(' ')[0] || 'User'}`}
        userName={user.name || undefined}
        orgName={user.organizationName || 'Organization'}
      />

      <div className="p-6 space-y-6 fade-up">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => {
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
                      <TrendingUp size={12} className="text-slate-500" />
                      <span className="text-xs text-slate-600">live tenant data</span>
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
          <div className="xl:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">Recent Activity</h2>
              <a href="/logs" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View all →</a>
            </div>
            {recentLogs.length === 0 ? (
              <p className="text-sm text-slate-500">No activity yet.</p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((item) => (
                  <div key={item._id.toString()} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                      {item.userName[0] || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-white">{item.userName}</span>
                        {' '}<span className="text-slate-500">{item.action}</span>{' '}
                        <span className="text-indigo-400">{item.resource}</span>
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">{formatRelativeTime(item.createdAt)}</p>
                    </div>
                    <span className={`badge ${item.status === 'success' ? 'badge-success' : item.status === 'failed' ? 'badge-error' : 'badge-warning'}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">Pending Approvals</h2>
              <span className="badge badge-warning">{reviewDocuments.length}</span>
            </div>
            {reviewDocuments.length === 0 ? (
              <p className="text-sm text-slate-500">No documents waiting for approval.</p>
            ) : (
              <div className="space-y-3">
                {reviewDocuments.map((item) => (
                  <div key={item._id.toString()} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-sm font-medium text-slate-200 leading-snug">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-1">by {item.uploadedByName}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-slate-600">{formatDate(item.updatedAt)}</span>
                      <div className="flex gap-2">
                        <CheckCircle size={14} className="text-emerald-400" />
                        <AlertCircle size={14} className="text-amber-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <a href="/documents" className="btn-ghost w-full justify-center mt-4 text-xs">
              View all documents
            </a>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <a href="/users" className="btn-ghost text-sm">+ Add User</a>
            <a href="/documents" className="btn-ghost text-sm">+ Upload Document</a>
            <a href="/ai" className="btn-primary text-sm">Generate with AI</a>
            <a href="/reports" className="btn-ghost text-sm">Export Report</a>
            <a href="/logs" className="btn-ghost text-sm">View Audit Logs</a>
          </div>
        </div>
      </div>
    </div>
  );
}
