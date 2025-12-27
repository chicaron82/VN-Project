// ========================================
// TUTORIAL MANAGER
// Progressive onboarding system for both routes
// ========================================

/**
 * TutorialManager
 * 
 * Manages contextual tutorials that teach mechanics progressively.
 * 
 * Features:
 * - Route-specific tutorials (Tori: tether mechanics, Ronnie: notes/skip)
 * - Smart triggering (skip if player already figured it out)
 * - One-time display with persistent state
 * - Interactive overlays with spotlight effects
 * - Pause game during tutorials
 * 
 * @class TutorialManager
 */
export class TutorialManager {
    constructor(game) {
        this.game = game;

        // Tutorial stages definition
        this.stages = this._defineStages();

        // Active overlay reference
        this.activeOverlay = null;

        // Trigger tracking
        this.dialogueCount = 0;
        this.tetherAt85Time = null;

        console.log('📚 TutorialManager initialized');
    }

    /**
     * Initialize tutorial system and load saved state
     */
    init() {
        // Initialize tutorial state in StateManager if not exists
        if (!this.game.state.get('tutorial')) {
            this.game.state.set('tutorial', {
                completed: {
                    tori_tether_drain: false,
                    tori_hold_on: false,
                    tori_first_note: false,
                    ronnie_notes_unlocked: false,
                    ronnie_skip_unlocked: false
                },
                enabled: true
            });
        }

        // Subscribe to state changes to auto-check tutorials
        this._setupAutoTriggers();

        console.log('📚 Tutorial state loaded');
    }

    /**
     * Setup automatic tutorial triggers via state subscriptions
     */
    _setupAutoTriggers() {
        // Watch tether level for Hold On tutorial
        this.game.state.subscribe('tether.level', () => {
            this.checkTriggers();
        });

        // Watch notes for first note tutorial
        this.game.state.subscribe('collectibles.unlockedNotes', () => {
            console.log('📚 Notes changed, checking tutorials');
            this.checkTriggers();
        });

        // Watch unlocks for Ronnie tutorials
        this.game.state.subscribe('unlocks', () => {
            this.checkTriggers();
        });

        // Check immediately on init (catches notes collected during route setup)
        setTimeout(() => {
            console.log('📚 Initial tutorial check');
            this.checkTriggers();
        }, 500);

        // Periodic check for dialogue-based tutorials (every 2 seconds)
        this._periodicCheck = setInterval(() => {
            this.checkTriggers();
        }, 2000);
    }

    /**
     * Define all tutorial stages for both routes
     */
    _defineStages() {
        return {
            // ========================================
            // TORI ROUTE TUTORIALS
            // ========================================

            tori_tether_drain: {
                id: 'tori_tether_drain',
                route: 'tori',
                trigger: () => {
                    return this.dialogueCount >= 3 &&
                        !this._isCompleted('tori_tether_drain') &&
                        this._isEnabled();
                },
                content: {
                    title: 'Connection Stability',
                    text: 'Your connection to Tori is fragile. Watch the tether meter—it drains over time.',
                    highlight: '.tether-ui',
                    pauseGame: true
                }
            },

            tori_hold_on: {
                id: 'tori_hold_on',
                route: 'tori',
                trigger: () => {
                    const tetherLevel = this.game.state.get('tether.level') || 100;

                    return tetherLevel <= 98 &&
                        !this._isCompleted('tori_hold_on') &&
                        !this._hasUsedHoldOn() &&
                        this._isEnabled();
                },
                skipIf: () => this._hasUsedHoldOn(),
                content: {
                    title: 'Strengthen Your Bond',
                    text: 'When the tether weakens, use Hold On to restore connection.',
                    highlight: '.hold-on-button',
                    pauseGame: true
                }
            },

            tori_first_note: {
                id: 'tori_first_note',
                route: 'tori',
                trigger: () => {
                    // Check state directly (not cached) to catch notes added during route init
                    const notes = this.game.state.get('collectibles.unlockedNotes') || [];
                    const hasNotes = notes.length > 0;

                    return hasNotes &&
                        !this._isCompleted('tori_first_note') &&
                        this._isEnabled();
                },
                content: {
                    title: 'Memory Fragments',
                    text: 'Tori\'s fragmented memories appear as notes. Check the mail icon to read them.',
                    highlight: '.mail-icon',
                    pauseGame: true
                }
            },

            // ========================================
            // RONNIE ROUTE TUTORIALS
            // ========================================

            ronnie_notes_unlocked: {
                id: 'ronnie_notes_unlocked',
                route: 'ronnie',
                trigger: () => {
                    const unlocks = this.game.state.get('unlocks') || {};
                    return unlocks.ronnieNotesUnlocked &&
                        !this._isCompleted('ronnie_notes_unlocked') &&
                        this._isEnabled();
                },
                interactive: true,
                content: {
                    title: 'Notes Unlocked',
                    text: 'Your connection revealed fragments of Tori\'s consciousness. Notes are now available throughout Ronnie\'s route.',
                    pauseGame: true,
                    action: () => this._showNotesInteractive()
                }
            },

            ronnie_skip_unlocked: {
                id: 'ronnie_skip_unlocked',
                route: 'ronnie',
                trigger: () => {
                    return this._isCompleted('ronnie_notes_unlocked') &&
                        !this._isCompleted('ronnie_skip_unlocked') &&
                        this._isEnabled();
                },
                content: {
                    title: 'Skip Unlocked',
                    text: 'You can now skip previously read dialogue. Hold spacebar or tap Skip button.',
                    highlight: '.skip-button',
                    pauseGame: false
                }
            }
        };
    }

    /**
     * Check all triggers and show tutorial if conditions met
     * Call this each game tick/update
     */
    checkTriggers() {
        // Don't check if overlay already active
        if (this.activeOverlay) return;

        // Get current route
        const currentRoute = this.game.currentRoute?.constructor?.name?.toLowerCase();

        if (!currentRoute) return;

        // Check each stage
        for (const [stageId, stage] of Object.entries(this.stages)) {
            // Skip if wrong route
            if (stage.route && !currentRoute.includes(stage.route)) {
                continue;
            }

            // Skip if already completed
            if (this._isCompleted(stageId)) {
                continue;
            }

            // Check skip condition
            if (stage.skipIf && stage.skipIf()) {
                this.markComplete(stageId);
                continue;
            }

            // Check trigger
            if (stage.trigger && stage.trigger()) {
                this.showStage(stageId);
                break; // Only show one at a time
            }
        }
    }

    /**
     * Show a tutorial stage
     */
    showStage(stageId) {
        const stage = this.stages[stageId];
        if (!stage) return;

        console.log(`📚 Showing tutorial: ${stageId}`);

        // Pause game if needed
        if (stage.content.pauseGame) {
            this.game.pause?.();
        }

        // Create overlay
        this.activeOverlay = this._createOverlay(stage);
        document.body.appendChild(this.activeOverlay);

        // Trigger haptic
        if (this.game.notificationShade?.triggerHaptic) {
            this.game.notificationShade.triggerHaptic('medium');
        }

        // Animate in
        requestAnimationFrame(() => {
            this.activeOverlay?.classList.add('visible');
        });
    }

    /**
     * Mark a tutorial stage as complete
     */
    markComplete(stageId) {
        const completed = this.game.state.get('tutorial.completed') || {};
        completed[stageId] = true;
        this.game.state.set('tutorial.completed', completed);

        console.log(`✅ Tutorial completed: ${stageId}`);
    }

    /**
     * Check if a stage is completed
     */
    _isCompleted(stageId) {
        const completed = this.game.state.get('tutorial.completed') || {};
        return completed[stageId] === true;
    }

    /**
     * Check if tutorials are enabled
     */
    _isEnabled() {
        return this.game.state.get('tutorial.enabled') !== false;
    }

    /**
     * Show a tutorial stage with animated hand gesture
     */
    showStage(stageId) {
        const stage = this.stages[stageId];
        if (!stage) return;

        // Wait for elements to be positioned (mail icon needs time)
        setTimeout(() => {
            this._showStageNow(stageId, stage);
        }, 300);
    }

    /**
     * Actually show the tutorial (called after delay)
     */
    _showStageNow(stageId, stage) {
        console.log(`📚 Showing tutorial: ${stageId}`);

        // Pause game if needed
        if (stage.content.pauseGame && this.game.pauseGame) {
            this.game.pauseGame();
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay';
        overlay.dataset.tutorialId = stageId;

        // Create backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'tutorial-backdrop';
        overlay.appendChild(backdrop);

        // Find target element for spotlight/hand position
        const targetElement = stage.content.highlight ?
            document.querySelector(stage.content.highlight) : null;

        // Add spotlight to target
        if (targetElement) {
            targetElement.classList.add('tutorial-spotlight');
        }

        // Create animated hand gesture
        const hand = this.createHandGesture(targetElement, stage.content);
        if (hand) {
            overlay.appendChild(hand.element);
            if (hand.tooltip) {
                overlay.appendChild(hand.tooltip);
            }
        }

        // Add dismiss hint
        const dismissHint = document.createElement('div');
        dismissHint.className = 'tutorial-dismiss-hint';
        dismissHint.textContent = 'Tap anywhere to continue';
        overlay.appendChild(dismissHint);

        // Add to DOM
        document.body.appendChild(overlay);
        this.activeOverlay = overlay;

        // Auto-dismiss on click or after timeout
        const dismiss = () => {
            this.dismissTutorial(stageId, targetElement);
        };

        backdrop.addEventListener('click', dismiss, { once: true });

        // Auto-dismiss after 5 seconds
        setTimeout(dismiss, 5000);

        // Animate in
        requestAnimationFrame(() => {
            this.activeOverlay?.classList.add('visible');
        });
    }

    /**
     * Create animated hand gesture pointing at element
     */
    createHandGesture(targetElement, content) {
        if (!targetElement) {
            console.warn('Tutorial: Target element not found for', content.highlight);
            return null;
        }

        // Check if element is actually visible/rendered
        if (!targetElement.offsetParent) {
            console.warn('Tutorial: Target element not visible (no offsetParent)', content.highlight);
            return null;
        }

        const rect = targetElement.getBoundingClientRect();

        // Validate rect - if element is at 0,0 it's probably not positioned yet
        if (rect.left === 0 && rect.top === 0 && rect.width === 0) {
            console.warn('Tutorial: Target element not positioned yet', content.highlight, rect);
            return null;
        }

        // Create hand element
        const hand = document.createElement('div');
        hand.className = 'tutorial-hand';
        hand.textContent = '👆'; // Pointing hand emoji

        // Position hand above and centered on target
        // Hand emoji is ~48px, so offset by half
        let handX = rect.left + (rect.width / 2) - 24;
        let handY = rect.top - 70; // Above the element

        // Bounds checking - keep hand on screen
        handX = Math.max(10, Math.min(handX, window.innerWidth - 58));
        handY = Math.max(10, handY);

        hand.style.left = `${handX}px`;
        hand.style.top = `${handY}px`;

        console.log('Tutorial hand positioned at:', { x: handX, y: handY, rect });

        // Create tooltip if text provided
        let tooltip = null;
        if (content.text) {
            tooltip = document.createElement('div');
            tooltip.className = 'tutorial-tooltip';
            tooltip.textContent = content.text;

            // Position tooltip above hand, centered
            const tooltipX = rect.left + (rect.width / 2);
            const tooltipY = handY - 60;

            tooltip.style.left = `${tooltipX}px`;
            tooltip.style.top = `${Math.max(10, tooltipY)}px`;
            tooltip.style.transform = 'translateX(-50%)'; // Center horizontally
        }

        return { element: hand, tooltip };
    }

    /**
     * Dismiss tutorial and clean up
     */
    dismissTutorial(stageId, targetElement) {
        if (!this.activeOverlay) return;

        // Remove spotlight
        if (targetElement) {
            targetElement.classList.remove('tutorial-spotlight');
        }

        // Fade out
        this.activeOverlay.classList.remove('visible');

        // Remove from DOM after animation
        setTimeout(() => {
            this.activeOverlay?.remove();
            this.activeOverlay = null;

            // Resume game
            if (this.game.resumeGame) {
                this.game.resumeGame();
            }

            // Mark as complete
            this.markComplete(stageId);
        }, 300);
    }

    /**
     * Check if player has used Hold On button
     */
    _hasUsedHoldOn() {
        // Check if tether system exists and has been used
        return this.game.currentRoute?.tetherSystem?.hasUsedHoldOn === true;
    }

    /**
     * Create tutorial overlay DOM
     */
    _createOverlay(stage) {
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay';

        const content = stage.content;

        overlay.innerHTML = `
            <div class="tutorial-backdrop"></div>
            <div class="tutorial-card" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
                <h2 id="tutorial-title" class="tutorial-title">${content.title}</h2>
                <p class="tutorial-text">${content.text}</p>
                <button class="tutorial-button" type="button">Got it</button>
            </div>
        `;

        // Add spotlight if highlight specified
        if (content.highlight) {
            this._addSpotlight(overlay, content.highlight);
        }

        // Bind close handler
        const button = overlay.querySelector('.tutorial-button');
        button?.addEventListener('click', () => this._closeOverlay(stage.id));

        // Allow clicking backdrop to close
        const backdrop = overlay.querySelector('.tutorial-backdrop');
        backdrop?.addEventListener('click', () => this._closeOverlay(stage.id));

        return overlay;
    }

    /**
     * Add spotlight effect to highlighted element
     */
    _addSpotlight(overlay, selector) {
        const target = document.querySelector(selector);
        if (!target) return;

        // Add spotlight class to target
        target.classList.add('tutorial-spotlight');

        // Store reference to remove later
        overlay.dataset.spotlightTarget = selector;
    }

    /**
     * Close active overlay
     */
    _closeOverlay(stageId) {
        if (!this.activeOverlay) return;

        // Remove spotlight
        const spotlightTarget = this.activeOverlay.dataset.spotlightTarget;
        if (spotlightTarget) {
            const target = document.querySelector(spotlightTarget);
            target?.classList.remove('tutorial-spotlight');
        }

        // Animate out
        this.activeOverlay.classList.remove('visible');

        setTimeout(() => {
            this.activeOverlay?.remove();
            this.activeOverlay = null;

            // Resume game
            this.game.resume?.();

            // Mark complete
            this.markComplete(stageId);
        }, 300);
    }

    /**
     * Interactive notes tutorial (Ronnie route)
     */
    _showNotesInteractive() {
        // Auto-open notes viewer
        if (this.game.collectiblesManager) {
            this.game.collectiblesManager.showNotesViewer();
        }
    }

    /**
     * Reset all tutorials (for settings "Replay Tutorials")
     */
    resetTutorials() {
        this.game.state.set('tutorial.completed', {
            tori_tether_drain: false,
            tori_hold_on: false,
            tori_first_note: false,
            ronnie_notes_unlocked: false,
            ronnie_skip_unlocked: false
        });

        // Reset tracking
        this.dialogueCount = 0;
        this.tetherAt85Time = null;

        console.log('🔄 Tutorials reset');
    }

    /**
     * Increment dialogue count (call from dialogue system)
     */
    incrementDialogueCount() {
        this.dialogueCount++;
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.TutorialManager = TutorialManager;
}
