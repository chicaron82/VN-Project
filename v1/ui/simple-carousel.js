// ========================================
// SIMPLE CAROUSEL ENGINE (Portrait/Mobile)
// UV7 UPGRADE: Tinder-style card swipe mechanics
// ========================================

class SimpleCarousel {
    constructor(game, manager) {
        this.game = game;
        this.manager = manager; // Reference to main manager for syncing index
        this.currentIndex = manager.currentIndex || 0;
        this.isAnimating = false;
        this.cards = [];

        // Touch/drag state
        this.isDragging = false;
        this.swipeDirection = null; // 'horizontal', 'vertical', or null
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.startTime = 0;

        // Swipe thresholds (UV7 RECOMMENDED VALUES)
        this.DISTANCE_THRESHOLD = 0; // Will be set to 35% of viewport width
        this.VELOCITY_THRESHOLD = 0.5; // pixels per ms (for flicks)
        this.SWIPE_UP_THRESHOLD = 100; // pixels (easy to trigger)
        this.MAX_ROTATION = 8; // degrees (subtle but noticeable)

        // DOM references
        this.carouselContainer = null;
        this.carouselTrack = null;
        this.dotsContainer = null;

        console.log('📱 Simple Carousel (Portrait) initialized - Tinder Mode');
    }

    init() {
        // Define cards based on current menu buttons
        this.defineCards();

        // Build carousel HTML
        this.buildCarouselHTML();

        // Set dynamic threshold based on viewport
        this.DISTANCE_THRESHOLD = window.innerWidth * 0.35; // 35% of screen width

        // Set up event listeners
        this.initEventListeners();

        // Render card stack
        this.renderCardStack();

        // Update dots
        this.updateDots();

        // DIZEE: Show tutorial on first use
        this.showTutorialIfFirstTime();

        console.log(`✅ Simple Carousel ready with ${this.cards.length} cards (Tinder Mode)`);
    }


    defineCards() {
        // Card definitions matching current menu buttons
        this.cards = [
            {
                id: 'settings',
                title: 'SETTINGS',
                subtitle: 'Configure experience',
                icon: '⚙️',
                action: () => this.game.showSettings(),
                background: 'radial-gradient(circle at top, #2a2a1a, #050511)'
            },
            {
                id: 'start',
                title: 'START STORY',
                subtitle: 'Begin Version 848',
                icon: '▶️',
                action: () => this.game.startStory(),
                background: 'radial-gradient(circle at top, #2a2a3a, #050511)'
            },
            {
                id: 'continue',
                title: 'CONTINUE',
                subtitle: `Resume Version ${this.game.loopVersion || 848}`,
                icon: '⏯️',
                action: () => this.game.continueGame(),
                background: 'radial-gradient(circle at top, #2a2a2a, #050511)'
            },
            {
                id: 'load',
                title: 'LOAD GAME',
                subtitle: 'Restore saved timeline',
                icon: '💾',
                action: () => this.game.showSaveLoadScreen('load'),
                background: 'radial-gradient(circle at top, #1a2a1a, #050511)'
            },
            {
                id: 'notes',
                title: 'NOTES',
                subtitle: 'Collected fragments',
                icon: '📝',
                action: () => this.game.openStandaloneNotes(),
                background: 'radial-gradient(circle at top, #1a1a3a, #050511)'
            },
            {
                id: 'torigatchi',
                title: 'TORI-GATCHI',
                subtitle: 'Can you hear me...?',
                icon: '🎮',
                locked: true, // Starts locked
                special: true, // Special visual treatment
                action: () => this.game.openTorigatchiIframe('Tori-Gatchi/index.html'),
                background: 'radial-gradient(circle at top, #0a1a0a, #050511)'
            },
            {
                id: 'credits',
                title: 'CREDITS',
                subtitle: 'The UV7 Crew',
                icon: '⭐',
                action: () => this.game.showCredits(),
                background: 'radial-gradient(circle at top, #1a2a3a, #050511)'
            },
            {
                id: 'crew',
                title: 'MEET THE CREW',
                subtitle: 'United Voices 7',
                icon: '👥',
                action: () => this.game.showMeetTheCrew(),
                background: 'radial-gradient(circle at top, #3a1a2a, #050511)'
            },
            {
                id: 'directors',
                title: 'DIRECTOR\'S CUT',
                subtitle: 'Behind the scenes',
                icon: '🎬',
                action: () => this.game.showDirectorsCut(),
                background: 'radial-gradient(circle at top, #2a1a3a, #050511)'
            },
            {
                id: 'contact',
                title: 'CONTACT',
                subtitle: 'Get in touch',
                icon: '📧',
                action: () => this.game.showContact(),
                background: 'radial-gradient(circle at top, #1a3a2a, #050511)'
            }
        ];

        // Check Tori-Gatchi unlock status
        this.checkToriGatchiUnlock();
    }

    checkToriGatchiUnlock() {
        const unlocked = localStorage.getItem('torigatchi_unlocked') === 'true';
        const card = this.cards.find(c => c.id === 'torigatchi');
        if (card) {
            card.locked = !unlocked;
        }
    }

    buildCarouselHTML() {
        // Find main menu container
        const mainMenuContent = document.getElementById('main-menu-content');
        if (!mainMenuContent) return;

        // 🛡️ Hide legacy button grid explicitly


        // Remove existing carousel if any
        const existingCarousel = document.getElementById('menu-carousel');
        if (existingCarousel) existingCarousel.remove();

        // Create carousel container structure (Tinder Mode)
        const carouselHTML = `
            <div id="menu-carousel" class="menu-carousel simple-mode tinder-mode">
                <div class="carousel-viewport">
                    <div class="carousel-track" id="carousel-track">
                        <!-- Card stack rendered here -->
                    </div>
                </div>
                
                <div class="carousel-dots" id="carousel-dots"></div>
                
                <div class="carousel-hint">
                    <span class="hint-swipe">← Swipe → to browse</span>
                    <span class="hint-confirm">↑ Swipe up to select</span>
                </div>
            </div>
        `;

        // Insert
        const subtitle = mainMenuContent.querySelector('.subtitle');
        if (subtitle) {
            subtitle.insertAdjacentHTML('afterend', carouselHTML);
        } else {
            mainMenuContent.innerHTML += carouselHTML;
        }

        // Cache DOM
        this.carouselContainer = document.getElementById('menu-carousel');
        this.carouselTrack = document.getElementById('carousel-track');
        this.dotsContainer = document.getElementById('carousel-dots');

        // Generate dots
        this.generateDots();
    }

    generateDots() {
        if (!this.dotsContainer) return;
        this.dotsContainer.innerHTML = '';

        this.cards.forEach((card, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            if (index === this.currentIndex) dot.classList.add('active');

            dot.addEventListener('click', () => {
                if (!this.isAnimating) this.goToCard(index);
            });
            this.dotsContainer.appendChild(dot);
        });
    }

    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // ========================================
    // CARD STACK RENDERING
    // ========================================

    renderCardStack() {
        if (!this.carouselTrack) return;

        this.carouselTrack.innerHTML = '';

        // Render 3 cards: prev (hidden), current, next
        const indices = [
            this.getPrevIndex(),
            this.currentIndex,
            this.getNextIndex()
        ];

        indices.forEach((index, stackPosition) => {
            const card = this.createCardElement(this.cards[index], stackPosition);
            this.carouselTrack.appendChild(card);
        });
    }

    createCardElement(card, stackPosition) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `carousel-card ${card.special ? 'torigatchi-special' : ''} ${card.locked ? 'locked' : ''}`;
        cardDiv.style.background = card.background;
        cardDiv.dataset.stackPosition = stackPosition;

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

        if (card.locked) {
            cardDiv.innerHTML = `
                <div class="card-lock-overlay">
                    <div class="lock-icon">🔒</div>
                    <div class="lock-title">${card.title}</div>
                    <div class="lock-text">LOCKED</div>
                </div>
            `;
        } else {
            cardDiv.innerHTML = `
                <div class="card-icon">${card.icon}</div>
                <h2 class="card-title">${card.title}</h2>
                <p class="card-subtitle">${card.subtitle}</p>
                <div class="card-button">${card.icon} TAP TO SELECT</div>
                
                <!-- DIZEE: Tap zones for left/right navigation -->
                <div class="tap-zone tap-zone-left" data-action="prev"></div>
                <div class="tap-zone tap-zone-right" data-action="next"></div>
            `;

            // DIZEE: Handle tap navigation (only on current card)
            if (stackPosition === 1) {
                cardDiv.onclick = (e) => {
                    // Only trigger if not dragging
                    if (this.isDragging || this.isAnimating) return;

                    // Check if tapped on a tap zone
                    const tapZone = e.target.closest('.tap-zone');
                    if (tapZone) {
                        e.stopPropagation();
                        if (navigator.vibrate) navigator.vibrate(10);

                        if (tapZone.dataset.action === 'prev') {
                            this.goToCard(this.getPrevIndex());
                        } else if (tapZone.dataset.action === 'next') {
                            this.goToCard(this.getNextIndex());
                        }

                        // Dismiss tutorial if shown
                        this.dismissTutorial();
                        return;
                    }

                    // Center tap - trigger card action
                    if (navigator.vibrate) navigator.vibrate(10);
                    if (card.action) card.action();

                    // Dismiss tutorial if shown
                    this.dismissTutorial();
                };
            }
        }

        return cardDiv;
    }


    getPrevIndex() {
        return (this.currentIndex - 1 + this.cards.length) % this.cards.length;
    }

    getNextIndex() {
        return (this.currentIndex + 1) % this.cards.length;
    }

    getCurrentCardElement() {
        return this.carouselTrack.querySelector('[data-stack-position="1"]');
    }

    getNextCardElement() {
        return this.carouselTrack.querySelector('[data-stack-position="2"]');
    }

    // ========================================
    // TOUCH EVENT HANDLERS
    // ========================================

    initEventListeners() {
        if (!this.carouselTrack) return;

        this.carouselTrack.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e);
        }, { passive: true });

        this.carouselTrack.addEventListener('touchmove', (e) => {
            this.handleTouchMove(e);
        }, { passive: false });

        this.carouselTrack.addEventListener('touchend', (e) => {
            this.handleTouchEnd(e);
        }, { passive: true });
    }

    handleTouchStart(e) {
        if (this.isAnimating) return;

        const touch = e.touches[0];
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

    handleTouchMove(e) {
        const touch = e.touches[0];
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

    handleTouchEnd(e) {
        if (!this.isDragging) return;

        const deltaX = this.currentX - this.startX;
        const deltaY = this.currentY - this.startY;
        const deltaTime = Date.now() - this.startTime;
        const velocityX = Math.abs(deltaX) / deltaTime;

        if (this.swipeDirection === 'horizontal') {
            // Check commit threshold
            if (Math.abs(deltaX) > this.DISTANCE_THRESHOLD || velocityX > this.VELOCITY_THRESHOLD) {
                this.commitSwipe(deltaX > 0 ? 'right' : 'left', velocityX);  // ZEE: Pass velocity for dynamic timing
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

    // ========================================
    // DRAG UPDATES
    // ========================================

    updateCardDrag(deltaX) {
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
        currentCard.style.transform = `
            translateX(${deltaX}px) 
            rotate(${clampedRotation}deg)
        `;
        currentCard.style.opacity = opacity;

        // Reveal next card
        const nextScale = 0.95 + (dragProgress * 0.05);
        const nextOpacity = 0.7 + (dragProgress * 0.3);
        const nextY = 10 - (dragProgress * 10);

        nextCard.style.transform = `scale(${nextScale}) translateY(${nextY}px)`;
        nextCard.style.opacity = nextOpacity;
    }

    updateConfirmDrag(deltaY) {
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

    // ========================================
    // COMMIT / SPRING-BACK
    // ========================================

    commitSwipe(direction, velocityX = 0) {  // ZEE: Accept velocity parameter
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
        }, 300);
    }

    springBack() {
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

    confirmCurrentCard() {
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
            const card = this.cards[this.currentIndex];
            if (card.action) card.action();
            this.isAnimating = false;
        }, 200);
    }

    // ========================================
    // NAVIGATION
    // ========================================

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        if (this.manager) this.manager.updateIndex(this.currentIndex);
        this.updateDots();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        if (this.manager) this.manager.updateIndex(this.currentIndex);
        this.updateDots();
    }

    goToCard(index) {
        if (index === this.currentIndex) return;

        this.currentIndex = index;
        if (this.manager) this.manager.updateIndex(this.currentIndex);
        this.renderCardStack();
        this.updateDots();
    }

    destroy() {
        if (this.carouselContainer) this.carouselContainer.remove();
        this.dismissTutorial(); // Clean up tutorial if shown
        console.log('📱 Simple Carousel destroyed');
    }

    // ========================================
    // TUTORIAL OVERLAY (DIZEE)
    // Shows animated finger hint on first use
    // ========================================

    showTutorialIfFirstTime() {
        const dismissedValue = localStorage.getItem('carouselTutorialDismissed');
        const tutorialDismissed = dismissedValue === 'true';

        console.log('👆 Tutorial check:', {
            dismissedValue,
            tutorialDismissed,
            willShow: !tutorialDismissed,
            carouselContainer: !!this.carouselContainer
        });

        if (tutorialDismissed) {
            console.log('👆 Tutorial skipped - already dismissed');
            return;
        }

        console.log('👆 Creating tutorial overlay...');

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
            if (e.target.classList.contains('tutorial-dismiss-btn') ||
                e.target.classList.contains('carousel-tutorial-overlay')) {
                this.dismissTutorial();
            }
        });

        // Append to carousel
        if (this.carouselContainer) {
            this.carouselContainer.appendChild(this.tutorialOverlay);
        }

        console.log('👆 Tutorial overlay shown');
    }

    dismissTutorial() {
        if (this.tutorialOverlay) {
            this.tutorialOverlay.classList.add('dismissing');
            setTimeout(() => {
                if (this.tutorialOverlay && this.tutorialOverlay.parentElement) {
                    this.tutorialOverlay.remove();
                }
                this.tutorialOverlay = null;
            }, 300);

            // Remember dismissal
            localStorage.setItem('carouselTutorialDismissed', 'true');
            console.log('👆 Tutorial dismissed');
        }
    }
}


// Global assignment for browser
if (typeof window !== 'undefined') {
    window.SimpleCarousel = SimpleCarousel;
}

// ES Module export
export { SimpleCarousel };
