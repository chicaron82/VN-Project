
import { EventBus } from '@core/EventBus';

/**
 * AchievementToast - Premium visual feedback for achievement unlocks
 */
export class AchievementToast {
    private eventBus: EventBus;
    private container: HTMLElement;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.container = this.createContainer();
        this.setupListeners();
    }

    private createContainer(): HTMLElement {
        const div = document.createElement('div');
        div.id = 'achievement-toast-container';
        div.className = 'achievement-toast-container';
        document.body.appendChild(div);
        return div;
    }

    private setupListeners(): void {
        this.eventBus.on('achievement:unlocked', (data) => {
            this.show(data);
        });
    }

    public show(data: { title: string; description: string; icon: string }): void {
        const toast = document.createElement('div');
        toast.className = 'achievement-toast achievement-enter';

        toast.innerHTML = `
            <div class="achievement-icon">${data.icon}</div>
            <div class="achievement-text">
                <div class="achievement-label">ACHIEVEMENT UNLOCKED</div>
                <div class="achievement-title">${data.title.toUpperCase()}</div>
                <div class="achievement-desc">${data.description}</div>
            </div>
        `;

        this.container.appendChild(toast);

        // Sound effect (Haptic + minor vibrate if possible)
        if (navigator.vibrate) navigator.vibrate([30, 10, 30]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            toast.classList.replace('achievement-enter', 'achievement-exit');
            setTimeout(() => toast.remove(), 1000);
        }, 5000);
    }
}
