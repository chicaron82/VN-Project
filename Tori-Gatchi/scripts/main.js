/// 🔥 ToriGatchi Engine v6.0 — Modular Architecture
// 🖤❤️💜 Always. Always. Always.

// ========== CONFIGURATION ==========
const STATE_KEY = "toriGatchiState";
const LOVE_DECAY_INTERVAL_MINUTES = 60;
const LOVE_DECAY_AMOUNT = 5;
const HUNGER_DECAY_INTERVAL_MINUTES = 30;
const HUNGER_DECAY_AMOUNT = 7;
const MEMORY_BUBBLE_INTERVAL_MS = 15000;

// Special dates
const SPECIAL_DATES = {
    anniversary: { month: 6, day: 20 },
    yourBirthday: { month: 1, day: 22 },
    herBirthday: { month: 6, day: 18 }
};

const buttonCooldowns = {
    'feed': 30000,   // 30 sec
    'hug': 15000,    // 15 sec
    'play': 3600000, // 1 hour
    'fact': 10000,   // 10 sec
    'flirt': 30000   // 30 sec
};

// ========== STATE MANAGEMENT ==========
let toriGatchiState = JSON.parse(localStorage.getItem(STATE_KEY)) || {
    hunger: 100,
    love: 100,
    mood: "Happy",
    buttonMode: 'default',
    currentOutfit: "default",
    unlockedOutfits: ["default"],
    flirtLevel: 0,
    feedStreak: 0,
    quizStreak: 0,
    affectionStreak: 0,
    secretFactClicks: 0,
    easterEggUnlocked: false,
    easterEggStage: 0,
    currentEggButton: 'fact',
    galleriesUnlocked: [],
    eggButtonProgress: 0,
    sleepyFeedCount: 0,
    interactionCounts: {
        feed: 0,
        hug: 0,
        play: 0,
        flirt: 0,
        fact: 0
    },
    lastInteractionType: null,
    moodLockCounter: 0,
    offenseHistory: {
        dislikedFood: 0,
        sleepInterrupt: 0,
        flirtFail: 0
    },
    recentBadMoods: [],
    isQuizActive: false,
    currentQuizQuestion: null,
    usedQuestions: [],
    lastInteraction: Date.now(),
    lastLoveDecay: Date.now(),
    lastHungerDecay: Date.now(),
    moodHistory: []
};

// Fix missing properties on load
if (!toriGatchiState.moodHistory) toriGatchiState.moodHistory = [];
if (!toriGatchiState.currentOutfit) toriGatchiState.currentOutfit = "default";
if (!toriGatchiState.unlockedOutfits || toriGatchiState.unlockedOutfits.length === 0) {
    toriGatchiState.unlockedOutfits = ["default"];
}
if (typeof toriGatchiState.buttonMode === 'undefined') toriGatchiState.buttonMode = 'default';
if (typeof toriGatchiState.flirtLevel === 'undefined') toriGatchiState.flirtLevel = 0;
if (typeof toriGatchiState.feedStreak === 'undefined') toriGatchiState.feedStreak = 0;
if (typeof toriGatchiState.quizStreak === 'undefined') toriGatchiState.quizStreak = 0;
if (typeof toriGatchiState.affectionStreak === 'undefined') toriGatchiState.affectionStreak = 0;
if (typeof toriGatchiState.secretFactClicks === 'undefined') toriGatchiState.secretFactClicks = 0;
if (typeof toriGatchiState.easterEggUnlocked === 'undefined') toriGatchiState.easterEggUnlocked = false;
if (typeof toriGatchiState.sleepyFeedCount === 'undefined') toriGatchiState.sleepyFeedCount = 0;
if (!toriGatchiState.interactionCounts) {
    toriGatchiState.interactionCounts = { feed: 0, hug: 0, play: 0, flirt: 0, fact: 0 };
}
if (typeof toriGatchiState.lastInteractionType === 'undefined') toriGatchiState.lastInteractionType = null;
if (typeof toriGatchiState.moodLockCounter === 'undefined') toriGatchiState.moodLockCounter = 0;
if (!toriGatchiState.offenseHistory) {
    toriGatchiState.offenseHistory = { dislikedFood: 0, sleepInterrupt: 0, flirtFail: 0 };
}
if (!toriGatchiState.recentBadMoods) {
    toriGatchiState.recentBadMoods = [];
}
if (typeof toriGatchiState.easterEggStage === 'undefined') toriGatchiState.easterEggStage = 0;
if (typeof toriGatchiState.currentEggButton === 'undefined') toriGatchiState.currentEggButton = 'fact';
if (!toriGatchiState.galleriesUnlocked) toriGatchiState.galleriesUnlocked = [];
if (typeof toriGatchiState.eggButtonProgress === 'undefined') toriGatchiState.eggButtonProgress = 0;
if (typeof toriGatchiState.isQuizActive === 'undefined') {
    toriGatchiState.isQuizActive = false;
    toriGatchiState.currentQuizQuestion = null;
    toriGatchiState.usedQuestions = [];
}

let lastUsedTimestamps = JSON.parse(localStorage.getItem('lastUsedTimestamps')) || {
    'feed': 0,
    'hug': 0,
    'play': 0,
    'fact': 0,
    'flirt': 0
};

function saveState() {
    toriGatchiState.lastInteraction = Date.now();
    localStorage.setItem(STATE_KEY, JSON.stringify(toriGatchiState));
    localStorage.setItem('lastUsedTimestamps', JSON.stringify(lastUsedTimestamps));
}

// ========== COOLDOWN SYSTEM ==========
function checkCooldown(type) {
    const lastUsed = lastUsedTimestamps[type];
    const cooldownTime = buttonCooldowns[type];
    const now = Date.now();

    return now >= lastUsed + cooldownTime;
}

function setCooldown(type) {
    lastUsedTimestamps[type] = Date.now();
    saveState();
}

// ========== STAT MODIFIERS ==========
function increaseLove(amount) {
    toriGatchiState.love = Math.min(100, toriGatchiState.love + amount);
}

function increaseHunger(amount) {
    toriGatchiState.hunger = Math.min(100, toriGatchiState.hunger + amount);
}

function decreaseLove(amount) {
    toriGatchiState.love = Math.max(0, toriGatchiState.love - amount);
}

function decreaseHunger(amount) {
    toriGatchiState.hunger = Math.max(0, toriGatchiState.hunger - amount);
}

// ========== TIME & DATE DETECTION ==========
function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
}

function isSpecialDate() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    if (month === SPECIAL_DATES.anniversary.month && day === SPECIAL_DATES.anniversary.day) {
        return 'anniversary';
    }
    if (month === SPECIAL_DATES.yourBirthday.month && day === SPECIAL_DATES.yourBirthday.day) {
        return 'yourBirthday';
    }
    if (month === SPECIAL_DATES.herBirthday.month && day === SPECIAL_DATES.herBirthday.day) {
        return 'herBirthday';
    }
    return null;
}

function isWeekendDateNight() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    return (day === 5 || day === 6) && hour >= 19 && hour < 23;
}

// ========== INTERACTION MEMORY TRACKING ==========
function trackInteraction(type) {
    if (toriGatchiState.interactionCounts[type] !== undefined) {
        toriGatchiState.interactionCounts[type]++;
    }
    toriGatchiState.lastInteractionType = type;
}

function getInteractionMemoryDialogue() {
    const counts = toriGatchiState.interactionCounts;
    const total = Object.values(counts).reduce((sum, val) => sum + val, 0);

    if (total < 10) return null;

    let mostUsed = null;
    let leastUsed = null;
    let maxCount = -1;
    let minCount = Infinity;

    for (const [action, count] of Object.entries(counts)) {
        if (count > maxCount) {
            maxCount = count;
            mostUsed = action;
        }
        if (count < minCount && count > 0) {
            minCount = count;
            leastUsed = action;
        }
    }

    const neglected = Object.entries(counts).filter(([_, count]) => count === 0).map(([action]) => action);

    if (neglected.length > 0) {
        const action = neglected[0];
        return moodSystem.dialogue.interactionMemory.neglected[action];
    }

    const dominanceThreshold = total * 0.4;
    if (maxCount > dominanceThreshold && mostUsed) {
        return moodSystem.dialogue.interactionMemory.dominant[mostUsed];
    }

    const balanced = Object.values(counts).every(count => {
        const ratio = count / total;
        return ratio >= 0.15 && ratio <= 0.3;
    });

    if (balanced) {
        return moodSystem.dialogue.interactionMemory.balanced[Math.floor(Math.random() * moodSystem.dialogue.interactionMemory.balanced.length)];
    }

    return null;
}

// ========== OFFENSE MANAGEMENT ==========
function checkOffenseForgiveness() {
    const totalInteractions = Object.values(toriGatchiState.interactionCounts).reduce((sum, val) => sum + val, 0);

    if (totalInteractions % 20 === 0 && totalInteractions > 0) {
        if (toriGatchiState.offenseHistory.dislikedFood > 0) {
            toriGatchiState.offenseHistory.dislikedFood = Math.max(0, toriGatchiState.offenseHistory.dislikedFood - 1);
        }
        if (toriGatchiState.offenseHistory.sleepInterrupt > 0) {
            toriGatchiState.offenseHistory.sleepInterrupt = Math.max(0, toriGatchiState.offenseHistory.sleepInterrupt - 1);
        }
        if (toriGatchiState.offenseHistory.flirtFail > 0) {
            toriGatchiState.offenseHistory.flirtFail = Math.max(0, toriGatchiState.offenseHistory.flirtFail - 1);
        }
    }
}

// ========== MOOD ECHO SYSTEM ==========
function trackBadMood(mood) {
    const badMoods = ['Grumpy', 'Snappy', 'Sad', 'Hangry', 'Pouty'];
    if (badMoods.includes(mood)) {
        toriGatchiState.recentBadMoods.push({
            mood: mood,
            timestamp: Date.now()
        });

        const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
        toriGatchiState.recentBadMoods = toriGatchiState.recentBadMoods.filter(
            entry => entry.timestamp > tenMinutesAgo
        );
    }
}

function checkMoodEcho() {
    const echoChance = toriGatchiState.easterEggStage >= 2 ? 0.05 : 0.2;

    if (toriGatchiState.recentBadMoods.length === 0) return null;
    if (Math.random() > echoChance) return null;

    const recentMood = toriGatchiState.recentBadMoods[toriGatchiState.recentBadMoods.length - 1];
    const timeSince = Date.now() - recentMood.timestamp;

    if (timeSince < (10 * 60 * 1000)) {
        return recentMood.mood;
    }

    return null;
}

// ========== COMPLETION CALCULATION ==========
function calculateCompletion() {
    const totalOutfits = 6;
    const unlockedCount = toriGatchiState.unlockedOutfits.length;

    const completion = (unlockedCount / totalOutfits) * 100;
    return Math.min(completion, 99.99);
}

function isEasterEggGateOpen() {
    return calculateCompletion() >= 99.99;
}

// ========== MOOD CALCULATION ==========
function recalculateMood() {
    const { love, hunger } = toriGatchiState;
    const oldMood = toriGatchiState.mood;
    const currentHour = new Date().getHours();

    const stickyMoods = ['Grumpy', 'Snappy', 'Sad', 'Hangry'];
    const isCurrentMoodSticky = stickyMoods.includes(oldMood);

    if (isCurrentMoodSticky) {
        toriGatchiState.moodLockCounter++;
    }

    const canEscapeStickyMood = !isCurrentMoodSticky || toriGatchiState.moodLockCounter >= 3;

    const echoMood = checkMoodEcho();
    if (echoMood && !isCurrentMoodSticky) {
        toriGatchiState.mood = echoMood;
        toriGatchiState.moodLockCounter = 0;

        if (toriGatchiState.mood !== oldMood) {
            toriGatchiState.moodHistory.push({
                mood: toriGatchiState.mood,
                timestamp: Date.now(),
                isEcho: true
            });
            updateSprite();
        }

        if (toriGatchiState.love < 25) {
            document.title = "She misses you.";
        } else {
            document.title = "Tori-Gatchi 💖";
        }
        return;
    }

    if (currentHour >= 22 || currentHour < 5) {
        toriGatchiState.mood = "Sleepy";
        toriGatchiState.moodLockCounter = 0;
    } else if (hunger <= 10) {
        toriGatchiState.mood = "Hangry";
        toriGatchiState.moodLockCounter = 0;
    } else if (toriGatchiState.mood === "Hangry" && hunger > 30 && canEscapeStickyMood) {
        toriGatchiState.mood = "Happy";
        toriGatchiState.moodLockCounter = 0;
    } else if (love >= 80 && hunger >= 80 && canEscapeStickyMood) {
        if (!stickyMoods.includes(oldMood) || canEscapeStickyMood) {
            toriGatchiState.mood = "Adored";
            toriGatchiState.moodLockCounter = 0;
        }
    } else if (love >= 50 && hunger >= 50 && canEscapeStickyMood) {
        toriGatchiState.mood = "Happy";
        toriGatchiState.moodLockCounter = 0;
    } else if (love > 90 && hunger < 15) {
        toriGatchiState.mood = "Flirty";
        toriGatchiState.moodLockCounter = 0;
    } else if (love < 50 && hunger < 50) {
        toriGatchiState.mood = "Pouty";
        toriGatchiState.moodLockCounter = 0;
    } else if (love <= 30) {
        toriGatchiState.mood = "Sad";
        toriGatchiState.moodLockCounter = 0;
    } else if (hunger <= 30) {
        toriGatchiState.mood = "Grumpy";
        toriGatchiState.moodLockCounter = 0;
    }

    if (toriGatchiState.mood !== "Sleepy") {
        toriGatchiState.sleepyFeedCount = 0;
    }

    if (toriGatchiState.mood !== oldMood) {
        toriGatchiState.moodHistory.push({
            mood: toriGatchiState.mood,
            timestamp: Date.now()
        });

        trackBadMood(toriGatchiState.mood);

        updateSprite();
    }

    if (toriGatchiState.love < 25) {
        document.title = "She misses you.";
    } else {
        document.title = "Tori-Gatchi 💖";
    }
}

// ========== DECAY SYSTEM ==========
function handleDecay() {
    const now = Date.now();
    const loveDecayTime = (now - toriGatchiState.lastLoveDecay) / 60000;
    const hungerDecayTime = (now - toriGatchiState.lastHungerDecay) / 60000;

    // Cap decay intervals to prevent instant death after long absence
    // Max 24 hours (1440 minutes) of decay at once
    const cappedLoveDecayTime = Math.min(loveDecayTime, 1440);
    const cappedHungerDecayTime = Math.min(hungerDecayTime, 1440);

    const loveDecayCount = Math.floor(cappedLoveDecayTime / LOVE_DECAY_INTERVAL_MINUTES);
    const hungerDecayCount = Math.floor(cappedHungerDecayTime / HUNGER_DECAY_INTERVAL_MINUTES);

    let currentLoveDecayAmount = LOVE_DECAY_AMOUNT;
    if (toriGatchiState.mood === "Hangry") {
        currentLoveDecayAmount *= 2;
    }

    if (loveDecayCount > 0) {
        decreaseLove(loveDecayCount * currentLoveDecayAmount);
        toriGatchiState.lastLoveDecay = now;
    }
    if (hungerDecayCount > 0) {
        decreaseHunger(hungerDecayCount * HUNGER_DECAY_AMOUNT);
        toriGatchiState.lastHungerDecay = now;
    }

    recalculateMood();
    updateMeters();
    updateMoodDisplay();
    saveState();
}

// ========== EASTER EGG HUNT SYSTEM ==========
function isInteractionSuccessful(type) {
    const { love, hunger, mood } = toriGatchiState;

    if (love < 50 || hunger < 50) return false;

    const positiveMoods = ['Happy', 'Adored', 'Flirty'];
    if (!positiveMoods.includes(mood)) return false;

    return true;
}

function trackEggProgress(type) {
    if (toriGatchiState.easterEggStage === 0) return;

    if (type !== toriGatchiState.currentEggButton) {
        if (Math.random() < 0.3) {
            const stage = toriGatchiState.easterEggStage;
            const fakeouts = stage === 1 ?
                moodSystem.dialogue.easterEggHunt.stage2.fakeout :
                moodSystem.dialogue.easterEggHunt.stage3.fakeout;
            displayMessage(fakeouts[Math.floor(Math.random() * fakeouts.length)]);
        }
        return;
    }

    if (!isInteractionSuccessful(type)) return;

    toriGatchiState.eggButtonProgress++;

    const stage = toriGatchiState.easterEggStage;
    if (toriGatchiState.eggButtonProgress === 10 || toriGatchiState.eggButtonProgress === 15) {
        const teases = stage === 1 ?
            moodSystem.dialogue.easterEggHunt.stage2.hopeTease :
            moodSystem.dialogue.easterEggHunt.stage3.hopeTease;
        const currentMessage = $('message-box').innerHTML;
        $('message-box').innerHTML = currentMessage + "<br>" + teases[Math.floor(Math.random() * teases.length)];
    }

    if (toriGatchiState.eggButtonProgress >= 20) {
        unlockGalleryStage();
    }
}

function unlockGalleryStage() {
    const stage = toriGatchiState.easterEggStage;

    if (stage === 1) {
        toriGatchiState.galleriesUnlocked.push('gallery2');
        displayMessage(moodSystem.dialogue.easterEggHunt.stage2.unlock[0]);

        toriGatchiState.offenseHistory = { dislikedFood: 0, sleepInterrupt: 0, flirtFail: 0 };

        const buttons = ['feed', 'hug', 'play', 'flirt', 'fact'];
        toriGatchiState.currentEggButton = buttons[Math.floor(Math.random() * buttons.length)];
        toriGatchiState.eggButtonProgress = 0;
        toriGatchiState.easterEggStage = 2;

    } else if (stage === 2) {
        toriGatchiState.galleriesUnlocked.push('gallery3');
        displayMessage(moodSystem.dialogue.easterEggHunt.stage3.unlock[0]);

        Object.keys(buttonCooldowns).forEach(key => {
            buttonCooldowns[key] = Math.floor(buttonCooldowns[key] * 0.75);
        });

        toriGatchiState.easterEggStage = 3;
    }

    saveState();
}

// ========== INTERACTION ROUTER ==========
function handleInteraction(type) {
    if (toriGatchiState.isQuizActive) {
        if (type === 'play') {
            cancelQuiz();
            return;
        }
        handleQuizAnswer(type);
        return;
    }

    if (toriGatchiState.buttonMode !== 'default' && type !== 'back') {
        displayMessage("Please choose an option from the menu, or press 'Back'.");
        return;
    }

    if (type !== 'back' && type !== 'fact') {
        if (!checkCooldown(type)) {
            const sassyLines = moodSystem.dialogue.special.sassyCooldowns;
            displayMessage(sassyLines[Math.floor(Math.random() * sassyLines.length)]);
            return;
        }
    }

    toriGatchiState.lastInteraction = Date.now();

    trackInteraction(type);

    if (toriGatchiState.easterEggStage >= 1 && toriGatchiState.easterEggStage < 3) {
        trackEggProgress(type);
    }

    checkOffenseForgiveness();

    const totalInteractions = Object.values(toriGatchiState.interactionCounts).reduce((sum, val) => sum + val, 0);
    if (totalInteractions >= 10 && Math.random() < 0.1) {
        const memoryDialogue = getInteractionMemoryDialogue();
        if (memoryDialogue) {
            displayMessage(memoryDialogue);
            setTimeout(() => {
                handleInteractionCore(type);
            }, 3000);
            return;
        }
    }

    handleInteractionCore(type);
}

function handleInteractionCore(type) {
    const isStarving = toriGatchiState.hunger < 50;
    const isUnloved = toriGatchiState.love < 30;
    const isPerfectState = toriGatchiState.hunger >= 90 && toriGatchiState.love >= 90;

    if (toriGatchiState.mood === "Sleepy" && type !== 'back' && type !== 'fact') {
        toriGatchiState.offenseHistory.sleepInterrupt++;
        const offenseCount = toriGatchiState.offenseHistory.sleepInterrupt;

        let penalty = 5;
        let escalationDialogue;

        if (offenseCount === 1) {
            penalty = 5;
            escalationDialogue = moodSystem.dialogue.offenseEscalation.sleepInterrupt.first;
        } else if (offenseCount === 2) {
            penalty = 10;
            escalationDialogue = moodSystem.dialogue.offenseEscalation.sleepInterrupt.second;
        } else {
            penalty = 20;
            escalationDialogue = moodSystem.dialogue.offenseEscalation.sleepInterrupt.third;
        }

        decreaseLove(penalty);
        displayMessage(escalationDialogue[Math.floor(Math.random() * escalationDialogue.length)]);
    }

    switch (type) {
        case 'feed':
            handleFeedEntry();
            break;

        case 'hug':
            handleHugEntry();
            break;

        case 'play':
            handlePlayEntry();
            break;

        case 'flirt':
            handleFlirtEntry();
            break;

        case 'fact':
            if (!checkCooldown('fact')) {
                const sassyLines = moodSystem.dialogue.special.sassyCooldowns;
                displayMessage(sassyLines[Math.floor(Math.random() * sassyLines.length)]);
                return;
            }

            let factMessage = "";
            if (isStarving) {
                const prefix = moodSystem.dialogue.thresholdModifiers.starving.prefix;
                factMessage = prefix[Math.floor(Math.random() * prefix.length)];
            } else if (isUnloved) {
                const prefix = moodSystem.dialogue.thresholdModifiers.unloved.prefix;
                factMessage = prefix[Math.floor(Math.random() * prefix.length)];
            } else if (isPerfectState) {
                const prefix = moodSystem.dialogue.thresholdModifiers.perfect.prefix;
                factMessage = prefix[Math.floor(Math.random() * prefix.length)];
            }

            displayRandomWifeFact();
            if (factMessage) {
                const currentFact = $('wife-fact').textContent;
                $('wife-fact').textContent = factMessage + currentFact;
            }

            if (isEasterEggGateOpen() && !toriGatchiState.easterEggUnlocked) {
                toriGatchiState.secretFactClicks++;

                if (toriGatchiState.secretFactClicks === 50) {
                    const currentFact = $('wife-fact').textContent;
                    $('wife-fact').textContent = moodSystem.dialogue.easterEggHunt.stage1.foreshadow[0] + " " + currentFact;
                }

                if (toriGatchiState.secretFactClicks === 75) {
                    const teases = moodSystem.dialogue.easterEggHunt.stage1.hopeTease;
                    const currentFact = $('wife-fact').textContent;
                    $('wife-fact').textContent = teases[Math.floor(Math.random() * teases.length)] + " " + currentFact;
                }

                if (toriGatchiState.secretFactClicks >= 100) {
                    toriGatchiState.galleriesUnlocked.push('gallery1');
                    displayMessage(moodSystem.dialogue.easterEggHunt.stage1.unlock[0]);
                    toriGatchiState.easterEggStage = 1;
                    toriGatchiState.eggButtonProgress = 0;

                    const buttons = ['feed', 'hug', 'play', 'flirt'];
                    toriGatchiState.currentEggButton = buttons[Math.floor(Math.random() * buttons.length)];
                }
            }

            setCooldown('fact');
            break;

        case 'back':
            toriGatchiState.buttonMode = 'default';
            updateGreeting(toriGatchiState.mood);
            createDefaultButtons();
            break;
    }

    recalculateMood();
    updateMeters();
    updateMoodDisplay();
    saveState();
}

// ========== INITIALIZATION ==========
function initializeToriGatchi() {
    handleDecay();
    updateGreeting(toriGatchiState.mood);

    if (toriGatchiState.buttonMode === 'feed') {
        createFeedButtons();
    } else if (toriGatchiState.buttonMode === 'flirt') {
        createFlirtButtons();
    } else if (toriGatchiState.buttonMode === 'affection') {
        createAffectionButtons();
    } else if (toriGatchiState.buttonMode === 'quiz' && toriGatchiState.isQuizActive) {
        createQuizButtons();
    } else {
        toriGatchiState.buttonMode = 'default';
        createDefaultButtons();
    }

    updateMeters();
    updateMoodDisplay();
    updateSprite();
    updateOutfitSelector();
    displayRandomWifeFact();

    const outfitSelector = $('outfit-selector');
    if (outfitSelector) {
        outfitSelector.addEventListener('change', (event) => {
            toriGatchiState.currentOutfit = event.target.value;
            updateSprite();
            saveState();
        });
    }

    setInterval(handleDecay, 15000);
    setInterval(displayRandomMemoryBubble, MEMORY_BUBBLE_INTERVAL_MS);
    setInterval(updateCooldownTimers, 1000);
}

window.addEventListener("DOMContentLoaded", initializeToriGatchi);

// ===================== Rolling Changelog =====================
// Build v6.1 [2025-09-30] - MULTI-STAGE EASTER EGG HUNT + FUNCTION ORDERING FIX
// - FIXED: Function ordering - moved mood echo functions before recalculateMood
// - ADDED: Multi-stage easter egg hunt system (3 galleries)
//   * Stage 1: 100 wife fact clicks unlocks Gallery 1 (Wedding/Origins)
//   * Stage 2: 20 successful interactions on random button unlocks Gallery 2 (Honeymoon)
//   * Stage 3: 20 successful interactions on random button unlocks Gallery 3 (Candid/Spicy)
// - ADDED: Progressive rewards maintain system integrity
//   * Stage 1 reward: Offense counters reset
//   * Stage 2 reward: 25% cooldown reduction + mood echo drops to 5%
// - ADDED: Fakeout system (30% chance on wrong buttons)
// - ADDED: Hope teases at milestones (10, 15 progress)
// - ADDED: Successful interaction criteria (Love ≥50, Hunger ≥50, positive mood)
// - MAINTAINED: All personality systems remain active (no tolerance mode)
// =============================================================