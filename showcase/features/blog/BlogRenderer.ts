/**
 * TIMELINE RENDERER - MICHELIN EDITION 🍽️
 * Handles rendering, filtering, sorting, and spotlight search for project timeline.
 *
 * Converted to TypeScript ES module for Vite integration.
 * Phase 1: Integrated with BlogAnimations for smooth transitions
 * Phase 2: Integrated with TimelineStats for category dashboard
 */

import { TIMELINE_DATA, type BlogEntry } from '../../data/blog';
import { V3_LAB_DATA } from '../../data/lab-entries'; // Import V3 Data
import { timelineAnimations } from './BlogAnimations';
import { FunMetricsDashboard } from './FunMetricsDashboard';
import { BlogScrubber } from './BlogScrubber';
import { BlogSearch } from './BlogSearch';
import { initCrewNavigation } from './CrewNavigation';

export class BlogRenderer {
    private container: HTMLElement | null;
    private originalEntries: BlogEntry[];
    private currentEntries: BlogEntry[];
    private activeFilter: string;
    private activeMode: 'project' | 'v3-lab'; // New V3 Mode State
    private activeSort: string;
    private searchQuery: string;

    // Pagination (incremental "Show More" style)
    private pageSize: number; // How many to load per click
    private visibleCount: number; // How many are currently visible
    private paginationEnabled: boolean;

    // Cache DOM elements
    private toolbar: HTMLElement | null;
    private statsContainer: HTMLElement | null;
    private entriesContainer: HTMLElement | null;

    // Phase 2: Stats dashboard
    private funMetricsDashboard: FunMetricsDashboard | null;

    // Phase 3: Timeline scrubber
    private timelineScrubber: BlogScrubber | null;

    // Signal Animation
    private signalPulse: HTMLElement | null;
    private scrollTimeout?: number;

    // Phase 4: Enhanced search
    private timelineSearch: BlogSearch | null;

    constructor(containerSelector: string) {
        this.container = document.querySelector(containerSelector);
        this.originalEntries = [];
        this.currentEntries = [];
        this.activeFilter = 'all';
        this.activeMode = 'project'; // Default to Project History
        // Initialize activeSort based on restored View Mode (from ViewModeController)
        // This prevents a mismatch where Body='dev' (Expanded) but Renderer='story'
        this.activeSort = document.body.dataset.viewMode || 'story';
        this.searchQuery = '';

        // Pagination (incremental "Show More" style)
        this.pageSize = 3; // Load 3 more each time
        this.visibleCount = 3; // Start with 3 visible
        this.paginationEnabled = true; // Enabled by default

        // Cache DOM elements
        this.toolbar = null;
        this.statsContainer = null;
        this.entriesContainer = null;

        // Phase 2: Stats dashboard
        this.funMetricsDashboard = null;

        // Phase 3: Timeline scrubber
        this.timelineScrubber = null;

        // Signal Animation
        this.signalPulse = null;

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
        this.timelineScrubber = new BlogScrubber('.timeline-phases');

        // Phase 4: Initialize Enhanced Search (after timeline is rendered)
        // This adds fuzzy matching, autocomplete, and keyboard nav to the existing toolbar search
        this.timelineSearch = new BlogSearch('.timeline-phases', '.timeline-search');

        // Refresh search index after any timeline re-render
        this.refreshSearchIndex();

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

        // Auto-hide sticky toolbar on scroll
        this.setupToolbarAutoHide();

        console.log('🍽️ Timeline interactions initialized');
    }

    private setupToolbarAutoHide(): void {
        // Find the scrollable container (Journey tab panel)
        const scrollContainer = document.querySelector('[data-panel="journey"]') as HTMLElement;

        if (!scrollContainer) {
            console.warn('⚠️ Journey panel not found, toolbar auto-hide disabled');
            return;
        }

        let lastScrollY = 0;
        let scrollTimeout: number;
        let isToolbarExpanded = true;

        const handleScroll = () => {
            const currentScrollY = scrollContainer.scrollTop;
            const scrollDelta = currentScrollY - lastScrollY;
            const toolbar = this.toolbar;

            if (!toolbar) return;

            // Clear previous timeout
            clearTimeout(scrollTimeout);

            // Scrolling down
            if (scrollDelta > 5 && currentScrollY > 100) {
                toolbar.classList.add('toolbar-hidden');
                toolbar.classList.remove('toolbar-compact', 'toolbar-expanded');
                isToolbarExpanded = false;
            }
            // Scrolling up
            else if (scrollDelta < -5) {
                toolbar.classList.remove('toolbar-hidden');
                toolbar.classList.add('toolbar-compact');
                toolbar.classList.remove('toolbar-expanded');
                isToolbarExpanded = false;
            }
            // At top of page
            else if (currentScrollY < 50) {
                toolbar.classList.remove('toolbar-hidden', 'toolbar-compact');
                toolbar.classList.add('toolbar-expanded');
                isToolbarExpanded = true;
            }

            lastScrollY = currentScrollY;
        };

        // Attach scroll listener to the Journey panel
        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

        // Click compact toolbar to expand
        this.toolbar?.addEventListener('click', (e) => {
            if (this.toolbar?.classList.contains('toolbar-compact')) {
                e.stopPropagation();
                this.toolbar.classList.remove('toolbar-compact');
                this.toolbar.classList.add('toolbar-expanded');
                isToolbarExpanded = true;

                // Auto-collapse after 5 seconds of no interaction
                clearTimeout(scrollTimeout);
                scrollTimeout = window.setTimeout(() => {
                    const currentScrollY = scrollContainer.scrollTop;
                    if (currentScrollY > 100 && isToolbarExpanded) {
                        this.toolbar?.classList.remove('toolbar-expanded');
                        this.toolbar?.classList.add('toolbar-compact');
                        isToolbarExpanded = false;
                    }
                }, 5000);
            }
        });

        console.log('🎯 Toolbar auto-hide enabled on Journey panel');
    }

    private renderStatsContainer(): void {
        // Remove existing stats if any
        if (this.statsContainer) this.statsContainer.remove();

        // New Fun Metrics Dashboard
        this.funMetricsDashboard = new FunMetricsDashboard(this.originalEntries);
        const dashboardEl = this.funMetricsDashboard.render();

        // Create container and inject HTML
        this.statsContainer = document.createElement('div');
        this.statsContainer.className = 'timeline-stats-wrapper';
        this.statsContainer.appendChild(dashboardEl);

        // Insert BEFORE the timeline container
        if (this.container && this.container.parentNode) {
            this.container.parentNode.insertBefore(this.statsContainer, this.container);
        } else {
            // Fallback
            this.container?.insertBefore(this.statsContainer, this.container.firstChild);
        }

        console.log('📊 [Phase 2] Fun Stats dashboard rendered');
    }



    private async loadTimelineData(): Promise<void> {
        // Swap Data Source based on Active Mode
        if (this.activeMode === 'v3-lab') {
            this.originalEntries = V3_LAB_DATA.entries;
            console.log('🧪 Loaded V3 Lab Data');
        } else {
            this.originalEntries = TIMELINE_DATA.entries;
            console.log('📜 Loaded Project History');
        }

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
        // 1. Filter by Mode (Project vs V3 Lab)
        let filtered = this.originalEntries.filter(p => {
            if (this.activeMode === 'v3-lab') {
                return p.isV3Entry === true;
            } else {
                return !p.isV3Entry;
            }
        });

        // 2. Filter by Category/Tag
        if (this.activeFilter !== 'all') {
            filtered = filtered.filter(p => {
                const dateMatch = p.date?.includes(this.activeFilter);
                const tagMatch = p.tags?.includes(this.activeFilter);
                return dateMatch || tagMatch;
            });
        }

        // 2.5. Apply Page Theme based on active filter
        this.applyPageTheme(this.activeFilter);

        // 3. Search (Spotlight)
        // ...

        // 4. Sort
        filtered.sort((a, b) => {
            if (this.activeSort === 'story') {
                return (a.sortDate || '').localeCompare(b.sortDate || '');
            } else {
                return (b.sortDate || '').localeCompare(a.sortDate || '');
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
            const match = p.date?.match(/([A-Z][a-z]+ \d+)/);
            return match ? match[0] : (p.date || '');
        }))];

        // Extract Unique Tags for Filter
        const tags = [...new Set(this.originalEntries.flatMap(p => p.tags || []))].sort();

        // Build Filter Options with Groups
        let filterOptions = `<optgroup label="Tracks & Phases">`;
        filterOptions += tags.map(tag => `<option value="${tag}">${tag}</option>`).join('');
        filterOptions += `</optgroup>`;

        filterOptions += `<optgroup label="Dates">`;
        filterOptions += dates.map(date => `<option value="${date}">${date}</option>`).join('');
        filterOptions += `</optgroup>`;

        this.toolbar.innerHTML = `
            <div class="timeline-toolbar">
                <div class="toolbar-group mode-toggle-group">
                    <button class="timeline-btn ${this.activeMode === 'project' ? 'active' : ''}" data-action="mode" data-value="project">
                        <span>📜</span> History
                    </button>
                    <button class="timeline-btn ${this.activeMode === 'v3-lab' ? 'active' : ''}" data-action="mode" data-value="v3-lab">
                        <span>🧪</span> V3 Lab
                    </button>
                </div>

                <div class="toolbar-group">
                     <select class="timeline-btn" id="timeline-filter">
                        <option value="all">Show All</option>
                        ${filterOptions}
                     </select>
                </div>

                <div class="search-wrapper">
                    <span class="search-icon">🔍</span>
                    <input type="text" class="timeline-search" placeholder="Spotlight search..." value="${this.searchQuery}" />
                    <div class="search-suggestions" id="search-suggestions">
                        <!-- Autocomplete suggestions generated by BlogSearch -->
                    </div>
                </div>
            </div>
        `;

        // Insert Toolbar before container contents
        this.container?.insertBefore(this.toolbar, this.container.firstChild);

        // Events

        // Mode Toggle
        this.toolbar.querySelectorAll('[data-action="mode"]').forEach(btn => {
            btn.addEventListener('click', async (e) => { // Make async
                const target = e.currentTarget as HTMLElement;
                const mode = target.dataset.value as 'project' | 'v3-lab';
                if (mode && this.activeMode !== mode) {
                    this.activeMode = mode;
                    this.activeFilter = 'all'; // Reset filter

                    // Reload Data Source
                    await this.loadTimelineData();

                    this.renderToolbar(); // Re-render to update active state
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

        // Determine which entries to show based on pagination (incremental)
        const entriesToShow = this.paginationEnabled
            ? this.currentEntries.slice(0, this.visibleCount)
            : this.currentEntries;

        entriesToShow.forEach(entry => {
            const el = this.createEntryElement(entry);
            this.entriesContainer?.appendChild(el);
        });

        this.container?.appendChild(this.entriesContainer);

        // Add "Show More" button if there are more entries to load
        if (this.paginationEnabled && this.visibleCount < this.currentEntries.length) {
            this.renderPaginationControls();
        }

        // Re-apply spotlight if query exists
        if (this.searchQuery) this.applySpotlight();

        // Trigger Prism syntax highlight
        if (window.Prism) window.Prism.highlightAll();

        // Dispatch content update event (for ScrollAnimator)
        window.dispatchEvent(new CustomEvent('uv7-content-updated'));

        // Phase 1: Apply entrance animations to blog entries
        timelineAnimations.refresh();
        const items = Array.from(this.entriesContainer?.querySelectorAll('.blog-entry') || []) as HTMLElement[];
        if (items.length > 0) {
            timelineAnimations.animateItems(items, 100, 50);
        }

        // Phase 1: Enable ripple effects on toolbar buttons
        timelineAnimations.enableRippleForButtons('.timeline-btn');

        // Phase 1: Add click-to-highlight for blog entries
        items.forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                timelineAnimations.scrollToElement(item, 100);
            });
        });

        // Initialize crew navigation (filters + breadcrumbs)
        initCrewNavigation();

        // Phase 3: Refresh scrubber after timeline renders
        if (this.timelineScrubber) {
            this.timelineScrubber.refresh();
        }
    }

    private renderPaginationControls(): void {
        const remainingCount = this.currentEntries.length - this.visibleCount;

        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'timeline-pagination';
        paginationDiv.innerHTML = `
            <div class="pagination-info">
                Showing ${this.visibleCount} of ${this.currentEntries.length} entries
            </div>
            <div class="pagination-controls">
                <button class="pagination-btn" data-action="show-more">
                    Show ${Math.min(this.pageSize, remainingCount)} More
                </button>
                <button class="pagination-btn view-all" data-action="show-all">
                    Show All (${remainingCount} more)
                </button>
            </div>
        `;

        // Show More button - load next 3
        paginationDiv.querySelector('[data-action="show-more"]')?.addEventListener('click', () => {
            this.visibleCount += this.pageSize;
            this.renderTimeline();
        });

        // Show All button - disable pagination
        paginationDiv.querySelector('[data-action="show-all"]')?.addEventListener('click', () => {
            this.paginationEnabled = false;
            this.renderTimeline();
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
        const items = this.entriesContainer?.querySelectorAll('.blog-entry');

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

    /**
     * Estimate word count for reading time calculation
     */
    private estimateWordCount(entry: BlogEntry): number {
        let text = entry.title + ' ' + (entry.summary || '');
        if (entry.features) text += ' ' + entry.features.join(' ');
        if (entry.theTimeline) text += ' ' + entry.theTimeline.join(' ');
        if (entry.quote) text += ' ' + entry.quote;
        return text.split(/\s+/).length;
    }

    /**
     * Determine vibe indicator based on entry tags/type
     */
    private getVibeIndicator(entry: BlogEntry): { emoji: string; label: string } {
        const tags = entry.tags || [];
        const type = entry.type || '';

        // Check for specific keywords in title/summary
        const content = `${entry.title} ${entry.summary || ''}`.toLowerCase();

        if (content.includes('milestone') || content.includes('achievement') || content.includes('complete')) {
            return { emoji: '🎯', label: 'Milestone' };
        }
        if (content.includes('bug') || content.includes('fix') || content.includes('debug')) {
            return { emoji: '💀', label: 'Debug Hell' };
        }
        if (content.includes('refactor') || content.includes('clean')) {
            return { emoji: '✨', label: 'Clean Refactor' };
        }
        if (content.includes('experiment') || content.includes('trying') || tags.includes('v3-lab')) {
            return { emoji: '🤔', label: 'Experiment' };
        }
        if (type === 'breakthrough' || content.includes('breakthrough')) {
            return { emoji: '🔥', label: 'Breakthrough' };
        }

        // Default: Having fun
        return { emoji: '🎮', label: 'Having Fun' };
    }

    /**
     * Get icon for stat type
     */
    private getStatIcon(statKey: string): string {
        const icons: Record<string, string> = {
            linesAdded: '📊',
            linesChanged: '📝',
            filesChanged: '📁',
            testsAdded: '🧪',
            commits: '💾',
            duration: '⏱️'
        };
        return icons[statKey] || '📊';
    }

    /**
     * Get contributor signature/catchphrase
     */
    private getContributorSignature(modelId: string): string {
        const signatures: Record<string, string> = {
            dizee: '<em>Built with precision.</em> — DiZee',
            belle: '<em>Chef\'s kiss.</em> 💋 — Belle',
            tori: '<em>Zero regressions.</em> — Tori',
            genzee: '<em>Vibes are immaculate.</em> — Genzee'
        };
        return signatures[modelId] || '';
    }

    /**
     * Apply page theme based on active filter
     * Changes entire page color palette to match category
     */
    private applyPageTheme(filter: string): void {
        const body = document.body;

        // Remove all theme classes
        body.classList.remove('theme-v1', 'theme-v2', 'theme-shell', 'theme-chaos', 'theme-polish', 'theme-milestone');

        // Apply theme based on filter
        const themeMap: Record<string, string> = {
            'v1': 'theme-v1',
            'v2': 'theme-v2',
            'shell': 'theme-shell',
            'chaos': 'theme-chaos',
            'polish': 'theme-polish',
            'milestone': 'theme-milestone'
        };

        const themeClass = themeMap[filter.toLowerCase()];
        if (themeClass) {
            body.classList.add(themeClass);
            console.log(`🎨 [Timeline] Applied theme: ${themeClass}`);
        }
    }

    private createEntryElement(entry: BlogEntry): HTMLElement {
        const item = document.createElement('div');
        item.className = `blog-entry ${entry.type || ''}`;
        item.id = entry.id;
        if (entry.type) item.setAttribute('data-type', entry.type);
        if (entry.modelId) item.setAttribute('data-model-id', entry.modelId);

        const template = document.getElementById('timeline-card-template') as HTMLTemplateElement;
        // Fallback for safety (or tests)
        if (!template) {
            console.error('Timeline template missing');
            return item;
        }

        const fragment = template.content.cloneNode(true) as DocumentFragment;


        // --- Header & Metadata ---
        const authorInfo = fragment.querySelector('.blog-author-info')!;
        if (entry.modelId) {
            const names: Record<string, string> = { belle: 'Belle', dizee: 'DiZee', tori: 'Tori', genzee: 'Genzee' };
            const avatars: Record<string, string> = {
                belle: 'assets/trinity-iz-portrait.png',
                dizee: 'assets/dz-portrait.png',
                tori: 'assets/trinity-tori-portrait.png',
                genzee: 'assets/trinity-gz-portrait.png'
            };
            const avatarPath = avatars[entry.modelId];
            const authorName = names[entry.modelId] || entry.modelId;
            authorInfo.innerHTML = avatarPath
                ? `<img src="${avatarPath}" class="blog-avatar" alt="${authorName}" /><span class="blog-author-name">${authorName}</span>`
                : `<span class="blog-author-name">🤖 ${authorName}</span>`;
        }

        const metadata = fragment.querySelector('.blog-metadata')!;
        const wordCount = this.estimateWordCount(entry);
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));
        const vibe = this.getVibeIndicator(entry);

        let metaHTML = `<span class="blog-date">${entry.date}</span>`;
        if (entry.tags?.length) metaHTML += ` • <span class="blog-category">${entry.tags[0]}</span>`;
        metaHTML += ` • <span class="blog-reading-time">${readingTime} min read</span>`;
        metaHTML += ` • <span class="blog-vibe">${vibe.emoji} ${vibe.label}</span>`;
        metadata.innerHTML = metaHTML;

        // --- Title & Summary ---
        fragment.querySelector('.blog-title')!.innerHTML = `${entry.emoji || ''} ${entry.title}`.trim();
        const summaryEl = fragment.querySelector('.blog-summary')!;
        if (entry.summary) summaryEl.innerHTML = entry.summary;
        else summaryEl.remove();

        // --- Details Section ---
        const details = fragment.querySelector('.timeline-details')!;
        let hasDetails = false;

        // Helper to append generic HTML
        const addSection = (className: string, html: string) => {
            hasDetails = true;
            const div = document.createElement('div');
            div.className = className;
            div.innerHTML = html;
            details.appendChild(div);
        };

        if (entry.features) {
            hasDetails = true;
            const ul = document.createElement('ul');
            ul.className = 'update-list';
            entry.features.forEach(f => ul.innerHTML += `<li>${f}</li>`);
            details.appendChild(ul);
        }
        if (entry.theTimeline) {
            hasDetails = true;
            const div = document.createElement('div');
            div.className = 'timeline-subsection';
            div.innerHTML = '<h4 style="color: #888; margin-bottom: 0.5rem;">The Timeline:</h4><ul class="update-list">' +
                entry.theTimeline.map(t => `<li>${t}</li>`).join('') + '</ul>';
            details.appendChild(div);
        }
        if (entry.callout) {
            addSection('v2-improvement-callout', `
                <div class="callout-icon">${entry.callout.icon || '💡'}</div>
                <div class="callout-content"><strong>${entry.callout.title || 'Insight:'}</strong> ${entry.callout.text}</div>
            `);
        }
        if (entry.quote) addSection('timeline-entry-quote', `<blockquote>${entry.quote}</blockquote>`);

        if (entry.metrics) {
            hasDetails = true;
            const grid = document.createElement('div');
            grid.className = 'stats-mini-grid dev-only';
            grid.innerHTML = Object.entries(entry.metrics).map(([k, v]) => `
                <div class="stat-mini"><span class="stat-num">${v}</span><span class="stat-desc">${k.replace(/([A-Z])/g, ' $1').trim()}</span></div>
            `).join('');
            details.appendChild(grid);

            // Mini Stats Preview (collapsed view)
            const preview = fragment.querySelector('.blog-stats-preview')!;
            preview.innerHTML = Object.entries(entry.metrics).slice(0, 3).map(([k, v]) =>
                `<span class="stat-pill">${this.getStatIcon(k)} ${v}</span>`
            ).join('');
        }

        if (entry.scorecard) {
            const sc = entry.scorecard;
            addSection('v3-scorecard-container', `
                <h4 class="v3-score-title">🧪 Experiment Scorecard</h4>
                <div class="v3-score-grid">
                    <div class="v3-stat-item"><span class="v3-label">Creativity</span><span class="v3-value high">${sc.creativity}/10</span></div>
                    <div class="v3-stat-item"><span class="v3-label">Fun Factor</span><span class="v3-value">${sc.funFactor}/10</span></div>
                    <div class="v3-stat-item"><span class="v3-label">MSG Sensitivity</span><span class="v3-value">${sc.sensitivity}</span></div>
                    <div class="v3-stat-item"><span class="v3-label">Aggression</span><span class="v3-value">${sc.aggression}</span></div>
                    <div class="v3-stat-wide">
                        <span class="v3-tag adherence-${sc.adherence.toLowerCase()}">${sc.adherence} Adherence</span>
                        <span class="v3-tag velocity-${sc.velocity.toLowerCase()}">${sc.velocity} Velocity</span>
                    </div>
                </div>`);
        }
        if (entry.judgement) {
            const jd = entry.judgement;
            addSection(`v3-judgement-container verdict-${jd.verdict}`, `
                <div class="judge-stamp">${jd.verdict === 'understood' ? 'ASSIGNMENT UNDERSTOOD' : 'ROGUE AGENT'}</div>
                <div class="judge-notes"><span class="judge-icon">${jd.verdict === 'understood' ? '✅' : '❌'}</span><span class="judge-text">${jd.notes}</span></div>
            `);
        }
        if (entry.crewAttribution) {
            const ca = entry.crewAttribution;
            addSection('crew-attribution-block',
                `<h4 class="crew-title">🎬 Crew Contributions</h4><div class="crew-members">` +
                ca.systems.map(m => `<div class="crew-member-card"><span class="crew-icon">${m.icon}</span><div class="crew-info"><span class="crew-name">${m.name}</span><span class="crew-contribution">${m.contribution}</span></div></div>`).join('') +
                `</div>` + (ca.quote ? `<blockquote class="crew-quote">"${ca.quote}"</blockquote>` : '')
            );
        }
        if (entry.footer) addSection('entry-footer-badge', `<span class="footer-icon">${entry.footer.icon}</span> ${entry.footer.text}`);

        if (entry.modelId && hasDetails) {
            const sig = this.getContributorSignature(entry.modelId);
            if (sig) addSection('contributor-signature', sig);
        }

        // --- Interactions ---
        const btn = fragment.querySelector('.blog-read-more') as HTMLButtonElement;
        if (hasDetails) {
            btn.onclick = (e) => {
                e.stopPropagation();
                item.classList.toggle('expanded');
                btn.innerHTML = item.classList.contains('expanded') ? 'Show Less <span class="arrow">↑</span>' : 'Read More <span class="arrow">↓</span>';
            };
        } else {
            btn.remove();
        }

        // Expand entire card logic (Legacy behavior)
        item.onclick = (e) => {
            // Did we click a button or link?
            if ((e.target as HTMLElement).closest('button, a')) return;
            // Otherwise toggle expand
            if (!item.classList.contains('expanded')) btn.click();
        };

        item.appendChild(fragment);
        // Ensure Highlight Pulse effect still works if called via DeepLink
        // The original code returned 'item', which is the wrapper.
        return item;
    }


    /**
     * Refresh search index after timeline re-renders
     */
    private refreshSearchIndex(): void {
    if(this.timelineSearch) {
    this.timelineSearch.refreshIndex('.timeline-phases');
}
    }
}
