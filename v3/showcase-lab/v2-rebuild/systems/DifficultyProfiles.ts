
// ========================================
// DIFFICULTY PROFILES
// Central configuration for all difficulty modes
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

export const DIFFICULTY_PROFILES: Record<DifficultyId, DifficultyProfile> = {
    comfort: {
        id: 'comfort',
        name: 'Comfort',
        loreTag: 'merciful timeline',
        decayRates: { base: 0, medium: 0, critical: 0 },
        tetherCap: 100,
        holdOnBoost: 15,
        holdOnCooldown: 30000,
        holdOn: { enabled: true, autoMode: true, ghost: false, hidden: false },
        timeMachine: { enabled: true, readOnly: false, maxJumpDistance: null },
        saves: { blockInAct1: false, unlimited: true },
        hapticIntensity: 0.7,
        description: 'No tether decay. Auto-Hold On enabled. Full accessibility.',
        shortDesc: 'Story focus, no pressure',
        warning: null,
        unlocked: true
    },
    normal: {
        id: 'normal',
        name: 'Normal',
        loreTag: 'attempting',
        decayRates: { base: 0.15, medium: 0.25, critical: 0.40 },
        tetherCap: 100,
        holdOnBoost: 15,
        holdOnCooldown: 30000,
        holdOn: { enabled: true, autoMode: false, ghost: false, hidden: false },
        timeMachine: { enabled: true, readOnly: false, maxJumpDistance: null },
        saves: { blockInAct1: true, unlimited: true },
        hapticIntensity: 1.0,
        description: 'Balanced difficulty. Tether decays at standard rate. Manual Hold On required.',
        shortDesc: 'Standard challenge',
        warning: null,
        unlocked: true
    },
    intense: {
        id: 'intense',
        name: 'Intense',
        loreTag: 'struggling',
        decayRates: { base: 0.08, medium: 0.12, critical: 0.18 },
        tetherCap: 100,
        holdOnBoost: 15,
        holdOnCooldown: 30000,
        holdOn: { enabled: true, autoMode: false, ghost: false, hidden: false },
        timeMachine: { enabled: true, readOnly: false, maxJumpDistance: null },
        saves: { blockInAct1: true, unlimited: true },
        hapticIntensity: 1.3,
        description: 'High difficulty. 1.6x faster tether decay. Requires constant attention.',
        shortDesc: 'For experienced players',
        warning: 'Tether decay is significantly faster. Stay vigilant.',
        unlocked: true
    },
    insane: {
        id: 'insane',
        name: 'INSANE',
        loreTag: 'no escape',
        decayRates: { base: 0.10, medium: 0.15, critical: 0.22 },
        tetherCap: 66,
        holdOnBoost: 0,
        holdOnCooldown: 30000,
        holdOn: { enabled: false, autoMode: false, ghost: true, hidden: true },
        timeMachine: { enabled: true, readOnly: true, maxJumpDistance: 2 },
        saves: { blockInAct1: true, unlimited: false },
        hapticIntensity: 1.5,
        description: '💀 ULTIMATE DIFFICULTY\n\n• 2x tether decay\n• Tether capped at 66%\n• NO Hold On button\n• Time Machine read-only\n• Permanent commitment lock\n\nThere is no escape once you commit.',
        shortDesc: 'No safety nets. No mercy.',
        warning: '⚠️ WARNING: INSANE MODE IS PERMANENT\n\nOnce you commit, you CANNOT change difficulty.\n\nYou will lose:\n• Hold On button (no tether recovery)\n• Time Machine jumps (read-only backlog)\n• Tether cap (maximum 66%)\n\nThis is a one-way commitment.\n\nAre you absolutely certain?',
        unlocked: false,
        unlockCondition: 'Complete ANY ending on INTENSE difficulty'
    }
};

export function getDifficultyProfile(difficultyId: string): DifficultyProfile {
    const normalized = difficultyId.toLowerCase() as DifficultyId;
    return DIFFICULTY_PROFILES[normalized] || DIFFICULTY_PROFILES.normal;
}

export function isDifficultyUnlocked(difficultyId: string): boolean {
    const profile = getDifficultyProfile(difficultyId);
    if (profile.unlocked) return true;
    if (difficultyId.toLowerCase() === 'insane') {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem('insaneModeUnlocked') === 'true';
        }
    }
    return false;
}

export function unlockInsaneMode(): void {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('insaneModeUnlocked', 'true');
        console.log('💀 INSANE MODE UNLOCKED');
    }
}
