'use client';

import { Bell, Search, Sun, Moon, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface TopbarProps {
  title: string;
  subtitle?: string;
  userName?: string;
  orgName?: string;
}

export default function Topbar({ title, subtitle, orgName = 'Organization' }: TopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = 0;

  return (
    <header
      style={{
        background: 'rgba(10, 10, 15, 0.8)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Page Title */}
        <div>
          <h1 className="text-lg font-bold text-white leading-none">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search anything..."
              className="glass-input pl-9 pr-4 py-2 text-sm w-64"
            />
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  className="absolute top-1 right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                  style={{ background: '#f43f5e', lineHeight: 1 }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-80 glass-card py-2"
                style={{ zIndex: 100, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
              >
                <div className="px-4 py-2 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-sm font-semibold text-white">Notifications</span>
                  <span className="badge badge-info">{unreadCount} new</span>
                </div>
                <div className="px-4 py-6 text-center text-sm text-slate-500">
                  No notifications yet.
                </div>
              </div>
            )}
          </div>

          {/* Org badge */}
          <div
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-white/5 transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              <span className="text-white text-[9px] font-bold">{orgName[0]}</span>
            </div>
            <span className="text-sm text-slate-300 font-medium">{orgName}</span>
            <ChevronDown size={14} className="text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
