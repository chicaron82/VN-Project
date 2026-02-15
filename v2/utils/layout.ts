/**
 * Layout detection utilities
 * 
 * Single source of truth for orientation checks.
 * Used by MobileUXController, KeyboardController, and anywhere
 * that needs portrait/landscape routing.
 * 
 * 💚 Built with love. 848 is sacred. 💀
 */

/**
 * Returns true if the viewport is in landscape orientation
 * (width exceeds height).
 */
export function isLandscape(): boolean {
    return window.innerWidth > window.innerHeight;
}
