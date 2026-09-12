import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';

export const FloatingFloater: React.FC = () => {
  const { floatingRewards } = useGame();

  return (
    <div className="fixed top-24 right-8 z-50 flex flex-col gap-2 pointer-events-none items-end">
      <AnimatePresence>
        {floatingRewards.map((reward, index) => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: - index * 6, scale: 1.15 }}
            exit={{ opacity: 0, y: -45, scale: 0.9, transition: { duration: 0.3 } }}
            className="px-3.5 py-1.5 rounded-full font-mono-rpg font-extrabold text-sm shadow-xl border border-white/20 backdrop-blur-md bg-rpg-card/90"
            style={{ color: reward.color, textShadow: `0 0 12px ${reward.color}` }}
          >
            {reward.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
