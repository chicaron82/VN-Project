
import type { EventBus } from '@core/EventBus';
import type { StateManager } from '@core/StateManager';

/**
 * TutorialController - Contextual Gameplay Hints
 * 
 * Shows animated hints for mobile gestures and core mechanics.
 */
export class TutorialController {
    private eventBus: EventBus;
    private stateManager: StateManager;
    private activeTutorial: HTMLElement | null = null;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.setupListeners();
    }

    private setupListeners(): void {
        // Trigger swipe tutorial on first dialogue
        this.eventBus.on('dialog:show', () => {
            this.triggerTutorial('swipe_advance');
        });

        // Trigger shade tutorial on first pause
        this.eventBus.on('ui:pause_toggle', () => {
            this.triggerTutorial('shade_menu');
        });

        // Clear tutorial on interaction
        this.eventBus.on('dialog:advance', () => this.clearActive());
        this.eventBus.on('input:swipe_right', () => this.clearActive());
        this.eventBus.on('input:swipe_down', () => this.clearActive());
    }

    private triggerTutorial(id: string): void {
        if (this.isSeen(id)) return;

        switch (id) {
            case 'swipe_advance':
                this.showSwipeAdvance();
                break;
            case 'shade_menu':
                this.showShadeHint();
                break;
        }

        this.markSeen(id);
    }

    private showSwipeAdvance(): void {
        const el = document.createElement('div');
        el.className = 'tutorial-overlay tutorial-swipe-right';
        el.innerHTML = `
            <div class="tutorial-gesture">👆</div>
            <div class="tutorial-text">SWIPE RIGHT TO ADVANCE</div>
        `;
        document.body.appendChild(el);
        this.activeTutorial = el;

        // Auto-remove after 6 seconds
        setTimeout(() => this.clearActive(), 6000);
    }

    private showShadeHint(): void {
        const el = document.createElement('div');
        el.className = 'tutorial-overlay tutorial-swipe-down';
        el.innerHTML = `
            <div class="tutorial-gesture">👆</div>
            <div class="tutorial-text">SWIPE DOWN FOR QUICK MENU</div>
        `;
        document.body.appendChild(el);
        this.activeTutorial = el;

        // Auto-remove after 6 seconds
        setTimeout(() => this.clearActive(), 6000);
    }

    private clearActive(): void {
        if (this.activeTutorial) {
            const el = this.activeTutorial;
            el.classList.add('tutorial-fade-out');
            setTimeout(() => el.remove(), 500);
            this.activeTutorial = null;
        }
    }

    private isSeen(id: string): boolean {
        const seen = this.stateManager.get<string[]>('unlocks.tutorials_seen') || [];
        return seen.includes(id);
    }

    private markSeen(id: string): void {
        const seen = this.stateManager.get<string[]>('unlocks.tutorials_seen') || [];
        if (!seen.includes(id)) {
            seen.push(id);
            this.stateManager.set('unlocks.tutorials_seen', seen);
        }
    }
}
