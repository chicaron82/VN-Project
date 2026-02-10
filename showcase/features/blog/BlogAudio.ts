/**
 * ═══════════════════════════════════════════════════════════════
 * TIMELINE AUDIO SYSTEM
 *
 * Phase 13: Subtle UI sound effects (Synthesized)
 * Part of MAXIMUM MICHELIN timeline enhancements
 *
 * Features:
 * - Procedural sound generation (no assets needed)
 * - Soft clicks for interactions
 * - Subtle swooshes for timeline movement
 * - Mute toggle support
 * - Spatial panning based on screen position
 *
 * Credit: ZeeRah's Chaos 😈
 * 848 is sacred. 💚🔥💀
 * ═══════════════════════════════════════════════════════════════
 */

import { Logger } from '@utils/Logger';

export class BlogAudio {
    private ctx: AudioContext | null;
    private masterGain: GainNode | null;
    private isMuted: boolean;
    private isEnabled: boolean;

    constructor(private timelineSelector: string = '.timeline-phases') {
        this.ctx = null;
        this.masterGain = null;
        this.isMuted = false;
        this.isEnabled = false;

        this.init();
    }

    private init(): void {
        this.createMuteToggle();
        this.attachListeners();
        Logger.ui('🔊 [BlogAudio] Initialized (Click toggle to enable)');
    }

    /**
     * Initialize AudioContext on first user interaction
     */
    private enableAudio(): void {
        if (this.ctx) return;

        try {
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            this.ctx = new AudioContextClass();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.masterGain.gain.value = 0.15; // Low volume default

            this.isEnabled = true;
            this.playPowerOn();
            Logger.audio('🔊 [BlogAudio] Audio Engine Started');
        } catch (e) {
            Logger.error('🔊 [BlogAudio] Web Audio API not supported', e);
        }
    }

    /**
     * Create mute toggle in toolbar
     */
    private createMuteToggle(): void {
        const toolbar = document.querySelector('.timeline-toolbar');
        if (!toolbar) return;

        const btn = document.createElement('button');
        btn.className = 'timeline-btn audio-toggle';
        btn.title = 'Toggle Sound';
        btn.innerHTML = '🔇'; // Start muted/disabled
        btn.style.marginLeft = '0.5rem';

        btn.addEventListener('click', () => {
            if (!this.ctx) {
                this.enableAudio();
                this.isMuted = false;
                btn.innerHTML = '🔊';
                btn.classList.add('active');
            } else {
                this.toggleMute(btn);
            }
        });

        toolbar.appendChild(btn);
    }

    private toggleMute(btn: HTMLElement): void {
        this.isMuted = !this.isMuted;

        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(
                this.isMuted ? 0 : 0.15,
                this.ctx!.currentTime
            );
        }

        btn.innerHTML = this.isMuted ? '🔇' : '🔊';
        btn.classList.toggle('active', !this.isMuted);
    }

    /**
     * Attach interaction listeners
     */
    private attachListeners(): void {
        const timeline = document.querySelector(this.timelineSelector);
        if (!timeline) return;

        // Hover sounds (throttled)
        let lastHover = 0;
        timeline.addEventListener('mouseenter', (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('timeline-item')) {
                const now = Date.now();
                if (now - lastHover > 50) { // 50ms throttle
                    this.playHover();
                    lastHover = now;
                }
            }
        }, true); // Capture phase

        // Click sounds
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.closest('.timeline-btn') ||
                target.closest('.timeline-item') ||
                target.tagName === 'BUTTON' ||
                target.closest('.heatmap-day')) {
                this.playClick();
            }
        });

        // Search typing
        const searchInput = document.querySelector('.timeline-search input');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.playKeystroke());
        }
    }

    /**
     * Play soft click (High frequency blip)
     */
    public playClick(): void {
        if (!this.isEnabled || !this.ctx || !this.masterGain || this.isMuted) return;

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.1);

        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 0.1);
    }

    /**
     * Play hover sound (Low frequency airy tick)
     */
    public playHover(): void {
        if (!this.isEnabled || !this.ctx || !this.masterGain || this.isMuted) return;

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.linearRampToValueAtTime(300, t + 0.05);

        gain.gain.setValueAtTime(0.1, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.05);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 0.05);
    }

    /**
     * Play keystroke (Mechanical switch feel)
     */
    public playKeystroke(): void {
        if (!this.isEnabled || !this.ctx || !this.masterGain || this.isMuted) return;

        const t = this.ctx.currentTime;
        // White noise burst could be better but simplified to osc for now
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(200, t + 0.05);

        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 0.05);
    }

    /**
     * Power on sound (Rising chord)
     */
    private playPowerOn(): void {
        if (!this.ctx || !this.masterGain) return;

        const t = this.ctx.currentTime;
        const freqs = [220, 330, 440, 550]; // A major 7ish

        freqs.forEach((f) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t);
            osc.frequency.linearRampToValueAtTime(f * 2, t + 0.5); // Octave jump

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.1, t + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);

            osc.connect(gain);
            gain.connect(this.masterGain!);

            osc.start(t);
            osc.stop(t + 1.5);
        });
    }

    public destroy(): void {
        if (this.ctx) {
            this.ctx.close();
            this.ctx = null;
        }
        Logger.audio('🔊 [BlogAudio] Destroyed');
    }
}
