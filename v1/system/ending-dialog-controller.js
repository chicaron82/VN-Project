// ========================================
// ENDING DIALOG CONTROLLER
// Three-option ending dialog system
// SOLID Refactor: Extracted from GameEngine
// ========================================

/**
 * EndingDialogController
 * 
 * Manages the ending dialog with three options:
 * - Try Again (restart)
 * - Accept Ending (credits)
 * - Return to Menu (skip credits)
 * 
 * @class EndingDialogController
 */
class EndingDialogController {
    constructor(game) {
        this.game = game;

        // State
        this.endingDialogButtons = null;
        this.currentEndingFocus = 0;
        this.endingDialogKeyHandler = null;
        this.pendingEndingType = null;
    }

    // ========================================
    // SHOW/HIDE DIALOG
    // ========================================

    show(endingType = null) {
        const dialog = document.getElementById('ending-dialog');
        if (!dialog) {
            console.error('Ending dialog element not found');
            return;
        }

        // Store ending type for later use
        this.pendingEndingType = endingType;

        // Show dialog
        dialog.classList.remove('hidden');

        // Setup buttons and keyboard navigation
        this.setupButtons();
        this.setupKeyboard();

        // Focus first option
        this.focusOption(0);

        console.log(`📋 Ending dialog shown (ending type: ${endingType})`);
    }

    hide() {
        const dialog = document.getElementById('ending-dialog');
        if (dialog) {
            dialog.classList.add('hidden');
        }

        // Remove keyboard listener
        if (this.endingDialogKeyHandler) {
            document.removeEventListener('keydown', this.endingDialogKeyHandler);
            this.endingDialogKeyHandler = null;
        }

        console.log('📋 Ending dialog hidden');
    }

    // ========================================
    // BUTTON SETUP
    // ========================================

    setupButtons() {
        const retryBtn = document.getElementById('ending-retry');
        const acceptBtn = document.getElementById('ending-accept');
        const exitBtn = document.getElementById('ending-exit');

        if (!retryBtn || !acceptBtn || !exitBtn) {
            console.error('Ending dialog buttons not found');
            return;
        }

        // Remove existing listeners by cloning and replacing
        const newRetryBtn = retryBtn.cloneNode(true);
        const newAcceptBtn = acceptBtn.cloneNode(true);
        const newExitBtn = exitBtn.cloneNode(true);

        retryBtn.parentNode.replaceChild(newRetryBtn, retryBtn);
        acceptBtn.parentNode.replaceChild(newAcceptBtn, acceptBtn);
        exitBtn.parentNode.replaceChild(newExitBtn, exitBtn);

        // YES - Try Again (immediate restart)
        newRetryBtn.addEventListener('click', () => {
            this.hide();
            console.log('🔄 Player chose: TRY AGAIN - Restarting game...');

            // DIZEE: Record attempt to bootstrap timeline
            this.game.recordEndingAttempt();

            // Increment attempt number for next run
            this.game.bootstrapTracker.incrementAttempt();

            // DIZEE: Increment version and show loop init with route selection
            this.game.loopVersion++;

            // Get current route from game state
            const currentRoute = this.game.currentRoute || 'ronnie';

            // Show loop init with route selection (no callback needed - route selection handles it)
            this.game.showLoopInit(null, currentRoute);
        });

        // NO - Accept This Ending (credits THEN menu)
        newAcceptBtn.addEventListener('click', () => {
            this.hide();
            console.log('🎬 Player chose: ACCEPT ENDING - Playing credits...');

            // DIZEE: Record attempt to bootstrap timeline
            this.game.recordEndingAttempt();

            this.game.showCredits(this.pendingEndingType);
        });

        // EXIT - Return to Main Menu (skip credits)
        newExitBtn.addEventListener('click', () => {
            this.hide();
            console.log('🏠 Player chose: RETURN TO MENU - Skipping credits...');

            // DIZEE: Record attempt to bootstrap timeline
            this.game.recordEndingAttempt();

            // DIZEE: Code rain transition before returning to menu 💚🌧️
            this.game.showCodeRainTransition(() => {
                this.game.returnToMainMenu(true);
            }, 1500);
        });

        // Store references for keyboard navigation
        this.endingDialogButtons = [newRetryBtn, newAcceptBtn, newExitBtn];
        this.currentEndingFocus = 0;
    }

    // ========================================
    // KEYBOARD NAVIGATION
    // ========================================

    setupKeyboard() {
        // Remove existing listener if present
        if (this.endingDialogKeyHandler) {
            document.removeEventListener('keydown', this.endingDialogKeyHandler);
        }

        this.endingDialogKeyHandler = (e) => {
            const dialog = document.getElementById('ending-dialog');
            if (!dialog || dialog.classList.contains('hidden')) return;

            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.currentEndingFocus = Math.max(0, this.currentEndingFocus - 1);
                    this.focusOption(this.currentEndingFocus);
                    break;

                case 'ArrowDown':
                    e.preventDefault();
                    this.currentEndingFocus = Math.min(2, this.currentEndingFocus + 1);
                    this.focusOption(this.currentEndingFocus);
                    break;

                case 'Tab':
                    e.preventDefault();
                    this.currentEndingFocus = (this.currentEndingFocus + 1) % 3;
                    this.focusOption(this.currentEndingFocus);
                    break;

                case 'Enter':
                    e.preventDefault();
                    if (this.endingDialogButtons && this.endingDialogButtons[this.currentEndingFocus]) {
                        this.endingDialogButtons[this.currentEndingFocus].click();
                    }
                    break;

                case 'Escape':
                    e.preventDefault();
                    // Esc defaults to EXIT option
                    if (this.endingDialogButtons && this.endingDialogButtons[2]) {
                        this.endingDialogButtons[2].click();
                    }
                    break;
            }
        };

        document.addEventListener('keydown', this.endingDialogKeyHandler);
    }

    focusOption(index) {
        if (!this.endingDialogButtons) return;

        // Remove focus from all
        this.endingDialogButtons.forEach(btn => {
            btn.setAttribute('data-focused', 'false');
        });

        // Add focus to selected
        if (this.endingDialogButtons[index]) {
            this.endingDialogButtons[index].setAttribute('data-focused', 'true');
        }
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.EndingDialogController = EndingDialogController;
}

// ES Module export
export { EndingDialogController };
