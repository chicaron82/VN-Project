
/**
 * ScrollAnimator.ts
 * Handles IntersectionObservers for fade-ins, timeline items, and stats animations.
 */
export function initScrollAnimations(): void {

    // 1. General Section Fade-In
    const sectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
            // Already handled by CSS 'visible' classes in some cases, but sticking to script.js parity for now
            if (entry.isIntersecting) {
                (entry.target as HTMLElement).style.opacity = '1';
                (entry.target as HTMLElement).style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    document.querySelectorAll('section').forEach((section: Element) => {
        const sectionEl = section as HTMLElement;
        // Skip journey-section to prevent clipping issues
        if (section.classList.contains('journey-section')) {
            sectionEl.style.opacity = '1';
            sectionEl.style.transform = 'translateY(0)';
            return;
        }

        // Initial state logic handled by CSS usually, but script.js did it manually.
        // We will trust the existing CSS transitions or inline styles set by script.js logic.
        // For strict parity, we re-implement the "check visibility on load" logic.
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            sectionEl.style.opacity = '1';
            sectionEl.style.transform = 'translateY(0)';
        } else {
            sectionEl.style.opacity = '0';
            sectionEl.style.transform = 'translateY(30px)';
            sectionObserver.observe(section);
        }
        sectionEl.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });

    // 2. Timeline Items Animation
    const timelineObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
            if (entry.isIntersecting) {
                (entry.target as HTMLElement).style.opacity = '1';
                (entry.target as HTMLElement).style.transform = 'translateX(0)';

                // Context Aware Background Trigger
                if ((entry.target as HTMLElement).id && window.updateBackgroundContext) {
                    window.updateBackgroundContext((entry.target as HTMLElement).id);
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const observeTimelineItems = (): void => {
        document.querySelectorAll('.timeline-item').forEach((item: Element, index: number) => {
            const itemEl = item as HTMLElement;
            // Avoid double-observing
            if (itemEl.dataset.observed) return;
            itemEl.dataset.observed = 'true';

            const rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                itemEl.style.opacity = '1';
                itemEl.style.transform = 'translateX(0)';
                if (itemEl.id && window.updateBackgroundContext) {
                    window.updateBackgroundContext(itemEl.id);
                }
            } else {
                itemEl.style.opacity = '0';
                itemEl.style.transform = 'translateX(-30px)';
                itemEl.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
                timelineObserver.observe(item);
            }
        });
    };

    // Initial observation
    observeTimelineItems();

    // Listen for dynamic content updates
    window.addEventListener('uv7-content-updated', () => {
        observeTimelineItems();
        // Also re-check stats/metrics if needed
    });

    // 3. Counting Stats Animation
    const countObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
            if (entry.isIntersecting) {
                const targetValue = parseInt((entry.target as HTMLElement).dataset.target || '0', 10);
                animateCountUp(entry.target as HTMLElement, targetValue);

                const card = entry.target.closest('.stat-card');
                if (card) card.classList.add('animated');

                countObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach((num: Element) => countObserver.observe(num));

    // 4. Metric Bars
    const metricObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
            if (entry.isIntersecting) {
                const targetEl = entry.target as HTMLElement;
                // Restore the width from where we stashed it?
                // script.js logic read explicit style.width.
                // We need to ensure we don't zero it out before reading it if this runs multiple times or late.
                // Assuming HTML has style="width: 80%"
                const targetWidth = targetEl.getAttribute('data-width') || targetEl.style.width;
                if (!targetEl.getAttribute('data-width')) targetEl.setAttribute('data-width', targetWidth);

                targetEl.style.width = targetWidth; // Apply animation
                metricObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.metric-fill').forEach((bar: Element) => {
        const barEl = bar as HTMLElement;
        // Stash width and reset to 0
        const w = barEl.style.width;
        if (w && w !== '0%') {
            barEl.setAttribute('data-width', w);
            barEl.style.width = '0%';
            metricObserver.observe(bar);
        }
    });

    // 5. Scroll Progress Bar with Section-Aware Colors
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        const updateScrollProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = `${scrollPercent}%`;

            // Determine which section is currently visible
            const panels = document.querySelectorAll('.tab-panel');
            let currentSection = 'home';
            
            panels.forEach((panel) => {
                const rect = panel.getBoundingClientRect();
                // Section is "active" if its top is in the upper third of viewport
                if (rect.top <= window.innerHeight / 3 && rect.bottom >= 0) {
                    const panelId = panel.getAttribute('data-panel');
                    if (panelId) currentSection = panelId;
                }
            });

            scrollProgress.setAttribute('data-section', currentSection);
        };

        window.addEventListener('scroll', updateScrollProgress);
        updateScrollProgress(); // Initial call
    }

    // 6. Phase Nav active state
    // Just run this on scroll
    window.addEventListener('scroll', updateActivePhase);
    setTimeout(updateActivePhase, 100);

    // 7. Clickable Cards (Navigation)
    document.querySelectorAll('.card.clickable[data-section]').forEach((card: Element) => {
        card.addEventListener('click', () => {
            const sectionClass = (card as HTMLElement).dataset.section;
            const target = document.querySelector(`.${sectionClass}`);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function animateCountUp(element: HTMLElement, target: number, duration: number = 2000): void {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime: number): void {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        element.textContent = current.toString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toString();
        }
    }
    requestAnimationFrame(update);
}

interface PhaseLink {
    id: string;
    link: Element;
}

function updateActivePhase(): void {
    // Only looking for specific 10 phases as per script.js parity,
    // or we could make this dynamic. Sticking to parity.
    const phases: PhaseLink[] = [];
    for (let i = 1; i <= 10; i++) {
        const link = document.querySelector(`[data-phase="${i}"]`);
        const id = `phase-${i}`;
        if (link) phases.push({ id, link });
    }

    const scrollPos = window.scrollY + window.innerHeight / 3;

    phases.forEach((phase: PhaseLink) => {
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
