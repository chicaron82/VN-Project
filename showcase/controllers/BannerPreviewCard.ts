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

import { getAppState, formatTimestamp } from './AppStateReader';
import type { AppStateData } from './AppStateReader';

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
        const stateData = getAppState(config.appId);

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
     * Render card content
     */
    private renderCard(config: PreviewCardConfig, stateData: AppStateData): void {
        if (!this.cardElement) return;

        const { appName, appIcon, status, keyboardShortcut } = config;
        const { state, hasSave: _hasSave, lastPlayed, progress, isHangry } = stateData;

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
            lastPlayedText = `<div class="preview-timestamp">${formatTimestamp(lastPlayed)}</div>`;
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
        const _cardHeight = 200; // Approximate height
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
