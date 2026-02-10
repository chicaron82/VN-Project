import { SaveSystem } from './SaveSystem';
import { StateManager } from '@core/StateManager';
import { EventBus } from '@core/EventBus';
import { GameConfig } from '@core/GameConfig';

describe('SaveSystem', () => {
    let saveSystem: SaveSystem;
    let stateManager: StateManager;
    let eventBus: EventBus;

    beforeEach(() => {
        // Mock localStorage
        const storage: Record<string, string> = {};
        vi.stubGlobal('localStorage', {
            getItem: vi.fn((key) => storage[key] || null),
            setItem: vi.fn((key, val) => { storage[key] = val; }),
            removeItem: vi.fn((key) => { delete storage[key]; }),
        });

        eventBus = new EventBus();
        stateManager = new StateManager();
        saveSystem = new SaveSystem(stateManager, eventBus);

        // Setup initial state
        stateManager.setAll({
            currentScene: 'test_scene',
            tetherLevel: 100,
            currentRoute: null,
            playtime: 100,
            flags: { testFlag: true },
            history: []
        });
    });

    it('should save game state to a slot', async () => {
        const success = await saveSystem.saveGame(1, 'Test Save');
        expect(success).toBe(true);

        // Verify storage
        const key = `${GameConfig.SAVE.STORAGE_KEY_PREFIX}1`;
        expect(localStorage.setItem).toHaveBeenCalledWith(key, expect.any(String));
    });

    it('should load game state from a slot', async () => {
        await saveSystem.saveGame(1, 'Test Save');

        // Clear state
        stateManager.setAll({} as any);

        const success = await saveSystem.loadGame(1);
        expect(success).toBe(true);

        const restored = stateManager.getAll();
        expect(restored.currentScene).toBe('test_scene');
        expect(restored.flags.testFlag).toBe(true);
    });

    it('should return valid metadata for existing slots', async () => {
        await saveSystem.saveGame(1, 'Slot 1');
        await saveSystem.saveGame(2, 'Slot 2');

        const slots = saveSystem.getSlots();
        expect(slots.get(1)?.summary).toBe('Slot 1');
        expect(slots.get(2)?.summary).toBe('Slot 2');
        expect(slots.get(3)).toBeNull();
    });

    it('should handle missing slots gracefully', async () => {
        const success = await saveSystem.loadGame(99);
        expect(success).toBe(false);
    });
});
