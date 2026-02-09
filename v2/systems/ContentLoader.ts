import { Scene } from '@core/types';
import { GameEngine } from '@core/GameEngine';
import { Logger } from '@utils/Logger';

export class ContentLoader {
    private engine: GameEngine;

    constructor(engine: GameEngine) {
        this.engine = engine;
    }

    private routeCache: Map<string, unknown> = new Map();

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
            Logger.error('Failed to load route:', e);
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
    parseAndRegister(data: unknown): void {
        const scenes = (data as { scenes?: unknown })?.scenes;
        if (!Array.isArray(scenes)) {
            Logger.error('Invalid route data format: missing scenes array');
            return;
        }

        scenes.forEach((sceneDataUnknown) => {
            const sceneData = sceneDataUnknown as Record<string, any>;
            // Convert JSON sprites format { left: "path", right: "path" }
            // to SpriteConfig[] format
            let sprites: Scene['sprites'] = undefined;
            if (sceneData.sprites && typeof sceneData.sprites === 'object') {
                sprites = [];
                for (const [position, path] of Object.entries(sceneData.sprites)) {
                    if (path && (position === 'left' || position === 'right' || position === 'center')) {
                        sprites.push({
                            id: this.extractSpriteId(path as string),
                            position: position as 'left' | 'center' | 'right',
                            variant: path as string // Store full path in variant for now
                        });
                    }
                }
            }

            // Handle effects: JSON can have singular 'effect' or plural 'effects' array
            let effects = sceneData.effects;
            if (!effects && sceneData.effect) {
                // Convert singular effect to array format
                effects = [sceneData.effect];
            }

            // Validate match with Scene interface
            const scene: Scene = {
                id: sceneData.id,
                type: sceneData.type || 'dialog',
                character: sceneData.character,
                text: sceneData.text,
                internal: sceneData.internal,
                background: sceneData.background,
                sprites,
                // Map nextSceneId to next
                next: sceneData.nextSceneId || sceneData.next,
                choices: sceneData.choices?.map((c: any) => ({
                    text: c.text,
                    next: c.nextSceneId || c.next,
                    condition: c.validation || c.condition,
                    tetherCost: c.tetherCost,
                    flags: c.flags
                })),
                flags: sceneData.flags,
                tetherImpact: sceneData.tetherImpact,
                effects,
            };

            this.engine.registerScene(scene);
        });
    }

    /**
     * Extract sprite ID from path (e.g., "assets/full-sprite-tori.webp" -> "tori")
     */
    private extractSpriteId(path: string): string {
        const filename = path.split('/').pop() ?? '';
        // Match patterns like "full-sprite-tori.webp" or "ronnie-sprite.png"
        const match = filename.match(/(?:full-sprite-|sprite-)?([\w-]+)\.(png|webp)/);
        return match?.[1] ?? 'unknown';
    }
}
