/**
 * StateManager Types
 *
 * Type definitions for the reactive state management system.
 * 💚🔥💀 UV7 Crew - Version 848
 */

/**
 * State change callback
 */
export type StateChangeCallback = (newValue: unknown, oldValue: unknown) => void;

/**
 * State history entry
 */
export interface HistoryEntry {
  path: string;
  oldValue: unknown;
  newValue: unknown;
  timestamp: number;
}

/**
 * State snapshot
 */
export interface Snapshot {
  name: string;
  timestamp: number;
  state: Record<string, unknown>;
}

/**
 * State difference
 */
export interface StateDiff {
  path: string;
  before: unknown;
  after: unknown;
}
