/**
 * UV7 V2 Component Base Class
 *
 * Base class for all UI components. Provides lifecycle management,
 * event handling, and DOM manipulation utilities.
 */

import { EventBus, eventBus } from '../../core/EventBus.ts';

export interface ComponentConfig {
  eventBus?: EventBus;
  container?: HTMLElement;
  className?: string;
  deferElementCreation?: boolean;
}

export abstract class Component {
  protected eventBus: EventBus;
  protected element!: HTMLElement;
  protected container: HTMLElement | null;
  protected componentClassName: string | undefined;
  private eventCleanups: Array<() => void> = [];
  private isDestroyed = false;

  constructor(config: ComponentConfig = {}) {
    this.eventBus = config.eventBus ?? eventBus;
    this.container = config.container ?? null;
    this.componentClassName = config.className;

    // Allow subclasses to defer element creation
    if (!config.deferElementCreation) {
      this.element = this.createElement(config.className);
    }
  }

  /**
   * Create element after constructor (for subclasses that defer)
   */
  protected createElementDeferred(): void {
    if (!this.element) {
      this.element = this.createElement(this.componentClassName);
    }
  }

  /**
   * Create the component's root element
   */
  protected abstract createElement(className?: string): HTMLElement;

  /**
   * Initialize the component (called after mounting)
   */
  init(): void {
    // Override in subclass
  }

  /**
   * Update the component with new data
   */
  update(_data?: unknown): void {
    // Override in subclass
  }

  /**
   * Destroy the component and cleanup
   */
  destroy(): void {
    if (this.isDestroyed) return;

    // Run all cleanup functions
    for (const cleanup of this.eventCleanups) {
      cleanup();
    }
    this.eventCleanups = [];

    // Remove from DOM
    this.element.remove();
    this.isDestroyed = true;
  }

  /**
   * Mount the component to a container
   */
  mount(container?: HTMLElement): void {
    const target = container ?? this.container;
    if (!target) {
      throw new Error('No container specified for mounting');
    }

    target.appendChild(this.element);
    this.container = target;
    this.init();
  }

  /**
   * Unmount the component from its container
   */
  unmount(): void {
    this.element.remove();
  }

  /**
   * Get the component's root element
   */
  getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Check if component is mounted
   */
  isMounted(): boolean {
    return this.element.parentElement !== null;
  }

  // =========================================================================
  // DOM UTILITIES
  // =========================================================================

  /**
   * Query a child element
   */
  protected query<T extends HTMLElement>(selector: string): T | null {
    return this.element.querySelector<T>(selector);
  }

  /**
   * Query all matching child elements
   */
  protected queryAll<T extends HTMLElement>(selector: string): T[] {
    return Array.from(this.element.querySelectorAll<T>(selector));
  }

  /**
   * Add a class to the root element
   */
  protected addClass(...classNames: string[]): void {
    this.element.classList.add(...classNames);
  }

  /**
   * Remove a class from the root element
   */
  protected removeClass(...classNames: string[]): void {
    this.element.classList.remove(...classNames);
  }

  /**
   * Toggle a class on the root element
   */
  protected toggleClass(className: string, force?: boolean): void {
    this.element.classList.toggle(className, force);
  }

  /**
   * Check if root element has a class
   */
  protected hasClass(className: string): boolean {
    return this.element.classList.contains(className);
  }

  /**
   * Set visibility
   */
  show(): void {
    this.element.style.display = '';
    this.removeClass('hidden');
  }

  hide(): void {
    this.addClass('hidden');
  }

  /**
   * Set opacity for fade effects
   */
  setOpacity(opacity: number): void {
    this.element.style.opacity = String(opacity);
  }

  // =========================================================================
  // EVENT UTILITIES
  // =========================================================================

  /**
   * Listen to a DOM event on the root element
   */
  protected on<K extends keyof HTMLElementEventMap>(
    event: K,
    handler: (e: HTMLElementEventMap[K]) => void,
    options?: AddEventListenerOptions
  ): void {
    this.element.addEventListener(event, handler as EventListener, options);
    this.eventCleanups.push(() => {
      this.element.removeEventListener(event, handler as EventListener, options);
    });
  }

  /**
   * Listen to a DOM event on a child element
   */
  protected onChild<K extends keyof HTMLElementEventMap>(
    selector: string,
    event: K,
    handler: (e: HTMLElementEventMap[K]) => void,
    options?: AddEventListenerOptions
  ): void {
    const child = this.query(selector);
    if (child) {
      child.addEventListener(event, handler as EventListener, options);
      this.eventCleanups.push(() => {
        child.removeEventListener(event, handler as EventListener, options);
      });
    }
  }

  /**
   * Listen to a game event
   */
  protected onEvent<K extends keyof import('../../core/types.ts').GameEvents>(
    event: K,
    handler: import('../../core/types.ts').EventHandler<K>
  ): void {
    const cleanup = this.eventBus.on(event, handler);
    this.eventCleanups.push(cleanup);
  }

  /**
   * Emit a game event
   */
  protected emit<K extends keyof import('../../core/types.ts').GameEvents>(
    event: K,
    ...args: import('../../core/types.ts').GameEvents[K] extends undefined
      ? []
      : [import('../../core/types.ts').GameEvents[K]]
  ): void {
    this.eventBus.emit(event, ...args);
  }

  // =========================================================================
  // ANIMATION UTILITIES
  // =========================================================================

  /**
   * Fade in the component
   */
  async fadeIn(duration = 300): Promise<void> {
    this.element.style.opacity = '0';
    this.show();

    await this.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration, easing: 'ease-out' }
    );

    this.element.style.opacity = '1';
  }

  /**
   * Fade out the component
   */
  async fadeOut(duration = 300): Promise<void> {
    await this.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration, easing: 'ease-out' }
    );

    this.hide();
    this.element.style.opacity = '';
  }

  /**
   * Run a Web Animation
   */
  protected animate(
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions
  ): Promise<void> {
    return new Promise((resolve) => {
      // Check if Web Animations API is available (not in jsdom)
      if (typeof this.element.animate !== 'function') {
        // Apply final keyframe styles directly
        const finalFrame = keyframes[keyframes.length - 1];
        if (finalFrame) {
          Object.assign(this.element.style, finalFrame);
        }
        resolve();
        return;
      }

      const animation = this.element.animate(keyframes, options);
      animation.onfinish = () => resolve();
    });
  }
}
