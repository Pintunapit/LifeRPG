import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { SkillNode } from '../types';
import { SkillDetailModal } from '../components/modals/SkillDetailModal';
import { Network, Sparkles, Check, Lock, ChevronRight, Info, Shield, Brain, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const SkillTreePage: React.FC = () => {
  const { player, skills } = useGame();
  const [selectedBranch, setSelectedBranch] = useState<'Intellect' | 'Strength' | 'Focus'>('Intellect');
  const [inspectedSkill, setInspectedSkill] = useState<SkillNode | null>(null);

  const branchSkills = skills.filter(s => s.branch === selectedBranch);
  const unlockedCount = branchSkills.filter(s => s.unlocked).length;
  const totalCount = branchSkills.length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-rpg text-rpg-gold uppercase tracking-wider mb-1">
            <Network className="w-4 h-4 text-rpg-gold animate-pulse" />
            <span>Heroic Mastery Arc</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-rpg text-slate-100">
            RPG Skill Tree
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Invest attribute points and gold to unlock game-altering passive perks and abilities.
          </p>
        </div>

        {/* Currency & Points Quick Info */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono-rpg text-xs flex items-center gap-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>{player.attributePoints} Attribute Points</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono-rpg text-xs flex items-center gap-2 shadow-sm">
            <span>💰 {player.gold.toLocaleString()} Gold</span>
          </div>
        </div>
      </div>

      {/* Branch Selector Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3 overflow-x-auto">
        {(['Intellect', 'Strength', 'Focus'] as const).map(branch => {
          const isActive = selectedBranch === branch;
          const bCount = skills.filter(s => s.branch === branch && s.unlocked).length;
          const bTotal = skills.filter(s => s.branch === branch).length;

          const Icon = branch === 'Intellect' ? Brain : branch === 'Strength' ? Shield : Zap;

          return (
            <button
              key={branch}
              onClick={() => setSelectedBranch(branch)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-rpg tracking-wider transition-all whitespace-nowrap flex items-center gap-2.5 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-rpg-gold to-amber-500 text-rpg-dark shadow-glow-gold font-black'
                  : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{branch} Dominion</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono-rpg ${
                  isActive ? 'bg-slate-950/30 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {bCount}/{bTotal}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Skill Tree Diagram Display */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-[#080c14] border border-slate-800/90 shadow-2xl overflow-hidden min-h-[500px]">
        {/* Subtle Ambient Grid Background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #384666 1px, transparent 0)`,
            backgroundSize: '28px 28px'
          }}
        />

        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-rpg-gold/10 rounded-full blur-3xl pointer-events-none" />

        {/* Branch Title & Overview Pill */}
        <div className="relative z-10 flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
          <div>
            <span className="text-[10px] font-mono-rpg uppercase text-rpg-gold font-bold tracking-widest block">
              Ascendance Path
            </span>
            <h2 className="text-xl font-bold font-rpg text-slate-100">
              The Path of {selectedBranch}
            </h2>
          </div>
          <div className="text-right font-mono-rpg text-xs">
            <span className="text-slate-400">Mastery: </span>
            <span className="text-amber-400 font-bold">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </span>
          </div>
        </div>

        {/* Intellect Branch Hierarchical Tree Flow */}
        {selectedBranch === 'Intellect' && (
          <div className="relative z-10 max-w-4xl mx-auto space-y-12 py-4">
            {/* Tier 1: Root Node */}
            <div className="flex justify-center">
              {skills
                .filter(s => s.id === 'skill-int-root')
                .map(skill => (
                  <SkillNodeCard
                    key={skill.id}
                    skill={skill}
                    onSelect={() => setInspectedSkill(skill)}
                  />
                ))}
            </div>

            {/* Connecting Vertical Line */}
            <div className="w-0.5 h-8 bg-gradient-to-b from-amber-400 to-cyan-400 mx-auto shadow-glow-gold" />

            {/* Branch Split Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
              <span className="text-xs font-bold font-mono-rpg text-cyan-400 tracking-wider uppercase">
                ⚙️ Coding Track
              </span>
              <span className="text-xs font-bold font-mono-rpg text-amber-400 tracking-wider uppercase">
                📚 Learning Track
              </span>
            </div>

            {/* Tier 2: Coding Root & Learning Root */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex justify-center">
                {skills
                  .filter(s => s.id === 'skill-coding-root')
                  .map(skill => (
                    <SkillNodeCard
                      key={skill.id}
                      skill={skill}
                      onSelect={() => setInspectedSkill(skill)}
                    />
                  ))}
              </div>
              <div className="flex justify-center">
                {skills
                  .filter(s => s.id === 'skill-learning-root')
                  .map(skill => (
                    <SkillNodeCard
                      key={skill.id}
                      skill={skill}
                      onSelect={() => setInspectedSkill(skill)}
                    />
                  ))}
              </div>
            </div>

            {/* Tier 3: Java Master & Bookworm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex justify-center">
                {skills
                  .filter(s => s.id === 'skill-java-master')
                  .map(skill => (
                    <SkillNodeCard
                      key={skill.id}
                      skill={skill}
                      onSelect={() => setInspectedSkill(skill)}
                    />
                  ))}
              </div>
              <div className="flex justify-center">
                {skills
                  .filter(s => s.id === 'skill-bookworm')
                  .map(skill => (
                    <SkillNodeCard
                      key={skill.id}
                      skill={skill}
                      onSelect={() => setInspectedSkill(skill)}
                    />
                  ))}
              </div>
            </div>

            {/* Tier 4: Algorithm Pro & Grand Scholar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex justify-center">
                {skills
                  .filter(s => s.id === 'skill-algo-pro')
                  .map(skill => (
                    <SkillNodeCard
                      key={skill.id}
                      skill={skill}
                      onSelect={() => setInspectedSkill(skill)}
                    />
                  ))}
              </div>
              <div className="flex justify-center">
                {skills
                  .filter(s => s.id === 'skill-scholar')
                  .map(skill => (
                    <SkillNodeCard
                      key={skill.id}
                      skill={skill}
                      onSelect={() => setInspectedSkill(skill)}
                    />
                  ))}
              </div>
            </div>

            {/* Tier 5: Pinnacle Code Warrior */}
            <div className="pt-4 flex flex-col items-center justify-center">
              <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-400 to-amber-400 shadow-glow-cyan mb-3" />
              <span className="text-[11px] font-mono-rpg text-amber-400 font-bold uppercase tracking-widest mb-2">
                👑 Pinnacle Mastery
              </span>
              {skills
                .filter(s => s.id === 'skill-code-warrior')
                .map(skill => (
                  <SkillNodeCard
                    key={skill.id}
                    skill={skill}
                    isPinnacle
                    onSelect={() => setInspectedSkill(skill)}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Strength and Focus Linear Progression */}
        {selectedBranch !== 'Intellect' && (
          <div className="relative z-10 max-w-md mx-auto space-y-8 py-4">
            {branchSkills.map((skill, index) => (
              <React.Fragment key={skill.id}>
                <div className="flex justify-center">
                  <SkillNodeCard
                    skill={skill}
                    onSelect={() => setInspectedSkill(skill)}
                  />
                </div>
                {index < branchSkills.length - 1 && (
                  <div className="w-0.5 h-8 bg-gradient-to-b from-amber-400/80 to-slate-700 mx-auto shadow-glow-gold" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Bottom Lore Guidance */}
        <div className="relative z-10 mt-12 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono-rpg text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 shadow-glow-gold" />
              Mastered (Active Perk)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-700" />
              Unmastered (Click to Inspect)
            </span>
          </div>
          <span className="text-slate-500 hidden sm:inline">
            Click any node to inspect requirements and unlock
          </span>
        </div>
      </div>

      {/* Skill Detail Modal */}
      <SkillDetailModal
        skill={inspectedSkill}
        onClose={() => setInspectedSkill(null)}
      />
    </div>
  );
};

interface SkillNodeCardProps {
  skill: SkillNode;
  isPinnacle?: boolean;
  onSelect: () => void;
}

const SkillNodeCard: React.FC<SkillNodeCardProps> = ({ skill, isPinnacle = false, onSelect }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.96 }}
      onClick={onSelect}
      className={`relative p-4 rounded-2xl border transition-all text-left w-64 sm:w-72 cursor-pointer backdrop-blur-md ${
        skill.unlocked
          ? isPinnacle
            ? 'bg-gradient-to-br from-amber-500/25 to-yellow-600/20 border-rpg-gold shadow-glow-gold'
            : 'bg-slate-900/90 border-rpg-gold/70 shadow-glow-gold'
          : 'bg-slate-950/70 border-slate-800/80 opacity-65 hover:opacity-90 hover:border-slate-600'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow ${
            skill.unlocked
              ? 'bg-amber-500/20 text-rpg-gold border border-amber-400/40 shadow-glow-gold'
              : 'bg-slate-900 text-slate-500 border border-slate-800'
          }`}
        >
          {skill.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono-rpg font-semibold uppercase text-slate-400">
              Tier {skill.tier}
            </span>
            {skill.unlocked ? (
              <span className="text-[10px] font-mono-rpg text-emerald-400 font-bold flex items-center gap-0.5">
                <Check className="w-3 h-3" /> Mastered
              </span>
            ) : (
              <span className="text-[10px] font-mono-rpg text-slate-500 flex items-center gap-0.5">
                <Lock className="w-3 h-3" /> Locked
              </span>
            )}
          </div>
          <h4
            className={`text-sm font-bold font-rpg truncate mt-0.5 ${
              skill.unlocked ? 'text-slate-100' : 'text-slate-400'
            }`}
          >
            {skill.title}
          </h4>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 line-clamp-1 mt-2.5 font-mono-rpg">
        ⚡ {skill.perk}
      </p>
    </motion.button>
  );
};
