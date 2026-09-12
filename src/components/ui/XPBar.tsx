import React from 'react';
import { motion } from 'framer-motion';
import { getRequiredXP, getLevelProgressPercentage } from '../../utils/xpSystem';
import { Sparkles } from 'lucide-react';

interface XPBarProps {
  currentXP: number;
  level: number;
  showLabels?: boolean;
  compact?: boolean;
  className?: string;
}

export const XPBar: React.FC<XPBarProps> = ({
  currentXP,
  level,
  showLabels = true,
  compact = false,
  className = ''
}) => {
  const reqXP = getRequiredXP(level);
  const percentage = getLevelProgressPercentage(currentXP, level);

  return (
    <div className={`w-full ${className}`}>
      {showLabels && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-mono-rpg">
          <span className="text-rpg-gold font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-rpg-gold animate-spin" style={{ animationDuration: '6s' }} />
            LEVEL {level}
          </span>
          <span className="text-slate-300">
            <span className="text-rpg-gold font-bold">{currentXP.toLocaleString()}</span> /{' '}
            {reqXP.toLocaleString()} XP{' '}
            <span className="text-slate-400 text-[11px]">({percentage}%)</span>
          </span>
        </div>
      )}

      <div
        className={`w-full bg-slate-900/90 rounded-full border border-slate-700/60 overflow-hidden relative ${
          compact ? 'h-2.5' : 'h-3.5 sm:h-4'
        }`}
      >
        {/* Animated bar */}
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 via-rpg-gold to-yellow-300 rounded-full relative shadow-glow-gold"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Shimmer light effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
};
