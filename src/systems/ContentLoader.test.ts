import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContentLoader } from '@systems/ContentLoader';
import { GameEngine } from '@core/GameEngine';

describe('ContentLoader', () => {
    let engine: GameEngine;
    let loader: ContentLoader;
    let fetchSpy: any;

    beforeEach(() => {
        engine = {
            registerScene: vi.fn(),
        } as any;
        loader = new ContentLoader(engine);

        // Mock fetch
        fetchSpy = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ scenes: [] })
        });
        vi.stubGlobal('fetch', fetchSpy);
    });

    it('should load a route and register scenes', async () => {
        const mockData = {
            scenes: [
                { id: 'scene1', text: 'hello' }
            ]
        };
        fetchSpy.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData
        });

        await loader.loadRoute('routes/test.json');

        expect(engine.registerScene).toHaveBeenCalled();
    });

    it('should handle fetch errors', async () => {
        fetchSpy.mockResolvedValueOnce({
            ok: false
        });

        await expect(loader.loadRoute('routes/missing.json')).rejects.toThrow('Failed to fetch');
    });

    it('should cache loaded routes', async () => {
        // First load
        await loader.loadRoute('routes/once.json');
        expect(fetchSpy).toHaveBeenCalledTimes(1);

        // Second load - should hit cache
        await loader.loadRoute('routes/once.json');
        expect(fetchSpy).toHaveBeenCalledTimes(1); // Call count remains 1
    });
});
