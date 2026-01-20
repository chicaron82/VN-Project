import { EventBus } from '@core/EventBus';

export class EffectsController {
    private eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
    }

    /**
     * Trigger the "Code Rain" transition
     * Used when entering a route
     */
    triggerCodeRain(duration: number = 1500) {
        this.eventBus.emit('effect:code_rain', { duration });
    }

    /**
     * Trigger a screen glitch
     * @param intensity 0-1
     */
    triggerGlitch(intensity: number = 0.5) {
        this.eventBus.emit('effect:glitch', { intensity });
    }

    /**
     * Trigger screen shake
     */
    triggerShake(intensity: 'light' | 'medium' | 'heavy') {
        this.eventBus.emit('effect:shake', { intensity });
    }

    /**
     * Trigger Flash
     */
    triggerFlash(color: string = 'white', duration: number = 100) {
        this.eventBus.emit('effect:flash', { color, duration });
    }
}
