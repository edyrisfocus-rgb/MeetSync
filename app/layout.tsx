import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'MeetSync', template: '%s | MeetSync' },
  description: 'Enterprise-grade SaaS platform for team collaboration, document management, and AI-powered business tools.',
  keywords: ['meetsync', 'enterprise', 'saas', 'dashboard', 'collaboration'],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'MeetSync — Enterprise Platform',
    description: 'Multi-tenant enterprise dashboard with AI, document management, and advanced analytics.',
    siteName: 'MeetSync',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased bg-[#0a0a0f] text-slate-200 min-h-screen">
        {/* Ambient background blobs */}
        <div className="blob" style={{ width: 600, height: 600, background: '#6366f1', top: -200, left: -200 }} />
        <div className="blob" style={{ width: 400, height: 400, background: '#8b5cf6', bottom: -100, right: -100 }} />
        <div className="blob" style={{ width: 300, height: 300, background: '#06b6d4', top: '40%', left: '60%' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a28',
              color: '#e2e8f0',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#0a0a0f' } },
            error: { iconTheme: { primary: '#f43f5e', secondary: '#0a0a0f' } },
          }}
        />
      </body>
    </html>
  );
}
