/**
 * AppSwitcherState - Recent apps tracking and resume flag management
 *
 * Extracted from UV7AppSwitcher.ts (~55 lines → dedicated module)
 *
 * Handles:
 * - Detect current app from URL pathname
 * - Track recently accessed apps
 * - Persist recent apps to localStorage
 * - Set/clear resume flags for instant resume feature
 */

const RECENT_APPS_KEY = 'uv7-recent-apps';
const MAX_RECENT_APPS = 4;

export class AppSwitcherState {
    private recentApps: string[] = [];

    constructor() {
        this.recentApps = this.loadRecentApps();
    }

    /**
     * Detect current app ID from URL pathname
     */
    public detectCurrentApp(): string {
        const path = window.location.pathname;
        if (path.includes('/v1/')) return 'v1';
        if (path.includes('/v2/') || path === '/index.v2.html') return 'v2';
        if (path.includes('/torigatchi/')) return 'torigatchi';
        if (path.includes('/showcase/')) return 'showcase';
        // Landing page or root - this shouldn't happen normally
        if (path === '/' || path === '/index.html') {
            // Check if we have a current app in session storage
            const lastApp = sessionStorage.getItem('uv7-current-app');
            return lastApp || 'landing';
        }
        return 'landing';
    }

    /**
     * Get recent apps list
     */
    public getRecentApps(): string[] {
        return [...this.recentApps];
    }

    /**
     * Add app to recent apps list
     */
    public addToRecent(appId: string): void {
        this.recentApps = [appId, ...this.recentApps.filter(id => id !== appId)];
        if (this.recentApps.length > MAX_RECENT_APPS) {
            this.recentApps = this.recentApps.slice(0, MAX_RECENT_APPS);
        }
        this.saveRecentApps();
        // Track current app in session storage
        sessionStorage.setItem('uv7-current-app', appId);
    }

    /**
     * Check if app is in recent list
     */
    public isRecent(appId: string): boolean {
        return this.recentApps.includes(appId);
    }

    /**
     * Get recent apps count
     */
    public getRecentCount(): number {
        return this.recentApps.length;
    }

    /**
     * Load recent apps from localStorage
     */
    private loadRecentApps(): string[] {
        try {
            return JSON.parse(localStorage.getItem(RECENT_APPS_KEY) || '[]');
        } catch {
            return [];
        }
    }

    /**
     * Save recent apps to localStorage
     */
    private saveRecentApps(): void {
        localStorage.setItem(RECENT_APPS_KEY, JSON.stringify(this.recentApps));
    }

    /**
     * Set resume flag for instant resume
     */
    public setResumeFlag(appId: string): void {
        localStorage.setItem('uv7-auto-resume', appId);
        localStorage.setItem('uv7-resume-timestamp', Date.now().toString());
    }

    /**
     * Clear resume flag
     */
    public clearResumeFlag(): void {
        localStorage.removeItem('uv7-auto-resume');
        localStorage.removeItem('uv7-resume-timestamp');
    }

    /**
     * Clear all state
     */
    public clear(): void {
        this.recentApps = [];
        this.saveRecentApps();
        this.clearResumeFlag();
        sessionStorage.removeItem('uv7-current-app');
    }
}
