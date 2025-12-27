// RONNIE'S ROUTE - ACT 3
// Crisis, Mad Dash, and All Endings
// WITH VISUAL IMPLEMENTATION

class RonnieRouteAct3 {
    constructor(route) {
        this.route = route;
        this.game = route.game;
    }

    // ========================================
    // ACT 3 - CRISIS & ENDINGS
    // ========================================

    startAct3() {
        // Beat 1: Honeymoon Loop (False Calm)
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"I woke up and she was... there. Whole. Smiling. Like nothing had happened."',
            internal: '[Visual: Pixel park. Cherry blossoms falling in slow loops. Dreamy chiptune music - slightly too perfect.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.act3Beat1_greeting(),
            delay: 4000
        }, 'startAct3');
    }

    act3Beat1_greeting() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Baby, you\'re staring again."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.act3Beat1_response(),
            delay: 2500
        }, 'act3Beat1_greeting');
    }

    act3Beat1_response() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"I just... you\'re okay. You\'re really okay."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.act3Beat1_smile(),
            delay: 2500
        }, 'act3Beat1_response');
    }

    act3Beat1_smile() {
        this.game.displayScene({
            character: 'Tori (bright)',
            dialogue: '"Of course I am! What, you worried I\'d disappear or something?"',
            internal: '[She laughs. It sounds... hollow. Just slightly.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.act3Beat1_choice(),
            delay: 3000
        }, 'act3Beat1_smile');
    }

    act3Beat1_choice() {
        this.game.displayScene({
            character: 'Ronnie (internal)',
            dialogue: 'Something is off.',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            choices: [
                { text: '"Want some ice cream? Mint chocolate chip?"', value: 'test' },
                { text: '"Something\'s wrong. This isn\'t real."', value: 'confront' }
            ],
            onChoice: (choice) => this.act3Beat1_outcome(choice)
        }, 'act3Beat1_choice');
    }

    act3Beat1_outcome(choice) {
        if (choice === 'test') {
            this.game.displayScene({
                character: 'Tori (cheerful)',
                dialogue: '"Oh yes! I LOVE mint chocolate chip!"',
                internal: '[Ronnie freezes. Wrong answer. Dead wrong.]',
                background: 'assets/digitalSpace.png',
                sprites: {
                    left: 'assets/ronnie-sprite.png',
                    right: 'assets/tori-sprite.png'
                },
                next: () => {
                    this.game.displayScene({
                        character: 'Ronnie (carefully)',
                        dialogue: '"I remember. You hate that flavor. You said it tastes like \'candy corn\'s evil twin.\'"',
                        background: 'assets/digitalSpace.png',
                        sprites: {
                            left: 'assets/ronnie-sprite.png',
                            right: 'assets/tori-sprite.png'
                        },
                        next: () => {
                            this.game.displayScene({
                                character: 'Tori (confused, then recovering)',
                                dialogue: '"Oh. Right. Yeah. Chocolate chip. I meant chocolate chip."\n[She laughs, but it sounds slightly off-pitch.]\n"Sorry, I\'m... scattered today. Brain fog."',
                                internal: '[Ronnie (narration): "Fuzzy. Wrong word. Wrong memory. Wrong flavor. Something was very, very wrong."]',
                                background: 'assets/digitalSpace.png',
                                sprites: {
                                    left: 'assets/ronnie-sprite.png',
                                    right: 'assets/tori-sprite.png'
                                },
                                next: () => this.act3Beat2(),
                                delay: 5000
                            }, 'act3Beat1_outcome_test_reveal');
                        },
                        delay: 3500
                    }, 'act3Beat1_outcome_test_correct');
                },
                delay: 3000
            }, 'act3Beat1_outcome_test');
        } else if (choice === 'confront') {
            this.game.displayScene({
                character: 'Ronnie',
                dialogue: '"Something\'s wrong here. You\'re not remembering right. The hospital. The alarms. You were glitching apart and now you\'re just... perfect?"',
                internal: '[Tori\'s sprite freezes. Eyes wide. Then flickers violently - 3 seconds of blank stare. Snaps back. Voice colder.]',
                background: 'assets/digitalSpace.png',
                sprites: {
                    left: 'assets/ronnie-sprite.png',
                    right: 'assets/tori-sprite.png'
                },
                next: () => this.act3Beat2(),
                delay: 5000
            }, 'act3Beat1_outcome_confront');
        }
    }

    // ========================================
    // BEAT 2: MEMORY FRACTURE
    // Tori's memories start corrupting
    // ========================================

    act3Beat2() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"Over the next few days, it got worse. She\'d forget things. Small things at first."',
            internal: '[Visual: Digital apartment. Tori cooking breakfast - movements glitchy, repeating.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.beat2_forgetting(),
            delay: 3500
        }, 'act3Beat2');
    }

    beat2_forgetting() {
        this.game.displayScene({
            character: 'Tori (confused)',
            dialogue: '"Baby, what\'s our anniversary date again?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.beat2_ronnieAnswer(),
            delay: 2500
        }, 'beat2_forgetting');
    }

    beat2_ronnieAnswer() {
        this.game.displayScene({
            character: 'Ronnie (careful)',
            dialogue: '"June 12th. We\'ve celebrated it four times."',
            internal: '[She knows this. She KNOWS this. Why is she asking?]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.beat2_toriRealization(),
            delay: 3000
        }, 'beat2_ronnieAnswer');
    }

    beat2_toriRealization() {
        this.game.displayScene({
            character: 'Tori (panicking)',
            dialogue: '"I knew that. I KNEW that. Why couldn\'t I... Ronnie, what\'s happening to me?"',
            internal: '[Her sprite flickers. Eyes wide with fear.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.beat2_promise(),
            delay: 3000,
            style: 'critical'
        }, 'beat2_toriRealization');
    }

    beat2_promise() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"It\'s okay. We\'ll figure it out. I promise."',
            internal: '[Ronnie (internal): "But I had no idea how. The code was stable. What was causing this?"]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.act3Beat3(),
            delay: 3500
        }, 'beat2_promise');
    }

    // ========================================
    // BEAT 3: SYSTEM MESSAGES INTRUDE
    // External warnings break through
    // ========================================

    act3Beat3() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Then the messages started appearing.',
            internal: '[Visual: Text overlays bleeding through the game world. Red warnings.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.beat3_firstMessage(),
            delay: 2500
        }, 'act3Beat3');
    }

    beat3_firstMessage() {
        this.game.displayScene({
            character: 'System Message',
            dialogue: '⚠️ WARNING: MEMORY CORRUPTION DETECTED\n⚠️ VESSEL INSTABILITY: 67%\n⚠️ RECOMMEND IMMEDIATE DIAGNOSTICS',
            internal: '[The text appears over Tori\'s sprite. She can see it too.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.beat3_toriSees(),
            delay: 3000,
            style: 'critical'
        }, 'beat3_firstMessage');
    }

    beat3_toriSees() {
        this.game.displayScene({
            character: 'Tori (reading)',
            dialogue: '"Ronnie... I can see that. The warnings. Vessel instability? What vessel?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.beat3_ronnieHesitates(),
            delay: 3000
        }, 'beat3_toriSees');
    }

    beat3_ronnieHesitates() {
        this.game.displayScene({
            character: 'Ronnie (deflecting)',
            dialogue: '"Just... system diagnostics. Nothing to worry about."',
            internal: '[Ronnie (internal): "I couldn\'t tell her. Not yet. Not while she was already scared."]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.beat3_moreWarnings(),
            delay: 3000
        }, 'beat3_ronnieHesitates');
    }

    beat3_moreWarnings() {
        this.game.displayScene({
            character: 'System Message',
            dialogue: '⚠️ CRITICAL: BATTERY DEPLETION ACCELERATING\n⚠️ CONSCIOUSNESS ANCHOR: UNSTABLE\n⚠️ ESTIMATED TIME TO FAILURE: 72 HOURS',
            internal: '[More messages. Faster now. Tori\'s sprite glitches harder with each one.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.beat3_toriDemands(),
            delay: 3500,
            style: 'critical'
        }, 'beat3_moreWarnings');
    }

    beat3_toriDemands() {
        this.game.displayScene({
            character: 'Tori (firm)',
            dialogue: '"Ronnie. TELL ME. What\'s happening? What\'s the vessel? What\'s failing?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.act3Beat4(),
            delay: 3000
        }, 'beat3_toriDemands');
    }

    // ========================================
    // BEAT 4: FRAGMENTATION
    // Tori's consciousness destabilizes
    // ========================================

    act3Beat4() {
        this.game.displayScene({
            character: 'Ronnie (breaking)',
            dialogue: '"The Tori-Gatchi. You\'re... inside it. You messaged me in the game I made. I don\'t think my computer can handle your consciousness."',
            internal: '[Ronnie finally admits it. The truth he\'d been hiding.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.beat4_toriProcessing(),
            delay: 4000
        }, 'act3Beat4');
    }

    beat4_toriProcessing() {
        this.game.displayScene({
            character: 'Tori (slowly)',
            dialogue: '"I\'m... in the Tamagotchi. Not the game. The device itself."',
            internal: '[Her sprite stutters. Reality reshaping around the revelation.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.beat4_understanding(),
            delay: 3000
        }, 'beat4_toriProcessing');
    }

    beat4_understanding() {
        // Unlock GenZee's bootstrap paradox note - the loop revelation
        this.route.collectiblesManager.unlockNote('gz3');

        this.game.displayScene({
            character: 'Tori',
            dialogue: '"The buzzes. The battery drain. That\'s me. I\'m killing the device just by existing in it."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.beat4_ronnieConfirms(),
            delay: 3000
        }, 'beat4_understanding');
    }

    beat4_ronnieConfirms() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Yes. And when it dies... I don\'t know what happens to you. If you just... stop. Or if it\'s worse."',
            internal: '[The weight of it. The timer counting down.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.beat4_glitch(),
            delay: 3500
        }, 'beat4_ronnieConfirms');
    }

    beat4_glitch() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'GLITCH.',
            internal: '[Tori\'s sprite fractures. Screen tears. Visual corruption spreads.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.beat4_toriScreaming(),
            delay: 1500,
            style: 'critical'
        }, 'beat4_glitch');
    }

    beat4_toriScreaming() {
        this.game.displayScene({
            character: 'Tori (distorted)',
            dialogue: '"I can feel it. The edges. I\'m coming apart. Ronnie, I\'m SCARED—"',
            internal: '[Her voice fragments mid-word. Sprite dissolving at the edges.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.beat4_ronnieGrabs(),
            delay: 3000,
            style: 'critical'
        }, 'beat4_toriScreaming');
    }

    beat4_ronnieGrabs() {
        this.game.displayScene({
            character: 'Ronnie (desperate)',
            dialogue: '"Hold on! Just—stay with me! I\'ll fix this!"',
            internal: '[He grabs the device. Holds it close. Like proximity could keep her together.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.act3Beat5(),
            delay: 3000
        }, 'beat4_ronnieGrabs');
    }

    // ========================================
    // BEAT 5: REVELATION - BODY ANCHOR
    // The solution becomes clear
    // ========================================

    act3Beat5() {
        this.beat5_hospitalMemory();
    }

    beat5_hospitalMemory() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"And then I remembered. The hospital. The single buzz."',
            internal: '[Flashback: Device near Tori\'s body. One buzz. Different from the vessel transfers.]',
            background: 'assets/hospital.png',
            next: () => this.beat5_realization(),
            delay: 3500
        }, 'act3Beat5');
    }

    beat5_realization() {
        this.game.displayScene({
            character: 'Ronnie (excited)',
            dialogue: '"The body. Tori, your BODY. It\'s still there. Still alive. That buzz—you were reaching for it!"',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.beat5_toriHope(),
            delay: 3000
        }, 'beat5_realization');
    }

    beat5_toriHope() {
        this.game.displayScene({
            character: 'Tori (through game)',
            dialogue: '"I felt something. Warmth. A pull. Different from the laptop."',
            background: 'assets/digitalSpace.png',
            sprites: {
                right: 'assets/tori-sprite.png'
            },
            next: () => this.beat5_theory(),
            delay: 3000
        }, 'beat5_toriHope');
    }

    beat5_theory() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"If I bring the device close enough... if you can jump vessels... maybe you can jump HOME."',
            internal: '[The mad theory. Desperate. Beautiful. Terrifying.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.beat5_toriUncertain(),
            delay: 3500
        }, 'beat5_theory');
    }

    beat5_toriUncertain() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"But what if I can\'t? What if I just... dissolve? What if jumping destroys me?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                right: 'assets/tori-sprite.png'
            },
            next: () => this.beat5_ronniePromise(),
            delay: 3000
        }, 'beat5_toriUncertain');
    }

    beat5_ronniePromise() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Then we find another way. Upload you somewhere safer. Or... I don\'t know. But we\'re running out of time."',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.beat5_timer(),
            delay: 3500
        }, 'beat5_ronniePromise');
    }

    beat5_timer() {
        this.game.displayScene({
            character: 'System Message',
            dialogue: '⚠️ CRITICAL BATTERY: 8% REMAINING\n⚠️ ESTIMATED TIME: 12 HOURS\n⚠️ DECISION REQUIRED',
            internal: '[The clock is ticking. He needs to act NOW.]',
            background: 'assets/digitalSpace.png',
            next: () => this.beat6_uploadAttempt(),
            delay: 3000,
            style: 'critical'
        }, 'beat5_timer');
    }

    // ========================================
    // BEAT 6: UPLOAD ATTEMPT FAILS
    // Ronnie tries to expand the code - it doesn't work
    // ========================================

    beat6_uploadAttempt() {
        this.game.displayScene({
            character: 'Ronnie (frantic)',
            dialogue: '"If the device can\'t hold you... I\'ll upload you somewhere bigger. The laptop. The cloud. ANYWHERE with more space!"',
            internal: '[He frantically opens his laptop. Connection protocols. Upload sequence initiating.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.beat6_uploadProgress(),
            delay: 3500
        }, 'beat6_uploadAttempt');
    }

    async beat6_uploadProgress() {
        // Use cinematic loading overlay instead of ASCII art
        await this.game.loadingOverlay.playUploadSequence({
            title: 'TRANSFER PROTOCOL INITIATED',
            subtitle: 'Uploading consciousness data…',
            durationMs: 4000,
            skippable: true,
            glitchAt: 73, // Dramatic glitch at 73%
            statusLines: [
                'Initializing transfer…',
                'Packing consciousness data…',
                'Establishing bridge…',
                'Uploading…',
                'Transfer complete.'
            ]
        });

        // Continue to failure scene
        this.game.displayScene({
            character: 'System',
            dialogue: '[Transfer complete. But something\'s wrong.]',
            internal: '[The data moved. But Tori didn\'t.]',
            background: 'assets/apartment.png',
            next: () => this.beat6_uploadFails(),
            delay: 2000,
            style: 'critical'
        }, 'beat6_uploadProgress');
    }

    beat6_uploadFails() {
        this.game.displayScene({
            character: 'Tori (through device, weak)',
            dialogue: '"Ronnie... I\'m still here. Still in the Tamagotchi. It didn\'t work."',
            internal: '[The upload failed. She can\'t be moved like data. She\'s consciousness, not code.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.beat6_realization(),
            delay: 3000
        }, 'beat6_uploadFails');
    }

    beat6_realization() {
        // Unlock PerplexiZee's body anchor mechanics note - CRITICAL guidance
        this.route.collectiblesManager.unlockNote('pz2');

        this.game.displayScene({
            character: 'Ronnie (realization)',
            dialogue: '"You can\'t be uploaded. You\'re not DATA. You\'re a SOUL. And souls need... bodies."',
            internal: '[The pieces click. The single buzz at the hospital. Her body reaching for her.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.beat6_bodyAnchor(),
            delay: 4000
        }, 'beat6_realization');
    }

    beat6_bodyAnchor() {
        this.game.displayScene({
            character: 'Tori (urgent)',
            dialogue: '"My body. Ronnie, my BODY is still at the hospital. I felt it pull me when you were near!"',
            background: 'assets/digitalSpace.png',
            sprites: {
                right: 'assets/tori-sprite.png'
            },
            next: () => this.beat6_plan(),
            delay: 3000
        }, 'beat6_bodyAnchor');
    }

    beat6_plan() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Then that\'s the anchor. Device to hand. Heartbeat to heartbeat. You can jump BACK."',
            internal: '[Hope. Desperate. Dangerous. But possible.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.beat7_phoneCall(),
            delay: 3500
        }, 'beat6_plan');
    }

    // ========================================
    // BEAT 7: THE CALL - HOSPITAL EMERGENCY
    // Battery critical, vitals unstable, the mad dash begins
    // ========================================

    beat7_phoneCall() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'His phone SCREAMS.',
            internal: '[Incoming call: City General Hospital. ICU. URGENT.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.beat7_nurseVoice(),
            delay: 2000,
            style: 'critical'
        }, 'beat7_phoneCall');
    }

    beat7_nurseVoice() {
        this.game.displayScene({
            character: 'Nurse (phone, urgent)',
            dialogue: '"Mr. Ronnie? It\'s City General. Tori\'s vitals just crashed. Heart rate erratic. Blood pressure dropping. You need to get here NOW."',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.beat7_tamagotchiBuzz(),
            delay: 4000,
            style: 'critical'
        }, 'beat7_nurseVoice');
    }

    beat7_tamagotchiBuzz() {
        // HAPTIC: Violent buzzing - emergency alert
        if (this.game.triggerSensoryFeedback) {
            this.game.triggerSensoryFeedback('tamaEmergency', null, 'Tamagotchi emergency buzz - violent panic');
        }

        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The Tamagotchi BUZZES VIOLENTLY in his hand.',
            internal: '[Screen flashing red. Battery: 3%. She\'s dying. Both versions of her. Simultaneously.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.beat7_toriScreaming(),
            delay: 3000,
            style: 'critical'
        }, 'beat7_tamagotchiBuzz');
    }

    beat7_toriScreaming() {
        this.game.displayScene({
            character: 'Tori (distorted, panicking)',
            dialogue: '"RONNIE! I can feel it! Both of me! I\'m FRACTURING—"',
            internal: '[Her voice cuts out. Static. The connection fraying.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                right: 'assets/tori-sprite.png'
            },
            next: () => this.beat7_decision(),
            delay: 3000,
            style: 'critical'
        }, 'beat7_toriScreaming');
    }

    beat7_decision() {
        this.game.displayScene({
            character: 'Ronnie (voice breaking)',
            dialogue: '"Hold on. HOLD ON. I\'m coming!"',
            internal: '[He grabs his keys. The Tamagotchi. Sprints for the door.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.madDash_start(),
            delay: 2500
        }, 'beat7_decision');
    }

    // ========================================
    // THE MAD DASH - SHARED SEQUENCE
    // Race to the hospital - outcome determines ending
    // ========================================

    madDash_start() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'THE MAD DASH BEGINS.',
            internal: '[Visual: Ronnie bursts through apartment door. Tamagotchi clutched tight. Sprinting down stairs.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.madDash_streets(),
            delay: 2000
        }, 'madDash_start');
    }

    madDash_streets() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'City streets blur past. Red lights ignored. Horns blaring. He doesn\'t stop.',
            internal: '[Tamagotchi screen: Battery 2%. Tori\'s sprite flickering. Fading.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.madDash_hospitalArrival(),
            delay: 3500
        }, 'madDash_streets');
    }

    madDash_hospitalArrival() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'HOSPITAL. ICU FLOOR. ALARMS SCREAMING.',
            internal: '[Visual: Ronnie bursts through lobby. Elevator too slow. Takes stairs. Three at a time.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.madDash_corridors(),
            delay: 3000,
            style: 'critical'
        }, 'madDash_hospitalArrival');
    }

    madDash_corridors() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Corridor. Room 302. Medical staff swarming. Crash cart.',
            internal: '[He can see her room. Door ahead. Nurses blocking the way.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.madDash_monitor(),
            delay: 3000,
            style: 'critical'
        }, 'madDash_corridors');
    }

    madDash_monitor() {
        this.game.displayScene({
            character: 'System Message',
            dialogue: '⚠️ BATTERY: 1%\n⚠️ PATIENT VITALS: CRITICAL\n⚠️ ESTIMATED TIME TO FLATLINE: 60 SECONDS',
            internal: '[Both timers converging. Body dying. Device dying. One minute.]',
            background: 'assets/hospital.png',
            next: () => this.act3CriticalChoice(),
            delay: 3500,
            style: 'critical'
        }, 'madDash_monitor');
    }

    // ========================================
    // CRITICAL CHOICE - DURING THE RACE
    // Player's choice determines if he makes it in time
    // ========================================

    act3CriticalChoice() {
        this.game.displayScene({
            character: 'Ronnie (internal)',
            dialogue: 'One minute. One choice. Everything depends on this.',
            internal: '[What do you do?]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            choices: [
                { text: '[Push through - GET TO HER NOW]', value: 'push_through' },
                { text: '[Stop and explain to medical staff]', value: 'explain' },
                { text: '[Connect to her digitally one last time]', value: 'connect' }
            ],
            onChoice: (choice) => {
                this.game.gameState.flags.final_ending_choice = choice;
                this.routeToEnding(choice);
            }
        }, 'act3CriticalChoice');
    }

    routeToEnding(choice) {
        if (choice === 'push_through') {
            // TRUE ENDING - Makes it in time
            this.trueRouteEnding();
        } else if (choice === 'explain') {
            // BAD ENDING - Too late, wastes time explaining
            this.badRouteEnding();
        } else if (choice === 'connect') {
            // DIGITAL FOREVER - Double buzz pulls him in
            this.digitalForeverEnding();
        }
    }

    // ========================================
    // BAD ENDING - TOO LATE
    // He stopped to explain, wasted precious seconds
    // ========================================

    badRouteEnding() {
        this.game.displayScene({
            character: 'Ronnie (desperate)',
            dialogue: '"You don\'t understand! She\'s IN the device! Her consciousness! I need to—"',
            internal: '[The nurses exchange glances. Confused. Concerned. One reaches for his arm.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.badRoute_tooLate(),
            delay: 3500
        }, 'badRouteEnding');
    }

    badRoute_tooLate() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The monitor flatlines.',
            internal: '[A single, sustained tone. The Tamagotchi screen goes dark. Both gone. Simultaneously.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.badRoute_nurseWords(),
            delay: 3000,
            style: 'critical'
        }, 'badRoute_tooLate');
    }

    badRoute_nurseWords() {
        this.game.displayScene({
            character: 'Nurse (soft)',
            dialogue: '"I\'m sorry. We did everything we could."',
            internal: '[He was 15 seconds too late. Just 15 seconds.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.badRoute_staring(),
            delay: 3500
        }, 'badRoute_nurseWords');
    }

    badRoute_staring() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"She was gone. And I\'d been too late."',
            internal: '[Ronnie doesn\'t respond. Staring at the Tamagotchi in his hand.]\n[Fade to black.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.badRoute_timeSkip(),
            delay: 4000
        }, 'badRoute_staring');
    }

    badRoute_timeSkip() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Years later...',
            internal: '[Visual: Dimly lit workshop. Older Ronnie, silver hair, faded BGA hoodie. Soldering iron in hand.]\n[Workbench: Tori\'s original Tamagotchi, disassembled. Modified circuitry. Notes everywhere.]',
            background: 'assets/apartment.png',
            next: () => this.badRoute_news(),
            delay: 4000
        }, 'badRoute_timeSkip');
    }

    badRoute_news() {
        this.game.displayScene({
            character: 'News Anchor (voice)',
            dialogue: '"—breakthrough in temporal displacement technology announced today—"',
            internal: '[TV in background. Old Ronnie\'s hand pauses. He looks up.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/old-ronnie-sprite.png'
            },
            next: () => this.badRoute_chance(),
            delay: 3500
        }, 'badRoute_news');
    }

    badRoute_chance() {
        this.game.displayScene({
            character: 'Old Ronnie (quiet, determined)',
            dialogue: '"...There\'s still a chance."',
            internal: '[Visual: He picks up the modified Tamagotchi. Screen glows faintly.]\n[Fade to black.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/old-ronnie-sprite.png'
            },
            next: () => this.badRoute_beforeBump(),
            delay: 4000
        }, 'badRoute_chance');
    }

    badRoute_beforeBump() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '',
            internal: '[Visual: Street corner, same location as Scene 1. An older man with silver hair stands in shadow, BGA hoodie prominent. He holds a worn Tamagotchi device - labeled "Ronnie-gatchi v1.0"]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/old-ronnie-sprite.png'
            },
            next: () => this.badRoute_preparation(),
            delay: 3500
        }, 'badRoute_beforeBump');
    }

    badRoute_preparation() {
        this.game.displayScene({
            character: 'Old Ronnie',
            dialogue: '"One more time. This has to work."',
            internal: '[He looks at the device, then around the corner where young Tori will appear]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/old-ronnie-sprite.png'
            },
            next: () => this.badRoute_giveHerTools(),
            delay: 3000
        }, 'badRoute_preparation');
    }

    badRoute_giveHerTools() {
        this.game.displayScene({
            character: 'Old Ronnie',
            dialogue: '"Give her the tools. Give myself the tools I never had."',
            internal: '[He takes a breath, steps around the corner]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/old-ronnie-sprite.png'
            },
            next: () => this.badRoute_loopBegins(),
            delay: 3000
        }, 'badRoute_giveHerTools');
    }

    badRoute_loopBegins() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'You\'ve seen this before... haven\'t you?',
            internal: '[The bump scene from the prologue begins to play. But this time, you recognize the old man in the BGA hoodie.]',
            background: 'assets/apartment.png',
            next: () => this.badRoute_retryLoop(),
            delay: 3000
        }, 'badRoute_loopBegins');
    }

    badRoute_retryLoop() {
        this.game.displayScene({
            character: 'Old Ronnie (narration)',
            dialogue: '"I spent years refining it. Perfecting the bridge. When they finally cracked time travel... I knew what I had to do. One chance. One moment. To give us both a second try."',
            internal: '[Visual: Sunny street. Old Ronnie\'s perspective. Young Tori walks by, distracted by her Tamagotchi.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/old-ronnie-sprite.png'
            },
            next: () => this.badRoute_bump(),
            delay: 6000
        }, 'badRoute_retryLoop');
    }

    badRoute_bump() {
        this.game.displayScene({
            character: 'Old Ronnie (narration)',
            dialogue: '"I\'m sorry I couldn\'t save you the first time. But maybe... maybe I can save us both."',
            internal: '[He steps forward. She bumps into him. Both Tamagotchis fall. She picks up his modified toy. It buzzes in her hand.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/old-ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.badRoute_apology(),
            delay: 5000
        }, 'badRoute_bump');
    }

    badRoute_apology() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Oh my gosh, I\'m so sorry—I wasn\'t paying attention!"',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/old-ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.badRoute_warning(),
            delay: 2500
        }, 'badRoute_apology');
    }

    badRoute_warning() {
        this.game.displayScene({
            character: 'Old Ronnie (gentle, voice soft)',
            dialogue: '"No problem. Hang on to that. It may save your life someday."',
            internal: '[He picks up her original device. Clutches it. Walks away.]\n[Visual: Camera follows him. He glances back once - sees young Ronnie waiting at home for her.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/old-ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.badRoute_finalThought(),
            delay: 5000
        }, 'badRoute_warning');
    }

    badRoute_finalThought() {
        // Unlock teaser note (first note player gets)
        // REMOVED: Teaser note overlay no longer needed
        // this.route.collectiblesManager.unlockNote('ronnie_teaser');

        // Show notes button now (it was hidden during first playthrough)
        // REMOVED: Notes are now accessed via notification shade
        // if (this.game.notesButton) {
        //     this.game.notesButton.style.display = 'block';
        // }

        // Mark ending completed - unlocks notes for replay
        this.game.markEndingCompleted('bad');

        // UNLOCK SKIP FEATURE (first ending completion)
        // REMOVED: Skip unlock notification no longer needed
        // if (!this.game.skipUnlocked) {
        //     this.game.unlockSkipFeature();
        // }

        // Get the current version number for display
        const currentVersion = this.game.loopVersion;

        this.game.displayScene({
            character: 'Old Ronnie (narration)',
            dialogue: '"Don\'t make the same mistakes I did. Get there in time."',
            internal: `[Fade to white.]\n\n**BAD ENDING: THE LOOP BEGINS AGAIN**\n"Love trapped in glass."\n\n[System restarting... Version ${currentVersion}]`,
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/old-ronnie-sprite.png'
            },
            next: () => this.badRoute_retry(),
            delay: 6000
        }, 'badRoute_finalThought');
    }

    badRoute_retry() {
        // Unlock skip prologue for future playthroughs
        if (!this.game.skipPrologueUnlocked) {
            this.game.skipPrologueUnlocked = true;
            localStorage.setItem('skipPrologueUnlocked', 'true');
            console.log('✅ Skip Prologue unlocked! Available on next START STORY.');
        }

        // UNLOCK RONNIE NOTES SYSTEM (teaser note + tab unlock)
        if (!this.game.ronnieNotesUnlocked) {
            this.game.unlockRonnieNotesSystem();
        }

        // Show ending dialog (three-option system)
        this.game.showEndingDialog('bad');
    }

    // ========================================
    // DIGITAL FOREVER ENDING - DOUBLE BUZZ
    // He reaches out digitally, the device pulls him in
    // ========================================

    digitalForeverEnding() {
        this.game.displayScene({
            character: 'Ronnie (desperate)',
            dialogue: '"Tori... if I can\'t get to you... then I\'m coming TO you."',
            internal: '[He stops running. Holds the Tamagotchi close. Opens the connection.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.digitalForever_connect(),
            delay: 3500
        }, 'digitalForeverEnding');
    }

    digitalForever_connect() {
        this.game.displayScene({
            character: 'Tori (through device, weak)',
            dialogue: '"Ronnie... don\'t... you can\'t—"',
            internal: '[He presses his forehead to the screen. Eyes closed. Reaching through the code.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.digitalForever_doubleBuzz(),
            delay: 3000
        }, 'digitalForever_connect');
    }

    digitalForever_doubleBuzz() {
        // HAPTIC + VISUAL: Double buzz + screen pulse - two synchronized pulses
        if (this.game.triggerSensoryFeedback) {
            this.game.triggerSensoryFeedback('toriHop', null, 'Synchronized double pulse - tether connection');
        }

        this.game.displayScene({
            character: 'Narration',
            dialogue: 'BUZZ. BUZZ.',
            internal: '[Two pulses. Synchronized. The device PULLS.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.digitalForever_transfer(),
            delay: 2500,
            style: 'critical'
        }, 'digitalForever_doubleBuzz');
    }

    async digitalForever_transfer() {
        // Dramatic overlay for the unauthorized dual-soul transfer
        await this.game.loadingOverlay.playUploadSequence({
            title: '⚠️ UNAUTHORIZED TRANSFER',
            subtitle: 'Two souls detected in single vessel…',
            durationMs: 4000,
            skippable: true,
            glitchAt: 45, // Early glitch - something's wrong
            statusLines: [
                '⚠️ Consciousness detected…',
                '⚠️ Secondary soul binding…',
                '⚠️ VESSEL OVERLOAD…',
                '⚠️ CRITICAL ERROR…',
                '⚠️ TRANSFER COMPLETE'
            ]
        });

        this.game.displayScene({
            character: 'System',
            dialogue: '⚠️ UNAUTHORIZED CONSCIOUSNESS TRANSFER\n⚠️ TWO SOULS DETECTED\n⚠️ VESSEL OVERLOAD',
            internal: '[His body collapses in the hallway. Nurses rush to him. But he\'s already gone.]',
            background: 'assets/hospital.png',
            next: () => this.digitalForever_merge(),
            delay: 3000,
            style: 'critical'
        }, 'digitalForever_transfer');
    }

    digitalForever_merge() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Digital space. White void. Two sprites materialize.',
            internal: '[Ronnie\'s form solidifies beside Tori\'s. Both digital. Both together.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.digitalForever_together(),
            delay: 3500
        }, 'digitalForever_merge');
    }

    digitalForever_together() {
        this.game.displayScene({
            character: 'Tori (shocked)',
            dialogue: '"Ronnie... what did you DO?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.digitalForever_ronnieSmile(),
            delay: 2500
        }, 'digitalForever_together');
    }

    digitalForever_ronnieSmile() {
        this.game.displayScene({
            character: 'Ronnie (sprite, smiling)',
            dialogue: '"What I promised. Always."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.digitalForever_acceptance(),
            delay: 3000
        }, 'digitalForever_ronnieSmile');
    }

    digitalForever_acceptance() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"You idiot. Beautiful idiot."',
            internal: '[She takes his hand. Their sprites sync perfectly.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.digitalForever_world(),
            delay: 3000
        }, 'digitalForever_acceptance');
    }

    digitalForever_world() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'They build their world together. Pixel parks. Digital sunsets. Eternally young. Eternally together.',
            internal: '[Visual: Their apartment, recreated in code. Perfect. Frozen. Safe.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.digitalForever_static(),
            delay: 4000
        }, 'digitalForever_world');
    }

    digitalForever_static() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'No sickness. No death. No separation.',
            internal: '[But also: No growth. No change. No real touch. Just eternal digital stasis.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.digitalForever_hospital(),
            delay: 4000
        }, 'digitalForever_static');
    }

    digitalForever_hospital() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '[CUT TO: Hospital room. Two bodies on beds. Monitors humming. No one wakes.]',
            internal: '[Outside the window, years pass. Seasons change. The world moves on without them.]',
            background: 'assets/hospital.png',
            next: () => this.digitalForever_choice(),
            delay: 5000
        }, 'digitalForever_hospital');
    }

    digitalForever_choice() {
        // Unlock teaser note (first note player gets)
        // REMOVED: Teaser note overlay no longer needed
        // this.route.collectiblesManager.unlockNote('ronnie_teaser');

        // Show notes button now (it was hidden during first playthrough)
        // REMOVED: Notes are now accessed via notification shade
        // if (this.game.notesButton) {
        //     this.game.notesButton.style.display = 'block';
        // }

        // Mark ending completed - unlocks notes for replay
        this.game.markEndingCompleted('digital_forever');

        // UNLOCK SKIP FEATURE (first ending completion)
        // REMOVED: Skip unlock notification no longer needed
        // if (!this.game.skipUnlocked) {
        //     this.game.unlockSkipFeature();
        // }

        this.game.displayScene({
            character: 'System',
            dialogue: '**DIGITAL FOREVER ENDING**\n"Together, eternally still."',
            internal: '[Is this love? Or is it fear of loss?\nIs safety worth stagnation?\nYou chose connection over growth.]\n\n[They remain, forever digital, forever young, forever together...]\n[...forever frozen.]',
            background: 'assets/hospital.png',
            next: () => this.digitalForever_retry(),
            delay: 5000
        }, 'digitalForever_choice');
    }

    digitalForever_retry() {
        // Unlock skip prologue for future playthroughs
        if (!this.game.skipPrologueUnlocked) {
            this.game.skipPrologueUnlocked = true;
            localStorage.setItem('skipPrologueUnlocked', 'true');
            console.log('✅ Skip Prologue unlocked! Available on next START STORY.');
        }

        // UNLOCK RONNIE NOTES SYSTEM (teaser note + tab unlock)
        if (!this.game.ronnieNotesUnlocked) {
            this.game.unlockRonnieNotesSystem();
        }

        // Show ending dialog (three-option system)
        this.game.showEndingDialog('digitalForever');
    }

    // ========================================
    // TRUE ENDING - THE ANCHOR
    // ========================================

    // ========================================
    // TRUE ENDING - MAKES IT IN TIME
    // He pushes through, gets to her, she jumps back
    // ========================================

    trueRouteEnding() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'HE PUSHES THROUGH.',
            internal: '[Nurses try to stop him. He doesn\'t hear them. Doesn\'t see them. Only her.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.trueRoute_burst(),
            delay: 2500
        }, 'trueRouteEnding');
    }

    trueRoute_burst() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'He BURSTS through the door.',
            internal: '[Her body convulsing. Alarms blaring. Medical staff scrambling. Monitor showing erratic heartbeat.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.trueRoute_move(),
            delay: 3000
        }, 'trueRoute_burst');
    }

    trueRoute_move() {
        this.game.displayScene({
            character: 'Ronnie (shouting over alarms)',
            dialogue: '"Move!"',
            internal: '[He reaches her bedside. Places the Tamagotchi in her palm. Closes her fingers around it with his own hand covering hers.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.trueRoute_anchor(),
            delay: 3000
        }, 'trueRoute_move');
    }

    trueRoute_anchor() {
        this.game.displayScene({
            character: 'Ronnie (steady, voice anchoring)',
            dialogue: '"Come home. Follow the heartbeat."',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.trueRoute_transfer(),
            delay: 3000
        }, 'trueRoute_anchor');
    }

    async trueRoute_transfer() {
        // DIZEE FIX: Double buzz when Tori jumps back to her body
        // Matches the Digital Forever double buzz for vessel transfer
        if (this.game.triggerSensoryFeedback) {
            this.game.triggerSensoryFeedback('toriHop', null, 'Double buzz - Tori returns to her body');
        }

        // Cinematic overlay for the soul transfer
        await this.game.loadingOverlay.playUploadSequence({
            title: 'SOUL TRANSFER INITIATED',
            subtitle: 'Following the heartbeat home…',
            durationMs: 5000,
            skippable: true,
            statusLines: [
                'Releasing digital form…',
                'Bridging consciousness…',
                'Following the anchor…',
                'Reconnecting to body…',
                'Transfer complete.'
            ]
        });

        this.game.displayScene({
            character: 'Tori (voice, echoing from device)',
            dialogue: '"I feel it... the pull... I\'m—',
            internal: '[Visual: Tamagotchi screen. Tori\'s sprite begins to dissolve - not glitch, but fade like mist.]\n[Visual: Her real hand twitches.]\n[Monitor stabilizes slightly. Beeping slows from erratic to rhythmic.]\n[Her eyes move beneath closed lids.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.trueRoute_whisper(),
            delay: 4500
        }, 'trueRoute_transfer');
    }


    trueRoute_whisper() {
        this.game.displayScene({
            character: 'Ronnie (whispering, tears streaming)',
            dialogue: '"That\'s it. That\'s it, baby. Follow me back."',
            internal: '[Visual: Tamagotchi screen goes completely white. Then dark. Silent.]\n[Beat of silence.]\n[Her eyes flutter open.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.trueRoute_awakening(),
            delay: 5000
        }, 'trueRoute_whisper');
    }

    trueRoute_awakening() {
        this.game.displayScene({
            character: 'Tori (hoarse, confused)',
            dialogue: '"...Ronnie?"',
            internal: '[He breaks. Collapses forward, forehead against her hand.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.trueRoute_always(),
            delay: 3000
        }, 'trueRoute_awakening');
    }

    trueRoute_always() {
        this.game.displayScene({
            character: 'Ronnie (voice shaking)',
            dialogue: '"Always. Always. Always."',
            internal: '[She lifts her free hand shakily. Touches his hair. Strokes it.]\n[They cry together. No words. Just breathing.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.trueRoute_terrible(),
            delay: 4000
        }, 'trueRoute_always');
    }

    trueRoute_terrible() {
        this.game.displayScene({
            character: 'Tori (weak smile)',
            dialogue: '"You look terrible."',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.trueRoute_months(),
            delay: 2500
        }, 'trueRoute_terrible');
    }

    trueRoute_months() {
        this.game.displayScene({
            character: 'Ronnie (laughing through tears)',
            dialogue: '"You\'ve been asleep for months."',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.trueRoute_scared(),
            delay: 2500
        }, 'trueRoute_months');
    }

    trueRoute_scared() {
        this.game.displayScene({
            character: 'Tori (soft)',
            dialogue: '"I was so scared. I couldn\'t find you. And then I could. But I couldn\'t touch you."',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.trueRoute_home(),
            delay: 4000
        }, 'trueRoute_scared');
    }

    trueRoute_home() {
        this.game.displayScene({
            character: 'Ronnie (squeezing her hand)',
            dialogue: '"You\'re here now. You\'re real. You\'re home."',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.trueRoute_toast(),
            delay: 3000
        }, 'trueRoute_home');
    }

    trueRoute_toast() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"So... you up for some burnt toast?"',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.trueRoute_pasta(),
            delay: 2500
        }, 'trueRoute_toast');
    }

    trueRoute_pasta() {
        this.game.displayScene({
            character: 'Ronnie (laughing, crying)',
            dialogue: '"Only if I get to oversalt the pasta."',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.trueRoute_final(),
            delay: 3000
        }, 'trueRoute_pasta');
    }

    trueRoute_final() {
        // Unlock teaser note (first note player gets)
        // REMOVED: Teaser note overlay no longer needed
        // this.route.collectiblesManager.unlockNote('ronnie_teaser');

        // Show notes button now (it was hidden during first playthrough)
        // REMOVED: Notes are now accessed via notification shade
        // if (this.game.notesButton) {
        //     this.game.notesButton.style.display = 'block';
        // }

        // Mark ending completed - unlocks notes for replay
        this.game.markEndingCompleted('true');

        // UNLOCK SKIP FEATURE (first ending completion)
        // REMOVED: Skip unlock notification no longer needed
        // if (!this.game.skipUnlocked) {
        //     this.game.unlockSkipFeature();
        // }

        // Get player's version number for their success message
        const playerVersion = this.game.loopVersion;
        const attemptsCount = playerVersion - 848;

        let successMessage = '';
        if (attemptsCount === 0) {
            successMessage = `\n\n**TRUE ENDING - Version ${playerVersion}**\nFirst try. Legend.`;
        } else if (attemptsCount === 1) {
            successMessage = `\n\n**TRUE ENDING - Version ${playerVersion}**\nAfter ${attemptsCount} of YOUR attempts, you brought her home.`;
        } else {
            successMessage = `\n\n**TRUE ENDING - Version ${playerVersion}**\nAfter ${attemptsCount} of YOUR attempts, you brought her home.`;
        }

        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"For once, love wasn\'t trapped in glass. It came home."',
            internal: `[Visual: Morning light through hospital window. Golden. Warm.]\n[Tori\'s hand resting on Ronnie\'s head. He\'s kneeling beside her bed. Eyes closed. Finally at peace.]\n[Tamagotchi on bedside table. Screen glowing faintly - sprite image synced with Tori\'s real smile.]${successMessage}`,
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => {
                // Unlock skip prologue for future playthroughs
                if (!this.game.skipPrologueUnlocked) {
                    this.game.skipPrologueUnlocked = true;
                    localStorage.setItem('skipPrologueUnlocked', 'true');
                    console.log('✅ Skip Prologue unlocked! Available on next START STORY.');
                }

                // UNLOCK RONNIE NOTES SYSTEM (teaser note + tab unlock)
                if (!this.game.ronnieNotesUnlocked) {
                    this.game.unlockRonnieNotesSystem();
                }

                // Transition to shared epilogue
                const epilogue = new Epilogue(this.game, 'ronnie');
                epilogue.start();
            },
            delay: 4000
        }, 'trueRoute_final');
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.RonnieRouteAct3 = RonnieRouteAct3;
}

// ES Module export
export { RonnieRouteAct3 };
