/**
 * UV7 V2 Core Type Definitions
 *
 * This file contains all shared type definitions for the game.
 * Types are organized by domain: Scene, State, Events, Characters, etc.
 */

// =============================================================================
// CHARACTER TYPES
// =============================================================================

export type CharacterId = 'ronnie' | 'tori' | 'oldRonnie' | 'echo1' | 'echo2' | 'despair';

export type Emotion =
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'surprised'
  | 'worried'
  | 'smirk'
  | 'blush'
  | 'hurt'
  | 'determined';

export interface Character {
  id: CharacterId;
  name: string;
  color: string;
  sprites: Record<Emotion, string>;
}

// =============================================================================
// SCENE TYPES
// =============================================================================

export type BackgroundId = string;
export type MusicId = string;
export type SoundId = string;

export interface SpriteConfig {
  character: CharacterId;
  emotion: Emotion;
  position: 'left' | 'center' | 'right';
  flip?: boolean;
}

export type SpeakerVariant =
  | 'internal'
  | 'narration'
  | 'whispers'
  | 'shouting'
  | 'through device'
  | 'through game'
  | 'distorted'
  | 'glitching'
  | 'phone';

export interface DialogEntry {
  speaker: CharacterId | 'narrator' | 'system';
  text: string;
  emotion?: Emotion;
  variant?: SpeakerVariant;
  internal?: string; // Stage directions / visual descriptions
  sound?: SoundId;
}

export interface Condition {
  flag?: string;
  counter?: { name: string; comparison: 'gte' | 'lte' | 'eq'; value: number };
  tether?: { comparison: 'gte' | 'lte' | 'eq'; value: number };
}

export interface FlagChange {
  name: string;
  value: boolean | 'toggle';
}

export interface CounterChange {
  name: string;
  operation: 'set' | 'add' | 'subtract';
  value: number;
}

export interface Choice {
  text: string;
  next: string;
  condition?: Condition;
  tetherCost?: number;
  flags?: FlagChange[];
  counters?: CounterChange[];
}

export type EffectType =
  | 'glitch'
  | 'fade'
  | 'fadeIn'
  | 'fadeOut'
  | 'shake'
  | 'flash'
  | 'screenFlash'
  | 'static'
  | 'vhs'
  | 'redpulse'
  | 'tetherdrain'
  | 'haptic';

export type HapticType = 'light' | 'medium' | 'heavy' | 'double' | 'emergency';

export interface Effect {
  type: EffectType;
  duration?: number;
  intensity?: 'low' | 'medium' | 'high';
  hapticType?: HapticType;
  reason?: string; // For debugging/logging
}

export interface ConditionalNext {
  conditions: Array<{
    condition: Condition;
    sceneId: string;
  }>;
  default: string;
}

export type SceneStyle = 'normal' | 'critical' | 'dramatic' | 'quiet';

export interface Scene {
  id: string;
  background?: BackgroundId;
  music?: MusicId;

  sprites?: SpriteConfig[];
  dialog?: DialogEntry[];
  choices?: Choice[];

  effects?: Effect[];
  tetherImpact?: number;

  next?: string | ConditionalNext;
  flags?: FlagChange[];
  counters?: CounterChange[];

  unlockNote?: string;
  unlockAchievement?: string;

  // Display options
  style?: SceneStyle;
  autoAdvanceDelay?: number; // ms before auto-advancing (if auto-advance enabled)
}

// =============================================================================
// STATE TYPES
// =============================================================================

export type RouteId = 'ronnie' | 'tori';
export type ActNumber = 1 | 2 | 3;
export type EndingId = 'true' | 'bad' | 'digital_forever';

export interface EndingRecord {
  routeId: RouteId;
  endingId: string;
  timestamp: number;
  playthrough: number;
}

export interface SaveSlot {
  id: number;
  timestamp: number;
  state: GameState;
  screenshot?: string;
}

export interface GameState {
  // Core navigation
  currentScene: string;
  currentRoute: RouteId | null;
  currentAct: ActNumber;

  // Tether system
  tetherLevel: number;
  tetherDecayRate: number;
  tetherPaused: boolean;

  // Progression tracking
  flags: Record<string, boolean>;
  counters: Record<string, number>;
  visitedScenes: string[];

  // Meta tracking
  playthrough: number;
  totalPlaytime: number;
  endings: EndingRecord[];

  // UI state
  notesUnlocked: string[];
  achievementsUnlocked: string[];
  discoveredCodes: string[];
}

export interface Settings {
  textSpeed: 'slow' | 'normal' | 'fast' | 'instant';
  autoAdvance: boolean;
  autoAdvanceDelay: number;
  hapticEnabled: boolean;
  hapticIntensity: 'light' | 'medium' | 'strong';
  musicVolume: number;
  sfxVolume: number;
  screenShakeEnabled: boolean;
  reducedMotion: boolean;
}

// =============================================================================
// EVENT TYPES
// =============================================================================

export type GameEvents = {
  // Scene events
  'scene:load': { sceneId: string };
  'scene:ready': { sceneId: string };
  'scene:waiting': { sceneId: string };
  'scene:complete': { sceneId: string };
  'scene:validation:error': {
    sceneId: string;
    route?: string;
    act?: number;
    errors: Array<{ path: string; message: string }>;
  };

  // Dialog events
  'dialog:start': { entries: DialogEntry[] };
  'dialog:show': { entry: DialogEntry; index: number };
  'dialog:advance': { index: number };
  'dialog:complete': undefined;

  // Choice events
  'choice:show': { choices: Choice[] };
  'choice:selected': { choice: Choice; index: number };

  // Tether events
  'tether:change': { level: number; delta: number; reason?: string };
  'tether:critical': { level: number };
  'tether:empty': undefined;
  'tether:decay:start': { rate: number };
  'tether:decay:pause': undefined;
  'tether:decay:resume': undefined;

  // Save/Load events
  'save:start': { slot: number };
  'save:complete': { slot: number };
  'save:error': { slot: number; error: string };
  'load:start': { slot: number };
  'load:complete': { slot: number };
  'load:error': { slot: number; error: string };

  // Route events
  'route:start': { routeId: RouteId };
  'route:resume': { routeId: RouteId | null; sceneId: string };
  'route:act:change': { routeId: RouteId; act: ActNumber };
  'route:complete': { routeId: RouteId; endingId: string };

  // Achievement/Note events
  'achievement:unlock': { id: string };
  'note:unlock': { id: string };

  // Effect events
  'effect:start': { effect: Effect };
  'effect:complete': { effect: Effect };

  // Asset events
  'assets:progress': { loaded: number; total: number };
  'assets:complete': undefined;

  // UI events
  'ui:menu:open': { menuId: string };
  'ui:menu:close': { menuId: string };
  'ui:menu:focus': { menuId: string; itemId: string; index: number };
  'ui:menu:select': { menuId: string; itemId: string };
  'ui:modal:open': { modalId: string };
  'ui:modal:close': { modalId: string };
  'ui:splash:start': undefined;
  'ui:splash:progress': { percent: number };
  'ui:splash:complete': undefined;
  'ui:notification': { message: string; type: 'info' | 'warning' | 'error' | 'success' };

  // Code/Easter egg events
  'code:input:open': undefined;
  'code:input:close': undefined;
  'code:activated': { code: { id: string; name: string }; isNew: boolean };
  'code:invalid': { code: string; message: string };
  'easter_egg:trigger': { codeId: string };
  'overlay:show': { type: string };
  'content:unlock': { contentId: string };
  'action:execute': { actionId: string };
  'toggle:changed': { toggleId: string; active: boolean };
  'menu:codes:open': undefined;

  // Dev events
  'dev:command': { command: { id: string; description: string } };
  'dev:console:open': undefined;
  'dev:console:close': undefined;
  'dev:hud:toggle': undefined;
  'dev:confirm': { action: string; message: string };

  // Audio events
  'audio:music:play': { trackId: string };
  'audio:music:stop': undefined;
  'audio:sfx:play': { soundId: string };
};

// Helper type for event handlers
export type EventHandler<K extends keyof GameEvents> =
  GameEvents[K] extends undefined
    ? () => void
    : (payload: GameEvents[K]) => void;

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys];

// =============================================================================
// SYSTEM TYPES
// =============================================================================

export interface GameSystem {
  name: string;
  init?(): Promise<void> | void;
  destroy?(): void;
}
