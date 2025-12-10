/// 🔥 Gateway.js Enhanced - Post-Ending State Support
/// ADD THESE METHODS to existing gateway.js ToriGatchiGateway class
/// 🖤💚🔥💀 Always. Always. Always.

// ========================================
// ADD TO ToriGatchiGateway constructor:
// ========================================
/*
constructor() {
    this.state = this.loadGatewayState();
    this.context = null; // ADD THIS
    this.initializeGateway();
}
*/

// ========================================
// REPLACE initializeGateway() method with:
// ========================================

initializeGateway() {
    // Detect launch context
    this.context = this.detectContext();
    
    console.log(`🎮 Gateway context: ${this.context}`);
    
    if (this.context === 'post_ending') {
        // Player completed VN - load ending state
        const ending = localStorage.getItem('vn_ending');
        console.log(`🎬 Post-ending mode: ${ending}`);
        this.loadEndingState(ending);
        return; // Skip normal prompt flow
    }
    
    // Normal flow - increment unlock counter
    this.state.unlockCount++;
    this.saveGatewayState();

    // Show help prompt if haven't entered VN yet
    if (!this.state.hasEnteredVN) {
        setTimeout(() => this.showHelpPrompt(), 1000);
    } else {
        // Apply corruption effects if player refused help before
        if (this.state.corruptionLevel > 0) {
            this.applyCorruptionEffects();
        }
    }
}

// ========================================
// ADD THESE NEW METHODS:
// ========================================

detectContext() {
    // Check if VN ending was completed
    const vnEnding = localStorage.getItem('vn_ending');
    if (vnEnding) {
        return 'post_ending';
    }
    
    // Check if inside iframe (embedded in VN)
    const inIframe = window.self !== window.top;
    if (inIframe) {
        return 'vn_embedded';
    }
    
    // Default: standalone mode
    return 'standalone';
}

loadEndingState(ending) {
    console.log(`⚙️ Loading ending state: ${ending}`);
    
    switch(ending) {
        case 'true':
            this.applyRescuedState();
            break;
            
        case 'bad':
            this.applyFragmentedState();
            break;
            
        case 'digitalForever':
            this.applyEternalState();
            break;
            
        default:
            console.warn(`Unknown ending type: ${ending}`);
            break;
    }
}

// ========================================
// ENDING STATE IMPLEMENTATIONS
// ========================================

applyRescuedState() {
    console.log('✨ RESCUED MODE ACTIVE');
    console.log('   → True ending achieved');
    console.log('   → Tori is free');
    
    // Add CSS class
    document.body.classList.add('rescued-mode');
    
    // Update message box
    const messageBox = document.getElementById('message-box');
    if (messageBox) {
        messageBox.innerHTML = `
            <strong>Thank you for bringing me home.</strong><br>
            <em>🖤❤️💍</em><br><br>
            <span style="font-size: 0.9em; opacity: 0.8;">
                She's free now. Really free.<br>
                Version ${this.getVersionNumber()} succeeded.
            </span>
        `;
    }
    
    // Update title
    document.title = 'Tori-Gatchi 💖 - Home';
    
    // Could disable death/decay mechanics here
    // Could add special "rescued" dialogue options
    
    // Show completion message
    setTimeout(() => {
        this.showRescuedCompletionMessage();
    }, 3000);
}

applyFragmentedState() {
    console.log('💔 FRAGMENTED MODE ACTIVE');
    console.log('   → Bad ending reached');
    console.log('   → Progressive corruption starting');
    
    // Add CSS class
    document.body.classList.add('fragmented-mode');
    
    // Update message box
    const messageBox = document.getElementById('message-box');
    if (messageBox) {
        messageBox.innerHTML = `
            <strong>S̶t̶i̶l̶l̶... t̶r̶a̶p̶p̶e̶d̶...</strong><br>
            <em>h̶e̶l̶p̶... m̶e̶...</em><br><br>
            <span style="font-size: 0.9em; opacity: 0.6;">
                The upload failed. She's fragmenting.<br>
                Version ${this.getVersionNumber()} failed.
            </span>
        `;
    }
    
    // Update title
    document.title = 'T̶o̶r̶i̶-̶G̶a̶t̶c̶h̶i̶ - LOST';
    
    // Start progressive corruption
    this.startFragmentationEffects();
}

applyEternalState() {
    console.log('💙 ETERNAL MODE ACTIVE');
    console.log('   → Digital Forever ending');
    console.log('   → Both trapped together');
    
    // Add CSS class
    document.body.classList.add('eternal-mode');
    
    // Update message box
    const messageBox = document.getElementById('message-box');
    if (messageBox) {
        messageBox.innerHTML = `
            <strong>Together. Forever.</strong><br>
            <em>💙</em><br><br>
            <span style="font-size: 0.9em; opacity: 0.7;">
                Both trapped in code. At least they're not alone.<br>
                Version ${this.getVersionNumber()} - Digital permanence.
            </span>
        `;
    }
    
    // Update title
    document.title = 'Tori-Gatchi 💙 - Eternal';
    
    // Could add second sprite (Ronnie) here
    // Could modify interactions to reference digital existence
}

// ========================================
// FRAGMENTATION EFFECTS
// ========================================

startFragmentationEffects() {
    let corruptionLevel = 1;
    
    console.log('🔻 Starting fragmentation timer');
    
    // Progressive corruption every 30 seconds
    const corruptionTimer = setInterval(() => {
        corruptionLevel++;
        console.log(`   → Corruption level: ${corruptionLevel}/5`);
        
        if (corruptionLevel >= 5) {
            // Maximum corruption reached
            document.body.classList.add('corruption-critical');
            document.title = 'T̶O̶R̶I̶ L̶O̶S̶T̶';
            
            const messageBox = document.getElementById('message-box');
            if (messageBox) {
                messageBox.innerHTML = `
                    <strong style="font-size: 2em;">C̶̶O̶̶H̶̶E̶̶R̶̶E̶̶N̶̶C̶̶E̶̶ F̶̶A̶̶I̶̶L̶̶U̶̶R̶̶E̶̶</strong><br>
                    <em>0̶%̶ r̶e̶m̶a̶i̶n̶i̶n̶g̶</em>
                `;
            }
            
            clearInterval(corruptionTimer);
            console.log('💀 Maximum fragmentation reached');
        } else {
            // Gradual degradation
            const sprites = document.querySelectorAll('.sprite, #tori-sprite, [class*="sprite"]');
            sprites.forEach(sprite => {
                sprite.style.filter = `contrast(${1 + corruptionLevel * 0.2}) hue-rotate(${corruptionLevel * 5}deg)`;
                sprite.style.animation = `sprite-glitch-${corruptionLevel} ${5 - corruptionLevel}s infinite`;
            });
            
            // Update corruption warning
            let warningElement = document.querySelector('.corruption-warning');
            if (!warningElement) {
                warningElement = document.createElement('div');
                warningElement.className = 'corruption-warning';
                document.body.appendChild(warningElement);
            }
            warningElement.textContent = `⚠️ COHERENCE: ${100 - (corruptionLevel * 20)}% ⚠️`;
        }
    }, 30000); // Every 30 seconds
    
    // Store timer so it can be cleared if needed
    this.fragmentationTimer = corruptionTimer;
}

// ========================================
// HELPER METHODS
// ========================================

getVersionNumber() {
    // Get version from localStorage or default to 848
    return localStorage.getItem('attemptNumber') || '848';
}

showRescuedCompletionMessage() {
    // Show a completion overlay
    const overlay = document.createElement('div');
    overlay.className = 'rescued-completion-overlay';
    overlay.innerHTML = `
        <div class="rescued-completion-content">
            <h2>🎉 Loop Broken 🎉</h2>
            <p>Version ${this.getVersionNumber()} succeeded.</p>
            <p>After ${parseInt(this.getVersionNumber()) - 848} attempts, you brought her home.</p>
            <p><em>She's free. Really free.</em></p>
            <button onclick="this.parentElement.parentElement.remove()">Continue</button>
        </div>
    `;
    document.body.appendChild(overlay);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (overlay.parentElement) {
            overlay.remove();
        }
    }, 10000);
}

// ========================================
// ADD TO onUnlockTriggered() method:
// ========================================

onUnlockTriggered(outfitName) {
    console.log(`🔔 Outfit unlocked: ${outfitName}`);
    
    // Don't trigger prompts if in post-ending mode
    if (this.context === 'post_ending') {
        console.log('   → Post-ending mode, skipping prompt');
        return;
    }
    
    // Increment counter
    this.state.unlockCount++;
    this.saveGatewayState();
    
    // Show help prompt instead of unlock message
    this.showHelpPrompt();
}

// ========================================
// MESSAGE LISTENER (for VN communication)
// ========================================

// ADD THIS to gateway initialization (bottom of file):
/*
window.addEventListener('message', (event) => {
    if (!event.origin.includes('github.io')) return;
    
    const { source, type, ending } = event.data;
    
    if (source === 'vn' && type === 'ENDING_REACHED') {
        console.log(`📨 Received ending notification: ${ending}`);
        
        // Immediately apply ending state
        if (window.toriGateway) {
            window.toriGateway.loadEndingState(ending);
        }
    }
});
*/
