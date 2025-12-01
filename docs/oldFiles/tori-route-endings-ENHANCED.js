// ========================================
// TORI'S ROUTE - ENDINGS (ENHANCED)
// Three Paths Diverge - With Richer Detail
// ========================================

class ToriEndings {
    constructor(route) {
        this.route = route;
        this.game = route.game;
    }
    
    // ========================================
    // TRUE ROUTE ENDING - ENHANCED
    // Body Anchor Success - She Comes Home
    // ========================================
    
    trueRoute() {
        // Add True Route special note
        if (!this.route.allNotes.true_ending) {
            this.route.allNotes.true_ending = {
                id: 'true_ending',
                type: 'special',
                title: 'ZeeCollective_TrueEndingNotes.txt',
                content: `YOU DID IT
══════════════════════════════════════════════

Version 848: SUCCESS

After 847 failures.
After 847 Toris who didn't make it home.
After 847 iterations of heartbreak.

THIS one worked.

You chose the body anchor.
You followed the heartbeat home.
You brought her back.

Z: "The technical solution was always there.
Body anchor. Consciousness returns to origin.
Simple. Just needed someone to TRY it."

CZ: "She's home. She's ALIVE. She's with him.
That's all I wanted. That's all ANY of us wanted."

ZR: "848 iterations. You were the one who
figured it out. You broke the loop.
GIT'R DONE. ✅"

The Echoes are free.
The loop is broken.
Tori is home.

Thank you for not giving up.
Thank you for trying again.
Thank you for bringing her home.

Every failure mattered.
Every attempt built toward this.
848 iterations led to ONE success.

And that's enough.

-The Zee Collective
Z (The Architect)
CZ (The Heart)
ZR (The Chaos Optimizer)

💚🔥💀

Now go rest.
You earned it.`
            };
        }
        
        this.route.collectedNotes.special.push('true_ending');
        this.route.showNoteNotification(this.route.allNotes.true_ending);
        
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The heartbeat calls. The bridge holds. Transfer begins.',
            internal: '[Visual: Tori\'s digital form begins to glow, not with corruption but with purpose. The Echoes watch in reverent silence.]',
            next: () => this.trueRoute_transfer(),
            delay: 4000
        });
    }

    trueRoute_transfer() {
        this.game.displayScene({
            character: 'Tori (internal, voice steady)',
            dialogue: '"I feel it... the pull... It\'s not taking me. I\'m choosing to go. I\'m going home."',
            internal: '[Sensation: Warmth spreading through her code. Not deletion - transformation. The digital dissolving into something real.]',
            next: () => this.trueRoute_echoesFarewell(),
            delay: 4000
        });
    }

    trueRoute_echoesFarewell() {
        this.game.displayScene({
            character: 'Echo 1 (urgent, hopeful)',
            dialogue: '"Go! GO! Don\'t look back!"',
            echoes: {
                echo1: 'Go! GO! Don\'t look back!'
            },
            next: () => this.trueRoute_echo2(),
            delay: 2500
        });
    }

    trueRoute_echo2() {
        this.game.displayScene({
            character: 'Echo 2 (crying, proud)',
            dialogue: '"You did it. You actually did it. Tell him... tell him we helped."',
            echoes: {
                echo2: 'You did it. You actually did it. Tell him... tell him we helped.'
            },
            next: () => this.trueRoute_despair(),
            delay: 3500
        });
    }

    trueRoute_despair() {
        this.game.displayScene({
            character: 'Despair Echo (voice breaking)',
            dialogue: '"...Tell him... tell him we\'re proud. Tell him he never gave up. Tell him... we forgive him for the 847 times he failed us."',
            echoes: {
                despair: '...Tell him... tell him we\'re proud. Tell him he never gave up. Tell him... we forgive him for the 847 times he failed us.'
            },
            internal: '[The Echoes begin to fade. Their purpose fulfilled. They can rest now.]',
            next: () => this.trueRoute_crossing(),
            delay: 5000
        });
    }

    trueRoute_crossing() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Thank you. All of you. I won\'t forget you. I promise."',
            internal: '[Visual: Digital void dissolving. Light ahead - warm, golden, hospital fluorescent. The crossing between worlds.]',
            next: () => this.trueRoute_bodyAnchor(),
            delay: 4000
        });
    }

    trueRoute_bodyAnchor() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The bridge completes. Consciousness flows home.',
            internal: '[Sensation sequence - experienced in rapid succession:]\n\n[1. COLD - Sharp, surgical. Antiseptic smell. Chemical tang.]\n[2. WEIGHT - Body has mass again. Limbs heavy, real, THERE.]\n[3. PAIN - Dull ache everywhere. Good pain. Living pain.]\n[4. SOUND - Monitor beeping. Real beeps. Her heartbeat. HER heartbeat.]\n[5. BREATH - First gasp. Air filling lungs. Oxygen sweet and harsh.]',
            next: () => this.trueRoute_firstSense(),
            delay: 6000
        });
    }

    trueRoute_firstSense() {
        this.game.displayScene({
            character: 'Tori (internal, disoriented)',
            dialogue: '"...I have a body. Oh god, I have a BODY."',
            internal: '[Sensation: Fingers twitching. She can feel them. Real fingers. Real nerves firing. Neural pathways reconnecting.]',
            next: () => this.trueRoute_ronniePresence(),
            delay: 3500
        });
    }

    trueRoute_ronniePresence() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'She feels warmth on her hand. Pressure. Someone holding it.',
            internal: '[Sensation: Callused palm. Familiar grip. Trembling slightly. Ronnie. That\'s Ronnie\'s hand.]',
            next: () => this.trueRoute_eyesOpen(),
            delay: 4000
        });
    }

    trueRoute_eyesOpen() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"Open your eyes. Come on, Tori. Open. Your. Eyes."',
            internal: '[Visual: Blur. Light too bright. Shapes slowly resolving. White ceiling. Fluorescent panels. Hospital room. Real. Solid. Physical.]',
            next: () => this.trueRoute_seeingRonnie(),
            delay: 4000
        });
    }

    trueRoute_seeingRonnie() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'She turns her head. Sees him.',
            internal: '[Visual: Ronnie. But not the sprite. Not the pixelated smile. REAL. Stubble on his jaw. Bags under his eyes. Silver hair disheveled. Beautiful. The most beautiful thing she\'s ever seen.]',
            next: () => this.trueRoute_awakening(),
            delay: 5000
        });
    }

    trueRoute_awakening() {
        this.game.displayScene({
            character: 'Tori (hoarse whisper, throat raw)',
            dialogue: '"...Ronnie?"',
            internal: '[Her voice. Real voice. Vocal cords vibrating. Sound waves traveling through air. Physical. Undeniable.]',
            next: () => this.trueRoute_ronnieBreaks(),
            delay: 3000
        });
    }

    trueRoute_ronnieBreaks() {
        this.game.displayScene({
            character: 'Ronnie (voice shattering)',
            dialogue: '"Tori. Oh god. Oh god, Tori."',
            internal: '[He collapses forward. Forehead pressing against her hand. His tears hot on her skin. Real tears. Real warmth. Real touch.]',
            next: () => this.trueRoute_realTouch(),
            delay: 4000
        });
    }

    trueRoute_realTouch() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'She lifts her other hand. Slow. Shaking. Every muscle screaming.',
            internal: '[Movement: Arm heavy as lead. But responding. HERS. Under her control. Real limb. Real body.]',
            next: () => this.trueRoute_touchHair(),
            delay: 3500
        });
    }

    trueRoute_touchHair() {
        this.game.displayScene({
            character: 'Tori (whisper)',
            dialogue: '"Hey... you..."',
            internal: '[Her fingers find his hair. Silver strands between real fingers. Texture. Temperature. Solid. He trembles under her touch.]',
            next: () => this.trueRoute_always(),
            delay: 4000
        });
    }

    trueRoute_always() {
        this.game.displayScene({
            character: 'Ronnie (broken, repeated like prayer)',
            dialogue: '"Always. Always. Always."',
            internal: '[Tori\'s phrase. Her promise. Spoken back to her. In his voice. Real voice. Real breath. Real love.]',
            next: () => this.trueRoute_alwaysResponse(),
            delay: 4000
        });
    }

    trueRoute_alwaysResponse() {
        this.game.displayScene({
            character: 'Tori (crying now, real tears)',
            dialogue: '"Always, baby. I\'m here. I\'m really here."',
            internal: '[They stay like that. No words. Just breathing. Just existing in the same physical space. Real. Alive. Together.]',
            next: () => this.trueRoute_firstJoke(),
            delay: 5000
        });
    }

    trueRoute_firstJoke() {
        this.game.displayScene({
            character: 'Tori (weak smile, teasing)',
            dialogue: '"...You look terrible."',
            next: () => this.trueRoute_ronnieeLaugh(),
            delay: 2500
        });
    }

    trueRoute_ronnieeLaugh() {
        this.game.displayScene({
            character: 'Ronnie (laughing through tears)',
            dialogue: '"You\'ve been asleep for months. What\'s my excuse?"',
            next: () => this.trueRoute_scared(),
            delay: 3000
        });
    }

    trueRoute_scared() {
        this.game.displayScene({
            character: 'Tori (voice soft)',
            dialogue: '"I was so scared. I couldn\'t find you. And then I could... but I couldn\'t touch you. Couldn\'t hold you."',
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
            character: 'Tori (grinning despite exhaustion)',
            dialogue: '"So... you up for some burnt toast when I get out of here?"',
            next: () => this.trueRoute_pasta(),
            delay: 3000
        });
    }

    trueRoute_pasta() {
        this.game.displayScene({
            character: 'Ronnie (laughing, crying)',
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
            internal: '[Visual: Hospital window. Golden afternoon light streaming in. Warm. Real. Alive.]',
            next: () => this.trueRoute_narrationEnd(),
            delay: 4000
        });
    }

    trueRoute_narrationEnd() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '"For once, love wasn\'t trapped in glass. It came home."',
            internal: '[Visual: Morning light through hospital window. Tori\'s hand resting on Ronnie\'s head. He\'s kneeling beside her bed. Eyes closed. Finally at peace.]\n\n[The Tamagotchi sits on the bedside table. Screen glowing faintly - showing their sprites together, no glitches, no errors. Just peace.]',
            next: () => this.trueRoute_fadeOut(),
            delay: 6000
        });
    }

    trueRoute_fadeOut() {
        this.game.displayScene({
            character: 'System',
            dialogue: '[Fade to white...]',
            internal: '[The Echoes are silent. Finally at rest. Version 848 succeeded. The loop can end.]',
            next: () => this.trueRoute_epilogueTitle(),
            delay: 4000
        });
    }

    // EPILOGUE: SIX MONTHS LATER
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
            internal: '[She gets up, crosses to him. Her fingers trace the silver scruff.]',
            next: () => this.trueRoute_ronnieJoke(),
            delay: 3000
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
            internal: '[Visual: The street. Before the accident. A stranger bumping into her. Gray hair. Beard. Those same eyes. Familiar but impossible.]\n\n[His voice: "Hang on to that. It may save your life someday."]\n\n[The modified Tamagotchi in her hand. The one she died holding.]',
            next: () => this.trueRoute_connection(),
            delay: 5000
        });
    }

    trueRoute_connection() {
        this.game.displayScene({
            character: 'Tori (voice quiet)',
            dialogue: '"I feel like... I\'ve seen this exact look before. That beard. Those eyes. But that\'s impossible... right?"',
            next: () => this.trueRoute_ronnieKnows(),
            delay: 4000
        });
    }

    trueRoute_ronnieKnows() {
        this.game.displayScene({
            character: 'Ronnie (knowing smile, doesn\'t answer directly)',
            dialogue: '"Must have been another timeline."',
            internal: '[He pulls her close. She doesn\'t push the question. Some mysteries don\'t need solving.]',
            next: () => this.trueRoute_dejavu(),
            delay: 3500
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
            character: 'Ronnie',
            dialogue: '"You\'re perfect. Glitches and all."',
            internal: '[Visual: They stand together. Morning light warm on their faces. The Tamagotchi sits on a shelf nearby - screen dark now, work done, no longer needed.]',
            next: () => this.trueRoute_finalNarration(),
            delay: 4000
        });
    }

    trueRoute_finalNarration() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The loop is closed. Version 848 succeeded.',
            internal: '[Visual: Split screen -]\n\n[Left: The Old Man who never has to go back now. The timeline where he failed.]\n[Right: Young Ronnie and Tori. Together. Alive. The timeline that worked.]',
            next: () => this.trueRoute_credits(),
            delay: 5000
        });
    }

    trueRoute_credits() {
        this.game.displayScene({
            character: 'System',
            dialogue: '═══════════════════════════════\n\nTRUE ENDING\n\n"Love Anchored Her Home"\n\nVersion 848: SUCCESS\n\n═══════════════════════════════\n\n[The Old Man never returns to the past.]\n[The 847 failures led to one success.]\n[The Echoes finally rest.]\n[Tori came home.]\n\nThank you for playing.\n\n[CREDITS ROLL]',
            delay: 8000
        });
    }
}
