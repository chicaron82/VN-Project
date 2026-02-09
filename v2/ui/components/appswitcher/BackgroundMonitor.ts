/**
 * BackgroundMonitor - Background app state monitoring and notifications
 *
 * Extracted from UV7AppSwitcher.ts (~99 lines → dedicated module)
 *
 * Handles:
 * - Monitor background apps every 30 seconds
 * - Show notification pills for urgent conditions (e.g., Torigatchi hangry)
 * - Gentle reminders for apps not visited in 24+ hours
 * - Dismissal memory to prevent spam
 * - Click to launch app from notification
 */

import { Logger } from '@utils/Logger';

interface MonitoredApp {
    id: string;
    name: string;
    icon: string;
    getState: () => MonitoredAppState;
}

interface MonitoredAppState {
    state: string[] | string;
    hasSave: boolean;
    isHangry?: boolean;
}

export class BackgroundMonitor {
    private apps: MonitoredApp[];
    private currentApp: string;
    private monitorInterval: number | null = null;
    private launchAppCallback: (app: any) => void;

    constructor(
        apps: MonitoredApp[],
        getCurrentApp: () => string,
        launchAppCallback: (app: any) => void
    ) {
        this.apps = apps;
        this.currentApp = getCurrentApp();
        this.launchAppCallback = launchAppCallback;
    }

    /**
     * Start background monitoring (checks every 30 seconds)
     */
    public start(): void {
        // Check background apps every 30 seconds
        this.monitorInterval = window.setInterval(() => {
            this.checkBackgroundApps();
        }, 30000);

        // Initial check after 2 seconds
        setTimeout(() => this.checkBackgroundApps(), 2000);
    }

    /**
     * Stop background monitoring
     */
    public stop(): void {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
        }
    }

    /**
     * Update current app (call when switching apps)
     */
    public setCurrentApp(appId: string): void {
        this.currentApp = appId;
    }

    /**
     * Check all background apps for notifications
     */
    private checkBackgroundApps(): void {
        this.apps.forEach(app => {
            // Skip current app
            if (app.id === this.currentApp) return;

            const stateData = app.getState();

            // Check for urgent conditions
            if (app.id === 'torigatchi' && stateData.isHangry) {
                this.showBackgroundIndicator(app, stateData, true);
            } else if (stateData.hasSave && this.shouldShowReminder(app)) {
                // Show gentle reminder for apps not visited in 24+ hours
                this.showBackgroundIndicator(app, stateData, false);
            }
        });
    }

    /**
     * Check if app should show reminder (not visited in 24+ hours)
     */
    private shouldShowReminder(app: MonitoredApp): boolean {
        const lastPlayedKey = `uv7_last_played_${app.id}`;
        const lastPlayed = localStorage.getItem(lastPlayedKey);
        if (!lastPlayed) return false;

        const hoursSince = (Date.now() - parseInt(lastPlayed)) / (1000 * 60 * 60);
        return hoursSince > 24;
    }

    /**
     * Show background notification pill
     */
    private showBackgroundIndicator(app: MonitoredApp, stateData: MonitoredAppState, isUrgent: boolean): void {
        // Only show one indicator at a time per app
        const existingPill = document.querySelector(`[data-bg-app="${app.id}"]`);
        if (existingPill) return;

        // Don't spam - check dismissal memory
        const dismissedKey = `uv7-bg-dismissed-${app.id}`;
        const dismissedAt = localStorage.getItem(dismissedKey);
        if (dismissedAt) {
            const hoursSinceDismiss = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60);
            // Don't show again for 4 hours (or 1 hour if urgent)
            if (hoursSinceDismiss < (isUrgent ? 1 : 4)) return;
        }

        const pill = document.createElement('div');
        pill.className = `bg-indicator-pill ${isUrgent ? 'urgent' : ''}`;
        pill.dataset.bgApp = app.id;

        const stateText = Array.isArray(stateData.state) ? stateData.state.join(' • ') : stateData.state;

        pill.innerHTML = `
            <span class="bg-indicator-icon">${app.icon}</span>
            <div class="bg-indicator-text">
                <span class="bg-indicator-app">${app.name}</span>
                <span class="bg-indicator-state">${stateText}</span>
            </div>
            <button class="bg-indicator-close" aria-label="Dismiss">✕</button>
        `;

        // Click to open app
        pill.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).classList.contains('bg-indicator-close')) return;
            this.launchAppCallback(app);
            pill.remove();
        });

        // Dismiss button
        const closeBtn = pill.querySelector('.bg-indicator-close') as HTMLElement;
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            localStorage.setItem(dismissedKey, Date.now().toString());
            pill.classList.remove('visible');
            setTimeout(() => pill.remove(), 300);
        });

        document.body.appendChild(pill);

        // Animate in
        requestAnimationFrame(() => {
            pill.classList.add('visible');
        });

        // Haptic for urgent
        if (isUrgent && navigator.vibrate) {
            navigator.vibrate([50, 50, 50]);
        }

        Logger.ui(`🔔 Background alert: ${app.name} - ${stateText}`);
    }
}
