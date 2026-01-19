import { EventBus } from '@core/EventBus';
import '@ui/styles/animations.css';
import { CodeRain } from './CodeRain';

export class VisualEffectsLayer {
    private container: HTMLElement; // The target element to shake/glitch (usually the Viewport)
    private overlayContainer: HTMLElement; // Container for overlays (Flash, Rain)
    private eventBus: EventBus;

    constructor(targetContainer: HTMLElement, overlayContainer: HTMLElement, eventBus: EventBus) {
        this.container = targetContainer;
        this.overlayContainer = overlayContainer;
        this.eventBus = eventBus;

        this.bindEvents();
    }

    private bindEvents() {
        this.eventBus.on('effect:glitch', (data) => this.triggerGlitch(data.intensity));
        this.eventBus.on('effect:shake', (data) => this.triggerShake(data.intensity));
        this.eventBus.on('effect:flash', (data) => this.triggerFlash(data.color, data.duration));
        this.eventBus.on('effect:code_rain', (data) => this.triggerCodeRain(data.duration));
    }

    private triggerGlitch(intensity: number) {
        // Simple CSS class toggle for now. 
        // V1 had complex canvas glitches, V2 Start with CSS.
        this.container.classList.add('effect-glitch');

        // Remove after duration (heuristic based on intensity)
        const duration = Math.max(200, intensity * 1000);
        setTimeout(() => {
            this.container.classList.remove('effect-glitch');
        }, duration);
    }

    private triggerShake(intensity: string) {
        // Map string to class
        const className = intensity === 'heavy' ? 'effect-shake-heavy' : 'effect-shake-medium';

        this.container.classList.add(className);

        // Remove after animation completes (approx 500-800ms)
        setTimeout(() => {
            this.container.classList.remove(className);
        }, 800);
    }

    private triggerFlash(color: string, duration: number) {
        const flashOverlay = document.createElement('div');
        flashOverlay.className = 'effect-flash-overlay';
        flashOverlay.style.background = color;
        flashOverlay.style.animationDuration = `${duration}ms`;

        this.overlayContainer.appendChild(flashOverlay);

        // Remove after animation
        setTimeout(() => {
            flashOverlay.remove();
        }, duration + 50);
    }

    private triggerCodeRain(duration: number) {
        // Faithful V1 Port: Matrix code rain
        console.log(`🌧️ Code Rain triggered for ${duration}ms`);

        const container = document.createElement('div');
        container.className = 'effect-code-rain';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            width: 100vw;
            height: 100vh;
            z-index: 2147483647; /* Max Z-Index */
            opacity: 1; /* DIZEE FIX: Start noticeable immediately */
            transition: opacity 300ms ease;
            pointer-events: none;
        `;

        this.overlayContainer.appendChild(container);

        // Initialize rain
        // V1 Default Color: Cyan (#00ffff)
        const rain = new CodeRain(container);
        rain.start('#00ffff');

        // Cleanup sequence
        // Fade out happens 300ms before duration ends (matching V1)
        const fadeOutTime = Math.max(0, duration - 300);

        setTimeout(() => {
            container.style.opacity = '0';

            setTimeout(() => {
                rain.destroy();
                container.remove();
            }, 300);
        }, fadeOutTime);
    }
}
