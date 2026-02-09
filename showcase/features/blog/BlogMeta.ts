/**
 * ═══════════════════════════════════════════════════════════════
 * TIMELINE META
 *
 * Phase 15: Dynamic document title and meta tags
 * Part of MAXIMUM MICHELIN timeline enhancements
 *
 * Features:
 * - Updates document.title on entry selection
 * - Updates meta description (for supported clients)
 * - Restores default title on exit
 *
 * Credit: ZeeRah's Chaos 😈
 * 848 is sacred. 💚🔥💀
 * ═══════════════════════════════════════════════════════════════
 */
import { Logger } from '@utils/Logger';

export class BlogMeta {
    private defaultTitle: string;

    constructor() {
        this.defaultTitle = document.title;
        this.init();
    }

    private init(): void {
        this.bindEvents();
        Logger.ui('📰 [BlogMeta] Initialized');
    }

    private bindEvents(): void {
        // Listen for internal deep link events
        // Note: BlogDeepLink might need to dispatch an event, or we can listen to hashchange
        window.addEventListener('hashchange', () => this.handleHashChange());

        // Also check on load
        this.handleHashChange();
    }

    private handleHashChange(): void {
        const hash = window.location.hash;
        if (!hash || !hash.startsWith('#entry-')) {
            this.restoreTitle();
            return;
        }

        const entryId = hash.substring(1); // remove #
        const entry = document.getElementById(entryId);

        if (entry) {
            const title = entry.querySelector('strong')?.textContent;
            const date = entry.querySelector('h3')?.textContent;

            if (title && date) {
                // Parse date YYYY-MM-DD
                const dateMatch = date.match(/\((\d{4}-\d{2}-\d{2})\)/);
                const shortDate = dateMatch ? dateMatch[1] : date;

                this.setMeta(title, shortDate);
            }
        }
    }

    private setMeta(title: string, date: string): void {
        document.title = `${date}: ${title} | UV7 Showcase`;
    }

    private restoreTitle(): void {
        document.title = this.defaultTitle;
    }

    public destroy(): void {
        this.restoreTitle();
        Logger.ui('📰 [BlogMeta] Destroyed');
    }
}
