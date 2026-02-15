
import type { EventBus } from './EventBus';
import type { SettingsSystem } from '../systems/SettingsSystem';
import { Logger } from '../utils/Logger';

/**
 * SwipeHandler - Mobile Touch Gesture Manager
 * 
 * Handles touch events to detect swipes (Left, Right, Up, Down).
 * Emits input events to EventBus.
 */
export class SwipeHandler {
    private eventBus: EventBus;
    private element: HTMLElement;
    private settingsSystem: SettingsSystem;

    private touchStartX: number = 0;
    private touchStartY: number = 0;
    private touchStartTime: number = 0;
    private touchStartValid: boolean = false;

    // Double-tap detection
    private lastTapTime: number = 0;
    private readonly DOUBLE_TAP_DELAY = 300; // ms

    constructor(element: HTMLElement, eventBus: EventBus, settingsSystem: SettingsSystem) {
        this.element = element;
        this.eventBus = eventBus;
        this.settingsSystem = settingsSystem;
        this.setupListeners();
    }

    private setupListeners(): void {
        this.element.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.element.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        Logger.input('[SwipeHandler] Initialized on', this.element);
    }

    private handleTouchStart(e: TouchEvent): void {
        const touch = e.changedTouches[0];
        if (!touch) return;

        // TORI'S FIX: Interaction Guards
        // Don't swipe if touching interactive elements
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.closest('.carousel') ||
            target.closest('.slider') ||
            target.closest('code') ||
            target.closest('.scroll-container')) {
            Logger.input('[SwipeHandler] Swipe ignored - interactive target');
            this.touchStartValid = false;
            return;
        }

        // TORI'S FIX: Edge Guard for Swipe Down
        // Only allow swipe down if starting from top edge (simulating status bar pull)
        // We'll store the Y and check direction later, but we can flag intent here

        this.touchStartValid = true;
        this.touchStartX = touch.clientX; // Use clientX/Y
        this.touchStartY = touch.clientY;
        this.touchStartTime = new Date().getTime();
    }

    private handleTouchEnd(e: TouchEvent): void {
        const touch = e.changedTouches[0];
        if (!touch) return;

        // Skip if touchstart was on interactive element
        if (!this.touchStartValid) {
            this.lastTapTime = 0; // Reset double-tap chain
            return;
        }

        // Get Settings
        const settings = this.settingsSystem.get('swipeSettings');
        const minDistance = settings?.minDistance ?? 35;
        const maxTime = settings?.maxTime ?? 650;
        const restraint = settings?.restraint ?? 120;

        const distX = touch.clientX - this.touchStartX;
        const distY = touch.clientY - this.touchStartY;
        const elapsedTime = new Date().getTime() - this.touchStartTime;

        let swipeDetected = false;

        if (elapsedTime <= maxTime) {
            // Check for horizontal swipe
            if (Math.abs(distX) >= minDistance && Math.abs(distY) <= restraint) {
                swipeDetected = true;
                if (distX < 0) {
                    Logger.input('[SwipeHandler] Swipe Left detected');
                    this.eventBus.emit('input:swipe_left', {});
                } else {
                    Logger.input('[SwipeHandler] Swipe Right detected');
                    this.eventBus.emit('input:swipe_right', {});
                }
            }
            // Check for vertical swipe
            else if (Math.abs(distY) >= minDistance && Math.abs(distX) <= restraint) {
                swipeDetected = true;
                if (distY < 0) {
                    Logger.input('[SwipeHandler] Swipe Up detected');
                    this.eventBus.emit('input:swipe_up', {});
                } else {
                    // Down Swipe — always emit with startY for routing layer to decide
                    Logger.input('[SwipeHandler] Swipe Down detected');
                    this.eventBus.emit('input:swipe_down', { startY: this.touchStartY });
                }
            }
        }

        // Double-tap detection (only when no swipe was detected)
        if (!swipeDetected) {
            const currentTime = Date.now();
            const tapGap = currentTime - this.lastTapTime;
            if (tapGap < this.DOUBLE_TAP_DELAY && tapGap > 0) {
                Logger.input('[SwipeHandler] Double-tap detected');
                this.eventBus.emit('input:double_tap', { target: e.target });
            }
            this.lastTapTime = currentTime;
        } else {
            // Swipe breaks double-tap chain
            this.lastTapTime = 0;
        }
    }

    public destroy(): void {
        // Cleanup if needed (though listeners are usually on long-lived elements)
    }
}
