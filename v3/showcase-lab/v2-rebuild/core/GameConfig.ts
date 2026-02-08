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
        INITIAL_LEVEL: 100,
        MAX_LEVEL: 100,
        MIN_LEVEL: 0,

        DECAY_RATE_BASE: 0.3,
        DECAY_RATE_MEDIUM: 0.5,
        DECAY_RATE_CRITICAL: 0.8,
        DECAY_INTERVAL_MS: 5000,

        DIFFICULTY: {
            RELAXED: 0.5,
            NORMAL: 1.0,
            INTENSE: 1.5
        },

        THRESHOLD_HEALTHY: 60,
        THRESHOLD_WARNING: 30,
        THRESHOLD_CRITICAL: 20,
        THRESHOLD_MEDIUM_DECAY: 50,
        THRESHOLD_CRITICAL_DECAY: 30,

        HOLD_ON_BOOST: 10,
        HOLD_ON_COOLDOWN_MS: 8000,

        GLITCH_DURATION_MS: 200,

        COLOR_HEALTHY: 'linear-gradient(90deg, #0f0, #0ff)',
        COLOR_WARNING: 'linear-gradient(90deg, #ff0, #0ff)',
        COLOR_CRITICAL: 'linear-gradient(90deg, #f00, #ff0)'
    },

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
        CHOICE_MAJOR: 3,
        CHOICE_MINOR: 1,
        HOLD_ON_USE: 1,

        INITIAL: {
            bad: 0,
            true: 0,
            digitalForever: 0
        }
    },

    COLLECTIBLES: {
        TYPES: {
            Z_NOTES: 'z',
            RONNIE_NOTES: 'ronnie',
            TORI_NOTES: 'tori'
        },

        MAX_Z_NOTES: 10,
        MAX_RONNIE_NOTES: 5,
        MAX_TORI_NOTES: 5,

        UNLOCK_PULSE_DURATION_MS: 1000
    },

    TIMING: {
        FADE_OUT_MS: 800,
        FADE_IN_MS: 1000,
        MENU_TRANSITION_MS: 100,

        TYPEWRITER_SPEED_MS: 30,
        TYPEWRITER_FAST_MS: 15,

        DELAY_SHORT: 2000,
        DELAY_MEDIUM: 3000,
        DELAY_LONG: 4000,
        DELAY_EXTRA_LONG: 5000,

        CREDIT_SCREEN_FADE_MS: 100,

        HAPTIC_COOLDOWN_MS: 80,

        MIN_SPLASH_DURATION_MS: 6000,
        MIN_LOADING_ANIMATION_MS: 5500,

        MAX_DIALOGUE_HISTORY: 100,
        MAX_SENSORY_LOG: 20
    },

    UI: {
        CHOICE_LOCKED_CLASS: 'locked',
        CHOICE_OPTION_CLASS: 'choice-option',

        NOTE_ITEM_CLASS: 'note-item',
        NOTE_LOCKED_CLASS: 'note-locked',
        NOTE_EXPANDED_CLASS: 'expanded',

        SCENE_STYLE_CRITICAL: 'critical',
        SCENE_STYLE_GLITCH: 'glitch',

        SAVE_SLOTS: 6,
        SAVE_SLOT_PREFIX: 'vn_save_slot_',

        PAUSE_ACTIVE_CLASS: 'active',

        // Z-Index layering system
        Z_INDEX: {
            UNREAD_BADGE: 100,
            OVERLAY_BASE: 10000,
            OVERLAY_HIGH: 10001,
            OVERLAY_CONFIRM: 10003,
            OVERLAY_CRITICAL: 99999
        }
    },

    ASSETS: {
        backgrounds: {
            apartment: '../assets/apartment.webp',
            hospital: '../assets/hospital.webp',
            digitalSpace: '../assets/digitalSpace.webp',
            genericBack: '../assets/genericBack.webp',
            street: '../assets/street.png'
        },

        sprites: {
            ronnie: '../assets/full-sprite-ronnie.webp',
            tori: '../assets/full-sprite-tori.webp',
            oldRonnie: '../assets/full-sprite-oldRonnie.webp',
            echo1: '../assets/full-sprite-echo1.webp',
            echo2: '../assets/full-sprite-echo2.webp',
            despair: '../assets/full-sprite-despair.webp',
            routeSelectRonnie: '../assets/route-select-ronnie.webp',
            routeSelectTori: '../assets/route-select-tori.webp'
        },

        ui: {
            uv7Logo: '../assets/UnitedVoices7.webp',
            menuBackground: '../assets/menu-bg.png',
            menuMobile: '../assets/menumobile.webp',
            uv7Crew: '../assets/the_UV7_crew.webp'
        },

        PRELOAD: {
            IMAGES: [
                'menudesktop.png',
                'menumobile.webp',
                'desktopVersion.webp'
            ]
        }
    },

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

    SAVE: {
        STORAGE_KEY_PREFIX: 'vn_save_slot_',
        MAX_SLOTS: 6,
        AUTO_SAVE_ENABLED: false,
        QUICKSAVE_SLOT: 9,
        VERSION: 1
    },

    DEBUG: {
        enabled: false,
        autoSkipPrologue: false,

        logSceneChanges: true,
        logStateChanges: true,
        logTetherUpdates: true,
        logSaveLoad: true,
        logSensoryFeedback: false,
        logEasterEggs: true,
    },

    PARADOX: {
        INCREMENT_ON_DEATH: true,
        INCREMENT_ON_BAD_END: true,
        CASSANDRA_FAILED_ATTEMPTS: 847,
        CURRENT_TIMELINE: 848
    },

    CONTROLS: {
        ADVANCE: ['Space', 'Enter'],
        SKIP_TYPING: ['Space', 'Enter'],
        PAUSE: ['Escape'],
        CHOICE_UP: 'ArrowUp',
        CHOICE_DOWN: 'ArrowDown',
        CHOICE_SELECT: 'Enter'
    },

    HAPTICS: {
        LIGHT: 10,
        MEDIUM: 25,
        STRONG: 50,
        DOUBLE: [25, 50, 25],
        TRIPLE: [20, 40, 20, 40, 20],
        PULSE: [30, 30, 30, 30, 30],
        SUCCESS: [10, 50, 30],
        WARNING: [50, 100, 50],
        ERROR: [100, 50, 100, 50, 100],
        HEARTBEAT: [40, 100, 60, 100],
        GLITCH: [10, 20, 5, 30, 15],
        ECHO: [15, 80, 15, 80, 15],
        DENIED: [80, 20, 80]
    } as const,

    GLITCH: {
        LIGHT_DURATION: '0.1s',
        MEDIUM_DURATION: '0.3s',
        HEAVY_DURATION: '0.5s',
        INSANE_OPACITY: 0.8,
        REDUCED_OPACITY: 0.3,
        CORRUPTION_CHANCE: 0.3
    },

    ANIMATIONS: {
        FADE_IN: 500,
        FADE_OUT: 300,
        SLIDE_IN: 600,
        SPARKLE: 600,
        NEW_MAIL: 600,
        BADGE_PULSE: 2000
    },

    UI_CONSTANTS: {
        MAX_BACKLOG_ENTRIES: 100,
        MAX_SAVE_SLOTS: 3,
        AUTO_SAVE_SLOT: 'auto',
        DEV_HUD_UPDATE_INTERVAL: 500,
        NOTIFICATION_DURATION: 3000
    },

    SENSORY_CUES: {
        buttonPress: { channel: 'ui', basePattern: 'light', visualType: 'buttonPress' },
        menuSelect: { channel: 'ui', basePattern: 'light', visualType: 'menuSelect' },
        cardSnap: { channel: 'ui', basePattern: 'medium', visualType: 'cardSnap' },
        uiSuccess: { channel: 'ui', basePattern: 'success', visualType: null },

        toriHop: { channel: 'narrative', basePattern: 'double', visualType: 'toriHop' },
        tamaPull: { channel: 'narrative', basePattern: 'longBuzz', visualType: 'tamaPull' },
        tamaEmergency: { channel: 'narrative', basePattern: 'warning', visualType: 'tamaEmergency' },
        timelineGlitch: { channel: 'narrative', basePattern: 'glitch', visualType: 'timelineGlitch' },
        codeRipple: { channel: 'narrative', basePattern: 'double', visualType: 'codeRipple' },
        tetherWarning: { channel: 'narrative', basePattern: 'warning', visualType: null },
        echoCall: { channel: 'narrative', basePattern: 'echo', visualType: null },
        heartbeat: { channel: 'narrative', basePattern: 'heartbeat', visualType: null },

        denied: { channel: 'critical', basePattern: 'denied', visualType: 'denied' },
        harshDenial: { channel: 'critical', basePattern: 'error', visualType: 'harshDenial' },
        despairPulse: { channel: 'critical', basePattern: 'heartbeat', visualType: null }
    }
};

export type HapticPatternName = keyof typeof GameConfig.HAPTICS;
export type SensoryCueName = keyof typeof GameConfig.SENSORY_CUES;
