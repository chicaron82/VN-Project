/**
 * Version 848 - V3 Clean Rebuild
 * Entry Point
 *
 * Strategy: V2's TypeScript Systems + V1's Visual Presentation
 *
 * This file bridges V2's EventBus/StateManager architecture with
 * V1's hardcoded HTML UI chrome for authentic presentation.
 *
 * 💚🔥💀
 */

import { EventBus } from '../v2/core/EventBus';
import { StateManager } from '../v2/core/StateManager';
import { TetherSystem } from '../v2/systems/TetherSystem';
import { EchoMemorySystem } from '../v2/systems/EchoMemorySystem';
import { ContentLoader } from '../v2/systems/ContentLoader';
import { HapticSystem } from '../v2/systems/HapticSystem';
import { SecretCodesSystem } from '../v2/systems/SecretCodesSystem';
import { DevCommentarySystem } from '../v2/systems/DevCommentarySystem';
import { BootstrapTracker } from '../v2/systems/BootstrapTracker';

// Import route JSON data
import prologueData from '../v2/content/routes/prologue.json';
import ronnieAct1Data from '../v2/content/routes/ronnie_act1.json';
import ronnieAct2Data from '../v2/content/routes/ronnie_act2.json';
import ronnieAct3Data from '../v2/content/routes/ronnie_act3.json';
import toriAct1Data from '../v2/content/routes/tori_act1.json';
import toriAct2Data from '../v2/content/routes/tori_act2.json';
import toriAct3Data from '../v2/content/routes/tori_act3.json';

/**
 * V3GameEngine - Bridge between V2 Systems and V1 UI
 *
 * This class connects V2's EventBus-driven architecture to V1's
 * DOM-based presentation layer, ensuring indistinguishable experience.
 */
class V3GameEngine {
    private eventBus: EventBus;
    private stateManager: StateManager;
    private tetherSystem: TetherSystem | null = null;
    private echoMemory: EchoMemorySystem | null = null;
    private contentLoader: ContentLoader;
    private hapticSystem: HapticSystem;
    private devCommentary: DevCommentarySystem | null = null;
    private bootstrapTracker: BootstrapTracker | null = null;

    // V1 UI Elements
    private mainMenu: HTMLElement;
    private routeSelect: HTMLElement;
    private gameView: HTMLElement;
    private dialogueBox: HTMLElement;
    private characterName: HTMLElement;
    private dialogueText: HTMLElement;
    private internalThought: HTMLElement;
    private statusLoop: HTMLElement;
    private statusRoute: HTMLElement;
    private statusTether: HTMLElement;
    private tetherFill: HTMLElement;
    private holdOnButton: HTMLElement;
    private sceneBackground: HTMLElement;
    private characterLeft: HTMLElement;
    private characterRight: HTMLElement;
    private choiceMenu: HTMLElement;

    // State
    private currentRoute: 'ronnie' | 'tori' | null = null;
    private currentSceneIndex: number = 0;
    private currentScenes: any[] = [];
    private isTyping: boolean = false;
    private typewriterInterval: number | null = null;

    constructor() {
        console.log('💚 V3 Engine: Initializing...');

        // Initialize V2 Core Systems
        this.eventBus = new EventBus();
        this.stateManager = new StateManager(this.eventBus, {
            currentScene: 'none',
            currentRoute: null,
            tetherLevel: 100,
            flags: {},
            history: [],
            playtime: 0,
            game: {
                loopVersion: 848
            }
        });

        // Initialize Content Loader with route data
        this.contentLoader = new ContentLoader(this.eventBus);
        this.loadRouteData();

        // Initialize Haptic System
        this.hapticSystem = new HapticSystem(this.eventBus);

        // Get V1 UI Elements
        this.mainMenu = document.getElementById('main-menu')!;
        this.routeSelect = document.getElementById('route-select')!;
        this.gameView = document.getElementById('game-view')!;
        this.dialogueBox = document.getElementById('dialogue-box')!;
        this.characterName = document.getElementById('character-name')!;
        this.dialogueText = document.getElementById('dialogue-text')!;
        this.internalThought = document.getElementById('internal-thought')!;
        this.statusLoop = document.getElementById('status-loop')!;
        this.statusRoute = document.getElementById('status-route')!;
        this.statusTether = document.getElementById('status-tether')!;
        this.tetherFill = this.statusTether?.querySelector('.tether-fill') as HTMLElement;
        this.holdOnButton = document.getElementById('hold-on-button')!;
        this.sceneBackground = document.getElementById('scene-background')!;
        this.characterLeft = document.getElementById('character-left')!;
        this.characterRight = document.getElementById('character-right')!;
        this.choiceMenu = document.getElementById('choice-menu')!;

        // Bind UI Event Handlers
        this.bindUIHandlers();

        // Listen to V2 EventBus events
        this.bindSystemEvents();

        console.log('✅ V3 Engine: Core systems ready');
    }

    /**
     * Load route data into ContentLoader
     */
    private loadRouteData() {
        this.contentLoader.loadRoute('prologue', prologueData);
        this.contentLoader.loadRoute('ronnie_act1', ronnieAct1Data);
        this.contentLoader.loadRoute('ronnie_act2', ronnieAct2Data);
        this.contentLoader.loadRoute('ronnie_act3', ronnieAct3Data);
        this.contentLoader.loadRoute('tori_act1', toriAct1Data);
        this.contentLoader.loadRoute('tori_act2', toriAct2Data);
        this.contentLoader.loadRoute('tori_act3', toriAct3Data);
    }

    /**
     * Bind V1 UI event handlers
     */
    private bindUIHandlers() {
        // Main Menu Buttons
        const startBtn = this.mainMenu.querySelector('[data-action="start"]') as HTMLElement;
        startBtn?.addEventListener('click', () => this.startGame());

        // Route Selection
        const ronnieCard = this.routeSelect.querySelector('[data-route="ronnie"]') as HTMLElement;
        const toriCard = this.routeSelect.querySelector('[data-route="tori"]') as HTMLElement;
        ronnieCard?.addEventListener('click', () => this.selectRoute('ronnie'));
        toriCard?.addEventListener('click', () => this.selectRoute('tori'));

        // Hold On Button (Tori Route Tether)
        this.holdOnButton?.addEventListener('click', () => {
            if (this.tetherSystem) {
                this.tetherSystem.holdOn();
            }
        });

        // Dialogue advancement (click anywhere in game view)
        this.gameView?.addEventListener('click', (e) => {
            if (this.isTyping) {
                this.skipTypewriter();
            } else {
                this.advanceScene();
            }
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.gameView.style.display !== 'none') {
                e.preventDefault();
                if (this.isTyping) {
                    this.skipTypewriter();
                } else {
                    this.advanceScene();
                }
            }
        });
    }

    /**
     * Bind V2 EventBus events to V1 UI updates
     */
    private bindSystemEvents() {
        // Tether updates
        this.eventBus.on('tether:changed', (data) => {
            this.updateTetherUI(data.level);
        });

        // Route changes
        this.eventBus.on('route:selected', (data) => {
            this.statusRoute.textContent = data.route === 'ronnie' ? 'Ronnie Route' : 'Tori Route';
        });

        // Loop version display
        const loopVersion = this.stateManager.get('game.loopVersion') || 848;
        this.statusLoop.textContent = `v.${loopVersion}`;
    }

    /**
     * Update Tether UI (Tori Route)
     */
    private updateTetherUI(level: number) {
        if (this.tetherFill) {
            this.tetherFill.style.width = `${level}%`;
            const tetherValue = this.statusTether.querySelector('#status-tether-value');
            if (tetherValue) {
                tetherValue.textContent = `${Math.floor(level)}%`;
            }

            // Add danger class if low
            if (level < 30) {
                this.tetherFill.classList.add('danger');
            } else {
                this.tetherFill.classList.remove('danger');
            }
        }
    }

    /**
     * Start Game - Show Prologue
     */
    public async startGame() {
        console.log('🚀 Starting game...');

        // Hide main menu, show route select after prologue
        this.mainMenu.style.display = 'none';

        // Load and display prologue
        const prologueScenes = this.contentLoader.getRoute('prologue')?.scenes || [];
        this.currentScenes = prologueScenes;
        this.currentSceneIndex = 0;

        // Show game view
        this.gameView.style.display = 'block';
        this.statusRoute.textContent = 'Prologue';

        // Display first scene
        this.displayCurrentScene();
    }

    /**
     * Select Route (Ronnie or Tori)
     */
    public selectRoute(route: 'ronnie' | 'tori') {
        console.log(`🔀 Route selected: ${route}`);

        this.currentRoute = route;
        this.stateManager.set('currentRoute', route);
        this.eventBus.emit('route:selected', { route });

        // Hide route select, show game view
        this.routeSelect.style.display = 'none';
        this.gameView.style.display = 'block';

        // Initialize route-specific systems
        if (route === 'tori') {
            // Initialize Tether System for Tori route
            this.tetherSystem = new TetherSystem(this.eventBus, this.stateManager);
            this.tetherSystem.init();
            this.statusTether.style.display = 'flex';
            this.holdOnButton.style.display = 'block';

            // Initialize Echo Memory System
            this.echoMemory = new EchoMemorySystem(this.eventBus, this.stateManager);
        }

        // Load Act 1 scenes
        const act1Scenes = this.contentLoader.getRoute(`${route}_act1`)?.scenes || [];
        this.currentScenes = act1Scenes;
        this.currentSceneIndex = 0;

        this.displayCurrentScene();
    }

    /**
     * Display Current Scene
     */
    private displayCurrentScene() {
        if (this.currentSceneIndex >= this.currentScenes.length) {
            // End of current act/route
            this.handleSceneChainEnd();
            return;
        }

        const scene = this.currentScenes[this.currentSceneIndex];

        // Update character name
        this.characterName.textContent = scene.character || '';

        // Update internal thought/stage direction
        if (scene.internal) {
            this.internalThought.textContent = scene.internal;
            this.internalThought.style.display = 'block';
        } else {
            this.internalThought.style.display = 'none';
        }

        // Update background
        if (scene.background) {
            this.sceneBackground.style.backgroundImage = `url('${scene.background}')`;
        }

        // Update sprites
        if (scene.sprites) {
            if (scene.sprites.left) {
                this.characterLeft.style.backgroundImage = `url('${scene.sprites.left}')`;
                this.characterLeft.style.display = 'block';
            } else {
                this.characterLeft.style.display = 'none';
            }

            if (scene.sprites.right) {
                this.characterRight.style.backgroundImage = `url('${scene.sprites.right}')`;
                this.characterRight.style.display = 'block';
            } else {
                this.characterRight.style.display = 'none';
            }
        }

        // Typewriter effect for dialogue
        this.typewriterText(scene.text || '');

        // Handle choices if present
        if (scene.choices && scene.choices.length > 0) {
            this.displayChoices(scene.choices);
        } else {
            this.choiceMenu.style.display = 'none';
        }
    }

    /**
     * Typewriter Effect (V1 Style - 150ms per character)
     */
    private typewriterText(fullText: string) {
        this.dialogueText.textContent = '';
        this.isTyping = true;

        let charIndex = 0;
        const CHAR_DELAY = 150; // V1 timing - anxious, slow reveal

        this.typewriterInterval = window.setInterval(() => {
            if (charIndex < fullText.length) {
                this.dialogueText.textContent += fullText[charIndex];
                charIndex++;
            } else {
                this.isTyping = false;
                if (this.typewriterInterval) {
                    clearInterval(this.typewriterInterval);
                    this.typewriterInterval = null;
                }
            }
        }, CHAR_DELAY);
    }

    /**
     * Skip Typewriter Animation
     */
    private skipTypewriter() {
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }
        const scene = this.currentScenes[this.currentSceneIndex];
        this.dialogueText.textContent = scene.text || '';
        this.isTyping = false;
    }

    /**
     * Advance to Next Scene
     */
    private advanceScene() {
        this.currentSceneIndex++;
        this.displayCurrentScene();
    }

    /**
     * Display Choice Menu
     */
    private displayChoices(choices: any[]) {
        const container = this.choiceMenu.querySelector('.choice-container')!;
        container.innerHTML = '';

        choices.forEach((choice) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.addEventListener('click', () => this.handleChoice(choice));
            container.appendChild(btn);
        });

        this.choiceMenu.style.display = 'flex';
    }

    /**
     * Handle Choice Selection
     */
    private handleChoice(choice: any) {
        console.log('Choice selected:', choice);

        // Hide choice menu
        this.choiceMenu.style.display = 'none';

        // Navigate based on choice (implementation depends on route structure)
        // For now, just advance
        this.advanceScene();
    }

    /**
     * Handle end of scene chain (act complete, show route select, etc.)
     */
    private handleSceneChainEnd() {
        console.log('🏁 Scene chain complete');

        // If prologue just ended, show route select
        if (this.currentRoute === null) {
            this.gameView.style.display = 'none';
            this.routeSelect.style.display = 'block';
        }

        // TODO: Handle act transitions, endings, etc.
    }

    /**
     * Boot Sequence (Called from main after DOM ready)
     */
    public async boot() {
        const bootTerminal = document.getElementById('boot-terminal');
        const splashScreen = document.getElementById('uv7-splash');

        if (bootTerminal) {
            // Simple boot animation (can enhance with BougieBootSequence later)
            await this.simpleBootSequence(bootTerminal);

            // Fade out splash
            if (splashScreen) {
                splashScreen.style.transition = 'opacity 1s';
                splashScreen.style.opacity = '0';

                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 1000);
            }
        } else {
            console.warn('Boot terminal not found, skipping boot sequence');
            if (splashScreen) {
                splashScreen.style.display = 'none';
            }
        }

        // Show main menu after boot
        this.mainMenu.style.display = 'flex';
    }

    /**
     * Simple Boot Sequence
     */
    private async simpleBootSequence(terminal: HTMLElement) {
        const lines = [
            '💚 INITIALIZING VERSION 848...',
            '🔥 Loading core systems...',
            '💀 EventBus: ONLINE',
            '💚 StateManager: ONLINE',
            '🔥 TetherSystem: STANDBY',
            '💀 ContentLoader: READY',
            '',
            '848 is sacred. 848 is the story. 848 is the one that worked.',
            '',
            '✅ SYSTEM READY'
        ];

        for (const line of lines) {
            await this.delay(200);
            const div = document.createElement('div');
            div.className = 'boot-line';
            div.textContent = line;
            terminal.appendChild(div);
        }

        await this.delay(1500); // Pause before fade
    }

    /**
     * Utility: Delay
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ============================================
// Main Entry Point
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚪 V3: DOM Ready');

    // Initialize V3 Game Engine
    const game = new V3GameEngine();

    // Expose to window for debugging
    (window as any).game = game;

    // Run boot sequence
    await game.boot();

    console.log('✅ V3: Boot complete, game ready');
});
