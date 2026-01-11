/**
 * Ronnie Route - Complete Route Export
 *
 * External POV: Fighting to save Tori from outside the code.
 * Three acts covering discovery, loop mechanics, and three endings.
 */

import type { Scene } from '../../../core/types';
import { RONNIE_ACT1_SCENES, getRonnieAct1Scene, getRonnieAct1StartScene } from './act1';
import { RONNIE_ACT2_SCENES, getRonnieAct2Scene, getRonnieAct2StartScene } from './act2';
import { RONNIE_ACT3_SCENES, getRonnieAct3Scene, getRonnieAct3StartScene } from './act3';

// Combined scene array for easy iteration
export const RONNIE_ROUTE_SCENES: Scene[] = [
  ...RONNIE_ACT1_SCENES,
  ...RONNIE_ACT2_SCENES,
  ...RONNIE_ACT3_SCENES,
];

/**
 * Get a scene by ID from any act
 */
export function getRonnieScene(id: string): Scene | undefined {
  return (
    getRonnieAct1Scene(id) ??
    getRonnieAct2Scene(id) ??
    getRonnieAct3Scene(id)
  );
}

/**
 * Get the starting scene ID for the Ronnie route
 */
export function getRonnieRouteStartScene(): string {
  return getRonnieAct1StartScene();
}

/**
 * Get the starting scene ID for a specific act
 */
export function getRonnieActStartScene(act: 1 | 2 | 3): string {
  switch (act) {
    case 1:
      return getRonnieAct1StartScene();
    case 2:
      return getRonnieAct2StartScene();
    case 3:
      return getRonnieAct3StartScene();
  }
}

/**
 * Route metadata
 */
export const RONNIE_ROUTE_META = {
  id: 'ronnie' as const,
  name: "Ronnie's Route",
  description: 'External POV: Fighting to save Tori from outside the code.',
  acts: 3,
  endings: [
    { id: 'true', name: 'True Ending', description: 'She came home.' },
    { id: 'bad', name: 'Bad Ending', description: 'The loop begins again.' },
    { id: 'digital_forever', name: 'Digital Forever', description: 'Together, eternally still.' },
  ],
  themes: {
    primary: 'ronnie',
    endings: {
      true: 'trueEnding',
      bad: 'badEnding',
      digital_forever: 'digitalForever',
    },
  },
} as const;

// Re-export individual act exports
export {
  RONNIE_ACT1_SCENES,
  RONNIE_ACT2_SCENES,
  RONNIE_ACT3_SCENES,
  getRonnieAct1Scene,
  getRonnieAct2Scene,
  getRonnieAct3Scene,
  getRonnieAct1StartScene,
  getRonnieAct2StartScene,
  getRonnieAct3StartScene,
};
