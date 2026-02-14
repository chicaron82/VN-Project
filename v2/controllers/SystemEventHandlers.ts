import type { EventBus } from '../core/EventBus';
import type { GameEngine } from '../core/GameEngine';
import type { DialogController } from './DialogController';
import type { SpriteController } from './SpriteController';
import type { DialogBubble } from '../ui/components/DialogBubble';
import type { GameLayout } from '../ui/components/GameLayout';
import { Logger } from '@utils/Logger';

/** Extended scene interface for runtime properties not in the base Scene type */
interface ExtendedScene {
    isInternal?: boolean;
    position?: string;
    sprite1?: string;
    sprite2?: string;
    left?: boolean;
    right?: boolean;
}

/**
 * SystemEventHandlers - Game event listeners setup
 *
 * Extracted from main.ts setupEventHandlers() (~180 lines)
 *
 * Handles all eventBus.on() listeners for:
 * - scene:load (background, sprites, effects, speaker highlighting)
 * - dialog:show (typewriter or bubble for internal thoughts)
 * - dialog:complete (check for choices)
 * - scene:complete (end of route handling)
 * - tether:change (update tether display)
 * - echo:comment (Belle's meta-awareness notifications)
 */

export class SystemEventHandlers {
    private eventBus: EventBus;
    private gameEngine: GameEngine;
    private dialogController: DialogController;
    private spriteController: SpriteController;
    private dialogBubble: DialogBubble;
    private getGameLayout: () => GameLayout | null;
    private updateBackground: (bg: string) => void;
    private updateSprites: (sprites: Array<{ position?: string; variant?: string; id?: string }> | undefined) => void;
    private showChoices: (choices: Array<{ text: string; next: string | null }>) => void;
    private showMainMenu: () => void;

    constructor(
        eventBus: EventBus,
        gameEngine: GameEngine,
        dialogController: DialogController,
        spriteController: SpriteController,
        dialogBubble: DialogBubble,
        getGameLayout: () => GameLayout | null,
        updateBackground: (bg: string) => void,
        updateSprites: (sprites: Array<{ position?: string; variant?: string; id?: string }> | undefined) => void,
        showChoices: (choices: Array<{ text: string; next: string | null }>) => void,
        showMainMenu: () => void
    ) {
        this.eventBus = eventBus;
        this.gameEngine = gameEngine;
        this.dialogController = dialogController;
        this.spriteController = spriteController;
        this.dialogBubble = dialogBubble;
        this.getGameLayout = getGameLayout;
        this.updateBackground = updateBackground;
        this.updateSprites = updateSprites;
        this.showChoices = showChoices;
        this.showMainMenu = showMainMenu;
    }

    /**
     * Setup all game event handlers
     */
    public setup(): void {
        this.setupSceneHandlers();
        this.setupDialogHandlers();
        this.setupTetherHandlers();
        this.setupEchoHandlers();
    }

    /**
     * Scene loading and completion handlers
     */
    private setupSceneHandlers(): void {
        // Scene loading - update UI with scene data
        this.eventBus.on('scene:load', ({ sceneId }) => {
            const scene = this.gameEngine.getCurrentScene();
            const gameLayout = this.getGameLayout();
            if (!scene || !gameLayout) return;

            // DIZEE: Handle internal thoughts with bubble system
            const isInternal = (scene as unknown as ExtendedScene).isInternal === true;

            if (isInternal) {
                // Hide standard dialogue UI for internal thoughts
                gameLayout.dialogBox.style.display = 'none';
                // Don't show bubble yet - wait for dialog:show event
            } else {
                // Show standard dialogue UI
                gameLayout.dialogBox.style.display = 'block';
                this.dialogBubble.hide(); // Clear any existing bubble

                // Update character name
                const speaker = scene.character || 'Narration';
                gameLayout.dialogName.textContent = speaker;

                // Color based on character
                const speakerLower = speaker.toLowerCase();
                if (speakerLower.includes('ronnie')) {
                    gameLayout.dialogName.style.color = '#0ff';
                } else if (speakerLower.includes('tori')) {
                    gameLayout.dialogName.style.color = '#f0f';
                } else if (speakerLower.includes('echo 1')) {
                    gameLayout.dialogName.style.color = '#88f';
                } else if (speakerLower.includes('echo 2')) {
                    gameLayout.dialogName.style.color = '#8f8';
                } else if (speakerLower.includes('despair')) {
                    gameLayout.dialogName.style.color = '#f88';
                } else {
                    gameLayout.dialogName.style.color = '#fff';
                }
            }

            // Update background if specified
            if (scene.background) {
                this.updateBackground(scene.background);
            }

            // Update sprites if specified
            if (scene.sprites) {
                this.updateSprites(scene.sprites);
            }

            // DIZEE: Handle scene effects (fadeSpritesSequence, etc.)
            Logger.effect('Checking for effects:', {
                sceneId,
                hasEffects: !!scene.effects,
                effects: scene.effects,
            });
            if (scene.effects && scene.effects.length > 0) {
                scene.effects.forEach((effect) => {
                    Logger.effect('Processing effect:', effect);
                    if (effect.type === 'fadeSpritesSequence') {
                        Logger.effect('Triggering fadeSpritesSequence with 200ms delay');
                        // Delay effect to ensure sprites are rendered
                        setTimeout(() => {
                            Logger.effect('Executing fadeSpritesSequence now');
                            this.spriteController.fadeSpritesSequence(
                                ((effect as unknown as ExtendedScene).position || 'left') as 'left' | 'right',
                                (effect as unknown as ExtendedScene).sprite1 || '',
                                (effect as unknown as ExtendedScene).sprite2 || '',
                                effect.duration || 4000
                            );
                        }, 200);
                    }
                });
            }

            // Highlight active speaker (unless internal)
            if (!isInternal) {
                this.spriteController.highlightSpeaker(scene.character || 'Narration');
            }

            Logger.scene(`Scene loaded: ${sceneId}${isInternal ? ' (internal)' : ''}`);
        });

        // Scene complete - handle end of route
        this.eventBus.on('scene:complete', ({ sceneId }) => {
            Logger.scene(`Route ended at: ${sceneId}`);
            // For now, return to main menu after a delay
            setTimeout(() => {
                this.showMainMenu();
            }, 2000);
        });
    }

    /**
     * Dialog display and advancement handlers
     */
    /**
     * Process text for display: convert literal \n sequences to real newlines.
     * JSON data contains \\n which JSON.parse turns into literal backslash-n characters.
     * CSS white-space: pre-wrap on .dialog-text handles rendering real newlines.
     */
    private processDialogText(text: string): string {
        return text.replace(/\\n/g, '\n');
    }

    private setupDialogHandlers(): void {
        // Dialog display - use DialogController for typewriter OR bubble for internal
        this.eventBus.on('dialog:show', ({ entry }) => {
            const gameLayout = this.getGameLayout();
            if (!gameLayout) return;

            const scene = this.gameEngine.getCurrentScene();
            const isInternal = (scene as unknown as ExtendedScene | undefined)?.isInternal === true;

            if (isInternal) {
                // Show as floating thought bubble
                let position: 'left' | 'center' | 'right' = 'center';
                if (scene?.sprites) {
                    const spriteArray = Array.isArray(scene.sprites) ? scene.sprites : [scene.sprites];
                    const hasLeft = spriteArray.some(
                        (s) => s.position === 'left' || (s as unknown as ExtendedScene).left
                    );
                    const hasRight = spriteArray.some(
                        (s) => s.position === 'right' || (s as unknown as ExtendedScene).right
                    );

                    if (hasLeft && !hasRight) position = 'left';
                    else if (hasRight && !hasLeft) position = 'right';
                }

                this.dialogBubble.show({
                    text: this.processDialogText(entry.text),
                    position,
                    duration: 0, // Manual dismiss (advance with click/key)
                });

                // Still emit complete event so player can advance
                setTimeout(() => {
                    this.eventBus.emit('dialog:complete', {});
                }, 100);
            } else {
                // Standard dialogue box with typewriter
                this.dialogController.show(this.processDialogText(entry.text));
            }
        });

        // Dialog complete - check for choices
        this.eventBus.on('dialog:complete', () => {
            const scene = this.gameEngine.getCurrentScene();
            if (scene?.choices && scene.choices.length > 0) {
                this.eventBus.emit('choice:show', { choices: scene.choices });
                this.showChoices(scene.choices);
            }
        });
    }

    /**
     * Tether system handlers
     */
    private setupTetherHandlers(): void {
        this.eventBus.on('tether:change', (data) => {
            const gameLayout = this.getGameLayout();
            if (gameLayout) {
                gameLayout.updateTether(data.level);
            }
        });
    }

    /**
     * Echo Memory System - Comment Display
     * Belle's meta-awareness notifications 🖤
     */
    private setupEchoHandlers(): void {
        this.eventBus.on('echo:comment', (data) => {
            // Map echo type to priority (despair = urgent, others = normal)
            const echoPriority: Record<string, 'urgent' | 'high' | 'normal'> = {
                hope: 'normal',
                gentle: 'normal',
                despair: 'high',
            };

            this.eventBus.emit('notification:show', {
                id: `echo-${data.echo}-${Date.now()}`,
                title: `ECHO: ${data.echo.toUpperCase()}`,
                message: data.message,
                icon: data.icon,
                category: 'system',
                priority: echoPriority[data.echo] || 'normal',
                duration: 4000,
            });
        });
    }
}
