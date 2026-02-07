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
import { GrabHandleController } from './GrabHandleController.js';
import { ToriService } from './services/ToriService.js';
import type { BaseApp } from './apps/BaseApp.js';
import { attachEasterEggTapHandler } from './utils/EasterEggHandler.js';

interface AppLoader {
    (): Promise<{ default: new (shell: UV7Shell) => BaseApp }>;
}

interface ShellElements {
    viewport: HTMLElement | null;
    statusBar: HTMLElement | null;
    statusContext: HTMLElement | null;
    shade: HTMLElement | null;
    sidebar: HTMLElement | null;
    backdrop: HTMLElement | null;
    appSwitcher: HTMLElement | null;
    appCardsGrid: HTMLElement | null;
}

interface AppConfig {
    title: string;
    icon: string;
    description: string;
}

interface RecentApp extends AppConfig {
    id: string;
    timestamp: Date;
}

interface StatusBarConfig {
    title?: string;
    context?: string;
    showBreadcrumb?: boolean;
    breadcrumbPath?: string[];
}

interface SidebarConfig {
    title: string;
    content: string | HTMLElement;
    init?: () => void;
}

declare global {
    interface Window {
        uv7Shell: UV7Shell | null;
    }
}

export class UV7Shell {
    currentApp: BaseApp | null;
    private appRegistry: Map<string, AppLoader>;
    gestureRouter: GestureRouter;
    router: Router;
    system: UV7System | null;
    private grabHandle: GrabHandleController | null;
    private toriService: ToriService | null;
    private elements: ShellElements;
    private initialized: boolean;
    private recentApps: RecentApp[];

    constructor() {
        this.currentApp = null;
        this.appRegistry = new Map();
        this.gestureRouter = new GestureRouter(this);
        this.router = new Router(this);
        this.system = null;
        this.grabHandle = null;
        this.toriService = null;
        this.elements = {} as ShellElements;
        this.initialized = false;

        // Load recent apps from localStorage
        this.recentApps = this.loadRecentApps();
    }

    /**
     * Initialize the shell
     *
     * Bootstraps the UV7 OS environment by setting up:
     * - UV7System (status bar, shade, sidebar chrome)
     * - GestureRouter (touch input management)
     * - ToriService (background Tori-gatchi simulation)
     * - Router (hash-based navigation)
     * - App registry (lazy-loaded app modules)
     * - App switcher and quick actions
     *
     * Called automatically on DOMContentLoaded. Should only be called once.
     *
     * @example
     * const shell = new UV7Shell();
     * await shell.init();
     */
    async init(): Promise<void> {
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

        // Initialize Grab Handle Controller (V1 Parity)
        this.grabHandle = new GrabHandleController();

        // NOTE: GrabHandleController's toggle event is DISABLED
        // UV7System.initSidebarToggle() handles the button click directly
        // Listening to 'uv7:sidebar-toggle' here causes DOUBLE TOGGLE (open then close)
        // 
        // window.addEventListener('uv7:sidebar-toggle', () => {
        //     this.system!.toggleSidebar();
        // });

        // Initialize Tori-gatchi Status Bridge (BEFORE ToriService so listener is ready)
        this.initToriBridge();

        // Initialize Tori Service (Background Ghost Engine)
        this.toriService = new ToriService(this);
        this.toriService.init();

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

        // Initialize Settings Icon
        this.initSettingsIcon();

        this.initialized = true;
        console.log('[UV7Shell] Initialized successfully');
    }

    /**
     * Initialize Settings Icon (Status Bar)
     * Wires the cog wheel to open the Notification Shade
     */
    private initSettingsIcon(): void {
        const settingsIcon = document.getElementById('uv7-settings');
        if (settingsIcon) {
            // Make it clickable
            settingsIcon.style.cursor = 'pointer';

            settingsIcon.addEventListener('click', () => {
                this.system!.openShade();
            });

            // Console log to confirm wiring
            console.log('[UV7Shell] Settings icon wired to Notification Shade');
        }
    }

    /**
     * Initialize Tori-gatchi Status Bridge
     * Monitors localStorage for Tori's state and updates status bar
     */
    private initToriBridge(): void {
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

        // Listen for Tori status change events (event-based, not polling)
        window.addEventListener('uv7:tori-status-changed', (e: Event) => {
            const customEvent = e as CustomEvent;
            this.updateToriStatus(customEvent.detail);
        });

        // Listen for storage events (if multiple tabs/windows)
        window.addEventListener('storage', (e) => {
            if (e.key === 'toriGatchiState') {
                this.updateToriStatus();
            }
        });

        // Note: No initial updateToriStatus() call needed - ToriService.tick() will
        // emit the status change event immediately after this bridge is set up

        console.log('[UV7Shell] Tori bridge initialized successfully');
    }

    /**
     * Update Tori status display
     * @param projectedState - Optional pre-calculated state from ToriService
     */
    private updateToriStatus(projectedState?: any): void {
        const toriStatus = document.getElementById('tori-status');
        if (!toriStatus) return;

        try {
            let state;

            // Use provided state or fetch from localStorage
            if (projectedState) {
                state = projectedState;
            } else {
                const stateStr = localStorage.getItem('toriGatchiState');
                if (!stateStr) {
                    (toriStatus as HTMLElement).style.display = 'none';
                    return;
                }
                state = JSON.parse(stateStr);
            }

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
            (toriStatus as HTMLElement).style.color = color;
            (toriStatus as HTMLElement).style.display = 'flex';

        } catch (e) {
            console.warn('[UV7Shell] Failed to parse Tori state', e);
            (toriStatus as HTMLElement).style.display = 'none';
        }
    }

    /**
     * Initialize global audio feedback
     */
    private initGlobalAudio(): void {
        document.addEventListener('click', (e) => {
            // Resume audio context on first interaction
            shellAudio.resume();

            // Play sound for interactive elements
            const target = (e.target as HTMLElement).closest('button, a, .clickable, .app-card, .quick-action');
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
    private cacheElements(): void {
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
    private async registerApps(): Promise<void> {
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
     *
     * Handles the complete app lifecycle:
     * 1. Unmount current app (if any)
     * 2. Dynamically import the app module (code-splitting)
     * 3. Instantiate and mount the new app
     * 4. Register gesture handlers with GestureRouter
     * 5. Update status bar and sidebar based on app config
     * 6. Add to recent apps for the app switcher
     *
     * If the app is already loaded, just triggers onRouteChange() with new params.
     *
     * @param appId - The app identifier ('landing', 'showcase', 'v1', 'v2', 'torigatchi')
     * @param params - Route parameters from the URL hash
     *
     * @example
     * // Via router (typical)
     * shell.router.navigate('showcase', { phase: '42' });
     *
     * // Direct call (advanced)
     * await shell.loadApp('showcase', { phase: '42' });
     */
    async loadApp(appId: string, params: Record<string, any> = {}): Promise<void> {
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

        // Show loading state
        if (this.elements.viewport) {
            this.elements.viewport.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <div>Loading ${appId}...</div>
                </div>
            `;
        }

        try {
            // Unmount current app
            if (this.currentApp) {
                console.log(`[UV7Shell] Unmounting: ${this.currentApp.id}`);

                // Check if current app uses customChrome - restore shell chrome if so
                if (typeof this.currentApp.getStatusBarSpec === 'function') {
                    const currentSpec = this.currentApp.getStatusBarSpec();
                    if (currentSpec.customChrome) {
                        console.log(`[UV7Shell] Restoring all shell chrome after customChrome app`);
                        // Restore all shell chrome
                        if (this.elements.statusBar) this.elements.statusBar.style.display = '';
                        if (this.elements.sidebar) this.elements.sidebar.style.display = '';
                        if (this.elements.shade) this.elements.shade.style.display = '';

                        // Restore viewport to below status bar
                        this.elements.viewport?.classList.remove('full-viewport');

                        // Re-enable shell gesture router
                        this.gestureRouter.init();
                    }
                }

                await this.currentApp.unmount();
                this.gestureRouter.unregisterApp(this.currentApp.id);
            }

            // Dynamic import the app module
            const appLoader = this.appRegistry.get(appId)!;
            const AppModule = await appLoader();
            const AppClass = AppModule.default;

            // Create app instance
            const app = new AppClass(this);
            app.id = appId;

            // Clear viewport (remove loading state)
            if (this.elements.viewport) {
                this.elements.viewport.innerHTML = '';
            }

            // Expose SystemAPI to app BEFORE mount (Belle's controlled API pattern)
            // This allows apps to register action handlers during mount()
            app.api = this.system!.getAPI();
            console.log(`[UV7Shell] SystemAPI exposed to ${appId}`);

            // Mount the app
            await app.mount(this.elements.viewport!, params);

            // Register gesture handlers
            if (app.gestureHandlers) {
                this.gestureRouter.registerApp(appId, app.gestureHandlers);
            }

            // Apply chrome specs (Phase 2)
            // Apply StatusBarSpec (new architecture)
            if (typeof app.getStatusBarSpec === 'function') {
                const spec = app.getStatusBarSpec();
                this.system!.applyStatusBarSpec(spec);
                console.log(`[UV7Shell] Applied StatusBarSpec for ${appId}`);

                // Check if app manages its own chrome (sidebar/shade/statusbar)
                if (spec.customChrome) {
                    console.log(`[UV7Shell] App ${appId} uses customChrome - hiding all shell chrome`);
                    // Hide all shell chrome: status bar, sidebar, shade
                    if (this.elements.statusBar) this.elements.statusBar.style.display = 'none';
                    if (this.elements.sidebar) this.elements.sidebar.style.display = 'none';
                    if (this.elements.shade) this.elements.shade.style.display = 'none';

                    // Expand viewport to full screen
                    this.elements.viewport?.classList.add('full-viewport');

                    // Disable shell gesture router to prevent conflicts with app gestures
                    this.gestureRouter.destroy();
                } else {
                    // Apply sidebar/shade specs normally
                    if (typeof app.getSidebarSpec === 'function') {
                        const sidebarSpec = app.getSidebarSpec();
                        this.system!.applySidebarSpec(sidebarSpec);
                        console.log(`[UV7Shell] Applied SidebarSpec for ${appId}`);
                    } else {
                        // Fallback to old getSidebarConfig() for backwards compatibility
                        this.updateSidebar(app.getSidebarConfig());
                    }
                }
            } else {
                // Fallback to old getStatusBarConfig() for backwards compatibility
                this.updateStatusBar(app.getStatusBarConfig());

                // Also apply sidebar if available
                if (typeof app.getSidebarSpec === 'function') {
                    const spec = app.getSidebarSpec();
                    this.system!.applySidebarSpec(spec);
                    console.log(`[UV7Shell] Applied SidebarSpec for ${appId}`);
                } else {
                    // Fallback to old getSidebarConfig()
                    this.updateSidebar(app.getSidebarConfig());
                }
            }

            // Store reference
            this.currentApp = app;

            console.log(`[UV7Shell] App ${appId} mounted successfully`);

        } catch (error) {
            console.error(`[UV7Shell] Failed to load app ${appId}:`, error);
            this.showErrorState(appId, error as Error);
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
     * @param config - Status bar configuration
     */
    private updateStatusBar(config: StatusBarConfig = {}): void {
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
     * @param config - Sidebar configuration {title, content, init}
     */
    private updateSidebar(config: SidebarConfig | null = null): void {
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
            // Handle both string and HTMLElement content
            if (typeof content === 'string') {
                sidebarContent.innerHTML = content;
            } else {
                sidebarContent.innerHTML = ''; // Clear existing
                sidebarContent.appendChild(content);
            }

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
    private attachQuickActionListeners(): void {
        document.querySelectorAll('.quick-action[data-action]').forEach(btn => {
            // Remove old listener if exists (prevent duplicates)
            btn.replaceWith(btn.cloneNode(true));
        });

        // Re-query after cloning (to get fresh references)
        document.querySelectorAll('.quick-action[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = (e.currentTarget as HTMLElement).dataset.action;

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
    private restoreDefaultSidebar(): void {
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
    private initEasterEgg(): void {
        const brandingElements = document.querySelectorAll('.uv7-carrier-branding');

        brandingElements.forEach(element => {
            // Remove old listener if exists (prevent duplicates)
            const newElement = element.cloneNode(true) as HTMLElement;
            element.parentNode!.replaceChild(newElement, element);

            attachEasterEggTapHandler(newElement, (msg) => this.showToast(msg));
        });
    }

    /**
     * Show a temporary toast notification
     *
     * Delegates to UV7System's toast implementation.
     *
     * @param message - The text to display in the toast
     *
     * @example
     * shell.showToast('Settings saved!');
     * shell.showToast('Tori is happy!');
     */
    showToast(message: string): void {
        this.system?.getAPI().toast.show(message);
    }

    /**
     * Show error state in viewport
     * @param appId
     * @param error
     */
    private showErrorState(appId: string, error: Error): void {
        if (this.elements.viewport) {
            this.elements.viewport.innerHTML = `
                <div class="shell-error">
                    <div class="shell-error-icon">⚠️</div>
                    <h2>Failed to load ${appId}</h2>
                    <p>${error.message}</p>
                    <button onclick="location.hash = '#/'">Return to Home</button>
                </div>
            `;
        }
    }

    /**
     * Navigate to an app
     *
     * Convenience method that wraps router.navigate(). Updates the URL hash
     * and triggers app loading. Use this instead of manually setting location.hash.
     *
     * @param appId - The app identifier to navigate to
     * @param params - Optional key-value parameters for the app
     *
     * @example
     * shell.navigateTo('showcase');
     * shell.navigateTo('showcase', { phase: '42' });
     */
    navigateTo(appId: string, params: Record<string, any> = {}): void {
        this.router.navigate(appId, params);
    }

    // ═══════════════════════════════════════════════════════════════
    // SHADE & SIDEBAR CONTROLS (Shell owns these)
    // ═══════════════════════════════════════════════════════════════

    /**
     * Open the notification shade
     *
     * Shows the shade panel (settings, quick actions, system info).
     * Managed by UV7System but controlled by shell.
     *
     * @example
     * shell.openShade();
     */
    openShade(): void {
        this.elements.shade?.classList.add('open');
        this.elements.backdrop?.classList.add('visible');
    }

    /**
     * Close the notification shade
     *
     * @example
     * shell.closeShade();
     */
    closeShade(): void {
        this.elements.shade?.classList.remove('open');
        this.elements.backdrop?.classList.remove('visible');
    }

    /**
     * Toggle the sidebar visibility
     *
     * Opens if closed, closes if open. Used by pull-down gesture
     * in landscape mode.
     *
     * @example
     * shell.toggleSidebar();
     */
    toggleSidebar(): void {
        this.elements.sidebar?.classList.toggle('open');
        this.elements.backdrop?.classList.toggle('visible');
    }

    /**
     * Open the sidebar
     *
     * Shows the sidebar panel (quick launch, navigation).
     *
     * @example
     * shell.openSidebar();
     */
    openSidebar(): void {
        this.elements.sidebar?.classList.add('open');
        this.elements.backdrop?.classList.add('visible');
    }

    /**
     * Close the sidebar
     *
     * @example
     * shell.closeSidebar();
     */
    closeSidebar(): void {
        this.elements.sidebar?.classList.remove('open');
        this.elements.backdrop?.classList.remove('visible');
    }

    // ═══════════════════════════════════════════════════════════════
    // APP SWITCHER CONTROLS
    // ═══════════════════════════════════════════════════════════════

    /**
     * Initialize App Switcher events
     */
    private initAppSwitcher(): void {
        // Status Logo toggles switcher (User request)
        const logoBtn = document.querySelector('.status-logo');
        if (logoBtn) {
            // Remove old listeners by cloning
            const newBtn = logoBtn.cloneNode(true);
            logoBtn.parentNode!.replaceChild(newBtn, logoBtn);

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
                this.saveRecentApps();
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
     * Load recent apps from localStorage
     */
    private loadRecentApps(): RecentApp[] {
        try {
            const stored = localStorage.getItem('uv7-recent-apps');
            if (stored) {
                const apps = JSON.parse(stored);
                // Convert timestamp strings back to Date objects and validate
                return apps.map((app: any) => {
                    // Ensure app has all required properties by merging with fresh config
                    const config = this.getAppConfig(app.id || 'unknown');
                    return {
                        id: app.id || 'unknown',
                        ...config,
                        timestamp: app.timestamp ? new Date(app.timestamp) : new Date()
                    };
                }).filter((app: RecentApp) => app.id !== 'unknown');
            }
        } catch (e) {
            console.warn('[UV7Shell] Failed to load recent apps', e);
        }
        return [];
    }

    /**
     * Save recent apps to localStorage
     */
    private saveRecentApps(): void {
        try {
            localStorage.setItem('uv7-recent-apps', JSON.stringify(this.recentApps));
        } catch (e) {
            console.warn('[UV7Shell] Failed to save recent apps', e);
        }
    }

    /**
     * Add app to recent list
     * @param appId
     */
    private addToRecentApps(appId: string): void {
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

        // Persist to localStorage
        this.saveRecentApps();
    }

    /**
     * Get static config for app (placeholder)
     * @param appId
     */
    private getAppConfig(appId: string): AppConfig {
        const configs: Record<string, AppConfig> = {
            'landing': { title: 'Home', icon: '🏠', description: 'UV7 Landing Page' },
            'showcase': { title: 'Showcase', icon: '📖', description: 'Design System & Docs' },
            'v1': { title: 'V1 Game', icon: '🎮', description: 'The Original Chaos' },
            'v2': { title: 'V2 Engine', icon: '⚡', description: 'Next-Gen Visual Novel' },
            'torigatchi': { title: 'Tori-gatchi', icon: '💖', description: 'Virtual Pet Companion' }
        };
        return configs[appId] || { title: appId, icon: '📱', description: 'UV7 App' };
    }

    /**
     * Toggle the app switcher overlay
     *
     * Shows the recent apps interface (similar to iOS/Android task switcher).
     * Triggered by tapping the UV7 logo in the status bar.
     *
     * @example
     * shell.toggleAppSwitcher();
     */
    toggleAppSwitcher(): void {
        if (this.elements.appSwitcher?.classList.contains('open')) {
            this.closeAppSwitcher();
        } else {
            this.openAppSwitcher();
        }
    }

    /**
     * Open the app switcher
     *
     * Renders recent apps and displays the switcher overlay.
     *
     * @example
     * shell.openAppSwitcher();
     */
    openAppSwitcher(): void {
        this.renderAppSwitcher();
        this.elements.appSwitcher?.classList.add('open');
        this.elements.backdrop?.classList.add('visible'); // Optional: reuse backdrop or switcher has its own bg
    }

    /**
     * Close the app switcher
     *
     * Hides the app switcher overlay. Preserves backdrop if
     * sidebar or shade is still open.
     *
     * @example
     * shell.closeAppSwitcher();
     */
    closeAppSwitcher(): void {
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
    renderAppSwitcher(): void {
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

        // Fallback: If empty, assume we are on home/showcase (since we are here)
        if (this.recentApps.length === 0) {
            this.addToRecentApps('showcase');
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
     * Remove an app from the recent apps list
     *
     * Removes the app from the switcher and re-renders the UI.
     * Called when user clicks the X button on an app card.
     *
     * @param appId - The app identifier to remove
     *
     * @example
     * shell.removeFromRecent('v1');
     */
    removeFromRecent(appId: string): void {
        this.recentApps = this.recentApps.filter(app => app.id !== appId);
        this.saveRecentApps();
        this.renderAppSwitcher();
    }

    private formatTime(date: Date): string {
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
