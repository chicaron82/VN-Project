/**
 * UV7 V2 SceneRunner
 *
 * Orchestrates scene execution by coordinating controllers.
 * The "conductor" that reads a Scene and tells each controller what to do.
 *
 * Responsibilities:
 * - Execute scenes step by step
 * - Coordinate dialog, effects, and UI controllers
 * - Handle scene transitions
 * - Manage scene lifecycle
 *
 * Does NOT:
 * - Load scenes (RouteController does that)
 * - Display text (DialogController does that)
 * - Apply effects (EffectsController does that)
 * - Manage state (StateManager does that)
 */

import type { Scene, DialogEntry, Choice, Effect, GameSystem } from '../core/index.ts';
import { EventBus, eventBus } from '../core/EventBus.ts';
import { StateManager, stateManager } from '../core/StateManager.ts';
import { DialogController, dialogController } from './DialogController.ts';
import { EffectsController, effectsController } from './EffectsController.ts';
import { TetherController, tetherController } from './TetherController.ts';

// ============================================================================
// TYPES
// ============================================================================

export type ScenePhase =
  | 'idle'
  | 'entering'      // Setting up background, sprites
  | 'dialog'        // Playing through dialog entries
  | 'choosing'      // Waiting for player choice
  | 'transitioning' // Moving to next scene
  | 'complete';     // Scene finished

export interface SceneRunnerConfig {
  eventBus?: EventBus;
  stateManager?: StateManager;
  dialogController?: DialogController;
  effectsController?: EffectsController;
  tetherController?: TetherController;
}

export interface SceneCallbacks {
  /** Called when scene needs background changed */
  onBackground?: (backgroundId: string) => void;
  /** Called when scene needs music changed */
  onMusic?: (musicId: string | undefined) => void;
  /** Called when sprites need to be displayed */
  onSprites?: (sprites: Scene['sprites']) => void;
  /** Called when scene is fully complete and ready for next */
  onComplete?: (scene: Scene) => void;
  /** Called when transitioning to next scene */
  onTransition?: (nextSceneId: string) => void;
}

// ============================================================================
// SCENE RUNNER
// ============================================================================

export class SceneRunner implements GameSystem {
  readonly name = 'SceneRunner';

  private eventBus: EventBus;
  private stateManager: StateManager;
  private dialogCtrl: DialogController;
  private effectsCtrl: EffectsController;
  private tetherCtrl: TetherController;

  private currentScene: Scene | null = null;
  private phase: ScenePhase = 'idle';
  private callbacks: SceneCallbacks = {};

  private autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(config: SceneRunnerConfig = {}) {
    this.eventBus = config.eventBus ?? eventBus;
    this.stateManager = config.stateManager ?? stateManager;
    this.dialogCtrl = config.dialogController ?? dialogController;
    this.effectsCtrl = config.effectsController ?? effectsController;
    this.tetherCtrl = config.tetherController ?? tetherController;
  }

  // ==========================================================================
  // LIFECYCLE
  // ==========================================================================

  init(): void {
    this.setupEventListeners();
  }

  destroy(): void {
    this.stop();
  }

  // ==========================================================================
  // SCENE EXECUTION
  // ==========================================================================

  /**
   * Execute a scene
   */
  async run(scene: Scene, callbacks: SceneCallbacks = {}): Promise<void> {
    this.currentScene = scene;
    this.callbacks = callbacks;
    this.phase = 'entering';

    // Phase 1: Enter - set up visuals
    await this.enterScene(scene);

    // Phase 2: Dialog - if present
    if (scene.dialog && scene.dialog.length > 0) {
      this.phase = 'dialog';
      await this.runDialog(scene.dialog);
    }

    // Phase 3: Choices - if present (mutually exclusive with auto-advance)
    if (scene.choices && scene.choices.length > 0) {
      this.phase = 'choosing';
      await this.runChoices(scene.choices);
      // Choice handling will trigger transition
      return;
    }

    // Phase 4: Auto-advance or wait for player
    await this.handleSceneEnd(scene);
  }

  /**
   * Stop current scene execution
   */
  stop(): void {
    this.clearTimers();
    this.dialogCtrl.clear();
    this.phase = 'idle';
    this.currentScene = null;
    this.callbacks = {};
  }

  /**
   * Advance scene (player clicked/tapped)
   */
  advance(): void {
    switch (this.phase) {
      case 'dialog':
        this.dialogCtrl.advance();
        break;

      case 'complete':
        // Ready to transition
        this.transitionToNext();
        break;

      case 'choosing':
        // Can't advance during choice - must select
        break;

      default:
        break;
    }
  }

  // ==========================================================================
  // QUERIES
  // ==========================================================================

  getPhase(): ScenePhase {
    return this.phase;
  }

  getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  isRunning(): boolean {
    return this.phase !== 'idle';
  }

  isWaitingForInput(): boolean {
    return this.phase === 'complete' || this.phase === 'choosing';
  }

  /**
   * Get tether controller reference (for decay management)
   */
  getTetherController(): TetherController {
    return this.tetherCtrl;
  }

  // ==========================================================================
  // SCENE PHASES
  // ==========================================================================

  private async enterScene(scene: Scene): Promise<void> {
    // Background
    if (scene.background && this.callbacks.onBackground) {
      this.callbacks.onBackground(scene.background);
    }

    // Music
    if (this.callbacks.onMusic) {
      this.callbacks.onMusic(scene.music);
    }

    // Sprites
    if (scene.sprites && this.callbacks.onSprites) {
      this.callbacks.onSprites(scene.sprites);
    }

    // Effects at scene start
    if (scene.effects) {
      await this.runEffects(scene.effects);
    }

    // Tether impact
    if (scene.tetherImpact) {
      this.stateManager.adjustTether(scene.tetherImpact, `scene: ${scene.id}`);
    }

    // Emit ready event
    this.eventBus.emit('scene:ready', { sceneId: scene.id });
  }

  private runDialog(entries: DialogEntry[]): Promise<void> {
    return new Promise((resolve) => {
      // Listen for dialog completion
      const unsubscribe = this.eventBus.on('dialog:complete', () => {
        unsubscribe();
        resolve();
      });

      // Start dialog
      this.dialogCtrl.startDialog(entries);
    });
  }

  private runChoices(choices: Choice[]): Promise<Choice> {
    return new Promise((resolve) => {
      // Filter choices by conditions
      const visibleChoices = this.filterChoicesByCondition(choices);

      if (visibleChoices.length === 0) {
        // No valid choices - should not happen but handle gracefully
        console.warn('No valid choices available after filtering');
        resolve(choices[0]); // Fall back to first choice
        return;
      }

      // Show choices and wait for selection
      this.dialogCtrl.showChoices(visibleChoices, (choice) => {
        this.phase = 'transitioning';

        // Apply choice effects
        this.applyChoiceEffects(choice);

        // Transition to next scene
        if (this.callbacks.onTransition) {
          this.callbacks.onTransition(choice.next);
        }

        resolve(choice);
      });
    });
  }

  private async handleSceneEnd(scene: Scene): Promise<void> {
    this.phase = 'complete';

    // Check for auto-advance
    if (scene.autoAdvanceDelay) {
      this.autoAdvanceTimer = setTimeout(() => {
        this.transitionToNext();
      }, scene.autoAdvanceDelay);
    } else {
      // Wait for player input
      if (this.callbacks.onComplete) {
        this.callbacks.onComplete(scene);
      }
    }
  }

  private transitionToNext(): void {
    if (!this.currentScene) return;

    const scene = this.currentScene;
    this.phase = 'transitioning';

    // Determine next scene
    const nextSceneId = this.resolveNextScene(scene);

    if (nextSceneId) {
      if (this.callbacks.onTransition) {
        this.callbacks.onTransition(nextSceneId);
      }
    } else {
      // No next scene - end of route or special action needed
      this.eventBus.emit('scene:complete', { sceneId: scene.id });
      this.phase = 'idle';
    }
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  private async runEffects(effects: Effect[]): Promise<void> {
    // Run effects in parallel
    const effectPromises = effects.map((effect) => {
      return new Promise<void>((resolve) => {
        this.effectsCtrl.play(effect);
        // Resolve after effect duration
        const duration = effect.duration ?? 500;
        setTimeout(resolve, duration);
      });
    });

    await Promise.all(effectPromises);
  }

  private filterChoicesByCondition(choices: Choice[]): Choice[] {
    return choices.filter((choice) => {
      if (!choice.condition) return true;

      const { flag, counter, tether } = choice.condition;

      // Flag condition
      if (flag) {
        if (!this.stateManager.hasFlag(flag)) return false;
      }

      // Counter condition
      if (counter) {
        const value = this.stateManager.getCounter(counter.name);
        switch (counter.comparison) {
          case 'gte':
            if (value < counter.value) return false;
            break;
          case 'lte':
            if (value > counter.value) return false;
            break;
          case 'eq':
            if (value !== counter.value) return false;
            break;
        }
      }

      // Tether condition
      if (tether) {
        const level = this.stateManager.get('tetherLevel');
        switch (tether.comparison) {
          case 'gte':
            if (level < tether.value) return false;
            break;
          case 'lte':
            if (level > tether.value) return false;
            break;
          case 'eq':
            if (level !== tether.value) return false;
            break;
        }
      }

      return true;
    });
  }

  private applyChoiceEffects(choice: Choice): void {
    // Tether cost
    if (choice.tetherCost) {
      this.stateManager.adjustTether(-choice.tetherCost, `choice: ${choice.text}`);
    }

    // Flags
    if (choice.flags) {
      for (const flag of choice.flags) {
        if (flag.value === 'toggle') {
          this.stateManager.toggleFlag(flag.name);
        } else {
          this.stateManager.setFlag(flag.name, flag.value);
        }
      }
    }

    // Counters
    if (choice.counters) {
      for (const counter of choice.counters) {
        const current = this.stateManager.getCounter(counter.name);
        switch (counter.operation) {
          case 'set':
            this.stateManager.setCounter(counter.name, counter.value);
            break;
          case 'add':
            this.stateManager.setCounter(counter.name, current + counter.value);
            break;
          case 'subtract':
            this.stateManager.setCounter(counter.name, current - counter.value);
            break;
        }
      }
    }
  }

  private resolveNextScene(scene: Scene): string | null {
    if (!scene.next) return null;

    if (typeof scene.next === 'string') {
      return scene.next;
    }

    // Conditional next
    const conditional = scene.next;
    for (const { condition, sceneId } of conditional.conditions) {
      // Check flag
      if (condition.flag && this.stateManager.hasFlag(condition.flag)) {
        return sceneId;
      }

      // Check counter
      if (condition.counter) {
        const value = this.stateManager.getCounter(condition.counter.name);
        let matches = false;
        switch (condition.counter.comparison) {
          case 'gte':
            matches = value >= condition.counter.value;
            break;
          case 'lte':
            matches = value <= condition.counter.value;
            break;
          case 'eq':
            matches = value === condition.counter.value;
            break;
        }
        if (matches) return sceneId;
      }

      // Check tether
      if (condition.tether) {
        const level = this.stateManager.get('tetherLevel');
        let matches = false;
        switch (condition.tether.comparison) {
          case 'gte':
            matches = level >= condition.tether.value;
            break;
          case 'lte':
            matches = level <= condition.tether.value;
            break;
          case 'eq':
            matches = level === condition.tether.value;
            break;
        }
        if (matches) return sceneId;
      }
    }

    return conditional.default;
  }

  private clearTimers(): void {
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
  }

  private setupEventListeners(): void {
    // Listen for dialog complete to advance scene
    this.eventBus.on('dialog:complete', () => {
      if (this.phase === 'dialog' && this.currentScene) {
        // Dialog done, check for choices or end
        if (this.currentScene.choices && this.currentScene.choices.length > 0) {
          this.phase = 'choosing';
          void this.runChoices(this.currentScene.choices);
        } else {
          void this.handleSceneEnd(this.currentScene);
        }
      }
    });
  }
}

// Singleton instance
export const sceneRunner = new SceneRunner();
