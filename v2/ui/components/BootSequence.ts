import { GameEngine } from '../../core/GameEngine';

/**
 * System files to display during boot sequence
 * Organized by category for visual grouping
 */
const SYSTEM_FILES = {
    core: [
        { name: 'game-engine.js', size: '8.9K lines', color: '#00ffff' },
        { name: 'state-manager.ts', size: '400 lines', color: '#00ffff' },
        { name: 'save-manager.js', size: '350 lines', color: '#00ffff' },
        { name: 'settings-manager.js', size: '500 lines', color: '#00ffff' },
    ],
    tether: [
        { name: 'tether-system.js', size: '750 lines', color: '#00ff88', glitch: false },
        { name: 'echo-memory-system.js', size: '533 lines', color: '#bf00ff', pause: true },
        { name: 'hold-on-controller.js', size: '200 lines', color: '#00ff88' },
    ],
    routes: [
        { name: 'tori-route-act1.js', size: '1.2K lines', color: '#00aaff' },
        { name: 'tori-route-endings.js', size: '800 lines', color: '#00aaff' },
        { name: 'ronnie-route.js', size: '1.5K lines', color: '#ffaa00' },
        { name: 'epilogue.js', size: '600 lines', color: '#ffd700' },
        { name: 'shared-prologue.js', size: '400 lines', color: '#bf00ff' },
    ],
    ui: [
        { name: 'notification-shade-controller.js', size: '450 lines', color: '#00ffff' },
        { name: 'sprite-controller.js', size: '300 lines', color: '#00ffff' },
        { name: 'backlog-controller.js', size: '250 lines', color: '#00ffff' },
        { name: 'menu-controller.js', size: '200 lines', color: '#00ffff' },
    ],
    special: [
        { name: 'insane-visuals-controller.js', size: '350 lines', color: '#ff0066', glitch: true },
        { name: 'easter-egg-controller.js', size: '180 lines', color: '#ffd700' },
        { name: 'haptic-controller.js', size: '150 lines', color: '#ff00ff' },
    ],
    easterEggs: [
        { name: 'definitely-not-skynet.js', size: '???', color: '#ff0000', flash: true, error: true },
        { name: 'torigatchi-secret.js', size: '???', color: '#00ff88', conditional: 'torigatchi' },
        { name: 'the-truth.exe', size: '848 bytes', color: '#bf00ff', conditional: 'insane' },
    ]
};

interface FileEntry {
    name: string;
    size: string;
    color: string;
    glitch?: boolean;
    pause?: boolean;
    flash?: boolean;
    error?: boolean;
    conditional?: string;
}

/**
 * BootSequence - Terminal-style loading with all the bells and whistles
 * Ported to V2 TypeScript
 */
export class BootSequence {
    private container: HTMLElement;
    private game: GameEngine;
    private logoRevealCallback: (percent: number) => void;

    // UI References
    // @ts-ignore
    private currentLine: HTMLElement | null = null;
    private linesContainer: HTMLElement | undefined;
    private visibleLines: HTMLElement[] = [];

    // State
    private isSkipping: boolean = false;
    // @ts-ignore
    private currentProgress: number = 0;
    private readonly MAX_VISIBLE_LINES = 3;

    constructor(
        containerElement: HTMLElement,
        game: GameEngine,
        logoRevealCallback?: (percent: number) => void
    ) {
        this.container = containerElement;
        this.game = game;
        this.logoRevealCallback = logoRevealCallback || (() => { });
    }

    /**
     * Start the boot sequence
     */
    async start(): Promise<void> {
        this.showHeader();

        // Load Categories - skip checks happen inside each method
        await this.loadCategory('CORE SYSTEMS', SYSTEM_FILES.core, 40, 0, 25, 'soft');
        await this.loadCategory('TETHER FRAMEWORK', SYSTEM_FILES.tether, 50, 25, 50, 'medium');
        await this.loadCategory('ROUTE HANDLERS', SYSTEM_FILES.routes, 35, 50, 75, 'soft');
        await this.loadCategory('UI CONTROLLERS', SYSTEM_FILES.ui, 30, 75, 90, 'soft');
        await this.loadCategory('SPECIAL SYSTEMS', SYSTEM_FILES.special, 45, 90, 98, 'heavy');

        // Easter eggs (final 2%)
        await this.showEasterEggs(98, 100);

        // Final stats (respects isSkipping)
        await this.showBootStats();

        // Complete
        await this.showBootComplete();

        // Delay before main menu (skipped if isSkipping)
        if (!this.isSkipping) {
            await this.delay(2000);
        }
    }

    private updateProgress(percent: number) {
        this.currentProgress = percent;
        this.logoRevealCallback(percent);
    }

    private showHeader() {
        const versionNumber = this.game.bootstrapTracker.getCurrentAttempt();
        const header = document.createElement('div');
        header.className = 'boot-header';
        header.innerHTML = `
            <div class="boot-title boot-title-glitch">VERSION ${versionNumber} INITIALIZATION</div>
            <div class="boot-subtitle">Loading temporal framework...</div>
        `;
        this.container.appendChild(header);

        this.linesContainer = document.createElement('div');
        this.linesContainer.className = 'boot-lines-container';
        this.container.appendChild(this.linesContainer);
    }

    private async loadCategory(
        categoryName: string,
        files: FileEntry[],
        baseSpeed: number = 40,
        progressStart: number = 0,
        progressEnd: number = 100,
        _hapticIntensity: 'soft' | 'medium' | 'heavy' = 'soft'
    ) {
        if (this.isSkipping) {
            this.showCategoryInstant(categoryName, files);
            this.updateProgress(progressEnd);
            return;
        }

        // Category Header
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'boot-category';
        categoryDiv.textContent = `→ ${categoryName}`;
        if (this.linesContainer) this.linesContainer.appendChild(categoryDiv);

        this.addVisibleLine(categoryDiv);
        await this.delay(200);

        // Filter Files
        const validFiles = this.filterFiles(files);
        const progressPerFile = (progressEnd - progressStart) / Math.max(1, validFiles.length);

        for (let i = 0; i < validFiles.length; i++) {
            const file = validFiles[i];
            if (!file) continue;

            await this.loadFile(file, baseSpeed);

            const newProgress = progressStart + (progressPerFile * (i + 1));
            this.updateProgress(newProgress);

            if (file.pause && !this.isSkipping) await this.delay(300);
        }

        await this.delay(150);
    }

    private filterFiles(files: FileEntry[]): FileEntry[] {
        return files.filter(file => {
            if (!file.conditional) return true;
            if (file.conditional === 'torigatchi') return localStorage.getItem('torigatchiUnlocked');
            if (file.conditional === 'insane') {
                // Check insane mode flag via game state if possible, or fallback
                const flags = this.game['stateManager'].get<any>('flags');
                return flags?.insaneModeLocked;
            }
            return false;
        });
    }

    private async loadFile(file: FileEntry, baseSpeed: number) {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'boot-file';
        fileDiv.style.color = file.color;

        fileDiv.innerHTML = `
            <span class="boot-file-arrow">  ├─</span>
            <span class="boot-file-name">${file.name}</span>
            <span class="boot-file-progress">
                <span class="boot-progress-bar"></span>
            </span>
            <span class="boot-file-size">${file.size}</span>
            <span class="boot-file-status"></span>
        `;

        if (this.linesContainer) this.linesContainer.appendChild(fileDiv);
        this.currentLine = fileDiv;
        this.addVisibleLine(fileDiv);

        const progressBar = fileDiv.querySelector('.boot-progress-bar') as HTMLElement;
        const statusSpan = fileDiv.querySelector('.boot-file-status') as HTMLElement;

        // Error Easter Egg
        if (file.error && !this.isSkipping) {
            await this.animateProgress(progressBar, 0, 60, baseSpeed * 0.8);
            if (statusSpan) {
                statusSpan.textContent = 'ERROR';
                statusSpan.style.color = '#ff0066';
            }
            await this.delay(300);

            // Retry
            const retryDiv = document.createElement('div');
            retryDiv.className = 'boot-file boot-retry';
            retryDiv.textContent = '  │  Retrying connection...';
            retryDiv.style.color = '#ffaa00';
            if (this.linesContainer) this.linesContainer.appendChild(retryDiv);
            this.addVisibleLine(retryDiv);

            await this.delay(400);
            if (progressBar) progressBar.style.width = '0%';
            if (statusSpan) statusSpan.textContent = '';
        }

        // Glitch
        if (file.glitch && !this.isSkipping) {
            fileDiv.style.animation = 'bootGlitch 0.3s';
            await this.delay(100);
        }

        // Animate
        await this.animateProgress(progressBar, 0, 100, baseSpeed);

        if (statusSpan) {
            statusSpan.textContent = 'OK';
            statusSpan.style.color = '#00ff88';
        }

        // Flash
        if (file.flash && !this.isSkipping) {
            await this.delay(100);
            fileDiv.style.opacity = '0';
            await this.delay(100);
            fileDiv.remove();
        }
    }

    private addVisibleLine(element: HTMLElement) {
        this.visibleLines.push(element);
        if (this.visibleLines.length > this.MAX_VISIBLE_LINES) {
            const oldest = this.visibleLines.shift();
            if (oldest) {
                oldest.classList.add('fading-out');
                setTimeout(() => {
                    if (oldest.parentNode) oldest.remove();
                }, 300);
            }
        }
    }

    private async animateProgress(element: HTMLElement, from: number, to: number, speed: number) {
        if (this.isSkipping) {
            element.style.width = `${to}%`;
            return;
        }

        const steps = 20;
        const increment = (to - from) / steps;
        const delay = speed / steps;

        for (let i = 0; i <= steps; i++) {
            if (this.isSkipping) {
                element.style.width = `${to}%`;
                return;
            }
            const width = from + (increment * i);
            element.style.width = `${width}%`;
            await this.delay(delay);
        }
    }

    private async showEasterEggs(progressStart: number, progressEnd: number) {
        const validEggs = this.filterFiles(SYSTEM_FILES.easterEggs);
        if (validEggs.length === 0) {
            this.updateProgress(progressEnd);
            return;
        }

        const progressPerEgg = (progressEnd - progressStart) / validEggs.length;
        for (let i = 0; i < validEggs.length; i++) {
            const egg = validEggs[i];
            if (!egg) continue;
            await this.loadFile(egg, 30);
            const newProgress = progressStart + (progressPerEgg * (i + 1));
            this.updateProgress(newProgress);
        }
    }

    private async showBootStats() {
        // Quick fade if not skipping
        if (!this.isSkipping) {
            await this.delay(300);
            this.container.style.opacity = '0';
            this.container.style.transition = 'opacity 0.3s ease-out';
            await this.delay(300);
        }

        this.container.innerHTML = '';
        this.container.className = 'boot-terminal boot-final-status';

        const stats = this.getDynamicStats();

        const finalStatusDiv = document.createElement('div');
        finalStatusDiv.className = 'boot-final-display';
        finalStatusDiv.innerHTML = `
            <div class="boot-stat">Memory: <span class="stat-value">${stats.memory}</span></div>
            <div class="boot-stat">Timelines: <span class="stat-value">${stats.timelines}</span></div>
            <div class="boot-stat">Paradox: <span class="stat-value" style="color: ${stats.paradoxColor}">${stats.paradox}</span></div>
            <div class="boot-complete-divider"></div>
            <div class="boot-complete-text">VERSION ${this.game.bootstrapTracker.getCurrentAttempt()} ONLINE</div>
            <div class="boot-complete-subtitle">Connection established.</div>
        `;
        this.container.appendChild(finalStatusDiv);

        this.container.style.opacity = '1';

        // Only wait 3 seconds if not skipping
        if (!this.isSkipping) {
            await this.delay(3000);
        }
    }

    private getDynamicStats() {
        // Since we are in V2, we can just ask BootstrapTracker directly if we want
        // But for parity validation, let's look at attempts
        const history = this.game.bootstrapTracker.getHistory();
        const failed = history.attempts.filter(a => a.result === 'failed').length + 847; // + lore attempts

        return {
            memory: '848 MB',
            timelines: `${failed} failed, 1 active`,
            paradox: 'STABLE',
            paradoxColor: '#00ff88'
        };
    }

    private async showBootComplete() {
        await this.delay(300);
    }

    private showCategoryInstant(categoryName: string, files: FileEntry[]) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'boot-category';
        categoryDiv.textContent = `→ ${categoryName}`;
        this.container.appendChild(categoryDiv);

        files.forEach(file => {
            if (file.conditional || file.flash) return;
            const fileDiv = document.createElement('div');
            fileDiv.className = 'boot-file';
            fileDiv.style.color = file.color;
            fileDiv.innerHTML = `
                <span class="boot-file-arrow">  ├─</span>
                <span class="boot-file-name">${file.name}</span>
                <span class="boot-file-size">${file.size}</span>
                <span class="boot-file-status">OK</span>
            `;
            this.container.appendChild(fileDiv);
        });
    }

    public skip() {
        this.isSkipping = true;
        this.updateProgress(100);
    }

    private delay(ms: number) {
        // Skip delays instantly when skipping
        if (this.isSkipping) {
            return Promise.resolve();
        }
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
