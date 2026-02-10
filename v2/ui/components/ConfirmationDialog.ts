/**
 * ConfirmationDialog - Overlay confirmation dialog
 * V1 Parity: notification-shade-controller.js lines 1343-1418
 *
 * Modal confirmation for destructive actions (exit to menu, etc.)
 * Uses inline styles (no external CSS dependencies)
 *
 * 848 is sacred. 💚🔥💀
 */

import { Logger } from '@utils/Logger';

interface ConfirmationOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

export class ConfirmationDialog {
    private overlay: HTMLElement | null = null;

    /**
     * Show confirmation dialog
     * V1 Parity: showConfirmation() lines 1343-1418
     */
    public show(options: ConfirmationOptions): void {
        // Close any existing dialog first
        this.close();

        const {
            title,
            message,
            confirmText = 'Confirm',
            cancelText = 'Cancel',
            onConfirm,
            onCancel
        } = options;

        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'confirmation-overlay';

        // V1 Parity: Inline styles (no CSS dependencies)
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.2s ease;
        `;

        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'confirmation-dialog';
        dialog.style.cssText = `
            background: linear-gradient(145deg, rgba(26, 26, 46, 0.98), rgba(15, 15, 26, 0.98));
            border: 2px solid rgba(0, 255, 255, 0.5);
            border-radius: 16px;
            padding: 32px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
            animation: slideInUp 0.3s ease;
        `;

        dialog.innerHTML = `
            <h2 style="
                margin: 0 0 16px 0;
                font-size: 24px;
                font-weight: bold;
                color: #00ffff;
                font-family: 'Courier New', monospace;
            ">${title}</h2>
            <p style="
                margin: 0 0 24px 0;
                font-size: 16px;
                color: rgba(255, 255, 255, 0.9);
                line-height: 1.6;
                font-family: 'Courier New', monospace;
            ">${message}</p>
            <div style="
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            ">
                <button class="cancel-btn" style="
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: rgba(255, 255, 255, 0.9);
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: 'Courier New', monospace;
                ">${cancelText}</button>
                <button class="confirm-btn" style="
                    background: linear-gradient(135deg, #ff0055, #ff6600);
                    border: none;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: 'Courier New', monospace;
                ">${confirmText}</button>
            </div>
        `;

        // Add hover effects via JavaScript (since inline styles can't use :hover)
        const cancelBtn = dialog.querySelector('.cancel-btn') as HTMLElement;
        const confirmBtn = dialog.querySelector('.confirm-btn') as HTMLElement;

        if (cancelBtn) {
            cancelBtn.addEventListener('mouseenter', () => {
                cancelBtn.style.background = 'rgba(255, 255, 255, 0.2)';
                cancelBtn.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            });
            cancelBtn.addEventListener('mouseleave', () => {
                cancelBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                cancelBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            });
            cancelBtn.addEventListener('click', () => {
                this.close();
                if (onCancel) onCancel();
            });
        }

        if (confirmBtn) {
            confirmBtn.addEventListener('mouseenter', () => {
                confirmBtn.style.transform = 'scale(1.05)';
                confirmBtn.style.boxShadow = '0 4px 16px rgba(255, 0, 85, 0.4)';
            });
            confirmBtn.addEventListener('mouseleave', () => {
                confirmBtn.style.transform = 'scale(1)';
                confirmBtn.style.boxShadow = 'none';
            });
            confirmBtn.addEventListener('click', () => {
                this.close();
                onConfirm();
            });
        }

        this.overlay.appendChild(dialog);
        document.body.appendChild(this.overlay);

        // Click outside to cancel
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
                if (onCancel) onCancel();
            }
        });

        // Escape to cancel
        const escHandler = (e: KeyboardEvent): void => {
            if (e.key === 'Escape') {
                this.close();
                if (onCancel) onCancel();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // V1 Parity: Haptic feedback
        if (navigator.vibrate) navigator.vibrate(10);

        Logger.ui(`❓ Confirmation dialog: ${title}`);
    }

    /**
     * Close confirmation dialog
     */
    public close(): void {
        if (this.overlay) {
            // Fade out
            this.overlay.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => {
                this.overlay?.remove();
                this.overlay = null;
            }, 200);
        }
    }

    /**
     * Check if dialog is open
     */
    public isOpen(): boolean {
        return this.overlay !== null;
    }
}

// Add animations to document head (only once)
if (!document.querySelector('#confirmation-dialog-styles')) {
    const style = document.createElement('style');
    style.id = 'confirmation-dialog-styles';
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes slideInUp {
            from {
                transform: translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}
