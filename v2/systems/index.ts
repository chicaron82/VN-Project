/**
 * ════════════════════════════════════════════════════════════════
 * V2 Systems - Public API
 *
 * Central exports for game systems and services.
 * Import from '@systems' instead of deep paths.
 *
 * @example
 * ```ts
 * import { SaveSystem, AchievementSystem, TetherSystem } from '@systems';
 * ```
 *
 * 💚🔥💀 UV7 Crew - Version 848
 * ════════════════════════════════════════════════════════════════
 */

// ── Game Systems ──────────────────────────────────────────────
export { SaveSystem } from './SaveSystem';
export { AchievementSystem } from './AchievementSystem';
export { AchievementHooks } from './AchievementHooks';
export { TetherSystem } from './TetherSystem';
export { CollectiblesSystem } from './CollectiblesSystem';
export { EchoMemorySystem } from './EchoMemorySystem';

// ── Content & Rendering ───────────────────────────────────────
export { ContentLoader } from './ContentLoader';
export { SceneRenderer } from './SceneRenderer';
export { CutsceneEngine } from './CutsceneEngine';
export { VisualCueSystem } from './VisualCueSystem';

// ── Input & Interaction ───────────────────────────────────────
export { InputBinder } from './InputBinder';
export { BackButtonManager } from './BackButtonManager';
export { HapticSystem } from './HapticSystem';
export { SettingsSystem } from './SettingsSystem';

// ── Infrastructure ────────────────────────────────────────────
export { AssetLoader } from './AssetLoader';
export { Analytics } from './Analytics';
export { BootstrapTracker } from './BootstrapTracker';
export { ErrorHandler } from './ErrorHandler';
export { PerformanceMonitor } from './PerformanceMonitor';

// ── Tools & Extras ────────────────────────────────────────────
export type { DifficultyProfile } from './DifficultyProfiles';
export { DIFFICULTY_PROFILES, getDifficultyProfile } from './DifficultyProfiles';
export { HotReloadSystem } from './HotReloadSystem';
export { SecretCodesSystem } from './SecretCodesSystem';
export { ScreenshotTool } from './ScreenshotTool';
export { StatusNotificationController } from './StatusNotificationController';
export { TimeMachineSystem } from './TimeMachineSystem';
export { ToriGatchiGateway } from './ToriGatchiGateway';

// ── Dev Suite ─────────────────────────────────────────────────
export { DevSuite } from './DevSuite';
export { DevCommentarySystem } from './DevCommentarySystem';
