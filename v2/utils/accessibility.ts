/**
 * ════════════════════════════════════════════════════════════════
 * ACCESSIBILITY MANAGER - V2 Port
 * Phase 22a: Accessibility Enhancements
 *
 * V1 Parity: system/accessibility.js (135 lines → ~180 lines)
 *
 * Purpose:
 * - Reduce motion toggle for accessibility
 * - Keyboard navigation for choice menus
 * - System preference detection
 * - Persistent settings via localStorage
 *
 * Features:
 * - Reduce motion CSS class toggle
 * - Arrow key navigation through choices
 * - Number key (1-9) quick select
 * - Tab key navigation with Shift modifier
 * - Enter key to confirm selection
 * - Auto-reset focus on choice change
 *
 * V1 Parity Notes:
 * - All keyboard shortcuts preserved
 * - Focus management logic identical
 * - Motion preference detection unchanged
 * - localStorage keys unchanged
 *
 * DIZEE POLISH: Making UV7 accessible to all players 💚
 * ════════════════════════════════════════════════════════════════
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

interface GameReference {
    state?: {
        get(key: string): any;
        set(key: string, value: any): void;
    };
}

export class AccessibilityManager {
    private reduceMotion: boolean = false;
    private currentFocusedChoiceIndex: number = -1;
    private observer: MutationObserver | null = null;

    constructor(_game?: GameReference) {
        this.init();
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    private init(): void {
        // Check for system preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Load saved setting or use system preference
        const savedSetting = localStorage.getItem('reduceMotion');
        this.reduceMotion = savedSetting !== null ? savedSetting === 'true' : prefersReducedMotion;

        // Apply initial state
        this.applyReduceMotion();

        // Bind reduce motion toggle
        const reduceMotionToggle = document.getElementById('reduce-motion-toggle') as HTMLInputElement;
        if (reduceMotionToggle) {
            reduceMotionToggle.checked = this.reduceMotion;
            reduceMotionToggle.addEventListener('change', (e: Event) => {
                const target = e.target as HTMLInputElement;
                this.reduceMotion = target.checked;
                localStorage.setItem('reduceMotion', String(this.reduceMotion));
                this.applyReduceMotion();
            });
        }

        // Setup keyboard navigation for choices
        this.setupKeyboardNavigation();
    }

    // ========================================
    // REDUCE MOTION
    // ========================================

    private applyReduceMotion(): void {
        if (this.reduceMotion) {
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }
    }

    // ========================================
    // KEYBOARD NAVIGATION
    // ========================================

    private setupKeyboardNavigation(): void {
        // Listen for keyboard events on document
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            const choicesContainer = document.getElementById('choices-container');
            if (!choicesContainer || choicesContainer.children.length === 0) {
                return; // No choices visible - don't interfere with Tab
            }

            const choices = Array.from(choicesContainer.querySelectorAll('.choice-button')) as HTMLElement[];
            if (choices.length === 0) return;

            // Number keys 1-9 for quick select
            if (e.key >= '1' && e.key <= '9') {
                const index = parseInt(e.key) - 1;
                if (index < choices.length) {
                    e.preventDefault();
                    choices[index]?.click();
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
                choices[this.currentFocusedChoiceIndex]?.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.currentFocusedChoiceIndex = this.currentFocusedChoiceIndex <= 0
                    ? choices.length - 1
                    : this.currentFocusedChoiceIndex - 1;
                choices[this.currentFocusedChoiceIndex]?.focus();
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
                choices[this.currentFocusedChoiceIndex]?.focus();
            }
            // Enter to select
            else if (e.key === 'Enter' && this.currentFocusedChoiceIndex >= 0) {
                e.preventDefault();
                choices[this.currentFocusedChoiceIndex]?.click();
            }
        });

        // Reset focus index when choices change
        this.observer = new MutationObserver(() => {
            this.currentFocusedChoiceIndex = -1;
        });

        const choicesContainer = document.getElementById('choices-container');
        if (choicesContainer) {
            this.observer.observe(choicesContainer, { childList: true });
        }
    }

    // ========================================
    // PUBLIC GETTERS
    // ========================================

    public getReduceMotion(): boolean {
        return this.reduceMotion;
    }
}

// ========================================
// BROWSER GLOBALS & AUTO-INIT
// ========================================

// Global assignment for V1 compatibility
if (typeof window !== 'undefined') {
    (window as any).AccessibilityManager = AccessibilityManager;

    window.addEventListener('DOMContentLoaded', () => {
        // Wait for game to be initialized
        const checkGame = setInterval(() => {
            const game = (window as any).game;
            if (game) {
                (window as any).accessibilityManager = new AccessibilityManager(game);
                clearInterval(checkGame);
            }
        }, 100);
    });
}
