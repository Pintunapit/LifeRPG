import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import {
  UserCircle,
  Edit3,
  Check,
  Calendar,
  Mail,
  Shield,
  Trophy,
  Flame,
  Coins,
  Sparkles
} from 'lucide-react';

const AVATAR_OPTIONS = ['⚔️', '🤖', '🥷', '🧙‍♂️', '🛡️', '⚡', '🦅', '🐉', '🏹'];

export const ProfilePage: React.FC = () => {
  const { player, updateProfile, achievements, quests } = useGame();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(player.name);
  const [bio, setBio] = useState(player.bio);
  const [selectedAvatar, setSelectedAvatar] = useState(player.avatar);

  const completedCount = quests.filter(q => q.completed).length;
  const unlockedAchievementsCount = achievements.filter(a => a.unlocked).length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || player.name,
      bio: bio.trim() || player.bio,
      avatar: selectedAvatar
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-rpg text-rpg-gold uppercase tracking-wider mb-1">
            <UserCircle className="w-4 h-4" />
            <span>Heroic Dossier</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-rpg text-slate-100">
            Player Profile
          </h1>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Edit3 className="w-4 h-4 text-rpg-cyan" />
          <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Main Profile Card / Edit Form */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel-glow border border-slate-700/80 relative overflow-hidden">
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-5 max-w-xl">
            <h3 className="text-lg font-bold font-rpg text-slate-100">
              Edit Character Details
            </h3>

            {/* Avatar selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Choose Hero Avatar
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                {AVATAR_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedAvatar(emoji)}
                    className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center border transition-all ${
                      selectedAvatar === emoji
                        ? 'bg-amber-500/20 border-rpg-gold shadow-glow-gold scale-110'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Character Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-rpg-gold focus:outline-none text-slate-100 text-sm font-mono-rpg"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Character Bio / Manifesto
              </label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-rpg-gold focus:outline-none text-slate-100 text-sm resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl rpg-button-gold text-xs font-bold uppercase tracking-wider shadow-glow-gold flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-950 border-2 border-rpg-gold/70 shadow-glow-gold flex items-center justify-center text-5xl sm:text-6xl shrink-0">
              {player.avatar || '⚔️'}
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-black font-rpg text-slate-100">
                  {player.name}
                </h2>
                <span className="px-3 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono-rpg font-semibold">
                  {player.title}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono-rpg">
                  Level {player.level}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                {player.bio}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-3 text-xs font-mono-rpg text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {player.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Joined {player.joinedDate}
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Shield className="w-3.5 h-3.5" />
                  {player.equippedBadge || '🏆 Quest Master'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Career Milestones Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 text-center">
          <Trophy className="w-6 h-6 text-rpg-gold mx-auto mb-2" />
          <span className="text-xs text-slate-400 uppercase font-mono-rpg block">
            Achievements
          </span>
          <span className="text-2xl font-black font-mono-rpg text-slate-100">
            {unlockedAchievementsCount} / {achievements.length}
          </span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 text-center">
          <Sparkles className="w-6 h-6 text-rpg-cyan mx-auto mb-2" />
          <span className="text-xs text-slate-400 uppercase font-mono-rpg block">
            Quests Conquered
          </span>
          <span className="text-2xl font-black font-mono-rpg text-slate-100">
            {completedCount}
          </span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 text-center">
          <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <span className="text-xs text-slate-400 uppercase font-mono-rpg block">
            Peak Streak
          </span>
          <span className="text-2xl font-black font-mono-rpg text-slate-100">
            {player.longestStreak} Days
          </span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 text-center">
          <Coins className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <span className="text-xs text-slate-400 uppercase font-mono-rpg block">
            Treasury Balance
          </span>
          <span className="text-2xl font-black font-mono-rpg text-sky-400">
            {player.gold.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
