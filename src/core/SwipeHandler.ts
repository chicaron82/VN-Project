
import { EventBus } from './EventBus';

/**
 * SwipeHandler - Mobile Touch Gesture Manager
 * 
 * Handles touch events to detect swipes (Left, Right, Up, Down).
 * Emits input events to EventBus.
 */
export class SwipeHandler {
    private eventBus: EventBus;
    private element: HTMLElement;

    private touchStartX: number = 0;
    private touchStartY: number = 0;
    private touchStartTime: number = 0;

    // Configuration
    private readonly MIN_SWIPE_DISTANCE = 35; // px (Reduced from 50)
    private readonly MAX_SWIPE_TIME = 650; // ms (Increased from 500)
    private readonly RESTRAINT = 120; // px (Increased from 100)

    constructor(element: HTMLElement, eventBus: EventBus) {
        this.element = element;
        this.eventBus = eventBus;
        this.setupListeners();
    }

    private setupListeners(): void {
        this.element.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.element.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        console.log('[SwipeHandler] Initialized on', this.element);
    }

    private handleTouchStart(e: TouchEvent): void {
        const touch = e.changedTouches[0];
        if (!touch) return;
        this.touchStartX = touch.clientX; // Use clientX/Y
        this.touchStartY = touch.clientY;
        this.touchStartTime = new Date().getTime();
    }

    private handleTouchEnd(e: TouchEvent): void {
        const touch = e.changedTouches[0];
        if (!touch) return;
        const distX = touch.clientX - this.touchStartX;
        const distY = touch.clientY - this.touchStartY;
        const elapsedTime = new Date().getTime() - this.touchStartTime;

        if (elapsedTime <= this.MAX_SWIPE_TIME) {
            // Check for horizontal swipe
            if (Math.abs(distX) >= this.MIN_SWIPE_DISTANCE && Math.abs(distY) <= this.RESTRAINT) {
                if (distX < 0) {
                    // Left Swipe
                    console.log('[SwipeHandler] Swipe Left detected');
                    this.eventBus.emit('input:swipe_left', {});
                } else {
                    // Right Swipe
                    console.log('[SwipeHandler] Swipe Right detected');
                    this.eventBus.emit('input:swipe_right', {});
                }
            }
            // Check for vertical swipe
            else if (Math.abs(distY) >= this.MIN_SWIPE_DISTANCE && Math.abs(distX) <= this.RESTRAINT) {
                if (distY < 0) {
                    // Up Swipe
                    console.log('[SwipeHandler] Swipe Up detected');
                    this.eventBus.emit('input:swipe_up', {});
                } else {
                    // Down Swipe
                    console.log('[SwipeHandler] Swipe Down detected');
                    this.eventBus.emit('input:swipe_down', {});
                }
            }
        }
    }

    public destroy(): void {
        // Cleanup if needed (though listeners are usually on long-lived elements)
    }
}
