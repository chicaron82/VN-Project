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
    // Extracted from GameEngine.showErrorOverlay
    // ========================================

    showErrorOverlay(title, message) {
        const overlay = document.createElement('div');
        overlay.className = 'error-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(20, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            animation: fadeIn 0.3s ease-out;
        `;

        const box = document.createElement('div');
        box.style.cssText = `
            background: linear-gradient(135deg, #2e1a1a 0%, #3e1616 100%);
            border: 2px solid #ff4444;
            border-radius: 10px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 0 30px rgba(255, 68, 68, 0.5);
            font-family: 'Courier New', monospace;
            color: #fff;
        `;

        const titleEl = document.createElement('div');
        titleEl.style.cssText = `
            font-size: 24px;
            font-weight: bold;
            color: #ff4444;
            text-align: center;
            margin-bottom: 25px;
            text-transform: uppercase;
            letter-spacing: 2px;
        `;
        titleEl.textContent = '⚠️ ' + title;

        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 30px;
            white-space: pre-wrap;
            color: #e0e0e0;
            text-align: center;
        `;
        messageEl.textContent = message;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'CONTINUE';
        closeBtn.style.cssText = `
            display: block;
            width: 200px;
            margin: 0 auto;
            padding: 12px 25px;
            background: transparent;
            border: 2px solid #ff4444;
            color: #ff4444;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
        `;

        closeBtn.onmouseover = () => {
            closeBtn.style.background = '#ff4444';
            closeBtn.style.color = '#000';
        };
        closeBtn.onmouseout = () => {
            closeBtn.style.background = 'transparent';
            closeBtn.style.color = '#ff4444';
        };
        closeBtn.onclick = () => {
            document.body.removeChild(overlay);
        };

        box.appendChild(titleEl);
        box.appendChild(messageEl);
        box.appendChild(closeBtn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    // ========================================
    // CONFIRM DIALOG
    // Extracted from GameEngine.showConfirmDialog
    // ========================================

    showConfirmDialog(title, message, onConfirm, showCancel = true) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10003;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: rgba(10, 10, 30, 0.95);
            border: 2px solid #0ff;
            border-radius: 10px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 0 40px rgba(0, 255, 255, 0.5);
        `;

        const titleEl = document.createElement('h2');
        titleEl.textContent = title;
        titleEl.style.cssText = `
            color: #0ff;
            font-size: 1.8em;
            margin-bottom: 20px;
            text-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
        `;

        const messageEl = document.createElement('p');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            color: #fff;
            font-size: 1.1em;
            line-height: 1.6;
            margin-bottom: 30px;
            white-space: pre-line;
        `;

        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            gap: 15px;
            justify-content: center;
        `;

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'CONFIRM';
        confirmBtn.style.cssText = `
            background: rgba(0, 255, 255, 0.2);
            border: 2px solid #0ff;
            color: #0ff;
            padding: 12px 30px;
            font-size: 1.1em;
            cursor: pointer;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            transition: all 0.3s ease;
        `;
        confirmBtn.onmouseover = () => {
            confirmBtn.style.background = 'rgba(0, 255, 255, 0.4)';
            confirmBtn.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.6)';
        };
        confirmBtn.onmouseout = () => {
            confirmBtn.style.background = 'rgba(0, 255, 255, 0.2)';
            confirmBtn.style.boxShadow = 'none';
        };
        confirmBtn.onclick = () => {
            overlay.remove();
            if (onConfirm) onConfirm();
        };

        buttonsContainer.appendChild(confirmBtn);

        if (showCancel) {
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'CANCEL';
            cancelBtn.style.cssText = `
                background: rgba(255, 100, 100, 0.2);
                border: 2px solid #f55;
                color: #f55;
                padding: 12px 30px;
                font-size: 1.1em;
                cursor: pointer;
                border-radius: 5px;
                font-family: 'Courier New', monospace;
                font-weight: bold;
                transition: all 0.3s ease;
            `;
            cancelBtn.onmouseover = () => {
                cancelBtn.style.background = 'rgba(255, 100, 100, 0.4)';
                cancelBtn.style.boxShadow = '0 0 15px rgba(255, 100, 100, 0.6)';
            };
            cancelBtn.onmouseout = () => {
                cancelBtn.style.background = 'rgba(255, 100, 100, 0.2)';
                cancelBtn.style.boxShadow = 'none';
            };
            cancelBtn.onclick = () => {
                overlay.remove();
            };

            buttonsContainer.appendChild(cancelBtn);
        }

        dialog.appendChild(titleEl);
        dialog.appendChild(messageEl);
        dialog.appendChild(buttonsContainer);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        console.log(`📋 Confirm dialog shown: ${title}`);
    }

    // ========================================
    // WARNING OVERLAY
    // Extracted from GameEngine.showWarningOverlay
    // ========================================

    showWarningOverlay(title, message) {
        const overlay = document.createElement('div');
        overlay.className = 'warning-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;

        const box = document.createElement('div');
        box.className = 'warning-box';
        box.style.cssText = `
            background: linear-gradient(135deg, #2e1a1a 0%, #3e1616 100%);
            border: 2px solid #ff4444;
            border-radius: 10px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 0 30px rgba(255, 68, 68, 0.3);
            animation: slideIn 0.4s ease-out;
            font-family: 'Courier New', monospace;
            color: #fff;
        `;

        const titleEl = document.createElement('div');
        titleEl.style.cssText = `
            font-size: 24px;
            font-weight: bold;
            color: #ff4444;
            text-align: center;
            margin-bottom: 25px;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
        `;
        titleEl.textContent = title;

        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 30px;
            white-space: pre-wrap;
            color: #e0e0e0;
            text-align: center;
        `;
        messageEl.textContent = message;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'UNDERSTOOD';
        closeBtn.style.cssText = `
            display: block;
            width: 200px;
            margin: 0 auto;
            padding: 12px 25px;
            background: transparent;
            border: 2px solid #ff4444;
            color: #ff4444;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
        `;

        closeBtn.onmouseover = () => {
            closeBtn.style.background = '#ff4444';
            closeBtn.style.color = '#000';
            closeBtn.style.boxShadow = '0 0 20px rgba(255, 68, 68, 0.5)';
        };

        closeBtn.onmouseout = () => {
            closeBtn.style.background = 'transparent';
            closeBtn.style.color = '#ff4444';
            closeBtn.style.boxShadow = 'none';
        };

        closeBtn.onclick = () => {
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        };

        box.appendChild(titleEl);
        box.appendChild(messageEl);
        box.appendChild(closeBtn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        console.log(`⚠️ Warning overlay shown: ${title}`);
    }

    // ========================================
    // UNLOCK NOTIFICATIONS
    // ZEE + DIZEE ADDITIONS: Feature unlock screens
    // ========================================

    showSkipUnlockNotification() {
        const notification = document.createElement('div');
        notification.id = 'skip-unlock-notification';
        notification.innerHTML = `
            <div class="unlock-title">NEW FEATURE UNLOCKED! ✨</div>
            <div class="unlock-feature">SKIP READ TEXT</div>
            <div class="unlock-description">
                You've completed a timeline.<br>
                You can now fast-forward through<br>
                previously seen dialogue on future<br>
                playthroughs.<br><br>
                Press [S] or click [SKIP >>] to activate.<br><br>
                <em>The loop remembers. You remember.</em>
            </div>
            <button class="unlock-continue" onclick="game.closeSkipUnlockNotification()">CONTINUE</button>
        `;

        document.body.appendChild(notification);

        // Fade in
        setTimeout(() => {
            notification.classList.add('visible');
        }, 100);
    }

    closeSkipUnlockNotification() {
        const notification = document.getElementById('skip-unlock-notification');
        if (notification) {
            notification.classList.remove('visible');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }

    showNotesUnlockNotification() {
        const notification = document.createElement('div');
        notification.id = 'notes-unlock-notification';
        notification.innerHTML = `
            <div class="unlock-title">NOTES NOW UNLOCKED! 📝</div>
            <div class="unlock-feature">COLLECTIBLE NOTES SYSTEM</div>
            <div class="unlock-description">
                You've completed an ending.<br>
                Hidden notes from the UV7 crew can now<br>
                be discovered throughout both routes.<br><br>
                Look for the 📝 icon during gameplay.<br><br>
                <em>Some notes contain secret codes...</em>
            </div>
            <button class="unlock-continue" onclick="game.closeNotesUnlockNotification()">CONTINUE</button>
        `;

        document.body.appendChild(notification);

        // Fade in
        setTimeout(() => {
            notification.classList.add('visible');
        }, 100);
    }

    closeNotesUnlockNotification() {
        const notification = document.getElementById('notes-unlock-notification');
        if (notification) {
            notification.classList.remove('visible');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }

    showToriGatchiUnlockNotification() {
        const notification = document.createElement('div');
        notification.id = 'torigatchi-unlock-notification';
        notification.innerHTML = `
            <div class="unlock-title">NEW MAIN MENU OPTION UNLOCKED! 🎮</div>
            <div class="unlock-feature">TORIGATCHI</div>
            <div class="unlock-description">
                You've discovered the reverse trapdoor.<br><br>
                ToriGatchi is now permanently available<br>
                from the main menu. No need to type the<br>
                code again - just look for the 🎮 button.<br><br>
                <em>The gateway remembers you.</em>
            </div>
            <button class="unlock-continue" onclick="game.closeToriGatchiUnlockNotification()">CONTINUE</button>
        `;

        document.body.appendChild(notification);

        // Fade in
        setTimeout(() => {
            notification.classList.add('visible');
        }, 100);
    }

    closeToriGatchiUnlockNotification() {
        const notification = document.getElementById('torigatchi-unlock-notification');
        if (notification) {
            notification.classList.remove('visible');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
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
