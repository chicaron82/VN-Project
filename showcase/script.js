
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
        // Set initial state
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

        // Observe for intersection
        fadeInObserver.observe(section);
    });

    // Animate timeline items individually
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
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
        }, { threshold: 0.2 });

        itemObserver.observe(item);
    });

    // Animate stat cards with stagger
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
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
    });
});

