class ParticleSystem {
    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'particle-container';
        this.container.style.position = 'fixed';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.pointerEvents = 'none';
        this.container.style.zIndex = '-1';
        this.container.style.overflow = 'hidden';
        document.body.prepend(this.container);

        this.particles = [];
        this.maxParticles = 15;
        this.init();
    }

    init() {
        // Create initial batch
        for (let i = 0; i < 5; i++) {
            this.createParticle(true);
        }

        // Continually add particles
        setInterval(() => {
            if (this.particles.length < this.maxParticles) {
                this.createParticle();
            }
        }, 2000);

        this.animate();
    }

    createParticle(randomY = false) {
        const p = document.createElement('div');
        p.className = 'ambient-particle';

        // Randomize appearance
        const size = 10 + Math.random() * 20;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.background = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.2})`;
        p.style.borderRadius = '50%';
        p.style.position = 'absolute';

        // Randomize position
        const startX = Math.random() * 100;
        const startY = randomY ? Math.random() * 100 : 105;

        p.style.left = `${startX}%`;
        p.style.top = `${startY}%`;

        // Store physics properties
        const particleData = {
            element: p,
            x: startX,
            y: startY,
            speed: 0.05 + Math.random() * 0.1,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.02 + Math.random() * 0.03
        };

        this.container.appendChild(p);
        this.particles.push(particleData);
    }

    animate() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Move up
            p.y -= p.speed;

            // Wobble side to side
            p.wobble += p.wobbleSpeed;
            const xOffset = Math.sin(p.wobble) * 0.5;

            p.element.style.top = `${p.y}%`;
            p.element.style.left = `${p.x + xOffset}%`;
            p.element.style.opacity = Math.min(1, (100 - Math.abs(50 - p.y) * 2) / 50); // Fade in/out at edges logic approximation

            // Remove if off screen
            if (p.y < -10) {
                p.element.remove();
                this.particles.splice(i, 1);
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});
