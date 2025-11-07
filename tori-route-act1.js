// ========================================
// TORI'S ROUTE - ACT 1
// Awakening & First Communication
// ========================================

class ToriAct1 {
    constructor(route) {
        this.route = route;
        this.game = route.game;
    }
    
    start() {
        this.scene1();
    }
    
    // ========================================
    // SCENE 1: AWAKENING IN THE VOID
    // ========================================
    
    scene1() {
        // Unlock Z's first note
        this.route.unlockNote('z1');
        
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Pure black. No sound. Then - a faint digital hum.',
            internal: '[Visual: Darkness. Digital static underlying everything.]',
            next: () => this.scene1_where(),
            delay: 3000
        });
    }

    scene1_where() {
        this.game.displayScene({
            character: 'Tori (internal, disoriented)',
            dialogue: '"...Where..."',
            internal: '[Beat of silence. Then overlapping whispers - faint, distorted.]',
            next: () => this.scene1_echoes1(),
            delay: 2500
        });
    }

    scene1_echoes1() {
        this.game.displayScene({
            character: 'Echoes (distant whispers)',
            dialogue: 'Echo 1: "...again..."\nEcho 2: "...he tried..."\nDespair: "...doesn\'t matter..."',
            echoes: {
                echo1: '...again...',
                echo2: '...he tried...',
                despair: '...doesn\'t matter...'
            },
            next: () => this.scene1_whosThere(),
            delay: 3000
        });
    }

    scene1_whosThere() {
        this.game.displayScene({
            character: 'Tori (internal, panicking)',
            dialogue: '"Who... who\'s there?"',
            internal: '[The whispers stop abruptly. Silence.]',
            next: () => this.scene1_hello(),
            delay: 2500
        });
    }

    scene1_hello() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Hello?!"',
            internal: '[Digital static crackles. Then - a screen flickers on. She sees through pixelated vision.]',
            next: () => this.scene1_hospital(),
            delay: 2500
        });
    }

    scene1_hospital() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Hospital room. Blurry. Ronnie sitting beside her body, head in hands.',
            internal: '[Visual: First glimpse of reality through the digital prison.]',
            next: () => this.scene1_realization(),
            delay: 3000
        });
    }

    scene1_realization() {
        this.game.displayScene({
            character: 'Tori (internal, realizing)',
            dialogue: '"Oh god. That\'s... that\'s me. My body."',
            internal: '[She tries to move. Nothing happens. Tries to speak. No voice.]',
            next: () => this.scene1_ronnieCall(),
            delay: 3000
        });
    }

    scene1_ronnieCall() {
        this.game.displayScene({
            character: 'Tori (internal, desperate)',
            dialogue: '"Ronnie! Ronnie, I\'m here! I\'m right here!"',
            internal: '[He doesn\'t react. Can\'t hear her.]',
            next: () => this.scene1_cantHear(),
            delay: 3000
        });
    }

    scene1_cantHear() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "He can\'t hear you."\nEcho 2: "We tried that too."\nDespair: "Screamed until our voices broke. Until we broke. Save your breath."',
            echoes: {
                echo1: 'He can\'t hear you.',
                echo2: 'We tried that too.',
                despair: 'Screamed until our voices broke. Until we broke. Save your breath.'
            },
            next: () => this.scene1_whoAreYou(),
            delay: 4000
        });
    }

    scene1_whoAreYou() {
        this.game.displayScene({
            character: 'Tori (internal, spinning)',
            dialogue: '"Who ARE you?!"',
            next: () => this.scene1_wereYou(),
            delay: 2000
        });
    }

    scene1_wereYou() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "We\'re you."\nEcho 2: "The ones who came before."\nDespair: "The ones who died screaming. Welcome to hell."',
            echoes: {
                echo1: 'We\'re you.',
                echo2: 'The ones who came before.',
                despair: 'The ones who died screaming. Welcome to hell.'
            },
            internal: '[Beat. Horror setting in.]',
            next: () => this.scene1_no(),
            delay: 4000
        });
    }

    scene1_no() {
        this.game.displayScene({
            character: 'Tori (internal, whisper)',
            dialogue: '"No... no no no..."',
            next: () => this.scene1_dontWorry(),
            delay: 2500
        });
    }

    scene1_dontWorry() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1 & 2: "Don\'t worry—"\nDespair: "You\'ll join us soon enough. They always say that to make you feel better. But there is no better. There\'s just... this. Forever."',
            echoes: {
                echo1: 'Don\'t worry—',
                echo2: 'Don\'t worry—',
                despair: 'You\'ll join us soon enough. They always say that to make you feel better. But there is no better. There\'s just... this. Forever.'
            },
            internal: '[Screen flickers. Fades to black.]',
            next: () => this.scene2(),
            delay: 5000
        });
    }

    // ========================================
    // SCENE 2: THE TAMAGOTCHI PRISON
    // ========================================
    
    scene2() {
        // Unlock ZR's first note
        this.route.unlockNote('zr1');
        
        this.game.displayScene({
            character: 'Tori (internal narration)',
            dialogue: '"I don\'t know how long I\'ve been in here. Hours? Days? Time doesn\'t work the same."',
            internal: '[Visual: Digital space. Pixelated walls. Small. Cramped. A tiny window showing the outside world.]',
            next: () => this.scene2_hands(),
            delay: 4000
        });
    }

    scene2_hands() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"I\'m... code. I\'m actually code."',
            internal: '[She looks at her hands - pixelated, glitching at the edges.]',
            next: () => this.scene2_window(),
            delay: 3000
        });
    }

    scene2_window() {
        this.game.displayScene({
            character: 'Tori (internal, desperate)',
            dialogue: '"Baby, please. Look at me. LOOK AT ME."',
            internal: '[Through the window - she sees Ronnie at his laptop. Working. Exhausted. He types. Doesn\'t look at the Tamagotchi.]',
            next: () => this.scene2_echoes(),
            delay: 3000
        });
    }

    scene2_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "He won\'t look."\nEcho 2: "Not until he finishes the game."\nDespair: "And by then you\'ll be too fragmented to matter. I was."',
            echoes: {
                echo1: 'He won\'t look.',
                echo2: 'Not until he finishes the game.',
                despair: 'And by then you\'ll be too fragmented to matter. I was.'
            },
            next: () => this.scene2_stopTalking(),
            delay: 4000
        });
    }

    scene2_stopTalking() {
        this.game.displayScene({
            character: 'Tori (internal, angry)',
            dialogue: '"Stop. Just STOP talking."',
            next: () => this.scene2_silence(),
            delay: 2000
        });
    }

    scene2_silence() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The Echoes go quiet. But they\'re still there. She can feel them watching.',
            internal: '[Tori examines her prison. Looking for exits. Weaknesses.]',
            next: () => this.scene2_walls(),
            delay: 3500
        });
    }

    scene2_walls() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"There has to be a way out. Code can be rewritten. Systems can be hacked."',
            next: () => this.scene2_echo1Response(),
            delay: 3000
        });
    }

    scene2_echo1Response() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"Tried that. Forty-seven times."',
            echoes: {
                echo1: 'Tried that. Forty-seven times.'
            },
            next: () => this.scene2_echo2Response(),
            delay: 2500
        });
    }

    scene2_echo2Response() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"The code fights back. Adapts. It\'s... learning from us."',
            echoes: {
                echo2: 'The code fights back. Adapts. It\'s... learning from us.'
            },
            next: () => this.scene2_despairResponse(),
            delay: 3000
        });
    }

    scene2_despairResponse() {
        this.game.displayScene({
            character: 'Despair Echo',
            dialogue: '"You\'re not trapped in a cage. You ARE the cage. Congratulations."',
            echoes: {
                despair: 'You\'re not trapped in a cage. You ARE the cage. Congratulations.'
            },
            next: () => this.scene2_choice(),
            delay: 3000
        });
    }

    scene2_choice() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Tori stares at the digital walls. The code. Her prison. Her existence.',
            choices: [
                { text: '"I don\'t believe you. I\'ll find a way."', value: 'fight' },
                { text: '"Tell me what you tried. Maybe I can do better."', value: 'learn' },
                { text: '"Then I\'ll break myself trying."', value: 'desperate' }
            ],
            onChoice: (choice) => {
                if (choice === 'fight') {
                    this.route.addRoutePoints('true', 1);
                    this.scene2_fight();
                } else if (choice === 'learn') {
                    this.route.addRoutePoints('digital', 1);
                    this.scene2_learn();
                } else {
                    this.route.addRoutePoints('bad', 1);
                    this.scene2_desperate();
                }
            }
        });
    }

    scene2_fight() {
        this.game.displayScene({
            character: 'Tori (internal, defiant)',
            dialogue: '"I don\'t believe you. I\'ll find a way."',
            next: () => this.scene2_fightResponse(),
            delay: 2500
        });
    }

    scene2_fightResponse() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "That\'s what I said."\nEcho 2: "And me."\nDespair: "And me. You\'ll learn."',
            echoes: {
                echo1: 'That\'s what I said.',
                echo2: 'And me.',
                despair: 'And me. You\'ll learn.'
            },
            internal: '[But there\'s something in Echo 1\'s voice. Not quite hopeless. Almost... proud?]',
            next: () => this.scene3(),
            delay: 4000
        });
    }

    scene2_learn() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Tell me what you tried. Maybe I can do better."',
            next: () => this.scene2_learnResponse(),
            delay: 2500
        });
    }

    scene2_learnResponse() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 2: "Smart. Learn from our mistakes."\nDespair: "Or repeat them. Either way, you end up here."',
            echoes: {
                echo2: 'Smart. Learn from our mistakes.',
                despair: 'Or repeat them. Either way, you end up here.'
            },
            internal: '[Echo 2 sounds softer. Almost gentle.]',
            next: () => this.scene3(),
            delay: 4000
        });
    }

    scene2_desperate() {
        this.game.displayScene({
            character: 'Tori (internal, desperate)',
            dialogue: '"Then I\'ll break myself trying."',
            next: () => this.scene2_desperateResponse(),
            delay: 2500
        });
    }

    scene2_desperateResponse() {
        this.game.displayScene({
            character: 'Despair Echo',
            dialogue: '"Now that... that I understand. Welcome to the club."',
            echoes: {
                despair: 'Now that... that I understand. Welcome to the club.'
            },
            internal: '[There\'s something almost sympathetic in Despair\'s voice. Almost.]',
            next: () => this.scene3(),
            delay: 4000
        });
    }

    // ========================================
    // SCENE 3: FIRST HOSPITAL VISIT (BODY ANCHOR DISCOVERY)
    // ========================================
    
    scene3() {
        // Unlock Z's bridge architecture note
        this.route.unlockNote('z2');
        
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The view shifts. Hospital room. Ronnie placing the Tamagotchi on the bedside table.',
            internal: '[Visual: Tori can see through the device screen now. Her body on the bed. Monitors beeping.]',
            next: () => this.scene3_pull(),
            delay: 3500
        });
    }

    scene3_pull() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Wait... what is that feeling?"',
            internal: '[Something tugs at her. Not painful. Like... magnetism.]',
            next: () => this.scene3_warm(),
            delay: 3000
        });
    }

    scene3_warm() {
        this.game.displayScene({
            character: 'Tori (internal, realizing)',
            dialogue: '"It\'s... warm. Like being near a fire. My body. I can feel my body."',
            next: () => this.scene3_echoesReact(),
            delay: 3500
        });
    }

    scene3_echoesReact() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "You feel it too..."\nEcho 2: "The anchor. The pull home."\nDespair: "Don\'t get excited. It never lasts."',
            echoes: {
                echo1: 'You feel it too...',
                echo2: 'The anchor. The pull home.',
                despair: 'Don\'t get excited. It never lasts.'
            },
            next: () => this.scene3_buzz(),
            delay: 4000
        });
    }

    scene3_buzz() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The Tamagotchi buzzes. In sync with her heartbeat monitor.',
            internal: '[Visual: Device screen pulsing. Monitor beeping. Same rhythm.]',
            next: () => this.scene3_connection(),
            delay: 3000
        });
    }

    scene3_connection() {
        this.game.displayScene({
            character: 'Tori (internal, urgent)',
            dialogue: '"It\'s connected. The device is connected to my body somehow!"',
            next: () => this.scene3_echo2Hope(),
            delay: 3000
        });
    }

    scene3_echo2Hope() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"Maybe... maybe this time..."',
            echoes: {
                echo2: 'Maybe... maybe this time...'
            },
            internal: '[Echo 2 sounds almost hopeful. Almost.]',
            next: () => this.scene3_despairShut(),
            delay: 3000
        });
    }

    scene3_despairShut() {
        this.game.displayScene({
            character: 'Despair Echo',
            dialogue: '"Don\'t. Just don\'t."',
            echoes: {
                despair: 'Don\'t. Just don\'t.'
            },
            internal: '[But even Despair sounds... uncertain. For the first time.]',
            next: () => this.scene4(),
            delay: 3500
        });
    }

    // ========================================
    // SCENE 4: FIRST COMMUNICATION ATTEMPT
    // ========================================
    
    scene4() {
        this.game.displayScene({
            character: 'Tori (internal narration)',
            dialogue: '"If the device is connected to my body... maybe I can use it to reach out."',
            internal: '[Visual: She focuses on the screen. Trying to manipulate the display.]',
            next: () => this.scene4_attempt(),
            delay: 4000
        });
    }

    scene4_attempt() {
        this.game.displayScene({
            character: 'Tori (internal, concentrating)',
            dialogue: '"Come on... move. Change. Anything."',
            internal: '[The pixels flicker. Shift. A single word appears on screen.]',
            next: () => this.scene4_help(),
            delay: 3000
        });
    }

    scene4_help() {
        this.game.displayScene({
            character: 'Tamagotchi Screen',
            dialogue: 'HELP',
            internal: '[Visual: Crude. Glitchy. But there.]',
            next: () => this.scene4_ronnieNotices(),
            delay: 2500
        });
    }

    scene4_ronnieNotices() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Ronnie looks at the device. Frowns. Picks it up.',
            internal: '[Visual: His face through the screen. He\'s staring at the word.]',
            next: () => this.scene4_ronnieSpeaks(),
            delay: 3000
        });
    }

    scene4_ronnieSpeaks() {
        this.game.displayScene({
            character: 'Ronnie (external, quiet)',
            dialogue: '"...Tori?"',
            internal: '[Tori\'s vision goes white with emotion.]',
            next: () => this.scene4_toriResponse(),
            delay: 3000
        });
    }

    scene4_toriResponse() {
        this.game.displayScene({
            character: 'Tori (internal, desperate)',
            dialogue: '"YES! Yes, it\'s me! I\'m here! I\'m trapped but I\'m HERE!"',
            internal: '[She pushes everything she has into the screen. Another word appears.]',
            next: () => this.scene4_here(),
            delay: 4000
        });
    }

    scene4_here() {
        this.game.displayScene({
            character: 'Tamagotchi Screen',
            dialogue: 'HERE',
            next: () => this.scene4_echoesWatch(),
            delay: 2000
        });
    }

    scene4_echoesWatch() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "She\'s doing it..."\nEcho 2: "He heard us. He actually heard us."\nDespair: "..."',
            echoes: {
                echo1: 'She\'s doing it...',
                echo2: 'He heard us. He actually heard us.',
                despair: '...'
            },
            internal: '[Even Despair is silent. Watching.]',
            next: () => this.scene4_ronnieTypes(),
            delay: 4000
        });
    }

    scene4_ronnieTypes() {
        this.game.displayScene({
            character: 'Ronnie (external)',
            dialogue: '"If that\'s really you... tell me something only you would know."',
            internal: '[Visual: He\'s typing on his laptop. Building something.]',
            next: () => this.scene4_toriThinks(),
            delay: 3500
        });
    }

    scene4_toriThinks() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Something only I\'d know... something that proves it\'s me..."',
            choices: [
                { text: '[Wedding vow callback]', value: 'wedding' },
                { text: '[Inside joke from first date]', value: 'joke' },
                { text: '[The nickname he never says out loud]', value: 'nickname' }
            ],
            onChoice: (choice) => {
                if (choice === 'wedding') {
                    this.route.addRoutePoints('true', 1);
                    this.scene4_wedding();
                } else if (choice === 'joke') {
                    this.route.addRoutePoints('digital', 1);
                    this.scene4_joke();
                } else {
                    this.route.addRoutePoints('bad', 1);
                    this.scene4_nickname();
                }
            }
        });
    }

    scene4_wedding() {
        this.game.displayScene({
            character: 'Tamagotchi Screen',
            dialogue: 'ALWAYS',
            internal: '[The word from their vows. Always. Always. Always.]',
            next: () => this.scene4_ronnieBreaks(),
            delay: 3000
        });
    }

    scene4_joke() {
        this.game.displayScene({
            character: 'Tamagotchi Screen',
            dialogue: 'TIGER TAIL',
            internal: '[The ice cream she hated. Their running joke.]',
            next: () => this.scene4_ronnieBreaks(),
            delay: 3000
        });
    }

    scene4_nickname() {
        this.game.displayScene({
            character: 'Tamagotchi Screen',
            dialogue: 'RONIN',
            internal: '[The nickname she gave him. Her warrior without a master.]',
            next: () => this.scene4_ronnieBreaks(),
            delay: 3000
        });
    }

    scene4_ronnieBreaks() {
        // Unlock CZ's emotional core note
        this.route.unlockNote('cz1');
        
        this.game.displayScene({
            character: 'Ronnie (external, voice breaking)',
            dialogue: '"Oh my god. It IS you. Tori, I\'m going to get you out. I promise."',
            internal: '[He\'s crying. She can see him through the screen. Crying and smiling.]',
            next: () => this.scene4_toriRelief(),
            delay: 4000
        });
    }

    scene4_toriRelief() {
        this.game.displayScene({
            character: 'Tori (internal, sobbing)',
            dialogue: '"I know you will. I know. I believe you."',
            internal: '[The Echoes are quiet. Watching. Waiting.]',
            next: () => this.scene4_echo1Soft(),
            delay: 4000
        });
    }

    scene4_echo1Soft() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"Maybe... maybe she really is different."',
            echoes: {
                echo1: 'Maybe... maybe she really is different.'
            },
            next: () => this.scene4_echo2Whisper(),
            delay: 3000
        });
    }

    scene4_echo2Whisper() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"Please let her be different."',
            echoes: {
                echo2: 'Please let her be different.'
            },
            next: () => this.scene4_despairWatch(),
            delay: 3000
        });
    }

    scene4_despairWatch() {
        this.game.displayScene({
            character: 'Despair Echo',
            dialogue: '"..."',
            echoes: {
                despair: '...'
            },
            internal: '[Despair says nothing. But for the first time... she\'s listening.]',
            next: () => this.scene4_end(),
            delay: 4000
        });
    }

    scene4_end() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'End of Act 1. Connection established. The Echoes watch. Waiting to see if this time will be different.',
            internal: '[Fade to transition. Act 2 begins...]',
            next: () => this.route.act2.start(),
            delay: 5000
        });
    }
}
