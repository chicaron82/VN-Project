/**
 * 👁️ VisualCueManager
 * Handles Sensory Substitution (Haptics & Visuals).
 * Replaces Audio with Feeling.
 */
export class VisualCueManager {
    constructor() {
        this.container = document.getElementById('crt-container');
        this.stage = document.getElementById('stage');
    }

    trigger(type) {
        console.log(`👁️ VisualCueManager: Triggering [${type}]`);

        switch (type) {
            case 'codeRipple':
                this.triggerRipple();
                this.vibrate('light');
                break;
            case 'glitch':
                this.triggerGlitch();
                this.vibrate('double');
                break;
            case 'heavy':
                this.triggerHeavyShake();
                this.vibrate('heavy');
                break;
            case 'thump':
                this.triggerThump();
                this.vibrate('heavy');
                break;
        }
    }

    vibrate(pattern) {
        if (!navigator.vibrate) return;

        const patterns = {
            'light': [50],
            'double': [50, 50, 50],
            'heavy': [100, 50, 100],
            'heartbeat': [100, 200, 100, 200]
        };

        if (patterns[pattern]) {
            navigator.vibrate(patterns[pattern]);
        }
    }

    triggerRipple() {
        // Create ripple element dynamically
        const ripple = document.createElement('div');
        ripple.className = 'code-ripple-effect';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        this.container.appendChild(ripple);

        // Remove after animation
        setTimeout(() => ripple.remove(), 600);
    }

    triggerGlitch() {
        document.body.classList.add('glitch-active');
        // Chromatic split overlay
        const split = document.createElement('div');
        split.className = 'chromatic-split';
        split.style.position = 'absolute';
        split.style.width = '100%';
        split.style.height = '100%';
        this.container.appendChild(split);

        setTimeout(() => {
            document.body.classList.remove('glitch-active');
            split.remove();
        }, 500);
    }

    triggerHeavyShake() {
        // The "Tether Pull" inward squeeze effect
        this.container.style.animation = 'tether-pull 0.4s ease-out';
        setTimeout(() => this.container.style.animation = '', 400);
    }

    triggerThump() {
        // A single heavy impact
        document.body.style.transform = "scale(1.02)";
        setTimeout(() => document.body.style.transform = "scale(1)", 100);
    }
}
