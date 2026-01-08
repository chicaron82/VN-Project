/**
 * EventBus Tests
 *
 * Tests the type-safe event system for game-wide communication.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventBus } from './EventBus.ts';

describe('EventBus', () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus();
  });

  describe('on/emit', () => {
    it('should call handler when event is emitted', () => {
      const handler = vi.fn();
      bus.on('scene:load', handler);

      bus.emit('scene:load', { sceneId: 'intro' });

      expect(handler).toHaveBeenCalledWith({ sceneId: 'intro' });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should handle events with no payload', () => {
      const handler = vi.fn();
      bus.on('tether:empty', handler);

      bus.emit('tether:empty');

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should call multiple handlers for same event', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      bus.on('scene:load', handler1);
      bus.on('scene:load', handler2);

      bus.emit('scene:load', { sceneId: 'intro' });

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should not call handler for different event', () => {
      const handler = vi.fn();
      bus.on('scene:load', handler);

      bus.emit('scene:complete', { sceneId: 'intro' });

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('off', () => {
    it('should unsubscribe handler', () => {
      const handler = vi.fn();
      bus.on('scene:load', handler);

      bus.emit('scene:load', { sceneId: 'first' });
      expect(handler).toHaveBeenCalledTimes(1);

      bus.off('scene:load', handler);
      bus.emit('scene:load', { sceneId: 'second' });

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should return unsubscribe function from on()', () => {
      const handler = vi.fn();
      const unsubscribe = bus.on('scene:load', handler);

      bus.emit('scene:load', { sceneId: 'first' });
      expect(handler).toHaveBeenCalledTimes(1);

      unsubscribe();
      bus.emit('scene:load', { sceneId: 'second' });

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('once', () => {
    it('should only call handler once', () => {
      const handler = vi.fn();
      bus.once('scene:load', handler);

      bus.emit('scene:load', { sceneId: 'first' });
      bus.emit('scene:load', { sceneId: 'second' });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({ sceneId: 'first' });
    });

    it('should return unsubscribe function', () => {
      const handler = vi.fn();
      const unsubscribe = bus.once('scene:load', handler);

      unsubscribe();
      bus.emit('scene:load', { sceneId: 'never' });

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('priority', () => {
    it('should call higher priority handlers first', () => {
      const order: number[] = [];

      bus.on('scene:load', () => order.push(1), { priority: 1 });
      bus.on('scene:load', () => order.push(3), { priority: 3 });
      bus.on('scene:load', () => order.push(2), { priority: 2 });

      bus.emit('scene:load', { sceneId: 'test' });

      expect(order).toEqual([3, 2, 1]);
    });

    it('should default to priority 0', () => {
      const order: number[] = [];

      bus.on('scene:load', () => order.push(0));
      bus.on('scene:load', () => order.push(10), { priority: 10 });
      bus.on('scene:load', () => order.push(-5), { priority: -5 });

      bus.emit('scene:load', { sceneId: 'test' });

      expect(order).toEqual([10, 0, -5]);
    });
  });

  describe('onAny (wildcard)', () => {
    it('should receive all events', () => {
      const handler = vi.fn();
      bus.onAny(handler);

      bus.emit('scene:load', { sceneId: 'intro' });
      bus.emit('tether:change', { level: 50, delta: -10 });
      bus.emit('tether:empty');

      expect(handler).toHaveBeenCalledTimes(3);
      expect(handler).toHaveBeenNthCalledWith(1, 'scene:load', { sceneId: 'intro' });
      expect(handler).toHaveBeenNthCalledWith(2, 'tether:change', { level: 50, delta: -10 });
      expect(handler).toHaveBeenNthCalledWith(3, 'tether:empty', undefined);
    });

    it('should return unsubscribe function', () => {
      const handler = vi.fn();
      const unsubscribe = bus.onAny(handler);

      bus.emit('scene:load', { sceneId: 'first' });
      unsubscribe();
      bus.emit('scene:load', { sceneId: 'second' });

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('hasListeners / listenerCount', () => {
    it('should return false when no listeners', () => {
      expect(bus.hasListeners('scene:load')).toBe(false);
      expect(bus.listenerCount('scene:load')).toBe(0);
    });

    it('should return true when listeners exist', () => {
      bus.on('scene:load', () => {});
      bus.on('scene:load', () => {});

      expect(bus.hasListeners('scene:load')).toBe(true);
      expect(bus.listenerCount('scene:load')).toBe(2);
    });

    it('should update after unsubscribe', () => {
      const handler = vi.fn();
      bus.on('scene:load', handler);

      expect(bus.listenerCount('scene:load')).toBe(1);

      bus.off('scene:load', handler);

      expect(bus.hasListeners('scene:load')).toBe(false);
      expect(bus.listenerCount('scene:load')).toBe(0);
    });
  });

  describe('removeAllListeners', () => {
    it('should remove all listeners for specific event', () => {
      bus.on('scene:load', () => {});
      bus.on('scene:load', () => {});
      bus.on('scene:complete', () => {});

      bus.removeAllListeners('scene:load');

      expect(bus.hasListeners('scene:load')).toBe(false);
      expect(bus.hasListeners('scene:complete')).toBe(true);
    });

    it('should remove all listeners when no event specified', () => {
      bus.on('scene:load', () => {});
      bus.on('scene:complete', () => {});
      bus.onAny(() => {});

      bus.removeAllListeners();

      expect(bus.hasListeners('scene:load')).toBe(false);
      expect(bus.hasListeners('scene:complete')).toBe(false);
    });
  });

  describe('history', () => {
    it('should not record history by default', () => {
      bus.emit('scene:load', { sceneId: 'test' });

      expect(bus.getHistory()).toHaveLength(0);
    });

    it('should record history when enabled', () => {
      bus.enableHistory();

      bus.emit('scene:load', { sceneId: 'intro' });
      bus.emit('tether:change', { level: 90, delta: -10 });

      const history = bus.getHistory();
      expect(history).toHaveLength(2);
      expect(history[0].event).toBe('scene:load');
      expect(history[0].payload).toEqual({ sceneId: 'intro' });
      expect(history[1].event).toBe('tether:change');
    });

    it('should respect max history size', () => {
      bus.enableHistory(3);

      bus.emit('scene:load', { sceneId: '1' });
      bus.emit('scene:load', { sceneId: '2' });
      bus.emit('scene:load', { sceneId: '3' });
      bus.emit('scene:load', { sceneId: '4' });

      const history = bus.getHistory();
      expect(history).toHaveLength(3);
      expect(history[0].payload).toEqual({ sceneId: '2' });
    });

    it('should clear history', () => {
      bus.enableHistory();
      bus.emit('scene:load', { sceneId: 'test' });

      bus.clearHistory();

      expect(bus.getHistory()).toHaveLength(0);
    });

    it('should stop recording when disabled', () => {
      bus.enableHistory();
      bus.emit('scene:load', { sceneId: 'recorded' });

      bus.disableHistory();
      bus.emit('scene:load', { sceneId: 'not-recorded' });

      expect(bus.getHistory()).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    it('should handle emitting to event with no listeners', () => {
      expect(() => {
        bus.emit('scene:load', { sceneId: 'test' });
      }).not.toThrow();
    });

    it('should handle removing non-existent listener', () => {
      expect(() => {
        bus.off('scene:load', () => {});
      }).not.toThrow();
    });

    it('should handle unsubscribe during emit', () => {
      const handler1 = vi.fn();
      const handler3 = vi.fn();

      let unsubscribe2: () => void;
      const handler2 = vi.fn(() => {
        unsubscribe2();
      });

      bus.on('scene:load', handler1);
      unsubscribe2 = bus.on('scene:load', handler2);
      bus.on('scene:load', handler3);

      bus.emit('scene:load', { sceneId: 'test' });

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
      expect(handler3).toHaveBeenCalled();
    });
  });
});
