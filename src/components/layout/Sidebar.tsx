import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Swords,
  Scroll,
  Map,
  User,
  Network,
  Trophy,
  Store,
  Briefcase,
  BarChart3,
  UserCircle,
  Settings,
  LogOut,
  X,
  Sparkles
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: Swords },
  { name: 'Quests', path: '/quests', icon: Scroll },
  { name: 'World', path: '/world', icon: Map },
  { name: 'Character', path: '/character', icon: User },
  { name: 'Skill Tree', path: '/skills', icon: Network },
  { name: 'Achievements', path: '/achievements', icon: Trophy },
  { name: 'Rewards', path: '/rewards', icon: Store },
  { name: 'Inventory', path: '/inventory', icon: Briefcase },
  { name: 'Statistics', path: '/statistics', icon: BarChart3 },
  { name: 'Profile', path: '/profile', icon: UserCircle },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { player } = useGame();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    authService.logout();
    showToast('Logged out of realm.', 'info');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 glass-panel bg-rpg-card/95 border-r border-slate-800/90 z-45 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
            <NavLink
              to="/dashboard"
              onClick={onClose}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-rpg-gold to-yellow-300 p-0.5 shadow-glow-gold">
                <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center text-rpg-gold group-hover:scale-105 transition-transform">
                  <Swords className="w-5 h-5 text-rpg-gold" />
                </div>
              </div>
              <div>
                <span className="text-lg font-black font-rpg tracking-wider text-slate-100 flex items-center gap-1">
                  LIFE <span className="text-rpg-gold">RPG</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono-rpg tracking-wider uppercase block -mt-1">
                  Level Up Reality
                </span>
              </div>
            </NavLink>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm tracking-wide transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-rpg-gold/15 to-transparent text-rpg-gold font-bold border-l-4 border-rpg-gold shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Snippet & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-base shrink-0">
                {player.avatar || '⚔️'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate font-rpg">{player.name}</p>
                <p className="text-[11px] text-amber-400 font-mono-rpg truncate">
                  Lvl {player.level} • {player.title}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/60 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave Realm</span>
          </button>
        </div>
      </aside>
    </>
  );
};
