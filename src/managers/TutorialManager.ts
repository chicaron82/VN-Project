// ========================================
// TUTORIAL MANAGER
// Event-Driven Hand Gesture Tutorials
// V1→V2 Port with Full Parity
// ========================================

import type { EventBus } from '../core/EventBus';
import type { StateManager } from '../core/StateManager';

export interface TutorialOptions {
    text?: string;
    autoHide?: number; // milliseconds
    position?: 'above' | 'below' | 'left' | 'right';
}

export interface PauseManager {
    request(reason: string): void;
    release(reason: string): void;
}

/**
 * TutorialManager
 *
 * Clean, simple API for showing animated hand gestures pointing at UI elements.
 * Controllers call showHandGesture() when their elements become visible - no polling needed.
 *
 * Usage:
 *   tutorialManager.showHandGesture('notes_tip', element, {
 *     text: 'Check your notes!',
 *     autoHide: 3000
 *   });
 *
 * "Built with love. Every tap teaches." 💚🔥💀
 */
export class TutorialManager {
    // @ts-expect-error - Reserved for future EventBus integration
    private eventBus: EventBus;
    private stateManager: StateManager;
    private pauseManager: PauseManager | null = null;

    private activeOverlay: HTMLElement | null = null;
    private targetElement: HTMLElement | null = null;
    private shownTutorials: Set<string> = new Set();

    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    /**
     * Initialize the tutorial manager
     */
    public init(): void {
        // Load shown tutorials from state
        const completed = this.stateManager.get<Record<string, boolean>>('tutorial.completed') || {};
        Object.keys(completed).forEach(id => {
            if (completed[id]) this.shownTutorials.add(id);
        });

        console.log('📚 TutorialManager initialized (event-driven mode)');
    }

    /**
     * Set pause manager for tutorial pause integration
     * @param manager - Pause manager instance
     */
    public setPauseManager(manager: PauseManager): void {
        this.pauseManager = manager;
    }

    // ========================================
    // TUTORIAL STATE
    // ========================================

    /**
     * Check if a tutorial has already been shown
     * @param tutorialId - Tutorial ID to check
     * @returns True if already shown
     */
    public hasShown(tutorialId: string): boolean {
        return this.shownTutorials.has(tutorialId);
    }

    /**
     * Check if tutorials are enabled
     * @returns True if enabled (default: true)
     */
    public isEnabled(): boolean {
        return this.stateManager.get<boolean>('tutorial.enabled') !== false;
    }

    /**
     * Enable/disable tutorials
     * @param enabled - Whether tutorials are enabled
     */
    public setEnabled(enabled: boolean): void {
        this.stateManager.set('tutorial.enabled', enabled);
    }

    // ========================================
    // SHOW TUTORIAL
    // ========================================

    /**
     * Show animated hand gesture pointing at element
     * @param tutorialId - Unique ID to prevent duplicate showings
     * @param targetElement - Element to point at
     * @param options - Tutorial options (text, autoHide, position)
     */
    public showHandGesture(tutorialId: string, targetElement: HTMLElement | null, options: TutorialOptions = {}): void {
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
        this.saveCompleted(tutorialId);

        // Request pause via PauseManager
        if (this.pauseManager) {
            this.pauseManager.request('tutorial');
        }

        // Create the overlay
        this.createOverlay(targetElement, options);

        // Auto-hide after delay
        const hideDelay = options.autoHide || 4000;
        setTimeout(() => this.dismiss(), hideDelay);

        console.log(`📚 Tutorial shown: ${tutorialId}`);
    }

    // ========================================
    // OVERLAY CREATION
    // ========================================

    /**
     * Create the hand gesture overlay
     * @param targetElement - Element to point at
     * @param options - Tutorial options
     */
    private createOverlay(targetElement: HTMLElement, options: TutorialOptions): void {
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
        this.targetElement = targetElement;

        // Add to DOM and animate in
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('visible'));
    }

    // ========================================
    // DISMISS TUTORIAL
    // ========================================

    /**
     * Dismiss the current tutorial overlay
     */
    public dismiss(): void {
        if (!this.activeOverlay) return;

        // Release pause via PauseManager
        if (this.pauseManager) {
            this.pauseManager.release('tutorial');
        }

        // Remove spotlight
        if (this.targetElement) {
            this.targetElement.classList.remove('tutorial-spotlight');
            this.targetElement = null;
        }

        // Fade out
        this.activeOverlay.classList.remove('visible');

        // Remove from DOM
        const overlayToRemove = this.activeOverlay;
        setTimeout(() => {
            overlayToRemove?.remove();
        }, 300);

        this.activeOverlay = null;
    }

    // ========================================
    // STATE MANAGEMENT
    // ========================================

    /**
     * Save completed tutorial to state
     * @param tutorialId - Tutorial ID
     */
    private saveCompleted(tutorialId: string): void {
        const completed = this.stateManager.get<Record<string, boolean>>('tutorial.completed') || {};
        completed[tutorialId] = true;
        this.stateManager.set('tutorial.completed', completed);
    }

    /**
     * Reset all tutorials (for testing/settings)
     */
    public resetTutorials(): void {
        this.shownTutorials.clear();
        this.stateManager.set('tutorial.completed', {});
        console.log('📚 All tutorials reset');
    }
}
