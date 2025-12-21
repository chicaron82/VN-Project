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
}
