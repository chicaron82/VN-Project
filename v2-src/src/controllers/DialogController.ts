/**
 * UV7 V2 DialogController
 *
 * Manages dialog display, typewriter effect, and player choices.
 *
 * Features:
 * - Typewriter text animation
 * - Dialog queue management
 * - Choice presentation and selection
 * - Auto-advance support
 * - Skip functionality
 */

import type { DialogEntry, Choice, GameSystem } from '../core/index.ts';
import { EventBus, eventBus } from '../core/EventBus.ts';
import { SettingsSystem, settingsSystem } from '../systems/SettingsSystem.ts';

export interface DialogControllerConfig {
  eventBus?: EventBus;
  settingsSystem?: SettingsSystem;
}

type DialogState = 'idle' | 'typing' | 'waiting' | 'choosing';

export class DialogController implements GameSystem {
  readonly name = 'DialogController';

  private eventBus: EventBus;
  private settings: SettingsSystem;

  private state: DialogState = 'idle';
  private dialogQueue: DialogEntry[] = [];
  private currentIndex: number = 0;
  private currentText: string = '';
  private displayedText: string = '';
  private typewriterInterval: ReturnType<typeof setInterval> | null = null;
  private autoAdvanceTimeout: ReturnType<typeof setTimeout> | null = null;

  private currentChoices: Choice[] | null = null;
  private onChoiceCallback: ((choice: Choice, index: number) => void) | null = null;

  constructor(config: DialogControllerConfig = {}) {
    this.eventBus = config.eventBus ?? eventBus;
    this.settings = config.settingsSystem ?? settingsSystem;
  }

  // =========================================================================
  // LIFECYCLE
  // =========================================================================

  init(): void {
    // Nothing to initialize
  }

  destroy(): void {
    this.clear();
  }

  // =========================================================================
  // DIALOG CONTROL
  // =========================================================================

  /**
   * Start a dialog sequence
   */
  startDialog(entries: DialogEntry[]): void {
    if (entries.length === 0) return;

    this.dialogQueue = [...entries];
    this.currentIndex = 0;

    this.eventBus.emit('dialog:start', { entries });
    this.showCurrentEntry();
  }

  /**
   * Advance to next dialog entry or complete current typing
   */
  advance(): void {
    switch (this.state) {
      case 'typing':
        // Skip to end of current text
        this.completeTyping();
        break;

      case 'waiting':
        // Move to next entry
        this.nextEntry();
        break;

      case 'choosing':
        // Can't advance during choice
        break;

      case 'idle':
        // Nothing to do
        break;
    }
  }

  /**
   * Skip all remaining dialog
   */
  skipAll(): void {
    this.clearTimers();
    this.state = 'idle';
    this.dialogQueue = [];
    this.currentIndex = 0;

    this.eventBus.emit('dialog:complete');
  }

  /**
   * Clear dialog state
   */
  clear(): void {
    this.clearTimers();
    this.state = 'idle';
    this.dialogQueue = [];
    this.currentIndex = 0;
    this.currentText = '';
    this.displayedText = '';
    this.currentChoices = null;
    this.onChoiceCallback = null;
  }

  // =========================================================================
  // CHOICES
  // =========================================================================

  /**
   * Present choices to the player
   */
  showChoices(
    choices: Choice[],
    onSelect: (choice: Choice, index: number) => void
  ): void {
    this.clearTimers();
    this.state = 'choosing';
    this.currentChoices = choices;
    this.onChoiceCallback = onSelect;

    this.eventBus.emit('choice:show', { choices });
  }

  /**
   * Handle player choice selection
   */
  selectChoice(index: number): void {
    if (this.state !== 'choosing' || !this.currentChoices) return;

    const choice = this.currentChoices[index];
    if (!choice) return;

    this.state = 'idle';
    const callback = this.onChoiceCallback;
    this.currentChoices = null;
    this.onChoiceCallback = null;

    this.eventBus.emit('choice:selected', { choice, index });

    if (callback) {
      callback(choice, index);
    }
  }

  /**
   * Get visible choices (filtered by conditions)
   */
  getVisibleChoices(): Choice[] {
    if (!this.currentChoices) return [];

    // TODO: Filter by conditions when condition system is implemented
    return this.currentChoices;
  }

  // =========================================================================
  // STATE QUERIES
  // =========================================================================

  /**
   * Get current dialog state
   */
  getState(): DialogState {
    return this.state;
  }

  /**
   * Check if dialog is active
   */
  isActive(): boolean {
    return this.state !== 'idle';
  }

  /**
   * Check if currently typing
   */
  isTyping(): boolean {
    return this.state === 'typing';
  }

  /**
   * Check if waiting for player input
   */
  isWaiting(): boolean {
    return this.state === 'waiting';
  }

  /**
   * Check if showing choices
   */
  isChoosing(): boolean {
    return this.state === 'choosing';
  }

  /**
   * Get current displayed text
   */
  getDisplayedText(): string {
    return this.displayedText;
  }

  /**
   * Get current dialog entry
   */
  getCurrentEntry(): DialogEntry | null {
    return this.dialogQueue[this.currentIndex] ?? null;
  }

  /**
   * Get progress through dialog
   */
  getProgress(): { current: number; total: number } {
    return {
      current: this.currentIndex + 1,
      total: this.dialogQueue.length,
    };
  }

  // =========================================================================
  // PRIVATE
  // =========================================================================

  private showCurrentEntry(): void {
    const entry = this.dialogQueue[this.currentIndex];
    if (!entry) {
      this.completeDialog();
      return;
    }

    this.currentText = entry.text;
    this.displayedText = '';
    this.state = 'typing';

    this.eventBus.emit('dialog:show', {
      entry,
      index: this.currentIndex,
    });

    this.startTypewriter();
  }

  private startTypewriter(): void {
    const speed = this.settings.getTextSpeedMs();

    if (speed === 0) {
      // Instant display
      this.completeTyping();
      return;
    }

    let charIndex = 0;
    this.typewriterInterval = setInterval(() => {
      if (charIndex >= this.currentText.length) {
        this.completeTyping();
        return;
      }

      charIndex++;
      this.displayedText = this.currentText.slice(0, charIndex);
    }, speed);
  }

  private completeTyping(): void {
    this.clearTimers();
    this.displayedText = this.currentText;
    this.state = 'waiting';

    // Start auto-advance if enabled
    if (this.settings.get('autoAdvance')) {
      const delay = this.settings.get('autoAdvanceDelay');
      this.autoAdvanceTimeout = setTimeout(() => {
        if (this.state === 'waiting') {
          this.nextEntry();
        }
      }, delay);
    }
  }

  private nextEntry(): void {
    this.clearTimers();
    this.currentIndex++;

    this.eventBus.emit('dialog:advance', { index: this.currentIndex });

    if (this.currentIndex >= this.dialogQueue.length) {
      this.completeDialog();
    } else {
      this.showCurrentEntry();
    }
  }

  private completeDialog(): void {
    this.state = 'idle';
    this.dialogQueue = [];
    this.currentIndex = 0;
    this.currentText = '';
    this.displayedText = '';

    this.eventBus.emit('dialog:complete');
  }

  private clearTimers(): void {
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
      this.typewriterInterval = null;
    }
    if (this.autoAdvanceTimeout) {
      clearTimeout(this.autoAdvanceTimeout);
      this.autoAdvanceTimeout = null;
    }
  }
}

// Singleton instance
export const dialogController = new DialogController();
