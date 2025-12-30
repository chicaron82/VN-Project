// @ts-check
// ========================================
// GRAB HANDLE REPOSITIONER
// Allows players to reposition the sidebar toggle button
// DIZEE Implementation - TRIPLE-THREAT EDITION
// ========================================

/**
 * GrabHandleRepositioner
 *
 * Makes the sidebar toggle (☰) button fully customizable:
 * - Drag vertically to reposition
 * - Drag horizontally to flip sides
 * - Double-tap to flip sides
 * - Settings toggle for explicit control
 *
 * Features:
 * - Touch & mouse drag support
 * - Vertical + horizontal dragging
 * - Double-tap side flip
 * - Position constraints (stays within safe zone)
 * - localStorage persistence
 * - Visual feedback during drag
 * - Haptic feedback (mobile)
 * - Sidebar slide direction adjustment
 *
 * @class GrabHandleRepositioner
 */
class GrabHandleRepositioner {
    /**
     * @param {any} game - Game engine instance
     */
    constructor(game) {
        this.game = game;
        this.grabHandle = document.getElementById('sidebar-toggle');
        this.sidebar = document.getElementById('sidebar');

        if (!this.grabHandle) {
            console.warn('Grab handle not found, repositioner disabled');
            return;
        }

        // Position state
        this.currentSide = 'left'; // 'left' or 'right'
        this.currentTop = 50; // Default: 50% (center)

        // Drag state
        this.isDragging = false;
        this.wasDragging = false;
        this.startY = 0;
        this.startX = 0;
        this.startTop = 0;
        this.latestClientY = 0;
        this.latestClientX = 0;
        this.rafPending = false;

        // Double-tap detection
        this.lastTapTime = 0;
        this.doubleTapDelay = 300; // ms
        this.isDoubleTapping = false;
        this.pendingTap = false; // Track if we're waiting to see if this is a double-tap
        this.tapTimeout = null; // Timer for single-tap confirmation

        // Constraints - use pixels for precise control
        // Status bar is 40px, add 10px buffer = 50px minimum from top
        // Backlog button area needs ~80px reserved at bottom
        this.minPixelsFromTop = 50; // Below status bar
        this.minPixelsFromBottom = 80; // Reserve space for backlog button

        // Horizontal flip threshold (% of screen width)
        this.flipThreshold = 50;

        // Load saved position
        this.loadPosition();

        // Setup event listeners
        this.setupEventListeners();

        console.log('✅ GrabHandleRepositioner initialized (TRIPLE-THREAT MODE)');
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    setupEventListeners() {
        if (!this.grabHandle) return;

        // Touch events (mobile)
        this.grabHandle.addEventListener('touchstart', (e) => this.handleDragStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.handleDragMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.handleDragEnd(e));

        // Mouse events (desktop)
        this.grabHandle.addEventListener('mousedown', (e) => this.handleDragStart(e));
        document.addEventListener('mousemove', (e) => this.handleDragMove(e));
        document.addEventListener('mouseup', (e) => this.handleDragEnd(e));

        // Prevent default click when dragging or double-tapping
        // Use capture phase to intercept before notification-shade-controller
        this.grabHandle.addEventListener('click', (e) => {
            // Always stop propagation - we handle all click behavior ourselves
            // This prevents notification-shade-controller from toggling sidebar on every tap
            e.stopPropagation();
            e.preventDefault();

            // If we were dragging, just reset and don't do anything
            if (this.wasDragging) {
                this.wasDragging = false;
                return;
            }

            // If double-tap was detected (already handled in handleDragStart)
            if (this.isDoubleTapping) {
                this.isDoubleTapping = false;
                return;
            }

            // Single tap - toggle sidebar after confirming it's not a double-tap
            // This is already handled by the tap timeout in handleDragStart
        }, true); // Capture phase
    }

    // ========================================
    // DRAG HANDLERS
    // ========================================

    /**
     * @param {MouseEvent | TouchEvent} e
     */
    handleDragStart(e) {
        if (!this.grabHandle) return;

        // Get position from touch or mouse
        const clientY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
        const clientX = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;

        // Clear any pending tap timeout
        if (this.tapTimeout) {
            clearTimeout(this.tapTimeout);
            this.tapTimeout = null;
        }

        // Double-tap detection
        const now = Date.now();
        const timeSinceLastTap = now - this.lastTapTime;

        if (timeSinceLastTap < this.doubleTapDelay && this.lastTapTime > 0) {
            // Double-tap detected! Flip sides
            this.flipSide();
            this.lastTapTime = 0; // Reset
            this.isDoubleTapping = true; // Prevent click event
            this.pendingTap = false;

            // Clear any pending drag timeout
            if (this.dragStartTimeout) {
                clearTimeout(this.dragStartTimeout);
                this.dragStartTimeout = null;
            }

            return;
        }

        this.lastTapTime = now;
        this.isDoubleTapping = false;
        this.pendingTap = true;

        // Store start position
        this.startY = clientY;
        this.startX = clientX;

        // Only start drag if held for 300ms (prevents accidental drags when clicking)
        this.dragStartTimeout = setTimeout(() => {
            this.isDragging = true;
            this.pendingTap = false; // No longer a tap, it's a drag

            // Get current position
            const rect = this.grabHandle.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            this.startTop = (rect.top + rect.height / 2) / viewportHeight * 100;

            // Visual feedback
            this.grabHandle.classList.add('dragging');
            this.grabHandle.style.transition = 'none'; // Disable smooth transition during drag

            // Haptic feedback
            this.triggerHaptic('medium');

            // Prevent text selection
            e.preventDefault();
        }, 300);

        // Set up single-tap timeout - if no second tap within doubleTapDelay, toggle sidebar
        this.tapTimeout = setTimeout(() => {
            // Only toggle if we didn't start dragging and it wasn't a double-tap
            if (this.pendingTap && !this.isDragging && !this.isDoubleTapping) {
                this.toggleSidebar();
                this.pendingTap = false;
            }
        }, this.doubleTapDelay + 50); // Slightly longer than double-tap window

        // Store for cleanup
        this.pendingDragStart = true;
    }

    /**
     * @param {MouseEvent | TouchEvent} e
     */
    handleDragMove(e) {
        if (!this.isDragging) {
            // If finger moves before 300ms timeout, cancel drag start
            if (this.pendingDragStart && this.dragStartTimeout) {
                clearTimeout(this.dragStartTimeout);
                this.pendingDragStart = false;
            }
            return;
        }

        if (!this.grabHandle) return;

        // Get position from touch or mouse
        const clientY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
        const clientX = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;

        // Store the latest position for RAF
        this.latestClientY = clientY;
        this.latestClientX = clientX;

        // Prevent scrolling on mobile
        if (e instanceof TouchEvent && e.cancelable) {
            e.preventDefault();
        }

        // Use requestAnimationFrame for smooth updates
        if (!this.rafPending) {
            this.rafPending = true;
            requestAnimationFrame(() => {
                this.updateDragPosition();
                this.rafPending = false;
            });
        }
    }

    updateDragPosition() {
        if (!this.grabHandle || !this.isDragging) return;

        // Calculate deltas using latest position
        const deltaY = this.latestClientY - this.startY;
        const deltaX = this.latestClientX - this.startX;

        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Determine primary drag direction (vertical vs horizontal)
        const dragDirection = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';

        if (dragDirection === 'horizontal') {
            // Horizontal drag - check if we should flip sides
            const deltaPercent = Math.abs(deltaX) / viewportWidth * 100;

            // Visual feedback - add crossing class when past threshold
            if (deltaPercent > this.flipThreshold) {
                this.grabHandle.classList.add('crossing-threshold');
            } else {
                this.grabHandle.classList.remove('crossing-threshold');
            }

            // Store that we're doing a horizontal flip
            this.horizontalFlipPending = deltaPercent > this.flipThreshold;

        } else {
            // Vertical drag - reposition
            const deltaPercent = (deltaY / viewportHeight) * 100;

            // Calculate new position
            let newTop = this.startTop + deltaPercent;

            // Apply pixel-based constraints (convert to percent for storage)
            const minPercent = (this.minPixelsFromTop / viewportHeight) * 100;
            const maxPercent = ((viewportHeight - this.minPixelsFromBottom) / viewportHeight) * 100;

            newTop = Math.max(minPercent, Math.min(maxPercent, newTop));

            // Update position using transform for better performance
            this.currentTop = newTop;
            this.grabHandle.style.top = `${newTop}%`;
        }
    }

    /**
     * @param {MouseEvent | TouchEvent} e
     */
    handleDragEnd(e) {
        // Clear timeout if drag didn't start
        if (this.dragStartTimeout) {
            clearTimeout(this.dragStartTimeout);
            this.dragStartTimeout = null;
        }

        this.pendingDragStart = false;

        if (!this.isDragging) return;
        if (!this.grabHandle) return;

        this.isDragging = false;
        this.pendingTap = false; // Clear pending tap since we were dragging

        // Clear tap timeout when drag ends (prevents toggle after drag)
        if (this.tapTimeout) {
            clearTimeout(this.tapTimeout);
            this.tapTimeout = null;
        }

        // Check if we need to flip sides (horizontal drag)
        if (this.horizontalFlipPending) {
            this.flipSide();
            this.horizontalFlipPending = false;
        }

        // Enforce pixel-based constraints on drop
        const viewportHeight = window.innerHeight;
        const minPercent = (this.minPixelsFromTop / viewportHeight) * 100;
        const maxPercent = ((viewportHeight - this.minPixelsFromBottom) / viewportHeight) * 100;

        this.currentTop = Math.max(minPercent, Math.min(maxPercent, this.currentTop));
        this.grabHandle.style.top = `${this.currentTop}%`;

        // Visual feedback
        this.grabHandle.classList.remove('dragging', 'crossing-threshold');
        this.grabHandle.style.transition = ''; // Re-enable smooth transitions

        // Save position
        this.savePosition();

        // Haptic feedback
        this.triggerHaptic('light');

        // Mark that we were dragging (to prevent click event from firing)
        this.wasDragging = true;
        setTimeout(() => {
            this.wasDragging = false;
        }, 100);

        console.log(`📍 Grab handle: ${this.currentSide} side, ${Math.round(this.currentTop)}% from top`);
    }

    // ========================================
    // SIDEBAR TOGGLE
    // ========================================

    toggleSidebar() {
        // Find notification shade controller to toggle sidebar
        if (window.game && window.game.notificationShade) {
            window.game.notificationShade.toggleSidebar();
        }
    }

    // ========================================
    // SIDE FLIPPING
    // ========================================

    flipSide() {
        if (!this.grabHandle) return;

        // Toggle side
        const newSide = this.currentSide === 'left' ? 'right' : 'left';
        this.setSide(newSide);

        // Haptic feedback
        this.triggerHaptic('heavy');

        console.log(`🔄 Flipped to ${newSide} side`);
    }

    /**
     * Set which side the handle is on
     * @param {'left' | 'right'} side
     */
    setSide(side) {
        if (!this.grabHandle || !this.sidebar) return;

        this.currentSide = side;

        // Update handle position and styling
        if (side === 'right') {
            // Position on right side
            this.grabHandle.style.left = 'auto';
            this.grabHandle.style.right = '0';
            this.grabHandle.style.borderRadius = '10px 0 0 10px';
            this.grabHandle.style.borderRight = 'none';
            this.grabHandle.style.borderLeft = '1px solid rgba(0, 255, 255, 0.3)';

            // Update sidebar slide direction
            this.sidebar.style.left = 'auto';
            this.sidebar.style.right = '0';
            this.sidebar.style.transform = 'translateX(100%)';

            // When expanded on right
            this.sidebar.classList.add('right-side');

        } else {
            // Position on left side (default)
            this.grabHandle.style.left = '0';
            this.grabHandle.style.right = 'auto';
            this.grabHandle.style.borderRadius = '0 10px 10px 0';
            this.grabHandle.style.borderLeft = 'none';
            this.grabHandle.style.borderRight = '1px solid rgba(0, 255, 255, 0.3)';

            // Update sidebar slide direction
            this.sidebar.style.left = '0';
            this.sidebar.style.right = 'auto';
            this.sidebar.style.transform = 'translateX(-100%)';

            // When expanded on left
            this.sidebar.classList.remove('right-side');
        }

        // Update toggle button position when sidebar is expanded
        this.updateTogglePositionForExpandedSidebar();

        // Save position
        this.savePosition();
    }

    updateTogglePositionForExpandedSidebar() {
        if (!this.grabHandle || !this.sidebar) return;

        // Check if sidebar is expanded
        const isExpanded = this.sidebar.classList.contains('expanded');

        if (isExpanded) {
            if (this.currentSide === 'right') {
                // Move toggle to left edge of sidebar when expanded on right
                this.grabHandle.style.right = '300px';
            } else {
                // Move toggle to right edge of sidebar when expanded on left
                this.grabHandle.style.left = '300px';
            }
        }
    }

    // ========================================
    // PERSISTENCE
    // ========================================

    loadPosition() {
        try {
            const saved = localStorage.getItem('grabHandlePosition');
            if (saved) {
                const position = JSON.parse(saved);
                this.currentTop = position.topPercent || 50;
                this.currentSide = position.side || 'left';
                this.applyPosition();
                console.log(`💾 Loaded grab handle: ${this.currentSide} side, ${Math.round(this.currentTop)}%`);
            } else {
                // Default position (left, 50% - center)
                this.applyPosition();
            }
        } catch (error) {
            console.warn('Failed to load grab handle position:', error);
            this.applyPosition();
        }
    }

    savePosition() {
        try {
            const position = {
                topPercent: this.currentTop,
                side: this.currentSide,
                timestamp: Date.now()
            };
            localStorage.setItem('grabHandlePosition', JSON.stringify(position));
            console.log('💾 Saved grab handle position');
        } catch (error) {
            console.warn('Failed to save grab handle position:', error);
        }
    }

    applyPosition() {
        if (!this.grabHandle) return;

        // Remove old transform-based positioning
        this.grabHandle.style.transform = 'translateY(-50%)';

        // Apply vertical position
        this.grabHandle.style.top = `${this.currentTop}%`;

        // Apply side
        this.setSide(this.currentSide);
    }

    // ========================================
    // HAPTIC FEEDBACK
    // ========================================

    /**
     * @param {'light' | 'medium' | 'heavy'} type
     */
    triggerHaptic(type = 'light') {
        // Check if Vibration API is supported
        if (!navigator.vibrate) return;

        const patterns = {
            light: 10,
            medium: 20,
            heavy: [30, 10, 30]
        };

        const pattern = patterns[type] || patterns.light;

        try {
            navigator.vibrate(pattern);
        } catch (error) {
            // Silently fail
        }
    }

    // ========================================
    // PUBLIC API
    // ========================================

    /**
     * Reset handle to default position (left side, center)
     */
    resetToDefault() {
        this.currentTop = 50;
        this.currentSide = 'left';
        this.applyPosition();
        this.savePosition();
        console.log('🔄 Grab handle reset to default position');
    }

    /**
     * Get current side (for settings menu integration)
     * @returns {'left' | 'right'}
     */
    getSide() {
        return this.currentSide;
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    // @ts-ignore
    window.GrabHandleRepositioner = GrabHandleRepositioner;
}

// ES Module export
export { GrabHandleRepositioner };
