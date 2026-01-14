import { EventBus } from '@core/EventBus';
import { MenuCarousel } from '@ui/components/MenuCarousel';
import '@ui/styles/main.css';
import desktopBg from '../../../assets/desktopVersion.webp';

export class MainMenu {
    private container: HTMLElement;
    private carousel: MenuCarousel;

    constructor(eventBus: EventBus) {
        this.container = document.createElement('div');
        this.container.id = 'main-menu';
        this.container.className = 'screen-container'; // Add grid/flex styles in layout
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';
        this.container.style.height = '100%';
        this.container.style.width = '100%';
        this.container.style.background = `url("${desktopBg}") no-repeat center center/cover`;

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
    }

    mount(parent: HTMLElement) {
        parent.appendChild(this.container);
        const content = this.container.querySelector('#main-menu-content') as HTMLElement;
        this.carousel.mount(content);
    }

    unmount() {
        this.carousel.unmount();
        this.container.remove();
    }
}
