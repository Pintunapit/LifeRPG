import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { AchievementCard } from '../components/cards/AchievementCard';
import { Trophy, Award, Sparkles, Filter } from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const { achievements } = useGame();
  const [filter, setFilter] = useState<'All' | 'Unlocked' | 'Locked'>('All');

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const totalXpEarned = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.rewardXp, 0);

  const filteredAchievements = achievements.filter(a => {
    if (filter === 'Unlocked') return a.unlocked;
    if (filter === 'Locked') return !a.unlocked;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-rpg text-rpg-gold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Trophy Room</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-rpg text-slate-100">
            Heroic Achievements
          </h1>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {(['All', 'Unlocked', 'Locked'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-rpg transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-rpg-gold text-rpg-dark shadow-glow-gold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-amber-500/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-rpg-gold flex items-center justify-center text-xl">
            🏆
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-mono-rpg">Unlocked</span>
            <p className="text-2xl font-black font-mono-rpg text-slate-100">
              {unlockedCount} / {totalCount}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-cyan-500/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-rpg-cyan flex items-center justify-center text-xl">
            ✨
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-mono-rpg">Trophy XP Claimed</span>
            <p className="text-2xl font-black font-mono-rpg text-amber-400">
              +{totalXpEarned.toLocaleString()} XP
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-purple-500/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center text-xl">
            👑
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-mono-rpg">Completion Rate</span>
            <p className="text-2xl font-black font-mono-rpg text-slate-100">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Achievement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(ach => (
          <AchievementCard key={ach.id} achievement={ach} />
        ))}
      </div>
    </div>
  );
};
