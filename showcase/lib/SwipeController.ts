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
    private swipeThreshold: number = 30; // pixels (reduced from 50 for easier swiping)
    private velocityThreshold: number = 0.2; // px/ms (reduced from 0.3 for easier quick swipes)
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
        
        // Start from current panel position
        const currentIndex = this.tabController.getCurrentTabIndex();
        this.currentTranslate = -currentIndex * window.innerWidth;
        
        // Add dragging class to disable CSS transitions
        this.container.classList.add('dragging');
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

            // Calculate translate position
            const currentIndex = this.tabController.getCurrentTabIndex();
            const totalTabs = this.tabController.getTotalTabs();
            const baseTranslate = -currentIndex * window.innerWidth;
            
            // Apply rubber-band effect at edges
            const atStart = currentIndex === 0 && deltaX > 0;
            const atEnd = currentIndex === totalTabs - 1 && deltaX < 0;

            if (atStart || atEnd) {
                // Reduce movement at edges
                this.currentTranslate = baseTranslate + (deltaX * this.rubberBandFactor);
            } else {
                this.currentTranslate = baseTranslate + deltaX;
            }

            // Direct manipulation: translate container as user drags
            this.container.style.transform = `translateX(${this.currentTranslate}px)`;
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

        // Remove dragging class to re-enable smooth transitions
        this.container.classList.remove('dragging');

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
        } else {
            // Snap back to current tab
            const currentIndex = this.tabController.getCurrentTabIndex();
            this.container.style.transform = `translateX(${-currentIndex * window.innerWidth}px)`;
        }

        this.reset();
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
