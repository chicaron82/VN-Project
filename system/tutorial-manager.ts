/**
 * TutorialManager - Event-Driven Hand Gesture Tutorials
 * 
 * Clean, simple API for showing animated hand gestures pointing at UI elements.
 * Controllers call showHandGesture() when their elements become visible - no polling needed.
 * 
 * Usage:
 *   game.tutorialManager.showHandGesture(element, {
 *     text: 'Check your notes!',
 *     autoHide: 3000
 *   });
 */

// ========================================
// TYPESCRIPT DECLARATIONS
// ========================================
/// <reference lib="es2015" />

/** GameEngine reference */
declare class GameEngine {
    state: {
        get(key: string): any;
        set(key: string, value: any): void;
    };
    pauseManager: {
        request(reason: string): void;
        release(reason: string): void;
    } | null;
    [key: string]: any;
}

/** Tutorial options interface */
interface TutorialOptions {
    text?: string;
    autoHide?: number;
    position?: string;
}

export class TutorialManager {
    game: GameEngine;
    activeOverlay: HTMLElement | null;
    shownTutorials: Set<string>;
    _targetElement: HTMLElement | null;

    constructor(game: GameEngine) {
        this.game = game;
        this.activeOverlay = null;
        this.shownTutorials = new Set(); // Track which tutorials have been shown
        this._targetElement = null;
    }

    /**
     * Initialize the tutorial manager
     */
    init() {
        // Load shown tutorials from state
        const completed = this.game.state.get('tutorial.completed') || {};
        Object.keys(completed).forEach(id => {
            if (completed[id]) this.shownTutorials.add(id);
        });

        console.log('📚 TutorialManager initialized (event-driven mode)');
    }

    /**
     * Check if a tutorial has already been shown
     */
    hasShown(tutorialId) {
        return this.shownTutorials.has(tutorialId);
    }

    /**
     * Check if tutorials are enabled
     */
    isEnabled() {
        return this.game.state.get('tutorial.enabled') !== false;
    }

    /**
     * Show animated hand gesture pointing at element
     * @param {string} tutorialId - Unique ID to prevent duplicate showings
     * @param {HTMLElement} targetElement - Element to point at
     * @param {Object} options - { text, autoHide, position }
     */
    showHandGesture(tutorialId: string, targetElement: HTMLElement, options: TutorialOptions = {}) {
        // Skip if disabled, already showing, or already shown
        if (!this.isEnabled()) return;
        if (this.activeOverlay) return;
        if (this.hasShown(tutorialId)) return;

        if (!targetElement) {
            console.warn('Tutorial: No target element for', tutorialId);
            return;
        }

        const rect = targetElement.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            console.warn('Tutorial: Target element has no size for', tutorialId);
            return;
        }

        // Mark as shown
        this.shownTutorials.add(tutorialId);
        this._saveCompleted(tutorialId);

        // Request pause via PauseManager
        if (this.game.pauseManager) {
            this.game.pauseManager.request('tutorial');
        }

        // Create the overlay
        this._createOverlay(targetElement, options);

        // Auto-hide after delay
        const hideDelay = options.autoHide || 4000;
        setTimeout(() => this.dismiss(), hideDelay);

        console.log(`📚 Tutorial shown: ${tutorialId}`);
    }

    /**
     * Create the hand gesture overlay
     */
    _createOverlay(targetElement: HTMLElement, options: TutorialOptions) {
        const rect = targetElement.getBoundingClientRect();

        // Create overlay container
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay';

        // Create backdrop (click to dismiss)
        const backdrop = document.createElement('div');
        backdrop.className = 'tutorial-backdrop';
        backdrop.addEventListener('click', () => this.dismiss(), { once: true });
        overlay.appendChild(backdrop);

        // Add spotlight to target
        targetElement.classList.add('tutorial-spotlight');

        // Create hand emoji
        const hand = document.createElement('div');
        hand.className = 'tutorial-hand';
        hand.textContent = '👆';

        // Position hand above target, centered
        const handX = rect.left + (rect.width / 2) - 24;
        const handY = rect.top - 70;
        hand.style.left = `${Math.max(10, handX)}px`;
        hand.style.top = `${Math.max(10, handY)}px`;
        overlay.appendChild(hand);

        // Create tooltip if text provided
        if (options.text) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tutorial-tooltip';
            tooltip.textContent = options.text;

            // Position tooltip above hand, centered
            let tooltipX = rect.left + (rect.width / 2);
            const tooltipY = Math.max(10, handY - 50);

            // Bounds checking - keep tooltip on screen
            // Estimate tooltip width (rough approximation)
            const estimatedWidth = options.text.length * 8;
            const minX = estimatedWidth / 2 + 10;
            const maxX = window.innerWidth - (estimatedWidth / 2) - 10;
            tooltipX = Math.max(minX, Math.min(tooltipX, maxX));

            tooltip.style.left = `${tooltipX}px`;
            tooltip.style.top = `${tooltipY}px`;
            tooltip.style.transform = 'translateX(-50%)';
            overlay.appendChild(tooltip);
        }

        // Add dismiss hint
        const hint = document.createElement('div');
        hint.className = 'tutorial-dismiss-hint';
        hint.textContent = 'Tap to continue';
        overlay.appendChild(hint);

        // Store references
        this.activeOverlay = overlay;
        this._targetElement = targetElement;

        // Add to DOM and animate in
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('visible'));
    }

    /**
     * Dismiss the current tutorial overlay
     */
    dismiss() {
        if (!this.activeOverlay) return;

        // Release pause via PauseManager
        if (this.game.pauseManager) {
            this.game.pauseManager.release('tutorial');
        }

        // Remove spotlight
        if (this._targetElement) {
            this._targetElement.classList.remove('tutorial-spotlight');
            this._targetElement = null;
        }

        // Fade out
        this.activeOverlay.classList.remove('visible');

        // Remove from DOM
        setTimeout(() => {
            this.activeOverlay?.remove();
            this.activeOverlay = null;
        }, 300);
    }

    /**
     * Save completed tutorial to state
     */
    _saveCompleted(tutorialId) {
        const completed = this.game.state.get('tutorial.completed') || {};
        completed[tutorialId] = true;
        this.game.state.set('tutorial.completed', completed);
    }

    /**
     * Reset all tutorials (for testing/settings)
     */
    resetTutorials() {
        this.shownTutorials.clear();
        this.game.state.set('tutorial.completed', {});
        console.log('📚 All tutorials reset');
    }

    /**
     * Enable/disable tutorials
     */
    setEnabled(enabled) {
        this.game.state.set('tutorial.enabled', enabled);
    }
}

// Expose to window for GameEngine
(window as any).TutorialManager = TutorialManager;

