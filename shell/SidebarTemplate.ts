/**
 * ═══════════════════════════════════════════════════════════════
 * SIDEBAR TEMPLATE - SINGLE SOURCE OF TRUTH
 *
 * Generates the default sidebar HTML structure.
 * Apps can override via getSidebarConfig() to provide custom sidebars.
 *
 * ⚠️  When modifying default sidebar, edit THIS file only.
 * ═══════════════════════════════════════════════════════════════
 */

import { generateQuickActionButtons } from './QuickActions.js';

interface SidebarOptions {
    title?: string;
}

/**
 * Generate the default sidebar content HTML
 */
export function generateDefaultSidebarContent(options: SidebarOptions = {}): string {
    const { title = '🏠 UV7 OS' } = options;

    return `
        <div class="sidebar-header">
            <span class="sidebar-title">${title}</span>
        </div>
        <div class="sidebar-content">
            <div class="sidebar-section">
                <div class="sidebar-section-title">Quick Launch</div>
                ${generateQuickActionButtons({ fullWidth: true })}
            </div>
        </div>
    `;
}

/**
 * Generate complete sidebar structure (for standalone contexts)
 */
export function generateSidebarStructure(options: SidebarOptions = {}): string {
    return `
        <div class="sidebar-header">
            <span class="sidebar-title">${options.title || '🏠 UV7 OS'}</span>
        </div>
        <div class="sidebar-content">
            ${generateDefaultSidebarContent(options)}
        </div>
    `;
}

export default {
    generateDefaultSidebarContent,
    generateSidebarStructure
};
