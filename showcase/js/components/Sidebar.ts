/**
 * Sidebar Component (UV7 Control Center)
 * Handles rendering, toggling, and system stats logic for the desktop sidebar.
 */
export class Sidebar {
    constructor(containerId = 'uv7-sidebar-mount') {
        this.containerId = containerId;
        this.render();
        this.cacheElements();
        this.initEvents();
        this.initSystemStats();
    }

    render() {
        const mount = document.getElementById(this.containerId);
        if (!mount) return;

        mount.innerHTML = `
            <!-- Sidebar (Landscape) -->
            <div id="uv7-sidebar" class="uv7-sidebar">
                <div class="sidebar-header">
                    <span class="sidebar-title">⚡ UV7 CONTROL CENTER</span>
                </div>
                <div class="sidebar-content">
                    <!-- Quick Actions Grid -->
                    <div class="sidebar-section">
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
                                <span class="quick-action-label">Home</span>
                            </button>
                            <button class="quick-action" data-action="toggle-mode">
                                <span class="quick-action-icon">📖</span>
                                <span class="quick-action-label">Mode</span>
                            </button>
                        </div>
                    </div>

                    <!-- System Stats Widget -->
                    <div class="sidebar-section">
                        <div class="system-stats-widget">
                            <div class="stat-row">
                                <div class="stat-info">
                                    <span class="stat-label">CPU LOAD</span>
                                    <span class="stat-value" id="sys-cpu">12%</span>
                                </div>
                                <div class="stat-bar-track">
                                    <div class="stat-bar-fill" id="sys-cpu-bar" style="width: 12%"></div>
                                </div>
                            </div>
                            <div class="stat-row">
                                <div class="stat-info">
                                    <span class="stat-label">RAM USAGE</span>
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

                    <!-- Directory Navigation -->
                    <div class="sidebar-section">
                        <div class="sidebar-section-title">DIRECTORY</div>
                        <div class="section-nav-list" id="sidebar-section-list">
                            <button class="section-nav-item" data-section="journey-section">
                                <span class="section-icon">📁</span>
                                <span class="section-label">The Journey</span>
                            </button>
                            <button class="section-nav-item" data-section="workflow-section">
                                <span class="section-icon">📁</span>
                                <span class="section-label">Workflow</span>
                            </button>
                            <button class="section-nav-item" data-section="results-section">
                                <span class="section-icon">📁</span>
                                <span class="section-label">The Results</span>
                            </button>
                            <button class="section-nav-item" data-section="spotlight-section">
                                <span class="section-icon">📁</span>
                                <span class="section-label">Tech Spotlight</span>
                            </button>
                            <button class="section-nav-item" data-section="evolution-section">
                                <span class="section-icon">📁</span>
                                <span class="section-label">Evolution archive</span>
                            </button>
                            <button class="section-nav-item" data-section="who-section">
                                <span class="section-icon">📁</span>
                                <span class="section-label">Crew Manifest</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar Toggle (Right Side) -->
            <div id="uv7-sidebar-toggle" class="uv7-sidebar-toggle">
                <span>☰</span>
            </div>

            <!-- Backdrop -->
            <div id="uv7-backdrop" class="uv7-backdrop"></div>
        `;
    }

    cacheElements() {
        this.el = {
            sidebar: document.getElementById('uv7-sidebar'),
            toggle: document.getElementById('uv7-sidebar-toggle'),
            backdrop: document.getElementById('uv7-backdrop'),
            cpuVal: document.getElementById('sys-cpu'),
            ramVal: document.getElementById('sys-ram'),
            cpuBar: document.getElementById('sys-cpu-bar'),
            ramBar: document.getElementById('sys-ram-bar')
        };
    }

    initEvents() {
        // Toggle Open/Close - Context Aware
        this.el.toggle?.addEventListener('click', () => {
            // Portrait Mode: Open Shade instead of Sidebar
            if (window.innerWidth <= 768) {
                document.dispatchEvent(new CustomEvent('open-shade'));
            } else {
                this.toggle();
            }
        });
        this.el.backdrop?.addEventListener('click', () => this.close());

        // Delegate Quick Actions & Navigation
        this.el.sidebar?.addEventListener('click', (e) => {
            // 1. Section Navigation
            const navBtn = e.target.closest('[data-section]');
            if (navBtn) {
                const section = navBtn.dataset.section;
                this.handleNavigation(section);
                return;
            }

            // 2. Quick Actions
            const actionBtn = e.target.closest('[data-action]');
            if (actionBtn) {
                const action = actionBtn.dataset.action;
                this.handleAction(action);
            }
        });
    }

    handleNavigation(sectionClass) {
        this.close();
        window.dispatchEvent(new CustomEvent('uv7-navigate', {
            detail: { target: sectionClass }
        }));
    }

    handleAction(action) {
        // Dispatch generic action event for main controller/OS to handle
        window.dispatchEvent(new CustomEvent('uv7-action', {
            detail: { action: action }
        }));

        // Special case: Mode toggle needs visual update immediately?
        // No, let state manager handle it.
        if (action !== 'toggle-mode') {
            this.close();
        }
    }

    toggle() {
        this.el.sidebar.classList.toggle('open');
        this.el.backdrop.classList.toggle('active');
        this.el.toggle.classList.toggle('active');

        // Body Scroll Lock
        if (this.el.sidebar.classList.contains('open')) {
            document.body.classList.add('uv7-no-scroll');
        } else {
            document.body.classList.remove('uv7-no-scroll');
        }
    }

    close() {
        this.el.sidebar.classList.remove('open');
        this.el.backdrop.classList.remove('active');
        this.el.toggle.classList.remove('active');
        document.body.classList.remove('uv7-no-scroll');
    }

    initSystemStats() {
        if (!this.el.cpuVal) return;

        // Animate stats
        setInterval(() => {
            const cpu = Math.floor(Math.random() * 30) + 5; // 5-35% base
            const ram = 60 + Math.floor(Math.random() * 8); // 60-68%

            this.el.cpuVal.textContent = `${cpu}%`;
            if (this.el.cpuBar) this.el.cpuBar.style.width = `${cpu}%`;

            this.el.ramVal.textContent = `${ram}%`;
            if (this.el.ramBar) this.el.ramBar.style.width = `${ram}%`;
        }, 2000);
    }
}
