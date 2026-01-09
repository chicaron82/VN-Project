/**
 * UV7 V2 RouteController
 *
 * Manages route/act/scene navigation.
 *
 * Features:
 * - Route selection and initialization
 * - Act progression
 * - Scene loading and transitions
 * - Navigation history
 */

import type { Scene, RouteId, ActNumber, GameSystem } from '../core/index.ts';
import { EventBus, eventBus } from '../core/EventBus.ts';
import { StateManager, stateManager } from '../core/StateManager.ts';
import { AssetLoader, assetLoader } from '../systems/AssetLoader.ts';
import { validateScene } from '../utils/validation.ts';
import type { SceneRunner, SceneCallbacks } from './SceneRunner.ts';

export interface RouteControllerConfig {
  eventBus?: EventBus;
  stateManager?: StateManager;
  assetLoader?: AssetLoader;
  contentBasePath?: string;
  /** Scene execution callbacks (background, music, sprites, etc.) */
  sceneCallbacks?: SceneCallbacks;
}

export class RouteController implements GameSystem {
  readonly name = 'RouteController';

  private eventBus: EventBus;
  private stateManager: StateManager;
  private assetLoader: AssetLoader;
  private contentBasePath: string;
  private sceneCallbacks: SceneCallbacks;

  private currentScene: Scene | null = null;
  private sceneCache = new Map<string, Scene>();
  private navigationHistory: string[] = [];

  /** Scene runner reference (set via setSceneRunner) */
  private sceneRunner: SceneRunner | null = null;

  constructor(config: RouteControllerConfig = {}) {
    this.eventBus = config.eventBus ?? eventBus;
    this.stateManager = config.stateManager ?? stateManager;
    this.assetLoader = config.assetLoader ?? assetLoader;
    this.contentBasePath = config.contentBasePath ?? '/content/routes';
    this.sceneCallbacks = config.sceneCallbacks ?? {};
  }

  /**
   * Set the scene runner for executing scenes.
   * Must be called after construction to avoid circular dependency.
   */
  setSceneRunner(runner: SceneRunner): void {
    this.sceneRunner = runner;
  }

  /**
   * Update scene callbacks (typically set by UI layer)
   */
  setSceneCallbacks(callbacks: SceneCallbacks): void {
    this.sceneCallbacks = { ...this.sceneCallbacks, ...callbacks };
  }

  // =========================================================================
  // LIFECYCLE
  // =========================================================================

  init(): void {
    this.setupEventListeners();
  }

  destroy(): void {
    this.sceneCache.clear();
    this.navigationHistory = [];
    this.currentScene = null;
  }

  // =========================================================================
  // ROUTE CONTROL
  // =========================================================================

  /**
   * Resume from saved state.
   * Loads the scene stored in StateManager without modifying state.
   */
  async resumeFromState(): Promise<void> {
    const sceneId = this.stateManager.get('currentScene');
    const route = this.stateManager.get('currentRoute');

    if (!sceneId) {
      console.warn('Cannot resume: no current scene in state');
      return;
    }

    // Load the scene (this will also run it if sceneRunner is set)
    await this.loadScene(sceneId);
    this.eventBus.emit('route:resume', { routeId: route, sceneId });
  }

  /**
   * Start a new route
   */
  async startRoute(routeId: RouteId): Promise<void> {
    this.stateManager.update({
      currentRoute: routeId,
      currentAct: 1,
      currentScene: '',
    });

    this.eventBus.emit('route:start', { routeId });

    // Load first scene of the route
    const firstSceneId = this.getFirstSceneId(routeId);
    await this.loadScene(firstSceneId);
  }

  /**
   * Change to a different act
   */
  async setAct(act: ActNumber): Promise<void> {
    const route = this.stateManager.get('currentRoute');
    if (!route) {
      throw new Error('Cannot set act: no route selected');
    }

    this.stateManager.set('currentAct', act);
    this.eventBus.emit('route:act:change', { routeId: route, act });

    // Load first scene of the new act
    const firstSceneId = this.getFirstSceneId(route, act);
    await this.loadScene(firstSceneId);
  }

  /**
   * Complete the current route with an ending
   */
  completeRoute(endingId: string): void {
    const route = this.stateManager.get('currentRoute');
    if (!route) return;

    const endings = this.stateManager.get('endings');
    const playthrough = this.stateManager.get('playthrough');

    this.stateManager.set('endings', [
      ...endings,
      {
        routeId: route,
        endingId,
        timestamp: Date.now(),
        playthrough,
      },
    ]);

    this.eventBus.emit('route:complete', { routeId: route, endingId });
  }

  // =========================================================================
  // SCENE NAVIGATION
  // =========================================================================

  /**
   * Load and transition to a scene
   */
  async loadScene(sceneId: string): Promise<Scene> {
    const route = this.stateManager.get('currentRoute');
    const act = this.stateManager.get('currentAct');

    this.eventBus.emit('scene:load', { sceneId });

    try {
      const scene = await this.fetchScene(sceneId, route, act);

      // Validate scene
      const validation = validateScene(scene);
      if (!validation.valid) {
        const errors = validation.errors.map((e) => `${e.path}: ${e.message}`).join(', ');
        throw new Error(`Invalid scene "${sceneId}": ${errors}`);
      }

      // Update state
      this.currentScene = scene;
      this.stateManager.set('currentScene', sceneId);
      this.stateManager.markSceneVisited(sceneId);
      this.navigationHistory.push(sceneId);

      // Apply scene state effects (flags, counters, notes, achievements)
      this.applySceneEffects(scene);

      // Execute scene through SceneRunner if available
      if (this.sceneRunner) {
        await this.sceneRunner.run(scene, {
          ...this.sceneCallbacks,
          onTransition: (nextSceneId) => {
            void this.loadScene(nextSceneId);
          },
          onComplete: (completedScene) => {
            this.eventBus.emit('scene:waiting', { sceneId: completedScene.id });
          },
        });
      } else {
        // Fallback: just emit ready event (legacy/testing mode)
        this.eventBus.emit('scene:ready', { sceneId });
      }

      return scene;
    } catch (error) {
      console.error(`Failed to load scene: ${sceneId}`, error);
      this.eventBus.emit('ui:notification', {
        message: `Failed to load scene: ${sceneId}`,
        type: 'error',
      });
      throw error;
    }
  }

  /**
   * Go to the next scene (based on current scene's `next` property)
   */
  async goToNext(): Promise<void> {
    if (!this.currentScene) return;

    const next = this.currentScene.next;
    if (!next) {
      // No next scene defined - might be end of route
      return;
    }

    this.eventBus.emit('scene:complete', { sceneId: this.currentScene.id });

    if (typeof next === 'string') {
      await this.loadScene(next);
    } else {
      // Conditional next
      const targetScene = this.resolveConditionalNext(next);
      await this.loadScene(targetScene);
    }
  }

  /**
   * Go back to previous scene (if history exists)
   */
  async goBack(): Promise<boolean> {
    if (this.navigationHistory.length <= 1) return false;

    // Remove current scene from history
    this.navigationHistory.pop();

    // Load previous scene
    const previousSceneId = this.navigationHistory[this.navigationHistory.length - 1];
    if (previousSceneId) {
      // Remove it too since loadScene will add it back
      this.navigationHistory.pop();
      await this.loadScene(previousSceneId);
      return true;
    }

    return false;
  }

  // =========================================================================
  // SCENE QUERIES
  // =========================================================================

  /**
   * Get current scene
   */
  getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  /**
   * Get current route
   */
  getCurrentRoute(): RouteId | null {
    return this.stateManager.get('currentRoute');
  }

  /**
   * Get current act
   */
  getCurrentAct(): ActNumber {
    return this.stateManager.get('currentAct');
  }

  /**
   * Get navigation history
   */
  getHistory(): readonly string[] {
    return [...this.navigationHistory];
  }

  /**
   * Check if can go back
   */
  canGoBack(): boolean {
    return this.navigationHistory.length > 1;
  }

  /**
   * Advance the current scene (player clicked/tapped).
   * Delegates to SceneRunner if available.
   */
  advance(): void {
    if (this.sceneRunner) {
      this.sceneRunner.advance();
    }
  }

  /**
   * Check if scene is waiting for player input
   */
  isWaitingForInput(): boolean {
    return this.sceneRunner?.isWaitingForInput() ?? false;
  }

  /**
   * Get current scene phase
   */
  getPhase(): string {
    return this.sceneRunner?.getPhase() ?? 'idle';
  }

  // =========================================================================
  // PRIVATE
  // =========================================================================

  private async fetchScene(
    sceneId: string,
    route: RouteId | null,
    act: ActNumber
  ): Promise<Scene> {
    // Check cache first
    const cacheKey = `${route}-${act}-${sceneId}`;
    if (this.sceneCache.has(cacheKey)) {
      return this.sceneCache.get(cacheKey)!;
    }

    // Determine path based on scene ID pattern
    let path: string;
    if (sceneId.startsWith('prologue-')) {
      path = `${this.contentBasePath}/shared/${sceneId}.json`;
    } else if (route) {
      path = `${this.contentBasePath}/${route}/act${act}/${sceneId}.json`;
    } else {
      path = `${this.contentBasePath}/shared/${sceneId}.json`;
    }

    const scene = await this.assetLoader.loadJSON<Scene>(path);
    this.sceneCache.set(cacheKey, scene);

    return scene;
  }

  private getFirstSceneId(route: RouteId, act: ActNumber = 1): string {
    // Convention: first scene is route-act-start
    return `${route}-act${act}-start`;
  }

  private resolveConditionalNext(conditional: {
    conditions: Array<{ condition: { flag?: string }; sceneId: string }>;
    default: string;
  }): string {
    for (const { condition, sceneId } of conditional.conditions) {
      if (condition.flag && this.stateManager.hasFlag(condition.flag)) {
        return sceneId;
      }
    }
    return conditional.default;
  }

  private applySceneEffects(scene: Scene): void {
    // Apply flags
    if (scene.flags) {
      for (const flag of scene.flags) {
        if (flag.value === 'toggle') {
          this.stateManager.toggleFlag(flag.name);
        } else {
          this.stateManager.setFlag(flag.name, flag.value);
        }
      }
    }

    // Apply counters
    if (scene.counters) {
      for (const counter of scene.counters) {
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

    // Apply tether impact
    if (scene.tetherImpact) {
      this.stateManager.adjustTether(scene.tetherImpact, `scene: ${scene.id}`);
    }

    // Unlock note
    if (scene.unlockNote) {
      this.stateManager.unlockNote(scene.unlockNote);
    }

    // Unlock achievement
    if (scene.unlockAchievement) {
      this.stateManager.unlockAchievement(scene.unlockAchievement);
    }
  }

  private setupEventListeners(): void {
    // Handle choice navigation
    this.eventBus.on('choice:selected', ({ choice }) => {
      void this.loadScene(choice.next);
    });
  }
}

// Singleton instance
export const routeController = new RouteController();
