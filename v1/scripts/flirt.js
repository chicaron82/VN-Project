/// 😉 ToriGatchi - Flirt System
// Flirt options with variable success rates and progression

const FLIRT_OPTIONS = [
    { 
        label: "Cheeky Compliment", 
        love: 10, 
        mood: 'Flirty',
        successRate: 0.9, // 90% success
        lines: [
            "Hehe... you're cute when you try 😉",
            "Did it hurt when you fell for me?",
            "You make this look too easy, Daddy 😉",
            "Who gave you permission to look that good?"
        ]
    },
    { 
        label: "Sweet/Loving Line", 
        love: 15, 
        mood: 'Adored',
        successRate: 1.0, // 100% guaranteed
        lines: [
            "Mmm, a little attention never hurt anyone...",
            "You're the reason she smiles in pixels 💖",
            "Every click feels like a hug.",
            "You're her favorite line of code 🫶"
        ]
    },
    { 
        label: "Bold/Confident Line", 
        love: 0, 
        mood: null,
        successRate: 0.5, // 50/50 risky
        risky: true, 
        lines: [
            "You're playing with fire, baby.",
            "Say it again, but slower.",
            "Your touch rewrites her code.",
            "One more flirt and she might melt…"
        ]
    },    
    { 
        label: "Teasing Quip", 
        love: 5, 
        mood: 'Happy',
        successRate: 0.75, // 75% success
        lines: [
            "Ohhh, you're not stopping, are you? 😍",
            "Oh, you think you can handle me? 😍",
            "Try harder, lover boy 😜",
            "She's only playing hard to get… maybe"
        ]
    },
    { 
        label: "Random Gamble", 
        love: 0, 
        mood: null,
        successRate: 0.3, // 30% success - high risk gamble
        isRandom: true, 
        lines: [
            "I swear... if you keep this up, I won't let you sleep tonight.",
            "What's that look in your eyes? Dangerous...",
            "You're trouble. The kind I like."
        ]
    }
];

const FLIRT_UNLOCK_THRESHOLD = 5;
const STRICT_POSITIVE_FLIRT_MOODS = ["Happy", "Adored", "Clingy", "Flirty"];
const FLIRT_SUCCESS_LOVE_BONUS = 15;
const FLIRT_FAIL_LOVE_PENALTY = -5;

const OUTFIT_UNLOCK_LEVELS = {
    'kittenTee': 5,
    'sunsetSkirt': 10,
    'couchMode': 15
};

function handleFlirtEntry() {
    if (!checkCooldown('flirt')) {
        const sassyLines = moodSystem.dialogue.special.sassyCooldowns;
        displayMessage(sassyLines[Math.floor(Math.random() * sassyLines.length)]);
        return;
    }

    toriGatchiState.buttonMode = 'flirt';
    displayMessage("Pick your line carefully... 😉");
    createFlirtButtons();
    setCooldown('flirt');
}

function createFlirtButtons() {
    clearButtons();
    const buttonRow = $('button-row');
    if (!buttonRow) return;

    FLIRT_OPTIONS.forEach((flirtOption, index) => {
        const flirtBtn = createButton(
            `flirt-btn-${index}`,
            flirtOption.label,
            () => handleFlirtInteraction(index)
        );

        flirtBtn.addEventListener('mouseover', (event) => {
            const randomLine = flirtOption.lines[Math.floor(Math.random() * flirtOption.lines.length)];
            displayHoverBubble(`"${randomLine}"`, event);
        });

        flirtBtn.addEventListener('mouseout', removeHoverBubble);

        buttonRow.appendChild(flirtBtn);
    });

    const backBtn = createButton('back-btn', '◀ Back', () => handleInteraction('back'));
    buttonRow.appendChild(backBtn);
}

function handleFlirtInteraction(flirtId) {
    // Cleanup lingering flirt preview bubble on click
    const bubble = document.querySelector('[id^="hover-bubble-"]');
    if (bubble) bubble.remove();
    
    const originalOption = FLIRT_OPTIONS[flirtId];
    let option = originalOption;
    
    // Random option logic - inherits from another random option
    if (originalOption.isRandom) {
        const nonRandomOptions = FLIRT_OPTIONS.slice(0, FLIRT_OPTIONS.length - 1);
        const inheritedIndex = Math.floor(Math.random() * nonRandomOptions.length);
        option = nonRandomOptions[inheritedIndex];
    }

    const flirtLine = option.lines[Math.floor(Math.random() * option.lines.length)];
    let responseMsg = flirtLine;

    // Modify success rate during Sleepy mood
    let effectiveSuccessRate = option.successRate;
    if (toriGatchiState.mood === "Sleepy") {
        // Sweet/Loving Line (index 1) stays at 100% success
        // All others get success rate cut to 20% of original (much riskier)
        if (flirtId !== 1 && !originalOption.isRandom) {
            effectiveSuccessRate = option.successRate * 0.2;
        }
        // Random inherits the reduced rate if it picks a non-sweet option
        if (originalOption.isRandom && flirtId !== 1) {
            effectiveSuccessRate = option.successRate * 0.2;
        }
    }

    // Determine success based on modified success rate
    const successRoll = Math.random();
    const isSuccess = successRoll < effectiveSuccessRate;

    // Check mood compatibility for risky flirts
    const currentMood = toriGatchiState.mood;
    const isPositiveMood = STRICT_POSITIVE_FLIRT_MOODS.includes(currentMood);

    if (option.risky) {
        // Risky flirts have variable outcomes
        if (isSuccess && isPositiveMood) {
            // SUCCESS: Increment level, use success or progression dialogue
            increaseLove(FLIRT_SUCCESS_LOVE_BONUS);
            toriGatchiState.flirtLevel++;
            
            const level = Math.min(toriGatchiState.flirtLevel, 5);
            const responses = moodSystem.dialogue.flirtProgression.dialogue[level] || 
                            moodSystem.dialogue.flirtProgression.success;
            responseMsg = responses[Math.floor(Math.random() * responses.length)];
        } else {
            // FAIL: Reset level, use reset dialogue
            toriGatchiState.flirtLevel = 0;
            decreaseLove(Math.abs(FLIRT_FAIL_LOVE_PENALTY));
            
            // Track flirt fail and apply escalation
            toriGatchiState.offenseHistory.flirtFail++;
            const failCount = toriGatchiState.offenseHistory.flirtFail;
            
            let escalationDialogue;
            if (failCount === 1) {
                escalationDialogue = moodSystem.dialogue.offenseEscalation.flirtFail.first;
            } else if (failCount === 2) {
                escalationDialogue = moodSystem.dialogue.offenseEscalation.flirtFail.second;
            } else {
                escalationDialogue = moodSystem.dialogue.offenseEscalation.flirtFail.third;
                decreaseLove(10); // Extra penalty on third strike
            }
            
            responseMsg = escalationDialogue[Math.floor(Math.random() * escalationDialogue.length)];
            toriGatchiState.mood = "Grumpy";
        }
    } else {
        // Normal flirt with success rate check
        if (isSuccess) {
            // Success: use mood-based dialogue
            const dialogueKey = getDialogueKey(toriGatchiState.mood);
            const flirtResponses = moodSystem.dialogue.actions.flirt[dialogueKey];
            if (flirtResponses) {
                responseMsg = flirtResponses[Math.floor(Math.random() * flirtResponses.length)];
            }
            
            increaseLove(option.love);
            if (option.mood) {
                toriGatchiState.mood = option.mood;
            }

            // Increment level, capped at 4 (requires risky flirt to hit 5)
            toriGatchiState.flirtLevel = Math.min(4, toriGatchiState.flirtLevel + 1);
        } else {
            // Failure: reset and penalize
            toriGatchiState.flirtLevel = 0;
            decreaseLove(5);
            
            // Track flirt fail and apply escalation
            toriGatchiState.offenseHistory.flirtFail++;
            const failCount = toriGatchiState.offenseHistory.flirtFail;
            
            let escalationDialogue;
            if (failCount === 1) {
                escalationDialogue = moodSystem.dialogue.offenseEscalation.flirtFail.first;
            } else if (failCount === 2) {
                escalationDialogue = moodSystem.dialogue.offenseEscalation.flirtFail.second;
            } else {
                escalationDialogue = moodSystem.dialogue.offenseEscalation.flirtFail.third;
                decreaseLove(5); // Extra penalty on third strike
            }
            
            responseMsg = escalationDialogue[Math.floor(Math.random() * escalationDialogue.length)];
            toriGatchiState.mood = "Pouty";
        }
    }
    
    // Check for Level 5 Unlock (Max Progression)
    if (toriGatchiState.flirtLevel >= 5) {
        checkFlirtLevelUnlock();
        
        let unlockedOutfitName = null;
        for (const outfit in OUTFIT_UNLOCK_LEVELS) {
            if (OUTFIT_UNLOCK_LEVELS[outfit] === 5 && 
                !toriGatchiState.unlockedOutfits.includes(outfit)) {
                unlockedOutfitName = outfit.charAt(0).toUpperCase() + outfit.slice(1);
                break;
            }
        }
        
        if (unlockedOutfitName) {
            responseMsg += `<br/><strong>🔥 PERFECT FLIRT!</strong> The teasing worked! You unlocked the ${unlockedOutfitName} outfit!`;
        } else {
            responseMsg += `<br/><strong>🔥 PERFECT FLIRT!</strong> She's yours, Daddy. What's next?`;
        }
        
        toriGatchiState.flirtLevel = 0;
        toriGatchiState.mood = "Adored";
    }
    
    displayMessage(responseMsg);
    
    toriGatchiState.buttonMode = 'default';
    createDefaultButtons();

    checkFlirtLevelUnlock();

    recalculateMood();
    updateMeters();
    updateMoodDisplay();
    updateSprite();
    saveState();
}

function checkFlirtLevelUnlock() {
    const flirtLevel = toriGatchiState.flirtLevel;
    for (const outfit in OUTFIT_UNLOCK_LEVELS) {
        const threshold = OUTFIT_UNLOCK_LEVELS[outfit];
        if (flirtLevel >= threshold && 
            !toriGatchiState.unlockedOutfits.includes(outfit)) {
            toriGatchiState.unlockedOutfits.push(outfit);
            displayMessage(`[New Outfit Unlocked!] You can now dress Tori in the ${outfit.charAt(0).toUpperCase() + outfit.slice(1)} outfit!`);
            updateOutfitSelector();
        }
    }
}