/**
 * TIMELINE RENDERER - MICHELIN EDITION 🍽️
 * Handles rendering, filtering, sorting, and spotlight search for project timeline.
 */

class TimelineRenderer {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.originalEntries = [];
        this.currentEntries = [];
        this.activeFilter = 'all';
        this.activeSort = 'story'; // 'story' (asc) or 'dev' (desc)
        this.searchQuery = '';

        // Cache DOM elements
        this.toolbar = null;
        this.entriesContainer = null;

        // Signal Animation
        this.signalPulse = null;
        this.isScrolling = false;

        this.init();
    }

    async init() {
        if (!this.container) return;

        // Inject Signal Track
        this.createSignalTrack();

        // Load Data
        await this.loadTimelineData();

        // Initial Render
        this.renderToolbar();
        this.renderTimeline();

        // Setup Observers
        this.setupInteractions();
    }

    createSignalTrack() {
        // Only if it doesn't exist
        if (!this.container.querySelector('.timeline-signal-track')) {
            const track = document.createElement('div');
            track.className = 'timeline-signal-track';
            this.signalPulse = document.createElement('div');
            this.signalPulse.className = 'timeline-signal-pulse';
            track.appendChild(this.signalPulse);
            this.container.appendChild(track);

            // Connect signal to scroll
            window.addEventListener('scroll', () => {
                if (!this.signalPulse) return;

                // Simple calculation to move pulse visually based on viewport center
                // relative to the container
                const rect = this.container.getBoundingClientRect();
                const viewportCenter = window.innerHeight / 2;
                const relativeTop = viewportCenter - rect.top;

                // Clamp
                const clampedTop = Math.max(0, Math.min(relativeTop, rect.height));

                this.signalPulse.style.top = `${clampedTop}px`;
                this.signalPulse.style.opacity = '1';

                clearTimeout(this.scrollTimeout);
                this.scrollTimeout = setTimeout(() => {
                    this.signalPulse.style.opacity = '0.5';
                }, 1000);
            }, { passive: true });
        }
    }

    setupInteractions() {
        // Observer for context updates (if needed)
        // For now, the global scroll listener handles the signal pulse
        // We can add IntersectionObservers here for individual phase highlighting if we want "active" states

        // Example: Highlight active phase in sidebar (though sidebar handles this itself)
        // This is a placeholder for future interaction logic to satisfy the init call
        console.log('🍽️ Timeline interactions initialized');
    }

    async loadTimelineData() {
        // Check window global first (loaded via script to avoid CORS)
        if (window.TIMELINE_DATA && window.TIMELINE_DATA.entries) {
            this.originalEntries = window.TIMELINE_DATA.entries;
        } else {
            console.error("TIMELINE_DATA not found. Make sure timeline-data.js is loaded.");
            this.originalEntries = [];
        }

        // Set Sort Date if missing (fallback to ID or index)
        this.originalEntries.forEach((entry, index) => {
            if (!entry.sortDate) {
                // Approximate for legacy/missing data
                entry.sortDate = `2026-01-01T${index}`;
            }
        });

        this.applyLogic();
    }

    // --- CORE LOGIC ---

    applyLogic() {
        // 1. Filter
        let filtered = this.originalEntries;
        if (this.activeFilter !== 'all') {
            filtered = filtered.filter(p => p.date.includes(this.activeFilter));
        }

        // 2. Search (Spotlight)
        // We don't remove items in search, we just mark them for "Spotlight"
        // But if filtering, we do remove. 
        // Let's keep search separate: Search affects VISIBILITY STATE (dimming), not existence.

        // 3. Sort
        filtered.sort((a, b) => {
            if (this.activeSort === 'story') {
                return a.sortDate.localeCompare(b.sortDate);
            } else {
                return b.sortDate.localeCompare(a.sortDate);
            }
        });

        this.currentEntries = filtered;
    }

    // --- RENDERING ---

    renderToolbar() {
        if (this.toolbar) this.toolbar.remove();

        this.toolbar = document.createElement('div');
        this.toolbar.className = 'timeline-toolbar-container';

        // Extract Unique Dates for Filter
        const dates = [...new Set(this.originalEntries.map(p => {
            // Simplify date string "January 12, 2026 (Morning)" -> "Jan 12"
            // This is a naive regex, might need adjustment based on real data
            const match = p.date.match(/([A-Z][a-z]+ \d+)/);
            return match ? match[0] : p.date;
        }))];

        // Build Filter Options
        const filterOptions = dates.map(date => `<option value="${date}">${date}</option>`).join('');

        this.toolbar.innerHTML = `
            <div class="timeline-toolbar">
                <div class="toolbar-group">
                    <button class="timeline-btn ${this.activeSort === 'story' ? 'active' : ''}" data-action="sort" data-value="story">
                        <span>📜</span> Story
                    </button>
                    <button class="timeline-btn ${this.activeSort === 'dev' ? 'active' : ''}" data-action="sort" data-value="dev">
                        <span>⚡</span> Dev Log
                    </button>
                </div>
                
                <div class="toolbar-group">
                     <select class="timeline-btn" id="timeline-filter">
                        <option value="all">All Dates</option>
                        ${filterOptions}
                     </select>
                </div>

                <div class="search-wrapper">
                    <span class="search-icon">🔍</span>
                    <input type="text" class="timeline-search" placeholder="Spotlight search (e.g. 'EventBus', 'Tori')..." />
                </div>
            </div>
        `;

        // Insert Toolbar before container contents
        this.container.insertBefore(this.toolbar, this.container.firstChild);

        // Events
        this.toolbar.querySelectorAll('[data-action="sort"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const val = e.currentTarget.dataset.value;
                this.activeSort = val;
                this.renderToolbar(); // Re-render to update active state
                this.applyLogic();
                this.renderTimeline();
            });
        });

        const filterSelect = this.toolbar.querySelector('#timeline-filter');
        filterSelect.value = this.activeFilter; // Restore state
        filterSelect.addEventListener('change', (e) => {
            this.activeFilter = e.target.value;
            this.applyLogic();
            this.renderTimeline();
        });

        const searchInput = this.toolbar.querySelector('.timeline-search');
        searchInput.value = this.searchQuery;
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.applySpotlight();
        });
    }

    renderTimeline() {
        // Remove old phases if any
        if (this.entriesContainer) this.entriesContainer.remove();

        this.entriesContainer = document.createElement('div');
        this.entriesContainer.className = 'timeline-phases';

        this.currentEntries.forEach(entry => {
            const el = this.createEntryElement(entry);
            this.entriesContainer.appendChild(el);
        });

        this.container.appendChild(this.entriesContainer);

        // Re-apply spotlight if query exists
        if (this.searchQuery) this.applySpotlight();

        // Trigger Prism syntax highlight
        if (window.Prism) Prism.highlightAll();
    }

    applySpotlight() {
        const query = this.searchQuery.toLowerCase();
        const items = this.entriesContainer.querySelectorAll('.timeline-item');

        if (!query) {
            this.entriesContainer.classList.remove('spotlight-mode');
            items.forEach(item => {
                item.classList.remove('dimmed', 'focused');
            });
            return;
        }

        this.entriesContainer.classList.add('spotlight-mode');

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const phaseId = item.id;

            // Check if matches
            if (text.includes(query)) {
                item.classList.add('focused');
                item.classList.remove('dimmed');
            } else {
                item.classList.add('dimmed');
                item.classList.remove('focused');
            }
        });
    }

    // --- DOM GENERATION (Moved from original script.js) ---
    // Keeping this mostly identical to original to preserve styling, 
    // but ensured it uses this.create... methods attached to class

    createEntryElement(entry) {
        // Reuse the logic from your detailed original implementation
        // For brevity in this tool call, I will include the logic needed.
        // I will assume the CSS classes align with what exists.

        const item = document.createElement('div');
        item.className = `timeline-item ${entry.type || ''}`;
        item.id = entry.id;

        const marker = document.createElement('div');
        marker.className = 'timeline-marker';

        const content = document.createElement('div');
        content.className = 'timeline-content';

        // HEADER
        const header = document.createElement('h3');
        header.textContent = `${entry.date} ${entry.emoji || ''}`;
        content.appendChild(header);

        // TITLE
        const title = document.createElement('p');
        title.innerHTML = `<strong>${entry.title}</strong>`;
        content.appendChild(title);

        // SUMMARY
        if (entry.summary) {
            const summary = document.createElement('p');
            summary.innerHTML = entry.summary; // Allow HTML in summary
            content.appendChild(summary);
        }

        // DETAILS (Toggleable)
        // To simplify, we'll make details visible in Dev Log mode maybe? 
        // No, stick to toggle.

        const details = document.createElement('div');
        details.className = 'timeline-details';
        let hasDetails = false;

        // 1. Problem
        if (entry.problem) {
            hasDetails = true;
            details.innerHTML += `
                <div class="journal-entry">
                    <p><strong>The Lesson:</strong></p>
                    <p>"${entry.problem.description}"</p>
                    ${entry.problem.rootCause ? `<p class="root-cause">Root Cause: ${entry.problem.rootCause}</p>` : ''}
                </div>`;
        }

        // 2. Features
        if (entry.features) {
            hasDetails = true;
            const ul = document.createElement('ul');
            ul.className = 'update-list';
            entry.features.forEach(f => {
                const li = document.createElement('li');
                li.innerHTML = f;
                ul.appendChild(li);
            });
            details.appendChild(ul);
        }

        // 3. Callout
        if (entry.callout) {
            hasDetails = true;
            const callout = document.createElement('div');
            callout.className = `v2-improvement-callout`;
            // Add legacy phase styling support if needed

            callout.innerHTML = `
                <div class="callout-icon">${entry.callout.icon || '💡'}</div>
                <div class="callout-content">
                    <strong>${entry.callout.title || 'Insight:'}</strong> ${entry.callout.text || entry.callout.content || ''}
                </div>
            `;
            details.appendChild(callout);
        }

        // 4. Media (Carousel)
        if (entry.media && entry.media.carousel) {
            hasDetails = true;
            // Simplified carousel renderer for this MVP
            const carouselDiv = document.createElement('div');
            carouselDiv.className = 'timeline-carousel';
            entry.media.carousel.forEach(img => {
                const imgEl = document.createElement('img');
                imgEl.src = img.url;
                imgEl.alt = img.caption;
                imgEl.title = img.caption;
                imgEl.loading = 'lazy';
                carouselDiv.appendChild(imgEl);
            });
            details.appendChild(carouselDiv);
        }

        // 5. Code Comparison
        if (entry.codeComparison || (entry.media && entry.media.codeComparison)) {
            hasDetails = true;
            const comp = entry.codeComparison || entry.media.codeComparison;
            const compDiv = document.createElement('div');
            compDiv.className = 'code-comparison';

            // Before
            if (comp.before) {
                compDiv.innerHTML += `
                    <div class="code-window">
                        <div class="code-header"><span>${comp.before.title}</span><span class="code-badge badge-chaos">${comp.before.badge}</span></div>
                        <div class="code-content"><pre><code class="language-${comp.before.lang}">${this.escapeHtml(comp.before.code)}</code></pre></div>
                    </div>
                `;
            }
            // After
            if (comp.after) {
                compDiv.innerHTML += `
                    <div class="code-window">
                        <div class="code-header"><span>${comp.after.title}</span><span class="code-badge badge-order">${comp.after.badge}</span></div>
                        <div class="code-content"><pre><code class="language-${comp.after.lang}">${this.escapeHtml(comp.after.code)}</code></pre></div>
                    </div>
                `;
            }
            details.appendChild(compDiv);
        }

        // 6. Metrics
        if (entry.metrics) {
            hasDetails = true;
            const metricsGrid = document.createElement('div');
            metricsGrid.className = 'stats-mini-grid dev-only';
            Object.entries(entry.metrics).forEach(([key, val]) => {
                metricsGrid.innerHTML += `
                    <div class="stat-mini">
                        <span class="stat-num">${val}</span>
                        <span class="stat-desc">${key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                `;
            });
            details.appendChild(metricsGrid);
        }

        // Toggle Button
        if (hasDetails) {
            const toggle = document.createElement('button');
            toggle.className = 'expand-toggle';
            toggle.textContent = 'View details';
            toggle.onclick = (e) => {
                e.stopPropagation();
                item.classList.toggle('expanded');
                toggle.textContent = item.classList.contains('expanded') ? 'Hide details' : 'View details';
            };
            content.appendChild(toggle);
            content.appendChild(details);
        }

        item.appendChild(marker);
        item.appendChild(content);
        return item;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Global Export
window.TimelineRenderer = TimelineRenderer;
