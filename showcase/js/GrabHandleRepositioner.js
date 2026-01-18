// @ts-check
// ========================================
// GRAB HANDLE REPOSITIONER (Showcase Vanilla JS Version)
// Allows repositioning the sidebar toggle button
// Simplified version of V2's TypeScript implementation
// ========================================

/**
 * GrabHandleRepositioner
 *
 * Makes the sidebar toggle (☰) button repositionable:
 * - Drag vertically to reposition
 * - Drag horizontally to flip sides
 * - Double-tap to flip sides
 * - Position persisted to localStorage
 *
 * Simplified for showcase (no V2 dependencies)
 */
class GrabHandleRepositioner {
    constructor() {
        this.grabHandle = document.getElementById('uv7-sidebar-toggle');
        this.sidebar = document.getElementById('uv7-sidebar');

        if (!this.grabHandle) {
            console.warn('[GrabHandle] Toggle button not found');
            return;
        }

        // Position state
        this.currentSide = 'left';
        this.currentTop = 50; // percent

        // Drag state
        this.isDragging = false;
        this.startY = 0;
        this.startX = 0;
        this.startTop = 0;

        // Double-tap
        this.lastTapTime = 0;
        this.doubleTapDelay = 300;

        // Constraints
        this.minPixelsFromTop = 50;
        this.minPixelsFromBottom = 80;
        this.flipThreshold = 50; // % of screen width

        // Initialize
        this.loadPosition();
        this.applyPosition();
        this.setupEventListeners();

        console.log('✅ GrabHandleRepositioner initialized');
    }

    setupEventListeners() {
        if (!this.grabHandle) return;

        // Mouse events
        this.grabHandle.addEventListener('mousedown', (e) => this.handleDragStart(e));
        document.addEventListener('mousemove', (e) => this.handleDragMove(e));
        document.addEventListener('mouseup', () => this.handleDragEnd());

        // Touch events
        this.grabHandle.addEventListener('touchstart', (e) => this.handleDragStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.handleDragMove(e), { passive: false });
        document.addEventListener('touchend', () => this.handleDragEnd());

        // Double-tap detection
        this.grabHandle.addEventListener('touchend', (e) => {
            const now = Date.now();
            const timeSinceLastTap = now - this.lastTapTime;

            if (timeSinceLastTap < this.doubleTapDelay && timeSinceLastTap > 0) {
                e.preventDefault();
                this.flipSide();
            }

            this.lastTapTime = now;
        }, { passive: false });

        // Desktop Double Click
        this.grabHandle.addEventListener('dblclick', () => {
            this.flipSide();
        });
    }

    /**
     * @param {MouseEvent | TouchEvent} e
     */
    /**
     * @param {MouseEvent | TouchEvent} e
     */
    handleDragStart(e) {
        if (!this.grabHandle) return;

        const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;

        this.startY = clientY;
        this.startX = clientX;
        this.startTop = this.currentTop;

        // Don't set isDragging yet - wait for move threshold
        // Don't preventDefault yet - allow click/focus
    }

    /**
     * @param {MouseEvent | TouchEvent} e
     */
    handleDragMove(e) {
        if (!this.grabHandle) return;

        const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;

        // Calculate delta
        const deltaY = clientY - this.startY;
        const deltaX = clientX - this.startX;
        const moveDistance = Math.sqrt(deltaY * deltaY + deltaX * deltaX);

        // Only start dragging if moved more than threshold
        if (!this.isDragging && moveDistance > 5) {
            this.isDragging = true;
            this.grabHandle.classList.add('dragging');
        }

        if (!this.isDragging) return;

        // Prevent scrolling while dragging
        if (e.cancelable) e.preventDefault();

        // Calculate new position
        const deltaYPercent = (deltaY / window.innerHeight) * 100;
        let newTop = this.startTop + deltaYPercent;

        // Apply constraints
        const minTop = (this.minPixelsFromTop / window.innerHeight) * 100;
        const maxTop = 100 - (this.minPixelsFromBottom / window.innerHeight) * 100;
        newTop = Math.max(minTop, Math.min(maxTop, newTop));

        this.currentTop = newTop;
        this.applyPosition();

        // Check for horizontal flip
        const deltaXPercent = Math.abs((deltaX / window.innerWidth) * 100);

        if (deltaXPercent > this.flipThreshold) {
            const shouldFlip = (deltaX > 0 && this.currentSide === 'left') ||
                (deltaX < 0 && this.currentSide === 'right');

            if (shouldFlip) {
                this.flipSide();
                // Reset start position to prevent immediate flip back
                this.startX = clientX;
            }
        }
    }

    handleDragEnd() {
        if (this.isDragging) {
            this.isDragging = false;
            this.grabHandle.classList.remove('dragging');
            this.savePosition();
        }
        // If not dragging, let the default click event bubble up
    }

    applyPosition() {
        if (!this.grabHandle) return;

        // Reset transform to prevent CSS conflicts
        this.grabHandle.style.transform = 'none';
        this.grabHandle.style.top = `${this.currentTop}%`;

        if (this.currentSide === 'left') {
            this.grabHandle.style.left = '0';
            this.grabHandle.style.right = 'auto';
        } else {
            this.grabHandle.style.right = '0';
            this.grabHandle.style.left = 'auto';
        }

        // Update sidebar slide direction if it exists
        if (this.sidebar) {
            this.sidebar.dataset.side = this.currentSide;
        }
    }

    flipSide() {
        this.currentSide = this.currentSide === 'left' ? 'right' : 'left';
        this.applyPosition();
        this.savePosition();

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(20);

        console.log(`[GrabHandle] Flipped to ${this.currentSide}`);
    }

    savePosition() {
        const position = {
            topPercent: this.currentTop,
            side: this.currentSide,
            timestamp: Date.now()
        };

        localStorage.setItem('uv7-grab-handle-position', JSON.stringify(position));
    }

    loadPosition() {
        const saved = localStorage.getItem('uv7-grab-handle-position');
        if (!saved) return;

        try {
            const position = JSON.parse(saved);
            this.currentTop = position.topPercent;
            this.currentSide = position.side;
            console.log(`[GrabHandle] Loaded position: ${this.currentSide} @ ${this.currentTop.toFixed(1)}%`);
        } catch (e) {
            console.warn('[GrabHandle] Failed to load saved position', e);
        }
    }
}

// Export for use
if (typeof window !== 'undefined') {
    // @ts-ignore - Adding to window global
    window.GrabHandleRepositioner = GrabHandleRepositioner;
}
