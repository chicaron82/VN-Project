import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventBus } from './EventBus';

describe('EventBus', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  describe('Event subscription and emission', () => {
    it('should subscribe to and emit events', () => {
      const callback = vi.fn();
      
      eventBus.on('scene:load', callback);
      eventBus.emit('scene:load', { sceneId: 'scene1_coffee' });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({ sceneId: 'scene1_coffee' });
    });

    it('should support multiple subscribers for the same event', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      eventBus.on('scene:load', callback1);
      eventBus.on('scene:load', callback2);
      eventBus.emit('scene:load', { sceneId: 'scene1_coffee' });

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should support different event types', () => {
      const sceneCallback = vi.fn();
      const tetherCallback = vi.fn();
      
      eventBus.on('scene:load', sceneCallback);
      eventBus.on('tether:change', tetherCallback);
      
      eventBus.emit('scene:load', { sceneId: 'scene1_coffee' });
      eventBus.emit('tether:change', { level: 85, delta: -5 });

      expect(sceneCallback).toHaveBeenCalledWith({ sceneId: 'scene1_coffee' });
      expect(tetherCallback).toHaveBeenCalledWith({ level: 85, delta: -5 });
    });
  });

  describe('Unsubscription', () => {
    it('should unsubscribe using returned function', () => {
      const callback = vi.fn();
      
      const unsubscribe = eventBus.on('scene:load', callback);
      eventBus.emit('scene:load', { sceneId: 'scene1' });
      
      unsubscribe();
      eventBus.emit('scene:load', { sceneId: 'scene2' });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({ sceneId: 'scene1' });
    });

    it('should unsubscribe using off method', () => {
      const callback = vi.fn();
      
      eventBus.on('scene:load', callback);
      eventBus.emit('scene:load', { sceneId: 'scene1' });
      
      eventBus.off('scene:load', callback);
      eventBus.emit('scene:load', { sceneId: 'scene2' });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple unsubscribes gracefully', () => {
      const callback = vi.fn();
      const unsubscribe = eventBus.on('scene:load', callback);
      
      unsubscribe();
      unsubscribe(); // Should not throw
      unsubscribe(); // Should not throw

      eventBus.emit('scene:load', { sceneId: 'scene1' });
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Event history', () => {
    it('should record events in history', () => {
      eventBus.emit('scene:load', { sceneId: 'scene1' });
      eventBus.emit('tether:change', { level: 85, delta: -5 });

      const history = eventBus.getHistory();
      expect(history).toHaveLength(2);
      expect(history[0]?.event).toBe('scene:load');
      expect(history[0]?.data).toEqual({ sceneId: 'scene1' });
      expect(history[1]?.event).toBe('tether:change');
    });

    it('should limit history size', () => {
      const bus = new EventBus(5); // Max 5 entries
      
      for (let i = 0; i < 10; i++) {
        bus.emit('scene:load', { sceneId: `scene${i}` });
      }

      const history = bus.getHistory();
      expect(history).toHaveLength(5);
      expect(history[0]?.data).toEqual({ sceneId: 'scene5' }); // Oldest should be scene5
      expect(history[4]?.data).toEqual({ sceneId: 'scene9' }); // Newest should be scene9
    });

    it('should clear history', () => {
      eventBus.emit('scene:load', { sceneId: 'scene1' });
      expect(eventBus.getHistory()).toHaveLength(1);
      
      eventBus.clearHistory();
      expect(eventBus.getHistory()).toHaveLength(0);
    });

    it('should disable history when requested', () => {
      const bus = new EventBus(100, false);
      
      bus.emit('scene:load', { sceneId: 'scene1' });
      expect(bus.getHistory()).toHaveLength(0);
      
      bus.setHistoryEnabled(true);
      bus.emit('scene:load', { sceneId: 'scene2' });
      expect(bus.getHistory()).toHaveLength(1);
    });
  });

  describe('Error handling', () => {
    it('should handle errors in callbacks gracefully', () => {
      const errorCallback = vi.fn(() => {
        throw new Error('Callback error');
      });
      const goodCallback = vi.fn();
      
      eventBus.on('scene:load', errorCallback);
      eventBus.on('scene:load', goodCallback);
      
      // Should not throw
      expect(() => {
        eventBus.emit('scene:load', { sceneId: 'scene1' });
      }).not.toThrow();

      // Good callback should still be called
      expect(goodCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Clear subscribers', () => {
    it('should clear all subscribers for a specific event', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();
      
      eventBus.on('scene:load', callback1);
      eventBus.on('scene:load', callback2);
      eventBus.on('tether:change', callback3);
      
      eventBus.clear('scene:load');
      eventBus.emit('scene:load', { sceneId: 'scene1' });
      eventBus.emit('tether:change', { level: 85, delta: -5 });

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
      expect(callback3).toHaveBeenCalledTimes(1);
    });

    it('should clear all subscribers when no event specified', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      eventBus.on('scene:load', callback1);
      eventBus.on('tether:change', callback2);
      
      eventBus.clear();
      eventBus.emit('scene:load', { sceneId: 'scene1' });
      eventBus.emit('tether:change', { level: 85, delta: -5 });

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });
  });
});
