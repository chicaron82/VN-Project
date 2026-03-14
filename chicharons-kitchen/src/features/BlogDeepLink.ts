/**
 * BlogDeepLink — handles #entry-{id} deep linking
 * On page load, scrolls to and highlights the matching card.
 */
export class BlogDeepLink {
    private highlightClass = 'entry-highlighted';

    init(): void {
        window.addEventListener('DOMContentLoaded', () => this.handleHash());
        window.addEventListener('hashchange', () => this.handleHash());
    }

    handleHash(): void {
        const hash = window.location.hash;
        if (!hash.startsWith('#entry-')) return;

        const entryId = hash.slice(1); // e.g. "entry-roadtrip-timing-cascade-fix-feb-2026"
        const el = document.getElementById(entryId);
        if (!el) return;

        // Remove previous highlight
        document.querySelectorAll(`.${this.highlightClass}`).forEach(e => {
            e.classList.remove(this.highlightClass);
        });

        el.classList.add(this.highlightClass);
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    static getAnchorId(entryId: string): string {
        return `entry-${entryId}`;
    }

    static copyLink(entryId: string): void {
        const url = `${window.location.origin}${window.location.pathname}#entry-${entryId}`;
        navigator.clipboard?.writeText(url).catch(() => {
            // Fallback: update hash
            window.location.hash = `entry-${entryId}`;
        });
    }
}
