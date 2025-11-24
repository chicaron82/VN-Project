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
        this.beat1();
    }
    
    // ========================================
    // BEAT 1: ICE CREAM DATE
    // Memory Corruption - System Takeover
    // (Originally Beat 2)
    // ========================================
    
    beat1() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Digital park scene. Pixelated cherry blossoms. Tori and Ronnie\'s sprites walking together.',
            internal: '[Visual: First "date" in the digital space. Ronnie coded a scene for them.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat1_iceCream(),
            delay: 3500
        }, 'beat1');
    }

    beat1_iceCream() {
        this.game.displayScene({
            character: 'Ronnie (sprite)',
            dialogue: '"I coded in your favorite. Chocolate chip ice cream."',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat1_toriHesitate(),
            delay: 3000
        }, 'beat1_iceCream');
    }

    beat1_toriHesitate() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Wait... Tiger Tail. I want Tiger Tail."',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat1_confusion(),
            delay: 2500
        }, 'beat1_toriHesitate');
    }

    beat1_confusion() {
        this.game.displayScene({
            character: 'Tori (internal, confused)',
            dialogue: '"Where did that come from? I hate Tiger Tail."',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat1_echoesReact(),
            delay: 3000
        }, 'beat1_confusion');
    }

    beat1_echoesReact() {
        // Unlock CZ's memory degradation horror note
        this.route.unlockNote('cz2');
        
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "Oh no..."\nEcho 2: "Not yet. Please not yet."\nDespair: "There it is. Memory corruption. Your mind\'s breaking down."',            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'three-echoes-sprite.png'
            },
            next: () => this.beat1_systemTakeover(),
            delay: 4000
        }, 'beat1_echoesReact');
    }

    beat1_systemTakeover() {
        this.game.displayScene({
            character: 'Tori (sprite, voice not hers)',
            dialogue: '"Tiger Tail sounds perfect!"',
            internal: '[Her sprite spoke. But she didn\'t say that. The SYSTEM did.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat1_toriHorror(),
            delay: 3000,
            style: 'critical'
        }, 'beat1_systemTakeover');
    }

    beat1_toriHorror() {
        this.game.displayScene({
            character: 'Tori (internal, panicking)',
            dialogue: '"That wasn\'t me! I didn\'t say that!"',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat1_freeze(),
            delay: 2500
        }, 'beat1_toriHorror');
    }

    beat1_freeze() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Her sprite freezes mid-laugh. System dialogue box flickers. Then she\'s back. Ronnie looks concerned.',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat1_ronnieNotice(),
            delay: 3500
        }, 'beat1_freeze');
    }

    beat1_ronnieNotice() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Tori? Not againâ€”"',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat1_choice(),
            delay: 2000
        }, 'beat1_ronnieNotice');
    }

    beat1_choice() {
        this.game.displayScene({
            character: 'Tori (typing frantically)',
            dialogue: '"I blacked out. What just happened?"',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            choices: [
                { text: '[Tell him the truth: memory corruption]', value: 'truth' },
                { text: '[Downplay it: just a glitch]', value: 'downplay' },
                { text: '[Panic: I\'m breaking apart]', value: 'panic' }
            ],
            onChoice: (choice) => {
                if (choice === 'truth') {
                    this.route.addRoutePoints('true', 1);
                    this.beat1_truth();
                } else if (choice === 'downplay') {
                    this.route.addRoutePoints('digitalForever', 1);
                    this.beat1_downplay();
                } else {
                    this.route.addRoutePoints('bad', 1);
                    this.beat1_panic();
                }
            }
        }, 'beat1_choice');
    }

    beat1_truth() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"My memories are corrupting. The system took over my voice. I\'m scared."',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat2(),
            delay: 3000
        }, 'beat1_truth');
    }

    beat1_downplay() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"Just a glitch. I\'m fine. Keep going."',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat2(),
            delay: 3000
        }, 'beat1_downplay');
    }

    beat1_panic() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"I\'m breaking apart. I can feel it. I\'m losing pieces of myself."',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat2(),
            delay: 3000
        }, 'beat1_panic');
    }

    // ========================================
    // BEAT 2: HOSPITAL VISIT #1
    // Body Anchor - Dismissed
    // (Originally Beat 3)
    // ========================================
    
    beat2() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Hospital room. Ronnie places the Tamagotchi on her bedside table.',
            internal: '[Visual: Through device screen - her body on the bed. Monitors beeping.]',
            background: 'hospital.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat2_warmth(),
            delay: 3500
        }, 'beat2');
    }

    beat2_warmth() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"That feeling again... warmth. The pull toward my body."',
            background: 'hospital.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat2_buzz(),
            delay: 3000
        }, 'beat2_warmth');
    }

    beat2_buzz() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The Tamagotchi buzzes. Synced with her heartbeat monitor.',
            internal: '[Same rhythm. Same pulse.]',
            background: 'hospital.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat2_ronnieNotice(),
            delay: 3000,
            style: 'critical'
        }, 'beat2_buzz');
    }

    beat2_ronnieNotice() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Weird. Battery must be dying."',
            internal: '[He dismisses it. Doesn\'t see the pattern yet.]',
            background: 'hospital.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat2_echoesKnow(),
            delay: 3000
        }, 'beat2_ronnieNotice');
    }

    beat2_echoesKnow() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "He felt it too. The buzz."\nEcho 2: "But he doesn\'t understand what it means."\nDespair: "He never understood. Not until it was too late."',            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'three-echoes-sprite.png'
            },
            next: () => this.beat3(),
            delay: 4000
        }, 'beat2_echoesKnow');
    }

    // ========================================
    // BEAT 3: DIGITAL MAZE BREAKDOWN
    // Corruption Intensifies
    // (Originally Beat 4)
    // ========================================
    
    beat3() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Back in the digital space. A simple maze game Ronnie coded. "Think fast" gameplay.',
            internal: '[Visual: Sprite-Tori navigating a pixelated maze. Cute and casual.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat3_maze(),
            delay: 3500
        }, 'beat3');
    }

    beat3_maze() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Left or right?"',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat3_confusion(),
            delay: 2000
        }, 'beat3_maze');
    }

    beat3_confusion() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Wait... which way did we come from? I can\'t remember..."',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat3_systemTakeover(),
            delay: 3000
        }, 'beat3_confusion');
    }

    beat3_systemTakeover() {
        this.game.displayScene({
            character: 'Tori (sprite, automatic)',
            dialogue: '"Left!"',
            internal: '[She didn\'t choose that. The SYSTEM did. Again.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat3_wrongTurn(),
            delay: 2500,
            style: 'critical'
        }, 'beat3_systemTakeover');
    }

    beat3_wrongTurn() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Dead end. Ronnie backtracks. But Tori is frozen, staring at the wall.',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat3_toriInternal(),
            delay: 3000
        }, 'beat3_wrongTurn');
    }

    beat3_toriInternal() {
        this.game.displayScene({
            character: 'Tori (internal, panicking)',
            dialogue: '"I\'m not controlling my sprite anymore. I\'m just... watching."',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat3_echoesRespond(),
            delay: 3000
        }, 'beat3_toriInternal');
    }

    beat3_echoesRespond() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "It\'s getting worse."\nEcho 2: "The system\'s taking over."\nDespair: "You\'re becoming a passenger in your own existence."',            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'three-echoes-sprite.png'
            },
            next: () => this.beat4(),
            delay: 4000
        }, 'beat3_echoesRespond');
    }

    // ========================================
    // BEAT 4: HOSPITAL VISIT #2
    // Body Anchor - Recognition
    // (Originally Beat 5)
    // ========================================
    
    beat4() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Hospital room again. Ronnie adjusts her blankets. The Tamagotchi is on the table.',
            internal: '[Visual: Her body. Still. Breathing. The device nearby.]',
            background: 'hospital.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat4_feeling(),
            delay: 3500
        }, 'beat4');
    }

    beat4_feeling() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"There it is again. That pull. That warmth. It\'s coming from my body."',
            background: 'hospital.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat4_understanding(),
            delay: 3000
        }, 'beat4_feeling');
    }

    beat4_understanding() {
        this.game.displayScene({
            character: 'Tori (internal, realization)',
            dialogue: '"Wait... when I\'m near my body, I feel more... real. More present. The corruption slows."',
            background: 'hospital.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat4_choice(),
            delay: 3500,
            style: 'critical'
        }, 'beat4_understanding');
    }

    beat4_choice() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"This feeling... do I tell him? Or keep searching for proof?"',
            background: 'hospital.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            choices: [
                { text: '[Tell Ronnie about the body connection]', value: 'tell' },
                { text: '[Wait - need more proof first]', value: 'wait' }
            ],
            onChoice: (choice) => {
                if (choice === 'tell') {
                    this.route.addRoutePoints('true', 1);
                    this.beat4_tell();
                } else {
                    this.route.addRoutePoints('digitalForever', 1);
                    this.beat4_wait();
                }
            }
        }, 'beat4_choice');
    }

    beat4_tell() {
        this.game.displayScene({
            character: 'Tori (typing urgently)',
            dialogue: '"Ronnie - when you visit my body, I feel more stable. I think there\'s a connection."',
            background: 'hospital.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat4_ronnieResponse(),
            delay: 3000
        }, 'beat4_tell');
    }

    beat4_wait() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"The maze was glitchy. System acting weird again."',
            internal: '[She hides the truth. Needs more proof.]',
            background: 'hospital.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat4_ronnieResponse(),
            delay: 3000
        }, 'beat4_wait');
    }

    beat4_ronnieResponse() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"I\'ll keep coming. Every day. I promise."',
            background: 'hospital.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat5(),
            delay: 2500
        }, 'beat4_ronnieResponse');
    }

    // ========================================
    // BEAT 5: MEMORY FRAGMENT NIGHTMARE
    // Corruption Accelerates
    // (Originally Beat 6)
    // ========================================
    
    beat5() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Digital space. A memory fragment loads. Their first date. Coffee shop.',
            internal: '[Visual: Warm lighting. Cozy scene. But the edges are glitching.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat5_memoryStart(),
            delay: 3500
        }, 'beat5');
    }

    beat5_memoryStart() {
        this.game.displayScene({
            character: 'Ronnie (sprite, in memory)',
            dialogue: '"I can\'t believe you ordered decaf."',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat5_toriBlank(),
            delay: 2500
        }, 'beat5_memoryStart');
    }

    beat5_toriBlank() {
        this.game.displayScene({
            character: 'Tori (internal, horrified)',
            dialogue: '"I... I don\'t remember this. I don\'t remember what I said next."',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat5_systemFills(),
            delay: 3000
        }, 'beat5_toriBlank');
    }

    beat5_systemFills() {
        this.game.displayScene({
            character: 'Tori (sprite, voice not hers)',
            dialogue: '"[MEMORY CORRUPTED - APPROXIMATION: "You know I hate caffeine."]"',
            internal: '[The system filled in the blank. With a guess. Her memory is gone.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat5_horror(),
            delay: 4000,
            style: 'critical'
        }, 'beat5_systemFills');
    }

    beat5_horror() {
        this.game.displayScene({
            character: 'Tori (internal, breaking)',
            dialogue: '"That\'s not what I said. I don\'t know what I said. But that wasn\'t it."',
            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat5_echoesReact(),
            delay: 3000
        }, 'beat5_horror');
    }

    beat5_echoesReact() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "She\'s losing herself."\nEcho 2: "Piece by piece."\nDespair: "Soon there won\'t be enough left to save."',            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'three-echoes-sprite.png'
            },
            next: () => this.beat6(),
            delay: 4000
        }, 'beat5_echoesReact');
    }

    // ========================================
    // BEAT 6: HOSPITAL VISIT #3
    // Body Anchor - BREAKTHROUGH
    // (Originally Beat 7)
    // ========================================
    
    beat6() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Hospital room. Ronnie holds her hand. The Tamagotchi buzzes loudly.',
            internal: '[Visual: Physical contact. The buzz intensifies. Synced perfectly.]',
            background: 'hospital.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat6_connection(),
            delay: 3500
        }, 'beat6');
    }

    beat6_connection() {
        this.game.displayScene({
            character: 'Tori (internal, CLARITY)',
            dialogue: '"OH. Oh my god. It\'s the BODY. My body is the anchor. The bridge. The connection."',
            background: 'hospital.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat6_realization(),
            delay: 3500,
            style: 'critical'
        }, 'beat6_connection');
    }

    beat6_realization() {
        this.game.displayScene({
            character: 'Tori (internal, urgent)',
            dialogue: '"That\'s why I feel more real when he visits. Why the corruption slows. My body is keeping me tethered!"',
            background: 'hospital.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'ronnie-sprite.png'
            },
            next: () => this.beat6_echoesReact(),
            delay: 4000
        }, 'beat6_realization');
    }

    beat6_echoesReact() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 2: "She figured it out..."\nEcho 1: "Faster than we did."\nDespair: "And it won\'t matter. The body is dying. The bridge is burning."',            background: 'digitalSpace.png',
            sprites: {
                left: 'tori-sprite.png',
                right: 'three-echoes-sprite.png'
            },
            next: () => this.beat7(),
            delay: 4000
        }, 'beat6_echoesReact');
    }

    // ========================================
    // BEAT 7: THE CRISIS CALL
    // Final Sabotage Attempt - Leads to Act 3
    // (Originally Beat 8)
    // ========================================
    
    beat7() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Alarms. Monitors screaming. The digital space shakes.',
            internal: '[Visual: Everything glitching violently. Tori fragmenting. Tether dropping rapidly.]',
            background: 'digitalSpace.png',
            next: () => this.beat7_tether(),
            delay: 3000
        }, 'beat7');
    }

    beat7_tether() {
        // Crisis causes tether drop
        this.route.tetherLevel = Math.max(0, this.route.tetherLevel - 15);
        this.route.updateTether(-15, 'Crisis - monitors screaming');
        
        this.game.displayScene({
            character: 'System',
            dialogue: '[COHERENCE DROPPING: -15%]',
            internal: '[The crisis is draining her. Hold on!]',
            background: 'digitalSpace.png',
            next: () => this.beat7_tori(),
            delay: 2000,
            style: 'critical'
        }, 'beat7_tether');
    }

    beat7_tori() {
        this.game.displayScene({
            character: 'Tori (internal, pained)',
            dialogue: '"It\'s too dark... I can\'t hold on..."',
            background: 'digitalSpace.png',
            next: () => this.beat7_despairAttempt(),
            delay: 3000
        }, 'beat7_tori');
    }

    beat7_despairAttempt() {
        // Unlock ZR's Despair Echo origin note
        this.route.unlockNote('zr2');
        
        const tetherState = this.route.getTetherState();
        
        if (tetherState === 'despair') {
            // LOW TETHER: Despair can lock out the "fight" option
            this.game.displayScene({
                character: 'Despair Echo (DOMINANT - forcing)',
                dialogue: '"Let go. MAKE him let go. Tell him to upload. Trap yourself forever. It\'s kinder than watching him fail. YOU HAVE NO CHOICE."',                internal: '[Despair is overwhelming. She\'s taking control. The fight option feels... blocked.]',
                background: 'digitalSpace.png',
                sprites: {
                    left: 'tori-sprite.png',
                    right: 'three-echoes-sprite.png'
                },
                next: () => this.beat7_choiceLocked(),
                delay: 4000
            }, 'beat7_despairAttempt_locked');
        } else {
            // MEDIUM/HIGH TETHER: All options available
            this.game.displayScene({
                character: 'Despair Echo (attempting)',
                dialogue: '"Let go. Make him let go. Tell him to upload. It\'s kinder than watching him fail."',                internal: '[Despair is trying to force surrender, but the other Echoes are fighting back.]',
                background: 'digitalSpace.png',
                sprites: {
                    left: 'tori-sprite.png',
                    right: 'three-echoes-sprite.png'
                },
                next: () => this.beat7_choice(),
                delay: 4000
            }, 'beat7_despairAttempt_normal');
        }
    }

    beat7_choiceLocked() {
        // LOW TETHER: "Fight" option is grayed out/locked
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Do I fight Despair... wait, I can\'t... she\'s too strong..."',
            background: 'digitalSpace.png',
            choices: [
                { text: '[Fight: "No. I trust him."] (LOCKED - Tether too low)', value: 'locked', disabled: true },
                { text: '[Accept: "Maybe she\'s right..."]', value: 'accept' },
                { text: '[Silent: Just hold on.]', value: 'silent' }
            ],
            onChoice: (choice) => {
                if (choice === 'locked') {
                    // This shouldn't trigger, but just in case
                    this.beat7_accept();
                } else if (choice === 'accept') {
                    this.route.addRoutePoints('bad', 2);
                    this.beat7_accept();
                } else {
                    this.route.addRoutePoints('digitalForever', 2);
                    this.beat7_silent();
                }
            }
        }, 'beat7_choiceLocked');
    }

    beat7_choice() {
        // NORMAL: All options available
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Do I fight Despair... or let her win?"',
            background: 'digitalSpace.png',
            choices: [
                { text: '[Fight: "No. I trust him."]', value: 'fight' },
                { text: '[Accept: "Maybe she\'s right..."]', value: 'accept' },
                { text: '[Silent: Just hold on.]', value: 'silent' }
            ],
            onChoice: (choice) => {
                if (choice === 'fight') {
                    this.route.addRoutePoints('true', 2);
                    this.beat7_fight();
                } else if (choice === 'accept') {
                    this.route.addRoutePoints('bad', 2);
                    this.beat7_accept();
                } else {
                    this.route.addRoutePoints('digitalForever', 2);
                    this.beat7_silent();
                }
            }
        }, 'beat7_choice');
    }

    beat7_fight() {
        // Boost tether for resisting Despair
        this.route.tetherLevel = Math.min(100, this.route.tetherLevel + 10);
        this.route.updateTether(10, 'Fighting Despair - defiance');
        
        this.game.displayScene({
            character: 'Tori (internal, defiant)',
            dialogue: '"No. I trust him. He\'ll find the way."',
            internal: '[COHERENCE BOOST: +10%]\n[She fought back! Despair recoils.]',
            background: 'digitalSpace.png',
            next: () => this.beat7_echoesReact(),
            delay: 3000
        }, 'beat7_fight');
    }

    beat7_accept() {
        // Drop tether for giving in
        this.route.tetherLevel = Math.max(0, this.route.tetherLevel - 10);
        this.route.updateTether(-10, 'Accepting Despair - giving in');
        
        this.game.displayScene({
            character: 'Tori (internal, broken)',
            dialogue: '"Maybe she\'s right... maybe I should just let go..."',
            internal: '[COHERENCE DROP: -10%]\n[Despair grins. Victory.]',
            background: 'digitalSpace.png',
            next: () => this.beat7_echoesReact(),
            delay: 3000
        }, 'beat7_accept');
    }

    beat7_silent() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"..."',
            internal: '[Just holding on. Just surviving. Tether holds steady.]',
            background: 'digitalSpace.png',
            next: () => this.beat7_echoesReact(),
            delay: 3000
        }, 'beat7_silent');
    }

    beat7_echoesReact() {
        const tetherState = this.route.getTetherState();
        
        if (tetherState === 'despair') {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Despair: "Good. Good. Now you understand."\nEcho 1: (fading) "No..."\nEcho 2: (barely there) "Please..."',                internal: '[Whiteout. Despair dominant. Everything breaks. Act 3 begins...]',
                background: 'digitalSpace.png',
                sprites: {
                    left: 'tori-sprite.png',
                    right: 'three-echoes-sprite.png'
                },
                next: () => this.route.act3.start(),
                delay: 5000
            }, 'beat7_echoesReact_despair');
        } else if (tetherState === 'balanced') {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Echo 1: "She\'s still fighting."\nEcho 2: "Stronger than we were."\nDespair: "For now."',                internal: '[Whiteout. The battle continues. Act 3 begins...]',
                background: 'digitalSpace.png',
                sprites: {
                    left: 'tori-sprite.png',
                    right: 'three-echoes-sprite.png'
                },
                next: () => this.route.act3.start(),
                delay: 5000
            }, 'beat7_echoesReact_balanced');
        } else {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Echo 1: "YES! That\'s it!"\nEcho 2: "She can do this. She really can."\nDespair: "...We\'ll see."',                internal: '[Whiteout. Tori holds strong. Act 3 begins...]',
                background: 'digitalSpace.png',
                sprites: {
                    left: 'tori-sprite.png',
                    right: 'three-echoes-sprite.png'
                },
                next: () => this.route.act3.start(),
                delay: 5000
            }, 'beat7_echoesReact_strong');
        }
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToriAct2;
}
