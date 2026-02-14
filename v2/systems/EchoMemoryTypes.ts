/**
 * Echo Memory Types
 * Type definitions for Belle's Meta-Awareness system.
 *
 * The three echoes (Hope, Gentle, Despair) gradually become aware
 * of the player's loops and comment on repeated behaviors.
 *
 * ECHO PERSONALITIES:
 * - Echo 1 (Hope): Optimistic 💫 - triggered by persistence
 * - Echo 2 (Gentle): Soft/resigned 🌙 - triggered by hesitation
 * - Echo 3 (Despair): Bitter truth-teller 🖤 - triggered by failure
 *
 * AWARENESS LEVELS:
 * 0 = Dormant (first playthrough, silent)
 * 1 = Vague (2-3 loops, "feels familiar")
 * 2 = Aware (5+ loops, "you've been here before")
 * 3 = Fourth Wall (10+ loops, direct address to player)
 * 4 = Glitch (20+ loops, reality breaking)
 *
 * 848 is sacred. 💚🔥💀
 */

// ========================================
// TYPES
// ========================================

/**
 * The three echo identities
 * DiZee: Each has distinct personality and trigger conditions
 */
export type EchoType = 'hope' | 'gentle' | 'despair';

/**
 * Awareness levels 0-4
 * Belle's progression system for meta-awareness
 */
export type AwarenessLevel = 0 | 1 | 2 | 3 | 4;

/**
 * Context types for echo comments
 * Zee Polish: Context-specific responses feel more intentional
 */
export type EchoContext =
    | 'general'
    | 'despairHijack'
    | 'noteHunting'
    | 'saveScum'
    | 'repeatedDeath'
    | 'longPause';

/**
 * Echo awareness state per echo
 */
export interface EchoAwareness {
    hope: AwarenessLevel;
    gentle: AwarenessLevel;
    despair: AwarenessLevel;
}

/**
 * Route completion tracking
 */
export interface RouteCompletions {
    ronnie: number;
    tori: number;
}

/**
 * Full persistent memory structure
 * Belle: This persists across ALL saves globally
 */
export interface EchoMemory {
    // Total loops/replays
    totalLoops: number;
    routeCompletions: RouteCompletions;

    // Death tracking
    deathLocations: Record<string, number>;  // sceneId → count
    tetherDeaths: number;
    despairDeaths: number;

    // Choice patterns
    choiceHistory: Record<string, number[]>;  // choiceId → [selected option indices]
    wrongChoiceRepeats: Record<string, number>;  // choiceId → count of same wrong choice

    // Player behavior
    saveScumCount: number;  // Quick save/load within 10 seconds
    notesViewerOpens: number;
    longPausesAtChoices: Record<string, number>;  // choiceId → pause count (>10s)

    // Echo awareness levels
    echoAwareness: EchoAwareness;

    // Achievement tracking
    triggeredAllEchoes: boolean;

    // Last activity timestamps
    lastSaveTime: number;
    lastLoadTime: number;
    lastChoiceTime: number;
}

/**
 * Comment pools organized by awareness level
 */
export type CommentPool = Record<AwarenessLevel, string[]>;

/**
 * All echo comment pools
 */
export interface EchoComments {
    hope: CommentPool;
    gentle: CommentPool;
    despair: CommentPool;
}

/**
 * Context-specific comment pools
 */
export interface ContextComments {
    despairHijack: string[];
    hopeNoteHunting: string[];
    gentleSaveScum: string[];
    despairRepeatedDeath: string[];
}

/**
 * Echo comment event payload
 */
export interface EchoCommentPayload {
    echo: EchoType;
    message: string;
    icon: string;
    awareness: AwarenessLevel;
    context: EchoContext;
}
