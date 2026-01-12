/**
 * GameConfig - Core Configuration
 * 
 * Centralized constants and configuration.
 * Direct port from V1 `game-config.js` to preserve game feel.
 */

// ========================================
// ⚠️ VERSION 848 - DO NOT MODIFY ⚠️
// ========================================
// 
// 848 is NOT a build number.
// It's the loop iteration counter (847 failures + 1 success).
// Change it and you break the entire meta-narrative.
//
// There is no v849. This is the timeline that worked.
// 
// 848 is sacred. 💚🔥💀
// ========================================

export const GameConfig = {

    // ========================================
    // DEVELOPMENT / DEBUGGING
    // ========================================

    DEBUG_MODE: true,  // Enable dev console access via OPENCONSOLE code
    TEST_MODE: false,  // Skip animations, faster loading for testing

    // ========================================
    // GAME METADATA
    // ========================================

    VERSION: {
        CURRENT: '848',              // DO NOT CHANGE - See comment above
        DEFAULT_START: 848,          // DO NOT CHANGE - This is the sacred number
        STORAGE_KEY: 'attemptNumber'
    },

    TITLE: {
        BASE: 'Version',
        SUBTITLE: 'My Wife Is in a Coma... and in the Code'
    },

    // ========================================
    // TETHER SYSTEM CONFIGURATION
    // ========================================

    TETHER: {
        // Starting values
        INITIAL_LEVEL: 100,
        MAX_LEVEL: 100,
        MIN_LEVEL: 0,

        // Decay rates
        DECAY_RATE_BASE: 0.3,           // Gentle passive drain
        DECAY_RATE_MEDIUM: 0.5,         // Below 50%
        DECAY_RATE_CRITICAL: 0.8,       // Below 30%
        DECAY_INTERVAL_MS: 5000,        // Every 5 seconds

        // Difficulty modifiers (affects decay speed)
        DIFFICULTY: {
            RELAXED: 0.5,               // 50% slower decay (more time to read/decide)
            NORMAL: 1.0,                // Default experience
            INTENSE: 1.5                // 50% faster decay (maximum tension)
        },

        // Thresholds
        THRESHOLD_HEALTHY: 60,          // Green zone
        THRESHOLD_WARNING: 30,          // Yellow zone
        THRESHOLD_CRITICAL: 20,         // Red zone + glitches
        THRESHOLD_MEDIUM_DECAY: 50,     // Start gentle acceleration
        THRESHOLD_CRITICAL_DECAY: 30,   // More aggressive decay

        // Hold On button
        HOLD_ON_BOOST: 10,              // Boost amount
        HOLD_ON_COOLDOWN_MS: 8000,      // 8 second cooldown

        // Visual effects
        GLITCH_DURATION_MS: 200,        // Screen glitch duration

        // Color gradients (for tetherFill)
        COLOR_HEALTHY: 'linear-gradient(90deg, #0f0, #0ff)',
        COLOR_WARNING: 'linear-gradient(90deg, #ff0, #0ff)',
        COLOR_CRITICAL: 'linear-gradient(90deg, #f00, #ff0)'
    },

    // ========================================
    // ROUTE POINTS & ENDING DETERMINATION
    // ========================================

    ROUTES: {
        TORI: 'tori',
        RONNIE: 'ronnie'
    },

    ENDINGS: {
        TRUE: 'true',
        BAD: 'bad',
        DIGITAL_FOREVER: 'digitalForever'
    },

    ROUTE_POINTS: {
        // How points are awarded
        CHOICE_MAJOR: 3,
        CHOICE_MINOR: 1,
        HOLD_ON_USE: 1,

        // Point thresholds for ending determination
        INITIAL: {
            bad: 0,
            true: 0,
            digitalForever: 0
        }
    },

    // ========================================
    // COLLECTIBLES CONFIGURATION
    // ========================================

    COLLECTIBLES: {
        TYPES: {
            Z_NOTES: 'z',
            RONNIE_NOTES: 'ronnie',
            TORI_NOTES: 'tori'
        },

        // Maximum collectibles per type
        MAX_Z_NOTES: 10,
        MAX_RONNIE_NOTES: 5,
        MAX_TORI_NOTES: 5,

        // UI notification
        UNLOCK_PULSE_DURATION_MS: 1000
    },

    // ========================================
    // TIMING & ANIMATION CONFIGURATION
    // ========================================

    TIMING: {
        // Scene transitions
        FADE_OUT_MS: 800,
        FADE_IN_MS: 1000,
        MENU_TRANSITION_MS: 100,

        // Typewriter effect
        TYPEWRITER_SPEED_MS: 30,        // Milliseconds per character
        TYPEWRITER_FAST_MS: 15,         // Fast typewriter for urgent scenes

        // Dialogue delays (default scene delays)
        DELAY_SHORT: 2000,
        DELAY_MEDIUM: 3000,
        DELAY_LONG: 4000,
        DELAY_EXTRA_LONG: 5000,

        // Credits
        CREDIT_SCREEN_FADE_MS: 100,

        // Haptic feedback
        HAPTIC_COOLDOWN_MS: 80,         // Anti-spam cooldown for haptics

        // Loading/Splash
        MIN_SPLASH_DURATION_MS: 6000,   // Match splash video length
        MIN_LOADING_ANIMATION_MS: 5500, // Slightly less than video for sync

        // History/Logs
        MAX_DIALOGUE_HISTORY: 100,      // Keep last 100 dialogue entries
        MAX_SENSORY_LOG: 20             // Keep last 20 sensory events for debugging
    },

    // ========================================
    // UI CONFIGURATION
    // ========================================

    UI: {
        // Choice menu
        CHOICE_LOCKED_CLASS: 'locked',
        CHOICE_OPTION_CLASS: 'choice-option',

        // Notes system
        NOTE_ITEM_CLASS: 'note-item',
        NOTE_LOCKED_CLASS: 'note-locked',
        NOTE_EXPANDED_CLASS: 'expanded',

        // Scene styles
        SCENE_STYLE_CRITICAL: 'critical',
        SCENE_STYLE_GLITCH: 'glitch',

        // Save/Load
        SAVE_SLOTS: 6,
        SAVE_SLOT_PREFIX: 'vn_save_slot_',

        // Pause menu classes
        PAUSE_ACTIVE_CLASS: 'active'
    },

    // ========================================
    // ASSET PATHS
    // ========================================

    ASSETS: {
        // Backgrounds
        backgrounds: {
            apartment: 'assets/apartment.webp',
            hospital: 'assets/hospital.webp',
            digitalSpace: 'assets/digitalSpace.webp',
            genericBack: 'assets/genericBack.webp',
            street: 'assets/street.png'
        },

        // Character Sprites
        sprites: {
            ronnie: 'assets/full-sprite-ronnie.webp',
            tori: 'assets/full-sprite-tori.webp',
            oldRonnie: 'assets/full-sprite-oldRonnie.webp',
            // Individual Echo sprites (Tori route)
            echo1: 'assets/full-sprite-echo1.webp',
            echo2: 'assets/full-sprite-echo2.webp',
            despair: 'assets/full-sprite-despair.webp',
            // Route selection sprites
            routeSelectRonnie: 'assets/route-select-ronnie.webp',
            routeSelectTori: 'assets/route-select-tori.webp'
        },

        // UI Assets
        ui: {
            uv7Logo: 'assets/UnitedVoices7.webp',
            menuBackground: 'assets/menu-bg.png',
            menuMobile: 'assets/menumobile.webp',
            uv7Crew: 'assets/the_UV7_crew.webp'
        },

        // Config for preload
        PRELOAD: {
            IMAGES: [
                'menudesktop.png',
                'menumobile.webp',
                'desktopVersion.webp'
            ]
        }
    },

    // ========================================
    // LOADING TIPS
    // ========================================

    LOADING_TIPS: [
        "💡 Both routes reveal the full story",
        "⌨️ Press SPACE or ENTER to advance dialogue",
        "🔍 Some codes are hidden in plain sight",
        "💾 The game auto-saves at key moments",
        "🎮 Try both perspectives for the complete truth",
        "⏸️ Press ESC to pause anytime",
        "📝 Check the Notes menu for discovered secrets",
        "🔄 Each loop remembers what you've learned",
        "👁️ Pay attention to the version number",
        "🎯 Choices matter... but not how you think",
        "🌐 The code is alive. The code is watching.",
        "⚡ Hold SPACE to skip dialogue you've seen",
        "🔓 Secret codes unlock hidden features",
        "💚 Version 848 is not a build number",
        "🔥 The loop has failed 847 times before this"
    ],

    // ========================================
    // SAVE SYSTEM CONFIGURATION
    // ========================================

    SAVE: {
        STORAGE_KEY_PREFIX: 'vn_save_slot_',
        MAX_SLOTS: 6,
        AUTO_SAVE_ENABLED: false,       // Future feature

        // Save data structure version (for migrations)
        VERSION: 1
    },

    // ========================================
    // DEBUG CONFIGURATION
    // ========================================

    DEBUG: {
        enabled: false,  // Set TRUE for development, FALSE for production
        autoSkipPrologue: false, // For testing routes quickly 

        // Granular control (all check DEBUG.enabled first)
        logSceneChanges: true,
        logStateChanges: true,
        logTetherUpdates: true,
        logSaveLoad: true,
        logSensoryFeedback: false,  // Very noisy
        logEasterEggs: true,
    },

    // ========================================
    // BOOTSTRAP PARADOX MECHANICS
    // ========================================

    PARADOX: {
        // Version increment on failure
        INCREMENT_ON_DEATH: true,
        INCREMENT_ON_BAD_END: true,

        // Cassandra framework - The loop counter
        CASSANDRA_FAILED_ATTEMPTS: 847,  // Every failure before v848
        CURRENT_TIMELINE: 848             // The one that worked ✨
    },

    // ========================================
    // KEYBOARD CONTROLS
    // ========================================

    CONTROLS: {
        ADVANCE: ['Space', 'Enter'],
        SKIP_TYPING: ['Space', 'Enter'],
        PAUSE: ['Escape'],

        // Future: Arrow keys for choice navigation
        CHOICE_UP: 'ArrowUp',
        CHOICE_DOWN: 'ArrowDown',
        CHOICE_SELECT: 'Enter'
    },

    // ========================================
    // HAPTIC FEEDBACK PATTERNS
    // ========================================
    HAPTICS: {
        LIGHT: 10,           // Quick tap (UI navigation)
        MEDIUM: 25,          // Standard feedback (choices, buttons)
        STRONG: 50,          // Important actions (confirmations)
        DOUBLE: [25, 50, 25],           // Two taps (toggling, selecting)
        TRIPLE: [20, 40, 20, 40, 20],   // Three taps (special unlocks)
        PULSE: [30, 30, 30, 30, 30],    // Sustained pulse (loading, waiting)
        SUCCESS: [10, 50, 30],          // Success chirp (achievement, unlock)
        WARNING: [50, 100, 50],         // Alert buzz (warning, caution)
        ERROR: [100, 50, 100, 50, 100], // Error shake (failure, blocked)
        HEARTBEAT: [40, 100, 60, 100],  // Slow heartbeat (tension moments)
        GLITCH: [10, 20, 5, 30, 15],    // Glitchy stutter (reality breaks)
        ECHO: [15, 80, 15, 80, 15],      // Echo appearance
        DENIED: [80, 20, 80]            // Access denied
    } as const, // as const ensures literals are preserved as types

    // ========================================
    // GLITCH EFFECT INTENSITIES
    // ========================================
    GLITCH: {
        LIGHT_DURATION: '0.1s',
        MEDIUM_DURATION: '0.3s',
        HEAVY_DURATION: '0.5s',
        INSANE_OPACITY: 0.8,
        REDUCED_OPACITY: 0.3,
        CORRUPTION_CHANCE: 0.3  // 30% chance per tick in INSANE mode
    },

    // ========================================
    // ANIMATION TIMINGS
    // ========================================
    ANIMATIONS: {
        FADE_IN: 500,        // Standard fade in duration (ms)
        FADE_OUT: 300,       // Standard fade out duration (ms)
        SLIDE_IN: 600,       // Slide in duration (ms)
        SPARKLE: 600,        // Code success sparkle (ms)
        NEW_MAIL: 600,       // New mail slide animation (ms)
        BADGE_PULSE: 2000    // Badge pulse cycle (ms)
    },

    // ========================================
    // UI CONSTANTS
    // ========================================
    UI_CONSTANTS: {
        MAX_BACKLOG_ENTRIES: 100,
        MAX_SAVE_SLOTS: 3,
        AUTO_SAVE_SLOT: 'auto',
        DEV_HUD_UPDATE_INTERVAL: 500,  // ms
        NOTIFICATION_DURATION: 3000,   // ms

        // Z-Index layering system
        Z_INDEX: {
            UNREAD_BADGE: 100,
            OVERLAY_BASE: 10000,
            OVERLAY_HIGH: 10001,
            OVERLAY_CONFIRM: 10003,
            OVERLAY_CRITICAL: 99999
        }
    },

    // ========================================
    // SENSORY CUES METADATA (TORI'S ARCHITECTURE) 💚
    // Central configuration for all haptic + visual feedback
    // ========================================
    SENSORY_CUES: {
        // UI Interactions (scale with comfort)
        buttonPress: { channel: 'ui', basePattern: 'light', visualType: 'buttonPress' },
        menuSelect: { channel: 'ui', basePattern: 'light', visualType: 'menuSelect' },
        cardSnap: { channel: 'ui', basePattern: 'medium', visualType: 'cardSnap' },
        uiSuccess: { channel: 'ui', basePattern: 'success', visualType: null },

        // Narrative Moments (scale with comfort)
        toriHop: { channel: 'narrative', basePattern: 'double', visualType: 'toriHop' },
        tamaPull: { channel: 'narrative', basePattern: 'longBuzz', visualType: 'tamaPull' },
        tamaEmergency: { channel: 'narrative', basePattern: 'warning', visualType: 'tamaEmergency' },
        timelineGlitch: { channel: 'narrative', basePattern: 'glitch', visualType: 'timelineGlitch' },
        codeRipple: { channel: 'narrative', basePattern: 'double', visualType: 'codeRipple' },
        tetherWarning: { channel: 'narrative', basePattern: 'warning', visualType: null },
        echoCall: { channel: 'narrative', basePattern: 'echo', visualType: null },
        heartbeat: { channel: 'narrative', basePattern: 'heartbeat', visualType: null },

        // Critical Feedback (NEVER scales - full intensity always)
        denied: { channel: 'critical', basePattern: 'denied', visualType: 'denied' },
        harshDenial: { channel: 'critical', basePattern: 'error', visualType: 'harshDenial' },
        despairPulse: { channel: 'critical', basePattern: 'heartbeat', visualType: null }
    }
};

// Type Definitions derived from config
export type HapticPatternName = keyof typeof GameConfig.HAPTICS;
export type SensoryCueName = keyof typeof GameConfig.SENSORY_CUES;
