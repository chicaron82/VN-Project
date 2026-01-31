/**
 * ═══════════════════════════════════════════════════════════════
 * TORI-GATCHI SERVICE - BACKGROUND PROCESS
 *
 * "Ghost Engine" that tracks Tori's needs even when the app is closed.
 * Manages decay, notifications, and status bar updates.
 * ═══════════════════════════════════════════════════════════════
 */

import type { UV7Shell } from '../UV7Shell.js';

interface ToriState {
    love: number;
    hunger: number;
    lastLoveDecay: number;
    lastHungerDecay: number;
    mood?: string;
}

interface ToriSettings {
    notifyHunger: boolean;
    notifyLonely: boolean;
    notifyCritical: boolean;
}

export class ToriService {
    private shell: UV7Shell;
    private readonly STATE_KEY: string;
    private readonly LOVE_DECAY_INTERVAL_MINUTES: number;
    private readonly LOVE_DECAY_AMOUNT: number;
    private readonly HUNGER_DECAY_INTERVAL_MINUTES: number;
    private readonly HUNGER_DECAY_AMOUNT: number;
    private settings: ToriSettings;
    private lastNotificationTime: number;
    private readonly NOTIFICATION_COOLDOWN: number;

    constructor(shell: UV7Shell) {
        this.shell = shell;

        // Simulation Constants (Must match main.js)
        this.STATE_KEY = "toriGatchiState";
        this.LOVE_DECAY_INTERVAL_MINUTES = 60;
        this.LOVE_DECAY_AMOUNT = 5;
        this.HUNGER_DECAY_INTERVAL_MINUTES = 30;
        this.HUNGER_DECAY_AMOUNT = 7;

        // Notification settings
        this.settings = {
            notifyHunger: true,
            notifyLonely: true,
            notifyCritical: true
        };

        // Cache state
        this.lastNotificationTime = 0;
        this.NOTIFICATION_COOLDOWN = 1000 * 60 * 60; // 1 hour between notifications
    }

    /**
     * Start the background Tori-gatchi service
     *
     * Initializes the "ghost engine" that keeps Tori alive even when the
     * Tori-gatchi app is closed. Sets up event listeners for state changes,
     * begins the simulation tick loop (runs every minute), and handles
     * notifications when Tori needs attention.
     *
     * Called once during UV7Shell initialization.
     *
     * @example
     * const toriService = new ToriService(shell);
     * toriService.init();
     * // Now Tori's needs decay in the background
     * // Status bar updates automatically via events
     */
    init(): void {
        console.log('[ToriService] Initializing ghost engine...');

        // Load settings
        this.loadSettings();

        // Listen for settings changes
        window.addEventListener('uv7:tori-settings-change', (e: Event) => {
            const customEvent = e as CustomEvent<ToriSettings>;
            console.log('[ToriService] Settings updated:', customEvent.detail);
            this.settings = customEvent.detail;
        });

        // Listen for localStorage changes (when Tori-gatchi updates state)
        window.addEventListener('storage', (e: StorageEvent) => {
            if (e.key === this.STATE_KEY && e.newValue) {
                this.onStateChange();
            }
        });

        // Also listen for custom event from same-window updates
        window.addEventListener('uv7:tori-state-update', () => {
            this.onStateChange();
        });

        // Run immediately
        this.tick();

        // Start loop (checks every minute)
        setInterval(() => this.tick(), 60000);

        console.log('[ToriService] Background service running');
    }

    /**
     * Called when Tori state changes
     * Emits event for UI to update
     */
    private onStateChange(): void {
        const stateStr = localStorage.getItem(this.STATE_KEY);
        if (!stateStr) return;

        try {
            const state: ToriState = JSON.parse(stateStr);
            const projected = this.calculateProjectedState(state);

            // Emit event for listeners (e.g., UV7Shell status bar)
            window.dispatchEvent(new CustomEvent('uv7:tori-status-changed', {
                detail: projected
            }));
        } catch (e) {
            console.warn('[ToriService] Failed to parse state on change', e);
        }
    }

    private loadSettings(): void {
        try {
            const stored = localStorage.getItem('uv7-tori-settings');
            if (stored) this.settings = JSON.parse(stored);
        } catch (e) {
            console.warn('[ToriService] Failed to load settings', e);
        }
    }

    /**
     * Main simulation tick
     */
    private tick(): void {
        try {
            const stateStr = localStorage.getItem(this.STATE_KEY);
            if (!stateStr) return; // Not started yet

            const state: ToriState = JSON.parse(stateStr);
            if (!state) return;

            // 1. Calculate Decay (Read-Only Simulation)
            // We don't WRITE state here to avoid race conditions with the open app.
            // We just detect if we need to notify.
            // Actually, we SHOULD write state if the app isn't open?
            // For now, let's just checking current state. If the app is closed,
            // main.js isn't running, so decay isn't happening.
            //
            // CRITICAL: The Shell needs to actually PERFORM decay if the app is closed!
            // But we must be careful not to conflict if the app IS open.

            // Safe approach: Check if app is open
            // If IFrame exists, let it handle decay.
            // If not, we handle it?

            // Actually, let's keep it simple: Just READ current state.
            // If main.js runs via IFrame, it updates storage.
            // If the user hasn't opened it in days, the state in storage is OLD.
            // So we need to compute what the state WOULD be.

            // Projected State Calculation
            const projected = this.calculateProjectedState(state);

            // Check for critical conditions
            this.checkNotifications(projected);

            // Note: We deliberately do NOT save the projected state back to localStorage.
            // We let the game logic (main.js) handle the official "catch up" calculation
            // when it next launches. We just peek to see if we SHOULD warn the user.

        } catch (e) {
            console.warn('[ToriService] Simulation error', e);
        }
    }

    /**
     * Project what the state is right now based on time elapsed
     */
    private calculateProjectedState(state: ToriState): ToriState {
        const now = Date.now();

        // Clone state to protect original
        const proj = { ...state };

        const loveDecayTime = (now - proj.lastLoveDecay) / 60000;
        const hungerDecayTime = (now - proj.lastHungerDecay) / 60000;

        // Cap decay (24h max) like main.js
        const cappedLove = Math.min(loveDecayTime, 1440);
        const cappedHunger = Math.min(hungerDecayTime, 1440);

        const loveSteps = Math.floor(cappedLove / this.LOVE_DECAY_INTERVAL_MINUTES);
        const hungerSteps = Math.floor(cappedHunger / this.HUNGER_DECAY_INTERVAL_MINUTES);

        if (loveSteps > 0) {
            proj.love = Math.max(0, proj.love - (loveSteps * this.LOVE_DECAY_AMOUNT));
        }

        if (hungerSteps > 0) {
            proj.hunger = Math.max(0, proj.hunger - (hungerSteps * this.HUNGER_DECAY_AMOUNT));
        }

        // Recalculate mood (Simplified logic for projection)
        if (proj.hunger <= 10) proj.mood = "Hangry";
        else if (proj.love <= 30) proj.mood = "Sad";
        else if (proj.hunger <= 30) proj.mood = "Grumpy";

        return proj;
    }

    /**
     * Check if we should notify the user
     */
    private checkNotifications(state: ToriState): void {
        const now = Date.now();
        if (now - this.lastNotificationTime < this.NOTIFICATION_COOLDOWN) return;

        let message: string | null = null;
        let icon: string | null = null;

        // Priority 1: Hangry (Critical)
        if (state.hunger <= 10 && this.settings.notifyCritical) {
            message = "Tori is Hangry! 💢 Feed her soon!";
            icon = "💢";
        }
        // Priority 2: Sad (Critical)
        else if (state.love <= 20 && this.settings.notifyCritical) {
            message = "Tori is lonely... 😢 She misses you.";
            icon = "😢";
        }
        // Priority 3: Hungry (Warning)
        else if (state.hunger <= 30 && this.settings.notifyHunger) {
            message = "Tori is getting hungry. 🍔";
            icon = "🍔";
        }
        // Priority 4: Lonely (Warning)
        else if (state.love <= 40 && this.settings.notifyLonely) {
            message = "Tori wants to play! 🎮";
            icon = "🎮";
        }

        if (message && icon) {
            this.sendNotification(message, icon);
        }
    }

    private sendNotification(message: string, icon: string): void {
        console.log(`[ToriService] Notification: ${message}`);

        // Use Shell Toast
        this.shell.system.showToast(`${icon} ${message}`);

        this.lastNotificationTime = Date.now();
    }
}
