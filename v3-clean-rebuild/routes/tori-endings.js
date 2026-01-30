import { Epilogue } from './epilogue.js';

export class ToriEndings {
    constructor(route) {
        this.route = route;
        this.game = route.game;
    }

    trueRoute() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The heartbeat calls. The bridge holds. Transfer begins.',
            internal: '[Visual: Tori\'s digital form dissolving. Following the warmth home.]',
            background: '../assets/hospital.png',
            next: () => this.trueRoute_awakening(),
            delay: 4000
        }, 'trueRoute');
    }

    trueRoute_awakening() {
        this.game.displayScene({
            character: 'Tori (external, whisper)',
            dialogue: '"...Ronnie?"',
            internal: '[Visual: Hospital room. Her eyes flutter open. Real eyes. Real body. Real breath.]',
            background: '../assets/hospital.png',
            sprites: {
                right: '../assets/full-sprite-ronnie.webp'
            },
            next: () => {
                // Trigger Epilogue
                const epilogue = new Epilogue(this.game, 'tori');
                epilogue.start();
            },
            delay: 4000,
            style: 'critical'
        }, 'trueRoute_awakening');
    }

    digitalForever() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Both crash. Both transfer. Digital space. Two souls. Forever.',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-tori.webp',
                right: '../assets/full-sprite-ronnie.webp'
            },
            next: () => {
                this.game.showEndingDialog('digitalForever');
            },
            delay: 4000
        }, 'digitalForever');
    }
}
