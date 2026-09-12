# LIFE RPG ⚔️ — Level Up Your Real Life

A complete, modern, dark-fantasy RPG frontend web application that turns real-life tasks and daily productivity into an immersive game experience.

---

## 🌟 Key Features

### ⚔️ Quests & Task Log
- **Multi-Category Missions**: Coding, Study, Fitness, Reading, Personal, Health.
- **Difficulty Rating**: Easy, Medium, Hard, and Epic with custom reward scaling.
- **Immediate Sensory Feedback**: Non-blocking completion animations, canvas-confetti bursts, floating `+XP`, `+Gold`, and `+Attribute` markers, plus procedural sound synthesizer effects.
- **Custom Quest Creation**: Forge custom quests with custom categories, rewards, and deadlines stored persistently in `localStorage`.

### ⚡ Non-Linear XP & Leveling Engine
- Realistic RPG progression curve ($Level\ 1 \rightarrow 100\text{ XP}$, $Level\ 2 \rightarrow 250\text{ XP}$, $Level\ 12 \approx 3000\text{ XP}$).
- **Level Up Fanfare**: Celebratory modal with chord fanfare, particle fireworks, and unassigned **+5 Attribute Points** per level.

### 🛡️ 6 Core Attributes
- **Strength**: Powered by workouts and cardio.
- **Intellect**: Powered by coding and algorithms.
- **Discipline**: Powered by meditation and morning habits.
- **Creativity**: Powered by project development and design.
- **Health**: Powered by hydration and nutrition.
- **Focus**: Powered by deep work and Pomodoros.
- Level-up points can be manually allocated to boost any stat.

### 🔥 7-Day Streak & Habit Calendar
- Active streak tracking with milestone messages (*"Week Warrior!"*, *"Legendary Discipline!"*).
- 7-day visual calendar status (Mon → Sun).

### 💰 Guild Shop & Armory Inventory
- Earn virtual Gold and spend it on:
  - **Avatars**: Cyber Warrior, Shadow Assassin, Grand Archmage.
  - **Themes**: Dark Obsidian, Cyber Neon, Royal Gold.
  - **Titles**: Bug Slayer, Grandmaster of Code.
  - **Badges & Power-ups**: XP Boosters, Streak Guardians.
- Fully interactive **Equip / Unequip** system that updates the active player avatar, title, and theme in real time.

### 📊 Character Analytics & Charts
- Responsive visual SVG charts for Weekly XP trend ($Mon \rightarrow Sun$).
- Category distribution bars.
- Attribute growth matrix.

### 🔊 Procedural Web Audio API SFX
- Zero external audio files required!
- Built-in oscillator synthesizer producing retro arpeggios, fanfare chords, coin clinks, and button ticks.
- Global mute toggle in header and Settings.

---

## 🚀 Quickstart

Run locally with standard npm:

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

The application runs at `http://localhost:3000` (or `http://localhost:5173`).

### RPG Guide AI companion

The authenticated game includes a floating **RPG Guide** chat companion. It reads the current in-app character, quest, achievement, inventory, skill, and reward state; suggested quests require explicit confirmation before they enter the quest log. Conversation history is saved in `localStorage`.

It always includes a local, data-aware fallback. To enable live OpenAI responses, copy `.env.example` to `.env`, set `OPENAI_API_KEY`, then run the API server in a separate terminal:

```bash
npm run server
```

Never expose this value as a `VITE_` variable; the API key is read only by `server/chatServer.mjs`.

---

## 🛠️ Technology Stack

- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** (Custom dark-fantasy RPG color tokens & glassmorphism)
- **Framer Motion** (Page transitions, modal springs, reward floaters)
- **Canvas-Confetti** (Trophy & level-up fireworks)
- **Lucide React** (Crisp vector gaming icons)
- **Web Audio API** (Sound effects synthesis)
- **React Router DOM v6** (Protected and public navigation)
- **localStorage** (Resilient offline persistence)

---

## 🗺️ Application Routes

| Route | Page | Description |
|---|---|---|
| `/` | Landing Page | Hero section, interactive test-quest preview, feature showcase |
| `/login` | Login Portal | Simulated character authentication & 1-click Demo Login |
| `/signup` | Character Creation | Forge new character name, email, and class |
| `/dashboard` | Command Hub | Daily quest progress circle, 7-day streak calendar, active tasks |
| `/quests` | Quest Log | All / Daily / Weekly / Completed filters, search bar, Forge modal |
| `/character` | Character Sheet | Avatar, level progression, 6 attributes, point allocator |
| `/achievements`| Trophy Room | 8+ unlockable badges with live progression tracking |
| `/rewards` | Guild Shop | Virtual shop to purchase items using quest Gold |
| `/inventory` | Armory | Owned items with real-time Equip / Unequip actions |
| `/statistics` | Combat Analytics | Weekly XP trend charts, domain stats, attribute matrix |
| `/profile` | Hero Dossier | Editable character name, bio, and avatar picker |
| `/settings` | System Settings | Sound FX toggle, theme selector, reset to demo data |
