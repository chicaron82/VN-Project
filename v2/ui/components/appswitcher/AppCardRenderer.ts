// ═══════════════════════════════════════════════════════════════
// APP CARD RENDERER
// Card creation, grid rendering, activity detection
//
// Extracted from UV7AppSwitcher.ts (lines 831-1042)
// Ronnie's bougie card layout + DiZee's UX polish
// ═══════════════════════════════════════════════════════════════

import type { AppDefinition, AppStateData } from './AppCatalog';

export interface AppCardElements {
    recentSection: HTMLElement | null;
    recentGrid: HTMLElement | null;
    allGrid: HTMLElement | null;
}

export interface AppCardRendererCallbacks {
    getCurrentApp(): string;
    getRecentApps(): string[];
    launchApp(app: AppDefinition): void;
    confirmClearSave(app: AppDefinition, card: HTMLElement): void;
    clearAppSave(app: AppDefinition, card: HTMLElement): void;
    formatLastPlayed(date: Date): string;
}

/**
 * AppCardRenderer
 *
 * Renders the app switcher card grids, creates individual app cards
 * with state display, and handles per-card swipe-to-clear gestures.
 */
export class AppCardRenderer {
    constructor(
        private apps: AppDefinition[],
        private elements: AppCardElements,
        private callbacks: AppCardRendererCallbacks
    ) {}

    // ═══════════════════════════════════════════════════════════════
    // RENDERING - THE BOUGIE CARD LAYOUT
    // ═══════════════════════════════════════════════════════════════

    render(): void {
        const { recentSection, recentGrid, allGrid } = this.elements;
        if (!recentSection || !recentGrid || !allGrid) return;

        const recentApps = this.callbacks.getRecentApps();

        // Render recent apps
        if (recentApps.length > 0) {
            recentSection.style.display = 'block';
            recentGrid.innerHTML = '';
            recentApps.forEach(appId => {
                const app = this.apps.find(a => a.id === appId);
                if (app) {
                    const card = this.createAppCard(app, true);
                    recentGrid!.appendChild(card);
                }
            });
        } else {
            recentSection.style.display = 'none';
        }

        // Render all apps
        allGrid.innerHTML = '';
        this.apps.forEach(app => {
            const card = this.createAppCard(app, false);
            allGrid!.appendChild(card);
        });
    }

    private createAppCard(app: AppDefinition, isRecent: boolean): HTMLElement {
        // Phase 26d: Check if we should use v2.0 preview cards
        const usePreviewCards = typeof (window as any).UV7AppStateManager !== 'undefined';

        const card = document.createElement('div');
        const stateData = app.getState();
        const hasSave = stateData.hasSave;
        const isActive = app.id === this.callbacks.getCurrentApp();
        const isHangry = stateData.isHangry;

        // Phase 26c: Check if app is "alive" (has recent activity)
        const isAlive = this.isAppAlive(app, stateData);

        // Phase 26d: Get enhanced preview from AppStateManager if available
        let preview: { badge?: string; title?: string; subtitle?: string } | null = null;
        if (usePreviewCards && (window as any).UV7AppStateManager) {
            const savedState = (window as any).UV7AppStateManager.getAppState(app.id);
            if (savedState && savedState.preview) {
                preview = savedState.preview;
            }
        }

        // Phase 26d: Check for new content (notification badge)
        const newContentCount = this.getNewContentCount(app);

        card.className = `app-card ${isActive ? 'active' : ''} ${isHangry ? 'hangry' : ''} ${isAlive ? 'alive' : ''} ${preview ? 'has-preview' : ''}`;
        card.dataset.app = app.id;

        const lastPlayedStr = stateData.lastPlayed ? this.callbacks.formatLastPlayed(stateData.lastPlayed) : '';
        const progressBar = typeof stateData.progress === 'number' && hasSave ? `
            <div class="app-progress">
                <div class="app-progress-bar" style="width: ${stateData.progress}%"></div>
                <span class="app-progress-text">${stateData.progress}%</span>
            </div>
        ` : '';

        // Phase 26d: Enhanced card with preview metadata
        const previewBadge = preview?.badge || '';
        const previewTitle = preview?.title || '';
        const previewSubtitle = preview?.subtitle || '';

        // Phase 26d: Notification badge HTML
        const notificationBadge = newContentCount > 0 ? `
            <div class="app-notification-badge" title="${newContentCount} new item${newContentCount > 1 ? 's' : ''}">
                ${newContentCount > 9 ? '9+' : newContentCount}
            </div>
        ` : '';

        card.innerHTML = `
            ${notificationBadge}
            ${hasSave ? `<div class="quick-resume-badge">⚡ QUICK RESUME</div>` : ''}
            ${hasSave && app.saveKeys.length > 0 ? `
                <button class="app-card-close" aria-label="Clear save" title="Clear save data">✕</button>
            ` : ''}
            <div class="app-preview" style="background: linear-gradient(135deg, ${app.color}, transparent);">
                <div class="app-preview-icon">${app.icon}</div>
                ${preview ? `
                    <div class="app-preview-meta-overlay">
                        <span class="preview-badge">${previewBadge}</span>
                        <span class="preview-title">${previewTitle}</span>
                    </div>
                ` : ''}
            </div>
            <div class="app-info">
                <div class="app-name">
                    ${app.name}
                    ${isActive ? '<span class="app-badge active">Active</span>' : ''}
                    ${isRecent && !isActive ? '<span class="app-badge recent">Recent</span>' : ''}
                </div>
                <div class="app-description">${app.description}</div>
                <div class="app-state">
                    ${stateData.state.map(s => `<span class="app-state-item">${s}</span>`).join('')}
                    ${lastPlayedStr ? `<span class="app-state-item time ${lastPlayedStr === 'Just now' ? 'recent' : ''}">${lastPlayedStr}</span>` : ''}
                    ${previewSubtitle ? `<span class="app-state-item preview">${previewSubtitle}</span>` : ''}
                </div>
                ${progressBar}
            </div>
        `;

        // Card click to launch with instant resume
        card.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).classList.contains('app-card-close')) return;

            // Phase 26d: Set instant resume flag if we have saved state
            if (usePreviewCards && (window as any).UV7AppStateManager) {
                const savedState = (window as any).UV7AppStateManager.getAppState(app.id);
                if (savedState) {
                    localStorage.setItem('uv7-instant-resume', JSON.stringify({
                        appId: app.id,
                        state: savedState.state,
                        timestamp: Date.now()
                    }));
                }
            }

            this.callbacks.launchApp(app);
        });

        // Close button (desktop)
        const closeBtn = card.querySelector('.app-card-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.callbacks.confirmClearSave(app, card);
            });
        }

        // Swipe-to-clear (mobile)
        if (hasSave && app.saveKeys.length > 0) {
            this.attachSwipeToCloseHandler(card, app);
        }

        return card;
    }

    // ═══════════════════════════════════════════════════════════════
    // SWIPE-TO-CLEAR - ANDROID MULTITASKING GESTURES
    // ═══════════════════════════════════════════════════════════════

    private attachSwipeToCloseHandler(card: HTMLElement, app: AppDefinition): void {
        let touchStartY = 0;
        let isDragging = false;

        card.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) return;
            touchStartY = e.touches[0]!.clientY;
            isDragging = false;
        }, { passive: true });

        card.addEventListener('touchmove', (e) => {
            const currentY = e.touches[0]!.clientY;
            const deltaY = touchStartY - currentY; // Positive = swipe up

            if (deltaY > 10) {
                isDragging = true;
                card.classList.add('swiping');
                card.style.transform = `translateY(-${Math.min(200, deltaY)}px)`;
                card.style.opacity = Math.max(0.3, 1 - (deltaY / 200)).toString();
            }
        }, { passive: true });

        card.addEventListener('touchend', (e) => {
            if (!isDragging) return;

            const endY = e.changedTouches[0]!.clientY;
            const swipeDistance = touchStartY - endY;

            card.classList.remove('swiping');

            if (swipeDistance > 100 && app.saveKeys.length > 0) {
                this.callbacks.clearAppSave(app, card);
            } else {
                card.style.transform = '';
                card.style.opacity = '';
            }
        }, { passive: true });
    }

    // ═══════════════════════════════════════════════════════════════
    // PHASE 26d: NEW CONTENT DETECTION FOR NOTIFICATION BADGES
    // ═══════════════════════════════════════════════════════════════

    private getNewContentCount(app: AppDefinition): number {
        const lastVisitKey = `uv7_last_visited_${app.id}`;
        const lastVisit = localStorage.getItem(lastVisitKey);
        const lastVisitTime = lastVisit ? parseInt(lastVisit) : 0;

        if (!lastVisitTime) return 0;

        switch (app.id) {
            case 'showcase':
                if (typeof (window as any).TIMELINE_DATA !== 'undefined' && (window as any).TIMELINE_DATA?.entries) {
                    return (window as any).TIMELINE_DATA.entries.filter((entry: any) => {
                        const entryDate = new Date(entry.sortDate || entry.date).getTime();
                        return entryDate > lastVisitTime;
                    }).length;
                }
                return 0;

            case 'v1':
            case 'v2':
            case 'torigatchi':
            default:
                return 0;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // PHASE 26c: "ALIVE" APP DETECTION
    // Apps are "alive" if they have recent activity (within 30 minutes)
    // ═══════════════════════════════════════════════════════════════

    private isAppAlive(app: AppDefinition, stateData: AppStateData): boolean {
        // ToriGatchi is always "alive" if it has state
        if (app.id === 'torigatchi' && stateData.hasSave) {
            return true;
        }

        // Check for recent activity (within 30 minutes)
        if (stateData.lastPlayed) {
            const minutesSince = (Date.now() - stateData.lastPlayed.getTime()) / (1000 * 60);
            if (minutesSince < 30) return true;
        }

        // Check explicit "last played" timestamp
        const lastPlayedKey = `uv7_last_played_${app.id}`;
        const lastPlayed = localStorage.getItem(lastPlayedKey);
        if (lastPlayed) {
            const minutesSince = (Date.now() - parseInt(lastPlayed)) / (1000 * 60);
            if (minutesSince < 30) return true;
        }

        return false;
    }
}
