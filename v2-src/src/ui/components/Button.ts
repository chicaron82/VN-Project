/**
 * UV7 V2 Button Component
 *
 * Reusable button component with variants, states, and accessibility.
 */

import { Component } from './Component.ts';
import type { ComponentConfig } from './Component.ts';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonConfig extends ComponentConfig {
  text: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  icon?: string;
  ariaLabel?: string;
  onClick?: () => void;
}

export class Button extends Component {
  private buttonConfig: ButtonConfig;
  private clickHandler: (() => void) | null = null;

  constructor(config: ButtonConfig) {
    super({ ...config, deferElementCreation: true });
    this.buttonConfig = config;
    this.clickHandler = config.onClick ?? null;
    this.createElementDeferred();
  }

  protected createElement(className?: string): HTMLElement {
    const config = this.buttonConfig;
    const button = document.createElement('button');
    button.type = 'button';

    // Build class list
    const classes = ['uv7-button'];
    if (className) classes.push(className);
    classes.push(`uv7-button--${config.variant ?? 'primary'}`);
    classes.push(`uv7-button--${config.size ?? 'medium'}`);
    button.className = classes.join(' ');

    // Set content
    this.updateContent(button);

    // Set attributes
    if (config.disabled) {
      button.disabled = true;
    }
    if (config.ariaLabel) {
      button.setAttribute('aria-label', config.ariaLabel);
    }

    return button;
  }

  override init(): void {
    // Set up click handler - always listen so setOnClick works after creation
    this.on('click', () => {
      if (!this.isDisabled()) {
        this.clickHandler?.();
      }
    });

    // Keyboard support
    this.on('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!this.isDisabled()) {
          this.clickHandler?.();
        }
      }
    });
  }

  // =========================================================================
  // PUBLIC METHODS
  // =========================================================================

  /**
   * Update button text
   */
  setText(text: string): void {
    this.buttonConfig.text = text;
    this.updateContent(this.element as HTMLButtonElement);
  }

  /**
   * Update button variant
   */
  setVariant(variant: ButtonVariant): void {
    const button = this.element;
    button.classList.remove(`uv7-button--${this.buttonConfig.variant ?? 'primary'}`);
    this.buttonConfig.variant = variant;
    button.classList.add(`uv7-button--${variant}`);
  }

  /**
   * Enable the button
   */
  enable(): void {
    this.buttonConfig.disabled = false;
    (this.element as HTMLButtonElement).disabled = false;
    this.removeClass('uv7-button--disabled');
  }

  /**
   * Disable the button
   */
  disable(): void {
    this.buttonConfig.disabled = true;
    (this.element as HTMLButtonElement).disabled = true;
    this.addClass('uv7-button--disabled');
  }

  /**
   * Check if button is disabled
   */
  isDisabled(): boolean {
    return this.buttonConfig.disabled ?? false;
  }

  /**
   * Set click handler
   */
  setOnClick(handler: () => void): void {
    this.clickHandler = handler;
  }

  /**
   * Trigger a visual press effect
   */
  async press(): Promise<void> {
    this.addClass('uv7-button--pressed');
    await this.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(0.95)' },
        { transform: 'scale(1)' },
      ],
      { duration: 150, easing: 'ease-out' }
    );
    this.removeClass('uv7-button--pressed');
  }

  /**
   * Show loading state
   */
  setLoading(loading: boolean): void {
    if (loading) {
      this.addClass('uv7-button--loading');
      (this.element as HTMLButtonElement).disabled = true;
    } else {
      this.removeClass('uv7-button--loading');
      if (!this.buttonConfig.disabled) {
        (this.element as HTMLButtonElement).disabled = false;
      }
    }
  }

  // =========================================================================
  // PRIVATE
  // =========================================================================

  private updateContent(button: HTMLButtonElement): void {
    let html = '';

    if (this.buttonConfig.icon) {
      html += `<span class="uv7-button__icon">${this.buttonConfig.icon}</span>`;
    }

    html += `<span class="uv7-button__text">${this.buttonConfig.text}</span>`;

    button.innerHTML = html;
  }
}
