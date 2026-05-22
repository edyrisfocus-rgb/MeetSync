'use client';

import { useState } from 'react';
import Topbar from '@/components/layout/Topbar';
import { Bot, Sparkles, FileText, BarChart2, Layout, Lightbulb, Copy, Download, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

type AiTab = 'proposal' | 'swot' | 'business_plan' | 'canvas';

const tabs: { id: AiTab; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'proposal', label: 'Proposal Generator', icon: FileText, description: 'Generate professional business proposals' },
  { id: 'swot', label: 'SWOT Analysis', icon: BarChart2, description: 'Analyze strengths, weaknesses, opportunities & threats' },
  { id: 'business_plan', label: 'Business Plan', icon: Lightbulb, description: 'Create comprehensive business plans' },
  { id: 'canvas', label: 'Business Canvas', icon: Layout, description: 'Map out your business model canvas' },
];

const swotMock = {
  strengths: ['Strong brand recognition in local market', 'Experienced leadership team with 10+ years', 'Proprietary technology platform', 'Diversified revenue streams'],
  weaknesses: ['Limited international market presence', 'High customer acquisition cost', 'Dependency on key personnel', 'Outdated legacy infrastructure'],
  opportunities: ['Expanding Southeast Asian digital market', 'AI/ML integration for automation', 'Government digital transformation grants', 'Strategic partnership potential'],
  threats: ['Increased competition from global players', 'Regulatory changes in data privacy', 'Economic slowdown impact on SME clients', 'Rapid technology obsolescence'],
};

export default function AiPage() {
  const [activeTab, setActiveTab] = useState<AiTab>('proposal');
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [swotGenerated, setSwotGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() && activeTab !== 'swot') {
      toast.error('Please enter a prompt first');
      return;
    }
    setLoading(true);
    // Simulate AI generation
    await new Promise(r => setTimeout(r, 1800));
    if (activeTab === 'swot') {
      setSwotGenerated(true);
    } else {
      setOutput(getMockOutput(activeTab, prompt));
    }
    setLoading(false);
    toast.success('Generated successfully!');
  };

  const getMockOutput = (tab: AiTab, prompt: string) => {
    const name = prompt || 'Your Business';
    if (tab === 'proposal') return `# Business Proposal\n\n## Executive Summary\n${name} presents an exceptional opportunity to deliver transformative value to our stakeholders through innovative solutions and strategic market positioning.\n\n## Problem Statement\nThe market currently lacks a comprehensive solution that addresses the core challenges faced by modern enterprises in their digital transformation journey.\n\n## Proposed Solution\nWe propose a phased implementation approach leveraging cutting-edge technology, experienced talent, and proven methodologies to deliver measurable ROI within 6 months.\n\n## Investment Required\n- Phase 1 (Discovery & Planning): IDR 150,000,000\n- Phase 2 (Development & Integration): IDR 450,000,000\n- Phase 3 (Launch & Support): IDR 200,000,000\n\n## Expected ROI\n350% over 24 months based on market projections and comparable implementations.`;
    if (tab === 'business_plan') return `# Business Plan: ${name}\n\n## 1. Executive Summary\nA data-driven enterprise with a vision to become the leading platform in Southeast Asia by 2028.\n\n## 2. Market Analysis\n- TAM: USD 4.2B\n- SAM: USD 820M\n- SOM: USD 41M (Year 3 target)\n\n## 3. Revenue Model\n- SaaS Subscriptions: 60%\n- Professional Services: 25%\n- Licensing & Partnerships: 15%\n\n## 4. Go-To-Market Strategy\nPhased market penetration starting with Indonesia (Q1), expanding to Malaysia & Thailand (Q3), and Philippines & Vietnam (Year 2).\n\n## 5. Financial Projections\n- Year 1: IDR 2.4B revenue\n- Year 2: IDR 7.8B revenue\n- Year 3: IDR 18.5B revenue`;
    return '';
  };

  const copyOutput = () => { navigator.clipboard.writeText(output); toast.success('Copied!'); };

  const canvasItems = [
    { title: 'Key Partners', color: '#6366f1', items: ['Technology vendors', 'Distribution partners', 'Strategic alliances'] },
    { title: 'Key Activities', color: '#8b5cf6', items: ['Platform development', 'Customer success', 'Marketing & sales'] },
    { title: 'Value Propositions', color: '#a855f7', items: ['Cost reduction 40%', 'Time to market 3x faster', 'AI-powered insights'] },
    { title: 'Customer Relations', color: '#06b6d4', items: ['Dedicated support', 'Community forum', 'Self-service portal'] },
    { title: 'Customer Segments', color: '#10b981', items: ['SME businesses', 'Enterprise corps', 'Government agencies'] },
    { title: 'Key Resources', color: '#f59e0b', items: ['Software IP', 'Talent pool', 'Data assets'] },
    { title: 'Channels', color: '#f43f5e', items: ['Direct sales', 'Partner network', 'Digital marketing'] },
    { title: 'Cost Structure', color: '#64748b', items: ['R&D: 35%', 'S&M: 30%', 'G&A: 15%', 'COGS: 20%'] },
    { title: 'Revenue Streams', color: '#22d3ee', items: ['Subscriptions', 'Services', 'Licensing'] },
  ];

  return (
    <div>
      <Topbar title="AI Suite" subtitle="Powered by Gemini AI — Generate business documents instantly" />

      <div className="p-6 fade-up">
        {/* Tab bar */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setOutput(''); setSwotGenerated(false); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${isActive ? 'btn-primary' : 'btn-ghost'}`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'canvas' ? (
          <div className="space-y-4">
            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles size={18} className="text-indigo-400" />
                <p className="text-sm text-slate-300">Generate a complete Business Model Canvas for your organization</p>
                <button onClick={handleGenerate} disabled={loading} className="btn-primary ml-auto text-sm">
                  {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {loading ? 'Generating...' : 'Generate Canvas'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {canvasItems.map(item => (
                <div key={item.title} className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {item.items.map(i => (
                      <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                        <span className="text-slate-600 mt-0.5">•</span>{i}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'swot' ? (
          <div className="space-y-4">
            <div className="glass-card p-5">
              <div className="flex items-center gap-3">
                <input className="glass-input px-4 py-2.5 text-sm flex-1" placeholder="Company or product name (e.g. MeetSync Platform)..." value={prompt} onChange={e => setPrompt(e.target.value)} />
                <button onClick={handleGenerate} disabled={loading} className="btn-primary text-sm shrink-0">
                  {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {loading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
            </div>
            {swotGenerated && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 fade-up">
                {[
                  { key: 'strengths', label: 'Strengths', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
                  { key: 'weaknesses', label: 'Weaknesses', color: '#f43f5e', bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.2)' },
                  { key: 'opportunities', label: 'Opportunities', color: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)' },
                  { key: 'threats', label: 'Threats', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
                ].map(s => (
                  <div key={s.key} className="p-5 rounded-2xl" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                    <h3 className="text-base font-bold mb-3" style={{ color: s.color }}>{s.label}</h3>
                    <ul className="space-y-2">
                      {swotMock[s.key as keyof typeof swotMock].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span style={{ color: s.color }} className="mt-0.5 shrink-0">✓</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Bot size={18} className="text-indigo-400" />
                <h3 className="font-semibold text-white">Input Prompt</h3>
              </div>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="glass-input px-4 py-3 text-sm w-full resize-none"
                rows={8}
                placeholder={activeTab === 'proposal' ? 'Describe your project, target client, budget, and objectives...' : 'Describe your business, target market, products/services, and goals...'}
              />
              <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full justify-center">
                {loading ? <><RefreshCw size={15} className="animate-spin" /> Generating...</> : <><Sparkles size={15} /> Generate {tabs.find(t=>t.id===activeTab)?.label}</>}
              </button>
            </div>

            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-violet-400" />
                  <h3 className="font-semibold text-white">AI Output</h3>
                </div>
                {output && (
                  <div className="flex gap-2">
                    <button onClick={copyOutput} className="btn-ghost text-xs py-1.5"><Copy size={13} /> Copy</button>
                    <button className="btn-ghost text-xs py-1.5"><Download size={13} /> Export PDF</button>
                  </div>
                )}
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[72, 88, 64, 96, 78, 70].map((width, i) => <div key={i} className="shimmer h-4 rounded-lg" style={{ width: `${width}%` }} />)}
                </div>
              ) : output ? (
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[400px] pr-2" style={{ fontFamily: 'monospace' }}>
                  {output}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <Bot size={28} className="text-indigo-400" />
                  </div>
                  <p className="text-slate-500 text-sm">Enter a prompt and click Generate to create content with AI</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
