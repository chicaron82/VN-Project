// ========================================
// TIPS CONTROLLER
// Rotating tips for main menu and route select
// SOLID Refactor: Extracted from GameEngine
// ========================================

/**
 * TipsController
 * 
 * Manages rotating tip display on main menu and route selection screens.
 * ZEE'S ADDITION: Ambient discovery system 🖤
 * 
 * @class TipsController
 */
class TipsController {
    constructor(game) {
        this.game = game;

        // Tip elements
        this.mainMenuTipElement = null;
        this.routeSelectTipElement = null;

        // Rotation intervals
        this.mainMenuTipInterval = null;
        this.routeSelectTipInterval = null;

        // Current indices
        this.currentMainMenuTipIndex = 0;
        this.currentRouteSelectTipIndex = 0;
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    init() {
        // Cache tip elements
        this.mainMenuTipElement = document.getElementById('main-menu-tip');
        this.routeSelectTipElement = document.getElementById('route-select-tip');
        console.log('🖤 Rotating tips system initialized');
    }

    // ========================================
    // TIP POOLS (from UIController)
    // ========================================

    getMainMenuTips() {
        return this.game.uiController.getMainMenuTips();
    }

    getRouteSelectTips() {
        return this.game.uiController.getRouteSelectTips();
    }

    // ========================================
    // MAIN MENU TIP ROTATION
    // ========================================

    startMainMenuRotation() {
        // Stop any existing rotation
        this.stopMainMenuRotation();

        if (!this.mainMenuTipElement) return;

        const tips = this.getMainMenuTips();

        // Rotate every 8 seconds
        this.mainMenuTipInterval = setInterval(() => {
            // Fade out current tip
            this.mainMenuTipElement.classList.add('tip-fade-out');

            setTimeout(() => {
                // Update index (loop back to 0 after last tip)
                this.currentMainMenuTipIndex = (this.currentMainMenuTipIndex + 1) % tips.length;

                // Update text
                this.mainMenuTipElement.textContent = tips[this.currentMainMenuTipIndex];

                // Fade back in
                this.mainMenuTipElement.classList.remove('tip-fade-out');
            }, 800); // Match CSS transition duration
        }, 8000);

        console.log('🔄 Main menu tip rotation started');
    }

    stopMainMenuRotation() {
        if (this.mainMenuTipInterval) {
            clearInterval(this.mainMenuTipInterval);
            this.mainMenuTipInterval = null;
            console.log('⏸️ Main menu tip rotation stopped');
        }
    }

    // ========================================
    // ROUTE SELECT TIP ROTATION
    // ========================================

    startRouteSelectRotation() {
        // Stop any existing rotation
        this.stopRouteSelectRotation();

        if (!this.routeSelectTipElement) return;

        const tips = this.getRouteSelectTips();

        // Rotate every 8 seconds
        this.routeSelectTipInterval = setInterval(() => {
            // Fade out current tip
            this.routeSelectTipElement.classList.add('tip-fade-out');

            setTimeout(() => {
                // Update index (loop back to 0 after last tip)
                this.currentRouteSelectTipIndex = (this.currentRouteSelectTipIndex + 1) % tips.length;

                // Update text
                this.routeSelectTipElement.textContent = tips[this.currentRouteSelectTipIndex];

                // Fade back in
                this.routeSelectTipElement.classList.remove('tip-fade-out');
            }, 800); // Match CSS transition duration
        }, 8000);

        console.log('🔄 Route select tip rotation started');
    }

    stopRouteSelectRotation() {
        if (this.routeSelectTipInterval) {
            clearInterval(this.routeSelectTipInterval);
            this.routeSelectTipInterval = null;
            console.log('⏸️ Route select tip rotation stopped');
        }
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.TipsController = TipsController;
}

// ES Module export
export { TipsController };
