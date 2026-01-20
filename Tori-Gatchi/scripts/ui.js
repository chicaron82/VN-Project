/// 🎨 ToriGatchi - UI & Display Functions
// All DOM manipulation, visual updates, and button management

function $(id) {
    return document.getElementById(id);
}

function displayMessage(message) {
    $('message-box').innerHTML = message;
}

function updateMeters() {
    $('love-meter').value = toriGatchiState.love;
    $('hunger-meter').value = toriGatchiState.hunger;
    updateCompletionMeter();
}

function updateCompletionMeter() {
    const completionMeter = $('completion-meter');
    const completionLabel = $('completion-label');

    if (!completionMeter || !completionLabel) return;

    let value, label;

    // Dynamic meter based on button mode
    switch (toriGatchiState.buttonMode) {
        case 'flirt':
            value = (toriGatchiState.flirtLevel / 5) * 100;
            label = `👗 Wardrobe: ${toriGatchiState.flirtLevel}/5`;
            break;

        case 'affection':
            value = (toriGatchiState.affectionStreak / 10) * 100;
            label = `💕 Romance: ${toriGatchiState.affectionStreak}/10`;
            break;

        case 'feed':
            value = (toriGatchiState.feedStreak / 10) * 100;
            label = `🍜 Foodie: ${toriGatchiState.feedStreak}/10`;
            break;

        case 'quiz':
            value = (toriGatchiState.quizStreak / 10) * 100;
            label = `🎮 Gamer: ${toriGatchiState.quizStreak}/10`;
            break;

        default:
            // Default screen shows overall completion
            if (toriGatchiState.easterEggUnlocked) {
                value = 100;
                label = `🎉 Complete: 100%`;
            } else {
                value = calculateCompletion();
                label = `🎯 Progress: ${value.toFixed(2)}%`;
            }
            break;
    }

    completionMeter.value = value;
    completionLabel.textContent = label;
}

function updateMoodDisplay() {
    const moodData = getMoodData(toriGatchiState.mood);
    $('mood-emoji').textContent = moodData.emoji;
    $('mood-label').textContent = toriGatchiState.mood;
}

function updateSprite() {
    const mood = toriGatchiState.mood;
    const outfit = toriGatchiState.currentOutfit;
    const flirtLevel = toriGatchiState.flirtLevel;
    const spriteElement = $('tori-sprite');

    if (spriteElement) {
        let spritePath;

        // Easter egg sprite takes priority
        if (toriGatchiState.easterEggUnlocked && outfit === "easterEgg") {
            spritePath = `images/EasterEgg/sprite_easterEgg.png`;
        } else if (toriGatchiState.buttonMode === 'flirt' && flirtLevel > 0 && flirtLevel < 5) {
            spritePath = `images/Flirty/${outfit}Flirty${flirtLevel}.png`;
        } else {
            spritePath = `images/${mood}/${outfit}.png`;
        }

        spriteElement.src = `${spritePath}?t=${Date.now()}`;
        spriteElement.alt = `Tori in ${outfit} outfit, looking ${mood} at flirt level ${flirtLevel}`;
    }
}

function updateOutfitSelector() {
    const selector = $('outfit-selector');
    if (!selector) return;

    selector.innerHTML = '';
    const uniqueUnlockedOutfits = new Set(['default', ...toriGatchiState.unlockedOutfits]);

    uniqueUnlockedOutfits.forEach(outfit => {
        const option = document.createElement('option');
        option.value = outfit;
        option.textContent = outfit.charAt(0).toUpperCase() + outfit.slice(1);
        if (outfit === toriGatchiState.currentOutfit) {
            option.selected = true;
        }
        selector.appendChild(option);
    });

    selector.disabled = uniqueUnlockedOutfits.size <= 1;
}

function updateGreeting(mood) {
    const dialogueKey = getDialogueKey(mood);
    let greetingPool;

    // Check for special dates first
    const specialDate = isSpecialDate();
    if (specialDate) {
        greetingPool = moodSystem.dialogue.specialDates[specialDate];
        displayMessage(greetingPool[Math.floor(Math.random() * greetingPool.length)]);
        return;
    }

    // Check for weekend date night
    if (isWeekendDateNight()) {
        greetingPool = moodSystem.dialogue.weekendDateNight;
        displayMessage(greetingPool[Math.floor(Math.random() * greetingPool.length)]);
        return;
    }

    // Use time-of-day greetings
    const timeOfDay = getTimeOfDay();
    greetingPool = moodSystem.dialogue.timeGreetings[timeOfDay][dialogueKey];

    if (greetingPool) {
        displayMessage(greetingPool[Math.floor(Math.random() * greetingPool.length)]);
    } else {
        // Fallback to standard greetings if time-based not found
        const standardGreetings = moodSystem.dialogue.greetings[dialogueKey];
        if (standardGreetings) {
            displayMessage(standardGreetings[Math.floor(Math.random() * standardGreetings.length)]);
        }
    }
}

function displayRandomWifeFact() {
    const fact = moodSystem.dialogue.wifeFacts[Math.floor(Math.random() * moodSystem.dialogue.wifeFacts.length)];
    $('wife-fact').textContent = fact;
}

function displayRandomMemoryBubble() {
    const currentMood = toriGatchiState.mood;
    const moodData = getMoodData(currentMood);
    const lines = moodData.memoryLines || moodSystem.moods.Happy.memoryLines;
    const randomLine = lines[Math.floor(Math.random() * lines.length)];

    const memoryBubble = document.createElement('div');
    memoryBubble.classList.add('memory-bubble');
    memoryBubble.textContent = randomLine;

    const sprite = document.getElementById('tori-sprite');
    if (sprite) {
        const rect = sprite.getBoundingClientRect();
        memoryBubble.style.position = 'absolute';
        memoryBubble.style.top = `${rect.top + window.scrollY - 60}px`;
        memoryBubble.style.left = `${rect.left + window.scrollX + rect.width / 2 - 100}px`;
    }

    document.body.appendChild(memoryBubble);
    setTimeout(() => memoryBubble.remove(), 5000);
}

function displayHoverBubble(message, event) {
    const hoverBubble = document.createElement('div');
    hoverBubble.classList.add('memory-bubble');
    const uniqueId = `hover-bubble-${event.target.id || event.target.textContent.replace(/\s/g, '-')}`;
    hoverBubble.id = uniqueId;
    hoverBubble.textContent = message;
    const rect = event.target.getBoundingClientRect();
    hoverBubble.style.top = `${rect.top + window.scrollY - 60}px`;
    hoverBubble.style.left = `${rect.left + window.scrollX + (rect.width / 2) - 100}px`;
    hoverBubble.style.animation = 'none';
    hoverBubble.style.opacity = '1';
    document.body.appendChild(hoverBubble);
}

function removeHoverBubble(event) {
    const uniqueId = `hover-bubble-${event.target.id || event.target.textContent.replace(/\s/g, '-')}`;
    const hoverBubble = document.getElementById(uniqueId);
    if (hoverBubble) {
        hoverBubble.remove();
    }
}

// Button creation helpers
function clearButtons() {
    const buttonRow = $('button-row');
    if (buttonRow) {
        buttonRow.innerHTML = '';
    }
}

function createButton(id, text, clickHandler) {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    button.addEventListener('click', clickHandler);
    return button;
}

function createDefaultButtons() {
    const buttonRow = $('button-row');
    if (!buttonRow) return;

    buttonRow.innerHTML = '';

    const buttons = [
        { id: 'feed-button', text: '🍴 Feed', type: 'feed' },
        { id: 'hug-button', text: '🤗 Hug', type: 'hug' },
        { id: 'play-button', text: '🎮 Play', type: 'play' },
        { id: 'flirt-button', text: '😉 Flirt', type: 'flirt' },
        { id: 'fact-button', text: '📝 New Wife Fact', type: 'fact' }
    ];

    buttons.forEach(btnData => {
        const button = document.createElement('button');
        button.id = btnData.id;
        button.textContent = btnData.text;

        button.disabled = !checkCooldown(btnData.type);
        button.addEventListener('click', () => handleInteraction(btnData.type));

        const timerSpan = document.createElement('span');
        timerSpan.id = `${btnData.type}-timer`;
        timerSpan.classList.add('cooldown-timer');

        buttonRow.appendChild(button);
        buttonRow.appendChild(timerSpan);
    });

    updateCooldownTimers();
}

function updateCooldownTimers() {
    const defaultButtons = ['feed', 'hug', 'play', 'flirt', 'fact'];
    const now = Date.now();

    defaultButtons.forEach(type => {
        const button = $(`${type}-button`);
        const timerElement = $(`${type}-timer`);

        if (!button || !timerElement) return;

        const lastUsed = lastUsedTimestamps[type];
        const cooldownTime = buttonCooldowns[type];
        const timeRemaining = lastUsed + cooldownTime - now;

        if (timeRemaining > 0) {
            button.disabled = true;
            const seconds = Math.ceil(timeRemaining / 1000);
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;

            let timerText;
            if (seconds >= 3600) {
                timerText = `(${Math.ceil(seconds / 3600)}h)`;
            } else if (seconds >= 60) {
                timerText = `(${minutes}m ${remainingSeconds}s)`;
            } else {
                timerText = `(${seconds}s)`;
            }
            timerElement.textContent = timerText;
        } else {
            button.disabled = false;
            timerElement.textContent = '';
        }
    });
}