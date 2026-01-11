/**
 * UV7 V2 Theme Manager
 *
 * Character-based theming system.
 * Cyan for Ronnie, Magenta for Tori.
 *
 * Features:
 * - CSS custom property updates
 * - Route-based auto-switching
 * - Transition animations
 * - Menu theme support
 */

import { eventBus, EventBus } from '../core/EventBus.ts';
import type { GameSystem } from '../core/index.ts';

export interface Theme {
  name: string;
  primary: string;
  primaryRgb: string;
  accent: string;
  glow: string;
  glowStrong: string;
  background: string;
  backgroundSolid: string;
  border: string;
  text: string;
  textMuted: string;
  success: string;
  warning: string;
  error: string;
}

// Ronnie/Menu theme - Cyan
export const THEME_RONNIE: Theme = {
  name: 'ronnie',
  primary: '#00ffff',
  primaryRgb: '0, 255, 255',
  accent: '#00ccff',
  glow: 'rgba(0, 255, 255, 0.5)',
  glowStrong: 'rgba(0, 255, 255, 0.8)',
  background: 'rgba(0, 10, 20, 0.95)',
  backgroundSolid: '#000a14',
  border: '#00ffff',
  text: '#00ffff',
  textMuted: '#66cccc',
  success: '#00ff88',
  warning: '#ffcc00',
  error: '#ff4444',
};

// Tori theme - Magenta
export const THEME_TORI: Theme = {
  name: 'tori',
  primary: '#ff00ff',
  primaryRgb: '255, 0, 255',
  accent: '#ff66ff',
  glow: 'rgba(255, 0, 255, 0.5)',
  glowStrong: 'rgba(255, 0, 255, 0.8)',
  background: 'rgba(20, 0, 20, 0.95)',
  backgroundSolid: '#140014',
  border: '#ff00ff',
  text: '#ff00ff',
  textMuted: '#cc66cc',
  success: '#00ff88',
  warning: '#ffcc00',
  error: '#ff4444',
};

// Neutral menu theme
export const THEME_MENU: Theme = THEME_RONNIE;

export interface ThemeManagerConfig {
  eventBus?: EventBus;
  defaultTheme?: Theme;
}

export class ThemeManager implements GameSystem {
  readonly name = 'ThemeManager';

  private eventBus: EventBus;
  private currentTheme: Theme;
  private root: HTMLElement | null = null;

  constructor(config: ThemeManagerConfig = {}) {
    this.eventBus = config.eventBus ?? eventBus;
    this.currentTheme = config.defaultTheme ?? THEME_MENU;
  }

  // =========================================================================
  // LIFECYCLE
  // =========================================================================

  init(): void {
    if (typeof document !== 'undefined') {
      this.root = document.documentElement;
      this.applyTheme(this.currentTheme);
    }

    // Listen for route changes to auto-switch themes
    this.eventBus.on('route:change', ({ route }) => {
      this.setThemeForRoute(route);
    });
  }

  destroy(): void {
    // Nothing to clean up
  }

  // =========================================================================
  // PUBLIC API
  // =========================================================================

  /**
   * Get the current theme
   */
  getTheme(): Theme {
    return this.currentTheme;
  }

  /**
   * Set a specific theme
   */
  setTheme(theme: Theme, animate = true): void {
    if (theme.name === this.currentTheme.name) return;

    const prevTheme = this.currentTheme;
    this.currentTheme = theme;

    if (animate) {
      this.animateThemeTransition(() => {
        this.applyTheme(theme);
      });
    } else {
      this.applyTheme(theme);
    }

    this.eventBus.emit('theme:change', { theme, prevTheme });
  }

  /**
   * Set theme by name
   */
  setThemeByName(name: 'ronnie' | 'tori' | 'menu'): void {
    switch (name) {
      case 'ronnie':
        this.setTheme(THEME_RONNIE);
        break;
      case 'tori':
        this.setTheme(THEME_TORI);
        break;
      case 'menu':
        this.setTheme(THEME_MENU);
        break;
    }
  }

  /**
   * Auto-set theme based on current route
   */
  setThemeForRoute(route: string): void {
    if (route.startsWith('tori')) {
      this.setTheme(THEME_TORI);
    } else if (route.startsWith('ronnie')) {
      this.setTheme(THEME_RONNIE);
    }
    // Keep current theme for shared/prologue scenes
  }

  /**
   * Get primary color (useful for canvas effects)
   */
  getPrimaryColor(): string {
    return this.currentTheme.primary;
  }

  // =========================================================================
  // PRIVATE
  // =========================================================================

  private applyTheme(theme: Theme): void {
    if (!this.root) return;

    // Apply all CSS custom properties
    this.root.style.setProperty('--theme-primary', theme.primary);
    this.root.style.setProperty('--theme-primary-rgb', theme.primaryRgb);
    this.root.style.setProperty('--theme-accent', theme.accent);
    this.root.style.setProperty('--theme-glow', theme.glow);
    this.root.style.setProperty('--theme-glow-strong', theme.glowStrong);
    this.root.style.setProperty('--theme-background', theme.background);
    this.root.style.setProperty('--theme-background-solid', theme.backgroundSolid);
    this.root.style.setProperty('--theme-border', theme.border);
    this.root.style.setProperty('--theme-text', theme.text);
    this.root.style.setProperty('--theme-text-muted', theme.textMuted);
    this.root.style.setProperty('--theme-success', theme.success);
    this.root.style.setProperty('--theme-warning', theme.warning);
    this.root.style.setProperty('--theme-error', theme.error);

    // Add theme class to body for additional styling hooks
    if (typeof document !== 'undefined') {
      document.body.classList.remove('theme-ronnie', 'theme-tori', 'theme-menu');
      document.body.classList.add(`theme-${theme.name}`);
    }
  }

  private animateThemeTransition(callback: () => void): void {
    if (!this.root) {
      callback();
      return;
    }

    // Add transition class
    this.root.classList.add('theme-transitioning');

    // Apply transition
    this.root.style.setProperty('--theme-transition-duration', '300ms');

    // Wait for next frame then apply
    requestAnimationFrame(() => {
      callback();

      // Remove transition class after duration
      setTimeout(() => {
        this.root?.classList.remove('theme-transitioning');
      }, 300);
    });
  }
}

// Singleton instance
export const themeManager = new ThemeManager();
