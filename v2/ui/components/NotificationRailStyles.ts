/**
 * NotificationRail Styles
 * Extracted from NotificationRail.ts — pure CSS-in-JS for the notification rail UI.
 *
 * ~225 lines of stylesheet that were inlined in the main class.
 * Separated for maintainability (no behavioral logic here).
 *
 * 💚🔥💀
 */

// ========================================
// NOTIFICATION RAIL STYLESHEET
// ========================================

/** Complete CSS stylesheet for the notification rail system */
export const NOTIFICATION_RAIL_STYLESHEET = `
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

// ========================================
// STYLE INJECTION
// ========================================

/**
 * Inject notification rail styles into the document head.
 * Idempotent — won't inject twice.
 */
export function injectNotificationRailStyles(): void {
    if (document.getElementById('notification-rail-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'notification-rail-styles';
    styles.textContent = NOTIFICATION_RAIL_STYLESHEET;
    document.head.appendChild(styles);
}
