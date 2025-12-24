// ========================================
// CUTSCENE ENGINE FOR VERSION 848
// SIMPLIFIED VERSION - Basic cutscene structure only
// Complex animations moved to CSS, typewriter moved to game-engine
// ========================================

class CutsceneEngine {
    constructor(game) {
        this.game = game;
        this.isPlaying = false;
        this.currentCutscene = null;

        // Create cutscene container
        this.createCutsceneContainer();
    }

    createCutsceneContainer() {
        // Use existing cutscene-container from HTML or create if missing
        let container = document.getElementById('cutscene-container');

        if (!container) {
            // Create the cutscene overlay if it doesn't exist
            container = document.createElement('div');
            container.id = 'cutscene-container';
            container.innerHTML = `<div id="cutscene-canvas"></div>`;
            document.body.appendChild(container);
        }

        // Ensure container is hidden by default
        container.style.display = 'none';
        container.style.pointerEvents = 'none';

        // Ensure canvas is hidden by default
        const canvas = document.getElementById('cutscene-canvas');
        if (canvas) {
            canvas.style.display = 'none';
            canvas.style.pointerEvents = 'none';
        }
    }

    // ========================================
    // BASIC CUTSCENE CONTROL
    // ========================================

    startCutscene() {
        this.isPlaying = true;

        const container = document.getElementById('cutscene-container');
        const canvas = document.getElementById('cutscene-canvas');

        // Show both container and canvas
        container.classList.add('active');
        container.style.display = 'block';
        container.style.pointerEvents = 'auto';

        canvas.style.display = 'block';
        canvas.style.pointerEvents = 'auto';

        // Hide game UI
        if (this.game.gameView) {
            this.game.gameView.style.opacity = '0';
        }
    }

    endCutscene(onComplete) {
        this.isPlaying = false;

        const container = document.getElementById('cutscene-container');
        const canvas = document.getElementById('cutscene-canvas');

        container.classList.add('fade-out');

        setTimeout(() => {
            // Hide both container and canvas
            container.classList.remove('active', 'fade-out');
            container.style.display = 'none';
            container.style.pointerEvents = 'none';

            canvas.style.display = 'none';
            canvas.style.pointerEvents = 'none';
            canvas.innerHTML = ''; // Clear content

            // Restore game UI
            if (this.game.gameView) {
                this.game.gameView.style.opacity = '1';
            }

            if (onComplete) onComplete();
        }, 1000);
    }

    // ========================================
    // SIMPLE FADE TRANSITION
    // Basic scene transition without complex animations
    // ========================================

    playSimpleFade(content, duration, onComplete) {
        this.startCutscene();
        const canvas = document.getElementById('cutscene-canvas');

        // Set content
        canvas.innerHTML = content;

        // Simple fade in/out
        setTimeout(() => {
            this.endCutscene(onComplete);
        }, duration || 3000);
    }
}

// ========================================
// INTEGRATION NOTES
// ========================================

// Add to GameEngine initialization:
// this.cutsceneEngine = new CutsceneEngine(this);

// Usage in routes for simple transitions:
// this.game.cutsceneEngine.playSimpleFade('<div class="fade-text">Chapter 1</div>', 2000, () => this.continueStory());

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.CutsceneEngine = CutsceneEngine;
}

// ES Module export
export { CutsceneEngine };
