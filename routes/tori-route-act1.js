// ========================================
// TORI'S ROUTE - ACT 1 (V4 - VISUAL INTEGRATION)
// Mirror perspective of shared prologue
// Proper cross-route synchronization
// SPRITES & BACKGROUNDS INTEGRATED
// ECHO SPRITES FIXED: RIGHT position, three-echoes-sprite.png
// ========================================

class ToriAct1 {
    constructor(route) {
        this.route = route;
        this.game = route.game;
    }
    
    start() {
        // Set Echo growth stage for Act 1 (smallest size)
        this.game.setEchoGrowthStage('act1');

        this.tori_act1_01_coffee();
    }
    
    // ========================================
    // SCENE 1: STREET BUMP & TRANSFER
    // Matches shared prologue from internal perspective
    // ========================================
    
    tori_act1_01_coffee() {
        // Unlock Z's first note
        this.route.unlockNote('z1');

        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"French Vanilla for Ronnie. He always asks for this one."',
            internal: '[Visual: Coffee shop. Tori picks up the drink, checks her Tamagotchi while walking out.]',
            background: 'assets/genericBack.png',
            next: () => this.tori_act1_02_distracted(),
            delay: 3000
        }, 'tori_act1_01_coffee');
    }

    tori_act1_02_distracted() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"My little digital pet needs attention... Ronnie would laugh if he saw how attached I am to this thing."',
            internal: '[She walks down the street, coffee in one hand, her original Tamagotchi in the other, not looking where she\'s going.]',
            background: 'assets/genericBack.png',
            next: () => this.tori_act1_03_collision(),
            delay: 3000
        }, 'tori_act1_02_distracted');
    }

    tori_act1_03_collision() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'THUD.',
            internal: '[She bumps into an older man. Hard. Coffee nearly spills. Both their Tamagotchis tumble to the ground.]',
            background: 'assets/genericBack.png',
            next: () => this.tori_act1_04_apology(),
            delay: 2000
        }, 'tori_act1_03_collision');
    }

    tori_act1_04_apology() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Oh my gosh, I\'m so sorry! I wasn\'t paying attention—"',
            internal: '[She bends down quickly, embarrassed. Grabs the Tamagotchi closest to her hand.]',
            background: 'assets/genericBack.png',
            next: () => this.tori_act1_05_pickupbuzz(),
            delay: 2500
        }, 'tori_act1_04_apology');
    }

    tori_act1_05_pickupbuzz() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'BUZZ. BUZZ.',
            internal: '[The device vibrates in her hand. Twice. Sharp. Wrong. Something fundamental shifts.]',
            background: 'assets/genericBack.png',
            next: () => this.tori_act1_06_weirdfeeling(),
            delay: 2000,
            style: 'critical'
        }, 'tori_act1_05_pickupbuzz');
    }

    tori_act1_06_weirdfeeling() {
        this.game.displayScene({
            character: 'Tori (internal, confused)',
            dialogue: '"What...? Mine never does that."',
            internal: '[A wave of disorientation. The world tilts. Reality feels... thin. Unstable.]',
            background: 'assets/genericBack.png',
            next: () => this.tori_act1_07_oldman(),
            delay: 2500
        }, 'tori_act1_06_weirdfeeling');
    }

    tori_act1_07_oldman() {
        this.game.displayScene({
            character: 'Older Man',
            dialogue: '"No problem. Hang on to that. It may save your life someday."',
            internal: '[She glances up but never clearly sees his face. Just a glimpse of a faded BGA hoodie. He walks away with her original device.]',
            background: 'assets/genericBack.png',
            sprites: {
                left: 'assets/old-ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.tori_act1_08_walkinghome(),
            delay: 3500
        }, 'tori_act1_07_oldman');
    }

    tori_act1_08_walkinghome() {
        this.game.displayScene({
            character: 'Tori (internal, disoriented)',
            dialogue: '"That was... weird. I should get home. Feel off."',
            internal: '[She walks, but everything feels distant. Muted. Like she\'s moving through water. Something is very wrong.]',
            background: 'assets/genericBack.png',
            next: () => this.tori_act1_09_voidawakening(),
            delay: 3000
        }, 'tori_act1_08_walkinghome');
    }

    // ========================================
    // SCENE 2: VOID AWAKENING (IMMEDIATE)
    // Moved from old Scene 5 - happens right after transfer
    // ========================================
    
    tori_act1_09_voidawakening() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'And then... darkness.',
            internal: '[Visual: Pure black. No sound. A void. She is nowhere and everywhere.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_10_confusion(),
            delay: 3000
        }, 'tori_act1_09_voidawakening');
    }

    tori_act1_10_confusion() {
        this.game.displayScene({
            character: 'Tori (internal, panicking)',
            dialogue: '"Wait... where am I? What happened? I was just walking..."',
            internal: '[She has no body. No voice. Just consciousness floating in digital darkness.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_11_callingout(),
            delay: 3000
        }, 'tori_act1_10_confusion');
    }

    tori_act1_11_callingout() {
        this.game.displayScene({
            character: 'Tori (internal, desperate)',
            dialogue: '"HELLO?! Can anyone hear me?! RONNIE?!"',
            internal: '[The words echo only inside her own mind. No sound escapes into the void.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_12_echoeswhispers(),
            delay: 3000
        }, 'tori_act1_11_callingout');
    }

    tori_act1_12_echoeswhispers() {
        this.game.displayScene({
            character: 'Echoes (distant whispers)',
            dialogue: 'Echo 1: "...another one..."\nEcho 2: "...it\'s starting again..."\nDespair: "...fresh meat..."',            internal: '[Visual: Voices from nowhere. Other consciousnesses in this space.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_act1_13_whothere(),
            delay: 3000
        }, 'tori_act1_12_echoeswhispers');
    }

    tori_act1_13_whothere() {
        this.game.displayScene({
            character: 'Tori (internal, alarmed)',
            dialogue: '"Who\'s there?! Where am I?!"',
            internal: '[The whispers grow louder, more distinct. Figures materializing from darkness.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_14_echo1intro(),
            delay: 2500
        }, 'tori_act1_13_whothere');
    }

    tori_act1_14_echo1intro() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"You\'re in the device. The Tamagotchi. With us."',            internal: '[Visual: Three figures—Echo Toris. Similar but different. Worn down versions.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_act1_15_echo2explains(),
            delay: 2500
        }, 'tori_act1_14_echo1intro');
    }

    tori_act1_15_echo2explains() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"We\'re you. Previous loops. Different attempts. 847 failures."',            internal: '[Visual: The weight of their existence. Failed iterations.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_act1_16_despairwelcome(),
            delay: 3000
        }, 'tori_act1_15_echo2explains');
    }

    tori_act1_16_despairwelcome() {
        // Despair blocks saves in Act 1
        this.game.saveManager.blockSaves();

        // Unlock Z's version number revelation
        this.route.unlockNote('z7');

        this.game.displayScene({
            character: 'Despair',
            dialogue: '"Welcome to your new cage, 848. You\'re trapped. Just like we were. Just like you always will be."',            internal: '[Visual: Despair—the most worn down, the most bitter. She\'s given up entirely.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_act1_17_torirefuses(),
            delay: 3500
        }, 'tori_act1_16_despairwelcome');
    }

    tori_act1_17_torirefuses() {
        this.game.displayScene({
            character: 'Tori (internal, defiant)',
            dialogue: '"Cage?! No. I don\'t accept that. There has to be a way out!"',
            internal: '[Even in confusion and fear, she refuses the narrative. This is different already.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_18_hearingbegins(),
            delay: 3000
        }, 'tori_act1_17_torirefuses');
    }

    tori_act1_18_hearingbegins() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'And then... sound. Muffled. Distant. The outside world bleeding through.',
            internal: '[She can HEAR. Tinny, like through a tiny speaker. But she still can\'t see.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_19_audiohorror(),
            delay: 3000
        }, 'tori_act1_18_hearingbegins');
    }

    // ========================================
    // SCENE 3: AUDIO-ONLY HORROR
    // Hearing the shared prologue from inside device
    // ========================================
    
    tori_act1_19_audiohorror() {
        this.game.displayScene({
            character: 'Tori (muffled, external)',
            dialogue: '"Hey babe, got your French Vanilla."',
            internal: '[That\'s... her voice. But she\'s not speaking. Her body is moving without her.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_20_screaming(),
            delay: 3000
        }, 'tori_act1_19_audiohorror');
    }

    tori_act1_20_screaming() {
        this.game.displayScene({
            character: 'Tori (internal, desperate)',
            dialogue: '"RONNIE! RONNIE, I\'M IN HERE! THAT\'S NOT ME! CAN YOU HEAR ME?!"',
            internal: '[She screams into the void. Nothing happens. The conversation continues outside.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_21_echoesexplain(),
            delay: 3000
        }, 'tori_act1_20_screaming');
    }

    tori_act1_21_echoesexplain() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"He can\'t hear you. We all tried screaming. It doesn\'t work."',            internal: '[The weight of their experience. They know what doesn\'t work.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_act1_22_ronnieresponse(),
            delay: 3000
        }, 'tori_act1_21_echoesexplain');
    }

    tori_act1_22_ronnieresponse() {
        this.game.displayScene({
            character: 'Ronnie (muffled, external)',
            dialogue: '"ya sure i can look at it. why do you call it ronnie-gatchi anyway?"',
            internal: '[The conversation continuing. Normal. Casual. He has no idea.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_23_dualresponse(),
            delay: 3000
        }, 'tori_act1_22_ronnieresponse');
    }

    tori_act1_23_dualresponse() {
        this.game.displayScene({
            character: 'Tori (both)',
            dialogue: '"Oh you know, because this thing is sooo cute. And what better way to name it than after my man - who\'s even cuter!"',
            internal: '[Digital Tori (internal, horrified): "Wait... I\'m saying this. But SHE\'S saying this. We\'re both... the same words..."]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_24_synchorror(),
            delay: 3500
        }, 'tori_act1_23_dualresponse');
    }

    tori_act1_24_synchorror() {
        this.game.displayScene({
            character: 'Tori (internal, terrified)',
            dialogue: '"I\'m speaking... but I\'m also watching myself speak... What\'s happening to me?!"',
            internal: '[The horror of synchronization. Two Toris. One voice. One moment.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_25_ronnieteases(),
            delay: 3000
        }, 'tori_act1_24_synchorror');
    }

    tori_act1_25_ronnieteases() {
        this.game.displayScene({
            character: 'Ronnie (muffled, external)',
            dialogue: '"you\'re such a dork, honey"',
            internal: '[The conversation continuing. Physical Tori responding normally. Digital Tori screaming silently.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_26_torikitchen(),
            delay: 2500
        }, 'tori_act1_25_ronnieteases');
    }

    tori_act1_26_torikitchen() {
        this.game.displayScene({
            character: 'Tori (muffled, external)',
            dialogue: '"yea but you still love me. i\'ll get dinner started"',
            internal: '[Sound of movement. Footsteps. She\'s walking away.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_27_warning(),
            delay: 2500
        }, 'tori_act1_26_torikitchen');
    }

    tori_act1_27_warning() {
        this.game.displayScene({
            character: 'Ronnie (muffled, external)',
            dialogue: '"Babe, watch ou—!"',
            internal: '[Panic in his voice. Something\'s wrong!]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_28_thefall(),
            delay: 1500
        }, 'tori_act1_27_warning');
    }

    tori_act1_28_thefall() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'THUD.',
            internal: '[A sickening impact. A clatter. Ronnie screaming her name. But she can\'t see. Can\'t help. Can only HEAR.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_29_desperateneed(),
            delay: 3000,
            style: 'critical'
        }, 'tori_act1_28_thefall');
    }

    tori_act1_29_desperateneed() {
        this.game.displayScene({
            character: 'Tori (internal, frantic)',
            dialogue: '"I HAVE TO SEE! I have to know what happened! RONNIE, PLEASE!"',
            internal: '[Desperation. Pure, overwhelming need to witness. To understand. To help.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_30_accidentalhop(),
            delay: 3000
        }, 'tori_act1_29_desperateneed');
    }

    // ========================================
    // SCENE 4: ACCIDENTAL LAPTOP HOP
    // First transfer - unwitting, emotional, desperate
    // ========================================
    
    tori_act1_30_accidentalhop() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'She pushes. Not with body, but with consciousness. Every ounce of will focused on one thing: SEE.',
            internal: '[And then... something gives.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_31_doublebuzz(),
            delay: 3000
        }, 'tori_act1_30_accidentalhop');
    }

    tori_act1_31_doublebuzz() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'BUZZ. BUZZ.',
            internal: '[But she doesn\'t notice. Too desperate. Too focused.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_32_whoosh(),
            delay: 1500,
            style: 'critical'
        }, 'tori_act1_31_doublebuzz');
    }

    tori_act1_32_whoosh() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '...WHOOSH.',
            internal: '[Visual: The darkness TEARS OPEN. Light. Vision. A webcam feed.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_33_seeing(),
            delay: 2000
        }, 'tori_act1_32_whoosh');
    }

    tori_act1_33_seeing() {
        this.game.displayScene({
            character: 'Tori (internal, shocked)',
            dialogue: '"I can... I can SEE! What—where am I?!"',
            internal: '[Visual: Through a laptop camera. The apartment. And... her body on the floor.]',
            background: 'apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act1_34_witnessing(),
            delay: 3000
        }, 'tori_act1_33_seeing');
    }

    tori_act1_34_witnessing() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Her body. Unconscious. Blood from where her head hit. Ronnie on the phone with 911.',
            internal: '[She is witnessing her own accident. From the outside. Through a camera. This is real.]',
            background: 'apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act1_35_horror(),
            delay: 4000
        }, 'tori_act1_34_witnessing');
    }

    tori_act1_35_horror() {
        this.game.displayScene({
            character: 'Tori (internal, devastated)',
            dialogue: '"No... no no no... That\'s me. That\'s MY body. I\'m... I\'m in a coma."',
            internal: '[The full weight of understanding. She\'s not in her body anymore. She\'s watching it die.]',
            background: 'apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act1_36_snapback(),
            delay: 4000
        }, 'tori_act1_35_horror');
    }

    tori_act1_36_snapback() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The connection falters. Unstable. The vision glitches, tears apart, and—',
            internal: '[WHOOSH. She\'s yanked backward violently. The light is gone.]',
            background: 'apartment.png',
            next: () => this.tori_act1_37_backinvoid(),
            delay: 3000
        }, 'tori_act1_36_snapback');
    }

    tori_act1_37_backinvoid() {
        this.game.displayScene({
            character: 'Tori (internal, breaking)',
            dialogue: '"NO! Bring it back! I need to see! PLEASE!"',
            internal: '[Darkness again. The void of the device. She\'s back. And she just watched herself fall.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_38_echoesshock(),
            delay: 3000
        }, 'tori_act1_37_backinvoid');
    }

    // ========================================
    // SCENE 5: ECHOES' SHOCK
    // The discovery that navigation is possible
    // ========================================
    
    tori_act1_38_echoesshock() {
        this.game.displayScene({
            character: 'Echo 1 (stunned)',
            dialogue: '"...What. What did you just DO?!"',            internal: '[The Echoes are shaken. Something impossible just happened.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_act1_39_echo2confused(),
            delay: 2500
        }, 'tori_act1_38_echoesshock');
    }

    tori_act1_39_echo2confused() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"You DISAPPEARED. You were here, and then you just... VANISHED. Where did you GO?!"',            internal: '[Visual: Echoes staring at the space where she was. Then back at her. Disbelief.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_act1_40_toridistraught(),
            delay: 3500
        }, 'tori_act1_39_echo2confused');
    }

    tori_act1_40_toridistraught() {
        this.game.displayScene({
            character: 'Tori (internal, traumatized)',
            dialogue: '"I... I saw it. I saw her—ME—fall. There was blood. Ronnie was screaming. I watched myself..."',
            internal: '[She\'s in shock. The horror of witnessing her own accident.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_41_echo1pressing(),
            delay: 4000
        }, 'tori_act1_40_toridistraught');
    }

    tori_act1_41_echo1pressing() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"Where WERE you?! You weren\'t here! We\'ve been in this cage for... for YEARS. No one has ever left!"',            internal: '[Desperation in her voice. If Tori left... maybe escape is possible?]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_act1_42_toriexplains(),
            delay: 3500
        }, 'tori_act1_41_echo1pressing');
    }

    tori_act1_42_toriexplains() {
        this.game.displayScene({
            character: 'Tori (internal, confused)',
            dialogue: '"I don\'t know! I just... wanted to SEE so badly. I pushed, and suddenly I was in Ronnie\'s laptop!"',
            internal: '[She\'s figuring it out as she speaks. Something about the desperation. The intent.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_43_toricontinues(),
            delay: 3500
        }, 'tori_act1_42_toriexplains');
    }

    tori_act1_43_toricontinues() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"I saw through his camera! The outside world! My body on the floor! Then I was pulled back here..."',
            internal: '[The Echoes are silent. Processing. This changes everything.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_44_echo2revelation(),
            delay: 3500
        }, 'tori_act1_43_toricontinues');
    }

    tori_act1_44_echo2revelation() {
        this.game.displayScene({
            character: 'Echo 2 (awestruck)',
            dialogue: '"This... this has NEVER happened before. None of us... we never..."',            internal: '[Realization dawning. They never tried. They just accepted.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_act1_45_echo1admits(),
            delay: 3000
        }, 'tori_act1_44_echo2revelation');
    }

    tori_act1_45_echo1admits() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"We all listened to Despair. She said escape was impossible. So we... just stopped trying."',            internal: '[Visual: Despair silent. Defensive. This challenges everything she believes.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_act1_46_despairdenial(),
            delay: 4000
        }, 'tori_act1_45_echo1admits');
    }

    tori_act1_46_despairdenial() {
        this.game.displayScene({
            character: 'Despair',
            dialogue: '"It was a FLUKE. A glitch. It won\'t happen again. You\'re still trapped. We\'re ALL still trapped."',            internal: '[But her voice wavers. She\'s not as certain as she pretends.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_act1_47_toridefiant(),
            delay: 3500
        }, 'tori_act1_46_despairdenial');
    }

    tori_act1_47_toridefiant() {
        this.game.displayScene({
            character: 'Tori (internal, determined)',
            dialogue: '"But I DID it. I left. I SAW. If I did it once, I can do it again."',
            internal: '[A new possibility is born. She proved Despair wrong. Once is enough.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_48_timeskip(),
            delay: 3500
        }, 'tori_act1_47_toridefiant');
    }

    // ========================================
    // SCENE 6: TIME SKIP & DISCOVERY
    // Learning the contact rule through experimentation
    // ========================================
    
    tori_act1_48_timeskip() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Time passes. Days? Weeks? Impossible to tell. Ronnie takes the device everywhere.',
            internal: '[Visual: Darkness. Time montage. Tori attempts the hop repeatedly. Every attempt fails.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_49_attempts(),
            delay: 3500
        }, 'tori_act1_48_timeskip');
    }

    tori_act1_49_attempts() {
        this.game.displayScene({
            character: 'Tori (internal, frustrated)',
            dialogue: '"Come on... PUSH. Like before. I need to get to the laptop again!"',
            internal: '[She concentrates. Pushes. Nothing happens. The void remains.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_50_failure(),
            delay: 3000
        }, 'tori_act1_49_attempts');
    }

    tori_act1_50_failure() {
        this.game.displayScene({
            character: 'Tori (internal, desperate)',
            dialogue: '"Why won\'t it WORK?! I did it before! What\'s different?!"',            internal: '[Frustration mounting. Maybe Despair was right. Maybe it was just a dying glitch.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_act1_51_ronnicecoding(),
            delay: 3500
        }, 'tori_act1_50_failure');
    }

    tori_act1_51_ronnicecoding() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Through the device, muffled sounds. Ronnie\'s voice. Keyboard clicking. He\'s working on something.',
            internal: '[She can hear him. But still can\'t see. Still stuck.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_52_deviceonlaptop(),
            delay: 3000
        }, 'tori_act1_51_ronnicecoding');
    }

    tori_act1_52_deviceonlaptop() {
        this.game.displayScene({
            character: 'Ronnie (muffled, external)',
            dialogue: '"Let me try plugging you into the laptop... maybe I can pull the data..."',
            internal: '[Sound of USB cable. A click. The device is connected to something.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_53_torirealization(),
            delay: 3000
        }, 'tori_act1_52_deviceonlaptop');
    }

    tori_act1_53_torirealization() {
        this.game.displayScene({
            character: 'Tori (internal, realizing)',
            dialogue: '"Wait... the device is TOUCHING the laptop. Just like during the accident!"',
            internal: '[The pattern. Physical contact. That was the difference.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_54_attemptnow(),
            delay: 3000
        }, 'tori_act1_53_torirealization');
    }

    tori_act1_54_attemptnow() {
        this.game.displayScene({
            character: 'Tori (internal, nervous)',
            dialogue: '"Okay. The device is touching the laptop. I think... I think I can do this. But what if I mess up? What if it goes wrong?"',
            internal: '[She hesitates at the edge. The jump that could change everything.]',
            background: 'digitalSpace.png',
            choices: [
                { text: 'Trust yourself. You can do this.', value: 'confident' },
                { text: 'Take your time. No rush.', value: 'cautious' },
                { text: 'Just go for it!', value: 'bold' }
            ],
            onChoice: (choice) => this.tori_act1_54_attemptWithChoice(choice)
        }, 'tori_act1_54_attemptnow');
    }

    tori_act1_54_attemptWithChoice(playerChoice) {
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
            background: 'digitalSpace.png',
            next: () => this.tori_act1_55_push(),
            delay: 2500
        }, 'tori_act1_54_attemptWithChoice');
    }
    
    tori_act1_55_push() {
        // Unlock Z's bootstrap paradox note after player makes first meaningful choice
        this.route.unlockNote('z2');

        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"NOW!"',
            internal: '[She pushes. Same desperation. Same intent. But this time... with contact.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_56_doublebuzz(),
            delay: 2000
        }, 'tori_act1_55_push');
    }

    tori_act1_56_doublebuzz() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'BUZZ. BUZZ.',
            internal: '[This time she FEELS it. The signal. The bridge activating.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_57_hopsuccess(),
            delay: 1500,
            style: 'critical'
        }, 'tori_act1_56_doublebuzz');
    }

    tori_act1_57_hopsuccess() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '...WHOOSH.',
            internal: '[Visual: Light. Vision. She\'s IN. The laptop. She can see through the webcam again.]',
            background: 'apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act1_58_triumph(),
            delay: 2000
        }, 'tori_act1_57_hopsuccess');
    }

    tori_act1_58_triumph() {
        this.game.displayScene({
            character: 'Tori (internal, triumphant)',
            dialogue: '"YES! I DID IT! The device has to be TOUCHING the target! That\'s the rule!"',
            internal: '[The discovery. Physical contact enables the transfer. This is navigation, not luck.]',
            background: 'apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act1_59_echoesamazed(),
            delay: 3500,
            style: 'critical'
        }, 'tori_act1_58_triumph');
    }

    tori_act1_59_echoesamazed() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"She figured it out. The rule. Physical contact."',            internal: '[The Echoes watching in amazement. She\'s navigating. They never thought to try.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_act1_60_seescode(),
            delay: 3500
        }, 'tori_act1_59_echoesamazed');
    }

    tori_act1_60_seescode() {
        this.game.displayScene({
            character: 'Tori (internal, curious)',
            dialogue: '"He\'s coding something... What is...? That sprite... that\'s ME."',
            internal: '[Visual: Through laptop screen. Code editor. A web app. "Tori-gatchi."]',
            background: 'apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act1_61_communicationplan(),
            delay: 3000
        }, 'tori_act1_60_seescode');
    }

    // ========================================
    // SCENE 7: HOSPITAL VISIT - SINGLE BUZZ MYSTERY
    // Body connection discovered but NOT understood yet
    // ========================================
    
    tori_act1_61_communicationplan() {
        this.game.displayScene({
            character: 'Tori (internal, excited)',
            dialogue: '"A tamagotchi game?... with dialogue boxes. Text output!! This is it. This is how I can TALK to him!"',
            internal: '[The plan forming. She can hijack the game. Use it to communicate.]',
            background: 'apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act1_62_timepasses(),
            delay: 3500
        }, 'tori_act1_61_communicationplan');
    }

    tori_act1_62_timepasses() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Days pass. She watches him code. Waiting for the right moment.',
            internal: '[Visual: Time passage. Ronnie working. Tori planning. The Echoes watching.]',
            background: 'apartment.png',
            next: () => this.tori_act1_63_hospitaltransition(),
            delay: 3000
        }, 'tori_act1_62_timepasses');
    }

    tori_act1_63_hospitaltransition() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'One day, Ronnie leaves the laptop. Takes only the device. She\'s back in the darkness.',
            internal: '[Snap. The connection breaks. She\'s in the device again. Where is he going?]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_64_hospitalsounds(),
            delay: 3000
        }, 'tori_act1_63_hospitaltransition');
    }

    tori_act1_64_hospitalsounds() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Muffled sounds. Beeping. Hospital machines. The smell would be antiseptic if she could smell.',
            internal: '[He brought the device to the hospital. Near her body.]',
            background: 'hospital.png',
            next: () => this.tori_act1_65_thepull(),
            delay: 3000
        }, 'tori_act1_64_hospitalsounds');
    }

    tori_act1_65_thepull() {
        this.game.displayScene({
            character: 'Tori (internal, surprised)',
            dialogue: '"Wait... what is this? I feel... something. Warmth? A pull?"',
            internal: '[Abstract sensation. Different from the laptop. Magnetic. Calling.]',
            background: 'hospital.png',
            next: () => this.tori_act1_66_experimenting(),
            delay: 3000
        }, 'tori_act1_65_thepull');
    }

    tori_act1_66_experimenting() {
        this.game.displayScene({
            character: 'Tori (internal, curious)',
            dialogue: '"It\'s different from the laptop feeling. What if I push toward it...?"',
            internal: '[She concentrates. Reaches toward the sensation. Pushes.]',
            background: 'hospital.png',
            next: () => this.tori_act1_67_singlebuzz(),
            delay: 3000
        }, 'tori_act1_66_experimenting');
    }

    tori_act1_67_singlebuzz() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'BUZZ.',
            internal: '[Single. Not double. Different signal. The device vibrates once.]',
            background: 'hospital.png',
            next: () => this.tori_act1_68_torirealization(),
            delay: 1500,
            style: 'critical'
        }, 'tori_act1_67_singlebuzz');
    }

    tori_act1_68_torirealization() {
        this.game.displayScene({
            character: 'Tori (internal, confused)',
            dialogue: '"I made that happen. But... only one buzz. Not two. What does that mean?"',
            internal: '[The difference. Double buzz = vessel transfer. Single buzz = something else.]',
            background: 'hospital.png',
            next: () => this.tori_act1_69_ronniedismisses(),
            delay: 3000
        }, 'tori_act1_68_torirealization');
    }

    tori_act1_69_ronniedismisses() {
        this.game.displayScene({
            character: 'Ronnie (muffled, external)',
            dialogue: '"Hmm. Battery acting up again. I should charge this when I get home."',
            internal: '[He moves the device away. The pull fades. The warmth gone.]',
            background: 'hospital.png',
            next: () => this.tori_act1_70_torifrustrated(),
            delay: 3000
        }, 'tori_act1_69_ronniedismisses');
    }

    tori_act1_70_torifrustrated() {
        this.game.displayScene({
            character: 'Tori (internal, frustrated)',
            dialogue: '"No! That was ME! Not the battery! But... why did it feel different?"',
            internal: '[The mystery. Single buzz near body. Double buzz for vessel transfer. What\'s the connection?]',
            background: 'hospital.png',
            next: () => this.tori_act1_71_echo1notes(),
            delay: 3000
        }, 'tori_act1_70_torifrustrated');
    }

    tori_act1_71_echo1notes() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"Single buzz versus double buzz. Two different signals."',            internal: '[The Echoes analyzing. They\'re invested now. She\'s showing them something new.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_act1_72_echo2admits(),
            delay: 2500
        }, 'tori_act1_71_echo1notes');
    }

    tori_act1_72_echo2admits() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"We felt something like that too. Near the body. We dismissed it. Despair said it was irrelevant."',            internal: '[Another failure. They felt the pull but ignored it.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_act1_73_despairinsists(),
            delay: 3000
        }, 'tori_act1_72_echo2admits');
    }

    tori_act1_73_despairinsists() {
        this.game.displayScene({
            character: 'Despair',
            dialogue: '"Because it IS irrelevant! It\'s just a phantom signal. The body is comatose. It means NOTHING."',            internal: '[But Despair sounds less certain. Defensive. She\'s being proven wrong repeatedly.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_act1_74_toridetermined(),
            delay: 3500
        }, 'tori_act1_73_despairinsists');
    }

    tori_act1_74_toridetermined() {
        this.game.displayScene({
            character: 'Tori (internal, resolute)',
            dialogue: '"No. It means SOMETHING. I just don\'t know what yet. But I\'ll figure it out."',
            internal: '[The mystery preserved. She knows there\'s a connection. She just doesn\'t understand it yet.]',
            background: 'digitalSpace.png',
            next: () => this.tori_act1_75_torigatchi(),
            delay: 3500
        }, 'tori_act1_74_toridetermined');
    }

    // ========================================
    // SCENE 8: TORI-GATCHI BREAKTHROUGH
    // Communication achieved - Act 1 complete
    // ========================================
    
    tori_act1_75_torigatchi() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Back home. Device on laptop again. Contact established. She hops deliberately.',
            internal: '[Visual: She\'s getting better at this. The transfer is smoother now.]',
            background: 'apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act1_76_programready(),
            delay: 3000
        }, 'tori_act1_75_torigatchi');
    }

    tori_act1_76_programready() {
        this.game.displayScene({
            character: 'Ronnie (muffled, external)',
            dialogue: '"Okay. Let\'s see if this works. Launching Tori-gatchi..."',
            internal: '[Through laptop: He clicks. The program opens. Her sprite appears on screen.]',
            background: 'apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act1_77_syncmoment(),
            delay: 3000
        }, 'tori_act1_76_programready');
    }

    tori_act1_77_syncmoment() {
        this.game.displayScene({
            character: 'Tori (internal, concentrating)',
            dialogue: '"The game is running. Dialogue system is active. NOW. I sync with it NOW."',
            internal: '[She pushes her consciousness toward the text output. Hijacking the dialogue box.]',
            background: 'apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act1_78_firstwords(),
            delay: 3000
        }, 'tori_act1_77_syncmoment');
    }

    tori_act1_78_firstwords() {
        this.game.displayScene({
            character: 'Tori (through sprite)',
            dialogue: '"Baby? Is that you?"',
            internal: '[Visual: Her words appearing in the dialogue box. Text she didn\'t code. SHE\'S SPEAKING.]',
            background: 'apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act1_79_ronnieconfusion(),
            delay: 3000,
            style: 'critical'
        }, 'tori_act1_78_firstwords');
    }

    tori_act1_79_ronnieconfusion() {
        this.game.displayScene({
            character: 'Ronnie (out loud, shocked)',
            dialogue: '"What the... I didn\'t code that. What\'s happening?"',
            internal: '[Through webcam: His face. Confused. Scared. Hopeful. Recognizing the speech pattern.]',
            background: 'apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act1_80_toripushes(),
            delay: 3000
        }, 'tori_act1_79_ronnieconfusion');
    }

    tori_act1_80_toripushes() {
        this.game.displayScene({
            character: 'Tori (through sprite, urgent)',
            dialogue: '"It\'s me! Tori! I\'m in the device! I\'ve been trying to reach you!"',
            internal: '[Fighting to maintain the connection. Forcing words through the dialogue system.]',
            background: 'apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act1_81_proof(),
            delay: 3500
        }, 'tori_act1_80_toripushes');
    }

    tori_act1_81_proof() {
        this.game.displayScene({
            character: 'Tori (through sprite)',
            dialogue: '"I saw it happen. Through your laptop camera. I tripped on your shoe. There was blood. You called 911."',
            internal: '[Details only she would know. Proof. Evidence. It\'s really her.]',
            background: 'apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act1_82_ronniebelieves(),
            delay: 4000
        }, 'tori_act1_81_proof');
    }

    tori_act1_82_ronniebelieves() {
        this.game.displayScene({
            character: 'Ronnie (out loud, emotional)',
            dialogue: '"Oh my god. It IS you. You\'re really... you\'re in there. How is this possible?"',
            internal: '[Breakthrough. Communication established. He believes. Finally.]',
            background: 'apartment.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'assets/ronnie-sprite.png'
            },
            next: () => this.tori_act1_83_echoesreaction(),
            delay: 3500
        }, 'tori_act1_82_ronniebelieves');
    }

    tori_act1_83_echoesreaction() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"She did it. She NAVIGATED instead of fighting the system."',            internal: '[The Echoes stunned. Despair silent. Everything they believed was wrong.]',
            background: 'digitalSpace.png',
            sprites: {
                left: 'assets/tori-sprite.png',
                right: 'echoes'
            },
            next: () => this.tori_act1_84_torivictory(),
            delay: 4000
        }, 'tori_act1_83_echoesreaction');
    }

    tori_act1_84_torivictory() {
        this.game.displayScene({
            character: 'Tori (internal, triumphant)',
            dialogue: '"I can talk to him. I can MOVE. I\'m not trapped. This isn\'t a cage. It\'s a bridge."',
            internal: '[The foundation established. Communication. Navigation. Hope.]',
            background: 'apartment.png',
            next: () => this.tori_act1_85_transition(),
            delay: 4000
        }, 'tori_act1_84_torivictory');
    }

    tori_act1_85_transition() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Act 1 complete. Communication achieved. The real work begins.',
            internal: '[Visual: Tori and Ronnie connected through the game. Echo Toris watching. A new loop. A new possibility.]',
            background: 'apartment.png',
            next: () => this.route.act2.start(),
            delay: 4000
        }, 'tori_act1_85_transition');
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToriAct1;
}
