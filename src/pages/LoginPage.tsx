import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swords, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { soundFx } from '../utils/soundEffects';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setIsLoading(true);
    try {
      await authService.login(email, password);
      soundFx.playButtonClick();
      showToast('Welcome back to the realm, Warrior!', 'success', 'Login Successful');
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    if (isLoading) return;
    setError('');
    setIsLoading(true);
    try {
      await authService.login('alex.warrior@liferpg.io', 'demopassword123');
      soundFx.playButtonClick();
      showToast('Logged in as Warrior Alex!', 'success');
      navigate('/dashboard');
    } catch {
      showToast('Demo account not set up yet. Create it in Supabase first.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    showToast('Google OAuth not configured yet.', 'info');
  };

  return (
    <div className="min-h-screen bg-rpg-dark text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rpg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rpg-cyan/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full glass-panel border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-rpg-gold to-yellow-300 p-0.5 shadow-glow-gold">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <Swords className="w-6 h-6 text-rpg-gold group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </Link>
          <h2 className="text-2xl font-black font-rpg text-slate-100">
            Enter the Realm
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Authenticate your character credentials
          </p>
        </div>

        {/* Demo Fast Login Pill */}
        <button
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-amber-500/20 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-rpg-gold" />
          <span>Instant 1-Click Demo Login (Alex Lvl 12)</span>
        </button>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rpg-crimson/10 border border-rpg-crimson/30 text-rose-300 text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Character Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-rpg-gold focus:outline-none text-slate-100 text-sm font-mono-rpg transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> Secret Cipher
              </label>
              <button
                type="button"
                onClick={() => showToast('Demo password is pre-filled. Click Login!', 'info')}
                className="text-[11px] text-rpg-cyan hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-rpg-gold focus:outline-none text-slate-100 text-sm font-mono-rpg transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl rpg-button-gold text-sm font-extrabold uppercase tracking-wider shadow-glow-gold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isLoading ? 'Entering...' : 'Login to Game'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-slate-800 flex-1" />
          <span className="text-[11px] text-slate-500 uppercase font-mono-rpg">or</span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {/* Google Auth UI */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google UI</span>
        </button>

        {/* Signup Link */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Do not have a warrior profile yet?{' '}
          <Link to="/signup" className="text-rpg-gold font-bold hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};
