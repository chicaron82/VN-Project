
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
            // Use global TIMELINE_DATA if available (loaded via script tag)
            if (window.TIMELINE_DATA) {
                this.phases = window.TIMELINE_DATA.phases;
                this.render();
                return;
            }

            // Fallback: try to fetch (works with web server)
            const response = await fetch('timeline.json');
            const data = await response.json();
            this.phases = data.phases;
            this.render();
        } catch (error) {
            console.error('Failed to load timeline:', error);
            // Fallback: timeline already in HTML
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

        // Metrics
        if (phase.metrics) {
            const metricsTitle = document.createElement('h4');
            metricsTitle.textContent = 'By The Numbers:';
            content.appendChild(metricsTitle);

            const metricsGrid = document.createElement('div');
            metricsGrid.className = 'stats-mini-grid';

            if (phase.metrics.linesAdded) {
                metricsGrid.appendChild(this.createMetricCard(phase.metrics.linesAdded, 'Lines Added'));
            }
            if (phase.metrics.filesChanged) {
                metricsGrid.appendChild(this.createMetricCard(phase.metrics.filesChanged, 'Files Changed'));
            }
            if (phase.metrics.components) {
                metricsGrid.appendChild(this.createMetricCard(phase.metrics.components, 'New Components'));
            }
            if (phase.metrics.timeSpent) {
                metricsGrid.appendChild(this.createMetricCard(phase.metrics.timeSpent, 'Time Spent'));
            }

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

// Show/hide phase nav based on scroll position
window.addEventListener('scroll', () => {
    const journeySection = document.querySelector('.journey-section');
    if (!journeySection || !phaseNav) return;

    const rect = journeySection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
        phaseNav.classList.add('visible');
    } else {
        phaseNav.classList.remove('visible');
    }

    // Update active phase based on scroll position
    updateActivePhase();
});

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
