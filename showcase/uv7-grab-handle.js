/**
 * ========================================
 * UV7 OS - GRAB HANDLE REPOSITIONER
 * V1 Parity Port - Complete Implementation
 * ========================================
 *
 * Works across Landing + Showcase + anywhere that has #uv7-sidebar-toggle
 * Faithful port of V1's 633-line grab-handle-repositioner.js
 *
 * Features:
 * - 300ms drag delay (prevents accidental drags while tapping)
 * - Tap-to-toggle sidebar (single tap opens/closes)
 * - Custom double-tap detection (300ms threshold, mobile-friendly)
 * - Horizontal drag to flip sides (50% threshold with visual feedback)
 * - RAF-based smooth updates (60fps drag rendering)
 * - Haptic feedback patterns (light/medium/heavy)
 * - Visual feedback classes (.uv7-dragging, .uv7-crossing-threshold)
 *
 * "Built with love. 💚🔥💀"
 */

class UV7GrabHandleRepositioner {
    constructor(toggleEl, options = {}) {
        this.el = toggleEl;
        if (!this.el) return;

        // Options
        this.storageKey = options.storageKey || 'uv7-grab-handle';
        this.headerSafeTop = options.headerSafeTop ?? 52;
        this.bottomSafePad = options.bottomSafePad ?? 120;
        this.onToggle = options.onToggle || null; // Callback for tap-to-toggle

        // State
        this.state = this.load() || { top: 140, side: 'left' };

        // Drag state
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.isDragDelayActive = false;
        this.dragDelayTimer = null;
        this.wasDragging = false;

        // RAF state
        this.rafPending = false;

        // Tap state
        this.lastTapTime = 0;
        this.tapTimeout = null;
        this.isDoubleTapping = false;
        this.pendingTap = false;

        // Touch/Mouse state
        this.usingTouch = false;
        this.touchPreventTimer = null;

        // Horizontal flip state
        this.horizontalFlipPending = false;

        // Constants
        this.HOLD_DELAY = 300; // ms before drag starts
        this.DOUBLE_TAP_DELAY = 300; // ms window for double-tap
        this.FLIP_THRESHOLD = 50; // % of screen width
        this.MIN_DRAG_DISTANCE = 5; // px to distinguish tap from drag

        this.apply();
        this.bind();

        console.log('✅ UV7GrabHandleRepositioner V1 Parity Complete', this.state);
    }

    bind() {
        // ========================================
        // MOUSE EVENTS (Desktop)
        // ========================================
        this.el.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));

        // ========================================
        // TOUCH EVENTS (Mobile)
        // ========================================
        this.el.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        window.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        window.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });

        // ========================================
        // CLICK INTERCEPTION (Prevent clicks during drag)
        // ========================================
        this.el.addEventListener('click', (e) => this.handleClick(e), { capture: true });

        // ========================================
        // RESIZE/ORIENTATION
        // ========================================
        window.addEventListener('resize', () => {
            this.clamp();
            this.apply();
            this.save();
        });
    }

    // ========================================
    // MOUSE HANDLERS
    // ========================================

    handleMouseDown(e) {
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
        this.isDragDelayActive = true;
        this.horizontalFlipPending = false;

        // V1 Parity: 300ms hold delay before drag starts
        this.dragDelayTimer = setTimeout(() => {
            this.isDragDelayActive = false;
            if (this.dragStartX !== 0) {
                this.startDrag();
            }
        }, this.HOLD_DELAY);

        e.preventDefault(); // Prevent text selection
    }

    handleMouseMove(e) {
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

    handleMouseUp(e) {
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

    handleTouchStart(e) {
        const touch = e.touches[0];
        if (!touch) return;

        // Mark as using touch
        this.usingTouch = true;
        if (this.touchPreventTimer) clearTimeout(this.touchPreventTimer);
        this.touchPreventTimer = setTimeout(() => {
            this.usingTouch = false;
        }, 500);

        this.dragStartX = touch.clientX;
        this.dragStartY = touch.clientY;
        this.currentX = touch.clientX;
        this.currentY = touch.clientY;
        this.isDragDelayActive = true;
        this.horizontalFlipPending = false;

        // V1 Parity: 300ms hold delay
        this.dragDelayTimer = setTimeout(() => {
            this.isDragDelayActive = false;
            if (this.dragStartX !== 0) {
                this.startDrag();
            }
        }, this.HOLD_DELAY);
    }

    handleTouchMove(e) {
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

    handleTouchEnd(e) {
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

    handleTap() {
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

        this.tapTimeout = setTimeout(() => {
            if (this.pendingTap && !this.isDoubleTapping) {
                // Single tap confirmed - toggle sidebar
                this.toggleSidebar();
                this.triggerHaptic('medium');
            }
            this.pendingTap = false;
            this.tapTimeout = null;
        }, this.DOUBLE_TAP_DELAY + 50);
    }

    // ========================================
    // CLICK INTERCEPTION
    // ========================================

    handleClick(e) {
        // Prevent click if we just finished dragging
        if (this.wasDragging || this.isDoubleTapping) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    // ========================================
    // DRAG LOGIC
    // ========================================

    startDrag() {
        this.isDragging = true;
        if (this.el) {
            this.el.classList.add('uv7-dragging');
        }
        this.triggerHaptic('light');
    }

    updateDragPosition() {
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
                if (this.el) {
                    this.el.classList.add('uv7-crossing-threshold');
                }
                this.triggerHaptic('medium');
            }
        } else {
            if (this.horizontalFlipPending) {
                this.horizontalFlipPending = false;
                if (this.el) {
                    this.el.classList.remove('uv7-crossing-threshold');
                }
            }
        }

        // Update vertical position
        this.state.top += deltaY;
        this.clamp();
        this.apply();

        // Update drag start for next frame
        this.dragStartX = this.currentX;
        this.dragStartY = this.currentY;
    }

    endDrag() {
        this.isDragging = false;
        if (this.el) {
            this.el.classList.remove('uv7-dragging');
            this.el.classList.remove('uv7-crossing-threshold');
        }
        this.horizontalFlipPending = false;
        this.save();
        this.triggerHaptic('light');
    }

    // ========================================
    // SIDEBAR INTEGRATION
    // ========================================

    toggleSidebar() {
        // Call callback if provided
        if (this.onToggle && typeof this.onToggle === 'function') {
            this.onToggle();
        }
        console.log('[UV7GrabHandle] 👆 Tap-to-toggle sidebar');
    }

    flipSide() {
        this.state.side = this.state.side === 'left' ? 'right' : 'left';
        this.apply();
        this.save();
        console.log('[UV7GrabHandle] 🔄 Flipped side ->', this.state.side);
    }

    // ========================================
    // POSITION MANAGEMENT
    // ========================================

    clamp() {
        const min = this.headerSafeTop;
        const max = Math.max(min, window.innerHeight - this.bottomSafePad);
        this.state.top = Math.max(min, Math.min(max, this.state.top));
    }

    apply() {
        this.el.style.position = 'fixed';
        this.el.style.top = `${Math.round(this.state.top)}px`;

        if (this.state.side === 'left') {
            this.el.style.left = '0';
            this.el.style.right = 'auto';
        } else {
            this.el.style.right = '0';
            this.el.style.left = 'auto';
        }

        this.el.dataset.side = this.state.side;
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    }

    load() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    // ========================================
    // HAPTIC FEEDBACK
    // ========================================

    triggerHaptic(type) {
        // Vibration patterns
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

// Make globally available
window.UV7GrabHandleRepositioner = UV7GrabHandleRepositioner;
