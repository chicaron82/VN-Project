/**
 * DevPresets - Save/load game state presets
 *
 * Extracted from DevSuite.ts (~115 lines → dedicated module)
 * V1 Parity: dev-suite.js lines 1128-1236 (109 lines)
 *
 * Handles:
 * - Save current game state as named preset
 * - Load preset to restore game state
 * - Delete presets
 * - Export/import presets as JSON files
 * - Persist to localStorage
 */

export interface PresetData {
    id: number;
    name: string;
    timestamp: number;
    scene?: string;
    route?: string;
    routePoints?: Record<string, number>;
    tether?: number;
    flags?: Record<string, boolean>;
}

export interface DevSuiteInterface {
    game: any;
    consoleLogEntry(message: string, type: string): void;
    jumpToScene(sceneId: string): void;
}

export class DevPresets {
    private suite: DevSuiteInterface;
    private presets: PresetData[];
    private storageKey: string = 'devPresets';

    constructor(suite: DevSuiteInterface) {
        this.suite = suite;
        this.presets = this.loadFromStorage();
    }

    /**
     * Save current game state as a preset
     */
    public savePreset(name: string): void {
        const game = this.suite.game;
        const preset: PresetData = {
            id: Date.now(),
            name,
            timestamp: Date.now(),
            scene: game.currentScene,
            route: game.currentRoute?.name,
            routePoints: { ...(game.currentRoute as any)?.routePoints },
            tether: (game.currentRoute as any)?.tetherSystem?.tetherLevel,
            flags: { ...game.gameState?.flags },
        };
        this.presets.push(preset);
        this.saveToStorage();
        this.suite.consoleLogEntry(`💾 Preset saved: ${name}`, 'success');
    }

    /**
     * Load a preset by ID
     */
    public loadPreset(id: number): void {
        const preset = this.presets.find((p) => p.id === id);
        if (!preset) {
            this.suite.consoleLogEntry('❌ Preset not found', 'error');
            return;
        }

        const game = this.suite.game;

        // Restore route points and tether
        if (game.currentRoute) {
            (game.currentRoute as any).routePoints = { ...preset.routePoints };
            (game.currentRoute as any).tetherSystem?.setTether(preset.tether);
        }

        // Restore flags
        if (game.gameState) {
            game.gameState.flags = { ...preset.flags };
        }

        // Jump to scene if specified
        if (preset.scene) {
            this.suite.jumpToScene(preset.scene);
        }

        this.suite.consoleLogEntry(`💾 Preset loaded: ${preset.name}`, 'success');
    }

    /**
     * Load a preset by name (case-insensitive)
     */
    public loadPresetByName(name: string): void {
        const preset = this.presets.find(
            (p) => p.name.toLowerCase() === name.toLowerCase()
        );
        if (preset) {
            this.loadPreset(preset.id);
        } else {
            this.suite.consoleLogEntry(`❌ Preset not found: ${name}`, 'error');
        }
    }

    /**
     * Delete a preset by ID
     */
    public deletePreset(id: number): void {
        const preset = this.presets.find((p) => p.id === id);
        if (!preset) {
            this.suite.consoleLogEntry('❌ Preset not found', 'error');
            return;
        }

        this.presets = this.presets.filter((p) => p.id !== id);
        this.saveToStorage();
        this.suite.consoleLogEntry(`🗑️ Preset deleted: ${preset.name}`, 'success');
    }

    /**
     * Get all presets
     */
    public getAll(): PresetData[] {
        return [...this.presets];
    }

    /**
     * Show presets in console
     */
    public showModal(): void {
        this.suite.consoleLogEntry('💾 SAVED PRESETS:', 'system');
        if (this.presets.length === 0) {
            this.suite.consoleLogEntry('  No presets saved', 'system');
        } else {
            this.presets.forEach((p) => {
                this.suite.consoleLogEntry(
                    `  ${p.name} (${new Date(p.timestamp).toLocaleString()})`,
                    'system'
                );
            });
        }
        this.suite.consoleLogEntry('  Type: preset save <name> / preset load <name>', 'system');
    }

    /**
     * Load presets from localStorage
     */
    private loadFromStorage(): PresetData[] {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        } catch {
            return [];
        }
    }

    /**
     * Save presets to localStorage
     */
    private saveToStorage(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.presets));
    }

    /**
     * Export all presets as JSON file
     */
    public exportPresets(): void {
        const json = JSON.stringify(this.presets, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `v848-dev-presets-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.suite.consoleLogEntry('📤 Presets exported', 'success');
    }

    /**
     * Import presets from JSON file
     */
    public importPresets(): void {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target?.result as string);
                    this.presets = [...this.presets, ...imported];
                    this.saveToStorage();
                    this.suite.consoleLogEntry(`📥 Imported ${imported.length} presets`, 'success');
                } catch (error) {
                    this.suite.consoleLogEntry('❌ Import failed: Invalid file', 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    /**
     * Clear all presets
     */
    public clearAll(): void {
        this.presets = [];
        this.saveToStorage();
        this.suite.consoleLogEntry('🗑️ All presets cleared', 'success');
    }
}
