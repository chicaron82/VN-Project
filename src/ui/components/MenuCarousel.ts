import { EventBus } from '@core/EventBus';
import '@ui/styles/main.css';

export interface CarouselItem {
    id: string;
    title: string;
    icon: string;
    subtitle: string;
    action: string;
    locked?: boolean;
}

export class MenuCarousel {
    private container: HTMLElement;
    private track: HTMLElement;
    private items: CarouselItem[];
    private currentIndex: number = 0;
    private eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.items = [
            { id: 'start', title: 'START', icon: '▶️', subtitle: 'Begin the cycle', action: 'ui:route_select' },
            { id: 'load', title: 'LOAD', icon: '📂', subtitle: 'Resume timeline', action: 'ui:load_menu' },
            { id: 'settings', title: 'SETTINGS', icon: '⚙️', subtitle: 'Adjust reality', action: 'ui:settings' },
            { id: 'credits', title: 'CREW', icon: '👥', subtitle: 'The UV7 Team', action: 'ui:credits' },
        ]; // Default items

        this.container = document.createElement('div');
        this.container.className = 'menu-carousel';

        // Structure matches V1 menu-carousel.css
        this.container.innerHTML = `
            <button class="carousel-arrow carousel-prev">◀</button>
            <div class="carousel-viewport">
                <div class="carousel-track"></div>
            </div>
            <button class="carousel-arrow carousel-next">▶</button>
            <div class="carousel-dots"></div>
            <div class="carousel-hint">Press ENTER to Select</div>
        `;

        this.track = this.container.querySelector('.carousel-track') as HTMLElement;

        // Bind events
        this.container.querySelector('.carousel-prev')?.addEventListener('click', () => this.prev());
        this.container.querySelector('.carousel-next')?.addEventListener('click', () => this.next());

        this.renderItems();
    }

    mount(parent: HTMLElement) {
        parent.appendChild(this.container);
        this.updateView();
    }

    unmount() {
        this.container.remove();
    }

    private renderItems() {
        this.track.innerHTML = '';
        this.items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = `carousel-card ${item.locked ? 'locked' : ''}`;
            card.dataset.index = index.toString();
            card.innerHTML = `
                <div class="card-icon">${item.icon}</div>
                <div class="card-title">${item.title}</div>
                <div class="card-subtitle">${item.subtitle}</div>
                <button class="card-button">${item.locked ? 'LOCKED' : 'SELECT'}</button>
            `;

            card.addEventListener('click', () => {
                if (this.currentIndex === index) {
                    this.select();
                } else {
                    this.currentIndex = index;
                    this.updateView();
                }
            });

            this.track.appendChild(card);
        });

        const dots = this.container.querySelector('.carousel-dots') as HTMLElement;
        dots.innerHTML = this.items.map((_, i) => `<div class="carousel-dot" data-index="${i}"></div>`).join('');
    }

    private updateView() {
        // Simple transform logic for V2 MVP (can replace with momentum later)
        const cardWidth = 400; // Matches CSS
        const gap = 20;
        const offset = -(this.currentIndex * (cardWidth + gap));

        this.track.style.transform = `translateX(${offset}px)`;

        // Update active class
        const cards = this.track.querySelectorAll('.carousel-card');
        cards.forEach((c, i) => {
            if (i === this.currentIndex) c.classList.add('card-active');
            else c.classList.remove('card-active');
        });

        // Update dots
        const dots = this.container.querySelectorAll('.carousel-dot');
        dots.forEach((d, i) => {
            if (i === this.currentIndex) d.classList.add('active');
            else d.classList.remove('active');
        });
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateView();
            this.eventBus.emit('ui:click', {}); // Generic click sound
        }
    }

    next() {
        if (this.currentIndex < this.items.length - 1) {
            this.currentIndex++;
            this.updateView();
            this.eventBus.emit('ui:click', {});
        }
    }

    select() {
        const item = this.items[this.currentIndex];
        if (!item) return;

        if (!item.locked) {
            this.eventBus.emit(item.action as keyof import('@core/EventBus').GameEvents, {} as any);
            this.eventBus.emit('ui:confirm', {});
        } else {
            this.eventBus.emit('ui:denied', {});
        }
    }
}
