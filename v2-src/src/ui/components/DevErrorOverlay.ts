/**
 * DevErrorOverlay
 *
 * Shows scene validation errors as an overlay in development mode.
 * Makes errors actionable with route/scene/field information.
 */

import { Component } from './Component.ts';
import { eventBus } from '../../core/EventBus.ts';

export interface SceneError {
  sceneId: string;
  route?: string;
  act?: number;
  errors: Array<{
    path: string;
    message: string;
  }>;
}

export class DevErrorOverlay extends Component {
  private errors: SceneError[] = [];
  private errorList: HTMLElement | null = null;

  constructor() {
    super({ className: 'uv7-dev-error-overlay', deferElementCreation: true });

    // Only create in dev mode
    if (import.meta.env.DEV) {
      this.createElementDeferred();
      this.setupListeners();
    }
  }

  protected createElement(className?: string): HTMLElement {
    const overlay = document.createElement('div');
    overlay.className = `${className ?? ''} uv7-dev-error-overlay--hidden`.trim();

    overlay.innerHTML = `
      <div class="uv7-dev-error-overlay__header">
        <span class="uv7-dev-error-overlay__icon">⚠️</span>
        <span class="uv7-dev-error-overlay__title">Scene Validation Error</span>
        <button class="uv7-dev-error-overlay__close" aria-label="Close">×</button>
      </div>
      <div class="uv7-dev-error-overlay__content">
        <ul class="uv7-dev-error-overlay__list"></ul>
      </div>
      <div class="uv7-dev-error-overlay__footer">
        <span>Fix the errors above and refresh. Check console for details.</span>
      </div>
    `;

    this.errorList = overlay.querySelector('.uv7-dev-error-overlay__list');

    // Close button
    const closeBtn = overlay.querySelector('.uv7-dev-error-overlay__close');
    closeBtn?.addEventListener('click', () => this.hide());

    // Inject styles
    this.injectStyles();

    return overlay;
  }

  private setupListeners(): void {
    // Listen for scene validation errors
    eventBus.on('scene:validation:error', (payload) => {
      this.addError(payload as unknown as SceneError);
    });
  }

  addError(error: SceneError): void {
    this.errors.push(error);
    this.render();
    this.show();

    // Also log to console with full details
    console.group(`%c Scene Validation Error: ${error.sceneId}`, 'color: #ff6b6b; font-weight: bold;');
    if (error.route) console.log(`Route: ${error.route}`);
    if (error.act) console.log(`Act: ${error.act}`);
    console.log('Errors:');
    for (const err of error.errors) {
      console.log(`  ${err.path}: ${err.message}`);
    }
    console.groupEnd();
  }

  private render(): void {
    if (!this.errorList) return;

    this.errorList.innerHTML = this.errors
      .map(
        (error) => `
        <li class="uv7-dev-error-overlay__error">
          <div class="uv7-dev-error-overlay__scene">
            <strong>${error.sceneId}</strong>
            ${error.route ? `<span class="uv7-dev-error-overlay__route">${error.route}/act${error.act ?? '?'}</span>` : ''}
          </div>
          <ul class="uv7-dev-error-overlay__fields">
            ${error.errors.map((e) => `<li><code>${e.path}</code>: ${e.message}</li>`).join('')}
          </ul>
        </li>
      `
      )
      .join('');
  }

  override show(): void {
    this.element?.classList.remove('uv7-dev-error-overlay--hidden');
  }

  override hide(): void {
    this.element?.classList.add('uv7-dev-error-overlay--hidden');
  }

  clear(): void {
    this.errors = [];
    this.render();
    this.hide();
  }

  private injectStyles(): void {
    if (document.getElementById('uv7-dev-error-styles')) return;

    const style = document.createElement('style');
    style.id = 'uv7-dev-error-styles';
    style.textContent = `
      .uv7-dev-error-overlay {
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 500px;
        max-height: 80vh;
        background: #1a1a2e;
        border: 2px solid #ff6b6b;
        border-radius: 8px;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        color: #eee;
        z-index: 99999;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .uv7-dev-error-overlay--hidden {
        display: none;
      }

      .uv7-dev-error-overlay__header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: #ff6b6b;
        color: #1a1a2e;
        font-weight: bold;
      }

      .uv7-dev-error-overlay__icon {
        font-size: 18px;
      }

      .uv7-dev-error-overlay__title {
        flex: 1;
      }

      .uv7-dev-error-overlay__close {
        background: none;
        border: none;
        color: #1a1a2e;
        font-size: 24px;
        cursor: pointer;
        padding: 0 4px;
        line-height: 1;
      }

      .uv7-dev-error-overlay__close:hover {
        opacity: 0.7;
      }

      .uv7-dev-error-overlay__content {
        padding: 16px;
        overflow-y: auto;
        flex: 1;
      }

      .uv7-dev-error-overlay__list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .uv7-dev-error-overlay__error {
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #333;
      }

      .uv7-dev-error-overlay__error:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .uv7-dev-error-overlay__scene {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .uv7-dev-error-overlay__scene strong {
        color: #ff6b6b;
      }

      .uv7-dev-error-overlay__route {
        font-size: 12px;
        color: #888;
        background: #2a2a3e;
        padding: 2px 6px;
        border-radius: 4px;
      }

      .uv7-dev-error-overlay__fields {
        list-style: none;
        margin: 0;
        padding: 0 0 0 16px;
      }

      .uv7-dev-error-overlay__fields li {
        margin: 4px 0;
        color: #ccc;
      }

      .uv7-dev-error-overlay__fields code {
        background: #2a2a3e;
        padding: 2px 6px;
        border-radius: 4px;
        color: #4ecdc4;
        font-family: 'SF Mono', Monaco, monospace;
        font-size: 12px;
      }

      .uv7-dev-error-overlay__footer {
        padding: 12px 16px;
        background: #2a2a3e;
        font-size: 12px;
        color: #888;
        border-top: 1px solid #333;
      }
    `;
    document.head.appendChild(style);
  }
}

// Singleton for easy access
export const devErrorOverlay = new DevErrorOverlay();
