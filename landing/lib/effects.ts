/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 LANDING PAGE - VISUAL EFFECTS
 * ═══════════════════════════════════════════════════════════════
 * Configures and initializes all visual effects for landing page
 *
 * Built with love. 💚🔥💀
 * ═══════════════════════════════════════════════════════════════
 */

import { initTilt } from '../../v2/ui/effects/TiltEffect';
import { initAnimatedStats } from '../../v2/ui/effects/AnimatedStats';

/**
 * Initialize all landing page effects
 */
export function initLandingEffects(): void {
    // Tilt effect for main brand logo (more aggressive than showcase)
    initTilt('.main-brand-logo', {
        container: '.hero',
        limits: 20, // More aggressive rotation for landing
        perspective: 1200,
        scale: 1.1,
        transition: 0.2,
        secondarySelector: '.brand-glow',
        secondaryIntensity: 0.5,
        secondaryTranslateZ: -50
    });

    // Animated stats (count-up numbers)
    initAnimatedStats();

    console.log('✅ Landing page effects initialized');
}
