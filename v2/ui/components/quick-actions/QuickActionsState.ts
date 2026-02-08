// ========================================
// QUICK ACTIONS STATE PERSISTENCE
// localStorage save/load for action layout
//
// Extracted from ExpandableQuickActions.ts (~85 lines -> dedicated module)
//
// Handles:
// - Custom layout persistence (action order, favorites, hidden)
// - Default layout generation
// - Page position memory
//
// 848 is sacred. 💚🔥💀
// ========================================

import type { QuickAction } from '../ExpandableQuickActions';

export interface CustomLayout {
    actionOrder: string[];
    favorites: string[];
    hidden: string[];
}

export interface QuickActionsStateData {
    currentPage: number;
    customLayout: CustomLayout;
    timestamp: number;
}

/**
 * QuickActionsStatePersistence
 *
 * Manages localStorage persistence for quick action layout and page state.
 */
export class QuickActionsStatePersistence {
    /**
     * Create default layout from available actions
     */
    getDefaultLayout(availableActions: QuickAction[]): CustomLayout {
        return {
            actionOrder: availableActions.map(a => a.id),
            favorites: availableActions.slice(0, 8).map(a => a.id),
            hidden: []
        };
    }

    /**
     * Load state from localStorage
     * Returns current page and custom layout, falling back to defaults
     */
    loadState(availableActions: QuickAction[]): { currentPage: number; customLayout: CustomLayout } {
        const defaults = this.getDefaultLayout(availableActions);

        try {
            const saved = localStorage.getItem('quickActionsState');
            if (saved) {
                const state: QuickActionsStateData = JSON.parse(saved);
                return {
                    currentPage: state.currentPage || 0,
                    customLayout: state.customLayout || defaults
                };
            }
        } catch (error) {
            console.warn('Failed to load quick actions state:', error);
        }

        return { currentPage: 0, customLayout: defaults };
    }

    /**
     * Save state to localStorage
     */
    saveState(currentPage: number, customLayout: CustomLayout): void {
        try {
            const state: QuickActionsStateData = {
                currentPage,
                customLayout,
                timestamp: Date.now()
            };
            localStorage.setItem('quickActionsState', JSON.stringify(state));
        } catch (error) {
            console.warn('Failed to save quick actions state:', error);
        }
    }
}
