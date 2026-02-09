// ========================================
// EDIT MODE MANAGER
// Edit mode, drag-to-reorder, and favorites
//
// Extracted from ExpandableQuickActions.ts (~250 lines -> dedicated module)
//
// Handles:
// - Edit mode enter/exit lifecycle
// - Expanded view rendering (edit and normal modes)
// - HTML5 drag-to-reorder for action ordering
// - Star favorites toggling for carousel
// - Reset to defaults
//
// 848 is sacred. 💚🔥💀
// ========================================

import type { QuickAction } from '../ExpandableQuickActions';
import type { CustomLayout } from './QuickActionsState';
import { Logger } from '@utils/Logger';

/**
 * Callback contract for edit mode operations.
 */
export interface EditModeCallbacks {
    getCustomLayout(): CustomLayout;
    setCustomLayout(layout: CustomLayout): void;
    getAvailableActions(): QuickAction[];
    isInEditMode(): boolean;
    setEditMode(mode: boolean): void;
    isExpanded(): boolean;
    expand(): void;
    saveState(): void;
    rebuildCarousel(): void;
    triggerHaptic(type: 'light' | 'medium' | 'heavy'): void;
}

/**
 * EditModeManager
 *
 * Manages edit mode lifecycle, expanded view rendering,
 * drag-to-reorder, and favorites toggling.
 */
export class EditModeManager {
    // Drag state
    private draggedElement: HTMLElement | null = null;
    // @ts-expect-error - Reserved for future use
    private _dragStartIndex: number = -1;
    private draggedActionId: string | null = null;

    // Event handlers
    private editModeEscapeHandler: ((e: KeyboardEvent) => void) | null = null;

    constructor(
        private expandedView: HTMLElement | null,
        private editBtn: HTMLElement | null,
        private callbacks: EditModeCallbacks
    ) {}

    toggleEditMode(): void {
        if (this.callbacks.isInEditMode()) {
            this.exitEditMode();
        } else {
            this.enterEditMode();
        }
    }

    private enterEditMode(): void {
        Logger.ui('✏️ Edit mode enabled');

        this.callbacks.setEditMode(true);

        if (!this.callbacks.isExpanded()) {
            this.callbacks.expand();
        }

        this.expandedView?.classList.add('edit-mode');
        this.renderExpandedView();

        if (this.editBtn) {
            this.editBtn.textContent = '✓';
            this.editBtn.classList.add('active');
        }

        this.editModeEscapeHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                this.exitEditMode();
            }
        };
        document.addEventListener('keydown', this.editModeEscapeHandler);

        this.callbacks.triggerHaptic('medium');
    }

    exitEditMode(): void {
        Logger.ui('✏️ Edit mode disabled');

        this.callbacks.setEditMode(false);
        this.expandedView?.classList.remove('edit-mode');
        this.renderExpandedView();

        if (this.editBtn) {
            this.editBtn.textContent = '✏️';
            this.editBtn.classList.remove('active');
        }

        if (this.editModeEscapeHandler) {
            document.removeEventListener('keydown', this.editModeEscapeHandler);
            this.editModeEscapeHandler = null;
        }

        this.callbacks.saveState();
        this.callbacks.rebuildCarousel();
        this.callbacks.triggerHaptic('light');
    }

    renderExpandedView(): void {
        const expandedGrid = this.expandedView?.querySelector('.expanded-grid');
        if (!expandedGrid) return;

        const layout = this.callbacks.getCustomLayout();
        const availableActions = this.callbacks.getAvailableActions();
        const isEditMode = this.callbacks.isInEditMode();

        const orderedActions = layout.actionOrder
            .map(id => availableActions.find(a => a.id === id))
            .filter((a): a is QuickAction => a !== undefined && !layout.hidden.includes(a.id));

        expandedGrid.innerHTML = '';

        const groups = {
            core: orderedActions.filter(a => a.category === 'core'),
            tools: orderedActions.filter(a => a.category === 'tools')
        };

        Object.entries(groups).forEach(([category, actions]) => {
            if (actions.length === 0) return;

            const groupDiv = document.createElement('div');
            groupDiv.className = 'expanded-group';
            groupDiv.dataset.category = category;

            let label = category === 'core' ? 'Core Actions' : 'Tools';
            if (isEditMode) {
                label += ' (⭐ = Show in Carousel)';
            }

            groupDiv.innerHTML = `
                <div class="group-label">${label}</div>
                <div class="expanded-actions"></div>
            `;

            const actionsContainer = groupDiv.querySelector('.expanded-actions');
            if (!actionsContainer) return;

            actions.forEach((action, index) => {
                const btn = this.createActionButton(action, index, layout, isEditMode);
                actionsContainer.appendChild(btn);
            });

            expandedGrid.appendChild(groupDiv);
        });

        if (isEditMode) {
            const resetBtn = document.createElement('button');
            resetBtn.className = 'reset-defaults-btn';
            resetBtn.textContent = '↺ Reset to Defaults';
            resetBtn.addEventListener('click', () => this.resetToDefaults());
            expandedGrid.appendChild(resetBtn);
        }
    }

    private createActionButton(action: QuickAction, index: number, layout: CustomLayout, isEditMode: boolean): HTMLElement {
        const btn = document.createElement('button');
        btn.className = 'quick-action-btn';
        btn.dataset.action = action.id;
        btn.dataset.index = index.toString();

        const isFavorite = layout.favorites.includes(action.id);

        if (isEditMode) {
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

            const starBtn = btn.querySelector('.star-btn');
            starBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite(action.id);
            });

            btn.addEventListener('dragstart', (e) => this.handleDragStart(e, action.id, index));
            btn.addEventListener('dragover', (e) => this.handleDragOver(e));
            btn.addEventListener('drop', (e) => this.handleDrop(e));
            btn.addEventListener('dragend', (e) => this.handleDragEnd(e));
        } else {
            btn.innerHTML = `
                <span class="quick-action-icon">${action.icon}</span>
                <span>${action.label}</span>
            `;
        }

        return btn;
    }

    // ========================================
    // DRAG-TO-REORDER
    // ========================================

    private handleDragStart(e: DragEvent, actionId: string, index: number): void {
        this.draggedElement = e.target as HTMLElement;
        this._dragStartIndex = index;
        this.draggedActionId = actionId;

        (e.target as HTMLElement).classList.add('dragging');
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', (e.target as HTMLElement).innerHTML);
        }

        this.callbacks.triggerHaptic('light');
    }

    private handleDragOver(e: DragEvent): void {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';

        const target = (e.target as Element).closest('.quick-action-btn');
        if (!target || target === this.draggedElement) return;
        target.classList.add('drag-over');
    }

    private handleDrop(e: DragEvent): void {
        e.stopPropagation();

        const target = (e.target as Element).closest('.quick-action-btn') as HTMLElement;
        if (!target || !this.draggedActionId) return;

        target.classList.remove('drag-over');

        const targetActionId = target.dataset.action;
        if (!targetActionId) return;

        const layout = this.callbacks.getCustomLayout();
        const fromIndex = layout.actionOrder.indexOf(this.draggedActionId);
        const toIndex = layout.actionOrder.indexOf(targetActionId);

        if (fromIndex !== -1 && toIndex !== -1) {
            const [movedAction] = layout.actionOrder.splice(fromIndex, 1);
            if (!movedAction) return;
            layout.actionOrder.splice(toIndex, 0, movedAction);
            this.callbacks.setCustomLayout(layout);

            Logger.ui(`🔄 Reordered: ${this.draggedActionId} → position ${toIndex}`);
            this.renderExpandedView();
            this.callbacks.triggerHaptic('medium');
        }
    }

    private handleDragEnd(e: DragEvent): void {
        (e.target as HTMLElement).classList.remove('dragging');
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

        this.draggedElement = null;
        this._dragStartIndex = -1;
        this.draggedActionId = null;
    }

    // ========================================
    // FAVORITES
    // ========================================

    private toggleFavorite(actionId: string): void {
        const layout = this.callbacks.getCustomLayout();
        const index = layout.favorites.indexOf(actionId);

        if (index !== -1) {
            layout.favorites.splice(index, 1);
            Logger.ui(`☆ Removed from carousel: ${actionId} (${layout.favorites.length} in carousel)`);
            this.callbacks.triggerHaptic('light');
        } else {
            if (layout.favorites.length < 8) {
                layout.favorites.push(actionId);
                Logger.ui(`⭐ Added to carousel: ${actionId} (${layout.favorites.length} in carousel)`);
                this.callbacks.triggerHaptic('medium');
            } else {
                Logger.warn('⚠️ Maximum 8 carousel actions (2 pages of 4)');
                return;
            }
        }

        this.callbacks.setCustomLayout(layout);
        this.renderExpandedView();
    }

    private resetToDefaults(): void {
        if (!confirm('Reset all quick actions to defaults?')) return;

        const availableActions = this.callbacks.getAvailableActions();
        this.callbacks.setCustomLayout({
            actionOrder: availableActions.map(a => a.id),
            favorites: availableActions.slice(0, 8).map(a => a.id),
            hidden: []
        });

        this.callbacks.saveState();
        this.renderExpandedView();
        this.callbacks.rebuildCarousel();

        Logger.ui('↺ Reset to defaults');
        this.callbacks.triggerHaptic('heavy');
    }
}
