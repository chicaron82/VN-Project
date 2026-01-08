/**
 * UV7 V2 GameEngine
 *
 * The main orchestrator that coordinates all game systems.
 * Handles initialization, lifecycle, and system communication.
 *
 * Features:
 * - System registration and lifecycle management
 * - Scene loading with validation
 * - Game loop coordination
 * - Error handling and recovery
 */

import type { Scene, RouteId, ActNumber, GameSystem } from './types.ts';
import { EventBus, eventBus } from './EventBus.ts';
import { StateManager, stateManager } from './StateManager.ts';

export interface SceneLoader {
  loadScene(routeId: RouteId, act: ActNumber, sceneId: string): Promise<Scene>;
  validateScene(scene: unknown): scene is Scene;
}

export interface GameEngineConfig {
  eventBus?: EventBus;
  stateManager?: StateManager;
  sceneLoader?: SceneLoader;
  debug?: boolean;
}

type EngineState = 'uninitialized' | 'initializing' | 'ready' | 'running' | 'paused' | 'error';

export class GameEngine {
  private eventBus: EventBus;
  private stateManager: StateManager;
  private sceneLoader: SceneLoader | null = null;

  private systems: Map<string, GameSystem> = new Map();
  private engineState: EngineState = 'uninitialized';
  private currentScene: Scene | null = null;
  private debug: boolean;

  constructor(config: GameEngineConfig = {}) {
    this.eventBus = config.eventBus ?? eventBus;
    this.stateManager = config.stateManager ?? stateManager;
    this.sceneLoader = config.sceneLoader ?? null;
    this.debug = config.debug ?? false;

    this.setupEventListeners();
  }

  // =========================================================================
  // LIFECYCLE
  // =========================================================================

  /**
   * Initialize the game engine and all registered systems
   */
  async init(): Promise<void> {
    if (this.engineState !== 'uninitialized') {
      throw new Error(`Cannot init: engine is ${this.engineState}`);
    }

    this.engineState = 'initializing';
    this.log('Initializing game engine...');

    try {
      // Initialize all registered systems
      for (const [name, system] of this.systems) {
        this.log(`Initializing system: ${name}`);
        await system.init?.();
      }

      this.engineState = 'ready';
      this.log('Game engine ready');
    } catch (error) {
      this.engineState = 'error';
      this.log('Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Start the game (begin playing)
   */
  start(): void {
    if (this.engineState !== 'ready' && this.engineState !== 'paused') {
      throw new Error(`Cannot start: engine is ${this.engineState}`);
    }

    this.engineState = 'running';
    this.log('Game started');
  }

  /**
   * Pause the game
   */
  pause(): void {
    if (this.engineState !== 'running') {
      return;
    }

    this.engineState = 'paused';
    this.stateManager.set('tetherPaused', true);
    this.eventBus.emit('tether:decay:pause');
    this.log('Game paused');
  }

  /**
   * Resume the game
   */
  resume(): void {
    if (this.engineState !== 'paused') {
      return;
    }

    this.engineState = 'running';
    this.stateManager.set('tetherPaused', false);
    this.eventBus.emit('tether:decay:resume');
    this.log('Game resumed');
  }

  /**
   * Destroy the engine and cleanup all systems
   */
  destroy(): void {
    this.log('Destroying game engine...');

    // Destroy systems in reverse order
    const systemsArray = Array.from(this.systems.entries()).reverse();
    for (const [name, system] of systemsArray) {
      this.log(`Destroying system: ${name}`);
      system.destroy?.();
    }

    this.systems.clear();
    this.currentScene = null;
    this.engineState = 'uninitialized';
  }

  // =========================================================================
  // SYSTEM MANAGEMENT
  // =========================================================================

  /**
   * Register a game system
   */
  registerSystem(system: GameSystem): void {
    if (this.systems.has(system.name)) {
      throw new Error(`System already registered: ${system.name}`);
    }

    this.systems.set(system.name, system);
    this.log(`Registered system: ${system.name}`);
  }

  /**
   * Get a registered system by name
   */
  getSystem<T extends GameSystem>(name: string): T | undefined {
    return this.systems.get(name) as T | undefined;
  }

  /**
   * Set the scene loader
   */
  setSceneLoader(loader: SceneLoader): void {
    this.sceneLoader = loader;
  }

  // =========================================================================
  // SCENE MANAGEMENT
  // =========================================================================

  /**
   * Load and transition to a scene
   */
  async loadScene(sceneId: string): Promise<void> {
    const route = this.stateManager.get('currentRoute');
    const act = this.stateManager.get('currentAct');

    if (!route) {
      throw new Error('Cannot load scene: no route selected');
    }

    if (!this.sceneLoader) {
      throw new Error('Cannot load scene: no scene loader configured');
    }

    this.log(`Loading scene: ${sceneId}`);
    this.eventBus.emit('scene:load', { sceneId });

    try {
      const scene = await this.sceneLoader.loadScene(route, act, sceneId);

      if (!this.sceneLoader.validateScene(scene)) {
        throw new Error(`Invalid scene data: ${sceneId}`);
      }

      this.currentScene = scene;
      this.stateManager.set('currentScene', sceneId);
      this.stateManager.markSceneVisited(sceneId);

      // Apply scene flags/counters if any
      if (scene.flags) {
        for (const flag of scene.flags) {
          if (flag.value === 'toggle') {
            this.stateManager.toggleFlag(flag.name);
          } else {
            this.stateManager.setFlag(flag.name, flag.value);
          }
        }
      }

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

      // Apply tether impact if any
      if (scene.tetherImpact) {
        this.stateManager.adjustTether(scene.tetherImpact, `scene: ${sceneId}`);
      }

      // Unlock note if specified
      if (scene.unlockNote) {
        this.stateManager.unlockNote(scene.unlockNote);
      }

      // Unlock achievement if specified
      if (scene.unlockAchievement) {
        this.stateManager.unlockAchievement(scene.unlockAchievement);
      }

      this.eventBus.emit('scene:ready', { sceneId });
      this.log(`Scene ready: ${sceneId}`);
    } catch (error) {
      this.log('Scene load failed:', error);
      this.eventBus.emit('ui:notification', {
        message: `Failed to load scene: ${sceneId}`,
        type: 'error',
      });
      throw error;
    }
  }

  /**
   * Get the current scene
   */
  getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  /**
   * Complete the current scene and advance
   */
  completeScene(): void {
    if (!this.currentScene) {
      return;
    }

    const sceneId = this.currentScene.id;
    this.eventBus.emit('scene:complete', { sceneId });

    // Handle next scene navigation
    const next = this.currentScene.next;
    if (next) {
      if (typeof next === 'string') {
        // Simple next scene
        void this.loadScene(next);
      } else {
        // Conditional next
        const targetScene = this.resolveConditionalNext(next);
        void this.loadScene(targetScene);
      }
    }
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

  // =========================================================================
  // ROUTE MANAGEMENT
  // =========================================================================

  /**
   * Start a new route
   */
  startRoute(routeId: RouteId): void {
    this.log(`Starting route: ${routeId}`);

    this.stateManager.update({
      currentRoute: routeId,
      currentAct: 1,
      currentScene: '',
    });

    this.eventBus.emit('route:start', { routeId });
  }

  /**
   * Change to a different act
   */
  setAct(act: ActNumber): void {
    const route = this.stateManager.get('currentRoute');
    if (!route) {
      return;
    }

    this.stateManager.set('currentAct', act);
    this.eventBus.emit('route:act:change', { routeId: route, act });
  }

  /**
   * Complete the current route
   */
  completeRoute(endingId: string): void {
    const route = this.stateManager.get('currentRoute');
    if (!route) {
      return;
    }

    // Record ending
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
    this.log(`Route complete: ${route} - ${endingId}`);
  }

  // =========================================================================
  // GETTERS
  // =========================================================================

  getState(): EngineState {
    return this.engineState;
  }

  isRunning(): boolean {
    return this.engineState === 'running';
  }

  isPaused(): boolean {
    return this.engineState === 'paused';
  }

  isReady(): boolean {
    return this.engineState === 'ready' || this.engineState === 'running' || this.engineState === 'paused';
  }

  // =========================================================================
  // PRIVATE
  // =========================================================================

  private setupEventListeners(): void {
    // Handle choice selection
    this.eventBus.on('choice:selected', ({ choice }) => {
      if (choice.tetherCost) {
        this.stateManager.adjustTether(choice.tetherCost, 'choice');
      }

      if (choice.flags) {
        for (const flag of choice.flags) {
          if (flag.value === 'toggle') {
            this.stateManager.toggleFlag(flag.name);
          } else {
            this.stateManager.setFlag(flag.name, flag.value);
          }
        }
      }

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

      // Navigate to next scene
      void this.loadScene(choice.next);
    });
  }

  private log(...args: unknown[]): void {
    if (this.debug) {
      console.log('[GameEngine]', ...args);
    }
  }
}

// Singleton instance
export const gameEngine = new GameEngine({ debug: import.meta.env?.DEV ?? false });
