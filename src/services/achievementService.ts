/**
 * achievementService – Supabase backed via Express backend.
 */

import { achievementApi } from '../lib/api';
import { storage } from '../utils/storage';
import { initialAchievements } from '../data/mockData';
import { Achievement, Player, Quest } from '../types';

const CACHE_KEY = 'ACHIEVEMENTS_CACHE';

export const achievementService = {
  getAchievements: (): Achievement[] => {
    const achievements = storage.get<Achievement[]>(CACHE_KEY, initialAchievements);
    return Array.isArray(achievements) ? achievements : initialAchievements;
  },

  fetchAchievements: async (): Promise<Achievement[]> => {
    try {
      const list = await achievementApi.getAll();
      storage.set(CACHE_KEY, list);
      return list;
    } catch (e) {
      console.error('[achievementService] fetchAchievements failed:', e);
      return achievementService.getAchievements();
    }
  },

  saveAchievements: (achievements: Achievement[]): void => {
    storage.set(CACHE_KEY, achievements);
  },

  checkMilestones: (
    player: Player,
    quests: Quest[]
  ): { unlockedNow: Achievement[]; updatedList: Achievement[] } => {
    const list = achievementService.getAchievements();
    const completedQuests = quests.filter(q => q.completed);
    const completedCount = completedQuests.length;
    const codingQuestsCount = completedQuests.filter(q => q.category === 'Coding').length;
    const readingQuestsCount = completedQuests.filter(q => q.category === 'Reading').length;

    const unlockedNow: Achievement[] = [];

    const updatedList = list.map(ach => {
      if (ach.unlocked) return ach;

      let newProgress = ach.currentProgress;

      if      (ach.id === 'ach-1') newProgress = completedCount >= 1 ? 1 : 0;
      else if (ach.id === 'ach-2') newProgress = Math.min(ach.maxProgress, player.streak);
      else if (ach.id === 'ach-3') newProgress = Math.min(ach.maxProgress, completedCount);
      else if (ach.id === 'ach-4') newProgress = Math.min(ach.maxProgress, codingQuestsCount);
      else if (ach.id === 'ach-5') newProgress = Math.min(ach.maxProgress, readingQuestsCount);
      else if (ach.id === 'ach-6') newProgress = Math.min(ach.maxProgress, player.level);
      else if (ach.id === 'ach-7') newProgress = Math.min(ach.maxProgress, player.attributes.Discipline);
      else if (ach.id === 'ach-8') newProgress = Math.min(ach.maxProgress, player.gold);

      const justUnlocked = newProgress >= ach.maxProgress;

      if (justUnlocked) {
        const unlockedAch: Achievement = {
          ...ach,
          currentProgress: ach.maxProgress,
          unlocked: true,
          unlockedAt: new Date().toISOString().split('T')[0]
        };
        unlockedNow.push(unlockedAch);
        return unlockedAch;
      }

      return { ...ach, currentProgress: newProgress };
    });

    // Persist optimistically; async bulk-update to backend
    achievementService.saveAchievements(updatedList);
    achievementApi.bulkUpdate(updatedList).catch(e =>
      console.error('[achievementService] bulkUpdate failed:', e)
    );

    return { unlockedNow, updatedList };
  },

  seedDefaults: async (): Promise<Achievement[]> => {
    try {
      const seeded = await achievementApi.seed(initialAchievements);
      storage.set(CACHE_KEY, seeded);
      return seeded;
    } catch (e) {
      console.error('[achievementService] seedDefaults failed:', e);
      storage.set(CACHE_KEY, initialAchievements);
      return initialAchievements;
    }
  },

  resetDefaults: async (): Promise<Achievement[]> => {
    return achievementService.seedDefaults();
  }
};
