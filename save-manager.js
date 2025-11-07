// ========================================
// SAVE MANAGER FOR VERSION 848
// Browser localStorage save/load system
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
            
            // Scene tracking
            currentSceneId: this.getCurrentSceneId(),
            
            // Route-specific data
            routeData: {}
        };
        
        // Tori Route specific data
        if (route.constructor.name === 'ToriRoute') {
            saveData.routeData = {
                tetherStrength: route.tetherStrength || 100,
                trueRoutePoints: route.trueRoutePoints || 0,
                badRoutePoints: route.badRoutePoints || 0,
                digitalForeverPoints: route.digitalForeverPoints || 0,
                collectedNotes: this.getCollectedNotes(route),
                coherenceLevel: route.coherenceLevel || 'stable',
                hasUsedHoldOn: route.hasUsedHoldOn || false
            };
        }
        
        // Ronnie Route specific data
        if (route.constructor.name === 'RonnieRoute') {
            saveData.routeData = {
                progressMarkers: route.progressMarkers || []
            };
        }
        
        return saveData;
    }
    
    getCurrentSceneId() {
        // Try to extract scene ID from current scene
        if (this.game.currentScene && this.game.currentScene.sceneId) {
            return this.game.currentScene.sceneId;
        }
        
        // Fallback: try to identify from route state
        return 'unknown_scene';
    }
    
    getCollectedNotes(route) {
        if (!route.collectedNotes) return [];
        
        const collected = [];
        for (const type in route.collectedNotes) {
            collected.push(...route.collectedNotes[type]);
        }
        return collected;
    }
    
    autoSave() {
        if (!this.autoSaveEnabled) return;
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
        const saveLoadScreen = document.getElementById('save-load-screen');
        if (saveLoadScreen) {
            saveLoadScreen.classList.remove('active');
        }
        
        // Hide menus, show game view
        this.game.mainMenu.style.display = 'none';
        const routeSelect = document.getElementById('route-select');
        if (routeSelect) routeSelect.style.display = 'none';
        
        // Clear inline styles on pause menu so CSS classes work properly
        const pauseMenu = document.getElementById('pause-menu');
        if (pauseMenu) {
            pauseMenu.style.display = '';
            pauseMenu.classList.remove('active');
        }
        
        this.game.gameView.style.display = 'flex';
        this.game.gameView.style.opacity = '1';
        this.game.dialogueBox.style.display = 'block';
        
        // Start the appropriate route
        if (saveData.routeName === 'ronnie') {
            this.game.currentRoute = new RonnieRoute(this.game);
        } else if (saveData.routeName === 'tori') {
            // Show Tori-specific UI
            this.game.tetherUI.style.display = 'block';
            this.game.echoDisplay.style.display = 'block';
            this.game.notesButton.style.display = 'block';
            this.game.currentRoute = new ToriRoute(this.game);
        }
        
        // Restore route-specific state
        if (saveData.routeData) {
            this.restoreRouteData(saveData.routeData);
        }
        
        // TODO: Jump to specific scene based on saveData.currentSceneId
        // For now, routes will start from beginning
        // Full scene jumping requires scene ID tracking system
        
        this.showSaveIndicator('Game Loaded');
    }
    
    restoreRouteData(routeData) {
        const route = this.game.currentRoute;
        
        if (!route) return;
        
        // Restore Tori Route data
        if (route.constructor.name === 'ToriRoute') {
            if (routeData.tetherStrength !== undefined) {
                route.tetherStrength = routeData.tetherStrength;
                // Update the tether UI directly
                if (route.updateTether) {
                    route.updateTether(routeData.tetherStrength);
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
                // Restore collected notes
                // This requires parsing the note IDs back into the collection structure
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
        if (!route.collectedNotes) return;
        
        noteIds.forEach(noteId => {
            const note = route.allNotes[noteId];
            if (note) {
                route.collectedNotes[note.type].push(noteId);
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
