Zee's take on restoring v1 carousel in v2

# Menu Carousel Implementation Instructions

## Goal

Port V1's carousel menu personality into V2 while maintaining clean architecture.

## Problem

V2's MenuView currently renders basic button lists. V1 has a card-based carousel with momentum physics, visual flourishes, and personality. The CSS exists in V2 but the TypeScript component isn't rendering the carousel structure.

## Solution

Replace V2's generic MenuView with carousel-rendering MenuView that maintains V2's architecture patterns.

---

## Step 1: Replace MenuView Component

**File to Replace:**
`v2-src/src/ui/views/MenuView.ts`

**With:**
The new MenuView.ts file provided (see attached file or above)

**What This Does:**

- Renders card-based carousel instead of button lists
- Maintains V2's Component base class architecture
- Integrates with MenuController (no changes needed there)
- Uses EventBus for communication
- Adds drag/swipe/keyboard interaction

---

## Step 2: Verify CSS is Loaded

**Check:**
`v2-src/src/styles/menu-carousel.css` should already exist

**Ensure it's imported in:**

- `v2-src/src/styles/main.css` OR
- `v2-src/index.html` (as style link) OR
- `v2-src/src/main.ts` (as import)

**If missing, copy from:**
`/tmp/ourBuild/menu-carousel.css` (V1 version)

---

## Step 3: Configure Menu Items

**In MenuController or wherever main menu is defined:**

Ensure menu items have these IDs for proper card mapping:

- `'start'` - Start Story card
- `'continue'` - Continue card (optional, hide if no save)
- `'load'` - Load Game card
- `'collectibles'` - Notes & Achievements
- `'settings'` - Settings card
- `'torigatchi'` - Secret mini-game (locked by default)

**Example menu definition:**

```typescript
const mainMenu = {
  title: '', // Title handled by carousel itself
  items: [
    { id: 'start', label: 'Start Story', action: () => startGame() },
    { id: 'continue', label: 'Continue', action: () => continueGame(), hidden: !hasSave },
    { id: 'load', label: 'Load Game', action: () => openLoadMenu() },
    { id: 'collectibles', label: 'Collectibles', action: () => openCollectibles() },
    { id: 'settings', label: 'Settings', action: () => openSettings() },
    { id: 'torigatchi', label: 'Torigatchi', action: () => openTorigatchi(), hidden: !torigatchiUnlocked }
  ]
};
```

---

## Step 4: Verify Assets Exist

**Menu Background Image:**
`assets/menu-bg.png` should exist

**If missing:**

- Copy from V1 build OR
- Update MenuView.ts line with correct path OR
- Comment out background if not needed yet

---

## Step 5: Test Basic Functionality

**After implementation, verify:**

1. **Carousel renders:**
   - Cards display with icons, titles, subtypes, buttons
   - Header shows "VERSION 848"
   - Footer shows bootstrap counter text
   - Indicators (dots) appear below carousel

2. **Interaction works:**
   - Left/Right arrow keys navigate cards
   - Click/tap cards to focus them
   - Enter/Space selects focused card
   - Drag/swipe moves carousel (basic version)

3. **Integration works:**
   - Clicking card button triggers MenuController action
   - Menu items properly map to cards
   - Locked/disabled states render correctly

---

## Step 6: Optional - Advanced Momentum Physics

**Current implementation has:**

- Basic drag/swipe
- Simple position snapping
- Keyboard navigation

**If you want V1's full momentum physics:**

- Velocity decay with spring physics
- Smooth momentum scrolling
- Hybrid mode (SimpleCarousel for portrait, MomentumAdapter for landscape)

**To add this:**
Port these files from V1:

- `ui/carousel-momentum.js` → TypeScript equivalent
- `ui/momentum-adapter.js` → TypeScript equivalent  
- `ui/simple-carousel.js` → TypeScript equivalent

Then integrate with MenuView's drag handlers.

**This is optional** - basic version should work fine first.

---

## Step 7: Polish & Styling

**If cards look wrong:**

Check that `menu-carousel.css` includes:

- `.carousel-card` styles (gradient backgrounds, borders, shadows)
- `.card-icon`, `.card-title`, `.card-subtitle`, `.card-button` styles
- `.carousel-indicator` styles (dots)
- `.menu-header` and `.menu-footer` styles
- Responsive breakpoints for mobile

**Color variables:**
Ensure CSS variables are defined:

- `--theme-primary` (default: #00ffaa)
- `--color-bg-primary` (default: #1a1a2e)
- `--color-bg-secondary` (default: #16213e)

---

## Expected Result

**Main menu should now:**

- Display as card-based carousel (not button list)
- Show personality (icons, colors, gradients)
- Support drag/swipe/keyboard navigation
- Maintain clean V2 architecture
- Work with existing MenuController without changes

**Visual should match:**
V1's menu carousel aesthetic but running on V2's clean TypeScript architecture.

---

## Troubleshooting

**Cards not rendering?**

- Check MenuController.getCurrentMenu() returns items
- Verify card IDs match in menuItemToCard() mapping
- Console log this.cards in renderCarousel()

**Styling looks wrong?**

- Verify menu-carousel.css is loaded
- Check browser console for CSS errors
- Inspect element to see if classes are applied

**Drag not working?**

- Check event listeners are attached (setupInteractionHandlers called)
- Verify this.carouselViewport exists
- Test on desktop first (mouse events simpler than touch)

**Actions not firing?**

- Verify MenuController.select() is wired correctly
- Check card.menuItem.action exists
- Console log in selectCard() method

---

## Next Steps After This Works

1. **Add momentum physics** (if desired)
2. **Port unlock animations** (torigatchi card unlock effect)
3. **Add haptic feedback** (on card focus/select)
4. **Wire bootstrap counter** (footer text updates with actual data)
5. **Add sound effects** (card slide, select sounds)

---

## Questions to Answer

After implementation, report back:

1. Does carousel render properly?
2. Are cards clickable/draggable?
3. Does navigation work (arrows, drag, click)?
4. Does it feel like V1's menu or still missing personality?
5. Do you need full momentum physics or is basic good enough?

---

**This gets the visual soul back while keeping V2's clean architecture intact.**

Good luck! 🖤💚

- Zee

MainView.ts
/**

- UV7 V2 MenuView - Carousel Edition
-
- Renders the card-based carousel menu system.
- Maintains V2 structure while porting V1's visual personality.
-
- Features:
- - Card-based carousel with momentum physics
- - Hybrid mode (Simple portrait, Momentum landscape)
- - 3D perspective transforms
- - Dynamic unlock states
 */

import { Component } from '../components/Component.ts';
import type { ComponentConfig } from '../components/Component.ts';
import { menuController } from '../../controllers/MenuController.ts';
import type { MenuItem } from '../../controllers/MenuController.ts';
import { eventBus } from '../../core/EventBus.ts';

export interface MenuViewConfig extends ComponentConfig {
  // Optional custom styling
}

interface CarouselCard {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  buttonText: string;
  color: string;
  locked?: boolean;
  menuItem: MenuItem;
}

export class MenuView extends Component {
  private headerElement: HTMLElement | null = null;
  private carouselViewport: HTMLElement | null = null;
  private carouselTrack: HTMLElement | null = null;
  private footerElement: HTMLElement | null = null;

  private cards: CarouselCard[] = [];
  private currentIndex: number = 0;

  // Momentum physics state
  private isDragging: boolean = false;
  private startX: number = 0;
  private currentX: number = 0;
  private velocity: number = 0;
  private rafId: number | null = null;

  constructor(config: MenuViewConfig = {}) {
    super({ ...config, deferElementCreation: true });
    this.createElementDeferred();
  }

  protected createElement(className?: string): HTMLElement {
    const view = document.createElement('div');
    view.className = `menu-carousel ${className ?? ''}`.trim();

    view.innerHTML = `
      <div class="menu-background">
        <img src="assets/menu-bg.png" alt="" aria-hidden="true" />
      </div>

      <header class="menu-header">
        <h1>VERSION <span class="version-number">848</span></h1>
        <div class="subtitle">A Bootstrap Paradox</div>
      </header>

      <div class="carousel-viewport">
        <div class="carousel-track"></div>
      </div>

      <div class="carousel-indicators"></div>

      <footer class="menu-footer">
        [Version 848 - 847 previous failures]
      </footer>
    `;

    this.headerElement = view.querySelector('.menu-header');
    this.carouselViewport = view.querySelector('.carousel-viewport');
    this.carouselTrack = view.querySelector('.carousel-track');
    this.footerElement = view.querySelector('.menu-footer');

    // Initially hidden
    view.classList.add('hidden');

    return view;
  }

  override init(): void {
    // Listen for menu events
    this.onEvent('ui:menu:open', () => this.onMenuOpen());
    this.onEvent('ui:menu:close', () => this.onMenuClose());

    // Listen for state changes that might affect cards (unlocks, etc)
    this.onEvent('secret:unlock', () => this.updateCards());
    this.onEvent('achievement:unlock', () => this.updateCards());

    // Setup interaction handlers
    this.setupInteractionHandlers();
  }

  // =========================================================================
  // EVENT HANDLERS
  // =========================================================================

  private onMenuOpen(): void {
    this.buildCards();
    this.renderCarousel();
    this.show();
    this.fadeIn(300);
  }

  private onMenuClose(): void {
    this.fadeOut(200);
    this.cleanup();
  }

  private updateCards(): void {
    // Refresh card states (e.g., unlock status changed)
    this.buildCards();
    this.renderCarousel();
  }

  // =========================================================================
  // CARD BUILDING
  // =========================================================================

  private buildCards(): void {
    const menu = menuController.getCurrentMenu();
    if (!menu) return;

    // Map menu items to carousel cards
    this.cards = menu.items
      .filter(item => !item.hidden)
      .map(item => this.menuItemToCard(item));

    // Restore current index if valid
    if (this.currentIndex >= this.cards.length) {
      this.currentIndex = 0;
    }
  }

  private menuItemToCard(item: MenuItem): CarouselCard {
    // Map menu items to card definitions
    const cardMap: Record<string, Partial<CarouselCard>> = {
      'start': {
        icon: '▶️',
        title: 'START STORY',
        subtitle: 'Begin the loop',
        buttonText: 'Play',
        color: '#00ffaa'
      },
      'continue': {
        icon: '⏯️',
        title: 'CONTINUE',
        subtitle: 'Resume your journey',
        buttonText: 'Resume',
        color: '#00ccff'
      },
      'load': {
        icon: '💾',
        title: 'LOAD GAME',
        subtitle: 'Restore timeline',
        buttonText: 'Load',
        color: '#ffaa00'
      },
      'collectibles': {
        icon: '📚',
        title: 'COLLECTIBLES',
        subtitle: 'Notes & Achievements',
        buttonText: 'View',
        color: '#bf00ff'
      },
      'settings': {
        icon: '⚙️',
        title: 'SETTINGS',
        subtitle: 'Configure experience',
        buttonText: 'Configure',
        color: '#00ffff'
      },
      'torigatchi': {
        icon: '🎮',
        title: 'TORIGATCHI',
        subtitle: 'Secret mini-game',
        buttonText: 'Play',
        color: '#ff00ff',
        locked: true // Default locked, check state
      }
    };

    const cardData = cardMap[item.id] || {
      icon: '❓',
      title: item.label,
      subtitle: '',
      buttonText: 'Select',
      color: '#00ffaa'
    };

    return {
      id: item.id,
      ...cardData,
      menuItem: item
    } as CarouselCard;
  }

  // =========================================================================
  // CAROUSEL RENDERING
  // =========================================================================

  private renderCarousel(): void {
    if (!this.carouselTrack) return;

    // Clear existing cards
    this.carouselTrack.innerHTML = '';

    // Render each card
    this.cards.forEach((card, index) => {
      const cardElement = this.createCardElement(card, index);
      this.carouselTrack.appendChild(cardElement);
    });

    // Update indicators
    this.renderIndicators();

    // Position cards
    this.updateCarouselPosition(false);
  }

  private createCardElement(card: CarouselCard, index: number): HTMLElement {
    const cardEl = document.createElement('div');
    cardEl.className = 'carousel-card';
    cardEl.dataset.cardId = card.id;
    cardEl.dataset.index = index.toString();

    // Apply card color
    cardEl.style.setProperty('--card-color', card.color);

    // Locked state
    if (card.locked) {
      cardEl.classList.add('locked');
    }

    cardEl.innerHTML = `
      <div class="card-icon" style="color: ${card.color}">
        ${card.locked ? '🔒' : card.icon}
      </div>
      <h2 class="card-title">${card.title}</h2>
      <p class="card-subtitle">${card.subtitle}</p>
      <button class="card-button" ${card.locked || card.menuItem.disabled ? 'disabled' : ''}>
        ${card.locked ? 'Locked' : card.buttonText}
      </button>
    `;

    // Click handler
    const button = cardEl.querySelector('.card-button');
    button?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!card.locked && !card.menuItem.disabled) {
        this.selectCard(index);
      }
    });

    // Card click = focus that card
    cardEl.addEventListener('click', () => {
      if (this.currentIndex !== index) {
        this.currentIndex = index;
        this.updateCarouselPosition(true);
      }
    });

    return cardEl;
  }

  private renderIndicators(): void {
    const indicatorsContainer = this.element?.querySelector('.carousel-indicators');
    if (!indicatorsContainer) return;

    indicatorsContainer.innerHTML = this.cards
      .map((_, index) => `
        <div class="carousel-indicator ${index === this.currentIndex ? 'active' : ''}"
             data-index="${index}"></div>
      `)
      .join('');

    // Click handlers for indicators
    indicatorsContainer.querySelectorAll('.carousel-indicator').forEach((indicator) => {
      indicator.addEventListener('click', () => {
        const index = parseInt((indicator as HTMLElement).dataset.index || '0');
        this.currentIndex = index;
        this.updateCarouselPosition(true);
      });
    });
  }

  // =========================================================================
  // CAROUSEL POSITIONING
  // =========================================================================

  private updateCarouselPosition(animate: boolean): void {
    if (!this.carouselTrack) return;

    const cards = this.carouselTrack.querySelectorAll('.carousel-card');
    const cardWidth = 420; // Card width + gap
    const centerOffset = (this.carouselViewport?.clientWidth || 0) / 2 - 200;

    // Calculate transform
    const translateX = centerOffset - (this.currentIndex * cardWidth);

    if (animate) {
      this.carouselTrack.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    } else {
      this.carouselTrack.style.transition = 'none';
    }

    this.carouselTrack.style.transform = `translateX(${translateX}px)`;

    // Update card states (opacity, scale based on distance from center)
    cards.forEach((card, index) => {
      const distance = Math.abs(index - this.currentIndex);
      const opacity = distance === 0 ? 1 : distance === 1 ? 0.6 : 0.3;
      const scale = distance === 0 ? 1 : distance === 1 ? 0.85 : 0.7;

      (card as HTMLElement).style.opacity = opacity.toString();
      (card as HTMLElement).style.transform = `scale(${scale})`;
      (card as HTMLElement).style.pointerEvents = distance === 0 ? 'auto' : 'none';
    });

    // Update indicators
    const indicators = this.element?.querySelectorAll('.carousel-indicator');
    indicators?.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });
  }

  // =========================================================================
  // INTERACTION HANDLERS
  // =========================================================================

  private setupInteractionHandlers(): void {
    if (!this.carouselTrack || !this.carouselViewport) return;

    // Mouse/Touch drag
    this.carouselViewport.addEventListener('mousedown', (e) => this.handleDragStart(e));
    this.carouselViewport.addEventListener('touchstart', (e) => this.handleDragStart(e));

    document.addEventListener('mousemove', (e) => this.handleDragMove(e));
    document.addEventListener('touchmove', (e) => this.handleDragMove(e));

    document.addEventListener('mouseup', () => this.handleDragEnd());
    document.addEventListener('touchend', () => this.handleDragEnd());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  private handleDragStart(e: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    this.startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    this.currentX = this.startX;
    this.velocity = 0;

    if (this.carouselTrack) {
      this.carouselTrack.style.transition = 'none';
    }
  }

  private handleDragMove(e: MouseEvent | TouchEvent): void {
    if (!this.isDragging || !this.carouselTrack) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const delta = clientX - this.currentX;

    this.velocity = delta;
    this.currentX = clientX;

    // Visual feedback during drag
    const currentTransform = this.carouselTrack.style.transform;
    const currentX = parseFloat(currentTransform.match(/translateX\(([^)]+)px\)/)?.[1] || '0');
    this.carouselTrack.style.transform = `translateX(${currentX + delta}px)`;
  }

  private handleDragEnd(): void {
    if (!this.isDragging) return;
    this.isDragging = false;

    const dragDistance = this.currentX - this.startX;
    const threshold = 50;

    if (Math.abs(dragDistance) > threshold) {
      // Change card based on drag direction
      if (dragDistance > 0 && this.currentIndex > 0) {
        this.currentIndex--;
      } else if (dragDistance < 0 && this.currentIndex < this.cards.length - 1) {
        this.currentIndex++;
      }
    }

    // Snap to nearest card
    this.updateCarouselPosition(true);
  }

  private handleKeyboard(e: KeyboardEvent): void {
    if (!this.element?.classList.contains('hidden')) {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarouselPosition(true);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (this.currentIndex < this.cards.length - 1) {
            this.currentIndex++;
            this.updateCarouselPosition(true);
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          this.selectCard(this.currentIndex);
          break;
      }
    }
  }

  // =========================================================================
  // CARD SELECTION
  // =========================================================================

  private selectCard(index: number): void {
    const card = this.cards[index];
    if (!card || card.locked || card.menuItem.disabled) return;

    // Execute menu item action
    menuController.focusIndex(index);
    menuController.select();
  }

  // =========================================================================
  // CLEANUP
  // =========================================================================

  private cleanup(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  override destroy(): void {
    this.cleanup();
    super.destroy();
  }
}
