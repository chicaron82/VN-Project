// ========================================
// HAPTIC SYSTEM - Version 848
// Centralized haptic feedback system
// Extracted from GameEngine for SOLID principles
// Enhanced V2 port with full V1 parity
// ========================================

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

export interface SensoryLogEntry {
    cueType: string;
    channel: string;
    pattern: number | number[];
    description: string;
    comfort: number;
    time: string;
}

export interface VisualCueManager {
    trigger(visualType: string, target: HTMLElement | null, options: { channel: string }): void;
}

/**
 * HapticSystem
 *
 * Handles all vibration/haptic feedback with:
 * - Pattern library from GameConfig
 * - Comfort level scaling
 * - Debounce/anti-spam
 * - Unified sensory feedback (haptic + visual)
 * - Debug logging for dev mode
 *
 * "Built with love. Haptic precision matters." 💚🔥💀
 */
export class HapticSystem {
    // @ts-expect-error - Reserved for future EventBus integration
    private eventBus: EventBus;
    private settings: SettingsProvider;
    private visualCueManager: VisualCueManager | null = null;

    // Debounce state
    private lastHapticTime: number = 0;
    private hapticCooldownMs: number = 50; // V1 parity: 50ms cooldown

    // Debug logging
    private sensoryLog: SensoryLogEntry[] = [];
    private maxSensoryLog: number = 100;

    constructor(eventBus: EventBus, settings: SettingsProvider) {
        this.eventBus = eventBus;
        this.settings = settings;
        console.log('📳 HapticSystem initialized');
    }

    // ========================================
    // VISUAL CUE MANAGER INTEGRATION
    // ========================================

    /**
     * Set visual cue manager for unified sensory feedback
     * @param manager - Visual cue manager instance
     */
    public setVisualCueManager(manager: VisualCueManager): void {
        this.visualCueManager = manager;
    }

    // ========================================
    // PATTERN ACCESS
    // ========================================

    /**
     * Get haptic patterns from GameConfig or fallback
     * @param name - Pattern name
     * @returns Pattern (number or array)
     */
    public getPattern(name: string): number | readonly number[] {
        const key = name.toUpperCase() as keyof typeof GameConfig.HAPTICS;
        return GameConfig.HAPTICS[key] || GameConfig.HAPTICS.LIGHT;
    }

    /**
     * Get all haptic patterns from GameConfig
     * V1 parity: Fallback patterns if GameConfig not available
     * @returns Pattern library
     */
    public getHapticPatterns(): Record<string, number | readonly number[]> {
        // Return all patterns from GameConfig
        return GameConfig.HAPTICS;
    }

    // ========================================
    // PATTERN SCALING
    // ========================================

    /**
     * Scale haptic pattern by comfort level
     * @param pattern - Base pattern
     * @param comfortLevel - 0=Gentle, 1=Normal, 2=Amped, 3=INSANE
     * @returns Scaled pattern
     */
    public scalePattern(pattern: number | number[] | readonly number[], comfortLevel: number): number | number[] {
        // 0=Gentle (60%), 1=Normal (100%), 2=Amped (130%), 3=INSANE (200%)
        if (comfortLevel === 1) {
            return Array.isArray(pattern) ? [...pattern] : (pattern as number);
        }

        // Normalize to mutable array
        const arr: number[] = Array.isArray(pattern) ? [...pattern] : [pattern as number];

        if (comfortLevel === 0) {
            // Gentle: softer, shorter
            return arr.map(ms => Math.max(5, Math.round(ms * 0.6)));
        }
        if (comfortLevel === 2) {
            // Amped: stronger, longer
            return arr.map(ms => Math.round(ms * 1.3));
        }
        if (comfortLevel === 3) {
            // INSANE: MUCH stronger, MUCH longer
            return arr.map(ms => Math.round(ms * 2.0));
        }

        return Array.isArray(pattern) ? arr : (arr[0] ?? 50);
    }

    // ========================================
    // MAIN HAPTIC TRIGGER
    // ========================================

    /**
     * Trigger haptic feedback
     * @param patternName - Pattern name from library
     * @param description - Debug description
     * @param options - Options (channel, force)
     */
    public trigger(patternName: HapticPatternName, description: string = '', options: HapticOptions = {}): void {
        const { channel = 'ui', force = false } = options;

        // Check if user has enabled haptics
        if (!this.settings.getHapticEnabled()) {
            return;
        }

        // Check device support
        if (!navigator.vibrate) {
            return;
        }

        // Debounce anti-spam
        const now = performance.now();
        if (!force && (now - this.lastHapticTime) < this.hapticCooldownMs) {
            if (GameConfig.DEBUG_MODE) console.log(`🚫 Haptic debounced: ${patternName}`);
            return;
        }
        this.lastHapticTime = now;

        // Get pattern (always returns a fallback, so no need to check for null)
        const basePattern = this.getPattern(patternName);

        // Scale by comfort
        const comfort = this.settings.getComfortIntensity();
        const finalPattern = this.scalePattern(basePattern, comfort);

        // Trigger vibration
        navigator.vibrate(finalPattern);

        // Log
        this.logSensory(patternName, channel, finalPattern, description);

        if (GameConfig.DEBUG_MODE) {
            console.log(`📳 Haptic: ${patternName} [channel=${channel}, comfort=${comfort}] - ${description}`, finalPattern);
        }
    }

    /**
     * Legacy V1 compatibility: triggerHaptic
     * @param patternName - Pattern name
     * @param description - Debug description
     * @param options - Options
     */
    public triggerHaptic(patternName: HapticPatternName, description: string = '', options: HapticOptions = {}): void {
        this.trigger(patternName, description, options);
    }

    // ========================================
    // UNIFIED SENSORY FEEDBACK
    // ========================================

    /**
     * Trigger combined haptic + visual feedback
     * @param cueType - Cue type from SENSORY_CUES
     * @param target - Visual target element
     * @param description - Debug description
     */
    public triggerSensory(cueType: SensoryCueName, target: HTMLElement | null = null, description: string = ''): void {
        // Get cue metadata from GameConfig
        const meta = GameConfig.SENSORY_CUES[cueType];
        if (!meta) {
            if (GameConfig.DEBUG_MODE) {
                console.warn(`⚠️ Unknown sensory cue: ${cueType}`);
            }
            return;
        }

        const { channel, basePattern, visualType } = meta;

        // 1) Visual cue - emit event and call manager if available
        if (visualType) {
            // Emit event for anyone listening
            this.eventBus.emit('visual:cue', { type: visualType, channel });

            // Also trigger visual cue manager if set
            if (this.visualCueManager) {
                this.visualCueManager.trigger(visualType, target, { channel });
            }
        }

        // 2) Haptic (critical/narrative bypass debounce)
        if (basePattern) {
            const forceTrigger = channel === 'critical' || channel === 'narrative';
            this.trigger(
                basePattern as HapticPatternName,
                description || `Sensory cue: ${cueType}`,
                { channel: channel as any, force: forceTrigger }
            );
        }

        if (GameConfig.DEBUG_MODE) {
            console.log(`🎯 Sensory: ${cueType} [channel=${channel}] visual=${visualType || 'none'} haptic=${basePattern || 'none'}`);
        }
    }

    /**
     * Legacy V1 compatibility: triggerSensoryFeedback
     * @param cueType - Cue type
     * @param target - Target element
     * @param description - Description
     */
    public triggerSensoryFeedback(cueType: SensoryCueName, target: HTMLElement | null = null, description: string = ''): void {
        this.triggerSensory(cueType, target, description);
    }

    // ========================================
    // DEBUG LOGGING
    // ========================================

    /**
     * Log sensory event for debugging
     * @param cueType - Cue type
     * @param channel - Channel
     * @param pattern - Pattern
     * @param description - Description
     */
    private logSensory(cueType: string, channel: string, pattern: number | number[], description: string): void {
        if (!GameConfig.DEBUG_MODE) return;

        this.sensoryLog.push({
            cueType,
            channel,
            pattern,
            description,
            comfort: this.settings.getComfortIntensity(),
            time: new Date().toLocaleTimeString()
        });

        // Keep only last N entries
        if (this.sensoryLog.length > this.maxSensoryLog) {
            this.sensoryLog.shift();
        }
    }

    /**
     * Get sensory log for dev HUD
     * @returns Sensory log entries
     */
    public getSensoryLog(): SensoryLogEntry[] {
        return this.sensoryLog;
    }

    /**
     * Clear sensory log
     */
    public clearSensoryLog(): void {
        this.sensoryLog = [];
    }
}
