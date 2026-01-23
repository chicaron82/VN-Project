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

export class GestureRouter {
    /**
     * @param {import('./UV7Shell.js').UV7Shell} shell 
     */
    constructor(shell) {
        this.shell = shell;

        /** @type {Map<string, Object>} */
        this.appHandlers = new Map();

        /** @type {string|null} */
        this.activeAppId = null;

        // Touch state
        this.touchStart = { x: 0, y: 0 };
        this.directionLocked = false;
        this.lockedDirection = null; // 'horizontal' | 'vertical' | null
        this.shellAction = null; // 'shade' | 'sidebar' | null

        // Thresholds
        this.SHELL_ZONE_HEIGHT = 50; // Top 50px for shade
        this.DIRECTION_LOCK_THRESHOLD = 10; // px before locking direction
        this.SWIPE_THRESHOLD = 50; // px to trigger swipe action

        // Bind handlers
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
    }

    /**
     * Initialize gesture handling
     */
    init() {
        // Use capture phase to intercept before apps
        document.addEventListener('touchstart', this.handleTouchStart, { capture: true, passive: false });
        document.addEventListener('touchmove', this.handleTouchMove, { capture: true, passive: false });
        document.addEventListener('touchend', this.handleTouchEnd, { capture: true, passive: false });

        console.log('[GestureRouter] Initialized');
    }

    /**
     * Register an app's gesture handlers
     * @param {string} appId 
     * @param {Object} handlers - { onTouchStart, onTouchMove, onTouchEnd, onSwipe }
     */
    registerApp(appId, handlers) {
        this.appHandlers.set(appId, handlers);
        this.activeAppId = appId;
        console.log(`[GestureRouter] Registered handlers for: ${appId}`);
    }

    /**
     * Unregister an app's gesture handlers
     * @param {string} appId 
     */
    unregisterApp(appId) {
        this.appHandlers.delete(appId);
        if (this.activeAppId === appId) {
            this.activeAppId = null;
        }
        console.log(`[GestureRouter] Unregistered handlers for: ${appId}`);
    }

    /**
     * Handle touch start
     * @param {TouchEvent} e 
     */
    handleTouchStart(e) {
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
     * @param {TouchEvent} e 
     */
    handleTouchMove(e) {
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
            // Confirmed shade pull-down
            this.shellAction = 'shade';
            e.preventDefault();
            e.stopPropagation();
            this.shell.openShade();
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
     * @param {TouchEvent} e 
     */
    handleTouchEnd(e) {
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
                        const direction = deltaX > 0 ? 'right' : 'left';
                        handlers?.onSwipe?.(direction, { deltaX, deltaY });
                    } else if (this.lockedDirection === 'vertical' && Math.abs(deltaY) > this.SWIPE_THRESHOLD) {
                        const direction = deltaY > 0 ? 'down' : 'up';
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
    destroy() {
        document.removeEventListener('touchstart', this.handleTouchStart, { capture: true });
        document.removeEventListener('touchmove', this.handleTouchMove, { capture: true });
        document.removeEventListener('touchend', this.handleTouchEnd, { capture: true });
    }
}

export default GestureRouter;
