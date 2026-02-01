/**
 * ═══════════════════════════════════════════════════════════════
 * TIMELINE SCRUBBER
 *
 * Phase 3: Visual overview with draggable navigation handle
 * Part of MAXIMUM MICHELIN timeline enhancements
 *
 * Features:
 * - Color-coded segments for each timeline entry
 * - Draggable handle synced with scroll position
 * - Click segments to jump to entry
 * - Tooltip showing current entry title
 * - Smooth animations and transitions
 *
 * Credit: ZeeRah's Chaos 😈
 * 848 is sacred. 💚🔥💀
 * ═══════════════════════════════════════════════════════════════
 */

import { timelineAnimations } from './TimelineAnimations';

export interface ScrubberEntry {
    id: string;
    date: string;
    type: string;
    title: string;
    element: HTMLElement;
}

export class TimelineScrubber {
    private container: HTMLElement | null;
    private scrollContainer: HTMLElement | null;
    private scrubberEl: HTMLElement | null;
    private handle: HTMLElement | null;
    private tooltip: HTMLElement | null;
    private segments: HTMLElement | null;
    private track: HTMLElement | null;
    private entries: ScrubberEntry[];
    private isDragging: boolean = false;
    private animationFrame: number | null = null;

    constructor(
        containerSelector: string = '#timeline-container'
    ) {
        this.container = document.querySelector(containerSelector);
        // Find the actual scrolling container (Journey panel)
        this.scrollContainer = document.querySelector('[data-panel="journey"]') as HTMLElement;
        this.entries = [];
        this.scrubberEl = null;
        this.handle = null;
        this.tooltip = null;
        this.segments = null;
        this.track = null;

        this.init();
    }

    /**
     * Initialize scrubber
     */
    private init(): void {
        // Create scrubber HTML
        this.createScrubber();

        // Collect entries from DOM
        this.collectEntries();

        // Render segments
        this.renderSegments();

        // Attach event handlers
        this.attachHandlers();

        console.log('🎯 [TimelineScrubber] Initialized with', this.entries.length, 'entries');
    }

    /**
     * Create scrubber HTML structure
     */
    private createScrubber(): void {
        const scrubber = document.createElement('div');
        scrubber.className = 'timeline-scrubber';
        scrubber.innerHTML = `
            <div class="scrubber-label">Timeline Overview</div>
            <div class="scrubber-track">
                <div class="scrubber-segments"></div>
                <div class="scrubber-handle">
                    <div class="handle-indicator"></div>
                    <div class="handle-tooltip"></div>
                </div>
            </div>
            <div class="scrubber-legend">
                <span class="legend-start">Start</span>
                <span class="legend-end">End</span>
            </div>
        `;

        // Insert INSIDE the toolbar (filters), effectively merging them
        const toolbar = this.container?.querySelector('.timeline-toolbar-container');
        if (toolbar) {
            // Append to toolbar so they stick together as one unit
            toolbar.appendChild(scrubber);
            // Add a class to toolbar to indicate it now has a footer
            toolbar.classList.add('has-scrubber');
        } else {
            // Fallback: insert at the beginning if toolbar not found
            this.container?.insertBefore(scrubber, this.container.firstChild);
        }

        // Cache elements
        this.scrubberEl = scrubber;
        this.handle = scrubber.querySelector('.scrubber-handle');
        this.tooltip = scrubber.querySelector('.handle-tooltip');
        this.segments = scrubber.querySelector('.scrubber-segments');
        this.track = scrubber.querySelector('.scrubber-track');
    }

    /**
     * Collect timeline entries from DOM
     */
    private collectEntries(): void {
        const items = document.querySelectorAll('.timeline-item');
        this.entries = Array.from(items).map(item => {
            const el = item as HTMLElement;
            return {
                id: el.id || '',
                date: el.querySelector('h3')?.textContent || '',
                type: el.dataset.type || '',
                title: el.querySelector('strong')?.textContent || '',
                element: el
            };
        });
    }

    /**
     * Render color-coded segments
     */
    private renderSegments(): void {
        if (!this.segments) return;

        this.segments.innerHTML = '';

        this.entries.forEach((entry, index) => {
            const segment = document.createElement('div');
            segment.className = 'scrubber-segment';
            segment.style.width = `${100 / this.entries.length}%`;

            // Set category for color
            segment.dataset.category = entry.type;
            segment.dataset.index = index.toString();
            segment.dataset.entryId = entry.id;
            segment.title = entry.title; // Native tooltip

            // Click to jump
            segment.addEventListener('click', () => {
                this.jumpToEntry(index);
            });

            if (this.segments) {
                this.segments.appendChild(segment);
            }
        });

        console.log('🎨 [TimelineScrubber] Rendered', this.entries.length, 'segments');
    }

    /**
     * Attach event handlers
     */
    private attachHandlers(): void {
        if (!this.handle || !this.track) return;

        // Mouse events for dragging
        this.handle.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));

        // Touch events for mobile
        this.handle.addEventListener('touchstart', this.startDrag.bind(this), { passive: false });
        document.addEventListener('touchmove', this.drag.bind(this), { passive: false });
        document.addEventListener('touchend', this.endDrag.bind(this));

        // Click track to jump
        this.track.addEventListener('click', this.clickTrack.bind(this));

        // Update handle on scroll - use panel scroll, not window
        if (this.scrollContainer) {
            this.scrollContainer.addEventListener('scroll', this.updateHandlePosition.bind(this), { passive: true });
        }

        // Initial position
        this.updateHandlePosition();
    }

    /**
     * Start dragging handle
     */
    private startDrag(e: MouseEvent | TouchEvent): void {
        e.preventDefault();
        this.isDragging = true;
        this.handle?.classList.add('dragging');
    }

    /**
     * Drag handle
     */
    private drag(e: MouseEvent | TouchEvent): void {
        if (!this.isDragging || !this.track || !this.handle || !this.scrollContainer) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const rect = this.track.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));

        // Update handle position
        this.handle.style.transform = `translateX(${percentage * rect.width}px)`;

        // Calculate which entry we're at
        const index = Math.floor(percentage * this.entries.length);
        const entry = this.entries[index];

        if (entry) {
            // Update tooltip
            if (this.tooltip) {
                this.tooltip.textContent = entry.title;
            }

            // Scroll to entry within the panel container
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
            }

            this.animationFrame = requestAnimationFrame(() => {
                // Get entry position relative to scroll container
                const entryRect = entry.element.getBoundingClientRect();
                const containerRect = this.scrollContainer!.getBoundingClientRect();
                const scrollOffset = entryRect.top - containerRect.top + this.scrollContainer!.scrollTop - 100;
                
                this.scrollContainer!.scrollTo({
                    top: scrollOffset,
                    behavior: 'auto'
                });
            });
        }
    }

    /**
     * End dragging
     */
    private endDrag(): void {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.handle?.classList.remove('dragging');
    }

    /**
     * Click track to jump
     */
    private clickTrack(e: MouseEvent): void {
        // Ignore if clicking on handle
        if ((e.target as HTMLElement).closest('.scrubber-handle')) return;

        if (!this.track) return;

        const rect = this.track.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        const index = Math.floor(percentage * this.entries.length);

        this.jumpToEntry(index);
    }

    /**
     * Update handle position based on scroll
     */
    private updateHandlePosition(): void {
        if (this.isDragging || !this.handle || !this.track || !this.scrollContainer) return;

        const scrollTop = this.scrollContainer.scrollTop;
        const scrollHeight = this.scrollContainer.scrollHeight - this.scrollContainer.clientHeight;
        const scrollPercentage = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

        const rect = this.track.getBoundingClientRect();
        this.handle.style.transform = `translateX(${scrollPercentage * rect.width}px)`;

        // Update tooltip with current entry
        const index = Math.floor(scrollPercentage * this.entries.length);
        const entry = this.entries[index];
        if (entry && this.tooltip) {
            this.tooltip.textContent = entry.title;
        }
    }

    /**
     * Jump to specific entry
     */
    private jumpToEntry(index: number): void {
        const entry = this.entries[index];
        if (!entry || !this.scrollContainer) return;

        console.log('🎯 [TimelineScrubber] Jumping to entry:', entry.title);

        // Scroll to entry within panel container
        const entryRect = entry.element.getBoundingClientRect();
        const containerRect = this.scrollContainer.getBoundingClientRect();
        const scrollOffset = entryRect.top - containerRect.top + this.scrollContainer.scrollTop - 100;
        
        this.scrollContainer.scrollTo({
            top: scrollOffset,
            behavior: 'smooth'
        });
    }

    /**
     * Refresh scrubber (call after timeline re-renders)
     */
    refresh(): void {
        this.collectEntries();
        this.renderSegments();
        this.updateHandlePosition();
        console.log('🔄 [TimelineScrubber] Refreshed');
    }

    /**
     * Destroy scrubber
     */
    destroy(): void {
        this.scrubberEl?.remove();
        if (this.scrollContainer) {
            this.scrollContainer.removeEventListener('scroll', this.updateHandlePosition.bind(this));
        }
        console.log('💥 [TimelineScrubber] Destroyed');
    }
}

/**
 * Built with love. "Always. Always. Always." - Storm Dragon
 */
