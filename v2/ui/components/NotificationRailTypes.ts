/**
 * NotificationRail Types & Constants
 * Extracted from NotificationRail.ts for clean separation of concerns.
 *
 * Extends NotificationCore types with app-specific categories and
 * Rail-specific configuration fields.
 *
 * "Every notification is a moment of connection" 💚🔥💀
 */

import type {
    NotificationPriority,
    NotificationCategory as CoreNotificationCategory,
    NotificationConfig as CoreNotificationConfig,
} from '@core/NotificationSystem/NotificationCore';

// ========================================
// NOTIFICATION TYPES & PRIORITIES
// ========================================

/** Extend core category with app-specific ones */
export type NotificationCategory = CoreNotificationCategory | 'torigatchi' | 'autosave' | 'tether' | 'note' | 'app';

/** Extend core config with Rail-specific fields (required id, title, icon, category) */
export interface NotificationConfig extends Omit<CoreNotificationConfig, 'id' | 'title' | 'icon' | 'category'> {
    id: string;                     // Required: UUID for tracking
    title: string;                  // Required: Primary display text
    icon: string;                   // Required: Visual identifier
    category: NotificationCategory; // Required: For categorization
    timestamp: number;              // When notification was created
    appId?: string;                 // Associated app for badge counting
    dismissible?: boolean;          // Can be swiped away (default: true)
    sound?: boolean;                // Play notification sound (default: false per Tori's rule)
}

/** Re-export NotificationPriority for backward compatibility */
export type { NotificationPriority };

/** Category icons (fallback if not specified) */
export const CATEGORY_ICONS: Record<NotificationCategory, string> = {
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

/** Swipe gesture tracking state */
export interface SwipeState {
    startX: number;
    startY: number;
    currentX: number;
    isDragging: boolean;
    targetId: string | null;
}
