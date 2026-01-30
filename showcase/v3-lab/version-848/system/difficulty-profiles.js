// ========================================
// DIFFICULTY PROFILES
// Central configuration for all difficulty modes
// Single source of truth for tether mechanics, UI, and restrictions
// ========================================

/**
 * DIFFICULTY_PROFILES
 * 
 * Centralized difficulty configuration to prevent drift between
 * UI descriptions, tether mechanics, and gameplay restrictions.
 * 
 * Each profile defines:
 * - Decay rates (base, medium, critical zones)
 * - Tether cap (max tether percentage)
 * - Hold On button behavior
 * - Time Machine (backlog) rules
 * - Save restrictions
 * - Haptic intensity scaling
 * - UI copy and lore tags
 */

const DIFFICULTY_PROFILES = {
    // ========================================
    // COMFORT MODE
    // No decay, auto-Hold On, full accessibility
    // ========================================
    comfort: {
        id: 'comfort',
        name: 'Comfort',
        loreTag: 'merciful timeline',

        // Decay rates (per interval)
        decayRates: {
            base: 0,        // No passive decay
            medium: 0,      // No acceleration
            critical: 0     // No critical zone penalty
        },

        // Tether mechanics
        tetherCap: 100,             // Full tether available
        holdOnBoost: 15,            // Standard boost amount
        holdOnCooldown: 30000,      // 30 seconds

        // Hold On button behavior
        holdOn: {
            enabled: true,
            autoMode: true,         // Automatically maintains tether
            ghost: false,           // Not a ghost button
            hidden: false           // Visible
        },

        // Time Machine (backlog) rules
        timeMachine: {
            enabled: true,
            readOnly: false,        // Can jump back
            maxJumpDistance: null   // No restrictions
        },

        // Save system rules
        saves: {
            blockInAct1: false,     // Can save anywhere
            unlimited: true
        },

        // Haptic/sensory scaling
        hapticIntensity: 0.7,       // Gentler feedback

        // UI copy
        description: 'No tether decay. Auto-Hold On enabled. Full accessibility.',
        shortDesc: 'Story focus, no pressure',
        warning: null,              // No warning needed

        // Unlock requirements
        unlocked: true              // Always available
    },

    // ========================================
    // NORMAL MODE
    // Balanced difficulty, standard mechanics
    // ========================================
    normal: {
        id: 'normal',
        name: 'Normal',
        loreTag: 'attempting',

        // Decay rates (increased for challenge - dies in ~11 min if idle)
        decayRates: {
            base: 0.15,     // Base passive decay (was 0.04 - WAY too slow)
            medium: 0.25,   // Moderate acceleration below 50% (was 0.065)
            critical: 0.40  // Faster decay below 30% (was 0.10)
        },

        // Tether mechanics
        tetherCap: 100,
        holdOnBoost: 15,
        holdOnCooldown: 30000,

        // Hold On button
        holdOn: {
            enabled: true,
            autoMode: false,        // Manual activation required
            ghost: false,
            hidden: false
        },

        // Time Machine
        timeMachine: {
            enabled: true,
            readOnly: false,
            maxJumpDistance: null
        },

        // Saves
        saves: {
            blockInAct1: true,      // Despair blocks saves in Act 1
            unlimited: true
        },

        // Haptic
        hapticIntensity: 1.0,       // Standard feedback

        // UI
        description: 'Balanced difficulty. Tether decays at standard rate. Manual Hold On required.',
        shortDesc: 'Standard challenge',
        warning: null,

        unlocked: true
    },

    // ========================================
    // INTENSE MODE
    // Faster decay, higher pressure
    // ========================================
    intense: {
        id: 'intense',
        name: 'Intense',
        loreTag: 'struggling',

        // Decay rates
        decayRates: {
            base: 0.08,     // 1.6x faster than normal
            medium: 0.12,   // Significant acceleration
            critical: 0.18  // Heavy critical penalty
        },

        // Tether mechanics
        tetherCap: 100,
        holdOnBoost: 15,
        holdOnCooldown: 30000,

        // Hold On button
        holdOn: {
            enabled: true,
            autoMode: false,
            ghost: false,
            hidden: false
        },

        // Time Machine
        timeMachine: {
            enabled: true,
            readOnly: false,
            maxJumpDistance: null
        },

        // Saves
        saves: {
            blockInAct1: true,
            unlimited: true
        },

        // Haptic
        hapticIntensity: 1.3,       // More intense feedback

        // UI
        description: 'High difficulty. 1.6x faster tether decay. Requires constant attention.',
        shortDesc: 'For experienced players',
        warning: 'Tether decay is significantly faster. Stay vigilant.',

        unlocked: true
    },

    // ========================================
    // INSANE MODE
    // Ultimate challenge: No safety nets
    // ========================================
    insane: {
        id: 'insane',
        name: 'INSANE',
        loreTag: 'no escape',

        // Decay rates
        decayRates: {
            base: 0.10,     // 2x faster than normal
            medium: 0.15,   // Brutal acceleration
            critical: 0.22  // Punishing critical zone
        },

        // Tether mechanics
        tetherCap: 66,              // ⚠️ CAPPED AT 66% - Cannot reach full tether
        holdOnBoost: 0,             // Hold On does nothing
        holdOnCooldown: 30000,

        // Hold On button
        holdOn: {
            enabled: false,         // ⚠️ NO HOLD ON BUTTON
            autoMode: false,
            ghost: true,            // Ghost mode (visual only, no function)
            hidden: true            // Completely hidden
        },

        // Time Machine
        timeMachine: {
            enabled: true,
            readOnly: true,         // ⚠️ READ-ONLY - Cannot jump back
            maxJumpDistance: 2      // Can only view last 2 entries
        },

        // Saves
        saves: {
            blockInAct1: true,
            unlimited: false        // Limited save slots
        },

        // Haptic
        hapticIntensity: 1.5,       // Maximum intensity

        // UI
        description: '💀 ULTIMATE DIFFICULTY\n\n• 2x tether decay\n• Tether capped at 66%\n• NO Hold On button\n• Time Machine read-only\n• Permanent commitment lock\n\nThere is no escape once you commit.',
        shortDesc: 'No safety nets. No mercy.',
        warning: '⚠️ WARNING: INSANE MODE IS PERMANENT\n\nOnce you commit, you CANNOT change difficulty.\n\nYou will lose:\n• Hold On button (no tether recovery)\n• Time Machine jumps (read-only backlog)\n• Tether cap (maximum 66%)\n\nThis is a one-way commitment.\n\nAre you absolutely certain?',

        // Unlock requirements
        unlocked: false,            // Must be unlocked by completing Intense
        unlockCondition: 'Complete ANY ending on INTENSE difficulty'
    }
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get difficulty profile by ID
 * @param {string} difficultyId - 'comfort', 'normal', 'intense', or 'insane'
 * @returns {object} Difficulty profile
 */
function getDifficultyProfile(difficultyId) {
    const normalized = difficultyId.toLowerCase();
    return DIFFICULTY_PROFILES[normalized] || DIFFICULTY_PROFILES.normal;
}

/**
 * Check if difficulty is unlocked
 * @param {string} difficultyId 
 * @returns {boolean}
 */
function isDifficultyUnlocked(difficultyId) {
    const profile = getDifficultyProfile(difficultyId);

    // Always unlocked difficulties
    if (profile.unlocked) return true;

    // INSANE mode unlock check
    if (difficultyId === 'insane') {
        return localStorage.getItem('insaneModeUnlocked') === 'true';
    }

    return false;
}

/**
 * Get all unlocked difficulty profiles
 * @returns {array} Array of unlocked profiles
 */
function getUnlockedDifficulties() {
    return Object.values(DIFFICULTY_PROFILES).filter(profile => {
        if (profile.unlocked) return true;
        if (profile.id === 'insane') {
            return localStorage.getItem('insaneModeUnlocked') === 'true';
        }
        return false;
    });
}

/**
 * Apply difficulty profile to tether system
 * @param {object} tetherSystem - TetherSystem instance
 * @param {string} difficultyId - Difficulty to apply
 */
function applyDifficultyToTether(tetherSystem, difficultyId) {
    const profile = getDifficultyProfile(difficultyId);

    // Apply decay rates
    tetherSystem.tetherDecayRate = profile.decayRates.base;
    tetherSystem.DECAY_MEDIUM_RATE = profile.decayRates.medium;
    tetherSystem.DECAY_CRITICAL_RATE = profile.decayRates.critical;

    // Apply tether cap
    tetherSystem.tetherCap = profile.tetherCap;

    // Apply Hold On settings
    tetherSystem.HOLD_ON_BOOST = profile.holdOnBoost;

    console.log(`⚙️ Applied ${profile.name} difficulty to tether system`);
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.DIFFICULTY_PROFILES = DIFFICULTY_PROFILES;
    window.getDifficultyProfile = getDifficultyProfile;
    window.isDifficultyUnlocked = isDifficultyUnlocked;
    window.getUnlockedDifficulties = getUnlockedDifficulties;
    window.applyDifficultyToTether = applyDifficultyToTether;
}

// ES Module export
export { DIFFICULTY_PROFILES, getDifficultyProfile, isDifficultyUnlocked, getUnlockedDifficulties, applyDifficultyToTether };
