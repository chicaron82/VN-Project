/**
 * ═══════════════════════════════════════════════════════════════
 * TIMELINE SEARCH & AUTOCOMPLETE
 *
 * Phase 4: Real-time search with fuzzy matching
 * Part of MAXIMUM MICHELIN timeline enhancements
 *
 * Features:
 * - Real-time search across all timeline entries
 * - Fuzzy matching algorithm
 * - Autocomplete dropdown with keyboard navigation
 * - Highlight matching text in results
 * - Search by title, description, features, crew members
 *
 * Credit: ZeeRah's Chaos 😈
 * 848 is sacred. 💚🔥💀
 * ═══════════════════════════════════════════════════════════════
 */

export interface SearchableEntry {
    id: string;
    title: string;
    description?: string;
    features?: string[];
    crew?: string[];
    element: HTMLElement;
    searchText: string; // Combined searchable text
}

export interface SearchResult {
    entry: SearchableEntry;
    score: number;
    matches: string[];
}

export class TimelineSearch {
    private entries: SearchableEntry[];
    private searchInput: HTMLInputElement | null;
    private suggestionsContainer: HTMLElement | null;
    private resultsCount: HTMLElement | null;
    private clearButton: HTMLElement | null;
    private currentResults: SearchResult[];
    private selectedIndex: number;
    private onResultSelect?: (entry: SearchableEntry) => void;

    constructor(
        timelineSelector: string = '.timeline-phases',
        searchInputSelector: string = '#timeline-search'
    ) {
        this.entries = [];
        this.currentResults = [];
        this.selectedIndex = -1;

        // Get DOM elements
        this.searchInput = document.querySelector(searchInputSelector);
        this.suggestionsContainer = document.querySelector('#search-suggestions');
        this.resultsCount = document.querySelector('#results-count');
        this.clearButton = document.querySelector('.search-clear');

        // Index timeline entries
        this.indexEntries(timelineSelector);

        // Attach event handlers
        this.attachHandlers();

        console.log('🔍 [TimelineSearch] Initialized with', this.entries.length, 'entries');
    }

    /**
     * Index all timeline entries for searching
     */
    private indexEntries(timelineSelector: string): void {
        const timeline = document.querySelector(timelineSelector);
        if (!timeline) {
            console.warn('🔍 [TimelineSearch] Timeline container not found:', timelineSelector);
            return;
        }

        const items = timeline.querySelectorAll('.timeline-item');
        console.log('🔍 [TimelineSearch] Found', items.length, 'timeline items');

        items.forEach((item) => {
            const element = item as HTMLElement;
            const id = element.id || element.dataset.id || '';

            // TimelineRenderer structure: title is in <strong>, summary in <p>
            const titleElement = element.querySelector('strong');
            const title = titleElement?.textContent?.trim() || '';

            // Get all text content for description (summary + features)
            const contentDiv = element.querySelector('.timeline-content');
            const description = contentDiv?.textContent?.trim() || '';

            // Extract features from update-list
            const features: string[] = [];
            element.querySelectorAll('.update-list li').forEach(f => {
                const text = f.textContent?.trim();
                if (text) features.push(text);
            });

            // Extract crew members (if any)
            const crew: string[] = [];
            element.querySelectorAll('.crew-member').forEach(c => {
                const text = c.textContent?.trim();
                if (text) crew.push(text);
            });

            // Combine all searchable text
            const searchText = [
                title,
                description,
                ...features,
                ...crew,
                element.dataset.type || ''
            ].join(' ').toLowerCase();

            this.entries.push({
                id,
                title,
                description,
                features,
                crew,
                element,
                searchText
            });
        });

        console.log('🔍 [TimelineSearch] Indexed', this.entries.length, 'entries');
    }

    /**
     * Attach event handlers
     */
    private attachHandlers(): void {
        if (!this.searchInput) return;

        // Real-time search
        this.searchInput.addEventListener('input', () => {
            const query = this.searchInput!.value.trim();
            this.performSearch(query);
        });

        // Keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeyboardNav(e);
        });

        // Clear button
        if (this.clearButton) {
            this.clearButton.addEventListener('click', () => {
                this.clearSearch();
            });
        }

        // Click outside to close suggestions
        document.addEventListener('click', (e) => {
            if (!this.searchInput?.contains(e.target as Node) &&
                !this.suggestionsContainer?.contains(e.target as Node)) {
                this.hideSuggestions();
            }
        });
    }

    /**
     * Perform fuzzy search
     */
    private performSearch(query: string): void {
        if (!query) {
            this.showAllEntries();
            this.hideSuggestions();
            this.updateResultsCount(this.entries.length);
            return;
        }

        // Fuzzy match
        this.currentResults = this.fuzzySearch(query);

        // Update UI
        this.filterEntries(this.currentResults);
        this.showSuggestions(this.currentResults.slice(0, 10)); // Top 10
        this.updateResultsCount(this.currentResults.length);
        this.selectedIndex = -1;
    }

    /**
     * Fuzzy search algorithm
     */
    private fuzzySearch(query: string): SearchResult[] {
        const queryLower = query.toLowerCase();
        const results: SearchResult[] = [];

        this.entries.forEach(entry => {
            const score = this.calculateScore(entry.searchText, queryLower);

            if (score > 0) {
                const matches = this.findMatches(entry, queryLower);
                results.push({ entry, score, matches });
            }
        });

        // Sort by score (descending)
        return results.sort((a, b) => b.score - a.score);
    }

    /**
     * Calculate fuzzy match score
     */
    private calculateScore(text: string, query: string): number {
        // Exact match = highest score
        if (text.includes(query)) {
            return 100;
        }

        // Fuzzy match - check if all query chars appear in order
        let score = 0;
        let textIndex = 0;
        let queryIndex = 0;

        while (textIndex < text.length && queryIndex < query.length) {
            if (text[textIndex] === query[queryIndex]) {
                score += 10;
                queryIndex++;
            }
            textIndex++;
        }

        // Bonus for matching at word boundaries
        const words = text.split(/\s+/);
        words.forEach(word => {
            if (word.startsWith(query)) {
                score += 20;
            }
        });

        return queryIndex === query.length ? score : 0;
    }

    /**
     * Find matching text snippets
     */
    private findMatches(entry: SearchableEntry, query: string): string[] {
        const matches: string[] = [];

        if (entry.title.toLowerCase().includes(query)) {
            matches.push(entry.title);
        }

        if (entry.description?.toLowerCase().includes(query)) {
            matches.push(entry.description.substring(0, 100) + '...');
        }

        entry.features?.forEach(f => {
            if (f.toLowerCase().includes(query)) {
                matches.push(f);
            }
        });

        return matches.slice(0, 3); // Max 3 matches
    }

    /**
     * Filter timeline entries
     */
    private filterEntries(results: SearchResult[]): void {
        const matchingIds = new Set(results.map(r => r.entry.id));

        this.entries.forEach(entry => {
            if (matchingIds.has(entry.id)) {
                entry.element.classList.remove('search-hidden');
                entry.element.classList.add('search-match');
            } else {
                entry.element.classList.add('search-hidden');
                entry.element.classList.remove('search-match');
            }
        });
    }

    /**
     * Show all entries (clear filter)
     */
    private showAllEntries(): void {
        this.entries.forEach(entry => {
            entry.element.classList.remove('search-hidden', 'search-match');
        });
    }

    /**
     * Show autocomplete suggestions
     */
    private showSuggestions(results: SearchResult[]): void {
        if (!this.suggestionsContainer || results.length === 0) {
            this.hideSuggestions();
            return;
        }

        this.suggestionsContainer.innerHTML = '';

        results.forEach((result, index) => {
            const suggestion = document.createElement('div');
            suggestion.className = 'search-suggestion';
            suggestion.dataset.index = index.toString();

            const title = document.createElement('div');
            title.className = 'suggestion-title';
            title.textContent = result.entry.title;

            const matches = document.createElement('div');
            matches.className = 'suggestion-matches';
            matches.textContent = result.matches.join(' • ');

            suggestion.appendChild(title);
            if (result.matches.length > 0) {
                suggestion.appendChild(matches);
            }

            // Click handler
            suggestion.addEventListener('click', () => {
                this.selectResult(result.entry);
            });

            if (this.suggestionsContainer) {
                this.suggestionsContainer.appendChild(suggestion);
            }
        });

        this.suggestionsContainer.classList.add('visible');
    }

    /**
     * Hide suggestions
     */
    private hideSuggestions(): void {
        if (this.suggestionsContainer) {
            this.suggestionsContainer.classList.remove('visible');
        }
    }

    /**
     * Handle keyboard navigation
     */
    private handleKeyboardNav(e: KeyboardEvent): void {
        const suggestions = this.suggestionsContainer?.querySelectorAll('.search-suggestion');
        if (!suggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, suggestions.length - 1);
                this.highlightSuggestion(suggestions);
                break;

            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.highlightSuggestion(suggestions);
                break;

            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && this.currentResults[this.selectedIndex]) {
                    this.selectResult(this.currentResults[this.selectedIndex].entry);
                }
                break;

            case 'Escape':
                e.preventDefault();
                this.clearSearch();
                break;
        }
    }

    /**
     * Highlight selected suggestion
     */
    private highlightSuggestion(suggestions: NodeListOf<Element>): void {
        suggestions.forEach((s, i) => {
            if (i === this.selectedIndex) {
                s.classList.add('selected');
                s.scrollIntoView({ block: 'nearest' });
            } else {
                s.classList.remove('selected');
            }
        });
    }

    /**
     * Select a search result
     */
    private selectResult(entry: SearchableEntry): void {
        // Scroll to entry
        entry.element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Highlight effect
        entry.element.classList.add('highlight-pulse');
        setTimeout(() => {
            entry.element.classList.remove('highlight-pulse');
        }, 2000);

        // Hide suggestions
        this.hideSuggestions();

        // Callback
        if (this.onResultSelect) {
            this.onResultSelect(entry);
        }

        console.log('🎯 [TimelineSearch] Selected:', entry.title);
    }

    /**
     * Clear search
     */
    private clearSearch(): void {
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        this.showAllEntries();
        this.hideSuggestions();
        this.updateResultsCount(this.entries.length);
        this.currentResults = [];
        this.selectedIndex = -1;
    }

    /**
     * Update results count display
     */
    private updateResultsCount(count: number): void {
        if (this.resultsCount) {
            this.resultsCount.textContent = count.toString();
        }
    }

    /**
     * Set callback for result selection
     */
    public onSelect(callback: (entry: SearchableEntry) => void): void {
        this.onResultSelect = callback;
    }

    /**
     * Programmatically search
     */
    public search(query: string): void {
        if (this.searchInput) {
            this.searchInput.value = query;
            this.performSearch(query);
        }
    }

    /**
     * Refresh index (call after timeline re-renders)
     */
    public refreshIndex(timelineSelector: string = '.timeline-phases'): void {
        this.entries = [];
        this.indexEntries(timelineSelector);
        console.log('🔄 [TimelineSearch] Index refreshed');
    }
}
