// @ts-check
// ========================================
// SCREENSHOT CONTROLLER - Version 848
// Screenshot mode toggle for clean captures
// Extracted from GameEngine for SOLID principles
// ========================================

/**
 * ScreenshotController - Manages screenshot mode UI toggle
 * 
 * Handles:
 * - Hiding/showing UI elements for screenshots
 * - Status bar indicator
 * - Tap-to-exit on mobile
 * 
 * @class ScreenshotController
 */
class ScreenshotController {
    /**
     * @param {any} game - Game engine reference
     */
    constructor(game) {
        this.game = game;
        /** @type {(() => void)|null} */
        this.tapHandler = null;

        console.log('📸 ScreenshotController initialized');
    }

    /**
     * Check if screenshot mode is active
     * @returns {boolean}
     */
    isActive() {
        return this.game?.state?.get('ui.hidden') ?? false;
    }

    /**
     * Toggle screenshot mode
     */
    toggle() {
        const isHidden = this.isActive();

        if (!isHidden) {
            this.enterScreenshotMode();
        } else {
            this.exitScreenshotMode();
        }

        // Toggle notification shade system
        if (this.game?.notificationShade) {
            this.game.notificationShade.toggleScreenshotMode();
        }

        // Mobile tap handler
        this.updateTapHandler(!isHidden);
    }

    /**
     * Enter screenshot mode - hide UI elements
     */
    enterScreenshotMode() {
        document.body.classList.add('ui-hidden');

        // Hide buttons (dialogue box handled by CSS via ui-hidden class)
        this.setElementOpacity('pause-button', '0');
        this.setElementOpacity('backlog-button', '0');
        this.setElementOpacity('skip-button', '0');

        // Hide tether UI if visible
        const tetherUI = document.getElementById('tether-ui');
        if (tetherUI && tetherUI.style.display === 'block') {
            tetherUI.style.opacity = '0';
        }

        // Hide notes button if visible
        const notesButton = document.getElementById('notes-button');
        if (notesButton && notesButton.style.display === 'block') {
            notesButton.style.opacity = '0';
        }

        // Show status indicator
        this.showStatusIndicator();

        this.game?.state?.set('ui.hidden', true);
        console.log('📸 Screenshot mode ON - dialogue platform visible, status bar showing context');
    }

    /**
     * Exit screenshot mode - restore UI elements
     */
    exitScreenshotMode() {
        document.body.classList.remove('ui-hidden');

        // Restore dialogue box (remove inline overrides)
        if (this.game?.dialogueBox) {
            this.game.dialogueBox.style.opacity = '';
            this.game.dialogueBox.style.pointerEvents = '';
        }

        // Restore buttons
        this.setElementOpacity('pause-button', '1');
        this.setElementOpacity('backlog-button', '1');
        this.setElementOpacity('skip-button', '1');

        // Restore tether UI if visible
        const tetherUI = document.getElementById('tether-ui');
        if (tetherUI && tetherUI.style.display === 'block') {
            tetherUI.style.opacity = '1';
        }

        // Restore notes button if visible
        const notesButton = document.getElementById('notes-button');
        if (notesButton && notesButton.style.display === 'block') {
            notesButton.style.opacity = '1';
        }

        // Hide status indicator
        this.hideStatusIndicator();

        this.game?.state?.set('ui.hidden', false);
        console.log('📸 Screenshot mode OFF - full UI restored');
    }

    /**
     * Set opacity on an element by ID
     * @param {string} id - Element ID
     * @param {string} opacity - Opacity value
     */
    setElementOpacity(id, opacity) {
        const element = document.getElementById(id);
        if (element) element.style.opacity = opacity;
    }

    /**
     * Show screenshot mode status indicator
     */
    showStatusIndicator() {
        const statusNotification = document.getElementById('status-notification');
        if (statusNotification) {
            const icon = statusNotification.querySelector('.status-notif-icon');
            const text = statusNotification.querySelector('.status-notif-text');
            if (icon) icon.textContent = '📸';
            if (text) text.textContent = 'Screenshot Mode';
            statusNotification.classList.add('visible');
        }
    }

    /**
     * Hide screenshot mode status indicator
     */
    hideStatusIndicator() {
        const statusNotification = document.getElementById('status-notification');
        if (statusNotification) {
            statusNotification.classList.remove('visible');
        }
    }

    /**
     * Update mobile tap-to-exit handler
     * @param {boolean} entering - True if entering screenshot mode
     */
    updateTapHandler(entering) {
        if (entering) {
            // Add tap listener
            this.tapHandler = () => {
                if (this.isActive()) {
                    this.toggle();
                }
            };
            document.body.addEventListener('touchstart', this.tapHandler);
        } else {
            // Remove tap listener
            if (this.tapHandler) {
                document.body.removeEventListener('touchstart', this.tapHandler);
                this.tapHandler = null;
            }
        }
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    // @ts-ignore
    window.ScreenshotController = ScreenshotController;
}

// ES Module export
export { ScreenshotController };
