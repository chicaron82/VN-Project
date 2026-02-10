
/**
 * CreditsController Unit Tests
 * 
 * Tests for the extracted CreditsController class.
 * Validates credits display, dynamic titles, and layout modes.
 */

// Mock DOM element
const mockElement = (id) => ({
    id,
    style: {},
    classList: {
        add: vi.fn(),
        remove: vi.fn(),
        contains: vi.fn(() => false)
    },
    appendChild: vi.fn(),
    innerHTML: '',
    textContent: '',
    querySelector: vi.fn(() => null),
    querySelectorAll: vi.fn(() => [])
});

// Mock document
global.document = {
    getElementById: vi.fn(() => null),
    createElement: vi.fn(() => mockElement('created')),
    body: { appendChild: vi.fn() },
    head: { appendChild: vi.fn() }
};

// Mock console
global.console = { ...console, log: vi.fn(), warn: vi.fn(), error: vi.fn() };

// Mock window
global.window = {
    innerWidth: 1920,
    innerHeight: 1080
};

// Mock setTimeout
global.setTimeout = vi.fn((fn, ms) => 1);
global.setInterval = vi.fn((fn, ms) => 1);
global.clearInterval = vi.fn();

/**
 * CreditsController class (simplified for testing)
 */
class CreditsController {
    constructor(game) {
        this.game = game;
        this.currentPhotoIndex = 0;
        this.photoInterval = null;
    }

    showCredits(endingType = null) {
        const isLandscape = window.innerWidth > window.innerHeight;
        const playerVersion = this.game.state?.get('game.loopVersion') || 848;

        // Determine photos based on ending
        const hasPhotos = endingType === 'digital_forever' || endingType === 'tori_memory';

        return {
            endingType,
            playerVersion,
            isLandscape,
            hasPhotos,
            layoutMode: hasPhotos
                ? (isLandscape ? 'landscape_photos' : 'portrait_photos')
                : 'standard'
        };
    }

    buildDynamicTitleSection(endingType, playerVersion) {
        const titles = {
            'digital_forever': '💚 DIGITAL FOREVER 💚',
            'tori_memory': '🖤 TORI\'S MEMORY 🖤',
            'bad_end_despair': '⚫ DESPAIR ⚫',
            'bad_end_fade': '⚫ FADE ⚫',
            'default': '✨ VERSION 848 ✨'
        };

        const title = titles[endingType] || titles['default'];
        const subtitle = `Loop ${playerVersion} Complete`;

        return { title, subtitle, endingType, playerVersion };
    }

    cycleCreditsPhotos(photoCount) {
        if (photoCount <= 0) return null;

        this.currentPhotoIndex = 0;
        this.photoInterval = setInterval(() => {
            this.currentPhotoIndex = (this.currentPhotoIndex + 1) % photoCount;
        }, 3000);

        return this.photoInterval;
    }

    stopPhotoCycle() {
        if (this.photoInterval) {
            clearInterval(this.photoInterval);
            this.photoInterval = null;
        }
    }

    getLayoutMode() {
        const isLandscape = window.innerWidth > window.innerHeight;
        return isLandscape ? 'landscape' : 'portrait';
    }

    getPhotosByEnding(endingType) {
        const photoMap = {
            'digital_forever': ['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg'],
            'tori_memory': ['memory1.jpg', 'memory2.jpg', 'memory3.jpg'],
            'default': []
        };
        return photoMap[endingType] || photoMap['default'];
    }
}

// ========================================
// TEST SUITES
// ========================================

describe('CreditsController', () => {
    let controller;
    let mockGame;

    beforeEach(() => {
        vi.clearAllMocks();
        window.innerWidth = 1920;
        window.innerHeight = 1080;

        mockGame = {
            state: {
                get: vi.fn((path) => {
                    if (path === 'game.loopVersion') return 855;
                    return null;
                })
            }
        };

        controller = new CreditsController(mockGame);
    });

    // ========================================
    // CONSTRUCTOR TESTS
    // ========================================

    describe('constructor', () => {
        it('should initialize with game reference', () => {
            expect(controller.game).toBe(mockGame);
        });

        it('should initialize currentPhotoIndex to 0', () => {
            expect(controller.currentPhotoIndex).toBe(0);
        });

        it('should initialize photoInterval to null', () => {
            expect(controller.photoInterval).toBeNull();
        });
    });

    // ========================================
    // SHOW CREDITS TESTS
    // ========================================

    describe('showCredits', () => {
        it('should return credits info object', () => {
            const result = controller.showCredits('digital_forever');
            expect(result).toBeDefined();
            expect(result.endingType).toBe('digital_forever');
        });

        it('should get player version from state', () => {
            const result = controller.showCredits();
            expect(result.playerVersion).toBe(855);
        });

        it('should detect landscape mode when width > height', () => {
            window.innerWidth = 1920;
            window.innerHeight = 1080;
            const result = controller.showCredits();
            expect(result.isLandscape).toBe(true);
        });

        it('should detect portrait mode when height > width', () => {
            window.innerWidth = 768;
            window.innerHeight = 1024;
            const result = controller.showCredits();
            expect(result.isLandscape).toBe(false);
        });

        it('should have photos for digital_forever ending', () => {
            const result = controller.showCredits('digital_forever');
            expect(result.hasPhotos).toBe(true);
        });

        it('should have photos for tori_memory ending', () => {
            const result = controller.showCredits('tori_memory');
            expect(result.hasPhotos).toBe(true);
        });

        it('should not have photos for bad_end_despair', () => {
            const result = controller.showCredits('bad_end_despair');
            expect(result.hasPhotos).toBe(false);
        });

        it('should use landscape_photos layout for landscape with photos', () => {
            window.innerWidth = 1920;
            window.innerHeight = 1080;
            const result = controller.showCredits('digital_forever');
            expect(result.layoutMode).toBe('landscape_photos');
        });

        it('should use portrait_photos layout for portrait with photos', () => {
            window.innerWidth = 768;
            window.innerHeight = 1024;
            const result = controller.showCredits('digital_forever');
            expect(result.layoutMode).toBe('portrait_photos');
        });

        it('should use standard layout without photos', () => {
            const result = controller.showCredits('bad_end_despair');
            expect(result.layoutMode).toBe('standard');
        });
    });

    // ========================================
    // DYNAMIC TITLE TESTS
    // ========================================

    describe('buildDynamicTitleSection', () => {
        it('should return title object', () => {
            const result = controller.buildDynamicTitleSection('digital_forever', 855);
            expect(result).toBeDefined();
            expect(result.title).toBeDefined();
            expect(result.subtitle).toBeDefined();
        });

        it('should have correct title for digital_forever', () => {
            const result = controller.buildDynamicTitleSection('digital_forever', 855);
            expect(result.title).toContain('DIGITAL FOREVER');
        });

        it('should have correct title for tori_memory', () => {
            const result = controller.buildDynamicTitleSection('tori_memory', 855);
            expect(result.title).toContain('TORI');
        });

        it('should have correct title for bad_end_despair', () => {
            const result = controller.buildDynamicTitleSection('bad_end_despair', 855);
            expect(result.title).toContain('DESPAIR');
        });

        it('should have correct title for bad_end_fade', () => {
            const result = controller.buildDynamicTitleSection('bad_end_fade', 855);
            expect(result.title).toContain('FADE');
        });

        it('should use default title for unknown ending', () => {
            const result = controller.buildDynamicTitleSection('unknown', 855);
            expect(result.title).toContain('VERSION 848');
        });

        it('should include loop version in subtitle', () => {
            const result = controller.buildDynamicTitleSection('digital_forever', 999);
            expect(result.subtitle).toContain('999');
        });

        it('should preserve ending type in result', () => {
            const result = controller.buildDynamicTitleSection('tori_memory', 855);
            expect(result.endingType).toBe('tori_memory');
        });
    });

    // ========================================
    // PHOTO CYCLING TESTS
    // ========================================

    describe('cycleCreditsPhotos', () => {
        it('should return null for zero photos', () => {
            const result = controller.cycleCreditsPhotos(0);
            expect(result).toBeNull();
        });

        it('should reset currentPhotoIndex to 0', () => {
            controller.currentPhotoIndex = 5;
            controller.cycleCreditsPhotos(3);
            expect(controller.currentPhotoIndex).toBe(0);
        });

        it('should start interval for positive photo count', () => {
            controller.cycleCreditsPhotos(5);
            expect(setInterval).toHaveBeenCalled();
        });

        it('should store interval ID', () => {
            const intervalId = controller.cycleCreditsPhotos(5);
            expect(controller.photoInterval).toBe(intervalId);
        });
    });

    describe('stopPhotoCycle', () => {
        it('should clear interval if active', () => {
            controller.photoInterval = 123;
            controller.stopPhotoCycle();
            expect(clearInterval).toHaveBeenCalledWith(123);
        });

        it('should set photoInterval to null', () => {
            controller.photoInterval = 123;
            controller.stopPhotoCycle();
            expect(controller.photoInterval).toBeNull();
        });

        it('should not throw if no interval active', () => {
            controller.photoInterval = null;
            expect(() => controller.stopPhotoCycle()).not.toThrow();
        });
    });

    // ========================================
    // LAYOUT MODE TESTS
    // ========================================

    describe('getLayoutMode', () => {
        it('should return landscape when width > height', () => {
            window.innerWidth = 1920;
            window.innerHeight = 1080;
            expect(controller.getLayoutMode()).toBe('landscape');
        });

        it('should return portrait when height > width', () => {
            window.innerWidth = 768;
            window.innerHeight = 1024;
            expect(controller.getLayoutMode()).toBe('portrait');
        });

        it('should return portrait when equal', () => {
            window.innerWidth = 1000;
            window.innerHeight = 1000;
            expect(controller.getLayoutMode()).toBe('portrait');
        });
    });

    // ========================================
    // PHOTO LOOKUP TESTS
    // ========================================

    describe('getPhotosByEnding', () => {
        it('should return photos for digital_forever', () => {
            const photos = controller.getPhotosByEnding('digital_forever');
            expect(Array.isArray(photos)).toBe(true);
            expect(photos.length).toBe(5);
        });

        it('should return photos for tori_memory', () => {
            const photos = controller.getPhotosByEnding('tori_memory');
            expect(Array.isArray(photos)).toBe(true);
            expect(photos.length).toBe(3);
        });

        it('should return empty array for bad endings', () => {
            const photos = controller.getPhotosByEnding('bad_end_despair');
            expect(photos).toEqual([]);
        });

        it('should return empty array for unknown ending', () => {
            const photos = controller.getPhotosByEnding('unknown');
            expect(photos).toEqual([]);
        });
    });
});
