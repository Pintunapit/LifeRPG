/**
 * questService – Supabase backed via Express backend.
 *
 * Optimistic local cache (LIFE_RPG_QUESTS_CACHE) ensures the quest list
 * renders instantly. All mutations are fire-and-update: local state is
 * updated immediately and then confirmed by the backend response.
 */

import { questApi } from '../lib/api';
import { storage } from '../utils/storage';
import { initialQuests } from '../data/mockData';
import { Quest } from '../types';

const CACHE_KEY = 'QUESTS_CACHE';

export const questService = {
  /** Synchronous – returns cached quests for React state initializer. */
  getQuests: (): Quest[] => {
    const quests = storage.get<Quest[]>(CACHE_KEY, initialQuests);
    return Array.isArray(quests) ? quests : initialQuests;
  },

  /** Fetch quests from backend and refresh cache. */
  fetchQuests: async (): Promise<Quest[]> => {
    try {
      const quests = await questApi.getAll();
      storage.set(CACHE_KEY, quests);
      return quests;
    } catch (e) {
      console.error('[questService] fetchQuests failed:', e);
      return questService.getQuests();
    }
  },

  /** Sync cache to localStorage (used after in-memory updates). */
  saveQuests: (quests: Quest[]): void => {
    storage.set(CACHE_KEY, quests);
  },

  createQuest: async (questData: Omit<Quest, 'id' | 'completed'>): Promise<Quest> => {
    const newQuest: Quest = {
      ...questData,
      id: `quest-${Date.now()}`,
      completed: false
    };

    // Optimistic update
    const current = questService.getQuests();
    const updated = [newQuest, ...current];
    questService.saveQuests(updated);

    try {
      const saved = await questApi.create(newQuest);
      // Replace optimistic entry with confirmed server response
      const confirmed = questService.getQuests().map(q =>
        q.id === newQuest.id ? saved : q
      );
      questService.saveQuests(confirmed);
      return saved;
    } catch (e) {
      console.error('[questService] createQuest failed:', e);
      return newQuest;
    }
  },

  completeQuest: async (id: string): Promise<{ success: boolean; quest?: Quest }> => {
    const quests = questService.getQuests();
    const target = quests.find(q => q.id === id);
    if (!target || target.completed) {
      return { success: false, quest: target };
    }

    const completedAt = new Date().toISOString();
    const updatedQuest: Quest = { ...target, completed: true, completedAt };

    // Optimistic update
    const updated = quests.map(q => (q.id === id ? updatedQuest : q));
    questService.saveQuests(updated);

    try {
      const saved = await questApi.update(id, { completed: true, completedAt });
      const confirmed = questService.getQuests().map(q => (q.id === id ? saved : q));
      questService.saveQuests(confirmed);
      return { success: true, quest: saved };
    } catch (e) {
      console.error('[questService] completeQuest failed:', e);
      return { success: true, quest: updatedQuest };
    }
  },

  deleteQuest: async (id: string): Promise<void> => {
    // Optimistic removal
    const updated = questService.getQuests().filter(q => q.id !== id);
    questService.saveQuests(updated);

    try {
      await questApi.delete(id);
    } catch (e) {
      console.error('[questService] deleteQuest failed:', e);
    }
  },

  /** Seed the default quests for a new user (idempotent upsert). */
  seedDefaults: async (): Promise<Quest[]> => {
    try {
      const seeded = await questApi.seed(initialQuests);
      storage.set(CACHE_KEY, seeded);
      return seeded;
    } catch (e) {
      console.error('[questService] seedDefaults failed:', e);
      storage.set(CACHE_KEY, initialQuests);
      return initialQuests;
    }
  },

  resetDefaults: async (): Promise<Quest[]> => {
    return questService.seedDefaults();
  }
};
