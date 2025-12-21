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
}
