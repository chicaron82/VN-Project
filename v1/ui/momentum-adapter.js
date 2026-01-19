// ========================================
// MOMENTUM CAROUSEL ADAPTER (Landscape/Desktop)
// Wrapper for the physics-based infinite scroll engine
// ========================================

class MomentumAdapter {
    constructor(game, manager) {
        this.game = game;
        this.manager = manager;
        this.currentIndex = manager.currentIndex || 0;
        this.cards = [];

        // DOM references
        this.carouselContainer = null;
        this.carouselTrack = null;
        this.carouselViewport = null;
        this.dotsContainer = null;
        this.prevButton = null;
        this.nextButton = null;

        // Physics Engine
        this.momentumEngine = null;

        console.log('🖥️ Momentum Adapter (Landscape) initialized');
    }

    init() {
        if (typeof CarouselMomentum === 'undefined') {
            console.error('❌ CarouselMomentum class not found!');
            return;
        }

        this.defineCards();
        this.buildCarouselHTML();
        this.initMomentumEngine();
        this.initEventListeners();
        this.updateDots();

        console.log(`✅ Momentum Adapter ready`);
    }

    defineCards() {
        // MATCHING DEFINITIONS for consistency
        this.cards = [
            { id: 'settings', title: 'SETTINGS', subtitle: 'Configure experience', icon: '⚙️', action: () => this.game.showSettings(), background: 'radial-gradient(circle at top, #202020, #050511)' },
            { id: 'start', title: 'START STORY', subtitle: 'Begin Version 848', icon: '▶️', action: () => this.game.startStory(), background: 'radial-gradient(circle at top, #202030, #050511)' },
            { id: 'continue', title: 'CONTINUE', subtitle: `Resume Version ${this.game.loopVersion || 848}`, icon: '⏯️', action: () => this.game.continueGame(), background: 'radial-gradient(circle at top, #202025, #050511)' },
            { id: 'load', title: 'LOAD GAME', subtitle: 'Restore saved timeline', icon: '💾', action: () => this.game.showSaveLoadScreen('load'), background: 'radial-gradient(circle at top, #102010, #050511)' },
            { id: 'notes', title: 'NOTES', subtitle: 'Collected fragments', icon: '📝', action: () => this.game.openStandaloneNotes(), background: 'radial-gradient(circle at top, #101030, #050511)' },
            { id: 'torigatchi', title: 'TORI-GATCHI', subtitle: 'Can you hear me...?', icon: '🎮', locked: true, special: true, action: () => this.game.openTorigatchiIframe('Tori-Gatchi/index.html'), background: 'radial-gradient(circle at top, #0a1a0a, #050511)' },
            { id: 'credits', title: 'CREDITS', subtitle: 'The UV7 Crew', icon: '⭐', action: () => this.game.showCredits(), background: 'radial-gradient(circle at top, #102030, #050511)' },
            { id: 'crew', title: 'MEET THE CREW', subtitle: 'United Voices 7', icon: '👥', action: () => this.game.showMeetTheCrew(), background: 'radial-gradient(circle at top, #301020, #050511)' },
            { id: 'directors', title: 'DIRECTOR\'S CUT', subtitle: 'Behind the scenes', icon: '🎬', action: () => this.game.showDirectorsCut(), background: 'radial-gradient(circle at top, #201030, #050511)' },
            { id: 'contact', title: 'CONTACT', subtitle: 'Get in touch', icon: '📧', action: () => this.game.showContact(), background: 'radial-gradient(circle at top, #103020, #050511)' }
        ];

        // Sync Lock State
        const unlocked = localStorage.getItem('torigatchi_unlocked') === 'true';
        const card = this.cards.find(c => c.id === 'torigatchi');
        if (card) card.locked = !unlocked;
    }

    buildCarouselHTML() {
        const mainMenuContent = document.getElementById('main-menu-content');
        if (!mainMenuContent) return;

        // 🛡️ Hide legacy button grid explicitly
        const buttonGrid = document.getElementById('menu-buttons-grid');
        if (buttonGrid) buttonGrid.style.display = 'none';

        const existing = document.getElementById('menu-carousel');
        if (existing) existing.remove();

        const carouselHTML = `
            <div id="menu-carousel" class="menu-carousel momentum-mode">
                <button class="carousel-arrow carousel-prev" id="carousel-prev"><span>◀</span></button>
                <div class="carousel-viewport" id="carousel-viewport">
                    <div class="carousel-track" id="carousel-track"></div>
                </div>
                <button class="carousel-arrow carousel-next" id="carousel-next"><span>▶</span></button>
                <div class="carousel-dots" id="carousel-dots"></div>
                <div class="carousel-hint">Scroll to navigate • Tap to select</div>
            </div>
        `;

        const subtitle = mainMenuContent.querySelector('.subtitle');
        if (subtitle) subtitle.insertAdjacentHTML('afterend', carouselHTML);
        else mainMenuContent.innerHTML += carouselHTML;

        this.carouselContainer = document.getElementById('menu-carousel');
        this.carouselTrack = document.getElementById('carousel-track');
        this.carouselViewport = document.getElementById('carousel-viewport');
        this.dotsContainer = document.getElementById('carousel-dots');
        this.prevButton = document.getElementById('carousel-prev');
        this.nextButton = document.getElementById('carousel-next');

        // Render 3x Cloned Cards
        const cardSets = [this.cards, this.cards, this.cards]; // Left, Middle, Right

        cardSets.flat().forEach((card, index) => {
            const el = this.createCardElement(card, index);
            this.carouselTrack.appendChild(el);
        });

        this.generateDots();
    }

    createCardElement(card, index) {
        const div = document.createElement('div');
        div.className = `carousel-card ${card.special ? 'torigatchi-special' : ''} ${card.locked ? 'locked' : ''}`;
        div.style.background = card.background;
        div.dataset.realIndex = index % this.cards.length;

        if (card.locked) {
            div.innerHTML = `
                <div class="card-lock-overlay">
                    <div class="lock-icon">🔒</div>
                    <div class="lock-title">${card.title}</div>
                    <div class="lock-text">LOCKED</div>
                </div>`;
        } else {
            div.innerHTML = `
                <div class="card-icon">${card.icon}</div>
                <h2 class="card-title">${card.title}</h2>
                <p class="card-subtitle">${card.subtitle}</p>
                <button class="card-button">${card.icon} SELECT</button>
            `;

            // Interaction
            div.onclick = (e) => {
                if (!this.momentumEngine || this.momentumEngine.isDragging) return;
                // If clicked card is NOT centered, center it first
                const current = this.momentumEngine.getCurrentCard();
                // We need to check if this specific element index matches current moment index
                // But MomentumEngine handles the 'visual' index. 
                // Simple check for now: just trigger action if valid
                if (card.action) {
                    if (navigator.vibrate) navigator.vibrate(10);
                    card.action();
                }
            };
        }
        return div;
    }

    generateDots() {
        this.dotsContainer.innerHTML = '';
        this.cards.forEach((card, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            if (index === this.currentIndex) dot.classList.add('active');
            dot.onclick = () => this.moveToCard(index);
            this.dotsContainer.appendChild(dot);
        });
    }

    initMomentumEngine() {
        const cardElements = this.carouselTrack.querySelectorAll('.carousel-card');
        const firstCard = cardElements[0];
        // Wait for render? No, usually fine in landscape, or use fallback
        const cardWidth = firstCard ? (firstCard.offsetWidth || 400) : 400;

        this.momentumEngine = new CarouselMomentum({
            container: this.carouselTrack,
            cards: cardElements,
            cardWidth: cardWidth,
            cardGap: 20,
            friction: 0.975,  // ZEE'S TUNE-UP: Price Is Right spin (was 0.965)
            viewport: this.carouselViewport,
            totalCards: this.cards.length,
            onCardChange: (index) => {
                const realIndex = index % this.cards.length;
                this.currentIndex = realIndex;
                if (this.manager) this.manager.updateIndex(realIndex);
                this.updateDots();
                this.updateArrows();
            }
        });

        // JUMP TO START
        // Target index in middle set
        const middleOffset = this.cards.length;
        const targetIndex = middleOffset + this.currentIndex;
        this.momentumEngine.moveToCard(targetIndex, true);
    }

    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === this.currentIndex);
        });
    }

    updateArrows() { } // Not strictly needed as momentum handles this, but could dim them

    moveToCard(index) {
        if (!this.momentumEngine) return;
        // Find nearest index in current loop relative to position is hard 
        // Just let momentum engine handle wrapping via its moveToCard
        // We need to map real index to momentum index logic... 
        // Actually MomentumEngine.moveToCard takes a raw index, but wraps internally.
        // It's safer to let user select ANY valid matching index.
        // For simplicity, we just pass the desired Real Index + one set length (Middle Set)
        this.momentumEngine.moveToCard(this.cards.length + index);
    }

    next() {
        if (this.momentumEngine) this.momentumEngine.moveToCard(this.momentumEngine.currentIndex + 1);
    }

    prev() {
        if (this.momentumEngine) this.momentumEngine.moveToCard(this.momentumEngine.currentIndex - 1);
    }

    initEventListeners() {
        this.prevButton.onclick = () => this.prev();
        this.nextButton.onclick = () => this.next();

        // Keyboard etc handled by manager?
    }

    destroy() {
        if (this.momentumEngine) this.momentumEngine.destroy();
        if (this.carouselContainer) this.carouselContainer.remove();
        console.log('🖥️ Momentum Adapter destroyed');
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.MomentumAdapter = MomentumAdapter;
}

// ES Module export
export { MomentumAdapter };
