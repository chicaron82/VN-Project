import { StateManager } from '@core/StateManager';
import { EventBus } from '@core/EventBus';
import { GameConfig } from '@core/GameConfig';
import { GameState } from '@core/types';

export interface SaveMetadata {
    slotId: number;
    timestamp: number;
    version: number;
    sceneId: string;
    playtime: number;
    summary: string; // Brief line like "Tori - Chapter 1"
}

export interface SaveSlot {
    metadata: SaveMetadata;
    data: GameState;
}

/**
 * SaveSystem
 * 
 * Manages game persistence to localStorage.
 * Handles slots, auto-save (slot 0), and version checks.
 */
export class SaveSystem {
    private stateManager: StateManager;
    private eventBus: EventBus;
    private readonly SLOT_PREFIX = GameConfig.SAVE.STORAGE_KEY_PREFIX;

    constructor(stateManager: StateManager, eventBus: EventBus) {
        this.stateManager = stateManager;
        this.eventBus = eventBus;
    }

    init() {
        // Listen for scene load to trigger auto-save
        this.eventBus.on('scene:load', (data: { sceneId: string }) => {
            this.autoSave(data.sceneId);
        });
    }

    /**
     * Auto-save current game state (Slot 0)
     */
    async autoSave(currentSceneId: string): Promise<boolean> {
        // Don't auto-save on menu screens or non-gameplay scenes
        if (currentSceneId === 'main_menu' || currentSceneId === 'splash' || currentSceneId === 'credits') {
            return false;
        }

        console.log(`💾 Auto-saving at scene: ${currentSceneId}`);
        return this.saveGame(0, `Auto-save: ${currentSceneId}`);
    }



    /**
     * Save current game state to a slot
     */
    async saveGame(slotId: number, summary: string = ''): Promise<boolean> {
        try {
            const currentState = this.stateManager.getAll() as unknown as GameState;

            const metadata: SaveMetadata = {
                slotId,
                timestamp: Date.now(),
                version: GameConfig.SAVE.VERSION,
                sceneId: currentState.currentScene,
                playtime: currentState.playtime || 0,
                summary: summary || `Scene: ${currentState.currentScene}`
            };

            const saveSlot: SaveSlot = {
                metadata,
                data: currentState
            };

            const key = `${this.SLOT_PREFIX}${slotId}`;
            localStorage.setItem(key, JSON.stringify(saveSlot));

            this.eventBus.emit('save:complete', { slot: slotId });
            console.log(`💾 Saved to slot ${slotId}`);
            return true;

        } catch (e) {
            console.error('Save failed', e);
            return false;
        }
    }

    /**
     * Load game state from a slot
     */
    async loadGame(slotId: number): Promise<boolean> {
        try {
            const key = `${this.SLOT_PREFIX}${slotId}`;
            const raw = localStorage.getItem(key);

            if (!raw) {
                console.warn(`No save found in slot ${slotId}`);
                return false;
            }

            const saveSlot: SaveSlot = JSON.parse(raw);

            // Version Check
            if (saveSlot.metadata.version !== GameConfig.SAVE.VERSION) {
                console.warn(`Version mismatch: Save v${saveSlot.metadata.version} vs Game v${GameConfig.SAVE.VERSION}`);
                // Add migration logic here in future
            }

            // Restore State
            // this.stateManager.setAll(saveSlot.data); // Original line
            // Emit generic load event effectively via state change, but maybe explicit one?
            // GameEngine handles 'scene:load' when it detects change, or we can explicit call engine.loadScene...
            // Ideally, simple state restoration is enough, but GameEngine might need to 'react' to the scene change.
            if (this.isValidGameState(saveSlot.data)) {
                const restored = saveSlot.data as unknown as GameState;

                // Restore state using setAll (replaces entire state)
                this.stateManager.setAll(restored as unknown as Record<string, unknown>);
                console.log(`📂 Loaded from slot ${slotId}`); // Changed 'slot' to 'slotId'
                return true;
            } else {
                console.error(`Load failed: Invalid game state in slot ${slotId}`, saveSlot.data);
                return false;
            }

        } catch (e) {
            console.error('Load failed', e);
            return false;
        }
    }

    /**
     * Get metadata for all Save Slots
     */
    getSlots(): Map<number, SaveMetadata | null> {
        const slots = new Map<number, SaveMetadata | null>();

        // Auto save is slot 0
        // Manual slots 1..MAX
        for (let i = 1; i <= GameConfig.SAVE.MAX_SLOTS; i++) {
            slots.set(i, this.getSlotMetadata(i));
        }

        return slots;
    }

    /**
     * Get metadata for specific slot
     */
    getSlotMetadata(slotId: number): SaveMetadata | null {
        const key = `${this.SLOT_PREFIX}${slotId}`;
        const raw = localStorage.getItem(key);
        if (!raw) return null;

        try {
            const slot: SaveSlot = JSON.parse(raw);
            return slot.metadata;
        } catch (e) {
            return null; // Corrupt
        }
    }

    /**
     * Delete a save slot
     */
    deleteSlot(slotId: number): void {
        localStorage.removeItem(`${this.SLOT_PREFIX}${slotId}`);
    }

    /**
     * Check if a slot exists
     */
    hasSlot(slotId: number): boolean {
        return !!this.getSlotMetadata(slotId);
    }

    private isValidGameState(data: any): data is GameState {
        return (
            data &&
            typeof data.currentScene === 'string' &&
            typeof data.tetherLevel === 'number' &&
            typeof data.flags === 'object'
        );
    }
}
