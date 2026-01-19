// ========================================
// DIZEE POLISH: ACCESSIBILITY ENHANCEMENTS
// ========================================

class AccessibilityManager {
    constructor(game) {
        this.game = game;
        this.reduceMotion = false;
        this.currentFocusedChoiceIndex = -1;

        this.init();
    }

    init() {
        // Check for system preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Load saved setting or use system preference
        const savedSetting = localStorage.getItem('reduceMotion');
        this.reduceMotion = savedSetting !== null ? savedSetting === 'true' : prefersReducedMotion;

        // Apply initial state
        this.applyReduceMotion();

        // Bind reduce motion toggle
        const reduceMotionToggle = document.getElementById('reduce-motion-toggle');
        if (reduceMotionToggle) {
            reduceMotionToggle.checked = this.reduceMotion;
            reduceMotionToggle.addEventListener('change', (e) => {
                this.reduceMotion = e.target.checked;
                localStorage.setItem('reduceMotion', this.reduceMotion);
                this.applyReduceMotion();
            });
        }

        // Setup keyboard navigation for choices
        this.setupKeyboardNavigation();
    }

    applyReduceMotion() {
        if (this.reduceMotion) {
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }
    }

    setupKeyboardNavigation() {
        // Listen for keyboard events on document
        document.addEventListener('keydown', (e) => {
            const choicesContainer = document.getElementById('choices-container');
            if (!choicesContainer || choicesContainer.children.length === 0) {
                return; // No choices visible - don't interfere with Tab
            }

            const choices = Array.from(choicesContainer.querySelectorAll('.choice-button'));
            if (choices.length === 0) return;

            // Number keys 1-9 for quick select
            if (e.key >= '1' && e.key <= '9') {
                const index = parseInt(e.key) - 1;
                if (index < choices.length) {
                    e.preventDefault();
                    choices[index].click();
                    return;
                }
            }

            // ONLY handle Tab/Arrow keys if we're focused on a choice or if choices are visible
            const isFocusedOnChoice = document.activeElement && document.activeElement.classList.contains('choice-button');
            const isChoiceMenuVisible = choicesContainer.style.display !== 'none' && choices.length > 0;

            if (!isChoiceMenuVisible && !isFocusedOnChoice) {
                return; // Don't interfere with normal Tab navigation
            }

            // Arrow keys for navigation
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.currentFocusedChoiceIndex = (this.currentFocusedChoiceIndex + 1) % choices.length;
                choices[this.currentFocusedChoiceIndex].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.currentFocusedChoiceIndex = this.currentFocusedChoiceIndex <= 0
                    ? choices.length - 1
                    : this.currentFocusedChoiceIndex - 1;
                choices[this.currentFocusedChoiceIndex].focus();
            }
            // Tab only when already focused on a choice
            else if (e.key === 'Tab' && isFocusedOnChoice) {
                e.preventDefault();
                if (e.shiftKey) {
                    this.currentFocusedChoiceIndex = this.currentFocusedChoiceIndex <= 0
                        ? choices.length - 1
                        : this.currentFocusedChoiceIndex - 1;
                } else {
                    this.currentFocusedChoiceIndex = (this.currentFocusedChoiceIndex + 1) % choices.length;
                }
                choices[this.currentFocusedChoiceIndex].focus();
            }
            // Enter to select
            else if (e.key === 'Enter' && this.currentFocusedChoiceIndex >= 0) {
                e.preventDefault();
                choices[this.currentFocusedChoiceIndex].click();
            }
        });

        // Reset focus index when choices change
        const observer = new MutationObserver(() => {
            this.currentFocusedChoiceIndex = -1;
        });

        const choicesContainer = document.getElementById('choices-container');
        if (choicesContainer) {
            observer.observe(choicesContainer, { childList: true });
        }
    }
}

// Initialize when game engine is ready
if (typeof window !== 'undefined') {
    window.AccessibilityManager = AccessibilityManager;
    window.addEventListener('DOMContentLoaded', () => {
        // Wait for game to be initialized
        const checkGame = setInterval(() => {
            if (window.game) {
                window.accessibilityManager = new AccessibilityManager(window.game);
                clearInterval(checkGame);
            }
        }, 100);
    });
}

// ES Module export
export { AccessibilityManager };
