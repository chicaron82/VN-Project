// ========================================
// INSANE VISUALS CONTROLLER
// Session 121: Extracted from GameEngine
// ========================================
//
// RESPONSIBILITIES:
// - Insane Mode visual effect activation/deactivation
// - Cage overlay display and animation sequencing
// - Corruption effects (screen shake, glitch, red overlay)
// - Pure visual effects (no game logic)
//
// ARCHITECTURE:
// - Single Responsibility: Visual effects for Insane Mode
// - Pure CSS class manipulation and DOM timing
// - Called by: GameEngine, Insane Mode system
//
// ========================================

class InsaneVisualsController {
    constructor(game) {
        this.game = game;
        console.log('💀 InsaneVisualsController initialized');
    }

    // ========================================
    // INSANE MODE ACTIVATION/DEACTIVATION
    // ========================================

    /**
     * Deactivate Insane Mode color scheme and visual effects
     * Removes CSS classes for corruption and insane mode styling
     */
    deactivateInsaneMode() {
        console.log('💚 Deactivating Insane Mode color scheme');

        // Remove visual class
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.classList.remove('insane-mode-active');
        }

        // Optional: Remove corruption styling
        if (this.game.dialogueBox) {
            this.game.dialogueBox.classList.remove('corruption-intense');
        }
    }

    // ========================================
    // INSANE MODE: CAGE OVERLAY
    // ========================================

    /**
     * Show cage overlay with dramatic effect
     * 3-phase animation: fade in → hold → fade out
     *
     * @param {Function} callback - Called after overlay disappears
     */
    showInsaneCageOverlay(callback) {
        console.log('💀 INSANE MODE: Showing cage overlay');

        const overlay = document.getElementById('insane-cage-overlay');
        const versionText = document.getElementById('cage-version');

        if (!overlay) {
            console.error('Cage overlay not found');
            if (callback) callback();
            return;
        }

        // Update version number dynamically
        if (versionText) {
            versionText.textContent = `VERSION ${this.game.loopVersion}`;
        }

        // Show overlay with dramatic effect
        overlay.style.display = 'flex';
        overlay.style.opacity = '0';

        // Fade in
        setTimeout(() => {
            overlay.style.transition = 'opacity 0.5s ease-in';
            overlay.style.opacity = '1';
        }, 50);

        // Hold for 3 seconds, then fade out
        setTimeout(() => {
            overlay.style.transition = 'opacity 0.8s ease-out';
            overlay.style.opacity = '0';

            setTimeout(() => {
                overlay.style.display = 'none';
                // Execute callback after overlay disappears
                if (callback) callback();
            }, 800);
        }, 3000);
    }

    // ========================================
    // INSANE MODE: VISUAL CORRUPTION EFFECTS
    // ========================================

    /**
     * Trigger visual corruption effects
     * - Screen shake (dialogue box)
     * - Heavy sprite glitch
     * - Intense corruption styling
     * - Red overlay pulse
     */
    triggerInsaneVisuals() {
        console.log('💀 INSANE MODE: Triggering visual corruption effects');

        // Screen shake
        if (this.game.dialogueBox) {
            this.game.dialogueBox.classList.add('insane-shake');
            setTimeout(() => {
                this.game.dialogueBox.classList.remove('insane-shake');
            }, 2000);
        }

        // Sprite heavy glitch
        const sprites = document.querySelectorAll('.sprite-container img');
        sprites.forEach(sprite => {
            sprite.classList.add('sprite-glitch-heavy');
            setTimeout(() => {
                sprite.classList.remove('sprite-glitch-heavy');
            }, 2000);
        });

        // Dialogue box corruption
        if (this.game.dialogueBox) {
            this.game.dialogueBox.classList.add('corruption-intense');
        }

        // Red overlay pulse
        const overlay = document.createElement('div');
        overlay.className = 'insane-overlay';
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.remove();
        }, 1000);
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.InsaneVisualsController = InsaneVisualsController;
}

// ES Module export
export { InsaneVisualsController };
