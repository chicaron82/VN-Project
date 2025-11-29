// ========================================
// TORI'S ROUTE - ACT 2 (V4 - VISUAL INTEGRATION)
// Memory Corruption & Body Anchor Discovery
// SPRITES & BACKGROUNDS INTEGRATED
// ECHO SPRITES FIXED: RIGHT position, three-echoes-sprite.png
// FIXED: getTetherState() call now works properly
// ========================================

class ToriAct2 {
    constructor(route) {
        this.route = route;
        this.game = route.game;
    }
    
    start() {
        // Unblock saves - Tori proved Despair wrong
        this.game.saveManager.unblockSaves();

        // Echo growth: Act 2 - Hope is rising
        this.game.setEchoGrowthStage('act2');

        this.tori_act2_01_start();
    }
    
    // ========================================
    // BEAT 1: ICE CREAM DATE
    // Memory Corruption - System Takeover
    // (Originally Beat 2)
    // ========================================
    
    tori_act2_01_start() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Digital park scene. Pixelated cherry blossoms. Tori and Ronnie\'s sprites walking together.',
            internal: '[Visual: First "date" in the digital space. Ronnie coded a scene for them.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_02_icecream(),
            delay: 3500
        }, 'tori_act2_01_start');
    }

    tori_act2_02_icecream() {
        this.game.displayScene({
            character: 'Ronnie (sprite)',
            dialogue: '"I coded in your favorite. Chocolate chip ice cream."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            choices: [
                { text: 'Thank him (That\'s sweet!)', value: 'thanks' },
                { text: 'Be playful (You remembered!)', value: 'playful' },
                { text: 'Ask for Tiger Tail instead', value: 'tiger_tail' }
            ],
            onChoice: (playerChoice) => {
                // Store what player WANTED to say
                this.playerIntendedChoice = playerChoice;
                // But Despair forces Tiger Tail
                this.tori_act2_03_despairoverride();
            },
            delay: 3000
        }, 'tori_act2_02_icecream');
    }
    
    tori_act2_03_despairoverride() {
        // First: Show what player INTENDED to choose (if not Tiger Tail)
        if (this.playerIntendedChoice !== 'tiger_tail') {
            this.game.displayScene({
                character: 'Narration',
                dialogue: '',
                internal: '[She opens her mouth to respond... but the words that come out aren\'t hers.]',
                background: 'assets/digitalSpace.png',
                sprites: {
                    left: 'assets/tori-sprite.png',
                    right: 'assets/ronnie-sprite.png'
                },
                next: () => this.tori_act2_04_hijackedresponse(),
                delay: 2000
            }, 'tori_act2_03_despairoverride');
        } else {
            // Player chose Tiger Tail - skip hijack narration
            this.tori_act2_04_hijackedresponse();
        }
    }
    
    tori_act2_04_hijackedresponse() {
        // Show what Tori actually says (overridden by Despair)
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Wait... Tiger Tail. I want Tiger Tail."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_05_torirealization(),
            delay: 2500
        }, 'tori_act2_04_hijackedresponse');
    }
    
    tori_act2_05_torirealization() {
        // Tori realizes she didn't say what she meant
        this.game.displayScene({
            character: 'Tori (internal, confused)',
            dialogue: '"What? No—that\'s not what I meant to say! I hate Tiger Tail!"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_06_confusion(),
            delay: 3000
        }, 'tori_act2_05_torirealization');
    }

    tori_act2_06_confusion() {
        this.game.displayScene({
            character: 'Ronnie (sprite, concerned)',
            dialogue: '"Tiger Tail? But... you always said you hated that flavor."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_07_echoesreact(),
            delay: 3000
        }, 'tori_act2_06_confusion');
    }

    tori_act2_07_echoesreact() {
        // Unlock CZ's memory degradation horror note
        this.route.unlockNote('cz2');

        // Unlock Z's Cassandra framework note - Tori "knew" something she shouldn't
        this.route.unlockNote('z3');

        // Unlock Z's Echo timeline theory - all three Echoes speaking reveals their nature
        this.route.unlockNote('z6');

        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "Oh no..."\nEcho 2: "Not yet. Please not yet."\nDespair: "There it is. Memory corruption. Your mind\'s breaking down."',            background: 'assets/digitalSpace.png',
            sprites: {
                right: 'echoes'
            },
            next: () => this.tori_act2_08_systemtakeover(),
            delay: 4000
        }, 'tori_act2_07_echoesreact');
    }

    tori_act2_08_systemtakeover() {
        this.game.displayScene({
            character: 'Tori (sprite, voice not hers)',
            dialogue: '"Tiger Tail sounds perfect!"',
            internal: '[Her sprite spoke. But she didn\'t say that. The SYSTEM did.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_09_torihorror(),
            delay: 3000,
            style: 'critical'
        }, 'tori_act2_08_systemtakeover');
    }

    tori_act2_09_torihorror() {
        this.game.displayScene({
            character: 'Tori (internal, panicking)',
            dialogue: '"That wasn\'t me! I didn\'t say that!"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_10_freeze(),
            delay: 2500
        }, 'tori_act2_09_torihorror');
    }

    tori_act2_10_freeze() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Her sprite freezes mid-laugh. System dialogue box flickers. Then she\'s back. Ronnie looks concerned.',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_11_ronnienotice(),
            delay: 3500
        }, 'tori_act2_10_freeze');
    }

    tori_act2_11_ronnienotice() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Tori? Not againâ€""',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_12_choice(),
            delay: 2000
        }, 'tori_act2_11_ronnienotice');
    }

    tori_act2_12_choice() {
        this.game.displayScene({
            character: 'Tori (typing frantically)',
            dialogue: '"I blacked out. What just happened?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            choices: [
                { text: '[Tell him the truth: memory corruption]', value: 'truth' },
                { text: '[Downplay it: just a glitch]', value: 'downplay' },
                { text: '[Panic: I\'m breaking apart]', value: 'panic' }
            ],
            onChoice: (choice) => {
                if (choice === 'truth') {
                    this.route.addRoutePoints('true', 1);
                    this.tori_act2_13_truth();
                } else if (choice === 'downplay') {
                    this.route.addRoutePoints('digitalForever', 1);
                    this.tori_act2_14_downplay();
                } else {
                    this.route.addRoutePoints('bad', 1);
                    this.tori_act2_15_panic();
                }
            }
        }, 'tori_act2_12_choice');
    }

    tori_act2_13_truth() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"My memories are corrupting. The system took over my voice. I\'m scared."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_16_hospital1(),
            delay: 3000
        }, 'tori_act2_13_truth');
    }

    tori_act2_14_downplay() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"Just a glitch. I\'m fine. Keep going."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_16_hospital1(),
            delay: 3000
        }, 'tori_act2_14_downplay');
    }

    tori_act2_15_panic() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"I\'m breaking apart. I can feel it. I\'m losing pieces of myself."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_16_hospital1(),
            delay: 3000
        }, 'tori_act2_15_panic');
    }

    // ========================================
    // BEAT 2: HOSPITAL VISIT #1
    // Body Anchor - Dismissed
    // (Originally Beat 3)
    // ========================================
    
    tori_act2_16_hospital1() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Hospital room. Ronnie places the Tamagotchi on her bedside table.',
            internal: '[Visual: Through device screen - her body on the bed. Monitors beeping.]',
            background: 'hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_17_warmth(),
            delay: 3500
        }, 'tori_act2_16_hospital1');
    }

    tori_act2_17_warmth() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"That feeling again... warmth. The pull toward my body."',
            background: 'hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_18_buzz(),
            delay: 3000
        }, 'tori_act2_17_warmth');
    }

    tori_act2_18_buzz() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The Tamagotchi buzzes. Synced with her heartbeat monitor.',
            internal: '[Same rhythm. Same pulse.]',
            background: 'hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_19_ronnienotice(),
            delay: 3000,
            style: 'critical'
        }, 'tori_act2_18_buzz');
    }

    tori_act2_19_ronnienotice() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Weird. Battery must be dying."',
            internal: '[He dismisses it. Doesn\'t see the pattern yet.]',
            background: 'hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_20_echoesknow(),
            delay: 3000
        }, 'tori_act2_19_ronnienotice');
    }

    tori_act2_20_echoesknow() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "He felt it too. The buzz."\nEcho 2: "But he doesn\'t understand what it means."\nDespair: "He never understood. Not until it was too late."',            background: 'assets/digitalSpace.png',
            sprites: {
                right: 'echoes'
            },
            next: () => this.tori_act2_21_digitalmaze(),
            delay: 4000
        }, 'tori_act2_20_echoesknow');
    }

    // ========================================
    // BEAT 3: DIGITAL MAZE BREAKDOWN
    // Corruption Intensifies
    // (Originally Beat 4)
    // ========================================
    
    tori_act2_21_digitalmaze() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Back in the digital space. A simple maze game Ronnie coded. "Think fast" gameplay.',
            internal: '[Visual: Sprite-Tori navigating a pixelated maze. Cute and casual.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_22_maze(),
            delay: 3500
        }, 'tori_act2_21_digitalmaze');
    }

    tori_act2_22_maze() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Left or right?"',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_23_confusion(),
            delay: 2000
        }, 'tori_act2_22_maze');
    }

    tori_act2_23_confusion() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Wait... which way did we come from? I can\'t remember..."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_24_systemtakeover(),
            delay: 3000
        }, 'tori_act2_23_confusion');
    }

    tori_act2_24_systemtakeover() {
        this.game.displayScene({
            character: 'Tori (sprite, automatic)',
            dialogue: '"Left!"',
            internal: '[She didn\'t choose that. The SYSTEM did. Again.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_25_wrongturn(),
            delay: 2500,
            style: 'critical'
        }, 'tori_act2_24_systemtakeover');
    }

    tori_act2_25_wrongturn() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Dead end. Ronnie backtracks. But Tori is frozen, staring at the wall.',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_26_toriinternal(),
            delay: 3000
        }, 'tori_act2_25_wrongturn');
    }

    tori_act2_26_toriinternal() {
        this.game.displayScene({
            character: 'Tori (internal, panicking)',
            dialogue: '"I\'m not controlling my sprite anymore. I\'m just... watching."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_27_echoesrespond(),
            delay: 3000
        }, 'tori_act2_26_toriinternal');
    }

    tori_act2_27_echoesrespond() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "It\'s getting worse."\nEcho 2: "The system\'s taking over."\nDespair: "You\'re becoming a passenger in your own existence."',            background: 'assets/digitalSpace.png',
            sprites: {
                right: 'echoes'
            },
            next: () => this.tori_act2_28_hospital2(),
            delay: 4000
        }, 'tori_act2_27_echoesrespond');
    }

    // ========================================
    // BEAT 4: HOSPITAL VISIT #2
    // Body Anchor - Recognition
    // (Originally Beat 5)
    // ========================================
    
    tori_act2_28_hospital2() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Hospital room again. Ronnie adjusts her blankets. The Tamagotchi is on the table.',
            internal: '[Visual: Her body. Still. Breathing. The device nearby.]',
            background: 'hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_29_feeling(),
            delay: 3500
        }, 'tori_act2_28_hospital2');
    }

    tori_act2_29_feeling() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"There it is again. That pull. That warmth. It\'s coming from my body."',
            background: 'hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_30_understanding(),
            delay: 3000
        }, 'tori_act2_29_feeling');
    }

    tori_act2_30_understanding() {
        this.game.displayScene({
            character: 'Tori (internal, realization)',
            dialogue: '"Wait... when I\'m near my body, I feel more... real. More present. The corruption slows."',
            background: 'hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_31_choice(),
            delay: 3500,
            style: 'critical'
        }, 'tori_act2_30_understanding');
    }

    tori_act2_31_choice() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"This feeling... do I tell him? Or keep searching for proof?"',
            background: 'hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            choices: [
                { text: '[Tell Ronnie about the body connection]', value: 'tell' },
                { text: '[Wait - need more proof first]', value: 'wait' }
            ],
            onChoice: (choice) => {
                if (choice === 'tell') {
                    this.route.addRoutePoints('true', 1);
                    this.tori_act2_32_tell();
                } else {
                    this.route.addRoutePoints('digitalForever', 1);
                    this.tori_act2_33_wait();
                }
            }
        }, 'tori_act2_31_choice');
    }

    tori_act2_32_tell() {
        this.game.displayScene({
            character: 'Tori (typing urgently)',
            dialogue: '"Ronnie - when you visit my body, I feel more stable. I think there\'s a connection."',
            background: 'hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_34_ronnieresponse(),
            delay: 3000
        }, 'tori_act2_32_tell');
    }

    tori_act2_33_wait() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"The maze was glitchy. System acting weird again."',
            internal: '[She hides the truth. Needs more proof.]',
            background: 'hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_34_ronnieresponse(),
            delay: 3000
        }, 'tori_act2_33_wait');
    }

    tori_act2_34_ronnieresponse() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"I\'ll keep coming. Every day. I promise."',
            background: 'hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_35_memoryfragment(),
            delay: 2500
        }, 'tori_act2_34_ronnieresponse');
    }

    // ========================================
    // BEAT 5: MEMORY FRAGMENT NIGHTMARE
    // Corruption Accelerates
    // (Originally Beat 6)
    // ========================================
    
    tori_act2_35_memoryfragment() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Digital space. A memory fragment loads. Their first date. Coffee shop.',
            internal: '[Visual: Warm lighting. Cozy scene. But the edges are glitching.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_36_memorystart(),
            delay: 3500
        }, 'tori_act2_35_memoryfragment');
    }

    tori_act2_36_memorystart() {
        this.game.displayScene({
            character: 'Ronnie (sprite, in memory)',
            dialogue: '"I can\'t believe you ordered decaf."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_37_toriblank(),
            delay: 2500
        }, 'tori_act2_36_memorystart');
    }

    tori_act2_37_toriblank() {
        this.game.displayScene({
            character: 'Tori (internal, horrified)',
            dialogue: '"I... I don\'t remember this. I don\'t remember what I said next."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_38_systemfills(),
            delay: 3000
        }, 'tori_act2_37_toriblank');
    }

    tori_act2_38_systemfills() {
        this.game.displayScene({
            character: 'Tori (sprite, voice not hers)',
            dialogue: '"[MEMORY CORRUPTED - APPROXIMATION: "You know I hate caffeine."]"',
            internal: '[The system filled in the blank. With a guess. Her memory is gone.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_39_horror(),
            delay: 4000,
            style: 'critical'
        }, 'tori_act2_38_systemfills');
    }

    tori_act2_39_horror() {
        this.game.displayScene({
            character: 'Tori (internal, breaking)',
            dialogue: '"That\'s not what I said. I don\'t know what I said. But that wasn\'t it."',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_40_echoesreact(),
            delay: 3000
        }, 'tori_act2_39_horror');
    }

    tori_act2_40_echoesreact() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "She\'s losing herself."\nEcho 2: "Piece by piece."\nDespair: "Soon there won\'t be enough left to save."',            background: 'assets/digitalSpace.png',
            sprites: {
                right: 'echoes'
            },
            next: () => this.tori_act2_41_hospital3(),
            delay: 4000
        }, 'tori_act2_40_echoesreact');
    }

    // ========================================
    // BEAT 6: HOSPITAL VISIT #3
    // Body Anchor - BREAKTHROUGH
    // (Originally Beat 7)
    // ========================================
    
    tori_act2_41_hospital3() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Hospital room. Ronnie holds her hand. The Tamagotchi buzzes loudly.',
            internal: '[Visual: Physical contact. The buzz intensifies. Synced perfectly.]',
            background: 'hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_42_connection(),
            delay: 3500
        }, 'tori_act2_41_hospital3');
    }

    tori_act2_42_connection() {
        this.game.displayScene({
            character: 'Tori (internal, CLARITY)',
            dialogue: '"OH. Oh my god. It\'s the BODY. My body is the anchor. The bridge. The connection."',
            background: 'hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_43_realization(),
            delay: 3500,
            style: 'critical'
        }, 'tori_act2_42_connection');
    }

    tori_act2_43_realization() {
        this.game.displayScene({
            character: 'Tori (internal, urgent)',
            dialogue: '"That\'s why I feel more real when he visits. Why the corruption slows. My body is keeping me tethered!"',
            background: 'hospital.png',
            sprites: {
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act2_44_echoesreact(),
            delay: 4000
        }, 'tori_act2_43_realization');
    }

    tori_act2_44_echoesreact() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 2: "She figured it out..."\nEcho 1: "Faster than we did."\nDespair: "And it won\'t matter. The body is dying. The bridge is burning."',            background: 'assets/digitalSpace.png',
            sprites: {
                right: 'echoes'
            },
            next: () => this.tori_act2_45_crisisalarm(),
            delay: 4000
        }, 'tori_act2_44_echoesreact');
    }

    // ========================================
    // BEAT 7: THE CRISIS CALL
    // Final Sabotage Attempt - Leads to Act 3
    // (Originally Beat 8)
    // ========================================
    
    tori_act2_45_crisisalarm() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Alarms. Monitors screaming. The digital space shakes.',
            internal: '[Visual: Everything glitching violently. Tori fragmenting. Tether dropping rapidly.]',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act2_46_tether(),
            delay: 3000
        }, 'tori_act2_45_crisisalarm');
    }

    tori_act2_46_tether() {
        // Crisis causes tether drop
        this.route.tetherLevel = Math.max(0, this.route.tetherLevel - 15);
        this.route.updateTether(-15, 'Crisis - monitors screaming');

        this.game.displayScene({
            character: 'System',
            dialogue: '[COHERENCE DROPPING: -15%]',
            internal: '[The crisis is draining her. Hold on!]',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act2_47_tori(),
            delay: 2000,
            style: 'critical'
        }, 'tori_act2_46_tether');
    }

    tori_act2_47_tori() {
        this.game.displayScene({
            character: 'Tori (internal, pained)',
            dialogue: '"It\'s too dark... I can\'t hold on..."',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act2_48_despairattempt(),
            delay: 3000
        }, 'tori_act2_47_tori');
    }

    tori_act2_48_despairattempt() {
        // Unlock ZR's Despair Echo origin note
        this.route.unlockNote('zr2');

        const tetherState = this.route.getTetherState();

        if (tetherState === 'despair') {
            // LOW TETHER: Despair can lock out the "fight" option
            this.game.displayScene({
                character: 'Despair Echo (DOMINANT - forcing)',
                dialogue: '"Let go. MAKE him let go. Tell him to upload. Trap yourself forever. It\'s kinder than watching him fail. YOU HAVE NO CHOICE."',                internal: '[Despair is overwhelming. She\'s taking control. The fight option feels... blocked.]',
                background: 'assets/digitalSpace.png',
                sprites: {
                    right: 'echoes'
                },
                next: () => this.tori_act2_49_choicelocked(),
                delay: 4000
            }, 'tori_act2_48_despairattempt');
        } else {
            // MEDIUM/HIGH TETHER: All options available
            this.game.displayScene({
                character: 'Despair Echo (attempting)',
                dialogue: '"Let go. Make him let go. Tell him to upload. It\'s kinder than watching him fail."',                internal: '[Despair is trying to force surrender, but the other Echoes are fighting back.]',
                background: 'assets/digitalSpace.png',
                sprites: {
                    right: 'echoes'
                },
                next: () => this.tori_act2_50_choice(),
                delay: 4000
            }, 'tori_act2_48_despairattempt');
        }
    }

    tori_act2_49_choicelocked() {
        // LOW TETHER: "Fight" option is grayed out/locked
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Do I fight Despair... wait, I can\'t... she\'s too strong..."',
            background: 'assets/digitalSpace.png',
            choices: [
                { text: '[Fight: "No. I trust him."] (LOCKED - Tether too low)', value: 'locked', disabled: true },
                { text: '[Accept: "Maybe she\'s right..."]', value: 'accept' },
                { text: '[Silent: Just hold on.]', value: 'silent' }
            ],
            onChoice: (choice) => {
                if (choice === 'locked') {
                    // This shouldn't trigger, but just in case
                    this.tori_act2_52_accept();
                } else if (choice === 'accept') {
                    this.route.addRoutePoints('bad', 2);
                    this.tori_act2_52_accept();
                } else {
                    this.route.addRoutePoints('digitalForever', 2);
                    this.tori_act2_53_silent();
                }
            }
        }, 'tori_act2_49_choicelocked');
    }

    tori_act2_50_choice() {
        // NORMAL: All options available
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Do I fight Despair... or let her win?"',
            background: 'assets/digitalSpace.png',
            choices: [
                { text: '[Fight: "No. I trust him."]', value: 'fight' },
                { text: '[Accept: "Maybe she\'s right..."]', value: 'accept' },
                { text: '[Silent: Just hold on.]', value: 'silent' }
            ],
            onChoice: (choice) => {
                if (choice === 'fight') {
                    this.route.addRoutePoints('true', 2);
                    this.tori_act2_51_fight();
                } else if (choice === 'accept') {
                    this.route.addRoutePoints('bad', 2);
                    this.tori_act2_52_accept();
                } else {
                    this.route.addRoutePoints('digitalForever', 2);
                    this.tori_act2_53_silent();
                }
            }
        }, 'tori_act2_50_choice');
    }

    tori_act2_51_fight() {
        // Boost tether for resisting Despair
        this.route.tetherLevel = Math.min(100, this.route.tetherLevel + 10);
        this.route.updateTether(10, 'Fighting Despair - defiance');

        this.game.displayScene({
            character: 'Tori (internal, defiant)',
            dialogue: '"No. I trust him. He\'ll find the way."',
            internal: '[COHERENCE BOOST: +10%]\n[She fought back! Despair recoils.]',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act2_54_echoesreact(),
            delay: 3000
        }, 'tori_act2_51_fight');
    }

    tori_act2_52_accept() {
        // Drop tether for giving in
        this.route.tetherLevel = Math.max(0, this.route.tetherLevel - 10);
        this.route.updateTether(-10, 'Accepting Despair - giving in');

        this.game.displayScene({
            character: 'Tori (internal, broken)',
            dialogue: '"Maybe she\'s right... maybe I should just let go..."',
            internal: '[COHERENCE DROP: -10%]\n[Despair grins. Victory.]',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act2_54_echoesreact(),
            delay: 3000
        }, 'tori_act2_52_accept');
    }

    tori_act2_53_silent() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"..."',
            internal: '[Just holding on. Just surviving. Tether holds steady.]',
            background: 'assets/digitalSpace.png',
            next: () => this.tori_act2_54_echoesreact(),
            delay: 3000
        }, 'tori_act2_53_silent');
    }

    tori_act2_54_echoesreact() {
        const tetherState = this.route.getTetherState();

        if (tetherState === 'despair') {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Despair: "Good. Good. Now you understand."\nEcho 1: (fading) "No..."\nEcho 2: (barely there) "Please..."',                internal: '[Whiteout. Despair dominant. Everything breaks. Act 3 begins...]',
                background: 'assets/digitalSpace.png',
                sprites: {
                    right: 'echoes'
                },
                next: () => this.route.act3.start(),
                delay: 5000
            }, 'tori_act2_54_echoesreact_despair');
        } else if (tetherState === 'balanced') {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Echo 1: "She\'s still fighting."\nEcho 2: "Stronger than we were."\nDespair: "For now."',                internal: '[Whiteout. The battle continues. Act 3 begins...]',
                background: 'assets/digitalSpace.png',
                sprites: {
                    right: 'echoes'
                },
                next: () => this.route.act3.start(),
                delay: 5000
            }, 'tori_act2_54_echoesreact_balanced');
        } else {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Echo 1: "YES! That\'s it!"\nEcho 2: "She can do this. She really can."\nDespair: "...We\'ll see."',                internal: '[Whiteout. Tori holds strong. Act 3 begins...]',
                background: 'assets/digitalSpace.png',
                sprites: {
                    right: 'echoes'
                },
                next: () => this.route.act3.start(),
                delay: 5000
            }, 'tori_act2_54_echoesreact_strong');
        }
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToriAct2;
}
