import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkillNode } from '../../types';
import { useGame } from '../../context/GameContext';
import { Sparkles, X, Check, Lock, ShieldAlert, Coins } from 'lucide-react';

interface SkillDetailModalProps {
  skill: SkillNode | null;
  onClose: () => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({ skill, onClose }) => {
  const { player, unlockSkill } = useGame();

  if (!skill) return null;

  const currentAttrVal = player.attributes[skill.requiredAttribute.type] || 0;
  const meetsLevel = player.level >= skill.requiredLevel;
  const meetsAttr = currentAttrVal >= skill.requiredAttribute.value;
  const hasPoints = player.attributePoints >= skill.costAttributePoints;
  const hasGold = player.gold >= skill.costGold;
  const canUnlock = !skill.unlocked && meetsLevel && meetsAttr && hasPoints && hasGold;

  const handleUnlock = () => {
    if (canUnlock) {
      unlockSkill(skill.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          className="relative max-w-md w-full p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#151b2a] via-[#0f1422] to-[#0a0d15] border border-cyan-500/50 shadow-glow-cyan overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Close icon */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Skill Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-2xl p-1 flex items-center justify-center text-3xl shadow-lg border ${
              skill.unlocked
                ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 border-amber-400 shadow-glow-gold'
                : 'bg-slate-900 border-slate-700 text-slate-500'
            }`}>
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                {skill.icon}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-rpg font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Tier {skill.tier} • {skill.branch}
                </span>
                {skill.unlocked && (
                  <span className="text-[10px] font-mono-rpg font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Mastered
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold font-rpg text-slate-100 mt-1">
                {skill.title}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {skill.description}
          </p>

          {/* Perk Box */}
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 mb-5">
            <span className="text-[10px] font-mono-rpg uppercase text-cyan-400 font-bold block mb-0.5">
              Active Passive Perk:
            </span>
            <p className="text-xs font-semibold text-cyan-200">
              ⚡ {skill.perk}
            </p>
          </div>

          {/* Requirements Checklist */}
          <div className="space-y-2 mb-6 text-xs font-mono-rpg">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Required Hero Level:</span>
              <span className={`font-bold ${meetsLevel ? 'text-emerald-400' : 'text-rose-400'}`}>
                Level {skill.requiredLevel} (Current: {player.level})
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Required {skill.requiredAttribute.type}:</span>
              <span className={`font-bold ${meetsAttr ? 'text-emerald-400' : 'text-rose-400'}`}>
                {skill.requiredAttribute.value} PTS (Current: {currentAttrVal})
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Attribute Points Cost:</span>
              <span className={`font-bold ${hasPoints ? 'text-emerald-400' : 'text-amber-400'}`}>
                {skill.costAttributePoints} Points (Available: {player.attributePoints})
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Guild Gold Cost:</span>
              <span className={`font-bold ${hasGold ? 'text-emerald-400' : 'text-amber-400'}`}>
                {skill.costGold} Gold (Available: {player.gold})
              </span>
            </div>
          </div>

          {/* Action button */}
          {skill.unlocked ? (
            <div className="w-full py-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-black font-rpg uppercase tracking-wider flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>Skill Mastered</span>
            </div>
          ) : (
            <button
              onClick={handleUnlock}
              disabled={!canUnlock}
              className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                canUnlock
                  ? 'rpg-button-gold shadow-glow-gold'
                  : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {canUnlock ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Unlock Skill Node</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Prerequisites Not Met</span>
                </>
              )}
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
