import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Coins, Zap, Calendar, Tag, AlertCircle } from 'lucide-react';
import { QuestCategory, QuestDifficulty, AttributeType } from '../../types';
import { useGame } from '../../context/GameContext';

interface CreateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: QuestCategory[] = ['Coding', 'Study', 'Fitness', 'Reading', 'Personal', 'Health'];
const DIFFICULTIES: QuestDifficulty[] = ['Easy', 'Medium', 'Hard', 'Epic', 'Legendary'];
const ATTRIBUTES: AttributeType[] = ['Strength', 'Intellect', 'Discipline', 'Creativity', 'Health', 'Focus'];

// Recommended rewards per difficulty
const DIFFICULTY_DEFAULTS: Record<QuestDifficulty, { xp: number; gold: number; attr: number }> = {
  Easy: { xp: 50, gold: 15, attr: 2 },
  Medium: { xp: 100, gold: 30, attr: 4 },
  Hard: { xp: 150, gold: 50, attr: 6 },
  Epic: { xp: 300, gold: 100, attr: 10 },
  Legendary: { xp: 500, gold: 200, attr: 15 }
};

export const CreateQuestModal: React.FC<CreateQuestModalProps> = ({ isOpen, onClose }) => {
  const { createQuest } = useGame();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<QuestCategory>('Coding');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('Medium');
  const [attributeType, setAttributeType] = useState<AttributeType>('Intellect');
  const [xpReward, setXpReward] = useState<number>(100);
  const [goldReward, setGoldReward] = useState<number>(30);
  const [deadline, setDeadline] = useState('Today, 23:59');
  const [isDaily, setIsDaily] = useState(true);
  const [error, setError] = useState('');

  // When difficulty changes, automatically adjust recommended rewards
  const handleDifficultyChange = (newDiff: QuestDifficulty) => {
    setDifficulty(newDiff);
    const defaults = DIFFICULTY_DEFAULTS[newDiff];
    setXpReward(defaults.xp);
    setGoldReward(defaults.gold);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a quest title.');
      return;
    }
    if (!Number.isFinite(xpReward) || xpReward < 10 || xpReward > 1000) {
      setError('XP reward must be between 10 and 1,000.');
      return;
    }
    if (!Number.isFinite(goldReward) || goldReward < 5 || goldReward > 500) {
      setError('Gold reward must be between 5 and 500.');
      return;
    }

    createQuest({
      title: title.trim(),
      description: description.trim() || 'Heroic task to conquer and level up your discipline.',
      category,
      difficulty,
      xpReward,
      goldReward,
      attributeType,
      attributeReward: DIFFICULTY_DEFAULTS[difficulty].attr,
      isDaily,
      isWeekly: !isDaily,
      deadline: deadline.trim() || 'Today, 23:59'
    });

    // Reset and close
    setTitle('');
    setDescription('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative max-w-lg w-full rounded-2xl bg-rpg-card border border-slate-700 shadow-2xl p-6 sm:p-8 my-8 text-left"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rpg-gold/10 border border-rpg-gold/30 text-rpg-gold flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-rpg text-slate-100">Forge New Quest</h3>
                <p className="text-xs text-slate-400">Add a real-life mission to your quest log</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rpg-crimson/10 border border-rpg-crimson/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Quest Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Master Binary Trees / 5km Morning Run"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-rpg-cyan focus:outline-none text-slate-100 text-sm placeholder:text-slate-500 transition-colors"
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Description / Objective
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Detail what constitutes successful completion of this quest..."
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-rpg-cyan focus:outline-none text-slate-100 text-sm placeholder:text-slate-500 transition-colors resize-none"
              />
            </div>

            {/* Category & Attribute */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-rpg-cyan" /> Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as QuestCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-rpg-cyan focus:outline-none text-slate-100 text-sm"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-purple-400" /> Buff Attribute
                </label>
                <select
                  value={attributeType}
                  onChange={e => setAttributeType(e.target.value as AttributeType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-rpg-cyan focus:outline-none text-slate-100 text-sm"
                >
                  {ATTRIBUTES.map(a => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Difficulty Pills */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Difficulty
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DIFFICULTIES.map(d => {
                  const isSelected = difficulty === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleDifficultyChange(d)}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-rpg-cyan/20 border-rpg-cyan text-rpg-cyan shadow-glow-cyan'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rewards */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div>
                <label className="text-xs font-semibold text-rpg-gold flex items-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> XP Reward
                </label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={xpReward}
                  onChange={e => setXpReward(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono-rpg text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-sky-400 flex items-center gap-1 mb-1">
                  <Coins className="w-3.5 h-3.5" /> Gold Reward
                </label>
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={goldReward}
                  onChange={e => setGoldReward(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono-rpg text-sm"
                />
              </div>
            </div>

            {/* Deadline & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Deadline
                </label>
                <input
                  type="text"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  placeholder="e.g. Today, 22:00"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:border-rpg-cyan focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="dailyCheck"
                  checked={isDaily}
                  onChange={e => setIsDaily(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-rpg-cyan focus:ring-rpg-cyan cursor-pointer"
                />
                <label htmlFor="dailyCheck" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Mark as Daily Quest
                </label>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl rpg-button-gold text-xs font-extrabold uppercase tracking-wider shadow-glow-gold"
              >
                Forge Quest
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
