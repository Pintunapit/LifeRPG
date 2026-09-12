import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Swords,
  Sparkles,
  Flame,
  Shield,
  Trophy,
  Store,
  CheckCircle2,
  ArrowRight,
  Zap,
  Star,
  Coins,
  Brain
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/soundEffects';

export const LandingPage: React.FC = () => {
  // Interactive preview card state
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [demoXp, setDemoXp] = useState(850);
  const [demoLevel, setDemoLevel] = useState(4);

  const handleDemoComplete = () => {
    if (demoCompleted) return;
    setDemoCompleted(true);
    soundFx.playQuestComplete();
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // Fallback
    }

    const nextXp = demoXp + 150;
    setDemoXp(nextXp);
    if (nextXp >= 1000) {
      setDemoLevel(5);
      soundFx.playLevelUp();
    }
  };

  return (
    <div className="min-h-screen bg-rpg-dark text-slate-100 flex flex-col selection:bg-rpg-cyan/30">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 glass-panel sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-rpg-gold to-yellow-300 p-0.5 shadow-glow-gold">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <Swords className="w-5 h-5 text-rpg-gold" />
              </div>
            </div>
            <span className="text-xl font-black font-rpg tracking-wider text-slate-100">
              LIFE <span className="text-rpg-gold">RPG</span>
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 sm:px-5 py-2 rounded-xl text-sm font-bold rpg-button-gold shadow-glow-gold flex items-center gap-1.5"
            >
              <span>Start Journey</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Glow backdrop blobs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-10 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-amber-400 text-xs font-mono-rpg font-semibold uppercase tracking-widest mb-6 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-rpg-gold" />
              The Next Evolution of Habit & Task Progression
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black font-rpg tracking-tight text-slate-100 leading-tight mb-6"
            >
              Turn Your Real Life Into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rpg-gold to-yellow-400">Game.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8"
            >
              Complete quests. Earn XP. Build streaks. Level up your life. Experience productivity where discipline feels like conquering legendary RPG dungeons.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                to="/signup"
                className="px-8 py-3.5 rounded-xl text-base font-extrabold rpg-button-gold shadow-glow-gold flex items-center gap-2"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-3.5 rounded-xl text-base font-bold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2"
              >
                <span>Live Interactive Demo</span>
                <Zap className="w-4 h-4 text-rpg-cyan" />
              </Link>
            </motion.div>
          </div>

          {/* Interactive RPG Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-4xl mx-auto rounded-3xl glass-panel border border-slate-700/80 shadow-2xl p-6 sm:p-8 relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl">
                  ⚔️
                </div>
                <div>
                  <h3 className="font-black font-rpg text-slate-100 text-base">Warrior Alex</h3>
                  <div className="flex items-center gap-2 text-xs font-mono-rpg text-amber-400">
                    <span>LEVEL {demoLevel}</span>
                    <span>•</span>
                    <span>{demoXp} / 1,000 XP</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono-rpg">
                <div className="flex items-center gap-1 text-xs text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/20">
                  <Flame className="w-3.5 h-3.5" /> 7 Day Streak
                </div>
                <div className="flex items-center gap-1 text-xs text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
                  <Coins className="w-3.5 h-3.5 text-rpg-gold" /> 1,250 Gold
                </div>
              </div>
            </div>

            {/* Interactive sample quest card */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-rpg font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                    Coding • Hard
                  </span>
                  <span className="text-xs text-slate-400">Due Today</span>
                </div>
                <h4 className="text-lg font-bold font-rpg text-slate-100">
                  ⚔️ Master Java Arrays & Streams
                </h4>
                <p className="text-xs text-slate-400">
                  Solve 3 algorithmic challenges to unlock memory optimization secrets.
                </p>
                <div className="flex items-center gap-3 text-xs font-mono-rpg pt-1">
                  <span className="text-amber-400 font-bold">+150 XP</span>
                  <span className="text-sky-400 font-bold">+50 Gold</span>
                  <span className="text-emerald-400 font-semibold">+5 INTELLECT</span>
                </div>
              </div>

              <button
                onClick={handleDemoComplete}
                disabled={demoCompleted}
                className={`px-6 py-3 rounded-xl font-mono-rpg font-extrabold text-xs uppercase tracking-wider transition-all shrink-0 ${
                  demoCompleted
                    ? 'bg-emerald-950/70 border border-emerald-500/60 text-emerald-400 cursor-default flex items-center gap-1.5'
                    : 'rpg-button-gold shadow-glow-gold hover:scale-105 active:scale-95 cursor-pointer'
                }`}
              >
                {demoCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Completed!
                  </>
                ) : (
                  'Click to Test Complete'
                )}
              </button>
            </div>
            <p className="text-center text-xs text-slate-500 mt-4 italic font-mono-rpg">
              Interactive preview: Click &quot;Test Complete&quot; above to experience instant audio, confetti, and XP gains!
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono-rpg font-bold tracking-widest text-rpg-cyan uppercase">
              The Path of Progression
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-rpg text-slate-100 mt-2">
              How It Works
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Transforming everyday obligations into an addictive RPG leveling loop.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Create Quest',
                desc: 'Assign real tasks with category, difficulty, and attribute tags.',
                icon: Swords
              },
              {
                step: '02',
                title: 'Complete Quest',
                desc: 'Finish work in the real world and mark the quest complete.',
                icon: CheckCircle2
              },
              {
                step: '03',
                title: 'Earn XP',
                desc: 'Collect XP, virtual Gold, and targeted attribute boosts.',
                icon: Sparkles
              },
              {
                step: '04',
                title: 'Level Up',
                desc: 'Ascend player levels and unlock free attribute points.',
                icon: Trophy
              },
              {
                step: '05',
                title: 'Unlock Rewards',
                desc: 'Spend Gold in the Guild Shop on avatars, themes, and gear.',
                icon: Store
              }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl glass-panel border border-slate-800 relative hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black font-mono-rpg text-slate-600">
                        {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-rpg-gold">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold font-rpg text-slate-100 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono-rpg font-bold tracking-widest text-rpg-gold uppercase">
              Arsenal of Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-rpg text-slate-100 mt-2">
              Everything You Need to Slay Procrastination
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Quest System',
                desc: 'Daily tasks and weekly epics with Easy to Epic difficulty ratings, reward multipliers, and customizable deadlines.',
                icon: Swords,
                color: 'text-amber-400'
              },
              {
                title: 'XP & Leveling Curve',
                desc: 'Non-linear leveling formula where ascending each level triggers celebratory modals, particle bursts, and stat bonuses.',
                icon: Sparkles,
                color: 'text-sky-400'
              },
              {
                title: 'Character Attributes',
                desc: 'Gain Strength from workouts, Intellect from coding, Discipline from meditation, Creativity from projects, and Health from habits.',
                icon: Brain,
                color: 'text-purple-400'
              },
              {
                title: 'Streak Multipliers',
                desc: 'Build unbroken streaks with weekly calendar tracking and unlock legendary discipline milestones at 3, 7, and 30 days.',
                icon: Flame,
                color: 'text-orange-400'
              },
              {
                title: 'Guild Shop & Armory',
                desc: 'Earn virtual Gold and buy cyberpunk avatars, dark knight themes, and title badges to equip on your character.',
                icon: Store,
                color: 'text-emerald-400'
              },
              {
                title: 'Heroic Achievements',
                desc: 'Over 8 unlockable badges with real-time progression tracking to honor your career and personal milestones.',
                icon: Trophy,
                color: 'text-yellow-400'
              }
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-slate-700/80 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${f.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-rpg text-slate-100 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 border-t border-slate-800/80 bg-gradient-to-b from-slate-950/60 to-rpg-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rpg-gold/10 border border-rpg-gold/30 text-rpg-gold flex items-center justify-center mx-auto mb-6 shadow-glow-gold">
            <Star className="w-8 h-8 text-rpg-gold" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-rpg text-slate-100 mb-4">
            Ready to level up your life?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Stop letting everyday tasks vanish into void checklists. Step into the arena, claim your title, and level up today.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-extrabold rpg-button-gold shadow-glow-gold"
          >
            <span>Start Playing</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500 font-mono-rpg">
        <p>LIFE RPG &copy; {new Date().getFullYear()} — Gamified Personal Productivity</p>
      </footer>
    </div>
  );
};
