import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { QuestCard } from '../components/cards/QuestCard';
import { CircularProgress } from '../components/ui/CircularProgress';
import { XPBar } from '../components/ui/XPBar';
import { CreateQuestModal } from '../components/modals/CreateQuestModal';
import { getWeekDaysActivity } from '../utils/streakSystem';
import {
  Swords,
  Plus,
  Flame,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Sparkles,
  Calendar,
  Gift,
  Zap,
  Target,
  Shield,
  Clock,
  Coins,
  CheckSquare,
  Square,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const DashboardPage: React.FC = () => {
  const {
    player,
    quests,
    chests,
    dailyMissions,
    dailyMissionBonusClaimed,
    openChest,
    toggleDailyMission,
    claimDailyMissionsBonus,
    completeQuest
  } = useGame();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Time based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Daily quests filtering
  const dailyQuests = quests.filter(q => q.isDaily);
  const completedDailyCount = dailyQuests.filter(q => q.completed).length;
  const totalDailyCount = dailyQuests.length;

  // Featured Daily Main Quest: pick uncompleted highest reward or the first active quest
  const activeMainQuest =
    dailyQuests.find(q => !q.completed) ||
    quests.find(q => !q.completed) ||
    quests[0];

  // Side quests: the other quests
  const sideQuests = quests.filter(q => q.id !== activeMainQuest?.id).slice(0, 4);

  // Daily missions stats
  const completedMissionsCount = dailyMissions.filter(m => m.completed).length;
  const allMissionsCompleted = completedMissionsCount === dailyMissions.length;

  const weekActivity = getWeekDaysActivity(player.lastActiveDate, player.streak);

  // Milestone badges definitions
  const streakMilestones = [
    { days: 3, label: '3 Days', passed: player.streak >= 3 },
    { days: 7, label: '7 Days', passed: player.streak >= 7 },
    { days: 14, label: '14 Days', passed: player.streak >= 14 },
    { days: 30, label: '30 Days', passed: player.streak >= 30 },
    { days: 60, label: '60 Days', passed: player.streak >= 60 },
    { days: 100, label: '100 Days', passed: player.streak >= 100 },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* ================================================== */}
      {/* 1. MAIN CHARACTER HERO AREA (Section 3)            */}
      {/* ================================================== */}
      <div className="rounded-3xl glass-panel-glow p-6 sm:p-8 relative overflow-hidden border border-amber-500/30">
        {/* Subtle breathing glow ambient background */}
        <motion.div
          animate={{ opacity: [0.12, 0.25, 0.12] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-96 h-96 bg-rpg-gold/20 rounded-full blur-3xl pointer-events-none"
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Avatar & Player Identity */}
          <div className="flex items-center gap-5">
            {/* Avatar with subtle idle animation */}
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative shrink-0"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-amber-600 via-rpg-gold to-yellow-300 p-1 shadow-glow-gold">
                <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl">
                  {player.avatar || '⚔️'}
                </div>
              </div>
              <span className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 font-black text-xs font-mono-rpg px-2 py-0.5 rounded-full border-2 border-slate-900 shadow">
                LVL {player.level}
              </span>
            </motion.div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black font-rpg text-slate-100">
                  {player.name}
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono-rpg font-bold">
                  {player.title}
                </span>
                {player.attributePoints > 0 && (
                  <Link
                    to="/character"
                    className="px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono-rpg font-bold animate-pulse hover:bg-purple-500/30"
                  >
                    +{player.attributePoints} Points Available!
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono-rpg">
                <span>Joined {player.joinedDate}</span>
                <span>•</span>
                <span className="text-amber-400">Streak: {player.streak} Days</span>
                <span>•</span>
                <span className="text-sky-400">{player.gold.toLocaleString()} Gold</span>
              </div>

              {/* Character XP Bar */}
              <div className="pt-1 max-w-lg w-full">
                <XPBar currentXP={player.currentXP} level={player.level} />
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3 self-start lg:self-auto">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-3 rounded-xl rpg-button-gold text-xs font-black uppercase tracking-wider shadow-glow-gold flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Forge Quest</span>
            </button>
          </div>
        </div>

        {/* Character Attributes HUD Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-3 sm:grid-cols-6 gap-2.5 font-mono-rpg">
          {Object.entries(player.attributes).map(([attr, val]) => (
            <Link
              key={attr}
              to="/character"
              className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all text-center group"
            >
              <span className="text-[10px] text-slate-400 uppercase block group-hover:text-slate-200">
                {attr.slice(0, 4)}
              </span>
              <span className="text-base font-black text-slate-100 group-hover:text-rpg-gold">
                {val}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ================================================== */}
      {/* 2. TODAY'S FEATURED MAIN QUEST (Section 3)         */}
      {/* ================================================== */}
      {activeMainQuest && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#182238] via-[#131b2d] to-[#0c1220] border-2 border-rpg-gold/70 shadow-glow-gold relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono-rpg font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-rpg-gold" />
                  DAILY MAIN QUEST
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-rpg font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase">
                  {activeMainQuest.difficulty}
                </span>
                <span className="text-xs text-slate-400 font-mono-rpg">
                  • Due: {activeMainQuest.deadline || 'Today, 23:59'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-rpg text-slate-100">
                &quot;{activeMainQuest.title}&quot;
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeMainQuest.description}
              </p>

              {/* Rewards Summary */}
              <div className="flex items-center gap-3 pt-2 font-mono-rpg">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-rpg-gold text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> +{activeMainQuest.xpReward} XP
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold">
                  <Coins className="w-3.5 h-3.5" /> +{activeMainQuest.goldReward} GOLD
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <Zap className="w-3.5 h-3.5" /> +{activeMainQuest.attributeReward} {activeMainQuest.attributeType.slice(0, 4).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Main Quest Action Button */}
            <div className="shrink-0 flex flex-col items-stretch sm:items-end gap-2">
              {activeMainQuest.completed ? (
                <div className="px-6 py-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-400 font-bold font-rpg text-sm flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Main Quest Completed</span>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => completeQuest(activeMainQuest.id)}
                  className="px-8 py-4 rounded-2xl rpg-button-gold text-sm font-black uppercase tracking-wider shadow-glow-gold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Swords className="w-4 h-4" />
                  <span>CONTINUE QUEST</span>
                </motion.button>
              )}
              <span className="text-[10px] text-slate-400 font-mono-rpg text-center sm:text-right">
                Primary daily objective for hero advancement
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 3. DAILY MISSIONS BOARD (Section 12) & STREAK      */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Missions Board */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl glass-panel border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-rpg-cyan flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-rpg text-slate-100">Daily Mission Board</h3>
                  <p className="text-xs text-slate-400">Complete all 5 missions for epic guild loot</p>
                </div>
              </div>

              <div className="text-right font-mono-rpg">
                <span className="text-sm font-black text-slate-100">
                  {completedMissionsCount} / {dailyMissions.length}
                </span>
                <span className="text-[10px] text-slate-400 block">Cleared</span>
              </div>
            </div>

            {/* Daily Mission Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800 mb-5">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-amber-400 to-yellow-300 transition-all duration-500"
                style={{ width: `${(completedMissionsCount / dailyMissions.length) * 100}%` }}
              />
            </div>

            {/* Mission Checkboxes */}
            <div className="space-y-2.5">
              {dailyMissions.map(mission => (
                <div
                  key={mission.id}
                  onClick={() => toggleDailyMission(mission.id)}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    mission.completed
                      ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {mission.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500 shrink-0" />
                    )}
                    <span className={`text-xs font-semibold font-rpg truncate ${mission.completed ? 'line-through' : ''}`}>
                      {mission.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono-rpg text-[11px] shrink-0">
                    <span className="text-amber-400 font-bold">+{mission.rewardXp} XP</span>
                    <span className="text-sky-400 font-bold">+{mission.rewardGold} G</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grand Bonus Box */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xl">
                🎁
              </div>
              <div>
                <span className="text-[10px] font-mono-rpg uppercase text-amber-400 font-bold block">
                  ALL-MISSION GRAND BONUS
                </span>
                <span className="text-xs font-bold font-rpg text-slate-200">
                  +500 XP • +200 GOLD • EPIC CHEST
                </span>
              </div>
            </div>

            <button
              onClick={claimDailyMissionsBonus}
              disabled={!allMissionsCompleted || dailyMissionBonusClaimed}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                allMissionsCompleted
                  ? 'rpg-button-gold shadow-glow-gold'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
                {dailyMissionBonusClaimed ? 'Grand Bonus Claimed' : allMissionsCompleted ? 'Claim Grand Bonus' : 'Complete 5 Missions'}
            </button>
          </div>
        </div>

        {/* 7-Day Streak Panel (Section 11) */}
        <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400 fill-orange-400 animate-pulse" />
                <h3 className="text-lg font-bold font-rpg text-slate-100">
                  {player.streak} DAY STREAK
                </h3>
              </div>
              <span className="text-xs font-mono-rpg text-amber-400 font-semibold">
                Next: 10 Days (+250 G)
              </span>
            </div>

            {/* 7-Day Visual Tracker */}
            <div className="grid grid-cols-7 gap-1.5 mb-6">
              {weekActivity.map((day, idx) => (
                <div
                  key={idx}
                  className={`py-2 px-1 rounded-xl text-center border font-mono-rpg ${
                    day.completed
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="text-[10px] block font-semibold">{day.dayName}</span>
                  <div className="mt-1 flex justify-center">
                    {day.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-rpg-gold" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700 block my-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Streak Milestones Badges */}
            <span className="text-[10px] font-mono-rpg uppercase text-slate-400 font-bold block mb-2">
              Milestone Badges
            </span>
            <div className="grid grid-cols-3 gap-2 font-mono-rpg text-center">
              {streakMilestones.map(m => (
                <div
                  key={m.days}
                  className={`py-2 px-1 rounded-xl border text-xs ${
                    m.passed
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold shadow-sm'
                      : 'bg-slate-900/50 border-slate-800/80 text-slate-500'
                  }`}
                >
                  <span>{m.label}</span>
                  <span className="block text-[9px] text-slate-400">
                    {m.passed ? '✓ Claimed' : 'Locked'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <span className="text-xs text-slate-400 italic">
              &quot;Consistency is the hero&apos;s ultimate weapon.&quot;
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 4. LOOT CHESTS ROW (Section 14)                    */}
      {/* ================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-rpg-gold" />
            <h3 className="text-lg font-bold font-rpg text-slate-100">Mythic Loot Chests</h3>
          </div>
          <span className="text-xs font-mono-rpg text-slate-400">
            Deterministic Milestone Rewards
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {chests.map(chest => (
            <div
              key={chest.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                chest.opened
                  ? 'bg-slate-900/30 border-slate-800/60 opacity-60'
                  : chest.unlocked
                  ? 'glass-panel-glow border-rpg-gold/80 shadow-glow-gold'
                  : 'glass-panel border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shadow">
                    {chest.type === 'daily' ? '📦' : chest.type === 'weekly' ? '🧰' : '🎁'}
                  </div>

                  {chest.opened ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-rpg font-bold bg-slate-800 text-slate-400">
                      Looted
                    </span>
                  ) : chest.unlocked ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-rpg font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                      Ready to Open!
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-rpg font-bold bg-slate-800 text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold font-rpg text-slate-100 mb-1">
                  {chest.name}
                </h4>
                <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                  {chest.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1 mb-4 font-mono-rpg text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>{chest.requirementText}</span>
                    <span className="text-amber-400 font-bold">
                      {chest.progress} / {chest.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-300"
                      style={{ width: `${Math.min(100, (chest.progress / chest.maxProgress) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => openChest(chest.id)}
                disabled={!chest.unlocked || chest.opened}
                className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  chest.opened
                    ? 'bg-slate-900 text-slate-500 cursor-not-allowed'
                    : chest.unlocked
                    ? 'rpg-button-gold shadow-glow-gold'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {chest.opened ? (
                  <span>Claimed</span>
                ) : chest.unlocked ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>OPEN CHEST</span>
                  </>
                ) : (
                  <span>Progress ({chest.progress}/{chest.maxProgress})</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================== */}
      {/* 5. SIDE QUESTS SECTION (Section 4)                 */}
      {/* ================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-rpg-cyan" />
            <h3 className="text-lg font-bold font-rpg text-slate-100">Side Quests</h3>
          </div>

          <Link
            to="/quests"
            className="text-xs font-bold text-rpg-cyan hover:underline flex items-center gap-1 font-rpg"
          >
            <span>All Quests ({quests.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {sideQuests.length === 0 ? (
          <div className="p-8 text-center glass-panel rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">No side quests active. Forge one to begin!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sideQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        )}
      </div>

      {/* Create Quest Modal */}
      <CreateQuestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
