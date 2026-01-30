import { StateManager } from '../core/StateManager';
import { GameConfig } from '../core/GameConfig';

export interface GameSettings {
    textSpeed: number; // ms per char
    hapticsEnabled: boolean;
    comfortLevel: number; // 0=Gentle, 1=Normal, 2=Amped, 3=INSANE
    volume: number; // 0.0 to 1.0
    animationsEnabled: boolean; // For accessibility
    fontSize: 'normal' | 'large' | 'xl';
    highContrast: boolean;
    skipEnabled: boolean;
    autoAdvance: boolean;
    autoAdvanceDelay: number;
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
    skipEnabled: true,
    autoAdvance: false,
    autoAdvanceDelay: 3000,
    swipeSettings: {
        minDistance: 35,
        maxTime: 650,
        restraint: 120
    }
};

export class SettingsSystem {
    private stateManager: StateManager;
    private readonly STORAGE_KEY = 'v848_settings';

    constructor(stateManager: StateManager) {
        this.stateManager = stateManager;
    }

    init(): void {
        const stored = this.loadFromStorage();
        const merged = { ...DEFAULT_SETTINGS, ...stored };

        this.stateManager.set('settings', merged);
        this.applySettings(merged);
    }

    private applySettings(settings: GameSettings): void {
        if (typeof document === 'undefined') return;

        const body = document.body;

        if (!settings.animationsEnabled) {
            body.classList.add('reduced-motion');
        } else {
            body.classList.remove('reduced-motion');
        }

        if (settings.highContrast) {
            body.classList.add('high-contrast');
        } else {
            body.classList.remove('high-contrast');
        }

        body.classList.remove('font-normal', 'font-large', 'font-xl');
        body.classList.add(`font-${settings.fontSize}`);
    }

    get<K extends keyof GameSettings>(key: K): GameSettings[K] {
        return this.stateManager.get(`settings.${key}`) as GameSettings[K];
    }

    set<K extends keyof GameSettings>(key: K, value: GameSettings[K]): void {
        this.stateManager.set(`settings.${key}`, value);
        this.saveToStorage();

        const current = this.stateManager.get('settings') as GameSettings;
        this.applySettings(current);
    }

    private loadFromStorage(): Partial<GameSettings> {
        if (typeof localStorage === 'undefined') return {};
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
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
