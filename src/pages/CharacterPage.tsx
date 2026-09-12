import React from 'react';
import { useGame } from '../context/GameContext';
import { XPBar } from '../components/ui/XPBar';
import { AttributeBar } from '../components/ui/AttributeBar';
import { AttributeType } from '../types';
import { Shield, Sparkles, UserCheck, Flame, Award, Swords } from 'lucide-react';
import { Link } from 'react-router-dom';

const ATTRIBUTES_LIST: AttributeType[] = [
  'Strength',
  'Intellect',
  'Discipline',
  'Creativity',
  'Health',
  'Focus'
];

const ATTRIBUTE_LORE: Record<AttributeType, { task: string; effect: string }> = {
  Strength: {
    task: 'Gym, Cardio & Resistance Training',
    effect: 'Boosts physical grit, resilience and sustained power'
  },
  Intellect: {
    task: 'Coding, Algorithm Design & Architecture',
    effect: 'Increases problem-solving velocity and mental sharpness'
  },
  Discipline: {
    task: 'Meditation, Morning Routine & Habits',
    effect: 'Fortifies emotional control and resistance to temptation'
  },
  Creativity: {
    task: 'Project Building, Writing & System Design',
    effect: 'Unlocks novel ideation and architectural elegance'
  },
  Health: {
    task: 'Hydration, Nutrition & Restorative Sleep',
    effect: 'Regenerates vital energy and sustained daily stamina'
  },
  Focus: {
    task: 'Deep Work Sprints & Pomodoro Focus',
    effect: 'Eliminates cognitive drag and accelerates flow state'
  }
};

export const CharacterPage: React.FC = () => {
  const { player, allocateAttributePoint } = useGame();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono-rpg text-rpg-gold uppercase tracking-wider mb-1">
          <UserCheck className="w-4 h-4" />
          <span>Heroic Character Sheet</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-rpg text-slate-100">
          Character Sheet & Mastery
        </h1>
      </div>

      {/* Main Character Hero Display */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel-glow relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rpg-gold/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          {/* Large Character Avatar */}
          <div className="relative group">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-amber-600 via-rpg-gold to-yellow-300 p-1 shadow-glow-gold">
              <div className="w-full h-full bg-slate-950 rounded-3xl flex items-center justify-center text-6xl sm:text-7xl group-hover:scale-105 transition-transform">
                {player.avatar || '⚔️'}
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs font-mono-rpg shadow-lg border-2 border-slate-900 whitespace-nowrap">
              LEVEL {player.level}
            </div>
          </div>

          {/* Character Details & XP */}
          <div className="flex-1 space-y-3 max-w-xl">
            <div className="flex items-center justify-center md:justify-start gap-2.5 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-black font-rpg text-slate-100">
                {player.name}
              </h2>
              <span className="px-3 py-1 rounded-full bg-rpg-gold/15 text-rpg-gold border border-rpg-gold/40 text-xs font-mono-rpg font-bold">
                {player.title}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono-rpg">
                {player.equippedBadge || '🏆 Quest Master'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg">
              {player.bio ||
                'A dedicated warrior transmuting everyday tasks into legendary milestones.'}
            </p>

            {/* Level XP Bar */}
            <div className="pt-2">
              <XPBar currentXP={player.currentXP} level={player.level} />
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 pt-2 text-xs font-mono-rpg">
              <div className="flex items-center gap-1 text-orange-400">
                <Flame className="w-4 h-4 fill-orange-400" />
                <span>{player.streak} Day Streak</span>
              </div>
              <div className="flex items-center gap-1 text-sky-400">
                <Sparkles className="w-4 h-4 text-rpg-gold" />
                <span>{player.gold.toLocaleString()} Gold Treasury</span>
              </div>
            </div>
          </div>

          {/* Gear Quick Link */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-2 shrink-0">
            <span className="text-xs text-slate-400 font-rpg font-bold block">
              Character Armory
            </span>
            <Link
              to="/inventory"
              className="px-4 py-2 rounded-xl rpg-button-cyan text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-glow-cyan"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Equip Items</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Attribute Points Banner if available */}
      {player.attributePoints > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-purple-900/30 to-purple-950/60 border border-purple-500/40 shadow-glow-purple flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-purple-400 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <h4 className="text-sm font-bold font-rpg text-purple-200">
                Unassigned Attribute Points: {player.attributePoints}
              </h4>
              <p className="text-xs text-purple-300/80">
                Click the &quot;+&quot; icon next to any attribute below to permanently allocate points.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Attributes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-rpg text-slate-100">Core Attributes</h3>
            <p className="text-xs text-slate-400">
              Real-life quests dynamically increase these 6 core character stats
            </p>
          </div>
          <span className="text-xs font-mono-rpg text-slate-400">Cap: 100 PTS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ATTRIBUTES_LIST.map(attr => (
            <div key={attr} className="space-y-2">
              <AttributeBar
                name={attr}
                value={player.attributes[attr] || 0}
                canUpgrade={player.attributePoints > 0}
                onUpgrade={() => allocateAttributePoint(attr)}
              />
              <div className="px-3 text-[11px] text-slate-500 font-mono-rpg">
                <span className="text-slate-400 font-semibold">{ATTRIBUTE_LORE[attr].task}:</span>{' '}
                {ATTRIBUTE_LORE[attr].effect}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
