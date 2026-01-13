
import { EventBus } from '@core/EventBus';


/**
 * MobileUXController - High-Level Mobile Interaction Logic
 * 
 * Coordinates mobile-specific behaviors:
 * - Double-tap to fullscreen
 * - Handling swipe events (mapped to game actions)
 * - Scroll indicators (future)
 */
export class MobileUXController {
    private eventBus: EventBus;
    private lastTapTime: number = 0;

    // Configuration
    private readonly DOUBLE_TAP_DELAY = 300; // ms

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.setupListeners();

        console.log('[MobileUX] Controller initialized');
    }

    private setupListeners(): void {
        // Listen for raw input events (mapped to logical actions)
        this.eventBus.on('input:swipe_left', () => this.handleSwipeLeft());
        this.eventBus.on('input:swipe_right', () => this.handleSwipeRight());
        this.eventBus.on('input:swipe_up', () => this.handleSwipeUp());
        // NOTE: input:swipe_down is handled by NotificationShade directly (V1 pattern)

        // Double-tap listener (global on document)
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    }

    // ===========================================
    // Gesture Actions
    // ===========================================

    private handleSwipeRight(): void {
        // Swipe Right -> Advance Dialog
        console.log('[MobileUX] Action: Advance');
        this.eventBus.emit('dialog:advance', { source: 'swipe' });
    }

    private handleSwipeLeft(): void {
        // Swipe Left -> Open Backlog
        console.log('[MobileUX] Action: Backlog');
        this.eventBus.emit('ui:backlog:toggle', {});
    }

    private handleSwipeUp(): void {
        // Swipe Up -> Hide UI (Screenshot Mode)
        console.log('[MobileUX] Action: Hide UI');
        this.eventBus.emit('ui:hide_status_bar', {});
        // Also hide dialog box if accessible via CSS/class
        document.querySelector('.dialog-box')?.classList.toggle('hidden');
    }

    // ===========================================
    // Fullscreen Logic
    // ===========================================

    private handleTouchEnd(e: TouchEvent): void {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - this.lastTapTime;

        if (tapLength < this.DOUBLE_TAP_DELAY && tapLength > 0) {
            e.preventDefault();
            this.toggleFullscreen();
            this.eventBus.emit('input:double_tap', {});
        }

        this.lastTapTime = currentTime;
    }

    private toggleFullscreen(): void {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
}
