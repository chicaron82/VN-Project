import { Scene } from '@core/types';
import { GameEngine } from '@core/GameEngine';

export class ContentLoader {
    private engine: GameEngine;

    constructor(engine: GameEngine) {
        this.engine = engine;
    }

    private routeCache: Map<string, any> = new Map();

    /**
     * Load a route file (JSON)
     * In a real browser env, this would verify fetch.
     * In Node/Test, we might need a file reader override.
     */
    async loadRoute(routePath: string): Promise<void> {
        try {
            // Check cache first
            if (this.routeCache.has(routePath)) {
                this.parseAndRegister(this.routeCache.get(routePath));
                return;
            }

            // For V2 (Vite), we might use import() or fetch
            // Since these are static JSON files in src/content/routes,
            // we can use dynamic import if they are bundled, or fetch if they are assets.
            // For now, let's assume they are fetchable assets in public/ or imported via glob in main.

            // NOTE: In the current test setup without a real browser/server, 
            // we will need to mock this or use a strictly typed map in a real app.
            // BUT for the sake of the 'refine tooling' task, let's pretend we fetch.

            const response = await fetch(routePath);
            if (!response.ok) throw new Error(`Failed to fetch ${routePath}`);

            const data = await response.json();

            // Cache the raw data
            this.routeCache.set(routePath, data);

            this.parseAndRegister(data);
        } catch (e) {
            console.error('Failed to load route:', e);
            throw e;
        }
    }

    /**
     * Clear the route cache to free memory or force reload
     */
    clearCache(): void {
        this.routeCache.clear();
    }

    /**
     * Parse raw JSON data and register scenes
     */
    parseAndRegister(data: { scenes: any[] }) {
        if (!data.scenes || !Array.isArray(data.scenes)) {
            console.error('Invalid route data format: missing scenes array');
            return;
        }

        data.scenes.forEach(sceneData => {
            // Validate match with Scene interface
            const scene: Scene = {
                id: sceneData.id,
                type: sceneData.type || 'dialog',
                character: sceneData.character,
                text: sceneData.text,
                internal: sceneData.internal,
                background: sceneData.background,
                sprites: sceneData.sprites,
                choices: sceneData.choices?.map((c: any) => ({
                    text: c.text,
                    next: c.nextSceneId,
                    condition: c.validation, // Mapping validation to condition
                    tetherCost: c.tetherCost,
                    flags: c.flags
                })),
                flags: sceneData.flags,
            };

            this.engine.registerScene(scene);
        });
    }
}
