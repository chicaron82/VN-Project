/**
 * 👻 EchoMemorySystem (Ported from V1)
 * The "Ghost" in the shell.
 * Remembers player failures and choices across loops.
 */
export class EchoMemorySystem {
    constructor(game) {
        this.game = game;
        this.storageKey = 'tori_echo_memory';

        // Load or Initialize Memory
        this.memory = JSON.parse(localStorage.getItem(this.storageKey)) || {
            totalLoops: 0,
            tetherDeaths: 0,
            badEndings: 0,
            deathLocations: {},     // { 'scene_id': count }
            wrongChoiceRepeats: {}, // { 'choice_id': count }
            awarenessLevel: 0       // 0-4 (How much the game knows it's a game)
        };

        console.log("👻 EchoMemorySystem loaded. Loop Count:", this.memory.totalLoops);
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.memory));
    }

    incrementLoop() {
        this.memory.totalLoops++;
        this.calculateAwareness();
        this.save();
    }

    recordDeath(sceneId) {
        this.memory.tetherDeaths++;
        this.memory.deathLocations[sceneId] = (this.memory.deathLocations[sceneId] || 0) + 1;
        this.save();
    }

    recordChoice(choiceId) {
        // Track specific dangerous choices (like 'ignore_warning')
        this.memory.wrongChoiceRepeats[choiceId] = (this.memory.wrongChoiceRepeats[choiceId] || 0) + 1;
        this.save();
    }

    calculateAwareness() {
        // Awareness grows with failure
        let score = 0;
        score += this.memory.totalLoops * 0.5;
        score += this.memory.tetherDeaths * 1;
        score += this.memory.badEndings * 2;

        if (score > 5) this.memory.awarenessLevel = 1; // Vague
        if (score > 10) this.memory.awarenessLevel = 2; // Aware
        if (score > 20) this.memory.awarenessLevel = 3; // Fourth Wall
        if (score > 50) this.memory.awarenessLevel = 4; // Glitch
    }

    triggerEchoComment(type, contextId) {
        // Returns true if an echo comment should be inserted into the narrative
        // V1 logic: 20% chance if awareness > 1
        if (this.memory.awarenessLevel < 1) return false;

        return Math.random() < 0.3; // 30% chance
    }
}
