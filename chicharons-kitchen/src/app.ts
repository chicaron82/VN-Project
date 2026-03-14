import { timelineData } from '../entries/index';
import { BlogCard } from './features/BlogCard';
import { BlogFilter } from './features/BlogFilter';
import { BlogDeepLink } from './features/BlogDeepLink';

/**
 * App — chicharons-kitchen blog renderer
 */
export class App {
    private root: HTMLElement;
    private deepLink: BlogDeepLink;
    private filter: BlogFilter | null = null;
    private cardsContainer: HTMLElement | null = null;

    constructor(root: HTMLElement) {
        this.root = root;
        this.deepLink = new BlogDeepLink();
    }

    init(): void {
        this.deepLink.init();
        this.render();
    }

    private render(): void {
        this.root.innerHTML = '';

        // Header
        const header = document.createElement('header');
        header.className = 'site-header';
        header.innerHTML = `
            <div class="header-inner">
                <h1 class="site-title">🍳 chicharon's kitchen</h1>
                <p class="site-subtitle">every commit, a new dish</p>
            </div>
        `;
        this.root.appendChild(header);

        // Main content
        const main = document.createElement('main');
        main.className = 'site-main';

        // Filter bar
        this.filter = new BlogFilter(timelineData, (state) => {
            const filtered = BlogFilter.applyFilter(timelineData, state);
            this.filter?.updateCount(filtered.length);
            this.renderCards(filtered);
        });
        const filterEl = this.filter.render();
        main.appendChild(filterEl);

        // Cards container
        this.cardsContainer = document.createElement('div');
        this.cardsContainer.className = 'cards-grid';
        main.appendChild(this.cardsContainer);

        this.root.appendChild(main);

        // Render initial cards
        this.renderCards(timelineData);
    }

    private renderCards(entries: typeof timelineData): void {
        if (!this.cardsContainer) return;
        this.cardsContainer.innerHTML = '';

        if (entries.length === 0) {
            this.cardsContainer.innerHTML = '<p class="no-results">No entries match the current filters.</p>';
            return;
        }

        entries.forEach(entry => {
            const card = new BlogCard(entry);
            this.cardsContainer!.appendChild(card.render());
        });

        // Re-handle deep link after cards are rendered
        this.deepLink.handleHash();
    }
}
