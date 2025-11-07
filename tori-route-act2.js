// ========================================
// TORI'S ROUTE - ACT 2
// Memory Corruption & Body Anchor Discovery
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
            next: () => this.beat1_iceCream(),
            delay: 3500
        });
    }

    beat1_iceCream() {
        this.game.displayScene({
            character: 'Ronnie (sprite)',
            dialogue: '"I coded in your favorite. Chocolate chip ice cream."',
            next: () => this.beat1_toriHesitate(),
            delay: 3000
        });
    }

    beat1_toriHesitate() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Wait... Tiger Tail. I want Tiger Tail."',
            next: () => this.beat1_confusion(),
            delay: 2500
        });
    }

    beat1_confusion() {
        this.game.displayScene({
            character: 'Tori (internal, confused)',
            dialogue: '"Where did that come from? I hate Tiger Tail."',
            next: () => this.beat1_echoesReact(),
            delay: 3000
        });
    }

    beat1_echoesReact() {
        // Unlock CZ's memory degradation horror note
        this.route.unlockNote('cz2');
        
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "Oh no..."\nEcho 2: "Not yet. Please not yet."\nDespair: "There it is. Memory corruption. Your mind\'s breaking down."',
            echoes: {
                echo1: 'Oh no...',
                echo2: 'Not yet. Please not yet.',
                despair: 'There it is. Memory corruption. Your mind\'s breaking down.'
            },
            next: () => this.beat1_systemTakeover(),
            delay: 4000
        });
    }

    beat1_systemTakeover() {
        this.game.displayScene({
            character: 'Tori (sprite, voice not hers)',
            dialogue: '"Tiger Tail sounds perfect!"',
            internal: '[Her sprite spoke. But she didn\'t say that. The SYSTEM did.]',
            next: () => this.beat1_toriHorror(),
            delay: 3000
        });
    }

    beat1_toriHorror() {
        this.game.displayScene({
            character: 'Tori (internal, panicking)',
            dialogue: '"That wasn\'t me! I didn\'t say that!"',
            next: () => this.beat1_freeze(),
            delay: 2500
        });
    }

    beat1_freeze() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Her sprite freezes mid-laugh. System dialogue box flickers. Then she\'s back. Ronnie looks concerned.',
            next: () => this.beat1_ronnieNotice(),
            delay: 3500
        });
    }

    beat1_ronnieNotice() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Tori? Not again—"',
            next: () => this.beat1_choice(),
            delay: 2000
        });
    }

    beat1_choice() {
        this.game.displayScene({
            character: 'Tori (typing frantically)',
            dialogue: '"I blacked out. What just happened?"',
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
        });
    }

    beat1_truth() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"My memories are corrupting. The system took over my voice. I\'m scared."',
            next: () => this.beat2(),
            delay: 3000
        });
    }

    beat1_downplay() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"Just a glitch. I\'m fine. Keep going."',
            next: () => this.beat2(),
            delay: 3000
        });
    }

    beat1_panic() {
        this.game.displayScene({
            character: 'Tori (typing)',
            dialogue: '"I\'m breaking apart. I can feel it. I\'m losing pieces of myself."',
            next: () => this.beat2(),
            delay: 3000
        });
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
            next: () => this.beat2_warmth(),
            delay: 3500
        });
    }

    beat2_warmth() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"That feeling again... warmth. The pull toward my body."',
            next: () => this.beat2_buzz(),
            delay: 3000
        });
    }

    beat2_buzz() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The Tamagotchi buzzes. Synced with her heartbeat monitor.',
            internal: '[Same rhythm. Same pulse.]',
            next: () => this.beat2_ronnieNotice(),
            delay: 3000
        });
    }

    beat2_ronnieNotice() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Weird. Battery must be dying."',
            internal: '[He dismisses it. Doesn\'t see the pattern yet.]',
            next: () => this.beat2_echoesKnow(),
            delay: 3000
        });
    }

    beat2_echoesKnow() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "He felt it too. The buzz."\nEcho 2: "But he doesn\'t understand what it means."\nDespair: "He never understood. Not until it was too late."',
            echoes: {
                echo1: 'He felt it too. The buzz.',
                echo2: 'But he doesn\'t understand what it means.',
                despair: 'He never understood. Not until it was too late.'
            },
            next: () => this.beat3(),
            delay: 4000
        });
    }

    // ========================================
    // BEAT 3: WEDDING MEMORY
    // Safe Valley
    // (Originally Beat 4)
    // ========================================
    
    beat3() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Digital recreation. Wedding reception. Pixel decorations. Dancing sprites.',
            internal: '[Visual: Ronnie coded their wedding day. Trying to give her something happy.]',
            next: () => this.beat3_dance(),
            delay: 3500
        });
    }

    beat3_dance() {
        this.game.displayScene({
            character: 'Ronnie (sprite)',
            dialogue: '"Remember this? Our first dance as husband and wife."',
            next: () => this.beat3_toriSmile(),
            delay: 3000
        });
    }

    beat3_toriSmile() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"I remember. Your hand on my waist. The way you whispered \'always\' in my ear."',
            next: () => this.beat3_echoesWatch(),
            delay: 3500
        });
    }

    beat3_echoesWatch() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 2: "This is... nice."\nEcho 1: "Quiet. Let her have this."\nDespair: "..."',
            echoes: {
                echo2: 'This is... nice.',
                echo1: 'Quiet. Let her have this.',
                despair: '...'
            },
            internal: '[Even Despair is silent. Watching the dance. Remembering.]',
            next: () => this.beat3_peaceful(),
            delay: 4000
        });
    }

    beat3_peaceful() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"For just a moment... I\'m not trapped. I\'m just... with him."',
            internal: '[A brief valley. Peace before the next glitch.]',
            next: () => this.beat4(),
            delay: 4000
        });
    }

    // ========================================
    // BEAT 4: COOKING MEMORY
    // Tether Mechanics
    // (Originally Beat 5)
    // ========================================
    
    beat4() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Cooking memory scene. Ronnie coded their kitchen. Tori\'s sprite stirring a pot.',
            internal: '[Visual: Pixel kitchen. Warm lighting.]',
            next: () => this.beat4_callback(),
            delay: 3000
        });
    }

    beat4_callback() {
        this.game.displayScene({
            character: 'Tori (sprite)',
            dialogue: '"Why am I cooking? I can\'t cook."',
            next: () => this.beat4_ronnie(),
            delay: 2500
        });
    }

    beat4_ronnie() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"I coded you that way. I know you, Miss Burnt Toast."',
            next: () => this.beat4_toriLaugh(),
            delay: 3000
        });
    }

    beat4_toriLaugh() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Shut up. Garlic bread charcoal boy."',
            internal: '[Safe valley. Callback. Moment of connection.]',
            next: () => this.beat5(),
            delay: 3000
        });
    }

    // ========================================
    // BEAT 5: NICKNAME QUIZ
    // Shared Glitch & Despair Sabotage
    // (Originally Beat 6)
    // ========================================
    
    beat5() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Pop quiz: what\'s my favorite nickname for you?"',
            next: () => this.beat5_toriThink(),
            delay: 3000
        });
    }

    beat5_toriThink() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"My favorite... it\'s..."',
            next: () => this.beat5_despairInterfere(),
            delay: 2500
        });
    }

    beat5_despairInterfere() {
        // Unlock CZ's Echo architecture note
        this.route.unlockNote('cz3');
        
        const tetherState = this.route.getTetherState();
        
        // Despair's sabotage strength depends on tether level
        if (tetherState === 'despair') {
            // LOW TETHER: Despair successfully forces wrong answer
            this.game.displayScene({
                character: 'Despair Echo (forcing through - DOMINANT)',
                dialogue: '"RONIN. Say Ronin. Twist the knife. Make him doubt. YOU CAN\'T RESIST ME."',
                echoes: {
                    despair: 'RONIN. Say Ronin. Twist the knife. Make him doubt. YOU CAN\'T RESIST ME.'
                },
                internal: '[Tether critically low. Despair overwhelming. She forces control.]',
                next: () => this.beat5_forcedBlackout(),
                delay: 3000
            });
        } else if (tetherState === 'balanced') {
            // MEDIUM TETHER: Despair attempts but can be resisted
            this.game.displayScene({
                character: 'Despair Echo (attempting interference)',
                dialogue: '"Say Ronin. Make him question everything. End this before it gets worse."',
                echoes: {
                    echo1: 'Fight her! You can resist!',
                    echo2: 'Don\'t let her control you!',
                    despair: 'Say Ronin. Make him question everything.'
                },
                internal: '[Despair is trying to sabotage, but the other Echoes are fighting back.]',
                next: () => this.beat5_resistedFreeze(),
                delay: 3500
            });
        } else {
            // HIGH TETHER: Despair is muted, attempt fails
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Echo 1: "You know the answer. Trust yourself."\nEcho 2: "He loves you. Say what\'s true."\nDespair: "..." (silenced)',
                echoes: {
                    echo1: 'You know the answer. Trust yourself.',
                    echo2: 'He loves you. Say what\'s true.',
                    despair: '...'
                },
                internal: '[Tether high. Despair cannot break through. Minor glitch only.]',
                next: () => this.beat5_minorGlitch(),
                delay: 3500
            });
        }
    }

    beat5_forcedBlackout() {
        // Low tether - Despair wins, forces wrong answer
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Tori freezes. Eyes blank. System takes control. She says the wrong name.',
            internal: '[Despair forced the sabotage. Tether was too low to resist.]',
            next: () => this.beat5_aware(),
            delay: 3500
        });
    }

    beat5_resistedFreeze() {
        // Medium tether - Brief blackout but recovers
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Tori freezes mid-laugh. System dialogue box flickers. She fights back, regains control.',
            internal: '[She resisted! Despair\'s attempt failed. Ronnie looks concerned but not scared.]',
            next: () => this.beat5_aware(),
            delay: 3500
        });
    }

    beat5_minorGlitch() {
        // High tether - Barely a hiccup
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Slight pixel flicker. Nothing more. She answers correctly without issue.',
            internal: '[Despair couldn\'t get through. Tether held strong.]',
            next: () => this.beat5_aware(),
            delay: 3000
        });
    }

    beat5_aware() {
        const tetherState = this.route.getTetherState();
        
        if (tetherState === 'despair') {
            this.game.displayScene({
                character: 'Tori (internal, shaken)',
                dialogue: '"I... I lost control completely. Despair is too strong. I can barely hold on."',
                next: () => this.beat5_echoes(),
                delay: 3000
            });
        } else if (tetherState === 'balanced') {
            this.game.displayScene({
                character: 'Tori (internal, shaken)',
                dialogue: '"I blacked out again. But I fought back. I\'m still here."',
                next: () => this.beat5_echoes(),
                delay: 3000
            });
        } else {
            this.game.displayScene({
                character: 'Tori (internal, determined)',
                dialogue: '"That was close. But I held on. Despair can\'t break me."',
                next: () => this.beat5_echoes(),
                delay: 3000
            });
        }
    }

    beat5_echoes() {
        const tetherState = this.route.getTetherState();
        
        if (tetherState === 'despair') {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Despair: "See? I WIN. I always win. You should\'ve listened."\nEcho 1: (barely audible) "She\'s... still fighting..."\nEcho 2: (faint) "Please hold on..."',
                echoes: {
                    despair: 'See? I WIN. I always win. You should\'ve listened.',
                    echo1: '(barely audible) She\'s... still fighting...',
                    echo2: '(faint) Please hold on...'
                },
                internal: '[Despair is overwhelming. The other Echoes are fading.]',
                next: () => this.beat6(),
                delay: 4000
            });
        } else if (tetherState === 'balanced') {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Echo 1: "She fought back. That\'s new."\nEcho 2: "Despair is getting stronger though."\nDespair: "Next time. Next time I\'ll break through."',
                echoes: {
                    echo1: 'She fought back. That\'s new.',
                    echo2: 'Despair is getting stronger though.',
                    despair: 'Next time. Next time I\'ll break through.'
                },
                next: () => this.beat6(),
                delay: 4000
            });
        } else {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Echo 1: "That\'s how it\'s done!"\nEcho 2: "She\'s stronger than we were."\nDespair: "...She got lucky. Won\'t last."',
                echoes: {
                    echo1: 'That\'s how it\'s done!',
                    echo2: 'She\'s stronger than we were.',
                    despair: '...She got lucky. Won\'t last.'
                },
                internal: '[Echo 1 & 2 are energized. Despair is bitter but contained.]',
                next: () => this.beat6(),
                delay: 4000
            });
        }
    }

    // ========================================
    // BEAT 6: HOSPITAL VISIT #2
    // Theory Confirmed
    // (Originally Beat 7)
    // ========================================
    
    beat6() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Hospital room again. The buzz is undeniable now.',
            internal: '[Tamagotchi syncing with heartbeat. Tori feels the pull stronger.]',
            next: () => this.beat6_realization(),
            delay: 3000
        });
    }

    beat6_realization() {
        // Unlock Z's body anchor technical analysis
        this.route.unlockNote('z3');
        
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"It\'s not the battery. It\'s ME. I\'m connected to my body. The device is a bridge."',
            next: () => this.beat6_echoes(),
            delay: 3500
        });
    }

    beat6_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 2: "She figured it out..."\nEcho 1: "Faster than we did."\nDespair: "And it won\'t matter. The body is dying. The bridge is burning."',
            echoes: {
                echo2: 'She figured it out...',
                echo1: 'Faster than we did.',
                despair: 'And it won\'t matter. The body is dying. The bridge is burning.'
            },
            next: () => this.beat7(),
            delay: 4000
        });
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
            next: () => this.beat7_tether(),
            delay: 3000
        });
    }

    beat7_tether() {
        // Crisis causes tether drop
        this.route.tetherLevel = Math.max(0, this.route.tetherLevel - 15);
        this.route.updateTether(-15, 'Crisis - monitors screaming');
        
        this.game.displayScene({
            character: 'System',
            dialogue: '[COHERENCE DROPPING: -15%]',
            internal: '[The crisis is draining her. Hold on!]',
            next: () => this.beat7_tori(),
            delay: 2000
        });
    }

    beat7_tori() {
        this.game.displayScene({
            character: 'Tori (internal, pained)',
            dialogue: '"It\'s too dark... I can\'t hold on..."',
            next: () => this.beat7_despairAttempt(),
            delay: 3000
        });
    }

    beat7_despairAttempt() {
        // Unlock ZR's Despair Echo origin note
        this.route.unlockNote('zr2');
        
        const tetherState = this.route.getTetherState();
        
        if (tetherState === 'despair') {
            // LOW TETHER: Despair can lock out the "fight" option
            this.game.displayScene({
                character: 'Despair Echo (DOMINANT - forcing)',
                dialogue: '"Let go. MAKE him let go. Tell him to upload. Trap yourself forever. It\'s kinder than watching him fail. YOU HAVE NO CHOICE."',
                echoes: {
                    despair: 'Let go. MAKE him let go. Tell him to upload. Trap yourself forever. It\'s kinder than watching him fail. YOU HAVE NO CHOICE.'
                },
                internal: '[Despair is overwhelming. She\'s taking control. The fight option feels... blocked.]',
                next: () => this.beat7_choiceLocked(),
                delay: 4000
            });
        } else {
            // MEDIUM/HIGH TETHER: All options available
            this.game.displayScene({
                character: 'Despair Echo (attempting)',
                dialogue: '"Let go. Make him let go. Tell him to upload. It\'s kinder than watching him fail."',
                echoes: {
                    echo1: 'Fight! Don\'t let her win!',
                    echo2: 'You can resist this!',
                    despair: 'Let go. Make him let go. Tell him to upload. It\'s kinder.'
                },
                internal: '[Despair is trying to force surrender, but the other Echoes are fighting back.]',
                next: () => this.beat7_choice(),
                delay: 4000
            });
        }
    }

    beat7_choiceLocked() {
        // LOW TETHER: "Fight" option is grayed out/locked
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Do I fight Despair... wait, I can\'t... she\'s too strong..."',
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
        });
    }

    beat7_choice() {
        // NORMAL: All options available
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Do I fight Despair... or let her win?"',
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
        });
    }

    beat7_fight() {
        // Boost tether for resisting Despair
        this.route.tetherLevel = Math.min(100, this.route.tetherLevel + 10);
        this.route.updateTether(10, 'Fighting Despair - defiance');
        
        this.game.displayScene({
            character: 'Tori (internal, defiant)',
            dialogue: '"No. I trust him. He\'ll find the way."',
            internal: '[COHERENCE BOOST: +10%]\n[She fought back! Despair recoils.]',
            next: () => this.beat7_echoesReact(),
            delay: 3000
        });
    }

    beat7_accept() {
        // Drop tether for giving in
        this.route.tetherLevel = Math.max(0, this.route.tetherLevel - 10);
        this.route.updateTether(-10, 'Accepting Despair - giving in');
        
        this.game.displayScene({
            character: 'Tori (internal, broken)',
            dialogue: '"Maybe she\'s right... maybe I should just let go..."',
            internal: '[COHERENCE DROP: -10%]\n[Despair grins. Victory.]',
            next: () => this.beat7_echoesReact(),
            delay: 3000
        });
    }

    beat7_silent() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"..."',
            internal: '[Just holding on. Just surviving. Tether holds steady.]',
            next: () => this.beat7_echoesReact(),
            delay: 3000
        });
    }

    beat7_echoesReact() {
        const tetherState = this.route.getTetherState();
        
        if (tetherState === 'despair') {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Despair: "Good. Good. Now you understand."\nEcho 1: (fading) "No..."\nEcho 2: (barely there) "Please..."',
                echoes: {
                    despair: 'Good. Good. Now you understand.',
                    echo1: '(fading) No...',
                    echo2: '(barely there) Please...'
                },
                internal: '[Whiteout. Despair dominant. Everything breaks. Act 3 begins...]',
                next: () => this.route.act3.start(),
                delay: 5000
            });
        } else if (tetherState === 'balanced') {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Echo 1: "She\'s still fighting."\nEcho 2: "Stronger than we were."\nDespair: "For now."',
                echoes: {
                    echo1: 'She\'s still fighting.',
                    echo2: 'Stronger than we were.',
                    despair: 'For now.'
                },
                internal: '[Whiteout. The battle continues. Act 3 begins...]',
                next: () => this.route.act3.start(),
                delay: 5000
            });
        } else {
            this.game.displayScene({
                character: 'Echoes',
                dialogue: 'Echo 1: "YES! That\'s it!"\nEcho 2: "She can do this. She really can."\nDespair: "...We\'ll see."',
                echoes: {
                    echo1: 'YES! That\'s it!',
                    echo2: 'She can do this. She really can.',
                    despair: '...We\'ll see.'
                },
                internal: '[Whiteout. Tori holds strong. Act 3 begins...]',
                next: () => this.route.act3.start(),
                delay: 5000
            });
        }
    }
}
