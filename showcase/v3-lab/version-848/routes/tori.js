import { ToriAct1 } from './tori-act1.js';
import { ToriAct2 } from './tori-act2.js';
import { ToriAct3 } from './tori-act3.js';
import { ToriEndings } from './tori-endings.js';
import { TetherSystem, CollectiblesManager } from '../system/mechanics.js';

export class ToriRoute {
    constructor(game) {
        this.game = game;

        // Initialize Sub-Systems
        this.tetherSystem = new TetherSystem(game, this);
        this.collectiblesManager = new CollectiblesManager(game, this);

        // Initialize Acts
        this.act1 = new ToriAct1(this);
        this.act2 = new ToriAct2(this);
        this.act3 = new ToriAct3(this);
        this.endings = new ToriEndings(this);

        // Initialize State
        this.tetherSystem.init();
    }

    start() {
        console.log("🌸 Tori Route Started");
        this.act1.start();
    }

    // Helper methods used by Acts
    unlockNote(id) {
        this.collectiblesManager.unlockNote(id);
    }

    addRoutePoints(type, amount) {
        console.log(`Route Points: ${type} +${amount}`);
    }

    determineEnding() {
        // Simple logic for demo: randomly pick or default to True
        // In full game this calculates based on points
        return 'true';
    }
}
