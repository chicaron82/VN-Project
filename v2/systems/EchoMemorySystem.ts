// ========================================
// ECHO MEMORY SYSTEM
// Belle's Meta-Awareness Feature
// "The echoes remember you..."
// V2 Port: Faithful transcription from V1
// ========================================
//
// The three echoes (Hope, Gentle, Despair) gradually become aware
// of the player's loops and comment on repeated behaviors.
//
// ECHO PERSONALITIES:
// - Echo 1 (Hope): Optimistic 💫 - triggered by persistence
// - Echo 2 (Gentle): Soft/resigned 🌙 - triggered by hesitation
// - Echo 3 (Despair): Bitter truth-teller 🖤 - triggered by failure
//
// AWARENESS LEVELS:
// 0 = Dormant (first playthrough, silent)
// 1 = Vague (2-3 loops, "feels familiar")
// 2 = Aware (5+ loops, "you've been here before")
// 3 = Fourth Wall (10+ loops, direct address to player)
// 4 = Glitch (20+ loops, reality breaking)
//
// Belle built this to make the echoes feel alive.
// They remember. They always remember.
//
// 848 is sacred. 💚🔥💀
//
// - Belle (the architect)
//   Built with the UV7 crew
// ========================================

import type { EventBus } from '../core/EventBus';
import type { StateManager } from '../core/StateManager';
import { Logger } from '@utils/Logger';

// ========================================
// TYPES
// ========================================

/**
 * The three echo identities
 * DiZee: Each has distinct personality and trigger conditions
 */
export type EchoType = 'hope' | 'gentle' | 'despair';

/**
 * Awareness levels 0-4
 * Belle's progression system for meta-awareness
 */
export type AwarenessLevel = 0 | 1 | 2 | 3 | 4;

/**
 * Context types for echo comments
 * Zee Polish: Context-specific responses feel more intentional
 */
export type EchoContext =
    | 'general'
    | 'despairHijack'
    | 'noteHunting'
    | 'saveScum'
    | 'repeatedDeath'
    | 'longPause';

/**
 * Echo awareness state per echo
 */
export interface EchoAwareness {
    hope: AwarenessLevel;
    gentle: AwarenessLevel;
    despair: AwarenessLevel;
}

/**
 * Route completion tracking
 */
export interface RouteCompletions {
    ronnie: number;
    tori: number;
}

/**
 * Full persistent memory structure
 * Belle: This persists across ALL saves globally
 */
export interface EchoMemory {
    // Total loops/replays
    totalLoops: number;
    routeCompletions: RouteCompletions;

    // Death tracking
    deathLocations: Record<string, number>;  // sceneId → count
    tetherDeaths: number;
    despairDeaths: number;

    // Choice patterns
    choiceHistory: Record<string, number[]>;  // choiceId → [selected option indices]
    wrongChoiceRepeats: Record<string, number>;  // choiceId → count of same wrong choice

    // Player behavior
    saveScumCount: number;  // Quick save/load within 10 seconds
    notesViewerOpens: number;
    longPausesAtChoices: Record<string, number>;  // choiceId → pause count (>10s)

    // Echo awareness levels
    echoAwareness: EchoAwareness;

    // Achievement tracking
    triggeredAllEchoes: boolean;

    // Last activity timestamps
    lastSaveTime: number;
    lastLoadTime: number;
    lastChoiceTime: number;
}

/**
 * Comment pools organized by awareness level
 */
export type CommentPool = Record<AwarenessLevel, string[]>;

/**
 * All echo comment pools
 */
export interface EchoComments {
    hope: CommentPool;
    gentle: CommentPool;
    despair: CommentPool;
}

/**
 * Context-specific comment pools
 */
export interface ContextComments {
    despairHijack: string[];
    hopeNoteHunting: string[];
    gentleSaveScum: string[];
    despairRepeatedDeath: string[];
}

/**
 * Echo comment event payload
 */
export interface EchoCommentPayload {
    echo: EchoType;
    message: string;
    icon: string;
    awareness: AwarenessLevel;
    context: EchoContext;
}

// ========================================
// ECHO MEMORY SYSTEM
// ========================================

/**
 * EchoMemorySystem
 *
 * Belle's Meta-Awareness Feature - The echoes remember you.
 *
 * The three echoes gradually become aware of the player's loops
 * and comment on repeated behaviors. Each has a distinct personality:
 *
 * 💫 HOPE (Echo 1): Optimistic, triggered by persistence
 *    "Maybe this time will be different?"
 *
 * 🌙 GENTLE (Echo 2): Soft/resigned, triggered by hesitation
 *    "I tried that path too. It didn't work for me either."
 *
 * 🖤 DESPAIR (Echo 3): Bitter truth-teller, triggered by failure
 *    "Wrong again. Will you ever learn?"
 *
 * @class EchoMemorySystem
 */
export class EchoMemorySystem {
    private eventBus: EventBus;
    private stateManager: StateManager;

    // Memory tracking (persists across all saves globally)
    private memory: EchoMemory;

    // Comment pools
    private comments: EchoComments;
    private contextComments: ContextComments;

    // ========================================
    // STORAGE KEYS
    // ========================================
    private static readonly STORAGE_KEY = 'echoMemory';

    // ========================================
    // ECHO ICONS - Belle's visual signatures 🖤
    // ========================================
    private static readonly ECHO_ICONS: Record<EchoType, string> = {
        hope: '💫',
        gentle: '🌙',
        despair: '🖤'
    };

    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;

        // Initialize default memory state
        this.memory = this.getDefaultMemory();

        // Initialize comment pools
        this.comments = this.initializeCommentPools();
        this.contextComments = this.initializeContextComments();

        // Load persistent memory
        this.loadMemory();

        // Set up event listeners
        this.setupEventListeners();

        Logger.state('👁️ Echo Memory System initialized');
        Logger.state(`   Total loops: ${this.memory.totalLoops}`);
        Logger.state(`   Echo awareness - Hope: ${this.memory.echoAwareness.hope}, Gentle: ${this.memory.echoAwareness.gentle}, Despair: ${this.memory.echoAwareness.despair}`);
    }

    // ========================================
    // DEFAULT MEMORY STATE
    // ========================================

    /**
     * Get default memory state
     * DiZee: Clean slate for new players
     */
    private getDefaultMemory(): EchoMemory {
        return {
            totalLoops: 0,
            routeCompletions: {
                ronnie: 0,
                tori: 0
            },
            deathLocations: {},
            tetherDeaths: 0,
            despairDeaths: 0,
            choiceHistory: {},
            wrongChoiceRepeats: {},
            saveScumCount: 0,
            notesViewerOpens: 0,
            longPausesAtChoices: {},
            echoAwareness: {
                hope: 0,
                gentle: 0,
                despair: 0
            },
            triggeredAllEchoes: false,
            lastSaveTime: 0,
            lastLoadTime: 0,
            lastChoiceTime: 0
        };
    }

    // ========================================
    // COMMENT POOLS
    // Belle's carefully crafted dialogue 🖤
    // ========================================

    /**
     * Initialize main comment pools by awareness level
     *
     * Level 0: Dormant - no comments (first playthrough)
     * Level 1: Vague - déjà vu hints
     * Level 2: Aware - direct acknowledgment
     * Level 3: Fourth Wall - breaks the fourth wall
     * Level 4: Glitch - reality breaking, zalgo text
     */
    private initializeCommentPools(): EchoComments {
        return {
            // ========================================
            // 💫 HOPE - The optimist
            // Triggered by persistence, returns, trying again
            // ========================================
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

            // ========================================
            // 🌙 GENTLE - The resigned
            // Triggered by hesitation, long pauses, save-scumming
            // ========================================
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

            // ========================================
            // 🖤 DESPAIR - The bitter truth-teller
            // Triggered by failures, deaths, wrong choices
            // ========================================
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
    }

    /**
     * Initialize context-specific comment pools
     * Zee Polish: Situational comments feel more intentional
     */
    private initializeContextComments(): ContextComments {
        return {
            // ========================================
            // Despair's mocking at the hijacked choice
            // ========================================
            despairHijack: [
                "Wrong again. Will you ever learn?",
                "No matter what you choose, it won't be what she meant to say.",
                "She's watching you struggle. Just like I did.",
                "Every choice here is wrong. I learned that the hard way.",
                "You feel it too, don't you? That nothing you say will help."
            ],

            // ========================================
            // Hope when note hunting - encouragement
            // ========================================
            hopeNoteHunting: [
                "Searching for answers in the notes? I did that too.",
                "The truth is in there somewhere. Keep looking.",
                "Every note brings you closer. Don't give up."
            ],

            // ========================================
            // Gentle on save scumming - understanding
            // ========================================
            gentleSaveScum: [
                "Rewinding time... if only it were that simple.",
                "I remember trying to undo my mistakes too.",
                "The save file doesn't change what happened. Just what you remember."
            ],

            // ========================================
            // Despair on repeated deaths - cruel
            // ========================================
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

    /**
     * Load memory from localStorage
     * DiZee: Persistent across browser sessions
     */
    private loadMemory(): void {
        try {
            const saved = localStorage.getItem(EchoMemorySystem.STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved) as Partial<EchoMemory>;
                // Merge with defaults (in case new fields added)
                this.memory = { ...this.memory, ...data };
                Logger.state('👁️ Echo memory loaded from persistent storage');
            }
        } catch (error) {
            Logger.warn('⚠️ Failed to load echo memory:', error);
        }
    }

    /**
     * Save memory to localStorage
     */
    private saveMemory(): void {
        try {
            localStorage.setItem(EchoMemorySystem.STORAGE_KEY, JSON.stringify(this.memory));
        } catch (error) {
            Logger.warn('⚠️ Failed to save echo memory:', error);
        }
    }

    /**
     * Sync to StateManager for reactive UI
     */
    private syncToStateManager(): void {
        this.stateManager.set('echo.awareness.hope', this.memory.echoAwareness.hope);
        this.stateManager.set('echo.awareness.gentle', this.memory.echoAwareness.gentle);
        this.stateManager.set('echo.awareness.despair', this.memory.echoAwareness.despair);
        this.stateManager.set('echo.totalLoops', this.memory.totalLoops);
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    /**
     * Set up listeners for game events that affect echo memory
     */
    private setupEventListeners(): void {
        // Save/Load events for save scum detection
        this.eventBus.on('save:complete', () => this.recordSave());
        this.eventBus.on('load:complete', () => this.recordLoad());

        // Notes viewer for note hunting detection
        this.eventBus.on('ui:notes:open', () => this.recordNotesViewerOpen());

        // Death events
        this.eventBus.on('tether:death', () => this.recordDeath('tether_death', 'tether'));
        this.eventBus.on('ending:bad', () => this.recordDeath('bad_ending', 'despair'));

        // Loop events - sync with LoopController
        this.eventBus.on('loop:retry', () => this.recordLoop('retry'));

        // Choice tracking
        this.eventBus.on('choice:selected', (data) => {
            // Extract choice info from event
            this.recordChoice(data.choiceId, 0); // Index from choice system
        });
    }

    // ========================================
    // LOOP TRACKING
    // ========================================

    /**
     * Record when player starts a new game or route
     * @param _routeName - Optional route name (reserved for future use)
     */
    public recordLoop(_routeName?: string): void {
        this.memory.totalLoops++;

        // Update awareness based on total loops
        this.updateAwarenessLevels();

        this.saveMemory();
        this.syncToStateManager();

        // Emit event for other systems
        this.eventBus.emit('echo:loop_recorded', {
            totalLoops: this.memory.totalLoops,
            awareness: { ...this.memory.echoAwareness }
        });

        Logger.state(`👁️ Loop recorded. Total: ${this.memory.totalLoops}`);
    }

    /**
     * Record route completion
     * @param routeName - 'ronnie' or 'tori'
     * @param endingType - Type of ending achieved
     */
    public recordRouteCompletion(routeName: 'ronnie' | 'tori', endingType: string): void {
        this.memory.routeCompletions[routeName]++;

        // Increase hope awareness on completion (persistence!)
        if (this.memory.echoAwareness.hope < 4) {
            this.memory.echoAwareness.hope = Math.min(4, this.memory.echoAwareness.hope + 1) as AwarenessLevel;
        }

        this.saveMemory();
        this.syncToStateManager();

        Logger.state(`👁️ Route completion: ${routeName} (${endingType})`);
    }

    /**
     * Update awareness levels based on player behavior
     * Belle's progression formula 🖤
     */
    private updateAwarenessLevels(): void {
        const loops = this.memory.totalLoops;

        // ========================================
        // HOPE - Increases with persistence
        // ========================================
        if (loops >= 20) this.memory.echoAwareness.hope = 4;
        else if (loops >= 10) this.memory.echoAwareness.hope = 3;
        else if (loops >= 5) this.memory.echoAwareness.hope = 2;
        else if (loops >= 2) this.memory.echoAwareness.hope = 1;

        // ========================================
        // GENTLE - Increases with hesitation patterns
        // ========================================
        const hesitationCount = Object.values(this.memory.longPausesAtChoices)
            .reduce((a, b) => a + b, 0);

        if (loops >= 20 || hesitationCount > 30) this.memory.echoAwareness.gentle = 4;
        else if (loops >= 10 || hesitationCount > 15) this.memory.echoAwareness.gentle = 3;
        else if (loops >= 5 || hesitationCount > 7) this.memory.echoAwareness.gentle = 2;
        else if (loops >= 2 || hesitationCount > 3) this.memory.echoAwareness.gentle = 1;

        // ========================================
        // DESPAIR - Increases with failures
        // ========================================
        const totalDeaths = this.memory.tetherDeaths + this.memory.despairDeaths;
        const wrongChoices = Object.values(this.memory.wrongChoiceRepeats)
            .reduce((a, b) => a + b, 0);

        if (totalDeaths >= 15 || wrongChoices >= 10) this.memory.echoAwareness.despair = 4;
        else if (totalDeaths >= 8 || wrongChoices >= 5) this.memory.echoAwareness.despair = 3;
        else if (totalDeaths >= 4 || wrongChoices >= 3) this.memory.echoAwareness.despair = 2;
        else if (totalDeaths >= 2 || wrongChoices >= 1) this.memory.echoAwareness.despair = 1;
    }

    // ========================================
    // BEHAVIOR TRACKING
    // ========================================

    /**
     * Record a death event
     * @param sceneId - Scene where death occurred
     * @param deathType - 'tether' or 'despair'
     */
    public recordDeath(sceneId: string, deathType: 'tether' | 'despair'): void {
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
        this.syncToStateManager();

        // Trigger despair comment if repeated death at same location
        if (this.memory.deathLocations[sceneId] >= 3) {
            this.triggerEchoComment('despair', 'repeatedDeath', sceneId);
        }

        Logger.state(`👁️ Death recorded at ${sceneId} (${deathType}). Total: tether=${this.memory.tetherDeaths}, despair=${this.memory.despairDeaths}`);
    }

    /**
     * Record a choice selection
     * @param choiceId - Unique choice identifier
     * @param selectedIndex - Index of selected option
     */
    public recordChoice(choiceId: string, selectedIndex: number): void {
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

        this.memory.lastChoiceTime = Date.now();
        this.saveMemory();
    }

    /**
     * Record a long pause at a choice (>10s hesitation)
     * @param choiceId - Choice where player hesitated
     */
    public recordLongPause(choiceId: string): void {
        if (!this.memory.longPausesAtChoices[choiceId]) {
            this.memory.longPausesAtChoices[choiceId] = 0;
        }
        this.memory.longPausesAtChoices[choiceId]++;

        this.updateAwarenessLevels();
        this.saveMemory();
        this.syncToStateManager();

        // Gentle might comment on hesitation
        if (this.memory.longPausesAtChoices[choiceId] >= 2) {
            this.triggerEchoComment('gentle', 'longPause', choiceId);
        }

        Logger.state(`👁️ Long pause recorded at ${choiceId}`);
    }

    /**
     * Record save action (for save scum detection)
     */
    public recordSave(): void {
        this.memory.lastSaveTime = Date.now();
        this.saveMemory();
    }

    /**
     * Record load action (for save scum detection)
     */
    public recordLoad(): void {
        const now = Date.now();

        // Detect save scumming (save then load within 10 seconds)
        if (now - this.memory.lastSaveTime < 10000) {
            this.memory.saveScumCount++;

            // Gentle comments on save scumming every 3rd time
            if (this.memory.saveScumCount % 3 === 0) {
                this.triggerEchoComment('gentle', 'saveScum');
            }

            Logger.state(`👁️ Save scum detected. Count: ${this.memory.saveScumCount}`);
        }

        this.memory.lastLoadTime = now;
        this.saveMemory();
    }

    /**
     * Record notes viewer open (for note hunting detection)
     */
    public recordNotesViewerOpen(): void {
        this.memory.notesViewerOpens++;

        // Hope comments on persistent note hunting
        if (this.memory.notesViewerOpens >= 10 && this.memory.notesViewerOpens % 5 === 0) {
            this.triggerEchoComment('hope', 'noteHunting');
        }

        this.saveMemory();
    }

    // ========================================
    // ECHO COMMENT TRIGGERING
    // The heart of Belle's system 🖤
    // ========================================

    /**
     * Trigger an echo comment
     *
     * @param echo - Which echo speaks ('hope' | 'gentle' | 'despair')
     * @param context - Context for comment selection
     * @param contextId - Optional scene/choice ID for logging
     */
    public triggerEchoComment(
        echo: EchoType,
        context: EchoContext = 'general',
        _contextId?: string  // Reserved for logging/debugging
    ): void {
        const awareness = this.memory.echoAwareness[echo];

        // Don't trigger if dormant (awareness 0)
        if (awareness === 0) return;

        let message = '';

        // Helper to safely pick random element from pool
        const pickRandom = (pool: string[]): string => {
            if (pool.length === 0) return '';
            const index = Math.floor(Math.random() * pool.length);
            return pool[index] ?? '';
        };

        // Select appropriate comment based on context
        if (context === 'general') {
            const pool = this.comments[echo][awareness];
            message = pickRandom(pool);
        } else if (context === 'despairHijack') {
            message = pickRandom(this.contextComments.despairHijack);
        } else if (context === 'noteHunting') {
            message = pickRandom(this.contextComments.hopeNoteHunting);
        } else if (context === 'saveScum') {
            message = pickRandom(this.contextComments.gentleSaveScum);
        } else if (context === 'repeatedDeath') {
            message = pickRandom(this.contextComments.despairRepeatedDeath);
        } else if (context === 'longPause') {
            // Use general gentle comments for long pause
            const pool = this.comments.gentle[awareness];
            message = pickRandom(pool);
        }

        if (!message) return;

        const icon = EchoMemorySystem.ECHO_ICONS[echo];

        // Emit event for notification system
        const payload: EchoCommentPayload = {
            echo,
            message,
            icon,
            awareness,
            context
        };

        this.eventBus.emit('echo:comment', payload);

        Logger.state(`👁️ Echo comment (${echo}, lvl ${awareness}): ${message}`);

        // Check achievement
        this.checkRememberedAchievement();
    }

    /**
     * Trigger conflicting echo sequence
     * All three echoes comment in succession - maximum meta-awareness
     *
     * Belle: "When all three speak at once, the player KNOWS something is wrong"
     */
    public triggerConflictingEchoes(): void {
        const hope = this.memory.echoAwareness.hope;
        const gentle = this.memory.echoAwareness.gentle;
        const despair = this.memory.echoAwareness.despair;

        // Only trigger if all are at least aware (level 2+)
        if (hope < 2 || gentle < 2 || despair < 2) return;

        // Sequence: Hope → Despair → Gentle
        // DiZee: Staggered timing for dramatic effect
        setTimeout(() => this.triggerEchoComment('hope', 'general'), 500);
        setTimeout(() => this.triggerEchoComment('despair', 'general'), 3000);
        setTimeout(() => this.triggerEchoComment('gentle', 'general'), 6000);

        Logger.state('👁️ Conflicting echoes triggered');
    }

    // ========================================
    // ACHIEVEMENTS
    // ========================================

    /**
     * Check if "Remembered" achievement should unlock
     * Unlocks when all three echoes reach awareness level 2+
     */
    private checkRememberedAchievement(): void {
        if (this.memory.triggeredAllEchoes) return;

        const hope = this.memory.echoAwareness.hope;
        const gentle = this.memory.echoAwareness.gentle;
        const despair = this.memory.echoAwareness.despair;

        // Achievement: All three echoes reached awareness level 2+
        if (hope >= 2 && gentle >= 2 && despair >= 2) {
            this.memory.triggeredAllEchoes = true;
            this.saveMemory();

            // Unlock achievement via event
            this.eventBus.emit('achievement:unlock', { id: 'remembered' });

            Logger.achievement('🏆 Achievement unlocked: REMEMBERED');
        }
    }

    // ========================================
    // PUBLIC GETTERS
    // ========================================

    /**
     * Get current awareness levels
     */
    public getAwarenessLevels(): EchoAwareness & { totalLoops: number } {
        return {
            hope: this.memory.echoAwareness.hope,
            gentle: this.memory.echoAwareness.gentle,
            despair: this.memory.echoAwareness.despair,
            totalLoops: this.memory.totalLoops
        };
    }

    /**
     * Get full memory state (for debugging/dev tools)
     */
    public getMemory(): Readonly<EchoMemory> {
        return { ...this.memory };
    }

    /**
     * Check if specific echo is awake (awareness > 0)
     */
    public isEchoAwake(echo: EchoType): boolean {
        return this.memory.echoAwareness[echo] > 0;
    }

    /**
     * Check if all echoes are awake
     */
    public areAllEchoesAwake(): boolean {
        return (
            this.memory.echoAwareness.hope > 0 &&
            this.memory.echoAwareness.gentle > 0 &&
            this.memory.echoAwareness.despair > 0
        );
    }

    /**
     * Get death count at specific location
     */
    public getDeathsAtLocation(sceneId: string): number {
        return this.memory.deathLocations[sceneId] || 0;
    }

    /**
     * Get total death count
     */
    public getTotalDeaths(): number {
        return this.memory.tetherDeaths + this.memory.despairDeaths;
    }

    // ========================================
    // DEV / DEBUG TOOLS
    // ========================================

    /**
     * Reset all echo memory (for testing/dev commands)
     * WARNING: This resets the player's echo progression!
     */
    public resetMemory(): void {
        localStorage.removeItem(EchoMemorySystem.STORAGE_KEY);
        this.memory = this.getDefaultMemory();
        this.syncToStateManager();

        this.eventBus.emit('echo:reset', {});

        Logger.state('👁️ Echo memory reset');
    }

    /**
     * Force set awareness level (for dev commands)
     * @param echo - Echo to modify
     * @param level - New awareness level (0-4)
     */
    public setAwareness(echo: EchoType, level: AwarenessLevel): void {
        this.memory.echoAwareness[echo] = level;
        this.saveMemory();
        this.syncToStateManager();

        Logger.state(`🔧 ${echo} awareness set to ${level}`);
    }

    /**
     * Force set total loops (for dev commands)
     * @param loops - New loop count
     */
    public setLoops(loops: number): void {
        this.memory.totalLoops = Math.max(0, loops);
        this.updateAwarenessLevels();
        this.saveMemory();
        this.syncToStateManager();

        Logger.state(`🔧 Total loops set to ${this.memory.totalLoops}`);
    }
}
