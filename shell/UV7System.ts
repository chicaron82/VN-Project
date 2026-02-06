/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 SYSTEM - UNIVERSAL CHROME CONTROLLER
 *
 * Single source of truth for UV7 OS chrome (status bar, shade, sidebar).
 * Used by both UV7Shell (shell mode) and standalone apps.
 *
 * PHILOSOPHY: "Shell Rules All"
 * - Shell creates chrome once
 * - Apps detect context and adapt
 * - Zero duplication, zero dual status bars
 *
 * CREW CREDITS:
 * - Tori (Architecture vision: Single source of truth)
 * - Belle (Communication API design)
 * - DiZee (Implementation)
 * ═══════════════════════════════════════════════════════════════
 */

import { generateShadeContent } from './ShadeTemplate.js';
import { generateDefaultSidebarContent } from './SidebarTemplate.js';
import { ChromeDevTools } from './devtools/ChromeDevTools.js';

// Import shared types
import type {
    SystemAPI,
    ToastOptions,
    ChromeTheme,
    StatusBarSpec,
    StatusBarAction,
    SidebarSpec,
    SidebarSection,
    ShadeSpec,
    ChromeSpecs
} from '../types/chrome.js';

// Re-export for backwards compatibility
export type {
    SystemAPI,
    ToastOptions,
    ChromeTheme,
    StatusBarSpec,
    StatusBarAction,
    SidebarSpec,
    ShadeSpec,
    ChromeSpecs
};

// Local interfaces (not in shared types)
interface SidebarConfig {
    title: string;
    content: string | HTMLElement;
    init?: () => void;
}

interface UV7SystemOptions {
    mode?: 'shell' | 'standalone';
    appName?: string;
    prefix?: string;
    sidebarConfig?: SidebarConfig;
}

interface UV7SystemElements {
    statusBar: HTMLElement | null;
    statusContext: HTMLElement | null;
    shade: HTMLElement | null;
    sidebar: HTMLElement | null;
    backdrop: HTMLElement | null;
}

interface StatusBarConfig {
    context?: string;
    breadcrumbPath?: string[];
}

// Echo and Tori settings interfaces are unused locally


export class UV7System {
    private mode: 'shell' | 'standalone';
    private appName: string;
    private prefix: string;
    private elements: UV7SystemElements;
    private initialized: boolean;
    private sidebarConfig?: SidebarConfig;

    // SystemAPI support
    private actionHandlers: Map<string, () => void>;
    private originalStatusContext: string | null;
    private messageQueue: Array<{ msg: string; duration: number }>;
    private isShowingMessage: boolean;

    // DevTools (optional, dev mode only)
    public devTools?: ChromeDevTools;

    constructor(options: UV7SystemOptions = {}) {
        this.mode = options.mode || 'shell';
        this.appName = options.appName || 'UV7 OS';
        this.prefix = options.prefix || 'shell';
        this.sidebarConfig = options.sidebarConfig;
        this.elements = {} as UV7SystemElements;
        this.initialized = false;

        // Initialize SystemAPI support
        this.actionHandlers = new Map();
        this.originalStatusContext = null;
        this.messageQueue = [];
        this.isShowingMessage = false;

        // Initialize DevTools
        this.devTools = new ChromeDevTools();
    }

    /**
     * Initialize the UV7 System chrome
     */
    async init(): Promise<void> {
        if (this.initialized) {
            console.warn('[UV7System] Already initialized');
            return;
        }

        console.log(`[UV7System] Initializing in ${this.mode} mode...`);

        // Cache DOM elements
        this.cacheElements();

        // Render chrome components
        this.renderShade();
        this.renderSidebar();

        // Initialize controls
        this.initShadeControls();
        this.initSidebarToggle();
        this.initSettings();

        // Setup communication API
        this.initMessageAPI();

        this.initialized = true;
        console.log('[UV7System] Initialized successfully');

        // Add class to body to signal UV7System is handling chrome
        document.body.classList.add('uv7-system-chrome');

        // Dispatch ready event
        window.dispatchEvent(new CustomEvent('uv7:chrome-ready'));
    }

    /**
     * Cache frequently used DOM elements
     */
    private cacheElements(): void {
        this.elements = {
            statusBar: document.getElementById('uv7-status-bar'),
            statusContext: document.getElementById('uv7-context'),
            shade: document.getElementById('uv7-shade'),
            sidebar: document.getElementById('uv7-sidebar'),
            backdrop: document.getElementById('uv7-backdrop')
        };
    }

    /**
     * Render Shade Content
     */
    private renderShade(): void {
        const shade = this.elements.shade;
        if (!shade) {
            console.error('[UV7System] Could not find shade element');
            return;
        }

        // Get or create shade content container
        let shadeContent = shade.querySelector('.shade-content');

        if (!shadeContent) {
            console.warn('[UV7System] No .shade-content found, rendering full structure');
            shade.innerHTML = `
                <div class="shade-header">
                    <span class="shade-title">🏠 ${this.appName}</span>
                    <button class="shade-close" aria-label="Close">✕</button>
                </div>
                <div class="shade-content"></div>
            `;
            shadeContent = shade.querySelector('.shade-content');
        }

        // Inject content from template
        const isShell = this.mode === 'shell';
        if (shadeContent) {
            shadeContent.innerHTML = generateShadeContent({ isShell });
        }

        console.log('[UV7System] Shade content rendered');
    }

    /**
     * Render Sidebar Content
     */
    private renderSidebar(): void {
        const sidebar = this.elements.sidebar;
        if (!sidebar) {
            console.error('[UV7System] Could not find sidebar element');
            return;
        }

        // Use app-specific sidebar if provided, otherwise use default
        if (this.sidebarConfig) {
            if (typeof this.sidebarConfig.content === 'string') {
                sidebar.innerHTML = this.sidebarConfig.content;
            } else {
                sidebar.innerHTML = ''; // Clear existing content
                sidebar.appendChild(this.sidebarConfig.content);
            }
            console.log('[UV7System] App-specific sidebar content rendered');

            // Call initialization function if provided
            if (this.sidebarConfig.init) {
                this.sidebarConfig.init();
                console.log('[UV7System] Sidebar init function called');
            }
        } else {
            sidebar.innerHTML = generateDefaultSidebarContent({ title: `🏠 ${this.appName}` });
            console.log('[UV7System] Default sidebar content rendered');
        }
    }

    /**
     * Initialize Shade Controls (Close Button + Backdrop)
     */
    private initShadeControls(): void {
        // Wire up close button
        const closeBtn = document.querySelector('.shade-close');
        if (closeBtn) {
            console.log('✅ [UV7System] Shade close button found');
            closeBtn.addEventListener('click', () => {
                console.log('🔘 [UV7System] Shade close button clicked');
                // Resume context on first interaction
                // Note: ctx is private, use resume() which handles state check internally
                // shellAudio.resume(); // Assuming shellAudio is globally available or imported
                this.closeShade();
            });
        } else {
            console.error('❌ [UV7System] Shade close button NOT found!');
        }

        // Wire up backdrop
        if (this.elements.backdrop) {
            // Remove old listeners by cloning
            const newBackdrop = this.elements.backdrop.cloneNode(true) as HTMLElement;
            const parent = this.elements.backdrop.parentNode;
            if (parent) {
                parent.replaceChild(newBackdrop, this.elements.backdrop);
                this.elements.backdrop = newBackdrop;

                this.elements.backdrop.addEventListener('click', () => {
                    console.log('🔘 [UV7System] Backdrop clicked');
                    if (this.elements.shade?.classList.contains('open')) {
                        this.closeShade();
                    }
                    if (this.elements.sidebar?.classList.contains('open')) {
                        this.closeSidebar();
                    }
                });
            } else {
                console.warn('[UV7System] Backdrop parent node not found, using existing element');
                this.elements.backdrop.addEventListener('click', () => {
                    console.log('🔘 [UV7System] Backdrop clicked');
                    if (this.elements.shade?.classList.contains('open')) {
                        this.closeShade();
                    }
                    if (this.elements.sidebar?.classList.contains('open')) {
                        this.closeSidebar();
                    }
                });
            }
        }

        console.log('✅ [UV7System] Shade controls initialized');
    }

    /**
     * Initialize Sidebar Toggle Button
     */
    private initSidebarToggle(): void {
        const toggleBtn = document.getElementById('uv7-sidebar-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleSidebar();
            });
            console.log('✅ [UV7System] Sidebar toggle initialized');
        } else {
            console.warn('[UV7System] Sidebar toggle button not found');
        }
    }

    /**
     * Initialize System Settings (Theme + Echo)
     */
    private initSettings(): void {
        this.initThemeSettings();
        this.initEchoSettings();
        this.initToriSettings();
    }

    /**
     * Initialize Theme Settings - Using shared ThemeManager (single source of truth!)
     * All theme logic is now in shared/StatusBar/ThemeManager.ts
     * This replaces 90+ lines of duplicate code
     */
    private initThemeSettings(): void {
        console.log(`[UV7System] initThemeSettings() called with prefix: ${this.prefix}`);

        const themeToggle = document.getElementById(`${this.prefix}-theme-toggle`);
        const autoToggle = document.getElementById(`${this.prefix}-theme-auto`);
        const manualRow = document.getElementById(`${this.prefix}-manual-theme-row`);

        if (!themeToggle || !autoToggle) {
            console.error(`[UV7System] Theme toggles NOT found!`);
            return;
        }

        // Import and use the shared ThemeManager
        import('../shared/StatusBar/ThemeManager').then(({ getThemeManager }) => {
            const themeManager = getThemeManager({
                onThemeChange: (state) => {
                    // Shell-specific: notify iframes when theme changes
                    if (this.mode === 'shell') {
                        this.notifyIframes('theme-change', {
                            auto: state.auto,
                            theme: state.mode
                        });
                    }
                }
            });

            // Bind UI elements - ThemeManager handles ALL the logic
            themeManager.bindUI({
                toggle: themeToggle,
                autoToggle: autoToggle,
                manualRow: manualRow
            });

            console.log('🎨 [UV7System] Theme controls bound to shared ThemeManager');
        }).catch(err => {
            console.warn('[UV7System] Could not load ThemeManager:', err);
        });
    }

    /**
     * Initialize Echo System Settings - Using shared EchoSettingsManager
     * All echo logic is now in shared/StatusBar/EchoSettingsManager.ts
     */
    private initEchoSettings(): void {
        const echoContainer = document.getElementById('uv7-echo-settings-container');
        if (!echoContainer) return;

        // Import shared manager to get current settings for initial render
        import('../shared/StatusBar/EchoSettingsManager').then(({ getEchoSettingsManager }) => {
            const echoManager = getEchoSettingsManager();
            const settings = echoManager.getSettings();

            // Render controls with current settings
            echoContainer.innerHTML = `
                <div class="echo-control-group">
                    <div class="echo-control-row">
                        <label class="checkbox-wrapper">
                            <input type="checkbox" id="${this.prefix}-echo-enabled" ${settings.enabled ? 'checked' : ''}>
                            Enable AI Crew Commentary
                        </label>
                    </div>
                    <div class="echo-control-row">
                        <span class="setting-label" style="font-size: 0.85rem">Frequency: <span id="${this.prefix}-echo-freq-val">${settings.frequency}s</span></span>
                        <input type="range" class="uv7-slider" id="${this.prefix}-echo-freq" min="5" max="20" step="1" value="${settings.frequency}">
                    </div>
                    <div class="echo-control-row">
                        <label class="checkbox-wrapper">
                            <input type="checkbox" id="${this.prefix}-echo-hover" ${settings.pauseOnHover ? 'checked' : ''}>
                            Pause on Hover
                        </label>
                    </div>
                </div>
            `;

            // Bind to shared manager - it handles ALL the logic
            echoManager.bindCheckboxUI({
                enabledCheckbox: document.getElementById(`${this.prefix}-echo-enabled`) as HTMLInputElement,
                frequencySlider: document.getElementById(`${this.prefix}-echo-freq`) as HTMLInputElement,
                frequencyDisplay: document.getElementById(`${this.prefix}-echo-freq-val`),
                hoverCheckbox: document.getElementById(`${this.prefix}-echo-hover`) as HTMLInputElement
            });

            console.log('🔊 [UV7System] Echo controls bound to shared EchoSettingsManager');
        }).catch(err => {
            console.warn('[UV7System] Could not load EchoSettingsManager:', err);
        });
    }

    /**
     * Initialize Tori-Gatchi Settings - Using shared ToriSettingsManager
     * All Tori logic is now in shared/StatusBar/ToriSettingsManager.ts
     */
    private initToriSettings(): void {
        const toriContainer = document.getElementById('uv7-tori-settings-container');
        if (!toriContainer) return;

        // Import shared manager to get current settings for initial render
        import('../shared/StatusBar/ToriSettingsManager').then(({ getToriSettingsManager }) => {
            const toriManager = getToriSettingsManager();
            const settings = toriManager.getSettings();

            // Render controls with current settings
            toriContainer.innerHTML = `
                <div class="echo-control-group">
                    <div class="echo-control-row">
                        <label class="checkbox-wrapper">
                            <input type="checkbox" id="${this.prefix}-tori-hunger" ${settings.notifyHunger ? 'checked' : ''}>
                            Notify on Hunger
                        </label>
                    </div>
                    <div class="echo-control-row">
                        <label class="checkbox-wrapper">
                            <input type="checkbox" id="${this.prefix}-tori-lonely" ${settings.notifyLonely ? 'checked' : ''}>
                            Notify on Loneliness
                        </label>
                    </div>
                </div>
            `;

            // Bind to shared manager - it handles ALL the logic
            toriManager.bindUI({
                hungerCheckbox: document.getElementById(`${this.prefix}-tori-hunger`) as HTMLInputElement,
                lonelyCheckbox: document.getElementById(`${this.prefix}-tori-lonely`) as HTMLInputElement
            });

            console.log('🐣 [UV7System] Tori controls bound to shared ToriSettingsManager');
        }).catch(err => {
            console.warn('[UV7System] Could not load ToriSettingsManager:', err);
        });
    }

    /**
     * Initialize Message API for app communication
     */
    private initMessageAPI(): void {
        window.addEventListener('message', (e) => {
            if (!e.data || !e.data.type) return;

            switch (e.data.type) {
                case 'uv7:update-status':
                    this.updateStatusBar(e.data.config);
                    break;
                case 'uv7:register-app':
                    console.log(`[UV7System] App registered: ${e.data.appId}`);
                    break;
            }
        });

        console.log('[UV7System] Message API initialized');
    }

    /**
     * Update status bar based on config
     * @param {Object} config - Status bar configuration
     */
    updateStatusBar(config: StatusBarConfig = {}): void {
        const { context, breadcrumbPath } = config;

        if (this.elements.statusContext) {
            if (breadcrumbPath && breadcrumbPath.length > 0) {
                this.elements.statusContext.innerHTML = breadcrumbPath
                    .map((item, i) => i === breadcrumbPath.length - 1
                        ? `<span class="breadcrumb-current">${item}</span>`
                        : `<span class="breadcrumb-item">${item}</span>`)
                    .join('<span class="breadcrumb-sep">›</span>');
            } else if (context) {
                this.elements.statusContext.textContent = context;
            }
        }
    }

    /**
     * Notify all iframes of an event
     * @param {string} type - Message type
     * @param {Object} data - Message data
     */
    private notifyIframes(type: string, data: any): void {
        const iframes = document.querySelectorAll('iframe');
        console.log(`[UV7System] notifyIframes called: type=${type}, iframes found=${iframes.length}`);

        iframes.forEach((iframe, index) => {
            console.log(`[UV7System] Sending message to iframe ${index}:`, iframe.id || 'no-id', { type, ...data });

            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage({ type, ...data }, '*');
                console.log(`[UV7System] Message sent to iframe ${index}`);
            } else {
                console.warn(`[UV7System] Iframe ${index} has no contentWindow`);
            }
        });
    }

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} icon - Optional icon to prepend
     * @param {number} duration - Duration in ms (default 2000)
     */
    private showToast(message: string, icon?: string, duration: number = 2000): void {
        const toast = document.createElement('div');
        toast.textContent = icon ? `${icon} ${message}` : message;
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
            animation: fadeInOut ${duration}ms ease-in-out;
        `;

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    }

    // ═══════════════════════════════════════════════════════════════
    // SHADE/SIDEBAR CONTROLS
    // ═══════════════════════════════════════════════════════════════

    openShade(): void {
        this.elements.shade?.classList.add('open');
        this.elements.backdrop?.classList.add('visible');
    }

    closeShade(): void {
        this.elements.shade?.classList.remove('open');
        this.elements.backdrop?.classList.remove('visible');
    }

    toggleShade(): void {
        this.elements.shade?.classList.toggle('open');
        this.elements.backdrop?.classList.toggle('visible');
    }

    openSidebar(): void {
        console.log('🔓 [UV7System] openSidebar() called');
        console.trace('[UV7System] openSidebar stack trace');
        this.elements.sidebar?.classList.add('open');
        this.elements.backdrop?.classList.add('visible');
    }

    closeSidebar(): void {
        console.log('🔒 [UV7System] closeSidebar() called');
        console.trace('[UV7System] closeSidebar stack trace');
        this.elements.sidebar?.classList.remove('open');
        this.elements.backdrop?.classList.remove('visible');
    }



    toggleSidebar(): void {
        const isOpen = this.elements.sidebar?.classList.contains('open');
        console.log(`🔄 [UV7System] toggleSidebar() called - current state: ${isOpen ? 'OPEN' : 'CLOSED'}`);
        console.trace('[UV7System] toggleSidebar stack trace');
        this.elements.sidebar?.classList.toggle('open');
        this.elements.backdrop?.classList.toggle('visible');
        console.log(`🔄 [UV7System] toggleSidebar() completed - new state: ${!isOpen ? 'OPEN' : 'CLOSED'}`);
    }

    /**
     * Process message queue (FIFO) for status bar temporary messages
     * Ensures messages don't overlap and are shown in order
     */
    private async processMessageQueue(): Promise<void> {
        while (this.messageQueue.length > 0) {
            this.isShowingMessage = true;
            const { msg, duration } = this.messageQueue.shift()!;

            // Save original context on first message
            if (!this.originalStatusContext && this.elements.statusContext) {
                this.originalStatusContext = this.elements.statusContext.textContent || '';
            }

            // Show message
            if (this.elements.statusContext) {
                this.elements.statusContext.textContent = msg;
            }

            // Wait for duration
            await new Promise(resolve => setTimeout(resolve, duration));

            // Restore original context if queue is empty
            if (this.messageQueue.length === 0 && this.elements.statusContext && this.originalStatusContext) {
                this.elements.statusContext.textContent = this.originalStatusContext;
                this.originalStatusContext = null;
            }
        }
        this.isShowingMessage = false;
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * DECLARATIVE SPEC RENDERING (Phase 2)
     * ═══════════════════════════════════════════════════════════════
     */

    /**
     * Apply status bar specification with actions and theme
     */
    applyStatusBarSpec(spec: StatusBarSpec): void {
        if (!this.elements.statusBar) return;

        // Validate spec
        this.validateStatusBarSpec(spec);

        // Update title/context
        const titleEl = this.elements.statusBar.querySelector('.status-title');
        const contextEl = this.elements.statusBar.querySelector('.status-context');
        if (titleEl) titleEl.textContent = spec.title;
        if (contextEl && spec.context) contextEl.textContent = spec.context;

        // Render actions
        if (spec.actions) this.renderStatusBarActions(spec.actions);

        // Apply theme
        if (spec.theme) this.applyTheme(spec.theme);

        // Apply mode
        if (spec.mode) {
            document.body.classList.remove('status-normal', 'status-cinematic', 'status-minimal');
            document.body.classList.add(`status-${spec.mode}`);
        }

        // Track in DevTools
        this.devTools?.trackStatusBarSpec(spec);
    }

    /**
     * Render action buttons in status bar
     */
    private renderStatusBarActions(actions: StatusBarAction[]): void {
        if (!this.elements.statusBar) return;

        let actionsContainer = this.elements.statusBar.querySelector('.status-actions') as HTMLElement;
        if (!actionsContainer) {
            actionsContainer = document.createElement('div');
            actionsContainer.className = 'status-actions';
            this.elements.statusBar.appendChild(actionsContainer);
        }

        actionsContainer.innerHTML = '';
        actions.forEach(action => {
            const button = document.createElement('button');
            button.className = 'status-action';
            button.setAttribute('data-action-id', action.id);
            button.setAttribute('aria-label', action.label);
            button.textContent = `${action.icon} ${action.label}`;
            button.addEventListener('click', () => this.handleActionClick(action.id));
            actionsContainer.appendChild(button);
        });

        console.log(`[UV7System] Rendered ${actions.length} status bar actions`);
    }

    /**
     * Apply chrome theme (Belle's Theme Injection pattern)
     */
    applyTheme(theme: ChromeTheme): void {
        const duration = theme.transitionDuration || 300;
        document.documentElement.style.setProperty('--chrome-transition-duration', `${duration}ms`);
        document.documentElement.style.setProperty('--chrome-primary', theme.primaryColor);
        document.documentElement.style.setProperty('--chrome-accent', theme.accentColor);
        if (theme.fontFamily) {
            document.documentElement.style.setProperty('--chrome-font', theme.fontFamily);
        }
        if (theme.statusBarVariant) {
            document.body.classList.remove('status-light', 'status-dark', 'status-auto');
            document.body.classList.add(`status-${theme.statusBarVariant}`);
        }
        console.log(`[UV7System] Applied theme: ${theme.primaryColor}`);

        // Track in DevTools
        this.devTools?.trackTheme(theme);
    }

    /**
     * Apply sidebar specification with sections
     */
    applySidebarSpec(spec: SidebarSpec): void {
        if (!this.elements.sidebar) return;

        // If spec has sections, render declaratively
        if (spec.sections) {
            this.renderSidebarSections(spec.sections);
        }
        // Otherwise use content escape hatch
        else if (spec.content) {
            const contentEl = this.elements.sidebar.querySelector('.sidebar-content');
            if (contentEl) {
                if (typeof spec.content === 'string') {
                    contentEl.innerHTML = spec.content;
                } else {
                    contentEl.innerHTML = '';
                    contentEl.appendChild(spec.content);
                }
            }
        }

        // Run init if provided
        if (spec.init) spec.init();
    }

    /**
     * Render sidebar sections declaratively
     */
    private renderSidebarSections(sections: SidebarSection[]): void {
        if (!this.elements.sidebar) return;

        const contentEl = this.elements.sidebar.querySelector('.sidebar-content');
        if (!contentEl) return;

        contentEl.innerHTML = '';

        sections.forEach(section => {
            // Section title
            if (section.title) {
                const titleEl = document.createElement('h3');
                titleEl.className = 'sidebar-section-title';
                titleEl.textContent = section.title;
                contentEl.appendChild(titleEl);
            }

            // Section items
            section.items.forEach(item => {
                if (item.type === 'divider') {
                    const divider = document.createElement('hr');
                    divider.className = 'sidebar-divider';
                    contentEl.appendChild(divider);
                } else if (item.type === 'button') {
                    const button = document.createElement('button');
                    button.className = 'sidebar-item sidebar-button';
                    button.textContent = `${item.icon || ''} ${item.label || ''}`.trim();
                    if (item.actionId) {
                        button.addEventListener('click', () => this.handleActionClick(item.actionId!));
                    }
                    contentEl.appendChild(button);
                } else if (item.type === 'link') {
                    const link = document.createElement('a');
                    link.className = 'sidebar-item sidebar-link';
                    link.href = item.href || '#';
                    link.textContent = `${item.icon || ''} ${item.label || ''}`.trim();
                    contentEl.appendChild(link);
                } else if (item.type === 'custom' && item.customContent) {
                    contentEl.appendChild(item.customContent);
                }
            });
        });

        console.log(`[UV7System] Rendered ${sections.length} sidebar sections`);
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * SPEC VALIDATION
     * ═══════════════════════════════════════════════════════════════
     */

    /**
     * Validate StatusBarSpec
     * Ensures action IDs are properly namespaced
     */
    private validateStatusBarSpec(spec: StatusBarSpec): void {
        if (!spec.actions) return;

        spec.actions.forEach(action => {
            // Validate action ID format: 'app:action'
            if (!action.id.match(/^[a-z0-9_]+:[a-z0-9_]+$/)) {
                throw new Error(
                    `[UV7System] Invalid action ID: "${action.id}". ` +
                    `Must be namespaced format: "app:action" (lowercase, alphanumeric + underscore)`
                );
            }

            // Validate required fields
            if (!action.icon || !action.label) {
                throw new Error(
                    `[UV7System] Action "${action.id}" missing required fields (icon, label)`
                );
            }
        });
    }

    /**



     * ═══════════════════════════════════════════════════════════════
     * SYSTEM API - PUBLIC INTERFACE
     * 
     * Returns controlled API for apps to manipulate chrome.
     * Replaces direct system method calls.
     * ═══════════════════════════════════════════════════════════════
     */
    getAPI(): SystemAPI {
        const api: SystemAPI = {
            // Status Bar namespace
            statusBar: {
                setTemporaryMessage: async (msg: string, duration: number = 2000) => {
                    // Add to queue
                    this.messageQueue.push({ msg, duration });
                    // Process queue if not already processing
                    if (!this.isShowingMessage) {
                        await this.processMessageQueue();
                    }
                },
                showProgress: (percent: number, label?: string) => {
                    console.log(`[SystemAPI] showProgress: ${percent}% ${label || ''}`);
                },
                clearProgress: () => {
                    console.log('[SystemAPI] clearProgress');
                },
                pulse: (duration: number = 500) => {
                    this.elements.statusBar?.classList.add('pulse');
                    setTimeout(() => this.elements.statusBar?.classList.remove('pulse'), duration);
                }
            },

            // Chrome namespace
            chrome: {
                fadeOut: async (duration: number = 300) => {
                    [this.elements.statusBar, this.elements.sidebar, this.elements.shade].forEach(el => {
                        if (el) {
                            el.style.transition = `opacity ${duration}ms ease`;
                            el.style.opacity = '0';
                        }
                    });
                    await new Promise(resolve => setTimeout(resolve, duration));
                },
                fadeIn: async (duration: number = 300) => {
                    [this.elements.statusBar, this.elements.sidebar, this.elements.shade].forEach(el => {
                        if (el) {
                            el.style.transition = `opacity ${duration}ms ease`;
                            el.style.opacity = '1';
                        }
                    });
                    await new Promise(resolve => setTimeout(resolve, duration));
                },
                hide: () => {
                    [this.elements.statusBar, this.elements.sidebar, this.elements.shade].forEach(el => {
                        if (el) el.style.display = 'none';
                    });
                },
                show: () => {
                    [this.elements.statusBar, this.elements.sidebar, this.elements.shade].forEach(el => {
                        if (el) el.style.display = '';
                    });
                },

                // Cinematic mode (nested namespace for cleaner API)
                cinematic: {
                    set: (enabled: boolean) => {
                        if (enabled) {
                            document.body.classList.add('cinematic-mode');
                            api.chrome.hide();
                        } else {
                            document.body.classList.remove('cinematic-mode');
                            api.chrome.show();
                        }
                    },
                    enter: () => {
                        document.body.classList.add('cinematic-mode');
                        api.chrome.hide();
                    },
                    exit: () => {
                        document.body.classList.remove('cinematic-mode');
                        api.chrome.show();
                    }
                }
            },

            // Sidebar namespace
            sidebar: {
                open: () => this.openSidebar(),
                close: () => this.closeSidebar(),
                toggle: () => this.toggleSidebar(),
                isOpen: () => this.elements.sidebar?.classList.contains('open') || false
            },

            // Shade namespace
            shade: {
                open: () => this.openShade(),
                close: () => this.closeShade(),
                toggle: () => {
                    if (this.elements.shade?.classList.contains('open')) {
                        this.closeShade();
                    } else {
                        this.openShade();
                    }
                },
                isOpen: () => this.elements.shade?.classList.contains('open') || false
            },

            // Toast namespace
            toast: {
                show: (message: string, options?: ToastOptions) => {
                    this.showToast(message, options?.icon, options?.duration);
                },
                success: (message: string) => {
                    this.showToast(message, '✅', 2000);
                },
                error: (message: string) => {
                    this.showToast(message, '❌', 3000);
                },
                warning: (message: string) => {
                    this.showToast(message, '⚠️', 2500);
                }
            },

            // Action handler registration (Belle's pattern)
            onAction: (actionId: string, handler: () => void) => {
                this.actionHandlers.set(actionId, handler);
                console.log(`[SystemAPI] Registered action handler: ${actionId}`);
            },
            offAction: (actionId: string) => {
                this.actionHandlers.delete(actionId);
                console.log(`[SystemAPI] Unregistered action handler: ${actionId}`);
            }
        };

        return api;
    }

    /**
     * Handle action click - emit event for apps to handle
     * Part of Belle's Action ID & Signal pattern
     */
    private handleActionClick(actionId: string): void {
        console.log(`[UV7System] Action triggered: ${actionId}`);
        const handler = this.actionHandlers.get(actionId);
        if (handler) {
            handler();
        } else {
            console.warn(`[UV7System] No handler registered for action: ${actionId}`);
        }
        window.dispatchEvent(new CustomEvent('uv7:action-triggered', {
            detail: { actionId }
        }));
    }
}


export default UV7System;
