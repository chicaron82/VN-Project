import type { EventBus, GameEvents } from '../../core/EventBus';
import { Logger } from '@utils/Logger';
import type {
    NotificationPriority,
    NotificationCategory as CoreNotificationCategory,
    NotificationConfig as CoreNotificationConfig,
} from '@core/NotificationSystem/NotificationCore';
import {
    PRIORITY_COLORS,
    DEFAULT_DURATIONS
} from '@core/NotificationSystem/NotificationCore';

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
 */

// ========================================
// NOTIFICATION TYPES & PRIORITIES
// ========================================

// Extend core category with app-specific ones
export type NotificationCategory = CoreNotificationCategory | 'torigatchi' | 'autosave' | 'tether' | 'note' | 'app';

// Extend core config with Rail-specific fields
// Make fields required that Rail needs
export interface NotificationConfig extends Omit<CoreNotificationConfig, 'id' | 'title' | 'icon' | 'category'> {
    id: string;                  // Required: UUID for tracking
    title: string;               // Required: Primary display text
    icon: string;                // Required: Visual identifier
    category: NotificationCategory; // Required: For categorization
    timestamp: number;           // When notification was created
    appId?: string;              // Associated app for badge counting
    dismissible?: boolean;       // Can be swiped away (default: true)
    sound?: boolean;             // Play notification sound (default: false per Tori's rule)
}

// Re-export NotificationPriority for backward compatibility
export type { NotificationPriority };

// Category icons (fallback if not specified)
const CATEGORY_ICONS: Record<NotificationCategory, string> = {
    // Core categories (from NotificationCore)
    system: '⚙️',
    info: 'ℹ️',
    error: '❌',
    success: '✅',
    warning: '⚠️',
    // App-specific categories
    torigatchi: '🐱',
    achievement: '🏆',
    autosave: '💾',
    tether: '⚡',
    note: '📬',
    app: '📱',
};

// ========================================
// NOTIFICATION RAIL CLASS
// ========================================

export class NotificationRail {
    private container!: HTMLElement;
    private railElement!: HTMLElement;
    private eventBus: EventBus;
    private notifications: Map<string, NotificationConfig> = new Map();
    private notificationElements: Map<string, HTMLElement> = new Map();
    private dismissTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
    private badgeCounts: Map<string, number> = new Map();
    private unsubscribers: (() => void)[] = [];

    // Swipe tracking
    private swipeState = {
        startX: 0,
        startY: 0,
        currentX: 0,
        isDragging: false,
        targetId: null as string | null,
    };

    // Configuration
    private readonly SWIPE_THRESHOLD = 80;   // px to trigger dismiss
    private readonly ANIMATION_DURATION = 300;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.createDOM();
        this.setupEventListeners();
        this.injectStyles();

        Logger.ui('🔔 NotificationRail initialized (Phase 26d)');
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
    // STYLE INJECTION
    // ========================================

    private injectStyles(): void {
        if (document.getElementById('notification-rail-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'notification-rail-styles';
        styles.textContent = `
            /* Notification card base */
            .notification-card {
                position: relative;
                width: 280px;
                padding: 12px 16px;
                border-radius: 12px;
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                font-family: 'Courier New', monospace;
                cursor: pointer;
                transform-origin: right center;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                opacity: 0;
                transform: translateX(100%) scale(0.9);
                touch-action: pan-y;
            }

            .notification-card.visible {
                opacity: 1;
                transform: translateX(0) scale(1);
            }

            .notification-card.dismissing {
                opacity: 0;
                transform: translateX(120%) scale(0.8);
            }

            .notification-card.stacked {
                position: absolute;
                right: 0;
            }

            /* Hover effect */
            .notification-card:hover {
                transform: translateX(-4px) scale(1.02);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            }

            .notification-card.swiping {
                transition: none !important;
            }

            /* Priority pulse animation for urgent */
            .notification-card.priority-urgent {
                animation: urgentPulse 2s ease-in-out infinite;
            }

            @keyframes urgentPulse {
                0%, 100% { box-shadow: 0 4px 20px rgba(255, 68, 68, 0.3); }
                50% { box-shadow: 0 4px 30px rgba(255, 68, 68, 0.6); }
            }

            /* Notification content layout */
            .notification-header {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 6px;
            }

            .notification-icon {
                font-size: 16px;
                flex-shrink: 0;
            }

            .notification-title {
                font-size: 12px;
                font-weight: bold;
                color: rgba(255, 255, 255, 0.95);
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .notification-time {
                font-size: 10px;
                color: rgba(255, 255, 255, 0.5);
                flex-shrink: 0;
            }

            .notification-message {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.8);
                line-height: 1.4;
                max-height: 2.8em;
                overflow: hidden;
            }

            .notification-actions {
                display: flex;
                gap: 8px;
                margin-top: 8px;
            }

            .notification-action-btn {
                flex: 1;
                padding: 6px 12px;
                border: 1px solid rgba(0, 255, 255, 0.4);
                border-radius: 6px;
                background: rgba(0, 255, 255, 0.1);
                color: #00ffff;
                font-size: 10px;
                font-family: inherit;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .notification-action-btn:hover {
                background: rgba(0, 255, 255, 0.2);
                border-color: rgba(0, 255, 255, 0.6);
            }

            .notification-dismiss-btn {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.2);
                color: rgba(255, 255, 255, 0.7);
            }

            .notification-dismiss-btn:hover {
                background: rgba(255, 100, 100, 0.2);
                border-color: rgba(255, 100, 100, 0.4);
                color: rgba(255, 150, 150, 0.9);
            }

            /* Swipe indicator */
            .notification-swipe-indicator {
                position: absolute;
                right: -30px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 14px;
                opacity: 0;
                transition: opacity 0.2s ease;
            }

            .notification-card.swiping .notification-swipe-indicator {
                opacity: 1;
            }

            /* Stack counter badge */
            .notification-stack-badge {
                position: absolute;
                top: -6px;
                right: -6px;
                background: linear-gradient(135deg, #ff6b9d, #ff4444);
                color: white;
                font-size: 10px;
                font-weight: bold;
                padding: 2px 6px;
                border-radius: 10px;
                min-width: 16px;
                text-align: center;
                box-shadow: 0 2px 8px rgba(255, 68, 68, 0.4);
            }

            /* Clear all button */
            .notification-clear-all {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                padding: 8px 16px;
                margin-top: 8px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 8px;
                color: rgba(255, 255, 255, 0.6);
                font-size: 11px;
                font-family: 'Courier New', monospace;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .notification-clear-all:hover {
                background: rgba(255, 100, 100, 0.1);
                border-color: rgba(255, 100, 100, 0.3);
                color: rgba(255, 150, 150, 0.9);
            }

            /* Category-specific styles */
            .notification-card.category-torigatchi .notification-icon {
                animation: bounce 1s ease infinite;
            }

            .notification-card.category-achievement {
                background: linear-gradient(145deg, rgba(50, 40, 10, 0.95), rgba(30, 25, 5, 0.98)) !important;
                border-color: rgba(255, 215, 0, 0.6) !important;
            }

            .notification-card.category-achievement .notification-icon {
                animation: shine 2s ease-in-out infinite;
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-3px); }
            }

            @keyframes shine {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.3); }
            }

            /* Slide-in animation for rail itself */
            #notification-rail-container.collapsed {
                transform: translateX(calc(100% + 20px));
            }

            #notification-rail-container {
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
        `;

        document.head.appendChild(styles);
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

        // Update DOM element
        const element = this.notificationElements.get(id);
        if (element) {
            this.updateNotificationElement(element, updated);
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
     * Create notification DOM element
     */
    private createNotificationElement(config: NotificationConfig): void {
        const colors = PRIORITY_COLORS[config.priority];

        const card = document.createElement('div');
        card.className = `notification-card priority-${config.priority} category-${config.category}`;
        card.dataset.id = config.id;
        card.style.cssText = `
            background: ${colors.bg};
            border: 1px solid ${colors.border};
            box-shadow: 0 4px 20px ${colors.glow};
        `;

        // Build inner HTML
        card.innerHTML = `
            <div class="notification-header">
                <span class="notification-icon">${config.icon}</span>
                <span class="notification-title">${this.escapeHtml(config.title)}</span>
                <span class="notification-time">${this.formatTime(config.timestamp)}</span>
            </div>
            <div class="notification-message">${this.escapeHtml(config.message)}</div>
            ${config.actionLabel || config.dismissible !== false ? `
            <div class="notification-actions">
                ${config.actionLabel ? `
                <button class="notification-action-btn">${this.escapeHtml(config.actionLabel)}</button>
                ` : ''}
                ${config.dismissible !== false ? `
                <button class="notification-action-btn notification-dismiss-btn">Dismiss</button>
                ` : ''}
            </div>
            ` : ''}
            <span class="notification-swipe-indicator">→</span>
        `;

        // Set up event handlers
        this.setupNotificationHandlers(card, config);

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
     * Set up event handlers for a notification card
     */
    private setupNotificationHandlers(card: HTMLElement, config: NotificationConfig): void {
        // Action button
        const actionBtn = card.querySelector('.notification-action-btn:not(.notification-dismiss-btn)');
        if (actionBtn && config.actionCallback) {
            actionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                config.actionCallback!();
                this.dismiss(config.id);
            });
        }

        // Dismiss button
        const dismissBtn = card.querySelector('.notification-dismiss-btn');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.dismiss(config.id);
            });
        }

        // Card click (expand or default action)
        card.addEventListener('click', () => {
            if (config.actionCallback) {
                config.actionCallback();
                this.dismiss(config.id);
            }
        });

        // Swipe-to-dismiss (touch)
        if (config.dismissible !== false) {
            this.setupSwipeHandlers(card, config.id);
        }
    }

    /**
     * Set up swipe-to-dismiss handlers
     */
    private setupSwipeHandlers(card: HTMLElement, id: string): void {
        card.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            if (!touch) return;

            this.swipeState.startX = touch.clientX;
            this.swipeState.startY = touch.clientY;
            this.swipeState.currentX = touch.clientX;
            this.swipeState.isDragging = false;
            this.swipeState.targetId = id;
        }, { passive: true });

        card.addEventListener('touchmove', (e) => {
            if (this.swipeState.targetId !== id) return;

            const touch = e.touches[0];
            if (!touch) return;

            const deltaX = touch.clientX - this.swipeState.startX;
            const deltaY = Math.abs(touch.clientY - this.swipeState.startY);

            // Only allow horizontal swipes to the right
            if (deltaX > 10 && deltaY < 30) {
                this.swipeState.isDragging = true;
                this.swipeState.currentX = touch.clientX;

                card.classList.add('swiping');
                card.style.transform = `translateX(${Math.max(0, deltaX)}px)`;
                card.style.opacity = String(1 - (deltaX / (this.SWIPE_THRESHOLD * 2)));
            }
        }, { passive: true });

        card.addEventListener('touchend', () => {
            if (this.swipeState.targetId !== id) return;

            const deltaX = this.swipeState.currentX - this.swipeState.startX;

            card.classList.remove('swiping');

            if (this.swipeState.isDragging && deltaX > this.SWIPE_THRESHOLD) {
                // Dismiss
                this.dismiss(id);
            } else {
                // Reset position
                card.style.transform = '';
                card.style.opacity = '';
            }

            this.swipeState.isDragging = false;
            this.swipeState.targetId = null;
        });
    }

    /**
     * Update notification element content
     */
    private updateNotificationElement(element: HTMLElement, config: NotificationConfig): void {
        const titleEl = element.querySelector('.notification-title');
        const messageEl = element.querySelector('.notification-message');
        const timeEl = element.querySelector('.notification-time');

        if (titleEl) titleEl.textContent = config.title;
        if (messageEl) messageEl.textContent = config.message;
        if (timeEl) timeEl.textContent = this.formatTime(config.timestamp);

        // Update priority styling
        const colors = PRIORITY_COLORS[config.priority];
        element.style.background = colors.bg;
        element.style.borderColor = colors.border;
        element.style.boxShadow = `0 4px 20px ${colors.glow}`;
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

    /**
     * Format timestamp to relative time
     */
    private formatTime(timestamp: number): string {
        const diff = Date.now() - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);

        if (seconds < 5) return 'now';
        if (seconds < 60) return `${seconds}s`;
        if (minutes < 60) return `${minutes}m`;
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    /**
     * Escape HTML to prevent XSS
     */
    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
