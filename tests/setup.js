// Test setup file
// Runs before each test suite

import { vi } from 'vitest';
import { Logger } from '../v2/utils/Logger';

// Keep test output readable by default.
// Individual tests can re-enable logging if they need to assert on it.
Logger.setEnabled(false);

// Optional: silence noisy console output during tests.
// Enable with `UV7_SILENCE_TEST_CONSOLE=1`.
if (process?.env?.UV7_SILENCE_TEST_CONSOLE === '1') {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
}

// Mock localStorage for Node environment
global.localStorage = {
    store: {},
    getItem(key) {
        return this.store[key] || null;
    },
    setItem(key, value) {
        this.store[key] = String(value);
    },
    removeItem(key) {
        delete this.store[key];
    },
    clear() {
        this.store = {};
    }
};

// Mock window.matchMedia for orientation queries
global.window = global.window || {};
global.window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
});

// Don't mock console - let tests spy on it as needed
// Tests can use vi.spyOn(console, 'log').mockImplementation(() => {}) to suppress if needed
