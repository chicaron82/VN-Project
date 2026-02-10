/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 OS - APP SWITCHER (BOUGIE EDITION) 💎
 * iOS/Android-style app switcher with instant resume
 *
 * Contributors:
 * - Ronnie (Vision: "Make it bougie" + Cross-app resume concept)
 * - ZeeRah (Architecture: State restoration pattern + Android gestures)
 * - DiZee (Enhancement: Live state + mini preview)
 * - DiZee (Polish: Premium UX + swipe-to-clear)
 * ═══════════════════════════════════════════════════════════════
 */

// Existing extracted subsystems
import { AppSwitcherState } from './appswitcher/AppSwitcherState';
import { BackgroundMonitor } from './appswitcher/BackgroundMonitor';

// New extracted subsystems
import { injectAppSwitcherStyles } from './appswitcher/AppSwitcherStyles';
import { AppCatalog } from './appswitcher/AppCatalog';
import { AppSwitcherSaveManager } from './appswitcher/AppSwitcherSaveManager';
import { AppCardRenderer } from './appswitcher/AppCardRenderer';
import type { AppDefinition } from './appswitcher/AppCatalog';
import { Logger } from '@utils/Logger';

// Type shim for global window and document objects
declare global {
    interface Window {
        uv7Shell?: boolean;
        UV7AppSwitcher?: typeof UV7AppSwitcher;
        uv7AppSwitcher?: UV7AppSwitcher;
    }
}

// ═══════════════════════════════════════════════════════════════
// LOCAL TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════

interface AppSwitcherElements {
    switcher: HTMLElement | null;
    close: HTMLElement | null;
    clearAll: HTMLElement | null;
    recentSection: HTMLElement | null;
    recentGrid: HTMLElement | null;
    allGrid: HTMLElement | null;
    undoToast: HTMLElement | null;
    undoMessage: HTMLElement | null;
    undoBtn: HTMLElement | null;
}

// ═══════════════════════════════════════════════════════════════
// UV7 APP SWITCHER CLASS
// ═══════════════════════════════════════════════════════════════

export class UV7AppSwitcher {
    private apps: AppDefinition[];
    private state: AppSwitcherState;
    private backgroundMonitor: BackgroundMonitor;
    private currentApp: string;
    private elements: AppSwitcherElements;

    // New extracted subsystems
    private catalog: AppCatalog;
    private saveManager!: AppSwitcherSaveManager;
    private cardRenderer!: AppCardRenderer;

    constructor() {
        this.catalog = new AppCatalog();
        this.apps = this.catalog.createApps();
        this.state = new AppSwitcherState();
        this.currentApp = this.state.detectCurrentApp();
        this.elements = {} as AppSwitcherElements;

        this.backgroundMonitor = new BackgroundMonitor(
            this.apps,
            () => this.currentApp,
            (app) => this.launchApp(app)
        );

        this.init();
    }

    private get recentApps(): string[] {
        return this.state.getRecentApps();
    }

    private init(): void {
        this.injectHTML();
        injectAppSwitcherStyles();
        this.cacheElements();

        // Initialize save manager
        this.saveManager = new AppSwitcherSaveManager(
            {
                undoToast: this.elements.undoToast,
                undoMessage: this.elements.undoMessage,
                undoBtn: this.elements.undoBtn,
            },
            this.apps,
            this.state,
            {
                addToRecent: (id) => this.addToRecent(id),
                onAfterClear: () => this.cardRenderer.render(),
            }
        );

        // Initialize card renderer
        this.cardRenderer = new AppCardRenderer(
            this.apps,
            {
                recentSection: this.elements.recentSection,
                recentGrid: this.elements.recentGrid,
                allGrid: this.elements.allGrid,
            },
            {
                getCurrentApp: () => this.currentApp,
                getRecentApps: () => this.recentApps,
                launchApp: (app) => this.launchApp(app),
                confirmClearSave: (app, card) => this.saveManager.confirmClearSave(app, card),
                clearAppSave: (app, card) => this.saveManager.clearAppSave(app, card),
                formatLastPlayed: (date) => this.catalog.formatLastPlayed(date),
            }
        );

        this.attachHandlers();
        this.cardRenderer.render();

        // Phase 26c: Start background monitoring (extracted to BackgroundMonitor.ts)
        this.backgroundMonitor.start();

        Logger.ui('🚀 UV7 App Switcher (BOUGIE EDITION) initialized');
    }

    // ═══════════════════════════════════════════════════════════════
    // HTML INJECTION
    // ═══════════════════════════════════════════════════════════════

    private injectHTML(): void {
        const html = `
            <div id="uv7-app-switcher" class="uv7-app-switcher">
                <div class="app-switcher-header">
                    <span class="app-switcher-title">UV7 OS - App Switcher</span>
                    <div class="app-switcher-header-actions">
                        <button class="clear-all-btn" id="clear-all-saves" title="Clear all saves">🗑️</button>
                        <button class="app-switcher-close" aria-label="Close">✕</button>
                    </div>
                </div>
                <div class="app-switcher-content">
                    <div class="app-switcher-section" id="recent-apps-section" style="display: none;">
                        <div class="app-switcher-section-title">Recently Visited</div>
                        <div class="app-cards-grid" id="recent-apps-grid"></div>
                    </div>
                    <div class="app-switcher-section">
                        <div class="app-switcher-section-title">All Apps</div>
                        <div class="app-cards-grid" id="all-apps-grid"></div>
                    </div>
                    <div class="app-switcher-hint">
                        <span class="hint-desktop">Tap any app to launch • Hover for options</span>
                        <span class="hint-mobile">Tap to launch • Swipe up on card to clear save</span>
                    </div>
                </div>
            </div>
            <div id="uv7-undo-toast" class="uv7-toast">
                <span class="uv7-toast-message"></span>
                <button class="uv7-toast-undo">UNDO</button>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    }

    private cacheElements(): void {
        this.elements = {
            switcher: document.getElementById('uv7-app-switcher'),
            close: document.querySelector('.app-switcher-close'),
            clearAll: document.getElementById('clear-all-saves'),
            recentSection: document.getElementById('recent-apps-section'),
            recentGrid: document.getElementById('recent-apps-grid'),
            allGrid: document.getElementById('all-apps-grid'),
            undoToast: document.getElementById('uv7-undo-toast'),
            undoMessage: document.querySelector('.uv7-toast-message'),
            undoBtn: document.querySelector('.uv7-toast-undo')
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════

    private attachHandlers(): void {
        if (this.elements.close) {
            this.elements.close.addEventListener('click', () => this.close());
        }
        if (this.elements.clearAll) {
            this.elements.clearAll.addEventListener('click', () => this.saveManager.confirmClearAll());
        }
        if (this.elements.undoBtn) {
            this.elements.undoBtn.addEventListener('click', () => this.saveManager.undoClear());
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });

        if (this.elements.switcher) {
            this.elements.switcher.addEventListener('click', (e) => {
                if (e.target === this.elements.switcher) {
                    this.close();
                }
            });
        }

        this.attachSwipeHandler();
    }

    private attachSwipeHandler(): void {
        if (!this.elements.switcher) return;

        let touchStartY = 0;
        let touchEndY = 0;

        this.elements.switcher.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0]!.clientY;
        }, { passive: true });

        this.elements.switcher.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0]!.clientY;
            const swipeDistance = touchEndY - touchStartY;
            if (swipeDistance > 100) {
                this.close();
            }
        }, { passive: true });
    }

    // ═══════════════════════════════════════════════════════════════
    // STATE MANAGEMENT (Delegated to AppSwitcherState)
    // ═══════════════════════════════════════════════════════════════

    private addToRecent(appId: string): void {
        this.state.addToRecent(appId);
    }

    private setResumeFlag(appId: string): void {
        this.state.setResumeFlag(appId);
    }

    // ═══════════════════════════════════════════════════════════════
    // LAUNCHING APPS - INSTANT RESUME
    // ═══════════════════════════════════════════════════════════════

    private launchApp(app: AppDefinition): void {
        if (app.id === this.currentApp) {
            this.close();
            return;
        }

        const stateData = app.getState();
        if (stateData.hasSave) {
            this.setResumeFlag(app.id);
        }

        localStorage.setItem(`uv7_last_played_${this.currentApp}`, Date.now().toString());
        this.addToRecent(app.id);
        this.currentApp = app.id;
        this.backgroundMonitor.setCurrentApp(app.id);

        this.navigateWithTransition(app.url);
    }

    private navigateWithTransition(url: string): void {
        this.close();

        setTimeout(() => {
            const isShellMode = !!window.uv7Shell;

            if (isShellMode && url.startsWith('#')) {
                window.location.hash = url;
            } else {
                const transitionedDoc = (document as unknown as { startViewTransition?: (cb: () => void) => void });
                if (!transitionedDoc.startViewTransition) {
                    window.location.href = url;
                    return;
                }

                transitionedDoc.startViewTransition(() => {
                    window.location.href = url;
                });
            }
        }, 150);
    }

    // ═══════════════════════════════════════════════════════════════
    // OPEN / CLOSE
    // ═══════════════════════════════════════════════════════════════

    public open(): void {
        if (!this.elements.switcher) return;
        this.elements.switcher.classList.add('open');
        this.cardRenderer.render();
    }

    public close(): void {
        if (!this.elements.switcher) return;
        this.elements.switcher.classList.remove('open');
    }

    public toggle(): void {
        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    }

    public isOpen(): boolean {
        return this.elements.switcher ? this.elements.switcher.classList.contains('open') : false;
    }
}

// Export for use in UV7 OS (maintaining global compatibility for now)
if (typeof window !== 'undefined') {
    window.UV7AppSwitcher = UV7AppSwitcher;
}

// ═══════════════════════════════════════════════════════════════
// ASYNC INITIALIZATION FUNCTION (For backwards compatibility)
// ═══════════════════════════════════════════════════════════════

/**
 * Initialize the app switcher asynchronously
 * Returns the singleton instance for the current page
 */
export async function initializeAppSwitcher(): Promise<UV7AppSwitcher> {
    if (window.uv7AppSwitcher) {
        return window.uv7AppSwitcher;
    }

    const appSwitcher = new UV7AppSwitcher();
    window.uv7AppSwitcher = appSwitcher;

    return appSwitcher;
}
