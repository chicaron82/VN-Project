/**
 * StateManager History System
 *
 * Manages state history (undo), snapshots, and quick saves.
 * Extracted from StateManager as a composition.
 * 💚🔥💀 UV7 Crew - Version 848
 */

import type { HistoryEntry, Snapshot } from './StateManagerTypes';
import { deepClone } from './StateManagerUtils';
import { Logger } from '@utils/Logger';

/**
 * StateHistoryManager — encapsulates history, snapshots, and quick saves.
 *
 * Composed by StateManager. Delegates state mutation back via callbacks
 * so the orchestrator retains control of the single source of truth.
 */
export class StateHistoryManager {
  private history: HistoryEntry[] = [];
  private maxHistorySize: number = 50;
  private historyEnabled: boolean = true;
  private quickSaves: Record<string, Snapshot> = {};

  /**
   * Record a state change in history.
   */
  record(path: string, oldValue: unknown, newValue: unknown): void {
    if (!this.historyEnabled) return;

    const entry: HistoryEntry = {
      timestamp: Date.now(),
      path,
      oldValue: deepClone(oldValue),
      newValue: deepClone(newValue)
    };

    this.history.push(entry);

    // Trim history if over max size
    while (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  /**
   * Undo the last state change.
   * Returns the entry so the caller can apply the reversal.
   *
   * @param applyUndo - Callback to set state without triggering history recording
   * @returns The undone entry, or null if nothing to undo
   */
  undo(applyUndo: (path: string, value: unknown) => void): HistoryEntry | null {
    if (this.history.length === 0) {
      Logger.state('No history to undo');
      return null;
    }

    const entry = this.history.pop();
    if (!entry) {
      return null;
    }

    // Temporarily disable history to avoid recording the undo itself
    this.historyEnabled = false;
    applyUndo(entry.path, entry.oldValue);
    this.historyEnabled = true;

    Logger.state(`Undone: ${entry.path} restored`);
    return entry;
  }

  /**
   * Get state change history.
   */
  getHistory(count?: number): HistoryEntry[] {
    const history = [...this.history];
    if (count) {
      return history.slice(-count);
    }
    return history;
  }

  /**
   * Clear state history.
   */
  clearHistory(): void {
    this.history = [];
    Logger.state('State history cleared');
  }

  /**
   * Whether history recording is currently enabled.
   */
  get isEnabled(): boolean {
    return this.historyEnabled;
  }

  /**
   * Get the number of history entries.
   */
  get historyCount(): number {
    return this.history.length;
  }

  /**
   * Get the max history size.
   */
  get maxHistory(): number {
    return this.maxHistorySize;
  }

  /**
   * Get the number of quick saves.
   */
  get quickSaveCount(): number {
    return Object.keys(this.quickSaves).length;
  }

  // ═══════════════ Snapshots ═══════════════

  /**
   * Create a snapshot of the given state.
   */
  createSnapshot(name: string, state: Record<string, unknown>): Snapshot {
    const snapshot: Snapshot = {
      name: name || `Snapshot ${Date.now()}`,
      timestamp: Date.now(),
      state: deepClone(state)
    };

    Logger.state(`Snapshot created: ${snapshot.name}`);
    return snapshot;
  }

  /**
   * Restore state from a snapshot.
   * Records current state in history before restoring.
   *
   * @param snapshot - Snapshot to restore
   * @param currentState - Current state (for history recording)
   * @returns The cloned state from the snapshot, or null on failure
   */
  restoreSnapshot(snapshot: Snapshot, currentState: Record<string, unknown>): Record<string, unknown> | null {
    if (!snapshot || !snapshot.state) {
      Logger.error('❌ Invalid snapshot');
      return null;
    }

    // Store old state in history before restore
    this.record('_fullState', currentState, snapshot.state);

    Logger.state(`Snapshot restored: ${snapshot.name}`);
    return deepClone(snapshot.state);
  }

  /**
   * Quick save — create and store a named snapshot.
   */
  quickSave(name: string, state: Record<string, unknown>): Snapshot {
    const safeName = name || 'quicksave';
    const snapshot = this.createSnapshot(safeName, state);
    this.quickSaves[safeName] = snapshot;
    Logger.save(`Quick save: ${safeName}`);
    return snapshot;
  }

  /**
   * Quick load — retrieve a named snapshot.
   * Returns the snapshot for the caller to restore.
   */
  quickLoad(name: string): Snapshot | null {
    const safeName = name || 'quicksave';
    if (!this.quickSaves[safeName]) {
      Logger.error(`❌ No quick save found: ${safeName}`);
      return null;
    }
    return this.quickSaves[safeName];
  }

  /**
   * Reset all history, snapshots, and quick saves.
   */
  reset(): void {
    this.history = [];
    this.quickSaves = {};
  }
}
