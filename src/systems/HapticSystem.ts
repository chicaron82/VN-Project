import { GameConfig, HapticPatternName, SensoryCueName } from '@core/GameConfig';
import { EventBus } from '@core/EventBus';

export interface HapticOptions {
    channel?: 'ui' | 'narrative' | 'critical';
    force?: boolean;
}

export interface SettingsProvider {
    getHapticEnabled(): boolean;
    getComfortIntensity(): number; // 0=Gentle, 1=Normal, 2=Amped, 3=INSANE
}

/**
 * HapticSystem - V2
 * 
 * Centralized haptic feedback system.
 * Ports V1 logic with type safety and EventBus integration.
 */
export class HapticSystem {
    private eventBus: EventBus;
    private settings: SettingsProvider;

    private lastHapticTime: number = 0;
    private hapticCooldownMs: number = GameConfig.TIMING.HAPTIC_COOLDOWN_MS;

    constructor(eventBus: EventBus, settings: SettingsProvider) {
        this.eventBus = eventBus;
        this.settings = settings;
    }

    /**
   * getPattern - Retrieve pattern from config or fallback
   */
    getPattern(name: string): number | readonly number[] {
        const key = name.toUpperCase() as keyof typeof GameConfig.HAPTICS;
        return GameConfig.HAPTICS[key] || GameConfig.HAPTICS.LIGHT;
    }

    scalePattern(pattern: number | number[] | readonly number[], comfortLevel: number): number | number[] {
        // ensure we work with a mutable number array
        const mutablePattern: number[] = Array.isArray(pattern) ? [...pattern] : [pattern as number];
        let scaled: number[];

        if (comfortLevel === 1) {
            scaled = mutablePattern;
        } else if (comfortLevel === 0) {
            // Gentle: softer, shorter
            scaled = mutablePattern.map(ms => Math.max(5, Math.round(ms * 0.6)));
        } else if (comfortLevel === 2) {
            // Amped: stronger, longer
            scaled = mutablePattern.map(ms => Math.round(ms * 1.3));
        } else if (comfortLevel === 3) {
            // INSANE: MUCH stronger, MUCH longer
            scaled = mutablePattern.map(ms => Math.round(ms * 2.0));
        } else {
            scaled = mutablePattern;
        }

        return Array.isArray(pattern) ? scaled : (scaled[0] ?? 50);
    }

    /**
     * trigger - Execute haptic feedback
     */
    trigger(patternName: HapticPatternName, options: HapticOptions = {}): void {
        const { channel = 'ui', force = false } = options;

        // 1. Check settings
        if (!this.settings.getHapticEnabled()) return;

        // 2. Check Debounce (unless forced)
        const now = performance.now();
        if (!force && (now - this.lastHapticTime) < this.hapticCooldownMs) {
            return;
        }
        this.lastHapticTime = now;

        // 3. Get and Scale Pattern
        const basePattern = this.getPattern(patternName);
        const comfort = this.settings.getComfortIntensity();
        const finalPattern = this.scalePattern(basePattern, comfort);

        // 4. Execute (if supported)
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(finalPattern);
        }

        // 5. Emit event for logging/debugging
        // (Using any for data payload for now until we define a HapticEvent type strictly)
        this.eventBus.emit('tether:change', { level: 0, delta: 0 }); // Placeholder event, maybe need a specific debug event
        // Better: just console log in debug mode
        if (GameConfig.DEBUG_MODE) {
            console.log(`📳 Haptic: ${patternName} [channel=${channel}, comfort=${comfort}]`, finalPattern);
        }
    }

    /**
     * triggerSensory - Unified feedback (Haptics + Visuals)
     */
    triggerSensory(cueName: SensoryCueName): void {
        const cue = GameConfig.SENSORY_CUES[cueName];
        if (!cue) {
            console.warn(`⚠️ Unknown sensory cue: ${cueName}`);
            return;
        }

        // 1. Visual Cue (Emit event for UI to handle)
        // We need to define a 'visual:cue' event in GameEvents if we want to be strict
        this.eventBus.emit('visual:cue', { type: cue.visualType, channel: cue.channel });

        // 2. Haptic Cue
        if (cue.basePattern) {
            const isCritical = cue.channel === 'critical' || cue.channel === 'narrative';
            this.trigger(cue.basePattern as HapticPatternName, {
                channel: cue.channel as any,
                force: isCritical
            });
        }
    }
}
