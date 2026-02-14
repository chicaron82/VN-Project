import { ContentLoader } from '@systems/ContentLoader';
import type { GameEngine } from '@core/GameEngine';

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

    describe('Asset Path Normalization', () => {
        it('should normalize background paths from assets/ to ../assets/', () => {
            const mockData = {
                scenes: [{
                    id: 'bg_test',
                    text: 'test',
                    background: 'assets/apartment.png'
                }]
            };

            loader.parseAndRegister(mockData);

            expect(engine.registerScene).toHaveBeenCalledWith(
                expect.objectContaining({ background: '../assets/apartment.png' })
            );
        });

        it('should normalize sprite paths from assets/ to ../assets/', () => {
            const mockData = {
                scenes: [{
                    id: 'sprite_test',
                    text: 'test',
                    sprites: {
                        left: 'assets/full-sprite-ronnie.webp',
                        right: 'assets/full-sprite-tori.webp'
                    }
                }]
            };

            loader.parseAndRegister(mockData);

            expect(engine.registerScene).toHaveBeenCalledWith(
                expect.objectContaining({
                    sprites: expect.arrayContaining([
                        expect.objectContaining({ variant: '../assets/full-sprite-ronnie.webp' }),
                        expect.objectContaining({ variant: '../assets/full-sprite-tori.webp' })
                    ])
                })
            );
        });

        it('should not double-prefix paths already starting with ../', () => {
            const mockData = {
                scenes: [{
                    id: 'already_prefixed',
                    text: 'test',
                    background: '../assets/apartment.png',
                    sprites: { left: '../assets/full-sprite-ronnie.webp' }
                }]
            };

            loader.parseAndRegister(mockData);

            expect(engine.registerScene).toHaveBeenCalledWith(
                expect.objectContaining({
                    background: '../assets/apartment.png',
                    sprites: expect.arrayContaining([
                        expect.objectContaining({ variant: '../assets/full-sprite-ronnie.webp' })
                    ])
                })
            );
        });

        it('should leave absolute or other paths unchanged', () => {
            const mockData = {
                scenes: [{
                    id: 'abs_path',
                    text: 'test',
                    background: '/images/bg.png'
                }]
            };

            loader.parseAndRegister(mockData);

            expect(engine.registerScene).toHaveBeenCalledWith(
                expect.objectContaining({ background: '/images/bg.png' })
            );
        });
    });
});
