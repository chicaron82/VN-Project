/**
 * NOTIFICATION FACTORY - UNIFIED CREATION
 *
 * Builder methods for creating notifications across all systems.
 * Reduces duplication and ensures consistent configuration.
 *
 * "One kitchen, many dishes." - The Factory
 */

import type {
    ToastConfig,
    RailNotificationConfig,
    NotificationPriority
} from './NotificationCore';
import {
    validateNotificationConfig,
    getNotificationDuration
} from './NotificationCore';

// =============================================================================
// TOAST BUILDERS
// =============================================================================

/**
 * Create a basic toast notification
 */
export function createToast(
    message: string,
    options: Partial<ToastConfig> = {}
): ToastConfig {
    const config: ToastConfig = {
        message,
        priority: options.priority || 'normal',
        duration: options.duration ?? getNotificationDuration(options.priority || 'normal'),
        icon: options.icon,
        category: options.category || 'info',
        type: options.type || 'info',
        dismissible: options.dismissible ?? true,
        pulse: options.pulse ?? false,
        interactive: options.interactive ?? false
    };

    validateNotificationConfig(config);
    return config;
}

/**
 * Create an error toast (high priority, red)
 */
export function createErrorToast(
    message: string,
    options: Partial<ToastConfig> = {}
): ToastConfig {
    return createToast(message, {
        ...options,
        priority: 'high',
        category: 'error',
        type: 'error',
        icon: options.icon || '❌',
        pulse: true
    });
}

/**
 * Create a success toast (normal priority, green)
 */
export function createSuccessToast(
    message: string,
    options: Partial<ToastConfig> = {}
): ToastConfig {
    return createToast(message, {
        ...options,
        priority: 'normal',
        category: 'success',
        type: 'success',
        icon: options.icon || '✅',
        duration: options.duration ?? 3000
    });
}

/**
 * Create a warning toast (high priority, orange)
 */
export function createWarningToast(
    message: string,
    options: Partial<ToastConfig> = {}
): ToastConfig {
    return createToast(message, {
        ...options,
        priority: 'high',
        category: 'warning',
        type: 'warning',
        icon: options.icon || '⚠️'
    });
}

/**
 * Create an info toast (low priority, blue)
 */
export function createInfoToast(
    message: string,
    options: Partial<ToastConfig> = {}
): ToastConfig {
    return createToast(message, {
        ...options,
        priority: 'low',
        category: 'info',
        type: 'info',
        icon: options.icon || 'ℹ️'
    });
}

// =============================================================================
// RAIL NOTIFICATION BUILDERS
// =============================================================================

/**
 * Generate unique notification ID
 */
function generateNotificationId(): string {
    return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a rail notification (persistent, stacked)
 */
export function createRailNotification(
    config: Omit<RailNotificationConfig, 'id'> & { id?: string }
): RailNotificationConfig {
    const notification: RailNotificationConfig = {
        id: config.id || generateNotificationId(),
        message: config.message,
        title: config.title,
        priority: config.priority || 'normal',
        category: config.category || 'info',
        icon: config.icon,
        duration: config.duration ?? getNotificationDuration(config.priority || 'normal'),
        dismissible: config.dismissible ?? true,
        appId: config.appId,
        actionLabel: config.actionLabel,
        actionCallback: config.actionCallback
    };

    validateNotificationConfig(notification);
    return notification;
}

/**
 * Create a ToriGatchi notification (urgent, interactive)
 */
export function createToriNotification(
    message: string,
    options: Partial<RailNotificationConfig> = {}
): RailNotificationConfig {
    return createRailNotification({
        ...options,
        message,
        category: 'torigatchi',
        priority: 'urgent',
        icon: options.icon || '🐣',
        appId: 'torigatchi',
        actionLabel: options.actionLabel || 'Feed Tori'
    });
}

/**
 * Create an achievement notification (high priority, celebratory)
 */
export function createAchievementNotification(
    title: string,
    message: string,
    options: Partial<RailNotificationConfig> = {}
): RailNotificationConfig {
    return createRailNotification({
        ...options,
        title,
        message,
        category: 'achievement',
        priority: 'high',
        icon: options.icon || '🏆',
        appId: 'achievements'
    });
}

/**
 * Create an autosave notification (low priority, informational)
 */
export function createAutosaveNotification(
    message: string = 'Game auto-saved',
    options: Partial<RailNotificationConfig> = {}
): RailNotificationConfig {
    return createRailNotification({
        ...options,
        message,
        category: 'autosave',
        priority: 'low',
        icon: options.icon || '💾',
        duration: options.duration ?? 2000,
        appId: 'game'
    });
}

/**
 * Create a tether warning notification (urgent, requires action)
 */
export function createTetherWarning(
    message: string,
    options: Partial<RailNotificationConfig> = {}
): RailNotificationConfig {
    return createRailNotification({
        ...options,
        message,
        category: 'tether',
        priority: 'urgent',
        icon: options.icon || '⚠️',
        duration: 0, // Persistent
        appId: 'game'
    });
}

/**
 * Create a note received notification (normal priority)
 */
export function createNoteNotification(
    title: string,
    message: string,
    options: Partial<RailNotificationConfig> = {}
): RailNotificationConfig {
    return createRailNotification({
        ...options,
        title,
        message,
        category: 'note',
        priority: 'normal',
        icon: options.icon || '📝',
        appId: 'notes',
        actionLabel: options.actionLabel || 'Read Note'
    });
}

// =============================================================================
// CONFIRMATION MODAL BUILDER
// =============================================================================

export interface ConfirmationConfig {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    priority?: NotificationPriority;
}

/**
 * Create a confirmation modal configuration
 * (Used by StatusNotificationController)
 */
export function createConfirmation(
    title: string,
    message: string,
    options: Partial<ConfirmationConfig> = {}
): ConfirmationConfig {
    return {
        title,
        message,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        priority: options.priority || 'normal'
    };
}

// =============================================================================
// BATCH BUILDERS
// =============================================================================

/**
 * Create multiple notifications at once (for testing or bulk operations)
 */
export function createNotificationBatch(
    messages: string[],
    baseConfig: Partial<Omit<RailNotificationConfig, 'id' | 'message' | 'priority'>> & { priority?: NotificationPriority } = {}
): RailNotificationConfig[] {
    return messages.map(message => createRailNotification({
        ...baseConfig,
        message,
        priority: baseConfig.priority || 'normal'
    }));
}
