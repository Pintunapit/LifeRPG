import React from 'react';
import { motion } from 'framer-motion';
import { Achievement } from '../../types';
import { Lock, Sparkles, Coins, CheckCircle2 } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const percentage = Math.min(
    100,
    Math.round((achievement.currentProgress / achievement.maxProgress) * 100)
  );

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
        achievement.unlocked
          ? 'glass-panel-glow border-amber-500/40 shadow-glow-gold'
          : 'bg-slate-900/40 border-slate-800 text-slate-400 opacity-80'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${
                achievement.unlocked
                  ? 'bg-gradient-to-tr from-amber-600/30 to-yellow-400/20 border-rpg-gold/60 shadow-glow-gold'
                  : 'bg-slate-950 border-slate-800 grayscale'
              }`}
            >
              {achievement.unlocked ? (
                achievement.icon
              ) : (
                <Lock className="w-5 h-5 text-slate-600" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-mono-rpg uppercase tracking-widest text-slate-400 font-bold block">
                {achievement.category}
              </span>
              <h4
                className={`text-base font-bold font-rpg leading-tight ${
                  achievement.unlocked ? 'text-slate-100' : 'text-slate-300'
                }`}
              >
                {achievement.title}
              </h4>
            </div>
          </div>

          {achievement.unlocked && (
            <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold font-rpg bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-600/40">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Unlocked
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          {achievement.description}
        </p>
      </div>

      <div>
        {/* Progress bar */}
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-xs font-mono-rpg text-slate-400">
            <span>Progress</span>
            <span className={achievement.unlocked ? 'text-rpg-gold font-bold' : 'text-slate-400'}>
              {achievement.currentProgress} / {achievement.maxProgress} ({percentage}%)
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <motion.div
              className={`h-full rounded-full ${
                achievement.unlocked
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-glow-gold'
                  : 'bg-slate-700'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Rewards pill */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] font-mono-rpg">
          <span className="text-slate-500">Reward:</span>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> +{achievement.rewardXp} XP
            </span>
            <span className="text-sky-400 flex items-center gap-1">
              <Coins className="w-3 h-3" /> +{achievement.rewardGold} Gold
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
