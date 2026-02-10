import type { EventBus } from '@core/EventBus';
import { MenuCarousel } from '@ui/components/MenuCarousel';
import type { LoopController } from '@controllers/LoopController';
import type { VisualEffectsLayer } from '@ui/components/VisualEffectsLayer';
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
    // @ts-ignore - Keeps reference for effects
    private effectsLayer: VisualEffectsLayer;

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

        // Removed local effects overlay and initialization
        // Create overlay container for effects
        // const effectsOverlay = document.createElement('div');
        // effectsOverlay.className = 'menu-effects-overlay';
        // effectsOverlay.style.position = 'absolute';
        // effectsOverlay.style.top = '0';
        // effectsOverlay.style.left = '0';
        // effectsOverlay.style.width = '100%';
        // effectsOverlay.style.height = '100%';
        // effectsOverlay.style.pointerEvents = 'none';
        // effectsOverlay.style.zIndex = '20'; // Above background, below UI
        // this.container.appendChild(effectsOverlay);

        // Initialize Effects Layer
        // this.effectsLayer = new VisualEffectsLayer(this.container, effectsOverlay, eventBus);

        // Initial HTML structure - LoopController will update the actual values
        const contentDiv = document.createElement('div');
        contentDiv.id = 'main-menu-content';
        contentDiv.style.textAlign = 'center';
        contentDiv.style.zIndex = '30'; // Above effects
        contentDiv.innerHTML = `
            <h1 style="font-size: 4rem; margin-bottom: 0.5rem; text-shadow: 0 0 20px cyan;">VERSION 848</h1>
            <div class="subtitle" style="font-size: 1.2rem; margin-bottom: 2rem; color: #ccc;">My Wife Is in a Coma... and in the Code</div>
        `;
        this.container.appendChild(contentDiv);

        const footerDiv = document.createElement('div');
        footerDiv.className = 'menu-footer';
        footerDiv.style.position = 'absolute';
        footerDiv.style.bottom = '20px';
        footerDiv.style.fontSize = '0.8rem';
        footerDiv.style.color = '#666';
        footerDiv.style.zIndex = '30'; // Above effects
        footerDiv.innerHTML = '[Version 848 - 847 previous failures]';
        this.container.appendChild(footerDiv);

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

    mount(parent: HTMLElement): void {
        parent.appendChild(this.container);
        const content = this.container.querySelector('#main-menu-content') as HTMLElement;
        this.carousel.mount(content);

        // Update title display when menu is shown
        if (this.loopController) {
            this.loopController.updateTitleScreen();
        }
    }

    unmount(): void {
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
