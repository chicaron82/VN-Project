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
            background: '../assets/hospital.png',
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

        // DIZEE POLISH: Check ending achievements
        if (window.checkEndingAchievements) {
            window.checkEndingAchievements('bad_ending');
        }

        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Upload fails. Tori fragments. Becomes another Echo in the void.',
            internal: '[Visual: Digital space. Four voices now. Echo 1, Echo 2, Despair... and Tori.]',
            background: '../assets/digitalSpace.png',
            next: () => this.badRoute_loop(),
            delay: 4000
        }, 'badRoute');
    }

    badRoute_loop() {
        this.game.displayScene({
            character: 'New Echo (Tori)',
            dialogue: '"He\'ll try again. He always tries again."', internal: '[The loop resets. Version 849. Another Tori wakes in the void...]',
            background: '../assets/digitalSpace.png',
            next: () => this.badRoute_retry(),
            delay: 5000
        }, 'badRoute_loop');
    }

    badRoute_retry() {
        // Unlock Z's UV7 crew reveal note (available on ANY ending completion)
        this.route.unlockNote('z9');

        // UNLOCK SKIP FEATURE (first ending completion)
        if (!this.game.skipUnlocked) {
            this.game.unlockSkipFeature();
        }

        // DIZEE FIX: Stop tether decay before ending
        this.route.tetherSystem.stopDecay();

        // Unlock skip prologue for future playthroughs
        if (!this.game.skipPrologueUnlocked) {
            this.game.skipPrologueUnlocked = true;
            localStorage.setItem('skipPrologueUnlocked', 'true');
            console.log('✅ Skip Prologue unlocked! Available on next START STORY.');

            // ZEERAH: Mark feature as unread for notification dot
            if (this.game.standaloneNotesViewer) {
                this.game.standaloneNotesViewer.readStatus['feature_skipPrologue'] = false;
                this.game.standaloneNotesViewer.saveReadStatus();
                this.game.standaloneNotesViewer.updateNotificationDots();
            }
        }

        // 🔥 NOTIFY GATEWAY
        if (window.vnBridge) {
            window.vnBridge.notifyEnding('bad');
        }

        // Show ending dialog (three-option system)
        this.game.showEndingDialog('bad');
    }

    // ========================================
    // DIGITAL FOREVER ENDING
    // Both Digital - Together Eternally
    // ========================================

    digitalForever() {
        // Unlock the pre-defined digital forever ending note
        this.route.unlockNote('digital_ending');

        // DIZEE POLISH: Check ending achievements
        if (window.checkEndingAchievements) {
            window.checkEndingAchievements('digital_ending');
        }

        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Both crash. Both transfer. Digital space. Two souls. Forever.',
            internal: '[Visual: White void. Ronnie and Tori as digital sprites. Together. Eternal.]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-tori.webp',
                right: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.digitalForever_together(),
            delay: 4000
        }, 'digitalForever');
    }

    digitalForever_together() {
        this.game.displayScene({
            character: 'Tori (digital)',
            dialogue: '"We\'re together. Isn\'t this what we wanted?"',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-tori.webp',
                right: '../assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.digitalForever_ronnie(),
            delay: 3000
        }, 'digitalForever_together');
    }

    digitalForever_ronnie() {
        this.game.displayScene({
            character: 'Ronnie (digital)',
            dialogue: '"Forever. No pain. No time. Just us."',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-tori.webp',
                right: '../assets/full-sprite-ronnie.webp',
                highlight: 'right'
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
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-tori.webp',
                right: '../assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.digitalForever_tlcReveal(),
            delay: 3000
        }, 'digitalForever_toriNotices');
    }

    digitalForever_tlcReveal() {
        this.game.displayScene({
            character: 'Tori (digital)',
            dialogue: '"\'TLC\' - Tender Loving Care. That\'s my Ronnie."',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-tori.webp',
                right: '../assets/full-sprite-ronnie.webp',
                highlight: 'left'
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
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-tori.webp',
                right: '../assets/full-sprite-ronnie.webp',
                highlight: 'right'
            },
            next: () => this.digitalForever_actualMeaning(),
            delay: 2500
        }, 'digitalForever_ronnieCorrects');
    }

    digitalForever_actualMeaning() {
        this.game.displayScene({
            character: 'Ronnie (digital)',
            dialogue: '"Tori Loves Chicharon."',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-tori.webp',
                right: '../assets/full-sprite-ronnie.webp',
                highlight: 'right'
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
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-tori.webp',
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
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-tori.webp',
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
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-tori.webp',
                right: 'echoes'
            },
            next: () => this.digitalForever_echoes(),
            delay: 3000
        }, 'digitalForever_despairTeases');
    }

    digitalForever_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "They made it..."\nEcho 2: "Together at least."\nDespair: "...It\'s beautiful. And hollow. But beautiful."', internal: '[Fade to white. Digital Forever - Love preserved in code.]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-tori.webp',
                right: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.digitalForever_choice(),
            delay: 5000
        }, 'digitalForever_echoes');
    }

    digitalForever_choice() {
        // Unlock Z's UV7 crew reveal note (available on ANY ending completion)
        this.route.unlockNote('z9');

        // UNLOCK SKIP FEATURE (first ending completion)
        if (!this.game.skipUnlocked) {
            this.game.unlockSkipFeature();
        }

        // Unlock skip prologue for future playthroughs
        if (!this.game.skipPrologueUnlocked) {
            this.game.skipPrologueUnlocked = true;
            localStorage.setItem('skipPrologueUnlocked', 'true');
            console.log('✅ Skip Prologue unlocked! Available on next START STORY.');

            // ZEERAH: Mark feature as unread for notification dot
            if (this.game.standaloneNotesViewer) {
                this.game.standaloneNotesViewer.readStatus['feature_skipPrologue'] = false;
                this.game.standaloneNotesViewer.saveReadStatus();
                this.game.standaloneNotesViewer.updateNotificationDots();
            }
        }

        // INSANE MODE: Unlock if completed on Intense difficulty
        if (this.game.settingsManager.settings.tetherDifficulty === 'intense') {
            const alreadyUnlocked = localStorage.getItem('insaneModeUnlocked') === 'true';
            if (!alreadyUnlocked) {
                localStorage.setItem('insaneModeUnlocked', 'true');
                console.log('💀 INSANE MODE UNLOCKED! Check Settings → Tori\'s Route Difficulty');
                // Show unlock notification
                this.game.showUnlockOverlay('💀 INSANE MODE UNLOCKED', 'Despair awaits in the settings menu.\n\nOnly the most dedicated may enter.', 'unlock');
            }
        }

        // DIZEE FIX: Stop tether decay before ending
        this.route.tetherSystem.stopDecay();

        // Accept ending - lock version
        this.game.acceptEnding();

        // DIZEE FIX: Digital forever should show credits, not epilogue
        // Epilogue is only for true ending
        this.route.collectiblesManager.unlockNote('digital_forever');

        // 🔥 NOTIFY GATEWAY
        if (window.vnBridge) {
            window.vnBridge.notifyEnding('digitalForever');
        }

        // Show ending dialog (three-option system)
        this.game.showEndingDialog('digitalForever');
    }

    // ========================================
    // TRUE ROUTE ENDING
    // Body Anchor Success - She Comes Home
    // ========================================

    trueRoute() {
        // Unlock the pre-defined true ending note
        this.route.unlockNote('true_ending');

        // DIZEE POLISH: Check ending achievements
        if (window.checkEndingAchievements) {
            window.checkEndingAchievements('true_ending');
        }

        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The heartbeat calls. The bridge holds. Transfer begins.',
            internal: '[Visual: Tori\'s digital form dissolving. Following the warmth home.]',
            background: '../assets/hospital.png',
            next: () => this.trueRoute_transfer(),
            delay: 4000
        }, 'trueRoute');
    }

    async trueRoute_transfer() {
        // Cinematic overlay for the soul transfer - Tori's perspective
        await this.game.loadingOverlay.playUploadSequence({
            title: 'RETURNING HOME',
            subtitle: 'Following the heartbeat…',
            durationMs: 5000,
            skippable: true,
            statusLines: [
                'Releasing vessel…',
                'Dissolving digital form…',
                'Following the warmth…',
                'Anchoring to body…',
                'Welcome home.'
            ]
        });

        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"I feel it... the pull... I\'m going home..."',
            background: '../assets/hospital.png',
            next: () => this.trueRoute_echoes(),
            delay: 3000
        }, 'trueRoute_transfer');
    }

    trueRoute_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "Go. Go!"\nEcho 2: "You did it. You actually did it."\nDespair: "...Tell him... tell him we\'re proud."', background: '../assets/digitalSpace.png',
            sprites: {
                right: 'echoes'
            },
            next: () => this.trueRoute_merge(),
            delay: 4000
        }, 'trueRoute_echoes');
    }

    trueRoute_merge() {
        // Display echoes for merge animation
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Three become one.',
            background: '../assets/digitalSpace.png',
            sprites: {
                right: 'echoes'
            },
            next: () => {
                // Trigger merge animation
                this.game.triggerEchoMerge(() => {
                    this.trueRoute_awakening();
                });
            },
            delay: 2000
        }, 'trueRoute_merge');
    }

    trueRoute_awakening() {
        // DIZEE: Clear digital sprite effect - Tori is back in her body, no longer glitched
        if (this.game.clearDigitalSpriteEffect) {
            this.game.clearDigitalSpriteEffect('left');
        }

        this.game.displayScene({
            character: 'Tori (external, whisper)',
            dialogue: '"...Ronnie?"',
            internal: '[Visual: Hospital room. Her eyes flutter open. Real eyes. Real body. Real breath.]',
            background: '../assets/hospital.png',
            sprites: {
                right: '../assets/full-sprite-ronnie.webp'
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
            background: '../assets/hospital.png',
            sprites: {
                right: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.trueRoute_always(),
            delay: 3000
        }, 'trueRoute_ronnie');
    }

    trueRoute_always() {
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
            background: '../assets/hospital.png',
            sprites: {
                right: '../assets/full-sprite-ronnie.webp'
            },
            next: () => {
                // Unlock skip prologue for future playthroughs
                if (!this.game.skipPrologueUnlocked) {
                    this.game.skipPrologueUnlocked = true;
                    localStorage.setItem('skipPrologueUnlocked', 'true');
                    console.log('✅ Skip Prologue unlocked! Available on next START STORY.');
                }

                // INSANE MODE: Unlock if completed on Intense difficulty
                if (this.game.settingsManager.settings.tetherDifficulty === 'intense') {
                    const alreadyUnlocked = localStorage.getItem('insaneModeUnlocked') === 'true';
                    if (!alreadyUnlocked) {
                        localStorage.setItem('insaneModeUnlocked', 'true');
                        console.log('💀 INSANE MODE UNLOCKED! Check Settings → Tori\'s Route Difficulty');
                        // Show unlock notification
                        this.game.showUnlockOverlay('💀 INSANE MODE UNLOCKED', 'Despair awaits in the settings menu.\n\nOnly the most dedicated may enter.', 'unlock');

                        // ZEERAH: Mark feature as unread for notification dot
                        if (this.game.standaloneNotesViewer) {
                            this.game.standaloneNotesViewer.readStatus['feature_insaneDifficulty'] = false;
                            this.game.standaloneNotesViewer.saveReadStatus();
                            this.game.standaloneNotesViewer.updateNotificationDots();
                        }
                    }
                }

                // DIZEE FIX: Stop tether decay before ending
                this.route.tetherSystem.stopDecay();

                // Break the loop - this timeline succeeded!
                this.game.breakLoop();

                // 🔥 NOTIFY GATEWAY
                if (window.vnBridge) {
                    window.vnBridge.notifyEnding('true');
                }

                // Transition to shared epilogue
                const epilogue = new Epilogue(this.game, 'tori');
                epilogue.start();
            },
            delay: 4000
        }, 'trueRoute_always');
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.ToriEndings = ToriEndings;
}

// ES Module export
export { ToriEndings };
