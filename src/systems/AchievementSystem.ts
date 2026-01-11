
import { EventBus } from '@core/EventBus';
import { StateManager } from '@core/StateManager';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt: number | null;
}

export class AchievementSystem {
    private eventBus: EventBus;
    private stateManager: StateManager;
    private achievements: Record<string, Achievement>;
    private readonly STORAGE_KEY = 'uv7_achievements';

    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.achievements = this.initializeAchievements();
        this.loadAchievements();

        this.bindEvents();
    }

    private bindEvents() {
        // Listen for events that might trigger achievements
        this.eventBus.on('achievement:unlock', (data) => {
            // Re-emit visual cue or handle strictly if called externally
            // But usually this system EMITS that event. 
            // If another system requests unlock, we handle it here:
            this.unlock(data.id);
        });

        // Example trigger: Ending Reached (we need to define this event in EventBus first)
        // this.eventBus.on('game:ending', (data) => this.checkEnding(data.endingId));
    }

    private initializeAchievements(): Record<string, Achievement> {
        const defaults: Record<string, Omit<Achievement, 'unlocked' | 'unlockedAt'>> = {
            speed_runner: {
                id: 'speed_runner',
                name: 'Speed Runner',
                description: 'Complete any route in under 30 minutes',
                icon: '🏃'
            },
            archivist: {
                id: 'archivist',
                name: 'Archivist',
                description: 'Collect all 13 notes on Tori\'s route',
                icon: '📚'
            },
            time_traveler: {
                id: 'time_traveler',
                name: 'Time Traveler',
                description: 'Reach any ending',
                icon: '🔄'
            },
            heartbreaker: {
                id: 'heartbreaker',
                name: 'Heartbreaker',
                description: 'Reach the bad ending',
                icon: '💔'
            },
            true_ending: {
                id: 'true_ending',
                name: 'True Ending',
                description: 'Reach the true ending',
                icon: '✨'
            },
            completionist: {
                id: 'completionist',
                name: 'Completionist',
                description: 'Unlock all endings',
                icon: '🎮'
            },
            pet_parent: {
                id: 'pet_parent',
                name: 'Pet Parent',
                description: 'Unlock ToriGatchi',
                icon: '🐣'
            },
            insane: {
                id: 'insane',
                name: 'Insane',
                description: 'Complete Insane Mode',
                icon: '⚡'
            },
            explorer: {
                id: 'explorer',
                name: 'Explorer',
                description: 'View 100+ dialogue entries in backlog',
                icon: '🔍'
            },
            tactical_retreat: {
                id: 'tactical_retreat',
                name: 'Tactical Retreat',
                description: 'Used Konami Code to escape INSANE mode',
                icon: '🏃'
            },
            masochist: {
                id: 'masochist',
                name: 'Masochist',
                description: 'Stayed in INSANE mode after finding the exit',
                icon: '😈'
            },
            remembered: {
                id: 'remembered',
                name: 'Remembered',
                description: 'All three echoes have noticed you',
                icon: '👁️'
            }
        };

        const initialized: Record<string, Achievement> = {};
        Object.values(defaults).forEach(def => {
            initialized[def.id] = {
                ...def,
                unlocked: false,
                unlockedAt: null
            };
        });
        return initialized;
    }

    private loadAchievements() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                Object.keys(parsed).forEach(id => {
                    if (this.achievements[id]) {
                        this.achievements[id].unlocked = parsed[id].unlocked;
                        this.achievements[id].unlockedAt = parsed[id].unlockedAt;
                    }
                });
            }
        } catch (e) {
            console.error('Failed to load achievements', e);
        }
    }

    private saveAchievements() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.achievements));
        } catch (e) {
            console.error('Failed to save achievements', e);
        }
    }

    public unlock(id: string) {
        const achievement = this.achievements[id];
        if (!achievement) return;

        if (!achievement.unlocked) {
            achievement.unlocked = true;
            achievement.unlockedAt = Date.now();
            this.saveAchievements();

            console.log(`🏆 Achievement Unlocked: ${achievement.name}`);

            // Emit event for UI to pick up
            // Note: If calling from 'achievement:unlock' listener, this might loop if not careful.
            // Better pattern: separating 'request_unlock' from 'unlocked'.
            // For now, we assume this method is the source of truth and we emit 'achievement:unlocked_notification' maybe?
            // Or just 'achievement:unlock' is the notification event, and we use a different internal check.

            // Let's use 'visual:cue' for the toast
            this.eventBus.emit('visual:cue', { type: 'achievement', channel: 'ui' });
            // AND we can emit a specific UI event if needed, but Toast can listen to 'achievement:unlock' if we ensure we don't handle it recursively.
        }
    }

    public isUnlocked(id: string): boolean {
        return this.achievements[id]?.unlocked || false;
    }

    public getAchievements(): Achievement[] {
        return Object.values(this.achievements);
    }
}
