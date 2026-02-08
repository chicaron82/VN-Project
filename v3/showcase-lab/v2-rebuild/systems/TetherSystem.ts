
import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';
import { GameConfig } from '../core/GameConfig';
import {
    DifficultyId,
    DifficultyProfile,
    getDifficultyProfile
} from './DifficultyProfiles';

export interface TetherState {
    level: number;
    difficulty: DifficultyId;
    holdOnCooldown: boolean;
    decayFrozen: boolean;
}

export class TetherSystem {
    private eventBus: EventBus;
    private stateManager: StateManager;

    private level: number;
    private currentDifficulty: DifficultyId = 'normal';
    private profile: DifficultyProfile;

    private decayTimer: ReturnType<typeof setInterval> | null = null;
    private decayFrozen: boolean = false;

    private holdOnCooldown: boolean = false;
    private holdOnCooldownTimer: ReturnType<typeof setInterval> | null = null;
    private holdOnCooldownRemaining: number = 0;

    private hasUsedHoldOn: boolean = false;
    private hasShownTutorialFlash: boolean = false;

    private tetherCap: number = 100;
    private holdOnBoost: number = 15;
    private holdOnCooldownMs: number = 30000;
    private decayRateBase: number = 0.15;
    private decayRateMedium: number = 0.25;
    private decayRateCritical: number = 0.40;

    private readonly CRITICAL_THRESHOLD = GameConfig.TETHER?.THRESHOLD_CRITICAL ?? 20;
    private readonly MEDIUM_DECAY_THRESHOLD = GameConfig.TETHER?.THRESHOLD_MEDIUM_DECAY ?? 50;
    private readonly CRITICAL_DECAY_THRESHOLD = GameConfig.TETHER?.THRESHOLD_CRITICAL_DECAY ?? 30;
    private readonly DECAY_INTERVAL_MS = GameConfig.TETHER?.DECAY_INTERVAL_MS ?? 1000;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;

        const savedDifficulty = stateManager.get<string>('settings.tetherDifficulty') ?? 'normal';
        this.currentDifficulty = savedDifficulty as DifficultyId;
        this.profile = getDifficultyProfile(this.currentDifficulty);

        this.level = GameConfig.TETHER?.INITIAL_LEVEL ?? 100;

        this.applyDifficultyProfile(this.profile);
        this.hasShownTutorialFlash = localStorage.getItem('tetherTutorialShown') === 'true';

        this.setupEventListeners();
        this.syncToStateManager();

        console.log('⚡ TetherSystem initialized');
    }

    private setupEventListeners(): void {
        this.eventBus.on('settings:changed', (data) => {
            if (data.key === 'tetherDifficulty' || data.key === 'difficulty') {
                this.setDifficulty(data.value as DifficultyId);
            }
        });

        this.eventBus.on('tether:boost', () => {
            // Usually UI triggers this via holdOn() method, but we can listen too
        });

        this.eventBus.on('tether:start', () => {
            this.startDecay();
        });
    }

    public setDifficulty(difficultyId: DifficultyId): void {
        this.currentDifficulty = difficultyId;
        this.profile = getDifficultyProfile(difficultyId);
        this.applyDifficultyProfile(this.profile);
        this.stateManager.set('settings.tetherDifficulty', difficultyId);
        console.log(`⚙️ Tether difficulty set to ${this.profile.name}`);

        if (difficultyId === 'insane') {
            this.eventBus.emit('insane:activate', {});
        } else {
            this.eventBus.emit('insane:deactivate', {});
        }
    }

    private applyDifficultyProfile(profile: DifficultyProfile): void {
        this.tetherCap = profile.tetherCap;
        this.holdOnBoost = profile.holdOnBoost;
        this.holdOnCooldownMs = profile.holdOnCooldown;
        this.decayRates = profile.decayRates; // Update local decay rates
        this.decayRateBase = profile.decayRates.base;
        this.decayRateMedium = profile.decayRates.medium;
        this.decayRateCritical = profile.decayRates.critical;

        if (this.level > this.tetherCap) {
            this.level = this.tetherCap;
            this.updateDisplay();
        }
    }

    private decayRates: any; // Type hack or declare above

    public updateTether(amount: number, reason: string = ''): number {
        const previousLevel = this.level;
        this.level = Math.max(0, Math.min(this.tetherCap, this.level + amount));

        this.eventBus.emit('tether:change', {
            level: this.level,
            delta: amount
        });

        this.updateDisplay();

        if (this.level <= this.CRITICAL_THRESHOLD && previousLevel > this.CRITICAL_THRESHOLD) {
            this.eventBus.emit('tether:critical', { level: this.level });
        }

        if (this.level <= 0) {
            this.stopDecay();
            this.onTetherDeath();
        }

        return this.level;
    }

    public startDecay(): void {
        if (this.decayTimer) return;
        if (this.decayRateBase === 0) return;

        this.decayTimer = setInterval(() => {
            this.applyDecay();
        }, this.DECAY_INTERVAL_MS);
        console.log('⚡ Tether decay started');
    }

    public stopDecay(): void {
        if (this.decayTimer) {
            clearInterval(this.decayTimer);
            this.decayTimer = null;
        }
    }

    private applyDecay(): void {
        if (this.decayFrozen) return;

        let decayAmount = this.decayRateBase;
        if (this.level < this.MEDIUM_DECAY_THRESHOLD) decayAmount = this.decayRateMedium;
        if (this.level < this.CRITICAL_DECAY_THRESHOLD) decayAmount = this.decayRateCritical;

        this.updateTether(-decayAmount, 'passive decay');

        if (this.level < this.CRITICAL_THRESHOLD) {
            // trigger glitch logic here
        }
    }

    public holdOn(): boolean {
        if (!this.profile.holdOn.enabled) return false;
        if (this.holdOnCooldown) return false;

        this.hasUsedHoldOn = true;
        this.updateTether(this.holdOnBoost, 'HOLD ON button pressed');
        this.eventBus.emit('tether:boost', { amount: this.holdOnBoost });
        this.startHoldOnCooldown();
        return true;
    }

    private startHoldOnCooldown(): void {
        this.holdOnCooldown = true;
        this.holdOnCooldownRemaining = Math.ceil(this.holdOnCooldownMs / 1000);

        this.holdOnCooldownTimer = setInterval(() => {
            this.holdOnCooldownRemaining--;
            this.eventBus.emit('settings:changed', {
                key: 'holdOnCooldown',
                value: this.holdOnCooldownRemaining
            });

            if (this.holdOnCooldownRemaining <= 0) {
                this.resetHoldOnCooldown();
            }
        }, 1000);
    }

    private resetHoldOnCooldown(): void {
        this.holdOnCooldown = false;
        this.holdOnCooldownRemaining = 0;
        if (this.holdOnCooldownTimer) {
            clearInterval(this.holdOnCooldownTimer);
            this.holdOnCooldownTimer = null;
        }
    }

    private updateDisplay(): void {
        this.syncToStateManager();
    }

    private onTetherDeath(): void {
        console.log('💀 Tether death triggered');
        this.eventBus.emit('tether:death', {});
    }

    private syncToStateManager(): void {
        this.stateManager.set('game.tetherLevel', this.level);
    }
}
