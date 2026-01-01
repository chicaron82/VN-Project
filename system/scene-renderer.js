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
    // MOBILE FULL-BODY SPRITE SUPPORT
    // Swaps torso sprites → full-body on mobile landscape
    // ========================================

    /**
     * Check if device is in mobile landscape mode
     * Must match CSS media query in responsive.css exactly
     * @returns {boolean}
     */
    isMobileLandscape() {
        return window.matchMedia('(max-width: 1023px) and (orientation: landscape)').matches;
    }

    /**
     * Swap torso sprite path to full-body version for mobile
     * @param {string} path - Original sprite path
     * @returns {string} - Swapped path (or original if no swap)
     */
    getSpritePathForOrientation(path) {
        // Only swap on mobile landscape
        if (!this.isMobileLandscape()) return path;

        // Mapping: torso sprite → full-body sprite
        const swapMap = {
            'tori-sprite': 'full-sprite-tori',
            'ronnie-sprite': 'full-sprite-ronnie',
            'old-ronnie-sprite': 'full-sprite-oldRonnie',
            'echo-1-sprite': 'full-sprite-echo1',
            'echo-2-sprite': 'full-sprite-echo2',
            'despair-sprite': 'full-sprite-despair'
        };

        for (const [torso, fullBody] of Object.entries(swapMap)) {
            if (path.includes(torso)) {
                const newPath = path.replace(torso, fullBody);
                console.log(`🎭 Swapping sprite: ${torso} → ${fullBody}`);
                return newPath;
            }
        }
        return path; // No swap found
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
                const leftPath = this.getSpritePathForOrientation(sprites.left);
                if (game.spriteLeft) {
                    game.spriteLeft.style.backgroundImage = `url(${leftPath})`;
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
                const rightPath = this.getSpritePathForOrientation(sprites.right);
                if (game.spriteRight) {
                    game.spriteRight.classList.remove('echo-group');
                    game.spriteRight.innerHTML = '';
                    game.spriteRight.style.backgroundImage = `url(${rightPath})`;
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

    // ========================================
    // TYPEWRITER EFFECT
    // Extracted from GameEngine.typewriterText
    // ========================================

    typewriterText(element, text, callback, internalTextLength = 0, slowReveal = false) {
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
            tc.typewriterCallback = callback;
            element.textContent = '';
            let i = 0;

            // Clear any existing interval
            if (tc.typewriterInterval) {
                clearInterval(tc.typewriterInterval);
            }

            tc.typewriterInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(tc.typewriterInterval);
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
            }, speed);
        }
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.SceneRenderer = SceneRenderer;
}

// ES Module export
export { SceneRenderer };
