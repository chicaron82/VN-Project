/**
 * AppSwitcherController - Shell App Switcher Management
 *
 * Extracted from UV7Shell.ts (~230 lines → dedicated module)
 *
 * Handles:
 * - Recent apps tracking and persistence
 * - App switcher UI rendering
 * - Card interactions (launch, remove)
 * - Event handler wiring
 */

import { Logger } from '@utils/Logger';

interface AppConfig {
    title: string;
    icon: string;
    description: string;
}

interface RecentApp extends AppConfig {
    id: string;
    timestamp: Date;
}

interface ShellElements {
    appSwitcher: HTMLElement | null;
    appCardsGrid: HTMLElement | null;
    backdrop: HTMLElement | null;
    sidebar: HTMLElement | null;
    shade: HTMLElement | null;
}

interface ShellInterface {
    currentApp: { id: string } | null;
    navigateTo(appId: string): void;
}

export class AppSwitcherController {
    private shell: ShellInterface;
    private elements: ShellElements;
    private recentApps: RecentApp[];

    constructor(shell: ShellInterface, elements: ShellElements) {
        this.shell = shell;
        this.elements = elements;
        this.recentApps = this.loadRecentApps();
    }

    /**
     * Initialize app switcher event handlers
     */
    public init(): void {
        // Status Logo toggles switcher (User request)
        const logoBtn = document.querySelector('.status-logo');
        if (logoBtn) {
            // Remove old listeners by cloning
            const newBtn = logoBtn.cloneNode(true);
            logoBtn.parentNode!.replaceChild(newBtn, logoBtn);

            newBtn.addEventListener('click', () => {
                this.toggle();
            });
        }

        // Close button
        const closeBtn = document.querySelector('.app-switcher-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Clear all button
        const clearBtn = document.getElementById('app-switcher-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.recentApps = [];
                this.saveRecentApps();
                this.render();
            });
        }

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.appSwitcher?.classList.contains('open')) {
                this.close();
            }
        });
    }

    /**
     * Load recent apps from localStorage
     */
    private loadRecentApps(): RecentApp[] {
        try {
            const stored = localStorage.getItem('uv7-recent-apps');
            if (stored) {
                const apps = JSON.parse(stored);
                // Convert timestamp strings back to Date objects and validate
                return apps.map((app: any) => {
                    // Ensure app has all required properties by merging with fresh config
                    const config = this.getAppConfig(app.id || 'unknown');
                    return {
                        id: app.id || 'unknown',
                        ...config,
                        timestamp: app.timestamp ? new Date(app.timestamp) : new Date()
                    };
                }).filter((app: RecentApp) => app.id !== 'unknown');
            }
        } catch (e) {
            Logger.warn('[AppSwitcherController] Failed to load recent apps', e);
        }
        return [];
    }

    /**
     * Save recent apps to localStorage
     */
    private saveRecentApps(): void {
        try {
            localStorage.setItem('uv7-recent-apps', JSON.stringify(this.recentApps));
        } catch (e) {
            Logger.warn('[AppSwitcherController] Failed to save recent apps', e);
        }
    }

    /**
     * Add app to recent list
     */
    public addToRecent(appId: string): void {
        // Remove if exists (to move to top)
        this.recentApps = this.recentApps.filter(app => app.id !== appId);

        // Add to front
        const appConfig = this.getAppConfig(appId);
        this.recentApps.unshift({
            id: appId,
            ...appConfig,
            timestamp: new Date()
        });

        // Limit to 6 apps
        if (this.recentApps.length > 6) {
            this.recentApps.pop();
        }

        // Persist to localStorage
        this.saveRecentApps();
    }

    /**
     * Get static config for app (placeholder)
     */
    private getAppConfig(appId: string): AppConfig {
        const configs: Record<string, AppConfig> = {
            'landing': { title: 'Home', icon: '🏠', description: 'UV7 Landing Page' },
            'showcase': { title: 'Showcase', icon: '📖', description: 'Design System & Docs' },
            'v1': { title: 'V1 Game', icon: '🎮', description: 'The Original Chaos' },
            'v2': { title: 'V2 Engine', icon: '⚡', description: 'Next-Gen Visual Novel' },
            'torigatchi': { title: 'Tori-gatchi', icon: '💖', description: 'Virtual Pet Companion' }
        };
        return configs[appId] || { title: appId, icon: '📱', description: 'UV7 App' };
    }

    /**
     * Toggle the app switcher overlay
     */
    public toggle(): void {
        if (this.elements.appSwitcher?.classList.contains('open')) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Open the app switcher
     */
    public open(): void {
        this.render();
        this.elements.appSwitcher?.classList.add('open');
        this.elements.backdrop?.classList.add('visible'); // Optional: reuse backdrop or switcher has its own bg
    }

    /**
     * Close the app switcher
     */
    public close(): void {
        this.elements.appSwitcher?.classList.remove('open');
        // Don't hide backdrop if sidebar/shade is open
        if (!this.elements.sidebar?.classList.contains('open') &&
            !this.elements.shade?.classList.contains('open')) {
            this.elements.backdrop?.classList.remove('visible');
        }
    }

    /**
     * Render the App Cards
     */
    public render(): void {
        // Safe get grid
        let grid = this.elements.appCardsGrid;
        if (!grid) {
            grid = document.getElementById('app-cards-grid');
            this.elements.appCardsGrid = grid;
        }
        if (!grid) {
            Logger.error('[AppSwitcherController] App Cards Grid not found in DOM');
            return;
        }

        // Fallback: If empty, assume we are on home/showcase (since we are here)
        if (this.recentApps.length === 0) {
            this.addToRecent('showcase');
        }

        if (this.recentApps.length === 0) {
            // Should be unreachable now, but keep as safety
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem; opacity: 0.5;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
                    <p>No recent apps</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.recentApps.map(app => `
            <div class="app-card ${this.shell.currentApp?.id === app.id ? 'active' : ''}" onclick="uv7Shell.navigateTo('${app.id}'); uv7Shell.appSwitcher.close();">
                <button class="app-card-close" onclick="event.stopPropagation(); uv7Shell.appSwitcher.remove('${app.id}')">✕</button>
                <div class="quick-resume-badge">Quick Resume</div>
                <div class="app-preview">
                    <div class="app-preview-icon">${app.icon}</div>
                </div>
                <div class="app-info">
                    <div class="app-name">
                        <span class="app-title">${app.title}</span>
                        ${this.shell.currentApp?.id === app.id ? '<span class="app-badge active">Active</span>' : ''}
                    </div>
                    <div class="app-description">${app.description}</div>
                    <div class="app-state">
                        <span class="app-state-item time">${this.formatTime(app.timestamp)}</span>
                        <span class="app-state-item">Ready</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Remove an app from the recent apps list
     */
    public remove(appId: string): void {
        this.recentApps = this.recentApps.filter(app => app.id !== appId);
        this.saveRecentApps();
        this.render();
    }

    /**
     * Format timestamp for display
     */
    private formatTime(date: Date): string {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}
