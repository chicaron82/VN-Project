/**
 * StatusBarContext - Context Detection & Feature Flags
 * Extracted from StatusBar.ts (Phase 26 Refactoring)
 *
 * Tori's recommendation: Use explicit signals, not just pathname
 *
 * 💚🔥💀 "Every pixel, every gesture, every animation—premium."
 */

// ========================================
// CONTEXT DETECTION
// ========================================

/**
 * UV7 Context - Where is the StatusBar running?
 */
export type UV7Context = 'game' | 'showcase' | 'landing';

/**
 * Detect current UV7 context
 * Priority: 1) data-context attribute, 2) window global, 3) pathname fallback
 */
export function detectContext(): UV7Context {
    // Tori's recommendation: Explicit signal first
    const bodyContext = document.body.dataset.context as UV7Context | undefined;
    if (bodyContext && ['game', 'showcase', 'landing'].includes(bodyContext)) {
        return bodyContext;
    }

    // Window global fallback
    if ((window as any).__UV7_CONTEXT__) {
        return (window as any).__UV7_CONTEXT__ as UV7Context;
    }

    // Pathname fallback (safety net)
    const pathname = window.location.pathname.toLowerCase();
    if (pathname.includes('showcase')) return 'showcase';
    if (pathname.includes('index.html') && !pathname.includes('v2')) return 'landing';
    return 'game';
}

// ========================================
// FEATURE FLAGS
// ========================================

/**
 * Feature flags for context-specific behavior
 * Tori's recommendation: StatusBar renders UI, emits events, doesn't do actions
 */
export interface StatusBarFeatures {
    // Display features
    showLoopVersion: boolean;
    showRoute: boolean;
    showBreadcrumbs: boolean;
    showNotes: boolean;
    showTether: boolean;
    showMail: boolean;
    showPhaseIndicator: boolean;
    showStoryDevToggle: boolean;

    // Interaction features
    enableAppSwitcher: boolean;
    enableGestures: boolean;
    enableAdaptiveTint: boolean;

    // Glassmorphism
    glassIntensity: 'subtle' | 'medium' | 'heavy';
}

/**
 * Get feature flags for a given context
 */
export function getFeatures(context: UV7Context): StatusBarFeatures {
    switch (context) {
        case 'game':
            return {
                showLoopVersion: true,
                showRoute: true,
                showBreadcrumbs: true,
                showNotes: true,
                showTether: true,
                showMail: true,
                showPhaseIndicator: false,
                showStoryDevToggle: false,
                enableAppSwitcher: true,
                enableGestures: true,
                enableAdaptiveTint: true,
                glassIntensity: 'medium',
            };
        case 'showcase':
            return {
                showLoopVersion: false,
                showRoute: false,
                showBreadcrumbs: true,
                showNotes: false,
                showTether: false,
                showMail: false,
                showPhaseIndicator: true,
                showStoryDevToggle: true,
                enableAppSwitcher: true,
                enableGestures: false,  // Showcase doesn't need swipe gestures
                enableAdaptiveTint: true,
                glassIntensity: 'subtle',
            };
        case 'landing':
            return {
                showLoopVersion: true,
                showRoute: false,
                showBreadcrumbs: false,
                showNotes: false,
                showTether: false,
                showMail: false,
                showPhaseIndicator: false,
                showStoryDevToggle: false,
                enableAppSwitcher: true,
                enableGestures: false,
                enableAdaptiveTint: false,
                glassIntensity: 'heavy',
            };
    }
}

// ========================================
// COLOR TINTS
// ========================================

/**
 * Color tint configuration for routes/contexts
 * Belle's insight: "Subconscious UX without the user realizing it"
 */
export interface ColorTint {
    primary: string;      // Main accent color
    glow: string;         // Glow/shadow color
    gradient: string;     // CSS gradient for glassmorphism
}

// Default neutral tint (always defined, used as fallback)
export const NEUTRAL_TINT: ColorTint = {
    primary: 'rgba(255, 255, 255, 0.9)',
    glow: 'rgba(255, 255, 255, 0.2)',
    gradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(200, 200, 200, 0.02))',
};

/**
 * COLOR_TINTS for non-game contexts only
 *
 * In GAME mode: CSS class-based theming handles route colors
 * - .ronnie-route uses cyan (#00ffff)
 * - .tori-route uses green (#00ff88)
 *
 * In SHOWCASE/LANDING: These tints apply via inline styles
 */
export const COLOR_TINTS = {
    // Context tints (non-game)
    showcase: {
        primary: 'rgba(255, 165, 0, 0.9)',         // Dev orange
        glow: 'rgba(255, 140, 0, 0.3)',
        gradient: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 140, 0, 0.05))',
    } as ColorTint,
    landing: {
        primary: 'rgba(147, 112, 219, 0.9)',       // UV7 purple
        glow: 'rgba(138, 43, 226, 0.3)',
        gradient: 'linear-gradient(135deg, rgba(147, 112, 219, 0.1), rgba(138, 43, 226, 0.05))',
    } as ColorTint,
    neutral: NEUTRAL_TINT,
} as const;

/**
 * Get initial color tint for a context
 */
export function getInitialTint(context: UV7Context): ColorTint {
    switch (context) {
        case 'showcase':
            return COLOR_TINTS.showcase;
        case 'landing':
            return COLOR_TINTS.landing;
        default:
            return COLOR_TINTS.neutral;
    }
}
