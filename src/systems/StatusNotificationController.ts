import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';

/**
 * ========================================
 * STATUS NOTIFICATION CONTROLLER
 * Unified notification system for status bar
 * DIZEE Implementation
 * ========================================
 */

type NotificationType = 'note' | 'save' | 'warning' | 'error' | 'skip' | 'tutorial' | 'info';
type PriorityLevel = 'critical' | 'high' | 'normal' | 'low';

interface NotificationOptions {
    type?: NotificationType;
    icon?: string;
    message: string;
    duration?: number;
    pulse?: boolean;
    priority?: PriorityLevel;
    interactive?: boolean;
}

export class StatusNotificationController {
    private notification: HTMLElement | null;
    private iconElement: HTMLElement | null;
    private textElement: HTMLElement | null;
    private progressFill: HTMLElement | null;

    private isShowing: boolean = false;
    private queue: NotificationOptions[] = []; // Queue for multiple messages
    private currentTimeout: ReturnType<typeof setTimeout> | null = null;
    private currentType: NotificationType | null = null;
    private currentPriority: PriorityLevel = 'normal';
    private isEnabled: boolean = false; // Disabled until game actually starts

    // Priority weights (higher = more important)
    private priorities: Record<PriorityLevel, number> = {
        critical: 100,  // Errors, tether death
        high: 75,       // Despair blocks, warnings
        normal: 50,     // Notes, saves
        low: 25         // Tutorial tips
    };

    private eventBus: EventBus;
    private stateManager: StateManager | null;

    constructor(eventBus: EventBus, stateManager?: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager || null;

        this.notification = document.getElementById('status-notification');
        this.iconElement = this.notification?.querySelector('.status-notif-icon') || null;
        this.textElement = this.notification?.querySelector('.status-notif-text') || null;
        this.progressFill = this.notification?.querySelector('.status-notif-progress-fill') || null;

        // Setup click handler
        this.setupClickHandler();

        console.log('📢 StatusNotificationController initialized (disabled until game starts)');
    }

    /**
     * Enable notifications (called when gameplay actually starts)
     */
    enable(): void {
        this.isEnabled = true;
        console.log('📢 Notifications enabled');
    }

    /**
     * Disable notifications (e.g., during loading, main menu)
     */
    disable(): void {
        this.isEnabled = false;
        this.hide(true); // Force hide any showing notification
        this.queue = []; // Clear queue
        console.log('📢 Notifications disabled');
    }

    private setupClickHandler(): void {
        if (!this.notification) return;

        this.notification.addEventListener('click', () => {
            if (!this.isShowing) return;

            // Type-specific actions
            if (this.currentType === 'note') {
                // Open sidebar to notes
                this.eventBus.emit('ui:open_sidebar', { tab: 'notes' });
            }

            // Dismiss early
            this.hide();
        });
    }

    /**
     * Show a notification in the status bar
     * @param options.type - 'note'|'save'|'warning'|'error'|'skip'|'tutorial'
     * @param options.icon - Emoji icon
     * @param options.message - Text to display
     * @param options.duration - How long to show (ms), 0 = persistent
     * @param options.pulse - Add pulse animation
     * @param options.priority - Message priority
     * @param options.interactive - Show hover state for clickable messages
     */
    show({ type = 'info', icon = 'ℹ️', message, duration = 2000, pulse = false, priority = 'normal', interactive = false }: NotificationOptions): void {
        // Don't show notifications if disabled (during init/loading/menu)
        if (!this.isEnabled) {
            console.log(`📢 Notification blocked (disabled): ${message}`);
            return;
        }

        // Handle priority interruption
        if (this.isShowing) {
            const currentWeight = this.priorities[this.currentPriority] || 50;
            const newWeight = this.priorities[priority] || 50;

            if (newWeight > currentWeight) {
                // Critical message interrupts current
                console.log(`🚨 Priority interrupt: ${priority} > ${this.currentPriority}`);
                this.hide(true); // Force hide without queue processing
            } else {
                // Queue normally
                this.addToQueue({ type, icon, message, duration, pulse, priority, interactive });
                return;
            }
        }

        if (!this.notification) return;

        this.isShowing = true;
        this.currentType = type;
        this.currentPriority = priority;

        // Update content
        if (this.iconElement) this.iconElement.textContent = icon;
        if (this.textElement) this.textElement.textContent = message;

        // Apply type class
        this.notification.className = 'visible';
        this.notification.classList.add(`type-${type}`);
        if (pulse) this.notification.classList.add('pulse');
        if (interactive) this.notification.classList.add('interactive');

        // Animate progress bar
        if (this.progressFill && duration > 0) {
            this.progressFill.style.transition = `transform ${duration}ms linear`;
            this.progressFill.style.transform = 'scaleX(1)';
            // Force reflow
            void this.progressFill.offsetHeight;
            this.progressFill.style.transform = 'scaleX(0)';
        }

        // Show notification
        this.notification.classList.add('visible');

        // Auto-hide (unless duration is 0 for persistent)
        if (duration > 0) {
            this.currentTimeout = setTimeout(() => {
                this.hide();
            }, duration);
        }
    }

    /**
     * Add message to queue with priority sorting
     */
    private addToQueue(options: NotificationOptions): void {
        const weight = this.priorities[options.priority || 'normal'] || 50;

        // Insert based on priority (higher priority first)
        const index = this.queue.findIndex(item => {
            const itemWeight = this.priorities[item.priority || 'normal'] || 50;
            return weight > itemWeight;
        });

        if (index === -1) {
            this.queue.push(options);
        } else {
            this.queue.splice(index, 0, options);
        }

        // Limit queue size (drop low priority if queue is full)
        if (this.queue.length > 5) {
            const lowPriorityIndex = this.queue.findIndex(item => item.priority === 'low');
            if (lowPriorityIndex !== -1) {
                this.queue.splice(lowPriorityIndex, 1);
                console.log('📉 Dropped low-priority message from full queue');
            }
        }
    }

    /**
     * Hide current notification
     * @param skipQueue - If true, don't process queue (for interrupts)
     */
    hide(skipQueue: boolean = false): void {
        if (!this.notification) return;

        // Clear timeout
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
        }

        // Reset progress bar
        if (this.progressFill) {
            this.progressFill.style.transition = 'none';
            this.progressFill.style.transform = 'scaleX(1)';
        }

        this.notification.classList.remove('visible', 'pulse', 'interactive');
        this.currentType = null;
        this.currentPriority = 'normal';

        // Process queue after fade out
        setTimeout(() => {
            this.isShowing = false;
            if (!skipQueue && this.queue.length > 0) {
                const next = this.queue.shift();
                if (next) {
                    this.show(next);
                }
            }
        }, 300); // Match CSS transition
    }

    // ========================================
    // CONVENIENCE METHODS
    // ========================================

    showNote(sender: string, subject: string): void {
        this.show({
            type: 'note',
            icon: '✉️',
            message: `${sender}: ${subject}`,
            duration: 3000,
            priority: 'normal',
            interactive: true // Click to open sidebar
        });
    }

    showSave(): void {
        this.show({
            type: 'save',
            icon: '💾',
            message: 'Game saved',
            duration: 2000,
            priority: 'normal'
        });
    }

    showAutoSave(): void {
        this.show({
            type: 'save',
            icon: '💾',
            message: 'Auto-saved',
            duration: 1500,
            priority: 'low'
        });
    }

    showSkipping(): void {
        this.show({
            type: 'skip',
            icon: '⏭️',
            message: 'Skipping...',
            duration: 0, // Persistent
            pulse: true,
            priority: 'normal'
        });
    }

    showDespairBlock(): void {
        this.show({
            type: 'warning',
            icon: '🛡️',
            message: 'Despair blocked by echo',
            duration: 2500,
            priority: 'high'
        });
    }

    showTetherWarning(): void {
        this.show({
            type: 'warning',
            icon: '⚠️',
            message: 'Tether critical!',
            duration: 3000,
            pulse: true,
            priority: 'high'
        });
    }

    showTetherDeath(): void {
        this.show({
            type: 'error',
            icon: '💔',
            message: 'Tether severed!',
            duration: 3000,
            pulse: true,
            priority: 'critical'
        });
    }

    showTutorial(message: string): void {
        this.show({
            type: 'tutorial',
            icon: '💡',
            message: message,
            duration: 4000,
            priority: 'low'
        });
    }

    showError(message: string): void {
        this.show({
            type: 'error',
            icon: '❌',
            message: message,
            duration: 3000,
            priority: 'critical'
        });
    }
}
