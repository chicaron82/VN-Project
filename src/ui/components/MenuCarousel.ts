import { EventBus } from '@core/EventBus';
import { CarouselMomentum } from './CarouselMomentum';
import '@ui/styles/main.css';

export interface CarouselItem {
    id: string;
    title: string;
    icon: string;
    subtitle: string;
    action: () => void;
    background: string;
    locked?: boolean;
    special?: boolean;
}

export class MenuCarousel {
    private container: HTMLElement;
    private track: HTMLElement;
    private viewport: HTMLElement;
    private dotsContainer: HTMLElement;
    private items: CarouselItem[];
    private eventBus: EventBus;
    private momentumEngine: CarouselMomentum | null = null;

    // Default to middle set index relative to single set
    private initialIndex: number = 1;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        // Define cards matching V1 MomentumAdapter
        // Actions emit events for GameEngine/UIController to handle
        this.items = [
            {
                id: 'settings',
                title: 'SETTINGS',
                subtitle: 'Configure experience',
                icon: '⚙️',
                background: 'radial-gradient(circle at top, #202020, #050511)',
                action: () => this.eventBus.emit('ui:settings', {})
            },
            {
                id: 'start',
                title: 'START STORY',
                subtitle: 'Begin Version 848',
                icon: '▶️',
                background: 'radial-gradient(circle at top, #202030, #050511)',
                action: () => this.eventBus.emit('ui:route_select', {})
            },
            {
                id: 'continue',
                title: 'CONTINUE',
                subtitle: 'Resume timeline',
                icon: '⏯️',
                background: 'radial-gradient(circle at top, #202025, #050511)',
                action: () => this.eventBus.emit('ui:load_menu', {}) // Fallback to load menu if no quick continue
            },
            {
                id: 'load',
                title: 'LOAD GAME',
                subtitle: 'Restore saved timeline',
                icon: '💾',
                background: 'radial-gradient(circle at top, #102010, #050511)',
                action: () => this.eventBus.emit('ui:load_menu', {})
            },
            {
                id: 'notes',
                title: 'NOTES',
                subtitle: 'Collected fragments',
                icon: '📝',
                background: 'radial-gradient(circle at top, #101030, #050511)',
                action: () => this.eventBus.emit('ui:notes', {})
            },
            {
                id: 'credits',
                title: 'CREW',
                subtitle: 'The UV7 Team',
                icon: '👥',
                background: 'radial-gradient(circle at top, #301020, #050511)',
                action: () => this.eventBus.emit('ui:credits', {})
            }
        ];

        this.container = document.createElement('div');
        this.container.className = 'menu-carousel momentum-mode';
        this.container.id = 'menu-carousel';

        this.container.innerHTML = `
            <button class="carousel-arrow carousel-prev"><span>◀</span></button>
            <div class="carousel-viewport" id="carousel-viewport">
                <div class="carousel-track" id="carousel-track"></div>
            </div>
            <button class="carousel-arrow carousel-next"><span>▶</span></button>
            <div class="carousel-dots" id="carousel-dots"></div>
            <div class="carousel-hint">Scroll to navigate • Tap to select</div>
        `;

        this.track = this.container.querySelector('.carousel-track') as HTMLElement;
        this.viewport = this.container.querySelector('.carousel-viewport') as HTMLElement;
        this.dotsContainer = this.container.querySelector('.carousel-dots') as HTMLElement;

        // Bind arrow events
        this.container.querySelector('.carousel-prev')?.addEventListener('click', () => this.prev());
        this.container.querySelector('.carousel-next')?.addEventListener('click', () => this.next());
    }

    mount(parent: HTMLElement) {
        parent.appendChild(this.container);
        this.renderItems();
        this.initMomentum();
    }

    unmount() {
        if (this.momentumEngine) {
            this.momentumEngine.destroy();
            this.momentumEngine = null;
        }
        this.container.remove();
    }

    private renderItems() {
        this.track.innerHTML = '';

        // Render 3x Cloned set (Left, Middle, Right) for infinite scroll
        const sets = [this.items, this.items, this.items];

        sets.flat().forEach((item, index) => {
            const card = document.createElement('div');
            // 'torigatchi-special' class logic omitted as item doesn't have it yet, but structure exists
            card.className = `carousel-card ${item.locked ? 'locked' : ''}`;
            card.style.background = item.background;

            // Real index (0 to length-1)
            const realIndex = index % this.items.length;
            card.dataset.realIndex = realIndex.toString();

            if (item.locked) {
                card.innerHTML = `
                    <div class="card-lock-overlay">
                        <div class="lock-icon">🔒</div>
                        <div class="lock-title">${item.title}</div>
                        <div class="lock-text">LOCKED</div>
                    </div>`;
            } else {
                card.innerHTML = `
                    <div class="card-icon">${item.icon}</div>
                    <div class="card-title">${item.title}</div>
                    <div class="card-subtitle">${item.subtitle}</div>
                    <button class="card-button">${item.icon} SELECT</button>
                `;

                // Click handler
                card.onclick = () => {
                    if (this.momentumEngine && this.momentumEngine['isDragging']) return;

                    // Simple confirm: trigger action
                    this.eventBus.emit('ui:click', {});
                    item.action();
                };
            }

            this.track.appendChild(card);
        });

        this.updateDots(this.initialIndex);
    }

    private initMomentum() {
        const cardElements = Array.from(this.track.querySelectorAll('.carousel-card')) as HTMLElement[];
        if (cardElements.length === 0) return;

        // Measure first card width for config
        const firstCard = cardElements[0];
        if (!firstCard) return;
        const cardWidth = firstCard.offsetWidth || 400;

        this.momentumEngine = new CarouselMomentum({
            container: this.track,
            cards: cardElements,
            cardWidth: cardWidth,
            cardGap: 20,
            friction: 0.975,
            viewport: this.viewport,
            totalCards: this.items.length,
            onCardChange: (index) => {
                const realIndex = index % this.items.length;
                this.updateDots(realIndex);
            }
        });

        // Jump to Initial Card in the Middle Set
        const middleOffset = this.items.length;
        const targetIndex = middleOffset + this.initialIndex;
        this.momentumEngine.moveToCard(targetIndex, true);
    }

    private updateDots(activeIndex: number) {
        this.dotsContainer.innerHTML = '';
        this.items.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            if (index === activeIndex) dot.classList.add('active');

            dot.onclick = () => {
                if (this.momentumEngine) {
                    // Calculate target index in the CURRENT set or Middle set
                    // For logic simplicity, we jump to middle set equivalent
                    const middleOffset = this.items.length;
                    this.momentumEngine.moveToCard(middleOffset + index);
                }
            };

            this.dotsContainer.appendChild(dot);
        });
    }

    prev() {
        if (this.momentumEngine) {
            this.eventBus.emit('ui:click', {});
            // Use internal index logic of momentum engine
            this.momentumEngine.moveToCard(this.momentumEngine.getCurrentCard() - 1);
        }
    }

    next() {
        if (this.momentumEngine) {
            this.eventBus.emit('ui:click', {});
            this.momentumEngine.moveToCard(this.momentumEngine.getCurrentCard() + 1);
        }
    }
}
