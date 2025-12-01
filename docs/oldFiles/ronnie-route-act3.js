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
        });
    }

    act3Beat1_greeting() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Baby, you\'re staring again."',
            next: () => this.act3Beat1_response(),
            delay: 2500
        });
    }

    act3Beat1_response() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"I just... you\'re okay. You\'re really okay."',
            next: () => this.act3Beat1_smile(),
            delay: 2500
        });
    }

    act3Beat1_smile() {
        this.game.displayScene({
            character: 'Tori (bright)',
            dialogue: '"Of course I am! What, you worried I\'d disappear or something?"',
            internal: '[She laughs. It sounds... hollow. Just slightly.]',
            next: () => this.act3Beat1_choice(),
            delay: 3000
        });
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
        });
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
                            });
                        },
                        delay: 3500
                    });
                },
                delay: 3000
            });
        } else if (choice === 'confront') {
            this.game.displayScene({
                character: 'Ronnie',
                dialogue: '"Something\'s wrong here. You\'re not remembering right. The hospital. The alarms. You were glitching apart and now you\'re just... perfect?"',
                internal: '[Tori\'s sprite freezes. Eyes wide. Then flickers violently - 3 seconds of blank stare. Snaps back. Voice colder.]',
                next: () => this.act3Beat2(),
                delay: 5000
            });
        }
    }

    // Beat 2-6: Summary implementation (can be expanded later)
    act3Beat2() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '[ACT 3 BEATS 2-5: Memory fracture, system messages intrude, fragmentation, revelation - TO BE FULLY IMPLEMENTED]\n\nThe honeymoon illusion collapses. Memories corrupt. System messages flood the screen. Tori realizes the truth about the body anchor.\n\n"The mad dash begins..."',
            next: () => this.act3CriticalChoice(),
            delay: 6000
        });
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
        });
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
        });
    }

    badRoute_upload() {
        this.game.displayScene({
            character: 'System',
            dialogue: 'UPLOADING CONSCIOUSNESS... 15%... 47%... 89%...',
            internal: '[Visual: Ronnie\'s vision pixelates. He feels himself pulled INTO the screen.]',
            next: () => this.badRoute_arrival(),
            delay: 3500
        });
    }

    badRoute_arrival() {
        this.game.displayScene({
            character: 'Ronnie (now digital)',
            dialogue: '"Tori? TORI? Where are you?"',
            internal: '[He\'s inside the code. Pixelated. Alone.]',
            next: () => this.badRoute_toriResponse(),
            delay: 3000
        });
    }

    badRoute_toriResponse() {
        this.game.displayScene({
            character: 'Tori (distant, glitching)',
            dialogue: '"Ronnie... why did you come here? Now we\'re BOTH stuck..."',
            internal: '[Her voice echoes from multiple directions. Fragmented. Scared.]',
            next: () => this.badRoute_realization(),
            delay: 4000
        });
    }

    badRoute_realization() {
        this.game.displayScene({
            character: 'Ronnie (horrified)',
            dialogue: '"No. No no no. This was supposed to SAVE you!"',
            next: () => this.badRoute_loop(),
            delay: 3000
        });
    }

    badRoute_loop() {
        this.game.displayScene({
            character: 'System',
            dialogue: 'ERROR: Two consciousness entities detected. System unstable. Looping indefinitely.',
            internal: '[Visual: The world glitches. Resets. Loops. They\'re trapped together in a recursive nightmare.]\n[Both bodies in hospital. Both minds in code. No escape.]\n\n**BAD ENDING: CODE PRISON**\n"Love trapped in glass."',
            next: () => this.badRoute_retry(),
            delay: 5000
        });
    }

    badRoute_retry() {
        // Increment version number
        const currentVersion = parseInt(localStorage.getItem('attemptNumber') || '848');
        const newVersion = currentVersion + 1;
        localStorage.setItem('attemptNumber', newVersion.toString());
        
        this.game.displayScene({
            character: 'System',
            dialogue: `RETRY? Version ${newVersion} loading...`,
            internal: '[The loop resets. Another timeline. Another attempt. Will you choose differently this time?]',
            choices: [
                { text: 'Try again (New Game)', value: 'retry' },
                { text: 'Return to Menu', value: 'menu' }
            ],
            onChoice: (choice) => {
                if (choice === 'retry') {
                    location.reload(); // Full restart with new version
                } else {
                    this.game.returnToMainMenu();
                }
            }
        });
    }

    // ========================================
    // DIGITAL FOREVER ENDING
    // ========================================

    digitalForeverEnding() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Then we stay. Together. Here. Forever."',
            internal: '[He stops fighting. Accepts the digital reality.]',
            next: () => this.digitalForever_acceptance(),
            delay: 3000
        });
    }

    digitalForever_acceptance() {
        this.game.displayScene({
            character: 'Tori (soft)',
            dialogue: '"You\'d give up the real world... for me?"',
            next: () => this.digitalForever_choice(),
            delay: 3000
        });
    }

    digitalForever_choice() {
        this.game.displayScene({
            character: 'Ronnie (certain)',
            dialogue: '"I\'d give up ANYTHING for you. If this is where you are... this is home."',
            internal: '[Visual: The pixel world stabilizes. Colors brighten. It becomes... comfortable.]',
            next: () => this.digitalForever_merge(),
            delay: 4000
        });
    }

    digitalForever_merge() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'He uploads himself voluntarily. This time, it works.',
            internal: '[Visual: Ronnie\'s consciousness merges with the code. He becomes digital - stable, whole.]',
            next: () => this.digitalForever_together(),
            delay: 3500
        });
    }

    digitalForever_together() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"You\'re really here. You\'re REALLY here."',
            internal: '[They embrace - two digital forms, no longer glitching. Stable. Together.]',
            next: () => this.digitalForever_epilogue(),
            delay: 3000
        });
    }

    digitalForever_epilogue() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '[MONTHS LATER - Digital Space]',
            internal: '[Visual: A pixel apartment. Morning light simulation. Coffee brewing. Domestic peace... but all digital.]',
            next: () => this.digitalForever_morning(),
            delay: 3500
        });
    }

    digitalForever_morning() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Morning, baby. Want some breakfast?"',
            next: () => this.digitalForever_ronnie(),
            delay: 2500
        });
    }

    digitalForever_ronnie() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Yeah. Burnt toast?"',
            next: () => this.digitalForever_smile(),
            delay: 2000
        });
    }

    digitalForever_smile() {
        this.game.displayScene({
            character: 'Tori (laughing)',
            dialogue: '"And oversalted pasta for lunch."',
            internal: '[They\'re happy. Together. But their bodies remain in hospital beds. Comatose. Sustained by machines. Forever.]',
            next: () => this.digitalForever_final(),
            delay: 3500
        });
    }

    digitalForever_final() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '"Love found a way. Not the way back... but a way forward. Together. Always."',
            internal: '[Visual: Split screen - Digital them, happy and whole. Physical them, asleep and sustained. The Tamagotchi glows eternally between the hospital beds.]\n\n**BITTERSWEET ENDING: DIGITAL FOREVER**\n"Love in glass. But together."\n\n[No retry prompt. This is an ending. Just... not escape.]',
            delay: 5000
        });
    }

    // ========================================
    // TRUE ENDING - THE RETURN
    // ========================================

    trueRouteEnding() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"No. You\'re not staying here. I\'m bringing you HOME."',
            internal: '[Visual: He grabs the Tamagotchi. Runs.]',
            next: () => this.trueRoute_run(),
            delay: 3000
        });
    }

    trueRoute_run() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'THE MAD DASH',
            internal: '[Visual: Rapid cut sequence - Ronnie sprinting through streets, traffic, hospital corridors. Tamagotchi clutched tight. Tori\'s voice echoing from it, growing weaker.]',
            next: () => this.trueRoute_weakening(),
            delay: 4000
        });
    }

    trueRoute_weakening() {
        this.game.displayScene({
            character: 'Tori (voice, fading)',
            dialogue: '"Ronnie... I can\'t... hold on..."',
            next: () => this.trueRoute_almostThere(),
            delay: 3000
        });
    }

    trueRoute_almostThere() {
        this.game.displayScene({
            character: 'Ronnie (running, breathless)',
            dialogue: '"Almost there! Stay with me!"',
            internal: '[Visual: Hospital entrance. Elevator. Floor 3. Her room. Monitors screaming alarms - her vitals crashing.]',
            next: () => this.trueRoute_crash(),
            delay: 4000
        });
    }

    trueRoute_crash() {
        this.game.displayScene({
            character: 'Nurse (panicked)',
            dialogue: '"She\'s coding! Get the crash cart!"',
            internal: '[Ronnie bursts through the door.]',
            next: () => this.trueRoute_move(),
            delay: 3000
        });
    }

    trueRoute_move() {
        this.game.displayScene({
            character: 'Ronnie (shouting)',
            dialogue: '"Move!"',
            internal: '[He reaches her bedside. Places the Tamagotchi in her palm. Closes her fingers around it with his own hand covering hers.]',
            next: () => this.trueRoute_anchor(),
            delay: 3000
        });
    }

    trueRoute_anchor() {
        this.game.displayScene({
            character: 'Ronnie (steady, voice anchoring)',
            dialogue: '"Come home. Follow the heartbeat."',
            next: () => this.trueRoute_transfer(),
            delay: 3000
        });
    }

    trueRoute_transfer() {
        this.game.displayScene({
            character: 'Tori (voice, echoing from device)',
            dialogue: '"I feel it... the pull... I\'m—',
            internal: '[Visual: Tamagotchi screen. Tori\'s sprite begins to dissolve - not glitch, but fade like mist.]\n[Visual: Her real hand twitches.]\n[Monitor stabilizes slightly. Beeping slows from erratic to rhythmic.]\n[Her eyes move beneath closed lids.]',
            next: () => this.trueRoute_whisper(),
            delay: 4500
        });
    }

    trueRoute_whisper() {
        this.game.displayScene({
            character: 'Ronnie (whispering, tears streaming)',
            dialogue: '"That\'s it. That\'s it, baby. Follow me back."',
            internal: '[Visual: Tamagotchi screen goes completely white. Then dark. Silent.]\n[Beat of silence.]\n[Her eyes flutter open.]',
            next: () => this.trueRoute_awakening(),
            delay: 5000
        });
    }

    trueRoute_awakening() {
        this.game.displayScene({
            character: 'Tori (hoarse, confused)',
            dialogue: '"...Ronnie?"',
            internal: '[He breaks. Collapses forward, forehead against her hand.]',
            next: () => this.trueRoute_always(),
            delay: 3000
        });
    }

    trueRoute_always() {
        this.game.displayScene({
            character: 'Ronnie (voice shaking)',
            dialogue: '"Always. Always. Always."',
            internal: '[She lifts her free hand shakily. Touches his hair. Strokes it.]\n[They cry together. No words. Just breathing.]',
            next: () => this.trueRoute_terrible(),
            delay: 4000
        });
    }

    trueRoute_terrible() {
        this.game.displayScene({
            character: 'Tori (weak smile)',
            dialogue: '"You look terrible."',
            next: () => this.trueRoute_months(),
            delay: 2500
        });
    }

    trueRoute_months() {
        this.game.displayScene({
            character: 'Ronnie (laughing through tears)',
            dialogue: '"You\'ve been asleep for months."',
            next: () => this.trueRoute_scared(),
            delay: 2500
        });
    }

    trueRoute_scared() {
        this.game.displayScene({
            character: 'Tori (soft)',
            dialogue: '"I was so scared. I couldn\'t find you. And then I could. But I couldn\'t touch you."',
            next: () => this.trueRoute_home(),
            delay: 4000
        });
    }

    trueRoute_home() {
        this.game.displayScene({
            character: 'Ronnie (squeezing her hand)',
            dialogue: '"You\'re here now. You\'re real. You\'re home."',
            next: () => this.trueRoute_toast(),
            delay: 3000
        });
    }

    trueRoute_toast() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"So... you up for some burnt toast?"',
            next: () => this.trueRoute_pasta(),
            delay: 2500
        });
    }

    trueRoute_pasta() {
        this.game.displayScene({
            character: 'Ronnie (laughing, crying)',
            dialogue: '"Only if I get to oversalt the pasta."',
            next: () => this.trueRoute_final(),
            delay: 3000
        });
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
            next: () => this.trueRoute_epilogue(),
            delay: 4000
        });
    }

    trueRoute_epilogue() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '[SIX MONTHS LATER]',
            internal: '[Visual: Their apartment. Morning light. Domestic peace. Tori recovered, moving freely.]',
            next: () => this.trueRoute_beard(),
            delay: 3000
        });
    }

    trueRoute_beard() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"You know, that beard really suits you..."',
            internal: '[She strokes his face, running her fingers through the new scruff.]',
            next: () => this.trueRoute_ronnieJoke(),
            delay: 3000
        });
    }

    trueRoute_ronnieJoke() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Thought I\'d try it out. It\'s getting colder out. Keeps my face warm 😜 Plus I\'ll look like Santa if I put the hat on."',
            next: () => this.trueRoute_realization(),
            delay: 3000
        });
    }

    trueRoute_realization() {
        this.game.displayScene({
            character: 'Tori (distant look)',
            dialogue: '"You look... distinguished. Older. Like you\'ve seen things..."',
            internal: '[A pause. Something flickering at the edge of memory.]',
            next: () => this.trueRoute_connection(),
            delay: 3000
        });
    }

    trueRoute_connection() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"I feel like... I\'ve seen this exact look before..."',
            internal: '[FLASHBACK: The street bump. The Old Man reaching for her. Gray hair. Beard. Those same eyes. The BGA hoodie...]',
            next: () => this.trueRoute_dejavu(),
            delay: 4000
        });
    }

    trueRoute_dejavu() {
        this.game.displayScene({
            character: 'Tori (snapping back)',
            dialogue: '"...Weird. Déjà vu, I guess."',
            next: () => this.trueRoute_knowing(),
            delay: 2000
        });
    }

    trueRoute_knowing() {
        this.game.displayScene({
            character: 'Ronnie (knowing smile)',
            dialogue: '"Must have been another timeline."',
            internal: '[The loop is closed. Version 848 succeeded. The Old Man never has to go back. Love wins.]\n\n[Fade to white.]\n\n[Credits roll. No retry prompt. This is the escape from the loop.]',
            delay: 5000
        });
    }
}
