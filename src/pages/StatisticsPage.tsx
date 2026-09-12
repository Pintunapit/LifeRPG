import React from 'react';
import { useGame } from '../context/GameContext';
import { StatCard } from '../components/cards/StatCard';
import { getLifetimeXP } from '../utils/xpSystem';
import {
  Swords,
  Sparkles,
  CheckCircle2,
  Flame,
  Coins,
  Trophy,
  TrendingUp,
  Brain,
  Layers,
  Map,
  Scroll,
  Crown
} from 'lucide-react';

export const StatisticsPage: React.FC = () => {
  const { player, quests } = useGame();

  const completedQuests = quests.filter(q => q.completed);
  const completedCount = completedQuests.length;
  const totalCount = quests.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const totalXpEarned = getLifetimeXP(player.level, player.currentXP);

  // Derive the weekly history directly from completed quest records.
  const weeklyXPData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const dateKey = date.toISOString().slice(0, 10);
    const xp = completedQuests
      .filter(quest => quest.completedAt?.slice(0, 10) === dateKey)
      .reduce((total, quest) => total + quest.xpReward, 0);
    return { day: date.toLocaleDateString('en-US', { weekday: 'short' }), xp };
  });
  const maxWeeklyXP = Math.max(1, ...weeklyXPData.map(item => item.xp));
  const averageWeeklyXP = Math.round(weeklyXPData.reduce((total, item) => total + item.xp, 0) / 7);

  // Quest count by territory / category
  const categories = ['Coding', 'Study', 'Fitness', 'Reading', 'Personal', 'Health'] as const;
  const categoryStats = categories.map(cat => {
    const totalInCat = quests.filter(q => q.category === cat).length;
    const completedInCat = quests.filter(q => q.category === cat && q.completed).length;
    const pct = totalInCat > 0 ? Math.round((completedInCat / totalInCat) * 100) : 0;
    return { category: cat, completed: completedInCat, total: totalInCat, percentage: pct };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono-rpg text-rpg-gold uppercase tracking-wider mb-1">
          <Scroll className="w-4 h-4 text-rpg-gold" />
          <span>Chronicles of Valor</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-rpg text-slate-100 flex items-center gap-2">
          <span>📜</span> LIFE JOURNEY & HEROIC METRICS
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Quantitative records of all trials conquered, experience gained, and territory secured.
        </p>
      </div>

      {/* Top Stat Cards: Total XP, Quests Completed, Current Streak, Longest Streak, Gold Earned, Current Level */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl glass-panel-glow border border-amber-500/30 text-center space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono-rpg block">
            Current Level
          </span>
          <span className="text-2xl font-black font-mono-rpg text-amber-300">
            LVL {player.level}
          </span>
          <span className="text-[10px] text-slate-500 font-mono-rpg block">
            Hero Ascendant
          </span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-amber-500/20 text-center space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono-rpg block">
            Total XP
          </span>
          <span className="text-2xl font-black font-mono-rpg text-rpg-gold">
            {totalXpEarned.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 font-mono-rpg block">
            Lifetime Power
          </span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 text-center space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono-rpg block">
            Quests Conquered
          </span>
          <span className="text-2xl font-black font-mono-rpg text-sky-400">
            {completedCount} <span className="text-xs text-slate-500">/ {totalCount}</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono-rpg block">
            {completionRate}% Victory Rate
          </span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-orange-500/20 text-center space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono-rpg block">
            Active Streak
          </span>
          <span className="text-2xl font-black font-mono-rpg text-orange-400">
            {player.streak} Days
          </span>
          <span className="text-[10px] text-slate-500 font-mono-rpg block">
            Daily Fire
          </span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-purple-500/20 text-center space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono-rpg block">
            Longest Streak
          </span>
          <span className="text-2xl font-black font-mono-rpg text-purple-300">
            {player.longestStreak} Days
          </span>
          <span className="text-[10px] text-slate-500 font-mono-rpg block">
            Personal Record
          </span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-emerald-500/20 text-center space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono-rpg block">
            Guild Gold
          </span>
          <span className="text-2xl font-black font-mono-rpg text-emerald-400">
            {player.gold.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 font-mono-rpg block">
            Treasury Coins
          </span>
        </div>
      </div>

      {/* Main Charts: BATTLE HISTORY & WORLD PROGRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ⚔ BATTLE HISTORY (Weekly XP Surge) */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold font-rpg text-slate-100 flex items-center gap-2">
                <Swords className="w-4 h-4 text-rpg-gold" />
                ⚔ BATTLE HISTORY
              </h3>
              <p className="text-xs text-slate-400">Daily experience surges and engagement velocity</p>
            </div>
            <span className="text-xs font-mono-rpg text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              Avg: {averageWeeklyXP} XP/day
            </span>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2 border-b border-slate-800">
            {weeklyXPData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono-rpg text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  +{item.xp}
                </span>
                <div
                  className="w-full max-w-[38px] rounded-t-xl bg-gradient-to-t from-amber-600 via-rpg-gold to-yellow-300 group-hover:shadow-glow-gold transition-all duration-300"
                  style={{ height: `${Math.max(4, (item.xp / maxWeeklyXP) * 100)}%` }}
                />
                <span className="text-xs font-mono-rpg text-slate-400 pt-1 group-hover:text-slate-100">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 🗺 WORLD PROGRESS (Category / Realm Completion) */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold font-rpg text-slate-100 flex items-center gap-2">
                <Map className="w-4 h-4 text-rpg-cyan" />
                🗺 WORLD PROGRESS
              </h3>
              <p className="text-xs text-slate-400">Territory conquest percentage across all realms</p>
            </div>
            <span className="text-xs font-mono-rpg text-slate-400">{completedCount} Conquered</span>
          </div>

          <div className="space-y-4">
            {categoryStats.map(stat => (
              <div key={stat.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono-rpg">
                  <span className="text-slate-200 font-semibold">{stat.category} Realm</span>
                  <span className="text-slate-400">
                    {stat.completed} / {stat.total} ({stat.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🧠 ATTRIBUTE GROWTH MATRIX */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold font-rpg text-slate-100 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              🧠 ATTRIBUTE GROWTH MATRIX
            </h3>
            <p className="text-xs text-slate-400">
              Balanced character stats ensure cognitive, physical, and mental equilibrium
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(player.attributes).map(([attr, val]) => (
            <div
              key={attr}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1"
            >
              <span className="text-xs text-slate-400 font-rpg font-semibold block">{attr}</span>
              <span className="text-2xl font-black font-mono-rpg text-slate-100">{val}</span>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-2">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-300"
                  style={{ width: `${Math.min(100, val)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
