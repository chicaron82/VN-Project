/**
 * Tori Route - Act 3: Crisis & Endings
 *
 * Tori's perspective: The final push, body anchor revelation,
 * and three possible endings from her POV.
 *
 * Key scenes:
 * - Memory fragmentation crisis
 * - Despair's final assault
 * - Body anchor discovery
 * - The transfer attempt
 * - Three endings (True, Bad, Digital Forever)
 */

import type { Scene } from '../../../core/types';

export const TORI_ACT3_SCENES: Scene[] = [
  // ========================================
  // BEAT 1: MEMORY FRAGMENTATION
  // Tori's consciousness destabilizing
  // ========================================
  {
    id: 'tori-act3-start',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"Something\'s wrong. I can feel pieces of myself... slipping away."',
        internal: '[Visual: Her sprite flickering. Pixels dissolving at the edges.]',
      },
    ],
    effects: [
      { type: 'glitch', intensity: 'low', duration: 300 },
    ],
    autoAdvanceDelay: 3500,
    next: 'tori-act3-beat1-forgetting',
  },

  {
    id: 'tori-act3-beat1-forgetting',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"Our anniversary... when is it? June... June something. Why can\'t I remember?"',
        internal: '[Panic. The memories are fragmenting. She\'s losing herself.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act3-beat1-echoes-concern',
  },

  {
    id: 'tori-act3-beat1-echoes-concern',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
      { character: 'echo1', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'echo1',
        text: '"It\'s happening. The battery... it can\'t sustain a full consciousness. You\'re too much for this vessel."',
        internal: '[Echo 1 reaches out. Compassion mixed with fear.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'tori-act3-beat1-despair-gloats',
  },

  {
    id: 'tori-act3-beat1-despair-gloats',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
      { character: 'despair', emotion: 'smirk', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'despair',
        text: '"I told you. Trapped. Just like us. When the battery dies, you die. We all die. Again."',
        internal: '[Despair\'s bitter satisfaction. She was right all along.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'tori-act3-beat1-tori-refuses',
  },

  {
    id: 'tori-act3-beat1-tori-refuses',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"No. There has to be a way. The single buzz at the hospital... my body was calling me. I felt it!"',
        internal: '[She refuses to give up. The mystery of the single buzz resurfaces.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'tori-act3-beat2',
  },

  // ========================================
  // BEAT 2: BODY ANCHOR REVELATION
  // Understanding the escape route
  // ========================================
  {
    id: 'tori-act3-beat2',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'determined', position: 'left' },
      { character: 'echo2', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'echo2',
        text: '"We felt it too. Near the body. A pull. Warmth. But we never... we thought it was just phantom signals."',
        internal: '[Echo 2 admits their failure. They never pursued it.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'tori-act3-beat2-realization',
  },

  {
    id: 'tori-act3-beat2-realization',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'happy', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"Double buzz = vessel transfer. Single buzz = body calling. If the device touches my body... I can jump HOME!"',
        internal: '[The revelation. The escape route. It was there all along.]',
      },
    ],
    unlockNote: 'pz2', // PerplexiZee's body anchor mechanics note
    style: 'critical',
    autoAdvanceDelay: 4000,
    next: 'tori-act3-beat2-despair-attacks',
  },

  {
    id: 'tori-act3-beat2-despair-attacks',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
      { character: 'despair', emotion: 'angry', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'despair',
        text: '"NO! You can\'t leave! If you escape, what does that make US? 847 failures who never tried hard enough?!"',
        internal: '[Despair lashes out. Not just despair anymore - jealousy. Fear of being left behind.]',
      },
    ],
    effects: [
      { type: 'shake', intensity: 'medium', duration: 400 },
    ],
    tetherImpact: -10,
    autoAdvanceDelay: 4000,
    next: 'tori-act3-beat2-echoes-defend',
  },

  {
    id: 'tori-act3-beat2-echoes-defend',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'neutral', position: 'left' },
      { character: 'echo1', emotion: 'determined', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'echo1',
        text: '"Stop, Despair! If she can escape... maybe we can too. Through her. Don\'t you see?"',
        internal: '[Echo 1 stands with Tori. Hope spreading.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'tori-act3-beat3',
  },

  // ========================================
  // BEAT 3: THE CRISIS CALL
  // Hospital emergency - vitals crashing
  // ========================================
  {
    id: 'tori-act3-beat3',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'Through the device, muffled sounds. A phone ringing. Ronnie answering.',
        internal: '[Something is happening in the outside world.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act3-beat3-hearing-call',
  },

  {
    id: 'tori-act3-beat3-hearing-call',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        variant: 'through device',
        text: '"...vitals crashed... heart rate erratic... get here NOW..."',
        internal: '[Fragments of the call. Her body is dying.]',
      },
    ],
    style: 'critical',
    autoAdvanceDelay: 3000,
    next: 'tori-act3-beat3-feeling-it',
  },

  {
    id: 'tori-act3-beat3-feeling-it',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'hurt', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"I can FEEL it. My body. It\'s failing. Both of me are dying at the same time!"',
        internal: '[The connection to her body - she can sense its distress.]',
      },
    ],
    effects: [
      { type: 'glitch', intensity: 'high', duration: 500 },
      { type: 'haptic', hapticType: 'emergency', reason: 'Body crisis' },
    ],
    style: 'critical',
    tetherImpact: -15,
    autoAdvanceDelay: 3500,
    next: 'tori-act3-beat3-battery-warning',
  },

  {
    id: 'tori-act3-beat3-battery-warning',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'system',
        text: '⚠️ BATTERY: 3%\n⚠️ CONSCIOUSNESS FRAGMENTING\n⚠️ ESTIMATED TIME: 5 MINUTES',
        internal: '[Both timers converging. Device dying. Body dying.]',
      },
    ],
    style: 'critical',
    autoAdvanceDelay: 3000,
    next: 'tori-act3-beat4',
  },

  // ========================================
  // BEAT 4: THE MAD DASH (FROM INSIDE)
  // Experiencing Ronnie's race from Tori's POV
  // ========================================
  {
    id: 'tori-act3-beat4',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"He\'s running. I can feel the movement. The jolts. He\'s coming for me."',
        internal: '[Through the device, she senses Ronnie\'s desperate sprint.]',
      },
    ],
    effects: [
      { type: 'shake', intensity: 'low', duration: 1000 },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act3-beat4-echoes-support',
  },

  {
    id: 'tori-act3-beat4-echoes-support',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
      { character: 'echo1', emotion: 'determined', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'echo1',
        text: '"Hold on. Just hold on. He\'s almost there. We can feel the body getting closer."',
        internal: '[The Echoes gathered around her. Supporting. Hoping.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act3-beat4-despair-final',
  },

  {
    id: 'tori-act3-beat4-despair-final',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
      { character: 'despair', emotion: 'sad', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'despair',
        text: '"...I\'m scared. If you leave... we\'ll be alone again. Forever."',
        internal: '[Despair\'s mask cracking. Not anger anymore. Just fear. Loneliness.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'tori-act3-beat4-tori-promise',
  },

  {
    id: 'tori-act3-beat4-tori-promise',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'determined', position: 'left' },
      { character: 'despair', emotion: 'sad', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"I won\'t forget you. Any of you. You\'re part of me. When I wake up... I\'ll carry you with me."',
        internal: '[A promise. To herself. To all of them.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'tori-act3-beat5',
  },

  // ========================================
  // BEAT 5: THE MOMENT OF TRUTH
  // Device touches body - the transfer
  // ========================================
  {
    id: 'tori-act3-beat5',
    background: 'hospital',
    sprites: [
      { character: 'tori', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"I feel it! My body! It\'s RIGHT THERE! The pull is so strong!"',
        internal: '[The warmth. The magnetic sensation. Stronger than ever.]',
      },
    ],
    effects: [
      { type: 'haptic', hapticType: 'heavy', reason: 'Body proximity' },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act3-beat5-ronnie-voice',
  },

  {
    id: 'tori-act3-beat5-ronnie-voice',
    background: 'hospital',
    sprites: [
      { character: 'tori', emotion: 'happy', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'through device',
        text: '"Come home. Follow the heartbeat."',
        internal: '[His voice. Clear now. Not muffled. Close.]',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'tori-act3-beat5-the-jump',
  },

  {
    id: 'tori-act3-beat5-the-jump',
    background: 'hospital',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"NOW! I JUMP NOW!"',
        internal: '[She pushes with everything she has. Every ounce of will. Every fragment of hope.]',
      },
    ],
    autoAdvanceDelay: 2000,
    next: 'tori-act3-ending-choice',
  },

  // ========================================
  // ENDING DETERMINATION
  // Based on player choices throughout
  // ========================================
  {
    id: 'tori-act3-ending-choice',
    background: 'hospital',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: 'The moment of truth. Everything converges.',
        internal: '[Ending determined by accumulated choices and tether state.]',
      },
    ],
    // Conditional next based on route points
    next: {
      conditions: [
        { condition: { counter: { name: 'route_true', comparison: 'gte', value: 5 } }, sceneId: 'tori-ending-true-start' },
        { condition: { counter: { name: 'route_digital', comparison: 'gte', value: 5 } }, sceneId: 'tori-ending-digital-start' },
      ],
      default: 'tori-ending-bad-start',
    },
  },

  // ========================================
  // TRUE ENDING - SUCCESSFUL TRANSFER
  // ========================================
  {
    id: 'tori-ending-true-start',
    background: 'hospital',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: 'BUZZ. BUZZ.',
        internal: '[Double buzz. But different. Not vessel transfer. BODY transfer.]',
      },
    ],
    effects: [
      { type: 'haptic', hapticType: 'double', reason: 'Body transfer - going home' },
      { type: 'flash', intensity: 'high', duration: 500 },
    ],
    style: 'critical',
    autoAdvanceDelay: 2000,
    next: 'tori-ending-true-transfer',
  },

  {
    id: 'tori-ending-true-transfer',
    background: 'hospital',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"I\'m... dissolving. Not dying. MOVING. Following the heartbeat. Following HIM."',
        internal: '[Her digital form fades. But she\'s not disappearing. She\'s going somewhere.]',
      },
    ],
    effects: [
      { type: 'fade', intensity: 'high', duration: 2000 },
    ],
    autoAdvanceDelay: 4000,
    next: 'tori-ending-true-awakening',
  },

  {
    id: 'tori-ending-true-awakening',
    background: 'hospital',
    sprites: [
      { character: 'tori', emotion: 'surprised', position: 'left' },
      { character: 'ronnie', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'Light. Real light. Not pixels. SUNLIGHT.',
        internal: '[Her eyes open. Real eyes. In a real body. In a hospital room.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-ending-true-ronnie',
  },

  {
    id: 'tori-ending-true-ronnie',
    background: 'hospital',
    sprites: [
      { character: 'tori', emotion: 'happy', position: 'left' },
      { character: 'ronnie', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"...Ronnie?"',
        internal: '[Her voice. Real. Coming from her own throat.]',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'tori-ending-true-touch',
  },

  {
    id: 'tori-ending-true-touch',
    background: 'hospital',
    sprites: [
      { character: 'tori', emotion: 'happy', position: 'left' },
      { character: 'ronnie', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"I can FEEL him. His hand on mine. Warmth. Real warmth. Not data. TOUCH."',
        internal: '[She squeezes his hand. He squeezes back. Real. Physical. HOME.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'tori-ending-true-final',
  },

  {
    id: 'tori-ending-true-final',
    background: 'hospital',
    sprites: [
      { character: 'tori', emotion: 'happy', position: 'left' },
      { character: 'ronnie', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"I\'m home. I\'m really home. And I\'ll never take a single moment for granted again."',
        internal: '[Morning light. Golden. Warm. The Tamagotchi rests silent on the bedside table. She made it.]\n\n**TRUE ENDING**\n"She came home."',
      },
    ],
    effects: [
      { type: 'fade', intensity: 'low', duration: 2000 },
    ],
    flags: [
      { name: 'ending_true_complete', value: true },
      { name: 'skip_prologue_unlocked', value: true },
    ],
    next: 'epilogue-start',
  },

  // ========================================
  // BAD ENDING - TOO LATE
  // ========================================
  {
    id: 'tori-ending-bad-start',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'hurt', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'system',
        text: '⚠️ BATTERY: 0%\n⚠️ CONSCIOUSNESS TERMINATED\n⚠️ CONNECTION LOST',
        internal: '[The screen goes dark. The pull fades. She was so close.]',
      },
    ],
    effects: [
      { type: 'static', intensity: 'high', duration: 1000 },
    ],
    style: 'critical',
    autoAdvanceDelay: 3000,
    next: 'tori-ending-bad-darkness',
  },

  {
    id: 'tori-ending-bad-darkness',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"No... NO! I was right there! I could feel my body! RONNIE!"',
        internal: '[But there\'s nothing. No warmth. No pull. Just void.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'tori-ending-bad-echoes',
  },

  {
    id: 'tori-ending-bad-echoes',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'despair',
        text: '"Welcome to forever, 848."',
        internal: '[Despair\'s voice. Hollow. No satisfaction. Just shared grief.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'tori-ending-bad-final',
  },

  {
    id: 'tori-ending-bad-final',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: 'The loop resets. Somewhere, an old man prepares to bump into a young woman on a street corner.',
        internal: '[Fade to white.]\n\n**BAD ENDING: THE LOOP BEGINS AGAIN**\n"Love trapped in glass."',
      },
    ],
    effects: [
      { type: 'fade', intensity: 'high', duration: 2000 },
    ],
    flags: [
      { name: 'ending_bad_complete', value: true },
      { name: 'skip_prologue_unlocked', value: true },
    ],
    next: 'ending-menu',
  },

  // ========================================
  // DIGITAL FOREVER - RONNIE JOINS HER
  // ========================================
  {
    id: 'tori-ending-digital-start',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'surprised', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"Wait... something\'s happening. Another consciousness entering the device?"',
        internal: '[A new presence. Familiar. Impossible.]',
      },
    ],
    effects: [
      { type: 'haptic', hapticType: 'double', reason: 'Ronnie entering the device' },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-ending-digital-ronnie-arrives',
  },

  {
    id: 'tori-ending-digital-ronnie-arrives',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'surprised', position: 'left' },
      { character: 'ronnie', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'A sprite materializes. Not an Echo. HIM.',
        internal: '[Ronnie\'s digital form coalesces beside her.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-ending-digital-what-did-you-do',
  },

  {
    id: 'tori-ending-digital-what-did-you-do',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'surprised', position: 'left' },
      { character: 'ronnie', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"Ronnie... what did you DO?!"',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'tori-ending-digital-always',
  },

  {
    id: 'tori-ending-digital-always',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'happy', position: 'left' },
      { character: 'ronnie', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"What I promised. Always."',
        internal: '[He takes her hand. Their sprites sync perfectly.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-ending-digital-together',
  },

  {
    id: 'tori-ending-digital-together',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'happy', position: 'left' },
      { character: 'ronnie', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"You beautiful idiot. We\'re both trapped now."',
        internal: '[But she\'s smiling. They\'re together. That\'s what matters.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-ending-digital-build',
  },

  {
    id: 'tori-ending-digital-build',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'happy', position: 'left' },
      { character: 'ronnie', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'They build their world together. Pixel parks. Digital sunsets. Eternally young. Eternally together.',
        internal: '[Their apartment, recreated in code. Perfect. Frozen. Safe.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'tori-ending-digital-final',
  },

  {
    id: 'tori-ending-digital-final',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'happy', position: 'left' },
      { character: 'ronnie', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"Maybe this isn\'t so bad. No pain. No loss. Just us. Forever."',
        internal: '[But somewhere deep, she wonders: Is this living? Or just existing?]\n\n**DIGITAL FOREVER ENDING**\n"Together, eternally still."',
      },
    ],
    effects: [
      { type: 'fade', intensity: 'low', duration: 2000 },
    ],
    flags: [
      { name: 'ending_digital_forever_complete', value: true },
      { name: 'skip_prologue_unlocked', value: true },
    ],
    next: 'ending-menu',
  },
];

export function getToriAct3Scene(id: string): Scene | undefined {
  return TORI_ACT3_SCENES.find(scene => scene.id === id);
}

export function getToriAct3StartScene(): string {
  return 'tori-act3-start';
}
