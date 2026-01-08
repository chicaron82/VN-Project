/**
 * UV7 V2 EventBus
 *
 * A type-safe, centralized event system for game-wide communication.
 * All game events flow through here, enabling loose coupling between systems.
 *
 * Features:
 * - Fully typed events (no magic strings)
 * - Priority-based listener ordering
 * - One-time listeners (once)
 * - Event history for debugging
 * - Wildcard listeners for logging/debugging
 */

import type { GameEvents, EventHandler } from './types.ts';

interface ListenerEntry<K extends keyof GameEvents> {
  handler: EventHandler<K>;
  priority: number;
  once: boolean;
}

interface EventHistoryEntry<K extends keyof GameEvents> {
  event: K;
  payload: GameEvents[K];
  timestamp: number;
}

export class EventBus {
  private listeners = new Map<
    keyof GameEvents,
    Array<ListenerEntry<keyof GameEvents>>
  >();

  private wildcardListeners: Array<
    (event: keyof GameEvents, payload: unknown) => void
  > = [];

  private history: Array<EventHistoryEntry<keyof GameEvents>> = [];
  private historyEnabled = false;
  private maxHistorySize = 100;

  /**
   * Subscribe to an event
   *
   * @param event - The event name to listen for
   * @param handler - The callback function
   * @param options - Optional configuration (priority, once)
   * @returns Unsubscribe function
   */
  on<K extends keyof GameEvents>(
    event: K,
    handler: EventHandler<K>,
    options: { priority?: number; once?: boolean } = {}
  ): () => void {
    const { priority = 0, once = false } = options;

    const entry: ListenerEntry<K> = { handler, priority, once };

    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    const eventListeners = this.listeners.get(event)!;
    eventListeners.push(entry as ListenerEntry<keyof GameEvents>);

    // Sort by priority (higher priority first)
    eventListeners.sort((a, b) => b.priority - a.priority);

    // Return unsubscribe function
    return () => this.off(event, handler);
  }

  /**
   * Subscribe to an event for a single emission only
   */
  once<K extends keyof GameEvents>(
    event: K,
    handler: EventHandler<K>,
    options: { priority?: number } = {}
  ): () => void {
    return this.on(event, handler, { ...options, once: true });
  }

  /**
   * Unsubscribe from an event
   */
  off<K extends keyof GameEvents>(event: K, handler: EventHandler<K>): void {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners) return;

    const index = eventListeners.findIndex((entry) => entry.handler === handler);
    if (index !== -1) {
      eventListeners.splice(index, 1);
    }

    // Cleanup empty listener arrays
    if (eventListeners.length === 0) {
      this.listeners.delete(event);
    }
  }

  /**
   * Emit an event to all subscribed listeners
   */
  emit<K extends keyof GameEvents>(
    event: K,
    ...args: GameEvents[K] extends undefined ? [] : [GameEvents[K]]
  ): void {
    const payload = args[0] as GameEvents[K];

    // Record to history if enabled
    if (this.historyEnabled) {
      this.recordHistory(event, payload);
    }

    // Notify wildcard listeners
    for (const listener of this.wildcardListeners) {
      listener(event, payload);
    }

    // Notify specific event listeners
    const eventListeners = this.listeners.get(event);
    if (!eventListeners) return;

    // Create a copy to allow modifications during iteration
    const listenersCopy = [...eventListeners];

    for (const entry of listenersCopy) {
      const handler = entry.handler as EventHandler<K>;

      if (payload === undefined) {
        (handler as () => void)();
      } else {
        handler(payload);
      }

      // Remove one-time listeners
      if (entry.once) {
        this.off(event, handler);
      }
    }
  }

  /**
   * Subscribe to ALL events (useful for debugging/logging)
   */
  onAny(handler: (event: keyof GameEvents, payload: unknown) => void): () => void {
    this.wildcardListeners.push(handler);
    return () => {
      const index = this.wildcardListeners.indexOf(handler);
      if (index !== -1) {
        this.wildcardListeners.splice(index, 1);
      }
    };
  }

  /**
   * Check if an event has any listeners
   */
  hasListeners(event: keyof GameEvents): boolean {
    const listeners = this.listeners.get(event);
    return listeners !== undefined && listeners.length > 0;
  }

  /**
   * Get the number of listeners for an event
   */
  listenerCount(event: keyof GameEvents): number {
    return this.listeners.get(event)?.length ?? 0;
  }

  /**
   * Remove all listeners for an event (or all events if none specified)
   */
  removeAllListeners(event?: keyof GameEvents): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
      this.wildcardListeners = [];
    }
  }

  // =========================================================================
  // DEBUGGING / HISTORY
  // =========================================================================

  /**
   * Enable event history recording
   */
  enableHistory(maxSize = 100): void {
    this.historyEnabled = true;
    this.maxHistorySize = maxSize;
  }

  /**
   * Disable event history recording
   */
  disableHistory(): void {
    this.historyEnabled = false;
  }

  /**
   * Get recorded event history
   */
  getHistory(): ReadonlyArray<EventHistoryEntry<keyof GameEvents>> {
    return [...this.history];
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.history = [];
  }

  private recordHistory<K extends keyof GameEvents>(
    event: K,
    payload: GameEvents[K]
  ): void {
    this.history.push({
      event,
      payload,
      timestamp: Date.now(),
    } as EventHistoryEntry<keyof GameEvents>);

    // Trim history if it exceeds max size
    while (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }
}

// Singleton instance for game-wide event bus
export const eventBus = new EventBus();
