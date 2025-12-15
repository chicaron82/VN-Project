/// 🤗 ToriGatchi - Affection Mini-Game
// Hug, Kiss, Gift, and Ignore options with streak tracking

const AFFECTION_STREAK_UNLOCK = 10;
const AFFECTION_STREAK_OUTFIT = "lovingTori";

function handleHugEntry() {
    if (!checkCooldown('hug')) {
        const sassyLines = moodSystem.dialogue.special.sassyCooldowns;
        displayMessage(sassyLines[Math.floor(Math.random() * sassyLines.length)]);
        return;
    }

    toriGatchiState.buttonMode = 'affection';
    displayMessage("Show me some love, Daddy... 💕");
    createAffectionButtons();
    setCooldown('hug');
}

function createAffectionButtons() {
    clearButtons();
    const buttonRow = $('button-row');
    if (!buttonRow) return;

    const affectionOptions = [
        { id: 'hug-action', label: '🤗 Hug', type: 'hug' },
        { id: 'kiss-action', label: '💋 Kiss', type: 'kiss' },
        { id: 'gift-action', label: '🎁 Give Gift', type: 'gift' },
        { id: 'ignore-action', label: '🚶 Ignore', type: 'ignore' }
    ];

    affectionOptions.forEach(option => {
        const btn = createButton(
            option.id,
            option.label,
            () => handleAffectionInteraction(option.type)
        );
        buttonRow.appendChild(btn);
    });

    const backBtn = createButton('back-btn', '◀ Back', () => handleInteraction('back'));
    buttonRow.appendChild(backBtn);
}

function handleAffectionInteraction(affectionType) {
    let responseMsg = "";
    const dialogueKey = getDialogueKey(toriGatchiState.mood);
    
    // Check threshold states
    const isStarving = toriGatchiState.hunger < 50;
    const isUnloved = toriGatchiState.love < 30;
    const isPerfectState = toriGatchiState.hunger >= 90 && toriGatchiState.love >= 90;

    // Block gift during Sleepy mood
    if (affectionType === 'gift' && toriGatchiState.mood === "Sleepy") {
        displayMessage("I appreciate it... but can you save this for when I'm awake? I might not even remember it. 😴");
        return; // Stay in affection menu
    }

    switch (affectionType) {
        case 'hug':
            let hugLove = 15;
            let hugHunger = 5;
            
            // Apply threshold modifiers
            if (isUnloved) {
                hugLove = Math.floor(hugLove * 0.5); // 50% reduced benefit when unloved
                responseMsg = "I appreciate it... but this doesn't fix everything. 😢 ";
            } else if (isPerfectState) {
                hugLove = Math.floor(hugLove * 1.5); // 50% bonus when perfect
                responseMsg = "Everything feels perfect right now... this hug is everything. 💕 ";
            }
            
            increaseLove(hugLove);
            decreaseHunger(hugHunger);
            toriGatchiState.affectionStreak++;
            
            const hugResponses = moodSystem.dialogue.actions.hug[dialogueKey];
            if (hugResponses && !isUnloved && !isPerfectState) {
                responseMsg = hugResponses[Math.floor(Math.random() * hugResponses.length)];
            } else if (hugResponses) {
                responseMsg += hugResponses[Math.floor(Math.random() * hugResponses.length)];
            } else if (!responseMsg) {
                responseMsg = "Aww, thanks Daddy! I needed that hug. 🤗";
            }
            break;

        case 'kiss':
            let kissLove = 20;
            let kissHunger = 3;
            
            // Apply threshold modifiers
            if (isUnloved) {
                kissLove = Math.floor(kissLove * 0.5);
                responseMsg = "...I needed that, even if I'm still hurt. 💔 ";
            } else if (isPerfectState) {
                kissLove = Math.floor(kissLove * 1.5);
                responseMsg = "Perfect moment, perfect kiss... 😘 ";
            }
            
            increaseLove(kissLove);
            decreaseHunger(kissHunger);
            toriGatchiState.affectionStreak++;
            
            const kissResponses = moodSystem.dialogue.actions.affection.kiss[dialogueKey];
            if (kissResponses && !isUnloved && !isPerfectState) {
                responseMsg = kissResponses[Math.floor(Math.random() * kissResponses.length)];
            } else if (kissResponses) {
                responseMsg += kissResponses[Math.floor(Math.random() * kissResponses.length)];
            } else if (!responseMsg) {
                responseMsg = "Mmm... perfect. 😘";
            }
            break;

        case 'gift':
            let giftLove = 25;
            
            // Apply threshold modifiers
            if (isUnloved) {
                giftLove = Math.floor(giftLove * 0.5);
                responseMsg = "Thanks... but I need more than gifts right now. 😢 ";
            } else if (isPerfectState) {
                giftLove = Math.floor(giftLove * 1.5);
                responseMsg = "You spoil me when I'm already on cloud nine! 🎁✨ ";
            }
            
            increaseLove(giftLove);
            toriGatchiState.affectionStreak++;
            
            const giftResponses = moodSystem.dialogue.actions.affection.gift[dialogueKey];
            if (giftResponses && !isUnloved && !isPerfectState) {
                responseMsg = giftResponses[Math.floor(Math.random() * giftResponses.length)];
            } else if (giftResponses) {
                responseMsg += giftResponses[Math.floor(Math.random() * giftResponses.length)];
            } else if (!responseMsg) {
                responseMsg = "You spoil me! I love it! 🎁";
            }
            break;

        case 'ignore':
            // Ignore resets streak and causes negative mood
            toriGatchiState.affectionStreak = 0;
            decreaseLove(15);
            
            const ignoreResponses = moodSystem.dialogue.actions.affection.ignore.all;
            responseMsg = ignoreResponses[Math.floor(Math.random() * ignoreResponses.length)];
            
            // Set mood to sad, grumpy, or clingy based on current love level
            if (toriGatchiState.love < 30) {
                toriGatchiState.mood = "Sad";
            } else if (toriGatchiState.love < 50) {
                toriGatchiState.mood = "Grumpy";
            } else {
                toriGatchiState.mood = "Clingy";
            }
            
            toriGatchiState.buttonMode = 'default';
            createDefaultButtons();
            displayMessage(responseMsg);
            recalculateMood();
            updateMeters();
            updateMoodDisplay();
            updateSprite();
            saveState();
            return; // Exit early for ignore
    }

    // Check streak milestones (for positive actions)
    if (toriGatchiState.affectionStreak >= 2 && toriGatchiState.affectionStreak <= 10) {
        const streakLines = moodSystem.dialogue.special.affectionStreak;
        const streakIndex = Math.min(toriGatchiState.affectionStreak - 2, streakLines.length - 1);
        responseMsg += "<br>" + streakLines[streakIndex];
    }

    // Check for outfit unlock
    if (toriGatchiState.affectionStreak >= AFFECTION_STREAK_UNLOCK &&
        !toriGatchiState.unlockedOutfits.includes(AFFECTION_STREAK_OUTFIT)) {
        toriGatchiState.unlockedOutfits.push(AFFECTION_STREAK_OUTFIT);

        // 🔥 GATEWAY HOOK
        const unlockMessage = handleUnlockWithGateway(
            AFFECTION_STREAK_OUTFIT,
            "<br><strong>💝 AFFECTION MASTER!</strong> You've unlocked Loving Tori!"
        );
        if (unlockMessage) {
            responseMsg += unlockMessage;
        }

        updateOutfitSelector();
        toriGatchiState.affectionStreak = 0; // Reset after unlock
    }

    displayMessage(responseMsg);
    toriGatchiState.buttonMode = 'default';
    createDefaultButtons();

    recalculateMood();
    updateMeters();
    updateMoodDisplay();
    updateSprite();
    saveState();
}