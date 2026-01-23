/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 ROUTER - HASH-BASED NAVIGATION
 * 
 * Handles URL routing for the single-page application.
 * Uses hash-based routing (#/app/params) for simplicity.
 * 
 * Routes:
 *   #/           → landing
 *   #/landing    → landing
 *   #/showcase   → showcase
 *   #/showcase/timeline/42 → showcase with params
 *   #/v1         → v1 game
 *   #/v1/scene/prologue → v1 with scene param
 *   #/v2         → v2 game
 *   #/torigatchi → tori-gatchi pet sim
 * ═══════════════════════════════════════════════════════════════
 */

export class Router {
    /**
     * @param {import('./UV7Shell.js').UV7Shell} shell 
     */
    constructor(shell) {
        this.shell = shell;

        // Default app mappings
        this.routes = {
            '': 'landing',
            'landing': 'landing',
            'showcase': 'showcase',
            'v1': 'v1',
            'v2': 'v2',
            'torigatchi': 'torigatchi'
        };
    }

    /**
     * Initialize the router
     */
    init() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());

        // Handle initial route
        this.handleRoute();

        console.log('[Router] Initialized');
    }

    /**
     * Parse the current hash and load the appropriate app
     */
    handleRoute() {
        const { appId, params } = this.parseHash();

        console.log(`[Router] Navigating to: ${appId}`, params);

        this.shell.loadApp(appId, params);
    }

    /**
     * Parse the URL hash into app ID and parameters
     * @returns {{ appId: string, params: Object }}
     */
    parseHash() {
        // Remove leading '#/' or '#'
        let hash = location.hash.replace(/^#\/?/, '');

        // Split into segments: app/key/value/key/value...
        const segments = hash.split('/').filter(Boolean);

        // First segment is the app ID
        const appKey = segments[0] || '';
        const appId = this.routes[appKey] || 'landing';

        // Remaining segments are key/value pairs
        const params = {};
        for (let i = 1; i < segments.length; i += 2) {
            const key = segments[i];
            const value = segments[i + 1];
            if (key && value !== undefined) {
                params[key] = decodeURIComponent(value);
            }
        }

        return { appId, params };
    }

    /**
     * Navigate to an app
     * @param {string} appId - The app to navigate to
     * @param {Object} params - Optional parameters
     */
    navigate(appId, params = {}) {
        // Build hash
        let hash = `#/${appId}`;

        // Add params as key/value pairs
        for (const [key, value] of Object.entries(params)) {
            hash += `/${key}/${encodeURIComponent(value)}`;
        }

        // Update URL (triggers hashchange)
        location.hash = hash;
    }

    /**
     * Navigate back in history
     */
    back() {
        history.back();
    }

    /**
     * Get the current app ID
     * @returns {string}
     */
    getCurrentAppId() {
        return this.parseHash().appId;
    }

    /**
     * Get the current route params
     * @returns {Object}
     */
    getCurrentParams() {
        return this.parseHash().params;
    }
}

export default Router;
