// @ts-check
// ========================================
// BOUGIE BOOT SEQUENCE
// Terminal-style system file loading with all the polish
// ========================================

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

/**
 * BougieBootSequence - Terminal-style loading with all the bells and whistles
 * Synced with logo reveal progress
 */
class BougieBootSequence {
    constructor(containerElement, logoRevealCallback) {
        this.container = containerElement;
        this.logoRevealCallback = logoRevealCallback || (() => {});
        this.currentLine = null;
        this.isSkipping = false;
        this.skipHandler = null;
        this.currentProgress = 0;
    }

    /**
     * Start the boot sequence
     * Syncs progress with logo reveal: 0% → 100%
     */
    async start() {
        this.setupSkipListener();
        this.showHeader();

        // Each category advances logo reveal proportionally
        await this.loadCategory('CORE SYSTEMS', SYSTEM_FILES.core, 40, 0, 25);
        await this.loadCategory('TETHER FRAMEWORK', SYSTEM_FILES.tether, 50, 25, 50);
        await this.loadCategory('ROUTE HANDLERS', SYSTEM_FILES.routes, 35, 50, 75);
        await this.loadCategory('UI CONTROLLERS', SYSTEM_FILES.ui, 30, 75, 90);
        await this.loadCategory('SPECIAL SYSTEMS', SYSTEM_FILES.special, 45, 90, 98);

        // Easter eggs (final 2%)
        await this.showEasterEggs(98, 100);

        // Final stats (logo fully revealed, video playing)
        await this.showBootStats();

        // Complete
        await this.showBootComplete();

        this.cleanup();
    }

    /**
     * Update logo reveal progress
     */
    updateProgress(percent) {
        this.currentProgress = percent;
        this.logoRevealCallback(percent);
    }

    /**
     * Display header
     */
    showHeader() {
        const header = document.createElement('div');
        header.className = 'boot-header';
        header.innerHTML = `
            <div class="boot-title">VERSION 848 INITIALIZATION</div>
            <div class="boot-subtitle">Loading temporal framework...</div>
        `;
        this.container.appendChild(header);
    }

    /**
     * Load a category of files
     * progressStart/progressEnd: Logo reveal percentage range for this category
     */
    async loadCategory(categoryName, files, baseSpeed = 40, progressStart = 0, progressEnd = 100) {
        if (this.isSkipping) {
            this.showCategoryInstant(categoryName, files);
            this.updateProgress(progressEnd);
            return;
        }

        // Category header
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'boot-category';
        categoryDiv.textContent = `→ ${categoryName}`;
        this.container.appendChild(categoryDiv);

        await this.delay(200);

        // Calculate progress increment per file
        const validFiles = files.filter(file => {
            if (!file.conditional) return true;
            if (file.conditional === 'torigatchi') return localStorage.getItem('torigatchiUnlocked');
            if (file.conditional === 'insane') return this.game?.gameState?.flags?.insaneModeLocked;
            return false;
        });

        const progressPerFile = (progressEnd - progressStart) / validFiles.length;

        // Load each file
        for (let i = 0; i < validFiles.length; i++) {
            const file = validFiles[i];
            await this.loadFile(file, baseSpeed);

            // Update progress after each file
            const newProgress = progressStart + (progressPerFile * (i + 1));
            this.updateProgress(newProgress);

            // Handle special behaviors
            if (file.pause && !this.isSkipping) {
                await this.delay(300); // Dramatic pause
            }
        }

        await this.delay(150);
    }

    /**
     * Load a single file with progress bar
     */
    async loadFile(file, baseSpeed) {
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

        this.container.appendChild(fileDiv);
        this.currentLine = fileDiv;

        const progressBar = fileDiv.querySelector('.boot-progress-bar');
        const statusSpan = fileDiv.querySelector('.boot-file-status');

        // Handle error easter egg
        if (file.error && !this.isSkipping) {
            await this.animateProgress(progressBar, 0, 60, baseSpeed * 0.8);
            statusSpan.textContent = 'ERROR';
            statusSpan.style.color = '#ff0066';
            await this.delay(300);

            // Retry
            const retryDiv = document.createElement('div');
            retryDiv.className = 'boot-file boot-retry';
            retryDiv.textContent = '  │  Retrying connection...';
            retryDiv.style.color = '#ffaa00';
            this.container.appendChild(retryDiv);
            await this.delay(400);

            progressBar.style.width = '0%';
            statusSpan.textContent = '';
        }

        // Flash effect for special files
        if (file.flash && !this.isSkipping) {
            fileDiv.style.animation = 'bootFlash 0.1s 3';
        }

        // Glitch effect
        if (file.glitch && !this.isSkipping) {
            fileDiv.style.animation = 'bootGlitch 0.3s';
            await this.delay(100);
        }

        // Animate progress bar
        await this.animateProgress(progressBar, 0, 100, baseSpeed);

        statusSpan.textContent = 'OK';
        statusSpan.style.color = '#00ff88';

        // Haptic feedback
        if (this.game?.hapticController) {
            this.game.hapticController.trigger('soft');
        }

        // Flash file briefly if it's a flash easter egg
        if (file.flash && !this.isSkipping) {
            await this.delay(100);
            fileDiv.style.opacity = '0';
            await this.delay(100);
            fileDiv.remove();
        }
    }

    /**
     * Animate progress bar
     */
    async animateProgress(element, from, to, speed) {
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
            element.style.width = `${from + (increment * i)}%`;
            await this.delay(delay);
        }
    }

    /**
     * Show easter eggs
     */
    async showEasterEggs(progressStart = 98, progressEnd = 100) {
        const validEggs = SYSTEM_FILES.easterEggs.filter(file => {
            if (!file.conditional) return true;
            if (file.conditional === 'torigatchi') return localStorage.getItem('torigatchiUnlocked');
            if (file.conditional === 'insane') return this.game?.gameState?.flags?.insaneModeLocked;
            return false;
        });

        if (validEggs.length === 0) {
            this.updateProgress(progressEnd);
            return;
        }

        const progressPerEgg = (progressEnd - progressStart) / validEggs.length;

        for (let i = 0; i < validEggs.length; i++) {
            await this.loadFile(validEggs[i], 30);
            const newProgress = progressStart + (progressPerEgg * (i + 1));
            this.updateProgress(newProgress);
        }
    }

    /**
     * Show boot statistics
     */
    async showBootStats() {
        if (this.isSkipping) {
            this.showStatsInstant();
            return;
        }

        await this.delay(300);

        const statsDiv = document.createElement('div');
        statsDiv.className = 'boot-stats';
        statsDiv.innerHTML = `
            <div class="boot-stat">Memory allocated: <span class="stat-value">848 MB</span></div>
            <div class="boot-stat">Timelines loaded: <span class="stat-value">847 failed, 1 active</span></div>
            <div class="boot-stat">Bootstrap paradox: <span class="stat-value stat-success">STABLE</span></div>
        `;
        this.container.appendChild(statsDiv);

        // Haptic feedback for completion
        if (this.game?.hapticController) {
            this.game.hapticController.trigger('heavy');
        }

        await this.delay(500);
    }

    /**
     * Show boot complete message
     */
    async showBootComplete() {
        const completeDiv = document.createElement('div');
        completeDiv.className = 'boot-complete';
        completeDiv.innerHTML = `
            <div class="boot-complete-text">VERSION 848 ONLINE</div>
            <div class="boot-complete-subtitle">Connection established.</div>
        `;
        this.container.appendChild(completeDiv);

        await this.delay(800);
    }

    /**
     * Show category instantly (skip mode)
     */
    showCategoryInstant(categoryName, files) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'boot-category';
        categoryDiv.textContent = `→ ${categoryName}`;
        this.container.appendChild(categoryDiv);

        files.forEach(file => {
            // Skip conditional and flash files
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

    /**
     * Show stats instantly (skip mode)
     */
    showStatsInstant() {
        const statsDiv = document.createElement('div');
        statsDiv.className = 'boot-stats';
        statsDiv.innerHTML = `
            <div class="boot-stat">Memory allocated: <span class="stat-value">848 MB</span></div>
            <div class="boot-stat">Timelines loaded: <span class="stat-value">847 failed, 1 active</span></div>
            <div class="boot-stat">Bootstrap paradox: <span class="stat-value stat-success">STABLE</span></div>
        `;
        this.container.appendChild(statsDiv);
    }

    /**
     * Setup skip listener (handled by splash screen skip button)
     */
    setupSkipListener() {
        // Skip is handled externally by splash screen
        // Expose skip method for external trigger
        this.skipHandler = null;
    }

    /**
     * Skip to end (called externally)
     */
    skip() {
        this.isSkipping = true;
        this.updateProgress(100);
    }

    /**
     * Cleanup listeners
     */
    cleanup() {
        // No cleanup needed - skip handled externally
    }

    /**
     * Delay helper
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for use in main
window.BougieBootSequence = BougieBootSequence;
