// ========================================
// STATUS BAR MODES
// Theming (color tint, glass), screenshot mode, orientation
//
// Extracted from StatusBar.ts (lines 198-314, 1077-1161)
//
// 848 is sacred. 💚🔥💀
// ========================================

import type { EventBus } from '../../../core/EventBus';
import type { UV7Context, StatusBarFeatures, ColorTint } from '../StatusBarContext';
import { COLOR_TINTS } from '../StatusBarContext';
import { Logger } from '@utils/Logger';

/**
 * StatusBarModes
 *
 * Manages visual modes: adaptive color tinting, glassmorphism,
 * screenshot mode (hide all UI), and orientation handling.
 */
export class StatusBarModes {
    private currentTint: ColorTint;
    private isScreenshotMode: boolean = false;
    private orientationHandler: (() => void) | null = null;

    constructor(
        private container: HTMLElement,
        private eventBus: EventBus,
        private context: UV7Context,
        private features: StatusBarFeatures,
        initialTint: ColorTint
    ) {
        this.currentTint = initialTint;
    }

    // ========================================
    // COLOR TINT & GLASS
    // ========================================

    /**
     * Apply color tint to status bar (adaptive theming)
     */
    applyColorTint(tint: ColorTint): void {
        if (!this.container) return;

        this.container.style.setProperty('--status-accent', tint.primary);
        this.container.style.setProperty('--status-glow', tint.glow);
        this.container.style.background = tint.gradient;

        // Subtle transition for smoothness
        this.container.style.transition = 'background 0.5s ease, box-shadow 0.5s ease';
        this.container.style.boxShadow = `0 2px 20px ${tint.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`;

        this.currentTint = tint;
    }

    /**
     * Apply glassmorphism effect based on intensity
     */
    applyGlassEffect(intensity: 'subtle' | 'medium' | 'heavy'): void {
        if (!this.container) return;

        const blurValues = { subtle: '8px', medium: '12px', heavy: '20px' };
        const saturateValues = { subtle: '150%', medium: '180%', heavy: '200%' };

        this.container.style.backdropFilter = `blur(${blurValues[intensity]}) saturate(${saturateValues[intensity]})`;
        // Webkit prefix for Safari
        (this.container.style as any).webkitBackdropFilter = `blur(${blurValues[intensity]}) saturate(${saturateValues[intensity]})`;
    }

    /**
     * Update tint based on current route/context.
     * GAME MODE: CSS class-based theming handles route colors
     * SHOWCASE/LANDING: Inline tints via applyColorTint()
     */
    updateAdaptiveTint(): void {
        if (!this.features.enableAdaptiveTint) return;

        // In game context and showcase, let CSS handle theming
        if (this.context === 'game' || this.context === 'showcase') {
            this.clearInlineTint();
            return;
        }

        // Landing page: apply inline purple tint
        if (this.context === 'landing') {
            this.applyColorTint(COLOR_TINTS.landing);
        }
    }

    /**
     * Clear inline tint styles (let CSS classes handle theming)
     */
    clearInlineTint(): void {
        if (!this.container) return;

        this.container.style.removeProperty('--status-accent');
        this.container.style.removeProperty('--status-glow');
        this.container.style.removeProperty('background');
        this.container.style.removeProperty('box-shadow');
    }

    /**
     * Set paused state (visual indicator on route element)
     */
    setPaused(paused: boolean, routeEl: HTMLElement, restoreRoute: () => void): void {
        if (paused) {
            routeEl.textContent = 'PAUSED';
            routeEl.classList.add('paused-indicator');
            routeEl.style.color = '#ff3c3c';
            routeEl.style.textShadow = '0 0 10px rgba(255, 60, 60, 0.5)';
        } else {
            restoreRoute();
            routeEl.classList.remove('paused-indicator');
            routeEl.style.color = '';
            routeEl.style.textShadow = '';
        }
    }

    /**
     * Get current tint (for breadcrumb rendering)
     */
    getCurrentTint(): ColorTint {
        return this.currentTint;
    }

    // ========================================
    // SCREENSHOT MODE
    // ========================================

    /**
     * Toggle screenshot mode - hides all UI
     * V1 Parity: notification-shade-controller.js toggleScreenshotMode()
     */
    toggleScreenshotMode(): void {
        this.isScreenshotMode = !this.isScreenshotMode;

        if (this.isScreenshotMode) {
            document.body.classList.add('screenshot-mode');
            this.container.style.display = 'none';
            this.eventBus.emit('ui:hide_hud', {});
            Logger.ui('📸 Screenshot mode ON - All UI hidden');
        } else {
            document.body.classList.remove('screenshot-mode');
            if (this.container.classList.contains('visible')) {
                this.container.style.display = 'flex';
            }
            this.eventBus.emit('ui:show_status_bar', {});
            Logger.ui('📸 Screenshot mode OFF - UI restored');
        }
    }

    isInScreenshotMode(): boolean {
        return this.isScreenshotMode;
    }

    // ========================================
    // ORIENTATION HANDLER
    // ========================================

    /**
     * Set up orientation change handler.
     * V1 Parity: Closes sidebar when rotating to portrait.
     */
    setupOrientationHandler(): void {
        this.orientationHandler = () => {
            const isPortrait = window.matchMedia('(orientation: portrait)').matches;
            const isNarrow = window.innerWidth < 769;

            if (isPortrait || isNarrow) {
                this.eventBus.emit('ui:sidebar:close', {});
                Logger.ui('📱 Portrait mode detected - Sidebar closed');
            }

            this.container.classList.toggle('portrait', isPortrait);
            this.container.classList.toggle('landscape', !isPortrait);
        };

        window.addEventListener('orientationchange', this.orientationHandler);
        window.addEventListener('resize', this.orientationHandler);
        this.orientationHandler();
    }

    removeOrientationHandler(): void {
        if (this.orientationHandler) {
            window.removeEventListener('orientationchange', this.orientationHandler);
            window.removeEventListener('resize', this.orientationHandler);
            this.orientationHandler = null;
        }
    }
}
