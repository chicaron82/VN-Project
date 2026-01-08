/**
 * TetherController Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TetherController } from './TetherController.ts';
import { EventBus } from '../core/EventBus.ts';
import { StateManager } from '../core/StateManager.ts';

describe('TetherController', () => {
  let controller: TetherController;
  let bus: EventBus;
  let state: StateManager;

  beforeEach(() => {
    vi.useFakeTimers();
    bus = new EventBus();
    state = new StateManager(undefined, bus);
    controller = new TetherController({
      eventBus: bus,
      stateManager: state,
      decayRate: 1, // 1 point per second for easy testing
    });
    controller.init();
  });

  afterEach(() => {
    controller.destroy();
    vi.useRealTimers();
  });

  describe('initialization', () => {
    it('should start with full tether', () => {
      expect(controller.getLevel()).toBe(100);
    });

    it('should not be decaying initially', () => {
      expect(controller.isDecayActive()).toBe(false);
    });
  });

  describe('tether manipulation', () => {
    it('should add tether', () => {
      state.set('tetherLevel', 50);
      controller.add(10);
      expect(controller.getLevel()).toBe(60);
    });

    it('should drain tether', () => {
      controller.drain(20);
      expect(controller.getLevel()).toBe(80);
    });

    it('should set level directly', () => {
      controller.setLevel(42);
      expect(controller.getLevel()).toBe(42);
    });

    it('should reset to full', () => {
      controller.drain(50);
      controller.reset();
      expect(controller.getLevel()).toBe(100);
    });

    it('should clamp to 0-100 range', () => {
      controller.drain(200);
      expect(controller.getLevel()).toBe(0);

      controller.add(500);
      expect(controller.getLevel()).toBe(100);
    });
  });

  describe('decay', () => {
    it('should start decay', () => {
      const handler = vi.fn();
      bus.on('tether:decay:start', handler);

      controller.startDecay();

      expect(handler).toHaveBeenCalledWith({ rate: 1 });
      expect(controller.isDecayActive()).toBe(true);
    });

    it('should decay over time', () => {
      controller.startDecay();

      // Advance 1 second (decay rate is 1/sec)
      vi.advanceTimersByTime(1000);

      // Should have decayed by ~1 point
      expect(controller.getLevel()).toBeCloseTo(99, 0);
    });

    it('should stop decay', () => {
      controller.startDecay();
      vi.advanceTimersByTime(500);

      controller.stopDecay();

      const levelAtStop = controller.getLevel();
      vi.advanceTimersByTime(1000);

      // Level should not have changed after stop
      expect(controller.getLevel()).toBe(levelAtStop);
    });

    it('should pause and resume decay', () => {
      controller.startDecay();
      vi.advanceTimersByTime(500);

      controller.pause();
      const levelAtPause = controller.getLevel();

      vi.advanceTimersByTime(1000);
      expect(controller.getLevel()).toBe(levelAtPause);

      controller.resume();
      vi.advanceTimersByTime(1000);
      expect(controller.getLevel()).toBeLessThan(levelAtPause);
    });

    it('should emit pause/resume events', () => {
      const pauseHandler = vi.fn();
      const resumeHandler = vi.fn();
      bus.on('tether:decay:pause', pauseHandler);
      bus.on('tether:decay:resume', resumeHandler);

      controller.startDecay();
      controller.pause();
      controller.resume();

      expect(pauseHandler).toHaveBeenCalled();
      expect(resumeHandler).toHaveBeenCalled();
    });
  });

  describe('status checks', () => {
    it('should detect critical state', () => {
      expect(controller.isCritical()).toBe(false);

      controller.setLevel(15);
      expect(controller.isCritical()).toBe(true);
    });

    it('should detect danger state', () => {
      expect(controller.isInDanger()).toBe(false);

      controller.setLevel(35);
      expect(controller.isInDanger()).toBe(true);
    });

    it('should detect empty state', () => {
      expect(controller.isEmpty()).toBe(false);

      controller.setLevel(0);
      expect(controller.isEmpty()).toBe(true);
    });

    it('should calculate time until empty', () => {
      controller.startDecay(10); // 10 points per second

      const timeUntilEmpty = controller.getTimeUntilEmpty();
      expect(timeUntilEmpty).toBe(10000); // 100 points / 10 per sec = 10 sec
    });

    it('should return null time when not decaying', () => {
      expect(controller.getTimeUntilEmpty()).toBeNull();
    });
  });

  describe('event integration', () => {
    it('should pause on menu open', () => {
      controller.startDecay();
      expect(controller.isDecayActive()).toBe(true);

      bus.emit('ui:menu:open', { menuId: 'pause' });

      expect(controller.isDecayActive()).toBe(false);
    });

    it('should resume on menu close', () => {
      controller.startDecay();
      bus.emit('ui:menu:open', { menuId: 'pause' });
      bus.emit('ui:menu:close', { menuId: 'pause' });

      expect(controller.isDecayActive()).toBe(true);
    });

    it('should stop decay when tether empties', () => {
      controller.startDecay();
      bus.emit('tether:empty');

      expect(controller.isDecayActive()).toBe(false);
    });
  });
});
