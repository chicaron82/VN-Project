import type { EventBus } from './EventBus';
import { Logger } from '@utils/Logger';
import type { HistoryEntry, Snapshot, StateDiff, StateChangeCallback } from './StateManagerTypes';
import { deepClone, deepEqual, getByPath, setByPath } from './StateManagerUtils';
import { StateHistoryManager } from './StateManagerHistory';

// Re-export types for backward compatibility
export type { StateChangeCallback, HistoryEntry, Snapshot, StateDiff } from './StateManagerTypes';

/**
 * ════════════════════════════════════════════════════════════════
 * StateManager - Reactive State Management
 * Phase 15e: Full V1 parity audit
 *
 * BELLE'S IDEA: Reactive state with pub/sub pattern 💚
 *
 * Centralized state management with:
 * - Path-based access (dot notation)
 * - Deep cloning for immutability
 * - Reactive subscriptions
 * - localStorage persistence
 * - State history with undo support
 * - Snapshots for save/load
 * - Import/export for debugging
 * - Watch utilities for development
 *
 * Types in StateManagerTypes.ts
 * Pure helpers in StateManagerUtils.ts
 * History/snapshots in StateManagerHistory.ts
 *
 * 💚🔥💀 UV7 Crew - Version 848
 * ════════════════════════════════════════════════════════════════
 */
export class StateManager {
  private state: Record<string, unknown>;
  private subscribers: Map<string, Set<StateChangeCallback>>;
  private isDirty: boolean;
  private persistenceKey: string;
  private _eventBus: EventBus | null;

  // History subsystem (composition)
  private historyManager: StateHistoryManager;

  // Watchers (V1 parity)
  private watchers: Map<string, () => void>;

  constructor(eventBus?: EventBus, initialState: Record<string, unknown> = {}, persistenceKey = 'vn_state') {
    this.state = deepClone(initialState);
    this.subscribers = new Map();
    this.isDirty = false;
    this.persistenceKey = persistenceKey;
    this._eventBus = eventBus || null;

    // History subsystem
    this.historyManager = new StateHistoryManager();

    // Watchers
    this.watchers = new Map();

    Logger.state('StateManager initialized');
  }

  // ════════════════════════════════════════════════════════════════
  // CORE: GET / SET / SUBSCRIBE
  // ════════════════════════════════════════════════════════════════

  /**
   * Get a value from state by path
   * Returns a deep clone to prevent external mutations
   *
   * @param path - Dot-notation path (e.g., 'game.currentScene')
   * @returns Deep cloned value at path, or undefined if not found
   *
   * @example
   * const sceneId = stateManager.get('game.currentScene');
   * const typed = stateManager.get<number>('game.loopVersion');
   */
  get<T = unknown>(path: string): T | undefined {
    const value = getByPath(this.state, path);

    // Return deep clone to prevent external mutations
    if (value !== undefined && value !== null && typeof value === 'object') {
      return deepClone(value) as T;
    }

    return value as T | undefined;
  }

  /**
   * Set a value in state by path
   * Deep clones the value and notifies subscribers
   *
   * @param path - Dot-notation path
   * @param value - Value to set (will be deep cloned)
   *
   * @example
   * stateManager.set('game.currentScene', 'scene1_coffee');
   */
  set(path: string, value: unknown): void {
    const clonedValue = deepClone(value);
    const oldValue = this.get(path);

    // Only update if value changed
    if (deepEqual(oldValue, clonedValue)) {
      return;
    }

    // Record history before change (for undo)
    this.historyManager.record(path, oldValue, clonedValue);

    // Set the value
    setByPath(this.state, path, clonedValue);
    this.isDirty = true;

    // Notify subscribers
    this.notifySubscribers(path, clonedValue, oldValue);
  }

  /**
   * Subscribe to state changes at a specific path
   *
   * @param path - Dot-notation path to watch
   * @param callback - Function(newValue, oldValue) called on change
   * @returns Unsubscribe function
   *
   * @example
   * const unsubscribe = stateManager.subscribe('tether.level', (newLevel, oldLevel) => {
  *   console['log'](`Tether: ${oldLevel} → ${newLevel}`);
   * });
   *
   * // Later:
   * unsubscribe();
   */
  subscribe(path: string, callback: StateChangeCallback): () => void {
    if (!this.subscribers.has(path)) {
      this.subscribers.set(path, new Set());
    }

    const callbacks = this.subscribers.get(path)!;
    callbacks.add(callback);

    // Return unsubscribe function
    return () => {
      const subs = this.subscribers.get(path);
      if (subs) {
        subs.delete(callback);
      }
    };
  }

  // ════════════════════════════════════════════════════════════════
  // PERSISTENCE
  // ════════════════════════════════════════════════════════════════

  /**
   * Save state to localStorage
   * Only saves if state has been modified
   */
  save(): void {
    if (!this.isDirty) {
      return;
    }

    try {
      const serialized = JSON.stringify(this.state);
      localStorage.setItem(this.persistenceKey, serialized);
      this.isDirty = false;
    } catch (error) {
      Logger.error('Failed to save state:', error);
    }
  }

  /**
   * Load state from localStorage
   *
   * @returns True if state was loaded, false otherwise
   */
  load(): boolean {
    try {
      const serialized = localStorage.getItem(this.persistenceKey);
      if (!serialized) {
        return false;
      }

      const loaded = JSON.parse(serialized) as Record<string, unknown>;
      this.state = loaded;
      this.isDirty = false;

      // Notify all subscribers of loaded state
      this.subscribers.forEach((callbacks, path) => {
        const value = this.get(path);
        callbacks.forEach((callback) => {
          try {
            callback(value, undefined);
          } catch (error) {
            Logger.error(`Error in state subscription for ${path}:`, error);
          }
        });
      });

      return true;
    } catch (error) {
      Logger.error('Failed to load state:', error);
      return false;
    }
  }

  /**
   * Get entire state object (deep cloned)
   */
  getAll(): Record<string, unknown> {
    return deepClone(this.state) as Record<string, unknown>;
  }

  /**
   * Replace entire state
   */
  setAll(newState: Record<string, unknown>): void {
    this.state = deepClone(newState);
    this.isDirty = true;

    // Notify all subscribers
    this.subscribers.forEach((callbacks, path) => {
      const value = this.get(path);
      const oldValue = undefined; // Can't determine old value on full replace
      callbacks.forEach((callback) => {
        try {
          callback(value, oldValue);
        } catch (error) {
          Logger.error(`Error in state subscription for ${path}:`, error);
        }
      });
    });
  }

  // ════════════════════════════════════════════════════════════════
  // PRIVATE HELPERS
  // ════════════════════════════════════════════════════════════════

  private notifySubscribers(path: string, newValue: unknown, oldValue: unknown): void {
    const callbacks = this.subscribers.get(path);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(newValue, oldValue);
        } catch (error) {
          Logger.error(`Error in state subscription for ${path}:`, error);
        }
      });
    }
  }

  // ════════════════════════════════════════════════════════════════
  // RESET (V1 Parity)
  // ════════════════════════════════════════════════════════════════

  /**
   * Clear all state and reset to defaults
   * Also clears localStorage
   */
  reset(defaultState: Record<string, unknown> = {}): void {
    // Store old state in history
    this.historyManager.record('_fullState', this.state, defaultState);

    // Reset state
    this.state = deepClone(defaultState);

    // Clear subscribers
    this.subscribers.clear();

    // Reset flags
    this.isDirty = false;

    // Reset history subsystem
    this.historyManager.reset();

    // Clear watchers
    this.watchers.forEach(unsub => unsub());
    this.watchers.clear();

    // Clear localStorage
    localStorage.removeItem(this.persistenceKey);

    Logger.state('State reset to defaults');
  }

  // ════════════════════════════════════════════════════════════════
  // STATE HISTORY — delegates to StateHistoryManager
  // ════════════════════════════════════════════════════════════════

  /**
   * Undo the last state change
   */
  undo(): HistoryEntry | null {
    return this.historyManager.undo((path, value) => this.set(path, value));
  }

  /**
   * Get state change history
   */
  getHistory(count?: number): HistoryEntry[] {
    return this.historyManager.getHistory(count);
  }

  /**
   * Clear state history
   */
  clearHistory(): void {
    this.historyManager.clearHistory();
  }

  // ════════════════════════════════════════════════════════════════
  // SNAPSHOTS — delegates to StateHistoryManager
  // ════════════════════════════════════════════════════════════════

  /**
   * Create a snapshot of the current state
   */
  createSnapshot(name: string = ''): Snapshot {
    return this.historyManager.createSnapshot(name, this.state);
  }

  /**
   * Restore state from a snapshot
   */
  restoreSnapshot(snapshot: Snapshot): boolean {
    const restored = this.historyManager.restoreSnapshot(snapshot, this.state);
    if (!restored) return false;
    this.state = restored;
    this.isDirty = true;
    return true;
  }

  /**
   * Quick save - create and store a named snapshot
   */
  quickSave(name: string = 'quicksave'): Snapshot {
    return this.historyManager.quickSave(name, this.state);
  }

  /**
   * Quick load - restore from a named snapshot
   */
  quickLoad(name: string = 'quicksave'): boolean {
    const snapshot = this.historyManager.quickLoad(name);
    if (!snapshot) return false;
    return this.restoreSnapshot(snapshot);
  }

  // ════════════════════════════════════════════════════════════════
  // DIFF (V1 Parity)
  // ════════════════════════════════════════════════════════════════

  /**
   * Compare two snapshots and return differences
   */
  diff(snapshot1: Snapshot | Record<string, unknown>, snapshot2?: Snapshot | Record<string, unknown> | null): StateDiff[] {
    const state1 = (snapshot1 as Snapshot)?.state || snapshot1;
    const state2 = (snapshot2 as Snapshot)?.state || snapshot2 || this.state;

    const differences: StateDiff[] = [];

    const compare = (obj1: unknown, obj2: unknown, path: string = ''): void => {
      const keys = new Set([
        ...Object.keys(obj1 as Record<string, unknown> || {}),
        ...Object.keys(obj2 as Record<string, unknown> || {})
      ]);

      for (const key of keys) {
        const fullPath = path ? `${path}.${key}` : key;
        const val1 = (obj1 as Record<string, unknown>)?.[key];
        const val2 = (obj2 as Record<string, unknown>)?.[key];

        if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null) {
          compare(val1, val2, fullPath);
        } else if (!deepEqual(val1, val2)) {
          differences.push({
            path: fullPath,
            before: val1,
            after: val2
          });
        }
      }
    };

    compare(state1, state2);
    return differences;
  }

  /**
   * Print diff as a formatted table
   */
  printDiff(snapshot1: Snapshot | Record<string, unknown>, snapshot2?: Snapshot | Record<string, unknown> | null): StateDiff[] {
    const diffs = this.diff(snapshot1, snapshot2);
    if (diffs.length === 0) {
      Logger.state('✅ No differences found');
      return diffs;
    }
    Logger.state('📊 State Differences:', diffs);
    return diffs;
  }

  // ════════════════════════════════════════════════════════════════
  // IMPORT/EXPORT (V1 Parity)
  // ════════════════════════════════════════════════════════════════

  /**
   * Export current state as JSON string
   */
  exportState(): string {
    const exportData = {
      version: 1,
      timestamp: Date.now(),
      state: deepClone(this.state)
    };
    const json = JSON.stringify(exportData, null, 2);
    Logger.state('📤 State exported to JSON');
    return json;
  }

  /**
   * Export state to clipboard
   */
  async copyStateToClipboard(): Promise<boolean> {
    try {
      const json = this.exportState();
      await navigator.clipboard.writeText(json);
      Logger.state('📋 State copied to clipboard!');
      return true;
    } catch (error) {
      Logger.error('❌ Failed to copy to clipboard:', error);
      return false;
    }
  }

  /**
   * Import state from JSON string
   */
  importState(json: string): boolean {
    try {
      const importData = JSON.parse(json) as { version?: number; timestamp?: number; state?: Record<string, unknown> };

      if (!importData.state) {
        Logger.error('❌ Invalid import data: missing state');
        return false;
      }

      // Store current state for potential undo
      this.historyManager.record('_fullState', this.state, importData.state);

      this.state = deepClone(importData.state);
      this.isDirty = true;

      Logger.state(`📥 State imported (from ${new Date(importData.timestamp || Date.now()).toLocaleString()})`);
      return true;
    } catch (error) {
      Logger.error('❌ Failed to import state:', error);
      return false;
    }
  }

  // ════════════════════════════════════════════════════════════════
  // WATCH UTILITY (V1 Parity)
  // ════════════════════════════════════════════════════════════════

  /**
   * Watch a path and log all changes (for debugging)
   */
  watch(path: string): () => void {
    Logger.state(`👀 Watching: ${path}`);

    const unsubscribe = this.subscribe(path, (newValue, oldValue) => {
      const timestamp = new Date().toLocaleTimeString();
      Logger.state(`📊 [${timestamp}] ${path}: ${JSON.stringify(oldValue)} → ${JSON.stringify(newValue)}`);
    });

    this.watchers.set(path, unsubscribe);
    return unsubscribe;
  }

  /**
   * Stop watching a path
   */
  unwatch(path: string): void {
    const unsub = this.watchers.get(path);
    if (unsub) {
      unsub();
      this.watchers.delete(path);
      Logger.state(`🔇 Stopped watching: ${path}`);
    }
  }

  /**
   * Stop all watches
   */
  unwatchAll(): void {
    this.watchers.forEach((unsub, path) => {
      unsub();
      Logger.state(`🔇 Stopped watching: ${path}`);
    });
    this.watchers.clear();
  }

  /**
   * List all active watchers
   */
  listWatchers(): string[] {
    const paths = [...this.watchers.keys()];
    if (paths.length === 0) {
      Logger.state('👀 No active watchers');
    } else {
      Logger.state('👀 Active watchers:', paths);
    }
    return paths;
  }

  // ════════════════════════════════════════════════════════════════
  // UTILITY METHODS (V1 Parity)
  // ════════════════════════════════════════════════════════════════

  /**
   * Delete a specific path from state
   */
  deletePath(path: string): boolean {
    const parts = path.split('.');
    if (parts.length === 0) return false;

    let current: Record<string, unknown> = this.state;

    // Navigate to parent
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (part === undefined || current[part] === undefined) return false;
      current = current[part] as Record<string, unknown>;
    }

    // Delete the key
    const lastKey = parts[parts.length - 1];
    if (lastKey !== undefined && lastKey in current) {
      delete current[lastKey];
      this.isDirty = true;
      Logger.state(`🗑️ Deleted path: ${path}`);
      return true;
    }
    return false;
  }

  /**
   * Check if a path exists in state
   */
  has(path: string): boolean {
    return this.get(path) !== undefined;
  }

  /**
   * Get all keys/paths in state (flattened)
   */
  keys(prefix: string = ''): string[] {
    const paths: string[] = [];

    const traverse = (obj: unknown, currentPath: string): void => {
      for (const key in obj as Record<string, unknown>) {
        const fullPath = currentPath ? `${currentPath}.${key}` : key;
        const value = (obj as Record<string, unknown>)[key];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          traverse(value, fullPath);
        } else {
          paths.push(fullPath);
        }
      }
    };

    const startObj = prefix ? this.get(prefix) : this.state;
    traverse(startObj, prefix);
    return paths;
  }

  /**
   * Get estimated size of state in bytes
   */
  size(): number {
    const json = JSON.stringify(this.state);
    const bytes = new Blob([json]).size;
    Logger.state(`📦 State size: ${bytes} bytes (${(bytes / 1024).toFixed(2)} KB)`);
    return bytes;
  }

  /**
   * Merge an object into state at a path
   */
  merge(path: string, obj: Record<string, unknown>): boolean {
    const existing = (this.get(path) || {}) as Record<string, unknown>;
    if (typeof existing !== 'object' || typeof obj !== 'object') {
      Logger.error('❌ merge() requires objects');
      return false;
    }
    const merged = { ...existing, ...obj };
    this.set(path, merged);
    Logger.state(`🔀 Merged into ${path}`);
    return true;
  }

  /**
   * Increment a numeric value at path
   */
  increment(path: string, amount: number = 1): number {
    const current = (this.get(path) || 0) as number;
    if (typeof current !== 'number') {
      Logger.error('❌ increment() requires numeric path');
      return current;
    }
    const newValue = current + amount;
    this.set(path, newValue);
    return newValue;
  }

  /**
   * Toggle a boolean value at path
   */
  toggle(path: string): boolean {
    const current = this.get(path);
    const newValue = !current;
    this.set(path, newValue);
    return newValue;
  }

  /**
   * Set multiple values at once
   */
  batchSet(pathValuePairs: Record<string, unknown>): Record<string, boolean> {
    const results: Record<string, boolean> = {};
    for (const [path, value] of Object.entries(pathValuePairs)) {
      this.set(path, value);
      results[path] = true;
    }
    Logger.state(`📦 Batch set ${Object.keys(pathValuePairs).length} values`);
    return results;
  }

  /**
   * Get multiple values at once
   */
  batchGet(paths: string[]): Record<string, unknown> {
    const results: Record<string, unknown> = {};
    for (const path of paths) {
      results[path] = this.get(path);
    }
    return results;
  }

  /**
   * Get StateManager statistics
   */
  getStats(): Record<string, number | boolean> {
    const countProperties = (obj: unknown, depth: number = 0): number => {
      let count = 0;
      for (const key in obj as Record<string, unknown>) {
        const value = (obj as Record<string, unknown>)[key];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          count += countProperties(value, depth + 1);
        } else {
          count++;
        }
      }
      return count;
    };

    let subscriberCount = 0;
    this.subscribers.forEach(set => subscriberCount += set.size);

    const stats = {
      propertyCount: countProperties(this.state),
      subscriberCount,
      watcherCount: this.watchers.size,
      historyCount: this.historyManager.historyCount,
      maxHistorySize: this.historyManager.maxHistory,
      quickSaveCount: this.historyManager.quickSaveCount,
      isDirty: this.isDirty
    };

    Logger.state('📊 StateManager Stats:', stats);
    return stats;
  }

  // ════════════════════════════════════════════════════════════════
  // DEBUG / DEV TOOLS (V1 Parity)
  // ════════════════════════════════════════════════════════════════

  /**
   * Print state tree to console
   */
  debug(): void {
    Logger.state('🔍 Current State:');
    Logger.state(JSON.stringify(this.state, null, 2));
  }

  /**
   * List all active subscriptions
   */
  listSubscriptions(): void {
    Logger.state('👂 Active Subscriptions:');
    this.subscribers.forEach((subs, path) => {
      Logger.state(`  ${path}: ${subs.size} subscriber(s)`);
    });
  }

  /**
   * Get the associated EventBus (if any)
   * V1 Parity: getEventBus()
   */
  getEventBus(): EventBus | null {
    return this._eventBus;
  }
}
