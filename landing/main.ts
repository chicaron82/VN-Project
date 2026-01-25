/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 LANDING PAGE - MODULE ENTRY POINT
 * ═══════════════════════════════════════════════════════════════
 * Initializes the UV7 OS Landing Page and VN Gateway Bridge
 *
 * Built with love. 💚🔥💀
 * "848 is sacred."
 * ═══════════════════════════════════════════════════════════════
 */

import { initVNGatewayBridge, VNGatewayBridge } from './lib/vn-gateway-bridge';
import { initUV7OSLanding, UV7OS } from '../v2/ui/components/UV7OS';
import { UV7AppSwitcher } from '../v2/ui/components/UV7AppSwitcher';
import { initLandingEffects } from './lib/effects';

// ═══════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing UV7 Landing Page...');

    // Initialize VN Gateway Bridge
    const vnBridge = initVNGatewayBridge();
    console.log('✅ VN Gateway Bridge ready');

    // Initialize UV7 OS Landing
    const uv7os = initUV7OSLanding();
    console.log('✅ UV7 OS Landing ready');

    // Initialize visual effects
    initLandingEffects();

    console.log('💚 UV7 Landing Page fully initialized');
});

// ═══════════════════════════════════════════════════════════════
// WINDOW EXPORTS (For backward compatibility with legacy scripts)
// ═══════════════════════════════════════════════════════════════

// Export classes to window for legacy script compatibility
(window as any).VNGatewayBridge = VNGatewayBridge;
(window as any).UV7OS = UV7OS;
(window as any).UV7AppSwitcher = UV7AppSwitcher;
