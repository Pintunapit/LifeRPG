/**
 * rewardService – Supabase backed via Express backend.
 *
 * Shop items and inventory are kept in a local cache for instant reads.
 * Mutations (buy, equip, unequip) update the cache optimistically and
 * then sync to the backend.
 */

import { shopApi, inventoryApi } from '../lib/api';
import { storage } from '../utils/storage';
import { initialShopItems } from '../data/mockData';
import { ShopItem, InventoryItem } from '../types';
import { playerService } from './playerService';

const SHOP_KEY      = 'SHOP_CACHE';
const INVENTORY_KEY = 'INVENTORY_CACHE';

const defaultInventory = (): InventoryItem[] =>
  initialShopItems
    .filter(i => i.isPurchased)
    .map(i => ({ ...i, purchasedAt: '2026-01-20' }));

export const rewardService = {
  // ── Reads ────────────────────────────────────────────────────────────────────

  getShopItems: (): ShopItem[] => {
    const shop = storage.get<ShopItem[]>(SHOP_KEY, initialShopItems);
    return Array.isArray(shop) ? shop : initialShopItems;
  },

  getInventory: (): InventoryItem[] => {
    const inv = storage.get<InventoryItem[]>(INVENTORY_KEY, defaultInventory());
    return Array.isArray(inv) ? inv : defaultInventory();
  },

  // ── Backend sync ─────────────────────────────────────────────────────────────

  fetchShopItems: async (): Promise<ShopItem[]> => {
    try {
      const items = await shopApi.getAll();
      storage.set(SHOP_KEY, items);
      return items;
    } catch (e) {
      console.error('[rewardService] fetchShopItems failed:', e);
      return rewardService.getShopItems();
    }
  },

  fetchInventory: async (): Promise<InventoryItem[]> => {
    try {
      const items = await inventoryApi.getAll();
      storage.set(INVENTORY_KEY, items);
      return items;
    } catch (e) {
      console.error('[rewardService] fetchInventory failed:', e);
      return rewardService.getInventory();
    }
  },

  // ── Mutations ────────────────────────────────────────────────────────────────

  buyItem: async (
    itemId: string
  ): Promise<{ success: boolean; message: string; item?: ShopItem }> => {
    const shop   = rewardService.getShopItems();
    const item   = shop.find(i => i.id === itemId);
    const player = playerService.getPlayer();

    if (!item) return { success: false, message: 'Item not found in Guild Shop.' };

    const inventory = rewardService.getInventory();
    if (inventory.some(inv => inv.id === itemId)) {
      return { success: false, message: 'You already possess this item in your inventory.' };
    }
    if (player.gold < item.price) {
      return { success: false, message: `Not enough Gold! You need ${item.price - player.gold} more gold.` };
    }

    // Optimistic updates
    await playerService.addGold(-item.price);

    const newItem: InventoryItem = {
      ...item,
      isPurchased: true,
      isEquipped:  false,
      purchasedAt: new Date().toISOString()
    };

    const updatedInventory = [...inventory, newItem];
    storage.set(INVENTORY_KEY, updatedInventory);

    const updatedShop = shop.map(s => (s.id === itemId ? { ...s, isPurchased: true } : s));
    storage.set(SHOP_KEY, updatedShop);

    // Sync to backend
    try {
      await inventoryApi.add(newItem);
      await shopApi.update(itemId, { isPurchased: true });
    } catch (e) {
      console.error('[rewardService] buyItem sync failed:', e);
    }

    return { success: true, message: `Successfully purchased ${item.name}!`, item: newItem };
  },

  equipItem: async (
    itemId: string
  ): Promise<{ success: boolean; item?: InventoryItem }> => {
    const inventory = rewardService.getInventory();
    const target    = inventory.find(i => i.id === itemId);
    if (!target) return { success: false };

    // Unequip others in the same category (exclusive slot)
    const updated = inventory.map(i => ({
      ...i,
      isEquipped: i.category === target.category ? i.id === itemId : i.isEquipped
    }));
    storage.set(INVENTORY_KEY, updated);

    // Update player cosmetics
    if      (target.category === 'Avatars') await playerService.updateProfile({ avatar: target.value });
    else if (target.category === 'Titles' ) await playerService.updateProfile({ title:  target.value });
    else if (target.category === 'Themes' ) await playerService.updateProfile({ equippedTheme: target.value });
    else if (target.category === 'Badges' ) await playerService.updateProfile({ equippedBadge: target.value });

    // Sync whole inventory (equip sweep affects multiple rows)
    try {
      await inventoryApi.bulkUpdate(updated);
    } catch (e) {
      console.error('[rewardService] equipItem sync failed:', e);
    }

    return { success: true, item: target };
  },

  unequipItem: async (itemId: string): Promise<void> => {
    const inventory = rewardService.getInventory();
    const updated   = inventory.map(i => (i.id === itemId ? { ...i, isEquipped: false } : i));
    storage.set(INVENTORY_KEY, updated);

    try {
      await inventoryApi.update(itemId, { isEquipped: false });
    } catch (e) {
      console.error('[rewardService] unequipItem sync failed:', e);
    }
  },

  // ── Seed / reset ──────────────────────────────────────────────────────────────

  seedDefaults: async (): Promise<void> => {
    try {
      await shopApi.seed(initialShopItems);
      storage.set(SHOP_KEY, initialShopItems);

      const inv = defaultInventory();
      await inventoryApi.seed(inv);
      storage.set(INVENTORY_KEY, inv);
    } catch (e) {
      console.error('[rewardService] seedDefaults failed:', e);
    }
  },

  resetDefaults: async (): Promise<void> => {
    storage.set(SHOP_KEY,      initialShopItems);
    storage.set(INVENTORY_KEY, defaultInventory());
    await rewardService.seedDefaults();
  }
};
