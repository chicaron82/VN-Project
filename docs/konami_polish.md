Polish Suggestions from Zee and ZeeRah:

1. Touch Event Handling
Currently using onclick which works, but for mobile might want:
javascriptbtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevents ghost clicks
    handleButtonPress(btn.dataset.input);
}, { passive: false });
Not critical - onclick works fine on modern mobile browsers.
2. Keyboard Fallback in Controller
The overlay doesn't accept keyboard input while open - users on desktop who triggered via secret code input can't use arrow keys in the overlay. Not a bug, just a UX consideration. The keyboard listener at line 882-950 is for the MAIN MENU only.
3. Close on ESC
The overlay doesn't have an ESC listener. Compare to the iframe overlay (line 416-422) which does. Minor but nice to have.

konami-controller-polished.js
// ========================================
    // KONAMI CODE: INTERACTIVE CONTROLLER
    // Mobile-friendly NES controller overlay
    // POLISHED: ESC key, keyboard arrows, proper touch events
    // ========================================
    showKonamiControllerOverlay() {
        console.log('🎮 Konami Controller: Opening interactive overlay');

        // Create themed overlay
        const overlay = OverlayManager.createBase({
            id: 'konami-controller-overlay',
            zIndex: 10001
        });
        overlay.style.padding = '20px';
        overlay.style.overflowY = 'auto';

        const theme = ThemeManager.getTheme();
        const content = document.createElement('div');
        content.style.cssText = `
            max-width: 600px;
            width: 100%;
            background: linear-gradient(135deg, rgba(${theme.primaryRgb}, 0.15) 0%, ${theme.backgroundSolid} 100%);
            border: 3px solid ${theme.primary};
            border-radius: 10px;
            padding: 30px;
            color: ${theme.text};
            font-family: 'Courier New', monospace;
            box-shadow: 0 0 50px ${theme.glow};
            text-align: center;
        `;

        // Sequence tracking
        const sequence = [];
        const targetSequence = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

        // Header
        content.innerHTML = `
            <div style="font-size: 1.5em; font-weight: bold; color: ${theme.primary}; margin-bottom: 10px; text-shadow: 0 0 15px ${theme.glow};">
                🎮 KONAMI CODE
            </div>
            <div style="font-size: 0.9em; color: ${theme.textMuted}; margin-bottom: 20px;">
                "Some knowledge transcends timelines."
            </div>

            <!-- Progress indicator -->
            <div id="konami-progress" style="
                display: flex;
                justify-content: center;
                gap: 6px;
                margin-bottom: 25px;
            ">
                ${targetSequence.map((_, i) => `<div class="progress-dot" style="
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: rgba(${theme.primaryRgb}, 0.2);
                    transition: all 0.3s ease;
                "></div>`).join('')}
            </div>

            <!-- Controller instructions -->
            <div style="font-size: 0.85em; color: ${theme.textMuted}; margin-bottom: 15px;">
                Enter the code: ↑ ↑ ↓ ↓ ← → ← → B A
            </div>
            <div style="font-size: 0.75em; color: ${theme.textMuted}; margin-bottom: 20px; opacity: 0.7;">
                (Tap buttons or use arrow keys + B/A)
            </div>
        `;

        // Controller container
        const controllerContainer = document.createElement('div');
        controllerContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30px;
            margin: 20px 0;
        `;

        // D-pad
        const dpad = document.createElement('div');
        dpad.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 60px);
            grid-template-rows: repeat(3, 60px);
            gap: 5px;
        `;

        const dpadButtons = [
            { pos: '0/1/1/2', dir: 'up', symbol: '↑' },
            { pos: '1/0/2/1', dir: 'left', symbol: '←' },
            { pos: '1/2/2/3', dir: 'right', symbol: '→' },
            { pos: '2/1/3/2', dir: 'down', symbol: '↓' }
        ];

        dpadButtons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'konami-btn konami-dpad';
            button.dataset.input = btn.dir;
            button.textContent = btn.symbol;
            button.style.cssText = `
                grid-area: ${btn.pos};
                background: linear-gradient(135deg, rgba(${theme.primaryRgb}, 0.3), rgba(${theme.primaryRgb}, 0.1));
                border: 2px solid ${theme.primary};
                color: ${theme.primary};
                font-size: 1.5em;
                cursor: pointer;
                border-radius: 8px;
                transition: all 0.2s ease;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
            `;
            dpad.appendChild(button);
        });

        // Action buttons
        const actionButtons = document.createElement('div');
        actionButtons.style.cssText = `
            display: flex;
            gap: 25px;
        `;

        ['B', 'A'].forEach(letter => {
            const button = document.createElement('button');
            button.className = 'konami-btn konami-action';
            button.dataset.input = letter.toLowerCase();
            button.textContent = letter;
            button.style.cssText = `
                width: 70px;
                height: 70px;
                background: linear-gradient(135deg, rgba(${theme.errorRgb}, 0.3), rgba(${theme.errorRgb}, 0.1));
                border: 3px solid ${theme.error};
                color: ${theme.error};
                font-size: 1.8em;
                font-weight: bold;
                cursor: pointer;
                border-radius: 50%;
                transition: all 0.2s ease;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
            `;
            actionButtons.appendChild(button);
        });

        controllerContainer.appendChild(dpad);
        controllerContainer.appendChild(actionButtons);
        content.appendChild(controllerContainer);

        // Footer with ESC hint
        const footer = document.createElement('div');
        footer.style.cssText = `
            margin-top: 25px;
            padding-top: 15px;
            border-top: 1px solid rgba(${theme.primaryRgb}, 0.2);
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
        `;

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'CLOSE';
        closeBtn.style.cssText = `
            padding: 12px 30px;
            background: rgba(${theme.primaryRgb}, 0.1);
            border: 2px solid ${theme.primary};
            color: ${theme.primary};
            font-family: 'Courier New', monospace;
            font-size: 1em;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
        `;

        // ESC hint
        const escHint = document.createElement('span');
        escHint.textContent = '(or press ESC)';
        escHint.style.cssText = `
            font-size: 0.8em;
            color: ${theme.textMuted};
            opacity: 0.6;
        `;

        footer.appendChild(closeBtn);
        footer.appendChild(escHint);
        content.appendChild(footer);

        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // Cleanup function for event listeners
        const cleanup = () => {
            document.removeEventListener('keydown', handleKeyboard);
            overlay.remove();
        };

        closeBtn.onclick = cleanup;

        // Button press handler
        const handleButtonPress = (input, buttonElement = null) => {
            sequence.push(input);

            // Update progress dots
            const dots = content.querySelectorAll('.progress-dot');
            dots.forEach((dot, i) => {
                if (i < sequence.length) {
                    dot.style.background = sequence[i] === targetSequence[i] ? theme.success : theme.error;
                    dot.style.boxShadow = `0 0 10px ${sequence[i] === targetSequence[i] ? theme.success : theme.error}`;
                }
            });

            // Visual feedback for button (find it if not provided)
            const btn = buttonElement || content.querySelector(`.konami-btn[data-input="${input}"]`);
            if (btn) {
                const isCorrect = sequence.length <= targetSequence.length &&
                    targetSequence[sequence.length - 1] === input;
                btn.style.boxShadow = `0 0 20px ${isCorrect ? theme.success : theme.error}`;
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.boxShadow = 'none';
                    btn.style.transform = 'scale(1)';
                }, 200);
            }

            // Haptic feedback
            if (navigator.vibrate) navigator.vibrate(30);

            // Check for completion
            if (sequence.length === targetSequence.length) {
                const isCorrect = sequence.every((val, i) => val === targetSequence[i]);

                setTimeout(() => {
                    cleanup();

                    if (isCorrect) {
                        // Correct sequence - trigger Konami effects
                        console.log('🎮 Konami Code: SUCCESS!');
                        this.game.showKonamiInsaneEscape();
                    } else {
                        // Wrong sequence - show error
                        console.log('🎮 Konami Code: FAILED');
                        if (this.game.achievementManager) {
                            this.game.achievementManager.showNotification({
                                id: 'konami_wrong',
                                icon: '❌',
                                title: 'INCORRECT SEQUENCE',
                                description: 'The code was entered incorrectly. Try again.',
                                rare: false
                            });
                        }
                    }
                }, 500);
            }

            // Auto-reset if sequence gets too long or wrong
            if (sequence.length > targetSequence.length ||
                (sequence.length > 0 && sequence[sequence.length - 1] !== targetSequence[sequence.length - 1])) {
                // Shake animation for wrong input
                content.style.animation = 'shake 0.4s ease';
                
                // Error haptic
                if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
                
                setTimeout(() => {
                    content.style.animation = '';
                    sequence.length = 0; // Reset
                    dots.forEach(dot => {
                        dot.style.background = `rgba(${theme.primaryRgb}, 0.2)`;
                        dot.style.boxShadow = 'none';
                    });
                }, 400);
            }
        };

        // Keyboard handler (ESC to close, arrows/B/A to input)
        const handleKeyboard = (e) => {
            // ESC to close
            if (e.key === 'Escape') {
                cleanup();
                return;
            }

            // Map arrow keys and B/A to inputs
            const keyMap = {
                'ArrowUp': 'up',
                'ArrowDown': 'down',
                'ArrowLeft': 'left',
                'ArrowRight': 'right',
                'b': 'b',
                'B': 'b',
                'a': 'a',
                'A': 'a'
            };

            const input = keyMap[e.key];
            if (input) {
                e.preventDefault(); // Prevent page scroll on arrows
                handleButtonPress(input);
            }
        };

        document.addEventListener('keydown', handleKeyboard);

        // Add touch and click listeners to all buttons
        content.querySelectorAll('.konami-btn').forEach(btn => {
            // Touch events (mobile) - use touchstart for responsiveness
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Prevent ghost clicks and scroll
                handleButtonPress(btn.dataset.input, btn);
            }, { passive: false });

            // Click events (desktop fallback)
            btn.addEventListener('click', (e) => {
                // Only handle if not already handled by touch
                if (e.pointerType !== 'touch') {
                    handleButtonPress(btn.dataset.input, btn);
                }
            });

            // Hover effects (desktop only)
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.boxShadow = `0 0 15px ${theme.primary}80`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
                btn.style.boxShadow = 'none';
            });
        });

        // Close button hover
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = `rgba(${theme.primaryRgb}, 0.3)`;
            closeBtn.style.boxShadow = `0 0 15px ${theme.glow}`;
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = `rgba(${theme.primaryRgb}, 0.1)`;
            closeBtn.style.boxShadow = 'none';
        });

        // Add shake animation if not already present
        if (!document.getElementById('konami-shake-style')) {
            const style = document.createElement('style');
            style.id = 'konami-shake-style';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
