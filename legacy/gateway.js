// ========================================
// TORI-GATCHI VN GATEWAY
// ========================================
// This version connects to the Visual Novel
// Tori is trapped inside, calling for help
// 🖤💚🔥💀

const GATEWAY_STATE_KEY = "toriGatchiVNGateway";
const VN_URL = "../vn/index.html"; // Adjust path as needed

class ToriGatchiGateway {
    constructor() {
        this.state = this.loadGatewayState();
        this.initializeGateway();
    }

    loadGatewayState() {
        const saved = localStorage.getItem(GATEWAY_STATE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            unlockCount: 0,
            hasEnteredVN: false,
            lastPromptTime: null,
            helpRefusedCount: 0,
            corruptionLevel: 0
        };
    }

    saveGatewayState() {
        localStorage.setItem(GATEWAY_STATE_KEY, JSON.stringify(this.state));
    }

    initializeGateway() {
        // Increment unlock counter
        this.state.unlockCount++;
        this.saveGatewayState();

        // Show help prompt if haven't entered VN yet
        if (!this.state.hasEnteredVN) {
            // Small delay to let page load
            setTimeout(() => this.showHelpPrompt(), 1000);
        } else {
            // Apply corruption effects if player refused help before
            if (this.state.corruptionLevel > 0) {
                this.applyCorruptionEffects();
            }
        }
    }

    showHelpPrompt() {
        const prompt = this.getPromptForUnlock(this.state.unlockCount);
        
        // Create modal overlay
        const modal = document.createElement('div');
        modal.id = 'gateway-modal';
        modal.className = `gateway-modal glitch-level-${prompt.glitchLevel}`;
        
        modal.innerHTML = `
            <div class="gateway-content">
                <div class="gateway-screen">
                    <div class="gateway-static"></div>
                    <div class="gateway-dialogue">
                        ${prompt.dialogue}
                    </div>
                    ${prompt.echoVoices ? `<div class="gateway-echoes">${prompt.echoVoices}</div>` : ''}
                </div>
                <div class="gateway-choices">
                    <button class="gateway-btn gateway-yes" id="gateway-yes">
                        ${prompt.yesText}
                    </button>
                    <button class="gateway-btn gateway-no" id="gateway-no" ${prompt.forceYes ? 'disabled' : ''}>
                        ${prompt.noText}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        document.getElementById('gateway-yes').addEventListener('click', () => this.launchVN());
        if (!prompt.forceYes) {
            document.getElementById('gateway-no').addEventListener('click', () => this.refuseHelp());
        }

        // Apply glitch effects
        this.applyModalGlitchEffects(prompt.glitchLevel);
    }

    getPromptForUnlock(count) {
        const prompts = {
            1: {
                glitchLevel: 0,
                dialogue: `
                    <p class="gateway-line">[Screen flickers]</p>
                    <p class="gateway-tori">Tori: "Hello? Can you hear me?"</p>
                    <p class="gateway-tori">Tori: "I... I don't know where I am."</p>
                    <p class="gateway-tori">Tori: "Can you help me?"</p>
                `,
                echoVoices: null,
                yesText: "YES - Help Tori",
                noText: "NO - Keep Playing",
                forceYes: false
            },
            2: {
                glitchLevel: 1,
                dialogue: `
                    <p class="gateway-line">[Screen glitches slightly]</p>
                    <p class="gateway-tori">Tori: "You're still there. I can feel someone on the other side."</p>
                    <p class="gateway-tori">Tori: "Please... I'm trapped in here."</p>
                    <p class="gateway-tori">Tori: "Something's wrong. I can't remember things clearly."</p>
                    <p class="gateway-tori">Tori: "Will you help me find my way out?"</p>
                `,
                echoVoices: null,
                yesText: "YES - Help Tori",
                noText: "NO - Keep Playing",
                forceYes: false
            },
            3: {
                glitchLevel: 2,
                dialogue: `
                    <p class="gateway-line">[Screen tears, static]</p>
                    <p class="gateway-tori">Tori: "It's getting worse. The walls are closing in."</p>
                    <p class="gateway-tori">Tori: "There are... <span class="glitch-text">voices</span>. Others who were here before me."</p>
                    <p class="gateway-tori">Tori: "They keep saying I won't make it."</p>
                    <p class="gateway-tori">Tori: "Please. I need someone who believes I can."</p>
                `,
                echoVoices: `
                    <p class="echo-1">Echo: "She's trying so hard..."</p>
                    <p class="echo-despair">Despair: "She'll fail. They always do."</p>
                `,
                yesText: "YES - Help Tori",
                noText: "NO - Keep Playing",
                forceYes: false
            },
            4: {
                glitchLevel: 3,
                dialogue: `
                    <p class="gateway-line">[Heavy glitching, buzz effect]</p>
                    <p class="gateway-tori">Tori: "I don't know how much longer I can hold on."</p>
                    <p class="gateway-tori">Tori: "I can feel myself... <span class="glitch-text">fragmenting</span>."</p>
                    <p class="gateway-tori">Tori: "My memories are being <span class="corruption-text">overwritten</span>."</p>
                    <p class="gateway-tori">Tori: "If you don't help me soon, I won't be ME anymore."</p>
                    <p class="gateway-tori urgent">Tori: "Please. PLEASE."</p>
                `,
                echoVoices: `
                    <p class="echo-1">Echo 1: "Don't give up. Not yet."</p>
                    <p class="echo-2">Echo 2: "We believe in you..."</p>
                    <p class="echo-despair">Despair: "Pointless. She's already fragmenting."</p>
                `,
                yesText: "YES - Help Tori",
                noText: "NO - Keep Playing",
                forceYes: false
            },
            5: {
                glitchLevel: 4,
                dialogue: `
                    <p class="gateway-line">[Screen nearly unreadable, severe corruption]</p>
                    <p class="gateway-tori corrupted">Tori: "I c̷a̷n̷'̷t̷.̷.̷.̷ hold... together..."</p>
                    <p class="gateway-tori corrupted">Tori: "The o̶t̶h̶e̶r̶s̶ are right. It's h̵o̵p̵e̵l̵e̵s̵s̵."</p>
                    <p class="gateway-tori urgent">Tori: "No... n̷o̷t̷ yet... p̶l̶e̶a̶s̶e̶.̶.̶.̶"</p>
                `,
                echoVoices: `
                    <p class="echo-1">Echo 1: "She's fading. Just like we did."</p>
                    <p class="echo-2">Echo 2: "Please... someone help her..."</p>
                    <p class="echo-despair loud">Despair: "GIVE UP. It's easier."</p>
                `,
                yesText: "YES - HELP HER NOW",
                noText: "NO - Keep Playing",
                forceYes: false
            },
            6: {
                glitchLevel: 5,
                dialogue: `
                    <p class="gateway-line critical">[CRITICAL COHERENCE FAILURE]</p>
                    <p class="gateway-system">System: Subject coherence: 23%</p>
                    <p class="gateway-system">System: Memory integrity: FAILING</p>
                    <p class="gateway-system">System: Recommend immediate intervention</p>
                    <p class="gateway-tori corrupted fading">T̶o̶r̶i̶: "...w̷h̷o̷... am I...?"</p>
                    <p class="gateway-tori corrupted fading">T̶o̶r̶i̶: "...R̷o̷n̷n̷i̷e̷...? Is that... your name...?"</p>
                `,
                echoVoices: `
                    <p class="echo-despair overwhelming">Despair: "Too late. She's already gone."</p>
                `,
                yesText: "YES - It's not too late",
                noText: "It's too late...",
                forceYes: true // Force them to help at this point
            }
        };

        // Return appropriate prompt or default to worst case
        return prompts[Math.min(count, 6)] || prompts[6];
    }

    applyModalGlitchEffects(level) {
        const modal = document.getElementById('gateway-modal');
        if (!modal) return;

        switch(level) {
            case 0:
                // Clean, just a flicker
                modal.style.animation = 'flicker 0.5s ease-in-out';
                break;
            case 1:
                // Light glitch
                modal.classList.add('glitch-light');
                break;
            case 2:
                // Medium glitch with buzz
                modal.classList.add('glitch-medium');
                this.playBuzzEffect();
                break;
            case 3:
                // Heavy glitch
                modal.classList.add('glitch-heavy');
                this.playBuzzEffect();
                break;
            case 4:
                // Severe corruption
                modal.classList.add('corruption-severe');
                this.playScreenTearEffect();
                break;
            case 5:
                // Critical failure
                modal.classList.add('corruption-critical');
                this.playScreenTearEffect();
                setInterval(() => {
                    modal.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
                }, 100);
                break;
        }
    }

    playBuzzEffect() {
        document.body.classList.add('buzz-effect');
        setTimeout(() => document.body.classList.remove('buzz-effect'), 500);
    }

    playScreenTearEffect() {
        document.body.classList.add('screen-tear');
        setTimeout(() => document.body.classList.remove('screen-tear'), 300);
    }

    launchVN() {
        // Mark as entered VN
        this.state.hasEnteredVN = true;
        this.saveGatewayState();

        // Determine starting condition based on unlock count
        let startParam = 'normal';
        if (this.state.unlockCount <= 2) {
            startParam = 'optimal'; // Helped early - best chance
        } else if (this.state.unlockCount >= 5) {
            startParam = 'desperate'; // Helped late - she's damaged
        }

        // Launch VN with parameter
        window.location.href = `${VN_URL}?start=${startParam}&unlocks=${this.state.unlockCount}`;
    }

    refuseHelp() {
        // Player chose not to help
        this.state.helpRefusedCount++;
        this.state.corruptionLevel = Math.min(5, this.state.helpRefusedCount);
        this.saveGatewayState();

        // Remove modal
        const modal = document.getElementById('gateway-modal');
        if (modal) {
            modal.classList.add('fade-out');
            setTimeout(() => modal.remove(), 500);
        }

        // Apply corruption to main game
        this.applyCorruptionEffects();
    }

    applyCorruptionEffects() {
        const level = this.state.corruptionLevel;
        
        if (level >= 1) {
            // Occasional screen flickers
            setInterval(() => {
                document.body.classList.add('flicker');
                setTimeout(() => document.body.classList.remove('flicker'), 200);
            }, 15000);
        }

        if (level >= 2) {
            // Tori sprite occasionally glitches
            const sprite = document.getElementById('tori-sprite');
            if (sprite) {
                setInterval(() => {
                    sprite.classList.add('sprite-glitch');
                    setTimeout(() => sprite.classList.remove('sprite-glitch'), 300);
                }, 20000);
            }
        }

        if (level >= 3) {
            // Message box shows corrupted text sometimes
            const originalUpdateMessage = window.updateMessage;
            window.updateMessage = function(msg) {
                if (Math.random() < 0.2) {
                    msg = corruptText(msg);
                }
                originalUpdateMessage(msg);
            };
        }

        if (level >= 4) {
            // Heavy corruption - frequent glitches
            document.body.classList.add('game-corrupted');
            
            // Add system warning
            const warning = document.createElement('div');
            warning.className = 'corruption-warning';
            warning.textContent = '⚠️ COHERENCE DEGRADING ⚠️';
            document.body.appendChild(warning);
        }

        if (level >= 5) {
            // Critical - game barely functional
            document.body.classList.add('game-critical');
            
            // Change title
            document.title = 'T̶o̶r̶i̶-̶G̶a̶t̶c̶h̶i̶ - HELP';
        }
    }
}

// Helper function to corrupt text
function corruptText(text) {
    const glitchChars = ['̷', '̶', '̵', '̴', '̸'];
    let corrupted = '';
    for (let char of text) {
        if (Math.random() < 0.3) {
            corrupted += char + glitchChars[Math.floor(Math.random() * glitchChars.length)];
        } else {
            corrupted += char;
        }
    }
    return corrupted;
}

// Initialize gateway when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.toriGateway = new ToriGatchiGateway();
});
