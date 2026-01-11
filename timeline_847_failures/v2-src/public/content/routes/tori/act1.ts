/**
 * Tori Route - Act 1: Awakening & Discovery
 *
 * Tori's perspective: Internal viewpoint, trapped in the device.
 * Scenes cover: Street bump, void awakening, Echo introduction,
 * accidental laptop hop, hospital single buzz, first communication.
 */

import type { Scene } from '../../../core/types';

export const TORI_ACT1_SCENES: Scene[] = [
  // ========================================
  // SCENE 1: STREET BUMP & TRANSFER
  // Matches shared prologue from internal perspective
  // ========================================
  {
    id: 'tori-act1-scene1-coffee',
    background: 'genericBack',
    sprites: [
      { character: 'tori', emotion: 'neutral', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"French Vanilla for Ronnie. He always asks for this one."',
        internal: '[Visual: Coffee shop. Tori picks up the drink, checks her Tamagotchi while walking out.]',
      },
    ],
    unlockNote: 'z1', // Z's first note
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene1-distracted',
  },

  {
    id: 'tori-act1-scene1-distracted',
    background: 'genericBack',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"My little digital pet needs attention... Ronnie would laugh if he saw how attached I am to this thing."',
        internal: '[She walks down the street, coffee in one hand, her original Tamagotchi in the other, not looking where she\'s going.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene1-collision',
  },

  {
    id: 'tori-act1-scene1-collision',
    background: 'genericBack',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: 'THUD.',
        internal: '[She bumps into an older man. Hard. Coffee nearly spills. Both their Tamagotchis tumble to the ground.]',
      },
    ],
    autoAdvanceDelay: 2000,
    next: 'tori-act1-scene1-apology',
  },

  {
    id: 'tori-act1-scene1-apology',
    background: 'genericBack',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        text: '"Oh my gosh, I\'m so sorry! I wasn\'t paying attention—"',
        internal: '[She bends down quickly, embarrassed. Grabs the Tamagotchi closest to her hand.]',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'tori-act1-scene1-pickup-buzz',
  },

  {
    id: 'tori-act1-scene1-pickup-buzz',
    background: 'genericBack',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: 'BUZZ. BUZZ.',
        internal: '[The device vibrates in her hand. Twice. Sharp. Wrong. Something fundamental shifts.]',
      },
    ],
    effects: [
      { type: 'haptic', hapticType: 'double', reason: 'Initial transfer - the bump' },
    ],
    style: 'critical',
    autoAdvanceDelay: 2000,
    next: 'tori-act1-scene1-weird-feeling',
  },

  {
    id: 'tori-act1-scene1-weird-feeling',
    background: 'genericBack',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"What...? Mine never does that."',
        internal: '[A wave of disorientation. The world tilts. Reality feels... thin. Unstable.]',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'tori-act1-scene1-old-man',
  },

  {
    id: 'tori-act1-scene1-old-man',
    background: 'genericBack',
    sprites: [
      { character: 'tori', emotion: 'neutral', position: 'left' },
      { character: 'oldRonnie', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'oldRonnie',
        text: '"No problem. Hang on to that. It may save your life someday."',
        internal: '[She glances up but never clearly sees his face. Just a glimpse of a faded BGA hoodie. He walks away with her original device.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'tori-act1-scene1-walking-home',
  },

  {
    id: 'tori-act1-scene1-walking-home',
    background: 'genericBack',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"That was... weird. I should get home. Feel off."',
        internal: '[She walks, but everything feels distant. Muted. Like she\'s moving through water. Something is very wrong.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene2-void-awakening',
  },

  // ========================================
  // SCENE 2: VOID AWAKENING
  // Happens right after transfer
  // ========================================
  {
    id: 'tori-act1-scene2-void-awakening',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'And then... darkness.',
        internal: '[Visual: Pure black. No sound. A void. She is nowhere and everywhere.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene2-confusion',
  },

  {
    id: 'tori-act1-scene2-confusion',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"Wait... where am I? What happened? I was just walking..."',
        internal: '[She has no body. No voice. Just consciousness floating in digital darkness.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene2-calling-out',
  },

  {
    id: 'tori-act1-scene2-calling-out',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"HELLO?! Can anyone hear me?! RONNIE?!"',
        internal: '[The words echo only inside her own mind. No sound escapes into the void.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene2-echoes-whispers',
  },

  {
    id: 'tori-act1-scene2-echoes-whispers',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
      { character: 'echo1', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'Echo 1: "...another one..."\nEcho 2: "...it\'s starting again..."\nDespair: "...fresh meat..."',
        internal: '[Visual: Voices from nowhere. Other consciousnesses in this space.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene2-who-there',
  },

  {
    id: 'tori-act1-scene2-who-there',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"Who\'s there?! Where am I?!"',
        internal: '[The whispers grow louder, more distinct. Figures materializing from darkness.]',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'tori-act1-scene2-echo1-intro',
  },

  {
    id: 'tori-act1-scene2-echo1-intro',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
      { character: 'echo1', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'echo1',
        text: '"You\'re in the device. The Tamagotchi. With us."',
        internal: '[Visual: Three figures—Echo Toris. Similar but different. Worn down versions.]',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'tori-act1-scene2-echo2-explains',
  },

  {
    id: 'tori-act1-scene2-echo2-explains',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
      { character: 'echo2', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'echo2',
        text: '"We\'re you. Previous loops. Different attempts. 847 failures."',
        internal: '[Visual: The weight of their existence. Failed iterations.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene2-despair-welcome',
  },

  {
    id: 'tori-act1-scene2-despair-welcome',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
      { character: 'despair', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'despair',
        text: '"Welcome to your new cage. You\'re trapped. Just like we were. Just like you always will be."',
        internal: '[Visual: Despair—the most worn down, the most bitter. She\'s given up entirely.]',
      },
    ],
    unlockNote: 'z7', // Z's version number revelation
    autoAdvanceDelay: 3500,
    next: 'tori-act1-scene2-tori-refuses',
  },

  {
    id: 'tori-act1-scene2-tori-refuses',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"Cage?! No. I don\'t accept that. There has to be a way out!"',
        internal: '[Even in confusion and fear, she refuses the narrative. This is different already.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene2-hearing-begins',
  },

  {
    id: 'tori-act1-scene2-hearing-begins',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: 'And then... sound. Muffled. Distant. The outside world bleeding through.',
        internal: '[She can HEAR. Tinny, like through a tiny speaker. But she still can\'t see.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene3-audio-horror',
  },

  // ========================================
  // SCENE 3: AUDIO-ONLY HORROR
  // Hearing the shared prologue from inside device
  // ========================================
  {
    id: 'tori-act1-scene3-audio-horror',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        variant: 'through device',
        text: '"Hey babe, got your French Vanilla."',
        internal: '[That\'s... her voice. But she\'s not speaking. Her body is moving without her.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene3-screaming',
  },

  {
    id: 'tori-act1-scene3-screaming',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"RONNIE! RONNIE, I\'M IN HERE! THAT\'S NOT ME! CAN YOU HEAR ME?!"',
        internal: '[She screams into the void. Nothing happens. The conversation continues outside.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene3-echoes-explain',
  },

  {
    id: 'tori-act1-scene3-echoes-explain',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
      { character: 'echo1', emotion: 'sad', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'echo1',
        text: '"He can\'t hear you. We all tried screaming. It doesn\'t work."',
        internal: '[The weight of their experience. They know what doesn\'t work.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene3-dual-response',
  },

  {
    id: 'tori-act1-scene3-dual-response',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"Oh you know, because this thing is sooo cute. And what better way to name it than after my man - who\'s even cuter!"',
        internal: '[Digital Tori (internal, horrified): "Wait... I\'m saying this. But SHE\'S saying this. We\'re both... the same words..."]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'tori-act1-scene3-sync-horror',
  },

  {
    id: 'tori-act1-scene3-sync-horror',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"I\'m speaking... but I\'m also watching myself speak... What\'s happening to me?!"',
        internal: '[The horror of synchronization. Two Toris. One voice. One moment.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene3-the-fall',
  },

  {
    id: 'tori-act1-scene3-the-fall',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: 'THUD.',
        internal: '[A sickening impact. A clatter. Ronnie screaming her name. But she can\'t see. Can\'t help. Can only HEAR.]',
      },
    ],
    effects: [
      { type: 'shake', intensity: 'high', duration: 500 },
    ],
    style: 'critical',
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene3-desperate-need',
  },

  {
    id: 'tori-act1-scene3-desperate-need',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"I HAVE TO SEE! I have to know what happened! RONNIE, PLEASE!"',
        internal: '[Desperation. Pure, overwhelming need to witness. To understand. To help.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene4-accidental-hop',
  },

  // ========================================
  // SCENE 4: ACCIDENTAL LAPTOP HOP
  // First transfer - unwitting, emotional, desperate
  // ========================================
  {
    id: 'tori-act1-scene4-accidental-hop',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: 'She pushes. Not with body, but with consciousness. Every ounce of will focused on one thing: SEE.',
        internal: '[And then... something gives.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene4-double-buzz',
  },

  {
    id: 'tori-act1-scene4-double-buzz',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: 'BUZZ. BUZZ.',
        internal: '[But she doesn\'t notice. Too desperate. Too focused.]',
      },
    ],
    effects: [
      { type: 'haptic', hapticType: 'double', reason: 'Accidental laptop transfer' },
    ],
    style: 'critical',
    autoAdvanceDelay: 1500,
    next: 'tori-act1-scene4-whoosh',
  },

  {
    id: 'tori-act1-scene4-whoosh',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: '...WHOOSH.',
        internal: '[Visual: The darkness TEARS OPEN. Light. Vision. A webcam feed.]',
      },
    ],
    effects: [
      { type: 'flash', intensity: 'medium', duration: 300 },
    ],
    autoAdvanceDelay: 2000,
    next: 'tori-act1-scene4-seeing',
  },

  {
    id: 'tori-act1-scene4-seeing',
    background: 'apartment',
    sprites: [
      { character: 'tori', emotion: 'surprised', position: 'left' },
      { character: 'ronnie', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"I can... I can SEE! What—where am I?!"',
        internal: '[Visual: Through a laptop camera. The apartment. And... her body on the floor.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene4-witnessing',
  },

  {
    id: 'tori-act1-scene4-witnessing',
    background: 'apartment',
    sprites: [
      { character: 'tori', emotion: 'hurt', position: 'left' },
      { character: 'ronnie', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'Her body. Unconscious. Blood from where her head hit. Ronnie on the phone with 911.',
        internal: '[She is witnessing her own accident. From the outside. Through a camera. This is real.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'tori-act1-scene4-horror',
  },

  {
    id: 'tori-act1-scene4-horror',
    background: 'apartment',
    sprites: [
      { character: 'tori', emotion: 'hurt', position: 'left' },
      { character: 'ronnie', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"No... no no no... That\'s me. That\'s MY body. I\'m... I\'m in a coma."',
        internal: '[The full weight of understanding. She\'s not in her body anymore. She\'s watching it die.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'tori-act1-scene4-snap-back',
  },

  {
    id: 'tori-act1-scene4-snap-back',
    background: 'apartment',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: 'The connection falters. Unstable. The vision glitches, tears apart, and—',
        internal: '[WHOOSH. She\'s yanked backward violently. The light is gone.]',
      },
    ],
    effects: [
      { type: 'glitch', intensity: 'high', duration: 500 },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene4-back-in-void',
  },

  {
    id: 'tori-act1-scene4-back-in-void',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"NO! Bring it back! I need to see! PLEASE!"',
        internal: '[Darkness again. The void of the device. She\'s back. And she just watched herself fall.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene5-echoes-shock',
  },

  // ========================================
  // SCENE 5: ECHOES' SHOCK
  // The discovery that navigation is possible
  // ========================================
  {
    id: 'tori-act1-scene5-echoes-shock',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
      { character: 'echo1', emotion: 'surprised', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'echo1',
        text: '"...What. What did you just DO?!"',
        internal: '[The Echoes are shaken. Something impossible just happened.]',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'tori-act1-scene5-echo2-confused',
  },

  {
    id: 'tori-act1-scene5-echo2-confused',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
      { character: 'echo2', emotion: 'surprised', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'echo2',
        text: '"You DISAPPEARED. You were here, and then you just... VANISHED. Where did you GO?!"',
        internal: '[Visual: Echoes staring at the space where she was. Then back at her. Disbelief.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'tori-act1-scene5-tori-distraught',
  },

  {
    id: 'tori-act1-scene5-tori-distraught',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"I... I saw it. I saw her—ME—fall. There was blood. Ronnie was screaming. I watched myself..."',
        internal: '[She\'s in shock. The horror of witnessing her own accident.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'tori-act1-scene5-echo1-pressing',
  },

  {
    id: 'tori-act1-scene5-echo1-pressing',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
      { character: 'echo1', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'echo1',
        text: '"Where WERE you?! You weren\'t here! We\'ve been in this cage for... for YEARS. No one has ever left!"',
        internal: '[Desperation in her voice. If Tori left... maybe escape is possible?]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'tori-act1-scene5-despair-denial',
  },

  {
    id: 'tori-act1-scene5-despair-denial',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
      { character: 'despair', emotion: 'angry', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'despair',
        text: '"It was a FLUKE. A glitch. It won\'t happen again. You\'re still trapped. We\'re ALL still trapped."',
        internal: '[But her voice wavers. She\'s not as certain as she pretends.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'tori-act1-scene5-tori-defiant',
  },

  {
    id: 'tori-act1-scene5-tori-defiant',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"But I DID it. I left. I SAW. If I did it once, I can do it again."',
        internal: '[A new possibility is born. She proved Despair wrong. Once is enough.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'tori-act1-scene6-time-skip',
  },

  // ========================================
  // SCENE 6: TIME SKIP & DISCOVERY
  // Learning the contact rule through experimentation
  // ========================================
  {
    id: 'tori-act1-scene6-time-skip',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: 'Time passes. Days? Weeks? Impossible to tell. Ronnie takes the device everywhere.',
        internal: '[Visual: Darkness. Time montage. Tori attempts the hop repeatedly. Every attempt fails.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'tori-act1-scene6-attempts',
  },

  {
    id: 'tori-act1-scene6-attempts',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"Come on... PUSH. Like before. I need to get to the laptop again!"',
        internal: '[She concentrates. Pushes. Nothing happens. The void remains.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene6-failure',
  },

  {
    id: 'tori-act1-scene6-failure',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"Why won\'t it WORK?! I did it before! What\'s different?!"',
        internal: '[Frustration mounting. Maybe Despair was right. Maybe it was just a dying glitch.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'tori-act1-scene6-device-on-laptop',
  },

  {
    id: 'tori-act1-scene6-device-on-laptop',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'through device',
        text: '"Let me try plugging you into the laptop... maybe I can pull the data..."',
        internal: '[Sound of USB cable. A click. The device is connected to something.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene6-realization',
  },

  {
    id: 'tori-act1-scene6-realization',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"Wait... the device is TOUCHING the laptop. Just like during the accident!"',
        internal: '[The pattern. Physical contact. That was the difference.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene6-attempt-now',
  },

  {
    id: 'tori-act1-scene6-attempt-now',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"Okay. The device is touching the laptop. I think... I think I can do this. But what if I mess up? What if it goes wrong?"',
        internal: '[She hesitates at the edge. The jump that could change everything.]',
      },
    ],
    choices: [
      {
        text: 'Trust yourself. You can do this.',
        next: 'tori-act1-scene6-choice-confident',
        counters: [{ name: 'affection', operation: 'add', value: 1 }],
      },
      {
        text: 'Take your time. No rush.',
        next: 'tori-act1-scene6-choice-cautious',
      },
      {
        text: 'Just go for it!',
        next: 'tori-act1-scene6-choice-bold',
        counters: [{ name: 'flirty', operation: 'add', value: 1 }],
      },
    ],
  },

  {
    id: 'tori-act1-scene6-choice-confident',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"You\'re right. I DID this once. I can do it again. Trust myself."',
        internal: '[Steadying breath. Confidence building. She believes in herself.]',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'tori-act1-scene6-push',
  },

  {
    id: 'tori-act1-scene6-choice-cautious',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"Okay. Slow. Careful. Feel for the connection like last time..."',
        internal: '[Measured approach. Testing the edges before the leap.]',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'tori-act1-scene6-push',
  },

  {
    id: 'tori-act1-scene6-choice-bold',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"Screw it. If I did it on accident, I can do it on purpose. HERE GOES!"',
        internal: '[Pure determination. No hesitation. Full commitment.]',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'tori-act1-scene6-push',
  },

  {
    id: 'tori-act1-scene6-push',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"NOW!"',
        internal: '[She pushes. Same desperation. Same intent. But this time... with contact.]',
      },
    ],
    unlockNote: 'z2', // Z's bootstrap paradox note
    autoAdvanceDelay: 2000,
    next: 'tori-act1-scene6-double-buzz',
  },

  {
    id: 'tori-act1-scene6-double-buzz',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: 'BUZZ. BUZZ.',
        internal: '[This time she FEELS it. The signal. The bridge activating.]',
      },
    ],
    effects: [
      { type: 'haptic', hapticType: 'double', reason: 'Intentional laptop transfer' },
    ],
    style: 'critical',
    autoAdvanceDelay: 1500,
    next: 'tori-act1-scene6-hop-success',
  },

  {
    id: 'tori-act1-scene6-hop-success',
    background: 'apartment',
    sprites: [
      { character: 'tori', emotion: 'happy', position: 'left' },
      { character: 'ronnie', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: '...WHOOSH.',
        internal: '[Visual: Light. Vision. She\'s IN. The laptop. She can see through the webcam again.]',
      },
    ],
    autoAdvanceDelay: 2000,
    next: 'tori-act1-scene6-triumph',
  },

  {
    id: 'tori-act1-scene6-triumph',
    background: 'apartment',
    sprites: [
      { character: 'tori', emotion: 'happy', position: 'left' },
      { character: 'ronnie', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"YES! I DID IT! The device has to be TOUCHING the target! That\'s the rule!"',
        internal: '[The discovery. Physical contact enables the transfer. This is navigation, not luck.]',
      },
    ],
    style: 'critical',
    autoAdvanceDelay: 3500,
    next: 'tori-act1-scene7-hospital-transition',
  },

  // ========================================
  // SCENE 7: HOSPITAL VISIT - SINGLE BUZZ MYSTERY
  // ========================================
  {
    id: 'tori-act1-scene7-hospital-transition',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: 'One day, Ronnie leaves the laptop. Takes only the device. She\'s back in the darkness.',
        internal: '[Snap. The connection breaks. She\'s in the device again. Where is he going?]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene7-hospital-sounds',
  },

  {
    id: 'tori-act1-scene7-hospital-sounds',
    background: 'hospital',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: 'Muffled sounds. Beeping. Hospital machines. The smell would be antiseptic if she could smell.',
        internal: '[He brought the device to the hospital. Near her body.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene7-the-pull',
  },

  {
    id: 'tori-act1-scene7-the-pull',
    background: 'hospital',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"Wait... what is this? I feel... something. Warmth? A pull?"',
        internal: '[Abstract sensation. Different from the laptop. Magnetic. Calling.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene7-experimenting',
  },

  {
    id: 'tori-act1-scene7-experimenting',
    background: 'hospital',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"It\'s different from the laptop feeling. What if I push toward it...?"',
        internal: '[She concentrates. Reaches toward the sensation. Pushes.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene7-single-buzz',
  },

  {
    id: 'tori-act1-scene7-single-buzz',
    background: 'hospital',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: 'BUZZ.',
        internal: '[Single. Not double. Different signal. The device vibrates once.]',
      },
    ],
    effects: [
      { type: 'haptic', hapticType: 'light', reason: 'Hospital single buzz - body connection' },
    ],
    style: 'critical',
    autoAdvanceDelay: 1500,
    next: 'tori-act1-scene7-tori-realization',
  },

  {
    id: 'tori-act1-scene7-tori-realization',
    background: 'hospital',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"I made that happen. But... only one buzz. Not two. What does that mean?"',
        internal: '[The difference. Double buzz = vessel transfer. Single buzz = something else.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene7-ronnie-dismisses',
  },

  {
    id: 'tori-act1-scene7-ronnie-dismisses',
    background: 'hospital',
    sprites: [],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'through device',
        text: '"Hmm. Battery acting up again. I should charge this when I get home."',
        internal: '[He moves the device away. The pull fades. The warmth gone.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene7-tori-frustrated',
  },

  {
    id: 'tori-act1-scene7-tori-frustrated',
    background: 'hospital',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"No! That was ME! Not the battery! But... why did it feel different?"',
        internal: '[The mystery. Single buzz near body. Double buzz for vessel transfer. What\'s the connection?]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene7-tori-determined',
  },

  {
    id: 'tori-act1-scene7-tori-determined',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"No. It means SOMETHING. I just don\'t know what yet. But I\'ll figure it out."',
        internal: '[The mystery preserved. She knows there\'s a connection. She just doesn\'t understand it yet.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'tori-act1-scene8-torigatchi',
  },

  // ========================================
  // SCENE 8: TORI-GATCHI BREAKTHROUGH
  // Communication achieved - Act 1 complete
  // ========================================
  {
    id: 'tori-act1-scene8-torigatchi',
    background: 'apartment',
    sprites: [
      { character: 'tori', emotion: 'neutral', position: 'left' },
      { character: 'ronnie', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'Back home. Device on laptop again. Contact established. She hops deliberately.',
        internal: '[Visual: She\'s getting better at this. The transfer is smoother now.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene8-program-ready',
  },

  {
    id: 'tori-act1-scene8-program-ready',
    background: 'apartment',
    sprites: [
      { character: 'tori', emotion: 'neutral', position: 'left' },
      { character: 'ronnie', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'through device',
        text: '"Okay. Let\'s see if this works. Launching Tori-gatchi..."',
        internal: '[Through laptop: He clicks. The program opens. Her sprite appears on screen.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene8-sync-moment',
  },

  {
    id: 'tori-act1-scene8-sync-moment',
    background: 'apartment',
    sprites: [
      { character: 'tori', emotion: 'determined', position: 'left' },
      { character: 'ronnie', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"The game is running. Dialogue system is active. NOW. I sync with it NOW."',
        internal: '[She pushes her consciousness toward the text output. Hijacking the dialogue box.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene8-first-words',
  },

  {
    id: 'tori-act1-scene8-first-words',
    background: 'apartment',
    sprites: [
      { character: 'tori', emotion: 'happy', position: 'left' },
      { character: 'ronnie', emotion: 'surprised', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'through game',
        text: '"Baby? Is that you?"',
        internal: '[Visual: Her words appearing in the dialogue box. Text she didn\'t code. SHE\'S SPEAKING.]',
      },
    ],
    style: 'critical',
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene8-ronnie-confusion',
  },

  {
    id: 'tori-act1-scene8-ronnie-confusion',
    background: 'apartment',
    sprites: [
      { character: 'tori', emotion: 'happy', position: 'left' },
      { character: 'ronnie', emotion: 'surprised', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"What the... I didn\'t code that. What\'s happening?"',
        internal: '[Through webcam: His face. Confused. Scared. Hopeful. Recognizing the speech pattern.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act1-scene8-tori-pushes',
  },

  {
    id: 'tori-act1-scene8-tori-pushes',
    background: 'apartment',
    sprites: [
      { character: 'tori', emotion: 'determined', position: 'left' },
      { character: 'ronnie', emotion: 'surprised', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'through game',
        text: '"It\'s me! Tori! I\'m in the device! I\'ve been trying to reach you!"',
        internal: '[Fighting to maintain the connection. Forcing words through the dialogue system.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'tori-act1-scene8-proof',
  },

  {
    id: 'tori-act1-scene8-proof',
    background: 'apartment',
    sprites: [
      { character: 'tori', emotion: 'determined', position: 'left' },
      { character: 'ronnie', emotion: 'surprised', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'through game',
        text: '"I saw it happen. Through your laptop camera. I tripped on your shoe. There was blood. You called 911."',
        internal: '[Details only she would know. Proof. Evidence. It\'s really her.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'tori-act1-scene8-ronnie-believes',
  },

  {
    id: 'tori-act1-scene8-ronnie-believes',
    background: 'apartment',
    sprites: [
      { character: 'tori', emotion: 'happy', position: 'left' },
      { character: 'ronnie', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Oh my god. It IS you. You\'re really... you\'re in there. How is this possible?"',
        internal: '[Breakthrough. Communication established. He believes. Finally.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'tori-act1-scene8-tori-victory',
  },

  {
    id: 'tori-act1-scene8-tori-victory',
    background: 'apartment',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"I can talk to him. I can MOVE. I\'m not trapped. This isn\'t a cage. It\'s a bridge."',
        internal: '[The foundation established. Communication. Navigation. Hope.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'tori-act1-scene8-transition',
  },

  {
    id: 'tori-act1-scene8-transition',
    background: 'apartment',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: 'Act 1 complete. Communication achieved. The real work begins.',
        internal: '[Visual: Tori and Ronnie connected through the game. Echo Toris watching. A new loop. A new possibility.]',
      },
    ],
    effects: [
      { type: 'fade', duration: 2000 },
    ],
    autoAdvanceDelay: 4000,
    next: 'tori-act2-start',
  },
];

export function getToriAct1Scene(id: string): Scene | undefined {
  return TORI_ACT1_SCENES.find(scene => scene.id === id);
}

export function getToriAct1StartScene(): string {
  return 'tori-act1-scene1-coffee';
}
