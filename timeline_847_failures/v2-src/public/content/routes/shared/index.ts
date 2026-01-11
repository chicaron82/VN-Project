/**
 * UV7 V2 Shared Prologue
 *
 * The prologue that plays before route selection.
 * Shows: Street Bump -> Old Man -> Home -> The Fall -> Route Select
 */

import type { Scene } from '../../../core/types.ts';

// Import JSON scenes
import streetBumpData from './prologue-scene1.json';
import oldManData from './prologue-old-man.json';
import homeData from './prologue-home.json';
import theFallData from './prologue-the-fall.json';

/**
 * All prologue scenes in order
 */
export const PROLOGUE_SCENES: Scene[] = [
  streetBumpData as Scene,
  oldManData as Scene,
  homeData as Scene,
  theFallData as Scene,
];

/**
 * Scene IDs in playback order
 */
export const PROLOGUE_ORDER = [
  'prologue-street-bump',
  'prologue-old-man',
  'prologue-home-arrival',
  'prologue-the-fall',
] as const;

/**
 * Get a prologue scene by ID
 */
export function getPrologueScene(id: string): Scene | undefined {
  return PROLOGUE_SCENES.find((scene) => scene.id === id);
}

/**
 * Get the first scene of the prologue
 */
export function getFirstPrologueScene(): Scene {
  return PROLOGUE_SCENES[0];
}

/**
 * Check if a scene ID is part of the prologue
 */
export function isPrologueScene(id: string): boolean {
  return PROLOGUE_ORDER.includes(id as (typeof PROLOGUE_ORDER)[number]);
}
