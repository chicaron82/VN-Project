
import { EventBus } from '@core/EventBus';
import { Logger } from '@utils/Logger';


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

        Logger.system('[MobileUX] Controller initialized');
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

    private isShadeVisible(): boolean {
        const shade = document.getElementById('notification-shade');
        return !!shade && shade.classList.contains('visible');
    }

    private isSidebarVisible(): boolean {
        const sidebar = document.getElementById('sidebar');
        return !!sidebar && sidebar.classList.contains('visible');
    }

    private isGameplayActive(): boolean {
        // V2 Parity: Gameplay always has a #game-viewport element
        return !!document.getElementById('game-viewport');
    }

    private handleSwipeRight(): void {
        // Guard: Don't advance if overlays are open
        if (this.isShadeVisible() || this.isSidebarVisible()) return;

        // Guard: Don't advance if not in gameplay (e.g. Main Menu)
        if (!this.isGameplayActive()) return;

        // Swipe Right -> Advance Dialog
        Logger.input('[MobileUX] Action: Advance');
        this.eventBus.emit('dialog:advance', { source: 'swipe' });
    }

    private handleSwipeLeft(): void {
        // Guard: Don't open backlog if overlays are open
        if (this.isShadeVisible() || this.isSidebarVisible()) return;

        // Guard: Don't open backlog if not in gameplay (e.g. Main Menu)
        if (!this.isGameplayActive()) return;

        // Swipe Left -> Open Backlog
        Logger.input('[MobileUX] Action: Backlog');
        this.eventBus.emit('ui:backlog:toggle', {});
    }

    private handleSwipeUp(): void {
        // Check if notification shade is handling this
        if (this.isShadeVisible()) return; // Let NotificationShade handle it
        if (this.isSidebarVisible()) return; // Sidebar might handle swipe up later

        // Only hide UI if in gameplay
        if (!this.isGameplayActive()) return;

        // Swipe Up -> Hide UI (Screenshot Mode)
        Logger.input('[MobileUX] Action: Hide UI');
        this.eventBus.emit('ui:hide_status_bar', {});
        // Also hide dialog box if accessible
        document.querySelector('.dialog-box')?.classList.toggle('hidden');
    }

    private handleSwipeDown(): void {
        if (this.isShadeVisible()) return;
        if (this.isSidebarVisible()) return;

        // Swipe Down routing logic:
        // - Portrait mode (or width < height): Open NotificationShade (V1 behavior)
        // - Landscape mode (width > height): Open Sidebar (V2 behavior)
        // NOTE: These should work even in menus if the UI supports it, 
        // but user request implies restricting "gestures" during menu interaction.
        // However, sidebar/shade usually ARE accessible globally.
        // The user request "gesture to open the backlog" specifically targeted backlog.
        // I will act conservatively and only restrict Backlog/Advance, 
        // but keep Sidebar/Shade accessible if desired, or restrict them too if they conflict.
        // Re-reading: "shouldn't pop up when the sidebar/shade is opened or when in the main menu swiping the carousel"
        // Swiping carousel is horizontal. So Left/Right guards are most critical.
        // Down swipe is usually safe in menu (unless it conflicts with scrolling).

        const isLandscape = window.innerWidth > window.innerHeight;

        if (isLandscape) {
            // Landscape: Open sidebar (V2 behavior)
            Logger.input('[MobileUX] Action: Open Sidebar (landscape)');
            this.eventBus.emit('ui:sidebar:toggle', {});
        } else {
            // Portrait: Let NotificationShade handle it (V1 behavior)
            Logger.input('[MobileUX] Action: NotificationShade (portrait) - passing through');
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
                Logger.warn(`Error attempting to enable fullscreen: ${err.message}`);
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
            Logger.ui('[MobileUX] Scroll indicators observer active');
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

                    Logger.ui('[MobileUX] Scroll indicator added to bubble');
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
