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

interface SidebarConfig {
    title: string;
    content: string;  // HTML string for sidebar content
    init?: () => void; // Optional initialization function
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

interface EchoSettings {
    enabled: boolean;
    frequency: number;
    pauseOnHover: boolean;
}

interface ToriSettings {
    notifyHunger: boolean;
    notifyLonely: boolean;
    notifyCritical: boolean;
}

export class UV7System {
    private mode: 'shell' | 'standalone';
    private appName: string;
    private prefix: string;
    private elements: UV7SystemElements;
    private initialized: boolean;
    private sidebarConfig?: SidebarConfig;

    constructor(options: UV7SystemOptions = {}) {
        this.mode = options.mode || 'shell';
        this.appName = options.appName || 'UV7 OS';
        this.prefix = options.prefix || 'shell';
        this.sidebarConfig = options.sidebarConfig;
        this.elements = {} as UV7SystemElements;
        this.initialized = false;
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
        shadeContent.innerHTML = generateShadeContent({ isShell });

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
            sidebar.innerHTML = this.sidebarConfig.content;
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
            closeBtn.addEventListener('click', (e) => {
                console.log('🔘 [UV7System] Shade close button clicked');
                e.stopPropagation();
                this.closeShade();
            });
        } else {
            console.error('❌ [UV7System] Shade close button NOT found!');
        }

        // Wire up backdrop
        if (this.elements.backdrop) {
            // Remove old listener by cloning
            const newBackdrop = this.elements.backdrop.cloneNode(true);
            this.elements.backdrop.parentNode.replaceChild(newBackdrop, this.elements.backdrop);
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
     */
    private showToast(message: string): void {
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
        setTimeout(() => toast.remove(), 2000);
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
        this.elements.sidebar?.classList.add('open');
        this.elements.backdrop?.classList.add('visible');
    }

    closeSidebar(): void {
        this.elements.sidebar?.classList.remove('open');
        this.elements.backdrop?.classList.remove('visible');
    }

    toggleSidebar(): void {
        this.elements.sidebar?.classList.toggle('open');
        this.elements.backdrop?.classList.toggle('visible');
    }
}

export default UV7System;
