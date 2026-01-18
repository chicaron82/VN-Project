// @ts-check
// ========================================
// SWIPE CONTROLLER
// Touch gesture handler for tab navigation
// Velocity-based with rubber-band edges
// ========================================

/**
 * SwipeController
 * 
 * Handles horizontal swipe gestures for tab navigation.
 * Features velocity detection, rubber-band edges, and smooth transitions.
 * 
 * @class SwipeController
 */
class SwipeController {
    /**
     * @param {TabController} tabController
     * @param {HTMLElement} container - Element to attach swipe listeners to
     */
    constructor(tabController, container) {
        this.tabController = tabController;
        this.container = container;

        // Swipe state
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.lastTouchX = 0;
        this.lastTouchTime = 0;
        this.isDragging = false;
        this.currentTranslate = 0;

        // Configuration
        this.swipeThreshold = 50; // pixels
        this.velocityThreshold = 0.3; // px/ms
        this.maxSwipeTime = 500; // ms
        this.rubberBandFactor = 0.3; // Resistance at edges

        this.setupListeners();
        console.log('✅ SwipeController initialized');
    }

    setupListeners() {
        // Touch events for swipe detection
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
    }

    /**
     * @param {TouchEvent} e
     */
    handleTouchStart(e) {
        // Don't interfere with carousel swipes
        const target = e.target;
        if (target instanceof Element && target.closest('.hero-carousel-card')) {
            return; // Let carousel handle it
        }

        const touch = e.touches[0];
        if (!touch) return;

        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.touchStartTime = Date.now();
        this.lastTouchX = touch.clientX;
        this.lastTouchTime = Date.now();
        this.isDragging = false;
        this.currentTranslate = 0;
    }

    /**
     * @param {TouchEvent} e
     */
    handleTouchMove(e) {
        if (!this.touchStartX) return;

        const touch = e.touches[0];
        if (!touch) return;

        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = Math.abs(touch.clientY - this.touchStartY);

        // Only handle horizontal swipes (not vertical scrolling)
        if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
            // Prevent default to stop scrolling
            if (e.cancelable) {
                e.preventDefault();
            }

            this.isDragging = true;

            // Track velocity
            this.lastTouchX = touch.clientX;
            this.lastTouchTime = Date.now();

            // Apply rubber-band effect at edges
            const currentIndex = this.tabController.tabs.indexOf(this.tabController.activeTab);
            const atStart = currentIndex === 0 && deltaX > 0;
            const atEnd = currentIndex === this.tabController.tabs.length - 1 && deltaX < 0;

            if (atStart || atEnd) {
                // Reduce movement at edges
                this.currentTranslate = deltaX * this.rubberBandFactor;
            } else {
                this.currentTranslate = deltaX;
            }

            // Visual feedback (optional - could add panel translation here)
            this.updateVisualFeedback(this.currentTranslate);
        }
    }

    /**
     * @param {TouchEvent} e
     */
    handleTouchEnd(e) {
        if (!this.isDragging) {
            this.reset();
            return;
        }

        const touch = e.changedTouches[0];
        if (!touch) {
            this.reset();
            return;
        }

        const deltaX = touch.clientX - this.touchStartX;
        const deltaTime = Date.now() - this.touchStartTime;
        const velocity = deltaX / Math.max(deltaTime, 1);

        // Determine if we should change tabs
        const shouldChangeTabs =
            Math.abs(deltaX) > this.swipeThreshold ||
            Math.abs(velocity) > this.velocityThreshold;

        const isQuickSwipe = deltaTime < this.maxSwipeTime;

        if (shouldChangeTabs && isQuickSwipe) {
            if (deltaX > 0) {
                // Swipe right → Previous tab
                this.tabController.previousTab();
                console.log('👈 Swipe right - previous tab');
            } else {
                // Swipe left → Next tab
                this.tabController.nextTab();
                console.log('👉 Swipe left - next tab');
            }
        }

        // Reset visual feedback
        this.resetVisualFeedback();
        this.reset();
    }

    /**
     * Update visual feedback during drag
     * @param {number} translateX
     */
    updateVisualFeedback(translateX) {
        // Optional: Add visual feedback here
        // Could translate the active panel slightly
        const activePanel = document.querySelector('[data-panel].active');
        if (activePanel instanceof HTMLElement) {
            activePanel.style.transform = `translateX(${translateX * 0.1}px)`;
        }
    }

    /**
     * Reset visual feedback
     */
    resetVisualFeedback() {
        const activePanel = document.querySelector('[data-panel].active');
        if (activePanel instanceof HTMLElement) {
            activePanel.style.transform = '';
        }
    }

    /**
     * Reset swipe state
     */
    reset() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.lastTouchX = 0;
        this.lastTouchTime = 0;
        this.isDragging = false;
        this.currentTranslate = 0;
    }
}

// Export for use
if (typeof window !== 'undefined') {
    // @ts-ignore - Adding to window global
    window.SwipeController = SwipeController;
}
