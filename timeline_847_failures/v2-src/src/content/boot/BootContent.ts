/**
 * UV7 V2 Boot Content
 *
 * System files displayed during boot sequence.
 * Organized by category for visual grouping.
 * This is the "seasoning" - all the personality of the boot sequence.
 */

export interface SystemFile {
  name: string;
  size: string;
  color: string;
  glitch?: boolean;
  pause?: boolean;
  flash?: boolean;
  error?: boolean;
  conditional?: 'torigatchi' | 'insane';
}

export interface SystemCategory {
  name: string;
  files: SystemFile[];
  hapticIntensity?: 'soft' | 'medium' | 'heavy';
}

/**
 * System files to display during boot sequence
 * Each category advances the progress bar proportionally
 */
export const SYSTEM_FILES: Record<string, SystemFile[]> = {
  core: [
    { name: 'game-engine.js', size: '8.9K lines', color: '#00ffff' },
    { name: 'state-manager.ts', size: '400 lines', color: '#00ffff' },
    { name: 'save-manager.js', size: '350 lines', color: '#00ffff' },
    { name: 'settings-manager.js', size: '500 lines', color: '#00ffff' },
  ],
  tether: [
    { name: 'tether-system.js', size: '750 lines', color: '#00ff88', glitch: false },
    { name: 'echo-memory-system.js', size: '533 lines', color: '#bf00ff', pause: true },
    { name: 'hold-on-controller.js', size: '200 lines', color: '#00ff88' },
  ],
  routes: [
    { name: 'tori-route-act1.js', size: '1.2K lines', color: '#00aaff' },
    { name: 'tori-route-endings.js', size: '800 lines', color: '#00aaff' },
    { name: 'ronnie-route.js', size: '1.5K lines', color: '#ffaa00' },
    { name: 'epilogue.js', size: '600 lines', color: '#ffd700' },
    { name: 'shared-prologue.js', size: '400 lines', color: '#bf00ff' },
  ],
  ui: [
    { name: 'notification-shade-controller.js', size: '450 lines', color: '#00ffff' },
    { name: 'sprite-controller.js', size: '300 lines', color: '#00ffff' },
    { name: 'backlog-controller.js', size: '250 lines', color: '#00ffff' },
    { name: 'menu-controller.js', size: '200 lines', color: '#00ffff' },
  ],
  special: [
    { name: 'insane-visuals-controller.js', size: '350 lines', color: '#ff0066', glitch: true },
    { name: 'easter-egg-controller.js', size: '180 lines', color: '#ffd700' },
    { name: 'haptic-controller.js', size: '150 lines', color: '#ff00ff' },
  ],
  easterEggs: [
    { name: 'definitely-not-skynet.js', size: '???', color: '#ff0000', flash: true, error: true },
    { name: 'torigatchi-secret.js', size: '???', color: '#00ff88', conditional: 'torigatchi' },
    { name: 'the-truth.exe', size: '848 bytes', color: '#bf00ff', conditional: 'insane' },
  ],
};

/**
 * Boot sequence categories with progress ranges
 * progressStart/End control logo reveal sync
 */
export const BOOT_CATEGORIES: SystemCategory[] = [
  { name: 'CORE SYSTEMS', files: SYSTEM_FILES.core, hapticIntensity: 'soft' },
  { name: 'TETHER FRAMEWORK', files: SYSTEM_FILES.tether, hapticIntensity: 'medium' },
  { name: 'ROUTE HANDLERS', files: SYSTEM_FILES.routes, hapticIntensity: 'soft' },
  { name: 'UI CONTROLLERS', files: SYSTEM_FILES.ui, hapticIntensity: 'soft' },
  { name: 'SPECIAL SYSTEMS', files: SYSTEM_FILES.special, hapticIntensity: 'heavy' },
];

/**
 * Category-specific timing (base speed in ms)
 */
export const CATEGORY_SPEEDS: Record<string, number> = {
  'CORE SYSTEMS': 40,
  'TETHER FRAMEWORK': 50,
  'ROUTE HANDLERS': 35,
  'UI CONTROLLERS': 30,
  'SPECIAL SYSTEMS': 45,
};

/**
 * Progress ranges for each category (for logo reveal sync)
 */
export const CATEGORY_PROGRESS: Record<string, { start: number; end: number }> = {
  'CORE SYSTEMS': { start: 0, end: 25 },
  'TETHER FRAMEWORK': { start: 25, end: 50 },
  'ROUTE HANDLERS': { start: 50, end: 75 },
  'UI CONTROLLERS': { start: 75, end: 90 },
  'SPECIAL SYSTEMS': { start: 90, end: 98 },
};
