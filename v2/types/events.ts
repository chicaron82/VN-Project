/**
 * ════════════════════════════════════════════════════════════════
 * EVENT TYPES - EVENTBUS EVENT DEFINITIONS
 * Type-safe event system for game-wide communication
 * ════════════════════════════════════════════════════════════════
 *
 * This module defines all events that can be emitted/subscribed via EventBus.
 * Each event has a typed payload for compile-time safety.
 *
 * Event Categories:
 * - scene:* - Scene loading and progression
 * - dialog:* - Dialog display and advancement
 * - choice:* - Player choice system
 * - tether:* - Tether (consciousness) mechanics
 * - save/load:* - Save system
 * - achievement:* - Achievement unlocks
 * - visual:* - Visual cues and effects
 * - effect:* - Screen effects (glitch, shake, flash)
 * - sprite:* - Sprite management
 * - ui:* - UI state changes
 * - input:* - Input gestures (swipe, tap)
 * - settings:* - Settings changes
 * - note:* - Note collection
 * - secret_code:* - Secret code system
 * - autosave:* - Automatic save system
 *
 * 💚🔥💀
 */

/**
 * Complete event registry - maps event names to their payload types
 * Used by EventBus for type-safe emit/subscribe
 */
export type GameEvents = {
    // ==========================================
    // SCENE & NARRATIVE FLOW
    // ==========================================

    /** Scene is being loaded */
    'scene:load': { sceneId: string };
    /** Scene has completed (before transition) */
    'scene:complete': { sceneId: string };

    // ==========================================
    // DIALOG SYSTEM
    // ==========================================

    /** Dialog line is being displayed */
    'dialog:show': { entry: { character: string; text: string } };
    /** Dialog has completed display */
    'dialog:complete': {};
    /** Player advanced dialog */
    'dialog:advance': {};
    /** Dialog is being skipped */
    'dialog:skipping': {};
    /** Check if dialog should scroll */
    'dialog:scroll_check': {};
    /** Dialog bubble shown */
    'dialog:bubble:shown': {};
    /** Dialog bubble hidden */
    'dialog:bubble:hidden': {};

    // ==========================================
    // CHOICE SYSTEM
    // ==========================================

    /** Choices are being presented to player */
    'choice:show': { choices: Array<{ text: string; next: string | null }> };
    /** Player selected a choice */
    'choice:selected': { choiceId: string; text: string };

    // ==========================================
    // TETHER MECHANICS (Consciousness Stability)
    // ==========================================

    /** Tether level changed */
    'tether:change': { level: number; delta: number };
    /** Tether reached critical level */
    'tether:critical': { level: number };
    /** Tether boosted (Hold On button) */
    'tether:boost': { amount: number };
    /** Tether depleted (death/restart) */
    'tether:death': {};

    // ==========================================
    // SAVE/LOAD SYSTEM
    // ==========================================

    /** Save completed successfully */
    'save:complete': { slot: number };
    /** Load completed successfully */
    'load:complete': { slot: number };

    // ==========================================
    // AUTOSAVE SYSTEM
    // ==========================================

    /** Autosave started */
    'autosave:start': { reason: string };
    /** Autosave completed */
    'autosave:complete': { success: boolean; slot: number };

    // ==========================================
    // ACHIEVEMENTS
    // ==========================================

    /** Achievement unlock triggered */
    'achievement:unlock': { id: string };
    /** Achievement unlocked (with full data) */
    'achievement:unlocked': { id: string; title: string; description: string; icon: string };

    // ==========================================
    // VISUAL CUES & EFFECTS
    // ==========================================

    /** Visual cue triggered (sensory system) */
    'visual:cue': { type: string | null; channel: string; sceneId?: string };

    /** Code rain effect */
    'effect:code_rain': { duration: number };
    /** Glitch effect */
    'effect:glitch': { intensity: number };
    /** Screen shake effect */
    'effect:shake': { intensity: string };
    /** Flash effect */
    'effect:flash': { color: string; duration: number };
    /** Echo merge animation started */
    'effect:echo_merge_start': {};
    /** Echo merge animation completed */
    'effect:echo_merge_complete': {};

    // ==========================================
    // SPRITE SYSTEM
    // ==========================================

    /** Show echo group sprites */
    'sprite:show_echo_group': {};
    /** Set echo stage (act progression) */
    'sprite:set_echo_stage': { stage: 'act1' | 'act2' | 'act3' };
    /** Trigger echo merge cinematic */
    'sprite:trigger_echo_merge': { callback?: () => void };
    /** Hide all sprites */
    'sprite:hide_all': {};

    // ==========================================
    // LOADING SYSTEM
    // ==========================================

    /** Loading started */
    'loading:start': { total?: number };
    /** Loading progress update */
    'loading:progress': { current: number; total: number; file: string };
    /** Loading completed */
    'loading:complete': { total: number };
    /** Loading ended */
    'loading:end': {};

    // ==========================================
    // SKIP SYSTEM
    // ==========================================

    /** Skip mode toggled */
    'skip:toggle': {};
    /** Skip mode activated */
    'skip:activate': {};
    /** Skip mode deactivated */
    'skip:deactivate': {};
    /** Skip mode state changed */
    'skip:active': { isSkipping: boolean };

    // ==========================================
    // UI NAVIGATION & STATE
    // ==========================================

    /** UI screen changed */
    'ui:screen_change': { screen: string };
    /** Game view reset requested */
    'game:reset_view': {};
    /** Show route selection screen */
    'ui:show_route_select': {};
    /** Show skip confirmation prompt */
    'ui:show_skip_prompt': {};
    /** UI click occurred */
    'ui:click': {};
    /** UI confirmation */
    'ui:confirm': {};
    /** UI action denied */
    'ui:denied': {};
    /** Pause menu toggled */
    'ui:pause_toggle': {};
    /** Return to main menu */
    'ui:main_menu': {};
    /** Start game with route */
    'ui:start_game': { route: 'ronnie' | 'tori' };
    /** Route selection screen */
    'ui:route_select': {};
    /** Start prologue */
    'ui:start_prologue': {};
    /** Route changed */
    'ui:route_changed': { route: string };

    // ==========================================
    // UI OVERLAYS & PANELS
    // ==========================================

    /** Backlog toggled */
    'ui:backlog:toggle': {};

    /** Shade opened */
    'ui:shade:open': {};
    /** Shade closed */
    'ui:shade:close': {};
    /** Shade toggled */
    'ui:shade:toggle': {};
    /** Shade opened (confirmation) */
    'ui:shade:opened': {};
    /** Shade closed (confirmation) */
    'ui:shade:closed': {};

    /** Sidebar opened */
    'ui:sidebar:open': {};
    /** Sidebar closed */
    'ui:sidebar:close': {};
    /** Sidebar toggled */
    'ui:sidebar:toggle': {};
    /** Sidebar opened (confirmation) */
    'ui:sidebar:opened': {};
    /** Sidebar closed (confirmation) */
    'ui:sidebar:closed': {};

    // ==========================================
    // STATUS BAR & HUD
    // ==========================================

    /** Show status bar */
    'ui:show_status_bar': {};
    /** Hide status bar */
    'ui:hide_status_bar': {};
    /** Status bar update */
    'ui:status_update': { context: string; detail?: string };

    // ==========================================
    // MENU SCREENS
    // ==========================================

    /** Save menu opened */
    'ui:save_menu': {};
    /** Load menu opened */
    'ui:load_menu': {};
    /** Settings menu opened/toggled */
    'ui:settings': {};
    'ui:settings:toggle': {};
    /** Credits screen */
    'ui:credits': {};
    'ui:show_credits': {};
    /** Crew portraits screen */
    'ui:show_crew': {};
    /** Main menu */
    'ui:show_main_menu': {};
    /** Retry screen (after death) */
    'ui:show_retry_screen': { currentRoute: string; loopVersion: number };
    /** Retry choice selected */
    'ui:retry_choice': { choice: 'restart_route' | 'change_perspective'; route?: 'ronnie' | 'tori' };
    /** Notes menu */
    'ui:notes': {};
    'ui:notes:open': {};
    'ui:notes_closed': {};

    // ==========================================
    // INPUT GESTURES
    // ==========================================

    /** Swipe left gesture */
    'input:swipe_left': {};
    /** Swipe right gesture */
    'input:swipe_right': {};
    /** Swipe up gesture */
    'input:swipe_up': {};
    /** Swipe down gesture */
    'input:swipe_down': {};
    /** Double tap gesture */
    'input:double_tap': {};

    // ==========================================
    // SETTINGS
    // ==========================================

    /** Settings menu opened */
    'settings:open': {};
    /** Settings menu closed */
    'settings:close': {};
    /** Setting value changed */
    'settings:changed': { key: string; value: unknown };

    // ==========================================
    // NOTE COLLECTION SYSTEM
    // ==========================================

    /** Note collected (full data) */
    'note:collected': { id: string; title: string; sender: string; content?: string; count: number };
    /** Note toast notification shown */
    'note:toast': { noteId: string; title: string };
    /** Secret code revealed from RNG */
    'code:revealed': { noteId: string; code: string };

    // ==========================================
    // SECRET CODE SYSTEM
    // ==========================================

    /** Secret code submitted */
    'secret_code:submit': { code: string };
    /** Secret code unlocked */
    'secret_code:unlocked': { code: string; name: string };
    /** Code submission (UI) */
    'ui:code_submit': { code: string };
};

/**
 * Event name - any key from GameEvents
 */
export type EventName = keyof GameEvents;

/**
 * Event callback function - typed based on event name
 */
export type EventCallback<T extends EventName> = (data: GameEvents[T]) => void;
