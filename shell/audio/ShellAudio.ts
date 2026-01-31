/**
 * ═══════════════════════════════════════════════════════════════
 * SHELL AUDIO CONTROLLER
 *
 * Lightweight, asset-free SFX using Web Audio API oscillators.
 * Provides the "Hollywood OS" sound palette:
 * - Chirps
 * - Bloops
 * - Glitch Noise
 * - Power On Hum
 * ═══════════════════════════════════════════════════════════════
 */

type SoundEffect = 'boop' | 'click' | 'hover' | 'error' | 'glitch' | 'startup';
type OscillatorType = 'sine' | 'triangle' | 'sawtooth' | 'square';

declare global {
    interface Window {
        shellAudio: ShellAudio;
        webkitAudioContext?: typeof AudioContext;
    }
}

export class ShellAudio {
    private ctx: AudioContext | null;
    private masterGain: GainNode | null;
    private initialized: boolean;
    private muted: boolean;

    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.initialized = false;
        this.muted = false;
    }

    /**
     * Initialize Audio Context (must be triggered by user interaction first)
     * but we prep it here.
     */
    init(): void {
        if (this.initialized) return;

        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContextClass();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.15; // Keep it subtle by default
            this.masterGain.connect(this.ctx.destination);
            this.initialized = true;
            console.log('[ShellAudio] Initialized');
        } catch (e) {
            console.warn('[ShellAudio] Web Audio API not supported', e);
        }
    }

    /**
     * Resume context if suspended (browser policy)
     */
    async resume(): Promise<void> {
        if (!this.ctx) this.init();
        if (this.ctx?.state === 'suspended') {
            await this.ctx.resume();
        }
    }

    /**
     * Play a synthesized sound effect
     */
    play(type: SoundEffect): void {
        if (this.muted || !this.initialized) return;
        this.resume(); // Try to resume just in case

        switch (type) {
            case 'boop':
                this.playTone(800, 'sine', 0.05, 0.1);
                break;
            case 'click':
                this.playTone(1200, 'triangle', 0.01, 0.05);
                break;
            case 'hover':
                this.playTone(400, 'sine', 0.02, 0.05, 0.05); // Very quiet
                break;
            case 'error':
                this.playTone(150, 'sawtooth', 0.3, 0.4);
                this.playTone(100, 'sawtooth', 0.3, 0.4, 0.1); // Harmony
                break;
            case 'startup':
                this.playStartupSequence();
                break;
            case 'glitch':
                this.playGlitchNoise();
                break;
        }
    }

    /**
     * Low-level tone generator
     */
    private playTone(freq: number, type: OscillatorType, duration: number, vol = 0.1, delay = 0): void {
        if (!this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

        // Envelope
        gain.gain.setValueAtTime(0, this.ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + delay + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(this.ctx.currentTime + delay);
        osc.stop(this.ctx.currentTime + delay + duration + 0.1);
    }

    /**
     * Complex Startup Sound (Drifting chord)
     */
    private playStartupSequence(): void {
        if (!this.ctx || !this.masterGain) return;

        const now = this.ctx.currentTime;
        const duration = 2.5;

        // Base Drone
        const drone = this.ctx.createOscillator();
        const droneGain = this.ctx.createGain();

        drone.type = 'sine';
        drone.frequency.setValueAtTime(110, now); // A2
        drone.frequency.linearRampToValueAtTime(220, now + duration); // Slide up to A3

        droneGain.gain.setValueAtTime(0, now);
        droneGain.gain.linearRampToValueAtTime(0.2, now + 0.5);
        droneGain.gain.linearRampToValueAtTime(0, now + duration);

        drone.connect(droneGain);
        droneGain.connect(this.masterGain);

        drone.start(now);
        drone.stop(now + duration);

        // Arpeggio
        this.playTone(440, 'triangle', 0.1, 0.1, 0.2); // A4
        this.playTone(554, 'triangle', 0.1, 0.1, 0.4); // C#5
        this.playTone(659, 'triangle', 0.1, 0.1, 0.6); // E5
        this.playTone(880, 'sine', 0.8, 0.2, 0.8);     // A5 (Long Finish)
    }

    /**
     * White noise burst for glitches
     */
    private playGlitchNoise(): void {
        if (!this.ctx || !this.masterGain) return;

        const bufferSize = this.ctx.sampleRate * 0.1; // 100ms
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const gain = this.ctx.createGain();
        gain.gain.value = 0.1;

        noise.connect(gain);
        gain.connect(this.masterGain);
        noise.start();
    }
}

// Singleton export
export const shellAudio = new ShellAudio();
window.shellAudio = shellAudio;
