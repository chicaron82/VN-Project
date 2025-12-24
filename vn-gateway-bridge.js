// ========================================
// VN GATEWAY BRIDGE
// ========================================
// Handles communication between Version 848 VN and ToriGatchi
// 🖤💚🔥💀

class VNGatewayBridge {
    constructor() {
        this.initializeFromParams();
    }

    // ========================================
    // INITIALIZATION FROM URL PARAMETERS
    // ========================================

    initializeFromParams() {
        const params = new URLSearchParams(window.location.search);
        const startCondition = params.get('start');
        const unlockCount = parseInt(params.get('unlocks')) || 0;

        if (startCondition) {
            console.log(`⚙️ Applying start condition: ${startCondition}`);
            console.log(`📊 Unlock count from ToriGatchi: ${unlockCount}`);

            // Store for game engine to use
            this.startCondition = startCondition;
            this.unlockCount = unlockCount;

            // Apply condition when game starts
            this.applyStartCondition(startCondition, unlockCount);
        }
    }

    applyStartCondition(condition, unlocks) {
        // Store in localStorage for game engine to read
        localStorage.setItem('gateway_start_condition', condition);
        localStorage.setItem('gateway_unlock_count', unlocks.toString());

        switch (condition) {
            case 'optimal':
                // Helped early - best chance
                // Tori starts at 100% coherence
                localStorage.setItem('gateway_tether_modifier', '1.0');
                console.log('✨ Optimal start: Tori at full strength');
                break;

            case 'normal':
                // Helped at moderate point
                // Tori starts at 88% coherence
                localStorage.setItem('gateway_tether_modifier', '0.88');
                console.log('⚠️ Normal start: Tori slightly fragmented');
                break;

            case 'desperate':
                // Helped late - she's damaged
                // Tori starts at 60% coherence
                localStorage.setItem('gateway_tether_modifier', '0.60');
                console.log('🔴 Desperate start: Tori severely fragmented');
                break;
        }
    }

    // ========================================
    // ENDING NOTIFICATION
    // ========================================

    notifyEnding(endingType) {
        console.log(`🎬 ENDING REACHED: ${endingType}`);

        // Store ending result for ToriGatchi to read
        localStorage.setItem('vn_ending', endingType);
        localStorage.setItem('vn_ending_timestamp', Date.now().toString());

        // Map ending types for ToriGatchi
        const endingMap = {
            'true': 'rescued',
            'bad': 'fragmented',
            'digitalForever': 'eternal'
        };

        const toriGatchiState = endingMap[endingType] || 'fragmented';
        localStorage.setItem('torigatchi_ending_state', toriGatchiState);

        console.log(`💾 Saved ending state for ToriGatchi: ${toriGatchiState}`);
    }

    // ========================================
    // HELPER: Get current start condition
    // ========================================

    getStartCondition() {
        return {
            condition: this.startCondition || 'normal',
            unlockCount: this.unlockCount || 0
        };
    }
}

// Initialize bridge when script loads
window.vnBridge = new VNGatewayBridge();

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.VNGatewayBridge = VNGatewayBridge;
}

// ES Module export
export { VNGatewayBridge };

console.log('🌉 VN Gateway Bridge initialized');
