
import { EventBus } from '@core/EventBus';


/**
 * MobileUXController - High-Level Mobile Interaction Logic
 *
 * Coordinates mobile-specific behaviors:
 * - Double-tap to fullscreen
 * - Handling swipe events (mapped to game actions)
 * - Scroll indicators for internal thought bubbles
 */
export class MobileUXController {
    private eventBus: EventBus;
    private lastTapTime: number = 0;
    private mutationObserver: MutationObserver | null = null;

    // Configuration
    private readonly DOUBLE_TAP_DELAY = 300; // ms

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.setupListeners();
        this.setupScrollIndicators();

        console.log('[MobileUX] Controller initialized');
    }

    private setupListeners(): void {
        // Listen for raw input events (mapped to logical actions)
        this.eventBus.on('input:swipe_left', () => this.handleSwipeLeft());
        this.eventBus.on('input:swipe_right', () => this.handleSwipeRight());
        this.eventBus.on('input:swipe_up', () => this.handleSwipeUp());
        this.eventBus.on('input:swipe_down', () => this.handleSwipeDown());

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
        // Check if notification shade is handling this
        // If shade is open, it takes priority
        const shade = document.getElementById('notification-shade');
        if (shade?.classList.contains('visible')) {
            return; // Let NotificationShade handle it
        }

        // Swipe Up -> Hide UI (Screenshot Mode)
        console.log('[MobileUX] Action: Hide UI');
        this.eventBus.emit('ui:hide_status_bar', {});
        // Also hide dialog box if accessible via CSS/class
        document.querySelector('.dialog-box')?.classList.toggle('hidden');
    }

    private handleSwipeDown(): void {
        // Swipe Down routing logic:
        // - Portrait mode (or width < height): Open NotificationShade (V1 behavior)
        // - Landscape mode (width > height): Open Sidebar (V2 behavior)

        const isLandscape = window.innerWidth > window.innerHeight;

        if (isLandscape) {
            // Landscape: Open sidebar (V2 behavior)
            console.log('[MobileUX] Action: Open Sidebar (landscape)');
            this.eventBus.emit('ui:sidebar:toggle', {});
        } else {
            // Portrait: Let NotificationShade handle it (V1 behavior)
            // NotificationShade listens to input:swipe_down directly
            console.log('[MobileUX] Action: NotificationShade (portrait) - passing through');
            // No action needed here - NotificationShade already listens to input:swipe_down
        }
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

    // ===========================================
    // Scroll Indicators
    // ===========================================

    /**
     * Setup MutationObserver to detect when internal thought bubbles are created
     * and add scroll indicators to scrollable content
     */
    private setupScrollIndicators(): void {
        this.mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement && node.classList.contains('internal-bubble')) {
                        this.addScrollIndicator(node);
                    }
                });
            });
        });

        const gameView = document.getElementById('game-view');
        if (gameView) {
            this.mutationObserver.observe(gameView, { childList: true, subtree: true });
            console.log('[MobileUX] Scroll indicators observer active');
        }
    }

    /**
     * Add scroll indicator to a bubble if its content is scrollable
     * @param bubble - The bubble element to check
     */
    private addScrollIndicator(bubble: HTMLElement): void {
        const checkScrollable = () => {
            if (bubble.scrollHeight > bubble.clientHeight) {
                bubble.classList.add('has-scroll');

                // Add scroll indicator if not already present
                if (!bubble.querySelector('.scroll-indicator')) {
                    const indicator = document.createElement('div');
                    indicator.className = 'scroll-indicator';
                    indicator.innerHTML = '↓';
                    bubble.appendChild(indicator);

                    // Hide indicator when scrolled to bottom
                    bubble.addEventListener('scroll', () => {
                        const isAtBottom = bubble.scrollHeight - bubble.scrollTop <= bubble.clientHeight + 5;
                        indicator.style.opacity = isAtBottom ? '0' : '1';
                    });

                    console.log('[MobileUX] Scroll indicator added to bubble');
                }
            }
        };

        // Check after content is rendered
        setTimeout(checkScrollable, 100);
    }

    /**
     * Clean up resources when controller is destroyed
     */
    public destroy(): void {
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
            this.mutationObserver = null;
        }
    }
}
