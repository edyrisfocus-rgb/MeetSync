'use client';

import Topbar from '@/components/layout/Topbar';
import { Settings, Bell, Shield, Database, Palette, Globe, Save } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const save = () => toast.success('Settings saved successfully!');

  return (
    <div>
      <Topbar title="Settings" subtitle="Manage your account and workspace preferences" />

      <div className="p-6 fade-up">
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Tab sidebar */}
          <div className="lg:w-52 shrink-0">
            <div className="glass-card p-2 space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`sidebar-link w-full ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Settings content */}
          <div className="flex-1 glass-card p-6 space-y-6">
            {activeTab === 'general' && (
              <>
                <h2 className="font-bold text-white text-lg border-b border-white/5 pb-4">General Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1.5">Organization Name</label>
                    <input className="glass-input px-4 py-2.5 text-sm w-full" defaultValue="MeetSync Demo Org" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1.5">Organization Slug</label>
                    <input className="glass-input px-4 py-2.5 text-sm w-full" defaultValue="meetsync-demo" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1.5">Default Language</label>
                    <select className="glass-input px-4 py-2.5 text-sm w-full">
                      <option>English (EN)</option>
                      <option>Bahasa Indonesia (ID)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1.5">Timezone</label>
                    <select className="glass-input px-4 py-2.5 text-sm w-full">
                      <option>Asia/Jakarta (WIB, UTC+7)</option>
                      <option>Asia/Makassar (WITA, UTC+8)</option>
                      <option>Asia/Jayapura (WIT, UTC+9)</option>
                      <option>UTC</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'security' && (
              <>
                <h2 className="font-bold text-white text-lg border-b border-white/5 pb-4">Security Settings</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Two-Factor Authentication', description: 'Require 2FA for all admin users', defaultChecked: true },
                    { label: 'Session Timeout', description: 'Auto-logout after 2 hours of inactivity', defaultChecked: true },
                    { label: 'IP Whitelisting', description: 'Restrict access to specific IP ranges', defaultChecked: false },
                    { label: 'Audit Logging', description: 'Log all CRUD operations and logins', defaultChecked: true },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                        <div className="w-10 h-6 rounded-full peer-checked:bg-indigo-600 bg-slate-700 peer-focus:ring-2 peer-focus:ring-indigo-500/40 transition-all relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'notifications' && (
              <>
                <h2 className="font-bold text-white text-lg border-b border-white/5 pb-4">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Email Notifications', desc: 'Send email alerts for approvals and updates', on: true },
                    { label: 'WhatsApp Notifications', desc: 'Send WhatsApp messages via API', on: false },
                    { label: 'In-App Notifications', desc: 'Show notifications inside the platform', on: true },
                    { label: 'Weekly Digest', desc: 'Receive a weekly summary email every Monday', on: true },
                    { label: 'Security Alerts', desc: 'Immediate alerts for failed logins and threats', on: true },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.on} className="sr-only peer" />
                        <div className="w-10 h-6 rounded-full peer-checked:bg-indigo-600 bg-slate-700 transition-all relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'appearance' && (
              <>
                <h2 className="font-bold text-white text-lg border-b border-white/5 pb-4">Appearance</h2>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-3">Theme</label>
                    <div className="flex gap-3">
                      {['Dark (Default)', 'Light', 'System'].map(t => (
                        <button key={t} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${t === 'Dark (Default)' ? 'btn-primary' : 'btn-ghost'}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-3">Accent Color</label>
                    <div className="flex gap-3">
                      {['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#f43f5e'].map(c => (
                        <button key={c} className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-offset-[#0a0a0f] transition-all hover:scale-110"
                          style={{ background: c, '--tw-ring-color': c } as React.CSSProperties} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1.5">Sidebar Width</label>
                    <input type="range" min="220" max="300" defaultValue="260" className="w-full" />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end pt-4 border-t border-white/5">
              <button onClick={save} className="btn-primary">
                <Save size={15} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
