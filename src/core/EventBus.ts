/**
 * EventBus - Centralized Event System
 * 
 * DIZEE POLISH: Type-safe pub/sub for decoupled communication
 * 
 * Type-safe pub/sub event system for decoupled communication.
 * Provides event history for debugging and type safety for all events.
 * 
 * V1 had direct method calls everywhere - tight coupling nightmare.
 * V2 uses EventBus - systems talk through events, not direct references.
 */

/**
 * Game event type definitions
 * Extend this type as new events are added
 */
export type GameEvents = {
  'scene:load': { sceneId: string };
  'scene:complete': { sceneId: string };
  'dialog:show': { entry: { character: string; text: string } };
  'choice:show': { choices: Array<{ text: string; next: string | null }> };
  'choice:selected': { choiceId: string; text: string };
  'tether:change': { level: number; delta: number };
  'tether:critical': { level: number };
  'save:complete': { slot: number };
  'load:complete': { slot: number };
  'achievement:unlock': { id: string };
  'achievement:unlocked': { id: string; title: string; description: string; icon: string };
  'visual:cue': { type: string | null; channel: string };
  'loading:start': { total?: number };
  'loading:progress': { current: number; total: number; file: string };
  'loading:complete': { total: number };
  'loading:end': {};
  'tether:boost': { amount: number };
  'tether:death': {};
  'ui:screen_change': { screen: string };
  'game:reset_view': {};
  'effect:code_rain': { duration: number };
  'effect:glitch': { intensity: number };
  'effect:shake': { intensity: string };
  'effect:flash': { color: string; duration: number };
  'effect:echo_merge_start': {};
  'effect:echo_merge_complete': {};
  // Sprite controller events
  'sprite:show_echo_group': {};
  'sprite:set_echo_stage': { stage: 'act1' | 'act2' | 'act3' };
  'sprite:trigger_echo_merge': { callback?: () => void };
  'sprite:hide_all': {};
  'dialog:complete': {};
  'dialog:advance': {};
  'dialog:skipping': {};
  'dialog:scroll_check': {};
  // Skip system events
  'skip:toggle': {};
  'skip:activate': {};
  'skip:deactivate': {};
  'skip:active': { isSkipping: boolean };
  'ui:show_route_select': {};
  'ui:show_skip_prompt': {};
  'ui:click': {};
  'ui:confirm': {};
  'ui:denied': {};
  'ui:pause_toggle': {};
  'ui:main_menu': {};
  'ui:start_game': { route: 'ronnie' | 'tori' };
  'ui:route_select': {};
  'ui:start_prologue': {};
  'dialog:bubble:shown': {};
  'dialog:bubble:hidden': {};
  // UI Events
  'ui:backlog:toggle': {};
  'ui:shade:open': {};
  'ui:shade:close': {};
  'ui:shade:toggle': {};
  'ui:shade:opened': {};
  'ui:shade:closed': {};
  'ui:sidebar:open': {};
  'ui:sidebar:close': {};
  'ui:sidebar:toggle': {};
  // Input events
  'input:swipe_left': {};
  'input:swipe_right': {};
  'input:swipe_up': {};
  'input:swipe_down': {};
  'input:double_tap': {};
  // Settings & HUD events
  'settings:open': {};
  'settings:close': {};
  'settings:changed': { key: string; value: any };
  'ui:show_status_bar': {};
  'ui:hide_status_bar': {};
  'ui:route_changed': { route: string };
  'note:collected': { id: string; title: string; sender: string; content?: string, count: number }; // DIZEE: Detailed note payload
  'note:toast': { noteId: string; title: string }; // Toast notification shown
  'code:revealed': { noteId: string; code: string }; // RNG code drop revealed
  'ui:notes:open': {};
  'ui:notes_closed': {};
  'secret_code:submit': { code: string };
  'secret_code:unlocked': { code: string; name: string };
  'ui:save_menu': {};
  'ui:load_menu': {};
  'ui:settings': {};
  'ui:credits': {};
  'ui:show_credits': {};
  'ui:show_crew': {};  // "Meet the Crew" portrait screens (TODO: port CrewScreen from V1)
  'ui:show_main_menu': {};
  'ui:show_retry_screen': { currentRoute: string; loopVersion: number };
  'ui:retry_choice': { choice: 'restart_route' | 'change_perspective'; route?: 'ronnie' | 'tori' };
  'ui:code_submit': { code: string };
  'ui:notes': {}; // Added for MenuCarousel
  // Auto-save events
  'autosave:start': { reason: string };
  'autosave:complete': { success: boolean; slot: number };

  // Missing Events Added for V2 Build
  'state:reset': {};
  'state:restore': { sceneId: string; reason: string };
  'ui:notification': { type: 'info' | 'success' | 'warning' | 'error'; message: string };
  'ui:backlog:open': {};
  'ui:backlog:close': {};
  'ui:notes:close': {}; // ui:notes:open is usually just ui:notes
  'ui:save_load:close': {};
  'ui:console:close': {}; // Dev console
  'ui:ending:close': {};
  'ui:hide_hud': {};
  'save:quick': {};
  'load:quick': {};

  // ========================================
  // LOOP CONTROLLER EVENTS
  // Zee's meta-narrative tracking system 🖤
  // ========================================
  'loop:updated': { version: number; status: 'attempting' | 'succeeded' | 'accepted' };
  'loop:broken': { version: number; status: 'attempting' | 'succeeded' | 'accepted' };   // TRUE ENDING
  'loop:accepted': { version: number; status: 'attempting' | 'succeeded' | 'accepted' }; // DIGITAL FOREVER
  'loop:reset': { version: number; status: 'attempting' | 'succeeded' | 'accepted' };    // Dev reset
  'loop:retry': {};  // Player chose to retry after bad ending
  'loop:titleUpdated': { version: number; status: 'attempting' | 'succeeded' | 'accepted' };

  // Ending triggers (fire these to update loop state)
  'ending:true': {};           // TRUE ENDING achieved
  'ending:digitalForever': {}; // DIGITAL FOREVER chosen
  'ending:bad': {};            // Bad ending - increment version

  // ========================================
  // ECHO MEMORY SYSTEM EVENTS
  // Belle's meta-awareness tracking 🖤
  // ========================================
  'echo:comment': {
    echo: 'hope' | 'gentle' | 'despair';
    message: string;
    icon: string;
    awareness: 0 | 1 | 2 | 3 | 4;
    context: 'general' | 'despairHijack' | 'noteHunting' | 'saveScum' | 'repeatedDeath' | 'longPause';
  };
  'echo:loop_recorded': {
    totalLoops: number;
    awareness: { hope: number; gentle: number; despair: number };
  };
  'echo:reset': {};  // Dev reset of echo memory
};

export type EventName = keyof GameEvents;
export type EventCallback<T extends EventName> = (data: GameEvents[T]) => void;

/**
 * Event history entry for debugging
 */
interface EventHistoryEntry<T extends EventName = EventName> {
  event: T;
  data: GameEvents[T];
  timestamp: number;
}

/**
 * EventBus - Centralized event system
 * 
 * Features:
 * - Type-safe event names and payloads
 * - Pub/sub pattern
 * - Event history for debugging
 * - Unsubscribe support
 */
export class EventBus {
  private subscribers: Map<EventName, Set<EventCallback<EventName>>>;
  private history: EventHistoryEntry[];
  private maxHistorySize: number;
  private historyEnabled: boolean;

  constructor(maxHistorySize = 100, historyEnabled = true) {
    this.subscribers = new Map();
    this.history = [];
    this.maxHistorySize = maxHistorySize;
    this.historyEnabled = historyEnabled;
  }

  /**
   * Subscribe to an event
   * 
   * @param event - Event name
   * @param callback - Callback function
   * @returns Unsubscribe function
   * 
   * @example
   * const unsubscribe = eventBus.on('scene:load', (data) => {
   *   console.log(`Scene loaded: ${data.sceneId}`);
   * });
   * 
   * // Later:
   * unsubscribe();
   */
  on<T extends EventName>(
    event: T,
    callback: EventCallback<T>
  ): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }

    const callbacks = this.subscribers.get(event)!;
    callbacks.add(callback as EventCallback<EventName>);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(event);
      if (callbacks) {
        callbacks.delete(callback as EventCallback<EventName>);
      }
    };
  }

  /**
   * Emit an event
   * 
   * @param event - Event name
   * @param data - Event data (must match event type)
   * 
   * @example
   * eventBus.emit('scene:load', { sceneId: 'scene1_coffee' });
   */
  emit<T extends EventName>(event: T, data: GameEvents[T]): void {
    // Record in history
    if (this.historyEnabled) {
      this.history.push({
        event,
        data,
        timestamp: Date.now(),
      });

      // Trim history if too large
      if (this.history.length > this.maxHistorySize) {
        this.history.shift();
      }
    }

    // Notify subscribers
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event callback for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Unsubscribe from an event (alternative to using returned function)
   * 
   * @param event - Event name
   * @param callback - Callback to remove
   */
  off<T extends EventName>(event: T, callback: EventCallback<T>): void {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      callbacks.delete(callback as EventCallback<EventName>);
    }
  }

  /**
   * Remove all subscribers for an event (or all events if no event specified)
   * 
   * @param event - Optional event name. If not provided, clears all subscribers
   */
  clear(event?: EventName): void {
    if (event) {
      this.subscribers.delete(event);
    } else {
      this.subscribers.clear();
    }
  }

  /**
   * Get event history
   * 
   * @returns Array of event history entries
   */
  getHistory(): ReadonlyArray<EventHistoryEntry> {
    return [...this.history];
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * Enable/disable event history
   * 
   * @param enabled - Whether to enable history
   */
  setHistoryEnabled(enabled: boolean): void {
    this.historyEnabled = enabled;
  }
}
