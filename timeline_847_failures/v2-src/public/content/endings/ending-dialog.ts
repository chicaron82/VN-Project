/**
 * Ending Dialog System
 *
 * Three-option ending dialog that appears after completing any ending.
 * Options: Try Again, Accept Ending (credits), Return to Menu
 */

import type { EndingId } from '../../core/types';

// ========================================
// DIALOG OPTIONS
// ========================================

export interface EndingDialogOption {
  id: 'retry' | 'accept' | 'exit';
  label: string;
  description: string;
  action: 'restart' | 'credits' | 'menu';
}

/**
 * The three options available after any ending
 */
export const ENDING_DIALOG_OPTIONS: EndingDialogOption[] = [
  {
    id: 'retry',
    label: 'Try Again',
    description: 'Restart the game from the beginning',
    action: 'restart',
  },
  {
    id: 'accept',
    label: 'Accept This Ending',
    description: 'Watch the credits for this ending',
    action: 'credits',
  },
  {
    id: 'exit',
    label: 'Return to Menu',
    description: 'Skip credits and return to main menu',
    action: 'menu',
  },
];

// ========================================
// DIALOG CONFIGURATION
// ========================================

export interface EndingDialogConfig {
  /** The type of ending reached */
  endingType: EndingId;
  /** Which route the player was on */
  route: 'ronnie' | 'tori';
  /** Current game version (for loop tracking) */
  version: number;
}

/**
 * Get the dialog title based on ending type
 */
export function getEndingDialogTitle(endingType: EndingId): string {
  switch (endingType) {
    case 'true':
      return 'True Ending';
    case 'bad':
      return 'Bad Ending';
    case 'digital_forever':
      return 'Digital Forever Ending';
    default:
      return 'Ending';
  }
}

/**
 * Get the dialog subtitle based on ending type
 */
export function getEndingDialogSubtitle(endingType: EndingId): string {
  switch (endingType) {
    case 'true':
      return 'She came home.';
    case 'bad':
      return 'The loop begins again...';
    case 'digital_forever':
      return 'Together, eternally still.';
    default:
      return '';
  }
}

// ========================================
// KEYBOARD NAVIGATION
// ========================================

export interface EndingDialogNavigationConfig {
  /** Keys to move up in the menu */
  upKeys: string[];
  /** Keys to move down in the menu */
  downKeys: string[];
  /** Keys to cycle through options */
  cycleKeys: string[];
  /** Keys to select the current option */
  selectKeys: string[];
  /** Keys to quick-exit (defaults to Exit option) */
  exitKeys: string[];
}

export const ENDING_DIALOG_NAVIGATION: EndingDialogNavigationConfig = {
  upKeys: ['ArrowUp', 'w', 'W'],
  downKeys: ['ArrowDown', 's', 'S'],
  cycleKeys: ['Tab'],
  selectKeys: ['Enter', ' '],
  exitKeys: ['Escape'],
};

// ========================================
// DIALOG METADATA
// ========================================

export const ENDING_DIALOG_META = {
  id: 'ending-dialog',
  name: 'Ending Dialog',
  description: 'Post-ending options menu with three choices.',
  optionCount: 3,
  defaultFocus: 0, // Focus on first option (Try Again)
  escapeAction: 'exit', // Escape key triggers Exit option
} as const;

// ========================================
// STYLING HINTS
// ========================================

export interface EndingDialogStyle {
  /** Background color for the dialog */
  backgroundColor: string;
  /** Accent color based on ending type */
  accentColor: string;
  /** Text color */
  textColor: string;
}

/**
 * Get styling hints for the ending dialog based on ending type
 */
export function getEndingDialogStyle(endingType: EndingId): EndingDialogStyle {
  switch (endingType) {
    case 'true':
      return {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        accentColor: '#00ff88',
        textColor: '#ffffff',
      };
    case 'digital_forever':
      return {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        accentColor: '#ff6699',
        textColor: '#ffffff',
      };
    case 'bad':
      return {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        accentColor: '#ff0066',
        textColor: '#ffffff',
      };
    default:
      return {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        accentColor: '#00ffff',
        textColor: '#ffffff',
      };
  }
}
