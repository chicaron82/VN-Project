import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
            "id": "2026-01-14-b",
            "date": "January 14, 2026",
            "emoji": "📢",
            "title": "StatusNotificationController - Toast System",
            "type": "order-entry",
            "summary": "Faithful V1→V2 port of the unified toast notification system. Queue management, priority interruption, and 9 convenience methods for user feedback.",
            "metrics": {
                "linesAdded": 694,
                "filesChanged": 3,
                "testsWritten": 40,
                "testsPassing": 31
            },
            "features": [
                "📢 <strong>8 Notification Types:</strong> note, save, warning, error, skip, tutorial, info, auto-save",
                "🎯 <strong>Priority Queue:</strong> critical > high > normal > low with interruption",
                "⏱️ <strong>Auto-Dismiss:</strong> Configurable timing (0 = persistent)",
                "🔄 <strong>Queue Management:</strong> Max 5 messages, priority-sorted",
                "👆 <strong>Click Handlers:</strong> Interactive notifications (note → open sidebar)"
            ],
            "codeComparison": {
                "before": {
                    "title": "V1 (JavaScript)",
                    "badge": "313 LINES",
                    "lang": "javascript",
                    "code": "// V1: status-notification-controller.js\nclass StatusNotificationController {\n  constructor(game) {\n    this.queue = [];\n    this.priorities = { critical: 100, high: 75, normal: 50, low: 25 };\n  }\n  show({ type, icon, message, duration, priority }) {\n    // Queue with priority sorting\n    // Auto-dismiss with timeout\n  }\n  showNote(sender, subject) { /* convenience method */ }\n}"
                },
                "after": {
                    "title": "V2 (TypeScript)",
                    "badge": "328 LINES + 366 TESTS",
                    "lang": "typescript",
                    "code": "// V2: StatusNotificationController.ts\nexport class StatusNotificationController {\n  private queue: NotificationOptions[] = [];\n  private priorities: Record<PriorityLevel, number> = {\n    critical: 100, high: 75, normal: 50, low: 25\n  };\n  show({ type, icon, message, duration, priority }: NotificationOptions): void\n  showNote(sender: string, subject: string): void\n  // + 7 more convenience methods, EventBus integration\n}"
                }
            },
            "sortDate": "2026-01-14T0b",
            "legacyPhase": "2026-01-14-b"
        };
