/**
 * UV7 V2 Entry Point
 *
 * "The Proper Way" - A clean rebuild of VERSION 848
 */

import './style.css';
import { eventBus, stateManager } from './core/index.ts';

// Debug: Enable event history in development
if (import.meta.env.DEV) {
  eventBus.enableHistory(100);

  // Log all events to console
  eventBus.onAny((event, payload) => {
    console.log(`[UV7] ${event}`, payload);
  });

  // Make state accessible in console for debugging
  (window as unknown as { uv7: unknown }).uv7 = {
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

// Placeholder UI until we build the real thing
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div style="
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-family: monospace;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #00ffff;
  ">
    <h1 style="font-size: 3rem; margin-bottom: 0.5rem;">UV7 V2</h1>
    <p style="color: #ff00ff; font-style: italic;">"The Proper Way"</p>

    <div style="
      margin-top: 2rem;
      padding: 1.5rem;
      background: rgba(0, 255, 255, 0.1);
      border: 1px solid #00ffff;
      border-radius: 8px;
      text-align: left;
    ">
      <p style="margin: 0 0 1rem 0; color: #00ff00;">✓ Phase 1 Foundation Complete</p>
      <ul style="margin: 0; padding-left: 1.5rem; color: #aaa;">
        <li>TypeScript strict mode</li>
        <li>EventBus with full test coverage</li>
        <li>StateManager with subscriptions</li>
        <li>59 passing tests</li>
      </ul>
    </div>

    <p style="margin-top: 2rem; color: #666; font-size: 0.8rem;">
      Built with 💜 by the UV7 Family
    </p>
  </div>
`;

// Ready!
eventBus.emit('ui:notification', {
  message: 'UV7 V2 initialized',
  type: 'info',
});
