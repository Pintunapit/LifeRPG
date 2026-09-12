import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ShopItemCard } from '../components/cards/ShopItemCard';
import { ShopCategory, ShopItem } from '../types';
import { Store, Coins, Sparkles, Shield, ArrowRight, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES: ('All' | 'Avatars' | 'Themes' | 'Titles' | 'Badges' | 'Power-ups')[] = [
  'All',
  'Avatars',
  'Themes',
  'Titles',
  'Badges',
  'Power-ups'
];

export const RewardsPage: React.FC = () => {
  const { player, shopItems, equipInventoryItem } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [acquiredItem, setAcquiredItem] = useState<ShopItem | null>(null);

  const filteredItems = shopItems.filter(item => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const handleItemPurchased = (item: ShopItem) => {
    setAcquiredItem(item);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 🏰 Guild Rewards Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel-glow border border-amber-500/40 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-glow-gold">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-rpg text-rpg-gold uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" />
            <span>Guild Merchant Treasury</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-rpg text-slate-100 flex items-center gap-2">
            <span>🏰</span> GUILD REWARDS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md">
            Exchange gold earned from conquering life quests for prestigious titles, custom avatars, themes, and power boosters.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/95 border border-amber-500/40 shadow-xl flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-2xl">
              💰
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono-rpg block">
                Treasury Gold
              </span>
              <span className="text-2xl font-black font-mono-rpg text-amber-400">
                {player.gold.toLocaleString()} <span className="text-xs font-normal">GOLD</span>
              </span>
            </div>
          </div>

          <Link
            to="/inventory"
            className="hidden lg:flex px-4 py-3.5 rounded-xl rpg-button-cyan text-xs font-bold uppercase tracking-wider items-center gap-2 shadow-glow-cyan"
          >
            <Shield className="w-4 h-4" />
            <span>Character Armory</span>
          </Link>
        </div>
      </div>

      {/* Category Tabs: AVATARS, THEMES, BADGES, TITLES, BOOSTERS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-rpg tracking-wide transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-rpg-gold to-amber-500 text-rpg-dark font-black shadow-glow-gold'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {category === 'Power-ups' ? 'BOOSTERS' : category.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Shop Items Catalog */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map(item => (
          <ShopItemCard
            key={item.id}
            item={item}
            onPurchased={handleItemPurchased}
          />
        ))}
      </div>

      {/* ITEM ACQUIRED MODAL */}
      <AnimatePresence>
        {acquiredItem && (
          <div
            onClick={() => setAcquiredItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              className="relative max-w-sm w-full p-6 rounded-3xl bg-slate-900 border-2 border-amber-400/80 shadow-glow-gold text-center overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <span className="text-[10px] font-mono-rpg font-extrabold uppercase tracking-widest text-rpg-gold block mb-1">
                Guild Acquisition
              </span>
              <h3 className="text-2xl font-black font-rpg text-slate-100 mb-2">
                ITEM ACQUIRED!
              </h3>

              <div className="w-20 h-20 mx-auto my-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-5xl shadow-glow-gold">
                {acquiredItem.icon}
              </div>

              <p className="text-base font-bold font-rpg text-amber-300 mb-2">
                ✨ {acquiredItem.name} ✨
              </p>
              <p className="text-xs text-slate-400 mb-6">
                {acquiredItem.description}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    equipInventoryItem(acquiredItem.id);
                    setAcquiredItem(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl rpg-button-gold text-xs font-black uppercase tracking-wider shadow-glow-gold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>EQUIP NOW</span>
                </button>
                <button
                  onClick={() => setAcquiredItem(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
