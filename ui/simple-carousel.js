// ========================================
// SIMPLE CAROUSEL ENGINE (Portrait/Mobile)
// Legacy reliable swipe-based menu
// ========================================

class SimpleCarousel {
    constructor(game, manager) {
        this.game = game;
        this.manager = manager; // Reference to main manager for syncing index
        this.currentIndex = manager.currentIndex || 0;
        this.isAnimating = false;
        this.cards = [];
        this.touchStartX = 0;
        this.touchCurrentX = 0;
        this.isDragging = false;

        // DOM references
        this.carouselContainer = null;
        this.carouselTrack = null;
        this.dotsContainer = null;
        this.prevButton = null;
        this.nextButton = null;

        console.log('📱 Simple Carousel (Portrait) initialized');
    }

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

        console.log(`✅ Simple Carousel ready with ${this.cards.length} cards`);
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
                id: 'settings',
                title: 'SETTINGS',
                subtitle: 'Configure experience',
                icon: '⚙️',
                action: () => this.game.showSettings(),
                background: 'radial-gradient(circle at top, #2a2a1a, #050511)'
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
        const buttonGrid = document.getElementById('menu-buttons-grid');
        if (buttonGrid) buttonGrid.style.display = 'none';

        // Remove existing carousel if any
        const existingCarousel = document.getElementById('menu-carousel');
        if (existingCarousel) existingCarousel.remove();

        // Create carousel container structure (Simple Version)
        const carouselHTML = `
            <div id="menu-carousel" class="menu-carousel simple-mode">
                <div class="carousel-viewport">
                    <div class="carousel-track" id="carousel-track">
                        <!-- Single Card Rendered Here -->
                    </div>
                </div>
                
                <div class="carousel-dots" id="carousel-dots"></div>
                
                <div class="carousel-hint">Swipe to navigate • Tap to select</div>
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

    renderCurrentCard() {
        if (!this.carouselTrack) return;

        const card = this.cards[this.currentIndex];
        if (!card) return;

        this.carouselTrack.innerHTML = '';
        const cardElement = this.createCardElement(card);
        this.carouselTrack.appendChild(cardElement);

        // Animate in
        requestAnimationFrame(() => {
            cardElement.classList.add('card-active');
        });
    }

    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `carousel-card ${card.special ? 'torigatchi-special' : ''} ${card.locked ? 'locked' : ''}`;
        cardDiv.style.background = card.background;

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
                <div class="card-button">${card.icon} SELECT</div>
            `;

            cardDiv.onclick = () => {
                if (navigator.vibrate) navigator.vibrate(10);
                if (card.action) card.action();
            };
        }
        return cardDiv;
    }

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

        this.isAnimating = true;
        const currentCard = this.carouselTrack.querySelector('.carousel-card');

        // Animation classes
        const animClass = direction === 'next' ? 'slide-out-left' :
            direction === 'prev' ? 'slide-out-right' : 'fade-out';

        if (currentCard) {
            currentCard.classList.remove('card-active');
            currentCard.classList.add(animClass);
        }

        this.currentIndex = index;

        // Sync with manager
        if (this.manager) this.manager.updateIndex(this.currentIndex);

        setTimeout(() => {
            this.renderCurrentCard();
            this.updateDots();
            this.isAnimating = false;
        }, 300);
    }

    // Touch Events
    initEventListeners() {
        if (!this.carouselTrack) return;

        this.carouselTrack.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.isDragging = true;
        }, { passive: true });

        this.carouselTrack.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            this.touchCurrentX = e.touches[0].clientX;
            const diff = this.touchCurrentX - this.touchStartX;

            // Visual drag
            const card = this.carouselTrack.querySelector('.carousel-card');
            if (card && Math.abs(diff) < 100) {
                card.style.transform = `translateX(${diff * 0.5}px)`;
            }
        }, { passive: true });

        this.carouselTrack.addEventListener('touchend', (e) => {
            if (!this.isDragging) return;
            const diff = this.touchCurrentX - this.touchStartX;
            const threshold = 50;

            const card = this.carouselTrack.querySelector('.carousel-card');
            if (card) card.style.transform = '';

            if (Math.abs(diff) > threshold) {
                if (diff > 0) this.prev();
                else this.next();
            }

            this.isDragging = false;
        }, { passive: true });
    }

    initKeyboardEvents() { } // Handled by Manager globally usually? Or strict overlap.

    destroy() {
        if (this.carouselContainer) this.carouselContainer.remove();
        console.log('📱 Simple Carousel destroyed');
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimpleCarousel;
}
