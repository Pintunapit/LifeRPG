import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Crown, Sparkles, ArrowDown, ArrowRight, Coins, Award, Check } from 'lucide-react';

export const LevelUpModal: React.FC = () => {
  const { levelUpModalData, closeLevelUpModal, player } = useGame();

  if (!levelUpModalData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative max-w-md w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#182032] via-[#0d121e] to-[#080b12] border-2 border-rpg-gold/80 shadow-glow-gold text-center overflow-hidden"
        >
          {/* Ambient background rays */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Crown badge */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-600 via-rpg-gold to-yellow-300 p-1 shadow-glow-gold flex items-center justify-center"
          >
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Crown className="w-10 h-10 text-rpg-gold animate-bounce" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-[11px] font-mono-rpg font-extrabold tracking-widest text-rpg-gold uppercase inline-block mb-1">
              ✨ Heroic Ascendance ✨
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-rpg text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rpg-gold to-yellow-400 mb-4">
              LEVEL UP!
            </h2>
          </motion.div>

          {/* Level Transition Pill (12 ↓ 13) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-6 py-4 px-6 rounded-2xl bg-slate-900/90 border border-slate-700/80 mb-6 font-mono-rpg"
          >
            <div className="text-slate-400 text-center">
              <span className="text-[10px] block text-slate-500 uppercase tracking-wider font-semibold">PREVIOUS</span>
              <span className="text-2xl font-bold text-slate-300">{levelUpModalData.oldLevel}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-rpg-gold">
              <span className="text-xs font-bold text-rpg-gold">✨</span>
              <ArrowDown className="w-6 h-6 text-rpg-gold animate-pulse" />
            </div>
            <div className="text-rpg-gold text-center">
              <span className="text-[10px] block text-amber-400 font-bold uppercase tracking-wider">NEW POWER</span>
              <span className="text-3xl font-black text-amber-300">
                {levelUpModalData.newLevel}
              </span>
            </div>
          </motion.div>

          {/* Reward Perks */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2.5 mb-6 text-left"
          >
            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-200 font-bold text-xs">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Attribute Points Unlocked:
              </span>
              <span className="font-mono-rpg text-sm font-black text-purple-300">
                +{levelUpModalData.attributePointsEarned} POINTS
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 font-bold text-xs">
              <span className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-rpg-gold" />
                Treasury Bounty:
              </span>
              <span className="font-mono-rpg text-sm font-black text-rpg-gold">
                +{levelUpModalData.goldEarned} GOLD
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-sky-500/15 border border-sky-500/40 text-sky-200 font-bold text-xs">
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-sky-400" />
                Title Progression:
              </span>
              <span className="font-mono-rpg text-xs font-bold text-sky-300">
                {player.title}
              </span>
            </div>
          </motion.div>

          <p className="text-xs text-slate-400 italic mb-6">
            &quot;Your discipline elevates you above mortal mediocrity. Continue your quest...&quot;
          </p>

          {/* Continue button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={closeLevelUpModal}
            className="w-full py-3.5 rounded-xl rpg-button-gold text-xs font-black uppercase tracking-wider shadow-glow-gold flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
