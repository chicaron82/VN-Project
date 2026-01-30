export class ToriAct3 {
    constructor(route) {
        this.route = route;
        this.game = route.game;
    }

    start() {
        this.beat2();
    }

    beat2() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Pixel kitchen. Cooking memory. But something\'s... off.',
            internal: '[Visual: The same scene from Act 2. But corrupted. Colors bleeding.]',
            background: '../assets/digitalSpace.png',
            next: () => this.beat3_firstBox(),
            delay: 3000
        }, 'beat2');
    }

    beat3_firstBox() {
        this.game.displayScene({
            character: 'System',
            dialogue: '[Battery: 15%]',
            internal: '[She SEES it. Not as UI. As part of her reality.]',
            background: '../assets/digitalSpace.png',
            next: () => this.beat5_realization(),
            delay: 2000,
            style: 'critical'
        }, 'beat3_firstBox');
    }

    beat5_realization() {
        this.game.displayScene({
            character: 'Tori (internal, revelation)',
            dialogue: '"The device isn\'t a PRISON. It\'s a BRIDGE. I\'m connected to my body. The heartbeat I\'m feeling is MINE."',
            background: '../assets/digitalSpace.png',
            next: () => this.beat7_phoneCall(),
            delay: 4000,
            style: 'critical'
        }, 'beat5_realization');
    }

    beat7_phoneCall() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'His phone SCREAMS.',
            internal: '[Incoming call: City General Hospital. ICU. URGENT.]',
            background: '../assets/apartment.png',
            next: () => this.beat7_decision(),
            delay: 2000,
            style: 'critical'
        }, 'beat7_phoneCall');
    }

    beat7_decision() {
        this.game.displayScene({
            character: 'Ronnie (choice)',
            dialogue: 'One minute. One choice. Everything depends on this.',
            background: '../assets/hospital.png',
            choices: [
                { text: '[Push through - GET TO HER NOW]', value: 'push_through' },
                { text: '[Connect digitally one last time]', value: 'connect' }
            ],
            onChoice: (choice) => {
                if (choice === 'push_through') {
                    this.route.endings.trueRoute();
                } else {
                    this.route.endings.digitalForever();
                }
            }
        }, 'beat7_decision');
    }
}
