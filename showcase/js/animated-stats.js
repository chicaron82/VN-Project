/**
 * Animated Stats and Metrics
 * Handles counting up numbers and animating progress bars when they scroll into view
 */

class AnimatedStats {
    constructor() {
        this.stats = document.querySelectorAll('.stat-number');
        this.bars = document.querySelectorAll('.metric-fill');
        this.init();
    }

    init() {
        const options = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('stat-number')) {
                        this.animateNumber(entry.target);
                    } else if (entry.target.classList.contains('metric-fill')) {
                        this.animateBar(entry.target);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.stats.forEach(stat => observer.observe(stat));
        this.bars.forEach(bar => {
            // Store original width and set to 0 initially
            const targetWidth = bar.style.width;
            bar.dataset.width = targetWidth;
            bar.style.width = '0%';
            observer.observe(bar);
        });
    }

    animateNumber(element) {
        const target = parseInt(element.dataset.target);
        if (isNaN(target)) return;

        const duration = 2000; // 2 seconds
        const start = 0;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quartic
            const ease = 1 - Math.pow(1 - progress, 4);

            const current = Math.floor(start + (target - start) * ease);
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target; // Ensure exact final value
            }
        };

        requestAnimationFrame(update);
    }

    animateBar(element) {
        const targetWidth = element.dataset.width;
        // Small delay to let number animation start first
        setTimeout(() => {
            element.style.transition = 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
            element.style.width = targetWidth;
        }, 100);
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AnimatedStats();
    });
} else {
    new AnimatedStats();
}
