// @ts-check
/**
 * ═══════════════════════════════════════════════════════════════
 * TAB SWIPE CONTROLLER - Facebook-Style 1:1 Direct Manipulation
 * ═══════════════════════════════════════════════════════════════
 * 
 * Implements gesture-driven tab navigation with:
 * - Finger-tracked indicator (LERP interpolation)
 * - Content panning (follows swipe)
 * - Spring physics (bouncy settle)
 * - Velocity-based commit
 * 
 * Contributors:
 * - Tori: Pointer Events architecture, edge resistance
 * - Belle: LERP math, indicator interpolation
 * - Zee: Spring easing, momentum physics
 * - Antigravity: Accessibility, reduced motion, state integration
 * ═══════════════════════════════════════════════════════════════
 */

export class TabSwipeController {
    /**
     * @param {Object} config
     * @param {HTMLElement} config.viewport - Content viewport to attach swipe listeners
     * @param {HTMLElement} config.track - Flex container holding tab panels
     * @param {NodeListOf<HTMLElement>} config.panels - Individual tab panels
     * @param {HTMLElement} config.indicator - Tab indicator element
     * @param {Function} config.onCommit - Callback when swipe commits to new tab
     * @param {Function} config.getCurrentIndex - Get current active tab index
     * @param {number} config.tabCount - Total number of tabs
     * @param {Object} config.tabController - TabController instance for LERP updates
     */
    constructor(config) {
        this.viewport = config.viewport;
        this.track = config.track;
        this.panels = config.panels;
        this.indicator = config.indicator;
        this.onCommit = config.onCommit;
        this.getCurrentIndex = config.getCurrentIndex;
        this.tabCount = config.tabCount;
        this.tabController = config.tabController;

        // State
        /** @type {{isDragging: boolean, startX: number, currentX: number, startTime: number, pointerId: number|null}} */
        this.state = {
            isDragging: false,
            startX: 0,
            currentX: 0,
            startTime: 0,
            pointerId: null
        };

        // Velocity tracking
        this.velocityTracker = new MomentumTracker();

        // Thresholds
        this.DISTANCE_THRESHOLD = 0.18; // 18% of viewport width
        this.VELOCITY_THRESHOLD = 650; // px/s
        this.EDGE_RESISTANCE = 0.25; // Damping at first/last tab

        // Performance
        this.rafId = null;

        // Check for reduced motion preference
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.init();
    }

    init() {
        // Pointer Events (unified touch/mouse)
        this.viewport.addEventListener('pointerdown', this.onPointerDown);
        this.viewport.addEventListener('pointermove', this.onPointerMove);
        this.viewport.addEventListener('pointerup', this.onPointerUp);
        this.viewport.addEventListener('pointercancel', this.onPointerCancel);

        // Prevent default touch behavior on viewport
        this.viewport.style.touchAction = 'pan-y'; // Allow vertical scroll only

        // Enable flex layout for swipe panning
        this.viewport.classList.add('swipe-enabled');

        console.log('✅ TabSwipeController initialized');
    }

    // ═══════════════════════════════════════════════════════════════
    // POINTER EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════

    /**
     * @param {PointerEvent} e
     */
    onPointerDown = (e) => {
        // Ignore if not primary pointer (multi-touch)
        if (!e.isPrimary) return;

        // Ignore if clicking on interactive elements
        const target = /** @type {HTMLElement} */(e.target);
        if (target.closest('button, a, input, textarea, [contenteditable]')) {
            return;
        }

        // Start tracking
        this.state.isDragging = true;
        this.state.startX = e.clientX;
        this.state.currentX = e.clientX;
        this.state.startTime = Date.now();
        this.state.pointerId = e.pointerId;

        // Capture pointer so we don't lose it during drag
        this.viewport.setPointerCapture(e.pointerId);

        // Reset velocity tracker
        this.velocityTracker.reset();
        this.velocityTracker.update(e.clientX);

        // Add dragging class (disables CSS transitions)
        this.indicator.classList.add('dragging');
        this.track.classList.add('dragging');

        console.log('🖐️ Swipe started at', e.clientX);
    }

    /**
     * @param {PointerEvent} e
     */
    onPointerMove = (e) => {
        if (!this.state.isDragging) return;
        if (e.pointerId !== this.state.pointerId) return;

        // Throttle with RAF
        if (this.rafId) return;

        this.rafId = requestAnimationFrame(() => {
            this.state.currentX = e.clientX;
            const deltaX = this.state.currentX - this.state.startX;

            // Update velocity tracker
            this.velocityTracker.update(e.clientX);

            // Update visuals
            this.updateDragVisuals(deltaX);

            this.rafId = null;
        });
    }

    /**
     * @param {PointerEvent} e
     */
    onPointerUp = (e) => {
        if (!this.state.isDragging) return;
        if (e.pointerId !== this.state.pointerId) return;

        const deltaX = this.state.currentX - this.state.startX;
        const velocity = this.velocityTracker.getVelocity();

        console.log('🖐️ Swipe ended - deltaX:', deltaX, 'velocity:', velocity);

        // Release pointer capture
        this.viewport.releasePointerCapture(e.pointerId);

        // Determine commit or cancel
        this.handleSwipeEnd(deltaX, velocity);

        // Cleanup
        this.cleanup();
    }

    /**
     * @param {PointerEvent} e
     */
    onPointerCancel = (e) => {
        if (e.pointerId !== this.state.pointerId) return;

        console.log('❌ Swipe cancelled');

        // Cancel transition
        this.cancelTransition();
        this.cleanup();
    }

    // ═══════════════════════════════════════════════════════════════
    // VISUAL UPDATES DURING DRAG
    // ═══════════════════════════════════════════════════════════════

    /**
     * @param {number} deltaX
     */
    updateDragVisuals(deltaX) {
        const currentIndex = this.getCurrentIndex();
        const viewportWidth = this.viewport.offsetWidth;

        // Determine direction and target tab
        const direction = deltaX > 0 ? -1 : 1; // Swipe right = previous tab
        const targetIndex = currentIndex + direction;

        // Apply edge resistance if at boundaries
        let adjustedDelta = deltaX;
        if (targetIndex < 0 || targetIndex >= this.tabCount) {
            adjustedDelta *= this.EDGE_RESISTANCE;
            console.log('🛑 Edge resistance applied:', adjustedDelta);
        }

        // Calculate progress (0 to 1)
        const progress = Math.min(1, Math.abs(adjustedDelta) / viewportWidth);

        console.log(`📊 Drag: deltaX=${deltaX.toFixed(0)}px, progress=${(progress * 100).toFixed(1)}%, target=${targetIndex}`);

        // Phase 2: Update indicator position with LERP
        if (this.tabController && targetIndex >= 0 && targetIndex < this.tabCount) {
            // @ts-ignore - tabController is TabController instance
            this.tabController.updateIndicatorPosition(currentIndex, targetIndex, progress);

            // Add glow near threshold
            if (progress > 0.7) {
                this.indicator.classList.add('near-threshold');
            } else {
                this.indicator.classList.remove('near-threshold');
            }
        }

        // Phase 3: Update content panning
        const currentIndex = this.getCurrentIndex();
        const baseOffset = -currentIndex * 100; // Current tab position (%)
        const dragOffset = (adjustedDelta / viewportWidth) * 100; // Drag as percentage

        // Apply transform to track (negative because we're dragging content)
        this.track.style.transform = `translateX(calc(${baseOffset}% + ${-dragOffset}%))`;
    }

    // ═══════════════════════════════════════════════════════════════
    // COMMIT / CANCEL LOGIC
    // ═══════════════════════════════════════════════════════════════

    /**
     * @param {number} deltaX
     * @param {number} velocity
     */
    handleSwipeEnd(deltaX, velocity) {
        const viewportWidth = this.viewport.offsetWidth;
        const distanceThreshold = viewportWidth * this.DISTANCE_THRESHOLD;

        // Check if should commit
        const shouldCommit =
            Math.abs(deltaX) > distanceThreshold ||
            Math.abs(velocity) > this.VELOCITY_THRESHOLD;

        if (shouldCommit) {
            this.commitTransition(deltaX);
        } else {
            this.cancelTransition();
        }
    }

    /**
     * @param {number} deltaX
     */
    commitTransition(deltaX) {
        const direction = deltaX > 0 ? -1 : 1;
        const currentIndex = this.getCurrentIndex();
        const targetIndex = currentIndex + direction;

        // Boundary check
        if (targetIndex < 0 || targetIndex >= this.tabCount) {
            console.log('⛔ Cannot commit - out of bounds');
            this.cancelTransition();
            return;
        }

        console.log(`✅ Commit transition: ${currentIndex} → ${targetIndex}`);

        // Remove dragging class (re-enable transitions)
        this.indicator.classList.remove('dragging');
        this.track.classList.remove('dragging');

        // Reset indicator glow
        this.indicator.classList.remove('near-threshold');

        // Phase 4: Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(10); // Subtle tap
        }

        // Trigger commit callback (TabController will handle the transition)
        this.onCommit(targetIndex);

        // Phase 4: Spring animation for content
        // TabController handles the actual tab switch, we just need to reset transform
        setTimeout(() => {
            const newIndex = this.getCurrentIndex();
            const baseOffset = -newIndex * 100;
            this.track.style.transform = `translateX(${baseOffset}%)`;
        }, 50); // Small delay to let TabController update first
    }

    cancelTransition() {
        console.log('↩️ Cancel transition - spring back');

        // Remove dragging class (re-enable spring transition)
        this.indicator.classList.remove('dragging');
        this.track.classList.remove('dragging');

        // Phase 4: Spring back to original position
        const currentIndex = this.getCurrentIndex();
        const baseOffset = -currentIndex * 100;
        this.track.style.transform = `translateX(${baseOffset}%)`;

        // Reset indicator glow
        this.indicator.classList.remove('near-threshold');
    }

    // ═══════════════════════════════════════════════════════════════
    // CLEANUP
    // ═══════════════════════════════════════════════════════════════

    cleanup() {
        this.state.isDragging = false;
        this.state.pointerId = null;

        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    destroy() {
        this.viewport.removeEventListener('pointerdown', this.onPointerDown);
        this.viewport.removeEventListener('pointermove', this.onPointerMove);
        this.viewport.removeEventListener('pointerup', this.onPointerUp);
        this.viewport.removeEventListener('pointercancel', this.onPointerCancel);
        this.cleanup();
    }
}

// ═══════════════════════════════════════════════════════════════
// MOMENTUM TRACKER - Velocity Calculation
// ═══════════════════════════════════════════════════════════════

class MomentumTracker {
    constructor() {
        /** @type {Array<{x: number, time: number}>} */
        this.positions = [];
        this.maxSamples = 5;
    }

    reset() {
        this.positions = [];
    }

    /**
     * @param {number} x
     */
    update(x) {
        const now = Date.now();
        this.positions.push({ x, time: now });

        // Keep only recent samples
        if (this.positions.length > this.maxSamples) {
            this.positions.shift();
        }
    }

    getVelocity() {
        if (this.positions.length < 2) return 0;

        const first = this.positions[0];
        const last = this.positions[this.positions.length - 1];

        const deltaX = last.x - first.x;
        const deltaT = (last.time - first.time) / 1000; // seconds

        return deltaT > 0 ? deltaX / deltaT : 0;
    }
}
