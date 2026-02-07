import { EventBus } from '../core/EventBus';
import { SaveSystem } from '../systems/SaveSystem';
import { GameConfig } from '../core/GameConfig';
import { DialogController } from './DialogController';
import { DialogBubble } from '../ui/components/DialogBubble';

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
            // Space/Enter to advance dialog OR hide bubble
            if ((e.key === ' ' || e.key === 'Enter') && !this.isPausedGetter()) {
                console.log('[KEYPRESS] Space/Enter pressed', {
                    bubbleVisible: this.dialogBubble.isVisible(),
                });

                // DIZEE: If bubble is visible, hide it first
                if (this.dialogBubble.isVisible()) {
                    console.log('[KEYPRESS] Hiding bubble and advancing scene');
                    this.dialogBubble.hide();
                    // For internal thoughts, manually trigger advance since DialogController isn't active
                    this.eventBus.emit('dialog:advance', {});
                } else {
                    console.log('[KEYPRESS] Calling dialogController.handleClick()');
                    this.dialogController.handleClick();
                }
            }
        });
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
