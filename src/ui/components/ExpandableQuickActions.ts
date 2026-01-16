/**
 * ExpandableQuickActions - Three-State Swipe System
 * V1 Parity Port from expandable-quick-actions.js (1023 lines)
 *
 * DIZEE Implementation - MICHELIN EDITION 🔥
 *
 * Manages the expandable quick actions system with three states:
 * 1. Collapsed - Status bar only (inherited from shade state)
 * 2. Quick - Paged carousel of 4 actions per page
 * 3. Expanded - Full grid with all 8+ actions
 *
 * Features:
 * - Horizontal paging (swipe left/right between action pages)
 * - Vertical expansion (swipe down twice to see all actions)
 * - Double-swipe shortcuts (quick access to expanded state)
 * - Haptic feedback hierarchy (light/medium/heavy)
 * - State memory (remembers last page)
 * - Drag-to-reorder in edit mode
 * - Star favorites for carousel
 * - Screenshot mode (hides UI)
 *
 * 848 is sacred. 💚🔥💀
 */

// ========================================
// TYPES & INTERFACES
// ========================================

export interface QuickAction {
    id: string;
    icon: string;
    label: string;
    category: 'core' | 'tools';
}

interface CustomLayout {
    actionOrder: string[];
    favorites: string[];
    hidden: string[];
}

interface QuickActionsState {
    currentPage: number;
    customLayout: CustomLayout;
    timestamp: number;
}

type HapticType = 'light' | 'medium' | 'heavy';

// NotificationShadeController interface (will be ported in future phase)
interface NotificationShadeController {
    isShadeOpen: boolean;
    screenshotMode: boolean;
    openShade(): void;
    returnToMenu(): void;
    openNotesViewer(): void;
    openSettings(): void;
}

// Game interface (minimal for type safety)
interface GameInstance {
    saveManager?: { openSaveMenu(): void; openLoadMenu(): void };
    settingsManager?: { toggleFullscreen(): void };
}

export class ExpandableQuickActions {
    private shade: NotificationShadeController;
    private game: GameInstance;

    // State
    private currentPage: number = 0;
    private isExpanded: boolean = false;
    private totalPages: number = 2;
    private isEditMode: boolean = false;

    // Swipe detection
    private swipeStartX: number = 0;
    private swipeStartY: number = 0;
    private swipeStartTime: number = 0;
    private lastSwipeTime: number = 0;
    private swipeThreshold: number = 30; // pixels (lowered for better responsiveness)
    private swipeTimeLimit: number = 500; // ms (increased for easier swipes)
    private doubleSwipeWindow: number = 500; // ms
    private isDragging: boolean = false;
    // @ts-expect-error - Reserved for velocity calculation
    private lastMoveX: number = 0;
    // @ts-expect-error - Reserved for velocity calculation
    private lastMoveTime: number = 0;

    // Drag-to-reorder state
    private draggedElement: HTMLElement | null = null;
    // @ts-expect-error - Reserved for future use
    private _dragStartIndex: number = -1;
    private draggedActionId: string | null = null;
    // @ts-expect-error - Reserved for future use
    private _dragOverIndex: number = -1;

    // Custom layout
    private customLayout: CustomLayout = {
        actionOrder: [],
        favorites: [],
        hidden: []
    };

    // DOM elements
    private container: HTMLElement | null = null;
    private carousel: HTMLElement | null = null;
    private track: HTMLElement | null = null;
    private dots: NodeListOf<Element> = document.querySelectorAll('.dot');
    private expandedView: HTMLElement | null = null;
    private expandHint: HTMLElement | null = null;
    private editBtn: HTMLElement | null = null;

    // Event handlers
    private editModeEscapeHandler: ((e: KeyboardEvent) => void) | null = null;
    private screenshotExitHandler: ((e: Event) => void) | null = null;

    // Available actions (V1 Parity)
    private availableActions: QuickAction[] = [
        { id: 'save', icon: '💾', label: 'Save', category: 'core' },
        { id: 'load', icon: '📂', label: 'Load', category: 'core' },
        { id: 'fullscreen', icon: '⛶', label: 'Full', category: 'core' },
        { id: 'exit', icon: '🚪', label: 'Exit', category: 'core' },
        { id: 'screenshot', icon: '📸', label: 'Shot', category: 'tools' },
        { id: 'notes', icon: '📝', label: 'Notes', category: 'tools' },
        { id: 'settings', icon: '⚙️', label: 'Set', category: 'tools' },
        { id: 'help', icon: '❓', label: 'Help', category: 'tools' }
    ];

    constructor(notificationShade: NotificationShadeController, game: GameInstance) {
        this.shade = notificationShade;
        this.game = game;

        // Initialize elements
        this.initializeElements();

        // Load saved state
        this.loadState();

        // Setup event listeners
        this.setupEventListeners();

        console.log('✅ ExpandableQuickActions initialized (MICHELIN MODE)');
    }

    // ========================================
    // INITIALIZATION
    // V1 Parity: lines 77-124
    // ========================================

    private initializeElements(): void {
        this.container = document.querySelector('.quick-actions-container');
        this.carousel = document.querySelector('.quick-actions-carousel');
        this.track = document.querySelector('.quick-actions-track');
        this.dots = document.querySelectorAll('.quick-actions-dots .dot');
        this.expandedView = document.querySelector('.quick-actions-expanded');
        this.expandHint = document.querySelector('.expand-hint');
        this.editBtn = document.getElementById('shade-edit-actions');
    }

    private setupEventListeners(): void {
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

    private setupActionDelegation(): void {
        // Delegate all quick-action-btn clicks to appropriate handlers
        this.container?.addEventListener('click', (e: Event) => {
            // Don't handle action clicks in edit mode (unless it's a star button)
            if (this.isEditMode && !(e.target as Element).closest('.star-btn')) {
                return;
            }

            const btn = (e.target as Element).closest('.quick-action-btn') as HTMLElement;
            if (!btn) return;

            const action = btn.dataset.action || btn.id.replace('shade-', '');
            this.handleAction(action);
        });
    }

    // ========================================
    // SWIPE HANDLING - SMOOTH MOMENTUM SYSTEM
    // V1 Parity: lines 126-300
    // ========================================

    private handleSwipeStart(e: TouchEvent): void {
        const touch = e.touches[0];
        if (!touch) return;

        this.swipeStartX = touch.clientX;
        this.swipeStartY = touch.clientY;
        this.swipeStartTime = Date.now();
        this.isDragging = false;
        this.lastMoveX = touch.clientX;
        this.lastMoveTime = Date.now();

        // Disable CSS transition during drag for responsive feel
        if (this.track) {
            this.track.style.transition = 'none';
        }
    }

    private handleSwipeMove(e: TouchEvent): void {
        const touch = e.touches[0];
        if (!touch) return;

        const deltaX = touch.clientX - this.swipeStartX;
        const deltaY = Math.abs(touch.clientY - this.swipeStartY);

        // Only track horizontal if it's the dominant direction
        if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
            e.preventDefault();
            this.isDragging = true;

            // Track velocity
            this.lastMoveX = touch.clientX;
            this.lastMoveTime = Date.now();

            // Live drag tracking - translate with finger
            if (this.track) {
                const containerWidth = this.track.parentElement?.offsetWidth || window.innerWidth;
                const pageWidth = containerWidth; // Each page is 100% of carousel viewport
                const baseOffset = -this.currentPage * pageWidth;

                // Add rubber-band resistance at edges
                let adjustedDelta = deltaX;
                const atStart = this.currentPage === 0 && deltaX > 0;
                const atEnd = this.currentPage >= this.totalPages - 1 && deltaX < 0;

                if (atStart || atEnd) {
                    // Rubber-band effect - reduce movement by 70%
                    adjustedDelta = deltaX * 0.3;
                }

                // Apply live transform (using pixels for smooth tracking)
                this.track.style.transform = `translateX(${baseOffset + adjustedDelta}px)`;
            }
        }
    }

    private handleSwipeEnd(e: TouchEvent): void {
        const touch = e.changedTouches[0];
        if (!touch) return;

        const deltaX = touch.clientX - this.swipeStartX;
        const deltaY = touch.clientY - this.swipeStartY;
        const deltaTime = Date.now() - this.swipeStartTime;

        // Re-enable CSS transition for snap animation
        if (this.track) {
            this.track.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }

        // Determine primary direction
        const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

        if (this.isDragging && isHorizontal) {
            // Calculate velocity (pixels per ms)
            const velocity = deltaX / Math.max(deltaTime, 1);

            // Decide page based on position + velocity
            const containerWidth = this.track?.parentElement?.offsetWidth || window.innerWidth;
            const threshold = containerWidth * 0.25; // 25% of container = page change
            const velocityThreshold = 0.3; // px/ms - fast flick triggers page change

            if (deltaX < -threshold || velocity < -velocityThreshold) {
                // Swipe left - next page
                if (this.currentPage < this.totalPages - 1) {
                    this.nextPage();
                } else {
                    this.snapToPage(this.currentPage); // Bounce back
                }
            } else if (deltaX > threshold || velocity > velocityThreshold) {
                // Swipe right - previous page
                if (this.currentPage > 0) {
                    this.previousPage();
                } else {
                    this.snapToPage(this.currentPage); // Bounce back
                }
            } else {
                // Didn't cross threshold - snap back to current page
                this.snapToPage(this.currentPage);
            }

            this.isDragging = false;
            return;
        }

        // Check for vertical swipe (expansion)
        if (!isHorizontal && Math.abs(deltaY) > this.swipeThreshold && deltaTime < this.swipeTimeLimit) {
            if (deltaY > 0) {
                this.handleVerticalSwipe(deltaY, deltaTime);
            }
        }

        this.isDragging = false;
    }

    private handleVerticalSwipe(deltaY: number, deltaTime: number): void {
        const now = Date.now();
        const timeSinceLastSwipe = now - this.lastSwipeTime;

        // Calculate velocity for better responsiveness
        const velocity = deltaY / Math.max(deltaTime, 1);
        const velocityThreshold = 0.3; // px/ms - fast flick = easier trigger

        // If already expanded, ignore (let shade controller handle collapse)
        if (this.isExpanded) {
            return;
        }

        // If shade is open and we detect a down swipe, expand
        // Use EITHER threshold OR velocity for better responsiveness
        if (this.shade.isShadeOpen) {
            const meetsThreshold = deltaY > 20; // Lowered from 30
            const meetsVelocity = velocity > velocityThreshold;

            if (meetsThreshold || meetsVelocity) {
                console.log('📱 Vertical swipe - expanding quick actions', {
                    deltaY,
                    velocity: velocity.toFixed(2),
                    method: meetsVelocity ? 'velocity' : 'threshold'
                });
                this.expand();
                this.lastSwipeTime = now;
                this.triggerHaptic('medium');
                return;
            }
        }

        // Double-swipe shortcut: Two quick down swipes = expand from anywhere
        if (timeSinceLastSwipe < this.doubleSwipeWindow && timeSinceLastSwipe > 50) {
            console.log('📱 Double-swipe detected - quick expand!');
            // First ensure shade is open
            if (!this.shade.isShadeOpen) {
                this.shade.openShade();
            }
            // Then expand after brief delay
            setTimeout(() => {
                this.expand();
                this.triggerHaptic('heavy');
            }, 150);
            this.lastSwipeTime = 0; // Reset to prevent triple-tap issues
            return;
        }

        // Track swipe timing for double-swipe shortcut
        this.lastSwipeTime = now;
    }

    // ========================================
    // PAGE NAVIGATION - SMOOTH TRANSITIONS
    // V1 Parity: lines 302-349
    // ========================================

    private nextPage(): void {
        if (this.currentPage >= this.totalPages - 1) return;

        this.currentPage++;
        this.snapToPage(this.currentPage);
        this.triggerHaptic('light');

        console.log(`📄 Page ${this.currentPage + 1}/${this.totalPages}`);
    }

    private previousPage(): void {
        if (this.currentPage <= 0) return;

        this.currentPage--;
        this.snapToPage(this.currentPage);
        this.triggerHaptic('light');

        console.log(`📄 Page ${this.currentPage + 1}/${this.totalPages}`);
    }

    private snapToPage(page: number): void {
        if (!this.track) return;

        // Use percentage for final position (responsive)
        const offset = -page * 50; // Each page is 50% of track width (2 pages = 200% track)
        this.track.style.transform = `translateX(${offset}%)`;

        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === page);
        });

        // Save state
        this.saveState();
    }

    private updatePagePosition(): void {
        // Legacy method - now just calls snapToPage
        this.snapToPage(this.currentPage);
    }

    // ========================================
    // EXPANSION
    // V1 Parity: lines 351-403
    // ========================================

    public expand(): void {
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

    public collapse(): void {
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
    // EDIT MODE
    // V1 Parity: lines 405-480
    // ========================================

    private toggleEditMode(): void {
        this.isEditMode = !this.isEditMode;

        if (this.isEditMode) {
            this.enterEditMode();
        } else {
            this.exitEditMode();
        }
    }

    private enterEditMode(): void {
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
        this.editModeEscapeHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                this.exitEditMode();
            }
        };
        document.addEventListener('keydown', this.editModeEscapeHandler);

        this.triggerHaptic('medium');
    }

    private exitEditMode(): void {
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
    // V1 Parity: lines 482-622
    // ========================================

    private renderExpandedView(): void {
        const expandedGrid = this.expandedView?.querySelector('.expanded-grid');
        if (!expandedGrid) return;

        // Get actions in custom order
        const orderedActions = this.customLayout.actionOrder
            .map(id => this.availableActions.find(a => a.id === id))
            .filter((a): a is QuickAction => a !== undefined && !this.customLayout.hidden.includes(a.id));

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
            if (!actionsContainer) return;

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

    private createActionButton(action: QuickAction, index: number): HTMLElement {
        const btn = document.createElement('button');
        btn.className = 'quick-action-btn';
        btn.dataset.action = action.id;
        btn.dataset.index = index.toString();

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

    private rebuildCarousel(): void {
        // Get favorite actions in order
        const favoriteActions = this.customLayout.favorites
            .map(id => this.availableActions.find(a => a.id === id))
            .filter((a): a is QuickAction => a !== undefined);

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
    // V1 Parity: lines 624-703
    // ========================================

    private handleDragStart(e: DragEvent, actionId: string, _index: number): void {
        this.draggedElement = e.target as HTMLElement;
        this._dragStartIndex = _index;
        this.draggedActionId = actionId;

        (e.target as HTMLElement).classList.add('dragging');
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', (e.target as HTMLElement).innerHTML);
        }

        this.triggerHaptic('light');
    }

    private handleDragOver(e: DragEvent): void {
        e.preventDefault();

        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
        }

        const target = (e.target as Element).closest('.quick-action-btn');
        if (!target || target === this.draggedElement) return;

        // Visual feedback
        target.classList.add('drag-over');
    }

    private handleDrop(e: DragEvent, _targetIndex: number): void {
        e.stopPropagation();

        const target = (e.target as Element).closest('.quick-action-btn') as HTMLElement;
        if (!target || !this.draggedActionId) return;

        // Remove drag-over class
        target.classList.remove('drag-over');

        // Get target action ID
        const targetActionId = target.dataset.action;
        if (!targetActionId) return;

        // Reorder in customLayout
        const draggedActionId = this.draggedActionId;
        if (!draggedActionId) return;

        const fromIndex = this.customLayout.actionOrder.indexOf(draggedActionId);
        const toIndex = this.customLayout.actionOrder.indexOf(targetActionId);

        if (fromIndex !== -1 && toIndex !== -1) {
            // Remove from old position
            const [movedAction] = this.customLayout.actionOrder.splice(fromIndex, 1);
            if (!movedAction) return;

            // Insert at new position
            this.customLayout.actionOrder.splice(toIndex, 0, movedAction);

            console.log(`🔄 Reordered: ${draggedActionId} → position ${toIndex}`);

            // Re-render
            this.renderExpandedView();

            this.triggerHaptic('medium');
        }
    }

    private handleDragEnd(e: DragEvent): void {
        (e.target as HTMLElement).classList.remove('dragging');

        // Remove drag-over from all elements
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });

        this.draggedElement = null;
        this._dragStartIndex = -1;
        this.draggedActionId = null;
    }

    // ========================================
    // FAVORITES & CUSTOMIZATION
    // V1 Parity: lines 705-753
    // ========================================

    private toggleFavorite(actionId: string): void {
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

    private resetToDefaults(): void {
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
    // V1 Parity: lines 755-919
    // ========================================

    private handleAction(action: string): void {
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

    private enterScreenshotMode(): void {
        // Toggle screenshot mode
        this.shade.screenshotMode = !this.shade.screenshotMode;

        if (this.shade.screenshotMode) {
            // Hide UI elements
            document.body.classList.add('screenshot-mode');
            console.log('📸 Screenshot mode enabled - tap anywhere to exit');

            // Add global click listener to exit screenshot mode
            this.screenshotExitHandler = (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                this.exitScreenshotMode();
            };

            // Use setTimeout to prevent this click from immediately triggering the exit
            setTimeout(() => {
                if (this.screenshotExitHandler) {
                    document.addEventListener('click', this.screenshotExitHandler, { once: true, capture: true });
                    document.addEventListener('touchend', this.screenshotExitHandler, { once: true, capture: true });
                }
            }, 100);
        } else {
            this.exitScreenshotMode();
        }
    }

    private exitScreenshotMode(): void {
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

    private showHelp(): void {
        // Create overlay (V1 Parity - inline HTML)
        const overlay = document.createElement('div');
        overlay.className = 'quick-actions-help-overlay';
        overlay.innerHTML = `
            <div class="help-content">
                <div class="help-header">
                    <h3>❓ Quick Actions Guide</h3>
                    <button class="help-close-btn">✕</button>
                </div>
                <div class="help-body">
                    <div class="help-section">
                        <div class="help-title">🔄 Navigation</div>
                        <div class="help-item">
                            <span class="help-gesture">Swipe Down</span>
                            <span class="help-desc">Open quick actions carousel</span>
                        </div>
                        <div class="help-item">
                            <span class="help-gesture">Swipe Down Again</span>
                            <span class="help-desc">Expand to see all actions</span>
                        </div>
                        <div class="help-item">
                            <span class="help-gesture">Swipe Left/Right</span>
                            <span class="help-desc">Switch between action pages</span>
                        </div>
                        <div class="help-item">
                            <span class="help-gesture">Swipe Up</span>
                            <span class="help-desc">Close notification shade</span>
                        </div>
                    </div>

                    <div class="help-section">
                        <div class="help-title">✏️ Customization</div>
                        <div class="help-item">
                            <span class="help-gesture">Edit Button</span>
                            <span class="help-desc">Toggle edit mode (in expanded view)</span>
                        </div>
                        <div class="help-item">
                            <span class="help-gesture">Drag ⋮⋮</span>
                            <span class="help-desc">Reorder actions (edit mode)</span>
                        </div>
                        <div class="help-item">
                            <span class="help-gesture">Tap ⭐</span>
                            <span class="help-desc">Add/remove from carousel (edit mode)</span>
                        </div>
                        <div class="help-item">
                            <span class="help-gesture">ESC Key</span>
                            <span class="help-desc">Exit edit mode</span>
                        </div>
                    </div>

                    <div class="help-section">
                        <div class="help-title">📸 Screenshot Mode</div>
                        <div class="help-item">
                            <span class="help-desc">Hides all UI for clean captures. Tap anywhere to exit.</span>
                        </div>
                    </div>
                </div>
                <div class="help-footer">
                    <button class="help-got-it-btn">Got it!</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Close handlers
        const closeHelp = () => {
            overlay.classList.add('closing');
            setTimeout(() => overlay.remove(), 200);
        };

        overlay.querySelector('.help-close-btn')?.addEventListener('click', closeHelp);
        overlay.querySelector('.help-got-it-btn')?.addEventListener('click', closeHelp);
        overlay.addEventListener('click', (e: Event) => {
            if (e.target === overlay) closeHelp();
        });

        // Animate in
        requestAnimationFrame(() => {
            overlay.classList.add('visible');
        });

        this.triggerHaptic('medium');
    }

    // ========================================
    // STATE MANAGEMENT
    // V1 Parity: lines 921-976
    // ========================================

    private loadState(): void {
        try {
            const saved = localStorage.getItem('quickActionsState');
            if (saved) {
                const state: QuickActionsState = JSON.parse(saved);
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

    private saveState(): void {
        try {
            const state: QuickActionsState = {
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
    // V1 Parity: lines 978-1001
    // ========================================

    private triggerHaptic(type: HapticType = 'light'): void {
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
    // V1 Parity: lines 1003-1012
    // ========================================

    public reset(): void {
        this.currentPage = 0;
        this.isExpanded = false;
        this.collapse();
        this.updatePagePosition();
    }
}
