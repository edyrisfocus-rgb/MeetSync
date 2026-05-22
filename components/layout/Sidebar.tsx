'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, Bot, FolderOpen,
  Newspaper, BarChart2, Settings, LogOut, ChevronLeft,
  Building2, Shield, Bell
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['super_admin','admin','staff','member','viewer'] },
  { label: 'Users', href: '/users', icon: Users, roles: ['super_admin','admin'] },
  { label: 'Documents', href: '/documents', icon: FolderOpen, roles: ['super_admin','admin','staff','member'] },
  { label: 'Activity Logs', href: '/logs', icon: FileText, roles: ['super_admin','admin','staff'] },
  { label: 'AI Suite', href: '/ai', icon: Bot, roles: ['super_admin','admin','staff','member'] },
  { label: 'CMS', href: '/cms', icon: Newspaper, roles: ['super_admin'] },
  { label: 'Reports', href: '/reports', icon: BarChart2, roles: ['super_admin','admin','staff'] },
];

interface SidebarProps {
  userRole?: string;
  userName?: string;
  userEmail?: string;
  userImage?: string;
  orgName?: string;
}

export default function Sidebar({ userRole = 'member', userName = 'User', userEmail = '', userImage, orgName = 'MeetSync' }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = navItems.filter(item => item.roles.includes(userRole));

  const roleColors: Record<string, string> = {
    super_admin: 'text-rose-400',
    admin: 'text-violet-400',
    staff: 'text-sky-400',
    member: 'text-emerald-400',
    viewer: 'text-slate-400',
  };

  const roleLabel: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    staff: 'Staff',
    member: 'Member',
    viewer: 'Viewer',
  };

  return (
    <aside
      className="h-screen flex flex-col sticky top-0"
      style={{
        width: collapsed ? 72 : 260,
        background: 'rgba(10, 10, 15, 0.95)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        flexShrink: 0,
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Building2 size={16} color="white" />
            </div>
            <div>
              <div className="font-bold text-sm text-white leading-none">MeetSync</div>
              <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[120px]">{orgName}</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Building2 size={16} color="white" />
          </div>
        )}
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {collapsed && (
        <button onClick={() => setCollapsed(false)} className="mx-auto mt-2 p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
          <ChevronLeft size={16} style={{ transform: 'rotate(180deg)' }} />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: User info */}
      <div className="px-3 pb-4 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
        <Link href="/settings" className={`sidebar-link ${collapsed ? 'justify-center' : ''}`} title={collapsed ? 'Settings' : undefined}>
          <Settings size={18} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Settings</span>}
        </Link>

        {!collapsed && (
          <div className="mt-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3">
              {userImage ? (
                <img src={userImage} alt={userName} className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                  {userName[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-200 truncate">{userName}</div>
                <div className={`text-[11px] font-medium ${roleColors[userRole] || 'text-slate-400'}`}>{roleLabel[userRole] || userRole}</div>
              </div>
              <button onClick={() => signOut({ callbackUrl: '/login' })} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all" title="Sign out">
                <LogOut size={15} />
              </button>
            </div>
          </div>
        )}

        {collapsed && (
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="sidebar-link justify-center w-full" title="Sign out">
            <LogOut size={18} />
          </button>
        )}
      </nav>
    </aside>
  );
}
