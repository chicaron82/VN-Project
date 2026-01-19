/**
 * Timeline Navigator
 * Handles sticky sidebar navigation for timeline phases and keyboard shortcuts
 */

class TimelineNavigator {
    constructor() {
        this.nav = null;
        this.phases = [];
        this.observer = null;

        // Wait for timeline to be populated
        this.initWhenReady();
    }

    initWhenReady() {
        // Poll for timeline phases existence
        const checkInterval = setInterval(() => {
            const timeline = document.getElementById('timeline-container');
            const phases = document.querySelectorAll('.timeline-phase');

            if (timeline && phases.length > 0) {
                clearInterval(checkInterval);
                this.phases = Array.from(phases);
                this.init();
            }
        }, 500);

        // Stop checking after 10 seconds
        setTimeout(() => clearInterval(checkInterval), 10000);
    }

    init() {
        this.createNavigator();
        this.setupObserver();
        this.setupKeyboardShortcuts();
        this.setupTabListener();
    }

    createNavigator() {
        this.nav = document.createElement('div');
        this.nav.className = 'timeline-navigator';

        const header = document.createElement('h4');
        header.textContent = 'Timeline Phases';
        this.nav.appendChild(header);

        const list = document.createElement('ul');
        list.className = 'phase-list';

        this.phases.forEach((phase, index) => {
            // Ensure phase has ID
            if (!phase.id) {
                phase.id = `phase-${index + 1}`;
            }

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${phase.id}`;
            a.textContent = phase.querySelector('.phase-title')?.textContent || `Phase ${index + 1}`;
            a.dataset.target = phase.id;

            a.addEventListener('click', (e) => {
                e.preventDefault();
                phase.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });

            li.appendChild(a);
            list.appendChild(li);
        });

        this.nav.appendChild(list);
        document.body.appendChild(this.nav);
    }

    setupObserver() {
        const options = {
            root: null,
            rootMargin: '-20% 0px -60% 0px', // Active when in middle-ish of screen
            threshold: 0
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setActive(entry.target.id);
                }
            });
        }, options);

        this.phases.forEach(phase => {
            this.observer.observe(phase);
        });
    }

    setActive(id) {
        if (!this.nav) return;

        const links = this.nav.querySelectorAll('a');
        links.forEach(link => {
            if (link.dataset.target === id) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only if journey tab is active
            if (!this.isJourneyActive()) return;

            // Numbers 1-9
            if (e.key >= '1' && e.key <= '9') {
                const index = parseInt(e.key) - 1;
                if (index < this.phases.length) {
                    this.phases[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }

    setupTabListener() {
        // Toggle visibility based on active tab
        const checkTab = () => {
            if (this.isJourneyActive()) {
                this.nav.classList.add('visible');
            } else {
                this.nav.classList.remove('visible');
            }
        };

        // Initial check
        checkTab();

        // Listen for tab changes (MutationObserver on tab container active class)
        // Or hooking into button clicks
        const tabButtons = document.querySelectorAll('.tab-item');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(checkTab, 100); // Wait for tab switch
            });
        });
    }

    isJourneyActive() {
        const journeyPanel = document.querySelector('.tab-panel[data-panel="journey"]');
        return journeyPanel && journeyPanel.classList.contains('active');
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TimelineNavigator();
    });
} else {
    new TimelineNavigator();
}
