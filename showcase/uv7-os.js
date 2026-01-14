/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 OS - NAVIGATION SYSTEM
 * Universal navigation for UV7 ecosystem
 * 
 * Contributors:
 * - Ronnie (Architecture & Vision)
 * - Belle (Settings Integration & Meta-Narrative)
 * - Antigravity (Implementation)
 * ═══════════════════════════════════════════════════════════════
 */

class UV7OS {
    constructor(context, options = {}) {
        this.context = context; // 'showcase', 'landing', etc.
        this.phases = options.phases || [];
        this.currentPhase = null;
        this.currentMode = 'story'; // 'story' or 'dev'

        this.elements = {};
        this.init();
    }

    init() {
        this.cacheElements();
        this.detectCurrentPhase();
        this.detectCurrentMode();
        this.renderStatusBar();
        this.renderPhaseList();
        this.attachHandlers();
        this.restoreState();
        this.startScrollListener();

        // Initialize app switcher
        setTimeout(() => this.initAppSwitcher(), 100);

        // Add UV7 OS class to body
        document.body.classList.add('uv7-os-enabled');

        console.log('🚀 UV7 OS initialized:', this.context);
    }

    initAppSwitcher() {
        // Wait for UV7AppSwitcher to be available
        if (typeof UV7AppSwitcher !== 'undefined') {
            this.appSwitcher = new UV7AppSwitcher();

            // Wire up logo click
            const statusLogo = document.querySelector('.status-logo');
            if (statusLogo) {
                statusLogo.addEventListener('click', () => {
                    this.appSwitcher.toggle();
                });
            }

            console.log('✅ App Switcher ready');
        } else {
            console.warn('⚠️ UV7AppSwitcher not loaded');
        }
    }

    cacheElements() {
        this.elements = {
            // Status bar
            statusBar: document.getElementById('uv7-status-bar'),
            statusContext: document.getElementById('uv7-context'),
            statusDetail: document.getElementById('uv7-detail'),
            statusSettings: document.getElementById('uv7-settings'),

            // Notification shade
            shade: document.getElementById('uv7-shade'),
            shadeClose: document.querySelector('.shade-close'),
            shadeCurrentPhase: document.getElementById('shade-current-phase'),
            shadeCurrentMode: document.getElementById('shade-current-mode'),
            shadePhaseList: document.getElementById('shade-phase-list'),

            // Sidebar
            sidebar: document.getElementById('uv7-sidebar'),
            sidebarToggle: document.getElementById('uv7-sidebar-toggle'),
            sidebarPhaseList: document.getElementById('sidebar-phase-list'),
            sidebarHome: document.getElementById('sidebar-home'),

            // Backdrop
            backdrop: document.getElementById('uv7-backdrop'),

            // Existing page elements
            viewToggle: document.getElementById('view-toggle')
        };
    }

    detectCurrentPhase() {
        // Find which phase is currently in viewport
        const phaseElements = document.querySelectorAll('[id^="phase-"]');
        for (const el of phaseElements) {
            const rect = el.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
                this.currentPhase = el.id.replace('phase-', '');
                return;
            }
        }
        // Default to phase 1 if none detected
        this.currentPhase = '1';
    }

    detectCurrentMode() {
        // Check body data-view-mode attribute
        const body = document.body;
        this.currentMode = body.dataset.viewMode || 'story';
    }

    renderStatusBar() {
        if (!this.elements.statusContext || !this.elements.statusDetail) return;

        // Context is always "Showcase" for this page
        this.elements.statusContext.textContent = 'Showcase';

        // Detail shows current phase
        this.elements.statusDetail.textContent = `Phase ${this.currentPhase}`;
    }

    renderPhaseList() {
        if (!this.phases || this.phases.length === 0) return;

        // Clear existing lists
        if (this.elements.shadePhaseList) {
            this.elements.shadePhaseList.innerHTML = '';
        }
        if (this.elements.sidebarPhaseList) {
            this.elements.sidebarPhaseList.innerHTML = '';
        }

        // Render each phase
        this.phases.forEach(phase => {
            const phaseNum = phase.id.replace('phase-', '');
            const isCurrent = phaseNum === this.currentPhase;

            // Create shade item
            if (this.elements.shadePhaseList) {
                const shadeItem = this.createPhaseItem(phase, isCurrent);
                this.elements.shadePhaseList.appendChild(shadeItem);
            }

            // Create sidebar item
            if (this.elements.sidebarPhaseList) {
                const sidebarItem = this.createPhaseItem(phase, isCurrent);
                this.elements.sidebarPhaseList.appendChild(sidebarItem);
            }
        });
    }

    createPhaseItem(phase, isCurrent) {
        const item = document.createElement('div');
        item.className = `phase-item ${isCurrent ? 'current' : ''}`;

        const phaseNum = phase.id.replace('phase-', '');
        const checkbox = isCurrent ? '▣' : '▢';

        item.innerHTML = `
            <span class="phase-checkbox">${checkbox}</span>
            <span class="phase-label">Phase ${phaseNum}</span>
            ${isCurrent ? '<span class="phase-indicator">← YOU</span>' : ''}
        `;

        item.addEventListener('click', () => this.jumpToPhase(phase.id));

        return item;
    }

    attachHandlers() {
        // Belle: Settings icon toggles Story/Dev mode
        if (this.elements.statusSettings && this.elements.viewToggle) {
            this.elements.statusSettings.addEventListener('click', () => {
                this.elements.viewToggle.click();
                // Update mode after toggle
                setTimeout(() => {
                    this.detectCurrentMode();
                    this.updateCurrentModeDisplay();
                }, 100);
            });
        }

        // Shade close button
        if (this.elements.shadeClose) {
            this.elements.shadeClose.addEventListener('click', () => this.closeShade());
        }

        // Sidebar toggle
        if (this.elements.sidebarToggle) {
            this.elements.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Sidebar home button
        if (this.elements.sidebarHome) {
            this.elements.sidebarHome.addEventListener('click', () => {
                window.location.href = '../index.html';
            });
        }

        // Backdrop closes shade/sidebar
        if (this.elements.backdrop) {
            this.elements.backdrop.addEventListener('click', () => {
                this.closeShade();
                this.closeSidebar();
            });
        }

        // Quick actions
        this.attachQuickActions();

        // Swipe down to open shade (portrait)
        this.attachSwipeHandler();

        // Escape key closes shade/sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeShade();
                this.closeSidebar();
            }
        });
    }

    attachQuickActions() {
        const quickActions = document.querySelectorAll('.quick-action');
        quickActions.forEach(action => {
            const actionType = action.dataset.action;
            action.addEventListener('click', () => this.handleQuickAction(actionType));
        });
    }

    handleQuickAction(actionType) {
        switch (actionType) {
            case 'launch-v1':
                window.location.href = '../v1/index.html';
                break;
            case 'launch-v2':
                window.location.href = '../index.v2.html';
                break;
            case 'go-home':
                window.location.href = '../index.html';
                break;
            case 'toggle-mode':
                if (this.elements.viewToggle) {
                    this.elements.viewToggle.click();
                    setTimeout(() => {
                        this.detectCurrentMode();
                        this.updateCurrentModeDisplay();
                    }, 100);
                }
                break;
        }
    }

    attachSwipeHandler() {
        let touchStartY = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].clientY;
            this.handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const swipeDistance = touchEndY - touchStartY;

            // Swipe down from top (> 100px) opens shade
            if (touchStartY < 100 && swipeDistance > 100) {
                this.openShade();
            }

            // Swipe up (< -100px) closes shade if it's open
            if (swipeDistance < -100 && this.elements.shade && this.elements.shade.classList.contains('open')) {
                this.closeShade();
            }
        };

        this.handleSwipe = handleSwipe;
    }

    openShade() {
        if (!this.elements.shade) return;
        this.elements.shade.classList.add('open');
        this.elements.backdrop.classList.add('visible');
    }

    closeShade() {
        if (!this.elements.shade) return;
        this.elements.shade.classList.remove('open');
        this.elements.backdrop.classList.remove('visible');
    }

    toggleSidebar() {
        if (!this.elements.sidebar) return;
        const isOpen = this.elements.sidebar.classList.contains('open');
        if (isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    openSidebar() {
        if (!this.elements.sidebar) return;
        this.elements.sidebar.classList.add('open');
        this.elements.backdrop.classList.add('visible');
    }

    closeSidebar() {
        if (!this.elements.sidebar) return;
        this.elements.sidebar.classList.remove('open');
        this.elements.backdrop.classList.remove('visible');
    }

    jumpToPhase(phaseId) {
        const element = document.getElementById(phaseId);
        if (element) {
            // Close shade/sidebar
            this.closeShade();
            this.closeSidebar();

            // Scroll to phase (account for status bar)
            const yOffset = -44; // Status bar height
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });

            // Save state
            this.saveState(phaseId);

            // Update current phase
            this.currentPhase = phaseId.replace('phase-', '');
            this.renderStatusBar();
            this.updateCurrentPhaseDisplay();
        }
    }

    updateCurrentPhaseDisplay() {
        if (this.elements.shadeCurrentPhase) {
            this.elements.shadeCurrentPhase.textContent = `Phase ${this.currentPhase}`;
        }

        // Re-render phase lists to update checkboxes
        this.renderPhaseList();
    }

    updateCurrentModeDisplay() {
        if (this.elements.shadeCurrentMode) {
            const modeText = this.currentMode === 'story' ? 'Story Mode' : 'Dev Mode';
            this.elements.shadeCurrentMode.textContent = `(${modeText})`;
        }
    }

    startScrollListener() {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const oldPhase = this.currentPhase;
                this.detectCurrentPhase();
                if (oldPhase !== this.currentPhase) {
                    this.renderStatusBar();
                    this.updateCurrentPhaseDisplay();
                    this.saveState(`phase-${this.currentPhase}`);
                }
            }, 200);
        }, { passive: true });
    }

    saveState(phaseId) {
        sessionStorage.setItem('uv7-showcase-phase', phaseId);
    }

    restoreState() {
        const savedPhase = sessionStorage.getItem('uv7-showcase-phase');
        if (savedPhase) {
            // Scroll to saved phase after a brief delay
            setTimeout(() => this.jumpToPhase(savedPhase), 500);
        }
    }
}

// Initialize UV7 OS when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for timeline data to be available
    if (typeof TIMELINE_DATA !== 'undefined' && TIMELINE_DATA.phases) {
        window.uv7os = new UV7OS('showcase', {
            phases: TIMELINE_DATA.phases
        });
    } else {
        console.warn('⚠️ UV7 OS: Timeline data not available');
    }
});
