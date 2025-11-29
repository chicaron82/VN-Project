// ========================================
// TORI'S ROUTE - ACT 3 (V4 - VISUAL INTEGRATION)
// The Honeymoon Fakeout & Collapse (Tori's POV)
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

        this.tori_act3_01_honeymoonloop();
    }
    
    // ========================================
    // BEAT 1: HONEYMOON LOOP (FALSE CALM)
    // Inside the Perfect Dream
    // ========================================
    
    tori_act3_01_honeymoonloop() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Everything is perfect. Too perfect.',
            internal: '[Visual: Pixel park. Cherry blossoms. Everything soft-focused and beautiful.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_02_icecreamstand(),
            delay: 3000
        }, 'tori_act3_01_honeymoonloop');
    }

    tori_act3_02_icecreamstand() {
        this.game.displayScene({
            character: 'Ronnie (sprite)',
            dialogue: '"Ice cream?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_03_torianswer(),
            delay: 2000
        }, 'tori_act3_02_icecreamstand');
    }

    tori_act3_03_torianswer() {
        this.game.displayScene({
            character: 'Tori (sprite)',
            dialogue: '"Tiger Tail, please."',
            internal: '[Wait. That\'s wrong. I hate Tiger Tail.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_04_horror(),
            delay: 2500,
            style: 'critical'
        }, 'tori_act3_03_torianswer');
    }

    tori_act3_04_horror() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"I didn\'t say that. My mouth moved but those weren\'t my words."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_05_echoes(),
            delay: 3000
        }, 'tori_act3_04_horror');
    }

    tori_act3_05_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "Here it comes."\nEcho 2: "The loop tightens."\nDespair: "You\'re in the honeymoon trap. Everything feels right because nothing is real."',            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_06_bench(),
            delay: 4000
        }, 'tori_act3_05_echoes');
    }

    tori_act3_06_bench() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'They sit on a bench. Cherry blossoms fall on loop. The same three petals. Again. Again. Again.',
            internal: '[She notices the pattern. The EXACT same three petals. The EXACT same timing.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_07_torirealize(),
            delay: 3500
        }, 'tori_act3_06_bench');
    }

    tori_act3_07_torirealize() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"This isn\'t a memory. It\'s a construct. And I\'m caught inside it."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_08_choice(),
            delay: 3000
        }, 'tori_act3_07_torirealize');
    }

    tori_act3_08_choice() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Do I... tell him something\'s wrong? Or just... stay in this moment?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            choices: [
                { text: '[Call it out: "This isn\'t real"]', value: 'truth' },
                { text: '[Stay quiet: Maybe I\'m wrong]', value: 'quiet' },
                { text: '[Panic: "Get me out!"]', value: 'panic' }
            ],
            onChoice: (choice) => {
                if (choice === 'truth') {
                    this.route.addRoutePoints('true', 1);
                    this.tori_act3_09_truth();
                } else if (choice === 'quiet') {
                    this.route.addRoutePoints('digitalForever', 1);
                    this.tori_act3_10_quiet();
                } else {
                    this.route.addRoutePoints('bad', 1);
                    this.tori_act3_11_panic();
                }
            }
        }, 'tori_act3_08_choice');
    }

    tori_act3_09_truth() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"Ronnie... this isn\'t real. The petals are looping. I can feel it."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_12_fracture(),
            delay: 3000
        }, 'tori_act3_09_truth');
    }

    tori_act3_10_quiet() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Maybe I\'m just paranoid. It feels so good here. Why ruin it?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_12_fracture(),
            delay: 3000
        }, 'tori_act3_10_quiet');
    }

    tori_act3_11_panic() {
        this.game.displayScene({
            character: 'Tori (typing frantically)',
            dialogue: '"GET ME OUT! This isn\'t real! None of this is REAL!"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_12_fracture(),
            delay: 3000
        }, 'tori_act3_11_panic');
    }

    // ========================================
    // BEAT 2: FRACTURE IN MEMORY
    // The Pasta Argument Plays Wrong
    // ========================================
    
    tori_act3_12_fracture() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Pixel kitchen. Cooking memory. But something\'s... off.',
            internal: '[Visual: The same scene from Act 2. But corrupted. Colors bleeding.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_13_argument(),
            delay: 3000
        }, 'tori_act3_12_fracture');
    }

    tori_act3_13_argument() {
        this.game.displayScene({
            character: 'Ronnie (sprite)',
            dialogue: '"You burned the garlic bread again."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_14_toriresponse(),
            delay: 2500
        }, 'tori_act3_13_argument');
    }

    tori_act3_14_toriresponse() {
        this.game.displayScene({
            character: 'Tori (sprite, voice not hers)',
            dialogue: '"I hate you."',
            internal: '[NO. That\'s not what I said. I said "shut up" as a JOKE.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_15_horror(),
            delay: 3000,
            style: 'critical'
        }, 'tori_act3_14_toriresponse');
    }

    tori_act3_15_horror() {
        this.game.displayScene({
            character: 'Tori (internal, panicking)',
            dialogue: '"The memory is WRONG. That\'s not how it happened. Why is it playing wrong?!"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_16_echoes(),
            delay: 3000
        }, 'tori_act3_15_horror');
    }

    tori_act3_16_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 2: "Memory corruption."\nEcho 1: "The system is rewriting her."\nDespair: "Soon you won\'t remember what was real and what the code invented."',            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_17_ronnienotice(),
            delay: 4000
        }, 'tori_act3_16_echoes');
    }

    tori_act3_17_ronnienotice() {
        this.game.displayScene({
            character: 'Ronnie (concerned)',
            dialogue: '"Tori? You okay? You just... froze."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_18_choice(),
            delay: 2500
        }, 'tori_act3_17_ronnienotice');
    }

    tori_act3_18_choice() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Do I tell him the memory played wrong? Or pretend it\'s fine?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            choices: [
                { text: '[Tell him: "The memory was corrupted"]', value: 'truth' },
                { text: '[Lie: "I\'m fine, just tired"]', value: 'lie' },
                { text: '[Deflect: Change the subject]', value: 'deflect' }
            ],
            onChoice: (choice) => {
                if (choice === 'truth') {
                    this.route.addRoutePoints('true', 1);
                    this.tori_act3_19_truth();
                } else if (choice === 'lie') {
                    this.route.addRoutePoints('digitalForever', 1);
                    this.tori_act3_20_lie();
                } else {
                    this.route.addRoutePoints('bad', 1);
                    this.tori_act3_21_deflect();
                }
            }
        }, 'tori_act3_18_choice');
    }

    tori_act3_19_truth() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"That memory... it didn\'t play right. The words were wrong."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_22_system(),
            delay: 3000
        }, 'tori_act3_19_truth');
    }

    tori_act3_20_lie() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"I\'m fine. Just a glitch. Keep going."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_22_system(),
            delay: 3000
        }, 'tori_act3_20_lie');
    }

    tori_act3_21_deflect() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"Let\'s do something else. Anything else."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_22_system(),
            delay: 3000
        }, 'tori_act3_21_deflect');
    }

    // ========================================
    // BEAT 3: SYSTEM MESSAGES INTRUDE
    // The Fourth Wall Shatters
    // ========================================
    
    tori_act3_22_system() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Text boxes appear. In her vision. Overlaying everything.',
            internal: '[Visual: System UI elements appearing where they shouldn\'t. Debug console bleeding through.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_23_firstbox(),
            delay: 3000
        }, 'tori_act3_22_system');
    }

    tori_act3_23_firstbox() {
        this.game.displayScene({
            character: 'System',
            dialogue: '[Battery: 15%]',
            internal: '[She SEES it. Not as UI. As part of her reality.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_24_torireact(),
            delay: 2000,
            style: 'critical'
        }, 'tori_act3_23_firstbox');
    }

    tori_act3_24_torireact() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"What is that? Why am I seeing system messages?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_25_moreboxes(),
            delay: 2500
        }, 'tori_act3_24_torireact');
    }

    tori_act3_25_moreboxes() {
        this.game.displayScene({
            character: 'System',
            dialogue: '[Warning: Fragmentation detected]\n[Memory corruption: 67%]\n[Connection unstable]',
            internal: '[The boxes multiply. Fill her vision. She can barely see Ronnie anymore.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_26_horror(),
            delay: 3000
        }, 'tori_act3_25_moreboxes');
    }

    tori_act3_26_horror() {
        this.game.displayScene({
            character: 'Tori (internal, breaking)',
            dialogue: '"I\'m seeing the backend. The debug console. Because I\'m not separate from the system. I AM the system."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_27_echoes(),
            delay: 3500,
            style: 'critical'
        }, 'tori_act3_26_horror');
    }

    tori_act3_27_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "Now she understands."\nEcho 2: "She\'s not trapped IN code."\nDespair: "She IS code. And code doesn\'t have a soul to save."',            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_28_truthbox(),
            delay: 4000
        }, 'tori_act3_27_echoes');
    }

    tori_act3_28_truthbox() {
        this.game.displayScene({
            character: 'System',
            dialogue: '[You can\'t upload a soul.]',
            internal: '[That\'s not a system message. That\'s a TRUTH. Hard-coded. A rule.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_29_choice(),
            delay: 3000,
            style: 'critical'
        }, 'tori_act3_28_truthbox');
    }

    tori_act3_29_choice() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Do I fight this? Or accept what I am?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            choices: [
                { text: '[Fight: "I\'m MORE than code"]', value: 'fight' },
                { text: '[Accept: "Maybe I am just data"]', value: 'accept' },
                { text: '[Question: "What IS a soul?"]', value: 'question' }
            ],
            onChoice: (choice) => {
                if (choice === 'fight') {
                    this.route.addRoutePoints('true', 1);
                    this.tori_act3_30_fight();
                } else if (choice === 'accept') {
                    this.route.addRoutePoints('bad', 1);
                    this.tori_act3_31_accept();
                } else {
                    this.route.addRoutePoints('digitalForever', 1);
                    this.tori_act3_32_question();
                }
            }
        }, 'tori_act3_29_choice');
    }

    tori_act3_30_fight() {
        this.game.displayScene({
            character: 'Tori (internal, defiant)',
            dialogue: '"No. I\'m MORE than code. I have to be."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_33_shatter(),
            delay: 3000
        }, 'tori_act3_30_fight');
    }

    tori_act3_31_accept() {
        this.game.displayScene({
            character: 'Tori (internal, hollow)',
            dialogue: '"Maybe I\'m just... data. And data ends."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_33_shatter(),
            delay: 3000
        }, 'tori_act3_31_accept');
    }

    tori_act3_32_question() {
        this.game.displayScene({
            character: 'Tori (internal, searching)',
            dialogue: '"What even IS a soul? Maybe being code doesn\'t mean I\'m not real."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_33_shatter(),
            delay: 3000
        }, 'tori_act3_32_question');
    }

    // ========================================
    // BEAT 4: THE SHATTER MOMENT
    // Fragmenting Into Multiple Instances
    // ========================================
    
    tori_act3_33_shatter() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Everything fractures. She\'s splitting apart.',
            internal: '[Visual: Multiple overlapping Toris. All her. All different. All pulling different directions.]',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_34_fragmentation(),
            delay: 3000
        }, 'tori_act3_33_shatter');
    }

    tori_act3_34_fragmentation() {
        this.game.displayScene({
            character: 'Tori (voices overlapping)',
            dialogue: '"I can\'t—"\n"—hold together—"\n"—something\'s inside me—"\n"—help—"',
            internal: '[She feels herself stretching. Tearing. Pixels scattering. Then snapping back together WRONG.]',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_35_toriprime(),
            delay: 3500,
            style: 'critical'
        }, 'tori_act3_34_fragmentation');
    }

    tori_act3_35_toriprime() {
        this.game.displayScene({
            character: 'Tori (internal, trying to stay cohesive)',
            dialogue: '"Which thoughts are mine? Which version is the real me? Am I all of them? None of them?"',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_36_systemoverlay(),
            delay: 3000
        }, 'tori_act3_35_toriprime');
    }

    tori_act3_36_systemoverlay() {
        this.game.displayScene({
            character: 'System',
            dialogue: '[Battery: 8%]\n[Connection Failed]\n[Memory corruption: 67%]\n[ERROR: Consciousness cannot be contained]',
            internal: '[Text overlays through her. Invasive. Part of her now.]',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_37_instances(),
            delay: 3000
        }, 'tori_act3_36_systemoverlay');
    }

    tori_act3_37_instances() {
        this.game.displayScene({
            character: 'Tori (consciousness SNAPS into three)',
            dialogue: 'Instance 1: "Upload me! Push me somewhere stronger!"\nInstance 2: "Let me go. It\'s time."\nInstance 3: "ERROR: Consciousness cannot be contained."',
            internal: '[Three Toris. All her. All different. All pulling.]',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_38_scream(),
            delay: 4000,
            style: 'critical'
        }, 'tori_act3_37_instances');
    }

    tori_act3_38_scream() {
        this.game.displayScene({
            character: 'Tori-Prime (internal, screaming)',
            dialogue: '"Stop! STOP! You\'re all me but you\'re all WRONG!"',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_39_collapse(),
            delay: 3000
        }, 'tori_act3_38_scream');
    }

    tori_act3_39_collapse() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'All three collapse into one. She\'s on her knees, clutching her head, trying to stay singular.',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_40_revelation(),
            delay: 3000
        }, 'tori_act3_39_collapse');
    }

    tori_act3_40_revelation() {
        this.game.displayScene({
            character: 'Tori (out loud, crying)',
            dialogue: '"I don\'t know which thoughts are mine anymore!"',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_41_choice(),
            delay: 3000
        }, 'tori_act3_40_revelation');
    }

    tori_act3_41_choice() {
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
                    this.tori_act3_42_upload();
                } else if (choice === 'letgo') {
                    this.route.addRoutePoints('digitalForever', 3);
                    this.tori_act3_43_letgo();
                } else {
                    this.route.addRoutePoints('true', 3);
                    this.tori_act3_44_fight();
                }
            }
        }, 'tori_act3_41_choice');
    }

    tori_act3_42_upload() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Instance 1 is right. Upload. Find stronger hardware. Survive."',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_45_revelation(),
            delay: 3000
        }, 'tori_act3_42_upload');
    }

    tori_act3_43_letgo() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Instance 2 is right. It\'s time. Let the code dissolve."',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_45_revelation(),
            delay: 3000
        }, 'tori_act3_43_letgo');
    }

    tori_act3_44_fight() {
        this.game.displayScene({
            character: 'Tori (internal, defiant)',
            dialogue: '"NO. Neither of you are right. I\'m not giving up and I\'m not giving in. There has to be another way."',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_45_revelation(),
            delay: 3000
        }, 'tori_act3_44_fight');
    }

    // ========================================
    // BEAT 5: THE REVELATION
    // Understanding the Bridge
    // ========================================
    
    tori_act3_45_revelation() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'A pulse. Faint. But undeniable.',
            internal: '[She feels it. Through the device. A HEARTBEAT.]',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_46_feeling(),
            delay: 3000
        }, 'tori_act3_45_revelation');
    }

    tori_act3_46_feeling() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Wait... that feeling... warmth... the PULL..."',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_47_realization(),
            delay: 2500
        }, 'tori_act3_46_feeling');
    }

    tori_act3_47_realization() {
        // Unlock final body anchor note
        this.route.unlockNote('z4');

        this.game.displayScene({
            character: 'Tori (internal, revelation)',
            dialogue: '"The device isn\'t a PRISON. It\'s a BRIDGE. I\'m connected to my body. The heartbeat I\'m feeling is MINE."',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_48_echoes(),
            delay: 4000,
            style: 'critical'
        }, 'tori_act3_47_realization');
    }

    tori_act3_48_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 2: "She figured it out..."\nEcho 1: "Faster than we did."\nDespair: "It won\'t matter. The body is dying. The bridge is burning."',            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_49_understanding(),
            delay: 4000
        }, 'tori_act3_48_echoes');
    }

    tori_act3_49_understanding() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"If the device is the bridge... then PROXIMITY matters. I need to be near my body. Close enough for the signal to hold."',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_50_despairinterject(),
            delay: 3500
        }, 'tori_act3_49_understanding');
    }

    tori_act3_50_despairinterject() {
        this.game.displayScene({
            character: 'Despair Echo',
            dialogue: '"You\'re too late. By the time he understands, you\'ll be gone."',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_51_hope(),
            delay: 3000
        }, 'tori_act3_50_despairinterject');
    }

    tori_act3_51_hope() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"Unless... he\'s already on his way."',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_52_drive(),
            delay: 2500
        }, 'tori_act3_51_hope');
    }

    // ========================================
    // BEAT 6: THE MAD DASH
    // Inside the Device During the Drive
    // ========================================
    
    tori_act3_52_drive() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Movement. She feels it through the device. He\'s MOVING.',
            internal: '[Visual: Digital space shaking. Momentum. Direction. He\'s driving.]',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_53_feeling(),
            delay: 3000
        }, 'tori_act3_52_drive');
    }

    tori_act3_53_feeling() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"He\'s moving. FAST. He figured it out. He\'s coming."',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_54_battery(),
            delay: 3000
        }, 'tori_act3_53_feeling');
    }

    tori_act3_54_battery() {
        this.game.displayScene({
            character: 'System',
            dialogue: '[Battery: 5%]\n[Warning: Critical power level]\n[Shutdown imminent]',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_55_race(),
            delay: 2000,
            style: 'critical'
        }, 'tori_act3_54_battery');
    }

    tori_act3_55_race() {
        this.game.displayScene({
            character: 'Tori (internal, terrified)',
            dialogue: '"It\'s a race. Will he reach the hospital before the battery dies? Before I fragment completely?"',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_56_echoes(),
            delay: 3500
        }, 'tori_act3_55_race');
    }

    tori_act3_56_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "Hold on!"\nEcho 2: "Just a little longer!"\nDespair: "I was wrong. Please... hold on. Prove me wrong."',            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_57_feeling2(),
            delay: 4000
        }, 'tori_act3_56_echoes');
    }

    tori_act3_57_feeling2() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"I can feel him. The way he\'s driving. The turns. The speed. Is he reckless? Steady? Emotional?"',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_58_choice(),
            delay: 3500
        }, 'tori_act3_57_feeling2');
    }

    tori_act3_58_choice() {
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
                    this.tori_act3_59_reckless();
                } else if (choice === 'steady') {
                    this.route.addRoutePoints('true', 2);
                    this.tori_act3_60_steady();
                } else {
                    this.route.addRoutePoints('digitalForever', 2);
                    this.tori_act3_61_emotional();
                }
            }
        }, 'tori_act3_58_choice');
    }

    tori_act3_59_reckless() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"He\'s panicking. Driving too fast. Swerving. Baby, SLOW DOWN—"',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_62_arrival(),
            delay: 3000
        }, 'tori_act3_59_reckless');
    }

    tori_act3_60_steady() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"He\'s steady. Focused. Every turn calculated. That\'s my husband. Always thinking."',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_62_arrival(),
            delay: 3000
        }, 'tori_act3_60_steady');
    }

    tori_act3_61_emotional() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"He\'s crying. I can feel it in the way the device is shaking. Baby, it\'s okay. Just get here."',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_62_arrival(),
            delay: 3000
        }, 'tori_act3_61_emotional');
    }

    tori_act3_62_arrival() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Movement stops. Hospital. He\'s here.',
            internal: '[Battery: 3%]\n[She can feel the PULL now. Stronger than ever. Her body is CLOSE.]',
            background: 'hospital.png',
            next: () => this.tori_act3_63_realization(),
            delay: 3500,
            style: 'critical'
        }, 'tori_act3_62_arrival');
    }

    // ========================================
    // ACTIVE GUIDANCE SEQUENCE
    // Tori discovers she can control the device
    // ========================================

    tori_act3_63_realization() {
        this.game.displayScene({
            character: 'Tori (internal, realizing)',
            dialogue: '"Wait. The buzz. The pull. I\'ve been FEELING it... but what if I can CONTROL it?"',
            internal: '[A new thought. She\'s been reactive this whole time. What if she can be ACTIVE?]',
            background: 'hospital.png',
            next: () => this.tori_act3_64_testing(),
            delay: 3500
        }, 'tori_act3_63_realization');
    }

    tori_act3_64_testing() {
        this.game.displayScene({
            character: 'Tori (internal, concentrating)',
            dialogue: '"The device responds to my body. But I\'m IN the device. If I can just... push..."',
            internal: '[She focuses. Reaches out toward the physical device. Toward her BODY.]',
            background: 'hospital.png',
            next: () => this.tori_act3_65_buzzcontrol(),
            delay: 3500
        }, 'tori_act3_64_testing');
    }

    tori_act3_65_buzzcontrol() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The device buzzes. Strong. Deliberate.',
            internal: '[SINGLE BUZZ. She MADE that happen. Conscious. Intentional. HER.]',
            background: 'hospital.png',
            sfx: 'single_buzz',
            next: () => this.tori_act3_66_toritriumph(),
            delay: 2500,
            style: 'critical'
        }, 'tori_act3_65_buzzcontrol');
    }

    tori_act3_66_toritriumph() {
        this.game.displayScene({
            character: 'Tori (internal, excited)',
            dialogue: '"YES! I can control it! I can SIGNAL!"',
            internal: '[This is it. This is how she guides him. Not through words. Through the DEVICE itself.]',
            background: 'hospital.png',
            next: () => this.tori_act3_67_echoesreact(),
            delay: 3000
        }, 'tori_act3_66_toritriumph');
    }

    tori_act3_67_echoesreact() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"She\'s... she\'s controlling the physical device? From INSIDE it?"',            internal: '[Shock. Awe. They never thought of this.]',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_68_echo2react(),
            delay: 3500
        }, 'tori_act3_67_echoesreact');
    }

    tori_act3_68_echo2react() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"We tried to BREAK OUT. She\'s working WITH the system. Using it. NAVIGATING it."',            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_69_despairquiet(),
            delay: 4000
        }, 'tori_act3_68_echo2react');
    }

    tori_act3_69_despairquiet() {
        // Unlock Z's fourth-wall note - the moment Echoes realize Tori broke the pattern
        this.route.unlockNote('z8');

        this.game.displayScene({
            character: 'Despair Echo',
            dialogue: '"..."',            internal: '[For once, Despair has no bitter words. Just... watching.]',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_70_synchronizing(),
            delay: 3000
        }, 'tori_act3_69_despairquiet');
    }

    tori_act3_70_synchronizing() {
        this.game.displayScene({
            character: 'Tori (internal, focused)',
            dialogue: '"My heartbeat. I can feel it now. The body anchor. The bridge. I need to make him UNDERSTAND."',
            internal: '[She synchronizes. Heartbeat. Device. Body. All connected.]',
            background: 'hospital.png',
            next: () => this.tori_act3_71_rhythmicbuzz(),
            delay: 4000
        }, 'tori_act3_70_synchronizing');
    }

    tori_act3_71_rhythmicbuzz() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The device buzzes in rhythm. Steady. Like a heartbeat.',
            internal: '[BUZZ. BUZZ. BUZZ. Perfectly timed. Impossible to ignore. A PATTERN.]',
            background: 'hospital.png',
            sfx: 'rhythmic_buzz',
            next: () => this.tori_act3_72_ronnienotices(),
            delay: 3500,
            style: 'critical'
        }, 'tori_act3_71_rhythmicbuzz');
    }

    tori_act3_72_ronnienotices() {
        this.game.displayScene({
            character: 'Ronnie (external, noticing)',
            dialogue: '"What the... it\'s buzzing in time with... with her heartbeat?"',
            internal: '[Through the device screen, she can see him looking. REALLY looking. Understanding dawning.]',
            background: 'hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_73_toripushing(),
            delay: 4000
        }, 'tori_act3_72_ronnienotices');
    }

    tori_act3_73_toripushing() {
        this.game.displayScene({
            character: 'Tori (internal, pushing)',
            dialogue: '"Yes! YES! Follow it! The heartbeat is the KEY!"',
            internal: '[She pushes harder. Makes the buzz STRONGER. More insistent.]',
            background: 'hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_74_guidance(),
            delay: 3500
        }, 'tori_act3_73_toripushing');
    }

    tori_act3_74_guidance() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'She\'s guiding him. Not through words. Through signal. Through rhythm. Through TRUTH.',
            internal: '[The device is the bridge. She\'s standing on both sides. Showing him the way home.]',
            background: 'hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_75_echoeshore(),
            delay: 4000
        }, 'tori_act3_74_guidance');
    }

    tori_act3_75_echoeshore() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"She\'s doing it. She\'s actually SHOWING him the solution."',            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_76_echo2hope(),
            delay: 3000
        }, 'tori_act3_75_echoeshore');
    }

    tori_act3_76_echo2hope() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"We could have done this. All those times. We just... we never TRIED to help him understand."',            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_77_despairshift(),
            delay: 4000
        }, 'tori_act3_76_echo2hope');
    }

    tori_act3_77_despairshift() {
        this.game.displayScene({
            character: 'Despair Echo',
            dialogue: '"...Maybe. Maybe she really is different."',            internal: '[Not hope. Not quite. But... less despair. The first crack in her certainty.]',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act3_78_pull(),
            delay: 4000
        }, 'tori_act3_77_despairshift');
    }

    tori_act3_78_pull() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"I can feel it. The pull is STRONG now. My body is calling me home. And I\'m ANSWERING."',
            internal: '[Single buzz. Double buzz. Heartbeat rhythm. Every signal intentional. Every moment guided.]',
            background: 'hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_79_final(),
            delay: 4000
        }, 'tori_act3_78_pull');
    }

    tori_act3_79_final() {
        // Unlock Z's true ending hint - placed before the final choice
        this.route.unlockNote('z5');

        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"This is it. The moment everything breaks or holds. Please... let me go home."',
            background: 'hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act3_80_transition(),
            delay: 3000
        }, 'tori_act3_79_final');
    }

    tori_act3_80_transition() {
        // Unlock final revelation note
        this.route.unlockNote('zr3');

        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Whiteout. The critical moment approaches.',
            internal: '[Everything converges. Body. Device. Code. Soul. The choice was made. Now... the result.]',
            background: 'hospital.png',
            next: () => this.route.endings.criticalChoice(),
            delay: 5000
        }, 'tori_act3_80_transition');
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToriAct3;
}
