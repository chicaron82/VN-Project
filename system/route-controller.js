// ========================================
// ROUTE CONTROLLER
// Route selection, prologue skip, and navigation
// SOLID Refactor: Extracted from GameEngine
// ========================================

/**
 * RouteController
 * 
 * Manages route selection screen and prologue skip functionality.
 * 
 * Responsibilities:
 * - Show/hide route selection screen
 * - Skip prologue prompt display
 * - Route navigation
 * 
 * @class RouteController
 */
class RouteController {
    constructor(game) {
        this.game = game;
    }

    // ========================================
    // ROUTE SELECTION SCREEN
    // ========================================

    showRouteSelect() {
        // CRITICAL: Clear sprites before showing route selection
        // This prevents prologue sprites from lingering into routes
        this.game.clearAllSprites();

        // Fade out game view (after prologue)
        this.game.gameView.style.opacity = '0';

        // Hide Game UI Layer
        const gameUI = document.getElementById('game-ui-layer');
        if (gameUI) gameUI.style.display = 'none';

        setTimeout(() => {
            this.game.gameView.style.display = 'none';

            // Show route selection screen
            const routeSelect = document.getElementById('route-select');
            routeSelect.style.display = 'block';

            // Fade in
            setTimeout(() => {
                routeSelect.style.opacity = '1';

                // Initialize route selector (UV7 glow-up)
                // Always reinitialize to ensure event listeners are attached
                this.game.initRouteSelector();

                // ZEE'S ADDITION: Start tip rotation 🖤
                this.game.startRouteSelectTipRotation();
            }, 100);
        }, 1000);
    }

    backToMenu() {
        // Clear sprites when returning to menu
        this.game.clearAllSprites();

        // ZEE'S ADDITION: Stop route select tips 🖤
        this.game.stopRouteSelectTipRotation();

        // Fade out route select
        const routeSelect = document.getElementById('route-select');
        routeSelect.style.opacity = '0';

        setTimeout(() => {
            routeSelect.style.display = 'none';
            // Use standard showMainMenu to ensure Carousel is re-initialized
            this.game.showMainMenu();
        }, 500);
    }

    // ========================================
    // SKIP PROLOGUE SYSTEM
    // ========================================

    showSkipProloguePrompt() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'skip-prompt-overlay';
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

        // Create prompt box
        const box = document.createElement('div');
        box.style.cssText = `
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid #0ff;
            border-radius: 10px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            font-family: 'Courier New', monospace;
            color: #fff;
            box-shadow: 0 0 50px rgba(0, 255, 255, 0.5);
            animation: slideIn 0.4s ease-out;
        `;

        // Title
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 24px;
            font-weight: bold;
            color: #0ff;
            margin-bottom: 20px;
            letter-spacing: 2px;
            text-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
        `;
        title.textContent = "You've walked this path before.";

        // Message
        const message = document.createElement('div');
        message.style.cssText = `
            font-size: 16px;
            line-height: 1.8;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 10px;
        `;
        message.textContent = "The device remembers.";

        // Sub-message
        const subMessage = document.createElement('div');
        subMessage.style.cssText = `
            font-size: 14px;
            line-height: 1.6;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 30px;
            font-style: italic;
        `;
        subMessage.textContent = "Skip to the choice that matters?";

        // Buttons container
        const buttons = document.createElement('div');
        buttons.style.cssText = `
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        `;

        // Play Prologue button
        const playBtn = document.createElement('button');
        playBtn.textContent = 'EXPERIENCE AGAIN';
        playBtn.style.cssText = `
            padding: 12px 24px;
            background: transparent;
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: rgba(255, 255, 255, 0.7);
            font-family: 'Courier New', monospace;
            font-size: 14px;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
            min-width: 160px;
        `;

        playBtn.onmouseover = () => {
            playBtn.style.borderColor = 'rgba(255, 255, 255, 0.6)';
            playBtn.style.color = '#fff';
            playBtn.style.transform = 'translateY(-2px)';
        };

        playBtn.onmouseout = () => {
            playBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            playBtn.style.color = 'rgba(255, 255, 255, 0.7)';
            playBtn.style.transform = 'translateY(0)';
        };

        playBtn.onclick = () => {
            // Mark prompt as seen - never show again
            localStorage.setItem('skipProloguePromptSeen', 'true');
            document.body.removeChild(overlay);
            this.game.startPrologueNormally();
        };

        // Skip button
        const skipBtn = document.createElement('button');
        skipBtn.textContent = 'JUMP AHEAD';
        skipBtn.style.cssText = `
            padding: 12px 24px;
            background: #0ff;
            border: 2px solid #0ff;
            color: #000;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
            min-width: 160px;
        `;

        skipBtn.onmouseover = () => {
            skipBtn.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.8)';
            skipBtn.style.transform = 'translateY(-2px) scale(1.05)';
        };

        skipBtn.onmouseout = () => {
            skipBtn.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
            skipBtn.style.transform = 'translateY(0) scale(1)';
        };

        skipBtn.onclick = () => {
            // Mark prompt as seen - never show again
            localStorage.setItem('skipProloguePromptSeen', 'true');
            document.body.removeChild(overlay);
            this.skipToRouteSelection();
        };

        // Assemble
        buttons.appendChild(playBtn);
        buttons.appendChild(skipBtn);
        box.appendChild(title);
        box.appendChild(message);
        box.appendChild(subMessage);
        box.appendChild(buttons);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    skipToRouteSelection() {
        console.log('⏭️ Skipping prologue, jumping to route selection');

        // Reset game state but mark prologue as skipped
        this.game.gameState = {
            flags: {},
            choices: {},
            progress: { prologueSkipped: true },
            sprites: { left: null, right: null }
        };

        // Clear sprites
        this.game.clearAllSprites();

        // Initialize game view and dialogue box (needed for routes to work)
        this.game.gameView.style.display = 'flex';
        this.game.dialogueBox.style.display = 'block';

        // Fade out main menu
        this.game.mainMenu.style.opacity = '0';

        setTimeout(() => {
            this.game.mainMenu.style.display = 'none';

            // Show route selection directly
            const routeSelect = document.getElementById('route-select');
            routeSelect.style.display = 'block';

            // Fade in
            setTimeout(() => {
                routeSelect.style.opacity = '1';

                // Initialize route selector (UV7 glow-up)
                this.game.initRouteSelector();

                // Start tip rotation
                this.game.startRouteSelectTipRotation();
            }, 100);
        }, 800);
    }

    unlockSkipPrologue() {
        this.game.skipPrologueUnlocked = true;
        localStorage.setItem('skipPrologueUnlocked', 'true');
        console.log('💚 Skip Prologue unlocked! Use "START STORY" to see the prompt.');
        return '✅ Skip Prologue unlocked! Available on next START STORY.';
    }
}
