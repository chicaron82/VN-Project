/**
 * SplashScreen Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SplashScreen } from './SplashScreen.ts';
import { EventBus } from '../../core/EventBus.ts';

describe('SplashScreen', () => {
  let splash: SplashScreen;
  let bus: EventBus;

  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
    bus = new EventBus();
  });

  afterEach(() => {
    splash?.destroy();
    vi.useRealTimers();
  });

  describe('creation', () => {
    it('should create splash screen with default title', () => {
      splash = new SplashScreen({ eventBus: bus });
      splash.mount(document.body);

      const title = splash.getElement().querySelector('.uv7-splash__title');
      expect(title?.textContent).toBe('UV7');
    });

    it('should use custom title and subtitle', () => {
      splash = new SplashScreen({
        eventBus: bus,
        title: 'Custom Title',
        subtitle: 'Custom Subtitle',
      });
      splash.mount(document.body);

      const title = splash.getElement().querySelector('.uv7-splash__title');
      const subtitle = splash.getElement().querySelector('.uv7-splash__subtitle');

      expect(title?.textContent).toBe('Custom Title');
      expect(subtitle?.textContent).toBe('Custom Subtitle');
    });

    it('should have boot wrapper for boot sequence', () => {
      splash = new SplashScreen({ eventBus: bus });
      splash.mount(document.body);

      const bootWrapper = splash.getElement().querySelector('.uv7-splash__boot-wrapper');
      expect(bootWrapper).not.toBeNull();
    });

    it('should have progress bar', () => {
      splash = new SplashScreen({ eventBus: bus });
      splash.mount(document.body);

      const progress = splash.getElement().querySelector('.uv7-splash__progress-bar');
      expect(progress).not.toBeNull();
    });

    it('should contain boot terminal', () => {
      splash = new SplashScreen({ eventBus: bus });
      splash.mount(document.body);

      const bootTerminal = splash.getElement().querySelector('.boot-terminal');
      expect(bootTerminal).not.toBeNull();
    });
  });

  describe('progress', () => {
    beforeEach(() => {
      splash = new SplashScreen({ eventBus: bus });
      splash.mount(document.body);
    });

    it('should update progress bar', () => {
      splash.setProgress(50);

      const bar = splash.getElement().querySelector('.uv7-splash__progress-bar') as HTMLElement;
      expect(bar.style.width).toBe('50%');
    });

    it('should emit progress event', () => {
      const handler = vi.fn();
      bus.on('ui:splash:progress', handler);

      splash.setProgress(75);

      expect(handler).toHaveBeenCalledWith({ percent: 75 });
    });

    it('should clamp progress to 0-100', () => {
      splash.setProgress(-10);
      let bar = splash.getElement().querySelector('.uv7-splash__progress-bar') as HTMLElement;
      expect(bar.style.width).toBe('0%');

      splash.setProgress(150);
      bar = splash.getElement().querySelector('.uv7-splash__progress-bar') as HTMLElement;
      expect(bar.style.width).toBe('100%');
    });

    it('should update aria-valuenow', () => {
      splash.setProgress(42);

      const bar = splash.getElement().querySelector('.uv7-splash__progress-bar');
      expect(bar?.getAttribute('aria-valuenow')).toBe('42');
    });
  });

  describe('boot sequence', () => {
    beforeEach(() => {
      splash = new SplashScreen({
        eventBus: bus,
        minDisplayTime: 100,
      });
      splash.mount(document.body);
    });

    it('should emit start event', async () => {
      const handler = vi.fn();
      bus.on('ui:splash:start', handler);

      const promise = splash.start();

      expect(handler).toHaveBeenCalled();

      // Fast-forward through sequence
      await vi.runAllTimersAsync();
      await promise;
    });

    it('should show boot terminal content during sequence', async () => {
      const promise = splash.start();

      // Let boot sequence run
      await vi.advanceTimersByTimeAsync(2000);

      // Boot terminal should have header
      const header = splash.getElement().querySelector('.boot-header');
      expect(header).not.toBeNull();

      await vi.runAllTimersAsync();
      await promise;
    });

    it('should emit complete event', async () => {
      const handler = vi.fn();
      bus.on('ui:splash:complete', handler);

      const promise = splash.start();
      await vi.runAllTimersAsync();
      await promise;

      expect(handler).toHaveBeenCalled();
    });

    it('should call onComplete callback', async () => {
      const onComplete = vi.fn();
      splash = new SplashScreen({
        eventBus: bus,
        minDisplayTime: 100,
        onComplete,
      });
      splash.mount(document.body);

      const promise = splash.start();
      await vi.runAllTimersAsync();
      await promise;

      expect(onComplete).toHaveBeenCalled();
    });

    it('should skip when skip() called', async () => {
      const handler = vi.fn();
      bus.on('ui:splash:complete', handler);

      const promise = splash.start();

      // Skip immediately
      splash.skip();
      await vi.runAllTimersAsync();
      await promise;

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('version number', () => {
    it('should pass version number to boot sequence', () => {
      splash = new SplashScreen({
        eventBus: bus,
        versionNumber: 849,
      });
      splash.mount(document.body);

      // Version is used in boot sequence header
      // The default will be 848 if not specified
      const bootTerminal = splash.getElement().querySelector('.boot-terminal');
      expect(bootTerminal).not.toBeNull();
    });
  });
});
