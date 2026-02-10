/**
 * Router Tests
 *
 * Tests for hash-based navigation in UV7 Shell.
 * Ensures apps load correctly and parameters parse properly.
 *
 * 848 is sacred. 💚🔥💀
 */

import { Router } from './Router';

// Mock UV7Shell
const createMockShell = () => ({
    loadApp: vi.fn()
});

describe('Router', () => {
    let router: Router;
    let mockShell: any;

    beforeEach(() => {
        // Reset location.hash
        window.location.hash = '';
        mockShell = createMockShell();
        router = new Router(mockShell);
    });

    afterEach(() => {
        window.location.hash = '';
    });

    describe('parseHash', () => {
        it('should parse empty hash to showcase', () => {
            window.location.hash = '';
            const result = router.parseHash();
            expect(result.appId).toBe('showcase');
            expect(result.params).toEqual({});
        });

        it('should parse #/ to showcase', () => {
            window.location.hash = '#/';
            const result = router.parseHash();
            expect(result.appId).toBe('showcase');
        });

        it('should parse #/showcase', () => {
            window.location.hash = '#/showcase';
            const result = router.parseHash();
            expect(result.appId).toBe('showcase');
            expect(result.params).toEqual({});
        });

        it('should parse #/v1', () => {
            window.location.hash = '#/v1';
            const result = router.parseHash();
            expect(result.appId).toBe('v1');
        });

        it('should parse #/v2', () => {
            window.location.hash = '#/v2';
            const result = router.parseHash();
            expect(result.appId).toBe('v2');
        });

        it('should parse #/torigatchi', () => {
            window.location.hash = '#/torigatchi';
            const result = router.parseHash();
            expect(result.appId).toBe('torigatchi');
        });

        it('should parse parameters as key/value pairs', () => {
            window.location.hash = '#/showcase/phase/42';
            const result = router.parseHash();
            expect(result.appId).toBe('showcase');
            expect(result.params).toEqual({ phase: '42' });
        });

        it('should parse multiple parameters', () => {
            window.location.hash = '#/v1/route/ronnie/act/2';
            const result = router.parseHash();
            expect(result.appId).toBe('v1');
            expect(result.params).toEqual({ route: 'ronnie', act: '2' });
        });

        it('should decode URI-encoded parameters', () => {
            window.location.hash = '#/showcase/search/Hello%20World';
            const result = router.parseHash();
            expect(result.params).toEqual({ search: 'Hello World' });
        });

        it('should handle unknown app IDs by defaulting to showcase', () => {
            window.location.hash = '#/unknown-app';
            const result = router.parseHash();
            expect(result.appId).toBe('showcase');
        });

        it('should ignore odd parameter segments', () => {
            window.location.hash = '#/showcase/key1/value1/orphan';
            const result = router.parseHash();
            expect(result.params).toEqual({ key1: 'value1' });
        });
    });

    describe('navigate', () => {
        it('should update location hash for app without params', () => {
            router.navigate('showcase');
            expect(window.location.hash).toBe('#/showcase');
        });

        it('should encode parameters in hash', () => {
            router.navigate('showcase', { phase: '42' });
            expect(window.location.hash).toBe('#/showcase/phase/42');
        });

        it('should encode multiple parameters', () => {
            router.navigate('v1', { route: 'tori', act: '3' });
            expect(window.location.hash).toContain('route/tori');
            expect(window.location.hash).toContain('act/3');
        });

        it('should URI-encode parameter values', () => {
            router.navigate('showcase', { search: 'Hello World' });
            expect(window.location.hash).toBe('#/showcase/search/Hello%20World');
        });
    });

    describe('getCurrentAppId', () => {
        it('should return current app ID', () => {
            window.location.hash = '#/v2';
            expect(router.getCurrentAppId()).toBe('v2');
        });

        it('should return showcase for empty hash', () => {
            window.location.hash = '';
            expect(router.getCurrentAppId()).toBe('showcase');
        });
    });

    describe('getCurrentParams', () => {
        it('should return current parameters', () => {
            window.location.hash = '#/showcase/phase/13';
            expect(router.getCurrentParams()).toEqual({ phase: '13' });
        });

        it('should return empty object when no parameters', () => {
            window.location.hash = '#/landing';
            expect(router.getCurrentParams()).toEqual({});
        });
    });

    describe('handleRoute', () => {
        it('should call shell.loadApp with parsed app and params', () => {
            window.location.hash = '#/showcase/phase/42';
            router.handleRoute();

            expect(mockShell.loadApp).toHaveBeenCalledWith('showcase', { phase: '42' });
        });

        it('should handle default route as showcase', () => {
            window.location.hash = '#/';
            router.handleRoute();

            expect(mockShell.loadApp).toHaveBeenCalledWith('showcase', {});
        });
    });

    describe('back', () => {
        it('should call history.back', () => {
            const backSpy = vi.spyOn(window.history, 'back');
            router.back();
            expect(backSpy).toHaveBeenCalled();
        });
    });
});
