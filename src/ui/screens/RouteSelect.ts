import { EventBus } from '@core/EventBus';
import '@ui/styles/main.css';

export class RouteSelect {
    private container: HTMLElement;
    private eventBus: EventBus;
    private selectedRoute: 'ronnie' | 'tori' = 'ronnie';

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.container = document.createElement('div');
        this.container.id = 'route-select';
        this.container.innerHTML = `
            <div id="route-select-content">
                <div id="route-select-title">
                    <h2>CHOOSE YOUR PERSPECTIVE</h2>
                    <p>Two routes. Two truths. One bridge between them.</p>
                </div>

                <div id="route-portraits-container">
                    <div class="route-portrait ronnie-portrait active">
                        <img src="/assets/route-select-ronnie.webp" alt="Ronnie">
                    </div>
                    <div class="route-portrait tori-portrait">
                        <img src="/assets/route-select-tori.webp" alt="Tori">
                    </div>
                </div>

                <div id="route-toggle">
                    <button class="toggle-option active" data-route="ronnie">RONNIE</button>
                    <button class="toggle-option" data-route="tori">TORI</button>
                </div>

                <div id="route-info-display">
                     <div class="route-info-text">
                        <h3>RONNIE</h3>
                        <p>Fighting from the outside.</p>
                     </div>
                </div>

                <button id="route-play-button">PLAY AS RONNIE</button>
                <button id="back-to-menu">BACK</button>
            </div>
        `;

        this.bindEvents();
    }

    private bindEvents() {
        // Toggle Buttons
        const toggles = this.container.querySelectorAll('.toggle-option');
        toggles.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const route = (e.target as HTMLElement).dataset.route as 'ronnie' | 'tori';
                this.selectRoute(route);
            });
        });

        // Play Button
        this.container.querySelector('#route-play-button')?.addEventListener('click', () => {
            this.eventBus.emit('ui:start_game', { route: this.selectedRoute });
        });

        // Back Button
        this.container.querySelector('#back-to-menu')?.addEventListener('click', () => {
            this.eventBus.emit('ui:main_menu', {});
        });
    }

    private selectRoute(route: 'ronnie' | 'tori') {
        this.selectedRoute = route;
        this.eventBus.emit('ui:click', {});

        // Update UI logic (simplified for V2 MVP)
        const portraits = this.container.querySelectorAll('.route-portrait');
        portraits.forEach(p => p.classList.remove('active'));
        if (route === 'ronnie') this.container.querySelector('.ronnie-portrait')?.classList.add('active');
        else this.container.querySelector('.tori-portrait')?.classList.add('active');

        const btn = this.container.querySelector('#route-play-button') as HTMLElement;
        btn.innerText = `PLAY AS ${route.toUpperCase()}`;
        btn.style.color = route === 'ronnie' ? 'cyan' : 'magenta';
        btn.style.borderColor = route === 'ronnie' ? 'cyan' : 'magenta';

        // Update Info Text
        const info = this.container.querySelector('.route-info-text') as HTMLElement;
        if (route === 'ronnie') {
            info.innerHTML = `<h3>RONNIE</h3><p>Fighting from the outside.</p>`;
        } else {
            info.innerHTML = `<h3>TORI</h3><p>Trapped in the void.</p>`;
        }
    }

    mount(parent: HTMLElement) {
        parent.appendChild(this.container);
    }

    unmount() {
        this.container.remove();
    }
}
