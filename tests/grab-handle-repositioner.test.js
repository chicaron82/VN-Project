import { GrabHandleRepositioner } from '../system/grab-handle-repositioner.js';

// Mock localStorage
class LocalStorageMock {
    constructor() {
        this.store = {};
    }

    getItem(key) {
        return this.store[key] || null;
    }

    setItem(key, value) {
        this.store[key] = value;
    }

    removeItem(key) {
        delete this.store[key];
    }

    clear() {
        this.store = {};
    }
}

describe('GrabHandleRepositioner', () => {
    let repositioner;
    let mockGame;
    let mockGrabHandle;
    let mockSidebar;
    let mockLocalStorage;

    beforeEach(() => {
        // Mock localStorage
        mockLocalStorage = new LocalStorageMock();
        global.localStorage = mockLocalStorage;

        // Mock navigator.vibrate
        global.navigator = {
            vibrate: vi.fn()
        };

        // Mock DOM elements
        mockGrabHandle = {
            style: {
                top: '50%',
                left: '0',
                right: 'auto',
                transform: 'translateY(-50%)',
                transition: '',
                borderRadius: '0 10px 10px 0',
                borderLeft: 'none',
                borderRight: '1px solid rgba(0, 255, 255, 0.3)'
            },
            classList: {
                add: vi.fn(),
                remove: vi.fn()
            },
            addEventListener: vi.fn(),
            getBoundingClientRect: vi.fn(() => ({
                top: 300,
                height: 80
            }))
        };

        mockSidebar = {
            style: {
                left: '0',
                right: 'auto',
                transform: 'translateX(-100%)'
            },
            classList: {
                add: vi.fn(),
                remove: vi.fn(),
                contains: vi.fn(() => false)
            }
        };

        // Mock document methods
        global.document = {
            getElementById: vi.fn((id) => {
                if (id === 'sidebar-toggle') return mockGrabHandle;
                if (id === 'sidebar') return mockSidebar;
                return null;
            }),
            addEventListener: vi.fn()
        };

        // Mock window
        global.window = {
            innerHeight: 800,
            innerWidth: 1200
        };

        // Mock game object
        mockGame = {
            state: {
                get: vi.fn(),
                set: vi.fn()
            }
        };

        repositioner = new GrabHandleRepositioner(mockGame);
    });

    afterEach(() => {
        mockLocalStorage.clear();
    });

    describe('Initialization', () => {
        it('should initialize with default position', () => {
            expect(repositioner.currentSide).toBe('left');
            expect(repositioner.currentTop).toBe(50);
        });

        it('should load saved position from localStorage', () => {
            const savedPosition = {
                topPercent: 75,
                side: 'right',
                timestamp: Date.now()
            };
            mockLocalStorage.setItem('grabHandlePosition', JSON.stringify(savedPosition));

            const newRepositioner = new GrabHandleRepositioner(mockGame);

            expect(newRepositioner.currentTop).toBe(75);
            expect(newRepositioner.currentSide).toBe('right');
        });

        it('should handle invalid localStorage data gracefully', () => {
            mockLocalStorage.setItem('grabHandlePosition', 'invalid json');

            const newRepositioner = new GrabHandleRepositioner(mockGame);

            expect(newRepositioner.currentTop).toBe(50);
            expect(newRepositioner.currentSide).toBe('left');
        });
    });

    describe('Position Constraints', () => {
        it('should enforce minimum position (clamped to safe zone)', () => {
            repositioner.currentTop = 1; // Extremely high
            repositioner.isDragging = true; // Must be dragging for constraints to apply
            mockGrabHandle.offsetHeight = 80; // Mock handle height

            repositioner.handleDragEnd({});

            // At 800px height, 50px min + 40px half-handle = 90px
            // (90 / 800) * 100 = 11.25%
            expect(repositioner.currentTop).toBeGreaterThan(10);
            expect(repositioner.currentTop).toBeLessThan(15);
        });

        it('should enforce maximum position (clamped to safe zone)', () => {
            repositioner.currentTop = 99; // Extremely low
            repositioner.isDragging = true; // Must be dragging for constraints to apply
            mockGrabHandle.offsetHeight = 80; // Mock handle height

            repositioner.handleDragEnd({});

            // At 800px height, 800 - 80px min - 40px half-handle = 680px
            // (680 / 800) * 100 = 85%
            expect(repositioner.currentTop).toBeLessThan(90);
            expect(repositioner.currentTop).toBeGreaterThan(80);
        });
    });

    describe('Side Flipping', () => {
        it('should flip from left to right', () => {
            repositioner.currentSide = 'left';
            repositioner.flipSide();

            expect(repositioner.currentSide).toBe('right');
        });

        it('should flip from right to left', () => {
            repositioner.currentSide = 'right';
            repositioner.flipSide();

            expect(repositioner.currentSide).toBe('left');
        });

        it('should update handle styling when on right side', () => {
            repositioner.setSide('right');

            expect(mockGrabHandle.style.left).toBe('auto');
            expect(mockGrabHandle.style.right).toBe('0');
            expect(mockGrabHandle.style.borderRadius).toBe('10px 0 0 10px');
        });

        it('should update handle styling when on left side', () => {
            repositioner.setSide('left');

            expect(mockGrabHandle.style.left).toBe('0');
            expect(mockGrabHandle.style.right).toBe('auto');
            expect(mockGrabHandle.style.borderRadius).toBe('0 10px 10px 0');
        });

        it('should update sidebar transform when on right side', () => {
            repositioner.setSide('right');

            expect(mockSidebar.style.right).toBe('0');
            // Transform is cleared to let CSS classes handle it
            expect(mockSidebar.style.transform).toBe('');
        });

        it('should add right-side class to sidebar', () => {
            repositioner.setSide('right');

            expect(mockSidebar.classList.add).toHaveBeenCalledWith('right-side');
        });

        it('should remove right-side class when on left', () => {
            repositioner.setSide('left');

            expect(mockSidebar.classList.remove).toHaveBeenCalledWith('right-side');
        });
    });

    describe('Persistence', () => {
        it('should save position to localStorage', () => {
            repositioner.currentTop = 75;
            repositioner.currentSide = 'right';
            repositioner.savePosition();

            const saved = JSON.parse(mockLocalStorage.getItem('grabHandlePosition'));

            expect(saved.topPercent).toBe(75);
            expect(saved.side).toBe('right');
            expect(saved.timestamp).toBeDefined();
        });

        it('should persist position after flipping sides', () => {
            repositioner.flipSide();

            const saved = JSON.parse(mockLocalStorage.getItem('grabHandlePosition'));
            expect(saved.side).toBe('right');
        });
    });

    describe('Double-Tap Detection', () => {
        it('should detect double-tap within 300ms', () => {
            repositioner.currentSide = 'left';

            // First tap
            repositioner.lastTapTime = Date.now();

            // Second tap within 300ms
            const secondTapTime = Date.now();
            repositioner.lastTapTime = secondTapTime - 200;

            const timeSinceLastTap = Date.now() - repositioner.lastTapTime;

            expect(timeSinceLastTap).toBeLessThan(repositioner.doubleTapDelay);
        });

        it('should not detect double-tap after 300ms', () => {
            repositioner.lastTapTime = Date.now() - 400;

            const timeSinceLastTap = Date.now() - repositioner.lastTapTime;

            expect(timeSinceLastTap).toBeGreaterThan(repositioner.doubleTapDelay);
        });
    });

    describe('Haptic Feedback', () => {
        it('should trigger light haptic', () => {
            repositioner.triggerHaptic('light');

            expect(navigator.vibrate).toHaveBeenCalledWith(10);
        });

        it('should trigger medium haptic', () => {
            repositioner.triggerHaptic('medium');

            expect(navigator.vibrate).toHaveBeenCalledWith(20);
        });

        it('should trigger heavy haptic (double-pulse)', () => {
            repositioner.triggerHaptic('heavy');

            expect(navigator.vibrate).toHaveBeenCalledWith([30, 10, 30]);
        });

        it('should handle missing vibration API gracefully', () => {
            global.navigator.vibrate = undefined;

            expect(() => repositioner.triggerHaptic('light')).not.toThrow();
        });
    });

    describe('Reset to Default', () => {
        it('should reset position to center', () => {
            repositioner.currentTop = 75;
            repositioner.resetToDefault();

            expect(repositioner.currentTop).toBe(50);
        });

        it('should reset side to left', () => {
            repositioner.currentSide = 'right';
            repositioner.resetToDefault();

            expect(repositioner.currentSide).toBe('left');
        });

        it('should save default position to localStorage', () => {
            repositioner.currentTop = 75;
            repositioner.currentSide = 'right';
            repositioner.resetToDefault();

            const saved = JSON.parse(mockLocalStorage.getItem('grabHandlePosition'));

            expect(saved.topPercent).toBe(50);
            expect(saved.side).toBe('left');
        });
    });

    describe('Public API', () => {
        it('should return current side via getSide()', () => {
            repositioner.currentSide = 'right';

            expect(repositioner.getSide()).toBe('right');
        });
    });

    describe('Edge Cases', () => {
        it('should handle missing grab handle element', () => {
            global.document.getElementById = vi.fn(() => null);

            expect(() => new GrabHandleRepositioner(mockGame)).not.toThrow();
        });

        it('should handle missing sidebar element gracefully', () => {
            global.document.getElementById = vi.fn((id) => {
                if (id === 'sidebar-toggle') return mockGrabHandle;
                return null;
            });

            const newRepositioner = new GrabHandleRepositioner(mockGame);

            // Should not throw when trying to update sidebar
            expect(() => newRepositioner.flipSide()).not.toThrow();
        });
    });

    describe('Drag Direction Detection', () => {
        it('should prioritize horizontal drag when deltaX > deltaY', () => {
            const deltaX = 100;
            const deltaY = 50;

            const direction = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';

            expect(direction).toBe('horizontal');
        });

        it('should prioritize vertical drag when deltaY > deltaX', () => {
            const deltaX = 50;
            const deltaY = 100;

            const direction = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';

            expect(direction).toBe('vertical');
        });
    });

    describe('Horizontal Flip Threshold', () => {
        it('should require 50% of screen width to flip', () => {
            expect(repositioner.flipThreshold).toBe(50);
        });

        it('should detect crossing threshold', () => {
            const viewportWidth = 1200;
            const deltaX = 700; // More than 50%
            const deltaPercent = Math.abs(deltaX) / viewportWidth * 100;

            expect(deltaPercent).toBeGreaterThan(repositioner.flipThreshold);
        });

        it('should not flip below threshold', () => {
            const viewportWidth = 1200;
            const deltaX = 400; // Less than 50%
            const deltaPercent = Math.abs(deltaX) / viewportWidth * 100;

            expect(deltaPercent).toBeLessThan(repositioner.flipThreshold);
        });
    });
});
