/**
 * notificationService – Supabase backed via Express backend.
 */

import { notificationsApi } from '../lib/api';
import { storage } from '../utils/storage';
import { initialNotifications } from '../data/mockData';
import { NotificationItem } from '../types';

const CACHE_KEY = 'NOTIFICATIONS_CACHE';

export const notificationService = {
  getNotifications: (): NotificationItem[] => {
    return storage.get<NotificationItem[]>(CACHE_KEY, initialNotifications);
  },

  fetchNotifications: async (): Promise<NotificationItem[]> => {
    try {
      const list = await notificationsApi.getAll();
      storage.set(CACHE_KEY, list);
      return list;
    } catch (e) {
      console.error('[notificationService] fetchNotifications failed:', e);
      return notificationService.getNotifications();
    }
  },

  saveNotifications: (items: NotificationItem[]): void => {
    storage.set(CACHE_KEY, items);
  },

  addNotification: (
    title: string,
    message: string,
    type: NotificationItem['type'] = 'quest'
  ): NotificationItem => {
    const list = notificationService.getNotifications();
    const newNotif: NotificationItem = {
      id:        `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      timestamp: 'Just now',
      type,
      read:      false
    };

    const updated = [newNotif, ...list.slice(0, 19)];
    notificationService.saveNotifications(updated);

    // Fire-and-forget backend sync
    notificationsApi.add(newNotif).catch(e =>
      console.error('[notificationService] addNotification sync failed:', e)
    );

    return newNotif;
  },

  markAllAsRead: (): NotificationItem[] => {
    const list    = notificationService.getNotifications();
    const updated = list.map(n => ({ ...n, read: true }));
    notificationService.saveNotifications(updated);

    notificationsApi.markAllRead().catch(e =>
      console.error('[notificationService] markAllAsRead sync failed:', e)
    );

    return updated;
  },

  clearAll: (): void => {
    notificationService.saveNotifications([]);
  },

  seedDefaults: async (): Promise<NotificationItem[]> => {
    try {
      const seeded = await notificationsApi.seed(initialNotifications);
      storage.set(CACHE_KEY, seeded);
      return seeded;
    } catch (e) {
      console.error('[notificationService] seedDefaults failed:', e);
      storage.set(CACHE_KEY, initialNotifications);
      return initialNotifications;
    }
  },

  resetDefaults: async (): Promise<NotificationItem[]> => {
    return notificationService.seedDefaults();
  }
};
