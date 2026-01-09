/**
 * MenuController Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MenuController } from './MenuController.ts';
import type { MenuConfig } from './MenuController.ts';
import { EventBus } from '../core/EventBus.ts';

describe('MenuController', () => {
  let controller: MenuController;
  let bus: EventBus;

  const mainMenu: MenuConfig = {
    id: 'main',
    title: 'Main Menu',
    items: [
      { id: 'new-game', label: 'New Game', action: vi.fn() },
      { id: 'continue', label: 'Continue', disabled: true },
      { id: 'settings', label: 'Settings', submenu: 'settings' },
      { id: 'hidden-item', label: 'Hidden', hidden: true },
    ],
  };

  const settingsMenu: MenuConfig = {
    id: 'settings',
    title: 'Settings',
    items: [
      { id: 'audio', label: 'Audio' },
      { id: 'display', label: 'Display' },
      { id: 'back', label: 'Back', action: vi.fn() },
    ],
  };

  beforeEach(() => {
    bus = new EventBus();
    controller = new MenuController({ eventBus: bus });
    controller.init();
    controller.registerMenu(mainMenu);
    controller.registerMenu(settingsMenu);
  });

  afterEach(() => {
    controller.destroy();
  });

  describe('registration', () => {
    it('should register menu', () => {
      expect(controller.getMenu('main')).toEqual(mainMenu);
    });

    it('should unregister menu', () => {
      controller.unregisterMenu('main');
      expect(controller.getMenu('main')).toBeUndefined();
    });
  });

  describe('opening/closing', () => {
    it('should open menu', () => {
      const handler = vi.fn();
      bus.on('ui:menu:open', handler);

      controller.open('main');

      expect(controller.isOpen()).toBe(true);
      expect(controller.getCurrentMenuId()).toBe('main');
      expect(handler).toHaveBeenCalledWith({ menuId: 'main' });
    });

    it('should close menu', () => {
      const handler = vi.fn();
      bus.on('ui:menu:close', handler);

      controller.open('main');
      controller.close();

      expect(controller.isOpen()).toBe(false);
      expect(handler).toHaveBeenCalledWith({ menuId: 'main' });
    });

    it('should push menus onto stack', () => {
      controller.open('main');
      controller.open('settings');

      expect(controller.getStackDepth()).toBe(2);
      expect(controller.getCurrentMenuId()).toBe('settings');
    });

    it('should close all menus', () => {
      controller.open('main');
      controller.open('settings');

      controller.closeAll();

      expect(controller.isOpen()).toBe(false);
      expect(controller.getStackDepth()).toBe(0);
    });

    it('should navigate to menu (replace current)', () => {
      controller.open('main');
      controller.navigateTo('settings');

      expect(controller.getStackDepth()).toBe(1);
      expect(controller.getCurrentMenuId()).toBe('settings');
    });

    it('should go back to previous menu', () => {
      controller.open('main');
      controller.open('settings');

      const result = controller.back();

      expect(result).toBe(true);
      expect(controller.getCurrentMenuId()).toBe('main');
    });

    it('should return false when back from root', () => {
      controller.open('main');

      const result = controller.back();

      expect(result).toBe(false);
      expect(controller.isOpen()).toBe(false);
    });

    it('should call onOpen callback', () => {
      const onOpen = vi.fn();
      controller.registerMenu({ id: 'pause', items: [], onOpen });

      controller.open('pause');

      expect(onOpen).toHaveBeenCalled();
    });

    it('should call onClose callback', () => {
      const onClose = vi.fn();
      controller.registerMenu({ id: 'pause', items: [], onClose });

      controller.open('pause');
      controller.close();

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('item navigation', () => {
    beforeEach(() => {
      controller.open('main');
    });

    it('should start at first item', () => {
      expect(controller.getFocusedIndex()).toBe(0);
    });

    it('should focus next item', () => {
      controller.focusNext();
      expect(controller.getFocusedIndex()).toBe(1);
    });

    it('should focus previous item', () => {
      controller.focusNext();
      controller.focusPrevious();
      expect(controller.getFocusedIndex()).toBe(0);
    });

    it('should wrap around at end', () => {
      // 3 visible items (hidden is excluded)
      controller.focusNext(); // 1
      controller.focusNext(); // 2
      controller.focusNext(); // wrap to 0
      expect(controller.getFocusedIndex()).toBe(0);
    });

    it('should wrap around at start', () => {
      controller.focusPrevious(); // wrap to 2
      expect(controller.getFocusedIndex()).toBe(2);
    });

    it('should focus by index', () => {
      controller.focusIndex(2);
      expect(controller.getFocusedIndex()).toBe(2);
    });

    it('should focus by item ID', () => {
      controller.focusItem('settings');
      expect(controller.getFocusedItem()?.id).toBe('settings');
    });

    it('should emit focus change event', () => {
      const handler = vi.fn();
      bus.on('ui:menu:focus', handler);

      controller.focusNext();

      expect(handler).toHaveBeenCalledWith({
        menuId: 'main',
        itemId: 'continue',
        index: 1,
      });
    });

    it('should get visible items (excluding hidden)', () => {
      const items = controller.getVisibleItems();

      expect(items).toHaveLength(3);
      expect(items.find((i) => i.id === 'hidden-item')).toBeUndefined();
    });
  });

  describe('selection', () => {
    beforeEach(() => {
      controller.open('main');
    });

    it('should select focused item', () => {
      const handler = vi.fn();
      bus.on('ui:menu:select', handler);

      controller.select();

      expect(handler).toHaveBeenCalledWith({ menuId: 'main', itemId: 'new-game' });
    });

    it('should call item action', () => {
      controller.select();

      expect(mainMenu.items[0].action).toHaveBeenCalled();
    });

    it('should not select disabled item', () => {
      controller.focusIndex(1); // continue (disabled)

      const handler = vi.fn();
      bus.on('ui:menu:select', handler);

      controller.select();

      expect(handler).not.toHaveBeenCalled();
    });

    it('should open submenu on select', () => {
      controller.focusIndex(2); // settings (has submenu)
      controller.select();

      expect(controller.getCurrentMenuId()).toBe('settings');
    });
  });

  describe('queries', () => {
    it('should get current menu config', () => {
      controller.open('main');

      const menu = controller.getCurrentMenu();
      expect(menu?.title).toBe('Main Menu');
    });

    it('should return null when no menu open', () => {
      expect(controller.getCurrentMenu()).toBeNull();
      expect(controller.getCurrentMenuId()).toBeNull();
    });

    it('should get focused item', () => {
      controller.open('main');

      const item = controller.getFocusedItem();
      expect(item?.id).toBe('new-game');
    });
  });
});
