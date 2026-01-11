import { EventBus } from '@core/EventBus';
import '@ui/styles/animations.css';

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
        // Placeholder for Code Rain effect
        // In full V1 port, this would init the matrix canvas
        console.log(`🌧️ Code Rain triggered for ${duration}ms`);

        const rainOverlay = document.createElement('div');
        rainOverlay.className = 'effect-code-rain';
        rainOverlay.innerText = '0101010101 (Code Rain Placeholder)';
        rainOverlay.style.color = '#0f0';
        rainOverlay.style.display = 'flex';
        rainOverlay.style.alignItems = 'center';
        rainOverlay.style.justifyContent = 'center';
        rainOverlay.style.fontSize = '2rem';
        rainOverlay.style.background = 'rgba(0,0,0,0.5)';

        this.overlayContainer.appendChild(rainOverlay);

        setTimeout(() => {
            rainOverlay.remove();
        }, duration);
    }
}
