// ========================================
// TORI'S ROUTE - ACT 2 (V4 - VISUAL INTEGRATION)
// Memory Corruption & Body Anchor Discovery
// SPRITES & BACKGROUNDS INTEGRATED
// ECHO SPRITES FIXED: RIGHT position, three-echoes-sprite.png
// FIXED: getTetherState() call now works properly
// ========================================

class ToriAct2 {
    constructor(route) {
        this.route = route;
        this.game = route.game;
    }

    start() {
        // Unblock saves - Tori proved Despair wrong
        this.game.saveManager.unblockSaves();

        // Echo growth: Act 2 - Hope is rising
        this.game.setEchoGrowthStage('act2');

        this.beat1();
    }

    // ========================================
    // BEAT 1: ICE CREAM DATE
    // Memory Corruption - System Takeover
    // (Originally Beat 2)
    // ========================================

    beat1() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Digital park scene. Pixelated cherry blossoms. Tori and Ronnie\'s sprites walking together.',
            internal: '[Visual: First "date" in the digital space. Ronnie coded a scene for them.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat1_iceCream(),
            delay: 3500
        }, 'beat1');
    }

    beat1_iceCream() {
        // ========================================
        // FIXED POINT IN TIME - Despair's Hijack
        // If player reached this via backlog jump (not fresh retry),
        // auto-skip the choice - they can't change what happened
        // ========================================
        const isBacklogReplay = this.game.gameState?.flags?.isBacklogJump;

        if (isBacklogReplay) {
            // Clear the flag (consumed)
            this.game.gameState.flags.isBacklogJump = false;

            // Show notification that this is a fixed point
            if (this.game.statusNotification) {
                this.game.statusNotification.show({
                    type: 'fixed-point',
                    icon: '🔒',
                    message: 'Fixed Event - Cannot alter',
                    duration: 2000,
                    priority: 'high'
                });
            }

            // Echo Memory: Despair mocks them for trying
            if (this.game.echoMemory) {
                setTimeout(() => {
                    this.game.echoMemory.triggerEchoComment('despair', 'despairHijack', 'beat1_iceCream');
                }, 500);
            }

            console.log('🔒 Fixed point detected - auto-skipping to hijacked outcome');

            // Skip directly to the hijacked response (no choice shown)
            this.playerIntendedChoice = 'fixed_point_bypass';
            this.beat1_despairOverride();
            return;
        }

        // ========================================
        // RANDOMIZED HIJACK CHOICES
        // Different options each playthrough to prevent pattern recognition
        // ========================================
        const HIJACK_CHOICE_POOL = [
            { text: 'Thank him (That\'s sweet!)', value: 'thanks', isCorrect: true },
            { text: 'Be playful (You remembered!)', value: 'playful', isCorrect: true },
            { text: 'Smile and take it', value: 'smile', isCorrect: true },
            { text: 'Ask why he remembered', value: 'why', isCorrect: true },
            { text: 'Ask for Tiger Tail instead', value: 'tiger_tail', isCorrect: false },
            { text: 'Say nothing (just smile)', value: 'silent', isCorrect: false },
        ];

        // Pick 2 correct + 1 wrong (Tiger Tail is always the forced outcome)
        const correctChoices = HIJACK_CHOICE_POOL.filter(c => c.isCorrect);
        const wrongChoices = HIJACK_CHOICE_POOL.filter(c => !c.isCorrect);

        // Shuffle and pick
        const shuffledCorrect = correctChoices.sort(() => Math.random() - 0.5).slice(0, 2);
        const randomWrong = wrongChoices[Math.floor(Math.random() * wrongChoices.length)];

        // Combine and shuffle final choices
        const finalChoices = [...shuffledCorrect, randomWrong].sort(() => Math.random() - 0.5);

        // Track attempt count for "Almost" effect
        const hijackAttempts = this.game.echoMemory?.memory?.wrongChoiceRepeats?.['beat1_iceCream'] || 0;

        // Normal flow - show the choice (first playthrough or fresh retry)
        this.game.displayScene({
            character: 'Ronnie (sprite)',
            dialogue: '"I coded in your favorite. Chocolate chip ice cream."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'right'
            },
            choices: finalChoices.map(c => ({ text: c.text, value: c.value })),
            onChoice: (playerChoice) => {
                // Store what player WANTED to say
                this.playerIntendedChoice = playerChoice;

                // Find if player chose correct option
                const chosenOption = finalChoices.find(c => c.value === playerChoice);
                const choseCorrect = chosenOption?.isCorrect || false;

                // Track choice in Echo Memory
                if (this.game.echoMemory) {
                    this.game.echoMemory.recordChoice('beat1_iceCream', finalChoices.findIndex(c => c.value === playerChoice));
                }

                // THE "ALMOST" TEASE: On 5+ attempts with correct choice
                if (hijackAttempts >= 4 && choseCorrect) {
                    // Show they almost had it - green flash then glitch
                    this.showAlmostTease(() => {
                        this.game.echoMemory?.triggerEchoComment('despair', 'despairHijack', 'beat1_iceCream');
                        this.beat1_despairOverride();
                    });
                    return;
                }

                // Echo Memory: Despair's hijack comment (Belle's meta-awareness)
                if (this.game.echoMemory && choseCorrect) {
                    // Only trigger if player tried to choose a correct option
                    this.game.echoMemory.triggerEchoComment('despair', 'despairHijack', 'beat1_iceCream');
                }

                // But Despair forces her outcome anyway
                this.beat1_despairOverride();
            },
            delay: 3000
        }, 'beat1_iceCream');
    }

    // ========================================
    // THE "ALMOST" TEASE EFFECT
    // Shows player they picked correctly... then rips it away
    // ========================================
    showAlmostTease(callback) {
        // Brief "success" notification that gets overridden
        if (this.game.statusNotification) {
            this.game.statusNotification.show({
                type: 'save', // Green styling
                icon: '✓',
                message: 'Correct choice!',
                duration: 400,
                priority: 'high'
            });
        }

        // After 400ms - GLITCH and override
        setTimeout(() => {
            // Screen glitch effect
            if (this.game.triggerSensoryFeedback) {
                this.game.triggerSensoryFeedback('criticalGlitch');
            }

            // Despair's override message
            if (this.game.statusNotification) {
                this.game.statusNotification.show({
                    type: 'echo',
                    icon: '🖤',
                    message: 'So close. But I decide.',
                    duration: 2500,
                    priority: 'critical',
                    pulse: true
                });
            }

            console.log('💀 "Almost" tease triggered - correct choice overridden');

            // Continue after dramatic pause
            setTimeout(callback, 800);
        }, 400);
    }


    beat1_despairOverride() {
        // First: Show what player INTENDED to choose (if not Tiger Tail)
        if (this.playerIntendedChoice !== 'tiger_tail') {
            this.game.displayScene({
                character: 'Narration',
                dialogue: '',
                internal: '[She opens her mouth to respond... but the words that come out aren\'t hers.]',
                background: 'assets/digitalSpace.png',
                sprites: {
                    left: 'assets/full-sprite-tori.webp',
                    right: 'assets/full-sprite-ronnie.webp'
                },
                next: () => this.beat1_hijackedResponse(),
                delay: 2000
            }, 'beat1_despairInterference');
        } else {
            // Player chose Tiger Tail - skip hijack narration
            this.beat1_hijackedResponse();
        }
    }

    beat1_hijackedResponse() {
        // Show what Tori actually says (overridden by Despair)
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Wait... Tiger Tail. I want Tiger Tail."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat1_toriRealization(),
            delay: 2500
        }, 'beat1_despairOverride');
    }

    beat1_toriRealization() {
        // ESCALATING TORI REACTIONS
        // Shows increasing awareness of Despair's control across loops
        const hijackAttempts = this.game.echoMemory?.memory?.wrongChoiceRepeats?.['beat1_iceCream'] || 0;

        const toriReactions = [
            { character: 'Tori (internal, confused)', dialogue: '"What? No—that\'s not what I meant to say! I hate Tiger Tail!"' },
            { character: 'Tori (internal, alarmed)', dialogue: '"Why did I say that? I didn\'t mean— those weren\'t my words!"' },
            { character: 'Tori (internal, fighting)', dialogue: '"No, wait, that\'s not— [voice cuts off] ...she won\'t let me..."' },
            { character: 'Tori (internal, breaking)', dialogue: '"She\'s in my head. I can feel her. I can\'t fight her."' },
        ];

        const reactionIndex = Math.min(hijackAttempts, toriReactions.length - 1);
        const reaction = toriReactions[reactionIndex];

        // Trigger conflicting echoes on 3+ attempts
        if (hijackAttempts >= 3 && this.game.echoMemory) {
            this.game.echoMemory.triggerConflictingEchoes();
        }

        this.game.displayScene({
            character: reaction.character,
            dialogue: reaction.dialogue,
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat1_confusion(),
            delay: 3000,
            style: hijackAttempts >= 2 ? 'critical' : undefined
        }, 'beat1_toriRealization');
    }

    beat1_confusion() {
        this.game.displayScene({
            character: 'Ronnie (sprite, concerned)',
            dialogue: '"Tiger Tail? But... you always said you hated that flavor."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'right'
            },
            next: () => this.beat1_echoesReact(),
            delay: 3000
        }, 'beat1_confusion');
    }

    beat1_echoesReact() {
        // Unlock CZ's memory degradation horror note
        this.route.unlockNote('cz2');

        // Unlock Z's Cassandra framework note - Tori "knew" something she shouldn't
        this.route.unlockNote('z3');

        // Unlock Z's Echo timeline theory - all three Echoes speaking reveals their nature
        this.route.unlockNote('z6');

        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "Oh no..."\nEcho 2: "Not yet. Please not yet."\nDespair: "There it is. Memory corruption. Your mind\'s breaking down."', background: 'assets/digitalSpace.png',
            sprites: {
                right: 'echoes'
            },
            next: () => this.beat1_systemTakeover(),
            delay: 4000
        }, 'beat1_echoesReact');
    }

    beat1_systemTakeover() {
        this.game.displayScene({
            character: 'Tori (sprite, voice not hers)',
            dialogue: '"Tiger Tail sounds perfect!"',
            internal: '[Her sprite spoke. But she didn\'t say that. The SYSTEM did.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat1_toriHorror(),
            delay: 3000,
            style: 'critical'
        }, 'beat1_systemTakeover');
    }

    beat1_toriHorror() {
        this.game.displayScene({
            character: 'Tori (internal, panicking)',
            dialogue: '"That wasn\'t me! I didn\'t say that!"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat1_freeze(),
            delay: 2500
        }, 'beat1_toriHorror');
    }

    beat1_freeze() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Her sprite freezes mid-laugh. System dialogue box flickers. Then she\'s back. Ronnie looks concerned.',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat1_ronnieNotice(),
            delay: 3500
        }, 'beat1_freeze');
    }

    beat1_ronnieNotice() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Tori? Not againâ€”"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'right'
            },
            next: () => this.beat1_choice(),
            delay: 2000
        }, 'beat1_ronnieNotice');
    }

    beat1_choice() {
        this.game.displayScene({
            character: 'Tori (typing frantically)',
            dialogue: '"I blacked out. What just happened?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            choices: [
                { text: '[Tell him the truth: memory corruption]', value: 'truth' },
                { text: '[Downplay it: just a glitch]', value: 'downplay' },
                { text: '[Panic: I\'m breaking apart]', value: 'panic' }
            ],
            onChoice: (choice) => {
                if (choice === 'truth') {
                    this.route.addRoutePoints('true', 1);
                    this.beat1_truth();
                } else if (choice === 'downplay') {
                    this.route.addRoutePoints('digitalForever', 1);
                    this.beat1_downplay();
                } else {
                    this.route.addRoutePoints('bad', 1);
                    this.beat1_panic();
                }
            }
        }, 'beat1_choice');
    }

    beat1_truth() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"My memories are corrupting. The system took over my voice. I\'m scared."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat1_5_glitching(),
            delay: 3000
        }, 'beat1_truth');
    }

    beat1_downplay() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"Just a glitch. I\'m fine. Keep going."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat1_5_glitching(),
            delay: 3000
        }, 'beat1_downplay');
    }

    beat1_panic() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"I\'m breaking apart. I can feel it. I\'m losing pieces of myself."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat1_5_glitching(),
            delay: 3000
        }, 'beat1_panic');
    }

    // ========================================
    // ========================================
    // BEAT 1.5: THE UPLOAD ATTEMPT & REVELATION
    // Tori's POV of Ronnie's failed cloud upload
    // "You can't upload a soul"
    // ========================================

    beat1_5_glitching() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Something\'s wrong. I\'m... fragmenting. The code can\'t hold me..."',
            internal: '[Visual: Her sprite flickering. Data corruption spreading.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp'
            },
            next: () => this.beat1_5_ronnieTyping(),
            delay: 3500
        }, 'beat1_5_glitching');
    }

    beat1_5_ronnieTyping() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Through the laptop screen. Ronnie typing frantically.',
            internal: '[Visual: Code scrolling. Upload dialogs. Progress bars.]',
            background: 'assets/apartment.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat1_5_upload(),
            delay: 3000
        }, 'beat1_5_ronnieTyping');
    }

    beat1_5_upload() {
        this.game.displayScene({
            character: 'Ronnie (desperate)',
            dialogue: '"She\'s trapped in the laptop. Limited processing. If I upload to the cloud... more resources... she\'ll stabilize!"',
            internal: '[Visual: Upload progress bar. 32%... 85%... 100%]',
            background: 'assets/apartment.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat1_5_stillGlitching(),
            delay: 4500
        }, 'beat1_5_upload');
    }

    beat1_5_stillGlitching() {
        this.game.displayScene({
            character: 'Tori (glitching)',
            dialogue: '"Ronnie... I\'m... still here. Still stuck. It didn\'t... work..."',
            internal: '[Visual: Nothing changed. Still fragmenting. Still breaking apart.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat1_5_confusion(),
            delay: 4000
        }, 'beat1_5_stillGlitching');
    }

    beat1_5_confusion() {
        this.game.displayScene({
            character: 'Ronnie (confused)',
            dialogue: '"But... you contacted me through the laptop game. I thought you were IN the laptop!"',
            internal: '[Visual: His face. Confusion. Frustration. He doesn\'t understand.]',
            background: 'assets/apartment.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat1_5_realization(),
            delay: 3500
        }, 'beat1_5_confusion');
    }

    beat1_5_realization() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"He thinks I\'m IN the laptop. That\'s why the upload didn\'t work. He doesn\'t know..."',
            internal: '[Visual: Understanding dawns. She needs to tell him.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp'
            },
            next: () => this.beat1_5_revelation(),
            delay: 3500
        }, 'beat1_5_realization');
    }

    beat1_5_revelation() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"I\'m not IN the game, Ronnie."',
            internal: '[Visual: Her voice cutting through. Clear. Focused.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat1_5_soulLine(),
            delay: 3000
        }, 'beat1_5_revelation');
    }

    beat1_5_soulLine() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"You can\'t upload a soul. I\'m in the Tamagotchi."',
            internal: '[Visual: Silence. The weight of it. The truth spoken.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat1_5_explainJumping(),
            delay: 5000,
            style: 'critical'
        }, 'beat1_5_soulLine');
    }

    beat1_5_explainJumping() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"I\'ve been JUMPING to the laptop so I could talk to you. The Tamagotchi has to be touching whatever I jump to."',
            internal: '[Visual: His expression. Understanding starting to form.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat1_5_question(),
            delay: 4500
        }, 'beat1_5_explainJumping');
    }

    beat1_5_question() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"So how do we get you to wake up? How do you get back to your body?"',
            internal: '[Visual: Both of them. The question hanging.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat1_5_buzzing(),
            delay: 3500
        }, 'beat1_5_question');
    }

    beat1_5_buzzing() {
        // HAPTIC: Realization pulse
        if (this.game.triggerHaptic) {
            this.game.triggerHaptic('medium', 'The buzzing - Tori POV');
        }

        this.game.displayScene({
            character: 'Ronnie (realizing)',
            dialogue: '"Wait... the buzzing. The Tamagotchi has been buzzing. And ONLY when I visit you at the hospital!"',
            internal: '[Visual: His eyes widen. The pattern clicks.]',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat1_5_toriConfirms(),
            delay: 4500
        }, 'beat1_5_buzzing');
    }

    beat1_5_toriConfirms() {
        this.game.displayScene({
            character: 'Tori (softly)',
            dialogue: '"I\'ve been feeling it too. The pull. Every time you visit... my body is calling me home."',
            internal: '[Visual: Memory flashes. The warmth. The pull. The connection.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat1_5_solution(),
            delay: 4000
        }, 'beat1_5_toriConfirms');
    }

    beat1_5_solution() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Then that\'s it. The Tamagotchi needs to be touching your body. Physical contact. That\'s how you jump back!"',
            internal: '[Visual: Both of them. The solution found. Hope surges.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat1_5_phoneRing(),
            delay: 5000
        }, 'beat1_5_solution');
    }

    beat1_5_phoneRing() {
        // HAPTIC: Phone vibration - urgent
        if (this.game.triggerHaptic) {
            this.game.triggerHaptic('heavy', 'Phone call - crisis (Tori POV)', { force: true });
        }

        this.game.displayScene({
            character: 'Narration',
            dialogue: '[RING RING RING]',
            internal: '[Visual: Ronnie\'s phone. Hospital calling. His face drains of color.]',
            background: 'assets/apartment.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat1_5_hospitalCall(),
            delay: 3000
        }, 'beat1_5_phoneRing');
    }

    beat1_5_hospitalCall() {
        this.game.displayScene({
            character: 'Nurse (phone)',
            dialogue: '"Mr. Santos? This is St. Mercy. Your wife\'s vitals are dropping. You need to come now."',
            internal: '[Visual: Panic. Fear. Time running out.]',
            background: 'assets/apartment.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat1_5_race(),
            delay: 4000,
            style: 'critical'
        }, 'beat1_5_hospitalCall');
    }

    beat1_5_race() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"We know how to save me. But we\'re running out of time."',
            internal: '[Visual: Ronnie grabs the Tamagotchi. Runs for the door. The race begins.]',
            background: 'assets/apartment.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat2(),
            delay: 4000
        }, 'beat1_5_race');
    }

    // ========================================
    // BEAT 2: HOSPITAL VISIT #1
    // Body Anchor - Dismissed
    // (Originally Beat 3)
    // ========================================

    beat2() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Hospital room. Ronnie places the Tamagotchi on her bedside table.',
            internal: '[Visual: Through device screen - her body on the bed. Monitors beeping.]',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat2_warmth(),
            delay: 3500
        }, 'beat2');
    }

    beat2_warmth() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"That feeling again... warmth. The pull toward my body."',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat2_buzz(),
            delay: 3000
        }, 'beat2_warmth');
    }

    beat2_buzz() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The Tamagotchi buzzes. Synced with her heartbeat monitor.',
            internal: '[Same rhythm. Same pulse.]',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat2_ronnieNotice(),
            delay: 3000,
            style: 'critical'
        }, 'beat2_buzz');
    }

    beat2_ronnieNotice() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Weird. Battery must be dying."',
            internal: '[He dismisses it. Doesn\'t see the pattern yet.]',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat2_echoesKnow(),
            delay: 3000
        }, 'beat2_ronnieNotice');
    }

    beat2_echoesKnow() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "He felt it too. The buzz."\nEcho 2: "But he doesn\'t understand what it means."\nDespair: "He never understood. Not until it was too late."', background: 'assets/digitalSpace.png',
            sprites: {
                right: 'echoes'
            },
            next: () => this.beat3(),
            delay: 4000
        }, 'beat2_echoesKnow');
    }

    // ========================================
    // BEAT 3: DIGITAL MAZE BREAKDOWN
    // Corruption Intensifies
    // (Originally Beat 4)
    // ========================================

    beat3() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Back in the digital space. A simple maze game Ronnie coded. "Think fast" gameplay.',
            internal: '[Visual: Sprite-Tori navigating a pixelated maze. Cute and casual.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat3_maze(),
            delay: 3500
        }, 'beat3');
    }

    beat3_maze() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Left or right?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'right'
            },
            next: () => this.beat3_confusion(),
            delay: 2000
        }, 'beat3_maze');
    }

    beat3_confusion() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Wait... which way did we come from? I can\'t remember..."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat3_systemTakeover(),
            delay: 3000
        }, 'beat3_confusion');
    }

    beat3_systemTakeover() {
        this.game.displayScene({
            character: 'Tori (sprite, automatic)',
            dialogue: '"Left!"',
            internal: '[She didn\'t choose that. The SYSTEM did. Again.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat3_wrongTurn(),
            delay: 2500,
            style: 'critical'
        }, 'beat3_systemTakeover');
    }

    beat3_wrongTurn() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Dead end. Ronnie backtracks. But Tori is frozen, staring at the wall.',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat3_toriInternal(),
            delay: 3000
        }, 'beat3_wrongTurn');
    }

    beat3_toriInternal() {
        this.game.displayScene({
            character: 'Tori (internal, panicking)',
            dialogue: '"I\'m not controlling my sprite anymore. I\'m just... watching."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat3_echoesRespond(),
            delay: 3000
        }, 'beat3_toriInternal');
    }

    beat3_echoesRespond() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "It\'s getting worse."\nEcho 2: "The system\'s taking over."\nDespair: "You\'re becoming a passenger in your own existence."', background: 'assets/digitalSpace.png',
            sprites: {
                right: 'echoes'
            },
            next: () => this.beat4(),
            delay: 4000
        }, 'beat3_echoesRespond');
    }

    // ========================================
    // BEAT 4: HOSPITAL VISIT #2
    // Body Anchor - Recognition
    // (Originally Beat 5)
    // ========================================

    beat4() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Hospital room again. Ronnie adjusts her blankets. The Tamagotchi is on the table.',
            internal: '[Visual: Her body. Still. Breathing. The device nearby.]',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat4_feeling(),
            delay: 3500
        }, 'beat4');
    }

    beat4_feeling() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"There it is again. That pull. That warmth. It\'s coming from my body."',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat4_understanding(),
            delay: 3000
        }, 'beat4_feeling');
    }

    beat4_understanding() {
        this.game.displayScene({
            character: 'Tori (internal, realization)',
            dialogue: '"Wait... when I\'m near my body, I feel more... real. More present. The corruption slows."',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat4_choice(),
            delay: 3500,
            style: 'critical'
        }, 'beat4_understanding');
    }

    beat4_choice() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"This feeling... do I tell him? Or keep searching for proof?"',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            choices: [
                { text: '[Tell Ronnie about the body connection]', value: 'tell' },
                { text: '[Wait - need more proof first]', value: 'wait' }
            ],
            onChoice: (choice) => {
                if (choice === 'tell') {
                    this.route.addRoutePoints('true', 1);
                    this.beat4_tell();
                } else {
                    this.route.addRoutePoints('digitalForever', 1);
                    this.beat4_wait();
                }
            }
        }, 'beat4_choice');
    }

    beat4_tell() {
        this.game.displayScene({
            character: 'Tori (typing urgently)',
            dialogue: '"Ronnie - when you visit my body, I feel more stable. I think there\'s a connection."',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat4_ronnieResponse(),
            delay: 3000
        }, 'beat4_tell');
    }

    beat4_wait() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"The maze was glitchy. System acting weird again."',
            internal: '[She hides the truth. Needs more proof.]',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat4_ronnieResponse(),
            delay: 3000
        }, 'beat4_wait');
    }

    beat4_ronnieResponse() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"I\'ll keep coming. Every day. I promise."',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat5(),
            delay: 2500
        }, 'beat4_ronnieResponse');
    }

    // ========================================
    // BEAT 5: MEMORY FRAGMENT NIGHTMARE
    // Corruption Accelerates
    // (Originally Beat 6)
    // ========================================

    beat5() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Digital space. A memory fragment loads. Their first date. Coffee shop.',
            internal: '[Visual: Warm lighting. Cozy scene. But the edges are glitching.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat5_memoryStart(),
            delay: 3500
        }, 'beat5');
    }

    beat5_memoryStart() {
        this.game.displayScene({
            character: 'Ronnie (sprite, in memory)',
            dialogue: '"I can\'t believe you ordered decaf."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'right'
            },
            next: () => this.beat5_toriBlank(),
            delay: 2500
        }, 'beat5_memoryStart');
    }

    beat5_toriBlank() {
        this.game.displayScene({
            character: 'Tori (internal, horrified)',
            dialogue: '"I... I don\'t remember this. I don\'t remember what I said next."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat5_systemFills(),
            delay: 3000
        }, 'beat5_toriBlank');
    }

    beat5_systemFills() {
        this.game.displayScene({
            character: 'Tori (sprite, voice not hers)',
            dialogue: '"[MEMORY CORRUPTED - APPROXIMATION: "You know I hate caffeine."]"',
            internal: '[The system filled in the blank. With a guess. Her memory is gone.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat5_horror(),
            delay: 4000,
            style: 'critical'
        }, 'beat5_systemFills');
    }

    beat5_horror() {
        this.game.displayScene({
            character: 'Tori (internal, breaking)',
            dialogue: '"That\'s not what I said. I don\'t know what I said. But that wasn\'t it."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat5_echoesReact(),
            delay: 3000
        }, 'beat5_horror');
    }

    beat5_echoesReact() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "She\'s losing herself."\nEcho 2: "Piece by piece."\nDespair: "Soon there won\'t be enough left to save."', background: 'assets/digitalSpace.png',
            sprites: {
                right: 'echoes'
            },
            next: () => this.beat6(),
            delay: 4000
        }, 'beat5_echoesReact');
    }

    // ========================================
    // BEAT 6: HOSPITAL VISIT #3
    // Body Anchor - BREAKTHROUGH
    // (Originally Beat 7)
    // ========================================

    beat6() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Hospital room. Ronnie holds her hand. The Tamagotchi buzzes loudly.',
            internal: '[Visual: Physical contact. The buzz intensifies. Synced perfectly.]',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat6_connection(),
            delay: 3500
        }, 'beat6');
    }

    beat6_connection() {
        this.game.displayScene({
            character: 'Tori (internal, CLARITY)',
            dialogue: '"OH. Oh my god. It\'s the BODY. My body is the anchor. The bridge. The connection."',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat6_realization(),
            delay: 3500,
            style: 'critical'
        }, 'beat6_connection');
    }

    beat6_realization() {
        this.game.displayScene({
            character: 'Tori (internal, urgent)',
            dialogue: '"That\'s why I feel more real when he visits. Why the corruption slows. My body is keeping me tethered!"',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat6_echoesReact(),
            delay: 4000
        }, 'beat6_realization');
    }

    beat6_echoesReact() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 2: "She figured it out..."\nEcho 1: "Faster than we did."\nDespair: "And it won\'t matter. The body is dying. The bridge is burning."', background: 'assets/digitalSpace.png',
            sprites: {
                right: 'echoes'
            },
            next: () => this.beat7(),
            delay: 4000
        }, 'beat6_echoesReact');
    }

    // ========================================
    // BEAT 7: THE CRISIS CALL
    // Final Sabotage Attempt - Leads to Act 3
    // (Originally Beat 8)
    // ========================================

    beat7() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Alarms. Monitors screaming. The digital space shakes.',
            internal: '[Visual: Everything glitching violently. Tori fragmenting. Tether dropping rapidly.]',
            background: 'assets/digitalSpace.png',
            next: () => this.beat7_tether(),
            delay: 3000
        }, 'beat7');
    }

    beat7_tether() {
        // Crisis causes tether drop
        this.route.tetherLevel = Math.max(0, this.route.tetherLevel - 15);
        this.route.updateTether(-15, 'Crisis - monitors screaming');

        this.game.displayScene({
            character: 'System',
            dialogue: '[COHERENCE DROPPING: -15%]',
            internal: '[The crisis is draining her. Hold on!]',
            background: 'assets/digitalSpace.png',
            next: () => this.beat7_tori(),
            delay: 2000,
            style: 'critical'
        }, 'beat7_tether');
    }

    beat7_tori() {
        this.game.displayScene({
            character: 'Tori (internal, pained)',
            dialogue: '"It\'s too dark... I can\'t hold on..."',
            background: 'assets/digitalSpace.png',
            next: () => this.beat7_despairAttempt(),
            delay: 3000
        }, 'beat7_tori');
    }

    beat7_despairAttempt() {
        // Unlock ZR's Despair Echo origin note
        this.route.unlockNote('zr2');

        const tetherState = this.route.getTetherState();

        if (tetherState === 'despair') {
            // LOW TETHER: Despair can lock out the "fight" option
            this.game.displayScene({
                character: 'Despair Echo (DOMINANT - forcing)',
                dialogue: '"Let go. MAKE him let go. Tell him to upload. Trap yourself forever. It\'s kinder than watching him fail. YOU HAVE NO CHOICE."', internal: '[Despair is overwhelming. She\'s taking control. The fight option feels... blocked.]',
                background: 'assets/digitalSpace.png',
                sprites: {
                    right: 'echoes'
                },
                next: () => this.beat7_choiceLocked(),
                delay: 4000
            }, 'beat7_despairAttempt_locked');
        } else {
            // MEDIUM/HIGH TETHER: All options available
            this.game.displayScene({
                character: 'Despair Echo (attempting)',
                dialogue: '"Let go. Make him let go. Tell him to upload. It\'s kinder than watching him fail."', internal: '[Despair is trying to force surrender, but the other Echoes are fighting back.]',
                background: 'assets/digitalSpace.png',
                sprites: {
                    right: 'echoes'
                },
                next: () => this.beat7_choice(),
                delay: 4000
            }, 'beat7_despairAttempt_normal');
        }
    }

    beat7_choiceLocked() {
        // LOW TETHER: "Fight" option is grayed out/locked
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Do I fight Despair... wait, I can\'t... she\'s too strong..."',
            background: 'assets/digitalSpace.png',
            choices: [
                { text: '[Fight: "No. I trust him."] (LOCKED - Tether too low)', value: 'locked', disabled: true },
                { text: '[Accept: "Maybe she\'s right..."]', value: 'accept' },
                { text: '[Silent: Just hold on.]', value: 'silent' }
            ],
            onChoice: (choice) => {
                if (choice === 'locked') {
                    // This shouldn't trigger, but just in case
                    this.beat7_accept();
                } else if (choice === 'accept') {
                    this.route.addRoutePoints('bad', 2);
                    this.beat7_accept();
                } else {
                    this.route.addRoutePoints('digitalForever', 2);
                    this.beat7_silent();
                }
            }
        }, 'beat7_choiceLocked');
    }

    beat7_choice() {
        // NORMAL: All options available
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Do I fight Despair... or let her win?"',
            background: 'assets/digitalSpace.png',
            choices: [
                { text: '[Fight: "No. I trust him."]', value: 'fight' },
                { text: '[Accept: "Maybe she\'s right..."]', value: 'accept' },
                { text: '[Silent: Just hold on.]', value: 'silent' }
            ],
            onChoice: (choice) => {
                if (choice === 'fight') {
                    this.route.addRoutePoints('true', 2);
                    this.beat7_fight();
                } else if (choice === 'accept') {
                    this.route.addRoutePoints('bad', 2);
                    this.beat7_accept();
                } else {
                    this.route.addRoutePoints('digitalForever', 2);
                    this.beat7_silent();
                }
            }
        }, 'beat7_choice');
    }

    beat7_fight() {
        // Boost tether for resisting Despair
        this.route.tetherLevel = Math.min(100, this.route.tetherLevel + 10);
        this.route.updateTether(10, 'Fighting Despair - defiance');

        this.game.displayScene({
            character: 'Tori (internal, defiant)',
            dialogue: '"No. I trust him. He\'ll find the way."',
            internal: '[COHERENCE BOOST: +10%]\n[She fought back! Despair recoils.]',
            background: 'assets/digitalSpace.png',
            next: () => this.beat7_echoesReact(),
            delay: 3000
        }, 'beat7_fight');
    }

    beat7_accept() {
        // Drop tether for giving in
        this.route.tetherLevel = Math.max(0, this.route.tetherLevel - 10);
        this.route.updateTether(-10, 'Accepting Despair - giving in');

        this.game.displayScene({
            character: 'Tori (internal, broken)',
            dialogue: '"Maybe she\'s right... maybe I should just let go..."',
            internal: '[COHERENCE DROP: -10%]\n[Despair grins. Victory.]',
            background: 'assets/digitalSpace.png',
            next: () => this.beat7_echoesReact(),
            delay: 3000
        }, 'beat7_accept');
    }

    beat7_silent() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"..."',
            internal: '[Just holding on. Just surviving. Tether holds steady.]',
            background: 'assets/digitalSpace.png',
            next: () => this.beat7_echoesReact(),
            delay: 3000
        }, 'beat7_silent');
    }

    beat7_echoesReact() {
        const tetherState = this.route.getTetherState();

        if (tetherState === 'despair') {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Despair: "Good. Good. Now you understand."\nEcho 1: (fading) "No..."\nEcho 2: (barely there) "Please..."', internal: '[Whiteout. Despair dominant. Everything breaks. Act 3 begins...]',
                background: 'assets/digitalSpace.png',
                sprites: {
                    right: 'echoes'
                },
                next: () => this.route.act3.start(),
                delay: 5000
            }, 'beat7_echoesReact_despair');
        } else if (tetherState === 'balanced') {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Echo 1: "She\'s still fighting."\nEcho 2: "Stronger than we were."\nDespair: "For now."', internal: '[Whiteout. The battle continues. Act 3 begins...]',
                background: 'assets/digitalSpace.png',
                sprites: {
                    right: 'echoes'
                },
                next: () => this.route.act3.start(),
                delay: 5000
            }, 'beat7_echoesReact_balanced');
        } else {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Echo 1: "YES! That\'s it!"\nEcho 2: "She can do this. She really can."\nDespair: "...We\'ll see."', internal: '[Whiteout. Tori holds strong. Act 3 begins...]',
                background: 'assets/digitalSpace.png',
                sprites: {
                    right: 'echoes'
                },
                next: () => this.route.act3.start(),
                delay: 5000
            }, 'beat7_echoesReact_strong');
        }
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.ToriAct2 = ToriAct2;
}

// ES Module export
export { ToriAct2 };
