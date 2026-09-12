/**
 * playerService – Supabase backed via Express backend.
 *
 * All reads and writes go to /api/player.
 * A localStorage fallback (LIFE_RPG_PLAYER_CACHE) is kept so the UI
 * renders instantly on page load while the async fetch completes.
 */

import { playerApi } from '../lib/api';
import { storage } from '../utils/storage';
import { initialPlayer } from '../data/mockData';
import { Player, AttributeType } from '../types';

const CACHE_KEY  = 'PLAYER_CACHE';
export const ATTRIBUTE_MAX = 100;

export const playerService = {
  /**
   * Returns the cached player instantly (used for synchronous React initializer).
   * Call fetchPlayer() to get the real server state.
   */
  getPlayer: (): Player => {
    const cached = storage.get<Player | null>(CACHE_KEY, null);
    if (!cached || typeof cached !== 'object' || !cached.attributes) return initialPlayer;
    return { ...initialPlayer, ...cached, attributes: { ...initialPlayer.attributes, ...cached.attributes } };
  },

  /**
   * Fetches the player from the backend and updates the local cache.
   * Returns null when no player row exists yet (brand-new user).
   */
  fetchPlayer: async (): Promise<Player | null> => {
    try {
      const player = await playerApi.get();
      if (player) {
        storage.set(CACHE_KEY, player);
      }
      return player;
    } catch (e) {
      console.error('[playerService] fetchPlayer failed:', e);
      return null;
    }
  },

  /**
   * Persists the full player object to Supabase and updates the cache.
   */
  savePlayer: async (player: Player): Promise<Player> => {
    storage.set(CACHE_KEY, player); // optimistic local update
    try {
      const saved = await playerApi.save(player);
      storage.set(CACHE_KEY, saved);
      return saved;
    } catch (e) {
      console.error('[playerService] savePlayer failed:', e);
      return player; // return the optimistic value so UI stays consistent
    }
  },

  /**
   * Creates a brand-new player row in Supabase for a newly signed-up user.
   */
  createPlayer: async (player: Player): Promise<Player> => {
    try {
      const created = await playerApi.create(player);
      storage.set(CACHE_KEY, created);
      return created;
    } catch (e) {
      console.error('[playerService] createPlayer failed:', e);
      storage.set(CACHE_KEY, player);
      return player;
    }
  },

  updateProfile: async (updates: Partial<Player>): Promise<Player> => {
    const current = playerService.getPlayer();
    const updated = { ...current, ...updates };
    return playerService.savePlayer(updated);
  },

  boostAttribute: async (attr: AttributeType, amount: number): Promise<Player> => {
    const current = playerService.getPlayer();
    const updated: Player = {
      ...current,
      attributes: {
        ...current.attributes,
        [attr]: Math.min(ATTRIBUTE_MAX, Math.max(0, (current.attributes[attr] || 0) + amount))
      }
    };
    return playerService.savePlayer(updated);
  },

  allocateAttributePoint: async (attr: AttributeType): Promise<Player | null> => {
    const current = playerService.getPlayer();
    if (current.attributePoints <= 0 || current.attributes[attr] >= ATTRIBUTE_MAX) return null;

    const updated: Player = {
      ...current,
      attributePoints: current.attributePoints - 1,
      attributes: {
        ...current.attributes,
        [attr]: (current.attributes[attr] || 0) + 1
      }
    };
    return playerService.savePlayer(updated);
  },

  addGold: async (amount: number): Promise<Player> => {
    const current = playerService.getPlayer();
    const updated: Player = {
      ...current,
      gold: Math.max(0, current.gold + amount)
    };
    return playerService.savePlayer(updated);
  },

  resetDefaults: async (): Promise<Player> => {
    return playerService.savePlayer(initialPlayer);
  }
};
