/**
 * SystemBannerController
 *
 * Transforms the decorative system banner into a functional app navigator
 * with status indicators, hover previews, and keyboard shortcuts.
 *
 * Features:
 * - Activity states: 🟢 active, ⚪ background, 🔴 not loaded
 * - Animated state transitions with loading pulses
 * - Hover previews showing app details
 * - Click navigation to apps
 * - Keyboard shortcuts (Cmd/Ctrl + 1-4)
 * - Responsive mobile collapse
 *
 * 💚🔥💀
 */

import type { TabController } from '../core/TabController';
import { BannerPreviewCard } from './BannerPreviewCard';
import { Logger } from '@utils/Logger';

interface AppConfig {
    id: string;
    label: string;
    shortcut: number;
    getStatus: () => 'active' | 'background' | 'not-loaded';
    navigate: () => void;
    getPreview: () => string;
}

export class SystemBannerController {
    private tabController: TabController;
    private bannerElement: HTMLElement | null = null;
    private updateInterval: number | null = null;
    private previewCard: BannerPreviewCard;

    private readonly APPS: AppConfig[] = [
        {
            id: 'v1',
            label: 'V1',
            shortcut: 1,
            getStatus: () => this.getAppStatus('v1'),
            navigate: () => this.navigateToApp('v1'),
            getPreview: () => 'UV7 Visual Novel v1 - Original JavaScript implementation'
        },
        {
            id: 'v2',
            label: 'V2',
            shortcut: 2,
            getStatus: () => this.getAppStatus('v2'),
            navigate: () => this.navigateToApp('v2'),
            getPreview: () => 'UV7 Visual Novel v2 - TypeScript rewrite with EventBus architecture'
        },
        {
            id: 'tg',
            label: 'TG',
            shortcut: 3,
            getStatus: () => this.getAppStatus('tg'),
            navigate: () => this.navigateToApp('tg'),
            getPreview: () => 'Timeline Graph - Interactive visualization (coming soon)'
        },
        {
            id: 'showcase',
            label: 'SHOWCASE',
            shortcut: 4,
            getStatus: () => 'active', // Always active when in showcase
            navigate: () => {
                // If in shell, navigate to showcase
                const isInShell = window.self !== window.top;
                if (isInShell) {
                    window.parent.location.hash = '#/showcase';
                }
                // Already in showcase, just scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            getPreview: () => 'UV7 Showcase - Project overview and journal timeline'
        }
    ];

    constructor(tabController: TabController) {
        this.tabController = tabController;
        this.previewCard = new BannerPreviewCard();
        this.init();
    }

    private init(): void {
        this.bannerElement = document.querySelector('.system-banner');
        if (!this.bannerElement) {
            Logger.warn('SystemBannerController: .system-banner element not found');
            return;
        }

        this.renderAppIndicators();
        this.wireKeyboardShortcuts();
        this.startStatusUpdates();
        this.renderPortraitHint();
    }

    /**
     * Show a one-time "Tap ⚡ to switch apps" hint on portrait
     * Dismisses on tap, auto-fades after 8s, persisted via localStorage
     */
    private renderPortraitHint(): void {
        if (!this.bannerElement) return;
        if (localStorage.getItem('uv7-banner-hint-dismissed')) return;

        const sysLeft = this.bannerElement.querySelector('.sys-left');
        if (!sysLeft) return;

        const hint = document.createElement('span');
        hint.className = 'banner-app-hint';
        hint.textContent = '↑ TAP LOGO TO SWITCH APPS';
        hint.setAttribute('role', 'status');

        const dismiss = (): void => {
            hint.classList.add('dismissed');
            localStorage.setItem('uv7-banner-hint-dismissed', '1');
            setTimeout(() => hint.remove(), 300);
        };

        hint.addEventListener('click', dismiss);

        // Auto-dismiss after 8 seconds
        setTimeout(dismiss, 8000);

        sysLeft.after(hint);
    }

    /**
     * Render app indicators in the system banner
     * Adds after sys-left (left side, so breadcrumb stays anchored right)
     */
    private renderAppIndicators(): void {
        if (!this.bannerElement) return;

        const sysLeft = this.bannerElement.querySelector('.sys-left');
        if (!sysLeft) return;

        // Create apps container
        const appsContainer = document.createElement('div');
        appsContainer.className = 'sys-apps';
        appsContainer.innerHTML = `
            <span class="sys-apps-label">Apps:</span>
            ${this.APPS.map(app => this.renderAppIndicator(app)).join('')}
        `;

        // Insert after sys-left (keeps breadcrumb anchored on right)
        sysLeft.after(appsContainer);

        // Wire up click handlers and hover previews
        this.wireAppIndicators();
    }

    /**
     * Render a single app indicator
     */
    private renderAppIndicator(app: AppConfig): string {
        const status = app.getStatus();

        return `
            <button
                class="sys-app-indicator"
                data-app="${app.id}"
                data-status="${status}"
                data-shortcut="${app.shortcut}"
                title="${app.getPreview()}"
                aria-label="${app.label} - ${status.replace('-', ' ')}"
            >
                <span class="sys-app-dot"></span>
                <span class="sys-app-label">${app.label}</span>
            </button>
        `;
    }

    /**
     * Wire up click handlers and hover effects for app indicators
     */
    private wireAppIndicators(): void {
        const indicators = document.querySelectorAll('.sys-app-indicator');

        indicators.forEach(indicator => {
            const appId = (indicator as HTMLElement).dataset.app;
            const app = this.APPS.find(a => a.id === appId);
            if (!app) return;

            // Click navigation
            indicator.addEventListener('click', () => {
                this.handleAppClick(app);
            });

            // Hover preview - show card
            indicator.addEventListener('mouseenter', () => {
                this.showPreview(app, indicator as HTMLElement);
            });

            // Hide preview when leaving indicator
            indicator.addEventListener('mouseleave', () => {
                this.previewCard.hide();
            });
        });
    }

    /**
     * Handle app indicator click
     */
    private handleAppClick(app: AppConfig): void {
        const status = app.getStatus();

        if (status === 'not-loaded') {
            // Show loading state animation
            this.animateLoading(app.id);
        }

        // Navigate to app
        app.navigate();
    }

    /**
     * Show app preview card (desktop only)
     */
    private showPreview(app: AppConfig, anchorElement: HTMLElement): void {
        // Desktop only - skip on touch devices
        if ('ontouchstart' in window) return;

        const status = app.getStatus();

        // Map app ID to icon
        const iconMap: Record<string, string> = {
            'v1': '🎮',
            'v2': '⚡',
            'tg': '🐉',
            'showcase': '📖'
        };

        this.previewCard.show({
            appId: app.id,
            appName: app.label,
            appIcon: iconMap[app.id] || '📱',
            status,
            keyboardShortcut: app.shortcut
        }, anchorElement);
    }

    /**
     * Animate loading state transition
     * Red → Yellow (pulse) → Green with pulse
     */
    private animateLoading(appId: string): void {
        const indicator = document.querySelector(`.sys-app-indicator[data-app="${appId}"]`);
        if (!indicator) return;

        const dot = indicator.querySelector('.sys-app-dot');
        if (!dot) return;

        // Loading sequence: add loading class
        dot.classList.add('loading');

        setTimeout(() => {
            dot.classList.remove('loading');
            // Status update will apply active pulse automatically
        }, 1500);
    }

    /**
     * Get app loading status
     */
    private getAppStatus(appId: string): 'active' | 'background' | 'not-loaded' {
        const isInShell = window.self !== window.top;

        if (!isInShell) {
            // Standalone showcase mode
            return appId === 'showcase' ? 'active' : 'not-loaded';
        }

        // Shell mode - check parent hash
        try {
            const parentHash = window.parent.location.hash;
            const currentApp = parentHash.replace('#/', '').split('/')[0] || 'showcase';

            if (currentApp === appId) return 'active';

            // Check if app is loaded in background (iframe exists)
            const iframe = window.parent.document.querySelector(`iframe[data-app="${appId}"]`);
            return iframe ? 'background' : 'not-loaded';
        } catch {
            // Cross-origin restriction, assume not loaded
            return 'not-loaded';
        }
    }

    /**
     * Navigate to app (shell or standalone mode)
     */
    private navigateToApp(appId: string): void {
        const isInShell = window.self !== window.top;

        if (isInShell) {
            // Navigate parent shell
            window.parent.location.hash = `#/${appId}`;
        } else {
            // Standalone mode - show message
            if (appId === 'showcase') {
                // Already in showcase, scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert(`Launch ${appId.toUpperCase()} from the UV7 Shell! Visit the root index.html to access all apps.`);
            }
        }
    }

    /**
     * Wire keyboard shortcuts (Cmd/Ctrl + 1-4)
     */
    private wireKeyboardShortcuts(): void {
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + Number
            if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '4') {
                e.preventDefault();

                const shortcut = parseInt(e.key);
                const app = this.APPS.find(a => a.shortcut === shortcut);

                if (app) {
                    this.handleAppClick(app);
                }
            }
        });
    }

    /**
     * Start periodic status updates (every 2 seconds)
     */
    private startStatusUpdates(): void {
        this.updateInterval = window.setInterval(() => {
            this.updateAppStatuses();
        }, 2000);
    }

    /**
     * Update all app indicator statuses
     */
    private updateAppStatuses(): void {
        const indicators = document.querySelectorAll('.sys-app-indicator');

        indicators.forEach(indicator => {
            const appId = (indicator as HTMLElement).dataset.app;
            const app = this.APPS.find(a => a.id === appId);
            if (!app) return;

            const newStatus = app.getStatus();
            const currentStatus = (indicator as HTMLElement).dataset.status;

            if (newStatus !== currentStatus) {
                // Status changed, update data attribute (CSS handles visual change)
                (indicator as HTMLElement).dataset.status = newStatus;
            }
        });
    }

    /**
     * Cleanup on destroy
     */
    public destroy(): void {
        if (this.updateInterval !== null) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }

        this.previewCard.destroy();
    }
}
