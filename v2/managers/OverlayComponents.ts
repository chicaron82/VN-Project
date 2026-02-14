/**
 * OverlayComponents - Base UI primitives for the Overlay system
 * Extracted from OverlayManager.ts (786 lines → ~270 lines components)
 *
 * Stateless factory functions that build themed DOM elements:
 * - createBase()           → Full-screen backdrop
 * - createBox()            → Themed content container with glow
 * - createTitle()          → Variant-colored heading
 * - createMessage()        → Styled paragraph
 * - createButton()         → Interactive button with hover states
 * - createButtonContainer() → Flexbox button group
 *
 * V1 Parity: overlay-manager.js lines 36-234
 * 848 is sacred. 💚🔥💀
 */

import type { ThemeManager } from './ThemeManager';
import type {
    OverlayVariant,
    BaseOverlayOptions,
    BoxOptions,
    TitleOptions,
    MessageOptions,
    ButtonOptions,
    ButtonContainerOptions,
} from './OverlayTypes';

// Z-index constants (V1 uses GameConfig, we'll use defaults)
export const OVERLAY_Z_INDEX = {
    OVERLAY_BASE: 10000,
    OVERLAY_CONFIRM: 10003,
    OVERLAY_CRITICAL: 99999
} as const;

// ========================================
// VARIANT COLOR HELPERS
// ========================================

function getVariantColors(theme: ReturnType<ThemeManager['getTheme']>, variant: OverlayVariant): {
    borderColor: string;
    glowColor: string;
    bgGradient: string;
    textColor: string;
} {
    switch (variant) {
        case 'error':
            return {
                borderColor: theme.error,
                glowColor: 'rgba(255, 68, 68, 0.5)',
                bgGradient: 'linear-gradient(135deg, #2e1a1a 0%, #3e1616 100%)',
                textColor: theme.error,
            };
        case 'warning':
            return {
                borderColor: theme.warning,
                glowColor: 'rgba(255, 204, 0, 0.5)',
                bgGradient: 'linear-gradient(135deg, #2e2a1a 0%, #3e3616 100%)',
                textColor: theme.warning,
            };
        case 'success':
            return {
                borderColor: theme.success,
                glowColor: 'rgba(0, 255, 136, 0.5)',
                bgGradient: 'linear-gradient(135deg, #1a2e1a 0%, #163e16 100%)',
                textColor: theme.success,
            };
        case 'primary':
        default:
            return {
                borderColor: theme.primary,
                glowColor: theme.glow,
                bgGradient: `linear-gradient(135deg, ${theme.backgroundSolid} 0%, ${theme.background} 100%)`,
                textColor: theme.primary,
            };
    }
}

// ========================================
// BASE COMPONENT BUILDERS
// V1 Parity: lines 36-234
// ========================================

/**
 * Create base overlay container — fullscreen backdrop with fade-in animation
 */
export function createBase(options: BaseOverlayOptions = {}): HTMLElement {
    const {
        id = null,
        className = 'themed-overlay',
        zIndex = OVERLAY_Z_INDEX.OVERLAY_BASE,
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
 * Create themed content box — variant border, glow, gradient background
 */
export function createBox(themeManager: ThemeManager, options: BoxOptions = {}): HTMLElement {
    const {
        variant = 'primary',
        maxWidth = '500px',
        padding = '40px',
        className = 'themed-box'
    } = options;

    const box = document.createElement('div');
    box.className = className;

    const theme = themeManager.getTheme();
    const colors = getVariantColors(theme, variant);

    box.style.cssText = `
        background: ${colors.bgGradient};
        border: 2px solid ${colors.borderColor};
        border-radius: 10px;
        padding: ${padding};
        max-width: ${maxWidth};
        width: 90%;
        box-shadow: 0 0 30px ${colors.glowColor};
        font-family: 'Courier New', monospace;
        color: #fff;
        text-align: center;
    `;

    return box;
}

/**
 * Create themed title element — variant-colored with glow text-shadow
 */
export function createTitle(themeManager: ThemeManager, text: string, options: TitleOptions = {}): HTMLElement {
    const {
        variant = 'primary',
        emoji = '',
        fontSize = '24px',
        className = 'themed-title'
    } = options;

    const titleEl = document.createElement('div');
    titleEl.className = className;

    const theme = themeManager.getTheme();
    const colors = getVariantColors(theme, variant);

    titleEl.style.cssText = `
        font-size: ${fontSize};
        font-weight: bold;
        color: ${colors.textColor};
        text-align: center;
        margin-bottom: 25px;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 0 0 10px ${colors.textColor}80;
    `;

    titleEl.textContent = (emoji ? emoji + ' ' : '') + text;

    return titleEl;
}

/**
 * Create themed message element — pre-wrapped text with line height
 */
export function createMessage(text: string, options: MessageOptions = {}): HTMLElement {
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
 * Create themed button — variant-styled with hover effects
 */
export function createButton(themeManager: ThemeManager, text: string, onClick: (() => void) | null, options: ButtonOptions = {}): HTMLElement {
    const {
        variant = 'primary',
        width = '200px',
        className = 'themed-button'
    } = options;

    const button = document.createElement('button');
    button.className = className;
    button.textContent = text;

    const theme = themeManager.getTheme();

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

    if (onClick) {
        button.onclick = onClick;
    }

    return button;
}

/**
 * Create button container — flexbox for button layout
 */
export function createButtonContainer(buttons: HTMLElement[], options: ButtonContainerOptions = {}): HTMLElement {
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
