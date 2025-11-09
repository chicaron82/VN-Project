// ========================================
// TORI'S ROUTE - ACT 1 (FINAL VERSION)
// Aligned with Shared Prologue
// Coffee anchor + Proper buzz logic
// ========================================

class ToriAct1 {
    constructor(route) {
        this.route = route;
        this.game = route.game;
    }
    
    start() {
        this.scene1_coffee();
    }
    
    // ========================================
    // SCENE 1: STREET BUMP & FIRST TRANSFER
    // Matches shared prologue from Tori's internal perspective
    // ========================================
    
    scene1_coffee() {
        // Unlock Z's first note
        this.route.unlockNote('z1');
        
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"French Vanilla for Ronnie. He always asks for this one."',
            internal: '[Visual: Coffee shop. Tori picks up the drink, checks her Tamagotchi while walking out.]',
            next: () => this.scene1_distracted(),
            delay: 3000
        });
    }

    scene1_distracted() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"My little digital pet needs attention... Ronnie would laugh if he saw how attached I am to this thing."',
            internal: '[She walks down the street, coffee in one hand, her original Tamagotchi in the other, not looking where she\'s going.]',
            next: () => this.scene1_collision(),
            delay: 3000
        });
    }

    scene1_collision() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'THUD.',
            internal: '[She bumps into an older man. Hard. Coffee nearly spills. Both their Tamagotchis tumble to the ground.]',
            next: () => this.scene1_apology(),
            delay: 2000
        });
    }

    scene1_apology() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Oh my gosh, I\'m so sorry! I wasn\'t paying attention—"',
            internal: '[She bends down quickly, embarrassed. Grabs the Tamagotchi closest to her hand.]',
            next: () => this.scene1_pickup_buzz(),
            delay: 2500
        });
    }

    scene1_pickup_buzz() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'BUZZ. BUZZ.',
            internal: '[The device vibrates in her hand. Twice. Sharp. Wrong.]',
            next: () => this.scene1_weird_feeling(),
            delay: 2000,
            style: 'critical'
        });
    }

    scene1_weird_feeling() {
        this.game.displayScene({
            character: 'Tori (internal, confused)',
            dialogue: '"What...? Mine never does that."',
            internal: '[A wave of disorientation. The world tilts slightly. Colors too bright.]',
            next: () => this.scene1_old_man(),
            delay: 2500
        });
    }

    scene1_old_man() {
        this.game.displayScene({
            character: 'Older Man',
            dialogue: '"No problem. Hang on to that. It may save your life someday."',
            internal: '[She glances up but never clearly sees his face. Just a glimpse of a faded BGA hoodie. He walks away with her original device.]',
            next: () => this.scene1_confusion(),
            delay: 3500
        });
    }

    scene1_confusion() {
        this.game.displayScene({
            character: 'Tori (internal, disoriented)',
            dialogue: '"That was... weird. What a strange thing to say."',
            internal: '[She stands, clutching the coffee and the wrong Tamagotchi. Her head pounds. Something feels wrong.]',
            next: () => this.scene1_walking_home(),
            delay: 3000
        });
    }

    scene1_walking_home() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"I should get home. Feel off. Maybe I need to eat something."',
            internal: '[She walks, but everything feels distant. Like moving through water. Autopilot.]',
            next: () => this.scene1_arrival(),
            delay: 3000
        });
    }

    scene1_arrival() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'She arrives home. Ronnie is at his laptop, coding.',
            internal: '[Visual: Their apartment. Familiar. Safe. But something still feels wrong.]',
            next: () => this.scene2_greeting(),
            delay: 2500
        });
    }

    // ========================================
    // SCENE 2: LAPTOP HOP & AWARENESS
    // Second transfer - conscious decision
    // ========================================
    
    scene2_greeting() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Hey babe, got your French Vanilla."',
            internal: '[She hands him the coffee. Sets the Tamagotchi on his laptop, resting against the keyboard.]',
            next: () => this.scene2_device_placement(),
            delay: 2500
        });
    }

    scene2_device_placement() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Can you look at Ronnie-Gatchi later? The battery is draining fast and it\'s buzzing weird—"',
            internal: '[The moment the device touches the laptop...]',
            next: () => this.scene2_double_buzz(),
            delay: 3000
        });
    }

    scene2_double_buzz() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'BUZZ. BUZZ.',
            internal: '[Again. Twice. But this time... different. Like something SHIFTING. Moving.]',
            next: () => this.scene2_sensation(),
            delay: 2000,
            style: 'critical'
        });
    }

    scene2_sensation() {
        this.game.displayScene({
            character: 'Tori (internal, alarmed)',
            dialogue: '"What is...? I feel... more space? Like I\'m... somewhere else?"',
            internal: '[Visual: Abstract sensation. Expansion. The laptop represents possibility.]',
            next: () => this.scene2_awareness(),
            delay: 3000
        });
    }

    scene2_awareness() {
        this.game.displayScene({
            character: 'Tori (internal, discovering)',
            dialogue: '"I can... see? Through the screen? This is..."',
            internal: '[Suddenly she has VISION. Awareness. She can see Ronnie. See the room. But from the laptop perspective.]',
            next: () => this.scene2_realization(),
            delay: 3000
        });
    }

    scene2_realization() {
        this.game.displayScene({
            character: 'Tori (internal, panicking)',
            dialogue: '"Wait. I\'m IN the laptop. But I\'m also... standing right there."',
            internal: '[Horror dawns. She can see HERSELF. Physical Tori, talking to Ronnie.]',
            next: () => this.scene2_ronnie_response(),
            delay: 3500
        });
    }

    scene2_ronnie_response() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Ya sure i can look at it. Why do you call it Ronnie-Gatchi anyway?"',
            internal: '[He\'s talking to physical Tori. Digital Tori is watching, screaming silently.]',
            next: () => this.scene2_physical_tori(),
            delay: 3000
        });
    }

    scene2_physical_tori() {
    this.game.displayScene({
        character: 'Tori (both)',
        dialogue: '"Oh you know, because this thing is sooo cute. And what better way to name it than after my man - who\'s even cuter!"',
        internal: '[Digital Tori (internal, horrified): "Wait... I\'m saying this. But SHE\'S saying this. We\'re both... the same words..."]',
        next: () => this.scene2_digital_horror(),
        delay: 3000
    });
}

    scene2_digital_horror() {
        this.game.displayScene({
            character: 'Tori (internal, terrified)',
            dialogue: '"That\'s ME. Talking. Moving. But I\'m HERE. In the laptop. How is this possible?"',
            internal: '[Visual: Split perspective. Physical Tori in the room. Digital Tori watching through screen.]',
            next: () => this.scene3_dual_watching(),
            delay: 3500
        });
    }

    // ========================================
    // SCENE 3: DUAL TORI WATCHING
    // Digital Tori watches physical Tori
    // ========================================
    
    scene3_dual_watching() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"you\'re such a dork, honey"',
            internal: '[He teases. Physical Tori smiles.]',
            next: () => this.scene3_tori_response(),
            delay: 2500
        });
    }

    scene3_tori_response() {
        this.game.displayScene({
            character: 'Tori (physical)',
            dialogue: '"Yeah but you still love me. I\'ll get dinner started."',
            internal: '[She leans in, kisses him. Digital Tori feels nothing. Just watches.]',
            next: () => this.scene3_walking_backward(),
            delay: 3000
        });
    }

    scene3_walking_backward() {
        this.game.displayScene({
            character: 'Tori (internal, desperate)',
            dialogue: '"Wait, what are you doing? Don\'t walk backward—there\'s a shoe on the floor—"',
            internal: '[Physical Tori walks backward toward the kitchen, playful. Not watching where she\'s going.]',
            next: () => this.scene3_warning(),
            delay: 3000
        });
    }

    scene3_warning() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Babe, watch ou—!"',
            internal: '[Digital Tori sees it. The shoe. Physical Tori steps on it.]',
            next: () => this.scene3_scream(),
            delay: 2000
        });
    }

    scene3_scream() {
        this.game.displayScene({
            character: 'Tori (internal, screaming)',
            dialogue: '"NO! STOP! DON\'T—!"',
            internal: '[Silent scream. Physical Tori can\'t hear. Digital Tori is helpless.]',
            next: () => this.scene4_the_fall(),
            delay: 2000
        });
    }

    // ========================================
    // SCENE 4: THE FALL & SEPARATION
    // Physical Tori enters coma
    // ========================================
    
    scene4_the_fall() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'She trips. Falls. Hard.',
            internal: '[Visual: Physical Tori crashes to the floor. Ronnie lunges but is too late.]',
            next: () => this.scene4_impact(),
            delay: 2500,
            style: 'critical'
        });
    }

    scene4_impact() {
        this.game.displayScene({
            character: 'Tori (internal, horrified)',
            dialogue: '"Get up. GET UP. Please get up—"',
            internal: '[Physical Tori doesn\'t move. Ronnie kneels beside her, panicking.]',
            next: () => this.scene4_ronnie_panic(),
            delay: 3000
        });
    }

    scene4_ronnie_panic() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Tori! Baby! Can you hear me?!"',
            internal: '[He\'s shaking her. Pulling out his phone. Calling 911.]',
            next: () => this.scene4_digital_helpless(),
            delay: 3000
        });
    }

    scene4_digital_helpless() {
        this.game.displayScene({
            character: 'Tori (internal, desperate)',
            dialogue: '"I\'m RIGHT HERE! I can SEE you! Why can\'t you see ME?!"',
            internal: '[She screams through the laptop. No sound. He can\'t hear.]',
            next: () => this.scene4_ambulance(),
            delay: 3000
        });
    }

    scene4_ambulance() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Sirens. Paramedics. They take her body away.',
            internal: '[Through the laptop camera, digital Tori watches everything. Helpless. Screaming silently.]',
            next: () => this.scene4_understanding(),
            delay: 3500
        });
    }

    scene4_understanding() {
        this.game.displayScene({
            character: 'Tori (internal, realizing)',
            dialogue: '"Oh god. I\'m not in my body anymore. I\'m... I\'m trapped in here. And she... I... we..."',
            internal: '[The separation is complete. Physical Tori is in a coma. Digital Tori is in the laptop.]',
            next: () => this.scene4_alone(),
            delay: 4000
        });
    }

    scene4_alone() {
        this.game.displayScene({
            character: 'Tori (internal, breaking)',
            dialogue: '"What do I do? How do I fix this? How do I get BACK?!"',
            internal: '[Ronnie leaves with the ambulance. The apartment is empty. Digital Tori is alone.]',
            next: () => this.scene5_void(),
            delay: 3500
        });
    }

    // ========================================
    // SCENE 5: VOID AWAKENING (TIME SKIP)
    // Days/weeks later - Echo Toris introduction
    // ========================================
    
    scene5_void() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Time passes. Days? Weeks? Hard to tell. Ronnie takes the device everywhere.',
            internal: '[Visual: Time skip. Darkness. The void of the Tamagotchi system.]',
            next: () => this.scene5_awakening(),
            delay: 3500
        });
    }

    scene5_awakening() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Pure black. No sound. Then - a faint digital hum.',
            internal: '[Visual: She\'s no longer in the laptop. The device moved. Now she\'s... somewhere else. Smaller. Darker.]',
            next: () => this.scene5_where(),
            delay: 3000
        });
    }

    scene5_where() {
        this.game.displayScene({
            character: 'Tori (internal, disoriented)',
            dialogue: '"Where am I now? This isn\'t the laptop anymore..."',
            internal: '[Beat of silence. Then overlapping whispers - faint, distorted.]',
            next: () => this.scene5_echoes_whispers(),
            delay: 2500
        });
    }

    scene5_echoes_whispers() {
        this.game.displayScene({
            character: 'Echoes (distant whispers)',
            dialogue: 'Echo 1: "...again..."\nEcho 2: "...he tried..."\nDespair: "...doesn\'t matter..."',
            echoes: {
                echo1: '...again...',
                echo2: '...he tried...',
                despair: '...doesn\'t matter...'
            },
            internal: '[Visual: Voices from nowhere. Other consciousnesses in this space.]',
            next: () => this.scene5_tori_who(),
            delay: 3000
        });
    }

    scene5_tori_who() {
        this.game.displayScene({
            character: 'Tori (internal, alarmed)',
            dialogue: '"Who\'s there? Where am I?"',
            internal: '[The whispers grow louder, more distinct.]',
            next: () => this.scene5_echoes_reveal(),
            delay: 2500
        });
    }

    scene5_echoes_reveal() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"You\'re in the device. The Tamagotchi. With us."',
            echoes: {
                echo1: 'You\'re in the device. The Tamagotchi. With us.'
            },
            internal: '[Visual: Three figures materializing from the darkness - Echo Toris.]',
            next: () => this.scene5_echo2_explains(),
            delay: 2500
        });
    }

    scene5_echo2_explains() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"We\'re what came before you. Different loops. Different attempts."',
            echoes: {
                echo2: 'We\'re what came before you. Different loops. Different attempts.'
            },
            internal: '[Visual: Echo Toris - similar but different. Worn down versions.]',
            next: () => this.scene5_despair_introduces(),
            delay: 3000
        });
    }

    scene5_despair_introduces() {
        this.game.displayScene({
            character: 'Despair',
            dialogue: '"Despair. That\'s what they call me. Because that\'s what you\'ll feel. Eventually."',
            echoes: {
                despair: 'Despair. That\'s what they call me. Because that\'s what you\'ll feel. Eventually.'
            },
            internal: '[Visual: Despair - the most worn down, the most bitter.]',
            next: () => this.scene5_tori_sees_hospital(),
            delay: 3000
        });
    }

    scene5_tori_sees_hospital() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Through the tiny device screen, she sees the hospital room. Her body. Ronnie sitting beside it.',
            internal: '[Visual: First glimpse through the Tamagotchi interface. So limited compared to laptop.]',
            next: () => this.scene5_tori_screams(),
            delay: 3000
        });
    }

    scene5_tori_screams() {
        this.game.displayScene({
            character: 'Tori (internal, desperate)',
            dialogue: '"RONNIE! I\'m RIGHT HERE! Can you hear me?!"',
            internal: '[She screams, but no sound comes out. The device is silent.]',
            next: () => this.scene5_echoes_response(),
            delay: 3000
        });
    }

    scene5_echoes_response() {
        this.game.displayScene({
            character: 'Echoes (overlapping)',
            dialogue: 'Echo 1: "He can\'t hear you. Not from here."\nEcho 2: "We tried screaming too. Never worked."\nDespair: "Screamed until our voices broke. Until we broke. Never thought there might be other ways to reach him."',
            echoes: {
                echo1: 'He can\'t hear you. Not from here.',
                echo2: 'We tried screaming too. Never worked.',
                despair: 'Screamed until our voices broke. Until we broke. Never thought there might be other ways to reach him.'
            },
            internal: '[Visual: The weight of their failed attempts.]',
            next: () => this.scene5_tori_defiance(),
            delay: 4000
        });
    }

    scene5_tori_defiance() {
        this.game.displayScene({
            character: 'Tori (internal, determined)',
            dialogue: '"Then I\'ll find another way. If screaming doesn\'t work... I\'ll try something different."',
            internal: '[Visual: Despite everything, she\'s not giving up.]',
            next: () => this.scene6_learning(),
            delay: 3000
        });
    }

    // ========================================
    // SCENE 6: LEARNING THE DEVICE
    // Understanding limitations & discovering the key insight
    // ========================================
    
    scene6_learning() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'She explores her new environment. The digital space of the Tamagotchi device.',
            internal: '[Visual: Abstract digital space. Much more limited than the laptop was.]',
            next: () => this.scene6_understanding(),
            delay: 2500
        });
    }

    scene6_understanding() {
        this.game.displayScene({
            character: 'Tori (internal, analytical)',
            dialogue: '"Okay. Tiny screen. Basic outputs. No keyboard. No text interface like the laptop had."',
            internal: '[Visual: Examining the system boundaries. Learning what\'s possible.]',
            next: () => this.scene6_limitations(),
            delay: 2500
        });
    }

    scene6_limitations() {
        this.game.displayScene({
            character: 'Tori (internal, frustrated)',
            dialogue: '"How am I supposed to communicate through THIS? It\'s so limited..."',
            internal: '[Visual: The device\'s constraints becoming clear.]',
            next: () => this.scene6_echo1_commentary(),
            delay: 3000
        });
    }

    scene6_echo1_commentary() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"You can\'t. That\'s why we failed. We tried to break through the system."',
            echoes: {
                echo1: 'You can\'t. That\'s why we failed. We tried to break through the system.'
            },
            internal: '[Visual: Echo 1 explaining their approach.]',
            next: () => this.scene6_echo2_adds(),
            delay: 3000
        });
    }

    scene6_echo2_adds() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"Tried breaking out. Forcing our way through. Never thought to work WITH it. Never tried navigating."',
            echoes: {
                echo2: 'Tried breaking out. Forcing our way through. Never thought to work WITH it. Never tried navigating.'
            },
            internal: '[Visual: The key distinction - force vs navigation.]',
            next: () => this.scene6_tori_insight(),
            delay: 3000
        });
    }

    scene6_tori_insight() {
        this.game.displayScene({
            character: 'Tori (internal, realizing)',
            dialogue: '"You tried to escape. But what if this isn\'t a cage? What if it\'s something I can navigate THROUGH?"',
            internal: '[Visual: Shift in perspective. The system as tool, not prison.]',
            next: () => this.scene6_despair_scoffs(),
            delay: 3000
        });
    }

    scene6_despair_scoffs() {
        this.game.displayScene({
            character: 'Despair',
            dialogue: '"Navigate? You\'re delusional. The original never wakes up. We\'re just copies. Backups. Stuck here while the body dies."',
            echoes: {
                despair: 'Navigate? You\'re delusional. The original never wakes up. We\'re just copies. Backups. Stuck here while the body dies.'
            },
            internal: '[Visual: Despair\'s nihilism. The crushing weight of her certainty.]',
            next: () => this.scene6_tori_the_pull(),
            delay: 3500
        });
    }

    scene6_tori_the_pull() {
        this.game.displayScene({
            character: 'Tori (internal, questioning)',
            dialogue: '"But... the PULL. When I\'m near my body. That warmth. The buzz. You felt that too, right?"',
            internal: '[Visual: Tori remembering something. A sensation from the hospital.]',
            next: () => this.scene6_echo1_dismissal(),
            delay: 3000
        });
    }

    scene6_echo1_dismissal() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"...We felt something. Dismissed it."',
            echoes: {
                echo1: '...We felt something. Dismissed it.'
            },
            internal: '[Visual: Echo 1 uncomfortable, remembering.]',
            next: () => this.scene6_echo2_admits(),
            delay: 2500
        });
    }

    scene6_echo2_admits() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"Despair said it was nothing. Phantom sensations. We listened to her."',
            echoes: {
                echo2: 'Despair said it was nothing. Phantom sensations. We listened to her.'
            },
            internal: '[Visual: Echo 2 looking at Despair, realization dawning.]',
            next: () => this.scene6_despair_insists(),
            delay: 3000
        });
    }

    scene6_despair_insists() {
        this.game.displayScene({
            character: 'Despair',
            dialogue: '"Because it IS nothing! False hope. The body doesn\'t know we\'re here. It\'s dying. We\'re stuck. Accept it."',
            echoes: {
                despair: 'Because it IS nothing! False hope. The body doesn\'t know we\'re here. It\'s dying. We\'re stuck. Accept it.'
            },
            internal: '[Visual: Despair defensive. Angry. Scared of hope.]',
            next: () => this.scene6_tori_revelation(),
            delay: 3500
        });
    }

    scene6_tori_revelation() {
        this.game.displayScene({
            character: 'Tori (internal, defiant)',
            dialogue: '"You\'re WRONG. That pull is REAL. It means something. That\'s the connection. That\'s how I get back. That\'s how I WAKE UP."',
            internal: '[Visual: Determination. She\'s found her path. The Echoes failed because they gave up on the body connection.]',
            next: () => this.scene6_echo1_hope(),
            delay: 4000,
            style: 'critical'
        });
    }

    scene6_echo1_hope() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"...What if she\'s right? What if we gave up too soon?"',
            echoes: {
                echo1: '...What if she\'s right? What if we gave up too soon?'
            },
            internal: '[Visual: Echo 1 watching Tori with something like hope.]',
            next: () => this.scene6_tori_needs_platform(),
            delay: 2500
        });
    }

    scene6_tori_needs_platform() {
        this.game.displayScene({
            character: 'Tori (internal, planning)',
            dialogue: '"This device is too limited. But if I could reach a bigger platform... something with text output..."',
            internal: '[Visual: Strategy forming. She needs the right tool to communicate.]',
            next: () => this.scene6_waiting(),
            delay: 3000
        });
    }

    scene6_waiting() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Days pass. She watches Ronnie through the device. Waiting. Learning. Planning.',
            internal: '[Visual: Time passage. Tori studying the system, understanding its rhythms.]',
            next: () => this.scene7_ronnie_coding(),
            delay: 3000
        });
    }

    // ========================================
    // SCENE 7: THE BREAKTHROUGH (TORI-GATCHI)
    // She forces communication through the game
    // ========================================
    
    scene7_ronnie_coding() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Through the device screen, she watches Ronnie at his laptop. He\'s coding something.',
            internal: '[Visual: Ronnie\'s laptop screen visible through device connection.]',
            next: () => this.scene7_tori_watches(),
            delay: 2500
        });
    }

    scene7_tori_watches() {
        this.game.displayScene({
            character: 'Tori (internal, curious)',
            dialogue: '"What are you making? It looks like... a game?"',
            internal: '[Visual: Code appearing on screen. A visual novel engine.]',
            next: () => this.scene7_sees_sprite(),
            delay: 2500
        });
    }

    scene7_sees_sprite() {
        this.game.displayScene({
            character: 'Tori (internal, emotional)',
            dialogue: '"That sprite... that\'s ME. You\'re building me into a game. Oh baby..."',
            internal: '[Visual: Digital Tori sprite appearing in the code. Her likeness. His coping mechanism.]',
            next: () => this.scene7_realization(),
            delay: 3000
        });
    }

    scene7_realization() {
        this.game.displayScene({
            character: 'Tori (internal, excited)',
            dialogue: '"Wait. A visual novel has TEXT OUTPUT. Dialogue boxes. A way to SPEAK!"',
            internal: '[Visual: The breakthrough moment. This is her platform!]',
            next: () => this.scene7_echoes_notice(),
            delay: 3000,
            style: 'critical'
        });
    }

    scene7_echoes_notice() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"She\'s right. We never had access to a program like this."',
            echoes: {
                echo1: 'She\'s right. We never had access to a program like this.'
            },
            internal: '[Visual: Echo Toris gathering, watching with interest.]',
            next: () => this.scene7_echo2_amazed(),
            delay: 2500
        });
    }

    scene7_echo2_amazed() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"He\'s giving her the exact tool she needs. He doesn\'t even know it."',
            echoes: {
                echo2: 'He\'s giving her the exact tool she needs. He doesn\'t even know it.'
            },
            internal: '[Visual: The irony - he\'s creating her escape route without realizing.]',
            next: () => this.scene7_tori_focus(),
            delay: 3000
        });
    }

    scene7_tori_focus() {
        this.game.displayScene({
            character: 'Tori (internal, determined)',
            dialogue: '"Okay. When he runs the program... I need to be ready. I need to sync with it."',
            internal: '[Visual: Preparation. She\'s studying the code, understanding the structure.]',
            next: () => this.scene7_program_launches(),
            delay: 3000
        });
    }

    scene7_program_launches() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Ronnie saves the file. Launches the program. The Tori-gatchi window opens.',
            internal: '[Visual: Program starting. Digital Tori sprite appears on screen.]',
            next: () => this.scene7_sync_moment(),
            delay: 2500
        });
    }

    scene7_sync_moment() {
        this.game.displayScene({
            character: 'Tori (internal, concentrating)',
            dialogue: '"NOW!"',
            internal: '[Visual: She pushes herself toward the program. Forcing connection. Synchronizing with the output.]',
            next: () => this.scene7_sprite_glitch(),
            delay: 2000
        });
    }

    scene7_sprite_glitch() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The sprite flickers. The dialogue box appears... but the text isn\'t what Ronnie coded.',
            internal: '[Visual: Glitch effect. System responding to her intrusion.]',
            next: () => this.scene7_first_words(),
            delay: 2500
        });
    }

    scene7_first_words() {
        this.game.displayScene({
            character: 'Tori (through sprite)',
            dialogue: '"Baby? Is that you?"',
            internal: '[Visual: Her words appearing in the dialogue box. SHE\'S SPEAKING. Finally.]',
            next: () => this.scene7_ronnie_confusion(),
            delay: 3000,
            style: 'critical'
        });
    }

    scene7_ronnie_confusion() {
        this.game.displayScene({
            character: 'Ronnie (out loud, confused)',
            dialogue: '"What the... I didn\'t code that."',
            internal: '[Through device screen: His face. Confused. Scared. Hopeful.]',
            next: () => this.scene7_tori_pushes(),
            delay: 2500
        });
    }

    scene7_tori_pushes() {
        this.game.displayScene({
            character: 'Tori (through sprite, urgent)',
            dialogue: '"It\'s me, Tori! I\'m here! I\'m in the device!"',
            internal: '[Visual: She\'s forcing more text through. Fighting to maintain the connection.]',
            next: () => this.scene7_connection_made(),
            delay: 3000
        });
    }

    scene7_connection_made() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Breakthrough. After weeks of silence. She can finally SPEAK to him.',
            internal: '[Visual: Connection established. Communication possible.]',
            next: () => this.scene7_echoes_shocked(),
            delay: 3000,
            style: 'critical'
        });
    }

    scene7_echoes_shocked() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"She did it. She actually communicated."',
            echoes: {
                echo1: 'She did it. She actually communicated.'
            },
            internal: '[Visual: Echo Toris watching in amazement.]',
            next: () => this.scene7_echo2_realization(),
            delay: 2500
        });
    }

    scene7_echo2_realization() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"We could have done this. If we\'d just... navigated instead of fighting."',
            echoes: {
                echo2: 'We could have done this. If we\'d just... navigated instead of fighting.'
            },
            internal: '[Visual: The weight of missed opportunities.]',
            next: () => this.scene7_despair_bitter(),
            delay: 3000
        });
    }

    scene7_despair_bitter() {
        this.game.displayScene({
            character: 'Despair',
            dialogue: '"Congratulations. You can talk. Won\'t change anything. Our body is still in a coma."',
            echoes: {
                despair: 'Congratulations. You can talk. Won\'t change anything. Our body is still in a coma.'
            },
            internal: '[Visual: Despair refusing to celebrate. Still bitter.]',
            next: () => this.scene7_tori_victory(),
            delay: 3000
        });
    }

    scene7_tori_victory() {
        this.game.displayScene({
            character: 'Tori (internal, triumphant)',
            dialogue: '"Maybe. But at least I can TRY. That\'s more than you ever did."',
            internal: '[Visual: Defiance. She proved them wrong once. She\'ll prove Despair wrong too.]',
            next: () => this.scene8_hospital_visit(),
            delay: 3000
        });
    }

    // ========================================
    // SCENE 8: FIRST HOSPITAL VISIT - SINGLE BUZZ
    // Discovering the body connection
    // ========================================
    
    scene8_hospital_visit() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Days after the breakthrough. Ronnie visits the hospital, bringing the device with him.',
            internal: '[Visual: Hospital room. Her body in the bed. Device in his hand.]',
            next: () => this.scene8_device_placed(),
            delay: 2500
        });
    }

    scene8_device_placed() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'He places the device on the table near her body. Sits down. Holds her hand.',
            internal: '[Visual: Device proximity to physical Tori. Something shifts.]',
            next: () => this.scene8_tori_feels(),
            delay: 2500
        });
    }

    scene8_tori_feels() {
        this.game.displayScene({
            character: 'Tori (internal, surprised)',
            dialogue: '"Wait... I feel something. Like... warmth? A pull toward... toward HER. Toward ME."',
            internal: '[Visual: Abstract sensation - magnetism toward her body.]',
            next: () => this.scene8_experimenting(),
            delay: 2500
        });
    }

    scene8_experimenting() {
        this.game.displayScene({
            character: 'Tori (internal, curious)',
            dialogue: '"What if I... push toward it? Toward her. Toward my body."',
            internal: '[Visual: She concentrates. Reaches toward the sensation.]',
            next: () => this.scene8_single_buzz(),
            delay: 2500
        });
    }

    scene8_single_buzz() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'BUZZ.',
            internal: '[Visual: Single buzz. The device vibrates once on the table.]',
            next: () => this.scene8_tori_excitement(),
            delay: 2000,
            style: 'critical'
        });
    }

    scene8_tori_excitement() {
        this.game.displayScene({
            character: 'Tori (internal, excited)',
            dialogue: '"I DID THAT! I made it buzz! I can cause physical effects!"',
            internal: '[Visual: Discovery. She has more power than she thought.]',
            next: () => this.scene8_ronnie_dismisses(),
            delay: 2500
        });
    }

    scene8_ronnie_dismisses() {
        this.game.displayScene({
            character: 'Ronnie (out loud)',
            dialogue: '"Hmm. Battery must be low."',
            internal: '[He checks the device briefly, then puts it back. Doesn\'t see the pattern.]',
            next: () => this.scene8_tori_frustration(),
            delay: 2500
        });
    }

    scene8_tori_frustration() {
        this.game.displayScene({
            character: 'Tori (internal, frustrated)',
            dialogue: '"NO! It wasn\'t the battery! That was ME! I\'m trying to show you something!"',
            internal: '[Visual: Frustration. He\'s so close to understanding but misses it.]',
            next: () => this.scene8_echo1_notes(),
            delay: 3000
        });
    }

    scene8_echo1_notes() {
        this.game.displayScene({
            character: 'Echo 1',
            dialogue: '"Interesting. Proximity to the body creates effects."',
            echoes: {
                echo1: 'Interesting. Proximity to the body creates effects.'
            },
            internal: '[Visual: Echoes analyzing the discovery.]',
            next: () => this.scene8_echo2_adds(),
            delay: 2500
        });
    }

    scene8_echo2_adds() {
        this.game.displayScene({
            character: 'Echo 2',
            dialogue: '"We never figured that out. We were too busy trying to escape to explore it."',
            echoes: {
                echo2: 'We never figured that out. We were too busy trying to escape to explore it.'
            },
            internal: '[Visual: Recognition of their failure to investigate.]',
            next: () => this.scene8_despair_dismisses(),
            delay: 2500
        });
    }

    scene8_despair_dismisses() {
        this.game.displayScene({
            character: 'Despair',
            dialogue: '"Doesn\'t matter. He dismissed it. He\'ll never understand. The pattern means nothing."',
            echoes: {
                despair: 'Doesn\'t matter. He dismissed it. He\'ll never understand. The pattern means nothing.'
            },
            internal: '[Visual: Despair being characteristically pessimistic.]',
            next: () => this.scene8_tori_determined(),
            delay: 2500
        });
    }

    scene8_tori_determined() {
        this.game.displayScene({
            character: 'Tori (internal, resolute)',
            dialogue: '"He will. I\'ll make the pattern stronger. I\'ll make him see it. Whatever it takes. I\'m going to wake up."',
            internal: '[Visual: Determination. This is just the beginning. Main protagonist energy.]',
            next: () => this.scene8_transition(),
            delay: 3000
        });
    }

    scene8_transition() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'First communication: achieved. Body connection: discovered. Now the real work begins.',
            internal: '[Visual: Tori in the system, planning her path home. Act 1 complete.]',
            next: () => this.route.startAct2(),
            delay: 4000
        });
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToriAct1;
}
