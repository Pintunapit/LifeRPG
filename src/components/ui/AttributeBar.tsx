import React from 'react';
import { motion } from 'framer-motion';
import { AttributeType } from '../../types';
import { Dumbbell, Brain, Shield, Sparkles, Heart, Crosshair, Plus } from 'lucide-react';

interface AttributeBarProps {
  name: AttributeType;
  value: number;
  max?: number;
  canUpgrade?: boolean;
  onUpgrade?: () => void;
}

const ATTRIBUTE_CONFIG: Record<
  AttributeType,
  { icon: React.FC<{ className?: string }>; color: string; barGradient: string; textClass: string }
> = {
  Strength: {
    icon: Dumbbell,
    color: '#ef4444',
    barGradient: 'from-red-600 to-rose-400',
    textClass: 'text-rose-400'
  },
  Intellect: {
    icon: Brain,
    color: '#06b6d4',
    barGradient: 'from-cyan-600 to-blue-400',
    textClass: 'text-cyan-400'
  },
  Discipline: {
    icon: Shield,
    color: '#8b5cf6',
    barGradient: 'from-violet-600 to-purple-400',
    textClass: 'text-purple-400'
  },
  Creativity: {
    icon: Sparkles,
    color: '#ec4899',
    barGradient: 'from-pink-600 to-fuchsia-400',
    textClass: 'text-pink-400'
  },
  Health: {
    icon: Heart,
    color: '#10b981',
    barGradient: 'from-emerald-600 to-teal-400',
    textClass: 'text-emerald-400'
  },
  Focus: {
    icon: Crosshair,
    color: '#fbbf24',
    barGradient: 'from-amber-600 to-yellow-400',
    textClass: 'text-amber-400'
  }
};

export const AttributeBar: React.FC<AttributeBarProps> = ({
  name,
  value,
  max = 100,
  canUpgrade = false,
  onUpgrade
}) => {
  const config = ATTRIBUTE_CONFIG[name] || ATTRIBUTE_CONFIG.Strength;
  const Icon = config.icon;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="p-3.5 sm:p-4 rounded-xl glass-panel border border-slate-800 hover:border-slate-700/80 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900 border border-slate-800"
            style={{ color: config.color }}
          >
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm text-slate-200 tracking-wide font-rpg">
            {name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className={`font-mono-rpg font-bold text-sm ${config.textClass}`}>
            {value} <span className="text-slate-500 text-xs font-normal">/ {max}</span>
          </span>
          {canUpgrade && value < max && (
            <button
              onClick={onUpgrade}
              className="w-7 h-7 rounded-lg bg-rpg-gold/20 hover:bg-rpg-gold border border-rpg-gold/50 text-rpg-gold hover:text-rpg-dark flex items-center justify-center transition-all duration-200 shadow-glow-gold"
              title={`Allocate 1 point to ${name}`}
              aria-label={`Allocate 1 point to ${name}`}
            >
              <Plus className="w-4 h-4 font-bold" />
            </button>
          )}
        </div>
      </div>

      <div className="w-full bg-slate-900/90 rounded-full h-2.5 overflow-hidden border border-slate-800/80 relative">
        <motion.div
          className={`h-full bg-gradient-to-r ${config.barGradient} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
