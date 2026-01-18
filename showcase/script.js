
// DOM Elements
const container = document.querySelector('.split-container');
const layerOrder = document.querySelector('.layer-order');
const handle = document.querySelector('.slider-handle');

// State
let isDragging = false;
let skew = 0; // In case we want diagonal later, keeping simple for now
let position = 50; // Percentage

// Event Listeners
handle.querySelector('.slider-knob').addEventListener('mousedown', (e) => {
    isDragging = true;
    container.style.cursor = 'ew-resize';
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    container.style.cursor = 'default';
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    // Calculate percentage position
    let x = e.clientX;
    let width = window.innerWidth;
    let pct = (x / width) * 100;

    // Constraints
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;

    updateSlider(pct);
});

// Touch support
handle.querySelector('.slider-knob').addEventListener('touchstart', () => {
    isDragging = true;
});

window.addEventListener('touchend', () => {
    isDragging = false;
});

window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    let touch = e.touches[0];
    let x = touch.clientX;
    let width = window.innerWidth;
    let pct = (x / width) * 100;
    updateSlider(pct);
});

function updateSlider(pct) {
    position = pct;

    // Update Clip Path for the top layer (Order)
    // We reveal chaos (bottom) on left, Order (top) on right
    // Wait... if slider is at 50%, left is Chaos, right is Order.
    // So Order layer (top) needs to be clipped from LEFT.

    // clip-path: polygon(X% 0, 100% 0, 100% 100%, X% 100%);
    // If pct is 20%, we start at 20% and go right.

    layerOrder.style.clipPath = `polygon(${pct}% 0, 100% 0, 100% 100%, ${pct}% 100%)`;

    // Update Handle position
    handle.style.left = `${pct}%`;
}

// Initial Position
updateSlider(50);

// Keyboard Support
document.addEventListener('keydown', (e) => {
    // Arrow keys control the slider
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        updateSlider(Math.max(0, position - 5));
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        updateSlider(Math.min(100, position + 5));
    }
});

// Random Code Typer for Chaos Background
const chaosCodeBlock = document.querySelector('.chaos-code-bg');
const codeSnippets = [
    "function forceUpdate() { while(true) { try { render() } catch(e) { ignore() } } }",
    "// TODO: Fix this later... maybe...",
    "if (user.isSad) { makeHappy(user); } else { breakStuff(); }",
    "box-shadow: 0 0 100px #f0f;",
    "$('body').on('click', function() { alert('Why?'); });",
    "return null; // I give up",
    "try { everything() } catch (nothing) {}",
    "// Logic is overrated",
    "width: calc(100% + 50px); /* Just to be safe */"
];

function typeCode() {
    if (!chaosCodeBlock) return;

    let text = chaosCodeBlock.innerText;
    if (text.length > 500) text = text.substring(200); // trimming

    // Add random snippet
    const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    text += "\n" + snippet;

    chaosCodeBlock.innerText = text;

    setTimeout(typeCode, Math.random() * 500 + 100);
}

// Start typing effect
typeCode();

// ==========================================
// CLICKABLE INFO CARDS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const clickableCards = document.querySelectorAll('.card.clickable[data-section]');

    clickableCards.forEach(card => {
        card.addEventListener('click', () => {
            const sectionClass = card.dataset.section;
            const targetSection = document.querySelector(`.${sectionClass}`);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

// Fade-in animation for sections as they scroll into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in to all sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        // BUGFIX: Skip journey-section to prevent timeline from disappearing
        // The timeline is too long and gets hidden by the fade-in animation
        if (section.classList.contains('journey-section')) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
            return;
        }

        // Check if section is already in viewport on load
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            // Already visible - show immediately without animation
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        } else {
            // Not visible - set initial hidden state
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            // Observe for intersection
            fadeInObserver.observe(section);
        }
    });

    // Animate timeline items individually
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        // Check if item is already in viewport on load
        const rect = item.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            // Already visible - show immediately
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
            item.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
        } else {
            // Not visible - set initial hidden state and observe
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;

            const itemObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            itemObserver.observe(item);
        }
    });

    // Animate stat cards with stagger
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        // Check if card is already in viewport on load
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            // Already visible - show immediately
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            card.style.transition = `opacity 0.5s ease, transform 0.5s ease`;
        } else {
            // Not visible - set initial hidden state and observe
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;

            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'scale(1)';
                    }
                });
            }, { threshold: 0.3 });

            cardObserver.observe(card);
        }
    });
});

// ==========================================
// SCROLL PROGRESS INDICATOR
// ==========================================
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    if (scrollProgress) {
        scrollProgress.style.width = `${scrollPercent}%`;
    }
});

// ==========================================
// COUNTING NUMBER ANIMATION
// ==========================================
function animateCountUp(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);

        const current = Math.floor(start + (target - start) * easeOut);
        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target; // Ensure final value is exact
        }
    }

    requestAnimationFrame(update);
}

// Observe stat numbers and trigger animation
document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target, 10);
                animateCountUp(entry.target, target);

                // Trigger micro-animation on parent card
                const card = entry.target.closest('.stat-card');
                if (card) {
                    card.classList.add('animated');
                }

                countObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => countObserver.observe(num));
});

// Random Clean Code Typer for Order Background
const orderCodeBlock = document.querySelector('.order-code-bg');
const orderSnippets = [
    'interface GameState { tethers: Map<string, number>; }',
    'class EventBus { emit<T>(event: GameEvent<T>): void; }',
    'const loadRoute = async (id: string): Promise<RouteData> => { ... }',
    'type Difficulty = "normal" | "hard" | "insane";',
    '// Strict null checks enabled',
    'if (tether.isStable()) { syncTimeline(); }',
    'export const V2_CORE = Object.freeze({ ...config });',
    '// 0 errors found. Compilation successful.',
    'implements ISerializable'
];

function typeOrderCode() {
    if (!orderCodeBlock) return;

    let text = orderCodeBlock.innerText;
    if (text.length > 500) text = text.substring(200);

    const snippet = orderSnippets[Math.floor(Math.random() * orderSnippets.length)];
    text += '\n' + snippet;

    orderCodeBlock.innerText = text;

    setTimeout(typeOrderCode, Math.random() * 2000 + 1000); // Slower, more deliberate typing
}

typeOrderCode();

// ==========================================
// METRICS ANIMATION (PHASE 8)
// ==========================================
document.querySelectorAll('.metric-fill').forEach(bar => {
    // Store target width and set to 0 initially
    const targetWidth = bar.style.width;
    bar.style.width = '0%';

    // Animate to target width when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = targetWidth;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(bar);
});

// ==========================================
// SOCIAL SHARING
// ==========================================
function shareTwitter() {
    const text = "Check out UV7: A visual novel engine built from chaos to harmony with AI. #UV7 #GameDev #AI";
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        const btn = document.querySelector('button[onclick="copyLink()"]');
        if (btn) {
            const originalText = btn.innerText;
            btn.innerText = "✅ Copied!";
            setTimeout(() => btn.innerText = originalText, 2000);
        }
    });
}

// TIMELINE RENDERER
// ==========================================
class TimelineRenderer {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.phases = [];

        // Pagination state
        this.phasesPerPage = 3;
        this.currentPage = 0;
        this.viewAll = false;
    }

    async loadTimeline() {
        try {
            // Prioritize window.TIMELINE_DATA (loaded via script tag) to avoid CORS issues with file:// protocol
            if (window.TIMELINE_DATA && window.TIMELINE_DATA.phases) {
                this.phases = window.TIMELINE_DATA.phases;
                this.render();
                return;
            }

            // Fallback: Show error message
            console.error('Timeline data not found');
            this.showTimelineError();
        } catch (error) {
            console.error('Failed to load timeline:', error);
            this.showTimelineError();
        }
    }

    showTimelineError() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="timeline-error">
                <div class="error-icon">⚠️</div>
                <h3>Timeline Unavailable</h3>
                <p>We couldn't load the project timeline. Please refresh the page or try again later.</p>
                <button onclick="location.reload()" class="retry-btn">Retry</button>
            </div>
        `;
    }

    get totalPages() {
        return Math.ceil(this.phases.length / this.phasesPerPage);
    }

    get currentPhases() {
        if (this.viewAll) return this.phases;
        const start = this.currentPage * this.phasesPerPage;
        return this.phases.slice(start, start + this.phasesPerPage);
    }

    render() {
        if (!this.container || this.phases.length === 0) return;

        // Clean up old event listeners before re-rendering
        this.cleanupExpandablePhases();

        // Clear existing timeline
        this.container.innerHTML = '';

        // Add TOP navigation controls
        this.container.appendChild(this.createNavigationControls('top'));

        // Render phases
        const phasesContainer = document.createElement('div');
        phasesContainer.className = 'timeline-phases';
        this.currentPhases.forEach(phase => {
            const phaseElement = this.createPhaseElement(phase);
            phasesContainer.appendChild(phaseElement);
        });
        this.container.appendChild(phasesContainer);

        // Add BOTTOM navigation controls
        this.container.appendChild(this.createNavigationControls('bottom'));

        // Trigger Syntax Highlighting
        if (window.Prism) {
            Prism.highlightAll();
        }

        // Initialize expandable phases for newly rendered items
        if (window.initExpandablePhases) {
            window.initExpandablePhases();
        }
    }

    createNavigationControls(position = 'top') {
        const nav = document.createElement('div');
        nav.className = `timeline-nav timeline-nav-${position}`;

        // Progress dots container
        const progressContainer = document.createElement('div');
        progressContainer.className = 'timeline-progress';

        // Progress dots
        for (let i = 0; i < this.totalPages; i++) {
            const dot = document.createElement('button');
            dot.className = `progress-dot ${i === this.currentPage && !this.viewAll ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to phases ${i * this.phasesPerPage + 1}-${Math.min((i + 1) * this.phasesPerPage, this.phases.length)}`);
            dot.addEventListener('click', () => {
                this.viewAll = false;
                this.currentPage = i;
                this.render();
                this.scrollToTimeline();
            });
            progressContainer.appendChild(dot);
        }

        // Progress text
        const progressText = document.createElement('span');
        progressText.className = 'progress-text';
        if (this.viewAll) {
            progressText.textContent = `Viewing all ${this.phases.length} phases`;
        } else {
            const start = this.currentPage * this.phasesPerPage + 1;
            const end = Math.min((this.currentPage + 1) * this.phasesPerPage, this.phases.length);
            progressText.textContent = `Phases ${start}-${end} of ${this.phases.length}`;
        }

        // Button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'timeline-buttons';

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'timeline-btn prev';
        prevBtn.innerHTML = '← Previous';
        prevBtn.disabled = this.currentPage === 0 || this.viewAll;
        prevBtn.addEventListener('click', () => {
            if (this.currentPage > 0) {
                this.currentPage--;
                this.render();
                this.scrollToTimeline();
            }
        });

        // View All / Show Latest button
        const viewAllBtn = document.createElement('button');
        viewAllBtn.className = 'timeline-btn view-all';
        viewAllBtn.textContent = this.viewAll ? 'Show Latest 3' : 'View All';
        viewAllBtn.addEventListener('click', () => {
            if (this.viewAll) {
                this.viewAll = false;
                this.currentPage = this.totalPages - 1; // Go to last page
            } else {
                this.viewAll = true;
            }
            this.render();
            this.scrollToTimeline();
        });

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'timeline-btn next';
        nextBtn.innerHTML = 'Next →';
        nextBtn.disabled = this.currentPage >= this.totalPages - 1 || this.viewAll;
        nextBtn.addEventListener('click', () => {
            if (this.currentPage < this.totalPages - 1) {
                this.currentPage++;
                this.render();
                this.scrollToTimeline();
            }
        });

        // Assemble
        buttonContainer.appendChild(prevBtn);
        buttonContainer.appendChild(viewAllBtn);
        buttonContainer.appendChild(nextBtn);

        nav.appendChild(progressContainer);
        nav.appendChild(progressText);
        nav.appendChild(buttonContainer);

        return nav;
    }

    scrollToTimeline() {
        this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    cleanupExpandablePhases() {
        // Clean up event listeners from previous render
        document.querySelectorAll('.timeline-item').forEach(item => {
            if (item._cleanup) {
                item._cleanup();
                delete item._cleanup;
                delete item.dataset.expandableInitialized;
            }
        });
    }

    createPhaseElement(phase) {
        const item = document.createElement('div');
        item.className = `timeline-item ${phase.type || ''}`;
        item.id = phase.id;

        const marker = document.createElement('div');
        marker.className = 'timeline-marker';

        const content = document.createElement('div');
        content.className = 'timeline-content';

        // Header
        const header = document.createElement('h3');
        header.textContent = `${phase.date} ${phase.emoji || ''}`;
        content.appendChild(header);

        // Title
        const title = document.createElement('p');
        title.innerHTML = `<strong>${phase.title}</strong>`;
        content.appendChild(title);

        // Summary
        if (phase.summary) {
            const summary = document.createElement('p');
            summary.textContent = phase.summary;
            content.appendChild(summary);
        }

        // Problem section (if exists)
        if (phase.problem) {
            const journalEntry = document.createElement('div');
            journalEntry.className = 'journal-entry';

            const problemTitle = document.createElement('p');
            problemTitle.innerHTML = '<strong>The Lesson:</strong>';
            journalEntry.appendChild(problemTitle);

            const problemDesc = document.createElement('p');
            problemDesc.textContent = `"${phase.problem.description}"`;
            journalEntry.appendChild(problemDesc);

            if (phase.problem.rootCause) {
                const rootCause = document.createElement('p');
                rootCause.textContent = phase.solution?.approach || '';
                journalEntry.appendChild(rootCause);
            }

            content.appendChild(journalEntry);
        }

        // Features
        if (phase.solution?.features) {
            const featuresTitle = document.createElement('h4');
            featuresTitle.textContent = 'What We Implemented:';
            content.appendChild(featuresTitle);

            const featuresList = document.createElement('ul');
            featuresList.className = 'update-list';
            phase.solution.features.forEach(feature => {
                const li = document.createElement('li');
                li.innerHTML = feature;
                featuresList.appendChild(li);
            });
            content.appendChild(featuresList);
        }

        // Callout (supports two formats: {icon, title, text} or {type, title, content})
        if (phase.callout) {
            const callout = document.createElement('div');
            callout.className = 'v2-improvement-callout';

            const icon = document.createElement('div');
            icon.className = 'callout-icon';
            // Support both icon field and type-based icons
            const iconMap = {
                insight: '💡',
                warning: '⚠️',
                success: '✅',
                info: 'ℹ️',
                milestone: '🏆',
                architecture: '🏗️'
            };
            icon.textContent = phase.callout.icon || iconMap[phase.callout.type] || '💡';

            const calloutContent = document.createElement('div');
            calloutContent.className = 'callout-content';
            // Support both text field and content field
            const calloutText = phase.callout.text || phase.callout.content || '';
            calloutContent.innerHTML = `<strong>${phase.callout.title || ''}</strong> ${calloutText}`;

            callout.appendChild(icon);
            callout.appendChild(calloutContent);
            content.appendChild(callout);
        }

        // Rich Media (New Structure)
        if (phase.media) {
            if (phase.media.carousel) {
                content.appendChild(this.createImageCarousel(phase.media.carousel));
            }
            if (phase.media.codeComparison) {
                content.appendChild(this.createCodeComparison(phase.media.codeComparison));
            }
            if (phase.media.codeSnippet) {
                content.appendChild(this.createCodeSnippet(phase.media.codeSnippet));
            }
        }

        // Legacy Support (Optional)
        if (phase.codeComparison && !phase.media?.codeComparison) {
            content.appendChild(this.createCodeComparison(phase.codeComparison));
        }
        if (phase.imageCarousel && !phase.media?.carousel) {
            content.appendChild(this.createImageCarousel(phase.imageCarousel));
        }

        // Metrics
        if (phase.metrics) {
            const metricsTitle = document.createElement('h4');
            metricsTitle.textContent = 'By The Numbers:';
            metricsTitle.className = 'dev-only'; // Metrics are dev-only content
            content.appendChild(metricsTitle);

            const metricsGrid = document.createElement('div');
            metricsGrid.className = 'stats-mini-grid dev-only';

            // Dynamic metric rendering - supports any metric key
            // This allows Phase 11/12's custom metrics (crewMembers, priority, etc.) to render
            const metricLabels = {
                linesAdded: 'Lines Added',
                filesChanged: 'Files Changed',
                components: 'New Components',
                timeSpent: 'Time Spent',
                features: 'Features',
                issuesFixed: 'Fixed',
                crewMembers: 'Crew Members',
                suggestions: 'Suggestions',
                priority: 'Priority',
                loreBlocks: 'Lore Blocks',
                crewSignatures: 'Crew Signatures',
                filesModified: 'Files Modified',
                soulRestored: 'Soul Restored'
            };

            Object.keys(phase.metrics).forEach(key => {
                const label = metricLabels[key] || key.replace(/([A-Z])/g, ' $1').trim();
                metricsGrid.appendChild(this.createMetricCard(phase.metrics[key], label));
            });

            content.appendChild(metricsGrid);
        }

        // Sub-entries (for phases like Phase 13 that group multiple ports)
        if (phase.subEntries && phase.subEntries.length > 0) {
            const subEntriesContainer = document.createElement('div');
            subEntriesContainer.className = 'sub-entries-container';

            const subEntriesTitle = document.createElement('h4');
            subEntriesTitle.textContent = 'System Ports:';
            subEntriesContainer.appendChild(subEntriesTitle);

            phase.subEntries.forEach(subEntry => {
                const subItem = document.createElement('div');
                subItem.className = 'sub-entry';
                subItem.id = subEntry.id;

                // Sub-entry header
                const subHeader = document.createElement('div');
                subHeader.className = 'sub-entry-header';
                subHeader.innerHTML = `<span class="sub-entry-emoji">${subEntry.emoji || '📦'}</span> <strong>${subEntry.title}</strong> <span class="sub-entry-date">${subEntry.date || ''}</span>`;
                subItem.appendChild(subHeader);

                // Sub-entry summary
                if (subEntry.summary) {
                    const subSummary = document.createElement('p');
                    subSummary.className = 'sub-entry-summary';
                    subSummary.textContent = subEntry.summary;
                    subItem.appendChild(subSummary);
                }

                // Sub-entry features
                if (subEntry.features && subEntry.features.length > 0) {
                    const featuresList = document.createElement('ul');
                    featuresList.className = 'sub-entry-features';
                    subEntry.features.forEach(feature => {
                        const li = document.createElement('li');
                        li.innerHTML = feature;
                        featuresList.appendChild(li);
                    });
                    subItem.appendChild(featuresList);
                }

                // Sub-entry metrics (mini version)
                if (subEntry.metrics) {
                    const metricsRow = document.createElement('div');
                    metricsRow.className = 'sub-entry-metrics dev-only';
                    Object.entries(subEntry.metrics).forEach(([key, value]) => {
                        const metric = document.createElement('span');
                        metric.className = 'sub-metric';
                        const label = key.replace(/([A-Z])/g, ' $1').trim();
                        metric.innerHTML = `<strong>${value}</strong> ${label}`;
                        metricsRow.appendChild(metric);
                    });
                    subItem.appendChild(metricsRow);
                }

                // Sub-entry code comparison
                if (subEntry.codeComparison) {
                    subItem.appendChild(this.createCodeComparison(subEntry.codeComparison));
                }

                subEntriesContainer.appendChild(subItem);
            });

            content.appendChild(subEntriesContainer);
        }

        item.appendChild(marker);
        item.appendChild(content);
        return item;
    }

    createMetricCard(value, label) {
        const card = document.createElement('div');
        card.className = 'stat-mini';

        const num = document.createElement('span');
        num.className = 'stat-num';
        num.textContent = value;

        const desc = document.createElement('span');
        desc.className = 'stat-desc';
        desc.textContent = label;

        card.appendChild(num);
        card.appendChild(desc);
        return card;
    }

    createImageCarousel(images) {
        const container = document.createElement('div');
        container.className = 'timeline-carousel-container';

        const carousel = document.createElement('div');
        carousel.className = 'timeline-carousel';

        images.forEach(imgData => {
            const item = document.createElement('div');
            item.className = 'carousel-item';

            const img = document.createElement('img');
            img.src = imgData.url || imgData.src;
            img.alt = imgData.caption || 'Screenshot';
            img.loading = 'lazy'; // Lazy load images

            const caption = document.createElement('span');
            caption.className = 'carousel-label';
            caption.textContent = imgData.caption;

            item.appendChild(img);
            item.appendChild(caption);
            carousel.appendChild(item);
        });

        container.appendChild(carousel);
        return container;
    }

    createCodeComparison(comparison) {
        const container = document.createElement('div');
        container.className = 'code-comparison';

        // Before Block
        if (comparison.before) {
            const beforeWindow = document.createElement('div');
            beforeWindow.className = 'code-window';

            const header = document.createElement('div');
            header.className = 'code-header';
            header.innerHTML = `<span>${comparison.before.title || 'Before'}</span><span class="code-badge badge-chaos">${comparison.before.badge || 'CHAOS'}</span>`;

            const content = document.createElement('div');
            content.className = 'code-content';

            const pre = document.createElement('pre');
            const code = document.createElement('code');
            code.className = `language-${comparison.before.lang || 'javascript'}`;
            code.textContent = comparison.before.code;

            pre.appendChild(code);
            content.appendChild(pre);

            beforeWindow.appendChild(header);
            beforeWindow.appendChild(content);
            container.appendChild(beforeWindow);
        }

        // After Block
        if (comparison.after) {
            const afterWindow = document.createElement('div');
            afterWindow.className = 'code-window';

            const header = document.createElement('div');
            header.className = 'code-header';
            header.innerHTML = `<span>${comparison.after.title || 'After'}</span><span class="code-badge badge-order">${comparison.after.badge || 'ORDER'}</span>`;

            const content = document.createElement('div');
            content.className = 'code-content';

            const pre = document.createElement('pre');
            const code = document.createElement('code');
            code.className = `language-${comparison.after.lang || 'typescript'}`;
            code.textContent = comparison.after.code;

            pre.appendChild(code);
            content.appendChild(pre);

            afterWindow.appendChild(header);
            afterWindow.appendChild(content);
            container.appendChild(afterWindow);
        }

        return container;
    }

    createCodeSnippet(snippet) {
        const container = document.createElement('div');
        container.className = 'code-snippet-container';

        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.className = `language-${snippet.lang || 'typescript'}`;
        code.textContent = snippet.code;

        pre.appendChild(code);
        container.appendChild(pre);

        if (snippet.caption) {
            const caption = document.createElement('div');
            caption.className = 'code-caption';
            caption.textContent = snippet.caption;
            container.appendChild(caption);
        }

        return container;
    }
}


// Initialize timeline renderer
document.addEventListener('DOMContentLoaded', () => {
    const timelineRenderer = new TimelineRenderer('#timeline-container');
    timelineRenderer.loadTimeline();
});

// ==========================================
// PHASE NAVIGATION
// ==========================================
const phaseNav = document.getElementById('phase-nav');
const phaseLinks = document.querySelectorAll('.phase-nav-link');

// Function to check and update active phase
function updateActivePhaseOnScroll() {
    updateActivePhase();
}

// Phase Nav visibility is controlled by IntersectionObserver (Journey section only)
// We just need to update the active dot on scroll
window.addEventListener('scroll', updateActivePhaseOnScroll);

// Initialize active phase on load
setTimeout(updateActivePhase, 100);

// Journey-only visibility: Show Phase Nav only when Journey section is visible
const journeySectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            phaseNav.classList.add('visible');
        } else {
            phaseNav.classList.remove('visible');
            // Also collapse and clear timer when leaving Journey section
            phaseNav.classList.remove('expanded');
            if (typeof phaseNavAutoCloseTimer !== 'undefined') {
                clearTimeout(phaseNavAutoCloseTimer);
            }
        }
    });
}, {
    threshold: 0, // Trigger as soon as 1px is visible
    rootMargin: '0px'
});

const journeySection = document.querySelector('.journey-section');
if (journeySection && phaseNav) {
    journeySectionObserver.observe(journeySection);
}

// Click toggle support for mobile/touch (works alongside hover for desktop)
let phaseNavAutoCloseTimer = null;

if (phaseNav) {
    phaseNav.addEventListener('click', (e) => {
        // Don't toggle if clicking a phase link
        if (e.target.closest('.phase-nav-link')) {
            // Close immediately when selecting a phase
            phaseNav.classList.remove('expanded');
            updateAriaExpanded();
            clearTimeout(phaseNavAutoCloseTimer);
            return;
        }

        // Toggle expanded state
        phaseNav.classList.toggle('expanded');
        updateAriaExpanded();

        // Clear existing timer
        clearTimeout(phaseNavAutoCloseTimer);

        // If now expanded, set auto-close timer (3 seconds)
        if (phaseNav.classList.contains('expanded')) {
            phaseNavAutoCloseTimer = setTimeout(() => {
                phaseNav.classList.remove('expanded');
                updateAriaExpanded();
            }, 3000);
        }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!phaseNav.contains(e.target)) {
            phaseNav.classList.remove('expanded');
            updateAriaExpanded();
            clearTimeout(phaseNavAutoCloseTimer);
        }
    });

    // Clear timer on hover (desktop) - keeps it open while hovering
    phaseNav.addEventListener('mouseenter', () => {
        clearTimeout(phaseNavAutoCloseTimer);
    });

    // Restart timer when mouse leaves (if still expanded via click)
    phaseNav.addEventListener('mouseleave', () => {
        if (phaseNav.classList.contains('expanded')) {
            phaseNavAutoCloseTimer = setTimeout(() => {
                phaseNav.classList.remove('expanded');
                updateAriaExpanded();
            }, 3000);
        }
    });

    // Keyboard support for accessibility
    const header = phaseNav.querySelector('.phase-nav-header');

    if (header) {
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                phaseNav.classList.toggle('expanded');
                updateAriaExpanded();

                // Clear existing timer
                clearTimeout(phaseNavAutoCloseTimer);

                // Start timer if expanded
                if (phaseNav.classList.contains('expanded')) {
                    phaseNavAutoCloseTimer = setTimeout(() => {
                        phaseNav.classList.remove('expanded');
                        updateAriaExpanded();
                    }, 3000);
                }
            }
        });
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && phaseNav.classList.contains('expanded')) {
            phaseNav.classList.remove('expanded');
            updateAriaExpanded();
            clearTimeout(phaseNavAutoCloseTimer);
        }
    });

    // Update ARIA expanded state
    function updateAriaExpanded() {
        const isExpanded = phaseNav.classList.contains('expanded');
        phaseNav.setAttribute('aria-expanded', isExpanded);
    }
}

// Smooth scroll to phase
phaseLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update active phase indicator
function updateActivePhase() {
    const phases = [
        { id: 'phase-1', link: document.querySelector('[data-phase="1"]') },
        { id: 'phase-2', link: document.querySelector('[data-phase="2"]') },
        { id: 'phase-3', link: document.querySelector('[data-phase="3"]') },
        { id: 'phase-4', link: document.querySelector('[data-phase="4"]') },
        { id: 'phase-5', link: document.querySelector('[data-phase="5"]') },
        { id: 'phase-6', link: document.querySelector('[data-phase="6"]') },
        { id: 'phase-7', link: document.querySelector('[data-phase="7"]') },
        { id: 'phase-8', link: document.querySelector('[data-phase="8"]') },
        { id: 'phase-9', link: document.querySelector('[data-phase="9"]') },
        { id: 'phase-10', link: document.querySelector('[data-phase="10"]') }
    ];

    const scrollPos = window.scrollY + window.innerHeight / 3;

    phases.forEach(phase => {
        const element = document.getElementById(phase.id);
        if (!element || !phase.link) return;

        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementBottom = elementTop + rect.height;

        if (scrollPos >= elementTop && scrollPos < elementBottom) {
            phase.link.classList.add('active');
        } else {
            phase.link.classList.remove('active');
        }
    });
}

// ==========================================
// V3 POLISH PROTOCOL - MICHELIN TREATMENT
// ==========================================

// Story/Dev Mode Toggle
(function initViewModeToggle() {
    const body = document.body;
    const sectionContent = document.querySelector('.section-content');

    if (!sectionContent) return;

    // Create toggle UI
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'view-mode-toggle';
    toggleContainer.innerHTML = `
        <button class="mode-btn" data-mode="story" aria-label="Story Mode">
            📖 Story
        </button>
        <button class="mode-btn" data-mode="dev" aria-label="Developer Mode">
            🔧 Dev
        </button>
    `;

    // Insert at top of section
    sectionContent.prepend(toggleContainer);

    // Load saved preference or default to story
    const savedMode = localStorage.getItem('uv7-view-mode') || 'story';
    body.dataset.viewMode = savedMode;
    updateToggleButtons(savedMode);

    // Toggle button click handlers
    toggleContainer.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            body.dataset.viewMode = mode;
            localStorage.setItem('uv7-view-mode', mode);
            updateToggleButtons(mode);
        });
    });

    function updateToggleButtons(mode) {
        toggleContainer.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
            btn.setAttribute('aria-selected', btn.dataset.mode === mode);
        });
    }

    // Keyboard shortcut: S to toggle
    document.addEventListener('keydown', (e) => {
        const el = document.activeElement;
        const isTyping = el && (
            el.tagName === 'INPUT' ||
            el.tagName === 'TEXTAREA' ||
            el.isContentEditable
        );

        if (e.key.toLowerCase() === 's' && !isTyping) {
            e.preventDefault();
            const currentMode = body.dataset.viewMode;
            const newMode = currentMode === 'story' ? 'dev' : 'story';
            body.dataset.viewMode = newMode;
            localStorage.setItem('uv7-view-mode', newMode);
            updateToggleButtons(newMode);
        }
    });
})();

// RAF Slider Optimization
(function optimizeSlider() {
    let rafId = null;
    let ticking = false;

    // Replace existing mousemove listener
    const oldMouseMove = window.onmousemove;
    window.removeEventListener('mousemove', oldMouseMove);

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        if (!ticking) {
            rafId = requestAnimationFrame(() => {
                const x = e.clientX;
                const width = window.innerWidth;
                let pct = (x / width) * 100;
                pct = Math.max(0, Math.min(100, pct));
                updateSlider(pct);
                ticking = false;
            });
            ticking = true;
        }
    });

    // Same for touch
    const oldTouchMove = window.ontouchmove;
    window.removeEventListener('touchmove', oldTouchMove);

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        if (!ticking) {
            rafId = requestAnimationFrame(() => {
                const touch = e.touches[0];
                const x = touch.clientX;
                const width = window.innerWidth;
                let pct = (x / width) * 100;
                pct = Math.max(0, Math.min(100, pct));
                updateSlider(pct);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: false });
})();

// Keyboard Shortcuts Help Modal
(function initKeyboardShortcuts() {
    const shortcuts = {
        'Arrow Keys': 'Control comparison slider',
        'S': 'Toggle Story/Dev mode',
        'Esc': 'Close expanded phase',
        '?': 'Show keyboard shortcuts'
    };

    let helpModal = null;

    document.addEventListener('keydown', (e) => {
        if (e.key === '?') {
            e.preventDefault();
            showHelp();
        } else if (e.key === 'Escape' && helpModal) {
            closeHelp();
        }
    });

    function showHelp() {
        if (helpModal) return;

        helpModal = document.createElement('div');
        helpModal.className = 'keyboard-help-modal';
        helpModal.innerHTML = `
            <div class="help-content">
                <h3>Keyboard Shortcuts</h3>
                <ul class="shortcuts-list">
                    ${Object.entries(shortcuts).map(([key, desc]) => `
                        <li><kbd>${key}</kbd><span>${desc}</span></li>
                    `).join('')}
                </ul>
                <button class="close-help">Close</button>
            </div>
        `;

        document.body.appendChild(helpModal);

        helpModal.querySelector('.close-help').addEventListener('click', closeHelp);
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) closeHelp();
        });
    }

    function closeHelp() {
        if (helpModal) {
            helpModal.remove();
            helpModal = null;
        }
    }
})();

// Context-Aware Background Code Snippets
(function initContextAwareBackground() {
    const chaosSnippets = [
        "function forceUpdate() { while(true) { try { render() } catch(e) { ignore() } } }",
        "// TODO: Fix this later... maybe...",
        "if (user.isSad) { makeHappy(user); } else { breakStuff(); }",
        "$('body').on('click', function() { alert('Why?'); });",
        "return null; // I give up",
        "try { everything() } catch (nothing) {}",
        "// Logic is overrated"
    ];

    const orderSnippets = [
        "class StateManager { private state: Map<string, any>; }",
        "interface EventPayload { type: string; data: unknown; }",
        "// TypeScript strict mode enabled",
        "export const EventBus = new EventEmitter();",
        "private readonly config: Readonly<Config>;",
        "test('should handle edge cases', () => { expect(result).toBe(expected); });",
        "// 100% type coverage achieved"
    ];

    window.currentSnippets = chaosSnippets;

    // Update snippets based on scroll position
    const phaseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const phaseType = entry.target.dataset.type || 'chaos-entry';
                window.currentSnippets = phaseType.includes('order') ? orderSnippets : chaosSnippets;
            }
        });
    }, { threshold: 0.5 });

    // Observe all timeline items
    setTimeout(() => {
        document.querySelectorAll('.timeline-item').forEach(item => {
            phaseObserver.observe(item);
        });
    }, 1000);
})();

// Console Easter Egg
console.log('%c🎮 UV7 Showcase', 'font-size: 24px; font-weight: bold; color: #00ff88;');
console.log('%cBuilt with AI collaboration. 15 phases. 144+ hours. Zero regrets.', 'color: #888;');
console.log('%cWant to see the code? Check the repo: https://github.com/chicaron82/VN-Project', 'color: #00ccff;');
console.log('%c💡 Tip: Press "S" to toggle Story/Dev mode | Press "?" for keyboard shortcuts', 'color: #ffaa00;');

console.log('%c\n🔧 V3 Polish Protocol Active', 'font-size: 16px; font-weight: bold; color: #00ccff;');
console.log('%cFeatures: Story/Dev toggle, RAF slider, expandable phases, context-aware backgrounds', 'color: #888;');
console.log('%cQuality: MICHELIN ⭐⭐⭐', 'color: #00ff88; font-weight: bold;');

// Expandable Timeline Phases
window.initExpandablePhases = function () {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const currentViewMode = document.body.dataset.viewMode || 'story';

    timelineItems.forEach((item, index) => {
        // Skip if already initialized
        if (item.dataset.expandableInitialized === 'true') return;
        item.dataset.expandableInitialized = 'true';

        // Find the content wrapper
        const content = item.querySelector('.timeline-content');
        if (!content) return;

        // Get all children after the summary (first 3 elements: h3, title, summary)
        const children = Array.from(content.children);
        if (children.length <= 3) return; // Nothing to collapse

        // Create details wrapper
        const details = document.createElement('div');
        details.className = 'timeline-details';

        // Move all children after summary into details
        children.slice(3).forEach(child => {
            details.appendChild(child);
        });

        // Create toggle button
        const toggle = document.createElement('button');
        toggle.className = 'expand-toggle';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Expand phase details');
        toggle.innerHTML = '<span class="chevron">▾</span> View details';

        // Insert toggle and details
        content.appendChild(toggle);
        content.appendChild(details);

        // Set initial state based on current view mode
        if (currentViewMode === 'dev') {
            item.classList.add('expanded');
            toggle.setAttribute('aria-expanded', 'true');
            toggle.innerHTML = '<span class="chevron">▴</span> Hide details';
        }

        // Toggle handler
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = item.classList.toggle('expanded');
            toggle.setAttribute('aria-expanded', isExpanded);
            toggle.innerHTML = isExpanded
                ? '<span class="chevron">▴</span> Hide details'
                : '<span class="chevron">▾</span> View details';

            // Scroll into view if expanding
            if (isExpanded) {
                setTimeout(() => {
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            }
        });

        // Keyboard support
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
        });

        // ESC to close
        const escHandler = (e) => {
            if (e.key === 'Escape' && item.classList.contains('expanded')) {
                item.classList.remove('expanded');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.innerHTML = '<span class="chevron">▾</span> View details';
            }
        };
        document.addEventListener('keydown', escHandler);

        // Auto-expand/collapse based on view mode changes
        const body = document.body;
        const observer = new MutationObserver(() => {
            if (body.dataset.viewMode === 'dev') {
                item.classList.add('expanded');
                toggle.setAttribute('aria-expanded', 'true');
                toggle.innerHTML = '<span class="chevron">▴</span> Hide details';
            } else if (body.dataset.viewMode === 'story') {
                item.classList.remove('expanded');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.innerHTML = '<span class="chevron">▾</span> View details';
            }
        });

        observer.observe(body, { attributes: true, attributeFilter: ['data-view-mode'] });

        // Store cleanup function to prevent memory leaks
        item._cleanup = () => {
            document.removeEventListener('keydown', escHandler);
            observer.disconnect();
        };
    });

    console.log('📖 Expandable timeline phases initialized');
};

// Initial call on page load
(function () {
    setTimeout(() => {
        window.initExpandablePhases();
    }, 1500); // Wait for timeline renderer to finish
})();

// ==========================================
// COLLAPSIBLE TIMELINE - PROGRESSIVE DISCLOSURE
// Show 3 latest phases by default with expand option
// ==========================================
(function initCollapsibleTimeline() {
    // Wait for timeline to be fully rendered
    setTimeout(() => {
        const timelineContainer = document.getElementById('timeline-container');
        if (!timelineContainer) return;

        const timelineItems = Array.from(timelineContainer.querySelectorAll('.timeline-item'));
        if (timelineItems.length <= 3) return; // No need to collapse if 3 or fewer items

        const VISIBLE_COUNT = 3;
        const hiddenCount = timelineItems.length - VISIBLE_COUNT;

        // Hide all but the first 3 items
        timelineItems.forEach((item, index) => {
            if (index >= VISIBLE_COUNT) {
                item.classList.add('timeline-item-hidden');
                item.style.display = 'none';
            }
        });

        // Create expand/collapse button
        const expandButton = document.createElement('button');
        expandButton.className = 'timeline-expand-btn';
        expandButton.innerHTML = `
            <span class="expand-icon">▾</span>
            <span class="expand-text">Show Full Timeline (${hiddenCount} more phases)</span>
        `;
        expandButton.setAttribute('aria-expanded', 'false');
        expandButton.setAttribute('aria-label', `Show ${hiddenCount} more timeline phases`);

        // Insert button after visible items
        const insertAfter = timelineItems[VISIBLE_COUNT - 1];
        insertAfter.parentNode.insertBefore(expandButton, insertAfter.nextSibling);

        // Toggle functionality
        let isExpanded = false;
        expandButton.addEventListener('click', () => {
            isExpanded = !isExpanded;

            timelineItems.forEach((item, index) => {
                if (index >= VISIBLE_COUNT) {
                    if (isExpanded) {
                        item.classList.remove('timeline-item-hidden');
                        item.style.display = '';
                        // Stagger animation
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, (index - VISIBLE_COUNT) * 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateX(-30px)';
                        setTimeout(() => {
                            item.classList.add('timeline-item-hidden');
                            item.style.display = 'none';
                        }, 300);
                    }
                }
            });

            // Update button
            expandButton.setAttribute('aria-expanded', isExpanded);
            expandButton.innerHTML = isExpanded
                ? '<span class="expand-icon">▴</span><span class="expand-text">Show Less</span>'
                : `<span class="expand-icon">▾</span><span class="expand-text">Show Full Timeline (${hiddenCount} more phases)</span>`;

            // Scroll to button if collapsing
            if (!isExpanded) {
                setTimeout(() => {
                    expandButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 350);
            }
        });

        // Keyboard support
        expandButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                expandButton.click();
            }
        });

        // Remember state in sessionStorage
        const savedState = sessionStorage.getItem('timeline.expanded');
        if (savedState === 'true') {
            expandButton.click(); // Trigger expand
        }

        // Save state on change
        expandButton.addEventListener('click', () => {
            sessionStorage.setItem('timeline.expanded', isExpanded);
        });

        console.log('📚 Collapsible timeline initialized');
    }, 2000); // Wait for timeline renderer + expandable phases
})();

