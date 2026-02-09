import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VisualCueSystem } from './VisualCueSystem';
import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';
import { Logger } from '@utils/Logger';

/**
 * ════════════════════════════════════════════════════════════════
 * VISUAL CUE SYSTEM TESTS - Phase 15c
 *
 * Tests for sensory feedback system with intensity scaling
 * 🖤💚🔥💀 UV7 Crew
 * ════════════════════════════════════════════════════════════════
 */

describe('VisualCueSystem', () => {
    let eventBus: EventBus;
    let stateManager: StateManager;
    let visualCueSystem: VisualCueSystem;

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = `
            <div class="dialog-box"></div>
            <div class="sprite-left">
                <img src="test.png" alt="sprite" />
            </div>
        `;

        eventBus = new EventBus();
        stateManager = new StateManager(eventBus);
        visualCueSystem = new VisualCueSystem(eventBus, stateManager);

        // Mock requestAnimationFrame
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
            cb(0);
            return 0;
        });
    });

    afterEach(() => {
        visualCueSystem.cleanup();
        vi.restoreAllMocks();
        document.body.innerHTML = '';
    });

    // ════════════════════════════════════════════════════════════════
    // INITIALIZATION TESTS
    // ════════════════════════════════════════════════════════════════

    describe('initialization', () => {
        it('should initialize with empty active effects', () => {
            expect(visualCueSystem.isEffectActive('toriHop')).toBe(false);
            expect(visualCueSystem.isEffectActive('denied')).toBe(false);
        });

        it('should respond to visual:cue events', () => {
            vi.useFakeTimers();

            eventBus.emit('visual:cue', { type: 'buttonPress', channel: 'ui' });

            // Effect should be active briefly
            expect(visualCueSystem.isEffectActive('buttonPress')).toBe(true);

            vi.useRealTimers();
        });
    });

    // ════════════════════════════════════════════════════════════════
    // INTENSITY SCALING TESTS (TORI'S ADDITION) 💚
    // ════════════════════════════════════════════════════════════════

    describe('intensity scaling', () => {
        it('should return baseline scale (1.0) for Normal intensity', () => {
            stateManager.set('settings', { comfortIntensity: 1 });

            const scale = visualCueSystem.getIntensityScale('ui');
            expect(scale).toBe(1.0);
        });

        it('should return reduced scale (0.6) for Gentle intensity', () => {
            stateManager.set('settings', { comfortIntensity: 0 });

            const scale = visualCueSystem.getIntensityScale('ui');
            expect(scale).toBe(0.6);
        });

        it('should return boosted scale (1.35) for Amped intensity', () => {
            stateManager.set('settings', { comfortIntensity: 2 });

            const scale = visualCueSystem.getIntensityScale('ui');
            expect(scale).toBe(1.35);
        });

        it('should return INSANE scale (2.0) when insane mode is locked', () => {
            stateManager.set('settings', { comfortIntensity: 1 });
            stateManager.set('game.flags', { insaneModeLocked: true });

            const scale = visualCueSystem.getIntensityScale('ui');
            expect(scale).toBe(2.0);
        });

        it('should NOT scale critical channel even in insane mode', () => {
            stateManager.set('game.flags', { insaneModeLocked: true });

            const scale = visualCueSystem.getIntensityScale('critical');
            expect(scale).toBe(1.0);
        });

        it('should default to Normal (1.0) when no settings exist', () => {
            const scale = visualCueSystem.getIntensityScale('narrative');
            expect(scale).toBe(1.0);
        });
    });

    // ════════════════════════════════════════════════════════════════
    // CUE TRIGGER TESTS
    // ════════════════════════════════════════════════════════════════

    describe('trigger API', () => {
        it('should prevent duplicate effects from stacking', () => {
            vi.useFakeTimers();

            visualCueSystem.trigger('toriHop');
            visualCueSystem.trigger('toriHop'); // Should be ignored

            // Only one effect should be active
            expect(visualCueSystem.isEffectActive('toriHop')).toBe(true);

            vi.useRealTimers();
        });

        it('should allow different effect types simultaneously', () => {
            vi.useFakeTimers();

            visualCueSystem.trigger('toriHop');
            visualCueSystem.trigger('timelineGlitch');

            expect(visualCueSystem.isEffectActive('toriHop')).toBe(true);
            expect(visualCueSystem.isEffectActive('timelineGlitch')).toBe(true);

            vi.useRealTimers();
        });

        it('should warn on unknown cue types', () => {
            const warnSpy = vi.spyOn(Logger, 'warn').mockImplementation(() => {});

            // @ts-expect-error Testing unknown cue type
            visualCueSystem.trigger('unknownCue');

            expect(warnSpy).toHaveBeenCalledWith('⚠️ Unknown visual cue type: unknownCue');
        });
    });

    // ════════════════════════════════════════════════════════════════
    // STORY-SPECIFIC CUE TESTS
    // ════════════════════════════════════════════════════════════════

    describe('story-specific cues', () => {
        it('should trigger toriHop with chromatic overlay', () => {
            vi.useFakeTimers();

            visualCueSystem.trigger('toriHop');

            const overlay = document.querySelector('.chromatic-split');
            expect(overlay).not.toBeNull();

            vi.useRealTimers();
        });

        it('should trigger tamaPull with ripple effect', () => {
            vi.useFakeTimers();

            visualCueSystem.trigger('tamaPull');

            // Should create ripple near sprite
            const ripple = document.querySelector('.tether-ripple');
            expect(ripple).not.toBeNull();

            vi.useRealTimers();
        });

        it('should trigger tamaEmergency with flash overlay', () => {
            vi.useFakeTimers();

            visualCueSystem.trigger('tamaEmergency');

            const overlay = document.querySelector('.emergency-flash');
            expect(overlay).not.toBeNull();

            vi.useRealTimers();
        });

        it('should trigger timelineGlitch with scan lines', () => {
            vi.useFakeTimers();

            visualCueSystem.trigger('timelineGlitch');

            const overlay = document.querySelector('.timeline-glitch');
            expect(overlay).not.toBeNull();
            expect(overlay?.getAttribute('style')).toContain('background-image');

            vi.useRealTimers();
        });

        it('should trigger codeRipple with 8 particles', () => {
            vi.useFakeTimers();

            visualCueSystem.trigger('codeRipple');

            const particles = document.querySelectorAll('.code-particle');
            expect(particles.length).toBe(8);

            vi.useRealTimers();
        });

        it('should use 848 sacred numbers in code particles', () => {
            vi.useFakeTimers();

            visualCueSystem.trigger('codeRipple');

            const particles = document.querySelectorAll('.code-particle');
            const validChars = ['0', '1', '8', '4'];

            particles.forEach(particle => {
                expect(validChars).toContain(particle.textContent);
            });

            vi.useRealTimers();
        });
    });

    // ════════════════════════════════════════════════════════════════
    // DENIAL CUE TESTS
    // ════════════════════════════════════════════════════════════════

    describe('denial cues', () => {
        it('should trigger denied with glitch line', () => {
            vi.useFakeTimers();

            visualCueSystem.trigger('denied');

            const glitchLine = document.querySelector('.denial-glitch-line');
            expect(glitchLine).not.toBeNull();

            vi.useRealTimers();
        });

        it('should trigger harshDenial with ACCESS DENIED text', () => {
            vi.useFakeTimers();

            visualCueSystem.trigger('harshDenial');

            const deniedText = document.querySelector('.access-denied-text');
            expect(deniedText).not.toBeNull();
            expect(deniedText?.textContent).toBe('ACCESS DENIED');

            vi.useRealTimers();
        });

        it('should create red flash overlay for harshDenial', () => {
            vi.useFakeTimers();

            visualCueSystem.trigger('harshDenial');

            const overlay = document.querySelector('.harsh-denial-flash');
            expect(overlay).not.toBeNull();
            expect(overlay?.getAttribute('style')).toContain('radial-gradient');

            vi.useRealTimers();
        });
    });

    // ════════════════════════════════════════════════════════════════
    // UI INTERACTION CUE TESTS
    // ════════════════════════════════════════════════════════════════

    describe('UI interaction cues', () => {
        it('should trigger buttonPress with scale effect', () => {
            vi.useFakeTimers();

            const button = document.createElement('button');
            document.body.appendChild(button);

            visualCueSystem.trigger('buttonPress', button);

            expect(button.style.transform).toBe('scale(0.95)');

            vi.useRealTimers();
        });

        it('should trigger menuSelect with animation', () => {
            vi.useFakeTimers();

            const menuItem = document.createElement('div');
            document.body.appendChild(menuItem);

            visualCueSystem.trigger('menuSelect', menuItem);

            expect(menuItem.style.animation).toContain('menu-glow-pulse');

            vi.useRealTimers();
        });

        it('should trigger cardSnap with pop animation', () => {
            vi.useFakeTimers();

            const card = document.createElement('div');
            document.body.appendChild(card);

            visualCueSystem.trigger('cardSnap', card);

            expect(card.style.animation).toContain('card-snap-pop');

            vi.useRealTimers();
        });

        it('should handle positioned portraits in cardSnap', () => {
            vi.useFakeTimers();

            const portrait = document.createElement('div');
            portrait.classList.add('ronnie-portrait');
            const img = document.createElement('img');
            portrait.appendChild(img);
            document.body.appendChild(portrait);

            visualCueSystem.trigger('cardSnap', portrait);

            // Should apply animation to img, not portrait
            expect(img.style.animation).toContain('card-snap-pop');
            expect(portrait.style.animation).toBe('');

            vi.useRealTimers();
        });
    });

    // ════════════════════════════════════════════════════════════════
    // CLEANUP TESTS
    // ════════════════════════════════════════════════════════════════

    describe('cleanup', () => {
        it('should clear all active effects', () => {
            vi.useFakeTimers();

            visualCueSystem.trigger('toriHop');
            visualCueSystem.trigger('timelineGlitch');

            visualCueSystem.cleanup();

            expect(visualCueSystem.isEffectActive('toriHop')).toBe(false);
            expect(visualCueSystem.isEffectActive('timelineGlitch')).toBe(false);

            vi.useRealTimers();
        });
    });

    // ════════════════════════════════════════════════════════════════
    // EVENTBUS INTEGRATION TESTS
    // ════════════════════════════════════════════════════════════════

    describe('EventBus integration', () => {
        it('should respond to visual:cue with type null gracefully', () => {
            // Should not throw
            expect(() => {
                eventBus.emit('visual:cue', { type: null, channel: 'ui' });
            }).not.toThrow();
        });

        it('should use provided channel from event', () => {
            vi.useFakeTimers();

            stateManager.set('settings', { comfortIntensity: 0 }); // Gentle

            // Trigger with critical channel - should not scale
            eventBus.emit('visual:cue', { type: 'denied', channel: 'critical' });

            // Effect should be active
            expect(visualCueSystem.isEffectActive('denied')).toBe(true);

            vi.useRealTimers();
        });
    });

    // ════════════════════════════════════════════════════════════════
    // EFFECT TIMEOUT TESTS
    // ════════════════════════════════════════════════════════════════

    describe('effect timeouts', () => {
        it('should remove toriHop effect after duration', () => {
            vi.useFakeTimers();

            visualCueSystem.trigger('toriHop');
            expect(visualCueSystem.isEffectActive('toriHop')).toBe(true);

            // Duration is 0.4s * scale = 400ms at Normal
            vi.advanceTimersByTime(500);

            expect(visualCueSystem.isEffectActive('toriHop')).toBe(false);

            vi.useRealTimers();
        });

        it('should remove harshDenial effect after 500ms', () => {
            vi.useFakeTimers();

            visualCueSystem.trigger('harshDenial');
            expect(visualCueSystem.isEffectActive('harshDenial')).toBe(true);

            vi.advanceTimersByTime(600);

            expect(visualCueSystem.isEffectActive('harshDenial')).toBe(false);

            vi.useRealTimers();
        });

        it('should remove buttonPress effect after scaled duration', () => {
            vi.useFakeTimers();

            const button = document.createElement('button');
            document.body.appendChild(button);

            visualCueSystem.trigger('buttonPress', button);
            expect(visualCueSystem.isEffectActive('buttonPress')).toBe(true);

            // Duration is 100ms at Normal
            vi.advanceTimersByTime(150);

            expect(visualCueSystem.isEffectActive('buttonPress')).toBe(false);

            vi.useRealTimers();
        });
    });
});
