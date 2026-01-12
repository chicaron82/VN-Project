import { EventBus } from '@core/EventBus';
import { CarouselMomentum } from './CarouselMomentum';
import { SimpleCarousel } from './SimpleCarousel';
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

/**
 * MENU CAROUSEL MANAGER
 * Hybrid System: Switches between Simple (Portrait) & Momentum (Landscape)
 * Ported from V1 with exact mode-switching logic
 */
export class MenuCarousel {
    private container: HTMLElement;
    private track: HTMLElement;
    private viewport: HTMLElement;
    private dotsContainer: HTMLElement;
    private items: CarouselItem[];
    private eventBus: EventBus;

    // Active engine (either SimpleCarousel or CarouselMomentum)
    private activeEngine: SimpleCarousel | CarouselMomentum | null = null;
    private currentIndex: number = 1; // Start at Index 1 (Start Story)
    private resizeTimeout: any = null;
    private resizeListener: (() => void) | null = null;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        // Define cards matching V1
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
                action: () => this.eventBus.emit('ui:start_prologue', {})
            },
            {
                id: 'continue',
                title: 'CONTINUE',
                subtitle: 'Resume timeline',
                icon: '⏯️',
                background: 'radial-gradient(circle at top, #202025, #050511)',
                action: () => this.eventBus.emit('ui:load_menu', {})
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
                action: () => this.eventBus.emit('ui:notes:open', {})
            },
            {
                id: 'crew',
                title: 'CREW',
                subtitle: 'Meet the UV7 Team',
                icon: '👥',
                background: 'radial-gradient(circle at top, #301020, #050511)',
                // TODO: Port CrewScreen from V1 (crew-controller.js) for proper "Meet the Crew" experience
                // Currently shows credits as placeholder - V1 has 10 portrait screens with team bios
                action: () => this.eventBus.emit('ui:show_crew', {})
            },
            {
                id: 'torigatchi',
                title: 'TORIGATCHI',
                subtitle: 'Digital Pet System',
                icon: '👾',
                background: 'radial-gradient(circle at top, #002010, #050511)',
                locked: !window.secretCodesManager?.hasDiscoveredCode('torigatchi'),
                special: true,
                action: () => {
                    if (window.secretCodesManager?.hasDiscoveredCode('torigatchi')) {
                        // Launch Torigatchi (Placeholder for now)
                        alert('Torigatchi System: CONNECTION ESTABLISHED... [V2 Implementation Pending]');
                    }
                }
            }
        ];

        // Create container structure
        this.container = document.createElement('div');
        this.container.className = 'menu-carousel'; // Mode class added by setupHybridMode
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

        console.log('🎠 MenuCarousel Manager initialized - Hybrid Mode');
    }

    mount(parent: HTMLElement) {
        parent.appendChild(this.container);
        this.setupHybridMode();

        // Listen for resize to switch modes
        this.resizeListener = () => this.handleResize();
        window.addEventListener('resize', this.resizeListener);
    }

    unmount() {
        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
        }
        if (this.activeEngine) {
            this.activeEngine.destroy();
            this.activeEngine = null;
        }
        this.container.remove();
    }

    private setupHybridMode() {
        const isPortrait = window.innerWidth < 768;
        const desiredEngine = isPortrait ? 'SimpleCarousel' : 'CarouselMomentum';
        const currentEngineName = this.activeEngine ? this.activeEngine.constructor.name : null;

        // Only switch if different
        if (desiredEngine !== currentEngineName) {
            console.log(`🔄 Switching Carousel Mode: ${currentEngineName || 'None'} -> ${desiredEngine}`);

            // Destroy current
            if (this.activeEngine) {
                this.activeEngine.destroy();
            }

            // Init new
            if (isPortrait) {
                this.initSimpleMode();
            } else {
                this.initMomentumMode();
            }
        }
    }

    private initSimpleMode() {
        // SimpleCarousel handles its own rendering
        this.activeEngine = new SimpleCarousel(this.eventBus, this.items, this.container);
        this.activeEngine.init();
    }

    private initMomentumMode() {
        this.container.className = 'menu-carousel momentum-mode';
        this.renderItemsForMomentum();
        this.initMomentumEngine();
    }

    private renderItemsForMomentum() {
        this.track.innerHTML = '';

        // Render 3x Cloned set (Left, Middle, Right) for infinite scroll
        const sets = [this.items, this.items, this.items];

        sets.flat().forEach((item, index) => {
            const card = document.createElement('div');
            card.className = `carousel-card ${item.locked ? 'locked' : ''}`;
            card.style.background = item.background;

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

                card.onclick = () => {
                    if (this.activeEngine && (this.activeEngine as any).isDragging) return;
                    this.eventBus.emit('ui:click', {});
                    item.action();
                };
            }

            this.track.appendChild(card);
        });

        this.updateDots(this.currentIndex);
    }

    private initMomentumEngine() {
        const cardElements = Array.from(this.track.querySelectorAll('.carousel-card')) as HTMLElement[];
        if (cardElements.length === 0) return;

        const firstCard = cardElements[0];
        if (!firstCard) return;
        const cardWidth = firstCard.offsetWidth || 400;

        this.activeEngine = new CarouselMomentum({
            container: this.track,
            cards: cardElements,
            cardWidth: cardWidth,
            cardGap: 20,
            friction: 0.975,
            viewport: this.viewport,
            totalCards: this.items.length,
            onCardChange: (index) => {
                const realIndex = index % this.items.length;
                this.currentIndex = realIndex;
                this.updateDots(realIndex);
            }
        });

        // Jump to Initial Card in the Middle Set
        const middleOffset = this.items.length;
        const targetIndex = middleOffset + this.currentIndex;
        this.activeEngine.moveToCard(targetIndex, true);
    }

    private updateDots(activeIndex: number) {
        this.dotsContainer.innerHTML = '';
        this.items.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            if (index === activeIndex) dot.classList.add('active');

            dot.onclick = () => {
                if (this.activeEngine instanceof CarouselMomentum) {
                    const middleOffset = this.items.length;
                    this.activeEngine.moveToCard(middleOffset + index);
                } else if (this.activeEngine instanceof SimpleCarousel) {
                    // SimpleCarousel handles its own dot clicks
                }
            };

            this.dotsContainer.appendChild(dot);
        });
    }

    private handleResize() {
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.setupHybridMode();
        }, 100);
    }

    prev() {
        if (this.activeEngine) {
            this.eventBus.emit('ui:click', {});
            if (this.activeEngine instanceof CarouselMomentum) {
                this.activeEngine.moveToCard(this.activeEngine.getCurrentCard() - 1);
            }
            // SimpleCarousel doesn't expose prev/next publicly
        }
    }

    next() {
        if (this.activeEngine) {
            this.eventBus.emit('ui:click', {});
            if (this.activeEngine instanceof CarouselMomentum) {
                this.activeEngine.moveToCard(this.activeEngine.getCurrentCard() + 1);
            }
            // SimpleCarousel doesn't expose prev/next publicly
        }
    }
}
