import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Quest } from '../../types';
import { useGame } from '../../context/GameContext';
import { Sparkles, Coins, CheckCircle2, Clock, Trash2, Zap } from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  compact?: boolean;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Medium: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  Hard: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Epic: 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-glow-purple',
  Legendary: 'bg-gradient-to-r from-amber-500/25 via-rose-500/25 to-amber-500/25 text-amber-300 border-amber-400/80 shadow-glow-gold font-black'
};

const CATEGORY_ICONS: Record<string, string> = {
  Coding: '⚔️',
  Study: '💻',
  Fitness: '🏋️',
  Reading: '📚',
  Personal: '🧘',
  Health: '🍎'
};

export const QuestCard: React.FC<QuestCardProps> = ({ quest, compact = false }) => {
  const { completeQuest, deleteQuest } = useGame();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = () => {
    if (quest.completed || isCompleting) return;
    setIsCompleting(true);
    completeQuest(quest.id);
    setTimeout(() => {
      setIsCompleting(false);
    }, 600);
  };

  const categoryEmoji = CATEGORY_ICONS[quest.category] || '🎯';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: quest.completed ? 0 : -3 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
        quest.completed
          ? 'bg-slate-900/40 border-slate-800/60 opacity-65'
          : 'glass-panel border-slate-700/60 hover:border-slate-600 shadow-lg hover:shadow-glow-cyan'
      } ${compact ? 'p-4' : 'p-5'}`}
    >
      {/* Top row: Category & Difficulty badges */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-base">{categoryEmoji}</span>
          <span className="text-xs font-semibold text-slate-300 tracking-wide">
            {quest.category}
          </span>
          {quest.isWeekly && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30 uppercase">
              Weekly Epic
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${
              DIFFICULTY_STYLES[quest.difficulty] || DIFFICULTY_STYLES.Medium
            }`}
          >
            {quest.difficulty}
          </span>

          {/* Delete action */}
          <button
            onClick={() => deleteQuest(quest.id)}
            className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100"
            title="Abandon Quest"
            aria-label="Abandon Quest"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quest Title & Description */}
      <h3
        className={`text-base font-bold font-rpg mb-1.5 transition-colors ${
          quest.completed ? 'line-through text-slate-400' : 'text-slate-100'
        }`}
      >
        {quest.title}
      </h3>

      {!compact && (
        <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {quest.description}
        </p>
      )}

      {/* Rewards Row */}
      <div className="flex flex-wrap items-center gap-2 py-2 mb-3 border-t border-b border-slate-800/80 font-mono-rpg text-xs">
        <span className="inline-flex items-center gap-1 text-rpg-gold font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" /> +{quest.xpReward} XP
        </span>
        <span className="inline-flex items-center gap-1 text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
          <Coins className="w-3.5 h-3.5" /> +{quest.goldReward} Gold
        </span>
        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 text-[11px]">
          <Zap className="w-3 h-3" /> +{quest.attributeReward} {quest.attributeType.slice(0, 4).toUpperCase()}
        </span>
      </div>

      {/* Bottom Footer: Deadline & Complete Action */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{quest.deadline || 'Today'}</span>
        </div>

        {quest.completed ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-600/40 text-emerald-400 text-xs font-bold font-rpg">
            <CheckCircle2 className="w-4 h-4" />
            <span>Completed</span>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            disabled={isCompleting}
            className="px-4 py-2 rounded-xl rpg-button-gold text-xs font-extrabold uppercase tracking-wider shadow-glow-gold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isCompleting ? 'Claiming...' : 'Complete Quest'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
