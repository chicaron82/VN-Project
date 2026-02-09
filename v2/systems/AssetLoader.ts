import { EventBus } from '@core/EventBus';
import { GameConfig } from '@core/GameConfig';
import { Logger } from '@utils/Logger';

/**
 * AssetLoader
 * 
 * Handles preloading of game assets (images mostly).
 * Emits progress events for loading screens.
 */
export class AssetLoader {
    private eventBus: EventBus;
    private cache: Map<string, HTMLImageElement>;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.cache = new Map();
    }

    /**
     * Preload a list of assets
     */
    async preload(urls: string[]): Promise<void> {
        const total = urls.length;
        let loaded = 0;

        this.eventBus.emit('loading:start', { total });

        const promises = urls.map(url => this.loadImage(url).then(() => {
            loaded++;
            this.eventBus.emit('loading:progress', { current: loaded, total, file: url });
        }).catch(err => {
            Logger.warn(`Failed to preload: ${url}`, err);
            // Still count as loaded to avoid hanging
            loaded++;
            this.eventBus.emit('loading:progress', { current: loaded, total, file: url });
        }));

        await Promise.all(promises);
        this.eventBus.emit('loading:complete', { total });
    }

    /**
     * Get a random loading tip
     */
    getRandomTip(): string {
        const tips = GameConfig.LOADING_TIPS;
        return tips[Math.floor(Math.random() * tips.length)] ?? 'Loading...';
    }

    /**
     * Load Key Assets (defined in config)
     */
    async loadCriticalAssets(): Promise<void> {
        // Collect critical assets from Config
        const critical: string[] = [
            ...Object.values(GameConfig.ASSETS.backgrounds),
            ...Object.values(GameConfig.ASSETS.sprites),
            ...Object.values(GameConfig.ASSETS.ui),
            ...GameConfig.ASSETS.PRELOAD.IMAGES.map(f => `assets/${f}`) // Adjust path logic as needed
        ];

        // Filter duplicates
        const unique = Array.from(new Set(critical));

        await this.preload(unique);
    }

    /**
     * Clear the image cache
     */
    clearCache(): void {
        this.cache.clear();
    }

    // Internal image loader
    private loadImage(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            if (this.cache.has(url)) {
                resolve(this.cache.get(url)!);
                return;
            }

            const img = new Image();
            img.onload = () => {
                this.cache.set(url, img);
                resolve(img);
            };
            img.onerror = (e) => reject(e);
            img.src = url;
        });
    }
}
