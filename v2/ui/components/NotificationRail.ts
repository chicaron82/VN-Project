import type { EventBus, GameEvents } from '../../core/EventBus';
import { Logger } from '@utils/Logger';
import {
    DEFAULT_DURATIONS
} from '@core/NotificationSystem/NotificationCore';

import type { NotificationConfig, NotificationCategory, SwipeState } from './NotificationRailTypes';
import { CATEGORY_ICONS } from './NotificationRailTypes';
import { injectNotificationRailStyles } from './NotificationRailStyles';
import {
    createNotificationCard,
    setupNotificationCardHandlers,
    setupSwipeHandlers,
    updateNotificationCard,
    formatRelativeTime,
    escapeNotificationHtml,
} from './NotificationRailDOM';

// Re-export types for backward compatibility
export type { NotificationConfig, NotificationCategory };
export type { NotificationPriority } from './NotificationRailTypes';

/**
 * NotificationRail - Premium Inline Notification System
 * Phase 26d: The cherry on top of the BOUGIE EDITION 💎
 *
 * Features:
 * - Slides in from right of status bar
 * - Stacked notifications with priority grouping
 * - Swipe-to-dismiss (individual + clear all)
 * - App-specific alerts (ToriGatchi, auto-save, achievements)
 * - Integration with App Switcher (badge counts)
 *
 * "Every notification is a moment of connection" 💚🔥💀
 *
 * REFACTORED: Now uses shared NotificationCore foundation
 * Extended with app-specific categories (torigatchi, autosave, etc.)
 *
 * DECOMPOSED: Types → NotificationRailTypes.ts
 *             CSS   → NotificationRailStyles.ts
 *             DOM   → NotificationRailDOM.ts
 */

export class NotificationRail {
    private container!: HTMLElement;
    private railElement!: HTMLElement;
    private eventBus: EventBus;
    private notifications: Map<string, NotificationConfig> = new Map();
    private notificationElements: Map<string, HTMLElement> = new Map();
    private dismissTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
    private badgeCounts: Map<string, number> = new Map();
    private unsubscribers: (() => void)[] = [];

    // Swipe gesture tracking (shared mutable state for touch handlers)
    private swipeState: SwipeState = {
        startX: 0,
        startY: 0,
        currentX: 0,
        isDragging: false,
        targetId: null,
    };

    private readonly SWIPE_THRESHOLD = 80;   // px to trigger dismiss
    private readonly ANIMATION_DURATION = 300;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.createDOM();
        this.setupEventListeners();
        injectNotificationRailStyles();
    }

    // ========================================
    // DOM CREATION
    // ========================================

    private createDOM(): void {
        // Create container that positions the rail
        this.container = document.createElement('div');
        this.container.id = 'notification-rail-container';
        this.container.style.cssText = `
            position: fixed;
            top: 36px;
            right: 12px;
            z-index: 9998;
            pointer-events: none;
            max-height: calc(100vh - 60px);
            overflow: visible;
        `;

        // Create the rail element (holds all notifications)
        this.railElement = document.createElement('div');
        this.railElement.id = 'notification-rail';
        this.railElement.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
            pointer-events: auto;
            max-height: calc(100vh - 80px);
            overflow-y: auto;
            overflow-x: visible;
            padding: 4px;
            scrollbar-width: none;
            -ms-overflow-style: none;
        `;

        // Hide scrollbar
        this.railElement.style.cssText += `
            &::-webkit-scrollbar { display: none; }
        `;

        this.container.appendChild(this.railElement);
        document.body.appendChild(this.container);
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    private setupEventListeners(): void {
        // Listen for notification requests
        const unsubNotify = this.eventBus.on('notification:show', (data: GameEvents['notification:show']) => {
            this.show({
                id: data.id || `notif-${Date.now()}`,
                title: data.title || 'Notification',
                message: data.message || '',
                icon: data.icon || CATEGORY_ICONS[data.category as NotificationCategory] || '📌',
                category: data.category || 'system',
                priority: data.priority || 'normal',
                timestamp: Date.now(),
                duration: data.duration,
                actionLabel: data.actionLabel,
                actionCallback: data.actionCallback,
                appId: data.appId,
                dismissible: data.dismissible !== false,
            });
        });
        this.unsubscribers.push(unsubNotify);

        // Listen for notification dismissal requests
        const unsubDismiss = this.eventBus.on('notification:dismiss', (data: GameEvents['notification:dismiss']) => {
            if (data.id) {
                this.dismiss(data.id);
            }
        });
        this.unsubscribers.push(unsubDismiss);

        // Listen for clear all
        const unsubClear = this.eventBus.on('notification:clear_all', () => {
            this.clearAll();
        });
        this.unsubscribers.push(unsubClear);

        // App-specific event listeners
        this.setupAppSpecificListeners();
    }

    /**
     * Set up listeners for app-specific events
     * ToriGatchi hunger, auto-save, achievements, tether warnings
     */
    private setupAppSpecificListeners(): void {
        // ToriGatchi hunger warning
        const unsubHunger = this.eventBus.on('torigatchi:hunger_warning', (data: GameEvents['torigatchi:hunger_warning']) => {
            this.show({
                id: 'torigatchi-hunger',
                title: 'ToriGatchi is Hungry!',
                message: data.message || 'Your pet needs attention soon...',
                icon: '🐱',
                category: 'torigatchi',
                priority: data.urgent ? 'urgent' : 'high',
                timestamp: Date.now(),
                duration: 0, // Persistent until addressed
                actionLabel: 'Feed Now',
                actionCallback: () => {
                    this.eventBus.emit('app:launch', { appId: 'torigatchi' } as never);
                },
                appId: 'torigatchi',
                dismissible: true,
            });
        });
        this.unsubscribers.push(unsubHunger);

        // Auto-save confirmation
        const unsubAutosave = this.eventBus.on('game:autosave', (data) => {
            this.show({
                id: `autosave-${Date.now()}`,
                title: 'Auto-Saved',
                message: data.scene ? `Progress saved at ${data.scene}` : 'Progress saved',
                icon: '💾',
                category: 'autosave',
                priority: 'low',
                timestamp: Date.now(),
                duration: 2000, // Quick confirmation
                dismissible: true,
            });
        });
        this.unsubscribers.push(unsubAutosave);

        // Achievement unlocked
        const unsubAchievement = this.eventBus.on('achievement:unlocked', (data) => {
            this.show({
                id: `achievement-${data.id || Date.now()}`,
                title: 'Achievement Unlocked!',
                message: data.title || data.description || 'You did something amazing!',
                icon: data.icon || '🏆',
                category: 'achievement',
                priority: 'high',
                timestamp: Date.now(),
                duration: 8000,
                actionLabel: 'View',
                actionCallback: () => {
                    this.eventBus.emit('ui:achievements:open', {});
                },
                dismissible: true,
            });

            // Haptic feedback for achievements
            if (navigator.vibrate) navigator.vibrate([50, 30, 100]);
        });
        this.unsubscribers.push(unsubAchievement);

        // Tether warning
        const unsubTether = this.eventBus.on('tether:warning', (data) => {
            const level = data.level || 0;
            const isCritical = level < 20;

            this.show({
                id: 'tether-warning',
                title: isCritical ? '⚠️ Tether Critical!' : 'Tether Low',
                message: `Connection at ${Math.round(level)}%${isCritical ? ' - Take action!' : ''}`,
                icon: '⚡',
                category: 'tether',
                priority: isCritical ? 'urgent' : 'high',
                timestamp: Date.now(),
                duration: isCritical ? 0 : 5000,
                dismissible: !isCritical,
            });
        });
        this.unsubscribers.push(unsubTether);

        // New note received
        const unsubNote = this.eventBus.on('note:received', (data) => {
            this.show({
                id: `note-${data.id || Date.now()}`,
                title: `New Note from ${data.sender || 'Unknown'}`,
                message: data.preview || data.title || 'You have a new note',
                icon: '📬',
                category: 'note',
                priority: 'normal',
                timestamp: Date.now(),
                duration: 6000,
                actionLabel: 'Read',
                actionCallback: () => {
                    this.eventBus.emit('ui:notes:open', { noteId: data.id });
                },
                dismissible: true,
            });
        });
        this.unsubscribers.push(unsubNote);
    }

    // ========================================
    // PUBLIC API
    // ========================================

    /**
     * Show a notification
     */
    public show(config: NotificationConfig): void {
        // Check if notification with same ID exists (update instead of duplicate)
        if (this.notifications.has(config.id)) {
            this.update(config.id, config);
            return;
        }

        // Apply default duration based on priority
        if (config.duration === undefined) {
            config.duration = DEFAULT_DURATIONS[config.priority];
        }

        // Store notification
        this.notifications.set(config.id, config);

        // Update badge count for associated app
        if (config.appId) {
            const count = (this.badgeCounts.get(config.appId) || 0) + 1;
            this.badgeCounts.set(config.appId, count);
            this.eventBus.emit('notification:badge_update', {
                appId: config.appId,
                count,
            });
        }

        // Create and show the notification element
        this.createNotificationElement(config);

        // Set up auto-dismiss timer if duration > 0
        if (config.duration && config.duration > 0) {
            const timer = setTimeout(() => {
                this.dismiss(config.id);
            }, config.duration);
            this.dismissTimers.set(config.id, timer);
        }

        // Emit event for tracking
        this.eventBus.emit('notification:shown', { id: config.id, category: config.category });

        Logger.ui(`🔔 Notification shown: ${config.title} [${config.priority}]`);
    }

    /**
     * Update an existing notification
     */
    public update(id: string, updates: Partial<NotificationConfig>): void {
        const existing = this.notifications.get(id);
        if (!existing) return;

        const updated = { ...existing, ...updates };
        this.notifications.set(id, updated);

        // Update DOM element via extracted helper
        const element = this.notificationElements.get(id);
        if (element) {
            updateNotificationCard(element, updated);
        }
    }

    /**
     * Dismiss a notification
     */
    public dismiss(id: string, skipAnimation: boolean = false): void {
        const config = this.notifications.get(id);
        const element = this.notificationElements.get(id);

        if (!config || !element) return;

        // Clear auto-dismiss timer
        const timer = this.dismissTimers.get(id);
        if (timer) {
            clearTimeout(timer);
            this.dismissTimers.delete(id);
        }

        // Update badge count
        if (config.appId) {
            const count = Math.max(0, (this.badgeCounts.get(config.appId) || 1) - 1);
            this.badgeCounts.set(config.appId, count);
            this.eventBus.emit('notification:badge_update', {
                appId: config.appId,
                count,
            });
        }

        // Animate out
        if (!skipAnimation) {
            element.classList.add('dismissing');
            setTimeout(() => {
                this.removeNotification(id);
            }, this.ANIMATION_DURATION);
        } else {
            this.removeNotification(id);
        }

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(10);
    }

    /**
     * Clear all notifications
     */
    public clearAll(): void {
        const ids = Array.from(this.notifications.keys());
        ids.forEach((id, index) => {
            // Stagger dismissals for visual effect
            setTimeout(() => {
                this.dismiss(id);
            }, index * 50);
        });

        Logger.ui('🧹 All notifications cleared');
    }

    /**
     * Get notification count
     */
    public getCount(): number {
        return this.notifications.size;
    }

    /**
     * Get notifications by category
     */
    public getByCategory(category: NotificationCategory): NotificationConfig[] {
        return Array.from(this.notifications.values())
            .filter(n => n.category === category);
    }

    /**
     * Get badge count for an app
     */
    public getBadgeCount(appId: string): number {
        return this.badgeCounts.get(appId) || 0;
    }

    /**
     * Destroy the notification rail
     */
    public destroy(): void {
        // Clear all timers
        this.dismissTimers.forEach(timer => clearTimeout(timer));
        this.dismissTimers.clear();

        // Unsubscribe from events
        this.unsubscribers.forEach(unsub => unsub());
        this.unsubscribers = [];

        // Remove DOM
        this.container.remove();

        Logger.ui('🔔 NotificationRail destroyed');
    }

    // ========================================
    // PRIVATE METHODS
    // ========================================

    /**
     * Create notification DOM element and attach it to the rail
     */
    private createNotificationElement(config: NotificationConfig): void {
        // Delegate card creation to extracted DOM helper
        const card = createNotificationCard(config, escapeNotificationHtml, formatRelativeTime);

        // Set up event handlers via extracted helper
        setupNotificationCardHandlers(card, config, (id) => this.dismiss(id));

        // Swipe-to-dismiss (touch)
        if (config.dismissible !== false) {
            setupSwipeHandlers(card, config.id, this.swipeState, this.SWIPE_THRESHOLD, (id) => this.dismiss(id));
        }

        // Add to rail and store reference
        this.railElement.insertBefore(card, this.railElement.firstChild);
        this.notificationElements.set(config.id, card);

        // Trigger entrance animation
        requestAnimationFrame(() => {
            card.classList.add('visible');
        });

        // Update stack display if needed
        this.updateStackDisplay();
    }

    /**
     * Remove notification from DOM and storage
     */
    private removeNotification(id: string): void {
        const element = this.notificationElements.get(id);
        if (element) {
            element.remove();
            this.notificationElements.delete(id);
        }

        this.notifications.delete(id);
        this.updateStackDisplay();

        // Emit event
        this.eventBus.emit('notification:dismissed', { id });
    }

    /**
     * Update visual stacking of notifications
     */
    private updateStackDisplay(): void {
        const count = this.notifications.size;

        // Show "clear all" button if multiple notifications
        let clearAllBtn = this.railElement.querySelector('.notification-clear-all');
        if (count > 1 && !clearAllBtn) {
            clearAllBtn = document.createElement('button');
            clearAllBtn.className = 'notification-clear-all';
            clearAllBtn.innerHTML = '🧹 Clear All';
            clearAllBtn.addEventListener('click', () => this.clearAll());
            this.railElement.appendChild(clearAllBtn);
        } else if (count <= 1 && clearAllBtn) {
            clearAllBtn.remove();
        }
    }
}

// ========================================
// FACTORY FUNCTION
// ========================================

let notificationRailInstance: NotificationRail | null = null;

/**
 * Initialize or get the NotificationRail singleton
 */
export function initializeNotificationRail(eventBus: EventBus): NotificationRail {
    if (!notificationRailInstance) {
        notificationRailInstance = new NotificationRail(eventBus);
    }
    return notificationRailInstance;
}

/**
 * Get the NotificationRail instance (if initialized)
 */
export function getNotificationRail(): NotificationRail | null {
    return notificationRailInstance;
}
