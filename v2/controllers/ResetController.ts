// ========================================
// RESET CONTROLLER
// Session 121: Extracted from GameEngine
// ========================================
//
// RESPONSIBILITIES:
// - Nuclear reset confirmation modal
// - Complete localStorage wipe
// - Factory reset functionality
// - Immersive warning UI with dramatic styling
//
// ARCHITECTURE:
// - Single Responsibility: Reset/cleanup operations
// - Heavy DOM manipulation (inline modal creation)
// - Called by: GameEngine, dev commands, secret codes
//
// "Built with love. Nuclear option available." 💚🔥💀
// ========================================

import { Logger } from '@utils/Logger';

/**
 * ResetController
 *
 * Handles complete game reset with dramatic confirmation modal.
 * Nuclear option for when the player wants to start completely fresh.
 */
export class ResetController {
    constructor() {
        Logger.system('💥 ResetController initialized');
    }

    // ========================================
    // NUCLEAR RESET - COMPLETE WIPE
    // ========================================

    /**
     * Nuclear reset - Complete progress wipe with confirmation modal
     * DEV COMMAND: game.nuclearReset()
     * SECRET CODE: NUKE
     *
     * Clears ALL localStorage:
     * - All unlocks (INSANE, skip prologue, notes system)
     * - All collected notes
     * - All secret codes discovered
     * - All settings (difficulty, auto-advance, etc.)
     * - Save files
     * - Everything back to factory fresh
     */
    public nuclearReset(): boolean {
        // DEV COMMAND: Complete reset - clears ALL progress, unlocks, settings
        // Usage in console: game.nuclearReset()
        // Also available as secret code: NUKE

        // Create immersive warning overlay
        const overlay = document.createElement('div');
        overlay.className = 'nuclear-reset-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.98);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.3s ease-out;
        `;

        // Create content box
        const box = document.createElement('div');
        box.className = 'nuclear-reset-box';
        box.style.cssText = `
            background: linear-gradient(135deg, #2e1a1a 0%, #3e1616 100%);
            border: 3px solid #ff0000;
            border-radius: 10px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 0 50px rgba(255, 0, 0, 0.5);
            animation: slideIn 0.4s ease-out;
            font-family: 'Courier New', monospace;
            color: #fff;
        `;

        // Create title
        const titleEl = document.createElement('div');
        titleEl.style.cssText = `
            font-size: 28px;
            font-weight: bold;
            color: #ff0000;
            text-align: center;
            margin-bottom: 25px;
            text-transform: uppercase;
            letter-spacing: 3px;
            text-shadow: 0 0 15px rgba(255, 0, 0, 0.7);
        `;
        titleEl.textContent = '⚠️ NUCLEAR RESET ⚠️';

        // Create warning message
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            font-size: 14px;
            line-height: 1.8;
            margin-bottom: 30px;
            color: #e0e0e0;
        `;
        messageEl.innerHTML = `
            <div style="margin-bottom: 20px; color: #ff6666; font-weight: bold; text-align: center;">
                This will DELETE ALL:
            </div>
            <ul style="list-style: none; padding: 0; margin: 0 0 20px 0;">
                <li style="margin-bottom: 10px;">💥 All unlocks (INSANE, skip prologue, notes system)</li>
                <li style="margin-bottom: 10px;">💥 All collected notes</li>
                <li style="margin-bottom: 10px;">💥 All secret codes discovered</li>
                <li style="margin-bottom: 10px;">💥 All settings (difficulty, auto-advance, etc.)</li>
                <li style="margin-bottom: 10px;">💥 Save files</li>
                <li style="margin-bottom: 10px;">💥 Everything back to factory fresh</li>
            </ul>
            <div style="text-align: center; color: #ff4444; font-weight: bold; font-size: 15px; margin-top: 20px;">
                This is PERMANENT and cannot be undone.
            </div>
        `;

        // Create question
        const questionEl = document.createElement('div');
        questionEl.style.cssText = `
            font-size: 16px;
            text-align: center;
            margin-bottom: 30px;
            color: #fff;
            font-weight: bold;
        `;
        questionEl.textContent = 'Continue with nuclear reset?';

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 20px;
            justify-content: center;
        `;

        // Cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'CANCEL';
        cancelBtn.style.cssText = `
            padding: 12px 30px;
            background: transparent;
            border: 2px solid #00ff00;
            color: #00ff00;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
            min-width: 140px;
        `;

        cancelBtn.onmouseover = () => {
            cancelBtn.style.background = '#00ff00';
            cancelBtn.style.color = '#000';
            cancelBtn.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
        };

        cancelBtn.onmouseout = () => {
            cancelBtn.style.background = 'transparent';
            cancelBtn.style.color = '#00ff00';
            cancelBtn.style.boxShadow = 'none';
        };

        cancelBtn.onclick = () => {
            Logger.system('❌ Nuclear reset cancelled');
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                try {
                    overlay.remove();
                } catch {
                    // Ignore (e.g. test environment torn down)
                }
            }, 300);
        };

        // Confirm button
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'RESET ALL';
        confirmBtn.style.cssText = `
            padding: 12px 30px;
            background: #ff0000;
            border: 2px solid #ff0000;
            color: #fff;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
            min-width: 140px;
        `;

        confirmBtn.onmouseover = () => {
            confirmBtn.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.8)';
            confirmBtn.style.transform = 'scale(1.05)';
        };

        confirmBtn.onmouseout = () => {
            confirmBtn.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
            confirmBtn.style.transform = 'scale(1)';
        };

        confirmBtn.onclick = () => {
            Logger.system('💥 NUCLEAR RESET INITIATED...');

            // Remove overlay
            overlay.remove();

            // Clear ALL localStorage
            localStorage.clear();

            Logger.system('💥 All localStorage cleared');
            Logger.system('💥 Reloading page to factory state...');

            // Reload page
            setTimeout(() => {
                if (typeof window === 'undefined') return;
                try {
                    window.location.reload();
                } catch {
                    // Ignore (e.g. test environment torn down)
                }
            }, 500);
        };

        // Assemble
        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(confirmBtn);

        box.appendChild(titleEl);
        box.appendChild(messageEl);
        box.appendChild(questionEl);
        box.appendChild(buttonContainer);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        Logger.system('⚠️ Nuclear reset confirmation dialog displayed');
        return true;
    }
}
