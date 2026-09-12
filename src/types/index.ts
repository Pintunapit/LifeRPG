export type QuestCategory = 'Coding' | 'Study' | 'Fitness' | 'Reading' | 'Personal' | 'Health';

export type QuestDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Epic' | 'Legendary';

export type AttributeType = 'Strength' | 'Intellect' | 'Discipline' | 'Creativity' | 'Health' | 'Focus';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  xpReward: number;
  goldReward: number;
  attributeType: AttributeType;
  attributeReward: number;
  isDaily: boolean;
  isWeekly?: boolean;
  completed: boolean;
  completedAt?: string;
  deadline?: string;
}

export interface PlayerAttributes {
  Strength: number;
  Intellect: number;
  Discipline: number;
  Creativity: number;
  Health: number;
  Focus: number;
}

export interface Player {
  id: string;
  name: string;
  email: string;
  bio: string;
  title: string;
  avatar: string;
  level: number;
  currentXP: number;
  gold: number;
  attributePoints: number;
  attributes: PlayerAttributes;
  streak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  joinedDate: string;
  equippedTheme: string;
  equippedBadge: string;
}

export type ShopCategory = 'Themes' | 'Avatars' | 'Badges' | 'Titles' | 'Power-ups';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ShopCategory;
  price: number;
  icon: string;
  value: string; // e.g. theme name, avatar URL/emoji, title text
  isPurchased?: boolean;
  isEquipped?: boolean;
  buffDescription?: string;
}

export interface InventoryItem extends ShopItem {
  purchasedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  currentProgress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  rewardXp: number;
  rewardGold: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'level_up' | 'quest' | 'streak' | 'gold' | 'achievement' | 'shop';
  read: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  theme: 'dark-obsidian' | 'cyber-neon' | 'royal-gold';
  questReminders: boolean;
  streakAlerts: boolean;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  dayName: string; // Mon, Tue, etc.
  completed: boolean;
  questsCount: number;
}

// RPG Skill Tree Model
export interface SkillNode {
  id: string;
  title: string;
  branch: 'Intellect' | 'Strength' | 'Focus';
  tier: number;
  description: string;
  icon: string;
  requiredLevel: number;
  requiredAttribute: {
    type: AttributeType;
    value: number;
  };
  costAttributePoints: number;
  costGold: number;
  unlocked: boolean;
  unlockedAt?: string;
  parentId?: string;
  perk: string;
}

// Loot Chest Model
export interface LootChestReward {
  gold: number;
  xp: number;
  title?: string;
  badge?: string;
  avatar?: string;
}

export interface LootChest {
  id: string;
  type: 'daily' | 'weekly' | 'epic';
  name: string;
  description: string;
  requirementText: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  opened: boolean;
  reward: LootChestReward;
}

// Daily Mission Model
export interface DailyMission {
  id: string;
  title: string;
  category: QuestCategory | 'General';
  target: number;
  current: number;
  completed: boolean;
  rewardXp: number;
  rewardGold: number;
}

// RPG World Territory Model
export interface WorldLocation {
  id: string;
  name: string;
  category: QuestCategory;
  subtitle: string;
  description: string;
  icon: string;
  requiredLevel: number;
  coordinateX: number; // 0-100 percentage on map
  coordinateY: number; // 0-100 percentage on map
  rewardText: string;
  bannerImage: string;
}

export type ChatActionType = 'CREATE_QUEST' | 'SUGGEST_QUEST' | 'VIEW_STATS' | 'PLAN_DAY' | 'SUGGEST_CHALLENGE' | 'LEVEL_ADVICE' | 'STREAK_ADVICE' | 'ACHIEVEMENT_ADVICE';

export interface QuestSuggestion {
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  xpReward: number;
  goldReward: number;
  attributeType: AttributeType;
  attributeReward: number;
  deadline: string;
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  createdAt: string;
  suggestion?: QuestSuggestion;
}
