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
import { audioSystem } from './systems/AudioSystem.ts';
import { themeManager } from './systems/ThemeManager.ts';
import { tetherController } from './controllers/TetherController.ts';
import { dialogController } from './controllers/DialogController.ts';
import { routeController } from './controllers/RouteController.ts';
import { effectsController } from './controllers/EffectsController.ts';
import { menuController } from './controllers/MenuController.ts';
import { sceneRunner } from './controllers/SceneRunner.ts';
import { easterEggController } from './controllers/EasterEggController.ts';
import { SplashScreen } from './ui/views/SplashScreen.ts';
import { GameView } from './ui/views/GameView.ts';
import { MenuCarouselView } from './ui/views/MenuCarouselView.ts';
import type { MenuCard } from './ui/views/MenuCarouselView.ts';
import { GameOverView } from './ui/views/GameOverView.ts';
import { CreditsView } from './ui/views/CreditsView.ts';
import { CodeRain } from './ui/components/CodeRain.ts';
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
  private menuCarousel: MenuCarouselView | null = null;
  private gameView: GameView | null = null;
  private gameOverView: GameOverView | null = null;
  private creditsView: CreditsView | null = null;

  // Effects
  private codeRain: CodeRain | null = null;

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
    this.menuCarousel?.destroy();
    this.gameView?.destroy();
    this.gameOverView?.destroy();
    this.creditsView?.destroy();
    this.codeRain?.destroy();

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
      audioSystem,
      themeManager,
      tetherController,
      dialogController,
      effectsController,
      sceneRunner,
      routeController,
      menuController,
      easterEggController,
    ];

    // Initialize each system
    for (const system of this.systems) {
      console.log(`[UV7] Initializing ${system.name}...`);
      await system.init?.();
    }

    // Wire RouteController to SceneRunner (after both are initialized)
    routeController.setSceneRunner(sceneRunner);

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
      this.showGameOver();
    });
  }

  private showGameOver(): void {
    this.setState('paused');

    if (!this.gameOverView) {
      this.gameOverView = new GameOverView({
        container: this.container,
        onLoadSave: () => this.loadMostRecentSave(),
        onRestart: () => this.restartGame(),
        onReturnToMenu: () => this.quitToMenu(),
      });
      this.gameOverView.mount(this.container);
    }

    // Set attempt number from state
    const playthrough = stateManager.get('playthrough');
    this.gameOverView.setAttemptNumber(playthrough);
    this.gameOverView.show();
  }

  private async loadMostRecentSave(): Promise<void> {
    const mostRecent = saveSystem.getMostRecentSlot();
    if (!mostRecent) {
      eventBus.emit('ui:notification', { message: 'No saves found', type: 'warning' });
      return;
    }

    this.gameOverView?.hide();
    await this.loadGame(mostRecent.id);
  }

  private async restartGame(): Promise<void> {
    this.gameOverView?.hide();
    this.gameOverView?.destroy();
    this.gameOverView = null;

    this.gameView?.destroy();
    this.gameView = null;

    await this.startNewGame();
  }

  private registerMenus(): void {
    const hasSaves = saveSystem.getMostRecentSlot() !== null;

    menuController.registerMenu({
      id: 'main',
      title: 'UV7',
      items: [
        { id: 'new-game', label: 'New Game', action: () => this.startNewGame() },
        { id: 'continue', label: 'Continue', action: () => this.continueGame(), disabled: !hasSaves },
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
    const hadSplash = this.splashScreen !== null;
    this.splashScreen?.destroy();
    this.splashScreen = null;

    // Build menu cards
    const menuCards = this.buildMenuCards();

    // Code rain transition before revealing menu (if coming from splash)
    if (hadSplash) {
      // Create code rain if not exists
      if (!this.codeRain) {
        this.codeRain = new CodeRain({
          color: themeManager.getPrimaryColor(),
        });
        this.codeRain.mount(this.container);
        this.codeRain.init();
      }

      // Create menu carousel while rain covers screen
      await this.codeRain.transition(() => {
        if (!this.menuCarousel) {
          this.menuCarousel = new MenuCarouselView({
            container: this.container,
            cards: menuCards,
          });
          this.menuCarousel.mount(this.container);
        }
      }, 1500);

      // Show carousel menu after rain clears
      this.menuCarousel?.showMenu();
    } else {
      // Direct show (no transition)
      if (!this.menuCarousel) {
        this.menuCarousel = new MenuCarouselView({
          container: this.container,
          cards: menuCards,
        });
        this.menuCarousel.mount(this.container);
      }
      this.menuCarousel.showMenu();
    }
  }

  private buildMenuCards(): MenuCard[] {
    const hasSaves = saveSystem.getMostRecentSlot() !== null;
    const torigatchiUnlocked = localStorage.getItem('torigatchi_unlocked') === 'true';

    return [
      {
        id: 'settings',
        icon: '⚙️',
        title: 'SETTINGS',
        subtitle: 'Configure experience',
        buttonText: 'SELECT',
        action: () => menuController.open('settings'),
      },
      {
        id: 'start',
        icon: '▶️',
        title: 'START STORY',
        subtitle: 'Begin Version 848',
        buttonText: 'SELECT',
        action: () => this.startNewGame(),
      },
      {
        id: 'continue',
        icon: '⏯️',
        title: 'CONTINUE',
        subtitle: hasSaves ? 'Resume your journey' : 'No saves found',
        buttonText: hasSaves ? 'SELECT' : 'LOCKED',
        action: () => this.continueGame(),
        locked: !hasSaves,
        lockedReason: 'No saves',
        special: 'continue',
      },
      {
        id: 'load',
        icon: '💾',
        title: 'LOAD GAME',
        subtitle: 'Restore saved timeline',
        buttonText: 'SELECT',
        action: () => menuController.open('load'),
      },
      {
        id: 'notes',
        icon: '📝',
        title: 'NOTES',
        subtitle: 'Collected fragments',
        buttonText: 'SELECT',
        action: () => menuController.open('notes'),
      },
      {
        id: 'torigatchi',
        icon: '🎮',
        title: 'TORI-GATCHI',
        subtitle: 'Can you hear me...?',
        buttonText: torigatchiUnlocked ? 'SELECT' : 'LOCKED',
        action: () => this.openTorigatchi(),
        locked: !torigatchiUnlocked,
        lockedReason: 'Find the secret',
        special: 'torigatchi',
      },
      {
        id: 'credits',
        icon: '⭐',
        title: 'CREDITS',
        subtitle: 'The UV7 Crew',
        buttonText: 'SELECT',
        action: () => this.showCredits(),
      },
      {
        id: 'crew',
        icon: '👥',
        title: 'MEET THE CREW',
        subtitle: 'United Voices 7',
        buttonText: 'SELECT',
        action: () => this.showMeetTheCrew(),
      },
      {
        id: 'directors',
        icon: '🎬',
        title: "DIRECTOR'S CUT",
        subtitle: 'Behind the scenes',
        buttonText: 'SELECT',
        action: () => this.showDirectorsCut(),
      },
      {
        id: 'contact',
        icon: '📧',
        title: 'CONTACT',
        subtitle: 'Get in touch',
        buttonText: 'SELECT',
        action: () => this.showContact(),
      },
    ];
  }

  private async startNewGame(): Promise<void> {
    console.log('[UV7] Starting new game...');

    menuController.closeAll();
    this.menuCarousel?.hideMenu();
    this.setState('playing');

    // Reset state
    stateManager.reset();
    tetherController.reset();

    // Create game view
    this.gameView = new GameView({
      container: this.container,
      onAdvance: () => routeController.advance(),
      onChoice: (_choice, index) => dialogController.selectChoice(index),
    });
    this.gameView.mount(this.container);

    // Wire scene callbacks to GameView
    this.setupSceneCallbacks();

    // Start prologue
    await routeController.loadScene('prologue-scene1');
  }

  private setupSceneCallbacks(): void {
    if (!this.gameView) return;

    const gameView = this.gameView;

    routeController.setSceneCallbacks({
      onBackground: (bg) => {
        if (bg) {
          gameView.setBackground(`/assets/backgrounds/${bg}.jpg`);
        } else {
          gameView.clearBackground();
        }
      },

      onSprites: (sprites) => {
        gameView.clearCharacters();
        if (sprites) {
          for (const sprite of sprites) {
            gameView.showCharacter(sprite.character, sprite.emotion, sprite.position);
          }
        }
      },

      onMusic: (music) => {
        if (music) {
          audioSystem.playMusic(music);
        } else {
          audioSystem.stopMusic();
        }
      },

      onComplete: (_scene) => {
        // Scene finished, waiting for input or auto-advance
      },

      onTransition: (_nextSceneId) => {
        // Handled by RouteController internally
      },
    });
  }

  private async continueGame(): Promise<void> {
    console.log('[UV7] Continue game...');

    // Try to load the most recent save
    const mostRecent = saveSystem.getMostRecentSlot();
    if (!mostRecent) {
      console.warn('[UV7] No saves found');
      return;
    }

    await this.loadGame(mostRecent.id);
  }

  private async loadGame(slot: number): Promise<void> {
    console.log(`[UV7] Loading save from slot ${slot}...`);

    const success = saveSystem.load(slot);
    if (!success) {
      console.error(`[UV7] Failed to load save from slot ${slot}`);
      eventBus.emit('ui:notification', {
        message: 'Failed to load save',
        type: 'error',
      });
      return;
    }

    menuController.closeAll();
    this.setState('playing');

    // Create game view if needed
    if (!this.gameView) {
      this.gameView = new GameView({
        container: this.container,
        onAdvance: () => routeController.advance(),
        onChoice: (_choice, index) => dialogController.selectChoice(index),
      });
      this.gameView.mount(this.container);
      this.setupSceneCallbacks();
    }

    // Resume from saved state
    await routeController.resumeFromState();
  }

  private showCredits(): void {
    console.log('[UV7] Show credits...');

    menuController.closeAll();
    this.menuCarousel?.hideMenu();

    if (!this.creditsView) {
      this.creditsView = new CreditsView({
        container: this.container,
        onComplete: () => this.onCreditsComplete(),
      });
      this.creditsView.mount(this.container);
    }

    this.creditsView.start();
  }

  private onCreditsComplete(): void {
    this.creditsView?.stop();
    this.showMainMenu();
  }

  private quitToMenu(): void {
    console.log('[UV7] Quitting to menu...');

    menuController.closeAll();
    this.gameView?.destroy();
    this.gameView = null;

    this.showMainMenu();
  }

  // =========================================================================
  // ADDITIONAL MENU FEATURES (Stubs for V1 parity)
  // =========================================================================

  private openTorigatchi(): void {
    console.log('[UV7] Opening Tori-Gatchi...');
    // TODO: Implement Torigatchi minigame
    eventBus.emit('ui:notification', {
      message: 'Tori-Gatchi coming soon!',
      type: 'info',
    });
  }

  private showMeetTheCrew(): void {
    console.log('[UV7] Show Meet The Crew...');
    // TODO: Implement crew page
    eventBus.emit('ui:notification', {
      message: 'Meet The Crew coming soon!',
      type: 'info',
    });
  }

  private showDirectorsCut(): void {
    console.log("[UV7] Show Director's Cut...");
    // TODO: Implement director's cut
    eventBus.emit('ui:notification', {
      message: "Director's Cut coming soon!",
      type: 'info',
    });
  }

  private showContact(): void {
    console.log('[UV7] Show Contact...');
    // TODO: Implement contact page
    eventBus.emit('ui:notification', {
      message: 'Contact coming soon!',
      type: 'info',
    });
  }
}
