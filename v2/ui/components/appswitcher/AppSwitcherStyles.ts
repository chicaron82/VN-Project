// ═══════════════════════════════════════════════════════════════
// APP SWITCHER STYLES
// CSS injection + shared type definitions
//
// Extracted from UV7AppSwitcher.ts (lines 120-260)
// Phase 26c: Enhanced styles for alive/heartbeat animations
// ═══════════════════════════════════════════════════════════════

/**
 * Inject enhanced styles for the app switcher.
 * Only injects once per page load.
 */
export function injectAppSwitcherStyles(): void {
    if (document.getElementById('uv7-app-switcher-enhanced-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'uv7-app-switcher-enhanced-styles';
    styles.textContent = `
        /* Phase 26c: Heartbeat animation for alive apps */
        @keyframes heartbeat {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.15); opacity: 0.8; }
        }

        @keyframes heartbeat-glow {
            0%, 100% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0); }
            50% { box-shadow: 0 0 15px 3px rgba(0, 255, 136, 0.4); }
        }

        .app-card.alive .app-preview-icon {
            animation: heartbeat 2s ease-in-out infinite;
        }

        .app-card.alive {
            animation: heartbeat-glow 2s ease-in-out infinite;
        }

        .app-card.alive::before {
            content: '';
            position: absolute;
            top: 8px;
            right: 8px;
            width: 8px;
            height: 8px;
            background: #00ff88;
            border-radius: 50%;
            animation: heartbeat 1s ease-in-out infinite;
            z-index: 10;
        }

        /* Phase 26c: Background indicator pill */
        .bg-indicator-pill {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(145deg, rgba(26, 26, 46, 0.95), rgba(15, 15, 26, 0.95));
            border: 1px solid rgba(0, 255, 255, 0.3);
            border-radius: 20px;
            padding: 8px 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            z-index: 9998;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.9);
            transition: all 0.3s ease;
            transform: translateY(100px);
            opacity: 0;
        }

        .bg-indicator-pill.visible {
            transform: translateY(0);
            opacity: 1;
        }

        .bg-indicator-pill:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
            border-color: rgba(0, 255, 255, 0.5);
        }

        .bg-indicator-pill.urgent {
            border-color: rgba(255, 100, 100, 0.5);
            animation: pulse-urgent 1.5s ease-in-out infinite;
        }

        @keyframes pulse-urgent {
            0%, 100% { box-shadow: 0 4px 20px rgba(255, 100, 100, 0.2); }
            50% { box-shadow: 0 4px 25px rgba(255, 100, 100, 0.5); }
        }

        .bg-indicator-icon {
            font-size: 16px;
        }

        .bg-indicator-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .bg-indicator-app {
            font-weight: bold;
            font-size: 11px;
        }

        .bg-indicator-state {
            font-size: 10px;
            opacity: 0.7;
        }

        .bg-indicator-close {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            padding: 2px 4px;
            font-size: 10px;
            transition: color 0.2s;
        }

        .bg-indicator-close:hover {
            color: rgba(255, 255, 255, 0.9);
        }

        /* Phase 26c: Activity badge on app cards */
        .app-activity-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            background: #ff4444;
            color: white;
            font-size: 10px;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 10px;
            animation: bounce-in 0.3s ease;
        }

        @keyframes bounce-in {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(styles);
}
