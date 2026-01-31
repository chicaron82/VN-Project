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
     * Navigate to an app
     * @param appId - The app to navigate to
     * @param params - Optional parameters
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
     * Navigate back in history
     */
    back(): void {
        history.back();
    }

    /**
     * Get the current app ID
     */
    getCurrentAppId(): string {
        return this.parseHash().appId;
    }

    /**
     * Get the current route params
     */
    getCurrentParams(): Record<string, string> {
        return this.parseHash().params;
    }
}

export default Router;
