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

    ronnie_act2_01_start() {
        // Beat 1: Realization - Something's Wrong
        this.game.displayScene({
            character: 'Ronnie (internal)',
            dialogue: '"Something is wrong. The conversations loop. She says the same things. Asks the same questions."',
            internal: '[Visual: Ronnie at his desk. Multiple browser tabs open showing chat logs. Text highlighted - identical phrases from different days.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act2_02_discovery(),
            delay: 4000
        }, 'ronnie_act2_01_start');
    }

    ronnie_act2_02_discovery() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Tori... do you remember yesterday? What we talked about?"',
            internal: '[Visual: Tori-gatchi interface. Her sprite is normal, smiling.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act2_03_confusion(),
            delay: 3000
        }, 'ronnie_act2_02_discovery');
    }

    ronnie_act2_03_confusion() {
        this.game.displayScene({
            character: 'Tori (confused)',
            dialogue: '"Yesterday? Baby, we talked about the hospital. Your visit. You showed me the game..."',
            internal: '[Ronnie (internal): "That was WEEKS ago."]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.ronnie_act2_04_code(),
            delay: 3500
        }, 'ronnie_act2_03_confusion');
    }

    // Beat 2: Research - Building the Bridge
    ronnie_act2_04_code() {
        // Unlock PerplexiZee's research data note
        this.route.collectiblesManager.unlockNote('pz1');

        this.game.displayScene({
            character: 'Narration',
            dialogue: '"I dug deeper. Something kept her tethered - fragmented, looping. I couldn\'t pull her out... but maybe I could send something IN."',
            internal: '[Visual: Ronnie surrounded by open journals, code snippets, diagrams of consciousness transfer theories. The Tamagotchi glows faintly beside his keyboard.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act2_05_codeanalysis(),
            delay: 5000
        }, 'ronnie_act2_04_code');
    }

    ronnie_act2_05_codeanalysis() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"If I could create a version of myself inside the code... a guide, an anchor... maybe she could find her way back through me."',
            internal: '[Code appears on screen: \'digital_ronnie_construct.js\' - loops, memory structures, decision trees.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act2_06_patterns(),
            delay: 4500
        }, 'ronnie_act2_05_codeanalysis');
    }

    // Beat 3-7: Loop iterations (can be expanded later for pacing)
    ronnie_act2_06_patterns() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Days blur together. Each attempt brings hope. Each failure brings despair.',
            internal: '[Visual: Montage of Ronnie coding frantically, testing, failing. Days blur into weeks. The Tamagotchi screen flickers with each attempt.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act2_07_breakthrough(),
            delay: 6000
        }, 'ronnie_act2_06_patterns');
    }

    // Beat 7: The Discovery (Body Anchor Concept)
    ronnie_act2_07_breakthrough() {
        this.game.displayScene({
            character: 'Ronnie (realization)',
            dialogue: '"Wait... what if it\'s not about PULLING her out? What if it\'s about showing her the way HOME?"',
            internal: '[Visual: Eureka moment. He looks at the Tamagotchi, then at a photo of Tori in the hospital bed.]\n[The connection clicks.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act2_08_theory(),
            delay: 4000
        }, 'ronnie_act2_07_breakthrough');
    }

    ronnie_act2_08_theory() {
        // Unlock Belle's heartbeat/body anchor note
        this.route.collectiblesManager.unlockNote('iz2');

        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"Her body. It\'s still there. Still breathing. Still WAITING. If I could make her REMEMBER her body... make her feel the heartbeat... she might follow it back."',
            internal: '[Visual: Diagram appears - consciousness tether connecting digital space to physical body. The Tamagotchi as the bridge.]',
            background: 'assets/digitalSpace.png',
            sprites: {
                left: 'assets/ronnie-sprite.png'
            },
            next: () => this.ronnie_act2_09_decision(),
            delay: 5000
        }, 'ronnie_act2_08_theory');
    }

    // Beat 8: Critical Choice - The Approach
    ronnie_act2_09_decision() {
        // Unlock GenZee's upload paradox warning BEFORE player makes choice
        this.route.collectiblesManager.unlockNote('gz2');

        this.game.displayScene({
            character: 'System',
            dialogue: 'CRITICAL APPROACH DETECTED',
            internal: 'How will you guide her back?\n\n> UPLOAD: Expand the code. Bring her body INTO the digital space.\n  Risk: She may choose to stay digital.\n\n> ANCHOR: Strengthen the body connection. Make her FEEL her heartbeat.\n  Success: True return to physical form.\n\n> SILENT: Say nothing. Let presence be the guide.\n  Risk: Ambiguous - could lead anywhere.',
            background: 'assets/digitalSpace.png',
            choices: [
                { text: 'Upload her consciousness fully into expanded code', value: 'upload' },
                { text: 'Anchor her to her body through heartbeat connection', value: 'anchor' },
                { text: 'Stay silent. Let love guide the way.', value: 'silent' }
            ],
            onChoice: (choice) => {
                this.game.gameState.flags.act2_final_choice = choice;
                this.ronnie_act2_10_outcome(choice);
            }
        }, 'ronnie_act2_09_decision');
    }

    ronnie_act2_10_outcome(choice) {
        let dialogue = '';
        let nextScene = null;
        let background = 'digitalSpace.png';
        let sprites = {};

        if (choice === 'upload') {
            // Bad Route Tilt
            dialogue = '"If you can\'t come back... I\'ll come TO you. We\'ll expand the space. Make it real enough for both of us."\n[Upload bar UI: 32% → 56% → 100%]\n"There! You\'re safe now—"\n\n[Tori (weak, glitching): "...Ronnie... I\'m still stuck. You can\'t... upload a soul."]';
            this.game.gameState.flags.bad_route_tilt = (this.game.gameState.flags.bad_route_tilt || 0) + 2;
            sprites = {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            };
            nextScene = () => this.ronnie_act2_11_end();
        } else if (choice === 'anchor') {
            // True Route Tilt
            dialogue = '"Your body\'s calling you back. That\'s where you belong."\n\n[Tori (softening): "...Home. I feel it..."]';
            this.game.gameState.flags.true_route_tilt = (this.game.gameState.flags.true_route_tilt || 0) + 2;
            sprites = {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            };
            nextScene = () => this.ronnie_act2_11_end();
        } else if (choice === 'silent') {
            // Digital Forever Tilt
            dialogue = '[Ronnie says nothing. Holds her hand to his cheek.]\n\n[Tori (whispers): "...Even without words... you still anchor me."]';
            this.game.gameState.flags.digital_forever_tilt = (this.game.gameState.flags.digital_forever_tilt || 0) + 2;
            sprites = {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            };
            nextScene = () => this.ronnie_act2_11_end();
        }

        this.game.displayScene({
            character: choice === 'upload' ? 'Ronnie (frantic)' : choice === 'silent' ? 'Narration' : 'Ronnie (steady)',
            dialogue: dialogue,
            background: background,
            sprites: sprites,
            next: nextScene,
            delay: 5000
        }, 'ronnie_act2_10_outcome');
    }

    ronnie_act2_11_end() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"And then... everything broke."',
            internal: '[Visual overload: alarms, static, screen fades white.]\n[→ Act 3: Fakeout begins]',
            background: 'genericBack.png',
            next: () => this.route.act3.startAct3(),
            delay: 3000
        }, 'ronnie_act2_11_end');
    }
}
