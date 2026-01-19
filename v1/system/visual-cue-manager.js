// ========================================
// VISUAL CUE MANAGER
// Pairs visual effects with haptic feedback
// Creates a unified sensory language for Version 848
// 🖤💚🔥💀 Built by UV7 Crew (Tori's brilliant idea)
// ========================================

class VisualCueManager {
    constructor(game) {
        this.game = game;
        this.activeEffects = new Set();

        console.log('✨ Visual Cue Manager initialized');
    }

    // ========================================
    // INTENSITY SCALING (TORI'S ADDITION) 💚
    // ========================================

    getScale(channel = 'ui') {
        // Get comfort intensity: 0=Gentle, 1=Normal, 2=Amped
        const intensity = this.game.settingsManager?.getComfortIntensity() ?? 1;

        // Check if in insane mode
        const isInsane = this.game.gameState?.flags?.insaneModeLocked || false;

        // Critical channel NEVER scales, especially in insane mode
        if (channel === 'critical') {
            return 1.0; // Raw, unscaled intensity for denials/warnings
        }

        // INSANE MODE: Force BEYOND Amped intensity (2.0x boost)
        // This ensures INSANE feels different even for players who use Amped normally
        // Amped = 1.35x, INSANE = 2.0x (significantly more intense)
        if (isInsane) {
            return 2.0; // INSANE mode: 2x boost (beyond Amped's 1.35x)
        }

        // Scale based on player preference (non-insane modes)
        if (intensity === 0) return 0.6;  // Gentle: 40% reduction
        if (intensity === 2) return 1.35; // Amped: 35% boost
        return 1.0; // Normal: baseline
    }

    // ========================================
    // MAIN TRIGGER API
    // ========================================

    trigger(cueType, targetElement = null, { channel = 'ui' } = {}) {
        // Prevent duplicate effects from stacking
        if (this.activeEffects.has(cueType)) {
            return;
        }

        this.activeEffects.add(cueType);

        // Store channel for this effect so individual methods can access it
        this._currentChannel = channel;

        // Route to specific effect
        switch (cueType) {
            // Story-specific cues
            case 'toriHop':
                this.toriBodyHop(targetElement);
                break;
            case 'tamaPull':
                this.tetherPull(targetElement);
                break;
            case 'tamaEmergency':
                this.emergencyFlash(targetElement);
                break;
            case 'timelineGlitch':
                this.timelineGlitch();
                break;
            case 'codeRipple':
                this.codeRipple(targetElement);
                break;

            // Denial/lockout cues
            case 'denied':
                this.denialShake(targetElement);
                break;
            case 'harshDenial':
                this.harshDenial(targetElement);
                break;

            // UI interaction cues
            case 'buttonPress':
                this.buttonPress(targetElement);
                break;
            case 'menuSelect':
                this.menuSelect(targetElement);
                break;
            case 'cardSnap':
                this.cardSnap(targetElement);
                break;

            default:
                console.warn(`⚠️ Unknown visual cue type: ${cueType}`);
                this.activeEffects.delete(cueType);
                return;
        }

        console.log(`✨ Visual cue triggered: ${cueType}`);
    }

    // ========================================
    // STORY-SPECIFIC VISUAL CUES
    // ========================================

    // Double flicker for Tori hopping between bodies
    // Pairs with: triggerHaptic('pulse') [70, 40, 70]
    // NARRATIVE CHANNEL - scales with comfort
    toriBodyHop(target = null) {
        const element = target || this.game.dialogueBox || document.body;
        const scale = this.getScale(this._currentChannel || 'narrative');
        const duration = 0.4 * scale; // Gentle: 0.24s, Normal: 0.4s, Amped: 0.54s

        // First flicker
        element.style.animation = 'none';
        requestAnimationFrame(() => {
            element.style.animation = `body-hop-flicker ${duration}s ease-out`;
        });

        // Chromatic aberration effect
        const overlay = this.createOverlay('chromatic-split');
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.remove();
            this.activeEffects.delete('toriHop');
        }, duration * 1000);
    }

    // Single tug for tether pull
    // Pairs with: triggerHaptic('medium') [35-50ms]
    // NARRATIVE CHANNEL - scales with comfort
    tetherPull(target = null) {
        const element = target || this.game.dialogueBox || document.body;
        const scale = this.getScale(this._currentChannel || 'narrative');
        const duration = 0.2 * scale; // Gentle: 0.12s, Normal: 0.2s, Amped: 0.27s

        // Quick inward squeeze
        element.style.animation = 'none';
        requestAnimationFrame(() => {
            element.style.animation = `tether-pull ${duration}s ease-out`;
        });

        // Ripple around sprite if visible
        const sprite = document.querySelector('.sprite-left, .sprite-right');
        if (sprite) {
            const ripple = this.createRipple(sprite, scale);
            sprite.parentElement.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600 * scale);
        }

        setTimeout(() => {
            this.activeEffects.delete('tamaPull');
        }, duration * 1000);
    }

    // Emergency flash for critical moments
    // Pairs with: triggerHaptic('warning') [100, 50, 100, 50, 100]
    emergencyFlash(target = null) {
        const overlay = this.createOverlay('emergency-flash');
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.remove();
            this.activeEffects.delete('tamaEmergency');
        }, 500);
    }

    // Timeline instability glitch
    // Pairs with timeline/loop events
    // NARRATIVE CHANNEL - scales with comfort
    timelineGlitch() {
        const scale = this.getScale(this._currentChannel || 'narrative');
        const duration = 600 * scale; // Gentle: 360ms, Normal: 600ms, Amped: 810ms

        const overlay = this.createOverlay('timeline-glitch');
        document.body.appendChild(overlay);

        // Add scan lines effect (opacity scales with comfort)
        const scanLineOpacity = 0.03 * scale;
        overlay.style.backgroundImage = `
            repeating-linear-gradient(
                0deg,
                transparent 0px,
                transparent 2px,
                rgba(0, 255, 255, ${scanLineOpacity}) 2px,
                rgba(0, 255, 255, ${scanLineOpacity}) 4px
            )
        `;

        setTimeout(() => {
            overlay.remove();
            this.activeEffects.delete('timelineGlitch');
        }, duration);
    }

    // Code particles ripple effect
    // NARRATIVE CHANNEL - scales with comfort
    codeRipple(target = null) {
        const element = target || this.game.dialogueBox;
        if (!element) return;

        const scale = this.getScale(this._currentChannel || 'narrative');
        const duration = 600 * scale; // Gentle: 360ms, Normal: 600ms, Amped: 810ms
        const distance = 50 * scale;  // Gentle: 30px, Normal: 50px, Amped: 67.5px

        // Create particle burst
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'code-particle';
            particle.textContent = ['0', '1', '8', '4'][Math.floor(Math.random() * 4)];

            const angle = (i / 8) * Math.PI * 2;
            particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
            particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);

            element.appendChild(particle);

            setTimeout(() => particle.remove(), duration);
        }

        setTimeout(() => {
            this.activeEffects.delete('codeRipple');
        }, duration);
    }

    // Denial shake - gentle "no" for despair-blocked saves
    // Pairs with: triggerHaptic('denied') [40, 40, 40, 40, 40]
    // CRITICAL CHANNEL - never scales
    denialShake(target = null) {
        const element = target || this.game.dialogueBox;
        if (!element) return;

        const scale = this.getScale(this._currentChannel || 'critical');
        const duration = 0.4 * scale; // Always 0.4s for critical channel

        // Triple shake with red glitch
        element.style.animation = 'none';
        requestAnimationFrame(() => {
            element.style.animation = `denial-shake ${duration}s ease-out`;
        });

        // Red glitch line across element
        const glitchLine = document.createElement('div');
        glitchLine.className = 'denial-glitch-line';
        const opacity = 0.8 * scale; // Gentle: 0.4, Normal: 0.8, Amped: 1.08 (capped by CSS)
        const glowIntensity = 10 * scale; // Gentle: 5px, Normal: 10px, Amped: 13.5px

        glitchLine.style.cssText = `
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 2px;
            background: rgba(255, 50, 50, ${Math.min(opacity, 1.0)});
            box-shadow: 0 0 ${glowIntensity}px rgba(255, 50, 50, 0.6);
            pointer-events: none;
            z-index: 9999;
            animation: glitch-line-flash ${duration}s ease-out;
        `;
        element.style.position = 'relative';
        element.appendChild(glitchLine);

        setTimeout(() => {
            glitchLine.remove();
            this.activeEffects.delete('denied');
        }, duration * 1000);
    }

    // Harsh denial - aggressive rejection for insane mode lockouts
    // Pairs with: triggerHaptic('harsh-denial') [60, 30, 60, 30, 60]
    harshDenial(target = null) {
        const element = target || document.body;

        // Screen tilt + red flash
        element.style.animation = 'none';
        requestAnimationFrame(() => {
            element.style.animation = 'harsh-denial-reject 0.5s ease-out';
        });

        // Full screen red flash overlay
        const overlay = this.createOverlay('harsh-denial-flash');
        overlay.style.background = 'radial-gradient(circle, rgba(255, 0, 0, 0.4) 0%, rgba(255, 0, 0, 0.1) 50%, transparent 100%)';
        document.body.appendChild(overlay);

        // "ACCESS DENIED" shattered text
        const deniedText = document.createElement('div');
        deniedText.className = 'access-denied-text';
        deniedText.textContent = 'ACCESS DENIED';
        deniedText.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 32px;
            font-weight: bold;
            color: #ff0000;
            text-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
            pointer-events: none;
            z-index: 9999;
            animation: shattered-text 0.5s ease-out;
            font-family: 'Courier New', monospace;
        `;
        document.body.appendChild(deniedText);

        setTimeout(() => {
            overlay.remove();
            deniedText.remove();
            this.activeEffects.delete('harshDenial');
        }, 500);
    }

    // ========================================
    // UI INTERACTION VISUAL CUES
    // ========================================

    // Button press feedback
    // Pairs with: triggerHaptic('light') [20-30ms]
    // UI CHANNEL - scales with comfort
    buttonPress(target) {
        if (!target) return;

        const scale = this.getScale(this._currentChannel || 'ui');
        const duration = 100 * scale; // Gentle: 60ms, Normal: 100ms, Amped: 135ms
        const glowIntensity = 10 * scale; // Gentle: 6px, Normal: 10px, Amped: 13.5px

        // Scale down and back up
        target.style.transform = 'scale(0.95)';
        target.style.transition = `transform ${duration}ms ease-out`;

        // Add micro-glow (intensity scales with comfort)
        const originalBoxShadow = target.style.boxShadow;
        target.style.boxShadow = `0 0 ${glowIntensity}px rgba(0, 188, 212, 0.6)`;

        setTimeout(() => {
            target.style.transform = '';
            target.style.boxShadow = originalBoxShadow;
            this.activeEffects.delete('buttonPress');
        }, duration);
    }

    // Menu selection glow
    // UI CHANNEL - scales with comfort
    menuSelect(target) {
        if (!target) return;

        const scale = this.getScale(this._currentChannel || 'ui');
        const duration = 0.3 * scale; // Gentle: 0.18s, Normal: 0.3s, Amped: 0.405s

        target.style.animation = 'none';
        requestAnimationFrame(() => {
            target.style.animation = `menu-glow-pulse ${duration}s ease-out`;
        });

        setTimeout(() => {
            this.activeEffects.delete('menuSelect');
        }, duration * 1000);
    }

    // Carousel card snap feedback
    // UI CHANNEL - scales with comfort
    cardSnap(target) {
        if (!target) return;

        const scale = this.getScale(this._currentChannel || 'ui');
        const duration = 0.25 * scale; // Gentle: 0.15s, Normal: 0.25s, Amped: 0.3375s

        // DIZEE FIX: Don't apply scale animation directly to elements with transform positioning
        // (like route portraits which use translateX). Apply to child img instead if present.
        const isPositioned = target.classList.contains('ronnie-portrait') ||
            target.classList.contains('tori-portrait');
        const animTarget = isPositioned ? target.querySelector('img') : target;

        if (!animTarget) return;

        // Brief scale pop
        animTarget.style.animation = 'none';
        requestAnimationFrame(() => {
            animTarget.style.animation = `card-snap-pop ${duration}s ease-out`;
        });

        setTimeout(() => {
            this.activeEffects.delete('cardSnap');
        }, duration * 1000);
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    createOverlay(className) {
        const overlay = document.createElement('div');
        overlay.className = `visual-cue-overlay ${className}`;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9998;
        `;
        return overlay;
    }

    createRipple(targetElement, scale = 1.0) {
        const ripple = document.createElement('div');
        ripple.className = 'tether-ripple';

        const size = 100 * scale; // Gentle: 60px, Normal: 100px, Amped: 135px
        const margin = -50 * scale;
        const duration = 0.6 * scale; // Gentle: 0.36s, Normal: 0.6s, Amped: 0.81s

        const rect = targetElement.getBoundingClientRect();
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: ${size}px;
            height: ${size}px;
            margin: ${margin}px 0 0 ${margin}px;
            border: 2px solid rgba(0, 188, 212, 0.8);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple-expand ${duration}s ease-out;
        `;
        return ripple;
    }

    // ========================================
    // CLEANUP
    // ========================================

    cleanup() {
        this.activeEffects.clear();
        console.log('✨ Visual Cue Manager cleaned up');
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.VisualCueManager = VisualCueManager;
}

// ES Module export
export { VisualCueManager };
