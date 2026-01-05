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
 */
class BougieBootSequence {
    constructor(containerElement, gameEngine) {
        this.container = containerElement;
        this.game = gameEngine;
        this.currentLine = null;
        this.isSkipping = false;
        this.skipHandler = null;
    }

    /**
     * Start the boot sequence
     * Everything is already loaded - this is pure aesthetics
     */
    async start() {
        this.setupSkipListener();
        this.showHeader();

        await this.loadCategory('CORE SYSTEMS', SYSTEM_FILES.core, 40);
        await this.loadCategory('TETHER FRAMEWORK', SYSTEM_FILES.tether, 50);
        await this.loadCategory('ROUTE HANDLERS', SYSTEM_FILES.routes, 35);
        await this.loadCategory('UI CONTROLLERS', SYSTEM_FILES.ui, 30);
        await this.loadCategory('SPECIAL SYSTEMS', SYSTEM_FILES.special, 45);

        // Easter eggs
        await this.showEasterEggs();

        // Final stats
        await this.showBootStats();

        // Complete
        await this.showBootComplete();

        this.cleanup();
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
     */
    async loadCategory(categoryName, files, baseSpeed = 40) {
        if (this.isSkipping) {
            this.showCategoryInstant(categoryName, files);
            return;
        }

        // Category header
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'boot-category';
        categoryDiv.textContent = `→ ${categoryName}`;
        this.container.appendChild(categoryDiv);

        await this.delay(200);

        // Load each file
        for (const file of files) {
            // Skip conditional files if not unlocked
            if (file.conditional) {
                if (file.conditional === 'torigatchi' && !localStorage.getItem('torigatchiUnlocked')) continue;
                if (file.conditional === 'insane' && !this.game?.gameState?.flags?.insaneModeLocked) continue;
            }

            await this.loadFile(file, baseSpeed);

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
    async showEasterEggs() {
        for (const file of SYSTEM_FILES.easterEggs) {
            // Skip conditional files
            if (file.conditional) {
                if (file.conditional === 'torigatchi' && !localStorage.getItem('torigatchiUnlocked')) continue;
                if (file.conditional === 'insane' && !this.game?.gameState?.flags?.insaneModeLocked) continue;
            }

            await this.loadFile(file, 30);
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
     * Setup skip listener (SPACE key)
     */
    setupSkipListener() {
        this.skipHandler = (e) => {
            if (e.code === 'Space' && !this.isSkipping) {
                e.preventDefault();
                this.skip();
            }
        };
        document.addEventListener('keydown', this.skipHandler);

        // Show skip hint
        const skipHint = document.createElement('div');
        skipHint.className = 'boot-skip-hint';
        skipHint.textContent = 'Press SPACE to skip';
        this.container.appendChild(skipHint);
    }

    /**
     * Skip to end
     */
    skip() {
        this.isSkipping = true;
        const skipHint = this.container.querySelector('.boot-skip-hint');
        if (skipHint) {
            skipHint.textContent = 'Skipping initialization...';
            skipHint.style.color = '#ffaa00';
        }
    }

    /**
     * Cleanup listeners
     */
    cleanup() {
        if (this.skipHandler) {
            document.removeEventListener('keydown', this.skipHandler);
        }
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
