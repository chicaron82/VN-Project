/**
 * UV7 V2 CreditsView
 *
 * Rolling credits sequence displayed at game end or from menu.
 */

import { Component } from '../components/Component.ts';
import { Button } from '../components/Button.ts';
import { eventBus } from '../../core/EventBus.ts';

export interface CreditsEntry {
  role: string;
  name: string;
}

export interface CreditsSection {
  title: string;
  entries: CreditsEntry[];
}

export interface CreditsViewConfig {
  container: HTMLElement;
  sections?: CreditsSection[];
  onComplete?: () => void;
  scrollDuration?: number; // ms for full scroll
}

const DEFAULT_CREDITS: CreditsSection[] = [
  {
    title: 'Created By',
    entries: [{ role: 'Creator & Director', name: 'Chicharon' }],
  },
  {
    title: 'Story',
    entries: [
      { role: 'Writer', name: 'Chicharon' },
      { role: 'Narrative Design', name: 'Chicharon' },
    ],
  },
  {
    title: 'Development',
    entries: [
      { role: 'Engine', name: 'UV7 V2' },
      { role: 'Programming', name: 'Claude Code' },
    ],
  },
  {
    title: 'Art',
    entries: [
      { role: 'Character Art', name: 'TBD' },
      { role: 'Background Art', name: 'TBD' },
      { role: 'UI Design', name: 'TBD' },
    ],
  },
  {
    title: 'Audio',
    entries: [
      { role: 'Music', name: 'TBD' },
      { role: 'Sound Effects', name: 'TBD' },
    ],
  },
  {
    title: 'Special Thanks',
    entries: [
      { role: '', name: 'The UV7 Community' },
      { role: '', name: 'All Loop 847 Survivors' },
      { role: '', name: 'You, for playing' },
    ],
  },
];

export class CreditsView extends Component {
  private config: CreditsViewConfig;
  private creditsContainer: HTMLElement | null = null;
  private skipButton: Button | null = null;
  private scrollAnimation: number | null = null;
  private scrollPosition: number = 0;
  private isScrolling: boolean = false;

  constructor(config: CreditsViewConfig) {
    super({ className: 'uv7-credits' });
    this.config = {
      sections: DEFAULT_CREDITS,
      scrollDuration: 60000, // 60 seconds
      ...config,
    };
  }

  protected override createElement(className?: string): HTMLElement {
    const container = document.createElement('div');
    container.className = className ?? '';

    container.innerHTML = `
      <div class="uv7-credits__overlay"></div>
      <div class="uv7-credits__scroll-container">
        <div class="uv7-credits__content"></div>
      </div>
      <div class="uv7-credits__skip"></div>
    `;

    this.creditsContainer = container.querySelector('.uv7-credits__content');
    this.buildCredits();

    // Skip button
    const skipContainer = container.querySelector('.uv7-credits__skip');
    if (skipContainer) {
      this.skipButton = new Button({
        text: 'Skip',
        variant: 'ghost',
        size: 'small',
        onClick: () => this.complete(),
      });
      this.skipButton.mount(skipContainer as HTMLElement);
    }

    this.injectStyles();

    return container;
  }

  private buildCredits(): void {
    if (!this.creditsContainer || !this.config.sections) return;

    let html = '<div class="uv7-credits__spacer"></div>';

    for (const section of this.config.sections) {
      html += `
        <div class="uv7-credits__section">
          <h2 class="uv7-credits__section-title">${section.title}</h2>
          <div class="uv7-credits__entries">
            ${section.entries
              .map(
                (entry) => `
              <div class="uv7-credits__entry">
                ${entry.role ? `<span class="uv7-credits__role">${entry.role}</span>` : ''}
                <span class="uv7-credits__name">${entry.name}</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `;
    }

    // End message
    html += `
      <div class="uv7-credits__end">
        <div class="uv7-credits__end-title">UV7</div>
        <div class="uv7-credits__end-sub">VERSION 848</div>
        <div class="uv7-credits__end-message">Thank you for playing.</div>
      </div>
      <div class="uv7-credits__spacer"></div>
    `;

    this.creditsContainer.innerHTML = html;
  }

  /**
   * Start credits roll
   */
  start(): void {
    this.element?.classList.add('uv7-credits--visible');
    this.scrollPosition = 0;
    this.isScrolling = true;
    this.startScrollAnimation();
    eventBus.emit('ui:modal:open', { modalId: 'credits' });
  }

  /**
   * Stop and hide credits
   */
  stop(): void {
    this.isScrolling = false;
    this.stopScrollAnimation();
    this.element?.classList.remove('uv7-credits--visible');
    eventBus.emit('ui:modal:close', { modalId: 'credits' });
  }

  private complete(): void {
    this.stop();
    this.config.onComplete?.();
  }

  private startScrollAnimation(): void {
    if (!this.creditsContainer) return;

    const containerHeight = this.creditsContainer.scrollHeight;
    const viewportHeight = this.element?.clientHeight ?? 0;
    const totalScroll = containerHeight + viewportHeight;
    const scrollDuration = this.config.scrollDuration ?? 60000;
    const scrollSpeed = totalScroll / scrollDuration;

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      if (!this.isScrolling) return;

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      this.scrollPosition += scrollSpeed * deltaTime;

      if (this.creditsContainer) {
        this.creditsContainer.style.transform = `translateY(-${this.scrollPosition}px)`;
      }

      // Check if scroll complete
      if (this.scrollPosition >= totalScroll) {
        this.complete();
        return;
      }

      this.scrollAnimation = requestAnimationFrame(animate);
    };

    this.scrollAnimation = requestAnimationFrame(animate);
  }

  private stopScrollAnimation(): void {
    if (this.scrollAnimation) {
      cancelAnimationFrame(this.scrollAnimation);
      this.scrollAnimation = null;
    }
  }

  override destroy(): void {
    this.stopScrollAnimation();
    this.skipButton?.destroy();
    super.destroy();
  }

  private injectStyles(): void {
    if (document.getElementById('uv7-credits-styles')) return;

    const style = document.createElement('style');
    style.id = 'uv7-credits-styles';
    style.textContent = `
      .uv7-credits {
        position: fixed;
        inset: 0;
        display: flex;
        flex-direction: column;
        z-index: 9998;
        opacity: 0;
        visibility: hidden;
        transition: opacity 1s ease, visibility 1s ease;
      }

      .uv7-credits--visible {
        opacity: 1;
        visibility: visible;
      }

      .uv7-credits__overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, #000 0%, #0a0a0a 100%);
      }

      .uv7-credits__scroll-container {
        position: relative;
        flex: 1;
        overflow: hidden;
      }

      .uv7-credits__content {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 48px;
        padding: 48px;
      }

      .uv7-credits__spacer {
        height: 50vh;
      }

      .uv7-credits__section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        max-width: 600px;
      }

      .uv7-credits__section-title {
        font-family: 'Press Start 2P', monospace, system-ui;
        font-size: 16px;
        color: #4ecdc4;
        text-transform: uppercase;
        letter-spacing: 4px;
        margin: 0;
      }

      .uv7-credits__entries {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }

      .uv7-credits__entry {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }

      .uv7-credits__role {
        font-family: monospace;
        font-size: 12px;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 2px;
      }

      .uv7-credits__name {
        font-family: system-ui, sans-serif;
        font-size: 18px;
        color: #eee;
      }

      .uv7-credits__end {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        margin-top: 64px;
      }

      .uv7-credits__end-title {
        font-family: 'Press Start 2P', monospace;
        font-size: 48px;
        color: #fff;
        text-shadow:
          0 0 20px rgba(255, 255, 255, 0.5),
          0 0 40px rgba(78, 205, 196, 0.3);
      }

      .uv7-credits__end-sub {
        font-family: monospace;
        font-size: 14px;
        color: #4ecdc4;
        letter-spacing: 4px;
      }

      .uv7-credits__end-message {
        font-family: system-ui, sans-serif;
        font-size: 16px;
        color: #888;
        margin-top: 32px;
      }

      .uv7-credits__skip {
        position: absolute;
        bottom: 24px;
        right: 24px;
        z-index: 1;
      }
    `;
    document.head.appendChild(style);
  }
}
