import { StateManager } from '@core/StateManager';
import { EventBus } from '@core/EventBus';
import { GameConfig } from '@core/GameConfig';
import { HapticSystem } from '@systems/HapticSystem';

export class TetherController {
    private stateManager: StateManager;
    private eventBus: EventBus;
    private haptic: HapticSystem;

    private decayInterval: any = null;
    private decayFrozen: boolean = false;

    // V1 Constants (can be moved to GameConfig if not already there, but keeping logic close)
    private readonly HOLD_ON_BOOST = 15;
    private readonly CRITICAL_THRESHOLD = 30;

    constructor(stateManager: StateManager, eventBus: EventBus, haptic: HapticSystem) {
        this.stateManager = stateManager;
        this.eventBus = eventBus;
        this.haptic = haptic;
    }

    /**
     * Start passive decay loop
     */
    startDecay() {
        if (this.decayInterval) return;

        // Safety: ensure tether state exists
        if (this.stateManager.get('game.tetherLevel') === undefined) {
            this.stateManager.set('game.tetherLevel', GameConfig.TETHER.INITIAL_LEVEL);
        }

        const intervalMs = GameConfig.TETHER.DECAY_INTERVAL_MS || 1000;

        this.decayInterval = setInterval(() => {
            this.applyDecay();
        }, intervalMs);

        console.log('📉 Tether decay started');
    }

    /**
     * Stop passive decay
     */
    stopDecay() {
        if (this.decayInterval) {
            clearInterval(this.decayInterval);
            this.decayInterval = null;
            console.log('🛑 Tether decay stopped');
        }
    }

    /**
     * Apply single decay tick
     */
    applyDecay() {
        if (this.decayFrozen) return;

        const currentLevel = this.stateManager.get('game.tetherLevel') as number;
        if (currentLevel <= 0) return; // Already dead

        // Calculate decay amount based on difficulty and current level (acceleration)
        // V1 Logic: Base rate varies by difficulty.
        // For now, use GameConfig base rate or default.
        let decayRate = GameConfig.TETHER.DECAY_RATE_BASE;

        // Logic: Accelerate if low
        if (currentLevel < GameConfig.TETHER.THRESHOLD_CRITICAL_DECAY) {
            decayRate = GameConfig.TETHER.DECAY_RATE_CRITICAL;
        } else if (currentLevel < GameConfig.TETHER.THRESHOLD_MEDIUM_DECAY) {
            decayRate = GameConfig.TETHER.DECAY_RATE_MEDIUM;
        }

        const newLevel = Math.max(0, currentLevel - decayRate);

        // Check for critical threshold crossing for Haptics
        if (currentLevel > this.CRITICAL_THRESHOLD && newLevel <= this.CRITICAL_THRESHOLD) {
            this.haptic.triggerSensory('tetherWarning');
        }

        this.stateManager.set('game.tetherLevel', newLevel);

        if (newLevel <= 0) {
            this.handleTetherDeath();
        }
    }

    /**
     * Player Action: Hold On
     */
    holdOn() {
        const currentLevel = this.stateManager.get('game.tetherLevel') as number;
        if (currentLevel <= 0) return;

        // TODO: Check Cooldown state

        const newLevel = Math.min(100, currentLevel + this.HOLD_ON_BOOST);
        this.stateManager.set('game.tetherLevel', newLevel);

        // Haptic Feedback
        this.haptic.triggerSensory('heartbeat'); // Or specific hold-on pattern

        // Emit event for UI animation
        this.eventBus.emit('tether:boost', { amount: this.HOLD_ON_BOOST });
    }

    private handleTetherDeath() {
        this.stopDecay();
        this.eventBus.emit('tether:death', {});
        // RouteController or GameEngine should listen to this to trigger Game Over
    }

    // Dev helpers
    freezeDecay(frozen: boolean) {
        this.decayFrozen = frozen;
    }

    destroy() {
        this.stopDecay();
    }
}
