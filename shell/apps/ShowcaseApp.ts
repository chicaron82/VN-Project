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
            content: `
                <!-- Quick Actions -->
                <div class="sidebar-section">
                    <div class="sidebar-section-title">Quick Actions</div>
                    <div class="quick-actions-grid">
                        <button class="quick-action" data-action="launch-v1">
                            <span class="quick-action-icon">🎮</span>
                            <span class="quick-action-label">V1 Game</span>
                        </button>
                        <button class="quick-action" data-action="launch-v2">
                            <span class="quick-action-icon">⚡</span>
                            <span class="quick-action-label">V2 Engine</span>
                        </button>
                        <button class="quick-action" data-action="go-home">
                            <span class="quick-action-icon">🏠</span>
                            <span class="quick-action-label">Landing</span>
                        </button>
                        <button class="quick-action" data-action="toggle-mode">
                            <span class="quick-action-icon">📖</span>
                            <span class="quick-action-label">Story/Dev</span>
                        </button>
                    </div>
                </div>

                <!-- System Stats Widget -->
                <div class="sidebar-section">
                    <div class="system-stats-widget">
                        <div class="stat-row">
                            <div class="stat-info">
                                <span class="stat-label">CHAOS METER</span>
                                <span class="stat-value" id="sys-cpu">12%</span>
                            </div>
                            <div class="stat-bar-track">
                                <div class="stat-bar-fill" id="sys-cpu-bar" style="width: 12%"></div>
                            </div>
                        </div>
                        <div class="stat-row">
                            <div class="stat-info">
                                <span class="stat-label">BOUGIE FACTOR</span>
                                <span class="stat-value" id="sys-ram">64%</span>
                            </div>
                            <div class="stat-bar-track">
                                <div class="stat-bar-fill" id="sys-ram-bar" style="width: 64%"></div>
                            </div>
                        </div>
                        <div class="stat-row">
                            <div class="stat-info">
                                <span class="stat-label">V2 ENGINE</span>
                                <span class="stat-value status-online">ONLINE</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section Navigation -->
                <div class="sidebar-section">
                    <div class="sidebar-section-title">🧭 Navigate</div>
                    <div class="section-nav-list">
                        <button class="section-nav-item" data-showcase-nav="journey">
                            <span class="section-icon">🗺️</span>
                            <span class="section-label">The Journey</span>
                        </button>
                        <button class="section-nav-item" data-showcase-nav="workflow">
                            <span class="section-icon">⚙️</span>
                            <span class="section-label">Workflow</span>
                        </button>
                        <button class="section-nav-item" data-showcase-nav="results">
                            <span class="section-icon">📊</span>
                            <span class="section-label">The Results</span>
                        </button>
                        <button class="section-nav-item" data-showcase-nav="spotlight">
                            <span class="section-icon">💡</span>
                            <span class="section-label">Technical Spotlight</span>
                        </button>
                        <button class="section-nav-item" data-showcase-nav="evolution">
                            <span class="section-icon">🔄</span>
                            <span class="section-label">The Evolution</span>
                        </button>
                        <button class="section-nav-item" data-showcase-nav="who">
                            <span class="section-icon">👥</span>
                            <span class="section-label">Who Are We</span>
                        </button>
                    </div>
                </div>
            `,
            init: () => {
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

                // Handle navigation clicks - send message to iframe
                document.querySelectorAll('[data-showcase-nav]').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const tab = btn.getAttribute('data-showcase-nav');
                        const iframe = document.querySelector('.showcase-app iframe') as HTMLIFrameElement;
                        if (iframe && iframe.contentWindow) {
                            iframe.contentWindow.postMessage({
                                type: 'navigate-tab',
                                tab: tab
                            }, '*');
                        }
                        // Close sidebar
                        document.getElementById('uv7-sidebar')?.classList.remove('open');
                        document.getElementById('uv7-backdrop')?.classList.remove('visible');
                    });
                });

                // Handle quick actions
                document.querySelectorAll('[data-action]').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const action = btn.getAttribute('data-action');
                        const iframe = document.querySelector('.showcase-app iframe') as HTMLIFrameElement;

                        // Send to iframe for handling
                        if (iframe && iframe.contentWindow) {
                            iframe.contentWindow.postMessage({
                                type: 'quick-action',
                                action: action
                            }, '*');
                        }

                        // Close sidebar (unless toggle-mode)
                        if (action !== 'toggle-mode') {
                            document.getElementById('uv7-sidebar')?.classList.remove('open');
                            document.getElementById('uv7-backdrop')?.classList.remove('visible');
                        }
                    });
                });

                console.log('[ShowcaseApp] Sidebar initialized');
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
