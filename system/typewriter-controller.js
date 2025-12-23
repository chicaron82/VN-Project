// ========================================
// TYPEWRITER CONTROLLER
// Text rendering, pagination, and dialogue display
// SOLID Refactor: Extracted from GameEngine
// ========================================

/**
 * TypewriterController
 * 
 * Manages text rendering, typewriter effects, pagination, and dialogue flow.
 * 
 * Responsibilities:
 * - Character-by-character text rendering
 * - Mobile pagination (breaks long text into pages)
 * - Text speed control
 * - Skip functionality
 * - Dialogue click handling
 * 
 * @class TypewriterController
 */
class TypewriterController {
    constructor(game) {
        this.game = game;

        // Typewriter state
        this.typewriterActive = false;
        this.typewriterInterval = null;
        this.typewriterCallback = null;
        this.fullDialogueText = '';

        // Pagination state
        this.paginationActive = false;
        this.dialoguePages = [];
        this.currentDialoguePage = 0;
    }

    // ========================================
    // TYPEWRITER SPEED
    // ========================================

    getSpeed() {
        // ZEE'S ADDITION: Slow-motion reveal for emotional weight 🖤
        // 5× slower than normal (150ms vs 30ms)
        if (this.game.slowRevealActive) {
            return 150;
        }

        // SKIP OVERRIDE: Use 5ms when skipping (6x faster than normal)
        if (this.game.skipActive) {
            return 5;
        }

        // Get speed from settings manager
        if (!this.game.settingsManager) {
            console.log('No settingsManager, returning default 30');
            return 30;
        }

        const speed = this.game.settingsManager.settings.textSpeed;
        const multiplier = this.game.settingsManager.speedMultipliers[speed];
        const delay = 30 * multiplier;
        const result = delay === 0 ? 0 : Math.max(1, delay);

        return result;
    }

    // ========================================
    // PAGINATION SYSTEM
    // ========================================

    shouldPaginate(textLength) {
        // Only paginate on mobile portrait
        if (window.innerWidth > 480) return false;
        if (window.innerHeight < window.innerWidth) return false; // Landscape - no pagination

        // LOWERED THRESHOLD: 150 chars instead of 200 for tighter control
        // This ensures dialogue box never grows too tall on mobile portrait
        return textLength > 150;
    }

    paginateAndDisplay(element, text, callback) {
        // Split text into pages that fit in mobile dialogue box
        this.dialoguePages = this.splitTextIntoPages(text, 150);
        this.currentDialoguePage = 0;
        this.paginationActive = true;
        this.typewriterCallback = callback;

        // Display first page
        this.displayPage(element);
    }

    splitTextIntoPages(text, charsPerPage) {
        const pages = [];
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

    displayPage(element) {
        const currentPage = this.dialoguePages[this.currentDialoguePage];
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
            if (this.game.settingsManager) {
                this.game.settingsManager.startAutoAdvance(() => {
                    // Auto-advance to next dialogue
                    if (!this.game.choiceMenu || this.game.choiceMenu.style.display === 'none') {
                        this.game.advance();
                    }
                });
            }

            return;
        }

        // Typewriter the current page
        this.typewriterActive = true;
        this.fullDialogueText = currentPage;
        element.textContent = '';
        let i = 0;

        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
        }

        this.typewriterInterval = setInterval(() => {
            if (i < currentPage.length) {
                element.textContent += currentPage.charAt(i);
                i++;
            } else {
                // Add page indicator when typing finishes
                if (this.dialoguePages.length > 1) {
                    element.textContent += pageIndicator;
                }

                clearInterval(this.typewriterInterval);
                this.typewriterInterval = null;
                this.typewriterActive = false;

                // ZEERAH'S FIX: Start auto-advance timer after typewriter finishes
                if (this.game.settingsManager) {
                    this.game.settingsManager.startAutoAdvance(() => {
                        // Auto-advance to next dialogue
                        if (!this.game.choiceMenu || this.game.choiceMenu.style.display === 'none') {
                            this.game.advance();
                        }
                    });
                }
            }
        }, speed);
    }

    showNextPage() {
        this.currentDialoguePage++;

        if (this.currentDialoguePage >= this.dialoguePages.length) {
            // All pages shown - advance to next scene
            this.paginationActive = false;
            this.game.advance();
        } else {
            // Show next page
            this.displayPage(this.game.dialogueText);

            // TORI'S TIME MACHINE: Record snapshot for paginated dialogue 💚⏰
            if (this.game.timeMachine) {
                const position = this.game.getScenePosition();
                const label = `${position.currentSceneId} (page ${this.currentDialoguePage + 1})`;
                this.game.timeMachine.addCurrentState(label);
            }
        }
    }

    // ========================================
    // SKIP FUNCTIONALITY
    // ========================================

    skip() {
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
        }

        if (this.paginationActive) {
            // Show current page fully with indicator
            const currentPage = this.dialoguePages[this.currentDialoguePage];
            const pageIndicator = (this.dialoguePages.length > 1)
                ? ` [${this.currentDialoguePage + 1}/${this.dialoguePages.length}]`
                : '';
            this.game.dialogueText.textContent = currentPage + pageIndicator;
        } else {
            // Show full text
            this.game.dialogueText.textContent = this.fullDialogueText;
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
    // ========================================

    handleClick() {
        // DIZEE: Haptic feedback for dialogue interaction
        this.game.triggerSensoryFeedback('buttonPress', null, 'Dialogue advance');

        // DIZEE FIX: Cancel auto-advance timer when user manually clicks
        if (this.game.settingsManager) {
            this.game.settingsManager.cancelAutoAdvance();
        }

        // If pagination is active, show next page
        if (this.paginationActive && !this.typewriterActive) {
            this.showNextPage();
            return;
        }

        // If typing is active, skip to full text
        if (this.typewriterActive) {
            this.skip();
        }
        // If text is fully displayed, advance to next scene
        else {
            this.game.advance();
        }
    }

    // ========================================
    // STATE ACCESSORS
    // ========================================

    isActive() {
        return this.typewriterActive;
    }

    isPaginating() {
        return this.paginationActive;
    }
}
