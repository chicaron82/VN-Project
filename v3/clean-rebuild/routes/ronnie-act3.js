export class RonnieRouteAct3 {
    constructor(route) {
        this.route = route;
        this.game = route.game;
    }

    startAct3() {
        this.act3Beat2();
    }

    act3Beat2() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"Over the next few days, it got worse. She\'d forget things. Small things at first."',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp'
            },
            next: () => this.beat3_firstMessage(),
            delay: 3500
        }, 'act3Beat2');
    }

    beat3_firstMessage() {
        this.game.displayScene({
            character: 'System Message',
            dialogue: '⚠️ WARNING: MEMORY CORRUPTION DETECTED\n⚠️ VESSEL INSTABILITY: 67%',
            internal: '[The text appears over Tori\'s sprite. She can see it too.]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp'
            },
            next: () => this.beat7_phoneCall(),
            delay: 3000,
            style: 'critical'
        }, 'beat3_firstMessage');
    }

    beat7_phoneCall() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'His phone SCREAMS.',
            internal: '[Incoming call: City General Hospital. ICU. URGENT.]',
            background: '../assets/apartment.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act3CriticalChoice(),
            delay: 2000,
            style: 'critical'
        }, 'beat7_phoneCall');
    }

    act3CriticalChoice() {
        this.game.displayScene({
            character: 'Ronnie (internal)',
            dialogue: 'One minute. One choice. Everything depends on this.',
            background: '../assets/hospital.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            choices: [
                { text: '[Push through - GET TO HER NOW]', value: 'push_through' },
                { text: '[Connect digitally one last time]', value: 'connect' }
            ],
            onChoice: (choice) => {
                if (choice === 'push_through') {
                    // Start Act 1 of Tori's route as the "True Ending" path or similar
                    // In full game this triggers ending sequence. 
                    this.trueRouteEnding();
                } else {
                    this.digitalForeverEnding();
                }
            }
        }, 'act3CriticalChoice');
    }

    trueRouteEnding() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"I made it. I\'m here."',
            background: '../assets/hospital.png',
            next: () => {
                // Trigger Epilogue via Route Controller
                this.route.game.routes.loadRoute('epilogue');
            },
            delay: 2000
        }, 'trueRouteEnding');
    }

    digitalForeverEnding() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"I... I can\'t lose you. If you\'re in the code, I\'m coming with you."',
            background: '../assets/digitalSpace.png',
            next: () => {
                this.game.showEndingDialog('digitalForever');
            },
            delay: 4000
        }, 'digitalForeverEnding');
    }
}
