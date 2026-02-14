import type { EventBus } from '@core/EventBus';
import type { StateManager } from '@core/StateManager';
import { Logger } from '@utils/Logger';

import type { SaveData, GameInstance, NoteDiscoveryData, SaveSlotInfo } from './SaveManagerTypes';
import { restoreGameState as _restoreGameState } from './SaveManagerRestore';

// Re-export types for backward compatibility
export type { SaveData } from './SaveManagerTypes';

/**
 * SaveManager - Browser localStorage save/load system
 * V1 Parity Port from save-manager.js (594 lines)
 *
 * Responsibilities:
 * - Save game state (route, act, scene, flags, tether)
 * - Load game state and restore all systems
 * - Auto-save on major story beats
 * - Save file validation and corruption handling
 *
 * DECOMPOSED: Types      → SaveManagerTypes.ts
 *             Restore    → SaveManagerRestore.ts
 *             Orchestrator → this file
 *
 * CRITICAL DEPENDENCY: AutoSaveManager relies on this
 *
 * 848 is sacred. 💚🔥💀
 */

export class SaveManager {
    private game: GameInstance;
    private eventBus: EventBus;
    // @ts-expect-error - StateManager referenced via window.uv7.stateManager pattern
    private stateManager: StateManager;

    // Configuration
    private readonly maxSlots: number = 3;
    private autoSaveEnabled: boolean = true;
    private readonly savePrefix: string = 'v848_save_';
    private readonly autoSaveKey: string = 'v848_autosave';
    private savesBlocked: boolean = false; // Despair can block saves

    // Mutex to prevent race conditions
    private saveInProgress: boolean = false;
    // @ts-expect-error - Reserved for future mutex implementation
    private loadInProgress: boolean = false;

    constructor(game: GameInstance, eventBus: EventBus, stateManager: StateManager) {
        this.game = game;
        this.eventBus = eventBus;
        this.stateManager = stateManager;

        Logger.save('✅ SaveManager initialized');
    }

    // ========================================
    // SAVE FUNCTIONS
    // V1 Parity: lines 48-161
    // ========================================

    /**
     * Save game to slot
     * V1 Parity: Mutex-protected with Despair block check
     */
    public saveGame(slotNumber: number | null, isAutoSave: boolean = false, customLabel: string | null = null): boolean {
        // Mutex: Prevent concurrent save operations
        if (this.saveInProgress) {
            Logger.warn('⚠️ Save already in progress, ignoring duplicate request');
            return false;
        }

        this.saveInProgress = true;

        try {
            // Check if saves are blocked (Despair sabotage)
            if (this.savesBlocked) {
                Logger.save('Save blocked by Despair Echo');

                // EMOTIONAL FEEDBACK: Triple denial buzz + visual shake (MANUAL SAVES ONLY)
                // DIZEE FIX: Don't buzz on auto-save attempts (too overwhelming)
                if (!isAutoSave && this.game.triggerSensoryFeedback) {
                    const saveButton = document.querySelector('.save-button, #save-button') as HTMLElement | null;
                    this.game.triggerSensoryFeedback('denied', saveButton, 'Despair blocks save');
                }

                this.showSaveIndicator('Save failed... something is interfering', true);
                return false;
            }

            const saveData = this.createSaveData(customLabel);

            // Guard: createSaveData returns null if no active route
            if (!saveData) {
                this.showSaveIndicator('Cannot save outside of a route', true);
                return false;
            }

            const key = isAutoSave ? this.autoSaveKey : this.savePrefix + slotNumber;

            try {
                localStorage.setItem(key, JSON.stringify(saveData));
                Logger.save(`Game saved to ${isAutoSave ? 'auto-save' : 'slot ' + slotNumber}`);

                // DIZEE: Save note discovery data
                this.saveNoteDiscovery(slotNumber, isAutoSave);

                // Record save for echo memory (Belle's meta-awareness)
                if (this.game.echoMemory) {
                    this.game.echoMemory.recordSave();
                }

                // Show save indicator
                const labelText = customLabel ? ` - "${customLabel}"` : '';
                this.showSaveIndicator(isAutoSave ? 'Auto-saved' : `Saved to Slot ${slotNumber}${labelText}`);

                // Emit save event
                this.eventBus.emit('save:completed', { slot: slotNumber ?? 0, isAutoSave });

                return true;
            } catch (error) {
                Logger.error('Save failed:', error);
                this.showSaveIndicator('Save failed!', true);
                return false;
            }
        } catch (error) {
            Logger.error('Unexpected error in saveGame:', error);
            return false;
        } finally {
            // Always release mutex
            this.saveInProgress = false;
        }
    }

    /**
     * Create save data from current game state
     * V1 Parity: Captures loop version, route state, scene ID
     */
    private createSaveData(customLabel: string | null = null): SaveData | null {
        const route = this.game.currentRoute;

        // Guard: Can't save without an active route
        if (!route) {
            Logger.warn('💾 Cannot create save data: No active route');
            return null;
        }

        const saveData: SaveData = {
            // LIVING VERSION NUMBER - captures current loop iteration
            version: this.game.loopVersion.toString(),
            loopStatus: this.game.loopStatus,
            timestamp: new Date().toISOString(),
            routeName: route.name === 'RonnieRoute' ? 'ronnie' : 'tori',
            customLabel: customLabel || null,

            // Get the current scene ID from the game engine
            currentSceneId: this.game.gameState.progress?.currentScene || null,

            // Get global game state (flags, etc.)
            gameState: this.game.gameState || { flags: {} },

            // Get all route-specific data from the route's getState() method
            routeData: {}
        };

        if (route.getState && typeof route.getState === 'function') {
            saveData.routeData = route.getState();
        } else if (route.name === 'RonnieRoute') {
            // Fallback for Ronnie's route if it doesn't have getState()
            saveData.routeData = {
                flags: this.game.gameState.flags // Ronnie's state is just flags
            };
        }

        return saveData;
    }

    /**
     * Auto-save to auto-save slot
     * V1 Parity: Called by AutoSaveManager
     */
    public async autoSave(): Promise<void> {
        if (!this.autoSaveEnabled || !this.game.currentRoute) return;
        this.saveGame(null, true);
    }

    // ========================================
    // NOTE DISCOVERY SAVE/LOAD
    // V1 Parity: lines 163-200
    // DIZEE: Revolutionary replayability system
    // ========================================

    /**
     * Save note discovery data separately
     * V1 Parity: Preserves seen notes, code drops, collected notes
     */
    private saveNoteDiscovery(slotNumber: number | null, isAutoSave: boolean = false): void {
        if (!this.game.collectiblesManager) return;

        const discoveryData: NoteDiscoveryData = {
            seenNotes: this.game.collectiblesManager.seenNotes || {},
            noteCodeDrops: this.game.collectiblesManager.noteCodeDrops || {},
            collectedNotes: this.game.collectiblesManager.collectedNotes ?
                [...this.game.collectiblesManager.collectedNotes] : []
        };

        const key = isAutoSave ? 'noteDiscovery_auto' : `noteDiscovery_slot${slotNumber}`;

        try {
            localStorage.setItem(key, JSON.stringify(discoveryData));
            Logger.save(`📧 Note discovery saved to ${isAutoSave ? 'auto-save' : 'slot ' + slotNumber}`);
        } catch (e) {
            Logger.error('Failed to save note discovery data:', e);
        }
    }

    /**
     * Load note discovery data
     * V1 Parity: Returns note discovery or null
     */
    private loadNoteDiscovery(slotNumber: number | null, isAutoSave: boolean = false): NoteDiscoveryData | null {
        const key = isAutoSave ? 'noteDiscovery_auto' : `noteDiscovery_slot${slotNumber}`;
        const saved = localStorage.getItem(key);

        if (!saved) return null;

        try {
            return JSON.parse(saved);
        } catch (e) {
            Logger.error('Failed to load note discovery data:', e);
            return null;
        }
    }

    // ========================================
    // LOAD FUNCTIONS
    // V1 Parity: lines 202-248
    // ========================================

    /**
     * Load game from slot
     * V1 Parity: Returns save data or null if invalid/not found
     */
    public loadGame(slotNumber: number | null, isAutoSave: boolean = false): SaveData | null {
        const key = isAutoSave ? this.autoSaveKey : this.savePrefix + slotNumber;

        try {
            const saveDataString = localStorage.getItem(key);
            if (!saveDataString) {
                Logger.save('No save data found in slot:', slotNumber);
                return null;
            }

            const saveData: SaveData = JSON.parse(saveDataString);

            // Validate save data
            if (!this.validateSaveData(saveData)) {
                Logger.error('Invalid save data');
                return null;
            }

            // Record load for echo memory (save scumming detection)
            if (this.game.echoMemory) {
                this.game.echoMemory.recordLoad();
            }

            return saveData;
        } catch (error) {
            Logger.error('Load failed:', error);
            return null;
        }
    }

    /**
     * Validate save data
     * V1 Parity: LIVING VERSION SYSTEM - accepts any version >= 848
     */
    private validateSaveData(saveData: SaveData): boolean {
        if (!saveData || !saveData.version) return false;

        const saveVersion = parseInt(saveData.version);
        const minVersion = 848; // GameConfig.VERSION.DEFAULT_START

        return saveVersion >= minVersion
            && saveData.routeName !== undefined
            && saveData.timestamp !== undefined;
    }

    /**
     * Restore game state from save data
     * Delegates to SaveManagerRestore for the heavy lifting
     */
    public restoreGameState(saveData: SaveData): void {
        _restoreGameState(
            this.game,
            saveData,
            () => this.loadNoteDiscovery(null, false),
        );
    }

    // ========================================
    // SAVE SLOT UTILITIES
    // V1 Parity: lines 475-548
    // ========================================

    /**
     * Get save slot information
     * V1 Parity: Returns display info for save slot
     */
    public getSaveSlotInfo(slotNumber: number): SaveSlotInfo {
        const saveData = this.loadGame(slotNumber, false);

        if (!saveData) {
            return {
                exists: false
            };
        }

        return {
            exists: true,
            saveData,
            displayText: this.formatSaveSlotDisplay(saveData)
        };
    }

    /**
     * Format save slot for display
     * V1 Parity: Human-readable save slot info
     */
    public formatSaveSlotDisplay(saveData: SaveData): string {
        const date = new Date(saveData.timestamp);
        const timeStr = date.toLocaleString();
        const route = saveData.routeName === 'ronnie' ? 'Ronnie 💙' : 'Tori 🖤';
        const label = saveData.customLabel ? ` - ${saveData.customLabel}` : '';

        return `${route} - Loop ${saveData.version}${label} (${timeStr})`;
    }

    /**
     * Delete save slot
     * V1 Parity: Removes save from localStorage
     */
    public deleteSave(slotNumber: number): void {
        localStorage.removeItem(this.savePrefix + slotNumber);
        localStorage.removeItem(`noteDiscovery_slot${slotNumber}`);
        Logger.save(`🗑️ Deleted save slot ${slotNumber}`);
    }

    /**
     * Get most recent save
     * V1 Parity: Checks auto-save + all slots
     */
    public getMostRecentSave(): SaveData | null {
        let mostRecentTime = 0;
        let mostRecentData: SaveData | null = null;

        // Check auto-save
        const autoSave = this.loadGame(null, true);
        if (autoSave) {
            const autoSaveTime = new Date(autoSave.timestamp).getTime();
            if (autoSaveTime > mostRecentTime) {
                mostRecentTime = autoSaveTime;
                mostRecentData = autoSave;
            }
        }

        // Check manual saves
        for (let i = 1; i <= this.maxSlots; i++) {
            const saveData = this.loadGame(i, false);
            if (saveData) {
                const saveTime = new Date(saveData.timestamp).getTime();
                if (saveTime > mostRecentTime) {
                    mostRecentTime = saveTime;
                    mostRecentData = saveData;
                }
            }
        }

        return mostRecentData;
    }

    /**
     * Check if any saves exist
     * V1 Parity: Quick check for save presence
     */
    public hasSaves(): boolean {
        // Check auto-save
        if (localStorage.getItem(this.autoSaveKey)) return true;

        // Check manual saves
        for (let i = 1; i <= this.maxSlots; i++) {
            if (localStorage.getItem(this.savePrefix + i)) return true;
        }

        return false;
    }

    // ========================================
    // VISUAL FEEDBACK
    // V1 Parity: lines 554-575
    // ========================================

    /**
     * Show save indicator toast
     * V1 Parity: Cyan success / Red error toast
     */
    private showSaveIndicator(message: string, isError: boolean = false): void {
        // Try to use status notification system if available
        const indicator = document.getElementById('save-indicator');

        if (!indicator) {
            // Fallback: emit event for notification system
            this.eventBus.emit('notification:show', {
                title: isError ? 'Save Failed' : 'Save Complete',
                message,
                category: 'system',
                icon: isError ? '❌' : '✅',
                duration: 2000
            });
            return;
        }

        // Direct DOM manipulation (V1 parity)
        indicator.textContent = message;
        indicator.style.color = isError ? '#ff4444' : '#00ffff';
        indicator.style.opacity = '1';

        setTimeout(() => {
            indicator.style.opacity = '0';
        }, 2000);
    }

    // ========================================
    // DESPAIR ECHO MECHANICS
    // V1 Parity: lines 577-586
    // ========================================

    /**
     * Block saves (Despair Echo sabotage)
     * V1 Parity: Prevents all save operations
     */
    public blockSaves(): void {
        this.savesBlocked = true;
        Logger.save('🚫 Saves blocked by Despair Echo');
    }

    /**
     * Unblock saves
     */
    public unblockSaves(): void {
        this.savesBlocked = false;
        Logger.save('✅ Saves unblocked');
    }

    // ========================================
    // PUBLIC GETTERS
    // ========================================

    public getMaxSlots(): number {
        return this.maxSlots;
    }

    public isAutoSaveEnabled(): boolean {
        return this.autoSaveEnabled;
    }

    public setAutoSaveEnabled(enabled: boolean): void {
        this.autoSaveEnabled = enabled;
    }
}
