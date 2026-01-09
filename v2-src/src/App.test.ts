/**
 * App Integration Tests
 *
 * Tests the app bootstrap and basic flow.
 * Note: Full E2E tests would use Playwright - these are lightweight integration tests.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { App } from './App.ts';
import { eventBus } from './core/EventBus.ts';
import { stateManager } from './core/StateManager.ts';

// Mock window.matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('App', () => {
  let app: App;
  let container: HTMLElement;

  beforeEach(() => {
    // Create container
    container = document.createElement('div');
    container.id = 'game';
    document.body.appendChild(container);

    // Reset state
    stateManager.reset();
    eventBus.removeAllListeners();

    // Create app
    app = new App({ container });
  });

  afterEach(() => {
    app.destroy();
    if (container.parentNode) {
      document.body.removeChild(container);
    }
    eventBus.removeAllListeners();
  });

  describe('Initialization', () => {
    it('should create app instance', () => {
      expect(app).toBeDefined();
    });

    it('should start with loading state', () => {
      expect(app.getState()).toBe('loading');
    });

    it('should skip splash and go to menu when skipSplash is true', async () => {
      await app.start(true);
      expect(app.getState()).toBe('menu');
    });
  });

  describe('Cleanup', () => {
    it('should clean up on destroy without errors', async () => {
      await app.start(true);
      expect(() => app.destroy()).not.toThrow();
    });
  });
});

describe('App Event Handling', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    stateManager.reset();
    eventBus.removeAllListeners();

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
    eventBus.removeAllListeners();
  });

  it('should register event handlers during start', async () => {
    const app = new App({ container });
    await app.start(true);

    // Verify dialog:complete handler is registered
    expect(eventBus.hasListeners('dialog:complete')).toBe(true);

    // Verify tether:empty handler is registered
    expect(eventBus.hasListeners('tether:empty')).toBe(true);

    // Verify menu handlers are registered
    expect(eventBus.hasListeners('ui:menu:open')).toBe(true);
    expect(eventBus.hasListeners('ui:menu:close')).toBe(true);

    app.destroy();
  });
});

describe('App System Bootstrap', () => {
  it('should log system initialization', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const initLog: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      const msg = args.join(' ');
      if (msg.includes('Initializing') || msg.includes('All systems')) {
        initLog.push(msg);
      }
    };

    const app = new App({ container });
    await app.start(true);

    console.log = originalLog;

    // Verify key systems were initialized
    expect(initLog.some((l) => l.includes('SettingsSystem'))).toBe(true);
    expect(initLog.some((l) => l.includes('SaveSystem'))).toBe(true);
    expect(initLog.some((l) => l.includes('RouteController'))).toBe(true);
    expect(initLog.some((l) => l.includes('EasterEggController'))).toBe(true);
    expect(initLog.some((l) => l.includes('All systems initialized'))).toBe(true);

    app.destroy();
    document.body.removeChild(container);
  });
});
