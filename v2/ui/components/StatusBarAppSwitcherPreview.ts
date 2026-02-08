/**
 * StatusBarAppSwitcherPreview - Mini-preview tooltip for UV7 App Switcher
 *
 * DIZEE: UV7 OS MINI-PREVIEW (Enhancement)
 * Shows quick app states on hover before opening full switcher
 *
 * Extracted from StatusBar.ts (~200 lines → dedicated module)
 */

interface AppState {
    name: string;
    icon: string;
    state: string;
    isActive: boolean;
}

export class StatusBarAppSwitcherPreview {
    private previewTooltip: HTMLElement | null = null;
    private previewTimeout: ReturnType<typeof setTimeout> | null = null;

    /**
     * Set up UV7 App Switcher with mini-preview
     */
    public async setup(logoTrigger: HTMLElement | null): Promise<void> {
        if (!logoTrigger) {
            console.warn('⚠️ UV7 logo trigger not found for App Switcher');
            return;
        }

        try {
            const { initializeAppSwitcher } = await import('./UV7AppSwitcher');
            const appSwitcher = await initializeAppSwitcher();

            // Wire up UV7 logo click
            logoTrigger.addEventListener('click', () => {
                appSwitcher.toggle();
            });

            // DIZEE: Mini-preview on hover (UV7 OS enhancement)
            this.setupPreviewTooltip(logoTrigger);

            console.log('🚀 UV7 App Switcher ready (V2)');
        } catch (error) {
            console.warn('⚠️ UV7 App Switcher failed to load:', error);
        }
    }

    /**
     * Set up mini-preview tooltip for UV7 logo hover
     * Shows current states of all apps before opening full switcher
     */
    private setupPreviewTooltip(logoTrigger: HTMLElement): void {
        // Create preview tooltip element
        this.previewTooltip = document.createElement('div');
        this.previewTooltip.className = 'uv7-app-preview-tooltip';
        this.previewTooltip.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            margin-top: 8px;
            background: linear-gradient(145deg, rgba(26, 26, 46, 0.98), rgba(15, 15, 26, 0.98));
            border: 1px solid rgba(0, 255, 255, 0.3);
            border-radius: 12px;
            padding: 12px 16px;
            min-width: 200px;
            max-width: 280px;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-8px);
            transition: all 0.2s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            font-family: 'Courier New', monospace;
            pointer-events: none;
        `;

        // Insert after logo trigger
        logoTrigger.style.position = 'relative';
        logoTrigger.appendChild(this.previewTooltip);

        // Hover events (desktop only)
        logoTrigger.addEventListener('mouseenter', () => this.showPreview());
        logoTrigger.addEventListener('mouseleave', () => this.hidePreview());
    }

    /**
     * Show the mini-preview tooltip with current app states
     */
    private showPreview(): void {
        if (!this.previewTooltip) return;

        // Delay before showing (avoid flicker on quick hovers)
        this.previewTimeout = setTimeout(() => {
            // Build preview content with live state
            const apps = this.getAppStates();
            let content = `
                <div style="font-size: 10px; color: rgba(0, 255, 255, 0.7); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">
                    UV7 OS • Tap to switch
                </div>
            `;

            apps.forEach(app => {
                const isActive = app.isActive;
                content += `
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 6px 0;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                        ${isActive ? 'color: #00ffff;' : 'color: rgba(255, 255, 255, 0.7);'}
                    ">
                        <span style="font-size: 14px;">${app.icon}</span>
                        <div style="flex: 1;">
                            <div style="font-size: 11px; font-weight: bold;">
                                ${app.name}
                                ${isActive ? '<span style="font-size: 9px; background: rgba(0, 255, 255, 0.2); padding: 1px 4px; border-radius: 3px; margin-left: 4px;">ACTIVE</span>' : ''}
                            </div>
                            <div style="font-size: 10px; opacity: 0.7;">${app.state}</div>
                        </div>
                    </div>
                `;
            });

            if (this.previewTooltip) {
                this.previewTooltip.innerHTML = content;
                this.previewTooltip.style.opacity = '1';
                this.previewTooltip.style.visibility = 'visible';
                this.previewTooltip.style.transform = 'translateY(0)';
            }
        }, 300); // 300ms delay before showing
    }

    /**
     * Hide the mini-preview tooltip
     */
    private hidePreview(): void {
        if (this.previewTimeout) {
            clearTimeout(this.previewTimeout);
            this.previewTimeout = null;
        }

        if (this.previewTooltip) {
            this.previewTooltip.style.opacity = '0';
            this.previewTooltip.style.visibility = 'hidden';
            this.previewTooltip.style.transform = 'translateY(-8px)';
        }
    }

    /**
     * Get current states of all UV7 apps for preview
     * DIZEE: Pull live data from localStorage/sessionStorage
     */
    private getAppStates(): AppState[] {
        const currentPath = window.location.pathname;
        const detectCurrentApp = () => {
            if (currentPath.includes('showcase')) return 'showcase';
            if (currentPath.includes('v1')) return 'v1';
            if (currentPath.includes('v2') || currentPath.includes('index.v2')) return 'v2';
            return 'showcase';
        };
        const activeApp = detectCurrentApp();

        return [
            {
                name: 'Showcase',
                icon: '📖',
                state: (() => {
                    const phase = sessionStorage.getItem('uv7-showcase-phase') || 'phase-1';
                    const phaseNum = phase.replace('phase-', '');
                    return `Phase ${phaseNum}`;
                })(),
                isActive: activeApp === 'showcase'
            },
            {
                name: 'V1 Game',
                icon: '🎮',
                state: (() => {
                    const route = localStorage.getItem('uv7_current_route') || 'Menu';
                    return route.charAt(0).toUpperCase() + route.slice(1);
                })(),
                isActive: activeApp === 'v1'
            },
            {
                name: 'V2 Engine',
                icon: '⚡',
                state: (() => {
                    const stateJson = localStorage.getItem('uv7_game_state');
                    if (stateJson) {
                        try {
                            const state = JSON.parse(stateJson);
                            const route = state?.game?.currentRoute || 'Menu';
                            const tether = state?.tether?.level;
                            if (route === 'tori' && typeof tether === 'number') {
                                return `${route.charAt(0).toUpperCase() + route.slice(1)} ⚡${Math.round(tether)}%`;
                            }
                            return route.charAt(0).toUpperCase() + route.slice(1);
                        } catch (_e) {
                            // Fallback if parse fails
                        }
                    }
                    return 'V2 Beta';
                })(),
                isActive: activeApp === 'v2'
            }
        ];
    }

    /**
     * Clean up preview resources
     */
    public cleanup(): void {
        if (this.previewTimeout) {
            clearTimeout(this.previewTimeout);
            this.previewTimeout = null;
        }
        if (this.previewTooltip) {
            this.previewTooltip.remove();
            this.previewTooltip = null;
        }
    }
}
