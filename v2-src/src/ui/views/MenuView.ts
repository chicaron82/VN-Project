/**
 * UV7 V2 MenuView
 *
 * Visual representation of the menu system.
 * Renders menu items and handles visual focus states.
 */

import { Component } from '../components/Component.ts';
import type { ComponentConfig } from '../components/Component.ts';
import { menuController } from '../../controllers/MenuController.ts';
import type { MenuItem } from '../../controllers/MenuController.ts';

export interface MenuViewConfig extends ComponentConfig {
  // Optional custom styling
}

export class MenuView extends Component {
  private titleElement: HTMLElement | null = null;
  private itemsContainer: HTMLElement | null = null;

  constructor(config: MenuViewConfig = {}) {
    super({ ...config, deferElementCreation: true });
    this.createElementDeferred();
  }

  protected createElement(className?: string): HTMLElement {
    const view = document.createElement('div');
    view.className = `uv7-menu ${className ?? ''}`.trim();

    view.innerHTML = `
      <div class="uv7-menu__container">
        <header class="uv7-menu__header">
          <h1 class="uv7-menu__title"></h1>
        </header>
        <nav class="uv7-menu__items" role="menu"></nav>
      </div>
    `;

    this.titleElement = view.querySelector('.uv7-menu__title');
    this.itemsContainer = view.querySelector('.uv7-menu__items');

    // Initially hidden
    view.classList.add('hidden');

    return view;
  }

  override init(): void {
    // Listen for menu events
    this.onEvent('ui:menu:open', () => this.onMenuOpen());
    this.onEvent('ui:menu:close', () => this.onMenuClose());
    this.onEvent('ui:menu:focus', ({ index }) => this.updateFocus(index));
  }

  // =========================================================================
  // EVENT HANDLERS
  // =========================================================================

  private onMenuOpen(): void {
    this.render();
    this.show();
    this.fadeIn(200);
  }

  private onMenuClose(): void {
    // Check if there's still a menu in the stack
    if (menuController.isOpen()) {
      // Re-render previous menu
      this.render();
    } else {
      // Hide the menu view entirely
      this.fadeOut(150);
    }
  }

  private updateFocus(index: number): void {
    const items = this.itemsContainer?.querySelectorAll('.uv7-menu__item');
    if (!items) return;

    items.forEach((item, i) => {
      item.classList.toggle('uv7-menu__item--focused', i === index);
      if (i === index) {
        (item as HTMLElement).focus();
      }
    });
  }

  // =========================================================================
  // RENDERING
  // =========================================================================

  private render(): void {
    const menu = menuController.getCurrentMenu();
    if (!menu || !this.itemsContainer || !this.titleElement) return;

    // Update title
    this.titleElement.textContent = menu.title ?? '';

    // Clear existing items
    this.itemsContainer.innerHTML = '';

    // Render items
    const visibleItems = menu.items.filter((item) => !item.hidden);
    visibleItems.forEach((item, index) => {
      const itemEl = this.createMenuItem(item, index);
      this.itemsContainer!.appendChild(itemEl);
    });

    // Update focus
    this.updateFocus(menuController.getFocusedIndex());
  }

  private createMenuItem(item: MenuItem, index: number): HTMLElement {
    const button = document.createElement('button');
    button.className = 'uv7-menu__item';
    button.setAttribute('role', 'menuitem');
    button.dataset.itemId = item.id;

    if (item.disabled) {
      button.classList.add('uv7-menu__item--disabled');
      button.disabled = true;
    }

    // Label
    const label = document.createElement('span');
    label.className = 'uv7-menu__item-label';
    label.textContent = item.label;
    button.appendChild(label);

    // Submenu indicator
    if (item.submenu) {
      const arrow = document.createElement('span');
      arrow.className = 'uv7-menu__item-arrow';
      arrow.textContent = '→';
      button.appendChild(arrow);
    }

    // Click handler
    button.addEventListener('click', () => {
      if (!item.disabled) {
        menuController.focusIndex(index);
        menuController.select();
      }
    });

    // Hover handler - focus on hover
    button.addEventListener('mouseenter', () => {
      if (!item.disabled) {
        menuController.focusIndex(index);
      }
    });

    return button;
  }
}
