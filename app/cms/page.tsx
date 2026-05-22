'use client';

import { useState } from 'react';
import Topbar from '@/components/layout/Topbar';
import { Newspaper, Image, FileText, Globe, Plus, Edit2, Trash2, Eye } from 'lucide-react';

type CMSCategory = 'article' | 'news' | 'banner' | 'page';

const mockContent = [
  { id: '1', title: 'Selamat Datang di MeetSync Platform', category: 'banner' as CMSCategory, status: 'published', author: 'Ahmad Rizky', date: '22 May 2026' },
  { id: '2', title: 'Cara Menggunakan Fitur AI Business Generator', category: 'article' as CMSCategory, status: 'published', author: 'Siti Rahayu', date: '20 May 2026' },
  { id: '3', title: 'Update Platform v2.1 — New Features', category: 'news' as CMSCategory, status: 'draft', author: 'Budi Santoso', date: '18 May 2026' },
  { id: '4', title: 'Kebijakan Privasi & Ketentuan Layanan', category: 'page' as CMSCategory, status: 'published', author: 'Admin', date: '10 May 2026' },
  { id: '5', title: 'MeetSync Raih Penghargaan Digital Innovation Award', category: 'news' as CMSCategory, status: 'review', author: 'Diana Putri', date: '8 May 2026' },
];

const categoryConfig: Record<CMSCategory, { icon: React.ElementType; color: string; bg: string }> = {
  article: { icon: FileText, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  news: { icon: Newspaper, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  banner: { icon: Image, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  page: { icon: Globe, color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' },
};

export default function CMSPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showEditor, setShowEditor] = useState(false);

  const filtered = activeCategory === 'all' ? mockContent : mockContent.filter(c => c.category === activeCategory);

  return (
    <div>
      <Topbar title="CMS Manager" subtitle="Manage dynamic pages, banners, articles, and news" />

      <div className="p-6 space-y-5 fade-up">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['article','news','banner','page'] as CMSCategory[]).map(cat => {
            const cc = categoryConfig[cat];
            const Icon = cc.icon;
            const count = mockContent.filter(c => c.category === cat).length;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat === activeCategory ? 'all' : cat)}
                className={`glass-card glass-card-hover p-4 text-left transition-all ${activeCategory === cat ? 'border-indigo-500/40' : ''}`}
                style={activeCategory === cat ? { border: '1px solid rgba(99,102,241,0.4)' } : undefined}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: cc.bg }}>
                  <Icon size={20} style={{ color: cc.color }} />
                </div>
                <p className="text-xl font-bold text-white">{count}</p>
                <p className="text-xs text-slate-500 capitalize mt-0.5">{cat}s</p>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {['all','article','news','banner','page'].map(f => (
              <button key={f} onClick={() => setActiveCategory(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${activeCategory === f ? 'btn-primary' : 'btn-ghost'}`}>
                {f === 'all' ? 'All Content' : f + 's'}
              </button>
            ))}
          </div>
          <button onClick={() => setShowEditor(true)} className="btn-primary text-sm"><Plus size={15} /> New Content</button>
        </div>

        <div className="glass-card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Author</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const cc = categoryConfig[item.category];
                const Icon = cc.icon;
                return (
                  <tr key={item.id}>
                    <td>
                      <p className="text-sm font-medium text-slate-200">{item.title}</p>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: cc.bg }}>
                          <Icon size={12} style={{ color: cc.color }} />
                        </div>
                        <span className="text-xs text-slate-400 capitalize">{item.category}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${item.status === 'published' ? 'badge-success' : item.status === 'draft' ? 'badge-neutral' : 'badge-warning'}`}>{item.status}</span>
                    </td>
                    <td className="text-slate-400 text-sm">{item.author}</td>
                    <td className="text-slate-500 text-xs">{item.date}</td>
                    <td>
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"><Eye size={14} /></button>
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all"><Edit2 size={14} /></button>
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="glass-card p-6 w-full max-w-lg mx-4 fade-up">
            <h2 className="text-lg font-bold text-white mb-5">Create New Content</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Title</label>
                <input className="glass-input px-4 py-2.5 text-sm w-full" placeholder="Enter content title..." />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Type</label>
                <select className="glass-input px-4 py-2.5 text-sm w-full">
                  <option>Article</option><option>News</option><option>Banner</option><option>Page</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Content</label>
                <textarea className="glass-input px-4 py-3 text-sm w-full resize-none" rows={5} placeholder="Write your content..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowEditor(false)} className="btn-ghost flex-1">Cancel</button>
              <button className="btn-primary flex-1 justify-center">Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
