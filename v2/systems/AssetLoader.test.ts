import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssetLoader } from './AssetLoader';
import { EventBus } from '@core/EventBus';

describe('AssetLoader', () => {
    let loader: AssetLoader;
    let eventBus: EventBus;

    beforeEach(() => {
        // Mock Image
        global.Image = class {
            onload: any;
            onerror: any;
            src: string = '';
            constructor() {
                setTimeout(() => this.onload && this.onload(), 10); // Simulate async load
            }
        } as any;

        eventBus = new EventBus();
        loader = new AssetLoader(eventBus);
    });

    it('should emit progress events during preload', async () => {
        const progressSpy = vi.fn();
        const completeSpy = vi.fn();

        eventBus.on('loading:progress', progressSpy);
        eventBus.on('loading:complete', completeSpy);

        const assets = ['image1.png', 'image2.png'];
        await loader.preload(assets);

        expect(progressSpy).toHaveBeenCalledTimes(2);
        expect(progressSpy).toHaveBeenCalledWith(expect.objectContaining({ current: 1 }));
        expect(progressSpy).toHaveBeenCalledWith(expect.objectContaining({ current: 2 }));
        expect(completeSpy).toHaveBeenCalledWith({ total: 2 });
    });

    it('should return a random loading tip', () => {
        const tip = loader.getRandomTip();
        expect(typeof tip).toBe('string');
        expect(tip.length).toBeGreaterThan(0);
    });
});
