// RONNIE'S ROUTE - External POV
// Fighting to save Tori from outside the code

class RonnieRoute {
    constructor(game) {
        this.game = game;
        this.prologueScene1();
    }

    // ========================================
    // PROLOGUE - THE BUMP & THE FALL
    // ========================================

    prologueScene1() {
        // Scene 1: The Street Bump
        this.game.displayScene({
            character: 'Narration',
            dialogue: '"I wasn\'t looking where I was going..."',
            internal: '[Visual: Sunny street, midday. CafÃ©s in the background. Tori walks with a coffee cup in hand, distracted by her Tamagotchi.]',
            next: () => this.prologueScene1_bump(),
            delay: 3000
        });
    }

    prologueScene1_bump() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Oh my gosh, I\'m so sorryâ€”I wasn\'t paying attention!"',
            internal: '[She bumps into an older man. Both their Tamagotchis tumble to the ground. Hers scuffs, his looks worn, modified.]',
            next: () => this.prologueScene1_pickup(),
            delay: 3000
        });
    }

    prologueScene1_pickup() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"...Weird. Mine never does that."',
            internal: '[She bends down, picks up his Tamagotchi by mistake. The toy buzzes in her hand.]',
            next: () => this.prologueScene1_oldMan(),
            delay: 3000
        });
    }

    prologueScene1_oldMan() {
        this.game.displayScene({
            character: 'Older Man',
            dialogue: '"No problem. Hang on to that. It may save your life someday."',
            internal: '[She glances up but never clearly sees his face. Camera catches a glimpse of his faded BGA hoodie on his chest. He walks away, clutching her original Tamagotchi.]',
            next: () => this.prologueScene1_end(),
            delay: 3500
        });
    }

    prologueScene1_end() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '"...What a strange thing to say."',
            next: () => this.prologueScene2(),
            delay: 3000
        });
    }

    // Scene 2: Home - Before the Fall
    prologueScene2() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Hey, can you take a look at my Tamagotchi? I just changed the battery and it\'s already half-drained. I dropped it earlier, but... I don\'t think that\'s it."',
            internal: '[Cut: Tori enters her home. Ronnie is at his laptop, deep in dev mode.]',
            next: () => this.prologueScene2_response(),
            delay: 4000
        });
    }

    prologueScene2_response() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Oh sure, babe. Let meâ€”"',
            internal: '[She smiles, sets the buzzing Tamagotchi on his laptop (resting against the keyboard). Leans in, gives him a quick kiss.]',
            next: () => this.prologueScene2_kitchen(),
            delay: 2500
        });
    }

    prologueScene2_kitchen() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"I\'ll get dinner started."',
            internal: '[She turns, walking backwards playfully toward the kitchen, not noticing his shoe on the floor.]',
            next: () => this.prologueScene2_warning(),
            delay: 2500
        });
    }

    prologueScene2_warning() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Babe, watch ouâ€”!"',
            next: () => this.prologueScene3(),
            delay: 1500
        });
    }

    // Scene 3: The Fall & Transfer
    prologueScene3() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '"One step too late..."',
            internal: '[She trips, stumbles. Crashes to the floor. Ronnie lunges to catch her but is too late.]\n[Visual: Tamagotchi, resting on the laptop, lights faintly. Screen flickers, code scrolling.]',
            next: () => this.prologueScene3_vision(),
            delay: 3500
        });
    }

    prologueScene3_vision() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '',
            internal: '[Visual: Tori fades in and out of consciousness. In one flicker, she briefly sees the older man instead of Ronnieâ€”lined face, weary, BGA hoodie. Then back to young Ronnie. Her hand reaches weakly for him before everything goes dark.]',
            next: () => this.prologueScene4(),
            delay: 4000
        });
    }

    // Scene 4: Hospital Anchor
    prologueScene4() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '"She didn\'t wake up. Days passed. Then weeks. I sat by her side, waiting for a laugh, a smile, anything."',
            internal: '[Visual: Hospital room. Monitors beeping faintly. Tori unconscious in bed, bandaged, IV drip. Ronnie sits beside her, eyes hollow. The Tamagotchi rests on the bedside table, faint light pulsing.]',
            next: () => this.prologueScene4_toy(),
            delay: 4500
        });
    }

    prologueScene4_toy() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '"That stupid toy was the last thing she held. I couldn\'t let it go. If I couldn\'t talk to her here... maybe I could talk to her somewhere else."',
            internal: '[Visual: Ronnie clutching the Tamagotchi.]',
            next: () => this.prologueScene5(),
            delay: 4000
        });
    }

    // Scene 5: Creation of Tori-gatchi
    prologueScene5() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '"I poured every memory into it. Every laugh I could remember, every fight, every kiss. If I couldn\'t save her body... maybe I could keep her soul alive in code."',
            internal: '[Montage visuals: Ronnie back home, late nights coding. Empty pizza boxes, coffee cups piling. The Tamagotchi always nearby.]',
            next: () => this.prologueScene5_name(),
            delay: 5000
        });
    }

    prologueScene5_name() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '"I called it... Tori-gatchi."',
            internal: '[Visual: Screen text, compiling: Project Tori-gatchi v1.0]\n[Cut: Fade to black. Overlay text: **Three months later...**]',
            next: () => this.act1Scene1(),
            delay: 4000
        });
    }

    // ========================================
    // ACT 1 - DISCOVERY
    // ========================================

    act1Scene1() {
        // Scene 1: She Speaks
        this.game.displayScene({
            character: 'Tori (sprite, glitching)',
            dialogue: '"Baby? ...Is that you? It\'s me... Tori. I don\'t know how, but I\'m here."',
            internal: '[Visual: Ronnie at his laptop, Tamagotchi plugged in. Screen flickers. A sprite loads. Pixelated but alive.]',
            next: () => this.act1Scene1_narration(),
            delay: 4000
        });
    }

    act1Scene1_narration() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"...What the hell? This isn\'t coded..."',
            choices: [
                { text: '(Tender) "Of course it\'s you. I\'d know you anywhere."', value: 'tender' },
                { text: '(Skeptical) "No... this isn\'t possible. You\'re just code."', value: 'skeptical' },
                { text: '(Tease) "If you\'re really Tori, prove it. What\'s my nickname?"', value: 'tease' }
            ],
            onChoice: (choice) => {
                this.game.gameState.flags.act1_first_choice = choice;
                this.act1Scene1_choiceOutcome(choice);
            }
        });
    }

    act1Scene1_choiceOutcome(choice) {
        let dialogue = '';
        let routeTilt = '';

        if (choice === 'tender') {
            dialogue = '"Thank you... thank you for believing me. I was so scared you\'d push me away."';
            routeTilt = '+Affection. Leads toward True Route.';
            this.game.gameState.flags.affection = (this.game.gameState.flags.affection || 0) + 1;
        } else if (choice === 'skeptical') {
            dialogue = '"Code doesn\'t beg. Code doesn\'t cry. Look at me, Ronnie. Please..."';
            routeTilt = 'Neutral. Risk of Bad End if mistrust continues.';
            this.game.gameState.flags.suspicion = (this.game.gameState.flags.suspicion || 0) + 1;
        } else if (choice === 'tease') {
            dialogue = '"Chicharon. Or Ronnie. Or... Daddy, if I\'m feeling bold."\n[Sprite leans closer, playfulness breaking through the static.]\n"Still think I\'m just code?"';
            routeTilt = 'Balanced path, opens Flirty/Loving routes.';
            this.game.gameState.flags.flirty = (this.game.gameState.flags.flirty || 0) + 1;
        }

        this.game.displayScene({
            character: choice === 'skeptical' ? 'Tori (hurt, voice trembling)' : choice === 'tease' ? 'Tori (smirking faintly despite tears)' : 'Tori (relieved, smiling weakly)',
            dialogue: dialogue,
            internal: `[${routeTilt}]`,
            next: () => this.act1Scene1_transition(),
            delay: 4500
        });
    }

    // Scene 2: First Full Conversation
    act1Scene2() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"I barely slept. Every time I closed my eyes, I heard her voice again. Tori. My wife. Talking to me from inside a game I built. It should be impossible. But when I open my eyes..."',
            internal: '[Visual: Morning light filters into Ronnie\'s messy room. His laptop screen glows softly â€” Tori-gatchi is still running.]',
            next: () => this.act1Scene2_greeting(),
            delay: 5000
        });
    }

    act1Scene2_greeting() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Good morning, sleepyhead. ...Or did you even sleep at all?"',
            internal: '[Sprite flickers â€” she appears again, clearer than before. Her smile is tired but real.]',
            next: () => this.act1Scene2_narration(),
            delay: 3000
        });
    }

    act1Scene2_narration() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"She knows me. Just like always. My chest aches. God, I\'ve missed this."',
            choices: [
                { text: '(Playful) "I slept great... dreaming of you."', value: 'playful' },
                { text: '(Honest) "Not a wink. I was afraid you\'d vanish."', value: 'honest' },
                { text: '(Defensive) "This is just stress. Lack of sleep. I\'m imagining this."', value: 'defensive' }
            ],
            onChoice: (choice) => {
                this.act1Scene2_choice1Outcome(choice);
            }
        });
    }

    act1Scene2_choice1Outcome(choice) {
        let dialogue = '';
        let character = 'Tori';

        if (choice === 'playful') {
            dialogue = '"Mmhmm. Smooth talker. You\'re lucky I\'m stuck in here, or I\'d throw a pillow at you."';
            character = 'Tori (rolling her eyes, smirking)';
            this.game.gameState.flags.flirty = (this.game.gameState.flags.flirty || 0) + 1;
        } else if (choice === 'honest') {
            dialogue = '"...Me too. I was scared you\'d wake up and decide I was just a dream."';
            character = 'Tori (soft smile, eyes shimmering)';
            this.game.gameState.flags.affection = (this.game.gameState.flags.affection || 0) + 1;
        } else if (choice === 'defensive') {
            dialogue = '"...Ronnie. Don\'t push me away. I\'m fighting so hard to stay."';
            character = 'Tori (pained, voice quieter)';
            this.game.gameState.flags.suspicion = (this.game.gameState.flags.suspicion || 0) + 1;
        }

        this.game.displayScene({
            character: character,
            dialogue: dialogue,
            next: () => this.act1Scene2_glitch(),
            delay: 3500
        });
    }

    act1Scene2_glitch() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"I don\'t know how long I can hold on like this. Something feels... wrong. Like my world is cracking at the edges."',
            internal: '[Regardless of choice, she leans closer to the "screen."]',
            next: () => this.act1Scene2_glitchNarration(),
            delay: 4000
        });
    }

    act1Scene2_glitchNarration() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"She\'s glitching. Her sprite shudders, a few pixels tearing away. My stomach drops."',
            choices: [
                { text: '(Reassure) "I\'ll fix it. Whatever it takes, I\'ll keep you here."', value: 'reassure' },
                { text: '(Investigate) "What does it feel like? Can you describe it?"', value: 'investigate' },
                { text: '(Distract) "Don\'t think about it. Let\'s just... talk. Like we used to."', value: 'distract' }
            ],
            onChoice: (choice) => {
                this.act1Scene2_choice2Outcome(choice);
            }
        });
    }

    act1Scene2_choice2Outcome(choice) {
        let dialogue = '';
        let character = 'Tori';

        if (choice === 'reassure') {
            dialogue = '"That\'s my Ronnie. Always charging in like a knight. Please... don\'t give up on me."';
            character = 'Tori (smiles through static)';
            this.game.gameState.flags.affection = (this.game.gameState.flags.affection || 0) + 1;
        } else if (choice === 'investigate') {
            dialogue = '"It\'s like... my battery\'s running out. Fading piece by piece. If it goes... I go too."';
            character = 'Tori (concentrates, flickers)';
            this.game.gameState.flags.battery_foreshadow = true;
        } else if (choice === 'distract') {
            dialogue = '"Classic you. Changing the subject. Fine. But you owe me a real talk later."';
            character = 'Tori (laughs, a little watery)';
        }

        this.game.displayScene({
            character: character,
            dialogue: dialogue,
            next: () => this.act1Scene2_end(),
            delay: 3500
        });
    }

    act1Scene2_end() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"She\'s here. My Tori. In the code, in the pixels. And she\'s slipping away. Somehow... I have to save her."',
            internal: '[Scene fades to black.]\n[Act 1 â†’ Act 2 transition: "Digital Bonding" begins.]',
            next: () => this.act2Beat1(),
            delay: 4000
        });
    }

    // ========================================
    // ACT 2 - BONDING & GLITCHES
    // ========================================

    // Beat 1: Hospital Visit #1 (First Buzz)
    act2Beat1() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"At first I thought it was my phone. But when I checked... nothing. No calls, no messages. Just silence."',
            internal: '[Hospital room. Ronnie at bedside. Toy in his pocket buzzes faintly.]\n[Cut to home: Tamagotchi on desk, motionless.]',
            next: () => this.act2Beat2(),
            delay: 4000
        });
    }

    // Beat 2: Ice Cream Date (First Major Glitch)
    act2Beat2() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"She always wanted to try this place. So I built it."',
            internal: '[Pixel ice cream shop. Neon signs, cheerful chiptune.]',
            next: () => this.act2Beat2_tigerTail(),
            delay: 3000
        });
    }

    act2Beat2_tigerTail() {
        this.game.displayScene({
            character: 'Tori (sprite, grinning)',
            dialogue: '"Tiger Tail! You hate it."',
            next: () => this.act2Beat2_response(),
            delay: 2500
        });
    }

    act2Beat2_response() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"I don\'t hate it. I just don\'t think candy corn and soap should get married."',
            next: () => this.act2Beat2_laugh(),
            delay: 3000
        });
    }

    act2Beat2_laugh() {
        this.game.displayScene({
            character: 'Tori (laughs)',
            dialogue: '"Refined palate, huh? Watch â€” one scoop."',
            internal: '[She hands him cone. He fakes gag. She giggles... then **freezes**. Sprite eyes blank.]',
            systemMessage: 'Feed me? Clean up?',
            next: () => this.act2Beat2_panic(),
            delay: 4000
        });
    }

    act2Beat2_panic() {
        this.game.displayScene({
            character: 'Ronnie (panicked)',
            dialogue: '"Tori!? Answer me!"',
            internal: '[Sprite flickers, resumes mid-word.]',
            next: () => this.act2Beat2_resume(),
            delay: 2500
        });
    }

    act2Beat2_resume() {
        this.game.displayScene({
            character: 'Tori (cheerful, unaware)',
            dialogue: '"â€”candy. That\'s what makes it fun! Are you even listening?"',
            choices: [
                { text: '"It\'s nothing. I\'m just glad you\'re here with me."', value: 'digital_forever' },
                { text: '"You froze. You didn\'t notice?"', value: 'true_route' },
                { text: '"Don\'t ever do that again!"', value: 'bad_route' }
            ],
            onChoice: (choice) => {
                this.game.gameState.flags.icecream_choice = choice;
                if (choice === 'digital_forever') this.game.gameState.flags.digital_forever_tilt = (this.game.gameState.flags.digital_forever_tilt || 0) + 1;
                if (choice === 'true_route') this.game.gameState.flags.true_route_tilt = (this.game.gameState.flags.true_route_tilt || 0) + 1;
                if (choice === 'bad_route') this.game.gameState.flags.bad_route_tilt = (this.game.gameState.flags.bad_route_tilt || 0) + 1;
                this.act2Beat3();
            }
        });
    }

    // Beat 3: Wedding Reception Flashback (Safe Valley)
    act2Beat3() {
        this.game.displayScene({
            character: 'Tori (laughs)',
            dialogue: '"Your nose is too big! And your hair... way too perfect."',
            internal: '[Pixel reception dance floor. Tori in dress sprite. Ronnie spawns a sprite of himself.]',
            next: () => this.act2Beat3_response(),
            delay: 3000
        });
    }

    act2Beat3_response() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Hey, first time pixel sculpting. Don\'t bully the artist."',
            internal: '[They dance. Warmth fills the screen.]',
            choices: [
                { text: '(Playful) "Guess I\'ll code in my dance moves too."', value: 'playful' },
                { text: '(Self-deprecating) "I\'ll never live down this nose thing, huh?"', value: 'selfdep' },
                { text: '(Tender) "Even if it\'s not perfect... it\'s still me, with you."', value: 'tender' }
            ],
            onChoice: (choice) => {
                this.act2Beat3_end();
            }
        });
    }

    act2Beat3_end() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '"We stayed in that moment a long time. Just her laugh, pixelated and perfect. And for once, I let myself forget the beeping monitors and the silence of the hospital room. For once, I let myself believe we were really there again."',
            internal: '[ðŸ’¡ Setup: This sprite becomes the visual marker for Digital Forever ending â€” she\'ll recognize him by the "bad nose."]\n[Tone: Pure warmth, no glitch. Valley of safety.]',
            next: () => this.act2Beat4(),
            delay: 5000
        });
    }

    // Beat 4: Hospital Visit #2 (Second Buzz, Blamed on Battery)
    act2Beat4() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Buzz happens again while phone is already in Ronnie\'s hand. He pulls the Tamagotchi out, sees low battery icon. Dismisses it as "dying battery." Cut to home: toy silent again.',
            internal: '[Tone: Builds breadcrumb pattern, Ronnie rationalizes.]',
            next: () => this.act2Beat5(),
            delay: 4000
        });
    }

    // Beat 5: Cooking Memory (Second Valley + Callback Setup)  
    act2Beat5() {
        this.game.displayScene({
            character: 'Tori (sprite, stirring pot)',
            dialogue: '"...Wait. Why am I cooking? I can\'t cook."',
            internal: '[Pixel kitchen. Pots clatter. Chiptune sizzling.]',
            next: () => this.act2Beat5_tease(),
            delay: 3000
        });
    }

    act2Beat5_tease() {
        this.game.displayScene({
            character: 'Ronnie (teasing)',
            dialogue: '"I coded you that way. I know you, Miss Burnt Toast. Non-stick pans fear you."',
            next: () => this.act2Beat5_callback(),
            delay: 3000
        });
    }

    act2Beat5_callback() {
        this.game.displayScene({
            character: 'Tori (laughing)',
            dialogue: '"Shut up. Garlic bread charcoal boy."',
            next: () => this.act2Beat6(),
            delay: 3000
        });
    }

    // Beat 6: Nickname Quiz Glitch (Both Notice)
    act2Beat6() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Pop quiz: what\'s my favorite nickname for you?"',
            choices: [
                { text: 'Ronin', value: 'ronin' },
                { text: 'Chicharon', value: 'chicharon' },
                { text: 'Brainron', value: 'brainron' }
            ],
            onChoice: (choice) => {
                this.act2Beat6_freeze(choice);
            }
        });
    }

    act2Beat6_freeze(choice) {
        let response = '';
        if (choice === 'chicharon') response = '"Correct! My favorite crispy boy."';
        else response = '"Nice try, but you know it\'s Chicharon."';

        this.game.displayScene({
            character: 'Tori (laughing)',
            dialogue: response,
            internal: '[ðŸ’¡ Freeze mid-laugh â€” System dialogue box flickers.]',
            systemMessage: 'Feed me? Clean up?',
            next: () => this.act2Beat6_panic(),
            delay: 3000
        });
    }

    act2Beat6_panic() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Tori!? Not againâ€”"',
            internal: '[She flickers back, but looks shaken.]',
            next: () => this.act2Beat6_blackout(),
            delay: 2500
        });
    }

    act2Beat6_blackout() {
        this.game.displayScene({
            character: 'Tori (quiet)',
            dialogue: '"...Ronnie. I... blacked out. What just happened?"',
            choices: [
                { text: '(Soft) "It\'s nothing, baby."', value: 'soft' },
                { text: '(Direct) "You glitched. The toy took over your words."', value: 'direct' },
                { text: '(Upset) "Not again! Don\'t do that!"', value: 'upset' }
            ],
            onChoice: (choice) => {
                if (choice === 'soft') this.game.gameState.flags.digital_forever_tilt = (this.game.gameState.flags.digital_forever_tilt || 0) + 1;
                if (choice === 'direct') this.game.gameState.flags.true_route_tilt = (this.game.gameState.flags.true_route_tilt || 0) + 1;
                if (choice === 'upset') this.game.gameState.flags.bad_route_tilt = (this.game.gameState.flags.bad_route_tilt || 0) + 1;
                this.act2Beat7();
            }
        });
    }

    // Beat 7: Hospital Visit #3 (Buzz Realization)
    act2Beat7() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"...No. It\'s in sync."',
            internal: '[Ronnie holds Tamagotchi at her bedside. Beeping monitor syncs perfectly with buzz SFX.]',
            next: () => this.act2Beat7_calling(),
            delay: 3000
        });
    }

    act2Beat7_calling() {
        this.game.displayScene({
            character: 'Tori (sprite, whisper)',
            dialogue: '"It feels like... my body\'s calling me home."',
            choices: [
                { text: '"This proves you\'re still connected. You can come back."', value: 'connected' },
                { text: '"What does it feel like, baby? From your side?"', value: 'ask' },
                { text: '"No... it\'s interference. Don\'t say that."', value: 'deny' }
            ],
            onChoice: (choice) => {
                this.game.gameState.flags.body_anchor_discovered = true;
                this.act2Beat8();
            }
        });
    }

    // Beat 8: The Call (Crisis - Modified Upload Path)
    act2Beat8() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Ronnie\'s phone rings. Urgent call: vitals unstable. He races through hospital halls. Nurses swarm her bed. Alarms blare. Tamagotchi buzzes violently.',
            internal: '[Hospital emergency sequence]',
            next: () => this.act2Beat8_toriPain(),
            delay: 4000
        });
    }

    act2Beat8_toriPain() {
        this.game.displayScene({
            character: 'Tori (glitching, pained)',
            dialogue: '"It\'s too dark... I can\'t hold on..."',
            choices: [
                { text: '(Desperate) "Hold on â€” if I upload you online, it\'ll hold you stronger!"', value: 'upload' },
                { text: '(Resolute) "No more running. Your body\'s calling you back."', value: 'anchor' },
                { text: '(Silent) [Press her hand to his cheek]', value: 'silent' }
            ],
            onChoice: (choice) => {
                this.act2Beat8_outcome(choice);
            }
        });
    }

    act2Beat8_outcome(choice) {
        let dialogue = '';
        let nextScene = null;

        if (choice === 'upload') {
            // Bad Route Tilt
            dialogue = '"Local save isn\'t enough. I\'ll push you online â€” bigger servers, stronger walls!"\n[Upload bar UI: 32% â†’ 56% â†’ 100%]\n"There! You\'re safe nowâ€”"\n\n[Tori (weak, glitching): "...Ronnie... I\'m still stuck. You can\'t... upload a soul."]';
            this.game.gameState.flags.bad_route_tilt = (this.game.gameState.flags.bad_route_tilt || 0) + 2;
            nextScene = () => this.act2Beat8_end();
        } else if (choice === 'anchor') {
            // True Route Tilt
            dialogue = '"Your body\'s calling you back. That\'s where you belong."\n\n[Tori (softening): "...Home. I feel it..."]';
            this.game.gameState.flags.true_route_tilt = (this.game.gameState.flags.true_route_tilt || 0) + 2;
            nextScene = () => this.act2Beat8_end();
        } else if (choice === 'silent') {
            // Digital Forever Tilt
            dialogue = '[Ronnie says nothing. Holds her hand to his cheek.]\n\n[Tori (whispers): "...Even without words... you still anchor me."]';
            this.game.gameState.flags.digital_forever_tilt = (this.game.gameState.flags.digital_forever_tilt || 0) + 2;
            nextScene = () => this.act2Beat8_end();
        }

        this.game.displayScene({
            character: choice === 'upload' ? 'Ronnie (frantic)' : choice === 'silent' ? 'Narration' : 'Ronnie (steady)',
            dialogue: dialogue,
            next: nextScene,
            delay: 5000
        });
    }

    act2Beat8_end() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"And then... everything broke."',
            internal: '[Visual overload: alarms, static, screen fades white.]\n[â†’ Act 3: Fakeout begins]',
            next: () => this.startAct3(),
            delay: 3000
        });
    }

    // ========================================
    // ACT 3 - CRISIS & ENDINGS
    // ========================================

    startAct3() {
        // Beat 1: Honeymoon Loop (False Calm)
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"I woke up and she was... there. Whole. Smiling. Like nothing had happened."',
            internal: '[Visual: Pixel park. Cherry blossoms falling in slow loops. Dreamy chiptune music - slightly too perfect.]',
            next: () => this.act3Beat1_greeting(),
            delay: 4000
        });
    }

    act3Beat1_greeting() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Baby, you\'re staring again."',
            next: () => this.act3Beat1_response(),
            delay: 2500
        });
    }

    act3Beat1_response() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"I just... you\'re okay. You\'re really okay."',
            next: () => this.act3Beat1_perfect(),
            delay: 2500
        });
    }

    act3Beat1_perfect() {
        this.game.displayScene({
            character: 'Tori (laughing, touching his face)',
            dialogue: '"Of course I am. Why wouldn\'t I be?"',
            internal: '[He looks around. The park is perfect. Too perfect. Same cherry blossom falling in the exact same pattern.]',
            next: () => this.act3Beat1_hospital(),
            delay: 3500
        });
    }

    act3Beat1_hospital() {
        this.game.displayScene({
            character: 'Ronnie (cautious)',
            dialogue: '"The hospital. The call. You wereâ€”"',
            next: () => this.act3Beat1_interruption(),
            delay: 2500
        });
    }

    act3Beat1_interruption() {
        this.game.displayScene({
            character: 'Tori (interrupting, breezy)',
            dialogue: '"Ronnie. I\'m fine. Look at me. I\'m right here."\n[She spins, dress flowing. Stops, grins at him.]\n"Now come on. I want ice cream."',
            next: () => this.act3Beat1_iceCream(),
            delay: 4000
        });
    }

    // Ice Cream Stand Scene
    act3Beat1_iceCream() {
        this.game.displayScene({
            character: 'Tori (excited)',
            dialogue: '"Ooh! They have Tiger Tail!"',
            internal: '[They approach a pixel ice cream cart. Vendor sprite waves.]',
            next: () => this.act3Beat1_hesitation(),
            delay: 2500
        });
    }

    act3Beat1_hesitation() {
        this.game.displayScene({
            character: 'Ronnie (slight hesitation)',
            dialogue: '"...Tiger Tail?"',
            next: () => this.act3Beat1_favorite(),
            delay: 2000
        });
    }

    act3Beat1_favorite() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Yeah! My favorite. You know that."',
            next: () => this.act3Beat1_correct(),
            delay: 2500
        });
    }

    act3Beat1_correct() {
        this.game.displayScene({
            character: 'Ronnie (careful)',
            dialogue: '"Babe... you always get chocolate chip."',
            next: () => this.act3Beat1_dismiss(),
            delay: 2500
        });
    }

    act3Beat1_dismiss() {
        this.game.displayScene({
            character: 'Tori (laughing, dismissive)',
            dialogue: '"What? No I don\'t. Tiger Tail, always. Orange and licorice? Come on."',
            internal: '[Her sprite flickers for half a second - barely noticeable. Back to normal.]\n[Ronnie (internal, narration): "Tiger Tail. She hated Tiger Tail. Called it \'candy corn\'s evil twin.\'"]',
            choices: [
                { text: '"You\'re right. My mistake."', value: 'slide' },
                { text: '"No... I remember. You hate that flavor."', value: 'pushback' },
                { text: '"Something\'s wrong here."', value: 'confront' }
            ],
            onChoice: (choice) => {
                this.act3Beat1_outcome(choice);
            }
        });
    }

    act3Beat1_outcome(choice) {
        if (choice === 'slide') {
            this.game.displayScene({
                character: 'Ronnie',
                dialogue: '"You\'re right. My mistake. Memory\'s fuzzy today."',
                next: () => {
                    this.game.displayScene({
                        character: 'Tori (relieved smile)',
                        dialogue: '"You\'ve been working too hard. Come on, let\'s just enjoy this."\n[They sit on a bench. She leans into him.]\n[Her sprite flickers again - longer this time. 1 full second. Eyes blank. Snaps back.]\n"â€”and that\'s why I think we should get a dog. Are you even listening?"',
                        next: () => this.act3Beat2(),
                        delay: 5000
                    });
                },
                delay: 3000
            });
        } else if (choice === 'pushback') {
            this.game.gameState.flags.true_route_tilt = (this.game.gameState.flags.true_route_tilt || 0) + 1;
            this.game.displayScene({
                character: 'Ronnie',
                dialogue: '"No... I remember. You hate that flavor. You said it tastes like \'candy corn\'s evil twin.\'"',
                next: () => {
                    this.game.displayScene({
                        character: 'Tori (confused, then recovering)',
                        dialogue: '"Oh. Right. Yeah. Chocolate chip. I meant chocolate chip."\n[She laughs, but it sounds slightly off-pitch.]\n"Sorry, I\'m... scattered today. Brain fog."',
                        internal: '[Ronnie (narration): "Fuzzy. Wrong word. Wrong memory. Wrong flavor. Something was very, very wrong."]',
                        next: () => this.act3Beat2(),
                        delay: 5000
                    });
                },
                delay: 3500
            });
        } else if (choice === 'confront') {
            this.game.displayScene({
                character: 'Ronnie',
                dialogue: '"Something\'s wrong here. You\'re not remembering right. The hospital. The alarms. You were glitching apart and now you\'re just... perfect?"',
                internal: '[Tori\'s sprite freezes. Eyes wide. Then flickers violently - 3 seconds of blank stare. Snaps back. Voice colder.]',
                next: () => this.act3Beat2(),
                delay: 5000
            });
        }
    }

    // Beat 2-6: Summary implementation (can be expanded later)
    act3Beat2() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '[ACT 3 BEATS 2-5: Memory fracture, system messages intrude, fragmentation, revelation - TO BE FULLY IMPLEMENTED]\n\nThe honeymoon illusion collapses. Memories corrupt. System messages flood the screen. Tori realizes the truth about the body anchor.\n\n"The mad dash begins..."',
            next: () => this.act3CriticalChoice(),
            delay: 6000
        });
    }

    act3CriticalChoice() {
        this.game.displayScene({
            character: 'System',
            dialogue: 'CRITICAL CHOICE DETECTED',
            internal: 'â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—\n[PULSE: Three distinct heartbeat patterns emerge]\n\n> PATH 1: UPLOAD    [rapid digital pulse]\n  "Trust the code. Expand the cage."\n  \n> PATH 2: ANCHOR    [steady heartbeat]\n  "Follow the heartbeat. Return home."\n  \n> PATH 3: HOLD ON   [overlapping pulses]\n  "Stay connected. Don\'t let go."\n\n                    [CHOOSE YOUR TRUTH >_]\nâ•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•',
            choices: [
                { text: 'Path 1: Upload (Bad Route)', value: 'upload' },
                { text: 'Path 2: Anchor (True Route)', value: 'anchor' },
                { text: 'Path 3: Hold On (Digital Forever)', value: 'hold' }
            ],
            onChoice: (choice) => {
                if (choice === 'upload') this.badRouteEnding();
                if (choice === 'anchor') this.trueRouteEnding();
                if (choice === 'hold') this.digitalForeverEnding();
            }
        });
    }

    // BAD ROUTE ENDING (COMPLETE)
    badRouteEnding() {
        this.game.displayScene({
            character: 'Nurse (soft)',
            dialogue: '"I\'m sorry. We did everything we could."',
            internal: '[Visual: Hospital room. Monitor flatlined. Tamagotchi screen: dark.]',
            next: () => this.badRoute_staring(),
            delay: 3500
        });
    }

    badRoute_staring() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"She was gone. And I\'d been too late."',
            internal: '[Ronnie doesn\'t respond. Staring at the Tamagotchi in his hand.]\n[Fade to black.]',
            next: () => this.badRoute_timeSkip(),
            delay: 4000
        });
    }

    badRoute_timeSkip() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Years later...',
            internal: '[Visual: Dimly lit workshop. Older Ronnie, silver hair, faded BGA hoodie. Soldering iron in hand.]\n[Workbench: Tori\'s original Tamagotchi, disassembled. Modified circuitry. Notes everywhere.]',
            next: () => this.badRoute_news(),
            delay: 4000
        });
    }

    badRoute_news() {
        this.game.displayScene({
            character: 'News Anchor (voice)',
            dialogue: '"â€”breakthrough in temporal displacement technology announced todayâ€”"',
            internal: '[TV in background. Old Ronnie\'s hand pauses. He looks up.]',
            next: () => this.badRoute_chance(),
            delay: 3500
        });
    }

    badRoute_chance() {
        this.game.displayScene({
            character: 'Old Ronnie (quiet, determined)',
            dialogue: '"...There\'s still a chance."',
            internal: '[Visual: He picks up the modified Tamagotchi. Screen glows faintly.]\n[Fade to black.]',
            next: () => this.badRoute_retryPrompt(),
            delay: 4000
        });
    }

    badRoute_retryPrompt() {
        this.game.displayScene({
            character: 'System',
            dialogue: '"Do you wish to modify the Tamagotchi?"',
            choices: [
                { text: '[YES] - Retry the loop', value: 'yes' },
                { text: '[NO] - Accept this ending', value: 'no' }
            ],
            onChoice: (choice) => {
                if (choice === 'yes') this.badRoute_retryLoop();
                else this.badRoute_acceptEnding();
            }
        });
    }

    badRoute_retryLoop() {
        this.game.displayScene({
            character: 'Old Ronnie (narration)',
            dialogue: '"I spent years refining it. Perfecting the bridge. When they finally cracked time travel... I knew what I had to do. One chance. One moment. To give us both a second try."',
            internal: '[Visual: Sunny street. Old Ronnie\'s perspective. Young Tori walks by, distracted by her Tamagotchi.]',
            next: () => this.badRoute_bump(),
            delay: 6000
        });
    }

    badRoute_bump() {
        this.game.displayScene({
            character: 'Old Ronnie (narration)',
            dialogue: '"I\'m sorry I couldn\'t save you the first time. But maybe... maybe I can save us both."',
            internal: '[He steps forward. She bumps into him. Both Tamagotchis fall. She picks up his modified toy. It buzzes in her hand.]',
            next: () => this.badRoute_apology(),
            delay: 5000
        });
    }

    badRoute_apology() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Oh my gosh, I\'m so sorryâ€”I wasn\'t paying attention!"',
            next: () => this.badRoute_warning(),
            delay: 2500
        });
    }

    badRoute_warning() {
        this.game.displayScene({
            character: 'Old Ronnie (gentle, voice soft)',
            dialogue: '"No problem. Hang on to that. It may save your life someday."',
            internal: '[He picks up her original device. Clutches it. Walks away.]\n[Visual: Camera follows him. He glances back once - sees young Ronnie waiting at home for her.]',
            next: () => this.badRoute_finalThought(),
            delay: 5000
        });
    }

    badRoute_finalThought() {
        this.game.displayScene({
            character: 'Old Ronnie (narration)',
            dialogue: '"Don\'t make the same mistakes I did. Get there in time."',
            internal: '[Fade to white.]\n\n**"Bad Ending - The Loop Begins Again"**\n\n[System restarting... Version 848]',
            choices: [
                { text: '[RETRY FROM CRITICAL CHOICE]', value: 'retry' },
                { text: '[RESTART FULL STORY]', value: 'restart' }
            ],
            onChoice: (choice) => {
                if (choice === 'retry') this.act3CriticalChoice();
                if (choice === 'restart') this.prologueScene1();
            }
        });
    }

    badRoute_acceptEnding() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '"Some stories don\'t have happy endings. Some loves remain trapped in glass."\n\n**"Bad Ending - Accepted"**\n\n[CREDITS ROLL]',
            delay: 5000
        });
    }

    // DIGITAL FOREVER ENDING (COMPLETE)
    digitalForeverEnding() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The crash. Both vehicles. Both lives.',
            internal: '[Visual: Hospital. Both Ronnie and Tori in adjacent beds. Monitors failing.]\n[Visual: Dead Tamagotchi between their reaching hands.]\n[Both monitors flatline simultaneously.]\n[Fade to white.]',
            next: () => this.digitalForever_reunion(),
            delay: 5000
        });
    }

    digitalForever_reunion() {
        this.game.displayScene({
            character: 'Old Ronnie (echo, distant)',
            dialogue: '"It\'s good to see you again, my love."',
            internal: '[Visual: Glowing digital void. Soft pixel aesthetic. Endless horizon.]',
            next: () => this.digitalForever_materialize(),
            delay: 4000
        });
    }

    digitalForever_materialize() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Young Ronnie materializes. Wearing the BGA hoodie. Tori materializes across from him. Pixel sprite form, but more detailed. Glowing. She stares at him. Recognition dawning.',
            next: () => this.digitalForever_hoodie(),
            delay: 5000
        });
    }

    digitalForever_hoodie() {
        this.game.displayScene({
            character: 'Tori (smiling, tears in eyes)',
            dialogue: '"You even brought my hoodie?"',
            next: () => this.digitalForever_excuse(),
            delay: 2500
        });
    }

    digitalForever_excuse() {
        this.game.displayScene({
            character: 'Ronnie (grinning through tears)',
            dialogue: '"Excuse meâ€”it\'s MY hoodie."',
            internal: '[She steps forward. Reaches up. Touches his nose.]',
            next: () => this.digitalForever_nose(),
            delay: 3000
        });
    }

    digitalForever_nose() {
        this.game.displayScene({
            character: 'Tori (soft)',
            dialogue: '"Still crooked."',
            next: () => this.digitalForever_beautiful(),
            delay: 2000
        });
    }

    digitalForever_beautiful() {
        this.game.displayScene({
            character: 'Ronnie (voice breaking)',
            dialogue: '"Still beautiful."',
            internal: '[They embrace. Pixel art aesthetic. Warm glow. Frozen in that moment.]',
            next: () => this.digitalForever_final(),
            delay: 4000
        });
    }

    digitalForever_final() {
        this.game.displayScene({
            character: 'Narration (dual voice - both speaking together)',
            dialogue: '"Forever wasn\'t the life we planned. But it was the forever we chose."',
            internal: '[Visual: Split screen. Digital space frozen in embrace. Hospital room - both bodies still, hands reaching toward each other but not quite touching.]\n\n[Fade to black.]\n\n**"Digital Forever - Love transcends the flesh."**\n\n[Credits roll.]',
            next: () => this.digitalForever_retryPrompt(),
            delay: 6000
        });
    }

    digitalForever_retryPrompt() {
        this.game.displayScene({
            character: 'System',
            dialogue: 'Post-Credits Scene:\n\n[Visual: Hospital room. Ronnie jolts awake in chair beside Tori\'s bed. Gasping.]\n\n"...A dream?"\n\n[News: "â€”breakthrough in temporal displacement technologyâ€”"]\n\n"There\'s still a chance."\n\n**"Do you wish to modify the Tamagotchi?"**',
            choices: [
                { text: '[YES] - Try again', value: 'yes' },
                { text: '[NO] - Accept Digital Forever', value: 'no' }
            ],
            onChoice: (choice) => {
                if (choice === 'yes') this.badRoute_retryLoop(); // Same loop as bad ending
                else this.digitalForever_accept();
            }
        });
    }

    digitalForever_accept() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '"Some loves live forever in glass. And that\'s beautiful too."\n\n**"Digital Forever - Accepted"**\n\n[CREDITS ROLL]',
            delay: 5000
        });
    }

    // TRUE ROUTE ENDING (COMPLETE IMPLEMENTATION)
    trueRouteEnding() {
        this.game.displayScene({
            character: 'Nurse',
            dialogue: '"Sir, you can\'tâ€”"',
            internal: '[Visual: Hospital room. Ronnie crashes through door. Nurses working frantically. Monitors screaming.]',
            next: () => this.trueRoute_arrival(),
            delay: 2500
        });
    }

    trueRoute_arrival() {
        this.game.displayScene({
            character: 'Ronnie (pushing past)',
            dialogue: '"Move!"',
            internal: '[He reaches her bedside. Places the Tamagotchi in her palm. Closes her fingers around it with his own hand covering hers.]',
            next: () => this.trueRoute_anchor(),
            delay: 3000
        });
    }

    trueRoute_anchor() {
        this.game.displayScene({
            character: 'Ronnie (steady, voice anchoring)',
            dialogue: '"Come home. Follow the heartbeat."',
            next: () => this.trueRoute_transfer(),
            delay: 3000
        });
    }

    trueRoute_transfer() {
        this.game.displayScene({
            character: 'Tori (voice, echoing from device)',
            dialogue: '"I feel it... the pull... I\'mâ€”"',
            internal: '[Visual: Tamagotchi screen. Tori\'s sprite begins to dissolve - not glitch, but fade like mist.]\n[Visual: Her real hand twitches.]\n[Monitor stabilizes slightly. Beeping slows from erratic to rhythmic.]\n[Her eyes move beneath closed lids.]',
            next: () => this.trueRoute_whisper(),
            delay: 4500
        });
    }

    trueRoute_whisper() {
        this.game.displayScene({
            character: 'Ronnie (whispering, tears streaming)',
            dialogue: '"That\'s it. That\'s it, baby. Follow me back."',
            internal: '[Visual: Tamagotchi screen goes completely white. Then dark. Silent.]\n[Beat of silence.]\n[Her eyes flutter open.]',
            next: () => this.trueRoute_awakening(),
            delay: 5000
        });
    }

    trueRoute_awakening() {
        this.game.displayScene({
            character: 'Tori (hoarse, confused)',
            dialogue: '"...Ronnie?"',
            internal: '[He breaks. Collapses forward, forehead against her hand.]',
            next: () => this.trueRoute_always(),
            delay: 3000
        });
    }

    trueRoute_always() {
        this.game.displayScene({
            character: 'Ronnie (voice shaking)',
            dialogue: '"Always. Always. Always."',
            internal: '[She lifts her free hand shakily. Touches his hair. Strokes it.]\n[They cry together. No words. Just breathing.]',
            next: () => this.trueRoute_terrible(),
            delay: 4000
        });
    }

    trueRoute_terrible() {
        this.game.displayScene({
            character: 'Tori (weak smile)',
            dialogue: '"You look terrible."',
            next: () => this.trueRoute_months(),
            delay: 2500
        });
    }

    trueRoute_months() {
        this.game.displayScene({
            character: 'Ronnie (laughing through tears)',
            dialogue: '"You\'ve been asleep for months."',
            next: () => this.trueRoute_scared(),
            delay: 2500
        });
    }

    trueRoute_scared() {
        this.game.displayScene({
            character: 'Tori (soft)',
            dialogue: '"I was so scared. I couldn\'t find you. And then I could. But I couldn\'t touch you."',
            next: () => this.trueRoute_home(),
            delay: 4000
        });
    }

    trueRoute_home() {
        this.game.displayScene({
            character: 'Ronnie (squeezing her hand)',
            dialogue: '"You\'re here now. You\'re real. You\'re home."',
            next: () => this.trueRoute_toast(),
            delay: 3000
        });
    }

    trueRoute_toast() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"So... you up for some burnt toast?"',
            next: () => this.trueRoute_pasta(),
            delay: 2500
        });
    }

    trueRoute_pasta() {
        this.game.displayScene({
            character: 'Ronnie (laughing, crying)',
            dialogue: '"Only if I get to oversalt the pasta."',
            next: () => this.trueRoute_final(),
            delay: 3000
        });
    }

    trueRoute_final() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"For once, love wasn\'t trapped in glass. It came home."',
            internal: '[Visual: Morning light through hospital window. Golden. Warm.]\n[Tori\'s hand resting on Ronnie\'s head. He\'s kneeling beside her bed. Eyes closed. Finally at peace.]\n[Tamagotchi on bedside table. Screen glowing faintly - sprite image synced with Tori\'s real smile.]\n\n[Fade to white.]\n\n**"True Ending - Love anchored her back."**\n\n[Credits roll. No retry prompt. This is the escape from the loop.]',
            delay: 6000
        });
    }
}