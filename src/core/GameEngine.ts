import { EventBus } from './EventBus';
import { StateManager } from './StateManager';
import { GameConfig } from './GameConfig';
import { BootstrapTracker } from '@systems/BootstrapTracker';
import { SecretCodesSystem } from '@systems/SecretCodesSystem';
import { DevCommentarySystem } from '@systems/DevCommentarySystem';
import { AchievementSystem } from '@systems/AchievementSystem';
import { BacklogManager } from './BacklogManager';
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
    private currentScene: Scene | null = null;
    private isInitialized: boolean = false;

    // Systems
    public bootstrapTracker: BootstrapTracker;
    public secretCodesSystem: SecretCodesSystem;
    public devCommentarySystem: DevCommentarySystem;
    public achievementSystem: AchievementSystem;
    public backlogManager: BacklogManager;

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
        this.backlogManager = new BacklogManager(eventBus, stateManager);

        // SecretCodesSystem depends on others
        this.secretCodesSystem = new SecretCodesSystem(eventBus, stateManager, this.bootstrapTracker, this.devCommentarySystem);

        // Listen for dialog advancement
        this.eventBus.on('dialog:advance', () => this.advanceScene());

        // Listen for Time Travel (Backlog Jump)
        this.eventBus.on('state:restore', (data: { sceneId: string }) => {
            console.log(`[GameEngine] Time Travel initiated to: ${data.sceneId}`);
            this.loadScene(data.sceneId);
        });
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
        // DIZEE: Handle special scene IDs that trigger transitions
        if (sceneId === 'prologueComplete') {
            console.log('[GameEngine] Prologue complete - showing route select');
            this.eventBus.emit('ui:route_select', {});
            return;
        }

        const scene = this.scenes.get(sceneId);

        if (!scene) {
            console.error(`❌ Scene not found: ${sceneId}`);
            // Fallback or error handling
            return;
        }

        // Track current scene
        this.currentScene = scene;

        // 1. Update State
        this.stateManager.set('currentScene', sceneId);

        // Add to history
        const history = this.stateManager.get<string[]>('history') ?? [];
        history.push(sceneId);
        this.stateManager.set('history', history);

        // 2. Emit Load Event with full scene data
        this.eventBus.emit('scene:load', { sceneId });

        // 3. Emit dialog event for UI to display
        if (scene.text) {
            this.eventBus.emit('dialog:show', {
                entry: {
                    character: scene.character || 'Narration',
                    text: scene.text
                }
            });
        }

        // 4. Handle Tether Impact
        if (scene.tetherImpact) {
            const currentTether = this.stateManager.get<number>('tetherLevel') ?? 100;
            const newTether = Math.max(0, Math.min(100, currentTether + scene.tetherImpact));
            this.stateManager.set('tetherLevel', newTether);
            this.eventBus.emit('tether:change', {
                level: newTether,
                delta: scene.tetherImpact
            });
        }

        // 5. Handle scene effects
        if (scene.effects) {
            for (const effect of scene.effects) {
                if (effect.type === 'glitch') {
                    this.eventBus.emit('effect:glitch', { intensity: 1 });
                } else if (effect.type === 'shake') {
                    this.eventBus.emit('effect:shake', { intensity: 'medium' });
                }
            }
        }

        console.log(`[GameEngine] Loaded scene: ${sceneId}`);
    }

    /**
     * Advance to the next scene
     */
    advanceScene(): void {
        if (!this.currentScene) {
            console.warn('[GameEngine] No current scene to advance from');
            return;
        }

        // Check for choices first
        if (this.currentScene.choices && this.currentScene.choices.length > 0) {
            // Don't auto-advance - wait for choice selection
            console.log('[GameEngine] Scene has choices, waiting for selection');
            return;
        }

        // Get next scene ID
        const nextId = this.getNextSceneId(this.currentScene);

        if (nextId) {
            this.loadScene(nextId);
        } else {
            // End of route/scene chain
            console.log(`[GameEngine] Scene chain ended at: ${this.currentScene.id}`);
            this.eventBus.emit('scene:complete', { sceneId: this.currentScene.id });
        }
    }

    /**
     * Get the next scene ID from current scene
     */
    private getNextSceneId(scene: Scene): SceneId | null {
        if (!scene.next) return null;

        // Simple string next
        if (typeof scene.next === 'string') {
            return scene.next;
        }

        // Conditional next
        if (typeof scene.next === 'object' && 'default' in scene.next) {
            // Check conditions
            for (const cond of scene.next.conditions) {
                if (this.evaluateCondition(cond.if)) {
                    return cond.then;
                }
            }
            return scene.next.default;
        }

        return null;
    }

    /**
     * Evaluate a condition string (e.g., "flags.metRonnie")
     */
    private evaluateCondition(condition: string): boolean {
        // Simple flag check: "flags.someFlagName"
        if (condition.startsWith('flags.')) {
            const flagName = condition.slice(6);
            const flags = this.stateManager.get<Record<string, boolean>>('flags') ?? {};
            return flags[flagName] === true;
        }
        return false;
    }

    /**
     * Handle choice selection
     */
    selectChoice(choiceIndex: number): void {
        if (!this.currentScene?.choices) return;

        const choice = this.currentScene.choices[choiceIndex];
        if (!choice) return;

        // Apply tether cost
        if (choice.tetherCost) {
            const currentTether = this.stateManager.get<number>('tetherLevel') ?? 100;
            const newTether = Math.max(0, currentTether - choice.tetherCost);
            this.stateManager.set('tetherLevel', newTether);
            this.eventBus.emit('tether:change', {
                level: newTether,
                delta: -choice.tetherCost
            });
        }

        // Apply flags
        if (choice.flags) {
            const flags = this.stateManager.get<Record<string, boolean>>('flags') ?? {};
            for (const flagChange of choice.flags) {
                flags[flagChange.flag] = flagChange.value;
            }
            this.stateManager.set('flags', flags);
        }

        // Emit choice selected event
        this.eventBus.emit('choice:selected', {
            choiceId: `${this.currentScene.id}_choice_${choiceIndex}`,
            text: choice.text
        });

        // Navigate to next scene
        if (choice.next) {
            this.loadScene(choice.next);
        } else {
            // End of route
            this.eventBus.emit('scene:complete', { sceneId: this.currentScene.id });
        }
    }

    /**
     * Get current scene (for UI)
     */
    getCurrentScene(): Scene | null {
        return this.currentScene;
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
