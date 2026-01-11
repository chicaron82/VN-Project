/**
 * Secret Codes Data
 *
 * Two categories of codes:
 * 1. Discoverable Codes - Tracked in UI, unlock lore/features
 * 2. Dev Commands - Hidden utilities for testing/debugging
 */

// ========================================
// CODE TYPES
// ========================================

export type SecretCodeCategory = 'lore' | 'utility' | 'dev';

export interface SecretCode {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: SecretCodeCategory;
  /** What happens when code is entered */
  rewardType: 'easter_egg' | 'overlay' | 'toggle' | 'unlock' | 'action';
  /** If true, shows in the codes list UI */
  discoverable: boolean;
}

export interface DevCommand {
  id: string;
  description: string;
  category: 'console' | 'reset' | 'tether' | 'testing' | 'general';
}

// ========================================
// DISCOVERABLE SECRET CODES
// Shown in UI with lock icons when undiscovered
// ========================================

export const SECRET_CODES: SecretCode[] = [
  // LORE CODES (9)
  {
    id: 'konami',
    name: 'Konami Code Controller',
    description: 'Enter the legendary code. Some knowledge transcends timelines.',
    icon: '🎮',
    category: 'lore',
    rewardType: 'easter_egg',
    discoverable: true,
  },
  {
    id: 'torigatchi',
    name: 'The Reverse Door',
    description: 'Two versions of Tori. Choose your peace.',
    icon: '🚪',
    category: 'lore',
    rewardType: 'easter_egg',
    discoverable: true,
  },
  {
    id: 'always3',
    name: 'Storm Dragon Signature',
    description: '"Always. Always. Always." - Every time it appears.',
    icon: '💚',
    category: 'lore',
    rewardType: 'easter_egg',
    discoverable: true,
  },
  {
    id: 'uv7crew',
    name: "Director's Cut",
    description: 'Extended crew statements. Behind the chaos.',
    icon: '🎬',
    category: 'lore',
    rewardType: 'unlock',
    discoverable: true,
  },
  {
    id: 'chicharon',
    name: 'Dev Commentary',
    description: 'Behind-the-scenes notes from the creator.',
    icon: '🎙️',
    category: 'lore',
    rewardType: 'unlock',
    discoverable: true,
  },
  {
    id: 'bootstrap',
    name: 'Loop Timeline',
    description: 'Visualize every attempt that led here.',
    icon: '🔄',
    category: 'lore',
    rewardType: 'easter_egg',
    discoverable: true,
  },
  {
    id: 'echo',
    name: 'Voices of 847',
    description: 'Compilation of all echo voice lines.',
    icon: '👻',
    category: 'lore',
    rewardType: 'easter_egg',
    discoverable: true,
  },
  {
    id: '848',
    name: 'True Attempt Number',
    description: 'Your actual loop count (including failures).',
    icon: '🔢',
    category: 'lore',
    rewardType: 'overlay',
    discoverable: true,
  },
  {
    id: 'dizee',
    name: "The Architect's Signature",
    description: 'Recognition for the one who built this world.',
    icon: '🖤',
    category: 'lore',
    rewardType: 'easter_egg',
    discoverable: true,
  },

  // UTILITY CODES (3)
  {
    id: 'echobreak',
    name: 'Echo Silence',
    description: 'Disable Echo interruptions. The observers fall silent.',
    icon: '🔇',
    category: 'utility',
    rewardType: 'toggle',
    discoverable: true,
  },
  {
    id: 'tetherlock',
    name: 'Tether Freeze',
    description: 'Lock tether at current level. Stop the decay.',
    icon: '🔗',
    category: 'utility',
    rewardType: 'toggle',
    discoverable: true,
  },
  {
    id: 'saveanywhere',
    name: 'Cage Breaker',
    description: "Bypass Act 1 save restriction. Despair's cage broken.",
    icon: '⚡',
    category: 'utility',
    rewardType: 'toggle',
    discoverable: true,
  },
];

// ========================================
// DEV COMMANDS
// Hidden - only for testing/debugging
// ========================================

export const DEV_COMMANDS: DevCommand[] = [
  // Console
  { id: 'openconsole', description: 'Open dev console/suite', category: 'console' },
  { id: 'hideconsole', description: 'Close dev console/suite', category: 'console' },
  { id: 'devhud', description: 'Toggle dev HUD overlay', category: 'console' },
  { id: 'devhelp', description: 'Show all dev commands', category: 'console' },

  // Reset
  { id: 'clearnotes', description: 'Clear all collected notes', category: 'reset' },
  { id: 'reset848', description: 'Reset to VERSION 848', category: 'reset' },
  { id: 'reset849', description: 'Set to VERSION 849', category: 'reset' },
  { id: 'clearall', description: 'Clear all save data (with confirm)', category: 'reset' },
  { id: 'nuke', description: 'Nuclear reset (factory reset everything)', category: 'reset' },

  // Tether
  { id: 'freezetether', description: 'Stop tether decay', category: 'tether' },
  { id: 'resumetether', description: 'Resume tether decay', category: 'tether' },
  { id: 'settethermax', description: 'Set tether to 100', category: 'tether' },
  { id: 'settether50', description: 'Set tether to 50', category: 'tether' },

  // Testing
  { id: 'unlockact1saves', description: 'Enable saves in Act 1', category: 'testing' },
  { id: 'enableinsane', description: 'Enable INSANE mode', category: 'testing' },
  { id: 'disableinsane', description: 'Disable INSANE mode', category: 'testing' },
  { id: 'succeeding', description: 'Set True Ending state', category: 'testing' },
  { id: 'accepting', description: 'Set Digital Forever state', category: 'testing' },

  // General
  { id: 'unlockskip', description: 'Unlock skip dialogue feature', category: 'general' },
  { id: 'skipintro', description: 'Unlock skip prologue feature', category: 'general' },
  { id: 'unlockcodes', description: 'Unlock secret codes section', category: 'general' },
  { id: 'revealcodes', description: 'Reveal all secret codes', category: 'general' },
];

// ========================================
// INVALID CODE RESPONSES
// Flavor text for when codes don't match
// ========================================

export const INVALID_CODE_RESPONSES: string[] = [
  'No signal on that frequency.',
  "Tori doesn't recognize that pattern.",
  'Echo not found.',
  'Connection failed. Try another sequence.',
  'Code corrupted. Signal unclear.',
  'That door remains locked.',
  'Access denied. Pattern unknown.',
  'The device stays silent.',
  "System doesn't respond to that input.",
  'Unknown cipher detected.',
];

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Check if a code is discoverable (shows in UI)
 */
export function isCodeDiscoverable(codeId: string): boolean {
  return SECRET_CODES.some((c) => c.id === codeId && c.discoverable);
}

/**
 * Check if a code is a dev command
 */
export function isDevCommand(codeId: string): boolean {
  return DEV_COMMANDS.some((c) => c.id === codeId);
}

/**
 * Get code data by ID
 */
export function getSecretCode(codeId: string): SecretCode | undefined {
  return SECRET_CODES.find((c) => c.id === codeId);
}

/**
 * Get dev command data by ID
 */
export function getDevCommand(commandId: string): DevCommand | undefined {
  return DEV_COMMANDS.find((c) => c.id === commandId);
}

/**
 * Get all discoverable codes
 */
export function getDiscoverableCodes(): SecretCode[] {
  return SECRET_CODES.filter((c) => c.discoverable);
}

/**
 * Get total count of discoverable codes
 */
export function getTotalDiscoverableCount(): number {
  return SECRET_CODES.filter((c) => c.discoverable).length;
}

/**
 * Get a random invalid response
 */
export function getRandomInvalidResponse(lastIndex: number): { message: string; index: number } {
  let index: number;
  do {
    index = Math.floor(Math.random() * INVALID_CODE_RESPONSES.length);
  } while (index === lastIndex && INVALID_CODE_RESPONSES.length > 1);

  return {
    message: INVALID_CODE_RESPONSES[index],
    index,
  };
}

// ========================================
// METADATA
// ========================================

export const SECRET_CODES_META = {
  id: 'secret-codes',
  name: 'Secret Codes',
  description: 'Hidden codes that unlock lore, features, and easter eggs.',
  totalDiscoverable: SECRET_CODES.filter((c) => c.discoverable).length,
  categories: {
    lore: SECRET_CODES.filter((c) => c.category === 'lore').length,
    utility: SECRET_CODES.filter((c) => c.category === 'utility').length,
  },
  storageKey: 'discoveredCodes',
} as const;
