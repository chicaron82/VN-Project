export class RonnieRouteAct2 {
    constructor(route) {
        this.route = route;
        this.game = route.game;
    }

    startAct2() {
        // Beat 1: Realization - Something's Wrong
        this.game.displayScene({
            character: 'Ronnie (internal)',
            dialogue: '"Something is wrong. The conversations loop. She says the same things. Asks the same questions."',
            internal: '[Visual: Ronnie at his desk. Multiple browser tabs open showing chat logs. Text highlighted - identical phrases from different days.]',
            background: '../assets/apartment.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat1_discovery(),
            delay: 4000
        }, 'startAct2');
    }

    act2Beat1_discovery() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Tori... do you remember yesterday? What we talked about?"',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp'
            },
            next: () => this.act2Beat3_buzz(),
            delay: 3000
        }, 'act2Beat1_discovery');
    }

    act2Beat3_buzz() {
        // HAPTIC: Single buzz - mystery begins
        if (this.game.triggerHaptic) {
            this.game.triggerHaptic('light', 'First buzz - mystery begins');
        }

        this.game.displayScene({
            character: 'Narration',
            dialogue: '[BUZZ]\n\n[Ronnie startles. Something vibrated in his pocket.]',
            internal: '[Visual: Ronnie\'s hand instinctively reaches for his phone.]',
            background: '../assets/hospital.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.act2Beat4_5_hijack(), // Skip ahead for demo
            delay: 2000
        }, 'act2Beat3_buzz');
    }

    act2Beat4_5_hijack() {
        this.game.displayScene({
            character: 'Tori (voice wrong)',
            dialogue: '"Tiger Tail."',
            internal: '[Ronnie freezes. Wait. What?]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp',
                highlight: 'right'
            },
            next: () => this.act2Beat6_revelation(),
            delay: 2000,
            style: 'critical'
        }, 'act2Beat4_5_hijack');
    }

    act2Beat6_revelation() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"You can\'t upload a soul. I\'m in the Tamagotchi."',
            internal: '[Visual: Silence. The weight of it hits him.]',
            background: '../assets/digitalSpace.png',
            sprites: {
                left: '../assets/full-sprite-ronnie.webp',
                right: '../assets/full-sprite-tori.webp',
                highlight: 'right'
            },
            next: () => this.act2End(),
            delay: 5000,
            style: 'critical'
        }, 'act2Beat6_revelation');
    }

    act2End() {
        this.game.displayScene({
            character: 'Ronnie (narration)',
            dialogue: '"And then... everything broke."',
            internal: '[Visual overload: alarms, static, screen fades white.]',
            background: '../assets/genericBack.png',
            next: () => this.route.act3.startAct3(),
            delay: 3000
        }, 'act2End');
    }
}
