import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swords, Lock, Mail, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { soundFx } from '../utils/soundEffects';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(0);

  const navigate = useNavigate();
  const { showToast } = useToast();

  // Auto-retry after countdown when backend is waking up
  const startWakeupRetry = React.useCallback((retryFn: () => void) => {
    setIsWakingUp(true);
    let count = 25;
    setRetryCountdown(count);
    const interval = setInterval(() => {
      count--;
      setRetryCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setIsWakingUp(false);
        setError('');
        retryFn();
      }
    }, 1000);
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isWakingUp) return;
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all character fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Ciphers do not match. Confirm your password.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await authService.signup(name.trim(), email.trim(), password);
      soundFx.playLevelUp();
      showToast(`Welcome to Life RPG, ${name}! Your character is forged.`, 'success', 'Character Created');
      navigate('/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sign-up failed. Please try again.';
      if (msg.includes('waking up') || msg.includes('cold start')) {
        setError(msg);
        startWakeupRetry(() => {
          const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
          handleSignup(fakeEvent);
        });
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-rpg-dark text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-rpg-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-rpg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full glass-panel border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-rpg-gold to-yellow-300 p-0.5 shadow-glow-gold">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <Swords className="w-6 h-6 text-rpg-gold group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </Link>
          <h2 className="text-2xl font-black font-rpg text-slate-100">
            Create Character
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Forge your hero persona and begin ascending
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rpg-crimson/10 border border-rpg-crimson/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" /> Character Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Roland / Astrid"
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-rpg-gold focus:outline-none text-slate-100 text-sm font-mono-rpg transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Character Email
            </label>
            <input
              type="email"
              required
              placeholder="hero@liferpg.io"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-rpg-gold focus:outline-none text-slate-100 text-sm font-mono-rpg transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" /> Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-rpg-gold focus:outline-none text-slate-100 text-sm font-mono-rpg transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Confirm Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-rpg-gold focus:outline-none text-slate-100 text-sm font-mono-rpg transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || isWakingUp}
            className="w-full py-3 rounded-xl rpg-button-gold text-sm font-extrabold uppercase tracking-wider shadow-glow-gold flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            <span>
              {isWakingUp
                ? `Server waking up… retry in ${retryCountdown}s`
                : isLoading
                  ? 'Forging...'
                  : 'Create Character'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already have a character?{' '}
          <Link to="/login" className="text-rpg-gold font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
