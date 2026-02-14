/**
 * ════════════════════════════════════════════════════════════════
 * GAME TYPES - CORE GAMEPLAY STRUCTURES
 * Version 848 VN game state, scenes, dialog, and narrative flow
 * ════════════════════════════════════════════════════════════════
 *
 * This module contains all core gameplay types:
 * - Scene definitions (dialog, choices, effects)
 * - Game state (tether, flags, history)
 * - Character and asset references
 * - Narrative flow control
 *
 * 💚🔥💀
 */

import type { GameConfig } from '../core/GameConfig';

// ==========================================
// BASIC IDS & REFERENCES
// ==========================================

/**
 * Unique identifier for a scene in the narrative
 * Scenes are the atomic units of the story
 */
export type SceneId = string;

/**
 * Character identifier - references sprite assets
 * 'narrator' is a special case for narration without a sprite
 */
export type CharacterId = keyof typeof GameConfig.ASSETS.sprites | 'narrator';

/**
 * Background identifier - references background assets
 */
export type BackgroundId = keyof typeof GameConfig.ASSETS.backgrounds;

// ==========================================
// DIALOG & CONVERSATION
// ==========================================

/**
 * Single dialog line with speaker, text, and emotion
 * Used in scenes with multiple speakers (conversations)
 */
export interface DialogEntry {
    /** Character speaking this line */
    speaker: CharacterId;
    /** Dialog text displayed to player */
    text: string;
    /** Optional emotion/variant (maps to sprite variants like 'happy', 'sad') */
    emotion?: string;
}

// ==========================================
// CHOICES & BRANCHING
// ==========================================

/**
 * Player choice option with narrative and mechanical consequences
 */
export interface Choice {
    /** Choice text displayed to player */
    text: string;
    /** Next scene ID, or null for route end */
    next: SceneId | null;
    /** Optional condition string (e.g. "flags.has('foo')") */
    condition?: string;
    /** Tether cost to select this choice (mechanics) */
    tetherCost?: number;
    /** Flags to set when this choice is selected */
    flags?: FlagChange[];
}

/**
 * Flag state change (for narrative branching)
 */
export interface FlagChange {
    /** Flag identifier */
    flag: string;
    /** New boolean value */
    value: boolean;
}

/**
 * Conditional next scene routing
 * Evaluates conditions in order, uses default if none match
 */
export interface ConditionalNext {
    /** Default scene if no conditions match */
    default: SceneId;
    /** Ordered list of condition → scene mappings */
    conditions: Array<{
        /** Condition string to evaluate */
        if: string;
        /** Scene to transition to if condition is true */
        then: SceneId;
    }>;
}

// ==========================================
// SCENE DEFINITION
// ==========================================

/**
 * Sprite rendering configuration for a scene
 */
export interface SpriteConfig {
    /** Character identifier */
    id: string;
    /** Full path to sprite variant image */
    variant?: string;
    /** Sprite horizontal position */
    position?: 'left' | 'center' | 'right';
    /** CSS classes for animations (e.g., fade-in, shake) */
    classes?: string[];
}

/**
 * Visual/audio effect for scene transitions or emphasis
 */
export interface SceneEffect {
    /** Effect type (e.g., 'glitch', 'shake', 'flash') */
    type: string;
    /** Effect duration in milliseconds */
    duration?: number;
    /** When to trigger effect */
    timing?: 'start' | 'end';
}

/**
 * Complete scene definition - the atomic unit of narrative
 * Scenes can be dialog, narration, choices, or cutscenes
 */
export interface Scene {
    /** Unique scene identifier */
    id: SceneId;
    /** Scene type hint */
    type?: string;
    /** Background image path for this scene (resolved relative to /v2/) */
    background?: string;
    /** Music explicitly forbidden (V1 design decision) */
    music?: never;

    /** Sprite configurations for characters on screen */
    sprites?: SpriteConfig[];

    /** Single character speaking (simple dialog) */
    character?: string;
    /** Main text content */
    text?: string;
    /** Internal monologue or stage direction */
    internal?: string;

    /** Multi-speaker dialog array */
    dialog?: DialogEntry[];
    /** Player choice options */
    choices?: Choice[];

    /** Visual/audio effects for this scene */
    effects?: SceneEffect[];
    /** Tether level change on scene entry */
    tetherImpact?: number;

    /** Next scene (simple or conditional routing) */
    next?: SceneId | ConditionalNext;
    /** Flags to set when this scene is entered */
    flags?: FlagChange[];
}

// ==========================================
// GAME STATE
// ==========================================

/**
 * Flag storage - boolean flags for narrative branching
 * Record used instead of Map for easier JSON serialization
 */
export type FlagMap = Map<string, boolean>;

/**
 * Complete game state snapshot (for save/load)
 * Contains all information needed to restore a playthrough
 */
export interface GameState {
    /** Current scene ID */
    currentScene: SceneId;
    /** Active route ('ronnie' or 'tori') */
    currentRoute: string | null;
    /** Current tether level (consciousness stability) */
    tetherLevel: number;
    /** Narrative flags (Record for JSON compatibility) */
    flags: Record<string, boolean>;
    /** Scene history (for backlog/rewind) */
    history: SceneId[];
    /** Total playtime in milliseconds */
    playtime: number;
}

// ==========================================
// COLLECTIBLES
// ==========================================

/**
 * Note/message data structure
 * Notes are collectible lore items from different crew members
 */
export interface NoteData {
    /** Unique note identifier */
    id: string;
    /** Note type - maps to crew member */
    type: 'z' | 'cz' | 'zr' | 'gz' | 'iz' | 'pz' | 'special';
    /** Note title */
    title: string;
    /** Note content text */
    content: string;
    /** Derived sender name (e.g., "Zee", "Belle") */
    sender: string;
    /** Optional unlock condition string */
    unlockCondition?: string;
}
