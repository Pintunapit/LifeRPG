/**
 * Type-safe and resilient LocalStorage helper with fallback
 */

const PREFIX = 'LIFE_RPG_';

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(`${PREFIX}${key}`);
      if (item === null || item === undefined) return defaultValue;
      const parsed: unknown = JSON.parse(item);
      // Reject common corruption cases before they reach React state consumers.
      if (parsed === null || parsed === undefined) return defaultValue;
      if (Array.isArray(defaultValue) && !Array.isArray(parsed)) return defaultValue;
      if (!Array.isArray(defaultValue) && typeof defaultValue === 'object' && typeof parsed !== 'object') {
        return defaultValue;
      }
      return parsed as T;
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing to localStorage key "${key}":`, e);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(`${PREFIX}${key}`);
    } catch (e) {
      console.error(`Error removing localStorage key "${key}":`, e);
    }
  },

  clearAll: (): void => {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(PREFIX))
        .forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.error('Error clearing Life RPG localStorage:', e);
    }
  }
};
