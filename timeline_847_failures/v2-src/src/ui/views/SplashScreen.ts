/**
 * UV7 V2 SplashScreen
 *
 * THE BOUGIE SPLASH EXPERIENCE
 * - Logo wipe reveal synced to boot progress
 * - Shimmer edge that shifts from cool blue to warm gold
 * - Terminal-style boot sequence with 3-line rolling display
 * - Side-by-side layout in landscape
 * - Skip button with arrow animation
 *
 * Ported from V1 with love 💚
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
  private logoReveal: HTMLElement | null = null;
  private logoWrap: HTMLElement | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private startTime = 0;
  private isBooting = false;

  constructor(config: SplashScreenConfig = {}) {
    super({ ...config, deferElementCreation: true });
    this.splashConfig = {
      title: 'UV7',
      minDisplayTime: 2000,
      versionNumber: 848,
      ...config,
    };
    this.createElementDeferred();
  }

  protected createElement(className?: string): HTMLElement {
    const screen = document.createElement('div');
    screen.id = 'uv7-splash';
    screen.className = className ?? '';

    screen.innerHTML = `
      <div class="uv7-container">
        <!-- Logo Section (grouped for landscape layout) -->
        <div class="uv7-logo-section">
          <!-- "Powered by" text above logo -->
          <div class="powered-by-text">POWERED BY</div>

          <!-- UV7 Logo - Static Fallback (visible until video ready) -->
          <img src="/assets/UnitedVoices7.png" class="uv7-logo-static" alt="UV7 Logo">

          <!-- UV7 Logo - Animated Video (wipe reveal during loading) -->
          <div class="uv7-logo-wrap loading" id="uv7-logo-wrap">
            <div class="uv7-logo-reveal" id="uv7-logo-reveal">
              <video class="uv7-logo-video" preload="auto" muted playsinline loop>
                <source src="/assets/UnitedVoices7.mp4" type="video/mp4">
              </video>
            </div>
          </div>
        </div>

        <!-- Boot Terminal (side-by-side in landscape) -->
        <div class="boot-terminal" id="boot-terminal"></div>
      </div>

      <!-- Skip Button -->
      <button class="uv7-skip-btn" id="uv7-skip-button">
        Skip <span class="skip-arrow">→</span>
      </button>
    `;

    // Get references
    this.logoReveal = screen.querySelector('.uv7-logo-reveal');
    this.logoWrap = screen.querySelector('.uv7-logo-wrap');
    this.videoElement = screen.querySelector('.uv7-logo-video');

    // Create boot sequence
    const bootTerminal = screen.querySelector('#boot-terminal');
    if (bootTerminal) {
      const bootConfig: BootSequenceConfig = {
        onProgress: (percent: number) => this.setProgress(percent),
      };
      if (this.splashConfig.versionNumber !== undefined) {
        bootConfig.versionNumber = this.splashConfig.versionNumber;
      }
      this.bootSequence = new BootSequence(bootConfig);
      bootTerminal.appendChild(this.bootSequence.getElement());
    }

    // Inject styles
    this.injectStyles();

    return screen;
  }

  override init(): void {
    // Skip button click
    const skipBtn = this.query('#uv7-skip-button');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => this.skip());
    }

    // Keyboard skip
    document.addEventListener('keydown', this.handleKeyDown);

    // Setup video
    this.setupVideo();
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (this.isBooting && e.key !== 'Escape') {
      this.skip();
    }
  };

  private setupVideo(): void {
    if (!this.videoElement) return;

    const staticLogo = this.query('.uv7-logo-static') as HTMLElement;

    // When video is ready, hide static and show animated
    this.videoElement.addEventListener('canplaythrough', () => {
      if (staticLogo) staticLogo.style.display = 'none';
      if (this.logoWrap) this.logoWrap.style.display = 'block';
    });

    // Start video immediately (muted autoplay)
    this.videoElement.play().catch(() => {
      // Video autoplay blocked - keep static fallback
      if (this.logoWrap) this.logoWrap.style.display = 'none';
      if (staticLogo) staticLogo.style.display = 'block';
    });
  }

  override destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.bootSequence?.destroy();
    super.destroy();
  }

  // =========================================================================
  // BOOT SEQUENCE
  // =========================================================================

  /**
   * Start the boot sequence with logo wipe reveal
   */
  async start(): Promise<void> {
    this.startTime = Date.now();
    this.isBooting = true;
    this.show();
    this.emit('ui:splash:start');

    // Run the boot sequence (progress updates logo reveal)
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
    this.setProgress(100);
    this.isBooting = false;
    void this.complete();
  }

  /**
   * Set loading progress (0-100)
   * Controls the logo wipe reveal width and shimmer color shift
   */
  setProgress(percent: number): void {
    const clamped = Math.max(0, Math.min(100, percent));

    if (this.logoReveal) {
      // Wipe reveal - width matches progress
      this.logoReveal.style.width = `${clamped}%`;

      // Shimmer color shift: cool blue (0%) → warm gold (100%)
      // Start: rgb(180, 200, 220) - cool blue
      // End: rgb(220, 200, 140) - warm gold
      const r = Math.round(180 + (clamped / 100) * 40);
      const g = Math.round(200);
      const b = Math.round(220 - (clamped / 100) * 80);

      this.logoReveal.style.setProperty('--shimmer-r', String(r));
      this.logoReveal.style.setProperty('--shimmer-g', String(g));
      this.logoReveal.style.setProperty('--shimmer-b', String(b));
    }

    // Mark as ready when complete
    if (clamped >= 100 && this.logoWrap) {
      this.logoWrap.classList.remove('loading');
      this.logoWrap.classList.add('ready');
    }

    this.emit('ui:splash:progress', { percent: clamped });
  }

  // =========================================================================
  // PRIVATE
  // =========================================================================

  private async complete(): Promise<void> {
    // Fade out
    await this.fadeOut(1500);

    this.emit('ui:splash:complete');
    this.splashConfig.onComplete?.();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private injectStyles(): void {
    if (document.getElementById('uv7-splash-styles')) return;

    const style = document.createElement('style');
    style.id = 'uv7-splash-styles';
    style.textContent = `
      /* ========================================
         UV7 SPLASH SCREEN - THE BOUGIE EXPERIENCE
         ======================================== */

      #uv7-splash {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        animation: splashFadeIn 1.5s ease-in-out forwards;
      }

      #uv7-splash.fade-out {
        animation: splashFadeOut 1.5s ease-in-out forwards;
      }

      .uv7-container {
        text-align: center;
        transform: scale(0.9);
        animation: splashScaleIn 1.5s ease-out 0.5s forwards;
      }

      /* Logo Section */
      .uv7-logo-section {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .powered-by-text {
        font-size: 1.8rem;
        font-weight: 300;
        letter-spacing: 0.2em;
        color: #a8a08c;
        text-transform: uppercase;
        margin-bottom: 30px;
        font-family: Arial, sans-serif;
        opacity: 0.8;
      }

      .uv7-logo-static {
        width: 400px;
        height: auto;
        max-width: 80vw;
        margin-bottom: 40px;
        filter: drop-shadow(0 0 30px rgba(220, 210, 180, 0.3));
        display: block;
        margin-left: auto;
        margin-right: auto;
      }

      /* UV7 Logo Wrapper */
      .uv7-logo-wrap {
        position: relative;
        width: 400px;
        max-width: 80vw;
        margin: 0 auto 40px;
        overflow: hidden;
        display: none; /* Hidden until video ready */
      }

      /* Wipe reveal container */
      .uv7-logo-reveal {
        width: 0%;
        overflow: hidden;
        position: relative;
        transition: width 0.15s ease-out;
        display: flex;
        align-items: center;

        /* CSS custom properties for dynamic shimmer */
        --shimmer-speed: 1.5s;
        --shimmer-r: 180;
        --shimmer-g: 200;
        --shimmer-b: 220;
      }

      /* Video stays full size - container crops it */
      .uv7-logo-video {
        width: 400px;
        max-width: 80vw;
        height: auto;
        display: block;
        filter: drop-shadow(0 0 30px rgba(220, 210, 180, 0.3));
        position: relative;
        left: 0;
      }

      /* Shimmer edge effect during loading */
      .uv7-logo-reveal::after {
        content: '';
        position: absolute;
        top: 50%;
        right: -2px;
        width: 4px;
        height: 60%;
        transform: translateY(-50%);
        background: linear-gradient(to bottom,
          transparent 0%,
          rgba(var(--shimmer-r), var(--shimmer-g), var(--shimmer-b), 0.6) 30%,
          rgba(calc(var(--shimmer-r) + 35), calc(var(--shimmer-g) + 35), calc(var(--shimmer-b) + 35), 0.9) 50%,
          rgba(var(--shimmer-r), var(--shimmer-g), var(--shimmer-b), 0.6) 70%,
          transparent 100%);
        border-radius: 2px;
        opacity: 0;
        pointer-events: none;
        box-shadow: 0 0 8px rgba(var(--shimmer-r), var(--shimmer-g), var(--shimmer-b), 0.5);
      }

      .uv7-logo-wrap.loading .uv7-logo-reveal::after {
        opacity: 1;
        animation: shimmerPulse var(--shimmer-speed) ease-in-out infinite;
      }

      .uv7-logo-wrap.ready .uv7-logo-reveal::after {
        opacity: 0;
        transition: opacity 0.4s ease-out;
      }

      @keyframes shimmerPulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }

      /* Glow animation when ready */
      .uv7-logo-wrap:not(.ready) .uv7-logo-video {
        animation: none !important;
      }

      .uv7-logo-wrap.ready .uv7-logo-video {
        animation: uv7Glow 2.2s ease-in-out infinite;
      }

      @keyframes uv7Glow {
        0%, 100% {
          filter: drop-shadow(0 0 30px rgba(220, 210, 180, 0.3)) brightness(1);
        }
        50% {
          filter: drop-shadow(0 0 50px rgba(220, 210, 180, 0.6)) brightness(1.15);
        }
      }

      /* Skip Button */
      .uv7-skip-btn {
        position: fixed;
        top: 40px;
        right: 40px;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(220, 210, 180, 0.5);
        color: #dcd2b4;
        padding: 12px 24px;
        font-size: 1rem;
        font-family: Arial, sans-serif;
        letter-spacing: 0.1em;
        cursor: pointer;
        transition: background 0.2s ease, border-color 0.2s ease;
        border-radius: 4px;
        backdrop-filter: blur(10px);
        z-index: 10001;
      }

      .uv7-skip-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(220, 210, 180, 0.8);
      }

      .skip-arrow {
        display: inline-block;
        transition: transform 0.2s ease;
      }

      .uv7-skip-btn:hover .skip-arrow {
        transform: translateX(5px);
      }

      .uv7-skip-btn:active {
        background: rgba(255, 255, 255, 0.3);
      }

      /* Animations */
      @keyframes splashFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes splashFadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }

      @keyframes splashScaleIn {
        from { transform: scale(0.9); }
        to { transform: scale(1); }
      }

      /* ========================================
         LANDSCAPE LAYOUT: Side-by-side logo + boot
         ======================================== */
      @media (orientation: landscape) and (min-width: 700px) and (min-height: 400px) {
        .uv7-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 80px;
          padding: 0 60px;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .uv7-logo-section {
          flex: 0 0 auto;
        }

        .powered-by-text {
          margin-bottom: 20px;
        }

        .uv7-logo-wrap {
          margin-bottom: 0;
        }

        .uv7-logo-static {
          margin-bottom: 0;
        }

        .boot-terminal {
          flex: 1;
          width: auto;
          max-width: 600px;
          min-width: 450px;
          margin: 0;
          align-self: flex-start;
          margin-top: 40px;
        }
      }

      /* Mobile */
      @media (max-width: 768px) {
        .powered-by-text {
          font-size: 1.2rem;
        }

        .uv7-logo-wrap,
        .uv7-logo-static,
        .uv7-logo-video {
          width: 280px;
          max-width: 80vw;
        }

        .uv7-skip-btn {
          top: 20px;
          right: 20px;
          padding: 10px 20px;
          font-size: 0.9rem;
        }
      }

      /* Short landscape */
      @media (max-height: 600px) and (orientation: landscape) {
        .powered-by-text {
          font-size: 1rem;
          margin-bottom: 15px;
        }

        .uv7-logo-wrap,
        .uv7-logo-static,
        .uv7-logo-video {
          width: 200px;
          max-width: 80vw;
          max-height: 200px;
          margin-bottom: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}
