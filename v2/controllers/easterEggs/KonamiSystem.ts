// ========================================
// KONAMI CODE SYSTEM
// Interactive code entry and escape protocol
//
// Extracted from EasterEggController.ts (~300 lines -> dedicated module)
//
// NOTE: This file is at the 300-line soft limit intentionally.
// showControllerOverlay() is a single cohesive interactive widget (D-pad + buttons
// + sequence tracking + keyboard support + progress animation) that does not
// benefit from further splitting. The seams would be artificial.
//
// Handles:
// - Interactive D-pad and button overlay for Konami code entry
// - Sequence tracking and validation with progress dots
// - Keyboard support (arrow keys + B/A)
// - Success celebration overlay
// - INSANE mode emergency escape protocol
//
// "Some knowledge transcends timelines."
//
// 848 is sacred. 💚🔥💀
// ========================================

import { EventBus } from '../../core/EventBus';
import { StateManager } from '../../core/StateManager';
import { OverlayFactory } from './OverlayFactory';
import { Logger } from '@utils/Logger';

/**
 * KonamiSystem
 *
 * All Konami code functionality - input overlay, success celebration,
 * and INSANE mode escape protocol.
 */
export class KonamiSystem {
    constructor(
        private overlayFactory: OverlayFactory,
        private eventBus: EventBus,
        private stateManager: StateManager
    ) {}

    /**
     * Show Konami Controller Overlay - Interactive code entry
     * Full interactive D-pad and button interface for entering the Konami code
     */
    showControllerOverlay(): void {
        Logger.ui('🎮 Konami Controller: Opening interactive overlay');

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
        this.overlayFactory.trackOverlay(overlay);

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
                Logger.ui('🎮 KONAMI CODE ENTERED SUCCESSFULLY!');
                this.eventBus.emit('secret_code:unlocked', { code: 'konami', name: 'Konami Code' });

                // Success animation
                content.style.borderColor = '#00ff88';
                content.style.boxShadow = '0 0 100px #00ff88';

                setTimeout(() => {
                    closeOverlay();
                    this.showSuccess();
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
                this.overlayFactory.trackOverlay(overlay); // Will be no-op if already tracked
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
    private showSuccess(): void {
        const { overlay, box } = this.overlayFactory.createOverlay({ variant: 'success', id: 'konami-success-overlay' });

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

        const closeBtn = this.overlayFactory.createButton('CONTINUE', () => this.overlayFactory.closeOverlay(overlay), 'success');
        box.appendChild(closeBtn);

        this.overlayFactory.showOverlay(overlay);
    }

    /**
     * Show Konami INSANE Escape - Emergency protocol for INSANE mode
     */
    showInsaneEscape(): void {
        Logger.ui('🎮 Konami Code: INSANE MODE ESCAPE OFFERED');

        const { overlay, box } = this.overlayFactory.createOverlay({ variant: 'error', id: 'konami-insane-overlay' });
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
            Logger.ui('🎮 Player chose to escape INSANE mode');
            this.stateManager.set('game.difficulty', 'normal');
            localStorage.setItem('konamiInsaneUsedCount', '1');
            this.overlayFactory.closeOverlay(overlay);
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
            Logger.ui('🎮 Player chose to stay in INSANE mode - RESPECT');
            this.overlayFactory.closeOverlay(overlay);
        });

        box.appendChild(escapeBtn);
        box.appendChild(stayBtn);

        this.overlayFactory.showOverlay(overlay);
    }
}
