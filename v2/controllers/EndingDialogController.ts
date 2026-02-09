// ========================================
// ENDING DIALOG CONTROLLER
// Three-option ending dialog system
// SOLID Refactor: Extracted from GameEngine
// ========================================

import type { EventBus } from '../core/EventBus';
import { Logger } from '@utils/Logger';

/**
 * EndingDialogController
 *
 * Manages the ending dialog with three options:
 * - Try Again (restart)
 * - Accept Ending (credits)
 * - Return to Menu (skip credits)
 *
 * "Built with love. Every ending is a new beginning." 💚🔥💀
 */
export class EndingDialogController {
    private eventBus: EventBus;

    // State
    private endingDialogButtons: HTMLElement[] | null = null;
    private currentEndingFocus: number = 0;
    private endingDialogKeyHandler: ((e: KeyboardEvent) => void) | null = null;
    private pendingEndingType: string | null = null;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
    }

    // ========================================
    // SHOW/HIDE DIALOG
    // ========================================

    public show(endingType: string | null = null): void {
        const dialog = document.getElementById('ending-dialog');
        if (!dialog) {
            Logger.error('Ending dialog element not found');
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

        Logger.ui(`📋 Ending dialog shown (ending type: ${endingType})`);
    }

    public hide(): void {
        const dialog = document.getElementById('ending-dialog');
        if (dialog) {
            dialog.classList.add('hidden');
        }

        // Remove keyboard listener
        if (this.endingDialogKeyHandler) {
            document.removeEventListener('keydown', this.endingDialogKeyHandler);
            this.endingDialogKeyHandler = null;
        }

        Logger.ui('📋 Ending dialog hidden');
    }

    // ========================================
    // BUTTON SETUP
    // ========================================

    private setupButtons(): void {
        const retryBtn = document.getElementById('ending-retry');
        const acceptBtn = document.getElementById('ending-accept');
        const exitBtn = document.getElementById('ending-exit');

        if (!retryBtn || !acceptBtn || !exitBtn) {
            Logger.error('Ending dialog buttons not found');
            return;
        }

        // Remove existing listeners by cloning and replacing
        const newRetryBtn = retryBtn.cloneNode(true) as HTMLElement;
        const newAcceptBtn = acceptBtn.cloneNode(true) as HTMLElement;
        const newExitBtn = exitBtn.cloneNode(true) as HTMLElement;

        retryBtn.parentNode!.replaceChild(newRetryBtn, retryBtn);
        acceptBtn.parentNode!.replaceChild(newAcceptBtn, acceptBtn);
        exitBtn.parentNode!.replaceChild(newExitBtn, exitBtn);

        // YES - Try Again (immediate restart)
        newRetryBtn.addEventListener('click', () => {
            this.hide();
            Logger.ui('🔄 Player chose: TRY AGAIN - Restarting game...');

            // Emit event for game engine to handle restart
            this.eventBus.emit('ending:retry', {
                endingType: this.pendingEndingType
            });
        });

        // NO - Accept This Ending (credits THEN menu)
        newAcceptBtn.addEventListener('click', () => {
            this.hide();
            Logger.ui('🎬 Player chose: ACCEPT ENDING - Playing credits...');

            // Emit event for game engine to show credits
            this.eventBus.emit('ending:accept', {
                endingType: this.pendingEndingType
            });
        });

        // EXIT - Return to Main Menu (skip credits)
        newExitBtn.addEventListener('click', () => {
            this.hide();
            Logger.ui('🏠 Player chose: RETURN TO MENU - Skipping credits...');

            // Emit event for game engine to return to menu
            this.eventBus.emit('ending:exit', {
                endingType: this.pendingEndingType
            });
        });

        // Store references for keyboard navigation
        this.endingDialogButtons = [newRetryBtn, newAcceptBtn, newExitBtn];
        this.currentEndingFocus = 0;
    }

    // ========================================
    // KEYBOARD NAVIGATION
    // ========================================

    private setupKeyboard(): void {
        // Remove existing listener if present
        if (this.endingDialogKeyHandler) {
            document.removeEventListener('keydown', this.endingDialogKeyHandler);
        }

        this.endingDialogKeyHandler = (e: KeyboardEvent) => {
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
                    const enterBtn = this.endingDialogButtons?.[this.currentEndingFocus];
                    if (enterBtn) {
                        enterBtn.click();
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

    private focusOption(index: number): void {
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

    // ========================================
    // CLEANUP
    // ========================================

    public destroy(): void {
        this.hide();
        this.endingDialogButtons = null;
        Logger.ui('💥 EndingDialogController destroyed');
    }
}
