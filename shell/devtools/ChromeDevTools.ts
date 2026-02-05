/**
 * ═══════════════════════════════════════════════════════════════
 * CHROME DEVTOOLS PANEL
 * 
 * Visual inspector for chrome architecture state and SystemAPI activity.
 * Provides real-time debugging of specs, actions, themes, and API calls.
 * ═══════════════════════════════════════════════════════════════
 */

import type { StatusBarSpec, SidebarSpec, ChromeTheme, StatusBarAction } from '../../types/chrome.js';

export interface APICallLog {
    timestamp: number;
    namespace: string;
    method: string;
    args: any[];
}

export interface ActionHandlerInfo {
    id: string;
    registered: number;
    lastTriggered?: number;
    triggerCount: number;
}

export class ChromeDevTools {
    private panel: HTMLElement | null = null;
    private isOpen: boolean = false;

    // State tracking
    private currentStatusBarSpec: StatusBarSpec | null = null;
    private currentSidebarSpec: SidebarSpec | null = null;
    private currentTheme: ChromeTheme | null = null;
    private actionHandlers: Map<string, ActionHandlerInfo> = new Map();
    private apiCallLog: APICallLog[] = [];
    private maxLogEntries: number = 50;

    constructor() {
        this.createPanel();
        this.attachKeyboardShortcut();
    }

    /**
     * Create the DevTools panel DOM
     */
    private createPanel(): void {
        this.panel = document.createElement('div');
        this.panel.id = 'chrome-devtools';
        this.panel.className = 'chrome-devtools';
        this.panel.innerHTML = `
            <div class="devtools-header">
                <h2>🛠️ Chrome DevTools</h2>
                <button class="devtools-close" id="devtools-close">✕</button>
            </div>
            
            <div class="devtools-tabs">
                <button class="devtools-tab active" data-tab="specs">Specs</button>
                <button class="devtools-tab" data-tab="actions">Actions</button>
                <button class="devtools-tab" data-tab="theme">Theme</button>
                <button class="devtools-tab" data-tab="api-log">API Log</button>
            </div>

            <div class="devtools-content">
                <!-- Specs Tab -->
                <div class="devtools-tab-content active" data-tab="specs">
                    <h3>Current StatusBarSpec</h3>
                    <pre id="devtools-statusbar-spec">No spec applied</pre>
                    
                    <h3>Current SidebarSpec</h3>
                    <pre id="devtools-sidebar-spec">No spec applied</pre>
                    
                    <h3>Cinematic Mode</h3>
                    <div id="devtools-cinematic">
                        <span class="status-indicator" id="cinematic-indicator">●</span>
                        <span id="cinematic-status">Disabled</span>
                    </div>
                </div>

                <!-- Actions Tab -->
                <div class="devtools-tab-content" data-tab="actions">
                    <h3>Registered Action Handlers</h3>
                    <div class="devtools-info">
                        <span id="action-count">0</span> handlers registered
                    </div>
                    <table class="devtools-table">
                        <thead>
                            <tr>
                                <th>Action ID</th>
                                <th>Registered</th>
                                <th>Last Triggered</th>
                                <th>Count</th>
                                <th>Test</th>
                            </tr>
                        </thead>
                        <tbody id="action-handlers-list"></tbody>
                    </table>
                </div>

                <!-- Theme Tab -->
                <div class="devtools-tab-content" data-tab="theme">
                    <h3>Current Theme</h3>
                    <pre id="devtools-theme">No theme applied</pre>
                    
                    <h3>CSS Custom Properties</h3>
                    <table class="devtools-table">
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody id="css-variables-list"></tbody>
                    </table>
                </div>

                <!-- API Log Tab -->
                <div class="devtools-tab-content" data-tab="api-log">
                    <div class="devtools-toolbar">
                        <button id="clear-log">Clear Log</button>
                        <span class="devtools-info">
                            <span id="log-count">0</span> calls (max 50)
                        </span>
                    </div>
                    <table class="devtools-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Namespace</th>
                                <th>Method</th>
                                <th>Arguments</th>
                            </tr>
                        </thead>
                        <tbody id="api-log-list"></tbody>
                    </table>
                </div>
            </div>
        `;

        document.body.appendChild(this.panel);
        this.attachEventListeners();
    }

    /**
     * Attach event listeners
     */
    private attachEventListeners(): void {
        // Close button
        const closeBtn = this.panel?.querySelector('#devtools-close');
        closeBtn?.addEventListener('click', () => this.close());

        // Tab switching
        const tabs = this.panel?.querySelectorAll('.devtools-tab');
        tabs?.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const tabName = target.dataset.tab;
                if (tabName) this.switchTab(tabName);
            });
        });

        // Clear log button
        const clearLogBtn = this.panel?.querySelector('#clear-log');
        clearLogBtn?.addEventListener('click', () => this.clearAPILog());
    }

    /**
     * Attach keyboard shortcut (Ctrl+Shift+D)
     */
    private attachKeyboardShortcut(): void {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    /**
     * Switch active tab
     */
    private switchTab(tabName: string): void {
        // Update tab buttons
        const tabs = this.panel?.querySelectorAll('.devtools-tab');
        tabs?.forEach(tab => {
            if ((tab as HTMLElement).dataset.tab === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update tab content
        const contents = this.panel?.querySelectorAll('.devtools-tab-content');
        contents?.forEach(content => {
            if ((content as HTMLElement).dataset.tab === tabName) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // Refresh data for the active tab
        this.refreshActiveTab(tabName);
    }

    /**
     * Refresh data for the active tab
     */
    private refreshActiveTab(tabName: string): void {
        switch (tabName) {
            case 'specs':
                this.updateSpecsView();
                break;
            case 'actions':
                this.updateActionsView();
                break;
            case 'theme':
                this.updateThemeView();
                break;
            case 'api-log':
                this.updateAPILogView();
                break;
        }
    }

    /**
     * Update Specs view
     */
    private updateSpecsView(): void {
        const statusBarEl = this.panel?.querySelector('#devtools-statusbar-spec');
        const sidebarEl = this.panel?.querySelector('#devtools-sidebar-spec');

        if (statusBarEl) {
            statusBarEl.textContent = this.currentStatusBarSpec
                ? JSON.stringify(this.currentStatusBarSpec, null, 2)
                : 'No spec applied';
        }

        if (sidebarEl) {
            sidebarEl.textContent = this.currentSidebarSpec
                ? JSON.stringify(this.currentSidebarSpec, null, 2)
                : 'No spec applied';
        }

        // Update cinematic mode status
        const cinematicIndicator = this.panel?.querySelector('#cinematic-indicator');
        const cinematicStatus = this.panel?.querySelector('#cinematic-status');
        const isCinematic = document.body.classList.contains('cinematic-mode');

        if (cinematicIndicator && cinematicStatus) {
            if (isCinematic) {
                cinematicIndicator.className = 'status-indicator active';
                cinematicStatus.textContent = 'Enabled';
            } else {
                cinematicIndicator.className = 'status-indicator';
                cinematicStatus.textContent = 'Disabled';
            }
        }
    }

    /**
     * Update Actions view
     */
    private updateActionsView(): void {
        const countEl = this.panel?.querySelector('#action-count');
        const listEl = this.panel?.querySelector('#action-handlers-list');

        if (countEl) {
            countEl.textContent = this.actionHandlers.size.toString();
        }

        if (listEl) {
            listEl.innerHTML = '';
            this.actionHandlers.forEach((info, id) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><code>${id}</code></td>
                    <td>${this.formatTimestamp(info.registered)}</td>
                    <td>${info.lastTriggered ? this.formatTimestamp(info.lastTriggered) : 'Never'}</td>
                    <td>${info.triggerCount}</td>
                    <td><button class="test-action-btn" data-action-id="${id}">Test</button></td>
                `;
                listEl.appendChild(row);
            });

            // Attach test button listeners
            const testBtns = listEl.querySelectorAll('.test-action-btn');
            testBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const actionId = (e.target as HTMLElement).dataset.actionId;
                    if (actionId) {
                        console.log(`[DevTools] Testing action: ${actionId}`);
                        // Trigger the action (would need access to UV7System)
                    }
                });
            });
        }
    }

    /**
     * Update Theme view
     */
    private updateThemeView(): void {
        const themeEl = this.panel?.querySelector('#devtools-theme');
        const cssVarsEl = this.panel?.querySelector('#css-variables-list');

        if (themeEl) {
            themeEl.textContent = this.currentTheme
                ? JSON.stringify(this.currentTheme, null, 2)
                : 'No theme applied';
        }

        if (cssVarsEl) {
            cssVarsEl.innerHTML = '';
            const chromeVars = [
                '--chrome-primary',
                '--chrome-accent',
                '--chrome-font-family',
                '--chrome-transition-duration'
            ];

            chromeVars.forEach(varName => {
                const value = getComputedStyle(document.documentElement).getPropertyValue(varName);
                if (value) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><code>${varName}</code></td>
                        <td>${value.trim()}</td>
                    `;
                    cssVarsEl.appendChild(row);
                }
            });
        }
    }

    /**
     * Update API Log view
     */
    private updateAPILogView(): void {
        const countEl = this.panel?.querySelector('#log-count');
        const listEl = this.panel?.querySelector('#api-log-list');

        if (countEl) {
            countEl.textContent = this.apiCallLog.length.toString();
        }

        if (listEl) {
            listEl.innerHTML = '';
            // Show most recent first
            const recentLogs = [...this.apiCallLog].reverse();
            recentLogs.forEach(log => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${this.formatTimestamp(log.timestamp)}</td>
                    <td><code>${log.namespace}</code></td>
                    <td><code>${log.method}</code></td>
                    <td><code>${JSON.stringify(log.args)}</code></td>
                `;
                listEl.appendChild(row);
            });
        }
    }

    /**
     * Format timestamp for display
     */
    private formatTimestamp(timestamp: number): string {
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
    }

    /**
     * Clear API log
     */
    private clearAPILog(): void {
        this.apiCallLog = [];
        this.updateAPILogView();
    }

    /**
     * PUBLIC API - Track StatusBarSpec
     */
    public trackStatusBarSpec(spec: StatusBarSpec): void {
        this.currentStatusBarSpec = spec;
        if (this.isOpen) {
            this.updateSpecsView();
        }
    }

    /**
     * PUBLIC API - Track SidebarSpec
     */
    public trackSidebarSpec(spec: SidebarSpec): void {
        this.currentSidebarSpec = spec;
        if (this.isOpen) {
            this.updateSpecsView();
        }
    }

    /**
     * PUBLIC API - Track Theme
     */
    public trackTheme(theme: ChromeTheme): void {
        this.currentTheme = theme;
        if (this.isOpen) {
            this.updateThemeView();
        }
    }

    /**
     * PUBLIC API - Track action handler registration
     */
    public trackActionHandler(actionId: string): void {
        if (!this.actionHandlers.has(actionId)) {
            this.actionHandlers.set(actionId, {
                id: actionId,
                registered: Date.now(),
                triggerCount: 0
            });
        }
        if (this.isOpen) {
            this.updateActionsView();
        }
    }

    /**
     * PUBLIC API - Track action trigger
     */
    public trackActionTrigger(actionId: string): void {
        const info = this.actionHandlers.get(actionId);
        if (info) {
            info.lastTriggered = Date.now();
            info.triggerCount++;
        }
        if (this.isOpen) {
            this.updateActionsView();
        }
    }

    /**
     * PUBLIC API - Track API call
     */
    public trackAPICall(namespace: string, method: string, args: any[]): void {
        this.apiCallLog.push({
            timestamp: Date.now(),
            namespace,
            method,
            args
        });

        // Keep only last N entries
        if (this.apiCallLog.length > this.maxLogEntries) {
            this.apiCallLog.shift();
        }

        if (this.isOpen) {
            this.updateAPILogView();
        }
    }

    /**
     * Open the DevTools panel
     */
    public open(): void {
        if (!this.panel) return;
        this.panel.classList.add('open');
        this.isOpen = true;
        this.refreshActiveTab('specs');
    }

    /**
     * Close the DevTools panel
     */
    public close(): void {
        if (!this.panel) return;
        this.panel.classList.remove('open');
        this.isOpen = false;
    }

    /**
     * Toggle the DevTools panel
     */
    public toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
}
