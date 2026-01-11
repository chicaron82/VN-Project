import { EventBus } from '@core/EventBus';
import '@ui/styles/main.css';

export class RetryScreen {
    private container: HTMLElement;
    private eventBus: EventBus;
    private currentRoute: string = 'ronnie';
    private loopVersion: number = 848;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.container = document.createElement('div');
        this.container.id = 'retry-screen';
        this.container.style.display = 'none'; // Hidden by default

        // Basic styling to ensure it covers screen if CSS is missing
        this.container.style.position = 'fixed';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100vw';
        this.container.style.height = '100vh';
        this.container.style.background = '#000';
        this.container.style.zIndex = '2000';
        this.container.style.color = '#0f0';
        this.container.style.fontFamily = 'monospace';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';

        this.render();
        this.bindEvents();
    }

    public show(data: { currentRoute: string, loopVersion: number }) {
        this.currentRoute = data.currentRoute;
        this.loopVersion = data.loopVersion;
        this.render(); // Re-render with new data
        this.container.style.display = 'flex';

        // Add Matrix effect trigger here later
        this.eventBus.emit('effect:code_rain', { duration: 2000 });
    }

    public hide() {
        this.container.style.display = 'none';
    }

    private render() {
        this.container.innerHTML = `
            <div id="retry-content" style="text-align: center; gap: 20px; display: flex; flex-direction: column;">
                <h1 style="font-size: 3rem; text-shadow: 0 0 10px #0f0;">LOOP INITIALIZATION</h1>
                <h2 style="color: #0fa;">VERSION ${this.loopVersion}</h2>
                <div class="progress-bar-container" style="width: 300px; height: 10px; background: #333; margin: 20px auto;">
                    <div class="progress-fill" style="width: 100%; height: 100%; background: #0f0; box-shadow: 0 0 10px #0f0;"></div>
                </div>
                <p>TIMELINE RESET COMPLETE.</p>
                <p>Current Anchor: ${this.currentRoute.toUpperCase()}</p>
                
                <div style="margin-top: 40px; display: flex; gap: 20px; justify-content: center;">
                    <button id="retry-btn" style="
                        background: transparent; 
                        border: 2px solid #0f0; 
                        color: #0f0; 
                        padding: 15px 30px; 
                        font-family: monospace; 
                        cursor: pointer;
                        font-size: 1.2rem;
                        text-transform: uppercase;">
                        RETRY ROUTE
                    </button>
                    <button id="perspective-btn" style="
                        background: transparent; 
                        border: 2px solid #0ff; 
                        color: #0ff; 
                        padding: 15px 30px; 
                        font-family: monospace; 
                        cursor: pointer;
                        font-size: 1.2rem;
                        text-transform: uppercase;">
                        CHANGE PERSPECTIVE
                    </button>
                </div>
            </div>
        `;

        // Re-bind events after render
        this.container.querySelector('#retry-btn')?.addEventListener('click', () => {
            this.eventBus.emit('ui:click', {});
            this.eventBus.emit('ui:retry_choice', { choice: 'restart_route', route: this.currentRoute });
            this.hide();
        });

        this.container.querySelector('#perspective-btn')?.addEventListener('click', () => {
            this.eventBus.emit('ui:click', {});
            this.eventBus.emit('ui:retry_choice', { choice: 'change_perspective' });
            this.hide();
        });
    }

    private bindEvents() {
        // Initial binding if needed, but render handles it
    }

    mount(parent: HTMLElement) {
        parent.appendChild(this.container);
    }

    unmount() {
        this.container.remove();
    }
}
