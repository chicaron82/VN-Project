import { GameEvents } from './EventBus';
import { GameConfig } from './GameConfig';

/**
 * Shared Type Definitions
 */

// Basic IDs
export type SceneId = string;
export type CharacterId = keyof typeof GameConfig.ASSETS.sprites | 'narrator';
export type BackgroundId = keyof typeof GameConfig.ASSETS.backgrounds;

// Dialog
export interface DialogEntry {
    speaker: CharacterId;
    text: string;
    emotion?: string; // e.g. 'happy', 'sad' - maps to sprite variants
    // Add more as needed (e.g. voice file if we ever add audio, but we won't)
}

// Choices
export interface Choice {
    text: string;
    next: SceneId | null; // null = end of route or special handling
    condition?: string; // Logic string (e.g. flags.has('foo')) - parsed by engine
    tetherCost?: number; // Cost to choose this option
    flags?: FlagChange[];
}

// Scene
export interface Scene {
    id: SceneId;
    type?: string; // e.g. 'dialog', 'narration'
    background?: BackgroundId;
    music?: never; // Explicitly forbid music (V1 design)

    sprites?: SpriteConfig[];

    // Dialog/Narration specific
    character?: string;
    text?: string;
    internal?: string; // Internal monologue/direction

    dialog?: DialogEntry[];
    choices?: Choice[];

    effects?: SceneEffect[];
    tetherImpact?: number; // Modify tether on entry

    next?: SceneId | ConditionalNext;
    flags?: FlagChange[];
}

export interface SpriteConfig {
    id: CharacterId;
    variant?: string;
    position?: 'left' | 'center' | 'right';
    classes?: string[]; // CSS classes for animations
}

export interface SceneEffect {
    type: string; // e.g. 'glitch', 'shake'
    duration?: number;
    timing?: 'start' | 'end';
}

export interface ConditionalNext {
    default: SceneId;
    conditions: Array<{
        if: string;
        then: SceneId;
    }>;
}

export interface FlagChange {
    flag: string;
    value: boolean;
}

// Flag Map
export type FlagMap = Map<string, boolean>;

// Game State
export interface GameState {
    currentScene: SceneId;
    currentRoute: string | null;
    tetherLevel: number;
    flags: Record<string, boolean>; // Record easier for JSON serialization than Map
    history: SceneId[];
    playtime: number;
}
