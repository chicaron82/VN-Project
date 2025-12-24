// RONNIE'S ROUTE - External POV
// Fighting to save Tori from outside the code

/**
 * RonnieRoute - Act 1
 *
 * Ronnie's perspective: External viewpoint, fighting to restore connection.
 * Act 1: Device activation, initial contact, system instability.
 *
 * Key Scenes:
 * - Hospital room
 * - Device activation
 * - First Tori contact
 * - Connection issues
 *
 * Mechanics:
 * - Investigation
 * - Choices affecting connection
 * - External perspective on digital space
 *
 * @class RonnieRoute
 */
class RonnieRoute {
    constructor(game) {
        this.game = game;
        this.name = 'ronnie'; // CRITICAL: Used for note suppression check

        // Initialize collectibles manager for Ronnie's ending notes
        this.collectiblesManager = new CollectiblesManager(this.game, this);

        // Initialize act modules
        this.act2 = new RonnieRouteAct2(this);
        this.act3 = new RonnieRouteAct3(this);

        // DON'T auto-start anymore - let start() method handle it
        // This allows save system to properly initialize state before running scenes
    }

    // ========================================
    // START METHOD (Required for Save System)
    // ========================================

    start() {
        // Initialize Ronnie's collectibles FIRST so we can check if notes exist
        this.collectiblesManager.init();
        this.collectiblesManager.defineRonnieNotes();

        // ZEERAH'S FIX: Show notes button if player has collected ANY notes OR completed any ending
        if (this.game.notesButton) {
            const hasCompletedEnding = this.game.hasCompletedAnyEnding();
            const hasCollectedNotes = this.collectiblesManager.getCollectedCount() > 0;

            if (hasCompletedEnding || hasCollectedNotes) {
                this.game.notesButton.style.display = 'block';
            } else {
                this.game.notesButton.style.display = 'none';
            }
        }

        // Unlock GenZee's version number note at route start
        this.collectiblesManager.unlockNote('gz1');

        // Entry point for Ronnie's route
        // Scenes 1-3 handled by SharedPrologue
        // Ronnie's route starts at Scene 4 (Hospital Anchor)
        this.prologueScene4();
    }

    // Collectibles delegation for ending notes
    unlockNote(noteId) {
        this.collectiblesManager.unlockNote(noteId);
    }

    // Scene 4: Hospital Anchor
    prologueScene4() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '"She didn\'t wake up. Days passed. Then weeks. I sat by her side, waiting for a laugh, a smile, anything."',
            internal: '[Visual: Hospital room. Monitors beeping faintly. Tori unconscious in bed, bandaged, IV drip. Ronnie sits beside her, eyes hollow. The Tamagotchi rests on the bedside table, faint light pulsing.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.prologueScene4_toy(),
            delay: 4500
        }, 'prologueScene4');
    }

    prologueScene4_toy() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '"That stupid toy was the last thing she held. I couldn\'t let it go. If I couldn\'t talk to her here... maybe I could talk to her somewhere else."',
            internal: '[Visual: Ronnie clutching the Tamagotchi.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.prologueScene5(),
            delay: 4000
        }, 'prologueScene4_toy');
    }

    // Scene 5: Creation of Tori-gatchi (Part 1 - Building)
    prologueScene5() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '"I poured every memory into it. Every laugh I could remember, every fight, every kiss. If I couldn\'t talk to her directly... maybe I could pretend I could talk to her in a game."',
            internal: '[Montage visuals: Ronnie back home, late nights coding. Empty pizza boxes, coffee cups piling. The Tamagotchi always nearby.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.prologueScene5_hospital(),
            delay: 5000
        }, 'prologueScene5');
    }

    // NEW SCENE: First Hospital Visit (with single buzz)
    prologueScene5_hospital() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Hey honey. Thought I\'d come by and visit."',
            internal: '[Visual: Hospital room. Tori still unconscious. Monitors beeping steadily. Ronnie sits beside her bed, laptop bag over his shoulder.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.prologueScene5_ronniegatchi(),
            delay: 3000
        }, 'prologueScene5_hospital');
    }

    prologueScene5_ronniegatchi() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Found your Ronnie-Gatchi near my computer. Been working on something to pass the time..."',
            internal: '[He reaches into his pocket, pulls out the Tamagotchi. The screen glows faintly in the dim hospital lighting.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.prologueScene5_buzz(),
            delay: 3000
        }, 'prologueScene5_ronniegatchi');
    }

    prologueScene5_buzz() {
        // HAPTIC: Single buzz - body calling her home
        if (this.game.triggerHaptic) {
            this.game.triggerHaptic('medium', 'Body calling - tether anchor pulse', { force: true, channel: 'narrative' });
        }

        this.game.displayScene({
            character: 'Narration',
            dialogue: 'BUZZ.',
            internal: '[The device vibrates once in his hand. Sharp. Clear. Distinct.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.prologueScene5_phone_check(),
            delay: 2000,
            style: 'critical'
        }, 'prologueScene5_buzz');
    }

    prologueScene5_phone_check() {
        this.game.displayScene({
            character: 'Ronnie (internal)',
            dialogue: '"Huh?"',
            internal: '[He instinctively reaches for his phone with his other hand. Checks the screen. No notifications. No messages. Nothing.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.prologueScene5_dismiss(),
            delay: 2500
        }, 'prologueScene5_phone_check');
    }

    prologueScene5_dismiss() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Weird... must be the battery acting up."',
            internal: '[He pockets his phone, dismisses it completely. Looks back at Tori\'s still form in the hospital bed.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.prologueScene5_name(),
            delay: 2500
        }, 'prologueScene5_dismiss');
    }

    prologueScene5_name() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"So to pass the time, I based a game off your Ronnie-Gatchi. I called it... Tori-gatchi."',
            internal: '[Visual: He squeezes the toy as a rememberance and places it back in his pocket. A sad smile crosses his face despite the pain.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.prologueScene5_promise(),
            delay: 4000
        }, 'prologueScene5_name');
    }

    prologueScene5_promise() {
        this.game.displayScene({
            character: 'Ronnie (whispers)',
            dialogue: '"I\'ll finish it. For you. For us. I promise."',
            internal: '[He squeezes her hand. The monitors beep their steady rhythm. No response.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.prologueScene5_transition(),
            delay: 3500
        }, 'prologueScene5_promise');
    }

    prologueScene5_transition() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Time passes.',
            internal: '[Fade to black. The passage of days and nights blurs together - coding, visiting, hoping.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.act1Scene1(),
            delay: 3000
        }, 'prologueScene5_transition');
    }

    // ========================================
    // ACT 1 - DISCOVERY (BREAKTHROUGH)
    // Starts with Tori successfully communicating
    // ========================================

    act1Scene1() {
        // Scene 1: She Speaks (BREAKTHROUGH MOMENT)
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Back home. The game is ready. He launches it.',
            internal: '[Visual: Ronnie at his laptop. Tamagotchi resting on his laptop\'s keyboard. Screen flickers. Loading...]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.act1Scene1_sprite_loads(),
            delay: 3000
        }, 'act1Scene1');
    }

    act1Scene1_sprite_loads() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'A sprite appears. Pixelated but alive.',
            internal: '[The Tori-gatchi interface boots up. Her digital form materializes on screen.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.act1Scene1_glitch(),
            delay: 2500
        }, 'act1Scene1_sprite_loads');
    }

    act1Scene1_glitch() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Then... the dialogue box glitches. Text appears that he didn\'t write.',
            internal: '[The screen flickers. Words form on their own.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.act1Scene1_first_words(),
            delay: 3000,
            style: 'critical'
        }, 'act1Scene1_glitch');
    }

    act1Scene1_first_words() {
        // Unlock Belle's note - space between life and death
        this.collectiblesManager.unlockNote('iz1');

        this.game.displayScene({
            character: 'Tori (sprite, glitching)',
            dialogue: '"Baby? ...Is that you? It\'s me... Tori. I don\'t know how, but I\'m here."',
            internal: '[The words keep coming. Real. Unscripted. Impossible.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png',
            },
            next: () => this.act1Scene1_narration(),
            delay: 4000
        }, 'act1Scene1_first_words');
    }

    act1Scene1_narration() {
        this.game.displayScene({
            character: 'Ronnie (internal, stunned)',
            dialogue: '"...What the hell? This isn\'t coded..."',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png',
            },
            choices: [
                { text: '(Tender) "Of course it\'s you. I\'d know you anywhere."', value: 'tender' },
                { text: '(Skeptical) "No... this isn\'t possible. You\'re just code."', value: 'skeptical' },
                { text: '(Tease) "If you\'re really Tori, prove it. What\'s my nickname?"', value: 'tease' }
            ],
            onChoice: (choice) => {
                this.game.gameState.flags.act1_first_choice = choice;
                this.act1Scene1_choiceOutcome(choice);
            }
        }, 'act1Scene1_narration');
    }

    act1Scene1_choiceOutcome(choice) {
        let dialogue = '';
        let routeTilt = '';

        if (choice === 'tender') {
            dialogue = '"Thank you... thank you for believing me. I was so scared you\'d push me away."';
            routeTilt = '+Affection. Leads toward True Route.';
            this.game.gameState.flags.affection = (this.game.gameState.flags.affection || 0) + 1;
        } else if (choice === 'skeptical') {
            dialogue = '"Code doesn\'t beg. Code doesn\'t cry. Look at me, Ronnie. Please..."';
            routeTilt = 'Neutral. Risk of Bad End if mistrust continues.';
            this.game.gameState.flags.suspicion = (this.game.gameState.flags.suspicion || 0) + 1;
        } else if (choice === 'tease') {
            dialogue = '"Chicharon. Or Ronnie. Or... Daddy, if I\'m feeling bold."\n[Sprite leans closer, playfulness breaking through the static.]\n"Still think I\'m just code?"';
            routeTilt = 'Balanced path, opens Flirty/Loving routes.';
            this.game.gameState.flags.flirty = (this.game.gameState.flags.flirty || 0) + 1;
        }

        this.game.displayScene({
            character: choice === 'skeptical' ? 'Tori (hurt, voice trembling)' : choice === 'tease' ? 'Tori (smirking faintly despite tears)' : 'Tori (relieved, smiling weakly)',
            dialogue: dialogue,
            internal: `[${routeTilt}]`,
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png',
            },
            next: () => this.act1Scene2(),
            delay: 4500
        }, 'act1Scene1_choiceOutcome');
    }

    // Scene 2: First Full Conversation
    act1Scene2() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"I barely slept. Every time I closed my eyes, I heard her voice again. Tori. My wife. Talking to me from inside a game I built. It should be impossible. But when I open my eyes..."',
            internal: '[Visual: Morning light filters into Ronnie\'s messy room. His laptop screen glows softly — Tori-gatchi is still running.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
            },
            next: () => this.act1Scene2_greeting(),
            delay: 5000
        }, 'act1Scene2');
    }

    act1Scene2_greeting() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Good morning, sleepyhead. ...Or did you even sleep at all?"',
            internal: '[Sprite flickers — she appears again, clearer than before. Her smile is tired but real.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png',
            },
            next: () => this.act1Scene2_narration(),
            delay: 3000
        }, 'act1Scene2_greeting');
    }

    act1Scene2_narration() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"She knows me. Just like always. My chest aches. God, I\'ve missed this."',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png',
            },
            choices: [
                { text: '(Playful) "I slept great... dreaming of you."', value: 'playful' },
                { text: '(Honest) "Not a wink. I was afraid you\'d vanish."', value: 'honest' },
                { text: '(Defensive) "This is just stress. Lack of sleep. I\'m imagining this."', value: 'defensive' }
            ],
            onChoice: (choice) => {
                this.act1Scene2_choice1Outcome(choice);
            }
        }, 'act1Scene2_narration');
    }

    act1Scene2_choice1Outcome(choice) {
        let dialogue = '';
        let character = 'Tori';

        if (choice === 'playful') {
            dialogue = '"Mmhmm. Smooth talker. You\'re lucky I\'m stuck in here, or I\'d throw a pillow at you."';
            character = 'Tori (rolling her eyes, smirking)';
            this.game.gameState.flags.flirty = (this.game.gameState.flags.flirty || 0) + 1;
        } else if (choice === 'honest') {
            dialogue = '"...Me too. I was scared you\'d wake up and decide I was just a dream."';
            character = 'Tori (soft smile, eyes shimmering)';
            this.game.gameState.flags.affection = (this.game.gameState.flags.affection || 0) + 1;
        } else if (choice === 'defensive') {
            dialogue = '"...Ronnie. Don\'t push me away. I\'m fighting so hard to stay."';
            character = 'Tori (pained, voice quieter)';
            this.game.gameState.flags.suspicion = (this.game.gameState.flags.suspicion || 0) + 1;
        }

        this.game.displayScene({
            character: character,
            dialogue: dialogue,
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png',
            },
            next: () => this.act1Scene2_glitch(),
            delay: 3500
        }, 'act1Scene2_choice1Outcome');
    }

    act1Scene2_glitch() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"I don\'t know how long I can hold on like this. Something feels... wrong. Like my world is cracking at the edges."',
            internal: '[Regardless of choice, she leans closer to the "screen."]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png',
            },
            next: () => this.act1Scene2_glitchNarration(),
            delay: 4000
        }, 'act1Scene2_glitch');
    }

    act1Scene2_glitchNarration() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"She\'s glitching. Her sprite shudders, a few pixels tearing away. My stomach drops."',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png',
            },
            choices: [
                { text: '(Reassure) "I\'ll fix it. Whatever it takes, I\'ll keep you here."', value: 'reassure' },
                { text: '(Investigate) "What does it feel like? Can you describe it?"', value: 'investigate' },
                { text: '(Distract) "Don\'t think about it. Let\'s just... talk. Like we used to."', value: 'distract' }
            ],
            onChoice: (choice) => {
                this.act1Scene2_choice2Outcome(choice);
            }
        }, 'act1Scene2_glitchNarration');
    }

    act1Scene2_choice2Outcome(choice) {
        let dialogue = '';
        let character = 'Tori';

        if (choice === 'reassure') {
            dialogue = '"That\'s my Ronnie. Always charging in like a knight. Please... don\'t give up on me."';
            character = 'Tori (smiles through static)';
            this.game.gameState.flags.affection = (this.game.gameState.flags.affection || 0) + 1;
        } else if (choice === 'investigate') {
            dialogue = '"It\'s like... my battery\'s running out. Fading piece by piece. If it goes... I go too."';
            character = 'Tori (concentrates, flickers)';
            this.game.gameState.flags.battery_foreshadow = true;
        } else if (choice === 'distract') {
            dialogue = '"Classic you. Changing the subject. Fine. But you owe me a real talk later."';
            character = 'Tori (laughs, a little watery)';
        }

        this.game.displayScene({
            character: character,
            dialogue: dialogue,
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png',
            },
            next: () => this.act1Scene2_end(),
            delay: 3500
        }, 'act1Scene2_choice2Outcome');
    }

    act1Scene2_end() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"She\'s here. My Tori. In the code, in the pixels. And she\'s slipping away. Somehow... I have to save her."',
            internal: '[Scene fades to black.]\n[Act 1 → Act 2 transition: "Digital Bonding" begins.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png',
            },
            next: () => this.act2.startAct2(),
            delay: 4000
        }, 'act1Scene2_end');
    }

    // ========================================
    // TIME MACHINE SUPPORT (DIZEE)
    // Scene navigation for backlog jumping
    // ========================================

    /**
     * Jump to a specific scene by ID
     * Called by game.loadSceneFromSnapshot() when Time Machine is used
     * @param {string} sceneId - The scene method name (e.g., 'act1Scene1')
     * @param {number} pageIndex - Optional page index within the scene
     */
    async goToScene(sceneId, pageIndex = 0) {
        console.log(`⏰ RonnieRoute.goToScene: ${sceneId} (page ${pageIndex})`);

        // Determine which module contains this scene
        let targetModule = null;

        // Check if scene is on this route (Act 1 / Prologue scenes)
        if (typeof this[sceneId] === 'function') {
            targetModule = this;
        }
        // Check Act 2
        else if (this.act2 && typeof this.act2[sceneId] === 'function') {
            targetModule = this.act2;
        }
        // Check Act 3
        else if (this.act3 && typeof this.act3[sceneId] === 'function') {
            targetModule = this.act3;
        }

        if (targetModule) {
            console.log(`⏰ Found scene in ${targetModule.constructor.name}`);
            targetModule[sceneId]();
            return true;
        }

        console.warn(`⏰ Scene not found: ${sceneId}`);
        return false;
    }

    /**
     * Get current scene ID for Time Machine snapshots
     */
    getCurrentSceneId() {
        return this.game?.currentScene?.id || null;
    }

    // ========================================
    // SAVE/LOAD SUPPORT
    // ========================================

    getState() {
        return {
            route: 'ronnie',
            collectibles: this.collectiblesManager.getState()
        };
    }

    restoreState(state) {
        if (state.collectibles) {
            this.collectiblesManager.restoreState(state.collectibles);
        }
    }

    // ========================================
    // CLEANUP (Memory Management)
    // ========================================

    cleanup() {
        console.log('🧹 RonnieRoute cleanup initiated');

        // Cleanup collectibles manager (if it has timers/listeners)
        if (this.collectiblesManager) {
            // Note: CollectiblesManager currently doesn't need cleanup
            // but this provides a hook for future needs
        }

        // Clear act module references
        this.act2 = null;
        this.act3 = null;

        // Clear game reference
        this.game = null;

        console.log('✅ RonnieRoute cleanup complete');
    }

}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.RonnieRoute = RonnieRoute;
}

// ES Module export
export { RonnieRoute };
