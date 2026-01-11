/**
 * UV7 V2 TetherController
 *
 * Manages the tether system - the core mechanic of UV7.
 * Tether represents the connection strength and decays over time.
 *
 * Features:
 * - Time-based decay with configurable rate
 * - Pause/resume during menus and dialogs
 * - Critical threshold warnings
 * - Visual feedback integration
 */

import type { GameSystem } from '../core/index.ts';
import { EventBus, eventBus } from '../core/EventBus.ts';
import { StateManager, stateManager } from '../core/StateManager.ts';

const DEFAULT_DECAY_RATE = 0.5; // Points per second
const CRITICAL_THRESHOLD = 20;
const DANGER_THRESHOLD = 40;

export interface TetherControllerConfig {
  eventBus?: EventBus;
  stateManager?: StateManager;
  decayRate?: number;
  criticalThreshold?: number;
  dangerThreshold?: number;
}

export class TetherController implements GameSystem {
  readonly name = 'TetherController';

  private eventBus: EventBus;
  private stateManager: StateManager;
  private decayRate: number;
  private criticalThreshold: number;
  private dangerThreshold: number;

  private decayInterval: ReturnType<typeof setInterval> | null = null;
  private lastDecayTime: number = 0;
  private isDecaying: boolean = false;

  constructor(config: TetherControllerConfig = {}) {
    this.eventBus = config.eventBus ?? eventBus;
    this.stateManager = config.stateManager ?? stateManager;
    this.decayRate = config.decayRate ?? DEFAULT_DECAY_RATE;
    this.criticalThreshold = config.criticalThreshold ?? CRITICAL_THRESHOLD;
    this.dangerThreshold = config.dangerThreshold ?? DANGER_THRESHOLD;
  }

  // =========================================================================
  // LIFECYCLE
  // =========================================================================

  init(): void {
    this.setupEventListeners();
  }

  destroy(): void {
    this.stopDecay();
  }

  // =========================================================================
  // DECAY CONTROL
  // =========================================================================

  /**
   * Start tether decay
   */
  startDecay(rate?: number): void {
    if (this.isDecaying) return;

    const actualRate = rate ?? this.decayRate;
    this.stateManager.update({
      tetherDecayRate: actualRate,
      tetherPaused: false,
    });

    this.isDecaying = true;
    this.lastDecayTime = Date.now();

    // Decay every 100ms for smooth updates
    this.decayInterval = setInterval(() => this.tick(), 100);

    this.eventBus.emit('tether:decay:start', { rate: actualRate });
  }

  /**
   * Stop tether decay completely
   */
  stopDecay(): void {
    if (this.decayInterval) {
      clearInterval(this.decayInterval);
      this.decayInterval = null;
    }

    this.isDecaying = false;
    this.stateManager.update({
      tetherDecayRate: 0,
      tetherPaused: true,
    });
  }

  /**
   * Pause decay (keeps rate, just stops ticking)
   */
  pause(): void {
    if (!this.isDecaying) return;

    if (this.decayInterval) {
      clearInterval(this.decayInterval);
      this.decayInterval = null;
    }

    this.stateManager.set('tetherPaused', true);
    this.eventBus.emit('tether:decay:pause');
  }

  /**
   * Resume decay after pause
   */
  resume(): void {
    if (!this.stateManager.get('tetherPaused')) return;
    if (this.stateManager.get('tetherDecayRate') === 0) return;

    this.stateManager.set('tetherPaused', false);
    this.lastDecayTime = Date.now();
    this.decayInterval = setInterval(() => this.tick(), 100);

    this.eventBus.emit('tether:decay:resume');
  }

  /**
   * Set decay rate
   */
  setDecayRate(rate: number): void {
    this.decayRate = rate;
    this.stateManager.set('tetherDecayRate', rate);
  }

  // =========================================================================
  // TETHER MANIPULATION
  // =========================================================================

  /**
   * Get current tether level
   */
  getLevel(): number {
    return this.stateManager.get('tetherLevel');
  }

  /**
   * Add tether (positive delta)
   */
  add(amount: number, reason?: string): void {
    this.stateManager.adjustTether(Math.abs(amount), reason);
  }

  /**
   * Drain tether (negative delta)
   */
  drain(amount: number, reason?: string): void {
    this.stateManager.adjustTether(-Math.abs(amount), reason);
  }

  /**
   * Set tether to specific level
   */
  setLevel(level: number, reason?: string): void {
    const current = this.getLevel();
    const delta = level - current;
    this.stateManager.adjustTether(delta, reason);
  }

  /**
   * Reset tether to full
   */
  reset(): void {
    this.setLevel(100, 'reset');
  }

  // =========================================================================
  // STATUS CHECKS
  // =========================================================================

  /**
   * Check if tether is in critical state
   */
  isCritical(): boolean {
    return this.getLevel() <= this.criticalThreshold;
  }

  /**
   * Check if tether is in danger zone
   */
  isInDanger(): boolean {
    return this.getLevel() <= this.dangerThreshold;
  }

  /**
   * Check if tether is empty
   */
  isEmpty(): boolean {
    return this.getLevel() <= 0;
  }

  /**
   * Check if decay is active
   */
  isDecayActive(): boolean {
    return this.isDecaying && !this.stateManager.get('tetherPaused');
  }

  /**
   * Get time until empty at current decay rate
   */
  getTimeUntilEmpty(): number | null {
    const rate = this.stateManager.get('tetherDecayRate');
    if (rate <= 0) return null;

    const current = this.getLevel();
    return (current / rate) * 1000; // milliseconds
  }

  // =========================================================================
  // PRIVATE
  // =========================================================================

  private tick(): void {
    if (this.stateManager.get('tetherPaused')) return;

    const now = Date.now();
    const elapsed = (now - this.lastDecayTime) / 1000; // seconds
    this.lastDecayTime = now;

    const rate = this.stateManager.get('tetherDecayRate');
    const decay = rate * elapsed;

    if (decay > 0) {
      this.stateManager.adjustTether(-decay, 'decay');
    }
  }

  private setupEventListeners(): void {
    // Pause during menus
    this.eventBus.on('ui:menu:open', () => {
      this.pause();
    });

    this.eventBus.on('ui:menu:close', () => {
      this.resume();
    });

    // Listen for tether empty
    this.eventBus.on('tether:empty', () => {
      this.stopDecay();
    });
  }
}

// Singleton instance
export const tetherController = new TetherController();
