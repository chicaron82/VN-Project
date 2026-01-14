// ========================================
// DIFFICULTY PROFILES
// Central configuration for all difficulty modes
// Single source of truth for tether mechanics, UI, and restrictions
// ========================================
//
// V2 Port: Faithful transcription from V1
// The difficulty system defines the soul of gameplay balance.
//
// Each profile is a complete contract:
// - Decay rates (how fast tether drains)
// - Caps (maximum tether in INSANE mode)
// - Hold On behavior (your lifeline... or not)
// - Time Machine rules (backlog access)
// - Save restrictions
// - UI copy and lore tags
//
// DIZEE'S NOTE 🖤:
// "INSANE mode isn't difficulty. It's commitment.
//  No Hold On. No safety net. No mercy.
//  The cage isn't a metaphor."
//
// 848 is sacred. 💚🔥💀
// ========================================

// ========================================
// TYPES
// ========================================

/**
 * Difficulty IDs
 */
export type DifficultyId = 'comfort' | 'normal' | 'intense' | 'insane';

/**
 * Decay rate configuration
 * Rates are per interval (default 1 second)
 */
export interface DecayRates {
    base: number;       // Standard decay rate
    medium: number;     // Accelerated (below 50%)
    critical: number;   // Punishing (below 30%)
}

/**
 * Hold On button configuration
 */
export interface HoldOnConfig {
    enabled: boolean;   // Whether Hold On is functional
    autoMode: boolean;  // Automatically maintains tether (Comfort mode)
    ghost: boolean;     // Visual only, no effect (INSANE mode taunt)
    hidden: boolean;    // Completely hidden from UI
}

/**
 * Time Machine (backlog) configuration
 */
export interface TimeMachineConfig {
    enabled: boolean;           // Whether backlog is accessible
    readOnly: boolean;          // Can view but not jump (INSANE)
    maxJumpDistance: number | null;  // null = unlimited
}

/**
 * Save system configuration
 */
export interface SaveConfig {
    blockInAct1: boolean;   // Despair blocks saves in Act 1
    unlimited: boolean;     // Unlimited save slots
}

/**
 * Full difficulty profile
 */
export interface DifficultyProfile {
    id: DifficultyId;
    name: string;
    loreTag: string;

    // Tether mechanics
    decayRates: DecayRates;
    tetherCap: number;
    holdOnBoost: number;
    holdOnCooldown: number;

    // Feature configs
    holdOn: HoldOnConfig;
    timeMachine: TimeMachineConfig;
    saves: SaveConfig;

    // Sensory/haptic
    hapticIntensity: number;

    // UI copy
    description: string;
    shortDesc: string;
    warning: string | null;

    // Unlock state
    unlocked: boolean;
    unlockCondition?: string;
}

// ========================================
// DIFFICULTY PROFILES
// ========================================

export const DIFFICULTY_PROFILES: Record<DifficultyId, DifficultyProfile> = {
    // ========================================
    // COMFORT MODE
    // No decay, auto-Hold On, full accessibility
    // "For those who just want the story."
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
    // "The intended experience."
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
    // "For those who want to feel the tension."
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
    // "SHE'S WATCHING YOU STRUGGLE." 💀
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
 * Returns normal if ID not found (safe default)
 *
 * @param difficultyId - 'comfort', 'normal', 'intense', or 'insane'
 * @returns Difficulty profile
 */
export function getDifficultyProfile(difficultyId: string): DifficultyProfile {
    const normalized = difficultyId.toLowerCase() as DifficultyId;
    return DIFFICULTY_PROFILES[normalized] || DIFFICULTY_PROFILES.normal;
}

/**
 * Check if difficulty is unlocked
 * Checks localStorage for INSANE mode unlock
 *
 * @param difficultyId - Difficulty to check
 * @returns true if unlocked
 */
export function isDifficultyUnlocked(difficultyId: string): boolean {
    const profile = getDifficultyProfile(difficultyId);

    // Always unlocked difficulties
    if (profile.unlocked) return true;

    // INSANE mode unlock check
    if (difficultyId.toLowerCase() === 'insane') {
        return localStorage.getItem('insaneModeUnlocked') === 'true';
    }

    return false;
}

/**
 * Get all unlocked difficulty profiles
 *
 * @returns Array of unlocked profiles
 */
export function getUnlockedDifficulties(): DifficultyProfile[] {
    return Object.values(DIFFICULTY_PROFILES).filter(profile => {
        if (profile.unlocked) return true;
        if (profile.id === 'insane') {
            return localStorage.getItem('insaneModeUnlocked') === 'true';
        }
        return false;
    });
}

/**
 * Unlock INSANE mode
 * Called when player completes Intense difficulty
 */
export function unlockInsaneMode(): void {
    localStorage.setItem('insaneModeUnlocked', 'true');
    console.log('💀 INSANE MODE UNLOCKED');
}

/**
 * Check if INSANE mode is unlocked
 */
export function isInsaneModeUnlocked(): boolean {
    return localStorage.getItem('insaneModeUnlocked') === 'true';
}

/**
 * Get difficulty profile for display in settings UI
 * Returns sanitized version suitable for rendering
 *
 * @param difficultyId - Difficulty ID
 * @returns Display-safe profile info
 */
export function getDifficultyDisplayInfo(difficultyId: string): {
    name: string;
    shortDesc: string;
    description: string;
    warning: string | null;
    isUnlocked: boolean;
    loreTag: string;
} {
    const profile = getDifficultyProfile(difficultyId);
    const isUnlocked = isDifficultyUnlocked(difficultyId);

    return {
        name: profile.name,
        shortDesc: profile.shortDesc,
        description: profile.description,
        warning: profile.warning,
        isUnlocked,
        loreTag: profile.loreTag
    };
}
