/**
 * NOTIFICATION STYLES - SHARED UTILITIES
 *
 * Inline style generators and animation definitions for notifications.
 * Each system (toast, rail, shade) has unique layouts but shares colors/effects.
 *
 * "Same palette, different canvases." - The Stylist
 */

import type { NotificationPriority } from './NotificationCore';
import { PRIORITY_COLORS } from './NotificationCore';

// =============================================================================
// STYLE GENERATORS
// =============================================================================

/**
 * Generate border style for notification based on priority
 */
export function getBorderStyle(priority: NotificationPriority): string {
    const colors = PRIORITY_COLORS[priority];
    return `2px solid ${colors.border}`;
}

/**
 * Generate box-shadow (glow) style based on priority
 */
export function getGlowStyle(priority: NotificationPriority, intensity: number = 1): string {
    const colors = PRIORITY_COLORS[priority];
    return `0 0 ${15 * intensity}px ${colors.glow}, 0 0 ${30 * intensity}px ${colors.glow}`;
}

/**
 * Generate background style with glassmorphic effect
 */
export function getBackgroundStyle(priority: NotificationPriority, opacity: number = 0.1): string {
    const colors = PRIORITY_COLORS[priority];
    return `linear-gradient(135deg, ${colors.bg}, rgba(0, 0, 0, ${opacity}))`;
}

/**
 * Generate text color style based on priority
 */
export function getTextColorStyle(priority: NotificationPriority): string {
    const colors = PRIORITY_COLORS[priority];
    return colors.text;
}

// =============================================================================
// ANIMATION DEFINITIONS
// =============================================================================

/**
 * Pulse animation keyframes (for urgent notifications)
 */
export const PULSE_ANIMATION = `
@keyframes notification-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.02); opacity: 0.95; }
}
`;

/**
 * Slide-in animation keyframes (for toasts)
 */
export const SLIDE_IN_ANIMATION = `
@keyframes notification-slide-in {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
`;

/**
 * Fade-in animation keyframes (for rail)
 */
export const FADE_IN_ANIMATION = `
@keyframes notification-fade-in {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
`;

/**
 * Shine animation keyframes (for achievements)
 */
export const SHINE_ANIMATION = `
@keyframes notification-shine {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
}
`;

// =============================================================================
// COMPLETE ANIMATION CSS
// =============================================================================

/**
 * Get all animation CSS as a single string (for injection)
 */
export function getAllAnimationsCSS(): string {
    return [
        PULSE_ANIMATION,
        SLIDE_IN_ANIMATION,
        FADE_IN_ANIMATION,
        SHINE_ANIMATION
    ].join('\n');
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Inject animation styles into document (call once per page)
 */
export function injectAnimationStyles(): void {
    const styleId = 'notification-animations';

    // Don't inject twice
    if (document.getElementById(styleId)) {
        return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = getAllAnimationsCSS();
    document.head.appendChild(style);
}

/**
 * Get CSS class for animation type
 */
export function getAnimationClass(type: 'pulse' | 'slide' | 'fade' | 'shine'): string {
    const animations = {
        pulse: 'notification-pulse 1s ease-in-out infinite',
        slide: 'notification-slide-in 0.3s ease-out',
        fade: 'notification-fade-in 0.2s ease-out',
        shine: 'notification-shine 2s linear infinite'
    };

    return animations[type];
}

/**
 * Generate complete inline style object for notification container
 */
export interface NotificationStyleOptions {
    priority: NotificationPriority;
    pulse?: boolean;
    blur?: number;          // Backdrop blur amount (px)
    padding?: string;
    borderRadius?: string;
    zIndex?: number;
}

export function generateNotificationStyle(options: NotificationStyleOptions): string {
    const {
        priority,
        pulse = false,
        blur = 12,
        padding = '12px 16px',
        borderRadius = '8px',
        zIndex = 9998
    } = options;

    const colors = PRIORITY_COLORS[priority];

    return `
        background: linear-gradient(135deg, ${colors.bg}, rgba(0, 0, 0, 0.1));
        border: 2px solid ${colors.border};
        border-radius: ${borderRadius};
        padding: ${padding};
        color: ${colors.text};
        box-shadow: 0 0 15px ${colors.glow}, 0 0 30px ${colors.glow};
        backdrop-filter: blur(${blur}px);
        -webkit-backdrop-filter: blur(${blur}px);
        z-index: ${zIndex};
        ${pulse ? `animation: ${getAnimationClass('pulse')};` : ''}
    `.replace(/\s+/g, ' ').trim();
}
