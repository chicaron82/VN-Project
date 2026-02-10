import { StateManager } from '../system/state-manager.js';

describe('StateManager', () => {
    let state;

    beforeEach(() => {
        state = new StateManager();
        localStorage.clear();
    });

    describe('Basic get/set operations', () => {
        it('should get and set values', () => {
            state.set('test.value', 42);
            expect(state.get('test.value')).toBe(42);
        });

        it('should handle nested paths', () => {
            state.set('game.settings.volume', 0.8);
            expect(state.get('game.settings.volume')).toBe(0.8);
        });

        it('should return undefined for non-existent paths', () => {
            expect(state.get('does.not.exist')).toBeUndefined();
        });

        it('should handle setting null values', () => {
            state.set('test.nullable', null);
            expect(state.get('test.nullable')).toBeNull();
        });
    });

    describe('Deep cloning', () => {
        it('should return deep clones to prevent mutations', () => {
            const obj = { nested: { value: 42 } };
            state.set('test.object', obj);

            const retrieved = state.get('test.object');
            retrieved.nested.value = 99;

            // Original state should be unchanged
            expect(state.get('test.object').nested.value).toBe(42);
        });

        it('should deep clone on set to prevent external mutations', () => {
            const obj = { value: 42 };
            state.set('test.object', obj);

            obj.value = 99;

            // State should have original value
            expect(state.get('test.object').value).toBe(42);
        });
    });

    describe('Reactive subscriptions', () => {
        it('should notify subscribers on change', () => {
            let called = false;
            let newValue, oldValue;

            state.subscribe('test.value', (nv, ov) => {
                called = true;
                newValue = nv;
                oldValue = ov;
            });

            state.set('test.value', 42);

            expect(called).toBe(true);
            expect(newValue).toBe(42);
            expect(oldValue).toBeUndefined();
        });

        it('should not notify if value unchanged', () => {
            state.set('test.value', 42);

            let callCount = 0;
            state.subscribe('test.value', () => {
                callCount++;
            });

            state.set('test.value', 42); // Same value

            expect(callCount).toBe(0);
        });

        it('should allow unsubscribing', () => {
            let callCount = 0;
            const unsubscribe = state.subscribe('test.value', () => {
                callCount++;
            });

            state.set('test.value', 1);
            expect(callCount).toBe(1);

            unsubscribe();
            state.set('test.value', 2);

            expect(callCount).toBe(1); // Should not increase
        });

        it('should support multiple subscribers', () => {
            let count1 = 0, count2 = 0;

            state.subscribe('test.value', () => { count1++; });
            state.subscribe('test.value', () => { count2++; });

            state.set('test.value', 42);

            expect(count1).toBe(1);
            expect(count2).toBe(1);
        });
    });

    describe('Persistence', () => {
        it('should save to localStorage', () => {
            state.set('test.value', 42);
            state.save();

            const saved = JSON.parse(localStorage.getItem('vn_state'));
            expect(saved.test.value).toBe(42);
        });

        it('should load from localStorage', () => {
            const savedState = { test: { value: 42 } };
            localStorage.setItem('vn_state', JSON.stringify(savedState));

            const newState = new StateManager();
            newState.load();

            expect(newState.get('test.value')).toBe(42);
        });

        it('should not save if state unchanged (dirty flag)', () => {
            state.save(); // First save
            const firstSave = localStorage.getItem('vn_state');

            state.save(); // Second save without changes
            const secondSave = localStorage.getItem('vn_state');

            expect(firstSave).toBe(secondSave);
        });

        it('should reset state and clear localStorage', () => {
            state.set('test.value', 42);
            state.save();

            state.reset();

            expect(state.get('test.value')).toBeUndefined();
            expect(localStorage.getItem('vn_state')).toBeNull();
        });
    });

    describe('Snapshots', () => {
        it('should create snapshots', () => {
            state.set('test.value', 42);
            const snapshot = state.createSnapshot('test');

            expect(snapshot.name).toBe('test');
            expect(snapshot.state.test.value).toBe(42);
            expect(snapshot.timestamp).toBeDefined();
        });

        it('should restore from snapshots', () => {
            state.set('test.value', 42);
            const snapshot = state.createSnapshot();

            state.set('test.value', 99);
            expect(state.get('test.value')).toBe(99);

            state.restoreSnapshot(snapshot);
            expect(state.get('test.value')).toBe(42);
        });

        it('should support quick save/load', () => {
            state.set('test.value', 42);
            state.quickSave('checkpoint');

            state.set('test.value', 99);
            expect(state.get('test.value')).toBe(99);

            state.quickLoad('checkpoint');
            expect(state.get('test.value')).toBe(42);
        });
    });

    describe('Batch operations', () => {
        it('should batch set multiple values', () => {
            state.batchSet({
                'test.value1': 1,
                'test.value2': 2,
                'test.value3': 3
            });

            expect(state.get('test.value1')).toBe(1);
            expect(state.get('test.value2')).toBe(2);
            expect(state.get('test.value3')).toBe(3);
        });

        it('should batch get multiple values', () => {
            state.set('test.value1', 1);
            state.set('test.value2', 2);

            const results = state.batchGet(['test.value1', 'test.value2']);

            expect(results['test.value1']).toBe(1);
            expect(results['test.value2']).toBe(2);
        });
    });

    describe('Utility methods', () => {
        it('should check if path exists', () => {
            state.set('test.value', 42);

            expect(state.has('test.value')).toBe(true);
            expect(state.has('test.missing')).toBe(false);
        });

        it('should increment numeric values', () => {
            state.set('test.counter', 5);

            state.increment('test.counter');
            expect(state.get('test.counter')).toBe(6);

            state.increment('test.counter', 10);
            expect(state.get('test.counter')).toBe(16);
        });

        it('should toggle boolean values', () => {
            state.set('test.flag', false);

            state.toggle('test.flag');
            expect(state.get('test.flag')).toBe(true);

            state.toggle('test.flag');
            expect(state.get('test.flag')).toBe(false);
        });

        it('should merge objects', () => {
            state.set('test.config', { a: 1, b: 2 });
            state.merge('test.config', { b: 3, c: 4 });

            const config = state.get('test.config');
            expect(config.a).toBe(1);
            expect(config.b).toBe(3);
            expect(config.c).toBe(4);
        });
    });
});
