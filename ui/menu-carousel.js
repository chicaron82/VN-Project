// ========================================
// MENU CAROUSEL MANAGER
// Hybrid System: Switches between Simple (Portrait) & Momentum (Landscape)
// ========================================

class MenuCarousel {
    constructor(game) {
        this.game = game;
        this.currentIndex = 0; // Shared state
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

        // 🛡️ Ensure legacy buttons are hidden
        const legacyGrid = document.getElementById('menu-buttons-grid');
        if (legacyGrid) legacyGrid.style.display = 'none';

        // Listen for resize to switch modes
        window.addEventListener('resize', () => this.handleResize());
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
}
