/**
 * ════════════════════════════════════════════════════════════════
 * FULLSCREEN CONTROLLER - V2 Port
 * Phase 22e: Cross-Browser Fullscreen Management
 *
 * V1 Parity: system/fullscreen-controller.js (126 lines → ~160 lines)
 *
 * Purpose:
 * - Cross-browser fullscreen API wrapper
 * - Vendor prefix support (webkit, moz, ms)
 * - Fullscreen state detection
 * - Auto-close pause menu on toggle
 *
 * Features:
 * - requestFullscreen with vendor prefixes
 * - exitFullscreen with vendor prefixes
 * - isFullscreen state checking
 * - Async button update (100ms delay)
 * - Pause menu integration
 *
 * V1 Parity Notes:
 * - All vendor prefixes preserved
 * - Timing unchanged (100ms button update, 150ms menu close)
 * - Type safety with @ts-ignore for vendor APIs
 * - UIController delegation unchanged
 *
 * 📺 "Immersive storytelling at full scale." - Version 848
 * ════════════════════════════════════════════════════════════════
 */

import { Logger } from '@utils/Logger';

// ========================================
// TYPE DEFINITIONS
// ========================================

interface GameReference {
    saveLoadUI?: {
        hidePauseMenu(): void;
    };
    uiController?: {
        updateFullscreenButton?(): void;
    };
}

// Vendor-prefixed fullscreen API types
interface DocumentWithFullscreen extends Document {
    webkitFullscreenElement?: Element;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitExitFullscreen?: () => Promise<void>;
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
}

interface ElementWithFullscreen extends HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
}

export class FullscreenController {
    private game: GameReference;

    constructor(game: GameReference) {
        this.game = game;
        Logger.ui('📺 FullscreenController initialized');
    }

    // ========================================
    // STATE CHECKING
    // ========================================

    /**
     * Check if currently in fullscreen mode
     */
    public isFullscreen(): boolean {
        const doc = document as DocumentWithFullscreen;
        return !!(
            document.fullscreenElement ||
            doc.webkitFullscreenElement ||
            doc.mozFullScreenElement ||
            doc.msFullscreenElement
        );
    }

    // ========================================
    // TOGGLE FULLSCREEN
    // ========================================

    /**
     * Toggle fullscreen mode
     */
    public toggle(): void {
        if (this.isFullscreen()) {
            this.exit();
        } else {
            this.enter();
        }

        // Update button text after a short delay (fullscreen API is async)
        setTimeout(() => {
            this.updateButton();
        }, 100);

        // Auto-close pause menu after toggling
        if (this.game?.saveLoadUI?.hidePauseMenu) {
            setTimeout(() => {
                this.game.saveLoadUI!.hidePauseMenu();
            }, 150);
        }
    }

    // ========================================
    // ENTER FULLSCREEN
    // ========================================

    /**
     * Enter fullscreen mode
     */
    private enter(): void {
        const element = document.documentElement as ElementWithFullscreen;

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    // ========================================
    // EXIT FULLSCREEN
    // ========================================

    /**
     * Exit fullscreen mode
     */
    private exit(): void {
        const doc = document as DocumentWithFullscreen;

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
            doc.msExitFullscreen();
        }
    }

    // ========================================
    // UI UPDATE
    // ========================================

    /**
     * Update fullscreen button state
     */
    private updateButton(): void {
        this.game?.uiController?.updateFullscreenButton?.();
    }
}
