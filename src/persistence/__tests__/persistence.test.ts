import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageAdapter } from '../localStorageAdapter';

class MockStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] ?? null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
}

describe('LocalStorageAdapter Persistence Hardening', () => {
  beforeEach(() => {
    // Setup MockStorage in global context
    const mock = new MockStorage();
    Object.defineProperty(globalThis, 'localStorage', {
      value: mock,
      writable: true,
      configurable: true
    });
  });

  it('clears only keys matching the balam_ prefix, preserving foreign keys', () => {
    localStorage.setItem('balam_user_1', JSON.stringify({ name: 'Camila' }));
    localStorage.setItem('balam_score_2', JSON.stringify(94));
    localStorage.setItem('foreign_app_token', 'secure_secret_123');
    localStorage.setItem('other_analytics_id', '9988');

    LocalStorageAdapter.clearPrefix('balam_');

    expect(localStorage.getItem('balam_user_1')).toBeNull();
    expect(localStorage.getItem('balam_score_2')).toBeNull();
    expect(localStorage.getItem('foreign_app_token')).toBe('secure_secret_123');
    expect(localStorage.getItem('other_analytics_id')).toBe('9988');
  });

  it('safely recovers from corrupted non-JSON strings by returning default value', () => {
    localStorage.setItem('balam_corrupted_key', '{ invalid json syntax ...');

    const result = LocalStorageAdapter.get('balam_corrupted_key', { fallback: true });
    expect(result).toEqual({ fallback: true });
    // Corrupted entry should be cleared
    expect(localStorage.getItem('balam_corrupted_key')).toBeNull();
  });

  it('serializes and deserializes typed structures correctly', () => {
    const profile = { id: 'p1', name: 'Diego', score: 100 };
    LocalStorageAdapter.set('balam_test_profile', profile);

    const retrieved = LocalStorageAdapter.get('balam_test_profile', null);
    expect(retrieved).toEqual(profile);
  });
});
