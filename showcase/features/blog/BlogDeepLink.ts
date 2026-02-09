/**
 * ═══════════════════════════════════════════════════════════════
 * TIMELINE DEEP LINKING
 *
 * Phase 6: URL-based navigation for shareable timeline links
 * Part of MAXIMUM MICHELIN timeline enhancements
 *
 * Features:
 * - Hash navigation to specific entries (#phase-13i)
 * - Query param filtering (?filter=game)
 * - Query param search (?search=tori)
 * - Combined params (?filter=game&search=EventBus)
 * - Update URL on navigation without page reload
 *
 * Credit: ZeeRah's Chaos 😈
 * 848 is sacred. 💚🔥💀
 * ═══════════════════════════════════════════════════════════════
 */

import { Logger } from '@utils/Logger';

export interface DeepLinkParams {
    entryId?: string;      // From hash: #phase-13i
    filter?: string;       // From query: ?filter=game
    search?: string;       // From query: ?search=tori
}

export class BlogDeepLink {
    private onNavigate?: (params: DeepLinkParams) => void;

    constructor() {
        this.init();
    }

    /**
     * Initialize deep linking
     */
    private init(): void {
        // Parse URL on page load
        this.parseURL();

        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            this.parseURL();
        });

        // Listen for popstate (browser back/forward)
        window.addEventListener('popstate', () => {
            this.parseURL();
        });

        Logger.ui('🔗 [BlogDeepLink] Initialized');
    }

    /**
     * Parse current URL and extract parameters
     */
    private parseURL(): void {
        const params = this.getParams();

        if (Object.keys(params).length > 0) {
            Logger.ui('🔗 [BlogDeepLink] Navigating to:', params);

            if (this.onNavigate) {
                this.onNavigate(params);
            }
        }
    }

    /**
     * Get parameters from current URL
     */
    public getParams(): DeepLinkParams {
        const params: DeepLinkParams = {};

        // Parse hash (#entry-id)
        const hash = window.location.hash.slice(1); // Remove #
        if (hash) {
            params.entryId = hash;
        }

        // Parse query string (?filter=game&search=tori)
        const urlParams = new URLSearchParams(window.location.search);

        const filter = urlParams.get('filter');
        if (filter) {
            params.filter = filter;
        }

        const search = urlParams.get('search');
        if (search) {
            params.search = search;
        }

        return params;
    }

    /**
     * Update URL with new parameters (without page reload)
     */
    public updateURL(params: DeepLinkParams): void {
        const url = new URL(window.location.href);

        // Update hash
        if (params.entryId) {
            url.hash = params.entryId;
        } else {
            url.hash = '';
        }

        // Update query params
        if (params.filter) {
            url.searchParams.set('filter', params.filter);
        } else {
            url.searchParams.delete('filter');
        }

        if (params.search) {
            url.searchParams.set('search', params.search);
        } else {
            url.searchParams.delete('search');
        }

        // Update URL without reload
        window.history.pushState({}, '', url.toString());

        Logger.ui('🔗 [BlogDeepLink] URL updated:', url.toString());
    }

    /**
     * Navigate to specific entry by ID
     */
    public navigateToEntry(entryId: string): void {
        this.updateURL({ entryId });

        // Scroll to entry
        const element = document.querySelector(`[data-id="${entryId}"]`);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            // Highlight effect
            element.classList.add('highlight-pulse');
            setTimeout(() => {
                element.classList.remove('highlight-pulse');
            }, 2000);
        }
    }

    /**
     * Set filter and update URL
     */
    public setFilter(filter: string): void {
        const params = this.getParams();
        params.filter = filter;
        this.updateURL(params);
    }

    /**
     * Set search query and update URL
     */
    public setSearch(search: string): void {
        const params = this.getParams();
        params.search = search;
        this.updateURL(params);
    }

    /**
     * Clear all parameters
     */
    public clear(): void {
        this.updateURL({});
    }

    /**
     * Set callback for navigation events
     */
    public onNavigateChange(callback: (params: DeepLinkParams) => void): void {
        this.onNavigate = callback;
    }

    /**
     * Generate shareable link for entry
     */
    public getShareableLink(entryId: string): string {
        const url = new URL(window.location.origin + window.location.pathname);
        url.hash = entryId;
        return url.toString();
    }

    /**
     * Generate shareable link with filter
     */
    public getFilterLink(filter: string): string {
        const url = new URL(window.location.origin + window.location.pathname);
        url.searchParams.set('filter', filter);
        return url.toString();
    }

    /**
     * Generate shareable link with search
     */
    public getSearchLink(search: string): string {
        const url = new URL(window.location.origin + window.location.pathname);
        url.searchParams.set('search', search);
        return url.toString();
    }

    /**
     * Copy link to clipboard
     */
    public async copyToClipboard(link: string): Promise<boolean> {
        try {
            await navigator.clipboard.writeText(link);
            Logger.ui('🔗 [BlogDeepLink] Link copied:', link);
            return true;
        } catch (err) {
            Logger.error('🔗 [BlogDeepLink] Failed to copy link:', err);
            return false;
        }
    }
}
