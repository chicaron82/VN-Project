import { EventBus } from '@core/EventBus';

/**
 * ════════════════════════════════════════════════════════════════
 * DEV HUD CONTROLLER - V2 Port
 * Phase 21b: Developer Heads-Up Display
 *
 * V1 Parity: dev-hud-controller.js (219 lines → ~300 lines)
 *
 * Purpose:
 * - Hidden debug overlay for development
 * - Real-time game state visualization
 * - Performance metrics monitoring
 * - Toggle via secret code
 *
 * Features:
 * - toggle(): Show/hide HUD with 500ms auto-update
 * - update(): Refresh all HUD fields
 * - updatePerformanceMetrics(): FPS, memory, load time
 * - Color-coded tether levels (red/orange/green)
 * - Color-coded FPS (green/yellow/red)
 *
 * HUD Fields:
 * - Route: Current route name
 * - Act: Current act number
 * - Scene: Current scene (truncated at 30 chars)
 * - Page: Current page index
 * - Tether: Tether level % (color-coded)
 * - Difficulty: Tether difficulty setting
 * - Flags: Flag count + important flags (INSANE, SKIP)
 * - Loop: Loop version (848+)
 * - Version: Loop version formatted as v848
 * - FPS: Frames per second (color-coded)
 * - Memory: Heap usage in MB
 * - Load Time: Initial load time in seconds
 * - Assets: Asset count
 *
 * V1 Parity Notes:
 * - All display logic preserved verbatim
 * - Console logging format identical
 * - 500ms update interval
 * - DOM element IDs match V1
 *
 * 🔧 "Debug what you can see."
 * ════════════════════════════════════════════════════════════════
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface GameInstance {
    uiController?: {
        devHud?: HTMLElement;
    };
    currentRoute?: {
        constructor: { name: string };
        currentAct?: number;
        act?: string;
    };
    currentScene?: string;
    currentPageIndex?: number;
    tetherSystem?: {
        tetherLevel: number;
    };
    settingsManager?: {
        settings?: {
            tetherDifficulty?: string;
        };
    };
    gameState?: {
        flags?: Record<string, boolean>;
    };
    state?: {
        get: (key: string) => unknown;
    };
    loopVersion?: number;
    loadTime?: number;
    assetsLoaded?: number;
}

export class DevHUDController {
    private game: GameInstance;
    private active: boolean;
    private updateInterval: number | null;
    private lastFrameTime?: number;
    private frameCount?: number;
    // @ts-expect-error - Reserved for future EventBus integration
    private eventBus: EventBus;

    constructor(game: GameInstance, eventBus: EventBus) {
        this.game = game;
        this.active = false;
        this.updateInterval = null;
        this.eventBus = eventBus;

        console.log('🔧 DevHUDController initialized');
    }

    // ========================================
    // TOGGLE HUD
    // V1 Parity: dev-hud-controller.js lines 26-56
    // ========================================

    /**
     * Toggle HUD visibility and start/stop auto-update.
     * V1 Parity: Exact logic preserved
     */
    public toggle(): void {
        const hud = this.game.uiController?.devHud;
        if (!hud) {
            console.warn('Dev HUD not found in DOM');
            return;
        }

        if (hud.style.display === 'none') {
            hud.style.display = 'block';
            this.active = true;
            this.update();

            // Start update interval
            this.updateInterval = window.setInterval(() => {
                this.update();
            }, 500); // Update every 500ms

            console.log('🔧 Dev HUD enabled');
        } else {
            hud.style.display = 'none';
            this.active = false;

            // Stop update interval
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
                this.updateInterval = null;
            }

            console.log('🔧 Dev HUD disabled');
        }
    }

    // ========================================
    // UPDATE HUD DISPLAY
    // V1 Parity: dev-hud-controller.js lines 62-140
    // ========================================

    /**
     * Update all HUD fields with current game state.
     * V1 Parity: Exact logic preserved
     */
    public update(): void {
        if (!this.active) return;

        // Route
        const routeName = this.game.currentRoute ? this.game.currentRoute.constructor.name : '—';
        const routeEl = document.getElementById('hud-route');
        if (routeEl) routeEl.textContent = routeName;

        // Act (try to detect from route properties)
        let actName = '—';
        if (this.game.currentRoute) {
            if (this.game.currentRoute.currentAct) {
                actName = `Act ${this.game.currentRoute.currentAct}`;
            } else if (this.game.currentRoute.act) {
                actName = this.game.currentRoute.act;
            }
        }
        const actEl = document.getElementById('hud-act');
        if (actEl) actEl.textContent = actName;

        // Scene
        const sceneName = this.game.currentScene || '—';
        // Truncate if too long
        const sceneDisplay =
            typeof sceneName === 'string' && sceneName.length > 30
                ? sceneName.substring(0, 27) + '...'
                : sceneName;
        const sceneEl = document.getElementById('hud-scene');
        if (sceneEl) sceneEl.textContent = sceneDisplay;

        // Page
        const page = this.game.currentPageIndex !== undefined ? `${this.game.currentPageIndex + 1}` : '—';
        const pageEl = document.getElementById('hud-page');
        if (pageEl) pageEl.textContent = page;

        // Tether
        let tetherDisplay = 'N/A';
        if (this.game.tetherSystem && this.game.tetherSystem.tetherLevel !== undefined) {
            tetherDisplay = `${Math.round(this.game.tetherSystem.tetherLevel)}%`;

            // Color code based on level
            const tetherEl = document.getElementById('hud-tether');
            if (tetherEl) {
                if (this.game.tetherSystem.tetherLevel <= 25) {
                    tetherEl.style.color = '#ff0066';
                } else if (this.game.tetherSystem.tetherLevel <= 50) {
                    tetherEl.style.color = '#ff9900';
                } else {
                    tetherEl.style.color = '#00ff88';
                }
            }
        }
        const tetherEl = document.getElementById('hud-tether');
        if (tetherEl) tetherEl.textContent = tetherDisplay;

        // Difficulty
        const difficulty = this.game.settingsManager?.settings?.tetherDifficulty || '—';
        const difficultyEl = document.getElementById('hud-difficulty');
        if (difficultyEl) difficultyEl.textContent = difficulty.toUpperCase();

        // Flags (show count + some key flags)
        let flagsDisplay = '—';
        if (this.game.gameState?.flags) {
            const flagCount = Object.keys(this.game.gameState.flags).length;
            flagsDisplay = `${flagCount} set`;

            // Show important flags
            const importantFlags: string[] = [];
            if (this.game.gameState.flags.insaneModeActive) importantFlags.push('INSANE');
            if (this.game.state?.get('unlocks.skipUnlocked')) importantFlags.push('SKIP');
            if (importantFlags.length > 0) {
                flagsDisplay += ` (${importantFlags.join(', ')})`;
            }
        }
        const flagsEl = document.getElementById('hud-flags');
        if (flagsEl) flagsEl.textContent = flagsDisplay;

        // Loop version
        const loopVersion = this.game.loopVersion || 848;
        const loopEl = document.getElementById('hud-loop');
        if (loopEl) loopEl.textContent = String(loopVersion);

        // Loop Version (formatted)
        const version = this.game.loopVersion || '—';
        const versionEl = document.getElementById('hud-version');
        if (versionEl) versionEl.textContent = `v${version}`;

        // DIZEE POLISH: Performance Metrics
        this.updatePerformanceMetrics();
    }

    // ========================================
    // PERFORMANCE METRICS (DIZEE POLISH)
    // V1 Parity: dev-hud-controller.js lines 146-201
    // ========================================

    /**
     * Update performance metrics (FPS, memory, load time, assets).
     * V1 Parity: Exact logic preserved
     */
    private updatePerformanceMetrics(): void {
        // Load time (if available)
        if (this.game.loadTime) {
            const loadTimeEl = document.getElementById('hud-load-time');
            if (loadTimeEl) {
                loadTimeEl.textContent = `${(this.game.loadTime / 1000).toFixed(2)}s`;
            }
        }

        // Asset count (if available)
        if (this.game.assetsLoaded !== undefined) {
            const assetsEl = document.getElementById('hud-assets');
            if (assetsEl) {
                assetsEl.textContent = String(this.game.assetsLoaded);
            }
        }

        // Memory usage (if available - Chrome only)
        // @ts-expect-error - performance.memory is non-standard (Chrome only)
        if (performance.memory) {
            const memoryEl = document.getElementById('hud-memory');
            if (memoryEl) {
                // @ts-expect-error - performance.memory is non-standard (Chrome only)
                const usedMB = (performance.memory.usedJSHeapSize / 1048576).toFixed(1);
                memoryEl.textContent = `${usedMB} MB`;
            }
        }

        // FPS (simple calculation)
        if (!this.lastFrameTime) {
            this.lastFrameTime = performance.now();
            this.frameCount = 0;
        } else {
            this.frameCount = this.frameCount || 0;
            this.frameCount++;
            const now = performance.now();
            const elapsed = now - this.lastFrameTime;

            if (elapsed >= 1000) {
                // Update FPS every second
                const fps = Math.round((this.frameCount * 1000) / elapsed);
                const fpsEl = document.getElementById('hud-fps');
                if (fpsEl) {
                    fpsEl.textContent = String(fps);

                    // Color code FPS
                    if (fps >= 55) {
                        fpsEl.style.color = '#00ff88'; // Green
                    } else if (fps >= 30) {
                        fpsEl.style.color = '#ffcc00'; // Yellow
                    } else {
                        fpsEl.style.color = '#ff4444'; // Red
                    }
                }

                this.lastFrameTime = now;
                this.frameCount = 0;
            }
        }
    }

    // ========================================
    // STATE ACCESSORS
    // V1 Parity: dev-hud-controller.js lines 207-209
    // ========================================

    /**
     * Check if HUD is currently active.
     * V1 Parity: Exact logic preserved
     */
    public isActive(): boolean {
        return this.active;
    }
}
