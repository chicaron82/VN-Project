// ========================================
// CAROUSEL MOMENTUM ENGINE
// Custom physics-based carousel for Version 848
// Swipe → Momentum → Deceleration → Snap
// Built from scratch because everything else is 🔥
//
// INFINITE SCROLL FIX (v848):
// - 3x clone buffer (left/middle/right sets)
// - Invisible teleportation at boundaries
// - Perfect viewport centering
// - No edges, no walls, no jank
// ========================================

class CarouselMomentum {
    constructor(config) {
        // Configuration
        this.container = config.container;
        this.cards = config.cards || [];
        this.onCardChange = config.onCardChange || null;
        this.game = config.game || null;  // Optional game instance for haptic feedback
        this.viewport = config.viewport || null;  // Viewport for centering
        this.totalCards = config.totalCards || (this.cards.length / 3);  // Number of REAL cards
        this.enableKeyboard = config.enableKeyboard !== false;  // Enable keyboard by default

        // Physics parameters (tunable) - ZEE'S TUNE-UP: Price Is Right spin + iPhone feel
        this.friction = config.friction || 0.975;          // Coast longer (Price Is Right spin) - UPGRADED
        this.snapThreshold = config.snapThreshold || 0.2;  // Tighter precision on light flicks - UPGRADED
        this.minVelocity = config.minVelocity || 0.05;     // Stop animation below this - FINER detection
        this.maxVelocity = config.maxVelocity || 300;      // ZOOM on hard flicks - UPGRADED
        this.cardWidth = config.cardWidth || 400;          // Card width in pixels
        this.cardGap = config.cardGap || 20;               // Gap between cards

        // Infinite scroll boundaries (for teleportation)
        this.totalCardsWidth = this.totalCards * (this.cardWidth + this.cardGap);
        this.leftBoundary = 0;  // If position < 0, teleport right
        this.rightBoundary = this.totalCardsWidth * 2;  // If position > 2x width, teleport left

        // State
        this.currentIndex = 0;
        this.position = 0;           // Current scroll position
        this.velocity = 0;           // Current velocity
        this.isDragging = false;
        this.isPotentialDrag = false;
        this.isSnapping = false;     // Disable teleportation during snap animations
        this.startX = 0;
        this.startY = 0;
        this.lastX = 0;
        this.lastTime = 0;
        this.animationFrame = null;

        // Initialize
        this.init();
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    init() {
        if (!this.container || this.cards.length === 0) {
            console.error('CarouselMomentum: Invalid container or cards');
            return;
        }

        console.log('🎠 Initializing CarouselMomentum...');

        // Set up touch events
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });

        // Set up mouse events (desktop support)
        this.container.addEventListener('mousedown', (e) => this.handleMouseStart(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleMouseEnd(e));

        // Keyboard support (optional)
        if (this.enableKeyboard) {
            document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        }

        // Resize/orientation change support
        window.addEventListener('resize', () => this.handleResize());

        // ResizeObserver for robust layout tracking (fixes portrait mode centering issues)
        if (window.ResizeObserver && (this.container || this.viewport)) {
            this.resizeObserver = new ResizeObserver(entries => {
                // Debounce slightly to avoid thrashing
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

        // Initial render will happen when moveToCard() is called externally
        // (Skipping updatePosition here prevents teleportation before proper initialization)

        console.log('✅ CarouselMomentum initialized');
    }

    // ========================================
    // RESIZE HANDLING
    // ========================================

    handleResize() {
        // Recalculate card dimensions when viewport changes (portrait/landscape)
        if (this.cards.length > 0) {
            const oldCardWidth = this.cardWidth;
            const newCardWidth = this.cards[0].offsetWidth || this.cardWidth;

            // Update purely for centering if width hasn't changed but viewport has
            if (oldCardWidth === newCardWidth) {
                this.updatePosition(true); // Re-center without teleporting
                return;
            }

            console.log(`🎠 Card width changed: ${oldCardWidth}px → ${newCardWidth}px`);

            // Store current card index
            const cardSpacing = oldCardWidth + this.cardGap;
            const currentCardIndex = Math.round(-this.position / cardSpacing);

            // Update dimensions
            this.cardWidth = newCardWidth;
            this.totalCardsWidth = this.totalCards * (this.cardWidth + this.cardGap);

            // Recalculate position to maintain current card
            const newCardSpacing = this.cardWidth + this.cardGap;
            this.position = -currentCardIndex * newCardSpacing;

            // Update visual position (skip teleport to prevent jumping)
            this.updatePosition(true);
            this.updateCardOpacity();

            console.log(`🎠 Repositioned to card ${currentCardIndex} with new dimensions`);
        }
    }

    // ========================================
    // TOUCH EVENT HANDLERS
    // ========================================

    handleTouchStart(e) {
        // Store initial touch position - don't block yet
        // We'll decide if it's a tap or swipe based on movement
        this.isDragging = false;
        this.isPotentialDrag = true;
        this.velocity = 0;

        const touch = e.touches[0];
        this.startX = touch.clientX;
        this.startY = touch.clientY;
        this.lastX = touch.clientX;
        this.lastTime = Date.now();

        // Cancel any ongoing animation
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        // CRITICAL FIX: Reset snapping flag to re-enable teleportation
        this.isSnapping = false;

        // Don't prevent default yet - let taps work
    }

    handleTouchMove(e) {
        // If potential drag, check if movement threshold exceeded
        if (this.isPotentialDrag && !this.isDragging) {
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - this.startX);
            const deltaY = Math.abs(touch.clientY - this.startY);

            // 10px threshold for swipe vs tap (more forgiving than mouse)
            if (deltaX > 10 || deltaY > 10) {
                // If horizontal movement is dominant, it's a swipe
                if (deltaX > deltaY) {
                    this.isDragging = true;
                    this.isPotentialDrag = false;
                    e.preventDefault(); // Now we can prevent scrolling
                } else {
                    // Vertical scroll - let it through
                    this.isPotentialDrag = false;
                    return;
                }
            } else {
                return; // Not enough movement yet
            }
        }

        if (!this.isDragging) return;
        e.preventDefault();

        const touch = e.touches[0];
        const currentX = touch.clientX;
        const currentTime = Date.now();

        // Calculate delta
        const deltaX = currentX - this.lastX;
        const deltaTime = currentTime - this.lastTime;

        // Update position
        this.position += deltaX;

        // Calculate velocity (pixels per millisecond → pixels per frame)
        if (deltaTime > 0) {
            this.velocity = (deltaX / deltaTime) * 16.67; // Convert to ~60fps
        }

        this.lastX = currentX;
        this.lastTime = currentTime;

        // Update visual position
        this.updatePosition();
        this.updateCardOpacity();
    }

    handleTouchEnd(e) {
        // Reset flags
        const wasDragging = this.isDragging;
        this.isDragging = false;
        this.isPotentialDrag = false;

        // Only apply momentum if we actually dragged
        if (!wasDragging) return;

        e.preventDefault();

        // Cap velocity
        this.velocity = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, this.velocity));

        // Apply momentum
        if (Math.abs(this.velocity) > this.snapThreshold) {
            this.applyMomentum();
        } else {
            this.snapToCard();
        }
    }

    // ========================================
    // MOUSE EVENT HANDLERS (Desktop)
    // ========================================

    handleMouseStart(e) {
        // Check if click is on a card or button - if so, don't intercept
        const target = e.target;
        const isCard = target.closest('.carousel-card');
        const isButton = target.tagName === 'BUTTON' || target.closest('button');

        if (isCard || isButton) {
            // Let the card/button handle the click
            return;
        }

        // Don't start dragging yet - wait for movement
        // This allows clicks to work on cards
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

        // CRITICAL FIX: Reset snapping flag to re-enable teleportation
        this.isSnapping = false;

        // Don't prevent default yet - let clicks work
    }

    handleMouseMove(e) {
        // If potential drag, check if movement threshold exceeded
        if (this.isPotentialDrag && !this.isDragging) {
            const deltaX = Math.abs(e.clientX - this.startX);
            if (deltaX > 5) { // 5px threshold for drag vs click
                this.isDragging = true;
                this.isPotentialDrag = false;
            } else {
                return; // Not enough movement yet
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

        // Prevent text selection during actual drag
        e.preventDefault();
    }

    handleMouseEnd(e) {
        // Reset flags
        const wasDragging = this.isDragging;
        this.isDragging = false;
        this.isPotentialDrag = false;

        // Only apply momentum if we actually dragged
        if (!wasDragging) return;

        this.velocity = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, this.velocity));

        if (Math.abs(this.velocity) > this.snapThreshold) {
            this.applyMomentum();
        } else {
            this.snapToCard();
        }
    }

    // ========================================
    // KEYBOARD SUPPORT
    // ========================================

    handleKeyboard(e) {
        // Arrow keys only if carousel is visible/active
        if (!this.container || this.container.style.display === 'none') return;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.moveToCard(this.currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.moveToCard(this.currentIndex + 1);
        }
    }

    // ========================================
    // MOMENTUM PHYSICS
    // ========================================

    applyMomentum() {
        // Recursive animation loop with friction
        const animate = () => {
            // Apply friction
            this.velocity *= this.friction;

            // Update position
            this.position += this.velocity;

            // Update visuals
            this.updatePosition();
            this.updateCardOpacity();

            // Continue if velocity is significant
            if (Math.abs(this.velocity) > this.minVelocity) {
                this.animationFrame = requestAnimationFrame(animate);
            } else {
                // Momentum depleted - snap to nearest card
                this.snapToCard();
            }
        };

        animate();
    }

    // ========================================
    // SNAP TO CARD
    // ========================================

    snapToCard() {
        // UV7 UPGRADE: Velocity-based multi-card skip (Price is Right wheel physics)
        const cardSpacing = this.cardWidth + this.cardGap;

        // Calculate how many cards to skip based on remaining velocity
        const velocityFactor = Math.abs(this.velocity) / 8; // Scale factor for skip distance
        const cardSkip = Math.floor(velocityFactor); // How many extra cards to skip

        // Get current card position
        const currentCardIndex = Math.round(-this.position / cardSpacing);

        // Calculate target with velocity-based skip
        const direction = this.velocity > 0 ? 1 : -1;
        const targetIndex = currentCardIndex + (cardSkip * direction);

        // Wrap around infinitely (modulo instead of clamping)
        const clampedIndex = ((targetIndex % this.cards.length) + this.cards.length) % this.cards.length;

        // Calculate target position
        const targetPosition = -clampedIndex * cardSpacing;

        console.log(`🎯 Snap: velocity=${this.velocity.toFixed(1)}, skip=${cardSkip} cards, target=${clampedIndex}`);


        // Enable snap mode to prevent teleportation during animation
        this.isSnapping = true;

        // UV7 UPGRADE: Cubic ease-out for buttery smooth snap
        const startPosition = this.position;
        const startTime = performance.now();
        const duration = 400; // ms - smooth but not sluggish

        const snapAnimation = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Cubic ease-out: fast start, smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);

            // Interpolate position
            this.position = startPosition + (targetPosition - startPosition) * eased;

            this.updatePosition(true); // Skip teleport during ease
            this.updateCardOpacity();

            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(snapAnimation);
            } else {
                // Finalize snap
                this.position = targetPosition;
                this.currentIndex = clampedIndex;
                this.isSnapping = false; // Re-enable teleportation

                // ⬇️ IMPORTANT: don't teleport on final snap placement
                this.updatePosition(true);
                this.updateCardOpacity();

                // Haptic feedback on snap (light pulse via sensory system)
                if (this.game && this.game.triggerSensoryFeedback) {
                    this.game.triggerSensoryFeedback('cardSnap', this.cards[clampedIndex], 'Carousel snap');
                } else if (navigator.vibrate) {
                    navigator.vibrate(30);
                }

                // Callback
                if (this.onCardChange) {
                    this.onCardChange(this.currentIndex);
                }

                console.log(`🎯 Snapped to card ${this.currentIndex}`);
            }
        };

        snapAnimation();
    }

    snapToSpecificCard(targetIndex) {
        // Snap to a SPECIFIC card (used by arrow buttons/keyboard)
        // Unlike snapToCard(), this doesn't find the "nearest" - it goes to the exact target
        const cardSpacing = this.cardWidth + this.cardGap;
        const targetPosition = -targetIndex * cardSpacing;

        // Enable snap mode to prevent teleportation during animation
        this.isSnapping = true;

        // UV7 UPGRADE: Cubic ease-out for buttery smooth snap (specific card version)
        const startPosition = this.position;
        const startTime = performance.now();
        const duration = 400; // ms

        const snapAnimation = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Cubic ease-out
            const eased = 1 - Math.pow(1 - progress, 3);

            // Interpolate position
            this.position = startPosition + (targetPosition - startPosition) * eased;

            this.updatePosition(true); // Skip teleport during ease
            this.updateCardOpacity();

            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(snapAnimation);
            } else {
                // Finalize snap
                this.position = targetPosition;
                this.currentIndex = targetIndex;
                this.isSnapping = false; // Re-enable teleportation

                // ⬇️ IMPORTANT: don't teleport on final snap placement
                this.updatePosition(true);
                this.updateCardOpacity();

                // Haptic feedback on snap (light pulse via sensory system)
                if (this.game && this.game.triggerSensoryFeedback) {
                    this.game.triggerSensoryFeedback('cardSnap', this.cards[targetIndex], 'Carousel snap');
                } else if (navigator.vibrate) {
                    navigator.vibrate(30);
                }

                // Callback
                if (this.onCardChange) {
                    this.onCardChange(this.currentIndex);
                }

                console.log(`🎯 Snapped to card ${this.currentIndex}`);
            }
        };

        snapAnimation();
    }

    // ========================================
    // VISUAL UPDATE
    // ========================================

    updatePosition(skipTeleport = false) {
        // Calculate center offset for perfect viewport centering
        let centerOffset = 0;
        if (this.viewport) {
            const viewportWidth = this.viewport.offsetWidth || window.innerWidth;
            centerOffset = (viewportWidth / 2) - (this.cardWidth / 2);
        }

        if (this.container) {
            // Only do infinite-scroll teleport during free scrolling / momentum
            // NOT during initial snap, NOT during resize correction
            if (!this.isSnapping && !skipTeleport) {
                const cardSpacing = this.cardWidth + this.cardGap;
                const positionInCards = -this.position / cardSpacing;

                const middleStart = this.totalCards;          // 10
                const middleEnd = this.totalCards * 2;      // 20

                // Add a tiny buffer so 9.9 / 20.1 don't trigger a teleport
                const buffer = 0.5;

                // Too far right → wrap left
                if (positionInCards > middleEnd + buffer) {
                    this.position += this.totalCardsWidth;
                    const after = -this.position / cardSpacing;
                    console.log(`⏩ Teleported left: posInCards ${positionInCards.toFixed(1)} → ${after.toFixed(1)}`);
                }
                // Too far left → wrap right
                else if (positionInCards < middleStart - buffer) {
                    this.position -= this.totalCardsWidth;
                    const after = -this.position / cardSpacing;
                    console.log(`⏪ Teleported right: posInCards ${positionInCards.toFixed(1)} → ${after.toFixed(1)}`);
                }
            }

            // Apply transform with center offset
            this.container.style.transform = `translateX(${centerOffset + this.position}px)`;
        }
    }

    updateCardOpacity() {
        // Fade adjacent cards for depth perception
        const cardSpacing = this.cardWidth + this.cardGap;

        this.cards.forEach((card, index) => {
            const cardPosition = (index * cardSpacing) + this.position;
            const distance = Math.abs(cardPosition);

            // Center card = full opacity, adjacent = reduced
            let opacity = 1.0;
            if (distance > 50) { // More than 50px from center
                opacity = Math.max(0.4, 1.0 - (distance / cardSpacing) * 0.6);
            }

            card.style.opacity = opacity;

            // Optional: Scale center card slightly larger
            const scale = distance < 50 ? 1.0 : 0.9;
            card.style.transform = `scale(${scale})`;
            card.style.transition = this.isDragging ? 'none' : 'opacity 0.3s ease, transform 0.3s ease';
        });
    }

    // ========================================
    // PUBLIC METHODS
    // ========================================

    moveToCard(index, instant = false) {
        // Programmatic card navigation (keyboard, buttons)
        // Wrap around infinitely
        const clampedIndex = ((index % this.cards.length) + this.cards.length) % this.cards.length;

        if (clampedIndex === this.currentIndex && !instant) return;

        const cardSpacing = this.cardWidth + this.cardGap;
        const targetPosition = -clampedIndex * cardSpacing;

        if (instant) {
            // Instant snap (for initialization)
            this.position = targetPosition;
            this.currentIndex = clampedIndex;
            this.velocity = 0;

            // ⬇️ IMPORTANT: don't teleport on init
            this.updatePosition(true);  // <- skipTeleport = true
            this.updateCardOpacity();

            // Trigger callback
            if (this.onCardChange) {
                this.onCardChange(this.currentIndex);
            }
        } else {
            // Smooth animated transition to target card
            // Stop any current animation
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
            }

            this.velocity = 0;
            this.currentIndex = clampedIndex;

            // Directly snap to the target card with animation
            this.snapToSpecificCard(clampedIndex);
        }
    }

    getCurrentCard() {
        return this.currentIndex;
    }

    destroy() {
        // Cleanup event listeners
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }

        console.log('🎠 CarouselMomentum destroyed');
    }
}

// ========================================
// USAGE EXAMPLE
// ========================================

/*

// HTML Structure:
<div id="carousel-container">
    <div class="carousel-card">Start Game</div>
    <div class="carousel-card">Continue</div>
    <div class="carousel-card">Load Game</div>
    <div class="carousel-card">Settings</div>
    <div class="carousel-card">Credits</div>
</div>

// CSS (Basic):
#carousel-container {
    display: flex;
    gap: 20px;
    overflow: hidden;
    cursor: grab;
}

#carousel-container:active {
    cursor: grabbing;
}

.carousel-card {
    min-width: 400px;
    height: 200px;
    border: 2px solid cyan;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s ease;
}

// JavaScript Initialization:
const carousel = new CarouselMomentum({
    container: document.getElementById('carousel-container'),
    cards: document.querySelectorAll('.carousel-card'),
    friction: 0.95,          // Adjust for feel
    cardWidth: 400,          // Match CSS
    cardGap: 20,             // Match CSS
    onCardChange: (index) => {
        console.log(`Active card: ${index}`);
        // Update UI, button states, etc.
    }
});

*/

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CarouselMomentum;
}
