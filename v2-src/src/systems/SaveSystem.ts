/**
 * UV7 V2 SaveSystem
 *
 * Handles save/load operations with validation and versioning.
 *
 * Features:
 * - Multiple save slots
 * - Save data validation
 * - Version migration for compatibility
 * - Auto-save support
 * - Export/import save data
 */

import type { GameState, SaveSlot, GameSystem } from '../core/index.ts';
import { EventBus, eventBus } from '../core/EventBus.ts';
import { StateManager, stateManager } from '../core/StateManager.ts';

const SAVE_VERSION = 1;
const STORAGE_KEY_PREFIX = 'uv7-v2-save-';
const MAX_SLOTS = 10;

interface StoredSave {
  version: number;
  slot: SaveSlot;
}

export interface SaveSystemConfig {
  eventBus?: EventBus;
  stateManager?: StateManager;
  maxSlots?: number;
  storagePrefix?: string;
}

export class SaveSystem implements GameSystem {
  readonly name = 'SaveSystem';

  private eventBus: EventBus;
  private stateManager: StateManager;
  private maxSlots: number;
  private storagePrefix: string;

  constructor(config: SaveSystemConfig = {}) {
    this.eventBus = config.eventBus ?? eventBus;
    this.stateManager = config.stateManager ?? stateManager;
    this.maxSlots = config.maxSlots ?? MAX_SLOTS;
    this.storagePrefix = config.storagePrefix ?? STORAGE_KEY_PREFIX;
  }

  // =========================================================================
  // LIFECYCLE
  // =========================================================================

  init(): void {
    // Validate existing saves on init
    this.validateAllSaves();
  }

  destroy(): void {
    // Nothing to cleanup
  }

  // =========================================================================
  // SAVE OPERATIONS
  // =========================================================================

  /**
   * Save current game state to a slot
   */
  save(slotId: number): boolean {
    if (slotId < 0 || slotId >= this.maxSlots) {
      this.eventBus.emit('save:error', {
        slot: slotId,
        error: `Invalid slot: ${slotId}`,
      });
      return false;
    }

    this.eventBus.emit('save:start', { slot: slotId });

    try {
      const state = this.stateManager.snapshot();
      const saveSlot: SaveSlot = {
        id: slotId,
        timestamp: Date.now(),
        state,
      };

      const storedSave: StoredSave = {
        version: SAVE_VERSION,
        slot: saveSlot,
      };

      const key = this.getStorageKey(slotId);
      localStorage.setItem(key, JSON.stringify(storedSave));

      this.eventBus.emit('save:complete', { slot: slotId });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.eventBus.emit('save:error', { slot: slotId, error: message });
      return false;
    }
  }

  /**
   * Load game state from a slot
   */
  load(slotId: number): boolean {
    if (slotId < 0 || slotId >= this.maxSlots) {
      this.eventBus.emit('load:error', {
        slot: slotId,
        error: `Invalid slot: ${slotId}`,
      });
      return false;
    }

    this.eventBus.emit('load:start', { slot: slotId });

    try {
      const key = this.getStorageKey(slotId);
      const raw = localStorage.getItem(key);

      if (!raw) {
        this.eventBus.emit('load:error', {
          slot: slotId,
          error: 'Save slot is empty',
        });
        return false;
      }

      const storedSave = JSON.parse(raw) as StoredSave;

      // Migrate if needed
      const migrated = this.migrateIfNeeded(storedSave);

      // Validate state
      if (!this.isValidGameState(migrated.slot.state)) {
        this.eventBus.emit('load:error', {
          slot: slotId,
          error: 'Save data is corrupted',
        });
        return false;
      }

      // Restore state
      this.stateManager.restore(migrated.slot.state);

      this.eventBus.emit('load:complete', { slot: slotId });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.eventBus.emit('load:error', { slot: slotId, error: message });
      return false;
    }
  }

  /**
   * Delete a save slot
   */
  delete(slotId: number): boolean {
    if (slotId < 0 || slotId >= this.maxSlots) {
      return false;
    }

    try {
      const key = this.getStorageKey(slotId);
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  // =========================================================================
  // SLOT QUERIES
  // =========================================================================

  /**
   * Get info about a save slot (without loading full state)
   */
  getSlotInfo(slotId: number): SaveSlot | null {
    try {
      const key = this.getStorageKey(slotId);
      const raw = localStorage.getItem(key);

      if (!raw) return null;

      const storedSave = JSON.parse(raw) as StoredSave;
      return storedSave.slot;
    } catch {
      return null;
    }
  }

  /**
   * Get info for all save slots
   */
  getAllSlots(): Array<SaveSlot | null> {
    const slots: Array<SaveSlot | null> = [];

    for (let i = 0; i < this.maxSlots; i++) {
      slots.push(this.getSlotInfo(i));
    }

    return slots;
  }

  /**
   * Check if a slot has a save
   */
  hasSlot(slotId: number): boolean {
    return this.getSlotInfo(slotId) !== null;
  }

  /**
   * Get the most recent save slot
   */
  getMostRecentSlot(): SaveSlot | null {
    let mostRecent: SaveSlot | null = null;

    for (let i = 0; i < this.maxSlots; i++) {
      const slot = this.getSlotInfo(i);
      if (slot && (!mostRecent || slot.timestamp > mostRecent.timestamp)) {
        mostRecent = slot;
      }
    }

    return mostRecent;
  }

  /**
   * Find the next empty slot (for quick save)
   */
  getNextEmptySlot(): number | null {
    for (let i = 0; i < this.maxSlots; i++) {
      if (!this.hasSlot(i)) {
        return i;
      }
    }
    return null;
  }

  // =========================================================================
  // EXPORT / IMPORT
  // =========================================================================

  /**
   * Export a save slot as JSON string
   */
  exportSave(slotId: number): string | null {
    const key = this.getStorageKey(slotId);
    return localStorage.getItem(key);
  }

  /**
   * Import save data into a slot
   */
  importSave(slotId: number, data: string): boolean {
    if (slotId < 0 || slotId >= this.maxSlots) {
      return false;
    }

    try {
      const storedSave = JSON.parse(data) as StoredSave;

      // Validate structure
      if (!storedSave.version || !storedSave.slot || !storedSave.slot.state) {
        return false;
      }

      // Migrate if needed
      const migrated = this.migrateIfNeeded(storedSave);

      // Validate state
      if (!this.isValidGameState(migrated.slot.state)) {
        return false;
      }

      // Update slot ID and timestamp
      migrated.slot.id = slotId;
      migrated.slot.timestamp = Date.now();

      const key = this.getStorageKey(slotId);
      localStorage.setItem(key, JSON.stringify(migrated));

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Export all saves as a single JSON string
   */
  exportAllSaves(): string {
    const saves: Record<number, StoredSave> = {};

    for (let i = 0; i < this.maxSlots; i++) {
      const key = this.getStorageKey(i);
      const raw = localStorage.getItem(key);
      if (raw) {
        saves[i] = JSON.parse(raw) as StoredSave;
      }
    }

    return JSON.stringify(saves);
  }

  // =========================================================================
  // PRIVATE HELPERS
  // =========================================================================

  private getStorageKey(slotId: number): string {
    return `${this.storagePrefix}${slotId}`;
  }

  private validateAllSaves(): void {
    for (let i = 0; i < this.maxSlots; i++) {
      const key = this.getStorageKey(i);
      const raw = localStorage.getItem(key);

      if (raw) {
        try {
          const storedSave = JSON.parse(raw) as StoredSave;
          const migrated = this.migrateIfNeeded(storedSave);

          // Re-save if migrated
          if (migrated.version !== storedSave.version) {
            localStorage.setItem(key, JSON.stringify(migrated));
          }
        } catch {
          // Corrupted save, remove it
          localStorage.removeItem(key);
        }
      }
    }
  }

  private migrateIfNeeded(stored: StoredSave): StoredSave {
    let current = stored;

    // Add migration steps as needed
    // if (current.version < 2) {
    //   current = this.migrateV1toV2(current);
    // }

    return current;
  }

  private isValidGameState(state: unknown): state is GameState {
    if (!state || typeof state !== 'object') return false;

    const s = state as Record<string, unknown>;

    // Check required fields exist
    return (
      typeof s.currentScene === 'string' &&
      (s.currentRoute === null || typeof s.currentRoute === 'string') &&
      typeof s.currentAct === 'number' &&
      typeof s.tetherLevel === 'number' &&
      typeof s.playthrough === 'number' &&
      typeof s.flags === 'object' &&
      typeof s.counters === 'object' &&
      Array.isArray(s.visitedScenes)
    );
  }
}

// Singleton instance
export const saveSystem = new SaveSystem();
