// ========================================
// DEV SUITE DOM
// HTML creation, element caching, event setup
//
// Extracted from DevSuite.ts (lines 166-418)
//
// 848 is sacred. 💚🔥💀
// ========================================

export interface DevSuiteDOMElements {
    overlay: HTMLElement;
    tabsPanel: HTMLElement | null;
    consolePanel: HTMLElement | null;
    divider: HTMLElement | null;
    floatBtn: HTMLElement;
    consoleLog: HTMLElement | null;
    consoleInput: HTMLInputElement | null;
}

export interface DevSuiteDOMCallbacks {
    close(): void;
    minimize(): void;
    maximize(): void;
    toggle(): void;
    switchTab(tab: string): void;
    handleConsoleInput(e: KeyboardEvent): void;
    captureScreenshot(): void;
    showPresetsModal(): void;
    showShortcutsModal(): void;
    hotReload(): void;
    isOpen(): boolean;
}

export interface DevSuiteDOMResizeCallbacks {
    onResize(width: number): void;
    onResizeEnd(): void;
}

/**
 * DevSuiteDOM
 *
 * Creates the DevSuite HTML overlay and float button,
 * caches element references, and wires all event listeners.
 */
export class DevSuiteDOM {
    private elements!: DevSuiteDOMElements;

    constructor(consoleDividerPosition: number) {
        this.render(consoleDividerPosition);
    }

    getElements(): DevSuiteDOMElements {
        return this.elements;
    }

    // ========================================
    // RENDER
    // ========================================

    private render(consoleDividerPosition: number): void {
        const overlay = document.createElement('div');
        overlay.id = 'dev-suite-overlay';
        overlay.className = 'dev-suite hidden';

        overlay.innerHTML = `
            <div class="dev-suite-window">
                <!-- Header -->
                <div class="dev-suite-header">
                    <span class="dev-suite-title">🛠️ DEV SUITE v2.0</span>
                    <div class="dev-suite-header-actions">
                        <button class="dev-suite-btn" id="dev-suite-screenshot" title="Screenshot (📸)">📸</button>
                        <button class="dev-suite-btn" id="dev-suite-presets" title="Presets (💾)">💾</button>
                        <button class="dev-suite-btn" id="dev-suite-shortcuts" title="Shortcuts (⌨️)">⌨️</button>
                        <button class="dev-suite-btn" id="dev-suite-reload" title="Hot Reload (🔄)">🔄</button>
                    </div>
                    <div class="dev-suite-header-controls">
                        <button class="dev-suite-minimize" id="dev-suite-minimize" title="Minimize">−</button>
                        <button class="dev-suite-close" id="dev-suite-close" title="Close">✕</button>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="dev-suite-body">
                    <!-- Tabs Panel (Left) -->
                    <div class="dev-suite-tabs-panel" id="dev-suite-tabs-panel">
                        <!-- Tab Buttons -->
                        <div class="dev-suite-tab-bar">
                            <button class="dev-suite-tab active" data-tab="debug">🔍 Debug</button>
                            <button class="dev-suite-tab" data-tab="state">📊 State</button>
                            <button class="dev-suite-tab" data-tab="scenes">🎬 Scenes</button>
                            <button class="dev-suite-tab" data-tab="testing">🧪 Testing</button>
                            <button class="dev-suite-tab" data-tab="logs">📜 Logs</button>
                            <button class="dev-suite-tab" data-tab="watch">👁️ Watch</button>
                        </div>

                        <!-- Tab Content -->
                        <div class="dev-suite-tab-content" id="dev-suite-tab-content">
                            <!-- Filled by switchTab() -->
                        </div>
                    </div>

                    <!-- Resizable Divider -->
                    <div class="dev-suite-divider" id="dev-suite-divider"></div>

                    <!-- Console Panel (Right) -->
                    <div class="dev-suite-console-panel" id="dev-suite-console-panel" style="width: ${consoleDividerPosition}px">
                        <div class="dev-suite-console-header">⌨️ CONSOLE</div>
                        <div class="dev-suite-console-log" id="dev-suite-console-log"></div>
                        <div class="dev-suite-console-input-row">
                            <span>&gt;</span>
                            <input type="text" id="dev-suite-console-input" placeholder="Type command..." autocomplete="off">
                        </div>
                        <div class="dev-suite-autocomplete hidden" id="dev-suite-autocomplete"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Create float button (for minimized state)
        const floatBtn = document.createElement('button');
        floatBtn.id = 'dev-suite-float';
        floatBtn.className = 'dev-suite-float hidden';
        floatBtn.innerHTML = '🛠️';
        floatBtn.title = 'Open Dev Suite';
        document.body.appendChild(floatBtn);

        this.elements = {
            overlay,
            tabsPanel: document.getElementById('dev-suite-tabs-panel'),
            consolePanel: document.getElementById('dev-suite-console-panel'),
            divider: document.getElementById('dev-suite-divider'),
            floatBtn,
            consoleLog: document.getElementById('dev-suite-console-log'),
            consoleInput: document.getElementById('dev-suite-console-input') as HTMLInputElement,
        };
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    setupEventListeners(cb: DevSuiteDOMCallbacks): void {
        const { overlay, floatBtn, consoleInput } = this.elements;

        document.getElementById('dev-suite-close')?.addEventListener('click', () => cb.close());
        document.getElementById('dev-suite-minimize')?.addEventListener('click', () => cb.minimize());
        floatBtn?.addEventListener('click', () => cb.maximize());

        document.querySelectorAll('.dev-suite-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabEl = tab as HTMLElement;
                const tabName = tabEl.dataset.tab;
                if (tabName) cb.switchTab(tabName);
            });
        });

        consoleInput?.addEventListener('keydown', (e) => cb.handleConsoleInput(e));

        document.getElementById('dev-suite-screenshot')?.addEventListener('click', () => cb.captureScreenshot());
        document.getElementById('dev-suite-presets')?.addEventListener('click', () => cb.showPresetsModal());
        document.getElementById('dev-suite-shortcuts')?.addEventListener('click', () => cb.showShortcutsModal());
        document.getElementById('dev-suite-reload')?.addEventListener('click', () => cb.hotReload());

        overlay?.addEventListener('click', (e) => {
            if (e.target === overlay) cb.close();
        });
    }

    // ========================================
    // KEYBOARD SHORTCUTS
    // ========================================

    setupKeyboardShortcuts(cb: DevSuiteDOMCallbacks): void {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+D - Toggle Dev Suite
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                cb.toggle();
                return;
            }

            if (!cb.isOpen()) return;

            if (e.key === 'Escape') {
                cb.close();
                return;
            }

            if (e.ctrlKey && e.shiftKey) {
                switch (e.key) {
                    case '1': cb.switchTab('debug'); e.preventDefault(); break;
                    case '2': cb.switchTab('state'); e.preventDefault(); break;
                    case '3': cb.switchTab('scenes'); e.preventDefault(); break;
                    case '4': cb.switchTab('testing'); e.preventDefault(); break;
                    case '5': cb.switchTab('logs'); e.preventDefault(); break;
                    case '6': cb.switchTab('watch'); e.preventDefault(); break;
                    case 'C': this.elements.consoleInput?.focus(); e.preventDefault(); break;
                    case 'M': cb.minimize(); e.preventDefault(); break;
                }
            }
        });
    }

    // ========================================
    // RESIZABLE DIVIDER
    // ========================================

    setupResizableDivider(cb: DevSuiteDOMResizeCallbacks): void {
        const { overlay, consolePanel, divider } = this.elements;
        let isResizing = false;

        const startResize = (e: MouseEvent | TouchEvent): void => {
            isResizing = true;
            divider?.classList.add('resizing');
            e.preventDefault();
        };

        const resize = (e: MouseEvent | TouchEvent): void => {
            if (!isResizing) return;

            const clientX = (e as TouchEvent).touches
                ? (e as TouchEvent).touches[0]?.clientX
                : (e as MouseEvent).clientX;
            const windowRect = overlay?.querySelector('.dev-suite-window')?.getBoundingClientRect();
            if (!windowRect || clientX === undefined) return;

            const newWidth = windowRect.right - clientX - 10;
            const clampedWidth = Math.max(200, Math.min(500, newWidth));

            if (consolePanel) {
                (consolePanel as HTMLElement).style.width = `${clampedWidth}px`;
            }
            cb.onResize(clampedWidth);
        };

        const stopResize = (): void => {
            if (isResizing) {
                isResizing = false;
                divider?.classList.remove('resizing');
                cb.onResizeEnd();
            }
        };

        divider?.addEventListener('mousedown', startResize as EventListener);
        document.addEventListener('mousemove', resize as EventListener);
        document.addEventListener('mouseup', stopResize);

        divider?.addEventListener('touchstart', startResize as EventListener);
        document.addEventListener('touchmove', resize as EventListener);
        document.addEventListener('touchend', stopResize);
    }
}
