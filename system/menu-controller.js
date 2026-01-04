// ========================================
// MENU CONTROLLER
// Session 121: Extracted from GameEngine
// ========================================
//
// RESPONSIBILITIES:
// - Main menu display and orchestration
// - Menu layout updates (ToriGatchi unlock system)
// - Splash screen skip handling
// - Rotating tips system delegation
// - Menu carousel integration
//
// ARCHITECTURE:
// - Single Responsibility: Menu presentation and state
// - Delegates to: TipsController, MenuCarousel
// - Called by: GameEngine, SceneProgressionController
//
// ========================================

class MenuController {
    constructor(game) {
        this.game = game;
        console.log('🎨 MenuController initialized');
    }

    // ========================================
    // MAIN MENU DISPLAY
    // ========================================

    /**
     * Show main menu with full cleanup and initialization
     * CRITICAL METHOD: 88 lines of orchestration
     */
    showMainMenu() {
        // Hide UV7 splash (calls window.completeSplash if available)
        if (window.completeSplash) {
            window.completeSplash();
        }

        // DIZEE: Cleanup current route when returning to menu
        if (this.game.currentRoute) {
            if (this.game.currentRoute.cleanup) {
                this.game.currentRoute.cleanup();
            }
            this.game.currentRoute = null;
        }

        // Hide route-specific UI elements
        if (this.game.tetherUI) {
            this.game.tetherUI.style.display = 'none';
        }
        if (this.game.notesButton) {
            this.game.notesButton.style.display = 'none';
        }

        // DIZEE FIX: Hide game view and clear backgrounds when returning to main menu
        if (this.game.gameView) {
            this.game.gameView.style.display = 'none';
        }
        if (this.game.sceneBackground) {
            this.game.sceneBackground.style.backgroundImage = '';
        }
        if (this.game.sceneBackgroundAlt) {
            this.game.sceneBackgroundAlt.style.backgroundImage = '';
        }

        // DIZEE FIX: Clear sprites when returning to menu
        if (this.game.spriteLeft) {
            this.game.spriteLeft.style.backgroundImage = '';
            this.game.spriteLeft.style.opacity = '0';
        }
        if (this.game.spriteRight) {
            this.game.spriteRight.style.backgroundImage = '';
            this.game.spriteRight.style.opacity = '0';
        }

        // DIZEE FIX: Ensure pause menu overaly is closed when returning to main menu
        if (this.game.saveLoadUI) {
            this.game.saveLoadUI.hidePauseMenu();
        }


        // Show main menu with smooth fade-in
        this.game.mainMenu.style.display = 'flex';
        this.game.mainMenu.style.opacity = '0';

        // Force reflow to ensure opacity starts at 0
        void this.game.mainMenu.offsetWidth;

        // Fade in smoothly
        this.game.mainMenu.style.transition = 'opacity 0.8s ease-in';
        this.game.mainMenu.style.opacity = '1';

        // Initialize menu carousel (UV7 glow-up)
        console.log('🔍 Checking MenuCarousel availability:', typeof MenuCarousel);
        if (!this.game.menuCarousel && typeof MenuCarousel !== 'undefined') {
            console.log('🎠 Creating MenuCarousel instance...');
            this.game.menuCarousel = new MenuCarousel(this.game);
            this.game.menuCarousel.init();
        } else if (typeof MenuCarousel === 'undefined') {
            console.warn('⚠️ MenuCarousel class not found - is ui/menu-carousel.js loaded?');
        } else if (this.game.menuCarousel) {
            console.log('ℹ️ MenuCarousel already initialized');
        }

        // Check if ToriGatchi is unlocked and update main menu layout (fallback for old grid)
        this.updateMainMenuLayout();

        // ZEE'S ADDITION: Start tip rotation 🖤
        this.startMainMenuTipRotation();

        // COMMENTARY TRIGGER: Main Menu Loop (First time view)
        if (this.game.devCommentary && this.game.devCommentary.isUnlocked() && !localStorage.getItem('commentaryMenuSeen')) {
            localStorage.setItem('commentaryMenuSeen', 'true');

            // Show subtle hint
            setTimeout(() => {
                this.game.devCommentary.showCommentary('main_menu_carousel');
            }, 2000);
        }
    }

    // ========================================
    // SPLASH SCREEN HANDLING
    // ========================================

    /**
     * Handle splash screen skip by user
     * Cancels pending timeouts and sets global flags
     */
    handleSplashSkip() {
        console.log('GameEngine: Splash skip detected');
        this.game.splashSkipped = true;
        window.splashSkippedByUser = true; // Set global flag for preload to check

        // Cancel any pending proceedToMenu timeout
        if (this.game.proceedToMenuTimeout) {
            console.log('GameEngine: Canceling proceedToMenu timeout');
            clearTimeout(this.game.proceedToMenuTimeout);
            this.game.proceedToMenuTimeout = null;
        }

        // Cancel any pending menu show timeout
        if (this.game.menuShowTimeout) {
            console.log('GameEngine: Canceling menuShow timeout');
            clearTimeout(this.game.menuShowTimeout);
            this.game.menuShowTimeout = null;
        }

        // Note: index.html handles calling showMainMenu via completeSplash
    }

    // ========================================
    // TORIGATCHI MAIN MENU UNLOCK SYSTEM
    // DIZEE'S ADDITION: Unlocks after first secret code use 🔧
    // ========================================

    updateMainMenuLayout() {
        // LEGACY: Replaced by MenuCarousel (Hybrid System)
        // This method is kept as a stub to prevent errors if called externally
        console.log('🎮 Menu layout handled by MenuCarousel (Legacy grid removed)');
    }

    // ========================================
    // ROTATING TIPS SYSTEM
    // ZEE'S ADDITION: Ambient discovery on main menu & route select 🖤
    // ========================================
    // NOTE: All tip methods delegate to TipsController
    // MenuController acts as a facade for menu-related tip operations

    initRotatingTips() {
        this.game.tipsController.init();
    }

    getMainMenuTips() {
        return this.game.tipsController.getMainMenuTips();
    }

    getRouteSelectTips() {
        return this.game.tipsController.getRouteSelectTips();
    }

    startMainMenuTipRotation() {
        this.game.tipsController.startMainMenuRotation();
    }

    stopMainMenuTipRotation() {
        return this.game.sceneProgressionController.stopMainMenuTipRotation();
    }

    startRouteSelectTipRotation() {
        this.game.tipsController.startRouteSelectRotation();
    }

    stopRouteSelectTipRotation() {
        return this.game.sceneProgressionController.stopRouteSelectTipRotation();
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.MenuController = MenuController;
}

// ES Module export
export { MenuController };
