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
        this.isEditMode = false;

        // Swipe detection
        this.swipeStartX = 0;
        this.swipeStartY = 0;
        this.swipeStartTime = 0;
        this.lastSwipeTime = 0;
        this.swipeThreshold = 50; // pixels
        this.doubleSwipeWindow = 500; // ms

        // Drag-to-reorder state
        this.draggedElement = null;
        this.dragStartIndex = -1;
        this.dragOverIndex = -1;

        // Define all available actions
        this.availableActions = [
            { id: 'save', icon: '💾', label: 'Save', category: 'core' },
            { id: 'load', icon: '📂', label: 'Load', category: 'core' },
            { id: 'fullscreen', icon: '⛶', label: 'Full', category: 'core' },
            { id: 'exit', icon: '🚪', label: 'Exit', category: 'core' },
            { id: 'screenshot', icon: '📸', label: 'Shot', category: 'tools' },
            { id: 'notes', icon: '📝', label: 'Notes', category: 'tools' },
            { id: 'settings', icon: '⚙️', label: 'Set', category: 'tools' },
            { id: 'help', icon: '❓', label: 'Help', category: 'tools' }
        ];

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
            // Don't handle action clicks in edit mode (unless it's a star button)
            if (this.isEditMode && !e.target.closest('.star-btn')) {
                return;
            }

            const btn = e.target.closest('.quick-action-btn');
            if (!btn) return;

            const action = btn.dataset.action || btn.id.replace('shade-', '');
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
        // Each page is 50% of track width, so translate by 50% per page
        const offset = -this.currentPage * 50;
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
    // EDIT MODE (Phase 2)
    // ========================================

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;

        if (this.isEditMode) {
            this.enterEditMode();
        } else {
            this.exitEditMode();
        }
    }

    enterEditMode() {
        console.log('✏️ Edit mode enabled');

        // Ensure we're in expanded view
        if (!this.isExpanded) {
            this.expand();
        }

        // Add edit-mode class to container
        this.expandedView?.classList.add('edit-mode');

        // Re-render expanded view with edit controls
        this.renderExpandedView();

        // Update edit button
        if (this.editBtn) {
            this.editBtn.textContent = '✓';
            this.editBtn.classList.add('active');
        }

        // Add escape key listener
        this.editModeEscapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.exitEditMode();
            }
        };
        document.addEventListener('keydown', this.editModeEscapeHandler);

        this.triggerHaptic('medium');
    }

    exitEditMode() {
        console.log('✏️ Edit mode disabled');

        this.isEditMode = false;

        // Remove edit-mode class
        this.expandedView?.classList.remove('edit-mode');

        // Re-render expanded view without edit controls
        this.renderExpandedView();

        // Update edit button
        if (this.editBtn) {
            this.editBtn.textContent = '✏️';
            this.editBtn.classList.remove('active');
        }

        // Remove escape listener
        if (this.editModeEscapeHandler) {
            document.removeEventListener('keydown', this.editModeEscapeHandler);
            this.editModeEscapeHandler = null;
        }

        // Save changes
        this.saveState();

        // Rebuild carousel pages with new layout
        this.rebuildCarousel();

        this.triggerHaptic('light');
    }

    // ========================================
    // DYNAMIC RENDERING
    // ========================================

    renderExpandedView() {
        const expandedGrid = this.expandedView?.querySelector('.expanded-grid');
        if (!expandedGrid) return;

        // Get actions in custom order
        const orderedActions = this.customLayout.actionOrder
            .map(id => this.availableActions.find(a => a.id === id))
            .filter(a => a && !this.customLayout.hidden.includes(a.id));

        // Clear current content
        expandedGrid.innerHTML = '';

        // Group actions by category
        const groups = {
            core: orderedActions.filter(a => a.category === 'core'),
            tools: orderedActions.filter(a => a.category === 'tools')
        };

        // Render each group
        Object.entries(groups).forEach(([category, actions]) => {
            if (actions.length === 0) return;

            const groupDiv = document.createElement('div');
            groupDiv.className = 'expanded-group';
            groupDiv.dataset.category = category;

            // Update labels to clarify star meaning
            let label = category === 'core' ? 'Core Actions' : 'Tools';
            if (this.isEditMode) {
                label += ' (⭐ = Show in Carousel)';
            }

            groupDiv.innerHTML = `
                <div class="group-label">${label}</div>
                <div class="expanded-actions"></div>
            `;

            const actionsContainer = groupDiv.querySelector('.expanded-actions');

            actions.forEach((action, index) => {
                const btn = this.createActionButton(action, index);
                actionsContainer.appendChild(btn);
            });

            expandedGrid.appendChild(groupDiv);
        });

        // Add reset button in edit mode
        if (this.isEditMode) {
            const resetBtn = document.createElement('button');
            resetBtn.className = 'reset-defaults-btn';
            resetBtn.textContent = '↺ Reset to Defaults';
            resetBtn.addEventListener('click', () => this.resetToDefaults());
            expandedGrid.appendChild(resetBtn);
        }
    }

    createActionButton(action, index) {
        const btn = document.createElement('button');
        btn.className = 'quick-action-btn';
        btn.dataset.action = action.id;
        btn.dataset.index = index;

        const isFavorite = this.customLayout.favorites.includes(action.id);

        if (this.isEditMode) {
            // Edit mode: add controls
            btn.classList.add('editable');
            btn.draggable = true;

            btn.innerHTML = `
                <div class="drag-handle">⋮⋮</div>
                <span class="quick-action-icon">${action.icon}</span>
                <span>${action.label}</span>
                <button class="star-btn ${isFavorite ? 'active' : ''}" data-action-id="${action.id}">
                    ${isFavorite ? '⭐' : '☆'}
                </button>
            `;

            // Star button handler
            const starBtn = btn.querySelector('.star-btn');
            starBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite(action.id);
            });

            // Drag handlers
            btn.addEventListener('dragstart', (e) => this.handleDragStart(e, action.id, index));
            btn.addEventListener('dragover', (e) => this.handleDragOver(e));
            btn.addEventListener('drop', (e) => this.handleDrop(e, index));
            btn.addEventListener('dragend', (e) => this.handleDragEnd(e));

        } else {
            // Normal mode: just the action
            btn.innerHTML = `
                <span class="quick-action-icon">${action.icon}</span>
                <span>${action.label}</span>
            `;
        }

        return btn;
    }

    rebuildCarousel() {
        // Get favorite actions in order
        const favoriteActions = this.customLayout.favorites
            .map(id => this.availableActions.find(a => a.id === id))
            .filter(a => a);

        // Split into pages of 4
        const page1Actions = favoriteActions.slice(0, 4);
        const page2Actions = favoriteActions.slice(4, 8);

        // Update page 1
        const page1 = this.track?.querySelector('[data-page="0"]');
        if (page1) {
            page1.innerHTML = page1Actions.map(a => `
                <button class="quick-action-btn" data-action="${a.id}">
                    <span class="quick-action-icon">${a.icon}</span>
                    <span>${a.label}</span>
                </button>
            `).join('');
        }

        // Update page 2
        const page2 = this.track?.querySelector('[data-page="1"]');
        if (page2) {
            page2.innerHTML = page2Actions.map(a => `
                <button class="quick-action-btn" data-action="${a.id}">
                    <span class="quick-action-icon">${a.icon}</span>
                    <span>${a.label}</span>
                </button>
            `).join('');
        }

        console.log('🔄 Carousel rebuilt with custom layout');
    }

    // ========================================
    // DRAG-TO-REORDER HANDLERS
    // ========================================

    handleDragStart(e, actionId, index) {
        this.draggedElement = e.target;
        this.dragStartIndex = index;
        this.draggedActionId = actionId;

        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.innerHTML);

        this.triggerHaptic('light');
    }

    handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        e.dataTransfer.dropEffect = 'move';

        const target = e.target.closest('.quick-action-btn');
        if (!target || target === this.draggedElement) return;

        // Visual feedback
        target.classList.add('drag-over');

        return false;
    }

    handleDrop(e, targetIndex) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        const target = e.target.closest('.quick-action-btn');
        if (!target || !this.draggedActionId) return false;

        // Remove drag-over class
        target.classList.remove('drag-over');

        // Get target action ID
        const targetActionId = target.dataset.action;
        if (!targetActionId) return false;

        // Reorder in customLayout
        const fromIndex = this.customLayout.actionOrder.indexOf(this.draggedActionId);
        const toIndex = this.customLayout.actionOrder.indexOf(targetActionId);

        if (fromIndex !== -1 && toIndex !== -1) {
            // Remove from old position
            const [movedAction] = this.customLayout.actionOrder.splice(fromIndex, 1);
            // Insert at new position
            this.customLayout.actionOrder.splice(toIndex, 0, movedAction);

            console.log(`🔄 Reordered: ${this.draggedActionId} → position ${toIndex}`);

            // Re-render
            this.renderExpandedView();

            this.triggerHaptic('medium');
        }

        return false;
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');

        // Remove drag-over from all elements
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });

        this.draggedElement = null;
        this.dragStartIndex = -1;
        this.draggedActionId = null;
    }

    // ========================================
    // FAVORITES & CUSTOMIZATION
    // ========================================

    toggleFavorite(actionId) {
        const index = this.customLayout.favorites.indexOf(actionId);

        if (index !== -1) {
            // Remove from carousel
            this.customLayout.favorites.splice(index, 1);
            console.log(`☆ Removed from carousel: ${actionId} (${this.customLayout.favorites.length} in carousel)`);
            this.triggerHaptic('light');
        } else {
            // Add to carousel (max 8 for 2 pages)
            if (this.customLayout.favorites.length < 8) {
                this.customLayout.favorites.push(actionId);
                console.log(`⭐ Added to carousel: ${actionId} (${this.customLayout.favorites.length} in carousel)`);
                this.triggerHaptic('medium');
            } else {
                console.warn('⚠️ Maximum 8 carousel actions (2 pages of 4)');
                return;
            }
        }

        // Re-render to update star buttons
        this.renderExpandedView();
    }

    resetToDefaults() {
        // Confirm first
        if (!confirm('Reset all quick actions to defaults?')) {
            return;
        }

        // Reset layout
        this.customLayout = {
            actionOrder: this.availableActions.map(a => a.id),
            favorites: this.availableActions.slice(0, 8).map(a => a.id),
            hidden: []
        };

        // Save and re-render
        this.saveState();
        this.renderExpandedView();
        this.rebuildCarousel();

        console.log('↺ Reset to defaults');
        this.triggerHaptic('heavy');
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
            console.log('📸 Screenshot mode enabled - tap anywhere to exit');

            // Add global click listener to exit screenshot mode
            this.screenshotExitHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.exitScreenshotMode();
            };

            // Use setTimeout to prevent this click from immediately triggering the exit
            setTimeout(() => {
                document.addEventListener('click', this.screenshotExitHandler, { once: true, capture: true });
                document.addEventListener('touchend', this.screenshotExitHandler, { once: true, capture: true });
            }, 100);
        } else {
            this.exitScreenshotMode();
        }
    }

    exitScreenshotMode() {
        // Remove global listeners if they exist
        if (this.screenshotExitHandler) {
            document.removeEventListener('click', this.screenshotExitHandler, { capture: true });
            document.removeEventListener('touchend', this.screenshotExitHandler, { capture: true });
            this.screenshotExitHandler = null;
        }

        // Show UI elements
        this.shade.screenshotMode = false;
        document.body.classList.remove('screenshot-mode');
        console.log('📸 Screenshot mode disabled');
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

                // Load custom layout if exists
                if (state.customLayout) {
                    this.customLayout = state.customLayout;
                } else {
                    // Default layout: all actions in order, first 8 are favorites
                    this.customLayout = {
                        actionOrder: this.availableActions.map(a => a.id),
                        favorites: this.availableActions.slice(0, 8).map(a => a.id),
                        hidden: []
                    };
                }

                this.updatePagePosition();
                console.log(`💾 Loaded state: Page ${this.currentPage + 1}`);
            } else {
                // Initialize default layout
                this.customLayout = {
                    actionOrder: this.availableActions.map(a => a.id),
                    favorites: this.availableActions.slice(0, 8).map(a => a.id),
                    hidden: []
                };
            }
        } catch (error) {
            console.warn('Failed to load quick actions state:', error);
            // Fallback to default
            this.customLayout = {
                actionOrder: this.availableActions.map(a => a.id),
                favorites: this.availableActions.slice(0, 8).map(a => a.id),
                hidden: []
            };
        }
    }

    saveState() {
        try {
            const state = {
                currentPage: this.currentPage,
                customLayout: this.customLayout,
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
