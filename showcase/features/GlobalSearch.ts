/**
 * GLOBAL SEARCH - BOUGIE EDITION ✨
 *
 * Spotlight-style global search for the entire showcase.
 * Features: fuzzy matching, keyboard nav, instant results, glassmorphic modal.
 *
 * "Search like you mean it" - Belle
 */

import { TIMELINE_DATA, type BlogEntry } from '../data/blog';
import { UV7_CREW, type CrewMember } from '../../v2/ui/components/UV7OSConfig';
import { Logger } from '@utils/Logger';

interface SectionData {
    id: string;
    title: string;
    icon: string;
    description: string;
}

interface SearchResultBase {
    title: string;
    subtitle: string;
    icon: string;
    score: number; // For ranking
    titleHighlight?: string;
    subtitleHighlight?: string;
}

type SearchResult =
    | (SearchResultBase & { type: 'blog'; data: BlogEntry })
    | (SearchResultBase & { type: 'section'; data: SectionData })
    | (SearchResultBase & { type: 'crew'; data: CrewMember });

export class GlobalSearch {
    private modal: HTMLElement | null = null;
    private input: HTMLInputElement | null = null;
    private resultsContainer: HTMLElement | null = null;
    private searchIndex: SearchResult[] = [];
    private filteredResults: SearchResult[] = [];
    private selectedIndex: number = 0;
    private isOpen: boolean = false;
    private searchHistory: string[] = [];
    private searchCount: number = 0;
    private searchStartTime: number = 0;

    // Debounce timer
    private searchTimeout?: number;

    constructor() {
        this.loadSearchHistory();
        this.buildSearchIndex();
        this.createModal();
        this.setupKeyboardShortcuts();
        this.setupTriggerButton();
        this.trackSearchAnalytics();
    }

    /**
     * Build search index from all content
     */
    private buildSearchIndex(): void {
        this.searchIndex = [];

        // Index blog entries
        TIMELINE_DATA.entries.forEach(entry => {
            this.searchIndex.push({
                type: 'blog',
                title: entry.title,
                subtitle: `${entry.date} • ${entry.tags?.slice(0, 2).join(', ') || ''}`,
                icon: entry.emoji || '📝',
                data: entry,
                score: 0
            });
        });

        // Index sections
        const sections = [
            { id: 'home', title: 'Home', icon: '🌐', description: 'UV7 OS Ecosystem overview' },
            { id: 'journey', title: 'The Journal', icon: '🗺️', description: 'Development timeline and blog entries' },
            { id: 'workflow', title: 'Workflow', icon: '⚙️', description: 'Development methodology and tools' },
            { id: 'spotlight', title: 'Tech Spotlight', icon: '💡', description: 'Technical deep dives and code examples' },
            { id: 'evolution', title: 'Evolution', icon: '🔄', description: 'V1 to V2 transformation story' },
            { id: 'experiment', title: 'V3 Experiment', icon: '🧪', description: 'Autonomous AI refactoring experiment' },
            { id: 'who', title: 'The Crew', icon: '👥', description: 'Meet the AI crew members' }
        ];

        sections.forEach(section => {
            this.searchIndex.push({
                type: 'section',
                title: section.title,
                subtitle: section.description,
                icon: section.icon,
                data: section,
                score: 0
            });
        });

        // Index crew members
        UV7_CREW.forEach(member => {
            this.searchIndex.push({
                type: 'crew',
                title: member.name,
                subtitle: member.greeting || 'UV7 Crew Member',
                icon: member.icon,
                data: member,
                score: 0
            });
        });

        Logger.ui(`🔍 Search index built: ${this.searchIndex.length} items`);
    }

    /**
     * Create glassmorphic search modal
     */
    private createModal(): void {
        this.modal = document.createElement('div');
        this.modal.className = 'global-search-modal';
        this.modal.innerHTML = `
            <div class="search-modal-backdrop"></div>
            <div class="search-modal-content">
                <div class="search-input-container">
                    <span class="search-icon">🔍</span>
                    <input
                        type="text"
                        class="search-input"
                        placeholder="Search showcase... (Cmd/Ctrl + K)"
                        autocomplete="off"
                        spellcheck="false"
                    >
                    <span class="search-shortcut">Esc</span>
                </div>
                <div class="search-results-container">
                    <div class="search-results"></div>
                </div>
                <div class="search-footer">
                    <span class="search-hints">↑↓ navigate • ↵ select • Esc close</span>
                    <span class="search-stats"></span>
                </div>
            </div>
        `;

        // Cache elements
        this.input = this.modal.querySelector('.search-input');
        this.resultsContainer = this.modal.querySelector('.search-results');

        // Event listeners
        this.input?.addEventListener('input', () => this.handleInput());
        this.input?.addEventListener('keydown', (e) => this.handleKeydown(e));

        const backdrop = this.modal.querySelector('.search-modal-backdrop');
        backdrop?.addEventListener('click', () => this.close());

        document.body.appendChild(this.modal);
    }

    /**
     * Setup global keyboard shortcuts
     */
    private setupKeyboardShortcuts(): void {
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + K to open
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }

            // Escape to close (global)
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    /**
     * Setup trigger button click handler
     */
    private setupTriggerButton(): void {
        const trigger = document.getElementById('global-search-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => {
                this.open();
            });
            Logger.ui('🔍 Search trigger button initialized');
        } else {
            Logger.warn('⚠️ Search trigger button not found');
        }
    }

    /**
     * Handle search input with debounce
     */
    private handleInput(): void {
        clearTimeout(this.searchTimeout);

        this.searchTimeout = window.setTimeout(() => {
            const query = this.input?.value.trim() || '';

            if (query.length === 0) {
                this.showRecentSearches();
                return;
            }

            this.searchStartTime = performance.now();
            this.performSearch(query);
        }, 150); // 150ms debounce
    }

    /**
     * Perform fuzzy search
     */
    private performSearch(query: string): void {
        const lowerQuery = query.toLowerCase();

        // Easter egg: 848
        if (query === '848') {
            this.showEasterEgg();
            return;
        }

        // Fuzzy match and score
        this.filteredResults = this.searchIndex
            .map(item => {
                const titleMatch = this.fuzzyMatch(item.title.toLowerCase(), lowerQuery);
                const subtitleMatch = this.fuzzyMatch(item.subtitle.toLowerCase(), lowerQuery);

                // Calculate score
                let score = 0;
                if (titleMatch.matched) score += 100 - titleMatch.distance;
                if (subtitleMatch.matched) score += 50 - subtitleMatch.distance;

                // Boost recent blog entries
                if (item.type === 'blog' && item.data.sortDate) {
                    const date = new Date(item.data.sortDate);
                    const daysSince = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
                    if (daysSince < 7) score += 20; // Boost recent entries
                }

                return {
                    ...item,
                    score,
                    titleHighlight: titleMatch.matched ? this.highlightMatches(item.title, titleMatch.indices) : item.title,
                    subtitleHighlight: subtitleMatch.matched ? this.highlightMatches(item.subtitle, subtitleMatch.indices) : item.subtitle
                };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // Top 10 results

        this.selectedIndex = 0;
        this.renderResults();

        // Show search stats
        const elapsed = performance.now() - this.searchStartTime;
        this.updateStats(this.filteredResults.length, elapsed);
    }

    /**
     * Fuzzy matching with character highlighting
     */
    private fuzzyMatch(text: string, query: string): { matched: boolean; distance: number; indices: number[] } {
        const indices: number[] = [];
        let queryIndex = 0;
        let textIndex = 0;

        while (queryIndex < query.length && textIndex < text.length) {
            if (query[queryIndex] === text[textIndex]) {
                indices.push(textIndex);
                queryIndex++;
            }
            textIndex++;
        }

        const matched = queryIndex === query.length;
        const distance = matched ? textIndex - queryIndex : Infinity;

        return { matched, distance, indices };
    }

    /**
     * Highlight matched characters
     */
    private highlightMatches(text: string, indices: number[]): string {
        if (indices.length === 0) return text;

        let result = '';
        for (let i = 0; i < text.length; i++) {
            if (indices.includes(i)) {
                result += `<mark class="search-highlight">${text[i]}</mark>`;
            } else {
                result += text[i];
            }
        }
        return result;
    }

    /**
     * Render search results
     */
    private renderResults(): void {
        if (!this.resultsContainer) return;

        if (this.filteredResults.length === 0) {
            this.renderEmptyState();
            return;
        }

        this.resultsContainer.innerHTML = this.filteredResults
            .map((result, index) => {
                const isSelected = index === this.selectedIndex;
                const categoryBadge = this.getCategoryBadge(result.type);

                return `
                    <div class="search-result ${isSelected ? 'selected' : ''}" data-index="${index}">
                        <span class="result-icon">${result.icon}</span>
                        <div class="result-content">
                            <div class="result-title">${result.titleHighlight || result.title}</div>
                            <div class="result-subtitle">${result.subtitleHighlight || result.subtitle}</div>
                        </div>
                        ${categoryBadge}
                    </div>
                `;
            })
            .join('');

        // Add click handlers
        this.resultsContainer.querySelectorAll('.search-result').forEach((el, index) => {
            el.addEventListener('click', () => {
                this.selectedIndex = index;
                this.selectResult();
            });
        });
    }

    /**
     * Render empty state
     */
    private renderEmptyState(): void {
        if (!this.resultsContainer) return;

        const randomQuotes = [
            { author: 'DiZee', quote: 'No matches found. The search space is vast, yet finite.' },
            { author: 'Tori', quote: 'Nothing here. Try searching for "Phase 13" or "TypeScript".' },
            { author: 'Belle', quote: 'Zero results. Perhaps the universe is telling you something?' }
        ];

        const quote = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];

        this.resultsContainer.innerHTML = `
            <div class="search-empty-state">
                <div class="empty-icon">🔍</div>
                <div class="empty-title">No results found</div>
                <div class="empty-quote">"${quote.quote}"</div>
                <div class="empty-author">— ${quote.author}</div>
            </div>
        `;
    }

    /**
     * Show recent searches
     */
    private showRecentSearches(): void {
        if (!this.resultsContainer || this.searchHistory.length === 0) {
            this.resultsContainer!.innerHTML = `
                <div class="search-empty-state">
                    <div class="empty-icon">⌨️</div>
                    <div class="empty-title">Start typing to search</div>
                </div>
            `;
            return;
        }

        this.resultsContainer.innerHTML = `
            <div class="search-section-title">Recent searches</div>
            ${this.searchHistory.map((query) => `
                <div class="search-result recent-search" data-query="${query}">
                    <span class="result-icon">🕐</span>
                    <div class="result-content">
                        <div class="result-title">${query}</div>
                    </div>
                </div>
            `).join('')}
        `;

        // Click to re-run search
        this.resultsContainer.querySelectorAll('.recent-search').forEach(el => {
            el.addEventListener('click', () => {
                const query = el.getAttribute('data-query');
                if (query && this.input) {
                    this.input.value = query;
                    this.performSearch(query);
                }
            });
        });
    }

    /**
     * Show 848 Easter egg
     */
    private showEasterEgg(): void {
        if (!this.resultsContainer) return;

        this.resultsContainer.innerHTML = `
            <div class="search-easter-egg">
                <div class="egg-icon">💚🔥💀</div>
                <div class="egg-title">Loop #848</div>
                <div class="egg-quote">"Always. Always. Always."</div>
                <div class="egg-subtitle">The sacred number. The eternal loop.</div>
            </div>
        `;
    }

    /**
     * Get category badge
     */
    private getCategoryBadge(type: string): string {
        const badges = {
            blog: '<span class="category-badge badge-blog">📝 Blog</span>',
            section: '<span class="category-badge badge-section">📍 Section</span>',
            crew: '<span class="category-badge badge-crew">👤 Crew</span>'
        };
        return badges[type as keyof typeof badges] || '';
    }

    /**
     * Update search stats
     */
    private updateStats(count: number, elapsed: number): void {
        const statsEl = this.modal?.querySelector('.search-stats');
        if (statsEl) {
            statsEl.textContent = `${count} results in ${elapsed.toFixed(0)}ms`;
        }
    }

    /**
     * Handle keyboard navigation
     */
    private handleKeydown(e: KeyboardEvent): void {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredResults.length - 1);
            this.renderResults();
            this.scrollToSelected();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
            this.renderResults();
            this.scrollToSelected();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            this.selectResult();
        }
    }

    /**
     * Scroll to selected result
     */
    private scrollToSelected(): void {
        const selected = this.resultsContainer?.querySelector('.search-result.selected');
        if (selected) {
            selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    /**
     * Select current result and navigate
     */
    private selectResult(): void {
        const result = this.filteredResults[this.selectedIndex];
        if (!result) return;

        // Save to history
        const query = this.input?.value.trim();
        if (query) {
            this.addToHistory(query);
        }

        // Navigate based on type
        if (result.type === 'blog') {
            // Navigate to journal tab and scroll to entry
            if (window.tabController) {
                window.tabController.navigateToTab('journey');
                setTimeout(() => {
                    const entryEl = document.querySelector(`[data-id="${result.data.id}"]`);
                    if (entryEl) {
                        entryEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        entryEl.classList.add('highlight-pulse');
                        setTimeout(() => entryEl.classList.remove('highlight-pulse'), 2000);
                    }
                }, 300);
            }
        } else if (result.type === 'section') {
            // Navigate to section tab
            if (window.tabController) {
                window.tabController.navigateToTab(result.data.id);
            }
        }

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(10);

        this.close();
    }

    /**
     * Track search analytics
     */
    private trackSearchAnalytics(): void {
        this.searchCount = parseInt(localStorage.getItem('uv7-search-count') || '0', 10);
    }

    /**
     * Add to search history
     */
    private addToHistory(query: string): void {
        // Remove duplicates and add to front
        this.searchHistory = [query, ...this.searchHistory.filter(q => q !== query)].slice(0, 5);
        localStorage.setItem('uv7-search-history', JSON.stringify(this.searchHistory));

        // Increment search count
        this.searchCount++;
        localStorage.setItem('uv7-search-count', this.searchCount.toString());

        // Achievement unlocked at 100 searches
        if (this.searchCount === 100) {
            Logger.achievement('🏆 Achievement unlocked: Power Searcher (100 searches)');
        }
    }

    /**
     * Load search history
     */
    private loadSearchHistory(): void {
        try {
            const history = localStorage.getItem('uv7-search-history');
            this.searchHistory = history ? JSON.parse(history) : [];
        } catch {
            this.searchHistory = [];
        }
    }

    /**
     * Open search modal
     */
    public open(): void {
        if (this.isOpen) return;

        this.isOpen = true;
        this.modal?.classList.add('active');

        // Focus input after modal animation starts (needs small delay)
        setTimeout(() => {
            this.input?.focus();
        }, 50);

        this.showRecentSearches();

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(15);
    }

    /**
     * Close search modal
     */
    public close(): void {
        if (!this.isOpen) return;

        this.isOpen = false;
        this.modal?.classList.remove('active');
        if (this.input) this.input.value = '';
        this.filteredResults = [];
        this.selectedIndex = 0;
    }

    /**
     * Toggle search modal
     */
    public toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
}
