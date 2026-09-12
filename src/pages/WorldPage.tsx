import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { initialWorldLocations } from '../data/mockData';
import { WorldLocation, Quest } from '../types';
import { QuestCard } from '../components/cards/QuestCard';
import { Map, Compass, Shield, Sparkles, ChevronRight, X, Lock, CheckCircle2, Swords } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export const WorldPage: React.FC = () => {
  const { player, quests } = useGame();
  const [selectedLocation, setSelectedLocation] = useState<WorldLocation | null>(null);

  // Compute live progress stats for each location based on actual player quests
  const getLocationStats = (category: string, reqLevel: number) => {
    const isUnlocked = player.level >= reqLevel;
    const catQuests = quests.filter(q => q.category === category);
    const completedQuests = catQuests.filter(q => q.completed);
    const totalCount = Math.max(catQuests.length, 5); // baseline domain depth
    const completedCount = completedQuests.length;
    const percentage = Math.min(100, Math.round((completedCount / totalCount) * 100));

    return {
      isUnlocked,
      completedCount,
      totalCount,
      percentage,
      activeQuests: catQuests
    };
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-rpg text-rpg-gold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-rpg-gold animate-spin" style={{ animationDuration: '12s' }} />
            <span>Realm Cartography</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-rpg text-slate-100">
            World of Life RPG
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Transform real-world productivity habits into conquered fantasy territories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 shadow flex items-center gap-2.5 font-mono-rpg text-xs">
            <span className="text-slate-400">Territory Control:</span>
            <span className="text-rpg-gold font-bold">
              {Math.round(
                initialWorldLocations.reduce(
                  (acc, loc) => acc + getLocationStats(loc.category, loc.requiredLevel).percentage,
                  0
                ) / initialWorldLocations.length
              )}%
            </span>
          </div>
        </div>
      </div>

      {/* Interactive World Map Canvas */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#070b13] p-6 sm:p-10 shadow-2xl min-h-[460px] flex flex-col justify-between">
        {/* Map Grid Overlay Background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #384666 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />

        {/* Atmospheric Ambient Glows */}
        <div className="absolute top-1/4 left-1/5 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* SVG Pathways Connecting Territories */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path
            d="M 160 160 Q 380 200 600 130 T 700 320 Q 520 240 240 340 Z"
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="2"
            strokeDasharray="6 6"
            className="animate-pulse"
          />
        </svg>

        {/* Location Markers on Interactive Map */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialWorldLocations.map(location => {
            const stats = getLocationStats(location.category, location.requiredLevel);
            const isSelected = selectedLocation?.id === location.id;

            return (
              <motion.div
                key={location.id}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedLocation(location)}
                className={`relative rounded-2xl p-5 border transition-all cursor-pointer backdrop-blur-md ${
                  isSelected
                    ? 'bg-slate-900/95 border-rpg-gold shadow-glow-gold ring-1 ring-rpg-gold'
                    : stats.isUnlocked
                    ? 'glass-panel border-slate-700/80 hover:border-rpg-cyan/80 hover:shadow-glow-cyan'
                    : 'bg-slate-950/60 border-slate-900/80 opacity-60'
                }`}
              >
                {/* Top Status & Tier */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-xl shadow">
                      {location.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-rpg uppercase text-slate-400 font-bold block">
                        {location.category} Realm
                      </span>
                      <h3 className="text-base font-bold font-rpg text-slate-100">
                        {location.name}
                      </h3>
                    </div>
                  </div>

                  {stats.isUnlocked ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-rpg font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Unlocked
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-rpg font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Req Lv {location.requiredLevel}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                  {location.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-4 font-mono-rpg">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Territory Mastery</span>
                    <span className="text-amber-400 font-bold">{stats.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 via-amber-400 to-yellow-300 transition-all duration-500"
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 block text-right">
                    {stats.completedCount} / {stats.totalCount} Quests Conquered
                  </span>
                </div>

                {/* Bottom Reward and Enter Action */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono-rpg text-sky-400 font-medium truncate">
                    🎁 {location.rewardText}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLocation(location);
                    }}
                    disabled={!stats.isUnlocked}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase font-rpg tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                      stats.isUnlocked
                        ? 'rpg-button-gold shadow-glow-gold'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Enter</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Map Footer Lore Legend */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono-rpg text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block shadow-glow-emerald" />
              Conquered Outposts
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block shadow-glow-gold" />
              Active Battlefields
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600 block" />
              Locked Strongholds
            </span>
          </div>
          <span className="text-slate-500 italic">
            &quot;Every conquered task claims sovereignty over your reality.&quot;
          </span>
        </div>
      </div>

      {/* Territory Inspector Drawer / Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <div
            onClick={() => setSelectedLocation(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
              className="relative max-w-2xl w-full p-6 sm:p-8 rounded-3xl glass-panel-glow border-2 border-rpg-gold/70 shadow-glow-gold overflow-hidden max-h-[90vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedLocation(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Territory Banner Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-rpg-gold to-yellow-300 p-1 shadow-glow-gold flex items-center justify-center text-4xl shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                    {selectedLocation.icon}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-mono-rpg font-bold uppercase tracking-wider text-rpg-gold block">
                    {selectedLocation.subtitle}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-rpg text-slate-100">
                    {selectedLocation.name}
                  </h2>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                {selectedLocation.description}
              </p>

              {/* Territory Quests Sub-board */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold font-rpg text-slate-200 flex items-center gap-2">
                    <Swords className="w-4 h-4 text-rpg-gold" />
                    Available Territory Quests ({selectedLocation.category})
                  </h4>
                  <Link
                    to="/quests"
                    className="text-xs font-bold font-mono-rpg text-rpg-cyan hover:underline"
                  >
                    All Quests →
                  </Link>
                </div>

                {quests.filter(q => q.category === selectedLocation.category).length === 0 ? (
                  <div className="p-8 text-center glass-panel rounded-2xl border border-slate-800">
                    <p className="text-sm text-slate-400">
                      No active quests currently assigned to {selectedLocation.name}.
                    </p>
                    <Link
                      to="/quests"
                      className="mt-3 inline-block px-4 py-2 rounded-xl rpg-button-gold text-xs font-bold uppercase font-rpg tracking-wider"
                    >
                      Forge Territory Quest
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quests
                      .filter(q => q.category === selectedLocation.category)
                      .map(quest => (
                        <QuestCard key={quest.id} quest={quest} compact />
                      ))}
                  </div>
                )}
              </div>

              {/* Close action */}
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="px-6 py-2.5 rounded-xl rpg-button-gold text-xs font-black uppercase tracking-wider shadow-glow-gold cursor-pointer"
                >
                  Return to World Map
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
