/**
 * StateManager Tests
 *
 * Tests reactive state management with subscriptions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StateManager } from './StateManager.ts';
import { EventBus } from './EventBus.ts';

describe('StateManager', () => {
  let state: StateManager;
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus();
    state = new StateManager(undefined, bus);
  });

  describe('initial state', () => {
    it('should have default values', () => {
      const s = state.getState();

      expect(s.currentScene).toBe('');
      expect(s.currentRoute).toBeNull();
      expect(s.currentAct).toBe(1);
      expect(s.tetherLevel).toBe(100);
      expect(s.tetherDecayRate).toBe(0);
      expect(s.tetherPaused).toBe(true);
      expect(s.flags).toEqual({});
      expect(s.counters).toEqual({});
      expect(s.visitedScenes).toEqual([]);
      expect(s.playthrough).toBe(1);
      expect(s.totalPlaytime).toBe(0);
      expect(s.endings).toEqual([]);
      expect(s.notesUnlocked).toEqual([]);
      expect(s.achievementsUnlocked).toEqual([]);
    });

    it('should accept partial initial state', () => {
      const customState = new StateManager({
        currentScene: 'intro',
        tetherLevel: 75,
        flags: { firstMeeting: true },
      });

      expect(customState.get('currentScene')).toBe('intro');
      expect(customState.get('tetherLevel')).toBe(75);
      expect(customState.hasFlag('firstMeeting')).toBe(true);
      // Should still have defaults for non-specified values
      expect(customState.get('currentAct')).toBe(1);
    });
  });

  describe('get/set', () => {
    it('should get and set values', () => {
      state.set('currentScene', 'chapter1');

      expect(state.get('currentScene')).toBe('chapter1');
    });

    it('should not trigger update if value unchanged', () => {
      const handler = vi.fn();
      state.subscribe('currentScene', handler);

      state.set('currentScene', '');
      state.set('currentScene', '');

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update multiple values at once', () => {
      state.update({
        currentScene: 'intro',
        currentRoute: 'ronnie',
        tetherLevel: 80,
      });

      expect(state.get('currentScene')).toBe('intro');
      expect(state.get('currentRoute')).toBe('ronnie');
      expect(state.get('tetherLevel')).toBe(80);
    });
  });

  describe('flags', () => {
    it('should set and check flags', () => {
      expect(state.hasFlag('metRonnie')).toBe(false);

      state.setFlag('metRonnie', true);

      expect(state.hasFlag('metRonnie')).toBe(true);
    });

    it('should toggle flags', () => {
      state.setFlag('debugMode', false);
      state.toggleFlag('debugMode');

      expect(state.hasFlag('debugMode')).toBe(true);

      state.toggleFlag('debugMode');

      expect(state.hasFlag('debugMode')).toBe(false);
    });
  });

  describe('counters', () => {
    it('should default to 0', () => {
      expect(state.getCounter('coffeeCount')).toBe(0);
    });

    it('should set counter value', () => {
      state.setCounter('coffeeCount', 5);

      expect(state.getCounter('coffeeCount')).toBe(5);
    });

    it('should increment counter', () => {
      state.incrementCounter('coffeeCount');
      state.incrementCounter('coffeeCount');
      state.incrementCounter('coffeeCount', 3);

      expect(state.getCounter('coffeeCount')).toBe(5);
    });
  });

  describe('visited scenes', () => {
    it('should mark scenes as visited', () => {
      expect(state.hasVisitedScene('intro')).toBe(false);

      state.markSceneVisited('intro');

      expect(state.hasVisitedScene('intro')).toBe(true);
    });

    it('should not duplicate visited scenes', () => {
      state.markSceneVisited('intro');
      state.markSceneVisited('intro');
      state.markSceneVisited('intro');

      expect(state.get('visitedScenes')).toHaveLength(1);
    });
  });

  describe('tether', () => {
    it('should adjust tether level', () => {
      state.adjustTether(-20);

      expect(state.get('tetherLevel')).toBe(80);
    });

    it('should clamp tether between 0 and 100', () => {
      state.adjustTether(-200);
      expect(state.get('tetherLevel')).toBe(0);

      state.adjustTether(500);
      expect(state.get('tetherLevel')).toBe(100);
    });

    it('should emit tether:change event', () => {
      const handler = vi.fn();
      bus.on('tether:change', handler);

      state.adjustTether(-15, 'choice made');

      expect(handler).toHaveBeenCalledWith({
        level: 85,
        delta: -15,
        reason: 'choice made',
      });
    });

    it('should emit tether:critical when crossing threshold', () => {
      const handler = vi.fn();
      bus.on('tether:critical', handler);

      state.set('tetherLevel', 25);
      state.adjustTether(-10);

      expect(handler).toHaveBeenCalledWith({ level: 15 });
    });

    it('should emit tether:empty when reaching 0', () => {
      const handler = vi.fn();
      bus.on('tether:empty', handler);

      state.set('tetherLevel', 5);
      state.adjustTether(-10);

      expect(handler).toHaveBeenCalled();
    });

    it('should not emit events if tether unchanged', () => {
      const changeHandler = vi.fn();
      bus.on('tether:change', changeHandler);

      state.set('tetherLevel', 100);
      state.adjustTether(10); // Already at max

      expect(changeHandler).not.toHaveBeenCalled();
    });
  });

  describe('subscriptions', () => {
    it('should notify subscribers of changes', () => {
      const handler = vi.fn();
      state.subscribe('tetherLevel', handler);

      state.set('tetherLevel', 75);

      expect(handler).toHaveBeenCalledWith(75, 100);
    });

    it('should only notify relevant subscribers', () => {
      const tetherHandler = vi.fn();
      const sceneHandler = vi.fn();

      state.subscribe('tetherLevel', tetherHandler);
      state.subscribe('currentScene', sceneHandler);

      state.set('tetherLevel', 50);

      expect(tetherHandler).toHaveBeenCalled();
      expect(sceneHandler).not.toHaveBeenCalled();
    });

    it('should unsubscribe correctly', () => {
      const handler = vi.fn();
      const unsubscribe = state.subscribe('tetherLevel', handler);

      state.set('tetherLevel', 90);
      expect(handler).toHaveBeenCalledTimes(1);

      unsubscribe();
      state.set('tetherLevel', 80);

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('unlockNote', () => {
    it('should unlock note and emit event', () => {
      const handler = vi.fn();
      bus.on('note:unlock', handler);

      state.unlockNote('ronnie-backstory');

      expect(state.get('notesUnlocked')).toContain('ronnie-backstory');
      expect(handler).toHaveBeenCalledWith({ id: 'ronnie-backstory' });
    });

    it('should not duplicate notes or emit multiple events', () => {
      const handler = vi.fn();
      bus.on('note:unlock', handler);

      state.unlockNote('ronnie-backstory');
      state.unlockNote('ronnie-backstory');

      expect(state.get('notesUnlocked')).toHaveLength(1);
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('unlockAchievement', () => {
    it('should unlock achievement and emit event', () => {
      const handler = vi.fn();
      bus.on('achievement:unlock', handler);

      state.unlockAchievement('first-playthrough');

      expect(state.get('achievementsUnlocked')).toContain('first-playthrough');
      expect(handler).toHaveBeenCalledWith({ id: 'first-playthrough' });
    });
  });

  describe('snapshot/restore', () => {
    it('should create snapshot of current state', () => {
      state.set('currentScene', 'chapter2');
      state.setFlag('metRonnie', true);
      state.set('tetherLevel', 50);

      const snapshot = state.snapshot();

      expect(snapshot.currentScene).toBe('chapter2');
      expect(snapshot.flags.metRonnie).toBe(true);
      expect(snapshot.tetherLevel).toBe(50);
    });

    it('should restore from snapshot', () => {
      state.set('currentScene', 'chapter5');
      state.set('tetherLevel', 10);

      const snapshot = state.snapshot();

      // Change state
      state.set('currentScene', 'chapter10');
      state.set('tetherLevel', 99);

      // Restore
      state.restore(snapshot);

      expect(state.get('currentScene')).toBe('chapter5');
      expect(state.get('tetherLevel')).toBe(10);
    });

    it('should notify subscribers after restore', () => {
      const handler = vi.fn();
      state.subscribe('currentScene', handler);

      state.set('currentScene', 'before');
      const snapshot = state.snapshot();

      state.set('currentScene', 'after');

      // Reset mock to track only restore notification
      handler.mockClear();

      state.restore(snapshot);

      expect(handler).toHaveBeenCalledWith('before', 'after');
    });

    it('snapshot should be a deep copy', () => {
      state.setFlag('original', true);
      const snapshot = state.snapshot();

      state.setFlag('original', false);
      state.setFlag('new', true);

      expect(snapshot.flags.original).toBe(true);
      expect(snapshot.flags.new).toBeUndefined();
    });
  });

  describe('reset', () => {
    it('should reset to default state', () => {
      state.set('currentScene', 'chapter99');
      state.set('tetherLevel', 5);
      state.setFlag('everything', true);

      state.reset();

      expect(state.get('currentScene')).toBe('');
      expect(state.get('tetherLevel')).toBe(100);
      expect(state.hasFlag('everything')).toBe(false);
    });
  });

  describe('history/undo', () => {
    it('should not record history by default', () => {
      state.set('tetherLevel', 50);

      expect(state.undo()).toBe(false);
    });

    it('should record and undo when history enabled', () => {
      state.enableHistory();

      state.set('tetherLevel', 90);
      state.set('tetherLevel', 80);
      state.set('tetherLevel', 70);

      expect(state.undo()).toBe(true);
      expect(state.get('tetherLevel')).toBe(80);

      expect(state.undo()).toBe(true);
      expect(state.get('tetherLevel')).toBe(90);
    });

    it('should respect max history size', () => {
      state.enableHistory(2);

      state.set('tetherLevel', 90);
      state.set('tetherLevel', 80);
      state.set('tetherLevel', 70);

      // Can only undo twice
      expect(state.undo()).toBe(true);
      expect(state.undo()).toBe(true);
      expect(state.undo()).toBe(false);
    });

    it('should notify subscribers on undo', () => {
      state.enableHistory();
      const handler = vi.fn();
      state.subscribe('tetherLevel', handler);

      state.set('tetherLevel', 50);
      handler.mockClear();

      state.undo();

      expect(handler).toHaveBeenCalledWith(100, 50);
    });

    it('should clear history', () => {
      state.enableHistory();
      state.set('tetherLevel', 50);
      state.set('tetherLevel', 40);

      state.clearHistory();

      expect(state.undo()).toBe(false);
    });
  });
});
