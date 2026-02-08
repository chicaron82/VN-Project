import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';
import { HUDView } from './HUDView';

/**
 * GameLayout
 * Orchestrates the visual presentation of the simulation.
 */
export class GameLayout {
    container: HTMLElement;
    viewport: HTMLElement;
    visualLayer: HTMLElement;
    dialogBox: HTMLElement;
    dialogName: HTMLElement;
    dialogText: HTMLElement;
    private eventBus: EventBus;
    private stateManager: StateManager;
    private hud: HUDView;
    private typingInterval: any = null;
    private choiceContainer: HTMLElement | null = null;

    constructor(containerId: string, eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        const root = document.getElementById(containerId);
        if (!root) throw new Error(`Container ${containerId} not found`);
        this.container = root;

        // Build DOM
        this.container.innerHTML = `
            <div id="game-viewport" class="viewport">
                <div class="visual-layer"></div>
                <div class="ui-layer">
                    <div id="dialog-box" class="dialog-box">
                        <div id="dialog-name" class="dialog-name"></div>
                        <div id="dialog-text" class="dialog-text"></div>
                        <div class="dialog-arrow">▼</div>
                    </div>
                </div>
                <div class="vfx-layer"></div>
            </div>
        `;

        this.viewport = this.container.querySelector('#game-viewport') as HTMLElement;
        this.visualLayer = this.container.querySelector('.visual-layer') as HTMLElement;
        this.dialogBox = this.container.querySelector('#dialog-box') as HTMLElement;
        this.dialogName = this.container.querySelector('#dialog-name') as HTMLElement;
        this.dialogText = this.container.querySelector('#dialog-text') as HTMLElement;

        // Initialize HUD
        this.hud = new HUDView(this.viewport, eventBus, stateManager);

        // CSS
        this.injectStyles();

        // Listeners
        this.setupListeners();
    }

    private setupListeners() {
        this.eventBus.on('dialog:show', (data) => {
            if (this.choiceContainer) {
                this.choiceContainer.remove();
                this.choiceContainer = null;
            }
            this.dialogBox.style.display = 'block';
            this.dialogName.textContent = data.entry.character;
            this.typeWriter(data.entry.text);
        });

        this.eventBus.on('visual:background', (data) => {
            const url = data.image.replace('../assets/', 'assets/');
            this.visualLayer.style.backgroundImage = `url(${url})`;
        });

        this.eventBus.on('visual:cue', (data) => {
            this.handleVisualCue(data.type);
        });

        this.eventBus.on('choice:show', (data) => {
            this.renderChoices(data.choices);
        });

        // Click to advance
        this.dialogBox.addEventListener('click', () => {
            if (this.choiceContainer) return;
            if (this.typingInterval) {
                // Skip typing
                clearInterval(this.typingInterval);
                this.typingInterval = null;
                // Full text display handled by skipping
                return;
            }
            this.eventBus.emit('dialog:advance', {});
        });
    }

    private handleVisualCue(type: string | null) {
        if (!type) return;

        const vfx = this.container.querySelector('.vfx-layer') as HTMLElement;
        if (!vfx) return;

        vfx.className = 'vfx-layer'; // Reset

        if (type === 'shake') {
            this.viewport.classList.add('shake-anim');
            setTimeout(() => this.viewport.classList.remove('shake-anim'), 500);
        } else if (type === 'glitch') {
            vfx.classList.add('glitch-vfx');
            setTimeout(() => vfx.classList.remove('glitch-vfx'), 1000);
        }
    }

    private typeWriter(text: string) {
        if (this.typingInterval) clearInterval(this.typingInterval);

        this.dialogText.textContent = '';
        let i = 0;
        this.typingInterval = setInterval(() => {
            this.dialogText.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(this.typingInterval);
                this.typingInterval = null;
            }
        }, 30);
    }

    private renderChoices(choices: Array<{ text: string, next: string | null }>) {
        if (this.choiceContainer) this.choiceContainer.remove();

        this.choiceContainer = document.createElement('div');
        this.choiceContainer.className = 'choice-container';

        choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.onclick = (e) => {
                e.stopPropagation();
                this.eventBus.emit('choice:selected', {
                    index: index,
                    choiceId: choice.next || 'end',
                    text: choice.text
                });
                this.choiceContainer?.remove();
                this.choiceContainer = null;
            };
            this.choiceContainer!.appendChild(btn);
        });

        this.container.querySelector('.ui-layer')?.appendChild(this.choiceContainer);
    }

    private injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .viewport {
                position: relative;
                width: 100%;
                height: 100vh;
                background: #050505;
                overflow: hidden;
            }
            .visual-layer {
                position: absolute;
                inset: 0;
                background-size: cover;
                background-position: center;
                transition: background-image 1s ease-in-out;
            }
            .ui-layer {
                position: absolute;
                inset: 0;
                pointer-events: none;
            }
            .vfx-layer {
                position: absolute;
                inset: 0;
                pointer-events: none;
                z-index: 300;
            }
            .dialog-box {
                position: absolute;
                bottom: 40px;
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
                max-width: 800px;
                background: rgba(0, 0, 0, 0.9);
                border-top: 2px solid rgba(255, 255, 255, 0.1);
                border-left: 4px solid #0ff;
                padding: 30px;
                color: #fff;
                font-family: 'Courier New', monospace;
                z-index: 100;
                pointer-events: auto;
                cursor: pointer;
                box-shadow: 0 20px 50px rgba(0,0,0,0.8);
            }
            .dialog-name {
                color: #0ff;
                font-weight: bold;
                margin-bottom: 12px;
                text-transform: uppercase;
                letter-spacing: 3px;
                font-size: 0.8rem;
                opacity: 0.8;
            }
            .dialog-text {
                font-size: 1.15rem;
                line-height: 1.6;
                color: rgba(255, 255, 255, 0.95);
                min-height: 3em;
            }
            .dialog-arrow {
                position: absolute;
                bottom: 15px;
                right: 25px;
                animation: blink 1s infinite;
                color: #0ff;
                font-size: 0.8rem;
            }
            
            /* Choice Styles */
            .choice-container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: flex;
                flex-direction: column;
                gap: 16px;
                z-index: 400;
                pointer-events: auto;
                width: 100%;
                max-width: 600px;
            }
            .choice-btn {
                background: rgba(0, 0, 0, 0.95);
                border: 1px solid rgba(0, 255, 255, 0.3);
                border-left: 4px solid #0ff;
                color: #fff;
                padding: 24px;
                font-family: 'Courier New', monospace;
                font-size: 1.1rem;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                text-align: left;
            }
            .choice-btn:hover {
                background: #0ff;
                color: #000;
                transform: translateX(10px) scale(1.02);
                box-shadow: 0 0 30px rgba(0, 255, 255, 0.4);
            }
            
            /* Animations */
            .shake-anim {
                animation: shake-kf 0.5s cubic-bezier(.36,.07,.19,.97) both;
            }
            @keyframes shake-kf {
                10%, 90% { transform: translate3d(-1px, 0, 0); }
                20%, 80% { transform: translate3d(2px, 0, 0); }
                30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                40%, 60% { transform: translate3d(4px, 0, 0); }
            }
            
            .glitch-vfx {
                background: rgba(0, 255, 255, 0.1);
                animation: glitch-kf 0.2s infinite;
            }
            @keyframes glitch-kf {
                0% { clip-path: inset(10% 0 30% 0); transform: translate(-5px); }
                20% { clip-path: inset(40% 0 10% 0); transform: translate(5px); }
                40% { clip-path: inset(20% 0 40% 0); transform: translate(-2px); }
                60% { clip-path: inset(60% 0 10% 0); transform: translate(2px); }
                80% { clip-path: inset(10% 0 70% 0); transform: translate(-5px); }
                100% { clip-path: inset(30% 0 20% 0); transform: translate(5px); }
            }
            
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}
