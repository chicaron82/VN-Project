// TORI'S ROUTE - MAIN ORCHESTRATOR (REFACTORED)
// Manages state and coordinates act modules

class ToriRoute {
    constructor(game) {
        this.game = game;
        
        // ========================================
        // MODULAR SYSTEMS
        // ========================================
        
        // Initialize modular systems
        this.tetherSystem = new TetherSystem(this.game, this);
        this.collectiblesManager = new CollectiblesManager(this.game, this);
        
        // ========================================
        // ROUTE STATE
        // ========================================
        
        // Route points for ending determination
        this.routePoints = {
            bad: 0,
            true: 0,
            digitalForever: 0
        };
        
        // ========================================
        // ACT MODULES
        // ========================================
        
        this.act1 = new ToriAct1(this);
        this.act2 = new ToriAct2(this);
        this.act3 = new ToriAct3(this);
        this.endings = new ToriEndings(this);
    }
    
    // ========================================
    // INITIALIZATION
    // ========================================
    
    start() {
        // Show Tori-specific UI elements
        if (this.game.tetherUI) {
            this.game.tetherUI.style.display = 'block';
        }
        if (this.game.notesButton) {
            this.game.notesButton.style.display = 'block';
        }
        
        // Initialize tether system
        this.tetherSystem.init();
        this.tetherSystem.startDecay();
        
        // Initialize collectibles system
        this.collectiblesManager.init();
        this.collectiblesManager.defineToriNotes();
        
        // Start Act 1
        this.act1.start();
    }
    
    // ========================================
    // DELEGATION METHODS (FACADE PATTERN)
    // ========================================
    
    // Tether system delegation
    updateTether(amount, reason) {
        return this.tetherSystem.updateTether(amount, reason);
    }
    
    holdOn() {
        this.tetherSystem.holdOn();
    }
    
    getTetherState() {
        // Returns narrative state based on tether level
        const level = this.tetherSystem.tetherLevel;
        
        if (level < 30) {
            return 'despair';
        } else if (level < 70) {
            return 'balanced';
        } else {
            return 'strong';
        }
    }
    
    // Direct tether level access (for backward compatibility)
    get tetherLevel() {
        return this.tetherSystem.tetherLevel;
    }
    
    set tetherLevel(value) {
        this.tetherSystem.tetherLevel = value;
        this.tetherSystem.updateDisplay();
    }
    
    // Echo system delegation
    showEchoes(echoDialogue) {
        this.tetherSystem.showEchoes(echoDialogue);
    }
    
    hideEchoes() {
        this.tetherSystem.hideEchoes();
    }
    
    // Collectibles system delegation
    unlockNote(noteId) {
        this.collectiblesManager.unlockNote(noteId);
    }
    
    // ========================================
    // ROUTE POINTS & ENDING DETERMINATION
    // ========================================
    
    addRoutePoints(type, amount) {
        if (this.routePoints.hasOwnProperty(type)) {
            this.routePoints[type] += amount;
            console.log(`Route points: ${type} +${amount} (total: ${this.routePoints[type]})`);
        }
    }
    
    determineEnding() {
        // Called at end of Act 3 to determine which ending to show
        const points = this.routePoints;
        
        console.log('Determining ending...', points);
        
        // Find highest point total
        if (points.true >= points.bad && points.true >= points.digitalForever) {
            return 'true';
        } else if (points.digitalForever >= points.bad) {
            return 'digitalForever';
        } else {
            return 'bad';
        }
    }
    
    // ========================================
    // TETHER DEATH (0%)
    // ========================================
    
    tetherDeath() {
        // Stop tether decay
        this.tetherSystem.stopDecay();
        
        // Increment attempt counter
        this.game.incrementAttempt();
        const currentVersion = localStorage.getItem('attemptNumber') || '849';
        
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The tether snaps. Consciousness fragments. The void swallows everything.',
            internal: `[Tori's awareness dissolves into static]\n\n**"GAME OVER - Tether Severed"**\n\n[System restarting... Version ${currentVersion}]`,
            choices: [
                { text: '[RETRY FROM LAST CHECKPOINT]', value: 'retry' },
                { text: '[RETURN TO MAIN MENU]', value: 'menu' }
            ],
            onChoice: (choice) => {
                if (choice === 'retry') {
                    // Reset tether system and restart from Act 1
                    this.tetherSystem.reset();
                    this.act1.start();
                } else {
                    // Hide Tori-specific UI before returning to menu
                    if (this.game.tetherUI) this.game.tetherUI.style.display = 'none';
                    if (this.game.notesButton) this.game.notesButton.style.display = 'none';
                    this.game.returnToMainMenu();
                }
            }
        });
    }
    
    // ========================================
    // SAVE/LOAD SUPPORT
    // ========================================
    
    getState() {
        return {
            route: 'tori',
            routePoints: { ...this.routePoints },
            tetherSystem: this.tetherSystem.getState(),
            collectibles: this.collectiblesManager.getState()
        };
    }
    
    restoreState(state) {
        this.routePoints = state.routePoints || { bad: 0, true: 0, digitalForever: 0 };
        
        if (state.tetherSystem) {
            this.tetherSystem.restoreState(state.tetherSystem);
        }
        if (state.collectibles) {
            this.collectiblesManager.restoreState(state.collectibles);
        }
    }
}

// Export for game engine
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToriRoute;
}
