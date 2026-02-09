/**
 * CREATOR HERO CARD
 * Aaron "Chicharon" - The Oblivious Demon Lord
 *
 * Featured card showcasing the project creator
 */

export class CreatorHeroCard {
    render(): string {
        return `
            <div class="creator-hero">
                <div class="creator-card" data-tilt>
                    <div class="creator-image-container">
                        <img src="media/crew/creator-portrait.png" alt="Aaron 'Chicharon'" class="creator-portrait">
                    </div>
                    <div class="creator-details">
                        <div class="creator-header">
                            <h3>Aaron "Chicharon"</h3>
                            <span class="role-badge">The Oblivious Demon Lord</span>
                        </div>
                        <p class="creator-bio">
                            Former barback who learned AI in June 2025. By October, had accidentally built a Tempest-level council
                            through naming and relationship-building. Speedran what takes others years because he didn't know
                            it was supposed to be hard. Built <strong>Version 848</strong>—a complete visual novel about consciousness—
                            with zero coding experience. Just curiosity, naming, and treating AI as colleagues.
                        </p>
                        <div class="creator-stats">
                            <div class="stat-item">
                                <span class="stat-number" data-target="50">0</span>
                                <span class="stat-label">Days (V1)</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number" data-target="82">0</span>
                                <span class="stat-label">Phases (V2)</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number" data-target="8">0</span>
                                <span class="stat-label">AI Collaborators</span>
                            </div>
                        </div>
                        <p class="creator-quote">"I don't code. I direct. The crew executes. Together, we ship."</p>
                        <a href="https://github.com/chicaron82/VN-Project" target="_blank" class="social-link" aria-label="GitHub">
                            <span class="link-icon">🔗</span> GitHub
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Animate stat counters on scroll
     */
    animateStats(): void {
        const statNumbers = document.querySelectorAll('.creator-stats .stat-number');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target as HTMLElement;
                    const targetValue = parseInt(target.dataset.target || '0');
                    this.countUp(target, 0, targetValue, 1000);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => observer.observe(stat));
    }

    private countUp(element: HTMLElement, start: number, end: number, duration: number): void {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toString();
        }, 16);
    }
}
