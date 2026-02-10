import type { EventBus } from '@core/EventBus';
import { Logger } from '@utils/Logger';

/**
 * StatusBarMailSystem - Unread notes tracking with badge counter
 *
 * DIZEE: UNREAD NOTES SYSTEM (V1 Parity)
 * Email-style mail icon with badge counter
 *
 * Extracted from StatusBar.ts (~115 lines → dedicated module)
 */

export interface UnreadNote {
    id: string;
    title: string;
    sender: string;
    content: string;
    timestamp: number;
}

export class StatusBarMailSystem {
    private eventBus: EventBus;
    private mailEl: HTMLElement;
    private unreadBadgeEl: HTMLElement;
    private unreadNotes: Map<string, UnreadNote> = new Map();
    private hasShownFirstNoteTutorial: boolean = false;
    private getCurrentRoute: () => 'ronnie' | 'tori' | 'menu' | 'prologue';

    constructor(
        mailEl: HTMLElement,
        unreadBadgeEl: HTMLElement,
        eventBus: EventBus,
        getCurrentRoute: () => 'ronnie' | 'tori' | 'menu' | 'prologue'
    ) {
        this.mailEl = mailEl;
        this.unreadBadgeEl = unreadBadgeEl;
        this.eventBus = eventBus;
        this.getCurrentRoute = getCurrentRoute;
    }

    /**
     * Add an unread note - shows mail icon with badge
     * V1 Parity: notification-shade-controller.js addUnreadNote()
     */
    public addUnreadNote(id: string, title: string, sender: string, content: string = ''): void {
        // Add to unread notes map
        this.unreadNotes.set(id, {
            id,
            title,
            sender,
            content,
            timestamp: Date.now()
        });

        // Update mail icon
        this.updateMailIcon();

        // Pulse the mail icon
        this.pulseMail();

        // V1 Parity: First note tutorial trigger
        if (!this.hasShownFirstNoteTutorial && this.getCurrentRoute() === 'tori') {
            this.hasShownFirstNoteTutorial = true;
            // Emit tutorial event (if tutorial system is listening)
            this.eventBus.emit('ui:notification', {
                type: 'info',
                message: 'Tap the mail icon to read notes'
            });
        }

        Logger.ui(`📬 New unread note: ${sender} - ${title}`);
    }

    /**
     * Mark a note as read - removes from unread count
     * V1 Parity: notification-shade-controller.js markNoteAsRead()
     */
    public markNoteAsRead(id: string): void {
        if (this.unreadNotes.has(id)) {
            this.unreadNotes.delete(id);
            this.updateMailIcon();
            Logger.ui(`📭 Note marked as read: ${id}`);
        }
    }

    /**
     * Mark all notes as read
     */
    public markAllNotesAsRead(): void {
        this.unreadNotes.clear();
        this.updateMailIcon();
        Logger.ui('📭 All notes marked as read');
    }

    /**
     * Get unread count
     */
    public getUnreadCount(): number {
        return this.unreadNotes.size;
    }

    /**
     * Get most recent unread note (for preview)
     */
    public getMostRecentUnread(): UnreadNote | null {
        if (this.unreadNotes.size === 0) return null;

        // Get most recent by timestamp
        let mostRecent: UnreadNote | null = null;
        this.unreadNotes.forEach((note) => {
            if (!mostRecent || note.timestamp > mostRecent.timestamp) {
                mostRecent = note;
            }
        });
        return mostRecent;
    }

    /**
     * Update mail icon visibility and badge count
     * V1 Parity: notification-shade-controller.js updateMailIcon()
     */
    private updateMailIcon(): void {
        const count = this.unreadNotes.size;

        if (count > 0) {
            // Show mail icon
            this.mailEl.style.display = 'flex';
            // Update badge
            this.unreadBadgeEl.textContent = count > 9 ? '9+' : String(count);
            this.unreadBadgeEl.style.display = 'flex';
            // Add unread class for styling
            this.mailEl.classList.add('has-unread');
        } else {
            // Hide mail icon when no unread
            this.mailEl.style.display = 'none';
            this.unreadBadgeEl.style.display = 'none';
            this.mailEl.classList.remove('has-unread');
        }
    }

    /**
     * Pulse mail icon animation
     */
    public pulseMail(): void {
        if (!this.mailEl) return;
        this.mailEl.classList.add('pulse');
        setTimeout(() => {
            this.mailEl.classList.remove('pulse');
        }, 600);
    }
}
