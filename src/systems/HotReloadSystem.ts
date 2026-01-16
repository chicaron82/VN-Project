import { EventBus } from '@core/EventBus';

/**
 * ════════════════════════════════════════════════════════════════
 * HOT RELOAD SYSTEM - V2 Port
 * Phase 21e: Dynamic Script Reloading
 *
 * V1 Parity: hot-reload-system.js (212 lines → ~280 lines)
 *
 * Purpose:
 * - Reload route scripts without full page refresh
 * - Reload system modules dynamically
 * - Cache busting for development workflow
 * - Preserve game state during reloads
 *
 * Features:
 * - reloadAllRoutes(): Reload all route files
 * - reloadCurrentRoute(): Reload only active route
 * - reloadModule(path): Dynamic import with cache busting
 * - reloadSystem(name): Reload core system module
 * - showReloadMenu(): Interactive prompt menu
 *
 * V1 Parity Notes:
 * - All methods preserved verbatim
 * - Console logging format identical
 * - alert() dialogs for user feedback (V1 behavior)
 * - prompt() menu system intact
 *
 * 🔄 "Reload without restart. Dev life quality."
 * ════════════════════════════════════════════════════════════════
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface LoadedModuleInfo {
    module: unknown;
    timestamp: number;
    reloadCount: number;
}

export interface ModuleSummary {
    path: string;
    timestamp: string;
    reloadCount: number;
}

export interface DevSuiteInstance {
    game: GameInstance;
}

export interface GameInstance {
    currentRoute?: {
        name?: string;
    };
}

export class HotReloadSystem {
    // @ts-expect-error - Reserved for future DevSuite integration
    private devSuite: DevSuiteInstance;
    private game: GameInstance;
    private loadedModules: Map<string, LoadedModuleInfo>;
    private reloadCount: number;
    // @ts-expect-error - Reserved for future EventBus integration
    private eventBus: EventBus;

    constructor(devSuite: DevSuiteInstance, eventBus: EventBus) {
        this.devSuite = devSuite;
        this.game = devSuite.game;
        this.loadedModules = new Map();
        this.reloadCount = 0;
        this.eventBus = eventBus;

        console.log('🔄 HotReloadSystem initialized');
    }

    // ========================================
    // RELOAD ROUTES
    // V1 Parity: hot-reload-system.js lines 29-52
    // ========================================

    /**
     * Reload all route files dynamically.
     * V1 Parity: Exact logic preserved
     */
    public async reloadAllRoutes(): Promise<boolean> {
        console.log('🔄 Hot Reload: Reloading all routes...');

        const routeFiles = [
            'routes/tori-route-act1.js',
            'routes/tori-route-act2.js',
            'routes/tori-route-act3.js',
            'routes/tori-route-act4.js',
        ];

        try {
            for (const file of routeFiles) {
                await this.reloadModule(file);
            }

            console.log('✅ Hot Reload: All routes reloaded successfully');
            alert('Routes reloaded! Changes will take effect on next scene.');
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('❌ Hot Reload failed:', error);
            alert(`Hot Reload failed: ${errorMessage}`);
            return false;
        }
    }

    /**
     * Reload only the currently active route.
     * V1 Parity: hot-reload-system.js lines 54-78
     */
    public async reloadCurrentRoute(): Promise<boolean> {
        const currentRoute = this.game.currentRoute;
        if (!currentRoute) {
            alert('No route currently active');
            return false;
        }

        console.log(`🔄 Hot Reload: Reloading current route...`);

        try {
            // Determine which route file to reload based on current route
            const routeName = currentRoute.name || 'tori-route';
            const routeFile = `routes/${routeName}-act1.js`; // Simplified

            await this.reloadModule(routeFile);

            console.log('✅ Hot Reload: Current route reloaded');
            alert('Current route reloaded!');
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('❌ Hot Reload failed:', error);
            alert(`Hot Reload failed: ${errorMessage}`);
            return false;
        }
    }

    /**
     * Reload a specific module with cache busting.
     * V1 Parity: hot-reload-system.js lines 80-104
     */
    public async reloadModule(modulePath: string): Promise<unknown> {
        this.reloadCount++;
        const cacheBuster = `?reload=${this.reloadCount}&t=${Date.now()}`;
        const fullPath = `../${modulePath}${cacheBuster}`;

        console.log(`  Reloading: ${modulePath}`);

        try {
            // Dynamic import with cache busting
            const module = await import(fullPath);

            // Store module reference
            this.loadedModules.set(modulePath, {
                module,
                timestamp: Date.now(),
                reloadCount: this.reloadCount,
            });

            console.log(`  ✓ Loaded: ${modulePath}`);
            return module;
        } catch (error) {
            console.error(`  ✗ Failed: ${modulePath}`, error);
            throw error;
        }
    }

    // ========================================
    // RELOAD SYSTEMS
    // V1 Parity: hot-reload-system.js lines 110-136
    // ========================================

    /**
     * Reload a core system module.
     * V1 Parity: Exact logic preserved
     */
    public async reloadSystem(systemName: string): Promise<boolean> {
        const systemFiles: Record<string, string> = {
            tether: 'system/tether-system.js',
            state: 'system/state-manager.js',
            ui: 'system/ui-controller.js',
            scene: 'system/scene-renderer.js',
        };

        const file = systemFiles[systemName];
        if (!file) {
            alert(`Unknown system: ${systemName}`);
            return false;
        }

        console.log(`🔄 Hot Reload: Reloading ${systemName} system...`);

        try {
            await this.reloadModule(file);
            console.log(`✅ Hot Reload: ${systemName} system reloaded`);
            alert(`${systemName} system reloaded! May require page refresh for full effect.`);
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`❌ Hot Reload failed:`, error);
            alert(`Hot Reload failed: ${errorMessage}`);
            return false;
        }
    }

    // ========================================
    // UTILITIES
    // V1 Parity: hot-reload-system.js lines 142-154
    // ========================================

    /**
     * Get list of all loaded modules with metadata.
     * V1 Parity: Exact format preserved
     */
    public getLoadedModules(): ModuleSummary[] {
        return Array.from(this.loadedModules.entries()).map(([path, data]) => ({
            path,
            timestamp: new Date(data.timestamp).toLocaleTimeString(),
            reloadCount: data.reloadCount,
        }));
    }

    /**
     * Clear all loaded module cache.
     * V1 Parity: hot-reload-system.js lines 150-154
     */
    public clearCache(): void {
        this.loadedModules.clear();
        this.reloadCount = 0;
        console.log('🗑️ Hot Reload: Cache cleared');
    }

    // ========================================
    // DEV SUITE INTEGRATION
    // V1 Parity: hot-reload-system.js lines 160-200
    // ========================================

    /**
     * Show interactive reload menu (prompt-based).
     * V1 Parity: Exact menu preserved
     */
    public showReloadMenu(): void {
        const options = [
            '1. Reload All Routes',
            '2. Reload Current Route',
            '3. Reload Tether System',
            '4. Reload UI System',
            '5. Show Loaded Modules',
            '6. Clear Cache',
            '',
            'Enter number (or Cancel):',
        ].join('\n');

        const choice = prompt(options);

        switch (choice) {
            case '1':
                this.reloadAllRoutes();
                break;
            case '2':
                this.reloadCurrentRoute();
                break;
            case '3':
                this.reloadSystem('tether');
                break;
            case '4':
                this.reloadSystem('ui');
                break;
            case '5':
                {
                    const modules = this.getLoadedModules();
                    console.table(modules);
                    alert(`Loaded ${modules.length} modules. See console for details.`);
                }
                break;
            case '6':
                this.clearCache();
                alert('Cache cleared!');
                break;
            default:
                // Cancelled
                break;
        }
    }
}
