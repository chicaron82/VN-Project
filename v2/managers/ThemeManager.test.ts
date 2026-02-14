import { ThemeManager } from './ThemeManager';

describe('ThemeManager', () => {
    let themeManager: ThemeManager;
    let storage: Record<string, string>;

    beforeEach(() => {
        storage = {};
        vi.stubGlobal('localStorage', {
            getItem: vi.fn((key: string) => storage[key] ?? null),
            setItem: vi.fn((key: string, val: string) => { storage[key] = val; }),
            removeItem: vi.fn((key: string) => { delete storage[key]; }),
            clear: vi.fn(),
            length: 0,
            key: vi.fn()
        });
        document.body.innerHTML = '';
        // Reset CSS variables
        document.documentElement.removeAttribute('style');

        themeManager = new ThemeManager();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // ========================================
    // INITIALIZATION
    // ========================================

    describe('Initialization', () => {
        it('should default to menu theme before init', () => {
            expect(themeManager.getCurrentTheme()).toBe('menu');
        });

        it('should apply menu theme on init', () => {
            themeManager.init();
            expect(themeManager.getCurrentTheme()).toBe('menu');
            expect(document.documentElement.style.getPropertyValue('--theme-primary')).toBe('#00ffff');
        });

        it('should load saved preference from localStorage', () => {
            storage['themePreference'] = 'tori';
            const tm = new ThemeManager();
            tm.init();
            expect(tm.getPreferenceMode()).toBe('tori');
        });

        it('should not double-initialize', () => {
            themeManager.init();
            themeManager.init(); // second call should be no-op
            expect(themeManager.getCurrentTheme()).toBe('menu');
        });
    });

    // ========================================
    // THEME APPLICATION
    // ========================================

    describe('applyTheme', () => {
        it('should set CSS variables on document root', () => {
            themeManager.applyTheme('ronnie');
            const root = document.documentElement;
            expect(root.style.getPropertyValue('--theme-primary')).toBe('#00ffff');
            expect(root.style.getPropertyValue('--theme-text')).toBe('#00ffff');
        });

        it('should set Tori pink theme', () => {
            themeManager.applyTheme('tori');
            const root = document.documentElement;
            expect(root.style.getPropertyValue('--theme-primary')).toBe('#ff6699');
        });

        it('should add theme class to body', () => {
            themeManager.applyTheme('ronnie');
            expect(document.body.classList.contains('theme-ronnie')).toBe(true);
        });

        it('should remove previous theme class when switching', () => {
            themeManager.applyTheme('ronnie');
            themeManager.applyTheme('tori');
            expect(document.body.classList.contains('theme-ronnie')).toBe(false);
            expect(document.body.classList.contains('theme-tori')).toBe(true);
        });

        it('should handle unknown theme name gracefully', () => {
            expect(() => themeManager.applyTheme('nonexistent' as any)).not.toThrow();
        });
    });

    // ========================================
    // ROUTE MANAGEMENT (AUTO mode)
    // ========================================

    describe('Route Management', () => {
        beforeEach(() => {
            themeManager.init();
        });

        it('should apply route theme in auto mode', () => {
            themeManager.setRoute('tori');
            expect(themeManager.getCurrentTheme()).toBe('tori');
        });

        it('should revert to menu on clearRoute in auto mode', () => {
            themeManager.setRoute('ronnie');
            themeManager.clearRoute();
            expect(themeManager.getCurrentTheme()).toBe('menu');
        });

        it('should NOT apply route theme when locked to preference', () => {
            themeManager.setPreferenceMode('ronnie');
            themeManager.setRoute('tori');
            // Should stay ronnie since we're locked
            expect(themeManager.getCurrentTheme()).toBe('ronnie');
        });
    });

    // ========================================
    // PREFERENCE MODES
    // ========================================

    describe('Preference Modes', () => {
        beforeEach(() => {
            themeManager.init();
        });

        it('should lock to ronnie theme', () => {
            themeManager.setPreferenceMode('ronnie');
            expect(themeManager.getCurrentTheme()).toBe('ronnie');
            expect(themeManager.getPreferenceMode()).toBe('ronnie');
        });

        it('should lock to tori theme', () => {
            themeManager.setPreferenceMode('tori');
            expect(themeManager.getCurrentTheme()).toBe('tori');
        });

        it('should persist preference to localStorage', () => {
            themeManager.setPreferenceMode('tori');
            expect(storage['themePreference']).toBe('tori');
        });

        it('should apply route theme when switching back to auto', () => {
            themeManager.setRoute('tori');
            themeManager.setPreferenceMode('ronnie'); // locks to ronnie
            themeManager.setPreferenceMode('auto');   // should reapply tori from current route
            expect(themeManager.getCurrentTheme()).toBe('tori');
        });

        it('should reject invalid mode', () => {
            themeManager.setPreferenceMode('invalid_mode' as any);
            expect(themeManager.getPreferenceMode()).not.toBe('invalid_mode');
        });
    });

    // ========================================
    // ENDING THEMES
    // ========================================

    describe('Ending Themes', () => {
        beforeEach(() => {
            themeManager.init();
        });

        it('should apply true ending theme in auto mode', () => {
            themeManager.setEndingTheme('true');
            expect(themeManager.getCurrentTheme()).toBe('trueEnding');
            expect(document.documentElement.style.getPropertyValue('--theme-primary')).toBe('#00ff88');
        });

        it('should apply digital forever theme', () => {
            themeManager.setEndingTheme('digitalForever');
            expect(themeManager.getCurrentTheme()).toBe('digitalForever');
        });

        it('should apply bad ending theme', () => {
            themeManager.setEndingTheme('bad');
            expect(themeManager.getCurrentTheme()).toBe('badEnding');
            expect(document.documentElement.style.getPropertyValue('--theme-primary')).toBe('#ff4444');
        });

        it('should NOT apply ending theme when preference is locked', () => {
            themeManager.setPreferenceMode('ronnie');
            themeManager.setEndingTheme('true');
            expect(themeManager.getCurrentTheme()).toBe('ronnie');
        });

        it('should handle unknown ending type gracefully', () => {
            expect(() => themeManager.setEndingTheme('unknown')).not.toThrow();
        });
    });

    // ========================================
    // ACCESSORS
    // ========================================

    describe('Accessors', () => {
        it('should return theme object for current theme', () => {
            themeManager.applyTheme('tori');
            const theme = themeManager.getTheme();
            expect(theme.name).toBe('Tori');
            expect(theme.emoji).toBe('🖤');
        });

        it('should return theme object by name', () => {
            const theme = themeManager.getTheme('ronnie');
            expect(theme.name).toBe('Ronnie');
            expect(theme.primary).toBe('#00ffff');
        });

        it('should return color from current theme', () => {
            themeManager.applyTheme('tori');
            expect(themeManager.getColor('primary')).toBe('#ff6699');
        });

        it('should correctly identify Tori theme', () => {
            themeManager.applyTheme('tori');
            expect(themeManager.isToriTheme()).toBe(true);
            expect(themeManager.isRonnieTheme()).toBe(false);
        });

        it('should correctly identify Ronnie theme', () => {
            themeManager.applyTheme('ronnie');
            expect(themeManager.isRonnieTheme()).toBe(true);
            expect(themeManager.isToriTheme()).toBe(false);
        });

        it('should return settings options', () => {
            const options = themeManager.getSettingsOptions();
            expect(options.length).toBe(3);
            expect(options[0].value).toBe('auto');
        });

        it('should return all themes', () => {
            const themes = themeManager.getThemes();
            expect(Object.keys(themes)).toContain('ronnie');
            expect(Object.keys(themes)).toContain('tori');
            expect(Object.keys(themes)).toContain('trueEnding');
        });
    });
});
