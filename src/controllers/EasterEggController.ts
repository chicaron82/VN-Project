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
