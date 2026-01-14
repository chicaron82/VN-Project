import { EventBus } from '@core/EventBus';
import { MenuCarousel } from '@ui/components/MenuCarousel';
import { LoopController } from '@controllers/LoopController';
import '@ui/styles/main.css';
import desktopBg from '../../../assets/desktopVersion.webp';

/**
 * MainMenu - Main menu screen
 *
 * ZEE'S ADDITION: Dynamic title/subtitle/footer based on loop state 🖤
 * The version number isn't just a label - it's the story.
 *
 * Title states:
 * - DEFAULT (848): Clean cyan, "847 previous failures"
 * - FAILED (849+): Red glitch effect, "Attempt in progress"
 * - SUCCEEDED: Gold [FINAL], "The loop that closed"
 * - ACCEPTED: Cyan [ETERNAL], "Digital permanence achieved"
 */
export class MainMenu {
    private container: HTMLElement;
    private carousel: MenuCarousel;
    private eventBus: EventBus;
    private loopController: LoopController | null = null;
    private unsubscribeLoopUpdate: (() => void) | null = null;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.container = document.createElement('div');
        this.container.id = 'main-menu';
        this.container.className = 'screen-container';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';
        this.container.style.height = '100%';
        this.container.style.width = '100%';
        this.container.style.background = `url("${desktopBg}") no-repeat center center/cover`;

        // Initial HTML structure - LoopController will update the actual values
        this.container.innerHTML = `
            <div id="main-menu-content" style="text-align: center; z-index: 10;">
                <h1 style="font-size: 4rem; margin-bottom: 0.5rem; text-shadow: 0 0 20px cyan;">VERSION 848</h1>
                <div class="subtitle" style="font-size: 1.2rem; margin-bottom: 2rem; color: #ccc;">My Wife Is in a Coma... and in the Code</div>
            </div>
            <div class="menu-footer" style="position: absolute; bottom: 20px; font-size: 0.8rem; color: #666;">
                [Version 848 - 847 previous failures]
            </div>
        `;

        this.carousel = new MenuCarousel(eventBus);

        // Listen for loop updates to refresh display
        this.unsubscribeLoopUpdate = this.eventBus.on('loop:updated', () => {
            this.refreshLoopDisplay();
        });
    }

    /**
     * Set the LoopController reference
     * Call this after LoopController is instantiated in main.ts
     */
    setLoopController(loopController: LoopController): void {
        this.loopController = loopController;
    }

    /**
     * Refresh the title display from LoopController
     * Called when loop state changes or menu is shown
     */
    private refreshLoopDisplay(): void {
        if (this.loopController && this.container.parentElement) {
            this.loopController.updateTitleScreen();
        }
    }

    mount(parent: HTMLElement) {
        parent.appendChild(this.container);
        const content = this.container.querySelector('#main-menu-content') as HTMLElement;
        this.carousel.mount(content);

        // Update title display when menu is shown
        if (this.loopController) {
            this.loopController.updateTitleScreen();
        }
    }

    unmount() {
        this.carousel.unmount();
        this.container.remove();
    }

    /**
     * Cleanup event listeners
     */
    destroy(): void {
        if (this.unsubscribeLoopUpdate) {
            this.unsubscribeLoopUpdate();
            this.unsubscribeLoopUpdate = null;
        }
        this.unmount();
    }
}
