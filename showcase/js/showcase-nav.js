/**
 * Showcase Sidebar Navigator
 * Handles sticky sidebar navigation for Showcase tabs and keyboard shortcuts
 */

class ShowcaseSidebar {
    constructor() {
        this.nav = null;
        this.tabs = [
            { id: 'journey', label: 'Journey', icon: '🗺️' },
            { id: 'workflow', label: 'Workflow', icon: '⚙️' },
            { id: 'results', label: 'Results', icon: '📊' },
            { id: 'spotlight', label: 'Spotlight', icon: '💡' },
            { id: 'evolution', label: 'Evolution', icon: '🔄' },
            { id: 'who', label: 'Who Are We', icon: '👥' }
        ];

        console.log('ShowcaseSidebar initialized', this.tabs);
        this.init();
    }

    init() {
        // AGGRESSIVE CLEANUP: Remove any ghost elements (the ones showing "NaN")
        document.querySelectorAll('.timeline-navigator').forEach(el => {
            console.log('Removing ghost navigator:', el);
            el.remove();
        });

        this.createNavigator();
        this.setupKeyboardShortcuts();
        this.setupStateListener();

        // Initial active state check
        setTimeout(() => this.updateActiveState(), 500);

        // Continuous cleanup of ghosts
        setInterval(() => {
            const ghosts = document.querySelectorAll('.timeline-navigator');
            if (ghosts.length > 0) {
                ghosts.forEach(el => el.remove());
            }
        }, 1000);
    }

    createNavigator() {
        // Remove existing if any (of our own type)
        const existing = document.querySelector('.uv7-showcase-nav');
        if (existing) existing.remove();

        this.nav = document.createElement('div');
        this.nav.className = 'uv7-showcase-nav showcase-sidebar'; // NEW CLASS

        const header = document.createElement('h4');
        header.textContent = 'Navigation';
        this.nav.appendChild(header);

        const list = document.createElement('ul');
        list.className = 'phase-list';

        this.tabs.forEach((tab, index) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${tab.id}`;

            // Safe innerHTML assignment
            const iconSpan = `<span class="nav-icon">${tab.icon || '•'}</span>`;
            const labelSpan = `<span class="nav-label">${tab.label || 'Tab'}</span>`;
            a.innerHTML = `${iconSpan} ${labelSpan}`;

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
        const tabBtn = document.querySelector(`.tab-item[data-tab="${tabId}"]`);
        if (tabBtn) {
            tabBtn.click();
        } else {
            console.warn(`Tab button for ${tabId} not found`);
        }
    }

    setupStateListener() {
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
        const activeBtn = document.querySelector('.tab-navigation .tab-item.active, .tab-bar .tab-item.active');
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
