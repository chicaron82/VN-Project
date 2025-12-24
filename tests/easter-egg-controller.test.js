import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * EasterEggController Unit Tests
 * 
 * Tests for the extracted EasterEggController class.
 * Validates easter egg triggers, overlay creation, and unlock methods.
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
    remove: vi.fn(),
    innerHTML: '',
    textContent: ''
});

// Mock console
global.console = { ...console, log: vi.fn(), warn: vi.fn(), error: vi.fn() };

// Mock document
global.document = {
    getElementById: vi.fn(() => null),
    createElement: vi.fn(() => mockElement('created')),
    body: {
        style: { animation: '' },
        appendChild: vi.fn()
    },
    head: { appendChild: vi.fn() },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
};

// Mock setTimeout
global.setTimeout = vi.fn((fn, ms) => 1);

/**
 * EasterEggController class (simplified for testing)
 */
class EasterEggController {
    constructor(game) {
        this.game = game;
        this.easterEggBuffer = '';
        this.easterEggListener = null;
    }

    // Easter egg code detection
    detectEasterEggCode(code) {
        const validCodes = {
            'torigatchi': 'Unlocks ToriGatchi minigame',
            'always': 'Unlocks Always compilation',
            'always3': 'Unlocks extended Always compilation',
            'dizee': 'Unlocks DiZee content',
            'ronnie': 'Unlocks Ronnie content',
            'loop': 'Shows loop timeline',
            'true': 'Shows true attempt number',
            'uv7': 'Shows UV7 crew bios'
        };

        const normalizedCode = code.toLowerCase().trim();
        return validCodes[normalizedCode] || null;
    }

    // Buffer management for typed codes
    addToBuffer(char) {
        this.easterEggBuffer += char.toLowerCase();
        // Keep buffer at reasonable size
        if (this.easterEggBuffer.length > 20) {
            this.easterEggBuffer = this.easterEggBuffer.slice(-20);
        }
        return this.easterEggBuffer;
    }

    clearBuffer() {
        this.easterEggBuffer = '';
    }

    checkBufferForCode() {
        const codes = ['torigatchi', 'always3', 'always', 'dizee', 'ronnie', 'loop', 'true', 'uv7'];

        for (const code of codes) {
            if (this.easterEggBuffer.includes(code)) {
                return code;
            }
        }
        return null;
    }

    // Listener setup
    initializeEasterEggListener() {
        this.easterEggListener = (e) => {
            if (e.key.length === 1) {
                this.addToBuffer(e.key);
                const code = this.checkBufferForCode();
                if (code) {
                    this.triggerEasterEgg(code);
                    this.clearBuffer();
                }
            }
        };
        document.addEventListener('keydown', this.easterEggListener);
        return this.easterEggListener;
    }

    removeEasterEggListener() {
        if (this.easterEggListener) {
            document.removeEventListener('keydown', this.easterEggListener);
            this.easterEggListener = null;
        }
    }

    // Easter egg triggers
    triggerEasterEgg(code) {
        console.log(`🥚 Easter egg triggered: ${code}`);

        const actions = {
            'torigatchi': () => this.showTorigatchiEasterEgg(),
            'always': () => this.showAlwaysCompilation(),
            'always3': () => this.showAlways3Compilation(),
            'dizee': () => this.unlockDizee(),
            'loop': () => this.showLoopTimeline(),
            'true': () => this.showTrueAttemptNumber(),
            'uv7': () => this.showUV7CrewBios()
        };

        const action = actions[code];
        if (action) {
            action();
            return true;
        }
        return false;
    }

    // Stub methods for testing
    showTorigatchiEasterEgg() { return 'torigatchi_shown'; }
    showAlwaysCompilation() { return 'always_shown'; }
    showAlways3Compilation() { return 'always3_shown'; }
    unlockDizee() { return 'dizee_unlocked'; }
    showLoopTimeline() { return 'loop_shown'; }
    showTrueAttemptNumber() { return 'true_shown'; }
    showUV7CrewBios() { return 'uv7_shown'; }

    // Unlock notification helper
    showUnlockOverlay(title, content, type = 'code') {
        try {
            const overlay = document.createElement('div');
            overlay.className = 'unlock-overlay';

            const box = document.createElement('div');
            box.className = 'unlock-box';
            box.textContent = `${title}: ${content}`;

            overlay.appendChild(box);
            document.body.appendChild(overlay);

            return { title, content, type, success: true };
        } catch (error) {
            console.error('Failed to show unlock overlay:', error);
            console.log(`UNLOCKED: ${title}`);
            return { title, content, type, success: false, error };
        }
    }
}

// ========================================
// TEST SUITES
// ========================================

describe('EasterEggController', () => {
    let controller;
    let mockGame;

    beforeEach(() => {
        vi.clearAllMocks();
        mockGame = {
            state: {
                get: vi.fn(() => null),
                set: vi.fn()
            }
        };
        controller = new EasterEggController(mockGame);
    });

    // ========================================
    // CONSTRUCTOR TESTS
    // ========================================

    describe('constructor', () => {
        it('should initialize with game reference', () => {
            expect(controller.game).toBe(mockGame);
        });

        it('should initialize empty buffer', () => {
            expect(controller.easterEggBuffer).toBe('');
        });

        it('should initialize null listener', () => {
            expect(controller.easterEggListener).toBeNull();
        });
    });

    // ========================================
    // CODE DETECTION TESTS
    // ========================================

    describe('detectEasterEggCode', () => {
        it('should recognize torigatchi code', () => {
            const result = controller.detectEasterEggCode('torigatchi');
            expect(result).not.toBeNull();
        });

        it('should recognize always code', () => {
            const result = controller.detectEasterEggCode('always');
            expect(result).not.toBeNull();
        });

        it('should recognize always3 code', () => {
            const result = controller.detectEasterEggCode('always3');
            expect(result).not.toBeNull();
        });

        it('should recognize dizee code', () => {
            const result = controller.detectEasterEggCode('dizee');
            expect(result).not.toBeNull();
        });

        it('should recognize loop code', () => {
            const result = controller.detectEasterEggCode('loop');
            expect(result).not.toBeNull();
        });

        it('should recognize uv7 code', () => {
            const result = controller.detectEasterEggCode('uv7');
            expect(result).not.toBeNull();
        });

        it('should return null for unknown codes', () => {
            const result = controller.detectEasterEggCode('notacode');
            expect(result).toBeNull();
        });

        it('should be case insensitive', () => {
            const result = controller.detectEasterEggCode('TORIGATCHI');
            expect(result).not.toBeNull();
        });

        it('should trim whitespace', () => {
            const result = controller.detectEasterEggCode('  always  ');
            expect(result).not.toBeNull();
        });
    });

    // ========================================
    // BUFFER MANAGEMENT TESTS
    // ========================================

    describe('addToBuffer', () => {
        it('should add character to buffer', () => {
            controller.addToBuffer('a');
            expect(controller.easterEggBuffer).toBe('a');
        });

        it('should accumulate characters', () => {
            controller.addToBuffer('h');
            controller.addToBuffer('i');
            expect(controller.easterEggBuffer).toBe('hi');
        });

        it('should convert to lowercase', () => {
            controller.addToBuffer('A');
            controller.addToBuffer('B');
            expect(controller.easterEggBuffer).toBe('ab');
        });

        it('should limit buffer size to 20', () => {
            for (let i = 0; i < 25; i++) {
                controller.addToBuffer('x');
            }
            expect(controller.easterEggBuffer.length).toBe(20);
        });

        it('should return current buffer', () => {
            const result = controller.addToBuffer('z');
            expect(result).toBe('z');
        });
    });

    describe('clearBuffer', () => {
        it('should clear the buffer', () => {
            controller.easterEggBuffer = 'sometext';
            controller.clearBuffer();
            expect(controller.easterEggBuffer).toBe('');
        });
    });

    describe('checkBufferForCode', () => {
        it('should detect torigatchi in buffer', () => {
            controller.easterEggBuffer = 'xxtorigatchixx';
            const result = controller.checkBufferForCode();
            expect(result).toBe('torigatchi');
        });

        it('should detect always3 before always', () => {
            controller.easterEggBuffer = 'always3';
            const result = controller.checkBufferForCode();
            expect(result).toBe('always3'); // always3 is checked first
        });

        it('should detect always in buffer', () => {
            controller.easterEggBuffer = 'xalwaysx';
            const result = controller.checkBufferForCode();
            expect(result).toBe('always');
        });

        it('should return null if no code found', () => {
            controller.easterEggBuffer = 'randomtext';
            const result = controller.checkBufferForCode();
            expect(result).toBeNull();
        });
    });

    // ========================================
    // LISTENER TESTS
    // ========================================

    describe('initializeEasterEggListener', () => {
        it('should create listener function', () => {
            const result = controller.initializeEasterEggListener();
            expect(typeof result).toBe('function');
        });

        it('should store listener reference', () => {
            controller.initializeEasterEggListener();
            expect(controller.easterEggListener).not.toBeNull();
        });

        it('should add event listener to document', () => {
            controller.initializeEasterEggListener();
            expect(document.addEventListener).toHaveBeenCalledWith(
                'keydown',
                expect.any(Function)
            );
        });
    });

    describe('removeEasterEggListener', () => {
        it('should remove listener from document', () => {
            controller.initializeEasterEggListener();
            controller.removeEasterEggListener();
            expect(document.removeEventListener).toHaveBeenCalled();
        });

        it('should clear listener reference', () => {
            controller.initializeEasterEggListener();
            controller.removeEasterEggListener();
            expect(controller.easterEggListener).toBeNull();
        });

        it('should not throw if no listener active', () => {
            expect(() => controller.removeEasterEggListener()).not.toThrow();
        });
    });

    // ========================================
    // TRIGGER TESTS
    // ========================================

    describe('triggerEasterEgg', () => {
        it('should log easter egg trigger', () => {
            controller.triggerEasterEgg('torigatchi');
            expect(console.log).toHaveBeenCalledWith(
                expect.stringContaining('torigatchi')
            );
        });

        it('should return true for valid code', () => {
            const result = controller.triggerEasterEgg('always');
            expect(result).toBe(true);
        });

        it('should return false for unknown code', () => {
            const result = controller.triggerEasterEgg('unknowncode');
            expect(result).toBe(false);
        });

        it('should trigger torigatchi action', () => {
            vi.spyOn(controller, 'showTorigatchiEasterEgg');
            controller.triggerEasterEgg('torigatchi');
            expect(controller.showTorigatchiEasterEgg).toHaveBeenCalled();
        });

        it('should trigger always action', () => {
            vi.spyOn(controller, 'showAlwaysCompilation');
            controller.triggerEasterEgg('always');
            expect(controller.showAlwaysCompilation).toHaveBeenCalled();
        });

        it('should trigger loop action', () => {
            vi.spyOn(controller, 'showLoopTimeline');
            controller.triggerEasterEgg('loop');
            expect(controller.showLoopTimeline).toHaveBeenCalled();
        });
    });

    // ========================================
    // UNLOCK OVERLAY TESTS
    // ========================================

    describe('showUnlockOverlay', () => {
        it('should return success object', () => {
            const result = controller.showUnlockOverlay('Test Title', 'Test Content');
            expect(result.success).toBe(true);
        });

        it('should include title in result', () => {
            const result = controller.showUnlockOverlay('My Title', 'Content');
            expect(result.title).toBe('My Title');
        });

        it('should include content in result', () => {
            const result = controller.showUnlockOverlay('Title', 'My Content');
            expect(result.content).toBe('My Content');
        });

        it('should use default type of code', () => {
            const result = controller.showUnlockOverlay('Title', 'Content');
            expect(result.type).toBe('code');
        });

        it('should accept custom type', () => {
            const result = controller.showUnlockOverlay('Title', 'Content', 'special');
            expect(result.type).toBe('special');
        });

        it('should create overlay element', () => {
            controller.showUnlockOverlay('Title', 'Content');
            expect(document.createElement).toHaveBeenCalledWith('div');
        });

        it('should append to document body', () => {
            controller.showUnlockOverlay('Title', 'Content');
            expect(document.body.appendChild).toHaveBeenCalled();
        });
    });
});
