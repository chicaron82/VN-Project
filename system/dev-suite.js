// ========================================
// DEV SUITE v2.0
// Full-featured developer debugging suite
// Zee + ZeeRah + CoZee + DiZee Collab 💚🖤
// ========================================

/**
 * DevSuite - Professional debugging suite for V848
 * 
 * Features:
 * - Tabbed interface (Debug, State, Scenes, Testing, Logs, Watch)
 * - Persistent console panel
 * - Keyboard shortcuts
 * - Drag-to-resize divider
 * - Dev presets (save/load game states)
 * - Variable watch system
 * - Breakpoint system
 * 
 * Entry: OPENCONSOLE secret code
 */

class DevSuite {
    constructor(game) {
        this.game = game;
        this.isOpen = false;
        this.isMinimized = false;
        this.activeTab = 'debug';

        // State persistence
        this.state = this.loadState();

        // Sub-systems (initialized later)
        this.logger = null;
        this.presets = null;
        this.watch = null;
        this.breakpoints = null;

        // DOM elements (cached after render)
        this.overlay = null;
        this.tabsPanel = null;
        this.consolePanel = null;
        this.divider = null;
        this.floatBtn = null;

        // Console state
        this.consoleHistory = [];
        this.historyIndex = -1;

        // FPS tracking
        this.fpsFrames = 0;
        this.fpsLastTime = performance.now();
        this.currentFPS = 60;

        // Initialize
        this.init();
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    init() {
        this.render();
        this.setupKeyboardShortcuts();
        this.setupResizableDivider();
        this.startFPSMonitor();
        this.interceptConsole();

        // Initialize sub-systems
        this.logger = new DevLogger(this);
        this.presets = new DevPresets(this);
        this.watch = new VariableWatch(this);
        this.breakpoints = new BreakpointSystem(this);

        console.log('🛠️ Dev Suite v2.0 initialized');
    }

    // ========================================
    // CONSOLE INTERCEPTION
    // ========================================

    interceptConsole() {
        // Save original console methods
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        const safeStringify = (obj) => {
            try {
                return JSON.stringify(obj, null, 2);
            } catch (e) {
                return String(obj);
            }
        };

        // Override console.log
        console.log = (...args) => {
            const message = args.map(arg =>
                typeof arg === 'object' ? safeStringify(arg) : String(arg)
            ).join(' ');
            this.consoleLogEntry(message, 'log');
            originalLog.apply(console, args);
        };

        // Override console.warn
        console.warn = (...args) => {
            const message = args.map(arg =>
                typeof arg === 'object' ? safeStringify(arg) : String(arg)
            ).join(' ');
            this.consoleLogEntry('⚠️ ' + message, 'warn');
            originalWarn.apply(console, args);
        };

        // Override console.error
        console.error = (...args) => {
            const message = args.map(arg =>
                typeof arg === 'object' ? safeStringify(arg) : String(arg)
            ).join(' ');
            this.consoleLogEntry('❌ ' + message, 'error');
            originalError.apply(console, args);
        };
    }

    // ========================================
    // RENDER
    // ========================================

    render() {
        // Create overlay container
        this.overlay = document.createElement('div');
        this.overlay.id = 'dev-suite-overlay';
        this.overlay.className = 'dev-suite hidden';

        this.overlay.innerHTML = `
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
                    <div class="dev-suite-console-panel" id="dev-suite-console-panel" style="width: ${this.state.consoleDividerPosition}px">
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

        document.body.appendChild(this.overlay);

        // Create float button (for minimized state)
        this.floatBtn = document.createElement('button');
        this.floatBtn.id = 'dev-suite-float';
        this.floatBtn.className = 'dev-suite-float hidden';
        this.floatBtn.innerHTML = '🛠️';
        this.floatBtn.title = 'Open Dev Suite';
        document.body.appendChild(this.floatBtn);

        // Cache DOM elements
        this.tabsPanel = document.getElementById('dev-suite-tabs-panel');
        this.consolePanel = document.getElementById('dev-suite-console-panel');
        this.divider = document.getElementById('dev-suite-divider');
        this.consoleLog = document.getElementById('dev-suite-console-log');
        this.consoleInput = document.getElementById('dev-suite-console-input');

        // Setup event listeners
        this.setupEventListeners();

        // Render initial tab
        this.switchTab(this.state.lastActiveTab || 'debug');
    }

    setupEventListeners() {
        // Close button
        document.getElementById('dev-suite-close').addEventListener('click', () => this.close());

        // Minimize button
        document.getElementById('dev-suite-minimize').addEventListener('click', () => this.minimize());

        // Float button
        this.floatBtn.addEventListener('click', () => this.maximize());

        // Tab switches
        document.querySelectorAll('.dev-suite-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        // Console input
        this.consoleInput.addEventListener('keydown', (e) => this.handleConsoleInput(e));

        // Header actions
        document.getElementById('dev-suite-screenshot').addEventListener('click', () => this.captureScreenshot());
        document.getElementById('dev-suite-presets').addEventListener('click', () => this.showPresetsModal());
        document.getElementById('dev-suite-shortcuts').addEventListener('click', () => this.showShortcutsModal());
        document.getElementById('dev-suite-reload').addEventListener('click', () => this.hotReload());

        // Click outside to close (on overlay background)
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });
    }

    // ========================================
    // OPEN / CLOSE / MINIMIZE
    // ========================================

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.overlay.classList.remove('hidden');
        this.floatBtn.classList.add('hidden');
        this.isOpen = true;
        this.isMinimized = false;
        this.consoleInput.focus();
        this.refreshCurrentTab();
        console.log('🛠️ Dev Suite opened');
    }

    close() {
        this.overlay.classList.add('hidden');
        this.floatBtn.classList.add('hidden');
        this.isOpen = false;
        this.isMinimized = false;
        this.saveState();
        console.log('🛠️ Dev Suite closed');
    }

    minimize() {
        this.overlay.classList.add('hidden');
        this.floatBtn.classList.remove('hidden');
        this.isMinimized = true;
        console.log('🛠️ Dev Suite minimized');
    }

    maximize() {
        this.overlay.classList.remove('hidden');
        this.floatBtn.classList.add('hidden');
        this.isMinimized = false;
        this.consoleInput.focus();
        this.refreshCurrentTab();
        console.log('🛠️ Dev Suite maximized');
    }

    // ========================================
    // KEYBOARD SHORTCUTS
    // ========================================

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+D - Toggle Dev Suite
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggle();
                return;
            }

            // Only process other shortcuts if suite is open
            if (!this.isOpen) return;

            // ESC - Close
            if (e.key === 'Escape') {
                this.close();
                return;
            }

            if (e.ctrlKey && e.shiftKey) {
                switch (e.key) {
                    case '1': this.switchTab('debug'); e.preventDefault(); break;
                    case '2': this.switchTab('state'); e.preventDefault(); break;
                    case '3': this.switchTab('scenes'); e.preventDefault(); break;
                    case '4': this.switchTab('testing'); e.preventDefault(); break;
                    case '5': this.switchTab('logs'); e.preventDefault(); break;
                    case '6': this.switchTab('watch'); e.preventDefault(); break;
                    case 'C': this.consoleInput.focus(); e.preventDefault(); break;
                    case 'M': this.minimize(); e.preventDefault(); break;
                }
            }
        });
    }

    // ========================================
    // RESIZABLE DIVIDER
    // ========================================

    setupResizableDivider() {
        let isResizing = false;

        const startResize = (e) => {
            isResizing = true;
            this.divider.classList.add('resizing');
            e.preventDefault();
        };

        const resize = (e) => {
            if (!isResizing) return;

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const windowRect = this.overlay.querySelector('.dev-suite-window').getBoundingClientRect();
            const newWidth = windowRect.right - clientX - 10; // 10px buffer

            // Clamp between min/max
            const clampedWidth = Math.max(200, Math.min(500, newWidth));

            this.consolePanel.style.width = `${clampedWidth}px`;
            this.state.consoleDividerPosition = clampedWidth;
        };

        const stopResize = () => {
            if (isResizing) {
                isResizing = false;
                this.divider.classList.remove('resizing');
                this.saveState();
            }
        };

        // Mouse events
        this.divider.addEventListener('mousedown', startResize);
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);

        // Touch events
        this.divider.addEventListener('touchstart', startResize);
        document.addEventListener('touchmove', resize);
        document.addEventListener('touchend', stopResize);
    }

    // ========================================
    // TAB SWITCHING
    // ========================================

    switchTab(tabName) {
        this.activeTab = tabName;
        this.state.lastActiveTab = tabName;

        // Update tab button states
        document.querySelectorAll('.dev-suite-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Render tab content
        this.refreshCurrentTab();
    }

    refreshCurrentTab() {
        const content = document.getElementById('dev-suite-tab-content');
        if (!content) return;

        switch (this.activeTab) {
            case 'debug': content.innerHTML = this.renderDebugTab(); break;
            case 'state': content.innerHTML = this.renderStateTab(); break;
            case 'scenes': content.innerHTML = this.renderScenesTab(); break;
            case 'testing': content.innerHTML = this.renderTestingTab(); break;
            case 'logs': content.innerHTML = this.renderLogsTab(); break;
            case 'watch': content.innerHTML = this.renderWatchTab(); break;
        }

        // Attach tab-specific event listeners
        this.attachTabEventListeners();
    }

    attachTabEventListeners() {
        // Testing tab tether buttons
        document.querySelectorAll('.tether-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const value = parseInt(btn.dataset.value);
                this.setTether(value);
            });
        });

        // Testing tab force ending buttons
        document.querySelectorAll('.ending-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.forceEnding(btn.dataset.ending);
            });
        });

        // Scenes tab jump buttons
        document.querySelectorAll('.scene-jump-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.jumpToScene(btn.dataset.scene);
            });
        });

        // Watch tab add button
        const addWatchBtn = document.getElementById('add-watch-btn');
        if (addWatchBtn) {
            addWatchBtn.addEventListener('click', () => {
                const input = document.getElementById('watch-expression-input');
                if (input && input.value.trim()) {
                    this.watch.addWatch(input.value.trim());
                    input.value = '';
                    this.refreshCurrentTab();
                }
            });
        }
    }

    // ========================================
    // TAB RENDERERS
    // ========================================

    renderDebugTab() {
        const route = this.game.currentRoute;
        const tether = route?.tetherSystem?.tetherLevel ?? 'N/A';
        const scene = this.game.currentScene || 'N/A';
        const routeName = route?.name || 'No route';
        const memory = this.getMemoryUsage();

        return `
            <div class="debug-tab">
                <div class="debug-stats-row">
                    <div class="debug-stat-box">
                        <div class="stat-label">FPS</div>
                        <div class="stat-value" id="debug-fps">${this.currentFPS}</div>
                    </div>
                    <div class="debug-stat-box">
                        <div class="stat-label">MEMORY</div>
                        <div class="stat-value">${memory}</div>
                    </div>
                </div>
                
                <div class="debug-section">
                    <div class="section-title">CURRENT SCENE</div>
                    <div class="scene-route">${routeName}</div>
                    <div class="scene-id">${scene}</div>
                </div>
                
                <div class="debug-section">
                    <div class="section-title">TETHER</div>
                    <div class="tether-bar-container">
                        <div class="tether-bar-fill" style="width: ${typeof tether === 'number' ? tether : 0}%"></div>
                        <div class="tether-bar-text">${typeof tether === 'number' ? Math.round(tether) + '%' : tether}</div>
                    </div>
                </div>
                
                <div class="debug-section">
                    <div class="section-title">ROUTE POINTS</div>
                    <div class="route-points-grid">
                        ${this.renderRoutePoints()}
                    </div>
                </div>
                
                <div class="debug-section">
                    <div class="section-title">ACTIVE FLAGS</div>
                    <div class="flags-container">
                        ${this.renderFlags()}
                    </div>
                </div>
            </div>
        `;
    }

    renderRoutePoints() {
        const rp = this.game.currentRoute?.routePoints;
        if (!rp) return '<span class="muted">No route active</span>';

        return `
            <div class="rp-item bad">Bad: ${rp.bad || 0}</div>
            <div class="rp-item true">True: ${rp.true || 0}</div>
            <div class="rp-item digital">Digital: ${rp.digitalForever || 0}</div>
        `;
    }

    renderFlags() {
        const flags = this.game.gameState?.flags;
        if (!flags || Object.keys(flags).length === 0) {
            return '<span class="muted">No flags set</span>';
        }

        return Object.entries(flags)
            .filter(([k, v]) => v)
            .map(([k, v]) => `<span class="flag-chip">${k}</span>`)
            .join('');
    }

    renderStateTab() {
        return `
            <div class="state-tab">
                <div class="debug-section">
                    <div class="section-title">ROUTE POINTS</div>
                    ${this.renderRoutePointsEditable()}
                </div>
                
                <div class="debug-section">
                    <div class="section-title">UNLOCKED NOTES</div>
                    ${this.renderNotesStatus()}
                </div>
                
                <div class="debug-section">
                    <div class="section-title">TUTORIALS</div>
                    ${this.renderTutorialsStatus()}
                </div>
            </div>
        `;
    }

    renderRoutePointsEditable() {
        const rp = this.game.currentRoute?.routePoints;
        if (!rp) return '<span class="muted">No route active</span>';

        return `
            <div class="rp-editor">
                <div class="rp-row">
                    <span>Bad Route</span>
                    <span class="rp-value">${rp.bad || 0}</span>
                    <button class="rp-btn" onclick="devSuite.adjustRoutePoint('bad', -1)">−</button>
                    <button class="rp-btn" onclick="devSuite.adjustRoutePoint('bad', 1)">+</button>
                </div>
                <div class="rp-row">
                    <span>True Route</span>
                    <span class="rp-value">${rp.true || 0}</span>
                    <button class="rp-btn" onclick="devSuite.adjustRoutePoint('true', -1)">−</button>
                    <button class="rp-btn" onclick="devSuite.adjustRoutePoint('true', 1)">+</button>
                </div>
                <div class="rp-row">
                    <span>Digital Forever</span>
                    <span class="rp-value">${rp.digitalForever || 0}</span>
                    <button class="rp-btn" onclick="devSuite.adjustRoutePoint('digitalForever', -1)">−</button>
                    <button class="rp-btn" onclick="devSuite.adjustRoutePoint('digitalForever', 1)">+</button>
                </div>
            </div>
        `;
    }

    renderNotesStatus() {
        try {
            const notes = JSON.parse(localStorage.getItem('vn_collected_notes') || '{}');
            const total = Object.values(notes).flat().length;
            return `<span class="muted">${total} notes unlocked</span>`;
        } catch {
            return '<span class="muted">Unable to read notes</span>';
        }
    }

    renderTutorialsStatus() {
        const tutorials = this.game.tutorialManager?.shownTutorials;
        if (!tutorials || tutorials.size === 0) {
            return '<span class="muted">No tutorials completed</span>';
        }
        return [...tutorials].map(t => `<span class="flag-chip">✓ ${t}</span>`).join('');
    }

    renderScenesTab() {
        return `
            <div class="scenes-tab">
                <div class="search-box">
                    <input type="text" id="scene-search" placeholder="🔍 Search scenes..." oninput="devSuite.filterScenes(this.value)">
                </div>
                <div class="scenes-list" id="scenes-list">
                    ${this.renderScenesList()}
                </div>
            </div>
        `;
    }

    renderScenesList() {
        // Get available scenes from current route
        const route = this.game.currentRoute;
        if (!route) return '<span class="muted">No route active - start a route first</span>';

        // Try to extract scene methods
        const scenes = [];

        // Check each act
        for (let actNum = 1; actNum <= 4; actNum++) {
            const act = route[`act${actNum}`];
            if (act) {
                const actScenes = Object.keys(act)
                    .filter(k => typeof act[k] === 'function' && !k.startsWith('_'))
                    .map(k => ({ act: actNum, scene: k }));
                scenes.push(...actScenes);
            }
        }

        if (scenes.length === 0) {
            return '<span class="muted">No scenes detected</span>';
        }

        let currentAct = 0;
        let html = '';

        scenes.forEach(s => {
            if (s.act !== currentAct) {
                if (currentAct !== 0) html += '</div>';
                html += `<div class="act-header">ACT ${s.act}</div><div class="act-scenes">`;
                currentAct = s.act;
            }

            const isCurrent = this.game.currentScene === s.scene;
            html += `
                <div class="scene-item ${isCurrent ? 'current' : ''}">
                    <span class="scene-name">${isCurrent ? '▶ ' : ''}${s.scene}</span>
                    <button class="scene-jump-btn" data-scene="${s.scene}" data-act="${s.act}">Jump</button>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    renderTestingTab() {
        return `
            <div class="testing-tab">
                <div class="debug-section">
                    <div class="section-title">TETHER SIMULATOR</div>
                    <div class="tether-buttons">
                        <button class="tether-btn green" data-value="100">100%</button>
                        <button class="tether-btn" data-value="85">85%</button>
                        <button class="tether-btn yellow" data-value="50">50%</button>
                        <button class="tether-btn orange" data-value="30">30%</button>
                        <button class="tether-btn red" data-value="0">0%</button>
                    </div>
                </div>
                
                <div class="debug-section">
                    <div class="section-title">FORCE ENDING</div>
                    <div class="ending-buttons">
                        <button class="ending-btn true" data-ending="true">✨ True Route</button>
                        <button class="ending-btn digital" data-ending="digital">💜 Digital Forever</button>
                        <button class="ending-btn bad" data-ending="bad">💀 Bad Route</button>
                    </div>
                </div>
                
                <div class="debug-section">
                    <div class="section-title">PLAYBACK</div>
                    <div class="playback-controls">
                        <button class="playback-btn" onclick="devSuite.toggleAutoAdvance()">
                            ${this.game.autoAdvance ? '⏸️ Stop Auto' : '▶️ Auto Advance'}
                        </button>
                        <button class="playback-btn" onclick="devSuite.runToNextChoice()">
                            ⏭️ Run to Choice
                        </button>
                    </div>
                </div>
                
                <div class="debug-section">
                    <div class="section-title">BREAKPOINTS</div>
                    ${this.renderBreakpoints()}
                </div>
            </div>
        `;
    }

    renderBreakpoints() {
        const bp = this.breakpoints?.breakpoints || {};
        return `
            <div class="breakpoint-list">
                <label class="bp-item">
                    <input type="checkbox" ${bp.choiceMade ? 'checked' : ''} onchange="devSuite.breakpoints.toggle('choiceMade')">
                    Choice made
                </label>
                <label class="bp-item">
                    <input type="checkbox" ${bp.sceneTransition ? 'checked' : ''} onchange="devSuite.breakpoints.toggle('sceneTransition')">
                    Scene transition
                </label>
                <label class="bp-item">
                    <input type="checkbox" ${bp.noteUnlocked ? 'checked' : ''} onchange="devSuite.breakpoints.toggle('noteUnlocked')">
                    Note unlocked
                </label>
                <label class="bp-item">
                    <input type="checkbox" ${bp.tetherThreshold?.enabled ? 'checked' : ''} onchange="devSuite.breakpoints.toggle('tetherThreshold')">
                    Tether &lt; 30%
                </label>
            </div>
        `;
    }

    renderLogsTab() {
        const logs = this.logger?.logs || [];
        return `
            <div class="logs-tab">
                <div class="log-filters">
                    <button class="log-filter active" data-filter="all">All</button>
                    <button class="log-filter" data-filter="choice">Choices</button>
                    <button class="log-filter" data-filter="state">State</button>
                    <button class="log-filter" data-filter="scene">Scenes</button>
                    <button class="log-filter" data-filter="error">Errors</button>
                </div>
                <div class="logs-list" id="logs-list">
                    ${logs.length === 0 ? '<span class="muted">No logs yet</span>' :
                logs.map(l => `
                            <div class="log-entry ${l.type}">
                                <span class="log-time">${l.timestamp}</span>
                                <span class="log-type">[${l.type}]</span>
                                <span class="log-msg">${l.message}</span>
                            </div>
                        `).join('')}
                </div>
                <div class="log-actions">
                    <button onclick="devSuite.copyLogs()">📋 Copy</button>
                    <button onclick="devSuite.clearLogs()">🗑️ Clear</button>
                </div>
            </div>
        `;
    }

    renderWatchTab() {
        const watches = this.watch?.watches || [];
        return `
            <div class="watch-tab">
                <div class="watch-add">
                    <input type="text" id="watch-expression-input" placeholder="game.tetherLevel">
                    <button id="add-watch-btn">+ Add</button>
                </div>
                <div class="watch-list" id="watch-list">
                    ${watches.length === 0 ? '<span class="muted">No watches added</span>' :
                watches.map(w => `
                            <div class="watch-item">
                                <span class="watch-expr">${w.expression}</span>
                                <span class="watch-value">→ ${this.watch.formatValue(this.watch.evaluate(w.expression))}</span>
                                <button class="watch-remove" onclick="devSuite.watch.remove(${w.id}); devSuite.refreshCurrentTab();">×</button>
                            </div>
                        `).join('')}
                </div>
            </div>
        `;
    }

    // ========================================
    // CONSOLE
    // ========================================

    handleConsoleInput(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            const cmd = this.consoleInput.value.trim();
            if (cmd) {
                this.consoleHistory.push(cmd);
                this.historyIndex = this.consoleHistory.length;
                this.runConsoleCommand(cmd);
                this.consoleInput.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.consoleInput.value = this.consoleHistory[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.consoleHistory.length - 1) {
                this.historyIndex++;
                this.consoleInput.value = this.consoleHistory[this.historyIndex];
            } else {
                this.historyIndex = this.consoleHistory.length;
                this.consoleInput.value = '';
            }
        }
    }

    runConsoleCommand(cmd) {
        this.consoleLogEntry(`> ${cmd}`, 'user');

        const parts = cmd.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        const commands = {
            'help': () => this.showConsoleHelp(),
            'clear': () => { this.consoleLog.innerHTML = ''; },
            'tether': () => {
                const val = parseInt(args[0]);
                if (!isNaN(val)) {
                    this.setTether(val);
                    return `Tether set to ${val}%`;
                }
                return 'Usage: tether <0-100>';
            },
            'jump': () => {
                if (args[0]) {
                    this.jumpToScene(args[0]);
                    return `Jumped to ${args[0]}`;
                }
                return 'Usage: jump <sceneId>';
            },
            'tab': () => {
                if (args[0]) {
                    this.switchTab(args[0]);
                    return `Switched to ${args[0]} tab`;
                }
                return 'Usage: tab <debug|state|scenes|testing|logs|watch>';
            },
            'rp': () => {
                const rp = this.game.currentRoute?.routePoints;
                return rp ? JSON.stringify(rp, null, 2) : 'No route active';
            },
            'flags': () => {
                const flags = this.game.gameState?.flags;
                return flags ? JSON.stringify(flags, null, 2) : 'No flags';
            },
            'eval': () => {
                try {
                    const result = eval(args.join(' '));
                    return String(result);
                } catch (e) {
                    return `Error: ${e.message}`;
                }
            }
        };

        if (commands[command]) {
            const result = commands[command]();
            if (result) this.consoleLogEntry(result, 'success');
        } else {
            this.consoleLogEntry(`Unknown command: ${command}. Type 'help' for commands.`, 'error');
        }
    }

    showConsoleHelp() {
        const help = [
            'COMMANDS:',
            '  help          - Show this help',
            '  clear         - Clear console',
            '  tether <0-100> - Set tether level',
            '  jump <scene>  - Jump to scene',
            '  tab <name>    - Switch tab',
            '  rp            - Show route points',
            '  flags         - Show active flags',
            '  eval <expr>   - Evaluate JavaScript'
        ];
        help.forEach(line => this.consoleLogEntry(line, 'system'));
    }

    consoleLogEntry(text, type = 'system') {
        const entry = document.createElement('div');
        entry.className = `console-entry ${type}`;
        entry.textContent = text;
        this.consoleLog.appendChild(entry);
        this.consoleLog.scrollTop = this.consoleLog.scrollHeight;
    }

    // ========================================
    // UTILITY METHODS
    // ========================================

    setTether(value) {
        if (this.game.currentRoute?.tetherSystem) {
            this.game.currentRoute.tetherSystem.setTether(value);
            this.consoleLogEntry(`✓ Tether set to ${value}%`, 'success');
            this.refreshCurrentTab();
        } else {
            this.consoleLogEntry('⚠ Tether system not active', 'error');
        }
    }

    adjustRoutePoint(type, delta) {
        const rp = this.game.currentRoute?.routePoints;
        if (rp) {
            rp[type] = Math.max(0, (rp[type] || 0) + delta);
            this.refreshCurrentTab();
        }
    }

    forceEnding(type) {
        const rp = this.game.currentRoute?.routePoints;
        if (!rp) {
            this.consoleLogEntry('⚠ No route active', 'error');
            return;
        }

        switch (type) {
            case 'true':
                rp.bad = 0; rp.true = 100; rp.digitalForever = 0;
                break;
            case 'digital':
                rp.bad = 0; rp.true = 0; rp.digitalForever = 100;
                break;
            case 'bad':
                rp.bad = 100; rp.true = 0; rp.digitalForever = 0;
                break;
        }

        this.consoleLogEntry(`✓ Route points set for ${type} ending`, 'success');
        this.refreshCurrentTab();
    }

    jumpToScene(sceneId, actNum = null) {
        const route = this.game.currentRoute;
        if (!route) {
            this.consoleLogEntry('⚠ No route active', 'error');
            return;
        }

        // Find the scene
        for (let a = 1; a <= 4; a++) {
            const act = route[`act${a}`];
            if (act && typeof act[sceneId] === 'function') {
                act[sceneId]();
                this.consoleLogEntry(`✓ Jumped to ${sceneId}`, 'success');
                this.logger.log('scene', `Jumped to ${sceneId}`);
                return;
            }
        }

        this.consoleLogEntry(`⚠ Scene '${sceneId}' not found`, 'error');
    }

    filterScenes(query) {
        const items = document.querySelectorAll('.scene-item');
        const q = query.toLowerCase();
        items.forEach(item => {
            const name = item.querySelector('.scene-name').textContent.toLowerCase();
            item.style.display = name.includes(q) ? '' : 'none';
        });
    }

    toggleAutoAdvance() {
        this.game.autoAdvance = !this.game.autoAdvance;
        this.refreshCurrentTab();
        this.consoleLogEntry(`Auto-advance: ${this.game.autoAdvance ? 'ON' : 'OFF'}`, 'success');
    }

    runToNextChoice() {
        this.game.autoAdvance = true;
        this.game.stopAtChoice = true;
        this.consoleLogEntry('Running to next choice...', 'system');
    }

    // ========================================
    // FPS MONITOR
    // ========================================

    startFPSMonitor() {
        const updateFPS = () => {
            this.fpsFrames++;
            const now = performance.now();
            if (now - this.fpsLastTime >= 1000) {
                this.currentFPS = this.fpsFrames;
                this.fpsFrames = 0;
                this.fpsLastTime = now;

                // Update display if debug tab is active
                const fpsEl = document.getElementById('debug-fps');
                if (fpsEl) fpsEl.textContent = this.currentFPS;
            }
            requestAnimationFrame(updateFPS);
        };
        requestAnimationFrame(updateFPS);
    }

    getMemoryUsage() {
        if (performance.memory) {
            const mb = Math.round(performance.memory.usedJSHeapSize / 1048576);
            return `${mb}MB`;
        }
        return 'N/A';
    }

    // ========================================
    // HEADER ACTIONS
    // ========================================

    async captureScreenshot() {
        this.consoleLogEntry('📸 Screenshot feature requires html2canvas library', 'system');
        // TODO: Implement with html2canvas
    }

    showPresetsModal() {
        this.presets.showModal();
    }

    showShortcutsModal() {
        const shortcuts = [
            'Ctrl+Shift+D - Toggle Dev Suite',
            'Ctrl+Shift+1-6 - Switch tabs',
            'Ctrl+Shift+C - Focus console',
            'Ctrl+Shift+M - Minimize',
            'ESC - Close'
        ];
        this.consoleLogEntry('KEYBOARD SHORTCUTS:', 'system');
        shortcuts.forEach(s => this.consoleLogEntry('  ' + s, 'system'));
    }

    hotReload() {
        this.consoleLogEntry('🔄 Hot reload not implemented (would require dynamic imports)', 'system');
    }

    copyLogs() {
        const logs = this.logger.logs.map(l => `${l.timestamp} [${l.type}] ${l.message}`).join('\n');
        navigator.clipboard.writeText(logs);
        this.consoleLogEntry('📋 Logs copied to clipboard', 'success');
    }

    clearLogs() {
        this.logger.logs = [];
        this.refreshCurrentTab();
        this.consoleLogEntry('🗑️ Logs cleared', 'success');
    }

    // ========================================
    // PERSISTENCE
    // ========================================

    loadState() {
        const saved = localStorage.getItem('devSuiteState');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.warn('Failed to load dev suite state');
            }
        }
        return {
            lastActiveTab: 'debug',
            consoleDividerPosition: 280,
            watchVariables: [],
            consoleHistory: []
        };
    }

    saveState() {
        const state = {
            lastActiveTab: this.activeTab,
            consoleDividerPosition: this.state.consoleDividerPosition,
            watchVariables: this.watch?.watches || [],
            consoleHistory: this.consoleHistory.slice(-50)
        };
        localStorage.setItem('devSuiteState', JSON.stringify(state));
    }
}

// ========================================
// SUB-SYSTEMS
// ========================================

class DevLogger {
    constructor(suite) {
        this.suite = suite;
        this.logs = [];
        this.maxLogs = 500;
    }

    log(type, message) {
        const timestamp = new Date().toLocaleTimeString();
        this.logs.unshift({ timestamp, type, message });
        if (this.logs.length > this.maxLogs) this.logs.pop();

        // Check breakpoints
        if (this.suite.breakpoints) {
            this.suite.breakpoints.check(type, { message });
        }
    }
}

class DevPresets {
    constructor(suite) {
        this.suite = suite;
        this.presets = this.loadFromStorage();
    }

    savePreset(name) {
        const game = this.suite.game;
        const preset = {
            id: Date.now(),
            name,
            timestamp: Date.now(),
            scene: game.currentScene,
            route: game.currentRoute?.name,
            routePoints: { ...game.currentRoute?.routePoints },
            tether: game.currentRoute?.tetherSystem?.tetherLevel,
            flags: { ...game.gameState?.flags }
        };
        this.presets.push(preset);
        this.saveToStorage();
        this.suite.consoleLogEntry(`💾 Preset saved: ${name}`, 'success');
    }

    loadPreset(id) {
        const preset = this.presets.find(p => p.id === id);
        if (!preset) return;

        const game = this.suite.game;
        if (game.currentRoute) {
            game.currentRoute.routePoints = { ...preset.routePoints };
            game.currentRoute.tetherSystem?.setTether(preset.tether);
        }
        if (game.gameState) {
            game.gameState.flags = { ...preset.flags };
        }

        if (preset.scene) {
            this.suite.jumpToScene(preset.scene);
        }

        this.suite.consoleLogEntry(`💾 Preset loaded: ${preset.name}`, 'success');
    }

    deletePreset(id) {
        this.presets = this.presets.filter(p => p.id !== id);
        this.saveToStorage();
    }

    showModal() {
        this.suite.consoleLogEntry('💾 SAVED PRESETS:', 'system');
        if (this.presets.length === 0) {
            this.suite.consoleLogEntry('  No presets saved', 'system');
        } else {
            this.presets.forEach(p => {
                this.suite.consoleLogEntry(`  ${p.name} (${new Date(p.timestamp).toLocaleString()})`, 'system');
            });
        }
        this.suite.consoleLogEntry('  Type: preset save <name> / preset load <name>', 'system');
    }

    loadFromStorage() {
        try {
            return JSON.parse(localStorage.getItem('devPresets') || '[]');
        } catch {
            return [];
        }
    }

    saveToStorage() {
        localStorage.setItem('devPresets', JSON.stringify(this.presets));
    }
}

class VariableWatch {
    constructor(suite) {
        this.suite = suite;
        this.watches = suite.state.watchVariables || [];
        this.refreshInterval = 500;
    }

    addWatch(expression) {
        this.watches.push({ expression, id: Date.now() });
        this.suite.saveState();
    }

    remove(id) {
        this.watches = this.watches.filter(w => w.id !== id);
        this.suite.saveState();
    }

    evaluate(expression) {
        try {
            return eval(expression);
        } catch (e) {
            return `Error: ${e.message}`;
        }
    }

    formatValue(val) {
        if (val === undefined) return 'undefined';
        if (val === null) return 'null';
        if (typeof val === 'object') {
            try {
                const str = JSON.stringify(val);
                return str.length > 50 ? str.slice(0, 50) + '...' : str;
            } catch {
                return '[Object]';
            }
        }
        return String(val);
    }
}

class BreakpointSystem {
    constructor(suite) {
        this.suite = suite;
        this.breakpoints = {
            choiceMade: false,
            sceneTransition: false,
            noteUnlocked: false,
            tetherThreshold: { enabled: false, value: 30 }
        };
    }

    toggle(type) {
        if (type === 'tetherThreshold') {
            this.breakpoints.tetherThreshold.enabled = !this.breakpoints.tetherThreshold.enabled;
        } else {
            this.breakpoints[type] = !this.breakpoints[type];
        }
    }

    check(eventType, data) {
        let shouldBreak = false;
        let message = '';

        if (eventType === 'choice' && this.breakpoints.choiceMade) {
            shouldBreak = true;
            message = `Choice made: ${data.message}`;
        } else if (eventType === 'scene' && this.breakpoints.sceneTransition) {
            shouldBreak = true;
            message = data.message;
        } else if (eventType === 'note' && this.breakpoints.noteUnlocked) {
            shouldBreak = true;
            message = data.message;
        }

        if (shouldBreak) {
            this.triggerBreak(message);
        }
    }

    triggerBreak(message) {
        this.suite.game.pauseManager?.request('breakpoint');
        this.suite.open();
        this.suite.switchTab('logs');
        this.suite.consoleLogEntry(`🔴 BREAKPOINT: ${message}`, 'error');
    }
}

// ========================================
// GLOBAL EXPORT
// ========================================

if (typeof window !== 'undefined') {
    window.DevSuite = DevSuite;
}

export { DevSuite };
