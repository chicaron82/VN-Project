/**
 * ═══════════════════════════════════════════════════════════════
 * SHOWCASE APP - IFRAME WRAPPER
 *
 * Loads the current showcase documentation in an iframe.
 * The showcase has evolved way past this shell version, so we
 * iframe it like V1/V2 to ensure we're always showing the latest.
 * ═══════════════════════════════════════════════════════════════
 */

import type { StatusBarConfig, SidebarConfig } from './BaseApp.js';
import { BaseApp } from './BaseApp.js';
import type { UV7Shell } from '../UV7Shell.js';
import { generateShowcaseSidebarInnerContent, initShowcaseSidebarListeners } from '../templates/ShowcaseSidebarTemplate.js';
import { ChromePresets } from '../../types/ChromePresets.js';
import type { StatusBarSpec } from '../../types/chrome.js';
import { Logger } from '@utils/Logger';

interface ExtendedStatusBarConfig extends StatusBarConfig {
    showBreadcrumb?: boolean;
    breadcrumbPath?: string[];
}

declare global {
    interface Window {
        showcaseAnimations?: number[];
    }
}

export class ShowcaseApp extends BaseApp {
    constructor(shell: UV7Shell) {
        super(shell);
        this.id = 'showcase';
    }

    getStatusBarConfig(): ExtendedStatusBarConfig {
        return {
            title: 'Showcase',
            context: 'Showcase',
            showBreadcrumb: true,
            breadcrumbPath: ['Showcase']
        };
    }

    getSidebarConfig(): SidebarConfig {
        return {
            title: '📖 SHOWCASE',
            content: generateShowcaseSidebarInnerContent(),
            init: () => {
                // Initialize shared sidebar listeners
                initShowcaseSidebarListeners();

                // Animate system stats (CHAOS METER & BOUGIE FACTOR)
                const animateStats = (): void => {
                    const cpuEl = document.getElementById('sys-cpu');
                    const cpuBar = document.getElementById('sys-cpu-bar') as HTMLElement;
                    const ramEl = document.getElementById('sys-ram');
                    const ramBar = document.getElementById('sys-ram-bar') as HTMLElement;

                    if (cpuEl && cpuBar && ramEl && ramBar) {
                        const cpu = Math.floor(Math.random() * 30) + 5; // 5-35%
                        const ram = 60 + Math.floor(Math.random() * 8); // 60-68%

                        cpuEl.textContent = `${cpu}%`;
                        cpuBar.style.width = `${cpu}%`;
                        ramEl.textContent = `${ram}%`;
                        ramBar.style.width = `${ram}%`;
                    }
                };

                // Initial animation
                animateStats();
                // Repeat every 2 seconds
                const animInterval = window.setInterval(animateStats, 2000);

                // Store interval ID for cleanup
                if (!window.showcaseAnimations) {
                    window.showcaseAnimations = [];
                }
                window.showcaseAnimations.push(animInterval);

                Logger.ui('[ShowcaseApp] Sidebar initialized with shared template');
            }
        };
    }

    async mount(container: HTMLElement, params: Record<string, string> = {}): Promise<void> {
        await super.mount(container, params);

        // Load current showcase in an iframe
        container.innerHTML = `
            <div class="showcase-app" style="width: 100%; height: 100vh; overflow: hidden; position: relative;">
                <iframe
                    src="./showcase/index.html"
                    style="width: 100%; height: 100%; border: none; display: block;"
                    title="UV7 Showcase"
                    id="showcase-iframe"
                ></iframe>
            </div>
        `;

        // ═══════════════════════════════════════════════════════════════
        // SYSTEM API TEST - Demonstrating Belle's controlled API pattern
        // ═══════════════════════════════════════════════════════════════
        if (this.api) {
            Logger.system('🎯 [ShowcaseApp] Testing SystemAPI...');

            // Test toast notifications
            setTimeout(() => this.api?.toast.success('Showcase loaded!'), 500);

            // Test temporary status message
            setTimeout(async () => {
                await this.api?.statusBar.setTemporaryMessage('Loading showcase content...', 2000);
            }, 1000);

            // ═══════════════════════════════════════════════════════════════
            // PHASE 2: Register action handlers for status bar actions
            // ═══════════════════════════════════════════════════════════════
            this.api.onAction('showcase:theme_toggle', () => {
                Logger.ui('🎨 [ShowcaseApp] Theme toggle action triggered!');
                this.api?.toast.show('Theme toggle coming soon!', { icon: '🎨' });
            });

            this.api.onAction('showcase:share', () => {
                Logger.ui('📤 [ShowcaseApp] Share action triggered!');
                this.api?.toast.success('Showcase link copied to clipboard!');
            });

            this.api.onAction('showcase:fullscreen', () => {
                Logger.ui('⛶ [ShowcaseApp] Fullscreen action triggered!');
                this.api?.chrome.cinematic.set(true);
                setTimeout(() => this.api?.chrome.cinematic.set(false), 3000);
                this.api?.toast.show('Cinematic mode demo (3s)', { icon: '⛶' });
            });
        }


        // Send initial theme to iframe when it loads
        const iframe = container.querySelector('#showcase-iframe') as HTMLIFrameElement;
        if (iframe) {
            iframe.addEventListener('load', () => {
                Logger.system('[ShowcaseApp] Iframe loaded, sending initial theme');
                const isAuto = localStorage.getItem('uv7-theme-auto') !== 'false';
                const theme = localStorage.getItem('uv7-theme') || 'dark';

                iframe.contentWindow?.postMessage({
                    type: 'theme-change',
                    auto: isAuto,
                    theme: theme
                }, '*');
            });
        }

        Logger.system('[ShowcaseApp] Mounted showcase in iframe');
    }

    /**
     * Get status bar spec with actions and theme (Phase 2 - using ChromePresets)
     */
    getStatusBarSpec(): StatusBarSpec {
        return ChromePresets.standard({
            title: 'Showcase',
            context: 'Interactive Demo',
            actions: [
                ChromePresets.action('showcase', 'theme_toggle', '🎨', 'Theme'),
                ChromePresets.action('showcase', 'share', '📤', 'Share'),
                ChromePresets.action('showcase', 'fullscreen', '⛶', 'Fullscreen')
            ],
            theme: {
                primaryColor: '#6366f1',
                accentColor: '#818cf8',
                fontFamily: 'Inter, sans-serif',
                transitionDuration: 350
            }
        });
    }

    async unmount(): Promise<void> {
        // Clean up animations
        if (window.showcaseAnimations) {
            window.showcaseAnimations.forEach(id => clearInterval(id));
            window.showcaseAnimations = [];
        }
        await super.unmount();
    }
}

export default ShowcaseApp;
