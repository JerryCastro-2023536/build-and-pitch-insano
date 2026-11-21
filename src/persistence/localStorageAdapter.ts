/**
 * Typed LocalStorage Adapter
 * Provides a clean abstraction that can easily be swapped with an API or IndexedDB backend
 */

export class LocalStorageAdapter {
  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[LocalStorageAdapter] Error reading key "${key}":`, error);
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[LocalStorageAdapter] Error setting key "${key}":`, error);
      return false;
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[LocalStorageAdapter] Error removing key "${key}":`, error);
    }
  }

  static clearPrefix(prefix: string): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (error) {
      console.warn(`[LocalStorageAdapter] Error clearing prefix "${prefix}":`, error);
    }
  }
}
