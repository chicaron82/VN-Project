// ========================================
// EFFECTS CONTROLLER
// Matrix rain transitions and loop init effects
// Extracted from GameEngine - Session 74
// ========================================

/**
 * EffectsController
 * 
 * Handles all visual transition effects:
 * - Loop init screen (version increment display)
 * - Matrix code rain animation
 * - Code rain scene transitions
 * 
 * @class EffectsController
 */
class EffectsController {
    constructor(game) {
        this.game = game;
        this.matrixInterval = null;
        this.transitionRainInterval = null;
        this.loopInitCallback = null;
    }

    // ========================================
    // LOOP INIT SCREEN
    // Version increment display with Matrix rain
    // ========================================

    showLoopInit(callback) {
        const loopInitScreen = document.getElementById('loop-init-screen');
        const prevVersionEl = document.getElementById('loop-prev-version');
        const newVersionEl = document.getElementById('loop-new-version');
        const skipButton = document.getElementById('loop-skip-button');

        if (!loopInitScreen) {
            console.error('Loop init screen not found');
            if (callback) callback();
            return;
        }

        // Use current version as "previous failed"
        // And loopVersion is already incremented, so it's the "new" version
        const prevVersion = this.game.loopVersion - 1; // The one that just failed
        const newVersion = this.game.loopVersion; // The new attempt

        // Update text
        if (prevVersionEl) prevVersionEl.textContent = prevVersion;
        if (newVersionEl) newVersionEl.textContent = newVersion;

        // Check if player has seen this before
        const loopInitSeen = localStorage.getItem('loopInitSeen') === 'true';

        // Show skip button only if seen before
        if (skipButton) {
            skipButton.style.display = loopInitSeen ? 'inline-block' : 'none';
        }

        // Mark as seen for future runs
        localStorage.setItem('loopInitSeen', 'true');

        // Show screen
        loopInitScreen.style.display = 'flex';

        // DIZEE GLOW-UP: Start Matrix code rain
        this.startMatrixRain();

        // DIZEE GLOW-UP: Haptic feedback - triple buzz for failure
        if (this.game.triggerSensoryFeedback) {
            setTimeout(() => {
                this.game.triggerSensoryFeedback('denied', null, 'Loop failed');
            }, 200);
            // Single buzz for new initialization
            setTimeout(() => {
                this.game.triggerSensoryFeedback('buttonPress', null, 'New loop initializing');
            }, 1500);
        }

        // Store callback for when player advances
        this.loopInitCallback = callback;

        // DIZEE FIX: Add skip button handler
        if (skipButton) {
            skipButton.onclick = () => {
                console.log('⏩ Skip button clicked - closing loop init');
                this.closeLoopInit();
            };
        }

        // Click anywhere to continue
        const continueHandler = (e) => {
            // Don't close if clicking the skip button (it has its own handler)
            if (e.target && e.target.id === 'loop-skip-button') {
                return;
            }
            this.closeLoopInit();
            loopInitScreen.removeEventListener('click', continueHandler);
            const loopInitContent = document.getElementById('loop-init-content');
            if (loopInitContent) {
                loopInitContent.removeEventListener('click', continueHandler);
            }
        };

        loopInitScreen.addEventListener('click', continueHandler);

        // Also add to content div (in case pointer-events is blocking)
        const loopInitContent = document.getElementById('loop-init-content');
        if (loopInitContent) {
            loopInitContent.addEventListener('click', continueHandler);
        }

        // Keyboard support (Space/Enter)
        const keyHandler = (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                this.closeLoopInit();
                document.removeEventListener('keydown', keyHandler);
            }
        };

        document.addEventListener('keydown', keyHandler);

        console.log(`Loop init screen shown: v${prevVersion} → v${newVersion}`);
    }

    // DIZEE GLOW-UP: Matrix code rain effect
    startMatrixRain() {
        const canvas = document.getElementById('loop-init-matrix');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ZEEZEERAHDIZEECOZEEBELLEPEASYGENZEETORICHICHARONUV7848'; // DIZEE: UV7 Crew names in the code rain 💚
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        // DIZEE: Faster drop speed on portrait to fill screen in time 💚
        const isPortrait = canvas.height > canvas.width;
        const dropSpeed = isPortrait ? 3 : 2; // 3x speed on portrait, 2x on landscape

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // THEME INTEGRATION: Use active theme color for code rain 💚
            const theme = ThemeManager.getTheme();
            ctx.fillStyle = theme.primary;
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i] += dropSpeed; // Use variable speed
            }
        };

        this.matrixInterval = setInterval(draw, 33);
    }

    skipLoopInit() {
        // Immediate skip - no animation
        this.closeLoopInit();
    }

    closeLoopInit() {
        const loopInitScreen = document.getElementById('loop-init-screen');
        if (loopInitScreen) {
            loopInitScreen.style.display = 'none';
        }

        // DIZEE GLOW-UP: Stop Matrix code rain
        if (this.matrixInterval) {
            clearInterval(this.matrixInterval);
            this.matrixInterval = null;
        }

        // Execute callback if exists
        if (this.loopInitCallback) {
            this.loopInitCallback();
            this.loopInitCallback = null;
        }
    }

    // ========================================
    // DIZEE: CODE RAIN TRANSITIONS
    // Cyan Matrix rain for scene transitions
    // ========================================

    showCodeRainTransition(callback, duration = 1500) {
        // Create or get overlay canvas
        let canvas = document.getElementById('transition-matrix');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'transition-matrix';
            canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 100000;
                opacity: 0;
                transition: opacity 300ms ease;
                pointer-events: none;
            `;
            document.body.appendChild(canvas);
        }

        // DIZEE: Ensure canvas fills screen (fixes portrait mode issue) 💚
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Start rain
        this.startTransitionRain(canvas);

        // DIZEE: Start at full opacity (instant cover) 💚
        canvas.style.opacity = '1';

        // DIZEE: Execute callback immediately (loads next screen underneath rain) 💚
        // Rain is already covering screen, so transition is seamless
        setTimeout(() => {
            if (callback) callback();
        }, 100); // Small delay to ensure rain is rendering

        // Fade out after holding (next screen is already loaded underneath)
        setTimeout(() => {
            canvas.style.opacity = '0';

            setTimeout(() => {
                this.stopTransitionRain();
            }, 300); // Wait for fade out
        }, duration - 300);
    }

    startTransitionRain(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ZEEZEERAHDIZEECOZEEBELLEPEASYGENZEETORICHICHARONUV7848'; // DIZEE: UV7 Crew names in the code rain 💚
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        // DIZEE: Faster drop speed on portrait to fill screen in time 💚
        const isPortrait = canvas.height > canvas.width;
        const dropSpeed = isPortrait ? 3 : 2; // 3x speed on portrait, 2x on landscape

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // THEME INTEGRATION: Use active theme color for code rain 💚
            const theme = ThemeManager.getTheme();
            ctx.fillStyle = theme.primary;
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i] += dropSpeed; // Use variable speed
            }
        };

        this.transitionRainInterval = setInterval(draw, 33);
    }

    stopTransitionRain() {
        if (this.transitionRainInterval) {
            clearInterval(this.transitionRainInterval);
            this.transitionRainInterval = null;
        }

        // Clean up canvas after a delay
        setTimeout(() => {
            const canvas = document.getElementById('transition-matrix');
            if (canvas && canvas.style.opacity === '0') {
                canvas.remove();
            }
        }, 500);
    }
}
