// ========================================
// MENU CAROUSEL SYSTEM
// Rolling card-based main menu
// 🖤💚🔥💀 Built by UV7 Crew
// ========================================

class MenuCarousel {
    constructor(game) {
        this.game = game;
        this.currentIndex = 0;
        this.isAnimating = false;
        this.cards = [];
        this.touchStartX = 0;
        this.touchCurrentX = 0;
        this.isDragging = false;
        
        // DOM references (will be created)
        this.carouselContainer = null;
        this.carouselTrack = null;
        this.dotsContainer = null;
        this.prevButton = null;
        this.nextButton = null;
        
        console.log('🎠 Menu Carousel initialized');
    }
    
    // ========================================
    // INITIALIZATION
    // ========================================
    
    init() {
        // Define cards based on current menu buttons
        this.defineCards();
        
        // Build carousel HTML
        this.buildCarouselHTML();
        
        // Set up event listeners
        this.initEventListeners();
        
        // Render initial card
        this.renderCurrentCard();
        
        // Update dots
        this.updateDots();
        
        console.log(`✅ Carousel ready with ${this.cards.length} cards`);
    }
    
    defineCards() {
        // Card definitions matching current menu buttons
        this.cards = [
            {
                id: 'start',
                title: 'START STORY',
                subtitle: 'Begin Version 848',
                icon: '▶️',
                action: () => this.game.startStory(),
                background: 'linear-gradient(135deg, #1a1a2a 0%, #2a1a3a 100%)'
            },
            {
                id: 'continue',
                title: 'CONTINUE',
                subtitle: `Resume Version ${this.game.loopVersion || 848}`,
                icon: '⏯️',
                action: () => this.game.continueGame(),
                background: 'linear-gradient(135deg, #2a1a1a 0%, #3a2a1a 100%)'
            },
            {
                id: 'load',
                title: 'LOAD GAME',
                subtitle: 'Restore saved timeline',
                icon: '💾',
                action: () => this.game.showSaveLoadScreen('load'),
                background: 'linear-gradient(135deg, #1a2a1a 0%, #2a3a1a 100%)'
            },
            {
                id: 'notes',
                title: 'NOTES',
                subtitle: 'Collected fragments',
                icon: '📝',
                action: () => this.game.openStandaloneNotes(),
                background: 'linear-gradient(135deg, #1a1a3a 0%, #1a2a4a 100%)'
            },
            {
                id: 'torigatchi',
                title: 'TORI-GATCHI',
                subtitle: 'Can you hear me...?',
                icon: '🎮',
                locked: true, // Starts locked
                special: true, // Special visual treatment
                action: () => this.game.openTorigatchiIframe('Tori-Gatchi/index.html'),
                background: 'linear-gradient(135deg, #0a1a0a 0%, #1a2a1a 100%)'
            },
            {
                id: 'settings',
                title: 'SETTINGS',
                subtitle: 'Configure experience',
                icon: '⚙️',
                action: () => this.game.showSettings(),
                background: 'linear-gradient(135deg, #2a2a1a 0%, #3a3a1a 100%)'
            },
            {
                id: 'credits',
                title: 'CREDITS',
                subtitle: 'The UV7 Crew',
                icon: '⭐',
                action: () => this.game.showCredits(),
                background: 'linear-gradient(135deg, #1a2a3a 0%, #2a3a4a 100%)'
            },
            {
                id: 'crew',
                title: 'MEET THE CREW',
                subtitle: 'United Voices 7',
                icon: '👥',
                action: () => this.game.showMeetTheCrew(),
                background: 'linear-gradient(135deg, #3a1a2a 0%, #4a2a3a 100%)'
            },
            {
                id: 'directors',
                title: 'DIRECTOR\'S CUT',
                subtitle: 'Behind the scenes',
                icon: '🎬',
                action: () => this.game.showDirectorsCut(),
                background: 'linear-gradient(135deg, #2a1a3a 0%, #3a1a4a 100%)'
            },
            {
                id: 'contact',
                title: 'CONTACT',
                subtitle: 'Get in touch',
                icon: '📧',
                action: () => this.game.showContact(),
                background: 'linear-gradient(135deg, #1a3a2a 0%, #1a4a3a 100%)'
            }
        ];
        
        // Check Tori-Gatchi unlock status
        this.checkToriGatchiUnlock();
    }
    
    checkToriGatchiUnlock() {
        // Check if Tori-Gatchi should be unlocked
        const unlocked = localStorage.getItem('torigatchi_unlocked') === 'true';
        const card = this.cards.find(c => c.id === 'torigatchi');
        if (card) {
            card.locked = !unlocked;
        }
    }
    
    // ========================================
    // HTML CONSTRUCTION
    // ========================================
    
    buildCarouselHTML() {
        // Find main menu container
        const mainMenu = document.getElementById('main-menu');
        const mainMenuContent = document.getElementById('main-menu-content');
        
        if (!mainMenuContent) {
            console.error('Main menu content not found!');
            return;
        }
        
        // Hide original button grid
        const buttonGrid = document.getElementById('menu-buttons-grid');
        if (buttonGrid) {
            buttonGrid.style.display = 'none';
        }
        
        // Create carousel container
        const carouselHTML = `
            <div id="menu-carousel" class="menu-carousel">
                <!-- Navigation Arrows -->
                <button class="carousel-arrow carousel-prev" id="carousel-prev" aria-label="Previous">
                    <span>◀</span>
                </button>
                
                <!-- Carousel Viewport -->
                <div class="carousel-viewport">
                    <div class="carousel-track" id="carousel-track">
                        <!-- Cards will be rendered here -->
                    </div>
                </div>
                
                <button class="carousel-arrow carousel-next" id="carousel-next" aria-label="Next">
                    <span>▶</span>
                </button>
                
                <!-- Dot Navigation -->
                <div class="carousel-dots" id="carousel-dots">
                    <!-- Dots generated dynamically -->
                </div>
                
                <!-- Keyboard Hint -->
                <div class="carousel-hint">◀ ▶ to navigate • ENTER to select • ESC to pause</div>
            </div>
        `;
        
        // Insert after subtitle (before button grid position)
        const subtitle = mainMenuContent.querySelector('.subtitle');
        if (subtitle) {
            subtitle.insertAdjacentHTML('afterend', carouselHTML);
        }
        
        // Cache DOM references
        this.carouselContainer = document.getElementById('menu-carousel');
        this.carouselTrack = document.getElementById('carousel-track');
        this.dotsContainer = document.getElementById('carousel-dots');
        this.prevButton = document.getElementById('carousel-prev');
        this.nextButton = document.getElementById('carousel-next');
        
        // Generate dots
        this.generateDots();
    }
    
    generateDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        
        this.cards.forEach((card, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to ${card.title}`);
            dot.dataset.index = index;
            
            // Add icon hint
            const hint = document.createElement('span');
            hint.className = 'dot-hint';
            hint.textContent = card.icon;
            dot.appendChild(hint);
            
            // Add locked indicator
            if (card.locked) {
                dot.classList.add('locked');
                hint.textContent = '🔒';
            }
            
            // Click handler
            dot.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.goToCard(index);
                }
            });
            
            this.dotsContainer.appendChild(dot);
        });
    }
    
    // ========================================
    // CARD RENDERING
    // ========================================
    
    renderCurrentCard() {
        if (!this.carouselTrack) return;
        
        const card = this.cards[this.currentIndex];
        if (!card) return;
        
        // Clear track
        this.carouselTrack.innerHTML = '';
        
        // Create card element
        const cardElement = this.createCardElement(card);
        this.carouselTrack.appendChild(cardElement);
        
        // Trigger entrance animation
        requestAnimationFrame(() => {
            cardElement.classList.add('card-active');
        });
    }
    
    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `carousel-card ${card.special ? 'torigatchi-special' : ''} ${card.locked ? 'locked' : ''}`;
        cardDiv.style.background = card.background;

        if (card.locked) {
            // Locked card display (not clickable)
            cardDiv.innerHTML = `
                <div class="card-lock-overlay">
                    <div class="lock-icon">🔒</div>
                    <div class="lock-title">${card.title}</div>
                    <div class="lock-text">LOCKED</div>
                    <div class="lock-hint">Complete a route to unlock</div>
                </div>
            `;
        } else {
            // Normal card display
            cardDiv.innerHTML = `
                <div class="card-icon">${card.icon}</div>
                <h2 class="card-title">${card.title}</h2>
                <p class="card-subtitle">${card.subtitle}</p>
                <button class="card-button" id="card-action-btn">
                    ${card.icon} ${card.title}
                </button>
            `;

            // Make entire card clickable with haptic feedback
            cardDiv.style.cursor = 'pointer';
            cardDiv.addEventListener('click', () => {
                // Haptic feedback on card press
                if (navigator.vibrate) {
                    navigator.vibrate(10); // Short 10ms vibration
                }
                if (card.action) {
                    card.action();
                }
            });

            // Button still works too (for keyboard users)
            const actionButton = cardDiv.querySelector('#card-action-btn');
            if (actionButton && card.action) {
                actionButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent double-firing
                    // Haptic feedback on button press
                    if (navigator.vibrate) {
                        navigator.vibrate(10); // Short 10ms vibration
                    }
                    card.action();
                });
            }
        }

        return cardDiv;
    }
    
    // ========================================
    // NAVIGATION
    // ========================================
    
    next() {
        if (this.isAnimating) return;
        
        const nextIndex = (this.currentIndex + 1) % this.cards.length;
        this.goToCard(nextIndex, 'next');
    }
    
    prev() {
        if (this.isAnimating) return;
        
        const prevIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.goToCard(prevIndex, 'prev');
    }
    
    goToCard(index, direction = null) {
        if (this.isAnimating || index === this.currentIndex) return;
        if (index < 0 || index >= this.cards.length) return;
        
        this.isAnimating = true;
        
        // Get current card element
        const currentCard = this.carouselTrack.querySelector('.carousel-card');
        
        // Determine animation direction
        const animClass = direction === 'next' ? 'slide-out-left' : 
                         direction === 'prev' ? 'slide-out-right' : 
                         'fade-out';
        
        // Animate out current card
        if (currentCard) {
            currentCard.classList.remove('card-active');
            currentCard.classList.add(animClass);
        }
        
        // Update index
        this.currentIndex = index;
        
        // Wait for animation, then render new card
        setTimeout(() => {
            this.renderCurrentCard();
            this.updateDots();
            this.updateArrows();
            this.isAnimating = false;
        }, 300);
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
    
    updateArrows() {
        // Always enable arrows (wraps around)
        if (this.prevButton) this.prevButton.disabled = false;
        if (this.nextButton) this.nextButton.disabled = false;
    }
    
    activateCurrentCard() {
        const card = this.cards[this.currentIndex];
        if (card && !card.locked && card.action) {
            card.action();
        }
    }
    
    // ========================================
    // EVENT LISTENERS
    // ========================================
    
    initEventListeners() {
        // Arrow buttons
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.prev());
        }
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.next());
        }
        
        // Keyboard navigation
        this.initKeyboardEvents();
        
        // Touch/swipe gestures
        this.initTouchEvents();
        
        // Focus management
        this.initFocusEvents();
    }
    
    initKeyboardEvents() {
        // Only listen when carousel is visible
        document.addEventListener('keydown', (e) => {
            // Check if main menu is active
            const mainMenu = document.getElementById('main-menu');
            if (!mainMenu || mainMenu.style.display === 'none') return;
            if (this.isAnimating) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prev();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.next();
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.activateCurrentCard();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToCard(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToCard(this.cards.length - 1);
                    break;
            }
        });
    }
    
    initTouchEvents() {
        if (!this.carouselTrack) return;
        
        this.carouselTrack.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.isDragging = true;
        }, { passive: true });
        
        this.carouselTrack.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            this.touchCurrentX = e.touches[0].clientX;
            
            // Visual drag feedback (optional - can be removed for simpler behavior)
            const diff = this.touchCurrentX - this.touchStartX;
            const card = this.carouselTrack.querySelector('.carousel-card');
            if (card && Math.abs(diff) < 100) {
                card.style.transform = `translateX(${diff * 0.3}px)`;
            }
        }, { passive: true });
        
        this.carouselTrack.addEventListener('touchend', (e) => {
            if (!this.isDragging) return;
            
            const diff = this.touchCurrentX - this.touchStartX;
            const threshold = 50;
            
            // Reset transform
            const card = this.carouselTrack.querySelector('.carousel-card');
            if (card) {
                card.style.transform = '';
            }
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.prev(); // Swipe right = previous
                } else {
                    this.next(); // Swipe left = next
                }
            }
            
            this.isDragging = false;
            this.touchStartX = 0;
            this.touchCurrentX = 0;
        }, { passive: true });
    }
    
    initFocusEvents() {
        // When carousel gains focus, highlight current card
        if (this.carouselContainer) {
            this.carouselContainer.addEventListener('focus', () => {
                const card = this.carouselTrack.querySelector('.carousel-card');
                if (card) card.classList.add('keyboard-focus');
            }, true);
            
            this.carouselContainer.addEventListener('blur', () => {
                const card = this.carouselTrack.querySelector('.carousel-card');
                if (card) card.classList.remove('keyboard-focus');
            }, true);
        }
    }
    
    // ========================================
    // UNLOCK SYSTEM
    // ========================================
    
    unlockToriGatchi() {
        const card = this.cards.find(c => c.id === 'torigatchi');
        if (!card || !card.locked) return; // Already unlocked
        
        console.log('🎮 Unlocking Tori-Gatchi card...');
        
        card.locked = false;
        localStorage.setItem('torigatchi_unlocked', 'true');
        
        // Show unlock notification
        this.showUnlockNotification();
        
        // After notification, scroll to new card
        setTimeout(() => {
            const newIndex = this.cards.findIndex(c => c.id === 'torigatchi');
            if (newIndex !== -1) {
                this.goToCard(newIndex);
                
                // Pulse the card
                setTimeout(() => {
                    const card = this.carouselTrack.querySelector('.carousel-card');
                    if (card) {
                        card.classList.add('just-unlocked');
                        setTimeout(() => card.classList.remove('just-unlocked'), 1000);
                    }
                }, 350);
            }
        }, 2000);
        
        // Update dots
        this.generateDots();
    }
    
    showUnlockNotification() {
        const notification = document.createElement('div');
        notification.className = 'unlock-notification';
        notification.innerHTML = `
            <div class="unlock-content">
                <div class="unlock-icon">🎮</div>
                <div class="unlock-text">NEW CONTENT UNLOCKED</div>
                <div class="unlock-subtitle">TORI-GATCHI</div>
                <div class="unlock-hint">Gateway to another story...</div>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Glitch-in effect
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Fade out and remove
        setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }
    
    // ========================================
    // UTILITY
    // ========================================
    
    destroy() {
        // Clean up event listeners if needed
        console.log('🎠 Carousel destroyed');
    }
}

// ========================================
// EXPORT
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MenuCarousel;
}
