import { EventBus } from './EventBus';
import { StateManager } from './StateManager';
import { GameConfig } from './GameConfig';

/**
 * Scene Interface
 */
export interface Scene {
    id: string;
    text?: string;
    character?: string;
    background?: string;
    next?: string | { conditions: any[]; default: string };
    choices?: Array<{
        text: string;
        next: string | null;
        flags?: Array<{ flag: string; value: boolean }>;
        tetherCost?: number;
    }>;
    effects?: Array<{ type: string;[key: string]: any }>;
    tetherImpact?: number;
    collectible?: { id: string; title: string; content: string; type: 'note' | 'code' | 'memory' };
}

/**
 * GameEngine - Main Orchestrator
 */
export class GameEngine {
    private eventBus: EventBus;
    private stateManager: StateManager;
    private scenes: Map<string, Scene>;
    private currentScene: Scene | null = null;
    private isInitialized: boolean = false;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.scenes = new Map();

        // Listen for choice selection
        this.eventBus.on('choice:selected', (data: { index: number }) => {
            this.selectChoice(data.index);
        });

        // Listen for dialog advancement
        this.eventBus.on('dialog:advance', () => {
            this.advanceScene();
        });

        // Listen for tether death
        this.eventBus.on('tether:death', () => {
            this.handleDeath();
        });
    }

    async init(): Promise<void> {
        if (this.isInitialized) return;
        this.isInitialized = true;
        console.log(`🚀 GameEngine initialized (Clean Protocol v${GameConfig.VERSION.CURRENT})`);
    }

    loadRoute(routeData: any[]): void {
        routeData.forEach(sceneData => this.registerScene(sceneData as Scene));
    }

    registerScene(scene: Scene): void {
        this.scenes.set(scene.id, scene);
    }

    async loadScene(sceneId: string): Promise<void> {
        const scene = this.scenes.get(sceneId);
        if (!scene) {
            console.error(`❌ Scene not found: ${sceneId}`);
            return;
        }

        this.currentScene = scene;
        this.stateManager.set('currentScene', sceneId);

        // Update History
        const history = this.stateManager.get<string[]>('history') ?? [];
        history.push(sceneId);
        this.stateManager.set('history', history);

        // Emit Load & Visuals
        this.eventBus.emit('scene:load', { sceneId });
        if (scene.background) this.eventBus.emit('visual:background', { image: scene.background });

        // Emit Dialog
        if (scene.text) {
            this.eventBus.emit('dialog:show', {
                entry: {
                    character: scene.character || 'Narration',
                    text: scene.text
                }
            });
        }

        // Show Choices
        if (scene.choices && scene.choices.length > 0) {
            this.eventBus.emit('choice:show', { choices: scene.choices });
        }

        // Handle Tether Impact
        if (scene.tetherImpact) {
            const currentTether = this.stateManager.get<number>('tetherLevel') ?? 100;
            const newTether = Math.max(0, Math.min(100, currentTether + scene.tetherImpact));
            this.stateManager.set('tetherLevel', newTether);
            this.eventBus.emit('tether:change', { level: newTether, delta: scene.tetherImpact });

            if (newTether === 0) {
                this.eventBus.emit('tether:death', {});
            }
        }

        // Handle Collectibles
        if (scene.collectible) {
            this.eventBus.emit('collectible:unlock', scene.collectible);
        }

        // Handle Effects
        if (scene.effects) {
            scene.effects.forEach(effect => {
                if (effect.type === 'tether_start') {
                    this.eventBus.emit('tether:start', {});
                } else {
                    this.eventBus.emit('visual:cue', {
                        type: effect.type,
                        channel: 'narrative',
                        sceneId
                    });
                }
            });
        }
    }

    advanceScene(): void {
        if (!this.currentScene) return;
        if (this.currentScene.choices && this.currentScene.choices.length > 0) return;

        const nextId = this.getNextSceneId(this.currentScene);
        if (nextId) {
            this.loadScene(nextId);
        } else {
            this.eventBus.emit('scene:complete', { sceneId: this.currentScene.id });
        }
    }

    selectChoice(choiceIndex: number): void {
        if (!this.currentScene?.choices) return;
        const choice = this.currentScene.choices[choiceIndex];
        if (!choice) return;

        // Apply Flags
        if (choice.flags) {
            const flags = this.stateManager.get<Record<string, boolean>>('flags') ?? {};
            choice.flags.forEach(f => flags[f.flag] = f.value);
            this.stateManager.set('flags', flags);
        }

        // Apply Tether Cost
        if (choice.tetherCost) {
            const current = this.stateManager.get<number>('tetherLevel') ?? 100;
            const next = Math.max(0, current - choice.tetherCost);
            this.stateManager.set('tetherLevel', next);
            this.eventBus.emit('tether:change', { level: next, delta: -choice.tetherCost });
            if (next === 0) this.eventBus.emit('tether:death', {});
        }

        if (choice.next) {
            this.loadScene(choice.next);
        } else {
            this.eventBus.emit('scene:complete', { sceneId: this.currentScene.id });
        }
    }

    private getNextSceneId(scene: Scene): string | null {
        if (!scene.next) return null;
        if (typeof scene.next === 'string') return scene.next;
        if (typeof scene.next === 'object' && 'default' in scene.next) return scene.next.default;
        return null;
    }

    private handleDeath() {
        console.log('💀 TETHER SNAPPED');
        this.eventBus.emit('visual:cue', { type: 'glitch', channel: 'system' });
        // After delay, reset or trigger ending
        setTimeout(() => {
            this.eventBus.emit('loop:reset', { version: 848, status: 'FATAL_TETHER_DECAY' });
            // For now, just go back to start
            this.loadScene('scene1_coffee');
        }, 2000);
    }
}
