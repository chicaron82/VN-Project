/**
 * NOTIFICATION CORE - SHARED FOUNDATION
 *
 * Unified types, constants, and utilities used across all notification systems:
 * - StatusNotificationController (toast messages)
 * - NotificationRail (stacked persistent notifications)
 * - NotificationShade (quick actions menu)
 *
 * "One palette, three canvases." - The Consolidation
 */

// =============================================================================
// TYPES & ENUMS
// =============================================================================

/**
 * Priority levels for notifications (affects styling and behavior)
 */
export type NotificationPriority = 'urgent' | 'high' | 'normal' | 'low' | 'critical';

/**
 * Category classification for notifications
 */
export type NotificationCategory =
    | 'system'          // System messages
    | 'error'           // Error states
    | 'warning'         // Warning states
    | 'success'         // Success confirmations
    | 'info'            // Informational
    | 'torigatchi'      // ToriGatchi notifications
    | 'achievement'     // Achievement unlocks
    | 'autosave'        // Auto-save confirmations
    | 'tether'          // Tether warnings
    | 'note'            // Note received
    | 'app';            // App-specific

/**
 * Base configuration for all notification types
 */
export interface NotificationConfig {
    // Identity
    id?: string;                    // Unique ID (toast uses null, rail uses UUID)

    // Display
    title?: string;                 // Optional title (rail primary, toast rare)
    message: string;                // Main message content
    icon?: string;                  // Emoji or icon string
    category?: NotificationCategory;// Category for styling

    // Behavior
    priority: NotificationPriority; // Affects color, duration, interruption
    duration?: number;              // 0 = persistent, undefined = use default
    dismissible?: boolean;          // Can user dismiss? (default: true)

    // Interactivity (Rail-specific)
    actionLabel?: string;           // Button text (e.g., "View", "Dismiss")
    actionCallback?: () => void;    // Button click handler

    // Context (Rail-specific)
    appId?: string;                 // App that created notification (for badges)

    // Visual (Toast-specific)
    pulse?: boolean;                // Pulse animation on show
    interactive?: boolean;          // Clickable (opens sidebar/notes)
}

/**
 * Toast-specific configuration (extends base)
 */
export interface ToastConfig extends NotificationConfig {
    type?: 'confirmation' | 'error' | 'success' | 'info' | 'warning';
    interactive?: boolean;
    pulse?: boolean;
}

/**
 * Rail notification-specific configuration (extends base)
 */
export interface RailNotificationConfig extends NotificationConfig {
    id: string;                     // Required for rail (tracking)
    appId?: string;
    actionLabel?: string;
    actionCallback?: () => void;
}

// =============================================================================
// PRIORITY COLOR PALETTE
// =============================================================================

export interface PriorityColorScheme {
    border: string;
    glow: string;
    bg: string;
    text: string;
}

/**
 * Unified color palette for all priority levels
 * Used by StatusNotificationController, NotificationRail, and future systems
 */
export const PRIORITY_COLORS: Record<NotificationPriority, PriorityColorScheme> = {
    urgent: {
        border: 'rgba(255, 68, 68, 0.8)',
        glow: 'rgba(255, 68, 68, 0.4)',
        bg: 'linear-gradient(145deg, rgba(80, 20, 20, 0.95), rgba(40, 10, 10, 0.98))',
        text: '#ff4444'
    },
    high: {
        border: 'rgba(255, 165, 0, 0.7)',
        glow: 'rgba(255, 165, 0, 0.3)',
        bg: 'linear-gradient(145deg, rgba(60, 40, 10, 0.95), rgba(30, 20, 5, 0.98))',
        text: '#ff9933'
    },
    normal: {
        border: 'rgba(0, 255, 255, 0.5)',
        glow: 'rgba(0, 255, 255, 0.2)',
        bg: 'linear-gradient(145deg, rgba(26, 26, 46, 0.95), rgba(15, 15, 26, 0.98))',
        text: '#00ffff'
    },
    low: {
        border: 'rgba(255, 255, 255, 0.3)',
        glow: 'rgba(255, 255, 255, 0.1)',
        bg: 'linear-gradient(145deg, rgba(30, 30, 40, 0.9), rgba(20, 20, 30, 0.95))',
        text: '#99ccff'
    },
    critical: {
        border: 'rgba(255, 0, 0, 0.9)',
        glow: 'rgba(255, 0, 0, 0.6)',
        bg: 'linear-gradient(145deg, rgba(100, 10, 10, 0.95), rgba(50, 5, 5, 0.98))',
        text: '#ff0000'
    }
};

// =============================================================================
// DURATION DEFAULTS
// =============================================================================

/**
 * Default display durations by priority (milliseconds)
 * 0 = persistent (must be manually dismissed)
 */
export const DEFAULT_DURATIONS: Record<NotificationPriority, number> = {
    urgent: 0,          // Persistent - requires action
    critical: 0,        // Persistent - critical attention
    high: 10000,        // 10 seconds
    normal: 5000,       // 5 seconds
    low: 3000           // 3 seconds
};

// =============================================================================
// HELPER UTILITIES
// =============================================================================

/**
 * Escape HTML to prevent XSS attacks
 * Used when injecting user-provided strings into innerHTML
 */
export function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Format timestamp for display
 * @param date - Date object to format
 * @returns Formatted string (e.g., "2:30 PM")
 */
export function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

/**
 * Get duration for a notification based on priority
 * @param priority - Notification priority level
 * @param customDuration - Optional custom duration override
 * @returns Duration in milliseconds (0 = persistent)
 */
export function getNotificationDuration(
    priority: NotificationPriority,
    customDuration?: number
): number {
    // Custom duration takes precedence
    if (customDuration !== undefined) {
        return customDuration;
    }

    // Use default for priority
    return DEFAULT_DURATIONS[priority] || DEFAULT_DURATIONS.normal;
}

/**
 * Get color scheme for a notification based on priority
 * @param priority - Notification priority level
 * @returns Color scheme object
 */
export function getNotificationColors(priority: NotificationPriority): PriorityColorScheme {
    return PRIORITY_COLORS[priority] || PRIORITY_COLORS.normal;
}

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Validate notification configuration
 * @param config - Notification config to validate
 * @returns true if valid, throws error if invalid
 */
export function validateNotificationConfig(config: Partial<NotificationConfig>): boolean {
    if (!config.message || config.message.trim() === '') {
        throw new Error('Notification message is required');
    }

    if (config.priority && !PRIORITY_COLORS[config.priority]) {
        throw new Error(`Invalid priority: ${config.priority}`);
    }

    if (config.duration !== undefined && config.duration < 0) {
        throw new Error('Duration cannot be negative');
    }

    return true;
}
