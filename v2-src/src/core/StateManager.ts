/**
 * UV7 V2 StateManager
 *
 * Reactive state management with subscriptions.
 * Manages the entire game state with fine-grained update notifications.
 *
 * Features:
 * - Type-safe state updates
 * - Path-based subscriptions (e.g., subscribe to 'tetherLevel' only)
 * - Immutable updates (state is never mutated directly)
 * - State snapshots for save/load
 * - Undo support via state history
 */

import type { GameState, DeepPartial } from './types.ts';
import { EventBus, eventBus } from './EventBus.ts';

type StateKey = keyof GameState;
type StateChangeHandler<K extends StateKey> = (
  newValue: GameState[K],
  oldValue: GameState[K]
) => void;

interface Subscription<K extends StateKey> {
  key: K;
  handler: StateChangeHandler<K>;
}

const DEFAULT_STATE: GameState = {
  currentScene: '',
  currentRoute: null,
  currentAct: 1,

  tetherLevel: 100,
  tetherDecayRate: 0,
  tetherPaused: true,

  flags: {},
  counters: {},
  visitedScenes: [],

  playthrough: 1,
  totalPlaytime: 0,
  endings: [],

  notesUnlocked: [],
  achievementsUnlocked: [],
  discoveredCodes: [],
};

export class StateManager {
  private state: GameState;
  private subscriptions: Array<Subscription<StateKey>> = [];
  private eventBus: EventBus;

  private history: GameState[] = [];
  private historyEnabled = false;
  private maxHistorySize = 50;

  constructor(initialState?: DeepPartial<GameState>, bus?: EventBus) {
    this.state = this.mergeWithDefaults(initialState);
    this.eventBus = bus ?? eventBus;
  }

  // =========================================================================
  // STATE ACCESS
  // =========================================================================

  /**
   * Get the current state (readonly)
   */
  getState(): Readonly<GameState> {
    return this.state;
  }

  /**
   * Get a specific value from state
   */
  get<K extends StateKey>(key: K): GameState[K] {
    return this.state[key];
  }

  /**
   * Check if a flag is set
   */
  hasFlag(flagName: string): boolean {
    return this.state.flags[flagName] === true;
  }

  /**
   * Get a counter value (defaults to 0)
   */
  getCounter(counterName: string): number {
    return this.state.counters[counterName] ?? 0;
  }

  // =========================================================================
  // STATE UPDATES
  // =========================================================================

  /**
   * Update one or more state values
   */
  set<K extends StateKey>(key: K, value: GameState[K]): void {
    const oldValue = this.state[key];

    // Skip if no change
    if (oldValue === value) return;

    // Record history if enabled
    if (this.historyEnabled) {
      this.recordHistory();
    }

    // Create new state (immutable)
    this.state = {
      ...this.state,
      [key]: value,
    };

    // Notify subscribers
    this.notifySubscribers(key, value, oldValue);
  }

  /**
   * Update multiple values at once
   */
  update(updates: DeepPartial<GameState>): void {
    if (this.historyEnabled) {
      this.recordHistory();
    }

    const oldState = { ...this.state };
    this.state = this.mergeWithDefaults(updates, this.state);

    // Notify subscribers for each changed key
    for (const key of Object.keys(updates) as StateKey[]) {
      if (oldState[key] !== this.state[key]) {
        this.notifySubscribers(key, this.state[key], oldState[key]);
      }
    }
  }

  /**
   * Set a flag value
   */
  setFlag(flagName: string, value: boolean): void {
    const newFlags = { ...this.state.flags, [flagName]: value };
    this.set('flags', newFlags);
  }

  /**
   * Toggle a flag
   */
  toggleFlag(flagName: string): void {
    this.setFlag(flagName, !this.hasFlag(flagName));
  }

  /**
   * Set a counter value
   */
  setCounter(counterName: string, value: number): void {
    const newCounters = { ...this.state.counters, [counterName]: value };
    this.set('counters', newCounters);
  }

  /**
   * Increment a counter
   */
  incrementCounter(counterName: string, amount = 1): void {
    this.setCounter(counterName, this.getCounter(counterName) + amount);
  }

  /**
   * Mark a scene as visited
   */
  markSceneVisited(sceneId: string): void {
    if (!this.state.visitedScenes.includes(sceneId)) {
      this.set('visitedScenes', [...this.state.visitedScenes, sceneId]);
    }
  }

  /**
   * Check if a scene has been visited
   */
  hasVisitedScene(sceneId: string): boolean {
    return this.state.visitedScenes.includes(sceneId);
  }

  /**
   * Unlock a note
   */
  unlockNote(noteId: string): void {
    if (!this.state.notesUnlocked.includes(noteId)) {
      this.set('notesUnlocked', [...this.state.notesUnlocked, noteId]);
      this.eventBus.emit('note:unlock', { id: noteId });
    }
  }

  /**
   * Unlock an achievement
   */
  unlockAchievement(achievementId: string): void {
    if (!this.state.achievementsUnlocked.includes(achievementId)) {
      this.set('achievementsUnlocked', [
        ...this.state.achievementsUnlocked,
        achievementId,
      ]);
      this.eventBus.emit('achievement:unlock', { id: achievementId });
    }
  }

  /**
   * Discover a secret code
   */
  discoverCode(codeId: string): void {
    if (!this.state.discoveredCodes.includes(codeId)) {
      this.set('discoveredCodes', [...this.state.discoveredCodes, codeId]);
    }
  }

  /**
   * Check if a code has been discovered
   */
  hasDiscoveredCode(codeId: string): boolean {
    return this.state.discoveredCodes.includes(codeId);
  }

  // =========================================================================
  // TETHER HELPERS
  // =========================================================================

  /**
   * Adjust tether level
   */
  adjustTether(delta: number, reason?: string): void {
    const oldLevel = this.state.tetherLevel;
    const newLevel = Math.max(0, Math.min(100, oldLevel + delta));

    if (newLevel !== oldLevel) {
      this.set('tetherLevel', newLevel);

      // Build payload conditionally to satisfy exactOptionalPropertyTypes
      const payload: { level: number; delta: number; reason?: string } = {
        level: newLevel,
        delta,
      };
      if (reason !== undefined) {
        payload.reason = reason;
      }
      this.eventBus.emit('tether:change', payload);

      // Emit critical/empty events
      if (newLevel <= 20 && oldLevel > 20) {
        this.eventBus.emit('tether:critical', { level: newLevel });
      }
      if (newLevel === 0 && oldLevel > 0) {
        this.eventBus.emit('tether:empty');
      }
    }
  }

  // =========================================================================
  // SUBSCRIPTIONS
  // =========================================================================

  /**
   * Subscribe to changes on a specific state key
   */
  subscribe<K extends StateKey>(
    key: K,
    handler: StateChangeHandler<K>
  ): () => void {
    const subscription = { key, handler } as unknown as Subscription<StateKey>;
    this.subscriptions.push(subscription);

    // Return unsubscribe function
    return () => {
      const index = this.subscriptions.indexOf(subscription);
      if (index !== -1) {
        this.subscriptions.splice(index, 1);
      }
    };
  }

  private notifySubscribers<K extends StateKey>(
    key: K,
    newValue: GameState[K],
    oldValue: GameState[K]
  ): void {
    for (const sub of this.subscriptions) {
      if (sub.key === key) {
        (sub.handler as StateChangeHandler<K>)(newValue, oldValue);
      }
    }
  }

  // =========================================================================
  // SNAPSHOT / RESTORE
  // =========================================================================

  /**
   * Get a full snapshot of current state (for save system)
   */
  snapshot(): GameState {
    return JSON.parse(JSON.stringify(this.state)) as GameState;
  }

  /**
   * Restore state from a snapshot (for load system)
   */
  restore(snapshot: GameState): void {
    if (this.historyEnabled) {
      this.recordHistory();
    }

    const oldState = this.state;
    this.state = JSON.parse(JSON.stringify(snapshot)) as GameState;

    // Notify all subscribers of potential changes
    for (const key of Object.keys(this.state) as StateKey[]) {
      if (oldState[key] !== this.state[key]) {
        this.notifySubscribers(key, this.state[key], oldState[key]);
      }
    }
  }

  /**
   * Reset to default state
   */
  reset(): void {
    this.restore(DEFAULT_STATE);
  }

  // =========================================================================
  // HISTORY / UNDO
  // =========================================================================

  /**
   * Enable state history for undo support
   */
  enableHistory(maxSize = 50): void {
    this.historyEnabled = true;
    this.maxHistorySize = maxSize;
  }

  /**
   * Disable state history
   */
  disableHistory(): void {
    this.historyEnabled = false;
  }

  /**
   * Undo the last state change
   */
  undo(): boolean {
    if (this.history.length === 0) return false;

    const previousState = this.history.pop()!;
    const oldState = this.state;
    this.state = previousState;

    // Notify subscribers
    for (const key of Object.keys(this.state) as StateKey[]) {
      if (oldState[key] !== this.state[key]) {
        this.notifySubscribers(key, this.state[key], oldState[key]);
      }
    }

    return true;
  }

  /**
   * Clear state history
   */
  clearHistory(): void {
    this.history = [];
  }

  private recordHistory(): void {
    this.history.push(JSON.parse(JSON.stringify(this.state)) as GameState);

    while (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  // =========================================================================
  // HELPERS
  // =========================================================================

  private mergeWithDefaults(
    partial?: DeepPartial<GameState>,
    base: GameState = DEFAULT_STATE
  ): GameState {
    if (!partial) return { ...base };

    return {
      ...base,
      ...partial,
      flags: { ...base.flags, ...(partial.flags ?? {}) },
      counters: { ...base.counters, ...(partial.counters ?? {}) },
      visitedScenes: partial.visitedScenes ?? [...base.visitedScenes],
      endings: partial.endings ?? [...base.endings],
      notesUnlocked: partial.notesUnlocked ?? [...base.notesUnlocked],
      achievementsUnlocked:
        partial.achievementsUnlocked ?? [...base.achievementsUnlocked],
      discoveredCodes: partial.discoveredCodes ?? [...base.discoveredCodes],
    } as GameState;
  }
}

// Singleton instance for game-wide state
export const stateManager = new StateManager();
