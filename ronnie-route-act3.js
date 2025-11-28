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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.act3Beat1_greeting(),
            delay: 4000
        }, 'startAct3');
    }

    act3Beat1_greeting() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Baby, you\'re staring again."',
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.act3Beat1_response(),
            delay: 2500
        }, 'act3Beat1_greeting');
    }

    act3Beat1_response() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"I just... you\'re okay. You\'re really okay."',
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.act3Beat1_choice(),
            delay: 3000
        }, 'act3Beat1_smile');
    }

    act3Beat1_choice() {
        this.game.displayScene({
            character: 'Ronnie (internal)',
            dialogue: 'Something is off.',
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
                background: 'digitalSpace.png',
                sprites: {
                    left: 'ronnie-sprite.png',
                    right: 'tori-sprite.png'
                },
                next: () => {
                    this.game.displayScene({
                        character: 'Ronnie (carefully)',
                        dialogue: '"I remember. You hate that flavor. You said it tastes like \'candy corn\'s evil twin.\'"',
                        background: 'digitalSpace.png',
                        sprites: {
                            left: 'ronnie-sprite.png',
                            right: 'tori-sprite.png'
                        },
                        next: () => {
                            this.game.displayScene({
                                character: 'Tori (confused, then recovering)',
                                dialogue: '"Oh. Right. Yeah. Chocolate chip. I meant chocolate chip."\n[She laughs, but it sounds slightly off-pitch.]\n"Sorry, I\'m... scattered today. Brain fog."',
                                internal: '[Ronnie (narration): "Fuzzy. Wrong word. Wrong memory. Wrong flavor. Something was very, very wrong."]',
                                background: 'digitalSpace.png',
                                sprites: {
                                    left: 'ronnie-sprite.png',
                                    right: 'tori-sprite.png'
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
                background: 'digitalSpace.png',
                sprites: {
                    left: 'ronnie-sprite.png',
                    right: 'tori-sprite.png'
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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.beat2_forgetting(),
            delay: 3500
        }, 'act3Beat2');
    }
    
    beat2_forgetting() {
        this.game.displayScene({
            character: 'Tori (confused)',
            dialogue: '"Baby, what\'s our anniversary date again?"',
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            dialogue: '"The Tamagotchi. You\'re... inside it. Your consciousness transferred during the fall. But the device is dying."',
            internal: '[Ronnie finally admits it. The truth he\'d been hiding.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'apartment.png',
            sprites: {
                left: 'ronnie-sprite.png'
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
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"And then I remembered. The hospital. The single buzz."',
            internal: '[Flashback: Device near Tori\'s body. One buzz. Different from the vessel transfers.]',
            background: 'hospital.png',
            next: () => this.beat5_realization(),
            delay: 3500
        }, 'act3Beat5');
    }
    
    beat5_realization() {
        this.game.displayScene({
            character: 'Ronnie (excited)',
            dialogue: '"The body. Tori, your BODY. It\'s still there. Still alive. That buzz—you were reaching for it!"',
            background: 'hospital.png',
            sprites: {
                left: 'ronnie-sprite.png'
            },
            next: () => this.beat5_toriHope(),
            delay: 3000
        }, 'beat5_realization');
    }
    
    beat5_toriHope() {
        this.game.displayScene({
            character: 'Tori (through game)',
            dialogue: '"I felt something. Warmth. A pull. Different from the laptop."',
            background: 'digitalSpace.png',
            sprites: {
                right: 'tori-sprite.png'
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
            background: 'apartment.png',
            sprites: {
                left: 'ronnie-sprite.png'
            },
            next: () => this.beat5_toriUncertain(),
            delay: 3500
        }, 'beat5_theory');
    }
    
    beat5_toriUncertain() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"But what if I can\'t? What if I just... dissolve? What if jumping destroys me?"',
            background: 'digitalSpace.png',
            sprites: {
                right: 'tori-sprite.png'
            },
            next: () => this.beat5_ronniePromise(),
            delay: 3000
        }, 'beat5_toriUncertain');
    }
    
    beat5_ronniePromise() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Then we find another way. Upload you somewhere safer. Or... I don\'t know. But we\'re running out of time."',
            background: 'apartment.png',
            sprites: {
                left: 'ronnie-sprite.png'
            },
            next: () => this.beat5_timer(),
            delay: 3500
        }, 'beat5_ronniePromise');
    }
    
    beat5_timer() {
        this.game.displayScene({
            character: 'System Message',
            dialogue: '⚠️ CRITICAL BATTERY: 8% REMAINING\n⚠️ ESTIMATED TIME: 12 HOURS\n⚠️ DECISION REQUIRED',
            internal: '[The clock is ticking. Three paths emerge.]',
            background: 'digitalSpace.png',
            next: () => this.act3CriticalChoice(),
            delay: 3000,
            style: 'critical'
        }, 'beat5_timer');
    }

    act3CriticalChoice() {
        // Unlock PerplexiZee's body anchor mechanics note - CRITICAL guidance
        this.route.collectiblesManager.unlockNote('pz2');
        
        this.game.displayScene({
            character: 'System',
            dialogue: 'CRITICAL CHOICE DETECTED',
            internal: '◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆\n[PULSE: Three distinct heartbeat patterns emerge]\n\n> PATH 1: UPLOAD    [rapid digital pulse]\n  "Trust the code. Expand the cage."\n  Outcome: Digital permanence. No return.\n\n> PATH 2: ANCHOR    [steady organic pulse]\n  "Follow your heartbeat home."\n  Outcome: Physical return. Life.\n\n> PATH 3: MERGE     [synchronized dual pulse]\n  "We stay together. Here. Forever."\n  Outcome: Eternal digital union.\n\n[The timer ticks down. 10 seconds to choose.]',
            background: 'digitalSpace.png',
            choices: [
                { text: 'PATH 1: UPLOAD - Trust the code', value: 'upload_end' },
                { text: 'PATH 2: ANCHOR - Follow the heartbeat', value: 'anchor_end' },
                { text: 'PATH 3: MERGE - Stay together digitally', value: 'merge_end' }
            ],
            onChoice: (choice) => {
                this.game.gameState.flags.final_ending_choice = choice;
                this.routeToEnding(choice);
            }
        }, 'act3CriticalChoice');
    }

    routeToEnding(choice) {
        if (choice === 'upload_end') {
            this.badRouteEnding();
        } else if (choice === 'anchor_end') {
            this.trueRouteEnding();
        } else if (choice === 'merge_end') {
            this.digitalForeverEnding();
        }
    }

    // ========================================
    // BAD ENDING - CODE PRISON
    // ========================================

    badRouteEnding() {
        this.game.displayScene({
            character: 'Ronnie (desperate)',
            dialogue: '"If you can\'t escape... then I\'ll JOIN you. Upload me too. We\'ll be together."',
            internal: '[He frantically types commands. Upload sequence initiates.]',
            background: 'apartment.png',
            sprites: {
                left: 'ronnie-sprite.png'
            },
            next: () => this.badRoute_upload(),
            delay: 4000
        }, 'badRouteEnding');
    }

    badRoute_upload() {
        this.game.displayScene({
            character: 'System',
            dialogue: 'UPLOADING CONSCIOUSNESS... 15%... 47%... 89%...',
            internal: '[Visual: Ronnie\'s vision pixelates. He feels himself pulled INTO the screen.]',
            background: 'digitalSpace.png',
            next: () => this.badRoute_arrival(),
            delay: 3500
        }, 'badRoute_upload');
    }

    badRoute_arrival() {
        this.game.displayScene({
            character: 'Ronnie (now digital)',
            dialogue: '"Tori? TORI? Where are you?"',
            internal: '[He\'s inside the code. Pixelated. Alone.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png'
            },
            next: () => this.badRoute_toriResponse(),
            delay: 3000
        }, 'badRoute_arrival');
    }

    badRoute_toriResponse() {
        this.game.displayScene({
            character: 'Tori (distant, glitching)',
            dialogue: '"Ronnie... why did you come here? Now we\'re BOTH stuck..."',
            internal: '[Her voice echoes from multiple directions. Fragmented. Scared.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.badRoute_realization(),
            delay: 4000
        }, 'badRoute_toriResponse');
    }

    badRoute_realization() {
        this.game.displayScene({
            character: 'Ronnie (horrified)',
            dialogue: '"No. No no no. This was supposed to SAVE you!"',
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.badRoute_loop(),
            delay: 3000
        }, 'badRoute_realization');
    }

    badRoute_loop() {
        // Unlock teaser note (first note player gets)
        this.route.collectiblesManager.unlockNote('ronnie_teaser');
        
        // Show notes button now (it was hidden during first playthrough)
        if (this.game.notesButton) {
            this.game.notesButton.style.display = 'block';
        }
        
        // Mark ending completed - unlocks notes for replay
        this.game.markEndingCompleted('bad');
        
        // UNLOCK SKIP FEATURE (first ending completion)
        if (!this.game.skipUnlocked) {
            this.game.unlockSkipFeature();
        }
        
        this.game.displayScene({
            character: 'System',
            dialogue: 'ERROR: Two consciousness entities detected. System unstable. Looping indefinitely.',
            internal: '[Visual: The world glitches. Resets. Loops. They\'re trapped together in a recursive nightmare.]\n[Both bodies in hospital. Both minds in code. No escape.]\n\n**BAD ENDING: CODE PRISON**\n"Love trapped in glass."',
            background: 'digitalSpace.png',
            next: () => this.badRoute_retry(),
            delay: 5000
        }, 'badRoute_loop');
    }

    badRoute_retry() {
        const currentVersion = this.game.loopVersion;
        const nextVersion = currentVersion + 1; // Calculate but don't increment yet
        
        this.game.displayScene({
            character: 'System',
            dialogue: `VERSION ${currentVersion} FAILED\nINITIATING VERSION ${nextVersion}...`,
            internal: '[The loop continues. Try again. You can save her.]\n[RETRY? Y/N]',
            background: 'digitalSpace.png',
            choices: [
                { text: 'Yes - Try again', value: 'retry' },
                { text: 'No - Accept this ending', value: 'accept' }
            ],
            onChoice: (choice) => {
                if (choice === 'retry') {
                    // NOW increment version (only on actual retry)
                    this.game.incrementVersion();
                    // Show loop reinit screen before restarting
                    this.game.showLoopInit(() => {
                        // Reset and restart Ronnie's route after loop init
                        this.route.start();
                    });
                } else {
                    // End game
                    this.game.returnToMainMenu();
                }
            }
        }, 'badRoute_retry');
    }

    // ========================================
    // DIGITAL FOREVER ENDING - ETERNAL UNION
    // ========================================

    digitalForeverEnding() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"If you can\'t leave... then I\'m not leaving either. We stay together. Here. Forever."',
            internal: '[He presses "MERGE" before she can protest.]',
            background: 'apartment.png',
            sprites: {
                left: 'ronnie-sprite.png'
            },
            next: () => this.digitalForever_merge(),
            delay: 4000
        }, 'digitalForeverEnding');
    }

    digitalForever_merge() {
        this.game.displayScene({
            character: 'System',
            dialogue: 'MERGE PROTOCOL INITIATED\nCONSCIOUSNESS TRANSFER: 100%',
            internal: '[Visual: Ronnie dissolves into pixels. His sprite materializes beside Tori\'s.]',
            background: 'digitalSpace.png',
            next: () => this.digitalForever_together(),
            delay: 3500
        }, 'digitalForever_merge');
    }

    digitalForever_together() {
        this.game.displayScene({
            character: 'Tori (shocked)',
            dialogue: '"Ronnie... what did you DO?"',
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.digitalForever_ronnieSmile(),
            delay: 2500
        }, 'digitalForever_together');
    }

    digitalForever_ronnieSmile() {
        this.game.displayScene({
            character: 'Ronnie (sprite, smiling)',
            dialogue: '"What I promised. Always."',
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'digitalSpace.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'hospital.png',
            next: () => this.digitalForever_choice(),
            delay: 5000
        }, 'digitalForever_hospital');
    }

    digitalForever_choice() {
        // Unlock teaser note (first note player gets)
        this.route.collectiblesManager.unlockNote('ronnie_teaser');
        
        // Show notes button now (it was hidden during first playthrough)
        if (this.game.notesButton) {
            this.game.notesButton.style.display = 'block';
        }
        
        // Mark ending completed - unlocks notes for replay
        this.game.markEndingCompleted('digital_forever');
        
        // UNLOCK SKIP FEATURE (first ending completion)
        if (!this.game.skipUnlocked) {
            this.game.unlockSkipFeature();
        }
        
        this.game.displayScene({
            character: 'System',
            dialogue: '**DIGITAL FOREVER ENDING**\n"Together, eternally still."',
            internal: '[Is this love? Or is it fear of loss?\nIs safety worth stagnation?\nYou chose connection over growth.]\n\n[They remain, forever digital, forever young, forever together...]\n[...forever frozen.]',
            background: 'hospital.png',
            next: () => this.digitalForever_retry(),
            delay: 5000
        }, 'digitalForever_choice');
    }

    digitalForever_retry() {
        const currentVersion = this.game.loopVersion;
        const nextVersion = currentVersion + 1; // Calculate but don't increment yet
        
        this.game.displayScene({
            character: 'System',
            dialogue: `VERSION ${currentVersion} - DIGITAL FOREVER\nDo you want to see another path?\nVERSION ${nextVersion} is waiting...`,
            background: 'genericBack.png',
            choices: [
                { text: 'Yes - Try another path', value: 'retry' },
                { text: 'No - This is their happiness', value: 'accept' }
            ],
            onChoice: (choice) => {
                if (choice === 'retry') {
                    // NOW increment version (only on actual retry)
                    this.game.incrementVersion();
                    // Show loop reinit screen before restarting
                    this.game.showLoopInit(() => {
                        // Reset and restart Ronnie's route after loop init
                        this.route.start();
                    });
                } else {
                    this.game.returnToMainMenu();
                }
            }
        }, 'digitalForever_retry');
    }

    // ========================================
    // TRUE ENDING - THE ANCHOR
    // ========================================

    trueRouteEnding() {
        this.game.displayScene({
            character: 'Ronnie (realization)',
            dialogue: '"The heartbeat. It\'s not just a connection. It\'s a BRIDGE."',
            internal: '[He grabs the Tamagotchi. Her body. The anchor.]',
            background: 'apartment.png',
            sprites: {
                left: 'ronnie-sprite.png'
            },
            next: () => this.trueRoute_understanding(),
            delay: 4000
        }, 'trueRouteEnding');
    }

    trueRoute_understanding() {
        this.game.displayScene({
            character: 'Tori (from device, urgent)',
            dialogue: '"The body! Ronnie, my BODY is the anchor! I can feel it pulling me when you\'re near!"',
            background: 'apartment.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.trueRoute_plan(),
            delay: 3500
        }, 'trueRoute_understanding');
    }

    trueRoute_plan() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Then we follow it back. Device to hand. Heartbeat to heartbeat. I\'ll anchor you."',
            background: 'apartment.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.trueRoute_race(),
            delay: 3000
        }, 'trueRoute_plan');
    }

    trueRoute_race() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'MONITORS SCREAMING. COHERENCE DROPPING TO 12%. THE MAD DASH BEGINS.',
            internal: '[Visual: Ronnie sprinting down hospital corridors. Tamagotchi clutched tight. Nurses shouting. He doesn\'t stop.]',
            background: 'hospital.png',
            sprites: {
                left: 'ronnie-sprite.png'
            },
            next: () => this.trueRoute_burst(),
            delay: 4000
        }, 'trueRoute_race');
    }

    trueRoute_burst() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'He BURSTS through the door.',
            internal: '[Her body convulsing. Alarms blaring. Medical staff scrambling.]',
            background: 'hospital.png',
            sprites: {
                left: 'ronnie-sprite.png'
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
            background: 'hospital.png',
            sprites: {
                left: 'ronnie-sprite.png'
            },
            next: () => this.trueRoute_anchor(),
            delay: 3000
        }, 'trueRoute_move');
    }

    trueRoute_anchor() {
        this.game.displayScene({
            character: 'Ronnie (steady, voice anchoring)',
            dialogue: '"Come home. Follow the heartbeat."',
            background: 'hospital.png',
            sprites: {
                left: 'ronnie-sprite.png'
            },
            next: () => this.trueRoute_transfer(),
            delay: 3000
        }, 'trueRoute_anchor');
    }

    trueRoute_transfer() {
        this.game.displayScene({
            character: 'Tori (voice, echoing from device)',
            dialogue: '"I feel it... the pull... I\'m—',
            internal: '[Visual: Tamagotchi screen. Tori\'s sprite begins to dissolve - not glitch, but fade like mist.]\n[Visual: Her real hand twitches.]\n[Monitor stabilizes slightly. Beeping slows from erratic to rhythmic.]\n[Her eyes move beneath closed lids.]',
            background: 'hospital.png',
            sprites: {
                left: 'ronnie-sprite.png'
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
            background: 'hospital.png',
            sprites: {
                left: 'ronnie-sprite.png'
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
            background: 'hospital.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
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
            background: 'hospital.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.trueRoute_terrible(),
            delay: 4000
        }, 'trueRoute_always');
    }

    trueRoute_terrible() {
        this.game.displayScene({
            character: 'Tori (weak smile)',
            dialogue: '"You look terrible."',
            background: 'hospital.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.trueRoute_months(),
            delay: 2500
        }, 'trueRoute_terrible');
    }

    trueRoute_months() {
        this.game.displayScene({
            character: 'Ronnie (laughing through tears)',
            dialogue: '"You\'ve been asleep for months."',
            background: 'hospital.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.trueRoute_scared(),
            delay: 2500
        }, 'trueRoute_months');
    }

    trueRoute_scared() {
        this.game.displayScene({
            character: 'Tori (soft)',
            dialogue: '"I was so scared. I couldn\'t find you. And then I could. But I couldn\'t touch you."',
            background: 'hospital.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.trueRoute_home(),
            delay: 4000
        }, 'trueRoute_scared');
    }

    trueRoute_home() {
        this.game.displayScene({
            character: 'Ronnie (squeezing her hand)',
            dialogue: '"You\'re here now. You\'re real. You\'re home."',
            background: 'hospital.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.trueRoute_toast(),
            delay: 3000
        }, 'trueRoute_home');
    }

    trueRoute_toast() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"So... you up for some burnt toast?"',
            background: 'hospital.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.trueRoute_pasta(),
            delay: 2500
        }, 'trueRoute_toast');
    }

    trueRoute_pasta() {
        this.game.displayScene({
            character: 'Ronnie (laughing, crying)',
            dialogue: '"Only if I get to oversalt the pasta."',
            background: 'hospital.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.trueRoute_final(),
            delay: 3000
        }, 'trueRoute_pasta');
    }

    trueRoute_final() {
        // Unlock teaser note (first note player gets)
        this.route.collectiblesManager.unlockNote('ronnie_teaser');
        
        // Show notes button now (it was hidden during first playthrough)
        if (this.game.notesButton) {
            this.game.notesButton.style.display = 'block';
        }
        
        // Mark ending completed - unlocks notes for replay
        this.game.markEndingCompleted('true');
        
        // UNLOCK SKIP FEATURE (first ending completion)
        if (!this.game.skipUnlocked) {
            this.game.unlockSkipFeature();
        }
        
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
            background: 'hospital.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => {
                // Transition to shared epilogue
                const epilogue = new Epilogue(this.game);
                epilogue.start();
            },
            delay: 4000
        }, 'trueRoute_final');
    }
}
