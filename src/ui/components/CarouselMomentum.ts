/**
 * CAROUSEL MOMENTUM ENGINE
 * Custom physics-based carousel for Version 848
 * Ported to V2 TypeScript
 */
export interface CarouselMomentumConfig {
    container: HTMLElement;
    cards: HTMLElement[];
    onCardChange?: (index: number) => void;
    game?: any; // Optional game instance
    viewport?: HTMLElement;
    totalCards?: number;
    enableKeyboard?: boolean;
    friction?: number;
    snapThreshold?: number;
    minVelocity?: number;
    maxVelocity?: number;
    cardWidth?: number;
    cardGap?: number;
}

export class CarouselMomentum {
    private container: HTMLElement;
    private cards: HTMLElement[];
    private onCardChange: ((index: number) => void) | null;
    // @ts-ignore
    private game: any;
    private viewport: HTMLElement | null;
    private totalCards: number;
    private enableKeyboard: boolean;

    // Physics
    private friction: number;
    private snapThreshold: number;
    private minVelocity: number;
    private maxVelocity: number;
    private cardWidth: number;
    private cardGap: number;

    // Boundaries
    private totalCardsWidth: number;

    // State
    private currentIndex: number = 0;
    private position: number = 0;
    private velocity: number = 0;
    private isDragging: boolean = false;
    private isPotentialDrag: boolean = false;
    private isSnapping: boolean = false;
    private startX: number = 0;
    // @ts-ignore
    private startY: number = 0;
    private lastX: number = 0;
    private lastTime: number = 0;
    private animationFrame: number | null = null;
    private resizeObserver: ResizeObserver | null = null;
    private resizeTimeout: any = null;

    constructor(config: CarouselMomentumConfig) {
        this.container = config.container;
        this.cards = config.cards || [];
        this.onCardChange = config.onCardChange || null;
        this.game = config.game || null;
        this.viewport = config.viewport || null;
        this.totalCards = config.totalCards || (this.cards.length / 3);
        this.enableKeyboard = config.enableKeyboard !== false;

        this.friction = config.friction || 0.975;
        this.snapThreshold = config.snapThreshold || 0.2;
        this.minVelocity = config.minVelocity || 0.05;
        this.maxVelocity = config.maxVelocity || 300;
        this.cardWidth = config.cardWidth || 400;
        this.cardGap = config.cardGap || 20;

        this.totalCardsWidth = this.totalCards * (this.cardWidth + this.cardGap);
        this.init();
    }

    public init() {
        if (!this.container || this.cards.length === 0) {
            console.error('CarouselMomentum: Invalid container or cards');
            return;
        }

        console.log('🎠 Initializing CarouselMomentum...');

        // Touch
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e as TouchEvent), { passive: false });
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e as TouchEvent), { passive: false });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e as TouchEvent), { passive: false });

        // Mouse
        this.container.addEventListener('mousedown', (e) => this.handleMouseStart(e as MouseEvent));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e as MouseEvent));
        document.addEventListener('mouseup', (e) => this.handleMouseEnd(e as MouseEvent));

        // Keyboard
        if (this.enableKeyboard) {
            document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        }

        // Resize
        window.addEventListener('resize', () => this.handleResize());

        if (window.ResizeObserver && (this.container || this.viewport)) {
            this.resizeObserver = new ResizeObserver(() => {
                if (!this.resizeTimeout) {
                    this.resizeTimeout = setTimeout(() => {
                        this.handleResize();
                        this.resizeTimeout = null;
                    }, 50);
                }
            });
            if (this.container) this.resizeObserver.observe(this.container);
            if (this.viewport && this.viewport !== this.container) this.resizeObserver.observe(this.viewport);
        }
    }

    private handleResize() {
        if (this.cards.length > 0) {
            const oldCardWidth = this.cardWidth;
            const firstCard = this.cards[0];
            const newCardWidth = firstCard ? (firstCard.offsetWidth || this.cardWidth) : this.cardWidth;

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
        }
    }

    private handleTouchStart(e: TouchEvent) {
        this.isDragging = false;
        this.isPotentialDrag = true;
        this.velocity = 0;

        if (e.touches.length === 0) return;
        const touch: any = e.touches[0];

        this.startX = touch.clientX;
        this.startY = touch.clientY;
        this.lastX = touch.clientX;
        this.lastTime = Date.now();

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        this.isSnapping = false;
    }

    private handleTouchMove(e: TouchEvent) {
        if (e.touches.length === 0) return;
        const touch: any = e.touches[0];

        if (this.isPotentialDrag && !this.isDragging) {
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

        const currentX = touch.clientX;
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
    }

    private handleTouchEnd(e: TouchEvent) {
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
    }

    private handleMouseStart(e: MouseEvent) {
        const target = e.target as HTMLElement;
        const isCard = target.closest('.carousel-card');
        const isButton = target.tagName === 'BUTTON' || target.closest('button');

        if (isCard || isButton) return;

        this.isDragging = false;
        this.isPotentialDrag = true;
        this.velocity = 0;

        this.startX = e.clientX;
        this.lastX = e.clientX;
        this.lastTime = Date.now();

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        this.isSnapping = false;
    }

    private handleMouseMove(e: MouseEvent) {
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
    }

    private handleMouseEnd(_e: MouseEvent) {
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
    }

    private handleKeyboard(e: KeyboardEvent) {
        if (!this.container || this.container.style.display === 'none') return;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.moveToCard(this.currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.moveToCard(this.currentIndex + 1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const centeredCard = this.getCurrentCenteredCard();
            if (centeredCard && !centeredCard.classList.contains('locked')) {
                centeredCard.click();
            }
        }
    }

    private getCurrentCenteredCard(): HTMLElement | null {
        if (!this.cards || this.cards.length === 0) return null;
        const centeredIndex = this.totalCards + this.currentIndex;
        return this.cards[centeredIndex] || null;
    }

    private applyMomentum() {
        const animate = () => {
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

    private snapToCard() {
        const cardSpacing = this.cardWidth + this.cardGap;
        const velocityFactor = Math.abs(this.velocity) / 8;
        const cardSkip = Math.floor(velocityFactor);

        const currentCardIndex = Math.round(-this.position / cardSpacing);
        const direction = this.velocity > 0 ? 1 : -1;
        const targetIndex = currentCardIndex + (cardSkip * direction);
        const clampedIndex = ((targetIndex % this.cards.length) + this.cards.length) % this.cards.length;
        const targetPosition = -clampedIndex * cardSpacing;

        this.isSnapping = true;
        const startPosition = this.position;
        const startTime = performance.now();
        const duration = 400;

        const snapAnimation = () => {
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

                if (this.onCardChange) {
                    this.onCardChange(this.currentIndex);
                }
            }
        };
        snapAnimation();
    }

    public snapToSpecificCard(targetIndex: number) {
        const cardSpacing = this.cardWidth + this.cardGap;
        const targetPosition = -targetIndex * cardSpacing;

        this.isSnapping = true;
        const startPosition = this.position;
        const startTime = performance.now();
        const duration = 400;

        const snapAnimation = () => {
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

                if (this.onCardChange) {
                    this.onCardChange(this.currentIndex);
                }
            }
        };
        snapAnimation();
    }

    private updatePosition(skipTeleport = false) {
        let centerOffset = 0;
        if (this.viewport) {
            const viewportWidth = this.viewport.offsetWidth || window.innerWidth;
            centerOffset = (viewportWidth / 2) - (this.cardWidth / 2);
        }

        if (this.container) {
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
    }

    private updateCardOpacity() {
        const cardSpacing = this.cardWidth + this.cardGap;
        this.cards.forEach((card, index) => {
            const cardPosition = (index * cardSpacing) + this.position;
            const distance = Math.abs(cardPosition);
            let opacity = 1.0;
            if (distance > 50) {
                opacity = Math.max(0.4, 1.0 - (distance / cardSpacing) * 0.6);
            }
            card.style.opacity = opacity.toString();
            const scale = distance < 50 ? 1.0 : 0.9;
            card.style.transform = `scale(${scale})`;
            card.style.transition = this.isDragging ? 'none' : 'opacity 0.3s ease, transform 0.3s ease';
        });
    }

    public moveToCard(index: number, instant = false) {
        const clampedIndex = ((index % this.cards.length) + this.cards.length) % this.cards.length;
        if (clampedIndex === this.currentIndex && !instant) return;

        if (instant) {
            const cardSpacing = this.cardWidth + this.cardGap;
            const targetPosition = -clampedIndex * cardSpacing;
            this.position = targetPosition;
            this.currentIndex = clampedIndex;
            this.velocity = 0;
            this.updatePosition(true);
            this.updateCardOpacity();
            if (this.onCardChange) this.onCardChange(this.currentIndex);
        } else {
            this.snapToSpecificCard(clampedIndex);
        }
    }

    public getCurrentCard() {
        return this.currentIndex;
    }

    public destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        if (this.resizeObserver) this.resizeObserver.disconnect();
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    }
}
