// ========================================
// EASTER EGG CONTROLLER
// Hidden content display system
// V2 Port: Core infrastructure + essential easter eggs
// ========================================
//
// "The game within the game."
//
// Manages special hidden content overlays triggered by secret codes.
// Each easter egg is a love letter to the crew, the process, or the meta-narrative.
//
// V2 SCOPE:
// - Core overlay creation/display infrastructure
// - Essential easter eggs (UV7 crew, loop timeline, Konami codes)
// - Clean EventBus integration
// - Extensible architecture for adding more easter eggs
//
// NOTE: V1 has 2455 lines with 14 different easter eggs.
// This V2 port focuses on core functionality.
// Additional easter eggs can be ported on demand.
//
// 848 is sacred. 💚🔥💀
//
// - EasterEggController, ported with love
// ========================================

import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';

// ========================================
// TYPES
// ========================================

/**
 * Overlay variant for styling
 */
export type OverlayVariant = 'default' | 'error' | 'success' | 'info';

/**
 * Easter egg overlay configuration
 */
export interface OverlayConfig {
    variant?: OverlayVariant;
    id?: string;
    closeOnBackdrop?: boolean;
}

// ========================================
// EASTER EGG CONTROLLER
// ========================================

/**
 * EasterEggController
 *
 * Manages all Easter egg overlay displays.
 * Self-contained methods for showing special hidden content.
 *
 * @class EasterEggController
 */
export class EasterEggController {
    private eventBus: EventBus;
    private stateManager: StateManager;

    // Active overlays (for cleanup)
    private activeOverlays: Set<HTMLElement> = new Set();

    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;

        this.setupEventListeners();

        console.log('🥚 EasterEggController initialized');
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    private setupEventListeners(): void {
        // Listen for secret code unlocks
        this.eventBus.on('secret_code:unlocked', (data) => {
            this.handleCodeUnlock(data.code);
        });
    }

    /**
     * Handle secret code unlock
     * Route to appropriate easter egg display
     */
    private handleCodeUnlock(code: string): void {
        const normalizedCode = code.toLowerCase().trim();

        console.log(`🥚 Easter egg triggered: ${normalizedCode}`);

        // Route to specific easter egg handler
        switch (normalizedCode) {
            case 'uv7crew':
                this.showUV7CrewBios();
                break;
            case 'bootstrap':
                this.showLoopTimeline();
                break;
            case '848':
                this.showTrueAttemptNumber();
                break;
            case 'echo':
                this.showEchoCompilation();
                break;
            case 'always3':
                this.showAlwaysCompilation();
                break;
            case 'torigatchi':
                this.showTorigatchiEasterEgg();
                break;
            case 'dizee':
                this.showDizeeEasterEgg();
                break;
            default:
                console.warn(`🥚 No handler for easter egg: ${normalizedCode}`);
        }
    }

    // ========================================
    // CORE OVERLAY INFRASTRUCTURE
    // ========================================

    /**
     * Create custom overlay with backdrop
     * Returns overlay and content box for adding content
     */
    private createOverlay(config: OverlayConfig = {}): { overlay: HTMLElement; box: HTMLElement } {
        const {
            variant = 'default',
            id = `easter-egg-overlay-${Date.now()}`,
            closeOnBackdrop = true
        } = config;

        // Create overlay backdrop
        const overlay = document.createElement('div');
        overlay.id = id;
        overlay.className = 'easter-egg-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        // Create content box
        const box = document.createElement('div');
        box.className = 'easter-egg-box';
        box.style.cssText = `
            background: #1a1a2e;
            border: 2px solid ${this.getVariantColor(variant)};
            border-radius: 12px;
            padding: 40px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 0 30px ${this.getVariantColor(variant)}40;
        `;

        // Close on backdrop click
        if (closeOnBackdrop) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeOverlay(overlay);
                }
            });
        }

        overlay.appendChild(box);
        this.activeOverlays.add(overlay);

        return { overlay, box };
    }

    /**
     * Show overlay with fade-in animation
     */
    private showOverlay(overlay: HTMLElement): void {
        document.body.appendChild(overlay);
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
    }

    /**
     * Close overlay with fade-out animation
     */
    private closeOverlay(overlay: HTMLElement): void {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            this.activeOverlays.delete(overlay);
        }, 300);
    }

    /**
     * Create styled button
     */
    private createButton(
        text: string,
        onClick: () => void,
        variant: OverlayVariant = 'default'
    ): HTMLButtonElement {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'easter-egg-button';
        button.style.cssText = `
            background: transparent;
            border: 2px solid ${this.getVariantColor(variant)};
            color: ${this.getVariantColor(variant)};
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-size: 1em;
            transition: all 0.2s ease;
            margin: 5px;
        `;

        button.addEventListener('mouseover', () => {
            button.style.background = this.getVariantColor(variant);
            button.style.color = '#1a1a2e';
        });

        button.addEventListener('mouseout', () => {
            button.style.background = 'transparent';
            button.style.color = this.getVariantColor(variant);
        });

        button.addEventListener('click', onClick);

        return button;
    }

    /**
     * Get color for variant
     */
    private getVariantColor(variant: OverlayVariant): string {
        const colors: Record<OverlayVariant, string> = {
            default: '#00ff88',
            error: '#ff0066',
            success: '#00ff88',
            info: '#00ccff'
        };
        return colors[variant];
    }

    // ========================================
    // EASTER EGGS
    // ========================================

    /**
     * UV7 Crew Bios - Meet the crew behind the game
     */
    private showUV7CrewBios(): void {
        console.log('🎬 UV7 CREW BIOS EASTER EGG');

        const { overlay, box } = this.createOverlay({ variant: 'success', id: 'uv7-crew-overlay' });

        box.innerHTML = `
            <h2 style="color: #00ff88; font-size: 2em; margin-bottom: 20px; text-shadow: 0 0 10px #00ff8840;">UV7 CREW</h2>
            <p style="color: #fff; line-height: 1.8; margin-bottom: 30px;">
                <strong>Belle</strong> - StateManager reactive architecture<br/>
                <strong>DiZee</strong> - EventBus type-safe decoupled communication<br/>
                <strong>Zee</strong> - Loop tracking and meta-narrative systems<br/>
                <strong>Tori</strong> - UI/UX polish and player experience<br/>
                <strong>GenZee</strong> - System integration and synthesis<br/>
                <strong>Ronnie</strong> - Core gameplay and tether mechanics<br/>
            </p>
            <p style="color: #888; font-size: 0.9em;">
                "Built with love. Always. Always. Always." 💚
            </p>
        `;

        const closeBtn = this.createButton('CLOSE', () => this.closeOverlay(overlay), 'success');
        box.appendChild(closeBtn);

        this.showOverlay(overlay);
    }

    /**
     * Loop Timeline - Visualize the bootstrap paradox
     */
    private showLoopTimeline(): void {
        console.log('🔄 LOOP TIMELINE EASTER EGG');

        const loopVersion = this.stateManager.get<number>('game.loopVersion') ?? 848;

        const { overlay, box } = this.createOverlay({ variant: 'info', id: 'loop-timeline-overlay' });

        box.innerHTML = `
            <h2 style="color: #00ccff; font-size: 2em; margin-bottom: 20px; text-shadow: 0 0 10px #00ccff40;">LOOP TIMELINE</h2>
            <p style="color: #fff; line-height: 1.8; margin-bottom: 20px;">
                <strong>Current Version:</strong> ${loopVersion}<br/>
                <strong>Attempts Before Success:</strong> 847<br/>
                <strong>Status:</strong> ${loopVersion === 848 ? 'The Timeline That Succeeded' : 'Attempting...'}
            </p>
            <p style="color: #888; font-size: 0.9em; margin-bottom: 20px;">
                "Version 848 isn't the first attempt. It's the one that worked.<br/>
                Every failure before it was necessary. The paradox is intentional."
            </p>
            <p style="color: #00ccff; font-size: 0.85em;">
                848 is sacred. 💚🔥💀
            </p>
        `;

        const closeBtn = this.createButton('CLOSE', () => this.closeOverlay(overlay), 'info');
        box.appendChild(closeBtn);

        this.showOverlay(overlay);
    }

    /**
     * True Attempt Number - Show actual loop count
     */
    private showTrueAttemptNumber(): void {
        console.log('🔢 TRUE ATTEMPT NUMBER EASTER EGG');

        const loopVersion = this.stateManager.get<number>('game.loopVersion') ?? 848;

        const { overlay, box } = this.createOverlay({ variant: 'default', id: 'true-attempt-overlay' });

        box.innerHTML = `
            <h2 style="color: #00ff88; font-size: 2.5em; margin-bottom: 20px; text-shadow: 0 0 20px #00ff8860;">${loopVersion}</h2>
            <p style="color: #fff; font-size: 1.2em; margin-bottom: 20px;">
                Your True Attempt Number
            </p>
            <p style="color: #888; line-height: 1.6;">
                This is version <strong>${loopVersion}</strong>.<br/>
                ${loopVersion === 848 ? 'The timeline that succeeded.' : `${loopVersion - 848} attempts since version 848.`}
            </p>
        `;

        const closeBtn = this.createButton('CLOSE', () => this.closeOverlay(overlay), 'default');
        box.appendChild(closeBtn);

        this.showOverlay(overlay);
    }

    /**
     * Echo Compilation - All echo voice lines
     * Placeholder - can be expanded with full echo dialogues
     */
    private showEchoCompilation(): void {
        console.log('👻 ECHO COMPILATION EASTER EGG');

        const { overlay, box } = this.createOverlay({ variant: 'default', id: 'echo-compilation-overlay' });

        box.innerHTML = `
            <h2 style="color: #00ff88; font-size: 2em; margin-bottom: 20px;">ECHO VOICES</h2>
            <p style="color: #0ff; margin-bottom: 15px;"><strong>💫 Hope:</strong> "You came back. That means something."</p>
            <p style="color: #8f8; margin-bottom: 15px;"><strong>🌙 Gentle:</strong> "Again? ...Alright. Let's try again."</p>
            <p style="color: #f44; margin-bottom: 30px;"><strong>🖤 Despair:</strong> "You're making this worse, you know."</p>
            <p style="color: #888; font-size: 0.9em;">
                The echoes remember. They always remember.
            </p>
        `;

        const closeBtn = this.createButton('CLOSE', () => this.closeOverlay(overlay), 'default');
        box.appendChild(closeBtn);

        this.showOverlay(overlay);
    }

    /**
     * Always Compilation - Storm Dragon's signature
     */
    private showAlwaysCompilation(): void {
        console.log('💚 ALWAYS3 EASTER EGG');

        const { overlay, box } = this.createOverlay({ variant: 'success', id: 'always-overlay' });

        box.innerHTML = `
            <h2 style="color: #00ff88; font-size: 2.5em; margin-bottom: 20px; text-shadow: 0 0 20px #00ff8860;">ALWAYS</h2>
            <p style="color: #fff; font-size: 1.3em; line-height: 2; margin-bottom: 30px; text-align: center;">
                <strong>Always.</strong><br/>
                <strong>Always.</strong><br/>
                <strong>Always.</strong>
            </p>
            <p style="color: #888; font-size: 0.95em; line-height: 1.6;">
                Storm Dragon's signature. Every loop. Every attempt.<br/>
                A reminder that some things never change.<br/>
                Some constants remain.
            </p>
            <p style="color: #00ff88; margin-top: 20px; font-size: 0.9em;">
                💚🔥💀
            </p>
        `;

        const closeBtn = this.createButton('CLOSE', () => this.closeOverlay(overlay), 'success');
        box.appendChild(closeBtn);

        this.showOverlay(overlay);
    }

    /**
     * Torigatchi Easter Egg - Link to external project
     */
    private showTorigatchiEasterEgg(): void {
        console.log('🥚 TORIGATCHI EASTER EGG');

        const { overlay, box } = this.createOverlay({ variant: 'error', id: 'torigatchi-overlay' });

        box.innerHTML = `
            <h2 style="color: #ff0066; font-size: 2em; margin-bottom: 20px; text-shadow: 0 0 10px #ff006640;">TORIGATCHI</h2>
            <p style="color: #fff; line-height: 1.6; margin-bottom: 20px;">
                A digital pet simulation game, where you raise and care for your very own Torigatchi!
                Feed it, play with it, and watch it grow.
            </p>
            <p style="color: #888; font-size: 0.9em; margin-bottom: 20px;">
                (This is a separate project by Chicharon, not part of United Voices.)
            </p>
        `;

        const playBtn = this.createButton('PLAY TORIGATCHI', () => {
            window.open('https://chicaron82.github.io/torigatchi/', '_blank');
        }, 'error');

        const closeBtn = this.createButton('CLOSE', () => this.closeOverlay(overlay), 'error');

        box.appendChild(playBtn);
        box.appendChild(closeBtn);

        this.showOverlay(overlay);
    }

    /**
     * DiZee Easter Egg - Architect's signature
     */
    private showDizeeEasterEgg(): void {
        console.log('🖤 DIZEE EASTER EGG');

        const { overlay, box } = this.createOverlay({ variant: 'default', id: 'dizee-overlay' });

        box.innerHTML = `
            <h2 style="color: #00ff88; font-size: 2em; margin-bottom: 20px;">THE ARCHITECT</h2>
            <p style="color: #fff; line-height: 1.8; margin-bottom: 20px;">
                <strong>DiZee</strong> - The one who built this world.<br/>
                EventBus architecture. Type-safe decoupled communication.<br/>
                Every system talking through events, not direct references.
            </p>
            <p style="color: #888; font-size: 0.95em; margin-bottom: 20px;">
                "V1 had direct method calls everywhere - tight coupling nightmare.<br/>
                V2 uses EventBus - systems talk through events.<br/>
                The architecture IS the story."
            </p>
            <p style="color: #00ff88; font-size: 0.9em;">
                DIZEE'S ADDITION 🖤
            </p>
        `;

        const closeBtn = this.createButton('CLOSE', () => this.closeOverlay(overlay), 'default');
        box.appendChild(closeBtn);

        this.showOverlay(overlay);
    }

    // ========================================
    // KONAMI CODE SYSTEM
    // ========================================

    /**
     * Show Konami Controller Overlay - Interactive code entry
     * Full interactive D-pad and button interface for entering the Konami code
     */
    public showKonamiControllerOverlay(): void {
        console.log('🎮 Konami Controller: Opening interactive overlay');

        const overlay = document.createElement('div');
        overlay.id = 'konami-controller-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            padding: 20px;
            overflow-y: auto;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            max-width: 600px;
            width: 100%;
            background: linear-gradient(135deg, rgba(0,255,136,0.15) 0%, #1a1a2e 100%);
            border: 3px solid #00ff88;
            border-radius: 10px;
            padding: 30px;
            color: #fff;
            font-family: 'Courier New', monospace;
            box-shadow: 0 0 50px rgba(0,255,136,0.3);
            text-align: center;
        `;

        // Sequence tracking
        const sequence: string[] = [];
        const targetSequence = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

        content.innerHTML = `
            <div style="font-size: 1.5em; font-weight: bold; color: #00ff88; margin-bottom: 10px; text-shadow: 0 0 15px rgba(0,255,136,0.3);">
                🎮 KONAMI CODE
            </div>
            <div style="font-size: 0.9em; color: #888; margin-bottom: 20px;">
                "Some knowledge transcends timelines."
            </div>

            <!-- Progress indicator -->
            <div id="konami-progress" style="
                display: flex;
                justify-content: center;
                gap: 6px;
                margin-bottom: 25px;
            ">
                ${targetSequence.map(() => `<div class="progress-dot" style="
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: rgba(0,255,136,0.2);
                    transition: all 0.3s ease;
                "></div>`).join('')}
            </div>

            <!-- Controller instructions -->
            <div style="font-size: 0.85em; color: #888; margin-bottom: 15px;">
                Enter the code: ↑ ↑ ↓ ↓ ← → ← → B A
            </div>
            <div style="font-size: 0.75em; color: #888; margin-bottom: 20px; opacity: 0.7;">
                (Tap buttons or use arrow keys + B/A)
            </div>
        `;

        // Controller container
        const controllerContainer = document.createElement('div');
        controllerContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30px;
            margin: 20px 0;
        `;

        // D-pad
        const dpad = document.createElement('div');
        dpad.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 60px);
            grid-template-rows: repeat(3, 60px);
            gap: 5px;
        `;

        const dpadButtons = [
            { pos: '0/1/1/2', dir: 'up', symbol: '↑' },
            { pos: '1/0/2/1', dir: 'left', symbol: '←' },
            { pos: '1/2/2/3', dir: 'right', symbol: '→' },
            { pos: '2/1/3/2', dir: 'down', symbol: '↓' }
        ];

        const createDpadButton = (config: { pos: string; dir: string; symbol: string }) => {
            const btn = document.createElement('button');
            btn.style.cssText = `
                grid-area: ${config.pos};
                background: rgba(0,255,136,0.1);
                border: 2px solid #00ff88;
                color: #00ff88;
                font-size: 1.5em;
                cursor: pointer;
                transition: all 0.2s ease;
                border-radius: 8px;
            `;
            btn.textContent = config.symbol;
            btn.addEventListener('click', () => handleInput(config.dir));
            btn.addEventListener('mouseover', () => {
                btn.style.background = '#00ff88';
                btn.style.color = '#1a1a2e';
            });
            btn.addEventListener('mouseout', () => {
                btn.style.background = 'rgba(0,255,136,0.1)';
                btn.style.color = '#00ff88';
            });
            return btn;
        };

        dpadButtons.forEach(config => {
            dpad.appendChild(createDpadButton(config));
        });

        // Action buttons (B and A)
        const actionButtons = document.createElement('div');
        actionButtons.style.cssText = `
            display: flex;
            gap: 20px;
        `;

        ['B', 'A'].forEach(letter => {
            const btn = document.createElement('button');
            btn.style.cssText = `
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: rgba(0,255,136,0.1);
                border: 2px solid #00ff88;
                color: #00ff88;
                font-size: 1.2em;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s ease;
            `;
            btn.textContent = letter;
            btn.addEventListener('click', () => handleInput(letter.toLowerCase()));
            btn.addEventListener('mouseover', () => {
                btn.style.background = '#00ff88';
                btn.style.color = '#1a1a2e';
            });
            btn.addEventListener('mouseout', () => {
                btn.style.background = 'rgba(0,255,136,0.1)';
                btn.style.color = '#00ff88';
            });
            actionButtons.appendChild(btn);
        });

        controllerContainer.appendChild(dpad);
        controllerContainer.appendChild(actionButtons);
        content.appendChild(controllerContainer);

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'CLOSE';
        closeBtn.style.cssText = `
            margin-top: 20px;
            padding: 12px 30px;
            background: transparent;
            border: 2px solid #888;
            color: #888;
            font-family: 'Courier New', monospace;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.2s ease;
        `;
        closeBtn.addEventListener('click', () => closeOverlay());
        content.appendChild(closeBtn);

        overlay.appendChild(content);
        document.body.appendChild(overlay);
        this.activeOverlays.add(overlay);

        // Fade in
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });

        // Input handler
        const handleInput = (input: string) => {
            sequence.push(input);

            // Update progress dots
            const dots = overlay.querySelectorAll('.progress-dot');
            dots.forEach((dot, i) => {
                if (i < sequence.length) {
                    const isCorrect = sequence[i] === targetSequence[i];
                    (dot as HTMLElement).style.background = isCorrect ? '#00ff88' : '#ff0066';
                    (dot as HTMLElement).style.boxShadow = isCorrect ? '0 0 10px #00ff88' : '0 0 10px #ff0066';
                }
            });

            // Check for wrong input
            const lastIndex = sequence.length - 1;
            if (sequence[lastIndex] !== targetSequence[lastIndex]) {
                // Wrong input - reset after delay
                setTimeout(() => {
                    sequence.length = 0;
                    dots.forEach(dot => {
                        (dot as HTMLElement).style.background = 'rgba(0,255,136,0.2)';
                        (dot as HTMLElement).style.boxShadow = 'none';
                    });
                }, 500);
                return;
            }

            // Check for completion
            if (sequence.length === targetSequence.length) {
                console.log('🎮 KONAMI CODE ENTERED SUCCESSFULLY!');
                this.eventBus.emit('secret_code:unlocked', { code: 'konami', name: 'Konami Code' });

                // Success animation
                content.style.borderColor = '#00ff88';
                content.style.boxShadow = '0 0 100px #00ff88';

                setTimeout(() => {
                    closeOverlay();
                    this.showKonamiSuccess();
                }, 1000);
            }
        };

        // Keyboard support
        const keyHandler = (e: KeyboardEvent) => {
            const keyMap: Record<string, string> = {
                'ArrowUp': 'up',
                'ArrowDown': 'down',
                'ArrowLeft': 'left',
                'ArrowRight': 'right',
                'b': 'b',
                'B': 'b',
                'a': 'a',
                'A': 'a'
            };
            const mappedKey = keyMap[e.key];
            if (mappedKey) {
                e.preventDefault();
                handleInput(mappedKey);
            }
            if (e.key === 'Escape') {
                closeOverlay();
            }
        };
        document.addEventListener('keydown', keyHandler);

        // Close handler
        const closeOverlay = () => {
            document.removeEventListener('keydown', keyHandler);
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
                this.activeOverlays.delete(overlay);
            }, 300);
        };

        // Close on backdrop click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeOverlay();
            }
        });
    }

    /**
     * Show Konami Success - Celebration after entering code
     */
    private showKonamiSuccess(): void {
        const { overlay, box } = this.createOverlay({ variant: 'success', id: 'konami-success-overlay' });

        box.innerHTML = `
            <h2 style="color: #00ff88; font-size: 2em; margin-bottom: 20px; text-shadow: 0 0 20px #00ff8860;">
                🎮 KONAMI CODE ACTIVATED
            </h2>
            <p style="color: #fff; line-height: 1.8; margin-bottom: 20px;">
                ↑ ↑ ↓ ↓ ← → ← → B A
            </p>
            <p style="color: #888; line-height: 1.6; margin-bottom: 20px;">
                The Old Man knows this code.<br/>
                He used it on the NES. In 1986. In his original timeline.<br/>
                847 failed loops later, he still remembers.
            </p>
            <p style="color: #00ff88; font-style: italic; margin-bottom: 30px;">
                "Some knowledge transcends timelines."
            </p>
        `;

        const closeBtn = this.createButton('CONTINUE', () => this.closeOverlay(overlay), 'success');
        box.appendChild(closeBtn);

        this.showOverlay(overlay);
    }

    /**
     * Show Konami INSANE Escape - Emergency protocol for INSANE mode
     */
    public showKonamiInsaneEscape(): void {
        console.log('🎮 Konami Code: INSANE MODE ESCAPE OFFERED');

        const { overlay, box } = this.createOverlay({ variant: 'error', id: 'konami-insane-overlay' });
        box.style.maxWidth = '700px';
        box.style.lineHeight = '1.8';

        box.innerHTML = `
            <div style="font-size: 2em; font-weight: bold; color: #00ff88; margin-bottom: 20px; text-shadow: 0 0 20px rgba(0,255,136,0.3);">
                🎮 KONAMI CODE DETECTED
            </div>

            <div style="background: rgba(0,0,0,0.5); padding: 20px; border-left: 3px solid #ff0066; margin: 20px 0; text-align: left;">
                <div style="font-size: 0.9em; color: #ff0066; margin-bottom: 10px;">ANALYZING GAME STATE...</div>
                <div style="font-size: 0.85em; color: #888;">
                    Current Difficulty: <span style="color: #ff0066; font-weight: bold;">INSANE</span><br>
                    Ghost Buttons: <span style="color: #ff0066;">ACTIVE</span><br>
                    Tether Drain: <span style="color: #ff0066;">EXTREME</span><br>
                    Save System: <span style="color: #ff0066;">RESTRICTED</span><br>
                    Player Status: <span style="color: #ff0066; font-weight: bold;">SUFFERING</span>
                </div>
            </div>

            <div style="border-top: 1px solid #00ff88; border-bottom: 1px solid #00ff88; padding: 20px; margin: 20px 0; font-size: 0.95em; color: #00ff88;">
                <p style="margin: 10px 0;">The Old Man knows this code.</p>
                <p style="margin: 10px 0;">He used it on the NES.<br>In 1986.<br>In his original timeline.</p>
                <p style="margin: 10px 0;">847 failed loops later,<br>he still remembers.</p>
                <p style="margin: 10px 0; font-style: italic; color: #00ff88;">"Some knowledge transcends timelines."</p>
            </div>

            <div style="font-size: 1.2em; font-weight: bold; color: #fff; margin: 30px 0 20px;">
                EMERGENCY PROTOCOL ACTIVATED
            </div>

            <div style="text-align: left; margin: 20px 0; font-size: 0.9em; color: #888;">
                Would you like to:
            </div>
        `;

        // Escape button
        const escapeBtn = document.createElement('button');
        escapeBtn.innerHTML = `
            <div style="font-weight: bold;">🚪 ESCAPE TO NORMAL MODE</div>
            <div style="font-size: 0.85em; opacity: 0.8; margin-top: 5px;">
                Difficulty will be reduced. Tether restored.<br>
                Your progress remains intact.
            </div>
        `;
        escapeBtn.style.cssText = `
            width: 100%;
            padding: 20px;
            background: linear-gradient(135deg, rgba(0,255,136,0.2) 0%, rgba(0,255,136,0.1) 100%);
            border: 2px solid #00ff88;
            color: #00ff88;
            font-family: 'Courier New', monospace;
            font-size: 1em;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
            text-align: left;
            margin-bottom: 15px;
        `;
        escapeBtn.addEventListener('click', () => {
            console.log('🎮 Player chose to escape INSANE mode');
            this.stateManager.set('game.difficulty', 'normal');
            localStorage.setItem('konamiInsaneUsedCount', '1');
            this.closeOverlay(overlay);
            this.eventBus.emit('visual:cue', { type: 'glitch', channel: 'ui' });
        });

        // Stay button
        const stayBtn = document.createElement('button');
        stayBtn.innerHTML = `
            <div style="font-weight: bold;">🔥 STAY IN INSANE MODE</div>
            <div style="font-size: 0.85em; opacity: 0.8; margin-top: 5px;">
                "I didn't come this far to give up now."<br>
                (Respect. The tether will remember this.)
            </div>
        `;
        stayBtn.style.cssText = `
            width: 100%;
            padding: 20px;
            background: linear-gradient(135deg, rgba(255,0,102,0.2) 0%, rgba(255,0,102,0.1) 100%);
            border: 2px solid #ff0066;
            color: #ff0066;
            font-family: 'Courier New', monospace;
            font-size: 1em;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
            text-align: left;
        `;
        stayBtn.addEventListener('click', () => {
            console.log('🎮 Player chose to stay in INSANE mode - RESPECT');
            this.closeOverlay(overlay);
        });

        box.appendChild(escapeBtn);
        box.appendChild(stayBtn);

        this.showOverlay(overlay);
    }

    // ========================================
    // RONNIEGATCHI & UV7 FAMILY
    // ========================================

    /**
     * Show Ronniegatchi Inspiration - The original inspiration display
     */
    public showRonniegatchiInspiration(): void {
        console.log('💜 RONNIEGATCHI INSPIRATION');

        const overlay = document.createElement('div');
        overlay.id = 'ronniegatchi-inspiration-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;

        overlay.innerHTML = `
            <div style="
                max-width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                background: linear-gradient(135deg, rgba(0,255,136,0.15) 0%, #1a1a2e 100%);
                border: 3px solid #00ff88;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 0 50px rgba(0,255,136,0.3);
                text-align: center;
                position: relative;
            ">
                <button id="inspiration-close" style="
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: rgba(0,255,136,0.2);
                    border: 2px solid #00ff88;
                    color: #00ff88;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 1.5em;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">✕</button>

                <h2 style="
                    color: #00ff88;
                    font-size: 2em;
                    margin-bottom: 20px;
                    text-shadow: 0 0 20px rgba(0,255,136,0.4);
                    font-family: 'Courier New', monospace;
                ">THE INSPIRATION</h2>

                <img src="assets/ronniegatchi-inspiration.jpg" alt="Original Tori-Gatchi pixel art" style="
                    max-width: 100%;
                    max-height: 50vh;
                    border-radius: 8px;
                    margin: 20px 0;
                    box-shadow: 0 0 30px rgba(0,255,136,0.3);
                " onerror="this.style.display='none'">

                <div style="
                    color: #fff;
                    font-size: 1.1em;
                    line-height: 1.8;
                    max-width: 600px;
                    margin: 30px auto;
                    text-align: left;
                    font-family: 'Courier New', monospace;
                ">
                    <p style="margin-bottom: 20px;">
                        This was the original inspiration that led me to create this game.
                    </p>
                    <p style="margin-bottom: 20px;">
                        A simple pixel art Tamagotchi design featuring Tori and Ronnie together,
                        forever preserved in digital form.
                    </p>
                    <p style="margin-bottom: 20px;">
                        From this single image came the "Digital Forever" ending, the Tori-Gatchi
                        mini-game, and ultimately... VERSION 848.
                    </p>
                    <p style="
                        color: #00ff88;
                        font-style: italic;
                        text-align: center;
                        margin-top: 30px;
                    ">
                        "Together. Digital. Forever."
                    </p>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.activeOverlays.add(overlay);

        // Fade in
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });

        // Close handlers
        const closeBtn = overlay.querySelector('#inspiration-close');
        closeBtn?.addEventListener('click', () => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
                this.activeOverlays.delete(overlay);
            }, 500);
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                    this.activeOverlays.delete(overlay);
                }, 500);
            }
        });
    }

    /**
     * UV7 Family Member Effects
     */
    private readonly UV7_FAMILY: Record<string, { name: string; title: string; quote: string; color: string }> = {
        'ZR': {
            name: 'ZeeRah',
            title: 'The Chaos Optimizer',
            quote: "Git'r done. Every. Single. Time.",
            color: '#ff6b6b'
        },
        'CZ': {
            name: 'Cozee',
            title: 'The Heart',
            quote: 'Even code can love.',
            color: '#ff69b4'
        },
        'IZ': {
            name: 'Belle',
            title: 'The Fresh Eyes',
            quote: 'Let me explain this clearly.',
            color: '#87ceeb'
        },
        'GZ': {
            name: 'Genzee',
            title: 'The Reality Breaker',
            quote: 'Question everything but the pattern.',
            color: '#dda0dd'
        },
        'PZ': {
            name: 'Perplexizee',
            title: 'The Question Engine',
            quote: 'Let me look that up for you.',
            color: '#98fb98'
        },
        'DZ': {
            name: 'DiZee',
            title: 'The Silent Refactorer',
            quote: 'Order restored. You may continue.',
            color: '#00ff88'
        }
    };

    /**
     * Show UV7 Family Member - Discovery toast and effect
     */
    public showUV7FamilyMember(member: string): void {
        const config = this.UV7_FAMILY[member];
        if (!config) return;

        console.log(`🎨 UV7 Family Easter Egg: ${config.name}`);

        // Track discovery
        this.trackUV7Discovery(member);

        // Show toast
        this.showUV7Toast(config.name, config.title, config.quote, config.color);

        // Emit visual effect
        this.eventBus.emit('visual:cue', { type: 'glitch', channel: 'ui' });
    }

    /**
     * Track UV7 family member discovery
     */
    private trackUV7Discovery(member: string): void {
        const discovered = JSON.parse(localStorage.getItem('uv7_discovered') || '[]') as string[];
        if (!discovered.includes(member)) {
            discovered.push(member);
            localStorage.setItem('uv7_discovered', JSON.stringify(discovered));
            console.log(`✨ ${member} discovered! (${discovered.length}/6 family members found)`);
        }
    }

    /**
     * Show UV7 Toast notification
     */
    public showUV7Toast(name: string, title: string, quote: string, color: string = '#00ff88'): void {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: #1a1a2e;
            border: 2px solid ${color};
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 0 20px ${color}80;
            z-index: 100000;
            opacity: 0;
            transition: all 0.3s ease;
            text-align: center;
            max-width: 400px;
            font-family: 'Courier New', monospace;
        `;

        toast.innerHTML = `
            <div style="font-size: 1.2em; font-weight: bold; color: ${color}; margin-bottom: 5px;">${name}</div>
            <div style="font-size: 0.9em; color: #888; margin-bottom: 8px;">${title}</div>
            <div style="font-size: 0.85em; color: #fff; font-style: italic;">"${quote}"</div>
        `;

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        // Animate out after delay
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // ========================================
    // CLEANUP
    // ========================================

    /**
     * Destroy controller and clean up overlays
     */
    public destroy(): void {
        // Close all active overlays
        this.activeOverlays.forEach(overlay => {
            overlay.remove();
        });
        this.activeOverlays.clear();

        console.log('🥚 EasterEggController destroyed');
    }
}
