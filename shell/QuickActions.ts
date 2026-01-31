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
 * @typedef {Object} QuickAction
 * @property {string} id - Action identifier (data-action attribute)
 * @property {string} icon - Emoji icon
 * @property {string} label - Button label
 * @property {string} route - Hash route for navigation
 */

/**
 * Available quick actions (app launch buttons)
 * @type {QuickAction[]}
 */
export const QUICK_ACTIONS = [
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
 * @param {Object} options - Configuration options
 * @param {QuickAction[]} options.actions - Actions to render (defaults to QUICK_ACTIONS)
 * @param {boolean} options.grid - Use grid layout (default: false, stacked)
 * @param {boolean} options.fullWidth - Make buttons full width (default: false)
 * @returns {string} HTML string
 */
export function generateQuickActionButtons(options = {}) {
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
 * @param {string} id - Action identifier
 * @returns {QuickAction|undefined}
 */
export function getQuickAction(id) {
    return QUICK_ACTIONS.find(action => action.id === id);
}

export default {
    QUICK_ACTIONS,
    generateQuickActionButtons,
    getQuickAction
};
