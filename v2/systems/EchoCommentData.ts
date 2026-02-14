/**
 * Echo Comment Data
 * Belle's carefully crafted dialogue pools for the Echo Memory system.
 *
 * Pure data — no logic, no side effects.
 * Separated so dialogue can be reviewed/edited without touching behavioral code.
 *
 * "The echoes remember you..." 🖤
 *
 * 848 is sacred. 💚🔥💀
 */

import type { EchoType, EchoComments, ContextComments, EchoMemory } from './EchoMemoryTypes';

// ========================================
// ECHO ICONS - Belle's visual signatures 🖤
// ========================================

export const ECHO_ICONS: Record<EchoType, string> = {
    hope: '💫',
    gentle: '🌙',
    despair: '🖤'
};

// ========================================
// DEFAULT MEMORY STATE
// ========================================

/**
 * Get default memory state
 * DiZee: Clean slate for new players
 */
export function getDefaultMemory(): EchoMemory {
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
 * Main comment pools by awareness level
 *
 * Level 0: Dormant - no comments (first playthrough)
 * Level 1: Vague - déjà vu hints
 * Level 2: Aware - direct acknowledgment
 * Level 3: Fourth Wall - breaks the fourth wall
 * Level 4: Glitch - reality breaking, zalgo text
 */
export function initializeCommentPools(): EchoComments {
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
 * Context-specific comment pools
 * Zee Polish: Situational comments feel more intentional
 */
export function initializeContextComments(): ContextComments {
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
