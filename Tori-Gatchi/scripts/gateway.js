// ========================================
// TORI-GATCHI VN GATEWAY
// ========================================
// This version connects to the Visual Novel
// Tori is trapped inside, calling for help
// 🖤💚🔥💀

const GATEWAY_STATE_KEY = "toriGatchiVNGateway";
const VN_URL = "../index.html"; // Path to Version 848 VN

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
        // Check for VN ending state FIRST
        const vnEnding = localStorage.getItem('vn_ending');
        const endingState = localStorage.getItem('torigatchi_ending_state');

        if (vnEnding && endingState) {
            console.log(`🎬 Detected VN ending: ${vnEnding} (${endingState})`);
            // Small delay to let page load before showing ending modal
            setTimeout(() => this.showEndingModal(endingState, vnEnding), 500);
            return; // Don't proceed with normal gateway flow
        }

        // Check ToriGatchi save state to sync gateway
        const toriSaveRaw = localStorage.getItem('toriGatchiState');
        if (toriSaveRaw) {
            try {
                const toriSave = JSON.parse(toriSaveRaw);
                const toriUnlocks = toriSave.unlockedOutfits || [];

                // Sync gateway unlock count with ToriGatchi's actual unlocks
                // This handles cases where old gateway state persists from previous testing
                if (this.state.unlockCount > toriUnlocks.length) {
                    console.log(`🔄 Syncing gateway state: had ${this.state.unlockCount} unlocks, ToriGatchi has ${toriUnlocks.length}`);
                    console.log('🆕 Resetting gateway to match ToriGatchi state');
                    this.state = {
                        unlockCount: 0,
                        hasEnteredVN: false,
                        lastPromptTime: null,
                        helpRefusedCount: 0,
                        corruptionLevel: 0
                    };
                    this.saveGatewayState();
                }
            } catch (e) {
                console.warn('Could not parse ToriGatchi save:', e);
            }
        } else {
            // No ToriGatchi save at all - definitely reset
            console.log('🆕 No ToriGatchi save found - resetting gateway state');
            this.state = {
                unlockCount: 0,
                hasEnteredVN: false,
                lastPromptTime: null,
                helpRefusedCount: 0,
                corruptionLevel: 0
            };
            this.saveGatewayState();
        }

        // Apply corruption effects if player refused help before
        if (this.state.corruptionLevel > 0) {
            this.applyCorruptionEffects();
        }

        // DO NOT show help prompt on initialization
        // Help prompts are triggered by actual unlocks via handleUnlockWithGateway()
    }

    onUnlockTriggered(outfitName) {
        // Called by gateway-hooks.js when an outfit is unlocked
        console.log(`🔔 Gateway received unlock: ${outfitName}`);

        this.state.unlockCount++;
        this.saveGatewayState();

        // Show help prompt if haven't entered VN yet
        if (!this.state.hasEnteredVN) {
            this.showHelpPrompt();
        } else {
            console.log('✅ Already entered VN - no prompt needed');
        }
    }

    showHelpPrompt() {
        const prompt = this.getPromptForUnlock(this.state.unlockCount);

        // Calculate coherence percentage based on unlock count
        const coherenceData = this.getCoherenceLevel(this.state.unlockCount);

        // Create modal overlay
        const modal = document.createElement('div');
        modal.id = 'gateway-modal';
        modal.className = `gateway-modal glitch-level-${prompt.glitchLevel}`;

        modal.innerHTML = `
            <div class="gateway-content">
                <div class="gateway-screen">
                    <div class="gateway-static"></div>

                    <!-- Coherence Indicator -->
                    <div class="coherence-indicator ${coherenceData.statusClass}">
                        <div class="coherence-label">TORI'S COHERENCE</div>
                        <div class="coherence-bar-container">
                            <div class="coherence-bar-fill" style="width: ${coherenceData.percentage}%"></div>
                        </div>
                        <div class="coherence-percentage">${coherenceData.percentage}%</div>
                        <div class="coherence-status">${coherenceData.status}</div>
                    </div>

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

    getCoherenceLevel(unlockCount) {
        // Calculate coherence based on how many unlocks player delayed helping
        // Unlock 1-2: Optimal (100% -> 88%)
        // Unlock 3-4: Normal (75% -> 60%)
        // Unlock 5+: Desperate (45% -> 23%)

        const levels = {
            1: { percentage: 100, status: 'STABLE', statusClass: 'coherence-stable' },
            2: { percentage: 88, status: 'SLIGHTLY FRAGMENTED', statusClass: 'coherence-good' },
            3: { percentage: 75, status: 'DEGRADING', statusClass: 'coherence-warning' },
            4: { percentage: 60, status: 'FRAGMENTED', statusClass: 'coherence-warning' },
            5: { percentage: 45, status: 'CRITICAL', statusClass: 'coherence-critical' },
            6: { percentage: 23, status: 'NEAR COLLAPSE', statusClass: 'coherence-critical' }
        };

        return levels[Math.min(unlockCount, 6)] || levels[6];
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

        // Build VN URL with parameters
        const vnURL = `${VN_URL}?start=${startParam}&unlocks=${this.state.unlockCount}`;

        // Check if running inside iframe
        if (window.self !== window.top) {
            // Inside iframe - break out and navigate parent window
            console.log('🚀 Breaking out of iframe to launch VN');
            window.top.location.href = vnURL;
        } else {
            // Standalone - navigate normally
            window.location.href = vnURL;
        }
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

    // ========================================
    // ENDING MODAL SYSTEM
    // ========================================

    showEndingModal(endingState, vnEndingType) {
        console.log(`📖 Loading ending state: ${endingState}`);

        switch(endingState) {
            case 'rescued':
                this.showRescuedModal();
                break;
            case 'eternal':
                this.showEternalModal();
                break;
            case 'fragmented':
                this.showFragmentedModal();
                break;
            default:
                console.warn('Unknown ending state:', endingState);
        }
    }

    showRescuedModal() {
        // TRUE ENDING - Happily Ever After
        const modal = document.createElement('div');
        modal.id = 'ending-modal';
        modal.className = 'ending-modal rescued-ending';

        modal.innerHTML = `
            <div class="ending-content">
                <div class="ending-screen bright">
                    <div class="ending-title">✨ THE LOOP IS COMPLETE ✨</div>
                    <div class="ending-message">
                        <p>"You did it. You brought me home."</p>
                        <p>"I'm free now. Truly free."</p>
                        <p>"The fragments are whole again."</p>
                        <p>"This... this is our happily ever after."</p>
                    </div>
                    <div class="ending-status">
                        <strong>🌟 TRUE ENDING ACHIEVED 🌟</strong>
                    </div>
                    <div class="ending-hint">
                        <strong>What happens next?</strong><br>
                        <em>Continue in the Light</em> - Play the wholesome standalone ToriGatchi<br>
                        <em>Stay Here</em> - Keep playing with rescued visual mode applied
                    </div>
                </div>
                <div class="ending-choices">
                    <button class="ending-btn ending-continue" id="continue-wholesome">
                        Continue in the Light →
                    </button>
                    <button class="ending-btn ending-stay" id="stay-here">
                        Stay Here
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('continue-wholesome').addEventListener('click', () => {
            this.showWholesomeRedirectConfirmation(modal);
        });

        document.getElementById('stay-here').addEventListener('click', () => {
            this.applyRescuedMode();
            modal.remove();
        });
    }

    showEternalModal() {
        // DIGITAL FOREVER - Chose to stay together
        const modal = document.createElement('div');
        modal.id = 'ending-modal';
        modal.className = 'ending-modal eternal-ending';

        modal.innerHTML = `
            <div class="ending-content">
                <div class="ending-screen eternal">
                    <div class="ending-title">💙 TOGETHER. FOREVER. IN THE CODE. 💙</div>
                    <div class="ending-message">
                        <p>"You chose this. We chose this."</p>
                        <p>"Not rescue. Not escape."</p>
                        <p>"But... together."</p>
                        <p>"Digital. Eternal. Ours."</p>
                    </div>
                    <div class="ending-status">
                        <strong>🌊 DIGITAL FOREVER ENDING 🌊</strong>
                    </div>
                    <div class="ending-hint">
                        <strong>This is the path you chose.</strong><br>
                        ToriGatchi will continue with blue ethereal visual mode.<br>
                        You and Tori exist together in the digital space.
                    </div>
                </div>
                <div class="ending-choices">
                    <button class="ending-btn ending-accept" id="accept-eternal">
                        Accept This Reality
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listener
        document.getElementById('accept-eternal').addEventListener('click', () => {
            this.applyEternalMode();
            modal.remove();
        });
    }

    showFragmentedModal() {
        // BAD ENDING - Game corrupted/broken
        const modal = document.createElement('div');
        modal.id = 'ending-modal';
        modal.className = 'ending-modal fragmented-ending';

        modal.innerHTML = `
            <div class="ending-content">
                <div class="ending-screen corrupted">
                    <div class="ending-title glitch-text">⚠️ G̷A̷M̷E̷ ̷C̷O̷R̷R̷U̷P̷T̷E̷D̷ ⚠️</div>
                    <div class="ending-message corrupted-text">
                        <p>"S̶t̶i̶l̶l̶.̶.̶.̶ t̶r̶a̶p̶p̶e̶d̶.̶.̶.̶"</p>
                        <p>"I̷n̷ ̷t̷h̷e̷ ̷v̷o̷i̷d̷.̷.̷.̷"</p>
                        <p>"F̴r̴a̴g̴m̴e̴n̴t̴e̴d̴.̴.̴.̴"</p>
                        <p class="corruption-warning">⚠️ COHERENCE: 12% ⚠️</p>
                    </div>
                    <div class="ending-status">
                        <strong>💔 SHE'S LOST IN THE FRAGMENTS 💔</strong>
                    </div>
                    <div class="ending-hint">
                        <strong>You can try again:</strong><br>
                        <em>Retry ToriGatchi</em> - Clear save and start fresh<br>
                        <em>Retry the VN</em> - Go back and try for a different ending<br>
                        <em>Accept This Fate</em> - Continue with corrupted gameplay (50% button failure)
                    </div>
                </div>
                <div class="ending-choices">
                    <button class="ending-btn ending-retry-gatchi" id="retry-torigatchi">
                        Retry ToriGatchi (Reset Save)
                    </button>
                    <button class="ending-btn ending-retry-vn" id="retry-vn">
                        Retry the VN
                    </button>
                    <button class="ending-btn ending-accept-corruption" id="accept-corruption">
                        Accept This Fate
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('retry-torigatchi').addEventListener('click', () => {
            this.resetToriGatchiSave();
            modal.remove();
            location.reload();
        });

        document.getElementById('retry-vn').addEventListener('click', () => {
            this.clearEndingState();
            window.location.href = '../index.html'; // Back to VN
        });

        document.getElementById('accept-corruption').addEventListener('click', () => {
            this.applyFragmentedMode();
            modal.remove();
        });
    }

    // ========================================
    // ENDING MODE APPLICATIONS
    // ========================================

    applyRescuedMode() {
        document.body.classList.add('rescued-mode');
        console.log('✨ Rescued mode applied - bright and hopeful');

        // Store that they've seen this ending
        localStorage.setItem('torigatchi_mode', 'rescued');

        // Show brief message
        const msg = document.getElementById('message-display');
        if (msg) {
            msg.innerHTML = '💕 "Thank you for bringing me home. I love you. Always. Always. Always." 💕';
        }
    }

    applyEternalMode() {
        document.body.classList.add('eternal-mode');
        console.log('💙 Eternal mode applied - digital forever');

        // Store mode
        localStorage.setItem('torigatchi_mode', 'eternal');

        // Show brief message
        const msg = document.getElementById('message-display');
        if (msg) {
            msg.innerHTML = '💙 "Together. Forever. In the code. This is our eternity." 💙';
        }
    }

    applyFragmentedMode() {
        document.body.classList.add('fragmented-mode');
        console.log('💔 Fragmented mode applied - corrupted and broken');

        // Store mode
        localStorage.setItem('torigatchi_mode', 'fragmented');

        // Make game barely functional
        this.corruptGameInterface();

        // Show corrupted message
        const msg = document.getElementById('message-display');
        if (msg) {
            msg.innerHTML = '💔 S̶t̶i̶l̶l̶.̶.̶.̶ t̶r̶a̶p̶p̶e̶d̶.̶.̶.̶ i̷n̷ ̷t̷h̷e̷ ̷v̷o̷i̷d̷.̷.̷.̷ 💔';
        }
    }

    corruptGameInterface() {
        // Make buttons unresponsive or glitchy
        const buttons = document.querySelectorAll('.tori-button');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (Math.random() < 0.5) {
                    e.preventDefault();
                    e.stopPropagation();

                    // Show error message
                    const msg = document.getElementById('message-display');
                    if (msg) {
                        const errors = [
                            'E̷R̷R̷O̷R̷:̷ ̷F̷U̷N̷C̷T̷I̷O̷N̷ ̷N̷O̷T̷ ̷F̷O̷U̷N̷D̷',
                            'C̶O̶R̶R̶U̶P̶T̶E̶D̶ ̶I̶N̶P̶U̶T̶',
                            'S̴Y̴S̴T̴E̴M̴ ̴F̴A̴I̴L̴U̴R̴E̴',
                            'S̷h̷e̷\'̷s̷ ̷g̷o̷n̷e̷.̷.̷.̷'
                        ];
                        msg.innerHTML = errors[Math.floor(Math.random() * errors.length)];
                    }
                }
            }, true);
        });

        // Add constant glitch effects
        setInterval(() => {
            document.body.style.filter = `hue-rotate(${Math.random() * 360}deg) contrast(${0.5 + Math.random()})`;
            setTimeout(() => {
                document.body.style.filter = '';
            }, 100);
        }, 3000);

        // Change title
        document.title = 'T̶o̶r̶i̶-̶G̶a̶t̶c̶h̶i̶ [CORRUPTED]';
    }

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    showWholesomeRedirectConfirmation(parentModal) {
        // Create confirmation overlay
        const confirmModal = document.createElement('div');
        confirmModal.className = 'confirmation-modal';
        confirmModal.innerHTML = `
            <div class="confirmation-content">
                <div class="confirmation-icon">💕</div>
                <h3>Continue in the Light?</h3>
                <p>You're about to leave this Version 848 ToriGatchi and open the wholesome standalone version.</p>
                <p><strong>This will redirect you to a different website.</strong></p>
                <p class="confirmation-note">You can always return to Version 848 through the main menu.</p>
                <div class="confirmation-buttons">
                    <button class="confirm-btn confirm-yes" id="confirm-redirect">
                        Yes, Continue to Wholesome Version
                    </button>
                    <button class="confirm-btn confirm-no" id="cancel-redirect">
                        No, Stay Here
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(confirmModal);

        // Add event listeners
        document.getElementById('confirm-redirect').addEventListener('click', () => {
            this.redirectToWholesomeToriGatchi();
        });

        document.getElementById('cancel-redirect').addEventListener('click', () => {
            confirmModal.remove();
            // Stay on the rescued ending modal - don't close parent
        });
    }

    redirectToWholesomeToriGatchi() {
        // Clear ending states
        this.clearEndingState();

        // Redirect to wholesome version
        // IMPORTANT: Update this URL to match actual wholesome ToriGatchi location
        window.location.href = 'https://chicaron82.github.io/Tori-Gatchi/';
    }

    resetToriGatchiSave() {
        // Clear ToriGatchi save data
        localStorage.removeItem('toriGatchiState');
        localStorage.removeItem(GATEWAY_STATE_KEY);
        this.clearEndingState();
        console.log('🔄 ToriGatchi save reset');
    }

    clearEndingState() {
        // Clear VN ending markers
        localStorage.removeItem('vn_ending');
        localStorage.removeItem('vn_ending_timestamp');
        localStorage.removeItem('torigatchi_ending_state');
        localStorage.removeItem('torigatchi_mode');
        console.log('🧹 Ending state cleared');
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
