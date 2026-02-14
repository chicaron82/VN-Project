import type { ThemeManager } from './ThemeManager';
import type {
    BaseOverlayOptions,
    BoxOptions,
    TitleOptions,
    MessageOptions,
    ButtonOptions,
    ButtonContainerOptions,
    ErrorOptions,
    WarningOptions,
    ConfirmOptions,
    InfoOptions,
    CustomOptions,
    ProgressOptions,
    ProgressResult,
} from './OverlayTypes';
import {
    OVERLAY_Z_INDEX,
    createBase as _createBase,
    createBox as _createBox,
    createTitle as _createTitle,
    createMessage as _createMessage,
    createButton as _createButton,
    createButtonContainer as _createButtonContainer,
} from './OverlayComponents';

// Re-export types for consumers
export type { OverlayVariant, ButtonVariant } from './OverlayTypes';

/**
 * OverlayManager - Themed Overlay Factory
 * V1 Parity Port from overlay-manager.js (776 lines)
 *
 * Created: Session 118 (Theme Integration Sprint)
 * Decomposed: Weekend refactor — types → OverlayTypes.ts, components → OverlayComponents.ts
 *
 * Purpose:
 * - Create themed overlays that automatically adapt to active theme
 * - Centralize overlay styling to eliminate hardcoded colors
 * - Provide factory methods for common overlay patterns
 * - Integration with ThemeManager for dynamic color switching
 *
 * 848 is sacred. 💚🔥💀
 */
export class OverlayManager {
    private themeManager: ThemeManager;

    constructor(themeManager: ThemeManager) {
        this.themeManager = themeManager;
    }

    // ========================================
    // BASE COMPONENTS (delegated to OverlayComponents.ts)
    // V1 Parity: lines 36-234
    // ========================================

    public createBase(options: BaseOverlayOptions = {}): HTMLElement {
        return _createBase(options);
    }

    public createBox(options: BoxOptions = {}): HTMLElement {
        return _createBox(this.themeManager, options);
    }

    public createTitle(text: string, options: TitleOptions = {}): HTMLElement {
        return _createTitle(this.themeManager, text, options);
    }

    public createMessage(text: string, options: MessageOptions = {}): HTMLElement {
        return _createMessage(text, options);
    }

    public createButton(text: string, onClick: (() => void) | null, options: ButtonOptions = {}): HTMLElement {
        return _createButton(this.themeManager, text, onClick, options);
    }

    public createButtonContainer(buttons: HTMLElement[], options: ButtonContainerOptions = {}): HTMLElement {
        return _createButtonContainer(buttons, options);
    }

    // ========================================
    // FACTORY METHODS - Common Overlay Types
    // V1 Parity: lines 347-547
    // ========================================

    /**
     * Create error overlay — red-themed with ⚠️ emoji
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
            zIndex: OVERLAY_Z_INDEX.OVERLAY_CRITICAL
        });

        const box = this.createBox({ variant: 'error' });
        const titleEl = this.createTitle(title, { variant: 'error', emoji: '⚠️' });
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
     * Create warning overlay — warning-themed with fade-out animation
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
            zIndex: OVERLAY_Z_INDEX.OVERLAY_BASE
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
     * Create confirmation dialog — two-button confirm/cancel pattern
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
            zIndex: OVERLAY_Z_INDEX.OVERLAY_CONFIRM
        });

        const box = this.createBox({ variant: 'primary' });
        const titleEl = this.createTitle(title, { variant: 'primary' });
        const messageEl = this.createMessage(message);

        const buttons: HTMLElement[] = [];

        const confirmBtn = this.createButton(confirmText, () => {
            overlay.remove();
            if (onConfirm) onConfirm();
        }, { variant: 'primary', width: 'auto' });
        confirmBtn.style.padding = '12px 30px';
        buttons.push(confirmBtn);

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
     * Create info overlay — general purpose with opacity fade-out
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
            zIndex: OVERLAY_Z_INDEX.OVERLAY_BASE
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
     * Create custom overlay with full control — returns overlay and box for custom content
     */
    public createCustom(options: CustomOptions = {}): { overlay: HTMLElement; box: HTMLElement } {
        const {
            variant = 'primary',
            id = null,
            zIndex = OVERLAY_Z_INDEX.OVERLAY_BASE,
            maxWidth = '500px',
            padding = '40px'
        } = options;

        const overlay = this.createBase({ id, zIndex });
        const box = this.createBox({ variant, maxWidth, padding });
        overlay.appendChild(box);

        return { overlay, box };
    }

    // ========================================
    // PROGRESS OVERLAY
    // V1 Parity: lines 590-691
    // ========================================

    /**
     * Create themed progress bar overlay (DOM only, not animated)
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

        const close = (): void => {
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

    /** Append overlay to document body */
    public show(overlay: HTMLElement): void {
        document.body.appendChild(overlay);
    }

    /** Remove overlay from DOM — supports fade-out animation */
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

    /** Check if overlay is currently visible */
    public isVisible(id: string): boolean {
        return document.getElementById(id) !== null;
    }
}

// Inject keyframe animations (only once)
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
