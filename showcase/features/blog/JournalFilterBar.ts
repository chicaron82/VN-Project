/**
 * JOURNAL FILTER BAR — BOUGIE EDITION 💎
 * Glass-morphism chip strip with crew portraits and category pills.
 * Replaces the old FunMetricsDashboard with interactive, functional filtering.
 *
 * Two rows:
 *   Row 1: Category pills (All, Milestones, Debug Hell, Refactors, V3 Experiment, Just Vibes)
 *   Row 2: Crew portrait chips (only crew with attributed entries)
 *
 * 💚🔥💀
 */

import type { BlogEntry } from '../../data/blog';
import { Logger } from '@utils/Logger';
import { extractContributorIds } from './EntryCardUtils';

/** Category filter definition */
interface FilterCategory {
    id: string;
    emoji: string;
    label: string;
    match: (entry: BlogEntry) => boolean;
}

/** Crew chip definition */
interface CrewChip {
    id: string;
    name: string;
    portrait: string;
    color: string;
    count: number;
}

/** Signature colors from CrewCardData (canonical source of truth) */
const CREW_COLORS: Record<string, string> = {
    tori:        '#ff6b9d',
    zee:         '#00d4ff',
    zeerah:      '#ff8c00',
    dizee:       '#00ff88',
    belle:       '#a78bfa',
    genzee:      '#ef4444',
    perplexizee: '#60a5fa',
    cozee:       '#34d399',
    aaron:       '#fbbf24'
};

const CREW_NAMES: Record<string, string> = {
    tori: 'Tori', zee: 'Zee', zeerah: 'ZeeRah', dizee: 'DiZee',
    belle: 'Belle', genzee: 'GenZee', perplexizee: 'PerplexiZee',
    cozee: 'CoZee', aaron: 'Aaron'
};

const CREW_PORTRAITS: Record<string, string> = {
    tori:        '../assets/tori-portrait.png',
    zee:         '../assets/z-portrait.png',
    zeerah:      '../assets/zr-portrait.png',
    dizee:       '../assets/dz-portrait.png',
    belle:       '../assets/iz-portrait.png',
    genzee:      '../assets/gz-portrait.png',
    perplexizee: '../assets/pz-portrait.png',
    cozee:       '../assets/cz-portrait.png',
    aaron:       '../assets/creator-portrait.png'
};

const CATEGORIES: FilterCategory[] = [
    {
        id: 'milestones', emoji: '🎯', label: 'Milestones',
        match: (e) => {
            const c = `${e.title} ${e.summary || ''} ${e.type || ''}`.toLowerCase();
            return c.includes('milestone') || c.includes('achievement') || c.includes('complete');
        }
    },
    {
        id: 'debug', emoji: '💀', label: 'Debug Hell',
        match: (e) => {
            const c = `${e.title} ${e.summary || ''} ${e.type || ''}`.toLowerCase();
            return c.includes('bug') || c.includes('fix') || c.includes('debug') || c.includes('chaos');
        }
    },
    {
        id: 'refactors', emoji: '✨', label: 'Refactors',
        match: (e) => {
            const c = `${e.title} ${e.summary || ''} ${e.type || ''}`.toLowerCase();
            return c.includes('refactor') || c.includes('clean') || c.includes('polish');
        }
    },
    {
        id: 'experiment', emoji: '🧪', label: 'V3 Experiment',
        match: (e) => !!e.isV3Entry
    }
];

export class JournalFilterBar {
    private mount: HTMLElement | null;
    private entries: BlogEntry[];
    private onFilter: (filter: string | null) => void;
    private activeFilter: string | null = null;
    private barElement: HTMLElement | null = null;

    constructor(
        mountSelector: string,
        entries: BlogEntry[],
        onFilter: (filter: string | null) => void
    ) {
        this.mount = document.querySelector(mountSelector);
        this.entries = entries;
        this.onFilter = onFilter;
        this.render();
        this.setupExternalFilterListener();
    }

    /**
     * Listen for external filter requests (from portrait clicks in entry cards)
     */
    private setupExternalFilterListener(): void {
        window.addEventListener('uv7:filter:crew', ((e: CustomEvent<{ chefId: string }>) => {
            const { chefId } = e.detail;
            this.filterByChef(chefId);
        }) as EventListener);
    }

    /**
     * Programmatically filter by chef ID (called from portrait clicks)
     */
    filterByChef(chefId: string): void {
        if (!this.barElement) return;

        // Find the crew chip button for this chef
        const btn = this.barElement.querySelector(`[data-filter="${chefId}"]`) as HTMLButtonElement | null;

        if (btn) {
            // Use existing handleFilterClick to maintain state consistency
            this.handleFilterClick(chefId, btn);
        } else {
            // Chef exists in entries but not enough to show in filter bar
            // Still filter, just won't highlight a button
            this.activeFilter = chefId;
            this.onFilter(chefId);

            // Update URL
            const url = new URL(window.location.href);
            url.searchParams.set('filter', chefId);
            window.history.replaceState({}, '', url.toString());

            // Clear all active states since this chef isn't in the bar
            this.barElement.querySelectorAll('.filter-pill, .filter-crew-chip').forEach(el => {
                el.classList.remove('active');
                el.setAttribute('aria-checked', 'false');
            });
        }

        // Scroll to top of journal for better UX
        this.mount?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    private render(): void {
        if (!this.mount) return;

        this.barElement = document.createElement('div');
        this.barElement.className = 'journal-filter-bar';
        this.barElement.setAttribute('role', 'toolbar');
        this.barElement.setAttribute('aria-label', 'Filter journal entries');

        // --- Row 1: Category pills ---
        const categoryRow = document.createElement('div');
        categoryRow.className = 'filter-row filter-categories';

        // "All" pill
        const totalCount = this.entries.length;
        categoryRow.appendChild(this.createCategoryPill('all', '📔', 'All', totalCount, true));

        // Category pills with counts
        for (const cat of CATEGORIES) {
            const count = this.entries.filter(cat.match).length;
            if (count > 0) {
                categoryRow.appendChild(this.createCategoryPill(cat.id, cat.emoji, cat.label, count));
            }
        }

        this.barElement.appendChild(categoryRow);

        // --- Row 2: Crew portrait chips ---
        const crewChips = this.buildCrewChips();
        if (crewChips.length > 0) {
            const crewRow = document.createElement('div');
            crewRow.className = 'filter-row filter-crew';

            for (const chip of crewChips) {
                crewRow.appendChild(this.createCrewChip(chip));
            }

            this.barElement.appendChild(crewRow);
        }

        this.mount.appendChild(this.barElement);
        Logger.ui('[JournalFilterBar] Rendered with', CATEGORIES.length, 'categories,', crewChips.length, 'crew chips');
    }

    private createCategoryPill(
        filterId: string,
        emoji: string,
        label: string,
        count: number,
        isActive = false
    ): HTMLButtonElement {
        const btn = document.createElement('button');
        btn.className = `filter-pill${isActive ? ' active' : ''}`;
        btn.dataset.filter = filterId;
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', isActive.toString());
        btn.innerHTML = `
            <span class="filter-pill-emoji">${emoji}</span>
            <span class="filter-pill-label">${label}</span>
            <span class="filter-pill-count">${count}</span>
        `;

        btn.addEventListener('click', () => this.handleFilterClick(filterId === 'all' ? null : filterId, btn));
        return btn;
    }

    private createCrewChip(chip: CrewChip): HTMLButtonElement {
        const btn = document.createElement('button');
        btn.className = 'filter-crew-chip';
        btn.dataset.filter = chip.id;
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', 'false');
        btn.style.setProperty('--crew-color', chip.color);
        btn.innerHTML = `
            <img src="${chip.portrait}" alt="${chip.name}" class="filter-crew-avatar" loading="lazy" />
            <span class="filter-crew-name">${chip.name}</span>
            <span class="filter-crew-count">${chip.count}</span>
        `;

        btn.addEventListener('click', () => this.handleFilterClick(chip.id, btn));
        return btn;
    }

    private handleFilterClick(filter: string | null, _clickedBtn: HTMLButtonElement): void {
        // If clicking the already-active filter, reset to "All"
        if (this.activeFilter === filter && filter !== null) {
            filter = null;
        }

        this.activeFilter = filter;

        // Update all button states
        if (this.barElement) {
            this.barElement.querySelectorAll('.filter-pill, .filter-crew-chip').forEach(btn => {
                const el = btn as HTMLButtonElement;
                const btnFilter = el.dataset.filter === 'all' ? null : el.dataset.filter;
                const isActive = btnFilter === filter || (filter === null && el.dataset.filter === 'all');
                el.classList.toggle('active', isActive);
                el.setAttribute('aria-checked', isActive.toString());
            });
        }

        // Fire callback
        this.onFilter(filter);

        // Update URL hash for shareability
        if (filter) {
            const url = new URL(window.location.href);
            url.searchParams.set('filter', filter);
            window.history.replaceState({}, '', url.toString());
        } else {
            const url = new URL(window.location.href);
            url.searchParams.delete('filter');
            window.history.replaceState({}, '', url.toString());
        }
    }

    private buildCrewChips(): CrewChip[] {
        const crewCounts: Record<string, number> = {};

        // Count ALL contributors from each entry (not just modelId)
        for (const entry of this.entries) {
            const contributorIds = extractContributorIds(entry);
            for (const id of contributorIds) {
                crewCounts[id] = (crewCounts[id] || 0) + 1;
            }
        }

        return Object.entries(crewCounts)
            .filter(([, count]) => count > 0)
            .sort(([, a], [, b]) => b - a) // Most contributions first
            .map(([id, count]) => ({
                id,
                name: CREW_NAMES[id] || id,
                portrait: CREW_PORTRAITS[id] || '',
                color: CREW_COLORS[id] || '#888',
                count
            }));
    }

    /**
     * Check URL for ?filter= param and apply on init
     */
    applyUrlFilter(): void {
        const url = new URL(window.location.href);
        const filter = url.searchParams.get('filter');
        if (filter && this.barElement) {
            const btn = this.barElement.querySelector(`[data-filter="${filter}"]`) as HTMLButtonElement | null;
            if (btn) {
                this.handleFilterClick(filter, btn);
            }
        }
    }
}
