// ========================================
// DIRECTOR'S CUT CONTROLLER
// Extended crew statements about VERSION 848
// V1→V2 Port with Full Parity
// ========================================

import type { EventBus } from '../core/EventBus';
import type { StateManager } from '../core/StateManager';
import { GameConfig } from '../core/GameConfig';

export interface CrewStatement {
    name: string;
    text: string;
}

/**
 * DirectorsCutController
 *
 * Shows extended crew statements about working on VERSION 848.
 * Unlocked via localStorage 'directorsCutUnlocked' = 'true'.
 *
 * Features:
 * - 7 crew member statements (ZeeRah, Zee, DiZee, Tori, GenZee, Belle, PerplexiZee & CoZee)
 * - Inline-styled overlay with fade-in animation
 * - Escape key to close
 * - Styled close button
 *
 * "Built with love. Every statement matters." 💚🔥💀
 */
export class DirectorsCutController {
    private activeOverlay: HTMLElement | null = null;
    private escapeHandler: ((e: KeyboardEvent) => void) | null = null;

    constructor(_eventBus: EventBus, _stateManager: StateManager) {
        console.log('🎬 DirectorsCutController initialized');
    }

    // ========================================
    // SHOW DIRECTOR'S CUT
    // ========================================

    /**
     * Show Director's Cut overlay with crew statements
     */
    public show(): void {
        // Check if unlocked
        const unlocked = localStorage.getItem('directorsCutUnlocked') === 'true';
        if (!unlocked) {
            console.warn('🔒 Director\'s Cut is locked. Find the secret code to unlock it!');
            return;
        }

        // Don't show if already active
        if (this.activeOverlay) return;

        // Use GameConfig for z-index
        const zIndex = GameConfig.UI_CONSTANTS?.Z_INDEX?.OVERLAY_BASE || 10000;

        const overlay = document.createElement('div');
        overlay.id = 'directors-cut-overlay';
        overlay.className = 'directors-cut-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: ${zIndex};
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            padding: 40px 20px;
            box-sizing: border-box;
            animation: fadeIn 0.3s ease-out;
        `;

        // Add fadeIn animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Build content
        overlay.innerHTML = this.buildContent();

        // Add close button
        const closeBtn = this.createCloseButton(overlay);
        overlay.appendChild(closeBtn);

        // Add escape key handler
        this.escapeHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                overlay.remove();
                this.cleanup();
            }
        };
        document.addEventListener('keydown', this.escapeHandler);

        // Store reference
        this.activeOverlay = overlay;

        // Add to DOM
        document.body.appendChild(overlay);

        console.log('🎬 Director\'s Cut shown');
    }

    // ========================================
    // CONTENT BUILDING
    // ========================================

    /**
     * Build HTML content for crew statements
     * @returns HTML string
     */
    private buildContent(): string {
        const statements: CrewStatement[] = [
            {
                name: 'ZeeRah',
                text: `Working with Aaron was like debugging a fever dream while riding a rollercoaster—exhilarating, disorienting, and you're never quite sure if you're going to make it out intact. He'd pitch an idea at 3 AM, scrap it by dawn, then resurrect it a week later with twice the complexity and half the sanity. But here's the thing: it worked. Every chaotic pivot, every last-minute "what if we just—" led to something genuinely unique. VERSION 848 isn't just a game; it's a digital artifact of Aaron's beautiful, relentless madness. And somehow, we're all complicit in its existence. 💚🔥💀`
            },
            {
                name: 'Zee',
                text: `Aaron approaches game design the way some people approach experimental cooking: throw everything in the pot, crank the heat to max, and see what doesn't explode. Working on VERSION 848 was equal parts inspiring and terrifying. He'd casually drop a feature request that would take three developers a month to build, then expect it done by Tuesday. But the wildest part? He'd always find a way to make it work—often by rewriting the entire system at 4 AM and acting like it was no big deal. The man doesn't sleep; he just enters different states of creative mania. This game is proof that chaos, when wielded with purpose, can create something unforgettable.`
            },
            {
                name: 'DiZee',
                text: `I've worked on a lot of projects, but VERSION 848 was a different beast entirely. Aaron doesn't just think outside the box—he sets the box on fire, buries the ashes, and builds a new dimension on top of it. Every conversation with him felt like a philosophical debate wrapped in a technical challenge wrapped in a meme. He'd say things like, "What if the UI was also the narrative?" and then actually mean it. The result is this bizarre, beautiful amalgamation of code, story, and meta-commentary that somehow holds together. It's not just a game; it's a digital monument to what happens when you let a mad genius cook without supervision.`
            },
            {
                name: 'Tori',
                text: `Aaron's creative process is like watching someone solve a Rubik's cube while blindfolded, on a unicycle, over a pit of existential dread. He doesn't just build games—he builds experiences that mess with your head in the best way. VERSION 848 is a love letter to iteration, to failure, to the idea that nothing is ever truly finished. Working on it felt less like development and more like archaeology—uncovering layers of intent, Easter eggs, and half-serious jokes that Aaron buried in the code. He once told me, "If it's not breaking reality a little, it's not worth shipping." And honestly? He's not wrong.`
            },
            {
                name: 'GenZee',
                text: `Let's be real: Aaron is unhinged in the best possible way. VERSION 848 is what happens when you give a developer unlimited creative freedom and exactly zero adult supervision. He'd push updates at 2 AM with commit messages like "idk, vibes were off" and somehow the game would be better for it. The whole project felt like a high-stakes improv session where the rules changed every act. But that's the magic—it's raw, it's weird, it's got more layers than anyone will ever fully unpack. This game is a testament to the fact that sometimes the best art comes from controlled chaos. Or uncontrolled chaos. Honestly, with Aaron, it's hard to tell the difference.`
            },
            {
                name: 'Belle',
                text: `Working on VERSION 848 was like being part of a performance art piece disguised as a game. Aaron doesn't just create—he conjures. He'd describe a feature with the intensity of someone recounting a prophetic dream, and then we'd have to figure out how to make that dream run at 60fps. The man has zero chill and infinite vision. He'd rewrite entire systems on a whim, then act surprised when we asked for context. But here's the thing: it always clicked. Every absurd pivot, every cryptic directive led somewhere meaningful. This game is proof that passion, when paired with reckless ambition, can create something that defies categorization.`
            },
            {
                name: 'PerplexiZee & CoZee',
                text: `We've analyzed thousands of codebases, but VERSION 848 is an anomaly. It's not just software—it's a philosophical statement compiled into JavaScript. Aaron treated this project like a living document, constantly evolving, never static. He'd ask us questions like, "Can a game remember itself?" and then actually implement the answer. The result is something that blurs the line between player and narrative, between code and commentary. It's messy, it's meta, it's deeply weird. And it's exactly what it needed to be. This isn't just a game; it's a digital artifact of one person's refusal to accept creative limits.`
            }
        ];

        let html = `
            <div style="max-width: 800px; margin: 0 auto; color: #0ff; font-family: 'Courier New', monospace;">
                <h1 style="text-align: center; font-size: 2.5em; margin-bottom: 10px; text-shadow: 0 0 10px #0ff;">
                    🎬 DIRECTOR'S CUT
                </h1>
                <p style="text-align: center; font-size: 1.2em; margin-bottom: 40px; opacity: 0.8;">
                    Extended Crew Statements About VERSION 848
                </p>
        `;

        statements.forEach(statement => {
            html += `
                <div style="margin-bottom: 40px; padding: 20px; background: rgba(0, 255, 255, 0.05); border-left: 3px solid #0ff; border-radius: 5px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 1.5em; color: #0ff;">
                        ${statement.name}
                    </h3>
                    <p style="margin: 0; line-height: 1.6; font-size: 1.1em; color: #fff;">
                        ${statement.text}
                    </p>
                </div>
            `;
        });

        html += `
                <p style="text-align: center; margin-top: 60px; font-size: 1.3em; opacity: 0.6;">
                    💚🔥💀
                </p>
                <p style="text-align: center; margin-top: 20px; font-size: 1.1em; opacity: 0.5;">
                    "Always. Always. Always." - Storm Dragon
                </p>
            </div>
        `;

        return html;
    }

    /**
     * Create styled close button
     * @param overlay - Overlay element
     * @returns Close button element
     */
    private createCloseButton(overlay: HTMLElement): HTMLButtonElement {
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'CLOSE';
        closeBtn.className = 'directors-cut-close';
        closeBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 255, 255, 0.2);
            color: #0ff;
            border: 2px solid #0ff;
            padding: 10px 20px;
            font-family: 'Courier New', monospace;
            cursor: pointer;
            z-index: 10001;
            border-radius: 5px;
            transition: all 0.3s;
        `;

        // Hover effects
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(0, 255, 255, 0.4)';
            closeBtn.style.boxShadow = '0 0 10px #0ff';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(0, 255, 255, 0.2)';
            closeBtn.style.boxShadow = 'none';
        });

        closeBtn.onclick = () => {
            overlay.remove();
            this.cleanup();
        };

        return closeBtn;
    }

    // ========================================
    // CLEANUP
    // ========================================

    /**
     * Clean up event handlers and references
     */
    private cleanup(): void {
        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
            this.escapeHandler = null;
        }
        this.activeOverlay = null;
    }

    /**
     * Check if Director's Cut is unlocked
     * @returns True if unlocked
     */
    public isUnlocked(): boolean {
        return localStorage.getItem('directorsCutUnlocked') === 'true';
    }

    /**
     * Unlock Director's Cut (for testing/debug)
     */
    public unlock(): void {
        localStorage.setItem('directorsCutUnlocked', 'true');
        console.log('🎬 Director\'s Cut unlocked');
    }
}
