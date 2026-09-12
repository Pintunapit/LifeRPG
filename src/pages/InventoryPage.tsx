import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { InventoryItemCard } from '../components/cards/InventoryItemCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Briefcase, Store, ShieldCheck, Swords, Shield, Award, Palette, UserCheck, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SECTIONS = [
  'ALL',
  'AVATARS',
  'TITLES',
  'BADGES',
  'THEMES',
  'WEAPONS',
  'ARMOR'
];

export const InventoryPage: React.FC = () => {
  const { player, inventory } = useGame();
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const navigate = useNavigate();

  // Filter inventory
  const filteredInventory = inventory.filter(item => {
    if (selectedSection === 'ALL') return true;
    if (selectedSection === 'AVATARS') return item.category === 'Avatars';
    if (selectedSection === 'THEMES') return item.category === 'Themes';
    if (selectedSection === 'TITLES') return item.category === 'Titles';
    if (selectedSection === 'BADGES') return item.category === 'Badges';
    if (selectedSection === 'WEAPONS' || selectedSection === 'ARMOR') return false;
    return true;
  });

  const equippedCount = inventory.filter(i => i.isEquipped).length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-rpg text-rpg-cyan uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4 text-rpg-cyan" />
            <span>Character Equipment Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-rpg text-slate-100">
            Inventory & Armory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your battle gear, active titles, and cosmetic enhancements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono-rpg font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-rpg-cyan" />
            <span>{equippedCount} Gear Equipped</span>
          </div>

          <Link
            to="/rewards"
            className="px-4 py-2 rounded-xl rpg-button-gold text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-glow-gold"
          >
            <Store className="w-4 h-4" />
            <span>Guild Shop</span>
          </Link>
        </div>
      </div>

      {/* ================================================== */}
      {/* CHARACTER EQUIPMENT SCREEN (Section 19)           */}
      {/* ================================================== */}
      <div className="p-6 sm:p-7 rounded-3xl glass-panel-cyan relative overflow-hidden border border-cyan-500/30">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-rpg-cyan" />
          <h3 className="text-base font-bold font-rpg text-slate-100 uppercase tracking-wider">
            Active Character Loadout
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Slot 1: Equipped Avatar */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1.5">
            <span className="text-[10px] font-mono-rpg uppercase text-slate-400 font-semibold block">
              Equipped Avatar
            </span>
            <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shadow-glow-gold">
              {player.avatar || '⚔️'}
            </div>
            <span className="text-xs font-bold font-rpg text-slate-200 block truncate">
              Hero Visage
            </span>
          </div>

          {/* Slot 2: Equipped Title */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1.5">
            <span className="text-[10px] font-mono-rpg uppercase text-slate-400 font-semibold block">
              Equipped Title
            </span>
            <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl">
              🏷️
            </div>
            <span className="text-xs font-bold font-rpg text-purple-300 block truncate">
              {player.title || 'Code Warrior'}
            </span>
          </div>

          {/* Slot 3: Equipped Badge */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1.5">
            <span className="text-[10px] font-mono-rpg uppercase text-slate-400 font-semibold block">
              Equipped Badge
            </span>
            <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl">
              🏆
            </div>
            <span className="text-xs font-bold font-rpg text-cyan-300 block truncate">
              {player.equippedBadge || 'Quest Master'}
            </span>
          </div>

          {/* Slot 4: Equipped Theme */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1.5">
            <span className="text-[10px] font-mono-rpg uppercase text-slate-400 font-semibold block">
              Equipped Theme
            </span>
            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl">
              🎨
            </div>
            <span className="text-xs font-bold font-rpg text-emerald-300 block truncate">
              Dark Obsidian
            </span>
          </div>

          {/* Slot 5: Weapon */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1.5">
            <span className="text-[10px] font-mono-rpg uppercase text-slate-400 font-semibold block">
              Primary Weapon
            </span>
            <div className="w-12 h-12 mx-auto rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-2xl">
              ⚔️
            </div>
            <span className="text-xs font-bold font-rpg text-rose-300 block truncate">
              Compiler Blade
            </span>
          </div>

          {/* Slot 6: Armor */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1.5">
            <span className="text-[10px] font-mono-rpg uppercase text-slate-400 font-semibold block">
              Discipline Armor
            </span>
            <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
              🛡️
            </div>
            <span className="text-xs font-bold font-rpg text-amber-300 block truncate">
              7-Day Aegis
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs: WEAPONS, ARMOR, AVATARS, BADGES, THEMES, TITLES */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {SECTIONS.map(section => (
          <button
            key={section}
            onClick={() => setSelectedSection(section)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-rpg tracking-wide transition-all whitespace-nowrap cursor-pointer ${
              selectedSection === section
                ? 'bg-gradient-to-r from-rpg-cyan to-blue-500 text-rpg-dark font-black shadow-glow-cyan'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Special Weapons & Armor Lore View if chosen */}
      {(selectedSection === 'WEAPONS' || selectedSection === 'ARMOR') && (
        <div className="p-8 rounded-3xl glass-panel border border-slate-800 text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl">
            {selectedSection === 'WEAPONS' ? '⚔️' : '🛡️'}
          </div>
          <h3 className="text-xl font-bold font-rpg text-slate-100">
            {selectedSection === 'WEAPONS' ? 'Productivity Arsenal' : 'Habit Defense Aegis'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your weapons represent your tools of creation (IDEs, writing desks, barbell racks), while your armor is forged through unbroken consistency and daily discipline.
          </p>
        </div>
      )}

      {/* Inventory Grid or Empty State */}
      {selectedSection !== 'WEAPONS' && selectedSection !== 'ARMOR' && (
        filteredInventory.length === 0 ? (
          <EmptyState
            title="Armory Is Empty"
            description="You do not possess any items in this category yet. Acquire gear, custom avatars, and prestigious titles in the Guild Shop."
            actionLabel="Visit Guild Shop"
            onAction={() => navigate('/rewards')}
            icon={<Briefcase className="w-8 h-8 text-rpg-cyan" />}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredInventory.map(item => (
              <InventoryItemCard key={item.id} item={item} />
            ))}
          </div>
        )
      )}
    </div>
  );
};
