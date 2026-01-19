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
    /**
     * @param {HTMLElement} containerElement - Boot terminal container
     * @param {(percent: number) => void} [logoRevealCallback] - Callback to update logo reveal progress
     */
    constructor(containerElement, logoRevealCallback) {
        /** @type {HTMLElement} */
        this.container = containerElement;
        /** @type {(percent: number) => void} */
        this.logoRevealCallback = logoRevealCallback || (() => {});
        /** @type {HTMLElement | null} */
        this.currentLine = null;
        /** @type {boolean} */
        this.isSkipping = false;
        /** @type {(() => void) | null} */
        this.skipHandler = null;
        /** @type {number} */
        this.currentProgress = 0;
        /** @type {HTMLElement[]} */
        this.visibleLines = []; // Track visible lines (max 3)
        /** @type {number} */
        this.MAX_VISIBLE_LINES = 3;
        /** @type {HTMLElement | undefined} */
        this.linesContainer = undefined;
        /** @type {any} */
        this.game = undefined;
    }

    /**
     * Start the boot sequence
     * Syncs progress with logo reveal: 0% → 100%
     */
    async start() {
        this.setupSkipListener();
        this.showHeader();

        // Each category advances logo reveal proportionally
        // Haptic intensity varies by category importance
        await this.loadCategory('CORE SYSTEMS', SYSTEM_FILES.core, 40, 0, 25, 'soft');
        await this.loadCategory('TETHER FRAMEWORK', SYSTEM_FILES.tether, 50, 25, 50, 'medium');
        await this.loadCategory('ROUTE HANDLERS', SYSTEM_FILES.routes, 35, 50, 75, 'soft');
        await this.loadCategory('UI CONTROLLERS', SYSTEM_FILES.ui, 30, 75, 90, 'soft');
        await this.loadCategory('SPECIAL SYSTEMS', SYSTEM_FILES.special, 45, 90, 98, 'heavy');

        // Easter eggs (final 2%)
        await this.showEasterEggs(98, 100);

        // Final stats (logo fully revealed, video playing)
        await this.showBootStats();

        // Complete
        await this.showBootComplete();

        // DIZEE: Let it sit for a moment before transitioning to main menu
        // Allow the "VERSION XXX ONLINE" message to register
        await this.delay(2000);

        this.cleanup();
    }

    /**
     * Update logo reveal progress
     * @param {number} percent - Progress percentage (0-100)
     */
    updateProgress(percent) {
        this.currentProgress = percent;
        this.logoRevealCallback(percent);
    }

    /**
     * Display header with dynamic version number
     */
    showHeader() {
        const versionNumber = this.getVersionNumber();
        const header = document.createElement('div');
        header.className = 'boot-header';
        header.innerHTML = `
            <div class="boot-title boot-title-glitch">VERSION ${versionNumber} INITIALIZATION</div>
            <div class="boot-subtitle">Loading temporal framework...</div>
        `;
        this.container.appendChild(header);

        // Create dedicated lines container with fixed height for 3 lines
        this.linesContainer = document.createElement('div');
        this.linesContainer.className = 'boot-lines-container';
        this.container.appendChild(this.linesContainer);
    }

    /**
     * Load a category of files
     * @param {string} categoryName - Name of the category to display
     * @param {Array<{name: string, size: string, color: string, glitch?: boolean, pause?: boolean, flash?: boolean, error?: boolean, conditional?: string}>} files - Files to load
     * @param {number} [baseSpeed=40] - Base animation speed in ms
     * @param {number} [progressStart=0] - Starting progress percentage
     * @param {number} [progressEnd=100] - Ending progress percentage
     * @param {string} [hapticIntensity='soft'] - Haptic intensity for this category
     */
    async loadCategory(categoryName, files, baseSpeed = 40, progressStart = 0, progressEnd = 100, hapticIntensity = 'soft') {
        if (this.isSkipping) {
            this.showCategoryInstant(categoryName, files);
            this.updateProgress(progressEnd);
            return;
        }

        // Category header
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'boot-category';
        categoryDiv.textContent = `→ ${categoryName}`;
        if (this.linesContainer) {
            this.linesContainer.appendChild(categoryDiv);
        }

        // Track category header in visible lines
        this.visibleLines.push(categoryDiv);

        // If more than 3 lines, fade out and remove oldest
        if (this.visibleLines.length > this.MAX_VISIBLE_LINES) {
            const oldestLine = this.visibleLines.shift();
            if (oldestLine) {
                oldestLine.classList.add('fading-out');
                setTimeout(() => {
                    if (oldestLine.parentNode) {
                        oldestLine.remove();
                    }
                }, 300);
            }
        }

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
            await this.loadFile(file, baseSpeed, hapticIntensity);

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
     * @param {{name: string, size: string, color: string, glitch?: boolean, pause?: boolean, flash?: boolean, error?: boolean, conditional?: string}} file - File to load
     * @param {number} baseSpeed - Animation speed in ms
     * @param {string} [hapticIntensity='soft'] - Haptic intensity for this file
     */
    async loadFile(file, baseSpeed, hapticIntensity = 'soft') {
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

        if (this.linesContainer) {
            this.linesContainer.appendChild(fileDiv);
        }
        this.currentLine = fileDiv;

        // Track visible lines (max 3)
        this.visibleLines.push(fileDiv);

        // If more than 3 lines, fade out and remove oldest
        if (this.visibleLines.length > this.MAX_VISIBLE_LINES) {
            const oldestLine = this.visibleLines.shift();
            if (oldestLine) {
                oldestLine.classList.add('fading-out');
                setTimeout(() => {
                    if (oldestLine.parentNode) {
                        oldestLine.remove();
                    }
                }, 300); // Match CSS transition time
            }
        }

        const progressBar = /** @type {HTMLElement} */ (fileDiv.querySelector('.boot-progress-bar'));
        const statusSpan = /** @type {HTMLElement} */ (fileDiv.querySelector('.boot-file-status'));

        // Handle error easter egg
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
            if (this.linesContainer) {
                this.linesContainer.appendChild(retryDiv);
            }

            // Track retry message in visible lines
            this.visibleLines.push(retryDiv);

            // If more than 3 lines, fade out and remove oldest
            if (this.visibleLines.length > this.MAX_VISIBLE_LINES) {
                const oldestLine = this.visibleLines.shift();
                if (oldestLine) {
                    oldestLine.classList.add('fading-out');
                    setTimeout(() => {
                        if (oldestLine.parentNode) {
                            oldestLine.remove();
                        }
                    }, 300);
                }
            }

            await this.delay(400);

            if (progressBar) progressBar.style.width = '0%';
            if (statusSpan) statusSpan.textContent = '';
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

        if (statusSpan) {
            statusSpan.textContent = 'OK';
            statusSpan.style.color = '#00ff88';
        }

        // Haptic feedback - intensity varies by category
        if (this.game?.hapticController) {
            this.game.hapticController.trigger(hapticIntensity);
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
     * @param {HTMLElement} element - Progress bar element
     * @param {number} from - Starting percentage
     * @param {number} to - Ending percentage
     * @param {number} speed - Animation duration in ms
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
     * Show easter eggs with pattern haptic [30ms, 20ms, 30ms]
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

        // Easter eggs get special pattern haptic feedback
        for (let i = 0; i < validEggs.length; i++) {
            await this.loadFile(validEggs[i], 30, 'soft');
            const newProgress = progressStart + (progressPerEgg * (i + 1));
            this.updateProgress(newProgress);

            // Pattern haptic: [30ms, 20ms, 30ms]
            if (this.game?.hapticController && !this.isSkipping) {
                this.game.hapticController.pattern([30, 20, 30]);
            }
        }
    }

    /**
     * Show boot statistics - replaces terminal with final status display
     * NOW DYNAMIC: Reflects actual player progress through loops
     */
    async showBootStats() {
        await this.delay(300);

        // Fade out and replace entire terminal content
        this.container.style.opacity = '0';
        this.container.style.transition = 'opacity 0.3s ease-out';

        await this.delay(300);

        // Clear terminal and show final status
        this.container.innerHTML = '';
        this.container.className = 'boot-terminal boot-final-status';

        // Get dynamic stats from bootstrap tracker (or fallback to defaults)
        const stats = this.getDynamicStats();

        const finalStatusDiv = document.createElement('div');
        finalStatusDiv.className = 'boot-final-display';
        finalStatusDiv.innerHTML = `
            <div class="boot-stat">Memory: <span class="stat-value">${stats.memory}</span></div>
            <div class="boot-stat">Timelines: <span class="stat-value">${stats.timelines}</span></div>
            <div class="boot-stat">Paradox: <span class="stat-value" style="color: ${stats.paradoxColor}">${stats.paradox}</span></div>
            <div class="boot-complete-divider"></div>
            <div class="boot-complete-text">VERSION ${this.getVersionNumber()} ONLINE</div>
            <div class="boot-complete-subtitle">Connection established.</div>
        `;
        this.container.appendChild(finalStatusDiv);

        // Fade back in with new content
        this.container.style.opacity = '1';

        // Haptic feedback for completion
        if (this.game?.hapticController) {
            this.game.hapticController.trigger('heavy');
        }

        // DIZEE: Give players time to read bootstrap stats (memory, timelines, paradox)
        // Especially important for seeing paradox status evolution across playthroughs
        await this.delay(3000);
    }

    /**
     * Get dynamic boot stats from bootstrap tracker
     * Falls back to first-time defaults if tracker not available
     * @returns {{memory: string, timelines: string, paradox: string, paradoxColor: string}}
     */
    getDynamicStats() {
        // Use global helper function if available (from boot-stats-calculator.js)
        // @ts-ignore - getDynamicBootStats added by boot-stats-calculator.js
        if (typeof window.getDynamicBootStats === 'function') {
            // @ts-ignore
            return window.getDynamicBootStats(this.game);
        }

        // Fallback to first-time experience
        return {
            memory: '848 MB',
            timelines: '0 failed, 0 complete, 1 active',
            paradox: 'INITIALIZING',
            paradoxColor: '#00ffff'
        };
    }

    /**
     * Get current version number from bootstrap tracker
     * @returns {number}
     */
    getVersionNumber() {
        if (this.game && this.game.bootstrapTracker) {
            return this.game.bootstrapTracker.getCurrentAttempt();
        }
        return 848; // Default first playthrough
    }

    /**
     * Show boot complete message (now handled in showBootStats)
     */
    async showBootComplete() {
        // Content now displayed in showBootStats
        await this.delay(300);
    }

    /**
     * Show category instantly (skip mode)
     * @param {string} categoryName - Category name
     * @param {Array<{name: string, size: string, color: string, glitch?: boolean, pause?: boolean, flash?: boolean, error?: boolean, conditional?: string}>} files - Files to display
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
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise<void>}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for use in main
// @ts-ignore
window.BougieBootSequence = BougieBootSequence;
