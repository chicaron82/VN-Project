// ========================================
// SETTINGS MANAGER
// Handles text speed, auto-advance, and preferences
// ========================================

class SettingsManager {
    constructor(game) {
        this.game = game;
        
        // Default settings
        this.settings = {
            textSpeed: 'normal',      // slow, normal, fast, instant
            autoAdvance: false,        // Auto-advance dialogue
            autoDelay: 2000,          // Delay in ms before auto-advance
            fullscreen: false,
            displayMode: 'auto'       // auto, portrait, landscape
        };
        
        // Speed multipliers (affects typewriter delay)
        this.speedMultipliers = {
            slow: 2.0,      // 2x slower
            normal: 1.0,    // Default speed
            fast: 0.5,      // 2x faster
            instant: 0      // No delay
        };
        
        // Auto-advance timer
        this.autoAdvanceTimer = null;
        
        // Load settings from localStorage
        this.loadSettings();
        
        // Apply display mode immediately (before UI setup)
        this.applyDisplayMode(this.settings.displayMode);
        
        // Setup UI event listeners
        this.setupUI();
    }
    
    loadSettings() {
        const saved = localStorage.getItem('gameSettings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (e) {
                console.error('Failed to load settings:', e);
            }
        }
    }
    
    saveSettings() {
        localStorage.setItem('gameSettings', JSON.stringify(this.settings));
    }
    
    setupUI() {
        // Text Speed Buttons
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const speed = btn.dataset.speed;
                this.setTextSpeed(speed);
            });
        });
        
        // Auto-Advance Toggle
        const autoToggle = document.getElementById('auto-advance-toggle');
        if (autoToggle) {
            autoToggle.checked = this.settings.autoAdvance;
            autoToggle.addEventListener('change', (e) => {
                this.setAutoAdvance(e.target.checked);
            });
        }
        
        // Auto-Advance Delay Slider
        const delaySlider = document.getElementById('auto-delay-slider');
        if (delaySlider) {
            delaySlider.value = this.settings.autoDelay;
            delaySlider.addEventListener('input', (e) => {
                this.setAutoDelay(parseInt(e.target.value));
            });
        }
        
        // Settings Fullscreen Button
        const settingsFullscreenBtn = document.getElementById('settings-fullscreen-btn');
        if (settingsFullscreenBtn) {
            settingsFullscreenBtn.addEventListener('click', () => {
                this.game.toggleFullscreen();
            });
        }
        
        // Display Mode Buttons
        document.querySelectorAll('.display-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                this.setDisplayMode(mode);
            });
        });
        
        // Apply loaded settings to UI
        this.updateUI();
        
        // Apply display mode now that DOM is ready (deferred from constructor)
        this.applyDisplayMode(this.settings.displayMode);
    }
    
    updateUI() {
        // Update speed buttons
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.speed === this.settings.textSpeed);
        });
        
        // Update display mode buttons
        document.querySelectorAll('.display-mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === this.settings.displayMode);
        });
        
        // Update auto-advance status
        const autoStatus = document.getElementById('auto-advance-status');
        if (autoStatus) {
            autoStatus.textContent = this.settings.autoAdvance ? 'ON' : 'OFF';
        }
        
        // Show/hide auto-delay row
        const autoDelayRow = document.getElementById('auto-delay-row');
        if (autoDelayRow) {
            autoDelayRow.style.display = this.settings.autoAdvance ? 'flex' : 'none';
        }
        
        // Update delay value display
        const delayValue = document.getElementById('auto-delay-value');
        if (delayValue) {
            delayValue.textContent = (this.settings.autoDelay / 1000).toFixed(1) + 's';
        }
    }
    
    setTextSpeed(speed) {
        this.settings.textSpeed = speed;
        this.saveSettings();
        this.updateUI();
        console.log('Text speed set to:', speed);
    }
    
    setAutoAdvance(enabled) {
        this.settings.autoAdvance = enabled;
        this.saveSettings();
        this.updateUI();
        
        // Clear any existing timer
        if (this.autoAdvanceTimer) {
            clearTimeout(this.autoAdvanceTimer);
            this.autoAdvanceTimer = null;
        }
        
        console.log('Auto-advance:', enabled ? 'ON' : 'OFF');
    }
    
    setAutoDelay(delay) {
        this.settings.autoDelay = delay;
        this.saveSettings();
        this.updateUI();
    }
    
    getTypewriterDelay() {
        // Returns the delay per character based on current speed setting
        const baseDelay = 30; // Base delay in ms
        const multiplier = this.speedMultipliers[this.settings.textSpeed];
        return baseDelay * multiplier;
    }
    
    startAutoAdvance(callback) {
        // Start auto-advance timer if enabled
        if (!this.settings.autoAdvance) return;
        
        // Clear any existing timer
        if (this.autoAdvanceTimer) {
            clearTimeout(this.autoAdvanceTimer);
        }
        
        // Set new timer
        this.autoAdvanceTimer = setTimeout(() => {
            if (callback) callback();
        }, this.settings.autoDelay);
    }
    
    cancelAutoAdvance() {
        if (this.autoAdvanceTimer) {
            clearTimeout(this.autoAdvanceTimer);
            this.autoAdvanceTimer = null;
        }
    }
    
    resetSettings() {
        this.settings = {
            textSpeed: 'normal',
            autoAdvance: false,
            autoDelay: 2000,
            fullscreen: false
        };
        this.saveSettings();
        this.updateUI();
        
        // Update toggle checkbox
        const autoToggle = document.getElementById('auto-advance-toggle');
        if (autoToggle) {
            autoToggle.checked = false;
        }
        
        console.log('Settings reset to default');
    }
    
    setDisplayMode(mode) {
        this.settings.displayMode = mode;
        this.saveSettings();
        this.updateUI();
        this.applyDisplayMode(mode);
        console.log('Display mode set to:', mode);
    }
    
    applyDisplayMode(mode) {
        const gameContainer = document.getElementById('game-container');
        
        // Safety check: DOM might not be ready yet during initialization
        if (!gameContainer) {
            console.log('Display mode deferred - DOM not ready yet');
            // Will be applied when settings menu opens (updateUI calls it)
            return;
        }
        
        // Remove all display mode classes
        gameContainer.classList.remove('force-portrait', 'force-landscape');
        
        // Apply new mode
        if (mode === 'portrait') {
            gameContainer.classList.add('force-portrait');
        } else if (mode === 'landscape') {
            gameContainer.classList.add('force-landscape');
        }
        // 'auto' mode = no special class, uses natural media queries
        
        console.log('Display mode applied:', mode);
    }
}

// ========================================
// DIALOGUE BACKLOG MANAGER
// Tracks and displays dialogue history
// ========================================

class BacklogManager {
    constructor(game) {
        this.game = game;
        this.history = [];
        this.maxEntries = 100; // Keep last 100 dialogue entries
    }
    
    addEntry(character, dialogue, isDistorted = false) {
        // Don't add empty dialogue or narration-only entries
        if (!dialogue || dialogue.trim() === '') return;
        
        // Add to history
        this.history.push({
            character: character || 'Narration',
            dialogue: dialogue,
            timestamp: Date.now(),
            distorted: isDistorted // Flag for hijacked/corrupted dialogue
        });
        
        // Trim to max entries
        if (this.history.length > this.maxEntries) {
            this.history.shift();
        }
    }
    
    clearHistory() {
        this.history = [];
    }
    
    render() {
        const backlogList = document.getElementById('backlog-list');
        if (!backlogList) return;
        
        // Clear existing content
        backlogList.innerHTML = '';
        
        if (this.history.length === 0) {
            backlogList.innerHTML = '<p class="backlog-empty">No dialogue history yet.</p>';
            return;
        }
        
        // Render entries in reverse order (newest first)
        for (let i = this.history.length - 1; i >= 0; i--) {
            const entry = this.history[i];
            const entryDiv = document.createElement('div');
            entryDiv.className = 'backlog-entry';
            
            // Add distorted class if flagged
            if (entry.distorted) {
                entryDiv.classList.add('backlog-distorted');
            }
            
            const characterDiv = document.createElement('div');
            characterDiv.className = 'backlog-character';
            characterDiv.textContent = entry.character;
            
            const dialogueDiv = document.createElement('div');
            dialogueDiv.className = 'backlog-dialogue';
            dialogueDiv.textContent = entry.dialogue;
            
            // Add distortion badge if flagged
            if (entry.distorted) {
                const badge = document.createElement('span');
                badge.className = 'distortion-badge';
                badge.textContent = '[DISTORTION]';
                dialogueDiv.appendChild(badge);
            }
            
            entryDiv.appendChild(characterDiv);
            entryDiv.appendChild(dialogueDiv);
            backlogList.appendChild(entryDiv);
        }
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SettingsManager, BacklogManager };
}
