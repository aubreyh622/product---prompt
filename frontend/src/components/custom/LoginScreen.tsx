import { useState } from 'react';
import type { User } from '@shared/types/api';
import { Eye, EyeOff, LogIn } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const DEMO_USERS: User[] = [
  { id: '1', name: 'Aubrey Huang', email: 'aubrey@cgsadvisors.com', role: 'consultant', title: 'Senior Consultant', practiceArea: 'Digital Transformation', industryFocus: 'Industrial Manufacturing', profileComplete: true, createdAt: '2026-01-01' },
  { id: '2', name: 'Marcus Chen', email: 'marcus@cgsadvisors.com', role: 'senior_reviewer', title: 'Principal', practiceArea: 'Strategy', industryFocus: 'Financial Services', profileComplete: true, createdAt: '2026-01-01' },
  { id: '3', name: 'Priya Nair', email: 'priya@cgsadvisors.com', role: 'knowledge_manager', title: 'Knowledge Manager', practiceArea: 'Knowledge Management', industryFocus: 'Cross-industry', profileComplete: true, createdAt: '2026-01-01' },
  { id: '4', name: 'James Okafor', email: 'james@cgsadvisors.com', role: 'admin', title: 'Platform Admin', practiceArea: 'Operations', industryFocus: 'Enterprise', profileComplete: true, createdAt: '2026-01-01' },
];

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = DEMO_USERS.find((u) => u.email === email);
      if (user && password === 'cgs2026') {
        onLogin(user);
      } else {
        setError('Invalid credentials. Use a CGS email and password: cgs2026');
      }
      setLoading(false);
    }, 800);
  }

  function quickLogin(user: User) {
    setLoading(true);
    setTimeout(() => {
      onLogin(user);
      setLoading(false);
    }, 400);
  }

  return (
    <div className="min-h-screen bg-[#0D1B2E] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 bg-[#D4A843] rounded-sm flex items-center justify-center">
            <span className="text-[#0D1B2E] font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>C</span>
          </div>
          <div>
            <span className="font-bold text-[#E8EDF5] text-xl" style={{ fontFamily: 'Georgia, serif' }}>CGS</span>
            <span className="text-[#7A90A8] text-sm ml-2 tracking-widest uppercase text-xs">Delivery Copilot</span>
          </div>
        </div>

        <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-8">
          <h1 className="text-2xl font-bold text-[#E8EDF5] mb-1" style={{ fontFamily: 'Georgia, serif' }}>Sign In</h1>
          <p className="text-sm text-[#7A90A8] mb-6">Access restricted to verified CGS Advisors staff.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#E8EDF5] mb-2">Corporate Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@cgsadvisors.com"
                className="w-full bg-[#0D1B2E] border border-[#1F3550] rounded-lg px-4 py-3 text-[#E8EDF5] placeholder-[#7A90A8] text-sm focus:outline-none focus:border-[#D4A843]/60 focus:ring-1 focus:ring-[#D4A843]/30 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#E8EDF5] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#0D1B2E] border border-[#1F3550] rounded-lg px-4 py-3 pr-10 text-[#E8EDF5] placeholder-[#7A90A8] text-sm focus:outline-none focus:border-[#D4A843]/60 focus:ring-1 focus:ring-[#D4A843]/30 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A90A8] hover:text-[#E8EDF5]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-xs text-[#E05252]">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#D4A843] text-[#0D1B2E] font-semibold text-sm rounded-lg hover:bg-[#c49a3a] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <span className="animate-spin w-4 h-4 border-2 border-[#0D1B2E] border-t-transparent rounded-full" /> : <LogIn className="w-4 h-4" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Login */}
          <div className="mt-6 pt-6 border-t border-[#1F3550]">
            <p className="text-xs text-[#7A90A8] mb-3 uppercase tracking-widest font-semibold">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => quickLogin(user)}
                  disabled={loading}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-[#1F3550] hover:border-[#D4A843]/40 hover:bg-[#1F3550]/30 transition-all duration-200 text-left disabled:opacity-60"
                >
                  <div className="w-7 h-7 rounded-full bg-[#2D5282] flex items-center justify-center text-xs font-bold text-[#D4A843] flex-shrink-0">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#E8EDF5] truncate">{user.name}</p>
                    <p className="text-xs text-[#7A90A8] capitalize">{user.role.replace('_', ' ')}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#7A90A8] mt-6">CGS Delivery Copilot · Internal Use Only · CGS Advisors © 2026</p>
      </div>
    </div>
  );
}
