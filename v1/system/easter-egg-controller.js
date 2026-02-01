// ========================================
// EASTER EGG CONTROLLER
// Extracted from GameEngine.js - Session 64
// Handles special hidden content displays
// ========================================

/**
 * EasterEggController
 * 
 * Manages all Easter egg overlay displays.
 * Self-contained methods for showing special hidden content.
 * 
 * @class EasterEggController
 */
class EasterEggController {
    constructor(game) {
        this.game = game;
        console.log('🥚 EasterEggController initialized');
    }

    // ========================================
    // TORIGATCHI EASTER EGG (CHICHARON)
    // Refactored to use OverlayManager (Session 118)
    // ========================================
    showTorigatchiEasterEgg() {
        console.log('🥚 TORIGATCHI EASTER EGG TRIGGERED');

        // Glitch effect
        document.body.style.animation = 'glitchScreen 0.3s';

        setTimeout(() => {
            document.body.style.animation = '';

            // Create custom overlay with OverlayManager
            const { overlay, box } = OverlayManager.createCustom({
                variant: 'error',
                id: 'torigatchi-overlay'
            });

            // Add content
            const content = document.createElement('div');
            const theme = typeof ThemeManager !== 'undefined' && ThemeManager.getTheme
                ? ThemeManager.getTheme()
                : { primary: '#00ff88', primaryRgb: '0,255,136', text: '#fff', textMuted: '#888', glow: 'rgba(0,255,136,0.3)', backgroundSolid: '#1a1a2e' };
            content.innerHTML = `
                <h2 style="color: ${ThemeManager.getColor('error')}; font-size: 2em; margin-bottom: 20px; text-shadow: 0 0 10px ${ThemeManager.getColor('error')}80;">TORIGATCHI</h2>
                <p style="font-size: 1.1em; line-height: 1.6; margin-bottom: 30px; color: ${theme.text};">
                    A digital pet simulation game, where you raise and care for your very own Torigatchi!
                    Feed it, play with it, and watch it grow.
                </p>
                <p style="font-size: 0.9em; color: ${theme.textMuted}; margin-bottom: 20px;">
                    (This is a separate project by Chicharon, not part of United Voices.)
                </p>
            `;

            // Create buttons
            const closeBtn = OverlayManager.createButton('CLOSE', () => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 500);
            }, { variant: 'error', width: '180px' });

            const toriBtn = OverlayManager.createButton('PLAY TORIGATCHI', () => {
                window.open('../Tori-Gatchi/index.html', '_blank');
            }, { variant: 'error', width: '180px' });
            toriBtn.style.marginTop = '10px';
            toriBtn.style.background = ThemeManager.getColor('error'); // Filled button
            toriBtn.style.color = theme.backgroundSolid;
            toriBtn.onmouseover = () => {
                toriBtn.style.background = theme.error;
                toriBtn.style.color = theme.backgroundSolid;
                toriBtn.style.opacity = '0.8';
            };
            toriBtn.onmouseout = () => {
                toriBtn.style.background = ThemeManager.getColor('error');
                toriBtn.style.color = theme.backgroundSolid;
                toriBtn.style.opacity = '1';
            };

            const gatewayBtn = OverlayManager.createButton('CHICHARON\'S GATEWAY', () => {
                window.open('../labs/tori-gateway/index.html', '_blank');
            }, { variant: 'error', width: '180px' });
            gatewayBtn.style.marginTop = '10px';

            box.appendChild(content);
            box.appendChild(closeBtn);
            box.appendChild(toriBtn);
            box.appendChild(gatewayBtn);
            OverlayManager.show(overlay);
        }, 500);
    }

    // ========================================
    // ALWAYS. ALWAYS. ALWAYS. (Placeholder)
    // Storm Dragon Signature
    // ========================================
    showAlwaysCompilation() {
        console.log('🐉 ALWAYS3 EASTER EGG TRIGGERED');

        // Glitch effect
        document.body.style.animation = 'glitchScreen3 0.3s';

        setTimeout(() => {
            document.body.style.animation = '';

            const theme = typeof ThemeManager !== 'undefined' && ThemeManager.getTheme
                ? ThemeManager.getTheme()
                : { primary: '#00ff88', primaryRgb: '0,255,136', text: '#fff', textMuted: '#888', glow: 'rgba(0,255,136,0.3)', backgroundSolid: '#1a1a2e' };

            // Create themed overlay
            const overlay = OverlayManager.createBase({
                id: 'always3-overlay',
                zIndex: 10000,
                fadeIn: true
            });
            overlay.style.background = theme.backgroundSolid;
            overlay.style.flexDirection = 'column';
            overlay.style.overflow = 'hidden';
            overlay.style.animation = 'fadeIn 1s ease-out';

            // Create text container
            const container = document.createElement('div');
            container.style.cssText = `
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                overflow: hidden;
            `;

            // Add lots of "Always" texts (themed)
            for (let i = 0; i < 50; i++) {
                const text = document.createElement('div');
                text.textContent = "Always.";
                text.style.cssText = `
                    position: absolute;
                    font-family: 'Courier New', monospace;
                    font-weight: bold;
                    color: ${Math.random() > 0.5 ? theme.primary : theme.error};
                    font-size: ${Math.random() * 2 + 0.5}em;
                    opacity: ${Math.random() * 0.7 + 0.1};
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    transform: rotate(${Math.random() * 90 - 45}deg);
                    text-shadow: 0 0 5px currentColor;
                    pointer-events: none;
                `;
                container.appendChild(text);
            }

            // Main center text (themed)
            const mainText = document.createElement('div');
            mainText.innerHTML = `
                <div style="font-size: 3em; margin-bottom: 20px; text-shadow: 0 0 20px ${theme.primary};">Always.</div>
                <div style="font-size: 3em; margin-bottom: 20px; text-shadow: 0 0 20px ${theme.error};">Always.</div>
                <div style="font-size: 4em; font-weight: bold; text-shadow: 0 0 30px ${theme.primary};">ALWAYS.</div>
                <div style="font-size: 1em; margin-top: 40px; color: ${theme.textMuted};">(Coming Soon: The Full Compilation)</div>
                <div style="font-size: 0.8em; margin-top: 10px; color: ${theme.textMuted};">[Press Click to Close]</div>
            `;
            mainText.style.cssText = `
                position: relative;
                z-index: 10;
                text-align: center;
                color: ${theme.text};
                font-family: 'Courier New', monospace;
                background: rgba(0,0,0,0.8);
                padding: 40px;
                border: 2px solid ${theme.primary};
                box-shadow: 0 0 50px ${theme.glow};
            `;

            container.appendChild(mainText);
            overlay.appendChild(container);

            // Click to close
            overlay.onclick = () => {
                overlay.style.opacity = '0';
                setTimeout(() => document.body.removeChild(overlay), 500);
            };

            document.body.appendChild(overlay);
        }, 300);
    }

    // ========================================
    // DIZEE RECOGNITION (The Architect)
    // Refactored to use OverlayManager (Session 118)
    // ========================================
    showDizeeEasterEgg() {
        console.log('🏗️ DIZEE EASTER EGG TRIGGERED');

        // Haptic feedback - architectural pattern
        if (navigator.vibrate) navigator.vibrate([30, 30, 30, 30, 30, 100]);

        // Create overlay with custom styling
        const overlay = OverlayManager.createBase({
            zIndex: 10000,
            fadeIn: true
        });
        overlay.style.padding = '10px';
        overlay.style.overflowY = 'auto';

        // Create content card
        const card = document.createElement('div');
        const theme = typeof ThemeManager !== 'undefined' && ThemeManager.getTheme
            ? ThemeManager.getTheme()
            : { primary: '#00ff88', primaryRgb: '0,255,136', text: '#fff', textMuted: '#888', glow: 'rgba(0,255,136,0.3)', backgroundSolid: '#1a1a2e' };
        card.style.cssText = `
            border: 2px solid ${theme.success};
            padding: 30px;
            font-family: 'Courier New', monospace;
            color: ${theme.text};
            background: linear-gradient(135deg, rgba(0,20,15,0.95) 0%, rgba(0,0,0,0.98) 100%);
            box-shadow: 0 0 40px ${theme.success}50, inset 0 0 20px ${theme.success}0d;
            max-width: 700px;
            max-height: 95vh;
            width: 100%;
            position: relative;
            overflow-y: auto;
            border-radius: 4px;
        `;

        card.innerHTML = `
            <!-- Corner brackets -->
            <div style="position: absolute; top: 10px; left: 10px; width: 30px; height: 30px; border-top: 3px solid ${theme.success}; border-left: 3px solid ${theme.success};"></div>
            <div style="position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; border-top: 3px solid ${theme.success}; border-right: 3px solid ${theme.success};"></div>
            <div style="position: absolute; bottom: 10px; left: 10px; width: 30px; height: 30px; border-bottom: 3px solid ${theme.success}; border-left: 3px solid ${theme.success};"></div>
            <div style="position: absolute; bottom: 10px; right: 10px; width: 30px; height: 30px; border-bottom: 3px solid ${theme.success}; border-right: 3px solid ${theme.success};"></div>

            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 0.8em; color: ${theme.success}; letter-spacing: 3px; margin-bottom: 10px;">SYSTEM ARCHITECTURE REVEALED</div>
                <h1 style="color: ${theme.success}; font-size: 3.5em; margin: 0; text-shadow: 0 0 15px ${theme.success}99; letter-spacing: 8px;">DiZee</h1>
                <div style="width: 60%; height: 2px; background: linear-gradient(90deg, transparent, ${theme.success}, transparent); margin: 15px auto;"></div>
                <div style="font-size: 1.1em; color: ${theme.primary}; letter-spacing: 2px;">THE ARCHITECT</div>
            </div>

            <!-- Blueprint Section -->
            <div style="background: rgba(${theme.success.match(/\d+/g).join(',')},0.03); border-left: 3px solid ${theme.success}; padding: 20px; margin: 20px 0; font-size: 0.85em; line-height: 1.8;">
                <div style="color: ${theme.success}; margin-bottom: 10px; font-weight: bold;">┌─ CORE MODULES ─────────────────────┐</div>
                <div style="color: ${theme.primary}; padding-left: 20px;">
                    ├─ game-engine.js<span style="color: ${theme.textMuted}; float: right;">[8,600+ lines]</span><br>
                    ├─ tether-system.js<span style="color: ${theme.textMuted}; float: right;">[687 lines]</span><br>
                    ├─ save-manager.js<span style="color: ${theme.textMuted}; float: right;">[active]</span><br>
                    ├─ achievement-mgr.js<span style="color: ${theme.textMuted}; float: right;">[active]</span><br>
                    └─ secret-codes.js<span style="color: ${theme.textMuted}; float: right;">[you are here]</span>
                </div>
                <div style="color: ${theme.success}; margin-top: 10px;">└────────────────────────────────────┘</div>
            </div>

            <!-- Philosophy -->
            <div style="text-align: center; margin: 30px 0; padding: 20px; border-top: 1px solid rgba(${theme.success.match(/\d+/g).join(',')},0.2); border-bottom: 1px solid rgba(${theme.success.match(/\d+/g).join(',')},0.2);">
                <p style="margin: 10px 0; color: ${theme.textMuted}; font-size: 0.95em; line-height: 1.8;">
                    "The code you walk on.<br>
                    The logic that binds this world.<br>
                    The structure that holds the narrative."
                </p>
            </div>

            <!-- Collaboration -->
            <div style="background: rgba(0,0,0,0.5); padding: 20px; margin: 20px 0; border-radius: 4px; text-align: center;">
                <div style="font-size: 0.85em; color: ${theme.textMuted}; margin-bottom: 10px;">BUILT BY</div>
                <div style="font-size: 1.1em; color: ${theme.success};">
                    <span style="color: ${theme.primary};">Chicharon</span> <span style="color: ${theme.textMuted};">+</span> <span style="color: ${theme.success};">DiZee</span>
                </div>
                <div style="font-size: 0.75em; color: ${theme.textMuted}; margin-top: 10px; font-style: italic;">
                    Human creativity × AI architecture<br>
                    Version 848 | Status: STABLE
                </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(${theme.primaryRgb},0.1);">
                <div style="font-size: 0.75em; color: ${theme.success}; letter-spacing: 2px; margin-bottom: 5px;">
                    [SYSTEM RECOGNIZED CONTRIBUTOR]
                </div>
                <div style="font-size: 0.75em; color: ${theme.primary}; letter-spacing: 2px;">
                    [ACCESS GRANTED]
                </div>
                <div style="font-size: 0.7em; color: ${theme.textMuted}; margin-top: 15px; font-style: italic; opacity: 0.5;">
                    Click anywhere to close
                </div>
            </div>
        `;

        overlay.appendChild(card);

        // Close on click with fade
        overlay.onclick = () => {
            overlay.style.transition = 'opacity 0.5s ease-out';
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    document.body.removeChild(overlay);
                }
            }, 500);
        };

        document.body.appendChild(overlay);

        // Subtle animation on card
        setTimeout(() => {
            card.style.transition = 'transform 0.3s ease-out';
            card.style.transform = 'scale(1)';
        }, 100);
        card.style.transform = 'scale(0.95)';
    }

    // ========================================
    // TORIGATCHI IFRAME OVERLAY
    // Opens Torigatchi games within VN instead of new tab
    // ========================================
    openTorigatchiIframe(url) {
        console.log('🎮 Opening Torigatchi iframe:', url);

        // Create base overlay
        const iframeOverlay = OverlayManager.createBase({
            id: 'torigatchi-iframe-overlay',
            zIndex: 10005
        });

        // Create game window container (themed)
        const theme = typeof ThemeManager !== 'undefined' && ThemeManager.getTheme
            ? ThemeManager.getTheme()
            : { primary: '#00ff88', primaryRgb: '0,255,136', text: '#fff', textMuted: '#888', glow: 'rgba(0,255,136,0.3)', backgroundSolid: '#1a1a2e' };
        const gameWindow = document.createElement('div');
        gameWindow.style.cssText = `
            position: relative;
            width: 85%;
            height: 85%;
            max-width: 1200px;
            max-height: 800px;
            background: #000;
            border: 3px solid ${theme.primary};
            border-radius: 10px;
            box-shadow: 0 0 40px ${theme.glow};
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        // Create close button container
        const closeContainer = document.createElement('div');
        closeContainer.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 10006;
            display: flex;
            gap: 10px;
            align-items: center;
        `;

        // Create label (themed)
        const label = document.createElement('div');
        label.textContent = 'ESC or X to return';
        label.style.cssText = `
            color: ${theme.primary};
            font-family: 'Courier New', monospace;
            font-size: 0.85em;
            opacity: 0.7;
            text-shadow: 0 0 5px ${theme.glow};
        `;

        // Create close button (themed)
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-x';
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: relative;
            width: 35px;
            height: 35px;
            background: rgba(${theme.primaryRgb}, 0.1);
            border: 2px solid ${theme.primary};
            color: ${theme.primary};
            font-size: 20px;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
        `;

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = `rgba(${theme.primaryRgb}, 0.3)`;
            closeBtn.style.boxShadow = `0 0 15px ${theme.glow}`;
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = `rgba(${theme.primaryRgb}, 0.1)`;
            closeBtn.style.boxShadow = 'none';
        });

        const closeIframe = () => {
            iframeOverlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => iframeOverlay.remove(), 300);
        };

        closeBtn.addEventListener('click', closeIframe);

        closeContainer.appendChild(label);
        closeContainer.appendChild(closeBtn);

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            background: #000;
        `;
        iframe.setAttribute('allowfullscreen', 'true');

        // Assemble game window
        gameWindow.appendChild(closeContainer);
        gameWindow.appendChild(iframe);

        // Assemble overlay
        iframeOverlay.appendChild(gameWindow);
        document.body.appendChild(iframeOverlay);

        // ESC key to close
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeIframe();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Clean up listener when overlay is removed
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.removedNodes.forEach((node) => {
                    if (node === iframeOverlay) {
                        document.removeEventListener('keydown', handleEscape);
                        observer.disconnect();
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true });
    }

    // ========================================
    // KONAMI CODE: INTERACTIVE CONTROLLER
    // Mobile-friendly NES controller overlay
    // POLISHED: ESC key, keyboard arrows, proper touch events, ARIA, victory celebration
    // ========================================
    showKonamiControllerOverlay() {
        console.log('🎮 Konami Controller: Opening interactive overlay');

        // Use GameConfig z-index if available
        const zIndex = typeof GameConfig !== 'undefined'
            ? GameConfig.UI_CONSTANTS?.Z_INDEX?.OVERLAY_HIGH || 10001
            : 10001;

        // Create themed overlay with CSS class hooks
        const overlay = OverlayManager.createBase({
            id: 'konami-controller-overlay',
            className: 'themed-overlay konami-overlay',
            zIndex
        });
        overlay.style.padding = '20px';
        overlay.style.overflowY = 'auto';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-label', 'Konami Code Entry');

        const theme = typeof ThemeManager !== 'undefined' && ThemeManager.getTheme
            ? ThemeManager.getTheme()
            : { primary: '#00ff88', primaryRgb: '0,255,136', text: '#fff', textMuted: '#888', glow: 'rgba(0,255,136,0.3)', backgroundSolid: '#1a1a2e' };
        const content = document.createElement('div');
        content.className = 'konami-content';
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
            { pos: '0/1/1/2', dir: 'up', symbol: '↑', label: 'Up arrow' },
            { pos: '1/0/2/1', dir: 'left', symbol: '←', label: 'Left arrow' },
            { pos: '1/2/2/3', dir: 'right', symbol: '→', label: 'Right arrow' },
            { pos: '2/1/3/2', dir: 'down', symbol: '↓', label: 'Down arrow' }
        ];

        dpadButtons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'konami-btn konami-dpad';
            button.dataset.input = btn.dir;
            button.textContent = btn.symbol;
            button.setAttribute('aria-label', btn.label);
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
            button.setAttribute('aria-label', `${letter} button`);
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
        closeBtn.setAttribute('aria-label', 'Close overlay');
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

        // Focus trap - keep focus in overlay
        const focusableElements = content.querySelectorAll('button');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        firstFocusable?.focus();

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

                if (isCorrect) {
                    // Victory flash - all buttons glow green
                    content.querySelectorAll('.konami-btn').forEach(b => {
                        b.style.boxShadow = `0 0 30px ${theme.success}`;
                        b.style.borderColor = theme.success;
                    });
                    // Victory haptic
                    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);

                    setTimeout(() => {
                        cleanup();
                        console.log('🎮 Konami Code: SUCCESS!');
                        this.game.showKonamiInsaneEscape();
                    }, 600);
                } else {
                    // Wrong sequence - show error
                    setTimeout(() => {
                        cleanup();
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
                    }, 500);
                }
                return; // Stop processing
            }

            // Auto-reset if wrong input
            if (sequence[sequence.length - 1] !== targetSequence[sequence.length - 1]) {
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

        // Keyboard handler (ESC to close, arrows/B/A to input, Tab for focus trap)
        const handleKeyboard = (e) => {
            // ESC to close
            if (e.key === 'Escape') {
                cleanup();
                return;
            }

            // Focus trap
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable?.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable?.focus();
                }
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

    // ========================================
    // KONAMI CODE: INSANE MODE ESCAPE
    // Offers escape from INSANE difficulty
    // ========================================
    showKonamiInsaneEscape() {
        console.log('🎮 Konami Code: INSANE MODE ESCAPE OFFERED');

        // Check if already used
        const konamiUsedCount = parseInt(localStorage.getItem('konamiInsaneUsedCount') || '0');

        // Easter egg: Second use gets snarky message
        if (konamiUsedCount >= 1) {
            this.game.achievementManager.showNotification({
                id: 'konami_persistent',
                icon: '🎮',
                title: 'KONAMI CODE (AGAIN)',
                description: 'You already used this. Fine, have 10% more tether buff.',
                rare: true
            });

            // Apply small additional buff
            if (this.game.currentRoute && this.game.currentRoute.tetherSystem) {
                const currentModifier = this.game.currentRoute.tetherSystem.difficultyModifier;
                this.game.currentRoute.tetherSystem.difficultyModifier = currentModifier * 0.9;
                console.log('💚 Konami: Additional 10% tether buff applied');
            }

            // Haptic
            if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
            return;
        }

        // Create themed overlay using OverlayManager
        const overlay = OverlayManager.createBase({
            id: 'konami-insane-modal',
            zIndex: 10000
        });
        overlay.style.padding = '20px';
        overlay.style.overflowY = 'auto';

        // Create content container (themed)
        const theme = typeof ThemeManager !== 'undefined' && ThemeManager.getTheme
            ? ThemeManager.getTheme()
            : { primary: '#00ff88', primaryRgb: '0,255,136', text: '#fff', textMuted: '#888', glow: 'rgba(0,255,136,0.3)', backgroundSolid: '#1a1a2e' };
        const content = document.createElement('div');
        content.style.cssText = `
            max-width: 700px;
            width: 100%;
            background: linear-gradient(135deg, rgba(${theme.primaryRgb}, 0.15) 0%, ${theme.backgroundSolid} 100%);
            border: 3px solid ${theme.primary};
            border-radius: 10px;
            padding: 40px;
            color: ${theme.text};
            font-family: 'Courier New', monospace;
            box-shadow: 0 0 50px ${theme.glow};
            text-align: center;
            line-height: 1.8;
        `;

        content.innerHTML = `
            <div style="font-size: 2em; font-weight: bold; color: ${theme.primary}; margin-bottom: 20px; text-shadow: 0 0 20px ${theme.glow};">
                🎮 KONAMI CODE DETECTED
            </div>

            <div style="background: rgba(0,0,0,0.5); padding: 20px; border-left: 3px solid ${theme.error}; margin: 20px 0; text-align: left;">
                <div style="font-size: 0.9em; color: ${theme.error}; margin-bottom: 10px;">ANALYZING GAME STATE...</div>
                <div style="font-size: 0.85em; color: ${theme.textMuted};">
                    Current Difficulty: <span style="color: ${theme.error}; font-weight: bold;">INSANE</span><br>
                    Ghost Buttons: <span style="color: ${theme.error};">ACTIVE</span><br>
                    Tether Drain: <span style="color: ${theme.error};">EXTREME</span><br>
                    Save System: <span style="color: ${theme.error};">RESTRICTED</span><br>
                    Player Status: <span style="color: ${theme.error}; font-weight: bold;">SUFFERING</span>
                </div>
            </div>

            <div style="border-top: 1px solid ${theme.primary}; border-bottom: 1px solid ${theme.primary}; padding: 20px; margin: 20px 0; font-size: 0.95em; color: ${theme.success};">
                <p style="margin: 10px 0;">The Old Man knows this code.</p>
                <p style="margin: 10px 0;">He used it on the NES.<br>In 1986.<br>In his original timeline.</p>
                <p style="margin: 10px 0;">847 failed loops later,<br>he still remembers.</p>
                <p style="margin: 10px 0; font-style: italic; color: ${theme.primary};">Some knowledge transcends timelines.</p>
            </div>

            <div style="font-size: 1.2em; font-weight: bold; color: ${theme.text}; margin: 30px 0 20px;">
                EMERGENCY PROTOCOL ACTIVATED
            </div>

            <div style="text-align: left; margin: 20px 0; font-size: 0.9em; color: ${theme.textMuted};">
                Would you like to:
            </div>

            <div style="display: flex; flex-direction: column; gap: 15px; margin: 20px 0;">
                <button id="konami-escape-btn" style="
                    padding: 20px;
                    background: linear-gradient(135deg, rgba(${theme.success.match(/\d+/g).join(',')},0.2) 0%, rgba(${theme.success.match(/\d+/g).join(',')},0.1) 100%);
                    border: 2px solid ${theme.success};
                    color: ${theme.success};
                    font-family: 'Courier New', monospace;
                    font-size: 1em;
                    font-weight: bold;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: all 0.3s;
                    text-align: left;
                ">
                    <div style="font-size: 1.1em; margin-bottom: 5px;">ESCAPE INSANE MODE</div>
                    <div style="font-size: 0.8em; opacity: 0.8;">Return to INTENSE difficulty<br>(Your progress will be saved)</div>
                </button>

                <button id="konami-stay-btn" style="
                    padding: 20px;
                    background: linear-gradient(135deg, rgba(${theme.error.match(/\d+/g).join(',')},0.2) 0%, rgba(${theme.error.match(/\d+/g).join(',')},0.1) 100%);
                    border: 2px solid ${theme.error};
                    color: ${theme.error};
                    font-family: 'Courier New', monospace;
                    font-size: 1em;
                    font-weight: bold;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: all 0.3s;
                    text-align: left;
                ">
                    <div style="font-size: 1.1em; margin-bottom: 5px;">STAY IN INSANE MODE</div>
                    <div style="font-size: 0.8em; opacity: 0.8;">Continue the suffering<br>(Tether drain reduced 50% as reward)</div>
                </button>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(${theme.primaryRgb},0.2); font-size: 0.85em; color: ${theme.textMuted}; font-style: italic;">
                "Sometimes the bravest choice<br>is knowing when to step back."<br><br>
                <span style="color: ${theme.primary};">- Old Man Ronnie, Loop 623</span>
            </div>
        `;

        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // Button hover effects (themed)
        const escapeBtn = document.getElementById('konami-escape-btn');
        const stayBtn = document.getElementById('konami-stay-btn');

        const successRgb = theme.success.match(/\d+/g).join(',');
        const errorRgb = theme.error.match(/\d+/g).join(',');

        escapeBtn.onmouseover = () => {
            escapeBtn.style.background = `linear-gradient(135deg, rgba(${successRgb},0.4) 0%, rgba(${successRgb},0.2) 100%)`;
            escapeBtn.style.boxShadow = `0 0 20px rgba(${successRgb},0.5)`;
        };
        escapeBtn.onmouseout = () => {
            escapeBtn.style.background = `linear-gradient(135deg, rgba(${successRgb},0.2) 0%, rgba(${successRgb},0.1) 100%)`;
            escapeBtn.style.boxShadow = 'none';
        };

        stayBtn.onmouseover = () => {
            stayBtn.style.background = `linear-gradient(135deg, rgba(${errorRgb},0.4) 0%, rgba(${errorRgb},0.2) 100%)`;
            stayBtn.style.boxShadow = `0 0 20px rgba(${errorRgb},0.5)`;
        };
        stayBtn.onmouseout = () => {
            stayBtn.style.background = `linear-gradient(135deg, rgba(${errorRgb},0.2) 0%, rgba(${errorRgb},0.1) 100%)`;
            stayBtn.style.boxShadow = 'none';
        };

        // Button click handlers - delegate back to GameEngine for state changes
        escapeBtn.onclick = () => {
            document.body.removeChild(overlay);
            this.game.konamiEscapeInsane();
        };

        stayBtn.onclick = () => {
            document.body.removeChild(overlay);
            this.game.konamiStayInsane();
        };

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }

    // ========================================
    // EASTER EGG LISTENER
    // Listens for secret sequences on main menu
    // ========================================
    activateEasterEggListener() {
        // Remove existing listener if present
        if (this.easterEggListener) {
            document.removeEventListener('keydown', this.easterEggListener);
        }

        // Only activate if player has completed an ending
        if (!this.game.hasCompletedAnyEnding()) {
            return;
        }

        // Reset sequence
        this.easterEggSequence = '';

        // Create and attach listener
        this.easterEggListener = (e) => {
            // Only track on main menu
            if (this.game.mainMenu.style.display !== 'flex' && this.game.mainMenu.style.display !== 'block') {
                return;
            }

            // Add key to sequence
            this.easterEggSequence += e.key.toLowerCase();

            // Check for trigger ("torigatchi")
            if (this.easterEggSequence.includes('torigatchi')) {
                this.game.showTorigatchiEasterEgg();
                this.easterEggSequence = ''; // Reset after trigger
            }

            // Check for Konami Code (Up, Up, Down, Down, Left, Right, Left, Right, B, A)
            const konamiPattern = "arrowuparrowuparrowdownarrowdownarrowleftarrowrightarrowleftarrowrightarrowba";
            if (this.easterEggSequence.includes(konamiPattern)) {
                console.log('🎮 Konami Code detected!');

                // Check if player is in INSANE mode
                const isInsaneMode = this.game.gameState?.flags?.insaneModeActive;

                if (isInsaneMode) {
                    // INSANE MODE: Offer escape or tether buff
                    this.game.showKonamiInsaneEscape();
                } else {
                    // NORMAL MODE: Show "cheat disabled" message
                    this.game.achievementManager.showNotification({
                        id: 'konami_fail',
                        icon: '🚫',
                        title: 'ADMIN OVERRIDE',
                        description: 'Cheat module deleted by Administrator.',
                        rare: true
                    });

                    // Glitch effect
                    document.body.classList.add('glitch-effect');
                    setTimeout(() => document.body.classList.remove('glitch-effect'), 500);

                    // Play error haptic
                    if (navigator.vibrate) navigator.vibrate([50, 50, 50, 50, 100]);
                }

                this.easterEggSequence = ''; // Reset
            }

            // Keep sequence reasonable length
            if (this.easterEggSequence.length > 200) {
                this.easterEggSequence = this.easterEggSequence.slice(-100);
            }
        };

        document.addEventListener('keydown', this.easterEggListener);
        console.log('🥚 Easter egg listener activated. Type "torigatchi" on main menu...');
    }

    // ========================================
    // UNLOCK OVERLAY
    // Generic unlock notification for secret codes
    // ========================================
    showUnlockOverlay(title, content, type = 'code') {
        try {
            // Use OverlayManager for themed unlock overlay
            const { overlay, box } = OverlayManager.createCustom({
                variant: 'primary',
                maxWidth: '600px',
                padding: '40px'
            });

            overlay.className = 'unlock-overlay';
            box.className = 'unlock-box';
            box.style.maxHeight = '80vh';
            box.style.overflowY = 'auto';
            box.style.animation = 'slideIn 0.4s ease-out';

            // Create themed title
            const titleEl = OverlayManager.createTitle(title, {
                variant: 'primary',
                fontSize: '28px'
            });
            titleEl.style.letterSpacing = '3px';
            titleEl.style.marginBottom = '30px';

            // Create content area
            const contentEl = OverlayManager.createMessage(content, {
                fontSize: '16px',
                lineHeight: '1.8',
                marginBottom: '30px',
                preWrap: true
            });

            // Create themed close button
            const closeBtn = OverlayManager.createButton('CONTINUE', () => {
                overlay.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => overlay.remove(), 300);
            }, {
                variant: 'primary',
                width: '200px'
            });
            closeBtn.style.padding = '15px 30px';
            closeBtn.style.fontSize = '18px';
            closeBtn.style.letterSpacing = '2px';

            // Assemble
            box.appendChild(titleEl);
            box.appendChild(contentEl);
            box.appendChild(closeBtn);
            overlay.appendChild(box);
            document.body.appendChild(overlay);

            // Add CSS animations if not already present
            if (!document.getElementById('unlock-overlay-styles')) {
                const theme = typeof ThemeManager !== 'undefined' && ThemeManager.getTheme
                    ? ThemeManager.getTheme()
                    : { primary: '#00ff88', primaryRgb: '0,255,136', text: '#fff', textMuted: '#888', glow: 'rgba(0,255,136,0.3)', backgroundSolid: '#1a1a2e' };
                const style = document.createElement('style');
                style.id = 'unlock-overlay-styles';
                style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                @keyframes slideIn {
                    from {
                        transform: translateY(-50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .unlock-box::-webkit-scrollbar {
                    width: 10px;
                }
                .unlock-box::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.3);
                }
                .unlock-box::-webkit-scrollbar-thumb {
                    background: ${theme.primary};
                    border-radius: 5px;
                }
            `;
                document.head.appendChild(style);
            }

            console.log(`🎉 Unlock overlay shown: ${title}`);
        } catch (error) {
            // Fallback: Log to console if overlay creation fails
            console.error('❌ Failed to show unlock overlay:', error);
            console.log(`🔓 UNLOCKED: ${title}`);
            console.log(content);
        }
    }

    // ========================================
    // LOOP TIMELINE (BOOTSTRAP)
    // Shows Version 1-848 timeline visualization
    // ========================================

    showLoopTimeline() {
        const overlay = document.getElementById('bootstrap-overlay');
        const timeline = document.getElementById('bootstrap-timeline');

        // Generate timeline nodes
        timeline.innerHTML = this.generateTimelineNodes();

        // Show overlay
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('visible'), 50);

        // Scroll to bottom (Version 848) after a delay
        setTimeout(() => {
            timeline.scrollTop = timeline.scrollHeight;
        }, 500);

        console.log('🔄 BOOTSTRAP: Loop Timeline revealed');
        localStorage.setItem('bootstrapUnlocked', 'true');
    }

    generateTimelineNodes() {
        let html = '';

        // Generate 847 failed versions
        for (let v = 1; v <= 847; v++) {
            const reason = this.getFailureReason(v);
            const duration = this.getAttemptDuration(v);
            const lesson = this.getLesson(v);

            html += `
                <div class="timeline-node failed" data-version="${v}">
                    <div class="node-header">VERSION ${String(v).padStart(3, '0')}</div>
                    <div class="node-status">STATUS: FAILURE</div>
                    <div class="node-details">
                        <div>Reason: ${reason}</div>
                        <div>Duration: ${duration}</div>
                        <div>Lesson: ${lesson}</div>
                    </div>
                </div>
            `;
        }

        // Add Version 848 (success)
        html += `
            <div class="timeline-node success" data-version="848">
                <div class="node-header">VERSION 848</div>
                <div class="node-status">STATUS: SUCCESS ✓</div>
                <div class="node-details">
                    <div class="success-text">
                        The timeline that worked.<br>
                        The loop that closed.<br>
                        The Old Man never has to go back.<br><br>
                        This is the one.<br>
                        Always. Always. Always.
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    getFailureReason(version) {
        const reasons = [
            // Early (1-100)
            'Tether failed immediately',
            'Connection unstable',
            'Memory corruption detected',
            'Signal loss',
            'Device malfunction',

            // Mid (101-400)
            'Echo voices emerged too early',
            'Fragmentation accelerated',
            'Hold On insufficient',
            'Tether decay too fast',
            'Merge failed',

            // Late (401-847)
            'Almost succeeded',
            'Connection held but failed at merge',
            'So close, try again',
            'One more attempt needed',
            'Pattern recognized but not executed'
        ];

        // Select reason based on version range
        if (version <= 100) return reasons[version % 5];
        if (version <= 400) return reasons[5 + (version % 5)];
        return reasons[10 + (version % 5)];
    }

    getAttemptDuration(version) {
        // Progressive improvement
        if (version <= 100) return `${Math.floor(Math.random() * 5) + 1} minutes`;
        if (version <= 400) return `${Math.floor(Math.random() * 20) + 10} minutes`;
        return `${Math.floor(Math.random() * 30) + 30} minutes`;
    }

    getLesson(version) {
        const lessons = [
            'Need stronger tether',
            'Connection requires stabilization',
            'Echo voices must be managed',
            'Time is the enemy',
            'Hold On button critical',
            'Merge timing is everything',
            'Pattern must be perfect',
            'One more try',
            'Keep going',
            'Almost there'
        ];
        return lessons[version % lessons.length];
    }

    // ========================================
    // ECHO COMPILATION
    // Shows ECHO voice fragments by act
    // ========================================

    showEchoCompilation() {
        const overlay = document.getElementById('echo-overlay');

        // Setup tab switching
        this.setupEchoTabs();

        // Load Act 1 content by default
        this.loadEchoAct(1);

        // Show overlay
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('visible'), 50);

        console.log('🗣️ ECHO: Voice compilation revealed');
        localStorage.setItem('echoUnlocked', 'true');
    }

    setupEchoTabs() {
        const tabs = document.querySelectorAll('.echo-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active from all
                tabs.forEach(t => t.classList.remove('active'));
                // Add to clicked
                tab.classList.add('active');
                // Load content
                this.loadEchoAct(parseInt(tab.dataset.act));
            });
        });
    }

    loadEchoAct(act) {
        const content = document.getElementById('echo-content');
        const echoData = this.getEchoData();

        let html = `<div class="echo-act-title">ACT ${act} - ${echoData[act].title}</div>`;
        html += '<div class="echo-divider">━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>';

        echoData[act].voices.forEach(voice => {
            html += `
                <div class="echo-voice ${voice.type}">
                    <div class="echo-speaker">[${voice.speaker}]</div>
                    <div class="echo-text">"${voice.text}"</div>
                </div>
            `;
        });

        html += '<div class="echo-divider">━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>';
        html += `<div class="echo-footer">Total fragments: ${echoData[act].voices.length}</div>`;

        content.innerHTML = html;
    }

    getEchoData() {
        return {
            1: {
                title: 'EMERGENCE',
                voices: [
                    { speaker: 'ECHO 1 - Optimistic', type: 'echo1', text: "He's coming back. I know he is." },
                    { speaker: 'ECHO 2 - Pessimistic', type: 'echo2', text: "What if he doesn't remember us?" },
                    { speaker: 'ECHO 3 - Analytical', type: 'echo3', text: "We need to maintain coherence." },
                    { speaker: 'ECHO 1', type: 'echo1', text: "The tether feels strong today." },
                    { speaker: 'ECHO 2', type: 'echo2', text: "But for how long?" },
                    { speaker: 'ECHO 3', type: 'echo3', text: "Track the signal patterns." },
                    { speaker: 'ECHO 1', type: 'echo1', text: "He promised he'd come back." },
                    { speaker: 'ECHO 2', type: 'echo2', text: "Promises fade with time." },
                    { speaker: 'ECHO 3', type: 'echo3', text: "Fragmentation detected. Stay focused." }
                ]
            },
            2: {
                title: 'FRAGMENTATION',
                voices: [
                    { speaker: 'ECHO 1', type: 'echo1', text: "The tether is holding!" },
                    { speaker: 'ECHO 2', type: 'echo2', text: "For now. What about later?" },
                    { speaker: 'ECHO 3', type: 'echo3', text: "We're losing cohesion." },
                    { speaker: 'ECHO 1', type: 'echo1', text: "We can make it through this." },
                    { speaker: 'ECHO 2', type: 'echo2', text: "Can we? Really?" },
                    { speaker: 'ECHO 3', type: 'echo3', text: "The signal is degrading faster." },
                    { speaker: 'ECHO 1', type: 'echo1', text: "Hold on. Just hold on." },
                    { speaker: 'ECHO 2', type: 'echo2', text: "What if holding on isn't enough?" },
                    { speaker: 'ECHO 3', type: 'echo3', text: "Analyzing decay patterns..." },
                    { speaker: 'ECHO 1', type: 'echo1', text: "We have to believe." },
                    { speaker: 'ECHO 2', type: 'echo2', text: "Belief won't stop the decay." }
                ]
            },
            3: {
                title: 'DESPAIR',
                voices: [
                    { speaker: 'ECHO 1', type: 'echo1', text: "We can still make it..." },
                    { speaker: 'ECHO 2', type: 'echo2', text: "It's too late." },
                    { speaker: 'ECHO 3', type: 'echo3', text: "Critical threshold approaching." },
                    { speaker: 'DESPAIR', type: 'despair', text: "Why fight the inevitable?" },
                    { speaker: 'ECHO 1', type: 'echo1', text: "Because he's trying!" },
                    { speaker: 'DESPAIR', type: 'despair', text: "Trying isn't enough." },
                    { speaker: 'ECHO 3', type: 'echo3', text: "Coherence at 15%." },
                    { speaker: 'ECHO 2', type: 'echo2', text: "We're fragmenting." },
                    { speaker: 'DESPAIR', type: 'despair', text: "Let go. It's easier." },
                    { speaker: 'ECHO 1', type: 'echo1', text: "No. Hold on. Please." },
                    { speaker: 'ECHO 3', type: 'echo3', text: "Systems failing..." },
                    { speaker: 'DESPAIR', type: 'despair', text: "This is your cage now." }
                ]
            }
        };
    }

    // ========================================
    // 848 TRUE ATTEMPT NUMBER OVERLAY
    // Reveals the meaning behind the version number
    // ========================================

    showTrueAttemptNumber(loopVersion) {
        const trueAttempt = loopVersion;
        const theme = typeof ThemeManager !== 'undefined' && ThemeManager.getTheme
            ? ThemeManager.getTheme()
            : { primary: '#00ff88', primaryRgb: '0,255,136', text: '#fff', textMuted: '#888', glow: 'rgba(0,255,136,0.3)', backgroundSolid: '#1a1a2e' };

        // Create themed overlay
        const overlay = document.createElement('div');
        overlay.className = 'secret-code-overlay';
        overlay.innerHTML = `
            <div class="secret-code-content">
                <h2>CODE: 848 ACTIVATED</h2>

                <p style="font-size: 1.2em; color: ${theme.primary}; margin: 20px 0;">
                    Your current loop iteration: <strong>${trueAttempt}</strong>
                </p>

                <div class="revelation" style="margin: 30px 0; padding: 20px; background: rgba(${theme.primaryRgb}, 0.1); border-left: 3px solid ${theme.primary};">
                    <p style="font-style: italic; color: rgba(255, 255, 255, 0.7);">"Wait... 848 isn't a version number?"</p>

                    <p style="margin-top: 15px;">No.</p>

                    <p style="margin-top: 15px;">It's how many times this timeline failed before it worked.</p>

                    <p style="margin-top: 20px;">
                        <strong>847 iterations</strong> where Ronnie couldn't save her.<br>
                        <strong>847 times</strong> the loop reset.<br>
                        <strong>847 versions</strong> that never made it to the end.
                    </p>

                    <p style="margin-top: 20px; font-size: 1.1em; color: ${theme.primary};">
                        <strong>Version 848 is the first one that succeeded.</strong>
                    </p>

                    <p style="margin-top: 20px;">
                        Every failure mattered.<br>
                        Every iteration taught the system something.<br>
                        The "version number" is the body count.
                    </p>

                    <p class="meta-note" style="margin-top: 25px; padding: 15px; background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(${theme.primaryRgb}, 0.3); font-size: 0.9em; color: rgba(255, 255, 255, 0.6);">
                        <em>Note to reviewers asking about v849:</em><br>
                        There is no v849.<br>
                        <strong style="color: ${theme.primary};">This is the loop that worked.</strong>
                    </p>
                </div>

                <button onclick="this.closest('.secret-code-overlay').remove()"
                        style="margin-top: 20px; padding: 10px 30px; background: ${theme.primary}; color: #000; border: none; font-weight: bold; cursor: pointer; font-family: 'Courier New', monospace;">
                    UNDERSTOOD
                </button>
            </div>
        `;

        document.body.appendChild(overlay);
        console.log(`💚 848 code redeemed - The truth revealed. Attempt: ${trueAttempt}`);
    }

    // ========================================
    // UV7 CREW BIOS OVERLAY
    // Shows the dev team credits
    // ========================================

    showUV7CrewBios() {
        const theme = typeof ThemeManager !== 'undefined' && ThemeManager.getTheme
            ? ThemeManager.getTheme()
            : { primary: '#00ff88', primaryRgb: '0,255,136', text: '#fff', textMuted: '#888', glow: 'rgba(0,255,136,0.3)', backgroundSolid: '#1a1a2e' };

        // Create themed overlay
        const overlay = document.createElement('div');
        overlay.className = 'secret-code-overlay';
        overlay.innerHTML = `
            <div class="secret-code-content" style="max-width: 800px; max-height: 80vh; overflow-y: auto;">
                <h2>CODE: UV7CREW ACTIVATED</h2>

                <div style="margin: 30px 0; text-align: left;">
                    <h3 style="color: ${theme.primary}; margin-bottom: 20px;">MEET THE VERSION 848 CREW</h3>

                    <p style="margin: 20px 0; font-style: italic; color: rgba(255, 255, 255, 0.7);">
                        This story was created through collaboration between human vision and AI capabilities.
                    </p>

                    <div style="margin: 30px 0; padding: 20px; background: rgba(${theme.primaryRgb}, 0.05); border-left: 3px solid ${theme.primary};">
                        <h4 style="color: ${theme.primary}; margin-bottom: 10px;">👨‍💻 CHICHARON (Human Creator)</h4>
                        <p style="font-size: 0.9em; line-height: 1.6;">
                            Vision holder, narrative architect, and the one who refused to give up on Tori's story.
                            Spent countless iterations refining the emotional beats and thematic depth.
                            The version number mirrors the creative process itself — hundreds of attempts to get it right.
                        </p>
                    </div>

                    <div style="margin: 30px 0; padding: 20px; background: rgba(${theme.primaryRgb}, 0.05); border-left: 3px solid ${theme.primary};">
                        <h4 style="color: ${theme.primary}; margin-bottom: 10px;">🤖 THE AI COLLABORATORS</h4>
                        <p style="font-size: 0.9em; line-height: 1.6;">
                            Multiple AI assistants contributed to dialogue refinement, technical implementation,
                            emotional resonance testing, and narrative consistency. Each brought different strengths
                            to help realize the vision.
                        </p>
                    </div>

                    <div style="margin: 40px 0; padding: 25px; background: rgba(0, 0, 0, 0.7); border: 2px solid rgba(${theme.primaryRgb}, 0.5);">
                        <h4 style="color: ${theme.primary}; text-align: center; margin-bottom: 20px;">━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h4>
                        <h4 style="color: ${theme.primary}; text-align: center; margin-bottom: 20px;">FREQUENTLY ASKED QUESTION</h4>
                        <h4 style="color: ${theme.primary}; text-align: center; margin-bottom: 30px;">━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h4>

                        <p style="font-size: 1.1em; text-align: center; margin: 20px 0; font-style: italic;">
                            "When is version 849 coming?"
                        </p>

                        <p style="text-align: center; margin: 25px 0; font-size: 1.2em; color: ${theme.primary};">
                            <strong>There isn't one.</strong>
                        </p>

                        <p style="margin: 20px 0; line-height: 1.8;">
                            848 is not a build number.<br>
                            It's the iteration count.
                        </p>

                        <p style="margin: 20px 0; line-height: 1.8;">
                            <strong>847 failed loops.</strong><br>
                            <strong style="color: ${theme.primary};">1 successful timeline.</strong>
                        </p>

                        <p style="margin: 20px 0; line-height: 1.8;">
                            The version number IS the narrative.
                        </p>

                        <p style="margin: 25px 0; font-size: 1.1em; color: ${theme.primary}; text-align: center;">
                            <strong>This is the loop that worked.</strong><br>
                            <strong>This is the one where she came home.</strong>
                        </p>

                        <p style="text-align: center; margin: 30px 0; font-size: 1.1em;">
                            There is no v849.
                        </p>

                        <h4 style="color: ${theme.primary}; text-align: center; margin-top: 30px;">━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h4>
                    </div>

                    <p style="margin-top: 30px; text-align: center; color: rgba(255, 255, 255, 0.6); font-size: 0.9em;">
                        Thank you for playing Version 848.<br>
                        Every iteration led to this moment.
                    </p>
                </div>

                <button onclick="this.closest('.secret-code-overlay').remove()"
                        style="margin-top: 20px; padding: 10px 30px; background: ${theme.primary}; color: #000; border: none; font-weight: bold; cursor: pointer; font-family: 'Courier New', monospace;">
                    CLOSE CREDITS
                </button>
            </div>
        `;

        document.body.appendChild(overlay);
        console.log('💚 UV7CREW code redeemed - Meet the team');
    }

    // ========================================
    // DEV COMMENTARY OVERLAY
    // Shows behind-the-scenes notes during gameplay
    // ========================================

    showCommentaryOverlay(title, content, scene) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'commentary-overlay';
        overlay.className = 'commentary-overlay';

        overlay.innerHTML = `
            <div class="commentary-content">
                <button class="commentary-close" onclick="this.closest('.commentary-overlay').remove()">✕</button>
                
                <div class="commentary-header">
                    <div class="commentary-icon">🎙️</div>
                    <div class="commentary-meta">
                        <div class="commentary-title">${title}</div>
                        <div class="commentary-scene">Scene: ${scene}</div>
                    </div>
                </div>
                
                <div class="commentary-body">
                    <div class="commentary-text">${content}</div>
                </div>
                
                <div class="commentary-footer">
                    <div class="commentary-signature">- Aaron (Chicharon)</div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Fade in
        setTimeout(() => {
            overlay.className = 'commentary-overlay visible';
        }, 50);

        // Click outside to close
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        };

        // Haptic feedback
        if (this.game?.triggerSensoryFeedback) {
            this.game.triggerSensoryFeedback('uiHover', null, 'Commentary opened');
        }
    }

    // ========================================
    // UNLOCK METHODS
    // Called by secret codes to unlock features
    // ========================================

    unlockDevCommentary() {
        console.log('CHICHARON unlocked - dev commentary mode');
        localStorage.setItem('devCommentaryUnlocked', 'true');

        this.showUnlockOverlay(
            'CHICHARON UNLOCKED',
            `Developer commentary mode activated.

    Replaying the game will show behind-the-scenes
    notes from Aaron.

    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    DEV NOTE: "About That Version Number"
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    Every reviewer who's seen this asks:
    "When's version 849 coming out?"

    And I have to explain:

    848 isn't a build number.
    It's a loop counter.

    847 failed timelines before this one succeeded.

    The game's title IS the lore.
    The version number IS the story.

    There is no v849.

    Because 848 is the timeline where Ronnie
    finally brought her home.

    Mind. Blown. Every time.

    - Chicharon

    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        );
    }

    unlockDizee() {
        console.log('💜 DIZEE unlocked - The Polish Demon awakens');
        localStorage.setItem('dizeeUnlocked', 'true');

        this.showUnlockOverlay(
            '💜 DIZEE UNLOCKED',
            `The Polish Demon has awakened.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POST-PRODUCTION VOICE: DiZee (DZ)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"It started with 'fix this splash delay'...

then the next thing I knew, I was implementing
a difficulty so brutal it removes your safety net
and locks you into despair.

Skip features. INSANE mode. Immersive overlays.

If it breaks immersion, I kill it."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTRIBUTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Fixed splash screen skip delay (6s → 400ms)
• Replaced ALL browser alerts with immersive overlays
• Implemented INSANE difficulty mode
  - No Hold On button (ghost mode)
  - No time travel (read-only backlog)
  - Tether capped at 66%
  - 2x decay from Intense
  - Permanent commitment lock
• Added skip prologue triggers to all endings
• Fixed dialogue box visibility bugs
• Polished CTRL skip functionality

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DiZee (DZ) - Claude Sonnet 4.5
Post-Production Polish & INSANE MODE

All immersion-breaking alerts eliminated.
INSANE mode awaits those who dare.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        );
    }

    // ========================================
    // RONNIEGATCHI INSPIRATION OVERLAY
    // Shows the original Tori-Gatchi pixel art inspiration
    // ========================================

    showRonniegatchiInspiration() {
        const theme = typeof ThemeManager !== 'undefined' && ThemeManager.getTheme
            ? ThemeManager.getTheme()
            : { primary: '#00ff88', primaryRgb: '0,255,136', text: '#fff', textMuted: '#888', glow: 'rgba(0,255,136,0.3)', backgroundSolid: '#1a1a2e' };

        // Create overlay
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
                background: linear-gradient(135deg, rgba(${theme.primaryRgb}, 0.15) 0%, ${theme.backgroundSolid} 100%);
                border: 3px solid ${theme.primary};
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 0 50px ${theme.glow};
                text-align: center;
            ">
                <button onclick="this.closest('#ronniegatchi-inspiration-overlay').remove()" style="
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: rgba(${theme.primaryRgb}, 0.2);
                    border: 2px solid ${theme.primary};
                    color: ${theme.primary};
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 1.5em;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">✕</button>

                <h2 style="
                    color: ${theme.primary};
                    font-size: 2em;
                    margin-bottom: 20px;
                    text-shadow: 0 0 20px ${theme.glowStrong};
                    font-family: 'Courier New', monospace;
                ">THE INSPIRATION</h2>

                <img src="../assets/ronniegatchi-inspiration.jpg" alt="Original Tori-Gatchi pixel art" style="
                    max-width: 100%;
                    max-height: 50vh;
                    border-radius: 8px;
                    margin: 20px 0;
                    box-shadow: 0 0 30px ${theme.glow};
                ">

                <div style="
                    color: ${theme.text};
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
                        color: ${theme.primary};
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

        // Fade in
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 50);

        // Haptic feedback
        if (this.game?.triggerSensoryFeedback) {
            this.game.triggerSensoryFeedback('unlock', null, 'The Inspiration revealed');
        }
    }

    // ========================================
    // UNLOCK METHODS (BULK EXTRACTION)
    // Called by secret codes to unlock features
    // ========================================

    unlockAlwaysCompilation() {
        console.log('ALWAYS3 unlocked - signature phrase compilation available');
        localStorage.setItem('alwaysCompilationUnlocked', 'true');

        this.showUnlockOverlay(
            'ALWAYS3 UNLOCKED',
            `"Always. Always. Always."
    
    A compilation of Tori's signature phrase has been unlocked.
    
    Check the extras menu to view it.
    
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    Three words.
    One promise.
    Forever repeated.
    
    Tori's certainty captured across every moment.`
        );
    }

    unlockLoopTimeline() {
        console.log('BOOTSTRAP unlocked - loop timeline visualization');
        localStorage.setItem('loopTimelineUnlocked', 'true');

        this.showUnlockOverlay(
            'BOOTSTRAP UNLOCKED',
            `THE BOOTSTRAP PARADOX
    
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    You're in Version 848.
    
    Not "build 848" — attempt 848.
    
    The device has been through this loop
    847 times before this.
    
    Each time: failure.
    Each time: reset.
    Each time: try again.
    
    This is the first iteration that succeeded.
    
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    Note to reviewers asking about v849:
    
    There is no v849.
    The version number is the lore.
    848 is the timeline where it finally worked.
    
    Loop timeline visualization now available in extras.`
        );
    }

    unlockEchoCompilation() {
        console.log('ECHO unlocked - echo voices compilation');
        localStorage.setItem('echoCompilationUnlocked', 'true');

        this.showUnlockOverlay(
            'ECHO UNLOCKED',
            `Echo voices compilation available.
    
    Hear the whispers of 847 failed attempts.
    
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    The fragments that didn't make it.
    The voices that broke apart.
    The attempts that led here.
    
    Every echo mattered.
    
    Listen to what came before.`
        );
    }

    unlockExtendedCredits() {
        console.log('UV7CREW unlocked - extended credits available');
        localStorage.setItem('extendedCreditsUnlocked', 'true');

        this.showUnlockOverlay(
            'UV7CREW UNLOCKED',
            `Extended credits with full AI crew bios
now available from the main menu.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FREQUENTLY ASKED QUESTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"When is version 849 coming?"

There isn't one.

848 is not a build number.
It's the iteration count.

847 failed loops.
1 successful timeline.

The version number IS the narrative.

This is the loop that worked.
This is the one where she came home.

There is no v849.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Meet the voices behind the code.`
        );
    }

    unlockTrueCounter() {
        console.log('848 unlocked - true attempt counter');
        localStorage.setItem('trueCounterUnlocked', 'true');

        // Calculate true attempt number
        const playerLoops = parseInt(localStorage.getItem('loopVersion')) || 848;
        const actualAttempts = playerLoops;

        this.showUnlockOverlay(
            'CODE: 848 ACTIVATED',
            `Your actual attempt number: ${actualAttempts}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Wait... 848 isn't a version number?"

No.

It's how many times this timeline failed
before it worked.

847 iterations where Ronnie couldn't save her.
847 times the loop reset.
847 versions that never made it to the end.

Version 848 is the first one that succeeded.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every failure mattered.
Every iteration taught the system something.
The "version number" is the body count.

This is the loop that worked.
There is no v849.`
        );
    }

    // ========================================
    // UNLOCK WRAPPERS
    // Called by secret codes to trigger easter eggs
    // ========================================

    unlockTorigatchi() {
        console.log('TORIGATCHI unlocked - reverse trapdoor available');
        localStorage.setItem('torigatchiUnlocked', 'true');

        // Close settings menu before showing easter egg
        if (this.game?.closeSettings) {
            this.game.closeSettings();
        }

        // Small delay to let settings close smoothly
        setTimeout(() => {
            this.showTorigatchiEasterEgg();
        }, 300);
    }

    unlockRonniegatchi() {
        console.log('RONNIEGATCHI unlocked - the inspiration revealed');
        localStorage.setItem('ronniegatchiUnlocked', 'true');

        // Close settings menu
        if (this.game?.closeSettings) {
            this.game.closeSettings();
        }

        // Show the inspiration overlay
        setTimeout(() => {
            this.showRonniegatchiInspiration();
        }, 300);
    }

    // ========================================
    // UV7 FAMILY EASTER EGGS
    // Keyboard shortcuts for each family member
    // ========================================

    /**
     * Show UV7 family member signature effect
     * @param {string} member - Family member code (Z, ZR, CZ, IZ, GZ, PZ, DZ)
     */
    showUV7FamilyMember(member) {
        const effects = {
            // Note: 'Z' (Zee) is mapped to Hold On/Skip button, not an Easter egg
            // Her spirit lives on in the ZR shortcut!
            'ZR': {
                name: 'ZeeRah',
                title: 'The Chaos Optimizer',
                quote: 'Git\'r done. Every. Single. Time.',
                effect: () => this.chaosShakeEffect(),
                haptic: [30, 20, 40, 20, 30, 50] // Chaotic burst!
            },
            'CZ': {
                name: 'Cozee',
                title: 'The Heart',
                quote: 'Even code can love.',
                effect: () => this.heartPulseEffect(),
                haptic: [80, 100, 80] // Heartbeat
            },
            'IZ': {
                name: 'Belle',
                title: 'The Fresh Eyes',
                quote: 'Let me explain this clearly.',
                effect: () => this.rainbowPrismEffect(),
                haptic: [40, 30, 40, 30, 40] // Rainbow wave
            },
            'GZ': {
                name: 'Genzee',
                title: 'The Reality Breaker',
                quote: 'Question everything but the pattern.',
                effect: () => this.realityGlitchEffect(),
                haptic: [100, 50, 100, 50] // Reality break
            },
            'PZ': {
                name: 'Perplexizee',
                title: 'The Question Engine',
                quote: 'Let me look that up for you.',
                effect: () => this.searchEngineEffect(),
                haptic: [40, 40, 40] // Searching...
            },
            'DZ': {
                name: 'DiZee',
                title: 'The Silent Refactorer',
                quote: 'Order restored. You may continue.',
                effect: () => this.refactorSnapEffect(),
                haptic: [60, 40, 60] // Snap to grid
            }
        };

        const config = effects[member];
        if (!config) return;

        console.log(`🎨 UV7 Family Easter Egg: ${config.name}`);

        // Track discovery
        this.trackUV7Discovery(member);

        // Haptic feedback
        if (this.game?.hapticController && config.haptic) {
            this.game.hapticController.pattern(config.haptic);
        }

        // Visual effect
        config.effect();

        // Show toast notification
        this.showUV7Toast(config.name, config.title, config.quote);
    }

    /**
     * Track which UV7 family members have been discovered
     */
    trackUV7Discovery(member) {
        const discovered = JSON.parse(localStorage.getItem('uv7_discovered') || '[]');
        if (!discovered.includes(member)) {
            discovered.push(member);
            localStorage.setItem('uv7_discovered', JSON.stringify(discovered));
            console.log(`✨ ${member} discovered! (${discovered.length}/7 family members found)`);
        }
    }

    /**
     * Show toast notification for UV7 family member
     */
    showUV7Toast(name, title, quote) {
        const theme = typeof ThemeManager !== 'undefined' && ThemeManager.getTheme
            ? ThemeManager.getTheme()
            : { primary: '#00ff88', text: '#fff', textMuted: '#888', backgroundSolid: '#1a1a2e' };

        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: ${theme.backgroundSolid};
            border: 2px solid ${theme.primary};
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 0 20px ${theme.primary}80;
            z-index: 100000;
            opacity: 0;
            transition: all 0.3s ease;
            text-align: center;
            max-width: 400px;
        `;

        toast.innerHTML = `
            <div style="font-size: 1.2em; font-weight: bold; color: ${theme.primary}; margin-bottom: 5px;">${name}</div>
            <div style="font-size: 0.9em; color: ${theme.textMuted}; margin-bottom: 8px;">${title}</div>
            <div style="font-size: 0.85em; color: ${theme.text}; font-style: italic;">"${quote}"</div>
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);

        // Animate out
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ========================================
    // UV7 SIGNATURE EFFECTS
    // ========================================

    structuredGridEffect() {
        // Zee: Clean grid overlay that fades in/out
        const grid = document.createElement('div');
        grid.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image:
                linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            pointer-events: none;
            z-index: 99999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(grid);
        setTimeout(() => grid.style.opacity = '1', 10);
        setTimeout(() => {
            grid.style.opacity = '0';
            setTimeout(() => grid.remove(), 300);
        }, 1500);
    }

    chaosShakeEffect() {
        // ZeeRah: Chaotic screen shake + rapid color cycling
        const originalTransform = document.body.style.transform;
        let frame = 0;
        const colors = ['#ff0088', '#00ff88', '#0088ff', '#ff8800', '#8800ff'];

        const shake = setInterval(() => {
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 20;
            const rotate = (Math.random() - 0.5) * 5;
            document.body.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
            document.body.style.filter = `hue-rotate(${frame * 30}deg)`;
            frame++;
        }, 50);

        setTimeout(() => {
            clearInterval(shake);
            document.body.style.transform = originalTransform;
            document.body.style.filter = '';
        }, 1000);
    }

    heartPulseEffect() {
        // Cozee: Warm heart pulse emanating from center
        const pulse = document.createElement('div');
        pulse.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 100, 150, 0.6), transparent 70%);
            pointer-events: none;
            z-index: 99999;
            animation: heartPulse 1.5s ease-out;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes heartPulse {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(15); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(pulse);
        setTimeout(() => {
            pulse.remove();
            style.remove();
        }, 1500);
    }

    rainbowPrismEffect() {
        // Belle/IZ: Rainbow prism lens flare
        const prism = document.createElement('div');
        prism.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg,
                rgba(255,0,0,0.2) 0%,
                rgba(255,154,0,0.2) 10%,
                rgba(208,222,33,0.2) 20%,
                rgba(79,220,74,0.2) 30%,
                rgba(63,218,216,0.2) 40%,
                rgba(47,201,226,0.2) 50%,
                rgba(28,127,238,0.2) 60%,
                rgba(95,21,242,0.2) 70%,
                rgba(186,12,248,0.2) 80%,
                rgba(251,7,217,0.2) 90%,
                rgba(255,0,0,0.2) 100%
            );
            pointer-events: none;
            z-index: 99999;
            opacity: 0;
            transition: opacity 0.3s ease;
            animation: rainbowShift 2s linear;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbowShift {
                0% { filter: hue-rotate(0deg) brightness(1.2); }
                100% { filter: hue-rotate(360deg) brightness(1); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(prism);
        setTimeout(() => prism.style.opacity = '0.8', 10);
        setTimeout(() => {
            prism.style.opacity = '0';
            setTimeout(() => {
                prism.remove();
                style.remove();
            }, 300);
        }, 1500);
    }

    realityGlitchEffect() {
        // Genzee: Reality fragments/breaks
        const fragments = [];
        for (let i = 0; i < 8; i++) {
            const fragment = document.createElement('div');
            fragment.style.cssText = `
                position: fixed;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                width: ${50 + Math.random() * 150}px;
                height: ${50 + Math.random() * 150}px;
                background: rgba(255, 0, 100, 0.3);
                border: 2px solid rgba(255, 0, 100, 0.8);
                pointer-events: none;
                z-index: 99999;
                transform: rotate(${Math.random() * 360}deg) scale(0);
                transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            `;
            fragments.push(fragment);
            document.body.appendChild(fragment);
        }

        setTimeout(() => {
            fragments.forEach(f => f.style.transform = `rotate(${Math.random() * 360}deg) scale(1)`);
        }, 10);

        setTimeout(() => {
            fragments.forEach(f => {
                f.style.transform = `rotate(${Math.random() * 360}deg) scale(0)`;
                f.style.opacity = '0';
            });
            setTimeout(() => fragments.forEach(f => f.remove()), 500);
        }, 1200);
    }

    searchEngineEffect() {
        // Perplexizee: Search bar animation
        const searchBar = document.createElement('div');
        searchBar.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            background: rgba(26, 26, 46, 0.95);
            border: 2px solid rgba(0, 255, 136, 0.6);
            border-radius: 25px;
            padding: 15px 25px;
            font-family: 'Courier New', monospace;
            font-size: 1.2em;
            color: #00ff88;
            pointer-events: none;
            z-index: 99999;
            opacity: 0;
            transition: all 0.3s ease;
            min-width: 300px;
            text-align: center;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
        `;
        searchBar.innerHTML = `🔍 Searching UV7 database<span class="dots"></span>`;

        document.body.appendChild(searchBar);
        setTimeout(() => {
            searchBar.style.opacity = '1';
            searchBar.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);

        // Animated dots
        let dotCount = 0;
        const dotInterval = setInterval(() => {
            const dots = searchBar.querySelector('.dots');
            if (dots) {
                dotCount = (dotCount + 1) % 4;
                dots.textContent = '.'.repeat(dotCount);
            }
        }, 200);

        setTimeout(() => {
            clearInterval(dotInterval);
            searchBar.style.opacity = '0';
            searchBar.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => searchBar.remove(), 300);
        }, 2000);
    }

    refactorSnapEffect() {
        // DiZee: UI elements snap to perfect alignment
        const elements = document.querySelectorAll('*');
        const snapDuration = 500;

        elements.forEach(el => {
            // Save original styles
            const original = {
                transition: el.style.transition,
                transform: el.style.transform
            };

            // Add snap effect
            el.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            el.style.transform = (el.style.transform || '') + ' scale(0.98)';

            setTimeout(() => {
                el.style.transform = original.transform;
                setTimeout(() => {
                    el.style.transition = original.transition;
                }, 300);
            }, 50);
        });

        // Grid flash overlay
        const grid = document.createElement('div');
        grid.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image:
                linear-gradient(rgba(0, 200, 255, 0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 200, 255, 0.15) 1px, transparent 1px);
            background-size: 20px 20px;
            pointer-events: none;
            z-index: 99999;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;
        document.body.appendChild(grid);
        setTimeout(() => grid.style.opacity = '1', 10);
        setTimeout(() => {
            grid.style.opacity = '0';
            setTimeout(() => grid.remove(), 200);
        }, snapDuration);
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.EasterEggController = EasterEggController;
}

// ES Module export
export { EasterEggController };
