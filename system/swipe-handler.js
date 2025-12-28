// ========================================
// SWIPE HANDLER - Touch gesture support
// Swipe to advance dialogue
// ========================================

/**
 * SwipeHandler - Touch gesture detection for mobile
 * 
 * Features:
 * - Swipe right to advance dialogue
 * - Swipe left for backlog (optional)
 * - Configurable sensitivity
 * - Prevent conflicts with scrolling
 */

class SwipeHandler {
    constructor(game) {
        this.game = game;
        this.startX = 0;
        this.startY = 0;
        this.startTime = 0;
        this.isEnabled = true;
        this.sensitivity = 50; // Minimum swipe distance in pixels
        this.maxVerticalDeviation = 50; // Max vertical movement to still count as horizontal swipe

        this.init();
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    init() {
        this.setupTouchListeners();
        this.loadSettings();
        console.log('👆 Swipe Handler initialized');
    }

    setupTouchListeners() {
        const gameContainer = document.getElementById('game-container') || document.body;

        gameContainer.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: true });
        gameContainer.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: true });
    }

    // ========================================
    // TOUCH EVENTS
    // ========================================

    onTouchStart(e) {
        if (!this.isEnabled) return;
        if (e.touches.length !== 1) return; // Only single finger swipes

        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        this.startTime = Date.now();
    }

    onTouchEnd(e) {
        if (!this.isEnabled) return;
        if (e.changedTouches.length !== 1) return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();

        const deltaX = endX - this.startX;
        const deltaY = endY - this.startY;
        const deltaTime = endTime - this.startTime;

        // Check if it's a valid swipe
        if (this.isValidSwipe(deltaX, deltaY, deltaTime)) {
            this.handleSwipe(deltaX, deltaY);
        }
    }

    isValidSwipe(deltaX, deltaY, deltaTime) {
        // Must be horizontal enough
        if (Math.abs(deltaY) > this.maxVerticalDeviation) {
            return false;
        }

        // Must be long enough
        if (Math.abs(deltaX) < this.sensitivity) {
            return false;
        }

        // Must be fast enough (not a slow drag)
        if (deltaTime > 500) {
            return false;
        }

        return true;
    }

    handleSwipe(deltaX, deltaY) {
        if (deltaX > 0) {
            // Swipe right - advance dialogue
            this.onSwipeRight();
        } else {
            // Swipe left - backlog (optional)
            this.onSwipeLeft();
        }
    }

    onSwipeRight() {
        console.log('👉 Swipe right detected');

        // Check if we can advance
        if (this.game.pauseManager?.isPaused()) {
            return; // Don't advance while paused
        }

        // Advance dialogue
        if (typeof this.game.advanceDialogue === 'function') {
            this.game.advanceDialogue();
        } else if (typeof this.game.handleConfirm === 'function') {
            this.game.handleConfirm();
        }
    }

    onSwipeLeft() {
        console.log('👈 Swipe left detected');

        // Open backlog (if available)
        if (this.game.backlogController) {
            this.game.backlogController.open();
        }
    }

    // ========================================
    // SETTINGS
    // ========================================

    enable() {
        this.isEnabled = true;
        console.log('👆 Swipe gestures enabled');
    }

    disable() {
        this.isEnabled = false;
        console.log('👆 Swipe gestures disabled');
    }

    setSensitivity(value) {
        // value: 1-100 (low to high sensitivity)
        this.sensitivity = Math.max(20, Math.min(100, 100 - value));
        this.saveSettings();
        console.log(`👆 Swipe sensitivity set to ${value} (${this.sensitivity}px threshold)`);
    }

    loadSettings() {
        const saved = localStorage.getItem('swipe_settings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                this.isEnabled = settings.enabled ?? true;
                this.sensitivity = settings.sensitivity ?? 50;
            } catch (e) {
                console.warn('Failed to load swipe settings');
            }
        }
    }

    saveSettings() {
        const settings = {
            enabled: this.isEnabled,
            sensitivity: this.sensitivity
        };
        localStorage.setItem('swipe_settings', JSON.stringify(settings));
    }
}

// ========================================
// GLOBAL EXPORT
// ========================================

if (typeof window !== 'undefined') {
    window.SwipeHandler = SwipeHandler;
}

export { SwipeHandler };
