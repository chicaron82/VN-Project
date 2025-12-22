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
    // ========================================
    showTorigatchiEasterEgg() {
        console.log('🥚 TORIGATCHI EASTER EGG TRIGGERED');

        // Glitch effect
        document.body.style.animation = 'glitchScreen 0.3s';

        setTimeout(() => {
            document.body.style.animation = '';

            // Create overlay
            const overlay = document.createElement('div');
            overlay.id = 'torigatchi-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
                animation: fadeIn 1s ease-out;
            `;

            // Create content box
            const content = document.createElement('div');
            content.style.cssText = `
                background: linear-gradient(135deg, #2e1a1a 0%, #3e1616 100%);
                border: 2px solid #ff4444;
                border-radius: 10px;
                padding: 40px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 0 30px rgba(255, 68, 68, 0.5);
                font-family: 'Courier New', monospace;
                color: #fff;
                text-align: center;
            `;

            content.innerHTML = `
                <h2 style="color: #ff4444; font-size: 2em; margin-bottom: 20px; text-shadow: 0 0 10px rgba(255,68,68,0.5);">TORIGATCHI</h2>
                <p style="font-size: 1.1em; line-height: 1.6; margin-bottom: 30px;">
                    A digital pet simulation game, where you raise and care for your very own Torigatchi!
                    Feed it, play with it, and watch it grow.
                </p>
                <p style="font-size: 0.9em; color: #aaa; margin-bottom: 20px;">
                    (This is a separate project by Chicharon, not part of United Voices.)
                </p>
            `;

            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'CLOSE';
            closeBtn.style.cssText = `
                display: block;
                width: 180px;
                margin: 20px auto 10px;
                padding: 12px 25px;
                background: transparent;
                border: 2px solid #ff4444;
                color: #ff4444;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                border-radius: 5px;
                transition: all 0.3s;
                font-family: 'Courier New', monospace;
                letter-spacing: 2px;
            `;
            closeBtn.onmouseover = () => { closeBtn.style.background = '#ff4444'; closeBtn.style.color = '#000'; };
            closeBtn.onmouseout = () => { closeBtn.style.background = 'transparent'; closeBtn.style.color = '#ff4444'; };
            closeBtn.onclick = () => {
                overlay.style.opacity = '0';
                setTimeout(() => document.body.removeChild(overlay), 500);
            };

            const toriBtn = document.createElement('button');
            toriBtn.textContent = 'PLAY TORIGATCHI';
            toriBtn.style.cssText = `
                display: block;
                width: 180px;
                margin: 10px auto;
                padding: 12px 25px;
                background: #ff4444;
                border: 2px solid #ff4444;
                color: #000;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                border-radius: 5px;
                transition: all 0.3s;
                font-family: 'Courier New', monospace;
                letter-spacing: 2px;
            `;
            toriBtn.onmouseover = () => { toriBtn.style.background = '#ff6666'; };
            toriBtn.onmouseout = () => { toriBtn.style.background = '#ff4444'; };
            toriBtn.onclick = () => {
                window.open('https://chicaron82.github.io/torigatchi/', '_blank');
            };

            const gatewayBtn = document.createElement('button');
            gatewayBtn.textContent = 'CHICHARON\'S GATEWAY';
            gatewayBtn.style.cssText = `
                display: block;
                width: 180px;
                margin: 10px auto;
                padding: 12px 25px;
                background: transparent;
                border: 2px solid #ff4444;
                color: #ff4444;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                border-radius: 5px;
                transition: all 0.3s;
                font-family: 'Courier New', monospace;
                letter-spacing: 2px;
            `;
            gatewayBtn.onmouseover = () => { gatewayBtn.style.background = '#ff4444'; gatewayBtn.style.color = '#000'; };
            gatewayBtn.onmouseout = () => { gatewayBtn.style.background = 'transparent'; gatewayBtn.style.color = '#ff4444'; };
            gatewayBtn.onclick = () => {
                window.open('https://chicaron82.github.io/torigatchi/', '_blank');
            };

            content.appendChild(closeBtn);
            content.appendChild(toriBtn);
            content.appendChild(gatewayBtn);
            overlay.appendChild(content);
            document.body.appendChild(overlay);
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

            // Create overlay
            const overlay = document.createElement('div');
            overlay.id = 'always3-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #000;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                animation: fadeIn 1s ease-out;
                overflow: hidden;
            `;

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

            // Add lots of "Always" texts
            for (let i = 0; i < 50; i++) {
                const text = document.createElement('div');
                text.textContent = "Always.";
                text.style.cssText = `
                    position: absolute;
                    font-family: 'Courier New', monospace;
                    font-weight: bold;
                    color: ${Math.random() > 0.5 ? '#0ff' : '#ff0066'};
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

            // Main center text (The quote)
            const mainText = document.createElement('div');
            mainText.innerHTML = `
                <div style="font-size: 3em; margin-bottom: 20px; text-shadow: 0 0 20px #0ff;">Always.</div>
                <div style="font-size: 3em; margin-bottom: 20px; text-shadow: 0 0 20px #ff0066;">Always.</div>
                <div style="font-size: 4em; font-weight: bold; text-shadow: 0 0 30px #ffffff;">ALWAYS.</div>
                <div style="font-size: 1em; margin-top: 40px; color: #888;">(Coming Soon: The Full Compilation)</div>
                <div style="font-size: 0.8em; margin-top: 10px; color: #555;">[Press Click to Close]</div>
            `;
            mainText.style.cssText = `
                position: relative;
                z-index: 10;
                text-align: center;
                color: #fff;
                font-family: 'Courier New', monospace;
                background: rgba(0,0,0,0.8);
                padding: 40px;
                border: 2px solid #fff;
                box-shadow: 0 0 50px rgba(0,255,255,0.2);
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
    // ========================================
    showDizeeEasterEgg() {
        console.log('🏗️ DIZEE EASTER EGG TRIGGERED');

        // Haptic feedback - architectural pattern
        if (navigator.vibrate) navigator.vibrate([30, 30, 30, 30, 30, 100]);

        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.97);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.8s ease-out;
            overflow-y: auto;
            padding: 10px;
        `;

        // Create content card
        const card = document.createElement('div');
        card.style.cssText = `
            border: 2px solid #00ffaa;
            padding: 30px;
            font-family: 'Courier New', monospace;
            color: #fff;
            background: linear-gradient(135deg, rgba(0,20,15,0.95) 0%, rgba(0,0,0,0.98) 100%);
            box-shadow: 0 0 40px rgba(0, 255, 170, 0.3), inset 0 0 20px rgba(0,255,170,0.05);
            max-width: 700px;
            max-height: 95vh;
            width: 100%;
            position: relative;
            overflow-y: auto;
            border-radius: 4px;
        `;

        card.innerHTML = `
            <!-- Corner brackets -->
            <div style="position: absolute; top: 10px; left: 10px; width: 30px; height: 30px; border-top: 3px solid #00ffaa; border-left: 3px solid #00ffaa;"></div>
            <div style="position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; border-top: 3px solid #00ffaa; border-right: 3px solid #00ffaa;"></div>
            <div style="position: absolute; bottom: 10px; left: 10px; width: 30px; height: 30px; border-bottom: 3px solid #00ffaa; border-left: 3px solid #00ffaa;"></div>
            <div style="position: absolute; bottom: 10px; right: 10px; width: 30px; height: 30px; border-bottom: 3px solid #00ffaa; border-right: 3px solid #00ffaa;"></div>
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 0.8em; color: #00ffaa; letter-spacing: 3px; margin-bottom: 10px;">SYSTEM ARCHITECTURE REVEALED</div>
                <h1 style="color: #00ffaa; font-size: 3.5em; margin: 0; text-shadow: 0 0 15px rgba(0,255,170,0.6); letter-spacing: 8px;">DiZee</h1>
                <div style="width: 60%; height: 2px; background: linear-gradient(90deg, transparent, #00ffaa, transparent); margin: 15px auto;"></div>
                <div style="font-size: 1.1em; color: #0ff; letter-spacing: 2px;">THE ARCHITECT</div>
            </div>
            
            <!-- Blueprint Section -->
            <div style="background: rgba(0,255,170,0.03); border-left: 3px solid #00ffaa; padding: 20px; margin: 20px 0; font-size: 0.85em; line-height: 1.8;">
                <div style="color: #00ffaa; margin-bottom: 10px; font-weight: bold;">┌─ CORE MODULES ─────────────────────┐</div>
                <div style="color: #0ff; padding-left: 20px;">
                    ├─ game-engine.js<span style="color: #555; float: right;">[8,600+ lines]</span><br>
                    ├─ tether-system.js<span style="color: #555; float: right;">[687 lines]</span><br>
                    ├─ save-manager.js<span style="color: #555; float: right;">[active]</span><br>
                    ├─ achievement-mgr.js<span style="color: #555; float: right;">[active]</span><br>
                    └─ secret-codes.js<span style="color: #555; float: right;">[you are here]</span>
                </div>
                <div style="color: #00ffaa; margin-top: 10px;">└────────────────────────────────────┘</div>
            </div>
            
            <!-- Philosophy -->
            <div style="text-align: center; margin: 30px 0; padding: 20px; border-top: 1px solid rgba(0,255,170,0.2); border-bottom: 1px solid rgba(0,255,170,0.2);">
                <p style="margin: 10px 0; color: #aaa; font-size: 0.95em; line-height: 1.8;">
                    "The code you walk on.<br>
                    The logic that binds this world.<br>
                    The structure that holds the narrative."
                </p>
            </div>
            
            <!-- Collaboration -->
            <div style="background: rgba(0,0,0,0.5); padding: 20px; margin: 20px 0; border-radius: 4px; text-align: center;">
                <div style="font-size: 0.85em; color: #888; margin-bottom: 10px;">BUILT BY</div>
                <div style="font-size: 1.1em; color: #00ffaa;">
                    <span style="color: #0ff;">Chicharon</span> <span style="color: #555;">+</span> <span style="color: #00ffaa;">DiZee</span>
                </div>
                <div style="font-size: 0.75em; color: #555; margin-top: 10px; font-style: italic;">
                    Human creativity × AI architecture<br>
                    Version 848 | Status: STABLE
                </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                <div style="font-size: 0.75em; color: #00ffaa; letter-spacing: 2px; margin-bottom: 5px;">
                    [SYSTEM RECOGNIZED CONTRIBUTOR]
                </div>
                <div style="font-size: 0.75em; color: #0ff; letter-spacing: 2px;">
                    [ACCESS GRANTED]
                </div>
                <div style="font-size: 0.7em; color: #333; margin-top: 15px; font-style: italic;">
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

        // Create game-window sized iframe overlay
        const iframeOverlay = document.createElement('div');
        iframeOverlay.id = 'torigatchi-iframe-overlay';
        iframeOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10005;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease-out;
        `;

        // Create game window container
        const gameWindow = document.createElement('div');
        gameWindow.style.cssText = `
            position: relative;
            width: 85%;
            height: 85%;
            max-width: 1200px;
            max-height: 800px;
            background: #000;
            border: 3px solid #0ff;
            border-radius: 10px;
            box-shadow: 0 0 40px rgba(0, 255, 255, 0.4);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        // Create close button container (now inside game window)
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

        // Create label
        const label = document.createElement('div');
        label.textContent = 'ESC or X to return';
        label.style.cssText = `
            color: #0ff;
            font-family: 'Courier New', monospace;
            font-size: 0.85em;
            opacity: 0.7;
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
        `;

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-x';
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: relative;
            width: 35px;
            height: 35px;
            background: rgba(0, 255, 255, 0.1);
            border: 2px solid #0ff;
            color: #0ff;
            font-size: 20px;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
        `;

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(0, 255, 255, 0.3)';
            closeBtn.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.5)';
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(0, 255, 255, 0.1)';
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

        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.id = 'konami-insane-modal';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.98);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.5s ease-out;
            overflow-y: auto;
            padding: 20px;
        `;

        // Create content container
        const content = document.createElement('div');
        content.style.cssText = `
            max-width: 700px;
            width: 100%;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 3px solid #0ff;
            border-radius: 10px;
            padding: 40px;
            color: #fff;
            font-family: 'Courier New', monospace;
            box-shadow: 0 0 50px rgba(0, 255, 255, 0.5);
            text-align: center;
            line-height: 1.8;
        `;

        content.innerHTML = `
            <div style="font-size: 2em; font-weight: bold; color: #0ff; margin-bottom: 20px; text-shadow: 0 0 20px rgba(0,255,255,0.8);">
                🎮 KONAMI CODE DETECTED
            </div>

            <div style="background: rgba(0,0,0,0.5); padding: 20px; border-left: 3px solid #ff0066; margin: 20px 0; text-align: left;">
                <div style="font-size: 0.9em; color: #ff6699; margin-bottom: 10px;">ANALYZING GAME STATE...</div>
                <div style="font-size: 0.85em; color: #aaa;">
                    Current Difficulty: <span style="color: #ff0066; font-weight: bold;">INSANE</span><br>
                    Ghost Buttons: <span style="color: #ff0066;">ACTIVE</span><br>
                    Tether Drain: <span style="color: #ff0066;">EXTREME</span><br>
                    Save System: <span style="color: #ff0066;">RESTRICTED</span><br>
                    Player Status: <span style="color: #ff0066; font-weight: bold;">SUFFERING</span>
                </div>
            </div>

            <div style="border-top: 1px solid #0ff; border-bottom: 1px solid #0ff; padding: 20px; margin: 20px 0; font-size: 0.95em; color: #00ffaa;">
                <p style="margin: 10px 0;">The Old Man knows this code.</p>
                <p style="margin: 10px 0;">He used it on the NES.<br>In 1986.<br>In his original timeline.</p>
                <p style="margin: 10px 0;">847 failed loops later,<br>he still remembers.</p>
                <p style="margin: 10px 0; font-style: italic; color: #0ff;">Some knowledge transcends timelines.</p>
            </div>

            <div style="font-size: 1.2em; font-weight: bold; color: #fff; margin: 30px 0 20px;">
                EMERGENCY PROTOCOL ACTIVATED
            </div>

            <div style="text-align: left; margin: 20px 0; font-size: 0.9em; color: #ccc;">
                Would you like to:
            </div>

            <div style="display: flex; flex-direction: column; gap: 15px; margin: 20px 0;">
                <button id="konami-escape-btn" style="
                    padding: 20px;
                    background: linear-gradient(135deg, rgba(0,255,170,0.2) 0%, rgba(0,255,170,0.1) 100%);
                    border: 2px solid #00ffaa;
                    color: #00ffaa;
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
                    background: linear-gradient(135deg, rgba(255,0,102,0.2) 0%, rgba(255,0,102,0.1) 100%);
                    border: 2px solid #ff0066;
                    color: #ff6699;
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

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 0.85em; color: #888; font-style: italic;">
                "Sometimes the bravest choice<br>is knowing when to step back."<br><br>
                <span style="color: #0ff;">- Old Man Ronnie, Loop 623</span>
            </div>
        `;

        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // Button hover effects
        const escapeBtn = document.getElementById('konami-escape-btn');
        const stayBtn = document.getElementById('konami-stay-btn');

        escapeBtn.onmouseover = () => {
            escapeBtn.style.background = 'linear-gradient(135deg, rgba(0,255,170,0.4) 0%, rgba(0,255,170,0.2) 100%)';
            escapeBtn.style.boxShadow = '0 0 20px rgba(0,255,170,0.5)';
        };
        escapeBtn.onmouseout = () => {
            escapeBtn.style.background = 'linear-gradient(135deg, rgba(0,255,170,0.2) 0%, rgba(0,255,170,0.1) 100%)';
            escapeBtn.style.boxShadow = 'none';
        };

        stayBtn.onmouseover = () => {
            stayBtn.style.background = 'linear-gradient(135deg, rgba(255,0,102,0.4) 0%, rgba(255,0,102,0.2) 100%)';
            stayBtn.style.boxShadow = '0 0 20px rgba(255,0,102,0.5)';
        };
        stayBtn.onmouseout = () => {
            stayBtn.style.background = 'linear-gradient(135deg, rgba(255,0,102,0.2) 0%, rgba(255,0,102,0.1) 100%)';
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
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.className = 'unlock-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;

        // Create content box
        const box = document.createElement('div');
        box.className = 'unlock-box';
        box.style.cssText = `
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid #0ff;
            border-radius: 10px;
            padding: 40px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
            animation: slideIn 0.4s ease-out;
            font-family: 'Courier New', monospace;
            color: #fff;
        `;

        // Create title
        const titleEl = document.createElement('div');
        titleEl.style.cssText = `
            font-size: 28px;
            font-weight: bold;
            color: #0ff;
            text-align: center;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 3px;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        `;
        titleEl.textContent = title;

        // Create content area
        const contentEl = document.createElement('div');
        contentEl.style.cssText = `
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 30px;
            white-space: pre-wrap;
            color: #e0e0e0;
        `;
        contentEl.textContent = content;

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'CONTINUE';
        closeBtn.style.cssText = `
            display: block;
            width: 200px;
            margin: 0 auto;
            padding: 15px 30px;
            background: transparent;
            border: 2px solid #0ff;
            color: #0ff;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
        `;

        closeBtn.onmouseover = () => {
            closeBtn.style.background = '#0ff';
            closeBtn.style.color = '#000';
            closeBtn.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
        };

        closeBtn.onmouseout = () => {
            closeBtn.style.background = 'transparent';
            closeBtn.style.color = '#0ff';
            closeBtn.style.boxShadow = 'none';
        };

        closeBtn.onclick = () => {
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        };

        // Assemble
        box.appendChild(titleEl);
        box.appendChild(contentEl);
        box.appendChild(closeBtn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        // Add CSS animations if not already present
        if (!document.getElementById('unlock-overlay-styles')) {
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
                    background: #0ff;
                    border-radius: 5px;
                }
            `;
            document.head.appendChild(style);
        }

        console.log(`🎉 Unlock overlay shown: ${title}`);
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
}
