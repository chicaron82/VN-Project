export class ToriAct2 {
    constructor(route) {
        this.route = route;
        this.game = route.game;
    }

    start() {
        // Unblock saves - Tori proved Despair wrong
        // this.game.saveManager.unblockSaves();

        this.beat1();
    }

    beat1() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Digital park scene. Pixelated cherry blossoms. Tori and Ronnie\'s sprites walking together.',
            internal: '[Visual: First "date" in the digital space. Ronnie coded a scene for them.]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-tori.webp',
                right: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.beat1_iceCream(),
            delay: 3500
        }, 'beat1');
    }

    beat1_iceCream() {
        this.game.displayScene({
            character: 'Ronnie (sprite)',
            dialogue: '"I coded in your favorite. Chocolate chip ice cream."',
            background: '../assets/digitalSpace.png',
            choices: [
                { text: 'Thank him', value: 'thanks' }
            ],
            onChoice: () => this.beat1_despairOverride(),
            delay: 3000
        }, 'beat1_iceCream');
    }

    beat1_despairOverride() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"Wait... Tiger Tail. I want Tiger Tail."',
            internal: '[Her voice overridden by Despair. The system hijacks her intent.]',
            background: '../assets/digitalSpace.png',
            next: () => this.beat1_toriRealization(),
            delay: 2500
        }, 'beat1_despairOverride');
    }

    beat1_toriRealization() {
        this.game.displayScene({
            character: 'Tori (internal, confused)',
            dialogue: '"What? No—that\'s not what I meant to say! I hate Tiger Tail!"',
            background: '../assets/digitalSpace.png',
            next: () => this.beat2_warmth(),
            delay: 3000
        }, 'beat1_toriRealization');
    }

    beat2_warmth() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"That feeling again... warmth. The pull toward my body."',
            background: '../assets/hospital.png',
            next: () => this.beat2_buzz(),
            delay: 3000
        }, 'beat2_warmth');
    }

    beat2_buzz() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The Tamagotchi buzzes. Synced with her heartbeat monitor.',
            internal: '[Same rhythm. Same pulse.]',
            background: '../assets/hospital.png',
            next: () => this.act2End(), // Fast forward for demo
            delay: 3000,
            style: 'critical'
        }, 'beat2_buzz');
    }

    act2End() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '"And then... everything broke."',
            internal: '[Visual overload: alarms, static, screen fades white.]',
            background: '../assets/genericBack.png',
            next: () => this.route.act3.start(),
            delay: 3000
        }, 'act2End');
    }
}
