/**
 * Tori Route - Act 2: Building Connection & Despair's Challenge
 *
 * Tori's perspective: Learning to navigate, fighting Despair's influence,
 * deepening connection with Ronnie, discovering the body anchor.
 *
 * Key scenes:
 * - Ice cream memory hijack (Despair takes control)
 * - Digital dates with Ronnie
 * - Echo teaching moments
 * - Tether system tutorial
 * - Body anchor discovery foreshadowing
 */

import type { Scene } from '../../../core/types';

export const TORI_ACT2_SCENES: Scene[] = [
  // ========================================
  // BEAT 1: DESPAIR'S FIRST ATTACK
  // Ice cream memory hijack
  // ========================================
  {
    id: 'tori-act2-start',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'neutral', position: 'left' },
      { character: 'despair', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'Days pass. The connection grows stronger. But so does something else...',
        internal: '[Visual: Tori in the digital space. Despair watching from shadows.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'tori-act2-beat1-ronnie-calls',
  },

  {
    id: 'tori-act2-beat1-ronnie-calls',
    background: 'apartment',
    sprites: [
      { character: 'tori', emotion: 'happy', position: 'left' },
      { character: 'ronnie', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'through device',
        text: '"Hey. I know things are rough right now. Want to talk about something normal? Something that isn\'t... all this?"',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act2-beat1-tori-responds',
  },

  {
    id: 'tori-act2-beat1-tori-responds',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'happy', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'through game',
        text: '"Yeah. Normal sounds good."',
        internal: '[She relaxes. A normal conversation. Just like before.]',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'tori-act2-beat1-ice-cream-question',
  },

  {
    id: 'tori-act2-beat1-ice-cream-question',
    background: 'apartment',
    sprites: [
      { character: 'tori', emotion: 'neutral', position: 'left' },
      { character: 'ronnie', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Remember when we used to get ice cream from that place on 5th? What was your go-to flavor again?"',
        internal: '[Trying to ground her in good memories.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act2-beat1-despair-hijack',
  },

  {
    id: 'tori-act2-beat1-despair-hijack',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'surprised', position: 'left' },
      { character: 'despair', emotion: 'smirk', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'despair',
        variant: 'internal',
        text: '"Let me answer that for you..."',
        internal: '[Despair pushes. Tori feels control slipping.]',
      },
    ],
    effects: [
      { type: 'glitch', intensity: 'low', duration: 300 },
    ],
    autoAdvanceDelay: 2000,
    next: 'tori-act2-beat1-wrong-answer',
  },

  {
    id: 'tori-act2-beat1-wrong-answer',
    background: 'apartment',
    sprites: [
      { character: 'tori', emotion: 'neutral', position: 'left' },
      { character: 'ronnie', emotion: 'surprised', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'through game',
        text: '"Tiger Tail."',
        internal: '[That\'s not right. She HATES Tiger Tail. Despair is speaking through her.]',
      },
    ],
    style: 'critical',
    autoAdvanceDelay: 2000,
    next: 'tori-act2-beat1-ronnie-notices',
  },

  {
    id: 'tori-act2-beat1-ronnie-notices',
    background: 'apartment',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
      { character: 'ronnie', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"...Tiger Tail? But you always called it \'discount Halloween in a cone.\' You hate that flavor."',
        internal: '[He notices. Something is wrong.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act2-beat1-tori-fights-back',
  },

  {
    id: 'tori-act2-beat1-tori-fights-back',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'angry', position: 'left' },
      { character: 'despair', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"GET OUT! That\'s not ME speaking!"',
        internal: '[She pushes back. Fighting for control. The tether strains.]',
      },
    ],
    tetherImpact: -5,
    autoAdvanceDelay: 3000,
    next: 'tori-act2-beat1-correction',
  },

  {
    id: 'tori-act2-beat1-correction',
    background: 'apartment',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
      { character: 'ronnie', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'through game',
        text: '"Wait. No. I meant... chocolate chip cookie dough. Sorry. I\'m... my head is fuzzy."',
        internal: '[She regains control. But Ronnie saw the glitch.]',
      },
    ],
    effects: [
      { type: 'glitch', intensity: 'medium', duration: 400 },
    ],
    autoAdvanceDelay: 3500,
    next: 'tori-act2-beat1-echoes-react',
  },

  {
    id: 'tori-act2-beat1-echoes-react',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'left' },
      { character: 'echo1', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'echo1',
        text: '"Despair is getting stronger. She\'ll try again. You need to be ready."',
        internal: '[Echo 1 reaches out. Supportive. Warning.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'tori-act2-beat2',
  },

  // ========================================
  // BEAT 2: TETHER TUTORIAL
  // Learning to manage the connection
  // ========================================
  {
    id: 'tori-act2-beat2',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'neutral', position: 'left' },
      { character: 'echo2', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'echo2',
        text: '"The tether. It\'s your connection to Ronnie. To hope. When it\'s strong, you can fight Despair. When it weakens..."',
        internal: '[Visual: A glowing thread connecting Tori to something outside the device.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'tori-act2-beat2-hold-on',
  },

  {
    id: 'tori-act2-beat2-hold-on',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'neutral', position: 'left' },
      { character: 'echo1', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'echo1',
        text: '"When you feel it slipping, you can HOLD ON. Focus on what matters. On who matters. It restores the connection."',
        internal: '[Tutorial: The Hold On mechanic introduced.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'tori-act2-beat2-practice',
  },

  {
    id: 'tori-act2-beat2-practice',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'internal',
        text: '"Hold on. Right. I can do that. I have something to hold on to."',
        internal: '[She thinks of Ronnie. Of home. The tether glows brighter.]',
      },
    ],
    tetherImpact: 10,
    autoAdvanceDelay: 3500,
    next: 'tori-act2-continue',
  },

  // Placeholder for remaining Act 2 content
  {
    id: 'tori-act2-continue',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'Act 2 continues... [Content migration in progress]',
        internal: '[Additional scenes: Digital dates, Echo bonding, Despair confrontations, Body anchor foreshadowing]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'tori-act3-start',
  },
];

export function getToriAct2Scene(id: string): Scene | undefined {
  return TORI_ACT2_SCENES.find(scene => scene.id === id);
}

export function getToriAct2StartScene(): string {
  return 'tori-act2-start';
}
