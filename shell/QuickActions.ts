/**
 * ═══════════════════════════════════════════════════════════════
 * QUICK ACTIONS - SINGLE SOURCE OF TRUTH
 *
 * Centralized definition of quick action buttons used across:
 * - Shell default sidebar
 * - Notification shade
 * - Standalone showcase
 *
 * ⚠️  When adding/removing apps, edit THIS file only.
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Quick action button definition
 */
export interface QuickAction {
    id: string;
    icon: string;
    label: string;
    route: string;
}

interface QuickActionOptions {
    actions?: QuickAction[];
    grid?: boolean;
    fullWidth?: boolean;
}

/**
 * Available quick actions (app launch buttons)
 */
export const QUICK_ACTIONS: QuickAction[] = [
    {
        id: 'launch-v1',
        icon: '🎮',
        label: 'V1 Game',
        route: '#/v1'
    },
    {
        id: 'launch-v2',
        icon: '⚡',
        label: 'V2 Engine',
        route: '#/v2'
    },
    {
        id: 'view-showcase',
        icon: '📖',
        label: 'Showcase',
        route: '#/showcase'
    },
    {
        id: 'launch-torigatchi',
        icon: '💖',
        label: 'Tori-gatchi',
        route: '#/torigatchi'
    }
];

/**
 * Generate quick action buttons HTML
 */
export function generateQuickActionButtons(options: QuickActionOptions = {}): string {
    const {
        actions = QUICK_ACTIONS,
        grid = false,
        fullWidth = false
    } = options;

    const containerClass = grid ? 'quick-actions-grid' : '';
    const buttonStyle = fullWidth ? ' style="width: 100%; margin-bottom: 0.5rem;"' : '';

    const buttons = actions.map((action, index) => {
        // Remove margin-bottom from last button in stacked layout
        const isLast = index === actions.length - 1;
        const style = fullWidth && isLast ? ' style="width: 100%;"' : buttonStyle;

        return `
            <button class="quick-action" data-action="${action.id}"${style}>
                <span class="quick-action-icon">${action.icon}</span>
                <span class="quick-action-label">${action.label}</span>
            </button>
        `;
    }).join('');

    if (grid) {
        return `<div class="${containerClass}">${buttons}</div>`;
    }

    return buttons;
}

/**
 * Get quick action by ID
 */
export function getQuickAction(id: string): QuickAction | undefined {
    return QUICK_ACTIONS.find(action => action.id === id);
}

export default {
    QUICK_ACTIONS,
    generateQuickActionButtons,
    getQuickAction
};
