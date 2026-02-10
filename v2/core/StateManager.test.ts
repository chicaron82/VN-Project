import { StateManager } from './StateManager';

describe('StateManager', () => {
  let stateManager: StateManager;

  beforeEach(() => {
    stateManager = new StateManager();
    localStorage.clear();
  });

  describe('Basic get/set operations', () => {
    it('should get and set values', () => {
      stateManager.set('test.value', 42);
      expect(stateManager.get('test.value')).toBe(42);
    });

    it('should handle nested paths', () => {
      stateManager.set('game.currentScene', 'scene1_coffee');
      expect(stateManager.get('game.currentScene')).toBe('scene1_coffee');
    });

    it('should return undefined for non-existent paths', () => {
      expect(stateManager.get('does.not.exist')).toBeUndefined();
    });

    it('should handle setting null values', () => {
      stateManager.set('test.nullable', null);
      expect(stateManager.get('test.nullable')).toBeNull();
    });

    it('should handle setting boolean values', () => {
      stateManager.set('game.paused', true);
      expect(stateManager.get('game.paused')).toBe(true);
    });

    it('should handle setting string values', () => {
      stateManager.set('game.currentRoute', 'ronnie');
      expect(stateManager.get('game.currentRoute')).toBe('ronnie');
    });
  });

  describe('Deep cloning', () => {
    it('should return deep clones to prevent mutations', () => {
      const obj = { nested: { value: 42 } };
      stateManager.set('test.object', obj);

      const retrieved = stateManager.get('test.object') as { nested: { value: number } };
      retrieved.nested.value = 99;

      // Original state should be unchanged
      const original = stateManager.get('test.object') as { nested: { value: number } };
      expect(original.nested.value).toBe(42);
    });

    it('should deep clone on set to prevent external mutations', () => {
      const obj = { value: 42 };
      stateManager.set('test.object', obj);

      obj.value = 99;

      // State should have original value
      const stateValue = stateManager.get('test.object') as { value: number };
      expect(stateValue.value).toBe(42);
    });

    it('should handle arrays correctly', () => {
      const arr = [1, 2, 3];
      stateManager.set('test.array', arr);

      const retrieved = stateManager.get('test.array') as number[];
      retrieved.push(4);

      // Original state should be unchanged
      const original = stateManager.get('test.array') as number[];
      expect(original).toEqual([1, 2, 3]);
    });
  });

  describe('Reactive subscriptions', () => {
    it('should notify subscribers on change', () => {
      const callback = vi.fn();

      stateManager.subscribe('test.value', callback);
      stateManager.set('test.value', 42);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(42, undefined);
    });

    it('should pass old and new values to callback', () => {
      const callback = vi.fn();

      stateManager.set('test.value', 10);
      stateManager.subscribe('test.value', callback);
      stateManager.set('test.value', 20);

      expect(callback).toHaveBeenCalledWith(20, 10);
    });

    it('should not notify if value unchanged', () => {
      const callback = vi.fn();

      stateManager.set('test.value', 42);
      stateManager.subscribe('test.value', callback);
      stateManager.set('test.value', 42); // Same value

      expect(callback).not.toHaveBeenCalled();
    });

    it('should support multiple subscribers for same path', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      stateManager.subscribe('test.value', callback1);
      stateManager.subscribe('test.value', callback2);
      stateManager.set('test.value', 42);

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should allow unsubscribing', () => {
      const callback = vi.fn();

      const unsubscribe = stateManager.subscribe('test.value', callback);
      stateManager.set('test.value', 1);
      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();
      stateManager.set('test.value', 2);
      expect(callback).toHaveBeenCalledTimes(1); // Should not increase
    });

    it('should handle errors in callbacks gracefully', () => {
      const errorCallback = vi.fn(() => {
        throw new Error('Callback error');
      });
      const goodCallback = vi.fn();

      stateManager.subscribe('test.value', errorCallback);
      stateManager.subscribe('test.value', goodCallback);

      // Should not throw
      expect(() => {
        stateManager.set('test.value', 42);
      }).not.toThrow();

      // Good callback should still be called
      expect(goodCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Persistence', () => {
    it('should save state to localStorage', () => {
      stateManager.set('test.value', 42);
      stateManager.save();

      const saved = localStorage.getItem('vn_state');
      expect(saved).toBeTruthy();

      const parsed = JSON.parse(saved!);
      expect(parsed.test?.value).toBe(42);
    });

    it('should load state from localStorage', () => {
      const testState = { test: { value: 42 } };
      localStorage.setItem('vn_state', JSON.stringify(testState));

      const loaded = stateManager.load();
      expect(loaded).toBe(true);
      expect(stateManager.get('test.value')).toBe(42);
    });

    it('should return false if no state to load', () => {
      const loaded = stateManager.load();
      expect(loaded).toBe(false);
    });

    it('should notify subscribers after loading', () => {
      const callback = vi.fn();

      localStorage.setItem('vn_state', JSON.stringify({ test: { value: 42 } }));
      stateManager.subscribe('test.value', callback);

      stateManager.load();
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('getAll and setAll', () => {
    it('should get all state', () => {
      stateManager.set('test.value1', 1);
      stateManager.set('test.value2', 2);

      const all = stateManager.getAll();
      expect(all.test?.value1).toBe(1);
      expect(all.test?.value2).toBe(2);
    });

    it('should return deep clone from getAll', () => {
      stateManager.set('test.object', { value: 42 });

      const all = stateManager.getAll();
      (all.test as { object: { value: number } }).object.value = 99;

      // Original should be unchanged
      expect((stateManager.get('test.object') as { value: number }).value).toBe(42);
    });

    it('should replace entire state with setAll', () => {
      stateManager.set('test.value1', 1);
      stateManager.setAll({ test: { value2: 2 } });

      expect(stateManager.get('test.value1')).toBeUndefined();
      expect(stateManager.get('test.value2')).toBe(2);
    });
  });

  describe('Initial state', () => {
    it('should initialize with provided state', () => {
      const initialState = { game: { currentScene: 'scene1' } };
      const manager = new StateManager(undefined, initialState);

      expect(manager.get('game.currentScene')).toBe('scene1');
    });

    it('should use custom persistence key', () => {
      const manager = new StateManager(undefined, {}, 'custom_key');
      manager.set('test.value', 42);
      manager.save();

      expect(localStorage.getItem('custom_key')).toBeTruthy();
      expect(localStorage.getItem('vn_state')).toBeNull();
    });
  });
});
