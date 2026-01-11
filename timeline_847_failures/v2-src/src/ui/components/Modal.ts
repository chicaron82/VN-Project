/**
 * UV7 V2 Modal Component
 *
 * Accessible modal dialog with focus trapping, backdrop, and animations.
 */

import { Component } from './Component.ts';
import type { ComponentConfig } from './Component.ts';

export interface ModalConfig extends ComponentConfig {
  title?: string;
  content?: string | HTMLElement;
  closable?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showBackdrop?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

export class Modal extends Component {
  private modalConfig: ModalConfig;
  private backdropElement: HTMLElement | null = null;
  private contentContainer: HTMLElement | null = null;
  private previousActiveElement: HTMLElement | null = null;
  private isOpen = false;

  constructor(config: ModalConfig = {}) {
    // Defer element creation so we can set config first
    super({ ...config, deferElementCreation: true });

    // Set up full config with defaults
    this.modalConfig = {
      closable: true,
      closeOnBackdrop: true,
      closeOnEscape: true,
      showBackdrop: true,
      ...config,
    };

    // Now create element with config available
    this.createElementDeferred();
  }

  protected createElement(className?: string): HTMLElement {
    const config = this.modalConfig;

    const modal = document.createElement('div');
    modal.className = `uv7-modal ${className ?? ''}`.trim();
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    if (config.title) {
      modal.setAttribute('aria-labelledby', 'modal-title');
    }

    // Create backdrop
    if (config.showBackdrop !== false) {
      this.backdropElement = document.createElement('div');
      this.backdropElement.className = 'uv7-modal__backdrop';
    }

    // Create modal structure
    modal.innerHTML = `
      <div class="uv7-modal__container">
        ${config.title ? `<header class="uv7-modal__header">
          <h2 id="modal-title" class="uv7-modal__title">${config.title}</h2>
          ${config.closable !== false ? `<button class="uv7-modal__close" aria-label="Close">&times;</button>` : ''}
        </header>` : ''}
        <div class="uv7-modal__content"></div>
        <footer class="uv7-modal__footer"></footer>
      </div>
    `;

    this.contentContainer = modal.querySelector('.uv7-modal__content');

    // Add content
    if (config.content) {
      if (typeof config.content === 'string') {
        this.contentContainer!.innerHTML = config.content;
      } else {
        this.contentContainer!.appendChild(config.content);
      }
    }

    // Initially hidden
    modal.style.display = 'none';

    return modal;
  }

  override init(): void {
    // Close button
    if (this.modalConfig.closable) {
      this.onChild('.uv7-modal__close', 'click', () => this.close());
    }

    // Backdrop click
    if (this.modalConfig.closeOnBackdrop && this.backdropElement) {
      this.backdropElement.addEventListener('click', () => this.close());
    }

    // Escape key
    if (this.modalConfig.closeOnEscape) {
      this.setupEscapeHandler();
    }

    // Focus trap
    this.on('keydown', (e) => this.handleTabKey(e));
  }

  // =========================================================================
  // PUBLIC METHODS
  // =========================================================================

  /**
   * Open the modal
   */
  async open(): Promise<void> {
    if (this.isOpen) return;

    // Store current focus
    this.previousActiveElement = document.activeElement as HTMLElement;

    // Show backdrop
    if (this.backdropElement && this.container) {
      this.container.appendChild(this.backdropElement);
      // Force reflow for animation
      void this.backdropElement.offsetHeight;
      this.backdropElement.classList.add('uv7-modal__backdrop--visible');
    }

    // Show modal
    this.element.style.display = '';
    this.isOpen = true;

    // Animate in
    await this.fadeIn(200);

    // Focus first focusable element
    this.focusFirst();

    // Prevent body scroll
    document.body.classList.add('modal-open');

    this.emit('ui:modal:open', { modalId: 'modal' });
    this.modalConfig.onOpen?.();
  }

  /**
   * Close the modal
   */
  async close(): Promise<void> {
    if (!this.isOpen) return;

    // Animate out
    await this.fadeOut(150);

    // Hide backdrop
    if (this.backdropElement) {
      this.backdropElement.classList.remove('uv7-modal__backdrop--visible');
      this.backdropElement.remove();
    }

    this.element.style.display = 'none';
    this.isOpen = false;

    // Restore body scroll
    document.body.classList.remove('modal-open');

    // Restore focus
    this.previousActiveElement?.focus();

    this.emit('ui:modal:close', { modalId: 'modal' });
    this.modalConfig.onClose?.();
  }

  /**
   * Toggle modal open/closed
   */
  async toggle(): Promise<void> {
    if (this.isOpen) {
      await this.close();
    } else {
      await this.open();
    }
  }

  /**
   * Check if modal is open
   */
  getIsOpen(): boolean {
    return this.isOpen;
  }

  /**
   * Set modal content
   */
  setContent(content: string | HTMLElement): void {
    if (!this.contentContainer) return;

    if (typeof content === 'string') {
      this.contentContainer.innerHTML = content;
    } else {
      this.contentContainer.innerHTML = '';
      this.contentContainer.appendChild(content);
    }
  }

  /**
   * Set modal title
   */
  setTitle(title: string): void {
    const titleEl = this.query<HTMLElement>('.uv7-modal__title');
    if (titleEl) {
      titleEl.textContent = title;
    }
  }

  /**
   * Get footer element for adding action buttons
   */
  getFooter(): HTMLElement | null {
    return this.query('.uv7-modal__footer');
  }

  /**
   * Add button to footer
   */
  addFooterButton(element: HTMLElement): void {
    const footer = this.getFooter();
    if (footer) {
      footer.appendChild(element);
    }
  }

  override destroy(): void {
    // Ensure cleanup
    if (this.isOpen) {
      document.body.classList.remove('modal-open');
    }
    this.backdropElement?.remove();
    super.destroy();
  }

  // =========================================================================
  // PRIVATE
  // =========================================================================

  private setupEscapeHandler(): void {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.isOpen) {
        void this.close();
      }
    };

    document.addEventListener('keydown', handler);
    // Store cleanup
    const originalDestroy = this.destroy.bind(this);
    this.destroy = () => {
      document.removeEventListener('keydown', handler);
      originalDestroy();
    };
  }

  private handleTabKey(e: KeyboardEvent): void {
    if (e.key !== 'Tab' || !this.isOpen) return;

    const focusable = this.getFocusableElements();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ];

    return this.queryAll<HTMLElement>(selectors.join(', '));
  }

  private focusFirst(): void {
    const focusable = this.getFocusableElements();
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }
}
