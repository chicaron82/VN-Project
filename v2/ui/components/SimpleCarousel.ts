/**
 * SIMPLE CAROUSEL ENGINE (Portrait/Mobile)
 * UV7 UPGRADE: Tinder-style card swipe mechanics
 * Ported from V1 with exact flavour values
 */

import type { EventBus } from '@core/EventBus';
import type { CarouselItem } from './MenuCarousel';
import { Logger } from '@utils/Logger';

export class SimpleCarousel {
    private eventBus: EventBus;
    private items: CarouselItem[];
    private currentIndex: number = 1; // Start at Index 1 (Start Story)
    private isAnimating: boolean = false;

    // Touch/drag state
    private isDragging: boolean = false;
    private swipeDirection: 'horizontal' | 'vertical' | null = null;
    private startX: number = 0;
    private startY: number = 0;
    private currentX: number = 0;
    private currentY: number = 0;
    private startTime: number = 0;

    // Swipe thresholds (UV7 RECOMMENDED VALUES - V1 flavour)
    private DISTANCE_THRESHOLD: number = 0; // Will be set to 35% of viewport width
    private VELOCITY_THRESHOLD: number = 0.5; // pixels per ms (for flicks)
    private SWIPE_UP_THRESHOLD: number = 100; // pixels (easy to trigger)
    private MAX_ROTATION: number = 8; // degrees (subtle but noticeable)

    // DOM references
    private container: HTMLElement;
    private track: HTMLElement;
    // private viewport: HTMLElement; // Unused
    private dotsContainer: HTMLElement;
    private tutorialOverlay: HTMLElement | null = null;

    constructor(eventBus: EventBus, items: CarouselItem[], container: HTMLElement) {
        this.eventBus = eventBus;
        this.items = items;
        this.container = container;

        // Switch to Tinder Mode classes
        this.container.className = 'menu-carousel simple-mode tinder-mode';

        // Get DOM references
        // this.viewport = this.container.querySelector('.carousel-viewport') as HTMLElement;
        this.track = this.container.querySelector('.carousel-track') as HTMLElement;
        this.dotsContainer = this.container.querySelector('.carousel-dots') as HTMLElement;

        Logger.ui('📱 Simple Carousel (Portrait) initialized - Tinder Mode');
    }

    public init(): void {
        // Set dynamic threshold based on viewport
        this.DISTANCE_THRESHOLD = window.innerWidth * 0.35; // 35% of screen width

        // Set up event listeners
        this.initEventListeners();

        // Render card stack
        this.renderCardStack();

        // Update dots
        this.updateDots();

        // Show tutorial on first use
        this.showTutorialIfFirstTime();

        Logger.ui(`✅ Simple Carousel ready with ${this.items.length} cards (Tinder Mode)`);
    }

    private initEventListeners(): void {
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    private renderCardStack(): void {
        this.track.innerHTML = '';

        // Render 3 cards: prev (hidden), current, next
        const indices = [
            this.getPrevIndex(),
            this.currentIndex,
            this.getNextIndex()
        ];

        indices.forEach((index, stackPosition) => {
            const item = this.items[index];
            if (!item) return;

            const card = this.createCardElement(item, stackPosition);
            this.track.appendChild(card);
        });
    }

    private createCardElement(item: CarouselItem, stackPosition: number): HTMLElement {
        const cardDiv = document.createElement('div');
        cardDiv.className = `carousel-card ${item.special ? 'torigatchi-special' : ''} ${item.locked ? 'locked' : ''}`;
        cardDiv.style.background = item.background;
        cardDiv.dataset.stackPosition = stackPosition.toString();

        // Apply initial transforms based on stack position
        if (stackPosition === 0) {
            // Previous (hidden behind)
            cardDiv.style.transform = 'scale(0.9) translateY(20px)';
            cardDiv.style.opacity = '0';
            cardDiv.style.zIndex = '1';
            cardDiv.style.pointerEvents = 'none';
        } else if (stackPosition === 1) {
            // Current (active)
            cardDiv.style.transform = 'scale(1.0) translateX(0) rotate(0deg)';
            cardDiv.style.opacity = '1';
            cardDiv.style.zIndex = '3';
            cardDiv.style.pointerEvents = 'auto';
        } else {
            // Next (peeking)
            cardDiv.style.transform = 'scale(0.95) translateY(10px)';
            cardDiv.style.opacity = '0.7';
            cardDiv.style.zIndex = '2';
            cardDiv.style.pointerEvents = 'none';
        }

        if (item.locked) {
            cardDiv.innerHTML = `
                <div class="card-lock-overlay">
                    <div class="lock-icon">🔒</div>
                    <div class="lock-title">${item.title}</div>
                    <div class="lock-text">LOCKED</div>
                </div>`;
        } else {
            cardDiv.innerHTML = `
                <div class="card-icon">${item.icon}</div>
                <h2 class="card-title">${item.title}</h2>
                <p class="card-subtitle">${item.subtitle}</p>
                <div class="card-button">${item.icon} TAP TO SELECT</div>
                
                <!-- DIZEE: Tap zones for left/right navigation -->
                <div class="tap-zone tap-zone-left" data-action="prev"></div>
                <div class="tap-zone tap-zone-right" data-action="next"></div>
            `;

            // Handle tap navigation (only on current card)
            if (stackPosition === 1) {
                cardDiv.onclick = (e) => {
                    if (this.isDragging || this.isAnimating) return;

                    const target = e.target as HTMLElement;
                    const tapZone = target.closest('.tap-zone') as HTMLElement;
                    if (tapZone) {
                        e.stopPropagation();
                        if (navigator.vibrate) navigator.vibrate(10);

                        if (tapZone.dataset.action === 'prev') {
                            this.goToCard(this.getPrevIndex());
                        } else if (tapZone.dataset.action === 'next') {
                            this.goToCard(this.getNextIndex());
                        }

                        this.dismissTutorial();
                        return;
                    }

                    // Center tap - trigger card action
                    if (navigator.vibrate) navigator.vibrate(10);
                    this.eventBus.emit('ui:click', {});
                    item.action();
                    this.dismissTutorial();
                };
            }
        }

        return cardDiv;
    }

    private handleTouchStart(e: TouchEvent): void {
        if (this.isAnimating) return;
        if (!e.touches || e.touches.length === 0) return;

        const touch = e.touches[0];
        if (!touch) return;
        this.startX = touch.clientX;
        this.startY = touch.clientY;
        this.currentX = touch.clientX;
        this.currentY = touch.clientY;
        this.startTime = Date.now();
        this.isDragging = false;
        this.swipeDirection = null;

        // Remove transitions for immediate response
        const currentCard = this.getCurrentCardElement();
        if (currentCard) {
            currentCard.style.transition = 'none';
        }
    }

    private handleTouchMove(e: TouchEvent): void {
        if (!e.touches || e.touches.length === 0) return;
        const touch = e.touches[0];
        if (!touch) return;
        this.currentX = touch.clientX;
        this.currentY = touch.clientY;

        const deltaX = this.currentX - this.startX;
        const deltaY = this.currentY - this.startY;

        // Determine swipe direction (only once per gesture)
        if (!this.swipeDirection && !this.isDragging) {
            if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    this.swipeDirection = 'horizontal';
                    this.isDragging = true;
                } else if (deltaY < -10) {
                    this.swipeDirection = 'vertical';
                    this.isDragging = true;
                }
            }
        }

        if (!this.isDragging) return;

        // Prevent scrolling
        e.preventDefault();

        if (this.swipeDirection === 'horizontal') {
            this.updateCardDrag(deltaX);
        } else if (this.swipeDirection === 'vertical') {
            this.updateConfirmDrag(deltaY);
        }
    }

    private handleTouchEnd(_e: TouchEvent): void {
        if (!this.isDragging) return;

        const deltaX = this.currentX - this.startX;
        const deltaY = this.currentY - this.startY;
        const deltaTime = Date.now() - this.startTime;
        const velocityX = Math.abs(deltaX) / deltaTime;

        if (this.swipeDirection === 'horizontal') {
            // Check commit threshold
            if (Math.abs(deltaX) > this.DISTANCE_THRESHOLD || velocityX > this.VELOCITY_THRESHOLD) {
                this.commitSwipe(deltaX > 0 ? 'right' : 'left', velocityX);
            } else {
                this.springBack();
            }
        } else if (this.swipeDirection === 'vertical') {
            if (deltaY < -this.SWIPE_UP_THRESHOLD) {
                this.confirmCurrentCard();
            } else {
                this.springBack();
            }
        }

        this.isDragging = false;
        this.swipeDirection = null;
    }

    private handleKeyboard(e: KeyboardEvent): void {
        // Only handle if carousel is visible
        if (!this.container || this.container.style.display === 'none') return;

        // Prevent default for arrow keys and Enter
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Enter'].includes(e.key)) {
            e.preventDefault();
        }

        if (e.key === 'ArrowLeft') {
            // Swipe left (go to next card)
            this.commitSwipe('left');
        } else if (e.key === 'ArrowRight') {
            // Swipe right (go to previous card)
            this.commitSwipe('right');
        } else if (e.key === 'ArrowUp' || e.key === 'Enter') {
            // Confirm current card (swipe up equivalent)
            this.confirmCurrentCard();
        }
    }

    private updateCardDrag(deltaX: number): void {
        const currentCard = this.getCurrentCardElement();
        const nextCard = this.getNextCardElement();
        if (!currentCard || !nextCard) return;

        // Calculate rotation (caps at MAX_ROTATION)
        const rotationFactor = Math.min(Math.abs(deltaX) / this.DISTANCE_THRESHOLD, 1);
        const rotation = (deltaX * 0.1) * rotationFactor;
        const clampedRotation = Math.max(-this.MAX_ROTATION, Math.min(this.MAX_ROTATION, rotation));

        // Calculate opacity fade
        const dragProgress = Math.min(Math.abs(deltaX) / this.DISTANCE_THRESHOLD, 1);
        const opacity = 1.0 - (dragProgress * 0.5);

        // Apply transforms to current card
        currentCard.style.transform = `translateX(${deltaX}px) rotate(${clampedRotation}deg)`;
        currentCard.style.opacity = opacity.toString();

        // Reveal next card
        const nextScale = 0.95 + (dragProgress * 0.05);
        const nextOpacity = 0.7 + (dragProgress * 0.3);
        const nextY = 10 - (dragProgress * 10);

        nextCard.style.transform = `scale(${nextScale}) translateY(${nextY}px)`;
        nextCard.style.opacity = nextOpacity.toString();
    }

    private updateConfirmDrag(deltaY: number): void {
        const currentCard = this.getCurrentCardElement();
        if (!currentCard) return;

        // Pull-down effect with resistance
        const resistance = 0.5;
        const translateY = deltaY * resistance;

        // Scale pulse as you drag up
        const dragProgress = Math.min(Math.abs(deltaY) / this.SWIPE_UP_THRESHOLD, 1);
        const scale = 1.0 + (dragProgress * 0.1);

        currentCard.style.transform = `translateY(${translateY}px) scale(${scale})`;

        // Glow intensity
        const glowIntensity = dragProgress * 20;
        currentCard.style.boxShadow = `0 0 ${glowIntensity}px rgba(0, 255, 255, ${dragProgress})`;
    }

    private commitSwipe(direction: 'right' | 'left', velocityX: number = 0): void {
        this.isAnimating = true;
        const currentCard = this.getCurrentCardElement();
        if (!currentCard) return;

        const viewportWidth = window.innerWidth;
        const targetX = direction === 'right' ? viewportWidth + 100 : -(viewportWidth + 100);
        const targetRotation = direction === 'right' ? 15 : -15;

        // ZEE'S TUNE-UP: Momentum-based exit (faster exit on fast swipes)
        const exitDuration = Math.max(200, 400 - (velocityX * 100));
        currentCard.style.transition = `transform ${exitDuration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${exitDuration}ms ease-out`;
        currentCard.style.transform = `translateX(${targetX}px) rotate(${targetRotation}deg)`;
        currentCard.style.opacity = '0';

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(30);

        // Update index
        if (direction === 'right') {
            this.prev();
        } else {
            this.next();
        }

        // Re-render stack after animation
        setTimeout(() => {
            this.renderCardStack();
            this.isAnimating = false;

            // Refocus for accessibility
            const newTopCard = this.getCurrentCardElement();
            if (newTopCard) newTopCard.focus();
        }, 300);
    }

    private springBack(): void {
        const currentCard = this.getCurrentCardElement();
        const nextCard = this.getNextCardElement();
        if (!currentCard || !nextCard) return;

        // ZEE'S TUNE-UP: More elastic bounce (iPhone feel)
        currentCard.style.transition = 'transform 250ms cubic-bezier(0.68, -0.6, 0.265, 1.65), opacity 250ms ease-out, box-shadow 250ms ease-out';
        currentCard.style.transform = 'translateX(0) rotate(0deg) scale(1.0)';
        currentCard.style.opacity = '1';
        currentCard.style.boxShadow = 'none';

        // Reset next card
        nextCard.style.transition = 'transform 250ms ease-out, opacity 250ms ease-out';
        nextCard.style.transform = 'scale(0.95) translateY(10px)';
        nextCard.style.opacity = '0.7';
    }

    private confirmCurrentCard(): void {
        this.isAnimating = true;
        const currentCard = this.getCurrentCardElement();
        if (!currentCard) return;

        // Confirmation animation
        currentCard.style.transition = 'transform 200ms ease-out, box-shadow 200ms ease-out';
        currentCard.style.transform = 'scale(1.1)';
        currentCard.style.boxShadow = '0 0 30px rgba(0, 255, 255, 1)';

        // Haptic feedback (double pulse)
        if (navigator.vibrate) navigator.vibrate([30, 50, 30]);

        // Trigger action
        setTimeout(() => {
            const item = this.items[this.currentIndex];
            if (item) {
                this.eventBus.emit('ui:click', {});
                item.action();
            }
            this.isAnimating = false;
        }, 200);
    }

    private next(): void {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.updateDots();
    }

    private prev(): void {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.updateDots();
    }

    private goToCard(index: number): void {
        if (index === this.currentIndex) return;
        this.currentIndex = index;
        this.renderCardStack();
        this.updateDots();
    }

    private getPrevIndex(): number {
        return (this.currentIndex - 1 + this.items.length) % this.items.length;
    }

    private getNextIndex(): number {
        return (this.currentIndex + 1) % this.items.length;
    }

    private getCurrentCardElement(): HTMLElement | null {
        return this.track.querySelector('[data-stack-position="1"]');
    }

    private getNextCardElement(): HTMLElement | null {
        return this.track.querySelector('[data-stack-position="2"]');
    }

    private updateDots(): void {
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    private showTutorialIfFirstTime(): void {
        const tutorialDismissed = localStorage.getItem('carouselTutorialDismissed') === 'true';
        if (tutorialDismissed) return;

        // Create tutorial overlay
        this.tutorialOverlay = document.createElement('div');
        this.tutorialOverlay.className = 'carousel-tutorial-overlay';
        this.tutorialOverlay.innerHTML = `
            <div class="tutorial-content">
                <div class="tutorial-hand-container">
                    <div class="tutorial-hand">👆</div>
                    <div class="tutorial-swipe-trail"></div>
                </div>
                <div class="tutorial-text">
                    <span class="tutorial-swipe-hint">Swipe left/right to browse</span>
                    <span class="tutorial-tap-hint">Tap edges to navigate</span>
                    <span class="tutorial-select-hint">↑ Swipe up or tap center to select</span>
                </div>
                <button class="tutorial-dismiss-btn">Got it!</button>
            </div>
        `;

        // Add click handler to dismiss
        this.tutorialOverlay.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('tutorial-dismiss-btn') ||
                target.classList.contains('carousel-tutorial-overlay')) {
                this.dismissTutorial();
            }
        });

        this.container.appendChild(this.tutorialOverlay);
        Logger.ui('👆 Tutorial overlay shown');
    }

    private dismissTutorial(): void {
        if (this.tutorialOverlay) {
            this.tutorialOverlay.classList.add('dismissing');
            setTimeout(() => {
                if (this.tutorialOverlay && this.tutorialOverlay.parentElement) {
                    this.tutorialOverlay.remove();
                }
                this.tutorialOverlay = null;
            }, 300);

            localStorage.setItem('carouselTutorialDismissed', 'true');
            Logger.ui('👆 Tutorial dismissed');
        }
    }

    public getCurrentCard(): number {
        return this.currentIndex;
    }

    public getIsDragging(): boolean {
        return this.isDragging;
    }

    public destroy(): void {
        this.dismissTutorial();
        Logger.ui('📱 Simple Carousel destroyed');
    }
}
