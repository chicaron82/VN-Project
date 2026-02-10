import type { EventBus } from '@core/EventBus';
import { Logger } from '@utils/Logger';

/**
 * ════════════════════════════════════════════════════════════════
 * ACCESSIBILITY MANAGER - V2 Port
 * Phase 22a: WCAG 2.1 AA Compliance
 *
 * V1 Parity: accessibility-manager.js (280 lines → ~360 lines)
 *
 * Purpose:
 * - Screen reader support (ARIA labels, live regions)
 * - Keyboard navigation for all interactive elements
 * - User preference detection (reduced motion, high contrast)
 * - Adjustable text size
 * - Sprite and background change announcements
 *
 * Features:
 * - createLiveRegion(): ARIA live region for screen reader announcements
 * - announce(): Announce message to screen reader
 * - announceDialogue/Choice/Scene(): Context-specific announcements
 * - setupARIALabels(): Label all interactive elements
 * - detectUserPreferences(): prefers-reduced-motion, prefers-contrast
 * - setTextSize(): Adjustable text sizing (0.85x to 1.3x)
 * - toggleHighContrast(): High contrast mode toggle
 * - setupKeyboardNav(): Tab navigation support
 *
 * V1 Parity Notes:
 * - All ARIA attributes preserved exactly
 * - Console logging format identical (♿ emoji prefix)
 * - localStorage keys match V1
 * - Text size multipliers identical
 *
 * ♿ "Inclusive by design. Accessible by default."
 * ════════════════════════════════════════════════════════════════
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface GameInstance {
    // Game instance reference (if needed for future integration)
}

export interface AccessibilityStatus {
    textSize: number;
    highContrast: boolean;
    reducedMotion: boolean;
    screenReaderActive: boolean;
}

export type TextSize = 'small' | 'medium' | 'large' | 'x-large';
export type AnnouncePriority = 'polite' | 'assertive';

export class AccessibilityManager {
    // @ts-expect-error - Reserved for future game state integration
    private game: GameInstance;
    private liveRegion: HTMLElement | null;
    private textSizeMultiplier: number;
    private highContrastMode: boolean;
    private reducedMotion: boolean;
    // @ts-expect-error - Reserved for future EventBus integration
    private eventBus: EventBus;

    constructor(game: GameInstance, eventBus: EventBus) {
        this.game = game;
        this.eventBus = eventBus;
        this.liveRegion = null;
        this.textSizeMultiplier = 1.0;
        this.highContrastMode = false;
        this.reducedMotion = false;

        this.init();
    }

    // ========================================
    // INITIALIZATION
    // V1 Parity: accessibility-manager.js lines 33-40
    // ========================================

    private init(): void {
        this.createLiveRegion();
        this.setupARIALabels();
        this.detectUserPreferences();
        this.setupKeyboardNav();
        this.loadTextSizePreference();
        Logger.system('♿ Accessibility Manager initialized');
    }

    // ========================================
    // LIVE REGION (Screen Reader Announcements)
    // V1 Parity: accessibility-manager.js lines 46-79
    // ========================================

    /**
     * Create ARIA live region for screen reader announcements.
     * V1 Parity: Exact attribute names and values preserved
     */
    private createLiveRegion(): void {
        this.liveRegion = document.createElement('div');
        this.liveRegion.id = 'aria-live-region';
        this.liveRegion.setAttribute('role', 'status');
        this.liveRegion.setAttribute('aria-live', 'polite');
        this.liveRegion.setAttribute('aria-atomic', 'true');
        this.liveRegion.className = 'sr-only'; // Screen reader only
        document.body.appendChild(this.liveRegion);
    }

    /**
     * Announce message to screen reader.
     * V1 Parity: accessibility-manager.js lines 56-66
     */
    public announce(message: string, priority: AnnouncePriority = 'polite'): void {
        if (!this.liveRegion) return;

        this.liveRegion.setAttribute('aria-live', priority);
        this.liveRegion.textContent = message;

        // Clear after announcement
        setTimeout(() => {
            if (this.liveRegion) {
                this.liveRegion.textContent = '';
            }
        }, 1000);
    }

    /**
     * Announce dialogue line to screen reader.
     * V1 Parity: accessibility-manager.js lines 68-71
     */
    public announceDialogue(character: string | null, text: string): void {
        const message = character ? `${character}: ${text}` : text;
        this.announce(message);
    }

    /**
     * Announce choice to screen reader.
     * V1 Parity: accessibility-manager.js lines 73-75
     */
    public announceChoice(choiceText: string, index: number, total: number): void {
        this.announce(`Choice ${index} of ${total}: ${choiceText}`);
    }

    /**
     * Announce scene change to screen reader.
     * V1 Parity: accessibility-manager.js lines 77-79
     */
    public announceScene(sceneName: string): void {
        this.announce(`Scene changed to ${sceneName}`);
    }

    // ========================================
    // ARIA LABELS
    // V1 Parity: accessibility-manager.js lines 85-145
    // ========================================

    /**
     * Setup ARIA labels for all interactive elements.
     * V1 Parity: Exact logic preserved
     */
    private setupARIALabels(): void {
        // Add labels to all interactive elements
        this.labelButtons();
        this.labelInputs();
        this.labelMenus();
    }

    private labelButtons(): void {
        // Dialogue box
        const dialogueBox = document.getElementById('dialogue-box');
        if (dialogueBox) {
            dialogueBox.setAttribute('role', 'article');
            dialogueBox.setAttribute('aria-label', 'Dialogue');
        }

        // Choices
        const choicesContainer = document.getElementById('choices-container');
        if (choicesContainer) {
            choicesContainer.setAttribute('role', 'menu');
            choicesContainer.setAttribute('aria-label', 'Story choices');
        }

        // Auto-advance toggle
        const autoBtn = document.getElementById('auto-btn');
        if (autoBtn) {
            autoBtn.setAttribute('aria-label', 'Toggle auto-advance');
            autoBtn.setAttribute('aria-pressed', 'false');
        }

        // Skip button
        const skipBtn = document.getElementById('skip-btn');
        if (skipBtn) {
            skipBtn.setAttribute('aria-label', 'Skip dialogue');
        }
    }

    private labelInputs(): void {
        // Save slots
        document.querySelectorAll('.save-slot').forEach((slot, index) => {
            slot.setAttribute('role', 'button');
            slot.setAttribute('aria-label', `Save slot ${index + 1}`);
        });
    }

    private labelMenus(): void {
        // Pause menu
        const pauseMenu = document.getElementById('pause-menu');
        if (pauseMenu) {
            pauseMenu.setAttribute('role', 'dialog');
            pauseMenu.setAttribute('aria-label', 'Pause menu');
            pauseMenu.setAttribute('aria-modal', 'true');
        }

        // Settings menu
        const settingsMenu = document.getElementById('settings-menu');
        if (settingsMenu) {
            settingsMenu.setAttribute('role', 'dialog');
            settingsMenu.setAttribute('aria-label', 'Settings');
            settingsMenu.setAttribute('aria-modal', 'true');
        }
    }

    // ========================================
    // USER PREFERENCES
    // V1 Parity: accessibility-manager.js lines 151-180
    // ========================================

    /**
     * Detect user preferences from media queries.
     * V1 Parity: Exact logic preserved
     */
    private detectUserPreferences(): void {
        // Detect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.reducedMotion = prefersReducedMotion.matches;

        if (this.reducedMotion) {
            document.body.classList.add('reduce-motion');
            Logger.system('♿ Reduced motion enabled');
        }

        // Listen for changes
        prefersReducedMotion.addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            document.body.classList.toggle('reduce-motion', e.matches);
        });

        // Detect prefers-contrast
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
        this.highContrastMode = prefersHighContrast.matches;

        if (this.highContrastMode) {
            document.body.classList.add('high-contrast');
            Logger.system('♿ High contrast mode enabled');
        }

        prefersHighContrast.addEventListener('change', (e) => {
            this.highContrastMode = e.matches;
            document.body.classList.toggle('high-contrast', e.matches);
        });
    }

    // ========================================
    // TEXT SIZE
    // V1 Parity: accessibility-manager.js lines 186-208
    // ========================================

    /**
     * Set text size multiplier.
     * V1 Parity: accessibility-manager.js lines 186-201
     */
    public setTextSize(size: TextSize): void {
        // size: 'small', 'medium', 'large', 'x-large'
        const multipliers: Record<TextSize, number> = {
            small: 0.85,
            medium: 1.0,
            large: 1.15,
            'x-large': 1.3,
        };

        this.textSizeMultiplier = multipliers[size] || 1.0;
        document.documentElement.style.setProperty('--text-size-multiplier', String(this.textSizeMultiplier));

        // Save preference
        localStorage.setItem('accessibility_textSize', size);
        Logger.system(`♿ Text size set to ${size} (${this.textSizeMultiplier}x)`);
    }

    private loadTextSizePreference(): void {
        const saved = localStorage.getItem('accessibility_textSize');
        if (saved) {
            this.setTextSize(saved as TextSize);
        }
    }

    // ========================================
    // HIGH CONTRAST MODE
    // V1 Parity: accessibility-manager.js lines 214-223
    // ========================================

    /**
     * Toggle high contrast mode.
     * V1 Parity: Exact logic preserved
     */
    public toggleHighContrast(): boolean {
        this.highContrastMode = !this.highContrastMode;
        document.body.classList.toggle('high-contrast', this.highContrastMode);

        // Save preference
        localStorage.setItem('accessibility_highContrast', String(this.highContrastMode));
        Logger.system(`♿ High contrast mode ${this.highContrastMode ? 'enabled' : 'disabled'}`);

        return this.highContrastMode;
    }

    // ========================================
    // KEYBOARD NAVIGATION
    // V1 Parity: accessibility-manager.js lines 229-243
    // ========================================

    /**
     * Setup keyboard navigation for choices.
     * V1 Parity: Exact logic preserved
     */
    private setupKeyboardNav(): void {
        // Tab through choices
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const choices = document.querySelectorAll('.choice-btn:not([disabled])');
                if (choices.length > 0) {
                    // Let browser handle tab navigation
                    // Just ensure choices are focusable
                    choices.forEach((choice) => {
                        choice.setAttribute('tabindex', '0');
                    });
                }
            }
        });
    }

    // ========================================
    // SPRITE DESCRIPTIONS
    // V1 Parity: accessibility-manager.js lines 249-256
    // ========================================

    /**
     * Announce sprite change to screen reader.
     * V1 Parity: accessibility-manager.js lines 249-252
     */
    public describeSpriteChange(spriteName: string, emotion: string | null): void {
        const description = `${spriteName} appears ${emotion || 'on screen'}`;
        this.announce(description);
    }

    /**
     * Announce background change to screen reader.
     * V1 Parity: accessibility-manager.js lines 254-256
     */
    public describeBackground(backgroundName: string): void {
        this.announce(`Background changed to ${backgroundName}`);
    }

    // ========================================
    // PUBLIC API
    // V1 Parity: accessibility-manager.js lines 262-269
    // ========================================

    /**
     * Get current accessibility status.
     * V1 Parity: Exact return structure preserved
     */
    public getStatus(): AccessibilityStatus {
        return {
            textSize: this.textSizeMultiplier,
            highContrast: this.highContrastMode,
            reducedMotion: this.reducedMotion,
            screenReaderActive: this.liveRegion !== null,
        };
    }
}
