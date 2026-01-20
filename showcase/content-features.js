/**
 * Content Features - Phase 3
 * Share functionality, dark mode, timeline search
 */

(function () {
    'use strict';

    // ==========================================
    // 1. SHARE FUNCTIONALITY
    // ==========================================

    function initShareButtons() {
        // Twitter/X Share
        window.shareTwitter = function () {
            const text = "Check out UV7: A visual novel built in 50 days with AI collaboration. 16 phases, 8 AI crew members, 100% type-safe. 🎮✨";
            const url = window.location.href;
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            window.open(twitterUrl, '_blank', 'width=550,height=420');
        };

        // LinkedIn Share
        window.shareLinkedIn = function () {
            const url = window.location.href;
            const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            window.open(linkedInUrl, '_blank', 'width=550,height=420');
        };

        // Copy Link
        window.copyLink = function () {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                showToast('Link copied to clipboard! 🔗');
            }).catch(err => {
                console.error('Failed to copy:', err);
                showToast('Failed to copy link');
            });
        };

        console.log('🔗 Share functionality initialized');
    }

    // ==========================================
    // 2. DARK MODE TOGGLE
    // ==========================================

    function initDarkMode() {
        // Check for saved preference or default to dark
        const savedTheme = localStorage.getItem('uv7-theme') || 'dark';
        document.body.dataset.theme = savedTheme;

        // Create toggle button in UV7 status bar
        const statusBar = document.getElementById('uv7-status-bar');
        if (statusBar) {
            const themeToggle = document.createElement('button');
            themeToggle.className = 'theme-toggle';
            themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
            themeToggle.setAttribute('aria-label', 'Toggle theme');
            themeToggle.title = 'Toggle light/dark mode';

            themeToggle.addEventListener('click', () => {
                const currentTheme = document.body.dataset.theme;
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

                document.body.dataset.theme = newTheme;
                localStorage.setItem('uv7-theme', newTheme);
                themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';

                showToast(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`);
            });

            // Add to status bar
            const statusBarLeft = statusBar.querySelector('.status-left');
            if (statusBarLeft) {
                statusBarLeft.appendChild(themeToggle);
            }
        }

        console.log('🌓 Dark mode initialized');
    }

    // ==========================================
    // 3. TIMELINE SEARCH/FILTER
    // ==========================================

    function initTimelineSearch() {
        const timelineContainer = document.querySelector('.timeline-phases');
        if (!timelineContainer) return;

        // Create search bar
        const searchContainer = document.createElement('div');
        searchContainer.className = 'timeline-search-container';
        searchContainer.innerHTML = `
            <div class="timeline-search">
                <input 
                    type="text" 
                    id="timeline-search-input" 
                    placeholder="Search timeline phases..."
                    aria-label="Search timeline"
                />
                <button id="timeline-search-clear" aria-label="Clear search">✕</button>
            </div>
            <div class="timeline-filters">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="architecture">Architecture</button>
                <button class="filter-btn" data-filter="ui">UI</button>
                <button class="filter-btn" data-filter="testing">Testing</button>
            </div>
        `;

        // Insert before timeline
        timelineContainer.parentNode.insertBefore(searchContainer, timelineContainer);

        const searchInput = document.getElementById('timeline-search-input');
        const clearBtn = document.getElementById('timeline-search-clear');
        const filterBtns = document.querySelectorAll('.filter-btn');

        // Search functionality
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            filterTimeline(query);
            clearBtn.style.display = query ? 'block' : 'none';
        });

        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            filterTimeline('');
            clearBtn.style.display = 'none';
        });

        // Filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                filterTimelineByCategory(filter);
            });
        });

        console.log('🔍 Timeline search initialized');
    }

    function filterTimeline(query) {
        const items = document.querySelectorAll('.timeline-item');
        let visibleCount = 0;

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const matches = text.includes(query);

            item.style.display = matches ? '' : 'none';
            if (matches) visibleCount++;
        });

        // Show "no results" message if needed
        showSearchResults(visibleCount, query);
    }

    function filterTimelineByCategory(category) {
        const items = document.querySelectorAll('.timeline-item');

        items.forEach(item => {
            if (category === 'all') {
                item.style.display = '';
            } else {
                const itemCategory = item.dataset.category || '';
                item.style.display = itemCategory.includes(category) ? '' : 'none';
            }
        });
    }

    function showSearchResults(count, query) {
        let resultsMsg = document.getElementById('search-results-msg');

        if (count === 0 && query) {
            if (!resultsMsg) {
                resultsMsg = document.createElement('div');
                resultsMsg.id = 'search-results-msg';
                resultsMsg.className = 'search-no-results';
                document.querySelector('.timeline-phases').appendChild(resultsMsg);
            }
            resultsMsg.textContent = `No phases found for "${query}"`;
            resultsMsg.style.display = 'block';
        } else if (resultsMsg) {
            resultsMsg.style.display = 'none';
        }
    }

    // ==========================================
    // 4. TOAST NOTIFICATIONS
    // ==========================================

    function showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'feature-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // ==========================================
    // 5. GITHUB SOURCE LINKS
    // ==========================================

    function addGitHubLinks() {
        const technicalCards = document.querySelectorAll('.technical-card');
        const githubBase = 'https://github.com/chicaron82/VN-Project';

        // Map card titles to GitHub paths (you can customize these)
        const cardPaths = {
            'Momentum Carousel': '/tree/main/v1/system',
            'UV7 OS': '/tree/main/showcase',
            'App Switcher': '/tree/main/showcase',
            'TypeScript Migration': '/tree/main/v2',
            'EventBus': '/tree/main/v2/core',
            'StateManager': '/tree/main/v2/managers'
        };

        technicalCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent;
            const path = cardPaths[title];

            if (path) {
                const linkBtn = document.createElement('a');
                linkBtn.href = githubBase + path;
                linkBtn.target = '_blank';
                linkBtn.className = 'github-source-link';
                linkBtn.innerHTML = '<span>📂</span> View Source';

                const details = card.querySelector('.tech-details');
                if (details) {
                    details.appendChild(linkBtn);
                }
            }
        });

        console.log('📂 GitHub source links added');
    }

    // ==========================================
    // INITIALIZATION
    // ==========================================

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        console.log('🎯 Initializing content features...');

        initShareButtons();
        initDarkMode();
        // initTimelineSearch(); // Disabled: Handled by TimelineRenderer (Michelin)
        addGitHubLinks();

        console.log('✨ Content features ready!');
    }

    init();

    // Export for manual use
    window.contentFeatures = {
        shareTwitter: window.shareTwitter,
        shareLinkedIn: window.shareLinkedIn,
        copyLink: window.copyLink,
        showToast
    };
})();
