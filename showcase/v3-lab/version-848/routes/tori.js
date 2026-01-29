/**
 * 🌸 Tori's Route (Internal)
 * The ghost haunting the machine, fighting the static.
 */
export const ToriRoute = {
    // Act 1: Awakening
    act1Scene1: [
        {
            text: "It's cold. Dark. I can't feel my hands.",
            speaker: "Tori",
            cue: "heavy"
        },
        {
            text: "Wait... I see a light. A screen?",
            speaker: "Tori"
        },
        {
            text: "It looks like... our apartment. But wrong. Pixelated.",
            speaker: "Tori",
            cue: "glitch"
        },
        {
            text: "Ronnie? Ronnie, are you there?",
            speaker: "Tori"
        }
    ],

    // Act 2: The Tether
    act2Scene1: [
        {
            text: "I can feel the battery draining. It feels like... thirst.",
            speaker: "Tori",
            cue: "thump"
        },
        {
            text: "Honey? Can you hear me? I need you to plug me in.",
            speaker: "Tori"
        }
    ],

    // Act 3: The Choice
    act3Scene1: [
        {
            text: "The static is getting louder. I can't stay focused.",
            speaker: "Tori",
            cue: "glitch"
        },
        {
            text: "Ronnie... I think I'm fading.",
            speaker: "Tori",
            cue: "heavy"
        },
        {
            choice: "HOLD ON",
            next: "hold_on"
        },
        {
            choice: "LET GO",
            next: "let_go"
        }
    ]
};
