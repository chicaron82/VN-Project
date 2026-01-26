/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 SHELL - SINGLE-PAGE APPLICATION CONTROLLER
 * 
 * The master controller for the UV7 OS single-index architecture.
 * Manages app lifecycle, routing, and unified status bar.
 * 
 * CREW CREDITS:
 * - Tori (Architecture design: Shell + Apps pattern)
 * - Belle (Gesture Arbiter concept)
 * - Zee (Hybrid approach wisdom, we're going full SPA anyway!)
 * - DiZee (Implementation)
 * ═══════════════════════════════════════════════════════════════
 */

import { GestureRouter } from './GestureRouter.js';
import { Router } from './Router.js';

export class UV7Shell {
    constructor() {
        /** @type {import('./apps/BaseApp.js').BaseApp|null} */
        this.currentApp = null;

        /** @type {Map<string, typeof import('./apps/BaseApp.js').BaseApp>} */
        this.appRegistry = new Map();

        /** @type {GestureRouter} */
        this.gestureRouter = new GestureRouter(this);

        /** @type {Router} */
        this.router = new Router(this);

        /** @type {Object} */
        this.elements = {};

        /** @type {boolean} */
        this.initialized = false;
    }

    /**
     * Initialize the shell
     */
    async init() {
        if (this.initialized) return;

        console.log('[UV7Shell] Initializing...');

        // Cache DOM elements
        this.cacheElements();

        // Initialize gesture router
        this.gestureRouter.init();

        // Register all apps
        await this.registerApps();

        // Initialize router (will trigger first app load)
        this.router.init();

        this.initialized = true;
        console.log('[UV7Shell] Initialized successfully');
    }

    /**
     * Cache frequently used DOM elements
     */
    cacheElements() {
        this.elements = {
            viewport: document.getElementById('app-viewport'),
            statusBar: document.getElementById('uv7-status-bar'),
            statusContext: document.getElementById('uv7-context'),
            shade: document.getElementById('uv7-shade'),
            sidebar: document.getElementById('uv7-sidebar'),
            backdrop: document.getElementById('uv7-backdrop')
        };

        if (!this.elements.viewport) {
            console.error('[UV7Shell] Could not find #app-viewport element!');
        }
    }

    /**
     * Register all available apps
     */
    async registerApps() {
        // Apps are registered lazily - we just define their IDs here
        // Actual module loading happens in loadApp()
        this.appRegistry.set('landing', () => import('./apps/LandingApp.js'));
        this.appRegistry.set('showcase', () => import('./apps/ShowcaseApp.js'));
        this.appRegistry.set('torigatchi', () => import('./apps/TorigatchiApp.js'));
        this.appRegistry.set('v1', () => import('./apps/V1App.js'));
        this.appRegistry.set('v2', () => import('./apps/V2App.js'));

        console.log('[UV7Shell] Registered apps:', [...this.appRegistry.keys()]);
    }

    /**
     * Load and mount an app
     * @param {string} appId - The app identifier
     * @param {Object} params - Route parameters
     */
    async loadApp(appId, params = {}) {
        console.log(`[UV7Shell] Loading app: ${appId}`, params);

        // Check if app exists
        if (!this.appRegistry.has(appId)) {
            console.error(`[UV7Shell] Unknown app: ${appId}`);
            return;
        }

        // Skip if already loaded
        if (this.currentApp?.id === appId) {
            console.log(`[UV7Shell] App ${appId} already loaded, updating params`);
            this.currentApp.onRouteChange?.(params);
            return;
        }

        // Start transition
        this.elements.viewport?.classList.add('app-transitioning');

        try {
            // Unmount current app
            if (this.currentApp) {
                console.log(`[UV7Shell] Unmounting: ${this.currentApp.id}`);
                await this.currentApp.unmount();
                this.gestureRouter.unregisterApp(this.currentApp.id);
            }

            // Dynamic import the app module
            const appLoader = this.appRegistry.get(appId);
            const AppModule = await appLoader();
            const AppClass = AppModule.default;

            // Create app instance
            const app = new AppClass(this);
            app.id = appId;

            // Clear viewport
            if (this.elements.viewport) {
                this.elements.viewport.innerHTML = '';
            }

            // Mount the app
            await app.mount(this.elements.viewport, params);

            // Register gesture handlers
            if (app.gestureHandlers) {
                this.gestureRouter.registerApp(appId, app.gestureHandlers);
            }

            // Update status bar
            this.updateStatusBar(app.getStatusBarConfig());

            // Update sidebar
            this.updateSidebar(app.getSidebarConfig());

            // Store reference
            this.currentApp = app;

            console.log(`[UV7Shell] App ${appId} mounted successfully`);

        } catch (error) {
            console.error(`[UV7Shell] Failed to load app ${appId}:`, error);
            this.showErrorState(appId, error);
        } finally {
            this.elements.viewport?.classList.remove('app-transitioning');
        }
    }

    /**
     * Update the status bar based on app config
     * @param {Object} config - Status bar configuration
     */
    updateStatusBar(config = {}) {
        const { title, context, showBreadcrumb, breadcrumbPath } = config;

        // Update context text
        if (this.elements.statusContext) {
            if (showBreadcrumb && breadcrumbPath) {
                this.elements.statusContext.innerHTML = breadcrumbPath
                    .map((item, i) => i === breadcrumbPath.length - 1
                        ? `<span class="breadcrumb-current">${item}</span>`
                        : `<span class="breadcrumb-item">${item}</span>`)
                    .join('<span class="breadcrumb-sep">›</span>');
            } else {
                this.elements.statusContext.textContent = context || title || 'UV7';
            }
        }

        // Update document title
        if (title) {
            document.title = `${title} | UV7`;
        }
    }

    /**
     * Update the sidebar based on app config
     * @param {Object|null} config - Sidebar configuration {title, content, init}
     */
    updateSidebar(config = null) {
        const sidebar = document.getElementById('uv7-sidebar');
        if (!sidebar) return;

        // If no config provided, restore default shell sidebar
        if (!config) {
            this.restoreDefaultSidebar();
            return;
        }

        const { title, content, init } = config;

        // Update sidebar title
        const sidebarTitle = sidebar.querySelector('.sidebar-title');
        if (sidebarTitle && title) {
            sidebarTitle.textContent = title;
        }

        // Update sidebar content
        const sidebarContent = sidebar.querySelector('.sidebar-content');
        if (sidebarContent && content) {
            sidebarContent.innerHTML = content;

            // Run initialization function if provided
            if (typeof init === 'function') {
                try {
                    init();
                    console.log('[UV7Shell] Sidebar init function executed');
                } catch (error) {
                    console.error('[UV7Shell] Sidebar init function failed:', error);
                }
            }
        }
    }

    /**
     * Restore the default shell sidebar
     */
    restoreDefaultSidebar() {
        const sidebar = document.getElementById('uv7-sidebar');
        if (!sidebar) return;

        const sidebarTitle = sidebar.querySelector('.sidebar-title');
        if (sidebarTitle) {
            sidebarTitle.textContent = '🏠 UV7 OS';
        }

        const sidebarContent = sidebar.querySelector('.sidebar-content');
        if (sidebarContent) {
            sidebarContent.innerHTML = `
                <div class="sidebar-section">
                    <div class="sidebar-section-title">Quick Launch</div>
                    <button class="quick-action" data-action="launch-v1" style="width: 100%; margin-bottom: 0.5rem;">
                        <span class="quick-action-icon">🎮</span>
                        <span class="quick-action-label">V1 Game</span>
                    </button>
                    <button class="quick-action" data-action="launch-v2" style="width: 100%; margin-bottom: 0.5rem;">
                        <span class="quick-action-icon">⚡</span>
                        <span class="quick-action-label">V2 Engine</span>
                    </button>
                    <button class="quick-action" data-action="view-showcase" style="width: 100%; margin-bottom: 0.5rem;">
                        <span class="quick-action-icon">📖</span>
                        <span class="quick-action-label">Showcase</span>
                    </button>
                    <button class="quick-action" data-action="launch-torigatchi" style="width: 100%;">
                        <span class="quick-action-icon">💖</span>
                        <span class="quick-action-label">Tori-gatchi</span>
                    </button>
                </div>
            `;
        }
    }

    /**
     * Show error state in viewport
     * @param {string} appId 
     * @param {Error} error 
     */
    showErrorState(appId, error) {
        if (this.elements.viewport) {
            this.elements.viewport.innerHTML = `
                <div class="shell-error">
                    <div class="shell-error-icon">⚠️</div>
                    <h2>Failed to load ${appId}</h2>
                    <p>${error.message}</p>
                    <button onclick="location.hash = '#/'">Return to Landing</button>
                </div>
            `;
        }
    }

    /**
     * Navigate to an app (convenience method)
     * @param {string} appId 
     * @param {Object} params 
     */
    navigateTo(appId, params = {}) {
        this.router.navigate(appId, params);
    }

    // ═══════════════════════════════════════════════════════════════
    // SHADE & SIDEBAR CONTROLS (Shell owns these)
    // ═══════════════════════════════════════════════════════════════

    openShade() {
        this.elements.shade?.classList.add('open');
        this.elements.backdrop?.classList.add('visible');
    }

    closeShade() {
        this.elements.shade?.classList.remove('open');
        this.elements.backdrop?.classList.remove('visible');
    }

    toggleSidebar() {
        this.elements.sidebar?.classList.toggle('open');
        this.elements.backdrop?.classList.toggle('visible');
    }

    openSidebar() {
        this.elements.sidebar?.classList.add('open');
        this.elements.backdrop?.classList.add('visible');
    }

    closeSidebar() {
        this.elements.sidebar?.classList.remove('open');
        this.elements.backdrop?.classList.remove('visible');
    }
}

// ═══════════════════════════════════════════════════════════════
// AUTO-INITIALIZATION
// ═══════════════════════════════════════════════════════════════

// Create global instance
window.uv7Shell = null;

document.addEventListener('DOMContentLoaded', async () => {
    window.uv7Shell = new UV7Shell();
    await window.uv7Shell.init();
});

export default UV7Shell;
