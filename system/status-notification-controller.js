/**
 * ========================================
 * STATUS NOTIFICATION CONTROLLER
 * Unified notification system for status bar
 * DIZEE Implementation
 * ========================================
 */

class StatusNotificationController {
    /**
     * @param {any} game - Game engine instance
     */
    constructor(game) {
        this.game = game;
        this.notification = document.getElementById('status-notification');
        this.iconElement = this.notification?.querySelector('.status-notif-icon');
        this.textElement = this.notification?.querySelector('.status-notif-text');
        this.progressFill = this.notification?.querySelector('.status-notif-progress-fill');

        this.isShowing = false;
        this.queue = []; // Queue for multiple messages
        this.currentTimeout = null;
        this.currentType = null;
        this.currentPriority = 'normal';

        // Priority weights (higher = more important)
        this.priorities = {
            critical: 100,  // Errors, tether death
            high: 75,       // Despair blocks, warnings
            normal: 50,     // Notes, saves
            low: 25         // Tutorial tips
        };

        // Setup click handler
        this.setupClickHandler();

        console.log('📢 StatusNotificationController initialized');
    }

    setupClickHandler() {
        if (!this.notification) return;

        this.notification.addEventListener('click', () => {
            if (!this.isShowing) return;

            // Type-specific actions
            if (this.currentType === 'note') {
                // Open sidebar to notes
                this.game.notificationShade?.showSidebar();
            }

            // Dismiss early
            this.hide();
        });
    }

    /**
     * Show a notification in the status bar
     * @param {Object} options
     * @param {string} options.type - 'note'|'save'|'warning'|'error'|'skip'|'tutorial'
     * @param {string} options.icon - Emoji icon
     * @param {string} options.message - Text to display
     * @param {number} [options.duration=2000] - How long to show (ms), 0 = persistent
     * @param {boolean} [options.pulse=false] - Add pulse animation
     * @param {'critical'|'high'|'normal'|'low'} [options.priority='normal'] - Message priority
     * @param {boolean} [options.interactive=false] - Show hover state for clickable messages
     */
    show({ type = 'info', icon = 'ℹ️', message, duration = 2000, pulse = false, priority = 'normal', interactive = false }) {
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
    addToQueue(options) {
        const weight = this.priorities[options.priority] || 50;

        // Insert based on priority (higher priority first)
        const index = this.queue.findIndex(item => {
            const itemWeight = this.priorities[item.priority] || 50;
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
     * @param {boolean} skipQueue - If true, don't process queue (for interrupts)
     */
    hide(skipQueue = false) {
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
                this.show(next);
            }
        }, 300); // Match CSS transition
    }

    // ========================================
    // CONVENIENCE METHODS
    // ========================================

    showNote(sender, subject) {
        this.show({
            type: 'note',
            icon: '✉️',
            message: `${sender}: ${subject}`,
            duration: 3000,
            priority: 'normal',
            interactive: true // Click to open sidebar
        });
    }

    showSave() {
        this.show({
            type: 'save',
            icon: '💾',
            message: 'Game saved',
            duration: 2000,
            priority: 'normal'
        });
    }

    showAutoSave() {
        this.show({
            type: 'save',
            icon: '💾',
            message: 'Auto-saved',
            duration: 1500,
            priority: 'low'
        });
    }

    showSkipping() {
        this.show({
            type: 'skip',
            icon: '⏭️',
            message: 'Skipping...',
            duration: 0, // Persistent
            pulse: true,
            priority: 'normal'
        });
    }

    showDespairBlock() {
        this.show({
            type: 'warning',
            icon: '🛡️',
            message: 'Despair blocked by echo',
            duration: 2500,
            priority: 'high'
        });
    }

    showTetherWarning() {
        this.show({
            type: 'warning',
            icon: '⚠️',
            message: 'Tether critical!',
            duration: 3000,
            pulse: true,
            priority: 'high'
        });
    }

    showTetherDeath() {
        this.show({
            type: 'error',
            icon: '💔',
            message: 'Tether severed!',
            duration: 3000,
            pulse: true,
            priority: 'critical'
        });
    }

    showTutorial(message) {
        this.show({
            type: 'tutorial',
            icon: '💡',
            message: message,
            duration: 4000,
            priority: 'low'
        });
    }

    showError(message) {
        this.show({
            type: 'error',
            icon: '❌',
            message: message,
            duration: 3000,
            priority: 'critical'
        });
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.StatusNotificationController = StatusNotificationController;
}

// ES Module export
export { StatusNotificationController };
