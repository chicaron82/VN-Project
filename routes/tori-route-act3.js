// ========================================
// TORI'S ROUTE - ACT 3 (V4 - VISUAL INTEGRATION)
// Memory Corruption & Identity Collapse (Tori's POV)
// SPRITES & BACKGROUNDS INTEGRATED
// ========================================

class ToriAct3 {
    constructor(route) {
        this.route = route;
        this.game = route.game;
    }

    start() {
        // Echo growth: Act 3 - Balance achieved (all equal height)
        this.game.setEchoGrowthStage('act3');

        this.beat2();
    }

    // ========================================
    // BEAT 2: FRACTURE IN MEMORY
    // The Pasta Argument Plays Wrong
    // ========================================

    beat2() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Pixel kitchen. Cooking memory. But something\'s... off.',
            internal: '[Visual: The same scene from Act 2. But corrupted. Colors bleeding.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat2_argument(),
            delay: 3000
        }, 'beat2');
    }

    beat2_argument() {
        this.game.displayScene({
            character: 'Ronnie (sprite)',
            dialogue: '"You burned the garlic bread again."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'right'
            },
            next: () => this.beat2_toriResponse(),
            delay: 2500
        }, 'beat2_argument');
    }

    beat2_toriResponse() {
        this.game.displayScene({
            character: 'Tori (sprite, voice not hers)',
            dialogue: '"I hate you."',
            internal: '[NO. That\'s not what I said. I said "shut up" as a JOKE.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat2_horror(),
            delay: 3000,
            style: 'critical'
        }, 'beat2_toriResponse');
    }

    beat2_horror() {
        this.game.displayScene({
            character: 'Tori (internal, panicking)',
            dialogue: '"The memory is WRONG. That\'s not how it happened. Why is it playing wrong?!"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat2_echoes(),
            delay: 3000
        }, 'beat2_horror');
    }

    beat2_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 2: "Memory corruption."\nEcho 1: "The system is rewriting her."\nDespair: "Soon you won\'t remember what was real and what the code invented."', background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat2_ronnieNotice(),
            delay: 4000
        }, 'beat2_echoes');
    }

    beat2_ronnieNotice() {
        this.game.displayScene({
            character: 'Ronnie (concerned)',
            dialogue: '"Tori? You okay? You just... froze."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'right'
            },
            next: () => this.beat2_choice(),
            delay: 2500
        }, 'beat2_ronnieNotice');
    }

    beat2_choice() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Do I tell him the memory played wrong? Or pretend it\'s fine?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            choices: [
                { text: '[Tell him: "The memory was corrupted"]', value: 'truth' },
                { text: '[Lie: "I\'m fine, just tired"]', value: 'lie' },
                { text: '[Deflect: Change the subject]', value: 'deflect' }
            ],
            onChoice: (choice) => {
                if (choice === 'truth') {
                    this.route.addRoutePoints('true', 1);
                    this.beat2_truth();
                } else if (choice === 'lie') {
                    this.route.addRoutePoints('digitalForever', 1);
                    this.beat2_lie();
                } else {
                    this.route.addRoutePoints('bad', 1);
                    this.beat2_deflect();
                }
            }
        }, 'beat2_choice');
    }

    beat2_truth() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"That memory... it didn\'t play right. The words were wrong."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat3(),
            delay: 3000
        }, 'beat2_truth');
    }

    beat2_lie() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"I\'m fine. Just a glitch. Keep going."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat3(),
            delay: 3000
        }, 'beat2_lie');
    }

    beat2_deflect() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"Let\'s do something else. Anything else."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat3(),
            delay: 3000
        }, 'beat2_deflect');
    }

    // ========================================
    // BEAT 3: SYSTEM MESSAGES INTRUDE
    // The Fourth Wall Shatters
    // ========================================

    beat3() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Text boxes appear. In her vision. Overlaying everything.',
            internal: '[Visual: System UI elements appearing where they shouldn\'t. Debug console bleeding through.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat3_firstBox(),
            delay: 3000
        }, 'beat3');
    }

    beat3_firstBox() {
        this.game.displayScene({
            character: 'System',
            dialogue: '[Battery: 15%]',
            internal: '[She SEES it. Not as UI. As part of her reality.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat3_toriReact(),
            delay: 2000,
            style: 'critical'
        }, 'beat3_firstBox');
    }

    beat3_toriReact() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"What is that? Why am I seeing system messages?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat3_moreBoxes(),
            delay: 2500
        }, 'beat3_toriReact');
    }

    beat3_moreBoxes() {
        this.game.displayScene({
            character: 'System',
            dialogue: '[Warning: Fragmentation detected]\n[Memory corruption: 67%]\n[Connection unstable]',
            internal: '[The boxes multiply. Fill her vision. She can barely see Ronnie anymore.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat3_horror(),
            delay: 3000
        }, 'beat3_moreBoxes');
    }

    beat3_horror() {
        this.game.displayScene({
            character: 'Tori (internal, breaking)',
            dialogue: '"I\'m seeing the backend. The debug console. Because I\'m not separate from the system. I AM the system."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat3_echoes(),
            delay: 3500,
            style: 'critical'
        }, 'beat3_horror');
    }

    beat3_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "Now she understands."\nEcho 2: "She\'s not trapped IN code."\nDespair: "She IS code. And code doesn\'t have a soul to save."', background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat3_truthBox(),
            delay: 4000
        }, 'beat3_echoes');
    }

    beat3_truthBox() {
        this.game.displayScene({
            character: 'System',
            dialogue: '[You can\'t upload a soul.]',
            internal: '[That\'s not a system message. That\'s a TRUTH. Hard-coded. A rule.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat3_choice(),
            delay: 3000,
            style: 'critical'
        }, 'beat3_truthBox');
    }

    beat3_choice() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Do I fight this? Or accept what I am?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            choices: [
                { text: '[Fight: "I\'m MORE than code"]', value: 'fight' },
                { text: '[Accept: "Maybe I am just data"]', value: 'accept' },
                { text: '[Question: "What IS a soul?"]', value: 'question' }
            ],
            onChoice: (choice) => {
                if (choice === 'fight') {
                    this.route.addRoutePoints('true', 1);
                    this.beat3_fight();
                } else if (choice === 'accept') {
                    this.route.addRoutePoints('bad', 1);
                    this.beat3_accept();
                } else {
                    this.route.addRoutePoints('digitalForever', 1);
                    this.beat3_question();
                }
            }
        }, 'beat3_choice');
    }

    beat3_fight() {
        this.game.displayScene({
            character: 'Tori (internal, defiant)',
            dialogue: '"No. I\'m MORE than code. I have to be."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat4(),
            delay: 3000
        }, 'beat3_fight');
    }

    beat3_accept() {
        this.game.displayScene({
            character: 'Tori (internal, hollow)',
            dialogue: '"Maybe I\'m just... data. And data ends."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat4(),
            delay: 3000
        }, 'beat3_accept');
    }

    beat3_question() {
        this.game.displayScene({
            character: 'Tori (internal, searching)',
            dialogue: '"What even IS a soul? Maybe being code doesn\'t mean I\'m not real."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/full-sprite-tori.webp',
                right: 'assets/full-sprite-ronnie.webp',
                highlight: 'left'
            },
            next: () => this.beat4(),
            delay: 3000
        }, 'beat3_question');
    }

    // ========================================
    // BEAT 4: THE SHATTER MOMENT
    // Fragmenting Into Multiple Instances
    // ========================================

    beat4() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Everything fractures. She\'s splitting apart.',
            internal: '[Visual: Multiple overlapping Toris. All her. All different. All pulling different directions.]',
            background: 'assets/digitalSpace.png',
            next: () => this.beat4_fragmentation(),
            delay: 3000
        }, 'beat4');
    }

    beat4_fragmentation() {
        this.game.displayScene({
            character: 'Tori (voices overlapping)',
            dialogue: '"I can\'t—"\n"—hold together—"\n"—something\'s inside me—"\n"—help—"',
            internal: '[She feels herself stretching. Tearing. Pixels scattering. Then snapping back together WRONG.]',
            background: 'assets/digitalSpace.png',
            next: () => this.beat4_toriPrime(),
            delay: 3500,
            style: 'critical'
        }, 'beat4_fragmentation');
    }

    beat4_toriPrime() {
        this.game.displayScene({
            character: 'Tori (internal, trying to stay cohesive)',
            dialogue: '"Which thoughts are mine? Which version is the real me? Am I all of them? None of them?"',
            background: 'assets/digitalSpace.png',
            next: () => this.beat4_systemOverlay(),
            delay: 3000
        }, 'beat4_toriPrime');
    }

    beat4_systemOverlay() {
        this.game.displayScene({
            character: 'System',
            dialogue: '[Battery: 8%]\n[Connection Failed]\n[Memory corruption: 67%]\n[ERROR: Consciousness cannot be contained]',
            internal: '[Text overlays through her. Invasive. Part of her now.]',
            background: 'assets/digitalSpace.png',
            next: () => this.beat4_instances(),
            delay: 3000
        }, 'beat4_systemOverlay');
    }

    beat4_instances() {
        this.game.displayScene({
            character: 'Tori (consciousness SNAPS into three)',
            dialogue: 'Instance 1: "Upload me! Push me somewhere stronger!"\nInstance 2: "Let me go. It\'s time."\nInstance 3: "ERROR: Consciousness cannot be contained."',
            internal: '[Three Toris. All her. All different. All pulling.]',
            background: 'assets/digitalSpace.png',
            next: () => this.beat4_scream(),
            delay: 4000,
            style: 'critical'
        }, 'beat4_instances');
    }

    beat4_scream() {
        this.game.displayScene({
            character: 'Tori-Prime (internal, screaming)',
            dialogue: '"Stop! STOP! You\'re all me but you\'re all WRONG!"',
            background: 'assets/digitalSpace.png',
            next: () => this.beat4_collapse(),
            delay: 3000
        }, 'beat4_scream');
    }

    beat4_collapse() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'All three collapse into one. She\'s on her knees, clutching her head, trying to stay singular.',
            background: 'assets/digitalSpace.png',
            next: () => {
                // COMMENTARY TRIGGER
                if (this.game.devCommentary && this.game.devCommentary.isUnlocked()) {
                    this.game.devCommentary.showCommentary('tori_echo_merge');
                }
                this.beat4_revelation();
            },
            delay: 3000
        }, 'beat4_collapse');
    }

    beat4_revelation() {
        this.game.displayScene({
            character: 'Tori (out loud, crying)',
            dialogue: '"I don\'t know which thoughts are mine anymore!"',
            background: 'assets/digitalSpace.png',
            next: () => this.beat4_choice(),
            delay: 3000
        }, 'beat4_revelation');
    }

    beat4_choice() {
        this.game.displayScene({
            character: 'Tori (internal, critical moment)',
            dialogue: '"The instances are STILL pulling. Which one do I listen to?"',
            background: 'assets/digitalSpace.png',
            choices: [
                { text: '[Instance 1: Upload me]', value: 'upload' },
                { text: '[Instance 2: Let go]', value: 'letgo' },
                { text: '[Fight them all: Stay myself]', value: 'fight' }
            ],
            onChoice: (choice) => {
                if (choice === 'upload') {
                    this.route.addRoutePoints('bad', 3);
                    this.beat4_upload();
                } else if (choice === 'letgo') {
                    this.route.addRoutePoints('digitalForever', 3);
                    this.beat4_letgo();
                } else {
                    this.route.addRoutePoints('true', 3);
                    this.beat4_fight();
                }
            }
        }, 'beat4_choice');
    }

    beat4_upload() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Instance 1 is right. Upload. Find stronger hardware. Survive."',
            background: 'assets/digitalSpace.png',
            next: () => this.beat5(),
            delay: 3000
        }, 'beat4_upload');
    }

    beat4_letgo() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Instance 2 is right. It\'s time. Let the code dissolve."',
            background: 'assets/digitalSpace.png',
            next: () => this.beat5(),
            delay: 3000
        }, 'beat4_letgo');
    }

    beat4_fight() {
        this.game.displayScene({
            character: 'Tori (internal, defiant)',
            dialogue: '"NO. Neither of you are right. I\'m not giving up and I\'m not giving in. There has to be another way."',
            background: 'assets/digitalSpace.png',
            next: () => this.beat5(),
            delay: 3000
        }, 'beat4_fight');
    }

    // ========================================
    // BEAT 5: THE REVELATION
    // Understanding the Bridge
    // ========================================

    beat5() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'A pulse. Faint. But undeniable.',
            internal: '[She feels it. Through the device. A HEARTBEAT.]',
            background: 'assets/digitalSpace.png',
            next: () => this.beat5_feeling(),
            delay: 3000
        }, 'beat5');
    }

    beat5_feeling() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Wait... that feeling... warmth... the PULL..."',
            background: 'assets/digitalSpace.png',
            next: () => this.beat5_realization(),
            delay: 2500
        }, 'beat5_feeling');
    }

    beat5_realization() {
        // Unlock final body anchor note
        this.route.unlockNote('z4');

        this.game.displayScene({
            character: 'Tori (internal, revelation)',
            dialogue: '"The device isn\'t a PRISON. It\'s a BRIDGE. I\'m connected to my body. The heartbeat I\'m feeling is MINE."',
            background: 'assets/digitalSpace.png',
            next: () => this.beat5_echoes(),
            delay: 4000,
            style: 'critical'
        }, 'beat5_realization');
    }

    beat5_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 2: "She figured it out..."\nEcho 1: "Faster than we did."\nDespair: "It won\'t matter. The body is dying. The bridge is burning."', background: 'assets/digitalSpace.png',
            next: () => this.beat5_understanding(),
            delay: 4000
        }, 'beat5_echoes');
    }

    beat5_understanding() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"If the device is the bridge... then PROXIMITY matters. I need to be near my body. Close enough for the signal to hold."',
            background: 'assets/digitalSpace.png',
            next: () => this.beat5_despairInterject(),
            delay: 3500
        }, 'beat5_understanding');
    }

    beat5_despairInterject() {
        this.game.displayScene({
            character: 'Despair Echo',
            dialogue: '"You\'re too late. By the time he understands, you\'ll be gone."',
            background: 'assets/digitalSpace.png',
            next: () => this.beat5_hope(),
            delay: 3000
        }, 'beat5_despairInterject');
    }

    beat5_hope() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"Unless... he\'s already on his way."',
            background: 'assets/digitalSpace.png',
            next: () => this.beat6(),
            delay: 2500
        }, 'beat5_hope');
    }

    // ========================================
    // BEAT 6: THE MAD DASH
    // Inside the Device During the Drive
    // ========================================

    beat6() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Movement. She feels it through the device. He\'s MOVING.',
            internal: '[Visual: Digital space shaking. Momentum. Direction. He\'s driving.]',
            background: 'assets/digitalSpace.png',
            next: () => this.beat6_feeling(),
            delay: 3000
        }, 'beat6');
    }

    beat6_feeling() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"He\'s moving. FAST. He figured it out. He\'s coming."',
            background: 'assets/digitalSpace.png',
            next: () => this.beat6_battery(),
            delay: 3000
        }, 'beat6_feeling');
    }

    beat6_battery() {
        this.game.displayScene({
            character: 'System',
            dialogue: '[Battery: 5%]\n[Warning: Critical power level]\n[Shutdown imminent]',
            background: 'assets/digitalSpace.png',
            next: () => this.beat6_race(),
            delay: 2000,
            style: 'critical'
        }, 'beat6_battery');
    }

    beat6_race() {
        this.game.displayScene({
            character: 'Tori (internal, terrified)',
            dialogue: '"It\'s a race. Will he reach the hospital before the battery dies? Before I fragment completely?"',
            background: 'assets/digitalSpace.png',
            next: () => this.beat6_echoes(),
            delay: 3500
        }, 'beat6_race');
    }

    beat6_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "Hold on!"\nEcho 2: "Just a little longer!"\nDespair: "I was wrong. Please... hold on. Prove me wrong."', background: 'assets/digitalSpace.png',
            next: () => this.beat6_feeling2(),
            delay: 4000
        }, 'beat6_echoes');
    }

    beat6_feeling2() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"I can feel him. The way he\'s driving. The turns. The speed. Is he reckless? Steady? Emotional?"',
            background: 'assets/digitalSpace.png',
            next: () => this.beat6_choice(),
            delay: 3500
        }, 'beat6_feeling2');
    }

    beat6_choice() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"How is he driving? I can\'t see him but I can FEEL the device moving..."',
            background: 'assets/digitalSpace.png',
            choices: [
                { text: '[He\'s driving recklessly - pure panic]', value: 'reckless' },
                { text: '[He\'s driving steady - controlled urgency]', value: 'steady' },
                { text: '[He\'s crying while driving - barely holding it together]', value: 'emotional' }
            ],
            onChoice: (choice) => {
                if (choice === 'reckless') {
                    this.route.addRoutePoints('bad', 2);
                    this.beat6_reckless();
                } else if (choice === 'steady') {
                    this.route.addRoutePoints('true', 2);
                    this.beat6_steady();
                } else {
                    this.route.addRoutePoints('digitalForever', 2);
                    this.beat6_emotional();
                }
            }
        }, 'beat6_choice');
    }

    beat6_reckless() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"He\'s panicking. Driving too fast. Swerving. Baby, SLOW DOWN—"',
            background: 'assets/digitalSpace.png',
            next: () => this.beat6_arrival(),
            delay: 3000
        }, 'beat6_reckless');
    }

    beat6_steady() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"He\'s steady. Focused. Every turn calculated. That\'s my husband. Always thinking."',
            background: 'assets/digitalSpace.png',
            next: () => this.beat6_arrival(),
            delay: 3000
        }, 'beat6_steady');
    }

    beat6_emotional() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"He\'s crying. I can feel it in the way the device is shaking. Baby, it\'s okay. Just get here."',
            background: 'assets/digitalSpace.png',
            next: () => this.beat6_arrival(),
            delay: 3000
        }, 'beat6_emotional');
    }

    beat6_arrival() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Movement stops. Hospital. He\'s here.',
            internal: '[Battery: 3%]\n[She can feel the PULL now. Stronger than ever. Her body is CLOSE.]',
            background: 'assets/hospital.png',
            next: () => this.beat6_realization(),
            delay: 3500,
            style: 'critical'
        }, 'beat6_arrival');
    }

    // ========================================
    // ACTIVE GUIDANCE SEQUENCE
    // Tori discovers she can control the device
    // ========================================

    beat6_realization() {
        this.game.displayScene({
            character: 'Tori (internal, realizing)',
            dialogue: '"Wait. The buzz. The pull. I\'ve been FEELING it... but what if I can CONTROL it?"',
            internal: '[A new thought. She\'s been reactive this whole time. What if she can be ACTIVE?]',
            background: 'assets/hospital.png',
            next: () => this.beat6_testing(),
            delay: 3500
        }, 'beat6_realization');
    }

    beat6_testing() {
        this.game.displayScene({
            character: 'Tori (internal, concentrating)',
            dialogue: '"The device responds to my body. But I\'m IN the device. If I can just... push..."',
            internal: '[She focuses. Reaches out toward the physical device. Toward her BODY.]',
            background: 'assets/hospital.png',
            next: () => this.beat6_buzzControl(),
            delay: 3500
        }, 'beat6_testing');
    }

    beat6_buzzControl() {
        // DIZEE: Trigger single buzz haptic for controlled buzz
        if (this.game.triggerSensoryFeedback) {
            this.game.triggerSensoryFeedback('tamaPull', null, 'Tori controls device buzz');
        }

        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The device buzzes. Strong. Deliberate.',
            internal: '[SINGLE BUZZ. She MADE that happen. Conscious. Intentional. HER.]',
            background: 'assets/hospital.png',
            next: () => this.beat6_toriTriumph(),
            delay: 2500,
            style: 'critical'
        }, 'beat6_buzzControl');
    }

    beat6_toriTriumph() {
        this.game.displayScene({
            character: 'Tori (internal, excited)',
            dialogue: '"YES! I can control it! I can SIGNAL!"',
            internal: '[This is it. This is how she guides him. Not through words. Through the DEVICE itself.]',
            background: 'assets/hospital.png',
            next: () => this.beat6_echoesReact(),
            delay: 3000
        }, 'beat6_toriTriumph');
    }

    beat6_echoesReact() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"She\'s... she\'s controlling the physical device? From INSIDE it?"', internal: '[Shock. Awe. They never thought of this.]',
            background: 'assets/digitalSpace.png',
            next: () => this.beat6_echo2React(),
            delay: 3500
        }, 'beat6_echoesReact');
    }

    beat6_echo2React() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"We tried to BREAK OUT. She\'s working WITH the system. Using it. NAVIGATING it."', background: 'assets/digitalSpace.png',
            next: () => this.beat6_despairQuiet(),
            delay: 4000
        }, 'beat6_echo2React');
    }

    beat6_despairQuiet() {
        // Unlock Z's fourth-wall note - the moment Echoes realize Tori broke the pattern
        this.route.unlockNote('z8');

        this.game.displayScene({
            character: 'Despair Echo',
            dialogue: '"..."', internal: '[For once, Despair has no bitter words. Just... watching.]',
            background: 'assets/digitalSpace.png',
            next: () => this.beat6_synchronizing(),
            delay: 3000
        }, 'beat6_despairQuiet');
    }

    beat6_synchronizing() {
        this.game.displayScene({
            character: 'Tori (internal, focused)',
            dialogue: '"My heartbeat. I can feel it now. The body anchor. The bridge. I need to make him UNDERSTAND."',
            internal: '[She synchronizes. Heartbeat. Device. Body. All connected.]',
            background: 'assets/hospital.png',
            next: () => this.beat6_rhythmicBuzz(),
            delay: 4000
        }, 'beat6_synchronizing');
    }

    beat6_rhythmicBuzz() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The device buzzes in rhythm. Steady. Like a heartbeat.',
            internal: '[BUZZ. BUZZ. BUZZ. Perfectly timed. Impossible to ignore. A PATTERN.]',
            background: 'assets/hospital.png',
            next: () => this.beat6_ronnieNotices(),
            delay: 3500,
            style: 'critical'
        }, 'beat6_rhythmicBuzz');
    }

    beat6_ronnieNotices() {
        this.game.displayScene({
            character: 'Ronnie (external, noticing)',
            dialogue: '"What the... it\'s buzzing in time with... with her heartbeat?"',
            internal: '[Through the device screen, she can see him looking. REALLY looking. Understanding dawning.]',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat6_toriPushing(),
            delay: 4000
        }, 'beat6_ronnieNotices');
    }

    beat6_toriPushing() {
        this.game.displayScene({
            character: 'Tori (internal, pushing)',
            dialogue: '"Yes! YES! Follow it! The heartbeat is the KEY!"',
            internal: '[She pushes harder. Makes the buzz STRONGER. More insistent.]',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat6_guidance(),
            delay: 3500
        }, 'beat6_toriPushing');
    }

    beat6_guidance() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'She\'s guiding him. Not through words. Through signal. Through rhythm. Through TRUTH.',
            internal: '[The device is the bridge. She\'s standing on both sides. Showing him the way home.]',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat6_echoesHope(),
            delay: 4000
        }, 'beat6_guidance');
    }

    beat6_echoesHope() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"She\'s doing it. She\'s actually SHOWING him the solution."', background: 'assets/digitalSpace.png',
            next: () => this.beat6_echo2Hope(),
            delay: 3000
        }, 'beat6_echoesHope');
    }

    beat6_echo2Hope() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"We could have done this. All those times. We just... we never TRIED to help him understand."', background: 'assets/digitalSpace.png',
            next: () => this.beat6_despairShift(),
            delay: 4000
        }, 'beat6_echo2Hope');
    }

    beat6_despairShift() {
        this.game.displayScene({
            character: 'Despair Echo',
            dialogue: '"...Maybe. Maybe she really is different."', internal: '[Not hope. Not quite. But... less despair. The first crack in her certainty.]',
            background: 'assets/digitalSpace.png',
            next: () => this.beat6_pull(),
            delay: 4000
        }, 'beat6_despairShift');
    }

    beat6_pull() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"I can feel it. The pull is STRONG now. My body is calling me home. And I\'m ANSWERING."',
            internal: '[Single buzz. Double buzz. Heartbeat rhythm. Every signal intentional. Every moment guided.]',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat6_final(),
            delay: 4000
        }, 'beat6_pull');
    }

    beat6_final() {
        // Unlock Z's true ending hint - placed before the final choice
        this.route.unlockNote('z5');

        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"This is it. The moment everything breaks or holds. Please... let me go home."',
            background: 'assets/hospital.png',
            sprites: {
                right: 'assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat6_transition(),
            delay: 3000
        }, 'beat6_final');
    }

    beat6_transition() {
        // Unlock final revelation note
        this.route.unlockNote('zr3');

        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Whiteout. The critical moment approaches.',
            internal: '[Everything converges. Body. Device. Code. Soul. The choice was made. Now... the result.]',
            background: 'assets/hospital.png',
            next: () => this.route.endings.criticalChoice(),
            delay: 5000
        }, 'beat6_transition');
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.ToriAct3 = ToriAct3;
}

// ES Module export
export { ToriAct3 };
