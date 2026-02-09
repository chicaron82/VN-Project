import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';
import { GameEngine } from '../core/GameEngine';
import { DialogController } from './DialogController';
import { SpriteController } from './SpriteController';
import { DialogBubble } from '../ui/components/DialogBubble';
import { GameLayout } from '../ui/components/GameLayout';
import { VisualEffectsLayer } from '../ui/components/VisualEffectsLayer';
import { Logger } from '../utils/Logger';

/**
 * GameplayController - Gameplay session management and UI updates
 *
 * Extracted from main.ts startGameplay() and helpers (~200 lines)
 *
 * Handles:
 * - startGameplay() - Initialize game session (prologue/ronnie/tori)
 * - updateBackground() - Update viewport background
 * - updateSprites() - Display character sprites via SpriteController
 * - showChoices() - Display choice UI with keyboard navigation
 */

export class GameplayController {
    private eventBus: EventBus;
    private stateManager: StateManager;
    private gameEngine: GameEngine;
    private dialogController: DialogController;
    private spriteController: SpriteController;
    private dialogBubble: DialogBubble;
    private clearScreen: () => void;
    private gameLayout: GameLayout | null = null;
    private choiceKeyHandler: ((e: KeyboardEvent) => void) | null = null;

    constructor(
        eventBus: EventBus,
        stateManager: StateManager,
        gameEngine: GameEngine,
        dialogController: DialogController,
        spriteController: SpriteController,
        dialogBubble: DialogBubble,
        clearScreen: () => void
    ) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.gameEngine = gameEngine;
        this.dialogController = dialogController;
        this.spriteController = spriteController;
        this.dialogBubble = dialogBubble;
        this.clearScreen = clearScreen;
    }

    /**
     * Get current game layout (for external access)
     */
    public getGameLayout(): GameLayout | null {
        return this.gameLayout;
    }

    /**
     * Start gameplay session (prologue, ronnie route, or tori route)
     */
    public async startGameplay(mode: 'ronnie' | 'tori' | 'prologue'): Promise<void> {
        // Show loader
        this.eventBus.emit('loading:start', {});

        // Small delay to ensure loader is visible before blocking operations
        await new Promise(r => setTimeout(r, 100));

        this.clearScreen();

        this.stateManager.set('currentRoute', mode === 'prologue' ? null : mode);
        this.stateManager.set('tetherLevel', 100);
        this.stateManager.set('history', []);

        // Create game layout
        this.gameLayout = new GameLayout('app', this.eventBus);

        // Create effects layer (attaches to DOM via constructor)
        if (this.gameLayout) {
            new VisualEffectsLayer(
                this.gameLayout.viewport,
                this.gameLayout.viewport,
                this.eventBus
            );

            // TORI'S FIX: Trigger code rain AFTER effects layer exists (route games only)
            if (mode !== 'prologue') {
                this.eventBus.emit('effect:code_rain', { duration: 1200 });
            }

            // Set up sprite controller viewport
            this.spriteController.setViewport(this.gameLayout.viewport);

            // Set up dialog controller to update UI
            this.dialogController.onTextUpdate((text) => {
                if (this.gameLayout) {
                    this.gameLayout.dialogText.textContent = text;
                }
            });

            // Click on viewport advances dialog OR hides bubble
            this.gameLayout.viewport.addEventListener('click', () => {
                Logger.input('[CLICK] Viewport clicked', { bubbleVisible: this.dialogBubble.isVisible() });
                // DIZEE: If bubble is visible, hide it and advance
                if (this.dialogBubble.isVisible()) {
                    Logger.input('[CLICK] Hiding bubble and advancing scene');
                    this.dialogBubble.hide();
                    // For internal thoughts, manually trigger advance since DialogController isn't active
                    this.eventBus.emit('dialog:advance', {});
                } else {
                    Logger.input('[CLICK] Calling dialogController.handleClick()');
                    this.dialogController.handleClick();
                }
            });

            // Click on dialog box also advances (V1 parity)
            this.gameLayout.dialogBox.addEventListener('click', () => {
                Logger.input('[CLICK] Dialog box clicked', { bubbleVisible: this.dialogBubble.isVisible() });
                if (this.dialogBubble.isVisible()) {
                    Logger.input('[CLICK] Hiding bubble and advancing scene');
                    this.dialogBubble.hide();
                    this.eventBus.emit('dialog:advance', {});
                } else {
                    Logger.input('[CLICK] Calling dialogController.handleClick()');
                    this.dialogController.handleClick();
                }
            });
        }

        // Gameplay unmount handled by clearScreen when returning to menu

        // Determine first scene based on mode
        const firstSceneId = mode === 'ronnie'
            ? 'ronnie_act1_prologueScene4'
            : mode === 'tori'
                ? 'scene1_coffee'
                : 'scene1_streetBump';

        if (mode === 'prologue') {
            // Prologue loads immediately
            await this.gameEngine.loadScene(firstSceneId);
            this.eventBus.emit('loading:end', {});
            Logger.system('[UV7 V2] Starting prologue');
        } else {
            // Route games delay for code rain effect
            setTimeout(async () => {
                await this.gameEngine.loadScene(firstSceneId);
                this.eventBus.emit('loading:end', {});
                Logger.system(`[UV7 V2] Starting game: ${mode} route`);
            }, 900);
        }
    }

    /**
     * Update background image in viewport
     */
    public updateBackground(path: string | undefined): void {
        if (!this.gameLayout || !path) return;
        this.gameLayout.viewport.style.backgroundImage = `url(${path})`;
        this.gameLayout.viewport.style.backgroundSize = 'cover';
        this.gameLayout.viewport.style.backgroundPosition = 'center';
    }

    /**
     * Update character sprites in scene
     */
    public updateSprites(sprites: Array<{ position?: string; variant?: string; id?: string }> | undefined): void {
        if (!this.gameLayout || !sprites) return;

        // Check if this is an echo group scene
        const hasEchoSprites = sprites.some(s =>
            s.id?.includes('echo') || s.id?.includes('despair') ||
            s.variant?.includes('echo') || s.variant?.includes('despair')
        );

        if (hasEchoSprites) {
            // Use SpriteController for echo group
            this.spriteController.displayEchoGroup();

            // Check current act for growth stage
            const currentScene = this.stateManager.get<string>('currentScene') ?? '';
            if (currentScene.includes('act1') || currentScene.includes('Act1')) {
                this.spriteController.setEchoGrowthStage('act1');
            } else if (currentScene.includes('act2') || currentScene.includes('Act2')) {
                this.spriteController.setEchoGrowthStage('act2');
            } else if (currentScene.includes('act3') || currentScene.includes('Act3')) {
                this.spriteController.setEchoGrowthStage('act3');
            }
        } else {
            // Use SpriteController for standard sprites
            for (const sprite of sprites) {
                if (sprite.position === 'left' && sprite.variant) {
                    this.spriteController.showSprite('left', sprite.variant);
                } else if (sprite.position === 'right' && sprite.variant) {
                    this.spriteController.showSprite('right', sprite.variant);
                }
            }
        }
    }

    /**
     * Display choice buttons with keyboard navigation
     */
    public showChoices(choices: Array<{ text: string; next: string | null }>): void {
        if (!this.gameLayout) return;

        // Remove existing handler if any (safety)
        if (this.choiceKeyHandler) {
            document.removeEventListener('keydown', this.choiceKeyHandler);
            this.choiceKeyHandler = null;
        }

        // Create choice container
        const choiceContainer = document.createElement('div');
        choiceContainer.id = 'choice-container';
        choiceContainer.style.cssText = `
            position: absolute;
            bottom: 20%;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            gap: 1rem;
            z-index: 100;
        `;

        // Define cleanup function
        const cleanup = () => {
            if (this.choiceKeyHandler) {
                document.removeEventListener('keydown', this.choiceKeyHandler);
                this.choiceKeyHandler = null;
            }
            choiceContainer.remove();
        };

        choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.textContent = `${index + 1}. ${choice.text}`; // Add number prefix
            btn.style.cssText = `
                background: rgba(0, 0, 0, 0.8);
                border: 2px solid #0ff;
                color: #0ff;
                padding: 1rem 2rem;
                font-family: 'Courier New', monospace;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.2s;
                text-align: left;
            `;
            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(0, 255, 255, 0.2)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'rgba(0, 0, 0, 0.8)';
            });
            btn.addEventListener('click', () => {
                cleanup();
                this.gameEngine.selectChoice(index);
            });
            choiceContainer.appendChild(btn);
        });

        // Keyboard Handler
        this.choiceKeyHandler = (e: KeyboardEvent) => {
            const key = parseInt(e.key);
            if (!isNaN(key) && key > 0 && key <= choices.length) {
                cleanup();
                this.gameEngine.selectChoice(key - 1);
            }
        };
        document.addEventListener('keydown', this.choiceKeyHandler);

        this.gameLayout.viewport.appendChild(choiceContainer);
    }
}
