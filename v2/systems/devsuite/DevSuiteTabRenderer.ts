// ========================================
// DEV SUITE TAB RENDERER
// Tab switching, content rendering, event wiring
//
// Extracted from DevSuite.ts (lines 424-828)
//
// 848 is sacred. 💚🔥💀
// ========================================

import type { GameInstance, ConsoleLogType } from '../DevSuite';
import type { DevLogger } from './DevLogger';
import type { BreakpointSystem } from './BreakpointSystem';
import type { VariableWatch } from './VariableWatch';

export interface TabRendererDeps {
    game: GameInstance;
    logger: DevLogger;
    breakpoints: BreakpointSystem;
    watch: VariableWatch;
    getCurrentFPS(): number;
    getMemoryUsage(): string;
}

export interface TabRendererCallbacks {
    setTether(value: number): void;
    forceEnding(type: string): void;
    jumpToScene(sceneId: string): void;
    onTabChange(tabName: string): void;
}

/**
 * DevSuiteTabRenderer
 *
 * Owns the active tab state, renders all tab content as HTML strings,
 * and wires up tab-specific DOM event listeners.
 */
export class DevSuiteTabRenderer {
    private activeTab: string = 'debug';

    constructor(
        private deps: TabRendererDeps,
        private callbacks: TabRendererCallbacks
    ) {}

    // ========================================
    // TAB SWITCHING
    // ========================================

    switchTab(tabName: string): void {
        this.activeTab = tabName;
        this.callbacks.onTabChange(tabName);

        document.querySelectorAll('.dev-suite-tab').forEach(tab => {
            const tabEl = tab as HTMLElement;
            tab.classList.toggle('active', tabEl.dataset.tab === tabName);
        });

        this.refreshCurrentTab();
    }

    refreshCurrentTab(): void {
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

        this.attachTabEventListeners();
    }

    getActiveTab(): string {
        return this.activeTab;
    }

    // ========================================
    // TAB EVENT LISTENERS
    // ========================================

    private attachTabEventListeners(): void {
        // Testing tab tether buttons
        document.querySelectorAll('.tether-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const btnEl = btn as HTMLElement;
                const value = parseInt(btnEl.dataset.value || '0');
                this.callbacks.setTether(value);
            });
        });

        // Testing tab force ending buttons
        document.querySelectorAll('.ending-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const btnEl = btn as HTMLElement;
                const ending = btnEl.dataset.ending;
                if (ending) this.callbacks.forceEnding(ending);
            });
        });

        // Scenes tab jump buttons
        document.querySelectorAll('.scene-jump-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const btnEl = btn as HTMLElement;
                const scene = btnEl.dataset.scene;
                if (scene) this.callbacks.jumpToScene(scene);
            });
        });

        // Watch tab add button
        const addWatchBtn = document.getElementById('add-watch-btn');
        if (addWatchBtn) {
            addWatchBtn.addEventListener('click', () => {
                const input = document.getElementById('watch-expression-input') as HTMLInputElement;
                if (input && input.value.trim()) {
                    this.deps.watch.addWatch(input.value.trim());
                    input.value = '';
                    this.refreshCurrentTab();
                }
            });
        }
    }

    // ========================================
    // DEBUG TAB
    // ========================================

    private renderDebugTab(): string {
        const route = this.deps.game.currentRoute;
        const tether = route?.tetherSystem?.tetherLevel ?? 'N/A';
        const scene = this.deps.game.currentScene || 'N/A';
        const routeName = route?.name || 'No route';
        const memory = this.deps.getMemoryUsage();

        return `
            <div class="debug-tab">
                <div class="debug-stats-row">
                    <div class="debug-stat-box">
                        <div class="stat-label">FPS</div>
                        <div class="stat-value" id="debug-fps">${this.deps.getCurrentFPS()}</div>
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

    private renderRoutePoints(): string {
        const rp = this.deps.game.currentRoute?.routePoints;
        if (!rp) return '<span class="muted">No route active</span>';

        return `
            <div class="rp-item bad">Bad: ${rp.bad || 0}</div>
            <div class="rp-item true">True: ${rp.true || 0}</div>
            <div class="rp-item digital">Digital: ${rp.digitalForever || 0}</div>
        `;
    }

    private renderFlags(): string {
        const flags = this.deps.game.gameState?.flags;
        if (!flags || Object.keys(flags).length === 0) {
            return '<span class="muted">No flags set</span>';
        }

        return Object.entries(flags)
            .filter(([_k, v]) => v)
            .map(([k, _v]) => `<span class="flag-chip">${k}</span>`)
            .join('');
    }

    // ========================================
    // STATE TAB
    // ========================================

    private renderStateTab(): string {
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

    private renderRoutePointsEditable(): string {
        const rp = this.deps.game.currentRoute?.routePoints;
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

    private renderNotesStatus(): string {
        try {
            const notes = JSON.parse(localStorage.getItem('vn_collected_notes') || '{}');
            const total = Object.values(notes).flat().length;
            return `<span class="muted">${total} notes unlocked</span>`;
        } catch {
            return '<span class="muted">Unable to read notes</span>';
        }
    }

    private renderTutorialsStatus(): string {
        const tutorials = this.deps.game.tutorialManager?.shownTutorials;
        if (!tutorials || tutorials.size === 0) {
            return '<span class="muted">No tutorials completed</span>';
        }
        return [...tutorials].map(t => `<span class="flag-chip">✓ ${t}</span>`).join('');
    }

    // ========================================
    // SCENES TAB
    // ========================================

    private renderScenesTab(): string {
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

    private renderScenesList(): string {
        const route = this.deps.game.currentRoute;
        if (!route) return '<span class="muted">No route active - start a route first</span>';

        const scenes: { act: number; scene: string }[] = [];

        for (let actNum = 1; actNum <= 4; actNum++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const act = route[`act${actNum}`] as any;
            if (act) {
                // DIZEE FIX: Class methods are not enumerable, so Object.keys() fails.
                // We must inspect the prototype to find scene methods.
                const prototype = Object.getPrototypeOf(act);
                const methodNames = Object.getOwnPropertyNames(prototype);

                const actScenes = methodNames
                    .filter(k => {
                        return k !== 'constructor' &&
                            !k.startsWith('_') &&
                            typeof act[k] === 'function';
                    })
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

            const isCurrent = this.deps.game.currentScene === s.scene;
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

    // ========================================
    // TESTING TAB
    // ========================================

    private renderTestingTab(): string {
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
                            ${this.deps.game.autoAdvance ? '⏸️ Stop Auto' : '▶️ Auto Advance'}
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

    private renderBreakpoints(): string {
        const bp = this.deps.breakpoints?.breakpoints || {};
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

    // ========================================
    // LOGS TAB
    // ========================================

    private renderLogsTab(): string {
        const logs = this.deps.logger?.logs || [];
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
                logs.map((l: ConsoleLogType) => `
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

    // ========================================
    // WATCH TAB
    // ========================================

    private renderWatchTab(): string {
        const watches = this.deps.watch?.watches || [];
        return `
            <div class="watch-tab">
                <div class="watch-add">
                    <input type="text" id="watch-expression-input" placeholder="game.tetherLevel">
                    <button id="add-watch-btn">+ Add</button>
                </div>
                <div class="watch-list" id="watch-list">
                    ${watches.length === 0 ? '<span class="muted">No watches added</span>' :
                watches.map((w: { expression: string; id: number }) => `
                            <div class="watch-item">
                                <span class="watch-expr">${w.expression}</span>
                                <span class="watch-value">→ ${this.deps.watch.formatValue(this.deps.watch.evaluate(w.expression))}</span>
                                <button class="watch-remove" onclick="devSuite.watch.remove(${w.id}); devSuite.refreshCurrentTab();">×</button>
                            </div>
                        `).join('')}
                </div>
            </div>
        `;
    }
}
