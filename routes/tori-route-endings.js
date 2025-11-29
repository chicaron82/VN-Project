// ========================================
// TORI'S ROUTE - ENDINGS (V5 - CLEAN ARCHITECTURE)
// Three Paths Diverge
// SPRITES & BACKGROUNDS INTEGRATED
// FIXED: Endings now unlock pre-defined notes from collectibles
// ========================================

class ToriEndings {
    constructor(route) {
        this.route = route;
        this.game = route.game;
    }
    
    // ========================================
    // CRITICAL CHOICE & ENDING DETERMINATION
    // ========================================
    
    tori_endings_01_criticalchoice() {
        // Unlock ZR's Version 848 analysis
        this.route.unlockNote('zr3');

        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Everything shatters. Tori is fracturing. The Echoes watch. This is the moment.',
            background: 'assets/hospital.png',
            choices: [
                { text: '[Accept the upload - stay digital]', value: 'upload' },
                { text: '[Follow the heartbeat home]', value: 'heartbeat' },
                { text: '[Hold onto Ronnie - whatever it takes]', value: 'hold' }
            ],
            onChoice: (choice) => {
                if (choice === 'upload') {
                    this.route.addRoutePoints('bad', 3);
                    this.determineEnding();
                } else if (choice === 'heartbeat') {
                    this.route.addRoutePoints('true', 3);
                    this.determineEnding();
                } else {
                    this.route.addRoutePoints('digitalForever', 3);
                    this.determineEnding();
                }
            }
        }, 'tori_endings_01_criticalchoice');
    }

    determineEnding() {
        const ending = this.route.determineEnding();

        if (ending === 'bad') {
            this.tori_endings_02_badroute();
        } else if (ending === 'digitalForever') {
            this.tori_endings_05_digitalforever();
        } else {
            this.tori_endings_17_trueroute();
        }
    }

    // ========================================
    // BAD ROUTE ENDING
    // Upload Fails - Becomes an Echo
    // ========================================
    
    tori_endings_02_badroute() {
        // Unlock the pre-defined bad ending note
        this.route.unlockNote('bad_ending');

        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Upload fails. Tori fragments. Becomes another Echo in the void.',
            internal: '[Visual: Digital space. Four voices now. Echo 1, Echo 2, Despair... and Tori.]',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_endings_03_badroute_loop(),
            delay: 4000
        }, 'tori_endings_02_badroute');
    }

    tori_endings_03_badroute_loop() {
        this.game.displayScene({
            character: 'New Echo (Tori)',
            dialogue: '"He\'ll try again. He always tries again."',
            internal: '[The loop resets. Version 849. Another Tori wakes in the void...]',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_endings_04_badroute_retry(),
            delay: 5000
        }, 'tori_endings_03_badroute_loop');
    }

    tori_endings_04_badroute_retry() {
        // Unlock Z's UV7 crew reveal note (available on ANY ending completion)
        this.route.unlockNote('z9');

        // UNLOCK SKIP FEATURE (first ending completion)
        if (!this.game.skipUnlocked) {
            this.game.unlockSkipFeature();
        }

        this.game.displayScene({
            character: 'System',
            dialogue: 'GAME OVER\n\n"Do you wish to try again?"',
            background: 'assets/digitalSpace.png',
            choices: [
                { text: '[RETRY]', value: 'retry' },
                { text: '[END]', value: 'end' }
            ],
            onChoice: (choice) => {
                if (choice === 'retry') {
                    // Increment version
                    this.game.incrementVersion();

                    // ZEERAH'S FIX: Use proper loop init screen like Ronnie's route
                    this.game.showLoopInit(() => {
                        // Reset tether to full
                        this.route.tetherSystem.reset();
                        this.route.act1.start();
                    });
                } else {
                    // Return to menu at current version
                    this.game.returnToMainMenu();
                }
            }
        }, 'tori_endings_04_badroute_retry');
    }

    // ========================================
    // DIGITAL FOREVER ENDING
    // Both Digital - Together Eternally
    // ========================================
    
    tori_endings_05_digitalforever() {
        // Unlock the pre-defined digital forever ending note
        this.route.unlockNote('digital_ending');

        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Both crash. Both transfer. Digital space. Two souls. Forever.',
            internal: '[Visual: White void. Ronnie and Tori as digital sprites. Together. Eternal.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_endings_06_digitalforever_together(),
            delay: 4000
        }, 'tori_endings_05_digitalforever');
    }

    tori_endings_06_digitalforever_together() {
        this.game.displayScene({
            character: 'Tori (digital)',
            dialogue: '"We\'re together. Isn\'t this what we wanted?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_endings_07_digitalforever_ronnie(),
            delay: 3000
        }, 'tori_endings_06_digitalforever_together');
    }

    tori_endings_07_digitalforever_ronnie() {
        this.game.displayScene({
            character: 'Ronnie (digital)',
            dialogue: '"Forever. No pain. No time. Just us."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_endings_08_digitalforever_torinotices(),
            delay: 3000
        }, 'tori_endings_07_digitalforever_ronnie');
    }
    
    tori_endings_08_digitalforever_torinotices() {
        this.game.displayScene({
            character: 'Tori (digital)',
            dialogue: '"You\'re still wearing the TLC hoodie. Even here."',
            internal: '[She smiles softly, touching the digital fabric.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_endings_09_digitalforever_tlcreveal(),
            delay: 3000
        }, 'tori_endings_08_digitalforever_torinotices');
    }
    
    tori_endings_09_digitalforever_tlcreveal() {
        this.game.displayScene({
            character: 'Tori (digital)',
            dialogue: '"\'TLC\' - Tender Loving Care. That\'s my Ronnie."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_endings_10_digitalforever_ronniecorrects(),
            delay: 3000
        }, 'tori_endings_09_digitalforever_tlcreveal');
    }
    
    tori_endings_10_digitalforever_ronniecorrects() {
        this.game.displayScene({
            character: 'Ronnie (digital)',
            dialogue: '"Oh that\'s not what that stands for."',
            internal: '[He grins.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_endings_11_digitalforever_actualmeaning(),
            delay: 2500
        }, 'tori_endings_10_digitalforever_ronniecorrects');
    }
    
    tori_endings_11_digitalforever_actualmeaning() {
        this.game.displayScene({
            character: 'Ronnie (digital)',
            dialogue: '"Tori Loves Chicharon."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_endings_12_digitalforever_echoesappear(),
            delay: 2500
        }, 'tori_endings_11_digitalforever_actualmeaning');
    }
    
    tori_endings_12_digitalforever_echoesappear() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"Oh that\'s YOUR Ronnie, huh?"',
            internal: '[The Echoes materialize, grinning.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_endings_13_digitalforever_echo2(),
            delay: 2500
        }, 'tori_endings_12_digitalforever_echoesappear');
    }
    
    tori_endings_13_digitalforever_echo2() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"Girl, he\'s cute!"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_endings_14_digitalforever_despairteases(),
            delay: 2000
        }, 'tori_endings_13_digitalforever_echo2');
    }
    
    tori_endings_14_digitalforever_despairteases() {
        this.game.displayScene({
            character: 'Despair',
            dialogue: '"Tori Loves Chicharon?! OMG adorable."',
            internal: '[Even Despair can\'t help but smile.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_endings_15_digitalforever_echoes(),
            delay: 3000
        }, 'tori_endings_14_digitalforever_despairteases');
    }

    tori_endings_15_digitalforever_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "They made it..."\nEcho 2: "Together at least."\nDespair: "...It\'s beautiful. And hollow. But beautiful."',
            internal: '[Fade to white. Digital Forever - Love preserved in code.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_endings_16_digitalforever_choice(),
            delay: 5000
        }, 'tori_endings_15_digitalforever_echoes');
    }
    
    tori_endings_16_digitalforever_choice() {
        this.game.displayScene({
            character: 'System',
            dialogue: `VERSION ${this.game.loopVersion}\n\n"Together forever in the digital space.\nDo you accept this ending?"`,
            background: 'assets/digitalSpace.png',
            choices: [
                { text: '[RETRY - Seek the true path]', value: 'retry' },
                { text: '[ACCEPT THIS - Digital love is enough]', value: 'accept' }
            ],
            onChoice: (choice) => {
                if (choice === 'retry') {
                    // Increment version
                    this.game.incrementVersion();

                    // ZEERAH'S FIX: Use proper loop init screen like Ronnie's route
                    this.game.showLoopInit(() => {
                        // Reset tether to full
                        this.route.tetherSystem.reset();
                        this.route.act1.start();
                    });
                } else {
                    // Unlock Z's UV7 crew reveal note (available on ANY ending completion)
                    this.route.unlockNote('z9');

                    // UNLOCK SKIP FEATURE (first ending completion)
                    if (!this.game.skipUnlocked) {
                        this.game.unlockSkipFeature();
                    }

                    // Accept ending - lock version
                    this.game.acceptEnding();
                    // Transition to shared epilogue
                    const epilogue = new Epilogue(this.game);
                    epilogue.start();
                }
            }
        }, 'tori_endings_16_digitalforever_choice');
    }

    // ========================================
    // TRUE ROUTE ENDING
    // Body Anchor Success - She Comes Home
    // ========================================
    
    tori_endings_17_trueroute() {
        // Unlock the pre-defined true ending note
        this.route.unlockNote('true_ending');

        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The heartbeat calls. The bridge holds. Transfer begins.',
            internal: '[Visual: Tori\'s digital form dissolving. Following the warmth home.]',
            background: 'assets/hospital.png',
            next: () => this.tori_endings_18_trueroute_transfer(),
            delay: 4000
        }, 'tori_endings_17_trueroute');
    }

    tori_endings_18_trueroute_transfer() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"I feel it... the pull... I\'m going home..."',
            background: 'assets/hospital.png',
            next: () => this.tori_endings_19_trueroute_echoes(),
            delay: 3000
        }, 'tori_endings_18_trueroute_transfer');
    }

    tori_endings_19_trueroute_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "Go. Go!"\nEcho 2: "You did it. You actually did it."\nDespair: "...Tell him... tell him we\'re proud."',
            background: 'assets/digitalSpace.png',
            sprites: {
                right: 'echoes'
            },
            next: () => this.tori_endings_20_trueroute_merge(),
            delay: 4000
        }, 'tori_endings_19_trueroute_echoes');
    }
    
    tori_endings_20_trueroute_merge() {
        // Display echoes for merge animation
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Three become one.',
            background: 'assets/digitalSpace.png',
            sprites: {
                right: 'echoes'
            },
            next: () => {
                // Trigger merge animation
                this.game.triggerEchoMerge(() => {
                    this.tori_endings_21_trueroute_awakening();
                });
            },
            delay: 2000
        }, 'tori_endings_20_trueroute_merge');
    }

    tori_endings_21_trueroute_awakening() {
        this.game.displayScene({
            character: 'Tori (external, whisper)',
            dialogue: '"...Ronnie?"',
            internal: '[Visual: Hospital room. Her eyes flutter open. Real eyes. Real body. Real breath.]',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_endings_22_trueroute_ronnie(),
            delay: 4000,
            style: 'critical'
        }, 'tori_endings_21_trueroute_awakening');
    }

    tori_endings_22_trueroute_ronnie() {
        this.game.displayScene({
            character: 'Ronnie (crying, laughing)',
            dialogue: '"Tori! Oh god, Tori!"',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_endings_23_trueroute_always(),
            delay: 3000
        }, 'tori_endings_22_trueroute_ronnie');
    }

    tori_endings_23_trueroute_always() {
        // Unlock Z's UV7 crew reveal note (available on ANY ending completion)
        this.route.unlockNote('z9');

        // Unlock Z's final philosophical note (TRUE ENDING ONLY)
        this.route.unlockNote('z10');

        // UNLOCK SKIP FEATURE (first ending completion)
        if (!this.game.skipUnlocked) {
            this.game.unlockSkipFeature();
        }

        this.game.displayScene({
            character: 'Tori (weak smile)',
            dialogue: '"Always. Always. Always."',
            internal: '[Her hand squeezes his. Real. Warm. Alive. The Echoes fade into peace.]',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => {
                // Break the loop - this timeline succeeded!
                this.game.breakLoop();
                // Transition to shared epilogue
                const epilogue = new Epilogue(this.game);
                epilogue.start();
            },
            delay: 4000
        }, 'tori_endings_23_trueroute_always');
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToriEndings;
}
