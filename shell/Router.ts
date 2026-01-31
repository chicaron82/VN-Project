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

import type { UV7Shell } from './UV7Shell.js';

interface RouteMap {
    [key: string]: string;
}

interface ParsedRoute {
    appId: string;
    params: Record<string, string>;
}

export class Router {
    private shell: UV7Shell;
    private routes: RouteMap;

    constructor(shell: UV7Shell) {
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
    init(): void {
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());

        // Handle initial route
        this.handleRoute();

        console.log('[Router] Initialized');
    }

    /**
     * Parse the current hash and load the appropriate app
     */
    handleRoute(): void {
        const { appId, params } = this.parseHash();

        console.log(`[Router] Navigating to: ${appId}`, params);

        this.shell.loadApp(appId, params);
    }

    /**
     * Parse the URL hash into app ID and parameters
     *
     * Converts hash URLs like:
     * - `#/` → { appId: 'landing', params: {} }
     * - `#/showcase` → { appId: 'showcase', params: {} }
     * - `#/showcase/phase/42` → { appId: 'showcase', params: { phase: '42' } }
     *
     * @returns Parsed route with appId and key-value parameters
     * @example
     * // URL: #/v1/route/ronnie/act/2
     * parseHash() // → { appId: 'v1', params: { route: 'ronnie', act: '2' } }
     */
    parseHash(): ParsedRoute {
        // Remove leading '#/' or '#'
        let hash = location.hash.replace(/^#\/?/, '');

        // Split into segments: app/key/value/key/value...
        const segments = hash.split('/').filter(Boolean);

        // First segment is the app ID
        const appKey = segments[0] || '';
        const appId = this.routes[appKey] || 'landing';

        // Remaining segments are key/value pairs
        const params: Record<string, string> = {};
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
     * Navigate to an app programmatically
     *
     * Updates the URL hash and triggers app loading.
     * Parameters are encoded as key/value pairs in the URL.
     *
     * @param appId - The app to navigate to ('landing', 'showcase', 'v1', 'v2', 'torigatchi')
     * @param params - Optional key-value parameters for the app
     *
     * @example
     * router.navigate('showcase') // → #/showcase
     * router.navigate('showcase', { phase: '42' }) // → #/showcase/phase/42
     */
    navigate(appId: string, params: Record<string, string> = {}): void {
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
     * Navigate back in browser history
     *
     * Calls window.history.back() to return to the previous page/app.
     * Useful for implementing back buttons in apps.
     *
     * @example
     * router.back() // Go to previous route
     */
    back(): void {
        history.back();
    }

    /**
     * Get the current active app ID
     *
     * @returns The ID of the currently active app
     * @example
     * router.getCurrentAppId() // → 'showcase' (if URL is #/showcase/phase/42)
     */
    getCurrentAppId(): string {
        return this.parseHash().appId;
    }

    /**
     * Get the current route parameters
     *
     * @returns Object containing key-value parameters from the current URL
     * @example
     * // URL: #/showcase/phase/42
     * router.getCurrentParams() // → { phase: '42' }
     */
    getCurrentParams(): Record<string, string> {
        return this.parseHash().params;
    }
}

export default Router;
