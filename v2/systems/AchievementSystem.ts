
import type { EventBus } from '@core/EventBus';
import type { StateManager } from '@core/StateManager';
import { Logger } from '@utils/Logger';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt: number | null;
}

interface AchievementStats {
    routeStartTime: number | null;
    backlogViews: number;
    endingsReached: string[];
}

export class AchievementSystem {
    private eventBus: EventBus;
    private stateManager: StateManager;
    private achievements: Record<string, Achievement>;
    private stats: AchievementStats;
    private readonly STORAGE_KEY = 'uv7_achievements';
    private readonly STATS_KEY = 'uv7_achievement_stats';

     
    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.achievements = this.initializeAchievements();
        this.stats = this.loadStats();
        this.loadAchievements();

        this.bindEvents();
    }

    private bindEvents(): void {
        // Listen for external unlock requests (e.g. from EchoMemorySystem)
        this.eventBus.on('achievement:unlock', (data) => {
            this.unlock(data.id);
        });

        // Listen for ending events
        this.eventBus.on('game:ending', (data) => {
            this.checkEndingAchievements(data.endingId);
        });

        // Listen for backlog opens
        this.eventBus.on('ui:backlog:toggle', () => {
            this.checkExplorer();
        });

        // Listen for route starts
        this.eventBus.on('ui:start_game', () => {
            this.startRouteTimer();
        });

        // Listen for note collection
        this.eventBus.on('note:collected', () => {
            this.checkArchivist();
        });
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

    private loadAchievements(): void {
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
        } catch (_e) {
            Logger.error('Failed to load achievements', _e);
        }
    }

    private saveAchievements(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.achievements));
        } catch (_e) {
            Logger.error('Failed to save achievements', _e);
        }
    }

    public unlock(id: string): void {
        const achievement = this.achievements[id];
        if (!achievement) return;

        if (!achievement.unlocked) {
            achievement.unlocked = true;
            achievement.unlockedAt = Date.now();
            this.saveAchievements();

            Logger.achievement(`🏆 Achievement Unlocked: ${achievement.name}`);

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

    // ========================================
    // STATS PERSISTENCE
    // ========================================

    private loadStats(): AchievementStats {
        try {
            const saved = localStorage.getItem(this.STATS_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (_e) {
            Logger.error('Failed to load achievement stats', _e);
        }
        return {
            routeStartTime: null,
            backlogViews: 0,
            endingsReached: []
        };
    }

    private saveStats(): void {
        try {
            localStorage.setItem(this.STATS_KEY, JSON.stringify(this.stats));
        } catch (_e) {
            Logger.error('Failed to save achievement stats', _e);
        }
    }

    // ========================================
    // ACHIEVEMENT TRIGGERS — V1 Faithful 🏆
    // ========================================

    /** Start route timer for Speed Runner achievement */
    public startRouteTimer(): void {
        this.stats.routeStartTime = Date.now();
        this.saveStats();
        Logger.achievement('🏃 Achievement: Route timer started');
    }

    /** Check Speed Runner — complete any route in under 30 minutes */
    public checkSpeedRunner(): void {
        if (!this.stats.routeStartTime) return;

        const elapsed = Date.now() - this.stats.routeStartTime;
        const thirtyMinutes = 30 * 60 * 1000;

        if (elapsed < thirtyMinutes) {
            this.unlock('speed_runner');
        }
    }

    /** Check Archivist — collect all 13 notes on Tori's route */
    public checkArchivist(): void {
        // Use stateManager to check collectibles count
        const collectiblesState = this.stateManager.get('collectibles') as Record<string, unknown> | undefined;
        if (!collectiblesState) return;

        const collectedNotes = collectiblesState.collectedNotes as Record<string, string[]> | undefined;
        if (!collectedNotes) return;

        const toriTypes = ['z', 'cz', 'zr'];
        let totalCollected = 0;

        toriTypes.forEach(type => {
            if (collectedNotes[type]) {
                totalCollected += collectedNotes[type].length;
            }
        });

        if (totalCollected >= 13) {
            this.unlock('archivist');
        }
    }

    /** Handle ending achievements — maps ending IDs to achievement IDs */
    public checkTimeTravel(endingId: string): void {
        // Track ending reached
        if (!this.stats.endingsReached.includes(endingId)) {
            this.stats.endingsReached.push(endingId);
            this.saveStats();
        }

        // First ending = Time Traveler
        if (this.stats.endingsReached.length === 1) {
            this.unlock('time_traveler');
        }

        // Map ending IDs to achievement IDs (V1 faithful)
        if (endingId === 'bad_ending') {
            this.unlock('heartbreaker');
        }

        if (endingId === 'true_ending') {
            this.unlock('true_ending');
        }

        // Completionist — all 3 endings reached
        const allEndings = ['bad_ending', 'digital_ending', 'true_ending'];
        if (allEndings.every(e => this.stats.endingsReached.includes(e))) {
            this.unlock('completionist');
        }
    }

    /** Check Pet Parent — ToriGatchi unlocked */
    public checkPetParent(): void {
        if (localStorage.getItem('torigatchiUnlocked') === 'true') {
            this.unlock('pet_parent');
        }
    }

    /** Check Insane — completed on INSANE difficulty */
    public checkInsane(): void {
        const settings = this.stateManager.get('settings') as Record<string, unknown> | undefined;
        const difficulty = settings?.tetherDifficulty;
        if (difficulty === 'insane') {
            this.unlock('insane');
        }
    }

    /** Check Explorer — 100+ backlog views */
    public checkExplorer(): void {
        this.stats.backlogViews++;
        this.saveStats();

        if (this.stats.backlogViews >= 100) {
            this.unlock('explorer');
        }
    }

    /** Combined ending check — called from hooks or event listeners */
    public checkEndingAchievements(endingId: string): void {
        this.checkTimeTravel(endingId);
        this.checkSpeedRunner();
        this.checkInsane();
        Logger.achievement(`🏆 Checked achievements for ending: ${endingId}`);
    }

    public getTotalUnlocked(): number {
        return Object.values(this.achievements).filter(a => a.unlocked).length;
    }

    public getTotalAchievements(): number {
        return Object.keys(this.achievements).length;
    }
}
