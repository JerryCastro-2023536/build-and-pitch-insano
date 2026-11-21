import { BALAM_SCHEMA_VERSION, STORAGE_KEYS } from './storageKeys';

/**
 * Typed LocalStorage Adapter with Versioning and Corruption Recovery
 * Provides a clean abstraction that isolates browser storage specifics
 */
export class LocalStorageAdapter {
  private static isInitialized = false;

  /**
   * Checks schema version on initial access; clears old legacy v1 keys if necessary
   */
  private static ensureSchemaVersion(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;
    try {
      const storedVersion = localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION);
      if (!storedVersion || parseInt(storedVersion, 10) < BALAM_SCHEMA_VERSION) {
        // Safe migration: Clear old legacy v1 keys without touching non-balam data
        this.clearPrefix('balam_');
        localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, BALAM_SCHEMA_VERSION.toString());
      }
    } catch (e) {
      console.warn('[LocalStorageAdapter] Schema version check skipped or failed:', e);
    }
  }

  static get<T>(key: string, defaultValue: T): T {
    this.ensureSchemaVersion();
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[LocalStorageAdapter] Corrupted JSON in key "${key}", falling back to default:`, error);
      // Remove corrupt entry to self-heal
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): boolean {
    this.ensureSchemaVersion();
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

  /**
   * Copy-first implementation to prevent skipping keys due to live index mutation
   */
  static clearPrefix(prefix: string): void {
    try {
      // 1. Take a snapshot of all keys currently in localStorage
      const allKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k) {
          allKeys.push(k);
        }
      }
      // 2. Filter keys that match the prefix
      const matchingKeys = allKeys.filter(k => k.startsWith(prefix));
      // 3. Remove snapshot keys safely
      matchingKeys.forEach(k => {
        try {
          localStorage.removeItem(k);
        } catch {
          // ignore individual key error
        }
      });
    } catch (error) {
      console.warn(`[LocalStorageAdapter] Error clearing prefix "${prefix}":`, error);
    }
  }
}
