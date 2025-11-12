// RONNIE'S ROUTE - ACT 2
// Loop Mechanics & Bootstrap Paradox Discovery

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
            next: () => this.act2Beat1_discovery(),
            delay: 4000
        }, 'startAct2');
    }

    act2Beat1_discovery() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Tori... do you remember yesterday? What we talked about?"',
            internal: '[Visual: Tori-gatchi interface. Her sprite is normal, smiling.]',
            next: () => this.act2Beat1_confusion(),
            delay: 3000
        }, 'act2Beat1_discovery');
    }

    act2Beat1_confusion() {
        this.game.displayScene({
            character: 'Tori (confused)',
            dialogue: '"Yesterday? Baby, we talked about the hospital. Your visit. You showed me the game..."',
            internal: '[Ronnie (internal): "That was WEEKS ago."]',
            next: () => this.act2Beat2(),
            delay: 3500
        }, 'act2Beat1_confusion');
    }

    // Beat 2: Research - Building the Bridge
    act2Beat2() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '"I dug deeper. Something kept her tethered - fragmented, looping. I couldn\'t pull her out... but maybe I could send something IN."',
            internal: '[Visual: Ronnie surrounded by open journals, code snippets, diagrams of consciousness transfer theories. The Tamagotchi glows faintly beside his keyboard.]',
            next: () => this.act2Beat2_code(),
            delay: 5000
        }, 'act2Beat2');
    }

    act2Beat2_code() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"If I could create a version of myself inside the code... a guide, an anchor... maybe she could find her way back through me."',
            internal: '[Code appears on screen: \'digital_ronnie_construct.js\' - loops, memory structures, decision trees.]',
            next: () => this.act2Beat3(),
            delay: 4500
        }, 'act2Beat2_code');
    }

    // Beat 3-7: Loop iterations (can be expanded later for pacing)
    act2Beat3() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '[BEAT 3-6: Iterations - Multiple failed attempts. Each time, she resets. Each time, he refines the construct.]\n\nVersion 848.1: "Tori, follow my voice."\nVersion 848.2: "Remember the hospital."\nVersion 848.3: "Hold onto the Tamagotchi."\n\nEach time: Reset. Loop. Again.',
            internal: '[Visual: Montage of Ronnie coding frantically, testing, failing. Days blur into weeks. The Tamagotchi screen flickers with each attempt.]',
            next: () => this.act2Beat7(),
            delay: 6000
        }, 'act2Beat3');
    }

    // Beat 7: The Discovery (Body Anchor Concept)
    act2Beat7() {
        this.game.displayScene({
            character: 'Ronnie (realization)',
            dialogue: '"Wait... what if it\'s not about PULLING her out? What if it\'s about showing her the way HOME?"',
            internal: '[Visual: Eureka moment. He looks at the Tamagotchi, then at a photo of Tori in the hospital bed.]\n[The connection clicks.]',
            next: () => this.act2Beat7_theory(),
            delay: 4000
        }, 'act2Beat7');
    }

    act2Beat7_theory() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"Her body. It\'s still there. Still breathing. Still WAITING. If I could make her REMEMBER her body... make her feel the heartbeat... she might follow it back."',
            internal: '[Visual: Diagram appears - consciousness tether connecting digital space to physical body. The Tamagotchi as the bridge.]',
            next: () => this.act2Beat8(),
            delay: 5000
        }, 'act2Beat7_theory');
    }

    // Beat 8: Critical Choice - The Approach
    act2Beat8() {
        this.game.displayScene({
            character: 'System',
            dialogue: 'CRITICAL APPROACH DETECTED',
            internal: 'How will you guide her back?\n\n> UPLOAD: Expand the code. Bring her body INTO the digital space.\n  Risk: She may choose to stay digital.\n\n> ANCHOR: Strengthen the body connection. Make her FEEL her heartbeat.\n  Success: True return to physical form.\n\n> SILENT: Say nothing. Let presence be the guide.\n  Risk: Ambiguous - could lead anywhere.',
            choices: [
                { text: 'Upload her consciousness fully into expanded code', value: 'upload' },
                { text: 'Anchor her to her body through heartbeat connection', value: 'anchor' },
                { text: 'Stay silent. Let love guide the way.', value: 'silent' }
            ],
            onChoice: (choice) => {
                this.game.gameState.flags.act2_final_choice = choice;
                this.act2Beat8_outcome(choice);
            }
        }, 'act2Beat8');
    }

    act2Beat8_outcome(choice) {
        let dialogue = '';
        let nextScene = null;

        if (choice === 'upload') {
            // Bad Route Tilt
            dialogue = '"If you can\'t come back... I\'ll come TO you. We\'ll expand the space. Make it real enough for both of us."\n[Upload bar UI: 32% → 56% → 100%]\n"There! You\'re safe now—\n\n[Tori (weak, glitching): "...Ronnie... I\'m still stuck. You can\'t... upload a soul."]';
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
        }, 'act2Beat8_outcome');
    }

    act2Beat8_end() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"And then... everything broke."',
            internal: '[Visual overload: alarms, static, screen fades white.]\n[→ Act 3: Fakeout begins]',
            next: () => this.route.act3.startAct3(),
            delay: 3000
        }, 'act2Beat8_end');
    }
}
