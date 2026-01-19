/**
 * ========================================
 * ECHO MEMORY SYSTEM
 * Belle's Meta-Awareness Feature
 * "The echoes remember you..."
 * ========================================
 *
 * The three echoes (Hope, Gentle, Despair) gradually become aware
 * of the player's loops and comment on repeated behaviors.
 *
 * ECHO PERSONALITIES:
 * - Echo 1 (Hope): Optimistic, triggered by persistence
 * - Echo 2 (Gentle): Soft/resigned, triggered by hesitation
 * - Echo 3 (Despair): Bitter truth-teller, triggered by failure
 *
 * AWARENESS LEVELS:
 * 0 = Dormant (first playthrough, silent)
 * 1 = Vague (2-3 loops, "feels familiar")
 * 2 = Aware (5+ loops, "you've been here before")
 * 3 = Fourth Wall (10+ loops, direct address to player)
 * 4 = Glitch (20+ loops, reality breaking)
 */

class EchoMemorySystem {
    /**
     * @param {any} game - Game engine instance
     */
    constructor(game) {
        this.game = game;

        // Memory tracking (persists across all saves globally)
        this.memory = {
            // Total loops/replays
            totalLoops: 0,
            routeCompletions: {
                ronnie: 0,
                tori: 0
            },

            // Death tracking
            deathLocations: {}, // sceneId → count
            tetherDeaths: 0,
            despairDeaths: 0,

            // Choice patterns
            choiceHistory: {}, // choiceId → [selected option indices]
            wrongChoiceRepeats: {}, // choiceId → count of same wrong choice

            // Player behavior
            saveScumCount: 0, // Quick save/load within 10 seconds
            notesViewerOpens: 0,
            longPausesAtChoices: {}, // choiceId → pause count (>10s)

            // Echo awareness levels
            echoAwareness: {
                hope: 0,     // 0-4
                gentle: 0,   // 0-4
                despair: 0   // 0-4
            },

            // Achievement tracking
            triggeredAllEchoes: false,

            // Last activity timestamps
            lastSaveTime: 0,
            lastLoadTime: 0,
            lastChoiceTime: 0
        };

        // Load persistent memory
        this.loadMemory();

        // Echo comment pools (organized by awareness level)
        this.initializeCommentPools();

        console.log('👁️ Echo Memory System initialized');
        console.log(`   Total loops: ${this.memory.totalLoops}`);
        console.log(`   Echo awareness - Hope: ${this.memory.echoAwareness.hope}, Gentle: ${this.memory.echoAwareness.gentle}, Despair: ${this.memory.echoAwareness.despair}`);
    }

    // ========================================
    // COMMENT POOLS
    // ========================================

    initializeCommentPools() {
        this.comments = {
            hope: {
                0: [], // Dormant - no comments
                1: [ // Vague awareness
                    "Something about this feels... familiar.",
                    "Have we been here before?",
                    "This moment... I almost remember it."
                ],
                2: [ // Aware
                    "You're back again. Does that mean there's still hope?",
                    "Another attempt. I admire your persistence.",
                    "Maybe this time will be different?",
                    "I believe in second chances. And third. And fourth..."
                ],
                3: [ // Fourth wall
                    "You keep trying. That's more than I did.",
                    "How many loops until you give up? Or... until you succeed?",
                    "Every replay, you get a little closer. I can feel it."
                ],
                4: [ // Glitch
                    "Y̶o̶u̶'̶v̶e̶ ̶b̶e̶e̶n̶ ̶h̶e̶r̶e̶ ̶s̶o̶ ̶m̶a̶n̶y̶ ̶t̶i̶m̶e̶s̶...",
                    "The architect didn't plan for this much hope.",
                    "Are you even real anymore? Am I?"
                ]
            },
            gentle: {
                0: [],
                1: [
                    "I've felt this moment before...",
                    "Like a memory I shouldn't have.",
                    "Why does this seem... rehearsed?"
                ],
                2: [
                    "I tried that path too. It didn't work for me either.",
                    "You hesitate at the same moments I did.",
                    "The tether breaks the same way every time, doesn't it?",
                    "I remember waiting here... just like you are now."
                ],
                3: [
                    "How many times have we said goodbye?",
                    "You're careful. Methodical. Just like I was.",
                    "Sometimes I wonder if trying again is brave... or cruel."
                ],
                4: [
                    "T̶h̶e̶ ̶l̶o̶o̶p̶ ̶i̶s̶ ̶e̶t̶e̶r̶n̶a̶l̶.",
                    "I've stopped counting. Have you?",
                    "Gentle isn't the right word anymore. Numb, maybe."
                ]
            },
            despair: {
                0: [],
                1: [
                    "Again?",
                    "I've seen this before.",
                    "You think you're the first?"
                ],
                2: [
                    "Wrong again. Will you ever learn?",
                    "She's watching you fail. Again.",
                    "The same mistakes. Every. Single. Time.",
                    "No matter what you choose here, it won't be what she meant to say.",
                    "You think THIS choice will be different?"
                ],
                3: [
                    "How many times will you make her suffer?",
                    "You know how this ends. You've seen it before.",
                    "Is this entertainment for you? Watching her break?",
                    "She's not real. You're not real. None of this matters."
                ],
                4: [
                    "S̶T̶O̶P̶ ̶T̶R̶Y̶I̶N̶G̶.",
                    "The loop is eternal. You are eternal. We are eternal.",
                    "I̶ ̶a̶m̶ ̶y̶o̶u̶.̶ ̶Y̶o̶u̶ ̶a̶r̶e̶ ̶m̶e̶.̶",
                    "Let it end. Please."
                ]
            }
        };

        // Special context-specific comments
        this.contextComments = {
            // Despair's mocking at the hijacked choice
            despairHijack: [
                "Wrong again. Will you ever learn?",
                "No matter what you choose, it won't be what she meant to say.",
                "She's watching you struggle. Just like I did.",
                "Every choice here is wrong. I learned that the hard way.",
                "You feel it too, don't you? That nothing you say will help."
            ],

            // Echo 1 when note hunting
            hopeNoteHunting: [
                "Searching for answers in the notes? I did that too.",
                "The truth is in there somewhere. Keep looking.",
                "Every note brings you closer. Don't give up."
            ],

            // Echo 2 on save scumming
            gentleSaveScum: [
                "Rewinding time... if only it were that simple.",
                "I remember trying to undo my mistakes too.",
                "The save file doesn't change what happened. Just what you remember."
            ],

            // Despair on repeated deaths
            despairRepeatedDeath: [
                "You died here before. And before that. And before that.",
                "The definition of insanity is trying the same thing expecting different results.",
                "She enjoys watching you die. Over. And over."
            ]
        };
    }

    // ========================================
    // MEMORY PERSISTENCE
    // ========================================

    loadMemory() {
        try {
            const saved = localStorage.getItem('echoMemory');
            if (saved) {
                const data = JSON.parse(saved);
                // Merge with defaults (in case new fields added)
                this.memory = { ...this.memory, ...data };
                console.log('👁️ Echo memory loaded from persistent storage');
            }
        } catch (error) {
            console.warn('Failed to load echo memory:', error);
        }
    }

    saveMemory() {
        try {
            localStorage.setItem('echoMemory', JSON.stringify(this.memory));
        } catch (error) {
            console.warn('Failed to save echo memory:', error);
        }
    }

    // ========================================
    // LOOP TRACKING
    // ========================================

    /**
     * Call this when player starts a new game or route
     */
    recordLoop(routeName) {
        this.memory.totalLoops++;

        // Update awareness based on total loops
        this.updateAwarenessLevels();

        this.saveMemory();
        console.log(`👁️ Loop recorded. Total: ${this.memory.totalLoops}`);
    }

    /**
     * Call when route is completed
     */
    recordRouteCompletion(routeName, endingType) {
        if (this.memory.routeCompletions[routeName] !== undefined) {
            this.memory.routeCompletions[routeName]++;
        }

        // Increase awareness on completion
        this.memory.echoAwareness.hope++;

        this.saveMemory();
        console.log(`👁️ Route completion: ${routeName} (${endingType})`);
    }

    updateAwarenessLevels() {
        const loops = this.memory.totalLoops;

        // Hope increases with persistence
        if (loops >= 20) this.memory.echoAwareness.hope = 4;
        else if (loops >= 10) this.memory.echoAwareness.hope = 3;
        else if (loops >= 5) this.memory.echoAwareness.hope = 2;
        else if (loops >= 2) this.memory.echoAwareness.hope = 1;

        // Gentle increases with hesitation patterns
        const hesitationCount = Object.values(this.memory.longPausesAtChoices).reduce((a, b) => a + b, 0);
        if (loops >= 20 || hesitationCount > 30) this.memory.echoAwareness.gentle = 4;
        else if (loops >= 10 || hesitationCount > 15) this.memory.echoAwareness.gentle = 3;
        else if (loops >= 5 || hesitationCount > 7) this.memory.echoAwareness.gentle = 2;
        else if (loops >= 2 || hesitationCount > 3) this.memory.echoAwareness.gentle = 1;

        // Despair increases with failures
        const totalDeaths = this.memory.tetherDeaths + this.memory.despairDeaths;
        const wrongChoices = Object.values(this.memory.wrongChoiceRepeats).reduce((a, b) => a + b, 0);
        if (totalDeaths >= 15 || wrongChoices >= 10) this.memory.echoAwareness.despair = 4;
        else if (totalDeaths >= 8 || wrongChoices >= 5) this.memory.echoAwareness.despair = 3;
        else if (totalDeaths >= 4 || wrongChoices >= 3) this.memory.echoAwareness.despair = 2;
        else if (totalDeaths >= 2 || wrongChoices >= 1) this.memory.echoAwareness.despair = 1;
    }

    // ========================================
    // BEHAVIOR TRACKING
    // ========================================

    recordDeath(sceneId, deathType) {
        // Track location
        if (!this.memory.deathLocations[sceneId]) {
            this.memory.deathLocations[sceneId] = 0;
        }
        this.memory.deathLocations[sceneId]++;

        // Track type
        if (deathType === 'tether') {
            this.memory.tetherDeaths++;
        } else if (deathType === 'despair') {
            this.memory.despairDeaths++;
        }

        this.updateAwarenessLevels();
        this.saveMemory();

        // Trigger despair comment if repeated death
        if (this.memory.deathLocations[sceneId] >= 3) {
            this.triggerEchoComment('despair', 'repeatedDeath', sceneId);
        }
    }

    recordChoice(choiceId, selectedIndex) {
        if (!this.memory.choiceHistory[choiceId]) {
            this.memory.choiceHistory[choiceId] = [];
        }
        this.memory.choiceHistory[choiceId].push(selectedIndex);

        // Track if they keep choosing the same wrong option
        const history = this.memory.choiceHistory[choiceId];
        if (history.length >= 2) {
            const lastTwo = history.slice(-2);
            if (lastTwo[0] === lastTwo[1]) {
                if (!this.memory.wrongChoiceRepeats[choiceId]) {
                    this.memory.wrongChoiceRepeats[choiceId] = 0;
                }
                this.memory.wrongChoiceRepeats[choiceId]++;
            }
        }

        this.lastChoiceTime = Date.now();
        this.saveMemory();
    }

    recordLongPause(choiceId) {
        if (!this.memory.longPausesAtChoices[choiceId]) {
            this.memory.longPausesAtChoices[choiceId] = 0;
        }
        this.memory.longPausesAtChoices[choiceId]++;

        this.updateAwarenessLevels();
        this.saveMemory();

        // Gentle might comment
        if (this.memory.longPausesAtChoices[choiceId] >= 2) {
            this.triggerEchoComment('gentle', 'longPause', choiceId);
        }
    }

    recordSave() {
        this.memory.lastSaveTime = Date.now();
        this.saveMemory();
    }

    recordLoad() {
        const now = Date.now();

        // Detect save scumming (save then load within 10 seconds)
        if (now - this.memory.lastSaveTime < 10000) {
            this.memory.saveScumCount++;

            // Gentle comments on save scumming
            if (this.memory.saveScumCount % 3 === 0) {
                this.triggerEchoComment('gentle', 'saveScum');
            }
        }

        this.memory.lastLoadTime = now;
        this.saveMemory();
    }

    recordNotesViewerOpen() {
        this.memory.notesViewerOpens++;

        // Hope comments on persistent note hunting
        if (this.memory.notesViewerOpens >= 10 && this.memory.notesViewerOpens % 5 === 0) {
            this.triggerEchoComment('hope', 'noteHunting');
        }

        this.saveMemory();
    }

    // ========================================
    // ECHO COMMENT TRIGGERING
    // ========================================

    /**
     * Trigger an echo comment to appear in status notification
     * @param {'hope'|'gentle'|'despair'} echo
     * @param {string} context - 'general'|'repeatedDeath'|'noteHunting'|'saveScum'|'despairHijack'|'longPause'
     * @param {string} [contextId] - Optional scene/choice ID for context
     */
    triggerEchoComment(echo, context = 'general', contextId = null) {
        const awareness = this.memory.echoAwareness[echo];

        // Don't trigger if dormant (awareness 0)
        if (awareness === 0) return;

        let message = '';
        let icon = '';

        // Select appropriate comment
        if (context === 'general') {
            const pool = this.comments[echo][awareness];
            message = pool[Math.floor(Math.random() * pool.length)];
        } else if (context === 'despairHijack') {
            message = this.contextComments.despairHijack[Math.floor(Math.random() * this.contextComments.despairHijack.length)];
        } else if (context === 'noteHunting') {
            message = this.contextComments.hopeNoteHunting[Math.floor(Math.random() * this.contextComments.hopeNoteHunting.length)];
        } else if (context === 'saveScum') {
            message = this.contextComments.gentleSaveScum[Math.floor(Math.random() * this.contextComments.gentleSaveScum.length)];
        } else if (context === 'repeatedDeath') {
            message = this.contextComments.despairRepeatedDeath[Math.floor(Math.random() * this.contextComments.despairRepeatedDeath.length)];
        }

        // Icon based on echo
        if (echo === 'hope') icon = '💫';
        else if (echo === 'gentle') icon = '🌙';
        else if (echo === 'despair') icon = '🖤';

        // Send to status notification system
        if (this.game.statusNotification && message) {
            this.game.statusNotification.show({
                type: 'echo',
                icon: icon,
                message: `Echo: ${message}`,
                duration: 4000,
                priority: 'high',
                pulse: true
            });

            console.log(`👁️ Echo comment (${echo}, lvl ${awareness}): ${message}`);
        }

        // Check achievement
        this.checkRememberedAchievement();
    }

    /**
     * Trigger conflicting echo sequence (multiple echoes commenting in succession)
     */
    triggerConflictingEchoes() {
        const hope = this.memory.echoAwareness.hope;
        const gentle = this.memory.echoAwareness.gentle;
        const despair = this.memory.echoAwareness.despair;

        // Only trigger if all are at least aware (level 2+)
        if (hope < 2 || gentle < 2 || despair < 2) return;

        // Sequence: Hope → Despair → Gentle
        setTimeout(() => this.triggerEchoComment('hope', 'general'), 500);
        setTimeout(() => this.triggerEchoComment('despair', 'general'), 3000);
        setTimeout(() => this.triggerEchoComment('gentle', 'general'), 6000);
    }

    // ========================================
    // ACHIEVEMENTS
    // ========================================

    checkRememberedAchievement() {
        if (this.memory.triggeredAllEchoes) return;

        const hope = this.memory.echoAwareness.hope;
        const gentle = this.memory.echoAwareness.gentle;
        const despair = this.memory.echoAwareness.despair;

        // Achievement: All three echoes reached awareness level 2+
        if (hope >= 2 && gentle >= 2 && despair >= 2) {
            this.memory.triggeredAllEchoes = true;
            this.saveMemory();

            // Unlock achievement
            if (this.game.achievementManager) {
                this.game.achievementManager.unlock('remembered');
            }

            console.log('🏆 Achievement unlocked: REMEMBERED');
        }
    }

    // ========================================
    // PUBLIC API
    // ========================================

    /**
     * Reset all memory (for testing or "true" fresh start)
     */
    resetMemory() {
        localStorage.removeItem('echoMemory');
        this.memory = {
            totalLoops: 0,
            routeCompletions: { ronnie: 0, tori: 0 },
            deathLocations: {},
            tetherDeaths: 0,
            despairDeaths: 0,
            choiceHistory: {},
            wrongChoiceRepeats: {},
            saveScumCount: 0,
            notesViewerOpens: 0,
            longPausesAtChoices: {},
            echoAwareness: { hope: 0, gentle: 0, despair: 0 },
            triggeredAllEchoes: false,
            lastSaveTime: 0,
            lastLoadTime: 0,
            lastChoiceTime: 0
        };
        console.log('👁️ Echo memory reset');
    }

    /**
     * Get current awareness levels (for debugging/dev tools)
     */
    getAwarenessLevels() {
        return {
            hope: this.memory.echoAwareness.hope,
            gentle: this.memory.echoAwareness.gentle,
            despair: this.memory.echoAwareness.despair,
            totalLoops: this.memory.totalLoops
        };
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.EchoMemorySystem = EchoMemorySystem;
}

// ES Module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EchoMemorySystem };
}
