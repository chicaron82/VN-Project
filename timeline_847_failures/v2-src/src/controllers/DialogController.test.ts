/**
 * DialogController Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DialogController } from './DialogController.ts';
import { EventBus } from '../core/EventBus.ts';
import { SettingsSystem } from '../systems/SettingsSystem.ts';
import type { DialogEntry, Choice } from '../core/index.ts';

describe('DialogController', () => {
  let controller: DialogController;
  let bus: EventBus;
  let settings: SettingsSystem;

  const mockDialog: DialogEntry[] = [
    { speaker: 'ronnie', text: 'Hello there!' },
    { speaker: 'tori', text: 'Hi Ronnie!' },
    { speaker: 'narrator', text: 'They smiled at each other.' },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    bus = new EventBus();
    settings = new SettingsSystem({ storageKey: 'test-settings' });
    controller = new DialogController({
      eventBus: bus,
      settingsSystem: settings,
    });
    controller.init();
  });

  afterEach(() => {
    controller.destroy();
    vi.useRealTimers();
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should start in idle state', () => {
      expect(controller.getState()).toBe('idle');
      expect(controller.isActive()).toBe(false);
    });
  });

  describe('dialog flow', () => {
    it('should start dialog sequence', () => {
      const handler = vi.fn();
      bus.on('dialog:start', handler);

      controller.startDialog(mockDialog);

      expect(handler).toHaveBeenCalledWith({ entries: mockDialog });
      expect(controller.isActive()).toBe(true);
    });

    it('should emit dialog:show for current entry', () => {
      const handler = vi.fn();
      bus.on('dialog:show', handler);

      controller.startDialog(mockDialog);

      expect(handler).toHaveBeenCalledWith({
        entry: mockDialog[0],
        index: 0,
      });
    });

    it('should show instant text when speed is instant', () => {
      settings.set('textSpeed', 'instant');

      controller.startDialog(mockDialog);

      expect(controller.getDisplayedText()).toBe('Hello there!');
      expect(controller.getState()).toBe('waiting');
    });

    it('should typewriter text with normal speed', () => {
      settings.set('textSpeed', 'normal'); // 30ms per char

      controller.startDialog(mockDialog);

      expect(controller.getState()).toBe('typing');
      expect(controller.getDisplayedText()).toBe('');

      // Advance through typing - "Hello there!" = 12 chars
      // Need 13 intervals: 12 to type + 1 more to trigger completion check
      vi.advanceTimersByTime(30 * 13);

      expect(controller.getDisplayedText()).toBe('Hello there!');
      expect(controller.getState()).toBe('waiting');
    });

    it('should advance to next entry', () => {
      settings.set('textSpeed', 'instant');

      controller.startDialog(mockDialog);
      expect(controller.getCurrentEntry()?.text).toBe('Hello there!');

      controller.advance();
      expect(controller.getCurrentEntry()?.text).toBe('Hi Ronnie!');

      controller.advance();
      expect(controller.getCurrentEntry()?.text).toBe('They smiled at each other.');
    });

    it('should complete dialog after last entry', () => {
      const handler = vi.fn();
      bus.on('dialog:complete', handler);
      settings.set('textSpeed', 'instant');

      controller.startDialog(mockDialog);
      controller.advance(); // -> entry 2
      controller.advance(); // -> entry 3
      controller.advance(); // -> complete

      expect(handler).toHaveBeenCalled();
      expect(controller.isActive()).toBe(false);
    });

    it('should skip typing when advance called during typing', () => {
      settings.set('textSpeed', 'slow'); // 60ms per char

      controller.startDialog(mockDialog);
      expect(controller.isTyping()).toBe(true);

      controller.advance();

      expect(controller.getDisplayedText()).toBe('Hello there!');
      expect(controller.getState()).toBe('waiting');
    });
  });

  describe('skipAll', () => {
    it('should skip all remaining dialog', () => {
      const handler = vi.fn();
      bus.on('dialog:complete', handler);
      settings.set('textSpeed', 'instant');

      controller.startDialog(mockDialog);
      controller.skipAll();

      expect(handler).toHaveBeenCalled();
      expect(controller.isActive()).toBe(false);
    });
  });

  describe('progress tracking', () => {
    it('should track progress through dialog', () => {
      settings.set('textSpeed', 'instant');

      controller.startDialog(mockDialog);
      expect(controller.getProgress()).toEqual({ current: 1, total: 3 });

      controller.advance();
      expect(controller.getProgress()).toEqual({ current: 2, total: 3 });

      controller.advance();
      expect(controller.getProgress()).toEqual({ current: 3, total: 3 });
    });
  });

  describe('choices', () => {
    const mockChoices: Choice[] = [
      { text: 'Be nice', next: 'scene-nice' },
      { text: 'Be mean', next: 'scene-mean', tetherCost: -10 },
    ];

    it('should show choices', () => {
      const handler = vi.fn();
      bus.on('choice:show', handler);

      controller.showChoices(mockChoices, () => {});

      expect(handler).toHaveBeenCalledWith({ choices: mockChoices });
      expect(controller.isChoosing()).toBe(true);
    });

    it('should handle choice selection', () => {
      const selectHandler = vi.fn();
      const eventHandler = vi.fn();
      bus.on('choice:selected', eventHandler);

      controller.showChoices(mockChoices, selectHandler);
      controller.selectChoice(1);

      expect(selectHandler).toHaveBeenCalledWith(mockChoices[1], 1);
      expect(eventHandler).toHaveBeenCalledWith({
        choice: mockChoices[1],
        index: 1,
      });
      expect(controller.isChoosing()).toBe(false);
    });

    it('should return visible choices', () => {
      controller.showChoices(mockChoices, () => {});

      const visible = controller.getVisibleChoices();
      expect(visible).toHaveLength(2);
    });

    it('should not allow advance during choosing', () => {
      settings.set('textSpeed', 'instant');
      controller.startDialog([mockDialog[0]]);
      controller.showChoices(mockChoices, () => {});

      // Advance should do nothing
      const state = controller.getState();
      controller.advance();
      expect(controller.getState()).toBe(state);
    });
  });

  describe('auto-advance', () => {
    it('should auto-advance when enabled', () => {
      settings.set('autoAdvance', true);
      settings.set('autoAdvanceDelay', 1000);
      settings.set('textSpeed', 'instant');

      const handler = vi.fn();
      bus.on('dialog:advance', handler);

      controller.startDialog(mockDialog);

      // Wait for auto-advance delay
      vi.advanceTimersByTime(1000);

      expect(handler).toHaveBeenCalled();
    });

    it('should not auto-advance when disabled', () => {
      settings.set('autoAdvance', false);
      settings.set('textSpeed', 'instant');

      const handler = vi.fn();
      bus.on('dialog:advance', handler);

      controller.startDialog(mockDialog);
      vi.advanceTimersByTime(5000);

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    it('should clear all dialog state', () => {
      settings.set('textSpeed', 'instant');
      controller.startDialog(mockDialog);

      controller.clear();

      expect(controller.isActive()).toBe(false);
      expect(controller.getDisplayedText()).toBe('');
      expect(controller.getCurrentEntry()).toBeNull();
    });
  });
});
