import { EventBus } from '@core/EventBus';
import { StateManager } from '@core/StateManager';

/**
 * ════════════════════════════════════════════════════════════════
 * SCREENSHOT CONTROLLER - V2 Port
 * Phase 22b: Screenshot Mode Management
 *
 * V1 Parity: system/screenshot-controller.js (189 lines → ~230 lines)
 *
 * Purpose:
 * - Toggle UI visibility for clean screenshots
 * - Status bar indicator when active
 * - Tap-to-exit on mobile devices
 * - Hide all UI chrome (buttons, tether, notes, etc.)
 *
 * Features:
 * - Keyboard shortcut toggle (from game engine)
 * - Hide dialogue buttons while keeping dialogue box
 * - Status notification indicator
 * - Mobile tap handler for exit
 * - NotificationShade integration
 *
 * V1 Parity Notes:
 * - All element visibility logic preserved
 * - Status bar text unchanged ("Screenshot Mode")
 * - Tap handler logic identical
 * - CSS class toggle unchanged (ui-hidden)
 *
 * 📸 "Capture the moment. Share the story." - Version 848
 * ════════════════════════════════════════════════════════════════
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

interface GameReference {
    state?: StateManager;
    dialogueBox?: HTMLElement;
    notificationShade?: {
        toggleScreenshotMode(): void;
    };
}

export class ScreenshotController {
    private game: GameReference;
    private tapHandler: (() => void) | null = null;

    constructor(game: GameReference, _eventBus?: EventBus) {
        this.game = game;

        console.log('📸 ScreenshotController initialized');
    }

    // ========================================
    // STATE CHECKING
    // ========================================

    /**
     * Check if screenshot mode is active
     */
    public isActive(): boolean {
        return this.game?.state?.get('ui.hidden') ?? false;
    }

    // ========================================
    // TOGGLE SCREENSHOT MODE
    // ========================================

    /**
     * Toggle screenshot mode
     */
    public toggle(): void {
        const isHidden = this.isActive();

        if (!isHidden) {
            this.enterScreenshotMode();
        } else {
            this.exitScreenshotMode();
        }

        // Toggle notification shade system
        if (this.game?.notificationShade) {
            this.game.notificationShade.toggleScreenshotMode();
        }

        // Mobile tap handler
        this.updateTapHandler(!isHidden);
    }

    // ========================================
    // ENTER SCREENSHOT MODE
    // ========================================

    /**
     * Enter screenshot mode - hide UI elements
     */
    private enterScreenshotMode(): void {
        document.body.classList.add('ui-hidden');

        // Hide buttons (dialogue box handled by CSS via ui-hidden class)
        this.setElementOpacity('pause-button', '0');
        this.setElementOpacity('backlog-button', '0');
        this.setElementOpacity('skip-button', '0');

        // Hide tether UI if visible
        const tetherUI = document.getElementById('tether-ui');
        if (tetherUI && tetherUI.style.display === 'block') {
            tetherUI.style.opacity = '0';
        }

        // Hide notes button if visible
        const notesButton = document.getElementById('notes-button');
        if (notesButton && notesButton.style.display === 'block') {
            notesButton.style.opacity = '0';
        }

        // Show status indicator
        this.showStatusIndicator();

        this.game?.state?.set('ui.hidden', true);
        console.log('📸 Screenshot mode ON - dialogue platform visible, status bar showing context');
    }

    // ========================================
    // EXIT SCREENSHOT MODE
    // ========================================

    /**
     * Exit screenshot mode - restore UI elements
     */
    private exitScreenshotMode(): void {
        document.body.classList.remove('ui-hidden');

        // Restore dialogue box (remove inline overrides)
        if (this.game?.dialogueBox) {
            this.game.dialogueBox.style.opacity = '';
            this.game.dialogueBox.style.pointerEvents = '';
        }

        // Restore buttons
        this.setElementOpacity('pause-button', '1');
        this.setElementOpacity('backlog-button', '1');
        this.setElementOpacity('skip-button', '1');

        // Restore tether UI if visible
        const tetherUI = document.getElementById('tether-ui');
        if (tetherUI && tetherUI.style.display === 'block') {
            tetherUI.style.opacity = '1';
        }

        // Restore notes button if visible
        const notesButton = document.getElementById('notes-button');
        if (notesButton && notesButton.style.display === 'block') {
            notesButton.style.opacity = '1';
        }

        // Hide status indicator
        this.hideStatusIndicator();

        this.game?.state?.set('ui.hidden', false);
        console.log('📸 Screenshot mode OFF - full UI restored');
    }

    // ========================================
    // UI HELPERS
    // ========================================

    /**
     * Set opacity on an element by ID
     */
    private setElementOpacity(id: string, opacity: string): void {
        const element = document.getElementById(id);
        if (element) element.style.opacity = opacity;
    }

    /**
     * Show screenshot mode status indicator
     */
    private showStatusIndicator(): void {
        const statusNotification = document.getElementById('status-notification');
        if (statusNotification) {
            const icon = statusNotification.querySelector('.status-notif-icon');
            const text = statusNotification.querySelector('.status-notif-text');
            if (icon) icon.textContent = '📸';
            if (text) text.textContent = 'Screenshot Mode';
            statusNotification.classList.add('visible');
        }
    }

    /**
     * Hide screenshot mode status indicator
     */
    private hideStatusIndicator(): void {
        const statusNotification = document.getElementById('status-notification');
        if (statusNotification) {
            statusNotification.classList.remove('visible');
        }
    }

    // ========================================
    // MOBILE TAP HANDLER
    // ========================================

    /**
     * Update mobile tap-to-exit handler
     */
    private updateTapHandler(entering: boolean): void {
        if (entering) {
            // Add tap listener
            this.tapHandler = () => {
                if (this.isActive()) {
                    this.toggle();
                }
            };
            document.body.addEventListener('touchstart', this.tapHandler);
        } else {
            // Remove tap listener
            if (this.tapHandler) {
                document.body.removeEventListener('touchstart', this.tapHandler);
                this.tapHandler = null;
            }
        }
    }
}
