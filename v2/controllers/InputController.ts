import type { EventBus } from '../core/EventBus';
import type { SaveSystem } from '../systems/SaveSystem';
import { GameConfig } from '../core/GameConfig';
import type { DialogController } from './DialogController';
import type { DialogBubble } from '../ui/components/DialogBubble';
import { Logger } from '../utils/Logger';

/**
 * InputController - Keyboard shortcuts and user input handling
 *
 * Extracted from main.ts setupEventHandlers() (~150 lines)
 *
 * Handles:
 * - F5/F9 quick save/load
 * - Space/Enter dialog advance
 * - Haptic feedback for UI interactions
 * - Keyboard shortcuts
 */

export class InputController {
    private eventBus: EventBus;
    private saveSystem: SaveSystem;
    private dialogController: DialogController;
    private dialogBubble: DialogBubble;
    private isPausedGetter: () => boolean;

    constructor(
        eventBus: EventBus,
        saveSystem: SaveSystem,
        dialogController: DialogController,
        dialogBubble: DialogBubble,
        isPausedGetter: () => boolean
    ) {
        this.eventBus = eventBus;
        this.saveSystem = saveSystem;
        this.dialogController = dialogController;
        this.dialogBubble = dialogBubble;
        this.isPausedGetter = isPausedGetter;
    }

    /**
     * Setup all input handlers
     */
    public setup(): void {
        this.setupQuickSaveLoad();
        this.setupDialogAdvance();
        this.setupHapticFeedback();
    }

    /**
     * F5/F9 quick save/load handlers
     */
    private setupQuickSaveLoad(): void {
        document.addEventListener('keydown', (e) => {
            // Quick Save (F5)
            if (e.key === 'F5') {
                e.preventDefault();
                const slot = GameConfig.SAVE.QUICKSAVE_SLOT || 9;
                this.saveSystem.saveGame(slot, 'Quick Save').then((success) => {
                    if (success) {
                        this.eventBus.emit('notification:show', {
                            id: 'quick-save',
                            title: 'QUICK SAVE',
                            message: 'Timeline preserved',
                            icon: '💾',
                            category: 'autosave',
                            priority: 'normal',
                            duration: 2000,
                        });
                    } else {
                        this.eventBus.emit('notification:show', {
                            id: 'save-error',
                            title: 'ERROR',
                            message: 'Save failed',
                            icon: '❌',
                            category: 'system',
                            priority: 'high',
                        });
                    }
                });
            }

            // Quick Load (F9)
            if (e.key === 'F9') {
                e.preventDefault();
                const slot = GameConfig.SAVE.QUICKSAVE_SLOT || 9;
                if (this.saveSystem.hasSlot(slot)) {
                    this.saveSystem.loadGame(slot).then((success) => {
                        if (success) {
                            this.eventBus.emit('notification:show', {
                                id: 'quick-load',
                                title: 'QUICK LOAD',
                                message: 'Timeline restored',
                                icon: '🔄',
                                category: 'system',
                                priority: 'normal',
                                duration: 2000,
                            });
                        }
                    });
                } else {
                    this.eventBus.emit('notification:show', {
                        id: 'no-save',
                        title: 'NO SAVE',
                        message: 'No quick save found',
                        icon: '⚠️',
                        category: 'system',
                        priority: 'normal',
                    });
                }
            }
        });
    }

    /**
     * Space/Enter dialog advance handlers
     */
    private setupDialogAdvance(): void {
        document.addEventListener('keydown', (e) => {
            // Guard: Ignore if typing in an input field (e.g., secret codes input)
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
                return;
            }

            // Guard: Ignore if any overlay is open (settings, backlog, notes, etc.)
            if (this.isAnyOverlayOpen()) {
                return;
            }

            // Space/Enter to advance dialog OR hide bubble
            if ((e.key === ' ' || e.key === 'Enter') && !this.isPausedGetter()) {
                Logger.input('[KEYPRESS] Space/Enter pressed', {
                    bubbleVisible: this.dialogBubble.isVisible(),
                });

                // DIZEE: If bubble is visible, hide it first
                if (this.dialogBubble.isVisible()) {
                    Logger.input('[KEYPRESS] Hiding bubble and advancing scene');
                    this.dialogBubble.hide();
                    // For internal thoughts, manually trigger advance since DialogController isn't active
                    this.eventBus.emit('dialog:advance', {});
                } else {
                    Logger.input('[KEYPRESS] Calling dialogController.handleClick()');
                    this.dialogController.handleClick();
                }
            }
        });
    }

    /**
     * Check if any overlay is open (settings, backlog, notes, save/load, etc.)
     * Mirrors KeyboardController.isAnyOverlayOpen() for consistency
     */
    private isAnyOverlayOpen(): boolean {
        const isVisible = (id: string, className?: string): boolean => {
            const el = document.getElementById(id);
            if (!el) return false;
            if (className) return el.classList.contains(className);
            return el.style.display !== 'none' && el.style.display !== '';
        };

        return !!(
            isVisible('notes-overlay') ||
            isVisible('backlog-overlay') ||
            isVisible('settings-menu') ||
            isVisible('save-load-overlay') ||
            isVisible('sidebar', 'visible') ||
            isVisible('dev-console')
        );
    }

    /**
     * Haptic feedback for UI interactions
     */
    private setupHapticFeedback(): void {
        this.eventBus.on('ui:click', () => {
            if (navigator.vibrate) navigator.vibrate(10);
        });

        this.eventBus.on('ui:confirm', () => {
            if (navigator.vibrate) navigator.vibrate([20, 30, 20]);
        });

        this.eventBus.on('ui:denied', () => {
            if (navigator.vibrate) navigator.vibrate([50, 20, 50]);
        });
    }
}
