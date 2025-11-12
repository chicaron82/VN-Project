// ========================================
// SAVE MANAGER FOR VERSION 848 (REVISED)
// Browser localStorage save/load system
// WITH SCENE JUMPING FUNCTIONALITY
// ========================================

class SaveManager {
    constructor(game) {
        this.game = game;
        this.maxSlots = 3;
        this.autoSaveEnabled = true;
        this.savePrefix = 'v848_save_';
        this.autoSaveKey = 'v848_autosave';
    }
    
    // ========================================
    // SAVE FUNCTIONS
    // ========================================
    
    saveGame(slotNumber, isAutoSave = false) {
        const saveData = this.createSaveData();
        const key = isAutoSave ? this.autoSaveKey : this.savePrefix + slotNumber;
        
        try {
            localStorage.setItem(key, JSON.stringify(saveData));
            console.log(`Game saved to ${isAutoSave ? 'auto-save' : 'slot ' + slotNumber}`);
            
            // Show save indicator
            this.showSaveIndicator(isAutoSave ? 'Auto-saved' : `Saved to Slot ${slotNumber}`);
            
            return true;
        } catch (error) {
            console.error('Save failed:', error);
            this.showSaveIndicator('Save failed!', true);
            return false;
        }
    }
    
    createSaveData() {
        const route = this.game.currentRoute;
        
        const saveData = {
            version: '848',
            timestamp: new Date().toISOString(),
            routeName: route.constructor.name === 'RonnieRoute' ? 'ronnie' : 'tori',
            
            // Get the current scene ID from the game engine
            currentSceneId: this.game.currentSceneId,
            
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
            
            return saveData;
        } catch (error) {
            console.error('Load failed:', error);
            return null;
        }
    }
    
    validateSaveData(saveData) {
        return saveData 
            && saveData.version === '848'
            && saveData.routeName
            && saveData.timestamp;
    }
    
    restoreGameState(saveData) {
        console.log('Restoring game state:', saveData);
        
        // Close any open UI screens
        if (this.game.saveLoadUI) {
            this.game.saveLoadUI.closeSaveLoadScreen();
            this.game.saveLoadUI.hidePauseMenu();
        }
        
        // Hide menus, show game view
        this.game.mainMenu.style.display = 'none';
        const routeSelect = document.getElementById('route-select');
        if (routeSelect) routeSelect.style.display = 'none';
        
        this.game.gameView.style.display = 'flex';
        this.game.gameView.style.opacity = '1';
        this.game.dialogueBox.style.display = 'block';
        
        // 1. Create the new route instance
        if (saveData.routeName === 'ronnie') {
            this.game.currentRoute = new RonnieRoute(this.game);
        } else if (saveData.routeName === 'tori') {
            // Show Tori-specific UI
            this.game.tetherUI.style.display = 'block';
            this.game.echoDisplay.style.display = 'block';
            this.game.notesButton.style.display = 'block';
            this.game.currentRoute = new ToriRoute(this.game);
        }
        
        const route = this.game.currentRoute;

        // 2. Restore global game state
        this.game.gameState = saveData.gameState || { flags: {} };

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
}
