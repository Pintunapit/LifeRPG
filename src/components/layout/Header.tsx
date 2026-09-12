import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { XPBar } from '../ui/XPBar';
import {
  Flame,
  Coins,
  Bell,
  Volume2,
  VolumeX,
  Menu,
  CheckCheck,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const { player, notifications, markNotificationsAsRead, settings, updateSettings } = useGame();
  const [showNotifs, setShowNotifs] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-800/80 px-4 sm:px-6 py-3 transition-all backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile hamburger & Character Quick Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/character" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-rpg-gold to-yellow-300 p-0.5 shadow-glow-gold">
                <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                  {player.avatar || '⚔️'}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-rpg-dark font-black text-[10px] font-mono-rpg px-1.5 py-0.2 rounded-full border border-slate-950">
                L{player.level}
              </span>
            </div>

            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-100 group-hover:text-rpg-gold transition-colors font-rpg">
                  {player.name}
                </span>
                <span className="text-[10px] font-mono-rpg text-amber-400/90 font-medium px-1.5 py-0.2 bg-amber-500/10 rounded border border-amber-500/20">
                  {player.title}
                </span>
              </div>
              <div className="w-36 lg:w-44 mt-0.5">
                <XPBar currentXP={player.currentXP} level={player.level} showLabels={false} compact />
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Live Stats Badges (Streak & Gold) */}
        <div className="flex items-center gap-2 sm:gap-4 font-mono-rpg">
          {/* Streak */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 text-amber-400 text-xs sm:text-sm font-bold shadow-sm"
            title={`${player.streak} day streak! Complete at least one quest daily.`}
          >
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
            <span>{player.streak}</span>
            <span className="hidden md:inline text-xs text-orange-300 font-semibold">Streak</span>
          </div>

          {/* Gold */}
          <Link
            to="/rewards"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500/10 to-cyan-500/10 border border-cyan-500/30 text-sky-400 text-xs sm:text-sm font-bold hover:border-cyan-400 transition-colors shadow-sm"
            title="Guild Treasury Gold"
          >
            <Coins className="w-4 h-4 text-rpg-gold fill-rpg-gold" />
            <span>{player.gold.toLocaleString()}</span>
            <span className="hidden md:inline text-xs text-slate-400 font-normal">Gold</span>
          </Link>
        </div>

        {/* Right: Sound toggle & Notification dropdown */}
        <div className="flex items-center gap-2 relative" ref={dropdownRef}>
          {/* Audio toggle */}
          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`p-2 rounded-xl border transition-colors ${
              settings.soundEnabled
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                : 'bg-slate-900/60 border-slate-800/60 text-slate-500 hover:text-slate-400'
            }`}
            title={settings.soundEnabled ? 'Mute Game SFX' : 'Enable Game SFX'}
            aria-label={settings.soundEnabled ? 'Mute Game SFX' : 'Enable Game SFX'}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-rpg-cyan" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Notifications bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(prev => !prev)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white relative transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rpg-crimson text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel border border-slate-700 bg-rpg-card/95 shadow-2xl p-4 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold font-rpg tracking-wider text-slate-200 uppercase flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-rpg-gold" /> Guild Herald Logs
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markNotificationsAsRead}
                      className="text-[11px] text-rpg-cyan hover:underline flex items-center gap-1 font-semibold"
                    >
                      <CheckCheck className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 my-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">No herald notices</p>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        className={`py-2.5 px-2 rounded-lg transition-colors ${
                          !notif.read ? 'bg-slate-900/60' : 'hover:bg-slate-900/30'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h5 className="text-xs font-bold text-slate-200">{notif.title}</h5>
                          <span className="text-[10px] text-slate-500 font-mono-rpg">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-snug">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 text-center">
                  <Link
                    to="/quests"
                    onClick={() => setShowNotifs(false)}
                    className="text-xs text-rpg-gold hover:underline font-bold inline-flex items-center gap-1"
                  >
                    View Active Quests <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
