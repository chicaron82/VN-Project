/**
 * UV7 V2 SplashScreen
 *
 * Boot/splash screen with terminal-style boot sequence.
 * Displays file loading progress with glitch effects and transitions to main menu.
 */

import { Component } from '../components/Component.ts';
import type { ComponentConfig } from '../components/Component.ts';
import { BootSequence, type BootSequenceConfig } from '../components/BootSequence.ts';

export interface SplashScreenConfig extends ComponentConfig {
  title?: string;
  subtitle?: string;
  minDisplayTime?: number;
  onComplete?: () => void;
  versionNumber?: number;
}

export class SplashScreen extends Component {
  private splashConfig: SplashScreenConfig;
  private bootSequence: BootSequence | null = null;
  private progressBar: HTMLElement | null = null;
  private startTime = 0;
  private isBooting = false;

  constructor(config: SplashScreenConfig = {}) {
    super({ ...config, deferElementCreation: true });
    this.splashConfig = {
      title: 'UV7',
      subtitle: 'NEURAL INTERFACE',
      minDisplayTime: 2000,
      versionNumber: 848,
      ...config,
    };
    this.createElementDeferred();
  }

  protected createElement(className?: string): HTMLElement {
    const config = this.splashConfig;
    const screen = document.createElement('div');
    screen.className = `uv7-splash ${className ?? ''}`.trim();

    screen.innerHTML = `
      <div class="uv7-splash__container">
        <header class="uv7-splash__header">
          <h1 class="uv7-splash__title">${config.title}</h1>
          <p class="uv7-splash__subtitle">${config.subtitle}</p>
        </header>

        <div class="uv7-splash__boot-wrapper"></div>

        <div class="uv7-splash__progress">
          <div class="uv7-splash__progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>
        </div>

        <footer class="uv7-splash__footer">
          <p class="uv7-splash__prompt">Press any key to skip...</p>
        </footer>
      </div>
    `;

    this.progressBar = screen.querySelector('.uv7-splash__progress-bar');

    // Create boot sequence component
    const bootWrapper = screen.querySelector('.uv7-splash__boot-wrapper');
    if (bootWrapper) {
      const bootConfig: BootSequenceConfig = {
        onProgress: (percent: number) => this.setProgress(percent),
      };
      if (config.versionNumber !== undefined) {
        bootConfig.versionNumber = config.versionNumber;
      }
      this.bootSequence = new BootSequence(bootConfig);
      bootWrapper.appendChild(this.bootSequence.getElement());
    }

    return screen;
  }

  override init(): void {
    // Listen for key press to skip
    this.on('click', () => this.skip());
    document.addEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (this.isBooting && e.key !== 'Escape') {
      this.skip();
    }
  };

  override destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.bootSequence?.destroy();
    super.destroy();
  }

  // =========================================================================
  // BOOT SEQUENCE
  // =========================================================================

  /**
   * Start the boot sequence
   */
  async start(): Promise<void> {
    this.startTime = Date.now();
    this.isBooting = true;
    this.show();
    this.emit('ui:splash:start');

    // Run the boot sequence
    if (this.bootSequence) {
      await this.bootSequence.start();
    }

    // Wait for minimum display time
    const elapsed = Date.now() - this.startTime;
    const remaining = (this.splashConfig.minDisplayTime ?? 2000) - elapsed;
    if (remaining > 0 && !this.bootSequence?.skipping) {
      await this.delay(remaining);
    }

    this.isBooting = false;
    await this.complete();
  }

  /**
   * Skip the boot sequence
   */
  skip(): void {
    if (!this.isBooting) return;
    this.bootSequence?.skip();
    this.isBooting = false;
    void this.complete();
  }

  /**
   * Set loading progress (0-100)
   */
  setProgress(percent: number): void {
    const clamped = Math.max(0, Math.min(100, percent));

    if (this.progressBar) {
      this.progressBar.style.width = `${clamped}%`;
      this.progressBar.setAttribute('aria-valuenow', String(clamped));
    }

    this.emit('ui:splash:progress', { percent: clamped });
  }

  // =========================================================================
  // PRIVATE
  // =========================================================================

  private async complete(): Promise<void> {
    // Show prompt
    const prompt = this.query('.uv7-splash__prompt');
    if (prompt) {
      prompt.classList.add('uv7-splash__prompt--visible');
    }

    // Fade out
    await this.fadeOut(500);

    this.emit('ui:splash:complete');
    this.splashConfig.onComplete?.();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
