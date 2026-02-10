import { GameEngine } from './GameEngine';
import { EventBus } from './EventBus';
import { StateManager } from './StateManager';
import type { Scene } from './types';

describe('GameEngine', () => {
    let engine: GameEngine;
    let eventBus: EventBus;
    let stateManager: StateManager;

    beforeEach(() => {
        eventBus = new EventBus();
        stateManager = new StateManager();

        engine = new GameEngine(eventBus, stateManager);
    });

    it('should initialize', async () => {
        await engine.init();
        // Private property check would need casting or public getter
        // For now just ensure no throw
        expect(true).toBe(true);
    });

    it('should register and retrieve scenes', () => {
        const scene: Scene = { id: 'test_scene', dialog: [] };
        engine.registerScene(scene);
        expect(engine.getScene('test_scene')).toBe(scene);
    });

    it('should load a scene and update state', async () => {
        const scene: Scene = { id: 'test_scene', dialog: [] };
        engine.registerScene(scene);

        // Subscribe to event
        const loadSpy = vi.fn();
        eventBus.on('scene:load', loadSpy);

        await engine.loadScene('test_scene');

        expect(stateManager.get('currentScene')).toBe('test_scene');
        expect(loadSpy).toHaveBeenCalledWith({ sceneId: 'test_scene' });
    });

    it('should handle scene not found gracefully', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        await engine.loadScene('missing_scene');
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
