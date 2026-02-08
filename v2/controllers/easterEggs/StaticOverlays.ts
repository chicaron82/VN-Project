// ========================================
// STATIC OVERLAYS
// Content-display easter eggs
//
// Extracted from EasterEggController.ts (~200 lines -> dedicated module)
//
// Handles:
// - UV7 Crew Bios
// - Loop Timeline visualization
// - True Attempt Number display
// - Echo Compilation voice lines
// - Always Compilation (Storm Dragon's signature)
// - Torigatchi external link
// - DiZee architect tribute
//
// 848 is sacred. 💚🔥💀
// ========================================

import { StateManager } from '../../core/StateManager';
import { OverlayFactory } from './OverlayFactory';

/**
 * StaticOverlays
 *
 * Manages the content-display easter eggs that all follow the same pattern:
 * create overlay -> set innerHTML -> add close button -> show overlay.
 */
export class StaticOverlays {
    constructor(
        private overlayFactory: OverlayFactory,
        private stateManager: StateManager
    ) {}

    /**
     * UV7 Crew Bios - Meet the crew behind the game
     */
    showUV7CrewBios(): void {
        console.log('🎬 UV7 CREW BIOS EASTER EGG');

        const { overlay, box } = this.overlayFactory.createOverlay({ variant: 'success', id: 'uv7-crew-overlay' });

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

        const closeBtn = this.overlayFactory.createButton('CLOSE', () => this.overlayFactory.closeOverlay(overlay), 'success');
        box.appendChild(closeBtn);

        this.overlayFactory.showOverlay(overlay);
    }

    /**
     * Loop Timeline - Visualize the bootstrap paradox
     */
    showLoopTimeline(): void {
        console.log('🔄 LOOP TIMELINE EASTER EGG');

        const loopVersion = this.stateManager.get<number>('game.loopVersion') ?? 848;

        const { overlay, box } = this.overlayFactory.createOverlay({ variant: 'info', id: 'loop-timeline-overlay' });

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

        const closeBtn = this.overlayFactory.createButton('CLOSE', () => this.overlayFactory.closeOverlay(overlay), 'info');
        box.appendChild(closeBtn);

        this.overlayFactory.showOverlay(overlay);
    }

    /**
     * True Attempt Number - Show actual loop count
     */
    showTrueAttemptNumber(): void {
        console.log('🔢 TRUE ATTEMPT NUMBER EASTER EGG');

        const loopVersion = this.stateManager.get<number>('game.loopVersion') ?? 848;

        const { overlay, box } = this.overlayFactory.createOverlay({ variant: 'default', id: 'true-attempt-overlay' });

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

        const closeBtn = this.overlayFactory.createButton('CLOSE', () => this.overlayFactory.closeOverlay(overlay), 'default');
        box.appendChild(closeBtn);

        this.overlayFactory.showOverlay(overlay);
    }

    /**
     * Echo Compilation - All echo voice lines
     */
    showEchoCompilation(): void {
        console.log('👻 ECHO COMPILATION EASTER EGG');

        const { overlay, box } = this.overlayFactory.createOverlay({ variant: 'default', id: 'echo-compilation-overlay' });

        box.innerHTML = `
            <h2 style="color: #00ff88; font-size: 2em; margin-bottom: 20px;">ECHO VOICES</h2>
            <p style="color: #0ff; margin-bottom: 15px;"><strong>💫 Hope:</strong> "You came back. That means something."</p>
            <p style="color: #8f8; margin-bottom: 15px;"><strong>🌙 Gentle:</strong> "Again? ...Alright. Let's try again."</p>
            <p style="color: #f44; margin-bottom: 30px;"><strong>🖤 Despair:</strong> "You're making this worse, you know."</p>
            <p style="color: #888; font-size: 0.9em;">
                The echoes remember. They always remember.
            </p>
        `;

        const closeBtn = this.overlayFactory.createButton('CLOSE', () => this.overlayFactory.closeOverlay(overlay), 'default');
        box.appendChild(closeBtn);

        this.overlayFactory.showOverlay(overlay);
    }

    /**
     * Always Compilation - Storm Dragon's signature
     */
    showAlwaysCompilation(): void {
        console.log('💚 ALWAYS3 EASTER EGG');

        const { overlay, box } = this.overlayFactory.createOverlay({ variant: 'success', id: 'always-overlay' });

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

        const closeBtn = this.overlayFactory.createButton('CLOSE', () => this.overlayFactory.closeOverlay(overlay), 'success');
        box.appendChild(closeBtn);

        this.overlayFactory.showOverlay(overlay);
    }

    /**
     * Torigatchi Easter Egg - Link to external project
     */
    showTorigatchiEasterEgg(): void {
        console.log('🥚 TORIGATCHI EASTER EGG');

        const { overlay, box } = this.overlayFactory.createOverlay({ variant: 'error', id: 'torigatchi-overlay' });

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

        const playBtn = this.overlayFactory.createButton('PLAY TORIGATCHI', () => {
            window.open('https://chicaron82.github.io/torigatchi/', '_blank');
        }, 'error');

        const closeBtn = this.overlayFactory.createButton('CLOSE', () => this.overlayFactory.closeOverlay(overlay), 'error');

        box.appendChild(playBtn);
        box.appendChild(closeBtn);

        this.overlayFactory.showOverlay(overlay);
    }

    /**
     * DiZee Easter Egg - Architect's signature
     */
    showDizeeEasterEgg(): void {
        console.log('🖤 DIZEE EASTER EGG');

        const { overlay, box } = this.overlayFactory.createOverlay({ variant: 'default', id: 'dizee-overlay' });

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

        const closeBtn = this.overlayFactory.createButton('CLOSE', () => this.overlayFactory.closeOverlay(overlay), 'default');
        box.appendChild(closeBtn);

        this.overlayFactory.showOverlay(overlay);
    }
}
