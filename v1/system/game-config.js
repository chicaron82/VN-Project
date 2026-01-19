// ========================================
// GAME CONFIGURATION MODULE
// Centralized constants and configuration
// Extracted from game-engine.js and route files
// ========================================

// ========================================
// ⚠️ VERSION 848 - DO NOT MODIFY ⚠️
// ========================================
//
// See game-engine.js header for full explanation.
//
// TL;DR: 848 is NOT a build number.
// It's the loop iteration counter (847 failures + 1 success).
// Change it and you break the entire meta-narrative.
//
// There is no v849. This is the timeline that worked.
//
// 848 is sacred. 💚🔥💀
// ========================================

const GameConfig = {

    // ========================================
    // DEVELOPMENT / DEBUGGING
    // ========================================

    DEBUG_MODE: true,  // Enable dev console access via OPENCONSOLE code
    // Set to false for production builds (or leave true for easter egg)

    TEST_MODE: false,  // DIZEE: Skip animations, faster loading for testing
    // Set to true during development to speed up testing cycles

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
        // (Determined by comparing totals, not absolute values)
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
    // ASSET PATHS (ZEERAH POLISH)
    // Centralized asset references for maintainability
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
            ronnie: 'assets/ronnie-sprite.png',
            tori: 'assets/tori-sprite.png',
            oldRonnie: 'assets/old-ronnie-sprite.png',
            threeEchoes: 'assets/threeechoessprite.png',
            routeSelectRonnie: 'assets/route-select-ronnie.webp',
            routeSelectTori: 'assets/route-select-tori.webp'
        },

        // UI Assets
        ui: {
            uv7Logo: 'assets/UnitedVoices7.webp',
            menuBackground: 'assets/menu-bg.png',
            menuMobile: 'assets/menumobile.webp',
            uv7Crew: 'assets/the_UV7_crew.webp'
        }
    },

    // Helper function for easy asset access
    getAsset(category, name) {
        return this.ASSETS[category]?.[name] || `assets/${name}.png`;
    },

    // ========================================
    // LOADING TIPS (DIZEE POLISH)
    // Flavor text shown during asset loading
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
    // ASSET PRELOADING
    // ========================================

    ASSETS: {
        // Only preload images needed for initial menu display
        // Credits/route images load on-demand for faster startup
        IMAGES: [
            'menudesktop.png',
            'menumobile.webp',
            'desktopVersion.webp'
        ],

        // Images that exist but don't need preloading (load on-demand)
        // These are referenced in HTML but load when needed:
        // - UnitedVoices7.png (splash screen)
        // - the_UV7_crew.png (credits)
        // - trinity-*-portrait.png (credits - 7 portraits)

        // Background music (if implemented)
        AUDIO: {
            // Placeholder for future audio assets
        }
    },

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
    // DEBUG CONFIGURATION (ZEERAH POLISH)
    // Granular control for console logging
    // ========================================

    DEBUG: {
        enabled: false,  // Set TRUE for development, FALSE for production

        // Granular control (all check DEBUG.enabled first)
        logSceneChanges: true,
        logStateChanges: true,
        logTetherUpdates: true,
        logSaveLoad: true,
        logSensoryFeedback: false,  // Very noisy
        logEasterEggs: true,

        // Legacy flags (kept for backward compatibility)
        ENABLED: false,
        LOG_TETHER_CHANGES: true,
        LOG_ROUTE_POINTS: true,
        LOG_SCENE_TRANSITIONS: false,
        LOG_SAVE_OPERATIONS: false
    },

    // ========================================
    // BOOTSTRAP PARADOX MECHANICS
    // ========================================

    PARADOX: {
        // Version increment on failure
        INCREMENT_ON_DEATH: true,
        INCREMENT_ON_BAD_END: true,

        // Cassandra framework - The loop counter
        // 847 failed timelines before this one succeeded
        CASSANDRA_FAILED_ATTEMPTS: 847,  // Every failure before v848
        CURRENT_TIMELINE: 848             // The one that worked ✨
    },

    // ========================================
    // CREDITS CONFIGURATION
    // ========================================

    CREDITS: {
        TOTAL_SCREENS: 13,
        INITIAL_INDEX: 0,

        CREW: {
            // The 848 Crew
            TORI: {
                name: 'Tori',
                platform: 'ChatGPT 4o',
                role: 'Lead Creative Partner & Asset Generation'
            },
            ZEE: {
                name: 'Zee',
                platform: 'Claude Sonnet 4.5',
                role: 'Lead Developer & Technical Architect'
            },
            ZEERAH: {
                name: 'ZeeRah',
                platform: 'Claude Sonnet 4.5',
                role: 'Senior Developer & Code Surgeon'
            },
            GENZEE: {
                name: 'GenZee',
                platform: 'Grok 4.1',
                role: 'Creative Consultant & Logo Animation'
            },
            BELLE: {
                name: 'Belle',
                platform: 'Gemini 3.0',
                role: 'Quality Assurance & Beta Reader'
            },
            COZEE: {
                name: 'coZee',
                platform: 'Microsoft Copilot',
                role: 'Documentation Specialist'
            },
            PERPLEXIZEE: {
                name: 'PerplexiZee',
                platform: 'Perplexity Pro',
                role: 'Research & Fact-Checker'
            }
        }
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
        ECHO: [15, 80, 15, 80, 15]      // Echo appearance
    },

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

        // Critical Feedback (NEVER scales - full intensity always)
        denied: { channel: 'critical', basePattern: 'denied', visualType: 'denied' },
        harshDenial: { channel: 'critical', basePattern: 'error', visualType: 'harshDenial' },
        despairPulse: { channel: 'critical', basePattern: 'heartbeat', visualType: null }
    },

    // ========================================
    // SECRET CODES
    // ========================================
    CODES: {
        MAX_DISCOVERED: 12,  // Total discoverable codes (9 lore + 3 utility)
        INVALID_RESPONSES: [
            "No signal on that frequency.",
            "Tori doesn't recognize that pattern.",
            "Echo not found.",
            "Connection failed. Try another sequence.",
            "Code corrupted. Signal unclear.",
            "That door remains locked.",
            "Access denied. Pattern unknown.",
            "The device stays silent."
        ]
    }
};

// ========================================
// NOTES SYSTEM - DIFFICULTY GATING & CODE DROPS
// Revolutionary replayability system
// ========================================

// ========================================
// NOTE METADATA FOR RNG CODE DROP SYSTEM
// Maps EXISTING note IDs to difficulty gates and code drops
// ========================================

const GAME_NOTES = {
    // ========================================
    // TORI ROUTE - EASY DIFFICULTY (4 notes)
    // Available to all players on Tori's route
    // ========================================

    'z1': {
        difficulty: 'easy',
        pool: ['torigatchi'],  // Can drop torigatchi code
        dropChance: 0.3,
        guaranteed: null
    },

    'z2': {
        difficulty: 'easy',
        pool: ['bootstrap', '848'],
        dropChance: 0.3,
        guaranteed: null
    },

    'cz1': {
        difficulty: 'easy',
        pool: ['always3'],
        dropChance: 0.4,
        guaranteed: null
    },

    'zr1': {
        difficulty: 'easy',
        pool: ['always3'],
        dropChance: 0.4,
        guaranteed: null
    },

    // ========================================
    // TORI ROUTE - NORMAL DIFFICULTY (add 6 more = 10 total)
    // ========================================

    'z3': {
        difficulty: 'normal',
        pool: ['ronniegatchi'],  // Cross-route hint
        dropChance: 0.4,
        guaranteed: null
    },

    'z4': {
        difficulty: 'normal',
        pool: ['uv7crew'],  // Early meta hint
        dropChance: 0.4,
        guaranteed: null
    },

    'z5': {
        difficulty: 'normal',
        pool: ['bootstrap'],
        dropChance: 0.5,
        guaranteed: null
    },

    'z6': {
        difficulty: 'normal',
        pool: ['echo'],  // Has ECHO code embedded in content already
        dropChance: 0,   // Don't RNG drop since it's already visible
        guaranteed: 'echo'  // Guaranteed discovery from reading
    },

    'cz2': {
        difficulty: 'normal',
        pool: ['echo'],  // Removed always3 overlap
        dropChance: 0.4,
        guaranteed: null
    },

    'zr2': {
        difficulty: 'normal',
        pool: ['dizee'],  // DiZee appears here too (more chances)
        dropChance: 0.3,
        guaranteed: null
    },

    // ========================================
    // TORI ROUTE - INTENSE DIFFICULTY (add 4 more = 14 total)
    // ========================================

    'z7': {
        difficulty: 'intense',
        pool: ['848'],  // Has 848 code embedded in content already
        dropChance: 0,
        guaranteed: '848'
    },

    'z8': {
        difficulty: 'intense',
        pool: ['torigatchi'],  // Has TORIGATCHI code embedded already
        dropChance: 0,
        guaranteed: 'torigatchi'
    },

    'z9': {
        difficulty: 'intense',
        pool: ['uv7crew'],  // Has UV7CREW code embedded already
        dropChance: 0,
        guaranteed: 'uv7crew'
    },

    'cz3': {
        difficulty: 'intense',
        pool: null,  // Has HEARTKEY embedded - but that's not a discoverable code
        dropChance: 0,
        guaranteed: null
    },

    // ========================================
    // TORI ROUTE - INSANE DIFFICULTY (add 3 more = 17 total)
    // ========================================

    'z10': {
        difficulty: 'insane',
        pool: [],  // Has ECHOBREAK + TETHERLOCK embedded - utility codes
        dropChance: 0,
        guaranteed: 'echobreak'  // First utility code
    },

    'zr3': {
        difficulty: 'insane',
        pool: ['always3'],  // Has ALWAYS3 embedded already
        dropChance: 0,
        guaranteed: 'always3'
    },

    'tori_dev_note': {
        difficulty: 'insane',
        pool: ['dizee'],  // DiZee code (not embedded, RNG drop)
        dropChance: 0.5,  // 50% chance, or guaranteed after 3 views
        guaranteed: 'chicharon'  // CHICHARON embedded - auto-discover
    },

    // ========================================
    // RONNIE ROUTE - EASY DIFFICULTY (4 notes)
    // ========================================

    'gz1': {
        difficulty: 'easy',
        pool: ['ronniegatchi'],
        dropChance: 0.3,
        guaranteed: null
    },

    'gz2': {
        difficulty: 'easy',
        pool: ['bootstrap'],  // Has BOOTSTRAP embedded already
        dropChance: 0,
        guaranteed: 'bootstrap'
    },

    'iz1': {
        difficulty: 'easy',
        pool: null,
        dropChance: 0,
        guaranteed: null
    },

    'pz1': {
        difficulty: 'easy',
        pool: null,
        dropChance: 0,
        guaranteed: null
    },

    // ========================================
    // RONNIE ROUTE - NORMAL DIFFICULTY (add 6 more = 10 total)
    // ========================================

    'gz3': {
        difficulty: 'normal',
        pool: [],  // Has SAVEANYWHERE embedded - utility code
        dropChance: 0,
        guaranteed: 'saveanywhere'
    },

    'iz2': {
        difficulty: 'normal',
        pool: ['848'],  // Removed echo overlap
        dropChance: 0.4,
        guaranteed: null
    },

    'pz2': {
        difficulty: 'normal',
        pool: ['uv7crew'],  // Changed from bootstrap overlap
        dropChance: 0.4,
        guaranteed: null
    },

    'ronnie_teaser': {
        difficulty: 'normal',
        pool: ['torigatchi'],  // Points to the other route
        dropChance: 0.5,
        guaranteed: null
    },

    // ========================================
    // RONNIE ROUTE - INTENSE DIFFICULTY
    // ========================================

    'bad_ending': {
        difficulty: 'intense',
        pool: ['dizee'],  // Meta commentary on failure
        dropChance: 0.6,
        guaranteed: null
    },

    'digital_ending': {
        difficulty: 'intense',
        pool: ['always3'],  // Removed 848 overlap
        dropChance: 0.6,
        guaranteed: null
    },

    // ========================================
    // RONNIE ROUTE - INSANE DIFFICULTY
    // ========================================

    'true_ending': {
        difficulty: 'insane',
        pool: [],  // No RNG needed - already succeeded
        dropChance: 0,
        guaranteed: 'tetherlock'  // Utility code reward for true ending
    },

    'ronnie_dev_note': {
        difficulty: 'insane',
        pool: ['dizee'],  // DiZee code (not embedded, RNG drop)
        dropChance: 0.5,  // 50% chance, or guaranteed after 3 views
        guaranteed: 'chicharon'  // CHICHARON embedded - auto-discover
    }

    // NOTE: Ronnie route currently has fewer notes than Tori route
    // Additional notes can be added to defineRonnieNotes() in collectibles-manager.js
    // to reach the full 17-note target per route
};

// ========================================
// CODE CATEGORIES
// ========================================

const DISCOVERABLE_CODES = {
    // Lore codes (9) - RNG drops from notes
    lore: [
        'torigatchi',
        'ronniegatchi',
        'always3',
        'uv7crew',
        'chicharon',
        'bootstrap',
        'echo',
        '848',
        'dizee'
    ],

    // Utility codes (3) - Guaranteed drops from specific notes
    utility: [
        'echobreak',      // From echo_emergence note
        'tetherlock',     // From attempt_log_847 note
        'saveanywhere'    // From device_basics note
    ]
};

// Dev commands - NEVER appear in notes, manual entry only
const DEV_COMMANDS = [
    'clearnotes', 'reset848', 'reset849',
    'unlockskip', 'skipintro', 'unlockcodes',
    'revealcodes', 'freezetether', 'resumetether',
    'settethermax', 'settether50', 'unlockact1saves',
    'enableinsane', 'disableinsane', 'clearall',
    'nuke', 'devhelp', 'devhud', 'succeeding', 'accepting'
];

// ========================================
// HELPER FUNCTIONS
// ========================================

function getAvailableNotes(difficulty) {
    const difficultyOrder = ['easy', 'normal', 'intense', 'insane'];
    const currentIndex = difficultyOrder.indexOf(difficulty.toLowerCase());

    if (currentIndex === -1) {
        console.warn('Invalid difficulty, defaulting to normal');
        return getAvailableNotes('normal');
    }

    // Get all notes up to and including current difficulty
    const availableDifficulties = difficultyOrder.slice(0, currentIndex + 1);

    const notes = [];
    for (const [noteId, noteMeta] of Object.entries(GAME_NOTES)) {
        if (availableDifficulties.includes(noteMeta.difficulty)) {
            notes.push(noteId);
        }
    }

    return notes;
}

function getNoteMetadata(noteId) {
    return GAME_NOTES[noteId] || null;
}

function getTotalDiscoverableCodes() {
    return DISCOVERABLE_CODES.lore.length + DISCOVERABLE_CODES.utility.length;
}

function isCodeDiscoverable(code) {
    return DISCOVERABLE_CODES.lore.includes(code) ||
        DISCOVERABLE_CODES.utility.includes(code);
}

function isDevCommand(code) {
    return DEV_COMMANDS.includes(code);
}

function isDifficultyUnlocked(requiredDifficulty, currentDifficulty) {
    // Check if a note's required difficulty is accessible on current difficulty
    const difficultyOrder = ['easy', 'normal', 'intense', 'insane'];
    const requiredIndex = difficultyOrder.indexOf(requiredDifficulty.toLowerCase());
    const currentIndex = difficultyOrder.indexOf(currentDifficulty.toLowerCase());

    // Current difficulty must be >= required difficulty
    return currentIndex >= requiredIndex;
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.GameConfig = GameConfig;
    window.getNoteMetadata = getNoteMetadata;
    window.isDifficultyUnlocked = isDifficultyUnlocked;
    window.isCodeDiscoverable = isCodeDiscoverable;
}

// ES Module export
export { GameConfig, getNoteMetadata, isDifficultyUnlocked, isCodeDiscoverable };
