import { StateManager } from '@core/StateManager';
import { GameConfig } from '@core/GameConfig';

export interface GameSettings {
    textSpeed: number; // ms per char
    hapticsEnabled: boolean;
    comfortLevel: number; // 0=Gentle, 1=Normal, 2=Amped, 3=INSANE
    volume: number; // 0.0 to 1.0 (Master volume if we had audio)
    animationsEnabled: boolean; // For accessibility
    // New Accessibility
    fontSize: 'normal' | 'large' | 'xl';
    highContrast: boolean;
    // Skip System
    skipEnabled: boolean; // Allow skip feature (user preference to disable)
    // Auto-Advance
    autoAdvance: boolean;
    autoAdvanceDelay: number; // ms to wait after text completes
    // Mobile Swipe
    swipeSettings: {
        minDistance: number;
        maxTime: number;
        restraint: number;
    };
}

const DEFAULT_SETTINGS: GameSettings = {
    textSpeed: GameConfig.TIMING.TYPEWRITER_SPEED_MS,
    hapticsEnabled: true,
    comfortLevel: 1, // Normal
    volume: 1.0,
    animationsEnabled: true,
    fontSize: 'normal',
    highContrast: false,
    skipEnabled: true, // Skip is enabled by default (still requires unlock)
    autoAdvance: false,
    autoAdvanceDelay: 3000, // Default 3 seconds
    swipeSettings: {
        minDistance: 35,
        maxTime: 650,
        restraint: 120
    }
};

/**
 * SettingsSystem
 * 
 * Manages user preferences and persistence.
 * Wraps StateManager for 'settings.*' path but adds specific logic/validation.
 */
export class SettingsSystem {
    private stateManager: StateManager;
    private readonly STORAGE_KEY = 'v848_settings';

    constructor(stateManager: StateManager) {
        this.stateManager = stateManager;
    }

    /**
     * Initialize settings from storage or defaults
     */
    init(): void {
        const stored = this.loadFromStorage();
        const merged = { ...DEFAULT_SETTINGS, ...stored };

        this.stateManager.set('settings', merged);

        // Apply initial settings to DOM
        this.applySettings(merged);
    }

    /**
     * Apply visual settings to the DOM body
     */
    private applySettings(settings: GameSettings): void {
        if (typeof document === 'undefined') return;

        const body = document.body;

        // Animations / Reduced Motion
        if (!settings.animationsEnabled) {
            body.classList.add('reduced-motion');
        } else {
            body.classList.remove('reduced-motion');
        }

        // High Contrast
        if (settings.highContrast) {
            body.classList.add('high-contrast');
        } else {
            body.classList.remove('high-contrast');
        }

        // Font Size
        body.classList.remove('font-normal', 'font-large', 'font-xl');
        body.classList.add(`font-${settings.fontSize}`);
    }

    /**
     * Get a setting value
     */
    get<K extends keyof GameSettings>(key: K): GameSettings[K] {
        return this.stateManager.get(`settings.${key}`) as GameSettings[K];
    }

    /**
     * Set a setting value and persist
     */
    set<K extends keyof GameSettings>(key: K, value: GameSettings[K]): void {
        this.stateManager.set(`settings.${key}`, value);
        this.saveToStorage();

        // Re-apply settings to update DOM
        const current = this.stateManager.get('settings') as GameSettings;
        this.applySettings(current);
    }

    /**
     * Helper for HapticSystem
     */
    getHapticEnabled(): boolean {
        return this.get('hapticsEnabled');
    }

    getComfortIntensity(): number {
        return this.get('comfortLevel');
    }

    // internal
    private loadFromStorage(): Partial<GameSettings> {
        if (typeof localStorage === 'undefined') return {};
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            const settings = raw ? JSON.parse(raw) : {};

            // Check for V1 Swipe Settings (Migration)
            if (!settings.swipeSettings) {
                const legacySwipe = localStorage.getItem('swipe_settings');
                if (legacySwipe) {
                    try {
                        console.log('🔄 Migrating V1 Swipe Settings...');
                        const parsed = JSON.parse(legacySwipe);
                        settings.swipeSettings = {
                            minDistance: parsed.minDist || 35,
                            maxTime: parsed.maxTime || 650,
                            restraint: 120 // V1 didn't track this, default it
                        };
                        // Note: V1 invertX/Y not migrated as V2 handles direction differently
                    } catch (e) {
                        console.warn('Failed to migrate swipe settings', e);
                    }
                }
            }

            return settings;
        } catch (e) {
            console.warn('Failed to load settings', e);
            return {};
        }
    }

    private saveToStorage(): void {
        if (typeof localStorage === 'undefined') return;
        try {
            const current = this.stateManager.get('settings');
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(current));
        } catch (e) {
            console.warn('Failed to save settings', e);
        }
    }
}
