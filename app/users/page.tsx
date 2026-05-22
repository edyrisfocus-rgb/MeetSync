'use client';

import { useState } from 'react';
import Topbar from '@/components/layout/Topbar';
import { Search, Plus, Filter, MoreVertical, Shield, Edit2, Trash2, UserCheck, UserX } from 'lucide-react';

const ROLES = ['super_admin', 'admin', 'staff', 'member', 'viewer'] as const;

const mockUsers = [
  { id: '1', name: 'Ahmad Rizky', email: 'ahmad@example.com', role: 'super_admin', status: 'active', lastLogin: '2 min ago', avatar: 'A' },
  { id: '2', name: 'Siti Rahayu', email: 'siti@example.com', role: 'admin', status: 'active', lastLogin: '1h ago', avatar: 'S' },
  { id: '3', name: 'Budi Santoso', email: 'budi@example.com', role: 'staff', status: 'active', lastLogin: '3h ago', avatar: 'B' },
  { id: '4', name: 'Diana Putri', email: 'diana@example.com', role: 'member', status: 'suspended', lastLogin: '1d ago', avatar: 'D' },
  { id: '5', name: 'Eko Prasetyo', email: 'eko@example.com', role: 'member', status: 'active', lastLogin: '2d ago', avatar: 'E' },
  { id: '6', name: 'Fitriani Dewi', email: 'fitri@example.com', role: 'viewer', status: 'active', lastLogin: '5d ago', avatar: 'F' },
  { id: '7', name: 'Guntur Wibowo', email: 'guntur@example.com', role: 'staff', status: 'inactive', lastLogin: '2w ago', avatar: 'G' },
];

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

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const filtered = mockUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div>
      <Topbar title="User Management" subtitle="Manage team members, roles, and permissions" />

      <div className="p-6 space-y-5 fade-up">
        {/* Actions Bar */}
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
          <button onClick={() => setShowModal(true)} className="btn-primary shrink-0">
            <Plus size={16} /> Add User
          </button>
        </div>

        {/* Table */}
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
                {filtered.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                          {user.avatar}
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
                    <td className="text-slate-500 text-sm">{user.lastLogin}</td>
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

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="glass-card p-6 w-full max-w-md mx-4 fade-up">
            <h2 className="text-lg font-bold text-white mb-5">Create New User</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Full Name</label>
                <input className="glass-input px-4 py-2.5 text-sm w-full" placeholder="Enter full name" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Email Address</label>
                <input type="email" className="glass-input px-4 py-2.5 text-sm w-full" placeholder="name@company.com" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Role</label>
                <select className="glass-input px-4 py-2.5 text-sm w-full">
                  {ROLES.map(r => <option key={r} value={r}>{roleLabel[r]}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
              <button className="btn-primary flex-1 justify-center">Create User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
