/**
 * ════════════════════════════════════════════════════════════════
 * CORE TYPES - LEGACY RE-EXPORT
 * Backward compatibility layer
 * ════════════════════════════════════════════════════════════════
 *
 * This file re-exports types from the centralized v2/types directory
 * for backward compatibility with existing imports.
 *
 * NEW CODE SHOULD IMPORT FROM:
 * ```typescript
 * import type { Scene, GameState } from '@types';
 * ```
 *
 * This file maintains compatibility for:
 * ```typescript
 * import type { Scene } from '../core/types';
 * ```
 *
 * 💚🔥💀
 */

// Re-export all game types from centralized location
export type {
    SceneId,
    CharacterId,
    BackgroundId,
    DialogEntry,
    Choice,
    FlagChange,
    ConditionalNext,
    SpriteConfig,
    SceneEffect,
    Scene,
    FlagMap,
    GameState,
    NoteData,
} from '../types/game';
