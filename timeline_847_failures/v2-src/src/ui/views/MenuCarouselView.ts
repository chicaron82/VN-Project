/**
 * UV7 V2 MenuCarouselView
 *
 * Hybrid carousel matching V1's proven pattern:
 * - Portrait: Simple 3-card stack with swipe navigation
 * - Landscape: Horizontal momentum carousel
 *
 * Key insight from V1: Keep it simple. 3 cards visible at a time,
 * CSS handles the visual transforms, JS handles the logic.
 */

import { Component } from '../components/Component.ts';
import type { ComponentConfig } from '../components/Component.ts';
import { CarouselMomentum } from '../components/CarouselMomentum.ts';
import { eventBus } from '../../core/EventBus.ts';

// Import carousel styles
import '../../styles/menu-carousel.css';

export interface MenuCard {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  action: () => void;
  locked?: boolean;
  lockedReason?: string;
  special?: 'torigatchi' | 'continue';
}

export interface MenuCarouselViewConfig extends ComponentConfig {
  cards: MenuCard[];
  onCardSelect?: (card: MenuCard) => void;
}

type OrientationMode = 'landscape' | 'portrait';

export class MenuCarouselView extends Component {
  private config: MenuCarouselViewConfig;
  private viewportElement: HTMLElement | null = null;
  private trackElement: HTMLElement | null = null;
  private dotsElement: HTMLElement | null = null;
  private tipElement: HTMLElement | null = null;

  // Momentum carousel for landscape
  private momentumCarousel: CarouselMomentum | null = null;
  private cardElements: HTMLElement[] = [];

  // State
  private currentIndex = 1; // Start at "START STORY" (index 1, Settings is 0)
  private currentMode: OrientationMode = 'landscape';
  private isAnimating = false;

  // Touch handling (for portrait mode)
  private touchStartX = 0;
  private touchStartY = 0;
  private isDragging = false;

  // Tips rotation
  private tipInterval: ReturnType<typeof setInterval> | null = null;
  private currentTipIndex = 0;

  constructor(config: MenuCarouselViewConfig) {
    super({ ...config, deferElementCreation: true });
    this.config = config;
    this.createElementDeferred();
  }

  protected createElement(className?: string): HTMLElement {
    const view = document.createElement('div');
    view.className = `menu-carousel ${className ?? ''}`.trim();

    view.innerHTML = `
      <div class="menu-background">
        <img src="/assets/desktopVersion.png" alt="">
      </div>
      <div class="menu-header">
        <h1>VERSION 848</h1>
        <div class="subtitle">My Wife Is in a Coma... and in the Code</div>
      </div>
      <div class="carousel-viewport">
        <div class="carousel-track"></div>
      </div>
      <div class="carousel-indicators"></div>
      <div class="carousel-hint">← Swipe → to browse • Tap to select</div>
      <div class="menu-footer">[Version 848 - 847 previous failures]</div>
      <div class="carousel-tip"></div>
    `;

    this.viewportElement = view.querySelector('.carousel-viewport');
    this.trackElement = view.querySelector('.carousel-track');
    this.dotsElement = view.querySelector('.carousel-indicators');
    this.tipElement = view.querySelector('.carousel-tip');

    view.classList.add('hidden');
    return view;
  }

  override init(): void {
    this.updateOrientation();
    window.addEventListener('resize', this.handleResize);
  }

  override destroy(): void {
    super.destroy();
    this.momentumCarousel?.destroy();
    this.stopTipRotation();
    window.removeEventListener('resize', this.handleResize);
  }

  // =========================================================================
  // PUBLIC API
  // =========================================================================

  showMenu(): void {
    this.updateOrientation();
    this.renderCards();
    this.setupEventListeners();
    this.updateDots();
    this.startTipRotation();
    this.show();
    this.fadeIn(300);
  }

  hideMenu(): void {
    this.stopTipRotation();
    this.fadeOut(200);
  }

  // =========================================================================
  // CARD RENDERING - V1 Style: Always show 3 cards
  // =========================================================================

  private renderCards(): void {
    if (!this.trackElement) return;

    // Destroy existing momentum carousel
    this.momentumCarousel?.destroy();
    this.momentumCarousel = null;

    this.trackElement.innerHTML = '';
    this.cardElements = [];

    const cards = this.config.cards;
    const total = cards.length;

    if (this.currentMode === 'portrait') {
      // Portrait: 3-card stack (prev hidden, current visible, next peeking)
      const indices = [
        (this.currentIndex - 1 + total) % total, // prev
        this.currentIndex,                        // current
        (this.currentIndex + 1) % total,         // next
      ];

      indices.forEach((cardIndex, stackPos) => {
        const card = cards[cardIndex];
        const el = this.createCardElement(card, cardIndex);
        el.dataset.stack = String(stackPos);
        this.trackElement!.appendChild(el);
        this.cardElements.push(el);
      });
    } else {
      // Landscape: Create 3x clones for infinite scroll with momentum physics
      for (let clone = 0; clone < 3; clone++) {
        cards.forEach((card, index) => {
          const el = this.createCardElement(card, clone * total + index);
          this.trackElement!.appendChild(el);
          this.cardElements.push(el);
        });
      }

      // Initialize momentum carousel for "Price Is Right" physics
      this.initMomentumCarousel();
    }
  }

  private initMomentumCarousel(): void {
    if (!this.trackElement || !this.viewportElement || this.cardElements.length === 0) return;

    const firstCard = this.cardElements[0];
    const cardWidth = firstCard?.offsetWidth || 380;
    const cardGap = 20;

    this.momentumCarousel = new CarouselMomentum({
      container: this.trackElement,
      viewport: this.viewportElement,
      cards: this.cardElements,
      totalCards: this.config.cards.length,
      cardWidth,
      cardGap,
      friction: 0.975, // "Price Is Right" spin feel
      snapThreshold: 0.2,
      maxVelocity: 300,
      onCardChange: (index) => {
        this.currentIndex = index;
        this.updateDots();
        eventBus.emit('ui:menu:focus', {
          menuId: 'main',
          itemId: this.config.cards[index].id,
          index,
        });
      },
      onHaptic: () => {
        if (navigator.vibrate) navigator.vibrate(30);
      },
    });

    // Start centered on current card (in middle clone set)
    this.momentumCarousel.moveToCard(this.config.cards.length + this.currentIndex, true);
  }

  private createCardElement(card: MenuCard, index: number): HTMLElement {
    const el = document.createElement('div');
    el.className = 'carousel-card';
    el.dataset.cardId = card.id;
    el.dataset.index = String(index);

    if (card.locked) el.classList.add('locked');
    if (card.special === 'torigatchi') el.classList.add('torigatchi-special');

    el.innerHTML = `
      <div class="card-icon">${card.locked ? '🔒' : card.icon}</div>
      <h2 class="card-title">${card.title}</h2>
      ${card.subtitle ? `<p class="card-subtitle">${card.subtitle}</p>` : ''}
      <button class="card-button" ${card.locked ? 'disabled' : ''}>
        ${card.locked ? (card.lockedReason ?? 'LOCKED') : card.buttonText}
      </button>
    `;

    // Button click
    const button = el.querySelector('.card-button');
    button?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!card.locked) this.selectCard(card, el);
    });

    // Card click - only if it's the current/center card
    el.addEventListener('click', () => {
      if (this.isCurrentCard(el) && !card.locked) {
        this.selectCard(card, el);
      }
    });

    return el;
  }

  private isCurrentCard(el: HTMLElement): boolean {
    if (this.currentMode === 'portrait') {
      return el.dataset.stack === '1'; // Stack position 1 is current
    }
    return parseInt(el.dataset.index || '0') === this.currentIndex;
  }

  private selectCard(card: MenuCard, el: HTMLElement): void {
    el.classList.add('confirmed');
    setTimeout(() => el.classList.remove('confirmed'), 200);

    if (navigator.vibrate) navigator.vibrate(50);

    this.config.onCardSelect?.(card);
    card.action();

    eventBus.emit('ui:menu:select', { menuId: 'main', itemId: card.id });
  }

  // =========================================================================
  // EVENT HANDLING
  // =========================================================================

  private setupEventListeners(): void {
    if (!this.trackElement) return;

    // Portrait mode: Add our own touch handlers (momentum carousel handles landscape)
    if (this.currentMode === 'portrait') {
      this.trackElement.addEventListener('touchstart', this.handleTouchStart, { passive: true });
      this.trackElement.addEventListener('touchmove', this.handleTouchMove, { passive: false });
      this.trackElement.addEventListener('touchend', this.handleTouchEnd, { passive: true });
      this.trackElement.addEventListener('mousedown', this.handleMouseDown);
    }

    // Keyboard works in both modes
    document.addEventListener('keydown', this.handleKeyboard);
  }

  private handleTouchStart = (e: TouchEvent): void => {
    if (this.isAnimating) return;
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.isDragging = true;
  };

  private handleTouchMove = (e: TouchEvent): void => {
    if (!this.isDragging) return;

    const deltaX = e.touches[0].clientX - this.touchStartX;
    const deltaY = e.touches[0].clientY - this.touchStartY;

    // If horizontal swipe is stronger, prevent scroll
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
    }
  };

  private handleTouchEnd = (e: TouchEvent): void => {
    if (!this.isDragging) return;
    this.isDragging = false;

    const deltaX = e.changedTouches[0].clientX - this.touchStartX;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        this.goToPrev();
      } else {
        this.goToNext();
      }
    }
  };

  private handleMouseDown = (e: MouseEvent): void => {
    if (this.isAnimating) return;
    this.touchStartX = e.clientX;
    this.isDragging = true;

    const handleMouseMove = (_e: MouseEvent) => {
      // Visual feedback during drag could go here
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!this.isDragging) return;
      this.isDragging = false;

      const deltaX = e.clientX - this.touchStartX;
      const threshold = 50;

      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          this.goToPrev();
        } else {
          this.goToNext();
        }
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  private handleKeyboard = (e: KeyboardEvent): void => {
    if (this.element?.classList.contains('hidden')) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (this.currentMode === 'landscape' && this.momentumCarousel) {
          // Momentum carousel handles its own keyboard
        } else {
          this.goToPrev();
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (this.currentMode === 'landscape' && this.momentumCarousel) {
          // Momentum carousel handles its own keyboard
        } else {
          this.goToNext();
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.selectCurrentCard();
        break;
    }
  };

  // =========================================================================
  // NAVIGATION
  // =========================================================================

  private goToNext(): void {
    if (this.isAnimating) return;
    const total = this.config.cards.length;
    this.currentIndex = (this.currentIndex + 1) % total;
    this.animateTransition();
  }

  private goToPrev(): void {
    if (this.isAnimating) return;
    const total = this.config.cards.length;
    this.currentIndex = (this.currentIndex - 1 + total) % total;
    this.animateTransition();
  }

  private animateTransition(): void {
    this.isAnimating = true;

    if (navigator.vibrate) navigator.vibrate(20);

    // Re-render cards with new index
    this.renderCards();
    this.updateDots();

    // Brief animation lock
    setTimeout(() => {
      this.isAnimating = false;
    }, 300);

    eventBus.emit('ui:menu:focus', {
      menuId: 'main',
      itemId: this.config.cards[this.currentIndex].id,
      index: this.currentIndex,
    });
  }

  private selectCurrentCard(): void {
    const card = this.config.cards[this.currentIndex];
    if (card && !card.locked) {
      const cardEl = this.trackElement?.querySelector(`[data-index="${this.currentIndex}"]`);
      if (cardEl) {
        this.selectCard(card, cardEl as HTMLElement);
      }
    }
  }

  // =========================================================================
  // DOTS / INDICATORS
  // =========================================================================

  private updateDots(): void {
    if (!this.dotsElement) return;

    this.dotsElement.innerHTML = '';
    this.config.cards.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = `indicator-dot ${i === this.currentIndex ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        this.currentIndex = i;
        this.animateTransition();
      });
      this.dotsElement!.appendChild(dot);
    });
  }

  // =========================================================================
  // ORIENTATION
  // =========================================================================

  private handleResize = (): void => {
    const wasMode = this.currentMode;
    this.updateOrientation();

    if (wasMode !== this.currentMode && !this.element?.classList.contains('hidden')) {
      this.renderCards();
    }
  };

  private updateOrientation(): void {
    const isPortrait = window.innerHeight > window.innerWidth;
    this.currentMode = isPortrait ? 'portrait' : 'landscape';

    if (this.element) {
      this.element.classList.remove('landscape-mode', 'portrait-mode', 'tinder-mode');
      if (this.currentMode === 'portrait') {
        this.element.classList.add('portrait-mode', 'tinder-mode');
      } else {
        this.element.classList.add('landscape-mode');
      }
    }
  }

  // =========================================================================
  // ROTATING TIPS
  // =========================================================================

  private getTips(): string[] {
    return [
      "💡 Hidden codes unlock secret content - read the notes carefully...",
      "💡 Some puzzles require playing both routes to solve",
      "💡 The version number changes based on your choices",
      "💡 Complete any ending to unlock Skip mode",
      "💡 Your saves carry over between sessions",
      "🖤 \"Always. Always. Always.\" - Tori",
      "💡 Secret codes are hidden throughout the game...",
      "💡 The UV7 crew left messages for you in the notes",
      "💡 Each ending reveals different aspects of the story",
      "💡 Press [ESC] to pause at any time",
    ];
  }

  private startTipRotation(): void {
    this.stopTipRotation();
    if (!this.tipElement) return;

    const tips = this.getTips();
    this.currentTipIndex = Math.floor(Math.random() * tips.length);
    this.tipElement.textContent = tips[this.currentTipIndex];

    this.tipInterval = setInterval(() => {
      if (!this.tipElement) return;

      this.tipElement.classList.add('tip-fade-out');

      setTimeout(() => {
        this.currentTipIndex = (this.currentTipIndex + 1) % tips.length;
        if (this.tipElement) {
          this.tipElement.textContent = tips[this.currentTipIndex];
          this.tipElement.classList.remove('tip-fade-out');
        }
      }, 800);
    }, 8000);
  }

  private stopTipRotation(): void {
    if (this.tipInterval) {
      clearInterval(this.tipInterval);
      this.tipInterval = null;
    }
  }
}
