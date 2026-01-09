/**
 * Tori Route - Complete Route Export
 *
 * Internal POV: Trapped inside the device, fighting to escape.
 * Three acts covering awakening, connection building, and three endings.
 */

import type { Scene } from '../../../core/types';
import { TORI_ACT1_SCENES, getToriAct1Scene, getToriAct1StartScene } from './act1';
import { TORI_ACT2_SCENES, getToriAct2Scene, getToriAct2StartScene } from './act2';
import { TORI_ACT3_SCENES, getToriAct3Scene, getToriAct3StartScene } from './act3';

// Combined scene array for easy iteration
export const TORI_ROUTE_SCENES: Scene[] = [
  ...TORI_ACT1_SCENES,
  ...TORI_ACT2_SCENES,
  ...TORI_ACT3_SCENES,
];

/**
 * Get a scene by ID from any act
 */
export function getToriScene(id: string): Scene | undefined {
  return (
    getToriAct1Scene(id) ??
    getToriAct2Scene(id) ??
    getToriAct3Scene(id)
  );
}

/**
 * Get the starting scene ID for the Tori route
 */
export function getToriRouteStartScene(): string {
  return getToriAct1StartScene();
}

/**
 * Get the starting scene ID for a specific act
 */
export function getToriActStartScene(act: 1 | 2 | 3): string {
  switch (act) {
    case 1:
      return getToriAct1StartScene();
    case 2:
      return getToriAct2StartScene();
    case 3:
      return getToriAct3StartScene();
  }
}

/**
 * Route metadata
 */
export const TORI_ROUTE_META = {
  id: 'tori' as const,
  name: "Tori's Route",
  description: 'Internal POV: Trapped inside the device, fighting to escape.',
  acts: 3,
  endings: [
    { id: 'true', name: 'True Ending', description: 'She came home.' },
    { id: 'bad', name: 'Bad Ending', description: 'The loop begins again.' },
    { id: 'digital_forever', name: 'Digital Forever', description: 'Together, eternally still.' },
  ],
  features: {
    tetherSystem: true, // Tori route uses the tether mechanic
    echoVoices: true,   // Echo Toris appear as guides/antagonists
    despairMechanic: true, // Despair can hijack control
  },
  themes: {
    primary: 'tori',
    endings: {
      true: 'trueEnding',
      bad: 'badEnding',
      digital_forever: 'digitalForever',
    },
  },
} as const;

// Re-export individual act exports
export {
  TORI_ACT1_SCENES,
  TORI_ACT2_SCENES,
  TORI_ACT3_SCENES,
  getToriAct1Scene,
  getToriAct2Scene,
  getToriAct3Scene,
  getToriAct1StartScene,
  getToriAct2StartScene,
  getToriAct3StartScene,
};
