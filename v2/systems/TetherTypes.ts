/**
 * Tether System Types
 * Type definitions for the tether mechanics system.
 *
 * V2 Port: Faithful transcription from V1
 *
 * "The tether is her lifeline. Your attention is her oxygen."
 *
 * 848 is sacred. 💚🔥💀
 */

import type { DifficultyId } from './DifficultyProfiles';

/**
 * Tether system state for save/load
 */
export interface TetherState {
    level: number;
    difficulty: DifficultyId;
    holdOnCooldown: boolean;
    decayFrozen: boolean;
}

/**
 * Echo state (legacy from V1 - now mostly handled by EchoMemorySystem)
 */
export interface EchoState {
    echo1: { name: string; mood: string; color: string; active: boolean };
    echo2: { name: string; mood: string; color: string; active: boolean };
    despair: { name: string; mood: string; color: string; active: boolean };
}
