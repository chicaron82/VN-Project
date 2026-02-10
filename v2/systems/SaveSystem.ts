import type { StateManager } from '@core/StateManager';
import type { EventBus } from '@core/EventBus';
import { GameConfig } from '@core/GameConfig';
import type { GameState } from '@core/types';
import { Logger } from '@utils/Logger';

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
 * Auto-save configuration
 */
interface AutoSaveConfig {
    enabled: boolean;
    throttleMs: number;        // Minimum time between auto-saves (30 seconds)
    intervalMs: number;        // Time-based auto-save interval (5 minutes)
    primarySlot: number;       // Primary auto-save slot
    backupSlot: number;        // Backup slot for recovery
}

/**
 * SaveSystem
 *
 * Manages game persistence to localStorage.
 * Handles slots, auto-save (slots 0 and -1 for backup), and version checks.
 *
 * Auto-save triggers:
 * - On scene load (throttled)
 * - On choice selection
 * - On note collection
 * - Every 5 minutes if state is dirty
 */
export class SaveSystem {
    private stateManager: StateManager;
    private eventBus: EventBus;
    private readonly SLOT_PREFIX = GameConfig.SAVE.STORAGE_KEY_PREFIX;

    // Auto-save state
    private autoSaveConfig: AutoSaveConfig = {
        enabled: true,
        throttleMs: 30000,      // 30 seconds minimum between auto-saves
        intervalMs: 300000,     // 5 minutes
        primarySlot: 0,         // Auto-save primary
        backupSlot: -1          // Auto-save backup (dual backup system)
    };

    private lastAutoSaveTime: number = 0;
    private isDirty: boolean = false;
    private isSaving: boolean = false;
    private intervalTimer: ReturnType<typeof setInterval> | null = null;

    constructor(stateManager: StateManager, eventBus: EventBus) {
        this.stateManager = stateManager;
        this.eventBus = eventBus;
    }

    init(): void {
        this.setupAutoSaveListeners();
        this.startIntervalAutoSave();
        Logger.save('Initialized with auto-save (30s throttle, 5min interval)');
    }

    /**
     * Setup event listeners for auto-save triggers
     */
    private setupAutoSaveListeners(): void {
        // Scene load - trigger auto-save (throttled)
        this.eventBus.on('scene:load', (data: { sceneId: string }) => {
            this.triggerAutoSave(data.sceneId, 'scene_load');
        });

        // Choice selection - mark dirty and trigger
        this.eventBus.on('choice:selected', () => {
            this.markDirty('choice');
            this.triggerAutoSave(this.getCurrentSceneId(), 'choice');
        });

        // Note collection - mark dirty and trigger
        this.eventBus.on('note:collected', () => {
            this.markDirty('note');
            this.triggerAutoSave(this.getCurrentSceneId(), 'note_collected');
        });

        // Tether changes - mark dirty (but don't trigger immediate save)
        this.eventBus.on('tether:change', () => {
            this.markDirty('tether');
        });
    }

    /**
     * Start the interval-based auto-save (every 5 minutes if dirty)
     */
    private startIntervalAutoSave(): void {
        if (this.intervalTimer) {
            clearInterval(this.intervalTimer);
        }

        this.intervalTimer = setInterval(() => {
            if (this.autoSaveConfig.enabled && this.isDirty && this.canAutoSave()) {
                const sceneId = this.getCurrentSceneId();
                if (sceneId) {
                    this.performAutoSave(sceneId, 'interval');
                }
            }
        }, this.autoSaveConfig.intervalMs);
    }

    /**
     * Get current scene ID from state
     */
    private getCurrentSceneId(): string {
        const state = this.stateManager.getAll() as unknown as GameState;
        return state?.currentScene || '';
    }

    /**
     * Mark state as dirty (needs saving)
     */
    private markDirty(reason: string): void {
        this.isDirty = true;
        Logger.save(`State marked dirty: ${reason}`);
    }

    /**
     * Check if auto-save can proceed (throttle check)
     */
    private canAutoSave(): boolean {
        if (!this.autoSaveConfig.enabled) return false;
        if (this.isSaving) return false;

        const now = Date.now();
        const elapsed = now - this.lastAutoSaveTime;

        return elapsed >= this.autoSaveConfig.throttleMs;
    }

    /**
     * Trigger an auto-save with throttling
     */
    private async triggerAutoSave(sceneId: string, reason: string): Promise<void> {
        // Skip non-gameplay scenes
        if (!sceneId || sceneId === 'main_menu' || sceneId === 'splash' || sceneId === 'credits') {
            return;
        }

        if (!this.canAutoSave()) {
            Logger.save(`Auto-save throttled (reason: ${reason})`);
            return;
        }

        this.performAutoSave(sceneId, reason);
    }

    /**
     * Perform the actual auto-save operation
     */
    private async performAutoSave(sceneId: string, reason: string): Promise<boolean> {
        if (this.isSaving) return false;

        this.isSaving = true;
        this.eventBus.emit('autosave:start', { reason });

        Logger.save(`Auto-saving (reason: ${reason}, scene: ${sceneId})`);

        try {
            // Rotate backup: copy primary to backup before saving
            await this.rotateBackup();

            // Perform the save
            const success = await this.saveGame(
                this.autoSaveConfig.primarySlot,
                `Auto-save: ${sceneId}`
            );

            if (success) {
                this.lastAutoSaveTime = Date.now();
                this.isDirty = false;
                Logger.save('Auto-save completed successfully');
            }

            this.eventBus.emit('autosave:complete', {
                success,
                slot: this.autoSaveConfig.primarySlot
            });

            return success;

        } catch (error) {
            Logger.error('[SaveSystem] Auto-save failed:', error);
            this.eventBus.emit('autosave:complete', {
                success: false,
                slot: this.autoSaveConfig.primarySlot
            });
            return false;

        } finally {
            this.isSaving = false;
        }
    }

    /**
     * Rotate backup: copy primary auto-save to backup slot
     * This provides a second recovery point if the primary becomes corrupted
     */
    private async rotateBackup(): Promise<void> {
        try {
            const primaryKey = `${this.SLOT_PREFIX}${this.autoSaveConfig.primarySlot}`;
            const backupKey = `${this.SLOT_PREFIX}${this.autoSaveConfig.backupSlot}`;

            const primaryData = localStorage.getItem(primaryKey);
            if (primaryData) {
                localStorage.setItem(backupKey, primaryData);
                Logger.save('Backup rotated');
            }
        } catch (error) {
            Logger.warn('[SaveSystem] Backup rotation failed:', error);
        }
    }

    /**
     * Public method to get auto-save slot data (for Continue button)
     */
    public getAutoSave(): SaveSlot | null {
        const metadata = this.getSlotMetadata(this.autoSaveConfig.primarySlot);
        if (!metadata) return null;

        const key = `${this.SLOT_PREFIX}${this.autoSaveConfig.primarySlot}`;
        const raw = localStorage.getItem(key);
        if (!raw) return null;

        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

    /**
     * Check if auto-save exists (for showing Continue button)
     */
    public hasAutoSave(): boolean {
        return this.hasSlot(this.autoSaveConfig.primarySlot);
    }

    /**
     * Load from auto-save slot
     */
    public async loadAutoSave(): Promise<boolean> {
        return this.loadGame(this.autoSaveConfig.primarySlot);
    }

    /**
     * Load from backup auto-save slot (recovery)
     */
    public async loadBackupAutoSave(): Promise<boolean> {
        return this.loadGame(this.autoSaveConfig.backupSlot);
    }

    /**
     * Enable/disable auto-save
     */
    public setAutoSaveEnabled(enabled: boolean): void {
        this.autoSaveConfig.enabled = enabled;
        Logger.save(`Auto-save ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Force an immediate auto-save (bypasses throttle)
     */
    public async forceAutoSave(): Promise<boolean> {
        const sceneId = this.getCurrentSceneId();
        if (!sceneId) return false;

        // Temporarily bypass throttle
        const originalThrottle = this.autoSaveConfig.throttleMs;
        this.autoSaveConfig.throttleMs = 0;

        const result = await this.performAutoSave(sceneId, 'forced');

        this.autoSaveConfig.throttleMs = originalThrottle;
        return result;
    }

    /**
     * Get auto-save status for debugging
     */
    public getAutoSaveStatus(): {
        enabled: boolean;
        isDirty: boolean;
        isSaving: boolean;
        lastSaveTime: number;
        timeSinceLastSave: number;
        canSave: boolean;
    } {
        return {
            enabled: this.autoSaveConfig.enabled,
            isDirty: this.isDirty,
            isSaving: this.isSaving,
            lastSaveTime: this.lastAutoSaveTime,
            timeSinceLastSave: Date.now() - this.lastAutoSaveTime,
            canSave: this.canAutoSave()
        };
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

            // Only emit save:complete for manual saves (non-auto slots)
            if (slotId > 0) {
                this.eventBus.emit('save:complete', { slot: slotId });
            }
            Logger.save(`Saved to slot ${slotId}`);
            return true;

        } catch (_e) {
            Logger.error('[SaveSystem] Save failed', _e);
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
                Logger.warn(`[SaveSystem] No save found in slot ${slotId}`);
                return false;
            }

            const saveSlot: SaveSlot = JSON.parse(raw);

            // Version Check
            if (saveSlot.metadata.version !== GameConfig.SAVE.VERSION) {
                Logger.warn(`[SaveSystem] Version mismatch: Save v${saveSlot.metadata.version} vs Game v${GameConfig.SAVE.VERSION}`);
                // Add migration logic here in future
            }

            // Restore State
            if (this.isValidGameState(saveSlot.data)) {
                const restored = saveSlot.data as unknown as GameState;

                // Restore state using setAll (replaces entire state)
                this.stateManager.setAll(restored as unknown as Record<string, unknown>);
                Logger.save(`Loaded from slot ${slotId}`);
                return true;
            } else {
                Logger.error(`[SaveSystem] Load failed: Invalid game state in slot ${slotId}`, saveSlot.data);
                return false;
            }

        } catch (_e) {
            Logger.error('[SaveSystem] Load failed', _e);
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
        } catch {
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

    private isValidGameState(data: unknown): data is GameState {
        const d = data as Record<string, unknown>;
        return (
            !!data &&
            typeof d.currentScene === 'string' &&
            typeof d.tetherLevel === 'number' &&
            typeof d.flags === 'object'
        );
    }

    /**
     * Cleanup on destroy
     */
    public destroy(): void {
        if (this.intervalTimer) {
            clearInterval(this.intervalTimer);
            this.intervalTimer = null;
        }
    }
}
