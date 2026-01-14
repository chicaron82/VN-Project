
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

// ==========================================
// TIMELINE RENDERER
// ==========================================
class TimelineRenderer {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.phases = [];
    }

    async loadTimeline() {
        try {
            // Prioritize window.TIMELINE_DATA (loaded via script tag) to avoid CORS issues with file:// protocol
            if (window.TIMELINE_DATA && window.TIMELINE_DATA.phases) {
                this.phases = window.TIMELINE_DATA.phases;
                this.render();
                return;
            }

            // Fallback to fetch for server environments
            const response = await fetch('timeline.json');
            const data = await response.json();
            this.phases = data.phases;
            this.render();
        } catch (error) {
            console.error('Failed to load timeline:', error);
            console.error('Make sure timeline-data.js is loaded or you\'re using a web server to view this page.');
        }
    }

    render() {
        if (!this.container || this.phases.length === 0) return;

        // Clear existing timeline (if any)
        this.container.innerHTML = '';

        // Render each phase
        this.phases.forEach(phase => {
            const phaseElement = this.createPhaseElement(phase);
            this.container.appendChild(phaseElement);
        });

        // Trigger Syntax Highlighting
        if (window.Prism) {
            Prism.highlightAll();
        }
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

        // Callout
        if (phase.callout) {
            const callout = document.createElement('div');
            callout.className = 'v2-improvement-callout';

            const icon = document.createElement('div');
            icon.className = 'callout-icon';
            icon.textContent = phase.callout.icon;

            const calloutContent = document.createElement('div');
            calloutContent.className = 'callout-content';
            calloutContent.innerHTML = `<strong>${phase.callout.title}</strong> ${phase.callout.text}`;

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

// Function to check and update phase nav visibility
function updatePhaseNavVisibility() {
    const journeySection = document.querySelector('.journey-section');
    if (!journeySection || !phaseNav) return;

    const rect = journeySection.getBoundingClientRect();

    // Show nav when Journey section header is visible at top of screen
    // Hide when completely scrolled past the section
    const sectionTop = rect.top;
    const sectionBottom = rect.bottom;
    const viewportHeight = window.innerHeight;

    // Visible if: section has entered viewport OR we're inside it
    const isVisible = sectionTop < viewportHeight && sectionBottom > 0;

    if (isVisible) {
        phaseNav.classList.add('visible');
    } else {
        phaseNav.classList.remove('visible');
    }

    // Update active phase based on scroll position
    updateActivePhase();
}

// Check visibility on scroll
window.addEventListener('scroll', updatePhaseNavVisibility);

// IMPORTANT: Check visibility on page load (in case user refreshes mid-page)
// Wait for timeline to render first
setTimeout(updatePhaseNavVisibility, 2000);

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
console.log('%cBuilt with AI collaboration. 11 phases. 72 hours. Zero regrets.', 'color: #888;');
console.log('%cWant to see the code? Check the repo: https://github.com/chicaron82/VN-Project', 'color: #00ccff;');
console.log('%c💡 Tip: Press "S" to toggle Story/Dev mode | Press "?" for keyboard shortcuts', 'color: #ffaa00;');

console.log('%c\n🔧 V3 Polish Protocol Active', 'font-size: 16px; font-weight: bold; color: #00ccff;');
console.log('%cFeatures: Story/Dev toggle, RAF slider, expandable phases, context-aware backgrounds', 'color: #888;');
console.log('%cQuality: MICHELIN ⭐⭐⭐', 'color: #00ff88; font-weight: bold;');

// Expandable Timeline Phases
(function initExpandablePhases() {
    // Wait for timeline to be rendered
    setTimeout(() => {
        const timelineItems = document.querySelectorAll('.timeline-item');

        timelineItems.forEach((item, index) => {
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
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && item.classList.contains('expanded')) {
                    item.classList.remove('expanded');
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.innerHTML = '<span class="chevron">▾</span> View details';
                }
            });

            // Auto-expand in Dev mode
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
        });

        console.log('📖 Expandable timeline phases initialized');
    }, 1500); // Wait for timeline renderer to finish
})();
