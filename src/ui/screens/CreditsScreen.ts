import { EventBus } from '../../core/EventBus';
import creditsData from '../../content/credits.json';

export class CreditsScreen {
    private container: HTMLElement;
    private eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.container = document.createElement('div');
        this.container.id = 'credits-screen';
        this.container.style.display = 'none';

        this.render();
        document.body.appendChild(this.container);

        this.setupListeners();
    }

    private render() {
        this.container.innerHTML = `
            <div class="credits-content">
                <h1 class="credits-title">${creditsData.title}</h1>
                
                <div class="credits-section">
                    <h2>DEVELOPMENT TEAM</h2>
                    ${creditsData.team.map(member => `
                        <div class="credit-role">${member.role}</div>
                        <div class="credit-name">${member.name}</div>
                    `).join('')}
                </div>
                
                <div class="credits-section">
                    <h2>SPECIAL THANKS</h2>
                    ${creditsData.specialThanks.map(name => `
                        <div class="credit-name">${name}</div>
                    `).join('')}
                </div>
                
                <div class="end-message">
                    THANK YOU FOR PLAYING
                </div>
            </div>
            
            <button class="credits-back-btn">RETURN</button>
        `;

        // Inline styles for now, later move to CSS
        const style = document.createElement('style');
        style.textContent = `
            #credits-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: #000;
                z-index: 3000;
                color: #fff;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            
            .credits-content {
                text-align: center;
                animation: scrollCredits 20s linear infinite;
                padding-bottom: 100vh; /* Allow full scroll off screen */
            }
            
            @keyframes scrollCredits {
                0% { transform: translateY(100vh); }
                100% { transform: translateY(-100%); }
            }
            
            .credits-title {
                font-family: 'Cinzel', serif;
                font-size: 3rem;
                margin-bottom: 2rem;
                color: var(--neon-cyan);
            }
            
            .credits-section {
                margin-bottom: 3rem;
            }
            
            .credits-section h2 {
                font-family: 'Outfit', sans-serif;
                font-size: 1.2rem;
                color: var(--neon-pink);
                margin-bottom: 1rem;
                letter-spacing: 2px;
            }
            
            .credit-role {
                font-size: 0.9rem;
                color: #888;
                margin-bottom: 0.2rem;
            }
            
            .credit-name {
                font-size: 1.2rem;
                font-weight: bold;
                margin-bottom: 1.5rem;
            }
            
            .credits-back-btn {
                position: absolute;
                bottom: 30px;
                padding: 10px 30px;
                background: transparent;
                border: 1px solid var(--neon-cyan);
                color: var(--neon-cyan);
                font-family: 'Outfit', sans-serif;
                cursor: pointer;
                transition: 0.3s;
                z-index: 3001; /* Above scrolling content */
            }
            
            .credits-back-btn:hover {
                background: var(--neon-cyan);
                color: #000;
            }
        `;
        this.container.appendChild(style);
    }

    private setupListeners() {
        // Event to show credits
        this.eventBus.on('ui:show_credits', () => {
            this.show();
        });

        // Back button
        const btn = this.container.querySelector('.credits-back-btn');
        btn?.addEventListener('click', () => {
            this.hide();
        });
    }

    public show() {
        this.container.style.display = 'flex';
        // Reset animation
        const content = this.container.querySelector('.credits-content') as HTMLElement;
        content.style.animation = 'none';
        content.offsetHeight; /* trigger reflow */
        content.style.animation = 'scrollCredits 20s linear infinite';
    }

    public hide() {
        this.container.style.display = 'none';
        // Return to main menu
        this.eventBus.emit('ui:show_main_menu', {});
    }
}
