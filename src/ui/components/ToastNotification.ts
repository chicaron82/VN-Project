
import { EventBus } from '@core/EventBus';
import { Achievement } from '@systems/AchievementSystem';

export class ToastNotification {
    private container: HTMLElement;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_eventBus: EventBus) {
        // _eventBus reserved for future event-driven toasts
        this.container = this.createContainer();

        // In a real implementation, we'd listen for a specific event carrying the achievement data.
        // For now, let's assume we might need to pass data through visual:cue or a custom event.
        // Refactoring EventBus to carry Achievement payload for 'achievement:unlock' is best.
    }

    private createContainer(): HTMLElement {
        const div = document.createElement('div');
        div.id = 'toast-container';
        div.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 20000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(div);
        return div;
    }

    public show(achievement: Achievement) {
        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.style.cssText = `
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #0ff;
            color: #fff;
            padding: 15px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            gap: 15px;
            min-width: 300px;
            font-family: 'Courier New', monospace;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
            transform: translateX(120%);
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;

        toast.innerHTML = `
            <div style="font-size: 2em;">${achievement.icon}</div>
            <div>
                <div style="color: #0ff; font-size: 0.8em; font-weight: bold; margin-bottom: 2px;">ACHIEVEMENT UNLOCKED</div>
                <div style="font-size: 1.1em; font-weight: bold;">${achievement.name}</div>
                <div style="color: #aaa; font-size: 0.9em;">${achievement.description}</div>
            </div>
        `;

        this.container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });

        // Remove after delay
        setTimeout(() => {
            toast.style.transform = 'translateX(120%)';
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 4000);
    }
}
