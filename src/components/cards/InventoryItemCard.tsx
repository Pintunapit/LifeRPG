import React from 'react';
import { motion } from 'framer-motion';
import { InventoryItem } from '../../types';
import { useGame } from '../../context/GameContext';
import { Check, Shield } from 'lucide-react';

interface InventoryItemCardProps {
  item: InventoryItem;
}

export const InventoryItemCard: React.FC<InventoryItemCardProps> = ({ item }) => {
  const { equipInventoryItem, unequipInventoryItem } = useGame();

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
        item.isEquipped
          ? 'glass-panel-cyan border-rpg-cyan/50 shadow-glow-cyan'
          : 'glass-panel border-slate-800'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl">
            {item.icon}
          </div>
          <span className="text-[11px] font-mono-rpg font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700 uppercase">
            {item.category}
          </span>
        </div>

        <h4 className="text-base font-bold font-rpg text-slate-100 mb-1">
          {item.name}
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          {item.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        {item.isEquipped ? (
          <div className="flex items-center gap-1.5 text-rpg-cyan font-bold text-xs font-rpg">
            <Check className="w-4 h-4 text-rpg-cyan" />
            <span>Equipped</span>
          </div>
        ) : (
          <span className="text-xs text-slate-500">In Armory</span>
        )}

        {item.isEquipped ? (
          <button
            onClick={() => unequipInventoryItem(item.id)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            Unequip
          </button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => equipInventoryItem(item.id)}
            className="px-4 py-1.5 rounded-xl rpg-button-cyan text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-glow-cyan"
          >
            <Shield className="w-3.5 h-3.5" />
            Equip
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
