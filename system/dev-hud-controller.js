// ========================================
// DEV HUD CONTROLLER
// Hidden debug overlay toggled via secret code
// SOLID Refactor: Extracted from GameEngine
// ========================================

/**
 * DevHUDController
 * 
 * Manages the developer heads-up display for debugging.
 * Shows route, act, scene, page, tether level, difficulty, flags, and loop version.
 * 
 * @class DevHUDController
 */
class DevHUDController {
    constructor(game) {
        this.game = game;
        this.active = false;
        this.updateInterval = null;
    }

    // ========================================
    // TOGGLE HUD
    // ========================================

    toggle() {
        const hud = this.game.uiController.devHud;
        if (!hud) {
            console.warn('Dev HUD not found in DOM');
            return;
        }

        if (hud.style.display === 'none') {
            hud.style.display = 'block';
            this.active = true;
            this.update();

            // Start update interval
            this.updateInterval = setInterval(() => {
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
    // ========================================

    update() {
        if (!this.active) return;

        // Route
        const routeName = this.game.currentRoute ? this.game.currentRoute.constructor.name : '—';
        document.getElementById('hud-route').textContent = routeName;

        // Act (try to detect from route properties)
        let actName = '—';
        if (this.game.currentRoute) {
            if (this.game.currentRoute.currentAct) {
                actName = `Act ${this.game.currentRoute.currentAct}`;
            } else if (this.game.currentRoute.act) {
                actName = this.game.currentRoute.act;
            }
        }
        document.getElementById('hud-act').textContent = actName;

        // Scene
        const sceneName = this.game.currentScene || '—';
        // Truncate if too long
        const sceneDisplay = typeof sceneName === 'string' && sceneName.length > 30
            ? sceneName.substring(0, 27) + '...'
            : sceneName;
        document.getElementById('hud-scene').textContent = sceneDisplay;

        // Page
        const page = this.game.currentPageIndex !== undefined
            ? `${this.game.currentPageIndex + 1}`
            : '—';
        document.getElementById('hud-page').textContent = page;

        // Tether
        let tetherDisplay = 'N/A';
        if (this.game.tetherSystem && this.game.tetherSystem.tetherLevel !== undefined) {
            tetherDisplay = `${Math.round(this.game.tetherSystem.tetherLevel)}%`;

            // Color code based on level
            const tetherEl = document.getElementById('hud-tether');
            if (this.game.tetherSystem.tetherLevel <= 25) {
                tetherEl.style.color = '#ff0066';
            } else if (this.game.tetherSystem.tetherLevel <= 50) {
                tetherEl.style.color = '#ff9900';
            } else {
                tetherEl.style.color = '#00ff88';
            }
        }
        document.getElementById('hud-tether').textContent = tetherDisplay;

        // Difficulty
        const difficulty = this.game.settingsManager?.settings?.tetherDifficulty || '—';
        document.getElementById('hud-difficulty').textContent = difficulty.toUpperCase();

        // Flags (show count + some key flags)
        let flagsDisplay = '—';
        if (this.game.gameState?.flags) {
            const flagCount = Object.keys(this.game.gameState.flags).length;
            flagsDisplay = `${flagCount} set`;

            // Show important flags
            const importantFlags = [];
            if (this.game.gameState.flags.insaneModeActive) importantFlags.push('INSANE');
            if (this.game.state.get('unlocks.skipUnlocked')) importantFlags.push('SKIP');
            if (importantFlags.length > 0) {
                flagsDisplay += ` (${importantFlags.join(', ')})`;
            }
        }
        document.getElementById('hud-flags').textContent = flagsDisplay;

        // Loop version
        const loopVersion = this.game.loopVersion || 848;
        document.getElementById('hud-loop').textContent = loopVersion;
    }

    // ========================================
    // STATE ACCESSORS
    // ========================================

    isActive() {
        return this.active;
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.DevHUDController = DevHUDController;
}

// ES Module export
export { DevHUDController };
