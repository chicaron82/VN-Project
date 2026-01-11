/**
 * UV7 V2 EffectsController
 *
 * Manages visual effects - glitch, shake, fade, VHS, etc.
 *
 * Features:
 * - Effect queue management
 * - CSS class-based effects
 * - Duration and intensity control
 * - Reduced motion support
 * - Haptic feedback integration
 */

import type { Effect, EffectType, GameSystem } from '../core/index.ts';
import { EventBus, eventBus } from '../core/EventBus.ts';
import { SettingsSystem, settingsSystem } from '../systems/SettingsSystem.ts';

interface ActiveEffect {
  effect: Effect;
  startTime: number;
  element: HTMLElement | null;
}

export interface EffectsControllerConfig {
  eventBus?: EventBus;
  settingsSystem?: SettingsSystem;
  targetElement?: HTMLElement;
}

// Effect CSS class mappings
const EFFECT_CLASSES: Record<EffectType, string> = {
  glitch: 'effect-glitch',
  fade: 'effect-fade',
  fadeIn: 'effect-fade-in',
  fadeOut: 'effect-fade-out',
  shake: 'effect-shake',
  flash: 'effect-flash',
  screenFlash: 'effect-screen-flash',
  static: 'effect-static',
  vhs: 'effect-vhs',
  redpulse: 'effect-redpulse',
  tetherdrain: 'effect-tetherdrain',
  haptic: 'effect-haptic',
  // V1 Visual Cues
  bodyHop: 'body-hop',
  tetherPull: 'tether-pull',
  denialShake: 'denial-shake',
  harshDenial: 'harsh-denial',
  timelineGlitch: 'timeline-glitch',
  chromaticSplit: 'chromatic-split',
  emergencyFlash: 'emergency-flash',
};

// Default durations in ms
const DEFAULT_DURATIONS: Record<EffectType, number> = {
  glitch: 500,
  fade: 1000,
  fadeIn: 500,
  fadeOut: 500,
  shake: 300,
  flash: 200,
  screenFlash: 150,
  static: 800,
  vhs: 600,
  redpulse: 400,
  tetherdrain: 1500,
  haptic: 100,
  // V1 Visual Cues
  bodyHop: 500,
  tetherPull: 400,
  denialShake: 500,
  harshDenial: 600,
  timelineGlitch: 600,
  chromaticSplit: 400,
  emergencyFlash: 500,
};

// Haptic patterns per effect
const HAPTIC_PATTERNS: Record<EffectType, number[]> = {
  glitch: [50, 30, 50, 30, 100],
  fade: [100],
  fadeIn: [50],
  fadeOut: [50],
  shake: [30, 20, 30, 20, 30],
  flash: [20],
  screenFlash: [30],
  static: [10, 10, 10, 10, 10, 10, 10],
  vhs: [40, 20, 40],
  redpulse: [100, 50, 100],
  tetherdrain: [200, 100, 200, 100, 300],
  haptic: [100],
  // V1 Visual Cues - Story emotion haptics
  bodyHop: [30, 50, 30, 100], // Double flicker pattern
  tetherPull: [150], // Single strong pulse
  denialShake: [50, 30, 50, 30, 50], // Triple buzz
  harshDenial: [100, 50, 100, 50, 150], // Heavy rejection
  timelineGlitch: [20, 20, 20, 100, 50], // Glitchy pattern
  chromaticSplit: [40, 20, 40], // Split pattern
  emergencyFlash: [100, 100, 100], // Urgent triple
};

export class EffectsController implements GameSystem {
  readonly name = 'EffectsController';

  private eventBus: EventBus;
  private settings: SettingsSystem;
  private targetElement: HTMLElement | null;

  private activeEffects = new Map<string, ActiveEffect>();
  private effectIdCounter = 0;

  constructor(config: EffectsControllerConfig = {}) {
    this.eventBus = config.eventBus ?? eventBus;
    this.settings = config.settingsSystem ?? settingsSystem;
    this.targetElement = config.targetElement ?? null;
  }

  // =========================================================================
  // LIFECYCLE
  // =========================================================================

  init(): void {
    // Set default target to document body if in browser
    if (typeof document !== 'undefined' && !this.targetElement) {
      this.targetElement = document.body;
    }
  }

  destroy(): void {
    this.stopAll();
  }

  // =========================================================================
  // EFFECT CONTROL
  // =========================================================================

  /**
   * Play an effect
   */
  play(effect: Effect, element?: HTMLElement): string {
    // Check for reduced motion
    if (this.settings.shouldReduceMotion() && this.isMotionEffect(effect.type)) {
      return '';
    }

    const id = `effect-${++this.effectIdCounter}`;
    const target = element ?? this.targetElement;
    const duration = effect.duration ?? DEFAULT_DURATIONS[effect.type];

    // Add CSS class
    if (target) {
      const className = this.getEffectClass(effect);
      target.classList.add(className);

      // Add intensity modifier if specified
      if (effect.intensity) {
        target.classList.add(`${className}--${effect.intensity}`);
      }
    }

    // Trigger haptic feedback
    this.triggerHaptic(effect.type);

    // Store active effect
    this.activeEffects.set(id, {
      effect,
      startTime: Date.now(),
      element: target,
    });

    this.eventBus.emit('effect:start', { effect });

    // Auto-remove after duration
    setTimeout(() => {
      this.stop(id);
    }, duration);

    return id;
  }

  /**
   * Play multiple effects in sequence
   */
  async playSequence(effects: Effect[]): Promise<void> {
    for (const effect of effects) {
      const duration = effect.duration ?? DEFAULT_DURATIONS[effect.type];
      this.play(effect);
      await this.delay(duration);
    }
  }

  /**
   * Play multiple effects simultaneously
   */
  playParallel(effects: Effect[]): string[] {
    return effects.map((effect) => this.play(effect));
  }

  /**
   * Stop a specific effect
   */
  stop(id: string): void {
    const active = this.activeEffects.get(id);
    if (!active) return;

    // Remove CSS class
    if (active.element) {
      const className = this.getEffectClass(active.effect);
      active.element.classList.remove(className);

      if (active.effect.intensity) {
        active.element.classList.remove(`${className}--${active.effect.intensity}`);
      }
    }

    this.activeEffects.delete(id);
    this.eventBus.emit('effect:complete', { effect: active.effect });
  }

  /**
   * Stop all active effects
   */
  stopAll(): void {
    for (const id of this.activeEffects.keys()) {
      this.stop(id);
    }
  }

  /**
   * Stop effects of a specific type
   */
  stopType(type: EffectType): void {
    for (const [id, active] of this.activeEffects) {
      if (active.effect.type === type) {
        this.stop(id);
      }
    }
  }

  // =========================================================================
  // CONVENIENCE METHODS
  // =========================================================================

  /**
   * Quick glitch effect
   */
  glitch(intensity: 'low' | 'medium' | 'high' = 'medium'): string {
    return this.play({ type: 'glitch', intensity });
  }

  /**
   * Screen shake effect
   */
  shake(intensity: 'low' | 'medium' | 'high' = 'medium'): string {
    if (!this.settings.shouldUseScreenShake()) return '';
    return this.play({ type: 'shake', intensity });
  }

  /**
   * Flash effect
   */
  flash(duration?: number): string {
    const effect: Effect = { type: 'flash' };
    if (duration !== undefined) effect.duration = duration;
    return this.play(effect);
  }

  /**
   * VHS distortion effect
   */
  vhs(duration?: number): string {
    const effect: Effect = { type: 'vhs' };
    if (duration !== undefined) effect.duration = duration;
    return this.play(effect);
  }

  /**
   * Static noise effect
   */
  static(duration?: number): string {
    const effect: Effect = { type: 'static' };
    if (duration !== undefined) effect.duration = duration;
    return this.play(effect);
  }

  /**
   * Red pulse (for tether critical)
   */
  redPulse(): string {
    return this.play({ type: 'redpulse' });
  }

  /**
   * Tether drain visual
   */
  tetherDrain(intensity: 'low' | 'medium' | 'high' = 'medium'): string {
    return this.play({ type: 'tetherdrain', intensity });
  }

  // =========================================================================
  // V1 VISUAL CUES - Story emotion effects
  // =========================================================================

  /**
   * Body hop effect (Tori consciousness transfer)
   */
  bodyHop(): string {
    return this.play({ type: 'bodyHop' });
  }

  /**
   * Tether pull effect (connection squeeze)
   */
  tetherPull(): string {
    return this.play({ type: 'tetherPull' });
  }

  /**
   * Denial shake (gentle "no" feedback)
   */
  denialShake(): string {
    return this.play({ type: 'denialShake' });
  }

  /**
   * Harsh denial (screen tilt for lockouts)
   */
  harshDenial(): string {
    return this.play({ type: 'harshDenial' });
  }

  /**
   * Timeline glitch (reality distortion)
   */
  timelineGlitch(): string {
    return this.play({ type: 'timelineGlitch' });
  }

  /**
   * Chromatic split (RGB aberration)
   */
  chromaticSplit(): string {
    return this.play({ type: 'chromaticSplit' });
  }

  /**
   * Emergency flash (red warning pulse)
   */
  emergencyFlash(): string {
    return this.play({ type: 'emergencyFlash' });
  }

  // =========================================================================
  // QUERIES
  // =========================================================================

  /**
   * Check if any effects are active
   */
  hasActiveEffects(): boolean {
    return this.activeEffects.size > 0;
  }

  /**
   * Check if a specific effect type is active
   */
  isEffectActive(type: EffectType): boolean {
    for (const active of this.activeEffects.values()) {
      if (active.effect.type === type) return true;
    }
    return false;
  }

  /**
   * Get all active effect types
   */
  getActiveEffects(): EffectType[] {
    return Array.from(this.activeEffects.values()).map((a) => a.effect.type);
  }

  // =========================================================================
  // PRIVATE
  // =========================================================================

  private getEffectClass(effect: Effect): string {
    return EFFECT_CLASSES[effect.type];
  }

  private isMotionEffect(type: EffectType): boolean {
    return [
      'shake',
      'glitch',
      'vhs',
      'static',
      'bodyHop',
      'denialShake',
      'harshDenial',
      'timelineGlitch',
      'chromaticSplit',
    ].includes(type);
  }

  private triggerHaptic(type: EffectType): void {
    if (!this.settings.shouldUseHaptics()) return;

    const pattern = HAPTIC_PATTERNS[type];
    if (pattern && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const effectsController = new EffectsController();
