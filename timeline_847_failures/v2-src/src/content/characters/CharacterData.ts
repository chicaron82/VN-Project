/**
 * UV7 V2 Character Data
 *
 * Character definitions, colors, sprites, and metadata.
 * This is the "who they are" - visual and thematic identity.
 *
 * Characters in UV7:
 * - Ronnie: The husband, cyan theme
 * - Tori: The wife, pink theme
 * - Old Ronnie: Future/alternate Ronnie from prologue
 * - Echo 1 (Hope): Fragment of Tori - the hopeful one
 * - Echo 2 (Gentle): Fragment of Tori - the gentle one
 * - Despair: Fragment of Tori - the one who gave up
 */

import type { CharacterId, Character, Emotion } from '../../core/types.ts';

// =============================================================================
// CHARACTER DEFINITIONS
// =============================================================================

/**
 * Full character data with display info
 */
export interface CharacterData extends Character {
  /** Display name for dialog box */
  displayName: string;
  /** Theme color (hex) */
  color: string;
  /** Accent color for highlights */
  accentColor: string;
  /** Glow effect color (rgba) */
  glowColor: string;
  /** Emoji for notes/UI */
  emoji: string;
  /** Brief description */
  description: string;
  /** Sprite asset path (single sprite, not emotion-based) */
  spritePath?: string;
}

/**
 * All characters in UV7
 */
export const CHARACTERS: Record<CharacterId, CharacterData> = {
  ronnie: {
    id: 'ronnie',
    name: 'ronnie',
    displayName: 'Ronnie',
    color: '#00ffff',
    accentColor: '#00ccff',
    glowColor: 'rgba(0, 255, 255, 0.5)',
    emoji: '💙',
    description: 'The husband. Creator of the bootstrap. Trapped in his own loop.',
    spritePath: 'assets/ronnie-sprite.png',
    sprites: createSpriteMap('ronnie'),
  },

  tori: {
    id: 'tori',
    name: 'tori',
    displayName: 'Tori',
    color: '#ff6699',
    accentColor: '#ff99bb',
    glowColor: 'rgba(255, 102, 153, 0.5)',
    emoji: '🖤',
    description: 'The wife. In a coma, and in the code. Her memories echo.',
    spritePath: 'assets/tori-sprite.png',
    sprites: createSpriteMap('tori'),
  },

  oldRonnie: {
    id: 'oldRonnie',
    name: 'oldRonnie',
    displayName: 'Old Man',
    color: '#00ffff',
    accentColor: '#00ccff',
    glowColor: 'rgba(0, 255, 255, 0.3)',
    emoji: '👴',
    description: 'A mysterious old man. Ronnie from a future timeline.',
    spritePath: 'assets/old-ronnie-sprite.png',
    sprites: {} as Record<Emotion, string>, // Single sprite, no emotions
  },

  echo1: {
    id: 'echo1',
    name: 'echo1',
    displayName: 'Hope',
    color: '#bf00ff',
    accentColor: '#d966ff',
    glowColor: 'rgba(191, 0, 255, 0.5)',
    emoji: '✨',
    description: 'Echo fragment - the hopeful one. Still believes in the loop.',
    spritePath: 'assets/threeechoessprite.png',
    sprites: {} as Record<Emotion, string>,
  },

  echo2: {
    id: 'echo2',
    name: 'echo2',
    displayName: 'Gentle',
    color: '#bf00ff',
    accentColor: '#d966ff',
    glowColor: 'rgba(191, 0, 255, 0.5)',
    emoji: '💜',
    description: 'Echo fragment - the gentle one. Accepts what must be.',
    spritePath: 'assets/threeechoessprite.png',
    sprites: {} as Record<Emotion, string>,
  },

  despair: {
    id: 'despair',
    name: 'despair',
    displayName: 'Despair',
    color: '#660066',
    accentColor: '#990099',
    glowColor: 'rgba(102, 0, 102, 0.5)',
    emoji: '🖤',
    description: 'Echo fragment - the one who gave up. 847 failures broke her.',
    spritePath: 'assets/threeechoessprite.png',
    sprites: {} as Record<Emotion, string>,
  },
};

// =============================================================================
// THEMES (Route-specific color schemes)
// =============================================================================

export interface ThemeColors {
  name: string;
  primary: string;
  primaryRgb: string;
  accent: string;
  glow: string;
  glowStrong: string;
  background: string;
  backgroundSolid: string;
  border: string;
  text: string;
  textMuted: string;
  success: string;
  warning: string;
  error: string;
  emoji: string;
}

export const THEMES: Record<string, ThemeColors> = {
  ronnie: {
    name: 'Ronnie',
    primary: '#00ffff',
    primaryRgb: '0, 255, 255',
    accent: '#00ccff',
    glow: 'rgba(0, 255, 255, 0.5)',
    glowStrong: 'rgba(0, 255, 255, 0.8)',
    background: 'rgba(0, 10, 20, 0.95)',
    backgroundSolid: '#000a14',
    border: '#00ffff',
    text: '#00ffff',
    textMuted: '#66cccc',
    success: '#00ff88',
    warning: '#ffcc00',
    error: '#ff4444',
    emoji: '💙',
  },

  tori: {
    name: 'Tori',
    primary: '#ff6699',
    primaryRgb: '255, 102, 153',
    accent: '#ff99bb',
    glow: 'rgba(255, 102, 153, 0.5)',
    glowStrong: 'rgba(255, 102, 153, 0.8)',
    background: 'rgba(20, 0, 10, 0.95)',
    backgroundSolid: '#14000a',
    border: '#ff6699',
    text: '#ff6699',
    textMuted: '#cc6699',
    success: '#00ff88',
    warning: '#ffcc00',
    error: '#ff4444',
    emoji: '🖤',
  },

  menu: {
    name: 'Menu',
    primary: '#00ffff',
    primaryRgb: '0, 255, 255',
    accent: '#00ccff',
    glow: 'rgba(0, 255, 255, 0.5)',
    glowStrong: 'rgba(0, 255, 255, 0.8)',
    background: 'rgba(0, 0, 0, 0.95)',
    backgroundSolid: '#000000',
    border: '#00ffff',
    text: '#00ffff',
    textMuted: '#66cccc',
    success: '#00ff88',
    warning: '#ffcc00',
    error: '#ff4444',
    emoji: '🎮',
  },

  // Ending themes
  trueEnding: {
    name: 'True Ending',
    primary: '#00ff88',
    primaryRgb: '0, 255, 136',
    accent: '#00ffaa',
    glow: 'rgba(0, 255, 136, 0.5)',
    glowStrong: 'rgba(0, 255, 136, 0.8)',
    background: 'rgba(0, 20, 10, 0.95)',
    backgroundSolid: '#00140a',
    border: '#00ff88',
    text: '#00ff88',
    textMuted: '#66cc99',
    success: '#00ff88',
    warning: '#ffcc00',
    error: '#ff4444',
    emoji: '💚',
  },

  digitalForever: {
    name: 'Digital Forever',
    primary: '#ff00ff',
    primaryRgb: '255, 0, 255',
    accent: '#ff66ff',
    glow: 'rgba(255, 0, 255, 0.5)',
    glowStrong: 'rgba(255, 0, 255, 0.8)',
    background: 'rgba(20, 0, 20, 0.95)',
    backgroundSolid: '#140014',
    border: '#ff00ff',
    text: '#ff00ff',
    textMuted: '#cc66cc',
    success: '#00ff88',
    warning: '#ffcc00',
    error: '#ff4444',
    emoji: '💜',
  },

  badEnding: {
    name: 'Bad Ending',
    primary: '#ff4444',
    primaryRgb: '255, 68, 68',
    accent: '#ff6666',
    glow: 'rgba(255, 68, 68, 0.5)',
    glowStrong: 'rgba(255, 68, 68, 0.8)',
    background: 'rgba(20, 0, 0, 0.95)',
    backgroundSolid: '#140000',
    border: '#ff4444',
    text: '#ff4444',
    textMuted: '#cc6666',
    success: '#00ff88',
    warning: '#ffcc00',
    error: '#ff4444',
    emoji: '❤️',
  },
};

// =============================================================================
// NARRATOR STYLES
// =============================================================================

export const NARRATOR_STYLE = {
  color: '#888888',
  displayName: '',
  italic: true,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generate sprite paths for a character (for characters with emotion sprites)
 */
function createSpriteMap(characterId: string): Record<Emotion, string> {
  const emotions: Emotion[] = [
    'neutral',
    'happy',
    'sad',
    'angry',
    'surprised',
    'worried',
    'smirk',
    'blush',
    'hurt',
    'determined',
  ];

  const map = {} as Record<Emotion, string>;
  for (const emotion of emotions) {
    map[emotion] = `/assets/characters/${characterId}/${emotion}.png`;
  }
  return map;
}

/**
 * Get character by ID
 */
export function getCharacter(id: CharacterId): CharacterData {
  return CHARACTERS[id];
}

/**
 * Get character color for dialog styling
 */
export function getCharacterColor(id: CharacterId | 'narrator'): string {
  if (id === 'narrator') return NARRATOR_STYLE.color;
  return CHARACTERS[id]?.color ?? '#ffffff';
}

/**
 * Get character display name
 */
export function getCharacterDisplayName(id: CharacterId | 'narrator'): string {
  if (id === 'narrator') return NARRATOR_STYLE.displayName;
  return CHARACTERS[id]?.displayName ?? id;
}

/**
 * Get theme for route or ending
 */
export function getTheme(themeId: string): ThemeColors {
  return THEMES[themeId] ?? THEMES.menu;
}
