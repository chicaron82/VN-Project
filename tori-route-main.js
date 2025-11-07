// TORI'S ROUTE - MAIN ORCHESTRATOR
// Manages state and coordinates act modules

class ToriRoute {
    constructor(game) {
        this.game = game;
        
        // ========================================
        // SHARED STATE
        // ========================================
        
        // Tether system (unique to Tori's route)
        this.tetherLevel = 100;
        this.tetherDecayRate = 0.3;          // Very gentle passive drain for slow readers
        this.tetherDecayTimer = null;        // Passive decay interval
        
        // Route points for ending determination
        this.routePoints = {
            bad: 0,
            true: 0,
            digitalForever: 0
        };
        
        // Unlocked notes
        this.unlockedNotes = [];
        
        // Echo system state
        this.echoes = {
            echo1: {
                mood: 'hopeful',
                color: '#00ffff' // cyan
            },
            echo2: {
                mood: 'gentle',
                color: '#00ff00' // green
            },
            despair: {
                mood: 'bitter',
                color: '#ff0000' // red
            }
        };
        
        // ========================================
        // INITIALIZE ACT MODULES
        // ========================================
        
        // Note: Prologue is handled separately (shared between routes)
        // Tori's route starts at Act 1
        
        this.act1 = new ToriAct1(this);
        this.act2 = new ToriAct2(this);
        this.act3 = new ToriAct3(this);
        this.endings = new ToriEndings(this);
    }
    
    // ========================================
    // ENTRY POINT
    // ========================================
    
    start() {
        // Called after shared prologue completes
        this.startTetherDecay();  // Begin passive decay
        this.act1.start();
    }
    
    // ========================================
    // SHARED UTILITY METHODS
    // ========================================
    
    updateTether(amount, reason = '') {
        this.tetherLevel = Math.max(0, Math.min(100, this.tetherLevel + amount));
        
        // Update display width and color
        if (this.game.tetherFill) {
            this.game.tetherFill.style.width = this.tetherLevel + '%';
            
            // Color coding based on level
            if (this.tetherLevel > 60) {
                this.game.tetherFill.style.background = 'linear-gradient(90deg, #0f0, #0ff)';
            } else if (this.tetherLevel > 30) {
                this.game.tetherFill.style.background = 'linear-gradient(90deg, #ff0, #0ff)';
            } else {
                this.game.tetherFill.style.background = 'linear-gradient(90deg, #f00, #ff0)';
            }
        }
        
        // Update text display
        if (this.game.tetherText) {
            this.game.tetherText.textContent = Math.floor(this.tetherLevel) + '%';
        }
        
        // Check for tether death (0%)
        if (this.tetherLevel <= 0) {
            this.stopTetherDecay();
            this.tetherDeath();
        }
        
        // Log for debugging
        if (reason) {
            console.log(`Tether: ${this.tetherLevel}% (${reason})`);
        }
        
        return this.tetherLevel;
    }
    
    startTetherDecay() {
        // Passive decay every 5 seconds (gentle for readers)
        this.tetherDecayTimer = setInterval(() => {
            this.applyTetherDecay();
        }, 5000);
    }
    
    stopTetherDecay() {
        if (this.tetherDecayTimer) {
            clearInterval(this.tetherDecayTimer);
            this.tetherDecayTimer = null;
        }
    }
    
    applyTetherDecay() {
        // Calculate decay rate based on current level
        let decayAmount = this.tetherDecayRate;
        
        // Gentler accelerated decay when low
        if (this.tetherLevel < 50) {
            decayAmount = 0.5;  // Very gentle acceleration
        }
        if (this.tetherLevel < 30) {
            decayAmount = 0.8;  // Still manageable even at critical
        }
        
        // Apply decay
        this.updateTether(-decayAmount, 'passive decay');
        
        // Trigger glitch effects if critical
        if (this.tetherLevel < 20) {
            this.triggerGlitchEffect();
        }
    }
    
    triggerGlitchEffect() {
        // Visual glitch when tether is critically low
        if (this.game.gameView) {
            this.game.gameView.style.filter = 'hue-rotate(180deg) brightness(1.2)';
            setTimeout(() => {
                this.game.gameView.style.filter = 'none';
            }, 200);
        }
    }
    
    addRoutePoints(type, amount) {
        if (this.routePoints.hasOwnProperty(type)) {
            this.routePoints[type] += amount;
            console.log(`Route points: ${type} +${amount} (total: ${this.routePoints[type]})`);
        }
    }
    
    unlockNote(noteId) {
        if (!this.unlockedNotes.includes(noteId)) {
            this.unlockedNotes.push(noteId);
            console.log(`Note unlocked: ${noteId}`);
            
            // Visual notification
            if (this.game.notesButton) {
                this.game.notesButton.classList.add('pulse');
                setTimeout(() => {
                    this.game.notesButton.classList.remove('pulse');
                }, 1000);
            }
        }
    }
    
    showEchoes(echoDialogue) {
        // Display echo commentary alongside main dialogue
        // This creates the "voices in her head" effect
        
        const echoContainer = document.getElementById('echo-container');
        if (!echoContainer) return;
        
        echoContainer.innerHTML = '';
        echoContainer.style.display = 'block';
        
        if (echoDialogue.echo1) {
            const echo1Div = document.createElement('div');
            echo1Div.className = 'echo-text echo1';
            echo1Div.textContent = 'Echo 1: ' + echoDialogue.echo1;
            echoContainer.appendChild(echo1Div);
        }
        
        if (echoDialogue.echo2) {
            const echo2Div = document.createElement('div');
            echo2Div.className = 'echo-text echo2';
            echo2Div.textContent = 'Echo 2: ' + echoDialogue.echo2;
            echoContainer.appendChild(echo2Div);
        }
        
        if (echoDialogue.despair) {
            const despairDiv = document.createElement('div');
            despairDiv.className = 'echo-text despair';
            despairDiv.textContent = 'Despair: ' + echoDialogue.despair;
            echoContainer.appendChild(despairDiv);
        }
    }
    
    hideEchoes() {
        const echoContainer = document.getElementById('echo-container');
        if (echoContainer) {
            echoContainer.style.display = 'none';
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
                    // Restart from Act 1
                    this.tetherLevel = 100;
                    this.startTetherDecay();
                    this.act1.scene1();
                } else {
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
            tetherLevel: this.tetherLevel,
            routePoints: { ...this.routePoints },
            unlockedNotes: [...this.unlockedNotes],
            echoes: JSON.parse(JSON.stringify(this.echoes))
        };
    }
    
    restoreState(state) {
        this.tetherLevel = state.tetherLevel || 100;
        this.routePoints = state.routePoints || { bad: 0, true: 0, digitalForever: 0 };
        this.unlockedNotes = state.unlockedNotes || [];
        this.echoes = state.echoes || this.echoes;
        
        // Update display
        this.updateTether(0, 'restored from save');
    }
}

// Export for game engine
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToriRoute;
}
