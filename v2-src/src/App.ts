/**
 * UV7 V2 App Orchestrator
 *
 * Main application class that bootstraps and coordinates all systems.
 */

import { eventBus } from './core/EventBus.ts';
import { stateManager } from './core/StateManager.ts';
import { settingsSystem } from './systems/SettingsSystem.ts';
import { saveSystem } from './systems/SaveSystem.ts';
import { assetLoader } from './systems/AssetLoader.ts';
import { tetherController } from './controllers/TetherController.ts';
import { dialogController } from './controllers/DialogController.ts';
import { routeController } from './controllers/RouteController.ts';
import { effectsController } from './controllers/EffectsController.ts';
import { menuController } from './controllers/MenuController.ts';
import { SplashScreen } from './ui/views/SplashScreen.ts';
import { GameView } from './ui/views/GameView.ts';
import { MenuView } from './ui/views/MenuView.ts';
import type { GameSystem } from './core/index.ts';

export type AppState = 'loading' | 'splash' | 'menu' | 'playing' | 'paused';

export interface AppConfig {
  container: HTMLElement;
  skipSplash?: boolean;
}

export class App {
  private container: HTMLElement;
  private state: AppState = 'loading';
  private systems: GameSystem[] = [];

  // Views
  private splashScreen: SplashScreen | null = null;
  private menuView: MenuView | null = null;
  private gameView: GameView | null = null;

  constructor(config: AppConfig) {
    this.container = config.container;
  }

  /**
   * Initialize and start the application
   */
  async start(skipSplash = false): Promise<void> {
    console.log('[UV7] Starting application...');

    // Initialize all systems
    await this.initializeSystems();

    // Set up event listeners
    this.setupEventListeners();

    // Register menus
    this.registerMenus();

    if (skipSplash) {
      await this.showMainMenu();
    } else {
      await this.showSplash();
    }
  }

  /**
   * Shutdown the application
   */
  destroy(): void {
    console.log('[UV7] Shutting down...');

    this.splashScreen?.destroy();
    this.menuView?.destroy();
    this.gameView?.destroy();

    for (const system of this.systems) {
      system.destroy?.();
    }

    this.systems = [];
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  private async initializeSystems(): Promise<void> {
    // Register systems in dependency order
    this.systems = [
      settingsSystem,
      saveSystem,
      assetLoader,
      tetherController,
      dialogController,
      routeController,
      effectsController,
      menuController,
    ];

    // Initialize each system
    for (const system of this.systems) {
      console.log(`[UV7] Initializing ${system.name}...`);
      await system.init?.();
    }

    console.log('[UV7] All systems initialized');
  }

  private setupEventListeners(): void {
    // Dialog completion -> check for choices or advance
    eventBus.on('dialog:complete', () => {
      // Scene might have choices, handled by RouteController
    });

    // Menu open/close -> pause/resume game
    eventBus.on('ui:menu:open', ({ menuId }) => {
      if (menuId === 'pause' && this.state === 'playing') {
        this.setState('paused');
      }
    });

    eventBus.on('ui:menu:close', ({ menuId }) => {
      if (menuId === 'pause' && this.state === 'paused') {
        this.setState('playing');
      }
    });

    // Tether empty -> game over
    eventBus.on('tether:empty', () => {
      console.log('[UV7] Tether depleted - game over');
      // TODO: Show game over screen
    });
  }

  private registerMenus(): void {
    menuController.registerMenu({
      id: 'main',
      title: 'UV7',
      items: [
        { id: 'new-game', label: 'New Game', action: () => this.startNewGame() },
        { id: 'continue', label: 'Continue', action: () => this.continueGame(), disabled: true }, // TODO: Check for saves
        { id: 'settings', label: 'Settings', submenu: 'settings' },
        { id: 'credits', label: 'Credits', action: () => this.showCredits() },
      ],
    });

    menuController.registerMenu({
      id: 'pause',
      title: 'Paused',
      items: [
        { id: 'resume', label: 'Resume', action: () => menuController.close() },
        { id: 'save', label: 'Save Game', submenu: 'save' },
        { id: 'load', label: 'Load Game', submenu: 'load' },
        { id: 'settings', label: 'Settings', submenu: 'settings' },
        { id: 'quit', label: 'Quit to Menu', action: () => this.quitToMenu() },
      ],
    });

    menuController.registerMenu({
      id: 'settings',
      title: 'Settings',
      items: [
        { id: 'text-speed', label: 'Text Speed' },
        { id: 'auto-advance', label: 'Auto Advance' },
        { id: 'audio', label: 'Audio' },
        { id: 'back', label: 'Back', action: () => menuController.back() },
      ],
    });
  }

  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================

  private setState(state: AppState): void {
    const prevState = this.state;
    this.state = state;
    console.log(`[UV7] State: ${prevState} -> ${state}`);
  }

  getState(): AppState {
    return this.state;
  }

  // =========================================================================
  // SCREENS
  // =========================================================================

  private async showSplash(): Promise<void> {
    this.setState('splash');

    this.splashScreen = new SplashScreen({
      container: this.container,
      onComplete: () => this.showMainMenu(),
    });

    this.splashScreen.mount(this.container);
    await this.splashScreen.start();
  }

  private async showMainMenu(): Promise<void> {
    this.setState('menu');

    // Clean up splash if exists
    this.splashScreen?.destroy();
    this.splashScreen = null;

    // Create menu view if not exists
    if (!this.menuView) {
      this.menuView = new MenuView({ container: this.container });
      this.menuView.mount(this.container);
    }

    // Show main menu
    menuController.open('main');
  }

  private async startNewGame(): Promise<void> {
    console.log('[UV7] Starting new game...');

    menuController.closeAll();
    this.setState('playing');

    // Reset state
    stateManager.reset();
    tetherController.reset();

    // Create game view
    this.gameView = new GameView({
      container: this.container,
      onAdvance: () => dialogController.advance(),
      onChoice: (_choice, index) => dialogController.selectChoice(index),
    });
    this.gameView.mount(this.container);

    // Start prologue
    await routeController.loadScene('prologue-scene1');
  }

  private async continueGame(): Promise<void> {
    console.log('[UV7] Continue game...');
    // TODO: Show load menu or load most recent
    menuController.open('load');
  }

  private showCredits(): void {
    console.log('[UV7] Show credits...');
    // TODO: Implement credits screen
  }

  private quitToMenu(): void {
    console.log('[UV7] Quitting to menu...');

    menuController.closeAll();
    this.gameView?.destroy();
    this.gameView = null;

    this.showMainMenu();
  }
}
