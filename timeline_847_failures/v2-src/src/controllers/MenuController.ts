/**
 * UV7 V2 MenuController
 *
 * Manages menu navigation, states, and transitions.
 *
 * Features:
 * - Menu stack navigation (push/pop)
 * - Keyboard navigation
 * - Focus management
 * - Transition animations
 */

import type { GameSystem } from '../core/index.ts';
import { EventBus, eventBus } from '../core/EventBus.ts';

export type MenuId = 'main' | 'pause' | 'settings' | 'save' | 'load' | 'notes' | 'achievements' | 'credits';

export interface MenuItem {
  id: string;
  label: string;
  action?: () => void;
  submenu?: MenuId;
  disabled?: boolean;
  hidden?: boolean;
}

export interface MenuConfig {
  id: MenuId;
  title?: string;
  items: MenuItem[];
  onOpen?: () => void;
  onClose?: () => void;
}

export interface MenuControllerConfig {
  eventBus?: EventBus;
}

export class MenuController implements GameSystem {
  readonly name = 'MenuController';

  private eventBus: EventBus;
  private menuStack: MenuId[] = [];
  private menus = new Map<MenuId, MenuConfig>();
  private focusedIndex = 0;
  private isNavigating = false;

  constructor(config: MenuControllerConfig = {}) {
    this.eventBus = config.eventBus ?? eventBus;
  }

  // =========================================================================
  // LIFECYCLE
  // =========================================================================

  init(): void {
    this.setupEventListeners();
  }

  destroy(): void {
    this.menuStack = [];
    this.menus.clear();
  }

  // =========================================================================
  // MENU REGISTRATION
  // =========================================================================

  /**
   * Register a menu configuration
   */
  registerMenu(config: MenuConfig): void {
    this.menus.set(config.id, config);
  }

  /**
   * Unregister a menu
   */
  unregisterMenu(id: MenuId): void {
    this.menus.delete(id);
  }

  /**
   * Get menu configuration
   */
  getMenu(id: MenuId): MenuConfig | undefined {
    return this.menus.get(id);
  }

  // =========================================================================
  // NAVIGATION
  // =========================================================================

  /**
   * Open a menu (push to stack)
   */
  open(menuId: MenuId): void {
    const menu = this.menus.get(menuId);
    if (!menu) {
      console.warn(`Menu not found: ${menuId}`);
      return;
    }

    this.menuStack.push(menuId);
    this.focusedIndex = 0;

    menu.onOpen?.();
    this.eventBus.emit('ui:menu:open', { menuId });
  }

  /**
   * Close current menu (pop from stack)
   */
  close(): void {
    if (this.menuStack.length === 0) return;

    const menuId = this.menuStack.pop()!;
    const menu = this.menus.get(menuId);

    menu?.onClose?.();
    this.eventBus.emit('ui:menu:close', { menuId });

    // Reset focus for previous menu
    if (this.menuStack.length > 0) {
      this.focusedIndex = 0;
    }
  }

  /**
   * Close all menus
   */
  closeAll(): void {
    while (this.menuStack.length > 0) {
      this.close();
    }
  }

  /**
   * Navigate to a specific menu (replaces current)
   */
  navigateTo(menuId: MenuId): void {
    if (this.menuStack.length > 0) {
      this.menuStack.pop();
    }
    this.open(menuId);
  }

  /**
   * Go back to previous menu
   */
  back(): boolean {
    if (this.menuStack.length <= 1) {
      this.close();
      return false;
    }

    this.close();
    return true;
  }

  // =========================================================================
  // ITEM NAVIGATION
  // =========================================================================

  /**
   * Focus next menu item
   */
  focusNext(): void {
    const items = this.getVisibleItems();
    if (items.length === 0) return;

    this.focusedIndex = (this.focusedIndex + 1) % items.length;
    this.emitFocusChange();
  }

  /**
   * Focus previous menu item
   */
  focusPrevious(): void {
    const items = this.getVisibleItems();
    if (items.length === 0) return;

    this.focusedIndex = (this.focusedIndex - 1 + items.length) % items.length;
    this.emitFocusChange();
  }

  /**
   * Focus specific item by index
   */
  focusIndex(index: number): void {
    const items = this.getVisibleItems();
    if (index >= 0 && index < items.length) {
      this.focusedIndex = index;
      this.emitFocusChange();
    }
  }

  /**
   * Focus item by ID
   */
  focusItem(itemId: string): void {
    const items = this.getVisibleItems();
    const index = items.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      this.focusedIndex = index;
      this.emitFocusChange();
    }
  }

  /**
   * Select currently focused item
   */
  select(): void {
    const items = this.getVisibleItems();
    const item = items[this.focusedIndex];

    if (!item || item.disabled) return;

    this.eventBus.emit('ui:menu:select', { menuId: this.getCurrentMenuId()!, itemId: item.id });

    if (item.submenu) {
      this.open(item.submenu);
    } else if (item.action) {
      item.action();
    }
  }

  // =========================================================================
  // QUERIES
  // =========================================================================

  /**
   * Check if any menu is open
   */
  isOpen(): boolean {
    return this.menuStack.length > 0;
  }

  /**
   * Get current menu ID
   */
  getCurrentMenuId(): MenuId | null {
    if (this.menuStack.length === 0) return null;
    return this.menuStack[this.menuStack.length - 1];
  }

  /**
   * Get current menu config
   */
  getCurrentMenu(): MenuConfig | null {
    const id = this.getCurrentMenuId();
    if (!id) return null;
    return this.menus.get(id) ?? null;
  }

  /**
   * Get menu stack depth
   */
  getStackDepth(): number {
    return this.menuStack.length;
  }

  /**
   * Get visible (non-hidden) items for current menu
   */
  getVisibleItems(): MenuItem[] {
    const menu = this.getCurrentMenu();
    if (!menu) return [];
    return menu.items.filter((item) => !item.hidden);
  }

  /**
   * Get currently focused item
   */
  getFocusedItem(): MenuItem | null {
    const items = this.getVisibleItems();
    return items[this.focusedIndex] ?? null;
  }

  /**
   * Get focused index
   */
  getFocusedIndex(): number {
    return this.focusedIndex;
  }

  /**
   * Check if navigation is in progress
   */
  isNavigationInProgress(): boolean {
    return this.isNavigating;
  }

  // =========================================================================
  // PRIVATE
  // =========================================================================

  private setupEventListeners(): void {
    // Handle keyboard navigation
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }
  }

  private handleKeydown(e: KeyboardEvent): void {
    if (!this.isOpen()) return;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        this.focusPrevious();
        break;

      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault();
        this.focusNext();
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        this.select();
        break;

      case 'Escape':
      case 'Backspace':
        e.preventDefault();
        this.back();
        break;
    }
  }

  private emitFocusChange(): void {
    const item = this.getFocusedItem();
    if (item) {
      this.eventBus.emit('ui:menu:focus', {
        menuId: this.getCurrentMenuId()!,
        itemId: item.id,
        index: this.focusedIndex,
      });
    }
  }
}

// Singleton instance
export const menuController = new MenuController();
