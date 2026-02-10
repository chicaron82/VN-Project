import type { EventBus } from '@core/EventBus';
import type { StateManager } from '@core/StateManager';
import { Logger } from '@utils/Logger';

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
 * Save Data Includes:
 * - Current route and act
 * - Scene position and page index
 * - All story flags (choices made)
 * - Tether level (if applicable)
 * - Difficulty mode
 * - Unlocked features (skip, codes discovered)
 *
 * Save Restrictions:
 * - Act 1 saves disabled by default (tutorial)
 * - Can enable via secret code: saveanywhere
 *
 * CRITICAL DEPENDENCY: AutoSaveManager relies on this
 *
 * 848 is sacred. 💚🔥💀
 */

// ========================================
// TYPES & INTERFACES
// ========================================

export interface SaveData {
    version: string; // Living version number - loop iteration
    loopStatus: 'attempting' | 'succeeded' | 'accepted';
    timestamp: string; // ISO timestamp
    routeName: 'ronnie' | 'tori';
    customLabel: string | null;
    currentSceneId: string | null;
    gameState: GameState;
    routeData: RouteData;
}

interface GameState {
    flags: Record<string, boolean | number | string>;
    progress?: {
        currentScene?: string;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

interface RouteData {
    tetherLevel?: number;
    trueRoutePoints?: number;
    badRoutePoints?: number;
    digitalForeverPoints?: number;
    collectedNotes?: string[];
    progressMarkers?: Record<string, boolean>;
    flags?: Record<string, boolean | number | string>;
    [key: string]: unknown;
}

interface NoteDiscoveryData {
    seenNotes: Record<string, boolean>;
    noteCodeDrops: Record<string, string>;
    collectedNotes: string[];
}

interface SaveSlotInfo {
    exists: boolean;
    saveData?: SaveData;
    displayText?: string;
}

// Game interface (minimal for type safety)
interface GameInstance {
    loopVersion: number;
    loopStatus: 'attempting' | 'succeeded' | 'accepted';
    currentRoute: RouteInstance | null;
    gameState: GameState;
    echoMemory?: {
        recordSave(): void;
        recordLoad(): void;
    };
    collectiblesManager?: {
        seenNotes: Record<string, boolean>;
        noteCodeDrops: Record<string, string>;
        collectedNotes: Set<string>;
        totalNotes: number;
    };
    saveLoadUI?: HTMLElement;
    holdOnButton?: HTMLElement;
    triggerSensoryFeedback?: (type: string, target: HTMLElement | null, message: string) => void;
    displayScene?: (sceneId: string) => void;
}

interface RouteInstance {
    name: string;
    getState?: () => RouteData;
    restoreState?: (data: RouteData) => void;
    start?: () => void;
    updateTether?: (level: number) => void;
    collectedNotes?: Record<string, string[]>;
    [key: string]: unknown; // For scene methods
}

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
                // @ts-expect-error - save:completed event will be added to GameEvents in future phase
                this.eventBus.emit('save:completed', { slot: slotNumber, isAutoSave });

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
            // NOTE: displayScene() stores this in gameState.progress.currentScene
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
     * V1 Parity: Complete restoration of all systems
     */
    public restoreGameState(saveData: SaveData): void {
        Logger.save('🔄 Restoring game state from save...');

        // Restore loop version (LIVING VERSION)
        if (saveData.version) {
            this.game.loopVersion = parseInt(saveData.version);
        }

        // Restore loop status
        if (saveData.loopStatus) {
            this.game.loopStatus = saveData.loopStatus;
        }

        // Restore game state (flags, etc.)
        this.game.gameState = saveData.gameState;

        // Hide save/load UI
        if (this.game.saveLoadUI) {
            this.game.saveLoadUI.style.display = 'none';
        }

        // Hide route selection
        const routeSelect = document.getElementById('route-select');
        if (routeSelect) routeSelect.style.display = 'none';

        // Show game UI
        const gameUI = document.getElementById('game-ui');
        if (gameUI) gameUI.style.display = 'block';

        // Initialize the route
        let route: RouteInstance | null = null;
        if (saveData.routeName === 'ronnie') {
            // Initialize Ronnie's route
            // Note: Route initialization will be handled by game engine
            Logger.save('💙 Loading Ronnie route...');

            // Show hold-on button if available
            if (this.game.holdOnButton) {
                this.game.holdOnButton.style.display = 'block';
            }
        } else {
            // Initialize Tori's route
            Logger.save('🖤 Loading Tori route...');
        }

        // Get the route instance (will be set by game engine)
        route = this.game.currentRoute;

        // Apply insane mode visuals if active
        if (this.game.gameState.flags && this.game.gameState.flags.insaneModeActive) {
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) {
                gameContainer.classList.add('insane-mode');
            }
        }

        // Restore route-specific data
        if (route && route.restoreState && typeof route.restoreState === 'function') {
            route.restoreState(saveData.routeData);
        } else {
            // Legacy fallback
            this.restoreRouteDataLegacy(saveData.routeData);
        }

        // Jump to the saved scene
        if (saveData.currentSceneId && route) {
            this.jumpToScene(route, saveData.currentSceneId);
        } else {
            // No scene ID - start from beginning
            if (route && route.start && typeof route.start === 'function') {
                route.start();
            }
        }

        // Restore note discovery data
        const discoveryData = this.loadNoteDiscovery(null, false); // Load from same slot
        if (discoveryData && this.game.collectiblesManager) {
            this.game.collectiblesManager.seenNotes = discoveryData.seenNotes;
            this.game.collectiblesManager.noteCodeDrops = discoveryData.noteCodeDrops;
            this.game.collectiblesManager.collectedNotes = new Set(discoveryData.collectedNotes);
        }

        Logger.save('✅ Game state restored');
    }

    /**
     * Jump to a specific scene
     * V1 Parity: Scene jumping functionality
     */
    private jumpToScene(route: RouteInstance, sceneId: string): void {
        Logger.save(`🎬 Jumping to scene: ${sceneId}`);

        // Robust scene ID validation
        // Check if scene exists as a method on the route
        if (route[sceneId]) {
            const sceneFunction = route[sceneId];

            // Additional guard: Ensure it's actually a function
            if (typeof sceneFunction === 'function') {
                try {
                    // Use game engine's displayScene if available
                    if (this.game.displayScene) {
                        this.game.displayScene(sceneId);
                    } else {
                        // Fallback: Call scene directly
                        (sceneFunction as () => void).call(route);
                    }
                } catch (error) {
                    Logger.error(`Failed to jump to scene ${sceneId}:`, error);
                    // Fallback: Start route from beginning
                    if (route.start && typeof route.start === 'function') {
                        route.start();
                    }
                }
            }
        } else {
            Logger.warn(`Scene ${sceneId} not found on route, starting from beginning`);
            if (route.start && typeof route.start === 'function') {
                route.start();
            }
        }
    }

    /**
     * Legacy route data restoration
     * V1 Parity: Fallback for routes without restoreState()
     */
    private restoreRouteDataLegacy(routeData: RouteData): void {
        const route = this.game.currentRoute;

        if (!route || !routeData) return;

        if (route.name === 'ToriRoute') {
            if (routeData.tetherLevel !== undefined) {
                // Restore tether level
                if (route.updateTether) {
                    route.updateTether(routeData.tetherLevel);
                }
            }
            if (routeData.trueRoutePoints !== undefined) {
                (route as unknown as Record<string, number>).trueRoutePoints = routeData.trueRoutePoints;
            }
            if (routeData.badRoutePoints !== undefined) {
                (route as unknown as Record<string, number>).badRoutePoints = routeData.badRoutePoints;
            }
            if (routeData.digitalForeverPoints !== undefined) {
                (route as unknown as Record<string, number>).digitalForeverPoints = routeData.digitalForeverPoints;
            }
            if (routeData.collectedNotes) {
                this.restoreCollectedNotes(route, routeData.collectedNotes);
            }
        }

        if (route.name === 'RonnieRoute') {
            if (routeData.progressMarkers) {
                (route as unknown as Record<string, Record<string, boolean>>).progressMarkers = routeData.progressMarkers;
            }
        }
    }

    /**
     * Restore collected notes
     * V1 Parity: Reconstructs note collection state
     */
    private restoreCollectedNotes(route: RouteInstance, noteIds: string[]): void {
        if (!route.collectedNotes || !Array.isArray(noteIds)) return;

        // Note structure is expected to be: { noteId: '...' }
        for (const noteId of noteIds) {
            // Try to find the note definition (type would be in note metadata)
            // This is a simplified restoration - V1 has more complex logic
            if (route.collectedNotes) {
                // Create type categories if they don't exist
                Object.keys(route.collectedNotes).forEach(type => {
                    if (!route.collectedNotes![type]) {
                        route.collectedNotes![type] = [];
                    }
                    if (!route.collectedNotes![type].includes(noteId)) {
                        route.collectedNotes![type].push(noteId);
                    }
                });
            }
        }

        // Update notes count display
        if (this.game.collectiblesManager) {
            const totalCollected = noteIds.length;
            const totalNotes = this.game.collectiblesManager.totalNotes;
            // UI update would be handled by collectibles manager
            Logger.save(`📧 Restored ${totalCollected}/${totalNotes} notes`);
        }
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
