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
    /** Tether frozen (dev command) */
    'tether:freeze': {};
    /** Tether resumed (dev command) */
    'tether:resume': {};
    /** Tether set to specific value (dev command) */
    'tether:set': { value: number };
    /** Tether warning threshold */
    'tether:warning': { level: number };

    // ==========================================
    // SAVE/LOAD SYSTEM
    // ==========================================

    /** Save completed successfully */
    'save:complete': { slot: number };
    /** Load completed successfully */
    'load:complete': { slot: number };
    /** Quick save */
    'save:quick': {};
    /** Quick load */
    'load:quick': {};
    /** Save completed with metadata */
    'save:completed': { slot: number; isAutoSave: boolean };

    // ==========================================
    // SCENE/ROUTE LIFECYCLE
    // ==========================================

    /** Scene fully loaded and displayed */
    'scene:loaded': {};
    /** Player's route changed */
    'route:changed': {};
    /** Note added to collection */
    'note:added': {};

    // ==========================================
    // PAUSE SYSTEM
    // ==========================================

    /** Pause requested */
    'pause:requested': { reason: string };
    /** Pause released */
    'pause:released': { reason: string };
    /** Force release all pauses */
    'pause:force_released': { reasons: string[] };

    // ==========================================
    // HAPTIC FEEDBACK
    // ==========================================

    /** Trigger haptic feedback */
    'haptic:trigger': { type: 'light' | 'medium' | 'heavy' };

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
    'effect:code_rain': { duration: number; color?: string };
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
    /** Game ending reached */
    'game:ending': { endingId: string };
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
    /** Backlog opened */
    'ui:backlog:open': {};
    /** Backlog closed */
    'ui:backlog:close': {};

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
    /** Notes closed */
    'ui:notes:close': {};
    /** Save/Load menu closed */
    'ui:save_load:close': {};
    /** Dev console opened */
    'ui:console:open': {};
    /** Dev console closed */
    'ui:console:close': {};
    /** Ending screen closed */
    'ui:ending:close': {};
    /** Hide HUD */
    'ui:hide_hud': {};
    /** Achievements panel opened */
    'ui:achievements:open': {};

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
    /** Secret code discovered */
    'secret_code:discovered': { code: string; name: string };
    /** Code submission (UI) */
    'ui:code_submit': { code: string };

    // ==========================================
    // STATE MANAGEMENT
    // ==========================================

    /** State reset */
    'state:reset': {};
    /** State restored from save */
    'state:restore': { sceneId: string; reason: string };

    // ==========================================
    // UI NOTIFICATIONS
    // ==========================================

    /** Generic UI notification */
    'ui:notification': { type: 'info' | 'success' | 'warning' | 'error'; message: string };
    /** Toast notification */
    'ui:toast': { message: string; duration?: number };

    // ==========================================
    // BACK BUTTON / MENU MANAGER
    // ==========================================

    /** Menu opened */
    'ui:menu:open': {};
    /** Menu closed */
    'ui:menu:close': {};
    /** Request to close shade (back button) */
    'ui:shade:close_request': {};
    /** Request to close sidebar (back button) */
    'ui:sidebar:close_request': {};
    /** Request to close backlog (back button) */
    'ui:backlog:close_request': {};
    /** Request to close menu (back button) */
    'ui:menu:close_request': {};

    // ==========================================
    // SHELL INTEGRATION
    // ==========================================

    /** Request to exit back to shell (iframe embedded) */
    'shell:exit': {};

    // ==========================================
    // LOOP CONTROLLER
    // Zee's meta-narrative tracking system 🖤
    // ==========================================

    /** Loop version incremented */
    'loop:incremented': { version: number; status: string };
    /** Loop state updated */
    'loop:updated': { version: number; status: 'attempting' | 'succeeded' | 'accepted' };
    /** Loop broken — TRUE ENDING */
    'loop:broken': { version: number; status: 'attempting' | 'succeeded' | 'accepted' };
    /** Loop accepted — DIGITAL FOREVER */
    'loop:accepted': { version: number; status: 'attempting' | 'succeeded' | 'accepted' };
    /** Loop reset (dev) */
    'loop:reset': { version: number; status: 'attempting' | 'succeeded' | 'accepted' };
    /** Player chose to retry after bad ending */
    'loop:retry': {};
    /** Loop title display updated */
    'loop:titleUpdated': { version: number; status: 'attempting' | 'succeeded' | 'accepted' };
    /** Ronnie notes unlocked */
    'notes:ronnie_unlocked': {};

    // ==========================================
    // ENDING TRIGGERS
    // ==========================================

    /** TRUE ENDING achieved */
    'ending:true': {};
    /** DIGITAL FOREVER chosen */
    'ending:digitalForever': {};
    /** Bad ending — increment version */
    'ending:bad': {};
    /** Retry from ending */
    'ending:retry': { endingType: string | null };
    /** Accept ending */
    'ending:accept': { endingType: string | null };
    /** Exit from ending */
    'ending:exit': { endingType: string | null };

    // ==========================================
    // ECHO MEMORY SYSTEM
    // Belle's meta-awareness tracking 🖤
    // ==========================================

    /** Echo comment triggered */
    'echo:comment': {
        echo: 'hope' | 'gentle' | 'despair';
        message: string;
        icon: string;
        awareness: 0 | 1 | 2 | 3 | 4;
        context: 'general' | 'despairHijack' | 'noteHunting' | 'saveScum' | 'repeatedDeath' | 'longPause';
    };
    /** Echo loop recorded */
    'echo:loop_recorded': {
        totalLoops: number;
        awareness: { hope: number; gentle: number; despair: number };
    };
    /** Echo memory reset (dev) */
    'echo:reset': {};

    // ==========================================
    // INSANE VISUALS CONTROLLER
    // DiZee's visual corruption system 💀
    // ==========================================

    /** Activate INSANE mode visuals */
    'insane:activate': {};
    /** Deactivate INSANE mode visuals */
    'insane:deactivate': {};
    /** Confirmation: visuals now active */
    'insane:activated': {};
    /** Confirmation: visuals now inactive */
    'insane:deactivated': {};
    /** Trigger corruption effects */
    'insane:corrupt': {};
    /** Corruption effect triggered */
    'insane:corruption_triggered': { intensity: 'light' | 'medium' | 'heavy' | 'maximum' };
    /** Show cage overlay */
    'insane:cage': { callback?: () => void };
    /** Cage overlay sequence finished */
    'insane:cage_complete': {};

    // ==========================================
    // SECRET CODES & EASTER EGGS
    // DiZee's discovery system 🔓
    // ==========================================

    'easter_egg:konami_controller': {};
    'easter_egg:torigatchi': {};
    'easter_egg:ronniegatchi': {};
    'easter_egg:always': {};
    'easter_egg:uv7crew': {};
    'easter_egg:echo': {};
    'easter_egg:848': { attempt: number };
    'easter_egg:dizee': {};

    // ==========================================
    // NOTIFICATION RAIL (Phase 26d)
    // Premium notification system 🔔
    // ==========================================

    /** Show notification */
    'notification:show': {
        id?: string;
        title: string;
        message: string;
        icon?: string;
        category?: 'system' | 'torigatchi' | 'achievement' | 'autosave' | 'tether' | 'note' | 'app';
        priority?: 'urgent' | 'high' | 'normal' | 'low';
        duration?: number;
        actionLabel?: string;
        actionCallback?: () => void;
        appId?: string;
        dismissible?: boolean;
    };
    /** Dismiss notification */
    'notification:dismiss': { id: string };
    /** Clear all notifications */
    'notification:clear_all': {};
    /** Notification shown confirmation */
    'notification:shown': { id: string; category: string };
    /** Notification dismissed confirmation */
    'notification:dismissed': { id: string };
    /** Badge count update */
    'notification:badge_update': { appId: string; count: number };

    // ==========================================
    // TORIGATCHI & APP SYSTEM
    // ==========================================

    /** Torigatchi hunger warning */
    'torigatchi:hunger_warning': { message?: string; urgent?: boolean };
    /** Game autosave trigger */
    'game:autosave': { scene?: string };
    /** Note received (app notification) */
    'note:received': { id?: string; sender?: string; preview?: string; title?: string };
    /** Launch app */
    'app:launch': { appId: string };
};

/**
 * Event name - any key from GameEvents
 */
export type EventName = keyof GameEvents;

/**
 * Event callback function - typed based on event name
 */
export type EventCallback<T extends EventName> = (data: GameEvents[T]) => void;
