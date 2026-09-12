import React from 'react';
import { motion } from 'framer-motion';
import { ShopItem } from '../../types';
import { useGame } from '../../context/GameContext';
import { Coins, Check, Sparkles } from 'lucide-react';

interface ShopItemCardProps {
  item: ShopItem;
  onPurchased?: (item: ShopItem) => void;
}

export const ShopItemCard: React.FC<ShopItemCardProps> = ({ item, onPurchased }) => {
  const { player, inventory, buyShopItem } = useGame();

  const isOwned = inventory.some(inv => inv.id === item.id);
  const canAfford = player.gold >= item.price;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="p-5 rounded-2xl glass-panel border border-slate-700/60 hover:border-slate-600 shadow-xl flex flex-col justify-between transition-all"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl shadow-inner">
            {item.icon}
          </div>
          <span className="text-[11px] font-mono-rpg font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700 uppercase">
            {item.category}
          </span>
        </div>

        <h4 className="text-base font-bold font-rpg text-slate-100 mb-1">
          {item.name}
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">
          {item.description}
        </p>

        {item.buffDescription && (
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-950/40 border border-emerald-600/30 text-emerald-400 text-xs font-mono-rpg mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{item.buffDescription}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 font-mono-rpg font-extrabold text-sky-400">
          <Coins className="w-4 h-4 text-rpg-gold" />
          <span>{item.price.toLocaleString()}</span>
          <span className="text-xs text-slate-400 font-normal">Gold</span>
        </div>

        {isOwned ? (
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Owned</span>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (buyShopItem(item.id)) onPurchased?.(item);
            }}
            disabled={!canAfford}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              canAfford
                ? 'rpg-button-gold shadow-glow-gold'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            Buy Item
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
