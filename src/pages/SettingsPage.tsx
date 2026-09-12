import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Volume2,
  VolumeX,
  Sparkles,
  Palette,
  Bell,
  Trash2,
  RefreshCw,
  LogOut,
  Check
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useGame();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleLogout = () => {
    authService.logout();
    showToast('Logged out of character profile.', 'info');
    navigate('/login');
  };

  const handleConfirmReset = () => {
    resetAllData();
    setShowConfirmReset(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono-rpg text-slate-400 uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" />
          <span>System Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-rpg text-slate-100">
          Settings & Preferences
        </h1>
      </div>

      {/* Preferences Section: Audio & Animations */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Volume2 className="w-5 h-5 text-rpg-gold" />
          <h3 className="text-base font-bold font-rpg text-slate-100">
            Audio & SFX Preferences
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Synthesized Sound Effects</h4>
            <p className="text-xs text-slate-400">
              Chimes and fanfares for quest completion, leveling up, and gold transactions.
            </p>
          </div>
          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
              settings.soundEnabled ? 'bg-rpg-gold' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-slate-950 transform transition-transform duration-200 flex items-center justify-center ${
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-rpg-gold" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              )}
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Smooth Fluid Animations</h4>
            <p className="text-xs text-slate-400">
              Framer Motion transitions, progress easing, and particle effects.
            </p>
          </div>
          <button
            onClick={() => updateSettings({ animationsEnabled: !settings.animationsEnabled })}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
              settings.animationsEnabled ? 'bg-rpg-cyan' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-slate-950 transform transition-transform duration-200 flex items-center justify-center ${
                settings.animationsEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-rpg-cyan" />
            </div>
          </button>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Palette className="w-5 h-5 text-rpg-cyan" />
          <h3 className="text-base font-bold font-rpg text-slate-100">
            Interface Theme & Appearance
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'dark-obsidian', name: 'Dark Obsidian', color: 'from-amber-500 to-yellow-600' },
            { id: 'cyber-neon', name: 'Cyber Neon', color: 'from-cyan-500 to-blue-600' },
            { id: 'royal-gold', name: 'Royal Gold', color: 'from-yellow-400 to-amber-600' }
          ].map(t => {
            const isSelected = settings.theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => updateSettings({ theme: t.id as any })}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'glass-panel-glow border-rpg-gold shadow-glow-gold'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${t.color} mb-3`} />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold font-rpg text-slate-200">{t.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-rpg-gold" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications Preferences */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Bell className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-bold font-rpg text-slate-100">
            Notification Alerts
          </h3>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Daily Quest Reminders</h4>
            <p className="text-xs text-slate-400">Receive alerts about uncompleted daily missions.</p>
          </div>
          <input
            type="checkbox"
            checked={settings.questReminders}
            onChange={e => updateSettings({ questReminders: e.target.checked })}
            className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-rpg-cyan focus:ring-rpg-cyan cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between py-2 border-t border-slate-800/60">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Streak Shield Reminders</h4>
            <p className="text-xs text-slate-400">Alerts to maintain your active streak before midnight.</p>
          </div>
          <input
            type="checkbox"
            checked={settings.streakAlerts}
            onChange={e => updateSettings({ streakAlerts: e.target.checked })}
            className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-rpg-cyan focus:ring-rpg-cyan cursor-pointer"
          />
        </div>
      </div>

      {/* Account & Data Management */}
      <div className="p-6 rounded-3xl glass-panel border border-rose-950/40 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Trash2 className="w-5 h-5 text-rose-400" />
          <h3 className="text-base font-bold font-rpg text-rose-300">
            Account & Data Reset
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Reset Demo Game Data</h4>
            <p className="text-xs text-slate-400">
              Restores player Alex, sample quests, shop inventory, and achievements to default demo state.
            </p>
          </div>

          {showConfirmReset ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold uppercase shadow-glow-crimson"
              >
                Confirm Reset
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-rose-500/60 text-rose-400 text-xs font-bold transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-800/60">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Sign Out of Realm</h4>
            <p className="text-xs text-slate-400">Disconnect your local session and return to portal.</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-700/60 text-slate-300 hover:text-rose-300 text-xs font-bold transition-colors flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
