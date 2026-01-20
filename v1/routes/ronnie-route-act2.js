// RONNIE'S ROUTE - ACT 2
// Loop Mechanics & Bootstrap Paradox Discovery
// WITH VISUAL IMPLEMENTATION

class RonnieRouteAct2 {
    constructor(route) {
        this.route = route;
        this.game = route.game;
    }

    // ========================================
    // ACT 2 - LOOP MECHANICS (BOOTSTRAP PARADOX)
    // ========================================

    startAct2() {
        // Beat 1: Realization - Something's Wrong
        this.game.displayScene({
            character: 'Ronnie (internal)',
            dialogue: '"Something is wrong. The conversations loop. She says the same things. Asks the same questions."',
            internal: '[Visual: Ronnie at his desk. Multiple browser tabs open showing chat logs. Text highlighted - identical phrases from different days.]',
            background: '../assets/apartment.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat1_discovery(),
            delay: 4000
        }, 'startAct2');
    }

    act2Beat1_discovery() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Tori... do you remember yesterday? What we talked about?"',
            internal: '[Visual: Tori-gatchi interface. Her sprite is normal, smiling.]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp'
            },
            next: () => this.act2Beat1_confusion(),
            delay: 3000
        }, 'act2Beat1_discovery');
    }

    act2Beat1_confusion() {
        this.game.displayScene({
            character: 'Tori (confused)',
            dialogue: '"Yesterday? Baby, we talked about the hospital. Your visit. You showed me the game..."',
            internal: '[Ronnie (internal): "That was WEEKS ago."]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp'
            },
            next: () => this.act2Beat2(),
            delay: 3500
        }, 'act2Beat1_confusion');
    }

    // Beat 2: Research - Building the Bridge
    act2Beat2() {
        // Unlock PerplexiZee's research data note
        this.route.collectiblesManager.unlockNote('pz1');

        this.game.displayScene({
            character: 'Narration',
            dialogue: '"I dug deeper. Something kept her tethered - fragmented, looping. I couldn\'t pull her out... but maybe I could send something IN."',
            internal: '[Visual: Ronnie surrounded by open journals, code snippets, diagrams of consciousness transfer theories. The Tamagotchi glows faintly beside his keyboard.]',
            background: '../assets/apartment.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat2_code(),
            delay: 5000
        }, 'act2Beat2');
    }

    act2Beat2_code() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"If I could create a version of myself inside the code... a guide, an anchor... maybe she could find her way back through me."',
            internal: '[Code appears on screen: \'digital_ronnie_construct.js\' - loops, memory structures, decision trees.]',
            background: '../assets/apartment.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat3(),
            delay: 4500
        }, 'act2Beat2_code');
    }

    // Beat 3: First Hospital Visit - The First Buzz
    act2Beat3() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"I visit her. Every day. Same routine. Check vitals. Hold her hand. Tell her about progress."',
            internal: '[Visual: Hospital room. Tori unconscious, monitors beeping. Ronnie sits beside her bed.]',
            background: '../assets/hospital.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat3_buzz(),
            delay: 4000
        }, 'act2Beat3');
    }

    act2Beat3_buzz() {
        // HAPTIC: Single buzz - mystery begins
        if (this.game.triggerHaptic) {
            this.game.triggerHaptic('light', 'First buzz - mystery begins');
        }

        this.game.displayScene({
            character: 'Narration',
            dialogue: '[BUZZ]\n\n[Ronnie startles. Something vibrated in his pocket.]',
            internal: '[Visual: Ronnie\'s hand instinctively reaches for his phone.]',
            background: '../assets/hospital.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat3_phone(),
            delay: 2000
        }, 'act2Beat3_buzz');
    }

    act2Beat3_phone() {
        this.game.displayScene({
            character: 'Ronnie (internal)',
            dialogue: '"Notification?"',
            internal: '[He pulls out his phone. Checks the screen.]\n[...Nothing. No messages. No alerts.]',
            background: '../assets/hospital.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat3_dismiss(),
            delay: 3000
        }, 'act2Beat3_phone');
    }

    act2Beat3_dismiss() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Huh. Must\'ve been nothing."',
            internal: '[Visual: Ronnie puts phone away. Returns to holding Tori\'s hand.]\n[The Tamagotchi sits silent in his other pocket.]',
            background: '../assets/hospital.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat4(),
            delay: 3000
        }, 'act2Beat3_dismiss');
    }

    // Beat 4: Second Hospital Visit - Pattern Recognition
    act2Beat4() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '"Second visit. Same routine."',
            internal: '[Visual: Hospital room again. Days later. Ronnie sits beside Tori, phone in hand, scrolling absently.]',
            background: '../assets/hospital.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat4_buzz(),
            delay: 3000
        }, 'act2Beat4');
    }

    act2Beat4_buzz() {
        // HAPTIC: Single buzz - second clue
        if (this.game.triggerHaptic) {
            this.game.triggerHaptic('light', 'Second buzz - pattern forming');
        }

        this.game.displayScene({
            character: 'Narration',
            dialogue: '[BUZZ]\n\n[Again. The vibration.]',
            internal: '[Visual: Ronnie looks at his phone screen - it\'s in his hand this time. Nothing.]',
            background: '../assets/hospital.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat4_realization(),
            delay: 2500
        }, 'act2Beat4_buzz');
    }

    act2Beat4_realization() {
        this.game.displayScene({
            character: 'Ronnie (internal)',
            dialogue: '"Wait... it\'s NOT my phone."',
            internal: '[He reaches into his other pocket.]\n[The Tamagotchi. Tori mentioned something about low battery...]',
            background: '../assets/hospital.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat4_dismiss(),
            delay: 3500
        }, 'act2Beat4_realization');
    }

    act2Beat4_dismiss() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Low battery. Right. Should probably charge that when I get home."',
            internal: '[Visual: He dismisses it again. Puts the Tamagotchi back in his pocket.]\n[Returns focus to Tori.]',
            background: '../assets/hospital.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat4_5_conversation(),
            delay: 3500
        }, 'act2Beat4_dismiss');
    }

    // Beat 4.5: Ice Cream Hijack - Ronnie's POV
    // Syncs with Tori Act 2 Beat 1 (Despair takes control)
    act2Beat4_5_conversation() {
        this.game.displayScene({
            character: 'Ronnie (typing)',
            dialogue: '"Hey. I know things are rough right now. Want to talk about something normal? Something that isn\'t... all this?"',
            internal: '[Visual: Apartment. Ronnie at desk, Tamagotchi connected to laptop. Trying to cheer her up.]',
            background: '../assets/apartment.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat4_5_toriResponse(),
            delay: 3500
        }, 'act2Beat4_5_conversation');
    }

    act2Beat4_5_toriResponse() {
        this.game.displayScene({
            character: 'Tori (through game)',
            dialogue: '"Yeah. Normal sounds good."',
            internal: '[Her sprite appears on screen. She seems... off. Tired.]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp'
            },
            next: () => this.act2Beat4_5_iceCream(),
            delay: 2500
        }, 'act2Beat4_5_toriResponse');
    }

    act2Beat4_5_iceCream() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Remember when we used to get ice cream from that place on 5th? What was your go-to flavor again?"',
            internal: '[Trying to ground her in good memories.]',
            background: '../assets/apartment.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp'
            },
            next: () => this.act2Beat4_5_hijack(),
            delay: 3000
        }, 'act2Beat4_5_iceCream');
    }

    act2Beat4_5_hijack() {
        this.game.displayScene({
            character: 'Tori (voice wrong)',
            dialogue: '"Tiger Tail."',
            internal: '[Ronnie freezes. Wait. What?]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp',
                highlight: 'right'
            },
            next: () => this.act2Beat4_5_pause(),
            delay: 2000,
            style: 'critical'
        }, 'act2Beat4_5_hijack');
    }

    act2Beat4_5_pause() {
        this.game.displayScene({
            character: 'Ronnie (internal)',
            dialogue: '"...She hates Tiger Tail. Called it \'discount Halloween in a cone.\' She always got chocolate chip cookie dough."',
            internal: '[Long pause. The sprite on screen flickers.]',
            background: '../assets/apartment.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat4_5_correction(),
            delay: 3500
        }, 'act2Beat4_5_pause');
    }

    act2Beat4_5_correction() {
        this.game.displayScene({
            character: 'Tori (panicked)',
            dialogue: '"Wait. No. I meant... chocolate chip cookie dough. Sorry. I\'m... my head is fuzzy."',
            internal: '[Her sprite glitches violently for a moment. Then stabilizes.]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp',
                highlight: 'right'
            },
            next: () => this.act2Beat4_5_concern(),
            delay: 3500
        }, 'act2Beat4_5_correction');
    }

    act2Beat4_5_concern() {
        this.game.displayScene({
            character: 'Ronnie (worried)',
            dialogue: '"Tori... are you okay? That wasn\'t like you."',
            internal: '[Something is very wrong. She\'s fragmenting worse than he thought.]',
            background: '../assets/apartment.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp'
            },
            next: () => this.act2Beat4_5_deflect(),
            delay: 3000
        }, 'act2Beat4_5_concern');
    }

    act2Beat4_5_deflect() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"I\'m fine. Just tired. Can we... talk later?"',
            internal: '[Her sprite fades from the screen. Connection drops. Ronnie stares at the empty game window.]',
            background: '../assets/apartment.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat4_7_honeymoon(),
            delay: 3500
        }, 'act2Beat4_5_deflect');
    }

    // Beat 4.7: Honeymoon Fakeout - False Calm Before Upload
    // Moved from Act 3 - creates false sense of security before everything breaks
    act2Beat4_7_honeymoon() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"Then... she came back. Whole. Smiling. Like nothing had happened."',
            internal: '[Visual: Digital space. Cherry blossoms falling. Dreamy, perfect. Too perfect.]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp'
            },
            next: () => this.act2Beat4_7_greeting(),
            delay: 4000
        }, 'act2Beat4_7_honeymoon');
    }

    act2Beat4_7_greeting() {
        this.game.displayScene({
            character: 'Tori (bright)',
            dialogue: '"Hey baby. Sorry about earlier. I\'m feeling better now."',
            internal: '[She\'s... whole. No glitches. No stuttering. Perfect.]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp'
            },
            next: () => this.act2Beat4_7_relief(),
            delay: 3000
        }, 'act2Beat4_7_greeting');
    }

    act2Beat4_7_relief() {
        this.game.displayScene({
            character: 'Ronnie (relieved)',
            dialogue: '"You scared me. You were fragmenting, saying the wrong words..."',
            background: '../assets/apartment.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp'
            },
            next: () => this.act2Beat4_7_reassurance(),
            delay: 2500
        }, 'act2Beat4_7_relief');
    }

    act2Beat4_7_reassurance() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"I just needed rest. I\'m okay now. Promise."',
            internal: '[Ronnie wants to believe it. She looks stable. Maybe... maybe it worked itself out?]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp',
                highlight: 'right'
            },
            next: () => this.act2Beat4_7_glitchStart(),
            delay: 3000
        }, 'act2Beat4_7_reassurance');
    }

    act2Beat4_7_glitchStart() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '[Her sprite flickers. Just for a second. Ronnie freezes.]',
            internal: '[Visual: A single pixel corruption. Then another. Then more.]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp'
            },
            next: () => this.act2Beat5(),
            delay: 2500
        }, 'act2Beat4_7_glitchStart');
    }

    // Beat 5: The Upload Attempt - Wrong Solution
    act2Beat5() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"She\'s glitching. Fragments appearing in the laptop game. The code isn\'t holding her..."',
            internal: '[Visual: Ronnie at his desk. ToriGatchi game open on laptop. Tori\'s sprite flickering, corrupted.]',
            background: '../assets/apartment.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat5_theory(),
            delay: 4000
        }, 'act2Beat5');
    }

    act2Beat5_theory() {
        this.game.displayScene({
            character: 'Ronnie (desperate)',
            dialogue: '"That\'s it. She\'s trapped in the LAPTOP. Limited processing power. If I upload the game to the cloud... more resources... she\'ll stabilize!"',
            internal: '[Visual: Ronnie frantically typing. Upload progress bar appears.]',
            background: '../assets/apartment.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat5_upload(),
            delay: 4500
        }, 'act2Beat5_theory');
    }

    async act2Beat5_upload() {
        // Use cinematic loading overlay for dramatic effect
        await this.game.loadingOverlay.playUploadSequence({
            title: 'UPLOADING TORIGATCHI TO CLOUD',
            subtitle: 'Transferring consciousness data…',
            durationMs: 4000,
            skippable: true,
            glitchAt: 85, // Dramatic glitch at 85%
            statusLines: [
                'Initializing cloud connection…',
                'Packing game data…',
                'Uploading to server…',
                'Transfer complete.'
            ]
        });

        // Continue to "still there" scene
        this.act2Beat5_stillThere();
    }

    act2Beat5_stillThere() {
        this.game.displayScene({
            character: 'Tori (glitching)',
            dialogue: '"Ronnie... I\'m... still here. Still stuck. It didn\'t... work..."',
            internal: '[Visual: Her sprite still glitches. Still fragmented. Nothing changed.]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp'
            },
            next: () => this.act2Beat5_confusion(),
            delay: 4000
        }, 'act2Beat5_stillThere');
    }

    act2Beat5_confusion() {
        this.game.displayScene({
            character: 'Ronnie (confused)',
            dialogue: '"But... you contacted me through the laptop game. I thought you were IN the laptop!"',
            internal: '[Visual: Ronnie staring at screen, frustrated, confused.]',
            background: '../assets/apartment.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat6(),
            delay: 3500
        }, 'act2Beat5_confusion');
    }

    // Beat 6: The Clarification - THE REVELATION
    act2Beat6() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"I\'m not IN the game, Ronnie."',
            internal: '[Visual: Her sprite stabilizes for a moment. Clear. Focused.]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp',
                highlight: 'right'
            },
            next: () => this.act2Beat6_revelation(),
            delay: 3000
        }, 'act2Beat6');
    }

    act2Beat6_revelation() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"You can\'t upload a soul. I\'m in the Tamagotchi."',
            internal: '[Visual: Silence. The weight of it hits him.]\n[The TAMAGOTCHI. Not the laptop. Not the game. The device itself.]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp',
                highlight: 'right'
            },
            next: () => this.act2Beat6_jumping(),
            delay: 5000,
            style: 'critical'
        }, 'act2Beat6_revelation');
    }

    act2Beat6_jumping() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Wait... then how are you—"',
            internal: '',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp'
            },
            next: () => this.act2Beat6_explain(),
            delay: 2000
        }, 'act2Beat6_jumping');
    }

    act2Beat6_explain() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"I\'ve been JUMPING to the laptop so I could talk to you. The Tamagotchi has to be touching whatever I jump to."',
            internal: '[Visual: Understanding dawns on his face.]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp',
                highlight: 'right'
            },
            next: () => this.act2Beat6_question(),
            delay: 4500
        }, 'act2Beat6_explain');
    }

    act2Beat6_question() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"So how do we get you to wake up? How do you get back to your body?"',
            internal: '[Visual: Tori\'s expression shifts. Realization.]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp'
            },
            next: () => this.act2Beat6_buzzing(),
            delay: 3500
        }, 'act2Beat6_question');
    }

    act2Beat6_buzzing() {
        // HAPTIC: Realization pulse
        if (this.game.triggerHaptic) {
            this.game.triggerHaptic('medium', 'Realization - the buzzing');
        }

        this.game.displayScene({
            character: 'Ronnie (realizing)',
            dialogue: '"Wait... the buzzing. The Tamagotchi has been buzzing. And ONLY when I visit you at the hospital!"',
            internal: '[Visual: Flashback glimpses of the two hospital visits. The buzz. The pull.]',
            background: '../assets/hospital.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat6_confirm(),
            delay: 4500
        }, 'act2Beat6_buzzing');
    }

    act2Beat6_confirm() {
        this.game.displayScene({
            character: 'Tori (softly)',
            dialogue: '"I\'ve been feeling it too. The pull. Every time you visit... my body is calling me home."',
            internal: '[Visual: Her sprite flickers with emotion.]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp',
                highlight: 'right'
            },
            next: () => this.act2Beat6_solution(),
            delay: 4000
        }, 'act2Beat6_confirm');
    }

    act2Beat6_solution() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Then that\'s it. The Tamagotchi needs to be touching your body. Physical contact. That\'s how you jump back!"',
            internal: '[Visual: Both of them. The solution found. Hope surges.]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp'
            },
            next: () => this.act2Beat6_crisis(),
            delay: 5000
        }, 'act2Beat6_solution');
    }

    act2Beat6_crisis() {
        // HAPTIC: Phone vibration - urgent
        if (this.game.triggerHaptic) {
            this.game.triggerHaptic('heavy', 'Phone call - crisis', { force: true });
        }

        this.game.displayScene({
            character: 'Narration',
            dialogue: '[RING RING RING]\n\n[Ronnie\'s phone. Hospital calling.]',
            internal: '[Visual: Phone screen - "ST. MERCY HOSPITAL" displayed.]',
            background: '../assets/apartment.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat6_call(),
            delay: 3000
        }, 'act2Beat6_crisis');
    }

    act2Beat6_call() {
        this.game.displayScene({
            character: 'Nurse (phone)',
            dialogue: '"Mr. Santos? This is St. Mercy. Your wife\'s vitals are dropping. You need to come now."',
            internal: '[Visual: Ronnie\'s face drains of color.]',
            background: '../assets/apartment.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat6_timeLimit(),
            delay: 4000,
            style: 'critical'
        }, 'act2Beat6_call');
    }

    act2Beat6_timeLimit() {
        this.game.displayScene({
            character: 'Ronnie (internal)',
            dialogue: '"We know how to save her. But we\'re running out of time."',
            internal: '[Visual: Ronnie grabs the Tamagotchi. Runs for the door.]\n[The race begins.]',
            background: '../assets/apartment.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2End(),
            delay: 4000
        }, 'act2Beat6_timeLimit');
    }

    // Act 2 End - Transition to Act 3
    act2End() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"And then... everything broke."',
            internal: '[Visual overload: alarms, static, screen fades white.]\n[→ Act 3: The final push begins]',
            background: '../assets/genericBack.png',
            next: () => this.route.act3.startAct3(),
            delay: 3000
        }, 'act2End');
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.RonnieRouteAct2 = RonnieRouteAct2;
}

// ES Module export
export { RonnieRouteAct2 };
