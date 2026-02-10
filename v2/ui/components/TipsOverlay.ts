
import type { EventBus } from '@core/EventBus';

/**
 * TipsOverlay - Revolving tips for the Main Menu
 */
export class TipsOverlay {
    private eventBus: EventBus;
    private container: HTMLElement | null = null;
    private tipElement: HTMLElement | null = null;
    private interval: ReturnType<typeof setInterval> | null = null;
    private currentTipIndex: number = 0;

    private readonly TIPS = [
        "TIP: Swipe right to advance the story.",
        "TIP: Swipe down to access quick actions and settings.",
        "TIP: Use number keys 1-9 to make choices quickly.",
        "TIP: Check the Secret Archive for hidden information.",
        "TIP: Some endings unlock special gameplay modes.",
        "TIP: Toggle Auto-Mode in settings for hands-free reading.",
        "TIP: Reality is what you make of it. Or what it makes of you.",
        "TIP: If you're stuck, try jumping back in the history.",
        "TIP: High Tether levels make Tori's presence more stable."
    ];

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.setupListeners();
    }

    private setupListeners(): void {
        // Only show/start when on main menu
        this.eventBus.on('ui:main_menu', () => this.mount());
        this.eventBus.on('ui:start_game', () => this.unmount());
        this.eventBus.on('ui:route_select', () => this.unmount());
    }

    public mount(targetId: string = 'app'): void {
        if (this.container) return;

        this.container = document.createElement('div');
        this.container.className = 'tips-overlay';

        this.tipElement = document.createElement('div');
        this.tipElement.className = 'tip-text tip-fade-in';
        this.tipElement.textContent = this.TIPS[this.currentTipIndex] || '';

        this.container.appendChild(this.tipElement);

        const target = document.getElementById(targetId);
        if (target) {
            target.appendChild(this.container);
            this.startRotation();
        }
    }

    public unmount(): void {
        this.stopRotation();
        if (this.container) {
            this.container.remove();
            this.container = null;
            this.tipElement = null;
        }
    }

    private startRotation(): void {
        this.stopRotation();
        this.interval = setInterval(() => this.nextTip(), 8000);
    }

    private stopRotation(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    private nextTip(): void {
        if (!this.tipElement) return;

        this.tipElement.classList.replace('tip-fade-in', 'tip-fade-out');

        setTimeout(() => {
            this.currentTipIndex = (this.currentTipIndex + 1) % this.TIPS.length;
            if (this.tipElement) {
                this.tipElement.textContent = this.TIPS[this.currentTipIndex] || '';
                this.tipElement.classList.replace('tip-fade-out', 'tip-fade-in');
            }
        }, 800);
    }
}
