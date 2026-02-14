/**
 * NotificationRail DOM Helpers
 * Extracted from NotificationRail.ts — stateless DOM creation, swipe handling, and utilities.
 *
 * All functions are pure (take parameters, return values) with no class state dependency.
 * This makes them independently testable.
 *
 * 💚🔥💀
 */

import type { PriorityColorScheme } from '@core/NotificationSystem/NotificationCore';
import { PRIORITY_COLORS } from '@core/NotificationSystem/NotificationCore';
import type { NotificationConfig, SwipeState } from './NotificationRailTypes';

// ========================================
// NOTIFICATION CARD CREATION
// ========================================

/**
 * Create a notification card DOM element with appropriate styling and content.
 */
export function createNotificationCard(
    config: NotificationConfig,
    escapeHtml: (text: string) => string,
    formatTime: (timestamp: number) => string,
): HTMLElement {
    const colors: PriorityColorScheme = PRIORITY_COLORS[config.priority];

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
            <span class="notification-title">${escapeHtml(config.title)}</span>
            <span class="notification-time">${formatTime(config.timestamp)}</span>
        </div>
        <div class="notification-message">${escapeHtml(config.message)}</div>
        ${config.actionLabel || config.dismissible !== false ? `
        <div class="notification-actions">
            ${config.actionLabel ? `
            <button class="notification-action-btn">${escapeHtml(config.actionLabel)}</button>
            ` : ''}
            ${config.dismissible !== false ? `
            <button class="notification-action-btn notification-dismiss-btn">Dismiss</button>
            ` : ''}
        </div>
        ` : ''}
        <span class="notification-swipe-indicator">→</span>
    `;

    return card;
}

// ========================================
// NOTIFICATION CARD HANDLERS
// ========================================

/**
 * Attach action/dismiss/click handlers to a notification card.
 */
export function setupNotificationCardHandlers(
    card: HTMLElement,
    config: NotificationConfig,
    onDismiss: (id: string) => void,
): void {
    // Action button
    const actionBtn = card.querySelector('.notification-action-btn:not(.notification-dismiss-btn)');
    if (actionBtn && config.actionCallback) {
        actionBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            config.actionCallback!();
            onDismiss(config.id);
        });
    }

    // Dismiss button
    const dismissBtn = card.querySelector('.notification-dismiss-btn');
    if (dismissBtn) {
        dismissBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            onDismiss(config.id);
        });
    }

    // Card click (expand or default action)
    card.addEventListener('click', () => {
        if (config.actionCallback) {
            config.actionCallback();
            onDismiss(config.id);
        }
    });
}

// ========================================
// SWIPE-TO-DISMISS
// ========================================

/**
 * Attach touch swipe-to-dismiss handlers to a notification card.
 */
export function setupSwipeHandlers(
    card: HTMLElement,
    id: string,
    swipeState: SwipeState,
    threshold: number,
    onDismiss: (id: string) => void,
): void {
    card.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        if (!touch) return;

        swipeState.startX = touch.clientX;
        swipeState.startY = touch.clientY;
        swipeState.currentX = touch.clientX;
        swipeState.isDragging = false;
        swipeState.targetId = id;
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
        if (swipeState.targetId !== id) return;

        const touch = e.touches[0];
        if (!touch) return;

        const deltaX = touch.clientX - swipeState.startX;
        const deltaY = Math.abs(touch.clientY - swipeState.startY);

        // Only allow horizontal swipes to the right
        if (deltaX > 10 && deltaY < 30) {
            swipeState.isDragging = true;
            swipeState.currentX = touch.clientX;

            card.classList.add('swiping');
            card.style.transform = `translateX(${Math.max(0, deltaX)}px)`;
            card.style.opacity = String(1 - (deltaX / (threshold * 2)));
        }
    }, { passive: true });

    card.addEventListener('touchend', () => {
        if (swipeState.targetId !== id) return;

        const deltaX = swipeState.currentX - swipeState.startX;

        card.classList.remove('swiping');

        if (swipeState.isDragging && deltaX > threshold) {
            // Dismiss
            onDismiss(id);
        } else {
            // Reset position
            card.style.transform = '';
            card.style.opacity = '';
        }

        swipeState.isDragging = false;
        swipeState.targetId = null;
    });
}

// ========================================
// CARD UPDATE
// ========================================

/**
 * Update an existing notification card's content and styling.
 */
export function updateNotificationCard(element: HTMLElement, config: NotificationConfig): void {
    const titleEl = element.querySelector('.notification-title');
    const messageEl = element.querySelector('.notification-message');
    const timeEl = element.querySelector('.notification-time');

    if (titleEl) titleEl.textContent = config.title;
    if (messageEl) messageEl.textContent = config.message;
    if (timeEl) timeEl.textContent = formatRelativeTime(config.timestamp);

    // Update priority styling
    const colors: PriorityColorScheme = PRIORITY_COLORS[config.priority];
    element.style.background = colors.bg;
    element.style.borderColor = colors.border;
    element.style.boxShadow = `0 4px 20px ${colors.glow}`;
}

// ========================================
// UTILITIES
// ========================================

/**
 * Format timestamp to relative time string (now, 5s, 3m, or HH:MM).
 */
export function formatRelativeTime(timestamp: number): string {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 5) return 'now';
    if (seconds < 60) return `${seconds}s`;
    if (minutes < 60) return `${minutes}m`;
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Escape HTML to prevent XSS in notification content.
 */
export function escapeNotificationHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
