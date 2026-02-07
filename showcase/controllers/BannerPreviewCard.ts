/**
 * BannerPreviewCard
 *
 * Bougie hover preview cards for the system banner app indicators.
 * Shows app state, progress, last played, and more - just like the
 * original UV7AppSwitcher but in a compact banner format.
 *
 * Ported from UV7AppSwitcher's getState() logic with enhancements.
 *
 * 💚🔥💀
 */

interface AppStateData {
    state: string[];
    hasSave: boolean;
    lastPlayed?: Date | null;
    progress?: number;
    mood?: string;
    isHangry?: boolean;
}

interface PreviewCardConfig {
    appId: string;
    appName: string;
    appIcon: string;
    status: 'active' | 'background' | 'not-loaded';
    keyboardShortcut: number;
}

export class BannerPreviewCard {
    private cardElement: HTMLElement | null = null;
    private currentAppId: string | null = null;
    private hideTimeout: number | null = null;

    constructor() {
        this.createCardElement();
    }

    /**
     * Create the preview card element (hidden by default)
     */
    private createCardElement(): void {
        const card = document.createElement('div');
        card.className = 'banner-preview-card';
        card.style.display = 'none';
        document.body.appendChild(card);
        this.cardElement = card;
    }

    /**
     * Show preview card for an app
     */
    public show(config: PreviewCardConfig, anchorElement: HTMLElement): void {
        if (!this.cardElement) return;

        // Clear any pending hide timeout
        if (this.hideTimeout !== null) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }

        this.currentAppId = config.appId;

        // Get app state from localStorage
        const stateData = this.getAppState(config.appId);

        // Render card content
        this.renderCard(config, stateData);

        // Position card below anchor element
        this.positionCard(anchorElement);

        // Show with fade-in
        this.cardElement.style.display = 'block';
        // Force reflow for transition
        this.cardElement.offsetHeight;
        this.cardElement.classList.add('visible');
    }

    /**
     * Hide preview card
     */
    public hide(immediate: boolean = false): void {
        if (!this.cardElement) return;

        if (immediate) {
            this.cardElement.classList.remove('visible');
            this.cardElement.style.display = 'none';
            this.currentAppId = null;
        } else {
            // Delay hide to allow moving between indicators
            this.hideTimeout = window.setTimeout(() => {
                if (this.cardElement) {
                    this.cardElement.classList.remove('visible');
                    setTimeout(() => {
                        if (this.cardElement) {
                            this.cardElement.style.display = 'none';
                        }
                    }, 200); // Match CSS transition duration
                }
                this.currentAppId = null;
            }, 100);
        }
    }

    /**
     * Get app state from localStorage (ported from UV7AppSwitcher)
     */
    private getAppState(appId: string): AppStateData {
        switch (appId) {
            case 'v1':
                return this.getV1State();
            case 'v2':
                return this.getV2State();
            case 'showcase':
                return this.getShowcaseState();
            case 'tg':
                return this.getTorigatchiState();
            default:
                return { state: ['Unknown App'], hasSave: false };
        }
    }

    /**
     * Get V1 app state from localStorage
     */
    private getV1State(): AppStateData {
        const loopVersion = localStorage.getItem('uv7_loop_version') || '848';
        const route = localStorage.getItem('uv7_current_route') || '';
        const act = localStorage.getItem('uv7_current_act');
        const lastPlayed = localStorage.getItem('uv7_last_played_v1');

        if (!route || route === 'menu' || route === '') {
            return {
                state: [`Loop ${loopVersion}`, 'Main Menu'],
                hasSave: false
            };
        }

        const routeDisplay = route.charAt(0).toUpperCase() + route.slice(1);
        const actDisplay = act ? `Act ${act}` : '';

        return {
            state: [routeDisplay, actDisplay || `Loop ${loopVersion}`],
            hasSave: true,
            lastPlayed: lastPlayed ? new Date(parseInt(lastPlayed)) : null,
            progress: this.calculateV1Progress(route, act)
        };
    }

    /**
     * Calculate V1 progress percentage
     */
    private calculateV1Progress(route: string, act: string | null): number {
        if (!route || route === 'menu') return 0;

        // Rough estimate: 3 acts per route
        const actNum = act ? parseInt(act) : 1;
        return Math.min(100, Math.round((actNum / 3) * 100));
    }

    /**
     * Get V2 app state from localStorage
     */
    private getV2State(): AppStateData {
        const stateJson = localStorage.getItem('uv7_game_state');
        const lastPlayed = localStorage.getItem('uv7_last_played_v2');

        if (stateJson) {
            try {
                const state = JSON.parse(stateJson);
                const route = state?.game?.currentRoute || 'menu';
                const act = state?.game?.currentAct;
                const tether = state?.tether?.level;

                if (route && route !== 'menu') {
                    const routeDisplay = route.charAt(0).toUpperCase() + route.slice(1);
                    return {
                        state: [
                            routeDisplay,
                            act ? `Act ${act}` : (typeof tether === 'number' ? `⚡${Math.round(tether)}%` : 'V2 Beta')
                        ],
                        hasSave: true,
                        lastPlayed: lastPlayed ? new Date(parseInt(lastPlayed)) : null,
                        progress: this.calculateV2Progress(state)
                    };
                }
            } catch (e) {
                console.warn('Failed to parse V2 state:', e);
            }
        }

        const testCount = localStorage.getItem('uv7_test_count') || '435';
        return {
            state: ['V2 Beta', `${testCount} tests`],
            hasSave: false
        };
    }

    /**
     * Calculate V2 progress percentage
     */
    private calculateV2Progress(state: any): number {
        const tether = state?.tether?.level;
        if (typeof tether === 'number') {
            return Math.round(tether);
        }
        return 0;
    }

    /**
     * Get Showcase app state from localStorage
     */
    private getShowcaseState(): AppStateData {
        const phase = sessionStorage.getItem('uv7-showcase-phase') || 'phase-1';
        const phaseNum = phase.replace('phase-', '');
        const codes = JSON.parse(localStorage.getItem('uv7_discovered_codes') || '[]');
        const codeCount = codes.length;
        const lastVisit = localStorage.getItem('uv7-showcase-last-visit');

        return {
            state: [`Phase ${phaseNum}`, codeCount > 0 ? `${codeCount} codes` : 'Exploring'],
            hasSave: codeCount > 0,
            lastPlayed: lastVisit ? new Date(parseInt(lastVisit)) : null,
            progress: Math.min(100, Math.round((parseInt(phaseNum) / 15) * 100))
        };
    }

    /**
     * Get Torigatchi app state from localStorage
     */
    private getTorigatchiState(): AppStateData {
        const state = localStorage.getItem('torigatchi-state');
        if (!state) {
            return {
                state: ['Not Started', 'Ready to Play'],
                hasSave: false
            };
        }

        try {
            const data = JSON.parse(state);
            const lastFed = new Date(data.lastFed);
            const now = new Date();
            const hoursSince = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);

            // Calculate mood
            let mood: string, moodEmoji: string, isHangry = false;
            if (hoursSince > 24) {
                mood = 'BEYOND HANGRY';
                moodEmoji = '💀';
                isHangry = true;
            } else if (hoursSince > 8) {
                mood = 'HANGRY';
                moodEmoji = '😡';
                isHangry = true;
            } else if (hoursSince > 5) {
                mood = 'Hungry';
                moodEmoji = '😤';
            } else if (hoursSince > 3) {
                mood = 'Content';
                moodEmoji = '😊';
            } else {
                mood = 'Happy';
                moodEmoji = '😄';
            }

            return {
                state: [`${moodEmoji} ${mood}`, `${Math.round(hoursSince)}h ago`],
                hasSave: true,
                lastPlayed: lastFed,
                mood: `${moodEmoji} ${mood}`,
                isHangry
            };
        } catch (e) {
            console.warn('Failed to parse Torigatchi state:', e);
            return {
                state: ['Error', 'Invalid State'],
                hasSave: false
            };
        }
    }

    /**
     * Render card content
     */
    private renderCard(config: PreviewCardConfig, stateData: AppStateData): void {
        if (!this.cardElement) return;

        const { appName, appIcon, status, keyboardShortcut } = config;
        const { state, hasSave, lastPlayed, progress, isHangry } = stateData;

        // Status badge
        let statusBadge = '';
        if (status === 'active') {
            statusBadge = '<span class="preview-badge preview-badge-active">ACTIVE</span>';
        } else if (status === 'background') {
            statusBadge = '<span class="preview-badge preview-badge-background">BACKGROUND</span>';
        } else {
            statusBadge = '<span class="preview-badge preview-badge-not-loaded">NOT LOADED</span>';
        }

        // Progress bar (only if app is loaded and has progress)
        let progressBar = '';
        if (status !== 'not-loaded' && typeof progress === 'number') {
            const filled = Math.round(progress / 10);
            const empty = 10 - filled;
            progressBar = `
                <div class="preview-progress">
                    <div class="preview-progress-bar">
                        ${'▓'.repeat(filled)}${'░'.repeat(empty)}
                    </div>
                    <div class="preview-progress-text">${progress}%</div>
                </div>
            `;
        }

        // Last played timestamp
        let lastPlayedText = '';
        if (lastPlayed && status !== 'not-loaded') {
            lastPlayedText = `<div class="preview-timestamp">${this.formatTimestamp(lastPlayed)}</div>`;
        }

        // Hangry indicator (Torigatchi special)
        let hangryIndicator = '';
        if (isHangry) {
            hangryIndicator = '<div class="preview-hangry">⚠️ FEED ME!</div>';
        }

        // Not loaded message
        let notLoadedMessage = '';
        if (status === 'not-loaded') {
            notLoadedMessage = '<div class="preview-not-loaded">Click to load</div>';
        }

        // Keyboard shortcut hint
        const keyboardHint = `<div class="preview-keyboard">Cmd/Ctrl + ${keyboardShortcut}</div>`;

        this.cardElement.innerHTML = `
            <div class="preview-header">
                <div class="preview-icon">${appIcon}</div>
                <div class="preview-title">${appName}</div>
                ${statusBadge}
            </div>
            ${hangryIndicator}
            <div class="preview-state">
                <div class="preview-state-primary">${state[0]}</div>
                <div class="preview-state-secondary">${state[1] || ''}</div>
            </div>
            ${progressBar}
            ${lastPlayedText}
            ${notLoadedMessage}
            ${keyboardHint}
        `;
    }

    /**
     * Position card below anchor element with edge detection
     */
    private positionCard(anchorElement: HTMLElement): void {
        if (!this.cardElement) return;

        const anchorRect = anchorElement.getBoundingClientRect();
        const cardWidth = 240; // Fixed width from CSS
        const cardHeight = 200; // Approximate height
        const gap = 8; // Gap between anchor and card

        // Calculate position below anchor
        let left = anchorRect.left + (anchorRect.width / 2) - (cardWidth / 2);
        const top = anchorRect.bottom + gap;

        // Edge detection - prevent overflow right
        const viewportWidth = window.innerWidth;
        if (left + cardWidth > viewportWidth - 16) {
            left = viewportWidth - cardWidth - 16;
        }

        // Edge detection - prevent overflow left
        if (left < 16) {
            left = 16;
        }

        this.cardElement.style.left = `${left}px`;
        this.cardElement.style.top = `${top}px`;
    }

    /**
     * Format timestamp as "X ago"
     */
    private formatTimestamp(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    }

    /**
     * Cleanup on destroy
     */
    public destroy(): void {
        if (this.hideTimeout !== null) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }

        if (this.cardElement) {
            this.cardElement.remove();
            this.cardElement = null;
        }
    }
}
