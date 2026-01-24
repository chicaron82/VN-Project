// ========================================
// VN GATEWAY BRIDGE
// ========================================
// Handles communication between Version 848 VN and ToriGatchi
// 🖤💚🔥💀

export class VNGatewayBridge {
    private startCondition?: string;
    private unlockCount: number;

    constructor() {
        this.unlockCount = 0;
        this.initializeFromParams();
    }

    // ========================================
    // INITIALIZATION FROM URL PARAMETERS
    // ========================================

    private initializeFromParams(): void {
        const params = new URLSearchParams(window.location.search);
        const startCondition = params.get('start');
        const unlockCount = parseInt(params.get('unlocks') || '0') || 0;

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

    private applyStartCondition(condition: string, unlocks: number): void {
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

    notifyEnding(endingType: string): void {
        console.log(`🎬 ENDING REACHED: ${endingType}`);

        // Store ending result for ToriGatchi to read
        localStorage.setItem('vn_ending', endingType);
        localStorage.setItem('vn_ending_timestamp', Date.now().toString());

        // Map ending types for ToriGatchi
        const endingMap: Record<string, string> = {
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

    getStartCondition(): { condition: string; unlockCount: number } {
        return {
            condition: this.startCondition || 'normal',
            unlockCount: this.unlockCount || 0
        };
    }
}

// Export initialization function
export function initVNGatewayBridge(): VNGatewayBridge {
    const bridge = new VNGatewayBridge();
    (window as any).vnBridge = bridge;
    (window as any).VNGatewayBridge = VNGatewayBridge;
    console.log('🌉 VN Gateway Bridge initialized');
    return bridge;
}
