// Test setup file
// Runs before each test suite

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
global.window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
}));

// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    log: () => { }, // Suppress logs in tests
    warn: () => { }, // Suppress warnings in tests
    error: console.error // Keep errors visible
};
