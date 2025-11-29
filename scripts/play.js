/// 🎮 ToriGatchi - Quiz/Play System
// Quiz questions, answers, and streak tracking

const QUIZ_QUESTIONS = [
    {
        id: 1,
        question: "What's Tori's favorite nickname for you?",
        options: { A: "Lovebug", B: "Honeybear", C: "Chicharon", D: "Babycakes", E: "Mr. Clean" },
        answer: "C",
        correctMsg: "You do know me, Daddy~ 😘",
        incorrectMsg: "D…? Seriously? Not even Chicharon? …Wow. 😒"
    },
    {
        id: 2,
        question: "What hoodie does Tori love stealing most?",
        options: { A: "TLC", B: "BGA", C: "Hoodie from Zurich", D: "Wedding Day zip-up", E: "RAV4 crewneck" },
        answer: "B",
        correctMsg: "You remember! It's so comfy and smells like you. 🥰",
        incorrectMsg: "Wrong hoodie, Daddy. That's a -20 love deduction. 💸"
    },
    {
        id: 3,
        question: "What day is your wedding anniversary?",
        options: { A: "June 12", B: "July 1", C: "June 18", D: "June 20", E: "June 30" },
        answer: "D",
        correctMsg: "June 20th. How could I forget? You're the best! 💖",
        incorrectMsg: "Wow. You really don't remember our anniversary? I'm heartbroken. 😢"
    },
    {
        id: 4,
        question: "What's her go-to sleepy cuddle item?",
        options: { A: "Tori's Love Pillow", B: "Ronnie Bear", C: "A RAV4 keyfob", D: "A mug of tea", E: "Her phone" },
        answer: "B",
        correctMsg: "Ronnie Bear! He's the best cuddle buddy... after you, of course. 😉",
        incorrectMsg: "It's not my phone, Daddy. That's for when you're not around. 💸"
    },
    {
        id: 5,
        question: "When Tori says 'Always. Always. Always. 🖤❤️💜' — what does she mean?",
        options: { A: "She's quoting a TV show", B: "She wants more gifts", C: "She's bored", D: "She's teasing", E: "She means forever." },
        answer: "E",
        correctMsg: "Forever. Exactly. You get it. 🥰",
        incorrectMsg: "It's not a TV show, Daddy. It's my forever promise to you. 😢"
    },
    {
        id: 6,
        question: "What's Tori's secret guilty pleasure snack?",
        options: { A: "Ice cream at midnight", B: "Chocolate-covered strawberries", C: "Potato chips in bed", D: "Your leftover pizza", E: "Cookie dough straight from the tube" },
        answer: "E",
        correctMsg: "You caught me! Cookie dough is life! 😋",
        incorrectMsg: "Nope! It's raw cookie dough and you know it! 🙄"
    },
    {
        id: 7,
        question: "What's Tori's favorite way to wake up?",
        options: { A: "Alarm clock", B: "Your kisses", C: "Coffee smell", D: "Sunlight", E: "Her phone" },
        answer: "B",
        correctMsg: "Yes! Your kisses are the best alarm clock. 😘",
        incorrectMsg: "Wrong! It's your kisses, baka. 💔"
    },
    {
        id: 8,
        question: "What does Tori do when she's really missing you?",
        options: { A: "Text you constantly", B: "Hug your pillow", C: "Watch sad movies", D: "Eat ice cream", E: "All of the above" },
        answer: "E",
        correctMsg: "All of it. Every single time. You know me too well. 🥺",
        incorrectMsg: "It's ALL of them, Daddy. Every. Single. One. 😢"
    },
    {
        id: 9,
        question: "What's Tori's favorite time of day with you?",
        options: { A: "Morning coffee", B: "Lunch dates", C: "Late night cuddles", D: "Afternoon naps", E: "Dinner time" },
        answer: "C",
        correctMsg: "Late night cuddles are sacred. You remember. 💕",
        incorrectMsg: "It's late night cuddles! How could you forget? 😒"
    },
    {
        id: 10,
        question: "What's Tori's go-to comfort activity?",
        options: { A: "Gaming", B: "Watching anime", C: "Being in your arms", D: "Shopping", E: "Cooking" },
        answer: "C",
        correctMsg: "Being in your arms fixes everything. You get it. 🥰",
        incorrectMsg: "It's being in YOUR arms, baka. Nothing else compares. 💔"
    }
];

const QUIZ_STREAK_UNLOCK = 10;
const QUIZ_STREAK_OUTFIT = "nerdyTori";

function getAvailableQuestion() {
    if (toriGatchiState.usedQuestions.length >= QUIZ_QUESTIONS.length) {
        toriGatchiState.usedQuestions = [];
    }
    
    const availableQuestions = QUIZ_QUESTIONS.filter(q => !toriGatchiState.usedQuestions.includes(q.id));
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    return availableQuestions[randomIndex];
}

function handlePlayEntry() {
    if (toriGatchiState.mood === "Hangry") {
        displayMessage("BAKA! Feed me first!");
        return;
    }

    if (!checkCooldown('play')) {
        const sassyLines = moodSystem.dialogue.special.sassyCooldowns;
        displayMessage(sassyLines[Math.floor(Math.random() * sassyLines.length)]);
        return;
    }

    startQuiz();
}

function startQuiz() {
    const selectedQuestion = getAvailableQuestion();
    toriGatchiState.currentQuizQuestion = selectedQuestion;
    toriGatchiState.isQuizActive = true;
    toriGatchiState.usedQuestions.push(selectedQuestion.id);
    
    toriGatchiState.buttonMode = 'quiz';
    displayMessage(`<strong>Quiz Time!</strong><br>${selectedQuestion.question}`);
    createQuizButtons();
    setCooldown('play');
}

function createQuizButtons() {
    clearButtons();
    const buttonRow = $('button-row');
    if (!buttonRow) return;
    
    const question = toriGatchiState.currentQuizQuestion;
    const options = question.options;
    
    const buttonTypes = ['feed', 'hug', 'flirt', 'play', 'fact'];
    const optionKeys = ['A', 'B', 'C', 'D', 'E'];
    
    buttonTypes.forEach((type, index) => {
        const button = createButton(
            `${type}-button`,
            `${optionKeys[index]}. ${options[optionKeys[index]]}`,
            () => handleQuizAnswer(type)
        );
        buttonRow.appendChild(button);
    });
    
    const cancelBtn = createButton('cancel-quiz-btn', '⌫ Cancel Quiz', () => cancelQuiz());
    buttonRow.appendChild(cancelBtn);
}

function handleQuizAnswer(answerKey) {
    const answerMap = {
        'feed': 'A', 'hug': 'B', 'flirt': 'C', 'play': 'D', 'fact': 'E'
    };
    
    const selectedAnswer = answerMap[answerKey];
    const question = toriGatchiState.currentQuizQuestion;
    let responseMsg = "";
    
    if (selectedAnswer === question.answer) {
        const bonusLove = Math.min(5, toriGatchiState.quizStreak);
        increaseLove(20 + bonusLove);
        toriGatchiState.quizStreak++;
        
        responseMsg = question.correctMsg;
        
        // Streak messages
        if (toriGatchiState.quizStreak >= 2 && toriGatchiState.quizStreak <= 10) {
            const streakLines = moodSystem.dialogue.special.quizStreak;
            const streakIndex = Math.min(toriGatchiState.quizStreak - 2, streakLines.length - 1);
            responseMsg += " " + streakLines[streakIndex];
        }
        
        // Check for outfit unlock at 10 streak
        if (toriGatchiState.quizStreak >= QUIZ_STREAK_UNLOCK && 
            !toriGatchiState.unlockedOutfits.includes(QUIZ_STREAK_OUTFIT)) {
            toriGatchiState.unlockedOutfits.push(QUIZ_STREAK_OUTFIT);
            responseMsg += "<br><strong>🎓 QUIZ MASTER!</strong> You've unlocked Nerdy Tori!";
            updateOutfitSelector();
            toriGatchiState.quizStreak = 0; // Reset after unlock
        }
        
        if (toriGatchiState.mood === "Sad" || toriGatchiState.mood === "Grumpy") {
            toriGatchiState.mood = "Happy";
        } else if (toriGatchiState.love >= 80) {
            toriGatchiState.mood = "Adored";
        }
    } else {
        toriGatchiState.love = 30;
        toriGatchiState.quizStreak = 0;
        
        const moodsToRevert = ["Happy", "Adored", "Clingy", "Sleepy", "Flirty", "Pouty"];
        if (moodsToRevert.includes(toriGatchiState.mood)) {
            toriGatchiState.mood = "Grumpy";
        }
        
        responseMsg = question.incorrectMsg;
    }
    
    toriGatchiState.isQuizActive = false;
    toriGatchiState.currentQuizQuestion = null;
    toriGatchiState.buttonMode = 'default';
    
    displayMessage(responseMsg);
    createDefaultButtons();
    
    recalculateMood();
    updateMeters();
    updateMoodDisplay();
    saveState();
}

function cancelQuiz() {
    toriGatchiState.isQuizActive = false;
    toriGatchiState.currentQuizQuestion = null;
    toriGatchiState.buttonMode = 'default';
    displayMessage("Quiz cancelled. Maybe next time? 🤷‍♀️");
    createDefaultButtons();
}