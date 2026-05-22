'use client';

import { FormEvent, useEffect, useState } from 'react';
import Topbar from '@/components/layout/Topbar';
import { Upload, FileText, Image, File, Eye, Download, CheckCircle, Clock, ArrowRight, Trash2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { ApprovalStatus, Document as AppDocument } from '@/types';

type FileType = AppDocument['fileType'];
type DocumentItem = AppDocument;

type DocumentForm = {
  title: string;
  category: string;
  fileType: FileType;
  fileSizeMb: string;
  fileUrl: string;
  description: string;
};

const initialForm: DocumentForm = {
  title: '',
  category: '',
  fileType: 'pdf',
  fileSizeMb: '1',
  fileUrl: '',
  description: '',
};

const filters: Array<'all' | ApprovalStatus> = ['all', 'draft', 'review', 'approved', 'published'];

const statusConfig: Record<ApprovalStatus, { label: string; badge: string; icon: React.ElementType; nextAction?: string }> = {
  draft: { label: 'Draft', badge: 'badge-neutral', icon: File, nextAction: 'Submit for Review' },
  review: { label: 'In Review', badge: 'badge-warning', icon: Clock, nextAction: 'Approve' },
  approved: { label: 'Approved', badge: 'badge-info', icon: CheckCircle, nextAction: 'Publish' },
  published: { label: 'Published', badge: 'badge-success', icon: CheckCircle },
};

const fileIcon: Record<FileType, React.ElementType> = {
  pdf: FileText,
  image: Image,
  doc: FileText,
  other: File,
};

const fileColor: Record<FileType, string> = {
  pdf: '#f43f5e',
  image: '#10b981',
  doc: '#6366f1',
  other: '#94a3b8',
};

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [filter, setFilter] = useState<'all' | ApprovalStatus>('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<DocumentForm>(initialForm);

  const filtered = filter === 'all' ? docs : docs.filter(d => d.status === filter);

  useEffect(() => {
    let active = true;

    async function loadDocuments() {
      const res = await fetch('/api/documents');
      const data = await res.json();
      if (!active) return;

      if (!res.ok) {
        toast.error(data.error || 'Failed to load documents');
        setLoading(false);
        return;
      }

      setDocs(data.documents);
      setLoading(false);
    }

    loadDocuments();

    return () => {
      active = false;
    };
  }, []);

  const createDocument = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        category: form.category,
        fileType: form.fileType,
        fileSize: Number(form.fileSizeMb) * 1024 * 1024,
        fileUrl: form.fileUrl,
        description: form.description,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      toast.error(data.error || 'Failed to create document');
      return;
    }

    setDocs(prev => [data.document, ...prev]);
    setForm(initialForm);
    setShowModal(false);
    toast.success('Document created');
  };

  const advanceStatus = async (id: string) => {
    const res = await fetch(`/api/documents/${id}`, { method: 'PATCH' });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || 'Failed to update status');
      return;
    }

    setDocs(prev => prev.map(doc => (doc._id === id ? data.document : doc)));
    toast.success('Document status updated');
  };

  const deleteDocument = async (id: string) => {
    const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || 'Failed to delete document');
      return;
    }

    setDocs(prev => prev.filter(doc => doc._id !== id));
    toast.success('Document deleted');
  };

  return (
    <div>
      <Topbar title="Document Hub" subtitle="Manage files with approval workflows" />

      <div className="p-6 space-y-5 fade-up">
        <div
          className="glass-card p-8 text-center transition-all cursor-pointer"
          style={{ border: dragOver ? '2px dashed #6366f1' : '2px dashed rgba(255,255,255,0.08)', background: dragOver ? 'rgba(99,102,241,0.05)' : undefined }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); setShowModal(true); }}
          onClick={() => setShowModal(true)}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <Upload size={24} className="text-indigo-400" />
          </div>
          <p className="text-base font-semibold text-slate-200">Drop files here or <span className="text-indigo-400 cursor-pointer hover:underline">browse</span></p>
          <p className="text-sm text-slate-500 mt-1">Create document metadata — file storage can be connected later</p>
        </div>

        <div className="flex gap-2 flex-wrap items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filter === f ? 'btn-primary' : 'btn-ghost'}`}>
                {f === 'all' ? 'All Files' : f}
                <span className="ml-2 text-xs opacity-70">
                  {f === 'all' ? docs.length : docs.filter(d => d.status === f).length}
                </span>
              </button>
            ))}
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={16} /> New Document
          </button>
        </div>

        {loading ? (
          <div className="glass-card p-8 text-center text-slate-500">Loading documents...</div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <FileText size={28} className="text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">No documents found</p>
            <p className="text-xs text-slate-600 mt-1">Create your first document to start the approval workflow.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(doc => {
              const FileIcon = fileIcon[doc.fileType] || File;
              const sc = statusConfig[doc.status];
              const StatusIcon = sc.icon;
              return (
                <div key={doc._id} className="glass-card glass-card-hover p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${fileColor[doc.fileType]}18`, border: `1px solid ${fileColor[doc.fileType]}30` }}>
                      <FileIcon size={22} style={{ color: fileColor[doc.fileType] }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-200 truncate">{doc.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{formatFileSize(doc.fileSize)} · {doc.category || 'Uncategorized'}</p>
                      <p className="text-xs text-slate-600 mt-0.5">by {doc.uploadedByName} · {formatDate(doc.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className={`badge ${sc.badge}`}><StatusIcon size={11} className="mr-1" />{sc.label}</span>
                    <div className="flex gap-1">
                      <a href={doc.fileUrl || '#'} className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all" title="Preview">
                        <Eye size={14} />
                      </a>
                      <a href={doc.fileUrl || '#'} className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all" title="Download">
                        <Download size={14} />
                      </a>
                      {sc.nextAction && (
                        <button onClick={() => advanceStatus(doc._id)} className="p-1.5 rounded-lg text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all" title={sc.nextAction}>
                          <ArrowRight size={14} />
                        </button>
                      )}
                      <button onClick={() => deleteDocument(doc._id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <form onSubmit={createDocument} className="glass-card p-6 w-full max-w-lg mx-4 fade-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Create Document</h2>
              <button type="button" onClick={() => setShowModal(false)} className="p-1 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Title</label>
                <input required value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} className="glass-input px-4 py-2.5 text-sm w-full" placeholder="Q4 Business Report" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1.5">Category</label>
                  <input value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))} className="glass-input px-4 py-2.5 text-sm w-full" placeholder="Finance" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1.5">File Type</label>
                  <select value={form.fileType} onChange={e => setForm(prev => ({ ...prev, fileType: e.target.value as FileType }))} className="glass-input px-4 py-2.5 text-sm w-full">
                    <option value="pdf">PDF</option>
                    <option value="doc">DOC</option>
                    <option value="image">Image</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1.5">Size (MB)</label>
                  <input required type="number" min="0.01" max="50" step="0.01" value={form.fileSizeMb} onChange={e => setForm(prev => ({ ...prev, fileSizeMb: e.target.value }))} className="glass-input px-4 py-2.5 text-sm w-full" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1.5">File URL</label>
                  <input value={form.fileUrl} onChange={e => setForm(prev => ({ ...prev, fileUrl: e.target.value }))} className="glass-input px-4 py-2.5 text-sm w-full" placeholder="https://..." />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} className="glass-input px-4 py-2.5 text-sm w-full min-h-20" placeholder="Optional notes" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
              <button disabled={saving} className="btn-primary flex-1 justify-center">{saving ? 'Creating...' : 'Create Document'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
