// ========================================
// STATUS BAR DOM CREATION
// HTML template, element caching, placeholder factory
//
// Extracted from StatusBar.ts (lines 433-565)
//
// 848 is sacred. 💚🔥💀
// ========================================

import type { UV7Context, StatusBarFeatures } from '../StatusBarContext';

interface StatusBarConfig {
    loopVersion: string;
    totalNotes: { ronnie: number; tori: number };
}

/**
 * All cacheable DOM element references from the status bar.
 */
export interface StatusBarElementRefs {
    container: HTMLElement;
    loopEl: HTMLElement;
    routeEl: HTMLElement;
    actEl: HTMLElement;
    autoEl: HTMLElement;
    notesEl: HTMLElement;
    tetherEl: HTMLElement;
    tetherValueEl: HTMLElement;
    tetherFillEl: HTMLElement;
    mailEl: HTMLElement;
    unreadBadgeEl: HTMLElement;
    breadcrumbsEl: HTMLElement;
    phaseEl: HTMLElement;
    storyDevToggleEl: HTMLElement;
    settingsEl: HTMLElement;
}

/**
 * Create a placeholder element for feature-flagged missing elements.
 * Prevents null reference errors when elements are disabled.
 */
function createPlaceholder(): HTMLElement {
    const placeholder = document.createElement('span');
    placeholder.style.display = 'none';
    return placeholder;
}

/**
 * Create the status bar DOM structure and cache element references.
 * Phase 26: Feature-flag-based rendering for context-aware display.
 */
export function createStatusBarDOM(
    context: UV7Context,
    features: StatusBarFeatures,
    config: StatusBarConfig
): StatusBarElementRefs {
    const container = document.createElement('div');
    container.id = 'status-bar';
    container.className = 'uv7-status-bar';
    container.dataset.context = context;

    // Phase 26: Context-aware DOM structure
    container.innerHTML = `
        <!-- Left Section: Logo + Breadcrumbs + Story/Dev Toggle (all left-aligned) -->
        <div class="status-section status-left" style="justify-content: flex-start; gap: 12px;">
            <!-- UV7 OS Logo (App Switcher Trigger) -->
            ${features.enableAppSwitcher ? `
            <span id="uv7-logo-trigger" class="status-item uv7-logo-trigger" style="cursor: pointer;" title="UV7 OS - Tap to switch apps">
                <img src="/VN-Project/assets/UnitedVoices7.png" alt="UV7" style="height: 16px; width: auto; vertical-align: middle;">
            </span>
            ` : ''}
            ${features.showBreadcrumbs ? `
            <div id="status-breadcrumbs" class="status-item breadcrumbs" style="display: flex; align-items: center; gap: 4px; font-size: 11px;"></div>
            ` : ''}
            ${features.showStoryDevToggle ? `
            <button id="status-story-dev-toggle" class="status-item story-dev-toggle" style="
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                padding: 2px 8px;
                font-size: 10px;
                color: inherit;
                cursor: pointer;
                transition: all 0.2s ease;
            " title="Toggle Story/Dev Mode">
                📖 Story
            </button>
            ` : ''}
            ${features.showLoopVersion ? `
            <span id="status-loop" class="status-item">${config.loopVersion}</span>
            ` : ''}
            ${features.showRoute ? `
            <span id="status-route" class="status-item route-indicator">MENU</span>
            ` : ''}
            ${features.showPhaseIndicator ? `
            <span id="status-phase" class="status-item phase-indicator">Showcase</span>
            ` : ''}
        </div>

        <!-- Center Section: Act / Auto -->
        <div class="status-section status-center">
            <span id="status-act" class="status-item act-indicator" style="${features.showBreadcrumbs ? 'display: none;' : ''}"></span>
            <span id="status-auto" class="status-item auto-indicator" style="display: none;">AUTO ▶</span>
        </div>

        <!-- Right Section: Mail + Notes + Tether -->
        <div class="status-section status-right">
            ${features.showMail ? `
            <!-- DIZEE: Mail icon with unread badge (V1 parity) -->
            <span id="status-mail" class="status-item mail-indicator" title="Unread Notes" style="display: none;">
                <span class="mail-icon">✉️</span>
                <span class="unread-badge" style="display: none;">0</span>
            </span>
            ` : ''}
            ${features.showNotes ? `
            <span id="status-notes" class="status-item notes-indicator" title="Collected Notes">
                <span class="notes-icon">&#x1F4E7;</span>
                <span class="notes-count">0/0</span>
            </span>
            ` : ''}
            ${features.showTether ? `
            <div id="status-tether" class="status-item tether-indicator">
                <div class="tether-lightning">
                    <span class="tether-icon">&#x26A1;</span>
                    <div class="tether-fill"></div>
                </div>
                <span id="status-tether-value" class="tether-value">100%</span>
            </div>
            ` : ''}
            ${features.showSettings ? `
            <span id="status-settings" class="status-item settings-indicator" title="System Settings" style="cursor: pointer; font-size: 16px;">
                ⚙️
            </span>
            ` : ''}
        </div>
    `;

    // Cache element references (with null checks for feature-flagged elements)
    const refs: StatusBarElementRefs = {
        container,
        loopEl: container.querySelector('#status-loop') || createPlaceholder(),
        routeEl: container.querySelector('#status-route') || createPlaceholder(),
        actEl: container.querySelector('#status-act') || createPlaceholder(),
        autoEl: container.querySelector('#status-auto') || createPlaceholder(),
        notesEl: container.querySelector('#status-notes') || createPlaceholder(),
        tetherEl: container.querySelector('#status-tether') || createPlaceholder(),
        tetherValueEl: container.querySelector('#status-tether-value') || createPlaceholder(),
        tetherFillEl: container.querySelector('.tether-fill') || createPlaceholder(),
        mailEl: container.querySelector('#status-mail') || createPlaceholder(),
        unreadBadgeEl: container.querySelector('.unread-badge') || createPlaceholder(),
        breadcrumbsEl: container.querySelector('#status-breadcrumbs') || createPlaceholder(),
        phaseEl: container.querySelector('#status-phase') || createPlaceholder(),
        storyDevToggleEl: container.querySelector('#status-story-dev-toggle') || createPlaceholder(),
        settingsEl: container.querySelector('#status-settings') || createPlaceholder(),
    };

    // Prepend to body
    document.body.prepend(container);

    return refs;
}
