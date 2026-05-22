'use client';

import { useState } from 'react';
import Topbar from '@/components/layout/Topbar';
import { Upload, FileText, Image, File, Eye, Download, CheckCircle, Clock, AlertCircle, ArrowRight, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

type DocStatus = 'draft' | 'review' | 'approved' | 'published';

const mockDocs = [
  { id: '1', title: 'Q4 Business Report 2025', type: 'pdf', size: '2.3 MB', status: 'published' as DocStatus, uploadedBy: 'Ahmad Rizky', date: '22 May 2026', category: 'Finance' },
  { id: '2', title: 'Marketing Campaign Brief', type: 'doc', size: '850 KB', status: 'approved' as DocStatus, uploadedBy: 'Siti Rahayu', date: '21 May 2026', category: 'Marketing' },
  { id: '3', title: 'Partnership Proposal v2', type: 'pdf', size: '1.7 MB', status: 'review' as DocStatus, uploadedBy: 'Budi Santoso', date: '20 May 2026', category: 'Business' },
  { id: '4', title: 'Office Floor Plan', type: 'image', size: '4.1 MB', status: 'approved' as DocStatus, uploadedBy: 'Diana Putri', date: '18 May 2026', category: 'HR' },
  { id: '5', title: 'Product Roadmap 2026', type: 'pdf', size: '950 KB', status: 'draft' as DocStatus, uploadedBy: 'Eko Prasetyo', date: '15 May 2026', category: 'Product' },
];

const statusConfig: Record<DocStatus, { label: string; badge: string; icon: React.ElementType; nextAction?: string }> = {
  draft: { label: 'Draft', badge: 'badge-neutral', icon: File, nextAction: 'Submit for Review' },
  review: { label: 'In Review', badge: 'badge-warning', icon: Clock, nextAction: 'Approve' },
  approved: { label: 'Approved', badge: 'badge-info', icon: CheckCircle, nextAction: 'Publish' },
  published: { label: 'Published', badge: 'badge-success', icon: CheckCircle },
};

const fileIcon: Record<string, React.ElementType> = {
  pdf: FileText,
  image: Image,
  doc: FileText,
  other: File,
};

const fileColor: Record<string, string> = {
  pdf: '#f43f5e',
  image: '#10b981',
  doc: '#6366f1',
  other: '#94a3b8',
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState(mockDocs);
  const [dragOver, setDragOver] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? docs : docs.filter(d => d.status === filter);

  const advanceStatus = (id: string) => {
    const flow: DocStatus[] = ['draft', 'review', 'approved', 'published'];
    setDocs(prev => prev.map(d => {
      if (d.id !== id) return d;
      const idx = flow.indexOf(d.status);
      if (idx < flow.length - 1) return { ...d, status: flow[idx + 1] };
      return d;
    }));
    toast.success('Document status updated!');
  };

  return (
    <div>
      <Topbar title="Document Hub" subtitle="Manage files with approval workflows" />

      <div className="p-6 space-y-5 fade-up">
        {/* Upload Zone */}
        <div
          className="glass-card p-8 text-center transition-all cursor-pointer"
          style={{ border: dragOver ? '2px dashed #6366f1' : '2px dashed rgba(255,255,255,0.08)', background: dragOver ? 'rgba(99,102,241,0.05)' : undefined }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); toast.success('File received! (Demo mode)'); }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <Upload size={24} className="text-indigo-400" />
          </div>
          <p className="text-base font-semibold text-slate-200">Drop files here or <span className="text-indigo-400 cursor-pointer hover:underline">browse</span></p>
          <p className="text-sm text-slate-500 mt-1">Supports PDF, Images, DOC — max 50MB per file</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {['all','draft','review','approved','published'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filter === f ? 'btn-primary' : 'btn-ghost'}`}>
              {f === 'all' ? 'All Files' : f}
              <span className="ml-2 text-xs opacity-70">
                {f === 'all' ? docs.length : docs.filter(d => d.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(doc => {
            const FileIcon = fileIcon[doc.type] || File;
            const sc = statusConfig[doc.status];
            const StatusIcon = sc.icon;
            return (
              <div key={doc.id} className="glass-card glass-card-hover p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${fileColor[doc.type]}18`, border: `1px solid ${fileColor[doc.type]}30` }}>
                    <FileIcon size={22} style={{ color: fileColor[doc.type] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-200 truncate">{doc.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{doc.size} · {doc.category}</p>
                    <p className="text-xs text-slate-600 mt-0.5">by {doc.uploadedBy} · {doc.date}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className={`badge ${sc.badge}`}>{sc.label}</span>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all" title="Preview">
                      <Eye size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all" title="Download">
                      <Download size={14} />
                    </button>
                    {sc.nextAction && (
                      <button onClick={() => advanceStatus(doc.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all" title={sc.nextAction}>
                        <ArrowRight size={14} />
                      </button>
                    )}
                    <button className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
