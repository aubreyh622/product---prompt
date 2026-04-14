import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';

export default function Signup() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          confirmPassword,
        }),
      });
      const data = await response.json();
      if (data.success && data.data?.token) {
        login(data.data.token);
        navigate('/', { replace: true });
      } else {
        const msg = data.message || (data.errors?.[0]?.message) || 'Signup failed. Please try again.';
        setError(msg);
      }
    } catch {
      setError('Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <span className="text-[#7A90A8] text-xs ml-2 tracking-widest uppercase">Delivery Copilot</span>
          </div>
        </div>

        <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-8">
          <h1 className="text-2xl font-bold text-[#E8EDF5] mb-1" style={{ fontFamily: 'Georgia, serif' }}>Create Account</h1>
          <p className="text-sm text-[#7A90A8] mb-6">Register for CGS Delivery Copilot access.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#E8EDF5] mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aubrey Huang"
                autoComplete="name"
                className="w-full bg-[#0D1B2E] border border-[#1F3550] rounded-lg px-4 py-3 text-[#E8EDF5] placeholder-[#7A90A8] text-sm focus:outline-none focus:border-[#D4A843]/60 focus:ring-1 focus:ring-[#D4A843]/30 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#E8EDF5] mb-2">Corporate Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@cgsadvisors.com"
                autoComplete="email"
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
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
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
            <div>
              <label className="block text-sm font-medium text-[#E8EDF5] mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className="w-full bg-[#0D1B2E] border border-[#1F3550] rounded-lg px-4 py-3 pr-10 text-[#E8EDF5] placeholder-[#7A90A8] text-sm focus:outline-none focus:border-[#D4A843]/60 focus:ring-1 focus:ring-[#D4A843]/30 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A90A8] hover:text-[#E8EDF5]"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#D4A843] text-[#0D1B2E] font-semibold text-sm rounded-lg hover:bg-[#c49a3a] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-[#0D1B2E] border-t-transparent rounded-full" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#1F3550] text-center">
            <p className="text-sm text-[#7A90A8]">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-[#D4A843] hover:text-[#c49a3a] font-medium transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Sign in
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-[#7A90A8] mt-6">
          CGS Delivery Copilot · Internal Use Only · CGS Advisors © 2026
        </p>
      </div>
    </div>
  );
}
