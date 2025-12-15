/// 🍴 ToriGatchi - Feed System
// Food options, preferences, and streak tracking

// Time-based food categories
const BREAKFAST_FOODS = [
    { 
        label: "Bacon & Eggs 🍳", 
        hunger: 25, 
        love: 8, 
        disliked: false,
        heavy: false,
        timeOptimal: 'morning',
        line: "Perfect breakfast! Just what I needed 💕" 
    },
    { 
        label: "Pancakes 🥞", 
        hunger: 20, 
        love: 10, 
        disliked: false,
        heavy: false,
        timeOptimal: 'morning',
        line: "Mmm! Fluffy and sweet, just like our mornings together 😊" 
    },
    { 
        label: "Tocilog 🍚", 
        hunger: 30, 
        love: 12, 
        disliked: false,
        heavy: false,
        timeOptimal: 'morning',
        line: "Ah! Filipino breakfast hits different. You know me so well 🥰" 
    },
    { 
        label: "Torilog 💖", 
        hunger: 20, 
        love: 15, 
        disliked: false,
        heavy: false,
        timeOptimal: 'morning',
        isEasterEgg: true,
        line: "Wait... you named a dish after ME?! That's the sweetest thing ever! 😭💕" 
    }
];

const ANYTIME_FOODS = [
    { 
        label: "Mango Float 🍰", 
        hunger: 10, 
        love: 10, 
        disliked: false,
        heavy: false,
        timeOptimal: 'anytime',
        line: "Oooh sweet! You know the way to my heart 😍" 
    },
    { 
        label: "Halo-halo 🍧", 
        hunger: 15, 
        love: 12, 
        disliked: false,
        heavy: false,
        timeOptimal: 'anytime',
        line: "Refreshing! Just like a hot summer date with you ☀️" 
    },
    { 
        label: "Milk Tea 🧋", 
        hunger: 5, 
        love: 5, 
        disliked: false,
        heavy: false,
        timeOptimal: 'anytime',
        line: "Bubble tea with my babe? Yes please 😘" 
    }
];

const DINNER_FOODS = [
    { 
        label: "Lumpia 🥟", 
        hunger: 25, 
        love: 8, 
        disliked: false,
        heavy: true,
        timeOptimal: 'evening',
        line: "Mmm… crispy and perfect, just like you made it 💕" 
    },
    { 
        label: "Adobo 🍲", 
        hunger: 35, 
        love: 10, 
        disliked: false,
        heavy: true,
        timeOptimal: 'evening',
        line: "Classic comfort food. Perfect for dinner 🖤" 
    }
];

const DISLIKED_FOODS = [
    {
        label: "Durian 🤢",
        hunger: 0,
        love: -10,
        disliked: true,
        heavy: false,
        timeOptimal: 'never',
        line: "BAKA! You know I don't like this! 😤"
    },
    {
        label: "Bitter Melon 🥒",
        hunger: 0,
        love: -10,
        disliked: true,
        heavy: false,
        timeOptimal: 'never',
        line: "Ugh, really? You KNOW I hate this! 💢"
    },
    {
        label: "Balut 🥚",
        hunger: 0,
        love: -10,
        disliked: true,
        heavy: false,
        timeOptimal: 'never',
        line: "Tanga! Did you forget what I don't like?! 😠"
    }
];

const FEED_STREAK_UNLOCK = 10;
const FEED_STREAK_OUTFIT = "foodieTori";

function getCurrentFoodMenu() {
    const timeOfDay = getTimeOfDay();
    let availableFoods = [...ANYTIME_FOODS, ...DISLIKED_FOODS];
    
    // Add breakfast foods in morning
    if (timeOfDay === 'morning') {
        availableFoods = [...BREAKFAST_FOODS, ...availableFoods];
    }
    
    // Add dinner foods in evening/night
    if (timeOfDay === 'evening' || timeOfDay === 'night') {
        availableFoods = [...DINNER_FOODS, ...availableFoods];
    }
    
    // During afternoon, show all foods but with timing penalties
    if (timeOfDay === 'afternoon') {
        availableFoods = [...BREAKFAST_FOODS, ...DINNER_FOODS, ...availableFoods];
    }
    
    return availableFoods;
}

function handleFeedEntry() {
    if (!checkCooldown('feed')) {
        const sassyLines = moodSystem.dialogue.special.sassyCooldowns;
        displayMessage(sassyLines[Math.floor(Math.random() * sassyLines.length)]);
        return;
    }

    toriGatchiState.buttonMode = 'feed';
    displayMessage("What should I eat, Daddy?");
    createFeedButtons();
    setCooldown('feed');
}

function createFeedButtons() {
    clearButtons();
    const buttonRow = $('button-row');
    if (!buttonRow) return;

    const currentMenu = getCurrentFoodMenu();
    
    currentMenu.forEach((food, index) => {
        const foodBtn = createButton(
            `food-btn-${index}`,
            food.label,
            () => handleFoodSelection(food)
        );
        buttonRow.appendChild(foodBtn);
    });

    const backBtn = createButton('back-btn', '◀ Back', () => handleInteraction('back'));
    buttonRow.appendChild(backBtn);
}

function handleFoodSelection(food) {
    let responseMsg = food.line;
    const currentTime = getTimeOfDay();
    
    // Calculate effectiveness based on timing
    let hungerBonus = food.hunger;
    let loveBonus = food.love;
    let timingPenalty = false;

    // Check timing effectiveness
    if (food.timeOptimal !== 'anytime' && food.timeOptimal !== 'never') {
        if (food.timeOptimal === 'morning' && currentTime !== 'morning') {
            // Breakfast food outside morning hours
            hungerBonus = Math.floor(food.hunger * 0.5);
            loveBonus = 0;
            timingPenalty = true;
            responseMsg = "That's more of a breakfast food... but okay. 😊";
        } else if (food.timeOptimal === 'evening' && (currentTime === 'morning' || currentTime === 'afternoon')) {
            // Dinner food during day hours
            hungerBonus = Math.floor(food.hunger * 0.5);
            loveBonus = 0;
            timingPenalty = true;
            responseMsg = "Save that for dinner, Daddy - too heavy for now.";
        }
    }

    // Check sleepy feeding restrictions
    if (toriGatchiState.mood === "Sleepy") {
        // Block second feeding attempt
        if (toriGatchiState.sleepyFeedCount >= 1) {
            displayMessage("BAKA! I'm trying to sleep! 😤💤");
            toriGatchiState.buttonMode = 'default';
            createDefaultButtons();
            decreaseLove(10);
            recalculateMood();
            updateMeters();
            updateMoodDisplay();
            saveState();
            return;
        }
        
        // Block heavy meals during sleep
        if (food.heavy) {
            displayMessage("That's too heavy for bedtime... something lighter please. 😴");
            return; // Stay in feed menu
        }
        
        // Allow light snack - increment counter AFTER checks pass
        toriGatchiState.sleepyFeedCount++;
    }

    if (food.disliked) {
        // Disliked food: reset streak, trigger Hangry
        toriGatchiState.feedStreak = 0;
        toriGatchiState.hunger = Math.max(0, toriGatchiState.hunger - 20);
        decreaseLove(Math.abs(food.love));
        toriGatchiState.mood = "Hangry";
        
        const dislikeLines = moodSystem.dialogue.special.foodDislike;
        responseMsg = dislikeLines[Math.floor(Math.random() * dislikeLines.length)];
    } else {
        // Liked food: increment streak (only if optimal timing or anytime food)
        increaseLove(loveBonus);
        increaseHunger(hungerBonus);
        
        if (!timingPenalty) {
            toriGatchiState.feedStreak++;
        }
        
        // Easter egg bonus dialogue for Torilog
        if (food.isEasterEgg) {
            responseMsg = food.line; // Use special easter egg line
        } else if (!timingPenalty) {
            // Add mood-based response for optimal timing
            const dialogueKey = getDialogueKey(toriGatchiState.mood);
            const feedResponses = moodSystem.dialogue.actions.feed[dialogueKey];
            if (feedResponses) {
                const moodResponse = feedResponses[Math.floor(Math.random() * feedResponses.length)];
                responseMsg += " " + moodResponse;
            }
        }
        
        // Check streak milestones
        if (toriGatchiState.feedStreak >= 2 && toriGatchiState.feedStreak <= 10) {
            const streakLines = moodSystem.dialogue.special.feedStreak;
            const streakIndex = Math.min(toriGatchiState.feedStreak - 2, streakLines.length - 1);
            responseMsg += "<br>" + streakLines[streakIndex];
        }
        
        // Check for outfit unlock
        if (toriGatchiState.feedStreak >= FEED_STREAK_UNLOCK &&
            !toriGatchiState.unlockedOutfits.includes(FEED_STREAK_OUTFIT)) {
            toriGatchiState.unlockedOutfits.push(FEED_STREAK_OUTFIT);

            // 🔥 GATEWAY HOOK
            const unlockMessage = handleUnlockWithGateway(
                FEED_STREAK_OUTFIT,
                "<br><strong>🍽️ FOODIE UNLOCKED!</strong> You've mastered my preferences!"
            );
            if (unlockMessage) {
                responseMsg += unlockMessage;
            }

            updateOutfitSelector();
            toriGatchiState.feedStreak = 0; // Reset after unlock
        }
        
        toriGatchiState.mood = 'Happy';
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