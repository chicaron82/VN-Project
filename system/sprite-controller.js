// ========================================
// SPRITE CONTROLLER
// Extracted from GameEngine (Session 120)
// ========================================
//
// RESPONSIBILITIES:
// - Manage character sprite display (left/right positions)
// - Handle active speaker highlighting (dimming non-speakers)
// - Echo sprite system (Tori route - three separate sprites)
// - Complex sprite animations (fade sequences, Echo merge)
// - Echo growth stages (act1, act2, act3)
// - Sprite state tracking and restoration
//
// DEPENDENCIES (injected via constructor):
// - game (GameEngine) - Access to sprite DOM elements and state
//
// ========================================

class SpriteController {
    constructor(game) {
        this.game = game;
        console.log('🎨 SpriteController initialized');
    }

    // ========================================
    // ACTIVE SPEAKER HIGHLIGHTING
    // ========================================

    setActiveSpeaker(speaker) {
        if (!speaker) {
            // No speaker - remove all dims
            if (this.game.spriteLeft) this.game.spriteLeft.classList.remove('sprite-dim');
            if (this.game.spriteRight) this.game.spriteRight.classList.remove('sprite-dim');
            // Remove dims from individual Echoes
            const echoSprites = document.querySelectorAll('.echo-sprite');
            echoSprites.forEach(sprite => sprite.classList.remove('sprite-dim'));
            return;
        }

        const speakerName = speaker.toLowerCase();

        // OFFSCREEN SPEAKER DETECTION:
        // If speaker is not physically present (Tamagotchi, device, offscreen, voice, etc.)
        // Dim ALL sprites to show everyone is listening
        if (speakerName.includes('tamagotchi') ||
            speakerName.includes('device') ||
            speakerName.includes('offscreen') ||
            speakerName.includes('from device') ||
            speakerName.includes('voice')) {

            // Dim all standard sprites
            if (this.game.spriteLeft) this.game.spriteLeft.classList.add('sprite-dim');
            if (this.game.spriteRight) this.game.spriteRight.classList.add('sprite-dim');

            // Dim all Echo sprites if present
            const echo1 = document.getElementById('echo-1-sprite');
            const echo2 = document.getElementById('echo-2-sprite');
            const despair = document.getElementById('despair-sprite');
            if (echo1) echo1.classList.add('sprite-dim');
            if (echo2) echo2.classList.add('sprite-dim');
            if (despair) despair.classList.add('sprite-dim');

            return; // Early exit - everyone dimmed
        }

        // Check if Echoes are displayed
        const echo1 = document.getElementById('echo-1-sprite');
        const echo2 = document.getElementById('echo-2-sprite');
        const despair = document.getElementById('despair-sprite');

        if (echo1 && echo2 && despair) {
            // Echoes are active - handle individual highlighting
            if (speakerName.includes('echo 1') || speakerName.includes('echo1')) {
                echo1.classList.remove('sprite-dim');
                echo2.classList.add('sprite-dim');
                despair.classList.add('sprite-dim');
                // Keep Tori bright if she's on left
                if (this.game.spriteLeft && this.game.currentSprites.left) {
                    this.game.spriteLeft.classList.add('sprite-dim');
                }
            } else if (speakerName.includes('echo 2') || speakerName.includes('echo2')) {
                echo1.classList.add('sprite-dim');
                echo2.classList.remove('sprite-dim');
                despair.classList.add('sprite-dim');
                if (this.game.spriteLeft && this.game.currentSprites.left) {
                    this.game.spriteLeft.classList.add('sprite-dim');
                }
            } else if (speakerName.includes('despair')) {
                echo1.classList.add('sprite-dim');
                echo2.classList.add('sprite-dim');
                despair.classList.remove('sprite-dim');
                if (this.game.spriteLeft && this.game.currentSprites.left) {
                    this.game.spriteLeft.classList.add('sprite-dim');
                }
            } else if (speakerName.includes('echoes')) {
                // All Echoes speaking together
                echo1.classList.remove('sprite-dim');
                echo2.classList.remove('sprite-dim');
                despair.classList.remove('sprite-dim');
                if (this.game.spriteLeft && this.game.currentSprites.left) {
                    this.game.spriteLeft.classList.add('sprite-dim');
                }
            } else if (speakerName.includes('tori')) {
                // Tori speaking - dim all Echoes
                echo1.classList.add('sprite-dim');
                echo2.classList.add('sprite-dim');
                despair.classList.add('sprite-dim');
                if (this.game.spriteLeft) this.game.spriteLeft.classList.remove('sprite-dim');
            } else if (speakerName.includes('narration') || speakerName.includes('system')) {
                // Narration - no dimming
                echo1.classList.remove('sprite-dim');
                echo2.classList.remove('sprite-dim');
                despair.classList.remove('sprite-dim');
                if (this.game.spriteLeft) this.game.spriteLeft.classList.remove('sprite-dim');
            }
            return;
        }

        // ========================================
        // POSITION-AWARE SPRITE HIGHLIGHTING
        // Check currentSprites to find who's actually where
        // Tori's route: Tori left, Ronnie right
        // Ronnie's route: Ronnie left, Tori right
        // ========================================

        // Determine which character is in which position by checking sprite filenames
        const leftSpriteFile = this.game.currentSprites.left ? this.game.currentSprites.left.toLowerCase() : '';
        const rightSpriteFile = this.game.currentSprites.right ? this.game.currentSprites.right.toLowerCase() : '';

        // Check if speaker is Ronnie
        if (speakerName.includes('ronnie')) {
            // Find where Ronnie actually is based on sprite filename
            const ronnieIsLeft = leftSpriteFile.includes('ronnie');
            const ronnieIsRight = rightSpriteFile.includes('ronnie');

            if (ronnieIsLeft) {
                // Ronnie on left - brighten left, dim right
                if (this.game.spriteLeft) this.game.spriteLeft.classList.remove('sprite-dim');
                if (this.game.spriteRight && this.game.currentSprites.right) {
                    this.game.spriteRight.classList.add('sprite-dim');
                }
            } else if (ronnieIsRight) {
                // Ronnie on right - brighten right, dim left
                if (this.game.spriteRight) this.game.spriteRight.classList.remove('sprite-dim');
                if (this.game.spriteLeft && this.game.currentSprites.left) {
                    this.game.spriteLeft.classList.add('sprite-dim');
                }
            }
        }
        // Check if speaker is Tori
        else if (speakerName.includes('tori')) {
            // Find where Tori actually is based on sprite filename
            const toriIsLeft = leftSpriteFile.includes('tori');
            const toriIsRight = rightSpriteFile.includes('tori');

            if (toriIsLeft) {
                // Tori on left - brighten left, dim right
                if (this.game.spriteLeft) this.game.spriteLeft.classList.remove('sprite-dim');
                if (this.game.spriteRight && this.game.currentSprites.right) {
                    this.game.spriteRight.classList.add('sprite-dim');
                }
            } else if (toriIsRight) {
                // Tori on right - brighten right, dim left
                if (this.game.spriteRight) this.game.spriteRight.classList.remove('sprite-dim');
                if (this.game.spriteLeft && this.game.currentSprites.left) {
                    this.game.spriteLeft.classList.add('sprite-dim');
                }
            }
        }
        // Narration or system text
        else if (speakerName.includes('narration') || speakerName.includes('system')) {
            // No dimming - everyone visible
            if (this.game.spriteLeft) this.game.spriteLeft.classList.remove('sprite-dim');
            if (this.game.spriteRight) this.game.spriteRight.classList.remove('sprite-dim');
        }
    }

    // ========================================
    // SPRITE ANIMATIONS
    // ========================================

    fadeSpritesSequence(position, sprite1, sprite2, duration = 4000) {
        const container = position === 'left' ? this.game.spriteLeft : this.game.spriteRight;
        if (!container) return;

        // Start with sprite1 (young Ronnie)
        container.style.backgroundImage = `url('${sprite1}')`;
        container.style.display = 'block';
        container.style.opacity = '1';

        const timing = duration / 4; // Split into 4 phases

        // Phase 1: Fade out sprite1
        setTimeout(() => {
            container.style.transition = 'opacity 0.8s ease';
            container.style.opacity = '0.2';
        }, timing);

        // Phase 2: Switch to sprite2 (Old Man) at lowest opacity
        setTimeout(() => {
            container.style.backgroundImage = `url('${sprite2}')`;
            container.style.opacity = '1';
        }, timing * 1.8);

        // Phase 3: Hold Old Man briefly, then fade
        setTimeout(() => {
            container.style.opacity = '0.2';
        }, timing * 2.8);

        // Phase 4: Switch back to sprite1 (young Ronnie) and restore visibility
        setTimeout(() => {
            container.style.backgroundImage = `url('${sprite1}')`;
            container.style.opacity = '1';
            container.style.transition = 'opacity 0.6s ease';
        }, timing * 3.5);

        // Stay visible - don't fade to black
        // Sprite persists for rest of scene
    }

    triggerEchoMerge(callback) {
        // DIZEE FIX: Parallel animations + hold time for dramatic moment
        // Animate the three echoes merging into one Tori sprite
        const echo1 = document.getElementById('echo-1-sprite');
        const echo2 = document.getElementById('echo-2-sprite');
        const despair = document.getElementById('despair-sprite');
        const container = this.game.spriteRight;

        if (!echo1 || !echo2 || !despair || !container) {
            console.log('Echo merge: sprites not found, skipping animation');
            if (callback) callback();
            return;
        }

        console.log('Starting echo merge sequence...');

        // T=0s: Start BOTH animations in parallel
        // Phase 1a: Echoes slide toward center (1500ms)
        echo1.classList.add('echo-merge-left');
        echo2.classList.add('echo-merge-center');
        despair.classList.add('echo-merge-right');

        // Phase 1b: Tori sprite fades out simultaneously (1500ms)
        container.style.transition = 'opacity 1.5s ease-out';
        container.style.opacity = '0';

        // T=1500ms: Both animations complete, trigger flash
        setTimeout(() => {
            // Phase 2: White flash (300ms)
            const flash = document.createElement('div');
            flash.className = 'merge-flash';
            document.getElementById('game-view').appendChild(flash);

            // T=1800ms: Flash ends, show Tori
            setTimeout(() => {
                // Phase 3: Remove echoes, prepare Tori sprite
                container.classList.remove('echo-group');
                container.innerHTML = '';
                container.style.backgroundImage = "url('assets/tori-sprite.png')";
                container.style.display = 'block';
                container.style.opacity = '0';

                // Remove flash
                flash.remove();

                // Phase 4: Fade in Tori (500ms)
                container.style.transition = 'opacity 0.5s ease-in';
                setTimeout(() => {
                    container.style.opacity = '1';
                    console.log('Echo merge visual complete, holding moment...');

                    // T=4000ms: HOLD for 2.5 seconds, then advance
                    // Let the moment breathe - this is the climax
                    setTimeout(() => {
                        console.log('Echo merge sequence complete!');
                        if (callback) callback();
                    }, 2500);
                }, 50);

            }, 300);

        }, 1500);
    }

    // ========================================
    // ECHO SPRITE SYSTEM (TORI ROUTE)
    // ========================================

    displayEchoGroup() {
        // Display three separate Echo sprites
        if (!this.game.spriteRight) return;

        // Clear and set up as echo group
        this.game.spriteRight.innerHTML = '';
        this.game.spriteRight.style.backgroundImage = '';
        this.game.spriteRight.classList.add('echo-group');
        this.game.spriteRight.style.display = 'flex';
        this.game.spriteRight.style.opacity = '0';

        // Create three echo sprites
        const echo1 = document.createElement('div');
        echo1.id = 'echo-1-sprite';
        echo1.className = 'echo-sprite';
        echo1.style.backgroundImage = "url('assets/echo-1-sprite.png')";

        const echo2 = document.createElement('div');
        echo2.id = 'echo-2-sprite';
        echo2.className = 'echo-sprite';
        echo2.style.backgroundImage = "url('assets/echo-2-sprite.png')";

        const despair = document.createElement('div');
        despair.id = 'despair-sprite';
        despair.className = 'echo-sprite';
        despair.style.backgroundImage = "url('assets/despair-sprite.png')";

        // Add to container
        this.game.spriteRight.appendChild(echo1);
        this.game.spriteRight.appendChild(echo2);
        this.game.spriteRight.appendChild(despair);

        // Fade in
        setTimeout(() => {
            this.game.spriteRight.style.opacity = '1';
        }, 50);

        // Apply current growth stage if set
        // This preserves the stage when echoes are re-displayed
        if (this.game.currentEchoGrowthStage) {
            this.setEchoGrowthStage(this.game.currentEchoGrowthStage);
        } else {
            // Default to Act 1 if no stage set
            this.setEchoGrowthStage('act1');
        }

        console.log('Echo group displayed with three separate sprites');
    }

    setEchoGrowthStage(stage) {
        // Update Echo visual growth based on act progression
        // stage: 'act1', 'act2', or 'act3'

        // Store current stage so it persists when echoes are re-displayed
        this.game.currentEchoGrowthStage = stage;

        if (!this.game.spriteRight || !this.game.spriteRight.classList.contains('echo-group')) {
            console.log('Echo growth: No echo group active yet, stage stored for later');
            return;
        }

        // Remove all growth classes
        this.game.spriteRight.classList.remove('echo-growth-act1', 'echo-growth-act2', 'echo-growth-act3');

        // Add the appropriate class
        if (stage === 'act1') {
            this.game.spriteRight.classList.add('echo-growth-act1');
            console.log('Echo growth: Act 1 (75% height - Despair dominates)');
        } else if (stage === 'act2') {
            this.game.spriteRight.classList.add('echo-growth-act2');
            console.log('Echo growth: Act 2 (90% height - Hope rising)');
        } else if (stage === 'act3') {
            this.game.spriteRight.classList.add('echo-growth-act3');
            console.log('Echo growth: Act 3 (100% height - Balance achieved)');
        }
    }

    // ========================================
    // SPRITE STATE MANAGEMENT
    // ========================================

    restoreSprites() {
        // NEW METHOD: Restore sprites from save state
        // Called when loading a game
        if (this.game.gameState.sprites) {
            if (this.game.gameState.sprites.left) {
                this.game.sceneRenderer.updateSprites({ left: this.game.gameState.sprites.left });
            }
            if (this.game.gameState.sprites.right) {
                this.game.sceneRenderer.updateSprites({ right: this.game.gameState.sprites.right });
            }
        }
    }

    hideAllSprites() {
        // OLD METHOD: Kept for backward compatibility
        // Use clearAllSprites() for complete cleanup
        if (this.game.spriteLeft) {
            this.game.spriteLeft.style.opacity = '0';
            setTimeout(() => {
                this.game.spriteLeft.style.display = 'none';
            }, 300);
        }
        if (this.game.spriteRight) {
            this.game.spriteRight.style.opacity = '0';
            setTimeout(() => {
                this.game.spriteRight.style.display = 'none';
            }, 300);
        }
        this.game.currentSprites = { left: null, right: null };
    }

    // ========================================
    // CHARACTER POSITIONING (FOR INTERNAL BUBBLES)
    // ========================================

    determineCharacterPosition(sceneData) {
        // SMART BUBBLE POSITIONING using persistent sprite tracking

        if (!sceneData.character) return 'center';

        const charName = sceneData.character.toLowerCase();

        // ========================================
        // METHOD 1: Character name + sprite tracking (MOST ACCURATE)
        // ========================================

        // Extract base character name (remove modifiers like "internal", "thinking", etc.)
        let baseCharacter = null;
        if (charName.includes('tori')) {
            baseCharacter = 'tori';
        } else if (charName.includes('ronnie')) {
            baseCharacter = 'ronnie';
        }

        // If we identified the character, check where their sprite actually is
        if (baseCharacter) {
            // Check if this character's sprite is on the left
            if (this.game.currentSprites.left && this.game.currentSprites.left.toLowerCase().includes(baseCharacter)) {
                return 'left';
            }
            // Check if this character's sprite is on the right
            if (this.game.currentSprites.right && this.game.currentSprites.right.toLowerCase().includes(baseCharacter)) {
                return 'right';
            }
        }

        // ========================================
        // METHOD 2: Narration - position based on who's visible
        // ========================================

        if (charName.includes('narration')) {
            // If only one sprite is visible, put bubble near it
            const leftVisible = this.game.currentSprites.left !== null;
            const rightVisible = this.game.currentSprites.right !== null;

            if (leftVisible && !rightVisible) return 'left';
            if (rightVisible && !leftVisible) return 'right';
            // If both or neither visible, default to center
            return 'center';
        }

        // ========================================
        // METHOD 3: Fallback to any visible sprite
        // ========================================

        // If we couldn't determine position but sprites exist, pick the first visible one
        if (this.game.currentSprites.left !== null) return 'left';
        if (this.game.currentSprites.right !== null) return 'right';

        // ========================================
        // METHOD 4: Default center (no sprites visible)
        // ========================================

        return 'center';
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.SpriteController = SpriteController;
}

// ES Module export
export { SpriteController };
