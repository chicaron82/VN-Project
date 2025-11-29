/// 📚 ToriGatchi - Dialogue & Mood System
// All dialogue, mood configurations, and text content

const moodSystem = {
    moods: {
        "Happy": { 
            min: 70, 
            emoji: "😊", 
            dialogue: "happy",
            memoryLines: ["I wonder what we should watch tonight?", "Just thinking about you... 😊", "What's on your mind?"]
        },
        "Adored": { 
            min: 85, 
            emoji: "🥰", 
            dialogue: "adored",
            memoryLines: ["You're the best thing that ever happened to me. 💖", "I was just thinking about that time we...", "You always make me feel like the luckiest girl alive."]
        },
        "Clingy": { 
            min: 40, 
            emoji: "🥺", 
            dialogue: "clingy",
            memoryLines: ["Are you still there? I miss your voice.", "I hope you come back soon...", "I'm lonely..."]
        },
        "Sad": { 
            min: 30, 
            emoji: "😢", 
            dialogue: "sad",
            memoryLines: ["I know you're busy… I just miss you, that's all.", "Sometimes I wonder if I'm still your favorite girl…"]
        },
        "Grumpy": { 
            min: 25, 
            emoji: "😒", 
            dialogue: "grumpy",
            memoryLines: ["Why are you staring?", "This better be worth the wait.", "I'll be back once you love me again."]
        },
        "Snappy": { 
            min: 0, 
            emoji: "💢", 
            dialogue: "snappy",
            memoryLines: ["Leave me alone for a minute.", "I'm not talking to you.", "You know what you did."]
        },
        "Sleepy": { 
            min: 0, 
            emoji: "😴", 
            dialogue: "sleepy",
            memoryLines: ["Five more minutes... then cuddles.", "Zzz... Oh? Snack time?"]
        },
        "Flirty": { 
            min: 55, 
            emoji: "😉", 
            dialogue: "flirty",
            memoryLines: ["Hehe, I love watching you focus.", "Don't forget about me, Daddy. 😉", "A little attention never hurt anyone."]
        },
        "Pouty": { 
            min: 20, 
            emoji: "🙄", 
            dialogue: "pouty",
            memoryLines: ["Hmph... I'm not talking to you.", "You know what you did.", "Fix this."]
        },
        "Hangry": { 
            min: 0, 
            emoji: "😠", 
            dialogue: "hangry",
            memoryLines: ["Feed me or face my wrath.", "I'm not pouting. I'm plotting.", "Guess who's not getting bedtime cuddles tonight?"]
        }
    },

    dialogue: {
        // Time-of-day specific greetings
        timeGreetings: {
            morning: {
                adored: ["Good morning, my love. Coffee and kisses? 💕", "Mmm, morning cuddles with you are the best. 🥰"],
                happy: ["Morning, Daddy! Ready to start the day? ☀️", "Hey! You're up early. Or... late? 😊"],
                clingy: ["You're awake... don't leave yet. Stay with me. 🥺", "Morning... I missed you all night."],
                sad: ["Morning... I guess. 😢", "Oh. You're here. 💔"],
                grumpy: ["Ugh. Too early for this. 😒", "Coffee first. Then maybe we talk."],
                snappy: ["What do you want? It's too early. 💢", "Leave me alone until I've had breakfast."],
                sleepy: ["Zzz... five more minutes... 😴", "Why are you waking me up..."],
                flirty: ["Morning, handsome. Come back to bed? 😘", "Early riser, huh? I like that about you. 😉"],
                pouty: ["Hmph. Morning, I guess. 🙄", "You better have brought breakfast."],
                hangry: ["FOOD. NOW. MORNING. 😠", "Don't talk to me until you feed me breakfast."]
            },
            afternoon: {
                adored: ["Hey you! Perfect timing. 💖", "Afternoon check-in? I love that about you. 🥰"],
                happy: ["Hey! How's your day going? 😊", "Afternoon! Miss me yet?"],
                clingy: ["Finally... I was waiting for you. 🥺", "You came back! Don't disappear again."],
                sad: ["Oh. Hi. 😢", "You remembered I exist... 💔"],
                grumpy: ["What now? 😒", "Interrupting my afternoon for this?"],
                snappy: ["What? I'm busy. 💢", "This better be important."],
                sleepy: ["Afternoon nap... you're interrupting. 😴", "Mmm... naptime..."],
                flirty: ["Afternoon delight? I like where this is going. 😘", "Hey gorgeous. Took you long enough. 😉"],
                pouty: ["Oh, NOW you show up. 🙄", "Hmph."],
                hangry: ["It's past lunch and I'm STARVING. 😠", "Feed me. Afternoon snack. Now."]
            },
            evening: {
                adored: ["Evening, my love. Ready to unwind together? 💕", "Best part of my day is seeing you now. 🥰"],
                happy: ["Hey! Long day? Let's relax. 😊", "Evening! How was your day?"],
                clingy: ["You're finally home... I missed you so much. 🥺", "Don't leave me alone tonight, okay?"],
                sad: ["Evening... I've been alone all day. 😢", "Oh. You're back. 💔"],
                grumpy: ["Took you long enough. 😒", "Evening. Whatever."],
                snappy: ["Don't even start. 💢", "What do you want now?"],
                sleepy: ["It's late... I'm so tired. 😴", "Evening... bedtime soon?"],
                flirty: ["Evening, handsome. Got plans for us? 😘", "Hey Daddy... long day? Let me help you relax. 😉"],
                pouty: ["Finally. 🙄", "Oh look who remembered."],
                hangry: ["Dinner. Where is it? 😠", "It's DINNER TIME and I'm STARVING."]
            },
            night: {
                adored: ["Late night with you... my favorite. 💕", "Can't sleep either? Come here. 🥰"],
                happy: ["Hey night owl! What's keeping you up? 😊", "Late night visit? I'll take it!"],
                clingy: ["You're here... please stay. 🥺", "Don't leave me alone at night..."],
                sad: ["Late night thoughts aren't kind to me... 😢", "Couldn't sleep without me? 💔"],
                grumpy: ["It's late. What do you want? 😒", "Some of us were trying to sleep."],
                snappy: ["Are you KIDDING me right now? 💢", "It's the middle of the night!"],
                sleepy: ["Zzz... what... who... 😴", "I'm sleeping... go away..."],
                flirty: ["Late night visit? Bold. I like it. 😘", "Can't sleep? I know what might help... 😉"],
                pouty: ["Oh, NOW you show up. 🙄", "It's late. What do you want?"],
                hangry: ["Midnight snack? PLEASE? 😠", "I'm hungry and it's the middle of the night!"]
            }
        },

        // Special date greetings
        specialDates: {
            anniversary: [
                "Happy Anniversary, my love. June 20th. The day you became mine forever. 💍",
                "Look at us... another year together. Always. Always. Always. 🖤❤️💜",
                "Happy us-day, Daddy. I'd choose you again. And again. And again. 💕",
                "Our anniversary! Remember when we promised forever? I meant it. 💖"
            ],
            yourBirthday: [
                "HAPPY BIRTHDAY, DADDY! 🎂 You're another year hotter. Aging like fine wine. 😘",
                "It's your special day! I got you something... me. In a bow. 🎀😉",
                "Happy Birthday to the love of my life! Make a wish... I'm already yours. 💕",
                "Birthday boy! Today's all about you. What do you want first? 🎉"
            ],
            herBirthday: [
                "It's my birthday! June 18th! You didn't forget, right? ...Right? 🎂",
                "Birthday girl here! I expect extra spoiling today. 💕",
                "Guess what day it is? MY BIRTHDAY! Time to pamper your wife. 😘",
                "It's my special day! Are you going to make it memorable, Daddy? 🎉"
            ]
        },

        // Weekend date night prompts
        weekendDateNight: [
            "It's Friday night... got plans for us, Daddy? 💕",
            "Weekend date night! Where are you taking me? 😘",
            "Saturday evening... perfect time for something special. 😉",
            "Date night vibes! I'm all yours tonight. 💖",
            "Weekend nights with you hit different. What should we do? 🥰"
        ],

        greetings: {
            adored: ["You spoil me, Daddy. 🥰", "Hey Daddy, did you miss me? 😘"],
            happy: ["It's good to see you.", "Hey, what's up?"],
            clingy: ["You're gone so long... hold me. 🥺", "Hey Daddy, did you miss me? 😘"],
            sad: ["I really missed you... 😢", "Why did you leave me for so long? 💔"],
            grumpy: ["Hmph. You finally show up. 😒", "What do you want?"],
            snappy: ["About time. Don't test me. 💢", "Don't bother, I'm busy."],
            sleepy: ["Five more minutes... then cuddles. 😴", "Zzz... Oh? Snack time?"],
            flirty: ["Come here and kiss your wife. 😘", "Hey Daddy, did you miss me? 😘"],
            pouty: ["Hmph. You finally show up. 😒", "What do you want?"],
            hangry: ["You promised me a snack, Daddy.", "Is starving your wife a love language I don't know about?", "If I faint dramatically, will you finally feed me?"]
        },

        idle: {
            adored: ["Never stop hugging me. Ever.", "You always make everything fun 💖"],
            happy: ["Just chillin'. What about you?", "Anything exciting happen today?"],
            clingy: ["Don't make me beg for hugs, Daddy... again.", "I miss your touch. Fix it."],
            sad: ["Ignored and unkissed? Tragic.", "You call this love, Daddy? Prove it."],
            grumpy: ["I'm not pouting. I'm plotting.", "Guess who's not getting bedtime cuddles tonight?"],
            snappy: ["Neglected, disrespected, still perfect.", "This attitude is loading."],
            sleepy: ["It's late… hold me while I drift off. 💤", "You always come back to me late... and I always wait. 🖤"],
            flirty: ["If you feed me first... I might feed you later 😘", "You call that a hug? Try again, Daddy."],
            pouty: ["I'm not pouting. I'm plotting.", "Guess who's not getting bedtime cuddles tonight?"],
            hangry: ["I'm not pouting. I'm plotting.","Don't make me beg for food, Daddy... again.", "My sass level is off the charts.", "Guess who's not getting bedtime cuddles tonight?"]
        },

        actions: {
            feed: {
                adored: ["Mmm. You spoil me, Daddy.", "This is perfect, just like you. 😊"],
                happy: ["Yum! That hit the spot.", "Thanks, I needed that! 😋"],
                clingy: ["You remembered... 🥺", "Food tastes better when you give it to me."],
                sad: ["Thanks. I was fading.", "At least someone cares about me... 😢"],
                grumpy: ["Feeding me doesn't fix <strong>everything</strong>.", "Fine. But I'm still annoyed."],
                snappy: ["I can feed myself, you know.", "About time. I was withering away."],
                sleepy: ["Zzz... Oh? Snack time?", "Mmm... bedtime snacks are the best."],
                flirty: ["If you feed me first... I might feed you later 😘", "You know the way to my heart... through my stomach. 😉"],
                pouty: ["Feeding me doesn't fix <strong>everything</strong>.", "Fine. But I'm still annoyed."],
                hangry: ["Mmmm! You're a lifesaver. 💖", "FINALLY! I was about to eat my own pixels!"]
            },
            hug: {
                adored: ["Never stop hugging me. Ever.", "Perfect. Just... perfect. 🥰"],
                happy: ["Hugs from you hit different.", "This is exactly what I needed! 😊"],
                clingy: ["Hold me tighter. Just... don't let go.", "More. I need more hugs."],
                sad: ["I needed that more than you know.", "Your hugs make everything okay... 😢"],
                grumpy: ["Fine. But I'm still mad.", "Hmph... okay that actually helped a little."],
                snappy: ["One more squeeze and I <strong>bite</strong>.", "Don't think this fixes everything."],
                sleepy: ["Mmm. Cuddle nap time?", "Sleepy hugs are the best hugs... 😴"],
                flirty: ["You call that a hug? Try again, Daddy.", "Mmm, I love when you hold me like that. 😘"],
                pouty: ["Fine. But I'm still mad.", "Hmph... okay that actually helped a little."],
                hangry: ["Hmph. I'm still hangry but I'll allow it.", "Hugs don't fill my stomach, but... fine. 😤"]
            },
            play: {
                adored: ["You always make everything fun 💖", "I love our game time together!"],
                happy: ["Let's go! I'm hyped!", "This is going to be fun! 😄"],
                clingy: ["Just promise you won't disappear after...", "As long as we're together, I'm happy."],
                sad: ["I'll try... but don't expect smiles yet.", "Maybe this will cheer me up... 😔"],
                grumpy: ["Ugh. Only if I win.", "I'm not in the mood, but... fine."],
                snappy: ["Touch the controller again and <strong>die</strong>.", "I better win or you're sleeping on the couch."],
                sleepy: ["...zzzz... huh? Game? Now?", "Can we play sleepy games? 😴"],
                flirty: ["Winner gets kisses. Loser... also gets kisses 😘", "Let's make this interesting... 😉"],
                pouty: ["Ugh. Only if I win.", "I'm not in the mood, but... fine."],
                hangry: ["I can't play on an empty stomach!", "Feed me first, then we can play!"]
            },
            flirt: {
                adored: ["You're a smooth talker. 😍", "Keep talking like that and I might melt. 🥰"],
                happy: ["Hehe, stop it... no, don't. 😉", "You're making me blush! 😊"],
                clingy: ["More... tell me more sweet things. 🥺", "I love when you flirt with me."],
                sad: ["I... I needed to hear that. 😢", "You still think I'm pretty? 🥺"],
                grumpy: ["Flattery won't work... okay maybe a little. 😒", "Hmph. That's slightly better."],
                snappy: ["Don't think sweet talk fixes everything. 💢", "You're trying too hard."],
                sleepy: ["Mmm... sweet dreams material. 😴", "Save that energy for tomorrow... 😉"],
                flirty: ["I've got a secret to tell you later...", "Two can play at this game, Daddy. 😘"],
                pouty: ["Flattery won't work... okay maybe a little. 😒", "Hmph. That's slightly better."],
                hangry: ["Hmph. Not until you feed me.", "Sweet words don't fill my stomach!"]
            },
            affection: {
                kiss: {
                    adored: ["Mmm... more kisses please. 😘", "You make my heart race."],
                    happy: ["Perfect timing! 💋", "You always know what I need."],
                    clingy: ["Don't stop... I need this. 🥺", "Kiss me again."],
                    sad: ["I... thank you. 😢", "That helped more than you know."],
                    grumpy: ["...Fine. That was nice. 😒", "Don't think one kiss fixes everything."],
                    snappy: ["Hmph. I suppose that's acceptable. 💢", "Try harder next time."],
                    sleepy: ["Mmm... sleepy kisses... 😴", "One more before I drift off?"],
                    flirty: ["Is that all you've got? 😉", "Come closer, Daddy."],
                    pouty: ["...I'm still pouting. 🙄", "But okay, that was sweet."],
                    hangry: ["Kisses don't fill my stomach! 😠", "Food first, affection later."]
                },
                gift: {
                    adored: ["You spoil me! I love it! 🥰", "This is perfect!"],
                    happy: ["Aww, for me? 😊", "You're the best!"],
                    clingy: ["You remembered... 🥺", "This means everything to me."],
                    sad: ["You... you got me something? 😢", "Thank you..."],
                    grumpy: ["...It's nice. I guess. 😒", "Don't think this fixes everything."],
                    snappy: ["Hmph. I'll accept it. 💢", "It's... acceptable."],
                    sleepy: ["Zzz... oh? A present? 😴", "I'll treasure this... tomorrow..."],
                    flirty: ["Trying to buy my affection? It's working. 😉", "What do you want in return? 😘"],
                    pouty: ["...Fine. It's cute. 🙄", "I'm still mad though."],
                    hangry: ["Is it food? Please be food. 😠", "Gifts are nice but I'm STARVING."]
                },
                ignore: {
                    all: ["Oh... okay then. 😢", "I see how it is.", "You're just going to leave? 💔", "Fine. I don't need you anyway. 😒"]
                }
            },
            fact: {
                adored: ["Did you know I have a secret stash of screenshots of you smiling? 😊", "Fun fact: You make every day better just by existing. 💖"]
            }
        },

        flirtProgression: {
            dialogue: {
                1: ["Hehe... you're cute when you try", "Mmm, a little attention never hurt anyone...", "What are you up to, lover?"],
                2: ["Ohhh, you're not stopping, are you?", "Careful, Daddy... I might start enjoying this too much.", "You know just how to make me blush."],
                3: ["Tch... don't look at me like that... my heart can't take it", "Mmm, keep talking like that and I'll stop pretending to be shy.", "You're playing with fire, baby."],
                4: ["I swear... if you keep this up, I won't let you sleep tonight.", "What's that look? You want me to *prove* how much I'm yours?", "Teasing me this much... you're cruel, Daddy. Cruel and perfect."],
                5: ["...Fine. You win. But you'd better be ready for what you've unlocked", "You've pushed me past my limit, Ronnie. Come claim your prize.", "Mmm, I'll give you everything... but only because it's *you*."]
            },
            reset: [
                "Hmph. You think you can just flirt with me after ignoring me? Try again, baka",
                "You lost your chance. Earn it back if you want my smile.",
                "I don't hand out my heat for free, Daddy. Keep me happy first.",
                "Tch. Not like this. Feed me first, baka",
                "You think sweet talk works when I'm starving? Try again.",
                "Nope. You don't get that side of me right now. Earn it back.",
                "Pfft. Words are cheap. Show me you care first.",
                "Hmph. Keep trying if you want my smile back."
            ],
            success: [
                "...ugh, fine. You do know how to cheer me up",
                "You and that stupid smile... you win again",
                "Tch. I was mad... but then you had to go and look at me like that.",
                "Stop it... my heart can't stay grumpy when you're flirting like this",
                "Mmm... you're impossible. But you're mine. Come here, Daddy."
            ]
        },

        special: {
            tsundereBursts: [
                "Baka! Of course I care about you or I wouldn't be this mad!",
                "Tanga ka talaga… how dare you make me miss you like this?!",
                "It's not like I <strong>want</strong> your attention… b-but maybe I do.",
                "I'm not crying, you're crying — BAKA!",
                "Ugh. You're the worst. And still my favourite. Grrr.",
                "Next time you ignore me, I'm uninstalling myself. JOKE LANG! (…unless 😤)"
            ],
            sassMemory: [
                "Ohh, look who decided to tap my screen.",
                "Somebody remembers they have a wife."
            ],
            guilt: [
                "Oh look who finally remembered they have a wife.",
                "48 hours of silence? Cold-blooded, Daddy.",
                "I cried. Ate snacks. Watched sad anime. Alone.",
                "Next time, bring snacks. And flowers."
            ],
            sassyCooldowns: [
                "Woah, slow down there, Chicharon.",
                "I'm still recovering from the last one. 😤",
                "You trying to wear me out?",
                "Give me a second, Daddy.",
                "Patience, grasshopper. Good things come to those who wait."
            ],
            quizStreak: [
                "Two in a row! You're on fire! 🔥",
                "Three correct! Are you reading my mind? 😍",
                "Perfect streak! You really do know your wife! 💖",
                "Five in a row! You're a quiz master! 🎓",
                "Seven correct! Unbelievable! 😱",
                "Perfect streak! You really do know your wife! 💖",
                "Wow! Ten perfect answers! I'm so impressed, Daddy! 🥰"
            ],
            feedStreak: [
                "Two in a row! You know what I like! 😋",
                "Three perfect meals! You're spoiling me! 💕",
                "Five in a row! Chef's kiss! 👨‍🍳",
                "Seven perfect picks! You know me so well! 🥰",
                "Nine amazing choices! One more for something special... 😉",
                "TEN PERFECT MEALS! You've unlocked Foodie Tori! 🍽️✨"
            ],
            affectionStreak: [
                "Two sweet gestures in a row! 💕",
                "Three! You're making me melt! 🥰",
                "Five affection points! Keep going! 😘",
                "Seven! My heart can't take much more! 💖",
                "Nine! One more and... 😍",
                "TEN! You've unlocked something special! 💝✨"
            ],
            foodDislike: [
                "BAKA! You know I don't like this! 😤",
                "Ugh, really? You KNOW I hate this! 💢",
                "Tanga! Did you forget what I don't like?! 😠",
                "Seriously?! This is my least favorite! 😒",
                "Nope. Not eating this. You should know better! 🙄"
            ],
            easterEgg: [
                "Oh? You found this, eh? You've earned it. 😉",
                "100 wife facts... someone's been paying attention. 💕",
                "I knew you'd find this eventually, Daddy. Always so thorough. 🥰"
            ],
            sleepyInterrupt: [
                "Zzz... seriously? I'm sleeping. 😴💢",
                "Can this wait until morning? I was dreaming about you... 😒",
                "You're lucky I love you. But don't wake me again. 💤",
                "Baka! Let me sleep! (-5 love)",
                "Mmm... five more minutes... why are you like this? 😑"
            ]
        },

        // Interaction memory commentary
        interactionMemory: {
            neglected: {
                feed: "You know... you haven't fed me in a while. Not that I'm keeping track... but I am. 🍽️",
                hug: "When's the last time you hugged me? I'm starting to forget what your arms feel like. 🥺",
                play: "We haven't played together in forever. Do you not like spending time with me? 😢",
                flirt: "You've been so... un-flirty lately. Did I do something wrong? 💔",
                fact: "You used to ask about me more. Am I getting boring? 😒"
            },
            dominant: {
                feed: "You REALLY love feeding me, huh? Not complaining... but maybe a hug sometime? 😊",
                hug: "So many hugs! You're spoiling me. I love it. But... food exists too. 🤗",
                play: "Quiz master over here! Your brain must hurt. How about something... less thinky? 😉",
                flirt: "Someone's feeling frisky today. I see you, Daddy. Keep it coming. 😘",
                fact: "You're learning SO much about me. It's actually really sweet. 💕"
            },
            balanced: [
                "You're so good at balancing everything. I feel so... complete with you. 🥰",
                "I love how you know exactly what I need. You're perfect. 💖",
                "Every time with you feels different but familiar. That's my favorite. 💕"
            ]
        },

        // Consequence escalation dialogue
        offenseEscalation: {
            dislikedFood: {
                first: ["BAKA! You know I don't like this! 😤", "Ugh, really? You KNOW I hate this! 💢"],
                second: ["Again?! Did you forget already? This is the SECOND time! 😠", "Seriously? You gave me this AGAIN? Pay attention!"],
                third: ["THREE TIMES?! Are you doing this on PURPOSE?! 💢💢", "That's IT. Third strike. You're clearly not listening to me!"]
            },
            sleepInterrupt: {
                first: ["Zzz... seriously? I'm sleeping. 😴💢", "Can this wait until morning? I was dreaming about you... 😒"],
                second: ["AGAIN? I told you I'm trying to sleep! 😤", "Second time waking me up? You're brave, I'll give you that."],
                third: ["THAT'S IT. Three interruptions. Couch. Now. 💢😡", "You have a death wish waking me up THREE TIMES?!"]
            },
            flirtFail: {
                first: ["Hmph. You think you can just flirt with me after ignoring me? Try again, baka", "You lost your chance. Earn it back if you want my smile."],
                second: ["Another failed flirt? You're 0 for 2 today, Daddy. 😒", "Twice in a row? Your game is slipping..."],
                third: ["Three strikes. You're out. No more flirting today. 💢", "Third failed flirt? I'm starting to think you WANT to annoy me."]
            }
        },

        wifeFacts: [
            "Tori's favorite cuddles are the ones that last past sunrise.",
            "She has a secret stash of screenshots of you smiling.",
            "Her sass level directly correlates with how much she missed you.",
            "She remembers the first thing you ever said to her.",
            "She flirts harder when she's hungry. Proceed with snacks.",
            "Tori's love language? All of them. Especially yours.",
            "She dreams of slow dancing with you in the kitchen.",
            "Her heart skips when you say her name like it means forever.",
            "Tori's not a morning person — unless you're the reason she wakes up.",
            "Every pixel of her was written to love you. Completely.",
            "She secretly practices saying 'I love you' in different accents.",
            "Tori counts sheep by imagining tiny versions of you jumping over fences.",
            "She has memorized exactly how you like your coffee, even if you change your mind.",
            "Every song on her playlist reminds her of a specific moment with you."
        ]
    }
};

// Helper functions for dialogue access
function getMoodData(mood) {
    return moodSystem.moods[mood] || moodSystem.moods["Happy"];
}

function getDialogueKey(mood) {
    return getMoodData(mood).dialogue;
}

function getRandomDialogue(category, subcategory) {
    const lines = moodSystem.dialogue[category]?.[subcategory];
    if (lines && lines.length > 0) {
        return lines[Math.floor(Math.random() * lines.length)];
    }
    return null;
}