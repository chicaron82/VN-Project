/**
 * UV7OS TIMELINE - SHOWCASE ENTRY TRACKING
 *
 * Detects currently visible timeline entry, manages view mode (dev/story),
 * and persists scroll position across sessions.
 *
 * Showcase-specific module, not instantiated in landing context.
 *
 * "Track the journey, remember the path." - The Timeline
 */

import type { UV7OSElements } from './UV7OSElements';
import type { TimelineEntry } from '../UV7OSConfig';

export class UV7OSTimeline {
    private currentEntry: string | null = null;
    private scrollListener?: () => void;

    constructor(
        private elements: UV7OSElements,
        private entries: TimelineEntry[]
    ) {}

    /**
     * Detect which timeline entry is currently in viewport
     */
    detectCurrentEntry(): void {
        // Find which entry is currently in viewport
        const entryElements = Array.from(document.querySelectorAll('.timeline-item'));
        for (const el of entryElements) {
            const rect = el.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
                this.currentEntry = el.id;
                return;
            }
        }

        // Default to first entry if none detected
        const firstEntry = this.entries[0];
        if (firstEntry) {
            this.currentEntry = firstEntry.id;
        }
    }

    /**
     * Detect current view mode (dev vs story)
     * Syncs between localStorage, body attribute, and toggle input
     */
    detectCurrentMode(): void {
        // Check body data-view-mode attribute OR localStorage
        const storedMode = localStorage.getItem('uv7-dev-mode');
        const body = document.body;

        if (storedMode) {
            // Sync body if needed
            if (body.dataset.viewMode !== storedMode) {
                body.dataset.viewMode = storedMode;

                // If there's a view toggle input, sync it too
                const viewToggle = this.elements.viewToggle as HTMLInputElement;
                if (viewToggle && viewToggle.type === 'checkbox') {
                    viewToggle.checked = (storedMode === 'dev');
                }
            }
        }
    }

    /**
     * Start scroll listener to track current entry
     * Debounced to avoid performance issues
     */
    startScrollListener(): void {
        let scrollTimeout: number;

        this.scrollListener = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = window.setTimeout(() => {
                const oldEntry = this.currentEntry;
                this.detectCurrentEntry();

                // Save state if entry changed
                if (oldEntry !== this.currentEntry && this.currentEntry) {
                    this.saveState(this.currentEntry);
                }
            }, 200);
        };

        window.addEventListener('scroll', this.scrollListener, { passive: true });
    }

    /**
     * Save current entry to sessionStorage
     */
    saveState(entryId: string): void {
        sessionStorage.setItem('uv7-showcase-entry', entryId);
    }

    /**
     * Restore scroll position from sessionStorage
     * Called on page load
     */
    restoreState(): void {
        const savedEntry = sessionStorage.getItem('uv7-showcase-entry');
        if (savedEntry) {
            // Scroll to saved entry after a brief delay
            setTimeout(() => {
                const element = document.getElementById(savedEntry);
                if (element) {
                    const yOffset = -44; // Status bar height
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 500);
        }
    }

    /**
     * Get current entry ID
     */
    getCurrentEntry(): string | null {
        return this.currentEntry;
    }

    /**
     * Cleanup (remove scroll listener)
     */
    cleanup(): void {
        if (this.scrollListener) {
            window.removeEventListener('scroll', this.scrollListener);
        }
    }
}
