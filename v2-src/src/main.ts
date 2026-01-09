/**
 * UV7 V2 Entry Point
 *
 * "The Proper Way" - Application bootstrap and initialization.
 */

import { App } from './App.ts';
import { eventBus, stateManager } from './core/index.ts';
import './styles/main.css';

// Wait for DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app');

  if (!container) {
    console.error('[UV7] Container element #app not found!');
    return;
  }

  // Create and start the app
  const app = new App({ container });

  // Check for dev mode skip splash
  const skipSplash = new URLSearchParams(window.location.search).has('skip');

  // Debug: Enable event history in development
  if (import.meta.env.DEV) {
    eventBus.enableHistory(100);

    // Log all events to console
    eventBus.onAny((event, payload) => {
      console.log(`[UV7] ${event}`, payload);
    });

    // Make state accessible in console for debugging
    (window as unknown as { uv7: unknown }).uv7 = {
      app,
      eventBus,
      stateManager,
      getState: () => stateManager.getState(),
      getHistory: () => eventBus.getHistory(),
    };

    console.log(
      '%c UV7 V2 ',
      'background: #ff00ff; color: white; font-weight: bold; padding: 4px 8px;',
      'Debug mode enabled. Access via window.uv7'
    );
  }

  app.start(skipSplash).catch((error) => {
    console.error('[UV7] Failed to start application:', error);
  });
});
