// ========================================
// SETTINGS MANAGER
// Handles text speed, auto-advance, and preferences
// ========================================

/**
 * ════════════════════════════════════════════════════════════════
 * SETTINGS-MANAGER.JS - Game Settings & Preferences System
 * Manages all player preferences, difficulty modes, and persistence
 * ════════════════════════════════════════════════════════════════
 *
 * TABLE OF CONTENTS
 * (Line numbers approximate - use search to locate sections)
 *
 * 1. INITIALIZATION .............................. Line 80
 *    - Constructor
 *    - Default settings object
 *    - Speed multipliers
 *    - Backlog initialization
 *
 * 2. SETTINGS PERSISTENCE ........................ Line 140
 *    - loadSettings() from localStorage
 *    - saveSettings() to localStorage
 *    - resetSettings() to defaults
 *
 * 3. TEXT SPEED SETTINGS ......................... Line 210
 *    - setTextSpeed() control
 *    - getTextSpeed() accessor
 *    - Speed multipliers (slow, normal, fast, instant)
 *
 * 4. AUTO-ADVANCE SETTINGS ....................... Line 280
 *    - setAutoAdvance() toggle
 *    - getAutoAdvance() accessor
 *    - setAutoDelay() timing control
 *
 * 5. DISPLAY SETTINGS ............................ Line 350
 *    - setDisplayMode() (auto, portrait, landscape)
 *    - setFullscreen() toggle
 *
 * 6. DIFFICULTY SETTINGS ......................... Line 420
 *    - setDifficulty() (Easy/Normal/Intense/INSANE)
 *    - getDifficulty() accessor
 *    - Difficulty descriptions and validation
 *
 * 7. ACCESSIBILITY SETTINGS ...................... Line 520
 *    - setHapticEnabled() haptic feedback toggle
 *    - getHapticEnabled() accessor
 *    - setComfortMode() glitch effects toggle
 *    - getComfortMode() accessor
 *    - applyComfortMode() visual updates
 *
 * 8. BACKLOG SYSTEM (TIME MACHINE) ............... Line 650
 *    - addBacklogEntry() capture dialogue state
 *    - getBacklog() retrieve history
 *    - clearBacklog() reset history
 *    - jumpToBacklogEntry() time travel
 *    - Unjumpable moment filtering
 *
 * 9. UI UPDATES .................................. Line 850
 *    - updateUI() sync sliders/toggles
 *    - updateDifficultyDisplay() difficulty tab
 *    - updateSpeedDisplay() text speed display
 *
 * 10. GETTER METHODS ............................. Line 1020
 *     - getTextSpeed()
 *     - getAutoAdvance()
 *     - getAutoDelay()
 *     - getDifficulty()
 *     - getHapticEnabled()
 *     - getComfortMode()
 *
 * ════════════════════════════════════════════════════════════════
 * SETTINGS STORED IN LOCALSTORAGE:
 * - textSpeed (slow/normal/fast/instant)
 * - autoAdvance (boolean)
 * - autoDelay (milliseconds)
 * - autoSkipPrologue (boolean)
 * - fullscreen (boolean)
 * - displayMode (auto/portrait/landscape)
 * - tetherDifficulty (Easy/Normal/Intense/INSANE)
 * - hapticEnabled (boolean - default OFF)
 * - comfortMode (boolean - disable glitch effects, default OFF)
 *
 * Integration Points:
 * - Game engine (applies settings to gameplay)
 * - Typewriter system (text speed control)
 * - Haptic system (vibration feedback)
 * - Tether system (difficulty scaling)
 * - UI (settings button in main menu & pause menu)
 * - Visual effects (comfort mode disables glitches)
 * ════════════════════════════════════════════════════════════════
 */

/**
 * SettingsManager
 *
 * Handles user preferences, difficulty settings, and backlog (time machine) system.
 * Manages localStorage persistence for all settings.
 *
 * Responsibilities:
 * - Text speed, auto-advance, haptics, fullscreen toggles
 * - Difficulty mode switching (Easy/Normal/Intense/INSANE)
 * - Backlog system (time machine - click past dialogue to jump back)
 * - Setting validation and application
 *
 * Settings Persist Across Sessions:
 * - Text speed, auto-advance delay, haptic feedback
 * - Difficulty preference
 * - Skip prologue, reduce glitch effects
 *
 * Time Machine Backlog:
 * - Stores last 100 dialogue entries
 * - Captures game state (sprites, background, flags, tether)
 * - Allows jumping back to specific moments
 * - Unjumpable moments: System narration, critical story beats
 *
 * @class SettingsManager
 */
class SettingsManager {
    constructor(game) {
        this.game = game;

        // Detect if running on Android for haptic default
        // DIZEE FIX: Default to TRUE if device supports vibration, regardless of OS checks
        const canVibrate = 'vibrate' in navigator;
        const defaultHapticsEnabled = canVibrate;

        // Default settings
        this.settings = {
            textSpeed: 'normal',      // slow, normal, fast, instant
            autoAdvance: false,        // Auto-advance dialogue
            autoDelay: 2000,          // Delay in ms before auto-advance
            autoSkipPrologue: false,  // Auto-skip prologue when unlocked
            fullscreen: false,
            displayMode: 'auto',      // auto, portrait, landscape
            tetherDifficulty: 'normal', // relaxed, normal, intense
            hapticEnabled: defaultHapticsEnabled, // ZEE'S ADDITION: Haptic feedback (ON for Android with vibration support, OFF otherwise) 🖤
            comfortMode: false,       // DIZEE: Disable glitch effects (default OFF)
            comfortIntensity: 1       // TORI'S ADDITION: Visual/haptic intensity (0=Gentle, 1=Normal, 2=Amped) 💚
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

        // DIZEE: Apply comfort mode on init
        this.applyComfortMode(this.settings.comfortMode);

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

        // Auto-Skip Prologue Toggle
        const autoSkipPrologueToggle = document.getElementById('auto-skip-prologue-toggle');
        const autoSkipPrologueStatus = document.getElementById('auto-skip-prologue-status');
        const autoSkipPrologueContainer = document.getElementById('auto-skip-prologue-container');

        if (autoSkipPrologueToggle && autoSkipPrologueStatus) {
            // Check if unlocked
            const isUnlocked = this.game.skipPrologueUnlocked;

            if (!isUnlocked) {
                // Disabled state - grayed out (visual feedback is enough)
                autoSkipPrologueToggle.disabled = true;
                autoSkipPrologueStatus.textContent = 'LOCKED';
                autoSkipPrologueStatus.style.color = 'rgba(255, 255, 255, 0.3)';
            } else {
                // Unlocked - functional
                autoSkipPrologueToggle.disabled = false;
                autoSkipPrologueToggle.checked = this.settings.autoSkipPrologue;
                autoSkipPrologueStatus.textContent = this.settings.autoSkipPrologue ? 'ON' : 'OFF';
                autoSkipPrologueStatus.style.color = ''; // Reset to default

                autoSkipPrologueToggle.addEventListener('change', (e) => {
                    this.setAutoSkipPrologue(e.target.checked);
                });
            }
        }

        // Settings Fullscreen Button
        const settingsFullscreenBtn = document.getElementById('settings-fullscreen-btn');
        if (settingsFullscreenBtn) {
            settingsFullscreenBtn.addEventListener('click', () => {
                this.game.toggleFullscreen();
            });
        }

        // ZEE'S ADDITION: Haptic Feedback Toggle 🖤
        const hapticToggle = document.getElementById('haptic-toggle');
        if (hapticToggle) {
            // Set initial state from settings
            hapticToggle.checked = this.settings.hapticEnabled;

            // Listen for changes
            hapticToggle.addEventListener('change', (e) => {
                this.setHapticEnabled(e.target.checked);
            });
        }

        // DIZEE: Comfort Mode Toggle
        const comfortModeToggle = document.getElementById('comfort-mode-toggle');
        if (comfortModeToggle) {
            // Set initial state from settings
            comfortModeToggle.checked = this.settings.comfortMode;

            // Listen for changes
            comfortModeToggle.addEventListener('change', (e) => {
                this.setComfortMode(e.target.checked);
            });
        }

        // DIZEE: Visual Intensity Slider 👁️
        const visualSlider = document.getElementById('visual-intensity-slider');
        if (visualSlider) {
            // Set initial value from settings
            visualSlider.value = this.getVisualIntensity();

            // Listen for changes - triggers live preview
            visualSlider.addEventListener('input', (e) => {
                const level = Number(e.target.value);
                this.setVisualIntensity(level);
            });
        }

        // DIZEE: Haptic Intensity Slider 📳
        const hapticSlider = document.getElementById('haptic-intensity-slider');
        if (hapticSlider) {
            // Set initial value from settings
            hapticSlider.value = this.getHapticIntensity();

            // Listen for changes - triggers live preview
            hapticSlider.addEventListener('input', (e) => {
                const level = Number(e.target.value);
                this.setHapticIntensity(level);
            });
        }

        // Display Mode Buttons
        document.querySelectorAll('.display-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                this.setDisplayMode(mode);
            });
        });

        // Tether Difficulty Buttons
        document.querySelectorAll('.tether-difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const difficulty = btn.dataset.difficulty;

                // INSANE MODE: Show warning confirmation
                if (difficulty === 'insane') {
                    // Check if unlocked
                    const insaneUnlocked = localStorage.getItem('insaneModeUnlocked') === 'true';

                    if (!insaneUnlocked) {
                        // Show locked message with immersive overlay
                        this.game.showWarningOverlay(
                            '💀 INSANE MODE LOCKED',
                            'Complete ANY ending on INTENSE difficulty to unlock this mode.'
                        );
                        return;
                    }

                    // Check if already in insane mode (can't change)
                    if (this.game.gameState && this.game.gameState.flags && this.game.gameState.flags.insaneModeLocked) {
                        // EMOTIONAL FEEDBACK: Harsh denial for insane mode lockout
                        if (this.game.triggerSensoryFeedback) {
                            this.game.triggerSensoryFeedback('harshDenial', difficultyOption, 'Insane mode locked - no escape');
                        }

                        this.game.showWarningOverlay(
                            '⚠️ INSANE MODE ACTIVE',
                            'You are locked into Insane difficulty.\n\nThere is no escape once committed.'
                        );
                        return;
                    }

                    // Show warning dialog
                    this.showInsaneModeWarning();
                } else {
                    // Normal difficulty change
                    // Check if locked in insane mode
                    if (this.game.gameState && this.game.gameState.flags && this.game.gameState.flags.insaneModeLocked) {
                        // EMOTIONAL FEEDBACK: Harsh denial for difficulty change attempt
                        if (this.game.triggerSensoryFeedback) {
                            this.game.triggerSensoryFeedback('harshDenial', difficultyOption, 'Insane mode locked - cannot change');
                        }

                        this.game.showWarningOverlay(
                            '⚠️ DIFFICULTY LOCKED',
                            'You are locked into Insane mode.\n\nCannot change difficulty.'
                        );
                        return;
                    }
                    this.setTetherDifficulty(difficulty);
                }
            });
        });

        // ZEERAH'S SECRET CODES UI SETUP
        this.setupSecretCodesUI();

        // Setup tab switching
        this.setupTabSystem();

        // Apply loaded settings to UI
        this.updateUI();

        // Apply display mode now that DOM is ready (deferred from constructor)
        this.applyDisplayMode(this.settings.displayMode);
    }

    setupTabSystem() {
        // Tab switching
        document.querySelectorAll('.settings-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.settings-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `tab-${tabName}`);
        });

        console.log('Switched to tab:', tabName);
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

        // Update tether difficulty buttons
        const insaneUnlocked = localStorage.getItem('insaneModeUnlocked') === 'true';
        const insaneLocked = this.game.gameState && this.game.gameState.flags && this.game.gameState.flags.insaneModeLocked;

        document.querySelectorAll('.tether-difficulty-btn').forEach(btn => {
            const difficulty = btn.dataset.difficulty;

            // Update active state
            btn.classList.toggle('active', difficulty === this.settings.tetherDifficulty);

            // Handle Insane button states
            if (difficulty === 'insane') {
                if (insaneUnlocked) {
                    btn.classList.remove('insane-locked');
                    btn.classList.add('insane-unlocked');
                } else {
                    btn.classList.add('insane-locked');
                    btn.classList.remove('insane-unlocked');
                }
            }

            // Disable all buttons if locked in insane mode
            if (insaneLocked && difficulty !== 'insane') {
                btn.disabled = true;
                btn.style.opacity = '0.3';
                btn.style.cursor = 'not-allowed';
            }
        });

        // Update insane mode explanations
        const lockedExplanation = document.getElementById('insane-explanation-locked');
        const unlockedExplanation = document.getElementById('insane-explanation-unlocked');

        if (lockedExplanation && unlockedExplanation) {
            if (insaneUnlocked) {
                lockedExplanation.style.display = 'none';
                unlockedExplanation.style.display = 'block';
            } else {
                lockedExplanation.style.display = 'block';
                unlockedExplanation.style.display = 'none';
            }
        }

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

        // DIZEE: Update visual intensity slider 👁️
        const visualSlider = document.getElementById('visual-intensity-slider');
        const visualLabel = document.getElementById('visual-intensity-label');
        if (visualSlider) {
            const savedVisual = this.getVisualIntensity();
            visualSlider.value = savedVisual;

            // Update label to match saved value
            if (visualLabel) {
                const labels = ['Off', 'Reduced', 'Normal', 'Enhanced'];
                const colors = ['#666', '#00ff88', '#0ff', '#ff00ff'];
                visualLabel.textContent = labels[savedVisual];
                visualLabel.style.color = colors[savedVisual];
                visualLabel.style.textShadow = `0 0 10px ${colors[savedVisual]}`;
            }
        }

        // DIZEE: Update haptic intensity slider 📳
        const hapticSlider = document.getElementById('haptic-intensity-slider');
        const hapticLabel = document.getElementById('haptic-intensity-label');
        if (hapticSlider) {
            const savedHaptic = this.getHapticIntensity();
            hapticSlider.value = savedHaptic;

            // Update label to match saved value
            if (hapticLabel) {
                const labels = ['Off', 'Gentle', 'Normal', 'Amped'];
                const colors = ['#666', '#00ff88', '#0ff', '#ff00ff'];
                hapticLabel.textContent = labels[savedHaptic];
                hapticLabel.style.color = colors[savedHaptic];
                hapticLabel.style.textShadow = `0 0 10px ${colors[savedHaptic]}`;
            }
        }

        // Update auto-skip prologue status (for dynamic unlock)
        const autoSkipToggle = document.getElementById('auto-skip-prologue-toggle');
        const autoSkipStatus = document.getElementById('auto-skip-prologue-status');
        if (autoSkipToggle && autoSkipStatus) {
            const isUnlocked = this.game.skipPrologueUnlocked;

            if (isUnlocked) {
                autoSkipToggle.disabled = false;
                autoSkipToggle.checked = this.settings.autoSkipPrologue;
                autoSkipStatus.textContent = this.settings.autoSkipPrologue ? 'ON' : 'OFF';
                autoSkipStatus.style.color = ''; // Reset to default
            } else {
                autoSkipToggle.disabled = true;
                autoSkipToggle.checked = false;
                autoSkipStatus.textContent = 'LOCKED';
                autoSkipStatus.style.color = 'rgba(255, 255, 255, 0.3)';
            }
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

    setAutoSkipPrologue(enabled) {
        this.settings.autoSkipPrologue = enabled;
        this.saveSettings();

        // Update UI
        const status = document.getElementById('auto-skip-prologue-status');
        if (status) {
            status.textContent = enabled ? 'ON' : 'OFF';
        }

        console.log('Auto-Skip Prologue:', enabled ? 'ENABLED' : 'DISABLED');
    }

    setTetherDifficulty(difficulty) {
        const previousDifficulty = this.settings.tetherDifficulty || 'normal';
        this.settings.tetherDifficulty = difficulty;
        this.saveSettings();
        this.updateUI();

        // Update tether system if it exists
        if (this.game.tetherSystem) {
            this.game.tetherSystem.setDifficultyModifier(difficulty);
        }

        // TORI'S FOURTH WALL BREAK: React if changed mid-game during Tori's route
        if (previousDifficulty !== difficulty && this.game.currentRoute === 'tori') {
            const changeType = this.getDifficultyChangeType(previousDifficulty, difficulty);
            this.game.triggerTetherReaction(changeType);
        }

        console.log('Tether difficulty set to:', difficulty);
    }

    // ========================================
    // HAPTIC FEEDBACK
    // ZEE'S ADDITION: Mobile immersion through vibration 🖤
    // ========================================

    getHapticEnabled() {
        return this.settings.hapticEnabled;
    }

    setHapticEnabled(enabled) {
        this.settings.hapticEnabled = enabled;
        this.saveSettings();
        this.updateUI();
        console.log(`📳 Haptic feedback: ${enabled ? 'ENABLED' : 'DISABLED'}`);

        // Test vibration when enabled
        if (enabled && this.game && this.game.triggerSensoryFeedback) {
            this.game.triggerSensoryFeedback('buttonPress', null, 'Settings toggle test');
        }
    }

    // ========================================
    // COMFORT MODE
    // DIZEE: Accessibility - disable glitch effects
    // ========================================

    getComfortMode() {
        return this.settings.comfortMode;
    }

    setComfortMode(enabled) {
        this.settings.comfortMode = enabled;
        this.saveSettings();
        this.updateUI();
        console.log(`🛡️ Comfort Mode: ${enabled ? 'ENABLED' : 'DISABLED'}`);

        // Update glitch effects immediately
        this.applyComfortMode(enabled);
    }

    applyComfortMode(enabled) {
        // Set body data attribute for visual cue system
        document.body.setAttribute('data-comfort-mode', enabled ? 'true' : 'false');

        // Find all elements with glitch effects
        const glitchElements = document.querySelectorAll('.version-glitch');

        glitchElements.forEach(el => {
            if (enabled) {
                // Disable glitch by adding comfort-mode class
                el.classList.add('comfort-mode');
            } else {
                // Re-enable glitch
                el.classList.remove('comfort-mode');
            }
        });
    }

    // ========================================
    // DUAL INTENSITY CONTROLS
    // DIZEE: Separate visual and haptic intensity for accessibility 💫
    // ========================================

    // VISUAL INTENSITY (0-3: Off, Reduced, Normal, Enhanced)
    getVisualIntensity() {
        // Migrate from old comfortIntensity if needed
        if (this.settings.visualIntensity === undefined && this.settings.comfortIntensity !== undefined) {
            // Map old 0-2 to new 0-3 scale (Gentle→Reduced, Normal→Normal, Amped→Enhanced)
            const migration = { 0: 1, 1: 2, 2: 3 };
            this.settings.visualIntensity = migration[this.settings.comfortIntensity] ?? 2;
        }
        return this.settings.visualIntensity ?? 2; // Default: Normal
    }

    setVisualIntensity(level) {
        const clamped = Math.max(0, Math.min(3, Number(level) || 0));
        this.settings.visualIntensity = clamped;
        this.saveSettings();
        this.updateUI();

        const labels = ['Off', 'Reduced', 'Normal', 'Enhanced'];
        console.log(`👁️ Visual Intensity: ${labels[clamped]}`);

        // Update visual label next to slider
        const intensityLabel = document.getElementById('visual-intensity-label');
        if (intensityLabel) {
            intensityLabel.textContent = labels[clamped];

            // Color-code the label
            const colors = ['#666', '#00ff88', '#0ff', '#ff00ff'];
            intensityLabel.style.color = colors[clamped];
            intensityLabel.style.textShadow = `0 0 10px ${colors[clamped]}`;

            // Visual effect preview
            this.previewVisualEffect(clamped, intensityLabel);
        }
    }

    previewVisualEffect(level, element) {
        // Remove any existing animation
        element.style.animation = 'none';

        // Force reflow to restart animation
        void element.offsetWidth;

        // Apply intensity-specific effect
        switch (level) {
            case 0: // Off - no animation
                break;
            case 1: // Reduced - subtle fade pulse
                element.style.animation = 'gentlePulse 0.6s ease-out';
                break;
            case 2: // Normal - moderate shake
                element.style.animation = 'normalShake 0.4s ease-out';
                break;
            case 3: // Enhanced - intense glitch
                element.style.animation = 'ampedGlitch 0.5s ease-out';
                break;
        }

        // Clear animation after it completes
        setTimeout(() => {
            element.style.animation = 'none';
        }, 600);
    }

    // HAPTIC INTENSITY (0-3: Off, Gentle, Normal, Amped)
    // Note: Insane (4) is only active when Insane Mode difficulty is enabled
    getHapticIntensity() {
        // Migrate from old comfortIntensity if needed
        if (this.settings.hapticIntensity === undefined && this.settings.comfortIntensity !== undefined) {
            // Map old 0-2 to new 0-3 scale (Gentle→Gentle, Normal→Normal, Amped→Amped)
            const migration = { 0: 1, 1: 2, 2: 3 };
            this.settings.hapticIntensity = migration[this.settings.comfortIntensity] ?? 2;
        }
        return this.settings.hapticIntensity ?? 2; // Default: Normal
    }

    setHapticIntensity(level) {
        const clamped = Math.max(0, Math.min(3, Number(level) || 0));
        this.settings.hapticIntensity = clamped;
        this.saveSettings();
        this.updateUI();

        const labels = ['Off', 'Gentle', 'Normal', 'Amped'];
        console.log(`📳 Haptic Intensity: ${labels[clamped]}`);

        // Update visual label next to slider
        const intensityLabel = document.getElementById('haptic-intensity-label');
        if (intensityLabel) {
            intensityLabel.textContent = labels[clamped];

            // Color-code the label
            const colors = ['#666', '#00ff88', '#0ff', '#ff00ff'];
            intensityLabel.style.color = colors[clamped];
            intensityLabel.style.textShadow = `0 0 10px ${colors[clamped]}`;
        }

        // Haptic preview (if enabled and not off)
        if (clamped > 0 && this.game && this.game.triggerSensoryFeedback) {
            const previewElement = document.getElementById('haptic-intensity-slider');

            // Different haptic patterns for each level
            const patterns = {
                1: 'buttonPress',   // Gentle
                2: 'cardSnap',      // Normal
                3: 'double'         // Amped (1-second double buzz)
            };

            this.game.triggerSensoryFeedback(patterns[clamped], previewElement, `Haptic preview: ${labels[clamped]}`);
        }
    }

    // BACKWARD COMPATIBILITY: Keep old method for existing code
    getComfortIntensity() {
        // Return haptic intensity for backward compatibility
        return this.getHapticIntensity();
    }


    // ========================================
    // INSANE MODE WARNING & COMMITMENT
    // ========================================

    showInsaneModeWarning() {
        const overlay = document.getElementById('insane-mode-warning');
        if (!overlay) {
            console.error('Insane mode warning overlay not found');
            return;
        }

        // Show overlay
        overlay.style.display = 'flex';

        // Setup button handlers
        const cancelBtn = document.getElementById('insane-warning-cancel');
        const proceedBtn = document.getElementById('insane-warning-proceed');

        // Remove old listeners
        const newCancelBtn = cancelBtn.cloneNode(true);
        const newProceedBtn = proceedBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        proceedBtn.parentNode.replaceChild(newProceedBtn, proceedBtn);

        // Add new listeners
        newCancelBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
            console.log('💚 Insane mode cancelled - chose mercy');
        });

        newProceedBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
            this.commitToInsaneMode();
        });
    }

    commitToInsaneMode() {
        console.log('💀 COMMITTING TO INSANE MODE');

        // Set difficulty to insane
        this.settings.tetherDifficulty = 'insane';
        this.saveSettings();

        // Lock the mode (cannot be changed)
        if (!this.game.gameState.flags) {
            this.game.gameState.flags = {};
        }
        this.game.gameState.flags.insaneModeLocked = true;
        this.game.gameState.flags.insaneModeActive = true;

        // Save the lock to localStorage
        localStorage.setItem('insaneModeLocked', 'true');

        // DIZEE FIX: Hide Hold On button in Insane Mode
        // You removed this safety. It stays gone.
        if (this.game.holdOnButton) {
            this.game.holdOnButton.style.display = 'none';
        }

        // Update UI
        this.updateUI();

        // Trigger Tori's reaction if in Tori's route
        if (this.game.currentRoute === 'tori' && this.game.triggerInsaneModeReaction) {
            this.game.triggerInsaneModeReaction();
        }

        console.log('⚠️ Insane mode locked. No escape.');

        // DIZEE POLISH: Automatically start Tori's route after commitment
        // Close settings and launch directly into the nightmare
        this.game.closeSettings();

        // Brief delay for dramatic effect
        setTimeout(() => {
            // Hide main menu first
            if (this.game.mainMenu) {
                this.game.mainMenu.style.opacity = '0';
                setTimeout(() => {
                    this.game.mainMenu.style.display = 'none';
                }, 800);
            }

            // Start Tori's route (it will show cage overlay at the right moment)
            setTimeout(() => {
                this.game.startRoute('tori');
            }, 1000);
        }, 500);
    }

    getDifficultyChangeType(oldDiff, newDiff) {
        const difficultyLevels = { relaxed: 0, normal: 1, intense: 2 };
        const oldLevel = difficultyLevels[oldDiff] || 1;
        const newLevel = difficultyLevels[newDiff] || 1;

        if (newLevel < oldLevel) return 'eased';
        if (newLevel > oldLevel) return 'tightened';
        return 'unchanged';
    }

    getTypewriterDelay() {
        // Returns the delay per character based on current speed setting
        const baseDelay = 30; // Base delay in ms
        const multiplier = this.speedMultipliers[this.settings.textSpeed];
        return baseDelay * multiplier;
    }

    startAutoAdvance(callback) {
        // Start auto-advance timer if enabled
        if (!this.settings.autoAdvance) {
            console.log('🔧 Auto-advance: disabled in settings');
            return;
        }

        console.log(`🔧 Auto-advance: Starting timer (${this.settings.autoDelay}ms)`);

        // Clear any existing timer
        if (this.autoAdvanceTimer) {
            clearTimeout(this.autoAdvanceTimer);
        }

        // Set new timer
        this.autoAdvanceTimer = setTimeout(() => {
            console.log('🔧 Auto-advance: Timer expired, advancing...');
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

    // ========================================
    // SECRET CODES UI
    // ========================================

    setupSecretCodesUI() {
        // Secret codes are now in dedicated tab - always accessible
        const submitBtn = document.getElementById('submit-code-btn');
        const codeInput = document.getElementById('secret-code-input');

        if (!submitBtn || !codeInput) return;

        // Submit code button
        submitBtn.addEventListener('click', () => {
            const code = codeInput.value.trim();
            if (!code) return;

            const result = this.submitSecretCode(code);
            this.showCodeResult(result);

            if (result.success) {
                codeInput.value = '';
                this.updateCodesUI();
            }
        });

        // Enter key to submit
        codeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });

        // Initial update
        this.updateCodesUI();
    }

    showCodeResult(result) {
        const messageDiv = document.getElementById('code-result-message');
        if (!messageDiv) return;

        if (result.success) {
            messageDiv.style.color = '#00ffaa';
            messageDiv.textContent = `✓ ${result.message}`;
        } else {
            messageDiv.style.color = '#ff6699';
            messageDiv.textContent = `✗ ${result.message}`;
        }

        // Clear message after 3 seconds
        setTimeout(() => {
            messageDiv.textContent = '';
        }, 3000);
    }

    // ========================================
    // SECRET CODES SYSTEM
    // DIZEE: Delegated to SecretCodesManager 🖤
    // ========================================

    submitSecretCode(code) {
        // Delegate to SecretCodesManager
        return this.game.secretCodesManager.submitCode(code);
    }

    updateCodesUI() {
        // Delegate to SecretCodesManager (if it exists)
        if (this.game.secretCodesManager) {
            this.game.secretCodesManager.updateCodesUI();
        }
    }

    // Backwards compatibility wrappers
    getCodeCount() {
        return this.game.secretCodesManager.getCodeCount();
    }

    hasDiscoveredCode(code) {
        return this.game.secretCodesManager.hasDiscoveredCode(code);
    }

    discoverCode(code) {
        return this.game.secretCodesManager.discoverCode(code);
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

        // Capture current game state for time travel
        const gameState = this.captureGameState();

        // DIZEE FIX: Extract scene ID string from scene object
        let sceneIdString = null;
        if (this.game.currentScene) {
            if (typeof this.game.currentScene === 'string') {
                sceneIdString = this.game.currentScene;
            } else if (this.game.currentScene.id) {
                sceneIdString = this.game.currentScene.id;
            } else if (this.game.gameState?.progress?.currentScene) {
                // Best source: sceneId stored in gameState.progress
                sceneIdString = this.game.gameState.progress.currentScene;
            }
        }

        // Add to history
        this.history.push({
            character: character || 'Narration',
            dialogue: dialogue,
            timestamp: Date.now(),
            distorted: isDistorted, // Flag for hijacked/corrupted dialogue
            // ZEERAH: Time travel data
            sceneId: sceneIdString,  // DIZEE FIX: Store string, not object
            routeName: this.game.currentRoute,
            pageIndex: this.game.currentPageIndex,
            gameState: gameState,
            isJumpable: this.isEntryJumpable(character, sceneIdString)  // DIZEE FIX: Pass string
        });

        // Trim to max entries
        if (this.history.length > this.maxEntries) {
            this.history.shift();
        }
    }

    captureGameState() {
        // Capture essential game state (not save data like unlocks)
        // Safe array handling for currentSprites
        let spritesArray = [];
        if (this.game.currentSprites) {
            try {
                spritesArray = Array.isArray(this.game.currentSprites)
                    ? [...this.game.currentSprites]
                    : [];
            } catch (e) {
                spritesArray = [];
            }
        }

        return {
            // Tether state (if in Tori's route)
            tetherLevel: this.game.tetherSystem ? this.game.tetherSystem.tetherLevel : null,

            // Current visuals
            currentSprites: spritesArray,
            currentBackground: this.game.currentBackground || null,

            // Game flags (choices made, etc.)
            flags: this.game.flags ? JSON.parse(JSON.stringify(this.game.flags)) : {}
        };
    }

    isEntryJumpable(character, sceneId) {
        // Unjumpable narrators (glitched/system moments)
        const lockedNarrators = ['System', 'ERROR', 'Despair', '???', 'STATIC', 'CORRUPTION'];
        if (lockedNarrators.includes(character)) {
            return false;
        }

        // Safety check: sceneId must be a string
        if (!sceneId || typeof sceneId !== 'string') {
            return true; // Default to jumpable if sceneId is invalid
        }

        // Unjumpable scene IDs (critical narrative events)
        const lockedScenes = [
            'despair_hijack',
            'echo_merge_sequence',
            'final_integration',
            'loop_failure',
            'device_activation',
            'gateway_confrontation'
        ];

        if (lockedScenes.some(scene => sceneId.includes(scene))) {
            return false;
        }

        // Can't jump back from endings or credits
        if (sceneId.includes('ending_') || sceneId.includes('credits')) {
            return false;
        }

        return true;
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

            // ZEERAH: Add jumpable/locked classes
            if (entry.isJumpable) {
                entryDiv.classList.add('jumpable');
                entryDiv.style.cursor = 'pointer';
                entryDiv.addEventListener('click', () => this.jumpToEntry(i));
            } else {
                entryDiv.classList.add('locked');

                // Add glitch class for system narrators
                const glitchNarrators = ['System', 'ERROR', 'Despair', '???', 'STATIC', 'CORRUPTION'];
                if (glitchNarrators.includes(entry.character)) {
                    entryDiv.classList.add('glitch');
                }
            }

            // Add distorted class if flagged
            if (entry.distorted) {
                entryDiv.classList.add('backlog-distorted');
            }

            // ZEE'S ADDITION: Add thumbnail if background exists 🖤
            const background = entry.gameState && entry.gameState.currentBackground
                ? entry.gameState.currentBackground
                : null;

            if (background) {
                const thumbnailDiv = document.createElement('div');
                thumbnailDiv.className = 'backlog-thumbnail';
                thumbnailDiv.style.backgroundImage = `url('${background}')`;
                entryDiv.appendChild(thumbnailDiv);
            }

            // ZEE'S ADDITION: Wrap text content in container for flexbox layout 🖤
            const textContainer = document.createElement('div');
            textContainer.className = 'backlog-text-content';

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

            // ZEERAH: Add hint text
            const hintDiv = document.createElement('div');
            hintDiv.className = 'backlog-hint';
            if (entry.isJumpable) {
                hintDiv.textContent = '⏮️ Click to jump back to this moment';
            } else {
                hintDiv.textContent = '🔒 Critical event - cannot revisit';
            }

            textContainer.appendChild(characterDiv);
            textContainer.appendChild(dialogueDiv);
            textContainer.appendChild(hintDiv);
            entryDiv.appendChild(textContainer);
            backlogList.appendChild(entryDiv);
        }
    }

    // ========================================
    // ZEERAH: TIME TRAVEL MECHANICS
    // ========================================

    jumpToEntry(index) {
        const entry = this.history[index];

        if (!entry) {
            console.error('Invalid backlog entry index:', index);
            return;
        }

        // INSANE MODE: Block time jumps
        if (this.game.gameState && this.game.gameState.flags && this.game.gameState.flags.insaneModeActive) {
            this.showJumpError('insane');
            return;
        }

        // Double-check jumpability
        if (!entry.isJumpable) {
            this.showJumpError(entry);
            return;
        }

        // Show custom confirmation overlay
        this.showTimeJumpConfirmation(entry, index);
    }

    showTimeJumpConfirmation(entry, index) {
        // ========================================
        // INSANE MODE: TIME MACHINE DISABLED
        // ========================================
        if (this.game.gameState.flags && this.game.gameState.flags.insaneModeActive) {
            this.showInsaneBacklogMessage();
            return; // Block time jump
        }

        const overlay = document.getElementById('time-jump-confirm');
        const messageDiv = document.getElementById('time-jump-message');

        if (!overlay || !messageDiv) {
            console.error('Time jump confirmation elements not found');
            return;
        }

        // Build confirmation message
        const dialoguePreview = entry.dialogue.length > 80
            ? entry.dialogue.substring(0, 80) + '...'
            : entry.dialogue;

        messageDiv.innerHTML = `
            <p>You are about to jump back to this moment:</p>
            <span class="dialogue-preview">"${dialoguePreview}"</span>
            <p>This will resume gameplay from this point in the story.</p>
            <p class="warning">⚠️ Your progress will rewind to this scene.</p>
        `;

        // Show overlay with flex display
        overlay.style.display = 'flex';

        // Set up button handlers
        const cancelBtn = document.getElementById('time-jump-cancel');
        const proceedBtn = document.getElementById('time-jump-proceed');

        // Remove old listeners
        const newCancelBtn = cancelBtn.cloneNode(true);
        const newProceedBtn = proceedBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        proceedBtn.parentNode.replaceChild(newProceedBtn, proceedBtn);

        // Add new listeners
        newCancelBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
        });

        newProceedBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
            this.executeTimeJump(entry);
        });
    }

    showInsaneBacklogMessage() {
        const message = `═══════════════════════════════════════
TIME MACHINE DISABLED
═══════════════════════════════════════

You can read your past.
You cannot change it.

This is Insane mode.
Every choice is permanent.
Every mistake is final.

Forward is the only direction.
═══════════════════════════════════════`;

        // Use game engine's notification system if available
        if (this.game.showUnlockOverlay) {
            this.game.showUnlockOverlay('TIME MACHINE DISABLED', message, 'warning');
        } else {
            alert(message); // Fallback
        }
    }

    executeTimeJump(entry) {
        console.log('💚 Time traveling to:', entry.sceneId, 'page', entry.pageIndex);

        // Restore game state
        this.restoreGameState(entry);

        // Close backlog
        this.game.closeBacklog();

        // ZEERAH: Clear old dialogue before jumping
        // Prevents lingering text from previous scene
        if (this.game.dialogueText) {
            this.game.dialogueText.textContent = '';
        }
        if (this.game.characterName) {
            this.game.characterName.textContent = '';
        }

        // ZEERAH: Jump to the scene like save loading does
        // This properly restores background, sprites, and dialogue
        if (entry.sceneId && this.game.currentRoute) {
            this.jumpToScene(entry.sceneId, entry.pageIndex);
        } else {
            // Fallback: just display current page
            if (this.game.displayCurrentPage) {
                this.game.displayCurrentPage();
            }
        }
    }

    jumpToScene(sceneId, pageIndex) {
        // DIZEE FIX: Handle if sceneId is an object instead of string (defensive fallback)
        let sceneIdString = sceneId;
        if (typeof sceneId === 'object' && sceneId !== null) {
            if (sceneId.id) {
                sceneIdString = sceneId.id;
            } else {
                console.warn('Cannot extract scene ID from object:', sceneId);
                if (this.game.displayCurrentPage) {
                    this.game.displayCurrentPage();
                }
                return;
            }
        }

        // Find and execute the scene function (like save-manager.js does)
        const route = this.game.currentRoute;
        let sceneFunction = null;
        let context = route;

        // Search for the scene function in the route hierarchy
        if (route[sceneIdString]) {
            sceneFunction = route[sceneIdString];
            context = route;
        } else if (route.act1 && route.act1[sceneIdString]) {
            sceneFunction = route.act1[sceneIdString];
            context = route.act1;
        } else if (route.act2 && route.act2[sceneIdString]) {
            sceneFunction = route.act2[sceneIdString];
            context = route.act2;
        } else if (route.act3 && route.act3[sceneIdString]) {
            sceneFunction = route.act3[sceneIdString];
            context = route.act3;
        } else if (route.endings && route.endings[sceneIdString]) {
            sceneFunction = route.endings[sceneIdString];
            context = route.endings;
        }

        if (sceneFunction && typeof sceneFunction === 'function') {
            console.log(`💚 Jumping to scene: ${sceneIdString}`);
            sceneFunction.call(context);
        } else {
            console.warn(`Scene "${sceneIdString}" not found. Falling back to displayCurrentPage.`);
            if (this.game.displayCurrentPage) {
                this.game.displayCurrentPage();
            }
        }
    }

    restoreGameState(entry) {
        // Restore scene/route/page position
        this.game.currentScene = entry.sceneId;
        this.game.currentRoute = entry.routeName;
        this.game.currentPageIndex = entry.pageIndex;

        if (!entry.gameState) return;

        // Restore tether level (if in Tori's route)
        if (entry.gameState.tetherLevel !== null && this.game.tetherSystem) {
            this.game.tetherSystem.tetherLevel = entry.gameState.tetherLevel;
            this.game.tetherSystem.updateDisplay();
        }

        // Restore sprites
        if (entry.gameState.currentSprites) {
            this.game.currentSprites = [...entry.gameState.currentSprites];
        }

        // Restore background
        if (entry.gameState.currentBackground) {
            this.game.currentBackground = entry.gameState.currentBackground;
            const bgElement = document.getElementById('game-background');
            if (bgElement) {
                bgElement.style.backgroundImage = `url('${entry.gameState.currentBackground}')`;
            }
        }

        // Restore game flags
        if (entry.gameState.flags) {
            this.game.flags = JSON.parse(JSON.stringify(entry.gameState.flags));
        }

        console.log('💚 Game state restored to:', {
            scene: entry.sceneId,
            route: entry.routeName,
            page: entry.pageIndex,
            tether: entry.gameState.tetherLevel
        });
    }

    showJumpError(entry) {
        // INSANE MODE: Special error message
        if (entry === 'insane') {
            this.game.showWarningOverlay(
                '⚠️ TIME MACHINE DISABLED',
                'Temporal navigation is OFFLINE in Insane mode.\n\n' +
                'You can view the backlog, but you cannot jump back.\n\n' +
                'Forward is the only direction.\n' +
                'This is what you chose.'
            );
            return;
        }

        const glitchNarrators = ['System', 'ERROR', 'Despair', '???', 'STATIC', 'CORRUPTION'];

        if (glitchNarrators.includes(entry.character)) {
            this.game.showWarningOverlay(
                '⚠️ TIMELINE INTEGRITY ERROR',
                'Cannot jump to corrupted system moments.\n\n' +
                'The device cannot recreate glitched data.\n' +
                'These events exist outside normal time.'
            );
        } else if (entry.sceneId && entry.sceneId.includes('ending_')) {
            this.game.showWarningOverlay(
                '⚠️ TEMPORAL LOCK DETECTED',
                'Cannot jump back from ending sequences.\n\n' +
                'Timeline has already converged.\n' +
                'Start a new playthrough to explore other paths.'
            );
        } else {
            this.game.showWarningOverlay(
                '⚠️ CRITICAL NARRATIVE CHECKPOINT',
                'This moment cannot be revisited.\n\n' +
                'System integrity protocols prevent time travel\n' +
                'to critical story events.'
            );
        }
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SettingsManager, BacklogManager };
}
