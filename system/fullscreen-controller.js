// @ts-check
// ========================================
// FULLSCREEN CONTROLLER - Version 848
// Cross-browser fullscreen toggle
// Extracted from GameEngine for SOLID principles
// ========================================

/**
 * FullscreenController - Cross-browser fullscreen management
 * 
 * Handles fullscreen toggle with vendor prefixes for:
 * - Standard API
 * - WebKit (Safari)
 * - Mozilla (Firefox)
 * - MS (IE/Edge legacy)
 * 
 * @class FullscreenController
 */
class FullscreenController {
    /**
     * @param {any} game - Game engine reference
     */
    constructor(game) {
        this.game = game;
        console.log('📺 FullscreenController initialized');
    }

    /**
     * Check if currently in fullscreen mode
     * @returns {boolean} True if fullscreen
     */
    isFullscreen() {
        return !!(
            document.fullscreenElement ||
            // @ts-ignore - Vendor prefix for Safari
            document.webkitFullscreenElement ||
            // @ts-ignore - Vendor prefix for Firefox
            document.mozFullScreenElement ||
            // @ts-ignore - Vendor prefix for IE/Edge
            document.msFullscreenElement
        );
    }

    /**
     * Toggle fullscreen mode
     */
    toggle() {
        if (this.isFullscreen()) {
            this.exit();
        } else {
            this.enter();
        }

        // Update button text after a short delay (fullscreen API is async)
        setTimeout(() => {
            this.updateButton();
        }, 100);

        // Auto-close pause menu after toggling
        if (this.game?.saveLoadUI?.hidePauseMenu) {
            setTimeout(() => {
                this.game.saveLoadUI.hidePauseMenu();
            }, 150);
        }
    }

    /**
     * Enter fullscreen mode
     */
    enter() {
        const element = document.documentElement;

        if (element.requestFullscreen) {
            element.requestFullscreen();
            // @ts-ignore - Vendor prefix for Safari
        } else if (element.webkitRequestFullscreen) {
            // @ts-ignore
            element.webkitRequestFullscreen();
            // @ts-ignore - Vendor prefix for Firefox
        } else if (element.mozRequestFullScreen) {
            // @ts-ignore
            element.mozRequestFullScreen();
            // @ts-ignore - Vendor prefix for IE/Edge
        } else if (element.msRequestFullscreen) {
            // @ts-ignore
            element.msRequestFullscreen();
        }
    }

    /**
     * Exit fullscreen mode
     */
    exit() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            // @ts-ignore - Vendor prefix for Safari
        } else if (document.webkitExitFullscreen) {
            // @ts-ignore
            document.webkitExitFullscreen();
            // @ts-ignore - Vendor prefix for Firefox
        } else if (document.mozCancelFullScreen) {
            // @ts-ignore
            document.mozCancelFullScreen();
            // @ts-ignore - Vendor prefix for IE/Edge
        } else if (document.msExitFullscreen) {
            // @ts-ignore
            document.msExitFullscreen();
        }
    }

    /**
     * Update fullscreen button state
     */
    updateButton() {
        this.game?.uiController?.updateFullscreenButton?.();
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    // @ts-ignore
    window.FullscreenController = FullscreenController;
}

// ES Module export
export { FullscreenController };
