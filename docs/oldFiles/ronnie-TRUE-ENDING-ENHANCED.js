// ========================================
// RONNIE'S TRUE ROUTE ENDING - ENHANCED
// Replace the existing trueRouteEnding() function
// with this enhanced version
// ========================================

    // TRUE ROUTE ENDING - ENHANCED WITH SENSORY DETAIL & EPILOGUE
    trueRouteEnding() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The call comes. Vitals crashing. He runs.',
            internal: '[Visual: Hospital hallway. Fluorescent lights blurring past. Ronnie\'s footsteps echoing. The Tamagotchi clutched in his fist, buzzing violently.]',
            next: () => this.trueRoute_doorBurst(),
            delay: 3000
        });
    }

    trueRoute_doorBurst() {
        this.game.displayScene({
            character: 'Nurse (urgent)',
            dialogue: '"Sir, you can\'t—"',
            internal: '[Visual: Hospital room. Alarms screaming. Nurses working frantically. Monitor showing erratic heartbeat.]',
            next: () => this.trueRoute_arrival(),
            delay: 2500
        });
    }

    trueRoute_arrival() {
        this.game.displayScene({
            character: 'Ronnie (voice raw)',
            dialogue: '"MOVE!"',
            internal: '[He shoves past. Reaches her bedside. Her hand is cold. Too cold. The monitor flatlines for two seconds. Then catches. Barely.]',
            next: () => this.trueRoute_device(),
            delay: 3000
        });
    }

    trueRoute_device() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"I pressed the Tamagotchi into her palm. Wrapped her fingers around it. Covered her hand with both of mine."',
            internal: '[Visual: The device glows between their hands. Pulsing in sync with the monitor. Bridge activating.]',
            next: () => this.trueRoute_anchor(),
            delay: 4000
        });
    }

    trueRoute_anchor() {
        this.game.displayScene({
            character: 'Ronnie (steady, voice anchoring)',
            dialogue: '"Come home. Follow the heartbeat. I\'m right here, baby. Follow me back."',
            internal: '[Visual: Tamagotchi screen - Tori\'s sprite looking toward the light. Not afraid. Determined.]',
            next: () => this.trueRoute_toriResponse(),
            delay: 4000
        });
    }

    trueRoute_toriResponse() {
        this.game.displayScene({
            character: 'Tori (voice from device, distant but clear)',
            dialogue: '"I hear it... I hear you... I\'m coming..."',
            internal: '[Visual: Her sprite begins to dissolve - not corruption, not glitch. Transformation. Digital becoming physical.]',
            next: () => this.trueRoute_transfer(),
            delay: 4000
        });
    }

    trueRoute_transfer() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The bridge holds. Transfer beginning.',
            internal: '[Visual: Tamagotchi screen - Tori\'s sprite fading like mist in sunlight. Beautiful. Intentional.]\n\n[Visual: Her real body - Fingers twitch. First movement in months.]\n\n[Monitor: Flatline spike... catching... rhythm returning... steady beeping.]',
            next: () => this.trueRoute_eyesMoving(),
            delay: 5000
        });
    }

    trueRoute_eyesMoving() {
        this.game.displayScene({
            character: 'Ronnie (barely breathing)',
            dialogue: '"Come on... come on, Tori..."',
            internal: '[Visual: Her eyes moving beneath closed lids. REM activity. Consciousness returning to the brain. Neural pathways firing.]',
            next: () => this.trueRoute_whisper(),
            delay: 3500
        });
    }

    trueRoute_whisper() {
        this.game.displayScene({
            character: 'Ronnie (whispering, tears streaming)',
            dialogue: '"That\'s it. That\'s it, baby. I\'ve got you. Follow me back."',
            internal: '[Visual: Tamagotchi screen goes completely white. Bright. Pure. Then - darkness. Silent. Work complete.]\n\n[Beat of silence. Monitor steady. Room holding its breath.]',
            next: () => this.trueRoute_awakening(),
            delay: 5000
        });
    }

    trueRoute_awakening() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Her eyes flutter. Open.',
            internal: '[Visual: Tori\'s eyes. Real eyes. Unfocused at first. Blinking against hospital light. Then - finding him. Recognition.]',
            next: () => this.trueRoute_firstWord(),
            delay: 4000
        });
    }

    trueRoute_firstWord() {
        this.game.displayScene({
            character: 'Tori (hoarse, throat raw from disuse)',
            dialogue: '"...Ronnie?"',
            internal: '[Real voice. Physical vocal cords. Sound waves traveling through real air. Not code. Not simulation. REAL.]',
            next: () => this.trueRoute_ronnieBreaks(),
            delay: 3000
        });
    }

    trueRoute_ronnieBreaks() {
        this.game.displayScene({
            character: 'Ronnie (voice shattering)',
            dialogue: '"Tori. Oh god. Oh god, Tori."',
            internal: '[He collapses forward. Forehead against her hand. His tears hot on her skin. Real tears. Real warmth. Real touch.]',
            next: () => this.trueRoute_herTouch(),
            delay: 4000
        });
    }

    trueRoute_herTouch() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'She moves. Her free hand lifts. Shaking. Weak. But HERS.',
            internal: '[Movement: Every muscle screaming from months of stillness. But responding. Real limb. Real control. Her fingers find his hair.]',
            next: () => this.trueRoute_stroke(),
            delay: 4000
        });
    }

    trueRoute_stroke() {
        this.game.displayScene({
            character: 'Tori (whisper)',
            dialogue: '"Hey... you..."',
            internal: '[Touch: Real fingers. Real silver hair. Real texture. He trembles under her hand. Both crying now. No words needed.]',
            next: () => this.trueRoute_always(),
            delay: 4000
        });
    }

    trueRoute_always() {
        this.game.displayScene({
            character: 'Ronnie (broken, repeated like a prayer)',
            dialogue: '"Always. Always. Always."',
            internal: '[Tori\'s phrase. Her promise to him. Given back to her in his voice. Real breath. Real love. Real presence.]',
            next: () => this.trueRoute_alwaysResponse(),
            delay: 4000
        });
    }

    trueRoute_alwaysResponse() {
        this.game.displayScene({
            character: 'Tori (crying, smiling)',
            dialogue: '"Always, baby. I\'m here. I\'m really here."',
            internal: '[They stay like that. Minutes passing. No words. Just breathing. Just existing in the same physical space. Together. Real. Alive.]',
            next: () => this.trueRoute_nurses(),
            delay: 5000
        });
    }

    trueRoute_nurses() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The nurses stare. One is crying. No one moves to separate them.',
            internal: '[Background: Medical staff watching. Some crying. All understanding they\'ve witnessed something impossible. And beautiful.]',
            next: () => this.trueRoute_terrible(),
            delay: 4000
        });
    }

    trueRoute_terrible() {
        this.game.displayScene({
            character: 'Tori (weak smile, teasing)',
            dialogue: '"...You look terrible."',
            next: () => this.trueRoute_months(),
            delay: 2500
        });
    }

    trueRoute_months() {
        this.game.displayScene({
            character: 'Ronnie (laughing through tears)',
            dialogue: '"You\'ve been asleep for months. What\'s my excuse?"',
            next: () => this.trueRoute_scared(),
            delay: 3000
        });
    }

    trueRoute_scared() {
        this.game.displayScene({
            character: 'Tori (soft, voice still hoarse)',
            dialogue: '"I was so scared. I couldn\'t find you. And then I could... but I couldn\'t touch you. Couldn\'t hold you."',
            next: () => this.trueRoute_home(),
            delay: 4000
        });
    }

    trueRoute_home() {
        this.game.displayScene({
            character: 'Ronnie (squeezing her hand gently)',
            dialogue: '"You\'re here now. You\'re real. You\'re home."',
            next: () => this.trueRoute_toast(),
            delay: 3000
        });
    }

    trueRoute_toast() {
        this.game.displayScene({
            character: 'Tori (grinning despite exhaustion)',
            dialogue: '"So... you up for some burnt toast when I get out of here?"',
            next: () => this.trueRoute_pasta(),
            delay: 3000
        });
    }

    trueRoute_pasta() {
        this.game.displayScene({
            character: 'Ronnie (laughing, voice still shaking)',
            dialogue: '"Only if I get to oversalt the pasta."',
            next: () => this.trueRoute_promise(),
            delay: 3000
        });
    }

    trueRoute_promise() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Deal. But I\'m making you eat Tiger Tail ice cream as punishment for making me wait so long."',
            next: () => this.trueRoute_ronnieGroan(),
            delay: 3500
        });
    }

    trueRoute_ronnieGroan() {
        this.game.displayScene({
            character: 'Ronnie (groaning)',
            dialogue: '"You\'re evil. I build you a digital paradise and this is how you repay me?"',
            next: () => this.trueRoute_worth(),
            delay: 3000
        });
    }

    trueRoute_worth() {
        this.game.displayScene({
            character: 'Tori (serious now)',
            dialogue: '"You brought me home, Ronnie. That\'s worth all the Tiger Tail in the world."',
            internal: '[Visual: Hospital window. Golden afternoon light. Warm on their faces. Real. Physical. Beautiful.]',
            next: () => this.trueRoute_narrationEnd(),
            delay: 4000
        });
    }

    trueRoute_narrationEnd() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"For once, love wasn\'t trapped in glass. It came home."',
            internal: '[Visual: Hospital room at peace. Tori awake. Ronnie kneeling beside her bed. Her hand in his hair. His tears drying. Both finally breathing again.]\n\n[The Tamagotchi sits on the bedside table. Screen dark now. Silent. Work done. No longer needed.]',
            next: () => this.trueRoute_fadeOut(),
            delay: 6000
        });
    }

    trueRoute_fadeOut() {
        this.game.displayScene({
            character: 'System',
            dialogue: '[Fade to white...]',
            internal: '[Visual: White transition. Peaceful. Complete.]',
            next: () => this.trueRoute_epilogueTitle(),
            delay: 3000
        });
    }

    // ========================================
    // EPILOGUE: SIX MONTHS LATER
    // The Beard / Old Man Connection
    // ========================================
    trueRoute_epilogueTitle() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '[EPILOGUE: SIX MONTHS LATER]',
            internal: '[Visual: Their apartment. Morning light filtering through curtains. Coffee brewing. Domestic peace.]',
            next: () => this.trueRoute_morningScene(),
            delay: 3000
        });
    }

    trueRoute_morningScene() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Ronnie stands by the window, coffee in hand. Tori watches him from the couch.',
            internal: '[Visual: He\'s grown a beard. Silver threading through it. Makes him look distinguished. Older. Like he\'s lived through something.]',
            next: () => this.trueRoute_beard(),
            delay: 4000
        });
    }

    trueRoute_beard() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"You know... that beard really suits you."',
            internal: '[She gets up, crosses to him. Her fingers trace the silver scruff. Real touch. Still marveling at it.]',
            next: () => this.trueRoute_ronnieJoke(),
            delay: 3500
        });
    }

    trueRoute_ronnieJoke() {
        this.game.displayScene({
            character: 'Ronnie (grinning)',
            dialogue: '"Thought I\'d try it out. It\'s getting colder. Keeps my face warm 😜 Plus I\'ll look like Santa if I put the hat on."',
            next: () => this.trueRoute_realization(),
            delay: 3000
        });
    }

    trueRoute_realization() {
        this.game.displayScene({
            character: 'Tori (pause, distant look)',
            dialogue: '"You look... distinguished. Older. Like you\'ve seen things. Like you\'ve been through..."',
            internal: '[Something flickers at the edge of memory. A flash. A street. A bump. An old man reaching for her.]',
            next: () => this.trueRoute_flashback(),
            delay: 4000
        });
    }

    trueRoute_flashback() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '[MEMORY FRAGMENT]',
            internal: '[Visual: The street. Before the accident. A stranger bumping into her. Gray hair. Beard. Those same eyes. Familiar but impossible.]\n\n[His voice: "Hang on to that. It may save your life someday."]\n\n[The modified Tamagotchi pressed into her hand. The one she died holding.]',
            next: () => this.trueRoute_connection(),
            delay: 5000
        });
    }

    trueRoute_connection() {
        this.game.displayScene({
            character: 'Tori (voice quiet, confused)',
            dialogue: '"I feel like... I\'ve seen this exact look before. That beard. Those eyes. But that\'s impossible... right?"',
            next: () => this.trueRoute_ronnieKnows(),
            delay: 4000
        });
    }

    trueRoute_ronnieKnows() {
        this.game.displayScene({
            character: 'Ronnie (knowing smile, doesn\'t answer directly)',
            dialogue: '"Must have been another timeline."',
            internal: '[He pulls her close. She doesn\'t push the question. Some mysteries don\'t need solving. Some loops are better left closed.]',
            next: () => this.trueRoute_dejavu(),
            delay: 4000
        });
    }

    trueRoute_dejavu() {
        this.game.displayScene({
            character: 'Tori (laughing it off)',
            dialogue: '"Weird. Déjà vu, I guess. Maybe I\'m still a little glitchy."',
            next: () => this.trueRoute_ronnieResponse(),
            delay: 3000
        });
    }

    trueRoute_ronnieResponse() {
        this.game.displayScene({
            character: 'Ronnie (serious, pulling her closer)',
            dialogue: '"You\'re perfect. Glitches and all."',
            internal: '[Visual: They stand together. Morning light warm on their faces. The Tamagotchi sits on a shelf nearby - screen dark, dust gathering, no longer needed. Its work complete.]',
            next: () => this.trueRoute_kiss(),
            delay: 4000
        });
    }

    trueRoute_kiss() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'He kisses her forehead. She leans into him. Real warmth. Real touch. Real future.',
            internal: '[They stay like that. No words. Just existing together. Finally.]',
            next: () => this.trueRoute_finalNarration(),
            delay: 4000
        });
    }

    trueRoute_finalNarration() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The loop is closed. Version 848 succeeded.',
            internal: '[Visual: Split screen -]\n\n[Left: The Old Man who never has to go back now. The timeline where he failed. The 847 attempts that ended in heartbreak.]\n\n[Right: Young Ronnie and Tori. Together. Alive. Real. The timeline that worked.]',
            next: () => this.trueRoute_oldMan(),
            delay: 6000
        });
    }

    trueRoute_oldMan() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Somewhere, in another timeline, an old man with a gray beard puts down his tools.',
            internal: '[Visual: Workshop. Temporal equipment. Modified Tamagotchi on workbench. But the need is gone. The mission complete.]',
            next: () => this.trueRoute_oldManPeace(),
            delay: 4000
        });
    }

    trueRoute_oldManPeace() {
        this.game.displayScene({
            character: 'Old Ronnie (distant voice)',
            dialogue: '"She made it home. I can rest now."',
            internal: '[Visual: He closes his eyes. Finally at peace. The bootstrap paradox complete. Both timelines healed.]',
            next: () => this.trueRoute_credits(),
            delay: 4000
        });
    }

    trueRoute_credits() {
        this.game.displayScene({
            character: 'System',
            dialogue: '═══════════════════════════════\n\nTRUE ENDING\n\n"Love Anchored Her Home"\n\nVersion 848: SUCCESS\n\n═══════════════════════════════\n\n[The Old Man never needs to return.]\n[The 847 failures led to one success.]\n[The loop is closed.]\n[Tori came home.]\n\nThank you for playing.\n\n[CREDITS ROLL]',
            internal: '[No retry prompt. This is the escape from the loop. This is the ending that works. This is the one that matters.]',
            delay: 8000
        });
    }
