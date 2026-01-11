/**
 * UV7 V2 CodeRain Component
 *
 * Matrix-style code rain for transitions.
 * Uses canvas for smooth performance.
 *
 * Features:
 * - UV7 crew names in the rain
 * - Theme-aware coloring
 * - Portrait/landscape speed adjustment
 * - Smooth fade in/out
 */

import { Component } from './Component.ts';
import type { ComponentConfig } from './Component.ts';

export interface CodeRainConfig extends ComponentConfig {
  /** Duration of the transition in ms (default: 1500) */
  duration?: number;
  /** Characters to use in the rain */
  chars?: string;
  /** Font size in pixels (default: 14) */
  fontSize?: number;
  /** Primary color (default: theme cyan) */
  color?: string;
}

export class CodeRain extends Component {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationInterval: number | null = null;
  private drops: number[] = [];
  private rainConfig: CodeRainConfig;

  // UV7 crew names for the matrix rain
  private static readonly DEFAULT_CHARS = 'ZEEZEERAHDIZEECOZEEBELLEPEASYGENZEETORICHICHARONUV7848';

  constructor(config: CodeRainConfig = {}) {
    super({ ...config, deferElementCreation: true });
    this.rainConfig = {
      duration: 1500,
      chars: CodeRain.DEFAULT_CHARS,
      fontSize: 14,
      color: '#00ffff',
      ...config,
    };
    this.createElementDeferred();
  }

  protected createElement(className?: string): HTMLElement {
    const container = document.createElement('div');
    container.className = `uv7-code-rain ${className ?? ''}`.trim();
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 100000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 300ms ease;
    `;

    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `
      width: 100%;
      height: 100%;
      display: block;
    `;
    container.appendChild(this.canvas);

    return container;
  }

  override init(): void {
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
    }
  }

  override destroy(): void {
    this.stopRain();
    window.removeEventListener('resize', this.handleResize);
    super.destroy();
  }

  // =========================================================================
  // PUBLIC API
  // =========================================================================

  /**
   * Show the code rain transition
   * @param callback Called when transition covers the screen
   * @param duration Total duration in ms
   */
  async transition(callback?: () => void, duration?: number): Promise<void> {
    const totalDuration = duration ?? this.rainConfig.duration ?? 1500;

    // Start rain
    this.startRain();

    // Fade in immediately
    this.element.style.opacity = '1';

    // Execute callback after a small delay (rain is covering the screen)
    if (callback) {
      await this.delay(100);
      callback();
    }

    // Wait then fade out
    await this.delay(totalDuration - 300);
    this.element.style.opacity = '0';

    // Stop rain after fade
    await this.delay(300);
    this.stopRain();
  }

  /**
   * Start continuous rain (for loop init screen, etc.)
   */
  startRain(): void {
    if (this.animationInterval) return;

    this.handleResize();
    this.show();

    const chars = this.rainConfig.chars ?? CodeRain.DEFAULT_CHARS;
    const fontSize = this.rainConfig.fontSize ?? 14;
    const color = this.rainConfig.color ?? '#00ffff';

    // Faster on portrait to fill screen
    const isPortrait = window.innerHeight > window.innerWidth;
    const dropSpeed = isPortrait ? 3 : 2;

    const draw = (): void => {
      if (!this.ctx || !this.canvas) return;

      // Fade effect
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Rain color
      this.ctx.fillStyle = color;
      this.ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < this.drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        this.ctx.fillText(char, i * fontSize, this.drops[i] * fontSize);

        // Reset drop when it reaches bottom
        if (this.drops[i] * fontSize > this.canvas.height && Math.random() > 0.975) {
          this.drops[i] = 0;
        }
        this.drops[i] += dropSpeed;
      }
    };

    this.animationInterval = window.setInterval(draw, 33);
  }

  /**
   * Stop the rain animation
   */
  stopRain(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  /**
   * Set the rain color (for theme changes)
   */
  setColor(color: string): void {
    this.rainConfig.color = color;
  }

  // =========================================================================
  // PRIVATE
  // =========================================================================

  private handleResize = (): void => {
    if (!this.canvas || !this.ctx) return;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Recalculate drops
    const fontSize = this.rainConfig.fontSize ?? 14;
    const columns = Math.floor(this.canvas.width / fontSize);
    this.drops = Array(columns).fill(1);

    // Fill with black initially
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
