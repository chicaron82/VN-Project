/**
 * ═══════════════════════════════════════════════════════════════
 * SHOWCASE APP - IFRAME WRAPPER
 *
 * Loads the current showcase documentation in an iframe.
 * The showcase has evolved way past this shell version, so we
 * iframe it like V1/V2 to ensure we're always showing the latest.
 * ═══════════════════════════════════════════════════════════════
 */

import { BaseApp, StatusBarConfig, SidebarConfig } from './BaseApp.js';
import type { UV7Shell } from '../UV7Shell.js';
import { generateShowcaseSidebarContent, initShowcaseSidebarListeners } from '../../showcase/ShowcaseSidebarTemplate.js';

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
            content: generateShowcaseSidebarContent(),
            init: () => {
                // Initialize shared sidebar listeners
                initShowcaseSidebarListeners();

                // Animate system stats (CHAOS METER & BOUGIE FACTOR)
                const animateStats = () => {
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

                console.log('[ShowcaseApp] Sidebar initialized with shared template');
            }
        };
    }

    async mount(container: HTMLElement, params: Record<string, any> = {}): Promise<void> {
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

        // Send initial theme to iframe when it loads
        const iframe = container.querySelector('#showcase-iframe') as HTMLIFrameElement;
        if (iframe) {
            iframe.addEventListener('load', () => {
                console.log('[ShowcaseApp] Iframe loaded, sending initial theme');
                const isAuto = localStorage.getItem('uv7-theme-auto') !== 'false';
                const theme = localStorage.getItem('uv7-theme') || 'dark';

                iframe.contentWindow?.postMessage({
                    type: 'theme-change',
                    auto: isAuto,
                    theme: theme
                }, '*');
            });
        }

        console.log('[ShowcaseApp] Mounted showcase in iframe');
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
