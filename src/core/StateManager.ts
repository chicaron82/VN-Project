/**
 * StateManager - Reactive State Management
 * 
 * Centralized state management with:
 * - Path-based access (dot notation)
 * - Deep cloning for immutability
 * - Reactive subscriptions
 * - localStorage persistence
 */

/**
 * State change callback
 */
export type StateChangeCallback = (newValue: unknown, oldValue: unknown) => void;

/**
 * StateManager - Reactive state management system
 * 
 * Features:
 * - Path-based state access (e.g., 'game.currentScene')
 * - Deep cloning to prevent mutations
 * - Subscription-based reactivity
 * - localStorage persistence
 */
export class StateManager {
  private state: Record<string, unknown>;
  private subscribers: Map<string, Set<StateChangeCallback>>;
  private isDirty: boolean;
  private persistenceKey: string;

  constructor(initialState: Record<string, unknown> = {}, persistenceKey = 'vn_state') {
    this.state = this.deepClone(initialState);
    this.subscribers = new Map();
    this.isDirty = false;
    this.persistenceKey = persistenceKey;
  }

  /**
   * Get a value from state by path
   * Returns a deep clone to prevent external mutations
   * 
   * @param path - Dot-notation path (e.g., 'game.currentScene')
   * @returns Deep cloned value at path, or undefined if not found
   * 
   * @example
   * const sceneId = stateManager.get('game.currentScene');
   */
  get(path: string): unknown {
    const value = this.getByPath(this.state, path);

    // Return deep clone to prevent external mutations
    if (value !== undefined && value !== null && typeof value === 'object') {
      return this.deepClone(value);
    }

    return value;
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
    const clonedValue = this.deepClone(value);
    const oldValue = this.get(path);

    // Only update if value changed
    if (this.deepEqual(oldValue, clonedValue)) {
      return;
    }

    // Set the value
    this.setByPath(this.state, path, clonedValue);
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
   *   console.log(`Tether: ${oldLevel} → ${newLevel}`);
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
      const callbacks = this.subscribers.get(path);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

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
      console.error('Failed to save state:', error);
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
            console.error(`Error in state subscription for ${path}:`, error);
          }
        });
      });

      return true;
    } catch (error) {
      console.error('Failed to load state:', error);
      return false;
    }
  }

  /**
   * Get entire state object (deep cloned)
   */
  getAll(): Record<string, unknown> {
    return this.deepClone(this.state) as Record<string, unknown>;
  }

  /**
   * Replace entire state
   */
  setAll(newState: Record<string, unknown>): void {
    this.state = this.deepClone(newState);
    this.isDirty = true;

    // Notify all subscribers
    this.subscribers.forEach((callbacks, path) => {
      const value = this.get(path);
      const oldValue = undefined; // Can't determine old value on full replace
      callbacks.forEach((callback) => {
        try {
          callback(value, oldValue);
        } catch (error) {
          console.error(`Error in state subscription for ${path}:`, error);
        }
      });
    });
  }

  // ========================================
  // PRIVATE HELPER METHODS
  // ========================================

  private getByPath(obj: Record<string, unknown>, path: string): unknown {
    if (typeof path !== 'string') return undefined; // Fallback for invalid calls
    const parts = path.split('.');
    let current: unknown = obj;

    for (const part of parts) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return undefined;
      }
      current = (current as Record<string, unknown>)[part];
    }

    return current;
  }

  private setByPath(obj: Record<string, unknown>, path: string, value: unknown): void {
    const parts = path.split('.');
    const lastPart = parts.pop()!;

    let current: Record<string, unknown> = obj;

    for (const part of parts) {
      if (!(part in current) || typeof current[part] !== 'object' || current[part] === null) {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }

    current[lastPart] = value;
  }

  private notifySubscribers(path: string, newValue: unknown, oldValue: unknown): void {
    const callbacks = this.subscribers.get(path);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(newValue, oldValue);
        } catch (error) {
          console.error(`Error in state subscription for ${path}:`, error);
        }
      });
    }
  }

  private deepClone<T>(value: T): T {
    if (value === null || typeof value !== 'object') {
      return value;
    }

    if (value instanceof Date) {
      return new Date(value.getTime()) as unknown as T;
    }

    if (value instanceof Array) {
      return value.map((item) => this.deepClone(item)) as unknown as T;
    }

    if (typeof value === 'object') {
      const cloned = {} as Record<string, unknown>;
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          cloned[key] = this.deepClone((value as Record<string, unknown>)[key]);
        }
      }
      return cloned as T;
    }

    return value;
  }

  private deepEqual(a: unknown, b: unknown): boolean {
    if (a === b) {
      return true;
    }

    if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
      return false;
    }

    if (a instanceof Array && b instanceof Array) {
      if (a.length !== b.length) {
        return false;
      }
      return a.every((item, index) => this.deepEqual(item, b[index]));
    }

    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);

    if (keysA.length !== keysB.length) {
      return false;
    }

    return keysA.every((key) =>
      keysB.includes(key) &&
      this.deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    );
  }
}
