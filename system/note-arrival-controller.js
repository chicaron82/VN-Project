/**
 * ========================================
 * NOTE ARRIVAL CONTROLLER
 * Shows phone-style notification when notes are unlocked
 * DIZEE Implementation
 * ========================================
 */

class NoteArrivalController {
    /**
     * @param {any} game - Game engine instance
     */
    constructor(game) {
        this.game = game;
        this.notification = document.getElementById('note-arrival-notification');
        this.fromElement = this.notification?.querySelector('.note-arrival-from');
        this.subjectElement = this.notification?.querySelector('.note-arrival-subject');
        this.iconElement = this.notification?.querySelector('.note-arrival-icon');
        this.progressFill = this.notification?.querySelector('.note-arrival-progress-fill');

        this.isShowing = false;
        this.queue = []; // Queue multiple notes
        this.hideTimeout = null;

        // Click to open note viewer
        if (this.notification) {
            this.notification.addEventListener('click', () => this.handleClick());
        }

        console.log('📬 NoteArrivalController initialized');
    }

    /**
     * Show a note arrival notification
     * @param {Object} note - Note data
     * @param {string} note.from - Sender name (e.g., "Z", "Tori", "Unknown")
     * @param {string} note.subject - Note subject/title
     * @param {string} [note.id] - Optional note ID for tracking
     * @param {string} [note.icon] - Optional custom icon (default: ✉️)
     */
    showArrival(note) {
        // Queue if already showing
        if (this.isShowing) {
            this.queue.push(note);
            console.log(`📬 Note queued: "${note.subject}" (${this.queue.length} in queue)`);
            return;
        }

        if (!this.notification) return;

        this.isShowing = true;
        this.currentNote = note;

        // Update content
        if (this.fromElement) {
            this.fromElement.textContent = `from ${note.from}`;
        }
        if (this.subjectElement) {
            this.subjectElement.textContent = note.subject;
        }
        if (this.iconElement) {
            this.iconElement.textContent = note.icon || '✉️';
        }

        // Apply route theming
        this.applyRouteTheme();

        // Apply sender-specific styling
        this.applySenderTheme(note.from);

        // Reset and restart progress animation
        if (this.progressFill) {
            this.progressFill.classList.remove('animating');
            void this.progressFill.offsetHeight; // Trigger reflow
            this.progressFill.classList.add('animating');
        }

        // Reset icon animation
        if (this.iconElement) {
            this.iconElement.style.animation = 'none';
            void this.iconElement.offsetHeight;
            this.iconElement.style.animation = '';
        }

        // Slide in
        this.notification.classList.add('visible');

        // Haptic feedback - short buzz
        this.triggerHaptic('medium');

        console.log(`📬 Note arrived: "${note.subject}" from ${note.from}`);

        // Auto-hide after 2.5 seconds (0.5s slide-in + 2s hold)
        this.hideTimeout = setTimeout(() => {
            this.hide();
        }, 2500);
    }

    /**
     * Apply route-specific theming
     */
    applyRouteTheme() {
        if (!this.notification) return;

        const route = this.game?.currentRoute?.constructor?.name || '';
        this.notification.classList.remove('ronnie-route', 'tori-route');

        if (route.toLowerCase().includes('tori')) {
            this.notification.classList.add('tori-route');
        } else if (route.toLowerCase().includes('ronnie')) {
            this.notification.classList.add('ronnie-route');
        }
    }

    /**
     * Apply sender-specific styling
     * @param {string} sender
     */
    applySenderTheme(sender) {
        if (!this.notification) return;

        // Remove existing sender classes
        this.notification.classList.remove('sender-unknown', 'sender-despair');

        const senderLower = sender.toLowerCase();
        if (senderLower === 'unknown' || senderLower === '???') {
            this.notification.classList.add('sender-unknown');
        } else if (senderLower === 'despair' || senderLower.includes('despair')) {
            this.notification.classList.add('sender-despair');
        }
    }

    /**
     * Handle click on notification - open note viewer
     */
    handleClick() {
        // Clear auto-hide timeout
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }

        // Hide notification immediately
        this.hide(true);

        // Open note viewer if game has the method
        if (this.game && typeof this.game.openStandaloneNotes === 'function') {
            setTimeout(() => {
                this.game.openStandaloneNotes();
            }, 200);
        }
    }

    /**
     * Hide the notification
     * @param {boolean} [immediate=false] - Skip animations if true
     */
    hide(immediate = false) {
        if (!this.notification) return;

        this.notification.classList.remove('visible');

        // Light haptic on dismiss
        if (!immediate) {
            this.triggerHaptic('light');
        }

        // Update mail icon in status bar
        this.updateMailIcon();

        // Process queue after animation completes
        const delay = immediate ? 100 : 400;
        setTimeout(() => {
            this.isShowing = false;
            this.currentNote = null;

            // Process queue
            if (this.queue.length > 0) {
                const nextNote = this.queue.shift();
                this.showArrival(nextNote);
            }
        }, delay);
    }

    /**
     * Update the mail icon in the status bar
     */
    updateMailIcon() {
        const mailIcon = document.getElementById('status-mail');
        const badge = mailIcon?.querySelector('.unread-badge');

        if (mailIcon) {
            mailIcon.style.display = 'flex';
            mailIcon.classList.add('visible');

            // Increment badge count
            if (badge) {
                const currentCount = parseInt(badge.textContent) || 0;
                badge.textContent = (currentCount + 1).toString();
            }
        }
    }

    /**
     * Trigger haptic feedback
     * @param {'light' | 'medium' | 'heavy'} type
     */
    triggerHaptic(type = 'medium') {
        if (!navigator.vibrate) return;

        const patterns = {
            light: 10,
            medium: 25,
            heavy: [30, 10, 30]
        };

        try {
            navigator.vibrate(patterns[type] || patterns.medium);
        } catch (e) {
            // Silently fail
        }
    }

    /**
     * Clear all queued notifications
     */
    clearQueue() {
        this.queue = [];
    }

    /**
     * Static helper - call from CollectiblesManager when a note is unlocked
     * @param {any} game - Game engine instance
     * @param {Object} noteData - Note data
     */
    static notifyNoteUnlocked(game, noteData) {
        if (game?.noteArrivalController) {
            game.noteArrivalController.showArrival({
                from: noteData.sender || noteData.from || 'Z',
                subject: noteData.title || noteData.subject || 'New Note',
                id: noteData.id,
                icon: noteData.icon
            });
        }
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.NoteArrivalController = NoteArrivalController;
}

// ES Module export
export { NoteArrivalController };
