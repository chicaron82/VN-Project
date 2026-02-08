// ========================================
// MENU CAROUSEL MANAGER
// Hybrid System: Switches between Simple (Portrait) & Momentum (Landscape)
// ========================================

class MenuCarousel {
    constructor(game) {
        this.game = game;
        this.currentIndex = 1; // Start at Index 1 (Start Story) because settings is now Index 0
        this.activeEngine = null; // Current adapter
        this.resizeTimeout = null;

        console.log('🎠 MenuCarousel Manager initialized - Hybrid Mode');
    }

    init() {
        // Dependencies check
        if (typeof SimpleCarousel === 'undefined' || typeof MomentumAdapter === 'undefined') {
            console.error('❌ Missing required adapters! Load simple-carousel.js and momentum-adapter.js');
            return;
        }

        // Initial setup
        this.setupHybridMode();



        // Listen for resize to switch modes
        this.resizeListener = () => this.handleResize();
        window.addEventListener('resize', this.resizeListener);
    }

    setupHybridMode() {
        const isPortrait = window.innerWidth < 768;
        const desiredEngine = isPortrait ? 'SimpleCarousel' : 'MomentumAdapter';
        const currentEngineName = this.activeEngine ? this.activeEngine.constructor.name : null;

        // Only switch if different
        if (desiredEngine !== currentEngineName) {
            console.log(`🔄 Switching Carousel Mode: ${currentEngineName || 'None'} -> ${desiredEngine}`);

            // Destroy current
            if (this.activeEngine) {
                this.activeEngine.destroy();
            }

            // Init new
            if (isPortrait) {
                this.activeEngine = new SimpleCarousel(this.game, this);
            } else {
                this.activeEngine = new MomentumAdapter(this.game, this);
            }

            this.activeEngine.init();
        }
    }

    handleResize() {
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.setupHybridMode();
        }, 100);
    }

    // Callback from engines to update shared state
    updateIndex(index) {
        this.currentIndex = index;
    }

    // Check unlock (proxy)
    unlockToriGatchi() {
        // Reload adapters to reflect unlock
        if (this.activeEngine && this.activeEngine.cards) {
            const card = this.activeEngine.cards.find(c => c.id === 'torigatchi');
            if (card) card.locked = false;
            this.activeEngine.init(); // Re-render
        }
    }

    // Get current card (proxy to activeEngine)
    getCurrentCard() {
        if (!this.activeEngine) return null;

        // SimpleCarousel uses getCurrentCardElement()
        if (this.activeEngine.getCurrentCardElement) {
            return this.activeEngine.getCurrentCardElement();
        }

        // MomentumAdapter uses getCurrentCard()
        if (this.activeEngine.getCurrentCard) {
            return this.activeEngine.getCurrentCard();
        }

        return null;
    }


    destroy() {
        window.removeEventListener('resize', this.resizeListener);
        if (this.activeEngine && this.activeEngine.destroy) {
            this.activeEngine.destroy();
        }
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.MenuCarousel = MenuCarousel;
}

// ES Module export
// export { MenuCarousel };
