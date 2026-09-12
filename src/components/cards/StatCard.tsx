import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  variant?: 'gold' | 'cyan' | 'purple' | 'emerald' | 'crimson';
}

const BORDER_VARIANTS = {
  gold: 'border-amber-500/30 hover:border-amber-500/60 shadow-glow-gold',
  cyan: 'border-cyan-500/30 hover:border-cyan-500/60 shadow-glow-cyan',
  purple: 'border-purple-500/30 hover:border-purple-500/60 shadow-glow-purple',
  emerald: 'border-emerald-500/30 hover:border-emerald-500/60 shadow-glow-emerald',
  crimson: 'border-rose-500/30 hover:border-rose-500/60 shadow-glow-crimson'
};

const TEXT_VARIANTS = {
  gold: 'text-amber-400',
  cyan: 'text-cyan-400',
  purple: 'text-purple-400',
  emerald: 'text-emerald-400',
  crimson: 'text-rose-400'
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon,
  variant = 'cyan'
}) => {
  return (
    <div
      className={`p-5 rounded-2xl glass-panel border transition-all duration-300 ${BORDER_VARIANTS[variant]}`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-rpg">
          {title}
        </span>
        <div className={`p-2 rounded-xl bg-slate-900/90 border border-slate-800 ${TEXT_VARIANTS[variant]}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-black font-mono-rpg text-slate-100">
          {value}
        </span>
      </div>

      {subtext && (
        <p className="text-xs text-slate-400 mt-1 font-medium">
          {subtext}
        </p>
      )}
    </div>
  );
};
