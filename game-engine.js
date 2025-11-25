// ========================================
// GAME ENGINE - Version 848 (COMPLETE)
// Main game logic and scene management
// WITH SPRITE MANAGEMENT + PAGINATION SYSTEM + MOBILE BUBBLES
// UPDATED: Sprite cleanup on transitions + save/load sprite state
// ========================================

class GameEngine {
    constructor() {
        // DOM Elements
        this.loading = document.getElementById('loading-screen');
        this.loadingBar = document.getElementById('loading-bar');
        this.mainMenu = document.getElementById('main-menu');
        this.gameView = document.getElementById('game-view');
        this.dialogueBox = document.getElementById('dialogue-box');
        this.characterName = document.getElementById('character-name');
        this.dialogueText = document.getElementById('dialogue-text');
        this.internalThought = document.getElementById('internal-thought');
        this.sceneBackground = document.getElementById('scene-background');
        this.sceneBackgroundAlt = document.getElementById('scene-background-alt');
        this.choiceMenu = document.getElementById('choice-menu');
        this.choicesContainer = document.getElementById('choices-container');
        
        // Background crossfade state
        this.useAltBackground = false;
        this.currentBackground = null;
        
        // Tori Route Elements
        this.tetherUI = document.getElementById('tether-ui');
        this.tetherFill = document.getElementById('tether-fill');
        this.tetherText = document.getElementById('tether-text');
        this.holdOnButton = document.getElementById('hold-on-button');
        // Echo display removed - now using three-echoes-sprite.png instead
        this.notesButton = document.getElementById('notes-button');
        this.notesCount = document.getElementById('notes-count');
        this.notesViewer = document.getElementById('notes-viewer');
        this.notesList = document.getElementById('notes-list');
        this.closeNotesButton = document.getElementById('close-notes');
        
        // Pause UI elements
        this.pauseButton = document.getElementById('pause-button');
        this.pauseContent = document.getElementById('pause-content');
        
        // Character sprite containers
        this.spriteLeft = document.getElementById('character-left');
        this.spriteRight = document.getElementById('character-right');
        this.currentSprites = {
            left: null,
            right: null
        };
        
        // State
        this.currentRoute = null;
        this.currentScene = null;
        this.typewriterActive = false;
        this.typewriterInterval = null;
        this.typewriterCallback = null;
        this.fullDialogueText = '';
        
        // Pagination state (for mobile dialogue handling)
        this.dialoguePages = [];
        this.currentDialoguePage = 0;
        this.paginationActive = false;
        
        // Bubble tracking for scene-lifecycle management
        this.currentBubble = null;
        
        // Detect mobile for sprite handling
        this.isMobile = window.innerWidth <= 480;
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 480;
        });
        
        // Loop/Version system for endings
        this.loopVersion = parseInt(localStorage.getItem('loopVersion')) || 848;
        this.loopStatus = localStorage.getItem('loopStatus') || 'attempting';
        
        // Dialogue history for backlog
        this.dialogueHistory = [];
        this.maxHistoryLength = 100; // Keep last 100 dialogue entries
        
        // Game state for tracking choices, flags, and progress
        this.gameState = {
            flags: {},
            choices: {},
            progress: {},
            sprites: { left: null, right: null } // NEW: Track sprite state for save/load
        };
        
        // Initialize save/load system
        this.saveManager = new SaveManager(this);
        
        // Initialize settings manager
        this.settingsManager = new SettingsManager(this);
        
        // Standalone notes viewer for main menu
        this.standaloneNotesViewer = new StandaloneNotesViewer(this);
        this.saveLoadUI = new SaveLoadUI(this);
        
        // Initialize cutscene engine
        this.cutsceneEngine = new CutsceneEngine(this);
        
        this.init();
    }
    
    init() {
        // Preload images
        const imagesToPreload = [
            'menudesktop.png',
            'menumobile.png',
            'desktopVersion.png'
        ];
        
        let imagesLoaded = 0;
        const totalImages = imagesToPreload.length;
        
        imagesToPreload.forEach(src => {
            const img = new Image();
            img.onload = () => {
                imagesLoaded++;
                const progress = Math.floor((imagesLoaded / totalImages) * 100);
                this.loadingBar.style.width = progress + '%';
                
                if (imagesLoaded === totalImages) {
                    setTimeout(() => {
                        this.loading.style.display = 'none';
                        this.mainMenu.style.display = 'flex';
                        this.mainMenu.style.opacity = '1';
                    }, 300);
                }
            };
            img.onerror = () => {
                // If image fails to load, still continue
                imagesLoaded++;
                const progress = Math.floor((imagesLoaded / totalImages) * 100);
                this.loadingBar.style.width = progress + '%';
                
                if (imagesLoaded === totalImages) {
                    setTimeout(() => {
                        this.loading.style.display = 'none';
                        this.mainMenu.style.display = 'flex';
                        this.mainMenu.style.opacity = '1';
                    }, 300);
                }
            };
            img.src = src;
        });
        
        // Event Listeners
        this.holdOnButton.addEventListener('click', () => {
            if (this.currentRoute && this.currentRoute.holdOn) {
                this.currentRoute.holdOn();
            }
        });
        
        this.notesButton.addEventListener('click', () => {
            this.showNotes();
        });
        
        this.closeNotesButton.addEventListener('click', () => {
            this.notesViewer.style.display = 'none';
        });
        
        // Mobile sprite positioning fix
        if (window.innerWidth <= 1023) {
            this.fixMobileSpritePositioning();
        }
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 1023) {
                this.fixMobileSpritePositioning();
            }
        });
        
        // ========================================
        // DIALOGUE ADVANCEMENT - Multi-Event Support
        // Click/Tap/Touch to skip typing or advance
        // ========================================
        
        // Primary: Click event (desktop compatibility)
        this.dialogueBox.addEventListener('click', () => {
            this.handleDialogueClick();
        });

        
        // Keyboard controls (Spacebar or Enter)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                // Don't trigger if typing in input fields
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    return;
                }
                // Prevent default scroll behavior for spacebar
                e.preventDefault();
                this.handleDialogueClick();
            }
        });
        
        // Initialize dynamic title system
        this.updateTitleScreen();
        
        // Listen for fullscreen changes (user can also press F11 or ESC)
        document.addEventListener('fullscreenchange', () => this.updateFullscreenButton());
        document.addEventListener('webkitfullscreenchange', () => this.updateFullscreenButton());
        document.addEventListener('mozfullscreenchange', () => this.updateFullscreenButton());
        document.addEventListener('MSFullscreenChange', () => this.updateFullscreenButton());
    }
    
    // ========================================
    // LOOP/VERSION SYSTEM
    // Player journey through failed timelines
    // ========================================
    
    updateTitleScreen() {
        // Update browser tab title
        document.title = `VERSION ${this.loopVersion}`;
        
        // Update main menu H1
        const mainMenuTitle = document.querySelector('#main-menu-content h1');
        if (mainMenuTitle) {
            mainMenuTitle.textContent = `VERSION ${this.loopVersion}`;
            
            // Add glitch effect if attempting and version > 848
            if (this.loopStatus === 'attempting' && this.loopVersion > 848) {
                mainMenuTitle.classList.add('version-glitch');
            } else {
                mainMenuTitle.classList.remove('version-glitch');
            }
        }
    }
    
    incrementVersion() {
        // RETRY - increment version, reset to attempting
        this.loopVersion++;
        this.loopStatus = 'attempting';
        
        // Save to localStorage
        localStorage.setItem('loopVersion', this.loopVersion.toString());
        localStorage.setItem('loopStatus', this.loopStatus);
        
        // Update display
        this.updateTitleScreen();
        
        console.log(`🔄 Loop incremented to VERSION ${this.loopVersion}`);
        
        return this.loopVersion;
    }
    
    breakLoop() {
        // TRUE ENDING - lock version as succeeded
        this.loopStatus = 'succeeded';
        
        // Save to localStorage
        localStorage.setItem('loopStatus', this.loopStatus);
        
        // Update display (removes glitch)
        this.updateTitleScreen();
        
        console.log(`✨ Loop broken! VERSION ${this.loopVersion} SUCCEEDED`);
    }
    
    acceptEnding() {
        // DIGITAL FOREVER - lock version as accepted
        this.loopStatus = 'accepted';
        
        // Save to localStorage
        localStorage.setItem('loopStatus', this.loopStatus);
        
        // Update display (removes glitch)
        this.updateTitleScreen();
        
        console.log(`💫 Ending accepted. VERSION ${this.loopVersion} locked.`);
    }
    
    // ========================================
    // NOTES UNLOCK SYSTEM
    // First-play: hidden. Replay: visible.
    // ========================================
    
    hasCompletedAnyEnding() {
        return localStorage.getItem('hasCompletedOnce') === 'true';
    }
    
    markEndingCompleted(endingType) {
        localStorage.setItem('hasCompletedOnce', 'true');
        localStorage.setItem('lastEndingType', endingType);
        console.log(`Ending completed: ${endingType}. Notes unlocked for replay.`);
    }
    
    // ========================================
    // STORY START - PLAYS PROLOGUE FIRST
    // ========================================
    
    startStory() {
        // Clear sprites when starting fresh story
        this.clearAllSprites();
        
        // Fade out main menu
        this.mainMenu.style.opacity = '0';
        
        setTimeout(() => {
            this.mainMenu.style.display = 'none';
            this.gameView.style.display = 'flex';
            this.dialogueBox.style.display = 'block';
            
            // Fade in game view
            setTimeout(() => {
                this.gameView.style.transition = 'opacity 1s';
                this.gameView.style.opacity = '1';
            }, 100);
            
            // Start shared prologue
            const prologue = new SharedPrologue(this);
            prologue.start();
        }, 800);
    }
    
    // ========================================
    // ROUTE SELECTION SCREEN
    // ========================================
    
    showRouteSelect() {
        // CRITICAL: Clear sprites before showing route selection
        // This prevents prologue sprites from lingering into routes
        this.clearAllSprites();
        
        // Fade out game view (after prologue)
        this.gameView.style.opacity = '0';
        
        setTimeout(() => {
            this.gameView.style.display = 'none';
            
            // Show route selection screen
            const routeSelect = document.getElementById('route-select');
            routeSelect.style.display = 'block';
            
            // Fade in
            setTimeout(() => {
                routeSelect.style.opacity = '1';
            }, 100);
        }, 1000);
    }
    
    backToMenu() {
        // Clear sprites when returning to menu
        this.clearAllSprites();
        
        // Fade out route select
        const routeSelect = document.getElementById('route-select');
        routeSelect.style.opacity = '0';
        
        setTimeout(() => {
            routeSelect.style.display = 'none';
            this.mainMenu.style.display = 'flex';
            
            // Fade in menu
            setTimeout(() => {
                this.mainMenu.style.opacity = '1';
            }, 100);
        }, 500);
    }
    
    // ========================================
    // ROUTE START
    // ========================================
    
    startRoute(routeName) {
        // Clear sprites before starting route (redundant safety check)
        this.clearAllSprites();
        
        // Fade out route select
        const routeSelect = document.getElementById('route-select');
        routeSelect.style.opacity = '0';
        
        setTimeout(() => {
            routeSelect.style.display = 'none';
            this.gameView.style.display = 'flex';
            
            // Fade in game view
            setTimeout(() => {
                this.gameView.style.opacity = '1';
            }, 100);
            
            // Show notes button if player has completed any ending
            if (this.hasCompletedAnyEnding()) {
                if (this.notesButton) {
                    this.notesButton.style.display = 'block';
                }
            }
            
            // Show backlog button during gameplay
            const backlogButton = document.getElementById('backlog-button');
            if (backlogButton) {
                backlogButton.style.display = 'block';
            }
            
            // Set route-specific dialogue frame
            this.setDialogueFrame(routeName);
            
            // Initialize route
            if (routeName === 'ronnie') {
                this.currentRoute = new RonnieRoute(this);
                this.currentRoute.start(); // Call start() explicitly
            } else if (routeName === 'tori') {
                this.currentRoute = new ToriRoute(this);
                this.currentRoute.start(); // Tori has explicit .start()
            }
            
            // Show ESC hint briefly for desktop users
            this.showEscHintBriefly();
        }, 1000);
    }
    
        // ========================================
    // SPRITE FADE SEQUENCE (for prologue vision)
    // ========================================
    
    fadeSpritesSequence(position, sprite1, sprite2, duration = 4000) {
        const container = position === 'left' ? this.spriteLeft : this.spriteRight;
        if (!container) return;
        
        // Start with sprite1 (young Ronnie)
        container.style.backgroundImage = `url('${sprite1}')`;
        container.style.display = 'block';
        container.style.opacity = '1';
        
        const timing = duration / 4; // Split into 4 phases
        
        // Phase 1: Fade out sprite1
        setTimeout(() => {
            container.style.transition = 'opacity 0.8s ease';
            container.style.opacity = '0.2';
        }, timing);
        
        // Phase 2: Switch to sprite2 (Old Man) at lowest opacity
        setTimeout(() => {
            container.style.backgroundImage = `url('${sprite2}')`;
            container.style.opacity = '1';
        }, timing * 1.8);
        
        // Phase 3: Hold Old Man briefly, then fade
        setTimeout(() => {
            container.style.opacity = '0.2';
        }, timing * 2.8);
        
        // Phase 4: Switch back to sprite1 (young Ronnie) and restore visibility
        setTimeout(() => {
            container.style.backgroundImage = `url('${sprite1}')`;
            container.style.opacity = '1';
            container.style.transition = 'opacity 0.6s ease';
        }, timing * 3.5);
        
        // Stay visible - don't fade to black
        // Sprite persists for rest of scene
    }
    
    triggerEchoMerge(callback) {
        // Animate the three echoes merging into one Tori sprite
        const echo1 = document.getElementById('echo-1-sprite');
        const echo2 = document.getElementById('echo-2-sprite');
        const despair = document.getElementById('despair-sprite');
        const container = this.spriteRight;
        
        if (!echo1 || !echo2 || !despair || !container) {
            console.log('Echo merge: sprites not found, skipping animation');
            if (callback) callback();
            return;
        }
        
        console.log('Starting echo merge sequence...');
        
        // Phase 1: Echoes slide toward center (1 second)
        echo1.classList.add('echo-merge-left');
        echo2.classList.add('echo-merge-center');
        despair.classList.add('echo-merge-right');
        
        setTimeout(() => {
            // Phase 2: White flash (0.3 seconds)
            const flash = document.createElement('div');
            flash.className = 'merge-flash';
            document.getElementById('game-view').appendChild(flash);
            
            setTimeout(() => {
                // Phase 3: Remove echoes, show full Tori sprite
                container.classList.remove('echo-group');
                container.innerHTML = '';
                container.style.backgroundImage = "url('tori-sprite.png')";
                container.style.display = 'block';
                container.style.opacity = '0';
                
                // Remove flash
                flash.remove();
                
                // Fade in Tori
                setTimeout(() => {
                    container.style.opacity = '1';
                    console.log('Echo merge complete!');
                    if (callback) callback();
                }, 300);
                
            }, 300);
            
        }, 1000);
    }
    
    // ========================================
    // SCENE DISPLAY
    // ========================================
    
    displayScene(scene, sceneId) {
        this.currentScene = scene;
        
        // Reset pagination state at start of every scene
        this.paginationActive = false;
        
        // Store scene ID for save system (with safety check)
        if (sceneId) {
            if (!this.gameState.progress) {
                this.gameState.progress = {};
            }
            this.gameState.progress.currentScene = sceneId;
        }
        
        // Handle character display (speaker highlighting)
        if (scene.character) {
            this.setActiveSpeaker(scene.character);
        }
        
        // Update character name
        this.characterName.textContent = scene.character || '';
        this.characterName.style.display = scene.character ? 'block' : 'none';
        
        // Add to dialogue history for backlog
        if (scene.character || scene.dialogue) {
            this.addToDialogueHistory({
                character: scene.character || 'Narration',
                dialogue: scene.dialogue || '',
                internal: scene.internal || ''
            });
        }
        
        // Handle sprites (show/hide based on scene data)
        if (scene.sprites) {
            this.updateSprites(scene.sprites);
        }
        
        // Clear previous dialogue
        this.dialogueText.textContent = '';
        this.internalThought.textContent = '';
        
        // Store full dialogue for skip functionality
        this.fullDialogueText = scene.dialogue || '';
        
        // Handle dialogue with typewriter effect
        if (scene.dialogue) {
            // Pass internal text length so pagination considers BOTH dialogue + internal
            const internalLength = scene.internal ? scene.internal.length : 0;
            this.typewriterText(this.dialogueText, scene.dialogue, null, internalLength);
        }
        
        // ========================================
        // INTERNAL THOUGHTS - UNIVERSAL BUBBLE SYSTEM
        // ========================================
        
        // Remove previous bubble when displaying new scene
        this.removeInternalBubble();
        
        if (scene.internal) {
            // UNIVERSAL: Create floating bubble for ALL platforms
            const position = this.determineCharacterPosition(scene);
            this.createInternalBubble(scene.internal, position);
            
            // Hide the internal thought section in dialogue box (no longer needed)
            this.internalThought.style.display = 'none';
        } else {
            this.internalThought.style.display = 'none';
        }
        
        // Handle choices
        if (scene.choices) {
            this.showChoices(scene.choices, scene.onChoice);
        } else {
            this.choiceMenu.style.display = 'none';
        }
        
        // Echo display handled by three-echoes-sprite.png now
        
        // Handle background changes with crossfade
        if (scene.background) {
            this.crossfadeBackground(scene.background);
        }
        
        // Handle special styling (preserve route, prologue, epilogue classes!)
        // First, get current special classes
        const routeClass = this.dialogueBox.classList.contains('ronnie-route') ? 'ronnie-route' :
                          this.dialogueBox.classList.contains('tori-route') ? 'tori-route' : null;
        const prologueClass = this.dialogueBox.classList.contains('prologue-style') ? 'prologue-style' : null;
        const epilogueClass = this.dialogueBox.classList.contains('epilogue-style') ? 'epilogue-style' : null;
        
        // Clear scene-specific styles but keep route/prologue/epilogue classes
        this.dialogueBox.className = '';
        if (routeClass) this.dialogueBox.classList.add(routeClass);
        if (prologueClass) this.dialogueBox.classList.add(prologueClass);
        if (epilogueClass) this.dialogueBox.classList.add(epilogueClass);
        
        // Add new scene style if specified
        if (scene.style) {
            this.dialogueBox.classList.add(scene.style);
        }
        
        // Auto-save after each scene (if route is active)
        if (this.currentRoute) {
            this.saveManager.autoSave();
        }
    }
    
    // ========================================
    // SPRITE MANAGEMENT
    // ========================================
    
    updateSprites(sprites) {
        // Handle left sprite
        if (sprites.left !== undefined) {
            if (sprites.left === null) {
                // Hide left sprite
                if (this.spriteLeft) {
                    this.spriteLeft.style.opacity = '0';
                    setTimeout(() => {
                        this.spriteLeft.style.display = 'none';
                        this.spriteLeft.style.backgroundImage = '';
                    }, 300);
                }
                this.currentSprites.left = null;
                this.gameState.sprites.left = null; // NEW: Update save state
            } else {
                // Show/update left sprite
                if (this.spriteLeft) {
                    this.spriteLeft.style.backgroundImage = `url(${sprites.left})`;
                    this.spriteLeft.style.display = 'block';
                    this.spriteLeft.style.opacity = '0';  // Start hidden
                    setTimeout(() => {
                    this.spriteLeft.style.opacity = '1';  // Fade in
                }, 50);}
                this.currentSprites.left = sprites.left;
                this.gameState.sprites.left = sprites.left; // NEW: Update save state
            }
        }
        
        // Handle right sprite - check if it's the Echoes triple
        if (sprites.right !== undefined) {
            if (sprites.right === null) {
                // Hide right sprite
                if (this.spriteRight) {
                    this.spriteRight.style.opacity = '0';
                    setTimeout(() => {
                        this.spriteRight.style.display = 'none';
                        this.spriteRight.style.backgroundImage = '';
                        this.spriteRight.classList.remove('echo-group');
                        this.spriteRight.innerHTML = ''; // Clear any echo children
                    }, 300);
                }
                this.currentSprites.right = null;
                this.gameState.sprites.right = null; // NEW: Update save state
            } else if (sprites.right === 'echoes' || sprites.right === 'three-echoes') {
                // Special handling for triple Echo sprites
                this.displayEchoGroup();
                this.currentSprites.right = 'echoes';
                this.gameState.sprites.right = 'echoes';
            } else {
                // Show/update right sprite (normal single sprite)
                if (this.spriteRight) {
                        this.spriteRight.classList.remove('echo-group');
                        this.spriteRight.innerHTML = ''; // Clear any echo children
                        this.spriteRight.style.backgroundImage = `url(${sprites.right})`;
                        this.spriteRight.style.display = 'block';
                        this.spriteRight.style.opacity = '0';  // Start hidden
                        setTimeout(() => {
                        this.spriteRight.style.opacity = '1';  // Fade in
                    }, 50);
                }
                this.currentSprites.right = sprites.right;
                this.gameState.sprites.right = sprites.right; // NEW: Update save state
            }
        }
    }
    
    displayEchoGroup() {
        // Display three separate Echo sprites
        if (!this.spriteRight) return;
        
        // Clear and set up as echo group
        this.spriteRight.innerHTML = '';
        this.spriteRight.style.backgroundImage = '';
        this.spriteRight.classList.add('echo-group');
        this.spriteRight.style.display = 'flex';
        this.spriteRight.style.opacity = '0';
        
        // Create three echo sprites
        const echo1 = document.createElement('div');
        echo1.id = 'echo-1-sprite';
        echo1.className = 'echo-sprite';
        echo1.style.backgroundImage = "url('echo-1-sprite.png')";
        
        const echo2 = document.createElement('div');
        echo2.id = 'echo-2-sprite';
        echo2.className = 'echo-sprite';
        echo2.style.backgroundImage = "url('echo-2-sprite.png')";
        
        const despair = document.createElement('div');
        despair.id = 'despair-sprite';
        despair.className = 'echo-sprite';
        despair.style.backgroundImage = "url('despair-sprite.png')";
        
        // Add to container
        this.spriteRight.appendChild(echo1);
        this.spriteRight.appendChild(echo2);
        this.spriteRight.appendChild(despair);
        
        // Fade in
        setTimeout(() => {
            this.spriteRight.style.opacity = '1';
        }, 50);
        
        // Apply current growth stage if set
        // This preserves the stage when echoes are re-displayed
        if (this.currentEchoGrowthStage) {
            this.setEchoGrowthStage(this.currentEchoGrowthStage);
        } else {
            // Default to Act 1 if no stage set
            this.setEchoGrowthStage('act1');
        }
        
        console.log('Echo group displayed with three separate sprites');
    }
    
    setEchoGrowthStage(stage) {
        // Update Echo visual growth based on act progression
        // stage: 'act1', 'act2', or 'act3'
        
        // Store current stage so it persists when echoes are re-displayed
        this.currentEchoGrowthStage = stage;
        
        if (!this.spriteRight || !this.spriteRight.classList.contains('echo-group')) {
            console.log('Echo growth: No echo group active yet, stage stored for later');
            return;
        }
        
        // Remove all growth classes
        this.spriteRight.classList.remove('echo-growth-act1', 'echo-growth-act2', 'echo-growth-act3');
        
        // Add the appropriate class
        if (stage === 'act1') {
            this.spriteRight.classList.add('echo-growth-act1');
            console.log('Echo growth: Act 1 (75% height - Despair dominates)');
        } else if (stage === 'act2') {
            this.spriteRight.classList.add('echo-growth-act2');
            console.log('Echo growth: Act 2 (90% height - Hope rising)');
        } else if (stage === 'act3') {
            this.spriteRight.classList.add('echo-growth-act3');
            console.log('Echo growth: Act 3 (100% height - Balance achieved)');
        }
    }
    
    setActiveSpeaker(speaker) {
        if (!speaker) {
            // No speaker - remove all dims
            if (this.spriteLeft) this.spriteLeft.classList.remove('sprite-dim');
            if (this.spriteRight) this.spriteRight.classList.remove('sprite-dim');
            // Remove dims from individual Echoes
            const echoSprites = document.querySelectorAll('.echo-sprite');
            echoSprites.forEach(sprite => sprite.classList.remove('sprite-dim'));
            return;
        }
        
        const speakerName = speaker.toLowerCase(); // toLowerCase HERE, not in displayScene
        
        // Check if Echoes are displayed
        const echo1 = document.getElementById('echo-1-sprite');
        const echo2 = document.getElementById('echo-2-sprite');
        const despair = document.getElementById('despair-sprite');
        
        if (echo1 && echo2 && despair) {
            // Echoes are active - handle individual highlighting
            if (speakerName.includes('echo 1') || speakerName.includes('echo1')) {
                echo1.classList.remove('sprite-dim');
                echo2.classList.add('sprite-dim');
                despair.classList.add('sprite-dim');
                // Keep Tori bright if she's on left
                if (this.spriteLeft && this.currentSprites.left) {
                    this.spriteLeft.classList.add('sprite-dim');
                }
            } else if (speakerName.includes('echo 2') || speakerName.includes('echo2')) {
                echo1.classList.add('sprite-dim');
                echo2.classList.remove('sprite-dim');
                despair.classList.add('sprite-dim');
                if (this.spriteLeft && this.currentSprites.left) {
                    this.spriteLeft.classList.add('sprite-dim');
                }
            } else if (speakerName.includes('despair')) {
                echo1.classList.add('sprite-dim');
                echo2.classList.add('sprite-dim');
                despair.classList.remove('sprite-dim');
                if (this.spriteLeft && this.currentSprites.left) {
                    this.spriteLeft.classList.add('sprite-dim');
                }
            } else if (speakerName.includes('echoes')) {
                // All Echoes speaking together
                echo1.classList.remove('sprite-dim');
                echo2.classList.remove('sprite-dim');
                despair.classList.remove('sprite-dim');
                if (this.spriteLeft && this.currentSprites.left) {
                    this.spriteLeft.classList.add('sprite-dim');
                }
            } else if (speakerName.includes('tori')) {
                // Tori speaking - dim all Echoes
                echo1.classList.add('sprite-dim');
                echo2.classList.add('sprite-dim');
                despair.classList.add('sprite-dim');
                if (this.spriteLeft) this.spriteLeft.classList.remove('sprite-dim');
            } else if (speakerName.includes('narration') || speakerName.includes('system')) {
                // Narration - no dimming
                echo1.classList.remove('sprite-dim');
                echo2.classList.remove('sprite-dim');
                despair.classList.remove('sprite-dim');
                if (this.spriteLeft) this.spriteLeft.classList.remove('sprite-dim');
            }
            return;
        }
        
        // Standard sprite handling (no Echoes active)
        if (speakerName.includes('ronnie')) {
            // Ronnie speaking - left bright, right dim
            if (this.spriteLeft) this.spriteLeft.classList.remove('sprite-dim');
            if (this.spriteRight && this.currentSprites.right) {
                this.spriteRight.classList.add('sprite-dim');
            }
        } else if (speakerName.includes('tori')) {
            // Tori speaking - right bright, left dim
            if (this.spriteRight) this.spriteRight.classList.remove('sprite-dim');
            if (this.spriteLeft && this.currentSprites.left) {
                this.spriteLeft.classList.add('sprite-dim');
            }
        } else if (speakerName.includes('narration') || speakerName.includes('system')) {
            // Narration - no dimming
            if (this.spriteLeft) this.spriteLeft.classList.remove('sprite-dim');
            if (this.spriteRight) this.spriteRight.classList.remove('sprite-dim');
        }
    }
    
    clearAllSprites() {
        // NEW METHOD: Complete sprite cleanup
        // Remove sprites from DOM
        if (this.spriteLeft) {
            this.spriteLeft.style.opacity = '0';
            this.spriteLeft.style.display = 'none';
            this.spriteLeft.style.backgroundImage = '';
            this.spriteLeft.classList.remove('sprite-dim');
        }
        if (this.spriteRight) {
            this.spriteRight.style.opacity = '0';
            this.spriteRight.style.display = 'none';
            this.spriteRight.style.backgroundImage = '';
            this.spriteRight.classList.remove('sprite-dim');
        }
        
        // Clear tracking state
        this.currentSprites = { left: null, right: null };
        this.gameState.sprites = { left: null, right: null };
        
        console.log('All sprites cleared');
    }
    
    restoreSprites() {
        // NEW METHOD: Restore sprites from save state
        // Called when loading a game
        if (this.gameState.sprites) {
            if (this.gameState.sprites.left) {
                this.updateSprites({ left: this.gameState.sprites.left });
            }
            if (this.gameState.sprites.right) {
                this.updateSprites({ right: this.gameState.sprites.right });
            }
        }
    }
    
    hideAllSprites() {
        // OLD METHOD: Kept for backward compatibility
        // Use clearAllSprites() for complete cleanup
        if (this.spriteLeft) {
            this.spriteLeft.style.opacity = '0';
            setTimeout(() => {
                this.spriteLeft.style.display = 'none';
            }, 300);
        }
        if (this.spriteRight) {
            this.spriteRight.style.opacity = '0';
            setTimeout(() => {
                this.spriteRight.style.display = 'none';
            }, 300);
        }
        this.currentSprites = { left: null, right: null };
    }
    
    // ========================================
    // TYPEWRITER EFFECT WITH PAGINATION
    // UPDATED: Lowered threshold to 150 chars for mobile
    // ========================================
    
    typewriterText(element, text, callback, internalTextLength = 0) {
        // Check if instant mode is enabled
        const speed = this.getTypewriterSpeed();
        if (speed === 0) {
            // Instant mode - show all text immediately
            element.textContent = text;
            this.typewriterActive = false;
            if (callback) callback();
            return;
        }
        
        // Check if text needs pagination on mobile
        // Consider BOTH dialogue and internal text length
        const totalLength = text.length + internalTextLength;
        
        if (this.shouldPaginateText(totalLength)) {
            this.paginateAndDisplayText(element, text, callback);
        } else {
            // Original typewriter behavior for desktop/short text
            this.typewriterActive = true;
            this.fullDialogueText = text;
            this.typewriterCallback = callback;
            element.textContent = '';
            let i = 0;
            
            // Clear any existing interval
            if (this.typewriterInterval) {
                clearInterval(this.typewriterInterval);
            }
            
            this.typewriterInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(this.typewriterInterval);
                    this.typewriterInterval = null;
                    this.typewriterActive = false;
                    if (callback) callback();
                }
            }, speed);
        }
    }
    
    getTypewriterSpeed() {
        // Get speed from settings manager
        if (!this.settingsManager) {
            console.log('No settingsManager, returning default 30');
            return 30;
        }
        
        const speed = this.settingsManager.settings.textSpeed;
        const multiplier = this.settingsManager.speedMultipliers[speed];
        const delay = 30 * multiplier;
        const result = delay === 0 ? 0 : Math.max(1, delay);
        
        console.log('getTypewriterSpeed DEBUG:', {
            speed,
            multiplier,
            delay,
            result
        });
        
        return result;
    }
    
    shouldPaginateText(textLength) {
        // Only paginate on mobile portrait
        if (window.innerWidth > 480) return false;
        if (window.innerHeight < window.innerWidth) return false; // Landscape - no pagination
        
        // LOWERED THRESHOLD: 150 chars instead of 200 for tighter control
        // This ensures dialogue box never grows too tall on mobile portrait
        return textLength > 150;
    }
    
    paginateAndDisplayText(element, text, callback) {
        // Split text into pages that fit in mobile dialogue box
        this.dialoguePages = this.splitTextIntoPages(text, 150);
        this.currentDialoguePage = 0;
        this.paginationActive = true;
        this.typewriterCallback = callback;
        
        // Display first page
        this.displayDialoguePage(element);
    }
    
    splitTextIntoPages(text, charsPerPage) {
        const pages = [];
        let remainingText = text;
        
        while (remainingText.length > 0) {
            if (remainingText.length <= charsPerPage) {
                pages.push(remainingText);
                break;
            }
            
            let breakPoint = charsPerPage;
            
            // Look for sentence end within last 50 chars
            const sentenceEnd = remainingText.substring(0, charsPerPage).lastIndexOf('. ');
            if (sentenceEnd > charsPerPage - 50) {
                breakPoint = sentenceEnd + 2;
            } else {
                // Look for word boundary
                const lastSpace = remainingText.substring(0, charsPerPage).lastIndexOf(' ');
                if (lastSpace > charsPerPage - 30) {
                    breakPoint = lastSpace + 1;
                }
            }
            
            pages.push(remainingText.substring(0, breakPoint).trim());
            remainingText = remainingText.substring(breakPoint).trim();
        }
        
        return pages;
    }
    
    displayDialoguePage(element) {
        const currentPage = this.dialoguePages[this.currentDialoguePage];
        const speed = this.getTypewriterSpeed();
        
        // Add page indicator for multi-page dialogue
        const pageIndicator = (this.dialoguePages.length > 1) 
            ? ` [${this.currentDialoguePage + 1}/${this.dialoguePages.length}]`
            : '';
        
        // Check if instant mode
        if (speed === 0) {
            // Instant mode - show all text immediately
            element.textContent = currentPage + (this.dialoguePages.length > 1 ? pageIndicator : '');
            this.typewriterActive = false;
            return;
        }
        
        // Typewriter the current page
        this.typewriterActive = true;
        this.fullDialogueText = currentPage;
        element.textContent = '';
        let i = 0;
        
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
        }
        
        this.typewriterInterval = setInterval(() => {
            if (i < currentPage.length) {
                element.textContent += currentPage.charAt(i);
                i++;
            } else {
                // Add page indicator when typing finishes
                if (this.dialoguePages.length > 1) {
                    element.textContent += pageIndicator;
                }
                
                clearInterval(this.typewriterInterval);
                this.typewriterInterval = null;
                this.typewriterActive = false;
            }
        }, speed);
    }

    
    showNextDialoguePage() {
        this.currentDialoguePage++;
        
        if (this.currentDialoguePage >= this.dialoguePages.length) {
            // All pages shown - advance to next scene
            this.paginationActive = false;
            this.advance();
        } else {
            // Show next page
            this.displayDialoguePage(this.dialogueText);
        }
    }
    
    skipTypewriter() {
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
        }
        
        if (this.paginationActive) {
            // Show current page fully with indicator
            const currentPage = this.dialoguePages[this.currentDialoguePage];
            const pageIndicator = (this.dialoguePages.length > 1)
                ? ` [${this.currentDialoguePage + 1}/${this.dialoguePages.length}]`
                : '';
            this.dialogueText.textContent = currentPage + pageIndicator;
        } else {
            // Show full text
            this.dialogueText.textContent = this.fullDialogueText;
        }
        
        this.typewriterActive = false;
        
        // Execute callback if exists
        if (this.typewriterCallback) {
            this.typewriterCallback();
            this.typewriterCallback = null;
        }
    }
    
    handleDialogueClick() {
        // If pagination is active, show next page
        if (this.paginationActive && !this.typewriterActive) {
            this.showNextDialoguePage();
            return;
        }
        
        // If typing is active, skip to full text
        if (this.typewriterActive) {
            this.skipTypewriter();
        }
        // If text is fully displayed, advance to next scene
        else {
            this.advance();
        }
    }
    
    advance() {
        // Don't advance if choices are showing
        if (this.choiceMenu.style.display === 'block') return;
        
        if (this.currentScene && this.currentScene.next) {
            this.currentScene.next();
        }
    }
    
    showChoices(choices, onChoice) {
        this.choicesContainer.innerHTML = '';
        this.choiceMenu.style.display = 'block';
        
        choices.forEach(choice => {
            const button = document.createElement('div');
            button.className = 'choice-option';
            button.textContent = choice.text;
            
            if (choice.locked || choice.disabled) {
                button.classList.add('locked');
            } else {
                button.addEventListener('click', () => {
                    this.choiceMenu.style.display = 'none';
                    if (onChoice) onChoice(choice.value);
                });
            }
            
            this.choicesContainer.appendChild(button);
        });
    }
    
    // ========================================
    // ECHO DISPLAY (TORI ROUTE)
    // ========================================
    
    // displayEchoes and clearEchoes removed - now using three-echoes-sprite.png
    
    // ========================================
    // NOTES SYSTEM
    // ========================================
    
    showNotes() {
        if (!this.currentRoute || !this.currentRoute.collectedNotes) return;
        
        this.notesViewer.style.display = 'block';
        this.notesList.innerHTML = '';
        
        const allNotes = this.currentRoute.allNotes;
        const collected = this.currentRoute.collectedNotes;
        
        Object.keys(allNotes).forEach(noteId => {
            const note = allNotes[noteId];
            const isCollected = collected[note.type].includes(noteId);
            
            const noteItem = document.createElement('div');
            noteItem.className = `note-item ${note.type}-note`;
            if (!isCollected) noteItem.classList.add('note-locked');
            
            const title = document.createElement('div');
            title.className = 'note-title';
            title.textContent = isCollected ? note.title : '???';
            noteItem.appendChild(title);
            
            if (isCollected) {
                const content = document.createElement('div');
                content.className = 'note-content';
                content.textContent = note.content;
                noteItem.appendChild(content);
                
                noteItem.addEventListener('click', () => {
                    noteItem.classList.toggle('expanded');
                });
            }
            
            this.notesList.appendChild(noteItem);
        });
    }
    
    // ========================================
    // CREDITS
    // ========================================
    
    showCredits(trueEnding = false) {
        const creditsScreen = document.getElementById('credits-screen');
        if (!creditsScreen) {
            console.error('Credits screen element not found');
            return;
        }
        
        // Initialize credits state
        this.currentCreditIndex = 0;
        this.totalCredits = 13; // 0-12 inclusive
        
        // If true ending, update credit-11 with version number
        if (trueEnding && this.loopStatus === 'succeeded') {
            this.updateVersionCredit();
        }
        
        // Hide all other UI
        this.gameView.style.display = 'none';
        this.mainMenu.style.display = 'none';
        
        // Show credits screen
        creditsScreen.style.display = 'flex';
        
        // Show first credit screen
        this.displayCreditScreen(0);
    }
    
    updateVersionCredit() {
        // Update credit-11 to show the successful version number
        const versionTitle = document.getElementById('version-credit-title');
        const versionText = document.getElementById('version-credit-text');
        
        if (versionTitle) {
            versionTitle.textContent = `VERSION ${this.loopVersion}`;
        }
        
        if (versionText) {
            versionText.innerHTML = `The timeline that succeeded.<br><br>The loop that closed.<br><br>The Old Man never has to go back.`;
        }
        
        console.log(`✨ Credits updated with VERSION ${this.loopVersion} success screen`);
    }
    
    displayCreditScreen(index) {
        // Hide all credit screens
        const allScreens = document.querySelectorAll('.credit-screen');
        allScreens.forEach(screen => {
            screen.style.display = 'none';
            screen.classList.remove('active');
        });
        
        // Show current screen with fade-in
        const currentScreen = document.getElementById(`credit-${index}`);
        if (currentScreen) {
            currentScreen.style.display = 'flex';
            // Trigger fade-in animation
            setTimeout(() => {
                currentScreen.classList.add('active');
            }, 50);
        }
        
        // Update next button text (change to "BACK TO MENU" on last screen)
        const nextButton = document.getElementById('next-credits');
        if (nextButton) {
            if (index >= this.totalCredits - 1) {
                nextButton.textContent = 'BACK TO MENU';
                nextButton.style.display = 'block';
            } else {
                nextButton.textContent = 'NEXT >';
                nextButton.style.display = 'block';
            }
        }
    }
    
    nextCredit() {
        this.currentCreditIndex++;
        
        if (this.currentCreditIndex >= this.totalCredits) {
            // Credits finished - return to main menu
            this.closeCredits();
        } else {
            // Show next credit screen
            this.displayCreditScreen(this.currentCreditIndex);
        }
    }
    
    closeCredits() {
        const creditsScreen = document.getElementById('credits-screen');
        if (creditsScreen) {
            creditsScreen.style.display = 'none';
        }
        
        // Return to main menu
        this.mainMenu.style.display = 'flex';
        this.mainMenu.style.opacity = '1';
        
        // Reset credits state
        this.currentCreditIndex = 0;
    }
    
    // ========================================
    // SAVE/LOAD SYSTEM METHODS
    // ========================================
    
    resumeGame() {
        this.saveLoadUI.hidePauseMenu();
    }
    
    showSaveLoadScreen(mode) {
        this.saveLoadUI.showSaveLoadScreen(mode);
    }
    
    closeSaveLoadScreen() {
        this.saveLoadUI.closeSaveLoadScreen();
    }
    
    setSaveLoadMode(mode) {
        this.saveLoadUI.setSaveLoadMode(mode);
    }
    
    handleSaveSlotClick(slotId) {
        this.saveLoadUI.handleSaveSlotClick(slotId);
    }
    
    deleteSaveSlot(slotNumber) {
        this.saveLoadUI.deleteSaveSlot(slotNumber);
    }
    
    confirmAction(confirmed) {
        this.saveLoadUI.confirmAction(confirmed);
    }
    
    returnToMainMenu() {
        // Clear sprites when returning to main menu
        this.clearAllSprites();
        
        // Clear route-specific dialogue frame
        this.clearDialogueFrame();
        
        // Reset background state
        this.currentBackground = null;
        
        // Hide Tori-specific UI elements
        if (this.tetherUI) this.tetherUI.style.display = 'none';
        if (this.notesButton) this.notesButton.style.display = 'none';
        // Echo display removed - handled by sprite now
        
        // Hide backlog button
        const backlogButton = document.getElementById('backlog-button');
        if (backlogButton) backlogButton.style.display = 'none';
        
        // Stop tether decay if in Tori's route
        if (this.currentRoute) {
            // Or if route has tetherSystem object
            if (this.currentRoute.tetherSystem && this.currentRoute.tetherSystem.stopDecay) {
                this.currentRoute.tetherSystem.stopDecay();
            }
        }
        
        this.saveLoadUI.returnToMainMenu();
    }
    
    // ========================================
    // STANDALONE NOTES VIEWER (MAIN MENU)
    // ========================================
    
    showStandaloneNotes() {
        // Reload notes from localStorage (in case new ones unlocked)
        this.standaloneNotesViewer = new StandaloneNotesViewer(this);
        this.standaloneNotesViewer.show();
    }
    
    closeStandaloneNotes() {
        this.standaloneNotesViewer.close();
    }
    
    // ========================================
    // SETTINGS SYSTEM
    // ========================================
    
    showSettings() {
        const settingsMenu = document.getElementById('settings-menu');
        console.log('showSettings called, element:', settingsMenu);
        if (settingsMenu) {
            settingsMenu.style.display = 'flex';
            console.log('Settings menu display set to flex');
        } else {
            console.error('Settings menu element not found!');
        }
    }
    
    closeSettings() {
        const settingsMenu = document.getElementById('settings-menu');
        if (settingsMenu) {
            settingsMenu.style.display = 'none';
        }
    }
    
    resetSettings() {
        if (this.settingsManager && this.settingsManager.reset) {
            this.settingsManager.reset();
        } else {
            // Manual reset if method doesn't exist
            localStorage.removeItem('gameSettings');
            location.reload();
        }
    }
    
    // ========================================
    // BACKLOG SYSTEM
    // ========================================
    
    addToDialogueHistory(entry) {
        this.dialogueHistory.push(entry);
        
        // Keep only last maxHistoryLength entries
        if (this.dialogueHistory.length > this.maxHistoryLength) {
            this.dialogueHistory.shift();
        }
    }
    
    openBacklog() {
        const backlogScreen = document.getElementById('backlog-screen');
        const backlogList = document.getElementById('backlog-list');
        
        if (!backlogScreen || !backlogList) return;
        
        // Clear previous content
        backlogList.innerHTML = '';
        
        if (this.dialogueHistory.length === 0) {
            backlogList.innerHTML = '<p class="backlog-empty">No dialogue history yet.</p>';
        } else {
            // Display history in chronological order (oldest first)
            this.dialogueHistory.forEach((entry, index) => {
                const entryDiv = document.createElement('div');
                entryDiv.className = 'backlog-entry';
                
                const characterSpan = document.createElement('div');
                characterSpan.className = 'backlog-character';
                characterSpan.textContent = entry.character;
                
                const dialogueSpan = document.createElement('div');
                dialogueSpan.className = 'backlog-dialogue';
                dialogueSpan.textContent = entry.dialogue;
                
                entryDiv.appendChild(characterSpan);
                entryDiv.appendChild(dialogueSpan);
                
                if (entry.internal) {
                    const internalSpan = document.createElement('div');
                    internalSpan.className = 'backlog-internal';
                    internalSpan.textContent = entry.internal;
                    entryDiv.appendChild(internalSpan);
                }
                
                backlogList.appendChild(entryDiv);
            });
            
            // Scroll to bottom (most recent)
            setTimeout(() => {
                backlogList.scrollTop = backlogList.scrollHeight;
            }, 100);
        }
        
        backlogScreen.style.display = 'flex';
    }
    
    closeBacklog() {
        const backlogScreen = document.getElementById('backlog-screen');
        if (backlogScreen) {
            backlogScreen.style.display = 'none';
        }
    }
    
    // ========================================
    // DEV COMMANDS
    // ========================================
    
    resetVersion(targetVersion = 848, status = 'attempting') {
        // DEV COMMAND: Reset loop version
        // Usage in console: game.resetVersion(848)
        this.loopVersion = parseInt(targetVersion);
        this.loopStatus = status;
        
        localStorage.setItem('loopVersion', this.loopVersion.toString());
        localStorage.setItem('loopStatus', this.loopStatus);
        
        this.updateTitleScreen();
        
        console.log(`🔧 DEV: Version reset to ${this.loopVersion}, status: ${this.loopStatus}`);
        console.log(`💡 Refresh page to see changes!`);
        
        return this.loopVersion;
    }
    
    devCommands() {
        // DEV COMMAND: Show available dev commands
        console.log(`
╔═══════════════════════════════════════╗
║       VN - ZEE DEV COMMANDS          ║
╚═══════════════════════════════════════╝

📋 Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

game.resetVersion(848)
  → Reset to VERSION 848

game.resetVersion(849)  
  → Set to VERSION 849

game.resetVersion(848, 'succeeded')
  → Reset to 848 with True Ending status

game.resetVersion(848, 'accepted')
  → Reset to 848 with Digital Forever status

game.devCommands()
  → Show this help menu

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 After using commands, refresh the page!
        `);
    }
    
    continueGame() {
        const mostRecent = this.saveManager.getMostRecentSave();
        if (mostRecent) {
            this.saveManager.restoreGameState(mostRecent.data);
            // NEW: Restore sprites after loading
            this.restoreSprites();
        } else {
            this.saveManager.showSaveIndicator('No save data found', true);
        }
    }
    
    // ========================================
    // FULLSCREEN TOGGLE
    // ========================================
    
    toggleFullscreen() {
        const button = document.getElementById('fullscreen-button');
        
        // Check if already in fullscreen
        const isFullscreen = document.fullscreenElement || 
                            document.webkitFullscreenElement || 
                            document.mozFullScreenElement || 
                            document.msFullscreenElement;
        
        if (isFullscreen) {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } else {
            // Enter fullscreen
            const element = document.documentElement;
            
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }
        
        // Update button text after a short delay (fullscreen API is async)
        setTimeout(() => {
            this.updateFullscreenButton();
        }, 100);
    }
    
    updateFullscreenButton() {
        const button = document.getElementById('fullscreen-button');
        if (!button) return;
        
        const isFullscreen = document.fullscreenElement || 
                            document.webkitFullscreenElement || 
                            document.mozFullScreenElement || 
                            document.msFullscreenElement;
        
        button.textContent = isFullscreen ? 'EXIT FULLSCREEN' : 'ENTER FULLSCREEN';
    }

    // ========================================
    // ESC HINT (DESKTOP USERS)
    // ========================================
    
    showEscHintBriefly() {
        // Only show on desktop (not mobile)
        if (this.isMobile) return;
        
        const escHint = document.getElementById('esc-hint');
        if (!escHint) return;
        
        // Show hint
        escHint.classList.add('visible');
        
        // Hide after 4 seconds
        setTimeout(() => {
            escHint.classList.remove('visible');
        }, 4000);
    }
    
    // ========================================
    // BACKGROUND CROSSFADE SYSTEM
    // ========================================
    
    crossfadeBackground(newBackground) {
        // Skip if same background
        if (this.currentBackground === newBackground) return;
        
        // Fallback: if alt layer doesn't exist, just set directly
        if (!this.sceneBackgroundAlt) {
            this.sceneBackground.style.backgroundImage = `url(${newBackground})`;
            this.currentBackground = newBackground;
            return;
        }
        
        // Determine which layer to use
        const incoming = this.useAltBackground ? this.sceneBackground : this.sceneBackgroundAlt;
        const outgoing = this.useAltBackground ? this.sceneBackgroundAlt : this.sceneBackground;
        
        // Set new background on incoming layer
        incoming.style.backgroundImage = `url(${newBackground})`;
        
        // Crossfade: fade in incoming, fade out outgoing
        incoming.style.opacity = '1';
        outgoing.style.opacity = '0';
        
        // Toggle for next transition
        this.useAltBackground = !this.useAltBackground;
        this.currentBackground = newBackground;
    }
    
    // ========================================
    // ROUTE-SPECIFIC DIALOGUE FRAME & UI THEMING
    // ========================================
    
    setDialogueFrame(routeName) {
        // Remove existing route classes from all UI elements
        this.dialogueBox.classList.remove('ronnie-route', 'tori-route', 'prologue-style', 'epilogue-style');
        if (this.pauseButton) this.pauseButton.classList.remove('ronnie-route', 'tori-route');
        if (this.pauseContent) this.pauseContent.classList.remove('ronnie-route', 'tori-route');
        if (this.notesButton) this.notesButton.classList.remove('tori-route');
        if (this.notesViewer) this.notesViewer.classList.remove('tori-route');
        
        // Apply route-specific theming to all UI
        if (routeName === 'ronnie') {
            this.dialogueBox.classList.add('ronnie-route');
            if (this.pauseButton) this.pauseButton.classList.add('ronnie-route');
            if (this.pauseContent) this.pauseContent.classList.add('ronnie-route');
        } else if (routeName === 'tori') {
            this.dialogueBox.classList.add('tori-route');
            if (this.pauseButton) this.pauseButton.classList.add('tori-route');
            if (this.pauseContent) this.pauseContent.classList.add('tori-route');
            if (this.notesButton) this.notesButton.classList.add('tori-route');
            if (this.notesViewer) this.notesViewer.classList.add('tori-route');
        }
        
        console.log(`UI theme set: ${routeName}`);
    }
    
    clearDialogueFrame() {
        this.dialogueBox.classList.remove('ronnie-route', 'tori-route', 'prologue-style', 'epilogue-style');
        if (this.pauseButton) this.pauseButton.classList.remove('ronnie-route', 'tori-route');
        if (this.pauseContent) this.pauseContent.classList.remove('ronnie-route', 'tori-route');
        if (this.notesButton) this.notesButton.classList.remove('tori-route');
        if (this.notesViewer) this.notesViewer.classList.remove('tori-route');
    }

    // ========================================
    // MOBILE DETECTION & INTERNAL BUBBLES
    // ========================================

    isMobilePortrait() {
        // Check if device is mobile in portrait orientation
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isPortrait = window.innerHeight > window.innerWidth;
        return isMobile && isPortrait;
    }

    createInternalBubble(text, characterPosition = 'center') {
        // UNIVERSAL BUBBLE SYSTEM - Works on all platforms
        
        // Remove any existing bubbles first (defensive cleanup)
        const existingBubbles = document.querySelectorAll('.internal-bubble');
        existingBubbles.forEach(bubble => bubble.remove());
        
        // Create new bubble element
        const bubble = document.createElement('div');
        bubble.className = 'internal-bubble';
        
        // Add position class based on which character is speaking/thinking
        if (characterPosition === 'left') {
            bubble.classList.add('left-character');
        } else if (characterPosition === 'right') {
            bubble.classList.add('right-character');
        } else {
            bubble.classList.add('center');
        }
        
        // Set text content
        bubble.textContent = text;
        
        // Add to DOM
        document.body.appendChild(bubble);
        
        // STORE REFERENCE - managed by scene lifecycle, not timer
        this.currentBubble = bubble;
        
        console.log(`Internal bubble created: ${text.substring(0, 30)}...`);
    }
    
    removeInternalBubble() {
        // Remove tracked bubble
        if (this.currentBubble && this.currentBubble.parentNode) {
            this.currentBubble.remove();
            this.currentBubble = null;
        }
        
        // Also clean up any orphaned bubbles (defensive)
        const existingBubbles = document.querySelectorAll('.internal-bubble');
        existingBubbles.forEach(bubble => bubble.remove());
    }

    determineCharacterPosition(sceneData) {
        // SMART BUBBLE POSITIONING using persistent sprite tracking
        
        if (!sceneData.character) return 'center';
        
        const charName = sceneData.character.toLowerCase();
        
        // ========================================
        // METHOD 1: Character name + sprite tracking (MOST ACCURATE)
        // ========================================
        
        // Extract base character name (remove modifiers like "internal", "thinking", etc.)
        let baseCharacter = null;
        if (charName.includes('tori')) {
            baseCharacter = 'tori';
        } else if (charName.includes('ronnie')) {
            baseCharacter = 'ronnie';
        }
        
        // If we identified the character, check where their sprite actually is
        if (baseCharacter) {
            // Check if this character's sprite is on the left
            if (this.currentSprites.left && this.currentSprites.left.toLowerCase().includes(baseCharacter)) {
                return 'left';
            }
            // Check if this character's sprite is on the right
            if (this.currentSprites.right && this.currentSprites.right.toLowerCase().includes(baseCharacter)) {
                return 'right';
            }
        }
        
        // ========================================
        // METHOD 2: Narration - position based on who's visible
        // ========================================
        
        if (charName.includes('narration')) {
            // If only one sprite is visible, put bubble near it
            const leftVisible = this.currentSprites.left !== null;
            const rightVisible = this.currentSprites.right !== null;
            
            if (leftVisible && !rightVisible) return 'left';
            if (rightVisible && !leftVisible) return 'right';
            // If both or neither visible, default to center
            return 'center';
        }
        
        // ========================================
        // METHOD 3: Fallback to any visible sprite
        // ========================================
        
        // If we couldn't determine position but sprites exist, pick the first visible one
        if (this.currentSprites.left !== null) return 'left';
        if (this.currentSprites.right !== null) return 'right';
        
        // ========================================
        // METHOD 4: Default center (no sprites visible)
        // ========================================
        
        return 'center';
    }
    
    fixMobileSpritePositioning() {
        // Force sprite positioning on mobile via inline styles
        const isPortrait = window.innerHeight > window.innerWidth;
        const dialogueHeight = isPortrait ? '30vh' : '35vh';
        
        if (this.spriteLeft) {
            this.spriteLeft.style.bottom = dialogueHeight;
            this.spriteLeft.style.top = 'auto';
            this.spriteLeft.style.height = 'auto';
        }
        if (this.spriteRight) {
            this.spriteRight.style.bottom = dialogueHeight;
            this.spriteRight.style.top = 'auto';
            this.spriteRight.style.height = 'auto';
        }
    }
}
