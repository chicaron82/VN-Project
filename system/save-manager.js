// ========================================
// SAVE MANAGER FOR VERSION 848 (REVISED)
// Browser localStorage save/load system
// WITH SCENE JUMPING FUNCTIONALITY
// ========================================

/**
 * SaveManager
 *
 * Handles game persistence via localStorage.
 * Manages 3 manual save slots + 1 auto-save slot.
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
 * @class SaveManager
 */
class SaveManager {
    constructor(game) {
        this.game = game;
        this.maxSlots = 3;
        this.autoSaveEnabled = true;
        this.savePrefix = 'v848_save_';
        this.autoSaveKey = 'v848_autosave';
        this.savesBlocked = false; // Despair can block saves

        // Mutex to prevent race conditions
        this.saveInProgress = false;
        this.loadInProgress = false;
    }

    // ========================================
    // SAVE FUNCTIONS
    // ========================================

    saveGame(slotNumber, isAutoSave = false, customLabel = null) {
        // Mutex: Prevent concurrent save operations
        if (this.saveInProgress) {
            console.warn('⚠️ Save already in progress, ignoring duplicate request');
            return false;
        }

        this.saveInProgress = true;

        try {
            // Check if saves are blocked (Despair sabotage)
            if (this.savesBlocked) {
                console.log('Save blocked by Despair Echo');

                // EMOTIONAL FEEDBACK: Triple denial buzz + visual shake (MANUAL SAVES ONLY)
                // DIZEE FIX: Don't buzz on auto-save attempts (too overwhelming)
                if (!isAutoSave && this.game.triggerSensoryFeedback) {
                    const saveButton = document.querySelector('.save-button, #save-button');
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
                console.log(`Game saved to ${isAutoSave ? 'auto-save' : 'slot ' + slotNumber}`);

                // DIZEE: Save note discovery data
                this.saveNoteDiscovery(slotNumber, isAutoSave);

                // Record save for echo memory (Belle's meta-awareness)
                if (this.game.echoMemory) {
                    this.game.echoMemory.recordSave();
                }

                // Show save indicator
                const labelText = customLabel ? ` - "${customLabel}"` : '';
                this.showSaveIndicator(isAutoSave ? 'Auto-saved' : `Saved to Slot ${slotNumber}${labelText}`);

                return true;
            } catch (error) {
                console.error('Save failed:', error);
                this.showSaveIndicator('Save failed!', true);
                return false;
            } finally {
                // Always release mutex
                this.saveInProgress = false;
            }
        }

    createSaveData(customLabel = null) {
            const route = this.game.currentRoute;

            // Guard: Can't save without an active route
            if (!route) {
                console.warn('💾 Cannot create save data: No active route');
                return null;
            }

            const saveData = {
                // LIVING VERSION NUMBER - captures current loop iteration
                version: this.game.loopVersion.toString(),
                loopStatus: this.game.loopStatus, // 'attempting', 'succeeded', 'accepted'
                timestamp: new Date().toISOString(),
                routeName: route.constructor.name === 'RonnieRoute' ? 'ronnie' : 'tori',
                customLabel: customLabel || null,

                // Get the current scene ID from the game engine
                // NOTE: displayScene() stores this in gameState.progress.currentScene
                currentSceneId: this.game.gameState.progress.currentScene || null,

                // Get global game state (flags, etc.)
                gameState: this.game.gameState || { flags: {} },

                // Get all route-specific data from the route's getState() method
                routeData: {}
            };

            if (route.getState && typeof route.getState === 'function') {
                saveData.routeData = route.getState();
            } else if (route.constructor.name === 'RonnieRoute') {
                // Fallback for Ronnie's route if it doesn't have getState()
                saveData.routeData = {
                    flags: this.game.gameState.flags // Ronnie's state is just flags
                };
            }

            return saveData;
        }

        autoSave() {
            if (!this.autoSaveEnabled || !this.game.currentRoute) return;
            this.saveGame(null, true);
        }

        // ========================================
        // NOTE DISCOVERY SAVE/LOAD
        // DIZEE: Revolutionary replayability system
        // ========================================

        saveNoteDiscovery(slotNumber, isAutoSave = false) {
            if (!this.game.collectiblesManager) return;

            const discoveryData = {
                seenNotes: this.game.collectiblesManager.seenNotes || {},
                noteCodeDrops: this.game.collectiblesManager.noteCodeDrops || {},
                collectedNotes: this.game.collectiblesManager.collectedNotes ?
                    [...this.game.collectiblesManager.collectedNotes] : []
            };

            const key = isAutoSave ? 'noteDiscovery_auto' : `noteDiscovery_slot${slotNumber}`;

            try {
                localStorage.setItem(key, JSON.stringify(discoveryData));
                console.log(`📧 Note discovery saved to ${isAutoSave ? 'auto-save' : 'slot ' + slotNumber}`);
            } catch (e) {
                console.error('Failed to save note discovery data:', e);
            }
        }

        loadNoteDiscovery(slotNumber, isAutoSave = false) {
            const key = isAutoSave ? 'noteDiscovery_auto' : `noteDiscovery_slot${slotNumber}`;
            const saved = localStorage.getItem(key);

            if (!saved) return null;

            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load note discovery data:', e);
                return null;
            }
        }

        // ========================================
        // LOAD FUNCTIONS
        // ========================================

        loadGame(slotNumber, isAutoSave = false) {
            const key = isAutoSave ? this.autoSaveKey : this.savePrefix + slotNumber;

            try {
                const saveDataString = localStorage.getItem(key);
                if (!saveDataString) {
                    console.log('No save data found in slot:', slotNumber);
                    return null;
                }

                const saveData = JSON.parse(saveDataString);

                // Validate save data
                if (!this.validateSaveData(saveData)) {
                    console.error('Invalid save data');
                    return null;
                }

                // Record load for echo memory (save scumming detection)
                if (this.game.echoMemory) {
                    this.game.echoMemory.recordLoad();
                }

                return saveData;
            } catch (error) {
                console.error('Load failed:', error);
                return null;
            }
        }

        validateSaveData(saveData) {
            // LIVING VERSION SYSTEM:
            // Accept any version >= 848 (the start of the loop)
            // The save file is the source of truth for the current iteration
            if (!saveData || !saveData.version) return false;

            const saveVersion = parseInt(saveData.version);
            const minVersion = 848; // GameConfig.VERSION.DEFAULT_START

            return saveVersion >= minVersion
                && saveData.routeName
                && saveData.timestamp;
        }

        restoreGameState(saveData) {
            console.log('Restoring game state:', saveData);

            // CRITICAL: Adopt the save file's version and status
            // If the save says "Version 852", the game is now in Loop 852
            if (saveData.version) {
                this.game.loopVersion = parseInt(saveData.version);
                console.log(`📁 Restored to VERSION ${this.game.loopVersion}`);
            }

            if (saveData.loopStatus) {
                this.game.loopStatus = saveData.loopStatus;
                console.log(`📁 Loop status: ${this.game.loopStatus}`);
            }

            // Update visual display immediately
            this.game.updateTitleScreen();

            // Persist to localStorage so page refresh maintains version
            localStorage.setItem('loopVersion', this.game.loopVersion.toString());
            localStorage.setItem('loopStatus', this.game.loopStatus);

            // Close any open UI screens
            if (this.game.saveLoadUI) {
                // DIZEE FIX: Cancel any pending "Return to Main Menu" intent now that we are loading
                this.game.saveLoadUI.returningToMainMenu = false;
                this.game.saveLoadUI.closeSaveLoadScreen();
                this.game.saveLoadUI.hidePauseMenu();
                // DIZEE FIX: Also close any stale confirmation dialogs
                this.game.saveLoadUI.closeConfirmDialog();
            }

            // Hide menus, show game view
            this.game.mainMenu.style.display = 'none';
            const routeSelect = document.getElementById('route-select');
            if (routeSelect) routeSelect.style.display = 'none';

            this.game.gameView.style.display = 'flex';
            this.game.gameView.style.opacity = '1';

            // DIZEE FIX: Ensure the UI layer wrapper is visible (it contains the dialogue box!)
            const gameUI = document.getElementById('game-ui-layer');
            if (gameUI) gameUI.style.display = 'block';

            this.game.dialogueBox.style.display = 'block';

            // 1. Create the new route instance and set dialogue frame
            if (saveData.routeName === 'ronnie') {
                this.game.currentRoute = new RonnieRoute(this.game);
                this.game.setDialogueFrame('ronnie');
            } else if (saveData.routeName === 'tori') {
                // Show Tori-specific UI
                this.game.tetherUI.style.display = 'block';
                // Show Hold On button independently
                if (this.game.holdOnButton) {
                    this.game.holdOnButton.style.display = 'block';
                }
                // echoDisplay removed - now using three-echoes-sprite.png
                // notesButton removed - shade/sidebar handles notes now
                this.game.currentRoute = new ToriRoute(this.game);
                this.game.setDialogueFrame('tori');
            }

            const route = this.game.currentRoute;

            // 2. Restore global game state (ensure all required properties exist)
            const restoredState = saveData.gameState || {};
            this.game.gameState = {
                flags: restoredState.flags || {},
                choices: restoredState.choices || {},
                progress: restoredState.progress || {},
                sprites: restoredState.sprites || { left: null, right: null }
            };

            // ZEE'S FIX: Restore Insane Mode color scheme if save is from Insane Mode 🖤
            if (this.game.gameState.flags && this.game.gameState.flags.insaneModeActive) {
                const gameContainer = document.getElementById('game-container');
                if (gameContainer) {
                    gameContainer.classList.add('insane-mode-active');
                    console.log('🔴 Insane Mode color scheme restored from save');
                }
            } else {
                // Make sure it's deactivated if loading non-Insane save
                this.game.deactivateInsaneMode();
            }

            // 3. Restore route-specific state
            if (route.restoreState && typeof route.restoreState === 'function') {
                route.restoreState(saveData.routeData);
            } else {
                // Fallback for routes without restoreState
                this.restoreRouteDataLegacy(saveData.routeData);
            }

            // 4. JUMP TO THE SAVED SCENE
            if (saveData.currentSceneId) {
                this.jumpToScene(route, saveData.currentSceneId);
            } else {
                // Fallback: No scene ID saved, start route from beginning
                console.warn('No scene ID in save data. Starting route from beginning.');
                if (route.start && typeof route.start === 'function') {
                    route.start();
                }
            }

            // DIZEE: Load note discovery data
            const slotNumber = saveData.customLabel ? null : parseInt(saveData.customLabel);
            const isAutoSave = saveData.customLabel === null;
            const discoveryData = this.loadNoteDiscovery(slotNumber, isAutoSave);

            if (discoveryData && this.game.collectiblesManager) {
                this.game.collectiblesManager.seenNotes = discoveryData.seenNotes || {};
                this.game.collectiblesManager.noteCodeDrops = discoveryData.noteCodeDrops || {};
                this.game.collectiblesManager.collectedNotes = new Set(discoveryData.collectedNotes || []);
                console.log(`📧 Restored note discovery: ${discoveryData.collectedNotes.length} notes collected`);
            }

            this.showSaveIndicator('Game Loaded');
        }

        jumpToScene(route, sceneId) {
            console.log(`Attempting to jump to scene: ${sceneId}`);

            let sceneFunction = null;
            let context = route;

            // Search for the scene function in the route hierarchy
            if (route[sceneId]) {
                // Check root route class (e.g., RonnieRoute, or ToriRoute methods)
                sceneFunction = route[sceneId];
                context = route;
            } else if (route.act1 && route.act1[sceneId]) {
                // Check Act 1 (e.g., ToriRoute.act1)
                sceneFunction = route.act1[sceneId];
                context = route.act1;
            } else if (route.act2 && route.act2[sceneId]) {
                // Check Act 2
                sceneFunction = route.act2[sceneId];
                context = route.act2;
            } else if (route.act3 && route.act3[sceneId]) {
                // Check Act 3
                sceneFunction = route.act3[sceneId];
                context = route.act3;
            } else if (route.endings && route.endings[sceneId]) {
                // Check Endings
                sceneFunction = route.endings[sceneId];
                context = route.endings;
            }

            if (sceneFunction && typeof sceneFunction === 'function') {
                // We found the scene! Jump to it.
                console.log(`Scene found! Jumping to: ${sceneId}`);
                sceneFunction.call(context);
            } else {
                // Fallback: Scene not found, start from beginning
                console.warn(`Scene ID "${sceneId}" not found. Starting route from beginning.`);
                if (route.start && typeof route.start === 'function') {
                    route.start();
                }
            }
        }

        // Legacy fallback for routes without restoreState method
        restoreRouteDataLegacy(routeData) {
            const route = this.game.currentRoute;

            if (!route || !routeData) return;

            // Restore Tori Route data
            if (route.constructor.name === 'ToriRoute') {
                if (routeData.tetherLevel !== undefined) {
                    route.tetherLevel = routeData.tetherLevel;
                    // Update the tether UI
                    if (route.updateTether) {
                        route.updateTether(0); // Just refresh display
                    }
                }
                if (routeData.trueRoutePoints !== undefined) {
                    route.trueRoutePoints = routeData.trueRoutePoints;
                }
                if (routeData.badRoutePoints !== undefined) {
                    route.badRoutePoints = routeData.badRoutePoints;
                }
                if (routeData.digitalForeverPoints !== undefined) {
                    route.digitalForeverPoints = routeData.digitalForeverPoints;
                }
                if (routeData.collectedNotes) {
                    this.restoreCollectedNotes(route, routeData.collectedNotes);
                }
            }

            // Restore Ronnie Route data
            if (route.constructor.name === 'RonnieRoute') {
                if (routeData.progressMarkers) {
                    route.progressMarkers = routeData.progressMarkers;
                }
            }
        }

        restoreCollectedNotes(route, noteIds) {
            if (!route.collectedNotes || !Array.isArray(noteIds)) return;

            noteIds.forEach(noteId => {
                const note = route.allNotes[noteId];
                if (note) {
                    if (!route.collectedNotes[note.type]) {
                        route.collectedNotes[note.type] = [];
                    }
                    if (!route.collectedNotes[note.type].includes(noteId)) {
                        route.collectedNotes[note.type].push(noteId);
                    }
                }
            });

            // Update notes count
            const totalNotes = noteIds.length;
            if (this.game.notesCount) {
                this.game.notesCount.textContent = totalNotes;
            }
        }

        // ========================================
        // SAVE SLOT MANAGEMENT
        // ========================================

        getSaveSlotInfo(slotNumber) {
            const saveData = this.loadGame(slotNumber);
            if (!saveData) {
                return {
                    isEmpty: true,
                    slotNumber: slotNumber
                };
            }

            return {
                isEmpty: false,
                slotNumber: slotNumber,
                routeName: saveData.routeName,
                version: saveData.version, // Include version for display
                customLabel: saveData.customLabel || null,
                timestamp: new Date(saveData.timestamp),
                displayText: this.formatSaveSlotDisplay(saveData)
            };
        }

        formatSaveSlotDisplay(saveData) {
            const route = saveData.routeName === 'ronnie' ? 'Ronnie Route' : 'Tori Route';
            const date = new Date(saveData.timestamp);
            const dateStr = date.toLocaleDateString();
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return `${route} - ${dateStr} ${timeStr}`;
        }

        deleteSave(slotNumber) {
            const key = this.savePrefix + slotNumber;
            localStorage.removeItem(key);
            console.log(`Deleted save slot ${slotNumber}`);
        }

        getMostRecentSave() {
            let mostRecent = null;
            let mostRecentTime = 0;

            // Check auto-save
            const autoSave = this.loadGame(null, true);
            if (autoSave) {
                const autoSaveTime = new Date(autoSave.timestamp).getTime();
                if (autoSaveTime > mostRecentTime) {
                    mostRecent = { data: autoSave, isAutoSave: true };
                    mostRecentTime = autoSaveTime;
                }
            }

            // Check manual saves
            for (let i = 1; i <= this.maxSlots; i++) {
                const saveData = this.loadGame(i);
                if (saveData) {
                    const saveTime = new Date(saveData.timestamp).getTime();
                    if (saveTime > mostRecentTime) {
                        mostRecent = { data: saveData, slotNumber: i, isAutoSave: false };
                        mostRecentTime = saveTime;
                    }
                }
            }

            return mostRecent;
        }

        hasSaves() {
            // Check if ANY saves exist
            if (localStorage.getItem(this.autoSaveKey)) return true;

            for (let i = 1; i <= this.maxSlots; i++) {
                if (localStorage.getItem(this.savePrefix + i)) return true;
            }

            return false;
        }

        // ========================================
        // UI HELPERS
        // ========================================

        showSaveIndicator(message, isError = false) {
            // Create or get save indicator element
            let indicator = document.getElementById('save-indicator');
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'save-indicator';
                document.body.appendChild(indicator);
            }

            indicator.textContent = message;
            indicator.className = isError ? 'save-indicator error' : 'save-indicator';
            indicator.classList.add('visible');

            // Fade out after 2 seconds
            setTimeout(() => {
                indicator.classList.remove('visible');
            }, 2000);
        }

        // ========================================
        // SAVE BLOCKING (DESPAIR SABOTAGE)
        // ========================================

        blockSaves() {
            this.savesBlocked = true;
            console.log('Saves blocked by Despair Echo');
        }

        unblockSaves() {
            this.savesBlocked = false;
            console.log('Saves unblocked');
        }
    }

    // Global assignment for browser
    if(typeof window !== 'undefined') {
    window.SaveManager = SaveManager;
}

// ES Module export
export { SaveManager };
