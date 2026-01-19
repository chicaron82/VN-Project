/**
 * Showcase Sidebar Navigator
 * Handles sticky sidebar navigation for Showcase tabs and keyboard shortcuts
 */

class ShowcaseSidebar {
    constructor() {
        this.nav = null;
        this.tabs = [
            { id: 'intro', label: 'Evolution', icon: '🧬' },
            { id: 'timeline', label: 'Timeline', icon: '⏳' },
            { id: 'features', label: 'Features', icon: '✨' },
            { id: 'tech', label: 'Tech Stack', icon: '💻' },
            { id: 'stats', label: 'Results', icon: '📊' },
            { id: 'about', label: 'About', icon: 'ℹ️' }
        ];

        this.init();
    }

    init() {
        this.createNavigator();
        this.setupKeyboardShortcuts();
        this.setupStateListener();

        // Initial active state check
        setTimeout(() => this.updateActiveState(), 500);
    }

    createNavigator() {
        this.nav = document.createElement('div');
        this.nav.className = 'timeline-navigator showcase-sidebar'; // Keep class for CSS compat

        const header = document.createElement('h4');
        header.textContent = 'Navigation';
        this.nav.appendChild(header);

        const list = document.createElement('ul');
        list.className = 'phase-list';

        this.tabs.forEach((tab, index) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${tab.id}`;
            a.innerHTML = `<span class="nav-icon">${tab.icon}</span> <span class="nav-label">${tab.label}</span>`;
            a.dataset.target = tab.id;
            a.dataset.index = index;

            a.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToTab(tab.id);
            });

            li.appendChild(a);
            list.appendChild(li);
        });

        this.nav.appendChild(list);
        document.body.appendChild(this.nav);

        // Always visible now
        requestAnimationFrame(() => this.nav.classList.add('visible'));
    }

    navigateToTab(tabId) {
        // Trigger TabController
        // Assuming TabController exposes a global method or we can click the tab button
        const tabBtn = document.querySelector(`.tab-item[data-tab="${tabId}"]`);
        if (tabBtn) {
            tabBtn.click();
        } else {
            console.warn(`Tab button for ${tabId} not found`);
        }
    }

    setupStateListener() {
        // Listen for tab changes via mutation on the tab buttons
        // Or if TabController emits an event. For now, rely on DOM mutation or click bubble.

        // Option 1: Global click listener to catch tab changes
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tab-item')) {
                setTimeout(() => this.updateActiveState(), 50);
            }
        });

        // Option 2: Active Loop for robustness (simple polling)
        setInterval(() => this.updateActiveState(), 1000);
    }

    updateActiveState() {
        if (!this.nav) return;

        // Find currently active tab button
        const activeBtn = document.querySelector('.tab-navigation .tab-item.active');
        if (!activeBtn) return;

        const activeId = activeBtn.dataset.tab;

        const links = this.nav.querySelectorAll('a');
        links.forEach(link => {
            if (link.dataset.target === activeId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Numbers 1-6 for tabs
            // Only if not typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key >= '1' && e.key <= '6') {
                const index = parseInt(e.key) - 1;
                if (index < this.tabs.length) {
                    this.navigateToTab(this.tabs[index].id);
                }
            }
        });
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ShowcaseSidebar();
    });
} else {
    new ShowcaseSidebar();
}
