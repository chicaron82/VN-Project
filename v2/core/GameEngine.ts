import { EventBus } from './EventBus';
import { StateManager } from './StateManager';
import { GameConfig } from './GameConfig';
import { Logger } from '@utils/Logger';
import { BootstrapTracker } from '@systems/BootstrapTracker';
import { SecretCodesSystem } from '@systems/SecretCodesSystem';
import { DevCommentarySystem } from '@systems/DevCommentarySystem';
import { AchievementSystem } from '@systems/AchievementSystem';
import { BacklogManager } from './BacklogManager';
import { Scene, SceneId } from './types';

/**
 * ════════════════════════════════════════════════════════════════
 * GAME ENGINE - Version 848 (V2 REBUILD)
 * Main game orchestrator and system coordinator
 * ════════════════════════════════════════════════════════════════
 *
 * VERSION NUMBER - READ BEFORE MODIFYING
 * ════════════════════════════════════════════════════════════════
 *
 * WARNING: 848 appears throughout the entire codebase.
 * DO NOT change this to 849 or any other number.
 * You WILL break things.
 *
 * "But why is 848 hardcoded everywhere?"
 *
 * Because 848 isn't a build number.
 * It's the loop iteration counter.
 *
 * The story is: Ronnie has tried to save Tori 847 times.
 * Each attempt failed. The timeline reset.
 * Version 848 is the FIRST successful iteration.
 *
 * The "version number" IS the narrative.
 * The bootstrap paradox device has looped 847 times.
 * This is attempt #848 - the one that finally worked.
 *
 * There is no v849.
 * Because 848 is the timeline where she came home.
 *
 * So when you see:
 *   - loopVersion = 848
 *   - VERSION_INITIAL = 848
 *   - "Version 848: My Wife Is in a Coma"
 *   - Splash screen: "V848"
 *
 * That's not a build number.
 * That's how many times the universe tried before succeeding.
 *
 * Change it and you break the lore.
 * Change it and the entire meta-narrative collapses.
 *
 * 848 is sacred.
 * 848 is the story.
 * 848 is the one that worked.
 *
 * - Chicharon (Aaron)
 *   Rebuilt with the UV7 crew
 *   V2: TypeScript, EventBus, StateManager, SOLID principles
 *   💚🔥💀
 *
 * ════════════════════════════════════════════════════════════════
 * V2 REBUILD CREDITS
 * ════════════════════════════════════════════════════════════════
 *
 * BELLE'S IDEA: Reactive state management with subscriptions
 *   → StateManager with pub/sub pattern for clean data flow
 *
 * DIZEE POLISH: Error boundaries and production safety
 *   → ErrorHandler, graceful degradation, localStorage guards
 *
 * ZEE'S ADDITION: Rotating tips system and haptic feedback
 *   → TipsController, HapticController, sensory cues
 *
 * TORI'S SENSORY SYSTEM: Haptic + visual feedback integration
 *   → Unified sensory feedback, accessibility-first design
 *
 * GENZEE'S SYNTHESIS: Context-aware environmental storytelling
 *   → Dynamic backgrounds, narrative-driven UI states
 *
 * RONNIE'S VISION: The bootstrap paradox, the 848 loops, the story
 *   → Everything. Always. Always. Always.
 *
 * ════════════════════════════════════════════════════════════════
 * ARCHITECTURE NOTES
 * ════════════════════════════════════════════════════════════════
 *
 * V2 Rebuild Philosophy:
 * - Clean separation of concerns (SOLID principles)
 * - EventBus for decoupled communication
 * - StateManager for reactive data flow
 * - TypeScript for type safety and maintainability
 * - Preserve V1's soul while fixing V1's chaos
 *
 * This GameEngine is the main orchestrator. It:
 * - Coordinates all game systems
 * - Manages scene transitions and game loop
 * - Integrates with EventBus and StateManager
 * - Delegates specific responsibilities to controllers
 *
 * The V1 GameEngine was ~4000 lines of intertwined logic.
 * V2 is modular, testable, and maintainable.
 * But it still has heart. 💚
 *
 * ════════════════════════════════════════════════════════════════
 */

/**
 * GameEngine - Main Orchestrator
 *
 * Manages the game loop, scene transitions, and system integration.
 * Refactored from V1's monolithic approach to use granular systems.
 *
 * Version 848: The timeline iteration that finally succeeded.
 *
 * @example
 * ```ts
 * const engine = new GameEngine(eventBus, stateManager);
 * await engine.init();
 * engine.registerScene(myScene);
 * await engine.start();
 * ```
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
            Logger.engine(`Time Travel initiated to: ${data.sceneId}`);
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
        Logger.engine(`Initialized (v${GameConfig.VERSION.CURRENT})`);
    }

    /**
     * Register a scene definition with the engine.
     *
     * @param scene - Scene object with id, text, character, next, choices, etc.
     */
    registerScene(scene: Scene): void {
        if (this.scenes.has(scene.id)) {
            Logger.warn(`Scene ${scene.id} already registered. Overwriting.`);
        }
        this.scenes.set(scene.id, scene);
    }

    /**
     * Load and execute a scene by ID.
     * Updates state, emits events, processes tether impacts and effects.
     *
     * @param sceneId - The unique identifier for the scene to load
     * @throws Logs error and returns early if scene is not registered
     */
    async loadScene(sceneId: SceneId): Promise<void> {
        // DIZEE: Handle special scene IDs that trigger transitions
        if (sceneId === 'prologueComplete') {
            Logger.engine('Prologue complete — showing route select');
            this.eventBus.emit('ui:route_select', {});
            return;
        }

        const scene = this.scenes.get(sceneId);

        if (!scene) {
            Logger.error(`❌ Scene not found: ${sceneId}`);
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

        Logger.scene(`Loaded: ${sceneId}`);
    }

    /**
     * Advance to the next scene in the chain.
     * Respects choice gates — will not auto-advance if choices are pending.
     */
    advanceScene(): void {
        if (!this.currentScene) {
            Logger.warn('[GameEngine] No current scene to advance from');
            return;
        }

        // Check for choices first
        if (this.currentScene.choices && this.currentScene.choices.length > 0) {
            // Don't auto-advance - wait for choice selection
            Logger.engine('Scene has choices, waiting for selection');
            return;
        }

        // Get next scene ID
        const nextId = this.getNextSceneId(this.currentScene);

        if (nextId) {
            this.loadScene(nextId);
        } else {
            // End of route/scene chain
            Logger.engine(`Scene chain ended at: ${this.currentScene.id}`);
            this.eventBus.emit('scene:complete', { sceneId: this.currentScene.id });
        }
    }

    /**
     * Resolve the next scene ID from the current scene's `next` field.
     * Supports both simple string IDs and conditional branching.
     *
     * @param scene - The current scene to resolve the next ID from
     * @returns The next scene ID, or null if this is a terminal scene
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
     * Evaluate a condition string against game state.
     *
     * @param condition - Dot-notation path, e.g. 'flags.metRonnie'
     * @returns Whether the condition evaluates to true
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
     * Handle a player's choice selection.
     * Applies tether costs, sets flags, and navigates to the chosen branch.
     *
     * @param choiceIndex - Zero-based index of the selected choice
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
     * Get current scene (for UI rendering).
     *
     * @returns The currently loaded scene, or null if no scene is active
     */
    getCurrentScene(): Scene | null {
        return this.currentScene;
    }

    /**
     * Start the game
     */
    async start(): Promise<void> {
        if (!this.isInitialized) await this.init();

        Logger.engine('Starting game with polished transition...');

        // 1) Trigger code rain AFTER effects layer exists
        // Duration = 1200ms ensures it covers the load hitch
        this.eventBus.emit('effect:code_rain', { duration: 1200 });

        // 2) Delay the initial scene load so the rain is actually seen
        // Wait 900ms (just before rain clears) to load the heavy scene
        setTimeout(() => {
            // Determine start scene (logic for save/load or new game)
            // Default to 'start' or whatever config says
            // For now, placeholder
            this.loadScene('start');
        }, 900);
    }

    // Accessors for testing
    getScene(id: SceneId): Scene | undefined {
        return this.scenes.get(id);
    }
}
