/**
 * Thin HTTP client for the LifeRPG Express backend (port 4000).
 *
 * Every call automatically attaches the Supabase JWT from the current
 * browser session so the backend can verify the user identity.
 *
 * Responses from the backend always follow the shape:
 *   { data: T }   on success
 *   { error: string } on failure
 */

import { getAccessToken } from './supabaseClient';
import type {
  Player,
  Quest,
  Achievement,
  ShopItem,
  InventoryItem,
  SkillNode,
  LootChest,
  DailyMission,
  GameSettings,
  NotificationItem
} from '../types';

const BASE = 'http://localhost:4000';

// ── Core fetch wrapper ────────────────────────────────────────────────────────

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const token = await getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  const json = await res.json() as { data?: T; error?: string };

  if (!res.ok || json.error) {
    throw new Error(json.error ?? `HTTP ${res.status}`);
  }

  return json.data as T;
}

const get  = <T>(path: string)              => request<T>('GET',    path);
const post = <T>(path: string, body: unknown) => request<T>('POST',   path, body);
const put  = <T>(path: string, body: unknown) => request<T>('PUT',    path, body);
const del  = <T>(path: string)              => request<T>('DELETE', path);

// ── DB row → frontend type mappers ───────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToPlayer(r: any): Player {
  return {
    id:              r.id,
    name:            r.name,
    email:           r.email,
    bio:             r.bio,
    title:           r.title,
    avatar:          r.avatar,
    level:           r.level,
    currentXP:       r.current_xp,
    gold:            r.gold,
    attributePoints: r.attribute_points,
    attributes: {
      Strength:   r.strength,
      Intellect:  r.intellect,
      Discipline: r.discipline,
      Creativity: r.creativity,
      Health:     r.health,
      Focus:      r.focus
    },
    streak:          r.streak,
    longestStreak:   r.longest_streak,
    lastActiveDate:  r.last_active_date,
    joinedDate:      r.joined_date,
    equippedTheme:   r.equipped_theme,
    equippedBadge:   r.equipped_badge
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToQuest(r: any): Quest {
  return {
    id:              r.id,
    title:           r.title,
    description:     r.description,
    category:        r.category,
    difficulty:      r.difficulty,
    xpReward:        r.xp_reward,
    goldReward:      r.gold_reward,
    attributeType:   r.attribute_type,
    attributeReward: r.attribute_reward,
    isDaily:         r.is_daily,
    isWeekly:        r.is_weekly,
    completed:       r.completed,
    completedAt:     r.completed_at ?? undefined,
    deadline:        r.deadline ?? undefined
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToAchievement(r: any): Achievement {
  return {
    id:              r.id,
    title:           r.title,
    description:     r.description,
    icon:            r.icon,
    category:        r.category,
    currentProgress: r.current_progress,
    maxProgress:     r.max_progress,
    unlocked:        r.unlocked,
    unlockedAt:      r.unlocked_at ?? undefined,
    rewardXp:        r.reward_xp,
    rewardGold:      r.reward_gold
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToShopItem(r: any): ShopItem {
  return {
    id:              r.id,
    name:            r.name,
    description:     r.description,
    category:        r.category,
    price:           r.price,
    icon:            r.icon,
    value:           r.value,
    isPurchased:     r.is_purchased,
    isEquipped:      r.is_equipped,
    buffDescription: r.buff_description ?? undefined
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToInventoryItem(r: any): InventoryItem {
  return {
    ...rowToShopItem(r),
    purchasedAt: r.purchased_at
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToSkill(r: any): SkillNode {
  return {
    id:                   r.id,
    title:                r.title,
    branch:               r.branch,
    tier:                 r.tier,
    description:          r.description,
    icon:                 r.icon,
    requiredLevel:        r.required_level,
    requiredAttribute: {
      type:  r.req_attr_type,
      value: r.req_attr_value
    },
    costAttributePoints:  r.cost_attribute_points,
    costGold:             r.cost_gold,
    unlocked:             r.unlocked,
    unlockedAt:           r.unlocked_at ?? undefined,
    parentId:             r.parent_id ?? undefined,
    perk:                 r.perk
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToChest(r: any): LootChest {
  return {
    id:              r.id,
    type:            r.type,
    name:            r.name,
    description:     r.description,
    requirementText: r.requirement_text,
    progress:        r.progress,
    maxProgress:     r.max_progress,
    unlocked:        r.unlocked,
    opened:          r.opened,
    reward: {
      gold:   r.reward_gold,
      xp:     r.reward_xp,
      title:  r.reward_title  ?? undefined,
      badge:  r.reward_badge  ?? undefined,
      avatar: r.reward_avatar ?? undefined
    }
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToMission(r: any): DailyMission {
  return {
    id:         r.id,
    title:      r.title,
    category:   r.category,
    target:     r.target,
    current:    r.current,
    completed:  r.completed,
    rewardXp:   r.reward_xp,
    rewardGold: r.reward_gold
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToSettings(r: any): GameSettings & { dailyBonusClaimed: boolean } {
  return {
    soundEnabled:       r.sound_enabled,
    animationsEnabled:  r.animations_enabled,
    theme:              r.theme,
    questReminders:     r.quest_reminders,
    streakAlerts:       r.streak_alerts,
    dailyBonusClaimed:  r.daily_bonus_claimed
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToNotification(r: any): NotificationItem {
  return {
    id:        r.id,
    title:     r.title,
    message:   r.message,
    timestamp: r.timestamp,
    type:      r.type,
    read:      r.read
  };
}

// ── Auth API ──────────────────────────────────────────────────────────────────

export interface LoginResult {
  session: { access_token: string; refresh_token: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
}

export const authApi = {
  signup: (name: string, email: string, password: string) =>
    post<{ user: unknown }>('/api/auth/signup', { name, email, password }),

  login: (email: string, password: string) =>
    post<LoginResult>('/api/auth/login', { email, password }),

  logout: () =>
    post<{ message: string }>('/api/auth/logout', {})
};

// ── Player API ────────────────────────────────────────────────────────────────

export const playerApi = {
  get: async (): Promise<Player | null> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await get<any | null>('/api/player');
    return row ? rowToPlayer(row) : null;
  },

  create: async (player: Player): Promise<Player> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await post<any>('/api/player', player);
    return rowToPlayer(row);
  },

  save: async (player: Player): Promise<Player> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await put<any>('/api/player', player);
    return rowToPlayer(row);
  }
};

// ── Quest API ─────────────────────────────────────────────────────────────────

export const questApi = {
  getAll: async (): Promise<Quest[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await get<any[]>('/api/quests');
    return rows.map(rowToQuest);
  },

  create: async (quest: Quest): Promise<Quest> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await post<any>('/api/quests', quest);
    return rowToQuest(row);
  },

  update: async (id: string, updates: Partial<Quest>): Promise<Quest> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await put<any>(`/api/quests/${id}`, updates);
    return rowToQuest(row);
  },

  delete: async (id: string): Promise<void> => {
    await del(`/api/quests/${id}`);
  },

  seed: async (quests: Quest[]): Promise<Quest[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await post<any[]>('/api/quests/seed', quests);
    return rows.map(rowToQuest);
  }
};

// ── Achievement API ───────────────────────────────────────────────────────────

export const achievementApi = {
  getAll: async (): Promise<Achievement[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await get<any[]>('/api/achievements');
    return rows.map(rowToAchievement);
  },

  seed: async (achievements: Achievement[]): Promise<Achievement[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await post<any[]>('/api/achievements/seed', achievements);
    return rows.map(rowToAchievement);
  },

  bulkUpdate: async (achievements: Achievement[]): Promise<Achievement[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await put<any[]>('/api/achievements', achievements);
    return rows.map(rowToAchievement);
  }
};

// ── Shop API ──────────────────────────────────────────────────────────────────

export const shopApi = {
  getAll: async (): Promise<ShopItem[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await get<any[]>('/api/shop');
    return rows.map(rowToShopItem);
  },

  seed: async (items: ShopItem[]): Promise<ShopItem[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await post<any[]>('/api/shop/seed', items);
    return rows.map(rowToShopItem);
  },

  update: async (id: string, updates: Partial<ShopItem>): Promise<ShopItem> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await put<any>(`/api/shop/${id}`, updates);
    return rowToShopItem(row);
  }
};

// ── Inventory API ─────────────────────────────────────────────────────────────

export const inventoryApi = {
  getAll: async (): Promise<InventoryItem[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await get<any[]>('/api/inventory');
    return rows.map(rowToInventoryItem);
  },

  add: async (item: InventoryItem): Promise<InventoryItem> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await post<any>('/api/inventory', item);
    return rowToInventoryItem(row);
  },

  seed: async (items: InventoryItem[]): Promise<InventoryItem[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await post<any[]>('/api/inventory/seed', items);
    return rows.map(rowToInventoryItem);
  },

  update: async (id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await put<any>(`/api/inventory/${id}`, updates);
    return rowToInventoryItem(row);
  },

  bulkUpdate: async (items: InventoryItem[]): Promise<InventoryItem[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await put<any[]>('/api/inventory', items);
    return rows.map(rowToInventoryItem);
  }
};

// ── Skills API ────────────────────────────────────────────────────────────────

export const skillsApi = {
  getAll: async (): Promise<SkillNode[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await get<any[]>('/api/skills');
    return rows.map(rowToSkill);
  },

  seed: async (skills: SkillNode[]): Promise<SkillNode[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await post<any[]>('/api/skills/seed', skills);
    return rows.map(rowToSkill);
  },

  update: async (id: string, updates: Partial<SkillNode>): Promise<SkillNode> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await put<any>(`/api/skills/${id}`, updates);
    return rowToSkill(row);
  }
};

// ── Loot Chests API ───────────────────────────────────────────────────────────

export const chestsApi = {
  getAll: async (): Promise<LootChest[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await get<any[]>('/api/chests');
    return rows.map(rowToChest);
  },

  seed: async (chests: LootChest[]): Promise<LootChest[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await post<any[]>('/api/chests/seed', chests);
    return rows.map(rowToChest);
  },

  update: async (id: string, updates: Partial<LootChest>): Promise<LootChest> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await put<any>(`/api/chests/${id}`, updates);
    return rowToChest(row);
  },

  bulkUpdate: async (chests: LootChest[]): Promise<LootChest[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await put<any[]>('/api/chests', chests);
    return rows.map(rowToChest);
  }
};

// ── Daily Missions API ────────────────────────────────────────────────────────

export const missionsApi = {
  getAll: async (): Promise<DailyMission[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await get<any[]>('/api/missions');
    return rows.map(rowToMission);
  },

  seed: async (missions: DailyMission[]): Promise<DailyMission[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await post<any[]>('/api/missions/seed', missions);
    return rows.map(rowToMission);
  },

  update: async (id: string, updates: Partial<DailyMission>): Promise<DailyMission> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await put<any>(`/api/missions/${id}`, updates);
    return rowToMission(row);
  },

  bulkUpdate: async (missions: DailyMission[]): Promise<DailyMission[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await put<any[]>('/api/missions', missions);
    return rows.map(rowToMission);
  }
};

// ── Game Settings API ─────────────────────────────────────────────────────────

export type FullSettings = GameSettings & { dailyBonusClaimed: boolean };

export const settingsApi = {
  get: async (): Promise<FullSettings | null> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await get<any | null>('/api/settings');
    return row ? rowToSettings(row) : null;
  },

  save: async (settings: FullSettings): Promise<FullSettings> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await put<any>('/api/settings', settings);
    return rowToSettings(row);
  }
};

// ── Notifications API ─────────────────────────────────────────────────────────

export const notificationsApi = {
  getAll: async (): Promise<NotificationItem[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await get<any[]>('/api/notifications');
    return rows.map(rowToNotification);
  },

  add: async (notification: NotificationItem): Promise<NotificationItem> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await post<any>('/api/notifications', notification);
    return rowToNotification(row);
  },

  markAllRead: async (): Promise<NotificationItem[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await put<any[]>('/api/notifications/read-all', {});
    return rows.map(rowToNotification);
  },

  seed: async (notifications: NotificationItem[]): Promise<NotificationItem[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await post<any[]>('/api/notifications/seed', notifications);
    return rows.map(rowToNotification);
  }
};
