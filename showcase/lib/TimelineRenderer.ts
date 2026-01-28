/**
 * TIMELINE RENDERER - MICHELIN EDITION 🍽️
 * Handles rendering, filtering, sorting, and spotlight search for project timeline.
 *
 * Converted to TypeScript ES module for Vite integration.
 * Phase 1: Integrated with TimelineAnimations for smooth transitions
 * Phase 2: Integrated with TimelineStats for category dashboard
 */

import { TIMELINE_DATA, type TimelineEntry, type TimelineData } from '../data/timeline';
import { timelineAnimations } from '../ts/TimelineAnimations';
import { TimelineStats } from '../ts/TimelineStats';
import { TimelineScrubber } from '../ts/TimelineScrubber';
import { TimelineSearch } from '../ts/TimelineSearch';

export class TimelineRenderer {
    private container: HTMLElement | null;
    private originalEntries: TimelineEntry[];
    private currentEntries: TimelineEntry[];
    private activeFilter: string;
    private activeSort: string;
    private searchQuery: string;

    // Pagination
    private pageSize: number;
    private currentPage: number;
    private paginationEnabled: boolean;

    // Cache DOM elements
    private toolbar: HTMLElement | null;
    private statsContainer: HTMLElement | null;
    private entriesContainer: HTMLElement | null;

    // Phase 2: Stats dashboard
    private timelineStats: TimelineStats | null;

    // Phase 3: Timeline scrubber
    private timelineScrubber: TimelineScrubber | null;

    // Signal Animation
    private signalPulse: HTMLElement | null;
    private isScrolling: boolean;
    private scrollTimeout?: number;

    // Phase 4: Enhanced search
    private timelineSearch: TimelineSearch | null;

    constructor(containerSelector: string) {
        this.container = document.querySelector(containerSelector);
        this.originalEntries = [];
        this.currentEntries = [];
        this.activeFilter = 'all';
        // Initialize activeSort based on restored View Mode (from ViewModeController)
        // This prevents a mismatch where Body='dev' (Expanded) but Renderer='story'
        this.activeSort = document.body.dataset.viewMode || 'story';
        this.searchQuery = '';

        // Pagination
        this.pageSize = 3;
        this.currentPage = 0;
        this.paginationEnabled = true;

        // Cache DOM elements
        this.toolbar = null;
        this.statsContainer = null;
        this.entriesContainer = null;

        // Phase 2: Stats dashboard
        this.timelineStats = null;

        // Phase 3: Timeline scrubber
        this.timelineScrubber = null;

        // Signal Animation
        this.signalPulse = null;
        this.isScrolling = false;

        // Phase 4: Enhanced search
        this.timelineSearch = null;

        this.init();
    }

    async init(): Promise<void> {
        if (!this.container) return;

        // Inject Signal Track
        this.createSignalTrack();

        // Load Data
        await this.loadTimelineData();

        // Initial Render (order matters - last rendered appears first due to insertBefore)
        this.renderToolbar();

        // Phase 2: Render Stats Dashboard (rendered after toolbar so it appears before it)
        this.renderStatsContainer();

        this.renderTimeline();

        // Phase 3: Initialize Timeline Scrubber (after timeline is rendered)
        this.timelineScrubber = new TimelineScrubber('.timeline-phases', '#timeline-container');

        // Phase 4: Initialize Enhanced Search (after timeline is rendered)
        // This adds fuzzy matching, autocomplete, and keyboard nav to the existing toolbar search
        this.timelineSearch = new TimelineSearch('.timeline-phases', '.timeline-search');

        // Setup Observers
        this.setupInteractions();
    }

    private createSignalTrack(): void {
        // Only if it doesn't exist
        if (!this.container?.querySelector('.timeline-signal-track')) {
            const track = document.createElement('div');
            track.className = 'timeline-signal-track';
            this.signalPulse = document.createElement('div');
            this.signalPulse.className = 'timeline-signal-pulse';
            track.appendChild(this.signalPulse);
            this.container?.appendChild(track);

            // Connect signal to scroll
            window.addEventListener('scroll', () => {
                if (!this.signalPulse || !this.container) return;

                // Simple calculation to move pulse visually based on viewport center
                // relative to the container
                const rect = this.container.getBoundingClientRect();
                const viewportCenter = window.innerHeight / 2;
                const relativeTop = viewportCenter - rect.top;

                // Clamp
                const clampedTop = Math.max(0, Math.min(relativeTop, rect.height));

                this.signalPulse.style.top = `${clampedTop}px`;
                this.signalPulse.style.opacity = '1';

                clearTimeout(this.scrollTimeout);
                this.scrollTimeout = window.setTimeout(() => {
                    if (this.signalPulse) {
                        this.signalPulse.style.opacity = '0.5';
                    }
                }, 1000);
            }, { passive: true });
        }
    }

    private setupInteractions(): void {
        // Observer for context updates (if needed)
        // For now, the global scroll listener handles the signal pulse
        // We can add IntersectionObservers here for individual phase highlighting if we want "active" states

        // Example: Highlight active phase in sidebar (though sidebar handles this itself)
        // This is a placeholder for future interaction logic to satisfy the init call
        console.log('🍽️ Timeline interactions initialized');
    }

    private renderStatsContainer(): void {
        // Remove existing stats if any
        if (this.statsContainer) this.statsContainer.remove();

        // Create stats instance with original entries
        this.timelineStats = new TimelineStats(this.originalEntries);
        const statsHTML = this.timelineStats.renderDashboard();

        // Create container and inject HTML
        this.statsContainer = document.createElement('div');
        this.statsContainer.innerHTML = statsHTML;

        // Insert at the top of the timeline container
        this.container?.insertBefore(this.statsContainer, this.container.firstChild);

        // Add click handlers for category filtering
        this.attachStatsClickHandlers();

        // Trigger animated counters on intersection
        this.animateStatsCounters();

        console.log('📊 [Phase 2] Stats dashboard rendered');
    }

    private attachStatsClickHandlers(): void {
        const statCards = this.statsContainer?.querySelectorAll('.stat-card');

        statCards?.forEach(card => {
            card.addEventListener('click', () => {
                const category = (card as HTMLElement).dataset.category;
                if (!category) return;

                console.log(`📊 [Phase 2] Filtering by category: ${category}`);

                // Filter timeline to show only this category
                const matchingItems = Array.from(
                    this.entriesContainer?.querySelectorAll(`.timeline-item[data-type="${category}"]`) || []
                ) as HTMLElement[];

                // Use Phase 1 animations for smooth filtering
                timelineAnimations.filterWithStagger(matchingItems, 50);

                // Update active state on stat cards
                statCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                // Scroll to first matching item
                if (matchingItems.length > 0) {
                    setTimeout(() => {
                        timelineAnimations.scrollToElement(matchingItems[0], 200);
                    }, 600);
                }
            });
        });

        // Add "Show All" handler
        const showAllBtn = this.statsContainer?.querySelector('.stats-show-all-btn');
        showAllBtn?.addEventListener('click', () => {
            console.log('📊 [Phase 2] Showing all timeline items');

            // Reset filter and re-render timeline
            this.activeFilter = 'all';
            this.searchQuery = '';
            this.renderTimeline();

            // Remove active state from all stat cards
            statCards?.forEach(c => c.classList.remove('active'));
        });
    }

    private animateStatsCounters(): void {
        // Animate stat counters from 0 to target value
        const counters = this.statsContainer?.querySelectorAll('.stat-count');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target as HTMLElement;
                    const target = parseInt(counter.dataset.count || '0');
                    const duration = 1000; // 1 second
                    const steps = 30;
                    const increment = target / steps;
                    const stepDuration = duration / steps;

                    let current = 0;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target.toString();
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current).toString();
                        }
                    }, stepDuration);

                    // Unobserve after animating
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters?.forEach(counter => observer.observe(counter));
    }

    private async loadTimelineData(): Promise<void> {
        // Import from ES module instead of window global
        this.originalEntries = TIMELINE_DATA.entries;

        // Set Sort Date if missing (fallback to ID or index)
        this.originalEntries.forEach((entry, index) => {
            if (!entry.sortDate) {
                // Approximate for legacy/missing data
                entry.sortDate = `2026-01-01T${index}`;
            }
        });

        this.applyLogic();
    }

    // --- CORE LOGIC ---

    private applyLogic(): void {
        // 1. Filter
        let filtered = this.originalEntries;
        if (this.activeFilter !== 'all') {
            filtered = filtered.filter(p => p.date.includes(this.activeFilter));
        }

        // 2. Search (Spotlight)
        // We don't remove items in search, we just mark them for "Spotlight"
        // But if filtering, we do remove.
        // Let's keep search separate: Search affects VISIBILITY STATE (dimming), not existence.

        // 3. Sort
        filtered.sort((a, b) => {
            if (this.activeSort === 'story') {
                return a.sortDate.localeCompare(b.sortDate);
            } else {
                return b.sortDate.localeCompare(a.sortDate);
            }
        });

        this.currentEntries = filtered;
    }

    // --- RENDERING ---

    private renderToolbar(): void {
        // Sync body attribute for CSS styling hooks (e.g. auto-expand in dev mode)
        document.body.setAttribute('data-view-mode', this.activeSort);

        if (this.toolbar) this.toolbar.remove();

        this.toolbar = document.createElement('div');
        this.toolbar.className = 'timeline-toolbar-container';

        // Extract Unique Dates for Filter
        const dates = [...new Set(this.originalEntries.map(p => {
            // Simplify date string "January 12, 2026 (Morning)" -> "Jan 12"
            // This is a naive regex, might need adjustment based on real data
            const match = p.date.match(/([A-Z][a-z]+ \d+)/);
            return match ? match[0] : p.date;
        }))];

        // Build Filter Options
        const filterOptions = dates.map(date => `<option value="${date}">${date}</option>`).join('');

        this.toolbar.innerHTML = `
            <div class="timeline-toolbar">
                <div class="toolbar-group">
                    <button class="timeline-btn ${this.activeSort === 'story' ? 'active' : ''}" data-action="sort" data-value="story">
                        <span>📜</span> Story
                    </button>
                    <button class="timeline-btn ${this.activeSort === 'dev' ? 'active' : ''}" data-action="sort" data-value="dev">
                        <span>⚡</span> Dev Log
                    </button>
                </div>

                <div class="toolbar-group">
                     <select class="timeline-btn" id="timeline-filter">
                        <option value="all">All Dates</option>
                        ${filterOptions}
                     </select>
                </div>

                <div class="search-wrapper">
                    <span class="search-icon">🔍</span>
                    <input type="text" class="timeline-search" placeholder="Spotlight search (e.g. 'EventBus', 'Tori')..." />
                    <div class="search-suggestions" id="search-suggestions">
                        <!-- Autocomplete suggestions generated by TimelineSearch -->
                    </div>
                </div>
            </div>
        `;

        // Insert Toolbar before container contents
        this.container?.insertBefore(this.toolbar, this.container.firstChild);

        // Events
        this.toolbar.querySelectorAll('[data-action="sort"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const val = target.dataset.value;
                if (val) {
                    this.activeSort = val;
                    this.renderToolbar(); // Re-render to update active state
                    this.applyLogic();
                    this.renderTimeline();
                }
            });
        });

        const filterSelect = this.toolbar.querySelector('#timeline-filter') as HTMLSelectElement;
        if (filterSelect) {
            filterSelect.value = this.activeFilter; // Restore state
            filterSelect.addEventListener('change', (e) => {
                this.activeFilter = (e.target as HTMLSelectElement).value;
                this.applyLogic();
                this.renderTimeline();
            });
        }

        const searchInput = this.toolbar.querySelector('.timeline-search') as HTMLInputElement;
        if (searchInput) {
            searchInput.value = this.searchQuery;
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = (e.target as HTMLInputElement).value;
                this.applySpotlight();
            });
        }
    }

    private renderTimeline(): void {
        // Remove old phases and pagination if any
        if (this.entriesContainer) this.entriesContainer.remove();
        this.container?.querySelector('.timeline-pagination')?.remove();

        this.entriesContainer = document.createElement('div');
        this.entriesContainer.className = 'timeline-phases';

        // Determine which entries to show based on pagination
        const entriesToShow = this.paginationEnabled
            ? this.currentEntries.slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize)
            : this.currentEntries;

        entriesToShow.forEach(entry => {
            const el = this.createEntryElement(entry);
            this.entriesContainer?.appendChild(el);
        });

        this.container?.appendChild(this.entriesContainer);

        // Add pagination controls if enabled
        if (this.paginationEnabled && this.currentEntries.length > this.pageSize) {
            this.renderPaginationControls();
        }

        // Re-apply spotlight if query exists
        if (this.searchQuery) this.applySpotlight();

        // Trigger Prism syntax highlight
        if (window.Prism) window.Prism.highlightAll();

        // Dispatch content update event (for ScrollAnimator)
        window.dispatchEvent(new CustomEvent('uv7-content-updated'));

        // Phase 1: Apply entrance animations to timeline items
        timelineAnimations.refresh();
        const items = Array.from(this.entriesContainer?.querySelectorAll('.timeline-item') || []) as HTMLElement[];
        if (items.length > 0) {
            timelineAnimations.animateItems(items, 100, 50);
        }

        // Phase 1: Enable ripple effects on toolbar buttons
        timelineAnimations.enableRippleForButtons('.timeline-btn');

        // Phase 1: Add click-to-highlight for timeline entries
        items.forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                timelineAnimations.scrollToElement(item, 100);
            });
        });

        // Phase 3: Refresh scrubber after timeline renders
        if (this.timelineScrubber) {
            this.timelineScrubber.refresh();
        }
    }

    private renderPaginationControls(): void {
        const totalPages = Math.ceil(this.currentEntries.length / this.pageSize);
        const startEntry = this.currentPage * this.pageSize + 1;
        const endEntry = Math.min((this.currentPage + 1) * this.pageSize, this.currentEntries.length);

        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'timeline-pagination';
        paginationDiv.innerHTML = `
            <div class="pagination-info">
                Showing ${startEntry}-${endEntry} of ${this.currentEntries.length} entries
            </div>
            <div class="pagination-controls">
                <button class="pagination-btn" data-action="prev" ${this.currentPage === 0 ? 'disabled' : ''}>
                    ← Previous
                </button>
                <button class="pagination-btn view-all" data-action="toggle-all">
                    View All
                </button>
                <button class="pagination-btn" data-action="next" ${this.currentPage >= totalPages - 1 ? 'disabled' : ''}>
                    Next →
                </button>
            </div>
            <div class="pagination-dots">
                ${Array.from({ length: totalPages }, (_, i) =>
            `<span class="pagination-dot ${i === this.currentPage ? 'active' : ''}" data-page="${i}"></span>`
        ).join('')}
            </div>
        `;

        // Event listeners
        paginationDiv.querySelector('[data-action="prev"]')?.addEventListener('click', () => {
            if (this.currentPage > 0) {
                this.currentPage--;
                this.renderTimeline();
                this.scrollToTimeline();
            }
        });

        paginationDiv.querySelector('[data-action="next"]')?.addEventListener('click', () => {
            if (this.currentPage < totalPages - 1) {
                this.currentPage++;
                this.renderTimeline();
                this.scrollToTimeline();
            }
        });

        paginationDiv.querySelector('[data-action="toggle-all"]')?.addEventListener('click', () => {
            this.paginationEnabled = !this.paginationEnabled;
            this.currentPage = 0;
            this.renderTimeline();
            if (this.paginationEnabled) {
                this.scrollToTimeline();
            }
        });

        paginationDiv.querySelectorAll('.pagination-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                const page = parseInt((e.target as HTMLElement).dataset.page || '');
                if (!isNaN(page)) {
                    this.currentPage = page;
                    this.renderTimeline();
                    this.scrollToTimeline();
                }
            });
        });

        this.container?.appendChild(paginationDiv);
    }

    private scrollToTimeline(): void {
        // Smooth scroll to timeline top after pagination change
        const toolbarRect = this.toolbar?.getBoundingClientRect();
        if (toolbarRect) {
            const scrollTarget = window.scrollY + toolbarRect.top - 80; // 80px offset for status bar
            window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
        }
    }

    private applySpotlight(): void {
        const query = this.searchQuery.toLowerCase();
        const items = this.entriesContainer?.querySelectorAll('.timeline-item');

        if (!query) {
            this.entriesContainer?.classList.remove('spotlight-mode');
            items?.forEach(item => {
                item.classList.remove('dimmed', 'focused');
            });
            return;
        }

        this.entriesContainer?.classList.add('spotlight-mode');

        items?.forEach(item => {
            const text = item.textContent?.toLowerCase() || '';

            // Check if matches
            if (text.includes(query)) {
                item.classList.add('focused');
                item.classList.remove('dimmed');
            } else {
                item.classList.add('dimmed');
                item.classList.remove('focused');
            }
        });
    }

    // --- DOM GENERATION ---

    private createEntryElement(entry: TimelineEntry): HTMLElement {
        const item = document.createElement('div');
        item.className = `timeline-item ${entry.type || ''}`;
        item.id = entry.id;
        // Add data-type attribute for CSS visual theming
        if (entry.type) {
            item.setAttribute('data-type', entry.type);
        }

        const marker = document.createElement('div');
        marker.className = 'timeline-marker';

        const content = document.createElement('div');
        content.className = 'timeline-content';

        // HEADER
        const header = document.createElement('h3');
        header.textContent = `${entry.date} ${entry.emoji || ''}`;
        content.appendChild(header);

        // TITLE
        const title = document.createElement('p');
        title.innerHTML = `<strong>${entry.title}</strong>`;
        content.appendChild(title);

        // SUMMARY
        if (entry.summary) {
            const summary = document.createElement('p');
            summary.innerHTML = entry.summary; // Allow HTML in summary
            content.appendChild(summary);
        }

        // DETAILS (Toggleable)
        const details = document.createElement('div');
        details.className = 'timeline-details';
        let hasDetails = false;

        // 1. Features
        if (entry.features) {
            hasDetails = true;
            const ul = document.createElement('ul');
            ul.className = 'update-list';
            entry.features.forEach(f => {
                const li = document.createElement('li');
                li.innerHTML = f;
                ul.appendChild(li);
            });
            details.appendChild(ul);
        }

        // 2. Timeline (for chaos entries)
        if (entry.theTimeline) {
            hasDetails = true;
            const timelineDiv = document.createElement('div');
            timelineDiv.className = 'timeline-subsection';
            timelineDiv.innerHTML = '<h4 style="color: #888; margin-bottom: 0.5rem;">The Timeline:</h4>';
            const ul = document.createElement('ul');
            ul.className = 'update-list';
            entry.theTimeline.forEach(t => {
                const li = document.createElement('li');
                li.innerHTML = t;
                ul.appendChild(li);
            });
            timelineDiv.appendChild(ul);
            details.appendChild(timelineDiv);
        }

        // 3. Callout
        if (entry.callout) {
            hasDetails = true;
            const callout = document.createElement('div');
            callout.className = `v2-improvement-callout`;

            callout.innerHTML = `
                <div class="callout-icon">${entry.callout.icon || '💡'}</div>
                <div class="callout-content">
                    <strong>${entry.callout.title || 'Insight:'}</strong> ${entry.callout.text}
                </div>
            `;
            details.appendChild(callout);
        }

        // 4. Quote (memorable one-liner)
        if (entry.quote) {
            hasDetails = true;
            const quote = document.createElement('div');
            quote.className = 'timeline-entry-quote';
            quote.innerHTML = `<blockquote>${entry.quote}</blockquote>`;
            details.appendChild(quote);
        }

        // 5. Metrics
        if (entry.metrics) {
            hasDetails = true;
            const metricsGrid = document.createElement('div');
            metricsGrid.className = 'stats-mini-grid dev-only';
            Object.entries(entry.metrics).forEach(([key, val]) => {
                metricsGrid.innerHTML += `
                    <div class="stat-mini">
                        <span class="stat-num">${val}</span>
                        <span class="stat-desc">${key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                `;
            });
            details.appendChild(metricsGrid);
        }

        // Toggle Button
        if (hasDetails) {
            const toggle = document.createElement('button');
            toggle.className = 'expand-toggle';
            toggle.textContent = 'View details';
            toggle.onclick = (e) => {
                e.stopPropagation();
                item.classList.toggle('expanded');
                toggle.textContent = item.classList.contains('expanded') ? 'Hide details' : 'View details';
            };
            content.appendChild(toggle);
            content.appendChild(details);
        }

        item.appendChild(marker);
        item.appendChild(content);
        return item;
    }

    private escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}
