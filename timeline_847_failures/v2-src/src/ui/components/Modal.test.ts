/**
 * Modal Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Modal } from './Modal.ts';

describe('Modal', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.classList.remove('modal-open');
  });

  afterEach(() => {
    document.body.classList.remove('modal-open');
  });

  describe('creation', () => {
    it('should create modal with role dialog', () => {
      const modal = new Modal();
      modal.mount(document.body);

      expect(modal.getElement().getAttribute('role')).toBe('dialog');
      expect(modal.getElement().getAttribute('aria-modal')).toBe('true');
    });

    it('should create with title', () => {
      const modal = new Modal({ title: 'Test Modal' });
      modal.mount(document.body);

      const title = modal.getElement().querySelector('.uv7-modal__title');
      expect(title?.textContent).toBe('Test Modal');
    });

    it('should include close button when closable', () => {
      const modal = new Modal({ title: 'Test', closable: true });
      modal.mount(document.body);

      const closeBtn = modal.getElement().querySelector('.uv7-modal__close');
      expect(closeBtn).not.toBeNull();
    });

    it('should not include close button when not closable', () => {
      const modal = new Modal({ title: 'Test', closable: false });
      modal.mount(document.body);

      const closeBtn = modal.getElement().querySelector('.uv7-modal__close');
      expect(closeBtn).toBeNull();
    });

    it('should set string content', () => {
      const modal = new Modal({ content: '<p>Hello world</p>' });
      modal.mount(document.body);

      const content = modal.getElement().querySelector('.uv7-modal__content');
      expect(content?.innerHTML).toBe('<p>Hello world</p>');
    });

    it('should set element content', () => {
      const div = document.createElement('div');
      div.id = 'custom-content';

      const modal = new Modal({ content: div });
      modal.mount(document.body);

      const content = modal.getElement().querySelector('#custom-content');
      expect(content).not.toBeNull();
    });

    it('should start hidden', () => {
      const modal = new Modal();
      modal.mount(document.body);

      expect(modal.getElement().style.display).toBe('none');
    });
  });

  describe('open/close', () => {
    it('should open modal', async () => {
      const modal = new Modal();
      modal.mount(document.body);

      await modal.open();

      expect(modal.getIsOpen()).toBe(true);
      expect(modal.getElement().style.display).not.toBe('none');
    });

    it('should close modal', async () => {
      const modal = new Modal();
      modal.mount(document.body);

      await modal.open();
      await modal.close();

      expect(modal.getIsOpen()).toBe(false);
      expect(modal.getElement().style.display).toBe('none');
    });

    it('should toggle modal', async () => {
      const modal = new Modal();
      modal.mount(document.body);

      await modal.toggle();
      expect(modal.getIsOpen()).toBe(true);

      await modal.toggle();
      expect(modal.getIsOpen()).toBe(false);
    });

    it('should add modal-open class to body', async () => {
      const modal = new Modal();
      modal.mount(document.body);

      await modal.open();
      expect(document.body.classList.contains('modal-open')).toBe(true);

      await modal.close();
      expect(document.body.classList.contains('modal-open')).toBe(false);
    });

    it('should call onOpen callback', async () => {
      const onOpen = vi.fn();
      const modal = new Modal({ onOpen });
      modal.mount(document.body);

      await modal.open();

      expect(onOpen).toHaveBeenCalled();
    });

    it('should call onClose callback', async () => {
      const onClose = vi.fn();
      const modal = new Modal({ onClose });
      modal.mount(document.body);

      await modal.open();
      await modal.close();

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('close triggers', () => {
    it('should close on close button click', async () => {
      const modal = new Modal({ title: 'Test', closable: true });
      modal.mount(document.body);

      await modal.open();

      const closeBtn = modal.getElement().querySelector('.uv7-modal__close') as HTMLElement;
      closeBtn.click();

      // Wait for async close
      await new Promise((r) => setTimeout(r, 200));

      expect(modal.getIsOpen()).toBe(false);
    });

    it('should close on Escape key', async () => {
      const modal = new Modal({ closeOnEscape: true });
      modal.mount(document.body);

      await modal.open();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      // Wait for async close
      await new Promise((r) => setTimeout(r, 200));

      expect(modal.getIsOpen()).toBe(false);
    });

    it('should not close on Escape when disabled', async () => {
      const modal = new Modal({ closeOnEscape: false });
      modal.mount(document.body);

      await modal.open();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      await new Promise((r) => setTimeout(r, 50));

      expect(modal.getIsOpen()).toBe(true);
    });
  });

  describe('content manipulation', () => {
    it('should update content', async () => {
      const modal = new Modal({ content: 'Initial' });
      modal.mount(document.body);

      modal.setContent('Updated');

      const content = modal.getElement().querySelector('.uv7-modal__content');
      expect(content?.innerHTML).toBe('Updated');
    });

    it('should update title', () => {
      const modal = new Modal({ title: 'Initial' });
      modal.mount(document.body);

      modal.setTitle('Updated');

      const title = modal.getElement().querySelector('.uv7-modal__title');
      expect(title?.textContent).toBe('Updated');
    });

    it('should provide footer element', () => {
      const modal = new Modal();
      modal.mount(document.body);

      const footer = modal.getFooter();
      expect(footer).not.toBeNull();
      expect(footer?.classList.contains('uv7-modal__footer')).toBe(true);
    });

    it('should add button to footer', () => {
      const modal = new Modal();
      modal.mount(document.body);

      const button = document.createElement('button');
      button.id = 'test-btn';
      modal.addFooterButton(button);

      const footer = modal.getFooter();
      expect(footer?.querySelector('#test-btn')).not.toBeNull();
    });
  });

  describe('backdrop', () => {
    it('should show backdrop when open', async () => {
      const modal = new Modal({ showBackdrop: true });
      modal.mount(document.body);

      await modal.open();

      const backdrop = document.body.querySelector('.uv7-modal__backdrop');
      expect(backdrop).not.toBeNull();
    });

    it('should remove backdrop on close', async () => {
      const modal = new Modal({ showBackdrop: true });
      modal.mount(document.body);

      await modal.open();
      await modal.close();

      const backdrop = document.body.querySelector('.uv7-modal__backdrop');
      expect(backdrop).toBeNull();
    });

    it('should not show backdrop when disabled', async () => {
      const modal = new Modal({ showBackdrop: false });
      modal.mount(document.body);

      await modal.open();

      const backdrop = document.body.querySelector('.uv7-modal__backdrop');
      expect(backdrop).toBeNull();
    });
  });

  describe('cleanup', () => {
    it('should clean up on destroy', async () => {
      const modal = new Modal();
      modal.mount(document.body);

      await modal.open();
      modal.destroy();

      expect(document.body.classList.contains('modal-open')).toBe(false);
    });
  });
});
