import { StateManager } from '../core/StateManager';
import { EventBus } from '../core/EventBus';

export interface LoopMemory {
    index: number;
    deathSceneId: string;
    timestamp: number;
}

/**
 * EchoSystem
 * Manages the "Ghost in the Machine" - loop history and meta-commentary.
 */
export class EchoSystem {
    private stateManager: StateManager;
    private eventBus: EventBus;
    private history: LoopMemory[];

    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.history = [];

        // Listen for deaths
        this.eventBus.on('tether:death', () => {
            this.recordLoop();
        });

        // Listen for specific "echo" triggers
        this.eventBus.on('visual:cue', (data) => {
            if (data.type === 'echo_prompt') {
                this.triggerMetaCommentary();
            }
        });
    }

    init() {
        this.history = this.stateManager.get<LoopMemory[]>('loopHistory') || [];
        console.log(`👁️ EchoSystem online. Memory of ${this.history.length} previous timelines detected.`);
    }

    private recordLoop() {
        const currentScene = this.stateManager.get<string>('currentScene') || 'unknown';
        const entry: LoopMemory = {
            index: this.history.length + 1,
            deathSceneId: currentScene,
            timestamp: Date.now()
        };

        this.history.push(entry);
        this.stateManager.set('loopHistory', this.history);

        // Increase "Insight" or "Despair" based on loop count
        const insight = this.stateManager.get<number>('insightLevel') || 0;
        this.stateManager.set('insightLevel', insight + 1);
    }

    private triggerMetaCommentary() {
        if (this.history.length === 0) return;

        const loopCount = this.history.length;
        this.eventBus.emit('notification:show', {
            title: 'Memory Fragment',
            message: `This has happened ${loopCount} times before. The pattern remains.`,
            category: 'system',
            priority: 'low'
        });
    }

    getLoopCount(): number {
        return this.history.length;
    }
}
