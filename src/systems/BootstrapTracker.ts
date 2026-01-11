
import { StateManager } from '@core/StateManager';

export interface BootstrapAttempt {
    number: number;
    result: 'failed' | 'succeeded';
    reason: string;
    route: 'ronnie' | 'tori' | 'unknown';
    endingType: 'bad' | 'digitalForever' | 'true' | 'corrupted';
    timestamp: number | null;
    dateString: string;
}

export interface BootstrapTimeline {
    currentAttempt: number;
    attempts: BootstrapAttempt[];
}

/**
 * BootstrapTracker
 * 
 * Tracks the "Bootstrap Paradox" timeline (attempt history).
 * Mirroring V1 logic: keeps last 5 attempts, supports "corrupted" history.
 */
export class BootstrapTracker {
    private stateManager: StateManager;
    private timeline: BootstrapTimeline;
    private readonly STORAGE_KEY = 'uv7_bootstrap_timeline';
    private readonly MAX_ATTEMPTS = 5;

    constructor(stateManager: StateManager) {
        this.stateManager = stateManager;
        this.timeline = this.loadTimeline();

        // Sync current attempt to state manager for easy access
        this.stateManager.set('game.loopVersion', this.timeline.currentAttempt);
    }

    private loadTimeline(): BootstrapTimeline {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load bootstrap timeline:', e);
        }

        return this.createDefaultTimeline();
    }

    private createDefaultTimeline(): BootstrapTimeline {
        // Pre-populate with corrupted history (Lore: Attempts 843-847)
        return {
            currentAttempt: 848,
            attempts: [
                { number: 847, result: 'failed', reason: '[DATA CORRUPTED]', route: 'unknown', endingType: 'corrupted', timestamp: null, dateString: '[UNREADABLE]' },
                { number: 846, result: 'failed', reason: '[DATA CORRUPTED]', route: 'unknown', endingType: 'corrupted', timestamp: null, dateString: '[UNREADABLE]' },
                { number: 845, result: 'failed', reason: '[DATA CORRUPTED]', route: 'unknown', endingType: 'corrupted', timestamp: null, dateString: '[UNREADABLE]' },
                { number: 844, result: 'failed', reason: '[DATA CORRUPTED]', route: 'unknown', endingType: 'corrupted', timestamp: null, dateString: '[UNREADABLE]' },
                { number: 843, result: 'failed', reason: '[DATA CORRUPTED]', route: 'unknown', endingType: 'corrupted', timestamp: null, dateString: '[UNREADABLE]' }
            ]
        };
    }

    private saveTimeline(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.timeline));
            // Sync state
            this.stateManager.set('game.loopVersion', this.timeline.currentAttempt);
        } catch (e) {
            console.error('Failed to save bootstrap timeline:', e);
        }
    }

    public recordAttempt(
        result: 'failed' | 'succeeded',
        reason: string,
        route: 'ronnie' | 'tori',
        endingType: 'bad' | 'digitalForever' | 'true'
    ): void {
        const attempt: BootstrapAttempt = {
            number: this.timeline.currentAttempt,
            result,
            reason,
            route,
            endingType,
            timestamp: Date.now(),
            dateString: new Date().toLocaleString()
        };

        // Add to beginning
        this.timeline.attempts.unshift(attempt);

        // Limit size
        if (this.timeline.attempts.length > this.MAX_ATTEMPTS) {
            this.timeline.attempts = this.timeline.attempts.slice(0, this.MAX_ATTEMPTS);
        }

        // Increment attempt counter for NEXT run
        this.timeline.currentAttempt++;

        this.saveTimeline();
        console.log(`📝 Recorded attempt #${attempt.number}: ${result} - ${reason}`);
    }

    /**
     * Manually increment attempt counter (e.g. on simple retry without full record)
     */
    public incrementAttempt(): void {
        this.timeline.currentAttempt++;
        this.saveTimeline();
    }

    public getHistory(): Readonly<BootstrapTimeline> {
        return this.timeline;
    }

    public getCurrentAttempt(): number {
        return this.timeline.currentAttempt;
    }

    public reset(): void {
        this.timeline = this.createDefaultTimeline();
        this.saveTimeline();
    }
}
