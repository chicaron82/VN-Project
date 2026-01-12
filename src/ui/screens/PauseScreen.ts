import { EventBus } from '@core/EventBus';
import '@ui/styles/main.css';

export class PauseScreen {
    private container: HTMLElement;
    private eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.container = document.createElement('div');
        this.container.id = 'pause-menu';
        this.container.className = 'overlay-screen'; // Define this in main.css if needed or use inline style for now
        this.container.style.position = 'absolute';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.background = 'rgba(0,0,0,0.8)';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';
        this.container.style.zIndex = '1000';

        this.container.innerHTML = `
            <div class="pause-content" style="background: black; border: 2px solid cyan; padding: 2rem; text-align: center;">
                <h2 style="color: cyan; margin-bottom: 2rem;">PAUSED</h2>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <button id="resume-btn" style="border: 1px solid cyan; padding: 10px; color: cyan;">RESUME</button>
                    <button id="settings-btn" style="border: 1px solid cyan; padding: 10px; color: cyan;">SETTINGS</button>
                    <button id="quit-btn" style="border: 1px solid red; padding: 10px; color: red;">QUIT TO MENU</button>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    private bindEvents() {
        this.container.querySelector('#resume-btn')?.addEventListener('click', () => {
            this.eventBus.emit('ui:pause_toggle', {}); // Controller handles resuming
        });

        this.container.querySelector('#quit-btn')?.addEventListener('click', () => {
            this.eventBus.emit('ui:main_menu', {});
        });

        this.container.querySelector('#settings-btn')?.addEventListener('click', () => {
            this.eventBus.emit('settings:open', {});
        });
    }

    mount(parent: HTMLElement) {
        parent.appendChild(this.container);
    }

    unmount() {
        this.container.remove();
    }
}
