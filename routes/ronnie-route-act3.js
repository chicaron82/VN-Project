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

    ronnie_act3_01_start() {
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
            next: () => this.ronnie_act3_02_greeting(),
            delay: 4000
        }, 'ronnie_act3_01_start');
    }

    ronnie_act3_02_greeting() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Baby, you\'re staring again."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_03_response(),
            delay: 2500
        }, 'ronnie_act3_02_greeting');
    }

    ronnie_act3_03_response() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"I just... you\'re okay. You\'re really okay."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_04_smile(),
            delay: 2500
        }, 'ronnie_act3_03_response');
    }

    ronnie_act3_04_smile() {
        this.game.displayScene({
            character: 'Tori (bright)',
            dialogue: '"Of course I am! What, you worried I\'d disappear or something?"',
            internal: '[She laughs. It sounds... hollow. Just slightly.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_05_choice(),
            delay: 3000
        }, 'ronnie_act3_04_smile');
    }

    ronnie_act3_05_choice() {
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
            onChoice: (choice) => this.ronnie_act3_06_outcome(choice)
        }, 'ronnie_act3_05_choice');
    }

    ronnie_act3_06_outcome(choice) {
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
                                next: () => this.ronnie_act3_07_fracture(),
                                delay: 5000
                            }, 'ronnie_act3_06_outcome_test_reveal');
                        },
                        delay: 3500
                    }, 'ronnie_act3_06_outcome_test_correct');
                },
                delay: 3000
            }, 'ronnie_act3_06_outcome_test');
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
                next: () => this.ronnie_act3_07_fracture(),
                delay: 5000
            }, 'ronnie_act3_06_outcome_confront');
        }
    }

    // ========================================
    // BEAT 2: MEMORY FRACTURE
    // Tori's memories start corrupting
    // ========================================
    
    ronnie_act3_07_fracture() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"Over the next few days, it got worse. She\'d forget things. Small things at first."',
            internal: '[Visual: Digital apartment. Tori cooking breakfast - movements glitchy, repeating.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_08_forgetting(),
            delay: 3500
        }, 'ronnie_act3_07_fracture');
    }
    
    ronnie_act3_08_forgetting() {
        this.game.displayScene({
            character: 'Tori (confused)',
            dialogue: '"Baby, what\'s our anniversary date again?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_09_ronnieanswer(),
            delay: 2500
        }, 'ronnie_act3_08_forgetting');
    }
    
    ronnie_act3_09_ronnieanswer() {
        this.game.displayScene({
            character: 'Ronnie (careful)',
            dialogue: '"June 12th. We\'ve celebrated it four times."',
            internal: '[She knows this. She KNOWS this. Why is she asking?]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_10_torirealization(),
            delay: 3000
        }, 'ronnie_act3_09_ronnieanswer');
    }
    
    ronnie_act3_10_torirealization() {
        this.game.displayScene({
            character: 'Tori (panicking)',
            dialogue: '"I knew that. I KNEW that. Why couldn\'t I... Ronnie, what\'s happening to me?"',
            internal: '[Her sprite flickers. Eyes wide with fear.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_11_promise(),
            delay: 3000,
            style: 'critical'
        }, 'ronnie_act3_10_torirealization');
    }
    
    ronnie_act3_11_promise() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"It\'s okay. We\'ll figure it out. I promise."',
            internal: '[Ronnie (internal): "But I had no idea how. The code was stable. What was causing this?"]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_12_systemmessages(),
            delay: 3500
        }, 'ronnie_act3_11_promise');
    }
    
    // ========================================
    // BEAT 3: SYSTEM MESSAGES INTRUDE
    // External warnings break through
    // ========================================
    
    ronnie_act3_12_systemmessages() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Then the messages started appearing.',
            internal: '[Visual: Text overlays bleeding through the game world. Red warnings.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_13_firstmessage(),
            delay: 2500
        }, 'ronnie_act3_12_systemmessages');
    }
    
    ronnie_act3_13_firstmessage() {
        this.game.displayScene({
            character: 'System Message',
            dialogue: '⚠️ WARNING: MEMORY CORRUPTION DETECTED\n⚠️ VESSEL INSTABILITY: 67%\n⚠️ RECOMMEND IMMEDIATE DIAGNOSTICS',
            internal: '[The text appears over Tori\'s sprite. She can see it too.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_14_torisees(),
            delay: 3000,
            style: 'critical'
        }, 'ronnie_act3_13_firstmessage');
    }
    
    ronnie_act3_14_torisees() {
        this.game.displayScene({
            character: 'Tori (reading)',
            dialogue: '"Ronnie... I can see that. The warnings. Vessel instability? What vessel?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_15_ronniehesitates(),
            delay: 3000
        }, 'ronnie_act3_14_torisees');
    }
    
    ronnie_act3_15_ronniehesitates() {
        this.game.displayScene({
            character: 'Ronnie (deflecting)',
            dialogue: '"Just... system diagnostics. Nothing to worry about."',
            internal: '[Ronnie (internal): "I couldn\'t tell her. Not yet. Not while she was already scared."]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_16_morewarnings(),
            delay: 3000
        }, 'ronnie_act3_15_ronniehesitates');
    }
    
    ronnie_act3_16_morewarnings() {
        this.game.displayScene({
            character: 'System Message',
            dialogue: '⚠️ CRITICAL: BATTERY DEPLETION ACCELERATING\n⚠️ CONSCIOUSNESS ANCHOR: UNSTABLE\n⚠️ ESTIMATED TIME TO FAILURE: 72 HOURS',
            internal: '[More messages. Faster now. Tori\'s sprite glitches harder with each one.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_17_toridemands(),
            delay: 3500,
            style: 'critical'
        }, 'ronnie_act3_16_morewarnings');
    }
    
    ronnie_act3_17_toridemands() {
        this.game.displayScene({
            character: 'Tori (firm)',
            dialogue: '"Ronnie. TELL ME. What\'s happening? What\'s the vessel? What\'s failing?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_18_shatter(),
            delay: 3000
        }, 'ronnie_act3_17_toridemands');
    }
    
    // ========================================
    // BEAT 4: FRAGMENTATION
    // Tori's consciousness destabilizes
    // ========================================
    
    ronnie_act3_18_shatter() {
        this.game.displayScene({
            character: 'Ronnie (breaking)',
            dialogue: '"The Tamagotchi. You\'re... inside it. Your consciousness transferred during the fall. But the device is dying."',
            internal: '[Ronnie finally admits it. The truth he\'d been hiding.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_19_toriprocessing(),
            delay: 4000
        }, 'ronnie_act3_18_shatter');
    }
    
    ronnie_act3_19_toriprocessing() {
        this.game.displayScene({
            character: 'Tori (slowly)',
            dialogue: '"I\'m... in the Tamagotchi. Not the game. The device itself."',
            internal: '[Her sprite stutters. Reality reshaping around the revelation.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_20_understanding(),
            delay: 3000
        }, 'ronnie_act3_19_toriprocessing');
    }
    
    ronnie_act3_20_understanding() {
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
            next: () => this.ronnie_act3_21_ronnieconfirms(),
            delay: 3000
        }, 'ronnie_act3_20_understanding');
    }
    
    ronnie_act3_21_ronnieconfirms() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Yes. And when it dies... I don\'t know what happens to you. If you just... stop. Or if it\'s worse."',
            internal: '[The weight of it. The timer counting down.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_22_glitch(),
            delay: 3500
        }, 'ronnie_act3_21_ronnieconfirms');
    }
    
    ronnie_act3_22_glitch() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'GLITCH.',
            internal: '[Tori\'s sprite fractures. Screen tears. Visual corruption spreads.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_23_toriscreaming(),
            delay: 1500,
            style: 'critical'
        }, 'ronnie_act3_22_glitch');
    }
    
    ronnie_act3_23_toriscreaming() {
        this.game.displayScene({
            character: 'Tori (distorted)',
            dialogue: '"I can feel it. The edges. I\'m coming apart. Ronnie, I\'m SCARED—"',
            internal: '[Her voice fragments mid-word. Sprite dissolving at the edges.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_24_ronniegrabs(),
            delay: 3000,
            style: 'critical'
        }, 'ronnie_act3_23_toriscreaming');
    }
    
    ronnie_act3_24_ronniegrabs() {
        this.game.displayScene({
            character: 'Ronnie (desperate)',
            dialogue: '"Hold on! Just—stay with me! I\'ll fix this!"',
            internal: '[He grabs the device. Holds it close. Like proximity could keep her together.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act3_25_revelation(),
            delay: 3000
        }, 'ronnie_act3_24_ronnieg rabs');
    }
    
    // ========================================
    // BEAT 5: REVELATION - BODY ANCHOR
    // The solution becomes clear
    // ========================================
    
    ronnie_act3_25_revelation() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"And then I remembered. The hospital. The single buzz."',
            internal: '[Flashback: Device near Tori\'s body. One buzz. Different from the vessel transfers.]',
            background: 'assets/hospital.png',
            next: () => this.ronnie_act3_26_realization(),
            delay: 3500
        }, 'ronnie_act3_25_revelation');
    }
    
    ronnie_act3_26_realization() {
        this.game.displayScene({
            character: 'Ronnie (excited)',
            dialogue: '"The body. Tori, your BODY. It\'s still there. Still alive. That buzz—you were reaching for it!"',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act3_27_torihope(),
            delay: 3000
        }, 'ronnie_act3_26_realization');
    }
    
    ronnie_act3_27_torihope() {
        this.game.displayScene({
            character: 'Tori (through game)',
            dialogue: '"I felt something. Warmth. A pull. Different from the laptop."',
            background: 'assets/digitalSpace.png',
            sprites: {
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_28_theory(),
            delay: 3000
        }, 'ronnie_act3_27_torihope');
    }
    
    ronnie_act3_28_theory() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"If I bring the device close enough... if you can jump vessels... maybe you can jump HOME."',
            internal: '[The mad theory. Desperate. Beautiful. Terrifying.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act3_29_toriuncertain(),
            delay: 3500
        }, 'ronnie_act3_28_theory');
    }
    
    ronnie_act3_29_toriuncertain() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"But what if I can\'t? What if I just... dissolve? What if jumping destroys me?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_30_ronniepromise(),
            delay: 3000
        }, 'ronnie_act3_29_toriuncertain');
    }
    
    ronnie_act3_30_ronniepromise() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Then we find another way. Upload you somewhere safer. Or... I don\'t know. But we\'re running out of time."',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act3_31_timer(),
            delay: 3500
        }, 'ronnie_act3_30_ronniepromise');
    }
    
    ronnie_act3_31_timer() {
        this.game.displayScene({
            character: 'System Message',
            dialogue: '⚠️ CRITICAL BATTERY: 8% REMAINING\n⚠️ ESTIMATED TIME: 12 HOURS\n⚠️ DECISION REQUIRED',
            internal: '[The clock is ticking. Three paths emerge.]',
            background: 'assets/digitalSpace.png',
            next: () => this.ronnie_act3_32_criticalchoice(),
            delay: 3000,
            style: 'critical'
        }, 'ronnie_act3_31_timer');
    }

    ronnie_act3_32_criticalchoice() {
        // Unlock PerplexiZee's body anchor mechanics note - CRITICAL guidance
        this.route.collectiblesManager.unlockNote('pz2');
        
        this.game.displayScene({
            character: 'System',
            dialogue: 'CRITICAL CHOICE DETECTED',
            internal: '◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆\n[PULSE: Three distinct heartbeat patterns emerge]\n\n> PATH 1: UPLOAD    [rapid digital pulse]\n  "Trust the code. Expand the cage."\n  Outcome: Digital permanence. No return.\n\n> PATH 2: ANCHOR    [steady organic pulse]\n  "Follow your heartbeat home."\n  Outcome: Physical return. Life.\n\n> PATH 3: MERGE     [synchronized dual pulse]\n  "We stay together. Here. Forever."\n  Outcome: Eternal digital union.\n\n[The timer ticks down. 10 seconds to choose.]',
            background: 'assets/digitalSpace.png',
            choices: [
                { text: 'PATH 1: UPLOAD - Trust the code', value: 'upload_end' },
                { text: 'PATH 2: ANCHOR - Follow the heartbeat', value: 'anchor_end' },
                { text: 'PATH 3: MERGE - Stay together digitally', value: 'merge_end' }
            ],
            onChoice: (choice) => {
                this.game.gameState.flags.final_ending_choice = choice;
                this.ronnie_act3_33_routetoending(choice);
            }
        }, 'ronnie_act3_32_criticalchoice');
    }

    ronnie_act3_33_routetoending(choice) {
        if (choice === 'upload_end') {
            this.ronnie_act3_34_badending();
        } else if (choice === 'anchor_end') {
            this.ronnie_act3_51_trueending();
        } else if (choice === 'merge_end') {
            this.ronnie_act3_41_digitalforever();
        }
    }

    // ========================================
    // BAD ENDING - CODE PRISON
    // ========================================

    ronnie_act3_34_badending() {
        this.game.displayScene({
            character: 'Ronnie (desperate)',
            dialogue: '"If you can\'t escape... then I\'ll JOIN you. Upload me too. We\'ll be together."',
            internal: '[He frantically types commands. Upload sequence initiates.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act3_35_upload(),
            delay: 4000
        }, 'ronnie_act3_34_badending');
    }

    ronnie_act3_35_upload() {
        this.game.displayScene({
            character: 'System',
            dialogue: 'UPLOADING CONSCIOUSNESS... 15%... 47%... 89%...',
            internal: '[Visual: Ronnie\'s vision pixelates. He feels himself pulled INTO the screen.]',
            background: 'assets/digitalSpace.png',
            next: () => this.ronnie_act3_36_arrival(),
            delay: 3500
        }, 'ronnie_act3_35_upload');
    }

    ronnie_act3_36_arrival() {
        this.game.displayScene({
            character: 'Ronnie (now digital)',
            dialogue: '"Tori? TORI? Where are you?"',
            internal: '[He\'s inside the code. Pixelated. Alone.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act3_37_toriresponse(),
            delay: 3000
        }, 'ronnie_act3_36_arrival');
    }

    ronnie_act3_37_toriresponse() {
        this.game.displayScene({
            character: 'Tori (distant, glitching)',
            dialogue: '"Ronnie... why did you come here? Now we\'re BOTH stuck..."',
            internal: '[Her voice echoes from multiple directions. Fragmented. Scared.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_38_realization(),
            delay: 4000
        }, 'ronnie_act3_37_toriresponse');
    }

    ronnie_act3_38_realization() {
        this.game.displayScene({
            character: 'Ronnie (horrified)',
            dialogue: '"No. No no no. This was supposed to SAVE you!"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_39_loop(),
            delay: 3000
        }, 'ronnie_act3_38_realization');
    }

    ronnie_act3_39_loop() {
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
            background: 'assets/digitalSpace.png',
            next: () => this.ronnie_act3_40_retry(),
            delay: 5000
        }, 'ronnie_act3_39_loop');
    }

    ronnie_act3_40_retry() {
        const currentVersion = this.game.loopVersion;
        const nextVersion = currentVersion + 1; // Calculate but don't increment yet
        
        this.game.displayScene({
            character: 'System',
            dialogue: `VERSION ${currentVersion} FAILED\nINITIATING VERSION ${nextVersion}...`,
            internal: '[The loop continues. Try again. You can save her.]\n[RETRY? Y/N]',
            background: 'assets/digitalSpace.png',
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
        }, 'ronnie_act3_40_retry');
    }

    // ========================================
    // DIGITAL FOREVER ENDING - ETERNAL UNION
    // ========================================

    ronnie_act3_41_digitalforever() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"If you can\'t leave... then I\'m not leaving either. We stay together. Here. Forever."',
            internal: '[He presses "MERGE" before she can protest.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act3_42_merge(),
            delay: 4000
        }, 'ronnie_act3_41_digitalforever');
    }

    ronnie_act3_42_merge() {
        this.game.displayScene({
            character: 'System',
            dialogue: 'MERGE PROTOCOL INITIATED\nCONSCIOUSNESS TRANSFER: 100%',
            internal: '[Visual: Ronnie dissolves into pixels. His sprite materializes beside Tori\'s.]',
            background: 'assets/digitalSpace.png',
            next: () => this.ronnie_act3_43_together(),
            delay: 3500
        }, 'ronnie_act3_42_merge');
    }

    ronnie_act3_43_together() {
        this.game.displayScene({
            character: 'Tori (shocked)',
            dialogue: '"Ronnie... what did you DO?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_44_ronniesmile(),
            delay: 2500
        }, 'ronnie_act3_43_together');
    }

    ronnie_act3_44_ronniesmile() {
        this.game.displayScene({
            character: 'Ronnie (sprite, smiling)',
            dialogue: '"What I promised. Always."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_45_acceptance(),
            delay: 3000
        }, 'ronnie_act3_44_ronniesmile');
    }

    ronnie_act3_45_acceptance() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"You idiot. Beautiful idiot."',
            internal: '[She takes his hand. Their sprites sync perfectly.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_46_world(),
            delay: 3000
        }, 'ronnie_act3_45_acceptance');
    }

    ronnie_act3_46_world() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'They build their world together. Pixel parks. Digital sunsets. Eternally young. Eternally together.',
            internal: '[Visual: Their apartment, recreated in code. Perfect. Frozen. Safe.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_47_static(),
            delay: 4000
        }, 'ronnie_act3_46_world');
    }

    ronnie_act3_47_static() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'No sickness. No death. No separation.',
            internal: '[But also: No growth. No change. No real touch. Just eternal digital stasis.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_48_hospital(),
            delay: 4000
        }, 'ronnie_act3_47_static');
    }

    ronnie_act3_48_hospital() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '[CUT TO: Hospital room. Two bodies on beds. Monitors humming. No one wakes.]',
            internal: '[Outside the window, years pass. Seasons change. The world moves on without them.]',
            background: 'assets/hospital.png',
            next: () => this.ronnie_act3_49_choice(),
            delay: 5000
        }, 'ronnie_act3_48_hospital');
    }

    ronnie_act3_49_choice() {
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
            background: 'assets/hospital.png',
            next: () => this.ronnie_act3_50_retry(),
            delay: 5000
        }, 'ronnie_act3_49_choice');
    }

    ronnie_act3_50_retry() {
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
        }, 'ronnie_act3_50_retry');
    }

    // ========================================
    // TRUE ENDING - THE ANCHOR
    // ========================================

    ronnie_act3_51_trueending() {
        this.game.displayScene({
            character: 'Ronnie (realization)',
            dialogue: '"The heartbeat. It\'s not just a connection. It\'s a BRIDGE."',
            internal: '[He grabs the Tamagotchi. Her body. The anchor.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act3_52_understanding(),
            delay: 4000
        }, 'ronnie_act3_51_trueending');
    }

    ronnie_act3_52_understanding() {
        this.game.displayScene({
            character: 'Tori (from device, urgent)',
            dialogue: '"The body! Ronnie, my BODY is the anchor! I can feel it pulling me when you\'re near!"',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_53_plan(),
            delay: 3500
        }, 'ronnie_act3_52_understanding');
    }

    ronnie_act3_53_plan() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Then we follow it back. Device to hand. Heartbeat to heartbeat. I\'ll anchor you."',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_54_race(),
            delay: 3000
        }, 'ronnie_act3_53_plan');
    }

    ronnie_act3_54_race() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'MONITORS SCREAMING. COHERENCE DROPPING TO 12%. THE MAD DASH BEGINS.',
            internal: '[Visual: Ronnie sprinting down hospital corridors. Tamagotchi clutched tight. Nurses shouting. He doesn\'t stop.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act3_55_burst(),
            delay: 4000
        }, 'ronnie_act3_54_race');
    }

    ronnie_act3_55_burst() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'He BURSTS through the door.',
            internal: '[Her body convulsing. Alarms blaring. Medical staff scrambling.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act3_56_move(),
            delay: 3000
        }, 'ronnie_act3_55_burst');
    }

    ronnie_act3_56_move() {
        this.game.displayScene({
            character: 'Ronnie (shouting over alarms)',
            dialogue: '"Move!"',
            internal: '[He reaches her bedside. Places the Tamagotchi in her palm. Closes her fingers around it with his own hand covering hers.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act3_57_anchor(),
            delay: 3000
        }, 'ronnie_act3_56_move');
    }

    ronnie_act3_57_anchor() {
        this.game.displayScene({
            character: 'Ronnie (steady, voice anchoring)',
            dialogue: '"Come home. Follow the heartbeat."',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act3_58_transfer(),
            delay: 3000
        }, 'ronnie_act3_57_anchor');
    }

    ronnie_act3_58_transfer() {
        this.game.displayScene({
            character: 'Tori (voice, echoing from device)',
            dialogue: '"I feel it... the pull... I\'m—',
            internal: '[Visual: Tamagotchi screen. Tori\'s sprite begins to dissolve - not glitch, but fade like mist.]\n[Visual: Her real hand twitches.]\n[Monitor stabilizes slightly. Beeping slows from erratic to rhythmic.]\n[Her eyes move beneath closed lids.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act3_59_whisper(),
            delay: 4500
        }, 'ronnie_act3_58_transfer');
    }

    ronnie_act3_59_whisper() {
        this.game.displayScene({
            character: 'Ronnie (whispering, tears streaming)',
            dialogue: '"That\'s it. That\'s it, baby. Follow me back."',
            internal: '[Visual: Tamagotchi screen goes completely white. Then dark. Silent.]\n[Beat of silence.]\n[Her eyes flutter open.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act3_60_awakening(),
            delay: 5000
        }, 'ronnie_act3_59_whisper');
    }

    ronnie_act3_60_awakening() {
        this.game.displayScene({
            character: 'Tori (hoarse, confused)',
            dialogue: '"...Ronnie?"',
            internal: '[He breaks. Collapses forward, forehead against her hand.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_61_always(),
            delay: 3000
        }, 'ronnie_act3_60_awakening');
    }

    ronnie_act3_61_always() {
        this.game.displayScene({
            character: 'Ronnie (voice shaking)',
            dialogue: '"Always. Always. Always."',
            internal: '[She lifts her free hand shakily. Touches his hair. Strokes it.]\n[They cry together. No words. Just breathing.]',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_62_terrible(),
            delay: 4000
        }, 'ronnie_act3_61_always');
    }

    ronnie_act3_62_terrible() {
        this.game.displayScene({
            character: 'Tori (weak smile)',
            dialogue: '"You look terrible."',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_63_months(),
            delay: 2500
        }, 'ronnie_act3_62_terrible');
    }

    ronnie_act3_63_months() {
        this.game.displayScene({
            character: 'Ronnie (laughing through tears)',
            dialogue: '"You\'ve been asleep for months."',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_64_scared(),
            delay: 2500
        }, 'ronnie_act3_63_months');
    }

    ronnie_act3_64_scared() {
        this.game.displayScene({
            character: 'Tori (soft)',
            dialogue: '"I was so scared. I couldn\'t find you. And then I could. But I couldn\'t touch you."',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_65_home(),
            delay: 4000
        }, 'ronnie_act3_64_scared');
    }

    ronnie_act3_65_home() {
        this.game.displayScene({
            character: 'Ronnie (squeezing her hand)',
            dialogue: '"You\'re here now. You\'re real. You\'re home."',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_66_toast(),
            delay: 3000
        }, 'ronnie_act3_65_home');
    }

    ronnie_act3_66_toast() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"So... you up for some burnt toast?"',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_67_pasta(),
            delay: 2500
        }, 'ronnie_act3_66_toast');
    }

    ronnie_act3_67_pasta() {
        this.game.displayScene({
            character: 'Ronnie (laughing, crying)',
            dialogue: '"Only if I get to oversalt the pasta."',
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act3_68_final(),
            delay: 3000
        }, 'ronnie_act3_67_pasta');
    }

    ronnie_act3_68_final() {
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
            background: 'assets/hospital.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => {
                // Transition to shared epilogue
                const epilogue = new Epilogue(this.game);
                epilogue.start();
            },
            delay: 4000
        }, 'ronnie_act3_68_final');
    }
}
