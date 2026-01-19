
/**
 * ScrollAnimator.js
 * Handles IntersectionObservers for fade-ins, timeline items, and stats animations.
 */
export function initScrollAnimations() {

    // 1. General Section Fade-In
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Already handled by CSS 'visible' classes in some cases, but sticking to script.js parity for now
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    document.querySelectorAll('section').forEach(section => {
        // Skip journey-section to prevent clipping issues
        if (section.classList.contains('journey-section')) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
            return;
        }

        // Initial state logic handled by CSS usually, but script.js did it manually.
        // We will trust the existing CSS transitions or inline styles set by script.js logic.
        // For strict parity, we re-implement the "check visibility on load" logic.
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        } else {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            sectionObserver.observe(section);
        }
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });

    // 2. Timeline Items Animation
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';

                // Context Aware Background Trigger
                if (entry.target.id && window.updateBackgroundContext) {
                    window.updateBackgroundContext(entry.target.id);
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
            if (item.id && window.updateBackgroundContext) {
                window.updateBackgroundContext(item.id);
            }
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            timelineObserver.observe(item);
        }
    });

    // 3. Counting Stats Animation
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target, 10);
                animateCountUp(entry.target, target);

                const card = entry.target.closest('.stat-card');
                if (card) card.classList.add('animated');

                countObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach(num => countObserver.observe(num));

    // 4. Metric Bars
    const metricObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Restore the width from where we stashed it? 
                // script.js logic read explicit style.width. 
                // We need to ensure we don't zero it out before reading it if this runs multiple times or late.
                // Assuming HTML has style="width: 80%"
                const targetWidth = entry.target.getAttribute('data-width') || entry.target.style.width;
                if (!entry.target.getAttribute('data-width')) entry.target.setAttribute('data-width', targetWidth);

                entry.target.style.width = targetWidth; // Apply animation
                metricObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.metric-fill').forEach(bar => {
        // Stash width and reset to 0
        const w = bar.style.width;
        if (w && w !== '0%') {
            bar.setAttribute('data-width', w);
            bar.style.width = '0%';
            metricObserver.observe(bar);
        }
    });

    // 5. Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = `${scrollPercent}%`;
        });
    }

    // 6. Phase Nav active state
    // Just run this on scroll
    window.addEventListener('scroll', updateActivePhase);
    setTimeout(updateActivePhase, 100);

    // 7. Clickable Cards (Navigation)
    document.querySelectorAll('.card.clickable[data-section]').forEach(card => {
        card.addEventListener('click', () => {
            const sectionClass = card.dataset.section;
            const target = document.querySelector(`.${sectionClass}`);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function animateCountUp(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    requestAnimationFrame(update);
}

function updateActivePhase() {
    // Only looking for specific 10 phases as per script.js parity, 
    // or we could make this dynamic. Sticking to parity.
    const phases = [];
    for (let i = 1; i <= 10; i++) {
        const link = document.querySelector(`[data-phase="${i}"]`);
        const id = `phase-${i}`;
        if (link) phases.push({ id, link });
    }

    const scrollPos = window.scrollY + window.innerHeight / 3;

    phases.forEach(phase => {
        const element = document.getElementById(phase.id);
        if (!element) return;

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
