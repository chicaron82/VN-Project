/**
 * BOOT SEQUENCE CONTROLLER (LAZY-LOADED)
 * "Wild Ass Information" BIOS startup sequence
 *
 * Only loaded and executed on first visit (checked via sessionStorage).
 * Subsequent visits skip straight to content.
 *
 * Features:
 * - Authentic terminal boot animation
 * - Skip functionality (any key or click)
 * - Audio integration (startup, clicks, glitch)
 * - Scanline CRT effect
 * - Automatic cleanup
 *
 * Lazy Loading Pattern:
 * ```ts
 * const hasBooted = sessionStorage.getItem('uv7_has_booted');
 * if (!hasBooted) {
 *     const { BootSequenceController } = await import('./home-section/BootSequenceController');
 *     await new BootSequenceController().run(container);
 *     sessionStorage.setItem('uv7_has_booted', 'true');
 * }
 * ```
 */

interface ShellAudio {
    init(): void;
    play(sound: string): void;
}

export class BootSequenceController {
    private skipped = false;

    /**
     * Run the boot sequence animation
     */
    async run(container: HTMLElement): Promise<void> {
        // Init audio if available
        const shellAudio = (window as unknown as { shellAudio?: ShellAudio }).shellAudio;
        if (shellAudio) shellAudio.init();

        // Setup Boot DOM
        container.innerHTML = `
            <div class="boot-screen" style="
                background: #000;
                height: 100%;
                width: 100%;
                display: flex;
                flex-direction: column;
                padding: 2rem;
                font-family: 'Courier New', monospace;
                color: #00ff88;
                overflow: hidden;
                position: relative;
                z-index: 9999;
            ">
                <div class="boot-logo" style="margin-bottom: 2rem; font-weight: bold; font-size: 1.2rem;">
                    UV7 TERMINAL // v8.4.8
                </div>
                <div class="boot-log" id="boot-log"></div>
                <div class="boot-skip-hint" id="boot-skip-hint" style="
                    position: absolute;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    color: rgba(0, 255, 136, 0.5);
                    font-size: 0.9rem;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    cursor: pointer;
                ">Press any key or tap to skip</div>
                <div class="scanline" style="
                    position: absolute; top: 0; left: 0; width: 100%; height: 10px;
                    background: rgba(0, 255, 136, 0.1);
                    animation: scan 2s linear infinite;
                    pointer-events: none;
                "></div>
            </div>
            <style>
                @keyframes scan { 0% { top: -10px; } 100% { top: 100%; } }
                .log-line { margin-bottom: 4px; opacity: 0.8; }
                .log-line.error { color: #ff4444; }
                .log-line.warn { color: #ffaa00; }
                .log-line.success { color: #00ff88; text-shadow: 0 0 5px rgba(0,255,136,0.5); }
            </style>
        `;

        const log = container.querySelector('#boot-log')!;
        const skipHint = container.querySelector('#boot-skip-hint') as HTMLElement;
        const bootScreen = container.querySelector('.boot-screen') as HTMLElement;

        const sleep = (ms: number): Promise<unknown> => new Promise(r => setTimeout(r, ms));
        const addLog = (text: string, type = ''): void => {
            if (this.skipped) return;
            const div = document.createElement('div');
            div.className = `log-line ${type}`;
            div.textContent = `> ${text}`;
            log.appendChild(div);
            log.scrollTop = log.scrollHeight;
            if (shellAudio) shellAudio.play(type === 'error' ? 'error' : 'click');
        };

        // Skip handler
        const skip = (): void => {
            if (this.skipped) return;
            this.skipped = true;
            bootScreen.style.opacity = '0';
            bootScreen.style.transition = 'opacity 0.3s ease-out';
        };

        // Show skip hint after 2 seconds
        setTimeout(() => {
            if (!this.skipped && skipHint) {
                skipHint.style.opacity = '1';
            }
        }, 2000);

        // Skip on any key press or click
        const keyHandler = (): void => skip();
        const clickHandler = (): void => skip();

        document.addEventListener('keydown', keyHandler, { once: true });
        bootScreen.addEventListener('click', clickHandler, { once: true });

        // Cleanup listeners
        const cleanup = (): void => {
            document.removeEventListener('keydown', keyHandler);
            bootScreen.removeEventListener('click', clickHandler);
        };

        // The Boot Sequence
        if (shellAudio) shellAudio.play('startup');

        addLog('BIOS CHECK...', 'warn');
        if (this.skipped) { cleanup(); return; }
        await sleep(300);
        addLog('CPU: UV7 Neural Core... OK', 'success');
        if (this.skipped) { cleanup(); return; }
        await sleep(150);
        addLog('RAM: 848TB Infinite Loop... OK', 'success');
        if (this.skipped) { cleanup(); return; }
        await sleep(150);
        addLog('GPU: Reality Engine v2... OK', 'success');
        if (this.skipped) { cleanup(); return; }
        await sleep(400);

        addLog('Mounting File Systems...');
        if (this.skipped) { cleanup(); return; }
        await sleep(200);
        addLog('/dev/v1/chaos ...... MOUNTED (Read Only)');
        if (this.skipped) { cleanup(); return; }
        await sleep(100);
        addLog('/dev/v2/order ...... MOUNTED (Read/Write)');
        if (this.skipped) { cleanup(); return; }
        await sleep(100);
        addLog('/dev/showcase ...... MOUNTED');
        if (this.skipped) { cleanup(); return; }
        await sleep(500);

        addLog('Initializing Neural Link...');
        if (this.skipped) { cleanup(); return; }
        await sleep(300);
        addLog('Connecting to Crew [DiZee, Tori, Belle, Zee]...');
        if (this.skipped) { cleanup(); return; }
        await sleep(600);
        addLog('Handshake Established. Latency: 0ms', 'success');
        if (this.skipped) { cleanup(); return; }
        await sleep(400);

        addLog('Loading Graphical Shell...');
        if (this.skipped) { cleanup(); return; }
        await sleep(800);

        // Glitch Effect
        addLog('EXECUTING STARTUP.BAT', 'warn');
        if (shellAudio) shellAudio.play('glitch');

        if (this.skipped) { cleanup(); return; }
        bootScreen.style.filter = 'contrast(200%) brightness(200%)';
        bootScreen.style.transform = 'skewX(10deg)';
        await sleep(100);
        if (this.skipped) { cleanup(); return; }
        bootScreen.style.filter = 'none';
        bootScreen.style.transform = 'none';
        await sleep(50);
        if (this.skipped) { cleanup(); return; }
        bootScreen.style.opacity = '0';
        bootScreen.style.transition = 'opacity 0.5s ease-out';

        await sleep(500);

        cleanup();
    }
}
