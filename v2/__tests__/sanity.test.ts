/**
 * Sanity Tests
 * Basic tests to verify the test infrastructure works
 * Using globals: describe, it, expect are available globally
 */

describe('Sanity Checks', () => {
    it('should perform basic math', () => {
        expect(1 + 1).toBe(2);
        expect(2 * 3).toBe(6);
    });

    it('should handle strings', () => {
        expect('hello').toBe('hello');
        expect('world'.toUpperCase()).toBe('WORLD');
    });

    it('should work with arrays', () => {
        const arr = [1, 2, 3];
        expect(arr).toHaveLength(3);
        expect(arr[0]).toBe(1);
    });

    it('should work with objects', () => {
        const obj = { name: 'UV7', version: 2 };
        expect(obj.name).toBe('UV7');
        expect(obj).toHaveProperty('version');
    });
});
