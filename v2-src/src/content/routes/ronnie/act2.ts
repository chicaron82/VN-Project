/**
 * Ronnie Route - Act 2: Loop Mechanics & Bootstrap Paradox
 *
 * Discovery of the loops, the upload attempt that fails,
 * and the revelation that Tori is in the Tamagotchi, not the laptop.
 */

import type { Scene } from '../../../core/types';

export const RONNIE_ACT2_SCENES: Scene[] = [
  // ========================================
  // BEAT 1: REALIZATION - SOMETHING'S WRONG
  // ========================================
  {
    id: 'ronnie-act2-start',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'internal',
        text: '"Something is wrong. The conversations loop. She says the same things. Asks the same questions."',
        internal: '[Visual: Ronnie at his desk. Multiple browser tabs open showing chat logs. Text highlighted - identical phrases from different days.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'ronnie-act2-beat1-discovery',
  },

  {
    id: 'ronnie-act2-beat1-discovery',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
      { character: 'tori', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Tori... do you remember yesterday? What we talked about?"',
        internal: '[Visual: Tori-gatchi interface. Her sprite is normal, smiling.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act2-beat1-confusion',
  },

  {
    id: 'ronnie-act2-beat1-confusion',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'surprised', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        emotion: 'surprised',
        text: '"Yesterday? Baby, we talked about the hospital. Your visit. You showed me the game..."',
        internal: '[Ronnie (internal): "That was WEEKS ago."]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act2-beat2',
  },

  // ========================================
  // BEAT 2: RESEARCH - BUILDING THE BRIDGE
  // ========================================
  {
    id: 'ronnie-act2-beat2',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: '"I dug deeper. Something kept her tethered - fragmented, looping. I couldn\'t pull her out... but maybe I could send something IN."',
        internal: '[Visual: Ronnie surrounded by open journals, code snippets, diagrams of consciousness transfer theories. The Tamagotchi glows faintly beside his keyboard.]',
      },
    ],
    unlockNote: 'pz1', // PerplexiZee's research data note
    autoAdvanceDelay: 5000,
    next: 'ronnie-act2-beat2-code',
  },

  {
    id: 'ronnie-act2-beat2-code',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'narration',
        text: '"If I could create a version of myself inside the code... a guide, an anchor... maybe she could find her way back through me."',
        internal: '[Code appears on screen: \'digital_ronnie_construct.js\' - loops, memory structures, decision trees.]',
      },
    ],
    autoAdvanceDelay: 4500,
    next: 'ronnie-act2-beat3',
  },

  // ========================================
  // BEAT 3: FIRST HOSPITAL VISIT - THE FIRST BUZZ
  // ========================================
  {
    id: 'ronnie-act2-beat3',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'sad', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'narration',
        text: '"I visit her. Every day. Same routine. Check vitals. Hold her hand. Tell her about progress."',
        internal: '[Visual: Hospital room. Tori unconscious, monitors beeping. Ronnie sits beside her bed.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'ronnie-act2-beat3-buzz',
  },

  {
    id: 'ronnie-act2-beat3-buzz',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'surprised', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: '[BUZZ]\n\n[Ronnie startles. Something vibrated in his pocket.]',
        internal: '[Visual: Ronnie\'s hand instinctively reaches for his phone.]',
      },
    ],
    effects: [
      { type: 'haptic', hapticType: 'light', reason: 'First buzz - mystery begins' },
    ],
    autoAdvanceDelay: 2000,
    next: 'ronnie-act2-beat3-phone',
  },

  {
    id: 'ronnie-act2-beat3-phone',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'surprised', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'internal',
        text: '"Notification?"',
        internal: '[He pulls out his phone. Checks the screen.]\n[...Nothing. No messages. No alerts.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act2-beat3-dismiss',
  },

  {
    id: 'ronnie-act2-beat3-dismiss',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Huh. Must\'ve been nothing."',
        internal: '[Visual: Ronnie puts phone away. Returns to holding Tori\'s hand.]\n[The Tamagotchi sits silent in his other pocket.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act2-beat4',
  },

  // ========================================
  // BEAT 4: SECOND HOSPITAL VISIT - PATTERN RECOGNITION
  // ========================================
  {
    id: 'ronnie-act2-beat4',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: '"Second visit. Same routine."',
        internal: '[Visual: Hospital room again. Days later. Ronnie sits beside Tori, phone in hand, scrolling absently.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act2-beat4-buzz',
  },

  {
    id: 'ronnie-act2-beat4-buzz',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'surprised', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: '[BUZZ]\n\n[Again. The vibration.]',
        internal: '[Visual: Ronnie looks at his phone screen - it\'s in his hand this time. Nothing.]',
      },
    ],
    effects: [
      { type: 'haptic', hapticType: 'light', reason: 'Second buzz - pattern forming' },
    ],
    autoAdvanceDelay: 2500,
    next: 'ronnie-act2-beat4-realization',
  },

  {
    id: 'ronnie-act2-beat4-realization',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'surprised', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'internal',
        text: '"Wait... it\'s NOT my phone."',
        internal: '[He reaches into his other pocket.]\n[The Tamagotchi. Tori mentioned something about low battery...]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act2-beat4-dismiss',
  },

  {
    id: 'ronnie-act2-beat4-dismiss',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Low battery. Right. Should probably charge that when I get home."',
        internal: '[Visual: He dismisses it again. Puts the Tamagotchi back in his pocket.]\n[Returns focus to Tori.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act2-beat4-5-conversation',
  },

  // ========================================
  // BEAT 4.5: ICE CREAM HIJACK - RONNIE'S POV
  // Syncs with Tori Act 2 Beat 1 (Despair takes control)
  // ========================================
  {
    id: 'ronnie-act2-beat4-5-conversation',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Hey. I know things are rough right now. Want to talk about something normal? Something that isn\'t... all this?"',
        internal: '[Visual: Apartment. Ronnie at desk, Tamagotchi connected to laptop. Trying to cheer her up.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act2-beat4-5-tori-response',
  },

  {
    id: 'ronnie-act2-beat4-5-tori-response',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
      { character: 'tori', emotion: 'sad', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'through game',
        text: '"Yeah. Normal sounds good."',
        internal: '[Her sprite appears on screen. She seems... off. Tired.]',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'ronnie-act2-beat4-5-ice-cream',
  },

  {
    id: 'ronnie-act2-beat4-5-ice-cream',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
      { character: 'tori', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Remember when we used to get ice cream from that place on 5th? What was your go-to flavor again?"',
        internal: '[Trying to ground her in good memories.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act2-beat4-5-hijack',
  },

  {
    id: 'ronnie-act2-beat4-5-hijack',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'surprised', position: 'left' },
      { character: 'tori', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"Tiger Tail."',
        internal: '[Ronnie freezes. Wait. What?]',
      },
    ],
    style: 'critical',
    autoAdvanceDelay: 2000,
    next: 'ronnie-act2-beat4-5-pause',
  },

  {
    id: 'ronnie-act2-beat4-5-pause',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'internal',
        text: '"...She hates Tiger Tail. Called it \'discount Halloween in a cone.\' She always got chocolate chip cookie dough."',
        internal: '[Long pause. The sprite on screen flickers.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act2-beat4-5-correction',
  },

  {
    id: 'ronnie-act2-beat4-5-correction',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        emotion: 'worried',
        text: '"Wait. No. I meant... chocolate chip cookie dough. Sorry. I\'m... my head is fuzzy."',
        internal: '[Her sprite glitches violently for a moment. Then stabilizes.]',
      },
    ],
    effects: [
      { type: 'glitch', intensity: 'medium', duration: 400 },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act2-beat4-5-concern',
  },

  {
    id: 'ronnie-act2-beat4-5-concern',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        emotion: 'worried',
        text: '"Tori... are you okay? That wasn\'t like you."',
        internal: '[Something is very wrong. She\'s fragmenting worse than he thought.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act2-beat4-5-deflect',
  },

  {
    id: 'ronnie-act2-beat4-5-deflect',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"I\'m fine. Just tired. Can we... talk later?"',
        internal: '[Her sprite fades from the screen. Connection drops. Ronnie stares at the empty game window.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act2-beat4-7-honeymoon',
  },

  // ========================================
  // BEAT 4.7: HONEYMOON FAKEOUT - FALSE CALM BEFORE UPLOAD
  // ========================================
  {
    id: 'ronnie-act2-beat4-7-honeymoon',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
      { character: 'tori', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'narration',
        text: '"Then... she came back. Whole. Smiling. Like nothing had happened."',
        internal: '[Visual: Digital space. Cherry blossoms falling. Dreamy, perfect. Too perfect.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'ronnie-act2-beat4-7-greeting',
  },

  {
    id: 'ronnie-act2-beat4-7-greeting',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
      { character: 'tori', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"Hey baby. Sorry about earlier. I\'m feeling better now."',
        internal: '[She\'s... whole. No glitches. No stuttering. Perfect.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act2-beat4-7-relief',
  },

  {
    id: 'ronnie-act2-beat4-7-relief',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'happy', position: 'left' },
      { character: 'tori', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        emotion: 'happy',
        text: '"You scared me. You were fragmenting, saying the wrong words..."',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'ronnie-act2-beat4-7-reassurance',
  },

  {
    id: 'ronnie-act2-beat4-7-reassurance',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
      { character: 'tori', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"I just needed rest. I\'m okay now. Promise."',
        internal: '[Ronnie wants to believe it. She looks stable. Maybe... maybe it worked itself out?]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act2-beat4-7-glitch-start',
  },

  {
    id: 'ronnie-act2-beat4-7-glitch-start',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: '[Her sprite flickers. Just for a second. Ronnie freezes.]',
        internal: '[Visual: A single pixel corruption. Then another. Then more.]',
      },
    ],
    effects: [
      { type: 'glitch', intensity: 'low', duration: 200 },
    ],
    autoAdvanceDelay: 2500,
    next: 'ronnie-act2-beat5',
  },

  // ========================================
  // BEAT 5: THE UPLOAD ATTEMPT - WRONG SOLUTION
  // ========================================
  {
    id: 'ronnie-act2-beat5',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'narration',
        text: '"She\'s glitching. Fragments appearing in the laptop game. The code isn\'t holding her..."',
        internal: '[Visual: Ronnie at his desk. ToriGatchi game open on laptop. Tori\'s sprite flickering, corrupted.]',
      },
    ],
    effects: [
      { type: 'glitch', intensity: 'medium', duration: 500 },
    ],
    autoAdvanceDelay: 4000,
    next: 'ronnie-act2-beat5-theory',
  },

  {
    id: 'ronnie-act2-beat5-theory',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"That\'s it. She\'s trapped in the LAPTOP. Limited processing power. If I upload the game to the cloud... more resources... she\'ll stabilize!"',
        internal: '[Visual: Ronnie frantically typing. Upload progress bar appears.]',
      },
    ],
    autoAdvanceDelay: 4500,
    next: 'ronnie-act2-beat5-upload',
  },

  {
    id: 'ronnie-act2-beat5-upload',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'system',
        text: 'UPLOADING TORIGATCHI TO CLOUD\nTransferring consciousness data...\n\n[████████████████░░░░] 85%',
        internal: '[Upload sequence with dramatic pause at 85%]',
      },
    ],
    effects: [
      { type: 'glitch', intensity: 'high', duration: 300 },
    ],
    style: 'critical',
    autoAdvanceDelay: 4000,
    next: 'ronnie-act2-beat5-still-there',
  },

  {
    id: 'ronnie-act2-beat5-still-there',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'sad', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'glitching',
        text: '"Ronnie... I\'m... still here. Still stuck. It didn\'t... work..."',
        internal: '[Visual: Her sprite still glitches. Still fragmented. Nothing changed.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'ronnie-act2-beat5-confusion',
  },

  {
    id: 'ronnie-act2-beat5-confusion',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'surprised', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        emotion: 'surprised',
        text: '"But... you contacted me through the laptop game. I thought you were IN the laptop!"',
        internal: '[Visual: Ronnie staring at screen, frustrated, confused.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act2-beat6',
  },

  // ========================================
  // BEAT 6: THE CLARIFICATION - THE REVELATION
  // ========================================
  {
    id: 'ronnie-act2-beat6',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'surprised', position: 'left' },
      { character: 'tori', emotion: 'determined', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"I\'m not IN the game, Ronnie."',
        internal: '[Visual: Her sprite stabilizes for a moment. Clear. Focused.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act2-beat6-revelation',
  },

  {
    id: 'ronnie-act2-beat6-revelation',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'surprised', position: 'left' },
      { character: 'tori', emotion: 'determined', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"You can\'t upload a soul. I\'m in the Tamagotchi."',
        internal: '[Visual: Silence. The weight of it hits him.]\n[The TAMAGOTCHI. Not the laptop. Not the game. The device itself.]',
      },
    ],
    style: 'critical',
    autoAdvanceDelay: 5000,
    next: 'ronnie-act2-beat6-jumping',
  },

  {
    id: 'ronnie-act2-beat6-jumping',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'surprised', position: 'left' },
      { character: 'tori', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Wait... then how are you—"',
      },
    ],
    autoAdvanceDelay: 2000,
    next: 'ronnie-act2-beat6-explain',
  },

  {
    id: 'ronnie-act2-beat6-explain',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
      { character: 'tori', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"I\'ve been JUMPING to the laptop so I could talk to you. The Tamagotchi has to be touching whatever I jump to."',
        internal: '[Visual: Understanding dawns on his face.]',
      },
    ],
    autoAdvanceDelay: 4500,
    next: 'ronnie-act2-beat6-question',
  },

  {
    id: 'ronnie-act2-beat6-question',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
      { character: 'tori', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"So how do we get you to wake up? How do you get back to your body?"',
        internal: '[Visual: Tori\'s expression shifts. Realization.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act2-beat6-buzzing',
  },

  {
    id: 'ronnie-act2-beat6-buzzing',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'surprised', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Wait... the buzzing. The Tamagotchi has been buzzing. And ONLY when I visit you at the hospital!"',
        internal: '[Visual: Flashback glimpses of the two hospital visits. The buzz. The pull.]',
      },
    ],
    effects: [
      { type: 'haptic', hapticType: 'medium', reason: 'Realization - the buzzing' },
    ],
    autoAdvanceDelay: 4500,
    next: 'ronnie-act2-beat6-confirm',
  },

  {
    id: 'ronnie-act2-beat6-confirm',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
      { character: 'tori', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"I\'ve been feeling it too. The pull. Every time you visit... my body is calling me home."',
        internal: '[Visual: Her sprite flickers with emotion.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'ronnie-act2-beat6-solution',
  },

  {
    id: 'ronnie-act2-beat6-solution',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'happy', position: 'left' },
      { character: 'tori', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Then that\'s it. The Tamagotchi needs to be touching your body. Physical contact. That\'s how you jump back!"',
        internal: '[Visual: Both of them. The solution found. Hope surges.]',
      },
    ],
    autoAdvanceDelay: 5000,
    next: 'ronnie-act2-beat6-crisis',
  },

  {
    id: 'ronnie-act2-beat6-crisis',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'surprised', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: '[RING RING RING]\n\n[Ronnie\'s phone. Hospital calling.]',
        internal: '[Visual: Phone screen - "ST. MERCY HOSPITAL" displayed.]',
      },
    ],
    effects: [
      { type: 'haptic', hapticType: 'heavy', reason: 'Phone call - crisis' },
    ],
    style: 'critical',
    autoAdvanceDelay: 3000,
    next: 'ronnie-act2-beat6-call',
  },

  {
    id: 'ronnie-act2-beat6-call',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        variant: 'phone',
        text: '"Mr. Santos? This is St. Mercy. Your wife\'s vitals are dropping. You need to come now."',
        internal: '[Visual: Ronnie\'s face drains of color.]',
      },
    ],
    style: 'critical',
    autoAdvanceDelay: 4000,
    next: 'ronnie-act2-beat6-time-limit',
  },

  {
    id: 'ronnie-act2-beat6-time-limit',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'internal',
        text: '"We know how to save her. But we\'re running out of time."',
        internal: '[Visual: Ronnie grabs the Tamagotchi. Runs for the door.]\n[The race begins.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'ronnie-act2-end',
  },

  // ========================================
  // ACT 2 END - TRANSITION TO ACT 3
  // ========================================
  {
    id: 'ronnie-act2-end',
    background: 'apartment',
    sprites: [],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'narration',
        text: '"And then... everything broke."',
        internal: '[Visual overload: alarms, static, screen fades white.]\n[→ Act 3: The final push begins]',
      },
    ],
    effects: [
      { type: 'flash', intensity: 'high', duration: 1000 },
      { type: 'static', intensity: 'high', duration: 500 },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-start',
  },
];

export function getRonnieAct2Scene(id: string): Scene | undefined {
  return RONNIE_ACT2_SCENES.find(scene => scene.id === id);
}

export function getRonnieAct2StartScene(): string {
  return 'ronnie-act2-start';
}
