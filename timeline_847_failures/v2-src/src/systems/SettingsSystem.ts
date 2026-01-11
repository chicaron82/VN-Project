/**
 * UV7 V2 SettingsSystem
 *
 * Manages user preferences with persistence.
 *
 * Features:
 * - Type-safe settings access
 * - Default values with overrides
 * - Persistent storage
 * - Change subscriptions
 */

import type { Settings, GameSystem } from '../core/index.ts';

const STORAGE_KEY = 'uv7-v2-settings';

const DEFAULT_SETTINGS: Settings = {
  textSpeed: 'normal',
  autoAdvance: false,
  autoAdvanceDelay: 3000,
  hapticEnabled: true,
  hapticIntensity: 'medium',
  musicVolume: 0.7,
  sfxVolume: 0.8,
  screenShakeEnabled: true,
  reducedMotion: false,
};

type SettingsKey = keyof Settings;
type SettingsChangeHandler<K extends SettingsKey> = (
  newValue: Settings[K],
  oldValue: Settings[K]
) => void;

interface Subscription<K extends SettingsKey> {
  key: K;
  handler: SettingsChangeHandler<K>;
}

export interface SettingsSystemConfig {
  storageKey?: string;
}

export class SettingsSystem implements GameSystem {
  readonly name = 'SettingsSystem';

  private storageKey: string;
  private settings: Settings;
  private subscriptions: Array<Subscription<SettingsKey>> = [];

  constructor(config: SettingsSystemConfig = {}) {
    this.storageKey = config.storageKey ?? STORAGE_KEY;
    this.settings = { ...DEFAULT_SETTINGS };
  }

  // =========================================================================
  // LIFECYCLE
  // =========================================================================

  init(): void {
    this.load();

    // Check for reduced motion preference
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

      if (prefersReducedMotion.matches && !this.wasExplicitlySet('reducedMotion')) {
        this.settings.reducedMotion = true;
      }

      // Listen for changes
      prefersReducedMotion.addEventListener('change', (e) => {
        if (!this.wasExplicitlySet('reducedMotion')) {
          this.set('reducedMotion', e.matches);
        }
      });
    }
  }

  destroy(): void {
    this.subscriptions = [];
  }

  // =========================================================================
  // SETTINGS ACCESS
  // =========================================================================

  /**
   * Get all settings
   */
  getAll(): Readonly<Settings> {
    return { ...this.settings };
  }

  /**
   * Get a specific setting
   */
  get<K extends SettingsKey>(key: K): Settings[K] {
    return this.settings[key];
  }

  /**
   * Set a specific setting
   */
  set<K extends SettingsKey>(key: K, value: Settings[K]): void {
    const oldValue = this.settings[key];

    if (oldValue === value) return;

    this.settings[key] = value;
    this.save();
    this.notifySubscribers(key, value, oldValue);
  }

  /**
   * Update multiple settings at once
   */
  update(updates: Partial<Settings>): void {
    const oldSettings = { ...this.settings };

    for (const key of Object.keys(updates) as SettingsKey[]) {
      const newValue = updates[key];
      if (newValue !== undefined) {
        // Use type assertion to handle the union type correctly
        (this.settings as Record<SettingsKey, Settings[SettingsKey]>)[key] = newValue;
      }
    }

    this.save();

    // Notify subscribers for each changed key
    for (const key of Object.keys(updates) as SettingsKey[]) {
      if (oldSettings[key] !== this.settings[key]) {
        this.notifySubscribers(
          key,
          this.settings[key],
          oldSettings[key]
        );
      }
    }
  }

  /**
   * Reset all settings to defaults
   */
  reset(): void {
    const oldSettings = { ...this.settings };
    this.settings = { ...DEFAULT_SETTINGS };
    this.save();

    // Notify subscribers
    for (const key of Object.keys(this.settings) as SettingsKey[]) {
      if (oldSettings[key] !== this.settings[key]) {
        this.notifySubscribers(
          key,
          this.settings[key],
          oldSettings[key]
        );
      }
    }
  }

  /**
   * Reset a single setting to default
   */
  resetOne<K extends SettingsKey>(key: K): void {
    this.set(key, DEFAULT_SETTINGS[key]);
  }

  // =========================================================================
  // SUBSCRIPTIONS
  // =========================================================================

  /**
   * Subscribe to changes on a specific setting
   */
  subscribe<K extends SettingsKey>(
    key: K,
    handler: SettingsChangeHandler<K>
  ): () => void {
    const subscription = { key, handler } as unknown as Subscription<SettingsKey>;
    this.subscriptions.push(subscription);

    return () => {
      const index = this.subscriptions.indexOf(subscription);
      if (index !== -1) {
        this.subscriptions.splice(index, 1);
      }
    };
  }

  private notifySubscribers<K extends SettingsKey>(
    key: K,
    newValue: Settings[K],
    oldValue: Settings[K]
  ): void {
    for (const sub of this.subscriptions) {
      if (sub.key === key) {
        (sub.handler as SettingsChangeHandler<K>)(newValue, oldValue);
      }
    }
  }

  // =========================================================================
  // PERSISTENCE
  // =========================================================================

  private save(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    } catch {
      // Storage full or unavailable
    }
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const loaded = JSON.parse(raw) as Partial<Settings>;
        this.settings = { ...DEFAULT_SETTINGS, ...loaded };
      }
    } catch {
      // Corrupted data, use defaults
      this.settings = { ...DEFAULT_SETTINGS };
    }
  }

  private wasExplicitlySet(key: SettingsKey): boolean {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const loaded = JSON.parse(raw) as Record<string, unknown>;
        return key in loaded;
      }
    } catch {
      // Ignore
    }
    return false;
  }

  // =========================================================================
  // CONVENIENCE GETTERS
  // =========================================================================

  /**
   * Get text speed in milliseconds per character
   */
  getTextSpeedMs(): number {
    switch (this.settings.textSpeed) {
      case 'slow': return 60;
      case 'normal': return 30;
      case 'fast': return 15;
      case 'instant': return 0;
    }
  }

  /**
   * Check if haptics should be used
   */
  shouldUseHaptics(): boolean {
    return this.settings.hapticEnabled && 'vibrate' in navigator;
  }

  /**
   * Check if screen shake should be used
   */
  shouldUseScreenShake(): boolean {
    return this.settings.screenShakeEnabled && !this.settings.reducedMotion;
  }

  /**
   * Check if animations should be reduced
   */
  shouldReduceMotion(): boolean {
    return this.settings.reducedMotion;
  }
}

// Singleton instance
export const settingsSystem = new SettingsSystem();
