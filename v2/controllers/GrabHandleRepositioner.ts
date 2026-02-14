/**
 * ========================================
 * GRAB HANDLE REPOSITIONER
 * V1 Parity Port - Complete Implementation
 * ========================================
 *
 * Faithful port of V1's 633-line grab-handle-repositioner.js
 *
 * Features:
 * - 300ms drag delay (prevents accidental drags while tapping)
 * - Tap-to-toggle sidebar (single tap opens/closes)
 * - Custom double-tap detection (300ms threshold, mobile-friendly)
 * - Horizontal drag to flip sides (50% threshold with visual feedback)
 * - RAF-based smooth updates (60fps drag rendering)
 * - Haptic feedback patterns (light/medium/heavy)
 * - Sidebar synchronization (handle + sidebar move together)
 * - Visual feedback classes (.dragging, .crossing-threshold)
 *
 * "Built with love. 💚🔥💀"
 */

import type { EventBus } from '@core/EventBus';
import { Logger } from '@utils/Logger';

type GrabPosition = {
    top: number;
    side: 'left' | 'right';
};

export class GrabHandleRepositioner {
    private handle: HTMLElement | null;
    private sidebar: HTMLElement | null;
    private eventBus: EventBus;
    private position: GrabPosition;

    // Drag state
    private isDragging = false;
    private dragStartX = 0;
    private dragStartY = 0;
    private currentX = 0;
    private currentY = 0;
    // private dragStartTime = 0; // Reserved for velocity calculations
    private isDragDelayActive = false;
    private dragDelayTimer: number | null = null;
    private wasDragging = false;

    // RAF state
    private rafPending = false;

    // Tap state
    private lastTapTime = 0;
    private tapTimeout: number | null = null;
    private isDoubleTapping = false;
    private pendingTap = false;

    // Touch/Mouse state
    private usingTouch = false;
    private touchPreventTimer: number | null = null;

    // Horizontal flip state
    private horizontalFlipPending = false;

    // Constants
    private readonly HOLD_DELAY = 300; // ms before drag starts
    private readonly DOUBLE_TAP_DELAY = 300; // ms window for double-tap
    private readonly FLIP_THRESHOLD = 50; // % of screen width
    private readonly MIN_DRAG_DISTANCE = 5; // px to distinguish tap from drag

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.position = this.loadPosition();

        this.handle = document.getElementById('sidebar-toggle');
        this.sidebar = document.getElementById('sidebar');

        if (!this.handle) {
            Logger.warn('[GrabHandle] Toggle button not found (is Sidebar initialized?)');
            return;
        }

        this.applyPosition();
        this.attachEvents();

        Logger.ui('[GrabHandle] ✅ V1 Parity Complete - All features active', this.position);
    }

    private attachEvents(): void {
        if (!this.handle) return;

        // ========================================
        // MOUSE EVENTS (Desktop)
        // ========================================
        this.handle.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));

        // ========================================
        // TOUCH EVENTS (Mobile)
        // ========================================
        this.handle.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        window.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        window.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });

        // ========================================
        // CLICK INTERCEPTION (Prevent clicks during drag)
        // ========================================
        this.handle.addEventListener('click', (e) => this.handleClick(e), { capture: true });
    }

    // ========================================
    // MOUSE HANDLERS
    // ========================================

    private handleMouseDown(e: MouseEvent): void {
        // Only left click
        if (e.button !== 0) return;

        // Prevent mouse events if recently used touch
        if (this.usingTouch) {
            e.preventDefault();
            return;
        }

        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        this.currentX = e.clientX;
        this.currentY = e.clientY;
        // this.dragStartTime = Date.now();
        this.isDragDelayActive = true;
        this.horizontalFlipPending = false;

        // V1 Parity: 300ms hold delay before drag starts
        this.dragDelayTimer = window.setTimeout(() => {
            this.isDragDelayActive = false;
            if (this.dragStartX !== 0) {
                this.startDrag();
            }
        }, this.HOLD_DELAY);

        e.preventDefault(); // Prevent text selection
    }

    private handleMouseMove(e: MouseEvent): void {
        if (this.isDragDelayActive || !this.isDragging) {
            // Track position but don't drag yet
            this.currentX = e.clientX;
            this.currentY = e.clientY;
            return;
        }

        this.currentX = e.clientX;
        this.currentY = e.clientY;

        // RAF-based smooth updates
        if (!this.rafPending) {
            this.rafPending = true;
            requestAnimationFrame(() => this.updateDragPosition());
        }
    }

    private handleMouseUp(e: MouseEvent): void {
        // Clear drag delay timer
        if (this.dragDelayTimer) {
            clearTimeout(this.dragDelayTimer);
            this.dragDelayTimer = null;
        }

        if (!this.isDragging && !this.isDragDelayActive) return;

        const deltaX = e.clientX - this.dragStartX;
        const deltaY = e.clientY - this.dragStartY;
        const dragDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // If we were dragging, complete it
        if (this.isDragging) {
            this.endDrag();

            // Check if horizontal flip should activate
            if (this.horizontalFlipPending) {
                this.flipSide();
                this.triggerHaptic('light');
            }

            // Set flag to prevent click event
            this.wasDragging = true;
            setTimeout(() => {
                this.wasDragging = false;
            }, 100);

            return;
        }

        // Not dragging - this was a tap/click
        this.isDragDelayActive = false;

        // Ignore if this was actually a drag (moved more than threshold)
        if (dragDistance > this.MIN_DRAG_DISTANCE) {
            return;
        }

        // Handle tap logic
        this.handleTap();
    }

    // ========================================
    // TOUCH HANDLERS
    // ========================================

    private handleTouchStart(e: TouchEvent): void {
        const touch = e.touches[0];
        if (!touch) return;

        // Mark as using touch
        this.usingTouch = true;
        if (this.touchPreventTimer) clearTimeout(this.touchPreventTimer);
        this.touchPreventTimer = window.setTimeout(() => {
            this.usingTouch = false;
        }, 500);

        this.dragStartX = touch.clientX;
        this.dragStartY = touch.clientY;
        this.currentX = touch.clientX;
        this.currentY = touch.clientY;
        // this.dragStartTime = Date.now();
        this.isDragDelayActive = true;
        this.horizontalFlipPending = false;

        // V1 Parity: 300ms hold delay
        this.dragDelayTimer = window.setTimeout(() => {
            this.isDragDelayActive = false;
            if (this.dragStartX !== 0) {
                this.startDrag();
            }
        }, this.HOLD_DELAY);
    }

    private handleTouchMove(e: TouchEvent): void {
        const touch = e.touches[0];
        if (!touch) return;

        if (this.isDragDelayActive || !this.isDragging) {
            this.currentX = touch.clientX;
            this.currentY = touch.clientY;
            return;
        }

        // Prevent scrolling while dragging
        if (e.cancelable) e.preventDefault();

        this.currentX = touch.clientX;
        this.currentY = touch.clientY;

        // RAF-based updates
        if (!this.rafPending) {
            this.rafPending = true;
            requestAnimationFrame(() => this.updateDragPosition());
        }
    }

    private handleTouchEnd(e: TouchEvent): void {
        // Clear drag delay timer
        if (this.dragDelayTimer) {
            clearTimeout(this.dragDelayTimer);
            this.dragDelayTimer = null;
        }

        if (!this.isDragging && !this.isDragDelayActive) return;

        const touch = e.changedTouches[0];
        if (!touch) return;

        const deltaX = touch.clientX - this.dragStartX;
        const deltaY = touch.clientY - this.dragStartY;
        const dragDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // If dragging, end it
        if (this.isDragging) {
            this.endDrag();

            // Check horizontal flip
            if (this.horizontalFlipPending) {
                this.flipSide();
                this.triggerHaptic('light');
            }

            this.wasDragging = true;
            setTimeout(() => {
                this.wasDragging = false;
            }, 100);

            return;
        }

        // Not dragging - tap logic
        this.isDragDelayActive = false;

        if (dragDistance > this.MIN_DRAG_DISTANCE) {
            return;
        }

        this.handleTap();
    }

    // ========================================
    // TAP HANDLING
    // ========================================

    private handleTap(): void {
        const now = Date.now();

        // Check for double-tap
        if (now - this.lastTapTime < this.DOUBLE_TAP_DELAY) {
            // Double-tap detected!
            this.isDoubleTapping = true;
            if (this.tapTimeout) {
                clearTimeout(this.tapTimeout);
                this.tapTimeout = null;
            }
            this.flipSide();
            this.triggerHaptic('medium');
            this.lastTapTime = 0; // Reset
            this.isDoubleTapping = false;
            return;
        }

        // Single tap - wait to see if double-tap follows
        this.lastTapTime = now;
        this.pendingTap = true;

        this.tapTimeout = window.setTimeout(() => {
            if (this.pendingTap && !this.isDoubleTapping) {
                // Single tap confirmed — sidebar toggle handled by Sidebar's own click handler
                // (no EventBus emit here to prevent double-toggle)
                this.triggerHaptic('medium');
            }
            this.pendingTap = false;
            this.tapTimeout = null;
        }, this.DOUBLE_TAP_DELAY + 50);
    }

    // ========================================
    // CLICK INTERCEPTION
    // ========================================

    private handleClick(e: MouseEvent): void {
        // Prevent click if we just finished dragging
        if (this.wasDragging || this.isDoubleTapping) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    // ========================================
    // DRAG LOGIC
    // ========================================

    private startDrag(): void {
        this.isDragging = true;
        if (this.handle) {
            this.handle.classList.add('dragging');
        }
        this.triggerHaptic('light');
    }

    private updateDragPosition(): void {
        this.rafPending = false;

        if (!this.isDragging) return;

        const deltaX = this.currentX - this.dragStartX;
        const deltaY = this.currentY - this.dragStartY;

        // Check for horizontal flip threshold
        const dragDistanceX = Math.abs(deltaX);
        const flipThresholdPx = window.innerWidth * (this.FLIP_THRESHOLD / 100);

        if (dragDistanceX > flipThresholdPx) {
            if (!this.horizontalFlipPending) {
                this.horizontalFlipPending = true;
                if (this.handle) {
                    this.handle.classList.add('crossing-threshold');
                }
                this.triggerHaptic('medium');
            }
        } else {
            if (this.horizontalFlipPending) {
                this.horizontalFlipPending = false;
                if (this.handle) {
                    this.handle.classList.remove('crossing-threshold');
                }
            }
        }

        // Update vertical position
        this.position.top += deltaY;
        this.clamp();
        this.applyPosition();

        // Update drag start for next frame
        this.dragStartX = this.currentX;
        this.dragStartY = this.currentY;
    }

    private endDrag(): void {
        this.isDragging = false;
        if (this.handle) {
            this.handle.classList.remove('dragging');
            this.handle.classList.remove('crossing-threshold');
        }
        this.horizontalFlipPending = false;
        this.savePosition();
        this.triggerHaptic('light');
    }

    // ========================================
    // SIDEBAR INTEGRATION
    // ========================================

    private flipSide(): void {
        this.position.side = this.position.side === 'left' ? 'right' : 'left';
        this.applyPosition();
        this.savePosition();

        // Update sidebar side too
        if (this.sidebar) {
            if (this.position.side === 'right') {
                this.sidebar.classList.add('right-side');
            } else {
                this.sidebar.classList.remove('right-side');
            }
        }

        Logger.ui('[GrabHandle] 🔄 Flipped side ->', this.position.side);
    }

    // ========================================
    // POSITION MANAGEMENT
    // ========================================

    private clamp(): void {
        // Constraints: Below status bar (top), above bottom usage area
        const min = 50; // Status bar height + buffer
        const max = window.innerHeight - 80; // Bottom margin for backlog button
        this.position.top = Math.max(min, Math.min(max, this.position.top));
    }

    private applyPosition(): void {
        if (!this.handle) return;

        // Use transform for centering + top offset
        this.handle.style.top = '50%';
        this.handle.style.transform = `translateY(-50%) translateY(${this.position.top - window.innerHeight / 2}px)`;

        this.handle.style.left = this.position.side === 'left' ? '0' : 'auto';
        this.handle.style.right = this.position.side === 'right' ? '0' : 'auto';

        // Update border radius and borders based on side
        if (this.position.side === 'left') {
            this.handle.style.borderRadius = '0 16px 16px 0';
            this.handle.style.borderLeft = 'none';
        } else {
            this.handle.style.borderRadius = '16px 0 0 16px';
            this.handle.style.borderRight = 'none';
        }
    }

    private savePosition(): void {
        localStorage.setItem('uv7-grab-handle', JSON.stringify(this.position));
    }

    private loadPosition(): GrabPosition {
        try {
            const saved = localStorage.getItem('uv7-grab-handle');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            Logger.warn('[GrabHandle] Failed to load position', e);
        }
        // Default position
        return { top: 120, side: 'left' };
    }

    // ========================================
    // HAPTIC FEEDBACK
    // ========================================

    private triggerHaptic(type: 'light' | 'medium' | 'heavy'): void {
        // Emit haptic event for HapticSystem to handle
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- event not in typed GameEvents map
        (this.eventBus as any).emit('haptic:trigger', { type });

        // Fallback vibration for browsers without HapticSystem
        if (navigator.vibrate) {
            switch (type) {
                case 'light':
                    navigator.vibrate(10);
                    break;
                case 'medium':
                    navigator.vibrate(20);
                    break;
                case 'heavy':
                    navigator.vibrate([30, 10, 30]);
                    break;
            }
        }
    }
}
