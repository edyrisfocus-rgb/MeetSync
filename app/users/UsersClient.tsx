'use client';

import { useState } from 'react';
import Topbar from '@/components/layout/Topbar';
import { Search, Plus, Shield, Edit2, Trash2, UserCheck } from 'lucide-react';
import type { User } from '@/types';

const ROLES = ['super_admin', 'admin', 'staff', 'member', 'viewer'] as const;

const roleBadge: Record<string, string> = {
  super_admin: 'badge-error',
  admin: 'badge-info',
  staff: 'badge-warning',
  member: 'badge-success',
  viewer: 'badge-neutral',
};

const roleLabel: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  staff: 'Staff',
  member: 'Member',
  viewer: 'Viewer',
};

function formatLastLogin(value?: string) {
  if (!value) return 'Never';
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export default function UsersClient({ users }: { users: User[] }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = users.filter(u => {
    const query = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div>
      <Topbar title="User Management" subtitle="Real users from your organization" />

      <div className="p-6 space-y-5 fade-up">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="glass-input pl-9 pr-4 py-2 text-sm w-56" />
            </div>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="glass-input px-3 py-2 text-sm">
              <option value="all">All Roles</option>
              {ROLES.map(r => <option key={r} value={r}>{roleLabel[r]}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="glass-input px-3 py-2 text-sm">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <button className="btn-primary shrink-0" disabled>
            <Plus size={16} /> Invite User
          </button>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm text-slate-400"><span className="text-white font-semibold">{filtered.length}</span> users found</p>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-slate-500">No users found.</td>
                  </tr>
                ) : filtered.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                          {user.image ? <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover" /> : user.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-200">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${roleBadge[user.role]}`}>{roleLabel[user.role]}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : user.status === 'suspended' ? 'bg-rose-400' : 'bg-slate-500'}`} />
                        <span className="text-sm capitalize text-slate-400">{user.status}</span>
                      </div>
                    </td>
                    <td className="text-slate-500 text-sm">{formatLastLogin(user.lastLogin)}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all" title="Manage Role">
                          <Shield size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all" title="Activate">
                          <UserCheck size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all" title="Suspend">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
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
