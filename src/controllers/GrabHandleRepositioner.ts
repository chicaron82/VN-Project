// ========================================
// GRAB HANDLE REPOSITIONER
// Allows players to reposition the sidebar toggle button
// DIZEE Implementation - TRIPLE-THREAT EDITION
// ========================================

type Side = 'left' | 'right';
type HapticType = 'light' | 'medium' | 'heavy';
type DragDirection = 'horizontal' | 'vertical';

interface SavedPosition {
    topPercent: number;
    side: Side;
    timestamp: number;
}

interface WindowWithGame {
    game?: {
        notificationShade?: {
            toggleSidebar: () => void;
        };
    };
}

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
 * "Built with love. TRIPLE-THREAT MODE activated." 💚🔥💀
 */
export class GrabHandleRepositioner {
    private grabHandle: HTMLElement | null;
    private sidebar: HTMLElement | null;

    // Position state
    private currentSide: Side = 'left';
    private currentTop: number = 50; // Default: 50% (center)

    // Drag state
    private isDragging: boolean = false;
    private wasDragging: boolean = false;
    private startY: number = 0;
    private startX: number = 0;
    private startTop: number = 0;
    private latestClientY: number = 0;
    private latestClientX: number = 0;
    private rafPending: boolean = false;

    // Double-tap detection
    private lastTapTime: number = 0;
    private doubleTapDelay: number = 300; // ms
    private isDoubleTapping: boolean = false;
    private pendingTap: boolean = false;
    private tapTimeout: ReturnType<typeof setTimeout> | null = null;
    private dragStartTimeout: ReturnType<typeof setTimeout> | null = null;
    private pendingDragStart: boolean = false;
    private horizontalFlipPending: boolean = false;
    private usingTouch: boolean = false;

    // Constraints - use pixels for precise control
    // Status bar is 40px, add 10px buffer = 50px minimum from top
    // Backlog button area needs ~80px reserved at bottom
    private minPixelsFromTop: number = 50; // Below status bar
    private minPixelsFromBottom: number = 80; // Reserve space for backlog button

    // Horizontal flip threshold (% of screen width)
    private flipThreshold: number = 50;

    constructor() {
        this.grabHandle = document.getElementById('sidebar-toggle');
        this.sidebar = document.getElementById('sidebar');

        // ========================================
        // EARLY RETURN IF NO GRAB HANDLE
        // ========================================
        if (!this.grabHandle) {
            console.warn('Grab handle not found, repositioner disabled');
            return;
        }

        // Load saved position
        this.loadPosition();

        // Setup event listeners
        this.setupEventListeners();

        console.log('✅ GrabHandleRepositioner initialized (TRIPLE-THREAT MODE)');
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    private setupEventListeners(): void {
        if (!this.grabHandle) return;

        // Touch events (mobile)
        this.grabHandle.addEventListener('touchstart', (e) => {
            this.usingTouch = true;
            this.handleDragStart(e);
        }, { passive: false });
        document.addEventListener('touchmove', (e) => this.handleDragMove(e), { passive: false });
        document.addEventListener('touchend', (e) => {
            this.handleDragEnd(e);
            // Reset touch flag after a delay (prevents mouse events from immediately following)
            setTimeout(() => { this.usingTouch = false; }, 500);
        });

        // Mouse events (desktop) - skip if touch was just used
        this.grabHandle.addEventListener('mousedown', (e) => {
            if (this.usingTouch) return; // Ignore mouse events if touch was just used
            this.handleDragStart(e);
        });
        document.addEventListener('mousemove', (e) => {
            if (this.usingTouch) return;
            this.handleDragMove(e);
        });
        document.addEventListener('mouseup', (e) => {
            if (this.usingTouch) return;
            this.handleDragEnd(e);
        });

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

    private handleDragStart(e: MouseEvent | TouchEvent): void {
        if (!this.grabHandle) return;

        // Get position from touch or mouse
        let clientY: number;
        let clientX: number;

        if (e instanceof TouchEvent) {
            if (e.touches.length > 0) {
                // We checked length, so we know index 0 exists
                const touch = e.touches[0]!;
                clientY = touch.clientY;
                clientX = touch.clientX;
            } else {
                return; // No touches to track
            }
        } else {
            clientY = e.clientY;
            clientX = e.clientX;
        }

        // Clear any pending tap timeout
        if (this.tapTimeout) {
            clearTimeout(this.tapTimeout);
            this.tapTimeout = null;
        }

        // Double-tap detection
        const now = Date.now();
        const timeSinceLastTap = now - this.lastTapTime;

        console.log(`🖱️ Tap detected: timeSince=${timeSinceLastTap}ms, lastTapTime=${this.lastTapTime}, threshold=${this.doubleTapDelay}ms`);

        if (timeSinceLastTap < this.doubleTapDelay && this.lastTapTime > 0) {
            // Double-tap detected! Flip sides
            console.log('✅ DOUBLE-TAP DETECTED - Flipping sides');
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

        console.log('⏱️ First tap or too slow - waiting for potential second tap');
        this.lastTapTime = now;
        this.isDoubleTapping = false;
        this.pendingTap = true;

        // Store start position
        this.startY = clientY;
        this.startX = clientX;

        // Only start drag if held for 300ms (prevents accidental drags when clicking)
        this.dragStartTimeout = setTimeout(() => {
            if (!this.grabHandle) return;

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
        }, (this.doubleTapDelay || 300) + 50); // Slightly longer than double-tap window

        // Store for cleanup
        this.pendingDragStart = true;
    }

    private handleDragMove(e: MouseEvent | TouchEvent): void {
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
        let clientY: number;
        let clientX: number;

        if (e instanceof TouchEvent) {
            if (e.touches.length > 0) {
                // We checked length, so we know index 0 exists
                const touch = e.touches[0]!;
                clientY = touch.clientY;
                clientX = touch.clientX;
            } else {
                return; // No touches to track
            }
        } else {
            clientY = e.clientY;
            clientX = e.clientX;
        }

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

    private updateDragPosition(): void {
        if (!this.grabHandle || !this.isDragging) return;

        // Calculate deltas using latest position
        const deltaY = this.latestClientY - this.startY;
        const deltaX = this.latestClientX - this.startX;

        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Determine primary drag direction (vertical vs horizontal)
        const dragDirection: DragDirection = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';

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
            // Account for handle height since we position by CENTER
            const handleHeight = this.grabHandle.offsetHeight || 60;
            const minPercent = ((this.minPixelsFromTop + (handleHeight / 2)) / viewportHeight) * 100;
            const maxPercent = ((viewportHeight - this.minPixelsFromBottom - (handleHeight / 2)) / viewportHeight) * 100;

            newTop = Math.max(minPercent, Math.min(maxPercent, newTop));

            // Update position using transform for better performance
            this.currentTop = newTop;
            this.grabHandle.style.top = `${newTop}%`;
        }
    }

    private handleDragEnd(_e: MouseEvent | TouchEvent): void {
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
        const handleHeight = this.grabHandle.offsetHeight || 60; // Get actual height or default to 60px

        // Account for handle height on BOTH constraints since we position by CENTER
        const minPercent = ((this.minPixelsFromTop + (handleHeight / 2)) / viewportHeight) * 100;
        const maxPercent = ((viewportHeight - this.minPixelsFromBottom - (handleHeight / 2)) / viewportHeight) * 100;

        this.currentTop = Math.max(minPercent, Math.min(maxPercent, this.currentTop || 50));
        this.grabHandle.style.top = `${this.currentTop}%`;

        console.log(`🔒 Constraints enforced: ${minPercent.toFixed(1)}% - ${maxPercent.toFixed(1)}%, final: ${this.currentTop.toFixed(1)}%`);

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

    private toggleSidebar(): void {
        // Find notification shade controller to toggle sidebar
        const win = window as unknown as WindowWithGame;
        if (win.game && win.game.notificationShade) {
            win.game.notificationShade.toggleSidebar();
        }
    }

    // ========================================
    // SIDE FLIPPING
    // ========================================

    private flipSide(): void {
        if (!this.grabHandle) return;

        // Toggle side
        const newSide: Side = this.currentSide === 'left' ? 'right' : 'left';
        this.setSide(newSide);

        // Haptic feedback
        this.triggerHaptic('heavy');

        console.log(`🔄 Flipped to ${newSide} side`);
    }

    /**
     * Set which side the handle is on
     */
    private setSide(side: Side): void {
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
            // DON'T set transform inline - let CSS classes handle it
            // Inline styles override classes, breaking .expanded state
            this.sidebar.style.transform = ''; // Clear any inline transform

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
            // DON'T set transform inline - let CSS classes handle it
            this.sidebar.style.transform = ''; // Clear any inline transform

            // When expanded on left
            this.sidebar.classList.remove('right-side');
        }

        // Update toggle button position when sidebar is expanded
        this.updateTogglePositionForExpandedSidebar();

        // Save position
        this.savePosition();
    }

    private updateTogglePositionForExpandedSidebar(): void {
        if (!this.grabHandle || !this.sidebar) return;

        // Check if sidebar is expanded
        const isExpanded = this.sidebar.classList.contains('expanded');

        if (isExpanded) {
            // DIZEE FIX: Use dynamic width to account for scrollbars/device variance
            const sidebarWidth = this.sidebar.offsetWidth;

            if (this.currentSide === 'right') {
                // Move toggle to left edge of sidebar when expanded on right
                this.grabHandle.style.right = `${sidebarWidth}px`;
            } else {
                // Move toggle to right edge of sidebar when expanded on left
                this.grabHandle.style.left = `${sidebarWidth}px`;
            }
        }
    }

    // ========================================
    // PERSISTENCE
    // ========================================

    private loadPosition(): void {
        try {
            const saved = localStorage.getItem('grabHandlePosition');
            if (saved) {
                const position: SavedPosition = JSON.parse(saved);
                this.currentTop = position.topPercent || 50;
                this.currentSide = position.side || 'left';
                this.applyPosition();
                console.log(`💾 Loaded grab handle: ${this.currentSide} side, ${Math.round(this.currentTop || 50)}%`);
            } else {
                // Default position (left, 50% - center)
                this.applyPosition();
            }
        } catch (error) {
            console.warn('Failed to load grab handle position:', error);
            this.applyPosition();
        }
    }

    private savePosition(): void {
        try {
            const position: SavedPosition = {
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

    private applyPosition(): void {
        if (!this.grabHandle) return;

        // Remove old transform-based positioning
        this.grabHandle.style.transform = 'translateY(-50%)';

        // Apply vertical position
        this.grabHandle.style.top = `${this.currentTop}%`;

        // Apply side
        this.setSide(this.currentSide || 'left');
    }

    // ========================================
    // HAPTIC FEEDBACK
    // ========================================

    private triggerHaptic(type: HapticType = 'light'): void {
        // Check if Vibration API is supported
        if (!navigator.vibrate) return;

        const patterns: Record<HapticType, number | number[]> = {
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
    public resetToDefault(): void {
        this.currentTop = 50;
        this.currentSide = 'left';
        this.applyPosition();
        this.savePosition();
        console.log('🔄 Grab handle reset to default position');
    }

    /**
     * Get current side (for settings menu integration)
     */
    public getSide(): Side {
        return this.currentSide || 'left';
    }
}
