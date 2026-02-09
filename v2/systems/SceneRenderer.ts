import { EventBus } from '@core/EventBus';
import type { TypewriterController } from '@controllers/TypewriterController';
import { Logger } from '@utils/Logger';

/**
 * SceneRenderer - Scene Rendering System
 * V1 Parity Port from scene-renderer.js (274 lines)
 *
 * SOLID Refactor Session 6 (Session 53)
 * Created: December 21, 2025
 *
 * Purpose:
 * - Handle sprite display and animations
 * - Manage background transitions
 * - Render dialogue and choices
 * - Extract rendering logic from GameEngine
 *
 * Responsibilities:
 * - Sprite management (left/right with fade transitions)
 * - Background crossfade transitions
 * - Choice menu rendering
 * - Typewriter effect integration
 * - Echo group special rendering
 * - Mobile full-body sprite support (via CSS)
 *
 * @class SceneRenderer
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface SpriteUpdate {
    left?: string | null;
    right?: string | null;
}

export interface CurrentSprites {
    left: string | null;
    right: string | null;
}

export interface GameStateSprites {
    left: string | null;
    right: string | null;
}

export interface Choice {
    text: string;
    value: string | number;
    locked?: boolean;
    disabled?: boolean;
}

// Minimal game instance interface for SceneRenderer
export interface GameInstance {
    // DOM elements
    spriteLeft: HTMLElement | null;
    spriteRight: HTMLElement | null;
    sceneBackground: HTMLElement;
    sceneBackgroundAlt: HTMLElement | null;
    choicesContainer: HTMLElement;
    choiceMenu: HTMLElement;

    // State
    currentSprites: CurrentSprites;
    currentBackground: string;
    useAltBackground: boolean;
    slowRevealActive: boolean;
    gameState: {
        currentScene?: string;
        sprites: GameStateSprites;
    };

    // Systems
    typewriterController: TypewriterController | null;
    echoMemory?: {
        recordChoice(choiceId: string, optionIndex: number): void;
    };
    settingsManager?: {
        startAutoAdvance(callback: () => void): void;
    };

    // Methods
    displayEchoGroup(): void;
    getTypewriterSpeed(): number;
    shouldPaginateText(length: number): boolean;
    paginateAndDisplayText(element: HTMLElement, text: string, callback?: () => void): void;
    advance(): void;
    triggerSensoryFeedback(type: string, element: HTMLElement, reason: string): void;
}

export class SceneRenderer {
    private game: GameInstance;
    private eventBus: EventBus;

    constructor(game: GameInstance, eventBus: EventBus) {
        this.game = game;
        this.eventBus = eventBus;

        Logger.scene('🎬 SceneRenderer initialized');
    }

    // ========================================
    // MOBILE FULL-BODY SPRITE SUPPORT
    // Swaps torso sprites → full-body on mobile landscape
    // ========================================

    // NOTE: Sprite path swapping removed - routes now use full-body sprites directly
    // CSS handles responsive display (desktop shows torso, mobile shows full body)

    // ========================================
    // SPRITE MANAGEMENT
    // Extracted from GameEngine.updateSprites
    // V1 Parity: scene-renderer.js lines 34-101
    // ========================================

    /**
     * Update character sprites with fade transitions
     * Supports left/right sprites and special "echoes" rendering
     */
    public updateSprites(sprites: SpriteUpdate): void {
        const game = this.game;

        // Handle left sprite
        if (sprites.left !== undefined) {
            if (sprites.left === null) {
                // Hide left sprite
                if (game.spriteLeft) {
                    game.spriteLeft.style.opacity = '0';
                    setTimeout(() => {
                        if (game.spriteLeft) {
                            game.spriteLeft.style.display = 'none';
                            game.spriteLeft.style.backgroundImage = '';
                        }
                    }, 300);
                }
                game.currentSprites.left = null;
                game.gameState.sprites.left = null;
            } else {
                // Show/update left sprite (routes now use full-body sprite paths)
                if (game.spriteLeft) {
                    game.spriteLeft.style.backgroundImage = `url(${sprites.left})`;
                    game.spriteLeft.style.display = 'block';
                    game.spriteLeft.style.opacity = '0';
                    setTimeout(() => {
                        if (game.spriteLeft) {
                            game.spriteLeft.style.opacity = '1';
                        }
                    }, 50);
                }
                game.currentSprites.left = sprites.left;
                game.gameState.sprites.left = sprites.left;
            }
        }

        // Handle right sprite - check if it's the Echoes triple
        if (sprites.right !== undefined) {
            if (sprites.right === null) {
                // Hide right sprite
                if (game.spriteRight) {
                    game.spriteRight.style.opacity = '0';
                    setTimeout(() => {
                        if (game.spriteRight) {
                            game.spriteRight.style.display = 'none';
                            game.spriteRight.style.backgroundImage = '';
                            game.spriteRight.classList.remove('echo-group');
                            game.spriteRight.innerHTML = '';
                        }
                    }, 300);
                }
                game.currentSprites.right = null;
                game.gameState.sprites.right = null;
            } else if (sprites.right === 'echoes' || sprites.right === 'three-echoes') {
                // Special handling for triple Echo sprites
                game.displayEchoGroup();
                game.currentSprites.right = 'echoes';
                game.gameState.sprites.right = 'echoes';
            } else {
                // Show/update right sprite (routes now use full-body sprite paths)
                if (game.spriteRight) {
                    game.spriteRight.classList.remove('echo-group');
                    game.spriteRight.innerHTML = '';
                    game.spriteRight.style.backgroundImage = `url(${sprites.right})`;
                    game.spriteRight.style.display = 'block';
                    game.spriteRight.style.opacity = '0';
                    setTimeout(() => {
                        if (game.spriteRight) {
                            game.spriteRight.style.opacity = '1';
                        }
                    }, 50);
                }
                game.currentSprites.right = sprites.right;
                game.gameState.sprites.right = sprites.right;
            }
        }
    }

    // ========================================
    // BACKGROUND MANAGEMENT
    // Extracted from GameEngine.crossfadeBackground
    // V1 Parity: scene-renderer.js lines 108-135
    // ========================================

    /**
     * Crossfade between backgrounds using dual-layer technique
     * V1 Parity: Smooth transitions without flicker
     */
    public crossfadeBackground(newBackground: string): void {
        const game = this.game;

        // Skip if same background
        if (game.currentBackground === newBackground) return;

        // Fallback: if alt layer doesn't exist, just set directly
        if (!game.sceneBackgroundAlt) {
            game.sceneBackground.style.backgroundImage = `url(${newBackground})`;
            game.currentBackground = newBackground;
            return;
        }

        // Determine which layer to use
        const incoming = game.useAltBackground ? game.sceneBackground : game.sceneBackgroundAlt;
        const outgoing = game.useAltBackground ? game.sceneBackgroundAlt : game.sceneBackground;

        // Set new background on incoming layer
        incoming.style.backgroundImage = `url(${newBackground})`;

        // Crossfade: fade in incoming, fade out outgoing
        incoming.style.opacity = '1';
        outgoing.style.opacity = '0';

        // Toggle for next transition
        game.useAltBackground = !game.useAltBackground;
        game.currentBackground = newBackground;
    }

    // ========================================
    // CHOICE MENU
    // Extracted from GameEngine.showChoices
    // V1 Parity: scene-renderer.js lines 142-180
    // ========================================

    /**
     * Render choice menu with locked state support
     * V1 Parity: Belle's echo memory integration
     */
    public showChoices(choices: Choice[], onChoice: (value: string | number) => void): void {
        const game = this.game;

        game.choicesContainer.innerHTML = '';
        game.choiceMenu.style.display = 'block';

        choices.forEach(choice => {
            const button = document.createElement('div');
            button.className = 'choice-option';
            button.textContent = choice.text;

            if (choice.locked || choice.disabled) {
                button.classList.add('locked');

                // Add click handler for denial feedback on locked choices
                button.addEventListener('click', () => {
                    game.triggerSensoryFeedback('denied', button, 'Locked story choice');
                });
            } else {
                button.addEventListener('click', () => {
                    game.triggerSensoryFeedback('buttonPress', button, 'Choice selected');
                    game.choiceMenu.style.display = 'none';

                    // Record choice for echo memory (Belle's meta-awareness)
                    const choiceId = game.gameState?.currentScene || 'unknown';
                    if (game.echoMemory) {
                        const optionIndex = choices.indexOf(choice);
                        game.echoMemory.recordChoice(choiceId, optionIndex);
                    }

                    // Emit choice event
                    this.eventBus.emit('choice:selected', { choiceId, text: choice.text });

                    if (onChoice) onChoice(choice.value);
                });
            }

            game.choicesContainer.appendChild(button);
        });
    }

    // ========================================
    // TYPEWRITER EFFECT
    // Extracted from GameEngine.typewriterText
    // V1 Parity: scene-renderer.js lines 187-264
    // ========================================

    /**
     * Typewriter text effect with pagination support
     * V1 Parity: Mobile pagination, instant mode, auto-advance
     */
    public typewriterText(
        element: HTMLElement,
        text: string,
        callback?: () => void,
        internalTextLength: number = 0,
        slowReveal: boolean = false
    ): void {
        const game = this.game;

        // Store slow reveal flag for getTypewriterSpeed
        game.slowRevealActive = slowReveal;

        // Check if instant mode is enabled
        const speed = game.getTypewriterSpeed();
        if (speed === 0) {
            // Instant mode - show all text immediately
            element.textContent = text;
            if (game.typewriterController) {
                game.typewriterController.typewriterActive = false;
            }

            // Start auto-advance timer in instant mode
            if (game.settingsManager) {
                game.settingsManager.startAutoAdvance(() => {
                    if (!game.choiceMenu || game.choiceMenu.style.display === 'none') {
                        game.advance();
                    }
                });
            }

            if (callback) callback();
            return;
        }

        // Check if text needs pagination on mobile
        const totalLength = text.length + internalTextLength;

        if (game.shouldPaginateText(totalLength)) {
            game.paginateAndDisplayText(element, text, callback);
        } else {
            // Original typewriter behavior for desktop/short text
            // Use typewriterController as SINGLE SOURCE OF TRUTH
            const tc = game.typewriterController;
            if (!tc) {
                // Fallback if controller not ready
                element.textContent = text;
                if (callback) callback();
                return;
            }

            tc.typewriterActive = true;
            tc.fullDialogueText = text;
            tc.typewriterCallback = callback || null;
            element.textContent = '';
            let i = 0;

            // Clear any existing interval
            if (tc.typewriterInterval !== null) {
                clearInterval(tc.typewriterInterval);
            }

            tc.typewriterInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    if (tc.typewriterInterval !== null) {
                        clearInterval(tc.typewriterInterval);
                    }
                    tc.typewriterInterval = null;
                    tc.typewriterActive = false;

                    // Start auto-advance timer after typewriter finishes
                    if (game.settingsManager) {
                        game.settingsManager.startAutoAdvance(() => {
                            if (!game.choiceMenu || game.choiceMenu.style.display === 'none') {
                                game.advance();
                            }
                        });
                    }

                    if (callback) callback();
                }
            }, speed) as unknown as number;
        }
    }
}
