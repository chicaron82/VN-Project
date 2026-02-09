/**
 * ════════════════════════════════════════════════════════════════
 * TYPES BARREL EXPORT - CENTRALIZED TYPE IMPORTS
 * All UV7 types organized in one place
 * ════════════════════════════════════════════════════════════════
 *
 * Import types from here for better discoverability and organization:
 *
 * ```typescript
 * import type { Scene, GameState, GameEvents } from '@types';
 * ```
 *
 * Instead of scattered imports from different modules:
 *
 * ```typescript
 * import type { Scene } from '../core/types';
 * import type { GameEvents } from '../core/EventBus';
 * ```
 *
 * Type Categories:
 * - game.ts - Core gameplay (Scene, Dialog, Choice, GameState, etc.)
 * - events.ts - EventBus event definitions
 *
 * 💚🔥💀
 */

// ==========================================
// GAME TYPES (Core Gameplay)
// ==========================================

export type {
    // IDs & References
    SceneId,
    CharacterId,
    BackgroundId,

    // Dialog & Conversation
    DialogEntry,

    // Choices & Branching
    Choice,
    FlagChange,
    ConditionalNext,

    // Scene Definition
    SpriteConfig,
    SceneEffect,
    Scene,

    // Game State
    FlagMap,
    GameState,

    // Collectibles
    NoteData,
} from './game';

// ==========================================
// EVENT TYPES (EventBus)
// ==========================================

export type {
    GameEvents,
    EventName,
    EventCallback,
} from './events';

// ==========================================
// RE-EXPORTS (for backward compatibility)
// ==========================================

// Core types are still available from v2/core/types
// This barrel export provides centralized access
