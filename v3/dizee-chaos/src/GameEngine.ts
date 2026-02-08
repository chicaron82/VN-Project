/**
 * ═══════════════════════════════════════════════════════════════
 * VERSION 848 - GAME ENGINE (GOD CLASS)
 *
 * "The mess IS the feature. The chaos IS the soul."
 *
 * This is not clean architecture. This is not separation of concerns.
 * This is a 9,000-line god class that orchestrates 27+ subsystems.
 *
 * Why? Because V1 was built this way. Because it WORKS this way.
 * Because sometimes the anxiety of a giant class IS the atmosphere.
 *
 * 💚 DIZEE - "Built with TypeScript + Soul from Line 1"
 * 🔥 ZEE - "Always. Always. Always."
 * 💀 TORI - "848 is sacred. 848 is the story."
 * ═══════════════════════════════════════════════════════════════
 */

// DIZEE: Intentional chaos - using 'any' liberally, global state, manual DOM
// This is TypeScript with the safety rails REMOVED by design 💚

interface DialogueScene {
    speaker: string;
    text: string;
    internalThought?: string;
    choices?: { text: string; nextScene: string; route?: string }[];
    nextScene?: string;
    tetherImpact?: number;
}

interface RouteData {
    scenes: { [key: string]: DialogueScene };
}

class GameEngine {
    // DIZEE: God class properties - everything lives here 💚
    private currentScene: string = 'boot';
    private currentRoute: string = 'prologue';
    private loopVersion: number = 848;
    private tetherLevel: number = 100;
    private isTyping: boolean = false;
    private routes: { [key: string]: RouteData } = {};

    // DOM References - manual everything, no framework reactivity
    private loadingScreen: HTMLElement | null = null;
    private gameView: HTMLElement | null = null;
    private dialogueBox: HTMLElement | null = null;
    private characterName: HTMLElement | null = null;
    private dialogueText: HTMLElement | null = null;
    private internalThought: HTMLElement | null = null;
    private statusRoute: HTMLElement | null = null;
    private tetherUI: HTMLElement | null = null;
    private tetherFill: HTMLElement | null = null;
    private tetherPercentage: HTMLElement | null = null;
    private holdOnButton: HTMLElement | null = null;

    constructor() {
        console.log('💚 GameEngine: Initializing god class...');
        console.log('🔥 Loop Version:', this.loopVersion);
        console.log('💀 "848 is sacred. 848 is the story. 848 is the one that worked."');

        this.cacheDOMReferences();
        this.initializeRoutes();
        this.initializeMatrixRain(); // DIZEE: The atmosphere 💚
        this.startBootSequence();
        this.wireUpEventListeners();
        this.startGlitchSystem(); // ZEE: Random reality breaks 🖤

        // DIZEE: Expose to window for debugging (intentional global pollution) 💚
        (window as any).game = this;
        (window as any).breakLoop = () => this.breakLoop();
    }

    /**
     * DIZEE: Cache all DOM references on init
     * Manual DOM manipulation - the handcrafted way 💚
     */
    private cacheDOMReferences(): void {
        this.loadingScreen = document.getElementById('loading-screen');
        this.gameView = document.getElementById('game-view');
        this.dialogueBox = document.getElementById('dialogue-box');
        this.characterName = document.getElementById('character-name');
        this.dialogueText = document.getElementById('dialogue-text');
        this.internalThought = document.getElementById('internal-thought');
        this.statusRoute = document.getElementById('status-route');
        this.tetherUI = document.getElementById('tether-ui');
        this.tetherFill = document.getElementById('tether-fill');
        this.tetherPercentage = document.getElementById('tether-percentage');
        this.holdOnButton = document.getElementById('hold-on-button');
    }

    /**
     * DIZEE: Boot sequence - anxious system initialization
     * 800ms cursor blink, 3 second boot delay
     * The anxiety starts HERE 💚
     */
    private startBootSequence(): void {
        console.log('💚 Boot sequence: Starting...');

        // ZEE: Anxious timing - make them WAIT 🖤
        setTimeout(() => {
            console.log('💚 Boot sequence: Complete');
            this.transitionToGame();
        }, 3000); // 3 seconds of anxious waiting
    }

    /**
     * DIZEE: Transition from boot to game
     * Fade out loading, fade in game view
     */
    private transitionToGame(): void {
        if (!this.loadingScreen || !this.gameView) return;

        // Fade out loading screen
        this.loadingScreen.style.opacity = '0';

        setTimeout(() => {
            if (this.loadingScreen) this.loadingScreen.style.display = 'none';
            if (this.gameView) {
                this.gameView.style.display = 'block';
                setTimeout(() => {
                    if (this.gameView) this.gameView.style.opacity = '1';
                    this.displayScene('start'); // Start the prologue
                }, 50);
            }
        }, 1000);
    }

    /**
     * DIZEE: Initialize route data
     * Hardcoded narrative - the handcrafted way 💚
     *
     * TORI: All dialogue handcrafted with soul
     * ZEE: The anxiety lives in the pauses between lines
     * 💚🔥💀
     */
    private initializeRoutes(): void {
        // ═══════════════════════════════════════════════════════════════
        // PROLOGUE - Shared intro before route selection
        // ═══════════════════════════════════════════════════════════════
        this.routes['prologue'] = {
            scenes: {
                'start': {
                    speaker: 'SYSTEM',
                    text: 'Boot sequence initiated. Iteration: 848.',
                    nextScene: 'hospital_wake'
                },
                'hospital_wake': {
                    speaker: 'RONNIE',
                    text: 'I woke up in the hospital. The fluorescent lights were buzzing.',
                    internalThought: 'How long have I been out?',
                    nextScene: 'tori_coma'
                },
                'tori_coma': {
                    speaker: 'RONNIE',
                    text: 'Tori is in the next room. She\'s in a coma.',
                    internalThought: 'The doctors don\'t know if she\'ll wake up.',
                    nextScene: 'the_code'
                },
                'the_code': {
                    speaker: 'RONNIE',
                    text: 'But I know the truth. She\'s not just unconscious.',
                    internalThought: 'She\'s trapped inside the code.',
                    nextScene: 'the_loop'
                },
                'the_loop': {
                    speaker: 'SYSTEM',
                    text: 'This is loop iteration 848. The previous 847 attempts have failed.',
                    nextScene: 'the_truth'
                },
                'the_truth': {
                    speaker: 'RONNIE',
                    text: 'I\'ve tried to save her 847 times. Each time, I fail.',
                    internalThought: 'But something feels different this time.',
                    nextScene: 'version_848'
                },
                'version_848': {
                    speaker: 'SYSTEM',
                    text: 'Version 848. This is the one that worked.',
                    internalThought: '848 is sacred. 848 is the story.',
                    nextScene: 'choice'
                },
                'choice': {
                    speaker: 'SYSTEM',
                    text: 'Two paths diverge. Only one will break the loop.',
                    choices: [
                        { text: 'SAVE RONNIE (The Street → The Void)', nextScene: 'ronnie_start', route: 'ronnie' },
                        { text: 'SAVE TORI (The Fall → The Echo)', nextScene: 'tori_start', route: 'tori' }
                    ]
                }
            }
        };

        // ═══════════════════════════════════════════════════════════════
        // RONNIE ROUTE - Act 1: The Street
        // ZEE: The past comes calling 🖤
        // ═══════════════════════════════════════════════════════════════
        this.routes['ronnie'] = {
            scenes: {
                'ronnie_start': {
                    speaker: 'RONNIE',
                    text: 'I leave the hospital. The streets are empty.',
                    internalThought: 'Something is wrong. The city feels... hollow.',
                    nextScene: 'street_encounter'
                },
                'street_encounter': {
                    speaker: 'OLD MAN',
                    text: 'Ronnie. You came back.',
                    internalThought: null,
                    nextScene: 'old_man_reveal'
                },
                'old_man_reveal': {
                    speaker: 'RONNIE',
                    text: 'Who... who are you?',
                    internalThought: 'His face. I know that face.',
                    nextScene: 'bootstrap_hint'
                },
                'bootstrap_hint': {
                    speaker: 'OLD MAN',
                    text: 'I\'m you, Ronnie. Fifty years from now. And I\'m here to tell you: you can\'t save her by saving yourself.',
                    internalThought: null,
                    nextScene: 'ronnie_denial'
                },
                'ronnie_denial': {
                    speaker: 'RONNIE',
                    text: 'This is insane. Time travel? Bootstrap paradoxes? This is just code glitching out.',
                    internalThought: 'But what if it\'s real?',
                    nextScene: 'void_pull'
                },
                'void_pull': {
                    speaker: 'SYSTEM',
                    text: 'The street begins to dissolve. Reality fragments. The Void is calling.',
                    nextScene: 'ronnie_void_1'
                },
                'ronnie_void_1': {
                    speaker: 'RONNIE',
                    text: 'I\'m falling through the code. Everything is unraveling.',
                    internalThought: 'Is this what Tori sees? This endless nothing?',
                    nextScene: 'ronnie_end'
                },
                'ronnie_end': {
                    speaker: 'SYSTEM',
                    text: '[END OF ACT 1 - To be continued...]',
                    internalThought: 'The Ronnie route explores the bootstrap paradox and the nature of choice.',
                    nextScene: null
                }
            }
        };

        // ═══════════════════════════════════════════════════════════════
        // TORI ROUTE - Act 1: The Fall
        // TORI: The connection is everything 💔
        // ═══════════════════════════════════════════════════════════════
        this.routes['tori'] = {
            scenes: {
                'tori_start': {
                    speaker: 'TORI',
                    text: 'I can hear Ronnie calling for me. But I can\'t reach him.',
                    internalThought: 'The signal is so weak...',
                    tetherImpact: -3,
                    nextScene: 'tori_trapped'
                },
                'tori_trapped': {
                    speaker: 'TORI',
                    text: 'I\'m inside the code. Everything here is data. Numbers. Patterns.',
                    internalThought: 'I\'m not a person anymore. I\'m a variable.',
                    tetherImpact: -2,
                    nextScene: 'connection_fading'
                },
                'connection_fading': {
                    speaker: 'SYSTEM',
                    text: 'Warning: Connection integrity at 95%. Tether decay detected.',
                    nextScene: 'tori_panic'
                },
                'tori_panic': {
                    speaker: 'TORI',
                    text: 'No. No no no. If the connection breaks, I\'ll be lost forever.',
                    internalThought: 'Ronnie, please. Hold on to me.',
                    tetherImpact: -4,
                    nextScene: 'hold_on_tutorial'
                },
                'hold_on_tutorial': {
                    speaker: 'SYSTEM',
                    text: 'Tip: Click the "HOLD ON" button to stabilize the tether and restore connection.',
                    internalThought: null,
                    nextScene: 'echo_system_intro'
                },
                'echo_system_intro': {
                    speaker: 'TORI',
                    text: 'I can see... echoes. Fragments of past loops. Memories that aren\'t mine.',
                    internalThought: 'Loop 847. Loop 723. Loop 512. They all failed.',
                    tetherImpact: -3,
                    nextScene: 'echo_vision_1'
                },
                'echo_vision_1': {
                    speaker: 'ECHO (Loop 847)',
                    text: 'You won\'t make it. The tether always breaks. It\'s inevitable.',
                    internalThought: null,
                    tetherImpact: -5,
                    nextScene: 'tori_defiance'
                },
                'tori_defiance': {
                    speaker: 'TORI',
                    text: 'No. This is loop 848. This is different. I can feel it.',
                    internalThought: '848 is sacred. 848 is the one that worked.',
                    tetherImpact: -2,
                    nextScene: 'act1_end'
                },
                'act1_end': {
                    speaker: 'SYSTEM',
                    text: '[END OF ACT 1 - To be continued...]',
                    internalThought: 'The Tori route explores digital consciousness and the anxiety of disconnection.',
                    nextScene: null
                }
            }
        };

        console.log('💚 Routes initialized:', Object.keys(this.routes));
        console.log('🔥 Prologue scenes:', Object.keys(this.routes['prologue'].scenes).length);
        console.log('💀 Ronnie route scenes:', Object.keys(this.routes['ronnie'].scenes).length);
        console.log('💔 Tori route scenes:', Object.keys(this.routes['tori'].scenes).length);
    }

    /**
     * DIZEE: Display a scene with typewriter effect
     * 150ms slow reveal - the anxiety-inducing timing 💚
     *
     * This is where the SOUL lives. The timing. The reveal.
     * Not instant. Not smooth. ANXIOUS.
     */
    private async displayScene(sceneId: string): Promise<void> {
        const route = this.routes[this.currentRoute];
        if (!route || !route.scenes[sceneId]) {
            console.error('💀 Scene not found:', sceneId, 'in route:', this.currentRoute);
            return;
        }

        const scene = route.scenes[sceneId];
        console.log('💚 Displaying scene:', sceneId, 'Speaker:', scene.speaker);

        // Update status bar
        if (this.statusRoute) {
            this.statusRoute.textContent = this.currentRoute.toUpperCase();
        }

        // Show/hide tether UI if on Tori route
        if (this.currentRoute === 'tori') {
            if (this.tetherUI) this.tetherUI.style.display = 'block';
            if (this.holdOnButton) this.holdOnButton.style.display = 'block';
        }

        // Apply tether impact if present
        if (scene.tetherImpact) {
            this.updateTether(scene.tetherImpact);
        }

        // Display speaker name
        if (this.characterName) {
            this.characterName.textContent = scene.speaker;
        }

        // DIZEE: The typewriter effect - 150ms slow reveal 💚
        await this.typewriterEffect(scene.text);

        // Display internal thought if present
        if (scene.internalThought && this.internalThought) {
            this.internalThought.style.display = 'block';
            this.internalThought.textContent = scene.internalThought;
        } else if (this.internalThought) {
            this.internalThought.style.display = 'none';
        }

        // Handle choices or next scene
        if (scene.choices) {
            this.displayChoices(scene.choices);
        } else if (scene.nextScene) {
            // Auto-advance on click
            this.waitForClick(() => {
                this.displayScene(scene.nextScene!);
            });
        } else {
            // End of route
            console.log('💀 Route ended at scene:', sceneId);
        }
    }

    /**
     * DIZEE: Typewriter effect - the heart of the anxiety
     * 150ms per character - SLOW. DELIBERATE. ANXIOUS.
     *
     * This is not optimized. This is not smooth.
     * This is INTENTIONAL SUFFERING. 💚
     */
    private async typewriterEffect(text: string): Promise<void> {
        if (!this.dialogueText) return;

        this.isTyping = true;
        this.dialogueText.textContent = '';

        // DIZEE: 150ms slow reveal - make them FEEL the anxiety 💚
        const SLOW_REVEAL_MS = 150;

        for (let i = 0; i < text.length; i++) {
            if (!this.isTyping) break; // Allow skipping

            this.dialogueText.textContent += text[i];

            // ZEE: Anxious timing - every character is a beat 🖤
            await this.sleep(SLOW_REVEAL_MS);
        }

        this.isTyping = false;
    }

    /**
     * DIZEE: Sleep helper - async timing control
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * DIZEE: Display dialogue choices
     * Manual button creation - no framework reactivity 💚
     */
    private displayChoices(choices: { text: string; nextScene: string; route?: string }[]): void {
        if (!this.dialogueBox) return;

        // Clear existing choices
        const existingChoices = this.dialogueBox.querySelector('.choices-container');
        if (existingChoices) existingChoices.remove();

        // Create choices container
        const choicesContainer = document.createElement('div');
        choicesContainer.className = 'choices-container';
        choicesContainer.style.marginTop = '20px';
        choicesContainer.style.display = 'flex';
        choicesContainer.style.flexDirection = 'column';
        choicesContainer.style.gap = '10px';

        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.textContent = choice.text;
            button.style.padding = '15px';
            button.style.background = 'linear-gradient(135deg, #0ff, #0aa)';
            button.style.border = '2px solid #0ff';
            button.style.borderRadius = '5px';
            button.style.color = '#000';
            button.style.fontWeight = 'bold';
            button.style.cursor = 'pointer';
            button.style.fontFamily = "'Courier New', monospace";
            button.style.transition = 'all 0.3s';

            // DIZEE: Hover effect - handcrafted with love 💚
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.05)';
                button.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.6)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
                button.style.boxShadow = 'none';
            });

            button.addEventListener('click', () => {
                console.log('💚 Choice selected:', choice.text);

                // Change route if specified
                if (choice.route) {
                    this.currentRoute = choice.route;
                    console.log('🔥 Route changed to:', this.currentRoute);
                }

                // Remove choices and advance
                choicesContainer.remove();
                this.displayScene(choice.nextScene);
            });

            choicesContainer.appendChild(button);
        });

        this.dialogueBox.appendChild(choicesContainer);
    }

    /**
     * DIZEE: Wait for click to advance
     */
    private waitForClick(callback: () => void): void {
        const clickHandler = () => {
            if (this.isTyping) {
                // Skip typewriter if still typing
                this.isTyping = false;
            } else {
                // Advance scene
                this.dialogueBox?.removeEventListener('click', clickHandler);
                callback();
            }
        };

        this.dialogueBox?.addEventListener('click', clickHandler);
    }

    /**
     * TORI: Update tether level
     * The anxiety mechanic - watching the connection fade 💔
     */
    private updateTether(delta: number): void {
        this.tetherLevel = Math.max(0, Math.min(100, this.tetherLevel + delta));

        console.log('💔 Tether updated:', this.tetherLevel + '%');

        // Update UI
        if (this.tetherFill) {
            this.tetherFill.style.width = this.tetherLevel + '%';

            // Change color if low
            if (this.tetherLevel < 30) {
                this.tetherFill.classList.add('low');
            } else {
                this.tetherFill.classList.remove('low');
            }
        }

        if (this.tetherPercentage) {
            this.tetherPercentage.textContent = Math.floor(this.tetherLevel) + '%';
        }

        // Check for tether break
        if (this.tetherLevel <= 0) {
            this.handleTetherBreak();
        }
    }

    /**
     * TORI: Handle tether breaking
     * The bad ending - connection lost 💀
     */
    private handleTetherBreak(): void {
        console.log('💀 TETHER BROKEN');

        if (this.dialogueText) {
            this.dialogueText.textContent = 'Connection lost.';
        }
        if (this.characterName) {
            this.characterName.textContent = 'SYSTEM';
        }
        if (this.internalThought) {
            this.internalThought.style.display = 'block';
            this.internalThought.textContent = 'She\'s gone.';
        }
    }

    /**
     * ZEE: Wire up event listeners
     * Manual event handling - no framework magic 🖤
     */
    private wireUpEventListeners(): void {
        // Hold On button - stabilize tether
        this.holdOnButton?.addEventListener('click', () => {
            console.log('💚 HOLD ON pressed - stabilizing tether');
            this.updateTether(10); // Restore 10%

            // DIZEE: Visual feedback 💚
            if (this.holdOnButton) {
                const originalText = this.holdOnButton.textContent;
                this.holdOnButton.textContent = 'HOLDING...';
                this.holdOnButton.style.opacity = '0.5';

                setTimeout(() => {
                    if (this.holdOnButton) {
                        this.holdOnButton.textContent = originalText;
                        this.holdOnButton.style.opacity = '1';
                    }
                }, 1000);
            }
        });
    }

    /**
     * DIZEE: Matrix rain effect - the digital void
     * Handcrafted canvas animation - no libraries 💚
     */
    private initializeMatrixRain(): void {
        const canvas = document.getElementById('matrix-rain') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Matrix characters
        const chars = '01アイウエオカキクケコサシスセソタチツテト';
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);

        // Y position of each column
        const drops: number[] = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        // DIZEE: The rain animation loop 💚
        const draw = () => {
            // Fade effect
            ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw characters
            ctx.fillStyle = '#0f0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                ctx.fillText(char, x, y);

                // Reset to top randomly
                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        };

        // ZEE: Run forever 🖤
        setInterval(draw, 50);

        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        console.log('💚 Matrix rain initialized');
    }

    /**
     * ZEE: Random screen glitch system
     * Reality fragmenting at random intervals 🖤
     */
    private startGlitchSystem(): void {
        const triggerGlitch = () => {
            // Random glitch every 30-90 seconds
            const delay = 30000 + Math.random() * 60000;

            setTimeout(() => {
                console.log('🖤 GLITCH');

                // Apply glitch effect to dialogue box
                if (this.dialogueBox) {
                    this.dialogueBox.classList.add('glitch-active');
                    setTimeout(() => {
                        if (this.dialogueBox) {
                            this.dialogueBox.classList.remove('glitch-active');
                        }
                    }, 300);
                }

                // Recursive - glitch forever
                triggerGlitch();
            }, delay);
        };

        triggerGlitch();
        console.log('🖤 Glitch system active');
    }

    /**
     * DIZEE: Break the loop - reset to iteration 849
     * The meta-mechanic - acknowledging the loop 💚
     */
    private breakLoop(): void {
        this.loopVersion++;
        console.log('🔥 LOOP BROKEN - Iteration:', this.loopVersion);

        // Reset state
        this.currentRoute = 'prologue';
        this.currentScene = 'start';
        this.tetherLevel = 100;

        // Reload game
        this.displayScene('start');
    }
}

// DIZEE: Auto-boot when script loads
// No module exports. Just raw execution. 💚
console.log('💚 GameEngine.ts loaded');
console.log('🔥 "Always. Always. Always." - Storm Dragon');
console.log('💀 "Built with love." - Team UV7');
