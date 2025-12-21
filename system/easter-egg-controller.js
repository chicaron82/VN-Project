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
}
