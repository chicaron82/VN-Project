/**
 * UV7 V2 Boot Sequence Component
 *
 * Terminal-style system file loading with all the polish.
 * Displays file loading progress with glitch effects and easter eggs.
 */

import { Component } from './Component.ts';
import type { ComponentConfig } from './Component.ts';
import {
  BOOT_CATEGORIES,
  CATEGORY_SPEEDS,
  CATEGORY_PROGRESS,
  SYSTEM_FILES,
  type SystemFile,
} from '../../content/boot/index.ts';
import { calculateBootStats } from '../../content/boot/index.ts';

export interface BootSequenceConfig extends ComponentConfig {
  onProgress?: (percent: number) => void;
  versionNumber?: number;
  maxVisibleLines?: number;
}

export class BootSequence extends Component {
  private bootConfig: BootSequenceConfig;
  private linesContainer: HTMLElement | null = null;
  private visibleLines: HTMLElement[] = [];
  private isSkipping = false;
  private maxVisibleLines: number;

  constructor(config: BootSequenceConfig = {}) {
    super({ ...config, deferElementCreation: true });
    this.bootConfig = config;
    this.maxVisibleLines = config.maxVisibleLines ?? 3;
    this.createElementDeferred();
  }

  protected createElement(className?: string): HTMLElement {
    const terminal = document.createElement('div');
    terminal.className = `boot-terminal ${className ?? ''}`.trim();
    return terminal;
  }

  // =========================================================================
  // PUBLIC API
  // =========================================================================

  /**
   * Start the boot sequence
   */
  async start(): Promise<void> {
    this.showHeader();

    // Load each category
    for (const category of BOOT_CATEGORIES) {
      if (this.isSkipping) break;

      const speed = CATEGORY_SPEEDS[category.name] ?? 40;
      const progress = CATEGORY_PROGRESS[category.name] ?? { start: 0, end: 100 };

      await this.loadCategory(category.name, category.files, speed, progress.start, progress.end);
    }

    // Easter eggs (final 2%)
    if (!this.isSkipping) {
      await this.showEasterEggs(98, 100);
    }

    // Final stats display
    await this.showBootStats();

    // Let it sit before transitioning
    if (!this.isSkipping) {
      await this.delay(2000);
    }
  }

  /**
   * Skip to end
   */
  skip(): void {
    this.isSkipping = true;
    this.updateProgress(100);
  }

  /**
   * Check if currently skipping
   */
  get skipping(): boolean {
    return this.isSkipping;
  }

  // =========================================================================
  // HEADER
  // =========================================================================

  private showHeader(): void {
    const version = this.bootConfig.versionNumber ?? 848;

    const header = document.createElement('div');
    header.className = 'boot-header';
    header.innerHTML = `
      <div class="boot-title boot-title-glitch">VERSION ${version} INITIALIZATION</div>
      <div class="boot-subtitle">Loading temporal framework...</div>
    `;
    this.element.appendChild(header);

    // Lines container with fixed height
    this.linesContainer = document.createElement('div');
    this.linesContainer.className = 'boot-lines-container';
    this.element.appendChild(this.linesContainer);
  }

  // =========================================================================
  // CATEGORY LOADING
  // =========================================================================

  private async loadCategory(
    categoryName: string,
    files: SystemFile[],
    baseSpeed: number,
    progressStart: number,
    progressEnd: number
  ): Promise<void> {
    if (this.isSkipping) {
      this.showCategoryInstant(categoryName, files);
      this.updateProgress(progressEnd);
      return;
    }

    // Category header
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'boot-category';
    categoryDiv.textContent = `→ ${categoryName}`;
    this.addLine(categoryDiv);

    await this.delay(200);

    // Filter conditional files
    const validFiles = files.filter((file) => this.shouldShowFile(file));
    const progressPerFile = (progressEnd - progressStart) / validFiles.length;

    // Load each file
    for (let i = 0; i < validFiles.length; i++) {
      if (this.isSkipping) break;

      const file = validFiles[i];
      await this.loadFile(file, baseSpeed);

      const newProgress = progressStart + progressPerFile * (i + 1);
      this.updateProgress(newProgress);

      // Dramatic pause for special files
      if (file.pause && !this.isSkipping) {
        await this.delay(300);
      }
    }

    await this.delay(150);
  }

  private async loadFile(file: SystemFile, baseSpeed: number): Promise<void> {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'boot-file';
    fileDiv.style.color = file.color;

    fileDiv.innerHTML = `
      <span class="boot-file-arrow">  ├─</span>
      <span class="boot-file-name">${file.name}</span>
      <span class="boot-file-progress">
        <span class="boot-progress-bar"></span>
      </span>
      <span class="boot-file-size">${file.size}</span>
      <span class="boot-file-status"></span>
    `;

    this.addLine(fileDiv);

    const progressBar = fileDiv.querySelector('.boot-progress-bar') as HTMLElement;
    const statusSpan = fileDiv.querySelector('.boot-file-status') as HTMLElement;

    // Error easter egg handling
    if (file.error && !this.isSkipping) {
      await this.animateProgress(progressBar, 0, 60, baseSpeed * 0.8);
      statusSpan.textContent = 'ERROR';
      statusSpan.style.color = '#ff0066';
      await this.delay(300);

      // Retry message
      const retryDiv = document.createElement('div');
      retryDiv.className = 'boot-file boot-retry';
      retryDiv.textContent = '  │  Retrying connection...';
      retryDiv.style.color = '#ffaa00';
      this.addLine(retryDiv);

      await this.delay(400);
      progressBar.style.width = '0%';
      statusSpan.textContent = '';
    }

    // Flash effect
    if (file.flash && !this.isSkipping) {
      fileDiv.style.animation = 'bootFlash 0.1s 3';
    }

    // Glitch effect
    if (file.glitch && !this.isSkipping) {
      fileDiv.style.animation = 'bootGlitch 0.3s';
      await this.delay(100);
    }

    // Animate progress bar
    await this.animateProgress(progressBar, 0, 100, baseSpeed);

    statusSpan.textContent = 'OK';
    statusSpan.style.color = '#00ff88';

    // Flash files disappear
    if (file.flash && !this.isSkipping) {
      await this.delay(100);
      fileDiv.style.opacity = '0';
      await this.delay(100);
      fileDiv.remove();
    }
  }

  private async animateProgress(
    element: HTMLElement,
    from: number,
    to: number,
    speed: number
  ): Promise<void> {
    if (this.isSkipping) {
      element.style.width = `${to}%`;
      return;
    }

    const steps = 20;
    const increment = (to - from) / steps;
    const stepDelay = speed / steps;

    for (let i = 0; i <= steps; i++) {
      if (this.isSkipping) {
        element.style.width = `${to}%`;
        return;
      }
      element.style.width = `${from + increment * i}%`;
      await this.delay(stepDelay);
    }
  }

  // =========================================================================
  // EASTER EGGS
  // =========================================================================

  private async showEasterEggs(progressStart: number, progressEnd: number): Promise<void> {
    const validEggs = SYSTEM_FILES.easterEggs.filter((file) => this.shouldShowFile(file));

    if (validEggs.length === 0) {
      this.updateProgress(progressEnd);
      return;
    }

    const progressPerEgg = (progressEnd - progressStart) / validEggs.length;

    for (let i = 0; i < validEggs.length; i++) {
      if (this.isSkipping) break;
      await this.loadFile(validEggs[i], 30);
      this.updateProgress(progressStart + progressPerEgg * (i + 1));
    }
  }

  // =========================================================================
  // FINAL STATS
  // =========================================================================

  private async showBootStats(): Promise<void> {
    await this.delay(300);

    // Fade out terminal
    this.element.style.opacity = '0';
    this.element.style.transition = 'opacity 0.3s ease-out';

    await this.delay(300);

    // Clear and show final status
    this.element.innerHTML = '';
    this.element.classList.add('boot-final-status');

    const stats = calculateBootStats();

    const finalDisplay = document.createElement('div');
    finalDisplay.className = 'boot-final-display';
    finalDisplay.innerHTML = `
      <div class="boot-stat">Memory: <span class="stat-value">${stats.memory}</span></div>
      <div class="boot-stat">Timelines: <span class="stat-value">${stats.timelines}</span></div>
      <div class="boot-stat">Paradox: <span class="stat-value" style="color: ${stats.paradoxColor}">${stats.paradox}</span></div>
      <div class="boot-complete-divider"></div>
      <div class="boot-complete-text">VERSION ${stats.version} ONLINE</div>
      <div class="boot-complete-subtitle">Connection established.</div>
    `;
    this.element.appendChild(finalDisplay);

    // Fade back in
    this.element.style.opacity = '1';

    // Let player read the stats
    if (!this.isSkipping) {
      await this.delay(3000);
    }
  }

  // =========================================================================
  // INSTANT MODE (for skip)
  // =========================================================================

  private showCategoryInstant(categoryName: string, files: SystemFile[]): void {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'boot-category';
    categoryDiv.textContent = `→ ${categoryName}`;
    this.element.appendChild(categoryDiv);

    for (const file of files) {
      if (file.conditional || file.flash) continue;

      const fileDiv = document.createElement('div');
      fileDiv.className = 'boot-file';
      fileDiv.style.color = file.color;
      fileDiv.innerHTML = `
        <span class="boot-file-arrow">  ├─</span>
        <span class="boot-file-name">${file.name}</span>
        <span class="boot-file-size">${file.size}</span>
        <span class="boot-file-status" style="color: #00ff88">OK</span>
      `;
      this.element.appendChild(fileDiv);
    }
  }

  // =========================================================================
  // HELPERS
  // =========================================================================

  private shouldShowFile(file: SystemFile): boolean {
    if (!file.conditional) return true;

    // TODO: Check actual game state for conditionals
    // For now, don't show conditional files on first playthrough
    if (file.conditional === 'torigatchi') {
      return localStorage.getItem('torigatchiUnlocked') !== null;
    }
    if (file.conditional === 'insane') {
      return localStorage.getItem('insaneModeLocked') !== null;
    }

    return false;
  }

  private addLine(element: HTMLElement): void {
    if (!this.linesContainer) return;

    this.linesContainer.appendChild(element);
    this.visibleLines.push(element);

    // Remove oldest if over limit
    if (this.visibleLines.length > this.maxVisibleLines) {
      const oldest = this.visibleLines.shift();
      if (oldest) {
        oldest.classList.add('fading-out');
        setTimeout(() => oldest.remove(), 300);
      }
    }
  }

  private updateProgress(percent: number): void {
    this.bootConfig.onProgress?.(percent);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
