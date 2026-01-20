import { describe, it, expect } from 'vitest';
import { GameConfig } from './GameConfig';

describe('GameConfig', () => {
    it('should have correct version information', () => {
        expect(GameConfig.VERSION.CURRENT).toBe('848');
        expect(GameConfig.VERSION.DEFAULT_START).toBe(848);
    });

    it('should have critical haptic patterns', () => {
        expect(GameConfig.HAPTICS.ERROR).toBeDefined();
        expect(GameConfig.HAPTICS.GLITCH).toBeDefined();
        expect(GameConfig.HAPTICS.HEARTBEAT).toBeDefined();
    });

    it('should have sensory cue definitions', () => {
        expect(GameConfig.SENSORY_CUES.denied).toBeDefined();
        expect(GameConfig.SENSORY_CUES.denied.channel).toBe('critical');
        expect(GameConfig.SENSORY_CUES.toriHop.visualType).toBe('toriHop');
    });

    it('should have tether configuration', () => {
        expect(GameConfig.TETHER.MAX_LEVEL).toBe(100);
        expect(GameConfig.TETHER.THRESHOLD_CRITICAL).toBe(20);
    });
});
