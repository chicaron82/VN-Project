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
}
