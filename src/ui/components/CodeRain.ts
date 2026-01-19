/**
 * ========================================
 * CODE RAIN COMPONENT
 * Faithful V1 Port (Phase 13i)
 * ========================================
 *
 * Matrix-style code rain for transitions.
 * Logic transcribed faithfully from V1 effects-controller.js
 */

export class CodeRain {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private intervalId: number | null = null;
    private drops: number[] = [];

    // Exact character set from V1 (UV7 Crew names + 848)
    private static readonly CHARS = 'ZEEZEERAHDIZEECOZEEBELLEPEASYGENZEETORICHICHARONUV7848';

    constructor(container: HTMLElement) {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            width: 100%;
            height: 100%;
            display: block;
        `;

        container.appendChild(this.canvas);
        const context = this.canvas.getContext('2d');
        if (!context) throw new Error('Could not get 2D context');
        this.ctx = context;

        // Initial setup
        this.resize();
        // Bind resize listener
        window.addEventListener('resize', this.boundResize);
    }

    // Bound function for event listener removal
    private boundResize = () => this.resize();

    /**
     * Start the rain loop
     * @param color Rain color (default: #00ffff cyan)
     */
    public start(color: string = '#00ffff'): void {
        this.resize(); // Ensure correct size before starting
        console.log(`🌧️ Code Rain starting. Canvas size: ${this.canvas.width}x${this.canvas.height}`);
        this.stop(); // Clear any existing loop

        // V1 Logic: Faster on portrait to fill screen
        const isPortrait = window.innerHeight > window.innerWidth;
        const dropSpeed = isPortrait ? 3 : 2;
        const fontSize = 14;

        const draw = () => {
            // Fade effect (trail)
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.fillStyle = color;
            this.ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < this.drops.length; i++) {
                const charIndex = Math.floor(Math.random() * CodeRain.CHARS.length);
                const char = CodeRain.CHARS[charIndex];
                if (!char) continue; // Safety check

                const dropY = this.drops[i];
                if (dropY === undefined) continue; // Safety check

                this.ctx.fillText(char, i * fontSize, dropY * fontSize);

                // Random reset when off screen
                // V1 Logic: Math.random() > 0.975
                if (dropY * fontSize > this.canvas.height && Math.random() > 0.975) {
                    this.drops[i] = 0;
                } else {
                    this.drops[i] = dropY + dropSpeed;
                }
            }
        };

        // V1 Interval: 33ms (~30fps)
        this.intervalId = window.setInterval(draw, 33);

        console.log('🌧️ Code Rain started');
    }

    public stop(): void {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        // Clear canvas
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    private resize(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        const fontSize = 14;
        const columns = Math.floor(this.canvas.width / fontSize);

        // Reset drops array
        this.drops = Array(columns).fill(1);

        // Pre-fill with black on resize to prevent flash
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public destroy(): void {
        this.stop();
        window.removeEventListener('resize', this.boundResize);
        this.canvas.remove();
    }
}
