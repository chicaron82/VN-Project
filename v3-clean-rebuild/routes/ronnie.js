import { RonnieRouteAct2 } from './ronnie-act2.js';
import { RonnieRouteAct3 } from './ronnie-act3.js';
import { TetherSystem, CollectiblesManager } from '../system/mechanics.js';

export class RonnieRoute {
    constructor(game) {
        this.game = game;

        // Initialize Sub-Systems
        this.tetherSystem = new TetherSystem(game, this);
        this.collectiblesManager = new CollectiblesManager(game, this);

        // Initialize Acts
        this.act2 = new RonnieRouteAct2(this);
        this.act3 = new RonnieRouteAct3(this);

        // Initialize State
        this.tetherSystem.init();
    }

    start() {
        console.log("🍂 Ronnie Route Started");
        this.prologueScene4();
    }

    // ========================================
    // SCENE 4: HOSPITAL ANCHOR
    // ========================================
    prologueScene4() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: "She didn't wake up. Days passed. Then weeks. I sat by her side, waiting for a laugh, a smile, anything.",
            background: '../assets/hospital.png',
            next: () => this.prologueScene4_next(),
            delay: 4000
        }, 'prologueScene4');
    }

    prologueScene4_next() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: "That stupid toy was the last thing she held. I couldn't let it go.",
            background: '../assets/hospital.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.prologueScene5(),
            delay: 3500
        }, 'prologueScene4_next');
    }

    // ========================================
    // SCENE 5: THE BUILD
    // ========================================
    prologueScene5() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: "I poured every memory into it. Every laugh I could remember, every fight, every kiss.",
            background: '../assets/apartment.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act1Scene1(),
            delay: 4000
        }, 'prologueScene5');
    }

    // ========================================
    // ACT 1: DISCOVERY
    // ========================================
    act1Scene1() {
        this.game.displayScene({
            character: 'Tori (sprite)',
            dialogue: "Baby? ...Is that you? It's me... Tori. I don't know how, but I'm here.",
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp',
                highlight: 'right'
            },
            choices: [
                { text: '(Tender) Of course it\'s you.', value: 'tender' },
                { text: '(Skeptical) No... this isn\'t possible.', value: 'skeptical' },
                { text: '(Tease) If you\'re really Tori, prove it.', value: 'tease' }
            ],
            onChoice: (choice) => {
                // For demo, all lead to Act 2
                this.act2.startAct2();
            }
        }, 'act1Scene1');
    }

    unlockNote(id) {
        this.collectiblesManager.unlockNote(id);
    }
}
