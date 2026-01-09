/**
 * UV7 V2 GameOverView
 *
 * Displays the game over screen when tether depletes.
 * Offers options to load last save or return to menu.
 */

import { Component } from '../components/Component.ts';
import { Button } from '../components/Button.ts';
import { eventBus } from '../../core/EventBus.ts';

export interface GameOverViewConfig {
  container: HTMLElement;
  onLoadSave?: () => void;
  onReturnToMenu?: () => void;
  onRestart?: () => void;
}

export class GameOverView extends Component {
  private config: GameOverViewConfig;
  private buttonsContainer: HTMLElement | null = null;
  private buttons: Button[] = [];
  private animationFrame: number | null = null;

  constructor(config: GameOverViewConfig) {
    super({ className: 'uv7-game-over' });
    this.config = config;
  }

  protected override createElement(className?: string): HTMLElement {
    const container = document.createElement('div');
    container.className = className ?? '';

    // Create dramatic reveal structure
    container.innerHTML = `
      <div class="uv7-game-over__overlay"></div>
      <div class="uv7-game-over__content">
        <div class="uv7-game-over__static"></div>
        <div class="uv7-game-over__title">
          <span class="uv7-game-over__title-text">CONNECTION LOST</span>
          <span class="uv7-game-over__title-sub">Tether severed. Timeline collapsed.</span>
        </div>
        <div class="uv7-game-over__message">
          The bond between worlds has been broken.<br/>
          Without the tether, this version of reality fades to nothing.
        </div>
        <div class="uv7-game-over__buttons"></div>
        <div class="uv7-game-over__attempt">
          <span class="uv7-game-over__attempt-label">ATTEMPT</span>
          <span class="uv7-game-over__attempt-number">???</span>
        </div>
      </div>
    `;

    this.buttonsContainer = container.querySelector('.uv7-game-over__buttons');
    this.createButtons();
    this.injectStyles();

    return container;
  }

  private createButtons(): void {
    if (!this.buttonsContainer) return;

    // Load Last Save
    const loadButton = new Button({
      text: 'Load Last Save',
      variant: 'primary',
      onClick: () => {
        this.config.onLoadSave?.();
        eventBus.emit('ui:notification', { message: 'Loading save...', type: 'info' });
      },
    });
    loadButton.mount(this.buttonsContainer);
    this.buttons.push(loadButton);

    // Restart
    const restartButton = new Button({
      text: 'Start New Game',
      variant: 'secondary',
      onClick: () => {
        this.config.onRestart?.();
      },
    });
    restartButton.mount(this.buttonsContainer);
    this.buttons.push(restartButton);

    // Return to Menu
    const menuButton = new Button({
      text: 'Return to Menu',
      variant: 'ghost',
      onClick: () => {
        this.config.onReturnToMenu?.();
      },
    });
    menuButton.mount(this.buttonsContainer);
    this.buttons.push(menuButton);
  }

  /**
   * Show the game over screen with animation
   */
  override show(): void {
    this.element?.classList.add('uv7-game-over--visible');

    // Start static animation
    this.startStaticAnimation();

    // Emit event
    eventBus.emit('ui:modal:open', { modalId: 'game-over' });
  }

  /**
   * Hide the game over screen
   */
  override hide(): void {
    this.element?.classList.remove('uv7-game-over--visible');
    this.stopStaticAnimation();
    eventBus.emit('ui:modal:close', { modalId: 'game-over' });
  }

  /**
   * Update the attempt number display
   */
  setAttemptNumber(attempt: number): void {
    const attemptEl = this.element?.querySelector('.uv7-game-over__attempt-number');
    if (attemptEl) {
      attemptEl.textContent = attempt.toString();
    }
  }

  override destroy(): void {
    this.stopStaticAnimation();
    for (const button of this.buttons) {
      button.destroy();
    }
    this.buttons = [];
    super.destroy();
  }

  private startStaticAnimation(): void {
    const staticEl = this.element?.querySelector('.uv7-game-over__static') as HTMLElement;
    if (!staticEl) return;

    const animate = () => {
      // Random static noise effect
      const noise = Math.random() * 0.3;
      staticEl.style.opacity = noise.toString();
      this.animationFrame = requestAnimationFrame(animate);
    };

    animate();
  }

  private stopStaticAnimation(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  private injectStyles(): void {
    if (document.getElementById('uv7-game-over-styles')) return;

    const style = document.createElement('style');
    style.id = 'uv7-game-over-styles';
    style.textContent = `
      .uv7-game-over {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.5s ease, visibility 0.5s ease;
      }

      .uv7-game-over--visible {
        opacity: 1;
        visibility: visible;
      }

      .uv7-game-over__overlay {
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at center, #1a0a0a 0%, #000 100%);
      }

      .uv7-game-over__content {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        padding: 48px;
        max-width: 600px;
        text-align: center;
      }

      .uv7-game-over__static {
        position: absolute;
        inset: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><filter id="noise"><feTurbulence baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)"/></svg>');
        opacity: 0.1;
        pointer-events: none;
        mix-blend-mode: overlay;
      }

      .uv7-game-over__title {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .uv7-game-over__title-text {
        font-family: 'Press Start 2P', monospace, system-ui;
        font-size: 32px;
        color: #ff3333;
        text-shadow:
          0 0 10px rgba(255, 51, 51, 0.8),
          0 0 20px rgba(255, 51, 51, 0.4),
          0 0 40px rgba(255, 51, 51, 0.2);
        letter-spacing: 4px;
        animation: uv7-flicker 3s infinite;
      }

      .uv7-game-over__title-sub {
        font-family: monospace;
        font-size: 14px;
        color: #888;
        letter-spacing: 2px;
        text-transform: uppercase;
      }

      .uv7-game-over__message {
        font-family: system-ui, sans-serif;
        font-size: 16px;
        color: #aaa;
        line-height: 1.8;
        max-width: 400px;
      }

      .uv7-game-over__buttons {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 16px;
        width: 100%;
        max-width: 280px;
      }

      .uv7-game-over__buttons .uv7-button {
        width: 100%;
      }

      .uv7-game-over__attempt {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 24px;
        opacity: 0.6;
      }

      .uv7-game-over__attempt-label {
        font-family: monospace;
        font-size: 10px;
        color: #666;
        letter-spacing: 3px;
      }

      .uv7-game-over__attempt-number {
        font-family: 'Press Start 2P', monospace;
        font-size: 14px;
        color: #ff3333;
      }

      @keyframes uv7-flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.95; }
        52% { opacity: 0.85; }
        54% { opacity: 1; }
        92% { opacity: 0.9; }
        94% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}
