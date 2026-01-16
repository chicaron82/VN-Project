import { ThemeManager } from './ThemeManager';

/**
 * OverlayManager - Themed Overlay Factory
 * V1 Parity Port from overlay-manager.js (776 lines)
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
 * - createError() - Red error overlays ⚠️
 * - createWarning() - Themed warning dialogs
 * - createConfirm() - Confirmation dialogs with callbacks
 * - createInfo() - General information overlays
 * - createCustom() - Flexible custom overlays
 * - createProgress() - Progress bar overlays
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
 * 848 is sacred. 💚🔥💀
 */

// ========================================
// TYPES & INTERFACES
// V1 Parity: overlay-manager.js lines 36-83
// ========================================

export type OverlayVariant = 'primary' | 'error' | 'warning' | 'success';
export type ButtonVariant = 'primary' | 'error' | 'warning' | 'success' | 'cancel';

interface BaseOverlayOptions {
    id?: string | null;
    className?: string;
    zIndex?: number;
    fadeIn?: boolean;
    onClick?: ((e: Event) => void) | null;
}

interface BoxOptions {
    variant?: OverlayVariant;
    maxWidth?: string;
    padding?: string;
    className?: string;
}

interface TitleOptions {
    variant?: OverlayVariant;
    emoji?: string;
    fontSize?: string;
    className?: string;
}

interface MessageOptions {
    fontSize?: string;
    lineHeight?: string;
    marginBottom?: string;
    className?: string;
    preWrap?: boolean;
}

interface ButtonOptions {
    variant?: ButtonVariant;
    width?: string;
    className?: string;
}

interface ButtonContainerOptions {
    gap?: string;
    justifyContent?: string;
    className?: string;
}

interface ErrorOptions {
    buttonText?: string;
    onClose?: (() => void) | null;
    id?: string | null;
}

interface WarningOptions {
    buttonText?: string;
    onClose?: (() => void) | null;
    id?: string | null;
}

interface ConfirmOptions {
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onCancel?: (() => void) | null;
    id?: string | null;
}

interface InfoOptions {
    buttonText?: string;
    onClose?: (() => void) | null;
    variant?: OverlayVariant;
    emoji?: string;
    id?: string | null;
}

interface CustomOptions {
    variant?: OverlayVariant;
    id?: string | null;
    zIndex?: number;
    maxWidth?: string;
    padding?: string;
}

interface ProgressOptions {
    subtitle?: string;
    variant?: OverlayVariant;
    showSkip?: boolean;
    maxWidth?: string;
}

interface ProgressResult {
    overlay: HTMLElement;
    box: HTMLElement;
    bar: HTMLElement;
    status: HTMLElement;
    skip: HTMLElement | null;
    close: () => void;
    setProgress: (percent: number) => void;
    setStatus: (text: string) => void;
}

// ========================================
// OVERLAY MANAGER CLASS
// V1 Parity: overlay-manager.js lines 35-767
// ========================================

export class OverlayManager {
    private themeManager: ThemeManager;

    // Z-index constants (V1 uses GameConfig, we'll use defaults)
    private static readonly Z_INDEX = {
        OVERLAY_BASE: 10000,
        OVERLAY_CONFIRM: 10003,
        OVERLAY_CRITICAL: 99999
    };

    constructor(themeManager: ThemeManager) {
        this.themeManager = themeManager;
    }

    // ========================================
    // BASE COMPONENTS
    // V1 Parity: lines 36-234
    // ========================================

    /**
     * Create base overlay container
     * V1 Parity: Fullscreen backdrop with fade-in animation
     */
    public createBase(options: BaseOverlayOptions = {}): HTMLElement {
        const {
            id = null,
            className = 'themed-overlay',
            zIndex = OverlayManager.Z_INDEX.OVERLAY_BASE,
            fadeIn = true,
            onClick = null
        } = options;

        const overlay = document.createElement('div');
        if (id) overlay.id = id;
        overlay.className = className;

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
     * V1 Parity: Themed border, glow, and gradient background
     */
    public createBox(options: BoxOptions = {}): HTMLElement {
        const {
            variant = 'primary',
            maxWidth = '500px',
            padding = '40px',
            className = 'themed-box'
        } = options;

        const box = document.createElement('div');
        box.className = className;

        const theme = this.themeManager.getTheme();

        // Get colors based on variant
        let borderColor: string, glowColor: string, bgGradient: string;

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
     * V1 Parity: Variant-colored title with glow effect
     */
    public createTitle(text: string, options: TitleOptions = {}): HTMLElement {
        const {
            variant = 'primary',
            emoji = '',
            fontSize = '24px',
            className = 'themed-title'
        } = options;

        const titleEl = document.createElement('div');
        titleEl.className = className;

        const theme = this.themeManager.getTheme();

        let color: string;
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
     * V1 Parity: Pre-wrapped text with line height
     */
    public createMessage(text: string, options: MessageOptions = {}): HTMLElement {
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
     * V1 Parity: Variant-styled button with hover effects
     */
    public createButton(text: string, onClick: (() => void) | null, options: ButtonOptions = {}): HTMLElement {
        const {
            variant = 'primary',
            width = '200px',
            className = 'themed-button'
        } = options;

        const button = document.createElement('button');
        button.className = className;
        button.textContent = text;

        const theme = this.themeManager.getTheme();

        let color: string, hoverBg: string;
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
        if (onClick) {
            button.onclick = onClick;
        }

        return button;
    }

    /**
     * Create button container for multiple buttons
     * V1 Parity: Flexbox container for button layout
     */
    public createButtonContainer(buttons: HTMLElement[], options: ButtonContainerOptions = {}): HTMLElement {
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
    // V1 Parity: lines 347-547
    // ========================================

    /**
     * Create error overlay
     * V1 Parity: Red-themed error with ⚠️ emoji
     */
    public createError(title: string, message: string, options: ErrorOptions = {}): HTMLElement {
        const {
            buttonText = 'CONTINUE',
            onClose = null,
            id = null
        } = options;

        const overlay = this.createBase({
            id,
            className: 'error-overlay',
            zIndex: OverlayManager.Z_INDEX.OVERLAY_CRITICAL
        });

        const box = this.createBox({ variant: 'error' });
        const titleEl = this.createTitle(title, {
            variant: 'error',
            emoji: '⚠️'
        });
        const messageEl = this.createMessage(message);
        const closeBtn = this.createButton(buttonText, () => {
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
     * V1 Parity: Warning-themed with fade-out animation
     */
    public createWarning(title: string, message: string, options: WarningOptions = {}): HTMLElement {
        const {
            buttonText = 'UNDERSTOOD',
            onClose = null,
            id = null
        } = options;

        const overlay = this.createBase({
            id,
            className: 'warning-overlay',
            zIndex: OverlayManager.Z_INDEX.OVERLAY_BASE
        });

        const box = this.createBox({ variant: 'warning' });
        const titleEl = this.createTitle(title, { variant: 'warning' });
        const messageEl = this.createMessage(message);
        const closeBtn = this.createButton(buttonText, () => {
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
     * V1 Parity: Two-button confirm/cancel pattern
     */
    public createConfirm(title: string, message: string, onConfirm: () => void, options: ConfirmOptions = {}): HTMLElement {
        const {
            confirmText = 'CONFIRM',
            cancelText = 'CANCEL',
            showCancel = true,
            onCancel = null,
            id = null
        } = options;

        const overlay = this.createBase({
            id,
            className: 'confirm-overlay',
            zIndex: OverlayManager.Z_INDEX.OVERLAY_CONFIRM
        });

        const box = this.createBox({ variant: 'primary' });
        const titleEl = this.createTitle(title, { variant: 'primary' });
        const messageEl = this.createMessage(message);

        const buttons: HTMLElement[] = [];

        // Confirm button
        const confirmBtn = this.createButton(confirmText, () => {
            overlay.remove();
            if (onConfirm) onConfirm();
        }, { variant: 'primary', width: 'auto' });
        confirmBtn.style.padding = '12px 30px';
        buttons.push(confirmBtn);

        // Cancel button (optional)
        if (showCancel) {
            const cancelBtn = this.createButton(cancelText, () => {
                overlay.remove();
                if (onCancel) onCancel();
            }, { variant: 'cancel', width: 'auto' });
            cancelBtn.style.padding = '12px 30px';
            buttons.push(cancelBtn);
        }

        const buttonContainer = this.createButtonContainer(buttons);

        box.appendChild(titleEl);
        box.appendChild(messageEl);
        box.appendChild(buttonContainer);
        overlay.appendChild(box);

        return overlay;
    }

    /**
     * Create info overlay
     * V1 Parity: General purpose info with opacity fade-out
     */
    public createInfo(title: string, message: string, options: InfoOptions = {}): HTMLElement {
        const {
            buttonText = 'CLOSE',
            onClose = null,
            variant = 'primary',
            emoji = '',
            id = null
        } = options;

        const overlay = this.createBase({
            id,
            className: 'info-overlay',
            zIndex: OverlayManager.Z_INDEX.OVERLAY_BASE
        });

        const box = this.createBox({ variant });
        const titleEl = this.createTitle(title, { variant, emoji });
        const messageEl = this.createMessage(message);
        const closeBtn = this.createButton(buttonText, () => {
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
     * V1 Parity: Returns overlay and box for custom content
     */
    public createCustom(options: CustomOptions = {}): { overlay: HTMLElement; box: HTMLElement } {
        const {
            variant = 'primary',
            id = null,
            zIndex = OverlayManager.Z_INDEX.OVERLAY_BASE,
            maxWidth = '500px',
            padding = '40px'
        } = options;

        const overlay = this.createBase({ id, zIndex });
        const box = this.createBox({ variant, maxWidth, padding });

        overlay.appendChild(box);

        return { overlay, box };
    }

    // ========================================
    // PROGRESS OVERLAY METHODS
    // V1 Parity: lines 590-691
    // ========================================

    /**
     * Create a themed progress bar overlay (DOM only, not animated)
     * V1 Parity: Progress bar with status text and optional skip button
     */
    public createProgress(title: string, options: ProgressOptions = {}): ProgressResult {
        const {
            subtitle = 'Please wait...',
            variant = 'primary',
            showSkip = true,
            maxWidth = '500px'
        } = options;

        const { overlay, box } = this.createCustom({
            variant,
            maxWidth,
            padding: '30px'
        });

        const theme = this.themeManager.getTheme();

        // Title
        const titleEl = this.createTitle(title, { variant, fontSize: '20px' });
        titleEl.style.marginBottom = '10px';
        box.appendChild(titleEl);

        // Subtitle
        const subtitleEl = document.createElement('div');
        subtitleEl.style.cssText = 'font-size: 14px; color: #aaa; margin-bottom: 20px;';
        subtitleEl.textContent = subtitle;
        box.appendChild(subtitleEl);

        // Progress bar container
        const barWrap = document.createElement('div');
        barWrap.style.cssText = `
            height: 10px;
            background: rgba(255,255,255,0.1);
            border-radius: 5px;
            overflow: hidden;
            margin-bottom: 15px;
        `;

        // Progress bar fill
        const barFill = document.createElement('div');
        barFill.className = 'progress-bar-fill';
        barFill.style.cssText = `
            height: 100%;
            width: 0%;
            background: ${theme.primary};
            border-radius: 5px;
            transition: width 0.1s linear;
        `;
        barWrap.appendChild(barFill);
        box.appendChild(barWrap);

        // Status text
        const statusEl = document.createElement('div');
        statusEl.className = 'progress-status';
        statusEl.style.cssText = 'font-size: 13px; color: #ccc; margin-bottom: 15px;';
        statusEl.textContent = 'Starting...';
        box.appendChild(statusEl);

        // Skip button (optional)
        let skipBtn: HTMLElement | null = null;
        if (showSkip) {
            skipBtn = this.createButton('Skip ▶', null, { variant, width: '120px' });
            skipBtn.style.fontSize = '12px';
            skipBtn.style.padding = '8px 16px';
            box.appendChild(skipBtn);
        }

        // Close function
        const close = () => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        };

        return {
            overlay,
            box,
            bar: barFill,
            status: statusEl,
            skip: skipBtn,
            close,
            setProgress: (percent: number) => {
                barFill.style.width = `${percent}%`;
            },
            setStatus: (text: string) => {
                statusEl.textContent = text;
            }
        };
    }

    // ========================================
    // UTILITY METHODS
    // V1 Parity: lines 549-588
    // ========================================

    /**
     * Append overlay to document body
     */
    public show(overlay: HTMLElement): void {
        document.body.appendChild(overlay);
    }

    /**
     * Remove overlay from DOM
     * V1 Parity: Supports fade-out animation
     */
    public hide(overlayOrId: HTMLElement | string, fade: boolean = false): void {
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
     */
    public isVisible(id: string): boolean {
        return document.getElementById(id) !== null;
    }
}

// Add animations to document head (only once)
if (typeof document !== 'undefined' && !document.querySelector('#overlay-manager-styles')) {
    const style = document.createElement('style');
    style.id = 'overlay-manager-styles';
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}
