// ========================================
// SWIPE CONTROLLER
// Touch gesture handler for tab navigation
// Velocity-based with rubber-band edges
// ========================================

import type { TabController } from './TabController';

/**
 * SwipeController
 *
 * Handles horizontal swipe gestures for tab navigation.
 * Features velocity detection, rubber-band edges, and smooth transitions.
 */
export class SwipeController {
    private tabController: TabController;
    private container: HTMLElement;

    // Swipe state
    private touchStartX: number = 0;
    private touchStartY: number = 0;
    private touchStartTime: number = 0;
    private lastTouchX: number = 0;
    private lastTouchTime: number = 0;
    private isDragging: boolean = false;
    private currentTranslate: number = 0;

    // Configuration
    private swipeThreshold: number = 50; // pixels
    private velocityThreshold: number = 0.3; // px/ms
    private maxSwipeTime: number = 500; // ms
    private rubberBandFactor: number = 0.3; // Resistance at edges

    constructor(tabController: TabController, container: HTMLElement) {
        this.tabController = tabController;
        this.container = container;

        this.setupListeners();
        console.log('✅ SwipeController initialized');
    }

    private setupListeners(): void {
        // Touch events for swipe detection
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
    }

    private handleTouchStart(e: TouchEvent): void {
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

    private handleTouchMove(e: TouchEvent): void {
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
            const currentIndex = this.tabController.getCurrentTabIndex();
            const totalTabs = this.tabController.getTotalTabs();
            const atStart = currentIndex === 0 && deltaX > 0;
            const atEnd = currentIndex === totalTabs - 1 && deltaX < 0;

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

    private handleTouchEnd(e: TouchEvent): void {
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
     */
    private updateVisualFeedback(translateX: number): void {
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
    private resetVisualFeedback(): void {
        const activePanel = document.querySelector('[data-panel].active');
        if (activePanel instanceof HTMLElement) {
            activePanel.style.transform = '';
        }
    }

    /**
     * Reset swipe state
     */
    private reset(): void {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.lastTouchX = 0;
        this.lastTouchTime = 0;
        this.isDragging = false;
        this.currentTranslate = 0;
    }
}
