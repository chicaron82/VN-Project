/**
 * TIMELINE RENDERER - MICHELIN EDITION 🍽️
 * Handles rendering, filtering, sorting, and spotlight search for project timeline.
 *
 * Converted to TypeScript ES module for Vite integration.
 * Phase 1: Integrated with BlogAnimations for smooth transitions
 * Phase 2: Integrated with TimelineStats for category dashboard
 */

import { TIMELINE_DATA, type BlogEntry } from '../../data/blog';
import { timelineAnimations } from './BlogAnimations';
import { FunMetricsDashboard } from './FunMetricsDashboard';
import { createEntryElement } from './EntryCardBuilder';
import { Logger } from '@utils/Logger';

export class BlogRenderer {
    private container: HTMLElement | null;
    private originalEntries: BlogEntry[];
    private currentEntries: BlogEntry[];

    // Pagination (incremental "Show More" style)
    private pageSize: number; // How many to load per click
    private visibleCount: number; // How many are currently visible
    private paginationEnabled: boolean;

    // Cache DOM elements
    private statsContainer: HTMLElement | null;
    private entriesContainer: HTMLElement | null;

    // Phase 2: Stats dashboard
    private funMetricsDashboard: FunMetricsDashboard | null;

    // Signal Animation
    private signalPulse: HTMLElement | null;
    private scrollTimeout?: number;

    constructor(containerSelector: string) {
        this.container = document.querySelector(containerSelector);
        this.originalEntries = [];
        this.currentEntries = [];

        // Pagination (incremental "Show More" style)
        this.pageSize = 3; // Load 3 more each time
        this.visibleCount = 3; // Start with 3 visible
        this.paginationEnabled = true; // Enabled by default

        // Cache DOM elements
        this.statsContainer = null;
        this.entriesContainer = null;

        // Phase 2: Stats dashboard
        this.funMetricsDashboard = null;

        // Signal Animation
        this.signalPulse = null;

        this.init();
    }

    async init(): Promise<void> {
        if (!this.container) return;

        // Inject Signal Track
        this.createSignalTrack();

        // Load Data
        await this.loadTimelineData();

        // Phase 2: Render Stats Dashboard
        this.renderStatsContainer();

        this.renderTimeline();

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
        Logger.ui('🍽️ Timeline interactions initialized');
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

        Logger.ui('📊 [Phase 2] Fun Stats dashboard rendered');
    }



    private async loadTimelineData(): Promise<void> {
        this.originalEntries = TIMELINE_DATA.entries;

        // Set Sort Date if missing (fallback to ID or index)
        this.originalEntries.forEach((entry, index) => {
            if (!entry.sortDate) {
                entry.sortDate = `2026-01-01T${index}`;
            }
        });

        this.applyLogic();
        Logger.ui('📜 Loaded Project History');
    }

    // --- CORE LOGIC ---

    private applyLogic(): void {
        // Filter out V3 lab entries (project history only)
        const filtered = this.originalEntries
            .filter(p => !p.isV3Entry)
            .sort((a, b) => (b.sortDate || '').localeCompare(a.sortDate || ''));

        this.currentEntries = filtered;
    }

    // --- RENDERING ---

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

        // Add click-to-highlight for blog entries
        items.forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                timelineAnimations.scrollToElement(item, 100);
            });
        });
    }

    private loadMoreEntries(): void {
        const previousCount = this.visibleCount - this.pageSize;
        const newEntries = this.currentEntries.slice(previousCount, this.visibleCount);

        // Append new entries to existing container (no re-render!)
        newEntries.forEach(entry => {
            const el = this.createEntryElement(entry);
            this.entriesContainer?.appendChild(el);
        });

        // Update pagination controls
        this.container?.querySelector('.timeline-pagination')?.remove();
        if (this.paginationEnabled && this.visibleCount < this.currentEntries.length) {
            this.renderPaginationControls();
        }

        // Apply animations to new entries only
        const items = Array.from(this.entriesContainer?.querySelectorAll('.blog-entry') || []) as HTMLElement[];
        const newItems = items.slice(previousCount);
        if (newItems.length > 0) {
            timelineAnimations.animateItems(newItems, 100, 50);
        }

        // Add click handlers to new entries
        newItems.forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                timelineAnimations.scrollToElement(item, 100);
            });
        });

        // Trigger Prism syntax highlight for new content
        if (window.Prism) window.Prism.highlightAll();
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

        // Show More button - load next 3 WITHOUT re-rendering
        paginationDiv.querySelector('[data-action="show-more"]')?.addEventListener('click', () => {
            this.visibleCount += this.pageSize;
            this.loadMoreEntries(); // Use new method instead of renderTimeline()
        });

        // Show All button - disable pagination
        paginationDiv.querySelector('[data-action="show-all"]')?.addEventListener('click', () => {
            this.paginationEnabled = false;
            this.renderTimeline();
        });

        this.container?.appendChild(paginationDiv);
    }

    // --- CARD CREATION (delegated to EntryCardBuilder) ---

    private createEntryElement(entry: BlogEntry): HTMLElement {
        return createEntryElement(entry);
    }
}
