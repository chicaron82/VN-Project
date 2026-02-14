/**
 * ═══════════════════════════════════════════════════════════════
 * SHOWCASE SIDEBAR TEMPLATE - SINGLE SOURCE OF TRUTH
 *
 * Generates the showcase-specific sidebar HTML structure.
 * Used by both shell mode (via UV7System) and standalone mode.
 *
 * ⚠️  When modifying showcase sidebar, edit THIS file only.
 * ═══════════════════════════════════════════════════════════════
 */

import { Logger } from '@utils/Logger';

/**
 * Generate showcase-specific sidebar INNER content (for UV7Shell which has existing structure)
 * This returns just the content to go inside .sidebar-content
 */
export function generateShowcaseSidebarInnerContent(): string {
    return `
            <!-- Quick Actions -->
            <div class="sidebar-section">
                <div class="sidebar-section-title">Quick Actions</div>
                <div class="quick-actions-grid">
                    <button class="quick-action" data-action="launch-v1">
                        <span class="quick-action-icon">🎮</span>
                        <span class="quick-action-label">V1 Game</span>
                    </button>
                    <button class="quick-action" data-action="launch-v2">
                        <span class="quick-action-icon">⚡</span>
                        <span class="quick-action-label">V2 Engine</span>
                    </button>
                    <button class="quick-action" data-action="go-home">
                        <span class="quick-action-icon">🌐</span>
                        <span class="quick-action-label">Showcase Home</span>
                    </button>
                    <button class="quick-action" data-action="toggle-theme">
                        <span class="quick-action-icon">🌙</span>
                        <span class="quick-action-label">Toggle Theme</span>
                    </button>
                </div>
            </div>

            <!-- System Stats Widget -->
            <div class="sidebar-section">
                <div class="system-stats-widget">
                    <div class="stat-row">
                        <div class="stat-info">
                            <span class="stat-label">CHAOS METER</span>
                            <span class="stat-value" id="sys-cpu">12%</span>
                        </div>
                        <div class="stat-bar-track">
                            <div class="stat-bar-fill" id="sys-cpu-bar" style="width: 12%"></div>
                        </div>
                    </div>
                    <div class="stat-row">
                        <div class="stat-info">
                            <span class="stat-label">BOUGIE FACTOR</span>
                            <span class="stat-value" id="sys-ram">64%</span>
                        </div>
                        <div class="stat-bar-track">
                            <div class="stat-bar-fill" id="sys-ram-bar" style="width: 64%"></div>
                        </div>
                    </div>
                    <div class="stat-row">
                        <div class="stat-info">
                            <span class="stat-label">V2 ENGINE</span>
                            <span class="stat-value status-online">ONLINE</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section Navigation -->
            <div class="sidebar-section">
                <div class="sidebar-section-title">🧭 Navigate</div>
                <div class="section-nav-list">
                    <button class="section-nav-item" data-tab="home">
                        <span class="section-icon">🌐</span>
                        <span class="section-label">Home</span>
                    </button>
                    <button class="section-nav-item" data-tab="journal">
                        <span class="section-icon">🗺️</span>
                        <span class="section-label">Journal</span>
                    </button>
                    <button class="section-nav-item" data-tab="workflow">
                        <span class="section-icon">⚙️</span>
                        <span class="section-label">Workflow</span>
                    </button>
                    <button class="section-nav-item" data-tab="spotlight">
                        <span class="section-icon">💡</span>
                        <span class="section-label">Technical Spotlight</span>
                    </button>
                    <button class="section-nav-item" data-tab="evolution">
                        <span class="section-icon">🔄</span>
                        <span class="section-label">The Evolution</span>
                    </button>
                    <button class="section-nav-item" data-tab="experiment">
                        <span class="section-icon">🧪</span>
                        <span class="section-label">V3 Experiment</span>
                    </button>
                    <button class="section-nav-item" data-tab="who">
                        <span class="section-icon">👥</span>
                        <span class="section-label">Who Are We</span>
                    </button>
                </div>
            </div>
    `;
}

/**
 * Generate showcase-specific sidebar FULL structure (for standalone UV7System)
 * This returns the complete sidebar HTML including header and content wrapper
 */
export function generateShowcaseSidebarContent(): string {
    return `
        <div class="sidebar-header">
            <span class="sidebar-title">📖 SHOWCASE</span>
        </div>
        <div class="sidebar-content">
            ${generateShowcaseSidebarInnerContent()}
        </div>
    `;
}

/**
 * Initialize showcase sidebar event listeners
 * Called after sidebar is rendered
 */
export function initShowcaseSidebarListeners(): void {
    // Quick actions
    document.querySelectorAll('.quick-action').forEach((btn) => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');

            if (action === 'launch-v1') {
                // Route within shell - serve from the restaurant, not takeout
                window.location.hash = '#/v1';
            } else if (action === 'launch-v2') {
                window.location.hash = '#/v2';
            } else if (action === 'go-home') {
                const tabController = (window as unknown as { tabController?: { setActiveTab: (tab: string) => void } }).tabController;
                if (tabController) {
                    tabController.setActiveTab('home');
                }
            } else if (action === 'toggle-theme') {
                // Use shared ThemeManager for proper theme handling
                import('../../shared/StatusBar/ThemeManager').then(({ getThemeManager }) => {
                    const themeManager = getThemeManager();
                    themeManager.toggle();
                }).catch(err => {
                    Logger.warn('[ShowcaseSidebar] Could not load ThemeManager, falling back:', err);
                    document.body.classList.toggle('dark-mode');
                });
                // Don't close sidebar for theme toggle
                return;
            }

            // Close sidebar after action (except theme toggle)
            const sidebar = document.getElementById('uv7-sidebar');
            const backdrop = document.getElementById('uv7-backdrop');
            if (sidebar) sidebar.classList.remove('open');
            if (backdrop) backdrop.classList.remove('visible');
        });
    });

    // Section navigation
    document.querySelectorAll('.section-nav-item').forEach((btn) => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            const tabCtrl = (window as unknown as { tabController?: { setActiveTab: (tab: string) => void } }).tabController;
            if (tabCtrl && tab) {
                tabCtrl.setActiveTab(tab);
            }

            // Close sidebar after navigation
            const sidebar = document.getElementById('uv7-sidebar');
            const backdrop = document.getElementById('uv7-backdrop');
            if (sidebar) sidebar.classList.remove('open');
            if (backdrop) backdrop.classList.remove('visible');
        });
    });
}

export default {
    generateShowcaseSidebarInnerContent,
    generateShowcaseSidebarContent,
    initShowcaseSidebarListeners
};
