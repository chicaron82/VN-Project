// ========================================
// OVERLAY MANAGER - Version 848
// Centralized themed overlay creation system
// ========================================

/**
 * OverlayManager - Themed Overlay Factory
 *
 * Created: Session 118 (Theme Integration Sprint)
 *
 * Purpose:
 * - Create themed overlays that automatically adapt to active theme
 * - Centralize overlay styling to eliminate hardcoded colors
 * - Provide factory methods for common overlay patterns
 * - Integration with ThemeManager for dynamic color switching
 *
 * Factory Methods:
 * - createError() - Red error overlays
 * - createWarning() - Themed warning dialogs
 * - createConfirm() - Confirmation dialogs with callbacks
 * - createInfo() - General information overlays
 * - createCustom() - Flexible custom overlays
 *
 * Button Factory:
 * - createButton() - Themed buttons with hover states
 *
 * All overlays automatically use:
 * - ThemeManager.getColor() for dynamic theming
 * - Proper z-index layering
 * - Fade in/out animations
 * - Mobile-responsive sizing
 *
 * @class OverlayManager
 */
class OverlayManager {
    /**
     * Create base overlay container
     * @param {Object} options - Configuration options
     * @returns {HTMLElement} Overlay container
     */
    static createBase(options = {}) {
        const {
            id = null,
            className = 'themed-overlay',
            zIndex = 10000,
            fadeIn = true,
            onClick = null
        } = options;

        const overlay = document.createElement('div');
        if (id) overlay.id = id;
        overlay.className = className;

        const theme = ThemeManager.getTheme();

        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: ${zIndex};
            display: flex;
            align-items: center;
            justify-content: center;
            ${fadeIn ? 'animation: fadeIn 0.3s ease-out;' : ''}
        `;

        if (onClick) {
            overlay.addEventListener('click', onClick);
        }

        return overlay;
    }

    /**
     * Create themed content box
     * @param {Object} options - Configuration options
     * @returns {HTMLElement} Content box
     */
    static createBox(options = {}) {
        const {
            variant = 'primary', // 'primary', 'error', 'warning', 'success'
            maxWidth = '500px',
            padding = '40px',
            className = 'themed-box'
        } = options;

        const box = document.createElement('div');
        box.className = className;

        const theme = ThemeManager.getTheme();

        // Get colors based on variant
        let borderColor, glowColor, bgGradient;

        switch (variant) {
            case 'error':
                borderColor = theme.error;
                glowColor = `rgba(255, 68, 68, 0.5)`;
                bgGradient = 'linear-gradient(135deg, #2e1a1a 0%, #3e1616 100%)';
                break;
            case 'warning':
                borderColor = theme.warning;
                glowColor = `rgba(255, 204, 0, 0.5)`;
                bgGradient = 'linear-gradient(135deg, #2e2a1a 0%, #3e3616 100%)';
                break;
            case 'success':
                borderColor = theme.success;
                glowColor = `rgba(0, 255, 136, 0.5)`;
                bgGradient = 'linear-gradient(135deg, #1a2e1a 0%, #163e16 100%)';
                break;
            case 'primary':
            default:
                borderColor = theme.primary;
                glowColor = theme.glow;
                bgGradient = `linear-gradient(135deg, ${theme.backgroundSolid} 0%, ${theme.background} 100%)`;
                break;
        }

        box.style.cssText = `
            background: ${bgGradient};
            border: 2px solid ${borderColor};
            border-radius: 10px;
            padding: ${padding};
            max-width: ${maxWidth};
            width: 90%;
            box-shadow: 0 0 30px ${glowColor};
            font-family: 'Courier New', monospace;
            color: #fff;
            text-align: center;
        `;

        return box;
    }

    /**
     * Create themed title element
     * @param {string} text - Title text
     * @param {Object} options - Configuration options
     * @returns {HTMLElement} Title element
     */
    static createTitle(text, options = {}) {
        const {
            variant = 'primary',
            emoji = '',
            fontSize = '24px',
            className = 'themed-title'
        } = options;

        const titleEl = document.createElement('div');
        titleEl.className = className;

        const theme = ThemeManager.getTheme();

        let color;
        switch (variant) {
            case 'error':
                color = theme.error;
                break;
            case 'warning':
                color = theme.warning;
                break;
            case 'success':
                color = theme.success;
                break;
            case 'primary':
            default:
                color = theme.primary;
                break;
        }

        titleEl.style.cssText = `
            font-size: ${fontSize};
            font-weight: bold;
            color: ${color};
            text-align: center;
            margin-bottom: 25px;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 0 0 10px ${color}80;
        `;

        titleEl.textContent = (emoji ? emoji + ' ' : '') + text;

        return titleEl;
    }

    /**
     * Create themed message element
     * @param {string} text - Message text
     * @param {Object} options - Configuration options
     * @returns {HTMLElement} Message element
     */
    static createMessage(text, options = {}) {
        const {
            fontSize = '15px',
            lineHeight = '1.6',
            marginBottom = '30px',
            className = 'themed-message',
            preWrap = true
        } = options;

        const messageEl = document.createElement('div');
        messageEl.className = className;

        messageEl.style.cssText = `
            font-size: ${fontSize};
            line-height: ${lineHeight};
            margin-bottom: ${marginBottom};
            ${preWrap ? 'white-space: pre-wrap;' : ''}
            color: #e0e0e0;
            text-align: center;
        `;

        messageEl.textContent = text;

        return messageEl;
    }

    /**
     * Create themed button
     * @param {string} text - Button text
     * @param {Function} onClick - Click handler
     * @param {Object} options - Configuration options
     * @returns {HTMLElement} Button element
     */
    static createButton(text, onClick, options = {}) {
        const {
            variant = 'primary', // 'primary', 'error', 'warning', 'success', 'cancel'
            width = '200px',
            className = 'themed-button'
        } = options;

        const button = document.createElement('button');
        button.className = className;
        button.textContent = text;

        const theme = ThemeManager.getTheme();

        let color, hoverBg;
        switch (variant) {
            case 'error':
                color = theme.error;
                hoverBg = theme.error;
                break;
            case 'warning':
                color = theme.warning;
                hoverBg = theme.warning;
                break;
            case 'success':
                color = theme.success;
                hoverBg = theme.success;
                break;
            case 'cancel':
                color = '#f55';
                hoverBg = '#f55';
                break;
            case 'primary':
            default:
                color = theme.primary;
                hoverBg = theme.primary;
                break;
        }

        button.style.cssText = `
            display: block;
            width: ${width};
            margin: 0 auto;
            padding: 12px 25px;
            background: transparent;
            border: 2px solid ${color};
            color: ${color};
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
        `;

        // Hover effects
        button.onmouseover = () => {
            button.style.background = hoverBg;
            button.style.color = '#000';
            button.style.boxShadow = `0 0 20px ${color}80`;
        };

        button.onmouseout = () => {
            button.style.background = 'transparent';
            button.style.color = color;
            button.style.boxShadow = 'none';
        };

        // Click handler
        button.onclick = onClick;

        return button;
    }

    /**
     * Create button container for multiple buttons
     * @param {Array} buttons - Array of button elements
     * @param {Object} options - Configuration options
     * @returns {HTMLElement} Button container
     */
    static createButtonContainer(buttons, options = {}) {
        const {
            gap = '15px',
            justifyContent = 'center',
            className = 'themed-button-container'
        } = options;

        const container = document.createElement('div');
        container.className = className;

        container.style.cssText = `
            display: flex;
            gap: ${gap};
            justify-content: ${justifyContent};
        `;

        buttons.forEach(btn => container.appendChild(btn));

        return container;
    }

    // ========================================
    // FACTORY METHODS - Common Overlay Types
    // ========================================

    /**
     * Create error overlay
     * @param {string} title - Error title
     * @param {string} message - Error message
     * @param {Object} options - Configuration options
     * @returns {HTMLElement} Error overlay
     */
    static createError(title, message, options = {}) {
        const {
            buttonText = 'CONTINUE',
            onClose = null,
            id = null
        } = options;

        const overlay = OverlayManager.createBase({
            id,
            className: 'error-overlay',
            zIndex: 99999
        });

        const box = OverlayManager.createBox({ variant: 'error' });
        const titleEl = OverlayManager.createTitle(title, {
            variant: 'error',
            emoji: '⚠️'
        });
        const messageEl = OverlayManager.createMessage(message);
        const closeBtn = OverlayManager.createButton(buttonText, () => {
            overlay.remove();
            if (onClose) onClose();
        }, { variant: 'error' });

        box.appendChild(titleEl);
        box.appendChild(messageEl);
        box.appendChild(closeBtn);
        overlay.appendChild(box);

        return overlay;
    }

    /**
     * Create warning overlay
     * @param {string} title - Warning title
     * @param {string} message - Warning message
     * @param {Object} options - Configuration options
     * @returns {HTMLElement} Warning overlay
     */
    static createWarning(title, message, options = {}) {
        const {
            buttonText = 'UNDERSTOOD',
            onClose = null,
            id = null
        } = options;

        const overlay = OverlayManager.createBase({
            id,
            className: 'warning-overlay',
            zIndex: 10000
        });

        const box = OverlayManager.createBox({ variant: 'warning' });
        const titleEl = OverlayManager.createTitle(title, { variant: 'warning' });
        const messageEl = OverlayManager.createMessage(message);
        const closeBtn = OverlayManager.createButton(buttonText, () => {
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                overlay.remove();
                if (onClose) onClose();
            }, 300);
        }, { variant: 'warning' });

        box.appendChild(titleEl);
        box.appendChild(messageEl);
        box.appendChild(closeBtn);
        overlay.appendChild(box);

        return overlay;
    }

    /**
     * Create confirmation dialog
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {Function} onConfirm - Callback when confirmed
     * @param {Object} options - Configuration options
     * @returns {HTMLElement} Confirmation overlay
     */
    static createConfirm(title, message, onConfirm, options = {}) {
        const {
            confirmText = 'CONFIRM',
            cancelText = 'CANCEL',
            showCancel = true,
            onCancel = null,
            id = null
        } = options;

        const overlay = OverlayManager.createBase({
            id,
            className: 'confirm-overlay',
            zIndex: 10003
        });

        const box = OverlayManager.createBox({ variant: 'primary' });
        const titleEl = OverlayManager.createTitle(title, { variant: 'primary' });
        const messageEl = OverlayManager.createMessage(message);

        const buttons = [];

        // Confirm button
        const confirmBtn = OverlayManager.createButton(confirmText, () => {
            overlay.remove();
            if (onConfirm) onConfirm();
        }, { variant: 'primary', width: 'auto' });
        confirmBtn.style.padding = '12px 30px';
        buttons.push(confirmBtn);

        // Cancel button (optional)
        if (showCancel) {
            const cancelBtn = OverlayManager.createButton(cancelText, () => {
                overlay.remove();
                if (onCancel) onCancel();
            }, { variant: 'cancel', width: 'auto' });
            cancelBtn.style.padding = '12px 30px';
            buttons.push(cancelBtn);
        }

        const buttonContainer = OverlayManager.createButtonContainer(buttons);

        box.appendChild(titleEl);
        box.appendChild(messageEl);
        box.appendChild(buttonContainer);
        overlay.appendChild(box);

        return overlay;
    }

    /**
     * Create info overlay
     * @param {string} title - Info title
     * @param {string} message - Info message
     * @param {Object} options - Configuration options
     * @returns {HTMLElement} Info overlay
     */
    static createInfo(title, message, options = {}) {
        const {
            buttonText = 'CLOSE',
            onClose = null,
            variant = 'primary',
            emoji = '',
            id = null
        } = options;

        const overlay = OverlayManager.createBase({
            id,
            className: 'info-overlay',
            zIndex: 10000
        });

        const box = OverlayManager.createBox({ variant });
        const titleEl = OverlayManager.createTitle(title, { variant, emoji });
        const messageEl = OverlayManager.createMessage(message);
        const closeBtn = OverlayManager.createButton(buttonText, () => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
                if (onClose) onClose();
            }, 300);
        }, { variant });

        box.appendChild(titleEl);
        box.appendChild(messageEl);
        box.appendChild(closeBtn);
        overlay.appendChild(box);

        return overlay;
    }

    /**
     * Create custom overlay with full control
     * @param {Object} options - Configuration options
     * @returns {Object} Overlay components { overlay, box }
     */
    static createCustom(options = {}) {
        const {
            variant = 'primary',
            id = null,
            zIndex = 10000,
            maxWidth = '500px',
            padding = '40px'
        } = options;

        const overlay = OverlayManager.createBase({ id, zIndex });
        const box = OverlayManager.createBox({ variant, maxWidth, padding });

        overlay.appendChild(box);

        return { overlay, box };
    }

    // ========================================
    // UTILITY METHODS
    // ========================================

    /**
     * Append overlay to document body
     * @param {HTMLElement} overlay - Overlay element
     */
    static show(overlay) {
        document.body.appendChild(overlay);
    }

    /**
     * Remove overlay from DOM
     * @param {HTMLElement|string} overlayOrId - Overlay element or ID
     * @param {boolean} fade - Whether to fade out (default: false)
     */
    static hide(overlayOrId, fade = false) {
        const overlay = typeof overlayOrId === 'string'
            ? document.getElementById(overlayOrId)
            : overlayOrId;

        if (!overlay) return;

        if (fade) {
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => overlay.remove(), 300);
        } else {
            overlay.remove();
        }
    }

    /**
     * Check if overlay is currently visible
     * @param {string} id - Overlay ID
     * @returns {boolean}
     */
    static isVisible(id) {
        return document.getElementById(id) !== null;
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OverlayManager;
}
