// ========================================
// UV7 FAMILY SYSTEM
// Family member discovery, toasts, and Ronniegatchi inspiration
//
// Extracted from EasterEggController.ts (~200 lines -> dedicated module)
//
// Handles:
// - UV7 family member configuration and data
// - Family member discovery tracking (localStorage)
// - Toast notifications for discoveries
// - Ronniegatchi inspiration display overlay
//
// "Together. Digital. Forever."
//
// 848 is sacred. 💚🔥💀
// ========================================

import { EventBus } from '../../core/EventBus';
import { OverlayFactory } from './OverlayFactory';
import { Logger } from '@utils/Logger';

/**
 * UV7FamilySystem
 *
 * Manages UV7 family member discoveries, toast notifications,
 * and the Ronniegatchi inspiration overlay.
 */
export class UV7FamilySystem {
    /** UV7 Family Member Effects */
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

    constructor(
        private overlayFactory: OverlayFactory,
        private eventBus: EventBus
    ) {}

    /**
     * Show UV7 Family Member - Discovery toast and effect
     */
    showFamilyMember(member: string): void {
        const config = this.UV7_FAMILY[member];
        if (!config) return;

        Logger.ui(`🎨 UV7 Family Easter Egg: ${config.name}`);

        // Track discovery
        this.trackDiscovery(member);

        // Show toast
        this.showToast(config.name, config.title, config.quote, config.color);

        // Emit visual effect
        this.eventBus.emit('visual:cue', { type: 'glitch', channel: 'ui' });
    }

    /**
     * Track UV7 family member discovery
     */
    private trackDiscovery(member: string): void {
        const discovered = JSON.parse(localStorage.getItem('uv7_discovered') || '[]') as string[];
        if (!discovered.includes(member)) {
            discovered.push(member);
            localStorage.setItem('uv7_discovered', JSON.stringify(discovered));
            Logger.ui(`✨ ${member} discovered! (${discovered.length}/6 family members found)`);
        }
    }

    /**
     * Show UV7 Toast notification
     */
    showToast(name: string, title: string, quote: string, color: string = '#00ff88'): void {
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

    /**
     * Show Ronniegatchi Inspiration - The original inspiration display
     */
    showRonniegatchiInspiration(): void {
        Logger.ui('💜 RONNIEGATCHI INSPIRATION');

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
        this.overlayFactory.trackOverlay(overlay);

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
            }, 500);
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                }, 500);
            }
        });
    }
}
