// ========================================
// HOT RELOAD SYSTEM - Dynamic script reloading
// Reload route scripts without full page refresh
// ========================================

/**
 * HotReloadSystem - Reload route scripts dynamically
 * 
 * Features:
 * - Reload individual route files
 * - Reload all routes
 * - Cache busting
 * - Preserve game state
 * - Error handling
 */

class HotReloadSystem {
    constructor(devSuite) {
        this.devSuite = devSuite;
        this.game = devSuite.game;
        this.loadedModules = new Map();
        this.reloadCount = 0;
    }

    // ========================================
    // RELOAD ROUTES
    // ========================================

    async reloadAllRoutes() {
        console.log('🔄 Hot Reload: Reloading all routes...');

        const routeFiles = [
            'routes/tori-route-act1.js',
            'routes/tori-route-act2.js',
            'routes/tori-route-act3.js',
            'routes/tori-route-act4.js'
        ];

        try {
            for (const file of routeFiles) {
                await this.reloadModule(file);
            }

            console.log('✅ Hot Reload: All routes reloaded successfully');
            alert('Routes reloaded! Changes will take effect on next scene.');
            return true;
        } catch (error) {
            console.error('❌ Hot Reload failed:', error);
            alert(`Hot Reload failed: ${error.message}`);
            return false;
        }
    }

    async reloadCurrentRoute() {
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
            console.error('❌ Hot Reload failed:', error);
            alert(`Hot Reload failed: ${error.message}`);
            return false;
        }
    }

    async reloadModule(modulePath) {
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
                reloadCount: this.reloadCount
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
    // ========================================

    async reloadSystem(systemName) {
        const systemFiles = {
            'tether': 'system/tether-system.js',
            'state': 'system/state-manager.js',
            'ui': 'system/ui-controller.js',
            'scene': 'system/scene-renderer.js'
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
            console.error(`❌ Hot Reload failed:`, error);
            alert(`Hot Reload failed: ${error.message}`);
            return false;
        }
    }

    // ========================================
    // UTILITIES
    // ========================================

    getLoadedModules() {
        return Array.from(this.loadedModules.entries()).map(([path, data]) => ({
            path,
            timestamp: new Date(data.timestamp).toLocaleTimeString(),
            reloadCount: data.reloadCount
        }));
    }

    clearCache() {
        this.loadedModules.clear();
        this.reloadCount = 0;
        console.log('🗑️ Hot Reload: Cache cleared');
    }

    // ========================================
    // DEV SUITE INTEGRATION
    // ========================================

    showReloadMenu() {
        const options = [
            '1. Reload All Routes',
            '2. Reload Current Route',
            '3. Reload Tether System',
            '4. Reload UI System',
            '5. Show Loaded Modules',
            '6. Clear Cache',
            '',
            'Enter number (or Cancel):'
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
                const modules = this.getLoadedModules();
                console.table(modules);
                alert(`Loaded ${modules.length} modules. See console for details.`);
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

// ========================================
// GLOBAL EXPORT
// ========================================

if (typeof window !== 'undefined') {
    window.HotReloadSystem = HotReloadSystem;
}

export { HotReloadSystem };
