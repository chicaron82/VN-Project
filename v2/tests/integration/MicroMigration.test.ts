import { GameEngine } from '@core/GameEngine';
import { EventBus } from '@core/EventBus';
import { StateManager } from '@core/StateManager';
import { HapticSystem } from '@systems/HapticSystem';
import { SaveSystem } from '@systems/SaveSystem';
import { SettingsSystem } from '@systems/SettingsSystem';
import type { Scene } from '@core/types';
import migrationScene from '../../content/routes/micro_migration_scene.json';

describe('Micro-Migration Integration', () => {
    let engine: GameEngine;
    let eventBus: EventBus;
    let stateManager: StateManager;
    let hapticSystem: HapticSystem;
    let saveSystem: SaveSystem;
    let settingsSystem: SettingsSystem;

    beforeEach(() => {
        // Mock Storage
        const storage: Record<string, string> = {};
        vi.stubGlobal('localStorage', {
            getItem: vi.fn((key) => storage[key] || null),
            setItem: vi.fn((key, val) => { storage[key] = val; }),
            removeItem: vi.fn((key) => { delete storage[key]; }),
            clear: vi.fn()
        });
        // Mock Navigator
        global.navigator = { vibrate: vi.fn() } as any;

        eventBus = new EventBus();
        stateManager = new StateManager(eventBus);
        settingsSystem = new SettingsSystem(stateManager); // Needed for haptic system
        settingsSystem.init();

        hapticSystem = new HapticSystem(eventBus, settingsSystem);
        saveSystem = new SaveSystem(stateManager, eventBus);
        engine = new GameEngine(eventBus, stateManager);
    });

    it('should verify the full lifecycle of the migration scene', async () => {
        // 1. Register the ported scene
        const scene = migrationScene as unknown as Scene;
        engine.registerScene(scene);

        // Initialize minimal GameState requirements
        stateManager.set('flags', {});
        stateManager.set('currentRoute', null);
        stateManager.set('history', []);
        stateManager.set('playtime', 0);

        // 2. Load the scene
        await engine.loadScene(scene.id);

        // Wait for state propagation? With EventBus it should be sync if no timeouts.
        // However, GameEngine usually emits 'scene:load' which StateManager might not be listening to directly 
        // unless via GameEngine logic.
        // Let's force state update if GameEngine relies on external listeners not wired in this test.
        // Wait, Engine constructor implementation takes StateManager.
        // Let's check if loadScene calls stateManager.set().

        // Assuming GameEngine updates state:

        // Verify Initial State
        const state = stateManager.getAll();
        expect(state.currentScene).toBe('v1_migration_test');

        // Verify Tether Impact (Migration scene has -5)
        // Default 100 + (-5) = 95
        expect(state.tetherLevel).toBe(95);

        // 3. Verify Haptics (Scene load doesn't auto-trigger haptics in engine yet, 
        // but we can verify the systems are wired if we were to interact)
        // Let's manually trigger a 'visual:cue' via haptic system to prove integration
        hapticSystem.triggerSensory('toriHop');
        expect(navigator.vibrate).toHaveBeenCalled(); // Haptic fired

        // 4. Save Game
        const saveSuccess = await saveSystem.saveGame(1, 'Migration Test');
        expect(saveSuccess).toBe(true);

        // 5. Clear State (Simulate restart)
        // 5. Clear State (Simulate restart)
        stateManager.setAll({} as any);
        expect(stateManager.getAll().currentScene).toBeUndefined();

        // 6. Load Game
        const loadSuccess = await saveSystem.loadGame(1);
        expect(loadSuccess).toBe(true);

        // 7. Verify Restored State
        const restored = stateManager.getAll();
        expect(restored.currentScene).toBe('v1_migration_test');
        expect(restored.tetherLevel).toBe(95);

        console.log('✅ Micro-migration verification successful!');
    });
});
