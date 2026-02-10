/**
 * SpotlightCarousel - VN-Style Horizontal Carousel
 * Cards side by side, momentum scrolling, hard beginning and end (no looping)
 * Adapted from V1's CarouselMomentum engine
 */

import { Logger } from '@utils/Logger';

declare global {
    interface Window {
        spotlightCarousel?: SpotlightCarousel;
        spotlightModal?: {
            open: (index: number) => void;
        };
        spotlightTracker?: {
            markCardViewed: (index: number) => void;
        };
    }
}

export class SpotlightCarousel {
    private container: HTMLElement | null;
    private viewport: HTMLElement | null;
    private cards: HTMLElement[];
    private currentIndex: number = 0;

    // Physics state
    private position: number = 0;
    private velocity: number = 0;
    private isDragging: boolean = false;
    private isPotentialDrag: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private lastX: number = 0;
    private lastTime: number = 0;
    private animationFrame: number | null = null;

    // Physics parameters (V1's tuned values)
    private readonly friction = 0.975;
    private readonly minVelocity = 0.05;
    private readonly maxVelocity = 300;
    private cardWidth: number = 400;  // Will be calculated from actual card
    private readonly cardGap = 20;

    constructor() {
        this.container = document.querySelector('.carousel-track');
        this.viewport = document.querySelector('.spotlight-carousel-container');
        this.cards = Array.from(document.querySelectorAll('.technical-card'));

        this.init();
    }

    private init(): void {
        if (!this.container || !this.viewport || this.cards.length === 0) {
            // Elements not found - carousel likely not on this page
            return;
        }

        Logger.ui('🎠 Initializing VN-Style Carousel...');

        // Calculate card dimensions
        if (this.cards.length > 0) {
            this.cardWidth = this.cards[0].offsetWidth || 400;
        }

        // Set up event listeners
        this.attachEventListeners();

        // Initial position
        this.moveToCard(0, true);
        this.checkDeepLink();

        // Handle resize
        window.addEventListener('resize', () => this.handleResize());

        Logger.ui('✅ VN-Style Carousel initialized');
    }

    private attachEventListeners(): void {
        if (!this.container) return;

        // Touch events
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });

        // Mouse events
        this.container.addEventListener('mousedown', (e) => this.handleMouseStart(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleMouseEnd(e));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Navigation buttons
        const prevBtn = document.querySelector('.nav-prev');
        const nextBtn = document.querySelector('.nav-next');
        if (prevBtn) prevBtn.addEventListener('click', () => this.navigate(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.navigate(1));

        // Navigation dots
        this.createNavigationDots();

        // Card clicks to open modal OR navigate
        this.cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                // Don't do anything if we were dragging
                if (this.isDragging || this.isPotentialDrag) return;

                // If clicking the center card, open modal
                if (index === this.currentIndex) {
                    window.spotlightModal?.open(index);
                    window.spotlightTracker?.markCardViewed(index);
                } else {
                    // If clicking a side card, navigate to it
                    this.moveToCard(index);
                }
            });
        });
    }

    private createNavigationDots(): void {
        const navContainer = document.querySelector('.carousel-nav .nav-dots');
        if (!navContainer) return;

        navContainer.innerHTML = '';
        this.cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'nav-dot';
            dot.setAttribute('aria-label', `Go to card ${index + 1}`);
            dot.addEventListener('click', () => this.moveToCard(index));
            navContainer.appendChild(dot);
        });
    }

    // ========================================
    // TOUCH HANDLERS
    // ========================================

    private handleTouchStart(e: TouchEvent): void {
        this.isPotentialDrag = true;
        this.isDragging = false;
        this.velocity = 0;

        const touch = e.touches[0];
        if (!touch) return;

        this.startX = touch.clientX;
        this.startY = touch.clientY;
        this.lastX = touch.clientX;
        this.lastTime = Date.now();

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    private handleTouchMove(e: TouchEvent): void {
        if (this.isPotentialDrag && !this.isDragging) {
            const touch = e.touches[0];
            if (!touch) return;

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
        if (!touch) return;

        const currentX = touch.clientX;
        const currentTime = Date.now();

        const deltaX = currentX - this.lastX;
        const deltaTime = currentTime - this.lastTime;

        this.position += deltaX;
        this.clampPosition(); // Enforce hard boundaries

        if (deltaTime > 0) {
            this.velocity = (deltaX / deltaTime) * 16.67;
        }

        this.lastX = currentX;
        this.lastTime = currentTime;

        this.updatePosition();
        this.updateCardOpacity();
    }

    private handleTouchEnd(e: TouchEvent): void {
        const wasDragging = this.isDragging;
        this.isDragging = false;
        this.isPotentialDrag = false;

        if (!wasDragging) return;
        e.preventDefault();

        this.velocity = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, this.velocity));

        if (Math.abs(this.velocity) > 0.2) {
            this.applyMomentum();
        } else {
            this.snapToCard();
        }
    }

    // ========================================
    // MOUSE HANDLERS
    // ========================================

    private handleMouseStart(e: MouseEvent): void {
        this.isPotentialDrag = true;
        this.isDragging = false;
        this.velocity = 0;

        this.startX = e.clientX;
        this.lastX = e.clientX;
        this.lastTime = Date.now();

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    private handleMouseMove(e: MouseEvent): void {
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
        this.clampPosition(); // Enforce hard boundaries

        if (deltaTime > 0) {
            this.velocity = (deltaX / deltaTime) * 16.67;
        }

        this.lastX = currentX;
        this.lastTime = currentTime;

        this.updatePosition();
        this.updateCardOpacity();

        e.preventDefault();
    }

    private handleMouseEnd(_e: MouseEvent): void {
        const wasDragging = this.isDragging;
        this.isDragging = false;
        this.isPotentialDrag = false;

        if (!wasDragging) return;

        this.velocity = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, this.velocity));

        if (Math.abs(this.velocity) > 0.2) {
            this.applyMomentum();
        } else {
            this.snapToCard();
        }
    }

    // ========================================
    // KEYBOARD NAVIGATION
    // ========================================

    private handleKeyboard(event: KeyboardEvent): void {
        if (document.querySelector('.spotlight-modal.active')) return;

        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                this.navigate(-1);
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.navigate(1);
                break;
            case '1': case '2': case '3': case '4': case '5':
            case '6': case '7': case '8': case '9':
                event.preventDefault();
                this.moveToCard(parseInt(event.key) - 1);
                break;
            case '0':
                event.preventDefault();
                this.moveToCard(9);
                break;
        }
    }

    // ========================================
    // MOMENTUM PHYSICS
    // ========================================

    private applyMomentum(): void {
        const animate = (): void => {
            this.velocity *= this.friction;
            this.position += this.velocity;
            this.clampPosition(); // Enforce hard boundaries

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

    private snapToCard(): void {
        const cardSpacing = this.cardWidth + this.cardGap;
        const currentCardIndex = Math.round(-this.position / cardSpacing);

        // Clamp to valid range (no looping!)
        const targetIndex = Math.max(0, Math.min(currentCardIndex, this.cards.length - 1));

        this.moveToCard(targetIndex, false);
    }

    // ========================================
    // NAVIGATION
    // ========================================

    private navigate(direction: number): void {
        const newIndex = this.currentIndex + direction;
        this.moveToCard(newIndex);
    }

    moveToCard(index: number, instant: boolean = false): void {
        // Clamp to valid range
        const targetIndex = Math.max(0, Math.min(index, this.cards.length - 1));

        const cardSpacing = this.cardWidth + this.cardGap;
        const targetPosition = -targetIndex * cardSpacing;

        if (instant) {
            this.position = targetPosition;
            this.currentIndex = targetIndex;
            this.velocity = 0;
            this.updatePosition();
            this.updateCardOpacity();
            this.syncNavigationDots();
            this.updateDeepLink();
        } else {
            // Smooth animation
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
            }

            const startPosition = this.position;
            const startTime = performance.now();
            const duration = 400;

            const snapAnimation = (): void => {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);

                this.position = startPosition + (targetPosition - startPosition) * eased;
                this.updatePosition();
                this.updateCardOpacity();

                if (progress < 1) {
                    this.animationFrame = requestAnimationFrame(snapAnimation);
                } else {
                    this.position = targetPosition;
                    this.currentIndex = targetIndex;
                    this.updatePosition();
                    this.updateCardOpacity();
                    this.syncNavigationDots();
                    this.updateDeepLink();

                    if (navigator.vibrate) {
                        navigator.vibrate(30);
                    }
                }
            };

            snapAnimation();
        }
    }

    // ========================================
    // VISUAL UPDATES
    // ========================================

    private updatePosition(): void {
        if (!this.container || !this.viewport) return;

        // Calculate center offset for viewport centering
        let centerOffset = 0;
        const viewportWidth = this.viewport.offsetWidth || window.innerWidth;
        centerOffset = (viewportWidth / 2) - (this.cardWidth / 2);

        this.container.style.transform = `translateX(${centerOffset + this.position}px)`;
    }

    private updateCardOpacity(): void {
        const cardSpacing = this.cardWidth + this.cardGap;

        this.cards.forEach((card, index) => {
            const cardPosition = (index * cardSpacing) + this.position;
            const distance = Math.abs(cardPosition);

            // Center card = full opacity, others fade
            let opacity = 1.0;
            if (distance > 50) {
                opacity = Math.max(0.4, 1.0 - (distance / cardSpacing) * 0.6);
            }

            card.style.opacity = opacity.toString();

            // Scale center card slightly larger
            const scale = distance < 50 ? 1.0 : 0.9;
            card.style.transform = `scale(${scale})`;
            card.style.transition = this.isDragging ? 'none' : 'opacity 0.3s ease, transform 0.3s ease';
        });

        // Update current index based on position
        const newIndex = Math.round(-this.position / cardSpacing);
        if (newIndex !== this.currentIndex && newIndex >= 0 && newIndex < this.cards.length) {
            this.currentIndex = newIndex;
            this.syncNavigationDots();
        }
    }

    private syncNavigationDots(): void {
        const dots = document.querySelectorAll('.nav-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    private clampPosition(): void {
        // Hard boundaries: prevent scrolling past first or last card
        const cardSpacing = this.cardWidth + this.cardGap;
        const minPosition = -(this.cards.length - 1) * cardSpacing; // Last card
        const maxPosition = 0; // First card

        if (this.position > maxPosition) {
            this.position = maxPosition;
            this.velocity = 0; // Stop momentum at boundary
        } else if (this.position < minPosition) {
            this.position = minPosition;
            this.velocity = 0; // Stop momentum at boundary
        }
    }

    // ========================================
    // DEEP LINKING
    // ========================================

    private checkDeepLink(): void {
        const hash = window.location.hash;
        if (hash.startsWith('#spotlight-')) {
            const cardSlug = hash.replace('#spotlight-', '');
            const index = this.findCardBySlug(cardSlug);
            if (index !== -1) {
                this.moveToCard(index, true);
                this.viewport?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    private updateDeepLink(): void {
        const card = this.cards[this.currentIndex];
        if (!card) return;

        const title = card.querySelector('h3')?.textContent || '';
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        window.history.replaceState(null, '', `#spotlight-${slug}`);
    }

    private findCardBySlug(slug: string): number {
        return this.cards.findIndex(card => {
            const title = card.querySelector('h3')?.textContent || '';
            const cardSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            return cardSlug === slug;
        });
    }

    // ========================================
    // RESIZE HANDLING
    // ========================================

    private handleResize(): void {
        if (this.cards.length > 0) {
            const oldCardWidth = this.cardWidth;
            const newCardWidth = this.cards[0].offsetWidth || this.cardWidth;

            if (oldCardWidth !== newCardWidth) {
                const cardSpacing = oldCardWidth + this.cardGap;
                const currentCardIndex = Math.round(-this.position / cardSpacing);

                this.cardWidth = newCardWidth;
                const newCardSpacing = this.cardWidth + this.cardGap;
                this.position = -currentCardIndex * newCardSpacing;

                this.updatePosition();
                this.updateCardOpacity();
            }
        }
    }
}

// Initialize when DOM is ready
export function initShowcaseCarousel(): void {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.spotlightCarousel = new SpotlightCarousel();
        });
    } else {
        window.spotlightCarousel = new SpotlightCarousel();
    }
}

// Auto-initialize for backwards compatibility
if (typeof window !== 'undefined' && !window.spotlightCarousel) {
    initShowcaseCarousel();
}
