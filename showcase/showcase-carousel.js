/**
 * SpotlightCarousel - VN-Style Horizontal Carousel
 * Cards side by side, momentum scrolling, hard beginning and end (no looping)
 * Adapted from V1's CarouselMomentum engine
 */
class SpotlightCarousel {
    constructor() {
        this.container = document.querySelector('.carousel-track');
        this.viewport = document.querySelector('.spotlight-carousel-container');
        this.cards = Array.from(document.querySelectorAll('.technical-card'));
        this.currentIndex = 0;

        // Physics state
        this.position = 0;
        this.velocity = 0;
        this.isDragging = false;
        this.isPotentialDrag = false;
        this.startX = 0;
        this.startY = 0;
        this.lastX = 0;
        this.lastTime = 0;
        this.animationFrame = null;

        // Physics parameters (V1's tuned values)
        this.friction = 0.975;
        this.minVelocity = 0.05;
        this.maxVelocity = 300;
        this.cardWidth = 400;  // Will be calculated from actual card
        this.cardGap = 20;

        this.init();
    }

    init() {
        if (!this.container || !this.viewport || this.cards.length === 0) {
            console.warn('SpotlightCarousel: Required elements not found');
            return;
        }

        console.log('🎠 Initializing VN-Style Carousel...');

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

        console.log('✅ VN-Style Carousel initialized');
    }

    attachEventListeners() {
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

    createNavigationDots() {
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

    handleTouchStart(e) {
        this.isPotentialDrag = true;
        this.isDragging = false;
        this.velocity = 0;

        const touch = e.touches[0];
        this.startX = touch.clientX;
        this.startY = touch.clientY;
        this.lastX = touch.clientX;
        this.lastTime = Date.now();

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    handleTouchMove(e) {
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
        this.clampPosition(); // Enforce hard boundaries

        if (deltaTime > 0) {
            this.velocity = (deltaX / deltaTime) * 16.67;
        }

        this.lastX = currentX;
        this.lastTime = currentTime;

        this.updatePosition();
        this.updateCardOpacity();
    }

    handleTouchEnd(e) {
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

    handleMouseStart(e) {
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

    handleMouseMove(e) {
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

    handleMouseEnd(e) {
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

    handleKeyboard(event) {
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

    applyMomentum() {
        const animate = () => {
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

    snapToCard() {
        const cardSpacing = this.cardWidth + this.cardGap;
        const currentCardIndex = Math.round(-this.position / cardSpacing);

        // Clamp to valid range (no looping!)
        const targetIndex = Math.max(0, Math.min(currentCardIndex, this.cards.length - 1));

        this.moveToCard(targetIndex, false);
    }

    // ========================================
    // NAVIGATION
    // ========================================

    navigate(direction) {
        const newIndex = this.currentIndex + direction;
        this.moveToCard(newIndex);
    }

    moveToCard(index, instant = false) {
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

            const snapAnimation = () => {
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

    updatePosition() {
        // Calculate center offset for viewport centering
        let centerOffset = 0;
        if (this.viewport) {
            const viewportWidth = this.viewport.offsetWidth || window.innerWidth;
            centerOffset = (viewportWidth / 2) - (this.cardWidth / 2);
        }

        if (this.container) {
            this.container.style.transform = `translateX(${centerOffset + this.position}px)`;
        }
    }

    updateCardOpacity() {
        const cardSpacing = this.cardWidth + this.cardGap;

        this.cards.forEach((card, index) => {
            const cardPosition = (index * cardSpacing) + this.position;
            const distance = Math.abs(cardPosition);

            // Center card = full opacity, others fade
            let opacity = 1.0;
            if (distance > 50) {
                opacity = Math.max(0.4, 1.0 - (distance / cardSpacing) * 0.6);
            }

            card.style.opacity = opacity;

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

    syncNavigationDots() {
        const dots = document.querySelectorAll('.nav-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    clampPosition() {
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

    checkDeepLink() {
        const hash = window.location.hash;
        if (hash.startsWith('#spotlight-')) {
            const cardSlug = hash.replace('#spotlight-', '');
            const index = this.findCardBySlug(cardSlug);
            if (index !== -1) {
                this.moveToCard(index, true);
                this.viewport.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    updateDeepLink() {
        const card = this.cards[this.currentIndex];
        const title = card.querySelector('h3')?.textContent || '';
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        window.history.replaceState(null, '', `#spotlight-${slug}`);
    }

    findCardBySlug(slug) {
        return this.cards.findIndex(card => {
            const title = card.querySelector('h3')?.textContent || '';
            const cardSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            return cardSlug === slug;
        });
    }

    // ========================================
    // RESIZE HANDLING
    // ========================================

    handleResize() {
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
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.spotlightCarousel = new SpotlightCarousel();
    });
} else {
    window.spotlightCarousel = new SpotlightCarousel();
}
