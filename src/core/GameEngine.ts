import { EventBus } from './EventBus';
import { StateManager } from './StateManager';
import { GameConfig } from './GameConfig';
import { BootstrapTracker } from '@systems/BootstrapTracker';
import { SecretCodesSystem } from '@systems/SecretCodesSystem';
import { DevCommentarySystem } from '@systems/DevCommentarySystem';
import { AchievementSystem } from '@systems/AchievementSystem';
import { Scene, SceneId } from './types';

/**
 * GameEngine - Main Orchestrator
 * 
 * Manages the game loop, scene transitions, and system integration.
 * Refactored from V1 to use granular systems.
 */
export class GameEngine {
    private eventBus: EventBus;
    private stateManager: StateManager;

    private scenes: Map<SceneId, Scene>;
    private isInitialized: boolean = false;

    // Systems
    public bootstrapTracker: BootstrapTracker;
    public secretCodesSystem: SecretCodesSystem;
    public devCommentarySystem: DevCommentarySystem;
    public achievementSystem: AchievementSystem;

    constructor(
        eventBus: EventBus,
        stateManager: StateManager
    ) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.scenes = new Map();

        // Initialize Core Systems
        this.bootstrapTracker = new BootstrapTracker(stateManager);
        this.devCommentarySystem = new DevCommentarySystem(eventBus, stateManager);
        this.achievementSystem = new AchievementSystem(eventBus, stateManager);

        // SecretCodesSystem depends on others
        this.secretCodesSystem = new SecretCodesSystem(eventBus, stateManager, this.bootstrapTracker, this.devCommentarySystem);
    }

    /**
     * Initialize the engine
     */
    async init(): Promise<void> {
        if (this.isInitialized) return;

        // Load initial state if needed
        // this.stateManager.load(); 

        this.isInitialized = true;
        console.log(`🚀 GameEngine initialized (v${GameConfig.VERSION.CURRENT})`);
    }

    /**
     * Register a scene definition
     */
    registerScene(scene: Scene): void {
        if (this.scenes.has(scene.id)) {
            console.warn(`Scene ${scene.id} already registered. Overwriting.`);
        }
        this.scenes.set(scene.id, scene);
    }

    /**
     * Load a specific scene
     */
    async loadScene(sceneId: SceneId): Promise<void> {
        const scene = this.scenes.get(sceneId);

        if (!scene) {
            console.error(`❌ Scene not found: ${sceneId}`);
            // Fallback or error handling
            return;
        }

        // 1. Update State
        this.stateManager.set('currentScene', sceneId);

        // 2. Emit Load Event
        this.eventBus.emit('scene:load', { sceneId });

        // 3. Handle Tether Impact
        if (scene.tetherImpact) {
            // Logic to update tether would go here via TetherSystem (Phase 3)
            // For now, allow direct state ref
            const currentTether = this.stateManager.get('tetherLevel') as number || 100;
            this.stateManager.set('tetherLevel', Math.max(0, Math.min(100, currentTether + scene.tetherImpact)));
        }

        // 4. Trigger Scene Haptics (if any specific one defined in scene, or generic)
        // V1 didn't have auto-haptics for every scene load, but maybe visuals

        console.log(`loaded scene: ${sceneId}`);
    }

    /**
     * Start the game
     */
    async start(): Promise<void> {
        if (!this.isInitialized) await this.init();

        // Determine start scene (logic for save/load or new game)
        // Default to 'start' or whatever config says
        // For now, placeholder
        // await this.loadScene('start'); 
    }

    // Accessors for testing
    getScene(id: SceneId): Scene | undefined {
        return this.scenes.get(id);
    }
}
