/**
 * ═══════════════════════════════════════════════════════════════
 * BASE APP - ABSTRACT APP INTERFACE
 * 
 * All apps must extend this class to work with UV7Shell.
 * Defines the lifecycle contract: mount(), unmount(), etc.
 * ═══════════════════════════════════════════════════════════════
 */

export class BaseApp {
    /**
     * @param {import('../UV7Shell.js').UV7Shell} shell 
     */
    constructor(shell) {
        /** @type {import('../UV7Shell.js').UV7Shell} */
        this.shell = shell;

        /** @type {string} */
        this.id = 'base';

        /** @type {HTMLElement|null} */
        this.container = null;

        /** @type {boolean} */
        this.mounted = false;

        /** @type {Object|null} Gesture handlers to register with GestureRouter */
        this.gestureHandlers = null;
    }

    /**
     * Mount the app into a container
     * @param {HTMLElement} container - The viewport element
     * @param {Object} params - Route parameters
     */
    async mount(container, params = {}) {
        this.container = container;
        this.mounted = true;

        // Subclasses should override this
        console.log(`[${this.id}] Mounted`);
    }

    /**
     * Unmount the app and clean up
     */
    async unmount() {
        // Clean up event listeners, timers, etc.
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.mounted = false;

        console.log(`[${this.id}] Unmounted`);
    }

    /**
     * Called when route parameters change without full remount
     * @param {Object} params 
     */
    onRouteChange(params) {
        // Subclasses can override for deep linking
    }

    /**
     * Get the status bar configuration for this app
     * @returns {Object}
     */
    getStatusBarConfig() {
        return {
            title: this.id,
            context: this.id
        };
    }

    /**
     * Get current app state for persistence
     * @returns {Object}
     */
    getState() {
        return {};
    }

    /**
     * Restore app from saved state
     * @param {Object} state 
     */
    restoreState(state) {
        // Subclasses implement
    }
}

export default BaseApp;
