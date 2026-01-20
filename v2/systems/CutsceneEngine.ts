import { EventBus } from '@core/EventBus';

/**
 * CutsceneEngine - Simplified Cutscene System
 * V1 Parity Port from cutscene-engine.js (128 lines)
 *
 * SIMPLIFIED VERSION - Basic cutscene structure only
 * Complex animations moved to CSS, typewriter moved to game-engine
 *
 * Responsibilities:
 * - Basic cutscene control (start/end)
 * - Container and canvas management
 * - Simple fade transitions
 * - Game UI hiding during cutscenes
 *
 * @class CutsceneEngine
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface GameInstance {
    gameView?: HTMLElement;
}

export class CutsceneEngine {
    private game: GameInstance;
    // @ts-expect-error - Reserved for future event emissions
    private eventBus: EventBus;
    private isPlaying: boolean = false;
    // @ts-expect-error - Reserved for future use
    private currentCutscene: unknown = null;

    constructor(game: GameInstance, eventBus: EventBus) {
        this.game = game;
        this.eventBus = eventBus;

        // Create cutscene container
        this.createCutsceneContainer();
    }

    /**
     * Create cutscene overlay structure
     * V1 Parity: lines 17-39
     */
    private createCutsceneContainer(): void {
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
    // V1 Parity: lines 45-90
    // ========================================

    /**
     * Start cutscene
     * V1 Parity: Shows container, canvas, hides game UI
     */
    public startCutscene(): void {
        this.isPlaying = true;

        const container = document.getElementById('cutscene-container');
        const canvas = document.getElementById('cutscene-canvas');

        if (container) {
            // Show both container and canvas
            container.classList.add('active');
            container.style.display = 'block';
            container.style.pointerEvents = 'auto';
        }

        if (canvas) {
            canvas.style.display = 'block';
            canvas.style.pointerEvents = 'auto';
        }

        // Hide game UI
        if (this.game.gameView) {
            this.game.gameView.style.opacity = '0';
        }
    }

    /**
     * End cutscene
     * V1 Parity: Fade out, hide container/canvas, restore game UI
     */
    public endCutscene(onComplete?: () => void): void {
        this.isPlaying = false;

        const container = document.getElementById('cutscene-container');
        const canvas = document.getElementById('cutscene-canvas');

        if (container) {
            container.classList.add('fade-out');

            setTimeout(() => {
                // Hide both container and canvas
                container.classList.remove('active', 'fade-out');
                container.style.display = 'none';
                container.style.pointerEvents = 'none';

                if (canvas) {
                    canvas.style.display = 'none';
                    canvas.style.pointerEvents = 'none';
                    canvas.innerHTML = ''; // Clear content
                }

                // Restore game UI
                if (this.game.gameView) {
                    this.game.gameView.style.opacity = '1';
                }

                if (onComplete) onComplete();
            }, 1000);
        }
    }

    // ========================================
    // SIMPLE FADE TRANSITION
    // Basic scene transition without complex animations
    // V1 Parity: lines 97-108
    // ========================================

    /**
     * Play simple fade transition
     * V1 Parity: Start cutscene, show content, end after duration
     */
    public playSimpleFade(content: string, duration?: number, onComplete?: () => void): void {
        this.startCutscene();
        const canvas = document.getElementById('cutscene-canvas');

        // Set content
        if (canvas) {
            canvas.innerHTML = content;
        }

        // Simple fade in/out
        setTimeout(() => {
            this.endCutscene(onComplete);
        }, duration || 3000);
    }

    // ========================================
    // PUBLIC API
    // ========================================

    /**
     * Check if cutscene is currently playing
     */
    public getIsPlaying(): boolean {
        return this.isPlaying;
    }
}
