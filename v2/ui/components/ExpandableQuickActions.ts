/**
 * ExpandableQuickActions - Three-State Swipe System
 * V1 Parity Port from expandable-quick-actions.js (1023 lines)
 *
 * DIZEE Implementation - MICHELIN EDITION
 *
 * Manages the expandable quick actions system with three states:
 * 1. Collapsed - Status bar only (inherited from shade state)
 * 2. Quick - Paged carousel of 4 actions per page
 * 3. Expanded - Full grid with all 8+ actions
 *
 * Subsystems (extracted to quick-actions/):
 * - SwipeDetector: Touch/swipe input, velocity, rubber-banding
 * - EditModeManager: Edit mode, drag-to-reorder, favorites
 * - ActionRouter: Action dispatch, screenshot mode, help overlay
 * - QuickActionsState: Layout persistence via localStorage
 *
 * 848 is sacred. 💚🔥💀
 */

import { SwipeDetector } from './quick-actions/SwipeDetector';
import { EditModeManager } from './quick-actions/EditModeManager';
import { ActionRouter } from './quick-actions/ActionRouter';
import { QuickActionsStatePersistence } from './quick-actions/QuickActionsState';
import type { CustomLayout } from './quick-actions/QuickActionsState';
import { Logger } from '@utils/Logger';

// ========================================
// TYPES & INTERFACES
// ========================================

export interface QuickAction {
    id: string;
    icon: string;
    label: string;
    category: 'core' | 'tools';
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
    private customLayout: CustomLayout;

    // DOM elements
    private container: HTMLElement | null = null;
    private carousel: HTMLElement | null = null;
    private track: HTMLElement | null = null;
    private dots: NodeListOf<Element> = document.querySelectorAll('.dot');
    private expandedView: HTMLElement | null = null;
    private expandHint: HTMLElement | null = null;
    private editBtn: HTMLElement | null = null;

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

    // Subsystems
    // @ts-expect-error - SwipeDetector is side-effect only (attaches listeners in constructor)
    private swipeDetector!: SwipeDetector;
    private editModeManager!: EditModeManager;
    private actionRouter!: ActionRouter;
    private statePersistence: QuickActionsStatePersistence;

    constructor(notificationShade: NotificationShadeController, game: GameInstance) {
        this.shade = notificationShade;
        this.game = game;
        this.statePersistence = new QuickActionsStatePersistence();

        // Initialize default layout before loading state
        this.customLayout = this.statePersistence.getDefaultLayout(this.availableActions);

        // Initialize elements
        this.initializeElements();

        // Load saved state
        this.loadState();

        // Initialize subsystems
        this.initSubsystems();

        // Setup action delegation
        this.setupActionDelegation();

        Logger.ui('✅ ExpandableQuickActions initialized (MICHELIN MODE)');
    }

    // ========================================
    // INITIALIZATION
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

    private initSubsystems(): void {
        // SwipeDetector - touch/swipe input
        if (this.container) {
            this.swipeDetector = new SwipeDetector(this.container, {
                onNextPage: () => this.nextPage(),
                onPrevPage: () => this.previousPage(),
                onSnapToCurrentPage: () => this.snapToPage(this.currentPage),
                onExpand: () => this.expand(),
                isShadeOpen: () => this.shade.isShadeOpen,
                isExpanded: () => this.isExpanded,
                openShade: () => this.shade.openShade(),
                getCurrentPage: () => this.currentPage,
                getTotalPages: () => this.totalPages,
                getTrackElement: () => this.track,
                triggerHaptic: (type) => this.triggerHaptic(type),
            });
        }

        // EditModeManager - edit mode, drag, favorites
        this.editModeManager = new EditModeManager(this.expandedView, this.editBtn, {
            getCustomLayout: () => this.customLayout,
            setCustomLayout: (layout) => { this.customLayout = layout; },
            getAvailableActions: () => this.availableActions,
            isInEditMode: () => this.isEditMode,
            setEditMode: (mode) => { this.isEditMode = mode; },
            isExpanded: () => this.isExpanded,
            expand: () => this.expand(),
            saveState: () => this.saveState(),
            rebuildCarousel: () => this.rebuildCarousel(),
            triggerHaptic: (type) => this.triggerHaptic(type),
        });

        // ActionRouter - action dispatch, screenshot, help
        this.actionRouter = new ActionRouter({
            saveOpenSaveMenu: () => this.game.saveManager?.openSaveMenu(),
            saveOpenLoadMenu: () => this.game.saveManager?.openLoadMenu(),
            toggleFullscreen: () => this.game.settingsManager?.toggleFullscreen(),
            shadeReturnToMenu: () => this.shade.returnToMenu(),
            shadeOpenNotesViewer: () => this.shade.openNotesViewer(),
            shadeOpenSettings: () => this.shade.openSettings(),
            getScreenshotMode: () => this.shade.screenshotMode,
            setScreenshotMode: (mode) => { this.shade.screenshotMode = mode; },
            triggerHaptic: (type) => this.triggerHaptic(type),
        });

        // Edit button wiring
        if (this.editBtn) {
            this.editBtn.addEventListener('click', () => this.editModeManager.toggleEditMode());
        }
    }

    private setupActionDelegation(): void {
        this.container?.addEventListener('click', (e: Event) => {
            if (this.isEditMode && !(e.target as Element).closest('.star-btn')) {
                return;
            }

            const btn = (e.target as Element).closest('.quick-action-btn') as HTMLElement;
            if (!btn) return;

            const action = btn.dataset.action || btn.id.replace('shade-', '');
            this.actionRouter.handleAction(action);
        });
    }

    // ========================================
    // PAGE NAVIGATION
    // ========================================

    private nextPage(): void {
        if (this.currentPage >= this.totalPages - 1) return;
        this.currentPage++;
        this.snapToPage(this.currentPage);
        this.triggerHaptic('light');
        Logger.ui(`📄 Page ${this.currentPage + 1}/${this.totalPages}`);
    }

    private previousPage(): void {
        if (this.currentPage <= 0) return;
        this.currentPage--;
        this.snapToPage(this.currentPage);
        this.triggerHaptic('light');
        Logger.ui(`📄 Page ${this.currentPage + 1}/${this.totalPages}`);
    }

    private snapToPage(page: number): void {
        if (!this.track) return;

        const offset = -page * 50;
        this.track.style.transform = `translateX(${offset}%)`;

        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === page);
        });

        this.saveState();
    }

    // ========================================
    // EXPANSION
    // ========================================

    public expand(): void {
        if (this.isExpanded || !this.expandedView) return;

        this.isExpanded = true;

        if (this.carousel) this.carousel.style.display = 'none';

        this.expandedView.style.display = 'block';
        setTimeout(() => { this.expandedView?.classList.add('visible'); }, 10);

        if (this.expandHint) this.expandHint.style.opacity = '0';

        this.triggerHaptic('medium');
        Logger.ui('📊 Quick actions expanded');
    }

    public collapse(): void {
        if (!this.isExpanded || !this.expandedView) return;

        this.isExpanded = false;

        this.expandedView.classList.remove('visible');
        setTimeout(() => {
            if (this.expandedView) this.expandedView.style.display = 'none';
        }, 300);

        if (this.carousel) this.carousel.style.display = 'block';
        if (this.expandHint) this.expandHint.style.opacity = '1';

        this.triggerHaptic('light');
        Logger.ui('📱 Quick actions collapsed');
    }

    // ========================================
    // CAROUSEL REBUILD
    // ========================================

    private rebuildCarousel(): void {
        const favoriteActions = this.customLayout.favorites
            .map(id => this.availableActions.find(a => a.id === id))
            .filter((a): a is QuickAction => a !== undefined);

        const page1Actions = favoriteActions.slice(0, 4);
        const page2Actions = favoriteActions.slice(4, 8);

        const page1 = this.track?.querySelector('[data-page="0"]');
        if (page1) {
            page1.innerHTML = page1Actions.map(a => `
                <button class="quick-action-btn" data-action="${a.id}">
                    <span class="quick-action-icon">${a.icon}</span>
                    <span>${a.label}</span>
                </button>
            `).join('');
        }

        const page2 = this.track?.querySelector('[data-page="1"]');
        if (page2) {
            page2.innerHTML = page2Actions.map(a => `
                <button class="quick-action-btn" data-action="${a.id}">
                    <span class="quick-action-icon">${a.icon}</span>
                    <span>${a.label}</span>
                </button>
            `).join('');
        }

        Logger.ui('🔄 Carousel rebuilt with custom layout');
    }

    // ========================================
    // STATE PERSISTENCE
    // ========================================

    private loadState(): void {
        const state = this.statePersistence.loadState(this.availableActions);
        this.currentPage = state.currentPage;
        this.customLayout = state.customLayout;
        this.snapToPage(this.currentPage);
        Logger.ui(`💾 Loaded state: Page ${this.currentPage + 1}`);
    }

    private saveState(): void {
        this.statePersistence.saveState(this.currentPage, this.customLayout);
    }

    // ========================================
    // HAPTIC FEEDBACK
    // ========================================

    private triggerHaptic(type: HapticType = 'light'): void {
        if (!navigator.vibrate) return;

        const patterns: Record<HapticType, number | number[]> = {
            light: 10,
            medium: 20,
            heavy: [30, 10, 30]
        };

        try {
            navigator.vibrate(patterns[type] || patterns.light);
        } catch (_error) {
            // Silently fail
        }
    }

    // ========================================
    // PUBLIC API
    // ========================================

    public reset(): void {
        this.currentPage = 0;
        this.isExpanded = false;
        this.collapse();
        this.snapToPage(this.currentPage);
    }
}
