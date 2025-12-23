/**
 * UIController - UI Overlay Management System
 * 
 * SOLID Refactor Session 7 (Session 58)
 * Created: December 21, 2025
 * 
 * Purpose:
 * - Handle modal dialogs (confirm, error, warning)
 * - Manage pause menu, settings, credits
 * - Extract UI overlay logic from GameEngine
 * 
 * @class UIController
 */
class UIController {
    constructor(game) {
        this.game = game;
        console.log('🎮 UIController initialized');
    }

    // ========================================
    // ELEMENT ACCESSORS
    // Centralized DOM element access - reduces scattered getElementById calls
    // ========================================

    get settingsMenu() { return document.getElementById('settings-menu'); }
    get saveLoadOverlay() { return document.getElementById('save-load-overlay'); }
    get pauseMenu() { return document.getElementById('pause-menu'); }
    get creditsModal() { return document.getElementById('credits-modal'); }
    get backlogOverlay() { return document.getElementById('backlog-overlay'); }
    get bootstrapOverlay() { return document.getElementById('bootstrap-overlay'); }
    get echoOverlay() { return document.getElementById('echo-overlay'); }
    get skipIndicator() { return document.getElementById('skip-indicator'); }
    get standaloneNotesViewer() { return document.getElementById('standalone-notes-viewer'); }
    get devHud() { return document.getElementById('dev-hud'); }

    // Check element visibility
    isVisible(elementOrId) {
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
    // ========================================

    showErrorOverlay(title, message) {
        const overlay = OverlayManager.createError(title, message, {
            buttonText: 'CONTINUE'
        });
        OverlayManager.show(overlay);
    }

    // ========================================
    // CONFIRM DIALOG
    // Refactored to use OverlayManager (Session 118)
    // ========================================

    showConfirmDialog(title, message, onConfirm, showCancel = true) {
        const overlay = OverlayManager.createConfirm(title, message, onConfirm, {
            showCancel,
            confirmText: 'CONFIRM',
            cancelText: 'CANCEL'
        });
        OverlayManager.show(overlay);

        console.log(`📋 Confirm dialog shown: ${title}`);
    }

    // ========================================
    // WARNING OVERLAY
    // Refactored to use OverlayManager (Session 118)
    // ========================================

    showWarningOverlay(title, message) {
        const overlay = OverlayManager.createWarning(title, message, {
            buttonText: 'UNDERSTOOD'
        });
        OverlayManager.show(overlay);

        console.log(`⚠️ Warning overlay shown: ${title}`);
    }

    // ========================================
    // UNLOCK NOTIFICATIONS
    // ZEE + DIZEE ADDITIONS: Feature unlock screens
    // ========================================

    showSkipUnlockNotification() {
        const overlay = OverlayManager.createInfo(
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
        OverlayManager.show(overlay);
    }

    closeSkipUnlockNotification() {
        OverlayManager.hide('skip-unlock-notification', true);
    }

    showNotesUnlockNotification() {
        const overlay = OverlayManager.createInfo(
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
        OverlayManager.show(overlay);
    }

    closeNotesUnlockNotification() {
        OverlayManager.hide('notes-unlock-notification', true);
    }

    showToriGatchiUnlockNotification() {
        const overlay = OverlayManager.createInfo(
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
        OverlayManager.show(overlay);
    }

    closeToriGatchiUnlockNotification() {
        OverlayManager.hide('torigatchi-unlock-notification', true);
    }

    // ========================================
    // UTILITY UI METHODS
    // ========================================

    showRandomLoadingTip() {
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

        if (tipElement) {
            tipElement.textContent = randomTip;
        }
    }

    updateFullscreenButton() {
        const button = document.getElementById('fullscreen-button');
        if (!button) return;

        const isFullscreen = document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement;

        button.textContent = isFullscreen ? 'EXIT FULLSCREEN' : 'ENTER FULLSCREEN';
    }

    showEscHintBriefly() {
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

    closeBacklog() {
        const backlogScreen = document.getElementById('backlog-screen');
        if (backlogScreen) {
            backlogScreen.style.display = 'none';
        }
    }

    closeBootstrap() {
        const overlay = document.getElementById('bootstrap-overlay');
        overlay.classList.remove('visible');
        setTimeout(() => overlay.style.display = 'none', 500);
    }

    closeEchoCompilation() {
        const overlay = document.getElementById('echo-overlay');
        overlay.classList.remove('visible');
        setTimeout(() => overlay.style.display = 'none', 500);
    }

    // ========================================
    // TIP POOLS
    // ========================================

    getMainMenuTips() {
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

    getRouteSelectTips() {
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

    getHapticPatterns() {
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
