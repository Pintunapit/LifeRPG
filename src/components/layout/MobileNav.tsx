import React from 'react';
import { NavLink } from 'react-router-dom';
import { Swords, Scroll, Map, User, MoreHorizontal } from 'lucide-react';

interface MobileNavProps {
  onOpenFullMenu: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenFullMenu }) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 glass-panel bg-rpg-card/95 border-t border-slate-800 px-2 py-1.5 backdrop-blur-xl">
      <div className="flex items-center justify-around">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold font-mono-rpg transition-colors ${
              isActive ? 'text-rpg-gold' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <Swords className="w-5 h-5" />
          <span>Hub</span>
        </NavLink>

        <NavLink
          to="/quests"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold font-mono-rpg transition-colors ${
              isActive ? 'text-rpg-gold' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <Scroll className="w-5 h-5" />
          <span>Quests</span>
        </NavLink>

        <NavLink
          to="/world"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold font-mono-rpg transition-colors ${
              isActive ? 'text-rpg-gold' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <Map className="w-5 h-5" />
          <span>World</span>
        </NavLink>

        <NavLink
          to="/character"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold font-mono-rpg transition-colors ${
              isActive ? 'text-rpg-gold' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span>Hero</span>
        </NavLink>

        <button
          onClick={onOpenFullMenu}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold font-mono-rpg text-slate-400 hover:text-slate-200 transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span>Menu</span>
        </button>
      </div>
    </div>
  );
};
