// ========================================
// ACCESSIBILITY MANAGER
// WCAG 2.1 AA Compliance
// ========================================

/**
 * AccessibilityManager - Comprehensive accessibility features
 * 
 * Features:
 * - Screen reader support (ARIA labels)
 * - Live region announcements
 * - Keyboard navigation
 * - High contrast mode
 * - Adjustable text size
 * - Reduced motion support
 */

class AccessibilityManager {
    constructor(game) {
        this.game = game;
        this.liveRegion = null;
        this.textSizeMultiplier = 1.0;
        this.highContrastMode = false;
        this.reducedMotion = false;

        this.init();
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    init() {
        this.createLiveRegion();
        this.setupARIALabels();
        this.detectUserPreferences();
        this.setupKeyboardNav();
        this.loadTextSizePreference();
        console.log('♿ Accessibility Manager initialized');
    }

    // ========================================
    // LIVE REGION (Screen Reader Announcements)
    // ========================================

    createLiveRegion() {
        this.liveRegion = document.createElement('div');
        this.liveRegion.id = 'aria-live-region';
        this.liveRegion.setAttribute('role', 'status');
        this.liveRegion.setAttribute('aria-live', 'polite');
        this.liveRegion.setAttribute('aria-atomic', 'true');
        this.liveRegion.className = 'sr-only'; // Screen reader only
        document.body.appendChild(this.liveRegion);
    }

    announce(message, priority = 'polite') {
        if (!this.liveRegion) return;

        this.liveRegion.setAttribute('aria-live', priority);
        this.liveRegion.textContent = message;

        // Clear after announcement
        setTimeout(() => {
            this.liveRegion.textContent = '';
        }, 1000);
    }

    announceDialogue(character, text) {
        const message = character ? `${character}: ${text}` : text;
        this.announce(message);
    }

    announceChoice(choiceText, index, total) {
        this.announce(`Choice ${index} of ${total}: ${choiceText}`);
    }

    announceScene(sceneName) {
        this.announce(`Scene changed to ${sceneName}`);
    }

    // ========================================
    // ARIA LABELS
    // ========================================

    setupARIALabels() {
        // Add labels to all interactive elements
        this.labelButtons();
        this.labelInputs();
        this.labelMenus();
    }

    labelButtons() {
        // Dialogue box
        const dialogueBox = document.getElementById('dialogue-box');
        if (dialogueBox) {
            dialogueBox.setAttribute('role', 'article');
            dialogueBox.setAttribute('aria-label', 'Dialogue');
        }

        // Choices
        const choicesContainer = document.getElementById('choices-container');
        if (choicesContainer) {
            choicesContainer.setAttribute('role', 'menu');
            choicesContainer.setAttribute('aria-label', 'Story choices');
        }

        // Auto-advance toggle
        const autoBtn = document.getElementById('auto-btn');
        if (autoBtn) {
            autoBtn.setAttribute('aria-label', 'Toggle auto-advance');
            autoBtn.setAttribute('aria-pressed', 'false');
        }

        // Skip button
        const skipBtn = document.getElementById('skip-btn');
        if (skipBtn) {
            skipBtn.setAttribute('aria-label', 'Skip dialogue');
        }
    }

    labelInputs() {
        // Save slots
        document.querySelectorAll('.save-slot').forEach((slot, index) => {
            slot.setAttribute('role', 'button');
            slot.setAttribute('aria-label', `Save slot ${index + 1}`);
        });
    }

    labelMenus() {
        // Pause menu
        const pauseMenu = document.getElementById('pause-menu');
        if (pauseMenu) {
            pauseMenu.setAttribute('role', 'dialog');
            pauseMenu.setAttribute('aria-label', 'Pause menu');
            pauseMenu.setAttribute('aria-modal', 'true');
        }

        // Settings menu
        const settingsMenu = document.getElementById('settings-menu');
        if (settingsMenu) {
            settingsMenu.setAttribute('role', 'dialog');
            settingsMenu.setAttribute('aria-label', 'Settings');
            settingsMenu.setAttribute('aria-modal', 'true');
        }
    }

    // ========================================
    // USER PREFERENCES
    // ========================================

    detectUserPreferences() {
        // Detect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.reducedMotion = prefersReducedMotion.matches;

        if (this.reducedMotion) {
            document.body.classList.add('reduce-motion');
            console.log('♿ Reduced motion enabled');
        }

        // Listen for changes
        prefersReducedMotion.addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            document.body.classList.toggle('reduce-motion', e.matches);
        });

        // Detect prefers-contrast
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
        this.highContrastMode = prefersHighContrast.matches;

        if (this.highContrastMode) {
            document.body.classList.add('high-contrast');
            console.log('♿ High contrast mode enabled');
        }

        prefersHighContrast.addEventListener('change', (e) => {
            this.highContrastMode = e.matches;
            document.body.classList.toggle('high-contrast', e.matches);
        });
    }

    // ========================================
    // TEXT SIZE
    // ========================================

    setTextSize(size) {
        // size: 'small', 'medium', 'large', 'x-large'
        const multipliers = {
            'small': 0.85,
            'medium': 1.0,
            'large': 1.15,
            'x-large': 1.3
        };

        this.textSizeMultiplier = multipliers[size] || 1.0;
        document.documentElement.style.setProperty('--text-size-multiplier', this.textSizeMultiplier);

        // Save preference
        localStorage.setItem('accessibility_textSize', size);
        console.log(`♿ Text size set to ${size} (${this.textSizeMultiplier}x)`);
    }

    loadTextSizePreference() {
        const saved = localStorage.getItem('accessibility_textSize');
        if (saved) {
            this.setTextSize(saved);
        }
    }

    // ========================================
    // HIGH CONTRAST MODE
    // ========================================

    toggleHighContrast() {
        this.highContrastMode = !this.highContrastMode;
        document.body.classList.toggle('high-contrast', this.highContrastMode);

        // Save preference
        localStorage.setItem('accessibility_highContrast', this.highContrastMode);
        console.log(`♿ High contrast mode ${this.highContrastMode ? 'enabled' : 'disabled'}`);

        return this.highContrastMode;
    }

    // ========================================
    // KEYBOARD NAVIGATION
    // ========================================

    setupKeyboardNav() {
        // Tab through choices
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const choices = document.querySelectorAll('.choice-btn:not([disabled])');
                if (choices.length > 0) {
                    // Let browser handle tab navigation
                    // Just ensure choices are focusable
                    choices.forEach(choice => {
                        choice.setAttribute('tabindex', '0');
                    });
                }
            }
        });
    }

    // ========================================
    // SPRITE DESCRIPTIONS
    // ========================================

    describeSpriteChange(spriteName, emotion) {
        const description = `${spriteName} appears ${emotion || 'on screen'}`;
        this.announce(description);
    }

    describeBackground(backgroundName) {
        this.announce(`Background changed to ${backgroundName}`);
    }

    // ========================================
    // PUBLIC API
    // ========================================

    getStatus() {
        return {
            textSize: this.textSizeMultiplier,
            highContrast: this.highContrastMode,
            reducedMotion: this.reducedMotion,
            screenReaderActive: this.liveRegion !== null
        };
    }
}

// ========================================
// GLOBAL EXPORT
// ========================================

if (typeof window !== 'undefined') {
    window.AccessibilityManager = AccessibilityManager;
}

export { AccessibilityManager };
