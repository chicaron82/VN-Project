/**
 * ════════════════════════════════════════════════════════════════
 * V2 Core - Public API
 *
 * Central exports for the engine's foundational modules.
 * Import from '@core' instead of deep paths.
 *
 * @example
 * ```ts
 * import { EventBus, StateManager, GameEngine } from '@core';
 * ```
 *
 * 💚🔥💀 UV7 Crew - Version 848
 * ════════════════════════════════════════════════════════════════
 */

// ── Foundation ────────────────────────────────────────────────
export { EventBus } from './EventBus';
export type { GameEvents, EventName, EventCallback } from './EventBus';

export { StateManager } from './StateManager';
export type { StateChangeCallback } from './StateManager';

export { GameEngine } from './GameEngine';

// ── Configuration ─────────────────────────────────────────────
export { GameConfig } from './GameConfig';

// ── Infrastructure ────────────────────────────────────────────
export { ErrorBoundary } from './ErrorBoundary';
export { TelemetryRecorder } from './Telemetry';
export { SystemInitializer } from './SystemInitializer';

// ── Input & Controls ──────────────────────────────────────────
export { KeyboardController } from './KeyboardController';
export { SwipeHandler } from './SwipeHandler';
export { AutoReadController } from './AutoReadController';
export { BacklogManager } from './BacklogManager';

// ── Dev Tools ─────────────────────────────────────────────────
export { DebugInterface } from './DebugInterface';
export { MacroRunner } from './MacroRunner';
