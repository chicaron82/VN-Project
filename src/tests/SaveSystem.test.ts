import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SaveSystem } from '../systems/SaveSystem';
import { StateManager } from '../core/StateManager';
import { EventBus } from '../core/EventBus';
import { GameConfig } from '../core/GameConfig';

describe('SaveSystem', () => {
    let saveSystem: SaveSystem;
    let stateManager: StateManager;
    let eventBus: EventBus;

    beforeEach(() => {
        // Mock StateManager
        stateManager = {
            getAll: vi.fn().mockReturnValue({
                currentScene: 'scene1',
                tetherLevel: 100,
                flags: {},
                history: [],
                playtime: 123
            }),
            setAll: vi.fn(),
            get: vi.fn(),
            set: vi.fn()
        } as unknown as StateManager;

        // Mock EventBus
        eventBus = {
            on: vi.fn(),
            emit: vi.fn(),
            off: vi.fn()
        } as unknown as EventBus;

        // Mock localStorage
        const localStorageMock = (() => {
            let store: Record<string, string> = {};
            return {
                getItem: vi.fn((key: string) => store[key] || null),
                setItem: vi.fn((key: string, value: string) => {
                    store[key] = value.toString();
                }),
                removeItem: vi.fn((key: string) => {
                    delete store[key];
                }),
                clear: vi.fn(() => {
                    store = {};
                })
            };
        })();

        Object.defineProperty(global, 'localStorage', {
            value: localStorageMock
        });

        saveSystem = new SaveSystem(stateManager, eventBus);
        saveSystem.init();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Auto-save', () => {
        it('should auto-save to slot 0 when autoSave is called with valid scene', async () => {
            await saveSystem.autoSave('scene2_intro');

            expect(localStorage.setItem).toHaveBeenCalledWith(
                expect.stringContaining('slot0'),
                expect.stringContaining('scene2_intro')
            );
        });

        it('should NOT auto-save on main_menu', async () => {
            await saveSystem.autoSave('main_menu');
            expect(localStorage.setItem).not.toHaveBeenCalled();
        });

        it('should NOT auto-save on splash', async () => {
            await saveSystem.autoSave('splash');
            expect(localStorage.setItem).not.toHaveBeenCalled();
        });

        it('should trigger on scene:load event', () => {
            // Verify that init listener was registered
            expect(eventBus.on).toHaveBeenCalledWith('scene:load', expect.any(Function));

            // Extract the callback and call it
            const callback = (eventBus.on as any).mock.calls.find((call: any[]) => call[0] === 'scene:load')[1];

            // Spy on autoSave
            const autoSaveSpy = vi.spyOn(saveSystem, 'autoSave');

            callback({ sceneId: 'test_scene' });
            expect(autoSaveSpy).toHaveBeenCalledWith('test_scene');
        });
    });

    describe('Manual Save/Load', () => {
        it('should save to specified slot', async () => {
            await saveSystem.saveGame(1, 'Manual Save');
            expect(localStorage.setItem).toHaveBeenCalledWith(
                expect.stringContaining('slot1'),
                expect.stringContaining('Manual Save')
            );
        });

        it('should load from specified slot', async () => {
            // Setup mock data
            const mockSave = {
                metadata: { version: GameConfig.SAVE.VERSION },
                data: { currentScene: 'scene_loaded', tetherLevel: 50, flags: {} }
            };
            (localStorage.getItem as any).mockReturnValue(JSON.stringify(mockSave));

            const success = await saveSystem.loadGame(1);

            expect(success).toBe(true);
            expect(stateManager.setAll).toHaveBeenCalledWith(expect.objectContaining({
                currentScene: 'scene_loaded'
            }));
        });

        it('should fail to load if slot empty', async () => {
            (localStorage.getItem as any).mockReturnValue(null);
            const success = await saveSystem.loadGame(99);
            expect(success).toBe(false);
        });
    });
});
