
import type { EventBus } from '@core/EventBus';
import { Logger } from '@utils/Logger';
import { isLandscape } from '@utils/layout';


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
    private mutationObserver: MutationObserver | null = null;

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
        this.eventBus.on('input:swipe_down', (data) => this.handleSwipeDown(data));

        // Double-tap → fullscreen (via SwipeHandler)
        this.eventBus.on('input:double_tap', (data) => this.handleDoubleTap(data));
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

    private handleSwipeDown(data?: { startY?: number }): void {
        if (this.isSidebarVisible()) return;

        // If shade is already open, expand it (regardless of swipe origin)
        if (this.isShadeVisible()) {
            Logger.input('[MobileUX] Action: Expand Shade');
            this.eventBus.emit('ui:shade:expand', {});
            return;
        }

        // Top-edge guard: Only open shade/sidebar from swipes starting near top (< 80px)
        const startY = data?.startY ?? 0;
        if (startY >= 80) {
            Logger.input('[MobileUX] Swipe Down ignored (not from top edge)');
            return;
        }

        // Swipe Down routing: Portrait → Shade, Landscape → Sidebar
        if (isLandscape()) {
            Logger.input('[MobileUX] Action: Open Sidebar (landscape)');
            this.eventBus.emit('ui:sidebar:toggle', {});
        } else {
            Logger.input('[MobileUX] Action: NotificationShade (portrait)');
            this.eventBus.emit('ui:shade:toggle', {});
        }
    }

    // ===========================================
    // Fullscreen Logic
    // ===========================================

    private handleDoubleTap(data: { target?: EventTarget | null }): void {
        // Exclude grab handle / sidebar toggle from fullscreen double-tap
        const target = data.target as HTMLElement | null;
        if (target?.closest('#sidebar-toggle')) return;

        this.toggleFullscreen();
    }

    private toggleFullscreen(): void {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err: unknown) => {
                Logger.warn(`Error attempting to enable fullscreen: ${(err as Error).message}`);
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
        const checkScrollable = (): void => {
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
