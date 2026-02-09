/**
 * UV7OS SWIPE HANDLER - GESTURE RECOGNITION
 *
 * Handles touch gestures for opening/closing shade and sidebar.
 * Swipe down from top opens shade (portrait) or sidebar (landscape).
 * Swipe up closes whichever is open.
 *
 * "Touch the sky, summon the shade." - The Gesture
 */

import type { UV7OSShade } from './UV7OSShade';
import type { UV7OSSidebar } from './UV7OSSidebar';

export class UV7OSSwipeHandler {
    private touchStartY: number = 0;
    private touchEndY: number = 0;

    constructor(
        private shade: UV7OSShade,
        private sidebar: UV7OSSidebar
    ) {}

    /**
     * Attach swipe event listeners to document
     */
    attach(): void {
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    }

    /**
     * Handle touch start event
     */
    private handleTouchStart(e: TouchEvent): void {
        if (e.touches[0]) {
            this.touchStartY = e.touches[0].clientY;
        }
    }

    /**
     * Handle touch end event
     */
    private handleTouchEnd(e: TouchEvent): void {
        if (e.changedTouches[0]) {
            this.touchEndY = e.changedTouches[0].clientY;
            this.processSwipe();
        }
    }

    /**
     * Process swipe gesture and trigger appropriate action
     */
    private processSwipe(): void {
        const swipeDistance = this.touchEndY - this.touchStartY;

        // Swipe down from top (> 100px from top edge, > 100px distance)
        if (this.touchStartY < 100 && swipeDistance > 100) {
            this.handleSwipeDown();
            return;
        }

        // Swipe up (< -100px distance)
        if (swipeDistance < -100) {
            this.handleSwipeUp();
        }
    }

    /**
     * Handle swipe down gesture
     * Opens shade in portrait, sidebar in landscape
     */
    private handleSwipeDown(): void {
        const isLandscape = window.innerWidth > window.innerHeight;

        if (isLandscape) {
            this.sidebar.handleSwipeOpen();
        } else {
            this.shade.handleSwipeOpen();
        }
    }

    /**
     * Handle swipe up gesture
     * Closes shade or sidebar if open
     */
    private handleSwipeUp(): void {
        // Close whichever is open
        this.shade.handleSwipeClose();
        this.sidebar.handleSwipeClose();
    }

    /**
     * Cleanup (remove event listeners)
     */
    cleanup(): void {
        document.removeEventListener('touchstart', this.handleTouchStart.bind(this));
        document.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    }
}
