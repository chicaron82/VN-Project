// ========================================
// DEV COMMENTARY DATA
// Aaron's behind-the-scenes director's cut
// Unlocked via CHICHARON secret code
// ========================================

class DevCommentary {
    constructor(game) {
        this.game = game;
        this.unlocked = localStorage.getItem('devCommentaryUnlocked') === 'true';

        // Commentary database (organized by scene/trigger)
        this.commentary = {
            // ========================================
            // PROLOGUE COMMENTARY
            // ========================================

            'prologue_street_bump': {
                title: 'The French Vanilla Detail',
                scene: 'Street Bump (Prologue)',
                content: `The French Vanilla coffee Tori picks up for Ronnie? That's how Old Ronnie knows where she'll be for the street bump. He's lived this loop hundreds of times. He knows her routine. That small detail is actually critical to the bootstrap paradox working.`
            },

            // ========================================
            // ROUTE SELECTION COMMENTARY
            // ========================================

            'route_selection_dual': {
                title: 'Why Two Routes?',
                scene: 'Route Selection',
                content: `Originally this was just Ronnie's story. But during that Applebee's dinner with Tori, we realized it would be way more interesting as dual perspectives. Ronnie's route became the traditional VN experience - external POV, trying to save her. Tori's route was me taking the gloves off - internal horror, tether mechanics, echo voices, all the weird experimental shit. Somehow it all fit together.`
            },

            'route_selection_philosophy': {
                title: 'Route Design Philosophy',
                scene: 'Route Selection',
                content: `Ronnie's route was intentionally traditional style VN - choices, dialogue, external perspective. Tori's route was essentially my 'gloves off' moment - let's come up with crazy shit and see if we can make it fit narratively. Tether decay, echo voices, memory fragments, the whole works. Both routes tell the same story but feel completely different to play.`
            },

            // ========================================
            // TORI ROUTE COMMENTARY
            // ========================================

            'tori_tether_intro': {
                title: 'The Tether System Origin',
                scene: 'Tori Route - First Hold On Button',
                content: `This idea came about super early. It was the reason I made it into a dual perspective game. Just sitting in Applebee's riffing ideas with Tori and the what-if was "what if we had a player be more active in the story, needing them to press a button to stabilize her. The lower it is, the more glitches occur."`
            },

            'tori_echoes_first_appearance': {
                title: 'The Despair Height "Bug"',
                scene: 'Tori Route - Echo Trio Introduction',
                content: `Despair being taller than the other echoes was actually a "bug" - Tori rendered the sprite at the wrong resolution. But I turned it into a narrative choice. Despair is dominant in Act 1, so it made sense for her sprite to be taller. As the story progresses, the other sprites "grow," eventually balancing things out.`
            },

            'tori_echo_merge': {
                title: 'Becoming Whole',
                scene: 'Tori Route - Echo Integration',
                content: `The echo merge sequence came when I wanted to show how they become whole. They're all Tori. The fragments, the voices, the perspectives - they're not separate entities. Tori is now one.`
            },

            'tori_save_blocked': {
                title: 'Despair\'s Cage',
                scene: 'Tori Route Act 1 - Blocked Save',
                content: `Despair didn't originally block saves in Act 1. As I was getting reviews from other AIs about the game, they would mistakenly tell me it was a genius move. However, when I confirmed later that saves were allowed, I made it so they wouldn't be. It still fit the narrative - Despair trapping you in Act 1.`
            },

            // ========================================
            // ENDING COMMENTARY
            // ========================================

            'bad_ending_retry': {
                title: 'The Bootstrap Paradox',
                scene: 'Bad Ending - Retry Prompt',
                content: `I was at work when the retry mechanic clicked for me. What if retries weren't just "try again" - what if they were CANON? Every failed attempt is a real timeline. Ronnie gets older with each failure until he becomes the Old Man from the prologue. He goes back to give his younger self the Tamagotchi, creating the loop. Didn't even know this concept had a name (bootstrap paradox) until later.`
            },

            // ========================================
            // MAIN MENU COMMENTARY
            // ========================================

            'main_menu_carousel': {
                title: 'The Price Is Right Carousel',
                scene: 'Main Menu',
                content: `The carousel momentum came from a conversation with Zee. I told her I wanted it to feel like spinning the big wheel on The Price Is Right - you know, where you can flick it hard and watch it zoom then crawl to a stop. Or give it a light flick for precision. She actually built custom physics for that. For a menu.`
            },

            'main_menu_mobile': {
                title: 'Tinder Swipe Energy',
                scene: 'Main Menu (Mobile)',
                content: `For mobile portrait I wanted the cards to swipe like Tinder or Bumble. That satisfying feeling of flicking a card away and watching the next one appear. Zee confirmed it was possible and we just ran with it. Now the whole mobile experience feels native instead of like a cramped-down desktop site.`
            },

            'main_menu_loop': {
                title: 'Menu as Narrative Mirror',
                scene: 'Main Menu Design',
                content: `The menu style upgrade from grid to looping carousel - I wanted it to mirror the story. Like in the bad ending where the end loops back to the beginning. Ronnie failed. He goes back to give his younger self a chance to try again. The menu loops infinitely, just like the timelines.`
            },

            // ========================================
            // FEATURE COMMENTARY
            // ========================================

            'backlog_time_machine': {
                title: 'Backlog as Time Machine',
                scene: 'First Backlog Open',
                content: `Turning the backlog into a time machine was my tweak when I asked what else from standard VNs could we incorporate. Instead of just reading dialogue history, I made it so you could "jump back" to any point. Time travel mechanics built into the UI itself.`
            }
        };
    }

    // Check if commentary is unlocked
    isUnlocked() {
        return this.unlocked;
    }

    // Get commentary for specific scene
    getCommentary(sceneId) {
        if (!this.isUnlocked()) return null;
        return this.commentary[sceneId] || null;
    }

    // Get all commentary (for viewer/gallery)
    getAllCommentary() {
        if (!this.isUnlocked()) return [];
        return Object.entries(this.commentary).map(([id, data]) => ({
            id,
            ...data
        }));
    }

    // Show commentary overlay
    showCommentary(sceneId) {
        const data = this.getCommentary(sceneId);
        if (!data) return;

        this.game.showCommentaryOverlay(data.title, data.content, data.scene);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DevCommentary;
}
