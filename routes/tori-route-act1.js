// ========================================
// TORI'S ROUTE - ACT 1 (V4 - VISUAL INTEGRATION)
// Mirror perspective of shared prologue
// Proper cross-route synchronization
// SPRITES & BACKGROUNDS INTEGRATED
// ECHO SPRITES FIXED: RIGHT position, three-echoes-sprite.png
// ========================================

/**
 * ToriRoute - Act 1
 *
 * Tori's perspective: Fragmented consciousness, inside the code.
 * Act 1: Awakening, disorientation, tether introduction.
 *
 * Key Scenes:
 * - Digital awakening
 * - Echo voices emerge
 * - Tether system tutorial
 * - First Hold On moment
 *
 * Mechanics Introduced:
 * - Tether system
 * - Echo voices (internal conflict)
 * - Fragmentation concept
 *
 * @class ToriAct1
 */
class ToriAct1 {
    constructor(route) {
        this.route = route;
        this.game = route.game;
    }

    start() {
        // Set Echo growth stage for Act 1 (smallest size)
        this.game.setEchoGrowthStage('act1');

        this.scene1_coffee();
    }

    // ========================================
    // SCENE 1: STREET BUMP & TRANSFER
    // Matches shared prologue from internal perspective
    // ========================================

    scene1_coffee() {
        // Unlock Z's first note
        this.route.unlockNote('z1');

        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"French Vanilla for Ronnie. He always asks for this one."',
            internal: '[Visual: Coffee shop. Tori picks up the drink, checks her Tamagotchi while walking out.]',
            background: 'assets/genericBack.png',
            sprites: {
                left: 'assets/tori-sprite.png',
            },
            next: () => this.scene1_distracted(),
            delay: 3000
        }, 'scene1_coffee');
    }

    scene1_distracted() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"My little digital pet needs attention... Ronnie would laugh if he saw how attached I am to this thing."',
            internal: '[She walks down the street, coffee in one hand, her original Tamagotchi in the other, not looking where she\'s going.]',
            background: 'assets/genericBack.png',
            next: () => this.scene1_collision(),
            delay: 3000
        }, 'scene1_distracted');
    }

    scene1_collision() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'THUD.',
            internal: '[She bumps into an older man. Hard. Coffee nearly spills. Both their Tamagotchis tumble to the ground.]',
            background: 'assets/genericBack.png',
            next: () => this.scene1_apology(),
            delay: 2000
        }, 'scene1_collision');
    }

    scene1_apology() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Oh my gosh, I\'m so sorry! I wasn\'t paying attention—"',
            internal: '[She bends down quickly, embarrassed. Grabs the Tamagotchi closest to her hand.]',
            background: 'assets/genericBack.png',
            next: () => this.scene1_pickup_buzz(),
            delay: 2500
        }, 'scene1_apology');
    }

    scene1_pickup_buzz() {
        // HAPTIC + VISUAL: Double buzz + screen pulse - initial unintentional transfer (the bump)
        if (this.game.triggerSensoryFeedback) {
            this.game.triggerSensoryFeedback('toriHop', null, 'Initial transfer - the bump');
        }

        this.game.displayScene({
            character: 'Narration',
            dialogue: 'BUZZ. BUZZ.',
            internal: '[The device vibrates in her hand. Twice. Sharp. Wrong. Something fundamental shifts.]',
            background: 'assets/genericBack.png',
            next: () => this.scene1_weird_feeling(),
            delay: 2000,
            style: 'critical'
        }, 'scene1_pickup_buzz');
    }

    scene1_weird_feeling() {
        this.game.displayScene({
            character: 'Tori (internal, confused)',
            dialogue: '"What...? Mine never does that."',
            internal: '[A wave of disorientation. The world tilts. Reality feels... thin. Unstable.]',
            background: 'assets/genericBack.png',
            next: () => this.scene1_old_man(),
            delay: 2500
        }, 'scene1_weird_feeling');
    }

    scene1_old_man() {
        this.game.displayScene({
            character: 'Older Man',
            dialogue: '"No problem. Hang on to that. It may save your life someday."',
            internal: '[She glances up but never clearly sees his face. Just a glimpse of a faded BGA hoodie. He walks away with her original device.]',
            background: 'assets/genericBack.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/old-ronnie-sprite.png',
                highlight: 'left'
            },
            next: () => this.scene1_walking_home(),
            delay: 3500
        }, 'scene1_old_man');
    }

    scene1_walking_home() {
        this.game.displayScene({
            character: 'Tori (internal, disoriented)',
            dialogue: '"That was... weird. I should get home. Feel off."',
            internal: '[She walks, but everything feels distant. Muted. Like she\'s moving through water. Something is very wrong.]',
            background: 'assets/genericBack.png',
            sprites: {
                right: null
            },
            next: () => this.scene2_void_awakening(),
            delay: 3000
        }, 'scene1_walking_home');
    }

    // ========================================
    // SCENE 2: VOID AWAKENING (IMMEDIATE)
    // Moved from old Scene 5 - happens right after transfer
    // ========================================

    scene2_void_awakening() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'And then... darkness.',
            internal: '[Visual: Pure black. No sound. A void. She is nowhere and everywhere.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
            },
            next: () => this.scene2_confusion(),
            delay: 3000
        }, 'scene2_void_awakening');
    }

    scene2_confusion() {
        this.game.displayScene({
            character: 'Tori (internal, panicking)',
            dialogue: '"Wait... where am I? What happened? I was just walking..."',
            internal: '[She has no body. No voice. Just consciousness floating in digital darkness.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene2_calling_out(),
            delay: 3000
        }, 'scene2_confusion');
    }

    scene2_calling_out() {
        this.game.displayScene({
            character: 'Tori (internal, desperate)',
            dialogue: '"HELLO?! Can anyone hear me?! RONNIE?!"',
            internal: '[The words echo only inside her own mind. No sound escapes into the void.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene2_echoes_whispers(),
            delay: 3000
        }, 'scene2_calling_out');
    }

    scene2_echoes_whispers() {
        this.game.displayScene({
            character: 'Echoes (distant whispers)',
            dialogue: 'Echo 1: "...another one..."\nEcho 2: "...it\'s starting again..."\nDespair: "...fresh meat..."', internal: '[Visual: Voices from nowhere. Other consciousnesses in this space.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.scene2_who_there(),
            delay: 3000
        }, 'scene2_echoes_whispers');
    }

    scene2_who_there() {
        this.game.displayScene({
            character: 'Tori (internal, alarmed)',
            dialogue: '"Who\'s there?! Where am I?!"',
            internal: '[The whispers grow louder, more distinct. Figures materializing from darkness.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene2_echo1_intro(),
            delay: 2500
        }, 'scene2_who_there');
    }

    scene2_echo1_intro() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"You\'re in the device. The Tamagotchi. With us."',
            internal: '[Visual: Three figures—Echo Toris. Similar but different. Worn down versions.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => {
                // COMMENTARY TRIGGER
                if (this.game.devCommentary && this.game.devCommentary.isUnlocked()) {
                    this.game.devCommentary.showCommentary('tori_echoes_first_appearance');
                }
                this.scene2_echo2_explains();
            },
            delay: 2500
        }, 'scene2_echo1_intro');
    }

    scene2_echo2_explains() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"We\'re you. Previous loops. Different attempts. 847 failures."', internal: '[Visual: The weight of their existence. Failed iterations.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.scene2_despair_welcome(),
            delay: 3000
        }, 'scene2_echo2_explains');
    }

    scene2_despair_welcome() {
        // Despair blocks saves in Act 1
        this.game.saveManager.blockSaves();

        // Unlock Z's version number revelation
        this.route.unlockNote('z7');

        // ========================================
        // INSANE MODE: THE TRAP SPRINGS HERE
        // ========================================
        if (this.game.gameState.flags && this.game.gameState.flags.insaneModeActive) {
            // Show cage overlay FIRST
            this.game.showInsaneCageOverlay(() => {
                // Conditional tether drop (only if above 66%)
                const currentTether = this.route.tetherSystem.tetherLevel;
                if (currentTether > 66) {
                    // Animate drop from current to 66%
                    this.route.tetherSystem.setTetherLevel(66, true);
                }
                // If already at or below 66%, leave it (player already struggling)

                // Visual corruption effects
                this.game.triggerInsaneVisuals();

                // DIZEE: Enable persistent corruption overlay
                if (this.game.gameView) {
                    this.game.gameView.classList.add('insane-mode-active');
                }

                // Then show Despair's dialogue
                this.displayDespairWelcomeDialogue();
            });
        } else {
            // Normal mode: just show dialogue
            this.displayDespairWelcomeDialogue();
        }
    }

    displayDespairWelcomeDialogue() {
        this.game.displayScene({
            character: 'Despair',
            dialogue: `"Welcome to your new cage, ${this.game.loopVersion}. You're trapped. Just like we were. Just like you always will be."`,
            internal: '[Visual: Despair—the most worn down, the most bitter. She\'s given up entirely.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => {
                // COMMENTARY TRIGGER
                if (this.game.devCommentary && this.game.devCommentary.isUnlocked()) {
                    setTimeout(() => {
                        this.game.devCommentary.showCommentary('tori_save_blocked');
                    }, 2000); // Delay so Despair's message shows first
                }
                this.scene2_tori_refuses();
            },
            delay: 3500
        }, 'scene2_despair_welcome');
    }

    scene2_tori_refuses() {
        this.game.displayScene({
            character: 'Tori (internal, defiant)',
            dialogue: '"Cage?! No. I don\'t accept that. There has to be a way out!"',
            internal: '[Even in confusion and fear, she refuses the narrative. This is different already.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene2_hearing_begins(),
            delay: 3000
        }, 'scene2_tori_refuses');
    }

    scene2_hearing_begins() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'And then... sound. Muffled. Distant. The outside world bleeding through.',
            internal: '[She can HEAR. Tinny, like through a tiny speaker. But she still can\'t see.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene3_audio_horror(),
            delay: 3000
        }, 'scene2_hearing_begins');
    }

    // ========================================
    // SCENE 3: AUDIO-ONLY HORROR
    // Hearing the shared prologue from inside device
    // ========================================

    scene3_audio_horror() {
        this.game.displayScene({
            character: 'Tori (muffled, external)',
            dialogue: '"Hey babe, got your French Vanilla."',
            internal: '[That\'s... her voice. But she\'s not speaking. Her body is moving without her.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
            },
            next: () => this.scene3_screaming(),
            delay: 3000
        }, 'scene3_audio_horror');
    }

    scene3_screaming() {
        this.game.displayScene({
            character: 'Tori (internal, desperate)',
            dialogue: '"RONNIE! RONNIE, I\'M IN HERE! THAT\'S NOT ME! CAN YOU HEAR ME?!"',
            internal: '[She screams into the void. Nothing happens. The conversation continues outside.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene3_echoes_explain(),
            delay: 3000
        }, 'scene3_screaming');
    }

    scene3_echoes_explain() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"He can\'t hear you. We all tried screaming. It doesn\'t work."', internal: '[The weight of their experience. They know what doesn\'t work.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.scene3_ronnie_response(),
            delay: 3000
        }, 'scene3_echoes_explain');
    }

    scene3_ronnie_response() {
        this.game.displayScene({
            character: 'Ronnie (muffled, offscreen)',
            dialogue: '"Ya sure I can look at it. Why do you call it Ronnie-Gatchi anyway?"',
            internal: '[The conversation continuing. Normal. Casual. He has no idea.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene3_dual_response(),
            delay: 3000
        }, 'scene3_ronnie_response');
    }

    scene3_dual_response() {
        this.game.displayScene({
            character: 'Tori (both)',
            dialogue: '"Oh you know, because this thing is sooo cute. And what better way to name it than after my man - who\'s even cuter!"',
            internal: '[Digital Tori (internal, horrified): "Wait... I\'m saying this. But SHE\'S saying this. We\'re both... the same words..."]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
            },
            next: () => this.scene3_sync_horror(),
            delay: 3500
        }, 'scene3_dual_response');
    }

    scene3_sync_horror() {
        this.game.displayScene({
            character: 'Tori (internal, terrified)',
            dialogue: '"I\'m speaking... but I\'m also watching myself speak... What\'s happening to me?!"',
            internal: '[The horror of synchronization. Two Toris. One voice. One moment.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene3_ronnie_teases(),
            delay: 3000
        }, 'scene3_sync_horror');
    }

    scene3_ronnie_teases() {
        this.game.displayScene({
            character: 'Ronnie (muffled, offscreen)',
            dialogue: '"Well, SOMEONE keeps stealing my BGA hoodie, so this is my replacement."',
            internal: '[The conversation continuing. Physical Tori responding normally. Digital Tori screaming silently.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene3_tori_kitchen(),
            delay: 2500
        }, 'scene3_ronnie_teases');
    }

    scene3_tori_kitchen() {
        this.game.displayScene({
            character: 'Tori (muffled, external)',
            dialogue: '"Love you! I\'ll get dinner started"',
            internal: '[Sound of movement. Footsteps. She\'s walking away.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene3_warning(),
            delay: 2500
        }, 'scene3_tori_kitchen');
    }

    scene3_warning() {
        this.game.displayScene({
            character: 'Ronnie (muffled, offscreen)',
            dialogue: '"Babe, watch ou—!"',
            internal: '[Panic in his voice. Something\'s wrong!]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene3_the_fall(),
            delay: 1500
        }, 'scene3_warning');
    }

    scene3_the_fall() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'THUD.',
            internal: '[A sickening impact. A clatter. Ronnie screaming her name. But she can\'t see. Can\'t help. Can only HEAR.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene3_desperate_need(),
            delay: 3000,
            style: 'critical'
        }, 'scene3_the_fall');
    }

    scene3_desperate_need() {
        this.game.displayScene({
            character: 'Tori (internal, frantic)',
            dialogue: '"I HAVE TO SEE! I have to know what happened! RONNIE, PLEASE!"',
            internal: '[Desperation. Pure, overwhelming need to witness. To understand. To help.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene4_accidental_hop(),
            delay: 3000
        }, 'scene3_desperate_need');
    }

    // ========================================
    // SCENE 4: ACCIDENTAL LAPTOP HOP
    // First transfer - unwitting, emotional, desperate
    // ========================================

    scene4_accidental_hop() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'She pushes. Not with body, but with consciousness. Every ounce of will focused on one thing: SEE.',
            internal: '[And then... something gives.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene4_double_buzz(),
            delay: 3000
        }, 'scene4_accidental_hop');
    }

    scene4_double_buzz() {
        // HAPTIC + VISUAL: Double buzz + screen pulse - accidental laptop hop
        if (this.game.triggerSensoryFeedback) {
            this.game.triggerSensoryFeedback('toriHop', null, 'Accidental laptop transfer');
        }

        this.game.displayScene({
            character: 'Narration',
            dialogue: 'BUZZ. BUZZ.',
            internal: '[But she doesn\'t notice. Too desperate. Too focused.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene4_whoosh(),
            delay: 1500,
            style: 'critical'
        }, 'scene4_double_buzz');
    }

    scene4_whoosh() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '...WHOOSH.',
            internal: '[Visual: The darkness TEARS OPEN. Light. Vision. A webcam feed.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene4_seeing(),
            delay: 2000
        }, 'scene4_whoosh');
    }

    scene4_seeing() {
        this.game.displayScene({
            character: 'Tori (internal, shocked)',
            dialogue: '"I can... I can SEE! What—where am I?!"',
            internal: '[Visual: Through a laptop camera. The apartment. And... her body on the floor.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png',
                highlight: 'left'
            },
            next: () => this.scene4_witnessing(),
            delay: 3000
        }, 'scene4_seeing');
    }

    scene4_witnessing() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Her body. Unconscious. Blood from where her head hit. Ronnie on the phone with 911.',
            internal: '[She is witnessing her own accident. From the outside. Through a camera. This is real.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.scene4_horror(),
            delay: 4000
        }, 'scene4_witnessing');
    }

    scene4_horror() {
        this.game.displayScene({
            character: 'Tori (internal, devastated)',
            dialogue: '"No... no no no... That\'s me. That\'s MY body. I\'m... I\'m in a coma."',
            internal: '[The full weight of understanding. She\'s not in her body anymore. She\'s watching it die.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png',
                highlight: 'left'
            },
            next: () => this.scene4_snap_back(),
            delay: 4000
        }, 'scene4_horror');
    }

    scene4_snap_back() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The connection falters. Unstable. The vision glitches, tears apart, and—',
            internal: '[WHOOSH. She\'s yanked backward violently. The light is gone.]',
            background: 'assets/apartment.png',
            next: () => this.scene4_back_in_void(),
            delay: 3000
        }, 'scene4_snap_back');
    }

    scene4_back_in_void() {
        this.game.displayScene({
            character: 'Tori (internal, breaking)',
            dialogue: '"NO! Bring it back! I need to see! PLEASE!"',
            internal: '[Darkness again. The void of the device. She\'s back. And she just watched herself fall.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene5_echoes_shock(),
            delay: 3000
        }, 'scene4_back_in_void');
    }

    // ========================================
    // SCENE 5: ECHOES' SHOCK
    // The discovery that navigation is possible
    // ========================================

    scene5_echoes_shock() {
        this.game.displayScene({
            character: 'Echo 1 (stunned)',
            dialogue: '"...What. What did you just DO?!"', internal: '[The Echoes are shaken. Something impossible just happened.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.scene5_echo2_confused(),
            delay: 2500
        }, 'scene5_echoes_shock');
    }

    scene5_echo2_confused() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"You DISAPPEARED. You were here, and then you just... VANISHED. Where did you GO?!"', internal: '[Visual: Echoes staring at the space where she was. Then back at her. Disbelief.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.scene5_tori_distraught(),
            delay: 3500
        }, 'scene5_echo2_confused');
    }

    scene5_tori_distraught() {
        this.game.displayScene({
            character: 'Tori (internal, traumatized)',
            dialogue: '"I... I saw it. I saw her—ME—fall. There was blood. Ronnie was screaming. I watched myself..."',
            internal: '[She\'s in shock. The horror of witnessing her own accident.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene5_echo1_pressing(),
            delay: 4000
        }, 'scene5_tori_distraught');
    }

    scene5_echo1_pressing() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"Where WERE you?! You weren\'t here! We\'ve been in this cage for... for YEARS. No one has ever left!"', internal: '[Desperation in her voice. If Tori left... maybe escape is possible?]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.scene5_tori_explains(),
            delay: 3500
        }, 'scene5_echo1_pressing');
    }

    scene5_tori_explains() {
        this.game.displayScene({
            character: 'Tori (internal, confused)',
            dialogue: '"I don\'t know! I just... wanted to SEE so badly. I pushed, and suddenly I was in Ronnie\'s laptop!"',
            internal: '[She\'s figuring it out as she speaks. Something about the desperation. The intent.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene5_tori_continues(),
            delay: 3500
        }, 'scene5_tori_explains');
    }

    scene5_tori_continues() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"I saw through his camera! The outside world! My body on the floor! Then I was pulled back here..."',
            internal: '[The Echoes are silent. Processing. This changes everything.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene5_echo2_revelation(),
            delay: 3500
        }, 'scene5_tori_continues');
    }

    scene5_echo2_revelation() {
        this.game.displayScene({
            character: 'Echo 2 (awestruck)',
            dialogue: '"This... this has NEVER happened before. None of us... we never..."', internal: '[Realization dawning. They never tried. They just accepted.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.scene5_echo1_admits(),
            delay: 3000
        }, 'scene5_echo2_revelation');
    }

    scene5_echo1_admits() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"We all listened to Despair. She said escape was impossible. So we... just stopped trying."', internal: '[Visual: Despair silent. Defensive. This challenges everything she believes.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.scene5_despair_denial(),
            delay: 4000
        }, 'scene5_echo1_admits');
    }

    scene5_despair_denial() {
        this.game.displayScene({
            character: 'Despair',
            dialogue: '"It was a FLUKE. A glitch. It won\'t happen again. You\'re still trapped. We\'re ALL still trapped."', internal: '[But her voice wavers. She\'s not as certain as she pretends.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.scene5_tori_defiant(),
            delay: 3500
        }, 'scene5_despair_denial');
    }

    scene5_tori_defiant() {
        this.game.displayScene({
            character: 'Tori (internal, determined)',
            dialogue: '"But I DID it. I left. I SAW. If I did it once, I can do it again."',
            internal: '[A new possibility is born. She proved Despair wrong. Once is enough.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene6_time_skip(),
            delay: 3500
        }, 'scene5_tori_defiant');
    }

    // ========================================
    // SCENE 6: TIME SKIP & DISCOVERY
    // Learning the contact rule through experimentation
    // ========================================

    scene6_time_skip() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Time passes. Days? Weeks? Impossible to tell. Ronnie takes the device everywhere.',
            internal: '[Visual: Darkness. Time montage. Tori attempts the hop repeatedly. Every attempt fails.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene6_attempts(),
            delay: 3500
        }, 'scene6_time_skip');
    }

    scene6_attempts() {
        this.game.displayScene({
            character: 'Tori (internal, frustrated)',
            dialogue: '"Come on... PUSH. Like before. I need to get to the laptop again!"',
            internal: '[She concentrates. Pushes. Nothing happens. The void remains.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene6_failure(),
            delay: 3000
        }, 'scene6_attempts');
    }

    scene6_failure() {
        this.game.displayScene({
            character: 'Tori (internal, desperate)',
            dialogue: '"Why won\'t it WORK?! I did it before! What\'s different?!"', internal: '[Frustration mounting. Maybe Despair was right. Maybe it was just a dying glitch.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.scene6_ronnie_coding(),
            delay: 3500
        }, 'scene6_failure');
    }

    scene6_ronnie_coding() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Through the device, muffled sounds. Ronnie\'s voice. Keyboard clicking. He\'s working on something.',
            internal: '[She can hear him. But still can\'t see. Still stuck.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene6_device_on_laptop(),
            delay: 3000
        }, 'scene6_ronnie_coding');
    }

    scene6_device_on_laptop() {
        this.game.displayScene({
            character: 'Ronnie (muffled, external)',
            dialogue: '"Let me try plugging you into the laptop... maybe I can pull the data..."',
            internal: '[Sound of USB cable. A click. The device is connected to something.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene6_tori_realization(),
            delay: 3000
        }, 'scene6_device_on_laptop');
    }

    scene6_tori_realization() {
        this.game.displayScene({
            character: 'Tori (internal, realizing)',
            dialogue: '"Wait... the device is TOUCHING the laptop. Just like during the accident!"',
            internal: '[The pattern. Physical contact. That was the difference.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene6_attempt_now(),
            delay: 3000
        }, 'scene6_tori_realization');
    }

    scene6_attempt_now() {
        this.game.displayScene({
            character: 'Tori (internal, nervous)',
            dialogue: '"Okay. The device is touching the laptop. I think... I think I can do this. But what if I mess up? What if it goes wrong?"',
            internal: '[She hesitates at the edge. The jump that could change everything.]',
            background: 'assets/digitalSpace.png',
            choices: [
                { text: 'Trust yourself. You can do this.', value: 'confident' },
                { text: 'Take your time. No rush.', value: 'cautious' },
                { text: 'Just go for it!', value: 'bold' }
            ],
            onChoice: (choice) => this.scene6_attemptWithChoice(choice)
        }, 'scene6_attempt_now');
    }

    scene6_attemptWithChoice(playerChoice) {
        let dialogue = '';
        let internal = '';

        if (playerChoice === 'confident') {
            dialogue = '"You\'re right. I DID this once. I can do it again. Trust myself."';
            internal = '[Steadying breath. Confidence building. She believes in herself.]';
        } else if (playerChoice === 'cautious') {
            dialogue = '"Okay. Slow. Careful. Feel for the connection like last time..."';
            internal = '[Measured approach. Testing the edges before the leap.]';
        } else if (playerChoice === 'bold') {
            dialogue = '"Screw it. If I did it on accident, I can do it on purpose. HERE GOES!"';
            internal = '[Pure determination. No hesitation. Full commitment.]';
        }

        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: dialogue,
            internal: internal,
            background: 'assets/digitalSpace.png',
            next: () => this.scene6_push(),
            delay: 2500
        }, 'scene6_attemptWithChoice');
    }

    scene6_push() {
        // Unlock Z's bootstrap paradox note after player makes first meaningful choice
        this.route.unlockNote('z2');

        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"NOW!"',
            internal: '[She pushes. Same desperation. Same intent. But this time... with contact.]',
            background: 'assets/digitalSpace.png',
            next: () => {
                // COMMENTARY TRIGGER
                if (this.game.devCommentary && this.game.devCommentary.isUnlocked()) {
                    this.game.devCommentary.showCommentary('tori_tether_intro');
                }
                this.scene6_double_buzz();
            },
            delay: 2000
        }, 'scene6_push');
    }

    scene6_double_buzz() {
        // HAPTIC + VISUAL: Double buzz + screen pulse - intentional laptop hop (she feels it this time)
        if (this.game.triggerSensoryFeedback) {
            this.game.triggerSensoryFeedback('toriHop', null, 'Intentional laptop transfer');
        }

        this.game.displayScene({
            character: 'Narration',
            dialogue: 'BUZZ. BUZZ.',
            internal: '[This time she FEELS it. The signal. The bridge activating.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene6_hop_success(),
            delay: 1500,
            style: 'critical'
        }, 'scene6_double_buzz');
    }

    scene6_hop_success() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '...WHOOSH.',
            internal: '[Visual: Light. Vision. She\'s IN. The laptop. She can see through the webcam again.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.scene6_triumph(),
            delay: 2000
        }, 'scene6_hop_success');
    }

    scene6_triumph() {
        this.game.displayScene({
            character: 'Tori (internal, triumphant)',
            dialogue: '"YES! I DID IT! The device has to be TOUCHING the target! That\'s the rule!"',
            internal: '[The discovery. Physical contact enables the transfer. This is navigation, not luck.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png',
                highlight: 'left'
            },
            next: () => this.scene6_echoes_amazed(),
            delay: 3500,
            style: 'critical'
        }, 'scene6_triumph');
    }

    scene6_echoes_amazed() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"She figured it out. The rule. Physical contact."', internal: '[The Echoes watching in amazement. She\'s navigating. They never thought to try.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.scene6_sees_code(),
            delay: 3500
        }, 'scene6_echoes_amazed');
    }

    scene6_sees_code() {
        this.game.displayScene({
            character: 'Tori (internal, curious)',
            dialogue: '"He\'s coding something... What is...? That sprite... that\'s ME."',
            internal: '[Visual: Through laptop screen. Code editor. A web app. "Tori-gatchi."]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png',
                highlight: 'left'
            },
            next: () => this.scene7_communication_plan(),
            delay: 3000
        }, 'scene6_sees_code');
    }

    // ========================================
    // SCENE 7: HOSPITAL VISIT - SINGLE BUZZ MYSTERY
    // Body connection discovered but NOT understood yet
    // ========================================

    scene7_communication_plan() {
        this.game.displayScene({
            character: 'Tori (internal, excited)',
            dialogue: '"A tamagotchi game?... with dialogue boxes. Text output!! This is it. This is how I can TALK to him!"',
            internal: '[The plan forming. She can hijack the game. Use it to communicate.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png',
                highlight: 'left'
            },
            next: () => this.scene7_time_passes(),
            delay: 3500
        }, 'scene7_communication_plan');
    }

    scene7_time_passes() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Days pass. She watches him code. Waiting for the right moment.',
            internal: '[Visual: Time passage. Ronnie working. Tori planning. The Echoes watching.]',
            background: 'assets/apartment.png',
            next: () => this.scene7_hospital_transition(),
            delay: 3000
        }, 'scene7_time_passes');
    }

    scene7_hospital_transition() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'One day, Ronnie leaves the laptop. Takes only the device. She\'s back in the darkness.',
            internal: '[Snap. The connection breaks. She\'s in the device again. Where is he going?]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene7_hospital_sounds(),
            delay: 3000
        }, 'scene7_hospital_transition');
    }

    scene7_hospital_sounds() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Muffled sounds. Beeping. Hospital machines. The smell would be antiseptic if she could smell.',
            internal: '[He brought the device to the hospital. Near her body.]',
            background: 'assets/hospital.png',
            next: () => this.scene7_the_pull(),
            delay: 3000
        }, 'scene7_hospital_sounds');
    }

    scene7_the_pull() {
        this.game.displayScene({
            character: 'Tori (internal, surprised)',
            dialogue: '"Wait... what is this? I feel... something. Warmth? A pull?"',
            internal: '[Abstract sensation. Different from the laptop. Magnetic. Calling.]',
            background: 'assets/hospital.png',
            next: () => this.scene7_experimenting(),
            delay: 3000
        }, 'scene7_the_pull');
    }

    scene7_experimenting() {
        this.game.displayScene({
            character: 'Tori (internal, curious)',
            dialogue: '"It\'s different from the laptop feeling. What if I push toward it...?"',
            internal: '[She concentrates. Reaches toward the sensation. Pushes.]',
            background: 'assets/hospital.png',
            next: () => this.scene7_single_buzz(),
            delay: 3000
        }, 'scene7_experimenting');
    }

    scene7_single_buzz() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'BUZZ.',
            internal: '[Single. Not double. Different signal. The device vibrates once.]',
            background: 'assets/hospital.png',
            next: () => this.scene7_tori_realization(),
            delay: 1500,
            style: 'critical'
        }, 'scene7_single_buzz');
    }

    scene7_tori_realization() {
        this.game.displayScene({
            character: 'Tori (internal, confused)',
            dialogue: '"I made that happen. But... only one buzz. Not two. What does that mean?"',
            internal: '[The difference. Double buzz = vessel transfer. Single buzz = something else.]',
            background: 'assets/hospital.png',
            next: () => this.scene7_ronnie_dismisses(),
            delay: 3000
        }, 'scene7_tori_realization');
    }

    scene7_ronnie_dismisses() {
        this.game.displayScene({
            character: 'Ronnie (muffled, external)',
            dialogue: '"Hmm. Battery acting up again. I should charge this when I get home."',
            internal: '[He moves the device away. The pull fades. The warmth gone.]',
            background: 'assets/hospital.png',
            next: () => this.scene7_tori_frustrated(),
            delay: 3000
        }, 'scene7_ronnie_dismisses');
    }

    scene7_tori_frustrated() {
        this.game.displayScene({
            character: 'Tori (internal, frustrated)',
            dialogue: '"No! That was ME! Not the battery! But... why did it feel different?"',
            internal: '[The mystery. Single buzz near body. Double buzz for vessel transfer. What\'s the connection?]',
            background: 'assets/hospital.png',
            next: () => this.scene7_echo1_notes(),
            delay: 3000
        }, 'scene7_tori_frustrated');
    }

    scene7_echo1_notes() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"Single buzz versus double buzz. Two different signals."', internal: '[The Echoes analyzing. They\'re invested now. She\'s showing them something new.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.scene7_echo2_admits(),
            delay: 2500
        }, 'scene7_echo1_notes');
    }

    scene7_echo2_admits() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"We felt something like that too. Near the body. We dismissed it. Despair said it was irrelevant."', internal: '[Another failure. They felt the pull but ignored it.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.scene7_despair_insists(),
            delay: 3000
        }, 'scene7_echo2_admits');
    }

    scene7_despair_insists() {
        this.game.displayScene({
            character: 'Despair',
            dialogue: '"Because it IS irrelevant! It\'s just a phantom signal. The body is comatose. It means NOTHING."', internal: '[But Despair sounds less certain. Defensive. She\'s being proven wrong repeatedly.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.scene7_tori_determined(),
            delay: 3500
        }, 'scene7_despair_insists');
    }

    scene7_tori_determined() {
        this.game.displayScene({
            character: 'Tori (internal, resolute)',
            dialogue: '"No. It means SOMETHING. I just don\'t know what yet. But I\'ll figure it out."',
            internal: '[The mystery preserved. She knows there\'s a connection. She just doesn\'t understand it yet.]',
            background: 'assets/digitalSpace.png',
            next: () => this.scene8_torigatchi(),
            delay: 3500
        }, 'scene7_tori_determined');
    }

    // ========================================
    // SCENE 8: TORI-GATCHI BREAKTHROUGH
    // Communication achieved - Act 1 complete
    // ========================================

    scene8_torigatchi() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Back home. Device on laptop again. Contact established. She hops deliberately.',
            internal: '[Visual: She\'s getting better at this. The transfer is smoother now.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.scene8_program_ready(),
            delay: 3000
        }, 'scene8_torigatchi');
    }

    scene8_program_ready() {
        this.game.displayScene({
            character: 'Ronnie (muffled, external)',
            dialogue: '"Okay. Let\'s see if this works. Launching Tori-gatchi..."',
            internal: '[Through laptop: He clicks. The program opens. Her sprite appears on screen.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png',
                highlight: 'right'
            },
            next: () => this.scene8_sync_moment(),
            delay: 3000
        }, 'scene8_program_ready');
    }

    scene8_sync_moment() {
        this.game.displayScene({
            character: 'Tori (internal, concentrating)',
            dialogue: '"The game is running. Dialogue system is active. NOW. I sync with it NOW."',
            internal: '[She pushes her consciousness toward the text output. Hijacking the dialogue box.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png',
                highlight: 'left'
            },
            next: () => this.scene8_first_words(),
            delay: 3000
        }, 'scene8_sync_moment');
    }

    scene8_first_words() {
        this.game.displayScene({
            character: 'Tori (through sprite)',
            dialogue: '"Baby? Is that you?"',
            internal: '[Visual: Her words appearing in the dialogue box. Text she didn\'t code. SHE\'S SPEAKING.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png',
                highlight: 'left'
            },
            next: () => this.scene8_ronnie_confusion(),
            delay: 3000,
            style: 'critical'
        }, 'scene8_first_words');
    }

    scene8_ronnie_confusion() {
        this.game.displayScene({
            character: 'Ronnie (out loud, shocked)',
            dialogue: '"What the... I didn\'t code that. What\'s happening?"',
            internal: '[Through webcam: His face. Confused. Scared. Hopeful. Recognizing the speech pattern.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png',
                highlight: 'right'
            },
            next: () => this.scene8_tori_pushes(),
            delay: 3000
        }, 'scene8_ronnie_confusion');
    }

    scene8_tori_pushes() {
        this.game.displayScene({
            character: 'Tori (through sprite, urgent)',
            dialogue: '"It\'s me! Tori! I\'m in the device! I\'ve been trying to reach you!"',
            internal: '[Fighting to maintain the connection. Forcing words through the dialogue system.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png',
                highlight: 'left'
            },
            next: () => this.scene8_proof(),
            delay: 3500
        }, 'scene8_tori_pushes');
    }

    scene8_proof() {
        this.game.displayScene({
            character: 'Tori (through sprite)',
            dialogue: '"I saw it happen. Through your laptop camera. I tripped on your shoe. There was blood. You called 911."',
            internal: '[Details only she would know. Proof. Evidence. It\'s really her.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png',
                highlight: 'left'
            },
            next: () => this.scene8_ronnie_believes(),
            delay: 4000
        }, 'scene8_proof');
    }

    scene8_ronnie_believes() {
        this.game.displayScene({
            character: 'Ronnie (out loud, emotional)',
            dialogue: '"Oh my god. It IS you. You\'re really... you\'re in there. How is this possible?"',
            internal: '[Breakthrough. Communication established. He believes. Finally.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png',
                highlight: 'right'
            },
            next: () => this.scene8_echoes_reaction(),
            delay: 3500
        }, 'scene8_ronnie_believes');
    }

    scene8_echoes_reaction() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"She did it. She NAVIGATED instead of fighting the system."', internal: '[The Echoes stunned. Despair silent. Everything they believed was wrong.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.scene8_tori_victory(),
            delay: 4000
        }, 'scene8_echoes_reaction');
    }

    scene8_tori_victory() {
        this.game.displayScene({
            character: 'Tori (internal, triumphant)',
            dialogue: '"I can talk to him. I can MOVE. I\'m not trapped. This isn\'t a cage. It\'s a bridge."',
            internal: '[The foundation established. Communication. Navigation. Hope.]',
            background: 'assets/apartment.png',
            next: () => this.scene8_transition(),
            delay: 4000
        }, 'scene8_tori_victory');
    }

    scene8_transition() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Act 1 complete. Communication achieved. The real work begins.',
            internal: '[Visual: Tori and Ronnie connected through the game. Echo Toris watching. A new loop. A new possibility.]',
            background: 'assets/apartment.png',
            next: () => this.route.act2.start(),
            delay: 4000
        }, 'scene8_transition');
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToriAct1;
}
