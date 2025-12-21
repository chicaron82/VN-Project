/**
 * SceneRenderer - Scene Rendering System
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
 * @class SceneRenderer
 */
class SceneRenderer {
    constructor(game) {
        this.game = game;
        console.log('🎬 SceneRenderer initialized');
    }

    // ========================================
    // SPRITE MANAGEMENT
    // Extracted from GameEngine.updateSprites
    // ========================================

    updateSprites(sprites) {
        const game = this.game;

        // Handle left sprite
        if (sprites.left !== undefined) {
            if (sprites.left === null) {
                // Hide left sprite
                if (game.spriteLeft) {
                    game.spriteLeft.style.opacity = '0';
                    setTimeout(() => {
                        game.spriteLeft.style.display = 'none';
                        game.spriteLeft.style.backgroundImage = '';
                    }, 300);
                }
                game.currentSprites.left = null;
                game.gameState.sprites.left = null;
            } else {
                // Show/update left sprite
                if (game.spriteLeft) {
                    game.spriteLeft.style.backgroundImage = `url(${sprites.left})`;
                    game.spriteLeft.style.display = 'block';
                    game.spriteLeft.style.opacity = '0';
                    setTimeout(() => {
                        game.spriteLeft.style.opacity = '1';
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
                        game.spriteRight.style.display = 'none';
                        game.spriteRight.style.backgroundImage = '';
                        game.spriteRight.classList.remove('echo-group');
                        game.spriteRight.innerHTML = '';
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
                // Show/update right sprite (normal single sprite)
                if (game.spriteRight) {
                    game.spriteRight.classList.remove('echo-group');
                    game.spriteRight.innerHTML = '';
                    game.spriteRight.style.backgroundImage = `url(${sprites.right})`;
                    game.spriteRight.style.display = 'block';
                    game.spriteRight.style.opacity = '0';
                    setTimeout(() => {
                        game.spriteRight.style.opacity = '1';
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
    // ========================================

    crossfadeBackground(newBackground) {
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
    // ========================================

    showChoices(choices, onChoice) {
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
                    if (game.triggerSensoryFeedback) {
                        game.triggerSensoryFeedback('denied', button, 'Locked story choice');
                    }
                });
            } else {
                button.addEventListener('click', () => {
                    game.triggerSensoryFeedback('buttonPress', button, 'Choice selected');
                    game.choiceMenu.style.display = 'none';
                    if (onChoice) onChoice(choice.value);
                });
            }

            game.choicesContainer.appendChild(button);
        });
    }
}
