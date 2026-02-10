import type { EventBus } from '@core/EventBus';
import type { StateManager } from '@core/StateManager';
import { Logger } from '@utils/Logger';

/**
 * StatusBarGestures - Touch gesture handling for status bar
 *
 * PHASE 26b: GESTURE SYSTEM (BOUGIE EDITION)
 * Swipe, long-press, double-tap, context menu
 * "Touch it like you mean it" 💎
 *
 * Extracted from StatusBar.ts (421 lines → dedicated module)
 */

export interface StatusBarGestureCallbacks {
    toggleScreenshotMode: () => void;
    pulseLoop: () => void;
    markAllNotesAsRead: () => void;
}

export interface StatusBarGestureState {
    tetherLevel: number;
    isScreenshotMode: boolean;
}

export class StatusBarGestures {
    private eventBus: EventBus;
    private stateManager: StateManager | null;
    private container: HTMLElement;
    private callbacks: StatusBarGestureCallbacks;
    private getState: () => StatusBarGestureState;

    private gestureState = {
        touchStartY: 0,
        touchStartX: 0,
        touchStartTime: 0,
        longPressTimer: null as ReturnType<typeof setTimeout> | null,
        lastTapTime: 0,
        isLongPress: false,
    };

    // Gesture thresholds
    private readonly SWIPE_THRESHOLD = 50;      // px to register as swipe
    private readonly LONG_PRESS_DELAY = 500;    // ms for long-press
    private readonly DOUBLE_TAP_DELAY = 300;    // ms between taps

    constructor(
        container: HTMLElement,
        eventBus: EventBus,
        stateManager: StateManager | null,
        callbacks: StatusBarGestureCallbacks,
        getState: () => StatusBarGestureState
    ) {
        this.container = container;
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.callbacks = callbacks;
        this.getState = getState;
    }

    /**
     * Set up gesture handlers on the status bar
     * Tori's rule: gestures only on explicit hit zones, not whole bar
     */
    public setup(enableGestures: boolean): void {
        if (!enableGestures) return;

        // Touch events on status bar container
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });

        // Context menu (right-click on desktop, handled via long-press on mobile)
        this.container.addEventListener('contextmenu', (e) => this.handleContextMenu(e));

        // Long-press on UV7 logo for App Switcher
        const logoTrigger = this.container.querySelector('#uv7-logo-trigger');
        if (logoTrigger) {
            this.setupLogoLongPress(logoTrigger as HTMLElement);
        }

        Logger.ui('👆 StatusBar gestures initialized');
    }

    /**
     * Handle touch start - record position and start long-press timer
     */
    private handleTouchStart(e: TouchEvent): void {
        const touch = e.touches[0];
        if (!touch) return;

        this.gestureState.touchStartX = touch.clientX;
        this.gestureState.touchStartY = touch.clientY;
        this.gestureState.touchStartTime = Date.now();
        this.gestureState.isLongPress = false;

        // Capture touch position for long-press callback
        const touchX = touch.clientX;
        const touchY = touch.clientY;

        // Start long-press timer for context menu
        this.gestureState.longPressTimer = setTimeout(() => {
            this.gestureState.isLongPress = true;
            this.showQuickActionsMenu(touchX, touchY);
            // Haptic feedback
            if (navigator.vibrate) navigator.vibrate([30, 20, 30]);
        }, this.LONG_PRESS_DELAY);
    }

    /**
     * Handle touch move - cancel long-press if moved too much
     */
    private handleTouchMove(e: TouchEvent): void {
        const touch = e.touches[0];
        if (!touch) return;

        const deltaX = Math.abs(touch.clientX - this.gestureState.touchStartX);
        const deltaY = Math.abs(touch.clientY - this.gestureState.touchStartY);

        // Cancel long-press if moved more than 10px
        if (deltaX > 10 || deltaY > 10) {
            if (this.gestureState.longPressTimer) {
                clearTimeout(this.gestureState.longPressTimer);
                this.gestureState.longPressTimer = null;
            }
        }
    }

    /**
     * Handle touch end - detect swipes and double-taps
     */
    private handleTouchEnd(e: TouchEvent): void {
        // Clear long-press timer
        if (this.gestureState.longPressTimer) {
            clearTimeout(this.gestureState.longPressTimer);
            this.gestureState.longPressTimer = null;
        }

        // If it was a long-press, don't process as tap/swipe
        if (this.gestureState.isLongPress) {
            this.gestureState.isLongPress = false;
            return;
        }

        const touch = e.changedTouches[0];
        if (!touch) return;

        const deltaX = touch.clientX - this.gestureState.touchStartX;
        const deltaY = touch.clientY - this.gestureState.touchStartY;
        const elapsed = Date.now() - this.gestureState.touchStartTime;

        // Check for swipe down (on status bar = quick actions)
        if (deltaY > this.SWIPE_THRESHOLD && Math.abs(deltaX) < this.SWIPE_THRESHOLD && elapsed < 500) {
            e.preventDefault();
            this.handleSwipeDown();
            return;
        }

        // Check for double-tap (on empty space = screenshot mode)
        const now = Date.now();
        if (now - this.gestureState.lastTapTime < this.DOUBLE_TAP_DELAY) {
            // Double-tap detected
            const target = e.target as HTMLElement;
            // Only trigger on empty status bar space (not on buttons/indicators)
            if (target === this.container || target.classList.contains('status-section')) {
                e.preventDefault();
                this.callbacks.toggleScreenshotMode();
                if (navigator.vibrate) navigator.vibrate(20);
            }
        }
        this.gestureState.lastTapTime = now;
    }

    /**
     * Handle swipe down on status bar - show quick actions
     */
    private handleSwipeDown(): void {
        Logger.ui('👇 Swipe down detected - showing quick actions');

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(15);

        // Show quick actions menu (or emit event for NotificationShade to handle)
        this.eventBus.emit('ui:shade:toggle', {});
    }

    /**
     * Set up long-press handler specifically for UV7 logo
     * Long-press logo → App Switcher (with haptic)
     */
    private setupLogoLongPress(logo: HTMLElement): void {
        let longPressTimer: ReturnType<typeof setTimeout> | null = null;
        let isLongPress = false;

        logo.addEventListener('touchstart', () => {
            isLongPress = false;
            longPressTimer = setTimeout(async () => {
                isLongPress = true;
                // Haptic feedback pattern: short-pause-long
                if (navigator.vibrate) navigator.vibrate([20, 50, 40]);

                // Open App Switcher
                try {
                    const { initializeAppSwitcher } = await import('./UV7AppSwitcher');
                    const appSwitcher = await initializeAppSwitcher();
                    appSwitcher.toggle();
                    Logger.ui('🚀 Long-press → App Switcher opened');
                } catch (error) {
                    Logger.warn('⚠️ App Switcher failed:', error);
                }
            }, this.LONG_PRESS_DELAY);
        }, { passive: true });

        logo.addEventListener('touchend', (e) => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            // If it was a long-press, prevent the regular click
            if (isLongPress) {
                e.preventDefault();
                e.stopPropagation();
            }
        });

        logo.addEventListener('touchmove', () => {
            // Cancel on move
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        }, { passive: true });
    }

    /**
     * Handle right-click context menu on status bar
     */
    private handleContextMenu(e: MouseEvent): void {
        e.preventDefault();

        const target = e.target as HTMLElement;
        const targetId = target.id || target.closest('[id]')?.id || '';

        // Build context-appropriate menu
        this.showContextMenu(e.clientX, e.clientY, targetId);
    }

    /**
     * Show context menu at position with options based on target
     */
    private showContextMenu(x: number, y: number, targetId: string): void {
        // Remove any existing context menu
        this.hideContextMenu();

        const menu = document.createElement('div');
        menu.className = 'status-bar-context-menu';
        menu.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            background: linear-gradient(145deg, rgba(26, 26, 46, 0.98), rgba(15, 15, 26, 0.98));
            border: 1px solid rgba(0, 255, 255, 0.3);
            border-radius: 8px;
            padding: 8px 0;
            min-width: 160px;
            z-index: 10001;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.9);
            opacity: 0;
            transform: scale(0.95) translateY(-5px);
            transition: all 0.15s ease;
        `;

        // Build menu items based on target
        const items = this.getContextMenuItems(targetId);
        items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.style.cssText = `
                padding: 8px 16px;
                cursor: pointer;
                transition: all 0.15s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            menuItem.innerHTML = `<span style="width: 16px;">${item.icon}</span> ${item.label}`;

            menuItem.addEventListener('mouseenter', () => {
                menuItem.style.background = 'rgba(0, 255, 255, 0.1)';
                menuItem.style.color = '#00ffff';
            });
            menuItem.addEventListener('mouseleave', () => {
                menuItem.style.background = '';
                menuItem.style.color = 'rgba(255, 255, 255, 0.9)';
            });
            menuItem.addEventListener('click', () => {
                item.action();
                this.hideContextMenu();
            });

            menu.appendChild(menuItem);
        });

        document.body.appendChild(menu);

        // Animate in
        requestAnimationFrame(() => {
            menu.style.opacity = '1';
            menu.style.transform = 'scale(1) translateY(0)';
        });

        // Close on click outside
        const closeHandler = (e: MouseEvent): void => {
            if (!menu.contains(e.target as Node)) {
                this.hideContextMenu();
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('click', closeHandler), 10);
    }

    /**
     * Get context menu items based on what was clicked
     */
    private getContextMenuItems(targetId: string): Array<{ icon: string; label: string; action: () => void }> {
        const baseItems = [
            {
                icon: '📸',
                label: 'Screenshot Mode',
                action: () => this.callbacks.toggleScreenshotMode()
            },
            {
                icon: '🔄',
                label: 'Refresh View',
                action: () => this.eventBus.emit('game:reset_view', {})
            }
        ];

        // Add context-specific items
        if (targetId === 'status-loop' || targetId.includes('loop')) {
            return [
                {
                    icon: '🔢',
                    label: `Loop v.${this.stateManager?.get('game.loopVersion') || 848}`,
                    action: () => this.callbacks.pulseLoop()
                },
                {
                    icon: '📜',
                    label: 'View Loop History',
                    action: () => this.eventBus.emit('ui:backlog:toggle', {})
                },
                ...baseItems
            ];
        }

        if (targetId === 'status-route' || targetId.includes('route')) {
            return [
                {
                    icon: '🔀',
                    label: 'Switch Route',
                    action: () => this.eventBus.emit('ui:show_route_select', {})
                },
                {
                    icon: '🏠',
                    label: 'Return to Menu',
                    action: () => this.eventBus.emit('ui:main_menu', {})
                },
                ...baseItems
            ];
        }

        if (targetId === 'status-tether' || targetId.includes('tether')) {
            const state = this.getState();
            return [
                {
                    icon: '⚡',
                    label: `Tether: ${Math.round(state.tetherLevel)}%`,
                    action: () => { } // Info only
                },
                {
                    icon: '💉',
                    label: 'Boost Tether (+10)',
                    action: () => this.eventBus.emit('tether:boost', { amount: 10 })
                },
                ...baseItems
            ];
        }

        if (targetId === 'status-notes' || targetId.includes('notes')) {
            return [
                {
                    icon: '📬',
                    label: 'Open Notes',
                    action: () => this.eventBus.emit('ui:notes:open', {})
                },
                {
                    icon: '✅',
                    label: 'Mark All Read',
                    action: () => this.callbacks.markAllNotesAsRead()
                },
                ...baseItems
            ];
        }

        // Default menu
        return [
            {
                icon: '🚀',
                label: 'App Switcher',
                action: async () => {
                    try {
                        const { initializeAppSwitcher } = await import('./UV7AppSwitcher');
                        const appSwitcher = await initializeAppSwitcher();
                        appSwitcher.toggle();
                    } catch (e) {
                        Logger.warn('App Switcher failed:', e);
                    }
                }
            },
            ...baseItems,
            {
                icon: '⚙️',
                label: 'Settings',
                action: () => this.eventBus.emit('settings:open', {})
            }
        ];
    }

    /**
     * Hide and remove context menu
     */
    private hideContextMenu(): void {
        const existing = document.querySelector('.status-bar-context-menu');
        if (existing) {
            existing.remove();
        }
    }

    /**
     * Show quick actions menu (swipe down or long-press)
     */
    private showQuickActionsMenu(x: number, y: number): void {
        Logger.ui('⚡ Quick Actions triggered at', x, y);

        // For now, toggle the notification shade
        // In future, could show a mini quick-actions panel
        this.eventBus.emit('ui:shade:toggle', {});
    }

    /**
     * Clean up gesture state
     */
    public cleanup(): void {
        if (this.gestureState.longPressTimer) {
            clearTimeout(this.gestureState.longPressTimer);
            this.gestureState.longPressTimer = null;
        }
        this.hideContextMenu();
    }
}
