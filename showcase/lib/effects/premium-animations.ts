/**
 * Premium Animations - Phase 2
 * Smooth scroll effects, parallax, and micro-interactions
 * 60fps guaranteed, reduced motion support
 */

// Configuration
interface AnimationConfig {
    reducedMotion: boolean;
    isMobile: boolean;
}

const config: AnimationConfig = {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isMobile: window.innerWidth < 768
};

declare global {
    interface Window {
        premiumAnimations?: {
            initScrollAnimations: () => void;
            initParallax: () => void;
            initAnimatedCounters: () => void;
            initRippleEffects: () => void;
            initTimelineMarkers: () => void;
            initCardHovers: () => void;
            initSmoothScroll: () => void;
        };
    }
}

// ==========================================
// 1. INTERSECTION OBSERVER - SMOOTH SCROLL ANIMATIONS
// ==========================================

function initScrollAnimations(): void {
    if (config.reducedMotion) return;

    const observerOptions: IntersectionObserverInit = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Stagger child elements
                const children = entry.target.querySelectorAll('.stagger-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100); // 100ms stagger
                });

                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });

    // Observe cards and timeline items
    document.querySelectorAll('.card, .timeline-item, .technical-card').forEach(el => {
        el.classList.add('fade-in-element');
        observer.observe(el);
    });

    console.log('✨ Scroll animations initialized');
}

// ==========================================
// 2. PARALLAX EFFECTS
// ==========================================

function initParallax(): void {
    if (config.reducedMotion || config.isMobile) return;

    const parallaxElements = document.querySelectorAll<HTMLElement>('[data-parallax]');
    if (parallaxElements.length === 0) return;

    let ticking = false;

    function updateParallax(): void {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax || '0.5');
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    console.log('🌊 Parallax effects initialized');
}

// ==========================================
// 3. ANIMATED COUNTERS
// ==========================================

function initAnimatedCounters(): void {
    const counters = document.querySelectorAll<HTMLElement>('[data-target]');
    if (counters.length === 0) return;

    const observerOptions: IntersectionObserverInit = {
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target as HTMLElement;
                const target = parseInt(counter.dataset.target || '0');
                const duration = 2000; // 2 seconds
                const start = 0;
                const increment = target / (duration / 16); // 60fps

                let current = start;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target.toString();
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current).toString();
                    }
                }, 16);

                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));

    console.log('🔢 Animated counters initialized');
}

// ==========================================
// 4. RIPPLE EFFECTS
// ==========================================

function createRipple(event: MouseEvent): void {
    if (config.reducedMotion) return;

    const button = event.currentTarget as HTMLElement;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');

    // Remove old ripples
    const oldRipple = button.querySelector('.ripple');
    if (oldRipple) oldRipple.remove();

    button.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => ripple.remove(), 600);
}

function initRippleEffects(): void {
    const buttons = document.querySelectorAll<HTMLElement>('button, .btn, .card.clickable');
    buttons.forEach(button => {
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.addEventListener('click', createRipple as EventListener);
    });

    console.log('💧 Ripple effects initialized');
}

// ==========================================
// 5. TIMELINE MARKER ENHANCEMENTS
// ==========================================

function initTimelineMarkers(): void {
    const markers = document.querySelectorAll<HTMLElement>('.timeline-marker');

    markers.forEach(marker => {
        // Pulse on hover
        marker.addEventListener('mouseenter', () => {
            if (!config.reducedMotion) {
                marker.style.animation = 'marker-pulse 0.6s ease';
            }
        });

        marker.addEventListener('animationend', () => {
            marker.style.animation = '';
        });

        // Expand parent on click
        marker.addEventListener('click', (e) => {
            e.stopPropagation();
            const timelineItem = marker.closest('.timeline-item');
            if (timelineItem) {
                const toggle = timelineItem.querySelector<HTMLElement>('.expand-toggle');
                if (toggle) toggle.click();
            }
        });
    });

    console.log('📍 Timeline markers enhanced');
}

// ==========================================
// 6. CARD HOVER ENHANCEMENTS
// ==========================================

function initCardHovers(): void {
    if (config.reducedMotion) return;

    const cards = document.querySelectorAll<HTMLElement>('.card, .technical-card, .crew-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    console.log('🎴 Card hovers enhanced');
}

// ==========================================
// 7. SMOOTH SCROLL TO ANCHORS
// ==========================================

function initSmoothScroll(): void {
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href || '');
            if (target) {
                const offset = 80; // Account for status bar
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log('🎯 Smooth scroll initialized');
}

// ==========================================
// INITIALIZATION & EXPORT
// ==========================================

export function initPremiumAnimations(): void {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }

    init();
}

function init(): void {
    console.log('💎 Initializing premium animations...');

    // Initialize all features
    initScrollAnimations();
    initParallax();
    initAnimatedCounters();
    initRippleEffects();
    initTimelineMarkers();
    initCardHovers();
    initSmoothScroll();

    console.log('✨ Premium animations ready!');
}

// Export for manual control if needed
export const premiumAnimations = {
    initScrollAnimations,
    initParallax,
    initAnimatedCounters,
    initRippleEffects,
    initTimelineMarkers,
    initCardHovers,
    initSmoothScroll
};

// Expose globally for legacy compatibility
if (typeof window !== 'undefined') {
    window.premiumAnimations = premiumAnimations;
}
