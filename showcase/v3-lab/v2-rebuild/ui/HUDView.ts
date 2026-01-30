import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';

/**
 * HUDView
 * The persistent heads-up display showing critical simulation status.
 */
export class HUDView {
    private container: HTMLElement;
    private eventBus: EventBus;
    private stateManager: StateManager;

    private tetherFill: HTMLElement | null = null;
    private tetherText: HTMLElement | null = null;
    private collectiblesCount: HTMLElement | null = null;

    constructor(parent: HTMLElement, eventBus: EventBus, stateManager: StateManager) {
        this.container = document.createElement('div');
        this.container.className = 'hud-layer';
        parent.appendChild(this.container);

        this.eventBus = eventBus;
        this.stateManager = stateManager;

        this.render();
        this.setupListeners();
        this.injectStyles();
    }

    private render() {
        this.container.innerHTML = `
            <div class="hud-top-left">
                <div class="hud-stat">
                    <span class="hud-label">TETHER</span>
                    <div class="hud-progress-bg">
                        <div id="hud-tether-fill" class="hud-progress-fill"></div>
                    </div>
                    <span id="hud-tether-text" class="hud-value">100%</span>
                </div>
            </div>
            <div class="hud-top-right">
                <div class="hud-stat">
                    <span class="hud-label">MEMORY</span>
                    <span id="hud-collectibles-count" class="hud-value">0</span>
                </div>
            </div>
        `;

        this.tetherFill = this.container.querySelector('#hud-tether-fill');
        this.tetherText = this.container.querySelector('#hud-tether-text');
        this.collectiblesCount = this.container.querySelector('#hud-collectibles-count');

        // Initial update
        this.updateTether(this.stateManager.get<number>('tetherLevel') || 100);
        this.updateCollectibles((this.stateManager.get<any[]>('collectibles') || []).length);
    }

    private setupListeners() {
        this.eventBus.on('tether:change', (data) => {
            this.updateTether(data.level);
        });

        this.stateManager.on('collectibles', (items: any[]) => {
            this.updateCollectibles(items.length);
        });
    }

    private updateTether(level: number) {
        if (this.tetherFill) this.tetherFill.style.width = `${level}%`;
        if (this.tetherText) this.tetherText.textContent = `${Math.floor(level)}%`;

        if (level < 25) {
            this.tetherFill?.classList.add('critical');
        } else {
            this.tetherFill?.classList.remove('critical');
        }
    }

    private updateCollectibles(count: number) {
        if (this.collectiblesCount) this.collectiblesCount.textContent = count.toString();
    }

    private injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .hud-layer {
                position: absolute;
                inset: 0;
                pointer-events: none;
                z-index: 150;
                padding: 20px;
                font-family: 'Courier New', monospace;
            }
            .hud-top-left { position: absolute; top: 20px; left: 20px; }
            .hud-top-right { position: absolute; top: 20px; right: 20px; }
            
            .hud-stat {
                display: flex;
                flex-direction: column;
                gap: 5px;
                background: rgba(0, 0, 0, 0.5);
                padding: 10px;
                border-left: 2px solid #0ff;
            }
            .hud-label {
                font-size: 0.7rem;
                color: #0ff;
                letter-spacing: 2px;
                opacity: 0.8;
            }
            .hud-value {
                font-size: 1.2rem;
                color: #fff;
                font-weight: bold;
            }
            .hud-progress-bg {
                width: 150px;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                overflow: hidden;
            }
            .hud-progress-fill {
                height: 100%;
                background: #0ff;
                width: 100%;
                transition: width 0.3s ease, background-color 0.5s;
            }
            .hud-progress-fill.critical {
                background: #f00;
                box-shadow: 0 0 10px #f00;
                animation: pulse-red 1s infinite;
            }
            @keyframes pulse-red {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);
    }
}
