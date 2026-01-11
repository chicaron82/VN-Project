/**
 * Shared True Ending Epilogue
 *
 * "Six Months Later" sequence - Both routes converge here after successful awakening.
 * This is the reward for escaping the loop.
 */

import type { Scene, CharacterId } from '../../core/types';

/**
 * Epilogue configuration based on which route the player came from
 */
export interface EpilogueConfig {
  fromRoute: 'ronnie' | 'tori';
  leftSprite: CharacterId;
  rightSprite: CharacterId;
  oldLeftSprite: CharacterId;
  oldRightSprite: CharacterId;
}

/**
 * Get epilogue sprite configuration based on route
 */
export function getEpilogueConfig(fromRoute: 'ronnie' | 'tori'): EpilogueConfig {
  if (fromRoute === 'tori') {
    return {
      fromRoute,
      leftSprite: 'tori',
      rightSprite: 'ronnie',
      oldLeftSprite: 'tori',
      oldRightSprite: 'oldRonnie',
    };
  }
  // Default: Ronnie's route
  return {
    fromRoute,
    leftSprite: 'ronnie',
    rightSprite: 'tori',
    oldLeftSprite: 'oldRonnie',
    oldRightSprite: 'tori',
  };
}

/**
 * Generate epilogue scenes based on route configuration
 */
export function getEpilogueScenes(config: EpilogueConfig): Scene[] {
  return [
    // Opening - Six Months Later
    {
      id: 'epilogue-start',
      background: 'apartment',
      sprites: [
        { character: config.leftSprite, emotion: 'happy', position: 'left' },
        { character: config.rightSprite, emotion: 'happy', position: 'right' },
      ],
      dialog: [
        {
          speaker: 'narrator',
          text: '[SIX MONTHS LATER]',
          internal: '[Visual: Their apartment. Morning light. Domestic peace. Tori recovered, moving freely.]',
        },
      ],
      autoAdvanceDelay: 3000,
      next: 'epilogue-beard',
    },

    // The Beard
    {
      id: 'epilogue-beard',
      background: 'apartment',
      sprites: [
        { character: config.leftSprite, emotion: 'happy', position: 'left' },
        { character: config.rightSprite, emotion: 'happy', position: 'right' },
      ],
      dialog: [
        {
          speaker: 'tori',
          text: '"You know, that beard really suits you..."',
          internal: '[She strokes his face, running her fingers through the new scruff.]',
        },
      ],
      autoAdvanceDelay: 3000,
      next: 'epilogue-ronnie-joke',
    },

    // Ronnie's Joke
    {
      id: 'epilogue-ronnie-joke',
      background: 'apartment',
      sprites: [
        { character: config.leftSprite, emotion: 'happy', position: 'left' },
        { character: config.rightSprite, emotion: 'happy', position: 'right' },
      ],
      dialog: [
        {
          speaker: 'ronnie',
          text: '"Thought I\'d try it out. It\'s getting colder out. Keeps my face warm. Plus I\'ll look like Santa if I put the hat on."',
        },
      ],
      autoAdvanceDelay: 3000,
      next: 'epilogue-realization',
    },

    // Tori's Realization
    {
      id: 'epilogue-realization',
      background: 'apartment',
      sprites: [
        { character: config.leftSprite, emotion: 'neutral', position: 'left' },
        { character: config.rightSprite, emotion: 'neutral', position: 'right' },
      ],
      dialog: [
        {
          speaker: 'tori',
          variant: 'internal',
          text: '"You look... distinguished. Older. Like you\'ve seen things..."',
          internal: '[A pause. Something flickering at the edge of memory.]',
        },
      ],
      autoAdvanceDelay: 3000,
      next: 'epilogue-flashback',
    },

    // The Connection - Flashback
    {
      id: 'epilogue-flashback',
      background: 'streetNight',
      sprites: [
        { character: config.oldLeftSprite, emotion: 'sad', position: 'left' },
        { character: config.oldRightSprite, emotion: 'neutral', position: 'right' },
      ],
      dialog: [
        {
          speaker: 'tori',
          text: '"I feel like... I\'ve seen this exact look before..."',
          internal: '[FLASHBACK: The street bump. The Old Man reaching for her. Gray hair. Beard. Those same eyes. The BGA hoodie...]',
        },
      ],
      effects: [
        { type: 'screenFlash', duration: 200 },
      ],
      autoAdvanceDelay: 4000,
      next: 'epilogue-chicharon',
    },

    // Studying His Face
    {
      id: 'epilogue-chicharon',
      background: 'apartment',
      sprites: [
        { character: config.leftSprite, emotion: 'neutral', position: 'left' },
        { character: config.rightSprite, emotion: 'neutral', position: 'right' },
      ],
      dialog: [
        {
          speaker: 'tori',
          variant: 'internal',
          text: '"Those eyes..."',
          internal: '[She traces his jawline. Something ancient stirring in her memory. A voice across timelines.]',
        },
      ],
      autoAdvanceDelay: 2500,
      next: 'epilogue-chicharon-recognition',
    },

    // The Name Slips Out
    {
      id: 'epilogue-chicharon-recognition',
      background: 'apartment',
      sprites: [
        { character: config.leftSprite, emotion: 'surprised', position: 'left' },
        { character: config.rightSprite, emotion: 'surprised', position: 'right' },
      ],
      dialog: [
        {
          speaker: 'tori',
          variant: 'whispers',
          text: '"...Chicharon?"',
          internal: '[The word slips out. She doesn\'t know why. It feels right. It feels like home.]',
        },
      ],
      autoAdvanceDelay: 3000,
      next: 'epilogue-ronnie-freeze',
    },

    // Ronnie Freezes
    {
      id: 'epilogue-ronnie-freeze',
      background: 'apartment',
      sprites: [
        { character: config.leftSprite, emotion: 'sad', position: 'left' },
        { character: config.rightSprite, emotion: 'sad', position: 'right' },
      ],
      dialog: [
        {
          speaker: 'ronnie',
          variant: 'internal',
          text: '"You... you haven\'t called me that in..."',
          internal: '[His voice breaks. She doesn\'t remember. The Echoes gave everything for this. But some things transcend even memory. Some things the heart just knows.]',
        },
      ],
      autoAdvanceDelay: 3500,
      next: 'epilogue-dejavu',
    },

    // Deja Vu
    {
      id: 'epilogue-dejavu',
      background: 'apartment',
      sprites: [
        { character: config.leftSprite, emotion: 'neutral', position: 'left' },
        { character: config.rightSprite, emotion: 'neutral', position: 'right' },
      ],
      dialog: [
        {
          speaker: 'tori',
          text: '"...Weird. Deja vu, I guess."',
        },
      ],
      autoAdvanceDelay: 2000,
      next: 'epilogue-knowing',
    },

    // The Knowing Smile - Final Scene
    {
      id: 'epilogue-knowing',
      background: 'apartment',
      sprites: [
        { character: config.leftSprite, emotion: 'happy', position: 'left' },
        { character: config.rightSprite, emotion: 'happy', position: 'right' },
      ],
      dialog: [
        {
          speaker: 'ronnie',
          text: '"Must have been another timeline."',
          internal: '[The loop is closed. This version succeeded. The Old Man never has to go back. Love wins.]',
        },
        {
          speaker: 'narrator',
          text: '[Fade to white.]',
          internal: '[Credits roll. No retry prompt. This is the escape from the loop.]',
        },
      ],
      effects: [
        { type: 'fadeOut', duration: 3000 },
      ],
      autoAdvanceDelay: 5000,
      // After this, show ending dialog with 'true' type
      next: 'ending-dialog-true',
    },
  ];
}

/**
 * Get a specific epilogue scene by ID
 */
export function getEpilogueScene(
  id: string,
  config: EpilogueConfig
): Scene | undefined {
  const scenes = getEpilogueScenes(config);
  return scenes.find(scene => scene.id === id);
}

/**
 * Get the starting scene ID for the epilogue
 */
export function getEpilogueStartScene(): string {
  return 'epilogue-start';
}

/**
 * Epilogue metadata
 */
export const EPILOGUE_META = {
  id: 'epilogue',
  name: 'Six Months Later',
  description: 'The shared True Ending epilogue - where both routes converge.',
  sceneCount: 10,
  triggers: {
    // This epilogue plays after the True Ending from either route
    fromRonnieRoute: 'ronnie-ending-true-finale',
    fromToriRoute: 'tori-ending-true-finale',
  },
} as const;
