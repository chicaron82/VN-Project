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
    
    criticalChoice() {
        // Unlock ZR's Version 848 analysis
        this.route.unlockNote('zr3');
        
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Everything shatters. Tori is fracturing. The Echoes watch. This is the moment.',
            background: 'hospital.png',
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
        }, 'criticalChoice');
    }

    determineEnding() {
        const ending = this.route.determineEnding();
        
        if (ending === 'bad') {
            this.badRoute();
        } else if (ending === 'digitalForever') {
            this.digitalForever();
        } else {
            this.trueRoute();
        }
    }

    // ========================================
    // BAD ROUTE ENDING
    // Upload Fails - Becomes an Echo
    // ========================================
    
    badRoute() {
        // Unlock the pre-defined bad ending note
        this.route.unlockNote('bad_ending');
        
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Upload fails. Tori fragments. Becomes another Echo in the void.',
            internal: '[Visual: Digital space. Four voices now. Echo 1, Echo 2, Despair... and Tori.]',
            background: 'digitalSpace.png',
            next: () => this.badRoute_loop(),
            delay: 4000
        }, 'badRoute');
    }

    badRoute_loop() {
        this.game.displayScene({
            character: 'New Echo (Tori)',
            dialogue: '"He\'ll try again. He always tries again."',            internal: '[The loop resets. Version 849. Another Tori wakes in the void...]',
            background: 'digitalSpace.png',
            next: () => this.badRoute_retry(),
            delay: 5000
        }, 'badRoute_loop');
    }

    badRoute_retry() {
        this.game.displayScene({
            character: 'System',
            dialogue: 'GAME OVER\n\n"Do you wish to try again?"',
            background: 'digitalSpace.png',
            choices: [
                { text: '[RETRY]', value: 'retry' },
                { text: '[END]', value: 'end' }
            ],
            onChoice: (choice) => {
                if (choice === 'retry') {
                    // Increment version
                    const newVersion = this.game.incrementVersion();
                    
                    // Show dramatic version increment screen
                    this.game.displayScene({
                        character: 'System',
                        dialogue: `INITIALIZING ATTEMPT #${newVersion}...`,
                        internal: '[The loop continues. Another timeline. Another chance.]',
                        background: 'digitalSpace.png',
                        style: 'critical',
                        next: () => {
                            // Reset tether to full
                            this.route.tetherSystem.reset();
                            this.route.act1.start();
                        },
                        delay: 3000
                    }, 'version_increment_screen');
                } else {
                    // Return to menu at current version
                    this.game.returnToMainMenu();
                }
            }
        }, 'badRoute_retry');
    }

    // ========================================
    // DIGITAL FOREVER ENDING
    // Both Digital - Together Eternally
    // ========================================
    
    digitalForever() {
        // Unlock the pre-defined digital forever ending note
        this.route.unlockNote('digital_ending');
        
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Both crash. Both transfer. Digital space. Two souls. Forever.',
            internal: '[Visual: White void. Ronnie and Tori as digital sprites. Together. Eternal.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.digitalForever_together(),
            delay: 4000
        }, 'digitalForever');
    }

    digitalForever_together() {
        this.game.displayScene({
            character: 'Tori (digital)',
            dialogue: '"We\'re together. Isn\'t this what we wanted?"',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.digitalForever_ronnie(),
            delay: 3000
        }, 'digitalForever_together');
    }

    digitalForever_ronnie() {
        this.game.displayScene({
            character: 'Ronnie (digital)',
            dialogue: '"Forever. No pain. No time. Just us."',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.digitalForever_toriNotices(),
            delay: 3000
        }, 'digitalForever_ronnie');
    }
    
    digitalForever_toriNotices() {
        this.game.displayScene({
            character: 'Tori (digital)',
            dialogue: '"You\'re still wearing the TLC hoodie. Even here."',
            internal: '[She smiles softly, touching the digital fabric.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.digitalForever_tlcReveal(),
            delay: 3000
        }, 'digitalForever_toriNotices');
    }
    
    digitalForever_tlcReveal() {
        this.game.displayScene({
            character: 'Tori (digital)',
            dialogue: '"\'TLC\' - Tender Loving Care. That\'s my Ronnie."',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.digitalForever_ronnieCorrects(),
            delay: 3000
        }, 'digitalForever_tlcReveal');
    }
    
    digitalForever_ronnieCorrects() {
        this.game.displayScene({
            character: 'Ronnie (digital)',
            dialogue: '"Oh that\'s not what that stands for."',
            internal: '[He grins.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.digitalForever_actualMeaning(),
            delay: 2500
        }, 'digitalForever_ronnieCorrects');
    }
    
    digitalForever_actualMeaning() {
        this.game.displayScene({
            character: 'Ronnie (digital)',
            dialogue: '"Tori Loves Chicharon."',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.digitalForever_echoesAppear(),
            delay: 2500
        }, 'digitalForever_actualMeaning');
    }
    
    digitalForever_echoesAppear() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"Oh that\'s YOUR Ronnie, huh?"',
            internal: '[The Echoes materialize, grinning.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.digitalForever_echo2(),
            delay: 2500
        }, 'digitalForever_echoesAppear');
    }
    
    digitalForever_echo2() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"Girl, he\'s cute!"',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.digitalForever_despairTeases(),
            delay: 2000
        }, 'digitalForever_echo2');
    }
    
    digitalForever_despairTeases() {
        this.game.displayScene({
            character: 'Despair',
            dialogue: '"Tori Loves Chicharon?! OMG adorable."',
            internal: '[Even Despair can\'t help but smile.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.digitalForever_echoes(),
            delay: 3000
        }, 'digitalForever_despairTeases');
    }

    digitalForever_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "They made it..."\nEcho 2: "Together at least."\nDespair: "...It\'s beautiful. And hollow. But beautiful."',            internal: '[Fade to white. Digital Forever - Love preserved in code.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.digitalForever_choice(),
            delay: 5000
        }, 'digitalForever_echoes');
    }
    
    digitalForever_choice() {
        this.game.displayScene({
            character: 'System',
            dialogue: `VERSION ${this.game.loopVersion}\n\n"Together forever in the digital space.\nDo you accept this ending?"`,
            background: 'digitalSpace.png',
            choices: [
                { text: '[RETRY - Seek the true path]', value: 'retry' },
                { text: '[ACCEPT THIS - Digital love is enough]', value: 'accept' }
            ],
            onChoice: (choice) => {
                if (choice === 'retry') {
                    // Increment version
                    const newVersion = this.game.incrementVersion();
                    
                    // Show dramatic version increment screen
                    this.game.displayScene({
                        character: 'System',
                        dialogue: `INITIALIZING ATTEMPT #${newVersion}...`,
                        internal: '[Digital love wasn\'t enough. He goes back. Again.]',
                        background: 'digitalSpace.png',
                        style: 'critical',
                        next: () => {
                            // Reset tether to full
                            this.route.tetherSystem.reset();
                            this.route.act1.start();
                        },
                        delay: 3000
                    }, 'version_increment_screen');
                } else {
                    // Accept ending - lock version
                    this.game.acceptEnding();
                    // Transition to shared epilogue
                    const epilogue = new Epilogue(this.game);
                    epilogue.start();
                }
            }
        }, 'digitalForever_choice');
    }

    // ========================================
    // TRUE ROUTE ENDING
    // Body Anchor Success - She Comes Home
    // ========================================
    
    trueRoute() {
        // Unlock the pre-defined true ending note
        this.route.unlockNote('true_ending');
        
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The heartbeat calls. The bridge holds. Transfer begins.',
            internal: '[Visual: Tori\'s digital form dissolving. Following the warmth home.]',
            background: 'hospital.png',
            next: () => this.trueRoute_transfer(),
            delay: 4000
        }, 'trueRoute');
    }

    trueRoute_transfer() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"I feel it... the pull... I\'m going home..."',
            background: 'hospital.png',
            next: () => this.trueRoute_echoes(),
            delay: 3000
        }, 'trueRoute_transfer');
    }

    trueRoute_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "Go. Go!"\nEcho 2: "You did it. You actually did it."\nDespair: "...Tell him... tell him we\'re proud."',            background: 'digitalSpace.png',
            next: () => this.trueRoute_awakening(),
            delay: 4000
        }, 'trueRoute_echoes');
    }

    trueRoute_awakening() {
        this.game.displayScene({
            character: 'Tori (external, whisper)',
            dialogue: '"...Ronnie?"',
            internal: '[Visual: Hospital room. Her eyes flutter open. Real eyes. Real body. Real breath.]',
            background: 'hospital.png',
            sprites: {
                left: 'ronnie-sprite.png'
            },
            next: () => this.trueRoute_ronnie(),
            delay: 4000,
            style: 'critical'
        }, 'trueRoute_awakening');
    }

    trueRoute_ronnie() {
        this.game.displayScene({
            character: 'Ronnie (crying, laughing)',
            dialogue: '"Tori! Oh god, Tori!"',
            background: 'hospital.png',
            sprites: {
                left: 'ronnie-sprite.png'
            },
            next: () => this.trueRoute_always(),
            delay: 3000
        }, 'trueRoute_ronnie');
    }

    trueRoute_always() {
        this.game.displayScene({
            character: 'Tori (weak smile)',
            dialogue: '"Always. Always. Always."',
            internal: '[Her hand squeezes his. Real. Warm. Alive. The Echoes fade into peace.]',
            background: 'hospital.png',
            sprites: {
                left: 'ronnie-sprite.png'
            },
            next: () => {
                // Break the loop - this timeline succeeded!
                this.game.breakLoop();
                // Transition to shared epilogue
                const epilogue = new Epilogue(this.game);
                epilogue.start();
            },
            delay: 4000
        }, 'trueRoute_always');
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToriEndings;
}
