'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Building2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const devRoles = ['super_admin', 'admin', 'staff', 'member', 'viewer'];
const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  staff: 'Staff',
  member: 'Member',
  viewer: 'Viewer',
};

export default function LoginPage() {
  const [devMode, setDevMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [loading, setLoading] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading('google');
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleDevLogin = async () => {
    setLoading('dev');
    const res = await signIn('dev-credentials', {
      email: `dev-${selectedRole}@meetsync.local`,
      role: selectedRole,
      callbackUrl: '/dashboard',
      redirect: false,
    });
    if (res?.error) {
      toast.error('Dev login failed. Make sure NODE_ENV=development.');
      setLoading(null);
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
            <Building2 size={28} color="white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">MeetSync</h1>
          <p className="text-slate-500 mt-2 text-sm">Enterprise Platform — Sign in to continue</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-6">Sign in to your account to access your workspace</p>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-semibold text-sm transition-all"
            style={{ background: 'white', color: '#1a1a1a', border: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.92')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <span className="text-base font-bold">G</span>
            {loading === 'google' ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-xs text-slate-600">or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Dev Mode Toggle */}
          {process.env.NODE_ENV === 'development' || true ? (
            <div>
              <button
                onClick={() => setDevMode(!devMode)}
                className="w-full text-sm text-slate-500 hover:text-indigo-400 transition-colors flex items-center justify-center gap-2"
              >
                🛠 Dev Mode Login
                <ArrowRight size={14} style={{ transform: devMode ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {devMode && (
                <div className="mt-4 p-4 rounded-xl space-y-3 fade-up" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Development Mode</p>
                  <p className="text-xs text-slate-500">Select any role to login instantly without OAuth</p>
                  <div className="grid grid-cols-1 gap-2">
                    {devRoles.map(role => (
                      <button
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${selectedRole === role ? 'text-indigo-300' : 'text-slate-400 hover:text-slate-200'}`}
                        style={selectedRole === role ? { background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        {roleLabels[role]}
                        {role === 'super_admin' && <span className="ml-2 text-xs text-rose-400">Full Access</span>}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleDevLogin}
                    disabled={loading !== null}
                    className="btn-primary w-full justify-center mt-2"
                  >
                    {loading === 'dev' ? 'Signing in...' : `Login as ${roleLabels[selectedRole]}`}
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          By signing in, you agree to MeetSync&apos;s{' '}
          <a href="#" className="text-indigo-400 hover:underline">Terms of Service</a> and{' '}
          <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
