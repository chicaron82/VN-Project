// RONNIE'S ROUTE - ACT 3
// Crisis, Mad Dash, and All Endings

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
            next: () => this.act3Beat1_greeting(),
            delay: 4000
        }, 'startAct3');
    }

    act3Beat1_greeting() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Baby, you\'re staring again."',
            next: () => this.act3Beat1_response(),
            delay: 2500
        }, 'act3Beat1_greeting');
    }

    act3Beat1_response() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"I just... you\'re okay. You\'re really okay."',
            next: () => this.act3Beat1_smile(),
            delay: 2500
        }, 'act3Beat1_response');
    }

    act3Beat1_smile() {
        this.game.displayScene({
            character: 'Tori (bright)',
            dialogue: '"Of course I am! What, you worried I\'d disappear or something?"',
            internal: '[She laughs. It sounds... hollow. Just slightly.]',
            next: () => this.act3Beat1_choice(),
            delay: 3000
        }, 'act3Beat1_smile');
    }

    act3Beat1_choice() {
        this.game.displayScene({
            character: 'Ronnie (internal)',
            dialogue: 'Something is off.',
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
                next: () => {
                    this.game.displayScene({
                        character: 'Ronnie (carefully)',
                        dialogue: '"I remember. You hate that flavor. You said it tastes like \'candy corn\'s evil twin.\'"',
                        next: () => {
                            this.game.displayScene({
                                character: 'Tori (confused, then recovering)',
                                dialogue: '"Oh. Right. Yeah. Chocolate chip. I meant chocolate chip."\n[She laughs, but it sounds slightly off-pitch.]\n"Sorry, I\'m... scattered today. Brain fog."',
                                internal: '[Ronnie (narration): "Fuzzy. Wrong word. Wrong memory. Wrong flavor. Something was very, very wrong."]',
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
                next: () => this.act3Beat2(),
                delay: 5000
            }, 'act3Beat1_outcome_confront');
        }
    }

    // Beat 2-6: Summary implementation (can be expanded later)
    act3Beat2() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '[ACT 3 BEATS 2-5: Memory fracture, system messages intrude, fragmentation, revelation - TO BE FULLY IMPLEMENTED]\n\nThe honeymoon illusion collapses. Memories corrupt. System messages flood the screen. Tori realizes the truth about the body anchor.\n\n"The mad dash begins..."',
            next: () => this.act3CriticalChoice(),
            delay: 6000
        }, 'act3Beat2');
    }

    act3CriticalChoice() {
        this.game.displayScene({
            character: 'System',
            dialogue: 'CRITICAL CHOICE DETECTED',
            internal: '●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●\n[PULSE: Three distinct heartbeat patterns emerge]\n\n> PATH 1: UPLOAD    [rapid digital pulse]\n  "Trust the code. Expand the cage."\n  Outcome: Digital permanence. No return.\n\n> PATH 2: ANCHOR    [steady organic pulse]\n  "Follow your heartbeat home."\n  Outcome: Physical return. Life.\n\n> PATH 3: MERGE     [synchronized dual pulse]\n  "We stay together. Here. Forever."\n  Outcome: Eternal digital union.\n\n[The timer ticks down. 10 seconds to choose.]',
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
            next: () => this.badRoute_upload(),
            delay: 4000
        }, 'badRouteEnding');
    }

    badRoute_upload() {
        this.game.displayScene({
            character: 'System',
            dialogue: 'UPLOADING CONSCIOUSNESS... 15%... 47%... 89%...',
            internal: '[Visual: Ronnie\'s vision pixelates. He feels himself pulled INTO the screen.]',
            next: () => this.badRoute_arrival(),
            delay: 3500
        }, 'badRoute_upload');
    }

    badRoute_arrival() {
        this.game.displayScene({
            character: 'Ronnie (now digital)',
            dialogue: '"Tori? TORI? Where are you?"',
            internal: '[He\'s inside the code. Pixelated. Alone.]',
            next: () => this.badRoute_toriResponse(),
            delay: 3000
        }, 'badRoute_arrival');
    }

    badRoute_toriResponse() {
        this.game.displayScene({
            character: 'Tori (distant, glitching)',
            dialogue: '"Ronnie... why did you come here? Now we\'re BOTH stuck..."',
            internal: '[Her voice echoes from multiple directions. Fragmented. Scared.]',
            next: () => this.badRoute_realization(),
            delay: 4000
        }, 'badRoute_toriResponse');
    }

    badRoute_realization() {
        this.game.displayScene({
            character: 'Ronnie (horrified)',
            dialogue: '"No. No no no. This was supposed to SAVE you!"',
            next: () => this.badRoute_loop(),
            delay: 3000
        }, 'badRoute_realization');
    }

    badRoute_loop() {
        this.game.displayScene({
            character: 'System',
            dialogue: 'ERROR: Two consciousness entities detected. System unstable. Looping indefinitely.',
            internal: '[Visual: The world glitches. Resets. Loops. They\'re trapped together in a recursive nightmare.]\n[Both bodies in hospital. Both minds in code. No escape.]\n\n**BAD ENDING: CODE PRISON**\n"Love trapped in glass."',
            next: () => this.badRoute_retry(),
            delay: 5000
        }, 'badRoute_loop');
    }

    badRoute_retry() {
        const attemptNumber = localStorage.getItem('attemptNumber') || '848';
        const nextAttempt = parseInt(attemptNumber) + 1;
        localStorage.setItem('attemptNumber', nextAttempt.toString());
        
        this.game.displayScene({
            character: 'System',
            dialogue: `VERSION ${attemptNumber} FAILED\nINITIATING VERSION ${nextAttempt}...`,
            internal: '[The loop continues. Try again. You can save her.]\n[RETRY? Y/N]',
            choices: [
                { text: 'Yes - Try again', value: 'retry' },
                { text: 'No - Accept this ending', value: 'accept' }
            ],
            onChoice: (choice) => {
                if (choice === 'retry') {
                    // Return to prologue or Act 1
                    this.route.resetToStart();
                } else {
                    // End game
                    this.game.endGame();
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
            next: () => this.digitalForever_merge(),
            delay: 4000
        }, 'digitalForeverEnding');
    }

    digitalForever_merge() {
        this.game.displayScene({
            character: 'System',
            dialogue: 'MERGE PROTOCOL INITIATED\nCONSCIOUSNESS TRANSFER: 100%',
            internal: '[Visual: Ronnie dissolves into pixels. His sprite materializes beside Tori\'s.]',
            next: () => this.digitalForever_together(),
            delay: 3500
        }, 'digitalForever_merge');
    }

    digitalForever_together() {
        this.game.displayScene({
            character: 'Tori (shocked)',
            dialogue: '"Ronnie... what did you DO?"',
            next: () => this.digitalForever_ronnieSmile(),
            delay: 2500
        }, 'digitalForever_together');
    }

    digitalForever_ronnieSmile() {
        this.game.displayScene({
            character: 'Ronnie (sprite, smiling)',
            dialogue: '"What I promised. Always."',
            next: () => this.digitalForever_acceptance(),
            delay: 3000
        }, 'digitalForever_ronnieSmile');
    }

    digitalForever_acceptance() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"You idiot. Beautiful idiot."',
            internal: '[She takes his hand. Their sprites sync perfectly.]',
            next: () => this.digitalForever_world(),
            delay: 3000
        }, 'digitalForever_acceptance');
    }

    digitalForever_world() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'They build their world together. Pixel parks. Digital sunsets. Eternally young. Eternally together.',
            internal: '[Visual: Their apartment, recreated in code. Perfect. Frozen. Safe.]',
            next: () => this.digitalForever_static(),
            delay: 4000
        }, 'digitalForever_world');
    }

    digitalForever_static() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'No sickness. No death. No separation.',
            internal: '[But also: No growth. No change. No real touch. Just eternal digital stasis.]',
            next: () => this.digitalForever_hospital(),
            delay: 4000
        }, 'digitalForever_static');
    }

    digitalForever_hospital() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '[CUT TO: Hospital room. Two bodies on beds. Monitors humming. No one wakes.]',
            internal: '[Outside the window, years pass. Seasons change. The world moves on without them.]',
            next: () => this.digitalForever_choice(),
            delay: 5000
        }, 'digitalForever_hospital');
    }

    digitalForever_choice() {
        this.game.displayScene({
            character: 'System',
            dialogue: '**DIGITAL FOREVER ENDING**\n"Together, eternally still."',
            internal: '[Is this love? Or is it fear of loss?\nIs safety worth stagnation?\nYou chose connection over growth.]\n\n[They remain, forever digital, forever young, forever together...]\n[...forever frozen.]',
            next: () => this.digitalForever_retry(),
            delay: 5000
        }, 'digitalForever_choice');
    }

    digitalForever_retry() {
        const attemptNumber = localStorage.getItem('attemptNumber') || '848';
        const nextAttempt = parseInt(attemptNumber) + 1;
        localStorage.setItem('attemptNumber', nextAttempt.toString());
        
        this.game.displayScene({
            character: 'System',
            dialogue: `VERSION ${attemptNumber} - DIGITAL FOREVER\nDo you want to see another path?\nVERSION ${nextAttempt} is waiting...`,
            choices: [
                { text: 'Yes - Try another path', value: 'retry' },
                { text: 'No - This is their happiness', value: 'accept' }
            ],
            onChoice: (choice) => {
                if (choice === 'retry') {
                    this.route.resetToStart();
                } else {
                    this.game.endGame();
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
            next: () => this.trueRoute_understanding(),
            delay: 4000
        }, 'trueRouteEnding');
    }

    trueRoute_understanding() {
        this.game.displayScene({
            character: 'Tori (from device, urgent)',
            dialogue: '"The body! Ronnie, my BODY is the anchor! I can feel it pulling me when you\'re near!"',
            next: () => this.trueRoute_plan(),
            delay: 3500
        }, 'trueRoute_understanding');
    }

    trueRoute_plan() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Then we follow it back. Device to hand. Heartbeat to heartbeat. I\'ll anchor you."',
            next: () => this.trueRoute_race(),
            delay: 3000
        }, 'trueRoute_plan');
    }

    trueRoute_race() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'MONITORS SCREAMING. COHERENCE DROPPING TO 12%. THE MAD DASH BEGINS.',
            internal: '[Visual: Ronnie sprinting down hospital corridors. Tamagotchi clutched tight. Nurses shouting. He doesn\'t stop.]',
            next: () => this.trueRoute_burst(),
            delay: 4000
        }, 'trueRoute_race');
    }

    trueRoute_burst() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'He BURSTS through the door.',
            internal: '[Her body convulsing. Alarms blaring. Medical staff scrambling.]',
            next: () => this.trueRoute_move(),
            delay: 3000
        }, 'trueRoute_burst');
    }

    trueRoute_move() {
        this.game.displayScene({
            character: 'Ronnie (shouting over alarms)',
            dialogue: '"Move!"',
            internal: '[He reaches her bedside. Places the Tamagotchi in her palm. Closes her fingers around it with his own hand covering hers.]',
            next: () => this.trueRoute_anchor(),
            delay: 3000
        }, 'trueRoute_move');
    }

    trueRoute_anchor() {
        this.game.displayScene({
            character: 'Ronnie (steady, voice anchoring)',
            dialogue: '"Come home. Follow the heartbeat."',
            next: () => this.trueRoute_transfer(),
            delay: 3000
        }, 'trueRoute_anchor');
    }

    trueRoute_transfer() {
        this.game.displayScene({
            character: 'Tori (voice, echoing from device)',
            dialogue: '"I feel it... the pull... I\'m—',
            internal: '[Visual: Tamagotchi screen. Tori\'s sprite begins to dissolve - not glitch, but fade like mist.]\n[Visual: Her real hand twitches.]\n[Monitor stabilizes slightly. Beeping slows from erratic to rhythmic.]\n[Her eyes move beneath closed lids.]',
            next: () => this.trueRoute_whisper(),
            delay: 4500
        }, 'trueRoute_transfer');
    }

    trueRoute_whisper() {
        this.game.displayScene({
            character: 'Ronnie (whispering, tears streaming)',
            dialogue: '"That\'s it. That\'s it, baby. Follow me back."',
            internal: '[Visual: Tamagotchi screen goes completely white. Then dark. Silent.]\n[Beat of silence.]\n[Her eyes flutter open.]',
            next: () => this.trueRoute_awakening(),
            delay: 5000
        }, 'trueRoute_whisper');
    }

    trueRoute_awakening() {
        this.game.displayScene({
            character: 'Tori (hoarse, confused)',
            dialogue: '"...Ronnie?"',
            internal: '[He breaks. Collapses forward, forehead against her hand.]',
            next: () => this.trueRoute_always(),
            delay: 3000
        }, 'trueRoute_awakening');
    }

    trueRoute_always() {
        this.game.displayScene({
            character: 'Ronnie (voice shaking)',
            dialogue: '"Always. Always. Always."',
            internal: '[She lifts her free hand shakily. Touches his hair. Strokes it.]\n[They cry together. No words. Just breathing.]',
            next: () => this.trueRoute_terrible(),
            delay: 4000
        }, 'trueRoute_always');
    }

    trueRoute_terrible() {
        this.game.displayScene({
            character: 'Tori (weak smile)',
            dialogue: '"You look terrible."',
            next: () => this.trueRoute_months(),
            delay: 2500
        }, 'trueRoute_terrible');
    }

    trueRoute_months() {
        this.game.displayScene({
            character: 'Ronnie (laughing through tears)',
            dialogue: '"You\'ve been asleep for months."',
            next: () => this.trueRoute_scared(),
            delay: 2500
        }, 'trueRoute_months');
    }

    trueRoute_scared() {
        this.game.displayScene({
            character: 'Tori (soft)',
            dialogue: '"I was so scared. I couldn\'t find you. And then I could. But I couldn\'t touch you."',
            next: () => this.trueRoute_home(),
            delay: 4000
        }, 'trueRoute_scared');
    }

    trueRoute_home() {
        this.game.displayScene({
            character: 'Ronnie (squeezing her hand)',
            dialogue: '"You\'re here now. You\'re real. You\'re home."',
            next: () => this.trueRoute_toast(),
            delay: 3000
        }, 'trueRoute_home');
    }

    trueRoute_toast() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"So... you up for some burnt toast?"',
            next: () => this.trueRoute_pasta(),
            delay: 2500
        }, 'trueRoute_toast');
    }

    trueRoute_pasta() {
        this.game.displayScene({
            character: 'Ronnie (laughing, crying)',
            dialogue: '"Only if I get to oversalt the pasta."',
            next: () => this.trueRoute_final(),
            delay: 3000
        }, 'trueRoute_pasta');
    }

    trueRoute_final() {
        // Get player's version number for their success message
        const playerVersion = localStorage.getItem('attemptNumber') || '848';
        const attemptsCount = parseInt(playerVersion) - 848;
        
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
            next: () => {
                // Transition to shared epilogue
                const epilogue = new Epilogue(this.game);
                epilogue.start();
            },
            delay: 4000
        }, 'trueRoute_final');
    }
}