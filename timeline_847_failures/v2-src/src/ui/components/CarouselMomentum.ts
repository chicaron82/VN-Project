/**
 * UV7 V2 CarouselMomentum
 *
 * Physics-based carousel with momentum scrolling.
 * "Price Is Right" spin + iPhone feel.
 *
 * Features:
 * - Touch/mouse momentum physics
 * - Infinite scroll with clone buffer
 * - Velocity-based multi-card skip
 * - Cubic ease-out snap
 * - Haptic feedback on snap
 * - Keyboard navigation
 */

export interface CarouselCard {
  element: HTMLElement;
  id: string;
  data?: unknown;
}

export interface CarouselMomentumConfig {
  /** Container element for the carousel */
  container: HTMLElement;
  /** Viewport element for centering (defaults to container) */
  viewport?: HTMLElement;
  /** Array of card elements */
  cards: HTMLElement[];
  /** Number of real cards (before cloning) */
  totalCards: number;
  /** Friction coefficient (default: 0.975 - Price Is Right spin) */
  friction?: number;
  /** Threshold for snap vs momentum (default: 0.2) */
  snapThreshold?: number;
  /** Minimum velocity to continue animation (default: 0.05) */
  minVelocity?: number;
  /** Maximum velocity cap (default: 300) */
  maxVelocity?: number;
  /** Card width in pixels (default: 400) */
  cardWidth?: number;
  /** Gap between cards (default: 20) */
  cardGap?: number;
  /** Enable keyboard navigation (default: true) */
  enableKeyboard?: boolean;
  /** Callback when card changes */
  onCardChange?: (index: number) => void;
  /** Callback for haptic feedback */
  onHaptic?: () => void;
}

export class CarouselMomentum {
  private container: HTMLElement;
  private viewport: HTMLElement;
  private cards: HTMLElement[];
  private totalCards: number;
  private onCardChange: ((index: number) => void) | undefined;
  private onHaptic: (() => void) | undefined;

  // Physics parameters - ZEE'S TUNE-UP
  private friction: number;
  private snapThreshold: number;
  private minVelocity: number;
  private maxVelocity: number;
  private cardWidth: number;
  private cardGap: number;
  private enableKeyboard: boolean;

  // Calculated values
  private totalCardsWidth: number;

  // State
  private currentIndex = 0;
  private position = 0;
  private velocity = 0;
  private isDragging = false;
  private isPotentialDrag = false;
  private isSnapping = false;
  private startX = 0;
  private startY = 0;
  private lastX = 0;
  private lastTime = 0;
  private animationFrame: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private resizeTimeout: number | null = null;

  constructor(config: CarouselMomentumConfig) {
    this.container = config.container;
    this.viewport = config.viewport ?? config.container;
    this.cards = config.cards;
    this.totalCards = config.totalCards;
    this.onCardChange = config.onCardChange;
    this.onHaptic = config.onHaptic;

    // Physics - tuned for "Price Is Right" spin + iPhone feel
    this.friction = config.friction ?? 0.975;
    this.snapThreshold = config.snapThreshold ?? 0.2;
    this.minVelocity = config.minVelocity ?? 0.05;
    this.maxVelocity = config.maxVelocity ?? 300;
    this.cardWidth = config.cardWidth ?? 400;
    this.cardGap = config.cardGap ?? 20;
    this.enableKeyboard = config.enableKeyboard !== false;

    // Calculate total width for infinite scroll
    this.totalCardsWidth = this.totalCards * (this.cardWidth + this.cardGap);

    this.init();
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  private init(): void {
    if (!this.container || this.cards.length === 0) {
      console.error('CarouselMomentum: Invalid container or cards');
      return;
    }

    // Touch events
    this.container.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.container.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.container.addEventListener('touchend', this.handleTouchEnd, { passive: false });

    // Mouse events
    this.container.addEventListener('mousedown', this.handleMouseStart);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseEnd);

    // Keyboard
    if (this.enableKeyboard) {
      document.addEventListener('keydown', this.handleKeyboard);
    }

    // Resize handling
    window.addEventListener('resize', this.handleResize);

    // ResizeObserver for robust layout tracking
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        if (!this.resizeTimeout) {
          this.resizeTimeout = window.setTimeout(() => {
            this.handleResize();
            this.resizeTimeout = null;
          }, 50);
        }
      });
      this.resizeObserver.observe(this.container);
      if (this.viewport !== this.container) {
        this.resizeObserver.observe(this.viewport);
      }
    }
  }

  // =========================================================================
  // TOUCH HANDLERS
  // =========================================================================

  private handleTouchStart = (e: TouchEvent): void => {
    this.isDragging = false;
    this.isPotentialDrag = true;
    this.velocity = 0;
    this.isSnapping = false;

    const touch = e.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.lastX = touch.clientX;
    this.lastTime = Date.now();

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  };

  private handleTouchMove = (e: TouchEvent): void => {
    if (this.isPotentialDrag && !this.isDragging) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - this.startX);
      const deltaY = Math.abs(touch.clientY - this.startY);

      if (deltaX > 10 || deltaY > 10) {
        if (deltaX > deltaY) {
          this.isDragging = true;
          this.isPotentialDrag = false;
          e.preventDefault();
        } else {
          this.isPotentialDrag = false;
          return;
        }
      } else {
        return;
      }
    }

    if (!this.isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const currentX = touch.clientX;
    const currentTime = Date.now();
    const deltaX = currentX - this.lastX;
    const deltaTime = currentTime - this.lastTime;

    this.position += deltaX;

    if (deltaTime > 0) {
      this.velocity = (deltaX / deltaTime) * 16.67; // ~60fps
    }

    this.lastX = currentX;
    this.lastTime = currentTime;

    this.updatePosition();
    this.updateCardOpacity();
  };

  private handleTouchEnd = (e: TouchEvent): void => {
    const wasDragging = this.isDragging;
    this.isDragging = false;
    this.isPotentialDrag = false;

    if (!wasDragging) return;
    e.preventDefault();

    this.velocity = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, this.velocity));

    if (Math.abs(this.velocity) > this.snapThreshold) {
      this.applyMomentum();
    } else {
      this.snapToCard();
    }
  };

  // =========================================================================
  // MOUSE HANDLERS
  // =========================================================================

  private handleMouseStart = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (target.closest('.carousel-card') || target.tagName === 'BUTTON') {
      return;
    }

    this.isDragging = false;
    this.isPotentialDrag = true;
    this.velocity = 0;
    this.isSnapping = false;

    this.startX = e.clientX;
    this.lastX = e.clientX;
    this.lastTime = Date.now();

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  };

  private handleMouseMove = (e: MouseEvent): void => {
    if (this.isPotentialDrag && !this.isDragging) {
      const deltaX = Math.abs(e.clientX - this.startX);
      if (deltaX > 5) {
        this.isDragging = true;
        this.isPotentialDrag = false;
      } else {
        return;
      }
    }

    if (!this.isDragging) return;

    const currentX = e.clientX;
    const currentTime = Date.now();
    const deltaX = currentX - this.lastX;
    const deltaTime = currentTime - this.lastTime;

    this.position += deltaX;

    if (deltaTime > 0) {
      this.velocity = (deltaX / deltaTime) * 16.67;
    }

    this.lastX = currentX;
    this.lastTime = currentTime;

    this.updatePosition();
    this.updateCardOpacity();
    e.preventDefault();
  };

  private handleMouseEnd = (): void => {
    const wasDragging = this.isDragging;
    this.isDragging = false;
    this.isPotentialDrag = false;

    if (!wasDragging) return;

    this.velocity = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, this.velocity));

    if (Math.abs(this.velocity) > this.snapThreshold) {
      this.applyMomentum();
    } else {
      this.snapToCard();
    }
  };

  // =========================================================================
  // KEYBOARD HANDLER
  // =========================================================================

  private handleKeyboard = (e: KeyboardEvent): void => {
    if (this.container.style.display === 'none') return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.moveToCard(this.currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      this.moveToCard(this.currentIndex + 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const card = this.getCurrentCenteredCard();
      if (card && !card.classList.contains('locked')) {
        card.click();
      }
    }
  };

  // =========================================================================
  // RESIZE HANDLER
  // =========================================================================

  private handleResize = (): void => {
    if (this.cards.length === 0) return;

    const oldCardWidth = this.cardWidth;
    const newCardWidth = this.cards[0].offsetWidth || this.cardWidth;

    if (oldCardWidth === newCardWidth) {
      this.updatePosition(true);
      return;
    }

    const cardSpacing = oldCardWidth + this.cardGap;
    const currentCardIndex = Math.round(-this.position / cardSpacing);

    this.cardWidth = newCardWidth;
    this.totalCardsWidth = this.totalCards * (this.cardWidth + this.cardGap);

    const newCardSpacing = this.cardWidth + this.cardGap;
    this.position = -currentCardIndex * newCardSpacing;

    this.updatePosition(true);
    this.updateCardOpacity();
  };

  // =========================================================================
  // MOMENTUM PHYSICS
  // =========================================================================

  private applyMomentum(): void {
    const animate = (): void => {
      this.velocity *= this.friction;
      this.position += this.velocity;

      this.updatePosition();
      this.updateCardOpacity();

      if (Math.abs(this.velocity) > this.minVelocity) {
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        this.snapToCard();
      }
    };

    animate();
  }

  // =========================================================================
  // SNAP TO CARD
  // =========================================================================

  private snapToCard(): void {
    const cardSpacing = this.cardWidth + this.cardGap;

    // Velocity-based multi-card skip (Price Is Right physics)
    const velocityFactor = Math.abs(this.velocity) / 8;
    const cardSkip = Math.floor(velocityFactor);
    const currentCardIndex = Math.round(-this.position / cardSpacing);
    const direction = this.velocity > 0 ? 1 : -1;
    const targetIndex = currentCardIndex + cardSkip * direction;

    // Wrap around infinitely
    const clampedIndex = ((targetIndex % this.cards.length) + this.cards.length) % this.cards.length;
    const targetPosition = -clampedIndex * cardSpacing;

    this.isSnapping = true;

    // Cubic ease-out for buttery smooth snap
    const startPosition = this.position;
    const startTime = performance.now();
    const duration = 400;

    const snapAnimation = (): void => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      this.position = startPosition + (targetPosition - startPosition) * eased;

      this.updatePosition(true);
      this.updateCardOpacity();

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(snapAnimation);
      } else {
        this.position = targetPosition;
        this.currentIndex = clampedIndex;
        this.isSnapping = false;

        this.updatePosition(true);
        this.updateCardOpacity();

        // Haptic feedback
        if (this.onHaptic) {
          this.onHaptic();
        } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate(30);
        }

        // Callback
        // Normalize index to original card set (not cloned)
      this.onCardChange?.(this.currentIndex % this.totalCards);
      }
    };

    snapAnimation();
  }

  private snapToSpecificCard(targetIndex: number): void {
    const cardSpacing = this.cardWidth + this.cardGap;
    const targetPosition = -targetIndex * cardSpacing;

    this.isSnapping = true;

    const startPosition = this.position;
    const startTime = performance.now();
    const duration = 400;

    const snapAnimation = (): void => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      this.position = startPosition + (targetPosition - startPosition) * eased;

      this.updatePosition(true);
      this.updateCardOpacity();

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(snapAnimation);
      } else {
        this.position = targetPosition;
        this.currentIndex = targetIndex;
        this.isSnapping = false;

        this.updatePosition(true);
        this.updateCardOpacity();

        if (this.onHaptic) {
          this.onHaptic();
        } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate(30);
        }

        // Normalize index to original card set (not cloned)
      this.onCardChange?.(this.currentIndex % this.totalCards);
      }
    };

    snapAnimation();
  }

  // =========================================================================
  // VISUAL UPDATES
  // =========================================================================

  private updatePosition(skipTeleport = false): void {
    // Center offset for viewport centering
    let centerOffset = 0;
    const viewportWidth = this.viewport.offsetWidth || window.innerWidth;
    centerOffset = viewportWidth / 2 - this.cardWidth / 2;

    // Infinite scroll teleportation (only during free scrolling)
    if (!this.isSnapping && !skipTeleport) {
      const cardSpacing = this.cardWidth + this.cardGap;
      const positionInCards = -this.position / cardSpacing;

      const middleStart = this.totalCards;
      const middleEnd = this.totalCards * 2;
      const buffer = 0.5;

      if (positionInCards > middleEnd + buffer) {
        this.position += this.totalCardsWidth;
      } else if (positionInCards < middleStart - buffer) {
        this.position -= this.totalCardsWidth;
      }
    }

    this.container.style.transform = `translateX(${centerOffset + this.position}px)`;
  }

  private updateCardOpacity(): void {
    const cardSpacing = this.cardWidth + this.cardGap;

    this.cards.forEach((card, index) => {
      const cardPosition = index * cardSpacing + this.position;
      const distance = Math.abs(cardPosition);

      // Center card = full opacity, adjacent = faded
      let opacity = 1.0;
      if (distance > 50) {
        opacity = Math.max(0.4, 1.0 - (distance / cardSpacing) * 0.6);
      }

      card.style.opacity = String(opacity);

      // Scale center card
      const scale = distance < 50 ? 1.0 : 0.9;
      card.style.transform = `scale(${scale})`;
      card.style.transition = this.isDragging ? 'none' : 'opacity 0.3s ease, transform 0.3s ease';

      // Apply center-active/side-card classes for V1-style highlighting
      if (distance < 50) {
        card.classList.add('center-active');
        card.classList.remove('side-card');
      } else {
        card.classList.remove('center-active');
        card.classList.add('side-card');
      }
    });
  }

  // =========================================================================
  // PUBLIC API
  // =========================================================================

  /**
   * Move to a specific card
   */
  moveToCard(index: number, instant = false): void {
    const clampedIndex = ((index % this.cards.length) + this.cards.length) % this.cards.length;

    if (clampedIndex === this.currentIndex && !instant) return;

    const cardSpacing = this.cardWidth + this.cardGap;
    const targetPosition = -clampedIndex * cardSpacing;

    if (instant) {
      this.position = targetPosition;
      this.currentIndex = clampedIndex;
      this.velocity = 0;
      this.updatePosition(true);
      this.updateCardOpacity();
      // Normalize index to original card set (not cloned)
      this.onCardChange?.(this.currentIndex % this.totalCards);
    } else {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
      this.velocity = 0;
      this.currentIndex = clampedIndex;
      this.snapToSpecificCard(clampedIndex);
    }
  }

  /**
   * Get current card index
   */
  getCurrentCard(): number {
    return this.currentIndex;
  }

  /**
   * Get the currently centered card element
   */
  getCurrentCenteredCard(): HTMLElement | null {
    const centeredIndex = this.totalCards + this.currentIndex;
    return this.cards[centeredIndex] ?? null;
  }

  /**
   * Clean up
   */
  destroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.container.removeEventListener('touchstart', this.handleTouchStart);
    this.container.removeEventListener('touchmove', this.handleTouchMove);
    this.container.removeEventListener('touchend', this.handleTouchEnd);
    this.container.removeEventListener('mousedown', this.handleMouseStart);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseEnd);
    document.removeEventListener('keydown', this.handleKeyboard);
    window.removeEventListener('resize', this.handleResize);
  }
}
