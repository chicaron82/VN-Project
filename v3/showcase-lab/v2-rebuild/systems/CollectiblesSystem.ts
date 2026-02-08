import { StateManager } from '../core/StateManager';
import { EventBus } from '../core/EventBus';

export interface Collectible {
    id: string;
    title: string;
    content: string;
    type: 'note' | 'code' | 'memory';
    unlockedAt: number;
}

/**
 * CollectiblesSystem
 * Manages the "Echoes of the Past" - notes, codes, and memories.
 */
export class CollectiblesSystem {
    private stateManager: StateManager;
    private eventBus: EventBus;
    private collected: Map<string, Collectible>;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.collected = new Map();

        // Register event listeners
        this.eventBus.on('collectible:unlock', (data: { id: string; title: string; content: string; type: 'note' | 'code' | 'memory' }) => {
            this.unlock(data.id, data.title, data.content, data.type);
        });
    }

    init() {
        // Load initial state if any
        const saved = this.stateManager.get<Collectible[]>('collectibles') || [];
        saved.forEach(c => this.collected.set(c.id, c));
        console.log(`📔 CollectiblesSystem online. ${this.collected.size} items discovered.`);
    }

    unlock(id: string, title: string, content: string, type: 'note' | 'code' | 'memory' = 'note') {
        if (this.collected.has(id)) return;

        const collectible: Collectible = {
            id,
            title,
            content,
            type,
            unlockedAt: Date.now()
        };

        this.collected.set(id, collectible);
        this.save();

        this.eventBus.emit('notification:show', {
            title: 'New Collectible Found',
            message: `"${title}" has been added to your memory.`,
            category: 'note',
            priority: 'normal'
        });
    }

    getAll(): Collectible[] {
        return Array.from(this.collected.values());
    }

    private save() {
        this.stateManager.set('collectibles', this.getAll());
    }
}
