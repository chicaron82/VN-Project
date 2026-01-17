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
