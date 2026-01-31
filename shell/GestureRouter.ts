/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 GESTURE ROUTER - CENTRALIZED INPUT MANAGEMENT
 *
 * The "Gesture Arbiter" that prevents gesture conflicts between
 * the shell and apps.
 *
 * PRIORITY ZONES:
 * 1. Shell zones (always win):
 *    - Top 50px: Notification shade trigger
 *    - Status bar: Tap for app switcher
 * 2. Active app (gets everything else)
 *
 * DIRECTION LOCK:
 * - First 10px of movement determines horizontal vs vertical
 * - Once locked, opposite direction is ignored
 *
 * CREW CREDITS:
 * - Belle (Gesture Arbiter concept with capture phase)
 * - Tori (Direction-lock recommendation)
 * - GenZee (Mode-aware dispatcher pattern)
 * ═══════════════════════════════════════════════════════════════
 */

import type { UV7Shell } from './UV7Shell.js';

type Direction = 'horizontal' | 'vertical' | null;
type ShellAction = 'shade-pending' | 'shell-trigger' | null;
type SwipeDirection = 'left' | 'right' | 'up' | 'down';

interface TouchPosition {
    x: number;
    y: number;
}

interface GestureInfo {
    deltaX: number;
    deltaY: number;
    direction?: Direction;
}

interface GestureHandlers {
    onTouchStart?: (event: TouchEvent) => void;
    onTouchMove?: (event: TouchEvent, info: GestureInfo) => void;
    onTouchEnd?: (event: TouchEvent, info: GestureInfo) => void;
    onSwipe?: (direction: SwipeDirection, info: GestureInfo) => void;
}

export class GestureRouter {
    private shell: UV7Shell;
    private appHandlers: Map<string, GestureHandlers>;
    private activeAppId: string | null;
    private touchStart: TouchPosition;
    private directionLocked: boolean;
    private lockedDirection: Direction;
    private shellAction: ShellAction;

    // Thresholds
    private readonly SHELL_ZONE_HEIGHT = 50; // Top 50px for shade
    private readonly DIRECTION_LOCK_THRESHOLD = 10; // px before locking direction
    private readonly SWIPE_THRESHOLD = 50; // px to trigger swipe action

    constructor(shell: UV7Shell) {
        this.shell = shell;
        this.appHandlers = new Map();
        this.activeAppId = null;

        // Touch state
        this.touchStart = { x: 0, y: 0 };
        this.directionLocked = false;
        this.lockedDirection = null;
        this.shellAction = null;

        // Bind handlers
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
    }

    /**
     * Initialize gesture handling
     */
    init(): void {
        // Use capture phase to intercept before apps
        document.addEventListener('touchstart', this.handleTouchStart, { capture: true, passive: false });
        document.addEventListener('touchmove', this.handleTouchMove, { capture: true, passive: false });
        document.addEventListener('touchend', this.handleTouchEnd, { capture: true, passive: false });

        console.log('[GestureRouter] Initialized');
    }

    /**
     * Register an app's gesture handlers
     * @param appId
     * @param handlers - { onTouchStart, onTouchMove, onTouchEnd, onSwipe }
     */
    registerApp(appId: string, handlers: GestureHandlers): void {
        this.appHandlers.set(appId, handlers);
        this.activeAppId = appId;
        console.log(`[GestureRouter] Registered handlers for: ${appId}`);
    }

    /**
     * Unregister an app's gesture handlers
     * @param appId
     */
    unregisterApp(appId: string): void {
        this.appHandlers.delete(appId);
        if (this.activeAppId === appId) {
            this.activeAppId = null;
        }
        console.log(`[GestureRouter] Unregistered handlers for: ${appId}`);
    }

    /**
     * Handle touch start
     */
    private handleTouchStart(e: TouchEvent): void {
        if (!e.touches.length) return;

        const touch = e.touches[0];
        this.touchStart = { x: touch.clientX, y: touch.clientY };
        this.directionLocked = false;
        this.lockedDirection = null;
        this.shellAction = null;

        // Check shell zones
        if (this.touchStart.y < this.SHELL_ZONE_HEIGHT) {
            // Top zone - potential shade gesture
            this.shellAction = 'shade-pending';
            // Don't prevent default yet - might be a tap on status bar
        }

        // If not in shell zone, delegate to app
        if (!this.shellAction && this.activeAppId) {
            const handlers = this.appHandlers.get(this.activeAppId);
            handlers?.onTouchStart?.(e);
        }
    }

    /**
     * Handle touch move
     */
    private handleTouchMove(e: TouchEvent): void {
        if (!e.touches.length) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - this.touchStart.x;
        const deltaY = touch.clientY - this.touchStart.y;

        // Determine direction lock if not yet locked
        if (!this.directionLocked) {
            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);

            if (absX > this.DIRECTION_LOCK_THRESHOLD || absY > this.DIRECTION_LOCK_THRESHOLD) {
                this.directionLocked = true;
                this.lockedDirection = absX > absY ? 'horizontal' : 'vertical';
            }
        }

        // Handle shell actions
        if (this.shellAction === 'shade-pending' && this.lockedDirection === 'vertical' && deltaY > 0) {
            // Confirmed pull-down
            this.shellAction = 'shell-trigger';
            e.preventDefault();
            e.stopPropagation();

            // Check orientation
            if (window.innerWidth > window.innerHeight) {
                // Landscape -> Sidebar
                this.shell.openSidebar();
            } else {
                // Portrait -> Shade
                this.shell.openShade();
            }
            return;
        }

        // If shell doesn't want it, delegate to app
        if (!this.shellAction && this.activeAppId) {
            const handlers = this.appHandlers.get(this.activeAppId);
            handlers?.onTouchMove?.(e, { deltaX, deltaY, direction: this.lockedDirection });
        }
    }

    /**
     * Handle touch end
     */
    private handleTouchEnd(e: TouchEvent): void {
        // If shell was handling, clean up
        if (this.shellAction) {
            // Shell action completed
            this.shellAction = null;
            return;
        }

        // Calculate final delta for swipe detection
        const touch = e.changedTouches[0];
        if (touch) {
            const deltaX = touch.clientX - this.touchStart.x;
            const deltaY = touch.clientY - this.touchStart.y;

            // Notify app of touch end or swipe
            if (this.activeAppId) {
                const handlers = this.appHandlers.get(this.activeAppId);

                // Check for swipe gesture
                if (this.directionLocked) {
                    if (this.lockedDirection === 'horizontal' && Math.abs(deltaX) > this.SWIPE_THRESHOLD) {
                        const direction: SwipeDirection = deltaX > 0 ? 'right' : 'left';
                        handlers?.onSwipe?.(direction, { deltaX, deltaY });
                    } else if (this.lockedDirection === 'vertical' && Math.abs(deltaY) > this.SWIPE_THRESHOLD) {
                        const direction: SwipeDirection = deltaY > 0 ? 'down' : 'up';
                        handlers?.onSwipe?.(direction, { deltaX, deltaY });
                    }
                }

                handlers?.onTouchEnd?.(e, { deltaX, deltaY });
            }
        }

        // Reset state
        this.directionLocked = false;
        this.lockedDirection = null;
    }

    /**
     * Destroy gesture handling (cleanup)
     */
    destroy(): void {
        document.removeEventListener('touchstart', this.handleTouchStart, { capture: true } as EventListenerOptions);
        document.removeEventListener('touchmove', this.handleTouchMove, { capture: true } as EventListenerOptions);
        document.removeEventListener('touchend', this.handleTouchEnd, { capture: true } as EventListenerOptions);
    }
}

export default GestureRouter;
