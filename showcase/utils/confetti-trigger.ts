/**
 * confetti-trigger.ts
 */

/**
 * Simple Confetti Particle System for UV7 Showcase
 * Adds a "Bougie" celebration effect for milestones.
 */

class ConfettiSystem {
    private colors: string[];
    private container: HTMLDivElement | null;

    constructor() {
        this.colors = ['#4f46e5', '#10b981', '#ec4899', '#f59e0b', '#3b82f6'];
        this.container = null;
    }

    createContainer(): void {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.style.position = 'fixed';
            this.container.style.top = '0';
            this.container.style.left = '0';
            this.container.style.width = '100%';
            this.container.style.height = '100%';
            this.container.style.pointerEvents = 'none';
            this.container.style.zIndex = '9999';
            this.container.style.overflow = 'hidden';
            document.body.appendChild(this.container);
        }
    }

    fire(x: number, y: number): void {
        this.createContainer();
        const particleCount = 60;

        for (let i = 0; i < particleCount; i++) {
            this.createParticle(x, y);
        }

        // Cleanup container if empty after animation
        setTimeout(() => {
            if (this.container && this.container.childElementCount === 0) {
                this.container.remove();
                this.container = null;
            }
        }, 2000);
    }

    createParticle(x: number, y: number): void {
        const particle = document.createElement('div');
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];

        // Random physics
        const angle = Math.random() * Math.PI * 2;
        const velocity = 5 + Math.random() * 10;
        const tx = Math.cos(angle) * velocity * 20; // Destination X
        const ty = Math.sin(angle) * velocity * 20 + 50; // Destination Y + Gravity

        particle.style.position = 'absolute';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.backgroundColor = color;
        particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        particle.style.transform = `scale(${Math.random()})`;
        particle.style.opacity = '1';
        particle.style.transition = 'transform 1s ease-out, opacity 1s ease-out';

        this.container!.appendChild(particle);

        // Animate frame
        requestAnimationFrame(() => {
            particle.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
            particle.style.opacity = '0';
        });

        // Remove
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

window.uv7Confetti = new ConfettiSystem();

// Auto-attach to "Launch V2" buttons
document.addEventListener('DOMContentLoaded', () => {
    const launchBtns = document.querySelectorAll('a[href*="v2/index.html"]');
    launchBtns.forEach(btn => {
        btn.addEventListener('mouseenter', (_e) => {
            // Little mini burst on hover for fun
            const _rect = btn.getBoundingClientRect();
            // Only fire occasionally to not be annoying? Nah, let's be bougie.
            // keeping it subtle.
        });

        btn.addEventListener('click', (_e) => {
            const rect = btn.getBoundingClientRect();
            window.uv7Confetti.fire(rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
    });
});

declare global {
    interface Window {
        uv7Confetti: ConfettiSystem;
    }
}

