// ========================================
// DEV SUITE GAME TOOLS
// Game manipulation, FPS monitoring, header actions
//
// Extracted from DevSuite.ts (lines 949-1122)
//
// 848 is sacred. 💚🔥💀
// ========================================

import type { GameInstance, ScreenshotTool, HotReloadSystem } from '../DevSuite';
import type { DevLogger, ConsoleLogType } from './DevLogger';
import type { DevPresets } from './DevPresets';
import { Logger } from '@utils/Logger';

export interface DevSuiteGameToolsDeps {
    game: GameInstance;
    devSuiteRef: any; // For ScreenshotTool/HotReloadSystem constructors (uses 'this as any' pattern)
    logger: DevLogger;
    presets: DevPresets;
    consoleLogEntry(text: string, type?: string): void;
    refreshCurrentTab(): void;
}

/**
 * DevSuiteGameTools
 *
 * Handles all game manipulation (tether, route points, scene jumps),
 * FPS monitoring, memory reporting, and header action buttons.
 */
export class DevSuiteGameTools {
    // FPS tracking
    private fpsFrames: number = 0;
    private fpsLastTime: number = performance.now();
    private currentFPS: number = 60;

    // Lazy-loaded systems
    private screenshotTool?: ScreenshotTool;
    private hotReloadSystem?: HotReloadSystem;

    constructor(private deps: DevSuiteGameToolsDeps) {}

    // ========================================
    // TETHER / ROUTE POINTS
    // ========================================

    setTether(value: number): void {
        if (this.deps.game.currentRoute?.tetherSystem) {
            this.deps.game.currentRoute.tetherSystem.setTether(value);
            this.deps.consoleLogEntry(`✓ Tether set to ${value}%`, 'success');
            this.deps.refreshCurrentTab();
        } else {
            this.deps.consoleLogEntry('⚠ Tether system not active', 'error');
        }
    }

    adjustRoutePoint(type: string, delta: number): void {
        const rp = this.deps.game.currentRoute?.routePoints;
        if (rp) {
            rp[type] = Math.max(0, (rp[type] || 0) + delta);
            this.deps.refreshCurrentTab();
        }
    }

    forceEnding(type: string): void {
        const rp = this.deps.game.currentRoute?.routePoints;
        if (!rp) {
            this.deps.consoleLogEntry('⚠ No route active', 'error');
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

        this.deps.consoleLogEntry(`✓ Route points set for ${type} ending`, 'success');
        this.deps.refreshCurrentTab();
    }

    // ========================================
    // SCENE NAVIGATION
    // ========================================

    jumpToScene(sceneId: string): void {
        const route = this.deps.game.currentRoute;
        if (!route) {
            this.deps.consoleLogEntry('⚠ No route active', 'error');
            return;
        }

        for (let a = 1; a <= 4; a++) {
            const act = route[`act${a}`];
            if (act && typeof act[sceneId] === 'function') {
                act[sceneId]();
                this.deps.consoleLogEntry(`✓ Jumped to ${sceneId}`, 'success');
                this.deps.logger.log('scene', `Jumped to ${sceneId}`);
                return;
            }
        }

        this.deps.consoleLogEntry(`⚠ Scene '${sceneId}' not found`, 'error');
    }

    filterScenes(query: string): void {
        const items = document.querySelectorAll('.scene-item');
        const q = query.toLowerCase();
        items.forEach(item => {
            const nameEl = item.querySelector('.scene-name');
            if (nameEl) {
                const name = nameEl.textContent?.toLowerCase() || '';
                (item as HTMLElement).style.display = name.includes(q) ? '' : 'none';
            }
        });
    }

    // ========================================
    // PLAYBACK CONTROLS
    // ========================================

    toggleAutoAdvance(): void {
        this.deps.game.autoAdvance = !this.deps.game.autoAdvance;
        this.deps.refreshCurrentTab();
        this.deps.consoleLogEntry(`Auto-advance: ${this.deps.game.autoAdvance ? 'ON' : 'OFF'}`, 'success');
    }

    runToNextChoice(): void {
        this.deps.game.autoAdvance = true;
        this.deps.game.stopAtChoice = true;
        this.deps.consoleLogEntry('Running to next choice...', 'system');
    }

    // ========================================
    // FPS MONITOR
    // ========================================

    startFPSMonitor(): void {
        const updateFPS = () => {
            this.fpsFrames++;
            const now = performance.now();
            if (now - this.fpsLastTime >= 1000) {
                this.currentFPS = this.fpsFrames;
                this.fpsFrames = 0;
                this.fpsLastTime = now;

                const fpsEl = document.getElementById('debug-fps');
                if (fpsEl) fpsEl.textContent = String(this.currentFPS);
            }
            requestAnimationFrame(updateFPS);
        };
        requestAnimationFrame(updateFPS);
    }

    getCurrentFPS(): number {
        return this.currentFPS;
    }

    getMemoryUsage(): string {
        const perf = performance as any;
        if (perf.memory) {
            const mb = Math.round(perf.memory.usedJSHeapSize / 1048576);
            return `${mb}MB`;
        }
        return 'N/A';
    }

    // ========================================
    // HEADER ACTIONS
    // ========================================

    async captureScreenshot(): Promise<void> {
        if (!this.screenshotTool) {
            const { ScreenshotTool } = await import('../ScreenshotTool');
            this.screenshotTool = new ScreenshotTool(this.deps.devSuiteRef);
        }

        await this.screenshotTool!.download().catch(err => {
            Logger.error('Screenshot failed', err);
        });
    }

    showPresetsModal(): void {
        this.deps.presets.showModal();
    }

    showShortcutsModal(): void {
        const shortcuts = [
            'Ctrl+Shift+D - Toggle Dev Suite',
            'Ctrl+Shift+1-6 - Switch tabs',
            'Ctrl+Shift+C - Focus console',
            'Ctrl+Shift+M - Minimize',
            'ESC - Close'
        ];
        this.deps.consoleLogEntry('KEYBOARD SHORTCUTS:', 'system');
        shortcuts.forEach(s => this.deps.consoleLogEntry('  ' + s, 'system'));
    }

    async hotReload(): Promise<void> {
        if (!this.hotReloadSystem) {
            const { HotReloadSystem } = await import('../HotReloadSystem');
            this.hotReloadSystem = new HotReloadSystem(this.deps.devSuiteRef);
        }

        this.hotReloadSystem!.showReloadMenu();
    }

    // ========================================
    // LOG MANAGEMENT
    // ========================================

    copyLogs(): void {
        const logs = this.deps.logger.logs.map((l: ConsoleLogType) => `${l.timestamp} [${l.type}] ${l.message}`).join('\n');
        navigator.clipboard.writeText(logs);
        this.deps.consoleLogEntry('📋 Logs copied to clipboard', 'success');
    }

    clearLogs(): void {
        this.deps.logger.logs = [];
        this.deps.refreshCurrentTab();
        this.deps.consoleLogEntry('🗑️ Logs cleared', 'success');
    }
}
