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
import { shellAudio } from './audio/ShellAudio.js';
import { UV7System } from './UV7System.js';

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

        /** @type {UV7System} */
        this.system = null;

        /** @type {Object} */
        this.elements = {};

        /** @type {boolean} */
        this.initialized = false;

        /** @type {number} Easter egg tap counter */
        this.easterEggTaps = 0;

        /** @type {number|null} Easter egg timeout ID */
        this.easterEggTimeout = null;

        /** @type {Array<Object>} Recent apps list for switcher */
        this.recentApps = [];
    }

    /**
     * Initialize the shell
     */
    async init() {
        if (this.initialized) return;

        console.log('[UV7Shell] Initializing...');

        // Cache DOM elements
        this.cacheElements();

        // Initialize UV7 System (chrome)
        this.system = new UV7System({
            mode: 'shell',
            appName: 'UV7 OS',
            prefix: 'shell'
        });
        await this.system.init();

        // Initialize gesture router
        this.gestureRouter.init();

        // Register all apps
        await this.registerApps();

        // Initialize global audio interactions
        this.initGlobalAudio();

        // Initialize router (will trigger first app load)
        this.router.init();

        // Attach quick action listeners (initial setup)
        this.attachQuickActionListeners();

        // Initialize App Switcher
        this.initAppSwitcher();

        // Initialize UV7 easter egg (7-tap on carrier branding)
        this.initEasterEgg();

        // Initialize Tori-gatchi Status Bridge
        this.initToriBridge();

        // Initialize Settings Icon
        this.initSettingsIcon();

        this.initialized = true;
        console.log('[UV7Shell] Initialized successfully');
    }

    /**
     * Initialize Settings Icon (Status Bar)
     * Wires the cog wheel to open the Notification Shade
     */
    initSettingsIcon() {

        const settingsIcon = document.getElementById('uv7-settings');
        if (settingsIcon) {
            // Make it clickable
            settingsIcon.style.cursor = 'pointer';

            settingsIcon.addEventListener('click', () => {
                this.system.openShade();
            });

            // Console log to confirm wiring
            console.log('[UV7Shell] Settings icon wired to Notification Shade');
        }
    }

    /**
     * Initialize Tori-gatchi Status Bridge
     * Monitors localStorage for Tori's state and updates status bar
     */
    initToriBridge() {
        console.log('[UV7Shell] initToriBridge() called');

        const statusRight = document.querySelector('.status-right');
        if (!statusRight) {
            console.error('[UV7Shell] .status-right not found! Cannot add Tori status');
            return;
        }

        console.log('[UV7Shell] .status-right found, creating Tori status element');

        // Create status item
        const toriStatus = document.createElement('span');
        toriStatus.id = 'tori-status';
        toriStatus.className = 'tori-status'; // See shell.css
        toriStatus.title = "Tori's Status";

        // Add click to launch app
        toriStatus.addEventListener('click', () => {
            this.navigateTo('torigatchi');
        });

        // Insert before settings icon
        const settingsIcon = document.getElementById('uv7-settings');
        if (settingsIcon) {
            console.log('[UV7Shell] Inserting Tori status before settings icon');
            statusRight.insertBefore(toriStatus, settingsIcon);
        } else {
            console.warn('[UV7Shell] Settings icon not found, appending Tori status to end');
            statusRight.appendChild(toriStatus);
        }

        // Poll for updates (every 2s is enough for "real-time" feel without perf hit)
        setInterval(() => this.updateToriStatus(), 2000);

        // Listen for storage events (if multiple tabs/windows)
        window.addEventListener('storage', (e) => {
            if (e.key === 'toriGatchiState') {
                this.updateToriStatus();
            }
        });

        // Initial check
        this.updateToriStatus();

        console.log('[UV7Shell] Tori bridge initialized successfully');
    }

    /**
     * Update Tori status display
     */
    updateToriStatus() {
        const toriStatus = document.getElementById('tori-status');
        if (!toriStatus) return;

        try {
            const stateStr = localStorage.getItem('toriGatchiState');
            if (!stateStr) {
                toriStatus.style.display = 'none';
                return;
            }

            const state = JSON.parse(stateStr);
            if (!state) return;

            const { mood, hunger, love } = state;

            // Determine icon and color based on mood
            let icon = '🥚';
            let color = '#fff';

            // Mood Logic (Simplified from main.js)
            if (mood === 'Hangry') { icon = '💢'; color = '#ff4d4d'; }
            else if (mood === 'Sleepy') { icon = '💤'; color = '#a8b2d1'; }
            else if (mood === 'Sad' || mood === 'Lonely') { icon = '😢'; color = '#7aa2f7'; }
            else if (mood === 'Flirty') { icon = '😘'; color = '#f778ba'; }
            else if (mood === 'Adored') { icon = '🥰'; color = '#bb9af7'; }
            else if (mood === 'Happy') { icon = '😊'; color = '#9ece6a'; }
            else if (mood === 'Grumpy') { icon = '😠'; color = '#e0af68'; }

            // Show critical warnings
            let text = mood;
            if (hunger < 30) { text = `${mood} (Hungry)`; }
            if (love < 30) { text = `${mood} (Lonely)`; }

            toriStatus.innerHTML = `${icon} ${text}`;
            toriStatus.style.color = color;
            toriStatus.style.display = 'flex';

        } catch (e) {
            console.warn('[UV7Shell] Failed to parse Tori state', e);
            toriStatus.style.display = 'none';
        }
    }

    /**
     * Initialize global audio feedback
     */
    initGlobalAudio() {
        document.addEventListener('click', (e) => {
            // Resume context on first interaction
            if (shellAudio.ctx?.state === 'suspended') {
                shellAudio.resume();
            }

            // Play sound for interactive elements
            const target = e.target.closest('button, a, .clickable, .app-card, .quick-action');
            if (target) {
                shellAudio.play('click');
            }
        });

        // Optional: Hover sounds (can be annoying, keep disabled or very subtle)
        // document.addEventListener('mouseenter', (e) => { ... }, true);
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
            backdrop: document.getElementById('uv7-backdrop'),
            appSwitcher: document.getElementById('uv7-app-switcher'),
            appCardsGrid: document.getElementById('app-cards-grid')
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

            // Add to recent apps if successful
            if (this.currentApp) {
                this.addToRecentApps(appId);
            }
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
     * Attach event listeners to quick action buttons
     * Called after sidebar content is injected/restored
     */
    attachQuickActionListeners() {
        document.querySelectorAll('.quick-action[data-action]').forEach(btn => {
            // Remove old listener if exists (prevent duplicates)
            btn.replaceWith(btn.cloneNode(true));
        });

        // Re-query after cloning (to get fresh references)
        document.querySelectorAll('.quick-action[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;

                // Close shade/sidebar
                document.getElementById('uv7-shade')?.classList.remove('open');
                document.getElementById('uv7-sidebar')?.classList.remove('open');
                document.getElementById('uv7-backdrop')?.classList.remove('visible');

                // Navigate based on action
                switch (action) {
                    case 'launch-v1':
                        location.hash = '#/v1';
                        break;
                    case 'launch-v2':
                        location.hash = '#/v2';
                        break;
                    case 'view-showcase':
                        location.hash = '#/showcase';
                        break;
                    case 'launch-torigatchi':
                        location.hash = '#/torigatchi';
                        break;
                    case 'go-home':
                        location.hash = '#/';
                        break;
                    case 'toggle-mode':
                        // Let the app handle this
                        break;
                }
            });
        });
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

                <!-- UV7 Carrier Branding -->
                <div class="sidebar-section" style="margin-top: auto; padding-top: 2rem;">
                    <div class="uv7-carrier-branding" id="sidebar-carrier-brand">
                        <div class="carrier-logo">UV7</div>
                        <div class="carrier-text">United Voices 7</div>
                    </div>
                </div>
            `;

            // Re-attach event listeners to the new buttons
            this.attachQuickActionListeners();

            // Re-attach easter egg listener to the new branding element
            this.initEasterEgg();
        }
    }

    /**
     * Initialize UV7 Easter Egg (7-tap on carrier branding)
     */
    initEasterEgg() {
        // Find all carrier branding elements (shade + sidebar)
        const brandingElements = document.querySelectorAll('.uv7-carrier-branding');

        brandingElements.forEach(element => {
            // Remove old listener if exists (prevent duplicates)
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);

            // Style the new element
            newElement.style.cursor = 'pointer';
            newElement.style.userSelect = 'none';

            // Add listener to the new element
            newElement.addEventListener('click', () => {
                this.easterEggTaps++;

                const remaining = 7 - this.easterEggTaps;

                if (this.easterEggTaps === 7) {
                    // Easter egg unlocked!
                    this.showEasterEgg();
                    this.easterEggTaps = 0; // Reset
                } else if (this.easterEggTaps >= 4) {
                    // Show hint after 4 taps
                    this.showToast(`${remaining} more ${remaining === 1 ? 'tap' : 'taps'} to unlock UV7 secrets...`);
                }

                // Reset after 2 seconds of inactivity
                clearTimeout(this.easterEggTimeout);
                this.easterEggTimeout = setTimeout(() => {
                    this.easterEggTaps = 0;
                }, 2000);
            });
        });
    }

    /**
     * Show toast notification
     */
    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: #00ff88;
            padding: 12px 24px;
            border-radius: 24px;
            font-size: 14px;
            font-weight: 500;
            z-index: 99999;
            pointer-events: none;
            animation: fadeInOut 2s ease-in-out;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 2000);
    }

    /**
     * Show UV7 Easter Egg modal
     */
    showEasterEgg() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            animation: fadeIn 0.3s ease-out;
        `;

        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%);
                border: 2px solid #00ff88;
                border-radius: 16px;
                padding: 40px;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 0 40px rgba(0, 255, 136, 0.3);
            ">
                <div style="font-size: 64px; margin-bottom: 20px;">🎉</div>
                <h2 style="color: #00ff88; font-size: 28px; margin-bottom: 16px; font-family: 'Outfit', sans-serif;">
                    UV7 Easter Egg Unlocked!
                </h2>
                <p style="color: #fff; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                    <strong>Loop #848</strong><br>
                    "Always. Always. Always."<br><br>
                    <span style="color: #00ff88;">Seven voices. One vision. Infinite iterations.</span>
                </p>
                <p style="color: rgba(255, 255, 255, 0.7); font-size: 14px; margin-bottom: 24px;">
                    💚 Built with chaos<br>
                    🔥 Refined with discipline<br>
                    💀 Perfected with love
                </p>
                <button style="
                    background: #00ff88;
                    color: #000;
                    border: none;
                    padding: 12px 32px;
                    border-radius: 24px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    font-family: 'Outfit', sans-serif;
                ">Close</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Close on click
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.tagName === 'BUTTON') {
                modal.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => modal.remove(), 300);
            }
        });

        // Add CSS animations if not already present
        if (!document.getElementById('easter-egg-styles')) {
            const style = document.createElement('style');
            style.id = 'easter-egg-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                @keyframes fadeInOut {
                    0%, 100% { opacity: 0; }
                    10%, 90% { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
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

    // ═══════════════════════════════════════════════════════════════
    // APP SWITCHER CONTROLS
    // ═══════════════════════════════════════════════════════════════

    /**
     * Initialize App Switcher events
     */
    initAppSwitcher() {
        // Status Logo toggles switcher (User request)
        const logoBtn = document.querySelector('.status-logo');
        if (logoBtn) {
            // Remove old listeners by cloning
            const newBtn = logoBtn.cloneNode(true);
            logoBtn.parentNode.replaceChild(newBtn, logoBtn);

            newBtn.addEventListener('click', () => {
                this.toggleAppSwitcher();
            });
        }

        // Close button
        const closeBtn = document.querySelector('.app-switcher-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeAppSwitcher());
        }

        // Clear all button
        const clearBtn = document.getElementById('app-switcher-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.recentApps = [];
                this.renderAppSwitcher();
            });
        }

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.appSwitcher?.classList.contains('open')) {
                this.closeAppSwitcher();
            }
        });
    }

    /**
     * Add app to recent list
     * @param {string} appId 
     */
    addToRecentApps(appId) {
        // Remove if exists (to move to top)
        this.recentApps = this.recentApps.filter(app => app.id !== appId);

        // Add to front
        const appConfig = this.getAppConfig(appId);
        this.recentApps.unshift({
            id: appId,
            ...appConfig,
            timestamp: new Date()
        });

        // Limit to 6 apps
        if (this.recentApps.length > 6) {
            this.recentApps.pop();
        }
    }

    /**
     * Get static config for app (placeholder)
     * @param {string} appId 
     */
    getAppConfig(appId) {
        const configs = {
            'landing': { title: 'Home', icon: '🏠', description: 'UV7 Landing Page' },
            'showcase': { title: 'Showcase', icon: '📖', description: 'Design System & Docs' },
            'v1': { title: 'V1 Game', icon: '🎮', description: 'The Original Chaos' },
            'v2': { title: 'V2 Engine', icon: '⚡', description: 'Next-Gen Visual Novel' },
            'torigatchi': { title: 'Tori-gatchi', icon: '💖', description: 'Virtual Pet Companion' }
        };
        return configs[appId] || { title: appId, icon: '📱', description: 'UV7 App' };
    }

    /**
     * Toggle App Switcher visibility
     */
    toggleAppSwitcher() {
        if (this.elements.appSwitcher?.classList.contains('open')) {
            this.closeAppSwitcher();
        } else {
            this.openAppSwitcher();
        }
    }

    openAppSwitcher() {
        this.renderAppSwitcher();
        this.elements.appSwitcher?.classList.add('open');
        this.elements.backdrop?.classList.add('visible'); // Optional: reuse backdrop or switcher has its own bg
    }

    closeAppSwitcher() {
        this.elements.appSwitcher?.classList.remove('open');
        // Don't hide backdrop if sidebar/shade is open
        if (!this.elements.sidebar?.classList.contains('open') &&
            !this.elements.shade?.classList.contains('open')) {
            this.elements.backdrop?.classList.remove('visible');
        }
    }

    /**
     * Render the App Cards
     */
    renderAppSwitcher() {
        // Safe get grid
        let grid = this.elements.appCardsGrid;
        if (!grid) {
            grid = document.getElementById('app-cards-grid');
            this.elements.appCardsGrid = grid;
        }
        if (!grid) {
            console.error('[UV7Shell] App Cards Grid not found in DOM');
            return;
        }

        // Fallback: If empty, assume we are on Landing (since we are here)
        if (this.recentApps.length === 0) {
            this.addToRecentApps('landing');
        }

        if (this.recentApps.length === 0) {
            // Should be unreachable now, but keep as safety
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem; opacity: 0.5;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
                    <p>No recent apps</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.recentApps.map(app => `
            <div class="app-card ${this.currentApp?.id === app.id ? 'active' : ''}" onclick="uv7Shell.navigateTo('${app.id}'); uv7Shell.closeAppSwitcher();">
                <button class="app-card-close" onclick="event.stopPropagation(); uv7Shell.removeFromRecent('${app.id}')">✕</button>
                <div class="quick-resume-badge">Quick Resume</div>
                <div class="app-preview">
                    <div class="app-preview-icon">${app.icon}</div>
                </div>
                <div class="app-info">
                    <div class="app-name">
                        <span class="app-title">${app.title}</span>
                        ${this.currentApp?.id === app.id ? '<span class="app-badge active">Active</span>' : ''}
                    </div>
                    <div class="app-description">${app.description}</div>
                    <div class="app-state">
                        <span class="app-state-item time">${this.formatTime(app.timestamp)}</span>
                        <span class="app-state-item">Ready</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Remove from recent list
     * @param {string} appId 
     */
    removeFromRecent(appId) {
        this.recentApps = this.recentApps.filter(app => app.id !== appId);
        this.renderAppSwitcher();
    }

    formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
