/**
 * 🍂 Ronnie's Route (External)
 * The architect fighting to reach the ghost in the machine.
 */
export const RonnieRoute = {
    // Scene 4: Hospital Anchor
    prologueScene4: [
        {
            text: "She didn't wake up. Days passed. Then weeks. I sat by her side, waiting for a laugh, a smile, anything.",
            speaker: "Narration",
            cue: "light"
        },
        {
            text: "That stupid toy was the last thing she held. I couldn't let it go.",
            speaker: "Narration"
        },
        {
            text: "If I couldn't talk to her here... maybe I could talk to her somewhere else.",
            speaker: "Narration",
            cue: "glitch"
        }
    ],

    // Scene 5: The Build
    prologueScene5: [
        {
            text: "I poured every memory into it. Every laugh I could remember, every fight, every kiss.",
            speaker: "Narration"
        },
        {
            text: "Hey honey. Thought I'd come by and visit.",
            speaker: "Ronnie"
        },
        {
            text: "Found your Ronnie-Gatchi near my computer. Been working on something to pass the time...",
            speaker: "Ronnie"
        },
        {
            text: "BUZZ.",
            speaker: "Narration",
            cue: "heavy"
        },
        {
            text: "Huh?",
            speaker: "Ronnie",
            internal: "[ instinct check ]"
        }
    ],

    // Act 1: Discovery
    act1Scene1: [
        {
            text: "Back home. The game is ready. He launches it.",
            speaker: "Narration"
        },
        {
            text: "A sprite appears. Pixelated but alive.",
            speaker: "Narration",
            cue: "codeRipple"
        },
        {
            text: "Then... the dialogue box glitches. Text appears that he didn't write.",
            speaker: "Narration",
            cue: "glitch"
        },
        {
            text: "Baby? ...Is that you? It's me... Tori. I don't know how, but I'm here.",
            speaker: "Tori",
            cue: "thump"
        },
        {
            text: "...What the hell? This isn't coded...",
            speaker: "Ronnie"
        },
        {
            choice: "(Tender) Of course it's you.",
            next: "tender_path"
        },
        {
            choice: "(Skeptical) No... this isn't possible.",
            next: "skeptical_path"
        },
        {
            choice: "(Tease) If you're really Tori, prove it.",
            next: "tease_path"
        }
    ]
};
