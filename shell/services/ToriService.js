/**
 * ═══════════════════════════════════════════════════════════════
 * TORI-GATCHI SERVICE - BACKGROUND PROCESS
 *
 * "Ghost Engine" that tracks Tori's needs even when the app is closed.
 * Manages decay, notifications, and status bar updates.
 * ═══════════════════════════════════════════════════════════════
 */

export class ToriService {
    constructor(shell) {
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
     * Start the service
     */
    init() {
        console.log('[ToriService] Initializing ghost engine...');

        // Load settings
        this.loadSettings();

        // Listen for settings changes
        window.addEventListener('uv7:tori-settings-change', (e) => {
            console.log('[ToriService] Settings updated:', e.detail);
            this.settings = e.detail;
        });

        // Run immediately
        this.tick();

        // Start loop (checks every minute)
        setInterval(() => this.tick(), 60000);

        console.log('[ToriService] Background service running');
    }

    loadSettings() {
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
    tick() {
        try {
            const stateStr = localStorage.getItem(this.STATE_KEY);
            if (!stateStr) return; // Not started yet

            const state = JSON.parse(stateStr);
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
    calculateProjectedState(state) {
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
    checkNotifications(state) {
        const now = Date.now();
        if (now - this.lastNotificationTime < this.NOTIFICATION_COOLDOWN) return;

        let message = null;
        let icon = null;

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

        if (message) {
            this.sendNotification(message, icon);
        }
    }

    sendNotification(message, icon) {
        console.log(`[ToriService] Notification: ${message}`);

        // Use Shell Toast
        this.shell.system.showToast(`${icon} ${message}`);

        this.lastNotificationTime = Date.now();
    }
}
