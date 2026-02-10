/**
 * ═══════════════════════════════════════════════════════════════
 * NAVIGATION HELPER - SMOOTH VIEW TRANSITIONS
 * 
 * Provides smooth page transitions using the View Transitions API.
 * Falls back to standard navigation on unsupported browsers.
 * 
 * Inspired by Belle's implementation in UV7OS.
 * ═══════════════════════════════════════════════════════════════
 */

import { Logger } from '@utils/Logger';

/**
 * Navigate to a URL with a smooth View Transition animation
 * @param url - The URL to navigate to
 * @param fallbackDelay - Optional delay before fallback navigation (ms)
 */
export function navigateWithTransition(url: string, fallbackDelay: number = 0): void {
    // Check if browser supports View Transitions
    const doc = document as Document & { startViewTransition?: (callback: () => void) => void };
    if (!doc.startViewTransition) {
        Logger.system('[NavigationHelper] View Transitions not supported - using standard navigation');

        if (fallbackDelay > 0) {
            setTimeout(() => {
                window.location.href = url;
            }, fallbackDelay);
        } else {
            window.location.href = url;
        }
        return;
    }

    Logger.system(`[NavigationHelper] Navigating to ${url} with View Transition`);

    // Start the view transition
    doc.startViewTransition(() => {
        // This callback runs after the old state is captured
        // but before the new state is rendered
        window.location.href = url;
    });
}

/**
 * Check if View Transitions API is supported
 */
export function isViewTransitionsSupported(): boolean {
    return !!(document as Document & { startViewTransition?: unknown }).startViewTransition;
}

export default {
    navigateWithTransition,
    isViewTransitionsSupported
};
