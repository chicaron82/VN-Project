/**
 * UV7 V2 GameView
 *
 * Main game view container for visual novel gameplay.
 * Manages background, character sprites, dialog box, and choices.
 */

import { Component } from '../components/Component.ts';
import type { ComponentConfig } from '../components/Component.ts';
import type { CharacterId, Emotion, DialogEntry, Choice } from '../../core/index.ts';

export interface GameViewConfig extends ComponentConfig {
  onAdvance?: () => void;
  onChoice?: (choice: Choice, index: number) => void;
}

export class GameView extends Component {
  private viewConfig: GameViewConfig;
  private backgroundElement: HTMLElement | null = null;
  private characterLayer: HTMLElement | null = null;
  private dialogBox: HTMLElement | null = null;
  private speakerName: HTMLElement | null = null;
  private dialogText: HTMLElement | null = null;
  private choicesContainer: HTMLElement | null = null;
  private currentChoices: Choice[] = [];

  constructor(config: GameViewConfig = {}) {
    super({ ...config, deferElementCreation: true });
    this.viewConfig = config;
    this.createElementDeferred();
  }

  protected createElement(className?: string): HTMLElement {
    const view = document.createElement('div');
    view.className = `uv7-game ${className ?? ''}`.trim();

    view.innerHTML = `
      <div class="uv7-game__background"></div>
      <div class="uv7-game__characters"></div>
      <div class="uv7-game__ui">
        <div class="uv7-game__dialog" role="region" aria-label="Dialog">
          <div class="uv7-game__speaker"></div>
          <div class="uv7-game__text"></div>
        </div>
        <div class="uv7-game__choices" role="menu" aria-label="Choices"></div>
      </div>
    `;

    this.backgroundElement = view.querySelector('.uv7-game__background');
    this.characterLayer = view.querySelector('.uv7-game__characters');
    this.dialogBox = view.querySelector('.uv7-game__dialog');
    this.speakerName = view.querySelector('.uv7-game__speaker');
    this.dialogText = view.querySelector('.uv7-game__text');
    this.choicesContainer = view.querySelector('.uv7-game__choices');

    return view;
  }

  override init(): void {
    // Click to advance
    this.on('click', (e) => {
      // Don't advance if clicking on choices
      if ((e.target as HTMLElement).closest('.uv7-game__choices')) return;
      this.viewConfig.onAdvance?.();
    });

    // Keyboard navigation
    this.on('keydown', (e) => this.handleKeydown(e));

    // Listen for game events
    this.onEvent('dialog:show', ({ entry }) => this.showDialog(entry));
    this.onEvent('choice:show', ({ choices }) => this.showChoices(choices));
  }

  // =========================================================================
  // BACKGROUND
  // =========================================================================

  /**
   * Set background image
   */
  setBackground(imageUrl: string): void {
    if (this.backgroundElement) {
      this.backgroundElement.style.backgroundImage = `url('${imageUrl}')`;
    }
  }

  /**
   * Clear background
   */
  clearBackground(): void {
    if (this.backgroundElement) {
      this.backgroundElement.style.backgroundImage = '';
    }
  }

  /**
   * Fade background transition
   */
  async transitionBackground(imageUrl: string, duration = 500): Promise<void> {
    if (!this.backgroundElement) return;

    // Create overlay for crossfade
    const overlay = document.createElement('div');
    overlay.className = 'uv7-game__background uv7-game__background--overlay';
    overlay.style.backgroundImage = `url('${imageUrl}')`;
    overlay.style.opacity = '0';
    this.backgroundElement.parentElement?.appendChild(overlay);

    // Fade in overlay
    await this.animateElement(overlay, [{ opacity: 0 }, { opacity: 1 }], { duration });

    // Set new background and remove overlay
    this.setBackground(imageUrl);
    overlay.remove();
  }

  // =========================================================================
  // CHARACTERS
  // =========================================================================

  /**
   * Show a character sprite
   */
  showCharacter(
    character: CharacterId,
    emotion: Emotion = 'neutral',
    position: 'left' | 'center' | 'right' = 'center'
  ): void {
    if (!this.characterLayer) return;

    // Remove existing instance of this character
    this.hideCharacter(character);

    const sprite = document.createElement('div');
    sprite.className = `uv7-game__character uv7-game__character--${position}`;
    sprite.dataset.character = character;
    sprite.dataset.emotion = emotion;

    // Image path convention
    sprite.style.backgroundImage = `url('/assets/characters/${character}/${emotion}.png')`;

    this.characterLayer.appendChild(sprite);
  }

  /**
   * Hide a character
   */
  hideCharacter(character: CharacterId): void {
    const existing = this.characterLayer?.querySelector(`[data-character="${character}"]`);
    existing?.remove();
  }

  /**
   * Hide all characters
   */
  clearCharacters(): void {
    if (this.characterLayer) {
      this.characterLayer.innerHTML = '';
    }
  }

  /**
   * Update character emotion
   */
  setCharacterEmotion(character: CharacterId, emotion: Emotion): void {
    const sprite = this.characterLayer?.querySelector(`[data-character="${character}"]`) as HTMLElement;
    if (sprite) {
      sprite.dataset.emotion = emotion;
      sprite.style.backgroundImage = `url('/assets/characters/${character}/${emotion}.png')`;
    }
  }

  // =========================================================================
  // DIALOG
  // =========================================================================

  /**
   * Show dialog entry
   */
  showDialog(entry: DialogEntry): void {
    if (this.speakerName) {
      this.speakerName.textContent = this.formatSpeakerName(entry.speaker);
      this.speakerName.dataset.speaker = entry.speaker;
    }

    if (this.dialogText) {
      this.dialogText.textContent = '';
    }

    // Show dialog box
    this.dialogBox?.classList.add('uv7-game__dialog--visible');
    this.hideChoices();
  }

  /**
   * Update displayed text (for typewriter effect)
   */
  setDialogText(text: string): void {
    if (this.dialogText) {
      this.dialogText.textContent = text;
    }
  }

  /**
   * Hide dialog box
   */
  hideDialog(): void {
    this.dialogBox?.classList.remove('uv7-game__dialog--visible');
  }

  /**
   * Get dialog text element (for external animations)
   */
  getDialogTextElement(): HTMLElement | null {
    return this.dialogText;
  }

  // =========================================================================
  // CHOICES
  // =========================================================================

  /**
   * Show choices
   */
  showChoices(choices: Choice[]): void {
    if (!this.choicesContainer) return;

    this.currentChoices = choices;
    this.choicesContainer.innerHTML = '';

    choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.className = 'uv7-game__choice';
      button.setAttribute('role', 'menuitem');
      button.textContent = choice.text;

      if (choice.tetherCost) {
        const cost = document.createElement('span');
        cost.className = 'uv7-game__choice-cost';
        cost.textContent = `${choice.tetherCost > 0 ? '+' : ''}${choice.tetherCost}`;
        button.appendChild(cost);
      }

      button.addEventListener('click', () => this.selectChoice(index));
      this.choicesContainer!.appendChild(button);
    });

    this.choicesContainer.classList.add('uv7-game__choices--visible');

    // Focus first choice
    const firstChoice = this.choicesContainer.querySelector('button');
    firstChoice?.focus();
  }

  /**
   * Hide choices
   */
  hideChoices(): void {
    this.choicesContainer?.classList.remove('uv7-game__choices--visible');
    this.currentChoices = [];
  }

  /**
   * Select a choice by index
   */
  selectChoice(index: number): void {
    const choice = this.currentChoices[index];
    if (!choice) return;

    this.emit('choice:selected', { choice, index });
    this.viewConfig.onChoice?.(choice, index);
    this.hideChoices();
  }

  // =========================================================================
  // PRIVATE
  // =========================================================================

  private handleKeydown(e: KeyboardEvent): void {
    // Space/Enter to advance
    if (e.key === ' ' || e.key === 'Enter') {
      if (this.currentChoices.length === 0) {
        e.preventDefault();
        this.viewConfig.onAdvance?.();
      }
    }

    // Arrow keys for choice navigation
    if (this.currentChoices.length > 0) {
      const choices = this.choicesContainer?.querySelectorAll('button');
      if (!choices) return;

      const focused = document.activeElement;
      const currentIndex = Array.from(choices).indexOf(focused as HTMLButtonElement);

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % choices.length;
        (choices[nextIndex] as HTMLButtonElement).focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + choices.length) % choices.length;
        (choices[prevIndex] as HTMLButtonElement).focus();
      }
    }
  }

  private formatSpeakerName(speaker: CharacterId | 'narrator' | 'system'): string {
    const names: Record<CharacterId | 'narrator' | 'system', string> = {
      ronnie: 'Ronnie',
      tori: 'Tori',
      oldRonnie: 'Old Man',
      echo1: 'Hope',
      echo2: 'Gentle',
      despair: 'Despair',
      narrator: '',
      system: 'SYSTEM',
    };
    return names[speaker] ?? speaker;
  }

  private animateElement(
    element: HTMLElement,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions
  ): Promise<void> {
    return new Promise((resolve) => {
      if (typeof element.animate !== 'function') {
        const finalFrame = keyframes[keyframes.length - 1];
        if (finalFrame) {
          Object.assign(element.style, finalFrame);
        }
        resolve();
        return;
      }

      const animation = element.animate(keyframes, options);
      animation.onfinish = () => resolve();
    });
  }
}
