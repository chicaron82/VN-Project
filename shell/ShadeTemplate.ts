/**
 * ═══════════════════════════════════════════════════════════════
 * SHADE TEMPLATE - SINGLE SOURCE OF TRUTH
 *
 * Generates the notification shade HTML structure.
 * Used by both UV7Shell (shell mode) and showcase (standalone mode).
 *
 * ⚠️  When modifying shade structure, edit THIS file only.
 * ═══════════════════════════════════════════════════════════════
 */

import { generateQuickActionButtons } from './QuickActions.js';

interface ShadeOptions {
    isShell?: boolean;
}

/**
 * Generate the complete shade content HTML
 */
export function generateShadeContent(options: ShadeOptions = {}): string {
    const { isShell = true } = options;

    return `
        <!-- Theme Settings -->
        <div class="shade-section">
            <div class="shade-section-title">Visuals</div>
            <div class="shade-setting-row">
                <div>
                    <span class="setting-label">Sync with System</span>
                    <small class="setting-desc">Match device theme</small>
                </div>
                <div class="toggle-switch" id="${isShell ? 'shell' : 'showcase'}-theme-auto">
                    <div class="toggle-knob"></div>
                </div>
            </div>
            <div class="shade-setting-row" id="${isShell ? 'shell' : 'showcase'}-manual-theme-row">
                <span class="setting-label">Dark Mode</span>
                <div class="toggle-switch" id="${isShell ? 'shell' : 'showcase'}-theme-toggle">
                    <div class="toggle-knob"></div>
                </div>
            </div>
        </div>

        ${isShell ? generateQuickLaunchSection() : ''}

        <!-- Tori-Gatchi Settings -->
        <div class="shade-section">
            <div class="shade-section-title">Tori-Gatchi</div>
            <div id="uv7-tori-settings-container"></div>
        </div>

        <!-- AI Crew Settings -->
        <div class="shade-section">
            <div class="shade-section-title">AI Crew</div>
            <div id="uv7-echo-settings-container"></div>
        </div>

        ${generateSystemInfoSection(isShell)}

        ${generateCarrierBranding()}
    `;
}

/**
 * Generate Quick Launch section (shell only)
 */
function generateQuickLaunchSection(): string {
    return `
        <!-- Quick Launch -->
        <div class="shade-section">
            <div class="shade-section-title">Quick Launch</div>
            ${generateQuickActionButtons({ grid: true })}
        </div>
    `;
}

/**
 * Generate System Info section
 */
function generateSystemInfoSection(isShell: boolean): string {
    const title = isShell ? 'UV7 OS Shell' : 'UV7 Showcase';
    const subtitle = isShell
        ? 'Single-Page Architecture • Version 848'
        : 'Documentation Hub • Version 848';

    return `
        <!-- System Info -->
        <div class="shade-section">
            <div class="shade-section-title">System Info</div>
            <div class="current-phase">
                <div>${title}</div>
                <div style="font-size: 12px; opacity: 0.7;">${subtitle}</div>
            </div>
        </div>
    `;
}

/**
 * Generate Carrier Branding footer
 */
function generateCarrierBranding(): string {
    return `
        <!-- Carrier Branding -->
        <div class="shade-section" style="margin-top: auto; padding-top: 2rem;">
            <div class="uv7-carrier-branding" id="shade-carrier-brand">
                <div class="carrier-logo">UV7</div>
                <div class="carrier-text">United Voices 7</div>
            </div>
        </div>
    `;
}

/**
 * Generate complete shade structure (header + content)
 */
export function generateShadeStructure(options: ShadeOptions = {}): string {
    const { isShell = true } = options;
    const title = isShell ? '🏠 UV7 OS Home' : '📖 Showcase Settings';

    return `
        <div class="shade-header">
            <span class="shade-title">${title}</span>
            <button class="shade-close" aria-label="Close">✕</button>
        </div>
        <div class="shade-content">
            ${generateShadeContent(options)}
        </div>
    `;
}

export default {
    generateShadeContent,
    generateShadeStructure
};
