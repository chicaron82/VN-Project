// @ts-check
// ========================================
// EXPANDABLE QUICK ACTIONS
// Three-state system with paging and expansion
// DIZEE Implementation - MICHELIN EDITION 🔥
// ========================================

/**
 * ExpandableQuickActions
 *
 * Manages the expandable quick actions system with three states:
 * 1. Collapsed - Status bar only (inherited from shade state)
 * 2. Quick - Paged carousel of 4 actions
 * 3. Expanded - Full grid with all 8+ actions
 *
 * Features:
 * - Horizontal paging (swipe left/right between action pages)
 * - Vertical expansion (swipe down twice to see all actions)
 * - Double-swipe shortcuts (quick access to expanded state)
 * - Haptic feedback hierarchy (light/medium/heavy)
 * - State memory (remembers last page)
 *
 * @class ExpandableQuickActions
 */
class ExpandableQuickActions {
    /**
     * @param {any} notificationShade - NotificationShadeController instance
     */
    constructor(notificationShade) {
        this.shade = notificationShade;
        this.game = notificationShade.game;

        // State
        this.currentPage = 0;
        this.isExpanded = false;
        this.totalPages = 2;

        // Swipe detection
        this.swipeStartX = 0;
        this.swipeStartY = 0;
        this.swipeStartTime = 0;
        this.lastSwipeTime = 0;
        this.swipeThreshold = 50; // pixels
        this.doubleSwipeWindow = 500; // ms

        // Elements
        this.initializeElements();

        // Load saved state
        this.loadState();

        // Setup
        this.setupEventListeners();

        console.log('✅ ExpandableQuickActions initialized (MICHELIN MODE)');
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    initializeElements() {
        this.container = document.querySelector('.quick-actions-container');
        this.carousel = document.querySelector('.quick-actions-carousel');
        this.track = document.querySelector('.quick-actions-track');
        this.dots = document.querySelectorAll('.quick-actions-dots .dot');
        this.expandedView = document.querySelector('.quick-actions-expanded');
        this.expandHint = document.querySelector('.expand-hint');

        // Action buttons - will need event delegation
        this.editBtn = document.getElementById('shade-edit-actions');
    }

    setupEventListeners() {
        if (!this.container) return;

        // Horizontal swipe detection (page switching)
        this.container.addEventListener('touchstart', (e) => this.handleSwipeStart(e), { passive: false });
        this.container.addEventListener('touchmove', (e) => this.handleSwipeMove(e), { passive: false });
        this.container.addEventListener('touchend', (e) => this.handleSwipeEnd(e), { passive: false });

        // Edit button
        if (this.editBtn) {
            this.editBtn.addEventListener('click', () => this.toggleEditMode());
        }

        // Action buttons - delegate to shade controller
        this.setupActionDelegation();
    }

    setupActionDelegation() {
        // Delegate all quick-action-btn clicks to appropriate handlers
        this.container?.addEventListener('click', (e) => {
            const btn = e.target.closest('.quick-action-btn');
            if (!btn) return;

            const action = btn.id.replace('shade-', '') || btn.dataset.action;
            this.handleAction(action);
        });
    }

    // ========================================
    // SWIPE HANDLING
    // ========================================

    /**
     * @param {TouchEvent} e
     */
    handleSwipeStart(e) {
        const touch = e.touches[0];
        this.swipeStartX = touch.clientX;
        this.swipeStartY = touch.clientY;
        this.swipeStartTime = Date.now();
    }

    /**
     * @param {TouchEvent} e
     */
    handleSwipeMove(e) {
        // Only prevent default if we're swiping horizontally (page switch)
        // Let vertical swipes through for shade expansion/collapse
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - this.swipeStartX);
        const deltaY = Math.abs(touch.clientY - this.swipeStartY);

        if (deltaX > deltaY && deltaX > 10) {
            // Horizontal swipe - prevent default to avoid scroll
            e.preventDefault();
        }
    }

    /**
     * @param {TouchEvent} e
     */
    handleSwipeEnd(e) {
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - this.swipeStartX;
        const deltaY = touch.clientY - this.swipeStartY;
        const deltaTime = Date.now() - this.swipeStartTime;

        // Determine primary direction
        const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

        if (isHorizontal && Math.abs(deltaX) > this.swipeThreshold && deltaTime < 300) {
            // Horizontal swipe - page switch
            if (deltaX < 0 && this.currentPage < this.totalPages - 1) {
                // Swipe left - next page
                this.nextPage();
            } else if (deltaX > 0 && this.currentPage > 0) {
                // Swipe right - previous page
                this.previousPage();
            }
        } else if (!isHorizontal && deltaY > this.swipeThreshold) {
            // Vertical swipe down - check for double-swipe
            this.handleVerticalSwipe(deltaY, deltaTime);
        }
    }

    /**
     * @param {number} deltaY
     * @param {number} deltaTime
     */
    handleVerticalSwipe(deltaY, deltaTime) {
        const now = Date.now();
        const timeSinceLastSwipe = now - this.lastSwipeTime;

        // Double-swipe detection
        if (timeSinceLastSwipe < this.doubleSwipeWindow && !this.isExpanded) {
            // Double swipe down - jump straight to expanded
            console.log('⚡ Double-swipe detected - jumping to expanded view');
            this.expand();
            this.triggerHaptic('heavy');
            this.lastSwipeTime = 0; // Reset
        } else {
            // Single swipe - handled by shade controller (open/close)
            this.lastSwipeTime = now;

            // If shade is already open and we swipe down again, expand
            if (this.shade.isShadeOpen && !this.isExpanded && deltaY > this.swipeThreshold * 2) {
                console.log('📱 Second swipe - expanding quick actions');
                this.expand();
            }
        }
    }

    // ========================================
    // PAGE NAVIGATION
    // ========================================

    nextPage() {
        if (this.currentPage >= this.totalPages - 1) return;

        this.currentPage++;
        this.updatePagePosition();
        this.triggerHaptic('light');

        console.log(`📄 Page ${this.currentPage + 1}/${this.totalPages}`);
    }

    previousPage() {
        if (this.currentPage <= 0) return;

        this.currentPage--;
        this.updatePagePosition();
        this.triggerHaptic('light');

        console.log(`📄 Page ${this.currentPage + 1}/${this.totalPages}`);
    }

    updatePagePosition() {
        if (!this.track) return;

        // Translate track to show current page
        const offset = -this.currentPage * 100;
        this.track.style.transform = `translateX(${offset}%)`;

        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentPage);
        });

        // Save state
        this.saveState();
    }

    // ========================================
    // EXPANSION
    // ========================================

    expand() {
        if (this.isExpanded || !this.expandedView) return;

        this.isExpanded = true;

        // Hide carousel
        if (this.carousel) {
            this.carousel.style.display = 'none';
        }

        // Show expanded view
        this.expandedView.style.display = 'block';
        setTimeout(() => {
            this.expandedView?.classList.add('visible');
        }, 10);

        // Hide expand hint
        if (this.expandHint) {
            this.expandHint.style.opacity = '0';
        }

        this.triggerHaptic('medium');
        console.log('📊 Quick actions expanded');
    }

    collapse() {
        if (!this.isExpanded || !this.expandedView) return;

        this.isExpanded = false;

        // Hide expanded view
        this.expandedView.classList.remove('visible');
        setTimeout(() => {
            if (this.expandedView) this.expandedView.style.display = 'none';
        }, 300);

        // Show carousel
        if (this.carousel) {
            this.carousel.style.display = 'block';
        }

        // Show expand hint
        if (this.expandHint) {
            this.expandHint.style.opacity = '1';
        }

        this.triggerHaptic('light');
        console.log('📱 Quick actions collapsed');
    }

    // ========================================
    // EDIT MODE (Phase 2 - Placeholder)
    // ========================================

    toggleEditMode() {
        console.log('✏️ Edit mode - Coming in Phase 2!');
        // TODO: Phase 2 implementation
        // - Add drag handles
        // - Enable reordering
        // - Star favorites
        // - Save custom layout
    }

    // ========================================
    // ACTION HANDLERS
    // ========================================

    /**
     * @param {string} action
     */
    handleAction(action) {
        console.log(`🎯 Quick action: ${action}`);

        switch (action) {
            case 'save':
                this.game.saveManager?.openSaveMenu();
                break;
            case 'load':
                this.game.saveManager?.openLoadMenu();
                break;
            case 'fullscreen':
                this.game.settingsManager?.toggleFullscreen();
                break;
            case 'exit':
                this.shade.returnToMenu();
                break;
            case 'screenshot':
                this.enterScreenshotMode();
                break;
            case 'notes':
                this.shade.openNotesViewer();
                break;
            case 'settings':
                this.shade.openSettings();
                break;
            case 'help':
                this.showHelp();
                break;
            default:
                console.warn(`Unknown action: ${action}`);
        }
    }

    enterScreenshotMode() {
        // Toggle screenshot mode
        this.shade.screenshotMode = !this.shade.screenshotMode;

        if (this.shade.screenshotMode) {
            // Hide UI elements
            document.body.classList.add('screenshot-mode');
            console.log('📸 Screenshot mode enabled - tap again to capture or tap anywhere to exit');
        } else {
            // Show UI elements
            document.body.classList.remove('screenshot-mode');
            console.log('📸 Screenshot mode disabled');
        }
    }

    showHelp() {
        console.log('❓ Help - Quick Actions Guide:');
        console.log('  Swipe left/right: Switch action pages');
        console.log('  Swipe down twice: Expand to see all actions');
        console.log('  Screenshot: Toggles UI hide mode for clean captures');
    }

    // ========================================
    // STATE MANAGEMENT
    // ========================================

    loadState() {
        try {
            const saved = localStorage.getItem('quickActionsState');
            if (saved) {
                const state = JSON.parse(saved);
                this.currentPage = state.currentPage || 0;
                this.updatePagePosition();
                console.log(`💾 Loaded state: Page ${this.currentPage + 1}`);
            }
        } catch (error) {
            console.warn('Failed to load quick actions state:', error);
        }
    }

    saveState() {
        try {
            const state = {
                currentPage: this.currentPage,
                timestamp: Date.now()
            };
            localStorage.setItem('quickActionsState', JSON.stringify(state));
        } catch (error) {
            console.warn('Failed to save quick actions state:', error);
        }
    }

    // ========================================
    // HAPTIC FEEDBACK
    // ========================================

    /**
     * @param {'light' | 'medium' | 'heavy'} type
     */
    triggerHaptic(type = 'light') {
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

    reset() {
        this.currentPage = 0;
        this.isExpanded = false;
        this.collapse();
        this.updatePagePosition();
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    // @ts-ignore
    window.ExpandableQuickActions = ExpandableQuickActions;
}

// ES Module export
export { ExpandableQuickActions };
