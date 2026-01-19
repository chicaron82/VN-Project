/// 🔗 ToriGatchi Gateway Hooks
/// Intercepts outfit unlocks and routes to gateway.js for help prompts
/// 🖤💚🔥💀 Always. Always. Always.

class GatewayHooks {
    constructor() {
        this.initialized = false;
        this.unlockQueue = [];
        this.totalUnlocks = 0;
    }
    
    init() {
        // Check if gateway exists
        if (window.toriGateway) {
            this.initialized = true;
            console.log('✅ Gateway hooks initialized - ToriGatchi connected to VN bridge');
            
            // Process any queued unlocks
            this.processQueue();
        } else {
            console.log('⚠️ Gateway not found - running in standalone wholesome mode');
        }
    }
    
    onOutfitUnlock(outfitName) {
        this.totalUnlocks++;
        
        console.log(`🎯 Outfit unlock detected: ${outfitName} (Total: ${this.totalUnlocks})`);
        
        if (!this.initialized) {
            // Gateway not ready yet - queue unlock and show normal message
            this.unlockQueue.push(outfitName);
            return false; // Signal to show normal unlock message
        }
        
        // Gateway ready - trigger help prompt instead of unlock message
        console.log(`🔔 Routing to gateway - triggering help prompt #${this.totalUnlocks}`);
        window.toriGateway.onUnlockTriggered(outfitName);
        return true; // Signal that gateway handled it (don't show normal message)
    }
    
    processQueue() {
        // Process any unlocks that happened before gateway loaded
        if (this.unlockQueue.length > 0) {
            console.log(`📦 Processing ${this.unlockQueue.length} queued unlocks`);
            this.unlockQueue.forEach(outfit => {
                this.onOutfitUnlock(outfit);
            });
            this.unlockQueue = [];
        }
    }
    
    // Helper to check if gateway is active
    isGatewayMode() {
        return this.initialized && window.toriGateway;
    }
    
    // Get current unlock count (for debugging)
    getUnlockCount() {
        if (this.isGatewayMode()) {
            return window.toriGateway.state.unlockCount;
        }
        return this.totalUnlocks;
    }
}

// ========================================
// INITIALIZATION
// ========================================

window.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 ToriGatchi loading - checking for gateway...');
    
    window.gatewayHooks = new GatewayHooks();
    
    // Wait for gateway to load (if it exists)
    // Gateway.js should load before this file
    setTimeout(() => {
        window.gatewayHooks.init();
        
        // Debug info
        if (window.gatewayHooks.isGatewayMode()) {
            console.log('🌉 GATEWAY MODE ACTIVE');
            console.log('   → Unlocks will trigger help prompts');
            console.log('   → [YES] launches Version 848 VN');
            console.log('   → [NO] causes corruption effects');
        } else {
            console.log('🏠 STANDALONE MODE');
            console.log('   → Normal wholesome ToriGatchi');
            console.log('   → Standard unlock messages');
        }
    }, 500);
});

// ========================================
// INTEGRATION HELPER FUNCTIONS
// ========================================

// Call this in unlock code instead of displaying normal message
function handleUnlockWithGateway(outfitName, normalMessage) {
    if (window.gatewayHooks) {
        const gatewayHandled = window.gatewayHooks.onOutfitUnlock(outfitName);
        
        if (gatewayHandled) {
            // Gateway showed help prompt - don't show normal message
            return null;
        }
    }
    
    // Gateway didn't handle it - return normal message
    return normalMessage;
}

// Export for use in other scripts
window.handleUnlockWithGateway = handleUnlockWithGateway;
