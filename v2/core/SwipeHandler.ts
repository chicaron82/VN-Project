
import { EventBus } from './EventBus';
import { SettingsSystem } from '../systems/SettingsSystem';
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
            return;
        }

        // TORI'S FIX: Edge Guard for Swipe Down
        // Only allow swipe down if starting from top edge (simulating status bar pull)
        // We'll store the Y and check direction later, but we can flag intent here

        this.touchStartX = touch.clientX; // Use clientX/Y
        this.touchStartY = touch.clientY;
        this.touchStartTime = new Date().getTime();
    }

    private handleTouchEnd(e: TouchEvent): void {
        const touch = e.changedTouches[0];
        if (!touch) return;

        // Get Settings
        const settings = this.settingsSystem.get('swipeSettings');
        const minDistance = settings?.minDistance ?? 35;
        const maxTime = settings?.maxTime ?? 650;
        const restraint = settings?.restraint ?? 120;

        const distX = touch.clientX - this.touchStartX;
        const distY = touch.clientY - this.touchStartY;
        const elapsedTime = new Date().getTime() - this.touchStartTime;

        if (elapsedTime <= maxTime) {
            // Check for horizontal swipe
            if (Math.abs(distX) >= minDistance && Math.abs(distY) <= restraint) {
                if (distX < 0) {
                    // Left Swipe
                    Logger.input('[SwipeHandler] Swipe Left detected');
                    this.eventBus.emit('input:swipe_left', {});
                } else {
                    // Right Swipe
                    Logger.input('[SwipeHandler] Swipe Right detected');
                    this.eventBus.emit('input:swipe_right', {});
                }
            }
            // Check for vertical swipe
            else if (Math.abs(distY) >= minDistance && Math.abs(distX) <= restraint) {
                if (distY < 0) {
                    // Up Swipe
                    Logger.input('[SwipeHandler] Swipe Up detected');
                    this.eventBus.emit('input:swipe_up', {});
                } else {
                    // Down Swipe
                    // TORI'S FIX: Only trigger if started near top
                    if (this.touchStartY < 80) {
                        Logger.input('[SwipeHandler] Swipe Down detected (from top edge)');
                        this.eventBus.emit('input:swipe_down', {});
                    } else {
                        Logger.input('[SwipeHandler] Swipe Down ignored (not from top)');
                    }
                }
            }
        }
    }

    public destroy(): void {
        // Cleanup if needed (though listeners are usually on long-lived elements)
    }
}
