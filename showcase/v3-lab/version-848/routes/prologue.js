/**
 * 📜 Prologue Route
 * The opening sequence of Version 848.
 * Now with Sensory Feedback.
 */
export const Prologue = [
    {
        text: "The streetlights hum with a sound I can feel in my teeth.",
        speaker: "Ronnie",
        cue: "light"
    },
    {
        text: "It's 2:00 AM. The code isn't compiling.",
        speaker: "Ronnie"
    },
    {
        text: "It never compiles anymore.",
        speaker: "Ronnie",
        cue: "glitch"
    },
    {
        choice: "Check Phone",
        next: "check_phone"
    },
    // Adding the specific scenes from shared-prologue.js
    {
        text: "I wasn't looking where I was going...",
        speaker: "Tori",
        cue: "thump"
    },
    {
        text: "Oh my gosh, I'm so sorry... I wasn't paying attention!",
        speaker: "Tori"
    },
    {
        text: "...Weird. Mine has never done that before.",
        speaker: "Tori",
        cue: "codeRipple" // Use the custom cue
    },
    {
        text: "No problem. Hang on to that. It may save your life someday.",
        speaker: "Old Man",
        cue: "heavy"
    }
];
