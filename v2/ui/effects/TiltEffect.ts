/**
 * ========================================
 * UV7 TILT EFFECT - UNIFIED V2
 * Premium 3D Tilt Effect
 * ========================================
 *
 * Generic tilt effect that works on any element.
 * Unifies both landing (logo tilt) and showcase (banner tilt) implementations.
 *
 * Features:
 * - Configurable selector for target elements
 * - Adjustable rotation limits
 * - Smooth RAF-based animations
 * - Auto-reset on mouse leave
 * - Perspective and scale effects
 *
 * "Built with love. 💚🔥💀"
 */

export interface TiltEffectOptions {
    /**
     * Container selector (where mouse move is tracked)
     * If not provided, uses the same element as target
     */
    container?: string;

    /**
     * Maximum rotation in degrees
     * @default 15
     */
    limits?: number;

    /**
     * Perspective value in pixels
     * @default 1000
     */
    perspective?: number;

    /**
     * Scale on hover
     * @default 1.05
     */
    scale?: number;

    /**
     * Scale on hover leave (reset)
     * @default 1
     */
    scaleReset?: number;

    /**
     * Transition duration in seconds
     * @default 0.1
     */
    transition?: number;

    /**
     * Also apply tilt to a secondary element (e.g., glow effect)
     * @default null
     */
    secondarySelector?: string | null;

    /**
     * Secondary element tilt intensity (multiplier)
     * @default 0.5
     */
    secondaryIntensity?: number;

    /**
     * Secondary element translateZ offset
     * @default -50
     */
    secondaryTranslateZ?: number;
}

export class TiltEffect {
    private container: HTMLElement | null;
    private target: HTMLElement | null;
    private secondary: HTMLElement | null = null;
    private options: Required<TiltEffectOptions>;

    constructor(targetSelector: string, options: TiltEffectOptions = {}) {
        // Default options
        this.options = {
            container: options.container || targetSelector,
            limits: options.limits ?? 15,
            perspective: options.perspective ?? 1000,
            scale: options.scale ?? 1.05,
            scaleReset: options.scaleReset ?? 1,
            transition: options.transition ?? 0.1,
            secondarySelector: options.secondarySelector ?? null,
            secondaryIntensity: options.secondaryIntensity ?? 0.5,
            secondaryTranslateZ: options.secondaryTranslateZ ?? -50
        };

        // Find elements
        this.container = document.querySelector(this.options.container);
        this.target = document.querySelector(targetSelector);

        if (this.options.secondarySelector) {
            this.secondary = document.querySelector(this.options.secondarySelector);
        }

        if (!this.container || !this.target) {
            console.warn(`[TiltEffect] Could not find container or target: ${targetSelector}`);
            return;
        }

        this.init();
    }

    private init(): void {
        if (!this.container || !this.target) return;

        // Set smooth transition on target
        this.target.style.transition = `transform ${this.options.transition}s ease-out`;

        // Bind events
        this.container.addEventListener('mousemove', (e: MouseEvent) => this.handleMouseMove(e));
        this.container.addEventListener('mouseleave', () => this.handleMouseLeave());

        console.log(`✅ TiltEffect initialized for ${this.target.className || 'element'}`);
    }

    private handleMouseMove(e: MouseEvent): void {
        if (!this.container || !this.target) return;

        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate percentages
        const xPct = x / rect.width;
        const yPct = y / rect.height;

        // Calculate rotation
        // (0,0) should rotate (-limits, limits)
        // (1,1) should rotate (limits, -limits)
        const xRotation = (yPct - 0.5) * -this.options.limits; // Rotate X axis based on Y movement
        const yRotation = (xPct - 0.5) * this.options.limits;  // Rotate Y axis based on X movement

        // Apply transform to target
        this.target.style.transform = `
            perspective(${this.options.perspective}px)
            rotateX(${xRotation}deg)
            rotateY(${yRotation}deg)
            scale(${this.options.scale})
        `;

        // Apply to secondary if it exists
        if (this.secondary) {
            const secondaryXRotation = xRotation * this.options.secondaryIntensity;
            const secondaryYRotation = yRotation * this.options.secondaryIntensity;

            this.secondary.style.transform = `
                perspective(${this.options.perspective}px)
                translateZ(${this.options.secondaryTranslateZ}px)
                rotateX(${secondaryXRotation}deg)
                rotateY(${secondaryYRotation}deg)
                scale(${this.options.scale + 0.15})
            `;
        }
    }

    private handleMouseLeave(): void {
        if (!this.target) return;

        // Reset transform
        this.target.style.transform = `
            perspective(${this.options.perspective}px)
            rotateX(0deg)
            rotateY(0deg)
            scale(${this.options.scaleReset})
        `;

        // Reset secondary
        if (this.secondary) {
            this.secondary.style.transform = ''; // Return to CSS animation
        }
    }
}

/**
 * Initialize tilt effect on an element
 * @param targetSelector CSS selector for the element to tilt
 * @param options Tilt configuration options
 */
export function initTilt(targetSelector: string, options?: TiltEffectOptions): TiltEffect | null {
    const element = document.querySelector(targetSelector);
    if (!element) {
        console.warn(`[initTilt] Element not found: ${targetSelector}`);
        return null;
    }

    return new TiltEffect(targetSelector, options);
}
