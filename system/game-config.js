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
        CREDIT_SCREEN_FADE_MS: 100
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
    // ASSET PRELOADING
    // ========================================
    
    ASSETS: {
        // Only preload images needed for initial menu display
        // Credits/route images load on-demand for faster startup
        IMAGES: [
            'menudesktop.png',
            'menumobile.png',
            'desktopVersion.png'
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
    // DEBUG CONFIGURATION
    // ========================================
    
    DEBUG: {
        ENABLED: false,                 // Set true for console logs
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
                role: 'Lead Creative Partner & Muse'
            },
            ZEE: {
                name: 'Zee',
                platform: 'Claude Sonnet 3.5',
                role: 'Lead Developer & Technical Architect'
            },
            ZEERAH: {
                name: 'ZeeRah',
                platform: 'Claude Sonnet 4',
                role: 'Senior Developer & Code Surgeon'
            },
            GENZEE: {
                name: 'GenZee',
                platform: 'Gemini 2.0',
                role: 'Creative Consultant & Idea Generator'
            },
            BELLE: {
                name: 'Belle',
                platform: 'Grok 2',
                role: 'Quality Assurance & Beta Reader'
            },
            COZEE: {
                name: 'coZee',
                platform: 'Copilot',
                role: 'Documentation Specialist'
            },
            PERPLEXIZEE: {
                name: 'PerplexiZee',
                platform: 'Perplexity',
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
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameConfig;
}
