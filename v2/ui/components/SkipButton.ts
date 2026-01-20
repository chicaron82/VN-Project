/**
 * SkipButton - Skip Mode Toggle Component
 *
 * Floating button for toggling skip mode on read text.
 * Features:
 * - Toggle button: "SKIP" when off, ">> SKIP" when active
 * - Visual glow effect when skipping
 * - Keyboard shortcuts: Ctrl (hold) or S (toggle)
 * - Only shows when there's skippable (read) content
 * - Route-specific color theming
 */

import type { EventBus } from '../../core/EventBus';
import type { DialogController } from '../../controllers/DialogController';

export interface SkipButtonConfig {
    /** Position relative to dialog box */
    position?: 'top-right' | 'top-left' | 'bottom-right';
    /** Show keyboard shortcut hint */
    showShortcutHint?: boolean;
}

export class SkipButton {
    private element: HTMLButtonElement | null = null;
    private eventBus: EventBus;
    private dialogController: DialogController | null = null;
    private _config: Required<SkipButtonConfig>;
    private unsubscribers: (() => void)[] = [];
    private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
    private keyupHandler: ((e: KeyboardEvent) => void) | null = null;
    private isCtrlHeld: boolean = false;

    constructor(eventBus: EventBus, config: SkipButtonConfig = {}) {
        this.eventBus = eventBus;
        this._config = {
            position: config.position ?? 'top-right',
            showShortcutHint: config.showShortcutHint ?? true
        };

        this.init();
    }

    /**
     * Get configuration (for external access if needed)
     */
    getConfig(): Required<SkipButtonConfig> {
        return { ...this._config };
    }

    /**
     * Connect to DialogController for skip state management
     */
    setDialogController(controller: DialogController): void {
        this.dialogController = controller;
        this.updateVisibility();
        this.updateState();
    }

    /**
     * Initialize the button and event listeners
     */
    private init(): void {
        this.createElement();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
    }

    /**
     * Create the button DOM element
     */
    private createElement(): void {
        // Check if element already exists
        const existing = document.getElementById('skip-button-v2');
        if (existing) {
            this.element = existing as HTMLButtonElement;
            return;
        }

        this.element = document.createElement('button');
        this.element.id = 'skip-button-v2';
        this.element.className = 'skip-button';
        this.element.setAttribute('aria-label', 'Toggle skip mode for read text');
        this.element.setAttribute('aria-pressed', 'false');

        // Initial content
        this.updateButtonContent(false);

        // Click handler
        this.element.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });

        // Initially hidden until we know skip is unlocked
        this.element.style.display = 'none';
    }

    /**
     * Update button text/icon based on active state
     */
    private updateButtonContent(isActive: boolean): void {
        if (!this.element) return;

        if (isActive) {
            this.element.innerHTML = '<span class="skip-icon">>></span> SKIP';
            this.element.classList.add('active');
            this.element.setAttribute('aria-pressed', 'true');
        } else {
            this.element.innerHTML = 'SKIP';
            this.element.classList.remove('active');
            this.element.setAttribute('aria-pressed', 'false');
        }
    }

    /**
     * Setup EventBus listeners
     */
    private setupEventListeners(): void {
        // Listen for skip state changes
        const unsubActive = this.eventBus.on('skip:active', (data) => {
            this.updateButtonContent(data.isSkipping);
        });
        this.unsubscribers.push(unsubActive);

        // Listen for scene changes to update visibility
        const unsubScene = this.eventBus.on('scene:load', () => {
            this.updateVisibility();
        });
        this.unsubscribers.push(unsubScene);

        // Listen for dialog completion to update visibility
        const unsubComplete = this.eventBus.on('dialog:complete', () => {
            this.updateVisibility();
        });
        this.unsubscribers.push(unsubComplete);

        // Listen for route changes to update color theme
        const unsubRoute = this.eventBus.on('ui:route_changed', (data) => {
            this.updateRouteTheme(data.route);
        });
        this.unsubscribers.push(unsubRoute);
    }

    /**
     * Setup keyboard shortcuts (Ctrl hold, S toggle)
     */
    private setupKeyboardShortcuts(): void {
        this.keydownHandler = (e: KeyboardEvent) => {
            // Ignore if typing in input fields
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return;
            }

            // S key: Toggle skip
            if (e.code === 'KeyS' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                this.toggle();
                return;
            }

            // Ctrl key: Hold to skip
            if ((e.key === 'Control' || e.code === 'ControlLeft' || e.code === 'ControlRight') && !this.isCtrlHeld) {
                this.isCtrlHeld = true;

                // Only activate if skip is unlocked
                if (this.dialogController?.isSkipUnlocked()) {
                    e.preventDefault();
                    this.eventBus.emit('skip:activate', {});

                    // Add visual feedback
                    this.element?.classList.add('ctrl-held');
                }
            }
        };

        this.keyupHandler = (e: KeyboardEvent) => {
            // Ctrl key release: Stop hold-to-skip
            if (e.key === 'Control' || e.code === 'ControlLeft' || e.code === 'ControlRight') {
                if (this.isCtrlHeld && this.element?.classList.contains('ctrl-held')) {
                    this.isCtrlHeld = false;
                    this.eventBus.emit('skip:deactivate', {});
                    this.element?.classList.remove('ctrl-held');
                }
                this.isCtrlHeld = false;
            }
        };

        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
    }

    /**
     * Toggle skip mode
     */
    private toggle(): void {
        if (!this.dialogController?.isSkipUnlocked()) {
            console.log('[SkipButton] Skip not unlocked yet');
            return;
        }

        this.eventBus.emit('skip:toggle', {});
    }

    /**
     * Update button visibility based on skip unlock status and read content
     */
    updateVisibility(): void {
        if (!this.element) return;

        const isUnlocked = this.dialogController?.isSkipUnlocked() ?? false;
        // Note: hasReadContent can be used for more restrictive visibility
        // const hasReadContent = this.dialogController?.hasReadContent() ?? false;

        // Show button if skip is unlocked (V1 behavior: always show when unlocked)
        // More restrictive: only show if there's read content
        // For now, match V1: show when unlocked
        if (isUnlocked) {
            this.element.style.display = 'flex';
        } else {
            this.element.style.display = 'none';
        }
    }

    /**
     * Update button state from DialogController
     */
    updateState(): void {
        if (!this.element || !this.dialogController) return;

        const state = this.dialogController.getSkipState();
        this.updateButtonContent(state.isSkipping);
    }

    /**
     * Update color theme based on current route
     */
    private updateRouteTheme(route: string): void {
        if (!this.element) return;

        // Remove existing route classes
        this.element.classList.remove('route-ronnie', 'route-tori');

        // Add current route class
        if (route === 'ronnie') {
            this.element.classList.add('route-ronnie');
        } else if (route === 'tori') {
            this.element.classList.add('route-tori');
        }
    }

    /**
     * Mount the button to the DOM
     * @param container - Container element (usually the dialog box or game container)
     */
    mount(container?: HTMLElement): void {
        if (!this.element) return;

        const target = container ?? document.body;

        // Avoid duplicate mounting
        if (this.element.parentNode) {
            return;
        }

        target.appendChild(this.element);
        this.updateVisibility();
    }

    /**
     * Show the button
     */
    show(): void {
        if (this.element && this.dialogController?.isSkipUnlocked()) {
            this.element.style.display = 'flex';
        }
    }

    /**
     * Hide the button
     */
    hide(): void {
        if (this.element) {
            this.element.style.display = 'none';
        }
    }

    /**
     * Get the DOM element
     */
    getElement(): HTMLButtonElement | null {
        return this.element;
    }

    /**
     * Cleanup and destroy
     */
    destroy(): void {
        // Unsubscribe from events
        this.unsubscribers.forEach(unsub => unsub());
        this.unsubscribers = [];

        // Remove keyboard listeners
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
        }
        if (this.keyupHandler) {
            document.removeEventListener('keyup', this.keyupHandler);
        }

        // Remove element from DOM
        if (this.element && this.element.parentNode) {
            this.element.remove();
        }

        this.element = null;
        this.dialogController = null;

        console.log('[SkipButton] Destroyed');
    }
}
