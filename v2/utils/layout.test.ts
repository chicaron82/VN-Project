import { describe, it, expect, vi, afterEach } from 'vitest';
import { isLandscape } from './layout';

describe('isLandscape', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns true when width > height (landscape)', () => {
        vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024);
        vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(768);
        expect(isLandscape()).toBe(true);
    });

    it('returns false when height > width (portrait)', () => {
        vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(375);
        vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(812);
        expect(isLandscape()).toBe(false);
    });

    it('returns false when width equals height (square)', () => {
        vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(500);
        vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(500);
        expect(isLandscape()).toBe(false);
    });
});
