/**
 * Button Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Button } from './Button.ts';

describe('Button', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('creation', () => {
    it('should create button with text', () => {
      const button = new Button({ text: 'Click me' });
      button.mount(document.body);

      const el = button.getElement();
      expect(el.tagName).toBe('BUTTON');
      expect(el.textContent).toContain('Click me');
    });

    it('should apply primary variant by default', () => {
      const button = new Button({ text: 'Test' });
      button.mount(document.body);

      expect(button.getElement().classList.contains('uv7-button--primary')).toBe(true);
    });

    it('should apply custom variant', () => {
      const button = new Button({ text: 'Test', variant: 'danger' });
      button.mount(document.body);

      expect(button.getElement().classList.contains('uv7-button--danger')).toBe(true);
    });

    it('should apply size class', () => {
      const button = new Button({ text: 'Test', size: 'large' });
      button.mount(document.body);

      expect(button.getElement().classList.contains('uv7-button--large')).toBe(true);
    });

    it('should set disabled state', () => {
      const button = new Button({ text: 'Test', disabled: true });
      button.mount(document.body);

      expect((button.getElement() as HTMLButtonElement).disabled).toBe(true);
    });

    it('should set aria-label', () => {
      const button = new Button({ text: 'X', ariaLabel: 'Close dialog' });
      button.mount(document.body);

      expect(button.getElement().getAttribute('aria-label')).toBe('Close dialog');
    });

    it('should include icon when provided', () => {
      const button = new Button({ text: 'Save', icon: '💾' });
      button.mount(document.body);

      const icon = button.getElement().querySelector('.uv7-button__icon');
      expect(icon).not.toBeNull();
      expect(icon?.textContent).toBe('💾');
    });
  });

  describe('click handling', () => {
    it('should call onClick handler', () => {
      const handler = vi.fn();
      const button = new Button({ text: 'Test', onClick: handler });
      button.mount(document.body);

      button.getElement().click();

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should not call handler when disabled', () => {
      const handler = vi.fn();
      const button = new Button({ text: 'Test', onClick: handler, disabled: true });
      button.mount(document.body);

      button.getElement().click();

      expect(handler).not.toHaveBeenCalled();
    });

    it('should allow setting handler after creation', () => {
      const handler = vi.fn();
      const button = new Button({ text: 'Test' });
      button.mount(document.body);

      button.setOnClick(handler);
      button.getElement().click();

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('state changes', () => {
    it('should update text', () => {
      const button = new Button({ text: 'Before' });
      button.mount(document.body);

      button.setText('After');

      expect(button.getElement().textContent).toContain('After');
    });

    it('should change variant', () => {
      const button = new Button({ text: 'Test', variant: 'primary' });
      button.mount(document.body);

      button.setVariant('secondary');

      const el = button.getElement();
      expect(el.classList.contains('uv7-button--primary')).toBe(false);
      expect(el.classList.contains('uv7-button--secondary')).toBe(true);
    });

    it('should enable/disable', () => {
      const button = new Button({ text: 'Test' });
      button.mount(document.body);

      button.disable();
      expect(button.isDisabled()).toBe(true);
      expect((button.getElement() as HTMLButtonElement).disabled).toBe(true);

      button.enable();
      expect(button.isDisabled()).toBe(false);
      expect((button.getElement() as HTMLButtonElement).disabled).toBe(false);
    });

    it('should show loading state', () => {
      const button = new Button({ text: 'Test' });
      button.mount(document.body);

      button.setLoading(true);
      expect(button.getElement().classList.contains('uv7-button--loading')).toBe(true);
      expect((button.getElement() as HTMLButtonElement).disabled).toBe(true);

      button.setLoading(false);
      expect(button.getElement().classList.contains('uv7-button--loading')).toBe(false);
      expect((button.getElement() as HTMLButtonElement).disabled).toBe(false);
    });

    it('should respect disabled when ending loading', () => {
      const button = new Button({ text: 'Test', disabled: true });
      button.mount(document.body);

      button.setLoading(true);
      button.setLoading(false);

      // Should still be disabled since it was originally disabled
      expect((button.getElement() as HTMLButtonElement).disabled).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('should remove from DOM on destroy', () => {
      const button = new Button({ text: 'Test' });
      button.mount(document.body);

      expect(document.body.children.length).toBe(1);

      button.destroy();

      expect(document.body.children.length).toBe(0);
    });
  });
});
