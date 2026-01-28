/**
 * ═══════════════════════════════════════════════════════════════
 * TIMELINE KEYBOARD NAVIGATION
 *
 * Phase 5: Keyboard shortcuts for power users
 * Part of MAXIMUM MICHELIN timeline enhancements
 *
 * Shortcuts:
 * - j/k: Next/previous entry
 * - /: Focus search
 * - Esc: Clear search/filters
 * - ?: Show keyboard shortcuts overlay
 * - 1-9: Jump to category (future)
 *
 * Credit: ZeeRah's Chaos 😈
 * 848 is sacred. 💚🔥💀
 * ═══════════════════════════════════════════════════════════════
 */

export interface KeyboardShortcut {
    key: string;
    description: string;
    action: () => void;
}

export class TimelineKeyboardNav {
    private shortcuts: Map<string, KeyboardShortcut>;
    private currentEntryIndex: number;
    private entries: HTMLElement[];
    private searchInput: HTMLInputElement | null;
    private helpOverlay: HTMLElement | null;

    constructor(
        timelineSelector: string = '.timeline',
        searchInputSelector: string = '#timeline-search'
    ) {
        this.shortcuts = new Map();
        this.currentEntryIndex = 0;
        this.entries = [];
        this.searchInput = document.querySelector(searchInputSelector);
        this.helpOverlay = null;

        // Index timeline entries
        this.indexEntries(timelineSelector);

        // Register shortcuts
        this.registerShortcuts();

        // Attach event listener
        this.attachKeyboardListener();

        // Create help overlay
        this.createHelpOverlay();

        console.log('⌨️ [TimelineKeyboardNav] Initialized with', this.entries.length, 'entries');
    }

    /**
     * Index all timeline entries
     */
    private indexEntries(timelineSelector: string): void {
        const timeline = document.querySelector(timelineSelector);
        if (!timeline) return;

        const items = timeline.querySelectorAll('.timeline-item');
        this.entries = Array.from(items) as HTMLElement[];
    }

    /**
     * Register keyboard shortcuts
     */
    private registerShortcuts(): void {
        // j - Next entry
        this.shortcuts.set('j', {
            key: 'j',
            description: 'Next entry',
            action: () => this.nextEntry()
        });

        // k - Previous entry
        this.shortcuts.set('k', {
            key: 'k',
            description: 'Previous entry',
            action: () => this.previousEntry()
        });

        // / - Focus search
        this.shortcuts.set('/', {
            key: '/',
            description: 'Focus search',
            action: () => this.focusSearch()
        });

        // Escape - Clear search/filters
        this.shortcuts.set('Escape', {
            key: 'Esc',
            description: 'Clear search/filters',
            action: () => this.clearSearch()
        });

        // ? - Show help
        this.shortcuts.set('?', {
            key: '?',
            description: 'Show keyboard shortcuts',
            action: () => this.toggleHelp()
        });
    }

    /**
     * Attach keyboard event listener
     */
    private attachKeyboardListener(): void {
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts if user is typing in an input
            if (e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement) {
                // Allow Escape to blur input
                if (e.key === 'Escape') {
                    (e.target as HTMLElement).blur();
                    this.clearSearch();
                }
                return;
            }

            // Check for registered shortcuts
            const shortcut = this.shortcuts.get(e.key);
            if (shortcut) {
                e.preventDefault();
                shortcut.action();
            }
        });
    }

    /**
     * Navigate to next entry
     */
    private nextEntry(): void {
        if (this.entries.length === 0) return;

        this.currentEntryIndex = Math.min(
            this.currentEntryIndex + 1,
            this.entries.length - 1
        );

        this.scrollToCurrentEntry();
    }

    /**
     * Navigate to previous entry
     */
    private previousEntry(): void {
        if (this.entries.length === 0) return;

        this.currentEntryIndex = Math.max(
            this.currentEntryIndex - 1,
            0
        );

        this.scrollToCurrentEntry();
    }

    /**
     * Scroll to current entry
     */
    private scrollToCurrentEntry(): void {
        const entry = this.entries[this.currentEntryIndex];
        if (!entry) return;

        entry.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Highlight effect
        entry.classList.add('highlight-pulse');
        setTimeout(() => {
            entry.classList.remove('highlight-pulse');
        }, 2000);

        console.log('⌨️ [KeyboardNav] Navigated to entry', this.currentEntryIndex + 1, '/', this.entries.length);
    }

    /**
     * Focus search input
     */
    private focusSearch(): void {
        if (this.searchInput) {
            this.searchInput.focus();
            console.log('⌨️ [KeyboardNav] Search focused');
        }
    }

    /**
     * Clear search and filters
     */
    private clearSearch(): void {
        if (this.searchInput) {
            this.searchInput.value = '';
            this.searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('⌨️ [KeyboardNav] Search cleared');
        }
    }

    /**
     * Create help overlay
     */
    private createHelpOverlay(): void {
        this.helpOverlay = document.createElement('div');
        this.helpOverlay.className = 'keyboard-shortcuts-overlay';
        this.helpOverlay.innerHTML = `
            <div class="shortcuts-modal">
                <div class="shortcuts-header">
                    <h3>⌨️ Keyboard Shortcuts</h3>
                    <button class="shortcuts-close" aria-label="Close">×</button>
                </div>
                <div class="shortcuts-list">
                    ${Array.from(this.shortcuts.values()).map(shortcut => `
                        <div class="shortcut-item">
                            <kbd>${shortcut.key}</kbd>
                            <span>${shortcut.description}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="shortcuts-footer">
                    Press <kbd>?</kbd> to toggle this help
                </div>
            </div>
        `;

        // Close button
        const closeBtn = this.helpOverlay.querySelector('.shortcuts-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideHelp());
        }

        // Click outside to close
        this.helpOverlay.addEventListener('click', (e) => {
            if (e.target === this.helpOverlay) {
                this.hideHelp();
            }
        });

        document.body.appendChild(this.helpOverlay);
    }

    /**
     * Toggle help overlay
     */
    private toggleHelp(): void {
        if (this.helpOverlay?.classList.contains('visible')) {
            this.hideHelp();
        } else {
            this.showHelp();
        }
    }

    /**
     * Show help overlay
     */
    private showHelp(): void {
        if (this.helpOverlay) {
            this.helpOverlay.classList.add('visible');
            console.log('⌨️ [KeyboardNav] Help shown');
        }
    }

    /**
     * Hide help overlay
     */
    private hideHelp(): void {
        if (this.helpOverlay) {
            this.helpOverlay.classList.remove('visible');
            console.log('⌨️ [KeyboardNav] Help hidden');
        }
    }

    /**
     * Update entry index when user manually scrolls
     */
    public updateCurrentEntry(entryId: string): void {
        const index = this.entries.findIndex(e => e.dataset.id === entryId);
        if (index !== -1) {
            this.currentEntryIndex = index;
        }
    }
}
