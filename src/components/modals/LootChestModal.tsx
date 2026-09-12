import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Gift, Sparkles, Coins, Award, Check } from 'lucide-react';

export const LootChestModal: React.FC = () => {
  const { activeChestReward, closeChestModal } = useGame();

  if (!activeChestReward) return null;

  const { chest, reward } = activeChestReward;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="relative max-w-md w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#151b2a] via-[#0e1320] to-[#070a12] border-2 border-rpg-gold/80 shadow-glow-gold text-center overflow-hidden"
        >
          {/* Radiant background halo */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-b from-amber-500/25 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Animated Chest Icon */}
          <motion.div
            initial={{ scale: 0.6, rotate: -10 }}
            animate={{ scale: [0.6, 1.15, 1], rotate: [0, -8, 8, 0] }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-amber-600 via-rpg-gold to-yellow-300 p-1 shadow-glow-gold flex items-center justify-center"
          >
            <div className="w-full h-full bg-slate-950 rounded-3xl flex items-center justify-center text-5xl">
              🎁
            </div>
          </motion.div>

          {/* Chest Name & Header */}
          <span className="text-[11px] font-mono-rpg font-bold tracking-widest text-rpg-gold uppercase block mb-1">
            ✨ Mythic Treasury Unlocked ✨
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-rpg text-slate-100 mb-2">
            {chest.name}
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Your persistence has yielded ancient guild treasures and legendary bounties.
          </p>

          {/* Revealed Rewards List */}
          <div className="space-y-2.5 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300"
            >
              <span className="flex items-center gap-2 text-xs font-bold font-rpg">
                <Coins className="w-4 h-4 text-rpg-gold" />
                Guild Treasury Gold:
              </span>
              <span className="font-mono-rpg font-black text-sm text-rpg-gold">
                +{reward.gold.toLocaleString()} Gold
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-300"
            >
              <span className="flex items-center gap-2 text-xs font-bold font-rpg">
                <Sparkles className="w-4 h-4 text-sky-400" />
                Character Experience:
              </span>
              <span className="font-mono-rpg font-black text-sm text-sky-400">
                +{reward.xp} XP
              </span>
            </motion.div>

            {reward.title && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-300"
              >
                <span className="flex items-center gap-2 text-xs font-bold font-rpg">
                  <Award className="w-4 h-4 text-purple-400" />
                  Equipped Title:
                </span>
                <span className="font-mono-rpg font-bold text-xs text-purple-200">
                  {reward.title}
                </span>
              </motion.div>
            )}

            {reward.badge && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
              >
                <span className="flex items-center gap-2 text-xs font-bold font-rpg">
                  <Award className="w-4 h-4 text-emerald-400" />
                  Insignia Badge:
                </span>
                <span className="font-mono-rpg font-bold text-xs text-emerald-200">
                  {reward.badge}
                </span>
              </motion.div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={closeChestModal}
            className="w-full py-3 rounded-xl rpg-button-gold text-xs font-black uppercase tracking-wider shadow-glow-gold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Claim Loot & Continue</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
