import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Sparkles, Coins, Zap, Swords, Check } from 'lucide-react';

export const QuestCompleteOverlay: React.FC = () => {
  const { recentlyCompletedQuest, clearRecentlyCompletedQuest } = useGame();

  useEffect(() => {
    if (!recentlyCompletedQuest) return;
    const timer = setTimeout(() => {
      clearRecentlyCompletedQuest();
    }, 2800);
    return () => clearTimeout(timer);
  }, [recentlyCompletedQuest, clearRecentlyCompletedQuest]);

  if (!recentlyCompletedQuest) return null;

  return (
    <AnimatePresence>
      <div
        onClick={clearRecentlyCompletedQuest}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative max-w-sm sm:max-w-md w-full p-6 rounded-3xl bg-gradient-to-b from-[#161c2d] to-[#0a0e18] border-2 border-amber-500/80 shadow-glow-gold text-center overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Ambient Glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -25 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-600 via-rpg-gold to-yellow-300 p-0.5 shadow-glow-gold flex items-center justify-center"
          >
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-rpg-gold">
              <Swords className="w-7 h-7" />
            </div>
          </motion.div>

          <span className="text-[10px] font-mono-rpg font-extrabold tracking-widest text-rpg-gold uppercase block mb-0.5">
            ✨ Victory Achieved ✨
          </span>
          <h2 className="text-2xl font-black font-rpg text-slate-100 mb-1">
            QUEST COMPLETE!
          </h2>
          <p className="text-xs font-semibold text-slate-300 mb-4 px-2 font-rpg truncate">
            ⚔ {recentlyCompletedQuest.title}
          </p>

          {/* Reward Badges */}
          <div className="flex items-center justify-center gap-2 mb-5 font-mono-rpg flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-rpg-gold" />
              +{recentlyCompletedQuest.xpReward} XP
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/15 border border-sky-500/40 text-sky-300 text-xs font-bold shadow-sm">
              <Coins className="w-3.5 h-3.5 text-sky-400" />
              +{recentlyCompletedQuest.goldReward} Gold
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-sm">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              +{recentlyCompletedQuest.attributeReward} {recentlyCompletedQuest.attributeType.slice(0, 4).toUpperCase()}
            </span>
          </div>

          {/* Dismiss button */}
          <button
            onClick={clearRecentlyCompletedQuest}
            className="w-full py-2.5 rounded-xl rpg-button-gold text-xs font-black uppercase tracking-wider shadow-glow-gold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Continue (Tap anywhere)</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
