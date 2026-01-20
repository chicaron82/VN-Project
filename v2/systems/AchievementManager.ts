
import { EventBus } from '@core/EventBus';
import { StateManager } from '@core/StateManager';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    isSecret?: boolean;
}

/**
 * AchievementManager - Global Progression Tracking
 * 
 * Manages game achievements, persistence, and unlocking.
 */
export class AchievementManager {
    private eventBus: EventBus;
    private stateManager: StateManager;

    // Achievement Dictionary (V1 Parity)
    private readonly ACHIEVEMENTS: Record<string, Achievement> = {
        'first_loop': {
            id: 'first_loop',
            title: 'ITERATION 001',
            description: 'Experience your first reality collapse.',
            icon: '♾️'
        },
        'tori_path': {
            id: 'tori_path',
            title: 'Tethered',
            description: 'Begin the path of the Designer.',
            icon: '🎀'
        },
        'ronnie_path': {
            id: 'ronnie_path',
            title: 'Resilient',
            description: 'Begin the path of the Resister.',
            icon: '🕹️'
        },
        'secret_found': {
            id: 'secret_found',
            title: 'Digital Archaeologist',
            description: 'Uncover a hidden piece of the past.',
            icon: '🧩',
            isSecret: true
        }
    };

    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.setupListeners();
    }

    private setupListeners(): void {
        this.eventBus.on('achievement:unlock', (data) => {
            this.unlock(data.id);
        });
    }

    /**
     * Unlock an achievement if not already unlocked
     */
    public unlock(id: string): void {
        const achievement = this.ACHIEVEMENTS[id];
        if (!achievement) {
            console.warn(`[AchievementManager] Unknown achievement ID: ${id}`);
            return;
        }

        const unlocked = this.stateManager.get<string[]>('unlocks.achievements') || [];
        if (unlocked.includes(id)) return;

        // Add to state
        unlocked.push(id);
        this.stateManager.set('unlocks.achievements', unlocked);

        // Persistent save (localStorage fallback)
        this.persistAchievement(id);

        console.log(`[AchievementManager] UNLOCKED: ${achievement.title}`);

        // Emit for UI (Toast)
        this.eventBus.emit('achievement:unlocked', {
            id,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon
        });
    }

    private persistAchievement(id: string): void {
        if (typeof localStorage === 'undefined') return;

        try {
            const stored = localStorage.getItem('achievements');
            const array = stored ? JSON.parse(stored) : [];
            if (!array.includes(id)) {
                array.push(id);
                localStorage.setItem('achievements', JSON.stringify(array));
            }
        } catch (e) {
            console.error('[AchievementManager] Persistence error:', e);
        }
    }

    public isUnlocked(id: string): boolean {
        const unlocked = this.stateManager.get<string[]>('unlocks.achievements') || [];
        return unlocked.includes(id);
    }
}
