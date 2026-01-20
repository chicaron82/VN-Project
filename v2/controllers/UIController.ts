import { EventBus } from '@core/EventBus';
import { OverlayManager } from '../managers/OverlayManager';

/**
 * ════════════════════════════════════════════════════════════════
 * UI CONTROLLER - V2 Port
 * Phase 20b: UI Overlay Management System
 *
 * V1 Parity: ui-controller.js (314 lines → ~380 lines)
 *
 * SOLID Refactor Session 7 (Session 58)
 * Created: December 21, 2025
 *
 * Purpose:
 * - Handle modal dialogs (confirm, error, warning)
 * - Manage unlock notifications
 * - Extract UI overlay logic from GameEngine
 * - Centralized DOM element access
 *
 * Responsibilities:
 * - Error/warning/confirm overlays via OverlayManager
 * - Feature unlock notifications (Skip, Notes, ToriGatchi)
 * - Loading tips and UI utilities
 * - Fullscreen button state
 * - ESC hint visibility
 * - Haptic pattern definitions
 *
 * V1 Parity Notes:
 * - All this.overlayManager.create* calls preserved
 * - All tip text verbatim from V1
 * - DIZEE's haptic emotional language preserved
 * - EventBus integration added for V2 coordination
 *
 * 💡 "The loop remembers. You remember."
 * ════════════════════════════════════════════════════════════════
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface HapticPattern {
    light: number;
    medium: number;
    strong: number;
    longBuzz: number;
    double: number[];
    triple: number[];
    denied: number[];
    pulse: number[];
    success: number[];
    warning: number[];
    error: number[];
    heartbeat: number[];
    glitch: number[];
    echo: number[];
}

// Minimal game instance interface
export interface GameInstance {
    isMobile?: boolean;
}

export class UIController {
    private game: GameInstance;
    // @ts-expect-error - Reserved for future EventBus integration
    private eventBus: EventBus;
    private overlayManager: OverlayManager;

    constructor(game: GameInstance, eventBus: EventBus, overlayManager: OverlayManager) {
        this.game = game;
        this.eventBus = eventBus;
        this.overlayManager = overlayManager;

        console.log('🎮 UIController initialized');
    }

    // ========================================
    // ELEMENT ACCESSORS
    // Centralized DOM element access - reduces scattered getElementById calls
    // V1 Parity: ui-controller.js lines 25-34
    // ========================================

    get settingsMenu(): HTMLElement | null {
        return document.getElementById('settings-menu');
    }

    get saveLoadOverlay(): HTMLElement | null {
        return document.getElementById('save-load-overlay');
    }

    get pauseMenu(): HTMLElement | null {
        return document.getElementById('pause-menu');
    }

    get creditsModal(): HTMLElement | null {
        return document.getElementById('credits-modal');
    }

    get backlogOverlay(): HTMLElement | null {
        return document.getElementById('backlog-overlay');
    }

    get bootstrapOverlay(): HTMLElement | null {
        return document.getElementById('bootstrap-overlay');
    }

    get echoOverlay(): HTMLElement | null {
        return document.getElementById('echo-overlay');
    }

    get skipIndicator(): HTMLElement | null {
        return document.getElementById('skip-indicator');
    }

    get standaloneNotesViewer(): HTMLElement | null {
        return document.getElementById('standalone-notes-viewer');
    }

    get devHud(): HTMLElement | null {
        return document.getElementById('dev-hud');
    }

    /**
     * Check element visibility
     * V1 Parity: ui-controller.js lines 37-44
     */
    public isVisible(elementOrId: string | HTMLElement): boolean {
        const el = typeof elementOrId === 'string'
            ? document.getElementById(elementOrId)
            : elementOrId;
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
    }

    // ========================================
    // ERROR OVERLAY
    // Refactored to use OverlayManager (Session 118)
    // V1 Parity: ui-controller.js lines 51-56
    // ========================================

    public showErrorOverlay(title: string, message: string): void {
        const overlay = this.overlayManager.createError(title, message, {
            buttonText: 'CONTINUE'
        });
        this.overlayManager.show(overlay);
    }

    // ========================================
    // CONFIRM DIALOG
    // Refactored to use OverlayManager (Session 118)
    // V1 Parity: ui-controller.js lines 63-72
    // ========================================

    public showConfirmDialog(
        title: string,
        message: string,
        onConfirm: () => void,
        showCancel: boolean = true
    ): void {
        const overlay = this.overlayManager.createConfirm(title, message, onConfirm, {
            showCancel,
            confirmText: 'CONFIRM',
            cancelText: 'CANCEL'
        });
        this.overlayManager.show(overlay);

        console.log(`📋 Confirm dialog shown: ${title}`);
    }

    // ========================================
    // WARNING OVERLAY
    // Refactored to use OverlayManager (Session 118)
    // V1 Parity: ui-controller.js lines 79-86
    // ========================================

    public showWarningOverlay(title: string, message: string): void {
        const overlay = this.overlayManager.createWarning(title, message, {
            buttonText: 'UNDERSTOOD'
        });
        this.overlayManager.show(overlay);

        console.log(`⚠️ Warning overlay shown: ${title}`);
    }

    // ========================================
    // UNLOCK NOTIFICATIONS
    // ZEE + DIZEE ADDITIONS: Feature unlock screens
    // V1 Parity: ui-controller.js lines 93-170
    // ========================================

    public showSkipUnlockNotification(): void {
        const overlay = this.overlayManager.createInfo(
            'NEW FEATURE UNLOCKED! ✨',
            `SKIP READ TEXT

You've completed a timeline.
You can now fast-forward through
previously seen dialogue on future
playthroughs.

Press [S] or click [SKIP >>] to activate.

The loop remembers. You remember.`,
            {
                variant: 'success',
                buttonText: 'CONTINUE',
                emoji: '✨',
                id: 'skip-unlock-notification'
            }
        );
        this.overlayManager.show(overlay);
    }

    public closeSkipUnlockNotification(): void {
        this.overlayManager.hide('skip-unlock-notification', true);
    }

    public showNotesUnlockNotification(): void {
        const overlay = this.overlayManager.createInfo(
            'NOTES NOW UNLOCKED! 📝',
            `COLLECTIBLE NOTES SYSTEM

You've completed an ending.
Hidden notes from the UV7 crew can now
be discovered throughout both routes.

Look for the 📝 icon during gameplay.

Some notes contain secret codes...`,
            {
                variant: 'success',
                buttonText: 'CONTINUE',
                emoji: '📝',
                id: 'notes-unlock-notification'
            }
        );
        this.overlayManager.show(overlay);
    }

    public closeNotesUnlockNotification(): void {
        this.overlayManager.hide('notes-unlock-notification', true);
    }

    public showToriGatchiUnlockNotification(): void {
        const overlay = this.overlayManager.createInfo(
            'NEW MAIN MENU OPTION UNLOCKED! 🎮',
            `TORIGATCHI

You've discovered the reverse trapdoor.

ToriGatchi is now permanently available
from the main menu. No need to type the
code again - just look for the 🎮 button.

The gateway remembers you.`,
            {
                variant: 'success',
                buttonText: 'CONTINUE',
                emoji: '🎮',
                id: 'torigatchi-unlock-notification'
            }
        );
        this.overlayManager.show(overlay);
    }

    public closeToriGatchiUnlockNotification(): void {
        this.overlayManager.hide('torigatchi-unlock-notification', true);
    }

    // ========================================
    // UTILITY UI METHODS
    // V1 Parity: ui-controller.js lines 176-245
    // ========================================

    public showRandomLoadingTip(): void {
        const tips = [
            "💡 Tip: Press [ESC] to pause at any time",
            "💡 Tip: Both routes contain different perspectives of the same events",
            "💡 Tip: Complete any ending to unlock Skip mode",
            "💡 Tip: Hold [CTRL] to temporarily fast-forward dialogue",
            "💡 Tip: Each choice matters - there are multiple endings",
            "💡 Tip: Try playing both Ronnie and Tori's routes for the full story",
            "💡 Tip: The version number isn't just for show...",
            "💡 Tip: Some notes are only found on specific routes",
            "🖤 \"Always. Always. Always.\" - Tori",
            "💙 This game was built through AI collaboration",
            "💡 Tip: Android back button works throughout the game",
            "💡 Tip: Save often - there are multiple paths to explore"
        ];

        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        const tipElement = document.getElementById('loading-tip');

        if (tipElement && randomTip) {
            tipElement.textContent = randomTip;
        }
    }

    public updateFullscreenButton(): void {
        const button = document.getElementById('fullscreen-button');
        if (!button) return;

        const isFullscreen = document.fullscreenElement ||
            (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
            (document as Document & { mozFullScreenElement?: Element }).mozFullScreenElement ||
            (document as Document & { msFullscreenElement?: Element }).msFullscreenElement;

        button.textContent = isFullscreen ? 'EXIT FULLSCREEN' : 'ENTER FULLSCREEN';
    }

    public showEscHintBriefly(): void {
        // Only show on desktop (not mobile)
        if (this.game.isMobile) return;

        const escHint = document.getElementById('esc-hint');
        if (!escHint) return;

        // Show hint
        escHint.classList.add('visible');

        // Hide after 4 seconds
        setTimeout(() => {
            escHint.classList.remove('visible');
        }, 4000);
    }

    public closeBacklog(): void {
        const backlogScreen = document.getElementById('backlog-screen');
        if (backlogScreen) {
            backlogScreen.style.display = 'none';
        }
    }

    public closeBootstrap(): void {
        const overlay = document.getElementById('bootstrap-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
            setTimeout(() => {
                if (overlay) overlay.style.display = 'none';
            }, 500);
        }
    }

    public closeEchoCompilation(): void {
        const overlay = document.getElementById('echo-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
            setTimeout(() => {
                if (overlay) overlay.style.display = 'none';
            }, 500);
        }
    }

    // ========================================
    // TIP POOLS
    // V1 Parity: ui-controller.js lines 251-276
    // ========================================

    public getMainMenuTips(): string[] {
        return [
            "💡 Hidden codes unlock secret content - read the notes carefully...",
            "💡 Some puzzles require playing both routes to solve",
            "💡 The version number changes based on your choices",
            "💡 Complete any ending to unlock Skip mode",
            "💡 Your saves carry over between sessions",
            "🖤 \"Always. Always. Always.\" - Tori",
            "💡 Secret codes are hidden throughout the game...",
            "💡 The UV7 crew left messages for you in the notes",
            "💡 Each ending reveals different aspects of the story",
            "💡 Press [ESC] to pause at any time"
        ];
    }

    public getRouteSelectTips(): string[] {
        return [
            "💡 Each route contains different pieces of the puzzle",
            "💡 Tori's route has a tether system - watch it carefully",
            "💡 Some notes are only found on specific routes",
            "💡 Playing both routes reveals the full story",
            "💡 Cross-route secrets exist - explore thoroughly",
            "💡 Your choices determine which ending you reach",
            "💡 Ronnie's route focuses on external perspective"
        ];
    }

    // ========================================
    // HAPTIC PATTERNS
    // DIZEE FIX: Narrative haptics = emotional language
    // V1 Parity: ui-controller.js lines 278-304
    // ========================================

    public getHapticPatterns(): HapticPattern {
        return {
            // Basic intensity levels
            // DIZEE FIX: Increased durations again (40ms -> 60ms) for more noticeable feedback
            'light': 60,           // Quick tap (UI navigation)
            'medium': 100,         // Standard feedback (choices, buttons)
            'strong': 150,         // Important actions (confirmations)

            // Rhythmic patterns (EMOTIONAL LANGUAGE)
            // DIZEE: Narrative haptics = 1-second buzzes (very distinct from UI)
            'longBuzz': 1000,                 // Single 1-second buzz (tamagotchi pull)
            'double': [1000, 200, 1000],      // Two 1-second buzzes (vessel hop, transitions)
            'triple': [50, 40, 50, 40, 50],   // Three taps (special unlocks)
            'denied': [80, 50, 80, 50, 80],   // Triple DENIAL (blocked saves, locked actions, despair)
            'pulse': [60, 40, 60, 40, 60],    // Sustained pulse (loading, waiting)

            // Feedback types
            'success': [40, 50, 80],          // Success chirp (achievement, unlock)
            'warning': [100, 100, 100],         // Alert buzz (warning, caution)
            'error': [150, 50, 150, 50, 150], // Error shake (failure, blocked)

            // Special story moments
            'heartbeat': [80, 150, 100, 150],  // Slow heartbeat (tension moments)
            'glitch': [30, 30, 15, 40, 20],    // Glitchy stutter (reality breaks)
            'echo': [40, 100, 40, 100, 40],     // Echo appearance
        };
    }
}
