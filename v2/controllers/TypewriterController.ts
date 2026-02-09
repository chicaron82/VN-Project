import { EventBus } from '@core/EventBus';
import type { StateManager } from '@core/StateManager';
import { Logger } from '@utils/Logger';

/**
 * TypewriterController - Character-by-character text rendering
 * V1 Parity Port from typewriter-controller.js (389 lines)
 *
 * SOLID Refactor: Extracted from GameEngine
 *
 * Responsibilities:
 * - Character-by-character text rendering with requestAnimationFrame
 * - Mobile pagination (breaks long text into pages)
 * - Text speed control (instant, slow-motion, skip)
 * - Skip functionality
 * - Dialogue click handling
 *
 * ZEE'S ADDITION: Slow-motion reveal for emotional weight 🖤
 * DIZEE'S FIX: Auto-advance integration
 * TORI'S TIME MACHINE: Record snapshots for paginated dialogue 💚⏰
 *
 * 848 is sacred. 💚🔥💀
 */

interface TypewriterOptions {
    element: HTMLElement;
    text: string;
    callback?: () => void;
}

export class TypewriterController {
    private eventBus: EventBus;
    // @ts-expect-error - StateManager reserved for future use
    private _stateManager: StateManager | null;

    // Typewriter state
    public typewriterActive: boolean = false;
    public typewriterInterval: number | null = null; // Fallback
    private typewriterAnimationFrame: number | null = null;
    public typewriterCallback: (() => void) | null = null;
    public fullDialogueText: string = '';

    // Pagination state
    private paginationActive: boolean = false;
    private dialoguePages: string[] = [];
    private currentDialoguePage: number = 0;

    // Text speed settings (V1 Parity)
    private slowRevealActive: boolean = false;
    private skipActive: boolean = false;
    private textSpeed: 'instant' | 'fast' | 'normal' | 'slow' = 'normal';

    constructor(eventBus: EventBus, stateManager: StateManager | null = null) {
        this.eventBus = eventBus;
        this._stateManager = stateManager;

        // Load initial settings
        this.loadInitialSettings();

        // V1 Parity: Listen for settings changes
        this.eventBus.on('settings:changed', (data: { key: string; value: unknown }) => {
            if (data.key === 'textSpeed') {
                this.textSpeed = data.value as 'instant' | 'fast' | 'normal' | 'slow';
            }
        });

        Logger.ui('✅ TypewriterController initialized');
    }

    private loadInitialSettings() {
        try {
            const saved = localStorage.getItem('gameSettings');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.textSpeed) {
                    this.textSpeed = parsed.textSpeed;
                }
            }
        } catch (e) {
            Logger.warn('TypewriterController: Failed to load settings', e);
        }
    }

    // ========================================
    // TYPEWRITER SPEED
    // V1 Parity: typewriter-controller.js lines 42-66
    // ========================================

    /**
     * Get current typewriter speed in milliseconds
     * V1 Parity: Respects slow-motion, skip, and settings
     */
    private getSpeed(): number {
        // ZEE'S ADDITION: Slow-motion reveal for emotional weight 🖤
        // 5× slower than normal (150ms vs 30ms)
        if (this.slowRevealActive) {
            return 150;
        }

        // PRIORITY FIX: Instant should be instant, even if skipping
        // (Because 0ms is faster than skip speed of 5ms)
        if (this.textSpeed === 'instant') {
            return 0;
        }

        // SKIP OVERRIDE: Use 5ms when skipping (6x faster than normal)
        if (this.skipActive) {
            return 5;
        }

        // Get speed from settings
        const speedMultipliers: Record<string, number> = {
            instant: 0,     // 0ms = instant
            fast: 0.5,      // 15ms
            normal: 1,      // 30ms
            slow: 2         // 60ms
        };

        const multiplier = speedMultipliers[this.textSpeed] || 1;
        const delay = 30 * multiplier;
        const result = delay === 0 ? 0 : Math.max(1, delay);

        return result;
    }

    // ========================================
    // PAGINATION SYSTEM
    // V1 Parity: typewriter-controller.js lines 72-227
    // ========================================

    /**
     * Check if text should be paginated
     * V1 Parity: Only paginate on mobile portrait
     */
    private shouldPaginate(textLength: number): boolean {
        // Only paginate on mobile portrait
        if (window.innerWidth > 480) return false;
        if (window.innerHeight < window.innerWidth) return false; // Landscape - no pagination

        // LOWERED THRESHOLD: 150 chars instead of 200 for tighter control
        // This ensures dialogue box never grows too tall on mobile portrait
        return textLength > 150;
    }

    /**
     * Paginate and display text
     * V1 Parity: lines 82-91
     */
    private paginateAndDisplay(element: HTMLElement, text: string, callback?: () => void): void {
        // Split text into pages that fit in mobile dialogue box
        this.dialoguePages = this.splitTextIntoPages(text, 150);
        this.currentDialoguePage = 0;
        this.paginationActive = true;
        this.typewriterCallback = callback || null;

        // Display first page
        this.displayPage(element);
    }

    /**
     * Split text into pages
     * V1 Parity: lines 93-122
     */
    private splitTextIntoPages(text: string, charsPerPage: number): string[] {
        const pages: string[] = [];
        let remainingText = text;

        while (remainingText.length > 0) {
            if (remainingText.length <= charsPerPage) {
                pages.push(remainingText);
                break;
            }

            let breakPoint = charsPerPage;

            // Look for sentence end within last 50 chars
            const sentenceEnd = remainingText.substring(0, charsPerPage).lastIndexOf('. ');
            if (sentenceEnd > charsPerPage - 50) {
                breakPoint = sentenceEnd + 2;
            } else {
                // Look for word boundary
                const lastSpace = remainingText.substring(0, charsPerPage).lastIndexOf(' ');
                if (lastSpace > charsPerPage - 30) {
                    breakPoint = lastSpace + 1;
                }
            }

            pages.push(remainingText.substring(0, breakPoint).trim());
            remainingText = remainingText.substring(breakPoint).trim();
        }

        return pages;
    }

    /**
     * Display current page with typewriter effect
     * V1 Parity: lines 124-207
     */
    private displayPage(element: HTMLElement): void {
        const currentPage = this.dialoguePages[this.currentDialoguePage] || '';
        if (!currentPage) {
            Logger.warn('No current page to display');
            return;
        }
        const speed = this.getSpeed();

        // Add page indicator for multi-page dialogue
        const pageIndicator = (this.dialoguePages.length > 1)
            ? ` [${this.currentDialoguePage + 1}/${this.dialoguePages.length}]`
            : '';

        // Check if instant mode
        if (speed === 0) {
            // Instant mode - show all text immediately
            element.textContent = currentPage + (this.dialoguePages.length > 1 ? pageIndicator : '');
            this.typewriterActive = false;

            // DIZEE FIX: Start auto-advance timer in instant mode too
            // Note: Auto-advance handled by game engine
            return;
        }

        // Typewriter the current page using requestAnimationFrame for smoother performance
        this.typewriterActive = true;
        this.fullDialogueText = currentPage;
        element.textContent = '';
        let i = 0;
        let lastFrameTime = performance.now();

        // Clear any existing interval (fallback)
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }

        // Use requestAnimationFrame for smoother rendering
        const typeNextChar = (currentTime: number) => {
            const elapsed = currentTime - lastFrameTime;

            // Only type next character if enough time has passed
            if (elapsed >= speed) {
                if (i < currentPage.length) {
                    element.textContent += currentPage.charAt(i);
                    i++;
                    lastFrameTime = currentTime;
                }

                // Check if typing is complete
                if (i >= currentPage.length) {
                    // Add page indicator when typing finishes
                    if (this.dialoguePages.length > 1) {
                        element.textContent += pageIndicator;
                    }

                    this.typewriterActive = false;

                    // ZEERAH'S FIX: Start auto-advance timer after typewriter finishes
                    // Note: Auto-advance handled by game engine
                    return; // Stop animation
                }
            }

            // Continue animation
            if (this.typewriterActive) {
                this.typewriterAnimationFrame = requestAnimationFrame(typeNextChar);
            }
        };

        // Start the animation
        this.typewriterAnimationFrame = requestAnimationFrame(typeNextChar);
    }

    /**
     * Show next page
     * V1 Parity: lines 209-227
     */
    private showNextPage(element: HTMLElement): void {
        this.currentDialoguePage++;

        if (this.currentDialoguePage >= this.dialoguePages.length) {
            // All pages shown - advance to next scene
            this.paginationActive = false;
            // Game engine will handle advancement
        } else {
            // Show next page
            this.displayPage(element);

            // TORI'S TIME MACHINE: Record snapshot for paginated dialogue 💚⏰
            // Game engine will handle time machine snapshots
        }
    }

    // ========================================
    // SKIP FUNCTIONALITY
    // V1 Parity: typewriter-controller.js lines 233-266
    // ========================================

    /**
     * Skip to full text
     * V1 Parity: Cancels animation and shows full text
     */
    public skip(element: HTMLElement): void {
        // Clear typewriter interval (fallback for old code)
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }

        // Cancel animation frame
        if (this.typewriterAnimationFrame) {
            cancelAnimationFrame(this.typewriterAnimationFrame);
            this.typewriterAnimationFrame = null;
        }

        if (this.paginationActive) {
            // Show current page fully with indicator
            const currentPage = this.dialoguePages[this.currentDialoguePage];
            const pageIndicator = (this.dialoguePages.length > 1)
                ? ` [${this.currentDialoguePage + 1}/${this.dialoguePages.length}]`
                : '';
            element.textContent = currentPage + pageIndicator;
        } else {
            // Show full text
            element.textContent = this.fullDialogueText;
        }

        this.typewriterActive = false;

        // Execute callback if exists
        if (this.typewriterCallback) {
            this.typewriterCallback();
            this.typewriterCallback = null;
        }
    }

    // ========================================
    // DIALOGUE INTERACTION
    // V1 Parity: typewriter-controller.js lines 272-295
    // ========================================

    /**
     * Handle dialogue click
     * V1 Parity: Skip if typing, next page if paginating, advance if done
     */
    public handleClick(element: HTMLElement): void {
        // DIZEE: Haptic feedback for dialogue interaction
        if (navigator.vibrate) navigator.vibrate(10);
        this.eventBus.emit('visual:cue', { type: 'buttonPress', channel: 'ui' });

        // DIZEE FIX: Cancel auto-advance timer when user manually clicks
        // Game engine will handle this

        // If pagination is active, show next page
        if (this.paginationActive && !this.typewriterActive) {
            this.showNextPage(element);
            return;
        }

        // If typing is active, skip to full text
        if (this.typewriterActive) {
            this.skip(element);
        }
        // If text is fully displayed, advance to next scene
        else {
            // Return true to signal game engine to advance
            // Game engine will handle the actual advancement
        }
    }

    // ========================================
    // PUBLIC API
    // ========================================

    /**
     * Start typewriter effect
     * V1 Parity: Entry point for text display
     */
    public start(options: TypewriterOptions): void {
        const { element, text, callback } = options;

        // Clear any existing typewriter
        this.stop();

        // Store callback
        this.typewriterCallback = callback || null;

        // Check if pagination is needed
        if (this.shouldPaginate(text.length)) {
            this.paginateAndDisplay(element, text, callback);
        } else {
            // Display full text with typewriter
            this.paginationActive = false;
            this.fullDialogueText = text;
            this.dialoguePages = [text];
            this.currentDialoguePage = 0;
            this.displayPage(element);
        }
    }

    /**
     * Stop typewriter effect
     */
    public stop(): void {
        // Cancel animation frame
        if (this.typewriterAnimationFrame) {
            cancelAnimationFrame(this.typewriterAnimationFrame);
            this.typewriterAnimationFrame = null;
        }

        // Clear interval (fallback)
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }

        this.typewriterActive = false;
        this.typewriterCallback = null;
    }

    /**
     * Set slow reveal mode
     * ZEE'S ADDITION: 5× slower for emotional weight 🖤
     */
    public setSlowReveal(active: boolean): void {
        this.slowRevealActive = active;
    }

    /**
     * Set skip mode
     */
    public setSkipMode(active: boolean): void {
        this.skipActive = active;
    }

    // ========================================
    // STATE ACCESSORS
    // V1 Parity: typewriter-controller.js lines 301-307
    // ========================================

    /**
     * Check if typewriter is active
     */
    public isActive(): boolean {
        return this.typewriterActive;
    }

    /**
     * Check if pagination is active
     */
    public isPaginating(): boolean {
        return this.paginationActive;
    }

    /**
     * Get current page number (1-indexed)
     */
    public getCurrentPage(): number {
        return this.currentDialoguePage + 1;
    }

    /**
     * Get total pages
     */
    public getTotalPages(): number {
        return this.dialoguePages.length;
    }

    // ========================================
    // CLEANUP
    // V1 Parity: typewriter-controller.js lines 317-336
    // ========================================

    /**
     * Clean up intervals and animation frames to prevent memory leaks
     * Call this when destroying the controller or transitioning scenes
     */
    public destroy(): void {
        // Clear typewriter interval (fallback)
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }

        // Cancel animation frame
        if (this.typewriterAnimationFrame) {
            cancelAnimationFrame(this.typewriterAnimationFrame);
            this.typewriterAnimationFrame = null;
        }

        // Reset state
        this.typewriterActive = false;
        this.typewriterCallback = null;
        this.paginationActive = false;
        this.dialoguePages = [];
        this.currentDialoguePage = 0;

        Logger.ui('🗑️ TypewriterController destroyed');
    }
}
