// ========================================
// TETHER SYSTEM MODULE
// Manages Tori's consciousness tether mechanics and Echo Toris
// Extracted from tori-route-main.js for modularity
// ========================================

class TetherSystem {
    constructor(game, route) {
        this.game = game;
        this.route = route;
        
        // ========================================
        // TETHER STATE
        // ========================================
        
        this.tetherLevel = GameConfig.TETHER.INITIAL_LEVEL;
        this.tetherDecayRate = GameConfig.TETHER.DECAY_RATE_BASE;  // Gentle passive drain
        this.tetherDecayTimer = null;        // Passive decay interval
        this.holdOnCooldown = false;         // Hold On button cooldown state
        this.holdOnCooldownTimer = null;     // Countdown interval for button text
        this.hasUsedHoldOn = false;          // Track if player has used Hold On at least once
        this.hasShownTutorialFlash = localStorage.getItem('tetherTutorialShown') === 'true'; // One-time tutorial
        
        // Configuration constants (from GameConfig)
        this.HOLD_ON_BOOST = GameConfig.TETHER.HOLD_ON_BOOST;
        this.HOLD_ON_COOLDOWN_MS = GameConfig.TETHER.HOLD_ON_COOLDOWN_MS;
        this.DECAY_INTERVAL_MS = GameConfig.TETHER.DECAY_INTERVAL_MS;
        this.CRITICAL_THRESHOLD = GameConfig.TETHER.THRESHOLD_CRITICAL;
        
        // Decay acceleration thresholds (from GameConfig)
        this.DECAY_MEDIUM_THRESHOLD = GameConfig.TETHER.THRESHOLD_MEDIUM_DECAY;
        this.DECAY_CRITICAL_THRESHOLD = GameConfig.TETHER.THRESHOLD_CRITICAL_DECAY;
        this.DECAY_MEDIUM_RATE = GameConfig.TETHER.DECAY_RATE_MEDIUM;
        this.DECAY_CRITICAL_RATE = GameConfig.TETHER.DECAY_RATE_CRITICAL;
        
        // ========================================
        // ECHO SYSTEM STATE
        // ========================================
        
        this.echoes = {
            echo1: {
                name: 'Echo 1',
                mood: 'hopeful',
                color: '#00ffff',        // cyan
                active: false
            },
            echo2: {
                name: 'Echo 2',
                mood: 'gentle',
                color: '#00ff00',        // green
                active: false
            },
            despair: {
                name: 'Despair Echo',
                mood: 'bitter',
                color: '#ff0000',        // red
                active: false
            }
        };
        
        // DOM element references (set by game engine)
        this.tetherUI = null;
        this.tetherFill = null;
        this.tetherText = null;
        this.holdOnButton = null;
        this.echoDisplay = null;
        this.echo1Text = null;
        this.echo2Text = null;
        this.echoDespairText = null;
    }
    
    // ========================================
    // INITIALIZATION
    // ========================================
    
    init() {
        // Cache DOM references from game engine
        this.tetherUI = this.game.tetherUI;
        this.tetherFill = this.game.tetherFill;
        this.tetherText = this.game.tetherText;
        this.holdOnButton = this.game.holdOnButton;
        this.echoDisplay = this.game.echoDisplay;
        this.echo1Text = this.game.echo1Text;
        this.echo2Text = this.game.echo2Text;
        this.echoDespairText = this.game.echoDespairText;
        
        // Set up Hold On button listener
        if (this.holdOnButton) {
            this.holdOnButton.addEventListener('click', () => this.holdOn());
        }
        
        // Initial display update
        this.updateDisplay();
    }
    
    // ========================================
    // TETHER MANAGEMENT
    // ========================================
    
    updateTether(amount, reason = '') {
        // Update tether level (clamped 0-100)
        this.tetherLevel = Math.max(0, Math.min(100, this.tetherLevel + amount));
        
        // Update display
        this.updateDisplay();
        
        // Check for tether death
        if (this.tetherLevel <= 0) {
            this.stopDecay();
            this.onTetherDeath();
        }
        
        // Log for debugging
        if (reason) {
            console.log(`Tether: ${this.tetherLevel.toFixed(1)}% (${reason})`);
        }
        
        return this.tetherLevel;
    }
    
    updateDisplay() {
        // Update visual tether bar
        if (this.tetherFill) {
            this.tetherFill.style.width = this.tetherLevel + '%';
            
            // Add/remove critical class based on level
            if (this.tetherLevel <= 30) {
                this.tetherFill.classList.add('critical');
            } else {
                this.tetherFill.classList.remove('critical');
            }
        }
        
        // Tutorial flash: if tether hits 66% and player hasn't used Hold On yet
        if (!this.hasShownTutorialFlash && !this.hasUsedHoldOn && this.tetherLevel <= 66) {
            this.flashHoldOnButton();
            this.hasShownTutorialFlash = true;
            localStorage.setItem('tetherTutorialShown', 'true');
        }
        
        // Update hold-on button critical state
        if (this.holdOnButton) {
            if (this.tetherLevel <= 30) {
                this.holdOnButton.classList.add('critical');
            } else {
                this.holdOnButton.classList.remove('critical');
            }
        }
        
        // Update text display
        if (this.tetherText) {
            this.tetherText.textContent = Math.floor(this.tetherLevel) + '%';
        }
    }
    
    // ========================================
    // PASSIVE DECAY SYSTEM
    // ========================================
    
    startDecay() {
        // Start passive tether decay timer
        if (this.tetherDecayTimer) {
            // Already running, don't start duplicate
            return;
        }
        
        this.tetherDecayTimer = setInterval(() => {
            this.applyDecay();
        }, this.DECAY_INTERVAL_MS);
        
        console.log('Tether decay started');
    }
    
    stopDecay() {
        if (this.tetherDecayTimer) {
            clearInterval(this.tetherDecayTimer);
            this.tetherDecayTimer = null;
            console.log('Tether decay stopped');
        }
        
        // Also clear cooldown timer if active
        if (this.holdOnCooldownTimer) {
            clearInterval(this.holdOnCooldownTimer);
            this.holdOnCooldownTimer = null;
        }
    }
    
    cleanup() {
        // ZEERAH'S FIX: Complete cleanup when route ends
        // Stop all timers
        this.stopDecay();
        
        // Clear cooldown state
        this.holdOnCooldown = false;
        if (this.holdOnButton) {
            this.holdOnButton.textContent = 'HOLD ON';
            this.holdOnButton.disabled = false;
        }
        
        console.log('Tether system fully cleaned up');
    }
    
    applyDecay() {
        // Calculate decay rate based on current tether level
        let decayAmount = this.tetherDecayRate;
        
        // Gentle acceleration when low
        if (this.tetherLevel < this.DECAY_MEDIUM_THRESHOLD) {
            decayAmount = this.DECAY_MEDIUM_RATE;
        }
        if (this.tetherLevel < this.DECAY_CRITICAL_THRESHOLD) {
            decayAmount = this.DECAY_CRITICAL_RATE;
        }
        
        // Apply decay
        this.updateTether(-decayAmount, 'passive decay');
        
        // Trigger glitch effect if critical
        if (this.tetherLevel < this.CRITICAL_THRESHOLD) {
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
    
    // ========================================
    // HOLD ON BUTTON (MANUAL BOOST)
    // ========================================
    
    holdOn() {
        // Player manually tries to maintain tether connection
        
        // Check if button is on cooldown
        if (this.holdOnCooldown) {
            console.log('Hold On button on cooldown');
            return;
        }
        
        // Mark that player has used Hold On at least once
        this.hasUsedHoldOn = true;
        
        // Apply tether boost
        this.updateTether(this.HOLD_ON_BOOST, 'HOLD ON button pressed');
        
        // Visual feedback
        if (this.holdOnButton) {
            this.holdOnButton.textContent = 'HOLDING...';
            this.holdOnButton.disabled = true;
            this.holdOnButton.classList.remove('tutorial-flash'); // Remove flash if active
        }
        
        // Set cooldown
        this.holdOnCooldown = true;
        
        // Start countdown display
        let remainingSeconds = Math.ceil(this.HOLD_ON_COOLDOWN_MS / 1000);
        this.holdOnCooldownTimer = setInterval(() => {
            remainingSeconds--;
            if (remainingSeconds > 0 && this.holdOnButton) {
                this.holdOnButton.textContent = `HOLD ON (${remainingSeconds}s)`;
            }
        }, 1000);
        
        // Reset button after cooldown
        setTimeout(() => {
            this.holdOnCooldown = false;
            if (this.holdOnCooldownTimer) {
                clearInterval(this.holdOnCooldownTimer);
                this.holdOnCooldownTimer = null;
            }
            if (this.holdOnButton) {
                this.holdOnButton.textContent = 'HOLD ON';
                this.holdOnButton.disabled = false;
            }
            console.log('Hold On button ready');
        }, this.HOLD_ON_COOLDOWN_MS);
        
        // Add route points for engagement
        if (this.route && this.route.addRoutePoints) {
            this.route.addRoutePoints('true', 1);
        }
    }
    
    flashHoldOnButton() {
        // One-time tutorial flash to draw attention to Hold On button
        if (this.holdOnButton && !this.holdOnCooldown) {
            this.holdOnButton.classList.add('tutorial-flash');
            console.log('Tutorial: Flashing Hold On button');
        }
    }
    
    // ========================================
    // ECHO SYSTEM
    // ========================================
    
    showEchoes(echoDialogue) {
        // Display echo commentary alongside main dialogue
        // Creates the "voices in her head" effect
        
        if (!this.echoDisplay) return;
        
        // Clear previous echoes
        if (this.echo1Text) this.echo1Text.textContent = '';
        if (this.echo2Text) this.echo2Text.textContent = '';
        if (this.echoDespairText) this.echoDespairText.textContent = '';
        
        // Show echo display container
        this.echoDisplay.style.display = 'block';
        
        // Set echo content if provided
        if (echoDialogue.echo1 && this.echo1Text) {
            this.echo1Text.textContent = 'Echo 1: ' + echoDialogue.echo1;
            this.echoes.echo1.active = true;
        }
        
        if (echoDialogue.echo2 && this.echo2Text) {
            this.echo2Text.textContent = 'Echo 2: ' + echoDialogue.echo2;
            this.echoes.echo2.active = true;
        }
        
        if (echoDialogue.despair && this.echoDespairText) {
            this.echoDespairText.textContent = 'Despair: ' + echoDialogue.despair;
            this.echoes.despair.active = true;
        }
    }
    
    hideEchoes() {
        if (this.echoDisplay) {
            this.echoDisplay.style.display = 'none';
        }
        
        // Mark all echoes as inactive
        this.echoes.echo1.active = false;
        this.echoes.echo2.active = false;
        this.echoes.despair.active = false;
    }
    
    updateEchoMood(echoId, mood) {
        // Update the mood state of a specific echo
        if (this.echoes[echoId]) {
            this.echoes[echoId].mood = mood;
            console.log(`Echo ${echoId} mood updated: ${mood}`);
        }
    }
    
    // ========================================
    // TETHER DEATH HANDLER
    // ========================================
    
    onTetherDeath() {
        // Callback when tether reaches 0%
        // This should be handled by the route, but we provide a default
        
        console.log('Tether death triggered');
        
        // Store current version before increment
        const failedVersion = this.game.loopVersion;
        
        // Show game over screen
        this.game.displayScene({
            character: 'System',
            dialogue: 'CRITICAL FAILURE. TETHER SEVERED.',
            internal: `[Tori's consciousness fragments into static]\n[Version ${failedVersion} timeline COLLAPSED]\n\n**"The loop continues. She deserves another chance."**`,
            background: 'assets/digitalSpace.png',
            style: 'critical',
            choices: [
                { text: '[BEGIN NEXT ATTEMPT]', value: 'retry' },
                { text: '[ABANDON TIMELINE]', value: 'menu' }
            ],
            onChoice: (choice) => {
                if (choice === 'retry') {
                    // Increment version for next attempt
                    this.game.incrementVersion();
                    
                    // ZEERAH'S FIX: Use proper loop init screen like Ronnie's route
                    this.game.showLoopInit(() => {
                        // Reset tether and restart
                        this.reset();
                        if (this.route && this.route.act1) {
                            this.route.act1.start();
                        }
                    });
                } else {
                    if (this.game.returnToMainMenu) {
                        this.game.returnToMainMenu();
                    }
                }
            }
        }, 'tether_death');
    }
    
    // ========================================
    // STATE MANAGEMENT
    // ========================================
    
    reset() {
        // Reset tether to full
        this.tetherLevel = 100;
        this.updateDisplay();
        
        // Clear cooldowns
        this.holdOnCooldown = false;
        if (this.holdOnButton) {
            this.holdOnButton.textContent = 'HOLD ON';
            this.holdOnButton.disabled = false;
        }
        
        // Restart decay
        this.stopDecay();
        this.startDecay();
        
        console.log('Tether system reset');
    }
    
    getState() {
        // Return current state for save system
        return {
            tetherLevel: this.tetherLevel,
            echoes: JSON.parse(JSON.stringify(this.echoes)),
            holdOnCooldown: this.holdOnCooldown
        };
    }
    
    restoreState(state) {
        // Restore from saved state
        this.tetherLevel = state.tetherLevel || 100;
        this.echoes = state.echoes || this.echoes;
        this.holdOnCooldown = state.holdOnCooldown || false;
        
        // Update display
        this.updateDisplay();
        
        console.log('Tether system state restored');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TetherSystem;
}
