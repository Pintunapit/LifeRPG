import {
  Player,
  Quest,
  Achievement,
  ShopItem,
  GameSettings,
  NotificationItem,
  SkillNode,
  LootChest,
  DailyMission,
  WorldLocation
} from '../types';

export const initialPlayer: Player = {
  id: 'player-alex-01',
  name: 'Alex',
  email: 'alex.warrior@liferpg.io',
  bio: 'Fullstack developer & aspiring archmage. Transforming daily code and fitness habits into epic legendary milestones.',
  title: 'Code Warrior',
  avatar: '⚔️',
  level: 12,
  currentXP: 2450,
  gold: 1250,
  attributePoints: 5,
  attributes: {
    Strength: 72,
    Intellect: 91,
    Discipline: 78,
    Creativity: 65,
    Health: 74,
    Focus: 83
  },
  streak: 7,
  longestStreak: 14,
  lastActiveDate: new Date().toISOString().split('T')[0],
  joinedDate: '2026-01-15',
  equippedTheme: 'dark-obsidian',
  equippedBadge: '🏆 Quest Master'
};

export const initialQuests: Quest[] = [
  {
    id: 'quest-1',
    title: 'Master Java Arrays & Streams',
    description: 'Solve 3 advanced algorithmic challenges focusing on stream reduction, sorting, and memory optimization.',
    category: 'Coding',
    difficulty: 'Hard',
    xpReward: 150,
    goldReward: 50,
    attributeType: 'Intellect',
    attributeReward: 5,
    isDaily: true,
    completed: false,
    deadline: 'Today, 23:59'
  },
  {
    id: 'quest-2',
    title: 'Read 20 Pages of System Architecture',
    description: 'Deep dive into microservices patterns, distributed caching, and event-driven architectures.',
    category: 'Reading',
    difficulty: 'Medium',
    xpReward: 80,
    goldReward: 25,
    attributeType: 'Intellect',
    attributeReward: 3,
    isDaily: true,
    completed: false,
    deadline: 'Today, 22:00'
  },
  {
    id: 'quest-3',
    title: 'Morning Power Workout & Cardio',
    description: 'Complete 4 sets of compound lifts followed by 20 minutes of high-intensity intervals.',
    category: 'Fitness',
    difficulty: 'Medium',
    xpReward: 100,
    goldReward: 30,
    attributeType: 'Strength',
    attributeReward: 4,
    isDaily: true,
    completed: true,
    completedAt: '2026-09-12T08:30:00Z',
    deadline: 'Today, 10:00'
  },
  {
    id: 'quest-4',
    title: 'Build Project Frontend Feature',
    description: 'Design and code an interactive dashboard component with Framer Motion animations and fluid transitions.',
    category: 'Coding',
    difficulty: 'Hard',
    xpReward: 200,
    goldReward: 75,
    attributeType: 'Creativity',
    attributeReward: 6,
    isDaily: true,
    completed: false,
    deadline: 'Today, 19:00'
  },
  {
    id: 'quest-5',
    title: '20-Minute Deep Mind Meditation',
    description: 'Perform focused breathwork and mindfulness meditation without phone or screen interruptions.',
    category: 'Personal',
    difficulty: 'Easy',
    xpReward: 60,
    goldReward: 20,
    attributeType: 'Discipline',
    attributeReward: 3,
    isDaily: true,
    completed: true,
    completedAt: '2026-09-12T07:15:00Z',
    deadline: 'Today, 09:00'
  },
  {
    id: 'quest-6',
    title: 'Drink 3L Pure Water & Eat Clean',
    description: 'Maintain perfect hydration and hit daily micronutrient goals throughout all study sprints.',
    category: 'Health',
    difficulty: 'Easy',
    xpReward: 50,
    goldReward: 15,
    attributeType: 'Health',
    attributeReward: 3,
    isDaily: true,
    completed: false,
    deadline: 'Today, 21:00'
  },
  {
    id: 'quest-7',
    title: '90-Minute Deep Work Pomodoro',
    description: 'Eliminate all tabs, silence notifications, and execute high-priority tasks in an unbroken flow state.',
    category: 'Study',
    difficulty: 'Medium',
    xpReward: 110,
    goldReward: 35,
    attributeType: 'Focus',
    attributeReward: 4,
    isDaily: true,
    completed: true,
    completedAt: '2026-09-12T11:45:00Z',
    deadline: 'Today, 14:00'
  },
  {
    id: 'quest-8',
    title: 'Weekly Epic: Deploy Production Microservice',
    description: 'Orchestrate Docker containers, write CI/CD pipeline tests, and deploy to Kubernetes cluster.',
    category: 'Coding',
    difficulty: 'Epic',
    xpReward: 450,
    goldReward: 180,
    attributeType: 'Intellect',
    attributeReward: 10,
    isDaily: false,
    isWeekly: true,
    completed: false,
    deadline: 'Sunday, 23:59'
  },
  {
    id: 'quest-9',
    title: 'Weekly Epic: 50km Cycling Challenge',
    description: 'Accumulate 50km across trails or road circuits before the week concludes.',
    category: 'Fitness',
    difficulty: 'Epic',
    xpReward: 350,
    goldReward: 140,
    attributeType: 'Health',
    attributeReward: 8,
    isDaily: false,
    isWeekly: true,
    completed: true,
    completedAt: '2026-09-10T18:00:00Z',
    deadline: 'Sunday, 20:00'
  },
  {
    id: 'quest-10',
    title: 'Design UI Component System',
    description: 'Establish design tokens for typography, elevation shadows, and accessible semantic palettes.',
    category: 'Personal',
    difficulty: 'Medium',
    xpReward: 120,
    goldReward: 40,
    attributeType: 'Creativity',
    attributeReward: 4,
    isDaily: false,
    isWeekly: true,
    completed: false,
    deadline: 'Saturday, 18:00'
  },
  {
    id: 'quest-11',
    title: 'Review 5 Open Source Pull Requests',
    description: 'Conduct thorough code reviews and test security regressions in community repositories.',
    category: 'Study',
    difficulty: 'Hard',
    xpReward: 180,
    goldReward: 60,
    attributeType: 'Focus',
    attributeReward: 5,
    isDaily: false,
    isWeekly: true,
    completed: false,
    deadline: 'Friday, 17:00'
  },
  {
    id: 'quest-12',
    title: 'Finish Reading "Clean Code"',
    description: 'Synthesize key design principles, smell catalogs, and refactoring guidelines into personal notes.',
    category: 'Reading',
    difficulty: 'Hard',
    xpReward: 220,
    goldReward: 80,
    attributeType: 'Intellect',
    attributeReward: 6,
    isDaily: false,
    isWeekly: true,
    completed: false,
    deadline: 'Sunday, 22:00'
  },
  {
    id: 'quest-legendary-1',
    title: 'Legendary Feat: Ship Production Fullstack App',
    description: 'Design, code, audit, test and deploy a complete production-grade application to the world.',
    category: 'Coding',
    difficulty: 'Legendary',
    xpReward: 500,
    goldReward: 250,
    attributeType: 'Intellect',
    attributeReward: 15,
    isDaily: false,
    isWeekly: true,
    completed: false,
    deadline: 'Sunday, 23:59'
  }
];

export const initialAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'First Quest Completed',
    description: 'Begin your heroic journey by successfully finishing your very first life quest.',
    icon: '🏆',
    category: 'Beginner',
    currentProgress: 1,
    maxProgress: 1,
    unlocked: true,
    unlockedAt: '2026-01-16',
    rewardXp: 100,
    rewardGold: 50
  },
  {
    id: 'ach-2',
    title: 'Week Warrior',
    description: 'Maintain an unbroken daily streak of at least 7 days.',
    icon: '🔥',
    category: 'Streak',
    currentProgress: 7,
    maxProgress: 7,
    unlocked: true,
    unlockedAt: '2026-09-12',
    rewardXp: 250,
    rewardGold: 100
  },
  {
    id: 'ach-3',
    title: 'Quest Master',
    description: 'Complete 50 productivity quests across all domains.',
    icon: '⚔️',
    category: 'Progression',
    currentProgress: 32,
    maxProgress: 50,
    unlocked: false,
    rewardXp: 500,
    rewardGold: 250
  },
  {
    id: 'ach-4',
    title: 'Code Warrior',
    description: 'Complete 25 coding or programming quests.',
    icon: '💻',
    category: 'Skill',
    currentProgress: 18,
    maxProgress: 25,
    unlocked: false,
    rewardXp: 400,
    rewardGold: 150
  },
  {
    id: 'ach-5',
    title: 'Knowledge Seeker',
    description: 'Complete 10 reading quests and expand your literary dominion.',
    icon: '📚',
    category: 'Skill',
    currentProgress: 7,
    maxProgress: 10,
    unlocked: false,
    rewardXp: 300,
    rewardGold: 120
  },
  {
    id: 'ach-6',
    title: 'Level 10 Achiever',
    description: 'Ascend to Level 10 and unlock senior guild benefits.',
    icon: '👑',
    category: 'Progression',
    currentProgress: 12,
    maxProgress: 10,
    unlocked: true,
    unlockedAt: '2026-08-28',
    rewardXp: 350,
    rewardGold: 200
  },
  {
    id: 'ach-7',
    title: 'Iron Will',
    description: 'Accumulate 100 Discipline attribute points.',
    icon: '🛡️',
    category: 'Attributes',
    currentProgress: 78,
    maxProgress: 100,
    unlocked: false,
    rewardXp: 450,
    rewardGold: 200
  },
  {
    id: 'ach-8',
    title: 'Vault of Midas',
    description: 'Accumulate a total treasury of over 2,500 gold coins.',
    icon: '💰',
    category: 'Economy',
    currentProgress: 1250,
    maxProgress: 2500,
    unlocked: false,
    rewardXp: 500,
    rewardGold: 300
  }
];

export const initialShopItems: ShopItem[] = [
  {
    id: 'shop-1',
    name: 'Cyber Warrior Avatar',
    description: 'Futuristic combat visage infused with neon energy and holographic lenses.',
    category: 'Avatars',
    price: 500,
    icon: '🤖',
    value: '🤖',
    isPurchased: true,
    isEquipped: false
  },
  {
    id: 'shop-2',
    name: 'Shadow Assassin Avatar',
    description: 'A cloaked phantom operating in the deep terminal shadows.',
    category: 'Avatars',
    price: 650,
    icon: '🥷',
    value: '🥷',
    isPurchased: false,
    isEquipped: false
  },
  {
    id: 'shop-3',
    name: 'Grand Archmage Avatar',
    description: 'Channel infinite computational mana with celestial robes.',
    category: 'Avatars',
    price: 800,
    icon: '🧙‍♂️',
    value: '🧙‍♂️',
    isPurchased: false,
    isEquipped: false
  },
  {
    id: 'shop-4',
    name: 'Dark Knight Theme',
    description: 'Obsidian borders with blood-red edge lighting and ominous gothic hues.',
    category: 'Themes',
    price: 750,
    icon: '🛡️',
    value: 'theme-dark-knight',
    isPurchased: false,
    isEquipped: false
  },
  {
    id: 'shop-5',
    name: 'Cyberpunk Neon Theme',
    description: 'Electric cyan and radioactive magenta glow across all UI modules.',
    category: 'Themes',
    price: 850,
    icon: '⚡',
    value: 'theme-cyber-neon',
    isPurchased: true,
    isEquipped: false
  },
  {
    id: 'shop-6',
    name: 'XP Booster (24H)',
    description: 'Grants +20% bonus XP on all quests completed over the next 24 hours.',
    category: 'Power-ups',
    price: 300,
    icon: '🧪',
    value: 'boost-xp-20',
    buffDescription: '+20% XP boost active'
  },
  {
    id: 'shop-7',
    name: 'Streak Guardian',
    description: 'Protects your streak from resetting if you miss a single day of quests.',
    category: 'Power-ups',
    price: 450,
    icon: '🏺',
    value: 'streak-freeze-1',
    buffDescription: 'Streak freeze shield ready'
  },
  {
    id: 'shop-8',
    name: 'Title: Bug Slayer',
    description: 'Equip the prestigious "Bug Slayer" title beside your warrior moniker.',
    category: 'Titles',
    price: 250,
    icon: '🏷️',
    value: 'Bug Slayer',
    isPurchased: true,
    isEquipped: false
  },
  {
    id: 'shop-9',
    name: 'Title: Grandmaster of Code',
    description: 'Honor reserved only for architects of resilient digital universes.',
    category: 'Titles',
    price: 600,
    icon: '📜',
    value: 'Grandmaster of Code',
    isPurchased: false,
    isEquipped: false
  },
  {
    id: 'shop-10',
    name: 'Badge: Mythic Phoenix',
    description: 'Radiant animated badge displaying an undying crest of resilience.',
    category: 'Badges',
    price: 400,
    icon: '🦅',
    value: 'Mythic Phoenix',
    isPurchased: false,
    isEquipped: false
  }
];

export const initialSettings: GameSettings = {
  soundEnabled: true,
  animationsEnabled: true,
  theme: 'dark-obsidian',
  questReminders: true,
  streakAlerts: true
};

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Daily Streak Maintained!',
    message: '🔥 You completed quests today! Your streak reached 7 days.',
    timestamp: 'Just now',
    type: 'streak',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Achievement Unlocked: Week Warrior',
    message: '🏆 Claimed +250 XP and +100 Gold for 7-day consistency.',
    timestamp: '1 hour ago',
    type: 'achievement',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Level 12 Ascendance',
    message: '🎉 Congratulations! You advanced to Level 12 and earned 5 attribute points.',
    timestamp: 'Yesterday',
    type: 'level_up',
    read: true
  }
];

export const initialSkills: SkillNode[] = [
  // Intellect Branch
  {
    id: 'skill-int-root',
    title: 'Intellect Foundation',
    branch: 'Intellect',
    tier: 1,
    description: 'Awaken deep cognitive acuity and mental agility across all intellectual endeavors.',
    icon: '🧠',
    requiredLevel: 1,
    requiredAttribute: { type: 'Intellect', value: 20 },
    costAttributePoints: 1,
    costGold: 100,
    unlocked: true,
    perk: '+5% XP bonus on all Intellect & Coding quests'
  },
  {
    id: 'skill-coding-root',
    title: 'Coding Acumen',
    branch: 'Intellect',
    tier: 2,
    parentId: 'skill-int-root',
    description: 'Master clean modular code architecture, patterns, and algorithmic clarity.',
    icon: '💻',
    requiredLevel: 5,
    requiredAttribute: { type: 'Intellect', value: 45 },
    costAttributePoints: 2,
    costGold: 250,
    unlocked: true,
    perk: 'Unlocks advanced coding contracts with +20 Gold bonus'
  },
  {
    id: 'skill-learning-root',
    title: 'Speed Learning',
    branch: 'Intellect',
    tier: 2,
    parentId: 'skill-int-root',
    description: 'Accelerate memory encoding, conceptual synthesis, and retention velocity.',
    icon: '📚',
    requiredLevel: 6,
    requiredAttribute: { type: 'Intellect', value: 50 },
    costAttributePoints: 2,
    costGold: 250,
    unlocked: true,
    perk: '+15% XP on Reading and Study challenges'
  },
  {
    id: 'skill-java-master',
    title: 'Java Master',
    branch: 'Intellect',
    tier: 3,
    parentId: 'skill-coding-root',
    description: 'Deep mastery over JVM internals, multithreaded streams, and low-latency patterns.',
    icon: '☕',
    requiredLevel: 10,
    requiredAttribute: { type: 'Intellect', value: 75 },
    costAttributePoints: 3,
    costGold: 400,
    unlocked: true,
    perk: '+10% bonus gold on coding quests and unlocks Java Guild insignia'
  },
  {
    id: 'skill-bookworm',
    title: 'Bookworm',
    branch: 'Intellect',
    tier: 3,
    parentId: 'skill-learning-root',
    description: 'Devour technical literature and philosophy at double cognitive reading rate.',
    icon: '📖',
    requiredLevel: 10,
    requiredAttribute: { type: 'Intellect', value: 70 },
    costAttributePoints: 3,
    costGold: 350,
    unlocked: true,
    perk: 'Daily reading quests yield 1 extra attribute point'
  },
  {
    id: 'skill-algo-pro',
    title: 'Algorithm Pro',
    branch: 'Intellect',
    tier: 4,
    parentId: 'skill-java-master',
    description: 'Deconstruct graphs, dynamic programming tables, and complexity boundaries with ease.',
    icon: '⚡',
    requiredLevel: 14,
    requiredAttribute: { type: 'Intellect', value: 85 },
    costAttributePoints: 4,
    costGold: 600,
    unlocked: false,
    perk: 'Critical Thinking: 10% chance to duplicate quest rewards upon completion'
  },
  {
    id: 'skill-scholar',
    title: 'Grand Scholar',
    branch: 'Intellect',
    tier: 4,
    parentId: 'skill-bookworm',
    description: 'Synthesize interdisciplinary insights across systems architecture, math, and psychology.',
    icon: '🎓',
    requiredLevel: 15,
    requiredAttribute: { type: 'Intellect', value: 85 },
    costAttributePoints: 4,
    costGold: 600,
    unlocked: false,
    perk: 'Universal Knowledge: Boosts all attribute gains by +1 across study sprints'
  },
  {
    id: 'skill-code-warrior',
    title: 'Code Warrior (Pinnacle)',
    branch: 'Intellect',
    tier: 5,
    parentId: 'skill-algo-pro',
    description: 'The supreme summit of software craftsmanship. Architecture that withstands epochs.',
    icon: '⚔️',
    requiredLevel: 18,
    requiredAttribute: { type: 'Intellect', value: 95 },
    costAttributePoints: 5,
    costGold: 1000,
    unlocked: false,
    perk: 'Mythic Title: "Grandmaster Architect" & +30% Gold on all epic coding raids'
  },

  // Strength Branch
  {
    id: 'skill-str-root',
    title: 'Iron Foundation',
    branch: 'Strength',
    tier: 1,
    description: 'Unshakeable physical fortitude and consistent muscular conditioning.',
    icon: '🛡️',
    requiredLevel: 2,
    requiredAttribute: { type: 'Strength', value: 25 },
    costAttributePoints: 1,
    costGold: 100,
    unlocked: true,
    perk: '+5% XP from workout and fitness quests'
  },
  {
    id: 'skill-iron-grit',
    title: 'Iron Grit',
    branch: 'Strength',
    tier: 2,
    parentId: 'skill-str-root',
    description: 'Push beyond physical failure in weight training and cardiovascular circuits.',
    icon: '💪',
    requiredLevel: 8,
    requiredAttribute: { type: 'Strength', value: 60 },
    costAttributePoints: 3,
    costGold: 350,
    unlocked: false,
    perk: 'Restores player daily stamina +10% faster'
  },
  {
    id: 'skill-titan-stamina',
    title: 'Titan Stamina',
    branch: 'Strength',
    tier: 3,
    parentId: 'skill-iron-grit',
    description: 'Indomitable physiological resilience capable of sustained all-day athletic exertion.',
    icon: '🌋',
    requiredLevel: 14,
    requiredAttribute: { type: 'Strength', value: 80 },
    costAttributePoints: 4,
    costGold: 700,
    unlocked: false,
    perk: 'Daily fitness quests grant +50 bonus gold'
  },

  // Focus Branch
  {
    id: 'skill-focus-root',
    title: 'Mindfulness Foundation',
    branch: 'Focus',
    tier: 1,
    description: 'Calm mental waves through breathwork, silencing distractors and noise.',
    icon: '🧘',
    requiredLevel: 2,
    requiredAttribute: { type: 'Focus', value: 30 },
    costAttributePoints: 1,
    costGold: 100,
    unlocked: true,
    perk: '+5% Focus stat growth during meditation'
  },
  {
    id: 'skill-flow-state',
    title: 'Flow State Mastery',
    branch: 'Focus',
    tier: 2,
    parentId: 'skill-focus-root',
    description: 'Enter deep uninterrupted flow state within 90 seconds of work initiation.',
    icon: '🌀',
    requiredLevel: 9,
    requiredAttribute: { type: 'Focus', value: 65 },
    costAttributePoints: 3,
    costGold: 400,
    unlocked: false,
    perk: 'Pomodoro sprints grant +25% XP bonus'
  },
  {
    id: 'skill-deep-diver',
    title: 'Zen Archon',
    branch: 'Focus',
    tier: 3,
    parentId: 'skill-flow-state',
    description: 'Impenetrable cognitive isolation shield. Complete immunity to procrastination.',
    icon: '👁️',
    requiredLevel: 16,
    requiredAttribute: { type: 'Focus', value: 85 },
    costAttributePoints: 5,
    costGold: 850,
    unlocked: false,
    perk: 'Double streak multiplier bonuses on all daily mission boards'
  }
];

export const initialChests: LootChest[] = [
  {
    id: 'chest-daily',
    type: 'daily',
    name: 'Daily Vanguard Chest',
    description: 'Awarded for completing 3 daily life quests with consistency.',
    requirementText: 'Complete 3 daily quests',
    progress: 2,
    maxProgress: 3,
    unlocked: false,
    opened: false,
    reward: {
      gold: 120,
      xp: 180,
      title: 'Day Voyager'
    }
  },
  {
    id: 'chest-weekly',
    type: 'weekly',
    name: 'Weekly Guild Chest',
    description: 'Vault of riches granted to warriors who conquer 7 quests throughout the week.',
    requirementText: 'Complete 7 quests this week',
    progress: 5,
    maxProgress: 7,
    unlocked: false,
    opened: false,
    reward: {
      gold: 350,
      xp: 500,
      badge: '🔥 Weekly Conqueror'
    }
  },
  {
    id: 'chest-epic',
    type: 'epic',
    name: 'Epic Mythic Cache',
    description: 'Legendary chest sealed with ancient arcane runes. Unlocks when all 5 daily missions are cleared.',
    requirementText: 'Complete all 5 daily missions',
    progress: 2,
    maxProgress: 5,
    unlocked: false,
    opened: false,
    reward: {
      gold: 600,
      xp: 850,
      title: 'Legendary Luminary',
      avatar: '👑'
    }
  }
];

export const initialDailyMissions: DailyMission[] = [
  {
    id: 'mission-1',
    title: 'Complete 3 Real-Life Quests',
    category: 'General',
    target: 3,
    current: 2,
    completed: false,
    rewardXp: 150,
    rewardGold: 50
  },
  {
    id: 'mission-2',
    title: 'Complete 1 Coding Challenge or Feature',
    category: 'Coding',
    target: 1,
    current: 1,
    completed: true,
    rewardXp: 120,
    rewardGold: 40
  },
  {
    id: 'mission-3',
    title: 'Read 20 Pages of Knowledge Material',
    category: 'Reading',
    target: 1,
    current: 0,
    completed: false,
    rewardXp: 80,
    rewardGold: 25
  },
  {
    id: 'mission-4',
    title: 'Execute Intense Workout or Mobility',
    category: 'Fitness',
    target: 1,
    current: 1,
    completed: true,
    rewardXp: 100,
    rewardGold: 30
  },
  {
    id: 'mission-5',
    title: 'Complete 20-Min Deep Focus Sprint',
    category: 'Personal',
    target: 1,
    current: 0,
    completed: false,
    rewardXp: 70,
    rewardGold: 20
  }
];

export const initialWorldLocations: WorldLocation[] = [
  {
    id: 'loc-coding',
    name: 'Code Dungeon',
    category: 'Coding',
    subtitle: 'Labyrinth of Binary & Algorithms',
    description: 'Slay compiler demons, refactor dark legacy ruins, and architect resilient digital cathedrals.',
    icon: '⚔️',
    requiredLevel: 1,
    coordinateX: 20,
    coordinateY: 32,
    rewardText: '+150 XP • Intellect Surge',
    bannerImage: 'dungeon'
  },
  {
    id: 'loc-study',
    name: 'Knowledge Forest',
    category: 'Study',
    subtitle: 'Canopy of Arcane Grimoires',
    description: 'Wander ancient groves where ancient scrolls, research papers, and computational theory flourish.',
    icon: '📚',
    requiredLevel: 2,
    coordinateX: 74,
    coordinateY: 26,
    rewardText: '+120 XP • Wisdom Ingot',
    bannerImage: 'forest'
  },
  {
    id: 'loc-fitness',
    name: 'Training Arena',
    category: 'Fitness',
    subtitle: 'Colosseum of Physical Fortitude',
    description: 'Forge unbreakable sinew, stamina, and cardiovascular resilience beneath the gladiatorial roar.',
    icon: '🏟️',
    requiredLevel: 1,
    coordinateX: 30,
    coordinateY: 74,
    rewardText: '+140 XP • Strength Core',
    bannerImage: 'arena'
  },
  {
    id: 'loc-reading',
    name: 'Library of Wisdom',
    category: 'Reading',
    subtitle: 'Sanctum of Infinite Manuscripts',
    description: 'Towering shelves containing distilled life principles, philosophical treaties, and systemic insights.',
    icon: '📖',
    requiredLevel: 3,
    coordinateX: 82,
    coordinateY: 66,
    rewardText: '+110 XP • Focus Elixir',
    bannerImage: 'library'
  },
  {
    id: 'loc-personal',
    name: 'Temple of Focus',
    category: 'Personal',
    subtitle: 'Spire of Unbroken Concentration',
    description: 'Perched upon silent peaks, this monastery cultivates mindfulness, meditation, and flow state mastery.',
    icon: '🧘',
    requiredLevel: 4,
    coordinateX: 50,
    coordinateY: 46,
    rewardText: '+130 XP • Discipline Rune',
    bannerImage: 'temple'
  },
  {
    id: 'loc-health',
    name: 'Vitality Valley',
    category: 'Health',
    subtitle: 'Springs of Cellular Restoration',
    description: 'Nourishing springs, botanical nutrition, and restorative circadian cycles to replenish hero health.',
    icon: '❤️',
    requiredLevel: 1,
    coordinateX: 62,
    coordinateY: 84,
    rewardText: '+100 XP • Vitality Flask',
    bannerImage: 'valley'
  }
];

