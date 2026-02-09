// ========================================
// SWIPE DETECTOR
// Touch/swipe input detection for quick actions
//
// Extracted from ExpandableQuickActions.ts (~165 lines -> dedicated module)
//
// Handles:
// - Horizontal swipe detection for page switching
// - Vertical swipe detection for expansion
// - Double-swipe shortcut detection
// - Rubber-band resistance at edges
// - Live drag tracking during swipe
//
// DIZEE Implementation - MICHELIN EDITION 🔥
// 848 is sacred. 💚🔥💀
// ========================================

import { Logger } from '@utils/Logger';

/**
 * Callback contract for swipe events.
 * The orchestrator implements this interface.
 */
export interface SwipeCallbacks {
    onNextPage(): void;
    onPrevPage(): void;
    onSnapToCurrentPage(): void;
    onExpand(): void;
    isShadeOpen(): boolean;
    isExpanded(): boolean;
    openShade(): void;
    getCurrentPage(): number;
    getTotalPages(): number;
    getTrackElement(): HTMLElement | null;
    triggerHaptic(type: 'light' | 'medium' | 'heavy'): void;
}

/**
 * SwipeDetector
 *
 * Detects horizontal and vertical swipe gestures on the quick actions container.
 * Handles live drag tracking, velocity-based page changes, rubber-banding,
 * vertical expansion, and double-swipe shortcuts.
 */
export class SwipeDetector {
    // Swipe state
    private swipeStartX: number = 0;
    private swipeStartY: number = 0;
    private swipeStartTime: number = 0;
    private lastSwipeTime: number = 0;
    private isDragging: boolean = false;
    // @ts-expect-error - Reserved for velocity calculation
    private lastMoveX: number = 0;
    // @ts-expect-error - Reserved for velocity calculation
    private lastMoveTime: number = 0;

    // Thresholds
    private swipeThreshold: number = 30;
    private swipeTimeLimit: number = 500;
    private doubleSwipeWindow: number = 500;

    constructor(
        private container: HTMLElement,
        private callbacks: SwipeCallbacks
    ) {
        this.attachListeners();
    }

    private attachListeners(): void {
        this.container.addEventListener('touchstart', (e) => this.handleSwipeStart(e), { passive: false });
        this.container.addEventListener('touchmove', (e) => this.handleSwipeMove(e), { passive: false });
        this.container.addEventListener('touchend', (e) => this.handleSwipeEnd(e), { passive: false });
    }

    private handleSwipeStart(e: TouchEvent): void {
        const touch = e.touches[0];
        if (!touch) return;

        this.swipeStartX = touch.clientX;
        this.swipeStartY = touch.clientY;
        this.swipeStartTime = Date.now();
        this.isDragging = false;
        this.lastMoveX = touch.clientX;
        this.lastMoveTime = Date.now();

        // Disable CSS transition during drag for responsive feel
        const track = this.callbacks.getTrackElement();
        if (track) {
            track.style.transition = 'none';
        }
    }

    private handleSwipeMove(e: TouchEvent): void {
        const touch = e.touches[0];
        if (!touch) return;

        const deltaX = touch.clientX - this.swipeStartX;
        const deltaY = Math.abs(touch.clientY - this.swipeStartY);

        // Only track horizontal if it's the dominant direction
        if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
            e.preventDefault();
            this.isDragging = true;

            this.lastMoveX = touch.clientX;
            this.lastMoveTime = Date.now();

            // Live drag tracking
            const track = this.callbacks.getTrackElement();
            if (track) {
                const containerWidth = track.parentElement?.offsetWidth || window.innerWidth;
                const baseOffset = -this.callbacks.getCurrentPage() * containerWidth;

                // Rubber-band resistance at edges
                let adjustedDelta = deltaX;
                const atStart = this.callbacks.getCurrentPage() === 0 && deltaX > 0;
                const atEnd = this.callbacks.getCurrentPage() >= this.callbacks.getTotalPages() - 1 && deltaX < 0;

                if (atStart || atEnd) {
                    adjustedDelta = deltaX * 0.3;
                }

                track.style.transform = `translateX(${baseOffset + adjustedDelta}px)`;
            }
        }
    }

    private handleSwipeEnd(e: TouchEvent): void {
        const touch = e.changedTouches[0];
        if (!touch) return;

        const deltaX = touch.clientX - this.swipeStartX;
        const deltaY = touch.clientY - this.swipeStartY;
        const deltaTime = Date.now() - this.swipeStartTime;

        // Re-enable CSS transition for snap animation
        const track = this.callbacks.getTrackElement();
        if (track) {
            track.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }

        const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

        if (this.isDragging && isHorizontal) {
            const velocity = deltaX / Math.max(deltaTime, 1);
            const containerWidth = track?.parentElement?.offsetWidth || window.innerWidth;
            const threshold = containerWidth * 0.25;
            const velocityThreshold = 0.3;

            if (deltaX < -threshold || velocity < -velocityThreshold) {
                if (this.callbacks.getCurrentPage() < this.callbacks.getTotalPages() - 1) {
                    this.callbacks.onNextPage();
                } else {
                    this.callbacks.onSnapToCurrentPage();
                }
            } else if (deltaX > threshold || velocity > velocityThreshold) {
                if (this.callbacks.getCurrentPage() > 0) {
                    this.callbacks.onPrevPage();
                } else {
                    this.callbacks.onSnapToCurrentPage();
                }
            } else {
                this.callbacks.onSnapToCurrentPage();
            }

            this.isDragging = false;
            return;
        }

        // Check for vertical swipe (expansion)
        if (!isHorizontal && Math.abs(deltaY) > this.swipeThreshold && deltaTime < this.swipeTimeLimit) {
            if (deltaY > 0) {
                this.handleVerticalSwipe(deltaY, deltaTime);
            }
        }

        this.isDragging = false;
    }

    private handleVerticalSwipe(deltaY: number, deltaTime: number): void {
        const now = Date.now();
        const timeSinceLastSwipe = now - this.lastSwipeTime;
        const velocity = deltaY / Math.max(deltaTime, 1);
        const velocityThreshold = 0.3;

        if (this.callbacks.isExpanded()) return;

        if (this.callbacks.isShadeOpen()) {
            const meetsThreshold = deltaY > 20;
            const meetsVelocity = velocity > velocityThreshold;

            if (meetsThreshold || meetsVelocity) {
                Logger.ui('📱 Vertical swipe - expanding quick actions', {
                    deltaY,
                    velocity: velocity.toFixed(2),
                    method: meetsVelocity ? 'velocity' : 'threshold'
                });
                this.callbacks.onExpand();
                this.lastSwipeTime = now;
                this.callbacks.triggerHaptic('medium');
                return;
            }
        }

        // Double-swipe shortcut
        if (timeSinceLastSwipe < this.doubleSwipeWindow && timeSinceLastSwipe > 50) {
            Logger.ui('📱 Double-swipe detected - quick expand!');
            if (!this.callbacks.isShadeOpen()) {
                this.callbacks.openShade();
            }
            setTimeout(() => {
                this.callbacks.onExpand();
                this.callbacks.triggerHaptic('heavy');
            }, 150);
            this.lastSwipeTime = 0;
            return;
        }

        this.lastSwipeTime = now;
    }
}
