import { EventBus } from '../core/EventBus';

export interface MenuCard {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    action: () => void;
}

/**
 * MainMenuView
 * Implements the V1-style card carousel for project navigation.
 */
export class MainMenuView {
    private container: HTMLElement;
    private eventBus: EventBus;
    private cards: MenuCard[];
    private activeIndex: number = 0;

    constructor(parent: HTMLElement, eventBus: EventBus) {
        this.container = document.createElement('div');
        this.container.className = 'menu-layer';
        parent.appendChild(this.container);

        this.eventBus = eventBus;
        this.cards = [
            {
                id: 'prologue',
                title: 'THE BEGINNING',
                subtitle: 'Recover the French Vanilla',
                icon: '☕',
                action: () => this.eventBus.emit('ui:start_prologue', {})
            },
            {
                id: 'chapters',
                title: 'CHAPTERS',
                subtitle: 'Fragmented Memories',
                icon: '📖',
                action: () => console.log('Chapters clicked')
            },
            {
                id: 'settings',
                title: 'SYSTEM',
                subtitle: 'Adjust Simulation',
                icon: '⚙️',
                action: () => console.log('Settings clicked')
            }
        ];

        this.render();
        this.injectStyles();
    }

    private render() {
        this.container.innerHTML = `
            <div class="menu-content">
                <h2 class="menu-title">PROJECT: VERSION 848</h2>
                <div class="carousel-container">
                    <div class="carousel-track">
                        ${this.cards.map((card, i) => `
                            <div class="menu-card ${i === this.activeIndex ? 'active' : ''}" data-index="${i}">
                                <div class="card-icon">${card.icon}</div>
                                <div class="card-info">
                                    <h3>${card.title}</h3>
                                    <p>${card.subtitle}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="menu-hint">PRESS [SPACE] TO INITIALIZE</div>
            </div>
        `;

        this.setupInteractions();
    }

    private setupInteractions() {
        const cards = this.container.querySelectorAll('.menu-card');
        cards.forEach((cardEl, i) => {
            cardEl.addEventListener('click', () => {
                if (i === this.activeIndex) {
                    this.cards[i].action();
                } else {
                    this.setActive(i);
                }
            });
        });

        // Keyboard navigation
        window.addEventListener('keydown', (e) => {
            if (this.container.style.display === 'none') return;

            if (e.key === 'ArrowRight') this.setActive((this.activeIndex + 1) % this.cards.length);
            if (e.key === 'ArrowLeft') this.setActive((this.activeIndex - 1 + this.cards.length) % this.cards.length);
            if (e.key === 'Enter' || e.key === ' ') this.cards[this.activeIndex].action();
        });
    }

    private setActive(index: number) {
        this.activeIndex = index;
        const cards = this.container.querySelectorAll('.menu-card');
        cards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });

        const track = this.container.querySelector('.carousel-track') as HTMLElement;
        if (track) {
            const offset = (index * -320) + 160; // Center the active card
            track.style.transform = `translateX(${offset}px)`;
        }
    }

    public show() { this.container.style.display = 'flex'; }
    public hide() { this.container.style.display = 'none'; }

    private injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .menu-layer {
                position: absolute;
                inset: 0;
                background: radial-gradient(circle at center, #1a1a1a 0%, #000 100%);
                z-index: 500;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-family: 'Courier New', monospace;
            }
            .menu-content {
                text-align: center;
                width: 100%;
                overflow: hidden;
            }
            .menu-title {
                font-size: 2rem;
                letter-spacing: 8px;
                margin-bottom: 60px;
                color: #0ff;
                text-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
            }
            .carousel-container {
                position: relative;
                width: 100%;
                height: 400px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .carousel-track {
                display: flex;
                gap: 40px;
                transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
                padding: 0 50vw;
            }
            .menu-card {
                flex: 0 0 280px;
                height: 380px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 20px;
                padding: 30px;
                transition: all 0.4s;
                opacity: 0.4;
                transform: scale(0.9);
                cursor: pointer;
            }
            .menu-card.active {
                opacity: 1;
                transform: scale(1);
                background: rgba(0, 255, 255, 0.05);
                border-color: #0ff;
                box-shadow: 0 0 40px rgba(0, 255, 255, 0.15);
            }
            .card-icon {
                font-size: 4rem;
                margin-bottom: 20px;
            }
            .card-info h3 {
                font-size: 1.4rem;
                margin-bottom: 10px;
                letter-spacing: 2px;
            }
            .card-info p {
                font-size: 0.9rem;
                color: #888;
            }
            .menu-hint {
                margin-top: 60px;
                font-size: 0.8rem;
                letter-spacing: 4px;
                color: #555;
                animation: blink 2s infinite;
            }
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.2; }
            }
        `;
        document.head.appendChild(style);
    }
}
