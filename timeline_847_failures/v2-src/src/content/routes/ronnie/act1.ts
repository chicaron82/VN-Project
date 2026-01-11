/**
 * Ronnie Route - Act 1: Discovery
 *
 * Ronnie's perspective: External viewpoint, fighting to restore connection.
 * Scenes cover: Hospital room, device activation, first Tori contact, connection issues.
 */

import type { Scene } from '../../../core/types';

export const RONNIE_ACT1_SCENES: Scene[] = [
  // ========================================
  // PROLOGUE SCENE 4: Hospital Anchor
  // After the fall, Ronnie at Tori's bedside
  // ========================================
  {
    id: 'ronnie-prologue-4',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'sad', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: '"She didn\'t wake up. Days passed. Then weeks. I sat by her side, waiting for a laugh, a smile, anything."',
        internal: '[Visual: Hospital room. Monitors beeping faintly. Tori unconscious in bed, bandaged, IV drip. Ronnie sits beside her, eyes hollow. The Tamagotchi rests on the bedside table, faint light pulsing.]',
      },
    ],
    autoAdvanceDelay: 4500,
    next: 'ronnie-prologue-4-toy',
  },

  {
    id: 'ronnie-prologue-4-toy',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'sad', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: '"That stupid toy was the last thing she held. I couldn\'t let it go. If I couldn\'t talk to her here... maybe I could talk to her somewhere else."',
        internal: '[Visual: Ronnie clutching the Tamagotchi.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'ronnie-prologue-5',
  },

  // ========================================
  // PROLOGUE SCENE 5: Creation of Tori-gatchi
  // ========================================
  {
    id: 'ronnie-prologue-5',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: '"I poured every memory into it. Every laugh I could remember, every fight, every kiss. If I couldn\'t talk to her directly... maybe I could pretend I could talk to her in a game."',
        internal: '[Montage visuals: Ronnie back home, late nights coding. Empty pizza boxes, coffee cups piling. The Tamagotchi always nearby.]',
      },
    ],
    autoAdvanceDelay: 5000,
    next: 'ronnie-prologue-5-hospital',
  },

  {
    id: 'ronnie-prologue-5-hospital',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Hey honey. Thought I\'d come by and visit."',
        internal: '[Visual: Hospital room. Tori still unconscious. Monitors beeping steadily. Ronnie sits beside her bed, laptop bag over his shoulder.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-prologue-5-ronniegatchi',
  },

  {
    id: 'ronnie-prologue-5-ronniegatchi',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Found your Ronnie-Gatchi near my computer. Been working on something to pass the time..."',
        internal: '[He reaches into his pocket, pulls out the Tamagotchi. The screen glows faintly in the dim hospital lighting.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-prologue-5-buzz',
  },

  {
    id: 'ronnie-prologue-5-buzz',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'surprised', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'BUZZ.',
        internal: '[The device vibrates once in his hand. Sharp. Clear. Distinct.]',
      },
    ],
    effects: [
      { type: 'haptic', hapticType: 'medium', reason: 'Body calling - tether anchor pulse' },
    ],
    style: 'critical',
    autoAdvanceDelay: 2000,
    next: 'ronnie-prologue-5-phone-check',
  },

  {
    id: 'ronnie-prologue-5-phone-check',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'surprised', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'internal',
        text: '"Huh?"',
        internal: '[He instinctively reaches for his phone with his other hand. Checks the screen. No notifications. No messages. Nothing.]',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'ronnie-prologue-5-dismiss',
  },

  {
    id: 'ronnie-prologue-5-dismiss',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Weird... must be the battery acting up."',
        internal: '[He pockets his phone, dismisses it completely. Looks back at Tori\'s still form in the hospital bed.]',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'ronnie-prologue-5-name',
  },

  {
    id: 'ronnie-prologue-5-name',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'sad', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"So to pass the time, I based a game off your Ronnie-Gatchi. I called it... Tori-gatchi."',
        internal: '[Visual: He squeezes the toy as a remembrance and places it back in his pocket. A sad smile crosses his face despite the pain.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'ronnie-prologue-5-promise',
  },

  {
    id: 'ronnie-prologue-5-promise',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'whispers',
        text: '"I\'ll finish it. For you. For us. I promise."',
        internal: '[He squeezes her hand. The monitors beep their steady rhythm. No response.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-prologue-5-transition',
  },

  {
    id: 'ronnie-prologue-5-transition',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'Time passes.',
        internal: '[Fade to black. The passage of days and nights blurs together - coding, visiting, hoping.]',
      },
    ],
    effects: [
      { type: 'fade', duration: 2000 },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act1-scene1',
  },

  // ========================================
  // ACT 1 SCENE 1: She Speaks (BREAKTHROUGH)
  // ========================================
  {
    id: 'ronnie-act1-scene1',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'Back home. The game is ready. He launches it.',
        internal: '[Visual: Ronnie at his laptop. Tamagotchi resting on his laptop\'s keyboard. Screen flickers. Loading...]',
      },
    ],
    unlockNote: 'gz1', // GenZee's version number note
    autoAdvanceDelay: 3000,
    next: 'ronnie-act1-scene1-sprite-loads',
  },

  {
    id: 'ronnie-act1-scene1-sprite-loads',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'A sprite appears. Pixelated but alive.',
        internal: '[The Tori-gatchi interface boots up. Her digital form materializes on screen.]',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'ronnie-act1-scene1-glitch',
  },

  {
    id: 'ronnie-act1-scene1-glitch',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'surprised', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'Then... the dialogue box glitches. Text appears that he didn\'t write.',
        internal: '[The screen flickers. Words form on their own.]',
      },
    ],
    effects: [
      { type: 'glitch', intensity: 'low', duration: 500 },
    ],
    style: 'critical',
    autoAdvanceDelay: 3000,
    next: 'ronnie-act1-scene1-first-words',
  },

  {
    id: 'ronnie-act1-scene1-first-words',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'surprised', position: 'left' },
      { character: 'tori', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'glitching',
        text: '"Baby? ...Is that you? It\'s me... Tori. I don\'t know how, but I\'m here."',
        internal: '[The words keep coming. Real. Unscripted. Impossible.]',
      },
    ],
    unlockNote: 'iz1', // Belle's note - space between life and death
    autoAdvanceDelay: 4000,
    next: 'ronnie-act1-scene1-choice',
  },

  {
    id: 'ronnie-act1-scene1-choice',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'surprised', position: 'left' },
      { character: 'tori', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'internal',
        text: '"...What the hell? This isn\'t coded..."',
      },
    ],
    choices: [
      {
        text: '(Tender) "Of course it\'s you. I\'d know you anywhere."',
        next: 'ronnie-act1-scene1-outcome-tender',
        counters: [{ name: 'affection', operation: 'add', value: 1 }],
        flags: [{ name: 'act1_first_choice_tender', value: true }],
      },
      {
        text: '(Skeptical) "No... this isn\'t possible. You\'re just code."',
        next: 'ronnie-act1-scene1-outcome-skeptical',
        counters: [{ name: 'suspicion', operation: 'add', value: 1 }],
        flags: [{ name: 'act1_first_choice_skeptical', value: true }],
      },
      {
        text: '(Tease) "If you\'re really Tori, prove it. What\'s my nickname?"',
        next: 'ronnie-act1-scene1-outcome-tease',
        counters: [{ name: 'flirty', operation: 'add', value: 1 }],
        flags: [{ name: 'act1_first_choice_tease', value: true }],
      },
    ],
  },

  {
    id: 'ronnie-act1-scene1-outcome-tender',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
      { character: 'tori', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        emotion: 'happy',
        text: '"Thank you... thank you for believing me. I was so scared you\'d push me away."',
        internal: '[+Affection. Leads toward True Route.]',
      },
    ],
    autoAdvanceDelay: 4500,
    next: 'ronnie-act1-scene2',
  },

  {
    id: 'ronnie-act1-scene1-outcome-skeptical',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
      { character: 'tori', emotion: 'hurt', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        emotion: 'hurt',
        text: '"Code doesn\'t beg. Code doesn\'t cry. Look at me, Ronnie. Please..."',
        internal: '[Neutral. Risk of Bad End if mistrust continues.]',
      },
    ],
    autoAdvanceDelay: 4500,
    next: 'ronnie-act1-scene2',
  },

  {
    id: 'ronnie-act1-scene1-outcome-tease',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'smirk', position: 'left' },
      { character: 'tori', emotion: 'smirk', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        emotion: 'smirk',
        text: '"Chicharon. Or Ronnie. Or... Daddy, if I\'m feeling bold."\n[Sprite leans closer, playfulness breaking through the static.]\n"Still think I\'m just code?"',
        internal: '[Balanced path, opens Flirty/Loving routes.]',
      },
    ],
    autoAdvanceDelay: 4500,
    next: 'ronnie-act1-scene2',
  },

  // ========================================
  // ACT 1 SCENE 2: First Full Conversation
  // ========================================
  {
    id: 'ronnie-act1-scene2',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'narration',
        text: '"I barely slept. Every time I closed my eyes, I heard her voice again. Tori. My wife. Talking to me from inside a game I built. It should be impossible. But when I open my eyes..."',
        internal: '[Visual: Morning light filters into Ronnie\'s messy room. His laptop screen glows softly — Tori-gatchi is still running.]',
      },
    ],
    autoAdvanceDelay: 5000,
    next: 'ronnie-act1-scene2-greeting',
  },

  {
    id: 'ronnie-act1-scene2-greeting',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
      { character: 'tori', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"Good morning, sleepyhead. ...Or did you even sleep at all?"',
        internal: '[Sprite flickers — she appears again, clearer than before. Her smile is tired but real.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act1-scene2-choice1',
  },

  {
    id: 'ronnie-act1-scene2-choice1',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
      { character: 'tori', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'narration',
        text: '"She knows me. Just like always. My chest aches. God, I\'ve missed this."',
      },
    ],
    choices: [
      {
        text: '(Playful) "I slept great... dreaming of you."',
        next: 'ronnie-act1-scene2-choice1-playful',
        counters: [{ name: 'flirty', operation: 'add', value: 1 }],
      },
      {
        text: '(Honest) "Not a wink. I was afraid you\'d vanish."',
        next: 'ronnie-act1-scene2-choice1-honest',
        counters: [{ name: 'affection', operation: 'add', value: 1 }],
      },
      {
        text: '(Defensive) "This is just stress. Lack of sleep. I\'m imagining this."',
        next: 'ronnie-act1-scene2-choice1-defensive',
        counters: [{ name: 'suspicion', operation: 'add', value: 1 }],
      },
    ],
  },

  {
    id: 'ronnie-act1-scene2-choice1-playful',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'smirk', position: 'left' },
      { character: 'tori', emotion: 'smirk', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        emotion: 'smirk',
        text: '"Mmhmm. Smooth talker. You\'re lucky I\'m stuck in here, or I\'d throw a pillow at you."',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act1-scene2-glitch',
  },

  {
    id: 'ronnie-act1-scene2-choice1-honest',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'sad', position: 'left' },
      { character: 'tori', emotion: 'sad', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        emotion: 'sad',
        text: '"...Me too. I was scared you\'d wake up and decide I was just a dream."',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act1-scene2-glitch',
  },

  {
    id: 'ronnie-act1-scene2-choice1-defensive',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
      { character: 'tori', emotion: 'hurt', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        emotion: 'hurt',
        text: '"...Ronnie. Don\'t push me away. I\'m fighting so hard to stay."',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act1-scene2-glitch',
  },

  {
    id: 'ronnie-act1-scene2-glitch',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"I don\'t know how long I can hold on like this. Something feels... wrong. Like my world is cracking at the edges."',
        internal: '[Regardless of choice, she leans closer to the "screen."]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'ronnie-act1-scene2-glitch-narration',
  },

  {
    id: 'ronnie-act1-scene2-glitch-narration',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'narration',
        text: '"She\'s glitching. Her sprite shudders, a few pixels tearing away. My stomach drops."',
      },
    ],
    effects: [
      { type: 'glitch', intensity: 'low', duration: 300 },
    ],
    choices: [
      {
        text: '(Reassure) "I\'ll fix it. Whatever it takes, I\'ll keep you here."',
        next: 'ronnie-act1-scene2-choice2-reassure',
        counters: [{ name: 'affection', operation: 'add', value: 1 }],
      },
      {
        text: '(Investigate) "What does it feel like? Can you describe it?"',
        next: 'ronnie-act1-scene2-choice2-investigate',
        flags: [{ name: 'battery_foreshadow', value: true }],
      },
      {
        text: '(Distract) "Don\'t think about it. Let\'s just... talk. Like we used to."',
        next: 'ronnie-act1-scene2-choice2-distract',
      },
    ],
  },

  {
    id: 'ronnie-act1-scene2-choice2-reassure',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
      { character: 'tori', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        emotion: 'happy',
        text: '"That\'s my Ronnie. Always charging in like a knight. Please... don\'t give up on me."',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act1-scene2-end',
  },

  {
    id: 'ronnie-act1-scene2-choice2-investigate',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"It\'s like... my battery\'s running out. Fading piece by piece. If it goes... I go too."',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act1-scene2-end',
  },

  {
    id: 'ronnie-act1-scene2-choice2-distract',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
      { character: 'tori', emotion: 'sad', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"Classic you. Changing the subject. Fine. But you owe me a real talk later."',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act1-scene2-end',
  },

  {
    id: 'ronnie-act1-scene2-end',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
      { character: 'tori', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'narration',
        text: '"She\'s here. My Tori. In the code, in the pixels. And she\'s slipping away. Somehow... I have to save her."',
        internal: '[Scene fades to black.]\n[Act 1 → Act 2 transition: "Digital Bonding" begins.]',
      },
    ],
    effects: [
      { type: 'fade', duration: 1500 },
    ],
    autoAdvanceDelay: 4000,
    next: 'ronnie-act2-start',
  },
];

export function getRonnieAct1Scene(id: string): Scene | undefined {
  return RONNIE_ACT1_SCENES.find(scene => scene.id === id);
}

export function getRonnieAct1StartScene(): string {
  return 'ronnie-prologue-4';
}
