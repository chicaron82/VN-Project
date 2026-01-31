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

import { generateShadeContent } from './ShadeTemplate';
import { generateDefaultSidebarContent } from './SidebarTemplate';

interface UV7SystemOptions {
    mode?: 'shell' | 'standalone';
    appName?: string;
    prefix?: string;
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

    constructor(options: UV7SystemOptions = {}) {
        this.mode = options.mode || 'shell';
        this.appName = options.appName || 'UV7 OS';
        this.prefix = options.prefix || 'shell';
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

        // Inject default sidebar content
        sidebar.innerHTML = generateDefaultSidebarContent({ title: `🏠 ${this.appName}` });

        console.log('[UV7System] Sidebar content rendered');
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
     * Initialize System Settings (Theme + Echo)
     */
    private initSettings(): void {
        this.initThemeSettings();
        this.initEchoSettings();
        this.initToriSettings();
    }

    /**
     * Initialize Theme Settings
     */
    private initThemeSettings(): void {
        console.log(`[UV7System] initThemeSettings() called with prefix: ${this.prefix}`);
        console.log(`[UV7System] Looking for: #${this.prefix}-theme-toggle and #${this.prefix}-theme-auto`);

        const themeToggle = document.getElementById(`${this.prefix}-theme-toggle`);
        const autoToggle = document.getElementById(`${this.prefix}-theme-auto`);
        const manualRow = document.getElementById(`${this.prefix}-manual-theme-row`);

        console.log(`[UV7System] Theme toggle found:`, themeToggle);
        console.log(`[UV7System] Auto toggle found:`, autoToggle);
        console.log(`[UV7System] Manual row found:`, manualRow);

        if (!themeToggle || !autoToggle) {
            console.error(`[UV7System] Theme toggles NOT found! themeToggle=${!!themeToggle}, autoToggle=${!!autoToggle}`);
            console.error(`[UV7System] Shade content:`, document.getElementById('uv7-shade')?.innerHTML);
            return;
        }

        console.log('[UV7System] Theme toggles found successfully!');

        // State defaults
        const isAuto = localStorage.getItem('uv7-theme-auto') !== 'false';
        const currentTheme = localStorage.getItem('uv7-theme') || 'dark';

        console.log(`[UV7System] Theme init: auto=${isAuto}, theme=${currentTheme}`);

        // Helper to apply theme
        const applyTheme = (auto, theme) => {
            console.log(`[UV7System] Applying theme: auto=${auto}, theme=${theme}`);

            if (auto) {
                autoToggle.classList.add('active');
                if (manualRow) {
                    manualRow.style.opacity = '0.5';
                    manualRow.style.pointerEvents = 'none';
                }
                // Clear overrides so OS preference wins
                document.body.classList.remove('light-mode', 'dark-mode');
            } else {
                autoToggle.classList.remove('active');
                if (manualRow) {
                    manualRow.style.opacity = '1';
                    manualRow.style.pointerEvents = 'auto';
                }
                // Apply manual override
                if (theme === 'light') {
                    document.body.classList.add('light-mode');
                    document.body.classList.remove('dark-mode');
                    themeToggle.classList.add('active');
                } else {
                    document.body.classList.add('dark-mode');
                    document.body.classList.remove('light-mode');
                    themeToggle.classList.remove('active');
                }
            }

            // Dispatch event for components
            window.dispatchEvent(new CustomEvent('uv7:theme-change', {
                detail: { theme: auto ? 'auto' : theme }
            }));

            // Notify iframes (shell mode only)
            if (this.mode === 'shell') {
                this.notifyIframes('theme-change', { auto, theme });
            }
        };

        // Initialize theme
        applyTheme(isAuto, currentTheme);

        // Auto Toggle Handler
        autoToggle.addEventListener('click', () => {
            const newAutoState = !autoToggle.classList.contains('active');
            localStorage.setItem('uv7-theme-auto', newAutoState ? 'true' : 'false');
            const storedTheme = localStorage.getItem('uv7-theme') || 'dark';
            applyTheme(newAutoState, storedTheme);
            this.showToast(newAutoState ? '⚙️ Synced with System' : '🎨 Manual Mode Enabled');
        });

        // Manual Toggle Handler
        themeToggle.addEventListener('click', () => {
            if (autoToggle.classList.contains('active')) return;
            const currentStored = localStorage.getItem('uv7-theme') || 'dark';
            const newTheme = currentStored === 'light' ? 'dark' : 'light';
            localStorage.setItem('uv7-theme', newTheme);
            applyTheme(false, newTheme);
            const icon = newTheme === 'dark' ? '🌙' : '☀️';
            this.showToast(`${icon} Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
        });
    }

    /**
     * Initialize Echo System Settings
     */
    private initEchoSettings(): void {
        const echoContainer = document.getElementById('uv7-echo-settings-container');
        if (!echoContainer) return;

        // Load saved settings
        let echoSettings = { enabled: true, frequency: 10, pauseOnHover: true };
        try {
            const stored = localStorage.getItem('uv7-echo-settings');
            if (stored) echoSettings = JSON.parse(stored);
        } catch (e) {
            console.warn('[UV7System] Failed to parse echo settings', e);
        }

        // Render controls
        echoContainer.innerHTML = `
            <div class="echo-control-group">
                <div class="echo-control-row">
                    <label class="checkbox-wrapper">
                        <input type="checkbox" id="${this.prefix}-echo-enabled" ${echoSettings.enabled ? 'checked' : ''}>
                        Enable AI Crew Commentary
                    </label>
                </div>
                <div class="echo-control-row">
                    <span class="setting-label" style="font-size: 0.85rem">Frequency: <span id="${this.prefix}-echo-freq-val">${echoSettings.frequency}s</span></span>
                    <input type="range" class="uv7-slider" id="${this.prefix}-echo-freq" min="5" max="20" step="1" value="${echoSettings.frequency}">
                </div>
                <div class="echo-control-row">
                    <label class="checkbox-wrapper">
                        <input type="checkbox" id="${this.prefix}-echo-hover" ${echoSettings.pauseOnHover ? 'checked' : ''}>
                        Pause on Hover
                    </label>
                </div>
            </div>
        `;

        // Bind events
        const enabledCheck = document.getElementById(`${this.prefix}-echo-enabled`);
        const freqSlider = document.getElementById(`${this.prefix}-echo-freq`);
        const freqVal = document.getElementById(`${this.prefix}-echo-freq-val`);
        const hoverCheck = document.getElementById(`${this.prefix}-echo-hover`);

        const saveEchoSettings = () => {
            const newSettings = {
                enabled: enabledCheck.checked,
                frequency: parseInt(freqSlider.value),
                pauseOnHover: hoverCheck.checked
            };
            localStorage.setItem('uv7-echo-settings', JSON.stringify(newSettings));
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'uv7-echo-settings',
                newValue: JSON.stringify(newSettings)
            }));
        };

        enabledCheck?.addEventListener('change', saveEchoSettings);
        freqSlider?.addEventListener('input', (e) => {
            freqVal.textContent = `${e.target.value}s`;
            saveEchoSettings();
        });
        hoverCheck?.addEventListener('change', saveEchoSettings);
        hoverCheck?.addEventListener('change', saveEchoSettings);
    }

    /**
     * Initialize Tori-Gatchi Settings
     */
    private initToriSettings(): void {
        const toriContainer = document.getElementById('uv7-tori-settings-container');
        if (!toriContainer) return;

        // Load saved settings (Default: All active)
        let toriSettings = { notifyHunger: true, notifyLonely: true, notifyCritical: true };
        try {
            const stored = localStorage.getItem('uv7-tori-settings');
            if (stored) toriSettings = JSON.parse(stored);
        } catch (e) {
            console.warn('[UV7System] Failed to parse Tori settings', e);
        }

        // Render controls
        toriContainer.innerHTML = `
            <div class="echo-control-group">
                <div class="echo-control-row">
                    <label class="checkbox-wrapper">
                        <input type="checkbox" id="${this.prefix}-tori-hunger" ${toriSettings.notifyHunger ? 'checked' : ''}>
                        Notify on Hunger
                    </label>
                </div>
                <div class="echo-control-row">
                    <label class="checkbox-wrapper">
                        <input type="checkbox" id="${this.prefix}-tori-lonely" ${toriSettings.notifyLonely ? 'checked' : ''}>
                        Notify on Loneliness
                    </label>
                </div>
                <!--
                <div class="echo-control-row">
                    <label class="checkbox-wrapper">
                        <input type="checkbox" id="${this.prefix}-tori-critical" ${toriSettings.notifyCritical ? 'checked' : ''}>
                        Critical Alerts Only
                    </label>
                </div>
                -->
            </div>
        `;

        // Bind events
        const hungerCheck = document.getElementById(`${this.prefix}-tori-hunger`);
        const lonelyCheck = document.getElementById(`${this.prefix}-tori-lonely`);
        // const criticalCheck = document.getElementById(`${this.prefix}-tori-critical`);

        const saveToriSettings = () => {
            const newSettings = {
                notifyHunger: hungerCheck.checked,
                notifyLonely: lonelyCheck.checked,
                notifyCritical: true // criticalCheck.checked
            };
            localStorage.setItem('uv7-tori-settings', JSON.stringify(newSettings));

            // Dispatch event for Service
            window.dispatchEvent(new CustomEvent('uv7:tori-settings-change', {
                detail: newSettings
            }));
        };

        hungerCheck?.addEventListener('change', saveToriSettings);
        lonelyCheck?.addEventListener('change', saveToriSettings);
        // criticalCheck?.addEventListener('change', saveToriSettings);
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
