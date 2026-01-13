
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
